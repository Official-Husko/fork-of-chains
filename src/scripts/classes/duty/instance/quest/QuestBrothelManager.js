// for load order:
import { generateTeamName } from "../../../../names/namegen"
import { } from "../../dutytemplate"

const EXTRA_HIGH_PROFIT_THRESHOLD = 300

/**
 * @returns {setup.DOM.Node}
 */
function brothelDescription() {
  const outer_fragments = []
  const progress = setup.dutytemplate.questbrothelmanager.progress()
  const classy = setup.dutytemplate.questbrothelmanager.class()
  const sub = setup.dutytemplate.questbrothelmanager.sub()
  const name = setup.dutytemplate.questbrothelmanager.brothelName()
  const gender = setup.dutytemplate.questbrothelmanager.gender()
  const profit = setup.dutytemplate.questbrothelmanager.profit()
  const net_profit = setup.dutytemplate.questbrothelmanager.netProfit()
  const favor = setup.dutytemplate.questbrothelmanager.favor()
  const facility = setup.dutytemplate.questbrothelmanager.facility()
  const attraction = setup.dutytemplate.questbrothelmanager.attraction()
  const promotion = setup.dutytemplate.questbrothelmanager.promotion()
  const high_income = setup.dutytemplate.questbrothelmanager.highIncome()

  const manager = setup.getUnit({ title: 'quest_brothel_owner_0' })
  // @ts-ignore
  const head_whore = setup.unitgroup.brothel_cleanup0.getOnlyUnit()
  // @ts-ignore
  const head_courtesan = setup.unitgroup.brothel_head_courtesan.getOnlyUnit()

  let whore
  if (progress < 100) {
    whore = 'whore'
  } else {
    whore = 'courtesan'
  }

  { // First paragraph: Basic information: brothel name, profits, gender, class
    const fragments = []
    fragments.push(html`
      ${setup.rng.choice([
      `Your brothel is located in the ${setup.lore.location_npc.rep()},`,
      `Your brothel is situated within the ${setup.lore.location_npc.rep()}`,
    ])}
      ${manager ? `and it is managed by ${manager.rep()}.` : `but nobody is managing it, and it will soon close...`}
    `)

    if (progress < 52) {
      fragments.push(html`
        ${setup.capitalize(name)} does not currently have any official name, and locals usually simply refer to it as "the brothel".
      `)
    } else {
      fragments.push(html`
        ${setup.rng.choice([
        `Your brothel is known as ${name}.`,
        `You've named your brothel ${name}.`,
      ])}
      `)
    }

    if (progress < 8) {
      fragments.push(html`
        You have just acquired your brothel, and it's not yet operational right now.
      `)
    } else {
      let adj
      if (progress < 28) {
        adj = `are complete amateurs at their job`
      } else if (progress < 60) {
        if (classy > 0) {
          adj = `have some basic entertainment skills`
        } else {
          adj = `have some basic sexual skills`
        }
      } else if (progress < 100) {
        if (sub == 'sub') {
          adj = `are pretty skilled at being submissive little sluts`
        } else {
          adj = `are pretty skilled at dominating the clients`
        }
      } else {
        if (sub == 'sub') {
          adj = setup.rng.choice([
            `are expert sluts, capable of taking the hardest punishments from the customers and deriving pleasure from it`,
            `are expert submissives, and they can take even the hardest punishment without breaking and can even derive pleasure from the pain`,
          ])
        } else if (sub == 'dom') {
          adj = setup.rng.choice([
            `are expert doms, capable of playing a role in any submissive's darkest fantasy`,
            `have expert knowledge in dominating others, capable of both challenging their clients, or even dominating them should the client wish`,
          ])
        } else {
          adj = setup.rng.choice([
            `are expert switches, capable of playing both a submissive or dominant role`,
            `are perfectly comfortable playing a submissive or dominant role, and are able to satisfy a wide range of the clients' fetishes`,
          ])
        }
      }
      fragments.push(html`
        ${setup.rng.choice([
        `Your brothel specializes in providing ${gender} ${whore}s, and they ${adj}.`,
        `Your brothel is known for its ${gender} ${whore}s, who ${adj}.`,
      ])}
      `)
    }

    // high income period
    if (progress >= 500) {
      let t
      if (high_income <= 0) {
        t = [
          `Unfortunately, time has shown its mark on your brothel, and the exterior is nowhere as grand as it used to be. Profit declines as a result.`,
          `Unfortunately, your brothel is starting to show wear and tear, and the profit is starting to decline.`,
        ]
      } else if (high_income <= 100) {
        t = [
          `Your brothel's building is quite old by now, but its reputation still stand and it's still making quite a bit of profit. Expect profit to decline soon, however.`,
          `It has been several years since your brothel was last time renovated, and time is starting to show its mark on the exterior. The brothel is still reputable and making a lot of profit, however, but this may change soon.`,
        ]
      } else if (high_income <= EXTRA_HIGH_PROFIT_THRESHOLD) {
        t = [
          `Your brothel's building is quite old by now, but its reputation still stand and it's still making quite a bit of profit. Expect profit to decline soon, however.`,
          `It has been several years since your brothel was last time renovated, and time is starting to show its mark on the exterior. The brothel is still reputable and making a lot of profit, however, but this may change soon.`,
        ]
      } else {
        t = [
          `Your brothel's exterior is almost brand-new, and it positively affect profit.`,
          `Your brothel has a good reputation as well as an almost brand-new building, which positively affect profit.`,
        ]
      }
      fragments.push(html`
        ${setup.rng.choice(t)}
      `)
    }

    fragments.push(html`
      ${setup.rng.choice([
      html`On average, your brothel makes ${setup.DOM.Util.money(net_profit)} each week,`,
      html`Your brothel makes ${setup.DOM.Util.money(net_profit)} on an average week,`,
      html`The weekly profit of your brothel amounts to ${setup.DOM.Util.money(net_profit)},`,
    ])}
      ${!favor ? '' : html`
        ${setup.rng.choice([
      html`as well as ${setup.DOM.Util.favor(favor)} favor with the neko,`,
      html`in addition to ${setup.DOM.Util.favor(favor)} favor with the neko,`,
      html`together with ${setup.DOM.Util.favor(favor)} favor with the neko,`,
    ])}
      `}
      ${setup.rng.choice([
      `as long as your brothel manager remains on duty.`,
      `but this is only collected when your brothel manager is on duty.`,
      `although you will need to staff a brothel manager to collect this profit.`,
    ])}
    `)

    outer_fragments.push(setup.DOM.create('p', {}, fragments))
  }

  { // Second paragraph: Building, upgrades
    const fragments = []
    if (progress < 12) {
      fragments.push(html`
        Your brothel still occupies the same decrepit little hovel that were completely thrashed
        by the occupying bandits.
      `)
    } else if (progress < 76) {
      fragments.push(html`
        Your brothel is housed within a small non-descript building -- the very same one that was
        occupied by some bandits earlier, but it has been cleaned up and fixed to make it functional and well.
      `)
    } else if (progress < 116) {
      fragments.push(html`
        Your brothel occupies a large building after it has been expanded, complete with spacious rooms
        as well as
        ${facility == 'rooms' ?
          `several luxurious private rooms on the second floor that customers can rent for a night or two.` :
          `a full-blown sex dungeons complete with all sort of restraints and sex toys, for the kinkier customers.`
        }
      `)
    } else {

      let t

      let submissive
      if (sub == 'sub') {
        submissive = setup.rng.choice([
          'submissive',
        ])
      } else if (sub == 'dom') {
        submissive = setup.rng.choice([
          'dominant',
        ])
      } else {
        submissive = setup.rng.choice([
          'skilled',
          'masterful',
          'expert',
        ])
      }

      if (classy >= 2) {
        t = [
          `Your brothel is housed within a majestic palace-like complex, suitable for even royal clients.
           A grand throne-room greets your customers upon entry, with many ${submissive} ${whore}s ready to satisfy whatever the customer desires (for a price).`,
          `A grand palace complex stands on the land where your brothel is located. Its luxurious entrance
           greets all customer with a literal red carpet, flanked by both sides with many ${submissive} ${whore}s who are ready and willing to play to the customer's fantasies (for a price, of course).`,
        ]
      } else if (classy <= -2) {
        t = [
          `Your brothel's degeneracy is matched with its exterior, an imposing demonic palace complex, no doubt the fantasies of many clients. Various bondage devices are on display in the receptions, hanging from the walls, and occasionally some contain an unfortunate slave or two displaying how these can be used.`,
          `An imposing demonic palace complex houses your brothel. Its entrance is designed like a purgatory, with bondage tools scattered around and several slaves being displayed on the walls as living decorations to enhance the sadistic atmosphere.`,
        ]
      } else {
        t = [
          `Your brothel's building is designed as an exotic palace from the south, attracting many customers and tourists alike. Bamboo trees line up the walls of its reception, kept healthy by the magic infused within its roots.`,
          `Your brothel's building stands out from the other buildings in the vicinity -- its rich vibrant color appears exotically beautiful. The interior is similarly decorated, and a small makeshift canal is built into the receptions area, powered with magic.`,
        ]
      }

      fragments.push(html`
        ${setup.rng.choice(t)}
        ${setup.rng.choice([
        `The entire complex is infused with magic, enhancing the customer's experience within the complex.`,
        `Magic is present in many details of the complex, enhancing the overall customer experience.`,
      ])}
        ${setup.rng.choice([
        `The biggest attraction of the complex lies in the innermost chamber of the palace.`,
        `The main draw of the complex, however, is inside the innermost chamber of the complex.`,
      ])}
      `)

      let w
      if (attraction == 'gravity') {
        t = [
          `The chamber houses the so-called "Magic Gravity Room", where magical crystals are affixed to its floor. When imbued with magic, these crystals will emite a steady stream of wind upwards, essentially cancelling out gravity and letting anyone within the room to float free.`,
          `The "Magic Gravity Room" is located there. When activated, the various magical crystals afficed within the room will emite a steady stream of wind, which allows anyone inside to float harmlessly, as if gravity is not present at all within the room.`,
        ]
        if (sub == 'sub') {
          w = [
            `Paying customers can enjoy the exquisite feeling of fucking the available submissive ${whore}s mid-air -- a unique experience provided only in your brothel throughout the continent.`,
          ]
        } else if (sub == 'dom') {
          w = [
            `Paying customers can enjoy the exquisite feeling of being fucked by the dominant ${whore}s mid-air -- a unique experience provided only in your brothel throughout the continent.`,
          ]
        } else {
          w = [
            `Paying customers can enjoy the exquisite feeling of either being fucked or fucking the ${whore}s mid-air -- a unique experience provided only in your brothel throughout the continent.`,
          ]
        }
      } else {
        t = [
          `The chamber houses the so-called "Magic Bondage Room". While it looks like a regular sex dungeons from the outside, the various manacles and sex toys housed within are enchanted, and with the right application of magic these enchantments can be activated.`,
          `The "Magic Bondage Room" is located here. From a glance, it looks like just a regular sex dungeons, with manacles, restraints, and sex toys littering the place. But all of these are enchanted, and can be activated to great effects.`,
        ]
        if (sub == 'sub') {
          w = [
            `Paying customers can enjoy the exquisite feeling of dominating the submissive ${whore}s, restraining them mid-air with the enchanted restraints while inserting the various vibrating and electrifying apparatus deep inside them.`,
          ]
        } else if (sub == 'dom') {
          w = [
            `Paying customers can enjoy the exquisite feeling of being dominated by the dominant ${whore}s, who would gladly partake in their darkest submissive fantasies, including restraining the customers mid-air with the enchanted restraints while inserting the various vibrating and electrifying apparatus deep inside them.`,
          ]
        } else {
          w = [
            `Paying customers can enjoy the exquisite feeling of both dominating and being dominated by the skillful ${whore}s. The various restraints can be made to float mid-air, and the various sex toys would vibrate and electrify when their magic are activated.`,
          ]
        }
      }

      fragments.push(html`
        ${setup.rng.choice(t)}
        ${setup.rng.choice(w)}
        ${setup.rng.choice([
        `A luxurious personal suite has also been built for your perusal only.`,
        `A luxurious room has also been designated as your own personal suite within the complex.`,
      ])}
      `)
    }

    outer_fragments.push(setup.DOM.create('p', {}, fragments))
  }

  if (progress >= 8) {
    // Third paragraph: Workers
    const fragments = []
    fragments.push(html`
      ${setup.rng.choice([
      `The brothel is staffed by several ${gender} ${whore}s, who call the place their home.`,
      `The brothel is staffed exclusively by ${gender} ${whore}s, who live inside the complex.`,
    ])}
    `)

    if (progress < 28) {
      fragments.push(html`
        Their sexual and entertainment skills leave much to be desired.
      `)
    } else if (progress < 60) {
      if (classy > 0) {
        fragments.push(html`
          After a week of intense training led by one of your slavers, the ${whore}s now have basic knowledge in entertainment.
        `)
      } else {
        fragments.push(html`
          After a week of intense training led by one of your slavers, the ${whore}s now have basic knowledge in whoring.
        `)
      }
    } else if (progress < 100) {
      if (sub == 'sub') {
        fragments.push(html`
          The ${whore}s are quite good at their job, and in particular in being a submissive partner to their clients.
        `)
      } else {
        fragments.push(html`
          The ${whore}s are quite good at their job, and in particular in sexually domiating their clients.
        `)
      }
    } else {
      fragments.push(html`
        ${setup.rng.choice([
        `After undergoing heavy training dished out by your slavers, the ${whore}s`,
        `Thanks to the rigorous training dished out by your slavers, the ${whore}s`,
      ])}
      `)
      if (sub == 'sub') {
        fragments.push(html`
          ${setup.rng.choice([
          `have become expert submissive sluts.`,
          `have become masterful submissive sluts.`,
          `possess expert knowledge in submitting to others.`,
        ])}
        `)
      } else if (sub == 'dom') {
        fragments.push(html`
          ${setup.rng.choice([
          `have become expert dominants.`,
          `have mastered the act of dominating their sexual partners.`,
          `possess expert knowledge in dominating others.`,
        ])}
        `)
      } else {
        fragments.push(html`
          ${setup.rng.choice([
          `have become comfortable in both a submissive and dominant roles.`,
          `have become an expert switch slut.`,
          `have become natural in both submitting to and dominating others.`,
        ])}
        `)
      }
    }

    if (progress < 12) {
      fragments.push(html`
        They sleep together in one of the few relatively clean rooms that remains within the establishment.
      `)
    } else if (progress < 76) {
      fragments.push(html`
        They sleep in pairs within the staff rooms available in the brothel, which has mostly been cleaned up
        from the questionable stains that belonged to their previous bandit occupants.
      `)
    } else if (progress < 116) {
      fragments.push(html`
        Each ${whore} now has their own personal room in the expanded brothel building.
      `)
    } else {
      fragments.push(html`
        ${setup.rng.choice([
        `They live luxuriously, each is given a personal room on the third floor of the palace complex.`,
        `Each ${whore} is entitled to a luxurious personal room on the third floor of the complex.`,
      ])}
      `)
    }

    if (progress >= 44) {
      fragments.push(html`
        ${setup.rng.choice([
        `Several intimidating-looking bouncers, including a previous slave of yours, stand guard within the brothel.`,
        `The brothel is kept safe by several intimidating-looking bouncers, including a slave of yours that you have assigned for the duty.`,
      ])}
      `)
    }

    if (head_whore && progress >= 28) {
      let title
      if (promotion == 'money') {
        title = 'business manager'
      } else if (promotion == 'favor') {
        title = 'customer relations officer'
      } else {
        title = `head ${whore}`
      }

      fragments.push(html`
        ${setup.rng.choice([
        `The brothel's ${title}, ${head_whore.rep()}, also lives in the brothel.`,
        `The brothel is also home to ${head_whore.rep()}, who serves as the brothel's ${title}.`,
      ])}
      `)

      let t
      if (progress < 76) {
        t = [
          `a|They a|live in the same bunk with the rest of the ${gender == 'female' ? 'girls' : 'boys'}.`
        ]
      } else if (progress < 116) {
        t = [
          `a|They a|have a|their own personal room in the brothel complex, a fact that a|they a|is grateful for.`
        ]
      } else {
        t = [
          `a|They a|is given one of the most luxurious rooms in the complex all for a|themself, to reward a|them for a|their long and loyal service.`,
          `a|Their room in the complex is one of the most luxurious rooms there, only inferior to your own personal suite.`,
        ]
      }

      fragments.push(html`
        ${setup.Text.replaceUnitMacros(t, { a: head_whore })}
      `)
    }

    if (head_courtesan) {
      fragments.push(html`
        ${setup.rng.choice([
        `A former slave under your care, ${head_courtesan.rep()}, now serves obediently as the brothel's head courtesan.`,
        `The head courtesan, ${head_courtesan.rep()}, is actually for all intent and purposes your slave.`,
      ])}
      `)

      let t = [
        `a|They a|is a gifted wizard, and a|use a|their magical mastery to activate the various magical enchantments throughout the venue.`,
        `a|They a|use a|their magical proficiency to great effect within the brothel, even occasionally using them in a creative way to satisfy a client's need.`
      ]
      fragments.push(html`
        ${setup.Text.replaceUnitMacros(t, { a: head_courtesan })}
      `)

      if (progress < 116) {
        fragments.push(html`
          ${setup.Text.replaceUnitMacros(
          `Like the rest of the ${whore}s, a|they a|have a|their own personal room, although it is somewhat more spacious than the others.`,
          { a: head_courtesan }
        )}
        `)
      } else {
        fragments.push(html`
          ${setup.Text.replaceUnitMacros(
          [
            `a|They also a|have a|their own luxurious abode within the brothel, and the a|race sometimes invite customers into the room for some personal time.`,
            `Like the rest of the ${whore}s, a|they a|have a|their own personal room, but befitting a head courtesan, it is considerably more luxurious the others.`,
          ],
          { a: head_courtesan }
        )}
        `)
      }
    }
    outer_fragments.push(setup.DOM.create('p', {}, fragments))
  }

  return setup.DOM.create('div', {}, outer_fragments)
}



setup.DutyTemplateQuestBrothelManager = class DutyTemplateQuestBrothelManager extends setup.DutyTemplate {
  constructor() {
    super({
      key: 'questbrothelmanager',
      name: 'Brothel Manager',
      description_passage: 'DutyQuestBrothelManager',
      type: 'util',
      unit_restrictions: [setup.qres.Job(setup.job.slaver)],
      relevant_skills: {
        slaving: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
        social: setup.DUTY_SKILL_MULTIPLIER_TOTAL / 2,
      },
      relevant_traits: {
        skill_connected: setup.DUTY_TRAIT_CRIT_CHANCE,
        per_gregarious: setup.DUTY_TRAIT_NORMAL_CHANCE,
        per_loner: -setup.DUTY_TRAIT_NORMAL_CHANCE,
      },
      is_can_replace_with_specialist: true,
    })
  }

  QUEST_BROTHEL_WAIT = 'quest_brothel_wait'
  QUEST_BROTHEL_CLASS = 'quest_brothel_class'
  QUEST_BROTHEL_PROGRESS = 'quest_brothel_progress'
  QUEST_BROTHEL_FACILITY = 'quest_brothel_facility'  // dungeons or rooms
  QUEST_BROTHEL_ATTRACTION = 'quest_brothel_attraction'  // gravity or bondage
  QUEST_BROTHEL_NAME = 'quest_brothel_name'
  QUEST_BROTHEL_GENDER = 'quest_brothel_gender'  // male or female
  QUEST_BROTHEL_SUB = 'quest_brothel_sub'  // sub, dom, switch
  QUEST_BROTHEL_PROMOTION = 'quest_brothel_promotion'  // money or favor
  QUEST_BROTHEL_HIGH_INCOME = 'quest_brothel_high_income'  // high income weeks counter. Adds 500g
  QUEST_BROTHEL_ROYAL_VISIT = 'quest_brothel_royal_visit'
  QUEST_BROTHEL_HIGH_INCOME_WARNING = 'quest_brothel_high_income_warning'

  /**
   * Raw weekly profit on success.
   * @returns {number}
   */
  profit() {
    let base = 0


    // high income period:
    if (setup.dutytemplate.questbrothelmanager.extraHighIncome()) {
      base += 1500
    } else if (setup.dutytemplate.questbrothelmanager.highIncome()) {
      base += 750
    }

    const progress = setup.dutytemplate.questbrothelmanager.progress()
    const max_profit = 500
    const max_progress = 120

    if (progress > max_progress) {
      base += max_profit
    } else {
      base += Math.round((progress - 1) / max_progress * max_profit)
    }

    return base
  }

  /**
   * Net profit on success.
   * @returns {number}
   */
  netProfit() {
    const profit = setup.dutytemplate.questbrothelmanager.profit()
    const promotion = setup.dutytemplate.questbrothelmanager.promotion()
    if (promotion == 'favor') {
      return Math.round(profit / 2)
    } else {
      return profit
    }
  }

  /**
   * Favor with neko per week
   * @returns {number}
   */
  favor() {
    const profit = setup.dutytemplate.questbrothelmanager.profit()
    const promotion = setup.dutytemplate.questbrothelmanager.promotion()
    if (promotion == 'favor') {
      return setup.Favor.fromMoney(profit / 2)
    } else {
      return 0
    }
  }

  /**
   * @returns {boolean}
   */
  extraHighIncome() {
    return setup.dutytemplate.questbrothelmanager.highIncome() >= EXTRA_HIGH_PROFIT_THRESHOLD
  }

  /**
   * @returns {number}
   */
  highIncome() {
    const base = State.variables.varstore.get(setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_HIGH_INCOME)
    if (!base) return 0
    return parseInt(base)
  }

  decreaseHighIncome() {
    const high_income = setup.dutytemplate.questbrothelmanager.highIncome()
    if (high_income >= EXTRA_HIGH_PROFIT_THRESHOLD) {
      State.variables.varstore.set(
        setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_HIGH_INCOME,
        high_income - 2,
        -1,
      )
    } else if (high_income - 1) {
      State.variables.varstore.set(
        setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_HIGH_INCOME,
        high_income - 1,
        -1,
      )
    } else {
      State.variables.varstore.remove(
        setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_HIGH_INCOME,
      )
    }
  }

  /**
   * @returns {number}
   */
  progress() {
    const base = State.variables.varstore.get(setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_PROGRESS)
    if (!base) return 0
    return parseInt(base)
  }

  /**
   * @returns {number}
   */
  class() {
    const base = State.variables.varstore.get(setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_CLASS)
    if (!base) return 0
    return parseInt(base)
  }

  /**
   * @returns {string}
   */
  sub() {
    return State.variables.varstore.get(setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_SUB)
  }

  /**
   * @returns {string}
   */
  promotion() {
    return State.variables.varstore.get(setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_PROMOTION)
  }

  /**
   * @returns {string}
   */
  gender() {
    return State.variables.varstore.get(setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_GENDER)
  }

  /**
   * @returns {string}
   */
  facility() {
    return State.variables.varstore.get(setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_FACILITY)
  }

  /**
   * @returns {string}
   */
  attraction() {
    return State.variables.varstore.get(setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_ATTRACTION)
  }

  /**
   * @returns {string}
   */
  brothelName() {
    const progress = setup.dutytemplate.questbrothelmanager.progress()
    if (progress < 3) {
      return `your decrepit brothel`
    } else if (progress < 12) {
      return `your little brothel`
    } else if (progress < 28) {
      return `your fledging brothel`
    } else if (progress < 44) {
      return `your growing brothel`
    } else if (progress < 52) {
      return `your nice little brothel`
    } else {
      return State.variables.varstore.get(setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_NAME)
    }
  }

  /**
   * @returns {string}
   */
  randomizeBrothelName() {
    const name = `The ${generateTeamName()}`
    setup.dutytemplate.questbrothelmanager.setBrothelName(name)
    return name
  }

  /**
   * @param {string} name 
   */
  setBrothelName(name) {
    State.variables.varstore.set(
      setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_NAME,
      name,
      -1
    )
  }

  /**
   * @returns {setup.DOM.Node}
   */
  describe() {
    return setup.DOM.Util.message(
      setup.dutytemplate.questbrothelmanager.brothelName(),
      () => {
        return setup.DOM.create('div', { class: 'helpcard' }, brothelDescription())
      }
    )
  }

  resetChain() {
    return [
      setup.qc.VarRemove('quest_brothel_wait'),
      setup.qc.VarRemove('quest_brothel_progress'),
      setup.qc.VarRemove('quest_brothel_facility'),
      setup.qc.VarRemove('quest_brothel_attraction'),
      setup.qc.VarRemove('quest_brothel_class'),
      setup.qc.VarRemove('quest_brothel_gender'),
      setup.qc.VarRemove('quest_brothel_sub'),
      setup.qc.VarRemove('quest_brothel_high_income_warning'),
      setup.qc.VarRemove('quest_brothel_high_income'),
      setup.qc.VarRemove('quest_brothel_promotion'),
      setup.qc.VarRemove('quest_brothel_name'),
      setup.qc.VarRemove('quest_brothel_royal_visit'),
      setup.qc.SetCooldownQuest('under_new_management', 300),
      setup.qc.RemoveDuty('questbrothelmanager'),
      setup.qc.EmptyUnitGroup('brothel_head_courtesan'),
      setup.qc.EmptyUnitGroup('brothel_cleanup0'),
      setup.qc.SetCooldownEvent('pants_of_competence', 0),
      setup.qc.SetCooldownEvent('job_change', 0),
    ]
  }

  /**
   * @param {setup.DutyInstance} duty_instance 
   */
  advanceWeek(duty_instance) {
    super.advanceWeek(duty_instance)

    // check if brothel owner is gone forever.
    const owner = setup.getUnit({ title: 'quest_brothel_owner_0' })
    const name = setup.dutytemplate.questbrothelmanager.brothelName()

    if (!owner) {
      // owner is gone. Will be handled by an event later.
    } else if (!owner.isSlaver()) {
      // owner is gone, but might come back
      setup.notify(`Since a|rep is not a slaver under your employ, you could not benefit from the profits of ${name}`,
        { a: owner })

    } else {
      // owner is present

      let proc = duty_instance.getProc()
      if (proc == 'proc' || proc == 'crit') {
        // get profit, boosted by crit if necessary
        let profit = setup.dutytemplate.questbrothelmanager.netProfit()
        let favor = setup.dutytemplate.questbrothelmanager.favor()
        if (proc == 'crit') {
          profit *= 1.2
          favor *= 1.2
        }

        if (favor) {
          setup.qc.Favor('neko', Math.round(favor)).apply()
        }

        profit = Math.round(profit)
        if (profit) {
          State.variables.company.player.addMoneyNudged(profit)
        }

        // decrease the "cooldown", if any
        let wait = State.variables.varstore.get(setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_WAIT)
        if (wait) {
          wait = parseInt(wait)
          if (wait == 1) {
            State.variables.varstore.remove(setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_WAIT)
          } else {
            State.variables.varstore.set(
              setup.dutytemplate.questbrothelmanager.QUEST_BROTHEL_WAIT, wait - 1, -1)
          }
        }

        // decrease the "high_income", if any
        const high_income = setup.dutytemplate.questbrothelmanager.highIncome()
        if (high_income) {
          setup.dutytemplate.questbrothelmanager.decreaseHighIncome()
        }
      }
    }
  }
}

/**
 * @type {setup.DutyTemplateQuestBrothelManager}
 */
// @ts-ignore
setup.dutytemplate.questbrothelmanager = () => new setup.DutyTemplateQuestBrothelManager()
