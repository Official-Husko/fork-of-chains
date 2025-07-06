// @ts-nocheck


/**
 * @param {string} css_class
 * @param {any} text
 * @returns {setup.DOM.JSXElement}
 */
function createSpan(css_class, text) {
  const span = document.createElement('span')
  span.className = css_class
  span.appendChild(document.createTextNode(String(text)))
  return span
}

export const Text = {

  /**
   * <<successtext>>
   * @param {any} text
   * @returns {setup.DOM.JSXElement}
   */
  success(text) {
    return createSpan('successtext', text)
  },

  /**
   * <<successtextlite>>
   * @param {any} text
   * @returns {setup.DOM.JSXElement}
   */
  successlite(text) {
    return createSpan('successtextlite', text)
  },


  /**
   * <<dangertext>>
   * @param {any} text
   * @returns {setup.DOM.JSXElement}
   */
  danger(text) {
    return createSpan('dangertext', text)
  },

  /**
   * <<dangertextlite>>
   * @param {any} text
   * @returns {setup.DOM.JSXElement}
   */
  dangerlite(text) {
    return createSpan('dangertextlite', text)
  },


  /**
   * <<infotext>>
   * @param {any} text
   * @returns {setup.DOM.JSXElement}
   */
  info(text) {
    return createSpan('infotext', text)
  },

  /**
   * <<infotextlite>>
   * @param {any} text
   * @returns {setup.DOM.JSXElement}
   */
  infolite(text) {
    return createSpan('infotextlite', text)
  },

  /**
   * @param {number} number
   * @returns {string}
   */
  percentage(number) {
    return `${(number * 100).toFixed(2)}%`
  },

}

setup.DOM.Text = Text
