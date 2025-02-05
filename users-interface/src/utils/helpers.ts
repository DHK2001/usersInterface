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
