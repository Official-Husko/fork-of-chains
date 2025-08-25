import { internalOutput, Text } from "../util";

/**
 * Register punish/rescue macros.
 *
 * `upunishreason` outputs a short phrase explaining why the unit might be
 * punished. It delegates to `Text.Punish.punishreason` which consolidates the
 * punish logic for slave/slaver units.
 *
 * `uneedrescue` and `urescuenow` provide rescue-related textual helpers.
 */
export function registerPunishRescue() {
  Macro.add("upunishreason", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Punish.punishreason,
        this.args[0],
      );
    },
  });

  Macro.add("uneedrescue", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Rescue.needrescue,
        this.args[0],
      );
    },
  });

  Macro.add("urescuenow", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Rescue.rescueNow,
        this.args[0],
      );
    },
  });
}
