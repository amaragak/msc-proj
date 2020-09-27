import { userReducer } from "./UserReducer";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  user: userReducer
});
