
import { menuItem } from "../ui/menu"

export function insertTextIntoEditor(text) {
  const elem = document.activeElement
  if (!elem)
    return

  if (elem.classList.contains('macro-codeeditor-jar')) {
    document.execCommand("insertHTML", false, setup.escapeHtml(text))

    // hack: send a dummy event to re-trigger code highlighting
    elem.dispatchEvent(new KeyboardEvent('keyup', { 'key': ' ' }));
  } else if (elem instanceof HTMLTextAreaElement) {
    document.execCommand("insertText", false, text)
  }
}

function makeIfElseBlocks(conditions, add_else) {
  if (conditions.length === 0)
    return ''

  let str = `<<if ${conditions[0]}>>\n\n`
  for (let i = 1; i < conditions.length; ++i)
    str += `<<elseif ${conditions[i]}>>\n\n`
  if (add_else)
    str += `<<else>>\n\n`
  return str += '<</if>>\n'
}

function makeGetSeedBlocks(seeds) {
  if (seeds == 0) return ''
  let tstr = ''
  for (let i = 0; i < seeds; ++i) {
    tstr += `<<${i ? `elseif` : `if`} $gQuest.getSeed() % ${seeds} == ${i}>>\n\n`
  }
  tstr += '<</if>>\n'
  return tstr
}

function makeIfBlocks(conditions) {
  if (conditions.length === 0)
    return ''

  let str = ''
  for (let i = 0; i < conditions.length; ++i) {
    str += `<<if ${conditions[i]}>>\n\n`
    str += `<</if>>\n`
  }

  return str
}


const ACTOR_MACROS_INFO = [
  {
    text: 'Bob / Alice / you',
    output: (key) => `<<rep ${key}>>`,
    tooltip: `Replaced by the unit's name, unless the actor is you, in which case it is replaced by "you" (in lower case).`
  },
  {
    text: 'Bob / Alice / You',
    output: (key) => `<<Rep ${key}>>`,
    tooltip: `Replaced by the unit's name, unless the actor is you, in which case it is replaced by "You" (in upper case).`,
  },
  {
    text: "Bob's / Alice's / your",
    output: (key) => `<<reps ${key}>>`,
    tooltip: `Replaced by the unit's name plus "'", unless the actor is you, in which case it is replaced by "your" (in lower case).`,
  },
  {
    text: "Bob's / Alice's / Your",
    output: (key) => `<<Reps ${key}>>`,
    tooltip: `Replaced by the unit's name plus "'", unless the actor is you, in which case it is replaced by "Your" (in upper case).`,
  },
  {
    text: 'your evil slaver Bob / you',
    output: (key) => `<<yourrep ${key}>>`,
    tooltip: `Replaced by "your [adjective] [job] [name]", unless the unit is you, in which case it is replaced by "you" (in lower case)."`,
  },
  {
    text: 'Your evil slaver Bob / You',
    output: (key) => `<<Yourrep ${key}>>`,
    tooltip: `Replaced by "Your [adjective] [job] [name]", unless the unit is you, in which case it is replaced by "You" (in upper case)."`,
  },
  {
    text: 'the slaver / the slave / you',
    output: (key) => `<<theslaver ${key}>>`,
    tooltip: `Replaced by "the [job]", unless the actor is you, in which case it is replaced by "you" (in lower case).`,
  },
  {
    text: 'The slaver / The slave / You',
    output: (key) => `<<Theslaver ${key}>>`,
    tooltip: `Replaced by "The [job]", unless the actor is you, in which case it is replaced by "You" (in upper case).`,
  },
  {
    text: 'the neko / you',
    output: (key) => `<<therace ${key}>>`,
    tooltip: `Replaced by "the [race]", unless the actor is you, in which case it is replaced by "you" (in lower case).`,
  },
  {
    text: 'The neko / You',
    output: (key) => `<<Therace ${key}>>`,
    tooltip: `Replaced by "The [race]", unless the actor is you, in which case it is replaced by "You" (in upper case).`,
  },
  {
    text: 'Name (e.g., Bob)',
    output: (key) => `<<name ${key}>>`,
    tooltip: `Replaced by the unit's name, even if the actor is you.`,
  },
  {
    text: 'Equipment (e.g., bondage armor)',
    output: (key) => `<<uequipment ${key}>>`,
    tooltip: `Replaced by a short summary of the unit's gear, e.g., "slutty leather armor".`,
  },
  {
    text: 'Unit card',
    output: (key) => `<<unitcard ${key} 1>>`,
    tooltip: `Shows the unit's details as a card. Useful for showing details of NPCs, whose stats are hidden by default.`
  }
  //{ text: 'Training banter', output: (key) => `<<ubantertraining ${key}>>` },
]
const ACTOR_VERB = [
  {
    replace: true,
    text: 'is / are',
    output: (key) => `${key}|is`,
    tooltip: `Replaced by "is", unless the actor is you, then replaced by "are".  For example, "&lt;&lt;rep &#36;g.a &gt;&gt; a|is having fun" will either become "Bob is having fun" or "You are having fun".`,
  },
  {
    replace: true,
    text: 'a|was / were',
    output: (key) => `${key}|was`,
    tooltip: `Replaced by "was", unless the actor is you, then replaced by "were".  For example, "&lt;&lt;rep &#36;g.a &gt;&gt; a|was drunk" will either become "Bob was drunk" or "You were drunk".`,
  },
  {
    replace: true,
    text: 'kiss / kisses (works for all verb)',
    output: (key) => `${key}|kiss`,
    tooltip: `Replaced by the present simple tense form of "kiss", unless the actor is you, then replaced by just "kiss".  For example, "&lt;&lt;rep &#36;g.a &gt;&gt; a|kiss a bird" will either become "Bob kisses a bird" or "You kiss a bird". There are no past tense counterpart of this, since past tense works the same way for both "Bob" and you.`,
  },
  {
    text: 'Hobby verb (e.g., lifting weights)',
    output: (key) => `<<uhobbyverb ${key}>>`,
    tooltip: `Replaced by a verb describing the hobby of the actor in present continuous term, sometimes with an object. For example, this can become "lifting weights", "eating", or "sleeping lazily under the tree".`,
  },
]

const ACTOR_OBJECT = [
  {
    text: 'Race (e.g., werewolf)',
    output: (key) => `<<urace ${key}>>`,
    tooltip: `Replaced by the unit's race, e.g, "werewolf" or "elf".`,
  },
  {
    text: 'Homeland (e.g., Western Forests)',
    output: (key) => `<<uhomeland ${key}>>`,
    tooltip: `Replaced by the unit's homeland, e.g, "City of Lucgate" or "Western Forests".`,
  },
  {
    text: 'Praisable noun (e.g., creativity)',
    output: (key) => `<<upraisenoun ${key}>>`,
    tooltip: `Replaced by a noun describing something that people can praise the actor for.`,
  },
  {
    text: 'Insultable noun (e.g., stupidity)',
    output: (key) => `<<uinsultnoun ${key}>>`,
    tooltip: `Replaced by a noun describing something that people can insult the actor for.`,
  },
]

const ACTOR_MACROS_TERMS = [
  {
    text: 'adverb (e.g., boldly)',
    output: (key) => `<<uadv ${key}>>`,
    tooltip: `Replaced by a random adverb suitable for the actor.`,
  },
  {
    text: 'adjective (e.g., strong or smart)',
    output: (key) => `<<uadj ${key}>>`,
    tooltip: `Replaced by a random adjective suitable for the actor.`,
  },
  {
    text: 'physical adjective (e.g., strong or tough)',
    output: (key) => `<<uadjphys ${key}>>`,
    tooltip: `Replaced by a random physical adjective suitable for the actor.`,
  },
  {
    text: 'praisable adjective (e.g., smart or brave)',
    output: (key) => `<<uadjgood ${key}>>`,
    tooltip: `Replaced by a random praisable adjective suitable for the actor.`,
  },
  {
    text: 'insultable adjective (e.g., dumb or careless)',
    output: (key) => `<<uadjbad ${key}>>`,
    tooltip: `Replaced by a random insultable adjective suitable for the actor.`,
  },
  {
    text: 'caring adverb (e.g., gently or silently)',
    output: (key) => `<<uadvcare ${key}>>`,
    tooltip: `Replaced by a random adjective suitable for the actor that is appropriate for taking care of others. For example, "gently" or "silently" could appear, but "cruelly" or "violently" won't appear.`,
  },
  {
    text: 'abusive adverb (e.g., cruelly or violently)',
    output: (key) => `<<uadvabuse ${key}>>`,
    tooltip: `Replaced by a random adjective suitable for the actor that is appropriate for abusing or attacking others. For example, "violently" or "decisively" could appear, but "kindly" or "gently" won't appear.`,
  },
]
const ACTOR_MACROS_PRONOUN = [
  {
    text: 'he / she / you',
    output: (key) => `<<they ${key}>>`,
    tooltip: `Replaced by he or she, unless the actor is you, then replaced by "you". An uppercase version of this exists too (&lt;&lt;They&gt;&gt; instead of &lt;&lt;they&gt;&gt;)`,
  },
  {
    text: 'him / her / you',
    output: (key) => `<<them ${key}>>`,
    tooltip: `Replaced by him or her, unless the actor is you, then replaced by "you". An uppercase version of this exists too (&lt;&lt;Them&gt;&gt; instead of &lt;&lt;them&gt;&gt;)`,
  },
  {
    text: 'his / her / your',
    output: (key) => `<<their ${key}>>`,
    tooltip: `Replaced by his or her, unless the actor is you, then replaced by "your". An uppercase version of this exists too (&lt;&lt;Their&gt;&gt; instead of &lt;&lt;their&gt;&gt;)`,
  },
  {
    text: 'his / hers / yours',
    output: (key) => `<<theirs ${key}>>`,
    tooltip: `Replaced by his or hers, unless the actor is you, then replaced by "yours". An uppercase version of this exists too (&lt;&lt;Theirs&gt;&gt; instead of &lt;&lt;theirs&gt;&gt;)`,
  },
  {
    text: 'himself / herself / yourself',
    output: (key) => `<<themselves ${key}>>`,
    tooltip: `Replaced by himself or herself, unless the actor is you, then replaced by "yourself". An uppercase version of this exists too (&lt;&lt;Themselves&gt;&gt; instead of &lt;&lt;themselves&gt;&gt;)`,
  },
  {
    text: 'man / woman',
    output: (key) => `<<woman ${key}>>`,
    tooltip: `Replaced by man or woman depending on the actor's gender.`,
  },
  {
    text: 'boy / girl',
    output: (key) => `<<girl ${key}>>`,
    tooltip: `Replaced by boy or girl depending on the actor's gender.`,
  },
  {
    text: 'master / mistress',
    output: (key) => `<<mistress ${key}>>`,
    tooltip: `Replaced by master or mistress depending on the actor's gender.`,
  },
  {
    text: 'lord / lady',
    output: (key) => `<<lady ${key}>>`,
    tooltip: `Replaced by lord or lady depending on the actor's gender.`,
  },
  {
    text: 'father / mother',
    output: (key) => `<<mother ${key}>>`,
    tooltip: `Replaced by father or mother depending on the actor's gender.`,
  },
  {
    text: 'son / daughter',
    output: (key) => `<<daughter ${key}>>`,
    tooltip: `Replaced by son or daughter depending on the actor's gender.`,
  },
  {
    text: 'butler / maid',
    output: (key) => `<<maid ${key}>>`,
    tooltip: `Replaced by butler or maid depending on the actor's gender.`,
  },
  {
    text: 'guy / girl',
    output: (key) => `<<guy ${key}>>`,
    tooltip: `Replaced by guy or girl depending on the actor's gender.`,
  },
]
const ACTOR_MACROS_BODY_HEAD = [
  {
    text: 'head',
    output: (key) => `<<uhead ${key}>>`,
  },
  {
    text: 'face (e.g., handsome face)',
    output: (key) => `<<uface ${key}>>`,
  },
  {
    text: 'mouth (e.g., muzzle)',
    output: (key) => `<<umouth ${key}>>`,
  },
  {
    text: 'eyes (e.g., draconic eyes)',
    output: (key) => `<<ueyes ${key}>>`,
  },
  {
    text: 'ears (e.g., pointy ears)',
    output: (key) => `<<uears ${key}>>`,
  },
]
const ACTOR_MACROS_BODY_UPPER = [
  {
    text: 'breasts (e.g., huge breasts or manly pecs)',
    output: (key) => `<<ubreasts ${key}>>`
  },
  {
    text: 'nipples',
    output: (key) => `<<unipples ${key}>>`,
  },
  {
    text: 'cleavage',
    output: (key) => `<<ucleavage ${key}>>`,
  },
  {
    text: 'torso (e.g., muscular body)',
    output: (key) => `<<utorso ${key}>>`,
  },
  {
    text: 'belly / abs (e.g., thin stomach or sixpacks)',
    output: (key) => `<<ubelly ${key}>>`,
  },
  {
    text: 'neck (e.g., thick neck)',
    output: (key) => `<<uneck ${key}>>`,
  },
  {
    text: 'back (e.g., muscular back)',
    output: (key) => `<<uback ${key}>>`,
  },
  {
    text: 'wings (e.g., draconic wings)',
    output: (key) => `<<uwings ${key}>>`,
  },
  {
    text: 'skin (e.g., fur or green skin)',
    output: (key) => `<<uskin ${key}>>`,
  },
  {
    text: 'waist (e.g., thin waist)',
    output: (key) => `<<uwaist ${key}>>`,
  },
]
const ACTOR_MACROS_BODY_LIMBS = [
  {
    text: 'arms (e.g., muscular arms)',
    output: (key) => `<<uarms ${key}>>`,
  },
  {
    text: 'hands (e.g., paws)',
    output: (key) => `<<uhands ${key}>>`,
  },
  {
    text: `hand (e.g., paw)`,
    output: (key) => `<<uhand ${key}>>`,
  },
  {
    text: 'legs (e.g., muscular legs)',
    output: (key) => `<<ulegs ${key}>>`,
  },
  {
    text: 'feet (e.g., digitigrade feet)',
    output: (key) => `<<ufeet ${key}>>`,
  },
]
const ACTOR_MACROS_BODY_NETHERS = [
  {
    text: 'genitals (e.g., vagina or dick)',
    output: (key) => `<<ugenital ${key}>>`,
  },
  {
    text: 'dick (e.g., large dick)',
    output: (key) => `<<udick ${key}>>`,
  },
  {
    text: 'dick / strap-on',
    output: (key) => `<<udickorstrap ${key}>>`,
    tooltip: 'Will either become a "dick" or "large dick" if the unit has a dick, or "strap-on" or "fake dick" otherwise.',
  },
  {
    text: 'balls (e.g., large balls)',
    output: (key) => `<<uballs ${key}>>`,
  },
  {
    text: 'vagina (e.g., loose vagina)',
    output: (key) => `<<uvagina ${key}>>`,
  },
  {
    text: 'anus (e.g., cavernous anus)',
    output: (key) => `<<uanus ${key}>>`,
  },
  {
    text: 'hole (e.g., tight vagina or loose anus)',
    output: (key) => `<<uhole ${key}>>`,
    tooltip: 'Will become a "vagina" if the unit has one, or "anus" otherwise',
  },
  {
    text: 'tail (e.g., draconic tail)',
    output: (key) => `<<utail ${key}>>`,
  },
  {
    text: 'cum / pussyjuice',
    output: (key) => `<<ucum ${key}>>`,
    tooltip: 'Becomes "cum" if the unit has a dick, or "pussyjuice" otherwise',
  },
]

const ACTOR_MACROS_EQUIP = [
  {
    text: 'weapon (e.g., Axe)',
    output: (key) => `<<uweapon ${key}>>`,
  },
  {
    text: 'head (e.g., Helmet)',
    output: (key) => `<<uequipslot ${key} 'head'>>`,
    tooltip: `Becomes the unit's head equipment if they are wearing one, or just "head" if nothing is worn`,
  },
  {
    text: 'neck (e.g., Cape)',
    output: (key) => `<<uequipslot ${key} 'neck'>>`,
    tooltip: `Becomes the unit's neck equipment if they are wearing one, or just "neck" if nothing is worn`,
  },
  {
    text: 'torso (e.g., Armor)',
    output: (key) => `<<uequipslot ${key} 'torso'>>`,
    tooltip: `Becomes the unit's torso equipment if they are wearing one, or just "torso" if nothing is worn`,
  },
  {
    text: 'arms (e.g., Gloves)',
    output: (key) => `<<uequipslot ${key} 'arms'>>`,
    tooltip: `Becomes the unit's arms equipment if they are wearing one, or just "arms" if nothing is worn`,
  },
  {
    text: 'legs (e.g., Pants)',
    output: (key) => `<<uequipslot ${key} 'legs'>>`,
    tooltip: `Becomes the unit's legs equipment if they are wearing one, or just "legs" if nothing is worn`,
  },
  {
    text: 'feet (e.g., Boots)',
    output: (key) => `<<uequipslot ${key} 'feet'>>`,
    tooltip: `Becomes the unit's feet equipment if they are wearing one, or just "feet" if nothing is worn`,
  },
  {
    text: 'eyes (e.g., Glasses)',
    output: (key) => `<<uequipslot ${key} 'eyes'>>`,
    tooltip: `Becomes the unit's eyes equipment if they are wearing one, or just "eyes" if nothing is worn`,
  },
  {
    text: 'mouth (e.g., Ballgag)',
    output: (key) => `<<uequipslot ${key} 'mouth'>>`,
    tooltip: `Becomes the unit's mouth equipment if they are wearing one, or just "mouth" if nothing is worn`,
  },
  {
    text: 'nipple (e.g., Nipple chains)',
    output: (key) => `<<uequipslot ${key} 'nipple'>>`,
    tooltip: `Becomes the unit's nipple equipment if they are wearing one, or just "nipple" if nothing is worn`,
  },
  {
    text: 'rear (e.g., Buttplug)',
    output: (key) => `<<uequipslot ${key} 'rear'>>`,
    tooltip: `Becomes the unit's rear equipment if they are wearing one, or just "rear" if nothing is worn`,
  },
  {
    text: 'genital (e.g., Chastity Cage)',
    output: (key) => `<<uequipslot ${key} 'genital'>>`,
    tooltip: `Becomes the unit's genital equipment if they are wearing one, or just "dick" or "vagina" if nothing is worn`,
  },
  {
    text: 'summary (e.g., armor)',
    output: (key) => `<<uequipment ${key}>>`,
    tooltip: `Describes a rough summary of the unit's entire gear.`,
  },
]

const ACTOR_MACROS_STRIP = [
  {
    text: 'strips his shirt and',
    output: (key) => `<<ustripshirtand ${key}>>`,
    tooltip: `If the unit is wearing something covering their torso, this will become "strips his [torso equipment] and". Otherwise, this is replaced by an empty string "".`,
  },
  {
    text: 'strips his pants and',
    output: (key) => `<<ustrippantsand ${key}>>`,
    tooltip: `If the unit is wearing something covering their genitals, this will become "strips his [leg equipment / rear equipment] and". Otherwise, this is replaced by an empty string "".`,
  },
  {
    text: 'remove his blindfold and',
    output: (key) => `<<ustripeyesand ${key}>>`,
    tooltip: `If the unit is wearing something covering their eyes, this will become "strips his [eyes equipment] and". Otherwise, this is replaced by an empty string "".`,
  },
  {
    text: 'unfasten his gag and',
    output: (key) => `<<ustripmouthand ${key}>>`,
    tooltip: `If the unit is wearing something covering their mouth, this will become "remove/unfasten their [mouth equipment] and". Otherwise, this is replaced by an empty string "".`,
  },
  {
    text: 'pull out his buttplug and',
    output: (key) => `<<ustripanusand ${key}>>`,
    tooltip: `If the unit is wearing something preventing the use of their anus, this will become "remove/their [rear equipment] and". Otherwise, this is replaced by an empty string "".`,
  },
  {
    text: 'pull out her dildo / unlock their chastity and',
    output: (key) => `<<ustripgenitaland ${key}>>`,
    tooltip: `If the unit is wearing something preventing the use of their vagina OR their dick, this will become "remove/pull out [genital equipment] and". Otherwise, this is replaced by an empty string "".`,
  },
  {
    text: 'strips his armor and',
    output: (key) => `<<ustripequipmentand ${key}>>`,
    tooltip: `If the unit is wearing something, this will become "strips his armor and". Otherwise, this is replaced by an empty string "".`,
  },
]

const ACTOR_MACROS_TEXT = [
  {
    text: 'punish reason (e.g., Bob disobeyed)',
    output: (key) => `<<upunishreason ${key}>>`,
    tooltip: `Returns a half sentence describing something the actor can be punished for. For example, "You punish Bob because &lt;&lt;upunishreason &#36;.bob &gt;&gt;." can become "You punish Bob because Bob showed signs of deviance."`,
  },
  {
    text: 'Your rescuer can rescue Bob',
    output: (key) => `<<uneedrescue ${key}>>`,
    tooltip: `Returns a half sentence describing how you could potentially rescue the actor. This is meant to describe units who are lost, but can still be rescued by the rescuer. The half sentence is meant to be completed by appending more text at the end. For example, "&lt;&lt;uneedrescue &#36;.bob &gt;&gt; before worse things come to pass." can become "Your Rescuer should get to work and rescue Bob before worse things come to pass."`,
  },
  {
    text: 'You need to rescue Bob now',
    output: (key) => `<<urescuenow ${key}>>`,
    tooltip: `Returns a half sentence describing how you need to rescue the actor fast. This is meant to describe units who are lost but can be immediately rescued. The half sentence is meant to be completed by appending more text at the end. For example, "&lt;&lt;urescuenow &#36;.bob &gt;&gt; before they got transformed into a full slut." can become "You need to rescue Bob now before they got transformed into a full slut."`,
  },
]

const ACTOR_MACROS_DIALOGUE = [
  {
    text: 'Create speech bubble',
    output: (key) => `<<dialogue ${key}>>
Hey boss
<</dialogue>>`,
    tooltip: `Create a speech bubble that will appear in the text. The actor is meant to be the person speaking the text.`,
  },
  {
    text: 'Your nickname from a slaver (e.g., boss)',
    output: (key) => `<<unickname ${key}>>`,
    tooltip: `How the actor likes to call you`,
  },
  {
    text: 'Your (bad) nickname from a slaver (e.g., bitch)',
    output: (key) => `<<unicknamebad ${key}>>`,
    tooltip: `How the actor likes to insultingly call you. There is also a variant where the actor has a bad nickname for another actor: &lt;&lt;unicknamebad &#36;.a &#36;.b&gt;&gt; is how a calls b insultingly`,
  },
  {
    text: 'Hey boss,',
    output: (key) => `<<ugreetingshort ${key}>>`,
    tooltip: `Returns a half sentence describing an actor greeting you. Meant to be completed by adding more to the end, for example, "&lt;&lt;ugreetingshort &#36;.bob&gt;&gt; do you want some of these chocolate?".`,
  },
  {
    text: 'Hey boss, how are you?',
    output: (key) => `<<ugreetingfull ${key}>>`,
    tooltip: 'Returns a full sentence describing an actor greeting you. Can alternatively receive two parameters, where the second parameter is the master.',
  },
  {
    text: 'Hey boss, sorry a bit busy right now',
    output: (key) => `<<ubusyshort ${key}>>`,
    tooltip: `Returns a half sentence describing an actor greeting you, but being busy with something and trying to refuse your company. Meant to be completed by either adding period or adding more sentence to the end, for example, "&lt;&lt;ubusyshort &#36;.bob&gt;&gt; cooking.".`,
  },
  {
    text: 'Mmmphhhh!!',
    output: (key) => `<<ugaggeddiscomfort ${key}>>`,
    tooltip: `Returns a muffled speech from the actor being in discomfort`,
  },
  {
    text: 'Mmphh...mmph~',
    output: (key) => `<<ugaggedpleasure ${key}>>`,
    tooltip: `Returns a muffled speech from the actor being in pleasure`,
  },
]

const ACTOR_MACROS_DIALOGUE_SLAVE = [
  {
    text: 'Yes, master.',
    output: (key) => `<<uyesmaster ${key}>>`,
    tooltip: 'Returns a full sentence describing an slave obeying their master.',
  },
  {
    text: 'Yelp...! (pet whine)',
    output: (key) => `<<upetwhine ${key}>>`,
    tooltip: 'Returns a full dialogue describing the unit whining like a pet.',
  },
]

const ACTOR_MACROS_IF_HAS = [
  {
    text: 'Has dick?',
    output: (key) => makeIfElseBlocks([`${key}.isHasDick()`], true),
    tooltip: `Conditional based on whether the actor has dick or vagina`,
  },
  {
    text: 'Has tail?',
    output: (key) => makeIfElseBlocks([`${key}.isHasTail()`], true),
    tooltip: `Conditional based on whether the actor has some kind of tail`,
  },
  {
    text: 'Has wings?',
    output: (key) => makeIfElseBlocks([`${key}.isHasWings()`], true),
    tooltip: `Conditional based on whether the actor has some kind of wings`,
  },
  {
    text: 'Has something covering genitals?',
    tooltip: `Get the item covering their genitals and optionally condition on it.`,
    output: (key) => `<<set _cover = ${key}.getGenitalCovering()>>
<<if _cover>>
  <<Reps ${key}>> <<ugenital ${key}>> is covered by <<their ${key}>> <<rep _cover>>.
  <<They ${key}>> <<ustrippantsand ${key}>> let <<their ${key}>> <<ugenital ${key}>>
  get some fresh air.
<<else>>
  <<Reps ${key}>> <<ugenital ${key}>> is bare and available for all to see.
<</if>>`,
  },
  {
    text: 'Has something covering chest / breasts?',
    tooltip: `Get the item covering their chest / breasts and optionally condition on it.`,
    output: (key) => `<<set _cover = ${key}.getChestCovering()>>
<<if _cover>>
  <<Reps ${key}>> <<ubreasts ${key}>> are covered by <<their ${key}>> <<rep _cover>>.
  <<They ${key}>> <<ustripshirtand ${key}>> let <<their ${key}>> <<ubreasts ${key}>>
  get some fresh air.
<<else>>
  <<Reps ${key}>> <<ubreasts ${key}>> is bare and available for all to see.
<</if>>`,
  },
]


const ACTOR_MACROS_IFS = [
  {
    text: 'Submissive?',
    output: (key) => makeIfElseBlocks([`${key}.isSubmissive()`], true),
    tooltip: `Conditional based on whether the actor is submissive either via the submissive trait or via slave training`,
  },
  {
    text: 'Dominant?',
    output: (key) => makeIfElseBlocks([`${key}.isDominant()`], true),
    tooltip: `Conditional based on whether the actor has the dominant trait`,
  },
  {
    text: 'Masochistic?',
    output: (key) => makeIfElseBlocks([`${key}.isMasochistic()`], true),
    tooltip: `Conditional based on whether the actor is masochistic either via the masochist trait or via slave training`,
  },
  {
    text: 'In chastity?',
    output: (key) => makeIfElseBlocks([`${key}.isInChastity()`], true),
    tooltip: `Conditional based on whether the actor is in a dick chastity`,
  },
]


const ACTOR_MACROS_INLINE_EFFECT = [
  {
    replace: true,
    text: 'Injure',
    tooltip: `Injures actor. Change the injury duration by changing the number inside "setup.qc.Injury()"`,
    output: (key) => `<<run setup.qc.Injury('${key}', 1).apply($gQuest)>>`,
  },
  {
    replace: true,
    text: 'Traumatize',
    tooltip: `Traumatize actor. Change the duration by changing the number inside "setup.qc.TraumatizeRandom()"`,
    output: (key) => `<<run setup.qc.TraumatizeRandom('${key}', 5).apply($gQuest)>>`,
  },
  {
    replace: true,
    text: 'Boonize',
    tooltip: `Give an actor a random boon. Change the duration by changing the number inside "setup.qc.TraumatizeRandom()"`,
    output: (key) => `<<run setup.qc.BoonizeRandom('${key}', 5).apply($gQuest)>>`,
  },
  {
    replace: true,
    text: 'Corrupt',
    tooltip: `Randomly corrupt an actor`,
    output: (key) => `<<run setup.qc.Corrupt('${key}').apply($gQuest)>>`,
  },
  {
    replace: true,
    text: 'Bless',
    tooltip: `Give an actor a random blessing`,
    output: (key) => `<<run setup.qc.Blessing('${key}', 1).apply($gQuest)>>`,
  },
  {
    replace: true,
    text: 'Curse',
    tooltip: `Give an actor a random curse`,
    output: (key) => `<<run setup.qc.Blessing('${key}', 1, null, true).apply($gQuest)>>`,
  },
  {
    replace: true,
    text: 'Friendship with you',
    tooltip: `Actor gain some friendship with you. Change the number inside the "setup.qc.FriendshipWithYou" to change the amount`,
    output: (key) => `<<run setup.qc.FriendshipWithYou('${key}', 50).apply($gQuest)>>`,
  },
  {
    replace: true,
    text: 'Rivalry with you',
    tooltip: `Actor gain some rivalry with you. Change the number inside the "setup.qc.FriendshipWithYou" to change the amount`,
    output: (key) => `<<run setup.qc.FriendshipWithYou('${key}', -50).apply($gQuest)>>`,
  },
]


function makeActorLabel(actor_key) {
  return actor_key === 'Player' ? actor_key : '<i>' + actor_key + '</i>'
}

/**
 * @returns {string}
 */
function getRoleTexts() {
  /**
   * @type {setup.QuestTemplate}
   */
  // @ts-ignore
  const qbase = State.variables.dtquest
  const roles = qbase.getUnitCriterias()
  return Object.keys(roles).map(key => `$g.${key}`).join(', ')
}

/**
 * @param {setup.Trait[]} trait_array 
 * @returns {string}
 */
function getTraitArrayText(trait_array) {
  return '[' + trait_array.map(trait => `'${trait.key}'`).join(', ') + ']'
}

export function generateCodeEditorToolbarItems(retainEditorFocus) {

  function makeActorMenu(macros) {
    let items = []
    for (const macro of macros) {
      let subitems = []
      for (const [actor_key, varname] of setup.DevToolHelper.getActors()) {
        let parsed = varname
        if (macro.replace) {
          if (varname.startsWith('$g.')) {
            parsed = varname.substr(3)
          } else if (varname == '$unit.player') {
            parsed = 'U'
          } else {
            throw new Error(`Unknown actor: ${varname}`)
          }
        }
        subitems.push(menuItem({
          text: makeActorLabel(actor_key),
          cssclass: "submenu-actor",
          callback: () => insertTextIntoEditor(macro.output(parsed))
        }))
      }
      items.push(menuItem({
        text: macro.text,
        children: subitems,
        tooltip: macro.tooltip,
      }))
    }
    return items
  }

  function genIfAnyRole() {

    let if_any_role = []
    if (State.variables.devtooltype == 'quest') {
      if_any_role = [
        menuItem({
          text: 'If any role...',
          tooltip: `Conditions that any one of the units going on the quest satisfy something`,
          children: () => [
            menuItem({
              text: 'If any role has ONE trait...',
              tooltip: `Conditional based on whether any one of the actors going on this quest has a certain trait, and return the actor. This can be used to setup so that the actor with the certain trait will speak up or participate in the text.`,
              callback: () => {
                retainEditorFocus(setup.DevToolHelper.pickTraits()).then(traits => {
                  if (traits && traits.length) {
                    const role_text = getRoleTexts()
                    for (const trait of traits) {
                      insertTextIntoEditor(`<<set _unit = setup.selectUnit([${role_text}], {trait: '${trait.key}'})>>\n`)
                      insertTextIntoEditor(`<<if _unit>>\n<<Rep _unit>> had trait ${trait.key}\n\n<</if>>\n\n`)
                    }
                  }
                })
              },
            }),
            menuItem({
              text: 'If any role has ANY trait...',
              tooltip: `Conditional based on whether any one of the actors going on this quest has a ANY of a set of traits, and return the actor.`,
              callback: () => {
                retainEditorFocus(setup.DevToolHelper.pickTraits()).then(traits => {
                  if (traits && traits.length) {
                    insertTextIntoEditor(
                      `<<set _unit = setup.selectUnit([${getRoleTexts()}], {anytrait: ${getTraitArrayText(traits)}})>>`
                    )
                    insertTextIntoEditor(
                      `
<<if _unit>>
<<Rep _unit>> had one of these traits: ${getTraitArrayText(traits)}
<<else>>
No unit has any one of the traits above.
<</if>>`
                    )
                  }
                })
              },
            }),
            menuItem({
              text: 'If any role has NO trait...',
              tooltip: `Conditional based on whether any one of the actors going on this quest has NONE of a set of traits, and return the actor.`,
              callback: () => {
                retainEditorFocus(setup.DevToolHelper.pickTraits()).then(traits => {
                  if (traits && traits.length) {
                    insertTextIntoEditor(
                      `<<set _unit = setup.selectUnit([${getRoleTexts()}], {notrait: ${getTraitArrayText(traits)}})>>`
                    )
                    insertTextIntoEditor(
                      `
<<if _unit>>
<<Rep _unit>> had NONE of these traits: ${getTraitArrayText(traits)}
<<else>>
No unit has any NONE of the traits above.
<</if>>`
                    )
                  }
                })
              },
            }),
            menuItem({
              text: 'If any role has ALL trait...',
              tooltip: `Conditional based on whether any one of the actors going on this quest has ALL of a set of traits, and return the actor.`,
              callback: () => {
                retainEditorFocus(setup.DevToolHelper.pickTraits()).then(traits => {
                  if (traits && traits.length) {
                    insertTextIntoEditor(
                      `<<set _unit = setup.selectUnit([${getRoleTexts()}], {alltrait: ${getTraitArrayText(traits)}})>>`
                    )
                    insertTextIntoEditor(
                      `
<<if _unit>>
<<Rep _unit>> had ALL of these traits: ${getTraitArrayText(traits)}
<<else>>
No unit has ALL of the traits above.
<</if>>`
                    )
                  }
                })
              },
            }),
            menuItem({
              text: 'If you are on the quest...',
              tooltip: `Conditional based on whether the player character is going on the quest`,
              callback: () => {
                /**
                 * @type {setup.QuestTemplate}
                 */
                // @ts-ignore
                const qbase = State.variables.dtquest
                const roles = qbase.getUnitCriterias()
                const notyou = []
                for (const role_key of Object.keys(roles)) {
                  notyou.push(
                    `<<if !$g.${role_key}.isYou()>><<run _notyou.push($g.${role_key})>><</if>>`
                  )
                }
                const remain = []
                const setyou = []
                for (let i = 0; i < Object.keys(roles).length - 1; ++i) {
                  setyou.push(`<<set _o${i + 1} = _notyou[${i}]>>`)
                  remain.push(`<<rep _o${i + 1}>>`)
                }
                const role_text = Object.keys(roles).map(key =>
                  `$g.${key}.isYou()`).join(' or ')
                insertTextIntoEditor(`<<if ${role_text}>>

    <<set _notyou = []>>
    ${notyou.join('\n')}
    ${setyou.join('\n')}

    You are going on the quest.
    The other units on the quest are:
    ${remain.join(', ')}.

    <<else>>
    You are not going on the quest.

    <</if>>`)
              }
            }),
          ],
        }),
      ]
    }
    return if_any_role
  }

  const toolbar_items = [
    menuItem({
      text: 'Subject',
      children: () => makeActorMenu(ACTOR_MACROS_INFO),
      tooltip: `Substitutes subjects of a sentence`,
    }),
    menuItem({
      text: 'Verb',
      children: () => makeActorMenu(ACTOR_VERB),
      tooltip: `Substitutes verb of a sentence`,
    }),
    menuItem({
      text: 'Noun',
      children: () => makeActorMenu(ACTOR_OBJECT),
      tooltip: `Substitutes noun in a sentence`,
    }),
    menuItem({
      text: 'Terms',
      children: () => makeActorMenu(ACTOR_MACROS_TERMS),
      tooltip: `Adjectives and adverbs`,
    }),
    menuItem({
      text: 'Pronouns',
      children: () => makeActorMenu(ACTOR_MACROS_PRONOUN),
      tooltip: `Gender-specific pronouns and words`,
    }),
    menuItem({
      text: 'Body',
      tooltip: `Expand an actor's bodypart, e.g., adding large to body or loose to anus`,
      children: () => [
        menuItem({ text: 'Nethers', children: () => makeActorMenu(ACTOR_MACROS_BODY_NETHERS) }),
        menuItem({ text: 'Limbs', children: () => makeActorMenu(ACTOR_MACROS_BODY_LIMBS) }),
        menuItem({ text: 'Upper body', children: () => makeActorMenu(ACTOR_MACROS_BODY_UPPER) }),
        menuItem({ text: 'Head', children: () => makeActorMenu(ACTOR_MACROS_BODY_HEAD) }),
      ]
    }),
    menuItem({
      text: 'Equipment',
      tooltip: `Becomes the unit's equipment, if it is wearing one, otherwise becomes the bodypart`,
      children: () => makeActorMenu(ACTOR_MACROS_EQUIP)
    }),
    menuItem({
      text: 'Sentence',
      tooltip: `Generate non-dialogue sentences or half-sentences`,
      children: () => [
        menuItem({
          text: 'Strip',
          tooltip: `Various sentences for stripping out of an equipment`,
          children: () => makeActorMenu(ACTOR_MACROS_STRIP)
        }),
        ...makeActorMenu(ACTOR_MACROS_TEXT),
      ],
    }),
    menuItem({
      text: 'Dialogue',
      tooltip: `Generate sentences or half sentences suitable inside some dialogue`,
      children: () => [
        menuItem({
          text: `Slave dialogue`,
          tooltip: `Dialogues fit for a slave`,
          children: makeActorMenu(ACTOR_MACROS_DIALOGUE_SLAVE),
        }),
        ...makeActorMenu(ACTOR_MACROS_DIALOGUE)
      ],
    }),
    menuItem({
      text: 'If actor',
      tooltip: `Conditionals based on a property of an actor. For example, this can be used to generate unique text if the actor satisfies a certain condition like having a dick or being submissive`,
      children: () => [
        ...genIfAnyRole(),
        menuItem({
          text: 'Has...',
          tooltip: `Conditional based whether the unit has something`,
          children: () => makeActorMenu(ACTOR_MACROS_IF_HAS)
        }),
        menuItem({
          text: 'Has trait...',
          tooltip: `Conditional based whether the unit has some trait(s)`,
          children: () => [
            menuItem({
              text: 'Has a trait (not stackable)?',
              tooltip: `Conditional text based on which trait the unit possess. When a unit has multiple of the traits, only the first one will be picked for generating the sentence.`,
              children: () =>
                setup.DevToolHelper.getActors().map(([actor_key, varname]) => menuItem({
                  text: makeActorLabel(actor_key),
                  cssclass: "submenu-actor",
                  callback: () => {
                    retainEditorFocus(setup.DevToolHelper.pickTraits()).then(traits => {
                      if (traits && traits.length)
                        insertTextIntoEditor(makeIfElseBlocks(traits.map(trait => `${varname}.isHasTrait('${trait.key}')`), true))
                    })
                  }
                }))
            }),
            menuItem({
              text: 'Has a trait (stackable)?',
              tooltip: `Conditional based on which trait the unit possess. When a unit has multiple of the traits, all sentences will be generated.`,
              children: () =>
                setup.DevToolHelper.getActors().map(([actor_key, varname]) => menuItem({
                  text: makeActorLabel(actor_key),
                  cssclass: "submenu-actor",
                  callback: () => {
                    retainEditorFocus(setup.DevToolHelper.pickTraits()).then(traits => {
                      if (traits && traits.length)
                        insertTextIntoEditor(makeIfBlocks(traits.map(trait => `${varname}.isHasTrait('${trait.key}')`)))
                    })
                  }
                }))
            }),
            menuItem({
              text: 'Has ALL these traits?',
              tooltip: `Conditional based on whether unit possess all of these traits.`,
              children: () =>
                setup.DevToolHelper.getActors().map(([actor_key, varname]) => menuItem({
                  text: makeActorLabel(actor_key),
                  cssclass: "submenu-actor",
                  callback: () => {
                    retainEditorFocus(setup.DevToolHelper.pickTraits()).then(traits => {
                      if (traits && traits.length)
                        insertTextIntoEditor(
                          makeIfElseBlocks(
                            [
                              `${varname}.isHasTraitsExact([${traits.map(trait => `"${trait.key}"`).join(', ')}])`,
                            ],
                            /* add else = */ true,
                          ),
                        )
                    })
                  }
                }))
            }),
            menuItem({
              text: 'Has ANY of these traits?',
              tooltip: `Conditional based on whether unit possess ANY of these traits. Unlike the above, this will only generate two outcomes: have any one, or dont have all of them.`,
              children: () =>
                setup.DevToolHelper.getActors().map(([actor_key, varname]) => menuItem({
                  text: makeActorLabel(actor_key),
                  cssclass: "submenu-actor",
                  callback: () => {
                    retainEditorFocus(setup.DevToolHelper.pickTraits()).then(traits => {
                      if (traits && traits.length)
                        insertTextIntoEditor(
                          makeIfElseBlocks(
                            [
                              `${varname}.isHasAnyTraitExact([${traits.map(trait => `"${trait.key}"`).join(', ')}])`,
                            ],
                            /* add else = */ true,
                          ),
                        )
                    })
                  }
                }))
            }),
          ],
        }),
        ...makeActorMenu(ACTOR_MACROS_IFS),
        ...makeActorMenu([{
          text: 'Has general personality?',
          tooltip: `Conditional based on the unit's general personality. A unit's personality is based on their traits, and a unit has exactly one of the five possible personalities: friendly, bold, cool, witty, or debauched. A friendly slaver is easygoing, and occasionally meek. A bold slaver is prideful, boastful, and sometimes aggressive. A cool slaver is aloof, doesn't talk much, and occasionally antisocial. A witty slaver is clever, humorous, and enjoys good entertainment. A debauched slaver is lusty, depraved, and sometimes evil.`,
          output: (key) => {
            const blocks = Object.values(setup.speech).map(speech => {
              return `${key}.getSpeech() == setup.speech.${speech.key}`
            })
            return makeIfElseBlocks(blocks, false)
          }
        }, {
          text: 'Hails from?',
          tooltip: `Conditional based on which region the unit originally hails from`,
          output: (unit_key) =>
            makeIfElseBlocks(Object.keys(setup.Text.Race.REGIONS).map(key => {
              return `${unit_key}.getHomeland() == setup.Text.Race.REGIONS.${key}`
            }), true)
        }]),
      ]
    }),
    menuItem({
      text: 'Non-Actor',
      tooltip: `Macros that generate things unrelated to actors in the quest`,
      children: () => [
        menuItem({
          text: "Company",
          tooltip: `Prints a company name with tooltips`,
          callback: () => {
            retainEditorFocus(setup.DevToolHelper.pickCompany()).then(company => {
              if (company) {
                insertTextIntoEditor(`<<rep $company.${company.key}>>`)
              }
            })
          },
        }),
        menuItem({
          text: 'Trait',
          tooltip: `Prints a trait with tooltips`,
          callback: () => {
            retainEditorFocus(setup.DevToolHelper.pickTrait()).then(trait => {
              if (trait)
                insertTextIntoEditor(`<<rep setup.trait.${trait.key}>>`)
            })
          },
        }),
        menuItem({
          text: 'Building',
          tooltip: `Prints a building name with tooltips`,
          callback: () => {
            retainEditorFocus(setup.DevToolHelper.pickBuilding()).then(building => {
              if (building)
                insertTextIntoEditor(`<<rep setup.buildingtemplate.${building.key}>>`)
            })
          },
        }),
        menuItem({
          text: 'Item',
          tooltip: `Prints an item name with tooltips`,
          callback: () => {
            retainEditorFocus(setup.DevToolHelper.pickItem()).then(item => {
              if (item)
                insertTextIntoEditor(`<<rep setup.item.${item.key}>>`)
            })
          },
        }),
        menuItem({
          text: 'Equipment',
          tooltip: `Prints an equipment name with tooltips`,
          callback: () => {
            retainEditorFocus(setup.DevToolHelper.pickEquipment()).then(equipment => {
              if (equipment)
                insertTextIntoEditor(`<<rep setup.equipment.${equipment.key}>>`)
            })
          },
        }),
        menuItem({
          text: 'Lore',
          tooltip: `Prints a lore item with tooltips`,
          callback: () => {
            retainEditorFocus(setup.DevToolHelper.pickLore()).then(lore => {
              if (lore)
                insertTextIntoEditor(`<<lore ${lore.key}>>`)
            })
          },
        }),
        menuItem({
          text: 'Set variable """_u""" to any slaver',
          tooltip: `Setups a variable to be any slaver within your company, with a bigger preference towards your vice leader and your on-duty slavers. This can be used to generate a unit that can comments on various situations without actually partaking in the content itself.`,
          callback: () => {
            insertTextIntoEditor(`<<set _u = setup.getAnySlaver()>>`)
          }
        }),
        menuItem({
          text: 'Random noun (e.g., "bananas")',
          tooltip: `Replaced with a random topic noun`,
          callback: () => {
            insertTextIntoEditor('<<topic>>')
          }
        }),
        menuItem({
          text: 'Slaver on a certain duty',
          tooltip: `Set a variable to be the slaver on a particular duty, if any`,
          callback: () => {
            retainEditorFocus(setup.DevToolHelper.pickDutyTemplate()).then(template => {
              if (template)
                insertTextIntoEditor(`<<set _u = setup.getUnit({duty: '${template.key}'})>>
<<if _u>>
<<Rep _u>> is your ${template.getName()}.
<<else>>
You do not have a ${template.getName()}.
<</if>>`)
            })
          },
        }),
      ]
    }),
    menuItem({
      text: 'Formatting',
      tooltip: 'Related to text formatting',
      children: () => [
        menuItem({
          text: 'Money',
          tooltip: 'Formats a money amount. The example formats 2000g',
          callback: () => {
            insertTextIntoEditor(`<<money 2000>>`)
          },
        }),
        menuItem({
          text: 'Favor',
          tooltip: 'Formats a favor amount. The example formats 15.0 favor. Note that the amount is multiplied by 10 inside the code.',
          callback: () => {
            insertTextIntoEditor(`<<favor 150>>`)
          },
        }),
        menuItem({
          text: 'Font',
          tooltip: 'Create a segment of text using race font. You can also use a font name instead.',
          children: () => setup.TraitHelper.getAllTraitsOfTags(['subrace']).map(trait =>
            menuItem({
              text: trait.rep(),
              callback: () => {
                insertTextIntoEditor(`<<font '${trait.key}'>>
  Type your sentence here!
<</font>>`)
              }
            })
          ),
        }),
        menuItem({
          text: 'Font size',
          tooltip: 'Create a segment of text using a different font size.',
          children: () => {
            const sizes = [12, 16, 20, 24, 28, 32, 48, 64, 128]
            return sizes.map(size =>
              menuItem({
                text: `${size}px`,
                callback: () => {
                  insertTextIntoEditor(`<<fontsize ${size}>>
    Type your sentence here!
  <</fontsize>>`)
                }
              })
            )
          }
        }),
        menuItem({
          text: 'Letter card',
          tooltip: 'Creates a text segment styled to look like a written letter.',
          callback: () => {
            insertTextIntoEditor(`<div class='lettercard'>
<p>
Dear <<name $unit.player>>,
</p>
<p>
Goodbye,
</p>
<p>
Your most ardent admirer
</p>
</div>`)
          }
        }),
        menuItem({
          text: 'Highlight green + bold',
          tooltip: 'Highlights a text in green and bold it',
          callback: () => {
            insertTextIntoEditor(`<<successtext "i am green">>`)
          }
        }),
        menuItem({
          text: 'Highlight green',
          tooltip: 'Highlights a text in green',
          callback: () => {
            insertTextIntoEditor(`<<successtextlite "i am green">>`)
          }
        }),
        menuItem({
          text: 'Highlight red',
          tooltip: 'Highlights a text in red',
          callback: () => {
            insertTextIntoEditor(`<<dangertextlite "i am red">>`)
          }
        }),
        menuItem({
          text: 'Highlight red + bold',
          tooltip: 'Highlights a text in red and bold it',
          callback: () => {
            insertTextIntoEditor(`<<dangertext "i am red">>`)
          }
        }),
      ],
    }),
  ]

  if (State.variables.devtooltype != 'interaction') {
    toolbar_items.push(
      menuItem({
        text: 'Conditionals',
        tooltip: 'Allowing you to show different texts depending on certain non-actor-related conditions',
        children: () => {
          const children = [
            menuItem({
              text: 'If building exists...',
              tooltip: `Conditionals based on whether you already built a certain building`,
              callback: () => {
                retainEditorFocus(setup.DevToolHelper.pickBuilding()).then(building => {
                  if (building)
                    insertTextIntoEditor(`<<if $fort.player.isHasBuilding("${building.key}")>>
You have the building.
<<else>>
You do not have the building.
<</if>>`)
                })
              },
            }),
            menuItem({
              text: 'If you have item...',
              tooltip: `Conditionals based on whether you already have a certain item`,
              callback: () => {
                retainEditorFocus(setup.DevToolHelper.pickItem()).then(item => {
                  if (item)
                    insertTextIntoEditor(`<<if $inventory.isHasItem("${item.key}")>>
You have the item.
<<else>>
You do not have the item.
<</if>>`)
                })
              },
            }),
            menuItem({
              text: 'If variable...',
              tooltip: `Conditionals based on the value of a certain variable that might have been set by earlier quests / events`,
              children: [
                menuItem({
                  text: 'If variable equals',
                  tooltip: `Whether the variable is equal some value`,
                  callback: () => {
                    insertTextIntoEditor(`<<if setup.qres.VarEqual("variable_name", "1").isOk($gQuest)>>
Variable variable_name is equal to 1
<<else>>
Variable variable_name is not equal to 1
<</if>>`)
                  }
                }),
                menuItem({
                  text: 'If variable is greater or equal to',
                  tooltip: `Whether the variable value is greater or equal some value`,
                  callback: () => {
                    insertTextIntoEditor(`<<if setup.qres.VarGte("variable_name", 2).isOk($gQuest)>>
Variable variable_name is greater than or equal to 2
<<else>>
Variable variable_name is not greater than or equal to 2
<</if>>`)
                  }
                }),
                menuItem({
                  text: 'If variable is unset',
                  tooltip: `Whether the variable is not set`,
                  callback: () => {
                    insertTextIntoEditor(`<<if setup.qres.VarNull("variable_name").isOk($gQuest)>>
Variable variable_name is not set
<<else>>
Variable variable_name is set
<</if>>`)
                  }
                }),
              ]
            }),
          ]
          if (State.variables.devtooltype == 'quest') {
            children.push(
              menuItem({
                text: "If... outcomes",
                tooltip: `Conditionals based on the quest outcome. For example, you can use this to generate special tests on a critical success.`,
                callback: () => {
                  insertTextIntoEditor(makeIfElseBlocks([`$gOutcome == 'crit'`, `$gOutcome == 'success'`, `$gOutcome == 'failure'`, `$gOutcome == 'disaster'`]))
                }
              }),
            )
            children.push(
              menuItem({
                text: "If ever successfully completed this quest",
                tooltip: `Conditionals based on whether you've completed (success or critical) on this quest in the past before`,
                callback: () => {
                  insertTextIntoEditor(`<<if setup.qres.QuestDone().isOk($gQuest)>>
  You have completed this quest in the past.
<<else>>
  You have never completed this quest in the past.
<</if>>`)
                }
              }),
            )
          }
          children.push(
            menuItem({
              text: "If... seed",
              tooltip: `Conditionals based on the quest's randomly picked seed. This effectively is a random choice out of the number of outcomes you pick.`,
              children: [
                menuItem({
                  text: "2 outcomes", callback: () => {
                    insertTextIntoEditor(makeGetSeedBlocks(2))
                  }
                }),
                menuItem({
                  text: "3 outcomes", callback: () => {
                    insertTextIntoEditor(makeGetSeedBlocks(3))
                  }
                }),
                menuItem({
                  text: "4 outcomes", callback: () => {
                    insertTextIntoEditor(makeGetSeedBlocks(4))
                  }
                }),
                menuItem({
                  text: "5 outcomes", callback: () => {
                    insertTextIntoEditor(makeGetSeedBlocks(5))
                  }
                }),
                menuItem({
                  text: "6 outcomes", callback: () => {
                    insertTextIntoEditor(makeGetSeedBlocks(6))
                  }
                }),
                menuItem({
                  text: "7 outcomes", callback: () => {
                    insertTextIntoEditor(makeGetSeedBlocks(7))
                  }
                }),
                menuItem({
                  text: "8 outcomes", callback: () => {
                    insertTextIntoEditor(makeGetSeedBlocks(8))
                  }
                }),
                menuItem({
                  text: "9 outcomes", callback: () => {
                    insertTextIntoEditor(makeGetSeedBlocks(9))
                  }
                }),
                menuItem({
                  text: "10 outcomes", callback: () => {
                    insertTextIntoEditor(makeGetSeedBlocks(10))
                  }
                }),
              ]
            }),
          )
          return children
        }
      }),

      menuItem({
        text: 'Advanced',
        tooltip: 'Advanced features for complex cases',
        children: () => [
          menuItem({
            text: 'Inline effect...',
            tooltip: `Gives gameplay effect inside the text`,
            children: [
              menuItem({
                text: 'Actor-related',
                tooltip: `Actor gains some gameplay effect such as a curse or trauma`,
                children: () => makeActorMenu(ACTOR_MACROS_INLINE_EFFECT),
              }),
              menuItem({
                text: 'Gain/Lose money',
                tooltip: `Gain/Lose some money. You can adjust the numbers by changing the number inside the "setup.qc.Money()". Negative amount means losing money.`,
                callback: () => {
                  insertTextIntoEditor(`<<run setup.qc.Money(1000).apply($gQuest)>>`)
                },
              }),
              menuItem({
                text: 'Gain item/equipment',
                tooltip: `Gain an item or an equipment.`,
                children: [
                  menuItem({
                    text: 'Gain an item',
                    callback: () => {
                      retainEditorFocus(setup.DevToolHelper.pickItem()).then(item => {
                        if (item)
                          insertTextIntoEditor(`<<run setup.qc.Item('${item.key}').apply($gQuest)>>`)
                      })
                    },
                  }),
                  menuItem({
                    text: 'Gain a random item',
                    tooltip: `Gives a random item out of a pool of items`,
                    callback: () => {
                      retainEditorFocus(setup.DevToolHelper.pickItemPool()).then(pool => {
                        if (pool)
                          insertTextIntoEditor(`<<run setup.qc.ItemPool('${pool.key}').apply($gQuest)>>`)
                      })
                    },
                  }),
                  menuItem({
                    text: 'Gain an equipment',
                    callback: () => {
                      retainEditorFocus(setup.DevToolHelper.pickEquipment()).then(equipment => {
                        if (equipment)
                          insertTextIntoEditor(`<<run setup.qc.EquipmentDirect('${equipment.key}').apply($gQuest)>>`)
                      })
                    },
                  }),
                  menuItem({
                    text: 'Gain a random equipment',
                    tooltip: `Gives a random equipment out of a pool of equipments`,
                    callback: () => {
                      retainEditorFocus(setup.DevToolHelper.pickEquipmentPool()).then(pool => {
                        if (pool)
                          insertTextIntoEditor(`<<run setup.qc.Equipment('${pool.key}').apply($gQuest)>>`)
                      })
                    },
                  }),
                ],
              }),
              menuItem({
                text: 'Gain favor',
                tooltip: `Gain favor with some company. You can adjust the numbers by changing the number inside the "setup.qc.Favor()".`,
                callback: () => {
                  retainEditorFocus(setup.DevToolHelper.pickCompany()).then(company => {
                    if (company) {
                      insertTextIntoEditor(`<<run setup.qc.Favor('${company.key}', 25).apply($gQuest)>>`)
                    }
                  })
                },
              }),
              menuItem({
                text: 'Gain ire',
                tooltip: `Gain ire with some company. You can adjust the numbers by changing the number inside the "setup.qc.Ire()".`,
                callback: () => {
                  retainEditorFocus(setup.DevToolHelper.pickCompany()).then(company => {
                    if (company) {
                      insertTextIntoEditor(`<<run setup.qc.Ire('${company.key}', 2).apply($gQuest)>>`)
                    }
                  })
                },
              }),
              menuItem({
                text: 'Advanced',
                children: () => [
                  menuItem({
                    text: `Set variable value`,
                    tooltip: `Set the value of a certain variable to a certain number. This example sets the value of "put_variable_name_here" to 5 forever (the forever is represented by the "-1")`,
                    callback: () => {
                      insertTextIntoEditor(`<<run setup.qc.VarSet('put_variable_name_here', '5', -1).apply($gQuest)>>`)
                    },
                  }),
                  menuItem({
                    text: `Increase variable value`,
                    tooltip: `Increase the value of a certain variable by a certain amount. This example INCREASE the value of "put_variable_name_here" to 3 forever (the forever is represented by the "-1"). For example, if it was "2" before, then it becomes "5". If it was not defined before, then it becomes "3".`,
                    callback: () => {
                      insertTextIntoEditor(`<<run setup.qc.VarAdd('put_variable_name_here', '3', -1).apply($gQuest)>>`)
                    },
                  }),
                  menuItem({
                    text: `Delete variable`,
                    tooltip: `Unsets the value of a certain variable.`,
                    callback: () => {
                      insertTextIntoEditor(`<<run setup.qc.VarRemove('put_variable_name_here').apply($gQuest)>>`)
                    },
                  }),
                ]
              }),
            ],
          }),
          menuItem({
            text: 'Inline choice...',
            tooltip: `Gives the player an OPTIONAL choice with effects. Usually combined with inline effects`,
            callback: () => {
              insertTextIntoEditor(`<<choose>>
<<opt "Option 1">>

This text appears when you click option 1.

<<opt "Option 2">>

You can add even more options by adding more of the opt macros.

<<optif $unit.player.isMale()>>
<<opt "Option 3 only appears if the player is male">>

This is an example of a conditional option that will only be displayed when
a certain condition is satisfied.
In this example, this option will not be displayed if the player is female.

<</choose>>
`)
            },
          }),
          menuItem({
            text: 'Get unit in your company...',
            tooltip: `Allows you to select a non-actor unit among units in your company`,
            callback: () => {
              insertTextIntoEditor(`<<set _u = setup.getUnit({
  /* Delete entries that you do not need: */

  /* only pick units of this job. Leaving this empty allow picking NPCs. Possible options: 'slaver', 'slave' */
  job: 'slaver',

  /* unit must have this specific tag. */
  tag: 'unittagname',

  /* unit must have the title with this title key */
  title: 'quest_slave_leader_of_the_company_0',

  /* unit must be available to go on some quest. Note that on duty units are eligible */
  available: true,

  /* unit is chosen at random from all possible units that satisfy these conditions */
  random: true,

  /* unit must have ALL of these traits. */
  alltraits: ['per_cruel', 'per_evil', ],

  /* unit must have ANY of these traits. */
  anytraits: ['muscle_verystrong', 'muscle_extremelystrong', 'tough_tough', ],

  /* unit cannot be the player character */
  notyou: true,

  /* unit must be injured */
  injured: true,

  /* will return the unit that has maximum skill at this skill, among all eligible units */
  skill_max: setup.skill.arcane,
})>>

<<if _u>>
  <<Rep _u>> tells you to continue writing the quest.
<<else>>
  <<missingunitquest>>
<</if>>
`)
            },
          }),
          menuItem({
            text: 'Unit required for this mission is no longer available',
            tooltip: `Give a generic message telling player that a certain quest is no longer complete-able because you are missing a unit`,
            callback: () => {
              insertTextIntoEditor(`<<missingunitquest>>`)
            },
          }),
        ],
      })
    )
  }

  return toolbar_items
}
