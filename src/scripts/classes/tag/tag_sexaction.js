/**
 * Sex Action Tag Definitions
 * -----------------------------------
 * This object defines all tags used to categorize and describe sex actions in the game.
 * Tags are grouped by their type: "class", "subdom", "type", or "bodypart".
 *
 * @typedef {{
 *   type: string,
 *   title?: string,
 *   description: string,
 *   hide?: boolean
 * }} SexActionTag
 *
 * @type {Object.<string, SexActionTag>}
 *
 * Tag Types:
 *   - "class":    Used for internal logic, not shown to players (e.g. endsex, orgasm)
 *   - "subdom":   Indicates dominance/submission flavor (dom, sub, normal)
 *   - "type":     Describes the action's effect or context (penetration, relief, etc.)
 *   - "bodypart": Indicates which body part is involved (mouth, penis, tail, etc.)
 *
 * Example usage:
 *   // Get the description for the "penetration" tag
 *   const desc = setup.TAG_SEXACTION.penetration.description;
 *
 * Expected structure:
 *   setup.TAG_SEXACTION = {
 *     tagKey: {
 *       type: "class" | "subdom" | "type" | "bodypart",
 *       title?: string,
 *       description: string,
 *       hide?: boolean,
 *     },
 *     ...
 *   }
 */
setup.TAG_SEXACTION = {
  // ===== Class tags (internal logic, not shown to player) =====
  endsex: {
    type: "class",
    description: "Ends sex",
    hide: true,
  },
  orgasm: {
    type: "class",
    description: "Orgasms",
    hide: true,
  },
  positionself: {
    type: "class",
    description: "Changes own position",
    hide: true,
  },
  positionother: {
    type: "class",
    description: "Changes other's position",
    hide: true,
  },
  poseself: {
    type: "class",
    description: "Changes own pose",
    hide: true,
  },
  poseother: {
    type: "class",
    description: "Changes other's pose",
    hide: true,
  },
  equipmentself: {
    type: "class",
    description: "Changes self's equipment",
    hide: true,
  },
  equipmentother: {
    type: "class",
    description: "Changes other's equipment",
    hide: true,
  },
  penetrationstartdom: {
    type: "class",
    description: "Initiates a penetration as a dom",
    hide: true,
  },
  penetrationstartsub: {
    type: "class",
    description: "Initiates a penetration as a sub",
    hide: true,
  },
  penetrationenddom: {
    type: "class",
    description: "Ends a penetration as a dom",
    hide: true,
  },
  penetrationendsub: {
    type: "class",
    description: "Ends a penetration as a sub",
    hide: true,
  },

  // ===== Dom/Sub tags (flavor: dominant, neutral, submissive) =====
  dom: {
    type: "subdom",
    title: "Dominant",
    description: "Leaning towards a dominant action",
  },
  normal: {
    type: "subdom",
    title: "Neutral",
    description: "Does not particularly lean towards dominant or submissive",
  },
  sub: {
    type: "subdom",
    title: "Submissive",
    description: "Leaning towards a submissive action",
  },

  // ===== Type tags (action context/effect) =====
  orgasm_type: {
    type: "type",
    title: "Orgasm",
    description: "Reach climax",
  },
  penetration: {
    type: "type",
    title: "Penetration",
    description: "Initiates a penetration",
  },
  discomfort: {
    type: "type",
    title: "Discomforting",
    description: "Gives significant discomfort",
  },
  relief: {
    type: "type",
    title: "Relieving",
    description: "Reduces discomfort",
  },
  pose: {
    type: "type",
    title: "Pose",
    description: "A sexual pose",
  },
  equipment: {
    type: "type",
    title: "Equipment",
    description: "Special equipment to use during sex",
  },

  // ===== Bodypart tags (which body part is involved) =====
  anus: {
    type: "bodypart",
    title: "Anus",
    description: "Involves the anus",
  },
  arms: {
    type: "bodypart",
    title: "Arms",
    description: "Involves use of the hands or fingers",
  },
  breasts: {
    type: "bodypart",
    title: "Breasts",
    description: "Involves nipples or breasts",
  },
  legs: {
    type: "bodypart",
    title: "Legs",
    description: "Involves the use of the feet",
  },
  mouth: {
    type: "bodypart",
    title: "Mouth",
    description: "Involves the mouth",
  },
  penis: {
    type: "bodypart",
    title: "Penis",
    description: "Involves the penis or strap-on",
  },
  tail: {
    type: "bodypart",
    title: "Tail",
    description: "Involves use of the tail",
  },
  vagina: {
    type: "bodypart",
    title: "Vagina",
    description: "Involves the vagina",
  },
  nobodypart: {
    type: "bodypart",
    title: "No associated bodypart",
    description: "Does not particularly involve any bodypart",
  },
};

// Freeze the object to prevent modifications during runtime
Object.freeze(setup.TAG_SEXACTION);
