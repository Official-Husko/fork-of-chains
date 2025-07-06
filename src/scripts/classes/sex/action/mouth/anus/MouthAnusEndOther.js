// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TongueAnus.RECEIVING_ANILINGUS_STOP
*/
import { MouthHoleEndOther } from "../hole/MouthHoleEndOther";
setup.SexActionClass.MouthAnusEndOther = class MouthAnusEndOther extends MouthHoleEndOther {
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
        return `Stop receiving anilingus`;
    }
    rawDescription(sex) {
        return `Get b|rep to pull b|their tongue out of your a|anus.`;
    }
};
