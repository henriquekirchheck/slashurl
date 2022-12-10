import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { CommandType } from "."
import { urlApiWrapper } from "../utils/apiWrapper"
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
            .setDescription("The Full URL to be shortened (with protocol)")
            .setMinLength(9)
            .setRequired(true)
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    switch (interaction.options.getSubcommand()) {
      case CREATE_SUBCOMMAND_NAME: {
        const fullUrl = interaction.options.getString(
          FULL_URL_OPTION_NAME,
          true
        )
        await interaction.deferReply({ ephemeral: true })

        if (!isValidUrl(fullUrl)) {
          await interaction.editReply({
            content: `${fullUrl} is not a valid URL`,
          })
          break
        }

        const shortUrl = await urlApiWrapper.createUrl(new URL(fullUrl))

        if (shortUrl.success === false) {
          await interaction.editReply({
            content: "There was a error in the backend, try again later",
          })
          break
        }

        await interaction.editReply({
          content: `The generated URL is: ${shortUrl.data.url}`
        })

        break
      }
    }
  },
}
