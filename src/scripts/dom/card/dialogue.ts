export default {
  /**
   * Renders a unit saying a dialogue.
   */
  dialogue({
    unit,
    dialogue,
    position,
    content_image,
  }: {
    unit: Unit;
    dialogue: string;
    position?: "left" | "right";
    content_image?: string;
  }): DOM.Node {
    if (!position) {
      position = "left";
    }

    const fragments: DOM.Attachable[] = [];

    let image_object = null;
    if (content_image) {
      image_object = setup.ContentImage.getImageObjectIfAny(content_image);
    }
    if (!image_object) {
      image_object = setup.UnitImage.getImageObject(unit.getImage());
    }

    fragments.push(
      setup.DOM.create(
        "div",
        {
          class: `dialogue-card-unit dialogue-card-unit-${position}`,
        },
        setup.DOM.Util.onEvent(
          "click",
          setup.DOM.Util.Image.load({ image_name: image_object.path }),
          () => {
            if (content_image) {
              setup.Dialogs.openImage(
                image_object,
                image_object.info.title ?? "Unknown Title",
              );
            } else {
              setup.Dialogs.openUnitImage(unit);
            }
          },
        ),
      ),
    );

    fragments.push(setup.DOM.create("div", {}, html`${unit.rep()}:`));
    fragments.push(
      setup.DOM.create(
        "div",
        {
          class: `dialogue-card-text dialogue-card-text-${unit.getGender().key} dialogue-card-text-${position}`,
        },
        html`<div>
          "${twee`${setup.DevToolHelper.stripNewLine(dialogue.trim())}`}"
        </div>`,
      ),
    );

    return setup.DOM.create(
      "div",
      { class: "dialogue-card-container" },
      fragments,
    );
  },
};
