import { Events } from "discord.js"
import { Client } from "../utils/client"

export const commandInteractionCreate = (client: Client) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = (interaction.client as Client).commands.get(
      interaction.commandName
    )

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      })
    }
  })
}
