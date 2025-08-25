import type { DutyInstance } from "../../classes/duty/DutyInstance";
import { competence as _competence } from "./competence";
import { slavevalue as _slavevalue } from "./slavevalue";

/**
 * TextDuty
 *
 * A thin compatibility surface exposing the duty-related text helpers.
 * Each function delegates to the internal implementation in this folder.
 *
 * Rationale: consumers throughout the codebase import `TextDuty.competence`
 * and `TextDuty.slavevalue`. This module keeps that API stable while the
 * implementation files contain the detailed logic and typed helpers.
 */
export namespace TextDuty {
  /**
   * Produce a short, human-oriented description of how competent the
   * currently assigned unit is at the given duty.
   *
   * Input: a DutyInstance (may be a prestige/bedchamber subtype).
   * Output: localized string which may contain unit macros (a|they etc.).
   */
  export function competence(duty: DutyInstance) {
    return _competence(duty);
  }

  /**
   * Produce a prestige/market-value description for an assigned slave.
   * Returns an empty string for duties that are not prestige-type.
   */
  export function slavevalue(duty: DutyInstance): string {
    return _slavevalue(duty);
  }
}
