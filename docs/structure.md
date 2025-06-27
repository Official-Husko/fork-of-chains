# 🧭 Code Tutorial

![Version: 1.0](https://img.shields.io/badge/Version-1.0-green) ![Last  Updated: 2025-06-27](https://img.shields.io/badge/Last%20Updated-27--06--2025-blue)

Welcome to Fort of Chains: Galvanized code documentation. The goal of this document is to smooth out your
entry into the game's code as much as possible, and hopefully get you to contribute asap!

---

## 🆕 First Issue

A good way to get started is to pick some of the first issues in
[the issue list](https://github.com/Official-Husko/fork-of-chains/issues).
They have been curated to be easily doable, but remains useful to the code.

---

## 📝 Twine and SugarCube Basics

This game is written in Twine, SugarCube 2, and ES6 Javascript (with JSDocs).
The vast majority of the logic and code are done in Javascript, while
Twine and SugarCube 2 are mainly responsible for UI and written content,
such as author's writings.
As a coder, you would expect to spend most of your time writing in Javascript.
The Twine and SugarCube language will only be used to call on your javascript code.

### ✏️ Example

As an example, [this is the Twine code for the quest manual assignment menu](https://github.com/Official-Husko/fork-of-chains/blob/main/project/twee/loop/questhub/questassign.twee#L17):

```twine
:: QuestAdhocAssign [nobr]

<<set $gMenuVisible = false>>

<<set _quest = $questinstance[$gAdhocQuest_key]>>
<<set _dom = setup.DOM.Menu.questassign(_quest)>>
<<attach _dom>>
```

> **Note:**
> - `:: QuestAdhocAssign [nobr]` declares a Twine **passage** (like an HTML page).
> - `<<set $gMenuVisible = false>>` uses SugarCube 2 syntax to set a global variable.
> - `$varname` variables are persistent (saved), `_varname` are temporary (not saved).
> - `<<set _dom = setup.DOM.Menu.questassign(_quest)>>` calls a Javascript function and stores the result.
> - `<<attach _dom>>` renders the DOM fragment to the user.

In Javascript, the function is defined [in questassign.js](https://github.com/Official-Husko/fork-of-chains/blob/main/src/scripts/dom/menu/questassign.js):

```js
/**
 * 
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.questassign = function (quest) {
  fragments = []
  // ...
  return setup.DOM.create('div', {}, fragments)
}
```

---

## 📋 Details

You should have enough information to start working on your first issue now.
The rest of this document details more information, should you wish to read more.
You can find [SugarCube 2 documentation here](https://www.motoslave.net/sugarcube/2/docs/).

### ⚠️ SugarCube 2 Caveats

> **Tip:**
> Fort of Chains uses custom navigation macros for performance. Standard SugarCube navigation (like `<<goto>>`, `<<link>>`) is replaced with custom ones. See [Navigation](#navigation) below.

---

## 🖊️ Coding Style

**Document as much as you can with JSDocs!**

- Write the types for the parameters and output values for functions using JSDocs. Example:

```js
/**
  * Builds a room
  *
  * @param {setup.BuildingTemplate} template 
  * @param {setup.RoomInstance} [room]
  * @returns {setup.RoomInstance | null}
  */
build(template, room) {
  // ...
}
```

- PascalCase for classes `setup.BuildingInstance`
- camelCase for methods `unit.getTraits()`
- snake_case for properties and variable names `unit.first_name` (don't access this directly! use `unit.getName()`)
- lowercasenospace for data `setup.buildingtemplate.veteranhall`

---

## 🖥️ Editor Recommendation

You are of course free to use whatever editor you like. If you are unsure what editor to use,
Visual Studio Code works fairly well for this project.

---

## 📦 Code / Logic / Javascript Files

All javascript code are located in [src/scripts](https://github.com/Official-Husko/fork-of-chains/tree/master/src/scripts).
Css codes are in [src/styles](https://github.com/Official-Husko/fork-of-chains/tree/master/src/styles).
NPM / Yarn will compile them into [project/scripts](https://github.com/Official-Husko/fork-of-chains/tree/master/project/scripts)
and [project/styles](https://github.com/Official-Husko/fork-of-chains/tree/master/project/styles).

> **Info:**
> The load order of the javascript files is alphabetical. Use imports when possible, but some legacy code relies on this order.

The javascript source code directory is structured roughly as follows:

- All in-game classes (Company, Trait, Skill, Unit, etc): `src/scripts/classes`
- Text (procedural banters): `src/scripts/text`
- Unit names: `src/scripts/names`
- Miscellaneous: `src/scripts/util` (except Twine macros: `src/scripts/macro`)
- External libraries: `src/scripts/lib`
- In-game constants: `src/scripts/constants.js`
- UI: `src/scripts/dom`

---

## 🧭 Navigation

For optimization, the game does not use Twine's native navigation system (e.g., `[[Hi|Passage]]`). Instead, use these commands:

| Macro | Replaces |
|-------|----------|
| `<<focmove 'Click me!' 'Passage'>>` | `[[Click me!|Passage]]` |
| `<<focreturn 'Done!'>>` | `<<return 'Done!'>>` |
| `<<focgoto 'PassageName'>>` | `<<goto 'PassageName'>>` |
| `<<focgoto>>` | Refresh current page |
| `<<foclink 'a' 'b'>><<run console.log('Hi')>><</foclink>>` | `<<link 'a' 'b'>>` |

In Javascript, these are:

- `setup.DOM.Nav.move`
- `setup.DOM.Nav.return`
- `setup.DOM.Nav.goto`
- `setup.DOM.Nav.link`

> **Note:** In Content Creator, use Twine's default navigation system.

---

## 🧩 Class Modularity

The game follows feature modularity. New features should be self-contained in their own class (e.g., `setup.Tattoo`).
All objects must inherit from `TwineClass` due to [SugarCube restrictions](https://www.motoslave.net/sugarcube/2/docs/#guide-tips-non-generic-object-types).

---

## 💾 How the Objects are Stored and Saved by the Game

SugarCube maintains three locations for your variables:

- **setup**: Global namespace for objects that do not change during playthrough (e.g., `setup.questtemplate`).
- **State.variables**: Variables that change and are saved (e.g., `State.variables.unit`).
- **State.temporary**: Temporary variables, not saved (e.g., `State.temporary.unit`).

In Twine files (`.twee`):
- `$unit` refers to `State.variables.unit`
- `_unit` refers to `State.temporary.unit`

---

## 🖼️ setup.DOM

All UI logic is in Javascript under the `setup.DOM` namespace ([see directory](https://github.com/Official-Husko/fork-of-chains/tree/master/src/scripts/dom)).

- `dom/card`: Cards (unit, quest, etc.)
- `dom/menu`: Menus (unit detail, etc.)
- `dom/util`: Helper functions returning Document Fragments
- `dom/helper`: Helper functions (not returning Document Fragments)
- `dom/nav`: Navigation macro equivalents

**Helpers:**
- `html` template tag for fragments
- `setup.DOM.create` for element creation

---

## 📁 Important Files

- Entry point: [story.twee](https://github.com/Official-Husko/fork-of-chains/blob/master/project/twee/story.twee)
- Backwards compatibility: [backwardscompat.js](https://github.com/Official-Husko/fork-of-chains/blob/master/src/scripts/util/backwardscompat.js)
- Sidebar menu: [menu.twee](https://github.com/Official-Husko/fork-of-chains/blob/master/project/twee/meta/menu.twee)
- Initialization: [initvars](https://github.com/Official-Husko/fork-of-chains/tree/master/project/twee/initvars)
- Passage transition: [navigation.js](https://github.com/Official-Husko/fork-of-chains/blob/master/src/scripts/macro/navigation.js)

---

## 🏗️ Dom Writing Guidelines

All DOM-related code should be in [this directory](https://github.com/Official-Husko/fork-of-chains/tree/master/src/scripts/dom).

- `dom/card`: Cards (unit, quest, etc.)
- `dom/menu`: Menus
- `dom/util`: Helper functions returning Document Fragments
- `dom/helper`: Helper functions (not returning Document Fragments)
- `dom/nav`: Navigation macro equivalents

Access via `setup.DOM` singleton (e.g., `setup.DOM.Card`).

---
