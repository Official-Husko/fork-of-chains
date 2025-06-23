import { getFriend } from "../../text/macro/friendship"


const divnames = [`divdebugfriendshipcontainerslaver`, `divdebugfirendshipcontainerslave`]


function refreshAll() {
  for (const divname of divnames) setup.DOM.refresh(`#${divname}`)
}


/**
 * @param {setup.Unit} unit 
 * @param {setup.Unit} target 
 * @param {number} amount 
 */
function friendshipAdjustCallback(unit, target, amount) {
  return () => {
    State.variables.friendship.adjustFriendship(unit, target, amount)
    refreshAll()
  }
}


/**
 * @param {setup.Unit} unit 
 * @param {setup.Job} job 
 */
function makeJobDivCallback(unit, job) {
  return () => {
    const fragments = []

    for (const target of State.variables.company.player.getUnits({ job: job }).filter(u => u.key != unit.key)) {
      const friendship = State.variables.friendship.getFriendship(unit, target)
      const inner_fragments = []
      inner_fragments.push(html`
        ${setup.DOM.Util.friendship(friendship)}
        ${getFriend(unit, target)}
        ${target.rep()}
      `)

      const increments = [
        ['(+1) ', 10],
        // ['+5', 50],
        ['(+20) ', 200],
        ['(Max) ', 2000],
        ['(-1) ', -10],
        // ['-5', -50],
        ['(-20) ', -200],
        ['(Min) ', -2000],
      ]
      for (const [increment_text, increment_value] of increments) {
        inner_fragments.push(setup.DOM.Nav.link(
          // @ts-ignore
          html`${increment_text}`, friendshipAdjustCallback(unit, target, increment_value)))
      }

      inner_fragments.push(setup.DOM.Nav.link(
        html`(Delete) `,
        () => {
          State.variables.friendship.deleteFriendship(unit, target)
          refreshAll()
        }
      ))

      if (unit.getLover() != target) {
        inner_fragments.push(setup.DOM.Nav.link(
          html`(Lovers) `,
          () => {
            setup.qc.Hookup('a', 'b').apply(setup.costUnitHelperDict({
              a: unit,
              b: target
            }))
            refreshAll()
          }
        ))
      } else {
        inner_fragments.push(setup.DOM.Nav.link(
          html`(Breakup) `,
          () => {
            setup.qc.Breakup('a', 'b').apply(setup.costUnitHelperDict({
              a: unit,
              b: target
            }))
            refreshAll()
          }
        ))
      }

      fragments.push(setup.DOM.create('div', {}, inner_fragments))
    }

    return setup.DOM.create('div', {}, fragments)
  }
}


/**
 * Explain a cost array.
 * <<costcard>>
 * 
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.debugfriendship = function (unit) {
  const jobs = [setup.job.slaver, setup.job.slave]

  const outer_fragments = []
  for (let i = 0; i < jobs.length; ++i) {
    const job = jobs[i]
    const divname = divnames[i]

    outer_fragments.push(setup.DOM.Util.message(`(Friendship with a ${job.getName()}) `, setup.DOM.createRefreshable(
      'div',
      { id: divname },
      makeJobDivCallback(unit, job),
    )))
  }

  return setup.DOM.create('div', {}, outer_fragments)
}
