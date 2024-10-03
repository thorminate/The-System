import { ModalSubmitInteraction } from "discord.js";
import ItemData from "../../models/itemDatabaseSchema";
import UserData from "../../models/userDatabaseSchema";
import EnvironmentData from "../../models/environmentDatabaseSchema";

export default async (
  interaction: ModalSubmitInteraction,
  itemName: string
) => {
  const itemData = await ItemData.findOne({
    itemName: itemName,
  });

  if (!itemData) {
    await interaction.reply({
      content: "Item not found, make sure it exist in the database",
      ephemeral: true,
    });
    return;
  }
  // Delete the item from people's inventories

  for (const user of itemData.itemUsers) {
    const userData = await UserData.findOne({
      userId: user,
      guildId: interaction.guild.id,
    });
    userData.inventory = userData.inventory.filter(
      (item) => item.itemName !== itemName
    );

    await userData.save();
  }

  // Delete the item from environments
  for (const environment of itemData.itemEnvironments) {
    const environmentData = await EnvironmentData.findOne({
      environmentName: environment,
    });

    environmentData.environmentItems = environmentData.environmentItems.filter(
      (item) => item.itemName !== itemName
    );
  }

  // Delete the item from the database.
  await itemData.deleteOne();

  await interaction.reply({
    content: `Successfully deleted item ${itemName}.`,
    ephemeral: true,
  });
};
