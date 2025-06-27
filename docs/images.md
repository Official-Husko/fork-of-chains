# 🖼️ Image Guide

This document is mainly for adding unit portraits and quest/event images.
For adding new room images, see [Room Image Guide](docs/roomimages.md).
For adding quest or event images, see [Adding Images to Quests or Events](#adding-images-to-quests-or-events).
For adding unit portraits, read on.

## 🧑‍🎨 How Unit Portraits Work

The way the portrait is calculated is the following.

- Start at the top folder
- Go to the correct subrace folder, e.g., `gender_male/subrace_humankingdom`
- Find all images here and in subfolders or subfolder of subfolder that matches the unit's traits.
- Choose one of these portraits, prioritizing the ones that are located in the deepest subfolder.

If you have multiple image packs, then the game will combine all these image packs together into one
folder before doing the above.

## 📦 Loading a Custom Image Pack

The game supports adding extra custom-made unit portrait packs (called imagepacks). See
[dist/imagepacks/example] for an example image pack.
You need to then enable them in the game:

- Load your save
- Go to `Settings`
- Go to `Edit Image Packs`
- Click `(add new image pack)`
- Enter the image pack name

## 🏗️ Creating Your Own Image Pack

### 1️⃣ Initializing

Start by copying `dist/imagepacks/example` to, say, `dist/imagepacks/yourpack`.
`yourpack` will be the name of your imagepack.
Next, go inside `dist/imagepacks/yourpack`, and open `imagemeta.js` with a text editor.

Replace the `title`, `author`, and `description` with the description of your image pack.
For example:

```js
 IMAGEPACK = {
    title: "My Imagepack",
    author: "myself",
    description: "My own custom personal image pack",
 }
```

Please note the double quotes.

### 2️⃣ Populating the Top Folder

The image pack works by populating the information about the images in `imagemeta.js`.
The top folder is `dist/imagepacks/yourpack`. You almost always want to have two subfolders here, a
`gender_male` and `gender_female`, for male and female units.
(See [here](docs/traits.md) for the list of all traits in the game.)
You then need to declare that there are two subfolders here, again by writing in
`imagemeta.js`:

```js
/* The following is list of direct subdirectories. */
UNITIMAGE_LOAD_FURTHER = ["gender_male", "gender_female", ]
```

In that file, you will also see:

```js
/* Image credit information. */
UNITIMAGE_CREDITS = {
}
```

This is empty, since there are no portraits in this folder. We will come back to this later.

### 3️⃣ Populating the Image Pack

Now suppose we want to add a new male orc portrait. Continuing, open the
`dist/imagepacks/yourpack/gender_male` directory.

There is also an `imagemeta.js` file here, open it.

First, we need to create a folder for the orc image.
From [here](docs/traits.md), we know that orcs are called
`subrace_orc`, so create the `dist/imagepacks/yourpack/gender_male/subrace_orc` folder.
Declare it inside `dist/imagepacks/yourpack/gender_male/imagemeta.js`:

```js
/* The following is list of direct subdirectories. */
UNITIMAGE_LOAD_FURTHER = ["subrace_humanvale", "subrace_orc", ]
```

Next, add your image into the `dist/imagepacks/yourpack/gender_malesubrace_orc` directory,
for example: `dist/imagepacks/yourpack/gender_malesubrace_orc/1.jpg`.
The subrace_orc` directory also needs an `imagemeta.js` file, so copy the `imagemeta.js` file
from `dist/imagepacks/yourpack/gender_male/imagemeta.js` into
`dist/imagepacks/yourpack/gender_malesubrace_orc/imagemeta.js`.

Finally, we need to declare the image inside the `imagemeta.js` file.

Open it, and change the following:

```js
/* Image credit information. */
UNITIMAGE_CREDITS = {
  1: {
    title: "My portrait",
    artist: "Me",
    url: "https://pixabay.com/id/users/arttower-5337/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2159912",
    license: "My own work",
  },
}
```

The `1` indicates your image name (`1.jpg`), and the rest are self-explanatory.
**Important**: Name cannot be a combination of number and letters, e.g.,
`2v` would NOT work.

Suppose you have another image: `orc.jpg` in that folder, then this would instead become:

```js
/* Image credit information. */
UNITIMAGE_CREDITS = {
  1: {
    title: "My portrait",
    artist: "Me",
    url: "https://pixabay.com/id/users/arttower-5337/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2159912",
    license: "My own work",
  },
  orc: {
    title: "My second portrait",
    artist: "Me again",
    url: "https://pixabay.com/id/users/arttower-5337/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2159912",
    license: "My own work",
  },
}
```

Finally, we need to declare that this folder does not have any subfolder:

```js
/* The following is list of direct subdirectories. */
UNITIMAGE_LOAD_FURTHER = []
```

You are done!

### 4️⃣ Verifying Image Pack and Syntax Checking

> [!WARNING]
> The following Node.js script is currently used to verify your image pack and check the syntax, but it will be replaced soon with a Go-based equivalent.

If you have `nodejs` installed, you can run:

```bash
node dev/checkImageMeta.js --check dist/imagepacks/example
```

You can find the script here: [checkImageMetas.js](https://github.com/Official-Husko/fork-of-chains/blob/main/dev/checkImageMetas.js) (Made by contributor Naraden)

## 🖼️ Adding Images to Quests or Events

Quest and event images largely use the same format as unit images above.
The step-by-step to add images to quests is as follows:

1. **Add your image data into the game:**
   1. Open your own local copy of [`imagemeta.js`](https://github.com/Official-Husko/fork-of-chains/blob/main/dist/img/content/imagemeta.js) using a text editor
   2. Append your image info. For example, if your image is titled `abc.jpg`, you can add:

      ```js
      "abc.jpg": {
        title: "A B C...",
        artist: "Myself",
        url: "https://www.deviantart.com/myid/1234/abc",
        license: "CC-BY-NC 3.0",
      },
      ```

   3. Add the image into your own local copy of [`dist/img/content/all`](https://github.com/Official-Husko/fork-of-chains/tree/main/dist/img/content/all)
2. **Add it into the quest/event:**
   1. Open your copy of the corresponding quest file, for example [`GiftExchange.twee`](https://github.com/Official-Husko/fork-of-chains/blob/main/project/twee/quest/darko/city/GiftExchange.twee)
   2. Add the image using the `<<questimage 'a.jpg'>>` command. In that file, there are two possible variations of the image, based on the gender of the slave. For example:

      ```twine
      <<if $gOutcome == 'crit'>>
        <<if $g.gift.isMale()>>
          <<questimage 'gift_exchange_male.jpg'>>
        <<else>>
          <<questimage 'gift_exchange_female.jpg'>>
        <</if>>
      <</if>>
      ```

3. **Compile and open `index.html`:**
   See the [compiling instructions](https://github.com/Official-Husko/fork-of-chains#compiling-instructions).

> [!NOTE]
> If you do this via the content creator, it will also work, but you MUST put the images and edit the `imagemeta.js` file BEFORE you open the content creator. This is because the game only loads the images once, at the start of the game.
