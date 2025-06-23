## Fort of Chains v1.4 is here! Text-only slaver management game. Contributors welcome!

[(Play in your browser)](https://darkofoc.itch.io/fort-of-chains) |
[(Contributing)](https://gitgud.io/darkofocdarko/fort-of-chains#how-to-contribute-content) |
[(Download)](https://www.reddit.com/r/FortOfChains/comments/jlhivr/fort_of_chains_and_download_link/) |
[(Discord)](https://discord.gg/PTD9D7mZyg) |
[(Subreddit)](https://www.reddit.com/r/FortOfChains/) |
[(v1.3.0.0 release notes)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/update/readme_1_3.md) |
[(Changelog)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/changelog_summary.md) |
[(F.A.Q)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/faq.md)

**Fort of Chains** is a completed, free, moddable,
[open-source](https://gitgud.io/darkofocdarko/fort-of-chains),
TEXT-ONLY
sandbox management NSFW game where you lead and manage a band of slavers in a fantasy world.
The game is configurable and can cover all gender orientations: MM, MF, and FF.
Be warned that the game contains heavy themes of slavery and non-consensual sex.
There are [no support](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/faq.md#can-you-play-a-submissive-in-this-game)
for playing as a submissive character.
More information 
[here](https://www.reddit.com/r/FortOfChains/comments/jlhivr/fort_of_chains_and_download_link/).

FoC v1.4 follows after the extra-large [v1.3 update](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/update/readme_1_3.md),
which was released three weeks ago.
And oh boy v1.4 would not lose in term of update size:
v1.4 introduces many new content and features,
including lover relationship, subraces, multi-training, and potion shop. But on top of that,
v1.4 introduces the largest feature in the entire game by far: **Interactive Sex**.
You can now have interactive sex with both slavers and slaves now, where you get to choose what to do at
each step. For example, you can begin with some foreplay: kissing, etc, before stripping and get into raunchier
positions.

This gigantic feature in particular comes shipped with:
- **136** new sex actions, many have variations depending on various factors such as traits, mood, location, etc
- **Sex AI**, which depends on the unit's predisposition, goals, permissions, traits, etc.
- Unlockable **Sex Manuals**, including many new events that unlocks those
- Sex pose / bodypart / position system
- Support for first-person text

Many texts in this new feature are borrowed and heavily modified from the
[Lilith's Throne game](https://lilithsthrone.blogspot.com/) by [Innoxia](https://subscribestar.adult/innoxia).
Do give Lilith's Throne game a try, as it is also completely free!
Legal stuffs: Lilith's Throne is released under
[this license](https://github.com/Innoxia/liliths-throne-public/blob/master/license.md).
While Lilith's Throne creator, Innoxia, has given her permission for the texts to be used in this game,
she in no way offer her endorsement for this game.

v1.4 marks a milestone where the [issues list](https://gitgud.io/darkofocdarko/fort-of-chains/-/issues) no longer
contains any major todo, and most of the remaining todos are QoL and content todos.
This means that the main focus should start to shift into **supporting writers** who wants to add content into the game.
You are invited too! See details [here](https://gitgud.io/darkofocdarko/fort-of-chains#how-to-contribute-content).

A summary of all the changes in v1.4 are listed at the end, but the biggest changes in v1.4 are:

- **Content**: 21 new quests, 7 new mails, 1 new interaction, 23 new events, 3 new buildings, 22 new items, 2 new equipments, 10 new titles, 136 new sex actions (thanks to Innoxia, Fos, Quiver, Thavil, anonymouse21212, Anon)
- **Interactive Sex**: Have interactive sex with your slavers and slaves in several locations
- **New features**: Lovers, subrace, multi-training, potion shop
- **Engine work**: The game is now based on a modified SugarCube 2, which among other things allow error logs to finally be shown in the fullest, making debugging much faster (thanks to Arkerthan and Naraden)

Many thanks to the contributors to this project, and especially to Naraden and acciabread.

**FoC is always looking for contributors**,
be it writers, programmers, artists, or even moderation help!
Unlike most other games, to add content into the game, you **do not have to write code at all**.
This is since the game came shipped with an **in-game GUI tool** for
adding content.
More details [here](https://gitgud.io/darkofocdarko/fort-of-chains#how-to-contribute-content).
As of v1.4, there has been over twenty contributors who directly contributed into the project,
while many other have helped by either reporting bugs or spreading the word.

---

Full changelog [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/changelog.txt).

v1.4.0.0 (January 15, 2021): Content, interactive sex, lovers, tigerkin

 - 21 new quests, 7 new mails, 1 new interaction, 23 new events, 3 new buildings, 22 new items, 2 new equipments, 10 new titles, 136 new sex actions (thanks to Innoxia, Fos, Quiver, Thavil, anonymouse21212, Anon)
 - New Feature: Interactive Sex. Most writing credits go to Lilith's Throne and Innoxia. See [here](https://github.com/Innoxia/liliths-throne-public/blob/master/license.md) for their license. Consider giving Lilith's Throne game a try! While Innoxia has given permission for their use in this game, she in no way give her endorsement for this game.
   - Sex between you and slavers or slaves
   - 136 sex actions to choose from
   - 16 sex manuals to unlock new actions
   - New classroom building
   - Multiple variations depending on various conditions like traits, position, location, furniture, etc
 - New feature: Lovers
   - Slavers can become lovers between each other, including you
   - Will boost each others skills a lot, as well as having bonus texts here and there
   - Can adjust in settings what kind of gender pairings you'd like to see
 - New Feature: Subraces support
   - Subrace acts like races most of the time, but reuse its parent race for most text, therefore minimizing maintenance cost
   - Tigerkins are implemented as a proper subrace of the neko race, to demonstrate this feature
   - Tigerkin is shipped with 3 quests, 2 opportunities, and 3 events, and more
   - Unitpool code rewritten to support this
 - New Feature: Multi-training
   - Once you have a vice leader, can assign multiple slave training in one go
 - New Feature: Potion shop
   - You can rebuy potions you have ever acquired at a steep markup
 - Quest and event generation is now deck-based, instead of completely random
   - Will guarantee that you will see all quests if you scout long enough
   - Rarity is adjusted to be a category instead of a full spectrum
 - The game is using a modded SugarCube 2 engine now (thanks to Arkerthan for the suggestion):
   - Remove save game compression to make loading faster.
   - Errors now show more meaningful information
 - Images
   - A lot more portraits (total number of portraits is now over 1000)
   - Optimize png and jpg files using optipng and optijpeg (thanks to alarmedcat)
   - Can reset unit image from settings
 - Unit Action
   - Removed equipment requirement from pet/pony trainings.
   - Unit action now will auto assign units to it by default (adjustable in settings)
   - Unit actions that are already performed (e.g., obsolete trainings) are hidden
 - Traits
   - Cached unit traits for performance.
   - Nimble and Tough are physical traits now.
   - Trait filtering and sorting options
   - job_slave, job_slaver, job_unemployed are now traits
   - join_junior and join_senior traits are now applicable to slaves
   - Renamed bg_demon to bg_mist.
   - Bodyswap no longer swaps gender. Genderswap in debug mode.
   - Children now inherits their parents innate traits
 - Duty
   - Vice-Leader now remains effective even when injured / on a quest.
   - Preferred traits for slave duties.
 - Engine work
   - Major performance improvements for: Equipments, Filter, Duty, Building, Item, Trait Picker, Unit Card, Quest card
   - Repository size cleanup (300MB -> 100MB)
 - Text
   - Support for first-person sentences in some places like unit histories and banters
   - Money now formatted with commas.
 - Content Creator
   - Can condition on quest seed in content creator
 - Quests
   - Add support for consecutive quests.
   - Remove Success+ from quest settings.
   - The rear deal is now repeatable. Potion of orifice tighening now required for anus/vagina healing.
 - Drop support for family relationship, due to maintenance and legal reasons.
 - Documentations are updated in many places
 - Remove sluttiness limit on player character.
 - Display option for markets menu.
 - Many Typos and Bugfixes

[v1.3.x (December 26, 2020): Lots of content, new features, UI rewrites, icon rewrite, heavy QoL changes](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/changelog_summary.md)
