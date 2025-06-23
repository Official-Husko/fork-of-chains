(function () {

  /* The following is list of direct subdirectories. */
  UNITIMAGE_LOAD_FURTHER = ["bg_assassin", "bg_healer", "bg_slaver", "bg_mystic", "bg_thief",
    "bg_pirate", "bg_mercenary",
    "bg_adventurer", "bg_apprentice", "bg_artisan", "bg_farmer", "bg_informer", "bg_merchant",
    "bg_seaman", "bg_slave", "bg_whore", "bg_noble", "bg_knight", "bg_entertainer",
    "bg_monk", "bg_soldier", "bg_scholar", "bg_clerk", "bg_metalworker", "bg_artist", "bg_maid",
    "bg_courtesan", "bg_engineer", "bg_mist",
  ]


  UNITIMAGE_CREDITS = {
    1: {
      title: "Ultramarine",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Ultramarine-859581804",
      license: "CC-BY-NC-ND 3.0",
    },
    2: {
      title: "Leifang (commission)",
      artist: "AyyaSAP",
      url: "https://www.deviantart.com/ayyasap/art/Leifang-commission-813393091",
      license: "CC-BY-NC-ND 3.0",
    },
    3: {
      title: "Year of the Rat",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Year-of-the-Rat-827166468",
      license: "CC-BY-NC-ND 3.0",
    },
    4: {
      title: "Sona Tokyo Night",
      artist: "BADCOMPZERO",
      url: "https://www.deviantart.com/badcompzero/art/Sona-Tokyo-Night-826824816",
      license: "CC-BY-NC-ND 3.0",
    },
    5: {
      title: "Okita Alter - FateGO",
      artist: "BADCOMPZERO",
      url: "https://www.deviantart.com/badcompzero/art/Okita-Alter-FateGO-754624042",
      license: "CC-BY-NC-ND 3.0",
    },
    6: {
      title: "Golden Fish",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Golden-Fish-764062451",
      license: "CC-BY-NC-ND 3.0",
    },
    7: {
      title: "Paper Umbrella",
      artist: "ariverkao",
      url: "https://www.deviantart.com/ariverkao/art/Paper-Umbrella-634589084",
      license: "CC-BY-NC-ND 3.0",
    },
    8: {
      title: "Naomi thingy",
      artist: "Crescentia-Fortuna",
      url: "https://www.newgrounds.com/art/view/crescentia-fortuna/naomi-thingy",
      license: "CC-BY-NC 3.0",
    },
    11: {
      title: "Aqua /Kingdom Hearts/",
      artist: "AyyaSAP",
      url: "https://www.deviantart.com/ayyasap/art/Aqua-Kingdom-Hearts-858326593",
      license: "CC-BY-NC-ND 3.0",
    },
    16: {
      title: "Cheongsam Dva",
      artist: "Liang-Xing",
      url: "https://www.deviantart.com/liang-xing/art/Cheongsam-Dva-769373208",
      license: "CC-BY-NC-ND 3.0",
    },
    17: {
      title: "Tifa Lockhart (alt) Kimono",
      artist: "AyyaSAP",
      url: "https://www.deviantart.com/ayyasap/art/Tifa-Lockhart-alt-Kimono-845061765",
      license: "CC-BY-NC-SA 3.0",
    },
    18: {
      title: "You should be sleeping at this time!",
      artist: "RobCV",
      url: "https://www.deviantart.com/robcv/art/You-should-be-sleeping-at-this-time-567385407",
      license: "CC-BY-NC-SA 3.0",
    },
    19: {
      title: "Taki's Evil sealing ritual",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/Taki-s-Evil-sealing-ritual-813022050",
      license: "CC-BY-NC-ND 3.0",
    },
    20: {
      title: "PT: Sumiko Tatsuno",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/PT-Sumiko-Tatsuno-760710020",
      license: "CC-BY-NC-ND 3.0",
    },
    21: {
      title: "PT : Mai lau Lee",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/PT-Mai-lau-Lee-735923006",
      license: "CC-BY-NC-ND 3.0",
    },
    22: {
      title: "Bbd 04 Inugami chi",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/Bbd-04-Inugami-chi-724836195",
      license: "CC-BY-NC-ND 3.0",
    },
    23: {
      title: "Psylocke [2]",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/Psylocke-2-680014068",
      license: "CC-BY-NC-ND 3.0",
    },
    24: {
      title: "PT : Psylocke",
      artist: "kachima",
      url: "https://www.deviantart.com/kachima/art/PT-Psylocke-629864759",
      license: "CC-BY-NC-ND 3.0",
    },
    26: {
      title: "2b",
      artist: "Liang-Xing",
      url: "https://www.deviantart.com/liang-xing/art/2b-838505340",
      license: "CC-BY-NC-ND 3.0",
    },
    28: {
      title: "Summer Scathach",
      artist: "Liang-Xing",
      url: "https://www.deviantart.com/liang-xing/art/Summer-Scathach-816166542",
      license: "CC-BY-NC-ND 3.0",
    },
    29: {
      title: "Dva",
      artist: "Liang-Xing",
      url: "https://www.deviantart.com/liang-xing/art/Dva-766664153",
      license: "CC-BY-NC-ND 3.0",
    },
    31: {
      title: "Snow Kimono",
      artist: "anonamos701",
      url: "https://www.deviantart.com/anonamos701/art/Snow-Kimono-625879541",
      license: "CC-BY-ND 3.0",
    },
    32: {
      title: "Fu Hua",
      artist: "raikoart",
      url: "https://www.deviantart.com/raikoart/art/Fu-Hua-842434985",
      license: "CC-BY-NC-ND 3.0",
    },
    33: {
      title: "Tengu",
      artist: "toy1989820",
      url: "https://www.deviantart.com/toy1989820/art/Tengu-618304394",
      license: "CC-BY-NC-ND 3.0",
    },
    35: {
      title: "Samurai Girl Study",
      artist: "raikoart",
      url: "https://www.deviantart.com/raikoart/art/Samurai-Girl-Study-721887599",
      license: "CC-BY-NC-ND 3.0",
    },
  }

}());
