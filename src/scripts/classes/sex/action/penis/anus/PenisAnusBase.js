import { PenisHoleDomBase, PenisHoleDomBaseResist, PenisHoleSubBase, PenisHoleSubBaseResist } from "../hole/PenisHoleBase"

export class PenisAnusDomBase extends PenisHoleDomBase {
  getPenetrationTarget() { return setup.sexbodypart.anus }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }
}

export class PenisAnusDomBaseResist extends PenisHoleDomBaseResist {
  getPenetrationTarget() { return setup.sexbodypart.anus }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }
}

export class PenisAnusSubBase extends PenisHoleSubBase {
  getPenetrationTarget() { return setup.sexbodypart.anus }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }
}

export class PenisAnusSubBaseResist extends PenisHoleSubBaseResist {
  getPenetrationTarget() { return setup.sexbodypart.anus }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_bodypart_anus'),
    ])
  }
}
