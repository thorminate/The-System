import { ModalSubmitInteraction } from "discord.js";
import SkillData from "../../models/skillDatabaseSchema";
import UserData from "../../models/userDatabaseSchema";

/**
 * Grants a skill to a target user.
 * @param {ModalSubmitInteraction} interaction The interaction that ran the command.
 * @param {string} skillName The name of the skill to be granted.
 * @param {string} targetId The ID of the target user.
 * @returns {Promise<void>}
 */
export default async (
  interaction: ModalSubmitInteraction,
  skillName: string,
  targetId: string
) => {
  const targetData = await UserData.findOne({
    userId: targetId,
  });

  if (!targetData) {
    await interaction.reply({
      content: "Target user not found. Make sure you entered a valid user ID.",
      ephemeral: true,
    });
    return;
  }

  const skillData = await SkillData.findOne({
    skillName: skillName,
  });

  if (!skillData) {
    await interaction.reply({
      content: `Skill ${skillName} not found. Make sure you entered a valid skill name. Or create a new skill.`,
      ephemeral: true,
    });
    return;
  }

  // check if the user already has the skill
  if (targetData.skills.some((skill) => skill === skillData.skillName)) {
    await interaction.reply({
      content: `User already has skill ${skillName}.`,
      ephemeral: true,
    });
    return;
  }

  skillData.skillUsers.push(targetData.userId);
  await skillData.save();
  targetData.skills.push(skillData.skillName);
  await targetData.save();

  await interaction.reply({
    content: `Successfully granted skill ${skillName} to <@${targetId}>.`,
    ephemeral: true,
  });
};
