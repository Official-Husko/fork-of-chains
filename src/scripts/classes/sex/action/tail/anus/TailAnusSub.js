// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailAnus.RIDING_TAIL_DOM_GENTLE
tailAnus.RIDING_TAIL_DOM_NORMAL
tailAnus.RIDING_TAIL_DOM_ROUGH
tailAnus.RIDING_TAIL_SUB_NORMAL
tailAnus.RIDING_TAIL_SUB_EAGER
*/
import { TailAnusSubBase } from "./TailAnusBase";
setup.SexActionClass.TailAnusSub = class TailAnusSub extends TailAnusSubBase {
    getTags() { return super.getTags().concat(['sub']); }
    desc() { return 'Anally tail-fucked'; }
    rawTitle(sex) {
        return `Tail-fucked`;
    }
    rawDescription(sex) {
        return `Fuck your a|anus on b|reps b|tail`;
    }
};
