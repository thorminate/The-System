import { ModalSubmitInteraction } from "discord.js";
import SkillData from "../../models/skillDatabaseSchema";
import UserData from "../../models/userDatabaseSchema";

export default async (
  interaction: ModalSubmitInteraction,
  skillName: string,
  targetId: string
) => {
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

  const targetData = await UserData.findOne({
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
    targetData.skills = targetData.skills.filter(
      (skill) => skill !== skillData.skillName
    );
    skillData.skillUsers = skillData.skillUsers.filter(
      (user) => user !== targetData.userId
    );

    await skillData.save();
    await targetData.save();
    await interaction.reply({
      content: `Successfully revoked skill ${skillName} from <@${targetId}>.`,
      ephemeral: true,
    });
  } else {
    await interaction.reply({
      content: `User does not have skill ${skillName}.`,
      ephemeral: true,
    });
  }
};
