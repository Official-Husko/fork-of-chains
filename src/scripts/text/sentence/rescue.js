
setup.Text.Rescue = {}

// {output}, preferably before your slaver disappear forever.
// {output}, although considering he will be gaped and raped, do you still want them back?
// {output} before worse things happens to them.
setup.Text.Rescue.needrescue = function (unit) {
  let rescuer = State.variables.dutylist.getDuty('rescuer')

  if (!rescuer) {
    // rescue building has not been built
    let office = setup.buildingtemplate.rescueroffice.rep()
    const texts = [
      `If you want to see b|rep ever again, best start building that ${office}`,
      `You'd have to build the ${office} if you ever want to see b|rep again`,
      `Best start thinking about when to build the ${office} you have always dreamed off`,
      `The ${office} improvement is mighty tempting to build now. You may want to consider building it`,
      `If you build the ${office}, you may be able to rescue b|rep`,
    ]
    return setup.Text.replaceUnitMacros(texts, { b: unit })
  } else {
    const rescuer_unit = rescuer.getAssignedUnit()
    let r = rescuer.rep()
    if (!rescuer_unit) {
      // no rescuer
      const texts = [
        `If you want to see b|rep ever again, best assign someone to be your ${r}`,
        `You'd have assign someone to be your ${r} if you ever want to see b|rep again`,
        `Best start thinking about when to hire a ${r}`,
        `Maybe you can assign someone to be the company's ${r}`,
        `A skilled ${r} might be able to rescue b|rep`,
      ]
      return setup.Text.replaceUnitMacros(texts, { b: unit })
    } else {
      // rescuer hired
      const texts = [
        `Hearing the news, you sighed audibly before ordering your ${r} a|rep to get to work`,
        `Your ${r} a|rep will have to work extra hard now`,
        `Time to inform your ${r} a|rep about a|their new task at hand`,
        `Best pray your ${r} a|rep can find b|rep in time`,
        `You consider bribing your ${r} a|rep to work faster and find b|rep`,
      ]
      return setup.Text.replaceUnitMacros(texts, { a: rescuer_unit, b: unit })
    }
  }
}


// {output}, preferably before your slaver disappear forever.
// {output}, although considering he will be gaped and raped, do you still want them back?
// {output} before worse things happens to them.
setup.Text.Rescue.rescueNow = function (unit) {
  let options = []
  if (unit.isSlaver()) {
    options = [
      'Hearing the news, you sighed audibly as you begin to work locating the slaver',
      'You immediately get to work scouring information for where the slaver could be now. If you are quick, you can perhaps get the slaver back',
      'Fortunately, tracking the slaver down will not be a problem if you are quick',
      'You can probably get the slaver back if you are quick',
      'You sighed as you are left with no choice but to gather information to rescue the slaver back',
    ]
  } else {
    options = [
      "You'll have to be quick if you want to recapture the slave back",
      "You sighed as you immediately get to work scouring possible locations for the slave to recapture",
      "Better get to work locating the slave now",
      "Recapturing the slave will be possible if you are quick",
      "Fortunately, it won't be too hard to track the escaped slave",
    ]
  }
  return setup.Text.replaceUnitMacros(options, { a: unit })
}
