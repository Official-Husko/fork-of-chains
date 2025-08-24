/**
 * Output helpers for friendship macros.
 *
 * `internalOutput` appends plain text to an output node. Use this for simple,
 * non-wiki text.
 *
 * `wikiOutput` wraps the result with a jQuery element and calls `.wiki(...)`
 * so the returned text can contain wiki markup handled by the Twine environment.
 */

export function internalOutput<T>(
  output: HTMLElement | DocumentFragment,
  func: (...args: T[]) => string,
  ...params: T[]
) {
  output.appendChild(document.createTextNode(func(...params)));
}

export function wikiOutput<T>(
  output: HTMLElement | DocumentFragment,
  func: (...args: T[]) => string,
  ...params: T[]
) {
  const wrapper = $(document.createElement("span"));
  // `wrapper.wiki` is provided by the Twine/jQuery environment and accepts
  // wiki-markup text to be rendered into DOM nodes.
  wrapper.wiki(func(...params));
  wrapper.appendTo(output);
}
