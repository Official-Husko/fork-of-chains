// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.RECEIVING_CUNNILINGUS_DOM_GENTLE
tongueVagina.RECEIVING_CUNNILINGUS_DOM_NORMAL
tongueVagina.RECEIVING_CUNNILINGUS_DOM_ROUGH
tongueVagina.RECEIVING_CUNNILINGUS_SUB_NORMAL
tongueVagina.RECEIVING_CUNNILINGUS_SUB_EAGER
*/

import { MouthVaginaSubBase } from "./MouthVaginaBase"

setup.SexActionClass.MouthVaginaSub = class MouthVaginaSub extends MouthVaginaSubBase {
  getTags() { return super.getTags().concat(['dom']) }
  desc() { return 'Receive cunnilingus' }

  rawTitle(sex) {
    return 'Receive cunnilingus'
  }

  rawDescription(sex) {
    return `Press your labia down over b|reps face in order to drive b|their tongue into your a|vagina.`
  }
}
