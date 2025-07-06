// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TailVagina.FUCKED_STOP
*/
import { TailHoleEndOther } from "../hole/TailHoleEndOther";
setup.SexActionClass.TailAnusEndOther = class TailAnusEndOther extends TailHoleEndOther {
    getTags() { return super.getTags().concat(['dom']); }
    getPenetrationTarget() {
        return setup.sexbodypart.anus;
    }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_anus'),
        ]);
    }
    rawTitle(sex) {
        return `Stop getting anally tail-fucked`;
    }
    rawDescription(sex) {
        return `Get b|rep to pull b|their b|tail out of your a|anus.`;
    }
};
