(function () {

  /* The following is list of direct subdirectories. */
  UNITIMAGE_LOAD_FURTHER = ["bg_slaver", "bg_apprentice", "bg_mystic",
    "bg_adventurer",
    "bg_entertainer", "bg_farmer", "bg_foodworker", "bg_maid", "bg_slave", "bg_thief", "bg_whore", "bg_woodsman",
    "bg_hunter", "bg_informer",
    "bg_assassin", "bg_engineer", "bg_soldier", "bg_metalworker", "bg_laborer", "bg_monk",
    "bg_priest", "bg_courtesan",
  ]


  UNITIMAGE_CREDITS = {
    1: {
      title: "Nina Gata",
      artist: "InstantIP",
      url: "https://www.deviantart.com/instantip/art/Nina-Gata-641705423",
      license: "CC-BY-NC-ND 3.0",
    },
    2: {
      title: "Summer 2019",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Summer-2019-811643352",
      license: "CC-BY-NC-ND 3.0",
    },
    3: {
      title: "and i dont remember from wich japanse animeshewas",
      artist: "skullofhell",
      url: "https://www.deviantart.com/skullofhell/art/and-i-dont-remember-from-wich-japanse-animeshewas-745692625",
      license: "CC-BY 3.0",
    },
    4: {
      title: "Schwarz - Arknights",
      artist: "BADCOMPZERO",
      url: "https://www.deviantart.com/badcompzero/art/Schwarz-Arknights-841533887",
      license: "CC-BY-NC-ND 3.0",
    },
    5: {
      title: "LUST Ruby -RWBY",
      artist: "BADCOMPZERO",
      url: "https://www.deviantart.com/badcompzero/art/LUST-Ruby-RWBY-811409366",
      license: "CC-BY-NC-ND 3.0",
    },
    6: {
      title: "Mabel [Art Trade]",
      artist: "Jeleynai",
      url: "https://www.deviantart.com/jeleynai/art/Mabel-Art-Trade-776067872",
      license: "CC-BY-NC-ND 3.0",
    },
    7: {
      title: "Ahri Nyaa",
      artist: "chibi-oneechan",
      url: "https://www.deviantart.com/chibi-oneechan/art/Ahri-Nyaa-684435870",
      license: "CC-BY-NC-ND 3.0",
    },
    8: {
      title: "Catgirl on the bed",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Catgirl-on-the-bed-828812131",
      license: "CC-BY-NC-ND 3.0",
    },
    9: {
      title: "Bandages of Evil",
      artist: "Crescentia-Fortuna",
      url: "https://www.deviantart.com/liang-xing/art/Kda-Ahri-856966013",
      license: "CC-BY-NC-ND 3.0",
    },
    10: {
      title: "Kda Ahri",
      artist: "Liang-Xing",
      url: "https://www.deviantart.com/liang-xing/art/Kda-Ahri-856966013",
      license: "CC-BY-NC-ND 3.0",
    },
    11: {
      title: "Catgirl",
      artist: "RamArtwork",
      url: "https://www.deviantart.com/ramartwork/art/Catgirl-608756212",
      license: "CC-BY-NC-ND 3.0",
    },
    14: {
      title: "Valeriant Blossom",
      artist: "Dopaprime",
      url: "https://www.deviantart.com/dopaprime/art/Valeriant-Blossom-674816456",
      license: "CC-BY-NC-ND 3.0",
    },
    15: {
      title: "Cherry",
      artist: "Dopaprime",
      url: "https://www.deviantart.com/dopaprime/art/Cherry-581817709",
      license: "CC-BY-NC-ND 3.0",
    },
    16: {
      title: "Virtue",
      artist: "Dopaprime",
      url: "https://www.deviantart.com/dopaprime/art/Virtue-496656599",
      license: "CC-BY-NC-ND 3.0",
    },
    19: {
      title: "FFXIV Commission (2017)",
      artist: "AyyaSAP",
      url: "https://www.deviantart.com/ayyasap/art/FFXIV-Commission-2017-817361097",
      license: "CC-BY-NC-ND 3.0",
    },
    20: {
      title: "Blake Belladonna",
      artist: "AyyaSAP",
      url: "https://www.deviantart.com/ayyasap/art/Blake-Belladonna-726030657",
      license: "CC-BY-NC-ND 3.0",
    },
    21: {
      title: "[Commission] C'yisa",
      artist: "Poticceli",
      url: "https://www.deviantart.com/poticceli/art/Commission-C-yisa-855079455",
      license: "CC-BY-NC-ND 3.0",
    },
    25: {
      title: "Ahri kda all out",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/Ahri-kda-all-out-861708925",
      license: "CC-BY-NC-ND 3.0",
    },
    26: {
      title: "Ahri Spirit Blossom",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/Ahri-Spirit-Blossom-859688917",
      license: "CC-BY-NC-ND 3.0",
    },
    27: {
      title: "Ahri Kda Skin",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/Ahri-Kda-Skin-773102992",
      license: "CC-BY-NC-ND 3.0",
    },
    28: {
      title: "[Comm] Seth",
      artist: "Poticceli",
      url: "https://www.deviantart.com/poticceli/art/Comm-Seth-850108863",
      license: "CC-BY-NC-ND 3.0",
    },
    30: {
      title: "Ahri",
      artist: "InstantIP",
      url: "https://www.deviantart.com/instantip/art/Ahri-682748519",
      license: "CC-BY-NC-ND 3.0",
    },
    31: {
      title: "Kitty Katarina",
      artist: "InstantIP",
      url: "https://www.deviantart.com/instantip/art/Kitty-Katarina-579090106",
      license: "CC-BY-NC-ND 3.0",
    },
    99: {
      title: "Sexy Kitty Haneame",
      artist: "nyctoinc",
      url: "https://www.deviantart.com/nyctoinc/art/Sexy-Kitty-Haneame-866121931",
      license: "CC-BY-NC-ND 3.0",
    },
  }

}());
