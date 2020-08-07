import React from "react";
import { signOut } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Button,
  CssBaseline,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.common.white,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
    color: "black",
    fontSize: "1.5rem",
    textDecoration: "none",
  },
  link: {
    margin: theme.spacing(1, 1),
    textDecoration: "none",
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isLoggedIn, verifyingUser } = useSelector((state) => state.auth);

  return (
    <div>
      <CssBaseline />
      <AppBar position="static" elevation={1} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Link to="/" className={classes.toolbarTitle}>
            Bitter
          </Link>
          <nav>
            {verifyingUser ? null : isLoggedIn ? (
              <>
                <Button className={classes.link} component={Link} to="/profile">
                  Profile
                </Button>
                <Button
                  variant="text"
                  className={classes.link}
                  onClick={() => dispatch(signOut())}
                  color="primary"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  className={classes.link}
                  variant="text"
                  component={Link}
                  to="/signup"
                  color="default"
                >
                  Sign Up
                </Button>

                <Button
                  className={classes.link}
                  variant="text"
                  component={Link}
                  to="/login"
                  color="primary"
                >
                  Log In
                </Button>
              </>
            )}
          </nav>
        </Toolbar>
      </AppBar>
    </div>
  );
}
