// @ts-nocheck

setup.qcImpl.ItemForSale = class ItemForSale extends setup.Cost {
  /**
   * @param {setup.Market | string} market 
   * @param {setup.ItemPool | string} item_pool 
   * @param {number} amount 
   * @param {number} [markup]
   */
  constructor(market, item_pool, amount, markup) {
    super()

    if (!market) throw new Error(`Missing market in itemforsale`)
    if (!item_pool) throw new Error(`Missing item pool for item for sale in ${market}`)

    this.item_pool_key = setup.keyOrSelf(item_pool)
    this.market_key = setup.keyOrSelf(market)
    this.markup = markup || 1.0

    if (!amount) {
      this.amount = 1
    } else {
      this.amount = amount
    }
  }

  text() {
    return `setup.qc.ItemForSale('${this.market_key}', '${this.item_pool_key}', ${this.amount}, ${this.markup})`
  }

  apply(quest) {
    let market = this.getMarket()
    let pool = setup.itempool[this.item_pool_key]
    for (let i = 0; i < this.amount; ++i) {
      let item = pool.generateItem()
      new setup.MarketObject(
        item,
        /* price = */ Math.round(item.getValue() * this.markup),
        setup.MARKET_OBJECT_ITEM_EXPIRATION,
        market,
        quest,
      )
    }
  }

  getMarket() { return State.variables.market[this.market_key] }

  explain(quest) {
    return `${this.amount} new items in ${this.getMarket().rep()} at ${this.markup}x price`
  }
}
