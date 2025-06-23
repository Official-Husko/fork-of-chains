import { PenisOrgasmOngoing } from "../../orgasm/PenisOrgasmOngoing"
import { VaginaOrgasmOngoing } from "../../orgasm/VaginaOrgasmOngoing"

export class PenisVaginaOrgasmBase extends PenisOrgasmOngoing {
  /**
   * @returns {setup.SexBodypart} 
   */
  getPenetrationTarget() {
    return setup.sexbodypart.vagina
  }
}

export class PenisVaginaOrgasmBaseOther extends VaginaOrgasmOngoing {
  /**
   * @returns {setup.SexBodypart} 
   */
  getPenetratorBodypart() {
    return setup.sexbodypart.penis
  }
}
