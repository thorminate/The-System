"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Model for environment database
const mongoose_1 = require("mongoose"); // Import the mongoose library.
const environmentData = new mongoose_1.Schema({
    // Define the schema.
    environmentName: {
        // Define the environment name.
        type: String,
        required: true,
    },
    environmentChannel: {
        // Define the environment channel.
        type: String,
        required: true,
    },
    environmentItems: {
        // Define the environment items.
        type: (Array),
        default: [],
    },
    environmentUsers: {
        // Define the environment users.
        type: (Array),
        default: [],
    },
});
exports.default = (0, mongoose_1.model)("environmentDatabase", environmentData); // Export the model.
