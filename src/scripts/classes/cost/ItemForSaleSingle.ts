// @ts-nocheck


setup.qcImpl.ItemForSaleSingle = class ItemForSaleSingle extends setup.Cost {
  /**
   * @param {setup.Market | string} market 
   * @param {setup.Item | string} item
   */
  constructor(market, item) {
    super()

    if (!market) throw new Error(`Missing market in itemforsale`)
    if (!item) throw new Error(`Missing item for item for sale in ${market}`)

    this.item_key = setup.keyOrSelf(item)
    this.market_key = setup.keyOrSelf(market)
  }

  /**
   * @param {object} quest 
   */
  apply(quest) {
    let market = this.getMarket()
    let item = setup.item[this.item_key]
    new setup.MarketObject(
      item,
      /* price = */ item.getValue(),
      setup.MARKET_OBJECT_ITEM_EXPIRATION,
      market,
      quest,
    )
  }

  getMarket() { return State.variables.market[this.market_key] }

  /**
   * @param {object} quest 
   */
  explain(quest) {
    const item = setup.item[this.item_key]
    return `${item.rep()} in ${this.getMarket().rep()}`
  }
}
