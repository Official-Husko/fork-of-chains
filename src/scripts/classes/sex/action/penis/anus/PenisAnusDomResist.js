// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
tailAnus.TAIL_FUCKING_SUB_RESIST
*/
import { PenisAnusDomBaseResist } from "./PenisAnusBase";
setup.SexActionClass.PenisAnusDomResist = class PenisAnusDomResist extends PenisAnusDomBaseResist {
    getTags() { return super.getTags().concat(['normal']); }
    rawTitle(sex) {
        return 'Resist anal';
    }
    rawDescription(sex) {
        return `Try to pull your a|dick out of b|reps b|anus.`;
    }
};
