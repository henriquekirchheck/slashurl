import { z, ZodType, ZodTypeAny } from "zod"
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

type ApiConstructorType<V extends ZodType> = {
  config: readonly [input: URL, init: RequestInit]
  validator: V
}

const fetchApiConstructor = {
  hello: (apiBaseUrl: URL | string) =>
    ({
      config: [
        new URL("/hello", apiBaseUrl),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      ],
      validator: z.string(),
    } satisfies ApiConstructorType<ZodTypeAny>),

  list_urls: (apiBaseUrl: URL | string) =>
    ({
      config: [
        new URL("/api/url", apiBaseUrl),
        {
          method: "get",
          headers: {
            Accept: "application/json",
          },
        },
      ],
      validator: z.array(UrlModel),
    } satisfies ApiConstructorType<ZodTypeAny>),

  get_url: (apiBaseUrl: URL | string, pathParam: string) =>
    ({
      config: [
        new URL(`/api/url/${pathParam}`, apiBaseUrl),
        {
          method: "get",
          headers: {
            Accept: "application/json",
          },
        },
      ],
      validator: UrlModel,
    } satisfies ApiConstructorType<ZodTypeAny>),

  create_url: (apiBaseUrl: URL | string, full_url: string) =>
    ({
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
      ],
      validator: UrlModel,
    } satisfies ApiConstructorType<ZodTypeAny>),
} as const

async function getReturn<T>(fetch: Promise<T>): Promise<Result<T, Error>> {
  try {
    return Ok(await fetch)
  } catch (error) {
    if (error instanceof Error) return Err(error)
    return Err(new Error(String(error)))
  }
}

const parseFinalValue = async <V extends ZodType>({
  config,
  validator,
}: ApiConstructorType<V>): Promise<z.infer<V>> => {
  return await fetchData(...config)
    .then((res) => res.json())
    .then(validator.parse)
}

export class SlashUrlApiWrapper {
  baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  public getHelloFetch() {
    return () => parseFinalValue(fetchApiConstructor.hello(this.baseUrl))
  }

  public helloWorld() {
    return getReturn(this.getHelloFetch()())
  }

  public getUrlInfoFetch(id: string) {
    return () =>
      parseFinalValue(fetchApiConstructor.get_url(this.baseUrl, id)).then(
        changeDateISOStringToDate
      )
  }

  public getListUrlsInfoFetch() {
    return () =>
      parseFinalValue(fetchApiConstructor.list_urls(this.baseUrl)).then(
        (data) => data.map(changeDateISOStringToDate)
      )
  }

  public urlInfo(
    id?: string
  ): Promise<Result<UrlModelDateType | UrlModelDateType[], Error>> {
    if (id) {
      return getReturn(this.getUrlInfoFetch(id)())
    }
    return getReturn(this.getListUrlsInfoFetch()())
  }

  public getCreateUrlFetch(
    full_url: string
  ): () => Promise<CreateUrlResponseType> {
    return () =>
      parseFinalValue(fetchApiConstructor.create_url(this.baseUrl, full_url))
        .then(changeDateISOStringToDate)
        .then((data) => ({
          info: data,
          url: new URL(`/${data.short_url}`, this.baseUrl).toString(),
        }))
  }

  public createUrl(
    fullUrl: URL | string
  ): Promise<Result<CreateUrlResponseType, Error>> {
    return getReturn(this.getCreateUrlFetch(fullUrl.toString())())
  }
}
