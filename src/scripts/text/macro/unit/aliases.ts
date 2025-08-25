/**
 * Macro alias registration.
 *
 * Some older code and passages call macros using legacy names. Rather than
 * modify every call site, we register lightweight macro aliases that simply
 * forward to the canonical macro names defined elsewhere in this module.
 *
 * The `ALIASES` map (defined in `candidates.ts`) contains alias => target pairs.
 * This file iterates that map and registers each alias as a macro that invokes
 * the target macro name. Using explicit aliases keeps the codebase compatible
 * with older content while allowing newer code to use the canonical names.
 */

import { ALIASES } from "./candidates";

export function registerAliases() {
  for (const [alias, target] of Object.entries(ALIASES)) {
    // Macro.add can accept a function or a target string. Here we forward the
    // alias directly to the canonical target macro to keep runtime behavior
    // identical to the historic codebase.
    Macro.add(alias, target);
  }
}
