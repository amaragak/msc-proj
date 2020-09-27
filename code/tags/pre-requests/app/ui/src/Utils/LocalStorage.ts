export function setLocalStorage(party: string, token: string) {
  localStorage.setItem("daml.party", party);
  localStorage.setItem("daml.token", token);
}

export function getLocalStorage() {
  return {
    party: localStorage.getItem("daml.party"),
    token: localStorage.getItem("daml.token")
  };
}

export function clearLocalStorage() {
  localStorage.removeItem("daml.party");
  localStorage.removeItem("daml.token");
}

