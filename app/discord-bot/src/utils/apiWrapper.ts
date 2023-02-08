import { SlashUrlApiWrapper } from "@slashurl/api-wrapper"

export const urlApiWrapper = new SlashUrlApiWrapper(process.env["API_URL"])
