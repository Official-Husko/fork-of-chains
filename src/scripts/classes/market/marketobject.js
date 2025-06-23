
setup.MarketObject = class MarketObject extends setup.TwineClass {
  /**
   * @param {any} object 
   * @param {number} price 
   * 
   * Items with setup.INFINITY expiration are considered infinite items that will never run out of stock
   * @param {number} expires_in
   * @param {setup.Market} market 
   * @param {Object | string} source  # what generates this market object?
   */
  constructor(object, price, expires_in, market, source) {
    super()

    this.object_key = object.key
    this.price = price
    if (price === undefined || price === null) {
      throw new Error(`Price for item in market cannot be null or undefined!`)
    }
    this.expires_in = expires_in
    this.market_key = null
    this.origin_market_key = market.key

    /**
     * @type {string | null}
     */
    this.rep_source
    if (source && typeof source === 'object' && 'getName' in source) {
      this.rep_source = source.getName()
    } else if (source && typeof source === 'string') {
      this.rep_source = source
    } else {
      this.rep_source = null
    }

    if (!market.getObject(this.object_key)) throw new Error(`Invalid object`)

    market.addObject(this)
  }

  /**
   * @return {setup.Rarity}
   */
  getRarity() {
    if (this.isInfinite()) {
      return setup.rarity.always
    }
    const object = this.getObject()
    if ('getRarity' in object) {
      return object.getRarity()
    } else {
      return setup.rarity.common
    }
  }

  rep() { return this.getObject().rep() }

  getExpiresIn() { return this.expires_in }

  isInfinite() { return this.expires_in == setup.INFINITY }

  getPrice() { return this.price }

  /**
   * @returns {string}
   */
  repSource() { return this.rep_source || '' }

  advanceWeek() {
    if (this.isInfinite()) return
    this.expires_in -= 1
  }

  isExpired() {
    return (this.expires_in <= 0)
  }

  getOriginMarket() {
    return State.variables.market[this.origin_market_key]
  }

  getObject() {
    let market = this.getOriginMarket()
    if (!market) throw new Error(`${this.object_key} has no market`)
    return market.getObject(this.object_key)
  }

  getName() {
    return this.getObject().getName()
  }

  setMarket(market) {
    let marketkey = null
    if (market) marketkey = market.key

    this.market_key = marketkey

    let this_obj = this.getObject()
    /* cant really do the following check since some are "generic" object that cant be marked. E.g., equipment */
    /*
    if (market) {
      if (this_obj.market_key) throw new Error(`Object ${this_obj.key} already in market`)
    } else {
      if (!(this_obj.market_key)) throw new Error(`Object not in market`)
    }
    */
    this_obj.market_key = marketkey
    if ('resetCache' in this_obj) {
      this_obj.resetCache()
    }
  }

}
