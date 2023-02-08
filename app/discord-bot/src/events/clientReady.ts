import { Events } from "discord.js"
import { Client } from "../utils/client"

export const clientReady = (client: Client) => {
  client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
  })
}
