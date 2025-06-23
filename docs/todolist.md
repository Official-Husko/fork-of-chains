## This document details places in the game that can use significant improvements

Note that these are just suggestions, if you want to contribute something else,
feel free to tell us the idea!
Also check out [ongoing issues](https://gitgud.io/darkofocdarko/fort-of-chains/-/issues) for another
set of current todos.

### Writing

See [https://gitgud.io/darkofocdarko/fort-of-chains/-/issues/343](here) if you are looking for potential rewards

- High priority
  - New quest / opportunities / events are always high priority.
  - In particular, quest chains are always in high-demand, especially if they flesh out
  or highlight a particular unit in the company.
- Medium priority
  - Better quest texts for all [training quests](project/twee/quest/darko/training). Some are already 
  filled in, like Oral training quests, but most have not been filled in yet.
  - In general, improvements for the [base quests](project/twee/quest/darko), especially for quests that are written earlier
  - Interactive sex text improvements and variations [here](src/scripts/classes/sex/action).
- Low priority
  - Trait [description](project/twee/trait) and [flavor texts](project/twee/trait/_texts.twee)
  - More adverbs associated with [traits](project/twee/trait/_texts.twee) and [speech](project/twee/speech/_texts.twee)
  - More banter topics [here](project/twee/banter/topic.twee)
  - Alternate [procedural texts](src/scripts/text/sentence/)
  - Better short descriptions for:
    - [Buildings](project/twee/building/templates)
    - [Duties](project/twee/duty/template)
    - [Furnitures](project/twee/furniture)
    - [Items](project/twee/item)
    - [Equipment](src/scripts/text/unit/equipment/equipment.js)
    - [Backgrounds](src/scripts/text/unit/background.js)
    - [Races](src/scripts/text/unit/race.js)
    - [Traits](src/scripts/text/unit/trait/trait.js)
    - [Racial traits](src/scripts/text/unit/trait/physical.js)
    - [Duty competence](src/scripts/text/unit/duty.js)

### Code

Check out the [list of issues](https://gitgud.io/darkofocdarko/fort-of-chains/-/issues), and see if anything
meets your fancy! Alternatively, you can also help out by adding the content that writers have submitted
into the game, via converting them into proper merge requests.

Code reviewers are also very valuable! Check out the merge requests to get started.

Be [very wary](docs/faq.md#does-this-game-contain-insert-fetish-here) when
introducing **new features** into the game! The game is designed to be as
easy as possible to add content to, and hence you should ask these two
questions:
  - Does the feature interact significantly with other parts of the game? Yes? Good! No? May need rethinking.
  - Does it increase the complexity of writing in further content into the game? Yes? Bad! No? May be good.

### Art

See [here](docs/images.md) for more information about adding images.

- Better icons
  - Icons for sex positions during sex interaction
    - Would be great if the icon is per race, e.g., a wolfkin icon, a catkin icon, etc.
  - Better icons for slave / slavers / unemployed [here](dist/img/job). Probably the most urgent of all, since
their current icons especially the slaver one sucked bad
- More unit portraits (Game needs to receive at least the permissions in CC-BY-NC-ND 3.0. Would be great if it can be cropped too. If you want some specific way to credit you (e.g., link to patreon, etc.), please let us know!)
- Images for certain quests
- Game Icon (replacing the current icon which is just using the slaver skill icon)
- A banner for the game, so it is easier to spread the word about the game around


### Other

- Bug report is very valuable for this game!
- One of the most important contribution is by spreading word about this project! The more people exposed to
this project, the more people that have ideas to contribute with.
- While direct contribution would be the preferred way to contribute, there is also a [Patreon](https://thenounproject.com/term/piggybank/2976133/), if you'd like to give something back in return instead. The money so far has been used to cover some of the costs with the development of this game, e.g., VPN costs and supporting the repository platform (gitgud.io)
