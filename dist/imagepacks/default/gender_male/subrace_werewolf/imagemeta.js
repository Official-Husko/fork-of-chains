(function () {

  /* The following is list of direct subdirectories. */
  UNITIMAGE_LOAD_FURTHER = ["bg_priest", "bg_mercenary", "bg_knight", "bg_mythical",
    "bg_foodworker", "bg_hunter", "bg_pirate",
    "bg_raider", "bg_slaver", "bg_thief", "bg_thug", "bg_woodsman",
    "bg_assassin", "bg_adventurer", "bg_monk", "bg_metalworker",
    "bg_clerk", "bg_healer", "bg_noble", "bg_courtesan", "bg_seaman",
    "bg_mystic",
  ]


  UNITIMAGE_CREDITS = {
    1: {
      title: "Werewolf",
      artist: "sandara",
      url: "https://www.deviantart.com/sandara/art/Werewolf-363399408",
      license: "CC-BY-NC-SA 3.0",
    },
    2: {
      title: "Burgenwehr hospitality",
      artist: "ThemeFinland",
      url: "https://www.deviantart.com/themefinland/art/Burgenwehr-hospitality-788236374",
      license: "CC-BY-NC-SA 3.0",
      extra: "cropped",
    },
    3: {
      title: "Cult of the old moon",
      artist: "ThemeFinland",
      url: "https://www.deviantart.com/themefinland/art/Cult-of-the-old-moon-763021867",
      license: "CC-BY-NC-SA 3.0",
      extra: "cropped",
    },
    5: {
      title: "Brand New Animal",
      artist: "SiplickIshida",
      url: "https://www.furaffinity.net/view/35584793/",
      license: "CC-BY-NC-SA 3.0",
    },
    7: {
      title: "Black Claw",
      artist: "Noxypia",
      url: "https://www.deviantart.com/noxypia/art/Black-Claw-289530425",
      license: "CC-BY-NC-ND 3.0",
    },
    8: {
      title: "Werewolf",
      artist: "jdtmart",
      url: "https://www.deviantart.com/jdtmart/art/Werewolf-618264168",
      license: "CC-BY-NC-ND 3.0",
    },
    9: {
      title: "Red moon Werewolf",
      artist: "plamen5rov",
      url: "https://www.deviantart.com/plamen5rov/art/Red-moon-Werewolf-763670530",
      license: "CC-BY-NC-ND 3.0",
    },
    11: {
      title: "It Will Heal",
      artist: "AlsaresLynx",
      url: "https://www.deviantart.com/alsareslynx/art/It-Will-Heal-732566201",
      license: "CC-BY-NC-ND 3.0",
    },
    13: {
      title: "koya from morenatsu",
      artist: "PhySen",
      url: "https://www.deviantart.com/physen/art/kouya-from-morenatsu-853019696",
      license: "CC-BY 3.0",
    },
    14: {
      title: "Horkeu kamui",
      artist: "PhySen",
      url: "https://www.deviantart.com/physen/art/Horkeu-kamui-851997101",
      license: "CC-BY 3.0",
    },
    15: {
      title: "Re:zero",
      artist: "PhySen",
      url: "https://www.deviantart.com/physen/art/Re-zero-791142117",
      license: "CC-BY 3.0",
    },
    16: {
      title: "Werewolves of Burgenwehr",
      artist: "ThemeFinland",
      url: "https://www.deviantart.com/themefinland/art/Werewolves-of-Burgenwehr-658827730",
      license: "CC-BY-NC-SA 3.0",
      extra: "cropped",
    },
    17: {
      title: "Northern wolf folk",
      artist: "ThemeFinland",
      url: "https://www.deviantart.com/themefinland/art/Northern-wolf-folk-629499353",
      license: "CC-BY-NC-SA 3.0",
      extra: "cropped",
    },
    18: {
      title: "Glacier elementas",
      artist: "ThemeFinland",
      url: "https://www.deviantart.com/themefinland/art/Glacier-elementas-536627745",
      license: "CC-BY-NC-SA 3.0",
    },
    19: {
      title: "Juanjo",
      artist: "SiplickIshida",
      url: "https://www.furaffinity.net/view/37017327/",
      license: "CC-BY-NC-ND 3.0",
    },
    20: {
      title: "SonicFox",
      artist: "SiplickIshida",
      url: "https://www.furaffinity.net/view/29649138/",
      license: "CC-BY-NC-ND 3.0",
    },
    21: {
      title: "Wolf King",
      artist: "adrianriom",
      url: "https://www.deviantart.com/adrianriom/art/Wolf-King-544211817",
      license: "CC-BY-NC-ND 3.0",
    },
    23: {
      title: "Viking Werewolf",
      artist: "XxFenrierxX",
      url: "https://www.deviantart.com/xxfenrierxx/art/Viking-Werewolf-788477391",
      license: "CC-BY-NC-ND 3.0",
    },
    24: {
      title: "Wolf killer",
      artist: "blewzen",
      url: "https://www.deviantart.com/blewzen/art/Wolf-killer-450865858",
      license: "CC-BY-NC-ND 3.0",
    },
    26: {
      title: "Anubis and Bastet :3",
      artist: "TheFearMaster",
      url: "https://www.deviantart.com/thefearmaster/art/Anubis-and-Bastet-3-822235822",
      license: "CC-BY-NC-ND 3.0",
    },
    27: {
      title: "Bouda",
      artist: "jdtmart",
      url: "https://www.deviantart.com/jdtmart/art/Bouda-469097945",
      license: "CC-BY-NC-ND 3.0",
    },
    28: {
      title: "Worgen",
      artist: "operion",
      url: "https://www.deviantart.com/operion/art/Worgen-586184293",
      license: "CC-BY-NC-ND 3.0",
    },
    29: {
      title: "Unclear Tension",
      artist: "NitaoART",
      url: "https://www.deviantart.com/nitaoart/art/Unclear-Tension-855135444",
      license: "CC-BY-NC-SA 3.0",
    },
    30: {
      title: "sharingan",
      artist: "takahirosi",
      url: "https://www.deviantart.com/takahirosi/art/sharingan-763911973",
      license: "CC-BY-NC-ND 3.0",
    },
  }

}());
