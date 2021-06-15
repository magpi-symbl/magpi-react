import React, { Suspense, useEffect, useState, Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { withFirebase } from "./firebase";
import HomeContainer from './containers/HomeContainer';
import LoginContainer from './containers/LoginContainer';
import LeftSidebarHome from './containers/LeftSidebarHome';
import Integrations from './containers/Integrations';
import Upload from './containers/Upload';
import Transcript from './containers/Transcript';
import { makeStyles } from '@material-ui/core/styles';
import { API } from './utils/api';
import { FETCH_ACCESS_TOKEN } from './config/api-constant';
import TranscriptView from "./containers/TranscriptView";
import Notification from "./components/notification";

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    height: '100%'
  }
}));

const AuthComponent = ({
  match, firebase
}) => {
  const [messageObj, setMessageObj] = useState({
    openAlert: false,
    severity: undefined,
    alertMessage: ''
  });
  const api = new API(setMessageObj);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authenticateLoading, setAuthenticateLoading] = useState(true);
  const classes = useStyles();
  /**
   * This method used to get access token and set into local storage
   */
  const fetchAccessToken = async () => {
    const result = await api.get(`${FETCH_ACCESS_TOKEN}`);
    if (result) {
      localStorage.setItem('token', result.token);
    }
  }

  useEffect(() => {
    firebase.auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        if (!localStorage.getItem('token')) {
          await fetchAccessToken();
        }
      }
      setLoggedInUser(userAuth);
      setAuthenticateLoading(false);
    });
  }, []);
  if (authenticateLoading) {
    return <Fragment>
      <div>
        Loading...
      </div>
    </Fragment>
  }
  return (
    firebase.currentUser() ? <Fragment>
      <main className="main-container">
        <Notification {...messageObj} setAlert={() => {
          setMessageObj({
            alertMessage: '',
            openAlert: false,
            severity: undefined
          });
        }} />
        <div className={classes.root}>
          <LeftSidebarHome />
          <Switch>
            <Route path={`/home`}
              render={(props) => (<HomeContainer {
                ...{
                  loggedInUser, firebase, setMessageObj
                }
              } {...props} />)} />
            <Route path={`/zoom-integrations`}
              render={(props) => (<Integrations {
                ...{
                  loggedInUser, firebase, setMessageObj
                }
              } {...props} />)} />
            <Route path={`/upload`}
              render={(props) => (<Upload {
                ...{
                  loggedInUser, firebase, setMessageObj
                }
              } {...props} />)} />
            <Route path={`/transcript`}
              render={(props) => (<Transcript {
                ...{
                  loggedInUser, firebase, setMessageObj
                }
              } {...props} />)} />
            <Route path={`/transcript-view/:transcriptId`}
              render={(props) => (<TranscriptView {
                ...{
                  loggedInUser, firebase, setMessageObj
                }
              } {...props} />)} />
            <Route path="*">
              <Redirect to={`/home`} />
            </Route>
          </Switch>
        </div>
      </main>
    </Fragment> : <Fragment>
      <Notification {...messageObj} setAlert={() => {
        setMessageObj({
          alertMessage: '',
          openAlert: false,
          severity: undefined
        });
      }} />
      <PublicComponent {...{
        match, firebase, setMessageObj
      }} />
    </Fragment>
  )
}

const PublicComponent = ({
  match, setMessageObj
}) => {
  return (
    <Switch>
      <Route path={'/login'} render={(props) => (<LoginContainer {
        ...{
          setMessageObj
        }
      } {...props} />)} />
      <Route path="*">
        <Redirect to={'/login'} />
      </Route>
    </Switch>
  );
}


export default function Routes() {
  return (
    <Suspense fallback={"loading..."}>
      <Router>
        <Switch>
          <Route path="/" component={withFirebase(AuthComponent)} />
        </Switch>
      </Router>
    </Suspense>
  );
}
