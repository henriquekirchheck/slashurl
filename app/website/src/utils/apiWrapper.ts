import { SlashUrlApiWrapper } from "@slashurl/api-wrapper"

const apiUrl = import.meta.env.VITE_API_URL
console.log(apiUrl)
export const urlApiWrapper = new SlashUrlApiWrapper(apiUrl)
console.log(urlApiWrapper)
