/**
 * Backwards-compatible adapter for the punish modules.
 *
 * The codebase was refactored into smaller modules (`slave`, `slaver`, `punishreason`).
 * Older code expects a `TextPunish` object/namespace. Exporting a plain object
 * is more idiomatic for modern ES modules and generates cleaner runtime output.
 *
 * This module exports `TextPunish` as a const object and (optionally) attaches
 * it to `globalThis.TextPunish` for code that relies on a runtime global.
 */

import { punishreason as _punishreason } from "./punishreason";
import { getPunishReasonSlave as _getPunishReasonSlave } from "./slave";
import { getPunishReasonSlaver as _getPunishReasonSlaver } from "./slaver";

/**
 * Public, runtime-friendly object that mirrors the old `TextPunish` API.
 * Each method delegates to the refactored implementation.
 */
export const TextPunish = {
  /**
   * Return an array of possible punishment reason strings for a slave unit.
   * @param unit - Slave unit to evaluate
   */
  getPunishReasonSlave(unit: Unit): string[] {
    return _getPunishReasonSlave(unit);
  },

  /**
   * Return an array of possible punishment reason strings for a slaver unit.
   * @param unit - Slaver unit to evaluate
   */
  getPunishReasonSlaver(unit: Unit): string[] {
    return _getPunishReasonSlaver(unit);
  },

  /**
   * Return a single, randomly-chosen punishment reason for a unit.
   * @param unit - Unit to evaluate
   */
  punishreason(unit: Unit): string {
    return _punishreason(unit);
  },
} as const;

// Attach to globalThis only when a runtime global isn't already present.
// This preserves behavior for legacy code that expects a global `TextPunish`.
if (typeof globalThis !== "undefined") {
  const g = globalThis as any;
  if (!g.TextPunish) g.TextPunish = TextPunish;
}

/**
 * Export a type alias for the object shape in case callers want to reference it.
 */
export type TextPunishType = typeof TextPunish;
