import spotifyApi from "~~/server/spotifyApi/spotify";
import { Device } from "~~/server/models/device.model";

export default defineEventHandler(async (event) => {
  const header = getHeader(event, "Authorization");

  try {
    const response = await spotifyApi.getDevices({
      Authorization: header,
      "Content-Type": "application/json",
    });
    
    return { ...response.data };
  } catch (error) {
    return { error };
  }
});
