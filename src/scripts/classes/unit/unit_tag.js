"use strict";
// @ts-nocheck
setup.Unit.prototype.getTags = function () {
    return this.tags;
};
setup.Unit.prototype.addTag = function (tag) {
    this.tags.push(tag);
    this.resetCache();
};
setup.Unit.prototype.removeTag = function (tag) {
    // if (!this.isHasTag(tag)) throw new Error(`Tag ${tag} not found in ${this.getName()}`)
    this.tags = this.tags.filter(item => item != tag);
    this.resetCache();
};
setup.Unit.prototype.isHasTag = function (tag) {
    return this.getTags().includes(tag);
};
