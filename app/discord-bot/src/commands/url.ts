import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  time,
} from "discord.js"
import { CommandType } from "."
import { urlApiWrapper } from "../utils/apiWrapper"
import { isValidUrl } from "../utils/checkUrl"
import { randomHexColor } from "../utils/randomHexColor"

const CREATE_SUBCOMMAND_NAME = "create"
const INFO_SUBCOMMAND_NAME = "info"
const FULL_URL_OPTION_NAME = "full_url"
const SHORT_URL_OPTION_NAME = "short_url"
const SHORT_ID_LENGHT = 12

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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(INFO_SUBCOMMAND_NAME)
        .setDescription("Get info from a Short URL")
        .addStringOption((option) =>
          option
            .setName(SHORT_URL_OPTION_NAME)
            .setDescription("The Short URL or Short ID to be searched")
            .setMinLength(SHORT_ID_LENGHT)
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
          content: `The generated URL is: ${shortUrl.data.url}`,
        })

        break
      }
      case INFO_SUBCOMMAND_NAME: {
        const shortUrl = interaction.options.getString(
          SHORT_URL_OPTION_NAME,
          true
        )
        await interaction.deferReply({ ephemeral: true })

        const shortId = isValidUrl(shortUrl)
          ? shortUrl.split("/").slice(-1)[0] || null
          : shortUrl

        if (shortId === null || shortId.length !== SHORT_ID_LENGHT) {
          await interaction.editReply({
            content: "The URL or ID you provided is invalid, try again",
          })
          break
        }

        const urlInfo = await urlApiWrapper.urlInfo(shortId)

        if (!urlInfo.success) {
          await interaction.editReply({
            content: "There was a error in the backend, try again later",
          })
          break
        }

        if (Array.isArray(urlInfo.data)) {
          await interaction.editReply({
            content:
              "There was a error in the backend with invalid data types, try again",
          })
          break
        }

        if (urlInfo.data === null) {
          await interaction.editReply({
            content: "The URL or ID you provided is invalid, try again",
          })
          break
        }

        const dataEmbed = new EmbedBuilder()
          .setColor(randomHexColor())
          .setTitle("ShortURL Info")
          .setURL(urlInfo.data.full_url)
          .setDescription(`Info for ShortURL ID: ${urlInfo.data.short_url}`)
          .addFields(
            { name: "ShortURL ID", value: urlInfo.data.short_url },
            { name: "Full URL", value: urlInfo.data.full_url },
            {
              name: "Creation Date",
              value: time(urlInfo.data.created_at, "F"),
            },
            { name: "Total Views", value: `${urlInfo.data.views}` }
          )

        await interaction.editReply({
          embeds: [dataEmbed],
        })

        break
      }
    }
  },
}
