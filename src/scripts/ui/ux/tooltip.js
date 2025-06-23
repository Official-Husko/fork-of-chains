/**
 * Adds support for html-rich and wikified tooltips 
 * Usage:
 *   <span data-tooltip="Some text" [args...]>
 *      Hover over me!
 *   </span>
 * 
 * 
 * Optional args: (used like: <span data-tooltip="..." data-tooltip-wide>)
 *   wide: make tooltip wider than usual (used for e.g. rep cards)
 *   noclick: disable opening the tooltip on click
 *   delay: if set, tooltip opening will be delayed by 1s 
 */

import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

/** 
 * Keeps a list of the tooltip instances, so on DOM changes they can be destroyed
 * @type {ReturnType<typeof tippy>}
 */
const tooltip_instances = []

/**
 * Helper function that creates an instance of a tooltip, called lazily when first triggered (hover/click)
 * @param {Element} target
 */
function createTooltipInstanceIfMissing(target) {
  // check if instance already exists
  // tippy stores its instance in the DOM element in ._tippy (when created)
  // @ts-ignore
  let instance = target._tippy

  if (instance) // already created: do nothing
    return

  const content_element = document.createElement('div')
  content_element.className = "tooltip"

  const content = target.getAttribute("data-tooltip") || ''

  const animated = State.variables.settings.animatedtooltips
  const showAnimDuration = animated ? 300 : 0
  const showDelay = animated ? 150 : 0

  // Render tooltip content (wikified)
  State.temporary.foctimed_is_tooltip = (State.temporary.foctimed_is_tooltip || 0) + 1
  $(content_element).wiki(content)
  State.temporary.foctimed_is_tooltip -= 1

  /** @type {any} */
  const placement = target.getAttribute("data-tooltip-placement") || undefined
  const distance = +target.getAttribute("data-tooltip-distance") || 0

  instance = tippy(target, {
    content: content_element,
    duration: [showAnimDuration, 0], // animation duration
    delay: target.getAttribute("data-tooltip-delay") !== null ? [500, 0] : [showDelay, 0], // time on hover before tooltip opens
    maxWidth: target.getAttribute("data-tooltip-wide") !== null ? 860 : undefined,
    trigger: target.getAttribute("data-tooltip-noclick") !== null ? 'mouseenter' : 'mouseenter click',
    placement: placement,
    offset: [0, distance],
    showOnCreate: true,
    zIndex: Dialog.isOpen() ? 100100 : 90000, // sugarcube dialogs zindex = 100000
    appendTo: document.body,
    onTrigger(instance, ev) {
      if (ev.type === "click") {
        instance.setProps({ interactive: true })
      }
    },
    onHide(instance) {
      instance.setProps({ interactive: false })
    },
    onDestroy(instance) {
      const i = tooltip_instances.indexOf(instance)
      if (i !== -1)
        tooltip_instances.splice(i, 1)
    },
  })

  tooltip_instances.push(instance)
}

/**
 * Helper function to find a node with "data-tooltip" set in the parent chain
 * @returns {Element|null}
 */
function findDataTooltip(ev) {
  if (ev.target instanceof Element) {
    let node = ev.target
    while (node) {
      const attr = node.getAttribute("data-tooltip")
      if (attr)
        return node
      node = node.parentElement
    }
  }
  return null
}

let checkTooltipReferencesTimeout = null // to debounce calls to checkTooltipReferences

function destroyTooltip(instance) {
  instance.setProps({ // fixes issue of .hide() called by tippy after destroyed
    hideOnClick: false
  })
  instance.destroy()
  instance.clearDelayTimeouts()
}

// Checks that all tooltip references (targets) are still valid DOM elements
// attached to document, otherwise destroy those instances
function checkTooltipReferences() {
  checkTooltipReferencesTimeout = null

  for (const instance of tooltip_instances.filter(
    instance => (!instance.reference || !instance.reference.isConnected))) {
    destroyTooltip(instance)
  }
}

//
// Attach global listeners
// 

document.body.addEventListener("click", function (ev) {
  const elem = findDataTooltip(ev)
  if (elem)
    createTooltipInstanceIfMissing(elem)
})

document.body.addEventListener("mouseover", function (ev) {
  const elem = findDataTooltip(ev)
  if (elem)
    createTooltipInstanceIfMissing(elem)
})


//
// Listen on DOM tree changes, to destroy tooltips when the reference elements are hidden or removed
//

function setupMutationObserver() {
  setTimeout(function () {

    const observer = new MutationObserver(function (/*mutationsList, observer*/) {
      if (!checkTooltipReferencesTimeout) // call checkTooltipReferences, debounced
        checkTooltipReferencesTimeout = setTimeout(checkTooltipReferences, 1)
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
      childList: true,
      subtree: true
    })

  }, 1)
}

if (document.readyState === "complete") {
  setupMutationObserver()
} else {
  document.addEventListener('DOMContentLoaded', setupMutationObserver, false)
}
