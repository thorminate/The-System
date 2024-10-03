"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skillDatabaseSchema_1 = __importDefault(require("../../models/skillDatabaseSchema"));
const userDatabaseSchema_1 = __importDefault(require("../../models/userDatabaseSchema"));
exports.default = async (interaction, skillName, targetId) => {
    const skillData = await skillDatabaseSchema_1.default.findOne({
        skillName: skillName,
    });
    if (!skillData) {
        await interaction.reply({
            content: `Skill ${skillName} not found. Make sure you entered a valid skill name. Or create a new skill.`,
            ephemeral: true,
        });
        return;
    }
    const targetData = await userDatabaseSchema_1.default.findOne({
        userId: targetId,
        guildId: interaction.guild.id,
    });
    if (!targetData) {
        await interaction.reply({
            content: "Target user not found. Make sure you entered a valid user ID.",
            ephemeral: true,
        });
        return;
    }
    // check if the user has the skill
    if (targetData.skills.includes(skillData.skillName)) {
        targetData.skills = targetData.skills.filter((skill) => skill !== skillData.skillName);
        skillData.skillUsers = skillData.skillUsers.filter((user) => user !== targetData.userId);
        await skillData.save();
        await targetData.save();
        await interaction.reply({
            content: `Successfully revoked skill ${skillName} from <@${targetId}>.`,
            ephemeral: true,
        });
    }
    else {
        await interaction.reply({
            content: `User does not have skill ${skillName}.`,
            ephemeral: true,
        });
    }
};
