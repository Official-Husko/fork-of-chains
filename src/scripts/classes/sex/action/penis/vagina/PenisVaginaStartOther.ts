// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
PenisVagina.USING_TAIL_START
*/

import { PenisHoleStartOther } from "../hole/PenisHoleStartOther"

setup.SexActionClass.PenisVaginaStartOther = class PenisVaginaStartOther extends PenisHoleStartOther {
  getTags() { return super.getTags().concat(['sub',]) }
  desc() { return 'Start getting fucked' }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return `Get fucked`;
  }

  rawDescription(sex) {
    return `Slide b|reps b|dick into your a|vagina and get fucked.`
  }
}
