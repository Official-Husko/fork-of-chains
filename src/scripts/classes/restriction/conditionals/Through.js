/**
 * True if its restriction is true.
 * 
 * Useful to circumvent missing items causing a building to not be displayed in the building menu. and masking text
 */
setup.qresImpl.Through = class Through extends setup.Restriction {
  /**
   * @param {setup.Restriction} requirement 
   * @param {string} [explain_text]
   */
  constructor(requirement, explain_text) {
    super()

    // true if requirements is false

    this.requirement = requirement
    this.explain_text = explain_text
  }

  text() {
    return `setup.qres.Through(${this.requirement.text()}, '${this.explain_text || ''}')`
  }

  isOk(quest) {
    return this.requirement.isOk(quest)
  }

  explain(quest) {
    if (!State.variables.gDebug && (this.explain_text || this.explain_text == 'HIDE')) {
      return `${this.explain_text || ''}`
    } else {
      return `${this.explain_text ? `[${this.explain_text}] ` : ''}${this.requirement.explain(quest)}`
    }
  }

  getLayout() {
    return {
      blocks: [
        {
          passage: "RestrictionThroughHeader",
          //addpassage: "", // inherit
          entrypath: ".requirement"
        }
      ]
    }
  }
}
