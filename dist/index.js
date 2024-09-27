"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// This is the entrypoint for the the script.
// This essentially divides the bot into multiple shards for more efficiency.
const discord_js_1 = require("discord.js"); // First, we import the ShardingManager.
const ReadLine = __importStar(require("node:readline")); // Then we import the readline module, this is used later for the CLI.
const manager = new discord_js_1.ShardingManager("./dist/bot.js", {
    // Then we create the ShardingManager with the bot entrypoint.
    token: process.env.TOKEN, // We use the token from the environment variables.
    respawn: true, // We make sure the bot will respawn if it crashes.
});
manager.on("shardCreate", (shard) => {
    // This event is fired when a shard is spawned.
    shard.on("spawn", () => {
        shard.on("ready", async () => {
            // This event is fired when the shard is ready.
            console.log(`Logged in as ${await shard.fetchClientValue("user.tag")}!`, `\n   System Info:`, `\n     Running on ${await shard.fetchClientValue("guilds.cache.size")} server(s)!`, `\n     Running with ${await shard.fetchClientValue("users.cache.size")} member(s)!`, `\n     API Latency: ${await shard.fetchClientValue("ws.ping")}ms`, `\n     Shards: ${await shard.fetchClientValue("shard.count")}`); // Log that the the information.
        });
    });
});
manager.spawn().catch((error) => {
    // Spawn the shards. Catch errors.
    console.error("The shard failed to launch:"); // Log the error.
    console.error(error.stack, error.message, error.name, error.cause, error); // Log the error.
});
const rl = ReadLine.createInterface({
    // Create the readline interface.
    input: process.stdin, // input
    output: process.stdout, // output
});
rl.setPrompt("> "); // Set the prompt.
setTimeout(() => {
    rl.prompt(); // Give the prompt.
}, 2500); // Give the prompt.
rl.on("line", async (input) => {
    // When a line is typed.
    switch (input.split(" ")[0] // Switch on the first word in the line.
    ) {
        case "help": // Give info on the CLI commands.
            console.log("'exit' to quit and turn off the bot", "\n'help' for help", "\n'clear' to clear the console", "\n'echo <text>' to echo text", "\n'restart' to restart the bot");
            break; //
        case "clear": // Clear the console.
            console.clear();
            break;
        case "echo": // Echo the rest of the line.
            const echo = input.split(" ")[1];
            if (!echo)
                console.log("Nothing to echo");
            else
                console.log(echo);
            break;
        case "exit": // Exit the bot.
            console.log("Exit command received, shutting down...");
            manager.broadcastEval((c) => c.destroy());
            setTimeout(() => {
                console.clear();
                process.exit();
            }, 1000);
            break;
        case "restart": // Restart the bot.
            console.log("Restart command received, restarting...");
            await manager.broadcastEval((c) => c.destroy());
            await manager.respawnAll();
            break;
        default: // Invalid command handling.
            console.error("Invalid command");
            console.log("Use 'exit' to quit and turn off the bot, or 'help' for help");
            break;
    }
    rl.prompt(); // re-give the prompt.
});
