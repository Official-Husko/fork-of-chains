// @ts-nocheck

import { createLevelOneUnitCopy } from "../../classes/unit/util"
import { menuItemAction, menuItemText } from "../../ui/menu"
import { livingPassage } from "../card/livingdescription"

const CONTAINER_DIV_ID = 'newgamepluspromptsdivid'

/**
 * New game plus starting menu
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.newgameplus = function () {
  const outer = []
  const player = State.variables.unit.player
  outer.push(html`
    <p>
      You have led your company for ${player.getWeeksWithCompany()} weeks
      as of now, and your fort has been transformed from the decrepit
      building it once was into the grand structure standing before you.
      You have succeeded in creating a new, formidable slaving company from
      almost nothing, and you've seen all the struggles that lead to this point
      as well.
      You know better than anyone else -- in this business, it might be just the
      prudent decision to retire while you still have all your limbs and slaves
      intact.
    </p>

    <p>
      If you are sure you decided to retire, you'll have to think what you are
      planning to do after you retire.
      Perhaps you'll get some of your slavers as well as a slave to accompany
      you traveling around the land.
      Or if you are feeling particularly crazy, you could band up with a few of your slavers
      to start anew and create yet another slaving company in the continent of
      ${setup.lore.geo_mestia.rep()}...
    </p>

    <p>
      ${setup.DOM.Text.danger('WARNING:')} Choosing any of the options to continue will
      end your current game, but it allows you to start a
      ${setup.DOM.Text.successlite('New Game+')}, where you can start anew with the company of a few
      of your current slavers.
    </p>

    <div>
      ${setup.DOM.Nav.button(
    `It's time to retire from leading a slaving company for good`,
    () => {
      setup.DOM.Helper.replace(
        `#${CONTAINER_DIV_ID}`,
        newGamePlusChooseUnitsFragment(/* is new pc = */ true),
      )
    },
  )}
      ${setup.DOM.Util.help(
    html`
          Choose this option if you want to begin with an entirely new character.
        `
  )}
    </div>

    <div>
      ${setup.DOM.Nav.button(
    `Maybe starting a new company might be a good idea...`,
    () => {
      setup.DOM.Helper.replace(
        `#${CONTAINER_DIV_ID}`,
        newGamePlusChooseUnitsFragment(/* is new pc = */ false),
      )
    },
  )}
      ${setup.DOM.Util.help(
    html`
          Choose this option if you want to begin a new game but continue to use the same player character.
          Note, however, that if the player character has multiple skill traits
          (${setup.TraitHelper.getAllTraitsOfTags(['skill']).map(trait => trait.rep()).join('')})
          you will need to choose only one to retain.
        `
  )}
    </div>

    <div>
      ${setup.DOM.Nav.link(
    `(abandon this idea and return back to your company)`,
    () => {
      setup.DOM.Nav.gotoreturn()
    },
  )}
    </div>
  `)

  return setup.DOM.create('div', { id: CONTAINER_DIV_ID }, outer)
}

/**
 * @param {boolean} is_new_pc 
 * @param {setup.Unit[]} [selected_units]
 * @returns {setup.DOM.Node}
 */
function newGamePlusChooseUnitsFragment(is_new_pc, selected_units = []) {
  const fragments = []
  let slaver_limit = setup.NEW_GAME_PLUS_SLAVERS
  const slaves_limit = setup.NEW_GAME_PLUS_SLAVES
  if (selected_units.length >= slaver_limit + slaves_limit) {
    return newGamePlusShowEpilogue(is_new_pc, selected_units)
  }
  if (is_new_pc) {
    fragments.push(html`
    <p>
      You have decided to retire for good and travel the land as a common adventurer.
      Perhaps you could ask some of your available slavers as well as a slave to accompany your journey...
    </p>`)
  } else {
    fragments.push(html`
    <p>
      You have decided to find a brand new slaving company from the grounds up.
      Perhaps you could invite some of your available slavers to accompany you on your grand new
      endeavor...
    </p>`)
  }

  fragments.push(setup.DOM.create('p', {}, html`
    You can choose up to
    ${slaver_limit} slaver${slaver_limit > 1 ? 's' : ''}
    and ${slaves_limit} slave${slaves_limit > 1 ? 's' : ''}.
    ${selected_units.length ?
      html`So far, you have invited ${selected_units.map(unit => unit.rep()).join('')}.`
      : ''}
    Since you are still under the limit, you can still invite some more.
    You can also just ${setup.DOM.Nav.link(
        `finish selecting units`,
        () => {
          setup.DOM.Helper.replace(
            `#${CONTAINER_DIV_ID}`,
            newGamePlusShowEpilogue(is_new_pc, selected_units)
          )
        },
      )}
    or even ${setup.DOM.Nav.link(
        `change your mind and go back to your office`,
        () => {
          setup.DOM.Nav.gotoreturn()
        },
      )}.
    Note that you can only invite units that are ${setup.DOM.Text.successlite('currently at home')}.
  `))

  let candidates = State.variables.company.player.getUnits({}).concat(
    State.variables.retiredlist.getUnits()
  )
  candidates = candidates.filter(unit => {
    if (unit.isYou()) return false
    // if (unit.isYourCompany() && !unit.isAvailable()) return false
    // if (unit.isRetired() && unit.isEngaged()) return false
    if (unit.isHasTrait(setup.trait.will_indomitable)) return false
    if (selected_units.includes(unit)) return false
    if (selected_units.filter(u => u.isSlaver()).length >= slaver_limit && unit.isSlaver()) return false
    if (selected_units.filter(u => u.isSlave()).length >= slaves_limit && unit.isSlave()) return false
    return true
  })

  fragments.push(selectunitfornewgameplus(candidates, is_new_pc, selected_units))
  return setup.DOM.create('div', {}, fragments)
}


/**
 * @param {setup.Unit[]} units
 * @param {boolean} is_new_pc 
 * @param {setup.Unit[]} selected_units
 * @returns {setup.DOM.Node}
 */
function selectunitfornewgameplus(units, is_new_pc, selected_units) {
  return setup.DOM.Roster.show({
    menu: 'unitnewgameplus',
    units: units,
    no_compact_display: true,
    actions_callback: /** @param {setup.Unit} unit */ (unit) => {
      const menus = []

      menus.push(menuItemAction({
        text: `Select`,
        callback: () => {
          selected_units.push(unit)
          setup.DOM.Helper.replace(
            `#${CONTAINER_DIV_ID}`,
            newGamePlusChooseUnitsFragment(is_new_pc, selected_units),
          )
        },
      }))

      return menus
    }
  })
}


/**
 * @param {boolean} is_new_pc 
 * @param {setup.Unit[]} selected_units
 * @returns {setup.DOM.Node}
 */
function newGamePlusShowEpilogue(is_new_pc, selected_units) {
  const fragments = []

  // describe retirement
  const all_units = State.variables.company.player.getUnits({}).filter(
    unit => !unit.isYou() && !selected_units.includes(unit)
  )
  let existing_slavers = all_units.filter(unit => unit.isSlaver())
  let existing_slaves = all_units.filter(unit => unit.isSlave())
  setup.rng.shuffleArray(existing_slavers)
  setup.rng.shuffleArray(existing_slaves)

  const epilogues = []

  epilogues.push(`
    After saying your goodbyes, you departed your fort together with some of your
    friends. You would occasionally check back on the fort, and you learn the latest
    news on the rest of your ex-slavers...
  `)

  // give everyone not brought along a proper epilogue
  // first pick a new leader
  let new_leader = null
  if (existing_slavers.length) {
    let seniors = existing_slavers.filter(unit => unit.isHasTrait('join_senior'))
    if (!seniors.length) seniors = existing_slavers
    new_leader = seniors[0]
    existing_slavers = existing_slavers.splice(1)
  }

  // do the rest of the slavers
  for (const slaver of existing_slavers) {
    const quit_chance = setup.NEW_GAME_PLUS_BASE_QUIT_CHANCE + setup.SexUtil.sumTraitMultipliers(slaver, setup.NEW_GAME_PLUS_QUIT_CHANCE)
    if (Math.random() < quit_chance) {
      epilogues.push(getLeaveCompanyText(slaver))
    } else {
      epilogues.push(getStayWithCompanyText(slaver))
    }
  }

  // push leader text last
  if (new_leader) {
    epilogues.push(getNewLeaderText(new_leader))
  }

  // give prospect for the future
  if (is_new_pc) {
    epilogues.push(`
      As for you and your new band of friends, you've decided to enjoy having been freed from
      the burdens of leadership, and just enjoy the rest of your life.
      In fact, you've been hearing that a certain young slaver is looking for companions to
      begin a new slaving company, and perhaps you could help advise them for a little while...
    `)
  } else {
    epilogues.push(`
      Your story has not finished yet, however, as you have decided to begin anew with a fresh
      and new slaving company...
    `)
  }

  // display all epilogues
  for (const epilogue of epilogues) {
    fragments.push(html`<p>${epilogue}</p>`)
  }

  // big confirm button
  fragments.push(html`
    <div>
      ${setup.DOM.Nav.button(
    `Start New Game+`,
    () => {
      initNewGamePlus(is_new_pc, selected_units)
    },
  )}
    </div>
  `)

  return setup.DOM.create('div', {}, fragments)
}


/**
 * @param {setup.Unit} unit 
 * @returns {setup.DOM.Node}
 */
function getStayWithCompanyText(unit) {
  const options = []

  const traits = unit.getTraits()

  if (traits.includes(setup.trait.per_cautious)) {
    options.push(`Given how cautious a|they a|is with new people, it's not surprising that a|rep decided to stay with your company.`)
  }

  if (traits.includes(setup.trait.per_calm)) {
    options.push(`Despite your sudden retirement, a|rep remained calm and cool-headed, and decided to stick with the company.`)
  }

  if (traits.includes(setup.trait.per_humble)) {
    options.push(`The humble a|race a|rep decided to stick with the company and the friends a|they had known for a long time.`)
  }

  if (traits.includes(setup.trait.per_direct)) {
    options.push(`a|Rep is a simple a|race, and a|they chose to stay with the company regardless of the change of leadership.`)
  }

  if (traits.includes(setup.trait.per_gregarious)) {
    options.push(`Unsurprisingly, a|rep remained with the company, a place many of a|their treasured friends call home.`)
  }

  if (traits.includes(setup.trait.per_frugal)) {
    options.push(`a|Rep decided to remain with the company, since the pay is quite good.`)
  }

  if (traits.includes(setup.trait.per_loyal)) {
    options.push(`You know a|rep to be a loyal a|race, and it was not surprising at all that a|they decided to stick with the company.`)
  }

  if (traits.includes(setup.trait.per_attentive)) {
    options.push(`a|Rep remained with the company, and a|their keen eyes continued to be an asset to its daily operations.`)
  }

  if (traits.includes(setup.trait.per_stubborn)) {
    options.push(`a|Rep a|is simply too stubborn to leave the comfort of the company, and unsurprisingly remained with the company until now.`)
  }

  if (traits.includes(setup.trait.per_kind)) {
    options.push(`a|Rep could not bear the thoughts of leaving a|their friends away, so a|they remained with the company even until today.`)
  }

  if (traits.includes(setup.trait.per_logical)) {
    options.push(`a|Rep weighted the benefits and the cons of staying and leaving the company, and decided that staying was the right choice.`)
  }

  if (unit.isHasTrait(setup.trait.per_lustful)) {
    options.push(`a|Rep decided to stay at the company, if only for being able to use the many sex slaves at will.`)
  }

  if (traits.includes(setup.trait.per_submissive)) {
    options.push(`a|Rep remained at the company, and you can sense that a|their submissive tendencies has only grown worse ever since you left.`)
  }

  if (traits.includes(setup.trait.per_masochistic)) {
    options.push(`a|Rep remained with the company. You could swear that a|they had amassed even more scars than before, and you suspect that some are self-inflicted.`)
  }

  if (traits.includes(setup.trait.per_honorable)) {
    options.push(`a|Rep remained with the company, of course, as a|their honor demands a|they stay loyal to a|their friends.`)
  }

  if (!options.length) {
    options.push(...[
      `To your complete surprise, a|rep remained with the company, and you do not know why even to this day.`,
      `a|Rep remained with the company out of pure whim.`,
      `It's unclear why a|rep decided to remain with the company, but the a|race did just that.`,
      `a|Rep decided to remain with the company for a little while longer`,
      `Despite looking like a|they a|is about to leave at any time, a|rep surprisingly remained with the company.`
    ])
  }

  return html`${setup.Text.replaceUnitMacros(options, { a: unit })}`
}


/**
 * @param {setup.Unit} unit 
 * @returns {setup.DOM.Node}
 */
function getLeaveCompanyText(unit) {
  const options = []

  const traits = unit.getTraits()

  if (traits.includes(setup.trait.per_brave)) {
    options.push(`Hearing of you leaving, a|rep decided to follow suit, bravely venturing outside the safety of the fort and into the unknown.`)
  }

  if (traits.includes(setup.trait.per_aggressive)) {
    options.push(`After you left, a|rep would often get into an argument with a|their fellow slavers, before ultimately deciding to leave for good.`)
  }

  if (traits.includes(setup.trait.per_proud)) {
    options.push(`Without you in charge, a|rep a|was too proud to not follow suit, and decided to retire away from the company.`)
  }

  if (traits.includes(setup.trait.per_sly)) {
    options.push(`After collecting some more money, a|rep decided that a|their time with the company a|is over, and left.`)
  }

  if (traits.includes(setup.trait.per_loner)) {
    options.push(`a|Rep never fully enjoy the company of a|their fellow a|men, and saw you leaving as the perfect time for a|them to follow suit.`)
  }

  if (traits.includes(setup.trait.per_lavish)) {
    options.push(`After lavishly spending much of a|their earned money, a|rep decided to call quits on the life of slavery.`)
  }

  if (traits.includes(setup.trait.per_independent)) {
    options.push(`Without you in charge, the disloyal a|race a|rep decided that it was time for a|them to go.`)
  }

  if (traits.includes(setup.trait.per_dreamy)) {
    options.push(`a|Rep left without so much as saying a word, no doubt dreamily wondering away to some distant land.`)
  }

  if (traits.includes(setup.trait.per_curious)) {
    options.push(`a|Rep put down the whip and decided to quit the job of slavery to pursue a|their other interests.`)
  }

  if (unit.isHasTrait(setup.trait.per_cruel)) {
    options.push(`Without you in charge, and seeing as a|their bid for power had also failed, a|rep quit the company without much fanfare.`)
  }

  if (traits.includes(setup.trait.per_chaste)) {
    options.push(`a|Rep finally got sick of the life so full of sex and carnal desires, and decided to call it quits.`)
  }

  if (traits.includes(setup.trait.per_dominant)) {
    options.push(`Seeing you leaving, a|rep decided to follow in your footsteps and also quit being a slaver.`)
  }

  if (traits.includes(setup.trait.per_lunatic)) {
    options.push(`One day, a|rep just went missing from a|their room, the lunatic seemingly saw it fit to just quit with nobody the wiser.`)
  }

  if (traits.includes(setup.trait.per_evil)) {
    options.push(`a|Rep decided to quit, seemingly with an evil and malicious plan in mind.`)
  }

  if (!options.length) {
    options.push(...[
      `a|Rep decided to leave the company out of boredom.`,
      `a|Rep wanted a change of scenery and decided to leave the company.`,
      `It's unclear why, but you heard that a|rep had left the company.`,
      `One day, a|rep just went missing from the company, having apparently decided to retire.`,
      `a|Rep a|adv retired one day.`,
    ])
  }

  const living = setup.Living.getLiving(unit)
  return html`
    ${setup.Text.replaceUnitMacros(options, { a: unit })}
    ${livingPassage(unit, living)}
  `
}


/**
 * @param {setup.Unit} unit 
 * @returns {setup.DOM.Node}
 */
function getNewLeaderText(unit) {
  const success_chance = setup.SexUtil.sumTraitMultipliers(unit, setup.NEW_GAME_PLUS_NEW_LEADER_SUCCESS_CHANCE)
  let sentences = []

  sentences.push(
    setup.Text.replaceUnitMacros([
      `After you left, a|rep took the mantle of leadership.`,
      `a|Rep became the leader after you vacated the spot.`,
      `With you gone, a|rep succeeded you for the title of the Leader of the Company.`,
    ], { a: unit })
  )

  const options = []
  const traits = unit.getTraits()
  if (Math.random() < setup.NEW_GAME_PLUS_BASE_SUCCESS_CHANCE + success_chance) {
    sentences.push(
      setup.Text.replaceUnitMacros([
        `Last you heard, your former company is doing very well under a|their guidance.`,
        `Your former company remains infamous throughout the land under a|their leadership.`,
        `The fame of your former company reaches even distant lands with its new leader, and some say that a|they might even be better at you at leading the company.`,
      ], { a: unit })
    )
    // new leader led company to continued success
    if (traits.includes(setup.trait.per_cautious)) {
      options.push(`a|They would choose the quests meticulously, no doubt contributing to the continued success of the company.`)
    }

    if (traits.includes(setup.trait.per_calm)) {
      options.push(`a|They gained reputation for being inhumanly calm in any situation, and your former company continues to prosper under a|their guidance.`)
    }

    if (traits.includes(setup.trait.per_proud)) {
      options.push(`a|They is a proud a|race, and a|they took a|their new duties very seriously, ensuring the continued success of your former company.`)
    }

    if (traits.includes(setup.trait.per_humble)) {
      options.push(`Despite being a leader, a|they remained humble, and guided the rest of a|their slavers with fair a|hands to prosperity.`)
    }

    if (traits.includes(setup.trait.per_sly)) {
      options.push(`a|They knew all too well that slaving is dirty business, and a|they utilized a|their slyness often to win better contracts, ensuring that your former company's legacy will continue on.`)
    }

    if (traits.includes(setup.trait.per_studious)) {
      options.push(`a|They a|is a model student, and a|their knowledge was very useful in leading the company to further glory.`)
    }

    if (traits.includes(setup.trait.per_gregarious)) {
      options.push(`a|Their silver tongue was essential in ensuring that the company would remain in good standings with many others, ensuring its continued success.`)
    }

    if (traits.includes(setup.trait.per_frugal)) {
      options.push(`a|They always in the lookout for the best deals for the company, and a|their frugal mind helped maintain the company's finances in the green.`)
    }

    if (traits.includes(setup.trait.per_loyal)) {
      options.push(`a|They a|is a loyal a|race, inspiring the other slavers to do better all for the glory of the company.`)
    }

    if (traits.includes(setup.trait.per_attentive)) {
      options.push(`a|They a|is blessed with keen eyes, which the a|race use extensively to ensure the continued success of the company.`)
    }

    if (traits.includes(setup.trait.per_stubborn)) {
      options.push(`Some says a|they a|is simply too stubborn to let the company fell into disrepair.`)
    }

    if (unit.isHasTrait(setup.trait.per_cruel)) {
      options.push(`Cruelty is a boon in the business of slavery, and a|they a|have it in excess.`)
    }

    if (traits.includes(setup.trait.per_logical)) {
      options.push(`a|They would sometimes direct the company coldly, with the end being everything to a|them.`)
    }

    if (traits.includes(setup.trait.per_chaste)) {
      options.push(`Surprisingly, a|they remains modestly chaste throughout a|their career.`)
    }

    if (traits.includes(setup.trait.per_dominant)) {
      options.push(`a|They seems to enjoy a|their new gig too, as being on top feels very good to the natural dominant.`)
    }

    if (traits.includes(setup.trait.per_honorable)) {
      options.push(`a|They tries to steer the company to whatever good and honor a slaving company could possibly muster.`)
    }

    if (traits.includes(setup.trait.per_evil)) {
      options.push(`Under a|their leadership, the company would soon be feared by many travelers to the vales.`)
    }

    if (!options.length) {
      options.push(
        `It's unclear how a|rep leads the company, however.`,
        `a|Reps style of leadership remains a mystery, however.`,
      )
    }

  } else {
    // company failed under the new leadership
    sentences.push(
      setup.Text.replaceUnitMacros([
        `Unfortunately, last you heard the company is not doing so well under its new leader.`,
        `Unfortunately, a|rep is nowhere as gifted as you are in the act of leadership, and the company suffers.`,
        `However, a|rep could not match your former leadership, and before long your company's infamy diminishes.`,
      ], { a: unit })
    )

    if (traits.includes(setup.trait.per_brave)) {
      options.push(`a|They would sometimes foolishly took overly dangerous missions, which costed your company.`)
    }

    if (traits.includes(setup.trait.per_aggressive)) {
      options.push(`Some says that a|they a|was simply too aggressive to be a proper leader.`)
    }

    if (traits.includes(setup.trait.per_proud)) {
      options.push(`Some says that a|their pride was a|their downfall.`)
    }

    if (traits.includes(setup.trait.per_direct)) {
      options.push(`Some says that a|they a|was simply too trusting of others, and was easily fooled.`)
    }

    if (traits.includes(setup.trait.per_active)) {
      options.push(`Some says that the musclehead spent too much time in the jogging tracks, and too little time hitting the books.`)
    }

    if (traits.includes(setup.trait.per_loner)) {
      options.push(`Some says that a|they would shun the company of others, even when it would benefit the company.`)
    }

    if (traits.includes(setup.trait.per_lavish)) {
      options.push(`Perhaps it's a|their extravagance that led to the company's downfall.`)
    }

    if (traits.includes(setup.trait.per_independent)) {
      options.push(`The rumors even said that a|they would eventually ditch the company when it's at its lowest.`)
    }

    if (traits.includes(setup.trait.per_dreamy)) {
      options.push(`a|They a|is simply too unfocused to be a proper leader.`)
    }

    if (traits.includes(setup.trait.per_curious)) {
      options.push(`a|They a|have the attention span of a butterfly, too busy inquiring about strange things instead of work-related stuffs.`)
    }

    if (traits.includes(setup.trait.per_kind)) {
      options.push(`They say that a|rep is simply too kind, a disastrous trait for a slaver.`)
    }

    if (traits.includes(setup.trait.per_empath)) {
      options.push(`Rumors said that a|rep would secretly let some of a|their slaves free at night, a|their empathetic heart tugging at a|their very soul.`)
    }

    if (unit.isHasTrait(setup.trait.per_lustful)) {
      options.push(`Some says a|rep spends all of a|their time fucking the many slaves, instead of managing the company.`)
    }

    if (traits.includes(setup.trait.per_submissive)) {
      options.push(`a|Rep is far too submissive to be a proper leader.`)
    }

    if (traits.includes(setup.trait.per_masochistic)) {
      options.push(`Who in the right mind would elect a complete masochist as a leader in the first place?`)
    }

    if (traits.includes(setup.trait.per_lunatic)) {
      options.push(`a|They would enact strange rules, the lunatic enjoying chaos and cacophony above all.`)
    }

    if (traits.includes(setup.trait.per_honorable)) {
      options.push(`a|They a|is simply too honorable to be a good slaver.`)
    }

    if (!options.length) {
      options.push(
        `It is unclear how a|they failed to lead the company.`,
        `Nobody knows why a|they failed to lead the company, however.`
      )
    }
  }

  sentences.push(setup.Text.replaceUnitMacros(options, { a: unit }))

  return html`${sentences.join(' ')}`
}


/**
 * @param {boolean} is_new_pc 
 * @param {setup.Unit[]} selected_units 
 */
export function initNewGamePlus(is_new_pc, selected_units) {
  // save selected units and PC
  const player = State.variables.unit.player

  // save number of times you have new game plus'ed
  const new_game_pluses = State.variables.statistics.get('new_game_plus_count')

  // save which of selected units was a leader
  const was_leader = {}
  was_leader[player.key] = true
  for (const unit of selected_units) {
    if (unit.isHasTitle('ex_leader')) {
      was_leader[unit.key] = true
    }
  }

  // save unit images
  const images = {}
  for (const unit of selected_units.concat([player])) {
    images[unit.key] = State.variables.unitimage.getImagePath(unit)
  }

  const ex_slavers = selected_units.filter(unit => unit.isSlaver() || unit.isRetired())

  const ex_slaves = selected_units.filter(unit => unit.isSlave())

  const company_name = State.variables.company.player.getName()
  // add histories
  for (const slaver of ex_slavers) {
    if (slaver.isSlaver()) {
      setup.qc.AddHistory('unit', `retired from being a slaver at the slaving company known as ${company_name}`).apply(
        setup.costUnitHelper(slaver)
      )
    } else if (slaver.isRetired()) {
      setup.qc.AddHistory('unit', `got invited during retirement for another adventure by the ex-leader of the slaving company known as ${company_name}`).apply(
        setup.costUnitHelper(slaver)
      )
    }
  }
  setup.qc.AddHistory('unit', `retired from being the leader of the slaving company known as ${company_name}`).apply(
    setup.costUnitHelper(player)
  )

  let regalixir_completed = false
  if (State.variables.statistics.isHasSuccess(setup.questtemplate['regalixir'])) {
    regalixir_completed = true
  }

  const keep_keys = {
    'gVersion': true,
    'gDebugWasTurnedOn': true,
  }
  // reset State.variables
  const keys = Object.keys(State.variables)
  for (const key of keys) {
    if (!(key in keep_keys)) {
      delete State.variables[key]
    }
  }

  setup.initState.call(State.variables)

  // Put info about new game plus, including selected units and is new pc, as
  // well as meta info about the game (how many times have you clicked new game plus)
  State.variables.statistics.add('new_game_plus_count', new_game_pluses + 1)

  // Track whether the Player for the next playthrough has already used the regalixir.
  if (!is_new_pc && regalixir_completed) {
    State.variables.statistics.add('regalixir_completed_previous_games', !is_new_pc)
  }

  function copyUnit(unit) {
    const copy = createLevelOneUnitCopy(unit)
    if (ex_slaves.includes(unit)) {
      // dont add title
    } else if (unit.key in was_leader) {
      setup.qc.AddTitle('unit', 'ex_leader').apply(setup.costUnitHelper(copy))
    } else {
      setup.qc.AddTitle('unit', 'ex_slaver').apply(setup.costUnitHelper(copy))
    }

    // recheck traits, in particular perk traits
    const traits = copy.getRemovableTraits()
    for (const trait of traits) {
      if (!copy.isTraitCompatible(trait)) {
        copy.removeTraitExact(trait)
      }
    }

    const image = images[unit.key]
    State.variables.unitimage.setImage(copy, image)
    return copy
  }

  // put slaves in the special unit group
  for (const slave of ex_slaves) {
    setup.unitgroup.new_game_plus_slaves.addUnit(copyUnit(slave))
  }

  // re-create the units
  const extra_choice_unit_keys = []
  for (const unit of ex_slavers) {
    const copy = copyUnit(unit)
    extra_choice_unit_keys.push(copy.key)
  }

  if (is_new_pc) {
    extra_choice_unit_keys.push(copyUnit(player).key)
    setup.DOM.Nav.goto('ProloguePlayerGen')
  } else {
    // initialize player
    setup.DOM.Menu.prologueMakePlayer(copyUnit(player))
    setup.DOM.Nav.goto('PrologueCompanyGenIntroNewGamePlus')
  }

  // some temporary variables that will be deleted later
  // @ts-ignore
  State.variables.gNewGamePlusExLeader = !is_new_pc
  // @ts-ignore
  State.variables.gNewGamePlusExtraKeys = extra_choice_unit_keys

  State.variables.notification.popAll()

  return null
}
