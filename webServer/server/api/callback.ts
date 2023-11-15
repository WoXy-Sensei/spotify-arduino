import { useUserStore } from "~/stores/user";
import authApi from "~~/server/spotifyApi/auth";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const code = query.code;
  const state = query.state;

  if (state === null) {
    await sendRedirect(event, "/error", 302);
  } else {
    const tokens = await authApi.login(
      {
        code: code,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
      },
      {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(`${config.clientId}:${config.clientSecret}`),
      }
    );

    const accessToken = tokens.data.access_token;
    const refreshToken = tokens.data.refresh_token;

    // Increase the count (nuxt-session will persist all changes made to `event.context.session` after the return)
    event.context.session.accessToken = accessToken;
    event.context.session.refreshToken = refreshToken;

    await sendRedirect(event, "/", 200);
  }
});
