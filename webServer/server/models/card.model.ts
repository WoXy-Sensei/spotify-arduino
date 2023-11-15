import { Schema, model } from "mongoose";

const CardSchema = new Schema({
  cardId: String,
  value: String,
});

export const Card = model("Card", CardSchema);
