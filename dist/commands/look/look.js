"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commandVerify_1 = __importDefault(require("../../utils/commandVerify"));
const userDatabaseSchema_1 = __importDefault(require("../../models/userDatabaseSchema"));
const environmentDatabaseSchema_1 = __importDefault(require("../../models/environmentDatabaseSchema"));
module.exports = {
    name: "look",
    description: "Look around in your current environment",
    //devOnly: Boolean,
    //testOnly: true,
    //permissionsRequired: [PermissionFlagsBits.Administrator],
    //botPermissions: [PermissionFlagsBits.Administrator],
    //options: [],
    //deleted: true,
    callback: async (bot, interaction) => {
        try {
            if (!(0, commandVerify_1.default)(interaction))
                return;
            await interaction.deferReply({
                ephemeral: true,
            });
            const userId = interaction.member.id;
            const userData = await userDatabaseSchema_1.default.findOne({
                userId: userId,
                guildId: interaction.guild.id,
            });
            if (!userData) {
                await interaction.editReply({
                    content: "You haven't been integrated into the system yet. Head over to <#1270790941892153404>",
                });
                return;
            }
            const userEnvironmentData = await environmentDatabaseSchema_1.default.findOne({
                environmentName: userData.environment,
            });
            if (!userEnvironmentData) {
                await interaction.editReply({
                    content: "You aren't inside an environment",
                });
                return;
            }
            if (userEnvironmentData.environmentChannel !== interaction.channel.id) {
                await interaction.editReply({
                    content: `You can only look in your current environment, <#${userEnvironmentData.environmentChannel}>`,
                });
                return;
            }
            await interaction.editReply({
                content: (await userEnvironmentData).environmentItems.join(", "),
            });
        }
        catch (error) {
            console.log(error);
        }
    },
};
