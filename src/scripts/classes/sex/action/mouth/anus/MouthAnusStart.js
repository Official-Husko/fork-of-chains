// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TongueAnus.CUNNILINGUS_START
*/
import { MouthHoleStart } from "../hole/MouthHoleStart";
import { analEnjoymentDescription } from "../../hole/util";
setup.SexActionClass.MouthAnusStart = class MouthAnusStart extends MouthHoleStart {
    getTags() { return super.getTags().concat(['sub']); }
    desc() { return 'Start anilingus'; }
    getPenetrationTarget() {
        return setup.sexbodypart.anus;
    }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_anus'),
        ]);
    }
    rawTitle(sex) {
        return 'Start anilingus';
    }
    rawDescription(sex) {
        return `Slide your a|tongue into b|reps b|anus and start performing anilingus.`;
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    getExtraDescription(sex) {
        return analEnjoymentDescription(this.getActorUnit('b'), sex);
    }
};
