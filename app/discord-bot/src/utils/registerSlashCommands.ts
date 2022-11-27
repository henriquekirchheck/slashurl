import {
  APIApplicationCommand,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js"
import { commandList } from "../commands/index"
import { commandInteractionCreate } from "../events/commandInteractionCreate"
import { Client } from "./client"

const deplyCommands = async (
  commands: RESTPostAPIChatInputApplicationCommandsJSONBody[],
  rest: REST,
  clientId: string
) => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    )

    const data = await rest.put(
      Routes.applicationCommands(clientId),
      {  body: commands }
    ) as APIApplicationCommand[]

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    )
  } catch (error) {
    console.error(error)
  }
}

export const registerSlashCommands = (client: Client, rest: REST, clientId: string) => {
  commandList.forEach((command) => {
    client.commands.set(command.data.name, command)
  })

  commandInteractionCreate(client)

  const commands = commandList.map((command) => command.data.toJSON())

  deplyCommands(commands, rest, clientId)
}
