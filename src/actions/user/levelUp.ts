import { Document } from "mongodb";

function getRandomMultiplier(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Levels up the user and returns the new level.
 * @param {Document} user
 * @param {number} levelAmount The amount of levels to level up, defaults to 1.
 * @returns {Promise<Document>}
 */
export default async (
  user: Document,
  levelAmount: number = 1
): Promise<Document> => {
  if (levelAmount < 1) {
    return user;
  }
  const strengthMultiplied =
    getRandomMultiplier(1, 5) * user.strengthMultiplier;
  const willMultiplied = getRandomMultiplier(1, 5) * user.willMultiplier;
  const cognitionMultiplied =
    getRandomMultiplier(1, 5) * user.cognitionMultiplier;

  for (let i = 0; i < levelAmount; i++) {
    user.exp = 0;
    user.level++;
    user.strength += strengthMultiplied;
    user.will += willMultiplied;
    user.cognition += cognitionMultiplied;
  }

  // then round the values
  user.strength = Math.round(user.strength);
  user.will = Math.round(user.will);
  user.cognition = Math.round(user.cognition);

  await user.save().catch(console.error);
  return user;
};
