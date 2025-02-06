import { setCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

export const storeTokenInCookie = (token: any) => {
  setCookie("access_token", token, { maxAge: 60 * 60 * 24 });
};

export const getTokenFromCookie = () => {
  return getCookie("access_token");
};

export const getUserIdFromToken = (token: string) => {
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return (decodedToken as { id: string }).id;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export const isTokenValid = (token: string) => {
  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token) as { exp: number };

    if (!decodedToken.exp) {
      console.error("Token does not contain an expiration date.");
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Invalid token", error);
    return false;
  }
};
