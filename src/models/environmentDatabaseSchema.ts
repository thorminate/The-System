// Model for environment database
import { Schema, model } from "mongoose"; // Import the mongoose library.

const environmentData = new Schema({
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
    type: Array<object>,
    default: [],
  },
  environmentUsers: {
    // Define the environment users.
    type: Array<string>,
    default: [],
  },
});

export default model("environmentDatabase", environmentData); // Export the model.
