"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Model for skill database
const mongoose_1 = require("mongoose"); // Import the mongoose library.
const skillData = new mongoose_1.Schema({
    // Define the schema.
    skillName: {
        // Define the skill name.
        type: String,
        required: true,
    },
    skillDescription: {
        // Define the skill description.
        type: String,
        required: true,
    },
    skillAction: {
        // Define the skill action.
        type: String,
        required: true,
    },
    skillCooldown: {
        // Define the skill cooldown.
        type: Number,
        required: true,
    },
    skillWill: {
        // Define the skill will.
        type: Number,
        required: true,
    },
    skillUsers: {
        // Define the skill users.
        type: (Array),
        default: [],
    },
});
exports.default = (0, mongoose_1.model)("skillData", skillData); // Export the model.
