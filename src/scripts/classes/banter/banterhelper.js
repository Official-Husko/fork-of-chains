
// Helper class about banter between two units.
setup.BanterHelper = {}

/**
 * unit initiator do something with target, and gain the given friendships
 * return the banter instance
 * @param {setup.Unit} initiator 
 * @param {setup.Unit} target 
 * @param {number} friendship_amt 
 */
setup.BanterHelper.banter = function(initiator, target, friendship_amt) {
  // Do the changes

  // First, there is a chance that they will become lovers.
  if (friendship_amt > 0 &&
      !initiator.isYou() &&
      !target.isYou() &&
      State.variables.friendship.isCanBecomeLovers(initiator, target) &&
      Math.random() < setup.LOVERS_HOOKUP_BANTER_CHANCE) {
    // become lovers instead of gaining friendship
    State.variables.friendship.hookup(initiator, target)
  } else {
    State.variables.friendship.adjustFriendship(initiator, target, friendship_amt)
  }

  State.variables.statistics.add('banters', 1)

  // return the banter
  return new setup.BanterInstance(initiator, target, friendship_amt)
}

setup.BanterHelper.isCanBanter = function(initiator, target) {
  if (initiator == target) return false

  // injured units cannot banter
  if (State.variables.hospital.isInjured(initiator)) return false
  if (State.variables.hospital.isInjured(target)) return false

  // mindbroken units cannot banter
  if (initiator.isMindbroken() || target.isMindbroken()) return false

  // private slaves cannot banter with anyone else but their owner
  let bedchamber = target.getBedchamber()
  if (target.isSlave() && bedchamber && bedchamber.isPrivate() && bedchamber.getSlaver() != initiator) return false

  // if they are not at home, then can only banter with team-mates, and only when they are in a team
  if (!initiator.isHome() || !target.isHome()) {
    return initiator.getTeam() && target.getTeam() && initiator.getTeam() == target.getTeam()
  }

  // otherwise, they can banter
  return true
}

// compute how much friendship gain should this interaction take and return the instance
setup.BanterHelper._computeBanter = function(initiator, target, forced_sign) {
  let compatibility = State.variables.friendship.getCompatibility(initiator, target)
  let same = compatibility[0] + 1
  let diff = compatibility[1] + 1
  let current = State.variables.friendship.getFriendship(initiator, target)

  let baseval = setup.BANTER_GAIN_MIN + Math.random() * (setup.BANTER_GAIN_MAX - setup.BANTER_GAIN_MIN)
  baseval = Math.round(baseval)
  let sign = 0

  if (forced_sign) {
    sign = forced_sign
  } else if (current > 0) {
    if (Math.random() < current / 500.0) {
      // force positive
      sign = 1
    }
  } else if (current < 0) {
    if (Math.random() < Math.abs(current) / 500.0) {
      // force negative
      sign = -1
    }
  }

  if (!sign) {
    // positive chance = based on same
    // negative chance = based on diff
    let pchance = same / (same+diff)
    if (Math.random() < pchance) {
      sign = 1
    } else {
      sign = -1
    }
  }

  baseval *= sign
  return setup.BanterHelper.banter(initiator, target, baseval)
}

// do a random banter for a unit.
setup.BanterHelper.doBanter = function(unit) {
  if (unit.getJob() != setup.job.slaver) {
    return null   // only slavers can proc events
  }

  // half chance of nothing happened
  if (Math.random() < 0.5) return null

  let friends = State.variables.friendship.getFriendships(unit)

  // 100% chance to play with own slave if no connection
  if (unit.isHome()) {
    let rooms = State.variables.bedchamberlist.getBedchambers({slaver: unit})
    for (let i = 0; i < rooms.length; ++i) {
      let slaves = rooms[i].getSlaves()
      for (let j = 0; j < slaves.length; ++j) {
        let slave = slaves[j]
        if (!State.variables.friendship.getFriendship(unit, slave) && setup.BanterHelper.isCanBanter(unit, slave)) {
          return setup.BanterHelper._computeBanter(unit, slave)
        }
      }
    }
  }

  if (friends.length >= setup.BANTER_FRIENDS_SOFT_LIMIT) {
    // prioritize friends
    setup.rng.shuffleArray(friends)
    for (let i = 0; i < friends.length; ++i) {
      let friend = friends[i][0]
      if (setup.BanterHelper.isCanBanter(unit, friend)) {
        return setup.BanterHelper._computeBanter(unit, friend)
      }
    }
  }

  // if no more friend slot...
  if (friends.length >= setup.BANTER_FRIENDS_HARD_LIMIT) {
    return null
  }

  // brute force the candidate
  let units = State.variables.company.player.getUnits()
  setup.rng.shuffleArray(units)
  for (let i = 0; i < units.length; ++i) {
    let target = units[i]
    if ((friends.length < setup.BANTER_USE_LIMIT) && (target.getJob() == setup.job.slave)) continue
    if (setup.BanterHelper.isCanBanter(unit, target)) {
      return setup.BanterHelper._computeBanter(unit, target)
    }
  }

  // no banter eligible target
  return null
}
