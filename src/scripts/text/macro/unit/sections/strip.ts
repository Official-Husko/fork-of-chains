import { internalOutput, Text } from "../util";

/**
 * Register body-strip macros and helpers.
 *
 * These macros primarily forward to `Text.Unit.Equipment` and `Text.Strip`
 * helpers which contain the domain logic for stripping parts and describing the
 * action. They are kept thin to keep tree-shaking and bundling simple and to
 * centralise resolution/DOM insertion logic in `internalOutput`.
 */
export function registerStrip() {
  const E = Text.Unit.Equipment;
  const S = Text.Strip;

  Macro.add("ustriptorso", {
    handler() {
      internalOutput(this.output as HTMLElement, E.stripTorso, this.args[0]);
    },
  });
  Macro.add("ustriplegs", {
    handler() {
      internalOutput(this.output as HTMLElement, E.stripLegs, this.args[0]);
    },
  });
  Macro.add("ustripanus", {
    handler() {
      internalOutput(this.output as HTMLElement, E.stripAnus, this.args[0]);
    },
  });
  Macro.add("ustripgenital", {
    handler() {
      internalOutput(this.output as HTMLElement, E.stripGenital, this.args[0]);
    },
  });
  Macro.add("ustripvagina", {
    handler() {
      internalOutput(this.output as HTMLElement, E.stripVagina, this.args[0]);
    },
  });
  Macro.add("ustripdick", {
    handler() {
      internalOutput(this.output as HTMLElement, E.stripDick, this.args[0]);
    },
  });
  Macro.add("ustripnipple", {
    handler() {
      internalOutput(this.output as HTMLElement, E.stripNipple, this.args[0]);
    },
  });
  Macro.add("ustripmouth", {
    handler() {
      internalOutput(this.output as HTMLElement, E.stripMouth, this.args[0]);
    },
  });
  Macro.add("uslaverstripall", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        E.slaverStripAll,
        this.args[0],
      );
    },
  });

  Macro.add("uyoustripanus", {
    handler() {
      internalOutput(this.output as HTMLElement, E.youStripAnus, this.args[0]);
    },
  });

  // Verb (with optional target part code in args[1])
  Macro.add("ustripverb", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        (u) => S.verb(u, this.args[1]),
        this.args[0],
      );
    },
  });

  // "...and" helpers for listing multiple take-off actions
  Macro.add("ustripshirtand", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        S.takeoffshirtand,
        this.args[0],
      );
    },
  });
  Macro.add("ustrippantsand", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        S.takeoffpantsand,
        this.args[0],
      );
    },
  });
  Macro.add("ustripequipmentand", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        S.takeoffequipmentand,
        this.args[0],
      );
    },
  });
  Macro.add("ustripmouthand", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        S.takeoffmouthand,
        this.args[0],
      );
    },
  });
  Macro.add("ustripeyesand", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        S.takeoffeyesand,
        this.args[0],
      );
    },
  });
  Macro.add("ustripanusand", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        S.takeoffanusand,
        this.args[0],
      );
    },
  });
  Macro.add("ustripgenitaland", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        S.takeoffgenitaland,
        this.args[0],
      );
    },
  });
}
