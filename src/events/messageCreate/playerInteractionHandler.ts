import { Message, Client } from "discord.js";
import userData from "../../models/userDatabaseSchema";
import skillData from "../../models/skillDatabaseSchema";
import itemData from "../../models/itemDatabaseSchema";

export default async (bot: Client, message: Message) => {
  // if message was not made in a guild, author was a bot or the cooldown is active, return
  if (!message.inGuild() || message.author.bot) return;
  async function consumeItem(message: any, itemName: any) {
    const userId = message.author.id;
    const user = await userData.findOne({ userId: userId });

    if (user) {
      const itemIndex = Array.prototype.findIndex.call(
        user.inventory,
        (item: { itemName: any }) => item && item.itemName === itemName
      );
      const itemDataConsume = await itemData.findOne({ itemName: itemName });

      if (itemIndex > -1) {
        if (!itemDataConsume) return;
        if (
          itemDataConsume.itemActionable === "consume" &&
          user.inventory[itemIndex].Amount > 1
        ) {
          user.inventory[itemIndex].Amount--;
          await user.save();
        } else if (itemDataConsume.itemActionable === "consume") {
          user.inventory.splice(itemIndex, 1); // Remove the item from the inventory
          await user.save();
        }

        await message.reply(`Item ${itemName} consumed.`);
      } else {
        await message.reply(`Item ${itemName} not found in your inventory.`);
      }
    } else {
      await message.reply("You are not registered in the system.");
    }
  }
  async function useSkill(message: any, skillName: any) {
    const userId = message.author.id;
    const user = await userData.findOne({ userId: userId });

    if (user) {
      if (user.skills.includes(skillName)) {
        const skill = await skillData.findOne({ skillName: skillName });

        if (skill) {
          // Perform the skill action here
          if (user.will < skill.skillWill) {
            await message.reply({
              content: "You don't have enough will to use this skill.",
              ephemeral: true,
            });
            return;
          }
          const skillAction = skill.skillAction;
          await message.reply(skillAction);
        } else if (!skillName) {
          await message.reply({
            content: "Please specify a skill to use.",
            ephemeral: true,
          });
        } else {
          await message.reply(`Skill ${skillName} not found.`);
        }
      } else {
        await message.reply(`Skill ${skillName} not found.`);
      }
    } else {
      await message.reply("You are not registered in the system.");
    }
  }

  const content = message.content.trim();

  const bracketContent = content.match(/\[(.*?)\]/g);

  if (bracketContent) {
    const bracketTexts = bracketContent.map((x: string) => x.slice(1, -1));

    for (const text of bracketTexts) {
      if (text.toLowerCase().includes("consume")) {
        const itemName = text.split(" ")[1];
        await consumeItem(message, itemName);
      } else {
        const skillName = text.toLowerCase();
        await useSkill(message, skillName);
      }
    }
  }
};
