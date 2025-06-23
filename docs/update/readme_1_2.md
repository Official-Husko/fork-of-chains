## Fort of Chains v1.2 is here! Text-only slaver/slave management game. Contributors welcome!

[(Play in your browser)](https://darkofoc.itch.io/fort-of-chains) |
[(Download links)](https://www.reddit.com/r/FortOfChains/comments/jlhivr/fort_of_chains_and_download_link/) |
[(Subreddit)](https://www.reddit.com/r/FortOfChains/) |
[(Discord)](https://discord.gg/PTD9D7mZyg) |
[(Changelog summary)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/changelog_summary.md)
[(v1.2.0 release notes)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/update/readme_1_2.md)
[(v1.1.0.0 release notes)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/update/readme_1_1.md)

**Fort of Chains** (FoC) is a completed, free, moddable,
[open-source](https://gitgud.io/darkofocdarko/fort-of-chains),
TEXT-ONLY
sandbox management NSFW game where you manage a band of slavers in a fantasy world.
The game is strongly inspired by
[No Haven](https://www.patreon.com/bedlamgames)
and [Free Cities](https://www.reddit.com/r/freecitiesgame/).
Gender orientation is configurable and covers all MM, MF, FF.
Be warned that the game contains heavy themes of slavery and non-consensual sex.
More information 
[here](https://www.reddit.com/r/FortOfChains/comments/jlhivr/fort_of_chains_and_download_link/).

FoC v1.2 marks a full four weeks after FoC v1.0 was released.
Compared to v1.1, FoC v1.2 version adds content, better image resolution,
performance, a new feature, and a bazilion
other small improvements.
A vast amount of work is done to improve the code base, making it easier to maintain in the future.
More detailed changelog at the end, but the biggest changes are:

- **Portrait rework**: Unit portraits are bigger, better, and expose their artists more. There are almost 1000 portraits now, and they are at least 16 times larger than previously. The artist credits are also now fully displayed in the game screen, including a link to their webpages if you want to support them! (Many of the artists have a patreon, do give it a visit if you like their arts.)
- **Content**: 25+ new quests, 12+ new interactions (including many bedchamber-specific ones), some new events. Many older quests are also rewritten to read better. Special thanks to contributors for their writings: Alberich, Dporentel, Quiver, Kyiper.
- **Reduces lag and massive code rewriting**: The amount of lag is reduced even further. This is possibly thanks to the massive rewriting effort by contributor Naraden, who rewrites almost all existing javascript files to use ES6 syntax.
- **Content creator QoL**: Content creator is easier than ever to use. All you have to do now is to include the file, that's it! No other changes needed. The UI is also made easier again thanks to contributor Naraden. See below for a full list of content creator changes.


**FoC is always looking for contributors**,
be it writers, artists, programmers, or even moderation help!
Unlike most other games, to add content into the game, you **do not have to write code at all**.
This is since the game came shipped with an **in-game GUI tool** for
adding content.
More details [here](https://gitgud.io/darkofocdarko/fort-of-chains).
As of v1.2,
there have been over ten people who have contributed content into the game,
while much more have helped playtesting, giving feedbacks, and reporting bugs.

---

Changelog summary from v1.1 (which was released two weeks ago):
[(Full changelog)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/changelog.txt)

v1.2.x (December 05, 2020) Artist-focused, engine changes, content, features

- Image sizes are increased 16-fold.
- Artist credits can be seen in the game by clicking the unit image, or by going to (Interact with unit) page
- 25+ new quests (special thanks to contributor writer Alberich and Dporentel)
- 12+ new interactions, including bedchamber/harem-exclusive ones (thanks to Quiver)
- several new events (thanks to Kyiper)
- Improved the writings for most quests that were written in v0.9.x
- New feature: unit titles
- Content creator: can edit nested conditions as well as remove the unnecessary scrolling required to add multiple restrictions / costs (thanks to Naraden)
- Teams reworked. Now Mission control governs maximum number of teams you can deploy at the same time. Teams can
be used to group slavers now. Ad-hoc teams no longer need to be designated
- Performance fix by making all objects minimal now and no longer duplicate their methods (thanks to Naraden)
- Added support for easy installation of custom image packs, including from urls (thanks to Naraden)
- Can choose asset size in character creation
- Wings are rarer. Dragonkins can choose non-wing skills
- Tons of engine cleanup for making future development faster (thanks to Naraden), including: version scripts, ES6 compatibility, repository structure changes, webpack instead of gulp, duty refactor, code refactor to use ES6 classes on all files
- Unit images repeat far less often now
- Limit to skill and background traits
- Automated word / sentence generations in content creator (e.g., random insult, random good adjective, etc)
- Make it easier to add new content into the game (removes needing to "include" them)
- Several new traits (fairy wings, draconic ear)
- Several traits have been reworked to be more applicable in more situation and having less overlap. Removed: squire, militia, gardener, great memory, charming, trainer. Added: assassin, monk, scholar, animal whisperer, intimidating, creative
- UI improvements for equipment sets, duties, markets, bedchamber (thanks to Naraden)
- Difficulty adjustments
- Skill focus is more focused now
- Many bugfixes and QoL features

[v1.1.x (November 20, 2020) Game is stable.](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/changelog_summary.md)

