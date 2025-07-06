// @ts-nocheck

function refreshPage() {
  setup.DevToolHelper.saveScrollPos()
  setup.runSugarCubeCommand('<<goto "ActivityGen">>')
}

/**
 * @param {setup.ActivityTemplate} template
 * @param {boolean} is_critical
 * @returns {setup.DOM.Node}
 */
function traitFragment(template, is_critical) {
  let current
  if (is_critical) {
    current = template.getCriticalTraits()
  } else {
    current = template.getDisasterTraits()
  }

  const inner = []
  if (is_critical) {
    inner.push(html`
        <b>List of ${setup.DOM.Text.successlite('preferred')} traits</b>:
        ${setup.DOM.Util.help(
      html`
            If the primary unit have these traits then they will have a greater chance of doing this activity over others.
          `
    )}
    `)
  } else {
    inner.push(html`
        <b>List of ${setup.DOM.Text.dangerlite('dispreferred')} traits</b>:
        ${setup.DOM.Util.help(
      html`
            If the primary unit have these traits then they will have a smaller chance of doing this activity over others.
          `
    )}
    `)
  }

  inner.push(setup.DOM.Nav.link(
    `(change)`,
    () => {
      setup.DevToolHelper.pickTraits(null, /* init traits = */ current).then(
        (selected_traits) => {
          let varname
          if (is_critical) {
            varname = 'critical_trait_keys'
          } else {
            varname = 'disaster_trait_keys'
          }
          template[varname] = selected_traits.map(trait => trait.key)
          refreshPage()
        }
      )
    }
  ))

  return html`
    <div class='${is_critical ? 'lorecard card' : 'opportunitycard'}'>
      ${setup.DOM.create('div', {}, inner)}
      <div>
        ${current.map(trait => trait.rep()).join('')}
        ${current.length ? '' : html`<small>No traits selected</small>`}
      </div>
    </div>
  `
}

/**
 * @param {Dialogue} dialogue
 * @param {number} dialogue_index
 * @param {Dialogue[]} dialogues
 * @returns {setup.DOM.Node}
 */
function dialogueEditFragment(dialogue, dialogue_index, dialogues) {
  const fragments = []

  let movedown = null
  if (dialogue_index < dialogues.length - 1) {
    movedown = setup.DOM.Nav.link(
      `(move down)`,
      () => {
        dialogues.splice(dialogue_index, 0, dialogues.splice(dialogue_index + 1, 1)[0])
        refreshPage()
      },
    )
  }

  let moveup = null
  if (dialogue_index > 0) {
    moveup = setup.DOM.Nav.link(
      `(move up)`,
      () => {
        dialogues.splice(dialogue_index - 1, 0, dialogues.splice(dialogue_index, 1)[0])
        refreshPage()
      },
    )
  }

  let remove = null
  if (dialogues.length >= 2) {
    remove = setup.DOM.Nav.link(
      `(delete dialogue sequence #${dialogue_index + 1})`,
      () => {
        dialogues.splice(dialogue_index, 1)
        refreshPage()
      }
    )
  }

  fragments.push(html`
    <div>
      Dialogue sequence <b>#${dialogue_index + 1}</b> by actor ${twee`<<devactor '$dtquest.dialogues[${dialogue_index}].actor'>>`}
      ${moveup}
      ${movedown}
      ${remove}
      ${setup.DOM.Util.help(
    html`Click to change the actor`
  )}
    </div>
  `)

  for (const perkey in dialogue.texts) {
    const inner = []
    let remove_node = null
    const texts = dialogue.texts[perkey]
    if (texts.length >= 2) {
      const veryin = []
      for (let i = 0; i < texts.length; ++i) {
        veryin.push(setup.DOM.Nav.link(
          `(remove alternate text #${i + 1})`,
          () => {
            dialogue.texts[perkey].splice(i, 1)
            refreshPage()
          }
        ))
      }
      remove_node = setup.DOM.create('span', {}, veryin)
    }

    inner.push(html`
      <div>
        Dialogues for ${setup.DOM.Text.successlite(setup.capitalize(perkey))} units:
        ${setup.DOM.Nav.link(
      `(Add alternate text)`,
      () => {
        dialogue.texts[perkey].push('')
        refreshPage()
      },
    )}
      ${remove_node}
      ${setup.DOM.Util.help(
      html`
          If a dialogue has multiple options, one of these will be chosen at random.
        `
    )}
      </div>
    `)
    for (let i = 0; i < texts.length; ++i) {
      const vname = `$dtquest.dialogues[${dialogue_index}].texts.${perkey}[${i}]`
      inner.push(twee`<<codeeditor '${vname}' ${vname}>>`)
    }
    fragments.push(html`
      ${setup.DOM.create('div', {}, inner)}
      <hr/>
    `)
  }
  return setup.DOM.create('fragments', { class: 'dialoguecard card' }, fragments)
}

/**
 * @param {setup.ActivityTemplate} template
 * @returns {setup.DOM.Node}
 */
function roomSelectFragment(template) {
  const fragments = []

  function selectRoomCallback(room) {
    return () => {
      State.temporary.selected_room = room
      Dialog.close()
    }
  }

  fragments.push(html`
    <div>
      List of allowed rooms:
      ${setup.DOM.Util.help(html`This activity will only take place in one of these rooms`)}
      ${setup.DOM.Nav.move('(add new)', 'AGChooseRoom')}
    </div>
  `)

  function removeRoomCallback(room) {
    return () => {
      template.room_template_keys = template.room_template_keys.filter(key => key != room.key)
      refreshPage()
    }
  }

  for (const room_template of template.getRoomTemplates()) {
    fragments.push(html`
      <div>
        ${room_template.rep()}
        ${setup.DOM.Nav.link(
      `(remove)`,
      removeRoomCallback(room_template)
    )}
      </div>
    `)
  }

  return setup.DOM.create('div', {
    class: 'roominstancecard card',
  }, fragments)
}


/**
 * @param {setup.ActivityTemplate} template
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.devtoolactivity = function (template) {
  const fragments = []

  fragments.push(traitFragment(template, /* critical = */ true))
  fragments.push(traitFragment(template, /* critical = */ false))
  fragments.push(roomSelectFragment(template))

  fragments.push(html`<hr/>`)

  fragments.push(html`<div>
    Write your activity dialogues below. You can either
    have different dialogue per personality, or you can
    ${setup.DOM.Util.message(
    `use the same dialogue for all personalities`,
    html`<div class='helpcard'>
    Simply fill out only the "Friendly" dialogue and leave the rest completely blank to achieve this effect.
    </div>`
  )}
  </div>`)

  const dialogues = template.getDialogues()
  for (let i = 0; i < dialogues.length; ++i) {
    fragments.push(dialogueEditFragment(dialogues[i], i, dialogues))
  }

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.link(
    `(add new dialogue sequence)`,
    () => {
      template.dialogues.push(
        setup.DialogueHelper.createEmptyDialogue(dialogues[dialogues.length - 1].actor),
      )
      refreshPage()
    }
  )}
    </div> 
  `)

  return setup.DOM.create('div', {}, fragments)
}


/**
 * @param {setup.ActivityTemplate} template
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.devtoolactivityselectroom = function (template) {
  const fragments = []
  fragments.push(html`
    <p>
      Choose a room:
    </p>
  `)

  const current = template.getRoomTemplates()
  const all_rooms = Object.values(setup.roomtemplate).filter(room => !current.includes(room))
  all_rooms.sort((a, b) => a.getName().localeCompare(b.getName()))

  fragments.push(setup.DOM.Util.filterAll({
    menu: 'roomtemplate',
    filter_objects: all_rooms,
    display_callback: (room_template) => {
      let inside
      if (State.variables.menufilter.get('roomtemplate', 'display') == 'compact') {
        inside = setup.DOM.Card.roomtemplatecompact(room_template, /* hide actions = */ true)
      } else {
        inside = setup.DOM.Card.roomtemplate(room_template, /* hide actions = */ true)
      }
      return html`
        <div>
          ${room_template.rep()} ${setup.DOM.Nav.button(
        `Select`,
        () => {
          template.room_template_keys.push(room_template.key)
          setup.runSugarCubeCommand('<<goto "ActivityGen">>')
        }
      )}
          <div>
            ${inside}
          </div>
        </div>
      `
    },
  }))
  return setup.DOM.create('div', {}, fragments)
}
