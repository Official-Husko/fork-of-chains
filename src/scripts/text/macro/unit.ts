/*
  Text macros for units. For every <<uxxx unit>> there is a <<uxxxall unit>> version that gives equipment desc.
  For example, <<utorso unit>> becomes <<utorsoall unit>>: muscular body protected by chainmail

  <<utorso unit>>: muscular body
  <<uback unit>>: muscular back
  <<ubelly unit>>: six packs
  <<uwaist unit>>: narrow waist
  <<uhead unit>>: head
  <<uface unit>>: handsome face
  <<umouth unit>>: draconic mouth
  <<ueyes unit>>: cat-like eyes
  <<uears unit>>: elven ears
  <<uhorns unit>>: elven ears
  <<ubreast unit>>: manly chest
  <<ucleavage unit>>: manly chest
  <<uneck unit>>: thick neck
  <<uwings unit>>: draconic wings
  <<uarms unit>>: muscular arms
  <<ulegs unit>>: slim legs
  <<ufeet unit>>: digitigrade feet
  <<utail unit>>: draconic tail
  <<udick unit>>: large dick
  <<udickorstrap unit>>: large dick or strap-on
  <<uballs unit>>: large balls
  <<uvagina unit>>: gaping vagina
  <<uanus unit>>: gaping anus
  <<uhole unit>>: gaping anus
  <<unipple unit>>: nipple
  <<uhands unit>>: hands
  <<ugenital unit>>: large dick and balls
  <<utongue unit>>: elongated tongue
  <<utailtip unit>>: sharp tip
  <<udickhead unit>>: head
  <<uteeth unit>>: teeth / fangs

  OTHERS:
  <<uequipment unit>>: valuable slutty bondage armor
  <<ubantertraining unit>>: "John cannot help but craves your attention."
  <<uadjphys unit>>: muscular   (random physical adjective)
  <<uadj unit>>: smart     (random adjective)
  <<uadjgood unit>>: smart     (random adjective)
  <<uadjbad unit>>: dumb (random adjective)
  <<uadv unit>>: smartly   (random adverb)
  <<urace unit>>: neko
  <<uhomeland unit>>: neko
  <<uweapon unit>>: sword  (unit's weapon. Always melee. unit always have a weapon)
  <<uaweapon unit>>: a sword

  <<upraisenoun unit>>: bravery (or handsomeness, etc)
  <<uinsultnoun unit>>: bravery (or handsomeness, etc)
  <<uhobbyverb unit>>: reminiscing about his past

  <<ustriptorso unit>>: "John took off his shirt"
  <<ustriplegs unit>>: "John pull down his pants"
  <<ustripanus unit>>: "John took out his buttplug"
  <<ustripgenital unit>>: "John took out his buttplug"
  <<ustripmouth unit>>: "John took of his gag"
  <<ustripvagina unit>>: "Alice took out her dildo"
  <<ustripdick unit>>: "You unlocks John's chastity cage"
  <<ustripnipple unit>>: "John took of his nipple clamps"
  <<uslaverstripall unit>>: "Your slavers stripped unit naked out of their bondage gear"

  <<upunishreason unit>>: "unit failed at their job"
  <<uneedrescue unit>>: "Hearing the news, you sigh audibly while ordering your rescuer Bob to start working"
  <<urescuenow unit>>: "Hearing the news, you sigh as you immediately get to work locating the slaver before worse come to pass"

  <<ustripshirtand unit>> "strips his shirt and"
  <<ustrippantsand unit>> "strips his pants and"
  <<ustripequipmentand unit>> "strips his armor and"
*/

import { Args_OneActor, MacroUtil } from "../../macro/_metadata";
import { Text } from "../text";

function internalOutput(
  output: HTMLElement | DocumentFragment,
  func: (unit: Unit) => string,
  unit_raw: Unit | UnitKey,
  article?: boolean,
) {
  const unit = resolveObject(unit_raw, State.variables.unit);

  let raw = func(unit);
  if (article) raw = setup.Article(raw);

  output.append(setup.DOM.Util.twee(raw));
}

function internalOutputUnitTarget<T extends Unit | null>(
  output: HTMLElement | DocumentFragment,
  func: (arg: { unit: Unit; target: T }) => string,
  unit_raw: Unit,
  target_raw: T,
) {
  let unit = resolveObject(unit_raw, State.variables.unit);
  let target;
  if (target_raw) {
    target = resolveObject(target_raw, State.variables.unit);
  } else {
    target = null;
  }
  let raw = func({ unit: unit, target: target as T });
  output.append(setup.DOM.Util.twee(raw));
}

// each of this will be generated into two macros, one for naked desc and one for with equipment
// for example, "torso" becomes two macros: <<utorso _unit>> for naked and <<utorsoall _unit>> for clothed
const candidates = [
  "torso",
  "back",
  "head",
  "face",
  "mouth",
  "eyes",
  "ears",
  "cbreast",
  "breast",
  "neck",
  "wings",
  "arms",
  "hand",
  "hands",
  "legs",
  "cfeet",
  "clegs",
  "ctorso",
  "carms",
  "cneck",
  "ceyes",
  "cnipple",
  "ctail",
  "cmouth",
  "feet",
  "foot",
  "tail",
  "dick",
  "balls",
  "vagina",
  "anus",
  "genital",
  "cgenital",
  "ass",
  "nipple",
  "nipples",
  "hole",
  "tongue",
  "skin",
  "scent",
  "horns",
  "teeth",
  "belly",
  "waist",
  "dickorstrap",
  "cum",
  "cleavage",

  /* Furnitures */
  "slaverbed",
  "slavebed",
  "foodtray",
  "drinktray",
  "punishment",
  "lighting",
  "tile",
  "object",
  "wall",
];

for (let i = 0; i < candidates.length; ++i) {
  const candidate = candidates[i];
  const func = (Text.Unit.Trait as any)[candidate];

  Macro.add(`u${candidate}`, {
    handler() {
      internalOutput(this.output, func, this.args[0]);
    },
  });
  Macro.add(`u${candidate}all`, {
    handler() {
      internalOutput(
        this.output,
        (unit) => func(unit, /* eq = */ true),
        this.args[0],
      );
    },
  });

  Macro.add(`ua${candidate}`, {
    handler() {
      internalOutput(this.output, func, this.args[0], /* article = */ true);
    },
  });
  Macro.add(`ua${candidate}all`, {
    handler() {
      internalOutput(
        this.output,
        (unit) => func(unit, /* eq = */ true),
        this.args[0],
        /* article = */ true,
      );
    },
  });

  MacroUtil.registerMetadata(`u${candidate}`, {
    info: `Describes the unit ${candidate}`,
    args: Args_OneActor,
  });
  MacroUtil.registerMetadata(`u${candidate}all`, {
    info: `Describes the unit ${candidate}, including clothed status`,
    args: Args_OneActor,
  });
  MacroUtil.registerMetadata(`ua${candidate}`, {
    info: `Describes the unit ${candidate}, and prepend an article`,
    args: Args_OneActor,
  });
  MacroUtil.registerMetadata(`ua${candidate}all`, {
    info: `Describes the unit ${candidate}, including clothed status, and prepend an article`,
    args: Args_OneActor,
  });
}

Macro.add("ubody", "utorso");
Macro.add("ubodyall", "utorsoall");
Macro.add("ubreasts", "ubreast");
Macro.add("ubreastsall", "ubreastall");
Macro.add("ucbreasts", "ucbreast");
Macro.add("ucbreastsall", "ucbreastall");
Macro.add("ucdick", "ucgenital");
Macro.add("ucnipples", "ucnipple");

Macro.add(`uflavor`, {
  handler() {
    internalOutput(
      this.output,
      (unit) => Text.Unit.Trait.flavor(unit, /* tag = */ this.args[1]),
      this.args[0],
    );
  },
});

Macro.add(`uequipment`, {
  handler() {
    internalOutput(
      this.output,
      Text.Unit.Equipment.equipmentSummary,
      this.args[0],
    );
  },
});

Macro.add(`ubantertraining`, {
  handler() {
    internalOutput(this.output, Text.Banter.slaveTrainingText, this.args[0]);
  },
});

Macro.add(`uadjphys`, {
  handler() {
    internalOutput(
      this.output,
      (unit) => Text.Unit.Trait.adjectiveRandom(unit, "physical"),
      this.args[0],
    );
  },
});

Macro.add(`uadjper`, {
  handler() {
    internalOutput(
      this.output,
      (unit) => Text.Unit.Trait.adjectiveRandom(unit, "per"),
      this.args[0],
    );
  },
});

Macro.add(`urace`, {
  handler() {
    internalOutput(this.output, Text.Unit.Trait.race, this.args[0]);
  },
});

Macro.add(`uhomeland`, {
  handler() {
    internalOutput(this.output, Text.Unit.Trait.homeland, this.args[0]);
  },
});

Macro.add(`uweapon`, {
  handler() {
    internalOutput(this.output, Text.Unit.Equipment.getWeaponRep, this.args[0]);
  },
});

Macro.add(`uaweapon`, {
  handler() {
    internalOutput(
      this.output,
      Text.Unit.Equipment.getAWeaponRep,
      this.args[0],
    );
  },
});

Macro.add(`uweaponall`, {
  handler() {
    internalOutput(
      this.output,
      Text.Unit.Equipment.getWeaponRepFull,
      this.args[0],
    );
  },
});

Macro.add(`uadj`, {
  handler() {
    internalOutput(
      this.output,
      (unit) => Text.Unit.Trait.adjectiveRandom(unit),
      this.args[0],
    );
  },
});
Macro.add(`uadjgood`, {
  handler() {
    internalOutput(
      this.output,
      (unit) => Text.Unit.Trait.adjectiveGoodRandom(unit),
      this.args[0],
    );
  },
});
Macro.add(`uadjbad`, {
  handler() {
    internalOutput(
      this.output,
      (unit) => Text.Unit.Trait.adjectiveBadRandom(unit),
      this.args[0],
    );
  },
});
Macro.add(`uadv`, {
  handler() {
    internalOutput(
      this.output,
      (unit) => Text.Banter._getAdverb(unit),
      this.args[0],
    );
  },
});
Macro.add(`uadvcare`, {
  handler() {
    internalOutput(
      this.output,
      (unit) => Text.Banter._getAdverb(unit, true),
      this.args[0],
    );
  },
});
Macro.add(`uadvabuse`, {
  handler() {
    internalOutput(
      this.output,
      (unit) => Text.Banter._getAdverb(unit, false, true),
      this.args[0],
    );
  },
});

Macro.add(`ustriptorso`, {
  handler() {
    internalOutput(this.output, Text.Unit.Equipment.stripTorso, this.args[0]);
  },
});
Macro.add(`ustriplegs`, {
  handler() {
    internalOutput(this.output, Text.Unit.Equipment.stripLegs, this.args[0]);
  },
});
Macro.add(`ustripanus`, {
  handler() {
    internalOutput(this.output, Text.Unit.Equipment.stripAnus, this.args[0]);
  },
});
Macro.add(`ustripgenital`, {
  handler() {
    internalOutput(this.output, Text.Unit.Equipment.stripGenital, this.args[0]);
  },
});
Macro.add(`ustripvagina`, {
  handler() {
    internalOutput(this.output, Text.Unit.Equipment.stripVagina, this.args[0]);
  },
});
Macro.add(`ustripdick`, {
  handler() {
    internalOutput(this.output, Text.Unit.Equipment.stripDick, this.args[0]);
  },
});
Macro.add(`ustripnipple`, {
  handler() {
    internalOutput(this.output, Text.Unit.Equipment.stripNipple, this.args[0]);
  },
});
Macro.add(`ustripmouth`, {
  handler() {
    internalOutput(this.output, Text.Unit.Equipment.stripMouth, this.args[0]);
  },
});
Macro.add(`uslaverstripall`, {
  handler() {
    internalOutput(
      this.output,
      Text.Unit.Equipment.slaverStripAll,
      this.args[0],
    );
  },
});

Macro.add(`uyoustripanus`, {
  handler() {
    internalOutput(this.output, Text.Unit.Equipment.youStripAnus, this.args[0]);
  },
});

Macro.add(`upunishreason`, {
  handler() {
    internalOutput(this.output, Text.Punish.punishreason, this.args[0]);
  },
});

Macro.add(`uneedrescue`, {
  handler() {
    internalOutput(this.output, Text.Rescue.needrescue, this.args[0]);
  },
});

Macro.add(`urescuenow`, {
  handler() {
    internalOutput(this.output, Text.Rescue.rescueNow, this.args[0]);
  },
});

Macro.add(`upraisenoun`, {
  handler() {
    internalOutput(this.output, Text.Praise.noun, this.args[0]);
  },
});

Macro.add(`uinsultnoun`, {
  handler() {
    internalOutput(this.output, Text.Insult.noun, this.args[0]);
  },
});

Macro.add(`upetwhine`, {
  handler() {
    internalOutput(this.output, Text.Pet.whine, this.args[0]);
  },
});

Macro.add(`uhobbyverb`, {
  handler() {
    internalOutput(this.output, Text.Hobby.verb, this.args[0]);
  },
});

Macro.add(`ustripverb`, {
  handler() {
    internalOutput(
      this.output,
      (unit) => Text.Strip.verb(unit, this.args[1]),
      this.args[0],
    );
  },
});

Macro.add(`ustripshirtand`, {
  handler() {
    internalOutput(this.output, Text.Strip.takeoffshirtand, this.args[0]);
  },
});

Macro.add(`ustrippantsand`, {
  handler() {
    internalOutput(this.output, Text.Strip.takeoffpantsand, this.args[0]);
  },
});

Macro.add(`ustripequipmentand`, {
  handler() {
    internalOutput(this.output, Text.Strip.takeoffequipmentand, this.args[0]);
  },
});

Macro.add(`ustripmouthand`, {
  handler() {
    internalOutput(this.output, Text.Strip.takeoffmouthand, this.args[0]);
  },
});

Macro.add(`ustripeyesand`, {
  handler() {
    internalOutput(this.output, Text.Strip.takeoffeyesand, this.args[0]);
  },
});

Macro.add(`ustripanusand`, {
  handler() {
    internalOutput(this.output, Text.Strip.takeoffanusand, this.args[0]);
  },
});

Macro.add(`ustripgenitaland`, {
  handler() {
    internalOutput(this.output, Text.Strip.takeoffgenitaland, this.args[0]);
  },
});

Macro.add(`unickname`, {
  handler() {
    internalOutputUnitTarget(
      this.output,
      Text.Greeting.nickname,
      this.args[0],
      this.args[1],
    );
  },
});

Macro.add(`unicknamebad`, {
  handler() {
    internalOutputUnitTarget(
      this.output,
      Text.Greeting.nicknamebad,
      this.args[0],
      this.args[1],
    );
  },
});

Macro.add(`ugreetingshort`, {
  handler() {
    internalOutputUnitTarget(
      this.output,
      Text.Greeting.short,
      this.args[0],
      this.args[1],
    );
  },
});

Macro.add(`ugreetingfull`, {
  handler() {
    internalOutputUnitTarget(
      this.output,
      Text.Greeting.full,
      this.args[0],
      this.args[1],
    );
  },
});

Macro.add(`ubusyshort`, {
  handler() {
    internalOutputUnitTarget(
      this.output,
      Text.Greeting.busyshort,
      this.args[0],
      this.args[1],
    );
  },
});

Macro.add(`uyesmaster`, {
  handler() {
    internalOutputUnitTarget(
      this.output,
      Text.Slave.yesmaster,
      this.args[0],
      this.args[1],
    );
  },
});
