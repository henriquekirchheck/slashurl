import axios, { AxiosRequestConfig } from "axios"

type ResponseSuccessType<T> = {
  success: true
  data: T
}
type ResponseErrorType = {
  success: false
  error: Error
}

export type ResponseType<T> = ResponseSuccessType<T> | ResponseErrorType

export type UrlModelResponseType = {
  short_url: string
  full_url: string
  created_at: string
  views: number
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
  private endpointsConstructor = {
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
  } as const

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

  public getAxiosConfigConstructor<T extends keyof typeof this.endpointsConstructor>(endpoint: T): (typeof this.endpointsConstructor)[T]{
    return this.endpointsConstructor[endpoint]
  }

  async helloWorld(): Promise<ResponseType<string>> {
    const config = this.endpointsConstructor.hello()
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
  ): Promise<ResponseType<UrlModelType | UrlModelType[] | null>> {
    try {
      if (id) {
        const config = this.endpointsConstructor.get_url(id)
        const data = await axios
          .request<UrlModelResponseType | null>({ ...config })
          .then((res) => res.data)
        return this.#getData(
          data
            ? {
                ...data,
                created_at: new Date(data.created_at),
              }
            : null
        )
      }

      const config = this.endpointsConstructor.list_urls()
      const data = await axios
        .request<UrlModelResponseType[]>({ ...config })
        .then((res) => res.data)
      return this.#getData(
        data.map((data) => ({
          ...data,
          created_at: new Date(data.created_at),
        }))
      )
    } catch (error) {
      return this.#getError(error)
    }
  }

  async createUrl(fullUrl: URL): Promise<ResponseType<CreateUrlResponseType>> {
    const config = this.endpointsConstructor.create_url(fullUrl.toString())
    try {
      const data = await axios
        .request<UrlModelResponseType>({ ...config })
        .then((res) => res.data)
      return this.#getData({
        info: { ...data, created_at: new Date(data.created_at) },
        url: new URL(`/${data.short_url}`, this.#baseUrl).toString(),
      })
    } catch (error) {
      return this.#getError(error)
    }
  }
}
