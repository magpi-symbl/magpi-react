export const FETCH_ACCESS_TOKEN =
  process.env.REACT_APP_FIREBASE_URL + "/fetchAccessToken";
export const POST_AUDIO =
  process.env.REACT_APP_SYMBL_BASE_URL + "/process/audio";
export const POST_VIDEO =
  process.env.REACT_APP_SYMBL_BASE_URL + "/process/video";
export const CONVERSATION_EXPERIENCES =
  process.env.REACT_APP_SYMBL_BASE_URL +
  "/conversations/{conversationId}/experiences";
export const MEETING_EVENTS =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";
export const GET_JOB_STATUS =
  process.env.REACT_APP_SYMBL_BASE_URL + "/job/{jobId}";
export const ZOOM_AUTH = "https://zoom.us/oauth/authorize";
export const ZOOM_USER_DETAIL =
  process.env.REACT_APP_FIREBASE_URL + "/fetchZoomUserDetails";
export const WEB_HOOK_URL =
  process.env.REACT_APP_FIREBASE_URL + "/symblCallback";
