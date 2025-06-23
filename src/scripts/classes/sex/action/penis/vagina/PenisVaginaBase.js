import { PenisHoleDomBase, PenisHoleDomBaseResist, PenisHoleSubBase, PenisHoleSubBaseResist } from "../hole/PenisHoleBase"

export class PenisVaginaDomBase extends PenisHoleDomBase {
  getPenetrationTarget() { return setup.sexbodypart.vagina }
}

export class PenisVaginaDomBaseResist extends PenisHoleDomBaseResist {
  getPenetrationTarget() { return setup.sexbodypart.vagina }
}

export class PenisVaginaSubBase extends PenisHoleSubBase {
  getPenetrationTarget() { return setup.sexbodypart.vagina }
}

export class PenisVaginaSubBaseResist extends PenisHoleSubBaseResist {
  getPenetrationTarget() { return setup.sexbodypart.vagina }
}
