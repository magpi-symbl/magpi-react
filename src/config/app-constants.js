export const PROCESSED = "completed";
export const FAILED = "failed";
export const IN_PROGRESS = "in_progress";
export const UPLOAD = "upload";
export const SYMBL_API_LANGUAGE_CODE = "en-US";
export const SYMBL_API_SPEAKER_COUNT = 2;
export const FILE_TYPE = {
  AUDIO: "audio",
  VIDEO: "video",
  TXT: "txt",
  OTHER: "other",
};
export const FILE_SIZE = [
  "Bytes",
  "KB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB",
];
export const MAX_FILE_SIZE = 3000000000000000000;
export const MAX_FILE = 50;
export const ACCEPTED_FILES = ["audio/*", "video/*"];
export const ZOOM_RESPONSE_TYPE = "code";
export const CONVERSATION_EXPERIENCES_PARAMETER = {
  name: "video-summary",
  logo: process.env.REACT_APP_LOGO_URL,
  color: {
    background: "#F2F3F5",
    topicsFilter: "#E7A500",
    insightsFilter: "#CDD7DB",
  },
  font: {
    family: "Nunito Sans",
  },
};
export const VIDEO_SUMMERY = "video-summary";
export const ZOOM_URL_REGEX = new RegExp("zoom.us");
export const DEFAULT_ERROR = "Error while calling web service";
