
/* from
https://github.com/LukeMS/lua-namegen/blob/master/data/creatures.cfg
*/

setup.NAME_dragonkin_female_first_name = function () {

  const firstpart = [
    "Abra", "Har", "Phrixu", "Adastra", "Helio", "Porphyro", "Adra", "Huro",
    "Pyra", "Anca", "Iul", "Rhada", "Andra", "Jalan", "Rhe", "Arag",
    "Jarzem", "Rhodo", "Archo", "Jazra", "Rau", "Atra", "Jurga", "Sar",
    "Bar", "Keruxa", "Sarcu", "Bara", "Kralka", "Sarda", "Beru", "Lazulo",
    "Scarva", "Bhakri", "Majuri", "Sidereo", "Bia", "Malacho", "Skhia",
    "Bra", "Mar", "Sulchru", "Brado", "Marmora", "Tchalcedo", "Brima",
    "Melkar", "Tchazar", "Cadra", "Orgra", "Trocho", "Chro", "Ouro", "Vra",
    "Chryso", "Perido", "Zalar", "Glau", "Phoro", "Zerul",
    "Nafaa", "Naha", "Mir", "Naas", "Joorah",
    "Maar", "Yolna", "Alex",
  ]

  const secondpart = [
    "bradaxis", "calchaxis", "cordaxis", "lagonis", "malaxis", "manthysa",
    "mordaxis", "nadralix", "naluxis", "neriaxis", "phylaxis", "voraxis",
    "vorunga", "xenoris", "zuthraxis", "zzebraxis", "zzemalis", "bazia",
    "borossa", "mandrossa", "viir", "thurna",
    "strasza", "laarum", "rahmaar", "grontiid", "laamnir",
  ]

  let firstrand = setup.rng.choice(firstpart)
  let secondrand = setup.rng.choice(secondpart)
  return `${firstrand}${secondrand}`
}
