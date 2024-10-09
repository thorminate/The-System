import { Client, User } from "discord.js";
import StatusEffectData from "../../models/statusEffectDatabaseSchema";
import UserData from "../../models/userDatabaseSchema";

/**
 * This gets all the status effects and makes sure they haven't expired.
 * @param {Client} bot The instantiating client.
 */
export default async (bot: Client) => {
  process.stdout.write("Validating all status effects... ");
  // first get all status effects in the database.
  const statusEffects = await StatusEffectData.find({});

  statusEffects.forEach(async (statusEffect) => {
    statusEffect.users.forEach(async (user) => {
      const userData = await UserData.findOne({
        id: user,
      });

      userData.statusEffects.filter((statusEffect) => {
        if (statusEffect.timestamp < Date.now()) {
          return false;
        } else {
          return true;
        }
      });
    });
  });

  process.stdout.write("Done!\n");
};
