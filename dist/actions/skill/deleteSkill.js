"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const skillDatabaseSchema_1 = __importDefault(require("../../models/skillDatabaseSchema"));
const userDatabaseSchema_1 = __importDefault(require("../../models/userDatabaseSchema"));
exports.default = async (interaction, skillName) => {
    const skill = await skillDatabaseSchema_1.default.findOne({
        skillName: skillName,
    });
    if (!skill) {
        await interaction.reply({
            content: `Skill ${skillName} not found. Make sure you entered a valid skill name. Or create a new skill.`,
            ephemeral: true,
        });
        return;
    }
    // first delete the skill from all users that have it
    const skillUsers = await userDatabaseSchema_1.default.find({
        userId: { $in: skill.skillUsers },
    });
    skillUsers.forEach(async (skillUser) => {
        skillUser.skills = skillUser.skills.filter((skill) => skill !== skillName);
        await skillUser.save();
    });
    // delete the skill from the database
    await skill.deleteOne();
    await interaction.reply({
        content: `Successfully deleted skill ${skillName}.`,
        ephemeral: true,
    });
};
