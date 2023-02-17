import { SlashUrlApiWrapper } from "@slashurl/api-wrapper"
export type {
  CreateUrlResponseType,
  UrlModelDateType,
} from "@slashurl/api-wrapper"

const apiUrl = import.meta.env.VITE_API_URL
export const urlApiWrapper = new SlashUrlApiWrapper(apiUrl)
