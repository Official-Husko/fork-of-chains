// @ts-nocheck


setup.Market = class Market extends setup.TwineClass {
  constructor(key, name, varname, setupvarname) {
    super()
    this.key = key
    this.name = name
    this.varname = varname
    this.setupvarname = setupvarname

    if (varname) {
      if (!(varname in State.variables)) throw new Error(`Incorrect varname ${varname} for ${key}`)
    } else if (setupvarname) {
      if (!(setupvarname in setup)) throw new Error(`Incorrect setup varname ${setupvarname} for ${key}`)
    } else {
      throw new Error(`No varname or setupvarname for ${key}`)
    }
    if (varname && setupvarname) throw new Error(`${key} cannot have both varname and setupvarname`)

    this.market_objects = []

    if (this.key in State.variables.market) throw new Error(`Market ${this.key} duplicated`)
    State.variables.market[this.key] = this
  }

  rep() { return this.getName() }

  getName() { return this.name }

  getObject(key) {
    if (this.varname) return State.variables[this.varname][key]
    if (this.setupvarname) return setup[this.setupvarname][key]
    throw new Error(`No varname or setupvarname`)
  }

  /**
   * Returns the market object selling this particular object, if any.
   * @param {any} object 
   * @returns {setup.MarketObject}
   */
  getMarketObject(object) {
    for (const market_object of this.getMarketObjects()) {
      if (market_object.getObject() == object) return market_object
    }
    return null
  }

  /**
   * @returns {Array<setup.MarketObject>}
   */
  getMarketObjects() { return this.market_objects }

  /**
   * @returns {number}
   */
  countMarketObjects() { return this.market_objects.length }

  advanceWeek() {
    let objects = this.getMarketObjects()
    let to_remove = []
    for (let i = 0; i < objects.length; ++i) {
      let object = objects[i]
      object.advanceWeek()
      if (object.isExpired()) {
        to_remove.push(object)
      }
    }
    for (let i = 0; i < to_remove.length; ++i) {
      let to_remove_obj = to_remove[i]
      this.removeObjectAndCheckDelete(to_remove_obj)
    }
  }

  removeObjectAndCheckDelete(to_remove_obj) {
    this.removeObject(to_remove_obj)
    let trueobj = to_remove_obj.getObject()
    if ('checkDelete' in trueobj) {
      // removed from market eh? check delete.
      trueobj.checkDelete()
    }
  }

  addObject(market_object) {
    // statistics first
    if (this == State.variables.market.slavermarket) {
      State.variables.statistics.add('slavers_offered', 1)
    } else if (this == State.variables.market.slavemarket) {
      State.variables.statistics.add('slaves_offered', 1)
    } else if (this == State.variables.market.itemmarket) {
      State.variables.statistics.add('items_offered', 1)
    } else if (this == State.variables.market.equipmentmarket) {
      State.variables.statistics.add('equipment_offered', 1)
    } else if (this == State.variables.market.equipmentmarket) {
      State.variables.statistics.add('equipment_offered', 1)
    }

    // do actual add object
    if (market_object.market_key) throw new Error(`Item ${market_object} already in a market`)
    market_object.setMarket(this)
    this.market_objects.unshift(market_object)
  }

  removeObject(market_object) {
    if (!this.market_objects.includes(market_object)) throw new Error(`object ${market_object}$ not in market ${this.key}`)
    this.market_objects = this.market_objects.filter(item => item != market_object)
    market_object.setMarket(null)
  }

  isCanBuyObjectOther(market_object) {
    // Can override this for other checks
    return true
  }

  /**
   * @param {setup.MarketObject} market_object 
   * @returns {boolean}
   */
  isCanBuyObject(market_object) {
    if (market_object.getPrice() && State.variables.company.player.getMoney() < market_object.getPrice()) return false
    return this.isCanBuyObjectOther()
  }

  doAddObject(market_object) {
    // market_object is bought. Add to inventory / add to units, etc, depends on market.
    throw new Error(`Implement`)
  }

  buyObject(market_object) {
    // statistic first
    if (this == State.variables.market.itemmarket) {
      State.variables.statistics.add('items_bought', 1)
    } else if (this == State.variables.market.equipmentmarket) {
      State.variables.statistics.add('equipment_bought', 1)
    } else if (this == State.variables.market.equipmentmarket) {
      State.variables.statistics.add('equipment_bought', 1)
    }

    // do actual buy object
    State.variables.company.player.substractMoney(market_object.getPrice())

    if (!market_object.isInfinite()) {
      this.removeObject(market_object)
    }

    this.doAddObject(market_object)

    // setup.notify(`Got ${market_object.rep()}`)
  }

}
