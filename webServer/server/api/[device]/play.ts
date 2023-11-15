import spotifyApi from "~~/server/spotifyApi/spotify";
import { Device } from "~~/server/models/device.model";
import { Card } from "~~/server/models/card.model";

export default defineEventHandler(async (event) => {
  const deviceId = getRouterParam(event, "device");
  const cardId = getQuery(event).cardId;
  let album = null;

  const card = await Card.findOne({ cardId: cardId });
  if (card) {
    album = card.value;
  }

  const device = await Device.findOne({ deviceId: deviceId });
  if (device) {
    const spotifyDeviceId = device.spotifyDeviceId;

    try {
      const response = await spotifyApi.play(
        { context_uri: "spotify:album:" + album },
        {
          Authorization: "Bearer " + device.accessToken,
          "Content-Type": "application/json",
        },
        spotifyDeviceId
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      return { error };
    }
  }
});
