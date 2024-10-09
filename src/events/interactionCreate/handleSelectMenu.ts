/**
 * Handles the select menus.
 * @param {Client} bot The instantiating client.
 * @param {Interaction} interaction The interaction that ran the command.
 */
import userData from "../../models/userDatabaseSchema";
import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  StringSelectMenuInteraction,
  RoleSelectMenuInteraction,
  UserSelectMenuInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  TextChannel,
  GuildMemberRoleManager,
} from "discord.js";

export default async (
  bot: Client,
  interaction:
    | StringSelectMenuInteraction
    | RoleSelectMenuInteraction
    | UserSelectMenuInteraction
    | ChannelSelectMenuInteraction
    | MentionableSelectMenuInteraction
) => {
  switch (interaction.customId) {
    case "species-select":
      if (!interaction.isStringSelectMenu()) return;
      let user = await userData.findOne({ id: interaction.user.id });

      if (!user) {
        const newUser = new userData({
          id: interaction.user.id,
          guild: interaction.guild.id,
        });
        user = newUser;
      }

      await interaction.values.forEach(async (value) => {
        user.species = value;
        if (value === "Human") {
          user.multipliers.strength = 1.1;
          user.multipliers.will = 1.1;
          user.multipliers.cognition = 1.1;
        } else if (value === "Elf") {
          user.multipliers.strength = 0.9;
          user.multipliers.will = 1.3;
          user.multipliers.cognition = 1.1;
        } else if (value === "Dwarf") {
          user.multipliers.strength = 1.1;
          user.multipliers.will = 0.9;
          user.multipliers.cognition = 1.3;
        } else if (value === "Orc") {
          user.multipliers.strength = 1.3;
          user.multipliers.will = 1.1;
          user.multipliers.cognition = 0.9;
        }
        await user.save();

        const classMenu = new StringSelectMenuBuilder()
          .setCustomId("class-select")
          .setPlaceholder("Select your class!")
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel("Warrior")
              .setDescription(
                "Warriors are the most common and versatile class."
              )
              .setEmoji("⚔️")
              .setValue("Warrior"),
            new StringSelectMenuOptionBuilder()
              .setLabel("Ranger")
              .setDescription(
                "Rangers are known for their quick and stealthy moves."
              )
              .setEmoji("🏹")
              .setValue("Ranger"),
            new StringSelectMenuOptionBuilder()
              .setLabel("Rogue")
              .setDescription(
                "Rogues are known for their sneaky and stealthy moves."
              )
              .setEmoji("🗡️")
              .setValue("Rogue")
          );

        const classRow =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            classMenu
          );

        interaction.reply({
          content: "Perfect! Now select your class!",
          components: [classRow],
          ephemeral: true,
        });
      });
      break;

    case "class-select":
      if (!interaction.isStringSelectMenu()) return;
      const selectedClass = interaction.values[0];

      const userClass = await userData.findOne({ id: interaction.user.id });

      if (userClass) {
        userClass.class = selectedClass;
        userClass.isOnboard = true;
        await userClass.save();

        interaction.reply({
          content: "Your class has been set! Welcome aboard, player.",
          ephemeral: true,
        });
        const onboardingChannel = interaction.guild.channels.cache.get(
          "1270790941892153404"
        ) as TextChannel;

        if (!onboardingChannel) {
          interaction.reply({
            content:
              "Onboarding channel doesn't exist! Please contact an admin.",
            ephemeral: true,
          });
          return;
        }
        const messages = await onboardingChannel.messages.fetch({ limit: 1 });
        const message = messages.first();
        const resetButton = new ButtonBuilder()
          .setCustomId("begin-onboarding")
          .setLabel("Begin Onboarding")
          .setStyle(ButtonStyle.Success)
          .setDisabled(false);

        const resetRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          resetButton
        );

        await message.edit({
          components: [resetRow],
        });
        (interaction.member.roles as GuildMemberRoleManager).add(
          "1270791621289578607"
        );
      }
      break;
  }
};
