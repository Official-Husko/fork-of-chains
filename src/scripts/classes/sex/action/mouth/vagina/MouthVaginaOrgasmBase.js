// @ts-nocheck
import { VaginaOrgasmOngoing } from "../../orgasm/VaginaOrgasmOngoing";
export class MouthVaginaOrgasmBase extends VaginaOrgasmOngoing {
    getRestrictions() {
        return super.getRestrictions().concat([
            setup.qres.HasItem('sexmanual_penetration_mouthhole'),
        ]);
    }
    /**
     * @returns {setup.SexBodypart}
     */
    getPenetratorBodypart() {
        return setup.sexbodypart.mouth;
    }
}
