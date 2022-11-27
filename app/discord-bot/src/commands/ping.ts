import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import { CommandType } from "./index"

export const ping: CommandType = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("Pong!")
  },
}
