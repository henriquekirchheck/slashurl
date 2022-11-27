import axios, { AxiosRequestConfig } from "axios"

export type ResponseType<T> = {
  success: boolean
  error?: Error
  data?: T
}

export type UrlModelType = {
  short_url: string
  full_url: string
  created_at: Date
  views: number
}

export type CreateUrlResponseType = {
  info: UrlModelType
  url: string
}

export class SlashUrlApiWrapper {
  #baseUrl: string
  #endpoints = {
    hello: (): AxiosRequestConfig => ({
      baseURL: this.#baseUrl,
      url: "/hello",
      method: "get",
      headers: {
        Accept: "application/json",
      },
    }),
    list_urls: (): AxiosRequestConfig => ({
      baseURL: this.#baseUrl,
      url: "/api/url",
      method: "get",
      headers: {
        Accept: "application/json",
      },
    }),
    get_url: (pathParam: string): AxiosRequestConfig => ({
      baseURL: this.#baseUrl,
      url: `/api/url/${pathParam}`,
      method: "get",
      headers: {
        Accept: "application/json",
      },
    }),
    create_url: (full_url: string): AxiosRequestConfig => ({
      baseURL: this.#baseUrl,
      url: "/api/url",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
      data: {
        full_url,
      },
    }),
  }

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl
  }

  public get baseUrl(): string {
    return this.#baseUrl
  }

  #getError<T>(error: unknown): ResponseType<T> {
    if (axios.isAxiosError(error) || error instanceof Error)
      return { success: false, error }
    return { success: false, error: new Error(String(error)) }
  }

  #getData<T>(data: T): ResponseType<T> {
    return { success: true, data }
  }

  async helloWorld(): Promise<ResponseType<string>> {
    const config = this.#endpoints.hello()
    try {
      const data = await axios
        .request<string>({ ...config })
        .then((res) => res.data)
      return this.#getData(data)
    } catch (error) {
      return this.#getError(error)
    }
  }

  async urlInfo(
    id?: string
  ): Promise<ResponseType<UrlModelType | UrlModelType[]>> {
    try {
      if (id) {
        const config = this.#endpoints.get_url(id)
        const data = await axios
          .request<UrlModelType>({ ...config })
          .then((res) => res.data)
        return this.#getData(data)
      }

      const config = this.#endpoints.list_urls()
      const data = await axios
        .request<UrlModelType[]>({ ...config })
        .then((res) => res.data)
      return this.#getData(data)
    } catch (error) {
      return this.#getError(error)
    }
  }

  async createUrl(fullUrl: URL): Promise<ResponseType<CreateUrlResponseType>> {
    const config = this.#endpoints.create_url(fullUrl.toString())
    try {
      const data = await axios
        .request<UrlModelType>({ ...config })
        .then((res) => res.data)
      return this.#getData({
        info: data,
        url: new URL(`/${data.short_url}`, this.#baseUrl).toString(),
      })
    } catch (error) {
      return this.#getError(error)
    }
  }
}
