# 🦊 How to Add a New Subrace to Fort of Chains: Galvanized

![Version: 2.0](https://img.shields.io/badge/Version-2.0-green) ![Last  Updated: 2025-08-12](https://img.shields.io/badge/Last%20Updated-12--08--2025-blue)

> This guide walks you through **every step** to add a new subrace (not a main race) to the game, including lore, region, traits, and body part (skin) entries. All races added with this process are subraces and must be linked to a parent/main race.

---

## ✅ Quick Checklist

- [ ] Create a new lore file in `project/twee/lore/race/`
- [ ] Edit the `LORESETUP_race_*` passage (key, name, tags)
- [ ] Choose and set the correct region
- [ ] Write a detailed lore passage
- [ ] Add a new subrace trait in `trait/subrace.twee`
- [ ] Add a matching entry in `trait/_texts.twee`
- [ ] Create or update all required body part traits in `trait/skin/`
- [ ] Add body part text entries in `trait/_texts.twee`
- [ ] Link the race in the game (character creation, events, etc.)
- [ ] Test in-game and verify everything works

---

## 📝 Conventions

- **Always** use the `subrace_` prefix for subrace keys (e.g., `subrace_foxkin`).
- Use lowercase and underscores for keys.
- Keep naming consistent across all files and entries.

---

## 📄 1. Create a New Subrace Lore File

1. Go to `project/twee/lore/race/`
2. Copy an existing subrace file (e.g., `race_angel.twee`) and rename it to match your new subrace (e.g., `race_foxkin.twee`)

---

---

## 🛠️ 2. Edit the Lore Setup Passage

At the top of your new file, update the `LORESETUP_race_*` passage. Make sure the key and tags reflect that this is a subrace.

```twee
:: LORESETUP_race_foxkin [lore]
<<run new setup.Lore(
  'race_foxkin',  /* key */
  'Foxkin',       /* name */
  [ 'race', ],
  [ /* requirements */ ],
)>>
```

- Change the key and name to match your new race.
- Add or adjust tags and requirements as needed.

---

---

## 🗺️ 3. Select a Region for Your Race

Each race should be associated with a region. The available regions are defined in `src/scripts/text/race.ts`:

```ts
city:    City of Lucgate
vale:    Northern Vales
forest:  Western Forests
deep:    Deep
desert:  Eastern Deserts
sea:     Southern Seas
mist:    Mist
heaven:  Heavens
```

Pick the most appropriate region and use its key (e.g., `forest`, `desert`, etc.) in your race's setup/configuration.

---

---

## ✍️ 4. Write the Lore Passage

Below the setup, add a lore passage describing your race. Be as descriptive and immersive as possible—lewd or sensual elements are encouraged if they fit the race's theme.

**Guidelines:**

- Use evocative language for culture, appearance, and taboos.
- Lewd/erotic details are allowed and preferred if fitting.
- Use HTML and Twine macros as needed.
- Reference traits, skills, or magic using macros (e.g., `<<rep setup.trait.skill_archery>>`).
- End the file with a `<<questauthorcardtext "yourname">>` macro for credits/contact.

**Example:**

```twee
:: LORE_race_angel [nobr]

<p>
Celestial beings who greatly oppose the demons, with little to no official documentation recorded on their sightings, until now. It is believed that they are locked in an eternal battle with the residents of <<lore concept_mist>>. According to rumors and hearsay, they cannot enter the mortal plane by any means, except when their divinity has been stripped from them and made mortal, with falling in love and engaging in debased acts being the highest taboos amongst them.
</p>

<p>
But, there are speculations that some of the celestial beings who have been casted away retain their status, albeit in a perverse and twisted shape, known as <<rep setup.trait.race_fallen_angel>>
</p>

<p>
Possess a beautiful pair of feathery <<rep setup.trait.wings_angel>> -- while most come in white, there are occasional anomalies, possessing wings of different colors, though still retaining the feathery wings. The wings allow them to take <<rep setup.trait.skill_flight>>. It is said that angels are attuned to the <<lore magic_light>>, but since angel sightings are so rare, this has never been confirmed.
</p>

<<questauthorcardtext "fraazx">>
```

---

---

## 🧬 5. Add Subrace Traits

Add your new subrace to the trait system:

1. Open `project/twee/trait/subrace.twee`.
2. Add a new `setup.Trait` entry for your subrace, following the format of existing subraces. Make sure to include the parent race in the tags array.

Each subrace entry uses the following format:

```js
new setup.Trait(
  'subrace_key',      // Internal key for the subrace (e.g., 'subrace_foxkin')
  'Display Name',     // Name shown in-game (e.g., 'foxkin')
  'Description',      // Description shown in-game. Can use Twine macros and HTML.
  value,              // Rarity or value (number). Higher = rarer. 0 = common, higher = rarer.
  {},                 // Stat modifiers (object). Usually left empty for subraces.
  [tags],             // Array of tags. Should include rarity (e.g., 'common', 'rare'), and the parent race key (e.g., 'race_wolfkin').
  { options }         // (Optional) Extra options, e.g., { colors: true } to enable color variations.
)
```

You must also add a matching entry in `project/twee/trait/_texts.twee` for your subrace, using this format:

```js
subrace_foxkin: {
  noun: 'foxkin',                // The noun used for this subrace in text (e.g., 'foxkin', 'northerner', 'human')
  region: setup.Text.Race.REGIONS.forest, // The region this subrace is associated with (see available regions in step 3)
  company_key: 'foxkin',         // Key used for company/affiliation, usually matches subrace or region
},
```

**Field explanations:**

| Field         | Description |
|-------------- |------------|
| `subrace_key` | Unique internal identifier for the subrace. Should start with `subrace_`. |
| `Display Name`| The name as it appears to players. |
| `Description` | A flavorful description of the subrace. Can include Twine macros (e.g., `<<rep setup.trait.race_wolfkin>>`). |
| `value`       | Numeric rarity or value. 0 = common, higher numbers = rarer subraces. |
| `{}`          | Stat modifiers. Usually left empty for subraces, but can be used to give bonuses/penalties (e.g., `{ brawn: +0.2 }`). |
| `[tags]`      | Array of tags. Always include a rarity tag ('common', 'rare', etc.) and the parent race key (e.g., 'race_catkin'). |
| `{ options }` | (Optional) Extra options, such as `{ colors: true }` to allow color variations for this subrace. |

**_texts.twee fields:**

| Field         | Description |
|-------------- |------------|
| `noun`        | The noun used for this subrace in text (e.g., 'human', 'northerner', 'desertfolk', 'foreigner'). |
| `region`      | The region this subrace is associated with. Use one of the region constants from `setup.Text.Race.REGIONS` (see step 3 for the list). |
| `company_key` | Key used for company/affiliation, usually matches the subrace or region (e.g., 'humankingdom', 'humanvale'). |

---

---

## 🦴 6. Add Skin/Body Part Traits

Each race must have entries in the `project/twee/trait/skin/` folder for all major body parts. These traits define the appearance and flavor of each race's anatomy.

**Required body part traits:**

> - eyes
> - ears
> - mouth
> - body
> - wings (if applicable)
> - arms
> - legs
> - tail (if applicable)
> - dickshape
> - pussyshape

You may reuse existing body part traits from other races if it fits, but for maximum immersion, write unique and evocative descriptions for each part.

See the skin trait files here: [`project/twee/trait/skin/`](../../project/twee/trait/skin/)

Example: `project/twee/trait/skin/foxkin.twee` contains all body part traits for the foxkin race.

---

---

## 📝 7. Add Body Part Text Entries

For each body part (e.g., body, eyes, ears, mouth, arms, legs, tail, wings, dick, pussy, etc.) you add for your subrace, you must also add a corresponding entry in `project/twee/trait/_texts.twee`.

**Example:**

```ts
body_foxkin: {
  noun: 'slender, furred body', // Short noun for the body part
  description: 'a|possess a slender, furred body with a soft, tapered waist', // Main description
  flavor: 'Their fur is soft to the touch and sensitive in all the right places.', // (Optional) Extra flavor text
  size_adjective: ['soft', 'plush', 'furred', 'androgynous'], // (Optional) Adjectives for size/type
  adj_extra: ['soft', 'plush', 'androgynous'], // (Optional) Extra adjectives for more variety
  noun_extra: ['fur', 'tail', 'ears'], // (Optional) Extra nouns for more variety
},
```

**Common fields for body part entries:**

| Field           | Description |
|-----------------|-------------|
| `noun`          | Short noun for the body part (e.g., 'slender, furred body', 'cat-like eyes'). |
| `description`   | Main description for the body part, used in text generation. Can use the `a|text` macro for dynamic grammar (see below). |
| `flavor`        | (Optional) Extra flavor text for immersion. |
| `size_adjective`| (Optional) Array of adjectives describing the size/type (e.g., `['elven']`, `['giant']`, `['soft', 'plush', 'furred', 'androgynous']`). Used to add variety and flavor to generated text, such as "elven ears" or "plush tail". |
| `adj_extra`     | (Optional) Array of extra adjectives for more variety in generated text (e.g., `['soft', 'plush', 'androgynous']`). |
| `noun_extra`    | (Optional) Array of extra nouns for more variety in generated text (e.g., `['fur', 'tail', 'ears']`). |

**About the `a|text` macro:**
> The `a|text` syntax is a macro that automatically chooses the correct article or pronoun ("a", "an", "their", etc.) based on context, improving grammar in generated descriptions. Use it in `description` and `flavor` fields for best results.

Repeat for all relevant body parts (eyes, ears, mouth, arms, legs, tail, wings, dick, pussy, etc.) that your subrace uses.

---

---

## 🔗 8. Link the Race in the Game

- Ensure your new race is referenced where appropriate (e.g., in character creation, events, or other lore)
- Update any relevant lists or selection menus if required

---

---

## 🧪 9. Test Your Changes

- Compile and run the game
- Verify your new race appears correctly and lore displays as intended

---

---

> ⚡ **Coming soon: Race Creation Tool!**
> A visual tool to help you add and manage races will be available in a future update.
