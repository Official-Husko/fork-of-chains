// @ts-nocheck

setup.qresImpl.RandomlyTrue = class RandomlyTrue extends setup.Restriction {
  /**
   * Randomly true with chance probability.
   * @param {number} chance 
   */
  constructor(chance) {
    super()
    this.chance = chance
  }

  text() {
    return `setup.qres.RandomlyTrue(${this.chance})`
  }

  explain() {
    if (State.variables.gDebug) {
      return `With ${(this.chance * 100).toFixed(1)}% chance`
    } else {
      return `Sometimes true`
    }
  }

  isOk() {
    return Math.random() < this.chance
  }
}
