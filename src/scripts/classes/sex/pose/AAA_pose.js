"use strict";
// @ts-nocheck
setup.SexPoseClass = {};
setup.sexpose = class {
};
/**
 * How the unit occupies its position in sex.
 */
setup.SexPose = class SexPose extends setup.TwineClassCustom {
    /**
     * @typedef {{facing_key: string, height_key: string}} FacingHeightKey
     *
     * @param {string} key
     * @param {string[]} tags
     * @param {string} title
     * @param {string} description
     * @param {Object<string, FacingHeightKey>} bodypart_key_facing_height_key_map
     */
    constructor(key, tags, title, description, bodypart_key_facing_height_key_map) {
        super();
        this.key = key;
        this.tags = tags;
        this.title = title;
        this.description = description;
        this.bodypart_key_facing_height_key_map = bodypart_key_facing_height_key_map;
    }
    /* =========================
        BASIC GETTERS
    ========================= */
    /**
     * @returns {string}
     */
    getContainer() { return `setup.SexPoseClass`; }
    /**
     * Unlock restrictions.
     * @returns {setup.Restriction[]}
     */
    getRestrictions() { return []; }
    /**
     * @returns {string[]}
     */
    getTags() { return this.tags; }
    /**
     * @param {setup.SexPosition} [position]
     * @param {setup.SexInstance} [sex]
     * @returns {string}
     */
    getImage(position, sex) {
        let suffix = '';
        if (sex && this.isPositionRaised(position, sex))
            suffix = '_h';
        return `img/sexpose/${this.key}${suffix}.svg`;
    }
    /**
     * @param {setup.SexPosition} [position]
     * @param {setup.SexInstance} [sex]
     * @returns {string}
     */
    getImageFlipped(position, sex) {
        const base = this.getImage();
        let imgclass = '';
        if (position && position.isFacingRight()) {
            imgclass = 'flip-horizontal';
        }
        return `<img class="${imgclass}" src="${setup.escapeHtml(setup.resolveImageUrl(this.getImage(position, sex)))}" />`;
    }
    /**
     * @param {setup.SexPosition} [position]
     * @param {setup.SexInstance} [sex]
     * @returns {string}
     */
    getImageRep(position, sex) {
        return `<span class='colorize-white' data-tooltip="${this.getTitle()}">${this.getImageFlipped(position, sex)}</span>`;
    }
    /**
     * @param {setup.SexPosition} [position]
     * @param {setup.SexInstance} [sex]
     * @returns {string}
     */
    rep(position, sex) {
        return `<span class='trait'>${this.getImageRep(position, sex)}</span>`;
    }
    /**
     * @param {setup.SexPosition} [position]
     * @param {setup.SexInstance} [sex]
     * @returns {string}
     */
    repBig(position, sex) {
        return `<span class='colorize-white sex-position-big'>${this.getImageFlipped(position, sex)}</span>`;
    }
    /**
     * @param {setup.SexPosition} [position]
     * @param {setup.SexInstance} [sex]
     * @returns {string}
     */
    repBigPlayer(position, sex) {
        return `<span class='colorize-gold sex-position-big'>${this.getImageFlipped(position, sex)}</span>`;
    }
    /**
     * @returns {string}
     */
    getTitle() { return this.title; }
    /**
     * @returns {string}
     */
    getDescription() { return this.description; }
    /**
     * In this default position, where does this bodypart face to? Does not raise
     * @param {setup.SexBodypart} bodypart
     * @param {setup.SexPosition} position
     * @param {setup.SexInstance} sex
     * @returns {{facing: setup.SexFacing, height: setup.SexHeight}}
     */
    _getRawFacingHeight(bodypart) {
        const facing = setup.sexfacing[this.bodypart_key_facing_height_key_map[bodypart.key].facing_key];
        let height = setup.sexheight[this.bodypart_key_facing_height_key_map[bodypart.key].height_key];
        if (!facing)
            throw new Error(`Missing facing for position ${this.key} bodypart ${bodypart.key}`);
        if (!height)
            throw new Error(`Missing height for position ${this.key} bodypart ${bodypart.key}`);
        return { facing: facing, height: height };
    }
    /**
     * In this default position, where does this bodypart face to?
     * @param {setup.SexBodypart} bodypart
     * @param {setup.SexPosition} position
     * @param {setup.SexInstance} sex
     * @returns {{facing: setup.SexFacing, height: setup.SexHeight}}
     */
    getFacingHeight(bodypart, position, sex) {
        let facingheight = this._getRawFacingHeight(bodypart);
        if (this.isPositionRaised(position, sex)) {
            // raise height if on raised platform.
            facingheight.height = facingheight.height.getNextHigherHeight();
        }
        return facingheight;
    }
    /**
     * whether unit can move to this position
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @param {setup.SexPosition} [position]
     * @returns {boolean}
     */
    isAllowed(unit, sex, position) {
        // If unit is being topped right now, then can't
        if (!position) {
            if (sex.getPosition(unit) == setup.sexposition.center && sex.getUnitAtPosition(setup.sexposition.top)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Whether this pose is raised from the floor
     * @param {setup.SexPosition} position
     * @param {setup.SexInstance} sex
     * @returns {boolean}
     */
    isPositionRaised(position, sex) {
        if (position &&
            // @ts-ignore
            [setup.sexposition.center, setup.sexposition.top].includes(position) &&
            sex.getLocation().isHigh()) {
            return true;
        }
        return false;
    }
    /**
     * Whether this pose has been unlocked
     * @returns {boolean}
     */
    isUnlocked = function () {
        return setup.RestrictionLib.isPrerequisitesSatisfied(this, this.getRestrictions());
    };
    /**
     * Whether this position have this unit lying down on the floor either face-up or prone
     */
    isOnFloor = function () {
        const facingheightarms = this._getRawFacingHeight(setup.sexbodypart.arms);
        const facingheightlegs = this._getRawFacingHeight(setup.sexbodypart.legs);
        return (facingheightarms.height == setup.sexheight.floor &&
            facingheightlegs.height == setup.sexheight.floor);
    };
    /* =========================
        TEXT
    ========================= */
    /**
     * Describes what happens when a unit moves to this pose . E.g., "stood up a|x ..."
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawDescribe(unit, sex) {
        return ``;
    }
    /**
     * Describes what happens when a unit moves to this pose . E.g., "stood up a|x ..."
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    describe(unit, sex) {
        if (sex.getPose(unit) == this)
            return '';
        return setup.SexUtil.convert(this.rawDescribe(unit, sex), { a: unit }, sex);
    }
    /**
     * Describes the unit's position. E.g., "Lying down".
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawDescribePosition(unit, sex) {
        return ``;
    }
    /**
     * Describes the unit's position complete with partner. E.g., "Lying down under xxx".
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @returns {string}
     */
    describePosition(unit, sex) {
        const raw_text = setup.SexUtil.convert(this.rawDescribePosition(unit, sex), { a: unit }, sex);
        // get the person closest to this.
        const positions = [
            setup.sexposition.top,
            setup.sexposition.center,
            setup.sexposition.front,
            setup.sexposition.back,
        ];
        const myposition = sex.getPosition(unit);
        let verb = 'alone';
        for (const position of positions) {
            if (position == myposition)
                continue;
            const them = sex.getUnitAtPosition(position);
            if (them && position.isAdjacentTo(myposition)) {
                verb = `${myposition.getRelativePosition(position)} ${them.rep()}`;
            }
        }
        return `${raw_text} ${verb}`;
    }
    // me in this position trying to resist them in sex position. Not in a penetration.
    /**
     * @param {setup.Unit} me
     * @param {setup.Unit} them
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    rawRepResist(me, them, sex) {
        return setup.SexUtil.repResist(me, them, sex, [
            `struggle out of b|their grip`,
            `wriggle out of b|their grasp`,
            `resist`,
            `avoid being violated`,
            `escape`,
        ], [
            `b|rep b|adv b|keep a|them pinned in position`,
            `b|rep b|adv b|keep a|them pushed into position`,
            `b|rep b|adv b|force b|themself into a|them`,
            `b|rep b|adv b|threaten a|them with even worse treatment`,
            `b|rep b|adv b|whisper the things b|they b|is going to do to a|them`,
        ]);
    }
    /**
     * @param {setup.Unit} me
     * @param {setup.Unit} them
     * @param {setup.SexInstance} sex
     * @returns {string | string[]}
     */
    repResist(me, them, sex) {
        return setup.SexUtil.convert(this.rawRepResist(me, them, sex), { a: me, b: them }, sex);
    }
    /* =========================
        STATIC
    ========================= */
    /**
     * @returns {string}
     */
    static repBigNone() {
        return `<span class='colorize-white sex-position-big'>
      <img src="${setup.escapeHtml(setup.resolveImageUrl(setup.SexPose.NONE_IMAGE_URL))}" />
    </span>`;
    }
    /**
     * @returns {setup.SexPose[]}
     */
    static getAllPoses() {
        return Object.values(setup.sexpose).filter(pose => pose.isUnlocked());
    }
    static NONE_IMAGE_URL = `img/sexpose/none.svg`;
};
/**
 * Sex position exclusive for the top position
 */
setup.SexPoseTop = class SexPoseTop extends setup.SexPose {
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @param {setup.SexPosition} [position]
     * @returns {boolean}
     */
    isAllowed(unit, sex, position) {
        const center = sex.getUnitAtPosition(setup.sexposition.center);
        return ((position || sex.getPosition(unit)) == setup.sexposition.top &&
            center &&
            sex.getPose(center) == setup.sexpose.lieup &&
            super.isAllowed(unit, sex));
    }
};
/**
 * Sex position exclusive for the top position
 */
setup.SexPoseFloor = class SexPoseFloor extends setup.SexPose {
    /**
     * @param {setup.Unit} unit
     * @param {setup.SexInstance} sex
     * @param {setup.SexPosition} [position]
     * @returns {boolean}
     */
    isAllowed(unit, sex, position) {
        return [setup.sexposition.front, setup.sexposition.center, setup.sexposition.back].includes(
        // @ts-ignore
        (position || sex.getPosition(unit))) && super.isAllowed(unit, sex);
    }
};
