import { ClientError, isClientErrorStatus, isServerErrorStatus, ServerError } from './errors'

export const fetchData = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => {
  return fetch(input.toString(), init).then((res) => {
    if (res.ok) return res

    if (isClientErrorStatus(res.status))
      throw new ClientError(res.status, "Client Request Error")

    if (isServerErrorStatus(res.status))
      throw new ServerError(res.status, "Server Request Error")

    throw new Error("Unexpected Fetch Error")
  })
}