// @ts-nocheck


import { initNewGamePlus } from "../dom/menu/newgameplus"

/**
 * @param {number[]} a
 * @param {number[]} b
 */
function isOlderThan(a, b) {
  for (let i = 0; i < Math.min(a.length, b.length); ++i) {
    if (a[i] < b[i])
      return true
    else if (a[i] > b[i])
      return false
  }
  return a.length != b.length ? a.length < b.length : false
}


setup.BackwardsCompat = {}

setup.BackwardsCompat.upgradeSave = function (sv) {
  if (!sv.gVersion)
    return

  const saveVersionStr = Array.isArray(sv.gVersion) ? sv.gVersion.join('.') : sv.gVersion
  const saveVersion = saveVersionStr.split('.').map(a => +a)

  const currentVersionStr = setup.VERSION
  const currentVersion = currentVersionStr.split('.').map(a => +a)

  if (isOlderThan(saveVersion, [1, 6, 1, 0])) {
    alert('Save files from before version 1.6.1.0 is not compatible with version 1.6.1.0+. The game will now attempt to convert into New Game Plus, but this is not always successful')
    // @ts-ignore
    sv.gNewGamePlusBackwardsCompat = true
    sv.gUpdatePostProcess = true
    sv.gVersion = currentVersionStr
    return
  }

  if (saveVersionStr !== currentVersionStr) {
    if (isOlderThan(currentVersion, saveVersion)) {
      alert('The loaded save file is from a newer game version, some things may break...')
      sv.gVersion = currentVersionStr
      return
    }

    console.log(`Updating from ${saveVersionStr}...`)
    setup.notify(`Updating your save from ${saveVersionStr} to ${currentVersionStr}...`)

    /* Trait-related */
    const removed_traits = [
      'training_edging_basic',
      'training_edging_advanced',
      'training_edging_master',
    ]
    for (const unit of Object.values(sv.unit || {})) {
      for (const removed of removed_traits) {
        if (removed in unit.trait_key_map) {
          console.log(`Removing ${removed} from ${unit.key}`)
          delete unit.trait_key_map[removed]
        }
      }
    }

    /* v1.6.4 */
    {
      if (!('activityinstance' in sv)) {
        sv.activityinstance = {}
        sv.ActivityInstance_keygen = 1
        sv.activitylist = new setup.ActivityList()
      }
    }

    /* v1.6.4.0 */
    if (!sv.fort.player.ignored_building_template_key) {
      console.log(`Adding ignored building template key`)
      sv.fort.player.ignored_building_template_key = {}
    }

    /* v1.5 */
    /*
    for (const unit of Object.values(sv.unit || {})) {
      for (const trait_key in trait_renames) {
        if (trait_key in unit.trait_key_map) {
          console.log(`Replacing ${trait_key} with ${trait_renames[trait_key]} from unit ${unit.getName()}...`)
          delete unit.trait_key_map[trait_key]
          unit.trait_key_map[trait_renames[trait_key]] = true
        }
      }
    }
    */

    // remove obsolete duties v1.6.5.0
    const obsolete_duties = [
      'diningpimp',
      'scenerypimp',
      'petpimp',
      'fuckholepimp',
      'serverslave',
    ]
    for (const obsolete_duty of obsolete_duties) {
      const to_remove = Object.values(sv.duty).filter(duty => duty.template_key == obsolete_duty)
      if (to_remove.length) {
        console.log(`Removing obsolete duty ${obsolete_duty}`)
        // remove the unit, then remove the duty
        for (const duty of to_remove) {
          const unit_key = duty.unit_key
          if (unit_key) {
            sv.unit[unit_key].duty_key = null
          }
          delete sv.duty[duty.key]
          sv.dutylist.duty_keys = sv.dutylist.duty_keys.filter(duty_key => duty_key != duty.key)
        }
      }
    }

    /* removed buildings. V1.6.5.0 */
    const removed_buildings = [
      'recreationwingpet',
      'recreationwingscenery',
      'recreationwingfuckholes',
      'recreationwingdining',
      'bar',
      'edgingtrainingroom',
      'grandhall',
    ]
    if ('fort' in sv) {
      for (const rm of removed_buildings) {
        delete sv.fort.player.template_key_to_building_key[rm]
        for (const b of Object.values(sv.buildinginstance)) {
          if (b.template_key == rm) {
            console.log(`removing building ${rm}`)
            sv.fort.player.building_keys = sv.fort.player.building_keys.filter(a => a != b.key)
            delete sv.buildinginstance[b.key]
          }
        }
      }
    }

    /* removed rooms. V1.6.5.0 */
    const removed_rooms = [
      'recreationwingdining',
      'recreationwingfuckholes',
      'recreationwingpet',
      'recreationwingscenery',
      'bar',
      'edgingtrainingroom',
      'grandhall',
    ]
    if (sv.roominstance) {
      for (const key of Object.keys(sv.roominstance)) {
        /**
         * @type {setup.RoomInstance}
         */
        const inst = sv.roominstance[key]
        if (removed_rooms.includes(inst.template_key)) {
          console.log(`Removing room ${inst.template_key}...`)
          delete sv.roominstance[key]
        }
      }
    }

    /* last obtained negative title. v1.6.5.9 */
    if (sv.titlelist && !sv.titlelist.last_obtained_negative) {
      sv.titlelist.last_obtained_negative = {}
    }

    /* image need reset v1.6.2 */
    if (!sv.unitimage.image_need_reset) {
      sv.unitimage.image_need_reset = {}
    }

    if (isOlderThan(saveVersion.map(a => +a), [1, 6, 3, 12])) {
      // @ts-ignore
      if (!setup.globalsettings.disabledefaultimagepack) {
        setup.globalsettings.imagepacks = (setup.globalsettings.imagepacks || []).concat(setup.UnitImage.DEFAULT_IMAGE_PACKS[0])
      }
    }

    sv.cache.clearAll()

    /* Reset decks, starting from v1.3.3.13 */
    sv.deck = {}

    sv.gVersion = currentVersion
    sv.gUpdatePostProcess = true

    setup.notify(`Update complete.`)
    console.log(`Updated. Now ${sv.gVersion}`)

  }
}

/**
 * Update saves. This is called when State.variables is already set.
 */
setup.updatePostProcess = function () {
  console.log('post-processing after upgrade...')

  // @ts-ignore
  if (State.variables.gNewGamePlusBackwardsCompat) {
    initNewGamePlus(true, State.variables.company.player.getUnits({ job: setup.job.slaver }).filter(unit => !unit.isYou()))
    return
  }

  // @ts-ignore
  if (!State.variables.gUpdatePostProcess) throw new Error('Post process called mistakenly')

  /* equipment market. v1.7.1 */
  if (State.variables.market && !('equipmentmarket' in State.variables.market)) {
    console.log(`Creating equipment market`)
    new setup.MarketEquipment('equipmentmarket', 'Market (Equipment)')
  }

  // Init missing companies v1.6.5.0
  {
    for (const template of Object.values(setup.companytemplate)) {
      if (!Object.values(State.variables.company).filter(company => company.template_key == template.key).length) {
        console.log(`Creating new company: ${template.key}`)
        new setup.Company(template.key, template)
      }
    }
  }

  /* Add actors to quests whose actors change */
  {
    for (const quest_instance of Object.values(State.variables.questinstance)) {
      for (const actor_key in quest_instance.getTemplate().getActorUnitGroups()) {
        if (!quest_instance.getActorUnit(actor_key)) {
          console.log(`Adding actor ${actor_key} to existing quest ${quest_instance.getName()}`)
          quest_instance.actor_unit_key_map[actor_key] = setup.generateAnyUnit().key
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
      console.log(`Removing obsolete building ${building.template_key}...`)
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
        console.log(`Adding missing duty ${dutykey}`)
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
      console.log(`Removing contact ${contact.template_key}...`)
      State.variables.contactlist.removeContact(contact)
    }
  }

  const add_unit = {
    sexpeddler: 'contact_sexshopowner'
  }
  for (const contact of Object.values(State.variables.contact)) {
    if (contact.template_key in add_unit && !contact.unit_key) {
      console.log(`Adding unit to ${contact.template_key}`)
      setup.qc.ContactLose(contact.template_key).apply()
      setup.qc.Contact(contact.template_key, null, add_unit[contact.template_key]).apply()
    }
  }
  */

  /* De-level buildings */
  /* v1.5.9.4 */
  for (const building of Object.values(State.variables.buildinginstance)) {
    while (building.getTemplate() && building.getLevel() > building.getTemplate().getMaxLevel()) {
      console.log(`De-leveling ${building.getTemplate().getName()}`)
      building.downgrade()
    }
  }

  /* Remove intersecting rooms */
  State.variables.fortgrid.removeIntersectingRooms()

  // @ts-ignore
  State.variables.gUpdatePostProcess = false
}
