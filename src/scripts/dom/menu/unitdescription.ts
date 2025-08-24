import {
  getFriendSlaveTitle,
  getFriendTitle,
} from "../../text/macro/friendship";

function getHistoryFragment(unit: Unit): DOM.Node {
  const inner_fragments = [];
  for (const history of unit.getHistory()) {
    inner_fragments.push(html`
      <div>
        ${setup.DOM.Util.twee(
          setup.Text.replaceUnitMacros(history, { a: unit }),
        )}
      </div>
    `);
  }
  return setup.DOM.create("div", {}, inner_fragments);
}

function unitImageFragment(unit: Unit): Node {
  let div_class;
  if (State.variables.settings.unitimagefull) {
    div_class = "unitimagefull unitimagelarge";
  } else {
    div_class = "unitimagehalf unitimagelarge";
  }

  return html`
    <figure class="${div_class}">
      ${setup.DOM.Util.Image.load({ image_name: unit.getImage() })}
      <figcaption class="${div_class}">
        ${setup.DOM.Util.Image.credits(unit)}
        ${setup.DOM.Nav.link(
          State.variables.settings.unitimagefull
            ? `(switch to half-size)`
            : `(switch to full-size)`,
          () => {
            State.variables.settings.unitimagefull =
              !State.variables.settings.unitimagefull;
            setup.DOM.Nav.goto();
          },
        )}
      </figcaption>
    </figure>
  `;
}

export const DOM_Menu_unitdescription = function (unit: Unit): DOM.Node {
  const outer_fragments = [];

  function format(text: string | string[]): string {
    return setup.Text.replaceUnitMacros(text, { a: unit });
  }

  {
    /* paragraph one */
    const fragments: DOM.Attachable[] = [];
    fragments.push(unitImageFragment(unit));

    {
      // Bob is a proud Lv 15 male human slaver.
      const speech = unit.getSpeech().getName().toLowerCase();

      let speech_part;
      if (unit.isMindbroken()) {
        speech_part = `an`;
      } else {
        speech_part = setup.Article(speech);
      }

      fragments.push(html`
        ${format(`a|Rep a|is`)} ${speech_part}
        ${unit.isSlaver() && setup.DOM.Util.level(unit.getLevel())}
        ${unit.repGender()} ${unit.getSubrace().getName()}
        ${unit.getTitle().toLowerCase()}.
      `);
    }

    // His full name is Bob Doe, but he is usually called Bob.
    if (unit.getFullName() != unit.getName()) {
      fragments.push(html`
        ${format(`a|Their full name is`)} ${unit.getFullName()},
        ${format(
          setup.rng.choice([
            `but a|they a|is usually called`,
            `although a|they simply a|go by`,
            `but everyone calls a|them`,
          ]),
        )}
        ${unit.getName()}.
      `);
    }

    if (unit.isSlave()) {
      // He likes to lick people's feet.
      const description = setup.Text.Unit.Trait.description(
        unit,
        unit.getMainTraining(),
      );
      fragments.push(html` ${format(`a|They`)} ${description}. `);

      // He worths nothing in the slave markets.
      const value = unit.getSlaveValue();
      let t;
      if (value < setup.TRAIT_VALUE_LOW_THRESHOLD) {
        t = [
          `a|They a|is worth nothing in the slave markets -- you better off selling a|them for fixed-priced slave orders.`,
          `a|They a|worth nothing -- it might be better to sell a|them to a fixed-price slave order.`,
        ];
      } else if (value < setup.TRAIT_VALUE_HIGH_THRESHOLDS[0]) {
        t = [
          `a|They a|is a decently valuable slave.`,
          `You could probably sell a|them for a decent sum.`,
        ];
      } else if (value < setup.TRAIT_VALUE_HIGH_THRESHOLDS[1]) {
        t = [
          `a|They a|is quite valuable and would fetch a tidy amount of sum should you find the right buyer.`,
          `You could get a good amount of money from selling this slave.`,
        ];
      } else if (value < setup.TRAIT_VALUE_HIGH_THRESHOLDS[2]) {
        t = [
          `a|They a|is greatly valuable, easily attracting potential buyers.`,
          `When sold, a|they would fetch quite a large amount of money.`,
        ];
      } else if (value < setup.TRAIT_VALUE_HIGH_THRESHOLDS[3]) {
        t = [
          `a|They a|is extremely valuable, deserving to be sold in proper venues.`,
          `a|Their high value attracts potential buyer far and wide.`,
        ];
      } else if (value < setup.TRAIT_VALUE_HIGH_THRESHOLDS[4]) {
        t = [
          `a|They a|is insanely valuable, famous throughout the entire region.`,
          `If you find the right buyer, selling a|them would easily make you very rich.`,
        ];
      } else if (value < setup.TRAIT_VALUE_HIGH_THRESHOLDS[5]) {
        t = [
          `a|They a|is insanely valuable, famous throughout the entire region.`,
          `Many would give everything they have for the priviledge of fucking such a valuable slave as a|rep.`,
        ];
      } else {
        t = [
          `a|They a|is a god-tier slave, commanding ludicruous price in the slave markets.`,
          `a|Their value is so high that even otherwordly beings are interested in the slave.`,
        ];
      }
      fragments.push(html` ${format(t)} `);
    }

    if (unit.getDuty()) {
      // Bob is your damage control officer. He's quite good at the job.
      const duty = unit.getDuty()!;
      fragments.push(html`
        ${format([`a|rep a|work as your `, `a|rep a|as your `])} ${duty.rep()},
      `);

      if (!unit.isAvailable()) {
        fragments.push(html`
          ${format([
            `but a|they a|is busy and unable to attend to a|their duties right now.`,
            `but a|they a|is currently unable to attend to a|their duties.`,
          ])}
        `);
      } else {
        fragments.push(html`${setup.Text.Duty.competence(duty)}.`);
      }

      if (duty.isSpecialistActive()) {
        fragments.push(html`
          ${format([
            `A specialist is working in a|their stead, although the specialist costs quite a sum of money to pay.`,
            `a|They a|have arranged for a skilled but expensive specialist to work in a|their absence.`,
          ])}
        `);
      }
    }

    const lover = unit.getLover();
    if (lover) {
      // Bob is your lover.
      let t;
      if (lover.isYou()) {
        t = [`a|They a|is your lover.`, `You are a|their lover.`];
      } else {
        t = [
          `a|They a|is ${lover.rep()}'s lover.`,
          `${lover.rep()} is a|their lover.`,
        ];
      }
      fragments.push(html` ${format(t)} `);
    }

    {
      // He has been with your company for 5 weeks, and is being paid 500g per week.
      const service_length = unit.getWeeksWithCompany();
      let t;
      if (service_length) {
        if (unit.isSlave()) {
          t = [
            `a|They a|have been enslaved by your company for ${service_length} weeks.`,
            `a|They a|have been your slave for ${service_length} weeks.`,
          ];
        } else {
          t = [
            `a|They a|have been with your company for ${service_length} weeks`,
            `a|They a|have served your company for ${service_length} weeks`,
          ];
        }
      } else {
        if (unit.isSlave()) {
          t = [
            `a|They a|have just been enslaved by your company.`,
            `You have just acquired a|them.`,
            `This is a|their first week under your company's management.`,
          ];
        } else {
          t = [
            `a|They a|have just joined your company`,
            `This is a|their first week working with your company`,
          ];
        }
      }

      fragments.push(html`
        ${format(t)}
        ${unit.isSlaver() &&
        html`
          ${format([`and a|they a|is being paid`, `and a|their wage is`])}
          ${setup.DOM.Util.money(unit.getWage())} per week.
        `}
      `);
    }

    {
      // He was a woodcutter.
      fragments.push(html` ${setup.Text.Unit.background(unit)} `);
    }

    if (unit.getOrigin()) {
      // He was a famous singer in the eastern deserts.
      fragments.push(html` ${format(`a|Rep`)} ${unit.getOrigin()} `);
    }

    {
      // He is currently wearing slutty bondage armor.
      fragments.push(html`
        ${format([
          `a|They a|is currently wearing a|equipment.`,
          `a|They a|is wearing a|equipment.`,
          `a|They a|wear a|equipment.`,
        ])}
      `);

      // the equipment is enchanted, and gives him extra traits:
      const extra_traits = unit.getExtraTraits();
      if (extra_traits.length) {
        fragments.push(html`
          ${format([
            `The equipment a|they a|is wearing is magical, giving a|them extra traits:`,
            `The equipment a|they a|is wearing is enchanted, and gives a|them some extra traits:`,
            `a|They a|have extra traits thanks to the magical equipment a|they a|is wearing:`,
          ])}
          ${extra_traits.map((trait) => trait.rep())}.
        `);
      }
    }

    if (unit.getHistory().length) {
      // You can check their history with your company.
      fragments.push(html`
        ${format([`a|They a|have a `])}
        ${setup.DOM.Nav.link(`history`, () => {
          setup.Dialogs.open({
            title: `History`,
            classnames: "",
            content: getHistoryFragment(unit),
          });
        })}
        ${format([`with your company.`, `in your company.`])}
      `);
    }

    {
      /* He is known as the wielder of excalibur. */
      const titles = State.variables.titlelist.getAllTitles(unit);
      if (titles.length) {
        let t;
        if (titles.length <= 2) {
          t = [`a|They a|is known as`, `a|They a|is also known as`];
        } else {
          t = [
            `a|They a|have several titles to a|their name: `,
            `a|They a|is known by multiple titles: `,
          ];
        }

        fragments.push(html`
          ${format(t)}
          ${setup.Text.addCommas(titles.map((title) => title.rep()))}.
        `);
      }
    }

    {
      /* title descriptions */
      fragments.push(html`
        ${setup.DOM.Util.twee(setup.TitleHelper.unitTitleDescribe(unit))}
      `);
    }

    outer_fragments.push(setup.DOM.create("p", {}, fragments));
  }

  {
    /* Optional paragraph 2 about family members, if any */
    const family = State.variables.family.getFamily(unit);
    const nfamily = Object.keys(family).length;
    if (nfamily) {
      const fragments: DOM.Attachable[] = [];

      fragments.push(html`
        ${format([
          `a|Rep a|have at least ${nfamily} family member${nfamily > 1 ? "s" : ""}.`,
          `You are aware that a|rep a|have at least ${nfamily} family member${nfamily > 1 ? "s" : ""}.`,
        ])}
        ${format(`a|They a|is`)}
        ${setup.Text.addCommas(
          (objectKeys(family) as UnitKey[]).map((family_unit_key) => {
            const family_unit = State.variables.unit[family_unit_key];
            return `
              ${
                family_unit.isYourCompany()
                  ? setup.Text.replaceUnitMacros(`a|reps`, { a: family_unit })
                  : `${family_unit.getName()}'s`
              }
              ${family[family_unit_key].rep()}`;
          }),
        )}
      `);

      outer_fragments.push(setup.DOM.create("p", {}, fragments));
    }
  }

  {
    /* bedchamber information */
    const bedchambers = State.variables.bedchamberlist.getBedchambers({
      slaver: unit,
    });
    if (bedchambers.length) {
      const fragments: DOM.Attachable[] = [];
      // Bob is the owner of bedchamber abc, def, ghi
      fragments.push(html`
        ${format([`a|Rep a|is the owner of`, `a|Rep a|own`])}
        ${setup.Text.addCommas(
          bedchambers.map((bedchamber) => bedchamber.rep()),
        )}.
      `);

      const slaves = [];
      for (const bedchamber of bedchambers) {
        slaves.push(...bedchamber.getSlaves());
      }

      if (slaves.length) {
        let slaves_text = setup.rng.choice([`slave`, `fucktoy`]);
        if (slaves.length >= 2) {
          slaves_text += "s";
        }
        fragments.push(html`
          ${format([
            `a|They a|keep a|their personal ${slaves_text} there: `,
            `a|They a|have ${slaves.length} personal ${slaves_text}: `,
          ])}
          ${setup.Text.addCommas(slaves.map((slave) => slave.rep()))}.
        `);
      } else {
        let rooms_text;
        if (bedchambers.length >= 2) {
          rooms_text = setup.rng.choice(["bedchambers are", `rooms are`]);
        } else {
          rooms_text = setup.rng.choice(["bedchamber is", `room is`]);
        }
        fragments.push(html`
          ${format([
            `The ${rooms_text} empty now, and a|rep a|do not have any personal slave.`,
            `a|Rep a|do not have any personal slave, and the ${rooms_text} empty now.`,
          ])}
        `);
      }

      outer_fragments.push(setup.DOM.create("p", {}, fragments));
    }
  }

  function flavor(tag: string) {
    return setup.Text.Unit.Trait.flavor(unit, tag);
  }

  {
    /* Head description */
    const fragments: DOM.Attachable[] = [];
    fragments.push(html`
      ${format(`
        a|Rep a|have a|afaceall, a|earsall, and a|eyesall.
      `)} ${flavor("ears")} ${flavor("eyes")}
      ${format([`a|They a|have a|amouthall.`])} ${flavor("mouth")}
    `);

    if (unit.isHasTrait("mouth_dragonkin")) {
      let t: string[] = [];
      if (unit.isHasTrait("magic_fire")) {
        t = [
          `a|They a|is able to breathe scorching fire from a|their a|mouth.`,
        ];
      } else if (unit.isHasTrait("magic_dark")) {
        t = [
          `a|They a|is able to breathe out corruption from a|their a|mouth.`,
        ];
      } else if (unit.isHasTrait("magic_light")) {
        t = [
          `a|They a|is able to breathe out pure magic from a|their a|mouth.`,
        ];
      } else if (unit.isHasTrait("magic_earth")) {
        t = [`a|They a|is able to breathe out venom from a|their a|mouth.`];
      } else if (unit.isHasTrait("magic_water")) {
        t = [
          `a|They a|is able to breathe out freezing ice from a|their a|mouth.`,
        ];
      } else if (unit.isHasTrait("magic_wind")) {
        t = [
          `a|They a|is able to breathe out sharp slicing wind from a|their a|mouth.`,
        ];
      }
      if (t.length) {
        fragments.push(html` ${format(t)} `);
      }
    }

    outer_fragments.push(setup.DOM.create("p", {}, fragments));
  }

  {
    /* Upper body */
    const fragments: DOM.Attachable[] = [];

    let corrupted = "";
    if (unit.isHasTrait(setup.trait.corruptedfull)) {
      corrupted = `fully corrupted`;
    } else if (unit.isHasTrait(setup.trait.corrupted)) {
      corrupted = `notably corrupted`;
    }

    {
      let t = [`a|Rep a|have a ${corrupted} a|bodyall.`];
      if (corrupted) {
        t = t.concat([`a|Reps a|body is ${corrupted}.`]);
      }
      fragments.push(html` ${format(t)} ${flavor("body")} `);
    }

    if (setup.Text.Unit.Equipment.isChestCovered(unit)) {
      fragments.push(html`
        ${format(`
          Underneath a|their clothes, a|rep a|have a|breastall.
        `)}
      `);
    }

    const wings = unit.getWings();
    if (wings) {
      let t;
      if (
        unit.getRace() == setup.trait.race_demon &&
        wings == setup.trait.wings_dragonkin
      ) {
        t = [
          `Despite being a demon, a|they a|have a|wingsall, making a|them particularly fierce and mythical-looking.`,
        ];
      } else if (
        unit.getRace() == setup.trait.race_demon &&
        wings == setup.trait.wings_elf
      ) {
        t = [
          `Unlike most demons, a|their a|wings are beautiful and devoid of corruption.`,
        ];
      } else if (
        unit.getRace() == setup.trait.race_demon &&
        wings == setup.trait.wings_angel
      ) {
        t = [
          `a|Their wings are atypical of demons: dark feathery wings which paint the image of a fallen angel.`,
        ];
      } else {
        t = [`From a|their back grows a|wingsall.`];
      }
      fragments.push(html` ${format(t)} ${flavor("wings")} `);
    }

    fragments.push(html`
      ${format([`a|They a|have a|aneckall and a pair of a|armsall.`])}
      ${flavor("arms")}
    `);

    const weapon = unit.getEquipmentAt(setup.equipmentslot.weapon);
    if (weapon) {
      let powerfully = "";
      if (unit.isHasTrait("muscle_strong")) {
        powerfully = "powerfully";
      } else if (unit.getSkill(setup.skill.combat) >= 60) {
        powerfully = "masterfully";
      }
      fragments.push(html`
        ${format([
          `a|Their a|hands can ${powerfully} wield a|their preferred weapon: the a|weaponall.`,
        ])}
      `);
    }

    outer_fragments.push(setup.DOM.create("p", {}, fragments));
  }

  {
    /* Lower body */
    const fragments: DOM.Attachable[] = [];

    fragments.push(html`
      ${format([
        `Moving down, a|rep a|have a|legsall.`,
        `Going down, a|rep a|have a|legsall.`,
      ])}
      ${flavor("legs")}
    `);

    const cover = unit.getGenitalCovering();
    let t;
    if (cover) {
      t = [
        `a|Their genitals are covered by a|their ${cover.rep()}, and underneath, `,
        `a|Their ${cover.rep()} covers a|their genitals underneath, hiding the fact that `,
      ];
    } else {
      t = [
        `a|Their genitals are exposed, and `,
        `a|They a|wear nothing covering a|their nethers, and `,
      ];
    }

    fragments.push(html`
      ${format(t)} ${format([`a|rep a|have a|agenitalall.`])}
      ${flavor("dickshape")}
      ${format([
        `Deep inside a|their ass, a|they a|have a|aanusall.`,
        `Hidden inside a|their ass is a|their a|anusall.`,
      ])}
    `);

    const tail = unit.getTail();
    if (tail) {
      fragments.push(html`
        ${format([
          `a|Their spine extends, forming a|atailall.`,
          `a|Their a|tailall is just above a|their ass.`,
        ])}
        ${flavor("tail")}
      `);
    }

    fragments.push(html` ${format([`Finally, a|they a|have a|feetall.`])} `);

    outer_fragments.push(setup.DOM.create("p", {}, fragments));
  }

  {
    /* Corruption description */
    const missing = unit.getMissingInnateTraits();
    const extra = unit.getNonInnateSkinTraits();
    if (missing.length || extra.length) {
      const fragments: DOM.Attachable[] = [];

      fragments.push(html`
        ${format([
          `a|Rep a|have been visibly transformed,`,
          `a|Reps body a|have been visibly changed,`,
        ])}
      `);

      if (extra.length) {
        fragments.push(html`
          gaining
          ${extra.map((trait) => trait.rep())}${missing.length
            ? ", while "
            : "."}
        `);
      }
      if (missing.length) {
        fragments.push(html` missing ${missing.map((trait) => trait.rep())}. `);
      }

      outer_fragments.push(setup.DOM.create("p", {}, fragments));
    }
  }

  /* Mental things */
  {
    const fragments: DOM.Attachable[] = [];

    const describe_all = setup.Text.Unit.Trait.describeAll(unit, "per");
    if (describe_all) {
      fragments.push(html` ${setup.DOM.Util.twee(describe_all)} `);
    } else {
      if (unit.isMindbroken()) {
        fragments.push(html`
          ${format([
            `a|Rep a|have been mindbroken, and whatever skills and personalities
             a|they once had have been lost.
             a|They can now serve only as a hollowed-out fucktoy for yours and your slavers' pleasure.`,
          ])}
        `);
      } else {
        fragments.push(html`
          ${format([
            `Nothing stands out about a|reps personality, which is rather outstanding by itself.`,
            `a|Rep a|have no personality whatsoever, and is a little bit eerie as a result.`,
          ])}
        `);
      }
    }

    fragments.push(html`
      ${setup.DOM.Util.twee(setup.Text.Unit.Trait.describeAll(unit, "skill"))}
    `);

    if (State.variables.bodyshift.isBodyshifter(unit)) {
      fragments.push(html`
        ${setup.Text.replaceUnitMacros(
          `a|They a|is a known bodyshifter, capable of shifting from a|their current a|race body into
            a b|race one.`,
          { a: unit, b: State.variables.bodyshift.getBody(unit) },
        )}
      `);
    }

    const trauma = setup.Text.Unit.Trait.describeAll(unit, "trauma");
    if (trauma) {
      fragments.push(html`
        ${format([
          `Recent experiences have temporarily traumatized a|rep.`,
          `a|Rep a|have been recently traumatized.`,
        ])}
        ${setup.DOM.Util.twee(trauma)}
      `);
    }

    const boon = setup.Text.Unit.Trait.describeAll(unit, "boon");
    if (boon) {
      if (trauma) {
        fragments.push(html`
          ${format([
            `However, a|their spirits have also been lifted by recent events.`,
            `However, recent events have also lifted a|their spirits.`,
          ])}
        `);
      } else {
        fragments.push(html`
          ${format([
            `a|Reps spirits have been lifted temporarily from recent events.`,
            `Recent events have temporarily lifted a|reps spirits.`,
          ])}
        `);
      }

      fragments.push(html` ${setup.DOM.Util.twee(boon)} `);
    }

    if (unit.isSlaver()) {
      fragments.push(html`
        ${format([
          `a|Their preferred weapon is the a|weapon.`,
          `a|weapon is a|their weapon of choice.`,
        ])}
      `);
    }

    const perks = unit.getAllTraitsWithTag("perk");
    if (perks.length) {
      let t = [
        `a|They a|have learned the following perk${perks.length > 1 ? "s" : ""}:`,
        `a|They a|know the following perk${perks.length > 1 ? "s" : ""}:`,
      ];
      fragments.push(html`
        ${format(t)} ${perks.map((trait) => trait.rep()).join("")}.
      `);
    }

    if (
      unit.isSlaver() &&
      State.variables.fort.player.isHasBuilding("warroom")
    ) {
      const available = unit.getPerkChoices();
      let t;
      if (unit.isCanLearnNewPerk()) {
        t = [
          `a|They a|is capable of learning a new perk out of these`,
          `a|They can learn a new perk out of these`,
        ];
      } else {
        t = [
          `a|They cannot learn a new perk right now, but a|have access to these`,
          `a|They already a|know too many perks, but otherwise a|they a|have access to these`,
        ];
      }
      fragments.push(html`
        ${format(t)}
        ${setup.DOM.Util.message(`perks`, () => {
          return html`<div class="helpcard">
            ${available.map((trait) => trait.rep()).join("")}
          </div> `;
        })}.
      `);
    }

    const blessings = unit.getAllTraitsWithTag("blessingcurse");
    if (blessings.length) {
      let t;
      t = [
        `a|They currently a|have the following curse/blessing${blessings.length > 1 ? "s" : ""}:`,
        `a|They a|is blessed with the following curse/blessing${blessings.length > 1 ? "s" : ""}:`,
      ];
      fragments.push(html`
        ${format(t)} ${blessings.map((trait) => trait.rep()).join("")}.
      `);
    }

    if (unit.isInjured()) {
      const injury = State.variables.hospital.getInjury(unit);
      let t;
      if (injury >= 10) {
        t = [
          `a|They a|is suffering from massive injuries, `,
          `a|They a|is suffering from chronic injuries, `,
        ];
      } else if (injury >= 4) {
        t = [
          `a|They a|is heavily injured, `,
          `a|They a|is currently recovering from heavy injuries, `,
        ];
      } else {
        t = [
          `a|They a|is lightly injured, `,
          `a|They a|is currently sustaining minor injuries, `,
        ];
      }
      fragments.push(html`
        ${format(t)}
        ${format([
          `and is expected to recover fully in ${injury} weeks.`,
          `and would need to rest for ${injury} more weeks.`,
        ])}
      `);
    }

    if (!unit.isMindbroken() && !unit.isYou()) {
      const friendship = State.variables.friendship.getFriendship(
        unit,
        State.variables.unit.player,
      );
      let t;
      if (unit.isSlave()) {
        const verb = getFriendSlaveTitle(friendship);
        t = [`a|They ${verb} you.`];
      } else {
        t = [`a|They a|consider you a|their ${getFriendTitle(friendship)}.`];
      }
      fragments.push(html` ${format(t)} `);
    }

    outer_fragments.push(setup.DOM.create("p", {}, fragments));
  }

  {
    /* Current occupations */
    const fragments: DOM.Attachable[] = [];

    const party = unit.getParty();
    if (party) {
      fragments.push(html` ${format([`a|Rep a|is in ${party.rep()}.`])} `);
    }

    if (!unit.isHome()) {
      fragments.push(html`
        ${format([
          `a|Rep a|is not currently available.`,
          `a|Rep a|is not currently available for work.`,
        ])}
      `);

      const quest = unit.getQuest();
      if (quest) {
        fragments.push(html`
          ${format([
            `a|They a|is away on ${quest.rep()}, and should return within ${quest.getRemainingWeeks()} weeks.`,
          ])}
        `);
      }

      const opportunity = unit.getOpportunity();
      if (opportunity) {
        fragments.push(html`
          ${format([`a|They a|is currently involved in ${opportunity.rep()}`])}
        `);
      }

      if (State.variables.leave.isOnLeave(unit)) {
        let t;
        if (State.variables.leave.isLeaveDurationUnknown(unit)) {
          t = [
            `It is unclear how long a|they will remain away from your company.`,
          ];
        } else {
          const duration =
            State.variables.leave.getRemainingLeaveDuration(unit);
          if (duration == 1) {
            t = [`a|They should return within a week from now.`];
          } else {
            t = [`a|They should return within ${duration} weeks.`];
          }
        }
        fragments.push(html`
          ${format(t)} ${format(`a|They`)}
          ${State.variables.leave.getLeaveReason(unit)}
        `);
      }
    }

    const friendcheck =
      unit.isSlaver() &&
      State.variables.fort.player.isHasBuilding(
        setup.buildingtemplate.moraleoffice,
      );
    if (friendcheck) {
      const best_friend = State.variables.friendship.getBestFriend(unit);
      if (best_friend) {
        const friendship = State.variables.friendship.getFriendship(
          unit,
          best_friend,
        );
        fragments.push(html`
          ${setup.Text.replaceUnitMacros(
            `
            a|Rep is closest to b|rep, which a|they a|consider a|their ${getFriendTitle(friendship)}.
          `,
            { a: unit, b: best_friend },
          )}
        `);
      }
    }

    outer_fragments.push(setup.DOM.create("p", {}, fragments));
  }

  if (unit.isSlave()) {
    // become slaver
    const fragments: DOM.Attachable[] = [];

    fragments.push(html`
      ${format([
        `If a|rep was to become a slaver, a|their starting skills would be:`,
      ])}
      ${setup.SkillHelper.explainSkillsWithAdditives(unit)}
    `);

    outer_fragments.push(setup.DOM.create("p", {}, fragments));
  }

  return setup.DOM.create("div", {}, outer_fragments);
};
