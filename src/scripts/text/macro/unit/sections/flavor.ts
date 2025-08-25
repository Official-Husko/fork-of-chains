import { internalOutput, Text } from "../util";

/**
 * Register flavour-text macros that render a tagged piece of descriptive text
 * associated with a unit. The optional `tag` argument allows selecting
 * different flavours (for example, thematic variants or context-specific lines).
 */
export function registerFlavor() {
  Macro.add("uflavor", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        (unit: Unit) => Text.Unit.Trait.flavor(unit, /*tag*/ this.args[1]),
        this.args[0],
      );
    },
  });
}
