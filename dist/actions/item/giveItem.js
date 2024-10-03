"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userDatabaseSchema_1 = __importDefault(require("../../models/userDatabaseSchema"));
const itemDatabaseSchema_1 = __importDefault(require("../../models/itemDatabaseSchema"));
exports.default = async (interaction, itemName, targetId, amount) => {
    const targetData = await userDatabaseSchema_1.default.findOne({
        // get user data
        userId: targetId,
        guildId: interaction.guild.id,
    });
    if (!targetData) {
        // check if user exists
        await interaction.reply({
            content: "User not found, make sure they exist in the database.",
            ephemeral: true,
        });
    }
    const itemData = await itemDatabaseSchema_1.default.findOne({
        // get item data
        itemName: itemName,
    });
    if (!itemData) {
        // check if item exists
        await interaction.reply({
            content: "Item not found, make sure it exists in the database",
            ephemeral: true,
        });
    }
    const itemIndex = targetData.inventory.findIndex(
    // get index of item whose name matches the item name
    (item) => item.itemName === itemData.itemName);
    // check if item exists in inventory (-1 means it doesn't exist)
    if (itemIndex === -1) {
        // item doesn't exist in inventory
        targetData.inventory.push({
            // add item to inventory
            itemName: itemData.itemName,
            itemAmount: amount,
        });
    }
    else {
        // item exists in inventory
        targetData.inventory[itemIndex].itemAmount += amount; // add amount to existing item
    }
    itemData.itemUsers.push(targetId);
    await targetData.save();
    await itemData.save();
    await interaction.reply({
        content: `Successfully gave ${amount}x ${itemName} to <@${targetId}>.`,
        ephemeral: true,
    });
};
