"use strict";
// @ts-nocheck
/**
 * @param {setup.Unit} slaver
 * @param {setup.Unit} victim
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.bedchambercruelslaver = function (slaver, victim, bed) {
    let slaver_pronoun = {}, victim_pronoun = {};
    setup.DOM.pronounload(slaver_pronoun, slaver);
    setup.DOM.pronounload(victim_pronoun, victim);
    return html `
      You watch as ${slaver.rep()} approached one of ${setup.DOM.PronounYou.their(slaver)} private slaves ${victim.rep()}.
      Poor ${victim.name} cringes at ${slaver.name} predatory expression,
      but the cruel slaver doesn't pounce at once.
      Instead, ${slaver_pronoun.he} starts to walk around ${victim.name}, whose
      ${setup.Text.Unit.Trait['torso'](victim)} is nude for bed,
      groping and prodding ${victim_pronoun.him} as ${victim.name} shivers with fear.
      Finally ${slaver.rep()} sidles up behind ${victim.rep()} snaking ${slaver_pronoun.his} ${setup.Text.Unit.Trait['arms'](victim)}
      around ${victim.rep()}'s
      waist to cup ${victim_pronoun.his}
      ${victim.isHasDick() ? setup.Text.Unit.Trait['dick'](victim) : `pussy`}
      possessively with one ${setup.Text.Unit.Trait['hand'](slaver)}.
      ${victim.name} closes ${victim_pronoun.his} ${setup.Text.Unit.Trait['eyes'](victim)}.
      <br><br>
      ${slaver.rep()} chuckles into ${victim.rep()}'s ${setup.Text.Unit.Trait['ears'](victim)}, crooning,
      "${setup.Text.Insult.prerape(slaver, victim)}"
      ${victim_pronoun.He} grinds against the wilting ${slaver.name}, and then continues,
      "I felt your butt clench just now."
      ${victim_pronoun.He} gives ${victim.name}'s
      ${victim.isHasBalls() ? `balls a gentle squeeze` :
        victim.isHasDick() ? `dick a gentle tug` : `pussylips a gentle massage`}
      "It's going to hurt, you little bitch.
      I'm going to hold you down and shove my
      ${slaver.isHasDick() ? `cockhead` : `strap-on`}
      right up against this tight little hole."
      ${victim_pronoun.He} gropes the quivering slave's anus.
      "You're going to do your best to relax like a good little ${victim_pronoun.boy}.
      But it's going to be so big.
      It's going to burn.
      And then you're going to panic, and struggle,
      and I'm going to hold you down and rape your butt while you scream and cry."

      <br><br>
      ${slaver.rep()} suddenly shove ${victim.rep()} towards the ${bed}.
      ${victim_pronoun.He} crashes facedown into the ${bed}, already sobbing in terror.
      ${slaver_pronoun.He} places a ${setup.Text.Unit.Trait['hand'](slaver)} on ${victim_pronoun.his} back to hold ${victim_pronoun.him} down and then use the other to
      apply some lube to ${slaver_pronoun.his} ${slaver.isHasDick() ? `penis` : `strap-on`}
      pressing it against the quivering slave's anus.
      ${victim_pronoun.He} shakes with anguish, causing 
      ${slaver.isHasDick() ? `${slaver.name}'s cock to rub deliciously` : `the strap-on to slide amusingly`}
      up and down ${victim_pronoun.his} asscrack.
      ${victim.name} desperately takes in a huge breath.
      Here ${slaver.name} begin to apply inexorable pressure.
      ${victim.name} manages one more deep breath, but it becomes a squeal of
      anguish and ${victim_pronoun.he} tries frantically to burrow into the ${bed}, away from the penetrating
      ${slaver.isHasDick() ? `cock` : `strap-on`}.
      In the end, ${victim.name} is a mess, but hurries fearfully to obey ${slaver.name}'s instructions
      to go clean ${victim_pronoun.himself}.
    `;
};
