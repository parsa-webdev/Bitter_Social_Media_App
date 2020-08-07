import cookieparser from "cookieparser";
import jwtDecode from "jwt-decode";

export const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);
};

export function getUserFromToken() {
  try {
    const parsed = cookieparser.parse(document.cookie);
    const accessTokenCookie = parsed.access_token;
    if (!accessTokenCookie) return null;

    const decodedToken = jwtDecode(accessTokenCookie);
    if (!decodedToken) return null;

    return decodedToken;
  } catch (err) {
    return null;
  }
}
