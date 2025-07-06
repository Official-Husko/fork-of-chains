import { } from "./tag_building"

setup.TAG_ROOM = {
  /* =========== */
  /* Hidden tags */
  /* =========== */
  hidename: {
    type: 'hidden',
    title: 'Hide name',
    description: 'Hide name',
    hide: true,
  },

  hideskill: {
    type: 'hidden',
    title: 'Hide skills',
    description: 'Hide skills',
    hide: true,
  },

  /* =========== */
  /* Differentiating tags */
  /* =========== */
  indoors: {
    type: 'location',
    title: 'Indoors',
    description: 'Must be build indoors',
  },

  outdoors: {
    type: 'location',
    title: 'Indoors',
    description: 'Must be build outdoors',
  },

  nodoor: {
    type: 'unique',
    title: 'Object',
    description: 'Not a room and does not have an entrance',
  },

  passable: {
    type: 'unique',
    title: 'Passable',
    description: 'Act like an empty space and can be a part of a path',
  },

  optional: {
    type: 'unique',
    title: 'Optional',
    description: 'Can be optionally removed from your fort',
  },

  fixed: {
    type: 'unique',
    title: 'Fixed',
    description: 'Cannot be moved',
  },
}

// attach type tags from building tags
for (const building_tag in setup.BUILDING_TAGS) {
  const tag_obj = setup.BUILDING_TAGS[building_tag]
  if (tag_obj.type == 'type') {
    if (building_tag in setup.TAG_ROOM) {
      throw new Error(`Duplicated room/building tag: ${building_tag}`)
    }
    setup.TAG_ROOM[building_tag] = tag_obj
  }
}
