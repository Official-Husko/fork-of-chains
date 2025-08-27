import type { Bedchamber, BedchamberKey } from "../../../bedchamber/BedChamber";
import type { Furniture } from "../../../furniture/Furniture";
import type { FurnitureSlotKey } from "../../../furniture/FurnitureSlot";
import { SexLocation } from "../SexLocation";

export class SexLocation_Bedchamber extends SexLocation {
  bedchamber_key: BedchamberKey;
  is_high: boolean;

  constructor(bedchamber: Bedchamber, is_high: boolean) {
    super(
      "bedchamber",
      [
        /* tags  */
      ],
      "A bedchamber",
      "A bedchamber",
    );
    this.bedchamber_key = resolveKey(bedchamber);
    this.is_high = is_high;
  }

  override getUniqueKey(): string {
    return `${this.key}|${this.bedchamber_key}`;
  }

  getBedchamber(): Bedchamber {
    return State.variables.bedchamber[this.bedchamber_key];
  }

  getFurnitures(): { [k in FurnitureSlotKey]: Furniture } {
    const bedchamber = this.getBedchamber();
    return Object.fromEntries(
      Object.values(setup.furnitureslot).map((slot) => {
        return [slot.key, bedchamber.getFurniture(slot)];
      }),
    ) as { [k in FurnitureSlotKey]: Furniture };
  }

  getRestrictions() {
    return [setup.qres.SexBedchamberUsable(this.getBedchamber())];
  }

  getTitle(): string {
    const bedchamber = this.getBedchamber();
    let floor;
    if (this.isHigh()) {
      floor = "Bed";
    } else {
      floor = "Floor";
    }
    return `${bedchamber.getSlaver().rep()}'s ${bedchamber.rep()} (${floor})`;
  }

  getDescription(): string {
    let bed = this.getFurnitureAt(setup.furnitureslot.slaverbed).getName();
    if (!this.isHigh()) {
      bed = this.getFurnitureAt(setup.furnitureslot.tile).getName();
    }
    return `The ${bed} in ${this.getBedchamber().getName()}`;
  }

  isHigh() {
    return this.is_high;
  }

  /**
   * Describes the room. Moves to the center of the ...
   */
  repRoom(sex: SexInstance): string {
    return this.getBedchamber().getName();
  }

  repRawGazeAt(sex: SexInstance) {
    const base = [
      `the bedchamber walls`,
      `the bedchamber door`,
      `a stain on the walls`,
      `the windows`,
    ];

    const slavebed = this.getSlaveBed();
    if (slavebed.isBasic()) {
      base.push(`the empty spot on the floor where the slaves sleep in`);
    }

    return base;
  }

  repRawAmbience(sex: SexInstance) {
    const base = [
      `the strong smell of arousal permeates the room`,
      `the distinct sound of sex can be heard from a nearby room`,
      `looking outside the window, your other slavers are going on their usual daily business`,
      `outside of this room, business is going as usual in the fort`,

      `a muffled sound can be heard coming from somewhere inside your fort`,
      `a visitor can be seen walking around your fort from the window`,
      `a bird perches on the bechamber's window`,
    ];

    if (State.variables.fort.player.isHasBuilding("market")) {
      base.push(`the bustling sound of merchant can be heard from your market`);
    }

    return base;
  }

  /**
   * A sentence for starting a sex here.
   */
  rawRepStart(sex: SexInstance): string | string[] {
    if (this.isHigh()) {
      const bed = this.getFurnitureAt(setup.furnitureslot.slaverbed).rep();
      return [
        `a|They a|go into ${this.getTitle()}, before going up the ${bed} for some action.`,
        `After going to the bedchamber area, a|they go inside ${this.getTitle()} and prepare to tumble on the ${bed}.`,
        `${this.getTitle()} is just perfect for the kind of play a|rep a|have in mind today.`,
      ];
    } else {
      const floor = this.getFurnitureAt(setup.furnitureslot.tile).rep();
      return [
        `a|They a|go into ${this.getTitle()}, before going on the ${floor} for some rough action.`,
        `After going to the bedchamber area, a|they go inside ${this.getTitle()} and prepare to tumble on the ${floor}.`,
        `${this.getTitle()} is just perfect for the kind of play a|rep a|have in mind today.`,
      ];
    }
  }
}
