"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const areCommandsDifferent_1 = __importDefault(require("../../utils/areCommandsDifferent"));
const getApplicationCommands_1 = __importDefault(require("../../utils/getApplicationCommands"));
const getLocalCommands_1 = __importDefault(require("../../utils/getLocalCommands"));
exports.default = async (bot) => {
    try {
        // Define local commands and application commands
        const localCommands = await (0, getLocalCommands_1.default)();
        const applicationCommands = await (0, getApplicationCommands_1.default)(bot, "1267928656877977670");
        // loop through all local commands
        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;
            if (!name) {
                continue;
            }
            // check if command already exists and store in a variable
            const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name);
            // if command exists, check if it's set to be deleted
            if (existingCommand) {
                if (localCommand.deleted) {
                    // if it's set to be deleted, then delete it
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`Deleted command "${name}".`);
                    continue;
                }
                // if commands are different, then update it.
                if ((0, areCommandsDifferent_1.default)(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });
                    // log edited command
                    console.log(`Edited command "${name}".`);
                }
            }
            else {
                // if command is set to be deleted, then skip registering it.
                if (localCommand.deleted) {
                    console.log(`Skipping to register command "${name}" as its set to delete.`);
                    continue;
                }
                // register command
                await applicationCommands.create({
                    name,
                    description,
                    options,
                });
                console.log(`Registered command "${name}".`);
            }
        }
    }
    catch (error) {
        console.log(`There was an error: ${error}`); // Log the error
    }
};
