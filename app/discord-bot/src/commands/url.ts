import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { CommandType } from "."
import { isValidUrl } from "../utils/checkUrl"
// import { setTimeout as wait } from "timers/promises"

const CREATE_SUBCOMMAND_NAME = "create"
const FULL_URL_OPTION_NAME = "full_url"

export const url: CommandType = {
  data: new SlashCommandBuilder()
    .setName("url")
    .setDescription("URL commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(CREATE_SUBCOMMAND_NAME)
        .setDescription("Create new Short URL")
        .addStringOption((option) =>
          option
            .setName(FULL_URL_OPTION_NAME)
            .setDescription("The Full URL to be shortened")
            .setMinLength(9)
            .setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === CREATE_SUBCOMMAND_NAME) {
      const fullUrl = interaction.options.getString(FULL_URL_OPTION_NAME, true)

      await interaction.deferReply({ ephemeral: true })
      await interaction.editReply({
        content: `${fullUrl} ${isValidUrl(fullUrl) ? "é valido" : "não é valido"}`,
      })
      return
    }
  },
}
