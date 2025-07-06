// @ts-nocheck

import { PenisOrgasmOngoing } from "../../orgasm/PenisOrgasmOngoing"

export class PenisBreastsOrgasmBase extends PenisOrgasmOngoing {
  /**
   * @returns {setup.SexBodypart} 
   */
  getPenetrationTarget() {
    return setup.sexbodypart.breasts
  }

  getRestrictions() {
    return super.getRestrictions().concat([
      setup.qres.HasItem('sexmanual_penetration_penisbreasts'),
      setup.qres.SexCanTitfuck('a', 'b'),
    ])
  }
}