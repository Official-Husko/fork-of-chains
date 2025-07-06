// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
TongueAnus.RECEIVING_ANILINGUS_START
*/
import { MouthHoleStartOther } from "../hole/MouthHoleStartOther";
import { analEnjoymentDescription } from "../../hole/util";
setup.SexActionClass.MouthAnusStartOther = class MouthAnusStartOther extends MouthHoleStartOther {
    getTags() { return super.getTags().concat(['dom']); }
    desc() { return 'Start receiving anilingus'; }
    getPenetrationTarget() {
        return setup.sexbodypart.anus;
    }
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_anus'),
        ]);
    }
    getActorDescriptions() {
        const desc = super.getActorDescriptions();
        // only for anal-lovers:
        desc[0].restrictions.push(setup.qres.SexEnjoysAnal());
        return desc;
    }
    rawTitle(sex) {
        return `Receive anilingus`;
    }
    rawDescription(sex) {
        return `Get b|rep to start licking your a|anus.`;
    }
    /**
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    getExtraDescription(sex) {
        return analEnjoymentDescription(this.getActorUnit('a'), sex);
    }
};
