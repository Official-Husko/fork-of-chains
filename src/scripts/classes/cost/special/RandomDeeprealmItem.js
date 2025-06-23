/**
 * @param {setup.ItemPool} pool 
 * @returns {Function}
 */
function get_item_pool_callback(pool) {
  return () => {
    const company = State.variables.company.kobold.rep()
    let t = [
      `The kobolds has recently found an ancient alchemical lab. They have too many potions now, and sending some of them to your company as gifts.`,
      `Your company's close relations with the kobold has netted you a gift from them in the form of a potion they found underground.`,
      `The kobold's many scavengers have recently found an unlooted ancient warehouse, brimming with supplies. They are gifting some of the potions found within to their closest allies.`,
    ]
    setup.notify(setup.rng.choice(t))
    setup.qc.ItemPool(pool).apply()
  }
}

/**
 * @param {setup.EquipmentPool} pool 
 * @returns {Function}
 */
function get_equipment_pool_callback(pool) {
  return () => {
    const company = State.variables.company.kobold.rep()
    let t = [
      `The kobolds has recently launched an expedition in the Deeprealm. And it was successful. They are celebrating by sending their friends, including you, some of the loots found.`,
      `The relatively brave kobolds of ${company} has recently lauched yet another expedition into the Deeprealms. It was successful, and they are gifting some of the loots to the companies they trust.`,
      `The kobolds of ${company} has recently found an unlooted treasure vault. They found many valuables there, some of them are gifted to you as one of their staunch allies.`,
      `A delegation from the kobolds of ${company} has come to your fort, bringing gifts: Valuables from their many expeditions into the Deeprealm.`,
    ]
    setup.notify(setup.rng.choice(t))
    setup.qc.Equipment(pool).apply()
  }
}

function get_random_trinket_good(value_average) {
  return () => {
    const company = State.variables.company.kobold.rep()
    const value_actual = setup.nudgeMoney(value_average)
    let t = [
      `Your company has received a present from the ${company} in the form of some rare metals they have mined down below. You sell them off for a nice sum of profit.`,
      `The kobolds of ${company} has send you a gift of gold, thanks to your excellent relations with them.`,
      `A group of kobolds has come from the Deeprealm, bringing you valuable trinkets and craftswork as gifts. No doubt thanks to your excellent relations with the ${company}.`,
    ]
    setup.notify(setup.rng.choice(t))
    setup.qc.Money(value_actual).apply()
  }
}

function get_random_trinket_bad(value_average) {
  return () => {
    const company = State.variables.company.kobold.rep()
    const value_actual = setup.nudgeMoney(value_average)
    let t = [
      `The kobolds of ${company} has come bearing "gifts", or so they thought. It was a collection of broken vase, rusted sword, and what appears to be monster droppings. You sold them for a meager sum.`,
      `The kobolds of ${company} has come to visit your fort. Having enjoyed their stay, they left some gifts for you. Most are worthless junk, but some of the metal is sellable, netting you a little bit of money.`,
      `You received a gift from the kobolds of ${company}. A shipment of metal arrived at your fort from the Deeprealm. Unfortunately, most of the metal turns out to be brittle and unusable, and you were only able to sell them for a meager sum.`,
      `A delegation from the ${company} has come to your company. However, the clumsy kobold seems to have accidentally lost most of the gift meant for your company along the way, and only a paltry sum was left.`,
      `A group of kobolds from the ${company} has come visiting your company. Unfortunately, they did not bring any meaningful gifts, just worthless trinkets that you sell off for a meager sum.`,
    ]
    setup.notify(setup.rng.choice(t))
    setup.qc.Money(value_actual).apply()
  }
}

function get_dwarven_axe() {
  const axe = setup.equipment.dwarf_axe

  const company = State.variables.company.kobold.rep()
  let t = [
    `The ${company} has made an astonishing discovery, excavating one of the ancient dwarven ruins. In a gesture of goodwill, they gifted to you one of their many findings: an astonishingly rare ${axe.rep()}.`,
    `A delegation from ${company} has come bearing an incredibly valuable gift: ${axe.rep()}, proof that they have placed great trust in your company.`,
    `The kobolds of ${company} have once again come bearing gifts. But instead of the usual junk, this time they come bearing the ${axe.rep()}. It is an incredibly rare find, speaking volume of just how much the kobolds have grown to trust your company.`,
  ]
  setup.notify(setup.rng.choice(t))

  setup.qc.EquipmentDirect(axe).apply()
}

function get_nothing() {
}

/**
 * Gain a random deeprealm loot
 */
setup.qcImpl.RandomDeeprealmItem = class RandomDeeprealmItem extends setup.Cost {
  /**
   * @param {number} value
   */
  constructor(value) {
    super()
    this.value = value
    if (value < 500) {
      throw new Error(`Minimum value for random deeprealm item is 500g, but received ${value} instead`)
    }
  }

  text() {
    return `setup.qc.RandomDeeprealmItem(${this.value})`
  }

  /**
   * @param {any} quest 
   */
  apply(quest) {
    /**
     * @type {Array<[*, number]>}
     */
    const pools = []
    /**
     * @type {Array<[number, number]>}
     */
    const avg = []
    if (this.value < 1000) {
      pools.push([
        get_item_pool_callback(setup.itempool.all_normal), 1.0
      ])
      avg.push([
        setup.itempool.all_normal.getAverageValue(), 1.0
      ])
    } else {
      pools.push([
        get_item_pool_callback(setup.itempool.all), 1.0
      ])
      avg.push([
        setup.itempool.all.getAverageValue(), 1.0
      ])
    }

    const axe = setup.equipment.dwarf_axe
    if (this.value >= 1500) {
      pools.push([
        get_dwarven_axe, 0.4
      ])
      avg.push([
        axe.getValue(), 0.4
      ])
    } else if (this.value >= 1000) {
      pools.push([
        get_dwarven_axe, 0.01
      ])
      avg.push([
        axe.getValue(), 0.01
      ])
    }

    pools.push(
      [get_item_pool_callback(setup.itempool.furniture_normal), 1.0],
      [get_equipment_pool_callback(setup.equipmentpool.all_combat), 1.0],
      [get_equipment_pool_callback(setup.equipmentpool.all_sex), 1.0],
      [get_random_trinket_bad(100), 4.0],
      [get_random_trinket_good(this.value * 2 / 3), 2.5],
    )
    avg.push(
      [setup.itempool.furniture_normal.getAverageValue(), 1.0],
      [setup.equipmentpool.all_combat.getAverageValue(), 1.0],
      [setup.equipmentpool.all_sex.getAverageValue(), 1.0],
      [100, 4.0],
      [this.value * 2 / 3, 2.5],
    )

    setup.rng.normalizeChanceArray(pools)
    setup.rng.normalizeChanceArray(avg)
    let average_value = 0.0
    for (const [value, chance] of avg) {
      average_value += value * chance
    }
    const z = Math.max(0, average_value / this.value - 1.0)
    pools.push(
      [get_nothing, z]
    )

    const sampled = setup.rng.sampleArray(pools, /* normalize = */ true)
    return sampled()
  }

  /**
   * @param {*} quest 
   */
  explain(quest) {
    return `Sometimes gain a random deeprealm item. Average weekly value: ${this.value}`
  }
}
