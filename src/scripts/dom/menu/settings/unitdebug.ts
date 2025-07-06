// @ts-nocheck

function refresh() {
  setup.DOM.Nav.goto()
}

/**
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.unitdebug = function (unit) {
  const fragments = []
  fragments.push(html`
    <div>
    Change ${unit.rep()}
      ${setup.DOM.Nav.link(
    '(Done)',
    () => {
      if (State.variables.devtooltype) {
        setup.runSugarCubeCommand(`<<devgotoreturn>>`)
      } else {
        setup.DOM.Nav.gotoreturn()
      }
    }
  )}
    </div>
  `)

  const debug_actions = {
    "Injure by one week": setup.qc.Injury('unit', 1),
    "Heal by one week": setup.qc.Heal('unit', 1),
    "Corrupt": setup.qc.Corrupt('unit'),
    "Purify": setup.qc.Purify('unit'),
    "Traumatize for 10 weeks": setup.qc.TraumatizeRandom('unit', 10),
    "Boonize for 10 weeks": setup.qc.BoonizeRandom('unit', 10),
    "Heal trauma for 10 weeks": setup.qc.TraumaHeal('unit', 10),
    "Bless": setup.qc.Blessing('unit', 1),
    "Curse": setup.qc.Blessing('unit', 1, null, true),
    "Level up": setup.qc.levelUp('unit'),
    "Gender swap": setup.qc.Function(() => {
      const poolkey = unit.getSubrace().key + '_' + (unit.getGender() == setup.trait.gender_male ? 'female' : 'male')
      const pool = setup.unitpool[poolkey]
      const target = pool.generateUnit()
      setup.qcImpl.Bodyswap.doBodySwap(unit, target, true)
      target.delete()
    }),
  }

  function callback(action_key) {
    return () => {
      debug_actions[action_key].apply(setup.costUnitHelper(unit))
      refresh()
    }
  }

  const inner = []
  for (const action_key in debug_actions) {
    inner.push(html`
      ${setup.DOM.Nav.link(
      `(${action_key})`,
      callback(action_key),
    )}
    `)
  }
  fragments.push(setup.DOM.create('div', {}, inner))

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.link(
    `(Add title)`,
    () => {
      setup.DevToolHelper.pickTitle().then((title) => {
        if (title) {
          State.variables.titlelist.addTitle(unit, title)
          refresh()
        }
      })
    }
  )}
      ${setup.DOM.Nav.link(
    `(Remove title)`,
    () => {
      setup.DevToolHelper.pickTitle(State.variables.titlelist.getAllTitles(unit)).then((title) => {
        if (title) {
          State.variables.titlelist.removeTitle(unit, title)
          refresh()
        }
      })
    }
  )}
    </div>
  `)

  fragments.push(setup.DOM.Menu.debugfriendship(unit))

  let unit_identifier = `$unit[${unit.key}]`
  if (unit.isYou()) {
    unit_identifier = `$unit.player`
  }

  {
    fragments.push(html`
      <div>
        ${setup.DOM.Util.message(
      '(Set skills)',
      () => {
        const frags = []
        for (let i = 0; i < setup.skill.length; ++i) {
          frags.push(html`
                <div>
                  ${setup.skill[i].rep()}
                  ${twee`<<numberbox "${unit_identifier}.skills[${i}]" ${unit.skills[i]}>>`}
                </div>
              `)
        }
        return setup.DOM.create('div', { class: 'helpcard' }, frags)
      },
    )}
      </div>
    `)
  }

  fragments.push(html`
    <div>
      ${setup.DOM.Util.message(
    `(Set name)`,
    html`
        <div class='helpcard'>
          ${twee`<<textbox "_first_name" "${unit.first_name}">>`}
          ${twee`<<textbox "_surname" "${unit.surname}">>`}
          ${setup.DOM.Nav.button(
      `Change`,
      () => {
        unit.setName(
          State.temporary.first_name,
          State.temporary.surname,
        )
        refresh()
      }
    )}
        </div>
    `
  )}
    </div>
  `)

  const property_sets = [
    {
      name: 'level',
      field: 'level',
      type: 'numberbox',
    },
    {
      name: 'weeks with company',
      field: 'weeks_with_you',
      type: 'numberbox',
    },
    {
      name: 'origin',
      field: 'origin',
      type: 'textbox',
    },
  ]

  for (const prop of property_sets) {
    fragments.push(html`
      <div>
        ${setup.DOM.Util.message(
      `(Set ${prop.name})`,
      html`
            <div class='helpcard'>
              ${twee`<<${prop.type} "${unit_identifier}.${prop.field}" ${prop.type == 'textbox' ? `"` : ""}${unit[prop.field]}${prop.type == 'textbox' ? `"` : ""}>>`}
            </div>
          `
    )}
      </div>
    `)
  }

  fragments.push(html`
    <div>
      <div>
        <b>Remove trait</b>: 
      </div>
      ${setup.DOM.create('div', {},
    unit.getRemovableTraits().map(trait => setup.DOM.Nav.link(
      trait.rep(),
      () => {
        unit.removeTraitExact(trait)
        refresh()
      },
    ))
  )}
    </div>
  `)

  fragments.push(html`
    <div>
      <div>
        <b>Add trait</b>:
        ${setup.DOM.Menu.traitpickersingle({
    raw_traits: Object.values(setup.trait).filter(trait => !trait.getTags().includes('computed')), finish_callback: (trait) => {
      unit.addTrait(trait, null, true);
      refresh()
    }
  })}
      </div>
    </div>
  `)
  return setup.DOM.create('div', {}, fragments)
}
