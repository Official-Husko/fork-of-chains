import type { DutyInstance } from "../../classes/duty/DutyInstance";

/**
 * replaceUnit
 *
 * Convenience wrapper around the project's text macro replacer. The
 * project uses textual unit macros like `a|they` that need run-time
 * replacement; this helper centralises the call site and makes intent
 * explicit in the duty modules.
 */
export function replaceUnit(t: string, unit: Unit): string {
  return setup.Text.replaceUnitMacros(t, { a: unit });
}

/**
 * isBedchamberSlaveDuty
 *
 * The Bedchamber duty subtype is defined elsewhere in the runtime.
 * We detect it by asking `setup` for the constructor and running an
 * instanceof check. This avoids importing the subtype class here and
 * preserves runtime flexibility.
 */
export function isBedchamberSlaveDuty(duty: DutyInstance): boolean {
  const ctor = (setup as any).DutyInstanceBedchamberSlave;
  return typeof ctor === "function" && duty instanceof ctor;
}

/* ------------------------------------------------------------------ */
/* Small fluent rule builder for numeric thresholds                    */
/*
 * Many of the duty text pickers map numeric scores to strings. The
 * `rule` helper produces a compact, readable builder for such
 * threshold-based pickers. It supports two comparison kinds: `<` and
 * `<=`, and an `.else()` terminal clause which provides the fallback
 * output.
 *
 * Contract:
 * - Input: numeric value
 * - Output: T
 * - If no rules are added, calling the returned function is undefined
 *   behaviour (the calling code always configures an `.else(...)`).
 */

type Op = "<" | "<=";
type Rule<T> = { op: Op; value: number; out: T };

export function rule<T>() {
  const rules: Rule<T>[] = [];

  const fn = (x: number): T => {
    for (const r of rules) {
      if (r.op === "<" ? x < r.value : x <= r.value) return r.out;
    }
    // If no rule matched we expect the caller to have set an .else(...)
    // terminal clause. Returning the last rule's out is a small, safe
    // fallback that mirrors the builder's usage pattern.
    return rules[rules.length - 1].out;
  };

  fn.lt = (value: number, out: T) => {
    rules.push({ op: "<", value, out });
    return fn;
  };

  fn.lte = (value: number, out: T) => {
    rules.push({ op: "<=", value, out });
    return fn;
  };

  fn.else = (out: T) => {
    rules.push({ op: "<=", value: Number.POSITIVE_INFINITY, out });
    return fn;
  };

  return fn as typeof fn & {
    lt(value: number, out: T): typeof fn;
    lte(value: number, out: T): typeof fn;
    else(out: T): typeof fn;
  };
}
