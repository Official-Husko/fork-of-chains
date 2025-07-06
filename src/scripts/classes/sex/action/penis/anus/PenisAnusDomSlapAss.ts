// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
DoggyStyle.SLAP_ASS
SadisticActions.SLAP_FACE
*/

import { PenisHoleDomSlapAss } from "./../hole/PenisHoleDomSlapAss"

setup.SexActionClass.PenisAnusDomSlapAss = class PenisAnusDomSlapAss extends PenisHoleDomSlapAss {
  getTags() { return super.getTags().concat(['dom', 'discomfort',]) }
  desc() { return 'Slap ass (anal)' }

  getPenetrationTarget() { return setup.sexbodypart.anus }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }
}
