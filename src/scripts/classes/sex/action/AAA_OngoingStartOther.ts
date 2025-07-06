// @ts-nocheck

import { OngoingBase } from "./AAA_OngoingStart"

// abstract
setup.SexAction.OngoingStartOther = class OngoingStartOther extends OngoingBase {
  getTags() {
    return super.getTags().concat(['penetrationstartsub'])
  }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    let paces
    if (this.isDominantSex()) {
      paces = [setup.sexpace.sub, setup.sexpace.normal]
    } else {
      paces = [setup.sexpace.normal, setup.sexpace.dom]
    }
    return [
      {
        energy: setup.Sex.ENERGY_TINY,
        paces: paces,
        restrictions: [],
      },
      {
        energy: setup.Sex.ENERGY_TINY,
        paces: setup.SexPace.getAllPaces(),
        restrictions: [],
      },
    ]
  }

  /**
   * @returns {setup.Restriction[]}
   */
  getRestrictions() {
    return [
      setup.qres.SexBodypartsCanInteract('b', this.getPenetratorBodypart(), 'a', this.getPenetrationTarget()),
    ]
  }

  getOutcomes() {
    return super.getOutcomes().concat([
      setup.qc.SexOngoingStart('b', this.getPenetratorBodypart(), 'a', this.getPenetrationTarget())
    ])
  }

  /**
   * Returns the title of this action, e.g., "Blowjob"
   * @param {setup.SexInstance} sex
   * @returns {string}
   */
  rawTitle(sex) {
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')
    const my_bp = this.getPenetrationTarget().rep(me, sex)
    const their_bp = this.getPenetratorBodypart().rep(them, sex)

    return `Wrap a|their ${my_bp} around b|their ${their_bp}`
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
   * @returns {string | string[]}
   */
  rawStory(sex) {
    const me = this.getActorUnit('a')
    const them = this.getActorUnit('b')
    return ''
  }
}

