// @ts-nocheck
/*
Originally from:
http://twinery.org/forum/discussion/comment/17617/
*/
import { getQuestExpiresFragment } from "../card/quest";
/**
 * Display list of quests on the right sidebar on wide screens.
 *
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.questquicklist = function () {
    const quests = State.variables.company.player.getQuests();
    // put assigned quests on top
    quests.sort((a, b) => {
        if (a.getTeam() && !b.getTeam())
            return -1;
        if (b.getTeam() && !a.getTeam())
            return 1;
        return b.key - a.key;
    });
    return setup.DOM.Util.filterAll({
        menu: 'questquick',
        filter_objects: quests,
        display_callback: quest => {
            const fragments = [];
            fragments.push(html `
        <div>
          ${setup.TagHelper.getTagsRep('quest', quest.getTemplate().getTags())}
          ${quest.getTemplate().getDifficulty().rep()}
          ${quest.rep()}
          ${quest.getTeam() ? html `(${getQuestExpiresFragment(quest)})` : ``}
        </div>
      `);
            const team = quest.getTeam();
            if (team) {
                for (const unit of team.getUnits()) {
                    fragments.push(html `
            <div>
              ${unit.rep()}
            </div>
          `);
                }
                fragments.push(html `<hr/>`);
            }
            return setup.DOM.create('div', {}, fragments);
        }
    });
};
