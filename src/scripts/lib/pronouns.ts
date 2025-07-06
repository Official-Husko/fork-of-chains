// @ts-nocheck

/*
 * Simple pronoun macros (and related things).
 * 
 * Use like <<they>>, <<them>>, <<their>>, <<theirs>>, <<themselves>> and capitalized versions of it.
 * If used without a parameter, checks the gender for $PC, else the provided parameter:
 * <<them _character>> can result in "him", "her" or "it", for example.
 * 
 * The reason for <<they>> and not <<he>> or <<she>> is that both have multiple usages
 * covered with a single variant. <<her>> can be "him" or "his" if used on a male character
 * and <<his>> can be "her" or "hers" when used on a female one.
 *
 * Modify (in particular in regards to the aliases and supported macros) to fit your game.
 *
 * Supported gendered macros (and their aliases)
 * # Pronouns:
 *   <<they>> = <<he>> = <<she>>
 *   <<They>> = <<He>> = <<She>>
 *   <<them>> = <<herhim>>
 *   <<Them>> = <<Herhim>>
 *   <<their>> = <<herhis>>
 *   <<Their>> = <<Herhis>>
 *   <<theirs>> = <<hershis>>
 *   <<Theirs>> = <<Hershis>>
 *   <<themselves>> = <<himself>> = <<herself>> = <<themself>>
 *   <<Themselves>> = <<Himself>> = <<Herself>> = <<Themself>>
 * # Other gendered nouns:
 *   <<wife>> = <<husband>>
 *   <<woman>> = <<man>>
 *   <<women>> = <<men>>
 *   <<girl>> = <<boy>> = <<child>>
 *   <<daughter>> = <<son>>
 *   <<mother>> = <<father>>
 *   <<mistress>> = <<master>>
 *   <<Mistress>> = <<Master>>
 *   <<beauty>>
 *   <<wet>> = <<hard>>
 *   <<lady>> = <<lord>>
 *   <<succubus>> = <<incubus>>
 *   <<queen>> = <<king>>
*/

import { Args_OneActor } from "../macro/_meta.js"

// Predefined internal data structure to speed up lookup. The order is:
// subjective, objective, dependent possessive, independent possessive, reflexive
// + capitalized variants
export const pronouns = {
	"he": ["he", "him", "his", "his", "himself", "He", "Him", "His", "His", "Himself", "husband", "man", "boy", "son", "master", "handsomeness", 'hard', 'soft', 'lord', 'butler', 'incubus', 'bachelor', 'prince', 'father', 'male', 'lad', 'men', 'king', 'Master', 'guy', 'handsome',],
	"she": ["she", "her", "her", "hers", "herself", "She", "Her", "Her", "Hers", "Herself", "wife", "woman", "girl", "daughter", "mistress", "beauty", 'wet', 'dry', 'lady', 'maid', 'succubus', 'maiden', 'princess', 'mother', 'female', 'lass', 'women', 'queen', 'Mistress', 'girl', 'beautiful',],
	"it": ["it", "it", "its", "its", "itself", "It", "It", "Its", "Its", "Itself", "partner", "person", "child", "child", "master", "beauty", 'aroused', 'unaroused', 'lord', 'servant', 'demon', 'person', 'noble', 'parent', 'male', 'guy', 'people', 'royal', 'Master', 'guy', 'attractive',],
	"one": ["one", "one", "one's", "one's", "oneself", "One", "One", "One's", "One's", "Oneself", "partner", "someone", "a child", "a child", "a master", "beauty", 'aroused', 'unaroused', 'lord', 'servant', 'demons', 'person', 'noble', 'parent', 'male', 'guy', 'people', 'royal', 'Master', 'guy', 'attractive',],
	// "The default name:""
	"they": ["they", "them", "their", "theirs", "themself", "They", "Them", "Their", "Theirs", "Themselves", "wife", "woman", "girl", "daughter", "mistress", "beauty", 'wet', 'dry', 'lady', 'maid', 'succubus', 'maiden', 'princess', 'mother', 'female', 'lass', 'women', 'queen', "Mistress", 'guy', 'attractive',],
	"you": ["you", "you", "your", "yours", "yourself", "You", "You", "Your", "Yours", "Yourself"],
};

// Assumes the "gender" attribute is "male" or "female", and supports an optional "pronoun" attribute to override it.
// Change to fit how your game determines someone's pronouns
export const getBasePronoun = (character, index) => {
	if (character.isYou() && pronouns['you'].length > index) return 'you'
	if (character.isFemale()) return 'she'
	return 'he'
};

// Returns the $PC if not set. Expand as necessary to fit your game.
export const getRelevantCharacter = (character) => {
	if (setup.isString(character)) return State.variables.unit[character]
	return character
};

function internalOutput(output, character, index) {
	output.appendChild(document.createTextNode(pronouns[getBasePronoun(getRelevantCharacter(character), index)][index]));
}

// helper that also fills MACROS_METADATA
function Macro_add(name, def) {
	if (typeof def === "string") { // alias
		Macro.add(name, def)
		setup.MACROS_METADATA[name] = def
	} else {
		const index = def
		Macro.add(name, {
			handler() { internalOutput(this.output, this.args[0], index) }
		})
		setup.MACROS_METADATA[name] = {
			info: `Renders as "<b>${pronouns['he'][index]}</b>" or "<b>${pronouns['she'][index]}</b>" depending on the actor's gender`,
			args: Args_OneActor
		}
	}
}

Macro_add('they', 0);
Macro_add('them', 1);
Macro_add('their', 2);
Macro_add('theirs', 3);
Macro_add('themselves', 4);
Macro_add('They', 5);
Macro_add('Them', 6);
Macro_add('Their', 7);
Macro_add('Theirs', 8);
Macro_add('Themselves', 9);
Macro_add('wife', 10);
Macro_add('woman', 11);
Macro_add('girl', 12);
Macro_add('daughter', 13);
Macro_add('mistress', 14);
Macro_add('beauty', 15);
Macro_add('wet', 16);
Macro_add('dry', 17);
Macro_add('lady', 18);
Macro_add('maid', 19);
Macro_add('succubus', 20);
Macro_add('maiden', 21);
Macro_add('princess', 22);
Macro_add('mother', 23);
Macro_add('female', 24);
Macro_add('lass', 25);
Macro_add('women', 26);
Macro_add('queen', 27);
Macro_add('Mistress', 28);
Macro_add('guy', 29);
Macro_add('beautiful', 30);

// Aliases
Macro_add('he', 'they');
Macro_add('He', 'They');
Macro_add('she', 'they');
Macro_add('She', 'They');
Macro_add('herhim', 'them');
Macro_add('Herhim', 'Them');
Macro_add('herhis', 'their');
Macro_add('Herhis', 'Their');
Macro_add('hershis', 'theirs');
Macro_add('Hershis', 'Theirs');
Macro_add('himself', 'themselves');
Macro_add('herself', 'themselves');
Macro_add('themself', 'themselves');
Macro_add('Himself', 'Themselves');
Macro_add('Herself', 'Themselves');
Macro_add('Themself', 'Themselves');
Macro_add('husband', 'wife');
Macro_add('man', 'woman');
Macro_add('boy', 'girl');
Macro_add('child', 'girl');
Macro_add('son', 'daughter');
Macro_add('master', 'mistress');
Macro_add('hard', 'wet');
Macro_add('soft', 'dry');
Macro_add('lord', 'lady');
Macro_add('butler', 'maid');
Macro_add('incubus', 'succubus');
Macro_add('bachelor', 'maiden');
Macro_add('prince', 'princess');
Macro_add('father', 'mother');
Macro_add('male', 'female');
Macro_add('lad', 'lass');
Macro_add('men', 'women');
Macro_add('king', 'queen');
Macro_add('Master', 'Mistress');
Macro_add('handsome', 'beautiful');

Macro.add('pronounload', {
	handler() {
		// load all pronouns in an object
		let obj = this.args[0]
		let unit = this.args[1]

		setup.DOM.pronounload(obj, unit)
	}
});

