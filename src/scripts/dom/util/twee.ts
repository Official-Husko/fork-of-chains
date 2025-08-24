export default {
  replaceUnitInFragment(fragment: DOM.Node): DOM.Node {
    let last_text = "";

    [
      fragment,
      ...fragment.querySelectorAll("*:not(script):not(noscript):not(style)"),
    ]
      .reverse()
      .forEach(({ childNodes: [...nodes] }) =>
        nodes
          .filter(({ nodeType }) => nodeType === document.TEXT_NODE)
          .reverse()
          .forEach((textNode) => {
            textNode.textContent = setup.Text.fixArticles(
              setup.Text.replaceUnitMacros(textNode.textContent),
              last_text,
            );
            if (textNode.textContent.trim()) {
              last_text = textNode.textContent;
            }
          }),
      );

    return fragment;
  },

  /**
   * Renders a string with twee code (text potentially including macros and html)
   * into a Document Fragment.
   */
  twee(twee_text: string): DocumentFragment {
    const fragment = document.createDocumentFragment();
    new Wikifier(fragment, setup.DevToolHelper.stripNewLine(twee_text));
    return fragment;
  },
};
