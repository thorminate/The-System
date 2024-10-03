"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const itemDatabaseSchema_1 = __importDefault(require("../../models/itemDatabaseSchema"));
const userDatabaseSchema_1 = __importDefault(require("../../models/userDatabaseSchema"));
const environmentDatabaseSchema_1 = __importDefault(require("../../models/environmentDatabaseSchema"));
exports.default = async (interaction, itemName) => {
    const itemData = await itemDatabaseSchema_1.default.findOne({
        itemName: itemName,
    });
    if (!itemData) {
        await interaction.reply({
            content: "Item not found, make sure it exist in the database",
            ephemeral: true,
        });
        return;
    }
    // Delete the item from people's inventories
    for (const user of itemData.itemUsers) {
        const userData = await userDatabaseSchema_1.default.findOne({
            userId: user,
            guildId: interaction.guild.id,
        });
        userData.inventory = userData.inventory.filter((item) => item.itemName !== itemName);
        await userData.save();
    }
    // Delete the item from environments
    for (const environment of itemData.itemEnvironments) {
        const environmentData = await environmentDatabaseSchema_1.default.findOne({
            environmentName: environment,
        });
        environmentData.environmentItems = environmentData.environmentItems.filter((item) => item.itemName !== itemName);
    }
    // Delete the item from the database.
    await itemData.deleteOne();
    await interaction.reply({
        content: `Successfully deleted item ${itemName}.`,
        ephemeral: true,
    });
};
