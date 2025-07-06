// @ts-nocheck

/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.relationsofficemanagedcompanies = function () {
  const fragments = []

  const manager = State.variables.dutylist.getDuty('relationshipmanager')

  fragments.push(html`
    <div>
      Select the companies for your
      ${manager.rep()} to manage their favors.
      When managed, their favors will no longer decay when below
      ${setup.DOM.Text.successlite('85.0')} favor.
      Their decay will also be much slower when the favor is above
      ${setup.DOM.Text.successlite('85.0')}.
      <p/>
    </div>
  `)

  const max_managed = State.variables.favor.getMaxManagedCompanies()
  const unit = manager.getAssignedUnit()
  const manager_upkeep = State.variables.favor.getRelationshipManagerUpkeep()
  if (unit && unit.isAvailable()) {
    fragments.push(html`
      <div>
        ${unit.rep()} is your ${manager.rep()}.
        ${setup.DOM.PronounYou.They(unit)} is able to manage ${max_managed} companies right now.
        That means only the first ${max_managed} of the companies below will have their relationship decay
        reduced.
        ${setup.DOM.PronounYou.They(unit)} requires an upkeep of
        ${setup.DOM.Util.money(manager_upkeep)} per week.
        <p/>
      </div>
    `)
  } else if (unit) {
    fragments.push(html`
      <div>
        ${setup.DOM.Util.YourRep(unit)} usually works here, but ${setup.DOM.PronounYou.they(unit)}
        is currently unavailable to attend to ${setup.DOM.PronounYou.their(unit)} duties.
      <p/>
      </div>
    `)
  } else {
    fragments.push(html`
      <div>
        You do not have any slaver assigned to ${manager.rep()} right now.
      <p/>
      </div>
    `)
  }

  fragments.push(html`
    <div>
      ${setup.DOM.Nav.link(
    `(Finish changing managed companies)`,
    () => {
      setup.DOM.Nav.goto('RelationsOffice')
    }
  )}
      <p/>
    </div>
  `)

  const all_managed_companies = State.variables.favor.getAllManagedCompanies()
  for (let [icompany, company] of all_managed_companies.entries()) {
    if (icompany >= max_managed) {
      fragments.push(html`
        <div>
          ${setup.DOM.Text.dangerlite('[Inactive]')}
          ${setup.DOM.Util.message(
        `'(?)'`,
        () => {
          return html`
                Your ${manager.rep()} can only manage ${max_managed} companies.
              `
        }
      )}
        </div>
      `)
    }

    fragments.push(html`
        <div>
          ${company.rep()}
          ${setup.DOM.Nav.link(
      `(remove)`,
      () => {
        State.variables.favor.removeManagedCompany(company)
        // refresh the page
        setup.DOM.Nav.goto()
      }
    )}
        </div>
      `)
  }

  if (all_managed_companies.length < max_managed) {

    const companies_to_manage = []
    for (const companykey in State.variables.company) {
      const company = State.variables.company[companykey]

      if (!State.variables.favor.isCompanyKnown(company)) continue

      if (company == State.variables.company.player) continue

      if (all_managed_companies.includes(company)) continue

      companies_to_manage.push(company)
    }

    fragments.push(html`
      <div>
        ${setup.DOM.Util.message(
      `(Manage new company)`,
      () => {
        const companies_to_manage_fragments = []
        companies_to_manage.forEach(company => {
          companies_to_manage_fragments.push(html`
                <div>
                  ${setup.DOM.Nav.button('Manage', () => {
            State.variables.favor.addManagedCompany(company)
            // refresh the page
            setup.DOM.Nav.goto()
          })}
                  ${company.rep()}
                </div>
                `)
        })
        if (companies_to_manage_fragments.length) {
          return setup.DOM.create(
            'div',
            {},
            companies_to_manage_fragments
          )
        } else {
          return null
        }
      }
    )}
      </div>
    `)
  }

  // attach Finish to top bar.
  setup.DOM.Nav.topLeftNavigation(
    setup.DOM.Nav.move(
      `Finish [space]`,
      'RelationsOffice',
    )
  )

  // put the fragments into one big <div>
  return setup.DOM.create(
    'div',
    {},
    fragments,
  )
}