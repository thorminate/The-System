import { ModalSubmitInteraction } from "discord.js";
import skillData from "../../models/skillDatabaseSchema";
import userData from "../../models/userDatabaseSchema";

export default async (
  interaction: ModalSubmitInteraction,
  skillName: string
) => {
  const skill = await skillData.findOne({
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
  const skillUsers = await userData.find({
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
