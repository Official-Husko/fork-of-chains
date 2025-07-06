// @ts-nocheck

/* ORIGINAL TEXT FROM darko */

import { PenisHoleDomSpitroastTigerkinStatue } from "./../hole/PenisHoleDomSpitroastTigerkinStatue"

setup.SexActionClass.PenisAnusDomSpitroastTigerkinStatue = class PenisAnusDomSpitroastTigerkinStatue extends PenisHoleDomSpitroastTigerkinStatue {
  getTags() { return super.getTags().concat(['dom', 'discomfort', ]) }
  desc() { return 'Anal spitroast with the tigerkin statue' }

  getPenetrationTarget() { return setup.sexbodypart.anus }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }
}
