// @ts-nocheck
import { MouthHoleDom } from "../hole/MouthHoleDom";
import { MouthHoleDomResist } from "../hole/MouthHoleDomResist";
import { MouthHoleSub } from "../hole/MouthHoleSub";
import { MouthHoleSubResist } from "../hole/MouthHoleSubResist";
export class MouthVaginaDomBase extends MouthHoleDom {
    getPenetrationTarget() { return setup.sexbodypart.vagina; }
}
export class MouthVaginaDomBaseResist extends MouthHoleDomResist {
    getPenetrationTarget() { return setup.sexbodypart.vagina; }
}
export class MouthVaginaSubBase extends MouthHoleSub {
    getPenetrationTarget() { return setup.sexbodypart.vagina; }
}
export class MouthVaginaSubBaseResist extends MouthHoleSubResist {
    getPenetrationTarget() { return setup.sexbodypart.vagina; }
}
