"use strict";
// @ts-nocheck
/**
 * List possible interactions with a unit
 *
 * @param {setup.InteractionPool} interaction_pool
 * @param {setup.Unit} unit
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.interactionpool = function (interaction_pool, unit) {
    if (unit.isDefiant()) {
        const text_front = setup.Text.replaceUnitMacros(`a|rep is`, { a: unit });
        const text_back = setup.Text.replaceUnitMacros(`You cannot interact with a|them until a|their defiancy is removed.`, { a: unit });
        const defiant_help = setup.DOM.Util.help(() => {
            return html `
          A unit with either ${setup.trait.will_defiant.rep()} or ${setup.trait.will_indomitable.rep()}
          is considered ${setup.DOM.Text.dangerlite('defiant')} and cannot be interacted with
          until these traits are removed.
          <br/>
          <br/>
          Defiancy can represent that the unit is far too dangerous and headstrong to be interacted with,
          or some other reasons that would prevent the unit from being usable for anything.
        `;
        });
        return html `${text_front} ${setup.DOM.Text.dangerlite('defiant')} ${defiant_help}. ${text_back}`;
    }
    const passage = State.passage;
    const effectual = [];
    const free = [];
    for (const interaction of interaction_pool.getInteractions()) {
        if (interaction.canInteractWith(unit)) {
            if (interaction.getCosts().length || interaction.getRewards().length) {
                effectual.push(interaction);
            }
            else {
                free.push(interaction);
            }
        }
    }
    if (effectual.length || free.length) {
        const fragments = [];
        fragments.push(html `${setup.Text.replaceUnitMacros(`You can interact with a|them:`, { a: unit })}`);
        let insert_br = false;
        for (const interactions of [effectual, free]) {
            if (insert_br) {
                fragments.push(html `<br/>`);
            }
            if (interactions.length)
                insert_br = true;
            for (const interaction of interactions) {
                const costs = interaction.getCosts();
                const textname = `(${interaction.getName()})`;
                fragments.push(html `
          ${setup.DOM.Nav.link(textname, () => {
                    // @ts-ignore
                    State.variables.gInteractionReturnPassage = State.variables.gPassage;
                    // @ts-ignore
                    State.variables.gInteractionInstance = interaction.makeInstance(unit);
                    setup.DOM.Nav.goto('InteractionPerform');
                })}
          ${!!costs.length && setup.DOM.Card.cost(costs)}
        `);
            }
        }
        return setup.DOM.create('span', {}, fragments);
    }
    else {
        return html `No available interaction.`;
    }
};
