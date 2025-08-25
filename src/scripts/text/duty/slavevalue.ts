import type { DutyInstance } from "../../classes/duty/DutyInstance";
import { DutyInstancePrestigeSlave } from "../../classes/duty/subtypes/PrestigeSlave";
import { prestigeValueText } from "./rules";
import { replaceUnit } from "./util";

/**
 * slavevalue
 *
 * Return a marketplace-style description of the prestige value for the
 * assigned unit, tailored to `DutyInstancePrestigeSlave` duties. For
 * non-prestige duties this returns the empty string to indicate the
 * value text does not apply.
 *
 * Implementation notes:
 * - We guard with an instanceof check to avoid importing the prestige
 *   duty subtype broadly in this module.
 * - The returned string still contains unit macros; callers should
 *   pass it through `replaceUnit` (done here) to inline the unit's
 *   macros into readable text.
 */
export function slavevalue(duty: DutyInstance): string {
  if (!(duty instanceof DutyInstancePrestigeSlave)) return "";

  const prestige = duty.getCurrentPrestige();
  const unit = duty.getAssignedUnit()!;
  const t = prestigeValueText(prestige);

  return replaceUnit(t, unit);
}
