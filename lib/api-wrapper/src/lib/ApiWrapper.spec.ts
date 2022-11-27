import axios from "axios"
import { ResponseType, SlashUrlApiWrapper, UrlModelType } from "./ApiWrapper"

jest.mock("axios")
const mockAxios = axios as jest.Mocked<typeof axios>

describe("apiWrapper", () => {
  const baseUrl = "http://127.0.0.1:8080/"
  const wrapper = new SlashUrlApiWrapper(baseUrl)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should work", () => {
    expect("hi").toEqual("hi")
  })
  it("should get hello world", async () => {
    const thenFn = jest.fn()
    const catchFn = jest.fn()

    const serverResponse = "test: Hello World!"

    mockAxios.request.mockResolvedValueOnce({
      data: serverResponse,
    })

    await wrapper.helloWorld().then(thenFn).catch(catchFn)

    expect(thenFn).toHaveBeenCalledWith<[ResponseType<string>]>({
      success: true,
      data: serverResponse,
    })

    expect(catchFn).not.toHaveBeenCalled()
  })
  it("should return error case", async () => {
    const thenFn = jest.fn()
    const catchFn = jest.fn()

    const axiosError = new Error("test error")

    mockAxios.request.mockRejectedValueOnce(axiosError)

    await wrapper.helloWorld().then(thenFn).catch(catchFn)

    expect(thenFn).toHaveBeenCalledWith<[ResponseType<string>]>({
      success: false,
      error: axiosError,
    })

    expect(catchFn).not.toHaveBeenCalled()
  })
  it("should get all ids", async () => {
    const thenFn = jest.fn()
    const catchFn = jest.fn()

    const serverResponse: UrlModelType[] = [
      {
        short_url: "abcdefgh",
        full_url: "https://kernel.org/",
        created_at: new Date(),
        views: 70 - 1,
      },
      {
        short_url: "goooogle",
        full_url: "https://google.com/",
        created_at: new Date(),
        views: 70 - 1,
      },
    ]

    mockAxios.request.mockResolvedValueOnce({
      data: serverResponse,
    })

    await wrapper.urlInfo().then(thenFn).catch(catchFn)

    expect(thenFn).toHaveBeenCalledWith<[ResponseType<UrlModelType[]>]>({
      success: true,
      data: serverResponse,
    })

    expect(catchFn).not.toHaveBeenCalled()
  })
  it("should get one id", async () => {
    const thenFn = jest.fn()
    const catchFn = jest.fn()

    const serverResponse: UrlModelType = {
      short_url: "abcdefgh",
      full_url: "https://kernel.org/",
      created_at: new Date(),
      views: 70 - 1,
    }

    mockAxios.request.mockResolvedValueOnce({
      data: serverResponse,
    })

    await wrapper.urlInfo("abcdefgh").then(thenFn).catch(catchFn)

    expect(thenFn).toHaveBeenCalledWith<[ResponseType<UrlModelType>]>({
      success: true,
      data: serverResponse,
    })

    expect(catchFn).not.toHaveBeenCalled()
  })
})
