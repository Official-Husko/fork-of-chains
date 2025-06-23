
// can also be used as reward. Eg.., Money(-20) as cost, Money(20) as reward.
setup.qcImpl.Slave = class Slave extends setup.Cost {
  constructor(actor_name, origin_text, is_mercenary, price_mult) {
    super()

    this.actor_name = actor_name
    this.origin_text = origin_text
    this.is_mercenary = is_mercenary
    this.price_mult = price_mult
    this.IS_SLAVE = true
  }

  text() {
    let pricemulttext = ''
    if (this.price_mult) pricemulttext = `, ${this.price_mult}`
    return `setup.qc.Slave('${this.actor_name}', "${setup.escapeJsString(this.origin_text)}", ${this.is_mercenary}${pricemulttext})`
  }

  getActorName() { return this.actor_name }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    if (this.origin_text) unit.setOrigin(this.origin_text)
    let value = 0
    if (this.is_mercenary) {
      value = Math.max(unit.getSlaveValue(), setup.SLAVE_VALUE_MARKET_MINIMUM)
      if (this.price_mult) value = Math.round(this.price_mult * value)
    }
    new setup.MarketObject(
      unit,
      value,
      setup.MARKET_OBJECT_SLAVE_EXPIRATION, /* expires in */
      State.variables.market.slavemarket,
      quest,
    )
    if (State.variables.fort.player.isHasBuilding(setup.buildingtemplate.slavepens)) {
      let price_text
      if (value) {
        price_text = ` for ${setup.DOM.toString(setup.DOM.Util.money(value))}`
      } else {
        price_text = ` for ${setup.DOM.toString(setup.DOM.Text.successlite('free'))}`
      }
      setup.notify(`${setup.DOM.toString(setup.DOM.Text.successlite('New slave'))} available: a|rep ${price_text}.`, { a: unit })
    } else {
      setup.notify(`You ${setup.DOM.toString(setup.DOM.Text.danger('lack'))} the ${setup.buildingtemplate.slavepens.rep()} to hold your new slave. Consider building the improvement soon.`)
    }
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    let textbase = 'free slave'
    if (this.is_mercenary) textbase = `PAID slave${this.price_mult ? ` (${this.price_mult}x price)` : ``}`
    return `${textbase}: ${this.actor_name} with origin: ${this.origin_text}`
  }
}
