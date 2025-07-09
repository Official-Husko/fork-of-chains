// All room-related constants for the Twine SugarCube project.
// This module attaches values to the global `setup` object.

export function registerRoomConstants(setup: any) {
  /* max skill that can be boosted from rooms */
  setup.ROOM_MAX_SKILL_BOOST = 12;

  /* if all adjancey bonus is full, grant this many stats */
  setup.ROOM_BONUS_SKILL_BONUS_DEFAULT = 10;

  /* bonus skill from decorations sub building */
  setup.ROOM_DECORATION_BONUS = 0.5;
  /* bonus skill from decorations main building */
  setup.ROOM_DECORATION_BONUS_MAIN = 2;

  /**
   * width of the fort grid
   */
  setup.FORTGRID_WIDTH = 24;

  /**
   * Extra amount of tiles multiplied by total needed to build all improvements.
   */
  setup.FORTGRID_EXTRA_TILE_MULTIPLIER = 1.25;

  /**
   * These two will be computed later
   */
  setup.MAX_TILE_INSIDE = 0;
  setup.MAX_TILE_OUTSIDE = 0;

  /**
   * initial heights of the indoor area of the fort, including the entrance "wall"
   */
  setup.FORTGRID_INDOOR_HEIGHT_INIT = 4;
  /**
   * initial heights of the outdoor area of the fort, excluding the entrance "wall"
   */
  setup.FORTGRID_OUTDOOR_HEIGHT_INIT = 2;

  /**
   * Width of a single tile in px by default. Will actually be scaled on smaller screens
   */
  setup.FORTGRID_TILE_SIZE = 32;

  /**
   * Price to relocate a building per tile. Charged when you remove a building.
   */
  setup.FORTGRID_RELOCATE_PRICE_PER_TILE = 20;

  /**
   * If the entrance between two buildings is within this distance, they are considered near.
   */
  setup.FORTGRID_NEAR_DISTANCE = 10;
}
