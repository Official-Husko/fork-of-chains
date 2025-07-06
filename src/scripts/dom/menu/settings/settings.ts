// @ts-nocheck

export const IMPORTABLE = true
setup.DOM.Menu.Settings = {}
setup.DOM.Menu.Settings.Debug = {}

/**
 * @param {{
 * title: string
 * field: string
 * help?: string | setup.DOM.Node
 * }} args
 * @returns {setup.DOM.Node}
 */
function checkbox({ title, field, help }) {
  return html`
    <div>
      ${twee`<<checkbox '$settings.${field}' false true autocheck>>`} ${title}
      ${help ? setup.DOM.Util.help(help) : ''}
    </div>
  `
}

/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.settingsbase = function () {
  const fragments = []

  const is_devtool = State.variables.devtooltype

  if (!is_devtool) {
    fragments.push(html`
      <div>
        Auto-save every
        ${twee`<<numberbox '$settings.autosave_interval' $settings.autosave_interval>>`}
        weeks
        ${setup.DOM.Util.help(html`
          The game will auto-save every this many weeks.
          Put 0 to never auto-save, and 1 to auto-save every week.
          Larger number will make the end-of-week processing faster.
        `
    )}
      </div>
    `)
  }

  fragments.push(
    html`
      <hr/>
      <div>
        <b>Story display</b>
      </div>
    `,
    checkbox({
      title: `Hide quest / event images`,
      field: `hidecontentimages`,
      help: html`
        If checked, then images in quest and event outcomes are hidden.
      `
    }),
    checkbox({
      title: `Summarize quest/event outcomes`,
      field: `hidequestoutcome`,
      help: html`
        If checked, then quest outcome notifications are summarized, and must be toggled to view.
      `
    }),
    checkbox({
      title: `Summarize quest texts`,
      field: `hidequestdescription`,
      help: html`
        If checked, then quest result texts are summarized, and must be toggled to view.
      `
    }),
    checkbox({
      title: `Summarize event texts`,
      field: `hideeventdescription`,
      help: html`
        If checked, then event texts are summarized and must be toggled to view.
      `
    }),
    html`
      <hr/>
      <div>
        <b>Unit information</b>
      </div>
    `,
    checkbox({
      title: `Show unit icons in text`,
      field: `inline_icon`,
      help: html`
        If checked, icons will be shown next to units and equipments in texts.
      `
    }),
    checkbox({
      title: `Use different color for unit names depending on gender`,
      field: `inline_color`,
      help: html`
        If checked, unit names will be color-coded in texts.
      `
    }),
    checkbox({
      title: `Use different font for unit names depending on race`,
      field: `inline_font`,
      help: html`
        If checked, unit names will use different fonts, depending on their race
      `
    }),
    checkbox({
      title: `Summarize unit skills`,
      field: `summarizeunitskills`,
      help: html`
        If checked, then unit skills are displayed as their total sum,
        instead of xx + xx.
        E.g., instead of 11 ${setup.DOM.Text.successlite(' + 4')} ${setup.skill.combat.rep()},
        it will display as
        <span data-tooltip="11 + 4">${setup.DOM.Text.successlite('15')}</span> ${setup.skill.combat.rep()}
        (You can hover over it to see the "11 + 4").
      `
    }),
    checkbox({
      title: `Sort skill focuses as they appear in the skill change menu`,
      field: `unsortedskills`,
      help: html`
        If checked, the skill focuses in the icon grid won't be sorted by their natural order. Instead they will appear in the order they are in the change focus skill page.
      `
    }),
    checkbox({
      title: `Hide skin traits`,
      field: `hideskintraits`,
      help: html`
        If checked, skin traits such as
        ${setup.trait.body_werewolf.rep()} or ${setup.trait.ears_elf.rep()}
        are hidden in unit cards.
      `
    }),
    html`
      <hr/>
      <div>
        <b>Miscellaneous</b>
      </div>
    `,
    checkbox({
      title: `Animated tooltips`,
      field: `animatedtooltips`,
      help: html`
        If checked, tooltips will fade in, and appear after some small delay.
        If unchecked, tooltips will instantly show up, with no delay.
      `
    }),
    checkbox({
      title: `Auto-assign units for unit actions`,
      field: `unitactionautoassign`,
      help: html`
        If checked, quests generated from unit action will be auto-assigned a team when you select it.
      `
    }),
  )

  fragments.push(html`
    <div>
      ${setup.DOM.Util.message(
    '(Change allowed lover gender pairings)',
    html`
          <div class='helpcard'>
            <p>
              Which pair of genders can become lover with each other?
              <b>Enable at least one</b>, or the game may behave erractically.
            </p>
            ${checkbox({
      title: 'Male - Female',
      field: 'lovers_mf',
    })}
            ${checkbox({
      title: 'Male - Male',
      field: 'lovers_mm',
    })}
            ${checkbox({
      title: 'Female - Female',
      field: 'lovers_ff',
    })}
          </div>
        `
  )}
    </div>
  `)

  const settings = State.variables.settings

  function set_difficulty(new_value) {
    if (settings.challengemode != new_value) {
      return setup.DOM.Nav.link(
        `(set to ${setup.Settings.difficulty_to_human(new_value)})`,
        () => {
          settings.challengemode = new_value
          setup.DOM.Nav.goto()
        }
      )
    } else {
      return null
    }
  }

  if (!is_devtool) {
    fragments.push(html`
      <div>
        ${setup.DOM.Util.message(
      `(EXPERIMENTAL)`,
      html`
            <div class='helpcard'>
              <div>
                ${setup.DOM.Text.danger('WARNING')}:
                Settings under EXPERIMENTAL are either
                ${setup.DOM.Text.dangerlite('NO BALANCED')}
                or cause
                ${setup.DOM.Text.dangerlite('TEXT ISSUES')},
                and it is recommended to turn all these settings off,
                at least on your first playthrough.
                However, feel free to turn on these settings if you feel particularly adventurous
                or masochistic.
              </div>

              <hr/>

              <div>
                <b>Difficulty</b>: ${settings.getDifficultyHumanReadable()}
                ${set_difficulty(false)}
                ${setup.DOM.create('span', {}, Object.keys(setup.Settings.DIFFICULTIES).map(diff => set_difficulty(diff)))}
              </div>
            </div>
          `
    )}
      </div>
    `)
  }

  return setup.DOM.create('div', {}, fragments)
}


/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.settingsmain = function () {
  const fragments = []
  fragments.push(setup.DOM.Menu.settingsbase())
  fragments.push(html`<hr/>`)
  fragments.push(setup.DOM.Util.include('SettingsGenderPreferences'))
  fragments.push(html`<hr/>`)
  fragments.push(html`
    <div>${setup.DOM.Nav.move('Set Content Filter', 'BannedTagMenu')}</div>
    <div>${setup.DOM.Nav.link('Manage Global Settings, Imagepacks & Mods', () => setup.DOM.Menu.Settings.opendialog())}</div>
    <div>
      ${setup.DOM.Nav.move('Export Save', 'ExportSaveText')}
      ${setup.DOM.Nav.move('Import Save', 'ImportSaveText')}
      ${setup.DOM.Util.help(html`
        This menu allows you to export and import your save as a plain text.
        This is useful for mobile users whose devices does not support the "Save to Disk" and
        "Load to Disk" options in the game, for whom these buttons will not be visible.
      `)}
    </div>
    <div>
      ${setup.DOM.Nav.link('Reset unit portraits', () => {
    State.variables.unitimage.resetAllImages()
    setup.notify(`Unit images has been reset`)
    setup.DOM.Nav.goto()
  })}
      ${setup.DOM.Util.help(html`
        Resets all unit portraits. Useful if you switch image packs, or if you migrate from
        different version of the game (e.g., from Itch.io to gitgud.io).
      `)}
    </div>
    <hr/>
  `)

  if (State.variables.gDebug) {
    fragments.push(html`
      <div>
        ${setup.DOM.Text.danger('Warning: Debug mode is ON')} You may encounter inconsistencies / errors with the debug mode
        turned on. Do NOT report these bugs.
      </div>
    `)
    // @ts-ignore
  } else if (State.variables.gDebugWasTurnedOn) {
    fragments.push(html`
      <div>
        ${setup.DOM.Text.dangerlite(`Debug mode was turned ON at some point of this game.`)}
        This does not affect the game at all, but this information will be relayed when
        reporting errors.
        Bugs found in games that have been tampered with debug mode should generally
        ${setup.DOM.Text.dangerlite(`NOT`)}
        be reported.
      </div>
    `)
  }

  if (State.variables.gDebug) {
    fragments.push(setup.DOM.Menu.settingsdebug())
  } else {
    fragments.push(html`
      <div>
        ${setup.DOM.Nav.link(
      '(turn on debug mode)',
      () => {
        State.variables.gDebug = true
        // @ts-ignore
        State.variables.gDebugWasTurnedOn = true
        setup.DOM.Nav.goto()
      })}
        ${setup.DOM.Text.dangerlite('Warning')}:
        Debug Mode is meant for debugging, and turning it on in an ordinary
        game may have unforeseen consequences!
      </div>
    `)
  }
  return setup.DOM.create('div', {}, fragments)
}

/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.settingsdebug = function () {
  const fragments = []
  fragments.push(
    html`
      <div>
        ${setup.DOM.Nav.link(
      `(turn off debug mode)`,
      () => {
        State.variables.gDebug = false
        setup.DOM.Nav.goto()
      }
    )}
      </div>
    `
  )

  fragments.push(
    html`
      <div>
        ${twee`[[(TEST EVERYTHING)|DebugTestEverything]]`}
      </div>
      <div>
        ${setup.DOM.Util.message(
      `(Syntax check all content)`,
      () => {
        setup.DOM.Menu.devtoolcheckall()
      }
    )}
      </div>
      <hr/>
      <div>
        ${setup.DOM.Nav.move('(Test quests)', 'QuestDebug')}
        ${setup.DOM.Nav.move('(See scoutable quests)', 'GeneratableDebug')}
      </div>
      <div>
        ${setup.DOM.Nav.move('(Test opportunities)', 'OpportunityDebug')}
      </div>
      <div>
        ${setup.DOM.Nav.move('(Test interactions)', 'InteractionDebug')}
      </div>
      <div>
        ${setup.DOM.Nav.move('(Test events)', 'EventDebug')}
      </div>
      <div>
        ${setup.DOM.Nav.move('(Test activites)', 'ActivityDebug')}
      </div>
      <div>
        ${setup.DOM.Nav.move('(Test all livings)', 'LivingDebugDoAll')}
      </div>
      <hr/>
      <div>
        ${setup.DOM.Nav.move('(Test get item)', 'ItemDebug')}
      </div>
      <div>
        ${setup.DOM.Nav.move('(Test get equipment)', 'EquipmentDebug')}
      </div>
      <div>
        ${setup.DOM.Nav.link(
      `(Test get 100,000 money)`,
      () => {
        State.variables.company.player.addMoney(100000)
        setup.DOM.Nav.goto()
      }
    )}
      </div>
      <div>
        ${setup.DOM.Nav.move('(Test increase / decrease favor)', 'FavorDebug')}
      </div>
      <div>
        ${setup.DOM.Nav.move('(Test increase / decrease ire)', 'IreDebug')}
      </div>
      <hr/>
      <div>
        ${setup.DOM.Nav.link(
      '(Show variables)',
      () => {
        const in_fragments = []
        for (const varname in State.variables.varstore.vars) {
          in_fragments.push(html`
                <div>${varname}: ${State.variables.varstore.get(varname)}</div>
              `)
        }
        setup.Dialogs.open({
          title: "All game variables",
          content: setup.DOM.create('div', {}, in_fragments)
        })
      }
    )}
      </div>
      <div>
        ${setup.DOM.Util.message(
      `(Test trigger error)`,
      () => {
        return setup.debugCrash()
      }
    )}
      </div>
    `
  )
  return setup.DOM.create('div', {}, fragments)
}
