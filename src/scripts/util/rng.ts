// @ts-nocheck


setup.rng = {}

/**
 * @param {Array<[any, number]>} chance_array
 */
setup.rng.normalizeChanceArray = function (chance_array) {
  let sum_chance = 0.0
  for (let i = 0; i < chance_array.length; ++i) {
    sum_chance += chance_array[i][1]
  }
  if (!sum_chance) throw new Error(`Sum of chances must be non zero`)
  for (let i = 0; i < chance_array.length; ++i) {
    chance_array[i][1] /= sum_chance
  }
}

/**
 * @param {Array<[*, number]>} raw_chance_array   [[object, chance]]
 * @param {boolean} [normalize]
 */
setup.rng.sampleArray = function (raw_chance_array, normalize) {
  // chance_array is [[something, 0.5], [something, 0.4]]
  let chance_array = raw_chance_array
  if (normalize) {
    chance_array = raw_chance_array.filter(a => true)
    setup.rng.normalizeChanceArray(chance_array)
  }

  let randomval = Math.random()
  for (let i = 0; i < chance_array.length; ++i) {
    let chanceobj = chance_array[i]
    if (chanceobj[1] >= randomval) return chanceobj[0]
    randomval -= chanceobj[1]
  }
  return null
}


setup.rng.sampleObject = function (key_chance_map, force_return) {
  // key_chance_map: {something1: 0.5, something2: 0.4}
  // returns something1 or something2

  /**
   * @type {Array<[any, number]>}
   */
  let chances = []
  for (let key in key_chance_map) {
    chances.push([key, key_chance_map[key]])
  }
  if (force_return) setup.rng.normalizeChanceArray(chances)
  return setup.rng.sampleArray(chances)
}

// from https://stackoverflow.com/questions/9960908/permutations-in-javascript
setup.rng.AllPermutations = function (inputArr) {
  let result = [];
  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
      }
    }
  }
  permute(inputArr)
  return result;
}


setup.rng.QuestChancePick = function (chance_array) {
  // chance array: [[obj1, 1], [obj2, 50]], ...
  // 1: common. 100: impossible. 0: priority quest: a special case that is always preferred, if any
  chance_array.sort((c1, c2) => c1[1] < c2[1] ? -1 : (c1[1] > c2[1] ? 1 : 0))

  let rnd = Math.floor(Math.random() * 100)
  if (chance_array[0][1] == 0) {
    // priority for rarity 0
    rnd = 0
  } else if (rnd < chance_array[0][1]) {
    rnd = chance_array[0][1]
  }

  // Find max candidate that satisfies
  let max_candidate = 0
  while (max_candidate + 1 < chance_array.length && chance_array[max_candidate + 1][1] <= rnd) {
    max_candidate += 1
  }
  max_candidate += 1

  // pick one at random
  return chance_array[Math.floor(Math.random() * max_candidate)][0]
}



/* Randomize array in-place using Durstenfeld shuffle algorithm */
/* from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
setup.rng.shuffleArray = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

setup.rng.choice = function (array) {
  if (!array.length) throw new Error(`Cannot random choice empty array`)
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Pick choices from array without replacement
 * @param {Array} array 
 * @param {number} choices 
 */
setup.rng.choicesRandom = function (array, choices) {
  if (array.length < choices) throw new Error(`Not enough elements in array for ${choices} choices`)
  if (!choices) return []

  // shallow copy, not deep copy ANGERY
  let arraycopy = array.filter(a => true)
  setup.rng.shuffleArray(arraycopy)
  return arraycopy.splice(0, choices)
}
