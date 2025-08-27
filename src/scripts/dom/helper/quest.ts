import type { ActivityInstance } from "../../classes/activity/ActivityInstance";
import type { EventInstance } from "../../classes/event/EventInstance";
import type { InteractionInstance } from "../../classes/interaction/InteractionInstance";
import type { OpportunityInstance } from "../../classes/opportunity/OpportunityInstance";
import { QuestInstance } from "../../classes/quest/QuestInstance";

export default {
  /**
   * Loads associated quest variables before showing its passage.
   * <<questvarload>>
   */
  loadQuestVars(
    quest:
      | QuestInstance
      | OpportunityInstance
      | EventInstance
      | ActivityInstance
      | InteractionInstance,
  ) {
    State.variables.g = quest.getActorObj();
    State.variables.gQuest = quest;
    State.variables.gOutcome =
      (quest instanceof QuestInstance && quest.outcome) || undefined;
    State.variables.gTeam =
      ("getTeam" in quest && quest.getTeam()) || undefined;
  },
};
