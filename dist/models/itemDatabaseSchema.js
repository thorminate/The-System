"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Model for item database
const mongoose_1 = require("mongoose"); // Import the mongoose library.
const itemData = new mongoose_1.Schema({
    // Define the schema.
    itemName: {
        // Define the item name.
        type: String,
        required: true,
    },
    itemDescription: {
        // Define the item description.
        type: String,
        required: true,
    },
    itemActionable: {
        // Define the item actionable.
        type: String,
        required: true,
    },
    itemAction: {
        // Define the item action.
        type: String,
        required: true,
    },
    itemUsers: {
        // Define the item users.
        type: (Array),
        default: [],
    },
    itemEnvironments: {
        // Define the item environments.
        type: (Array),
        default: [],
    },
});
exports.default = (0, mongoose_1.model)("itemData", itemData); // Export the model.
