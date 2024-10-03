/**
 * Handles the button interactions.
 * @param {Client} bot The instantiating client.
 * @param {ButtonInteraction} interaction The interaction that ran the command.
 */

import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  ButtonInteraction,
  GuildMemberRoleManager,
  TextChannel,
  GuildChannelManager,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"; // Import the discord.js library.
import userData from "../../models/userDatabaseSchema"; // Import the user database schema.

export default async (bot: Client, buttonInteraction: ButtonInteraction) => {
  if (!buttonInteraction.isButton()) return;
  switch (buttonInteraction.customId) {
    // Onboarding buttons
    case "begin-onboarding":
      let user = await userData.findOne({
        userId: buttonInteraction.user.id,
        guildId: buttonInteraction.guild.id,
      });
      const userDiscord = await buttonInteraction.guild.members.fetch(
        buttonInteraction.user.id
      );

      if (!user) {
        const newUser = new userData({
          userId: buttonInteraction.user.id,
          guildId: buttonInteraction.guild.id,
          isOnboard: false,
        });

        user = newUser;

        await user.save();
      }
      if (
        user.isOnboard &&
        !userDiscord.roles.cache.has("1270791621289578607")
      ) {
        await buttonInteraction.reply({
          content:
            "You have already completed the onboarding process, but you don't have the player role. Fixing...",
          ephemeral: true,
        });

        setTimeout(() => {
          (buttonInteraction.member.roles as GuildMemberRoleManager).add(
            buttonInteraction.guild.roles.cache.find(
              (role) => role.id === "1270791621289578607"
            )
          );
        }, 2000);
        return;
      } else if (user.isOnboard) {
        await buttonInteraction.reply({
          content: "You have already completed the onboarding process.",
          ephemeral: true,
        });
        return;
      }
      const onboardingChannel = (
        buttonInteraction.guild.channels as GuildChannelManager
      ).cache.get("1270790941892153404") as TextChannel;
      const messages = await onboardingChannel.messages.fetch({ limit: 1 });
      const message = messages.first();

      // Ensure the message has components
      if (!message || !message.components || message.components.length === 0) {
        console.error("No components found in the message.");
        return;
      }

      const actionRow = message.components[0];
      const beginOnboardingButtonData = actionRow.components[0].data;

      // Recreate the button using ButtonBuilder
      const beginOnboardingButton = new ButtonBuilder()
        .setCustomId("welcome-channel-begin-onboarding")
        .setLabel("Onboarding player...")
        .setStyle(ButtonStyle.Success)
        .setDisabled(true);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        beginOnboardingButton
      );

      await message.edit({
        components: [row],
      });

      // Set a timeout to reset the button after 15 minutes (15 * 60 * 1000 ms)
      const resetTimeout = setTimeout(async () => {
        await resetButton();
      }, 2 * 60 * 1000);

      // Function to reset the button
      const resetButton = async () => {
        const resetButton = new ButtonBuilder()
          .setCustomId("welcome-channel-begin-onboarding")
          .setLabel("Begin Onboarding")
          .setStyle(ButtonStyle.Success)
          .setDisabled(false);

        const resetRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          resetButton
        );

        await message.edit({
          components: [resetRow],
        });
      };

      if (user.isOnboard) {
        clearTimeout(resetTimeout);
        await resetButton();
      }

      const speciesMenu = new StringSelectMenuBuilder()
        .setCustomId("species-select")
        .setPlaceholder("Select your species!")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Human")
            .setDescription("Humans are the most common and versatile species.")
            .setEmoji("👨")
            .setValue("Human"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Elf")
            .setDescription(
              "Elves are known for their tall build and attunement to nature."
            )
            .setEmoji("🧝")
            .setValue("Elf"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Dwarf")
            .setDescription("Dwarves are known for their dexterity and smarts.")
            .setEmoji("🧙")
            .setValue("Dwarf"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Orc")
            .setDescription(
              "Orcs are known for their brutish strength and resilience."
            )
            .setEmoji("🧟")
            .setValue("Orc")
        );
      const speciesRow =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          speciesMenu
        );

      buttonInteraction.reply({
        content: "First off, select your species!",
        components: [speciesRow],
        ephemeral: true,
      });
      break;

    // Edit environment modals
    case "edit-environment-items-button":
      try {
        const editEnvironmentItemsModal = new ModalBuilder()
          .setCustomId("edit-environment-items-modal")
          .setTitle("Edit Environment Items");

        const editEnvironmentItemsOperatorInput = new TextInputBuilder()
          .setCustomId("edit-environment-items-operator-input")
          .setLabel("Remove or Add")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const editEnvironmentItemsValueInput = new TextInputBuilder()
          .setCustomId("edit-environment-items-value-input")
          .setLabel("Item name")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const editEnvironmentItemsOperatorRow =
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            editEnvironmentItemsOperatorInput
          );

        const editEnvironmentItemsValueRow =
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            editEnvironmentItemsValueInput
          );

        editEnvironmentItemsModal.addComponents(
          editEnvironmentItemsOperatorRow,
          editEnvironmentItemsValueRow
        );

        await buttonInteraction.showModal(editEnvironmentItemsModal);
      } catch (error) {
        console.error(error);
      }
      break;

    case "edit-environment-users-button":
      try {
        const editEnvironmentUsersModal = new ModalBuilder()
          .setCustomId("edit-environment-users-modal")
          .setTitle("Edit Environment Users");

        const editEnvironmentUsersOperatorInput = new TextInputBuilder()
          .setCustomId("edit-environment-users-operator-input")
          .setLabel("Operator")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const editEnvironmentUsersInput = new TextInputBuilder()
          .setCustomId("edit-environment-users-input")
          .setLabel("User ID")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const editEnvironmentUsersOperatorRow =
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            editEnvironmentUsersOperatorInput
          );

        const editEnvironmentUsersInputRow =
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            editEnvironmentUsersInput
          );

        editEnvironmentUsersModal.addComponents(
          editEnvironmentUsersOperatorRow,
          editEnvironmentUsersInputRow
        );

        await buttonInteraction.showModal(editEnvironmentUsersModal);
      } catch (error) {
        console.log(error);
      }
      break;

    case "edit-environment-channels-button":
      try {
        const editEnvironmentChannelsModal = new ModalBuilder()
          .setCustomId("edit-environment-channels-modal")
          .setTitle("Edit Environment Channels");

        const editEnvironmentChannelsValueInput = new TextInputBuilder()
          .setCustomId("edit-environment-channels-value-input")
          .setLabel("Value")
          .setRequired(true)
          .setStyle(TextInputStyle.Short)
          .setMinLength(18);

        const editEnvironmentChannelsValueRow =
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            editEnvironmentChannelsValueInput
          );

        editEnvironmentChannelsModal.addComponents(
          editEnvironmentChannelsValueRow
        );

        await buttonInteraction.showModal(editEnvironmentChannelsModal);
      } catch (error) {
        console.log(error);
      }
      break;
  }
};
