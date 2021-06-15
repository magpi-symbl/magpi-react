import React, { useState, useEffect } from "react";
import EditIcon from "@material-ui/icons/Edit";
import CalendarToday from "@material-ui/icons/CalendarToday";
import Schedule from "@material-ui/icons/Schedule";
import Clock from "@material-ui/icons/Watch";
import musicIcon from "../../assets/music.png";
import videoIcon from "../../assets/video-camera.png";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Notification from "../../components/notification";
import * as moment from "moment";
import EasyEdit, { Types } from "react-easy-edit";
import checkIcon from "../../assets/check.png";
import cancelIcon from "../../assets/cancel.png";
import { PROCESSED, FAILED, IN_PROGRESS } from "../../config/app-constants";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ReportIcon from "@material-ui/icons/Report";
import MeetingDate from "../../assets/Trans_Meeting_date.svg";
import MeetingTime from "../../assets/trans_Meeting_time.svg";
import TranscriptTime from "../../assets/Transcript_Time.svg";
import Complete from "../../assets/Complete.svg";
import ErrorIcon from "../../assets/Error.svg";
import ProgressIcon from "../../assets/progress.svg";
import DeleteIcon from "../../assets/Delete.svg";
import "./index.css";
/**
 * Custom Inputs
 * @returns
 */
const CustomInput = ({ setParentValue, value }) => {
  return (
    <input value={value} onChange={(e) => setParentValue(e.target.value)} />
  );
};
const Transcript = ({ firebase, history, loggedInUser, setMessageObj }) => {
  const [transcripts, setTranscripts] = useState([]);
  const [allowEdit, setAllowEdit] = useState({});
  const [deleteObj, setDeleteObj] = useState({
    openAlert: false,
    deleteId: undefined,
  });
  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    const user = firebase.currentUser();
    const transcripts = firebase
      .fetchTranscripts(user.uid)
      .orderBy("created_date", "desc");
    transcripts.onSnapshot((transcriptsSnapshot) => {
      const data = transcriptsSnapshot.docs.map((doc) => doc.data());
      setTranscripts(data);
    });
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
   * @param transcriptId
   */

  const openTranscriptFile = async ({ transcriptId }) => {
    history.push(`transcript-view/${transcriptId}`);
  };

  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  /**
   * Update transcript file name
   * @param transcriptId
   * @param updateObject
   */

  const updateTranscript = async (transcriptId, updateObject, index) => {
    await firebase.updateTranscript(transcriptId, updateObject);
    transcripts[index] = {
      ...transcripts[index],
      ...updateObject,
    };
    setAllowEdit({});
  };

  return (
    <main className="main-wrapper">
      <ul className="transition-container">
        <div className="heading-section bg-white">
          <div className="meeting-name-section">
            <h6>Meeting Name</h6>
          </div>
          <div className="email-section">
            <h6>Source</h6>
          </div>
          <div className="meeting-date-section">
            <h6>Meeting Date</h6>
          </div>
          <div className="meeting-time-section">
            <h6>Meeting Time</h6>
          </div>
          <div className="transcript-time-section">
            <h6>Transcript Time</h6>
          </div>
          <div className="status-heading-section">
            <h6>Status</h6>
          </div>
          <div></div>
        </div>
        {transcripts.map(
          (
            {
              fileName,
              transcriptId,
              status,
              fileType,
              created_date,
              source,
              duration,
            },
            index
          ) => {
            return (
              <>
                <li
                  key={transcriptId}
                  className="notebook-item list-section bg-white d-flex"
                >
                  <div className="notebook-item-left d-flex meeting-name-section">
                    {/* {fileType === 'audio' && <img className="icon-img" src={musicIcon} alt="musicIcon" />} */}
                    {/* {fileType === 'video' && <img className="icon-img" src={videoIcon} alt="videoIcon" />} */}
                    {/* {!fileType && <img className="icon-img" src={musicIcon} alt="musicIcon" />} */}
                    <div className="fullWidth">
                      <h5 className="meeting-name">
                        <EasyEdit
                          editMode={allowEdit[transcriptId]}
                          allowEdit={false}
                          type={Types.TEXT}
                          value={fileName}
                          onSave={(fileName) =>
                            updateTranscript(
                              transcriptId,
                              {
                                fileName,
                              },
                              index
                            )
                          }
                          onCancel={() => {
                            setAllowEdit({});
                          }}
                          onValidate={(value) => {
                            return !!value;
                          }}
                          validationMessage={"File name required"}
                          saveButtonLabel={
                            <img
                              className="icon-edit"
                              src={checkIcon}
                              alt="checkIcon"
                            />
                          }
                          cancelButtonLabel={
                            <img
                              className="icon-edit"
                              src={cancelIcon}
                              alt={"cancelIcon"}
                            />
                          }
                          editComponent={<CustomInput />}
                          displayComponent={
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                if (status === PROCESSED) {
                                  openTranscriptFile({
                                    transcriptId,
                                  });
                                }
                              }}
                            >
                              {fileName}
                            </div>
                          }
                        />
                        {!allowEdit[transcriptId] && (
                          <EditIcon
                            onClick={() => {
                              setAllowEdit({
                                [transcriptId]: true,
                              });
                            }}
                          />
                        )}
                      </h5>
                    </div>
                  </div>
                  <div
                    className="d-flex email-section pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (status === PROCESSED) {
                        openTranscriptFile({
                          transcriptId,
                        });
                      }
                    }}
                  >
                    {/* {loggedInUser.email && (
                      <span
                        className="colorpad-email"
                        style={{ background: `${getRandomColor()}` }}
                      >
                        {loggedInUser.email[0].toUpperCase()}
                      </span>
                    )} */}
                    <span>{source.toUpperCase()}</span>
                  </div>
                  <div
                    className="meeting-date-section pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (status === PROCESSED) {
                        openTranscriptFile({
                          transcriptId,
                        });
                      }
                    }}
                  >
                    <span className="d-flex-icon">
                      <img src={MeetingDate} className="svgIcon" />
                      <span className="ml-5">
                        {moment(created_date).format("ddd, MMM Do")}
                      </span>
                    </span>
                  </div>
                  <div
                    className="meeting-time-section pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (status === PROCESSED) {
                        openTranscriptFile({
                          transcriptId,
                        });
                      }
                    }}
                  >
                    <span className="d-flex-icon">
                      <img src={MeetingTime} className="svgIcon" />
                      <span className="ml-5">
                        {moment(created_date).format("h:mm A")}
                      </span>
                    </span>
                  </div>
                  <div
                    className="transaction-section transcript-time-section pointer"
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
                      src={TranscriptTime}
                      className="svgIcon transcriptIcon"
                    />
                    <span style={{ overflowWrap: "anywhere" }}>{duration}</span>
                  </div>

                  <div className="status-heading-section right-align pointer">
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
                            color: status === PROCESSED ? "#4bb543" : "#eee",
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
                            color: status === IN_PROGRESS ? "#F5E617" : "#eee",
                          }}
                        >
                          <img src={ProgressIcon} className="svgIcon" />
                        </span>
                      )}
                    </a>
                  </div>

                  <div className="kikoff-content small">
                    <div>
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
                    </div>
                  </div>
                </li>
              </>
            );
          }
        )}
      </ul>
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

export default Transcript;
