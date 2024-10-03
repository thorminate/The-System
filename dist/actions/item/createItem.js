"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const itemDatabaseSchema_1 = __importDefault(require("../../models/itemDatabaseSchema"));
exports.default = async (interaction, itemName, itemDescription, itemActionType) => {
    console.log(itemName, itemDescription, itemActionType);
    const item = await itemDatabaseSchema_1.default.findOne({ itemName: itemName });
    if (item) {
        interaction.reply({
            content: "An item with that name already exists.",
            ephemeral: true,
        });
        return;
    }
    const newItem = new itemDatabaseSchema_1.default({
        itemName: itemName,
        itemDescription: itemDescription,
        itemActionable: itemActionType,
    });
    await newItem.save();
    await interaction.reply({
        content: `Successfully created item ${itemName}.`,
        ephemeral: true,
    });
    setTimeout(() => {
        interaction.deleteReply();
    }, 5000);
};
