/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.CUNNILINGUS_SUB_RESIST
*/

import { MouthAnusDomBaseResist } from "./MouthAnusBase"

setup.SexActionClass.MouthAnusDomResist = class MouthAnusDomResist extends MouthAnusDomBaseResist {
  getTags() { return super.getTags().concat(['normal']) }

  rawTitle(sex) {
    return 'Resist anilingus'
  }

  rawDescription(sex) {
    return `Try to pull your tongue out of b|reps b|anus.`
  }
}
