"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path")); // Get the path library.
const getAllFiles_1 = __importDefault(require("../utils/getAllFiles")); // Get the getAllFiles function.
exports.default = (exceptions = []) => {
    // Export the function.
    let localCommands = []; // define local commands as an array
    const commandCategories = (0, getAllFiles_1.default)(
    // get all command categories and store in an array
    path_1.default.join(__dirname, "..", "commands"), // get the path to the commands folder
    true // folders only
    );
    for (const commandCategory of commandCategories) {
        // loop through all command categories.
        const commandFiles = (0, getAllFiles_1.default)(commandCategory); // get all files in the command category
        for (const commandFile of commandFiles) {
            // loop through all files in the command category
            const commandObject = require(commandFile); // require the file
            if (exceptions.includes(commandObject.name)) {
                // if the command name is in the exceptions array
                continue; // skip the command
            }
            localCommands.push(commandObject); // add the command to the local commands array
        }
    }
    return localCommands; // return the array of local commands
};
