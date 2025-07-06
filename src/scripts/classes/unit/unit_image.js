"use strict";
// @ts-nocheck
setup.Unit.prototype.getImageInfo = function () {
    if (this.custom_image_name)
        return null;
    return State.variables.unitimage.getImageObject(this).info;
};
setup.Unit.prototype.getCustomImageName = function () { return this.custom_image_name; };
setup.Unit.prototype.getImage = function () {
    let custom_image_name = this.custom_image_name;
    if (custom_image_name) {
        return `img/customunit/${custom_image_name}`;
    }
    return State.variables.unitimage.getImagePath(this);
};
