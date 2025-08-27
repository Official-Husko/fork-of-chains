import { TwineClass } from "./_TwineClass";
import type { BuildingTemplate, BuildingTemplateKey } from "./BuildingTemplate";
import type { RoomInstance } from "./room/RoomInstance";

export type BuildingInstanceKey = BrandedType<number, "BuildingInstanceKey">;

export class BuildingInstance extends TwineClass {
  key: BuildingInstanceKey;
  template_key: BuildingTemplateKey;

  /** upgrade level */
  level = 0;

  constructor(template: BuildingTemplate) {
    super();

    this.key = State.variables.BuildingInstance_keygen++ as BuildingInstanceKey;
    this.template_key = template.key;

    if (this.key in State.variables.buildinginstance)
      throw new Error(`Building ${this.key} already exists`);
    State.variables.buildinginstance[this.key] = this;

    this.upgrade();
  }

  delete() {
    delete State.variables.buildinginstance[this.key];
  }

  getName(): string {
    return this.getTemplate().getName();
  }

  getLevel(): number {
    return this.level;
  }

  getTemplate(): BuildingTemplate {
    return setup.buildingtemplate[this.template_key];
  }

  isHasUpgrade(): boolean {
    let template = this.getTemplate();
    return this.level < template.getMaxLevel();
  }

  getUpgradeCost(): readonly Cost[] {
    let template = this.getTemplate();
    return template.getCost(this.level);
  }

  getUpgradePrerequisite(): readonly Restriction[] {
    let template = this.getTemplate();
    return template.getPrerequisite(this.level);
  }

  isUpgradable(): boolean {
    let template = this.getTemplate();
    if (this.level >= template.getMaxLevel()) return false; // max level already
    return template.isBuildable(this.level);
  }

  getUpgradeRoom(): RoomInstance | null {
    const template = this.getTemplate().getSubRoomTemplate();
    if (template) {
      return new setup.RoomInstance({ template: template });
    } else {
      return null;
    }
  }

  upgrade(room?: RoomInstance | null): RoomInstance | null {
    if (!room && this.getLevel() > 0) {
      room = this.getUpgradeRoom();
    }

    if (this.level) State.variables.statistics.add("buildings_upgraded", 1);

    State.variables.fort.player.addUpgrade();

    let template = this.getTemplate();
    template.payCosts(this.level);
    this.level += 1;

    let on_build = template.getOnBuild();
    if (on_build && on_build.length >= this.level) {
      setup.RestrictionLib.applyAll(on_build[this.level - 1], this as any);
    }

    if (this.level > 1) {
      setup.notify(
        `<<successtext 'Upgraded'>>: ${this.rep()} to level ${this.level}`,
      );
    }

    return room ?? null;
  }

  downgrade() {
    if (this.level <= 1) throw new Error(`Level too low!`);
    this.level -= 1;

    State.variables.fort.player.removeUpgrade();

    setup.notify(
      `<<dangertext 'Downgraded'>>: ${this.rep()} to level ${this.level}`,
    );
  }

  getTitleRep(): string {
    return this.getName();
  }

  getRepMacro() {
    return "buildingcard";
  }

  rep(): string {
    return setup.repMessage(this);
  }
}
