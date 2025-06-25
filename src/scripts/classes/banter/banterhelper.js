/**
 * @file banterhelper.js
 * @module BanterHelper
 * @description
 * Provides helper functions and type definitions for managing banter interactions between units in the game.
 * Banter is a system where two units interact, potentially affecting their friendship, relationship status, and triggering special events.
 * This module ensures all banter logic, eligibility checks, and friendship calculations are handled consistently and robustly.
 *
 * @typedef {Object} BanterInstance
 *   Represents a single banter event between two units.
 * @property {setup.Unit} initiator - The unit initiating the banter.
 * @property {setup.Unit} target - The target unit of the banter.
 * @property {number} friendship_amt - The amount of friendship gained or lost as a result of the banter.
 */

// Magic constants for banter logic
const BANTER_EVENT_CHANCE = 0.5; // 50% chance to trigger a banter event

// Helper object for banter logic between two units.
setup.BanterHelper = {}

/**
 * Executes a banter interaction between two units, adjusting their friendship or triggering a relationship event.
 * If the friendship gain is positive and both units are eligible, there is a chance they become lovers instead of just friends.
 * Friendship is adjusted, statistics are updated, and a BanterInstance is returned to represent the event.
 *
 * @param {setup.Unit} initiator - The unit initiating the banter.
 * @param {setup.Unit} target - The target unit of the banter.
 * @param {number} friendship_amt - The amount of friendship to gain (or lose).
 * @returns {BanterInstance} The resulting banter instance, containing the initiator, target, and friendship change.
 */
setup.BanterHelper.banter = function(initiator, target, friendship_amt) {
  // If the friendship gain is positive and both units are not the player,
  // and they are eligible to become lovers, there is a chance for a relationship event.
  if (
    friendship_amt > 0 &&
    !initiator.isYou() &&
    !target.isYou() &&
    State.variables.friendship.isCanBecomeLovers(initiator, target) &&
    Math.random() < setup.LOVERS_HOOKUP_BANTER_CHANCE
  ) {
    // Trigger a lovers hookup event instead of a simple friendship gain.
    State.variables.friendship.hookup(initiator, target)
  } else {
    // Otherwise, simply adjust the friendship value between the two units.
    State.variables.friendship.adjustFriendship(initiator, target, friendship_amt)
  }

  // Track the number of banter events for statistics/analytics.
  State.variables.statistics.add('banters', 1)

  // Return a BanterInstance representing this interaction.
  /** @type {BanterInstance} */
  return /** @type {any} */ (new setup.BanterInstance(initiator, target, friendship_amt))
}

/**
 * Determines if two units are eligible to banter with each other, based on their state and relationship.
 * Checks for self-banter, injury, mindbroken status, private slave restrictions, and team/home status.
 *
 * @param {setup.Unit} initiator - The unit attempting to initiate banter.
 * @param {setup.Unit} target - The target unit for banter.
 * @returns {boolean} True if banter is allowed, false otherwise.
 */
setup.BanterHelper.isCanBanter = function(initiator, target) {
  // Units cannot banter with themselves.
  if (initiator == target) return false

  // Injured units cannot participate in banter.
  if (State.variables.hospital.isInjured(initiator)) return false
  if (State.variables.hospital.isInjured(target)) return false

  // Mindbroken units are not eligible for banter.
  if (initiator.isMindbroken() || target.isMindbroken()) return false

  // Private slaves can only banter with their owner.
  let bedchamber = target.getBedchamber()
  if (target.isSlave() && bedchamber && bedchamber.isPrivate() && bedchamber.getSlaver() != initiator) return false

  // If either unit is not at home, they can only banter if they are on the same team and both are in a team.
  if (!initiator.isHome() || !target.isHome()) {
    return initiator.getTeam() && target.getTeam() && initiator.getTeam() == target.getTeam()
  }

  // Otherwise, banter is allowed.
  return true
}

/**
 * Calculates the amount of friendship gained or lost from a banter interaction, factoring in compatibility and current relationship.
 * The sign of the friendship change can be forced, or determined probabilistically based on compatibility and current friendship.
 * Returns a BanterInstance representing the result.
 *
 * @param {setup.Unit} initiator - The unit initiating the banter.
 * @param {setup.Unit} target - The target unit of the banter.
 * @param {number} [forced_sign] - Optionally force the sign of the friendship change (1 for positive, -1 for negative).
 * @returns {BanterInstance} The resulting banter instance.
 */
setup.BanterHelper._computeBanter = function(initiator, target, forced_sign) {
  // Get compatibility scores: [same, diff]. Higher 'same' means more likely positive banter.
  let compatibility = State.variables.friendship.getCompatibility(initiator, target)
  let same = compatibility[0] + 1
  let diff = compatibility[1] + 1
  let current = State.variables.friendship.getFriendship(initiator, target)

  // Calculate a base friendship value within the allowed range.
  let baseval = setup.BANTER_GAIN_MIN + Math.random() * (setup.BANTER_GAIN_MAX - setup.BANTER_GAIN_MIN)
  baseval = Math.round(baseval)
  let sign = 0

  // If a sign is forced, use it. Otherwise, probabilistically determine sign based on current friendship.
  if (forced_sign) {
    sign = forced_sign
  } else if (current > 0) {
    if (Math.random() < current / 500.0) {
      sign = 1 // More likely to be positive if already friends.
    }
  } else if (current < 0) {
    if (Math.random() < Math.abs(current) / 500.0) {
      sign = -1 // More likely to be negative if already enemies.
    }
  }

  // If sign is still undetermined, use compatibility to decide.
  if (!sign) {
    let pchance = same / (same + diff)
    if (Math.random() < pchance) {
      sign = 1
    } else {
      sign = -1
    }
  }

  baseval *= sign
  // Return a BanterInstance for this computed interaction.
  /** @type {BanterInstance} */
  return /** @type {any} */ (setup.BanterHelper.banter(initiator, target, baseval))
}

/**
 * Attempts to perform a random banter event for a given unit, if eligible.
 * Only slavers can initiate banter events. The function prioritizes banter with own slaves, then friends, then other units.
 * Friendship slot limits and eligibility are respected. Returns a BanterInstance or null if no banter occurs.
 *
 * @param {setup.Unit} unit - The unit attempting to initiate banter.
 * @returns {BanterInstance|null} The resulting banter instance, or null if no banter occurred.
 */
setup.BanterHelper.doBanter = function(unit) {
  // Only slavers can trigger banter events.
  if (unit.getJob() != setup.job.slaver) {
    return null
  }

  // Use named constant for banter event chance
  if (Math.random() < BANTER_EVENT_CHANCE) return null

  let friends = State.variables.friendship.getFriendships(unit)

  // If at home, prioritize banter with own slaves who have no friendship connection yet.
  if (unit.isHome()) {
    let rooms = State.variables.bedchamberlist.getBedchambers({ slaver: unit })
    for (let i = 0; i < rooms.length; ++i) {
      let slaves = rooms[i].getSlaves()
      // Use Array.prototype.find for early exit and clarity
      let eligibleSlave = slaves.find(slave =>
        !State.variables.friendship.getFriendship(unit, slave) &&
        setup.BanterHelper.isCanBanter(unit, slave)
      )
      if (eligibleSlave) {
        return setup.BanterHelper._computeBanter(unit, eligibleSlave)
      }
    }
  }

  if (friends.length >= setup.BANTER_FRIENDS_SOFT_LIMIT) {
    setup.rng.shuffleArray(friends)
    // Use Array.prototype.find for early exit
    let eligibleFriend = friends.find(friendArr =>
      setup.BanterHelper.isCanBanter(unit, friendArr[0])
    )
    if (eligibleFriend) {
      return setup.BanterHelper._computeBanter(unit, eligibleFriend[0])
    }
  }

  if (friends.length >= setup.BANTER_FRIENDS_HARD_LIMIT) {
    return null
  }

  // Use Array.prototype.find for early exit among all units
  let units = State.variables.company.player.getUnits({}, false)
  setup.rng.shuffleArray(units)
  let eligibleTarget = units.find(target =>
    !((friends.length < setup.BANTER_USE_LIMIT) && (target.getJob() == setup.job.slave)) &&
    setup.BanterHelper.isCanBanter(unit, target)
  )
  if (eligibleTarget) {
    return setup.BanterHelper._computeBanter(unit, eligibleTarget)
  }

  // No eligible banter target found.
  return null
}
