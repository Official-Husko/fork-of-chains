// @ts-nocheck
/**
 * @returns {setup.DOM.Node}
 */
export function payWages() {
    const total_wage = State.variables.company.player.getTotalWages();
    State.variables.company.player.substractMoney(total_wage);
    setup.notify(`Paid ${setup.DOM.toString(setup.DOM.Util.money(total_wage))} in wages`);
    return null;
}
