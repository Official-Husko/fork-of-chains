(function () {

  /* The following is list of direct subdirectories. */
  UNITIMAGE_LOAD_FURTHER = ["bg_noble", "bg_hunter", "bg_mercenary", "bg_mystic", "bg_slaver", "bg_soldier",
    "bg_entertainer", "bg_informer", "bg_healer", "bg_scholar", "bg_thief", "bg_adventurer", "bg_raider", "bg_foodworker", "bg_maid",]


  /* Image credit information. */
  UNITIMAGE_CREDITS = {
    1: {
      title: "Yasha",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Yasha-793741757",
      license: "CC-BY-NC-ND 3.0",
    },
    2: {
      title: "Oni Girl",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Oni-Girl-853725131",
      license: "CC-BY-NC-ND 3.0",
    },
    3: {
      title: "The Seer (Blood Omen 2)",
      artist: "JLazarusEB",
      url: "https://www.deviantart.com/jlazaruseb/art/The-Seer-Blood-Omen-2-756476346",
      license: "CC-BY-NC-ND 3.0",
    },
    4: {
      title: "Succubus",
      artist: "coldrim",
      url: "https://www.deviantart.com/coldrim/art/Succubus-651482543",
      license: "CC-BY-SA 3.0",
      extra: "cropped",
    },
    5: {
      title: "Succubus",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Succubus-597777522",
      license: "CC-BY-NC-ND 3.0",
    },
    6: {
      title: "lucifer Helltake",
      artist: "BADCOMPZERO",
      url: "https://www.deviantart.com/badcompzero/art/lucifer-Helltake-843379875",
      license: "CC-BY-NC-ND 3.0",
    },
    7: {
      title: "Flower",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Flower-680165022",
      license: "CC-BY-NC-ND 3.0",
    },
    8: {
      title: "Tiefling",
      artist: "Riversouls",
      url: "https://www.deviantart.com/riversouls/art/Tiefling-856111396",
      license: "CC-BY-NC-ND 3.0",
    },
    9: {
      title: "Tiefling",
      artist: "mascaren15",
      url: "https://www.deviantart.com/mascaren15/art/Tiefling-830460922",
      license: "CC-BY-NC-ND 3.0",
    },
    10: {
      title: "Gray Tiefling",
      artist: "OhHeyItsKaylaK",
      url: "https://www.deviantart.com/ohheyitskaylak/art/Gray-Tiefling-851931467",
      license: "CC-BY-NC-ND 3.0",
    },
    11: {
      title: "Draenei",
      artist: "riikozor",
      url: "https://www.deviantart.com/riikozor/art/Draenei-466352463",
      license: "CC-BY-NC-ND 3.0",
    },
    12: {
      title: "Green",
      artist: "RobCV",
      url: "https://www.deviantart.com/robcv/art/Green-622274715",
      license: "CC-BY-SA 3.0",
    },
    13: {
      title: "Tiefling Rogue (Commission)",
      artist: "Ri-Gon",
      url: "https://www.deviantart.com/ri-gon/art/Tiefling-Rogue-Commission-797282669",
      license: "CC-BY-NC-ND 3.0",
    },
    14: {
      title: "Tiefling",
      artist: "Ioana-Muresan",
      url: "https://www.deviantart.com/ioana-muresan/art/Tiefling-810059419",
      license: "CC-BY-NC-ND 3.0",
    },
    15: {
      title: "Necyra Portrait",
      artist: "Jeleynai",
      url: "https://www.deviantart.com/jeleynai/art/Necyra-Portrait-822719232",
      license: "CC-BY-NC-ND 3.0",
    },
    16: {
      title: "Jester Lavore [Fanart]",
      artist: "Jeleynai",
      url: "https://www.deviantart.com/jeleynai/art/Jester-Lavore-Fanart-774585953",
      license: "CC-BY-NC-ND 3.0",
    },
    17: {
      title: "Succubus Queen - Patreon",
      artist: "captdiablo",
      url: "https://www.deviantart.com/captdiablo/art/Succubus-Queen-Patreon-832038642",
      license: "CC-BY-NC-ND 3.0",
    },
    18: {
      title: "Blood Demon",
      artist: "LorennTyr",
      url: "https://www.deviantart.com/lorenntyr/art/Blood-Demon-712571220",
      license: "CC-BY-NC-ND 3.0",
    },
    19: {
      title: "Chill out Waves",
      artist: "IrenHorrors",
      url: "https://www.deviantart.com/irenhorrors/art/Chill-out-Waves-844042015",
      license: "CC-BY-NC-ND 3.0",
    },
    20: {
      title: "Bbd 06 Code Dieanna",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/Bbd-06-Code-Dieanna-735317476",
      license: "CC-BY-NC-ND 3.0",
    },
    21: {
      title: "Xaatrisa",
      artist: "DarkraArt",
      url: "https://www.newgrounds.com/art/view/darkraart/xaatrisa",
      license: "CC-BY-NC-ND 3.0",
    },
    22: {
      title: "PT : D va succubus Ritual",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/PT-D-va-succubus-Ritual-712120322",
      license: "CC-BY-NC-ND 3.0",
    },
    25: {
      title: "PT : Witchblade !!!",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/PT-Witchblade-580180944",
      license: "CC-BY-NC-ND 3.0",
    },
    27: {
      title: "Devil Dva",
      artist: "Liang-Xing",
      url: "https://www.deviantart.com/liang-xing/art/Devil-Dva-816879313",
      license: "CC-BY-NC-ND 3.0",
    },
    29: {
      title: "Succubus",
      artist: "InstantIP",
      url: "https://www.deviantart.com/instantip/art/Succubus-596381674",
      license: "CC-BY-NC-ND 3.0",
    },
  }

}());
