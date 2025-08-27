import type { TitleKey } from "../../../classes/title/Title";

/**
 * Turn a unit into the player character.
 */
export const DOM_Menu_prologueMakePlayer = function (unit: Unit): void {
  const past_image = State.variables.unitimage.getImagePath(unit);
  delete State.variables.unit[unit.key];
  unit.key = "player" as UnitKey;
  State.variables.unit.player = unit;
  State.variables.unitimage.setImage(unit, past_image);
  setup.qc
    .AddTitle("unit", setup.title["leader" as TitleKey])
    .apply(setup.costUnitHelper(unit));
  State.variables.company.player.addUnit(unit, setup.job.slaver);
  State.variables.notification.popAll();
};
