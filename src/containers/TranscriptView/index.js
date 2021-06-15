import React, { useEffect, useState } from "react";
import "./index.css";
import {
  CONVERSATION_EXPERIENCES_PARAMETER,
  UPLOAD,
  VIDEO_SUMMERY,
} from "../../config/app-constants";
import { CONVERSATION_EXPERIENCES } from "../../config/api-constant";
import { API } from "../../utils/api";
const TranscriptView = ({ match, firebase, setMessageObj }) => {
  const api = new API(setMessageObj);
  const [summeryObj, setSummeryObj] = useState({
    summeryUrl: undefined,
  });

  /**
   * This method used for open click transcript file
   * @param transcriptId
   */

  const openTranscriptFile = async ({ transcriptId }) => {
    const transcript = (
      await firebase.fetchTranscriptById(transcriptId)
    ).data();
    if (transcript.experienceUrl) {
      return setSummeryObj({
        summeryUrl: transcript.experienceUrl,
      });
    }
    const expResult = await callExperienceAPI(
      transcript.conversationId,
      transcript.videoUrl,
      transcript.source
    );
    if (expResult) {
      await updateTranscript(transcript.transcriptId, {
        experienceUrl: expResult.url,
      });
      return setSummeryObj({
        summeryUrl: expResult.url,
      });
    }
  };

  const callExperienceAPI = async (conversationId, videoUrl, source) => {
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
          videoUrl,
        },
      },
      ExpCustomHeaders
    );
    return expResult;
  };

  /**
   * Update transcript file name
   * @param transcriptId
   * @param updateObject
   */

  const updateTranscript = async (transcriptId, updateObject) => {
    await firebase.updateTranscript(transcriptId, updateObject);
  };

  useEffect(() => {
    openTranscriptFile({
      transcriptId: match.params.transcriptId,
    });
  }, []);

  return (
    <main className="main-wrapper">
      <iframe
        className="w-100 h-100 iframe"
        src={summeryObj.summeryUrl}
        title="description"
      />
    </main>
  );
};

export default TranscriptView;
