// abstract
setup.SexAction.OrgasmBase = class OrgasmBase extends setup.SexAction {
  getTags() { return super.getTags().concat(['orgasm', 'orgasm_type', ]) }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        restrictions: [setup.qres.SexIsOrgasming()],
        paces: setup.SexPace.getAllPaces()
      },
    ]
  }

  getOutcomes() {
    return super.getOutcomes().concat([
      setup.qc.SexOrgasm('a')
    ])
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return `Orgasm`
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return this.rawTitle(sex)
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawStory(sex) {
    return `a|Rep orgasms.`
  }
}

