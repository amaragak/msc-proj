import { UserInfo } from "../../Types/UserInfo";
import { Action } from "./Action";

const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_FAILURE = "LOGIN_FAILURE";
const SIGNOUT_SUCCESS = "SIGNOUT_SUCCESS";

export const UserActionTypes = {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNOUT_SUCCESS
} as const;

interface LoginSuccess extends Action {
  type: typeof UserActionTypes.LOGIN_SUCCESS;
  user: UserInfo & { token: string };
}

interface LoginFailure extends Action {
  type: typeof UserActionTypes.LOGIN_FAILURE;
}

interface SignoutSuccess extends Action {
  type: typeof UserActionTypes.SIGNOUT_SUCCESS;
}

export type UserAction = LoginSuccess | LoginFailure | SignoutSuccess;

export function loginSuccess(user: UserInfo, token: string): UserAction {
  return {
    type: LOGIN_SUCCESS,
    user: { ...user, token }
  };
}

export function loginFailure(): UserAction {
  return { 
    type: LOGIN_FAILURE
  };
}

export function signoutSuccess(): UserAction {
  return {
    type: SIGNOUT_SUCCESS
  };
}
