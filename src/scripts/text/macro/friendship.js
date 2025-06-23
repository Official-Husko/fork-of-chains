/*
  Friendship macros:

  <<tfriendtitle friendshipamt>>: rival, friend, etc based on the amt
  <<tfriendslave friendshipamt>>: fear, is devoted to, etc based on the amt
*/

export function getFriendTitle(amt) {
  if (amt == -1000) return 'archrival'
  if (amt <= -900) return 'big rival'
  if (amt <= -500) return 'rival'
  if (amt <= -300) return 'competitor'
  if (amt <= -150) return 'minor rival'
  if (amt < 150) return 'acquaintance'
  if (amt < 300) return 'distant friend'
  if (amt < 500) return 'friend'
  if (amt < 900) return 'companion'
  if (amt < 1000) return 'confidant'
  return 'best friend'
}

export function getFriendSlaveTitle(amt) {
  if (amt == -1000) return 'is terrified by'
  if (amt <= -900) return 'is frightened by'
  if (amt <= -500) return 'respects'
  if (amt <= -300) return 'is scared by'
  if (amt <= -150) return 'slightly respects'
  if (amt < 150) return 'is indifferent to'
  if (amt < 300) return 'slightly trusts'
  if (amt < 500) return 'is loyal to'
  if (amt < 900) return 'is devoted to'
  if (amt < 1000) return 'is bonded to'
  return 'is fully bonded to'
}

/**
 * @param {setup.Unit} unit1 
 * @param {setup.Unit} unit2 
 * @returns {string}
 */
export function getFriend(unit1, unit2) {
  if (unit1.getLover() == unit2) {
    return 'lover'
  }
  let friendship = State.variables.friendship.getFriendship(unit1, unit2)
  return getFriendTitle(friendship)
}

// get lover / sibling / friend / ''
const getRel = (unit1, unit2) => {
  if (unit1.getLover() == unit2) return 'lover'
  let relation = State.variables.family.getRelation(unit2, unit1)
  if (relation) {
    return relation.rep()
  } else {
    if (unit1.isSlave() || unit2.isSlave()) return ''
    let friendship = State.variables.friendship.getFriendship(unit1, unit2)
    if (friendship > -200 && friendship < 200) return ''
    return getFriend(unit1, unit2)
  }
}

// unit1 and <<utheirrel>> unit2. (can be empty)
const getTheirRel = (unit1, unit2) => {
  let rel = getRel(unit1, unit2)
  if (!rel) return ''
  return `<<their "${unit1.key}">> ${rel}`
}

// <<namerelu unit1 unit2>> become unit1's brother unit2
const getNameRel = (unit1, unit2) => {
  let rel = getRel(unit1, unit2)
  if (!rel) return ''
  return `${unit1.rep()} ${rel}`
}

function internalOutput(output, func, ...params) {
  output.appendChild(document.createTextNode(func(...params)))
}

const wikiOutput = (output, func, ...params) => {
  let wrapper = $(document.createElement('span'))
  wrapper.wiki(func(...params))
  wrapper.appendTo(output)
};

Macro.add('tfriendtitle', { handler() {
  internalOutput(this.output, getFriendTitle, ...this.args);
} });
Macro.add('tfriendslave', { handler() {
  internalOutput(this.output, getFriendSlaveTitle, ...this.args);
} });

Macro.add('ufriend', { handler() {
  internalOutput(this.output, getFriend, ...this.args);
} });

Macro.add('utheirrel', { handler() {
  wikiOutput(this.output, getTheirRel, ...this.args);
} });
Macro.add('unamerel', { handler() {
  wikiOutput(this.output, getNameRel, ...this.args);
} });

