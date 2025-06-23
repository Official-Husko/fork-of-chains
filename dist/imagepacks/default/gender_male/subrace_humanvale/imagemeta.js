(function () {

  /* The following is list of direct subdirectories. */
  UNITIMAGE_LOAD_FURTHER = ["bg_knight", "bg_raider", "bg_wildman", "bg_soldier",
    "bg_hunter", "bg_pirate", "bg_mercenary",
    "bg_farmer", "bg_foodworker", "bg_slave", "bg_slaver", "bg_thug",
    "bg_mystic", "bg_noble", "bg_adventurer", "bg_monk", "bg_healer", "bg_royal",
    "bg_entertainer", "bg_woodsman", "bg_assassin", "bg_mist",
  ]


  UNITIMAGE_CREDITS = {
    1: {
      title: "Black Winter Day",
      artist: "OkenKrow",
      url: "https://www.deviantart.com/okenkrow/art/Black-Winter-Day-578503556",
      license: "CC-BY-NC-ND 3.0",
    },
    3: {
      title: "Gladiator Def",
      artist: "Grimdor",
      url: "https://www.deviantart.com/grimdor/art/Gladiator-Def-648311127",
      license: "CC-BY-NC-ND 3.0",
    },
    4: {
      title: "The Warrior of The Mountain",
      artist: "Noxypia",
      url: "https://www.deviantart.com/noxypia/art/The-Warrior-of-The-Mountain-281613883",
      license: "CC-BY-NC-ND 3.0",
    },
    5: {
      title: "Wolfman",
      artist: "Noxypia",
      url: "https://www.deviantart.com/noxypia/art/Wolfman-297753798",
      license: "CC-BY-NC-ND 3.0",
    },
    6: {
      title: "The big guy from Dragon Ball GT episode 41",
      artist: "leomon32",
      url: "https://www.deviantart.com/leomon32/art/The-big-guy-from-Dragon-Ball-GT-episode-41-715878054",
      license: "CC-BY-NC-ND 3.0",
    },
    8: {
      title: "Druid",
      artist: "captdiablo",
      url: "https://www.deviantart.com/captdiablo/art/Druid-856767279",
      license: "CC-BY-NC-ND 3.0",
    },
    9: {
      title: "Rogue: counterfeit mage",
      artist: "operion",
      url: "https://www.deviantart.com/operion/art/Rogue-counterfeit-mage-454404642",
      license: "CC-BY-NC-ND 3.0",
    },
    10: {
      title: "Hercules: Guardian Of Olympus",
      artist: "nickhuddlestonartist",
      url: "https://www.deviantart.com/nickhuddlestonartist/art/Hercules-Guardian-Of-Olympus-687272278",
      license: "CC-BY-NC-ND 3.0",
    },
    11: {
      title: "Leobane - Robert Small",
      artist: "leomon32",
      url: "https://www.deviantart.com/leomon32/art/Leobane-Robert-Small-774345243",
      license: "CC-BY-NC-ND 3.0",
    },
    12: {
      title: "Male In The Forest",
      artist: "poomkup",
      url: "https://www.deviantart.com/poomkup/art/Male-In-The-Forest-628508688",
      license: "CC-BY-NC-SA 3.0",
      extra: "cropped",
    },
    13: {
      title: "CM: Terrorwolf666",
      artist: "Arcan-Anzas",
      url: "https://www.deviantart.com/arcan-anzas/art/CM-Terrorwolf666-658906177",
      license: "CC-BY-NC-ND 3.0",
    },
    14: {
      title: "Nimrod",
      artist: "Dopaprime",
      url: "https://www.deviantart.com/dopaprime/art/Nimrod-521159899",
      license: "CC-BY-NC-ND 3.0",
    },
    19: {
      title: "Garruk Wildspeaker",
      artist: "foxinsoxx",
      url: "https://www.deviantart.com/foxinsoxx/art/Garruk-Wildspeaker-517565993",
      license: "CC-BY-NC-ND 3.0",
    },
    20: {
      title: "Le guerrier des Steppes [Warrior of Steppe ]",
      artist: "Poticceli",
      url: "https://www.deviantart.com/poticceli/art/Le-guerrier-des-Steppes-Warrior-of-Steppe-797137595",
      license: "CC-BY-NC-ND 3.0",
    },
    21: {
      title: "Commission Cade",
      artist: "Ioana-Muresan",
      url: "https://www.deviantart.com/ioana-muresan/art/Commission-Cade-848426462",
      license: "CC-BY-NC-ND 3.0",
    },
    22: {
      title: "Pacquiao!!",
      artist: "RAPHTOR",
      url: "https://www.deviantart.com/raphtor/art/Pacquiao-416029704",
      license: "CC-BY-NC-ND 3.0",
    },
    23: {
      title: "Vagabond Wolverine",
      artist: "sXeven",
      url: "https://www.deviantart.com/sxeven/art/Vagabond-Wolverine-856161220",
      license: "CC-BY-NC-ND 3.0",
    },
    24: {
      title: "Viking",
      artist: "leomon32",
      url: "https://www.deviantart.com/leomon32/art/Viking-489835369",
      license: "CC-BY-NC-SA 3.0",
      extra: "cropped",
    },
    25: {
      title: "Bernardo Carpio +rhimes1999 version+",
      artist: "leomon32",
      url: "https://www.deviantart.com/leomon32/art/Bernardo-Carpio-rhimes1999-version-606792078",
      license: "CC-BY-NC-SA 3.0",
      extra: "cropped",
    },
    26: {
      title: "Warrior",
      artist: "NathanParkArt",
      url: "https://www.deviantart.com/nathanparkart/art/Warrior-531539524",
      license: "CC-BY-NC-ND 3.0",
    },
    27: {
      title: "Night Patrol",
      artist: "NathanParkArt",
      url: "https://www.deviantart.com/nathanparkart/art/Night-Patrol-444614845",
      license: "CC-BY-NC-ND 3.0",
    },
    28: {
      title: "Mace Man",
      artist: "NathanParkArt",
      url: "https://www.deviantart.com/nathanparkart/art/Mace-Man-410565016",
      license: "CC-BY-NC-ND 3.0",
    },
    29: {
      title: "Commi - Adahy",
      artist: "shinjyu",
      url: "https://www.deviantart.com/shinjyu/art/Commi-Adahy-276083635",
      license: "CC-BY-NC-ND 3.0",
    },
    30: {
      title: "Red Snow",
      artist: "Zeilyan",
      url: "https://www.deviantart.com/zeilyan/art/Red-Snow-621825886",
      license: "CC-BY-NC-ND 3.0",
    },
  }
}());
