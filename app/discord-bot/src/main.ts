import { GatewayIntentBits, REST } from "discord.js"
import { clientReady } from "./events/clientReady"
import { Client } from "./utils/client"
import { registerSlashCommands } from './utils/registerSlashCommands'

const env = {
  token: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const rest = new REST({ version: "10" }).setToken(env.token)

clientReady(client)
registerSlashCommands(client, rest, env.clientId)

client.login(env.token)
