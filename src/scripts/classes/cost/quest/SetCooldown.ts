import type { ContentTemplate } from "../../content/ContentTemplate";
import type { EventTemplate } from "../../event/EventTemplate";
import type { OpportunityTemplate } from "../../opportunity/OpportunityTemplate";
import type { QuestTemplate } from "../../quest/QuestTemplate";

/**
 * If passed null as template, will set cooldown for the current quest/opportunity/whatever
 */
abstract class SetCooldown<T extends ContentTemplate> extends Cost {
  template_key: T["key"] | null;
  cooldown: number;

  constructor(template: T | T["key"] | null, cooldown: number) {
    super();

    this.template_key = template ? resolveKey(template) : null;
    this.cooldown = cooldown;
  }

  abstract getTemplate(): T | null;

  override apply(context: CostContext) {
    let template: ContentTemplate | null = this.getTemplate();
    if (template === null) {
      template = context.getTemplate!();
    }

    if (!template) {
      throw new Error(`Missing template for ${this.template_key}`);
    }

    State.variables.calendar.setCooldown(template, this.cooldown);
  }

  override explain(context: CostContext): string {
    const template = this.getTemplate();
    return `Cannot generate ${template ? template.getName() : "this"} for the next ${this.cooldown} weeks`;
  }
}

export class SetCooldownQuest extends SetCooldown<QuestTemplate> {
  override text(): string {
    return `setup.qc.SetCooldownQuest(${this.template_key ? `'${this.template_key}'` : `null`}, ${this.cooldown})`;
  }

  override getTemplate() {
    if (this.template_key) {
      return setup.questtemplate[this.template_key];
    } else {
      return null;
    }
  }
}

export class SetCooldownOpportunity extends SetCooldown<OpportunityTemplate> {
  override text(): string {
    return `setup.qc.SetCooldownOpportunity(${this.template_key ? `'${this.template_key}'` : `null`}, ${this.cooldown})`;
  }

  override getTemplate() {
    if (this.template_key) {
      return setup.opportunitytemplate[this.template_key];
    } else {
      return null;
    }
  }
}

export class SetCooldownEvent extends SetCooldown<EventTemplate> {
  override text(): string {
    return `setup.qc.SetCooldownEvent(${this.template_key ? `'${this.template_key}'` : `null`}, ${this.cooldown})`;
  }

  override getTemplate() {
    if (this.template_key) {
      return setup.event[this.template_key];
    } else {
      return null;
    }
  }
}

export default {
  SetCooldownQuest,
  SetCooldownOpportunity,
  SetCooldownEvent,
};
