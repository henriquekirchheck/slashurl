import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import { ping } from "./ping"
import { server } from "./server"
import { user } from "./user"

export { ping, server, user }
export const commandList = [ping, server, user]

export type CommandType = {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => Promise<void>
}
