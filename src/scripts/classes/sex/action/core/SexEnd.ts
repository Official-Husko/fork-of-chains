// @ts-nocheck

setup.SexActionClass.SexEnd = class SexEnd extends setup.SexAction {
  getTags() { return super.getTags().concat(['endsex', 'normal']) }

  getActorDescriptions() {
    return [
      {
        paces: [setup.sexpace.dom, setup.sexpace.normal, setup.sexpace.sub, setup.sexpace.forced, setup.sexpace.resist], 
      },
    ]
  }

  /**
   * Get additional outcomes with this sex actions
   * @returns {setup.Cost[]}
   */
  getOutcomes() {
    return super.getOutcomes().concat([
      setup.qc.SexEnd(),
    ])
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return 'End sex'
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Ends the intercourse`
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawStory(sex) {
    return 'a|Rep a|end the intercourse.'
  }


}