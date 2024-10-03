import { ModalSubmitInteraction } from "discord.js";
import itemData from "../../models/itemDatabaseSchema";

export default async (
  interaction: ModalSubmitInteraction,
  itemName: string,
  itemDescription: string,
  itemActionType: "interact" | "consume" | "use"
) => {
  const item = await itemData.findOne({ itemName: itemName });
  if (item) {
    interaction.reply({
      content: "An item with that name already exists.",
      ephemeral: true,
    });
    return;
  }

  const newItem = new itemData({
    itemName: itemName,
    itemDescription: itemDescription,
    itemActionable: itemActionType,
  });

  await newItem.save();

  await interaction.reply({
    content: `Successfully created item ${itemName}.`,
    ephemeral: true,
  });
  setTimeout(() => {
    interaction.deleteReply();
  }, 5000);
};
