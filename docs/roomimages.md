# 🖼️ Room Image Guide

![Version: 1.0](https://img.shields.io/badge/Version-1.0-green) ![Last  Updated: 2025-06-27](https://img.shields.io/badge/Last%20Updated-27--06--2025-blue)

This guide explains how to add images for rooms in the game. Room images enhance the visual experience and help players immerse themselves in the game world.

## 🏗️ How Room Images Work

Every room has a "key", which you can view from the In-Game Database.
For each such room, it looks for the folder named
`img/room/(roomkey)/`, and looks for the file called `imagemeta.js` inside.
For example, for the `Construction Office`, its key is `constructionoffice`,
and the game will look for the `img/room/constructionoffice/imagemeta.js` file.

The file describes the images for this room. A room can have multiple images.
The format is similar with [unit images](docs/images.md), but with two key differences:

- `imagemeta.js` inside unit images will determine the extension (e.g., `.jpg`) automatically, while here, the extension is described in `imagemeta.js`.  For example, `"a.svg": ...` if you have an image titled `a.svg`, or `"a.png": ...` for a png.
- There is an extra keyword, `directional: true`, which indicates that the image has unique images for each of the four rotations. In this case, if you put `imagename.jpg`, then you should create `imagename-s.jpg`, `imagename-w.jpg`, `imagename-n.jpg`, and `imagename-e.jpg`, which are the images for when the entrance is facing south, west, north, and east, respectively.

## 🎨 Image Guidelines

The game is very welcome if you would like to contribute room images!
[(Related to this issue)](https://github.com/Official-Husko/fork-of-chains/issues/290)

The following is a guideline so that the images mesh well with each other:

- **✅ Ensure you lend / have the necessary permissions to use the artwork in this game.**
  For example, most of the artworks currently in the game is licensed under CC-BY-NC-ND 3.0.
- 🖌️ It should be colored
- 📏 Each tile is one metre times one metre long. Therefore, a room covering 2x3 tiles is 2m x 3m. Design your rooms with this in mind.
- 🗜️ The image file sizes should not exceed 100kb. This is because the game can display more than 200 rooms in a page, and if the image sizes are too large, this could cause slow down.
- 🖼️ If it's an SVG, then the size should be 32 pixels per tile. Otherwise, no restriction on image size, only on file size
- 💬 Finally, be prepared that your contribution might receive some feedbacks instead of being immediately put into the game

You can test your image by putting it into the correct folder as described before.
If the folder does not exist (e.g., you are adding an image for a room that does not have
an image before), you should make a new folder as well as the `imagemeta.js` (which you can
copy-paste from the ones found in the other room folders).

Many of the current images are made using [Tiled](https://www.mapeditor.org/).
See [tileset credits](https://github.com/Official-Husko/fork-of-chains/blob/main/docs/tileset_credits.md) for the full list of tileset, their licenses, and their credits.
The tileset used in this game are [in the tilesets directory](docs/tilesets).

### 🧪 Verifying Syntax

> [!WARNING]
> The following Node.js script is currently used to verify your image pack and check the syntax, but it will be replaced soon with a Go-based equivalent.

If you have `nodejs` installed, you can run:

```bash
node dev/checkImageMeta.js --check --room
```

You can find the script here: [checkImageMetas.js](https://github.com/Official-Husko/fork-of-chains/blob/main/dev/checkImageMetas.js) (Made by contributor Naraden)

Example use (future):

```bash
go run dev/checkImageMetas.go --check --room
```

For now, you can still use the Node.js script [checkImageMetas.js](https://github.com/Official-Husko/fork-of-chains/blob/main/dev/checkImageMetas.js) until the Go version is released.
