import { ModalSubmitInteraction } from "discord.js";
import skillData from "../../models/skillDatabaseSchema";

/**
 * Creates a new skill in the database.
 * @param {ModalSubmitInteraction} interaction The interaction that ran the command.
 * @param {string} skillName The name of the skill.
 * @param {string} skillDescription The description of the skill.
 * @param {string} skillAction The action of the skill.
 * @param {number} skillCooldown The cooldown of the skill.
 * @param {number} skillWill The will of the skill.
 * @param {boolean} strict Whether the command should check if the inputs are valid. Default is false.
 * @returns {Promise<void>}
 */
export default async (
  interaction: ModalSubmitInteraction,
  skillName: string,
  skillDescription: string,
  skillAction: string,
  skillCooldown: number,
  skillWill: number,
  strict: boolean = false
): Promise<void> => {
  // Validate the inputs
  if (!strict) {
    if (
      skillName === "" ||
      skillDescription === "" ||
      skillAction === "" ||
      isNaN(skillCooldown) ||
      isNaN(skillWill)
    ) {
      await interaction.reply({
        content:
          "Please fill in all the required fields correctly. Cooldown and Will must be numbers.",
        ephemeral: true,
      });
      return;
    }
  }
  // check if skill already exists
  if (await skillData.findOne({ skillName: skillName })) {
    await interaction.reply({
      content: "Skill already exists. Please choose a different name.",
      ephemeral: true,
    });
    return;
  }

  // create a new skill and store it in the database

  const newSkill = new skillData({
    skillName: skillName,
    skillDescription: skillDescription,
    skillAction: skillAction,
    skillCooldown: skillCooldown,
    skillWill: skillWill,
  });

  await newSkill.save();

  await interaction.reply({
    content: `Successfully created skill ${skillName}.`,
    ephemeral: true,
  });
};
