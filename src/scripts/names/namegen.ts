//@ts-nocheck

import { team_adjective } from "./_team_adjective"
import { team_noun } from "./_team_noun"

const fantasy_nameset = {
  male_first: () => setup.rng.choice(setup.NAME_fantasy_male_first_name),
  female_first: () => setup.rng.choice(setup.NAME_fantasy_female_first_name),
  surname: () => setup.rng.choice(setup.NAME_fantasy_surname),
}

const norse_nameset = {
  male_first: () => setup.rng.choice(setup.NAME_norse_male_first_name),
  female_first: () => setup.rng.choice(setup.NAME_norse_female_first_name),
  surname: () => setup.rng.choice(setup.NAME_norse_surname),
}

// werewolves share surname with norse
const werewolf_nameset = {
  male_first: () => setup.rng.choice(setup.NAME_werewolf_male_first_name),
  female_first: () => setup.rng.choice(setup.NAME_werewolf_female_first_name),
  surname: () => setup.rng.choice(setup.NAME_norse_surname),
}

const arabic_nameset = {
  male_first: () => setup.rng.choice(setup.NAME_arabic_male_first_name),
  female_first: () => setup.rng.choice(setup.NAME_arabic_female_first_name),
  surname: () => setup.rng.choice(setup.NAME_arabic_surname),
}

const japanese_nameset = {
  male_first: () => setup.rng.choice(setup.NAME_japanese_male_first_name),
  female_first: () => setup.rng.choice(setup.NAME_japanese_female_first_name),
  surname: () => setup.rng.choice(setup.NAME_japanese_surname),
}

const neko_nameset = {
  male_first: () => setup.rng.choice(setup.NAME_neko_male_first_name),
  female_first: () => setup.rng.choice(setup.NAME_neko_female_first_name),
  surname: () => setup.rng.choice(setup.NAME_neko_surname),
}

const elf_nameset = {
  male_first: () => setup.rng.choice(setup.NAME_elf_male_first_name),
  female_first: () => setup.rng.choice(setup.NAME_elf_female_first_name),
  surname: () => setup.NAME_elf_surname(),
}

const drow_nameset = {
  male_first: () => setup.rng.choice(setup.NAME_drow_male_first_name),
  female_first: () => setup.rng.choice(setup.NAME_drow_female_first_name),
  surname: () => setup.rng.choice(setup.NAME_drow_surname),
}

const orc_nameset = {
  male_first: () => setup.rng.choice(setup.NAME_orc_male_first_name),
  female_first: () => setup.rng.choice(setup.NAME_orc_female_first_name),
  surname: () => setup.rng.choice(setup.NAME_orc_surname),
}

const demonkin_nameset = {
  male_first: () => setup.rng.choice(setup.NAME_demonkin_male_first_name),
  female_first: () => setup.rng.choice(setup.NAME_demonkin_female_first_name),
  surname: () => setup.rng.choice(setup.NAME_demonkin_surname),
}

const kobold_nameset = {
  male_first: () => setup.NAME_kobold_male_first_name(),
  female_first: () => setup.NAME_kobold_female_first_name(),
  surname: () => setup.NAME_kobold_surname(),
}

// lizardkin does not have surname
const lizardkin_nameset = {
  male_first: () => setup.rng.choice(setup.NAME_lizardkin_male_first_name),
  female_first: () => setup.rng.choice(setup.NAME_lizardkin_female_first_name),
  surname: () => '',
}

// dragons does not have surname
const dragonkin_nameset = {
  male_first: () => setup.NAME_dragonkin_male_first_name(),
  female_first: () => setup.NAME_dragonkin_female_first_name(),
  surname: () => '',
}

// demons does not have surname
const demon_nameset = {
  male_first: () => setup.NAME_demon_male_first_name(),
  female_first: () => setup.NAME_demon_female_first_name(),
  surname: () => '',
}

// angels does not have surname
const angel_nameset = {
  male_first: () => setup.NAME_angel_male_first_name(),
  female_first: () => setup.NAME_angel_female_first_name(),
  surname: () => '',
}

export function generateUnitName(traits) {
  // Generate a random (unique) name from traits
  let nameset = fantasy_nameset
  if (traits.includes(setup.trait.subrace_angel)) {
    nameset = angel_nameset
  } else if (traits.includes(setup.trait.subrace_humanvale)) {
    nameset = norse_nameset
  } else if (traits.includes(setup.trait.subrace_humandesert)) {
    nameset = arabic_nameset
  } else if (traits.includes(setup.trait.subrace_humansea)) {
    nameset = japanese_nameset
  } else if (traits.includes(setup.trait.subrace_werewolf)) {
    nameset = werewolf_nameset
  } else if (traits.includes(setup.trait.subrace_elf)) {
    nameset = elf_nameset
  } else if (traits.includes(setup.trait.subrace_drow)) {
    nameset = drow_nameset
  } else if (traits.includes(setup.trait.subrace_fairy)) {
    nameset = elf_nameset
  } else if (traits.includes(setup.trait.subrace_neko)) {
    nameset = neko_nameset
  } else if (traits.includes(setup.trait.subrace_tigerkin)) {
    nameset = neko_nameset
  } else if (traits.includes(setup.trait.subrace_orc)) {
    nameset = orc_nameset
  } else if (traits.includes(setup.trait.subrace_dragonkin)) {
    nameset = dragonkin_nameset
  } else if (traits.includes(setup.trait.subrace_lizardkin)) {
    nameset = lizardkin_nameset
  } else if (traits.includes(setup.trait.subrace_kobold)) {
    nameset = kobold_nameset
  } else if (traits.includes(setup.trait.subrace_demon)) {
    nameset = demon_nameset
  } else if (traits.includes(setup.trait.subrace_demonkin)) {
    nameset = demonkin_nameset
  }

  let surname = nameset.surname()
  let firstname = null
  if (traits.includes(setup.trait.gender_male)) {
    firstname = nameset.male_first()
  }
  if (traits.includes(setup.trait.gender_female)) {
    firstname = nameset.female_first()
  }
  if (!firstname) {
    console.log(traits)
    throw new Error(`Gender not found`)
  }

  return [firstname, surname]
}

export function generateTeamName() {
  return `${setup.capitalize(setup.rng.choice(team_adjective))} ${setup.capitalize(setup.rng.choice(team_noun))}`
}
