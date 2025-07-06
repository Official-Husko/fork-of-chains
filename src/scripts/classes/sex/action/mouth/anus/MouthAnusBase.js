// @ts-nocheck
import { MouthHoleDom } from "../hole/MouthHoleDom";
import { MouthHoleDomResist } from "../hole/MouthHoleDomResist";
import { MouthHoleSub } from "../hole/MouthHoleSub";
import { MouthHoleSubResist } from "../hole/MouthHoleSubResist";
export class MouthAnusDomBase extends MouthHoleDom {
    getPenetrationTarget() { return setup.sexbodypart.anus; }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_anus'),
        ]);
    }
}
export class MouthAnusDomBaseResist extends MouthHoleDomResist {
    getPenetrationTarget() { return setup.sexbodypart.anus; }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_anus'),
        ]);
    }
}
export class MouthAnusSubBase extends MouthHoleSub {
    getPenetrationTarget() { return setup.sexbodypart.anus; }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_anus'),
        ]);
    }
}
export class MouthAnusSubBaseResist extends MouthHoleSubResist {
    getPenetrationTarget() { return setup.sexbodypart.anus; }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_anus'),
        ]);
    }
}
