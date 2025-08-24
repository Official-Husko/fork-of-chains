export type PunishRule = {
  check: (unit: Unit) => boolean;
  text: (unit: Unit, rep: string, their: string) => string;
};

export function evaluateRules(
  unit: Unit,
  rules: PunishRule[],
  base: string[],
): string[] {
  let their = `<<their "${unit.key}">>`;
  let rep = unit.rep();
  const outputs = [...base];

  for (const rule of rules) {
    if (rule.check(unit)) {
      outputs.push(rule.text(unit, rep, their));
    }
  }
  return outputs;
}