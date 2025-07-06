// @ts-nocheck
/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA :
GenericOrgasms
*/
import { PenisAnusOrgasmBase } from "./PenisAnusOrgasmBase";
setup.SexActionClass.PenisAnusOrgasmInside = class PenisAnusOrgasmInside extends PenisAnusOrgasmBase {
    getTags() { return super.getTags().concat(['normal',]); }
    desc() { return 'Cum inside anus'; }
    /**
     * Returns the title of this action, e.g., "Blowjob"
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    rawTitle(sex) {
        return `Cum inside b|reps b|anus`;
    }
};
