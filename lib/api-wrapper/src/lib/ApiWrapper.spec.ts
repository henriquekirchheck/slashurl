import axios from "axios"
import { ResultType, SlashUrlApiWrapper } from "./ApiWrapper"

jest.mock("axios")
const mockAxios = axios as jest.Mocked<typeof axios>

describe("apiWrapper", () => {
  const baseUrl = "http://127.0.0.1:8080/"
  const wrapper = new SlashUrlApiWrapper(baseUrl)

  it("should work", () => {
    expect("hi").toEqual("hi")
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should get hello world", async () => {
    const thenFn = jest.fn()
    const catchFn = jest.fn()

    const serverResponse = "test: Hello World!"

    mockAxios.request.mockResolvedValueOnce({
      data: serverResponse,
    })

    await wrapper.helloWorld().then(thenFn).catch(catchFn)

    expect(thenFn).toHaveBeenCalledWith<[ResultType<string>]>({
      data: serverResponse,
    })

    expect(catchFn).not.toHaveBeenCalled()
  })
})
