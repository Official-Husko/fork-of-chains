// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
GenericOrgasms
*/
import { PenisVaginaOrgasmBase } from "./PenisVaginaOrgasmBase";
setup.SexActionClass.PenisVaginaOrgasmInside = class PenisVaginaOrgasmInside extends PenisVaginaOrgasmBase {
    getTags() { return super.getTags().concat(['normal',]); }
    desc() { return 'Cum inside another'; }
    /**
     * Returns the title of this action, e.g., "Blowjob"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawTitle(sex) {
        return `Cum inside of b|rep`;
    }
};
