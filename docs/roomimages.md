# Room image guide

## How room images works

Every room has a "key", which you can view from the In-Game Database.
For each such room, it looks for the folder named
`img/room/(roomkey)/`, and looks for the file called `imagemeta.js` inside.
For example, for the `Construction Office`, its key is `constructionoffice`,
and the game will look for the `img/room/constructionoffice/imagemeta.js` file.

The file describes the images for this room. A room can have multiple images.
The format is similar with [unit images](docs/images.md), but with two key differences:

- `imagemeta.js` inside unit images will determine the extension (e.g., `.jpg`) automatically, while here, the extension is described in `imagemeta.js`.  For example, `"a.svg": ...` if you have an image titled `a.svg`, or `"a.png": ...` for a png.
- There is an extra keyword, `directional: true`, which indicates that the image has unique images for each of the four rotations. In this case, if you put `imagename.jpg`, then you should create `imagename-s.jpg`, `imagename-w.jpg`, `imagename-n.jpg`, and `imagename-e.jpg`, which are the images for when the entrance is facing south, west, north, and east, respectively.

## Image guidelines

The game is very welcome if you would like to contribute room images!
[(Related to this issue)](https://gitgud.io/darkofocdarko/fort-of-chains/-/issues/290)

The following is a guideline so that the images mesh well with each other:

- **Ensure you lend / have the necessary permissions to use the artwork in this game.**
For example, most of the artworks currently in the game is licensed under
CC-BY-NC-ND 3.0.
- It should be colored
- Each tile is one metre times one metre long. Therefore, a room covering 2x3 tiles
is 2m x 3m. Design your rooms with this in mind.
- The image file sizes should not exceed 100kb. This is because the game can display
more than 200 rooms in a page, and if the image sizes are too large, this could cause
slow down.
- If it's an SVG, then the size should be 32 pixels per tile. Otherwise, no restriction on
image size, only on file size
- Finally, be prepared that your contribution might receive some feedbacks instead of
being immediately put into the game

You can test your image by putting it into the correct folder as described before.
If the folder does not exist (e.g., you are adding an image for a room that does not have
an image before), you should make a new folder as well as the `imagemeta.js` (which you can
copy-paste from the ones found in the other room folders).

Many of the current images are made using [Tiled](https://www.mapeditor.org/).
See [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/tileset_credits.md) for the full list of tileset, their licenses, and their credits.
The tileset used in this game are [here](docs/tilesets).

### Verifying syntax

If you have `nodejs` installed, there is a script you can run to verify 
the correctness of your image pack and check the syntax [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/dev/checkImageMetas.js). (Made by contributor Naraden)

Example use:

`node dev/checkImageMeta.js --check --room`
