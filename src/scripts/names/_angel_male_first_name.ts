/* from Wikipedia 
https://en.wikipedia.org/wiki/List_of_angels_in_theology
and
https://github.com/alxgiraud/fantasygen/blob/master/public/data/defaultDictionaries.json (ISC License):

Copyright (C) 2016 Alexandre Giraud

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

setup.NAME_angel_male_first_name = function () {

  const firstpart = [
    "abadd", "abath", "adr", "ahr", "ambr",
    "am", "an", "han", "araf", "arar",
    "azaz", "arch", "ar", "azr", "aur",
    "barach", "eloh", "carn", "cass", "cher",
    "cam", "kem", "kam", "kham", "dan", "dard",
    "ere", "gabr", "jibr", "gadr", "godr", "handran",
    "han", "har", "harshm", "hesed", "zadk",
    "israf", "jegud", "jeh", "jeq", "jerahm",
    "joph", "kerub", "kir", "kush", "lel",
    "luc", "mar", "mebah", "met", "metatr", "mich",
    "mik", "mikh", "mur", "nan", "nith", "nur", "pahal",
    "penem", "phan", "poy", "pur", "qaphs", "rag", "azr",
    "israf", "raz", "rem", "sach", "sam", "sandalph",
    "sar", "selaph", "seraph", "sim", "shams", "ten", "tazphq",
    "ur", "uz", "uzz", "veh", "zachar", "zadk", "tzadk", "zeph", "zaphk",
    "zoph", "abat", "algib", "anan", "arak",
    "arar", "armar", "art", "asb",
    "barach", "baraq", "batar", "bezal", "cam",
    "chazaq", "cher", "dadr", "elel", "gardr",
    "hadran", "hashm", "hofn", "jegud",
    "jerem", "kephar", "kokab", "malakb",
    "nathan", "ophan", "oph", "prav",
    "pur",
    "raduer", "raf", "ram", "raph",
    "reg",
    "rigard", "rikb",
    "sabr", "sahaq", "sarath", "shamn",
    "sidr", "tam", "tur", "veh", "yom",
    "zaq", "zephan",
  ]

  const secondpart = [
    "arr", "iel", "iman", "ello",
    "ael", "aelos", "uel", "uelo", "ielo", "im",
    "ubim", "ail", "eil", "eal", "iah", "ial",
    "aiel", "iol", "oel", "eilos", "aelo",
    "aeli",
  ]

  let firstrand = setup.rng.choice(firstpart)
  let secondrand = setup.rng.choice(secondpart)
  return setup.capitalize(`${firstrand}${secondrand}`)
}
