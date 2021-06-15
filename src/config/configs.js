import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import AccountBox from '@material-ui/icons/AccountBox';

export const redirectUrl = process.env.REDIRECT_URL;

export const DRAWER_WIDTH = 240;

export const SIDE_MENU_ROUTES = [
    {
        title: 'My Meetings',
        path: '/home',
        icon: <AccountBox />
    },
    {
        title: 'Integrations',
        path: '/zoom-integrations',
        icon: <MailIcon />
    }, {
        title: 'Upload',
        path: '/upload',
        icon: <InboxIcon />,
    }, {
        title: 'Transcript',
        path: '/transcript',
        icon: <MailIcon />
    }
];