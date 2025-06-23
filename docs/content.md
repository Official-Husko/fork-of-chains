# Content Guide

This guide details what kind of content the game need, and what kind of content
the game does not critically need.

# Sorely Needed

The big three are: quests, mails, and events.

Living can be freely added to, but they are not supported by content creator.
See [here](project/twee/living) for existing livings to template of.

Other contents such as
items, furniture, buildings, living, etc. can be added too, but
they do not have a specialized GUI interface to help add them.
See [here](#adding-content-outside-content-creator) for more information.

Sec Actions can be added too, although it is more difficult than the other because it is not
supported by the Content Creator Tool. See [here](docs/sexaction.md) for more information.


## Rewriting existing content and proofreading

All rewrite and proofreading work are highly appreciated.
The quests are located in
[this folder](project/twee/quest), which has a subfolder for each author.
Each file corresponds to one quest.
Editing the quest texts should be self-explanatory inside each file.
The opportunities are located in
[this folder](project/twee/opportunity), and follow the same rule as the quests.
Finally, events are in
[this folder](project/twee/event), again following the same rule as quests.

## Text works

Expanding texts in the game is always welcome.
Banter texts are [here](src/scripts/text/raw/).
Unit adjectives and adverbs are [here](project/twee/trait/_texts.twee) and
[here](project/twee/speech/_texts.twee).
Various text-related things are in
[here](src/scripts/text), including
background texts, stripping, etc.

# Can be added

## Items

Items that unlock certain features can be added manually, if you need them as quest rewards.
If you would like this, the easiest is to simply write your content first without the item,
and then describe the item to us. We will implement it for you and into your content.

Alternatively, you can also add the item yourself, e.g., for testing.
To do so, open [this file](project/twee/item/questitem/questitem.twee),
and add your new item there.
For example, to add an Earth Badge, you append the following lines to the file:

```
<<run new setup.ItemQuest(
  'earth_badge',
  'Earth Badge',
  "A mysterious item that allows its wielder to manipulate earth."
 )>>
```

The first parameter is the id of the item (just put the lower_cased version of its name),
the second is the name,
and the third is the description of the item.

You can also add consumable items (such as potions) in either
[this file](project/twee/item/item/notusableitem.twee),
[this file](project/twee/item/item/usableitem.twee),
or,
[this file](project/twee/item/item/usablefreeitem.twee),
The first file is for items that cannot be used directly, but
can be consumed as part of a quest requirements,
such as reset level potions.
The second file is for items that can be used directly on units,
such as healing potions.
The third is for items that can be used directly, but does not target any unit.

To make the items you created appear in the game,
you to [compile the game](https://gitgud.io/darkofocdarko/fort-of-chains#compiling-instructions) after adding them.

# Living

New living can be freely added.
See [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/tree/master/project/twee/living) for existing ones
to template on.

# Not really needed

## Traits

There is already 400+ traits in the game. New traits are **not** encouraged to be added, because each trait
adds to the complexity of developing new content for the game.
This is especially true for personality traits, as they are referenced by a lot of places in the game.

## Perk Traits

**Perk traits are an exception**: Perk traits only have gameplay effect, and very little flavor effect,
and hence it can also be added into the game. They are considered extremely rare, however, and should only
be given after the player done something noteworthy.

## Race

There is absolutely no plan to add more **primary races** into the game.
But **subrace** can be added, albeit needing
a lot of efforts to. See
[here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/faq.md#new-races) for more information,
including all the requirements to add new subrace.

# Regarding submissive (i.e., opposite of dominant) content

Since you are leading a group of slavers whose main job is to raid others, player submission
is a little too far from the game's main theme. However, you are still welcome to add player submission
stories -- but if you do that, please either restrict it to only players characters with the submissive trait.
In the content creator, this can be done via: (Add new restriction) -> (You...) -> (Unit's trait...) ->
(Unit must have this trait) -> pick the submissive trait.
(These can be done via the content creator, and can
also be checked in the story with with: `<<if $unit.player.isSubmissive()>><</if>>`).

# Adding Content Outside Content Creator

## Item, Equipment, Furniture

First, open the [item](project/twee/item), [equipment](project/twee/equipment),
or [furniture](project/twee/furniture) folders, depending
on which one you are trying to make.
To add a new item/equipment/furniture, you basically need to append some texts
into the files in this folder.
For example, to create a new sex manual, you can open
[sexmanual.twee](project/twee/item/questitem/sexmanual.twee),
and add the following at the end:
```
<<run new setup.ItemSexManual({
  key: 'sexmanual_mysexaction',
  name: 'Sex Manual: My Sex Action',
  description: "Unlocks 'My Sex Action' sex actions. Requires <<rep setup.item.sexmanual_mysexaction>> to use.",
  tags: [],
 } )>>
```

The game will automatically detect the changes once you
[compile the game](https://gitgud.io/darkofocdarko/fort-of-chains#compiling-instructions) after adding them.

## Building, Living, 

First, open the [building](project/twee/building) or [living](project/twee/living) folder.
Then, copy one of the files there as a base template, and edit it into your new building/living.
The game will automatically detect these files and convert them into new building/livings
once you
[compile the game](https://gitgud.io/darkofocdarko/fort-of-chains#compiling-instructions) after adding them.
