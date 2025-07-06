// @ts-nocheck
import { VaginaOrgasmOngoing } from "../../orgasm/VaginaOrgasmOngoing";
export class TailVaginaOrgasmBase extends VaginaOrgasmOngoing {
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_bodypart_tail'),
        ]);
    }
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetratorBodypart() {
        return setup.sexbodypart.tail;
    }
}
