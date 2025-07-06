// @ts-nocheck

import { ContentTemplate } from "../content/ContentTemplate"

setup.qresImpl.RandomlyTrueSeeded = class RandomlyTrueSeeded extends setup.Restriction {
  /**
   * Randomly true: True when seed % MODULO == REMAINDER
   * @param {number} modulo
   * @param {number} remainder
   */
  constructor(modulo, remainder) {
    super()

    if (remainder >= modulo) {
      throw new Error(`Remainder (${remainder}) cannot be larger than modulo (${modulo})`)
    }

    this.modulo = modulo
    this.remainder = remainder
  }

  text() {
    return `setup.qres.RandomlyTrueSeeded(${this.modulo}, ${this.remainder})`
  }

  explain() {
    if (State.variables.gDebug) {
      return `True when seed % ${this.modulo} equals ${this.remainder}`
    } else {
      return `Sometimes true`
    }
  }

  /**
   * @param {setup.QuestInstance | setup.OpportunityInstance} content 
   * @returns 
   */
  isOk(content) {
    return content.getSeed() % this.modulo == this.remainder
  }
}
