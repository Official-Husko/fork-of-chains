/**
 * ContentImage.ts
 * ----------------
 * This module defines the ContentImage class, which manages the loading, mapping, and retrieval of content images and their associated metadata for the game.
 * 
 * Key Responsibilities:
 * - Asynchronously loads image metadata from a specified JavaScript file (imagemeta.js) using importScripts.
 * - Maps image paths to ImageObject instances for efficient lookup and retrieval.
 * - Handles missing or malformed metadata gracefully, providing robust error handling and debug support.
 * - Organizes image credits by artist for display or attribution purposes.
 * - Cleans up dynamically loaded global variables to avoid polluting the global namespace.
 * 
 * Best Practices:
 * - Always use type-safe access for dynamic globals (window.IMAGE_CREDITS, window.UNITIMAGE_CREDITS) and clean up after use.
 * - Use clear, descriptive error messages and warnings for missing or malformed data.
 * - Keep all image metadata and mapping logic encapsulated within the ContentImage class.
 * - Use explicit type annotations for all function parameters and return types.
 * - Document all public methods and static properties for maintainability.
 * 
 * Usage Example:
 *   setup.ContentImage.initalize();
 *   const imgObj = setup.ContentImage.getImageObjectIfAny('portrait.jpg');
 *   const credits = setup.ContentImage.getCreditsByArtist();
 */

// Ensure global type augmentation is loaded for dynamic globals
/// <reference path="../../types/misc.d.ts" />

// Declare global game objects and state
// 'setup' is the SugarCube global for game logic and classes
// 'State' is the SugarCube global for game state and variables
// 'importScripts' loads external JS files dynamically

declare const setup: any;
declare function importScripts(...urls: string[]): Promise<void>;

/**
 * ContentImage class manages all content images and their metadata for the game.
 * Provides static methods for initialization, lookup, and credit organization.
 */
setup.ContentImage = class ContentImage extends setup.TwineClass {
  /**
   * Maps image file paths to their corresponding ImageObject.
   * Used for fast lookup and retrieval of image metadata.
   */
  static CONTENT_IMAGE_PATH_TO_OBJ: Record<string, ImageObject> = {};

  /**
   * Path to the main image metadata JavaScript file.
   * This file should define IMAGE_CREDITS or UNITIMAGE_CREDITS on the global object.
   */
  static IMAGEMETA: string = "img/content/imagemeta.js";

  /**
   * Directory containing all content images referenced by the game.
   */
  static IMAGE_DIR: string = "img/content/all";

  /**
   * Initializes the content image system by loading metadata and mapping images.
   * Should be called once at game startup.
   *
   * Loads the metadata file, parses the image list, and cleans up global variables.
   * Handles missing or malformed metadata gracefully, logging warnings as needed.
   */
  static initalize() {
    /**
     * Parses the image metadata and builds the image path-to-object map.
     * @param directory - The directory containing the images.
     * @param credits - The metadata object mapping image names to metadata.
     * @returns An array of ImageObject instances.
     */
    function parseImageList(directory: string, credits: Record<string, any>): ImageObject[] {
      const image_list: ImageObject[] = [];
      for (const image_key in credits) {
        const image_path = `${directory}/${image_key}`;
        const image_info = credits[image_key];
        const image_object: ImageObject = { path: image_path, info: image_info };
        setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ[image_path] = image_object;
        image_list.push(image_object);
      }
      return image_list;
    }

    /**
     * Loads the image metadata script and parses the image list.
     * If the metadata is missing or malformed, uses an empty credits object as fallback.
     * Cleans up global variables after use to avoid polluting the global namespace.
     *
     * @param imagemeta - Path to the metadata JS file.
     * @param image_directory - Directory containing images.
     * @returns A promise that resolves when loading and parsing is complete.
     */
    function Construct(imagemeta: string, image_directory: string): Promise<void> {
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
          delete window.IMAGE_CREDITS;
          delete window.UNITIMAGE_CREDITS;
        },
        () => {
          // imagemeta not found. Use empty credits as fallback.
          console.warn(`Image meta for contents not found at ${imagemeta}, using empty fallback.`);
          parseImageList(image_directory, {});
        }
      );
    }

    // Begin initialization by loading the main metadata file
    Construct(setup.ContentImage.IMAGEMETA, setup.ContentImage.IMAGE_DIR);
  }

  /**
   * Retrieves the ImageObject for a given image name, or null if not found.
   * Throws an error in debug mode if the image is missing from metadata.
   *
   * @param image_name - The name of the image file (e.g., 'portrait.jpg').
   * @returns The ImageObject if found, or null if not found.
   */
  static getImageObjectIfAny(image_name: string): ImageObject | null {
    const path = `${setup.ContentImage.IMAGE_DIR}/${image_name}`;
    if (path in setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ) {
      return setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ[path];
    } else {
      // In debug mode, throw an error for missing images to aid development
      if (typeof State.variables.gDebug === 'boolean' && State.variables.gDebug) {
        throw new Error(`${image_name} not found in img/content/imagemeta.js!`);
      }
      return null;
    }
  }

  /**
   * Organizes and returns all image credits grouped by artist.
   * Useful for displaying attributions or generating credits lists.
   *
   * @returns An object mapping artist names to arrays of ImageObject instances.
   */
  static getCreditsByArtist(): { [artist: string]: ImageObject[] } {
    const result: { [artist: string]: ImageObject[] } = {};
    for (const imageUnknown of Object.values(setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ)) {
      const image = imageUnknown as ImageObject;
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
