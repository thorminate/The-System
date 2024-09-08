// gets application commands from guild or global.
import {
  ApplicationCommand,
  ApplicationCommandManager,
  Client,
  GuildApplicationCommandManager,
  GuildResolvable,
} from "discord.js";

module.exports = async (bot: Client, guildId: string | null) => {
  //define applicationCommands.
  let applicationCommands: any;

  // if guildId is not undefined, fetch guild commands. else fetch global commands.
  if (guildId) {
    const guild = await bot.guilds.fetch(guildId);
    applicationCommands = guild.commands;
  } else {
    applicationCommands = await bot.application.commands;
  }

  // fetch and return application commands.
  await applicationCommands.fetch();
  return applicationCommands;
};
