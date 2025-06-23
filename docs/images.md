# Image guide

This document is mainly for adding unit portraits and quest/event images.
For adding new room images, see [here](docs/roomimages.md).
For adding quest or event images, see [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/images.md#adding-images-to-quests-or-events).
For adding unit portraits, read on.

## How unit portrait works

The way the portrait is calculated is the following.

- Start at the top folder
- Go to the correct subrace folder, e.g., `gender_male/subrace_humankingdom`
- Find all images here and in subfolders or subfolder of subfolder that matches the unit's traits.
- Choose one of these portraits, prioritizing the ones that are located in the deepest subfolder.

If you have multiple image packs, then the game will combine all these image packs together into one
folder before doing the above.

## Loading an custom image pack

The game supports adding extra custom-made unit portrait packs (called imagepacks). See
[dist/imagepacks/example] for an example image pack.
You need to then enable them in the game:
  - Load your save
  - Go to `Settings`
  - Go to `Edit Image Packs`
  - Click `(add new image pack)`
  - Enter the image pack name

## Creating your own image pack

### Initializing

Start by copying `dist/imagepacks/example` to, say, `dist/imagepacks/yourpack`.
`yourpack` will be the name of your imagepack.
Next, go inside `dist/imagepacks/yourpack`, and open `imagemeta.js` with a text editor.

Replace the `title`, `author`, and `description` with the description of your image pack.
For example:

```
 IMAGEPACK = {
    title: "My Imagepack",
    author: "myself",
    description: "My own custom personal image pack",
 }
```

Please note the double quotes.

### Populating the top folder

The image pack works by populating the information about the images in `imagemeta.js`.
The top folder is `dist/imagepacks/yourpack`. You almost always want to have two subfolders here, a
`gender_male` and `gender_female`, for male and female units.
(See [here](docs/traits.md) for the list of all traits in the game.)
You then need to declare that there are two subfolders here, again by writing in
`imagemeta.js`:

```
/* The following is list of direct subdirectories. */
UNITIMAGE_LOAD_FURTHER = ["gender_male", "gender_female", ]
```

In that file, you will also see:

```
/* Image credit information. */
UNITIMAGE_CREDITS = {
}
```

This is empty, since there are no portraits in this folder. We will come back to this later.

### Populating the image pack.

Now suppose we want to add a new male orc portrait. Continuing, open the
`dist/imagepacks/yourpack/gender_male` directory.

There is also an `imagemeta.js` file here, open it.

First, we need to create a folder for the orc image.
From [here](docs/traits.md), we know that orcs are called
`subrace_orc`, so create the `dist/imagepacks/yourpack/gender_male/subrace_orc` folder.
Declare it inside `dist/imagepacks/yourpack/gender_male/imagemeta.js`:

```
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

```
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

```
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

```
/* The following is list of direct subdirectories. */
UNITIMAGE_LOAD_FURTHER = []
```

You are done!

### Verifying image pack and syntax checking

If you have `nodejs` installed, there is a script you can run to verify 
the correctness of your image pack and check the syntax [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/dev/checkImageMetas.js). (Made by contributor Naraden)

Example use:

`node dev/checkImageMeta.js --check dist/imagepacks/example`

## Adding New Portraits to the Repository

Here are several guidelines on what to consider for adding new images into this repository:

#### Do you have the required permission?
  - Most of the images in the game are licensed under CC-BY-NC-ND 3.0, but some are under other creative commons or public domain
  - Is the image also licensed to another company with "All rights reserved"?
    - Preferably not used
  - Have you credited the artist properly?
  - If you are allowed to modify the image, did you specify the modifications? 
    - Can use the `extra` property, e.g.:

```
  50: {
    title: "Title of the art",
    artist: "artistname",
    url: "https://www.deviantart.com/somename/123456",
    license: "CC-BY-SA 3.0",
    extra: "cropped the empty white space",
  },
```

#### Image color, resolution and size
  - Image should be colored
    - Exception is when the image would still appear black and white even when it is colored properly
      - E.g., picture of the dead of the night
  - Image area (i.e. height x width) should be at least 640000 (e.g., 800 x 800 or 1000 x 640)
  - Image should be in `.jpg` format
  - Image size should be at most 250kb. This is HARD limit. Preferably under 200kb or less.
    - To achieve this, you can encode the image using `.jpg` with optimizatio threshold `80`
  - No real porn
    - Would break immersion in a fantasy game

#### Watermarks and Texts
  - Image should not contain text about the image's name
    - E.g., an image of batman with the word "Batman" in it is a no.
  - Artist watermarks are ok as long as they are not disruptive.
    - Link to patreon, artist signature, etc, are ok!

#### Consistency and Quality
  - Is the image good and sexy?
    - Subjective, but no stick drawing etc
  - Does the image fits the units it is going to represent? Here are a couple of guidelines:
    - Human (vale): Vikings, tribalmen, mountainfolk, cold-themed
    - Human (kingdom): Cityfolks, wind-themed
    - Human (desert): Arabic, nomads, desertfolk, tanned skin, fire-themed
    - Human (sea): Anime, exotic
    - Angel: Angels
    - Werewolf: Werewolves, anthro wolves
    - Elf: Elves, fairy.
    - Drow: Drow, dark elf
    - Fairy: Fairies, Fae,
    - Neko: Cat ears, cat tail, human body. Not for other type of ears / tails.
    - Tigerkin: Tiger anthro, Tabixi
    - Orc: Orcs, greenskins, occasionally trolls and ogres
    - Kobold: kobold
    - Lizardkin: Lizardmen, lizardfolk, scalies.
    - Dragonkin: Dragonborns, and the lizardkin with wings
    - Demon: Demon, devil, succubus.
    - Demonkin: Tiefling


### Adding Images to Quests or Events.

Quest and event images largely use the same format as unit images above.
The step-by-step to add images to quests is as follows:

1. First, add your image data into the game:
  1. Open your own local copy of [this file](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/dist/img/content/imagemeta.js) using a text editor
  2. Append your image info. For example, if your image is titled "abc.jpg", you can add:
  ```
    "abc.jpg": {
      title: "A B C...",
      artist: "Myself",
      url: "https://www.deviantart.com/myid/1234/abc",
      license: "CC-BY-NC 3.0",
    },
  ```
  3. Add the image into your own local copy of [this directory](https://gitgud.io/darkofocdarko/fort-of-chains/-/tree/master/dist/img/content/all)
2. Next, add it into the quest / event
  1. Open your copy of the corresponding quest file, for example [this file](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/project/twee/quest/darko/city/GiftExchange.twee) 
  2. Add the image using the `<<questimage 'a.jpg'>>` command.
  In [that file](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/project/twee/quest/darko/city/GiftExchange.twee), there are two possible variations of the image, based on the gender of the slave.
  Hence, you would find:
  ```
    <<if $gOutcome == 'crit'>>
      <<if $g.gift.isMale()>>
        <<questimage 'gift_exchange_male.jpg'>>
      <<else>>
        <<questimage 'gift_exchange_female.jpg'>>
      <</if>>
    <</if>>
  ```
3. Finally, [compile and open index.html](https://gitgud.io/darkofocdarko/fort-of-chains#compiling-instructions)

Note that if you do this via the content creator, it will also work, but you MUST
put the images and edit the `imagemeta.js` file BEFORE you open the content creator.
This is because the game only loads the images once, at the start of the game.


