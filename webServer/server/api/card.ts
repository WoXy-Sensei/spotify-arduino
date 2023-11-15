import { Card } from "~~/server/models/card.model";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const cardId = body.cardId;

  const card = await Card.findOne({ cardId: cardId });
  if (card) {
    if (body.value != null) {
      const updateCard = await Card.findOneAndUpdate(
        { cardId: cardId },
        { value: body.value }
      );
      return updateCard;
    }
    return card;
  }
  const createCard = await Card.create({
    value: body.value,
    cardId: cardId,
  });
  return createCard;
});
