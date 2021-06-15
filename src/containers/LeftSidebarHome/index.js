import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withFirebase } from "../../firebase";
import { withRouter, NavLink } from "react-router-dom";
import { DRAWER_WIDTH, SIDE_MENU_ROUTES } from "../../config/configs";
import "./index.css";
import Magpie_logo from "../../assets/Magpi_logo_small.png";
import PopoverPopupState from "./PopupProfile";
//

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: DRAWER_WIDTH,
  },
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
  logo: {
    position: "absolute",
    fontSize: 32,
    left: 50,
    top: 8,
    color: "white",
  },
  toolbar: theme.mixins.toolbar,
  mainTitle: {
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  menuTitle: {
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  activeMenu: {
    opacity: 0.5,
  },
}));

const PermanentDrawerLeft = ({ firebase }) => {
  const classes = useStyles();
  const logout = () => {};
  return (
    <Fragment>
      <CssBaseline />
      {/* <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap className="logoutButton" >

                    </Typography>
                </Toolbar>
            </AppBar> */}
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <span className={classes.logo}>
          <NavLink to={"/home"} className={classes.mainTitle}>
            <img className="logoImage" src={Magpie_logo} alt={"Magpie_logo"} />
          </NavLink>
        </span>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {SIDE_MENU_ROUTES.map(({ title, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              activeClassName={classes.activeMenu}
              className={classes.mainTitle}
            >
              <ListItem button>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} className="blackColor" />
              </ListItem>
            </NavLink>
          ))}
        </List>
        <div className="profileContent">
          <PopoverPopupState firebase={firebase} />
        </div>
      </Drawer>
    </Fragment>
  );
};

export default withRouter(withFirebase(PermanentDrawerLeft));
