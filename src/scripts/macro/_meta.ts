// @ts-nocheck



setup.ArgType = {
  String: 'string',
  Number: 'number',
  Boolean: 'boolean',
  Unknown: 'unknown',
  Actor: 'actor',
  Company: 'company',
  Item: 'item',
}

const ArgType = setup.ArgType

export const Args_OneActor = [ArgType.Actor]

function resolveMacroName(name) {
  while (typeof setup.MACROS_METADATA[name] === "string")
    name = setup.MACROS_METADATA[name]
  return name
}

setup.getMacroMetadata = function (name) {
  return setup.MACROS_METADATA[resolveMacroName(name)]
}

setup.getMacroAliases = function (name) {
  name = resolveMacroName(name)
  return [name, ...Object.keys(setup.MACROS_METADATA).filter(x => setup.MACROS_METADATA[x] === name)]
}


// Allowed map values:
//  - string: it's an alias to another macro
//  - null: disallow the macro in quest descriptions, etc. (e.g.: navigation)
//  - undefined: will report "no info available"
//  - object: contains the metadata

setup.MACROS_METADATA = {
  // NOTE: Some macros are added automatically at runtime:
  //   - Pronouns (eg. "<<they _u>>")
  //   - Body parts (eg. "<<torso _u>>", "<<torsoall _u>>")


  /////////////////
  //  SugarCube  //
  /////////////////

  // Allowed

  set: {
    info: "Sets the value of a variable",
    args: null
  },
  unset: {
    info: "Clears the value of a variable",
    args: null
  },
  run: {
    info: "Executes a javascript expression",
    args: null
  },
  include: {
    info: "Renders the contents of the specified Twine passage",
    args: [ArgType.String]
  },
  print: {
    info: "Renders twee code stored in a variable",
    args: null
  },
  "=": 'print',
  "-": 'print',

  button: {
    info: "Renders a button with the given text, executing the contained twee asynchronously when clicked",
    args: [ArgType.String]
  },
  link: {
    info: "Renders a link with the given text, executing the contained twee asynchronously when clicked",
    args: [ArgType.String]
  },

  if: {
    info: "Renders text/code conditionally depending on a condition",
    args: null
  },
  else: 'if',
  elseif: 'if',

  switch: {
    info: "Renders text/code conditionally depending on the value of an expression",
    args: null
  },
  case: 'switch',
  default: 'switch',

  for: {
    info: "Loops over the items of a list or an object",
    args: null
  },
  continue: {
    info: "Jumps to the next iteration of a \"for\" loop",
    args: []
  },
  break: {
    info: "Breaks out of a \"for\" loop",
    args: []
  },

  addclass: {
    info: "Adds the CSS class(es) passed as second argument to the HTML elements matching the selector specified as first argument",
    args: [ArgType.String, ArgType.String]
  },
  removeclass: {
    info: "Removes the CSS class(es) passed as second argument from the HTML elements matching the selector specified as first argument",
    args: [ArgType.String, ArgType.String]
  },
  toggleclass: {
    info: "Toggles the CSS class(es) passed as second argument at the HTML elements matching the selector specified as first argument",
    args: [ArgType.String, ArgType.String]
  },

  replace: {
    info: "Replaces the content of the elements matching the specified selector, by a render of the twee code contained inside this macro call",
    args: [ArgType.String, ArgType.String]
  },

  // Disallowed
  nobr: undefined,
  capture: null,
  remember: null,
  forget: null,
  script: null,
  silently: null,
  type: null,
  display: null,
  checkbox: null,
  cycle: null,
  listbox: null,
  linkappend: null,
  linkprepend: null,
  linkreplace: null,
  numberbox: null,
  textbox: null,
  radiobutton: null,
  textarea: null,
  click: null,
  actions: null,
  back: null,
  return: null,
  choice: null,
  copy: null,
  append: null,
  prepend: null,
  remove: null,
  audio: null,
  cacheaudio: null,
  createaudiogroup: null,
  createplaylist: null,
  masteraudio: null,
  playlist: null,
  removeaudiogroup: null,
  removeplaylist: null,
  waitforaudio: null,
  setplaylist: null,
  stopallaudio: null,
  goto: null,
  repeat: null,
  stop: null,
  timed: null,
  widget: null,


  ///////////
  //  FOC  //
  ///////////

  // Articles
  a: {
    info: "Renders the correct article (<b>a/an</b>) for the specified word",
    args: [ArgType.String]
  },
  an: 'a',
  A: 'a',
  An: 'a',

  // Utils
  image: {
    info: "Renders an image by the given path. Supports images embedded in the game code (e.g. trait icons)",
    args: [ArgType.String]
  },

  pronounload: {
    info: "Assigns to the variable passed as second parameter, an object containing the pronouns for the specified actor",
    args: [ArgType.Actor, ArgType.Unknown]
  },

  message: {
    info: "Renders an \"spoiler tag\", i.e. a clickable link (text passed as first argument) that toggles the visibility of the contained code",
    args: [
      [ArgType.String],
      [ArgType.String, ArgType.String]
    ]
  },

  // Messages / coloring

  exp: {
    info: "Renders a value stylized as a Friendship amount",
    args: [ArgType.Number]
  },
  friendship: {
    info: "Renders a value stylized as a Friendship amount",
    args: [ArgType.Number]
  },
  prestige: {
    info: "Renders a value stylized as a Prestige amount",
    args: [ArgType.Number]
  },
  money: {
    info: "Renders a value stylized as a money amount: green if positive, red if negative",
    args: [ArgType.Number]
  },
  moneyloss: {
    info: "Renders a value stylized as a money amount. Opposite of 'money' macro: red if positive, green if negative",
    args: [ArgType.Number]
  },
  successtext: {
    info: "Renders a green text",
    args: [ArgType.String]
  },
  successtextlite: {
    info: "Renders a light green text",
    args: [ArgType.String]
  },
  dangertext: {
    info: "Renders a red text",
    args: [ArgType.String]
  },
  dangertextlite: {
    info: "Renders a light red text",
    args: [ArgType.String]
  },
  warning: {
    info: "Renders a warning text",
    args: [ArgType.String]
  },

  // Entities rep's / names

  rep: {
    info: "Represents an actor or entity name along with small icons for busy/idle status, skill focuses, etc",
    args: [
      [ArgType.Actor],
      [ArgType.Company],
      [ArgType.Item],
    ]
  },
  Rep: {
    info: "Bob / Alice / You",
    args: [ArgType.Actor,]
  },
  reps: {
    info: "Bob's / Alice's / your",
    args: [ArgType.Actor,]
  },
  Reps: {
    info: "Bob's / Alice's / Your",
    args: [ArgType.Actor,]
  },
  yourrep: {
    info: "your evil slaver Bob / you",
    args: [ArgType.Actor,]
  },
  Yourrep: {
    info: "Your evil slaver Bob / You",
    args: [ArgType.Actor,]
  },
  theslaver: {
    info: "the slaver / the slave / you",
    args: [ArgType.Actor,]
  },
  Theslaver: {
    info: "The slaver / The slave / You",
    args: [ArgType.Actor,]
  },
  therace: {
    info: "the neko / you",
    args: [ArgType.Actor,]
  },
  Therace: {
    info: "The Neko / You",
    args: [ArgType.Actor,]
  },
  nameof: {
    info: "Prints the name of the unit, in bold, without tooltips",
    args: [
      [ArgType.Actor],
      [ArgType.Company],
    ]
  },
  name: {
    info: "Prints the name of the unit. Unlike &lt;&lt;rep&gt;&gt;, no tooltip is shown",
    args: [
      [ArgType.Actor],
      [ArgType.Company],
    ]
  },

  // Units info

  levelof: {
    info: "Prints the level of the unit",
    args: [ArgType.Number]
  },
  titlelow: {
    info: 'Prints the title of the unit, e.g., "generalist"',
    args: Args_OneActor
  },

  /* These should not be used: */
  titlefull: null,
  bantertext: null,
  tfriendtitle: null,
  tfriendslave: null,

  uequipslot: {
    info: "Prints the equipment worn on this slot. E.g., The drink spilled on your &lt;&lt;ueqeuipslot $unit.player 'legs'&gt;&gt;",
    args: [ArgType.Actor, ArgType.String],
  },

  ufriend: {
    info: "Print the friendship status between two units, e.g., friend, acquaintance, or rival",
    args: [ArgType.Actor, ArgType.Actor],
  },
  utheirrel: {
    info: "Print 'their relationship', e.g.: 'his friend' or 'her father'",
    args: [ArgType.Actor, ArgType.Actor],
  },
  unamerel: {
    info: "Print 'name's relationship', e.g.: 'Bob's sister' or 'Bob's friend'",
    args: [ArgType.Actor, ArgType.Actor],
  },

  ubody: {
    info: "Print 'muscular body' or 'furry body'",
    args: Args_OneActor
  },
  ubodyall: {
    info: "Print 'muscular body covered with leather armor' or 'furry body covered in nothing'",
    args: Args_OneActor
  },
  ucleavage: {
    info: "Print flat cleavage or pec cleavage",
    args: Args_OneActor
  },
  ubreasts: {
    info: "Print 'giant breasts' or 'tiny breasts'",
    args: Args_OneActor
  },
  ubreastsall: {
    info: "Print 'giant breasts with equipment' or 'tiny breasts with equipment'",
    args: Args_OneActor
  },
  unipples: {
    info: "Print 'nipples'",
    args: Args_OneActor
  },
  unipplesall: {
    info: "Print 'nipples with a piercing'",
    args: Args_OneActor
  },
  uflavor: {
    info: "Print the bodypart full flavor text, if it has any. Example, &lt;&lt;uflavor $unit.player 'wings'&gt;&gt; will print the wing's flavor text if the unit has wings",
    args: [ArgType.Actor, ArgType.String]
  },
  uequipment: {
    info: "Print equipment description, e.g., 'bondage slutty armor' or 'valuable combat armor'",
    args: Args_OneActor
  },
  ubantertraining: null,
  uadjphys: {
    info: "Print a physical adjective, e.g., 'muscular'",
    args: Args_OneActor
  },
  uadjper: {
    info: "Print a personality adjective, e.g., 'naughty'",
    args: Args_OneActor
  },
  urace: {
    info: "Outputs the name of the actor's race",
    args: Args_OneActor
  },
  uhomeland: {
    info: "Outputs the region homeland of the actor, e.g., Eastern Deserts or The Mist",
    args: Args_OneActor
  },
  uweapon: {
    info: "Prints the unit's weapon, e.g., 'sword' or 'Excalibur'",
    args: Args_OneActor
  },
  uaweapon: {
    info: "Prints the unit's weapon, with an article. E.g., 'a sword' or 'an axe'",
    args: Args_OneActor
  },
  uadj: {
    info: "Prints an adjective from the unit, e.g., 'naughty' or 'tall'",
    args: Args_OneActor
  },
  uadjgood: {
    info: "Prints a positive adjective of the unit, e.g., 'smart'",
    args: Args_OneActor
  },
  uadjbad: {
    info: "Prints a negative adjective of the unit, e.g., 'stupid'",
    args: Args_OneActor
  },
  uadv: {
    info: "Prints an adverb of the unit, e.g., 'calmly'",
    args: Args_OneActor
  },
  uadvcare: {
    info: "Prints an adverb of the unit suitable for caring for a unit, e.g., 'gently, generously' but not `cruelly, violently`",
    args: Args_OneActor
  },
  uadvabuse: {
    info: "Prints an adverb of the unit suitable for abusing / attacking a unit, e.g., 'violently, evilly' but not `kindly, generously`",
    args: Args_OneActor
  },
  ustriptorso: {
    info: "Prints a sentence where the unit strips down from their upper body equipment, if any",
    args: Args_OneActor
  },
  ustriplegs: {
    info: "Prints a sentence where the unit strips down from their lower body equipment, if any",
    args: Args_OneActor
  },
  ustripanus: {
    info: "Prints a sentence where the unit pulls whatever is filling their anus, if any",
    args: Args_OneActor
  },
  ustripgenital: {
    info: "Prints a sentence where the unit pulls whatever is filling their vagina or blocking their dildo, if any",
    args: Args_OneActor
  },
  ustripvagina: {
    info: "Prints a sentence where the unit pulls whatever is filling their vagina, if any",
    args: Args_OneActor
  },
  ustripdick: {
    info: "Prints a sentence where the unit pulls whatever equipped on their dick, if any",
    args: Args_OneActor
  },
  ustripnipple: {
    info: "Prints a sentence where the unit pulls whatever equipped on their nipples, if any",
    args: Args_OneActor
  },
  ustripmouth: {
    info: "Prints a sentence where the unit pulls whatever equipped on their mouth, if any",
    args: Args_OneActor
  },
  uslaverstripall: {
    info: "Prints a sentence where the unit strips everything if any",
    args: Args_OneActor
  },
  uyoustripanus: null,
  upunishreason: {
    info: "Prints a half-sentence giving a reason for punishing unit. Example use: 'You punish Bob because &lt;&lt;upunishreason $g.bob&gt;&gt;'",
    args: Args_OneActor
  },
  upraisenoun: {
    info: "Prints a praise-able noun of the actor. E.g., bravery, or handsomeness",
    args: Args_OneActor
  },
  uinsultnoun: {
    info: "Prints a insult-able noun of the actor. E.g., foolishness, or stupidity",
    args: Args_OneActor
  },
  uhobbyverb: {
    info: "Prints a verb about the unit's hobby. E.g., reminiscing about his past, or cooking",
    args: Args_OneActor
  },
  ustripshirtand: {
    info: "E.g., 'strips his shirt and'. Returns empty string if not wearing shirt",
    args: Args_OneActor
  },
  ustrippantsand: {
    info: "E.g., 'strips his pants and'. Returns empty string if not wearing pants",
    args: Args_OneActor
  },
  ustripmouthand: {
    info: "E.g., 'unfasten his gag and'. Returns empty string if not wearing mouth",
    args: Args_OneActor
  },
  ustripeyesand: {
    info: "E.g., 'removes his blindfold and'. Returns empty string if not wearing eyes",
    args: Args_OneActor
  },
  ustripanusand: {
    info: "E.g., 'pull out his buttplug and'. Returns empty string if not wearing anus",
    args: Args_OneActor
  },
  ustripgenitaland: {
    info: "E.g., 'unlock his chastity cage and'. Returns empty string if not wearing genital",
    args: Args_OneActor
  },
  ustripequipmentand: {
    info: "E.g., 'strips his armor and'. Returns empty string if naked",
    args: Args_OneActor
  },
  uneedrescue: {
    info: "Prints a sentence hinting that you ned to rescue unit with a Rescuer. Example: '&lt;&lt;uneedrescue $g.bob&gt;&gt;, before worse things happen'",
    args: Args_OneActor
  },
  urescuenow: {
    info: "Prints a sentence hinting that you ned to rescue unit now. Example: '&lt;&lt;uneedrescue $g.bob&gt;&gt; at once'",
    args: Args_OneActor
  },
  ubodyswap: {
    info: "Prints a sentence describing the transformations that the first unit undergoes to become the second unit",
    args: [ArgType.Actor, ArgType.Actor],
  },
  uinsultrape: {
    info: "Gives a speech where the first unit insults the second unit during a rape",
    args: [ArgType.Actor, ArgType.Actor],
  },
  unitcard: {
    info: "Prints the unit card of this unit",
    args: Args_OneActor
  },
  upetwhine: {
    info: "Prints a full dialogue about a pet humanlike whining.",
    args: Args_OneActor
  },


  //
  // Internal (not allowed)
  //

  setarticle: null,
  icon: null,
  await: null,
  codeeditor: null,
  foctimed: null,
  focwidget: null,
  focmove: null,
  focreturn: null,
  focgoto: null,
  focsavestategoto: null,
  foclink: null,
  refreshable: null,
  "refreshable-refresh": null,
  onevent: null,

  devmacroinfo: null,
  devcodeeditorpreview: null,
  twinehelptext: null,
  devtoolreturnbutton: null,
  devtoolchoosetitle: null,
  devquestroles: null,
  devactorall: null,
  devactor: null,
  devactordefault: null,

  loadinteractioncommon: null,
  bantercarddetails: null,
  bantercard: null,
  bedchambercard: null,
  bedchambercardkey: null,
  buildingcardupgradelink: null,
  buildingcardcompact: null,
  buildingcard: null,
  buildingcardkey: null,
  buildingtemplatecardbuildlink: null,
  buildingtemplatecardload: null,
  buildingtemplatecardcompact: null,
  buildingtemplatecard: null,
  buildingtemplatecardkey: null,
  companycard: null,
  companycardkey: null,
  contactcard: null,
  contactcardkey: null,
  costcard: null,
  requirementcard: null,
  criteriacard: null,
  criteriatraitlist: null,
  dutycard: null,
  dutycardkey: null,
  equipmentcard: null,
  equipmentcardkey: null,
  equipmentsetcard: null,
  equipmentsetcardkey: null,
  equipmentpoolcard: null,
  equipmentpoolcardkey: null,
  loadimage: null,
  loadimagecredits: null,
  injurycardinner: null,
  injurycard: null,
  injurycardkey: null,
  interactionpool: null,
  itemcard: null,
  itemcardkey: null,
  itempoolcard: null,
  itempoolcardkey: null,
  jobcard: null,
  notificationcard: null,
  notificationscard: null,
  opportunitycard: null,
  opportunitycardkey: null,
  questcard: null,
  questcardkey: null,
  questauthorcardtext: null,
  questauthorcard: null,
  questvarload: null,
  selectunit: null,
  tooltipskill: null,
  skillcardglowkey: null,
  slaveordercard: null,
  slaveordercardkey: null,
  tagcard: null,
  teamcard: null,
  teamcardkey: null,
  titlecard: null,
  titlecardkey: null,
  tooltiptrait: null,
  traitcard: null,
  negtraitcard: null,
  negtraitcardkey: null,
  traitcardglow: null,
  traitcardkeyglow: null,
  unitactioncard: null,
  unitactioncardkey: null,
  unitactionlist: null,
  unitcardkey: null,
  unitdescription: null,
  unitpoolcard: null,
  unitpoolcardkey: null,
  unitgroupcard: null,
  unitgroupcardkey: null,
  tooltipunit: null,
  loadnotification: null,
  loadmenutopdata: null,
  refreshmenu: null,
  loadmenu: null,
}
