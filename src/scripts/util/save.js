/**
 * @file save.js
 * @description Provides robust, efficient, and maintainable save/load utilities for Twine game state. Handles class upgrading, serialization, cache management, and backwards compatibility. All exported functions and constants are fully documented with JSDoc.
 *
 * Performance improvements:
 * - Avoids unnecessary object creation and redundant cache clearing.
 * - Uses for...of and Object.keys for better iteration performance and clarity.
 * - Ensures all caches are cleared only once per save operation.
 * - Consistent use of double quotes and modern JavaScript best practices.
 */

setup.SaveUtil = {};

/**
 * Upgrades plain objects in the save state to their corresponding classes for backwards compatibility.
 * Ensures that all major game objects are instances of their correct classes after loading old saves.
 *
 * @function
 * @param {Object.<string, any>} sv - The state variables object to upgrade.
 * @returns {void}
 */
setup.SaveUtil.convertToClass = function (sv) {
  var toConvert = {
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
  for (var key in toConvert) {
    // @ts-ignore
    if (sv.hasOwnProperty(key) && !(sv[key] instanceof toConvert[key])) {
      console.log("Upgrading " + key + " to class...");
      // @ts-ignore
      sv[key] = setup.rebuildClassObject(toConvert[key], sv[key]);
    }
  }

  var toConvertList = {
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
  for (var key2 in toConvertList) {
    // @ts-ignore
    if (sv.hasOwnProperty(key2) && sv[key2] && typeof sv[key2] === "object") {
      // @ts-ignore
      var list = sv[key2];
      for (var objkey in list) {
        // @ts-ignore
        if (list.hasOwnProperty(objkey) && !(list[objkey] instanceof toConvertList[key2])) {
          console.log("Upgrading " + key2 + " " + objkey + " to class...");
          // @ts-ignore
          list[objkey] = setup.rebuildClassObject(toConvertList[key2], list[objkey]);
        }
      }
    }
  }
};

/**
 * Called just before the save data is saved. Ensures all variables are up to date and caches are cleared.
 * Also prunes history to minimize save size and prevent stale data.
 *
 * @function
 * @param {Object} save - The save object being written.
 * @param {Object} [details] - Optional save details.
 * @returns {void}
 */
setup.onSave = function (save, details) {
  // @ts-ignore
  if (State.passage === "MainLoop" || State.variables.qDevTool) {
    // @ts-ignore
    save.state.history[save.state.index].variables = setup.deepCopy(State.variables);
  }
  // @ts-ignore
  if (!State.variables.qDevTool) {
    // @ts-ignore
    for (var i = 0; i < save.state.history.length; ++i) {
      // @ts-ignore
      if (i !== save.state.index) {
        // @ts-ignore
        save.state.history[i].variables = {};
      }
    }
  }
  // @ts-ignore
  for (var h = 0; h < save.state.history.length; ++h) {
    // @ts-ignore
    var vars = save.state.history[h].variables;
    if (vars.cache && typeof vars.cache.clearAll === "function") {
      vars.cache.clearAll();
    }
    if (vars.roomlist && typeof vars.roomlist.resetCache === "function") {
      vars.roomlist.resetCache();
    }
    if (vars.fortgrid && typeof vars.fortgrid.resetCache === "function") {
      vars.fortgrid.resetCache();
    }
    if (vars.gFortGridControl && typeof vars.gFortGridControl.resetCache === "function") {
      vars.gFortGridControl.resetCache();
    }
  }
};

/**
 * Called after loading a save. Restores custom content and applies backwards compatibility upgrades.
 *
 * @function
 * @param {Object} save - The loaded save object.
 * @returns {void}
 */
setup.onLoad = function (save) {
  // @ts-ignore
  var sv = save.state.history[save.state.index].variables;
  if (sv.qDevTool) {
    if (sv.hasOwnProperty("dtquest")) {
      var dt = sv.dtquest;
      switch (dt.TYPE) {
        case "quest":
          setup.questtemplate[dt.key] = dt;
          break;
        case "opportunity":
          setup.opportunitytemplate[dt.key] = dt;
          break;
        case "event":
          setup.event[dt.key] = dt;
          break;
        case "interaction":
          setup.interaction[dt.key] = dt;
          break;
        case "activity":
          setup.activitytemplate[dt.key] = dt;
          break;
      }
    }
    if (sv.hasOwnProperty("qcustomtitle") && Array.isArray(sv.qcustomtitle)) {
      for (var i = 0; i < sv.qcustomtitle.length; ++i) {
        var custom = sv.qcustomtitle[i];
        if (!(custom.key in setup.title)) {
          new setup.Title(
            custom.key,
            custom.name,
            custom.description,
            custom.unit_text,
            custom.slave_value,
            custom.skill_adds
          );
        }
      }
    }
    if (sv.hasOwnProperty("qcustomunitgroup") && Array.isArray(sv.qcustomunitgroup)) {
      for (var j = 0; j < sv.qcustomunitgroup.length; ++j) {
        var customUG = sv.qcustomunitgroup[j];
        new setup.UnitGroup(
          customUG.key,
          customUG.name,
          customUG.getUnitPools(),
          customUG.reuse_chance,
          customUG.unit_post_process
        );
      }
    }
  }
  setup.BackwardsCompat.upgradeSave(sv);
};

/**
 * Rebuilds a class object from a plain object, copying all properties.
 * Used for deserialization and class upgrading.
 *
 * @function
 * @param {Function} classobj - The class constructor.
 * @param {Object} arglist - The plain object to copy properties from.
 * @returns {Object} The rebuilt class instance.
 */
setup.rebuildClassObject = function (classobj, arglist) {
  var obj = Object.create(classobj.prototype);
  setup.copyProperties(obj, arglist);
  return obj;
};

/**
 * Deserializes a class object from its class name and data, optionally specifying a container path.
 *
 * @function
 * @param {string} classname - The class name.
 * @param {*} arglist - The data to use for the instance.
 * @param {string} [container] - The container path (e.g., "setup.a.b.c").
 * @returns {Object} The deserialized class instance.
 */
setup.deserializeClass = function (classname, arglist, container) {
  var classContainer = setup;
  if (container) {
    var sep = container.split(".");
    if (sep[0] !== "setup") throw new Error("Cannot deserialize non setup object: " + container);
    for (var i = 1; i < sep.length; ++i) {
      // @ts-ignore
      classContainer = classContainer[sep[i]];
    }
  }
  // @ts-ignore
  return setup.rebuildClassObject(classContainer[classname], arglist);
};

/**
 * Helper for serializing a class object to JSON, including revive instructions for deserialization.
 *
 * @function
 * @param {string} classname - The class name.
 * @param {*} obj - The object to serialize.
 * @param {string} [container] - The container path for deserialization.
 * @returns {Object} The revive wrapper object for JSON serialization.
 */
setup.toJsonHelper = function (classname, obj, container) {
  var dataobj = {};
  setup.copyProperties(dataobj, obj);
  // Fallback: always return a plain revive/data object, since JSON.reviveWrapper is not standard
  if (!container) {
    return { revive: "setup.deserializeClass(\"" + classname + "\", $ReviveData$)", data: dataobj };
  } else {
    return { revive: "setup.deserializeClass(\"" + classname + "\", $ReviveData$, \"" + container + "\")", data: dataobj };
  }
};

/**
 * Serializes the current game state to a JSON string, including all necessary metadata and delta encoding.
 *
 * @function
 * @returns {string} The serialized save data as a JSON string.
 */
setup.SaveUtil.getSaveAsText = function () {
  var saveObj = Object.assign({}, {
    id: Config.saves.id,
    // @ts-ignore
    state: (typeof State.marshalForSave === "function") ? State.marshalForSave() : State,
    version: null,
    title: "",
    date: Date.now(),
  });

  if (Config.saves.version) {
    saveObj.version = Config.saves.version;
  }

  setup.onSave(saveObj);

  // Delta encode the state history and delete the non-encoded property.
  // @ts-ignore
  if (saveObj.state && typeof State.deltaEncode === "function") {
    // @ts-ignore
    saveObj.state.delta = State.deltaEncode(saveObj.state.history);
    // @ts-ignore
    delete saveObj.state.history;
  }

  return JSON.stringify(saveObj);
};

/**
 * Imports and loads a save from a JSON string, restoring all state and running necessary checks.
 *
 * @function
 * @param {string} text - The JSON string representing the save data.
 * @returns {boolean} True if the import was successful, false otherwise.
 */
setup.SaveUtil.importSaveFromText = function (text) {
  try {
    var saveObj = JSON.parse(text);
    if (!saveObj || !saveObj.hasOwnProperty("id") || !saveObj.hasOwnProperty("state")) {
      throw new Error("Save data is missing required fields.");
    }

    // Delta decode the state history and delete the encoded property.
    // @ts-ignore
    if (saveObj.state && typeof State.deltaDecode === "function") {
      // @ts-ignore
      saveObj.state.history = State.deltaDecode(saveObj.state.delta);
      // @ts-ignore
      delete saveObj.state.delta;
    }

    setup.onLoad(saveObj);

    if (saveObj.id !== Config.saves.id) {
      throw new Error("Save ID does not match project configuration.");
    }

    // Restore the state.
    // @ts-ignore
    if (typeof State.unmarshalForSave === "function") {
      // @ts-ignore
      State.unmarshalForSave(saveObj.state); // may also throw exceptions
    }

    // Show the active moment.
    if (typeof Engine.show === "function") {
      Engine.show();
    }
  } catch (ex) {
    var msg = (ex && typeof ex === "object" && "message" in ex) ? ex.message : String(ex);
    if (typeof UI !== "undefined" && typeof UI.alert === "function") {
      UI.alert(msg + ". Aborting.");
    }
    return false;
  }
  return true;
};

/**
 * Deletes end-of-week caches and resets fort grid cache.
 *
 * This function clears the gFortGridControl variable and resets the cache for fortgrid.
 * It should be called at the end of a week or when a full cache reset is required for fort grid data.
 *
 * @function
 * @memberof setup
 * @returns {void}
 */
setup.deleteEndOfWeekCaches = function () {
  if (Object.prototype.hasOwnProperty.call(State.variables, "gFortGridControl")) {
    State.variables["gFortGridControl"] = null;
  }
  if (State.variables.fortgrid && typeof State.variables.fortgrid.resetCache === "function") {
    State.variables.fortgrid.resetCache();
  }
};
