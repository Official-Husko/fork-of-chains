// @ts-nocheck

setup.DOM.Util.Image = {}

/**
 * @typedef {{
 *   image_name: string,
 *   fallback?: string,
 *   tooltip?: string,
 *   image_class?: string,
 *   extra_styles?: string,
 * }} ImageLoadArgs
 * 
 * @param {ImageLoadArgs} args
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.Image.load = function ({
  image_name,
  fallback,
  tooltip,
  image_class,
  extra_styles,
}) {
  const imageurl = (window.IMAGES && window.IMAGES[image_name]) || image_name

  /** @type {setup.DOM.Attributes<'img'>} */
  const img_params = {
    src: imageurl,
  }
  if (image_class) {
    img_params['class'] = image_class
  }
  if (extra_styles) {
    img_params['style'] = extra_styles
  }

  let retriedAsPng = false

  const img = /** @type {HTMLImageElement} */ (setup.DOM.create('img', img_params))
  img.addEventListener('error', () => {
    if (!retriedAsPng) {
      retriedAsPng = true
      if (!imageurl.endsWith('.png')) {
        const src = imageurl.replace(/\.[^/]+$/, '.png')
        if (img.src !== src) {
          img.src = src
          return
        }
      }
    }

    if (fallback) {
      img.src = fallback
    }
  })

  const params = {}
  if (tooltip) {
    return setup.DOM.create('span', { 'data-tooltip': tooltip }, img)
  } else {
    // Don't wrap this with span, due to CSS shenanigan in unit description page.
    return img
  }
}

/**
 * 
 * @param {setup.DOM.Node} image 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.Image.flipHorizontal = function (image) {
  return html`
  <span class='flip-horizontal'>
    ${image}
  </span>
  `
}

/**
 * 
 * @param {ImageMetadata | setup.Unit} object
 * @param {'room'} [kind]
 */
setup.DOM.Util.Image.credits = function (object, kind) {
  /** @type {ImageMetadata|undefined} */
  let credits
  if (object && 'artist' in object) {
    credits = object
  } else if (object && 'getImageInfo' in object) {
    credits = object.getImageInfo()
  } else {
    return null
  }

  const url = credits?.url || (kind === 'room' && 'https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/tileset_credits.md')
  const extra = credits?.extra || (kind === 'room' && 'See URL for complete tileset credits')

  if (credits) {
    return html`
      <span class='artistinfo'>
        "${credits.title || "Unknown Title"}" by ${credits.artist || "Unknown Artist"}
        ${url ? setup.DOM.Nav.linkExternal(`(source)`, url) : ``}
        (${credits.license || "Unknown License"})
        ${extra ? `[${extra}]` : ``}
        ${credits.imagepack ? ` : ${credits.imagepack}` : ''}
      </span>
    `
  } else {
    return null
  }
}


/**
 * @param {string} image_name
 * @returns {setup.DOM.Node | null}
 */
setup.DOM.Util.Image.contentimage = function (image_name) {
  if (State.variables.settings.hidecontentimages) {
    return null
  }

  const image_object = setup.ContentImage.getImageObjectIfAny(image_name)
  if (!image_object) {
    if (State.variables.gDebug) {
      throw new Error(`Missing content image: ${image_name}`)
    }
    return null
  }

  return html`
    <figure class='content-image-figure'>
      ${setup.DOM.Util.onEvent(
    'click',
    setup.repImg({ imagepath: image_object.path, extra_class: 'content-image' }),
    () => {
      setup.Dialogs.openImage(
        image_object,
        image_object.info.title ?? 'Unknown Title',
      )
    }
  )}
      <figcaption>
        ${setup.DOM.Util.Image.credits(image_object.info)}
      </figcaption>
    </figure>
  `
}

/**
 * 
 * @param {setup.DOM.Node} image 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.Image.flipHorizontal = function (image) {
  return html`
  <span class='flip-horizontal'>
    ${image}
  </span>
  `
}
