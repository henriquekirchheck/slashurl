import fetchMock from "jest-fetch-mock"
import {
  changeDateISOStringToDate,
  SlashUrlApiWrapper,
  UrlModelType,
} from "./ApiWrapper"

describe("apiWrapper", () => {
  const baseUrl = "http://127.0.0.1:8080/"
  const urlModels: UrlModelType[] = [
    {
      short_url: "abcdefghijkl",
      full_url: "https://kernel.org/",
      created_at: new Date().toISOString(),
      views: 70 - 1,
    },
    {
      short_url: "goooooooogle",
      full_url: "https://google.com/",
      created_at: new Date().toISOString(),
      views: 70 - 1,
    },
  ]
  const wrapper = new SlashUrlApiWrapper(baseUrl)

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it("should work", () => {
    expect("hi").toEqual("hi")
  })
  it("should get hello world", async () => {
    const serverResponse = "test: Hello World!"

    fetchMock.mockResponseOnce(JSON.stringify(serverResponse))

    const result = await wrapper.helloWorld()

    expect(result).toEqual({
      ok: true,
      data: serverResponse,
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it("should return error case", async () => {
    const fetchError = new Error("test error")

    fetchMock.mockRejectOnce(fetchError)

    const result = await wrapper.helloWorld()

    expect(result).toEqual({
      ok: false,
      error: fetchError,
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it("should get all ids", async () => {
    const serverResponse = urlModels

    fetchMock.mockResponseOnce(JSON.stringify(serverResponse))

    const result = await wrapper.urlInfo()

    expect(result).toEqual({
      ok: true,
      data: serverResponse.map(changeDateISOStringToDate),
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
  it("should get one id", () => {
    urlModels.forEach(async (serverResponse) => {
      fetchMock.mockResponseOnce(JSON.stringify(serverResponse))

      const result = await wrapper.urlInfo(serverResponse.short_url)

      expect(result).toEqual({
        ok: true,
        data: changeDateISOStringToDate(serverResponse),
      })
    })

    expect(fetchMock).toHaveBeenCalledTimes(urlModels.length)
  })
  it("should get shortened url back", async () => {
    const serverResponse = urlModels[0]
    const url = new URL(serverResponse.full_url)

    fetchMock.mockResponseOnce(JSON.stringify(serverResponse))

    const result = await wrapper.createUrl(url)


    expect(result).toEqual({
      ok: true,
      data: {
        info: changeDateISOStringToDate(serverResponse),
        url: new URL(
          `/${serverResponse.short_url}`,
          wrapper.baseUrl
        ).toString(),
      },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
