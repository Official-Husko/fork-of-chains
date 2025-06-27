# 🏷️ Trait System Guide

![Version: 1.0](https://img.shields.io/badge/Version-1.0-green) ![Last  Updated: 2025-06-27](https://img.shields.io/badge/Last%20Updated-27--06--2025-blue)

Traits are a powerful way to add depth and complexity to characters in the game. They can represent physical attributes, personality traits, or special abilities. This guide explains how to use traits effectively in your content.

## ⚡ Shortcuts & Examples

- `<<if unit.isHasTrait('muscle_strong')>>I have either muscle strong, muscle very strong, or muscle extremely strong<</if>>`
- `<<if unit.isHasTraitExact('muscle_strong')>>I have muscle strong, not more not less.<</if>>`
- `<<if unit.isHasTrait('race_demon')>>I am a demon<</if>>`
- `<<if unit.getSpeech() == setup.speech.friendly>>My personality is friendly<</if>>`

(There are only 5 speech types: `setup.speech.friendly`, `setup.speech.bold`, `setup.speech.cool`, `setup.speech.witty`, and `setup.speech.debauched`.)

### Example: Using speech patterns for text variation

````twee
Your slaver greets the client
<<if unit.getSpeech() == setup.speech.friendly>>
  by cheerfully wishing them well.
<<elseif unit.getSpeech() == setup.speech.bold>>
  by shaking hands in a dignified way.
<<elseif unit.getSpeech() == setup.speech.cool>>
  with a simple nod.
<<elseif unit.getSpeech() == setup.speech.witty>>
  with a mischievous smile.
<<else>>
  while crudely looking at the client's genitals.
<</if>>
````

- `<<if unit.isHasDick()>>I have dick<</if>>`
- `<<if unit.isHasVagina()>>I have vagina<</if>>`
- `<<if unit.isHasBreasts()>>I have breast<</if>>`
- `<<if unit.isHasBalls()>>I have balls<</if>>`
- `<<if unit.isMale()>>I am male and NOT a sissy<</if>>` (note: slavers cannot be sissies)
- `<<if unit.isFemale()>>I am female OR sissy<</if>>` (note: slavers cannot be sissies)
- `<<if unit.getWings()>>I have a wing<</if>>`
- `<<if unit.getTail()>>I have a tail<</if>>`
- `<<if unit.isMindbroken()>>I am mindbroken<</if>>`
- `<<if unit.isSubmissive()>>I am submissive<</if>>`
- `<<if unit.isDominant()>>I am dominant<</if>>`
- `<<if unit.isMasochistic()>>I am masochistic<</if>>`
- `<<if unit.isCanTalk()>>I am not gagged or forbidden from talking<</if>>`
- `<<if unit.isCanWalk()>>I am in bondage or forbidden from walking<</if>>`
- `<<if unit.isCanSee()>>I am blindfolded<</if>>`
- `<<if unit.isCanOrgasm()>>I am in chastity or forbidden from orgasming<</if>>`
- `<<rep setup.trait.race_elf>>`: icon of the elf

---

## 📋 List of All Traits

Please see the in-game Database for the list of all traits, including their keys.
