
setup.Unit.prototype.getGenitalCovering = function () {
  const legs = this.getEquipmentAt(setup.equipmentslot.legs)
  if (legs && legs.isCovering()) {
    return legs
  }

  const rear = this.getEquipmentAt(setup.equipmentslot.rear)
  if (rear && rear.isCovering()) {
    return rear
  }

  return null
}


setup.Unit.prototype.getChestCovering = function () {
  const torso = this.getEquipmentAt(setup.equipmentslot.torso)
  if (torso && torso.isCovering()) {
    return torso
  }

  const nipple = this.getEquipmentAt(setup.equipmentslot.nipple)
  if (nipple && nipple.isCovering()) {
    return nipple
  }

  return null
}


setup.Unit.prototype.isNaked = function () {
  return setup.Text.Unit.Equipment.isNaked(this)
}
