import type { EquipmentSlot } from "../../../classes/equipment/EquipmentSlot";
import type { Unit } from "../../../classes/unit/Unit";
import { rng } from "../../../util/rng";

function _equipmentHelper(
  unit: Unit,
  base: string,
  is_with_equipment: boolean | undefined,
  slot: EquipmentSlot,
): string {
  if (!is_with_equipment) return base;
  return `${base}${setup.Text.Unit.Equipment.slot(unit, slot)}`;
}

function strapOnText(): string {
  return rng.choice([`strap-on`, `fake dick`, `rubber dick`, `phallus`]);
}

export const TextUnitTrait_Physical = {
  dick(unit: Unit, is_with_equipment?: boolean): string {
    const genital_eq = unit.getEquipmentAt(setup.equipmentslot.genital);
    if (genital_eq && genital_eq.getTags().includes("strapon")) {
      // special case. Only happen during sex.
      return strapOnText();
    }
    let skin = setup.Text.Unit.Trait.skinAdjective(unit, "dickshape");
    let dick = unit.getTraitWithTag("dick");
    if (!dick) return "";

    const dickname = setup.sexbodypart.penis.repSimple(unit);

    let base = `${setup.sexbodypart.penis.repSizeAdjective(unit)} ${skin} ${dickname}`;
    return _equipmentHelper(
      unit,
      base,
      is_with_equipment,
      setup.equipmentslot.genital,
    );
  },

  dickhead(unit: Unit, is_with_equipment?: boolean): string {
    return setup.sexbodypart.penis.repTip(unit);
  },

  dickorstrap(unit: Unit, is_with_equipment?: boolean): string {
    if (!unit.isHasDick()) {
      return strapOnText();
    } else {
      return setup.Text.Unit.Trait.dick(unit, is_with_equipment);
    }
  },

  cum(unit: Unit, is_with_equipment?: boolean): string {
    if (unit.isHasDick()) {
      return setup.rng.choice([`cum`, `cum`, `cum`, `ejaculate`, `cockmilk`]);
    } else {
      return setup.rng.choice([`pussyjuice`, `girlcum`]);
    }
  },

  balls(unit: Unit, is_with_equipment?: boolean): string {
    let balls = unit.getTraitWithTag("balls");
    if (!balls) return "";
    let base = `${balls.repSizeAdjective()} balls`;
    return base;
  },

  vagina(unit: Unit, is_with_equipment?: boolean): string {
    let vagina = unit.getTraitWithTag("vagina");
    if (!vagina) return "";

    const vaginaname = setup.sexbodypart.vagina.repSimple(unit);
    let base = `${setup.sexbodypart.vagina.repSizeAdjective(unit)} ${vaginaname}`;
    return _equipmentHelper(
      unit,
      base,
      is_with_equipment,
      setup.equipmentslot.genital,
    );
  },

  anus(unit: Unit, is_with_equipment?: boolean): string {
    let anus = unit.getTraitWithTag("anus");
    if (!anus) return "";

    const anusname = setup.sexbodypart.anus.repSimple(unit);
    let base = `${setup.sexbodypart.vagina.repSizeAdjective(unit)} ${anusname}`;
    return _equipmentHelper(
      unit,
      base,
      is_with_equipment,
      setup.equipmentslot.rear,
    );
  },

  hole(unit: Unit, is_with_equipment?: boolean): string {
    if (unit.isHasVagina()) {
      return setup.Text.Unit.Trait.vagina(unit, is_with_equipment);
    } else {
      return setup.Text.Unit.Trait.anus(unit, is_with_equipment);
    }
  },

  tongue(unit: Unit, is_with_equipment?: boolean): string {
    if (unit.isHasTrait("mouth_demon")) {
      return `elongated tongue`;
    } else {
      return `tongue`;
    }
  },

  genital(unit: Unit, is_with_equipment?: boolean): string {
    if (unit.isHasStrapOn()) {
      return `strapon`;
    }
    let dick = unit.getTraitWithTag("dick");
    let balls = unit.getTraitWithTag("balls");
    let vagina = unit.getTraitWithTag("vagina");
    let base = null;
    if (dick) {
      base = setup.Text.Unit.Trait.dick(unit, is_with_equipment);
      /*
      if (balls) {
        if (is_with_equipment) {
          base = `${base}. Under <<their "${unit.key}">> dick hangs a ${setup.Text.Unit.Trait.balls(unit, is_with_equipment)}`
        } else {
          base = `${base} and ${setup.Text.Unit.Trait.balls(unit, is_with_equipment)}`
        }
      } else {
        if (is_with_equipment) {
          base = `${base}. There are nothing but smooth skin under <<their "${unit.key}">> dick`
        } else {
          base = `balls-less ${base}`
        }
      }
      */
    } else if (vagina) {
      base = setup.Text.Unit.Trait.vagina(unit, is_with_equipment);
    } else {
      base = `smooth genital area`;
    }
    return base;
  },

  breast(unit: Unit, is_with_equipment?: boolean): string {
    let breast = unit.getTraitWithTag("breast");
    let base = null;

    const breastname = setup.sexbodypart.breasts.repSimple(unit);
    if (breast) {
      base = `${setup.sexbodypart.breasts.repSizeAdjective(unit)} \
      ${setup.Text.Unit.Trait.skinAdjective(unit, "body")} \
      ${breastname}`;
    } else {
      let muscular = "";
      if (unit.isHasTrait(setup.trait.muscle_extremelystrong)) {
        muscular = "extremely ripped";
      } else if (unit.isHasTrait(setup.trait.muscle_verystrong)) {
        muscular = "ripped";
      } else if (unit.isHasTrait(setup.trait.muscle_strong)) {
        muscular = "well-defined";
      } else {
        muscular = "manly";
      }
      base = `${muscular} \
      ${setup.Text.Unit.Trait.skinAdjective(unit, "body")} \
      ${breastname}`;
    }
    if (!is_with_equipment) return base;
    return `${base}${setup.Text.Unit.Equipment.slot(unit, setup.equipmentslot.nipple)}`;
  },

  cleavage(unit: Unit, is_with_equipment?: boolean): string {
    let t;
    if (unit.isHasTrait("breast_huge")) {
      t = [`cleavage`, `deep valleys`];
    } else if (unit.isHasTrait("breast_large")) {
      t = [`cleavage`];
    } else if (unit.isHasTrait("breast_small")) {
      t = [`cleavage`, `modest cleavage`, `small cleavage`];
    } else if (unit.isHasTrait("muscle_verystrong")) {
      t = [`pec cleavage`];
    } else {
      t = [`non-existent cleavage`, `flat cleavage`];
    }
    return setup.rng.choice(t);
  },

  cbreast(unit: Unit): string {
    const clothes = unit.getEquipmentAt(setup.equipmentslot.torso);
    if (clothes?.isCovering()) return clothes.rep();
    return setup.Text.Unit.Trait.breast(unit);
  },

  cfeet(unit: Unit): string {
    const clothes = unit.getEquipmentAt(setup.equipmentslot.feet);
    if (clothes?.isCovering()) return clothes.rep();
    return setup.Text.Unit.Trait.feet(unit);
  },

  cgenital(unit: Unit): string {
    const legs = unit.getEquipmentAt(setup.equipmentslot.legs);
    let eq = null;
    if (legs?.isCovering()) eq = legs;

    const underwear = unit.getEquipmentAt(setup.equipmentslot.rear);
    if (!eq && underwear?.isCovering()) eq = underwear;

    if (!eq) return setup.Text.Unit.Trait.genital(unit);

    // bulge description
    let bulge = "";
    if (unit.isHasTrait("dick_titanic")) {
      bulge = "enormous bulge";
    } else if (unit.isHasTrait("dick_huge")) {
      bulge = "massive bulge";
    } else if (unit.isHasTrait("dick_large")) {
      bulge = "large bulge";
    } else if (unit.isHasTrait("dick_medium")) {
      bulge = "bulge";
    } else if (unit.isHasTrait("dick_small")) {
      bulge = "small bulge";
    } else if (unit.isHasTrait("dick_tiny")) {
      bulge = "tiny bulge";
    }
    if (bulge) {
      return bulge;
    }
    return `covered ${setup.Text.Unit.Trait.genital(unit)}`;
  },

  face(unit: Unit, is_with_equipment?: boolean) {
    let face_trait = unit.getTraitWithTag("face");

    let t;
    if (face_trait) {
      t = [face_trait.repSizeAdjective()];
    } else {
      t = [``, `average-looking`];
    }

    if (face_trait == setup.trait.face_attractive) {
      if (unit.isSissy()) {
        t = t.concat(["androginously beautiful"]);
      } else if (unit.isFemale()) {
        t = t.concat(["beautiful"]);
      } else {
        t = t.concat(["handsome"]);
      }
    } else if (face_trait == setup.trait.face_beautiful) {
      if (unit.isSissy()) {
        t = t.concat(["androgynously beautiful"]);
      } else if (unit.isFemale()) {
        t = t.concat(["exquisitely beautiful"]);
      } else {
        t = t.concat(["ruggedly handsome"]);
      }
    } else if (unit.isSissy()) {
      t = t.concat(["androgynous"]);
    }

    let base = `${setup.rng.choice(t)} face`;
    if (is_with_equipment) {
      if (setup.Text.Unit.Equipment.isFaceCovered(unit)) {
        base += ` (which is not visible since <<their "${unit.key}">> face is covered by <<their "${unit.key}">> equipment)`;
      }
    }
    return base;
  },

  head(unit: Unit, is_with_equipment?: boolean) {
    let skin = setup.Text.Unit.Trait.skinAdjective(unit, "body");
    let base = `${skin} head`;
    return _equipmentHelper(
      unit,
      base,
      is_with_equipment,
      setup.equipmentslot.head,
    );
  },

  eyes(unit: Unit, is_with_equipment?: boolean) {
    let skin = setup.Text.Unit.Trait.skinAdjective(unit, "eyes");
    let base = `${skin} eyes`;
    return _equipmentHelper(
      unit,
      base,
      is_with_equipment,
      setup.equipmentslot.eyes,
    );
  },

  ceyes(unit: Unit) {
    const clothes = unit.getEquipmentAt(setup.equipmentslot.eyes);
    if (clothes?.isCovering()) return clothes.rep();
    return setup.Text.Unit.Trait.eyes(unit);
  },

  mouth(unit: Unit, is_with_equipment?: boolean) {
    let skin = setup.Text.Unit.Trait.skinAdjective(unit, "mouth");
    let trait = unit.getTraitWithTag("mouth");
    let base = setup.sexbodypart.mouth.repSimple(unit);
    base = `${skin} ${base}`;
    return _equipmentHelper(
      unit,
      base,
      is_with_equipment,
      setup.equipmentslot.mouth,
    );
  },

  cmouth(unit: Unit) {
    const clothes = unit.getEquipmentAt(setup.equipmentslot.mouth);
    if (clothes) return clothes.rep();
    return setup.Text.Unit.Trait.mouth(unit);
  },

  teeth(unit: Unit, is_with_equipment?: boolean) {
    const trait = unit.getTraitWithTag("mouth");
    if (trait && trait.getTags().includes("fangs")) {
      return `fangs`;
    } else {
      return `teeth`;
    }
  },

  ears(unit: Unit, is_with_equipment?: boolean) {
    let skin = setup.Text.Unit.Trait.skinAdjective(unit, "ears");
    let base = `${skin} ears`;
    // no ear equipment
    return base;
  },

  horns(unit: Unit, is_with_equipment?: boolean) {
    let skin = unit.getTraitWithTag("ears");
    if (skin == setup.trait.ears_demon) {
      const adj = setup.rng.choice([``, `demonic`, `curved`]);
      return `${adj} horns`;
    } else {
      return "";
    }
  },

  ass(unit: Unit, is_with_equipment?: boolean) {
    let skin = setup.Text.Unit.Trait.skinAdjective(unit, "body");
    const assname = setup.rng.choice(["ass", "butts"]);
    let base = `${skin} ${assname}`;
    // no ass equipment
    return base;
  },

  nipple(unit: Unit, is_with_equipment?: boolean) {
    return "nipple";
  },

  cnipple(unit: Unit) {
    const clothes = unit.getEquipmentAt(setup.equipmentslot.nipple);
    if (clothes?.getTags().includes("nipples")) return clothes;
    return setup.Text.Unit.Trait.nipple(unit);
  },

  nipples(unit: Unit, is_with_equipment?: boolean) {
    return "nipples";
  },

  torso(unit: Unit, is_with_equipment?: boolean) {
    let texts = [];

    let height_trait = unit.getTraitWithTag("height");
    if (height_trait) texts.push(height_trait.repSizeAdjective());

    let muscular_text = setup.Text.Unit.Trait.muscular(unit);
    if (muscular_text) texts.push(muscular_text);

    let body_text = setup.Text.Unit.Trait.skinAdjective(unit, "body");

    const bodyname = setup.rng.choice(["body", "bod", "torso", "figure"]);

    let base = `${texts.join(" and ")} ${body_text} ${bodyname}`;
    return _equipmentHelper(
      unit,
      base,
      is_with_equipment,
      setup.equipmentslot.torso,
    );
  },

  ctorso(unit: Unit) {
    const clothes = unit.getEquipmentAt(setup.equipmentslot.torso);
    if (clothes) return clothes.rep();
    return setup.Text.Unit.Trait.torso(unit);
  },

  back(unit: Unit, is_with_equipment?: boolean) {
    let muscular_text = setup.Text.Unit.Trait.muscular(unit);
    let body_text = setup.Text.Unit.Trait.skinAdjective(unit, "body");
    return `${muscular_text} ${body_text} back`;
  },

  waist(unit: Unit, is_with_equipment?: boolean) {
    let t;
    if (unit.isHasTrait("muscle_extremelystrong")) {
      t = [`freakishly muscular waist`, `waist`];
    } else if (unit.isHasTrait("muscle_verystrong")) {
      t = [`muscular waist`, `waist`];
    } else if (unit.isHasTrait("muscle_strong")) {
      t = [`toned waist`, `waist`];
    } else if (unit.isHasTrait("muscle_extremelythin")) {
      t = [`unnaturally narrow waist`, `waist`];
    } else if (unit.isHasTrait("muscle_verythin")) {
      t = [`very narrow waist`, `waist`];
    } else if (unit.isHasTrait("muscle_thin")) {
      t = [`narrow waist`, `waist`];
    } else {
      t = [`waist`];
    }
    return setup.rng.choice(t);
  },

  belly(unit: Unit, is_with_equipment?: boolean) {
    let t;
    if (unit.isHasTrait("muscle_extremelystrong")) {
      t = [`eight-packs`, `freakishly ripped abs`];
    } else if (unit.isHasTrait("muscle_verystrong")) {
      t = [`six-packs`, `ripped abs`, `shredded abs`];
    } else if (unit.isHasTrait("muscle_strong")) {
      t = [`well-defined abs`, `defined abs`, `toned abs`];
    } else if (unit.isHasTrait("muscle_extremelythin")) {
      t = [`extremely thin stomach`, `unnaturally skinny belly`];
    } else if (unit.isHasTrait("muscle_verythin")) {
      t = [`very thin stomach`, `thin belly`, `skinny belly`];
    } else if (unit.isHasTrait("muscle_thin")) {
      t = [`thin stomach`, `belly`];
    } else {
      t = [`belly`, `abs`, `stomach`];
    }
    return setup.rng.choice(t);
  },

  neck(unit: Unit, is_with_equipment?: boolean) {
    let adjective = "";
    if (unit.isHasTrait(setup.trait.muscle_strong)) {
      if (unit.isFemale()) {
        adjective = "strong";
      } else {
        adjective = "broad shoulders and thick";
      }
    } else {
      adjective = "";
    }
    return _equipmentHelper(
      unit,
      `${adjective} neck`,
      is_with_equipment,
      setup.equipmentslot.neck,
    );
  },

  cneck(unit: Unit) {
    const clothes = unit.getEquipmentAt(setup.equipmentslot.neck);
    if (clothes) return clothes.rep();
    return setup.Text.Unit.Trait.neck(unit);
  },

  wings(unit: Unit, is_with_equipment?: boolean) {
    let skin = setup.Text.Unit.Trait.skinAdjective(unit, "wings");
    if (!skin) return "";
    let restraintext = "";
    if (unit.isHasTrait(setup.trait.eq_restrained)) {
      restraintext = ", which are rendered useless by their restraints";
    }
    return `${skin} wings${restraintext}`;
  },

  arms(unit: Unit, is_with_equipment?: boolean) {
    let muscular = "";
    if (unit.isHasTrait(setup.trait.muscle_extremelystrong)) {
      muscular = "extremely muscular";
    } else if (unit.isHasTrait(setup.trait.muscle_verystrong)) {
      muscular = "rock-hard";
    } else if (unit.isHasTrait(setup.trait.muscle_strong)) {
      muscular = "powerful";
    } else if (unit.isHasTrait(setup.trait.muscle_extremelythin)) {
      muscular = "skinny";
    } else if (unit.isHasTrait(setup.trait.muscle_verythin)) {
      muscular = "skinny";
    } else if (unit.isHasTrait(setup.trait.muscle_thin)) {
      muscular = "slim";
    }

    let skin = setup.Text.Unit.Trait.skinAdjective(unit, "arms");
    const armname = setup.sexbodypart.arms.repSimple(unit);
    let base = `${muscular} ${skin} ${armname}`;
    return _equipmentHelper(
      unit,
      base,
      is_with_equipment,
      setup.equipmentslot.arms,
    );
  },

  carms(unit: Unit) {
    const clothes = unit.getEquipmentAt(setup.equipmentslot.arms);
    if (clothes) return clothes.rep();
    return setup.Text.Unit.Trait.arms(unit);
  },

  hand(unit: Unit, is_with_equipment?: boolean) {
    let armstrait = unit.getTraitWithTag("arms");
    let skin = "hand";

    if (armstrait) {
      if (
        armstrait == setup.trait.arms_werewolf ||
        armstrait == setup.trait.arms_neko
      ) {
        skin = "paw";
      }
    }
    return skin;
  },

  hands(unit: Unit, is_with_equipment?: boolean) {
    return `${setup.Text.Unit.Trait.hand(unit, is_with_equipment)}s`;
  },

  legs(unit: Unit, is_with_equipment?: boolean) {
    let muscular = "";
    if (unit.isHasTrait(setup.trait.muscle_extremelystrong)) {
      muscular = "swole";
    } else if (unit.isHasTrait(setup.trait.muscle_verystrong)) {
      muscular = "muscly";
    } else if (unit.isHasTrait(setup.trait.muscle_strong)) {
      muscular = "toned";
    } else if (unit.isHasTrait(setup.trait.muscle_extremelythin)) {
      muscular = "extremely skinny";
    } else if (unit.isHasTrait(setup.trait.muscle_verythin)) {
      muscular = "skinny";
    } else if (unit.isHasTrait(setup.trait.muscle_thin)) {
      muscular = "slim";
    }

    let skin = setup.Text.Unit.Trait.skinAdjective(unit, "legs");
    const legname = setup.sexbodypart.legs.repSimple(unit);
    let base = `${muscular} ${skin} ${legname}`;
    return _equipmentHelper(
      unit,
      base,
      is_with_equipment,
      setup.equipmentslot.legs,
    );
  },

  clegs(unit: Unit) {
    const clothes = unit.getEquipmentAt(setup.equipmentslot.legs);
    if (clothes?.isCovering()) return clothes.rep();
    return setup.Text.Unit.Trait.legs(unit);
  },

  feet(unit: Unit, is_with_equipment?: boolean, is_singular?: boolean) {
    // feet skin is a special case of skin, based on the legs
    let legtrait = unit.getTraitWithTag("legs");
    let skin = "";

    if (legtrait) {
      if (legtrait == setup.trait.legs_werewolf) {
        skin = "digitrade";
      } else if (
        legtrait == setup.trait.legs_dragonkin ||
        legtrait == setup.trait.legs_neko
      ) {
        skin = "clawed";
      } else if (legtrait == setup.trait.legs_demon) {
        skin = "hooved";
      } else {
        throw new Error(`Unknown legs: ${legtrait.key}`);
      }
    }

    let feetname = `feet`;
    if (is_singular) {
      feetname = "foot";
    }
    let base = `${skin} ${feetname}`;
    return _equipmentHelper(
      unit,
      base,
      is_with_equipment,
      setup.equipmentslot.feet,
    );
  },

  foot(unit: Unit, is_with_equipment?: boolean) {
    return setup.Text.Unit.Trait.feet(
      unit,
      is_with_equipment,
      /* singular = */ true,
    );
  },

  skin(unit: Unit, is_with_equipment?: boolean, is_with_adjective?: boolean) {
    const body = unit.getTraitWithTag("body");
    if (body) {
      const text = body.text();
      let adj = "";
      if (is_with_adjective && text.adj_extra) {
        adj = setup.rng.choice(text.adj_extra) + " ";
      }
      if (text && text.noun_extra) {
        return `${adj}${setup.rng.choice(text.noun_extra)}`;
      }
    }
    let adj = "";
    if (is_with_adjective) {
      adj = setup.rng.choice(["tender", "soft"]);
    }
    if (adj) adj = adj + " ";
    return `${adj}skin`;
  },

  tail(unit: Unit, is_with_equipment?: boolean) {
    const tail = unit.getTail();
    if (!tail) return "";
    const base = setup.sexbodypart.tail.repSimple(unit);
    if (Math.random() < 0.7) return base;
    if (tail == setup.trait.tail_werewolf || tail == setup.trait.tail_foxkin) {
      return `fully wolf-like ${base}`;
    } else if (tail == setup.trait.tail_neko) {
      return `long and slender cat-like ${base}`;
    } else if (tail == setup.trait.tail_dragonkin) {
      return `thick and powerful dragon ${base}`;
    } else if (tail == setup.trait.tail_demon) {
      return `sharp demonic ${base}`;
    } else {
      throw new Error(`Unrecognizable tail: ${tail.key}`);
    }
  },

  ctail(unit: Unit, is_with_equipment?: boolean) {
    const tail = unit.getTail();
    const plug = unit.getTailPlug();

    let t;
    if (tail && !plug) {
      t = [setup.Text.Unit.Trait.tail(unit, is_with_equipment)];
    } else if (plug && !tail) {
      t = [plug.rep()];
    } else if (plug && tail) {
      t = [
        `real and fake tail`,
        `real tail and tailplug`,
        `tails both real and fake`,
        `tails both real and rubbery`,
      ];
    } else {
      return ``;
    }

    return setup.Text.replaceUnitMacros(t, { a: unit });
  },

  tailtip(unit: Unit, is_with_equipment?: boolean) {
    return setup.sexbodypart.tail.repTip(unit);
  },

  scent(unit: Unit, is_with_equipment?: boolean) {
    if (unit.isMale()) return `musk`;
    return "scent";
  },
};
