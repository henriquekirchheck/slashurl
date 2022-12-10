import {
  CommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js"
import { url } from "./url"

export const commandList = [url]
export { url }
export type CommandType = {
  data:
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder
  execute: (interaction: CommandInteraction) => Promise<void>
}
