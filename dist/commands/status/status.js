"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// shows your status
const discord_js_1 = require("discord.js");
const userDatabaseSchema_1 = __importDefault(require("../../models/userDatabaseSchema"));
const calculateLevelExp_1 = __importDefault(require("../../utils/calculateLevelExp"));
const buttonWrapper_1 = __importDefault(require("../../utils/buttonWrapper"));
const commandVerify_1 = __importDefault(require("../../utils/commandVerify"));
module.exports = {
    name: "status",
    description: "Shows your personal menu",
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
            // defer reply and make it ephemeral
            await interaction.deferReply({
                ephemeral: true,
            });
            //define targetUserObj
            const userId = interaction.member.id;
            const userObj = await interaction.guild.members.fetch(userId);
            // find user in database and then get their data
            const userData = await userDatabaseSchema_1.default.findOne({
                userId: userId,
                guildId: interaction.guild.id,
            });
            // if user doesn't exist in database, say so and return
            if (!userData) {
                interaction.editReply("You haven't been integrated into the system yet. Head over to <#1270790941892153404>");
                return;
            }
            let skillsDisplay;
            if (userData.skills && userData.skills.length > 0) {
                skillsDisplay = userData.skills
                    .map((skill) => {
                    const skillUppercaseLetter = skill[0].toUpperCase();
                    return `${skillUppercaseLetter}${skill.slice(1)}`;
                })
                    .join(", ");
            }
            else {
                skillsDisplay = "No skills learned yet";
            }
            async function playerMenu(prevAdmin = false) {
                if (!interaction.isCommand())
                    return;
                const inventory = new discord_js_1.ButtonBuilder()
                    .setLabel("Inventory")
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setCustomId("inventory")
                    .setDisabled(false);
                let playerReply;
                if (prevAdmin === true) {
                    const backToAdmin = new discord_js_1.ButtonBuilder()
                        .setLabel("Reload as admin")
                        .setStyle(discord_js_1.ButtonStyle.Primary)
                        .setCustomId("backAsAdmin")
                        .setDisabled(false);
                    playerReply = await interaction.editReply({
                        content: `Hello <@${userObj.user.id}>!\nYour level is **${userData.level}** and you have **${userData.exp}/${(0, calculateLevelExp_1.default)(userData.level + 1)}** experience.\n# ***Stats:***\n**Strength:** ***${userData.strength}***\n**Will:** ***${userData.will}***\n**Cognition:** ***${userData.cognition}***\n# ***Skills:***\n${skillsDisplay}`,
                        //@ts-ignore
                        ephemeral: true,
                        components: (0, buttonWrapper_1.default)([inventory, backToAdmin]),
                    });
                }
                else {
                    playerReply = await interaction.editReply({
                        content: `Hello <@${userObj.user.id}>!\nYour level is **${userData.level}** and you have **${userData.exp}/${(0, calculateLevelExp_1.default)(userData.level + 1)}** experience.\n# ***Stats:***\n**Strength:** ***${userData.strength}***\n**Will:** ***${userData.will}***\n**Cognition:** ***${userData.cognition}***\n# ***Skills:***\n${skillsDisplay}`,
                        //@ts-ignore
                        ephemeral: true,
                        components: (0, buttonWrapper_1.default)([inventory]),
                    });
                }
                // make sure the user who ran the command is the one who clicked the button
                const filter = (i) => i.user.id === interaction.user.id;
                // collect button clicks
                const collector = playerReply.createMessageComponentCollector({
                    componentType: discord_js_1.ComponentType.Button,
                    filter,
                });
                collector.on("collect", async (i) => {
                    if (i.replied)
                        return;
                    if (i.customId === "inventory") {
                        const formattedInventory = userData.inventory
                            .map((item) => `${item.itemName}`)
                            .join(",\n") || "is empty...";
                        await i.reply({
                            content: `## Your inventory\n ${formattedInventory}`,
                            ephemeral: true,
                        });
                    }
                    else if (i.customId === "backAsAdmin") {
                        await adminMenu(true);
                    }
                });
            }
            async function adminMenu(prevPlayer = false) {
                if (!interaction.isCommand())
                    return;
                // set up admin button collection
                const playerModification = new discord_js_1.ButtonBuilder()
                    .setLabel("Modify Player Data")
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setCustomId("player-modification")
                    .setDisabled(false);
                const moderation = new discord_js_1.ButtonBuilder()
                    .setLabel("Moderation")
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setCustomId("moderation")
                    .setDisabled(false);
                const botPerform = new discord_js_1.ButtonBuilder()
                    .setLabel("Perform Bot Action")
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setCustomId("bot-perform")
                    .setDisabled(false);
                const environmentModification = new discord_js_1.ButtonBuilder()
                    .setLabel("Environment Modification")
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setCustomId("environment-modification")
                    .setDisabled(false);
                const playerMode = new discord_js_1.ButtonBuilder()
                    .setLabel("Reload as Player")
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setCustomId("player-mode")
                    .setDisabled(false);
                // send welcome message to admin
                const adminEmbed = new discord_js_1.EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(`Welcome, ${userObj.user.displayName}!`)
                    .setAuthor({
                    name: "Administrator Menu",
                    iconURL: userObj.user.avatarURL(),
                    url: `https://discord.com/users/${userObj.user.id}`,
                })
                    .setDescription(`Welcome Administrator <@${userObj.user.id}>!\nYour level is **${userData.level}** and you have **${userData.exp}/${(0, calculateLevelExp_1.default)(userData.level + 1)}** experience.\n`)
                    .addFields({
                    name: "Stats",
                    value: `**Strength:** ***${userData.strength}***\n**Will:** ***${userData.will}***\n**Cognition:** ***${userData.cognition}***`,
                }, { name: "Skills", value: skillsDisplay })
                    .setTimestamp(Date.now())
                    .setFooter({
                    text: "What Action Would You Like To Perform?",
                    iconURL: bot.user.avatarURL(),
                });
                const adminReply = await interaction.editReply({
                    embeds: [adminEmbed],
                    components: (0, buttonWrapper_1.default)([
                        playerModification,
                        environmentModification,
                        moderation,
                        botPerform,
                        playerMode,
                    ]),
                });
                // make sure the user who ran the command is the one who clicked the button
                const filter = (i) => i.user.id === interaction.user.id;
                // collect button clicks
                const collector = adminReply.createMessageComponentCollector({
                    componentType: discord_js_1.ComponentType.Button,
                    filter,
                });
                collector.on("collect", async (buttonInteraction) => {
                    switch (buttonInteraction.customId) {
                        // Initial Buttons
                        case "player-modification":
                            // Handle "Modify Player Data" button click
                            const updatedComponents = adminReply.components.map((row) => {
                                return discord_js_1.ActionRowBuilder.from(row).setComponents(row.components.map((button) => {
                                    return button;
                                }));
                            });
                            // Edit the original reply to disable the button
                            await interaction.editReply({
                                components: updatedComponents,
                            });
                            // Define buttons for submenu
                            const modifyStatsButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Modify Stats")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("modify_stats")
                                .setDisabled(false);
                            const modifySkillsButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Modify Skills")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("modify_skills")
                                .setDisabled(false);
                            const modifyItemsButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Modify Items")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("modify_items")
                                .setDisabled(false);
                            const modifyStatusEffectsButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Modify Status Effects")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("modify_status_effects")
                                .setDisabled(false);
                            const modifyEnvironmentButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Modify Player Location")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("modify_environment")
                                .setDisabled(false);
                            const embed = new discord_js_1.EmbedBuilder()
                                .setColor(0x0099ff)
                                .setTitle(`What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`);
                            if (prevPlayer === true) {
                                await buttonInteraction.editReply({
                                    embeds: [embed],
                                    components: (0, buttonWrapper_1.default)([
                                        modifyStatsButton,
                                        modifySkillsButton,
                                        modifyItemsButton,
                                        modifyStatusEffectsButton,
                                        modifyEnvironmentButton,
                                    ]),
                                });
                            }
                            else {
                                await buttonInteraction.update({
                                    embeds: [embed],
                                    components: (0, buttonWrapper_1.default)([
                                        modifyStatsButton,
                                        modifySkillsButton,
                                        modifyItemsButton,
                                        modifyStatusEffectsButton,
                                        modifyEnvironmentButton,
                                    ]),
                                });
                            }
                            break;
                        case "environment-modification":
                            // Handle "Environment Modification" button click
                            const envUpdatedComponents = adminReply.components.map((row) => {
                                return discord_js_1.ActionRowBuilder.from(row).setComponents(row.components.map((button) => {
                                    return button;
                                }));
                            });
                            // Edit the original reply to disable the button
                            await interaction.editReply({
                                components: envUpdatedComponents,
                            });
                            // Define buttons for submenu
                            const createEnvironmentButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Create Environment")
                                .setStyle(discord_js_1.ButtonStyle.Primary)
                                .setCustomId("create_environment")
                                .setDisabled(false);
                            const editEnvironmentButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Edit Environment")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("edit_environment")
                                .setDisabled(false);
                            const deleteEnvironmentButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Delete Environment")
                                .setStyle(discord_js_1.ButtonStyle.Danger)
                                .setCustomId("delete_environment")
                                .setDisabled(false);
                            const envEmbed = new discord_js_1.EmbedBuilder()
                                .setColor(0x0099ff)
                                .setTitle(`What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`);
                            if (prevPlayer === true) {
                                await buttonInteraction.editReply({
                                    embeds: [envEmbed],
                                    components: (0, buttonWrapper_1.default)([
                                        createEnvironmentButton,
                                        editEnvironmentButton,
                                        deleteEnvironmentButton,
                                    ]),
                                });
                            }
                            else {
                                await buttonInteraction.update({
                                    embeds: [envEmbed],
                                    components: (0, buttonWrapper_1.default)([
                                        createEnvironmentButton,
                                        editEnvironmentButton,
                                        deleteEnvironmentButton,
                                    ]),
                                });
                            }
                            break;
                        case "moderation":
                            // Handle "Moderation" button click
                            const moderationUpdatedComponents = adminReply.components.map((row) => {
                                return discord_js_1.ActionRowBuilder.from(row).setComponents(row.components.map((button) => {
                                    return button;
                                }));
                            });
                            // Edit the original reply to disable the button
                            await interaction.editReply({
                                content: `loading...`,
                                components: moderationUpdatedComponents,
                            });
                            // Define buttons for submenu
                            const banUserButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Ban User")
                                .setStyle(discord_js_1.ButtonStyle.Danger)
                                .setCustomId("ban_user")
                                .setDisabled(false);
                            const kickUserButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Kick User")
                                .setStyle(discord_js_1.ButtonStyle.Danger)
                                .setCustomId("kick_user")
                                .setDisabled(false);
                            const timeoutUserButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Timeout User")
                                .setStyle(discord_js_1.ButtonStyle.Danger)
                                .setCustomId("timeout_user")
                                .setDisabled(false);
                            await buttonInteraction.update({
                                content: `What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`,
                                components: (0, buttonWrapper_1.default)([
                                    banUserButton,
                                    kickUserButton,
                                    timeoutUserButton,
                                ]),
                            });
                            break;
                        case "player-mode":
                            // Handle "Reload as Player" button click
                            await playerMenu(true);
                            break;
                        case "bot-perform":
                            // Handle "Perform Bot Action" button click
                            const botPerformUpdatedComponents = adminReply.components.map((row) => {
                                return discord_js_1.ActionRowBuilder.from(row).setComponents(row.components.map((button) => {
                                    return button;
                                }));
                            });
                            // Edit the original reply to disable the button
                            await interaction.editReply({
                                content: `loading...`,
                                components: botPerformUpdatedComponents,
                            });
                            // Define buttons for submenu
                            const botPerformSendMessageButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Send Message")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("send_message")
                                .setDisabled(false);
                            if (prevPlayer === true) {
                                await buttonInteraction.editReply({
                                    content: `What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`,
                                    components: (0, buttonWrapper_1.default)([botPerformSendMessageButton]),
                                });
                            }
                            else {
                                await buttonInteraction.update({
                                    content: `What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`,
                                    components: (0, buttonWrapper_1.default)([botPerformSendMessageButton]),
                                });
                            }
                            break;
                        // Player Modification Buttons
                        case "modify_stats":
                            // Handle "Modify Stats" button click
                            try {
                                // Set up the Stats Giver modal
                                const statsGiverModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("stats-giver-modal")
                                    .setTitle("Stat Giver");
                                const statsGiverModifierInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("stats-giver-modifier-input")
                                    .setLabel("Modifier of stats to give")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(1);
                                const statsGiverVariantInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("stats-giver-variant-input")
                                    .setLabel("Variant of stats to give")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(1);
                                const statsGiverInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("stats-giver-input")
                                    .setLabel("Amount of stat points to give, remove or set")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(1);
                                const statsGiverTargetInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("stats-giver-target-input")
                                    .setLabel("Target user ID")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(18);
                                const statsGiverRow = new discord_js_1.ActionRowBuilder().addComponents(statsGiverInput);
                                const statsGiverVariantRow = new discord_js_1.ActionRowBuilder().addComponents(statsGiverVariantInput);
                                const statsGiverTargetRow = new discord_js_1.ActionRowBuilder().addComponents(statsGiverTargetInput);
                                const statsGiverModifierRow = new discord_js_1.ActionRowBuilder().addComponents(statsGiverModifierInput);
                                statsGiverModal.addComponents(statsGiverRow, statsGiverVariantRow, statsGiverTargetRow, statsGiverModifierRow);
                                // Show the modal
                                await buttonInteraction.showModal(statsGiverModal);
                            }
                            catch (error) {
                                console.log("Error handling Stats Giver modal:", error);
                            }
                            break;
                        case "modify_skills":
                            // Handle "Modify Player Data" button click
                            const modifySkillsUpdatedComponents = adminReply.components.map((row) => {
                                return discord_js_1.ActionRowBuilder.from(row).setComponents(row.components.map((button) => {
                                    return button;
                                }));
                            });
                            // Edit the original reply to disable the button
                            await interaction.editReply({
                                components: modifySkillsUpdatedComponents,
                            });
                            // Define buttons for submenu
                            const createSkillButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Create Skill")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("create_skill")
                                .setDisabled(false);
                            const deleteSkillButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Delete Skill")
                                .setStyle(discord_js_1.ButtonStyle.Danger)
                                .setCustomId("delete_skill")
                                .setDisabled(false);
                            const grantSkillButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Grant Skill")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("grant_skill")
                                .setDisabled(false);
                            const revokeSkillButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Revoke Skill")
                                .setStyle(discord_js_1.ButtonStyle.Danger)
                                .setCustomId("revoke_skill")
                                .setDisabled(false);
                            if (prevPlayer === true) {
                                await buttonInteraction.editReply({
                                    content: `What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`,
                                    components: (0, buttonWrapper_1.default)([
                                        createSkillButton,
                                        grantSkillButton,
                                        revokeSkillButton,
                                        deleteSkillButton,
                                    ]),
                                });
                            }
                            else {
                                await buttonInteraction.update({
                                    content: `What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`,
                                    components: (0, buttonWrapper_1.default)([
                                        createSkillButton,
                                        grantSkillButton,
                                        revokeSkillButton,
                                        deleteSkillButton,
                                    ]),
                                });
                            }
                            break;
                        case "modify_items":
                            // Handle "Modify Items" button click
                            const modifyItemsUpdatedComponents = adminReply.components.map((row) => {
                                return discord_js_1.ActionRowBuilder.from(row).setComponents(row.components.map((button) => {
                                    return button;
                                }));
                            });
                            // Edit the original reply to disable the button
                            await interaction.editReply({
                                components: modifyItemsUpdatedComponents,
                            });
                            // Define buttons for submenu
                            const createItemButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Create Item")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("create_item")
                                .setDisabled(false);
                            const deleteItemButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Delete Item")
                                .setStyle(discord_js_1.ButtonStyle.Danger)
                                .setCustomId("delete_item")
                                .setDisabled(false);
                            const giveItemButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Give Item")
                                .setStyle(discord_js_1.ButtonStyle.Primary)
                                .setCustomId("give_item")
                                .setDisabled(false);
                            const removeItemButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Revoke Item")
                                .setStyle(discord_js_1.ButtonStyle.Danger)
                                .setCustomId("revoke_item")
                                .setDisabled(false);
                            if (prevPlayer === true) {
                                await buttonInteraction.editReply({
                                    content: `What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`,
                                    components: (0, buttonWrapper_1.default)([
                                        createItemButton,
                                        giveItemButton,
                                        removeItemButton,
                                        deleteItemButton,
                                    ]),
                                });
                            }
                            else {
                                await buttonInteraction.update({
                                    content: `What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`,
                                    components: (0, buttonWrapper_1.default)([
                                        createItemButton,
                                        giveItemButton,
                                        removeItemButton,
                                        deleteItemButton,
                                    ]),
                                });
                            }
                            break;
                        case "modify_status_effects":
                            // Handle "Modify Status Effects" button click
                            const modifyStatusEffectsUpdatedComponents = adminReply.components.map((row) => {
                                return discord_js_1.ActionRowBuilder.from(row).setComponents(row.components.map((button) => {
                                    return button;
                                }));
                            });
                            // Edit the original reply to disable the button
                            await interaction.editReply({
                                components: modifyStatusEffectsUpdatedComponents,
                            });
                            // Define buttons for submenu
                            const createStatusEffectButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Create Status Effect")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("create_status_effect")
                                .setDisabled(false);
                            const deleteStatusEffectButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Delete Status Effect")
                                .setStyle(discord_js_1.ButtonStyle.Danger)
                                .setCustomId("delete_status_effect")
                                .setDisabled(false);
                            const grantStatusEffectButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Grant Status Effect")
                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                .setCustomId("grant_status_effect")
                                .setDisabled(false);
                            const revokeStatusEffectButton = new discord_js_1.ButtonBuilder()
                                .setLabel("Revoke Status Effect")
                                .setStyle(discord_js_1.ButtonStyle.Danger)
                                .setCustomId("revoke_status_effect")
                                .setDisabled(false);
                            if (prevPlayer === true) {
                                await buttonInteraction.editReply({
                                    content: `What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`,
                                    components: (0, buttonWrapper_1.default)([
                                        createStatusEffectButton,
                                        grantStatusEffectButton,
                                        revokeStatusEffectButton,
                                        deleteStatusEffectButton,
                                    ]),
                                });
                            }
                            else {
                                await buttonInteraction.update({
                                    content: `What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`,
                                    components: (0, buttonWrapper_1.default)([
                                        createStatusEffectButton,
                                        grantStatusEffectButton,
                                        revokeStatusEffectButton,
                                        deleteStatusEffectButton,
                                    ]),
                                });
                            }
                            break;
                        case "modify_environment":
                            // Handle "Modify Environment" button click
                            try {
                                // Set up the Environment Modification modal
                                const environmentModificationModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("user-relocator-modal")
                                    .setTitle("User Relocator");
                                const environmentNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("environment-name-input")
                                    .setLabel("Environment name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setPlaceholder("Kobalt");
                                const environmentUserInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("environment-user-input")
                                    .setLabel("Environment user")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setPlaceholder("123456789012345678, 123456789012345678")
                                    .setMinLength(18);
                                const environmentNameRow = new discord_js_1.ActionRowBuilder().addComponents(environmentNameInput);
                                const environmentUserRow = new discord_js_1.ActionRowBuilder().addComponents(environmentUserInput);
                                environmentModificationModal.addComponents(environmentNameRow, environmentUserRow);
                                // Show the modal
                                await buttonInteraction.showModal(environmentModificationModal);
                            }
                            catch (error) {
                                console.log(error);
                            }
                            break;
                        // Skill Modification Buttons
                        case "create_skill":
                            // Handle "Create Skill" button click
                            try {
                                // Set up the Create Skill modal
                                const createSkillModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("create-skill-modal")
                                    .setTitle("Create Skill");
                                const createSkillNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-skill-name-input")
                                    .setLabel("Skill name, no special characters!")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const createSkillDescriptionInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-skill-description-input")
                                    .setLabel("Skill description")
                                    .setStyle(discord_js_1.TextInputStyle.Paragraph)
                                    .setRequired(true);
                                const createSkillActionInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-skill-action-input")
                                    .setLabel("What the system says when the skill is used")
                                    .setStyle(discord_js_1.TextInputStyle.Paragraph)
                                    .setRequired(true);
                                const createSkillCooldownInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-skill-cooldown-input")
                                    .setLabel("Skill cooldown")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const createSkillWillInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-skill-will-input")
                                    .setLabel("Will requirement")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const createSkillWillRow = new discord_js_1.ActionRowBuilder().addComponents(createSkillWillInput);
                                const createSkillCooldownRow = new discord_js_1.ActionRowBuilder().addComponents(createSkillCooldownInput);
                                const createSkillActionRow = new discord_js_1.ActionRowBuilder().addComponents(createSkillActionInput);
                                const createSkillDescriptionRow = new discord_js_1.ActionRowBuilder().addComponents(createSkillDescriptionInput);
                                const createSkillNameRow = new discord_js_1.ActionRowBuilder().addComponents(createSkillNameInput);
                                createSkillModal.addComponents(createSkillNameRow, createSkillDescriptionRow, createSkillActionRow, createSkillCooldownRow, createSkillWillRow);
                                // Show the modal
                                await buttonInteraction.showModal(createSkillModal);
                            }
                            catch (error) {
                                console.log("Error handling Create Skill modal:", error);
                            }
                            break;
                        case "delete_skill":
                            try {
                                // Set up the Delete Skill modal
                                const deleteSkillModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("delete-skill-modal")
                                    .setTitle("Delete Skill");
                                const deleteSkillNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("delete-skill-name-input")
                                    .setLabel("Skill name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const deleteSkillNameRow = new discord_js_1.ActionRowBuilder().addComponents(deleteSkillNameInput);
                                deleteSkillModal.addComponents(deleteSkillNameRow);
                                // Show the modal
                                await buttonInteraction.showModal(deleteSkillModal);
                            }
                            catch (error) {
                                console.log("Error handling Delete Skill modal:", error);
                            }
                            break;
                        case "grant_skill":
                            // Handle "Grant Skill" button click
                            try {
                                // Set up the Grant Skill modal
                                const grantSkillModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("grant-skill-modal")
                                    .setTitle("Grant Skill");
                                const grantSkillNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("grant-skill-name-input")
                                    .setLabel("Skill name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const grantSkillTargetInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("grant-skill-target-input")
                                    .setLabel("Target user ID")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(18);
                                const grantSkillTargetRow = new discord_js_1.ActionRowBuilder().addComponents(grantSkillTargetInput);
                                const grantSkillNameRow = new discord_js_1.ActionRowBuilder().addComponents(grantSkillNameInput);
                                grantSkillModal.addComponents(grantSkillNameRow, grantSkillTargetRow);
                                // Show the modal
                                await buttonInteraction.showModal(grantSkillModal);
                            }
                            catch (error) {
                                console.log("Error handling Grant Skill modal:", error);
                            }
                            break;
                        case "revoke_skill":
                            // Handle "Revoke Skill" button click
                            try {
                                // Set up the Revoke Skill modal
                                const revokeSkillModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("revoke-skill-modal")
                                    .setTitle("Revoke Skill");
                                const revokeSkillTargetInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("revoke-skill-target-input")
                                    .setLabel("The user who's skill you want to revoke")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(18);
                                const revokeSkillNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("revoke-skill-name-input")
                                    .setLabel("The Name of the skill you want to revoke")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const revokeSkillTargetRow = new discord_js_1.ActionRowBuilder().addComponents(revokeSkillTargetInput);
                                const revokeSkillNameRow = new discord_js_1.ActionRowBuilder().addComponents(revokeSkillNameInput);
                                revokeSkillModal.addComponents(revokeSkillNameRow, revokeSkillTargetRow);
                                // Show the modal
                                await buttonInteraction.showModal(revokeSkillModal);
                            }
                            catch (error) {
                                console.log("Error handling Revoke Skill modal:", error);
                            }
                            break;
                        // Item Modification Buttons
                        case "create_item":
                            // Handle "Create Item" button click
                            try {
                                // Set up the Create Item modal
                                const createItemModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("create-item-modal")
                                    .setTitle("Create Item");
                                const createItemNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-item-name-input")
                                    .setLabel("Item Descriptor/Name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const createItemDescriptionInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-item-description-input")
                                    .setLabel("Item Description")
                                    .setStyle(discord_js_1.TextInputStyle.Paragraph)
                                    .setRequired(true);
                                const createItemActionableInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-item-actionable-input")
                                    .setLabel("What the item does, use/consume/interact")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const createItemActionInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-item-action-input")
                                    .setLabel("What happens when you interact?")
                                    .setStyle(discord_js_1.TextInputStyle.Paragraph)
                                    .setRequired(true);
                                const createItemNameRow = new discord_js_1.ActionRowBuilder().addComponents(createItemNameInput);
                                const createItemDescriptionRow = new discord_js_1.ActionRowBuilder().addComponents(createItemDescriptionInput);
                                const createItemActionableRow = new discord_js_1.ActionRowBuilder().addComponents(createItemActionableInput);
                                const createItemActionRow = new discord_js_1.ActionRowBuilder().addComponents(createItemActionInput);
                                createItemModal.addComponents(createItemNameRow, createItemDescriptionRow, createItemActionableRow, createItemActionRow);
                                // Show the modal
                                await buttonInteraction.showModal(createItemModal);
                            }
                            catch (error) {
                                console.log("Error handling Create Item modal:", error);
                            }
                            break;
                        case "give_item":
                            // Handle "Give Item" button click
                            try {
                                // Set up the Give Item modal
                                const giveItemModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("give-item-modal")
                                    .setTitle("Give Item");
                                const giveItemTargetInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("give-item-target-input")
                                    .setLabel("Target user ID")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(18);
                                const giveItemNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("give-item-name-input")
                                    .setLabel("Item Descriptor/Name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const giveItemAmountInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("give-item-amount-input")
                                    .setLabel("Amount")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(1);
                                const giveItemTargetRow = new discord_js_1.ActionRowBuilder().addComponents(giveItemTargetInput);
                                const giveItemNameRow = new discord_js_1.ActionRowBuilder().addComponents(giveItemNameInput);
                                const giveItemAmountRow = new discord_js_1.ActionRowBuilder().addComponents(giveItemAmountInput);
                                giveItemModal.addComponents(giveItemNameRow, giveItemTargetRow, giveItemAmountRow);
                                // Show the modal
                                await buttonInteraction.showModal(giveItemModal);
                            }
                            catch (error) {
                                console.log("Error handling Give Item modal:", error);
                            }
                            break;
                        case "revoke_item":
                            // Handle "Revoke Item" button click
                            try {
                                // Set up the Revoke Item modal
                                const revokeItemModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("revoke-item-modal")
                                    .setTitle("Revoke Item");
                                const revokeItemTargetInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("revoke-item-target-input")
                                    .setLabel("Target user ID")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(18);
                                const revokeItemNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("revoke-item-name-input")
                                    .setLabel("Item Descriptor/Name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const removeItemTargetRow = new discord_js_1.ActionRowBuilder().addComponents(revokeItemTargetInput);
                                const removeItemNameRow = new discord_js_1.ActionRowBuilder().addComponents(revokeItemNameInput);
                                revokeItemModal.addComponents(removeItemNameRow, removeItemTargetRow);
                                // Show the modal
                                await buttonInteraction.showModal(revokeItemModal);
                            }
                            catch (error) {
                                console.log("Error handling Revoke Item modal:", error);
                            }
                            break;
                        case "delete_item":
                            // Handle "Delete Item" button click
                            try {
                                // Set up the Delete Item modal
                                const deleteItemModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("delete-item-modal")
                                    .setTitle("Delete Item");
                                const deleteItemNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("delete-item-name-input")
                                    .setLabel("Item Descriptor/Name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const deleteItemNameRow = new discord_js_1.ActionRowBuilder().addComponents(deleteItemNameInput);
                                deleteItemModal.addComponents(deleteItemNameRow);
                                // Show the modal
                                await buttonInteraction.showModal(deleteItemModal);
                            }
                            catch (error) {
                                console.log("Error handling Delete Item modal:", error);
                            }
                            break;
                        // Status Effect Modification Buttons
                        case "create_status_effect":
                            // Handle "Create Status Effect" button click
                            try {
                                // Set up the Create Status Effect modal
                                const createStatusEffectModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("create-status-effect-modal")
                                    .setTitle("Create Status Effect");
                                const createStatusEffectNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-status-effect-name-input")
                                    .setLabel("Status Effect name, no special characters!")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const createStatusEffectDescriptionInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-status-effect-description-input")
                                    .setLabel("Status Effect description")
                                    .setStyle(discord_js_1.TextInputStyle.Paragraph)
                                    .setRequired(true);
                                const createStatusEffectActionInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-status-effect-action-input")
                                    .setLabel("What the system does when applied")
                                    .setStyle(discord_js_1.TextInputStyle.Paragraph)
                                    .setRequired(true);
                                const createStatusEffectDurationInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-status-effect-duration-input")
                                    .setLabel("Status Effect duration")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const createStatusEffectNameRow = new discord_js_1.ActionRowBuilder().addComponents(createStatusEffectNameInput);
                                const createStatusEffectDescriptionRow = new discord_js_1.ActionRowBuilder().addComponents(createStatusEffectDescriptionInput);
                                const createStatusEffectActionRow = new discord_js_1.ActionRowBuilder().addComponents(createStatusEffectActionInput);
                                const createStatusEffectDurationRow = new discord_js_1.ActionRowBuilder().addComponents(createStatusEffectDurationInput);
                                createStatusEffectModal.addComponents(createStatusEffectNameRow, createStatusEffectDescriptionRow, createStatusEffectActionRow, createStatusEffectDurationRow);
                                // Show the modal
                                await buttonInteraction.showModal(createStatusEffectModal);
                            }
                            catch (error) {
                                console.log("Error handling Create Status Effect modal:", error);
                            }
                            break;
                        case "delete_status_effect":
                            // Handle "Delete Status Effect" button click
                            try {
                                // Set up the Delete Status Effect modal
                                const deleteStatusEffectModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("delete-status-effect-modal")
                                    .setTitle("Delete Status Effect");
                                const deleteStatusEffectNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("delete-status-effect-name-input")
                                    .setLabel("Status Effect name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const deleteStatusEffectNameRow = new discord_js_1.ActionRowBuilder().addComponents(deleteStatusEffectNameInput);
                                deleteStatusEffectModal.addComponents(deleteStatusEffectNameRow);
                                // Show the modal
                                await buttonInteraction.showModal(deleteStatusEffectModal);
                            }
                            catch (error) {
                                console.log("Error handling Delete Status Effect modal:", error);
                            }
                            break;
                        case "grant_status_effect":
                            // Handle "Grant Status Effect" button click
                            try {
                                // Set up the Grant Status Effect modal
                                const grantStatusEffectModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("grant-status-effect-modal")
                                    .setTitle("Grant Status Effect");
                                const grantStatusEffectNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("grant-status-effect-name-input")
                                    .setLabel("Status Effect name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const grantStatusEffectTargetInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("grant-status-effect-target-input")
                                    .setLabel("Target user ID")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(18);
                                const grantStatusEffectNameRow = new discord_js_1.ActionRowBuilder().addComponents(grantStatusEffectNameInput);
                                const grantStatusEffectTargetRow = new discord_js_1.ActionRowBuilder().addComponents(grantStatusEffectTargetInput);
                                grantStatusEffectModal.addComponents(grantStatusEffectNameRow, grantStatusEffectTargetRow);
                                // Show the modal
                                await buttonInteraction.showModal(grantStatusEffectModal);
                            }
                            catch (error) {
                                console.log("Error handling Grant Status Effect modal:", error);
                            }
                            break;
                        case "revoke_status_effect":
                            // Handle "Revoke Status Effect" button click
                            try {
                                // Set up the Revoke Status Effect modal
                                const revokeStatusEffectModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("revoke-status-effect-modal")
                                    .setTitle("Revoke Status Effect");
                                const revokeStatusEffectNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("revoke-status-effect-name-input")
                                    .setLabel("Status Effect name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const revokeStatusEffectTargetInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("revoke-status-effect-target-input")
                                    .setLabel("Target user ID")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(18);
                                const revokeStatusEffectNameRow = new discord_js_1.ActionRowBuilder().addComponents(revokeStatusEffectNameInput);
                                const revokeStatusEffectTargetRow = new discord_js_1.ActionRowBuilder().addComponents(revokeStatusEffectTargetInput);
                                revokeStatusEffectModal.addComponents(revokeStatusEffectNameRow, revokeStatusEffectTargetRow);
                                // Show the modal
                                await buttonInteraction.showModal(revokeStatusEffectModal);
                            }
                            catch (error) {
                                console.log("Error handling Revoke Status Effect modal:", error);
                            }
                            break;
                        // Environment Buttons
                        case "create_environment":
                            // Handle "Create Environment" button click
                            try {
                                // Set up the Create Environment modal
                                const createEnvironmentModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("create-environment-modal")
                                    .setTitle("Create Environment");
                                const createEnvironmentNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-environment-name-input")
                                    .setLabel("Environment name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const createEnvironmentItemsInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-environment-items-input")
                                    .setLabel("Environment items, comma-separated")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const createEnvironmentChannelInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("create-environment-channel-input")
                                    .setLabel("Environment channel ID")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(18);
                                const createEnvironmentNameRow = new discord_js_1.ActionRowBuilder().addComponents(createEnvironmentNameInput);
                                const createEnvironmentItemsRow = new discord_js_1.ActionRowBuilder().addComponents(createEnvironmentItemsInput);
                                const createEnvironmentChannelRow = new discord_js_1.ActionRowBuilder().addComponents(createEnvironmentChannelInput);
                                createEnvironmentModal.addComponents(createEnvironmentNameRow, createEnvironmentItemsRow, createEnvironmentChannelRow);
                                // Show the modal
                                await buttonInteraction.showModal(createEnvironmentModal);
                            }
                            catch (error) {
                                console.log("Error handling Create Environment modal:", error);
                            }
                            break;
                        case "edit_environment":
                            // Create the Edit Environment submenu
                            const editEnvironmentUpdatedComponents = adminReply.components.map((row) => {
                                return discord_js_1.ActionRowBuilder.from(row).setComponents(row.components.map((button) => {
                                    return button;
                                }));
                            });
                            await interaction.editReply({
                                components: editEnvironmentUpdatedComponents,
                            });
                            // create buttons for submenu
                            const editEnvironmentButtons = [
                                new discord_js_1.ButtonBuilder()
                                    .setCustomId("edit-environment-name")
                                    .setLabel("Edit Environment Name")
                                    .setStyle(discord_js_1.ButtonStyle.Primary),
                                new discord_js_1.ButtonBuilder()
                                    .setCustomId("edit-environment-items")
                                    .setLabel("Edit Environment Items")
                                    .setStyle(discord_js_1.ButtonStyle.Primary),
                                new discord_js_1.ButtonBuilder()
                                    .setCustomId("edit-environment-channel")
                                    .setLabel("Edit Environment Channel")
                                    .setStyle(discord_js_1.ButtonStyle.Primary),
                            ];
                            if (prevPlayer === true) {
                                await buttonInteraction.editReply({
                                    content: `What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`,
                                    components: (0, buttonWrapper_1.default)(editEnvironmentButtons),
                                });
                            }
                            else {
                                await buttonInteraction.update({
                                    content: `What would you like to do, Administrator ${userObj.user.globalName.substr(0, 1)}?`,
                                    components: (0, buttonWrapper_1.default)(editEnvironmentButtons),
                                });
                            }
                            break;
                        case "delete_environment":
                            // Handle "Delete Environment" button click
                            try {
                                // Set up the Delete Environment modal
                                const deleteEnvironmentModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("delete-environment-modal")
                                    .setTitle("Delete Environment");
                                const deleteEnvironmentNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("delete-environment-name-input")
                                    .setLabel("Environment name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const deleteEnvironmentNameRow = new discord_js_1.ActionRowBuilder().addComponents(deleteEnvironmentNameInput);
                                deleteEnvironmentModal.addComponents(deleteEnvironmentNameRow);
                                // Show the modal
                                await buttonInteraction.showModal(deleteEnvironmentModal);
                            }
                            catch (error) {
                                console.log("Error handling Delete Environment modal:", error);
                            }
                            break;
                        // Edit Environment Buttons
                        case "edit-environment-name":
                            try {
                                // Set up the Edit Environment Name modal
                                const editEnvironmentNameModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("edit-environment-name-modal")
                                    .setTitle("Edit Environment Name");
                                const editEnvironmentNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("edit-environment-name-input")
                                    .setLabel("Environment name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const editEnvironmentNewNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("edit-environment-new-name-input")
                                    .setLabel("New environment name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const editEnvironmentNameRow = new discord_js_1.ActionRowBuilder().addComponents(editEnvironmentNameInput);
                                const editEnvironmentNewNameRow = new discord_js_1.ActionRowBuilder().addComponents(editEnvironmentNewNameInput);
                                editEnvironmentNameModal.addComponents(editEnvironmentNameRow, editEnvironmentNewNameRow);
                                // Show the modal
                                await buttonInteraction.showModal(editEnvironmentNameModal);
                            }
                            catch (error) {
                                console.log("Error handling Edit Environment Name modal:", error);
                            }
                            break;
                        case "edit-environment-items":
                            try {
                                // Set up the Edit Environment Items modal
                                const editEnvironmentItemsModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("edit-environment-items-modal")
                                    .setTitle("Edit Environment Items");
                                const editEnvironmentItemsNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("edit-environment-name-input")
                                    .setLabel("Environment name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const editEnvironmentNameOperatorInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("edit-environment-items-operator-input")
                                    .setLabel("Add, set, or remove")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const editEnvironmentItemsInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("edit-environment-items-input")
                                    .setLabel("Environment items")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const editEnvironmentItemsNameRow = new discord_js_1.ActionRowBuilder().addComponents(editEnvironmentItemsNameInput);
                                const editEnvironmentItemsOperationRow = new discord_js_1.ActionRowBuilder().addComponents(editEnvironmentNameOperatorInput);
                                const editEnvironmentItemsRow = new discord_js_1.ActionRowBuilder().addComponents(editEnvironmentItemsInput);
                                editEnvironmentItemsModal.addComponents(editEnvironmentItemsNameRow, editEnvironmentItemsOperationRow, editEnvironmentItemsRow);
                                // Show the modal
                                await buttonInteraction.showModal(editEnvironmentItemsModal);
                            }
                            catch (error) {
                                console.log("Error handling Edit Environment Items modal:", error);
                            }
                            break;
                        case "edit-environment-channel":
                            try {
                                const editEnvironmentChannelModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("edit-environment-channel-modal")
                                    .setTitle("Edit Environment Channel");
                                const editEnvironmentNameInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("edit-environment-name-input")
                                    .setLabel("Environment name")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const editEnvironmentChannelInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("edit-environment-channel-input")
                                    .setLabel("Environment channel")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const editEnvironmentNameRow = new discord_js_1.ActionRowBuilder().addComponents(editEnvironmentNameInput);
                                const editEnvironmentChannelRow = new discord_js_1.ActionRowBuilder().addComponents(editEnvironmentChannelInput);
                                editEnvironmentChannelModal.addComponents(editEnvironmentNameRow, editEnvironmentChannelRow);
                                // Show the modal
                                await buttonInteraction.showModal(editEnvironmentChannelModal);
                            }
                            catch (error) {
                                console.log("Error handling Edit Environment Channel modal:", error);
                            }
                            break;
                        // Bot Perform Buttons
                        case "send_message":
                            // Handle "Send Message" button click
                            try {
                                // Set up the Send Message modal
                                const sendMessageModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("send-message-modal")
                                    .setTitle("Send Message");
                                const sendMessageTargetChannelInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("send-message-target-channel-input")
                                    .setLabel("Target channel ID")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const sendMessageContentInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("send-message-content-input")
                                    .setLabel("Message content")
                                    .setStyle(discord_js_1.TextInputStyle.Paragraph)
                                    .setRequired(true);
                                const sendMessageTargetChannelRow = new discord_js_1.ActionRowBuilder().addComponents(sendMessageTargetChannelInput);
                                const sendMessageContentRow = new discord_js_1.ActionRowBuilder().addComponents(sendMessageContentInput);
                                sendMessageModal.addComponents(sendMessageTargetChannelRow, sendMessageContentRow);
                                // Show the modal
                                await buttonInteraction.showModal(sendMessageModal);
                            }
                            catch (error) {
                                console.log("Error handling Send Message modal:", error);
                            }
                            break;
                        // Moderation Buttons
                        case "ban_user":
                            // Handle "Ban User" button click
                            try {
                                // Set up the Ban User modal
                                const banUserModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("ban-user-modal")
                                    .setTitle("Ban User, very dangerous!");
                                const banUserTargetInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("ban-user-target-input")
                                    .setLabel("Target user ID")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(18);
                                const banUserReasonInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("ban-user-reason-input")
                                    .setLabel("Reason for ban")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(false);
                                const banUserTargetRow = new discord_js_1.ActionRowBuilder().addComponents(banUserTargetInput);
                                const banUserReasonRow = new discord_js_1.ActionRowBuilder().addComponents(banUserReasonInput);
                                banUserModal.addComponents(banUserTargetRow, banUserReasonRow);
                                await buttonInteraction.showModal(banUserModal);
                            }
                            catch (error) {
                                console.log("Error handling Ban User modal:", error);
                            }
                            break;
                        case "kick_user":
                            // Handle "Kick User" button click
                            try {
                                // Set up the Kick User modal
                                const kickUserModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("kick-user-modal")
                                    .setTitle("Kick User, scary!");
                                const kickUserTargetInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("kick-user-target-input")
                                    .setLabel("Target user ID")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(18);
                                const kickUserReasonInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("kick-user-reason-input")
                                    .setLabel("Reason for kick")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(false);
                                const kickUserTargetRow = new discord_js_1.ActionRowBuilder().addComponents(kickUserTargetInput);
                                const kickUserReasonRow = new discord_js_1.ActionRowBuilder().addComponents(kickUserReasonInput);
                                kickUserModal.addComponents(kickUserTargetRow, kickUserReasonRow);
                                await buttonInteraction.showModal(kickUserModal);
                            }
                            catch (error) {
                                console.log("Error handling Kick User modal:", error);
                            }
                            break;
                        case "timeout_user":
                            // Handle "Timeout User" button click
                            try {
                                // Set up the Timeout User modal
                                const timeoutUserModal = new discord_js_1.ModalBuilder()
                                    .setCustomId("timeout-user-modal")
                                    .setTitle("Timeout User, fun!");
                                const timeoutUserTargetInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("timeout-user-target-input")
                                    .setLabel("Target user ID")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true)
                                    .setMinLength(18);
                                const timeoutUserDurationInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("timeout-user-duration-input")
                                    .setLabel("Duration")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(true);
                                const timeoutUserReasonInput = new discord_js_1.TextInputBuilder()
                                    .setCustomId("timeout-user-reason-input")
                                    .setLabel("Reason for timeout")
                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                    .setRequired(false);
                                const timeoutUserTargetRow = new discord_js_1.ActionRowBuilder().addComponents(timeoutUserTargetInput);
                                const timeoutUserDurationRow = new discord_js_1.ActionRowBuilder().addComponents(timeoutUserDurationInput);
                                const timeoutUserReasonRow = new discord_js_1.ActionRowBuilder().addComponents(timeoutUserReasonInput);
                                timeoutUserModal.addComponents(timeoutUserTargetRow, timeoutUserDurationRow, timeoutUserReasonRow);
                                await buttonInteraction.showModal(timeoutUserModal);
                            }
                            catch (error) {
                                console.log("Error handling Timeout User modal:", error);
                            }
                            break;
                    }
                });
            }
            if (!(interaction.member.permissions instanceof discord_js_1.PermissionsBitField))
                return;
            if (interaction.member.permissions.has(discord_js_1.PermissionFlagsBits.Administrator)) {
                adminMenu();
            }
            else {
                playerMenu();
            }
        }
        catch (error) {
            if (error instanceof discord_js_1.HTTPError && error.status === 503) {
                console.log(`There was an error running status: The API did not respond in time. ${error.status}`);
            }
            console.log(`There was an error running status: ${error}`);
        }
    },
};
