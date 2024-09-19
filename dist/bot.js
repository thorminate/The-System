"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This file is the main entrypoint for the shards.
 * It defines the bot and connects it to the Discord and MongoDB.
 * @param {Client} bot
 * @param {string} token
 */
const discord_js_1 = require("discord.js"); // Get the discord.js library.
const mongoose_1 = __importDefault(require("mongoose")); // Get the mongoose library.
const eventHandler_1 = __importDefault(require("./handlers/eventHandler")); // Get the event handler.
// Define 'bot'
const bot = new discord_js_1.Client({
    // Create the bot.
    intents: [
        // With all the intents.
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildModeration,
        discord_js_1.IntentsBitField.Flags.GuildEmojisAndStickers,
        discord_js_1.IntentsBitField.Flags.GuildIntegrations,
        discord_js_1.IntentsBitField.Flags.GuildWebhooks,
        discord_js_1.IntentsBitField.Flags.GuildInvites,
        discord_js_1.IntentsBitField.Flags.GuildVoiceStates,
        discord_js_1.IntentsBitField.Flags.GuildMessageReactions,
        discord_js_1.IntentsBitField.Flags.GuildMessageTyping,
        discord_js_1.IntentsBitField.Flags.DirectMessages,
        discord_js_1.IntentsBitField.Flags.DirectMessageReactions,
        discord_js_1.IntentsBitField.Flags.DirectMessageTyping,
        discord_js_1.IntentsBitField.Flags.GuildScheduledEvents,
        discord_js_1.IntentsBitField.Flags.AutoModerationConfiguration,
        discord_js_1.IntentsBitField.Flags.AutoModerationExecution,
        discord_js_1.IntentsBitField.Flags.GuildMessagePolls,
        discord_js_1.IntentsBitField.Flags.DirectMessagePolls,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.MessageContent,
        discord_js_1.IntentsBitField.Flags.GuildPresences,
    ],
});
const MongoDBToken = process.env.MONGODB_URI + "/the_system"; // Get the MongoDB token.
const DiscordToken = process.env.TOKEN; // Get the Discord token.
// Connect to DB and Discord.
(async () => {
    // Connect to MongoDB and Discord asynchronously.
    try {
        // Try
        process.stdout.write("Attempting to connect to DB..."); // Log that we are attempting to connect to the DB.
        await mongoose_1.default.connect(MongoDBToken).then(() => {
            //Change the text to say "Attempting to connect to DB... Connected"
            process.stdout.write(" Connected\n");
        }); // Connect to the DB. When the connection is successful, log that it was successful.
        process.stdout.write("Setting up events..."); // Log that we are setting up the events.
        (0, eventHandler_1.default)(bot); // Set up the events.
        process.stdout.write(" Confirmed\n");
        process.stdout.write("Establishing connection to Discord..."); // Log that we are connecting to Discord.
        await bot
            .login(DiscordToken)
            .then(() => process.stdout.write(" Connected\n")); // Connect to Discord. When the connection is successful, log that it was successful.
    }
    catch (error) {
        // Catch
        console.log(`Index Error: ${error}`); // Log the error.
    }
})();
