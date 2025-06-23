## Fort of Chains v1.3 is here! Text-only slaver management game. Contributors welcome!

[(Play in your browser)](https://darkofoc.itch.io/fort-of-chains) |
[(Contributing)](https://gitgud.io/darkofocdarko/fort-of-chains) |
[(Download)](https://www.reddit.com/r/FortOfChains/comments/jlhivr/fort_of_chains_and_download_link/) |
[(Subreddit)](https://www.reddit.com/r/FortOfChains/) |
[(Discord)](https://discord.gg/PTD9D7mZyg) |
[(v1.2.0.0 release notes)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/update/readme_1_2.md) |
[(Changelog)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/changelog_summary.md)

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

Foc v1.3 came in three weeks after FoC v1.2, and is easily the largest update this game has ever received
so far.
Compared to v1.2, FoC v1.3 version adds a lot of content, new features, UI rewrites, image works, rebalancing, and iconworks.
A summary (but still very long) changelog is at the end, but the biggest changes in v1.3 are:

- **Content**: 18 new quests, 8 new opportunity, 45 new events, 1 new interaction, 1 new unit action (special thanks to Alberich, acciabread, Zerutti)
- **UI rework**: Almost all menu had its UI reworked, especially the quest menu where most of players time is spent on
- **New features**: Favor, ire, lore, and more
- **Content creator UI work**: Built-in code editor with toolbar, syntax highlighting, result preview. Guide is also in-game now
- **Imagework**: Icons have been entirely replaced with SVGs, and many are redone. They also uses the new, non-intrusive tooltips

Many thanks to the contributors to this project, and especially to Naraden, acciabread, and Alberich.

**FoC is always looking for contributors**,
be it writers, programmers, artists, or even moderation help!
Unlike most other games, to add content into the game, you **do not have to write code at all**.
This is since the game came shipped with an **in-game GUI tool** for
adding content.
More details [here](https://gitgud.io/darkofocdarko/fort-of-chains).
As of v1.3,
there have been over twelve people who have contributed content into the game,
while much more have helped playtesting, giving feedbacks, and reporting bugs.

---

Full changelog [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/changelog.txt).

v1.3.0.0 (December 26, 2020): Lots of content, new features, UI rewrites, icon rewrite, heavy QoL changes
 - 18 new quests, 8 new opportunity, 45 new events, 1 new interaction, 1 new unit action (thanks to Alberich, acciabread, Zerutti)
 - New feature: Ire and Favor. You can gain favor and ire with other companies out there, which will have
 various in-game effects

 - New feature: lore
   - 20 new lore entries
   - The Continent named as Mestia
   - New map (thanks to acciabread)
   - Interactive map regions (thanks to Naraden)

 - Tooltips are much less intrusive now (thanks to Naraden)

 - Renamed Northern Plains to Northern Vale

 - Quest and quest UI:
   - Quest menu is completely rewritten
   - Assignment UI is completely rewritten
   - Quest now hints on what kind of rewards you will get from them (acciabread)
   - New quests that you have never done before are marked
   - Panorama in quest cards and mail cards
   - Quests have icons now
   - Can set quests as ignored, which will hide them from the UI
   - Increase default quest expiration from 4 to 6 wks.
   - Hide quest hub flavor text after great hall is built

 - Unit portraits:
   - Direct support for custom image-packs (thanks to Naraden)
   - Unit portrait picker (Naraden)
   - Clicking unit portrait shows a large version of it now
   - Many new unit portraits

 - Content Creator Tool:
   - Built-in text editor (thanks to Naraden)
     - Macro insertion toolbar
     - Syntax highlighting
     - Macro validation
     - Macro tooltips
     - Result preview
       - List of actors editable
   - Search quests and opportunities by name (thanks to Naraden)
   - Cost and restriction are restructured to make them easier to use
   - Content Creator Guide is in-game now
   - Direct support for making chained quest/opportunity/event
   - Stackable trait ifs in content creator toolbar.
   - Internally, the code is rewritten to despaghettify it.

 - Filter code rewritten from scratch. Everything can be filtered now and they stick to the top, while
 being less intrusive than usual. Has options to disable or unsticky them

 - Equipment 
   - New feature: can automatically attach equipments to equipment set
   - Merged vagina and dick equipment slots to genital, and added weapon equipment slot
   - Shuffled equipment to make them spread over slots better (acciabread)
   - Equipment items now have unique icons (thanks to Naraden)
   - Equipment traits such as gagged or blinded give hefty skill penalty now.

 - Trait:
   - Skin traits can now be innate. E.g., if you got an elf with butterfly wing and they lose the wings later, you can purify them to restore the wings.
   - Trait have rarity indicator now
   - Diligent become studious, energetic becomes active, careful becomes cautious, inquisitive becomes curious,
   violent becomes proud, peaceful becomes humble, perceptive becomes attentive
   - New traits: dreamy, courtesan background, boss background, artist background, metalworker background
   - Removed traits: patient (merged to calm), decisive (merged to aggressive), miner, student, sadistic, slutty
   - Adjusted the skills some of them affect
   - Orcs now have pointy ears
   - Many icons are replaced with a better one (acciabread, Naraden)
   - Human (Exotic) is renamed to Human (Sea)
   - Long-term slaves converted to slaver gains the slave in addition to their existing background
   - Upgraded backgrounds of pre-built starting units to their rare version.

 - Duty:
   - On duty units can go on quests now
   - Duties have unique icons
   - Relationship manager now costs upkeep

 - Unit Action:
   - Hides unit actions before unlocking their buildings.
   - Unit actions appear together now in [Action] menu.
   - Advanced slaver training is nerfed and requires potion to do
   - Basic slaver training is nerfed and requires money to do
   - Flesh shaping now needs basic obedience training

 - Slave Order
   - Slave order can be fulfilled directly using free slaves from slave pens
   - Can do multiple menial slave orders in the same week instead of once per week

 - Buildings:
   - New building: Library
   - Building display adjusted to make it less spammy for new player
   - Stores building as object in fort now for faster searching.

 - All icons are stored as SVG now
 - Slavers can be away from your fort / unavailable for various reasons now
 - Nerfed overall number of slavers from 36 to 24 before hitting a soft cap
 - Documentation updated, including for creationg of image packs
 - Import / Export save as text for mobile users under Settings.
 - Modified most important links in all menus to buttons.
 - Several changes to interact screen (thanks to Naraden)
 - Preparation for converting twine code to JS for performance with DOM tool code (Naraden)
 - Limit level up to 5 per quest, except catch-up quest
 - Debug initialization now starts with much more things by default
 - Issue templates in repository
 - Update itch.io build command.
 - Player getting captured is no longer a game over.
 - Made itch.io bundle flatten the unit images into a single directory (thanks to Naraden)
 - Moved from gulp to webpack
 - Backwards compatibility code is now fully in JS
 - Support for bodyshifting units
 - Some opportunities have to be answered now
 - More banter texts (thanks to acciabread).
 - Success calculation rebalanced from scratch
 - Childbirth support
 - Various code cleanups: navigation rewrite, focwidget, etc.
 - Criterias rebalanced to have 5+ traits
 - Many bugfixes

[v1.2.x (December 05, 2020) Artist-focused, engine changes, content, features](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/changelog_summary.md)
