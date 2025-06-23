
setup.MarketItem = class MarketItem extends setup.Market {
  constructor(key, name) {
    super(key, name, /* varname = */ null, /* setupvarname = */ 'item')
  }
  doAddObject(market_object) {
    let item = market_object.getObject()
    State.variables.inventory.addItem(item)
  }

  static advanceWeek() {
    if (State.variables.fort.player.isHasBuilding('alchemistshop')) {
      for (const item of Object.values(setup.item)) {
        if (item.isAvailableInAlchemistShop()) {
          if (
            item.getValue() &&
            State.variables.statistics.isItemAcquired(item) &&
            !State.variables.statistics.isItemInAlchemistShop(item)) {
            State.variables.statistics.putInAlchemistShop(item)
            new setup.MarketObject(
              item,
              /* price = */ Math.round(item.getValue() * setup.ITEM_MARKET_ALCHEMIST_POTION_MARKUP),
              setup.INFINITY,
              State.variables.market.itemmarket,
              setup.buildingtemplate.alchemistshop,
            )
          }
        }
      }
    }
  }
}
