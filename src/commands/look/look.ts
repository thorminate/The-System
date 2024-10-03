import {
  Client,
  CommandInteraction,
  GuildMember,
  InteractionReplyOptions,
} from "discord.js";
import commandVerify from "../../utils/commandVerify";
import UserData from "../../models/userDatabaseSchema";
import EnvironmentData from "../../models/environmentDatabaseSchema";

module.exports = {
  name: "look",
  description: "Look around in your current environment",
  //devOnly: Boolean,
  //testOnly: true,
  //permissionsRequired: [PermissionFlagsBits.Administrator],
  //botPermissions: [PermissionFlagsBits.Administrator],
  //options: [],
  //deleted: true,
  callback: async (bot: Client, interaction: CommandInteraction) => {
    try {
      if (!commandVerify(interaction)) return;

      await interaction.deferReply({
        ephemeral: true,
      });

      const userId = (interaction.member as GuildMember).id;

      const userData = await UserData.findOne({
        userId: userId,
        guildId: interaction.guild.id,
      });

      if (!userData) {
        await interaction.editReply({
          content:
            "You haven't been integrated into the system yet. Head over to <#1270790941892153404>",
        });
        return;
      }

      const userEnvironmentData = await EnvironmentData.findOne({
        environmentName: userData.environment,
      });

      if (!userEnvironmentData) {
        await interaction.editReply({
          content: "You aren't inside an environment",
        });
        return;
      }
      if (userEnvironmentData.environmentChannel !== interaction.channel.id) {
        await interaction.editReply({
          content: `You can only look in your current environment, <#${userEnvironmentData.environmentChannel}>`,
        });
        return;
      }

      await interaction.editReply({
        content: (await userEnvironmentData).environmentItems.join(", "),
      });
    } catch (error) {
      console.log(error);
    }
  },
};
