import { internalOutput, Text } from "../util";

/**
 * Register macros that output adjective-based descriptions for units.
 *
 * Provided macros:
 * - `uadj`       : a random adjective for the unit
 * - `uadjgood`   : a positive/complimentary adjective
 * - `uadjbad`    : a negative/critical adjective
 * - `uadjphys`   : an adjective focused on physical characteristics
 * - `uadjper`    : an adjective focused on personality
 * - `urace`      : the unit's race description
 * - `uhomeland`  : the unit's homeland description
 *
 * Each macro resolves the unit argument (key or instance), calls the
 * corresponding function on `Text.Unit.Trait`, and appends the resolved text
 * into the passage output. Articles are not applied here; callers can use
 * candidate macros (uaX) when an article is desired.
 */
export function registerAdjectives() {
  Macro.add("uadj", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        (u) => Text.Unit.Trait.adjectiveRandom(u),
        this.args[0],
      );
    },
  });
  Macro.add("uadjgood", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        (u) => Text.Unit.Trait.adjectiveGoodRandom(u),
        this.args[0],
      );
    },
  });
  Macro.add("uadjbad", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        (u) => Text.Unit.Trait.adjectiveBadRandom(u),
        this.args[0],
      );
    },
  });
  Macro.add("uadjphys", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        (u) => Text.Unit.Trait.adjectiveRandom(u, "physical"),
        this.args[0],
      );
    },
  });
  Macro.add("uadjper", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        (u) => Text.Unit.Trait.adjectiveRandom(u, "per"),
        this.args[0],
      );
    },
  });
  Macro.add("urace", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Unit.Trait.race,
        this.args[0],
      );
    },
  });
  Macro.add("uhomeland", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Unit.Trait.homeland,
        this.args[0],
      );
    },
  });
}
