import {
  AUTHENTICATED,
  AUTHENTICATING,
  VERIFYING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGOUT_SUCCESS,
} from "./types";
import { validateEmail, getUserFromToken } from "../../helpers/";
import { auth, db } from "../../services/firebase";

export const verifyUser = () => async (dispatch) => {
  const verifiedUser = getUserFromToken();

  if (verifiedUser) {
    try {
      dispatch({ type: VERIFYING });
      await auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userID = user.uid;
          const docRef = await db.collection("users").doc(userID);
          const doc = await docRef.get();

          dispatch({
            type: AUTHENTICATED,
            payload: { ...doc.data(), userID },
          });
        }
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR, payload: err.message });
    }
  } else {
    dispatch({ type: AUTH_ERROR, payload: "" });
    document.cookie = "access_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const register = (userInput, clearInput) => async (dispatch) => {
  try {
    dispatch({ type: AUTHENTICATING });

    if (!validateEmail(userInput.email)) {
      return dispatch({ type: AUTH_ERROR, payload: "Email is not valid" });
    }
    if (userInput.password.length < 8) {
      return dispatch({
        type: AUTH_ERROR,
        payload: "Password must be at least 8 characters",
      });
    }

    await auth.createUserWithEmailAndPassword(
      userInput.email,
      userInput.password
    );

    const authenticatedUser = await auth.currentUser;

    const userID = authenticatedUser.uid;
    await db.collection("users").doc(userID).set({
      firstName: userInput.firstName,
      lastName: userInput.lastName,
    });

    const access_token = await authenticatedUser.getIdToken();

    document.cookie = `access_token=${access_token}`;
    const docRef = await db.collection("users").doc(userID);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: {},
    });
    dispatch({ type: AUTHENTICATED });
    clearInput();
    window.location.pathname = "/";
  } catch (err) {
    dispatch({ type: REGISTER_FAIL, payload: err.message });
  }
};

export const login = (userInput, clearInput) => async (dispatch) => {
  try {
    dispatch({ type: AUTHENTICATING });

    if (!validateEmail(userInput.email)) {
      return dispatch({ type: LOGIN_FAIL, payload: "Email is not valid" });
    }
    if (userInput.password.length < 8) {
      return dispatch({
        type: LOGIN_FAIL,
        payload: "Password must be at least 8 characters",
      });
    }

    await auth.signInWithEmailAndPassword(userInput.email, userInput.password);

    const authenticatedUser = await auth.currentUser;

    const access_token = await authenticatedUser.getIdToken();

    document.cookie = `access_token=${access_token}`;

    const userID = authenticatedUser.uid;
    const docRef = await db.collection("users").doc(userID);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {},
    });
    clearInput();
    window.location.pathname = "/";
  } catch (err) {
    dispatch({ type: LOGIN_FAIL, payload: err.message });
  }
};

export const signOut = () => async (dispatch) => {
  try {
    await auth.signOut();
    document.cookie = "access_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    dispatch({ type: LOGOUT_SUCCESS });
    window.location.pathname = "/login";
  } catch (err) {
    console.log(err);
  }
};

export const clearError = () => {
  return { type: AUTH_ERROR, payload: "" };
};
