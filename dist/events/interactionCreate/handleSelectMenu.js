"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Handles the select menus.
 * @param {Client} bot The instantiating client.
 * @param {Interaction} interaction The interaction that ran the command.
 */
const userDatabaseSchema_1 = __importDefault(require("../../models/userDatabaseSchema"));
const discord_js_1 = require("discord.js");
exports.default = async (bot, interaction) => {
    switch (interaction.customId) {
        case "species-select":
            if (!interaction.isStringSelectMenu())
                return;
            let user = await userDatabaseSchema_1.default.findOne({ userId: interaction.user.id });
            if (!user) {
                const newUser = new userDatabaseSchema_1.default({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                });
                user = newUser;
            }
            await interaction.values.forEach(async (value) => {
                user.species = value;
                if (value === "Human") {
                    user.strengthMultiplier = 1.1;
                    user.willMultiplier = 1.1;
                    user.cognitionMultiplier = 1.1;
                }
                else if (value === "Elf") {
                    user.strengthMultiplier = 0.9;
                    user.willMultiplier = 1.3;
                    user.cognitionMultiplier = 1.1;
                }
                else if (value === "Dwarf") {
                    user.strengthMultiplier = 1.1;
                    user.willMultiplier = 0.9;
                    user.cognitionMultiplier = 1.3;
                }
                else if (value === "Orc") {
                    user.strengthMultiplier = 1.3;
                    user.willMultiplier = 1.1;
                    user.cognitionMultiplier = 0.9;
                }
                await user.save();
                const classMenu = new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId("class-select")
                    .setPlaceholder("Select your class!")
                    .addOptions(new discord_js_1.StringSelectMenuOptionBuilder()
                    .setLabel("Warrior")
                    .setDescription("Warriors are the most common and versatile class.")
                    .setEmoji("⚔️")
                    .setValue("Warrior"), new discord_js_1.StringSelectMenuOptionBuilder()
                    .setLabel("Ranger")
                    .setDescription("Rangers are known for their quick and stealthy moves.")
                    .setEmoji("🏹")
                    .setValue("Ranger"), new discord_js_1.StringSelectMenuOptionBuilder()
                    .setLabel("Rogue")
                    .setDescription("Rogues are known for their sneaky and stealthy moves.")
                    .setEmoji("🗡️")
                    .setValue("Rogue"));
                const classRow = new discord_js_1.ActionRowBuilder().addComponents(classMenu);
                interaction.reply({
                    content: "Perfect! Now select your class!",
                    components: [classRow],
                    ephemeral: true,
                });
            });
            break;
        case "class-select":
            if (!interaction.isStringSelectMenu())
                return;
            const selectedClass = interaction.values[0];
            const userClass = await userDatabaseSchema_1.default.findOne({ userId: interaction.user.id });
            if (userClass) {
                userClass.class = selectedClass;
                userClass.isOnboard = true;
                await userClass.save();
                interaction.reply({
                    content: "Your class has been set! Welcome aboard, player.",
                    ephemeral: true,
                });
                const onboardingChannel = interaction.guild.channels.cache.get("1270790941892153404");
                if (!onboardingChannel) {
                    interaction.reply({
                        content: "Onboarding channel doesn't exist! Please contact an admin.",
                        ephemeral: true,
                    });
                    return;
                }
                const messages = await onboardingChannel.messages.fetch({ limit: 1 });
                const message = messages.first();
                const resetButton = new discord_js_1.ButtonBuilder()
                    .setCustomId("welcome-channel-begin-onboarding")
                    .setLabel("Begin Onboarding")
                    .setStyle(discord_js_1.ButtonStyle.Success)
                    .setDisabled(false);
                const resetRow = new discord_js_1.ActionRowBuilder().addComponents(resetButton);
                await message.edit({
                    components: [resetRow],
                });
                setTimeout(() => {
                    interaction.member.roles.add("1270791621289578607");
                }, 4000);
            }
            break;
    }
};
