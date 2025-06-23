import { domCardRep } from "../../dom/util/cardnamerep"
import { menuItemAction, menuItemExtras, menuItemText, menuItemTitle } from "../../ui/menu"

setup.BEDCHAMBER_OPTIONS = {
  walk: {
    walk: {
      text: 'can walk freely',
      kindness: 1,
      cruelty: 0,
    },
    crawl: {
      text: 'must crawl on all fours',
      kindness: 0,
      cruelty: 1,
    },
  },
  orgasm: {
    yes: {
      text: 'can reach orgasm',
      kindness: 1,
      cruelty: 0,
    },
    no: {
      text: 'are denied all orgasms',
      kindness: 0,
      cruelty: 1,
    },
  },
  speech: {
    full: {
      text: 'can talk like normal',
      kindness: 1,
      cruelty: 0,
    },
    animal: {
      text: 'can only make animal-like noises',
      kindness: 0,
      cruelty: 1,
    },
    none: {
      text: 'are not allowed to make any humanlike noises',
      kindness: 0,
      cruelty: 0,
    },
  },
  food: {
    normal: {
      text: 'eat normal food',
      kindness: 1,
      cruelty: 0,
    },
    cum: {
      text: 'can only eat food splattered with cum',
      kindness: 0,
      cruelty: 1,
    },
    milk: {
      text: 'can only eat food mixed with humanlike milk',
      kindness: 0,
      cruelty: 1,
    },
  },
  share: {
    yes: {
      text: 'can be used by other slavers',
      kindness: 0,
      cruelty: 0,
    },
    no: {
      text: 'not usable by other slavers',
      kindness: 0,
      cruelty: 0,
    },
  },
}

setup.BEDCHAMBER_OPTION_CHANCES = {
  friendly: {
    walk: {
      walk: 0.9,
      crawl: 0.1,
    },
    orgasm: {
      yes: 0.9,
      no: 0.1,
    },
    speech: {
      full: 0.9,
      animal: 0.05,
      none: 0.05,
    },
    food: {
      normal: 0.9,
      cum: 0.05,
      milk: 0.05,
    },
    share: {
      yes: 0.95,
      no: 0.05,
    },
  },
  bold: {
    walk: {
      walk: 0.5,
      crawl: 0.5,
    },
    orgasm: {
      yes: 0.5,
      no: 0.5,
    },
    speech: {
      full: 0.45,
      animal: 0.05,
      none: 0.5,
    },
    food: {
      normal: 0.8,
      cum: 0.1,
      milk: 0.1,
    },
    share: {
      yes: 0.5,
      no: 0.5,
    },
  },
  cool: {
    walk: {
      walk: 0.5,
      crawl: 0.5,
    },
    orgasm: {
      yes: 0.1,
      no: 0.9,
    },
    speech: {
      full: 0.01,
      animal: 0.09,
      none: 0.9,
    },
    food: {
      normal: 0.9,
      cum: 0.05,
      milk: 0.05,
    },
    share: {
      yes: 0.7,
      no: 0.3,
    },
  },
  witty: {
    walk: {
      walk: 0.3,
      crawl: 0.7,
    },
    orgasm: {
      yes: 0.2,
      no: 0.8,
    },
    speech: {
      full: 0.25,
      animal: 0.7,
      none: 0.05,
    },
    food: {
      normal: 0.35,
      cum: 0.35,
      milk: 0.35,
    },
    share: {
      yes: 0.8,
      no: 0.2,
    },
  },
  debauched: {
    walk: {
      walk: 0.1,
      crawl: 0.9,
    },
    orgasm: {
      yes: 0.1,
      no: 0.9,
    },
    speech: {
      full: 0.1,
      animal: 0.4,
      none: 0.5,
    },
    food: {
      normal: 0.1,
      cum: 0.45,
      milk: 0.45,
    },
    share: {
      yes: 0.6,
      no: 0.4,
    },
  },
}

setup.Bedchamber = class Bedchamber extends setup.TwineClass {
  constructor() {
    super()

    this.key = State.variables.Bedchamber_keygen
    State.variables.Bedchamber_keygen += 1

    this.name = `Bedchamber ${this.key}`

    this.furniture_map = {}
    for (let slot_key in setup.furnitureslot) {
      this.furniture_map[slot_key] = null
    }

    this.option_map = {
      walk: 'walk',
      orgasm: 'yes',
      speech: 'full',
      food: 'normal',
      share: 'yes',
    }

    this.slaver_key = State.variables.unit.player.key

    if (this.key in State.variables.bedchamber) throw new Error(`Bedchamber ${this.key} already exists`)
    State.variables.bedchamber[this.key] = this

    this.duty_keys = []
    for (let i = 0; i < 2; ++i) {
      // @ts-ignore
      const duty = State.variables.dutylist.addDuty(
        new setup.DutyInstanceBedchamberSlave({
          bedchamber: this,
          index: i,
        })
      )
      this.duty_keys.push(duty.key)
    }
  }

  rep() {
    return setup.repMessage(this, 'bedchambercardkey')
  }

  getOptionMap() { return this.option_map }

  getSlaver() {
    if (!(this.slaver_key)) throw new Error(`null slaver key at ${this.key}`)
    return State.variables.unit[this.slaver_key]
  }

  /**
   * @param {setup.Unit} unit 
   */
  setSlaver(unit) {
    if (!unit) throw new Error(`must have unit for set slaver at ${this.key}`)
    const old_slaver = this.getSlaver()
    this.slaver_key = unit.key
    if (unit != State.variables.unit.player) {
      this.autoSetOptions()
    }
    old_slaver.resetCache()
    unit.resetCache()
  }

  /**
   * @returns {setup.DutyInstanceBedchamberSlave[]}
   */
  getDuties() {
    // @ts-ignore
    return this.duty_keys.map(a => State.variables.duty[a])
  }

  getSlaves() {
    let slaves = []
    let duties = this.getDuties()
    for (let i = 0; i < duties.length; ++i) {
      let unit = duties[i].getUnitIfAvailable()
      if (unit) slaves.push(unit)
    }
    return slaves
  }

  getAssignedSlaves() {
    let slaves = []
    let duties = this.getDuties()
    for (let i = 0; i < duties.length; ++i) {
      let unit = duties[i].getAssignedUnit()
      if (unit) slaves.push(unit)
    }
    return slaves
  }

  /**
   * @param {setup.FurnitureSlot} slot 
   * @returns {setup.Furniture | null}
   */
  getFurniture(slot) {
    let item
    let key = this.furniture_map[slot.key]
    if (key) {
      item = setup.item[key]
    } else {
      item = slot.getBasicFurniture()
    }
    return item && (item instanceof setup.Furniture) ? item : undefined
  }

  /**
   * @param {setup.Furniture} furniture 
   * @returns {boolean}
   */
  isHasFurniture(furniture) {
    return this.getFurniture(furniture.getSlot()) == furniture
  }

  /**
   * Auto fill in furniture with best ones. Best is determined by total sum of stat modifiers.
   */
  autoAssignFurniture() {
    /**
     * @type {setup.Furniture[]}
     */
    // @ts-ignore
    const furnitures = State.variables.inventory.getItems().map(item_obj => item_obj.item).filter(
      item => item instanceof setup.Furniture
    )
    for (const slot of Object.values(setup.furnitureslot)) {
      const matches = furnitures.filter(furniture => furniture.getSlot() == slot)
      if (!matches.length) continue
      matches.sort((f1, f2) => {
        const sum1 = f1.getSkillMods().reduce((a, b) => a + b, 0)
        const sum2 = f2.getSkillMods().reduce((a, b) => a + b, 0)
        return sum2 - sum1
      })
      const best_match = matches[0]
      const current = this.getFurniture(slot)
      const current_sum = current.getSkillMods().reduce((a, b) => a + b, 0)
      const best_match_sum = best_match.getSkillMods().reduce((a, b) => a + b, 0)
      if (current_sum < best_match_sum) {
        this.setFurniture(slot, best_match)
      }
    }
  }

  setFurniture(slot, furniture) {
    if (furniture && furniture.getSlot() != slot) throw new Error(`furniture at wrong slot: ${furniture.key} not at ${slot.key}`)
    let existing = this.getFurniture(slot)
    if (!existing.isBasic()) {
      // add it back to the inventory.
      // don't notify
      State.variables.notification.disable()
      State.variables.inventory.addItem(existing)
      State.variables.notification.enable()
    }
    if (furniture) {
      State.variables.notification.disable()
      State.variables.inventory.removeItem(furniture)
      State.variables.notification.enable()
      this.furniture_map[slot.key] = furniture.key
    } else {
      this.furniture_map[slot.key] = null
    }
    this.getSlaver().resetCache()
  }

  getSkillAddition() {
    let additions = Array(setup.skill.length).fill(0)
    for (let slotkey in setup.furnitureslot) {
      let furniture = this.getFurniture(setup.furnitureslot[slotkey])
      let furnitureadd = furniture.getSkillMods()
      for (let i = 0; i < additions.length; ++i) {
        additions[i] += furnitureadd[i]
      }
    }

    let unit = this.getSlaver()
    if (unit) {
      let slaves = this.getSlaves()
      for (let i = 0; i < slaves.length; ++i) {
        let slave = slaves[i]
        let friendship = State.variables.friendship.getFriendship(unit, slave)
        let statgain = 0
        for (let j = 0; j < setup.BEDCHAMBER_SLAVE_SKILL_GAIN.length; ++j) {
          let thres = setup.BEDCHAMBER_SLAVE_SKILL_GAIN[j]
          if (Math.abs(friendship) >= thres) ++statgain
        }
        for (let j = 0; j < additions.length; ++j) {
          additions[j] += statgain
        }
      }
    }

    return additions
  }

  autoSetOptions() {
    // auto set options based on current slaver.
    let slaver = this.getSlaver()
    if (!slaver) throw new Error(`missing slaver??`)
    let speechkey = slaver.getSpeech().key
    if (!(speechkey in setup.BEDCHAMBER_OPTION_CHANCES)) throw new Error(`Missing ${speechkey} in setup bedchamber options chances`)
    let optionobj = setup.BEDCHAMBER_OPTION_CHANCES[speechkey]
    for (let optionkey in optionobj) {
      let chance_obj = optionobj[optionkey]
      this.option_map[optionkey] = setup.rng.sampleObject(chance_obj, /* force_return = */ true)
    }
  }

  getOption(option_name) {
    if (!(option_name in setup.BEDCHAMBER_OPTIONS)) throw new Error(`invalid option for bedchamber: ${option_name}`)
    return this.option_map[option_name]
  }

  getKindness() {
    let kindness = 0
    for (let optionkey in this.option_map) {
      let optionval = this.option_map[optionkey]
      kindness += setup.BEDCHAMBER_OPTIONS[optionkey][optionval].kindness
    }
    return kindness
  }

  getCruelty() {
    let cruelty = 0
    for (let optionkey in this.option_map) {
      let optionval = this.option_map[optionkey]
      cruelty += setup.BEDCHAMBER_OPTIONS[optionkey][optionval].cruelty
    }
    return cruelty
  }

  getName() { return this.name }

  isPrivate() { return this.getOption('share') == 'no' }

  /**
   * Construct the menu for this bedchamber
   * @param {boolean} [show_actions]
   * @returns {Array<JQLite>}
   */
  getMenu(show_actions) {
    const toolbar_items = []

    toolbar_items.push(menuItemTitle({
      text: domCardRep(this),
    }))

    toolbar_items.push(menuItemText({
      text: `${this.getSlaver().rep()}`,
    }))

    if (show_actions) {
      if (State.variables.gPassage != 'BedchamberChangeFurniture') {
        toolbar_items.push(menuItemAction({
          text: `Edit`,
          tooltip: `Add / remove furnitures from this room`,
          callback: () => {
            // @ts-ignore
            State.variables.gBedchamber_key = this.key
            // @ts-ignore
            State.variables.gBedchamberChangeFurnitureReturnPassage = State.variables.gPassage
            setup.DOM.Nav.goto('BedchamberChangeFurniture')
          }
        }))
      }

      toolbar_items.push(menuItemAction({
        text: `Auto-Furnish`,
        tooltip: `Automatically put the best furnitures for this room`,
        callback: () => {
          this.autoAssignFurniture()
          setup.DOM.Nav.goto()
        }
      }))

      toolbar_items.push(menuItemExtras({
        children: [
          menuItemAction({
            text: `Change rules`,
            tooltip: `Change the slave rules of your bedroom, which may change whether the slaves will like you or be afraid of you.`,
            callback: () => {
              // @ts-ignore
              State.variables.gBedchamber_key = this.key
              setup.DOM.Nav.goto('BedchamberOptionsChange')
            },
          }),
          menuItemAction({
            text: `Change owner`,
            tooltip: `Give the room a different slaver owner`,
            callback: () => {
              // @ts-ignore
              State.variables.gBedchamber_key = this.key
              setup.DOM.Nav.goto('BedchamberOwnerChange')
            },
          }),
          menuItemAction({
            text: `Rename`,
            tooltip: `Rename the room`,
            callback: () => {
              // @ts-ignore
              State.variables.gBedchamber_key = this.key
              setup.DOM.Nav.goto('BedchamberRename')
            },
          }),
        ],
      }))
    }

    return toolbar_items
  }

}
