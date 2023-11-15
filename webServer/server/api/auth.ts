import generateRandomString from "../utils/generateRandomString";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const state = generateRandomString(16);
    
    const scope = "user-modify-playback-state user-read-playback-state user-read-private user-read-email";
    const queryParams = new URLSearchParams();
    queryParams.set("response_type", "code");
    queryParams.set("client_id", config.clientId);
    queryParams.set("scope", scope);
    queryParams.set("redirect_uri", config.redirectUri);
    queryParams.set("state", state);
  
    const redirectURL = "https://accounts.spotify.com/authorize?" + queryParams.toString();
  
    await sendRedirect(event,  redirectURL , 301)
});


