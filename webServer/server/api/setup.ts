import { Device } from "~~/server/models/device.model";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const deviceId = body.deviceId;

  const device = await Device.findOne({ deviceId: deviceId });

  if (device) {
    return device;
  }

  const createDevice = await Device.create({
    deviceId: body.deviceId,
    name: body.name,
    spotifyDeviceId: body.spotifyDeviceId,
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
  });

  return createDevice;
});
