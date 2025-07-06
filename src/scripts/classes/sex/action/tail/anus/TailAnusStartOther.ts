// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.USING_TAIL_START
*/

import { TailHoleStartOther } from "../hole/TailHoleStartOther"

setup.SexActionClass.TailAnusStartOther = class TailAnusStartOther extends TailHoleStartOther {
  getTags() { return super.getTags().concat(['sub']) }
  desc() { return 'Get anally tail-fucked' }

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
    return `Get anally tail-fucked`;
  }

  rawDescription(sex) {
    return `Slide b|reps b|tail into your a|anus and get tail-fucked.`;
  }
}
