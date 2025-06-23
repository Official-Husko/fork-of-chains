(function () {

  /* The following is list of direct subdirectories. */
  UNITIMAGE_LOAD_FURTHER = ["bg_knight", "bg_wildman",
    "bg_apprentice", "bg_farmer", "bg_hunter", "bg_priest", "bg_soldier", "bg_woodsman",
    "bg_mystic", "bg_assassin", "bg_scholar", "bg_adventurer", "bg_maid",
    "bg_thief", "bg_artist", "bg_informer", "bg_noble", "bg_courtesan",
    "bg_mercenary", "bg_mist", "bg_entertainer", "bg_foodworker", "bg_thug",
  ]


  /* Image credit information. */
  UNITIMAGE_CREDITS = {
    1: {
      title: "Share a cup of hot cocoa with Haurchefant",
      artist: "Athena-Erocith",
      url: "https://www.deviantart.com/athena-erocith/art/Share-a-cup-of-hot-cocoa-with-Haurchefant-570536424",
      license: "CC-BY-NC-ND 3.0",
    },
    2: {
      title: "Herm",
      artist: "DocWendigo",
      url: "https://www.deviantart.com/docwendigo/art/Herm-649946058",
      license: "CC-BY-NC 3.0",
      extra: "cropped",
    },
    3: {
      title: "Alphinaud (Final Fantasy XIV)",
      artist: "EmmaNettip",
      url: "https://www.deviantart.com/emmanettip/art/Alphinaud-Final-Fantasy-XIV-783272814",
      license: "CC-BY-NC-ND 3.0",
    },
    4: {
      title: "Dark Elf",
      artist: "Noxypia",
      url: "https://www.deviantart.com/noxypia/art/Dark-Elf-371941105",
      license: "CC-BY-NC-ND 3.0",
    },
    5: {
      title: "Commission-ElindielForeststar-Elindiel(06-13).",
      artist: "artAlais",
      url: "https://www.deviantart.com/artalais/art/Commission-ElindielForeststar-Elindiel-06-13-379210859",
      license: "CC-BY-NC-ND 3.0",
    },
    6: {
      title: "Yuan-ti Warlock",
      artist: "captdiablo",
      url: "https://www.deviantart.com/captdiablo/art/Yuan-ti-Warlock-850087881",
      license: "CC-BY-NC-ND 3.0",
    },
    7: {
      title: "Commission-ElindielForeststar-Camillus(06-13)",
      artist: "artAlais",
      url: "https://www.deviantart.com/artalais/art/Commission-ElindielForeststar-Camillus-06-13-379210838",
      license: "CC-BY-NC-ND 3.0",
    },
    8: {
      title: "[C] Have you ever seen autumn leaves in the sun?",
      artist: "Lidiash",
      url: "https://www.deviantart.com/lidiash/art/C-Have-you-ever-seen-autumn-leaves-in-the-sun-809000966",
      license: "CC-BY-NC-ND 3.0",
    },
    9: {
      title: "[C] Ba of Ra",
      artist: "Lidiash",
      url: "https://www.deviantart.com/lidiash/art/C-Ba-of-Ra-806149309",
      license: "CC-BY-NC-ND 3.0",
    },
    10: {
      title: "[C] Autumn feels",
      artist: "Lidiash",
      url: "https://www.deviantart.com/lidiash/art/C-Autumn-feels-804662412",
      license: "CC-BY-NC-ND 3.0",
    },
    11: {
      title: "[G] Siegfried",
      artist: "Lidiash",
      url: "https://www.deviantart.com/lidiash/art/G-Siegfried-804947374",
      license: "CC-BY-NC-ND 3.0",
    },
    12: {
      title: "[T] Hello, kitty / Hi, elf",
      artist: "Lidiash",
      url: "https://www.deviantart.com/lidiash/art/T-Hello-kitty-Hi-elf-771477151",
      license: "CC-BY-NC-ND 3.0",
    },
    13: {
      title: "Dark Elezen",
      artist: "Poticceli",
      url: "https://www.deviantart.com/poticceli/art/Dark-Elezen-858502067",
      license: "CC-BY-NC-ND 3.0",
    },
    14: {
      title: "Alexois - Castelvania Fan art",
      artist: "Poticceli",
      url: "https://www.deviantart.com/poticceli/art/Alexois-Castelvania-Fan-art-789326242",
      license: "CC-BY-NC-ND 3.0",
    },
    15: {
      title: "Dracoice commission 2/2",
      artist: "Grypwolf",
      url: "https://www.deviantart.com/grypwolf/art/Dracoice-commission-2-2-563729612",
      license: "CC-BY-NC-ND 3.0",
    },
    16: {
      title: "Commission in the woods",
      artist: "Ioana-Muresan",
      url: "https://www.deviantart.com/ioana-muresan/art/Commission-in-the-woods-835020656",
      license: "CC-BY-NC-ND 3.0",
    },
    17: {
      title: "What if...",
      artist: "DarkraArt",
      url: "https://www.newgrounds.com/art/view/darkraart/what-if",
      license: "CC-BY-NC-ND 3.0",
    },
    18: {
      title: "Fastril Bloodwing",
      artist: "DarkraArt",
      url: "https://www.newgrounds.com/art/view/darkraart/fastril-bloodwing",
      license: "CC-BY-NC-ND 3.0",
    },
    19: {
      title: "Rogue wood elf",
      artist: "rubidotrinh",
      url: "https://www.deviantart.com/rubidotrinh/art/Rogue-wood-elf-751069729",
      license: "CC-BY-NC-ND 3.0",
    },
    20: {
      title: "Alarthan Sunbreaker",
      artist: "DarkraArt",
      url: "https://www.newgrounds.com/art/view/darkraart/alarthan-sunbreaker",
      license: "CC-BY-NC-ND 3.0",
    },
    21: {
      title: "Drow Commission for Shelbyisanerd on Twitter!",
      artist: "AlainaDorsett",
      url: "https://www.deviantart.com/alainadorsett/art/Drow-Commission-for-Shelbyisanerd-on-Twitter-859412487",
      license: "CC-BY-NC-ND 3.0",
    },
    22: {
      title: "Haurchefant de Fortemps",
      artist: "Athena-Erocith",
      url: "https://www.deviantart.com/athena-erocith/art/Haurchefant-de-Fortemps-629017371",
      license: "CC-BY-NC-ND 3.0",
    },
    23: {
      title: "'The last goodbye to you, Nidhogg.'",
      artist: "Athena-Erocith",
      url: "https://www.deviantart.com/athena-erocith/art/The-last-goodbye-to-you-Nidhogg-707347491",
      license: "CC-BY-NC-ND 3.0",
    },
    24: {
      title: "[FFXIV] Teatime with Aymeric",
      artist: "Athena-Erocith",
      url: "https://www.deviantart.com/athena-erocith/art/FFXIV-Teatime-with-Aymeric-809901870",
      license: "CC-BY-NC-ND 3.0",
    },
    25: {
      title: "I want you to read my elder scroll.",
      artist: "EllirhShaan",
      url: "https://www.deviantart.com/ellirhshaan/art/I-want-you-to-read-my-elder-scroll-879102571",
      license: "CC-BY-NC-ND 3.0",
    },
    27: {
      title: "Ser Aymeric de Borel",
      artist: "Athena-Erocith",
      url: "https://www.deviantart.com/athena-erocith/art/Ser-Aymeric-de-Borel-634983789",
      license: "CC-BY-NC-ND 3.0",
    },
    28: {
      title: "LON_surrounding ur foe",
      artist: "chrisnfy85",
      url: "https://www.deviantart.com/chrisnfy85/art/LON-surrounding-ur-foe-260583217",
      license: "CC-BY-NC-ND 3.0",
    },
    29: {
      title: "WoW - Marax Portrait",
      artist: "OkenKrow",
      url: "https://www.deviantart.com/okenkrow/art/WoW-Marax-Portrait-717923054",
      license: "CC-BY-NC-ND 3.0",
    },
  }

}());
