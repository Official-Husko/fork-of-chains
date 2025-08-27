//
// Types for the story state variables
// (which reside at `State.variables` aka `SugarCube.State.variables`)
//

import type { StateVariablesBase } from "../_init/state_init";
import type { ActivityInstance } from "../classes/activity/ActivityInstance";
import type {
  ActivityTemplate,
  ActivityTemplateKey,
} from "../classes/activity/ActivityTemplate";
import type { BedchamberKey } from "../classes/bedchamber/BedChamber";
import type SlaveOrderFlex from "../classes/cost/slaveorder/SlaveOrderFlex";
import type { DutyInstanceKey } from "../classes/duty/DutyInstance";
import type { EquipmentSetKey } from "../classes/equipment/EquipmentSet";
import type { EventInstance } from "../classes/event/EventInstance";
import type {
  EventTemplate,
  EventTemplateKey,
} from "../classes/event/EventTemplate";
import type { InteractionInstance } from "../classes/interaction/InteractionInstance";
import type {
  InteractionTemplate,
  InteractionTemplateKey,
} from "../classes/interaction/InteractionTemplate";
import type {
  OpportunityInstance,
  OpportunityInstanceKey,
} from "../classes/opportunity/OpportunityInstance";
import type {
  OpportunityTemplate,
  OpportunityTemplateKey,
} from "../classes/opportunity/OpportunityTemplate";
import type { PartyKey } from "../classes/party/Party";
import type { QuestInstanceKey } from "../classes/quest/QuestInstance";
import type {
  QuestOutcome,
  QuestTemplateKey,
} from "../classes/quest/QuestTemplate";
import type { LivingKey } from "../classes/retire/Living";
import type { RoomInstanceKey } from "../classes/room/RoomInstance";
import type { SlaveOrderKey } from "../classes/slaveorder/SlaveOrder";
import type { Team } from "../classes/Team";
import type { UnitKey } from "../classes/unit/Unit";
import type { UnitAction } from "../classes/unitaction/UnitAction";

// Declare additional state variables which are defined in the .twee files
// (and therefore not detected by typescript)
// It's mostly stuff used in the devtool
export interface StateVariables
  extends StateVariablesBase,
    StateVariablesDevtool {
  /** Set to true when state is initialized */
  gInitDone: boolean;

  mods?: string[];

  args?: any[] & { raw?: string; full?: string; payload?: string }; // $args as used in widgets
  a?: string;
  b?: string;
  g: ActorUnitMap;

  gVersion:
    | `${number}.${number}.${number}`
    | `${number}.${number}.${number}.${number}`;
  gMenuVisible?: boolean;
  gNextpassage?: string;
  gOldPassage?: string;
  gOutcome?: "crit" | "success" | "failure" | "disaster" | null;
  gPassage?: string;
  gPassageName?: string;
  gQuest?:
    | QuestInstance
    | OpportunityInstance
    | EventInstance
    | ActivityInstance
    | InteractionInstance
    | UnitAction;
  gTeam?: Team;
  gUnit_key?: UnitKey;
  gParty_key?: PartyKey;
  gPartySelected_key?: PartyKey;
  gUnitSelected_key?: UnitKey;
  gUnit_skill_focus_change_key?: UnitKey;
  gUnitMultiTraining_key?: UnitKey;
  gFortGridBuildRoomKey?: RoomInstanceKey;
  gFortGridPlaceRoomKey?: RoomInstanceKey;
  gUseItem_key?: ItemKey;
  gDuty_key?: DutyInstanceKey;
  gOpportunity_key?: OpportunityInstanceKey;
  gSlaveOrder_key?: SlaveOrderKey;
  gBedchamber_key?: BedchamberKey;
  gBedchamberChangeFurnitureReturnPassage?: string;
  gInteractionReturnPassage?: string;
  gInteractionInstance?: InteractionInstance;
  gEquipmentSet_key?: EquipmentSetKey;
  gEquipmentSetChangeReturnPassage?: string;
  gUnitDetailReturnPassage?: string;
  gInteractiveSexUnitIds?: UnitKey[];
  gInteractiveSexLocation_key?: string;
  gNewGamePlusExLeader?: boolean;
  gNewGamePlusExtraKeys?: UnitKey[];
  gAdhocQuestCriteriaOpenActor?: string;
  gAdhocUnitUsed?: Record<UnitKey, string>;
  gAdhocQuestActorMap?: ActorUnitKeyMap;
  gAdhocQuest_key?: QuestInstanceKey;
  compiledquest?: any;
  dtEditActor?: any;

  gNewGamePlusBackwardsCompat?: boolean;
  gUpdatePostProcess?: boolean;

  gDebug: boolean;
  gDebugWasTurnedOn?: boolean;
  gDebugQuestTest?: boolean;
  qDebugQuestTemplate_key?: QuestTemplateKey;
  qDebugQuestResult?: QuestOutcome;
  qDebugOpportunityTemplate_key?: OpportunityTemplateKey;
  gDebugOpportunityOption?: number;
  qDebugActivityTemplate_key?: ActivityTemplateKey;
  qDebugEventTemplate_key?: EventTemplateKey;
  qDebugInteractionTemplate_key?: InteractionTemplateKey;
  gDebugLiving_key?: LivingKey;

  qauthor: string;
  qcosts: InstanceType<typeof setup.Cost>[];
  qcustomcriteria: InstanceType<typeof setup.UnitCriteria>[];
  qcustomslaveorder: InstanceType<typeof SlaveOrderFlex>[];
  qcustomtitle: InstanceType<typeof setup.Title>[];
  qcustomunitgroup: InstanceType<typeof setup.UnitGroup>[];
  qdesc: string;
  qDevTool: boolean;
  qdiff: InstanceType<typeof setup.QuestDifficulty> | null;
  qexpires: number;
  qname: string;
  qoutcomedesc: string[];
  qoutcomes: InstanceType<typeof setup.Cost>[][];
  qPassageName: string;
  qpool: InstanceType<typeof setup.QuestPool>;
  qrarity: number;
  qrestrictions: InstanceType<typeof setup.Restriction>[];
  qrolename: string;
  qscrolly: number | undefined;
  qtags: string[];
  qunfulfilled: InstanceType<typeof setup.Cost>[];
  qweeks: number;
}

//
// Devtool-only state variables
//
interface StateVariablesDevtool {
  devqueue?: Record<string, [string, any][]>;

  devtooltype?: string;
  dtquest?:
    | QuestTemplate
    | OpportunityTemplate
    | EventTemplate
    | InteractionTemplate
    | ActivityTemplate;

  // Quest editor
  qkey?: string;
  qfilename?: string;
  qpassagesetup?: string;
  qpassagedesc?: string;
  qpassageoutcomes?: string[];

  // Opportunity editor
  okey?: string;
  opassagesetup?: string;
  opassagedesc?: string;

  // Event editor
  ekey?: string;
  epassagesetup: string;
  epassagedesc: string;

  // Interaction editor
  ikey?: string;
  ipassagesetup?: string;
  ipassagedesc?: string;

  // Activity editor
  akey?: string;
  apassagesetup?: string;
  apassagedesc?: string;
}
