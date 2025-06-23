import { TailHoleDomBase, TailHoleDomBaseResist, TailHoleSubBase, TailHoleSubBaseResist } from "../hole/TailHoleBase"

export class TailVaginaDomBase extends TailHoleDomBase {
  getPenetrationTarget() { return setup.sexbodypart.vagina }
}

export class TailVaginaDomBaseResist extends TailHoleDomBaseResist {
  getPenetrationTarget() { return setup.sexbodypart.vagina }
}

export class TailVaginaSubBase extends TailHoleSubBase {
  getPenetrationTarget() { return setup.sexbodypart.vagina }
}

export class TailVaginaSubBaseResist extends TailHoleSubBaseResist {
  getPenetrationTarget() { return setup.sexbodypart.vagina }
}
