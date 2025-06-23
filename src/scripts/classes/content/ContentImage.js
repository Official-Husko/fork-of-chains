setup.ContentImage = class ContentImage extends setup.TwineClass {

  /**
   * @type {Object<string, ImageObject>}
   */
  static CONTENT_IMAGE_PATH_TO_OBJ = {}

  static IMAGEMETA = `img/content/imagemeta.js`
  static IMAGE_DIR = `img/content/all`

  // warning: this is asynchronous!
  static initalize() {
    /**
     * @param {string} directory 
     * @param {*} credits 
     */
    function parseImageList(directory, credits) {
      const image_list = []
      for (const image_key in credits) {
        const image_path = `${directory}/${image_key}`
        const image_info = credits[image_key]

        const image_object = {
          path: image_path,
          info: image_info,
        }

        setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ[image_path] = image_object
        image_list.push(image_object)
      }
      return image_list
    }

    /**
     * @param {string} imagemeta
     * @param {string} image_directory
     */
    function Construct(imagemeta, image_directory) {
      return importScripts(imagemeta).then(function () {
        // @ts-ignore
        const credits = window.IMAGE_CREDITS
        if (!credits) throw new Error(`IMAGE_CREDITS not found in ${imagemeta}`)

        parseImageList(image_directory, credits)

        // Cleanup
        // @ts-ignore
        delete window.IMAGE_CREDITS
      }, () => { // imagemeta not found. It's fine, just give out a warning.
        console.log(`Image meta for contents not found`)
      })
    }

    Construct(setup.ContentImage.IMAGEMETA, setup.ContentImage.IMAGE_DIR)
  }

  /**
   * @param {string} image_name 
   * @returns {ImageObject | null}
   */
  static getImageObjectIfAny(image_name) {
    const path = `${setup.ContentImage.IMAGE_DIR}/${image_name}`
    if (path in setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ) {
      return setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ[path]
    } else {
      if (State.variables.gDebug) {
        throw new Error(`${image_name} not found in img/content/imagemeta.js!`)
      }
      return null
    }
  }

  static getCreditsByArtist() {
    const result = {}

    for (const image of Object.values(setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ)) {
      if (image.info) {
        if (!(image.info.artist in result)) {
          result[image.info.artist] = []
        }
        result[image.info.artist].push(image)
      }
    }
    return result
  }
}
