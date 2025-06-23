/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.FUCKED_STOP
*/

import { TailHoleEndOther } from "../hole/TailHoleEndOther"

setup.SexActionClass.TailVaginaEndOther = class TailVaginaEndOther extends TailHoleEndOther {
  getTags() { return super.getTags().concat(['dom', ]) }

  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }

  rawTitle(sex) {
    return `Stop getting vaginally tail-fucked`;
  }

  rawDescription(sex) {
    return `Get b|rep to pull b|their b|tail out of your a|vagina.`
  }

}
