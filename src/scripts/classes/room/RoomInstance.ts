import { TwineClass } from "../_TwineClass";
import type { SkillValuesArray } from "../Skill";
import type { TileLocation } from "./FortGrid";
import type { RoomTemplate, RoomTemplateKey } from "./RoomTemplate";

export type Rotation = 0 | 1 | 2 | 3;

export type RoomInstanceKey = BrandedType<number, "RoomInstanceKey">;

const CACHED_SKILL_BONUSES = Symbol("CACHED_SKILL_BONUSES");

export class RoomInstance extends TwineClass {
  key: RoomInstanceKey;
  template_key: RoomTemplateKey;

  //owner_keys?: UnitKey[];

  location?: TileLocation;

  /**
   * Number of times this building has been rotated clockwise 90 degrees.
   *
   * Defaults to 0 (i.e. no rotation).
   * When 0, undefined is stored instead (to try to save up save storage space).
   */
  clockwise_rotations?: Exclude<Rotation, 0>;

  [CACHED_SKILL_BONUSES]?: SkillValuesArray;

  seed?: number;

  constructor({ template }: { template: RoomTemplate }) {
    super();

    this.key = State.variables.RoomInstance_keygen++ as RoomInstanceKey;

    this.template_key = template.key;
    if (!this.template_key) throw new Error(`Unrecognized room template`);

    if (this.key in State.variables.roominstance)
      throw new Error(`Room instance ${this.key} already exists`);
    State.variables.roominstance[this.key] = this;

    State.variables.roomlist.resetCache();
  }

  resetCache(): void {
    this[CACHED_SKILL_BONUSES] = undefined;
    State.variables.roomlist.resetCache();
  }

  getRepMacro() {
    return "roominstancecard";
  }

  rep(): string {
    return setup.repMessage(this);
  }

  repFull(): string {
    return (
      this.getTemplate().repTags() +
      setup.repMessage(this) +
      ` (${this.getTemplate().getWidth()} x ${this.getTemplate().getHeight()})`
    );
  }

  delete() {
    delete State.variables.roominstance[this.key];
    State.variables.roomlist.resetCache();
  }

  getSkillBonuses(): number[] {
    if (!this[CACHED_SKILL_BONUSES]) {
      // compute the skill bonus first.
      if (
        !State.variables.fort.player.isHasBuilding(
          setup.buildingtemplate.landscapingoffice,
        )
      ) {
        this[CACHED_SKILL_BONUSES] = Array(setup.skill.length).fill(0);
      } else if (!this.isPlaced()) {
        this[CACHED_SKILL_BONUSES] = Array(setup.skill.length).fill(0);
      } else {
        this[CACHED_SKILL_BONUSES] = State.variables.fortgrid.getAffectingRooms(
          this,
          this.getLocation(),
        ).skill_bonuses;
      }
    }
    return this[CACHED_SKILL_BONUSES];
  }

  getTemplate(): RoomTemplate {
    return setup.roomtemplate[this.template_key];
  }

  //getOwners(): Unit[] {
  //  return this.owner_keys?.map((key) => State.variables.unit[key]) ?? [];
  //}

  getName(): string {
    return this.getTemplate().getName();
  }

  isPlaced(): boolean {
    return !!this.location;
  }

  getLocation(): TileLocation {
    return this.location!;
  }

  /**
   * Don't call directly. Use fortgrid.relocateRoom.
   */
  _relocate(location_top_left: TileLocation | null | undefined) {
    if (
      location_top_left &&
      State.variables.fortgrid.isRoomOutOfBounds(this, location_top_left)
    ) {
      throw new Error(
        `New room placement for ${this.getName()} is out of bounds!`,
      );
    }

    this.location = location_top_left ?? undefined;
    delete this.seed;

    this.resetCache();
  }

  getWidth(): number {
    if (this.getClockwiseRotations() % 2) {
      return this.getTemplate().getHeight();
    } else {
      return this.getTemplate().getWidth();
    }
  }

  getHeight(): number {
    if (this.getClockwiseRotations() % 2) {
      return this.getTemplate().getWidth();
    } else {
      return this.getTemplate().getHeight();
    }
  }

  getClockwiseRotations(): Rotation {
    return this.clockwise_rotations ?? 0;
  }

  rotate90anticlockwise() {
    if (this.getTemplate().isFixed())
      throw new Error(`Cannot rotate fixed room: ${this.key}`);
    this.clockwise_rotations =
      ((((this.clockwise_rotations ?? 0) + 3) % 4) as Rotation) || undefined;
  }

  rotate90clockwise() {
    if (this.getTemplate().isFixed())
      throw new Error(`Cannot rotate fixed room: ${this.key}`);
    this.clockwise_rotations =
      ((((this.clockwise_rotations ?? 0) + 1) % 4) as Rotation) || undefined;
  }

  rotate180() {
    if (this.getTemplate().isFixed())
      throw new Error(`Cannot rotate fixed room: ${this.key}`);
    this.clockwise_rotations =
      ((((this.clockwise_rotations ?? 0) + 2) % 4) as Rotation) || undefined;
  }

  setRotation(rotation: Rotation) {
    this.clockwise_rotations = rotation || undefined;
  }

  resetRotation() {
    this.clockwise_rotations = undefined;
  }

  /**
   * Get a random number for this event that remains the same always.
   */
  getSeed() {
    if (this.seed) return this.seed;
    this.seed = 1 + Math.floor(Math.random() * 999999997);
    return this.seed;
  }

  getImageObject(): ImageObject | null {
    const images = this.getTemplate().getImageList();
    if (images.length) {
      return images[this.getSeed() % images.length];
    } else {
      return null;
    }
  }

  isShouldRotateImage(): boolean {
    const image_object = this.getImageObject();
    return (
      !image_object ||
      (!image_object.info.directional && !image_object.info.norotate)
    );
  }

  isWalled(): boolean {
    const image_object = this.getImageObject();
    return !image_object || !image_object.info.nowalls;
  }

  static getDirectionalImagePath(
    image_object: ImageObject,
    rotations: Rotation,
  ): string {
    const splitted = image_object.path.split(".");
    const extension = splitted[splitted.length - 1];
    splitted.pop();
    const name = splitted.join(".");
    let direction;
    if (rotations == 0) {
      direction = "s";
    } else if (rotations == 1) {
      direction = "w";
    } else if (rotations == 2) {
      direction = "n";
    } else {
      direction = "e";
    }
    return `${name}-${direction}.${extension}`;
  }

  getImage(): string {
    const image_object = this.getImageObject();
    if (image_object) {
      if (image_object.info.directional) {
        return setup.RoomInstance.getDirectionalImagePath(
          image_object,
          this.getClockwiseRotations(),
        );
      } else {
        return image_object.path;
      }
    }
    return `img/room/noimage.png`;
  }

  getEntranceLocation(location_top_left?: TileLocation): TileLocation {
    const rotations = this.getClockwiseRotations();

    if (!location_top_left) {
      location_top_left = this.getLocation();
      if (!location_top_left) {
        throw new Error(`Unknown location for getting entrance location`);
      }
    }

    const door_col = this.getTemplate().getDoorColumn()!;
    if (rotations == 0) {
      // bottom, follow door column
      return {
        row: location_top_left.row + this.getHeight(),
        col: location_top_left.col + door_col,
      };
    } else if (rotations == 1) {
      // left side, row is door column
      return {
        row: location_top_left.row + door_col,
        col: location_top_left.col - 1,
      };
    } else if (rotations == 2) {
      // up, door is opposite
      return {
        row: location_top_left.row - 1,
        col: location_top_left.col + this.getWidth() - door_col - 1,
      };
    } else {
      // right
      return {
        row: location_top_left.row + this.getHeight() - door_col - 1,
        col: location_top_left.col + this.getWidth(),
      };
    }
  }
}
