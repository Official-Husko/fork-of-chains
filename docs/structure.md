# Code Tutorial

Welcome to Fort of Chains code documentation. The goal of this document is to smooth out your
entry into the game's code as much as possible, and hopefully get you to contribute asap!

# First issue

A good way to get started is to pick some of the first issues in
[the issue list](https://gitgud.io/darkofocdarko/fort-of-chains/-/issues).
They have been curated to be easily doable, but remains useful to the code.

The rest of this document will explain the important concepts of the codebase of this game.

# Twine and SugarCube Basics

This game is written in Twine, SugarCube 2, and ES6 Javascript (with JSDocs).
The vast majority of the logic and code are done in Javascript, while
Twine and SugarCube 2 are mainly responsible for UI and written content,
such as author's writings.
As a coder, you would expect to spend most of your time writing in Javascript.
The Twine and SugarCube language will only be used to call on your javascript code.

## Example

As an example, 
[this is the Twine code for the quest manual assignment menu](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/project/twee/loop/questhub/questassign.twee#L17):

```
:: QuestAdhocAssign [nobr]

<<set $gMenuVisible = false>>

<<set _quest = $questinstance[$gAdhocQuest_key]>>
<<set _dom = setup.DOM.Menu.questassign(_quest)>>
<<attach _dom>>
```

An explanation is as follows.
First, the `:: QuestAdhocAssign [nobr]` declares a Twine **passage**.
A passage is like an HTML page, essentially.
Here, the passage is titled *QuestAdhocAssign*.

Next is `<<set $gMenuVisible = false>>`.
The `<<...>>` syntax is a SugarCube 2 syntax. Here,
the `<<set>>` command sets the global variable
**$gMenuVisible** to *false*.
This is a special game variable that will let the game know that the left sidebar menu should not be shown.

The next three lines are responsible for calling the javascript code and render it to the player.
First, the `<<set _quest = $questinstance[$gAdhocQuest_key]>>` is just a convenience
to set the value of the global variable `_quest` to `$questinstance[$gAchocQuest_key]`.
You may notice there are two syntax for global variables in twine: `_varname` and `$varname`.
They are different.
`$varname` global variables are recorded when player save the game (i.e., they are persistent),
while `_varname` are temporary variables that will be gone on save.

Finally, `<<set _dom = setup.DOM.Menu.questassign(_quest)>>` sets the variable
`_dom` to the output of a particular javascript function called `setup.DOM.Menu.questassign`.
The `setup` object stores all the global methods defined in the javascript files.
This particular function takes the `_quest` as a parameter, and returns a `DOM` fragment.

Finally, `<<attach _dom>>` will render the `_dom` DOM fragment and display it to the user.

In the Javascript side, the `setup.DOM.Menu.questassign` is defined [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/src/scripts/dom/menu/questassign.js):

```
/**
 * 
 * @param {setup.QuestInstance} quest
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.questassign = function (quest) {
  fragments = []
  ...
  return setup.DOM.create('div', {}, fragments)
}
```

This is where the bulk of the logic resides, and it's written in Javascript.

# Details

You should have enough information to start working on your first issue now.
The rest of this document details more information, should you wish to read more.
You can find [SugarCube 2 documentation here](https://www.motoslave.net/sugarcube/2/docs/).

## SugarCube 2 caveats

There are several caveats with using SugarCube 2 in this game.
The main caveat is the navigation macros, which generate links that can switch between passages.
This game aschews the SugarCube 2's standard macros, and use a home-brewed one for performance reasons.

Different than SugarCube 2,
Fort of Chains does not actually move passages when you click on links.
Instead, fort of chains will replace the content of an existing DOM element with an entirely new one.
For example, clicking the "Slavers" menu from the "Quest" menu will instead replace the `div`
containing the quests with the list of slavers.

To do this, the game do away with the standard navigation macros in SugarCube2 (e.g., `<<goto>>`, `<<link>>`, etc.)
Instead, the game uses [custom navigation macros](#navigation).

## Coding Style

**Document as much as you can with JSDocs!**

- Write the types for the parameters and output values for functions using JSDocs. Example:

```
/**
  * Builds a room
  *
  * @param {setup.BuildingTemplate} template 
  * @param {setup.RoomInstance} [room]
  * @returns {setup.RoomInstance | null}
  */
build(template, room) {
  ...
}
```

- PascalCase for classes `setup.BuildingInstance`

- camelCase for methods `unit.getTraits()`

- snake_case for properties and variable names `unit.first_name` (don't access this directly! use `unit.getName()`)

- lowercasenospace for data `setup.buildingtemplate.veteranhall`

## Editor Recommendation

You are of course free to use whatever editor you like. If you are unsure what editor to use,
Visual Studio Code works fairly well for this project.

## Code / Logic / Javascript Files

All javascript code are located in 
[here](https://gitgud.io/darkofocdarko/fort-of-chains/-/tree/master/src/scripts).
Css codes are in [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/tree/master/src/styles).
NPM / Yarn will compile them into [here for javascript files](https://gitgud.io/darkofocdarko/fort-of-chains/-/tree/master/project/scripts)
and [here for css files](https://gitgud.io/darkofocdarko/fort-of-chains/-/tree/master/project/styles).

The load order of the javascript files is alphabetical. It is still good practice to use imports instead,
but some legacy code relies on this load order to function.

The javascript source code directory is structured roughly as follows.
All the in-game classes (such as Company,
Trait, Skill, Unit, etc)
are located in the `src/scripts/classes` folder, which forms the bulk of the code.
Text things (such as procedural banters) are in `src/scripts/text`.
Unit names are in `src/scripts/names`.
Other miscelanious stuffs are in `src/scripts/util`, except for Twine macros,
which is in `src/scripts/macro`.
External libraries are in `src/scripts/lib`.
The special file `src/scripts/constants.js` contain all the in-game constants that can
be modified to adjust game balance.
Finally, UI is in `src/scripts/dom` folder.

## Navigation

For optimization purpose, the game does not use twine's native navigation system
(e.g., `[[Hi|Passage]]`). Instead, the game uses these five commands to replace them:

```
- `<<focmove 'Click me!' 'Passage'>>`: replaces `[[Click me!|Passage]]`
- `<<focreturn 'Done!'>>`: replaces `<<return 'Done!'>>`
- `<<focgoto 'PassageName'>>`: replaces `<<goto 'PassageName'>>`
- `<<focgoto>>`: Refresh current page
- `<<foclink 'a' 'b'>><<run console.log('Hi')>><</foclink>>`: Replaces `<<link 'a' 'b'>>`
```

In javascript, these navigation macros can be found as:

```
setup.DOM.Nav.move
setup.DOM.Nav.return
setup.DOM.Nav.goto
setup.DOM.Nav.link
```

Exception is in Content Creator, where you should use twine default navigation system because
the performance leeway is higher. In the javascript, their counterpart can be found in
`setup.DOM.Nav`. For example, `setup.DOM.Nav.link` would replace `<<foclink>>`.

## Class Modularity

The game tries to follow feature modularity. This means that a new feature should be self-contained
in its own class. For example, if you want to add a tattoo system, then you should not modify
the `Unit` class. Instead, create a `setup.Tattoo` class, which can do things like
`$tattoo.getTattoo(unit)` and `$tattoo.setTattoo(unit, tattoo)`.

All objects must inherit from `TwineClass`. This is because of
[SugarCube](https://www.motoslave.net/sugarcube/2/docs/#guide-tips-non-generic-object-types)
restriction on using objects.

## How the Objects are Stored and Saved by the Game

SugarCube maintains basically three locations for your variables.

First, the `setup` namespace is a global namespace for objects that does not
change over the playthrough.
For example,
For example, quest templates are in
`setup.questtemplate`, while traits are in `setup.trait`.

Second, the `State.variables` namespace store variables that can change over the course
of a gameplay, and will be saved into the save file. `State.variables` should only contain
those variables, since `State.variables` will be directly encoded into JSON whenever the player
saves the game.
For example, list of units are in
`State.variables.unit`, while list of ongoing quest instances are in
`State.variables.questinstance`.
In the Twine files (`.twee`), these variables can be referred with a shorthand:
`$unit` will refer to `State.variables.unit`.

Finally, the `State.temporary` stores "temporary" variables that can change over the game,
but will not be saved, and will also be lost at the end of each week.
Generally, only use these for temporary variables, e.g., a loop iterator.
In the Twine files (`.twee`), these variables can be referred with a shorthand:
`_unit` will refer to `State.temporary.unit`.

## setup.DOM

This game writes its UI logic in javascript using a home-brewed library.
The functions that generate document fragment are all located under the `setup.DOM` namespace,
and can be found [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/tree/master/src/scripts/dom).
For example, `setup.DOM.Card.quest` is found [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/src/scripts/dom/card/quest.js).

For ease of writing these functions, we have several helper methods [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/src/scripts/dom/AAA_domutils.js).
The most important function there is the `html` template tag, e.g.:

```
const fragment = html`
  <div>
    Hello!
  </div>
  <div>
    You gain ${setup.DOM.Util.money(1000)}.
  </div>
`
```

The `html` template tag will take care all of these and turn it into a proper document fragment.

The second most important helper function is the `setup.DOM.create` function, which you can find
[here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/src/scripts/dom/AAA_domutils.js).
For example,

```
  const fragment = setup.DOM.create('div', {class: 'abc'}, [setup.DOM.Util.money(1000), html`<div>Hello!</div>`])
```

is the same as

```
  const fragment = html`
    <div class='abc'>${setup.DOM.Util.money(1000)}${html`<div>Hello!</div>`}</div>
  `
```

See [dom writing guidelines](#dom-writing-guidelines) for more information.

## Important Files

Some important files:
- Entry point is [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/project/twee/story.twee)
- Backwards compatibility is handled [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/src/scripts/util/backwardscompat.js)
- Sidebar menu is [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/project/twee/meta/menu.twee)
- Initialization code is [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/tree/master/project/twee/initvars). Also includes definitions of skills, traits, item classes, etc.
- Passage transition code is [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/src/scripts/macro/navigation.js)

## Dom Writing Guidelines

This is a guideline on how to write the DOM-generating code in javascript.

All dom-related code should be located in [this directory](https://gitgud.io/darkofocdarko/fort-of-chains/-/tree/master/src/scripts/dom).

- The `dom/card` directory is for showing cards, e.g., unit card, quest card, etc. From twine, you will usually
just call a card, and then attach it. [Example for quest](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/project/twee/widget/quest.twee#L9).
- The `dom/menu` directory is for showing menus, such as unit detail menu.
- `dom/util` directory is for all util functions that returns a Document Fragment object.
- `dom/helper` directory is for all util functions that does NOT return a Document Fragment object.
- `dom/nav` directory is special: for storing the equivalent functions to the navigation macros
in twine: that is, `goto`, `link`, `button`, and the `[[a|b]]` syntax.

These can be accessed via the `setup.DOM` singleton. For example, those in `dom/card` are accessed in `setup.DOM.Card`, while
those in `dom/util` are accessed in `setup.DOM.Util`.
