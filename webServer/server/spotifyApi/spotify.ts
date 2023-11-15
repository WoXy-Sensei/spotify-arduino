import { spotifySession } from "./sessions";

export default {
  //player
  play(body: any, headers: any, device_id: any) {
    return spotifySession.put("/me/player/play", body, {
      headers: headers,
      params: {
        device_id: device_id,
      },
    });
  },
  getDevices(headers: any) {
    return spotifySession.get("/me/player/devices", {
      headers: headers,
    });
  },

  getUser(headers: any) {
    return spotifySession.get("/me", {
      headers: headers,
    });
  },
};
