import { getPunishReasonSlave } from "./slave";
import { getPunishReasonSlaver } from "./slaver";

export function punishreason(unit: Unit): string {
  const outputs = unit.isSlave()
    ? getPunishReasonSlave(unit)
    : getPunishReasonSlaver(unit);
  return setup.rng.choice(outputs);
}