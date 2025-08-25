import { rule } from "./util";

/**
 * Duty text pickers
 *
 * These maps convert numeric scores (friendship, chance, prestige) into
 * human-readable strings. They are intentionally expressed with the
 * `rule` fluent builder so thresholds are explicit and easy to tune.
 *
 * Important implementation notes:
 * - The strings intentionally retain unit macros (a|they) and the
 *   `<<owner>>` placeholder for bedchamber strings. Callers must pass
 *   the resulting text through `replaceUnit` and, where relevant,
 *   replace `<<owner>>` with owner.rep(). This keeps language
 *   generation consistent across the codebase.
 */

/* -------------------------------------------------------------------------- */
/* Bedchamber: friendship score -> text                                        */
/* -------------------------------------------------------------------------- */
export const bedchamberText = rule<string>()
  .lt(-900, `being completely terrified of a|their owner <<owner>>`)
  .lt(-800, `flinching at every approach from a|their owner <<owner>>`) // new in 2.0 expansion
  .lt(-700, `shaking under a|their owner <<owner>>’s harsh attention`) // new in 2.0 expansion
  .lt(
    -600,
    `kept under tight control by a|their owner <<owner>> and barely holding together`,
  ) // new in 2.0 expansion
  .lt(-500, `being abused harshly by a|their owner <<owner>>`)
  .lt(-400, `often punished by a|their owner <<owner>> and kept on edge`) // new in 2.0 expansion
  .lt(-300, `wary and withdrawn around a|their owner <<owner>>`) // new in 2.0 expansion
  .lt(-200, `often being abused by a|their owner <<owner>>`)
  .lte(-100, `submissively complying to avoid angering a|their owner <<owner>>`) // new in 2.0 expansion
  .lte(0, `uneasy around a|their owner <<owner>> yet following orders`) // new in 2.0 expansion
  .lte(100, `serving a|their owner <<owner>> with cool detachment`) // new in 2.0 expansion
  .lte(
    200,
    `busily serving a|their owner <<owner>>, whom a|they still remain indifferent to`,
  )
  .lte(300, `beginning to warm to a|their owner <<owner>> and trying to please`) // new in 2.0 expansion
  .lte(400, `dutifully attending to a|their owner <<owner>> with shy eagerness`) // new in 2.0 expansion
  .lte(500, `willingly serving a|their owner <<owner>>`)
  .lte(700, `fondly catering to a|their owner <<owner>> whenever possible`) // new in 2.0 expansion
  .lte(800, `ardently pleasing a|their owner <<owner>> at every cue`) // new in 2.0 expansion
  .lte(900, `devotedly serving a|their owner <<owner>>`)
  .else(`serving a|their owner <<owner>> with blind devotion`);

/* -------------------------------------------------------------------------- */
/* Prestige duty: chance -> text                                               */
/* -------------------------------------------------------------------------- */
export const prestigeChanceText = rule<string>()
  .lt(1.0, `but a|they is completely unsuitable at the position`)
  .lt(1.5, `but a|they is plainly unfit and awkward in the role`) // new in 2.0 expansion
  .lt(2.0, `but a|they is barely appealing at a|their assigned duty`)
  .lt(3.0, `and a|they feels underwhelming but serviceable`) // new in 2.0 expansion
  .lt(4.0, `and a|they is an adequate slave for the job`)
  .lt(5.0, `and a|they shows promise in this role`) // new in 2.0 expansion
  .lt(6.0, `and a|they fits the slave duty assigned to a|them`)
  .lt(7.0, `and a|they is clearly a good match and draws notice`) // new in 2.0 expansion
  .lt(8.0, `and you have wisely picked the right slave for this duty`)
  .lt(9.0, `and a|they impresses most patrons`) // new in 2.0 expansion
  .lt(10.0, `and a|they is very good at the assigned duty`)
  .else(`and a|they is extremely good at the assigned duty`);

/* -------------------------------------------------------------------------- */
/* Generic (non-prestige) duty: chance -> text                                 */
/* -------------------------------------------------------------------------- */
export const genericChanceText = rule<string>()
  .lt(
    0.05,
    `but a|they is terrible at a|their job and does not actually get anything done`,
  )
  .lt(0.1, `but a|they barely gets the basics right`) // new in 2.0 expansion
  .lt(0.2, `although a|they is not very competent at the job`)
  .lt(0.3, `with an uneven performance, yet managing routine tasks`) // new in 2.0 expansion
  .lt(0.4, `a duty a|they perform decently well`)
  .lt(0.5, `delivering steady, reliable results`) // new in 2.0 expansion
  .lt(0.6, `and a|they are pretty good at it`)
  .lt(0.7, `and a|they stands out among a|their peers`) // new in 2.0 expansion
  .lt(0.8, `--- a|they can even qualify as a professional if a|they want to`)
  .lt(0.9, `and a|they performs at a near-expert level`) // new in 2.0 expansion
  .lt(1.0, `and a|they is extremely good at it`)
  .else(`and a|they is prodigiously good at it`);

/* -------------------------------------------------------------------------- */
/* Prestige value (slavevalue): prestige -> text                               */
/* -------------------------------------------------------------------------- */
export const prestigeValueText = rule<string>()
  .lte(1, `a|They is unappealing and not well trained, and only few customers`)
  .lt(
    2,
    `a|They draws modest interest at best, with only a few curious visitors`,
  ) // new in 2.0 expansion
  .lt(3, `a|They has a rather average appeal for this duty, and some customers`)
  .lt(
    4,
    `a|They draws a steady trickle of customers who linger with cautious curiosity`,
  ) // new in 2.0 expansion
  .lt(5, `a|They draws many customers who`)
  .lt(6, `a|They often has small lines forming during busy hours`) // new in 2.0 expansion
  .lt(7, `There is often a queue forms of people who`)
  .lt(8, `Regulars begin to seek a|them out by name`) // new in 2.0 expansion
  .lt(9, `a|They is one of the main attractions in your fort and many people`)
  .lt(10, `a|They becomes the talk of nearby taverns and private salons`) // new in 2.0 expansion
  .lt(
    11,
    `a|They draws many customers from all over the region to your fort and many`,
  )
  .lt(12, `Travelers plan visits around a|their availability`) // new in 2.0 expansion
  .lt(13, `a|They is an extremely prestigious slave so much that anyone`)
  .lt(14, `Local nobles occasionally inquire personally for appointments`) // new in 2.0 expansion
  .lt(
    15,
    `a|They is so highly prestigious that occasionally famous people come to your fort and they`,
  )
  .else(
    `There are very few slaves who are as prestigious as a|they and everyone`,
  );
