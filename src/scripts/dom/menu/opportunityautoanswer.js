"use strict";
// @ts-nocheck
/**
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.opportunityautoanswer = function () {
    const fragments = [];
    // flavor texts
    {
        const vice_leader = State.variables.dutylist.getUnitIfAvailable('viceleader');
        fragments.push(html `
      <p>
        You went over to ${vice_leader.rep()}'s desk. The following is the list of all
        mails that ${vice_leader.rep()} will automatically responds to.
        You can make changes to it, if you wish.
      </p>
    `);
    }
    // link to return to previous menu
    fragments.push(html `
    <div>
      ${setup.DOM.Nav.return('(Finish)')}
    </div>
  `);
    // list the opportunities
    State.variables.opportunitylist.getOpportunityAutoAnswers().forEach(opp_raw => {
        const [opportunity, index] = opp_raw;
        fragments.push(html `
      <div>
        ${setup.DOM.Util.namebold(opportunity)}: Respond with
        ${setup.DOM.Util.include(opportunity.getOptions()[index].description_passage)}
        ${setup.DOM.Nav.link(`(remove auto-answer)`, () => {
            // remove the opportunity from being auto-answered
            State.variables.opportunitylist.removeAutoAnswer(opportunity);
            // then refresh the page
            setup.DOM.Nav.goto();
        })}
      </div>
    `);
    });
    // put the fragments into one big <div>
    return setup.DOM.create('div', {}, fragments);
};
