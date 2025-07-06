// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.CUNNILINGUS_DOM_GENTLE
tongueVagina.CUNNILINGUS_DOM_NORMAL
tongueVagina.CUNNILINGUS_DOM_ROUGH
tongueVagina.CUNNILINGUS_SUB_NORMAL
tongueVagina.CUNNILINGUS_SUB_EAGER
*/

import { MouthAnusDomBase } from "./MouthAnusBase"

setup.SexActionClass.MouthAnusDom = class MouthAnusDom extends MouthAnusDomBase {
  getTags() { return super.getTags().concat(['sub']) }
  desc() { return 'Perform anilingus' }

  rawTitle(sex) {
    return 'Perform anilingus'
  }

  rawDescription(sex) {
    return `Continue thrusting your a|tongue into b|reps b|anus.`
  }
}
