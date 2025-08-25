import { internalOutput, Text } from "../util";

/**
 * Register equipment-related macros.
 *
 * These macros provide concise representations of a unit's equipment and weapon
 * state. They are thin adapters over `Text.Unit.Equipment` helpers which
 * contain the logic for summarising or formatting equipment descriptions.
 */
export function registerEquipment() {
  Macro.add("uequipment", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Unit.Equipment.equipmentSummary,
        this.args[0],
      );
    },
  });

  Macro.add("uweapon", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Unit.Equipment.getWeaponRep,
        this.args[0],
      );
    },
  });

  Macro.add("uaweapon", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Unit.Equipment.getAWeaponRep,
        this.args[0],
      );
    },
  });

  Macro.add("uweaponall", {
    handler() {
      internalOutput(
        this.output as HTMLElement,
        Text.Unit.Equipment.getWeaponRepFull,
        this.args[0],
      );
    },
  });
}
