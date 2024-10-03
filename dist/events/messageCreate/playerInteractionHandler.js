"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userDatabaseSchema_1 = __importDefault(require("../../models/userDatabaseSchema"));
const skillDatabaseSchema_1 = __importDefault(require("../../models/skillDatabaseSchema"));
const itemDatabaseSchema_1 = __importDefault(require("../../models/itemDatabaseSchema"));
exports.default = async (bot, message) => {
    // if message was not made in a guild, author was a bot or the cooldown is active, return
    if (!message.inGuild() || message.author.bot)
        return;
    async function consumeItem(message, itemName) {
        const userId = message.author.id;
        const user = await userDatabaseSchema_1.default.findOne({ userId: userId });
        if (user) {
            const itemIndex = Array.prototype.findIndex.call(user.inventory, (item) => item && item.itemName === itemName);
            const itemDataConsume = await itemDatabaseSchema_1.default.findOne({ itemName: itemName });
            if (itemIndex > -1) {
                if (!itemDataConsume)
                    return;
                if (itemDataConsume.itemActionable === "consume" &&
                    user.inventory[itemIndex].Amount > 1) {
                    user.inventory[itemIndex].Amount--;
                    await user.save();
                }
                else if (itemDataConsume.itemActionable === "consume") {
                    user.inventory.splice(itemIndex, 1); // Remove the item from the inventory
                    await user.save();
                }
                await message.reply(`Item ${itemName} consumed.`);
            }
            else {
                await message.reply(`Item ${itemName} not found in your inventory.`);
            }
        }
        else {
            await message.reply("You are not registered in the system.");
        }
    }
    async function useSkill(message, skillName) {
        const userId = message.author.id;
        const user = await userDatabaseSchema_1.default.findOne({ userId: userId });
        if (user) {
            if (user.skills.includes(skillName)) {
                const skill = await skillDatabaseSchema_1.default.findOne({ skillName: skillName });
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
                }
                else if (!skillName) {
                    await message.reply({
                        content: "Please specify a skill to use.",
                        ephemeral: true,
                    });
                }
                else {
                    await message.reply(`Skill ${skillName} not found.`);
                }
            }
            else {
                await message.reply(`Skill ${skillName} not found.`);
            }
        }
        else {
            await message.reply("You are not registered in the system.");
        }
    }
    const content = message.content.trim();
    const bracketContent = content.match(/\[(.*?)\]/g);
    if (bracketContent) {
        const bracketTexts = bracketContent.map((x) => x.slice(1, -1));
        for (const text of bracketTexts) {
            if (text.toLowerCase().includes("consume")) {
                const itemName = text.split(" ")[1];
                await consumeItem(message, itemName);
            }
            else {
                const skillName = text.toLowerCase();
                await useSkill(message, skillName);
            }
        }
    }
};
