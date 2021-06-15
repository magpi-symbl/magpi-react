import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
import { UPLOAD } from "../config/app-constants";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

class Firebase {
  constructor(props) {
    if (!app.apps.length) {
      app.initializeApp(config);
    }
    this.auth = app.auth();
    this.fireStore = app.firestore();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.storage = app.storage();
  }
  /**
   * This method used for get current user object
   * @returns current user object
   */
  currentUser() {
    return this.auth.currentUser;
  }
  /**
   * This method used for login as google
   */
  async googleCalendarLogin(calendarProvider) {
    const response = await this.auth.signInWithPopup(calendarProvider);
    localStorage.setItem("accessKey", response.credential.accessToken);
  }

  /**
   * This method used for login as google
   */
  gCalendarLogin(calendarProvider) {
    this.auth
      .signInWithPopup(calendarProvider)
      .then((result) => {
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        localStorage.setItem("accessKey", token);
        // The signed-in user info.
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        console.log(
          "Error While Sign in ==" +
            errorCode +
            ":: Error Message=" +
            errorMessage
        );
      });
  }

  /**
   * This method used for create calendar provider
   */
  createCalendarProvider() {
    const calendarProvider = new app.auth.GoogleAuthProvider();
    calendarProvider.addScope("openid");
    calendarProvider.addScope(
      "https://www.googleapis.com/auth/calendar.events.owned.readonly"
    );
    return calendarProvider;
  }

  /**
   * This method used to add
   */
  async addTranscriptInFireStore(transcript) {
    try {
      return await this.fireStore
        .doc(`transcripts/${transcript.transcriptId}`)
        .set(transcript);
    } catch (error) {
      return null;
    }
  }
  /**
   * This method used for get uploaded transcripts
   * @returns return transcripts list
   */
  fetchUploadTranscripts(userId) {
    const transcripts = this.fireStore
      .collection("transcripts")
      .where("source", "==", UPLOAD)
      .where("userId", "==", userId);
    return transcripts;
  }

  /**
   * This method used for get transcript by ID
   * @returns return transcript data
   */
  async fetchTranscriptById(transcriptId) {
    return await this.fireStore
      .collection("transcripts")
      .doc(transcriptId)
      .get();
  }

  /**
   * This method used for delete transcript by ID
   * @returns return transcript data
   */
  async deleteTranscriptById(transcriptId) {
    return await this.fireStore
      .collection("transcripts")
      .doc(transcriptId)
      .delete();
  }

  /**
   * This method used for sign out
   */
  async signOut() {
    localStorage.removeItem("accessKey");
    localStorage.removeItem("token");
    await this.auth.signOut();
  }

  /**
   * This method used for update transcript by ID
   * @returns return transcript data
   *
   */
  async updateTranscript(transcriptId, updateObj) {
    return await this.fireStore
      .doc(`transcripts/${transcriptId}`)
      .update(updateObj);
  }

  /**
   * This method used for get all transcripts
   * @returns return transcripts list
   */
  fetchTranscripts(userId) {
    const transcripts = this.fireStore
      .collection("transcripts")
      .where("userId", "==", userId);
    return transcripts;
  }
  /**
   * This method used for get zoom user id
   * @returns return connections list
   */
  async fetchZoomUserByUID(userId) {
    const zoomUser = await this.fireStore
      .collection("zoom_users")
      .where("googleUserId", "==", userId)
      .get();
    return zoomUser;
  }

  /**
   * This method used for delete zoom user id
   * @returns return connections list
   */
  async deleteZoomUserByUID(userId) {
    const zoomUser = await this.fireStore
      .collection("zoom_users")
      .where("googleUserId", "==", userId)
      .get();
    const data = zoomUser.docs.map((doc) => doc.ref);
    for (let i = 0; i < data.length; i++) {
      await data[i].delete();
    }
  }

  //Handle waiting to upload each file using promise
  async uploadTranscriptFileAsPromise(fileType, file, transcriptId) {
    return new Promise((resolve, reject) => {
      const uploadTask = this.storage
        .ref("transcript")
        .child(fileType)
        .child(transcriptId)
        .put(file);
      uploadTask.on(
        "state_changed",
        () => {},
        (err) => {
          reject(err);
        },
        async () => {
          resolve({
            videoUrl: await uploadTask.snapshot.ref.getDownloadURL(),
          });
        }
      );
    });
  }
}

export default Firebase;
