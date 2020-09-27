import { UserInfo } from "../../Types/UserInfo";
import { getLocalStorage } from "../../Utils/LocalStorage";
import { getUserInfo } from "../../Types/UserInfo";

type NoUser = {
  loggedIn: false;
}

type LoggedInUser = UserInfo & { token: string, loggedIn: true }

function userStateFromStorage(): UserState {
  const stored = getLocalStorage();
  if (!stored.party || !stored.token) return { loggedIn : false }
  const user = getUserInfo(stored.party);
  if (!user) return { loggedIn: false };
  return { ...user, token: stored.token, loggedIn: true };
}

export const initialUserState: UserState = userStateFromStorage();

export type UserState = LoggedInUser | NoUser;
