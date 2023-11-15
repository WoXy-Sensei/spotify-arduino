import { Schema, model } from "mongoose";

const DeviceSchema = new Schema({
  deviceId: String,
  name: String,
  spotifyDeviceId: String,
  accessToken: String,
  refreshToken: String,
});

export const Device = model("Device", DeviceSchema);
