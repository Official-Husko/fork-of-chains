
setup.QUESTTAGS = {
  /* =========== */
  /* Fetish tags */
  /* =========== */

  maleonly: {
    type: 'fetish',
    hide: true,
    title: 'Male unit only',
    description: 'Content that only gives male slaves / male slavers',
  },
  femaleonly: {
    type: 'fetish',
    hide: true,
    title: 'Female unit only',
    description: 'Content that only gives female slaves / female slavers',
  },
  furry: {
    type: 'fetish',
    hide: true,
    title: 'Furry',
    description: 'Heavy emphasis on furry species such as werewolves and tigerkin. This does not completely ban all furry content -- just those that feature furries in a sexual way. Neko (cat ears but otherwise human) are not considered furries',
  },
  scaley: {
    type: 'fetish',
    hide: true,
    title: 'Scaley',
    description: 'Heavy emphasis on scaley species such as lizardkin and dragonkin. This does not completely ban all scaley content -- just those that feature scalies in a sexual way',
  },
  transformation: {
    type: 'fetish',
    hide: true,
    title: 'Transformation',
    description: 'Heavy emphasis on physical and bodily transformation',
  },
  watersport: {
    type: 'fetish',
    hide: true,
    title: 'Watersport',
    description: 'Heavy emphasis on the consumption of urine. Note that banning watersport does not ban watersport slave training, but will instead censor all its descriptions. There are only few of this content in the game. Extreme versions of this fetish are not included in the game, due to legal reasons',
  },
  monstersex: {
    type: 'fetish',
    hide: true,
    title: 'Monster sex',
    description: 'Heavy emphasis on sexual intercourse with monsters and other non-humanlikes. There are only an extremely limited amount of this content in the game. Bestiality is not included, due to legal reasons',
  },
  gore: {
    type: 'fetish',
    hide: true,
    title: 'Blood',
    description: 'Containing description of blood and mild violence. The game does not contain excessive violence',
  },
  breeding: {
    type: 'fetish',
    hide: true,
    title: 'Breeding',
    description: 'Heavy emphasis procreating. Note that playable units cannot become pregnant. Instead, some quests may contain brief mentions of pregnancy and/or breeding. There are only an extremely limited amount of this content in the game',
  },

  /* =========== */
  /* Region tags */
  /* =========== */
  vale: {
    type: 'region',
    hide: true,
    title: 'Northern Vale',
    description: 'Located in the <<lore region_vale>>',
  },
  forest: {
    type: 'region',
    hide: true,
    title: 'Western Forest',
    description: 'Located in the <<lore region_forest>>',
  },
  city: {
    type: 'region',
    hide: true,
    title: 'City of Lucgate',
    description: 'Located in the <<lore region_city>>',
  },
  deep: {
    type: 'region',
    hide: true,
    title: 'Deeprealm',
    description: 'Located in the <<lore region_deep>>',
  },
  desert: {
    type: 'region',
    hide: true,
    title: 'Eastern Desert',
    description: 'Located in the <<lore region_desert>>',
  },
  sea: {
    type: 'region',
    hide: true,
    title: 'Southern Seas',
    description: 'Located in the <<lore region_sea>>',
  },
  fort: {
    type: 'region',
    hide: true,
    title: 'Fort',
    description: 'Located in your fort',
  },

  /* =============== */
  /* Quest rarity tags */
  /* =============== */
  rare: {
    type: 'rarity',
    title: 'Rare',
    description: 'Does not appear often',
  },
  legendary: {
    type: 'rarity',
    title: 'Extremely Rare',
    description: 'An extremely rare opportunity',
  },
  special: {
    type: 'rarity',
    title: 'Special',
    description: 'Needs your immediate attention'
  },

  /* =============== */
  /* Quest type tags */
  /* =============== */
  veteran: {
    type: 'type',
    title: 'Veteran',
    description: 'A quest that is only scouted after you build the Veteran Hall'
  },
  prep: {
    type: 'type',
    title: 'Extra preparation',
    description: 'Requires specialized units to do'
  },
  contact: {
    type: 'type',
    title: 'Repeat',
    description: 'Repeatable quest given by one of your contacts'
  },

  /* =========== */
  /* Reward tags */
  /* =========== */
  danger: {
    type: 'reward',
    title: 'Danger',
    description: 'Highly dangerous quest'
  },
  money: {
    type: 'reward',
    title: 'Money',
    description: 'Probably rewards money'
  },
  item: {
    type: 'reward',
    title: 'Item',
    description: 'Probably gives you some kind of loot'
  },
  quest: {
    type: 'reward',
    title: 'Quest',
    description: 'Probably gives you quest leads'
  },
  unit: {
    type: 'reward',
    title: 'Unit',
    description: 'Probably gives you slaves or slavers'
  },
  order: {
    type: 'reward',
    title: 'Order',
    description: 'Probably allows you to sell your slaves'
  },
  favor: {
    type: 'reward',
    title: 'Favor',
    description: 'Probably gains you favor with other companies'
  },
  ire: {
    type: 'reward',
    title: 'Ire',
    description: 'Probably makes your company less popular with some other companies'
  },
  trait: {
    type: 'reward',
    title: 'Improvement',
    description: 'Probably alters your unit'
  },
  upgrade: {
    type: 'reward',
    title: 'Upgrade',
    description: 'Probably improves your fort'
  },
  unknown: {
    type: 'reward',
    title: '???',
    description: 'Who knows what else this quest might reward...'
  },

  /* =========== */
  /* Hidden tags */
  /* =========== */
  playercapture: {
    type: 'hidden',
    hide: true,
    title: 'Events for when the player is captured',
    description: 'A random event with this tag will be chosen when the player is captured',
  }
}


setup.QUESTTAGS_DEFAULT_PANORAMA = 'questcardfort'

setup.QUESTTAGS_PANORAMA = {
  vale: 'questcardvale',
  forest: 'questcardforest',
  city: 'questcardcity',
  deep: 'questcarddeep',
  desert: 'questcarddesert',
  sea: 'questcardsea',
  fort: 'questcardfort',
}

setup.QUESTTAGS_BORDER = {
  rare: 'questcardborder_rare',
  legendary: 'questcardborder_legendary',
  special: 'questcardborder_special',
}
