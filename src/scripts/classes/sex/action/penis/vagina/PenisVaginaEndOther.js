/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
PenisVagina.FUCKED_STOP
*/

import { PenisHoleEndOther } from "../hole/PenisHoleEndOther"

setup.SexActionClass.PenisVaginaEndOther = class PenisVaginaEndOther extends PenisHoleEndOther {
  getTags() { return super.getTags().concat(['dom']) }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return `Stop being fucked`;
  }

  rawDescription(sex) {
    return `Get b|rep to pull b|their b|dick out of your a|vagina.`
  }

}
