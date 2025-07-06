// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailVagina.TAIL_FUCKING_DOM_GENTLE
tailVagina.TAIL_FUCKING_DOM_NORMAL
tailVagina.TAIL_FUCKING_DOM_ROUGH
tailVagina.TAIL_FUCKING_SUB_NORMAL
tailVagina.TAIL_FUCKING_SUB_EAGER
*/
import { TailVaginaDomBase } from "./TailVaginaBase";
setup.SexActionClass.TailVaginaDom = class TailVaginaDom extends TailVaginaDomBase {
    getTags() { return super.getTags().concat(['dom', 'discomfort']); }
    desc() { return 'Vaginal tail-fucking'; }
    rawTitle(sex) {
        return 'Tail-fucking';
    }
    rawDescription(sex) {
        return `Continue thrusting your a|tail in and out of b|reps b|vagina.`;
    }
};
