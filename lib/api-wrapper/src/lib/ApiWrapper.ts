import axios, { AxiosRequestConfig } from "axios"

export type ResultType<T> = { error?: Error | string; data?: T }

export class SlashUrlApiWrapper {
  #baseUrl: string
  #endpoints = {
    hello: (): AxiosRequestConfig => ({
      baseURL: this.#baseUrl,
      url: "/hello",
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }),
  }

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl
  }

  public get baseUrl(): string {
    return this.#baseUrl
  }

  #getError(error: unknown) {
    return error instanceof Error ? { error: error } : { error: String(error) }
  }

  async helloWorld(): Promise<ResultType<string>> {
    const config = this.#endpoints.hello()
    try {
      const data = await axios.request<string>({ ...config }).then((res) => res.data)
      return { data }
    } catch (error) {
      return this.#getError(error)
    }
  }
}
