// @ts-nocheck


setup.Text.Duty.competence = function (duty) {
  let unit = duty.getAssignedUnit()
  let chance = duty.computeChance()

  // X is your <doctor>, <return value>.
  // You see your <doctor> working hard there, <return value>.

  let t = ``
  if (duty instanceof setup.DutyInstanceBedchamberSlave) {
    let owner = duty.getBedchamber().getSlaver()
    let friendship = State.variables.friendship.getFriendship(owner, unit)
    if (friendship < -900) {
      t = `being completely terrified of a|their owner ${owner.rep()}`
    } else if (friendship < -500) {
      t = `being abused harshly by a|their owner ${owner.rep()}`
    } else if (friendship < -200) {
      t = `often being abused by a|their owner ${owner.rep()}`
    } else if (friendship <= 200) {
      t = `busily serving a|their owner ${owner.rep()}, whom a|they still remain indifferent to`
    } else if (friendship <= 500) {
      t = `willingly serving a|their owner ${owner.rep()}`
    } else if (friendship <= 900) {
      t = `devotedly serving a|their owner ${owner.rep()}`
    } else {
      t = `serving a|their owner ${owner.rep()} with blind devotion`
    }
  } else if (duty.TYPE == 'prestige') {
    if (chance < 1) {
      t = `but a|they is completely unsuitable at the position`
    } else if (chance < 2) {
      t = `but a|they is barely appealing at a|their assigned duty`
    } else if (chance < 4) {
      t = `and a|they is an adequate slave for the job`
    } else if (chance < 6) {
      t = `and a|they fits the slave duty assigned to a|them`
    } else if (chance < 8) {
      t = `and you have wisely picked the right slave for this duty`
    } else if (chance < 10) {
      t = `and a|they is very good at the assigned duty`
    } else {
      t = `and a|they is extremely good at the assigned duty`
    }
  } else {
    if (chance < 0.05) {
      t = `but a|they is terrible at a|their job and does not actually get anything done`
    } else if (chance < 0.2) {
      t = `although a|they is not very competent at the job`
    } else if (chance < 0.4) {
      t = `a duty a|they perform decently well`
    } else if (chance < 0.6) {
      t = `and a|they are pretty good at it`
    } else if (chance < 0.8) {
      t = `--- a|they can even qualify as a professional if a|they want to`
    } else if (chance < 1.0) {
      t = `and a|they is extremely good at it`
    } else {
      t = `and a|they is prodigiously good at it`
    }
  }

  return setup.Text.replaceUnitMacros(t, { a: unit })
}

setup.Text.Duty.slavevalue = function (duty) {
  let prestige = duty.getCurrentPrestige()

  let unit = duty.getAssignedUnit()

  // <return value> [verb] them.
  // e.g., <return value> wants to manhandle them.
  let t
  if (prestige <= 1) {
    t = `a|They is unappealing and not well trained, and only few customers`
  } else if (prestige < 3) {
    t = `a|They has a rather average appeal for this duty, and some customers`
  } else if (prestige < 5) {
    t = `a|They draws many customers who`
  } else if (prestige < 7) {
    t = `There is often a queue forms of people who`
  } else if (prestige < 9) {
    t = `a|They is one of the main attractions in your fort and many people`
  } else if (prestige < 11) {
    t = `a|They draws many customers from all over the region to your fort and many`
  } else if (prestige < 13) {
    t = `a|They is an extremely prestigious slave so much that anyone`
  } else if (prestige < 15) {
    t = `a|They is so highly prestigious that occasionally famous people come to your fort and they`
  } else {
    t = `There are very few slaves who are as prestigious as a|they and everyone`
  }

  return setup.Text.replaceUnitMacros(t, { a: unit })
}
