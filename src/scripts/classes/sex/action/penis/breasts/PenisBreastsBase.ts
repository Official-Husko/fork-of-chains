// @ts-nocheck

import { PenisHoleDomBase, PenisHoleSubBase, PenisHoleDomBaseResist, PenisHoleSubBaseResist } from "../hole/PenisHoleBase"

export class PenisBreastsDomBase extends PenisHoleDomBase {
  getPenetrationTarget() { return setup.sexbodypart.breasts }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_penetration_penisbreasts'),
      setup.qres.SexCanTitfuck('a', 'b'),
    ])
  }
}

export class PenisBreastsDomBaseResist extends PenisHoleDomBaseResist {
  getPenetrationTarget() { return setup.sexbodypart.breasts }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_penetration_penisbreasts'),
      setup.qres.SexCanTitfuck('a', 'b'),
    ])
  }
}

export class PenisBreastsSubBase extends PenisHoleSubBase {
  getPenetrationTarget() { return setup.sexbodypart.breasts }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_penetration_penisbreasts'),
      setup.qres.SexCanTitfuck('b', 'a'),
    ])
  }
}

export class PenisBreastsSubBaseResist extends PenisHoleSubBaseResist {
  getPenetrationTarget() { return setup.sexbodypart.breasts }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_penetration_penisbreasts'),
      setup.qres.SexCanTitfuck('b', 'a'),
    ])
  }
}
