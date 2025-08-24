import { createSignal, For, Show } from "solid-js";
import type { FilterAllArgs, ObjectWithKey } from "../util/filter";

export interface Section<T extends ObjectWithKey, D = T> {
  title: string;
  get_objects: () => readonly T[];
  get_display_object?: (obj: T) => D;

  menu: FilterAllArgs<T, D>["menu"];
  display_callback: FilterAllArgs<T, D>["display_callback"];
  style_override?: FilterAllArgs<T, D>["style_override"];
}

function wikiSection<T extends ObjectWithKey, D = T>(args: Section<T, D>) {
  return args;
}

const WIKI_SECTIONS = [
  wikiSection({
    title: "Quests",
    menu: "questtemplate",
    get_objects: () => Object.values(setup.questtemplate),
    display_callback(quest_template) {
      return setup.DOM.Card.questtemplate(quest_template);
    },
  }),
  wikiSection({
    title: "Opportunities",
    menu: "opportunitytemplate",
    get_objects: () => Object.values(setup.opportunitytemplate),
    display_callback(opportunity_template) {
      return setup.DOM.Card.opportunitytemplate(opportunity_template);
    },
  }),

  wikiSection({
    title: "Events",
    menu: "event",
    get_objects: () => Object.values(setup.event),
    display_callback(event) {
      return setup.DOM.Card.event(event);
    },
  }),

  wikiSection({
    title: "Interactions",
    menu: "interaction",
    get_objects: () => Object.values(setup.interaction),
    display_callback(interaction) {
      return setup.DOM.Card.interaction(interaction);
    },
  }),

  wikiSection({
    title: "Activities",
    menu: "activitytemplate",
    get_objects: () => Object.values(setup.activitytemplate),
    display_callback(template) {
      return setup.DOM.Card.activitytemplate(template);
    },
  }),

  wikiSection({
    title: "Traits",
    menu: "trait",
    get_objects: () => Object.values(setup.trait),
    style_override:
      "display: grid; grid-template-columns: repeat(auto-fill, minmax(34px, 1fr))",
    display_callback(trait) {
      return trait.rep();
    },
  }),

  wikiSection({
    title: "Items and Furniture",
    menu: "item",
    get_objects: () => Object.values(setup.item),
    get_display_object: (item) => ({ item: item, quantity: 1 }),
    display_callback(item_obj) {
      if (State.variables.menufilter.get("item", "display") == "compact") {
        return setup.DOM.Card.itemcompact(item_obj.item);
      } else {
        return setup.DOM.Card.item(item_obj.item);
      }
    },
  }),

  wikiSection({
    title: "Equipments",
    menu: "equipment",
    get_objects: () => Object.values(setup.equipment),
    display_callback(equipment_obj) {
      if (State.variables.menufilter.get("equipment", "display") == "compact") {
        return setup.DOM.Card.equipmentcompact(equipment_obj);
      } else {
        return setup.DOM.Card.equipment(equipment_obj);
      }
    },
  }),

  wikiSection({
    title: "Buildings",
    menu: "buildingtemplate",
    get_objects: () => Object.values(setup.buildingtemplate),
    display_callback(buildingtemplate) {
      if (
        State.variables.menufilter.get("buildingtemplate", "display") ==
        "compact"
      ) {
        return setup.DOM.Card.buildingtemplatecompact(buildingtemplate);
      } else {
        return setup.DOM.Card.buildingtemplate(buildingtemplate);
      }
    },
  }),

  wikiSection({
    title: "Rooms",
    menu: "roomtemplate",
    get_objects: () => Object.values(setup.roomtemplate),
    display_callback(roomtemplate) {
      if (
        State.variables.menufilter.get("roomtemplate", "display") == "compact"
      ) {
        return setup.DOM.Card.roomtemplatecompact(roomtemplate);
      } else {
        return setup.DOM.Card.roomtemplate(roomtemplate);
      }
    },
  }),

  wikiSection<any, any>({
    title: "Sex Actions",
    menu: "sexaction",
    get_objects: () => setup.sexaction.filter((action) => action.desc()),
    display_callback(sexaction) {
      if (State.variables.menufilter.get("sexaction", "display") == "compact") {
        return setup.DOM.Card.sexactioncompact(sexaction);
      } else {
        return setup.DOM.Card.sexaction(sexaction);
      }
    },
  }),

  wikiSection({
    title: "Companies",
    menu: "company",
    get_objects: () => Object.values(State.variables.company),
    display_callback(company) {
      if (State.variables.menufilter.get("company", "display") == "compact") {
        return setup.DOM.Card.companycompact(company);
      } else {
        return setup.DOM.Card.company(company);
      }
    },
  }),

  wikiSection({
    title: "Lore",
    menu: "lore",
    get_objects: () => Object.values(setup.lore),
    display_callback(lore) {
      if (State.variables.menufilter.get("lore", "display") == "compact") {
        return setup.DOM.Card.lorecompact(lore);
      } else {
        return setup.DOM.Card.lore(lore);
      }
    },
  }),

  wikiSection({
    title: "Duties",
    menu: "dutytemplate",
    get_objects: () => Object.values(setup.dutytemplate),
    display_callback(duty_template) {
      return (
        setup.DutyTemplate.getTypeRep(duty_template.getType()) +
        setup.DOM.Util.domCardName(duty_template)
      );
    },
  }),

  wikiSection({
    title: "Living",
    menu: "living",
    get_objects: () => Object.values(setup.living),
    display_callback(living) {
      return setup.DOM.Card.living(living);
    },
  }),

  wikiSection({
    title: "Titles",
    menu: "title",
    get_objects: () => Object.values(setup.title),
    display_callback(title) {
      return title.rep();
    },
  }),
] as const;

function renderSection<T extends ObjectWithKey, D = T>(section: Section<T, D>) {
  const objects = section.get_objects();

  return setup.DOM.Util.filterAll({
    menu: section.menu,
    filter_objects: objects,
    style_override: section.style_override,
    display_objects: section.get_display_object
      ? objects.map(section.get_display_object)
      : undefined,
    display_callback: section.display_callback,
  });
}

let lastWikiSection: number | null = null;

export const IngameWiki: Component = () => {
  const [getSection, setSection] = createSignal<number | null>(lastWikiSection);
  return (
    <>
      <For each={WIKI_SECTIONS}>
        {(section, i) => {
          return (
            <>
              {i() > 0 && " · "}
              <a
                style={
                  i() === getSection()
                    ? { color: "cyan", "text-decoration": "underline" }
                    : undefined
                }
                onClick={(ev) => {
                  ev.preventDefault();
                  lastWikiSection = i();
                  setSection(i());
                }}
              >
                {section.title}
              </a>
            </>
          );
        }}
      </For>

      <hr />

      <Show when={getSection() !== null}>
        <div>{renderSection(WIKI_SECTIONS[getSection()!] as any)}</div>
      </Show>
    </>
  );
};
