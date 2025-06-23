import { CodeJar } from "../third-party/codejar/codejar.js"
import { withLineNumbers } from "../third-party/codejar/linenumbers.js"

import Prism from "prismjs"

import { initPrismLanguageTwee3 } from "./codejar-language-twee3"

/** @returns {Promise<{ CodeJar: CodeJar, Prism: Prism }>} */
export function initializeCodeJar() {
  initPrismLanguageTwee3(Prism)

  return Promise.resolve({ CodeJar, Prism })
}
