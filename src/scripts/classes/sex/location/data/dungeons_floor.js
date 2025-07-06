// @ts-nocheck
export class DungeonsLocationBase extends setup.SexLocation {
    getRestrictions() {
        return [
            setup.qres.Building('dungeons'),
        ];
    }
    /**
     * Describes the room. Moves to the center of the ...
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    repRoom(sex) {
        return `dungeons cell`;
    }
    getFurnitures() {
        return {
            slaverbed: setup.item.f_slaverbed_other_dungeons_bench,
            slavebed: setup.furnitureslot.slavebed.getBasicFurniture(),
            foodtray: setup.furnitureslot.foodtray.getBasicFurniture(),
            drinktray: setup.furnitureslot.drinktray.getBasicFurniture(),
            reward: setup.furnitureslot.reward.getBasicFurniture(),
            punishment: setup.item.f_punishment_none_dungeons,
            lighting: setup.furnitureslot.lighting.getBasicFurniture(),
            object: setup.furnitureslot.object.getBasicFurniture(),
            tile: setup.furnitureslot.tile.getBasicFurniture(),
            wall: setup.furnitureslot.wall.getBasicFurniture(),
        };
    }
    repRawGazeAt(sex) {
        return [
            `the featureless walls of the dungeons cell`,
            `the empty walls`,
            `the featureless walls`,
            `the dirty walls of the cell`,
            `a crack on the dungeons walls`,
            `the tiny window of the dungeons cell`,
            `a dark stain on the walls`,
            `the gray walls`,
            `the cold walls`,
            `a bump on the walls`,
        ];
    }
    repRawAmbience(sex) {
        const base = [
            `the sound of gagging and moaning could be heard coming from another cell`,
            `the dungeons continue to smell of sex`,
            `a rat could be seen scuttling away in a nearby cell`,
            `a slight breeze comes in from the tiny window`,
            `the sounds of rattling restraints could be heard coming from somewhere in the dungeons`,
            `a spider watches the action unfold from a cobweb on the corner of the cell`,
            `a breeze of wind comes in from the cell bars`,
            `the overhead hanging chains stay unmoving`,
            `the rest of the dungeons remain eerily silent`,
            `another slaver descends into the dungeons, sneaking a glance or two into the cell before moving on`,
            `there are nobody else here, and the only thing here is ${this.repGazeAt(sex)}`
        ];
        if (State.variables.company.player.getUnits().filter(unit => unit.isHasDick()).length) {
            base.push(`the smell of cum continues to permeate the dungeons`);
        }
        else {
            base.push(`the smell of girlcum continues to permeate the dungeons`);
        }
        return base;
    }
}
setup.SexLocationClass.DungeonsFloor = class DungeonsFloor extends DungeonsLocationBase {
    constructor() {
        super('dungeonsfloor', [ /* tags  */], 'Dungeons (floor)', 'The dirty floor of a dungeons cell');
    }
    /**
     * A sentence for starting a sex here.
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawRepStart(sex) {
        return [
            `a|They a|descend to the dungeons, before finding an empty featureless cell for some action.`,
            `The familiar settings of the dungeons greet a|rep, who a|is ready for some hot action.`,
            `A breeze of wind escapes from a small opening in the dungeons cells wall, tingling a|reps senses before the sex begin.`
        ];
    }
};
setup.sexlocation.dungeonsfloor = new setup.SexLocationClass.DungeonsFloor();
