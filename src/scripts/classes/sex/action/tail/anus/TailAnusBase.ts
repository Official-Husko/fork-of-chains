// @ts-nocheck

import { TailHoleDomBase, TailHoleDomBaseResist, TailHoleSubBase, TailHoleSubBaseResist } from "../hole/TailHoleBase"

export class TailAnusDomBase extends TailHoleDomBase {
  getPenetrationTarget() { return setup.sexbodypart.anus }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }
}

export class TailAnusDomBaseResist extends TailHoleDomBaseResist {
  getPenetrationTarget() { return setup.sexbodypart.anus }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }
}

export class TailAnusSubBase extends TailHoleSubBase {
  getPenetrationTarget() { return setup.sexbodypart.anus }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }
}

export class TailAnusSubBaseResist extends TailHoleSubBaseResist {
  getPenetrationTarget() { return setup.sexbodypart.anus }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }
}
