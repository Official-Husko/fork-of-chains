// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tongueVagina.RECEIVING_CUNNILINGUS_DOM_GENTLE
tongueVagina.RECEIVING_CUNNILINGUS_DOM_NORMAL
tongueVagina.RECEIVING_CUNNILINGUS_DOM_ROUGH
tongueVagina.RECEIVING_CUNNILINGUS_SUB_NORMAL
tongueVagina.RECEIVING_CUNNILINGUS_SUB_EAGER
*/
import { MouthAnusSubBase } from "./MouthAnusBase";
setup.SexActionClass.MouthAnusSub = class MouthAnusSub extends MouthAnusSubBase {
    getTags() { return super.getTags().concat(['dom']); }
    desc() { return 'Receive anilingus'; }
    rawTitle(sex) {
        return 'Receive anilingus';
    }
    rawDescription(sex) {
        return `Press your ass down over b|reps face in order to drive b|their tongue into your a|anus.`;
    }
};
