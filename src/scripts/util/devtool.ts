// @ts-nocheck


setup.DevToolHelper = {}

setup.DevToolHelper.stripNewLine = function (text) {
  return text.replace(/(\r\n|\n|\r)/gm, " ");
}

setup.DevToolHelper.fixDisplay = function (text) {
  return text.split('‘').join("'").split('’').join("'")
}

setup.DevToolHelper.debugDevToolTwine = function (text) {
  return setup.DevToolHelper.fixDisplay(setup.DevToolHelper.stripNewLine(text))
}

setup.escapeTwine = function (text) {
  return text.split(':').join('&#58;').split('$').join('&#36;').split('<').join('&#60;').split('>').join('&#62;').split('=').join('&#61;').split('/').join('&#47;').split('‘').join("'").split('’').join("'").split('@').join('&#64;').split('_').join('&#95;')
}

setup.devToolFormat = function (text) {
  return setup.escapeTwine(setup.beautifyTwine(text).text).split(' ').join('&nbsp;')
}

setup.DevToolHelper.getActors = function () {
  // keys: roles + actors + player

  // @ts-ignore
  const keys = State.variables.dtquest.getAllActorNames().map(
    actor_key => [actor_key, `$g.${actor_key}`])

  if (State.variables.devtooltype === "interaction")
    keys.push(['Target', '$g.target'])

  keys.push(['Player', '$unit.player'])
  return keys
}

setup.DevToolHelper.getCriteriasMap = function () {
  // return {
  //    skill_key: [criteria list]
  // }
  let res = {}
  for (let i = 0; i < setup.skill.length; ++i) {
    res[setup.skill[i].key] = []
  }
  for (let qukey in setup.qu) {
    let qu = setup.qu[qukey]
    let multis = qu.getSkillMultis()
    for (let i = 0; i < multis.length; ++i) {
      if (multis[i]) {
        res[setup.skill[i].key].push(qu)
      }
    }
  }

  // slave job
  res['SLAVE'] = []
  for (let qukey in setup.qu) {
    let qu = setup.qu[qukey]
    let reqs = qu.getRestrictions()
    for (let i = 0; i < reqs.length; ++i) {
      let req = reqs[i]
      if (req instanceof setup.qresImpl.Job && req.job_key == setup.job.slave.key) {
        res['SLAVE'].push(qu)
        break
      }
    }
  }

  return res
}

/**
 * Opens a dialog to pick one or more traits
 * When closed, resolves the promise with the trait keys (might be empty)
 * @param {setup.Trait[]} [traits]
 * @param {setup.Trait[]} [init_traits]
 */
setup.DevToolHelper.pickTraits = function (traits, init_traits) {
  State.temporary.seltraits = []
  return setup.Dialogs.open({
    title: "Pick traits",
    classnames: "trait-picker-dialog",
    content: setup.DOM.Menu.traitpickermulti({
      raw_traits: traits || Object.values(setup.trait),
      init_selected: init_traits || [],
      finish_callback: (selected) => {
        State.temporary.seltraits = selected
        Dialog.close()
      }
    }),
  }).then(() => State.temporary.seltraits)
}

/**
 * Opens a dialog to pick a trait
 * When closed, resolves the promise with the trait keys (might be empty)
 * @param {setup.Trait[]} [traits]
 */
setup.DevToolHelper.pickTrait = function (traits) {
  State.temporary.seltrait = null
  return setup.Dialogs.open({
    title: "Pick trait",
    classnames: "trait-picker-dialog",
    content: setup.DOM.Menu.traitpickersingle({
      raw_traits: traits || Object.values(setup.trait),
      finish_callback: (selected) => {
        State.temporary.seltrait = selected
        Dialog.close()
      }
    }),
  }).then(() => State.temporary.seltrait)
}

/**
 * Opens a dialog to pick a lore
 * When closed, resolves the promise with the lore (or undefined if cancelled)
 */
setup.DevToolHelper.pickLore = function () {
  return setup.Dialogs.open({
    title: "Pick lore",
    classnames: "trait-picker-dialog",
    passage: "LorePickerDialog"
  }).then(() => State.temporary.sellore)
}

/**
 * Opens a dialog to pick a lore
 * When closed, resolves the promise with the lore (or undefined if cancelled)
 */
setup.DevToolHelper.pickBuilding = function () {
  return setup.Dialogs.open({
    title: "Pick building",
    classnames: "trait-picker-dialog",
    passage: "BuildingPickerDialog"
  }).then(() => State.temporary.selbuilding)
}

/**
 * Opens a dialog to pick a lore
 * When closed, resolves the promise with the lore (or undefined if cancelled)
 */
setup.DevToolHelper.pickItem = function () {
  return setup.Dialogs.open({
    title: "Pick item",
    classnames: "trait-picker-dialog",
    passage: "ItemPickerDialog"
  }).then(() => State.temporary.selitem)
}

/**
 * @param {string} menu 
 * @param {Array} objects 
 * @param {string} temporary_varname 
 */
function dialogMaker(menu, objects, temporary_varname) {
  delete State.temporary[temporary_varname]
  return setup.DOM.Util.filterAll({
    menu: menu,
    filter_objects: objects,
    display_callback: (obj) => html`
      ${obj.rep()}
      ${setup.DOM.Nav.button(
      `Select`,
      () => {
        State.temporary[temporary_varname] = obj
        Dialog.close()
      }
    )}
    `
  })
}

setup.DevToolHelper.pickCompany = function () {
  return setup.Dialogs.open({
    title: "Pick company",
    classnames: "trait-picker-dialog",
    content: dialogMaker('company', Object.values(State.variables.company), 'selcompany')
  }).then(() => State.temporary.selcompany)
}

setup.DevToolHelper.pickDutyTemplate = function () {
  return setup.Dialogs.open({
    title: "Pick duty template",
    classnames: "trait-picker-dialog",
    content: dialogMaker('dutytemplate', Object.values(setup.dutytemplate), 'seldutytemplate')
  }).then(() => State.temporary.seldutytemplate)
}

/**
 * Opens a dialog to pick a title
 * When closed, resolves the promise with the lore (or undefined if cancelled)
 * @param {Array<setup.Title>} [titles]
 */
setup.DevToolHelper.pickTitle = function (titles) {
  return setup.Dialogs.open({
    title: "Pick title",
    classnames: "trait-picker-dialog",
    content: dialogMaker('title', titles || Object.values(setup.title), 'seltitle')
  }).then(() => State.temporary.seltitle)
}

/**
 * Opens a dialog to pick an item pool
 * When closed, resolves the promise with the lore (or undefined if cancelled)
 */
setup.DevToolHelper.pickItemPool = function () {
  return setup.Dialogs.open({
    title: "Pick item pool",
    classnames: "trait-picker-dialog",
    content: dialogMaker('itempool', Object.values(setup.itempool), 'selitempool')
  }).then(() => State.temporary.selitempool)
}

/**
 * Opens a dialog to pick a lore
 * When closed, resolves the promise with the lore (or undefined if cancelled)
 */
setup.DevToolHelper.pickEquipment = function () {
  return setup.Dialogs.open({
    title: "Pick equipment",
    classnames: "trait-picker-dialog",
    passage: "EquipmentPickerDialog"
  }).then(() => State.temporary.selequipment)
}

/**
 * Opens a dialog to pick an equipment pool
 * When closed, resolves the promise with the lore (or undefined if cancelled)
 */
setup.DevToolHelper.pickEquipmentPool = function () {
  return setup.Dialogs.open({
    title: "Pick equipment pool",
    classnames: "trait-picker-dialog",
    content: dialogMaker('equipmentpool', Object.values(setup.equipmentpool), 'selequipmentpool')
  }).then(() => State.temporary.selequipmentpool)
}

/**
 * THIS IS USED IN MAIN BODY GAME TOO!
 * Don't be too hacky with this method.
 */
setup.DevToolHelper.saveScrollPos = function () {
  State.variables.qscrolly = document.documentElement.scrollTop
}

/**
 * THIS IS USED IN MAIN BODY GAME TOO!
 * Don't be too hacky with this method.
 */
setup.DevToolHelper.restoreScrollPos = function () {
  setTimeout(function () {
    if (State.variables.qscrolly !== undefined) {
      const y = State.variables.qscrolly
      document.documentElement.scroll(0, y)
      delete State.variables.qscrolly
    }
  }, 1)
}

setup.clearQueue = function () {
  State.variables.devqueue = {}
}

setup.getQueue = function (passage) {
  if (!('devqueue' in State.variables)) {
    State.variables.devqueue = {}
  }
  let devqueue = State.variables.devqueue
  if (!(passage in devqueue)) {
    devqueue[passage] = []
  }
  return devqueue[passage]
}

setup.devQueue = function (passage, obj) {
  let queue = this.getQueue(passage)
  queue.push([State.variables.qPassageName, obj])
  State.variables.qPassageName = passage
}

setup.devPop = function (passage) {
  let queue = this.getQueue(passage)
  if (!queue.length) {
    throw new Error(`Missing queue in ${passage}`)
  }
  let oldvar = queue.pop()
  State.variables.qPassageName = oldvar[0]
  return oldvar[1]
}

setup.DevToolHelper.getPassageIndex = function (outcomedescs, idx) {
  while (idx && !(outcomedescs[idx].trim())) --idx
  return idx
}

/**
 * @param {setup.ActivityTemplate} template
 * @returns {string}
 */
setup.DevToolHelper.printActivityDialogues = function (template) {
  const dialogues = template.getDialogues()
  let dials = []
  let i = 0
  for (const dialogue of dialogues) {
    i += 1

    let texts_text
    if ([dialogue.texts.bold, dialogue.texts.cool, dialogue.texts.witty, dialogue.texts.debauched].
      filter(a => a.length > 1 || a[0].trim().length > 0).length) {
      const texts = []
      for (const textkey in dialogue.texts) {
        const poss = dialogue.texts[textkey].map(x => setup.escapeTwine(setup.escapeJsString(x)))
        texts.push(`&nbsp; &nbsp; ${textkey}: [
  ${poss.map(x => `&nbsp; &nbsp; &nbsp; "${x.replace(/\n/g, ' ')}",`).join('\n')}
  &nbsp; &nbsp; ],`)
      }
      texts_text = `{
  ${texts.join('\n')}
  &nbsp; }`
    } else {
      const poss = dialogue.texts.friendly.map(x => setup.escapeTwine(setup.escapeJsString(x)))
      texts_text = `[
${poss.map(x => `&nbsp; &nbsp; "${x.replace(/\n/g, ' ')}",`).join('\n')}
      &nbsp; ]`
    }

    dials.push(
      `{ """/* Dialogue #${i}: */"""
&nbsp; actor: "${setup.escapeJsString(dialogue.actor)}",
&nbsp; texts: ${texts_text},
}, """/* End of Dialogue #${i} */"""`)
  }
  return dials.join('\n')
}
