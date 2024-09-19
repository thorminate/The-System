"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = async (bot) => {
    const welcomeChannel = bot.channels.cache.get("1270790941892153404");
    if (!(welcomeChannel instanceof discord_js_1.TextChannel))
        return;
    await welcomeChannel.bulkDelete(100);
    const welcomeChannelBeginOnboarding = new discord_js_1.ButtonBuilder()
        .setCustomId("begin-onboarding")
        .setLabel("Begin Onboarding")
        .setStyle(discord_js_1.ButtonStyle.Success)
        .setDisabled(false);
    const welcomeChannelBeginOnboardingRow = new discord_js_1.ActionRowBuilder().addComponents(welcomeChannelBeginOnboarding);
    await welcomeChannel.send({
        content: "Hello, and welcome to The System!" +
            " This server is primarily for testing my bot, although we have tons of RP mashed in too!" +
            "\n\nYou are currently not able to see any channels other than a few for the onboarding process and the non-player-hangout area." +
            " These channels are for setting you up, (such as initializing your persona into the database, the persona being your digital presence with the system)" +
            " we will also go through the skill system and how other important stats work." +
            "\n\nWhen you have read through the information, please press the button below, and the bot will validate your persona's existence in the database," +
            " thereafter giving you the <@&1270791621289578607> role." +
            "\n\nBy pressing 'Begin Onboarding', you agree to the [Terms of Service](<https://github.com/thorminate/The-System/wiki/Terms-of-Service>) and [Privacy Policy](<https://github.com/thorminate/The-System/wiki/Privacy-Policy>).",
        components: [welcomeChannelBeginOnboardingRow],
    });
};
