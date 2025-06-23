
setup.Text.Punish = {}


setup.Text.Punish.getPunishReasonSlave = function(unit) {
  let their = `<<their "${unit.key}">>`
  let they = `<<they "${unit.key}">>`
  let them = `<<them "${unit.key}">>`
  let themselves = `<<themselves "${unit.key}">>`
  let rep = unit.rep()

  const outputs = []

  outputs.push(`${rep} failed in to please ${their} owner`)

  let traits = unit.getTraits()
  if (traits.includes(setup.trait.training_none)) {
    outputs.push(`${rep} acted disobediently`)
  }

  if (unit.isMasochistic()) {
    outputs.push(`the masochistic slave ${rep} disobeys intentionally`)
  }

  if (!unit.isCanOrgasm()) {
    outputs.push(`${rep} orgasmed without permission`)
  }

  if (!unit.isCanTalk()) {
    outputs.push(`${rep} talked without permission`)
  }

  if (traits.includes(setup.trait.per_loner)) {
    outputs.push(`${rep} accidentally insulted ${their} owner`)
  }

  if (traits.includes(setup.trait.per_lunatic)) {
    outputs.push(`${rep} was being strange`)
  }

  if (traits.includes(setup.trait.per_chaste)) {
    outputs.push(`${rep} showed discomfort when being used sexually`)
  }

  if (unit.isHasTrait(setup.trait.per_lustful)) {
    if (unit.isHasDick()) {
      outputs.push(`${rep} came without permission`)
    } else {
      outputs.push(`${rep} climaxed without permission`)
    }
  }

  if (traits.includes(setup.trait.per_frugal)) {
    outputs.push(`${rep} hid a small amount of money`)
  }

  if (traits.includes(setup.trait.per_lavish)) {
    outputs.push(`${rep} wasted food`)
  }

  if (traits.includes(setup.trait.per_proud)) {
    outputs.push(`${rep} showed signs of defiance`)
  }

  if (traits.includes(setup.trait.per_humble)) {
    outputs.push(`${rep} refused to help discipline another slave`)
  }

  if (traits.includes(setup.trait.per_brave)) {
    outputs.push(`${rep} went overboard with ${their} advances`)
  }

  if (traits.includes(setup.trait.per_cautious)) {
    outputs.push(`${rep} was not creative enough with ${their} advances`)
  }

  if (traits.includes(setup.trait.per_kind)) {
    outputs.push(`${rep} helped another slave that was being punished`)
  }

  if (unit.isHasTrait(setup.trait.per_cruel)) {
    outputs.push(`${rep} helped another slave under punishment`)
  }

  if (traits.includes(setup.trait.per_direct)) {
    outputs.push(`${rep} forgot ${their} manners`)
  }

  if (traits.includes(setup.trait.per_sly)) {
    outputs.push(`${rep} lied`)
  }

  if (traits.includes(setup.trait.per_dominant)) {
    outputs.push(`${rep} overstepped ${their} borders`)
  }

  if (traits.includes(setup.trait.per_logical)) {
    outputs.push(`${rep} corrected ${their} master unnecessarily`)
  }

  if (traits.includes(setup.trait.per_empath)) {
    outputs.push(`${rep} showed pity to another disobedient slave`)
  }

  if (traits.includes(setup.trait.per_honorable)) {
    outputs.push(`${rep} refused sex with an evil slaver`)
  }

  if (traits.includes(setup.trait.per_evil)) {
    outputs.push(`${rep} schemed under ${their} owner's nose`)
  }

  if (traits.includes(setup.trait.per_attentive)) {
    outputs.push(`${rep} commented unnecessarily`)
  }

  if (traits.includes(setup.trait.per_dreamy)) {
    outputs.push(`${rep} did not pay attention`)
  }

  if (traits.includes(setup.trait.per_slow)) {
    outputs.push(`${rep} was slow at their task`)
  }

  if (traits.includes(setup.trait.per_serious)) {
    outputs.push(`${rep} looks unenthusiastic`)
  }

  if (traits.includes(setup.trait.per_loyal)) {
    outputs.push(`${rep} showed excessive loyalty`)
  }

  if (traits.includes(setup.trait.per_independent)) {
    outputs.push(`${rep} showed excessive disloyalty`)
  }

  if (traits.includes(setup.trait.per_playful)) {
    outputs.push(`${rep} was naughty`)
  }

  if (traits.includes(setup.trait.per_stubborn)) {
    if (traits.includes(setup.trait.training_none)) {
      outputs.push(`${rep} stubbornly showed signs of defiance`)
    }
  }

  if (traits.includes(setup.trait.per_studious)) {
    outputs.push(`${rep} was unenthusiastic at physical acts`)
  }

  if (traits.includes(setup.trait.per_active)) {
    outputs.push(`${rep} was lazy as their task`)
  }
  return outputs
}



setup.Text.Punish.getPunishReasonSlaver = function(unit) {
  let their = `<<their "${unit.key}">>`
  let they = `<<they "${unit.key}">>`
  let them = `<<them "${unit.key}">>`
  let themselves = `<<themselves "${unit.key}">>`
  let rep = unit.rep()

  const outputs = []

  outputs.push(`${rep} said something wrong`)
  outputs.push(`${rep} sneezed inappropriately`)

  let traits = unit.getTraits()
  if (unit.isMasochistic()) {
    outputs.push(`the masochistic slaver ${rep} showed ${their} masochistic advances`)
  }

  if (traits.includes(setup.trait.per_loner)) {
    outputs.push(`${rep} forgot ${their} manners`)
  }

  if (traits.includes(setup.trait.per_lunatic)) {
    outputs.push(`${rep} indulged in a lunacy`)
  }

  if (traits.includes(setup.trait.per_chaste)) {
    outputs.push(`${rep} kept averting ${their} gaze`)
  }

  if (unit.isHasTrait(setup.trait.per_lustful)) {
    outputs.push(`${rep} gestured lustfully and inappropriately`)
  }

  if (traits.includes(setup.trait.per_frugal)) {
    outputs.push(`${rep} selfishly cut mid-sentence`)
  }

  if (traits.includes(setup.trait.per_lavish)) {
    outputs.push(`${rep} wasted food`)
  }

  if (traits.includes(setup.trait.per_proud)) {
    outputs.push(`${rep} arrogantly delivered ${their} demands`)
  }

  if (traits.includes(setup.trait.per_humble)) {
    outputs.push(`${rep} refused to join in the discussion`)
  }

  if (traits.includes(setup.trait.per_brave)) {
    outputs.push(`${rep} went overboard`)
  }

  if (traits.includes(setup.trait.per_cautious)) {
    outputs.push(`${rep} was not creative enough`)
  }

  if (traits.includes(setup.trait.per_kind)) {
    outputs.push(`${rep} showed too much empathy`)
  }

  if (unit.isHasTrait(setup.trait.per_cruel)) {
    outputs.push(`${rep} suggested something extremely cruel`)
  }

  if (traits.includes(setup.trait.per_direct)) {
    outputs.push(`${rep} forgot ${their} manners`)
  }

  if (traits.includes(setup.trait.per_sly)) {
    outputs.push(`${rep} lied`)
  }

  if (traits.includes(setup.trait.per_dominant)) {
    outputs.push(`${rep} overstepped ${their} boundaries`)
  }

  if (traits.includes(setup.trait.per_logical)) {
    outputs.push(`${rep} squealed in fear`)
  }

  if (traits.includes(setup.trait.per_loyal)) {
    outputs.push(`${rep} showed excessive loyalty`)
  }

  if (traits.includes(setup.trait.per_independent)) {
    outputs.push(`${rep} showed excessive disloyalty`)
  }

  if (traits.includes(setup.trait.per_empath)) {
    outputs.push(`${rep} stated something subjective`)
  }

  if (traits.includes(setup.trait.per_honorable)) {
    outputs.push(`${rep} suggested ending slavery`)
  }

  if (traits.includes(setup.trait.per_evil)) {
    outputs.push(`${rep} schemed something evil`)
  }

  if (traits.includes(setup.trait.per_attentive)) {
    outputs.push(`${rep} commented unnecessarily`)
  }

  if (traits.includes(setup.trait.per_dreamy)) {
    outputs.push(`${rep} did not pay attention`)
  }

  if (traits.includes(setup.trait.per_slow)) {
    outputs.push(`${rep} unable to follow the discussions`)
  }

  if (traits.includes(setup.trait.per_serious)) {
    outputs.push(`${rep} responded unenthusiastically`)
  }

  if (traits.includes(setup.trait.per_playful)) {
    outputs.push(`${rep} kept sidetracking the dicussions`)
  }

  if (traits.includes(setup.trait.per_stubborn)) {
    outputs.push(`${rep} refused to change ${their} opinion`)
  }

  if (traits.includes(setup.trait.per_studious)) {
    outputs.push(`${rep} refused to act`)
  }

  if (traits.includes(setup.trait.per_active)) {
    outputs.push(`${rep} refused to study`)
  }
  return outputs
}



// Slaver punish unit because <<insert output here>>.
// assume unit is a slave.
setup.Text.Punish.punishreason = function(unit) {
  let outputs = []

  if (unit.isSlave()) {
    outputs = setup.Text.Punish.getPunishReasonSlave(unit)
  } else {
    outputs = setup.Text.Punish.getPunishReasonSlaver(unit)
  }

  return setup.rng.choice(outputs)
}
