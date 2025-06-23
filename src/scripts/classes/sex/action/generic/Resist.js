/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
  GenericActions.GENERIC_RESIST = new SexAction(
*/

setup.SexActionClass.GenericResist = class GenericResist extends setup.SexAction {
  getTags() { return super.getTags().concat(['normal',]) }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    return [
      {
        energy: setup.Sex.ENERGY_MEDIUM,
        arousal: -setup.Sex.AROUSAL_MEDIUM,
        discomfort: setup.Sex.DISCOMFORT_TINY,
        paces: [setup.sexpace.resist],
        restrictions: [
          setup.qres.SexPaceIn([setup.sexpace.resist]),
          setup.qres.Not(setup.qres.SexIsInPenetration()),
        ],
      },
      {
        energy: setup.Sex.ENERGY_SMALL,
        discomfort: setup.Sex.DISCOMFORT_TINY,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [
          setup.qres.SexPaceIn([setup.sexpace.dom, setup.sexpace.sub, setup.sexpace.normal, setup.sexpace.forced]),
        ],
      },
    ]
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    return `Resist`
  }

  /**
   * Short description of this action. E.g., "Put your mouth in their dick"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawDescription(sex) {
    return `Resist having sex with b|rep`
  }

  /**
   * Returns a string telling a story about this action to be given to the player
   * @param {setup.SexInstance} sex
   * @returns {string | string[]}
   */
  rawStory(sex) {
    const unit = this.getActorUnit('a')
    const pose = sex.getPose(unit)
    return pose.repResist(this.getActorUnit('a'), this.getActorUnit('b'), sex)
  }
}

