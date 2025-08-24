import type { DutyInstance } from "../../classes/duty/DutyInstance";
import type { DutyInstancePrestigeSlave } from "../../classes/duty/subtypes/PrestigeSlave";
import {
  menuItemAction,
  menuItemText,
  menuItemTitle,
  type MenuItemArgs,
} from "../../ui/menuitem";
import { domCardRep } from "../util/cardnamerep";

function dutyDescriptionFragment(duty: DutyInstance): DOM.Node {
  State.temporary.gDuty = duty;
  return setup.DOM.Util.twee(duty.getTemplate().getDescription());
}

function dutyStatusFragment(duty: DutyInstance): DOM.Attachable {
  if (duty.isSpecialistActive()) {
    const unit = duty.getAssignedUnit()!;
    return html`
      <span
        data-tooltip="${unit.getName()} is currently unavailable, and a temporary replacement has been hired to staff this duty. The replacement will cost you ${setup.DUTY_SPECIALIST_WEEKLY_UPKEEP} gold each week."
      >
        ${setup.DOM.Text.successlite("[Replacement active]")}
      </span>
    `;
  } else if (!duty.isActive()) {
    return html`
      <span
        data-tooltip="This duty is inactive, and not providing its bonuses. There are several reasons, but most commonly the unit on duty is either injured or is away on a quest."
      >
        ${setup.DOM.Text.danger("[Inactive]")}
      </span>
    `;
  } else {
    return null;
  }
}

function dutyFullDetails(duty: DutyInstance, unit: Unit): DOM.Node {
  const template = duty.getTemplate();
  const grouped = template.getRelevantTraitsGrouped();
  const keys = Object.keys(grouped);
  keys.sort();
  keys.reverse();
  const fragments: DOM.Attachable[] = [];
  for (const key of keys) {
    const inner = [];
    if (template.isHasTriggerChance()) {
      const text = (parseFloat(key) * 100).toFixed(0);
      if (parseFloat(key) > 0) {
        inner.push(setup.DOM.Text.successlite(`+${text}%: `));
      } else if (parseFloat(key) < 0) {
        inner.push(setup.DOM.Text.dangerlite(`${text}%: `));
      }
    } else if (template.isHasPrestigeAmount()) {
      inner.push(setup.DOM.Util.prestige(parseFloat(key)));
    }

    for (const trait of grouped[key as unknown as number]) {
      if (unit && unit.isHasTraitExact(trait)) {
        inner.push(html`${trait.repPositive()}`);
      } else {
        inner.push(html`${trait.rep()}`);
      }
    }

    fragments.push(setup.DOM.create("div", {}, inner));
  }
  return setup.DOM.create("div", {}, fragments);
}

function triggerChanceOrPrestige(duty: DutyInstance): DOM.Node {
  const inner_fragments = [];
  const template = duty.getTemplate();
  if (duty.getAssignedUnit()) {
    if (template.isHasTriggerChance()) {
      inner_fragments.push(html`
        Trigger chance: ${(duty.computeChance() * 100).toFixed(2)}%
      `);
    } else if (template.isHasPrestigeAmount()) {
      inner_fragments.push(
        setup.DOM.Util.prestige(
          (duty as DutyInstancePrestigeSlave).getCurrentPrestige(),
        ),
      );
    }
  }
  return setup.DOM.create("span", {}, inner_fragments);
}

function dutyNameActionMenus(
  duty: DutyInstance,
  show_actions?: boolean,
): JQuery[] {
  const menu: JQuery[] = [];

  const toolbar_items = [];

  toolbar_items.push(
    menuItemTitle({
      text: domCardRep(duty),
    }),
  );

  const unit = duty.getAssignedUnit();
  if (unit) {
    const unit_base = html`${unit.repLong()} ${dutyStatusFragment(duty)}`;
    if (
      duty.getTemplate().isHasTriggerChance() ||
      duty.getTemplate().isHasPrestigeAmount()
    ) {
      let trigger_chance_or_prestige = triggerChanceOrPrestige(duty);
      toolbar_items.push(
        menuItemText({
          text: html`${unit_base} (${trigger_chance_or_prestige})`,
        }),
      );
    } else {
      toolbar_items.push(
        menuItemText({
          text: unit_base,
        }),
      );
    }
  } else {
    toolbar_items.push(
      menuItemText({
        text: `Vacant`,
      }),
    );
  }

  if (show_actions) {
    if (unit) {
      toolbar_items.push(
        menuItemAction({
          text: `Unassign`,
          tooltip: `Remove unit from this duty`,
          callback: () => {
            duty.unassignUnit();
            setup.DOM.Nav.goto();
          },
        }),
      );
    } else {
      toolbar_items.push(
        menuItemAction({
          text: `Assign`,
          tooltip: `Assign unit to this duty`,
          callback: () => {
            State.variables.gDuty_key = duty.key;
            setup.DOM.Nav.goto("DutyListAssign");
          },
        }),
      );
    }
  }

  // auto assign picker
  const auto_assign_param: MenuItemArgs = {
    text: `<span data-tooltip="If checked, then units on this duty can be selected to go on quests by quest auto-assign. Regardless of this settings, the unit can always be selected when using manual unit assignment.">Auto-assign pickable</span>`,
    checked: duty.isCanGoOnQuestsAuto(),
  };

  if (!show_actions) {
    toolbar_items.push(menuItemText(auto_assign_param));
  } else {
    auto_assign_param.callback = () => {
      duty.toggleIsCanGoOnQuestsAuto();
      setup.DOM.Nav.goto();
    };
    toolbar_items.push(menuItemAction(auto_assign_param));
  }

  // replace with temporary unit
  if (
    duty.getTemplate().isCanReplaceWithSpecialist() &&
    State.variables.fort.player.isHasBuilding("specialistoffice")
  ) {
    const specialist_param: MenuItemArgs = {
      text: `<span data-tooltip="When enabled, this duty will remain active even when the duty unit is busy, injured, or otherwise occupied. The unit will arrange for a skillful contract specialist to replace them in their absence, which will have to be paid ${setup.DUTY_SPECIALIST_WEEKLY_UPKEEP}g per week.">Specialist</span>`,
      checked: duty.isSpecialistEnabled(),
    };

    if (!show_actions) {
      toolbar_items.push(menuItemText(specialist_param));
    } else {
      specialist_param.callback = () => {
        duty.toggleIsSpecialistEnabled();
        setup.DOM.Nav.goto();
      };
      toolbar_items.push(menuItemAction(specialist_param));
    }
  }
  return toolbar_items;
}

export default {
  duty(
    duty_or_key: DutyInstance | DutyInstance["key"],
    show_actions?: boolean,
  ): DOM.Node {
    const duty = resolveObject(duty_or_key, State.variables.duty);

    const template = duty.getTemplate();

    const fragments: DOM.Attachable[] = [];

    const unit = duty.getAssignedUnit();

    fragments.push(
      setup.DOM.Util.menuItemToolbar(dutyNameActionMenus(duty, show_actions)),
    );

    const restrictions = template.getUnitRestrictions();
    if (restrictions.length) {
      fragments.push(setup.DOM.Card.cost(restrictions));
    }

    if (template.isHasPrestigeAmount() || template.isHasTriggerChance()) {
      const inner_fragments = [];

      inner_fragments.push(html` | `);

      const skills = template.getRelevantSkills();
      if (Object.keys(skills).length) {
        inner_fragments.push(html`Trigger chance: `);
        let init = true;

        for (const skill_key of objectKeys(skills)) {
          if (!init) {
            inner_fragments.push(html` + `);
          }
          init = false;

          const skill = setup.skill[skill_key];

          const val = skills[skill_key]!;
          inner_fragments.push(html`${(val * 100).toFixed(2)} `);
          if (unit && unit.getSkillFocuses().includes(skill)) {
            inner_fragments.push(html`${skill.repPositive()}`);
          } else {
            inner_fragments.push(html`${skill.rep()}`);
          }
        }
        inner_fragments.push(html` % | `);
      }

      const traits = template.getRelevantTraits();
      const positive = [];
      const negative = [];
      for (const [trait_key, value] of objectEntries(traits)) {
        const trait = setup.trait[trait_key];
        if (value < 0) {
          negative.push(trait);
        } else {
          positive.push(trait);
        }
      }

      if (positive.length) {
        inner_fragments.push(setup.DOM.Text.successlite("Good: "));
        for (const trait of positive) {
          if (unit && unit.isHasTraitExact(trait)) {
            inner_fragments.push(html`${trait.repPositive()}`);
          } else {
            inner_fragments.push(html`${trait.rep()}`);
          }
        }
        inner_fragments.push(html` | `);
      }

      if (negative.length) {
        inner_fragments.push(setup.DOM.Text.dangerlite("Bad: "));
        for (const trait of negative) {
          if (unit && unit.isHasTraitExact(trait)) {
            inner_fragments.push(html`${trait.repNegative()}`);
          } else {
            inner_fragments.push(html`${trait.rep()}`);
          }
        }
        inner_fragments.push(html` | `);
      }

      if (Object.keys(traits).length) {
        inner_fragments.push(
          setup.DOM.Util.message(`(full details)`, () => {
            return dutyFullDetails(duty, unit!);
          }),
        );
      }
      fragments.push(setup.DOM.create("div", {}, inner_fragments));
    }

    if (
      show_actions &&
      State.variables.menufilter.get("duty", "display") == "shortened"
    ) {
      fragments.push(
        setup.DOM.Util.message(`(description)`, () =>
          dutyDescriptionFragment(duty),
        ),
      );
    } else {
      fragments.push(dutyDescriptionFragment(duty));
    }

    const divclass = `dutycard`;
    return setup.DOM.create("div", { class: divclass }, fragments);
  },

  dutycompact(duty: DutyInstance, show_actions?: boolean): DOM.Node {
    return setup.DOM.Util.menuItemToolbar(
      dutyNameActionMenus(duty, show_actions),
    );
  },
};
