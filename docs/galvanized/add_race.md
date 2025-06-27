<!-- File Version: 1.0 | Last Updated: 2025-06-25 -->

# 🧬 How to Add Additional Races to Fort of Chains: Galvanized

> **This guide explains how to add new races to the Fort of Chains: Galvanized Twine JS game using the existing lore and setup structure.**

---

## 🗂️ 1. Create a New Race Lore File

1. Navigate to:
   `project/twee/lore/race/`
2. Copy an existing race file (e.g., `race_angel.twee`) and rename it to match your new race, such as `race_elf.twee`.

---

## ✏️ 2. Edit the Lore Setup Passage

At the top of your new file, update the `LORESETUP_race_*` passage:

```twee
:: LORESETUP_race_elf [lore]
<<run new setup.Lore(
  'race_elf',  /* key */
  'Elf',       /* name */
  [ 'race' ],  /* tags */
  [ /* visibility requirements */ ],
)>>
```

- Change `'race_elf'` and `'Elf'` to your new race’s key and display name.
- Add or adjust tags and requirements as needed.

**Example:**

```twee
:: LORESETUP_race_golem [lore]
<<run new setup.Lore(
  'race_golem',
  'Golem',
  [ 'race', 'construct' ],
  [ 'quest_golemAwakened' ],
)>>
```

---

## 📖 3. Write the Lore Passage

Below the setup, add a lore passage describing your race:

```twee
:: LORE_race_elf [nobr]

<p>
Elves are mystical forest dwellers, known for their agility and affinity with nature.<br>
They possess keen senses and are skilled in <<rep setup.trait.skill_archery>>.<br>
Elves are attuned to the <<lore magic_nature>>.
</p>
```

- Use HTML and Twine macros as needed.
- Reference traits, skills, or magic using the appropriate macros (e.g., `<<rep setup.trait.skill_archery>>`).

**Example:**

```twee
:: LORE_race_golem [nobr]

<p>
Golems are magical constructs, animated by ancient runes.<br>
They are immune to poison and do not require sleep.<br>
Golems are often found guarding ruins or serving powerful mages.
</p>
```

---

## 🔗 4. Link the Race in the Game

- Ensure your new race is referenced where appropriate (e.g., in character creation, events, or other lore).
- Update any relevant lists or selection menus if required.

---

## 🧪 5. Test Your Changes

- Compile and run the game.
- Verify your new race appears correctly and lore displays as intended.

---

> ⚡ **Coming soon: Race Creation Tool!**
> A visual tool to help you add and manage races will be available in a future update.

---

<img src="https://raw.githubusercontent.com/Official-Husko/fork-of-chains/refs/heads/main/dist/assets/favicon.png" alt="Fort of Chains: Galvanized Logo" width="32" height="32">
