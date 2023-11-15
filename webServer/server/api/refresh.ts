import authApi from "~~/server/spotifyApi/auth";
import { Device } from "../models/device.model";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const deviceId = getQuery(event).deviceId;

  
  const device = await Device.findOne({ deviceId: deviceId });

  if (device) {
    const token = await authApi.refresh(
      {
        client_id: config.clientId,
        refresh_token: device.refreshToken,
        grant_type: "refresh_token",
      },
      {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(`${config.clientId}:${config.clientSecret}`),
      }
    );
      
    await Device.findOneAndUpdate({ deviceId: deviceId }, { accessToken: token.data.access_token })
    const accessToken = token.data.access_token;

    return { status: 200, data: { accessToken: accessToken } };
  }
});
