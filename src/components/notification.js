import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import {
  Snackbar, Button
} from '@material-ui/core';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Notification({ openAlert, severity, alertMessage, setAlert, action }) {
  return (
    <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setAlert()}>
      <Alert severity={severity} action={action ? <Button style={{
        textTransform: 'capitalize',
        textDecoration: 'underline'
      }} color="inherit" size="small" onClick={() => {
        action.action()
        setAlert()
      }}>
        {action.name}
      </Button> : null}>{alertMessage}</Alert>
    </Snackbar>
  )
}