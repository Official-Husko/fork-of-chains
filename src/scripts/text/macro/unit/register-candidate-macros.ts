import { CANDIDATES } from "./candidates";
import { Args_OneActor, internalOutput, MacroUtil, Text } from "./util";

/**
 * Register the low-level candidate macros for every candidate in `CANDIDATES`.
 *
 * For each candidate `X` we register four macros:
 *   - `uX`       : describe the candidate for a given unit (no article)
 *   - `uXall`    : same as `uX` but includes 'clothed' or equipment considerations
 *   - `uaX`      : same as `uX` but prepends an article (a/an/the) when appropriate
 *   - `uaXall`   : `uXall` variant with article
 *
 * The macros call the corresponding `Text.Unit.Trait[X]` function (or similar)
 * to get the phrase for the unit. When a candidate function is missing the
 * registration logs a console warning and skips creating macros for that key.
 *
 * Metadata is registered for each macro using `MacroUtil.registerMetadata` so
 * other tools (documentation, editors, or dev UIs) can discover argument shapes
 * and basic descriptive info.
 */
export function registerCandidateMacros() {
  for (const key of CANDIDATES) {
    const func = (Text.Unit.Trait as any)[key];
    if (typeof func !== "function") {
      // Warn once and skip this candidate so missing trait helpers don't crash
      // page rendering. This mirrors the original behaviour while making it
      // explicit to developers that the trait function is absent.
      console.warn(`[TextUnitMacros] Missing Text.Unit.Trait.${key} function`);
      continue;
    }

    // uX — simple candidate descriptor
    Macro.add(`u${key}`, {
      handler() {
        internalOutput(this.output as HTMLElement, func, this.args[0]);
      },
    });

    // uXall — include clothing / equipment context where applicable
    Macro.add(`u${key}all`, {
      handler() {
        internalOutput(
          this.output as HTMLElement,
          (unit: Unit) => func(unit, /*eq*/ true),
          this.args[0],
        );
      },
    });

    // uaX — same as uX but add an article (a/an/the)
    Macro.add(`ua${key}`, {
      handler() {
        internalOutput(
          this.output as HTMLElement,
          func,
          this.args[0],
          /*article*/ true,
        );
      },
    });

    // uaXall — article + equipment-aware
    Macro.add(`ua${key}all`, {
      handler() {
        internalOutput(
          this.output as HTMLElement,
          (unit: Unit) => func(unit, /*eq*/ true),
          this.args[0],
          /*article*/ true,
        );
      },
    });

    // Register metadata describing the macro (useful for IDEs and dev tools)
    MacroUtil.registerMetadata(`u${key}`, {
      info: `Describes the unit ${key}`,
      args: Args_OneActor,
    });
    MacroUtil.registerMetadata(`u${key}all`, {
      info: `Describes the unit ${key}, including clothed status`,
      args: Args_OneActor,
    });
    MacroUtil.registerMetadata(`ua${key}`, {
      info: `Describes the unit ${key}, and prepend an article`,
      args: Args_OneActor,
    });
    MacroUtil.registerMetadata(`ua${key}all`, {
      info: `Describes the unit ${key}, including clothed status, and prepend an article`,
      args: Args_OneActor,
    });
  }
}
