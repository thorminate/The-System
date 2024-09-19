"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (interaction) => {
    // Export the function.
    if (!interaction.inGuild()) {
        // if the command is not in a guild
        interaction.reply(
        // reply to the command
        "This command can only be used in a server");
        return false;
    }
    return true;
};
