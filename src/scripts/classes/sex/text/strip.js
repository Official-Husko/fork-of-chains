"use strict";
// @ts-nocheck
/**
 * Describes unit stripping a piece of equipment
 * @param {setup.Unit} unit
 * @param {setup.EquipmentSlot} equipment_slot
 * @param {setup.SexInstance} sex
 * @return {string}
 */
setup.SexText.stripDescription = function (unit, equipment_slot, sex) {
    const eq = unit.getEquipmentAt(equipment_slot);
    if (!eq)
        return '';
    const moan = setup.SexText.moan(unit, sex);
    const verb = setup.Text.Strip.verb(unit, eq);
    if (equipment_slot == setup.equipmentslot.torso) {
        if (eq.getTags().includes('harness')) {
            return `a|Their a|hands a|adv undo the bindings of \
      a|their ${eq.rep()} and a|they hyperventilates within \
      its embrace as a|they a|strip.`;
        }
        else if (eq.getTags().includes('armor')) {
            return `a|They a|adv ${verb} a|their ${eq.rep()}, ` +
                `until it drops with a loud thud.`;
        }
        else if (eq.getTags().includes('fake_clothes')) {
            return `a|They ${verb} a|their "invisible" ${eq.rep()}.`;
        }
        else if (eq.getTags().includes('restraints')) {
            return `a|They a|are freed from a|their restrictive ${eq.rep()}, for the time being.`;
        }
        else {
            return `a|They a|pull a|their ${eq.rep()} over a|their head revealing
      a|their naked a|breasts.`;
        }
    }
    else if (equipment_slot == setup.equipmentslot.legs) {
        let text = ``;
        if (eq.getTags().includes('harness')) {
            text += `a|They a|scramble to unfasten the bindings on a|their \
      ${eq.rep()} as fast as a|they can`;
        }
        else if (eq.getTags().includes('armor')) {
            text += `a|They a|adv ${verb} a|their a|legs out from a|their protective ${eq.rep()}`;
        }
        else if (eq.getTags().includes('restraints')) {
            text += `a|Their ${eq.rep()} no longer binds a|them for the time being`;
        }
        else if (eq.getTags().includes('fake_clothes')) {
            text += `a|They ${verb} a|their "invisible" ${eq.rep()}`;
        }
        else {
            text += `a|They a|adv ${verb} a|their ${eq.rep()} down`;
        }
        const underwear = unit.getEquipmentAt(setup.equipmentslot.rear);
        if (underwear && underwear.isCovering()) {
            text += `, revealing a|their ${underwear.rep()}.`;
        }
        else {
            text += `, revealing a|their a|genital.`;
        }
        return text;
    }
    else if (equipment_slot == setup.equipmentslot.rear) {
        let text = ``;
        if (eq.getTags().includes('harness')) {
            text += `One by one, a|they a|unbind the fastenings on a|their ${eq.rep()}`;
        }
        else if (eq.getTags().includes('armor')) {
            text += `a|They a|give up what little protection a|their ${eq.rep()} offered`;
        }
        else if (eq.getTags().includes('restraints')) {
            text += `The ${eq.rep()} clanks to the ground`;
        }
        else if (eq.getTags().includes('clothes')) {
            text += `Unceremoniously, a|they a|throw a|their ${eq.rep()} aside`;
        }
        else if (eq.getTags().includes('fake_clothes')) {
            text += `a|They ${verb} a|their "invisible" ${eq.rep()}`;
        }
        else if (eq.getTags().includes('vegetable')) {
            text += `a|They ${verb} the ${eq.rep()} which was plugged deep within a|their a|anus, the cold and fresh feeling suddenly gone from inside them.`;
        }
        else if (eq.getTags().includes('buttplug') || eq.getTags().includes('dildo')) {
            text += `a|Their ${eq.rep()} pressed against a|their inner walls as a|they struggle to remove it`;
        }
        else {
            text += `a|They ${verb} a|their ${eq.rep()}`;
        }
        text += `, revealing a|their a|anus.`;
        return text;
    }
    else if (equipment_slot == setup.equipmentslot.genital) {
        if (unit.isHasVagina()) {
            if (eq.getTags().includes('dildo')) {
                if (eq.getTags().includes('vegetable')) {
                    return `a|They ${verb} the ${eq.rep()} which was plugged deep within a|their a|vagina, the cold and fresh feeling suddenly gone from inside them.`;
                }
                else {
                    return `a|They ${verb} a|their ${eq.rep()} which was plugged deep inside a|their a|vagina, eliciting a ${moan}.`;
                }
            }
            else {
                return `a|They ${verb} a|their ${eq.rep()} from blocking the use of a|their a|vagina.`;
            }
        }
        else {
            if (eq.getTags().includes('chastity')) {
                return `a|Their ${eq.rep()} is unlocked, freeing a|their a|dick for the first time in days.`;
            }
            else if (eq.getTags().includes('dickplug')) {
                return `a|Their ${eq.rep()} is painfully removed from deep within a|their urethra.`;
            }
            else {
                return `a|Their dick decoration ${eq.rep()} is removed and threwn aside.`;
            }
        }
    }
    else if (equipment_slot == setup.equipmentslot.nipple) {
        if (eq.getTags().includes('nippleclamps')) {
            return `a|Their nipples were constantly pinched with ${eq.rep()}, \
      which keeps them hard even after a|they a|take it off.`;
        }
        else if (eq.getTags().includes('nipplechains')) {
            return `a|Their nipples are constantly pinched with ${eq.rep()}, \
      which keeps them hard even after a|they a|take it off.`;
        }
        else {
            return `a|Their nipples are adorned with ${eq.rep()}, which is swiftly removed.`;
        }
    }
    else if (equipment_slot == setup.equipmentslot.mouth) {
        if (eq.getTags().includes('mouthcover')) {
            return `a|They ${verb} a|their ${eq.rep()} and a|throw it aside.`;
        }
        else if (eq.getTags().includes('plaguemask')) {
            return `a|They ${verb} a|their ${eq.rep()} and place it aside.`;
        }
        else if (eq.getTags().includes('dildogag')) {
            return `a|They a|remove the dildo from a|their throat, leaving the ring gag in place.`;
        }
        else if (eq.getTags().includes('gag')) {
            return `The ${eq.rep()} is unfastened from a|their a|mouth.`;
        }
        else {
            return `a|They ${verb} the ${eq.rep()} covering a|their a|mouth.`;
        }
    }
    else if (equipment_slot == setup.equipmentslot.arms) {
        if (eq.getTags().includes('mitts') || eq.getTags().includes('hooves')) {
            return `a|Their fists uncurl after a long bondage inside a|their now removed ${eq.rep()}.`;
        }
        else if (eq.getTags().includes('harness')) {
            return `a|They ${verb} a|their ${eq.rep()}.`;
        }
        else if (eq.getTags().includes('armor')) {
            return `a|They ${verb} a|their protective ${eq.rep()} before throwing it aside.`;
        }
        else if (eq.getTags().includes('fake_clothes')) {
            return `a|They ${verb} a|their "invisible" ${eq.rep()} that nobody else could see.`;
        }
        else if (eq.getTags().includes('restraints')) {
            return `a|Their ${eq.rep()} is unlocked and placed aside.`;
        }
        else {
            return `a|They ${verb} a|their ${eq.rep()} for the time being.`;
        }
    }
    else if (equipment_slot == setup.equipmentslot.feet) {
        if (eq.getTags().includes('hooves')) {
            return `The ${eq.rep()} encasing a|their feet is removed for the first time in days.`;
        }
        else {
            return `a|They ${verb} a|their ${eq.rep()} and place them aside.`;
        }
    }
    else {
        // eyes, neck, weapon, head are not implemented
        throw new Error(`Not implemented: stripping for ${equipment_slot.key}`);
    }
};
