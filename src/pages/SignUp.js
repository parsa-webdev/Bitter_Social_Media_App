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
import { register, clearError } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import People from "../img/people.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: `url(${People})`,
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const { authenticating, error } = useSelector((state) => state.auth);

  const clearInput = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Call a redux action here and pass in the fields
    dispatch(register({ firstName, lastName, email, password }, clearInput));
  };

  const onChange = (e, setState) => {
    if (error !== "") {
      dispatch(clearError());
    }
    // One function to control all set states
    setState(e.target.value);
  };

  const buttonDisabled = () => {
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === ""
    ) {
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
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Box align="left" marginY={1}>
            <Typography variant="h4">SIGN UP</Typography>
            <Typography variant="h6" color="textSecondary">
              To share your bitts
            </Typography>
          </Box>

          <form className={classes.form} noValidate onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => onChange(e, setFirstName)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => onChange(e, setLastName)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => onChange(e, setEmail)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
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
              </Grid>
            </Grid>
            {error === "" ? null : (
              <Box marginTop={1}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}
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
                "Sign Up"
              )}
            </Button>

            <Link to="/login">
              <Typography variant="body2" color="textSecondary">
                {" "}
                Already have an account? Sign In
              </Typography>{" "}
            </Link>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
