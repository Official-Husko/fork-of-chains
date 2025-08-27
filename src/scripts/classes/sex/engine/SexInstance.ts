import { TwineClass } from "../../_TwineClass";
import type { Equipment, EquipmentKey } from "../../equipment/Equipment";
import type {
  EquipmentSlot,
  EquipmentSlotKey,
} from "../../equipment/EquipmentSlot";
import type { Unit } from "../../unit/Unit";
import type { SexAction } from "../action/SexAction";
import type { SexBodypart } from "../bodypart/SexBodypart";
import { SexGoal } from "../goal/SexGoal";
import type { SexLocation } from "../location/SexLocation";
import { SexPace } from "../pace/SexPace";
import { SexPermission } from "../permission/SexPermission";
import type { SexPose } from "../pose/SexPose";
import { SexPosition } from "../position/SexPosition";
import { SexConstants } from "../SexConstants";
import type { SexScene } from "./SexScene";

interface Inside {
  my_bodypart: SexBodypart;
  target: Unit;
  target_bodypart: SexBodypart;
}

interface ParticipantInit {
  unit: Unit;
  /** optional for players */
  goal: SexGoal;
  /** initial pace */
  pace: SexPace;
  /** permissions */
  permission: SexPermission;
  /** initial pose */
  pose: SexPose;
  /** initial position */
  position: SexPosition;
  /** list of equipment slots that has been displaced */
  displaced_equipment?: { [k in EquipmentSlotKey]?: boolean };
  /** slot: equipment. list of equipment that is worn over this slot */
  temporary_equipment?: { [k in EquipmentSlotKey]?: EquipmentKey };
  /** history of sex actions chosen by this unit in this scene */
  action_history?: SexAction[];
  orgasms?: number;
  arousal: number;
  discomfort: number;
  energy: number;

  /*
  Array of {my_bodypart, target, target_bodypart}, meaning that my bodypart is inside unit's bodypart
   * Note that this is not reflexive.
   */
  ongoing?: Inside[];
}

type Participant = Required<ParticipantInit>;

export interface UnitAndBodypart {
  unit: Unit;
  bodypart: SexBodypart;
}

/**
 * Stores information about the current sex act.
 *
 * Transient, and does not gets stored in save file.
 */
export class SexInstance extends TwineClass {
  participants: Participant[];

  /**
   * Whether this sex scene has ended.
   */
  is_ended = false;

  // will be set later
  scene: SexScene | null = null;

  is_location_fixed = false;

  /**
   * @param Location Where the sex takes place
   * @param participants List of sex participants
   */
  constructor(
    public location: SexLocation,
    participants: ParticipantInit[],
  ) {
    super();

    if (!participants.length) {
      throw new Error(`No participant in SexInstance`);
    }

    if (participants.length > SexInstance.PARTICIPANTS_MAX) {
      throw new Error(`Too many actors in SexInstance: ${participants.length}`);
    }

    // Add in missing variables that we will use
    this.participants = participants.map((participant) => ({
      ongoing: [],
      displaced_equipment: {},
      temporary_equipment: {},
      action_history: [],
      orgasms: 0,
      ...participant,
    }));

    // put in global variable for ease of use in restrictions
    State.temporary.gSex = this;

    // Sanity check, no two units occupy the same position
    const chosen_positions: SexPosition[] = [];
    for (const participant of participants) {
      if (!participant.unit) throw new Error(`Missing unit for participant`);
      if (!participant.position)
        throw new Error(
          `Missing position for participant ${participant.unit.key}`,
        );
      if (chosen_positions.includes(participant.position))
        throw new Error(`Duplicated position: ${participant.position.key}`);
      chosen_positions.push(participant.position);
    }

    if (!chosen_positions.includes(setup.sexposition.center))
      throw new Error(`Missing unit in CENTER position`);
  }

  /* =============================
      BASIC GETTERS and SETTERS
  ============================= */

  getScene(): SexScene {
    return this.scene!;
  }

  isParticipant(unit: Unit): boolean {
    return this.getUnits().includes(unit);
  }

  _getParticipant(unit: Unit): Participant {
    for (const participant of this.participants) {
      if (participant.unit == unit) return participant;
    }
    throw new Error(`Unit not found in SexInteraction: ${unit.key}`);
  }

  /**
   * Return list of all units participating in this sex
   */
  getUnits(): Unit[] {
    return Object.values(this.participants).map(
      (participant) => participant.unit,
    );
  }

  getGoal(unit: Unit): SexGoal {
    return this._getParticipant(unit).goal;
  }

  setGoal(unit: Unit, goal: SexGoal) {
    this._getParticipant(unit).goal = goal;
  }

  getLocation(): SexLocation {
    return this.location;
  }

  setLocation(location: SexLocation) {
    this.location = location;
  }

  getPace(unit: Unit): SexPace {
    return this._getParticipant(unit).pace;
  }

  setPace(unit: Unit, pace: SexPace) {
    this._getParticipant(unit).pace = pace;
  }

  getPermission(unit: Unit): SexPermission {
    return this._getParticipant(unit).permission;
  }

  getPose(unit: Unit): SexPose {
    return this._getParticipant(unit).pose;
  }

  setPose(unit: Unit, pose: SexPose) {
    this._getParticipant(unit).pose = pose;
  }

  getPosition(unit: Unit): SexPosition {
    return this._getParticipant(unit).position;
  }

  /**
   * Will swap unit in that position
   */
  swapPosition(unit: Unit, position: SexPosition) {
    const in_position = this.getUnitAtPosition(position);

    // already in position
    if (unit == in_position) return;

    const old_position = this.getPosition(unit);
    this._getParticipant(unit).position = position;
    if (in_position) {
      this._getParticipant(in_position).position = old_position;
    }
  }

  getUnitAtPosition(position: SexPosition): Unit | null {
    for (const participant of this.participants) {
      if (participant.position == position) return participant.unit;
    }
    return null;
  }

  getOrgasms(unit: Unit): number {
    return this._getParticipant(unit).orgasms;
  }

  addOrgasm(unit: Unit) {
    this._getParticipant(unit).orgasms += 1;
  }

  /**
   * Has this scene ended?
   */
  isEnded(): boolean {
    return this.is_ended;
  }

  /**
   * End this sex scene
   */
  endSex() {
    this.is_ended = true;
  }

  /* =============================
      ONGOING PENETRATIONS
  ============================= */

  /**
   * unit's bodypart is inside what? Returns {unit: unit, bodypart: bodypart} or null
   */
  getBodypartPenetrationTarget(
    unit: Unit,
    bodypart: SexBodypart,
  ): UnitAndBodypart | null {
    for (const insideobj of this._getParticipant(unit).ongoing) {
      if (insideobj.my_bodypart == bodypart) {
        return {
          unit: insideobj.target,
          bodypart: insideobj.target_bodypart,
        };
      }
    }
    return null;
  }

  /**
   * unit bodypart is penetrated by what? Returns {unit: unit, bodypart: bodypart} or null
   */
  getBodypartPenetrator(
    unit: Unit,
    bodypart: SexBodypart,
  ): UnitAndBodypart | null {
    for (const participant of this.participants) {
      for (const insideobj of participant.ongoing) {
        if (insideobj.target == unit && insideobj.target_bodypart == bodypart) {
          return {
            unit: participant.unit,
            bodypart: insideobj.my_bodypart,
          };
        }
      }
    }
    return null;
  }

  /**
   * get either penetrator or the bodypart this is penetrating
   */
  getBodypartOther(unit: Unit, bodypart: SexBodypart): UnitAndBodypart | null {
    const target = this.getBodypartPenetrationTarget(unit, bodypart);
    if (target) return target;

    const subject = this.getBodypartPenetrator(unit, bodypart);
    if (subject) return subject;

    return null;
  }

  /**
   * Cancels penetration done by unit's bodypart. Should not be called directly except through sex action.
   */
  cancelOngoing(unit: Unit, bodypart: SexBodypart) {
    const participant = this._getParticipant(unit);
    participant.ongoing = participant.ongoing.filter(
      (a) => a.my_bodypart != bodypart,
    );
  }

  /**
   * Get all ongoing penetrations involving this unit. Returns the penetrators
   */
  getAllOngoing(unit: Unit): UnitAndBodypart[] {
    const result = [];
    for (const participant of this.participants) {
      for (const ongoing of participant.ongoing) {
        if (participant.unit == unit || ongoing.target == unit) {
          result.push({
            unit: participant.unit,
            bodypart: ongoing.my_bodypart,
          });
        }
      }
    }
    return result;
  }

  isBeingPenetrated(unit: Unit): boolean {
    return !!this.getAllOngoing(unit).filter((a) => a.unit != unit).length;
  }

  isPenetrating(unit: Unit): boolean {
    return !!this.getAllOngoing(unit).length;
  }

  /**
   * Cancel all ongoing penetrations. Should not be called directly except through sex action.
   * @param unit - If supplied, will stop only those involving this unit
   */
  clearOngoing(unit?: Unit) {
    if (unit) {
      for (const to_remove of this.getAllOngoing(unit)) {
        this.cancelOngoing(to_remove.unit, to_remove.bodypart);
      }
    } else {
      for (const participant of this.participants) {
        const to_removes = participant.ongoing.map((a) => a.my_bodypart);
        for (const to_remove of to_removes)
          this.cancelOngoing(participant.unit, to_remove);
      }
    }
  }

  /**
   * Put unit's bodypart inside target's bodypart
   */
  setOngoing(
    unit: Unit,
    unit_bodypart: SexBodypart,
    target: Unit,
    target_bodypart: SexBodypart,
  ) {
    if (this.isBodypartOngoing(unit, unit_bodypart))
      throw new Error(`${unit.getName()}'s ${unit_bodypart.key} is busy!`);
    if (this.isBodypartOngoing(target, target_bodypart))
      throw new Error(`${target.getName()}'s ${target_bodypart.key} is busy!`);
    const participant = this._getParticipant(unit);
    participant.ongoing.push({
      my_bodypart: unit_bodypart,
      target: target,
      target_bodypart: target_bodypart,
    });
  }

  /**
   * Whether unit's bodypart is currently ongoing on a sex penetration
   */
  isBodypartOngoing(unit: Unit, bodypart: SexBodypart): boolean {
    return !!(
      this.getBodypartPenetrationTarget(unit, bodypart) ||
      this.getBodypartPenetrator(unit, bodypart)
    );
  }

  /* =============================
      UNIT STATE
  ============================= */

  isCanTalk(unit: Unit): boolean {
    return this.isCanUse(unit, setup.sexbodypart.mouth) && unit.isCanTalk();
  }

  isCanCum(unit: Unit): boolean {
    return unit.isCanOrgasm() && unit.isHasDick();
  }

  isCanUse(unit: Unit, bodypart: SexBodypart): boolean {
    // no bodypart to begin with
    if (!bodypart.isHasBodypart(unit, this)) return false;

    if (bodypart.isCanUseCovered()) {
      if (this.getDisablingEquipment(unit, bodypart)) {
        // disabled by equipment
        return false;
      }
    } else {
      if (this.getBlockingEquipment(unit, bodypart)) {
        // blocked by equipment
        return false;
      }
    }

    // busy choking on something
    if (this.isBodypartOngoing(unit, bodypart)) return false;

    return true;
  }

  /* =============================
      CLOTHINGS
  ============================= */

  /**
   * get the outermost piece of equipment that covers this bodypart, if any
   */
  getCoveringEquipment(unit: Unit, bodypart: SexBodypart): Equipment | null {
    // special case: strapon can't be covered
    if (bodypart == setup.sexbodypart.penis && unit.isHasStrapOn()) return null;

    for (const slot of bodypart.getEquipmentSlots()) {
      const eq = unit.getEquipmentAt(slot);
      if (eq && eq.isCovering()) return eq;
    }
    return null;
  }

  /**
   * get the outermost piece of equipment that disables this bodypart, if any
   */
  getDisablingEquipment(unit: Unit, bodypart: SexBodypart): Equipment | null {
    // special case: strapon can't be disabled
    if (bodypart == setup.sexbodypart.penis && unit.isHasStrapOn()) return null;

    // disabling only check the last one.
    const slots = bodypart.getEquipmentSlots();
    if (slots.length) {
      const slot = slots[slots.length - 1];
      const eq = unit.getEquipmentAt(slot);
      if (eq && eq.isMakeBodypartUseless()) return eq;
    }
    return null;
  }

  /**
   * Get the outermost piece of equipment that blocks this bodypart, if any
   */
  getBlockingEquipment(unit: Unit, bodypart: SexBodypart): Equipment | null {
    const cover = this.getCoveringEquipment(unit, bodypart);
    if (cover) return cover;
    return this.getDisablingEquipment(unit, bodypart);
  }

  /**
   * Whether equipment at this slot has been (temporarily) displaced
   */
  isDisplaced(unit: Unit, equipment_slot: EquipmentSlot): boolean {
    return !!this._getParticipant(unit).displaced_equipment[equipment_slot.key];
  }

  /**
   * Removes an equipment from a unit until end of scene
   */
  displaceEquipment(unit: Unit, equipment: Equipment) {
    this._getParticipant(unit).displaced_equipment[equipment.getSlot().key] =
      true;
    unit.resetCache();
  }

  displaceAllEquipments() {
    for (const unit of this.getUnits()) {
      for (const slot of Object.values(setup.equipmentslot)) {
        const equipment = unit.getEquipmentAt(slot);
        if (equipment) {
          this.displaceEquipment(unit, equipment);
        }
      }
    }
  }

  /**
   * Wear a temporary equipment
   */
  equipTemporarily(unit: Unit, equipment: Equipment) {
    this._getParticipant(unit).temporary_equipment[equipment.getSlot().key] =
      equipment.key;
    unit.resetCache();
  }

  /* =============================
      ACTION HISTORY
  ============================= */

  getHistory(unit: Unit): SexAction[] {
    return this._getParticipant(unit).action_history;
  }

  addHistory(unit: Unit, action_class: SexAction) {
    this._getParticipant(unit).action_history.push(action_class);
  }

  getLatestAction(unit: Unit): SexAction | null {
    const history = this._getParticipant(unit).action_history.filter(
      (a) => true,
    );
    history.reverse();
    for (const action of history)
      if (action.getUnits()[0] == unit) return action;
    return null;
  }

  /* =============================
      AROUSAL
  ============================= */

  adjustArousal(unit: Unit, adjustment: number) {
    let arousal = this._getParticipant(unit).arousal + adjustment;
    arousal = Math.max(arousal, 0);
    arousal = Math.min(arousal, SexConstants.AROUSAL_MAX);
    this._getParticipant(unit).arousal = arousal;
  }

  getArousal(unit: Unit): number {
    return this._getParticipant(unit).arousal;
  }

  isArousalDepleted(unit: Unit): boolean {
    return this.getArousal(unit) == 0;
  }

  adjustDiscomfort(unit: Unit, adjustment: number) {
    let discomfort = this._getParticipant(unit).discomfort + adjustment;
    discomfort = Math.max(discomfort, 0);
    discomfort = Math.min(discomfort, SexConstants.AROUSAL_MAX);
    this._getParticipant(unit).discomfort = discomfort;
  }

  getDiscomfort(unit: Unit): number {
    return this._getParticipant(unit).discomfort;
  }

  isDiscomfortDepleted(unit: Unit): boolean {
    return this.getDiscomfort(unit) == 0;
  }

  adjustEnergy(unit: Unit, adjustment: number) {
    let energy = this._getParticipant(unit).energy + adjustment;
    energy = Math.max(energy, 0);
    energy = Math.min(energy, SexConstants.AROUSAL_MAX);
    this._getParticipant(unit).energy = energy;
  }

  getEnergy(unit: Unit): number {
    return this._getParticipant(unit).energy;
  }

  isEnergyDepleted(unit: Unit): boolean {
    return this.getEnergy(unit) == 0;
  }

  /* =============================
      LOGIC
  ============================= */

  /**
   * Apply various "end-of-turn" decays to the unit
   */
  applyDecays(unit: Unit) {
    {
      // Arousal decays
      const arousal = this.getArousal(unit);
      const to_decay_natural = Math.round(SexConstants.AROUSAL_DECAY * arousal);

      // decay arousal from discomfort... unless you're a masochist
      let to_decay_discomfort = Math.round(
        ((SexConstants.DISCOMFORT_AROUSAL_REDUCTION *
          this.getDiscomfort(unit)) /
          SexConstants.DISCOMFORT_MAX) *
          arousal,
      );
      if (unit.isMasochistic()) {
        // opposite effect
        to_decay_discomfort *= -1;
      }

      this.adjustArousal(
        unit,
        Math.round(-to_decay_natural + -to_decay_discomfort),
      );
    }

    {
      // Discomfort decays
      const discomfort = this.getDiscomfort(unit);
      let to_decay = SexConstants.DISCOMFORT_DECAY * discomfort;
      this.adjustDiscomfort(unit, Math.round(-to_decay));
    }
  }

  /**
   * Whether the unit is climaxing
   */
  isOrgasming(unit: Unit): boolean {
    return (
      this.isCanOrgasm(unit) &&
      this.getArousal(unit) >= SexConstants.AROUSAL_ORGASM_THRESHOLD
    );
  }

  /**
   * Whether the unit can phsyically orgasm. They have other rules too, but this is pure biological.
   * Essentially units can break the rules under some circumstances.
   */
  isCanOrgasm(unit: Unit): boolean {
    if (unit.isHasDick()) {
      return unit.isCanPhysicallyCum();
    }

    // Girls can always cum for now.
    return true;
  }

  /**
   * This unit orgasms, doing a lot of things to their stats.
   */
  doOrgasm(unit: Unit) {
    // increment orgasm count
    this.addOrgasm(unit);

    // reset arousal
    this.adjustArousal(unit, -this.getArousal(unit));

    // reduce discomfort
    this.adjustDiscomfort(unit, -SexConstants.DISCOMFORT_ORGASM_REDUCTION);

    // reduce energy
    this.adjustEnergy(unit, -SexConstants.ENERGY_ORGASM_REDUCTION);
  }

  /* =============================
      TEXT THINGS
  ============================= */

  repUnit(unit: Unit): string {
    const position = this.getPosition(unit);
    const pose = this.getPose(unit);
    return `${position.rep()}${pose.rep(position, this)}${unit.rep()}`;
  }

  /* =============================
      STATIC THINGS
  ============================= */

  static cleanup() {
    if (State.temporary.gSex) {
      for (const unit of State.temporary.gSex.getUnits()) {
        unit.resetCache();
      }
    }
    delete State.temporary.gSex;
  }

  /**
   * Get default participant positions, poses, and values.
   */
  static initParticipants(units: Unit[]): ParticipantInit[] {
    const results: ParticipantInit[] = [];

    for (let i = 0; i < units.length; ++i) {
      const unit = units[i];
      const goal = SexGoal.getStartingGoal(unit);
      let discomfort_initial = 0;
      if (goal == setup.sexgoal.resist) {
        discomfort_initial = SexConstants.DISCOMFORT_RESIST_INITIAL;
      }

      let pose;
      if (unit.isSlave()) {
        pose = setup.sexpose.kneel;
      } else {
        pose = setup.sexpose.stand;
      }

      let position = setup.SexClasses.getAllPositions()[i];
      if (units.length == 1) {
        // alone must be in the center
        position = setup.sexposition.center;
      }

      results.push({
        unit: unit,
        goal: SexGoal.getStartingGoal(unit),
        pace: SexPace.getStartingPace(unit),
        permission: SexPermission.getPermission(unit),
        arousal: 0,
        discomfort: discomfort_initial,
        energy: SexConstants.ENERGY_MAX,
        position: position,
        pose: pose,
      });
    }
    return results;
  }

  static PARTICIPANTS_MAX = 3;
}
