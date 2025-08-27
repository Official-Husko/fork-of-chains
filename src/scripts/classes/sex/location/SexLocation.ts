import type {} from "../../../data/furnitureslots";
import { TwineClassCustom } from "../../_TwineClass";
import { Furniture } from "../../furniture/Furniture";
import type {
  FurnitureSlot,
  FurnitureSlotKey,
} from "../../furniture/FurnitureSlot";
import type { Unit } from "../../unit/Unit";
import type { SexInstance } from "../engine/SexInstance";

/**
 * Where the sex takes place. Some actions are locked behind places.
 */
export abstract class SexLocation extends TwineClassCustom {
  constructor(
    public key: string,
    public tags: string[],
    public title: string,
    public description: string,
  ) {
    super();
  }

  /* =========================
      DEFINITIONS
  ========================= */

  getRestrictions(): Restriction[] {
    return [];
  }

  /* =========================
      BASIC
  ========================= */

  override getContainer(): string {
    return `setup.SexBodypartClass`;
  }

  getUniqueKey(): string {
    return this.key;
  }

  getTags(): string[] {
    return this.tags;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  rep(): string {
    return `<span data-tooltip="${setup.escapeHtml(this.getDescription())}">${this.getTitle()}</span>`;
  }

  isAllowed(sex: SexInstance): boolean {
    return setup.RestrictionLib.isPrerequisitesSatisfied(
      sex,
      this.getRestrictions(),
    );
  }

  /**
   * Whether this sex location raises the height of its middle position.
   */
  isHigh(): boolean {
    return false;
  }

  /* =========================
      FURNITURE
  ========================= */

  getFurnitures(): { [k in FurnitureSlotKey]: Furniture } {
    return {
      slaverbed: setup.furnitureslot.slaverbed.getBasicFurniture(),
      slavebed: setup.furnitureslot.slavebed.getBasicFurniture(),
      foodtray: setup.furnitureslot.foodtray.getBasicFurniture(),
      drinktray: setup.furnitureslot.drinktray.getBasicFurniture(),
      reward: setup.furnitureslot.reward.getBasicFurniture(),

      punishment: setup.furnitureslot.punishment.getBasicFurniture(),
      lighting: setup.furnitureslot.lighting.getBasicFurniture(),
      object: setup.furnitureslot.object.getBasicFurniture(),
      tile: setup.furnitureslot.tile.getBasicFurniture(),
      wall: setup.furnitureslot.wall.getBasicFurniture(),
    };
  }

  getFurnitureAt(slot: FurnitureSlot): Furniture {
    return this.getFurnitures()[slot.key];
  }

  getSlaverBed(): Furniture {
    return this.getFurnitureAt(setup.furnitureslot.slaverbed);
  }

  getSlaveBed(): Furniture {
    return this.getFurnitureAt(setup.furnitureslot.slavebed);
  }

  getFoodTray(): Furniture {
    return this.getFurnitureAt(setup.furnitureslot.foodtray);
  }

  getDrinkTray(): Furniture {
    return this.getFurnitureAt(setup.furnitureslot.drinktray);
  }

  getReward(): Furniture {
    return this.getFurnitureAt(setup.furnitureslot.reward);
  }

  getPunishment(): Furniture {
    return this.getFurnitureAt(setup.furnitureslot.punishment);
  }

  getLighting() {
    return this.getFurnitureAt(setup.furnitureslot.lighting);
  }

  getTile(): Furniture {
    return this.getFurnitureAt(setup.furnitureslot.tile);
  }

  getObject(): Furniture {
    return this.getFurnitureAt(setup.furnitureslot.object);
  }

  getWall() {
    return this.getFurnitureAt(setup.furnitureslot.wall);
  }

  /**
   * Returns the furniture on which sex happens.
   */
  getSurface(sex: SexInstance): Furniture {
    if (this.isHigh()) {
      return this.getSlaverBed();
    } else {
      return this.getTile();
    }
  }

  /* =========================
      TEXT
  ========================= */

  /**
   * Describes the floor, bed, etc.
   */
  repSurface(sex: SexInstance): string {
    return this.getSurface(sex).rep();
  }

  /**
   * Describes the wall, painting, etc. Unit gaze at "xxx"
   */
  repRawGazeAt(sex: SexInstance): string[] {
    return [];
  }

  /**
   * Describes the wall, painting, etc. Unit gaze at "xxx"
   */
  repGazeAt(sex: SexInstance): string {
    const object = this.getObject();
    const lighting = this.getLighting();
    const wall = this.getWall();
    const tile = this.getTile();
    const punishment = this.getPunishment();
    const reward = this.getReward();
    const slaverbed = this.getSlaverBed();
    const slavebed = this.getSlaveBed();
    const drinktray = this.getDrinkTray();
    const foodtray = this.getFoodTray();
    const room = this.repRoom(sex);

    const base = this.repRawGazeAt(sex);

    if (!object.isBasic()) {
      base.push(
        `the ${object.rep()} in the corner of the ${room}`,
        `the ${object.rep()}`,
      );
    }

    if (!lighting.isBasic()) {
      base.push(`the ${lighting.rep()} illuminating the ${room}`);
    }

    if (!wall.isBasic()) {
      base.push(`the ${wall.rep()}`, `the ${wall.rep()} on the walls`);
    } else {
      base.push(`an empty spot on the walls`);
    }

    if (!tile.isBasic()) {
      base.push(`the ${tile.rep()}`, `the ${tile.rep()} on the floor`);
    } else {
      base.push(`an empty spot on the floor`);
    }

    if (!drinktray.isBasic()) {
      base.push(`the ${drinktray.rep()}`, `the empty ${drinktray.rep()}`);
    }

    if (!foodtray.isBasic()) {
      base.push(`the ${foodtray.rep()}`, `the empty ${foodtray.rep()}`);
    }

    if (!slavebed.isBasic()) {
      base.push(
        `the ${slavebed.rep()} where your slaves sleep in`,
        `the ${slavebed.rep()}`,
      );
    }

    const basic_object = [punishment, reward];

    for (const obj of basic_object) {
      if (!obj.isBasic()) {
        base.push(`the ${obj.rep()}`);
      }
    }

    return setup.rng.choice(base);
  }

  /**
   * Describes the room. Moves to the center of the ...
   */
  repRoom(sex: SexInstance): string {
    return `room`;
  }

  /**
   * Describes ambience as half sentence, e.g.,: Mmeanwhile, {output}.
   * Example: "the sounds of other slaves moaning could be heard across the corridor".
   */
  repRawAmbience(sex: SexInstance): string[] {
    return [];
  }

  /**
   * Describes atmosphere of the room, as half sentence. E.g.: Meanwhile, {output}.
   * Example: "the sounds of other slaves moaning could be heard across the corridor".
   */
  repAmbience(sex: SexInstance): string {
    const base = this.repRawAmbience(sex);

    for (const slot of Object.values(setup.furnitureslot)) {
      const furniture = this.getFurnitureAt(slot);
      const texts = furniture.getTexts();
      if (texts.ambience) {
        for (const text of texts.ambience) {
          base.push(setup.Text.replaceRepMacros(text, { a: furniture }));
        }
      }
    }

    return setup.rng.choice(base);
  }

  /**
   * A sentence for starting a sex here.
   */
  rawRepStart(sex: SexInstance): string | string[] {
    return `a|They a|is in an open field, ready for some action.`;
  }

  /**
   * A sentence for starting a sex here.
   */
  repStart(sex: SexInstance): string {
    return setup.SexUtil.convert(
      this.rawRepStart(sex),
      { a: sex.getUnits()[0] },
      sex,
    );
  }

  /**
   * A sentence describing a unit's position here. E.g., "Lying on the floor",
   */
  rawDescribePosition(unit: Unit, sex: SexInstance): string | string[] {
    const pose = sex.getPose(unit);
    return `${pose.describePosition(unit, sex)} on the ${this.repSurface(sex)}`;
  }

  /**
   * A sentence describing a unit's position here. E.g., "Lying on the floor",
   * A sentence for starting a sex here.
   */
  describePosition(unit: Unit, sex: SexInstance): string {
    return setup.SexUtil.convert(
      this.rawDescribePosition(unit, sex),
      { a: sex.getUnits()[0] },
      sex,
    );
  }

  repUpsideDownFurniture(): string {
    for (const furniture of Object.values(this.getFurnitures())) {
      if (furniture instanceof Furniture) {
        if (furniture.getTags().includes("upsidedown")) {
          return furniture.rep();
        }
      }
    }
    return "";
  }
}
