// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
penisVagina.FORCE_TAIL_OVER_VAGINA
*/
import { PenisHoleFreeBaseTeaseSub } from "../hole/PenisHoleFreeBase";
setup.SexActionClass.PenisAnusFreeTeaseSub = class PenisAnusFreeTeaseSub extends PenisHoleFreeBaseTeaseSub {
    getTags() { return super.getTags().concat(['sub']); }
    desc() { return 'Tease dick with anus'; }
    getPenetrationTarget() {
        return setup.sexbodypart.anus;
    }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_anus'),
        ]);
    }
    rawTitle(sex) {
        return 'Tease b|reps b|dick with your a|anus';
    }
    rawDescription(sex) {
        return `Slide the b|dickhead of b|reps b|dick over your a|anus.`;
    }
};
