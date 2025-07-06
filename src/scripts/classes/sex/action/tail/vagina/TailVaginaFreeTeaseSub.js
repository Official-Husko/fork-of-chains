// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailVagina.FORCE_TAIL_OVER_VAGINA
*/
import { TailHoleFreeBaseTeaseSub } from "../hole/TailHoleFreeBase";
setup.SexActionClass.TailVaginaFreeTeaseSub = class TailVaginaFreeTeaseSub extends TailHoleFreeBaseTeaseSub {
    getTags() { return super.getTags().concat(['sub']); }
    desc() { return 'Tease tail with vagina'; }
    getPenetrationTarget() {
        return setup.sexbodypart.vagina;
    }
    rawTitle(sex) {
        return 'Tease b|reps b|tail with your a|vagina';
    }
    rawDescription(sex) {
        return `Slide the b|tailtip of b|reps b|tail over your a|vagina.`;
    }
};
