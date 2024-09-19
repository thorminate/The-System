// Model for status effect database
import { Schema, model } from "mongoose"; // Import the mongoose library.

const statusEffectData = new Schema({
  // Define the schema.
  statusEffectName: {
    // Define the status effect name.
    type: String,
    required: true,
  },
  statusEffectDescription: {
    // Define the status effect description.
    type: String,
    required: true,
  },
  statusEffectDuration: {
    // Define the status effect duration.
    type: Number,
    required: true,
  },
  statusEffectAction: {
    // Define the status effect action.
    type: String,
    required: true,
  },
  statusEffectUsers: {
    // Define the status effect users.
    type: Array<string>,
    default: [],
  },
});

export default model("statusEffectData", statusEffectData); // Export the model.
