// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailVagina.RIDING_TAIL_DOM_GENTLE
tailVagina.RIDING_TAIL_DOM_NORMAL
tailVagina.RIDING_TAIL_DOM_ROUGH
tailVagina.RIDING_TAIL_SUB_NORMAL
tailVagina.RIDING_TAIL_SUB_EAGER
*/
import { TailVaginaSubBase } from "./TailVaginaBase";
setup.SexActionClass.TailVaginaSub = class TailVaginaSub extends TailVaginaSubBase {
    getTags() { return super.getTags().concat(['sub',]); }
    desc() { return 'Get tail-fucked'; }
    rawTitle(sex) {
        return `Tail-fucked`;
    }
    rawDescription(sex) {
        return `Fuck your a|vagina on b|reps b|tail`;
    }
};
