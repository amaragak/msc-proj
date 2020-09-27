import { UserAction, UserActionTypes } from "../Actions/UserActions";
import { UserState, initialUserState } from "../State/UserState";

export function userReducer(state = initialUserState, action: UserAction): UserState {
  switch (action.type) {
    case UserActionTypes.LOGIN_SUCCESS:
      return { ...action.user, loggedIn: true };
    case UserActionTypes.LOGIN_FAILURE:
      return { loggedIn: false };
    case UserActionTypes.SIGNOUT_SUCCESS:
      return { loggedIn: false };
  }
  
  return state;
}
