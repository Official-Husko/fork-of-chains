// To support saving and reloading classes in twine save games.
// All classes should inherit from this or else implement a .clone() and .toJSON()
// Even if you're not planning to save it into the variables, still preferred to inherit from this
// in case they got included somewhere
setup.TwineClass = class TwineClass {
  clone() {
    return setup.rebuildClassObject(this.constructor, this);
  }
  toJSON() {
    return setup.toJsonHelper(this.constructor.name, this);
  }
};

// If your class is not defined in `setup`, use this.
setup.TwineClassCustom = class TwineClassCustom {
  /**
   * @returns {string}   // e.g., setup.a.b.c if your class is setup.a.b.c.Class()
   */
  getContainer() {
    return `setup`;
  }

  clone() {
    return setup.rebuildClassObject(this.constructor, this);
  }

  toJSON() {
    return setup.toJsonHelper(this.constructor.name, this, this.getContainer());
  }
};
