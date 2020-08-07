import {
  AUTHENTICATED,
  AUTHENTICATING,
  AUTH_ERROR,
  VERIFYING,
  LOGOUT_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "../actions/types";

const initialState = {
  isLoggedIn: false,
  authenticating: false,
  error: "",
  verifyingUser: true,
  userInfo: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATED:
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userInfo: action.payload,
        verifyingUser: false,
        authenticating: false,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: {},
      };
    case AUTHENTICATING:
      return {
        ...state,
        error: "",
        authenticating: true,
      };
    case VERIFYING:
      return {
        ...state,
        verifyingUser: true,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      return {
        ...state,
        error: action.payload,
        verifyingUser: false,
        authenticating: false,
      };

    default:
      return state;
  }
}
