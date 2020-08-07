import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import User from "./pages/User";
import { getUserFromToken } from "./helpers/";
import { verifyUser } from "./redux/actions/authActions";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import teal from "@material-ui/core/colors/teal";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[600],
    },
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyUser());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />

          <PrivateProfile path="/profile" exact component={Profile} />

          <Route exact path="/:user/:id" component={User} />

          <Route exact path="/signup" component={SignUp}>
            {getUserFromToken() === null ? <SignUp /> : <Redirect to="/" />}
          </Route>

          <Route exact path="/login" component={Login}>
            {getUserFromToken() === null ? <Login /> : <Redirect to="/" />}
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

const PrivateProfile = ({ component: Component, ...rest }) => {
  const user = getUserFromToken();
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to={{ pathname: "/" }} />
      }
    />
  );
};

export default App;
