import type { RoomInstance } from "../classes/room/RoomInstance";
import { SETTINGS_GENDER_PREFERENCE } from "../classes/Settings";
import { initNewGamePlus } from "../dom/menu/newgameplus";
import type { StateVariables } from "../types/state-variables";

function isOlderThan(a: number[], b: number[]) {
  for (let i = 0; i < Math.min(a.length, b.length); ++i) {
    if (a[i] < b[i]) return true;
    else if (a[i] > b[i]) return false;
  }
  return a.length != b.length ? a.length < b.length : false;
}

export namespace BackwardsCompat {
  export function upgradeSave(sv: Partial<StateVariables>) {
    if (!sv.gVersion) return;

    const saveVersionStr = Array.isArray(sv.gVersion)
      ? sv.gVersion.join(".")
      : sv.gVersion;
    const saveVersion = saveVersionStr.split(".").map((a) => +a);

    const currentVersionStr = setup.VERSION;
    const currentVersion = currentVersionStr.split(".").map((a) => +a);

    if (isOlderThan(saveVersion, [1, 6, 1, 0])) {
      alert(
        "Save files from before version 1.6.1.0 is not compatible with version 1.6.1.0+. The game will now attempt to convert into New Game Plus, but this is not always successful",
      );
      sv.gNewGamePlusBackwardsCompat = true;
      sv.gUpdatePostProcess = true;
      sv.gVersion = currentVersionStr;
      return;
    }

    if (saveVersionStr !== currentVersionStr) {
      if (isOlderThan(currentVersion, saveVersion)) {
        alert(
          "The loaded save file is from a newer game version, some things may break...",
        );
        sv.gVersion = currentVersionStr;
        return;
      }

      console.info(`Updating from ${saveVersionStr}...`);
      setup.notify(
        `Updating your save from ${saveVersionStr} to ${currentVersionStr}...`,
      );

      /* Trait-related */
      const removed_traits = [
        "training_edging_basic",
        "training_edging_advanced",
        "training_edging_master",
      ];
      for (const unit of Object.values(sv.unit || {})) {
        for (const removed of removed_traits) {
          if (removed in unit.trait_key_map) {
            console.info(`Removing ${removed} from ${unit.key}`);
            delete (unit.trait_key_map as any)[removed];
          }
        }
      }

      /* v1.6.4 */
      {
        if (!("activityinstance" in sv)) {
          sv.activityinstance = {};
          sv.ActivityInstance_keygen = 1;
          sv.activitylist = new setup.ActivityList();
        }
      }

      /* v1.6.4.0 */
      if (sv.fort && !sv.fort.player.ignored_building_template_key) {
        console.info(`Adding ignored building template key`);
        sv.fort.player.ignored_building_template_key = {};
      }

      /* v1.5 */
      /*
      for (const unit of Object.values(sv.unit || {})) {
        for (const trait_key in trait_renames) {
          if (trait_key in unit.trait_key_map) {
            console.info(`Replacing ${trait_key} with ${trait_renames[trait_key]} from unit ${unit.getName()}...`)
            delete unit.trait_key_map[trait_key]
            unit.trait_key_map[trait_renames[trait_key]] = true
          }
        }
      }
      */

      // remove obsolete duties v1.6.5.0
      const obsolete_duties = [
        "diningpimp",
        "scenerypimp",
        "petpimp",
        "fuckholepimp",
        "serverslave",
      ];
      if (sv.duty) {
        for (const obsolete_duty of obsolete_duties) {
          const to_remove = Object.values(sv.duty).filter(
            (duty) => duty.template_key == obsolete_duty,
          );
          if (to_remove.length) {
            console.info(`Removing obsolete duty ${obsolete_duty}`);
            // remove the unit, then remove the duty
            for (const duty of to_remove) {
              const unit_key = duty.unit_key;
              if (unit_key) {
                sv.unit![unit_key].duty_key = undefined;
              }
              delete sv.duty[duty.key];
              sv.dutylist!.duty_keys = sv.dutylist!.duty_keys.filter(
                (duty_key) => duty_key != duty.key,
              );
            }
          }
        }
      }

      /* removed buildings. V1.6.5.0 */
      const removed_buildings = [
        "recreationwingpet",
        "recreationwingscenery",
        "recreationwingfuckholes",
        "recreationwingdining",
        "bar",
        "edgingtrainingroom",
        "grandhall",
      ];
      if (sv.fort) {
        for (const rm of removed_buildings) {
          delete (sv.fort.player.template_key_to_building_key as any)[rm];
          for (const b of Object.values(sv.buildinginstance!)) {
            if (b.template_key == rm) {
              console.info(`removing building ${rm}`);
              sv.fort!.player.building_keys =
                sv.fort!.player.building_keys.filter((a) => a != b.key);
              delete sv.buildinginstance![b.key];
            }
          }
        }
      }

      /* removed rooms. V1.6.5.0 */
      const removed_rooms = [
        "recreationwingdining",
        "recreationwingfuckholes",
        "recreationwingpet",
        "recreationwingscenery",
        "bar",
        "edgingtrainingroom",
        "grandhall",
      ];
      if (sv.roominstance) {
        for (const key of objectKeys(sv.roominstance)) {
          const inst: RoomInstance = sv.roominstance[key];
          if (removed_rooms.includes(inst.template_key)) {
            console.info(`Removing room ${inst.template_key}...`);
            delete sv.roominstance[key];
          }
        }
      }

      /* last obtained negative title. v1.6.5.9 */
      if (sv.titlelist && !sv.titlelist.last_obtained_negative) {
        sv.titlelist.last_obtained_negative = {};
      }

      /* image need reset v1.6.2 */
      //if (!sv.unitimage!.image_need_reset) {
      //  sv.unitimage!.image_need_reset = {};
      //}

      //if (
      //  isOlderThan(
      //    saveVersion.map((a) => +a),
      //    [1, 6, 3, 12],
      //  )
      //) {
      //  if (!setup.globalsettings.disabledefaultimagepack) {
      //    setup.globalsettings.imagepacks = (
      //      setup.globalsettings.imagepacks || []
      //    ).concat(setup.UnitImage.DEFAULT_IMAGE_PACKS[0]);
      //  }
      //}

      ////////////////////////////////////////////////////////////////////////////////
      //
      //  Fort of Chains 2.0.0
      //
      ////////////////////////////////////////////////////////////////////////////////

      // Upgrade gender preferences
      if (typeof sv.settings!.other_gender_preference === "string") {
        const P = SETTINGS_GENDER_PREFERENCE;
        type K = keyof typeof SETTINGS_GENDER_PREFERENCE;

        sv.settings!.other_gender_preference = {
          ...P[sv.settings!.other_gender_preference as unknown as K].chances,
        };
        sv.settings!.gender_preference.slave = {
          ...P[sv.settings!.gender_preference.slave as unknown as K].chances,
        };
        sv.settings!.gender_preference.slaver = {
          ...P[sv.settings!.gender_preference.slaver as unknown as K].chances,
        };
      }

      // Cleanup unnecessary fields
      delete (sv as any).gFortGridControl;
      if (sv.fortgrid) {
        delete (sv.fortgrid as any).cached_tiles;
        delete (sv.fortgrid as any).is_paths_computed;
      }
      for (const inst of Object.values(sv.equipmentset ?? {})) {
        if (Object.hasOwn(inst, "is_default")) {
          delete (inst as any).is_default;
        }
      }
      for (const inst of Object.values(sv.buildinginstance ?? {})) {
        delete (inst as any).fort_key;
      }
      for (const company of Object.values(sv.company ?? {})) {
        company.name ||= undefined;
        if (!company.unit_keys?.length) company.unit_keys = undefined;
        if (!company.team_keys?.length) company.team_keys = undefined;
        if (!company.quest_keys?.length) company.quest_keys = undefined;
        if (!Object.keys(company.ignored_quest_template_keys ?? {}).length)
          company.ignored_quest_template_keys = undefined;
      }
      for (const duty of Object.values(sv.duty ?? {})) {
        duty.unit_key ||= undefined;
        duty.is_specialist_enabled ||= undefined;
        duty.is_can_go_on_quests_auto ||= undefined;
      }
      if ("unit_image_map" in sv.unitimage!) {
        for (const [k, v] of Object.entries(
          (sv.unitimage as any).unit_image_map ?? {},
        )) {
          const unit = sv.unit![k as UnitKey];
          if (v && unit) {
            unit.image = v as any;
          }
        }
        for (const [k, v] of Object.entries(
          (sv.unitimage as any).image_need_reset ?? {},
        )) {
          const unit = sv.unit![k as UnitKey];
          if (v && unit) {
            unit.image_need_reset = true;
          }
        }
        delete (sv.unitimage as any).unit_image_map;
        delete (sv.unitimage as any).image_need_reset;
      }
      for (const k of objectKeys(sv.statistics!.acquired_item_keys)) {
        sv.statistics!.acquired_item_keys[k] = 1;
      }
      for (const k of objectKeys(sv.statistics!.alchemist_item_keys)) {
        sv.statistics!.alchemist_item_keys[k] = 1;
      }
      for (const room of Object.values(sv.roominstance ?? {})) {
        delete (room as any).owner_keys;
        delete (room as any).cached_skill_bonuses;
        room.location ||= undefined;
        room.clockwise_rotations ||= undefined;
      }
      for (const unit of Object.values(sv.unit!)) {
        delete unit.debug_generator_type;
        delete unit.debug_generator_key;
        if ((unit as any).is_speech_reset) {
          unit.speech_key = undefined;
        }
        delete (unit as any).is_speech_reset;
        if (Object.hasOwn(unit, "name")) {
          delete (unit as any).name;
        }
        if (!unit.tags?.length) unit.tags = undefined;
        if (!unit.history?.length) unit.history = undefined;
        if (!unit.perk_keys_choices?.length) unit.perk_keys_choices = undefined;
        if (!unit.skill_focus_keys?.length) unit.skill_focus_keys = undefined;
        if (!unit.nickname || unit.nickname === unit.first_name)
          unit.nickname = undefined;
        unit.custom_image_name ||= undefined;
        unit.origin ||= undefined;
        unit.team_key ||= undefined;
        unit.party_key ||= undefined;
        unit.company_key ||= undefined;
        unit.unit_group_key ||= undefined;
        unit.duty_key ||= undefined;
        unit.contact_key ||= undefined;
        unit.quest_key ||= undefined;
        unit.opportunity_key ||= undefined;
        unit.market_key ||= undefined;
        unit.equipment_set_key ||= undefined;
        for (const k of objectKeys(unit.trait_key_map)) {
          unit.trait_key_map[k] = 1;
        }
        for (const k of objectKeys(unit.innate_trait_key_map)) {
          unit.innate_trait_key_map[k] = 1;
        }
      }

      ////////////////////////////
      // Finish up
      ////////////////////////////

      sv.cache!.clearAll();

      /* Reset decks, starting from v1.3.3.13 */
      sv.deck = {};

      sv.gVersion = currentVersionStr;
      sv.gUpdatePostProcess = true;

      setup.notify(`Update complete.`);
      console.info(`Updated. Now ${sv.gVersion}`);
    }
  }
}

/**
 * Update saves. This is called when State.variables is already set.
 */
export function updatePostProcess() {
  console.info("post-processing after upgrade...");

  if (State.variables.gNewGamePlusBackwardsCompat) {
    initNewGamePlus(
      true,
      State.variables.company.player
        .getUnits({ job: setup.job.slaver })
        .filter((unit) => !unit.isYou()),
    );
    return;
  }

  if (!State.variables.gUpdatePostProcess)
    throw new Error("Post process called mistakenly");

  /* equipment market. v1.7.1 */
  if (
    State.variables.market &&
    !("equipmentmarket" in State.variables.market)
  ) {
    console.info(`Creating equipment market`);
    new setup.MarketEquipment("equipmentmarket", "Market (Equipment)");
  }

  // Init missing companies v1.6.5.0
  {
    for (const template of Object.values(setup.companytemplate)) {
      if (
        !Object.values(State.variables.company).filter(
          (company) => company.template_key == template.key,
        ).length
      ) {
        console.info(`Creating new company: ${template.key}`);
        new setup.Company(template.key, template);
      }
    }
  }

  /* Add actors to quests whose actors change */
  {
    for (const quest_instance of Object.values(State.variables.questinstance)) {
      for (const actor_key in quest_instance
        .getTemplate()
        .getActorUnitGroups()) {
        if (!quest_instance.getActorUnit(actor_key)) {
          console.info(
            `Adding actor ${actor_key} to existing quest ${quest_instance.getName()}`,
          );
          quest_instance.actor_unit_key_map[actor_key] =
            setup.generateAnyUnit().key;
        }
      }
    }
  }

  // remove obsolete buildings v1.5.5.7
  /*
  const obsolete_buildings = [
  ]
  for (const building of Object.values(State.variables.buildinginstance)) {
    if (obsolete_buildings.includes(building.template_key)) {
      console.info(`Removing obsolete building ${building.template_key}...`)
      State.variables.fort.player.remove(building)
    }
  }
  */

  // add missing duties v1.5.9.3
  /*
  const missing_duty = {
    'recreationwing': 'entertainmentpimp',
  }

  for (const improve_key in missing_duty) {
    if (State.variables.fort.player.isHasBuilding(improve_key)) {
      const dutykey = missing_duty[improve_key]
      if (!State.variables.dutylist.isHasDuty(dutykey)) {
        console.info(`Adding missing duty ${dutykey}`)
        setup.qc.Duty(dutykey).apply()
      }
    }
  }
  */

  /*
  // remove obsolete contacts v1.5.5.7
  const obsolete_contacts = [
    'combatpeddler',
    'petpeddler',
    'ponypeddler',
  ]

  // special case: remove contacts if missing certain buildings
  const missing_building_to_contact = {
    workshop: [
      'blacksmithpeddler',
      'tailorpeddler',
      'weaverpeddler',
    ],
    booths: [
      'furniturepeddler',
      'itempeddler',
    ],
  }

  for (const building_key in missing_building_to_contact) {
    if (!State.variables.fort.player.isHasBuilding(building_key)) {
      // remove the contacts too
      obsolete_contacts.push(...missing_building_to_contact[building_key])
    }
  }

  for (const contact of Object.values(State.variables.contact)) {
    if (obsolete_contacts.includes(contact.template_key)) {
      console.info(`Removing contact ${contact.template_key}...`)
      State.variables.contactlist.removeContact(contact)
    }
  }

  const add_unit = {
    sexpeddler: 'contact_sexshopowner'
  }
  for (const contact of Object.values(State.variables.contact)) {
    if (contact.template_key in add_unit && !contact.unit_key) {
      console.info(`Adding unit to ${contact.template_key}`)
      setup.qc.ContactLose(contact.template_key).apply()
      setup.qc.Contact(contact.template_key, null, add_unit[contact.template_key]).apply()
    }
  }
  */

  /* De-level buildings */
  /* v1.5.9.4 */
  for (const building of Object.values(State.variables.buildinginstance)) {
    while (
      building.getTemplate() &&
      building.getLevel() > building.getTemplate().getMaxLevel()
    ) {
      console.info(`De-leveling ${building.getTemplate().getName()}`);
      building.downgrade();
    }
  }

  /* Remove intersecting rooms */
  State.variables.fortgrid.removeIntersectingRooms();

  ////////////////////////////
  // Finish up
  ////////////////////////////

  delete State.variables.gUpdatePostProcess;
}
