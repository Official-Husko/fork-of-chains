/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.CUNNILINGUS_DOM_GENTLE
tongueVagina.CUNNILINGUS_DOM_NORMAL
tongueVagina.CUNNILINGUS_DOM_ROUGH
tongueVagina.CUNNILINGUS_SUB_NORMAL
tongueVagina.CUNNILINGUS_SUB_EAGER
*/

import { MouthVaginaDomBase } from "./MouthVaginaBase"

setup.SexActionClass.MouthVaginaDom = class MouthVaginaDom extends MouthVaginaDomBase {
  getTags() { return super.getTags().concat(['sub']) }
  desc() { return 'Perform cunnilingus' }

  rawTitle(sex) {
    return 'Perform cunnilingus'
  }

  rawDescription(sex) {
    return `Continue thrusting your a|tongue into b|reps b|vagina.`
  }
}
