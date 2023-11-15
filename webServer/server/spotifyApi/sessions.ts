import axios from "axios";

const CSRF_COOKIE_NAME = "csrftoken";
const CSRF_HEADER_NAME = "X-CSRFToken";

const authSession = axios.create({
  xsrfCookieName: CSRF_COOKIE_NAME,
  xsrfHeaderName: CSRF_HEADER_NAME,
  baseURL: "https://accounts.spotify.com",
});

const spotifySession = axios.create({
  xsrfCookieName: CSRF_COOKIE_NAME,
  xsrfHeaderName: CSRF_HEADER_NAME,
  baseURL: "https://api.spotify.com/v1",
});


export{
  authSession,
  spotifySession
}