/* eslint-disable */
import { readFileSync } from "fs"
import type {Config} from 'jest'

// Reading the SWC compilation config and remove the "exclude"
// for the test files to be compiled by SWC
const { exclude: _, ...swcJestConfig } = JSON.parse(
  readFileSync(`${__dirname}/.lib.swcrc`, "utf-8")
)

const config: Config = {
  displayName: "api-wrapper",
  preset: "../../jest.preset.js",
  transform: {
    "^.+\\.[tj]s$": ["@swc/jest", swcJestConfig],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/lib/api-wrapper",
  automock: false,
  setupFiles: [
    `${__dirname}/setupJest.js`
  ]
}

export default config
