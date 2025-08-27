import { domCardRep } from "../../dom/util/cardnamerep";
import {
  menuItemAction,
  menuItemExtras,
  menuItemText,
  menuItemTitle,
} from "../../ui/menuitem";
import { TwineClass } from "../_TwineClass";
import type { DutyInstanceKey } from "../duty/DutyInstance";
import type { DutyInstanceBedchamberSlave } from "../duty/subtypes/BedchamberSlave";
import { Furniture } from "../furniture/Furniture";
import type {
  FurnitureSlot,
  FurnitureSlotKey,
} from "../furniture/FurnitureSlot";
import type { ItemKey } from "../inventory/Item";
import type { SkillValuesArray } from "../Skill";
import type { UnitKey } from "../unit/Unit";

export const BEDCHAMBER_OPTIONS = {
  walk: {
    walk: {
      text: "can walk freely",
      kindness: 1,
      cruelty: 0,
    },
    crawl: {
      text: "must crawl on all fours",
      kindness: 0,
      cruelty: 1,
    },
  },
  orgasm: {
    yes: {
      text: "can reach orgasm",
      kindness: 1,
      cruelty: 0,
    },
    no: {
      text: "are denied all orgasms",
      kindness: 0,
      cruelty: 1,
    },
  },
  speech: {
    full: {
      text: "can talk like normal",
      kindness: 1,
      cruelty: 0,
    },
    animal: {
      text: "can only make animal-like noises",
      kindness: 0,
      cruelty: 1,
    },
    none: {
      text: "are not allowed to make any humanlike noises",
      kindness: 0,
      cruelty: 0,
    },
  },
  food: {
    normal: {
      text: "eat normal food",
      kindness: 1,
      cruelty: 0,
    },
    cum: {
      text: "can only eat food splattered with cum",
      kindness: 0,
      cruelty: 1,
    },
    milk: {
      text: "can only eat food mixed with humanlike milk",
      kindness: 0,
      cruelty: 1,
    },
  },
  share: {
    yes: {
      text: "can be used by other slavers",
      kindness: 0,
      cruelty: 0,
    },
    no: {
      text: "not usable by other slavers",
      kindness: 0,
      cruelty: 0,
    },
  },
};

export const BEDCHAMBER_OPTION_CHANCES = {
  friendly: {
    walk: {
      walk: 0.9,
      crawl: 0.1,
    },
    orgasm: {
      yes: 0.9,
      no: 0.1,
    },
    speech: {
      full: 0.9,
      animal: 0.05,
      none: 0.05,
    },
    food: {
      normal: 0.9,
      cum: 0.05,
      milk: 0.05,
    },
    share: {
      yes: 0.95,
      no: 0.05,
    },
  },
  bold: {
    walk: {
      walk: 0.5,
      crawl: 0.5,
    },
    orgasm: {
      yes: 0.5,
      no: 0.5,
    },
    speech: {
      full: 0.45,
      animal: 0.05,
      none: 0.5,
    },
    food: {
      normal: 0.8,
      cum: 0.1,
      milk: 0.1,
    },
    share: {
      yes: 0.5,
      no: 0.5,
    },
  },
  cool: {
    walk: {
      walk: 0.5,
      crawl: 0.5,
    },
    orgasm: {
      yes: 0.1,
      no: 0.9,
    },
    speech: {
      full: 0.01,
      animal: 0.09,
      none: 0.9,
    },
    food: {
      normal: 0.9,
      cum: 0.05,
      milk: 0.05,
    },
    share: {
      yes: 0.7,
      no: 0.3,
    },
  },
  witty: {
    walk: {
      walk: 0.3,
      crawl: 0.7,
    },
    orgasm: {
      yes: 0.2,
      no: 0.8,
    },
    speech: {
      full: 0.25,
      animal: 0.7,
      none: 0.05,
    },
    food: {
      normal: 0.35,
      cum: 0.35,
      milk: 0.35,
    },
    share: {
      yes: 0.8,
      no: 0.2,
    },
  },
  debauched: {
    walk: {
      walk: 0.1,
      crawl: 0.9,
    },
    orgasm: {
      yes: 0.1,
      no: 0.9,
    },
    speech: {
      full: 0.1,
      animal: 0.4,
      none: 0.5,
    },
    food: {
      normal: 0.1,
      cum: 0.45,
      milk: 0.45,
    },
    share: {
      yes: 0.6,
      no: 0.4,
    },
  },
};

type _BedchamberOptionTemp =
  (typeof BEDCHAMBER_OPTION_CHANCES)[keyof typeof BEDCHAMBER_OPTION_CHANCES];

export type BedchamberOptions = {
  [k in keyof _BedchamberOptionTemp]: keyof _BedchamberOptionTemp[k];
};

export type BedchamberKey = BrandedType<number, "BedchamberKey">;

export class Bedchamber extends TwineClass {
  key: BedchamberKey;
  name: string;

  furniture_map: { [k in FurnitureSlotKey]?: ItemKey } = {};

  option_map: BedchamberOptions = {
    walk: "walk",
    orgasm: "yes",
    speech: "full",
    food: "normal",
    share: "yes",
  };

  slaver_key: UnitKey;

  duty_keys: DutyInstanceKey[] = [];

  constructor() {
    super();

    this.key = State.variables.Bedchamber_keygen++ as BedchamberKey;

    this.name = `Bedchamber ${this.key}`;

    this.slaver_key = State.variables.unit.player.key;

    if (this.key in State.variables.bedchamber)
      throw new Error(`Bedchamber ${this.key} already exists`);
    State.variables.bedchamber[this.key] = this;

    for (let i = 0; i < 2; ++i) {
      const duty = State.variables.dutylist.addDuty(
        new setup.DutyInstanceBedchamberSlave({
          bedchamber: this,
          index: i,
        }),
      );
      this.duty_keys.push(duty.key);
    }
  }

  getRepMacro() {
    return "bedchambercard";
  }

  rep(): string {
    return setup.repMessage(this);
  }

  getOptionMap() {
    return this.option_map;
  }

  getSlaver(): Unit {
    if (!this.slaver_key) throw new Error(`null slaver key at ${this.key}`);
    return State.variables.unit[this.slaver_key];
  }

  setSlaver(unit: Unit) {
    if (!unit) throw new Error(`must have unit for set slaver at ${this.key}`);
    const old_slaver = this.getSlaver();
    this.slaver_key = unit.key;
    if (unit != State.variables.unit.player) {
      this.autoSetOptions();
    }
    old_slaver.resetCache();
    unit.resetCache();
  }

  getDuties(): DutyInstanceBedchamberSlave[] {
    return this.duty_keys.map(
      (a) => State.variables.duty[a] as DutyInstanceBedchamberSlave,
    );
  }

  getSlaves(): Unit[] {
    let slaves: Unit[] = [];
    let duties = this.getDuties();
    for (let i = 0; i < duties.length; ++i) {
      let unit = duties[i].getUnitIfAvailable();
      if (unit) slaves.push(unit);
    }
    return slaves;
  }

  getAssignedSlaves(): Unit[] {
    let slaves: Unit[] = [];
    let duties = this.getDuties();
    for (let i = 0; i < duties.length; ++i) {
      let unit = duties[i].getAssignedUnit();
      if (unit) slaves.push(unit);
    }
    return slaves;
  }

  getFurniture(slot: FurnitureSlot): Furniture {
    let item;
    let key = this.furniture_map[slot.key];
    if (key) {
      item = setup.item[key];
    }
    if (item && item instanceof Furniture) {
      return item;
    }
    return slot.getBasicFurniture();
  }

  isHasFurniture(furniture: Furniture): boolean {
    return this.getFurniture(furniture.getSlot()) == furniture;
  }

  /**
   * Auto fill in furniture with best ones. Best is determined by total sum of stat modifiers.
   */
  autoAssignFurniture() {
    const furnitures = State.variables.inventory
      .getItems()
      .map((item_obj) => item_obj.item)
      .filter((item) => item instanceof Furniture);

    for (const slot of Object.values(setup.furnitureslot)) {
      const matches = furnitures.filter(
        (furniture) => furniture.getSlot() == slot,
      );
      if (!matches.length) continue;
      matches.sort((f1, f2) => {
        const sum1 = f1.getSkillMods().reduce((a, b) => a + b, 0);
        const sum2 = f2.getSkillMods().reduce((a, b) => a + b, 0);
        return sum2 - sum1;
      });
      const best_match = matches[0];
      const current = this.getFurniture(slot);
      const current_sum = current.getSkillMods().reduce((a, b) => a + b, 0);
      const best_match_sum = best_match
        .getSkillMods()
        .reduce((a, b) => a + b, 0);
      if (current_sum < best_match_sum) {
        this.setFurniture(slot, best_match);
      }
    }
  }

  setFurniture(slot: FurnitureSlot, furniture: Furniture | null) {
    if (furniture && furniture.getSlot() != slot) {
      throw new Error(
        `furniture at wrong slot: ${furniture.key} not at ${slot.key}`,
      );
    }
    let existing = this.getFurniture(slot);
    if (!existing.isBasic()) {
      // add it back to the inventory.
      // don't notify
      State.variables.notification.disable();
      State.variables.inventory.addItem(existing);
      State.variables.notification.enable();
    }
    if (furniture) {
      State.variables.notification.disable();
      State.variables.inventory.removeItem(furniture);
      State.variables.notification.enable();
      this.furniture_map[slot.key] = furniture.key;
    } else {
      delete this.furniture_map[slot.key];
    }
    this.getSlaver().resetCache();
  }

  getSkillAddition(): SkillValuesArray {
    let additions: SkillValuesArray = Array(setup.skill.length).fill(0);
    for (let slotkey of objectKeys(setup.furnitureslot)) {
      let furniture = this.getFurniture(setup.furnitureslot[slotkey]);
      let furnitureadd = furniture.getSkillMods();
      for (let i = 0; i < additions.length; ++i) {
        additions[i] += furnitureadd[i];
      }
    }

    let unit = this.getSlaver();
    if (unit) {
      let slaves = this.getSlaves();
      for (let i = 0; i < slaves.length; ++i) {
        let slave = slaves[i];
        let friendship = State.variables.friendship.getFriendship(unit, slave);
        let statgain = 0;
        for (let j = 0; j < setup.BEDCHAMBER_SLAVE_SKILL_GAIN.length; ++j) {
          let thres = setup.BEDCHAMBER_SLAVE_SKILL_GAIN[j];
          if (Math.abs(friendship) >= thres) ++statgain;
        }
        for (let j = 0; j < additions.length; ++j) {
          additions[j] += statgain;
        }
      }
    }

    return additions;
  }

  autoSetOptions() {
    // auto set options based on current slaver.
    let slaver = this.getSlaver();
    if (!slaver) throw new Error(`missing slaver??`);
    let speechkey = slaver.getSpeech().key;
    if (!(speechkey in BEDCHAMBER_OPTION_CHANCES))
      throw new Error(
        `Missing ${speechkey} in setup bedchamber options chances`,
      );
    let optionobj =
      BEDCHAMBER_OPTION_CHANCES[
        speechkey as keyof typeof BEDCHAMBER_OPTION_CHANCES
      ];
    for (let optionkey of objectKeys(optionobj)) {
      let chance_obj = optionobj[optionkey];
      this.option_map[optionkey] = setup.rng.sampleObject(
        chance_obj as any,
        /* force_return = */ true,
      )!;
    }
  }

  getOption<K extends keyof BedchamberOptions>(
    option_name: K,
  ): BedchamberOptions[K] {
    if (!(option_name in BEDCHAMBER_OPTIONS))
      throw new Error(`invalid option for bedchamber: ${option_name}`);
    return this.option_map[option_name];
  }

  getKindness(): number {
    let kindness = 0;
    for (const [optionkey, optionval] of objectEntries(this.option_map)) {
      kindness +=
        (BEDCHAMBER_OPTIONS as any)[optionkey]?.[optionval]?.kindness ?? 0;
    }
    return kindness;
  }

  getCruelty(): number {
    let cruelty = 0;
    for (const [optionkey, optionval] of objectEntries(this.option_map)) {
      cruelty +=
        (BEDCHAMBER_OPTIONS as any)[optionkey]?.[optionval]?.cruelty ?? 0;
    }
    return cruelty;
  }

  getName(): string {
    return this.name;
  }

  isPrivate(): boolean {
    return this.getOption("share") == "no";
  }

  /**
   * Construct the menu for this bedchamber
   */
  getMenu(show_actions?: boolean): JQuery[] {
    const toolbar_items = [];

    toolbar_items.push(
      menuItemTitle({
        text: domCardRep(this),
      }),
    );

    toolbar_items.push(
      menuItemText({
        text: `${this.getSlaver().rep()}`,
      }),
    );

    if (show_actions) {
      if (State.variables.gPassage != "BedchamberChangeFurniture") {
        toolbar_items.push(
          menuItemAction({
            text: `Edit`,
            tooltip: `Add / remove furnitures from this room`,
            callback: () => {
              State.variables.gBedchamber_key = this.key;
              State.variables.gBedchamberChangeFurnitureReturnPassage =
                State.variables.gPassage;
              setup.DOM.Nav.goto("BedchamberChangeFurniture");
            },
          }),
        );
      }

      toolbar_items.push(
        menuItemAction({
          text: `Auto-Furnish`,
          tooltip: `Automatically put the best furnitures for this room`,
          callback: () => {
            this.autoAssignFurniture();
            setup.DOM.Nav.goto();
          },
        }),
      );

      toolbar_items.push(
        menuItemExtras({
          children: [
            menuItemAction({
              text: `Change rules`,
              tooltip: `Change the slave rules of your bedroom, which may change whether the slaves will like you or be afraid of you.`,
              callback: () => {
                State.variables.gBedchamber_key = this.key;
                setup.DOM.Nav.goto("BedchamberOptionsChange");
              },
            }),
            menuItemAction({
              text: `Change owner`,
              tooltip: `Give the room a different slaver owner`,
              callback: () => {
                State.variables.gBedchamber_key = this.key;
                setup.DOM.Nav.goto("BedchamberOwnerChange");
              },
            }),
            menuItemAction({
              text: `Rename`,
              tooltip: `Rename the room`,
              callback: () => {
                State.variables.gBedchamber_key = this.key;
                setup.DOM.Nav.goto("BedchamberRename");
              },
            }),
          ],
        }),
      );
    }

    return toolbar_items;
  }
}
