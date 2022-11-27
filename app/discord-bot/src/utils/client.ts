import { Client as DSClient, ClientOptions, Collection } from "discord.js"
import { CommandType } from "../commands/index"

export class Client extends DSClient {
  commands: Collection<string, CommandType>

  constructor(options: ClientOptions) {
    super(options)
    this.commands = new Collection()
  }
}
