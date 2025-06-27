# 🧩 Content Guide

![Version: 1.0](https://img.shields.io/badge/Version-1.0-green) ![Last  Updated: 2025-06-27](https://img.shields.io/badge/Last%20Updated-27--06--2025-blue)

This document provides an idea of the content that can be added to the game **Fort of Chains: Galvanized**.

It lists a few things that we are actively looking for, as well as some content that can be added but is not a priority right now.

## 🚀 Sorely Needed Content

The big three are: **quests**, **mails**, and **events**.

- Living can be freely added, but they are not supported by the content creator. See [existing livings](https://github.com/Official-Husko/fork-of-chains/tree/main/project/twee/living) for templates.

- Other content such as items, furniture, buildings, etc. can be added, but do not have a specialized GUI. See [Adding Content Outside Content Creator](#%EF%B8%8F-adding-content-outside-content-creator).

- Sex Actions can be added too, but are more difficult (not supported by the Content Creator Tool). See [Sex Action Guide](https://github.com/Official-Husko/fork-of-chains/blob/main/docs/sexaction.md).

---

### ✍️ Rewriting & Proofreading

All rewrite and proofreading work are highly appreciated!

- Quests: [project/twee/quest](https://github.com/Official-Husko/fork-of-chains/tree/main/project/twee/quest) (subfolder for each author)
- Opportunities: [project/twee/opportunity](https://github.com/Official-Husko/fork-of-chains/tree/main/project/twee/opportunity)
- Events: [project/twee/event](https://github.com/Official-Husko/fork-of-chains/tree/main/project/twee/event)

Editing quest texts is self-explanatory inside each file.

---

### 📝 Text Works

Expanding texts in the game is always welcome!

- Banter texts: [src/scripts/text/raw/](https://github.com/Official-Husko/fork-of-chains/tree/main/src/scripts/text/raw)
- Unit adjectives/adverbs: [project/twee/trait/_texts.twee](https://github.com/Official-Husko/fork-of-chains/blob/main/project/twee/trait/_texts.twee), [project/twee/speech/_texts.twee](https://github.com/Official-Husko/fork-of-chains/blob/main/project/twee/speech/_texts.twee)
- Other text: [src/scripts/text](https://github.com/Official-Husko/fork-of-chains/tree/main/src/scripts/text)

---

## 🪙 Can Be Added

### 🧪 Items

Items that unlock features can be added manually (e.g., as quest rewards). Write your content first, then describe the item to the team, or add it yourself for testing:

To add an item, edit [questitem.twee](https://github.com/Official-Husko/fork-of-chains/blob/main/project/twee/item/questitem/questitem.twee):

```twee
<<run new setup.ItemQuest(
  'earth_badge',
  'Earth Badge',
  "A mysterious item that allows its wielder to manipulate earth."
)>>
```

- First parameter: item id (lowercase)
- Second: name
- Third: description

Consumable items:

- Not usable: [notusableitem.twee](https://github.com/Official-Husko/fork-of-chains/blob/main/project/twee/item/item/notusableitem.twee)
- Usable on units: [usableitem.twee](https://github.com/Official-Husko/fork-of-chains/blob/main/project/twee/item/item/usableitem.twee)
- Usable (no target): [usablefreeitem.twee](https://github.com/Official-Husko/fork-of-chains/blob/main/project/twee/item/item/usablefreeitem.twee)

**Remember to [compile the game](https://github.com/Official-Husko/fork-of-chains#compiling-instructions) after adding items!**

---

### 🏠 Living

New living can be freely added. See [existing livings](https://github.com/Official-Husko/fork-of-chains/tree/main/project/twee/living) for templates.

---

## 💤 Low Priority Content

### 🧬 Traits

There are over 400+ traits. New traits are **not a priority right now** as they add complexity, especially personality traits.

### ⭐ Perk Traits

**Perk traits are an exception:** They have gameplay effects only and are rare, given for noteworthy achievements.

### 🦄 Race

There are plans to add more **primary races** in the near future. **Subraces** can be added right away, but require significant effort. See [FAQ: New Races](https://github.com/Official-Husko/fork-of-chains/blob/main/docs/faq.md#new-races).

---

## 🪶 Submissive Content

Player submission is not the main theme, but you are welcome to add stories for submissive players. Restrict such content to characters with the submissive trait. In the content creator, use:

- (Add new restriction) → (You...) → (Unit's trait...) → (Unit must have this trait) → pick the submissive trait
- Or in code: `<<if $unit.player.isSubmissive()>><</if>>`

---

## 🛠️ Adding Content Outside Content Creator

### 🧪 Item, Equipment, Furniture

- Open the [item](https://github.com/Official-Husko/fork-of-chains/tree/main/project/twee/item), [equipment](https://github.com/Official-Husko/fork-of-chains/tree/main/project/twee/equipment), or [furniture](https://github.com/Official-Husko/fork-of-chains/tree/main/project/twee/furniture) folders.
- Append your new content to the appropriate file.
- For a new sex manual, add to [sexmanual.twee](https://github.com/Official-Husko/fork-of-chains/blob/main/project/twee/item/questitem/sexmanual.twee):

```twee
<<run new setup.ItemSexManual({
  key: 'sexmanual_mysexaction',
  name: 'Sex Manual: My Sex Action',
  description: "Unlocks 'My Sex Action' sex actions. Requires <<rep setup.item.sexmanual_mysexaction>> to use.",
  tags: [],
})>>
```

- Compile the game after adding new content.

### 🏗️ Building, Living

- Open the [building](https://github.com/Official-Husko/fork-of-chains/tree/main/project/twee/building) or [living](https://github.com/Official-Husko/fork-of-chains/tree/main/project/twee/living) folder.
- Copy a file as a base template and edit it.
- The game will detect new files after you compile.
