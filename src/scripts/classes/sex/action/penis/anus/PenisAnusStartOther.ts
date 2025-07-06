// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
PenisVagina.USING_TAIL_START
*/

import { PenisHoleStartOther } from "../hole/PenisHoleStartOther"

setup.SexActionClass.PenisAnusStartOther = class PenisAnusStartOther extends PenisHoleStartOther {
  getTags() { return super.getTags().concat(['sub']) }
  desc() { return 'Get anally fucked' }

  getPenetrationTarget() {
    return setup.sexbodypart.anus
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }

  getActorDescriptions() {
    const desc = super.getActorDescriptions()

    // only for anal-lovers:
    desc[0].restrictions.push(setup.qres.SexEnjoysAnal())
    return desc
  }

  rawTitle(sex) {
    return `Get anally fucked`;
  }

  rawDescription(sex) {
    return `Slide b|reps b|dick into your a|anus and get fucked.`;
  }
}
