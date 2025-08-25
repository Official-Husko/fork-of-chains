import type { DutyInstance } from "../../classes/duty/DutyInstance";
import { DutyInstancePrestigeSlave } from "../../classes/duty/subtypes/PrestigeSlave";
import { bedchamberText, genericChanceText, prestigeChanceText } from "./rules";
import { isBedchamberSlaveDuty, replaceUnit } from "./util";

/**
 * competence
 *
 * Generate a short, human-friendly description of how well the
 * assigned unit performs this duty. The function chooses one of three
 * strategies:
 * - Bedchamber duties: use the friendship-to-text mapping and insert
 *   the owner's name into the `<<owner>>` placeholder.
 * - Prestige duties: map `chance` through `prestigeChanceText`.
 * - Generic duties: map `chance` through `genericChanceText`.
 *
 * The returned string contains unit macros and is passed through
 * `replaceUnit` before being returned.
 */
export function competence(duty: DutyInstance): string {
  const unit = duty.getAssignedUnit()!;
  const chance = duty.computeChance();

  let t: string;

  if (isBedchamberSlaveDuty(duty)) {
    // Bedchamber duties are evaluated relative to the owner (slaver).
    // We access the owner via the bedchamber object and then compute
    // friendship to pick the appropriate textual tier. The chosen
    // string still contains a <<owner>> placeholder which we replace
    // here with the owner's rep().
    const owner = (duty as any).getBedchamber().getSlaver() as Unit;
    const friendship = State.variables.friendship.getFriendship(owner, unit);
    const raw = bedchamberText(friendship).replaceAll("<<owner>>", owner.rep());
    t = raw;
  } else if (duty instanceof DutyInstancePrestigeSlave) {
    t = prestigeChanceText(chance);
  } else {
    t = genericChanceText(chance);
  }

  return replaceUnit(t, unit);
}
