/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
DoggyStyle.SLAP_ASS
SadisticActions.SLAP_FACE
*/

import { PenisHoleDomSlapAss } from "./../hole/PenisHoleDomSlapAss"

setup.SexActionClass.PenisVaginaDomSlapAss = class PenisVaginaDomSlapAss extends PenisHoleDomSlapAss {
  getTags() { return super.getTags().concat(['dom', 'discomfort', ]) }
  desc() { return 'Slap ass' }

  getPenetrationTarget() { return setup.sexbodypart.vagina }
}
