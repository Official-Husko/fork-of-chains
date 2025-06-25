/**
 * @file ContentImage.js
 * @module ContentImage
 * @description
 * Provides the ContentImage class for managing and retrieving content images and their metadata in the game.
 * Handles asynchronous loading of image metadata, mapping image paths to objects, and credit organization by artist.
 * Ensures robust error handling, type safety, and extensibility for future image management features.
 */

/**
 * ContentImage manages the loading, lookup, and credit organization of content images.
 * @class
 * @property {Object<string, ImageObject>} CONTENT_IMAGE_PATH_TO_OBJ - Maps image paths to their metadata objects.
 * @property {string} IMAGEMETA - Path to the image metadata JS file.
 * @property {string} IMAGE_DIR - Directory containing all content images.
 */
setup.ContentImage = class ContentImage extends setup.TwineClass {
  /**
   * Maps image paths to their metadata objects for fast lookup.
   * @type {Object<string, ImageObject>}
   */
  static CONTENT_IMAGE_PATH_TO_OBJ = {};

  /**
   * Path to the image metadata JS file.
   * @type {string}
   */
  static IMAGEMETA = "img/content/imagemeta.js";

  /**
   * Directory containing all content images.
   * @type {string}
   */
  static IMAGE_DIR = "img/content/all";

  /**
   * Asynchronously loads image metadata and populates the image path-to-object map.
   * Handles missing metadata gracefully and logs warnings if not found.
   */
  static initalize() {
    /**
     * Parses the image metadata and populates the image object map.
     * @param {string} directory - Directory containing images.
     * @param {Object} credits - Metadata/credits for images.
     * @returns {ImageObject[]} Array of image objects.
     */
    /**
     * Parses the image metadata and populates the image object map.
     * @param {string} directory - Directory containing images.
     * @param {Record<string, any>} credits - Metadata/credits for images.
     * @returns {ImageObject[]} Array of image objects.
     */
    function parseImageList(directory, credits) {
      /** @type {ImageObject[]} */
      const image_list = [];
      for (const image_key in credits) {
        const image_path = `${directory}/${image_key}`;
        const image_info = credits[image_key];
        const image_object = { path: image_path, info: image_info };
        setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ[image_path] = image_object;
        image_list.push(image_object);
      }
      return image_list;
    }

    /**
     * Loads the image metadata script and parses the image list.
     * If the metadata is missing or malformed, uses an empty credits object as fallback.
     * @param {string} imagemeta - Path to the metadata JS file.
     * @param {string} image_directory - Directory containing images.
     * @returns {Promise<void>}
     */
    function Construct(imagemeta, image_directory) {
      return importScripts(imagemeta).then(
        function () {
          // Try multiple possible global names for credits (IMAGE_CREDITS, UNITIMAGE_CREDITS)
          // @ts-ignore
          let credits = window.IMAGE_CREDITS || window.UNITIMAGE_CREDITS;
          if (!credits) {
            console.warn(`No image credits found in ${imagemeta}, using empty fallback.`);
            credits = {};
          }
          parseImageList(image_directory, credits);
          // Cleanup
          // @ts-ignore
          delete window["IMAGE_CREDITS"];
          // @ts-ignore
          delete window["UNITIMAGE_CREDITS"];
        },
        () => {
          // imagemeta not found. Use empty credits as fallback.
          console.warn(`Image meta for contents not found at ${imagemeta}, using empty fallback.`);
          parseImageList(image_directory, {});
        }
      );
    }

    Construct(setup.ContentImage.IMAGEMETA, setup.ContentImage.IMAGE_DIR);
  }

  /**
   * Retrieves the image object for a given image name, or null if not found.
   * Throws an error in debug mode if the image is missing from metadata.
   * @param {string} image_name - The name of the image file.
   * @returns {ImageObject|null} The image object or null if not found.
   */
  static getImageObjectIfAny(image_name) {
    const path = `${setup.ContentImage.IMAGE_DIR}/${image_name}`;
    if (path in setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ) {
      return setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ[path];
    } else {
      if (State.variables.gDebug) {
        throw new Error(`${image_name} not found in img/content/imagemeta.js!`);
      }
      return null;
    }
  }

  /**
   * Organizes and returns all image credits grouped by artist.
   * @returns {{ [artist: string]: ImageObject[] }} An object mapping artist names to arrays of image objects.
   */
  static getCreditsByArtist() {
    /** @type {{ [artist: string]: any[] }} */
    const result = {};
    for (const image of Object.values(setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ)) {
      if (image.info && typeof image.info.artist === "string") {
        if (!Object.prototype.hasOwnProperty.call(result, image.info.artist)) {
          result[image.info.artist] = [];
        }
        result[image.info.artist].push(image);
      }
    }
    return result;
  }
};
