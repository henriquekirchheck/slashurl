import { URL } from "url"
import { z, ZodType } from "zod"
import { fetchData } from "./fetch"
import { Err, Ok, Result } from "./result"

const UrlModel = z.object({
  short_url: z.string().length(12),
  full_url: z.string().url(),
  created_at: z.string().datetime({ offset: true }),
  views: z.number().min(0),
})

export type UrlModelType = z.infer<typeof UrlModel>

export type UrlModelDateType = {
  [key in keyof UrlModelType]: key extends "created_at"
    ? Date
    : UrlModelType[key]
}

export type CreateUrlResponseType = {
  info: UrlModelDateType
  url: string
}

function changeDateISOStringToDate(data: UrlModelType): UrlModelDateType {
  return {
    ...data,
    created_at: new Date(data.created_at),
  }
}

type FetchConfigType = readonly [input: URL, init: RequestInit]

const fetchApiConstructor = {
  hello: (apiBaseUrl: URL | string) => ({
    config: [
      new URL("/hello", apiBaseUrl),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    ] satisfies FetchConfigType,
    validator: z.string(),
  }),

  list_urls: (apiBaseUrl: URL | string) => ({
    config: [
      new URL("/api/url", apiBaseUrl),
      {
        method: "get",
        headers: {
          Accept: "application/json",
        },
      },
    ] satisfies FetchConfigType,
    validator: z.array(UrlModel),
  }),

  get_url: (apiBaseUrl: URL | string, pathParam: string) => ({
    config: [
      new URL(`/api/url/${pathParam}`, apiBaseUrl),
      {
        method: "get",
        headers: {
          Accept: "application/json",
        },
      },
    ] satisfies FetchConfigType,
    validator: UrlModel,
  }),

  create_url: (apiBaseUrl: URL | string, full_url: string) => ({
    config: [
      new URL("/api/url", apiBaseUrl),
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ full_url }),
      },
    ] satisfies FetchConfigType,
    validator: UrlModel,
  }),
} as const

async function getReturn<T>(fetch: Promise<T>): Promise<Result<T, Error>> {
  try {
    return Ok(await fetch)
  } catch (error) {
    if (error instanceof Error) return Err(error)
    return Err(new Error(String(error)))
  }
}

async function parseJsonWithValidador<V extends ZodType>({
  fetch,
  validator,
}: {
  fetch: Promise<Response>
  validator: V
}): Promise<z.infer<V>> {
  return fetch.then((res) => res.json()).then(validator.parse)
}

export class SlashUrlApiWrapper {
  #baseUrl: string

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl
  }

  public get baseUrl(): string {
    return this.#baseUrl
  }

  #helloModel() {
    const hello = fetchApiConstructor.hello(this.#baseUrl)
    return { fetch: fetchData(...hello.config), validator: hello.validator }
  }

  public helloFetch() {
    return parseJsonWithValidador(this.#helloModel())
  }

  public helloWorld() {
    return getReturn(this.helloFetch())
  }

  #getUrlInfoModel(id: string) {
    const urlInfo = fetchApiConstructor.get_url(this.#baseUrl, id)
    return { fetch: fetchData(...urlInfo.config), validator: urlInfo.validator }
  }

  public getUrlInfoFetch(id: string) {
    return parseJsonWithValidador(this.#getUrlInfoModel(id)).then(
      changeDateISOStringToDate
    )
  }

  #listUrlsInfoModel() {
    const urlsInfo = fetchApiConstructor.list_urls(this.#baseUrl)
    return {
      fetch: fetchData(...urlsInfo.config),
      validator: urlsInfo.validator,
    }
  }

  public listUrlsInfoFetch() {
    return parseJsonWithValidador(this.#listUrlsInfoModel()).then((data) =>
      data.map(changeDateISOStringToDate)
    )
  }

  public urlInfo(
    id?: string
  ): Promise<Result<UrlModelDateType | UrlModelDateType[], Error>> {
    if (id) {
      return getReturn(this.getUrlInfoFetch(id))
    }
    return getReturn(this.listUrlsInfoFetch())
  }

  #createUrlModel(full_url: string) {
    const urlInfo = fetchApiConstructor.create_url(this.#baseUrl, full_url)
    return { fetch: fetchData(...urlInfo.config), validator: urlInfo.validator }
  }

  public createUrlFetch(full_url: string): Promise<CreateUrlResponseType> {
    return parseJsonWithValidador(this.#createUrlModel(full_url))
      .then(changeDateISOStringToDate)
      .then((data) => ({
        info: data,
        url: new URL(`/${data.short_url}`, this.#baseUrl).toString(),
      }))
  }

  public createUrl(
    fullUrl: URL | string
  ): Promise<Result<CreateUrlResponseType, Error>> {
    return getReturn(this.createUrlFetch(fullUrl.toString()))
  }
}
