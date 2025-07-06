// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
dickAnus.TAIL_FUCKING_SUB_RESIST
*/
import { PenisAnusSubBaseResist } from "./PenisAnusBase";
setup.SexActionClass.PenisAnusSubResist = class PenisAnusSubResist extends PenisAnusSubBaseResist {
    getTags() { return super.getTags().concat(['normal']); }
    getPenetrationTarget() {
        return setup.sexbodypart.anus;
    }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_anus'),
        ]);
    }
    rawTitle(sex) {
        return `Resist receiving anal`;
    }
    rawDescription(sex) {
        return `Try and pull your a|anus away from b|reps b|dick.`;
    }
};
