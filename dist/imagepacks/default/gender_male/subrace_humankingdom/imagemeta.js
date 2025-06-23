(function () {

  /* The following is list of direct subdirectories. */
  UNITIMAGE_LOAD_FURTHER = ["bg_mystic", "bg_healer",
    "bg_knight", "bg_hunter", "bg_thief", "bg_pirate",
    "bg_mercenary", "bg_soldier", "bg_noble",
    "bg_clerk", "bg_farmer", "bg_informer", "bg_maid", "bg_merchant",
    "bg_seaman", "bg_thug", "bg_assassin", "bg_apprentice", "bg_entertainer",
    "bg_adventurer", "bg_monk", "bg_engineer", "bg_artisan",
    "bg_laborer", "bg_artist", "bg_scholar", "bg_boss", "bg_slaver",
    "bg_courtesan", "bg_whore", "bg_royal", "bg_foodworker",
    "bg_metalworker", "bg_raider", "bg_wildman", "bg_slave",
  ]


  UNITIMAGE_CREDITS = {
    1: {
      title: "14 05 23 Guillaume4",
      artist: "NhawNuad",
      url: "https://www.deviantart.com/nhawnuad/art/14-05-23-Guillaume4-457227165",
      license: "CC-BY-NC-ND 3.0",
    },
    2: {
      title: "Ian",
      artist: "leomon32",
      url: "https://www.deviantart.com/leomon32/art/Ian-452894532",
      license: "CC-BY-NC-SA 3.0",
      extra: "removed the text box on bottom right",
    },
    3: {
      title: "Summer Jacob Frye",
      artist: "LitoPerezito",
      url: "https://www.deviantart.com/litoperezito/art/Summer-Jacob-Frye-802256706",
      license: "CC-BY-NC-ND 3.0",
    },
    4: {
      title: "Steve",
      artist: "RAPHTOR",
      url: "https://www.deviantart.com/raphtor/art/Steve-778979763",
      license: "CC-BY-NC-SA 3.0",
    },
    5: {
      title: "Dream Daddy: A Dad Dating Simulator Robert Small",
      artist: "leomon32",
      url: "https://www.deviantart.com/leomon32/art/Dream-Daddy-A-Dad-Dating-Simulator-Robert-Small-695733616",
      license: "CC-BY-NC-SA 3.0",
      extra: "cropped",
    },
    6: {
      title: "Is it love? Owen",
      artist: "Zetsuai89",
      url: "https://www.deviantart.com/zetsuai89/art/Is-it-love-Owen-846910642",
      license: "CC-BY-NC-ND 3.0",
    },
    7: {
      title: "Commission: Nebtadjeser",
      artist: "artAlais",
      url: "https://www.deviantart.com/artalais/art/Commission-Nebtadjeser-804522600",
      license: "CC-BY-NC-ND 3.0",
    },
    8: {
      title: "Henry of Skalitz (Kingdom Come: Deliverance)",
      artist: "Roannia",
      url: "https://www.deviantart.com/roannia/art/Henry-of-Skalitz-Kingdom-Come-Deliverance-793112456",
      license: "CC-BY-NC-ND 3.0",
    },
    9: {
      title: "Yusuke",
      artist: "pakkiedavie",
      url: "https://www.deviantart.com/pakkiedavie/art/Yusuke-739195460",
      license: "CC-BY-NC-ND 3.0",
    },
    10: {
      title: "Yume100 - Rika",
      artist: "pakkiedavie",
      url: "https://www.deviantart.com/pakkiedavie/art/Yume100-Rika-629730954",
      license: "CC-BY-NC-ND 3.0",
    },
    11: {
      title: "Novel Original Character: Chamalley Yere'es",
      artist: "pakkiedavie",
      url: "https://www.deviantart.com/pakkiedavie/art/Novel-Original-Character-Chamalley-Yere-es-590692486",
      license: "CC-BY-NC-ND 3.0",
    },
    12: {
      title: "[C] Daegel Ferve",
      artist: "Lidiash",
      url: "https://www.deviantart.com/lidiash/art/C-Daegel-Ferve-794655656",
      license: "CC-BY-NC-ND 3.0",
    },
    13: {
      title: "[G] Last days in Midpoint",
      artist: "Lidiash",
      url: "https://www.deviantart.com/lidiash/art/G-Last-days-in-Midpoint-786739048",
      license: "CC-BY-NC-ND 3.0",
    },
    14: {
      title: "::COMMISSION:: Neros",
      artist: "Dopaprime",
      url: "https://www.deviantart.com/dopaprime/art/COMMISSION-Neros-462612280",
      license: "CC-BY-NC-ND 3.0",
    },
    15: {
      title: "[G] Last days in Midpoint",
      artist: "Lidiash",
      url: "https://www.deviantart.com/lidiash/art/G-Last-days-in-Midpoint-786739048",
      license: "CC-BY-NC-ND 3.0",
    },
    16: {
      title: "One more try",
      artist: "pakkiedavie",
      url: "https://www.deviantart.com/pakkiedavie/art/One-more-try-289741176",
      license: "CC-BY-NC-ND 3.0",
    },
    17: {
      title: "14 12 04",
      artist: "NhawNuad",
      url: "https://www.deviantart.com/nhawnuad/art/14-12-04-498182874",
      license: "CC-BY-NC-ND 3.0",
    },
    18: {
      title: "Lancer RPG character commission 3",
      artist: "Ioana-Muresan",
      url: "https://www.deviantart.com/ioana-muresan/art/Lancer-RPG-character-commission-3-838152991",
      license: "CC-BY-NC-ND 3.0",
    },
    19: {
      title: "Logan",
      artist: "InstantIP",
      url: "https://www.deviantart.com/instantip/art/Logan-670626149",
      license: "CC-BY-NC-ND 3.0",
    },
    20: {
      title: "COMM: Ao",
      artist: "AkubakaArts",
      url: "https://www.deviantart.com/akubakaarts/art/COMM-Ao-653103892",
      license: "CC-BY-NC-ND 3.0",
    },
    21: {
      title: "fujimachine",
      artist: "Kanzo",
      url: "https://www.newgrounds.com/art/view/fujimachine/oc-kanzo",
      license: "CC-BY-NC 3.0",
    },
    22: {
      title: "Red Bandage",
      artist: "Noxypia",
      url: "https://www.deviantart.com/noxypia/art/Red-Bandage-285950581",
      license: "CC-BY-NC-ND 3.0",
    },
    23: {
      title: "Commission - Worldbreaker",
      artist: "anonamos701",
      url: "https://www.deviantart.com/anonamos701/art/Commission-Worldbreaker-794199122",
      license: "CC-BY-ND 3.0",
    },
    31: {
      title: "The Tailor",
      artist: "NhawNuad",
      url: "https://www.deviantart.com/nhawnuad/art/The-Tailor-404356079",
      license: "CC-BY-NC-ND 3.0",
    },
    32: {
      title: "doodle",
      artist: "NhawNuad",
      url: "https://www.deviantart.com/nhawnuad/art/doodle-657578962",
      license: "CC-BY-NC-ND 3.0",
    },
    33: {
      title: "15 06 13",
      artist: "NhawNuad",
      url: "https://www.deviantart.com/nhawnuad/art/15-06-13-540291484",
      license: "CC-BY-NC-ND 3.0",
    },
  }

}());
