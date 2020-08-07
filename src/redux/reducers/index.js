import { combineReducers } from "redux";
import authReducer from "./authReducer";
import bittsReducer from "./bittsReducer";

export default combineReducers({
  auth: authReducer,
  bitts: bittsReducer,
});
