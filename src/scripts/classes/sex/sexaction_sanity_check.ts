import * as SexActionClass from "./action/_index";

// Sanity check the sex actions, make sure all their parameters are ok.
export function sexSanityChecks() {
  for (const sexaction of Object.values(SexActionClass)) {
    const to_test = Object.create(sexaction.prototype) as SexAction;

    // check actor description
    const actor_desc = to_test.getActorDescriptions();
    if (
      actor_desc.length == 0 ||
      actor_desc.length > setup.SexAction.ACTOR_NAMES.length
    ) {
      throw new Error(`Incorrect actor length for ${sexaction.name}`);
    }

    for (const desc of actor_desc) {
      if (!desc.paces)
        throw new Error(`Missing paces in cctor of ${sexaction.name}`);
    }

    // check tags
    const tags = to_test.getTags();
    for (const tag of tags) {
      if (!(tag in setup.TAG_SEXACTION)) {
        throw new Error(`Unknown tag ${tag} in ${sexaction.name}`);
      }
    }
    const sumdomnormal = tags.filter((tag) =>
      ["sub", "dom", "normal"].includes(tag),
    );
    if (sumdomnormal.length != 1) {
      throw new Error(
        `Odd number of sub/dom/normal tag for Sex Action: ${sexaction.name}`,
      );
    }

    // check restrictions
    const restrictions = to_test.getRestrictions();
    if (!Array.isArray(restrictions))
      throw new Error(`Restrictions of ${sexaction.name} must be an array`);

    // check outcomes
    const outcomes = to_test.getOutcomes();
    if (!Array.isArray(outcomes))
      throw new Error(`Outcomes of ${sexaction.name} must be an array`);
  }

  for (const permission of setup.SexClasses.getAllPermissions()) {
    for (const tag of permission.getDisallowedTags()) {
      if (!(tag in setup.TAG_SEXACTION)) {
        throw new Error(`Unknown tag in permission ${permission.key}: ${tag}`);
      }
    }
  }
}
