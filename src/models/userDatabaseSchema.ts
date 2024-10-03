// The schema for the user database
import { Schema, model } from "mongoose"; // Import the mongoose library.

const userData = new Schema({
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
  environment: {
    // Define the current environment.
    type: String,
    default: "start",
  },
  level: {
    // Define the level.
    type: Number,
    default: 1,
  },
  exp: {
    // Define the exp.
    type: Number,
    default: 0,
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
  species: {
    // Define the species.
    type: String,
    default: "human",
  },
  class: {
    // Define the class.
    type: String,
    default: "warrior",
  },
  skills: {
    // Define the skills.
    type: Array<string>,
    default: [],
  },
  inventory: {
    // Define the inventory.
    type: Array<object>,
    default: [],
  },
  statusEffects: {
    // Define the status effects.
    type: Array<object>,
    default: [],
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
  isOnboard: {
    // Define the isOnboard.
    type: Boolean,
    default: false,
  },
});

export default model("userDatabase", userData); // Export the model.
