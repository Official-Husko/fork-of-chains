// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.RECEIVING_CUNNILINGUS_SUB_RESIST
*/
import { MouthAnusSubBaseResist } from "./MouthAnusBase";
setup.SexActionClass.MouthAnusSubResist = class MouthAnusSubResist extends MouthAnusSubBaseResist {
    getTags() { return super.getTags().concat(['normal']); }
    rawTitle(sex) {
        return 'Resist receiving anilingus';
    }
    rawDescription(sex) {
        return `Try and pull your a|anus away from b|reps tongue.`;
    }
};
