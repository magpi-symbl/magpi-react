import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { API } from "../../utils/api";
import { MEETING_EVENTS } from "../../config/api-constant";
import * as moment from "moment";
import Switch from "@material-ui/core/Switch";
import "./index.css";
import { withStyles } from "@material-ui/core/styles";
import Upload from "../../containers/Upload";
import LiveMeeting from "../../assets/Live_meeting.svg";
import UpcomingMeeting from "../../assets/Upcoming_Meteting.svg";
import TimeAnddate from "../../assets/TimeAnddate.svg";

const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 32,
    height: 16,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#52d869",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 14,
    height: 14,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const HomeContainer = ({ history, firebase, setMessageObj }) => {
  const api = new API(setMessageObj);
  const [{ liveMeetings, upcomingMeetings }, setMeetings] = useState({
    liveMeetings: [],
    upcomingMeetings: [],
  });
  useEffect(() => {
    const getMeetings = async () => {
      const queryString = api.objToQueryString({
        timeMin: moment().format(),
        orderBy: "startTime",
        singleEvents: true,
        showDeleted: false,
        timeMax: moment().add("days", 7).format(),
      });
      const customHeaders = {
        Authorization: `Bearer ${localStorage.getItem("accessKey")}`,
      };
      const result = await api.get(
        `${MEETING_EVENTS}?${queryString}`,
        customHeaders
      );
      if (result) {
        const upcomingMeetings = [];
        const liveMeetings = [];
        const compareDate = moment();
        result.items.forEach((event) => {
          if (!event.organizer || !event.organizer.self) {
            return;
          }
          const startDate = moment(event.start.dateTime || event.start.date);
          const endDate = moment(event.end.dateTime || event.end.date);
          if (compareDate.isBetween(startDate, endDate)) {
            liveMeetings.push(event);
          }
          if (
            compareDate.diff(
              moment(event.start.dateTime || event.start.date),
              "minute"
            ) < 0
          ) {
            upcomingMeetings.push(event);
          }
        });
        setMeetings({
          upcomingMeetings,
          liveMeetings,
        });
      }
    };
    getMeetings();
  }, []);
  return (
    <main className="main-wrapper">
      <div className="main-content">
        <div className="title-wrapper">
          <h1>Welcome to Magpi</h1>
          <p className="text-style">One-Stop AI Meeting Assistant</p>
        </div>
        <div className="right-side-inner flex">
          <div className="flex">
            <label className="looklike-selectbox-label">
              Meetings Magpi will join
            </label>
            <div className="looklike-selectbox">
              All Meetings owned by me
              <ExpandMoreIcon />
            </div>
          </div>
          <div className="flex">
            <label className="looklike-selectbox-label">
              Notes get sent to
            </label>
            <div className="looklike-selectbox">
              Only me
              <ExpandMoreIcon />
            </div>
          </div>
        </div>
        <div>
          <div className="meting-block-wrapper-tra dFlexIconSection">
            <img
              src={LiveMeeting}
              alt="livemeeting"
              width={20}
              className="svgIcon"
            />
            <h4 className="block-main-title">
              Live Meeting{" "}
              <span className="number-css">{liveMeetings.length}</span>
            </h4>
          </div>
          {liveMeetings.length ? (
            <div className="meting-block-wrapper-tra headerCss">
              <p className="dateTimeClock">Date </p>
              <p className="dateTimeClock">Time</p>
              <p className="fullFlex">Meeting Name</p>
              <p className="fullFlex">Meeting Owner</p>
            </div>
          ) : null}
          {liveMeetings.map(({ summary, id, start, organizer }) => (
            <div className="meting-block-wrapper headerrowCss">
              <div>
                <div className="scheduled-time">
                  <img
                    src={TimeAnddate}
                    className="svgIcon"
                    style={{ marginLeft: 0, marginRight: "10px" }}
                  />
                  <div>
                    <p className="dateTimeClock uploadHomeMeetingDate">
                      {moment(start.dateTime || start.date).format(
                        "ddd, MMM Do"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="scheduled-time">
                  <img
                    src={TimeAnddate}
                    className="svgIcon"
                    style={{ marginLeft: 0, marginRight: "10px" }}
                  />
                  <div>
                    <p className="dateTimeClock">
                      <span className="timeCss">
                        {moment(start.dateTime || start.date).format("h:mm A")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="fullFlex">
                <div className="scheduled-time">
                  {summary && (
                    <span
                      className="colorpad-email"
                      style={{ background: `${getRandomColor()}` }}
                    >
                      {summary[0].toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p>{summary}</p>
                  </div>
                </div>
              </div>
              <div className="fullFlex">
                <div className="scheduled-time">
                  <div>
                    <p>{organizer.email}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="meting-block-wrapper-tra dFlexIconSection">
            <img
              src={UpcomingMeeting}
              alt="Upcomingmeeting"
              width={20}
              className="svgIcon"
            />
            <h4 className="block-main-title">
              Upcoming Meeting{" "}
              <span className="number-css">{upcomingMeetings.length}</span>
            </h4>
          </div>
          {upcomingMeetings.length ? (
            <div className="meting-block-wrapper-tra headerCss">
              <p className="dateTimeClock">Date </p>
              <p className="dateTimeClock">Time</p>
              <p className="fullFlex">Meeting Name</p>
              <p className="fullFlex">Meeting Owner</p>
            </div>
          ) : null}
          {upcomingMeetings.map(({ summary, id, start, organizer }) => (
            <div className="meting-block-wrapper headerrowCss">
              <div>
                <div className="scheduled-time">
                  <img
                    src={TimeAnddate}
                    className="svgIcon"
                    style={{ marginLeft: 0, marginRight: "10px" }}
                  />
                  <div>
                    <p className="dateTimeClock uploadHomeMeetingDate">
                      {moment(start.dateTime || start.date).format(
                        "ddd, MMM Do"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="scheduled-time">
                  <img
                    src={TimeAnddate}
                    className="svgIcon"
                    style={{ marginLeft: 0, marginRight: "10px" }}
                  />
                  <div>
                    <p className="dateTimeClock">
                      <span className="timeCss">
                        {moment(start.dateTime || start.date).format("h:mm A")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="fullFlex">
                <div className="scheduled-time">
                  {summary && (
                    <span
                      className="colorpad-email"
                      style={{ background: `${getRandomColor()}` }}
                    >
                      {summary[0].toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p>{summary}</p>
                  </div>
                </div>
              </div>
              <div className="fullFlex">
                <div className="scheduled-time">
                  <div>
                    <p>{organizer.email}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rightHomeSection">
        <div className="upload-area">
          <Upload
            {...{
              firebase,
              history,
              onlyUpload: true,
              setMessageObj,
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default HomeContainer;
