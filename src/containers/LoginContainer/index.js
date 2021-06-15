import React, { useEffect } from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import { withFirebase } from "../../firebase";
import { API } from "../../utils/api";
import { FETCH_ACCESS_TOKEN } from "../../config/api-constant";
import Logo from "../../assets/Logo.png";
// import LoginBg from "../../assets/Login_BG.png";
import LoginBg from "../../assets/LoginGrapgic BG_hig_res.png";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import "./index.css";

const LoginContainer = ({ firebase, setMessageObj }) => {
  const api = new API(setMessageObj);

  /**
   * This method user to redirect google page for login
   */
  const login = async () => {
    const calendarProvider = firebase.createCalendarProvider();
    await firebase.gCalendarLogin(calendarProvider);
  };
  return (
    <div className="loginContainer">
      <div className="login-section">
        <div className="login-left-section">
          <div className="login-inner-left-section">
            <div className="loginHeader">
              <img src={Logo} className="imageCss" />
            </div>

            <div className="left-center-section">
              <h2 className="welcomeTitle">WELCOME</h2>
              <p className="subTitle">
                Get started with your work email address
              </p>
              <Card className="dFlex cardSection" onClick={login}>
                <img
                  src="https://platform.symbl.ai/images/btn_google_dark_focus_ios@2x.png"
                  className="googleIcon"
                />
                <div className="innerTextSection">
                  <p className="m-0 googleTitle">Google Calendar</p>
                  <p className="m-0 text-small lightGray">
                    Magpi will sync with meetings on your work calendar
                  </p>
                </div>

                {/* <Button variant="contained" color="primary" className="loginButtonCss googleButtonCss" >
                                        Sign in with Google Calendar
                                    </Button> */}
                <div className="rightRounderButton">
                  <ArrowForwardIcon
                    className="arrowIcon"
                    iconStyle={{ width: 60, height: 60 }}
                  />
                </div>
              </Card>
            </div>
            {/* <p className="copyRightText">Powered by <a>Symbl </a>...Copyright <a>Symbl Inc</a> Inc...</p> */}
            <div className="leftBottomSection">
              <p className="text-small lightGray">
                {" "}
                By using Magpi you agree to our Terms of Service{" "}
              </p>
              <p className="text-small lightGray">
                We know that information is at the heart of your businesses,
              </p>
              <p className="text-small lightGray">
                which is why security is our top priority.
              </p>
              {/* <a href="#" className="linkText text-small">Read about the steps we take.</a> */}
            </div>
          </div>
        </div>
        <div className="login-right-section">
          <div className="rightInnerSection" />
          {/* <img src={LoginBg} className="loginBgImage" /> */}
        </div>
      </div>
    </div>
  );
};

export default withFirebase(LoginContainer);
