import React, { useState, useEffect } from "react";
import zoomIcon from "../../assets/zoom.png";
import zoomLogoIcon from "../../assets/zoomIcon.png";
import { NavLink } from "react-router-dom";
import "./index.css";
import { ZOOM_AUTH, ZOOM_USER_DETAIL } from "../../config/api-constant";
import { API } from "../../utils/api";
import { ZOOM_RESPONSE_TYPE } from "../../config/app-constants";
import CircularProgress from "@material-ui/core/CircularProgress";
import Complete from "../../assets/Complete.svg";
import ErrorIcon from "../../assets/Error.svg";
const Integration = ({ firebase, location, history, setMessageObj }) => {
  const [{ zoomConnected, isLoading }, setConnections] = useState({
    zoomConnected: false,
    isLoading: true,
  });
  const api = new API(setMessageObj);
  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search);
    const zoomIntegrationCode = searchQuery.get("code");
    if (zoomIntegrationCode) {
      onConnectionByZoom(zoomIntegrationCode);
    } else {
      fetchZoomUserByUID();
    }
  }, []);

  const fetchZoomUserByUID = async () => {
    const user = firebase.currentUser();
    const zoomUser = await firebase.fetchZoomUserByUID(user.uid);
    const data = zoomUser.docs.map((doc) => doc.data());
    setConnections({
      zoomConnected: data && data[0],
      isLoading: false,
    });
  };

  /**
   * This method used for send zoom token to backend
   * @param zoomIntegrationCode
   */
  const onConnectionByZoom = async (zoomIntegrationCode) => {
    const user = firebase.currentUser();
    const result = await api.post(
      ZOOM_USER_DETAIL,
      {
        token: zoomIntegrationCode,
        googleUserId: user.uid,
      },
      {
        "Content-Type": "application/json",
      }
    );
    if (result && result.zoomUserId) {
      setConnections({
        zoomConnected: true,
        isLoading: false,
      });
    } else {
      setConnections({
        zoomConnected: false,
        isLoading: false,
      });
    }
    history.replace({
      search: "",
    });
  };

  const onConnectZoom = async () => {
    const queryString = api.objToQueryString({
      response_type: ZOOM_RESPONSE_TYPE,
      client_id: process.env.REACT_APP_ZOOM_CLIENT_ID,
      redirect_uri: `${window.location.origin}/zoom-integrations`,
    });
    window.location.href = `${ZOOM_AUTH}?${queryString}`;
  };

  const onDisconnectZoom = async () => {
    setConnections({
      zoomConnected,
      isLoading: true,
    });
    const user = firebase.currentUser();
    await firebase.deleteZoomUserByUID(user.uid);
    setConnections({
      zoomConnected: false,
      isLoading: false,
    });
  };
  return (
    <main className="main-wrapper integration">
      <div className="main-content">
        <div className="container">
          <NavLink to={"/zoom-integrations"}>
            <div className="integration-item-block relative">
              <div>
                <img src={zoomLogoIcon} alt="zoom icon" />
                <br />
                <img src={zoomIcon} alt="zoom icon" />
                {isLoading ? null : zoomConnected ? (
                  <img
                    src={Complete}
                    title={`Zoom Account Connected! `}
                    className="svgIcon"
                    className="svgIcons"
                  />
                ) : (
                  <img
                    src={ErrorIcon}
                    title={`Zoom not connected`}
                    className="svgIcon"
                    className="svgIcons"
                  />
                )}
              </div>
            </div>
          </NavLink>
        </div>
      </div>
      <div className="left-content">
        <div className="leftBarZoomImageWrapper">
          <div className="integration-item-block">
            <div>
              <img src={zoomLogoIcon} />
              <br />
              <img src={zoomIcon} alt="zoom icon" />
            </div>
          </div>
          <p>Zoom meeting</p>
          <div className="btn-div">
            {isLoading ? null : zoomConnected ? (
              <button
                onClick={() => onDisconnectZoom()}
                className="dangerButton"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => {
                  onConnectZoom();
                }}
              >
                Connect
              </button>
            )}
            {isLoading && <CircularProgress className="ml-10" size={"auto"} />}
          </div>
        </div>
        <p className="m20">
          For Zoom Business and pro Users - Magpi will automatically transcribe
          the meeting recordings from Zoom Cloud on user's permission
        </p>
        <p className="m20">
          For Zoom Normal Users - Magpi will join the Zoom and record on their
          behalf. Once meeting finishes, the transcript will be processed
        </p>
      </div>
    </main>
  );
};

export default Integration;
