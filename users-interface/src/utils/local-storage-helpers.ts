export function localStorageSetId(userId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("userId", userId);
  }
}

export function localStorageGetId() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId");
  }
  return null;
}

export function localStorageSetToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function localStorageGetToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}