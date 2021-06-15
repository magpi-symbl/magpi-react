# Magpi - Symnbl Zoom Marketplace App sample

[https://docs.symbl.ai)

Symbl's APIs empower developers to enable:

- **Real-time** analysis of free-flowing discussions to automatically surface highly relevant summary discussion topics, contextual insights, suggestive action items, follow-ups, decisions, and questions.
- **Voice APIs** that makes it easy to add AI-powered conversational intelligence to either [telephony][telephony] or [WebSocket][websocket] interfaces.
- **Conversation APIs** that provide a REST interface for managing and processing your conversation data.
- **Summary UI** with a fully customizable and editable reference experience that indexes a searchable transcript and shows generated actionable insights, topics, timecodes, and speaker information.

<hr />

## Enable Symbl for Transcribe Audio/Video Zoom Recording via Magpi app

<hr />

- [Introduction](#introduction)
- [Pre-requisites](#pre-requisites)
- [Features](#features)
- [Browser Support](#browsersupport)
- [Setup and Deploy](#setupanddeploy)
- [Dependencies](#dependencies)
- [Conclusion](#conclusion)
- [Community](#community)

## Introduction

Magpi application provides users with a one-stop solution for managing their meetings and provides them with a way to manage all action items, topics discussed etc. insights in those meetings at one place, with easy integration

## Pre-requisites

- JS ES6+
- [Node.js v10+](https://nodejs.org/en/download/)\*
- NPM v6+
- Zoom account - Zoom Marketplace App setup.
- Complete irebase set up and deply cloud functions. Please see details at [Magpi Firebase](https://github.com/magpi-symbl/magpi-firebase)

## Features

- Link Google Calendar
- Transcription of Audio/Video Recordoing of Zoom Meetings
- Meeting Summary UI
- Action Items & Follow ups
- Upload Recordings to generate transcripts

## Browser Support

This application is supported on Google Chrome, IE, Mozella, Firefox

## Setup and Deploy

To run the app , set up .env file with parameters below:

```.env
REACT_APP_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_AUTH_DOMAIN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_DATABASE_URL=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_PROJECT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_STORAGE_BUCKET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_MESSAGING_SENDER_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_APP_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REDIRECT_URL=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_SYMBL_BASE_URL =xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_FIREBASE_URL=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_ZOOM_CLIENT_ID = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_LOGO_URL =xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Run the app locally with

    $ npm install
    $ npm start

## For Zoom Business and pro Users - Magpie will automatically transcribe the meeting recordings from Zoom Cloud on user's permission that can be updated or modified in Zoom settings.

## For Zoom Normal Users - Magpie will join the Zoom and record on their behalf. Once meetingfinishes, the transcript will be processed

## For Normal Users- User can upload the Audio/Video recording to get Meeting Summary UI/Transcript generated

## Dependencies and Dev Dependencies

```json
  "dependencies": {
"@material-ui/core": "^4.11.3",
    "@material-ui/icons": "^4.11.2",
    "@material-ui/lab": "^4.0.0-alpha.57",
    "@testing-library/jest-dom": "^5.11.9",
    "@testing-library/react": "^11.2.5",
    "@testing-library/user-event": "^12.8.3",
    "firebase": "^8.3.1",
    "material-ui-dropzone": "^3.5.0",
    "material-ui-popup-state": "^1.8.0",
    "moment": "^2.29.1",
    "prop-types": "^15.7.2",
    "react": "^17.0.1",
    "react-dom": "^17.0.1",
    "react-easy-edit": "^1.13.1",
    "react-edit-inline": "^1.0.8",
    "react-router-dom": "^5.2.0",
    "react-scripts": "4.0.3",
    "uuid": "^8.3.2",
    "web-vitals": "^1.1.1"
  }
  devDependencies": {
    "dotenv": "^8.2.0"
  }
```

## Conclusion

When implemented this application will allow you to view all the meetings owned by the user/host. Post the call is over,Magpie will generate and share a meeting summary UI to the owner of the meeting.

## Community

If you have any questions, feel free to reach out to us at magpi@symbl.ai
This guide is actively developed, and we love to hear from you! Please feel free to [create an issue][issues] or [open a pull request][pulls] with your questions, comments, suggestions and feedback. If you liked our integration guide, please star our repo!

This library is released under the [Apache License][license]

[license]: LICENSE.txt
[telephony]: https://docs.symbl.ai/docs/telephony/overview/post-api
[websocket]: https://docs.symbl.ai/docs/streamingapi/overview/introduction
[signup]: https://platform.symbl.ai/?_ga=2.63499307.526040298.1609788827-1505817196.1609788827
[issues]: https://github.com/magpi-symbl/magpi-react/issues
[pulls]: https://github.com/magpi-symbl/magpi-react/pulls
[magpi-firebase]: https://github.com/magpi-symbl/magpi-firebase
