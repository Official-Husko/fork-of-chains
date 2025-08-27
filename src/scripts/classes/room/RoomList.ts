import { TwineClass } from "../_TwineClass";
import type { SkillValuesArray } from "../Skill";
import type { RoomInstance, RoomInstanceKey } from "./RoomInstance";
import type { RoomTemplate, RoomTemplateKey } from "./RoomTemplate";

interface GetRoomInstancesArgs {
  template?: RoomTemplate;
}

const DEFAULT_ROOM_COUNT = Object.freeze({
  unplaced: 0,
  placed: 0,
});

/**
 * List of rooms.
 * Actual list of rooms is stored in $roominstance
 * this is $roomlist
 */
export class RoomList extends TwineClass {
  cached_unplaced_room_keys?: RoomInstanceKey[];

  cached_skill_bonuses?: SkillValuesArray = Array(setup.skill.length).fill(0);

  cached_room_count?: {
    [k in RoomTemplateKey]?: { placed: number; unplaced: number };
  };

  cached_template_key_to_room_key?: Record<string, RoomInstanceKey[]>;

  constructor() {
    super();
  }

  resetCache(): void {
    this.cached_unplaced_room_keys = undefined;
    this.cached_skill_bonuses = undefined;
    this.cached_room_count = undefined;
    this.cached_template_key_to_room_key = undefined;
  }

  resetCacheAll(): void {
    this.resetCache();
    for (const room of this.getRoomInstances()) {
      room.resetCache();
    }
  }

  getRoomCount(
    template: RoomTemplate,
  ): Readonly<{ placed: number; unplaced: number }> {
    if (!this.cached_room_count) this.recomputeRoomCountsAndInstance();
    return this.cached_room_count![template.key] ?? DEFAULT_ROOM_COUNT;
  }

  recomputeRoomCountsAndInstance(): void {
    const all_rooms = State.variables.roomlist.getRoomInstances();

    this.cached_room_count = {};
    this.cached_template_key_to_room_key = {};

    for (const room of all_rooms) {
      const key = room.getTemplate().key;

      let counts = this.cached_room_count[key];
      if (!counts) {
        this.cached_room_count[key] = counts = {
          placed: 0,
          unplaced: 0,
        };
        this.cached_template_key_to_room_key[key] = [];
      }

      this.cached_template_key_to_room_key[key].push(room.key);

      if (room.isPlaced()) {
        counts.placed += 1;
      } else {
        counts.unplaced += 1;
      }
    }
  }

  _doGetRoomInstances({ template }: GetRoomInstancesArgs): RoomInstance[] {
    if (template) {
      if (!this.cached_template_key_to_room_key) {
        this.recomputeRoomCountsAndInstance();
      }
      if (template.key in this.cached_template_key_to_room_key!) {
        return this.cached_template_key_to_room_key![template.key].map(
          (key) => State.variables.roominstance[key],
        );
      } else {
        return [];
      }
    } else {
      return Object.values(State.variables.roominstance);
    }
  }

  getRoomInstances(args?: GetRoomInstancesArgs): RoomInstance[] {
    return this._doGetRoomInstances(args || {});
  }

  getUnplacedRooms() {
    if (!this.cached_unplaced_room_keys) {
      this.cached_unplaced_room_keys = this.getRoomInstances()
        .filter((room) => !room.isPlaced())
        .map((room) => room.key);
    }
    return this.cached_unplaced_room_keys.map(
      (key) => State.variables.roominstance[key],
    );
  }

  getTotalSkillBonuses(): SkillValuesArray {
    if (!this.cached_skill_bonuses) {
      this.recomputeTotalSkillBonuses();
    }
    return this.cached_skill_bonuses!;
  }

  recomputeTotalSkillBonuses(): void {
    const rooms = this.getRoomInstances();
    const skill_bonuses = Array(setup.skill.length).fill(0);
    for (const room of rooms) {
      const bonus = room.getSkillBonuses();
      for (let i = 0; i < setup.skill.length; ++i) {
        skill_bonuses[i] += bonus[i];
      }
    }

    // cap it
    for (let i = 0; i < setup.skill.length; ++i) {
      skill_bonuses[i] = Math.round(
        Math.min(skill_bonuses[i], setup.ROOM_MAX_SKILL_BOOST),
      );
    }

    this.cached_skill_bonuses = skill_bonuses;

    // reset cache on all units
    for (const unit of State.variables.company.player.getUnits({})) {
      unit.resetCache();
    }
  }
}
