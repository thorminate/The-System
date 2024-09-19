// Model for skill database
import { Schema, model } from "mongoose"; // Import the mongoose library.

const skillData = new Schema({
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
    type: Array<string>,
    default: [],
  },
});

export default model("skillData", skillData); // Export the model.
