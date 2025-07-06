// @ts-nocheck


setup.qcImpl.Slaver = class Slaver extends setup.Cost {
  constructor(actor_name, origin_text, is_mercenary, price_mult) {
    super()

    // is_mercenary: if true, then the slaver has to be paid to join.

    this.actor_name = actor_name
    this.origin_text = origin_text
    this.is_mercenary = is_mercenary
    this.price_mult = price_mult
    this.IS_SLAVER = true
  }

  text() {
    let pricemulttext = ''
    if (this.price_mult) pricemulttext = `, ${this.price_mult}`
    return `setup.qc.Slaver('${this.actor_name}', "${setup.escapeJsString(this.origin_text)}", ${this.is_mercenary}${pricemulttext})`
  }

  getActorName() { return this.actor_name }

  apply(quest) {
    let unit = quest.getActorUnit(this.actor_name)
    if (!unit) throw new Error(`Missing actor for quest ${quest.key}: ${this.actor_name}`)
    if (this.origin_text) unit.setOrigin(this.origin_text)
    let value = 0
    if (this.is_mercenary) {
      value = unit.getSlaverMarketValue()
      if (this.price_mult) value *= this.price_mult
    }
    new setup.MarketObject(
      unit,
      value,
      setup.MARKET_OBJECT_SLAVER_EXPIRATION, /* expires in */
      State.variables.market.slavermarket,
      quest,
    )
    if (State.variables.fort.player.isHasBuilding(setup.buildingtemplate.prospectshall)) {
      let price_text
      if (value) {
        price_text = ` for ${setup.DOM.toString(setup.DOM.Util.money(value))}`
      } else {
        price_text = ` for ${setup.DOM.toString(setup.DOM.Text.successlite('free'))}`
      }
      setup.notify(`${setup.DOM.toString(setup.DOM.Text.successlite('New slaver'))} available: a|rep ${price_text}.`, { a: unit })
    } else {
      setup.notify(`You ${setup.DOM.toString(setup.DOM.Text.danger('lack'))} the ${setup.buildingtemplate.prospectshall.rep()} to host your new slaver. Consider building the improvement soon.`)
    }
  }

  undoApply(quest) {
    throw new Error(`Can't undo`)
  }

  explain(quest) {
    let base = `gain a slaver: ${this.actor_name} with background ${this.origin_text}`
    if (this.is_mercenary) base += ' who needs to be paid to join'
    if (this.price_mult) base += ` (${this.price_mult}x price)`
    return base
  }
}
