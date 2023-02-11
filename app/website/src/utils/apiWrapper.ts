import { SlashUrlApiWrapper } from "@slashurl/api-wrapper"

export const urlApiWrapper = new SlashUrlApiWrapper(import.meta.env.VITE_API_URL)