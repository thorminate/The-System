"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Handles the modals.
 * @param {Client} bot The instantiating client.
 * @param {Interaction} modalInteraction The interaction that ran the command.
 */
const discord_js_1 = require("discord.js");
const buttonWrapper_1 = __importDefault(require("../../utils/buttonWrapper"));
const userDatabaseSchema_1 = __importDefault(require("../../models/userDatabaseSchema"));
const itemDatabaseSchema_1 = __importDefault(require("../../models/itemDatabaseSchema"));
const statusEffectDatabaseSchema_1 = __importDefault(require("../../models/statusEffectDatabaseSchema"));
const environmentDatabaseSchema_1 = __importDefault(require("../../models/environmentDatabaseSchema"));
const ms_1 = __importDefault(require("ms"));
const actionIndex_1 = __importDefault(require("../../actions/actionIndex"));
exports.default = async (bot, modalInteraction) => {
    // Export the function
    if (!modalInteraction.isModalSubmit())
        return;
    try {
        switch (modalInteraction.customId // Switch on the (pretty self-explanatory) custom IDs
        ) {
            //region Admin modals
            // Stat Modal
            case "stats-giver-modal":
                // get input values
                const statAmount = parseInt(modalInteraction.fields.getTextInputValue("stats-giver-input"));
                const statsTargetUserInput = modalInteraction.fields.getTextInputValue("stats-giver-target-input");
                const variant = modalInteraction.fields.getTextInputValue("stats-giver-variant-input");
                const modifier = modalInteraction.fields.getTextInputValue("stats-giver-modifier-input");
                if (variant !== "strength" &&
                    variant !== "will" &&
                    variant !== "cognition" &&
                    variant !== "level" &&
                    variant !== "exp") {
                    // Check if the variant is not a valid variant
                    await modalInteraction.reply({
                        // Reply with an error message if so
                        content: "Please enter a valid variant. Valid variants are 'strength', 'will', 'cognition', 'level', and 'exp'.",
                        ephemeral: true,
                    });
                    return;
                }
                if (modifier !== "add" && modifier !== "remove" && modifier !== "set") {
                    // Check if the modifier is not a valid modifier
                    await modalInteraction.reply({
                        // Reply with an error message if so
                        content: "Please enter a valid modifier. Valid modifiers are 'add', 'remove', and 'set'.",
                        ephemeral: true,
                    });
                    return;
                }
                if (isNaN(statAmount) || statAmount < 0) {
                    // Check if the stat amount is not a valid number
                    await modalInteraction.reply({
                        // Reply with an error message if so
                        content: "Please enter a valid positive number for the stat amount",
                        ephemeral: true,
                    });
                    return;
                }
                actionIndex_1.default.user.giveStat(modalInteraction, variant, modifier, statAmount, statsTargetUserInput);
                break;
            // Skill Modals
            case "create-skill-modal":
                // get input values
                const createSkillName = modalInteraction.fields
                    .getTextInputValue("create-skill-name-input")
                    .toLowerCase();
                const createSkillDescription = modalInteraction.fields.getTextInputValue("create-skill-description-input");
                const createSkillAction = modalInteraction.fields.getTextInputValue("create-skill-action-input");
                const createSkillCooldown = parseInt(modalInteraction.fields.getTextInputValue("create-skill-cooldown-input"));
                const createSkillWill = parseInt(modalInteraction.fields.getTextInputValue("create-skill-will-input"));
                actionIndex_1.default.skill.create(modalInteraction, createSkillName, createSkillDescription, createSkillAction, createSkillCooldown, createSkillWill);
                break;
            case "delete-skill-modal":
                // get input values
                const deleteSkillName = modalInteraction.fields
                    .getTextInputValue("delete-skill-name-input")
                    .toLowerCase();
                await actionIndex_1.default.skill.delete(modalInteraction, deleteSkillName);
                break;
            case "grant-skill-modal":
                // get input values
                const grantSkillName = modalInteraction.fields
                    .getTextInputValue("grant-skill-name-input")
                    .toLowerCase();
                const grantSkillTarget = modalInteraction.fields.getTextInputValue("grant-skill-target-input");
                await actionIndex_1.default.skill.grant(modalInteraction, grantSkillName, grantSkillTarget);
                break;
            case "revoke-skill-modal":
                // get input values
                const revokeSkillName = modalInteraction.fields
                    .getTextInputValue("revoke-skill-name-input")
                    .toLowerCase();
                const revokeSkillTarget = modalInteraction.fields.getTextInputValue("revoke-skill-target-input");
                await actionIndex_1.default.skill.revoke(modalInteraction, revokeSkillName, revokeSkillTarget);
                break;
            // Item Modals
            case "create-item-modal":
                // get input values
                const itemName = modalInteraction.fields
                    .getTextInputValue("create-item-name-input")
                    .toLowerCase();
                const itemDescription = modalInteraction.fields.getTextInputValue("create-item-description-input");
                const itemActionable = modalInteraction.fields
                    .getTextInputValue("create-item-actionable-input")
                    .toLowerCase();
                const itemAction = modalInteraction.fields.getTextInputValue("create-item-action-input");
                function checkItemActionSyntax(actionString) {
                    if (actionString === "none")
                        return true;
                    const actionParts = actionString.split(",");
                    const validOperators = ["+", "-"];
                    const validStats = ["STRENGTH", "WILL", "COGNITION"];
                    for (const action of actionParts) {
                        const [stat, operator, value] = action.trim().split(" ");
                        if (!validStats.includes(stat)) {
                            return false; // invalid stat
                        }
                        if (!validOperators.includes(operator)) {
                            return false; // invalid operator
                        }
                        if (isNaN(parseInt(value))) {
                            return false; // invalid value
                        }
                    }
                    return true; // syntax is correct
                }
                /*
              
              // the code to execute the item action using correct syntax
        
              function executeItemAction(actionString, userData) {
                if (actionString === "none") return;
                const actionParts = actionString.split(",");
                const operators = {
                  "+": (a, b) => a + b,
                  "-": (a, b) => a - b,
                };
        
                for (const action of actionParts) {
                  const [stat, operator, value] = action.trim().split(" ");
                  const statName = stat.toLowerCase();
                  const statValue = parseInt(value);
                  userData[statName] = operators[operator](
                    userData[statName],
                    statValue
                  );
                }
              }
              */
                // Validate the inputs
                if (itemActionable !== "interact" &&
                    itemActionable !== "consume" &&
                    itemActionable !== "use") {
                    modalInteraction.reply({
                        content: "The third field must be either 'interact', 'consume' or 'use'.",
                        ephemeral: true,
                    });
                    return;
                }
                if (checkItemActionSyntax(itemAction) === false) {
                    modalInteraction.reply({
                        content: "The fourth field must be a valid action syntax or 'none'.\nExample: COGNITION + 10, WILL - 5\nThey must be separated by a comma and a space. The operator must be either '+' or '-'. The stat must be either 'STRENGTH', 'WILL' or 'COGNITION'. The value must be a number. Each action must be separated by a space. so COGNITION+10, WILL-5 in invalid syntax.",
                        ephemeral: true,
                    });
                    return;
                }
                const existingItem = await itemDatabaseSchema_1.default.findOne({
                    itemName: itemName,
                });
                if (existingItem) {
                    modalInteraction.reply({
                        content: "An item with that name already exists. You can skip this step.",
                        ephemeral: true,
                    });
                    return;
                }
                const newItem = new itemDatabaseSchema_1.default({
                    itemName: itemName,
                    itemDescription: itemDescription,
                    itemActionable: itemActionable,
                    itemAction: itemAction,
                });
                await newItem.save();
                await modalInteraction.reply({
                    content: `Successfully created item ${itemName}.`,
                    ephemeral: true,
                });
                break;
            case "give-item-modal":
                // get input values
                const giveItemName = modalInteraction.fields
                    .getTextInputValue("give-item-name-input")
                    .toLowerCase();
                const giveItemTarget = modalInteraction.fields.getTextInputValue("give-item-target-input");
                const giveItemAmount = parseInt(modalInteraction.fields.getTextInputValue("give-item-amount-input"));
                if (isNaN(giveItemAmount)) {
                    await modalInteraction.reply({
                        content: "Amount must be a number.",
                        ephemeral: true,
                    });
                    return;
                }
                const giveItemTargetData = await userDatabaseSchema_1.default.findOne({
                    userId: giveItemTarget,
                    guildId: modalInteraction.guild.id,
                });
                if (!giveItemTargetData) {
                    await modalInteraction.reply({
                        content: "User not found, make sure they exist in the database.",
                        ephemeral: true,
                    });
                }
                const giveItemData = await itemDatabaseSchema_1.default.findOne({
                    itemName: giveItemName,
                });
                if (!giveItemData) {
                    await modalInteraction.reply({
                        content: "Item not found, make sure it exist in the database",
                        ephemeral: true,
                    });
                }
                const giveItemIndex = giveItemTargetData.inventory.findIndex((item) => item.itemName === giveItemData.itemName);
                if (giveItemIndex === -1) {
                    const inventoryObject = {
                        itemName: giveItemData.itemName,
                        itemAmount: giveItemAmount,
                    };
                    giveItemTargetData.inventory.push(inventoryObject);
                    await giveItemTargetData.save();
                }
                else {
                    giveItemTargetData.inventory[giveItemIndex].itemAmount +=
                        giveItemAmount;
                    await giveItemTargetData.save();
                }
                giveItemData.itemUsers.push(giveItemTarget);
                await giveItemData.save();
                await modalInteraction.reply({
                    content: `Successfully gave ${giveItemAmount}x ${giveItemName} to <@${giveItemTarget}>.`,
                    ephemeral: true,
                });
                break;
            case "remove-item-modal":
                // get input values
                const removeItemName = modalInteraction.fields
                    .getTextInputValue("remove-item-name-input")
                    .toLowerCase();
                const removeItemTarget = modalInteraction.fields.getTextInputValue("remove-item-target-input");
                // Validate the inputs
                const removeItemData = await itemDatabaseSchema_1.default.findOne({
                    itemName: removeItemName,
                });
                if (!removeItemData) {
                    await modalInteraction.reply({
                        content: "Item not found, make sure it exist in the database",
                        ephemeral: true,
                    });
                    return;
                }
                const removeItemTargetData = await userDatabaseSchema_1.default.findOne({
                    userId: removeItemTarget,
                    guildId: modalInteraction.guild.id,
                });
                if (!removeItemTargetData) {
                    await modalInteraction.reply({
                        content: "User not found, make sure they are in the server.",
                        ephemeral: true,
                    });
                    return;
                }
                const removeItemIndex = removeItemTargetData.inventory.findIndex((item) => item.itemName === removeItemData.itemName);
                if (removeItemIndex > -1) {
                    removeItemTargetData.inventory.splice(removeItemIndex, 1);
                    await removeItemTargetData.save();
                    await modalInteraction.reply({
                        content: `Successfully removed item ${removeItemName} from <@${removeItemTarget}>'s inventory.`,
                        ephemeral: true,
                    });
                }
                else {
                    await modalInteraction.reply({
                        content: "User does not have the item in their inventory.",
                        ephemeral: true,
                    });
                    return;
                }
                break;
            case "delete-item-modal":
                // get input values
                const deleteItemName = modalInteraction.fields
                    .getTextInputValue("delete-item-name-input")
                    .toLowerCase();
                // Validate the inputs
                const deleteItemData = await itemDatabaseSchema_1.default.findOne({
                    itemName: deleteItemName,
                });
                if (!deleteItemData) {
                    await modalInteraction.reply({
                        content: "Item not found, make sure it exist in the database",
                        ephemeral: true,
                    });
                    return;
                }
                // Delete the item from people's inventories
                const deleteItemUsers = deleteItemData.itemUsers;
                for (const user of deleteItemUsers) {
                    const deleteItemUserData = await userDatabaseSchema_1.default.findOne({
                        userId: user,
                        guildId: modalInteraction.guild.id,
                    });
                    const deleteItemIndex = deleteItemUserData.inventory.findIndex((item) => item.itemName === deleteItemName);
                    if (deleteItemIndex > -1) {
                        deleteItemUserData.inventory.splice(deleteItemIndex, 1);
                        await deleteItemUserData.save();
                    }
                }
                // Delete the item from environments
                const deleteItemEnvironments = deleteItemData.itemEnvironments;
                for (const environment of deleteItemEnvironments) {
                    const deleteItemEnvironmentData = await environmentDatabaseSchema_1.default.findOne({
                        environmentName: environment,
                    });
                    const deleteItemIndex = deleteItemEnvironmentData.environmentItems.findIndex((item) => item.itemName === deleteItemName);
                    if (deleteItemIndex > -1) {
                        deleteItemEnvironmentData.environmentItems.splice(deleteItemIndex, 1);
                        await deleteItemEnvironmentData.save();
                    }
                }
                // Delete the item from the database.
                itemDatabaseSchema_1.default.deleteOne({ itemName: deleteItemName });
                await modalInteraction.reply({
                    content: `Successfully deleted item ${deleteItemName}.`,
                    ephemeral: true,
                });
                break;
            // Status Effect Modals
            case "create-status-effect-modal":
                // get input values
                const statusEffectName = modalInteraction.fields
                    .getTextInputValue("create-status-effect-name-input")
                    .toLowerCase();
                const statusEffectDuration = modalInteraction.fields
                    .getTextInputValue("create-status-effect-duration-input")
                    .toLowerCase();
                const statusEffectDescription = modalInteraction.fields.getTextInputValue("create-status-effect-description-input");
                const statusEffectAction = modalInteraction.fields.getTextInputValue("create-status-effect-action-input");
                // Validate the inputs
                if (statusEffectName === "" ||
                    statusEffectDuration === "" ||
                    statusEffectDescription === "" ||
                    statusEffectAction === "") {
                    await modalInteraction.reply({
                        content: "Please fill in the required fields.",
                        ephemeral: true,
                    });
                    return;
                }
                if (!checkItemActionSyntax(statusEffectAction)) {
                    await modalInteraction.reply({
                        content: "Invalid status effect action syntax. Use 'none' for no action.",
                        ephemeral: true,
                    });
                    return;
                }
                // check if status effect already exists
                const statusEffectExistingData = await statusEffectDatabaseSchema_1.default.findOne({
                    statusEffectName: statusEffectName,
                });
                if (statusEffectExistingData) {
                    await modalInteraction.reply({
                        content: "Status effect already exists. Check database for more information.",
                        ephemeral: true,
                    });
                    return;
                }
                const statusEffectDurationMs = (0, ms_1.default)(statusEffectDuration);
                if (statusEffectDurationMs < 0 ||
                    statusEffectDurationMs > 86400000 ||
                    isNaN(statusEffectDurationMs)) {
                    await modalInteraction.reply({
                        content: "Status effect duration invalid!",
                        ephemeral: true,
                    });
                    return;
                }
                // create status effect
                const statusEffectNew = new statusEffectDatabaseSchema_1.default({
                    statusEffectName: statusEffectName,
                    statusEffectDuration: statusEffectDurationMs,
                    statusEffectDescription: statusEffectDescription,
                    statusEffectAction: statusEffectAction,
                });
                await statusEffectNew.save();
                await modalInteraction.reply({
                    content: `Successfully created status effect ${statusEffectName}.`,
                    ephemeral: true,
                });
                break;
            case "delete-status-effect-modal":
                // get input values
                const deleteStatusEffectName = modalInteraction.fields
                    .getTextInputValue("delete-status-effect-name-input")
                    .toLowerCase();
                // Validate the inputs
                const deleteStatusEffectData = await statusEffectDatabaseSchema_1.default.findOne({
                    statusEffectName: deleteStatusEffectName,
                });
                if (!deleteStatusEffectData) {
                    await modalInteraction.reply({
                        content: "Status effect not found, make sure it exist in the database",
                        ephemeral: true,
                    });
                    return;
                }
                // delete status effect from all users
                deleteStatusEffectData.statusEffectUsers.forEach(async (user) => {
                    await userDatabaseSchema_1.default.findOne({ userId: user }).then((user) => {
                        if (user) {
                            user.statusEffects = user.statusEffects.filter((effect) => effect.statusEffectName !== deleteStatusEffectName);
                        }
                    });
                });
                await statusEffectDatabaseSchema_1.default.deleteOne({
                    statusEffectName: deleteStatusEffectName,
                });
                await modalInteraction.reply({
                    content: `Successfully deleted status effect ${deleteStatusEffectName}.`,
                    ephemeral: true,
                });
                break;
            case "grant-status-effect-modal":
                // get input values
                const grantStatusEffectName = modalInteraction.fields.getTextInputValue("grant-status-effect-name-input");
                const grantStatusEffectTarget = modalInteraction.fields.getTextInputValue("grant-status-effect-target-input");
                // Validate the inputs
                const grantStatusEffectData = await statusEffectDatabaseSchema_1.default.findOne({
                    statusEffectName: grantStatusEffectName,
                });
                if (!grantStatusEffectData) {
                    await modalInteraction.reply({
                        content: "Status effect not found, make sure it exists in the database",
                        ephemeral: true,
                    });
                    return;
                }
                const grantStatusEffectTargetData = await userDatabaseSchema_1.default.findOne({
                    userId: grantStatusEffectTarget,
                    guildId: modalInteraction.guild.id,
                });
                if (!grantStatusEffectTargetData) {
                    await modalInteraction.reply({
                        content: "User not found!",
                        ephemeral: true,
                    });
                    return;
                }
                grantStatusEffectTargetData.statusEffects.push({
                    statusEffectName: grantStatusEffectData.statusEffectName,
                    statusEffectTimestamp: Date.now(),
                });
                await grantStatusEffectTargetData.save();
                await modalInteraction.reply({
                    content: `Successfully granted status effect ${grantStatusEffectName} to ${grantStatusEffectTarget}.`,
                    ephemeral: true,
                });
                break;
            // Environment Modals
            case "create-environment-modal":
                // get input values
                const createEnvironmentName = modalInteraction.fields
                    .getTextInputValue("create-environment-name-input") // get name input
                    .toLowerCase(); // convert to lowercase
                const createEnvironmentItemsPromises = modalInteraction.fields
                    .getTextInputValue("create-environment-items-input") // get items input
                    .toLowerCase() // convert to lowercase
                    .split(",")
                    .map((itemName) => itemName.trim()); // convert to array, split by comma
                const createEnvironmentChannel = 
                // get channel input and convert to number
                modalInteraction.fields.getTextInputValue("create-environment-channel-input");
                const createEnvironmentItems = await Promise.all(
                // await all promises
                createEnvironmentItemsPromises.map(async (itemName) => {
                    // for each item
                    if (itemName === "none")
                        return itemName;
                    const item = await itemDatabaseSchema_1.default.findOne({ itemName }); // get their corresponding data
                    return [item, itemName]; // return the item object into the new array
                }));
                if (!modalInteraction.guild.channels.cache.has(createEnvironmentChannel)) {
                    // if channel id is not a number
                    await modalInteraction.reply({
                        // say so verbosely
                        content: "Channel ID invalid!",
                        ephemeral: true,
                    });
                    return;
                }
                if (await environmentDatabaseSchema_1.default.findOne({
                    environmentName: createEnvironmentName,
                })) {
                    // if environment already exists
                    await modalInteraction.reply({
                        // say so verbosely
                        content: `Environment ${createEnvironmentName} already exists.`,
                        ephemeral: true,
                    });
                    return;
                }
                if (!createEnvironmentItems.includes("none")) {
                    // Check if all items exist
                    const invalidItems = createEnvironmentItems.filter(
                    // filter out valid items into new array
                    (item) => !item[0]);
                    if (invalidItems.length > 0) {
                        // if there are invalid items
                        await modalInteraction.reply({
                            // say so verbosely
                            content: `Item(s) ${invalidItems
                                .map((item, index) => createEnvironmentItems[index][0])
                                .join(", ")} not found, make sure they exist in the database.`,
                            ephemeral: true,
                        });
                        return;
                    }
                    // give all items the environment name
                    createEnvironmentItems.forEach(async (item) => {
                        // for each existing item
                        item[0].itemEnvironments.push(createEnvironmentName);
                        item[0].save();
                    });
                    // create environment
                    const createEnvironment = new environmentDatabaseSchema_1.default({
                        environmentName: createEnvironmentName,
                        environmentItems: createEnvironmentItems.map((item) => item[1]),
                        environmentChannel: createEnvironmentChannel,
                    });
                    await createEnvironment.save();
                    await modalInteraction.reply({
                        content: `Successfully created environment ${createEnvironmentName}.\nWith item(s): ${createEnvironmentItems
                            .map((item) => {
                            if (!item)
                                return "none";
                            else
                                return item[1];
                        })
                            .join(", ")}. \nAnd channel: <#${createEnvironmentChannel}>`,
                        ephemeral: true,
                    });
                }
                else {
                    // create environment
                    const createEnvironment = new environmentDatabaseSchema_1.default({
                        environmentName: createEnvironmentName,
                        environmentItems: [],
                        environmentChannel: createEnvironmentChannel,
                    });
                    await createEnvironment.save();
                    await modalInteraction.reply({
                        content: `Successfully created environment ${createEnvironmentName}.\nWith no items. \nAnd channel: <#${createEnvironmentChannel}>`,
                        ephemeral: true,
                    });
                }
                break;
            case "edit-environment-name-modal":
                // get input values
                const editEnvironmentName = modalInteraction.fields
                    .getTextInputValue("edit-environment-name-input")
                    .toLowerCase();
                const editEnvironmentNewName = modalInteraction.fields
                    .getTextInputValue("edit-environment-new-name-input")
                    .toLowerCase();
                // Validate and format the inputs
                const editEnvironmentNameData = await environmentDatabaseSchema_1.default.findOne({
                    environmentName: editEnvironmentName,
                });
                if (editEnvironmentNameData) {
                    editEnvironmentNameData.environmentName = editEnvironmentNewName;
                    await editEnvironmentNameData.save();
                    await modalInteraction.reply({
                        content: `Successfully renamed environment ${editEnvironmentName} to ${editEnvironmentNewName}.`,
                        ephemeral: true,
                    });
                }
                else {
                    await modalInteraction.reply({
                        content: "Environment not found!",
                        ephemeral: true,
                    });
                }
                break;
            case "edit-environment-items-modal":
                // get input values
                const editEnvironmentItemsName = modalInteraction.fields
                    .getTextInputValue("edit-environment-name-input")
                    .toLowerCase();
                const editEnvironmentItemsOperator = modalInteraction.fields.getTextInputValue("edit-environment-items-operator-input");
                const editEnvironmentItemsPromises = modalInteraction.fields
                    .getTextInputValue("edit-environment-items-input")
                    .toLowerCase()
                    .split(",")
                    .map((item) => item.trim());
                const editEnvironmentItemsData = await environmentDatabaseSchema_1.default.findOne({
                    environmentName: editEnvironmentItemsName,
                });
                if (!editEnvironmentItemsData) {
                    await modalInteraction.reply({
                        content: "Environment not found!",
                        ephemeral: true,
                    });
                    return;
                }
                const editEnvironmentItems = await Promise.all(editEnvironmentItemsPromises.map(async (itemName) => {
                    // for each item
                    const item = await itemDatabaseSchema_1.default.findOne({ itemName }); // get their corresponding data
                    if (!item)
                        return itemName;
                    else
                        return item;
                }));
                const editEnvironmentInvalidItems = editEnvironmentItems.filter(
                // filter out valid items into new array
                (item) => !item);
                if (editEnvironmentInvalidItems.length > 0) {
                    // if there are invalid items
                    await modalInteraction.reply({
                        // say so verbosely
                        content: `Items ${editEnvironmentInvalidItems
                            .map((item, index) => editEnvironmentItems[index])
                            .join(", ")} not found, make sure they exist in the database.`,
                        ephemeral: true,
                    });
                    return;
                }
                switch (editEnvironmentItemsOperator) {
                    case "add":
                        if (editEnvironmentItemsData.environmentItems.includes(editEnvironmentItems.map((item) => item.itemName))) {
                            await modalInteraction.reply({
                                content: `Items ${editEnvironmentItems
                                    .map((item) => item.itemName)
                                    .join(", ")} already in environment ${editEnvironmentItemsName}.`,
                                ephemeral: true,
                            });
                            return;
                        }
                        editEnvironmentItemsData.environmentItems.push(...editEnvironmentItems.map((item) => item.itemName));
                        await editEnvironmentItemsData.save();
                        await modalInteraction.reply({
                            content: `Successfully added item(s) ${editEnvironmentItems
                                .map((item) => item.itemName)
                                .join(", ")} to environment ${editEnvironmentItemsName}.`,
                            ephemeral: true,
                        });
                        break;
                    case "remove":
                        editEnvironmentItemsData.environmentItems =
                            editEnvironmentItemsData.environmentItems.filter((itemName) => !editEnvironmentItems.some((item) => item.itemName === itemName));
                        await editEnvironmentItemsData.save();
                        await modalInteraction.reply({
                            content: `Successfully removed items in environment ${editEnvironmentItemsName} to ${editEnvironmentItems
                                .map((item) => item.itemName)
                                .join(", ")}.`,
                            ephemeral: true,
                        });
                        break;
                    case "set":
                        editEnvironmentItemsData.environmentItems =
                            editEnvironmentItems.map((item) => item.itemName);
                        await editEnvironmentItemsData.save();
                        await modalInteraction.reply({
                            content: `Successfully set items in environment ${editEnvironmentItemsName} to ${editEnvironmentItems
                                .map((item) => item.itemName)
                                .join(", ")}.`,
                            ephemeral: true,
                        });
                        break;
                }
                break;
            case "edit-environment-channel-modal":
                // get input values
                const editEnvironmentChannelName = modalInteraction.fields
                    .getTextInputValue("edit-environment-name-input")
                    .toLowerCase();
                const editEnvironmentChannel = modalInteraction.fields
                    .getTextInputValue("edit-environment-channel-input")
                    .toLowerCase();
                const editEnvironmentChannelData = await modalInteraction.guild.channels.cache.get(editEnvironmentChannel);
                if (!editEnvironmentChannelData) {
                    await modalInteraction.reply({
                        content: "Channel not found!",
                        ephemeral: true,
                    });
                    return;
                }
                const editEnvironmentChannelObj = await environmentDatabaseSchema_1.default.findOne({
                    environmentName: editEnvironmentChannelName,
                });
                if (!editEnvironmentChannelObj) {
                    await modalInteraction.reply({
                        content: "Environment not found!",
                        ephemeral: true,
                    });
                    return;
                }
                editEnvironmentChannelObj.environmentChannel = editEnvironmentChannel;
                await editEnvironmentChannelObj.save();
                await modalInteraction.reply({
                    content: `Successfully edited environment ${editEnvironmentChannelName} to <#${editEnvironmentChannel}>.`,
                    ephemeral: true,
                });
                break;
            case "delete-environment-modal":
                // get input values
                const deleteEnvironmentName = modalInteraction.fields
                    .getTextInputValue("delete-environment-name-input")
                    .toLowerCase();
                const deleteEnvironmentObj = await environmentDatabaseSchema_1.default.findOne({
                    environmentName: deleteEnvironmentName,
                });
                if (!deleteEnvironmentObj) {
                    await modalInteraction.reply({
                        content: "Environment not found!",
                        ephemeral: true,
                    });
                    return;
                }
                const startEnvironmentObj = await environmentDatabaseSchema_1.default.findOne({
                    environmentName: "start",
                });
                deleteEnvironmentObj.environmentUsers.forEach(async (userId) => {
                    const userObj = await userDatabaseSchema_1.default.findOne({ userId: userId });
                    if (!userObj)
                        return;
                    userObj.environment = "start";
                    startEnvironmentObj.environmentUsers.push(userId);
                    await userObj.save();
                    await startEnvironmentObj.save();
                });
                await deleteEnvironmentObj.deleteOne();
                await modalInteraction.reply({
                    content: `Successfully deleted environment ${deleteEnvironmentName}.`,
                    ephemeral: true,
                });
                break;
            case "user-relocator-modal":
                // get input values
                const relocateNameInput = modalInteraction.fields
                    .getTextInputValue("environment-name-input")
                    .toLowerCase();
                const relocateUserId = modalInteraction.fields
                    .getTextInputValue("environment-user-input")
                    .toLowerCase()
                    .split(",")
                    .map((id) => id.trim());
                const relocateEnvironmentObj = await environmentDatabaseSchema_1.default.findOne({
                    environmentName: relocateNameInput,
                });
                if (!relocateEnvironmentObj) {
                    await modalInteraction.reply({
                        content: "Environment not found!",
                        ephemeral: true,
                    });
                    return;
                }
                relocateUserId.forEach(async (relocateUserId) => {
                    const relocateUserObj = await userDatabaseSchema_1.default.findOne({
                        userId: relocateUserId,
                    });
                    if (!relocateUserObj) {
                        await modalInteraction.reply({
                            content: "User not found!",
                            ephemeral: true,
                        });
                        return;
                    }
                    if (relocateUserObj.environment) {
                        const relocateUserPreviousEnvironmentObj = await environmentDatabaseSchema_1.default.findOne({
                            environmentName: relocateUserObj.environment,
                        });
                        if (relocateUserPreviousEnvironmentObj) {
                            relocateUserPreviousEnvironmentObj.environmentUsers =
                                relocateUserPreviousEnvironmentObj.environmentUsers.filter((user) => user !== relocateUserId);
                            await relocateUserPreviousEnvironmentObj.save();
                        }
                    }
                    relocateUserObj.environment = relocateEnvironmentObj.environmentName;
                    relocateEnvironmentObj.environmentUsers.push(relocateUserId);
                    await relocateUserObj.save();
                    await relocateEnvironmentObj.save();
                });
                const relocateUserIds = relocateUserId.join(">, <@");
                await modalInteraction.reply({
                    content: `Successfully relocated user(s) <@${relocateUserIds}> to environment ${relocateNameInput}.`,
                    ephemeral: true,
                });
                break;
            // Bot Perform Modals
            case "send-message-modal":
                // get input values
                let sendMessageChannel = modalInteraction.fields
                    .getTextInputValue("send-message-target-channel-input")
                    .toLowerCase();
                const sendMessageContent = modalInteraction.fields.getTextInputValue("send-message-content-input");
                // Validate and format the inputs
                if (sendMessageChannel === "here") {
                    sendMessageChannel = modalInteraction.channel.id;
                }
                const sendMessageChannelObj = modalInteraction.guild.channels.cache.get(sendMessageChannel);
                if (!sendMessageChannelObj) {
                    await modalInteraction.reply({
                        content: "Channel not found!",
                        ephemeral: true,
                    });
                    return;
                }
                // send message
                await sendMessageChannelObj.send(sendMessageContent);
                await modalInteraction.reply({
                    content: `Sent message in ${sendMessageChannelObj.name}.`,
                    ephemeral: true,
                });
                break;
            // Moderation Modals
            case "ban-user-modal":
                // get input values
                const banUserId = modalInteraction.fields.getTextInputValue("ban-user-target-input");
                const banUserReason = modalInteraction.fields.getTextInputValue("ban-user-reason-input");
                // Validate the inputs
                if (banUserId === "") {
                    await modalInteraction.reply({
                        content: "Please fill in the required fields.",
                        ephemeral: true,
                    });
                    return;
                }
                const buttonConfirm = new discord_js_1.ButtonBuilder()
                    .setCustomId("ban-user-confirm")
                    .setLabel("Confirm")
                    .setStyle(discord_js_1.ButtonStyle.Danger)
                    .setDisabled(false);
                const buttonCancel = new discord_js_1.ButtonBuilder()
                    .setCustomId("ban-user-cancel")
                    .setLabel("Cancel")
                    .setStyle(discord_js_1.ButtonStyle.Success)
                    .setDisabled(false);
                await modalInteraction.reply({
                    content: "Are you sure you want to ban this user?",
                    ephemeral: true,
                    components: (0, buttonWrapper_1.default)([buttonConfirm, buttonCancel]),
                });
                const collector = modalInteraction.channel.createMessageComponentCollector({
                    filter: (m) => m.user.id === modalInteraction.user.id,
                    max: 1,
                });
                collector.on("collect", async (i) => {
                    if (i.customId === "ban-user-confirm") {
                    }
                });
                break;
            case "kick-user-modal":
                // get input values
                const kickUserId = modalInteraction.fields.getTextInputValue("kick-user-target-input");
                const kickUserReason = modalInteraction.fields.getTextInputValue("kick-user-reason-input") ||
                    "No reason provided";
                // get the target user object
                const kickUser = await modalInteraction.guild.members
                    .fetch(kickUserId)
                    ?.catch(() => null);
                // check if the target user exists, else edit the reply and return
                if (!kickUser) {
                    await modalInteraction.reply({
                        content: "That user doesn't exist in this server.",
                        ephemeral: true,
                    });
                    return;
                }
                // check if the target user is a bot
                if (kickUser.user.bot) {
                    await modalInteraction.reply({
                        content: "You cannot kick a bot.",
                        ephemeral: true,
                    });
                    return;
                }
                // check if the target user is the owner of the server
                if (kickUser.id === modalInteraction.guild.ownerId) {
                    await modalInteraction.reply({
                        content: "I cannot kick my creator.",
                        ephemeral: true,
                    });
                    return;
                }
                // define the target user role position and request user role position
                const kickUserRolePosition = kickUser.roles.highest.position;
                const kickUserRequesterRolePosition = modalInteraction.member.roles.highest.position;
                const kickUserBotRolePosition = modalInteraction.guild.members.me.roles.highest.position;
                // check if the target user is of a higher position than the request user
                if (kickUserRolePosition >= kickUserRequesterRolePosition) {
                    await modalInteraction.reply({
                        content: "That user is of a higher position of the power hierarchy than you. Therefore you cannot kick them.",
                        ephemeral: true,
                    });
                    return;
                }
                // check if the target user is of a higher position than the bot
                if (kickUserRolePosition >= kickUserBotRolePosition) {
                    await modalInteraction.reply({
                        content: "That user is of a higher position of the power hierarchy than me. Therefore i cannot kick them.",
                        ephemeral: true,
                    });
                    return;
                }
                // kick the user
                try {
                    await kickUser.kick(kickUserReason);
                    await modalInteraction.reply({
                        content: `The user <@${kickUser.user.id}> has been kicked successfully.\n${kickUserReason}`,
                        ephemeral: true,
                    });
                }
                catch (error) {
                    console.error("Error kicking user: ", error);
                }
                break;
            case "timeout-user-modal":
                // get input values
                const timeoutUserId = modalInteraction.fields.getTextInputValue("timeout-user-target-input");
                let timeoutUserDuration = modalInteraction.fields.getTextInputValue("timeout-user-duration-input");
                const timeoutUserReason = modalInteraction.fields.getTextInputValue("timeout-user-reason-input") || "No reason provided";
                // get the target user object
                const timeoutUser = await modalInteraction.guild.members
                    .fetch(timeoutUserId)
                    ?.catch(() => null);
                // check if the target user exists, else edit the reply and return
                if (!timeoutUser) {
                    await modalInteraction.reply({
                        content: `That user doesn't exist in this server.\n${timeoutUserReason}`,
                        ephemeral: true,
                    });
                    return;
                }
                // check if the target user is a bot
                if (timeoutUser.user.bot) {
                    await modalInteraction.reply({
                        content: "You cannot timeout a bot.",
                        ephemeral: true,
                    });
                    return;
                }
                // check if the target user is the owner of the server
                if (timeoutUser.id === modalInteraction.guild.ownerId) {
                    await modalInteraction.reply({
                        content: "I cannot timeout my creator.",
                        ephemeral: true,
                    });
                    return;
                }
                //get duration in ms
                const timeoutUserDurationMs = (0, ms_1.default)(timeoutUserDuration);
                //check if duration is valid
                if (isNaN(timeoutUserDurationMs)) {
                    await modalInteraction.reply({
                        content: "Invalid duration. Please enter a valid duration.",
                        ephemeral: true,
                    });
                    return;
                }
                //check if the duration is below 5 seconds or above 28 days
                if (timeoutUserDurationMs < 5000 ||
                    timeoutUserDurationMs > 28 * 24 * 60 * 60 * 1000) {
                    await modalInteraction.reply({
                        content: "Invalid duration. Please enter a duration between 5 seconds and 28 days.",
                        ephemeral: true,
                    });
                    return;
                }
                // define role positions
                const timeoutUserRolePosition = timeoutUser.roles.highest.position;
                const timeoutUserRequesterRolePosition = modalInteraction.member.roles.highest.position;
                const timeoutUserBotRolePosition = modalInteraction.guild.members.me.roles.highest.position;
                // check if the target user is of a higher position than the request user
                if (timeoutUserRolePosition >= timeoutUserRequesterRolePosition) {
                    await modalInteraction.reply({
                        content: "That user is of a higher position of the power hierarchy than you. Therefore you cannot timeout them.",
                        ephemeral: true,
                    });
                    return;
                }
                // check if the target user is of a higher position than the bot
                if (timeoutUserRolePosition >= timeoutUserBotRolePosition) {
                    await modalInteraction.reply({
                        content: "That user is of a higher position of the power hierarchy than me. Therefore i cannot timeout them.",
                        ephemeral: true,
                    });
                    return;
                }
                // timeout the user
                try {
                    await timeoutUser.timeout(timeoutUserDuration, timeoutUserReason);
                    await modalInteraction.reply({
                        content: `The user <@${timeoutUser.user.id}> has been timed out successfully.\n${timeoutUserReason}`,
                        ephemeral: true,
                    });
                }
                catch (error) {
                    console.error("Error timing out user: ", error);
                }
                break;
            default:
                modalInteraction.reply({
                    content: "Something went wrong, Modal not found.",
                    ephemeral: true,
                });
                break;
        }
    }
    catch (error) {
        console.error("Error processing a modal: ", error);
        await modalInteraction
            .reply({
            content: "Something went wrong, the modal could not be processed correctly.",
            ephemeral: true,
        })
            .catch(console.error);
    }
};
