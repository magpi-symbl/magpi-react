import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Avatar from '@material-ui/core/Avatar';
import './index.css';

export default function PopoverPopupState({
  firebase
}) {
  const user = firebase.currentUser() || {};
  return (
    <div>
      <div className={'profile-content'}>
        <Avatar alt="Cindy Baker" src={user.photoURL} className="mr-5" />
        <div >
          <div className="bold">{user.displayName}</div>
          <div>{user.email}</div>
        </div>
        <br />


      </div>
      <Typography className="pointer logOuutButton" onClick={() => {
        firebase.signOut()
      }}>Logout</Typography>
    </div>
  );
}