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

export const changeDateISOStringToDate = (data: UrlModelType) => ({
  ...data,
  created_at: new Date(data.created_at),
})

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
    validator: z.array(UrlModel).nullable(),
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
        body: JSON.stringify({full_url}),
      },
    ] satisfies FetchConfigType,
    validator: UrlModel,
  }),
} as const

async function getReturn<V extends ZodType, T>(
  {
    fetch,
    validator,
  }: {
    fetch: Promise<Response>
    validator: V
  },
  modifyResultCallback: (data: z.infer<V>) => T = (data) => data
): Promise<Result<T, Error>> {
  try {
    const data = await fetch.then((res) => res.json())
    return Ok(modifyResultCallback(validator.parse(data)))
  } catch (error) {
    if (error instanceof Error) return Err(error)
    return Err(new Error(String(error)))
  }
}

export class SlashUrlApiWrapper {
  #baseUrl: string

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl
  }

  public get baseUrl(): string {
    return this.#baseUrl
  }

  public helloPromise() {
    const hello = fetchApiConstructor.hello(this.#baseUrl)
    return { fetch: fetchData(...hello.config), validator: hello.validator }
  }

  public async helloWorld() {
    return getReturn(this.helloPromise())
  }

  public getUrlInfoPromise(id: string) {
    const urlInfo = fetchApiConstructor.get_url(this.#baseUrl, id)
    return { fetch: fetchData(...urlInfo.config), validator: urlInfo.validator }
  }

  public listUrlsInfoPromise() {
    const urlsInfo = fetchApiConstructor.list_urls(this.#baseUrl)
    return {
      fetch: fetchData(...urlsInfo.config),
      validator: urlsInfo.validator,
    }
  }

  public async urlInfo(
    id?: string
  ): Promise<Result<UrlModelDateType | UrlModelDateType[] | null, Error>> {
    if (id) {
      return getReturn(
        this.getUrlInfoPromise(id),
        changeDateISOStringToDate
      )
    }
    return getReturn(this.listUrlsInfoPromise(), (data) =>
      data ? data.map(changeDateISOStringToDate) : null
    )
  }

  public createUrlPromise(full_url: string) {
    const urlInfo = fetchApiConstructor.create_url(this.#baseUrl, full_url)
    return { fetch: fetchData(...urlInfo.config), validator: urlInfo.validator }
  }

  public async createUrl(
    fullUrl: URL | string
  ): Promise<Result<CreateUrlResponseType, Error>> {
    return getReturn(
      this.createUrlPromise(fullUrl.toString()),
      (data) => ({
        info: changeDateISOStringToDate(data),
        url: new URL(`/${data.short_url}`, this.#baseUrl).toString(),
      })
    )
  }
}
