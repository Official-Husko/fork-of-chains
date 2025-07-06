"use strict";
// @ts-nocheck
/**
 * @param {setup.Bedchamber} bedchamber
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.bedchamberdescription = function (bedchamber) {
    const fragments = [];
    const owner = bedchamber.getSlaver();
    const slaves = bedchamber.getSlaves();
    const is_you = owner === State.variables.unit.player;
    fragments.push(html `
    <p/>
  `);
    fragments.push(html `
      ${bedchamber.rep()} belongs to ${is_you ? 'you.' : owner.rep()}
  `);
    if (slaves.length === 0) {
        fragments.push(html `
        There are currently
        ${setup.DOM.Text.dangerlite('no slaves')}
        in the room. You can assign some by assigning slaves into
    `);
        bedchamber.getDuties().forEach(duty => {
            fragments.push(html `
          <span>
            ${duty.rep()}
          </span>
        `);
        });
        fragments.push(html `
        duties.
    `);
    }
    else {
        fragments.push(html `
        There are
        ${setup.DOM.Text.success(slaves.length)} slaves in this room, to be used by
        ${is_you ? 'you as you see fit.' : owner.getName() + ' as ' + setup.DOM.PronounYou.They(owner) + ' see fit.'}
    `);
        for (let i = 0; i < slaves.length; ++i) {
            let slave = slaves[i];
            let training = setup.UnitTitle.getMainTraining(slave);
            let description = setup.Text.Unit.Trait.description(slave, training);
            let relation = State.variables.family.getRelation(slave, owner);
            fragments.push(html `
        ${slave.rep()} is currently wearing ${setup.Text.Unit.Equipment.equipmentSummary(slave)}, and ${description}.
      `);
            if (relation) {
                fragments.push(html `
          This slave is ${owner.rep()}'s ${relation.rep()}.
        `);
                if (owner.getSpeech() === setup.speech.friendly) {
                    fragments.push(html `
            ${owner.rep()} tries ${setup.DOM.PronounYou.their(owner)} best to be nice to ${setup.DOM.PronounYou.their(owner)} ${relation.rep()}.
          `);
                }
                else if (owner.getSpeech() === setup.speech.cool) {
                    fragments.push(html `
            ${owner.rep()} uses ${setup.DOM.PronounYou.their(owner)} ${relation.rep()} like any other slave for ${setup.DOM.PronounYou.their(owner)} own enjoyment.
          `);
                }
                else if (owner.getSpeech() === setup.speech.proud) {
                    fragments.push(html `
            ${owner.rep()} enjoys teaching ${setup.DOM.PronounYou.their(owner)} ${relation.rep()} their proper place in the world.
          `);
                }
                else {
                    fragments.push(html `
            ${owner.rep()} enjoys the perversity of having ${setup.DOM.PronounYou.their(owner)} ${relation.rep()} as a personal slave.
          `);
                }
            }
        }
        if (slaves.length === 2) {
            let relation = State.variables.family.getRelation(slaves[0], slaves[1]);
            if (relation) {
                fragments.push(html `
          ${slaves[0].rep()} is ${slaves[1].rep()}'s ${relation.rep()}.
        `);
            }
        }
    }
    fragments.push(html `
    <p/>
  `);
    let busyslaves = bedchamber.getAssignedSlaves().filter(unit => !unit.isAvailable());
    if (busyslaves.length != 0) {
        for (let i = 0; i < busyslaves.length; ++i) {
            let slave = busyslaves[i];
            fragments.push(html `
        ${setup.DOM.Util.YourRep(slave)} is assigned to this bedchamber, but is currently
        unavailable for use.
      `);
        }
        fragments.push(html `
      <p/>
    `);
    }
    if (slaves.length != 0) {
        fragments.push(html `
      ${is_you ? "You have" : owner.rep() + " has"} written some rules that the slaves
      are forced to follow.
    `);
        if (bedchamber.getOption('walk') === 'crawl') {
            fragments.push(html `
        The slaves are not allowed to stand on equal footing with
        ${is_you ? "you" : "the slaver"} and are forced to crawl on all fours at all times.
        ${slaves[0].isHasTrait(setup.trait.eq_restrained) ?
                `It's not like they have a choice either, given the restraints that ${slaves[0].rep()} is wearing.` : ""}
      `);
        }
        else if (bedchamber.getOption('walk') === 'walk') {
            fragments.push(html `
        The slaves are allowed to move by walking like a normal humanlike.
        ${slaves[0].isHasTrait(setup.trait.eq_restrained) ?
                `Although given the restraints that ${slaves[0].rep()} is wearing, walking is a difficult task.` : ""}
      `);
        }
        if (bedchamber.getOption('orgasm') === 'no') {
            fragments.push(html `
        None of the slaves are ever allowed to orgasm.
        ${slaves[0].isHasTrait(setup.trait.eq_chastity) ?
                `A somewhat redundant rule given the state of ${slaves[0].rep()}'s 
          ${setup.Text.Unit.Trait['dick'](slaves[0], /* eq = */ true)}.` : ""}
        ${slaves.length > 1 && slaves[1].isHasTrait(setup.trait.eq_chastity) ?
                `The rule has little effect on ${slaves[1].rep()}'s ${setup.Text.Unit.Trait['dick'](slaves[1], /* eq = */ true)}.` : ""}
      `);
        }
        else if (bedchamber.getOption('orgasm') === 'yes') {
            fragments.push(html `
        Occasionally, ${is_you ? "you allow" : `${owner.rep()} allows`} the slaves to climax.
        ${slaves[0].isHasTrait(setup.trait.eq_chastity) ?
                `It's a rare occasion however, and most of the time ${slaves[0].rep()} 
          displays  ${setup.DOM.PronounYou.their(slaves[0])} ${setup.Text.Unit.Trait['dick'](slaves[0], /* eq = */ true)}.` : ""}
        ${slaves.length > 1 && slaves[1].isHasTrait(setup.trait.eq_chastity) ?
                `Even so, ${slaves[1].rep()} rarely reaches orgasm --- 
           the reason is obvious when you look at ${setup.DOM.PronounYou.their(slaves[1])} ${setup.Text.Unit.Trait['dick'](slaves[1], /* eq = */ true)}.` : ""}
      `);
        }
        if (bedchamber.getOption('speech') === 'full') {
            fragments.push(html `
        The slaves are allowed to communicate like a human being
        ${slaves[0].isHasTrait(setup.trait.eq_gagged) ?
                `during the rare moments when ${slaves[0].rep()}'s 
          ${setup.Text.Unit.Trait['cmouth'](slaves[0])} are taken off` : ""}
        .
        ${slaves.length > 1 && slaves[1].isHasTrait(setup.trait.eq_gagged) ?
                `The priviledge is somewhat lost to ${slaves[1].rep()} whose ${setup.Text.Unit.Trait['mouth'](slaves[1])}
          remains gagged with ${setup.Text.Unit.Trait['cmouth'](slaves[1])} most of the time.` : ""}
      `);
        }
        else if (bedchamber.getOption('speech') === 'animal') {
            fragments.push(html `
        The slaves are only allowed to communicate using animal-like sounds, like barks and moos.
        ${slaves[0].isHasTrait(setup.trait.eq_gagged) ?
                `Even then, ${slaves[0].rep()} can only do it during the rare moments when ${slaves[0].rep()}'s
          ${setup.Text.Unit.Trait['cmouth'](slaves[0])} are taken off.` : ""}
        ${slaves.length > 1 && slaves[1].isHasTrait(setup.trait.eq_gagged) ?
                `The degrading priviledge is somewhat lost to ${slaves[1].rep()} whose ${setup.Text.Unit.Trait['mouth'](slaves[1])}
          remains gagged with ${setup.Text.Unit.Trait['cmouth'](slaves[1])} most of the time.` : ""}
      `);
        }
        else if (bedchamber.getOption('speech') === 'none') {
            fragments.push(html `
        The slaves are not allowed to make any sound, and must remain quiet most of the time lest
        they receive harsh punishment.
        ${slaves[0].isHasTrait(setup.trait.eq_gagged) ?
                `As an extra insurance, ${slaves[0].rep()}'s ${setup.Text.Unit.Trait['mouth'](slaves[0])}
          is stuffed with ${setup.Text.Unit.Trait['cmouth'](slaves[0])} most of the time.` : ""}
        ${slaves.length > 1 && slaves[1].isHasTrait(setup.trait.eq_gagged) ?
                `${slaves[1].rep()} also wears ${setup.Text.Unit.Trait['cmouth'](slaves[1])}
          for most of the time to ensure compliance with the rules.` : ""}
      `);
        }
        if (!bedchamber.isPrivate()) {
            fragments.push(html `
        ${is_you ? 'You have' : `${owner.rep()} has`}
        generously allowed ${is_you ? 'your' : ` ${setup.DOM.PronounYou.their(owner)}`} private slaves to be used by your other slavers.
      `);
        }
        else {
            fragments.push(html `
        ${is_you ? 'You have' : `${owner.rep()} has`}
        strictly disallowed anyone else to use ${is_you ? 'your' : ` ${setup.DOM.PronounYou.their(owner)}`} private slaves.
      `);
        }
    }
    else {
        fragments.push(html `
      There are no slaves around to be forced to follow
      ${is_you ? 'your' : `${owner.rep()}'s`} rules.
    `);
    }
    fragments.push(html `
    <p/>
  `);
    const slaverbed = bedchamber.getFurniture(setup.furnitureslot.slaverbed);
    const slavebed = bedchamber.getFurniture(setup.furnitureslot.slavebed);
    fragments.push(html `
    The centerpiece of the room is the ${slaverbed.rep()}, where
    ${is_you ? 'you can make use of your slaves.' : `${owner.rep()} can make use of ${setup.DOM.PronounYou.their(owner)} slaves.`}
    ${!slaves.length ? "There are none right now, however." : ""}
    ${slaverbed.getBedchamberText()}
    On its feet is the ${slavebed.rep()}, where the slaves sleep.
    ${slavebed.getBedchamberText()}
  `);
    fragments.push(html `
    <p/>
  `);
    const foodtray = bedchamber.getFurniture(setup.furnitureslot.foodtray);
    fragments.push(html `
    The slaves${!slaves.length ? ", were there to be any," : ""}
    ${bedchamber.getOption('food') === 'normal' ? `are given standard food to eat on the` : ""}
    ${bedchamber.getOption('food') === 'cum' ? `can only eat food that has been tainted with cum on the` : ""}
    ${bedchamber.getOption('food') === 'milk' ? `can only eat food that has been mixed with humanlike cum on the` : ""}
    ${foodtray.rep()}.
  `);
    if (slaves.length && bedchamber.getOption('food') === 'cum') {
        fragments.push(html `
      ${slaves[0].isHasDick() ? `Sometimes, ${slaves[0].rep()} mixed ${setup.DOM.PronounYou.their(slaves[0])} own cum into
      ${setup.DOM.PronounYou.their(slaves[0])} own food.` : ""}
      ${slaves.length > 1 && slaves[1].isHasDick() ?
            `Sometimes, ${slaves[1].rep()} mixed ${setup.DOM.PronounYou.their(slaves[1])} own cum into
      ${setup.DOM.PronounYou.their(slaves[1])} own food.` : ""}
    `);
    }
    fragments.push(html `
    ${foodtray.getBedchamberText()}
  `);
    if (owner.isHasDick() && slaves.length && owner.Seed('slavecum') % 3 == 0) {
        fragments.push(html `
      ${is_you ? 'You' : `${owner.rep()}`}
      sometimes provide fresh desserts to the slaves and allow them to suck the cream directly from
      ${is_you ? 'your' : `${setup.DOM.PronounYou.their(owner)}`}
      "eclair".
    `);
    }
    const drinktray = bedchamber.getFurniture(setup.furnitureslot.drinktray);
    fragments.push(html `
    The slaves nourishes their thirst by drinking from the ${drinktray.rep()}.
  `);
    if (slaves.length && !State.variables.settings.isBanned('watersport') && owner.Seed('piss') % 5 == 0) {
        fragments.push(html `
      Sometimes,
      ${is_you ? 'you adds a little of your' : `${owner.rep()} adds a little`}
      piss to spice up their drink.
    `);
    }
    fragments.push(html `
    ${drinktray.getBedchamberText()}
  `);
    fragments.push(html `
    <p/>
  `);
    const reward = bedchamber.getFurniture(setup.furnitureslot.reward);
    fragments.push(html `
    ${reward.isBasic() ? 'The room is not equipped with any amusements for the slaves.' :
        `To amuse the slaves when their owners are not in the room,
    the room is equipped with ${reward.rep()}.`}
    ${reward.getBedchamberText()}
    ${bedchamber.getOption('walk') == 'crawl' ? `The slaves must remain on all fours, of course.` : ``}
  `);
    const punishment = bedchamber.getFurniture(setup.furnitureslot.punishment);
    fragments.push(html `
    ${slaves.length ?
        html `When the slaves misbehave,` :
        html `${is_you ? 'You have' : `${owner.rep()} has`}
    planned what to do when a slave misbehaves. When they misbehave,`}
    they will be punished using
    ${punishment.isBasic() ? `nothing but bare ${setup.Text.Unit.Trait['hands'](State.variables.unit.player)}.` : `${punishment.rep()}.`}
    ${punishment.getBedchamberText()}
    ${punishment.getTags().includes('upsidedown') ?
        html `${punishment.rep()} allows you to hang slaves upside-down from the ceiling,
    ${setup.qres.HasItem(setup.item.sexmanual_upsidedown) ?
            html `which unlocks the ${setup.sexpose.upsidedown.rep()} for sex in the room.` :
            html `but you
      ${setup.DOM.Text.danger("don't know")} how to use that in sex for now...`}` :
        ``}
  `);
    fragments.push(html `
    <p/>
  `);
    const lighting = bedchamber.getFurniture(setup.furnitureslot.lighting);
    fragments.push(html `
    The room is illuminated by the ${lighting.rep()}.
    ${lighting.getBedchamberText()}
  `);
    const tile = bedchamber.getFurniture(setup.furnitureslot.tile);
    fragments.push(html `
    ${tile.isBasic() ? `Nothing is covering the worn-out floor.` : `The floor is covered with ${tile.rep()}.`}
    ${tile.getBedchamberText()}
  `);
    const decorative_object = bedchamber.getFurniture(setup.furnitureslot.object);
    fragments.push(html `
    ${decorative_object.isBasic() ? `There are no decorative furniture placed on the floor.` : `On the corner of the room is a decorative ${decorative_object.rep()}.`}
    ${decorative_object.getBedchamberText()}
  `);
    const wall = bedchamber.getFurniture(setup.furnitureslot.wall);
    fragments.push(html `
    ${wall.isBasic() ? `Nothing is covering the worn out walls of the room.` : `The walls of the room are decorated with ${wall.rep()}.`}
    ${wall.getBedchamberText()}
  `);
    fragments.push(html `
    <p/>
  `);
    if (slaves.length) {
        if (is_you) {
            for (let i = 0; i < slaves.length; ++i) {
                let slave = slaves[i];
                fragments.push(html `
          ${i ? `Next, you turn your attention to ${slave.rep()}.` : ``}
          You command  ${slave.rep()} to

          ${bedchamber.getOption('walk') == 'crawl' ?
                    `crawl over to you like a dog, since ${setup.DOM.PronounYou.they(slave)} is not allowed to walk.` : `approach you.`}
        `);
                if (slave.isHasDick()) {
                    fragments.push(html `
            ${setup.Text.Unit.Equipment.stripDick(slave)}.
            ${bedchamber.getOption('orgasm') == 'yes' ?
                        `${Math.random() < 0.5 ?
                            `You fondle ${setup.DOM.PronounYou.their(slave)} ${setup.Text.Unit.Trait['balls'](slave)}, eliciting moans from the slave.`
                            : `You fondle ${setup.DOM.PronounYou.their(slave)} leaking ${setup.Text.Unit.Trait['dick'](slave)}, eliciting moans from the slave.`}`
                        :
                            `You fondle ${setup.DOM.PronounYou.their(slave)} overly full ${setup.Text.Unit.Trait['balls'](slave)}, which is practically begging for release.`}
            ${slave.isHasTrait(setup.trait.eq_chastity) ? `You locked ${setup.DOM.PronounYou.their(slave)} ${setup.Text.Unit.Trait['dick'](slave)} back in the chastity cage.` : ``}
          `);
                }
                else {
                    fragments.push(html `
            ${bedchamber.getOption('orgasm') == 'yes' ?
                        `You fondle ${setup.DOM.PronounYou.their(slave)} wet pussy and play with ${setup.DOM.PronounYou.their(slave)} clit.` :
                        `You fondle ${setup.DOM.PronounYou.their(slave)} wet pussy and play with ${setup.DOM.PronounYou.their(slave)} clit, which is practically begging for climax after so much time in denial.`}
          `);
                }
                if (slave.isHasTrait(setup.trait.eq_gagged)) {
                    fragments.push(html `
            ${setup.DOM.PronounYou.They(slave)} moaned through ${setup.DOM.PronounYou.their(slave)} ${setup.Text.Unit.Trait['cmouth'](slave)}
            as you continue to manhandle ${setup.DOM.PronounYou.them(slave)}.
          `);
                }
                else if (bedchamber.getOption('speech') == 'full') {
                    fragments.push(html `
            ${setup.DOM.PronounYou.They(slave)} moaned verbally as you continue to manhandle ${setup.DOM.PronounYou.them(slave)}.
          `);
                }
                else if (bedchamber.getOption('speech') == 'animal') {
                    fragments.push(html `
            ${setup.DOM.PronounYou.They(slave)} gave ${setup.DOM.PronounYou.their(slave)} best impression of a cow moo as
              you continue to manhandle ${setup.DOM.PronounYou.them(slave)}.
          `);
                }
                else if (bedchamber.getOption('speech') == 'none') {
                    fragments.push(html `
            ${setup.DOM.PronounYou.They(slave)} tried ${setup.DOM.PronounYou.their(slave)} best avoiding making any sound
            as continue to manhandle ${setup.DOM.PronounYou.them(slave)}.
          `);
                }
            }
            const foodtray = bedchamber.getFurniture(setup.furnitureslot.foodtray);
            fragments.push(html `
        Finally, it is time to feed your slaves.
        You place their food on the ${foodtray.rep()}
      `);
            if (bedchamber.getOption('food') == 'normal') {
                fragments.push(html `
          , a nutritious mixture of ingredients to keep them healthy.
          Your slaves giddily lap up the food.
        `);
            }
            else if (bedchamber.getOption('food') == 'cum') {
                if (State.variables.unit.player.isHasDick()) {
                    fragments.push(html `
            . Shoving your ${setup.Text.Unit.Trait['dick'](State.variables.unit.player)} into ${slaves[0].rep()}'s mouth,
            you quickly orgasmed ---
            you spray your cum over the slaves' food to make it edible for your slaves.
          `);
                }
                else if (slaves[0].isHasDick()) {
                    fragments.push(html `
            . You proceed to milk ${slaves[0].rep()}'s ${setup.Text.Unit.Trait['dick'](slaves[0])}
            and spray the cum over the food.
          `);
                }
                else {
                    fragments.push(html `
            . You opened the bottle of cum you brought to the room and emptied it on
            the ${foodtray.rep()}.
          `);
                }
                fragments.push(html `
          Your slaves lap up the cum-soaked food as their only option to not starve.
        `);
            }
            else if (bedchamber.getOption('food') == 'milk') {
                if (slaves[0].isHasBreasts()) {
                    fragments.push(html `
            . You proceed to milk ${slaves[0].rep()}'s ${setup.Text.Unit.Trait['breast'](slaves[0])}
            and spill the milk over the food.
          `);
                }
                else {
                    fragments.push(html `
            . You opened the bottle of humanlike milk you brought to the room and emptied it on
            the ${foodtray.rep()}.
          `);
                }
                fragments.push(html `
          Your slaves lap up the milk-soaked food as their only option to not starve.
        `);
            }
        }
        else { // Is not you
            fragments.push(html `
        ${owner.rep()} often play with ${setup.DOM.PronounYou.their(owner)} slaves in the room.
      `);
            if (bedchamber.getOption('walk') == 'crawl') {
                fragments.push(html `
          Sometimes, ${owner.rep()} plays catch with ${setup.DOM.PronounYou.their(owner)} slaves who are
          forced to crawl on all fours and grab the thrown ball.
        `);
            }
            const slave = slaves[0];
            if (bedchamber.getOption('orgasm') == 'yes') {
                const slaverbed = bedchamber.getFurniture(setup.furnitureslot.slaverbed);
                fragments.push(html `
          ${owner.rep()} often came together with ${setup.DOM.PronounYou.their(owner)} slaves,
          resting all together on the
          ${slaverbed.rep()}.
        `);
            }
            else {
                fragments.push(html `
          ${owner.rep()} enjoys tormenting ${setup.DOM.PronounYou.their(owner)} slaves' genitals,
          who are forbidden to orgasm.
        `);
            }
            if (bedchamber.getOption('food') == 'normal') {
                fragments.push(html `
          ${owner.rep()} likes to keep ${setup.DOM.PronounYou.their(owner)} slaves healthy by feeding
          them with standard nutritious diet.
        `);
            }
            else if (bedchamber.getOption('food') == 'cum') {
                fragments.push(html `
          ${owner.rep()} keeps ${setup.DOM.PronounYou.their(owner)} slaves in strict cum-added diet,
        `);
                if (slave.isHasDick()) {
                    fragments.push(html `
            using the slaves' own dick to produce the cum.
          `);
                }
                else if (owner.isHasDick()) {
                    fragments.push(html `
            often adding ${setup.DOM.PronounYou.their(owner)} own cum to the slaves' diet.
          `);
                }
                else {
                    fragments.push(html `
            borrowing the cum from elsewhere.
          `);
                }
            }
            else if (bedchamber.getOption('food') == 'milk') {
                fragments.push(html `
          ${owner.rep()} keeps ${setup.DOM.PronounYou.their(owner)} slaves in strict milk-added diet,
          ${slave.isHasBreasts() ? `using the slaves' own udders to produce the milk.` : `obtaining the humanlike milk from elsewhere.`}
        `);
            }
        }
    }
    else { // No slaves in bedchamber
        if (is_you) {
            fragments.push(html `
        You cannot wait until you get some slaves to play with here.
      `);
        }
        else {
            fragments.push(html `
        ${owner.rep()} is eagerly waiting for ${setup.DOM.PronounYou.their(owner)} own personal slaves to play with.
      `);
        }
    }
    fragments.push(html `
    <p/>
  `);
    if (!is_you && owner.isHasTrait('per_cruel') && slaves.length) {
        fragments.push(html `
      <div>
        ${setup.DOM.Util.message(`(Watch ${owner.getName()} cruelly uses a slave)`, () => {
            const victim = setup.rng.choice(slaves);
            const bed = bedchamber.getFurniture(setup.furnitureslot.slaverbed).rep();
            return setup.DOM.Menu.bedchambercruelslaver(owner, victim, bed);
        })}
      </div>
    `);
    }
    return setup.DOM.create('div', {}, fragments);
};
