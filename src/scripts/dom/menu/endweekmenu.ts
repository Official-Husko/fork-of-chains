// @ts-nocheck

/**
 * @param {setup.Market} market 
 * @returns {string | null}
 */
function marketObjectsDescriptor(market) {
  const objects = market.getMarketObjects()
  const rarity_map = {}
  for (const rarity of Object.values(setup.rarity)) {
    rarity_map[rarity.key] = 0
  }
  for (const object of objects) {
    const rarity_class = object.getRarity()
    rarity_map[rarity_class.key] += 1
  }
  const rarities = []
  for (const rarity_key in rarity_map) {
    const amount = rarity_map[rarity_key]
    /**
     * @type {setup.Rarity}
     */
    const rarity = setup.rarity[rarity_key]
    if (amount) {
      rarities.push(`<span data-tooltip="${rarity.getName()}" class="${rarity.getTextColorClass()}">${amount}</span>`)
    }
  }
  if (!rarities.length) return null
  return `(${rarities.join('|')})`
}

function getMainMenuItems() {
  if (!('MAINMENU' in setup.DOM.Card)) {

    setup.DOM.Menu.MAINMENU_ITEMS = [
      [  /* Row: quest and mail */
        {
          title: 'Quest',
          passage: 'QuestHub',
          restrictions: [setup.qres.Building('questoffice'),],
          extra() {
            const open = State.variables.company.player.getOpenQuests().length
            if (open) {
              return html`(${setup.DOM.Text.success(open)})`
            } else {
              return null
            }
          },
        },
        {
          title: 'Mail',
          passage: 'OpportunityList',
          restrictions: [setup.qres.Building('mailroom'),],
          extra() {
            const open = State.variables.opportunitylist.getOpportunities().length
            if (open) {
              return html`(${setup.DOM.Text.success(open)})`
            } else {
              return null
            }
          },
        },
      ],

      [  /* Row: units */
        {
          title: 'Slaver',
          passage: 'Lodgings',
          restrictions: [setup.qres.Building('lodgings'),],
          extra() {
            const current = State.variables.company.player.getUnits({ job: setup.job.slaver }).length
            const limit = State.variables.company.player.getMaxUnitOfJob(setup.job.slaver)
            return html`(${current}/${limit})`
          },
        },
        {
          title: 'Slave',
          passage: 'Dungeons',
          restrictions: [setup.qres.Building('dungeons'),],
          extra() {
            const current = State.variables.company.player.getUnits({ job: setup.job.slave }).length
            const limit = State.variables.company.player.getMaxUnitOfJob(setup.job.slave)
            return html`(${current}/${limit})`
          },
        },
      ],

      [  /* Row: new hires */
        {
          title: 'Hall',
          passage: 'MarketSlaver',
          restrictions: [setup.qres.Building('prospectshall'),],
          extra() {
            return marketObjectsDescriptor(State.variables.market.slavermarket)
          },
        },
        {
          title: 'Pen',
          passage: 'MarketSlave',
          restrictions: [setup.qres.Building('slavepens'),],
          extra() {
            return marketObjectsDescriptor(State.variables.market.slavemarket)
          },
        },
      ],

      [  /* Team, duty */
        {
          title: 'Team',
          passage: 'TeamManagement',
          restrictions: [setup.qres.Building('missioncontrol'),],
        },
        {
          title: 'Party',
          passage: 'PartyManagement',
          restrictions: [setup.qres.Building('moraleoffice'),],
        },
        {
          title: 'Duty',
          passage: 'DutyList',
          restrictions: [setup.qres.Building('dutyroom'),],
          extra() {
            const open = State.variables.dutylist.getOpenDutiesCount()
            if (open) {
              return html`(${setup.DOM.Text.successlite(open)})`
            } else {
              return null
            }
          },
        },
      ],

      [  /* Build, order*/
        {
          title: 'Fort',
          passage: 'FortGrid',
          restrictions: [setup.qres.Building('constructionoffice'),],
          extra() {
            const unplaced = State.variables.roomlist.getUnplacedRooms()
            if (unplaced.length) {
              return html`(${setup.DOM.Text.success(unplaced.length)})`
            } else {
              return null
            }
          },
        },
        {
          title: 'Injury',
          passage: 'Hospital',
          restrictions: [setup.qres.Building('hospital'),],
          extra() {
            const injured = State.variables.company.player.getUnits({ injured: true }).length
            if (injured) {
              return html`(${setup.DOM.Text.dangerlite(injured)})`
            } else {
              return null
            }
          },
        },
        {
          title: 'Order',
          passage: 'SlaveOrderList',
          restrictions: [setup.qres.Building('marketingoffice'),],
          extra() {
            const orders = State.variables.slaveorderlist.countSlaveOrders()
            if (orders) {
              return html`(${setup.DOM.Text.successlite(orders)})`
            } else {
              return null
            }
          },
        },
      ],

      [  /* Equipment market */
        {
          title: 'Buy Equipment',
          passage: 'MarketEquipment',
          restrictions: [
            setup.qres.Or([
              setup.qres.Building('forge'),
              setup.qres.Building('sexshop'),
            ]),
          ],
          extra() {
            return marketObjectsDescriptor(State.variables.market.equipmentmarket)
          },
        },
      ],

      [  /* Market, lore */
        {
          title: 'Market',
          passage: 'MarketItem',
          restrictions: [setup.qres.Building('market'),],
          extra() {
            return marketObjectsDescriptor(State.variables.market.itemmarket)
          },
        },
        {
          title: 'Item',
          passage: 'Inventory',
          restrictions: [setup.qres.Building('warehouse'),],
        },
      ],

      [  /* Equipment, inventory */
        {
          title: 'Equipment',
          passage: 'Armory',
          restrictions: [setup.qres.Building('armory'),],
        },
        {
          title: 'Classroom',
          passage: 'Classroom',
          restrictions: [setup.qres.Building('classroom'),],
        },
      ],

      [  /* Rec wing, bedchamber */
        {
          title: 'Bedchamber',
          passage: 'BedchamberList',
          restrictions: [setup.qres.Building('bedchamberwing'),],
        },
        {
          title: 'Rec. Wing',
          passage: 'RecreationWing',
          restrictions: [setup.qres.Building('recreationwing'),],
        },
      ],

      [  /* Relations, contact */
        {
          title: 'Relations',
          passage: 'RelationsOffice',
          restrictions: [setup.qres.Building('relationsoffice'),],
        },
        {
          title: 'Contact',
          passage: 'ContactList',
          restrictions: [setup.qres.Building('messengerpost'),],
        },
        {
          title: 'Lore',
          passage: 'Library',
          restrictions: [setup.qres.Building('library'),],
        },
      ],

      [
        {
          title: 'Retirees',
          passage: 'RetiredList',
          restrictions: [setup.qres.Building('inn'),],
          extra() {
            const current = State.variables.retiredlist.getUnits().length
            const limit = State.variables.retiredlist.getMaxTrackedUnits()
            return html`(${current}/${limit})`
          },
        },
        {
          title: 'Company',
          passage: 'CompanyInfo',
          restrictions: [setup.qres.Building('greathall'),],
        },
      ],

      [  /* Company info, settings */
        {
          title: 'Settings',
          passage: 'SettingsMenu',
          restrictions: [],
        },
      ],

    ]
  }
  return setup.DOM.Menu.MAINMENU_ITEMS
}


/**
 * @returns {setup.DOM.Node}
 */
function showAllNextEvents() {
  const events = State.variables.eventpool.getScheduledEvents({
    is_visible_in_calendar: State.variables.gDebug ? false : true
  })

  const current_week = State.variables.calendar.getWeek()
  const fragments = []
  for (const event_meta of events) {
    const inner = []
    const trigger = event_meta.occur_week - current_week
    for (const event_info of event_meta.events) {
      inner.push(html`${trigger} weeks: ${event_info.event.getName()}`)
      if (!event_info.is_visible_in_calendar) {
        inner.push(html` ${setup.DOM.Text.dangerlite(`[Hidden]`)}`)
      }
    }
    fragments.push(setup.DOM.create('div', {}, inner))
  }
  return setup.DOM.create('div', {}, fragments)
}


/**
 * @returns {setup.DOM.Node}
 */
function getNextEventsMenu() {
  const next_events = State.variables.eventpool.getNextVisibleEvents()

  const fragments = []
  if (!next_events) {
    if (!State.variables.gDebug) {
      return null
    } else {
      fragments.push(`[DEBUG] No known events`)
    }
  } else {
    fragments.push(html`In ${next_events.occur_week - State.variables.calendar.getWeek()} wk${next_events.events.length > 1 ? 's' : ''}: `)
    if (next_events.events.length == 1) {
      // only one event, might as well show it
      fragments.push(next_events.events[0].event.getName())
    } else {
      fragments.push(`${next_events.events.length} events`)
    }
  }

  return setup.DOM.Nav.link(
    setup.DOM.create('div', {}, fragments),
    () => {
      setup.Dialogs.open({
        title: 'Upcoming events',
        content: showAllNextEvents(),
      })
    },
  )
}


/**
 * @returns {setup.DOM.Node}
 */
function getInfoMenu() {
  const fragments = []

  // software version
  let debugtext = null
  if (State.variables.gDebug) {
    debugtext = html` ${setup.DOM.Text.dangerlite('[DEBUG]')}`
  }
  fragments.push(html`
        <div>Fort of Chains ${setup.VERSION}${debugtext}</div>
        `)

  if (State.variables.calendar && State.variables.unit?.player) {
    // week and company name
    fragments.push(html`
      ${State.variables.company.player.getName()} / Week ${State.variables.calendar.getWeek()}
          `)

    // next events
    if (State.variables.gDebug || State.variables.fort.player.isHasBuilding('noticeboards')) {
      fragments.push(getNextEventsMenu())
    }

    // money and prestige
    const moneytexts = []
    moneytexts.push(
      html`${setup.DOM.Util.money(State.variables.company.player.getMoney())}`
    )
    if (State.variables.fort.player.isHasBuilding('recreationwing')) {
      moneytexts.push(
        html` / `
      )
      moneytexts.push(
        html`${setup.DOM.Util.prestige(State.variables.company.player.getPrestige())}`
      )
    }

    fragments.push(setup.DOM.create('div', {}, moneytexts))
  }

  return setup.DOM.create('div', {}, fragments)
}


function endWeek() {
  setup.deleteEndOfWeekCaches()
  setup.runSugarCubeCommand(`<<focsavestategoto 'WeekEnd'>>`)
}


/**
 * @returns {setup.DOM.Node}
 */
function getTopLeftNavigationMenu() {
  if (!State.variables.calendar) {
    return null
  }

  const fragments = []
  if (State.variables.gMenuVisible) {
    if (State.variables.opportunitylist.isHaveMustAnswerOpportunities()) {
      // some opportunity must be answered first.
      fragments.push(
        setup.DOM.create(
          'span',
          { class: 'press_on_space' },
          setup.DOM.Nav.move(html`ANSWER MAIL`, `OpportunityList`)
        )
      )

      fragments.push(
        setup.DOM.Util.help(html`
          You have some ${setup.DOM.Text.danger('important')} mail that 
          must be answered before you can end the week.
        `)
      )
    } else {
      const deployable = State.variables.company.player.getDeployableTeams()
      if (!deployable) {
        fragments.push(setup.DOM.create(
          'span',
          { class: 'press_on_space' },
          setup.DOM.Nav.link(
            html`END WEEK`,
            endWeek,
          ))
        )
      } else {
        const menu_id = 'end_week_link_confirm_id'
        const ele = setup.DOM.create(
          'span',
          { id: menu_id, class: 'press_on_space' },
          setup.DOM.Nav.link(
            html`END WEEK`,
            () => {
              setup.DOM.Helper.replace(
                `#${menu_id}`,
                setup.DOM.Nav.link(
                  html`REALLY END WEEK`,
                  endWeek,
                )
              )
            }
          )
        )
        fragments.push(ele)

        fragments.push(html` `)
        fragments.push(setup.DOM.Text.danger(`[${deployable}]`))
        fragments.push(setup.DOM.create('small', {}, setup.DOM.Util.help(
          html`You can still send ${deployable} more teams on quests.`
        )))
      }
    }
  } else {
    fragments.push(setup.DOM.create('div', { id: 'topleftnavigation' }))
  }

  return setup.DOM.create('div', { id: 'topleftnavdiv' }, fragments)
}

/**
 * Generate menu on the left.
 * 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.endweekmenu = function () {
  const fragments = []
  fragments.push(getInfoMenu())
  fragments.push(getTopLeftNavigationMenu())
  return setup.DOM.create('div', {}, fragments)
}




