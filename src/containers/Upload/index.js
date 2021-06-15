/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, Fragment } from "react";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { API } from "../../utils/api";
import {
  POST_AUDIO,
  POST_VIDEO,
  CONVERSATION_EXPERIENCES,
  WEB_HOOK_URL,
} from "../../config/api-constant";
import Notification from "../../components/notification";
import musicIcon from "../../assets/mp3.svg";
import videoIcon from "../../assets/m4a.svg";

import LinearProgress from "@material-ui/core/LinearProgress";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { v4 } from "uuid";
import "./index.css";
import {
  PROCESSED,
  IN_PROGRESS,
  UPLOAD,
  SYMBL_API_LANGUAGE_CODE,
  SYMBL_API_SPEAKER_COUNT,
  FILE_TYPE,
  FILE_SIZE,
  MAX_FILE_SIZE,
  MAX_FILE,
  ACCEPTED_FILES,
  CONVERSATION_EXPERIENCES_PARAMETER,
  FAILED,
  VIDEO_SUMMERY,
} from "../../config/app-constants";
import CalendarToday from "@material-ui/icons/CalendarToday";
import Clock from "@material-ui/icons/Watch";
import * as moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MeetingDate from "../../assets/Trans_Meeting_date.svg";
import MeetingTime from "../../assets/trans_Meeting_time.svg";
import TranscriptTime from "../../assets/Transcript_Time.svg";
import Complete from "../../assets/Complete.svg";
import ErrorIcon from "../../assets/Error.svg";
import ProgressIcon from "../../assets/progress.svg";
import DeleteIcon from "../../assets/Delete.svg";

const Upload = ({ firebase, history, onlyUpload = false, setMessageObj }) => {
  const [transcripts, setTranscripts] = useState([]);

  const context = new AudioContext();

  useEffect(() => {
    if (!onlyUpload) {
      fetchUploadTranscripts();
    }
  }, []);
  const api = new API(setMessageObj);
  const [deleteObj, setDeleteObj] = useState({
    openAlert: false,
    deleteId: undefined,
  });

  const [isUploading, setIsUploading] = useState(false);

  const fetchUploadTranscripts = async () => {
    const user = firebase.currentUser();
    const transcripts = firebase
      .fetchUploadTranscripts(user.uid)
      .orderBy("created_date", "desc");
    transcripts.onSnapshot((transcriptsSnapshot) => {
      const data = transcriptsSnapshot.docs.map((doc) => doc.data());
      setTranscripts(data);
    });
  };
  /**
   * This method used for upload files
   * @param {} files files array
   */
  const handleChange = (files) => {
    if (files && files.length && !isUploading) {
      uploadFile(files);
    }
  };
  /**
   * This method used to upload audio/video files in symbl ai.
   * @param file File object
   * @param fileType File type
   */
  const uploadFile = async (files) => {
    if (files.length) {
      setIsUploading(true);
    }
    const uploadInfo = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i].file;
      const fileType = getFileType(file);
      const queryString = api.objToQueryString({
        webhookUrl: WEB_HOOK_URL,
        languageCode: SYMBL_API_LANGUAGE_CODE,
        enableAllTrackers: true,
        enableSpeakerDiarization: true,
        diarizationSpeakerCount: SYMBL_API_SPEAKER_COUNT,
        detectActionPhraseForMessages: true,
      });
      const buffer = await readAsArrayBuffer(file);
      const bufferFoAudio = await readAsArrayBuffer(file);
      const fileBuffer = await context.decodeAudioData(bufferFoAudio);
      const fileDuration =
        `${(fileBuffer.duration / 60).toFixed(2)} mins` || "2 mins";
      const customHeaders = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "x-api-key": localStorage.getItem("token"),
        "Content-Type": file.type,
      };
      uploadInfo.push({
        url: `${
          fileType === FILE_TYPE.AUDIO ? `${POST_AUDIO}` : `${POST_VIDEO}`
        }?${queryString}`,
        buffer,
        customHeaders,
        file,
        fileType,
        transcriptId: v4(),
        fileDuration,
      });
    }
    try {
      const symblUpload = Promise.all([
        ...uploadInfo.map(({ url, buffer, customHeaders }) =>
          api.uploadPost(url, buffer, customHeaders)
        ),
      ]);
      const firebaseUpload = Promise.all([
        ...uploadInfo.map(({ fileType, file, transcriptId }) =>
          firebase.uploadTranscriptFileAsPromise(fileType, file, transcriptId)
        ),
      ]);
      const result = await Promise.all([symblUpload, firebaseUpload]);
      if (result && result[0].length) {
        const user = firebase.currentUser();
        for (let i = 0; i < result[0].length; i++) {
          const transcript = {
            transcriptId: uploadInfo[i].transcriptId,
            userId: user.uid,
            conversationId: result[0][i].conversationId,
            jobId: result[0][i].jobId,
            status: IN_PROGRESS,
            videoUrl: result[1][i].videoUrl,
            duration: uploadInfo[i].fileDuration,
            created_date: Date.now(),
            updated_date: Date.now(),
            fileName: uploadInfo[i].file.name.split(".").slice(0, -1).join("."),
            fileSize: formatBytes(uploadInfo[i].file.size),
            source: UPLOAD,
            fileType: getFileType(uploadInfo[i].file),
          };
          await firebase.addTranscriptInFireStore(transcript);
          const expResult = await callExperienceAPI(
            result[0][i].conversationId,
            result[1][i].videoUrl
          );
          if (expResult) {
            await updateTranscript(transcript.transcriptId, {
              experienceUrl: expResult.url,
            });
          }
        }
        setMessageObj({
          openAlert: true,
          severity: "success",
          alertMessage: "File uploaded successfully.",
        });
        setIsUploading(false);
      }
    } catch (error) {
      setMessageObj({
        openAlert: true,
        severity: "error",
        alertMessage: error.message,
      });
    }
  };

  const callExperienceAPI = async (conversationId, videoUrl) => {
    const ExpCustomHeaders = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "x-api-key": localStorage.getItem("token"),
      "Content-Type": "application/json",
    };
    const expResult = await api.post(
      `${CONVERSATION_EXPERIENCES.replace("{conversationId}", conversationId)}`,
      {
        ...CONVERSATION_EXPERIENCES_PARAMETER,
        ...{
          name: VIDEO_SUMMERY,
          videoUrl: videoUrl,
        },
      },
      ExpCustomHeaders
    );
    return expResult;
  };

  const readAsArrayBuffer = (file) => {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", async (event) => {
        const buffer = event.target.result;
        resolve(buffer);
      });
      fileReader.readAsArrayBuffer(file);
    });
  };

  /**
   * This method used to check file type
   * @param file File object
   */
  const getFileType = (file) => {
    if (file.type.match("video.*")) return FILE_TYPE.VIDEO;

    if (file.type.match("audio.*")) return FILE_TYPE.AUDIO;
    return FILE_TYPE.OTHER;
  };

  /**
   * This method used for get files in bytes
   * @param {number} bytes
   * @param {number} decimals
   * @returns
   */
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = FILE_SIZE;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  /**
   * This method used for delete transcript
   */
  const deleteTranscript = async () => {
    await firebase.deleteTranscriptById(deleteObj.deleteId);
    setMessageObj({
      openAlert: true,
      severity: "success",
      alertMessage: "Delete successfully.",
    });
    setDeleteObj({
      openAlert: false,
      deleteId: undefined,
    });
  };

  /**
   * This method used for open click transcript file
   * @param conversationId
   */

  const openTranscriptFile = async ({ transcriptId }) => {
    history.push(`transcript-view/${transcriptId}`);
  };

  /**
   * Update transcript url
   * @param transcriptId
   * @param updateObject
   */

  const updateTranscript = async (transcriptId, updateObject, index) => {
    await firebase.updateTranscript(transcriptId, updateObject);
  };
  /**
   * Custom browse icon
   */
  const CustomBrowseIcon = () => (
    <Button color="primary" className="uploadBtnSection" color="primary">
      Browse Files
    </Button>
  );
  console.log(transcripts, "transcripts");
  return (
    <main className="main-wrapper">
      <div className="upload-section-container">
        {/* <p className="img-container">
                    <img src={musicIcon} alt="musicIcon" />
                </p> */}
        <div>
          <h3>Upload your meeting file </h3>
          <p>File should be MP3,MP4 and WAV</p>
        </div>
        <div className="file-upload-section">
          {isUploading && (
            <Fragment>
              <LinearProgress className="upload-loader" />
              <div className="upload-overlay"></div>
            </Fragment>
          )}
          <DropzoneAreaBase
            Icon={CustomBrowseIcon}
            acceptedFiles={ACCEPTED_FILES}
            dropzoneText={"Drag and drop file here"}
            onAdd={handleChange}
            filesLimit={MAX_FILE}
            showAlerts={["error", "info"]}
            showPreviews={false}
            maxFileSize={MAX_FILE_SIZE}
            dropzoneClass={"uploadSection"}
          />
        </div>
        {!onlyUpload && (
          <ul>
            {transcripts.map(
              ({
                fileName,
                fileSize,
                transcriptId,
                status,
                fileType,
                created_date,
                duration,
              }) => {
                return (
                  <Fragment key={transcriptId}>
                    <div className="meting-block-wrapper upload-list-section headerrowCss headerrowCssNew">
                      <p
                        onClick={(e) => {
                          e.preventDefault();
                          if (status === PROCESSED) {
                            openTranscriptFile({
                              transcriptId,
                            });
                          }
                        }}
                      >
                        {" "}
                        {fileType === "audio" && (
                          <img src={musicIcon} alt="musicIcon" width={25} />
                        )}
                        {fileType === "video" && (
                          <img src={videoIcon} alt="videoIcon" width={25} />
                        )}
                      </p>
                      <p
                        className="fullFlex"
                        onClick={(e) => {
                          e.preventDefault();
                          if (status === PROCESSED) {
                            openTranscriptFile({
                              transcriptId,
                            });
                          }
                        }}
                      >
                        <div className="upload-title">
                          {fileName}
                          <p className="inner-upload-title ml0">
                            <span className="transaction-section-upload">
                              {String(fileSize || " ").toLowerCase()}
                            </span>
                            <p className="transaction-section-upload ml-50">
                              <img
                                src={TranscriptTime}
                                className="svgIcon transcriptIcon"
                              />
                              <span>{duration}</span>
                            </p>
                          </p>
                        </div>
                      </p>
                      <div
                        className="status-heading-section right-align pointer"
                        style={{ marginTop: 13, marginRight: 20 }}
                      >
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            if (status === PROCESSED) {
                              openTranscriptFile({
                                transcriptId,
                              });
                            }
                          }}
                          className={status}
                        >
                          {status.replaceAll(/_/gi, " ")}
                          {status === PROCESSED && (
                            <span
                              className="status-icon"
                              style={{
                                color:
                                  status === PROCESSED ? "#4bb543" : "#eee",
                              }}
                            >
                              <img src={Complete} className="svgIcon" />
                            </span>
                          )}
                          {status === FAILED && (
                            <span
                              className="status-icon"
                              style={{
                                color: status === FAILED ? "#E53055" : "#eee",
                              }}
                            >
                              <img src={ErrorIcon} className="svgIcon" />
                            </span>
                          )}
                          {status === IN_PROGRESS && (
                            <span
                              className="status-icon"
                              style={{
                                color:
                                  status === IN_PROGRESS ? "#F5E617" : "#eee",
                              }}
                            >
                              <img src={ProgressIcon} className="svgIcon" />
                            </span>
                          )}
                        </a>
                      </div>
                      <p
                        className="uploadMeetingDate"
                        onClick={(e) => {
                          e.preventDefault();
                          if (status === PROCESSED) {
                            openTranscriptFile({
                              transcriptId,
                            });
                          }
                        }}
                      >
                        <img
                          src={MeetingDate}
                          className="svgIcon"
                          style={{ marginLeft: 0, marginRight: "10px" }}
                        />
                        {moment(created_date).format("ddd, MMM Do")}
                      </p>
                      <p
                        onClick={(e) => {
                          e.preventDefault();
                          if (status === PROCESSED) {
                            openTranscriptFile({
                              transcriptId,
                            });
                          }
                        }}
                      >
                        <span className="uploadMeetingDate">
                          <img
                            src={MeetingTime}
                            className="svgIcon"
                            style={{ marginLeft: 0, marginRight: "10px" }}
                          />
                          {moment(created_date).format("h:mm A")}
                        </span>
                      </p>
                      <p>
                        <span
                          style={{
                            color: status === FAILED ? "#FA6D68" : "#D1D1D6",
                          }}
                          onClick={() =>
                            setDeleteObj({
                              openAlert: true,
                              deleteId: transcriptId,
                            })
                          }
                        >
                          {" "}
                          <img src={DeleteIcon} className="svgIcon" />
                        </span>
                      </p>
                    </div>
                  </Fragment>
                );
              }
            )}
          </ul>
        )}
      </div>
      <Dialog
        fullScreen={false}
        open={deleteObj.openAlert}
        aria-labelledby="responsive-dialog-title"
        disableBackdropClick
      >
        <DialogTitle id="responsive-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure want to delete?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setDeleteObj({
                openAlert: false,
                deleteId: undefined,
              });
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteTranscript()}
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Upload;
