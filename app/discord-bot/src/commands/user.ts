import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import { CommandType } from "./index"

export const user: CommandType = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user."),
  async execute(interaction: CommandInteraction) {
    await interaction.reply(
      `This command was run by ${interaction.user.username}, who created a Discord account on ${interaction.user.createdAt.toLocaleDateString()}.`
    )
  },
}
