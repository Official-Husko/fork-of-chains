import { internalOutput, Text } from "../util";

/**
 * Register adverb and banter macros.
 *
 * These macros return short adverbial phrases or banter snippets tailored to
 * the unit's personality and state. They leverage `Text.Banter` helpers which
 * encapsulate the selection logic.
 */
export function registerAdverbsAndBanter() {
  Macro.add("uadv", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        (u) => Text.Banter._getAdverb(u),
        this.args[0],
      );
    },
  });
  Macro.add("uadvcare", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        (u) => Text.Banter._getAdverb(u, true),
        this.args[0],
      );
    },
  });
  Macro.add("uadvabuse", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        (u) => Text.Banter._getAdverb(u, false, true),
        this.args[0],
      );
    },
  });
  Macro.add("ubantertraining", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Banter.slaveTrainingText,
        this.args[0],
      );
    },
  });
}
