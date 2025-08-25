import { internalOutputUnitTarget, Text } from "../util";

/**
 * Register greetings and nickname macros which accept an optional target unit.
 *
 * These macros typically render different text depending on whether a target
 * unit is provided. The helper `internalOutputUnitTarget` resolves both the
 * primary unit and the optional target into live objects before rendering.
 */
export function registerGreeting() {
  Macro.add("unickname", {
    handler() {
      internalOutputUnitTarget(
        this.output as HTMLElement,
        Text.Greeting.nickname,
        this.args[0],
        this.args[1],
      );
    },
  });

  Macro.add("unicknamebad", {
    handler() {
      internalOutputUnitTarget(
        this.output as HTMLElement,
        Text.Greeting.nicknamebad,
        this.args[0],
        this.args[1],
      );
    },
  });

  Macro.add("ugreetingshort", {
    handler() {
      internalOutputUnitTarget(
        this.output as HTMLElement,
        Text.Greeting.short,
        this.args[0],
        this.args[1],
      );
    },
  });

  Macro.add("ugreetingfull", {
    handler() {
      internalOutputUnitTarget(
        this.output as HTMLElement,
        Text.Greeting.full,
        this.args[0],
        this.args[1],
      );
    },
  });

  Macro.add("ubusyshort", {
    handler() {
      internalOutputUnitTarget(
        this.output as HTMLElement,
        Text.Greeting.busyshort,
        this.args[0],
        this.args[1],
      );
    },
  });

  Macro.add("uyesmaster", {
    handler() {
      internalOutputUnitTarget(
        this.output as HTMLElement,
        Text.Slave.yesmaster,
        this.args[0],
        this.args[1],
      );
    },
  });
}
