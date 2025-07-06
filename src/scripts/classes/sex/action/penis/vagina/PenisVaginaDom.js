// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
dickVagina.TAIL_FUCKING_DOM_GENTLE
dickVagina.TAIL_FUCKING_DOM_NORMAL
dickVagina.TAIL_FUCKING_DOM_ROUGH
dickVagina.TAIL_FUCKING_SUB_NORMAL
dickVagina.TAIL_FUCKING_SUB_EAGER
*/
import { PenisVaginaDomBase } from "./PenisVaginaBase";
setup.SexActionClass.PenisVaginaDom = class PenisVaginaDom extends PenisVaginaDomBase {
    getTags() { return super.getTags().concat(['dom']); }
    desc() { return 'Fuck'; }
    rawTitle(sex) {
        return 'Fuck b|rep';
    }
    rawDescription(sex) {
        return `Continue thrusting your a|dick in and out of b|reps b|vagina.`;
    }
};
