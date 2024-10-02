// when an event is triggered, it runs all files in that event's folder

import { Client } from "discord.js"; // Get the discord.js library for setting the type of the bot parameter.
import path from "path"; // Get the path library.
import getAllFiles from "../utils/getAllFiles"; // Get the getAllFiles function.
import url from "url";

export default (bot: Client) => {
  // Export the function.
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true); // Get the event folders.

  for (const eventFolder of eventFolders) {
    // Loop through the event folders.
    const eventFiles = getAllFiles(eventFolder); // Get the event files.
    eventFiles.sort((a: string, b: string) => a.localeCompare(b)); // Sort the event files.

    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop(); // Get the event name.

    bot.on(eventName, async (arg) => {
      // When the event that is the same name as the event folder is triggered.
      for (const eventFile of eventFiles) {
        // Loop through the event files.
        const filePath = path.resolve(eventFile); // Get the path to the event file.
        const fileUrl = url.pathToFileURL(filePath); // Get the URL to the event file.
        const eventFunction = await import(fileUrl.toString()); // Get the event function.
        eventFunction.default.default(bot, arg); // Run the event function. (no idea why the extra default is needed)
      }
    });
  }
};
