(function () {

  /* The following is list of direct subdirectories. */
  UNITIMAGE_LOAD_FURTHER = ["bg_mystic", "bg_apprentice", "bg_hunter", "bg_woodsman",
    "bg_mercenary", "bg_royal", "bg_farmer", "bg_priest", "bg_soldier", "bg_noble", "bg_assassin",
    "bg_adventurer", "bg_scholar", "bg_artist", "bg_maid", "bg_courtesan", "bg_informer", "bg_foodworker",
    "bg_monk", "bg_whore", "bg_clerk", "bg_wildman", "bg_metalworker", "bg_slave",
  ]


  UNITIMAGE_CREDITS = {
    1: {
      title: "Kileanna",
      artist: "macarious",
      url: "https://www.deviantart.com/macarious/art/Kileanna-774910943",
      license: "CC-BY-NC-ND 3.0",
    },
    2: {
      title: "TS Sniper",
      artist: "InstantIP",
      url: "https://www.deviantart.com/instantip/art/TS-Sniper-486525612",
      license: "CC-BY-NC-ND 3.0",
    },
    3: {
      title: "Zyra",
      artist: "raikoart",
      url: "https://www.deviantart.com/raikoart/art/Zyra-664070634",
      license: "CC-BY-NC-ND 3.0",
    },
    4: {
      title: "Spirit Blossom Riven",
      artist: "BADCOMPZERO",
      url: "https://www.deviantart.com/badcompzero/art/Spirit-Blossom-Riven-851818552",
      license: "CC-BY-NC-ND 3.0",
    },
    5: {
      title: "Forest Queen",
      artist: "jdtmart",
      url: "https://www.deviantart.com/jdtmart/art/Forest-Queen-447764655",
      license: "CC-BY-NC-ND 3.0",
    },
    6: {
      title: "Elf Warrior v 1",
      artist: "jdtmart",
      url: "https://www.deviantart.com/jdtmart/art/Elf-Warrior-v-1-387866573",
      license: "CC-BY-NC-ND 3.0",
    },
    7: {
      title: "Commission: High Elf",
      artist: "artAlais",
      url: "https://www.deviantart.com/artalais/art/Commission-High-Elf-861656382",
      license: "CC-BY-NC-ND 3.0",
    },
    8: {
      title: "Lenore 02",
      artist: "DarkraArt",
      url: "https://www.newgrounds.com/art/view/darkraart/lenore-02",
      license: "CC-BY-NC-ND 3.0",
    },
    9: {
      title: "Shinobu Kocho",
      artist: "Liang-Xing",
      url: "https://www.deviantart.com/liang-xing/art/Shinobu-Kocho-827488919",
      license: "CC-BY-NC-ND 3.0",
    },
    10: {
      title: "Dryad",
      artist: "captdiablo",
      url: "https://www.deviantart.com/captdiablo/art/Dryad-657374666",
      license: "CC-BY-NC-ND 3.0",
    },
    11: {
      title: "Tyrande (BFA)",
      artist: "AyyaSAP",
      url: "https://www.deviantart.com/ayyasap/art/Tyrande-BFA-778649415",
      license: "CC-BY-NC-ND 3.0",
    },
    12: {
      title: "Lulusa NSFW",
      artist: "DarkraArt",
      url: "https://www.newgrounds.com/art/view/darkraart/lulusa-nsfw-2",
      license: "CC-BY-NC-ND 3.0",
    },
    13: {
      title: "Female warrior",
      artist: "fearpredator",
      url: "https://www.deviantart.com/fearpredator/art/Female-warrior-251125018",
      license: "CC-BY-ND 3.0",
    },
    14: {
      title: "Kelatir",
      artist: "DarkraArt",
      url: "https://www.newgrounds.com/art/view/darkraart/kelatir",
      license: "CC-BY-NC-ND 3.0",
    },
    15: {
      title: "Valeera Sanguinar by AdrianWolve",
      artist: "AdrianWolve",
      url: "https://www.deviantart.com/adrianwolve/art/Valeera-Sanguinar-by-AdrianWolve-555904714",
      license: "CC-BY-NC-ND 3.0",
    },
    16: {
      title: "Earth Spirit",
      artist: "LorennTyr",
      url: "https://www.deviantart.com/lorenntyr/art/Earth-Spirit-746480317",
      license: "CC-BY-NC-ND 3.0",
    },
    17: {
      title: "Zyra Lol",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/Zyra-Lol-821162922",
      license: "CC-BY-NC-ND 3.0",
    },
    18: {
      title: "Elf",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Elf-839860047",
      license: "CC-BY-NC-ND 3.0",
    },
    19: {
      title: "CM : Kerrilandra Arena [2]",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/CM-Kerrilandra-Arena-2-555860550",
      license: "CC-BY-NC-ND 3.0",
    },
    20: {
      title: "Float",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Float-560634808",
      license: "CC-BY-NC-ND 3.0",
    },
    21: {
      title: "Yulessa",
      artist: "DarkraArt",
      url: "https://www.newgrounds.com/art/view/darkraart/yulessa",
      license: "CC-BY-NC-ND 3.0",
    },
    22: {
      title: "Elf archer",
      artist: "AyyaSAP",
      url: "https://www.deviantart.com/ayyasap/art/Elf-archer-398058408",
      license: "CC-BY-NC-ND 3.0",
    },
    23: {
      title: "Crystalsong",
      artist: "DarkraArt",
      url: "https://www.newgrounds.com/art/view/darkraart/crystalsong",
      license: "CC-BY-NC-ND 3.0",
    },
    24: {
      title: "Kaeleris",
      artist: "DarkraArt",
      url: "https://www.newgrounds.com/art/view/darkraart/kaeleris",
      license: "CC-BY-NC-ND 3.0",
    },
    25: {
      title: "CM: Nadrays (the Moon Guard server)",
      artist: "Arcan-Anzas",
      url: "https://www.deviantart.com/arcan-anzas/art/CM-Nadrays-the-Moon-Guard-server-639704222",
      license: "CC-BY-NC-ND 3.0",
    },
    26: {
      title: "Warcraft - Hidden springs",
      artist: "Arcan-Anzas",
      url: "https://www.deviantart.com/arcan-anzas/art/Warcraft-Hidden-springs-647916502",
      license: "CC-BY-NC-ND 3.0",
    },
    27: {
      title: "CM: Alynorae Belvarith",
      artist: "Arcan-Anzas",
      url: "https://www.deviantart.com/arcan-anzas/art/CM-Alynorae-Belvarith-721323744",
      license: "CC-BY-NC-ND 3.0",
    },
    28: {
      title: "Faerin Darkheart",
      artist: "Arcan-Anzas",
      url: "https://www.deviantart.com/arcan-anzas/art/Faerin-Darkheart-744400129",
      license: "CC-BY-NC-ND 3.0",
    },
  }

}());
