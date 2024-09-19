"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The schema for the user database
const mongoose_1 = require("mongoose"); // Import the mongoose library.
const userData = new mongoose_1.Schema({
    // Define the schema.
    userId: {
        // Define the user id.
        type: String,
        required: true,
    },
    guildId: {
        // Define the guild id.
        type: String,
        required: true,
    },
    exp: {
        // Define the exp.
        type: Number,
        default: 0,
    },
    level: {
        // Define the level.
        type: Number,
        default: 1,
    },
    strength: {
        // Define the strength.
        type: Number,
        default: 0,
    },
    will: {
        // Define the will.
        type: Number,
        default: 0,
    },
    cognition: {
        // Define the cognition.
        type: Number,
        default: 0,
    },
    skills: {
        // Define the skills.
        type: (Array),
        default: [],
    },
    inventory: {
        // Define the inventory.
        type: (Array),
        default: [],
    },
    species: {
        // Define the species.
        type: String,
        default: "human",
    },
    isOnboard: {
        // Define the isOnboard.
        type: Boolean,
        default: false,
    },
    class: {
        // Define the class.
        type: String,
        default: "warrior",
    },
    willMultiplier: {
        // Define the will multiplier.
        type: Number,
        default: 1,
    },
    strengthMultiplier: {
        // Define the strength multiplier.
        type: Number,
        default: 1,
    },
    cognitionMultiplier: {
        // Define the cognition multiplier.
        type: Number,
        default: 1,
    },
    statusEffects: {
        // Define the status effects.
        type: (Array),
        default: [],
    },
});
exports.default = (0, mongoose_1.model)("userDatabase", userData); // Export the model.
