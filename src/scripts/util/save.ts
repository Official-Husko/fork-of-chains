import type { SaveDetails, SaveObject } from "twine-sugarcube";
import type { ActivityTemplateKey } from "../classes/activity/ActivityTemplate";
import type { EventTemplateKey } from "../classes/event/EventTemplate";
import type { InteractionTemplateKey } from "../classes/interaction/InteractionTemplate";
import type { OpportunityTemplateKey } from "../classes/opportunity/OpportunityTemplate";
import type { QuestTemplateKey } from "../classes/quest/QuestTemplate";
import { BackwardsCompat } from "./backwardscompat";

export namespace SaveUtil {
  export function convertToClass(sv: any) {
    // Backwards compatibility tool
    // Converts existing objects to newer classes, if haven't
    let to_convert = {
      calendar: setup.Calendar,
      titlelist: setup.TitleList,
      friendship: setup.Friendship,
      bedchamberlist: setup.BedchamberList,
      contactlist: setup.ContactList,
      armory: setup.Armory,
      eventpool: setup.EventPool,
      family: setup.Family,
      inventory: setup.Inventory,
      opportunitylist: setup.OpportunityList,
      slaveorderlist: setup.SlaveOrderList,
      hospital: setup.Hospital,
      notification: setup.Notification,
      settings: setup.Settings,
      statistics: setup.Statistics,
      trauma: setup.Trauma,
      varstore: setup.VarStore,
      dutylist: setup.DutyList,
    };
    for (const [key, targetClass] of objectEntries(to_convert)) {
      if (key in sv && !(sv[key] instanceof targetClass)) {
        console.info(`Upgrading ${key} to class...`);
        sv[key] = setup.rebuildClassObject<any>(targetClass, sv[key]);
      }
    }

    // Same as above but for objects that reside in maps (e.g. values inside `setup.unit`)
    let to_convert_list = {
      unit: setup.Unit,
      bedchamber: setup.Bedchamber,
      contact: setup.Contact,
      equipmentset: setup.EquipmentSet,
      opportunityinstance: setup.OpportunityInstance,
      questinstance: setup.QuestInstance,
      slaveorder: setup.SlaveOrder,
      buildinginstance: setup.BuildingInstance,
      company: setup.Company,
      fort: setup.Fort,
      team: setup.Team,
    };
    for (const [key, targetClass] of objectEntries(to_convert)) {
      if (key in sv) {
        for (let objkey in sv[key]) {
          if (!(sv[key][objkey] instanceof targetClass)) {
            console.info(`Upgrading ${key} ${objkey} to class...`);
            sv[key][objkey] = setup.rebuildClassObject<any>(
              targetClass,
              sv[key][objkey],
            );
          }
        }
      }
    }
  }

  export function getSaveAsText() {
    const saveObj = {
      id: Config.saves.id,
      state: State.marshalForSave(),
      version: null,
    } as SaveObject;

    if (Config.saves.version) {
      saveObj.version = Config.saves.version;
    }

    SaveGlobalFunctions.onSave(saveObj);

    // Delta encode the state history and delete the non-encoded property.
    saveObj.state.delta = State.deltaEncode(saveObj.state.history);
    delete (saveObj.state as any).history;

    return JSON.stringify(saveObj);
  }

  export function importSaveFromText(text: string) {
    try {
      const saveObj = JSON.parse(text) as SaveObject;
      if (
        !saveObj ||
        !saveObj.hasOwnProperty("id") ||
        !saveObj.hasOwnProperty("state")
      ) {
        throw new Error(L10n.get("errorSaveMissingData"));
      }

      // Delta decode the state history and delete the encoded property.
      saveObj.state.history = State.deltaDecode(saveObj.state.delta);
      delete saveObj.state.delta;

      SaveGlobalFunctions.onLoad(saveObj);

      if (saveObj.id !== Config.saves.id) {
        throw new Error(L10n.get("errorSaveIdMismatch"));
      }

      // Restore the state.
      State.unmarshalForSave(saveObj.state); // may also throw exceptions

      // Show the active moment.
      Engine.show();
    } catch (ex) {
      const message =
        ex instanceof Error ? ex.message.toUpperFirst() : String(ex);

      UI.alert(`${message}.</p><p>${L10n.get("aborting")}.`);

      return false;
    }
    return true;
  }
}

export namespace SaveGlobalFunctions {
  /**
   * Called just before the save data is saved
   * Save fix so that latest variables are saved upon save
   */
  export function onSave(save: SaveObject, details?: SaveDetails) {
    if (State.passage == "MainLoop" || State.variables.qDevTool) {
      save.state.history[save.state.index].variables = setup.deepCopy(
        State.variables,
      );
    }

    if (!State.variables.qDevTool) {
      for (let i = 0; i < save.state.history.length; ++i) {
        if (i != save.state.index) {
          save.state.history[i].variables = {};
        }
      }
    }

    for (let i = 0; i < save.state.history.length; ++i) {
      // discard caches
      if (save.state.history[i].variables.cache) {
        save.state.history[i].variables.cache.clearAll();
      }

      // discard tile information
      if (save.state.history[i].variables.roomlist) {
        save.state.history[i].variables.roomlist.resetCache();
      }
      if (save.state.history[i].variables.fortgrid) {
        save.state.history[i].variables.fortgrid.resetCache();
      }
      if (save.state.history[i].variables.roomlist) {
        save.state.history[i].variables.roomlist.resetCache();
      }
    }
  }

  export function onLoad(save: SaveObject) {
    let sv = save.state.history[save.state.index].variables;
    if (!sv.qDevTool) {
    } else {
      if ("dtquest" in sv) {
        let dt = sv.dtquest;
        if (dt.TYPE == "quest") {
          setup.questtemplate[dt.key as QuestTemplateKey] = dt;
        } else if (dt.TYPE == "opportunity") {
          setup.opportunitytemplate[dt.key as OpportunityTemplateKey] = dt;
        } else if (dt.TYPE == "event") {
          setup.event[dt.key as EventTemplateKey] = dt;
        } else if (dt.TYPE == "interaction") {
          setup.interaction[dt.key as InteractionTemplateKey] = dt;
        } else if (dt.TYPE == "activity") {
          setup.activitytemplate[dt.key as ActivityTemplateKey] = dt;
        }
      }

      if ("qcustomtitle" in sv) {
        // reload them if necessary
        let qct = sv.qcustomtitle;
        for (let i = 0; i < qct.length; ++i) {
          let custom = qct[i];
          if (!(custom.key in setup.title)) {
            new setup.Title(
              custom.key,
              custom.name,
              custom.description,
              custom.unit_text,
              custom.slave_value,
              custom.skill_adds,
            );
          }
        }
      }
      if ("qcustomunitgroup" in sv) {
        let qcu = sv.qcustomunitgroup;
        for (let i = 0; i < qcu.length; ++i) {
          let custom = qcu[i];
          new setup.UnitGroup(
            custom.key,
            custom.name,
            custom.getUnitPools(),
            custom.reuse_chance,
            custom.unit_post_process,
          );
        }
      }
    }

    BackwardsCompat.upgradeSave(sv); // apply backwards compat fixes
  }

  export function rebuildClassObject<T>(
    classobj: { new (): T },
    arglist: {},
  ): T {
    const obj = Object.create(classobj.prototype);
    Object.assign(obj, arglist);
    return obj;
  }

  export function deserializeClass(
    classname: string,
    arglist: any,
    container?: string,
  ) {
    // if (classname == "ClassThatDoesNotExistAnymore") classname = "NewClass"
    let class_container = setup as any;
    if (container) {
      const sep = container.split(".");
      if (sep[0] != "setup")
        throw new Error(`Cannot deserialize non setup object: ${container}`);
      for (let i = 1; i < sep.length; ++i) {
        class_container = class_container[sep[i]];
      }
    }
    return setup.rebuildClassObject(class_container[classname], arglist);
  }

  export function toJsonHelper(classname: string, obj: {}, container?: string) {
    let dataobj = { ...obj };
    if (!container) {
      return Serial.createReviver(`_DE("${classname}", $ReviveData$)`, dataobj);
    } else {
      return Serial.createReviver(
        `_DE("${classname}", $ReviveData$, "${container}")`,
        dataobj,
      );
    }
  }

  export function deleteEndOfWeekCaches() {
    delete setup.gFortGridControl;
    State.variables.fortgrid.resetCache();
  }
}

// Register the onSave/onLoad listeners to sugarcube
Save.onSave.add(SaveGlobalFunctions.onSave);
Save.onLoad.add(SaveGlobalFunctions.onLoad);

// Set description used by Saves, for all passages,
// to give some decent information about game state.
Config.saves.descriptions = function (saveType) {
  const sv = State.variables;
  if (sv.devtooltype) {
    // In devtool
    if (sv.devtooltype == "event") {
      return `Dev Tool (event): ${sv.dtquest!.name}`;
    } else if (sv.devtooltype == "quest") {
      return `Dev Tool (quest): ${sv.dtquest!.name}`;
    } else if (sv.devtooltype == "opportunity") {
      return `Dev Tool (opportunity): ${sv.dtquest!.name}`;
    } else if (sv.devtooltype == "interaction") {
      return `Dev Tool (interaction): ${sv.dtquest!.name}`;
    } else if (sv.devtooltype == "activity") {
      return `Dev Tool (activity): ${sv.dtquest!.name}`;
    } else {
      throw new Error(`Unknown dev tool name: ${sv.devtooltype}`);
    }
  } else {
    // Ingame
    return (
      sv.company.player.getName() +
      ", Week " +
      sv.calendar.getWeek() +
      ", " +
      sv.company.player.getMoney() +
      "g"
    );
  }
};
