import { internalOutput, Text } from "../util";

/**
 * Register simple praise/insult/hobby macros that return short noun/verb
 * representations for a unit. These are small helpers used in banter and
 * short descriptive lines.
 */
export function registerPraiseInsultHobby() {
  Macro.add("upraisenoun", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Praise.noun,
        this.args[0],
      );
    },
  });

  Macro.add("uinsultnoun", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Insult.noun,
        this.args[0],
      );
    },
  });

  Macro.add("uhobbyverb", {
    handler() {
      internalOutput(this.output as HTMLElement, Text.Hobby.verb, this.args[0]);
    },
  });
}
