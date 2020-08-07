import React, { useState } from "react";
import {
  CircularProgress,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  Button,
  CssBaseline,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { login, clearError } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import teddy from "../img/teddy.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${teddy})`,
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { authenticating, error } = useSelector((state) => state.auth);

  const clearInput = () => {
    setEmail("");
    setPassword("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Call a redux action here and pass in the fields
    dispatch(login({ email, password }, clearInput));
  };

  const onChange = (e, setState) => {
    if (error !== "") {
      dispatch(clearError());
    }
    // One function to control all set states
    setState(e.target.value);
  };

  const buttonDisabled = () => {
    if (email === "" || password === "") {
      // Form would be disabled if fields are empty
      return true;
    } else if (authenticating) {
      // Form would be disabled if fields are not empty and authenticating is true
      return true;
    } else {
      // Form would be disabled if fields are not empty and authenticating is false
      return false;
    }
  };
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Box align="left">
            <Typography variant="h4">LOG IN</Typography>
            <Typography variant="h6" color="textSecondary">
              To share your bitts
            </Typography>
          </Box>

          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => onChange(e, setEmail)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => onChange(e, setPassword)}
            />
            {error === "" ? null : <Alert severity="error">{error}</Alert>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={buttonDisabled()}
            >
              {authenticating ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress size={20} />
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>

            <Link to="/signup">
              <Typography variant="body2" color="textSecondary">
                {" "}
                Don't have an account? Sign Up
              </Typography>{" "}
            </Link>
          </form>
        </div>
      </Grid>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
    </Grid>
  );
}
