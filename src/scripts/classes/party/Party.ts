import { TwineClass } from "../_TwineClass";
import type { Unit, UnitKey } from "../unit/Unit";

export type PartyKey = BrandedType<number, "PartyKey">;

export class Party extends TwineClass {
  key: PartyKey;
  name: string;
  unit_keys: UnitKey[];
  is_cannot_go_on_quests_auto: boolean;

  constructor() {
    super();

    this.key = State.variables.Party_keygen++ as PartyKey;

    this.name = `Party ${this.key}`;

    this.unit_keys = [];

    this.is_cannot_go_on_quests_auto = false;

    if (this.key in State.variables.party)
      throw new Error(`Party ${this.key} duplicated`);
    State.variables.party[this.key] = this;
  }

  delete() {
    delete State.variables.party[this.key];
  }

  getRepMacro() {
    return "partycard";
  }

  rep() {
    return setup.repMessage(this);
  }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  addUnit(unit: Unit) {
    if (unit.getParty())
      throw new Error(`${unit.name} already in party ${unit.party_key}`);
    this.unit_keys.push(unit.key);
    unit.party_key = this.key;
    setup.notify(`${unit.rep()} is added to ${this.rep()}`);
  }

  removeUnit(unit: Unit) {
    if (!this.unit_keys.includes(unit.key))
      throw new Error(`${unit.name} not in this party`);
    if (unit.party_key != this.key)
      throw new Error(
        `${unit.name} party key is incorrect and cannot be removed`,
      );
    this.unit_keys = this.unit_keys.filter((unit_key) => unit_key != unit.key);
    unit.party_key = undefined;
    setup.notify(`${unit.rep()} is removed from ${this.rep()}`);
  }

  getUnits(): Unit[] {
    return this.unit_keys.map((key) => State.variables.unit[key]);
  }

  isCanDisband(): boolean {
    return !this.getUnits().length;
  }

  isCanGoOnQuestsAuto(): boolean {
    return !this.is_cannot_go_on_quests_auto;
  }

  toggleIsCanGoOnQuestsAuto() {
    this.is_cannot_go_on_quests_auto = !this.is_cannot_go_on_quests_auto;
  }

  static cmp(party1: Party | null, party2: Party | null) {
    if (party1 == party2) return 0;
    if (!party1) return 1;
    if (!party2) return -1;
    return party1.getName().localeCompare(party2.getName());
  }
}
