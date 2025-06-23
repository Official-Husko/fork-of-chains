## Fort of Chains v1.8 is here! Text-only slaver management game. Contributors welcome!

[(Play in your browser)](https://darkofoc.itch.io/fort-of-chains) |
[(Contributing)](https://gitgud.io/darkofocdarko/fort-of-chains#how-to-contribute-content) |
[(Download)](https://darkofoc.itch.io/fort-of-chains) |
[(Discord)](https://discord.gg/PTD9D7mZyg) |
[(v1.7.0.0 release notes)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/update/readme_1_7.md) |
[(Changelog)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/changelog_summary.md) |
[(F.A.Q)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/faq.md)

**Fort of Chains** is a completed, free, moddable,
[open-source](https://gitgud.io/darkofocdarko/fort-of-chains),
TEXT-ONLY
sandbox management NSFW game where you lead and manage a band of slavers in a fantasy world.
The game is configurable and can cover all gender orientations: MM, MF, and FF.
The game contains heavy themes of slavery and non-consensual sex.
There are [no support](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/faq.md#can-you-play-a-submissive-in-this-game)
for playing as a submissive character.
[(More information)](https://gitgud.io/darkofocdarko/fort-of-chains)
[(Feature / Fetish list)](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/faq.md#does-this-game-contain-insert-fetish-here)

FoC v1.8 adds a new region in the Deeprealm, as well as many new content, some new features, and so on.
Big thanks to all the contributors who had made this version possible! (Please check below
for a list of the helpful contributors.)

On the development side, FoC v1.8 adds a deployment guide.
As darko is going to be busy,
the goal of the deployment guide is to make it as easy
as possible for the community to continue the development of Fort of Chains in darko's absence,
as well for other people to make and release their own version of FoC.
The game is under a permissive license (except for the assets, which are generally under
creative commons), so you are encouraged to continue and develop the game in whatever way you
like!
Please check out the discord for more information.

If you enjoy the game, make sure to thank the many contributors and people who have helped with this project! The project could not reach this version without them.
[You are invited too!](https://gitgud.io/darkofocdarko/fort-of-chains#how-to-contribute-content)
The list of all contributors include:

- **Writers**:
Alberich,
Anon,
Atacama,
AwooWolfWoof,
Blueflame451,
Choker Guy,
Da_Shem,
Dporentel,
FCdev,
Fae,
Fos,
Hydrys,
Innoxia (Lilith's Throne),
J1009
Kyiper,
Kyrozis,
Matthew Lang,
Milk Maid Sona,
Quiver,
Thavil,
Zerutti,
anonymouse21212,
mynameis123,
- **Coders**:
Arkerthan,
Naraden,
steven,
alarmedcat,
sssk
- **Artists**: This game borrows many artworks whose artists have kindly released them under sufficiently permissive licenses, allowing them to be used in this game. Please see the in-game `(Artist Credits)` for their full list as well as the licenses, for there are simply too many of them to list here!
- **Others**:
AbleCharlie,
Anu,
ChristianS,
Elannil,
Hermenegild,
RikuAotsuki,
Stadler76,
ThaneRoss,
TheDom102,
acciabread,
gorbo1,
nezzanine,
bug reporters,
the generous Patreon tippers,
as well as you for playing the game

At this point, FoC can be already considered **complete**.
However, contributors are still adding more content into the game at their leisure.

**FoC is always open for more contributors**,
be it writers, proofreaders, programmers, artists, or even discord moderation help!
Unlike most other games, to add content into the game, you **do not have to write code at all**.
This is since the game came shipped with an **in-game GUI tool** for adding content.
More details [here](https://gitgud.io/darkofocdarko/fort-of-chains#how-to-contribute-content).

---

Full changelog [here](https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/changelog.txt).

v1.8.1.0: (9 October 2021)

  **Important**: the Grand Hall has been renamed to Great Hall.
  If you are loading an existing save, you need to re-build the building.
  If the building isn't showing due to filters, open your javascript console (Ctrl + Shift + J),
  then type:

  ```
    SugarCube.State.variables.menufilter.filters = {}
  ```

  This will reset all filters.

  - Content
    - New quest chain: Elven Hot Springs: Mens Business (by Matthew Lang) (2 quests, 2 mails, 1 event)
    - New quest chain: Potion of Lust (by Matthew Lang) (2 quests)
    - New quest chain: The Shunned Kobold (7 event, 7 mail. 3 quest)
    - New quests: A Merchant's Revenge: Embarras A Rival (by Matthew Lang) (3 quests, 1 mail)
    - New quest: Trade Ship Escort: Lucgate to Neko Port City (by Matthew Lang)
    - New Quest: Bounty Hunt: Hole Gaper.
    - New Quest: Tiger Bank Debt Collection - Vale (by Matthew Lang)
    - New Quest: Desert Spring
    - New quest: Tomb Raider
    - New event: Prison Break (by Fae)
    - New event: Earth Priests Ire (by Fae)
    - New quest: Investigate the Earth (1 quest, 1 event)
    - New quest: Endurance Trainer for Hire (2 quests, 1 opportunities)
    - New quest: Drow Rite of Adulthood
    - New quest: Kobold Rescue
    - New quest: Treasure Hunt: Deeprealms.
    - New quest: Trading Mission: Drak Xoth
    - New quest: Demon Hunting Party
    - New quest: Dwarven Alchemy
    - New quest: Kobold Benevolent Agency
    - New quest: Gateway Gamble.
    - New quest: Trading mission: V'errmyrdn.
    - New quest: Secret Seller
    - New quest: Owner Magnifique
    - New quest: Bounty hunt: Spiders
    - New quest: Recruiment: Deep
    - New quest: Scout: Deep
    - New quest: Contact: Deep
    - New event: Pit Traps
    - New event: A gift from the kobolds.
    - New event: Revenge of the Drow
    - New event: Drow Hex
    - New event: Slave Appropriation
    - New event: A Gift from the Drow
    - New activity: Warehouse help around
    - New lore: Kobold (by Fae)
    - New lore: Drak Xoth (by Fae)
    - New lore: Temple of Gaiatal (by Fae)
    - New lore: Drow
    - New lore: Drow Rite of Adulthood
    - New lore: Leopold Pavo
    - New lores: Kurdwisec, Gaius the Just
    - New blessing: Blessing of Wolf
    - New curse: Curse of Lamb
  - New region: The Deeprealm
    - Unlock by building the Library
    - Ships with 19 quests
    - New buildings:
      - Scout Tunnel
      - Scout Outpost: Deeprealm
    - New duty:
      - Deeprealm scout
    - New contact:
      - Deeprealm contact
  - New race: Kobolds
    - Includes nameset
    - Includes company
    - Includes new sex action
    - Includes font
    - Ships with more than 60 portraits
    - Dual fire/earth affinity
    - Can start as a winged kobold.
  - New race: Drow
    - Includes nameset
    - Includes company
    - Includes new sex action
    - Includes font
    - Ships with more than 60 portraits
  - Lore
    - New lore type: person lores
    - Lorebook now automatically set it to be prerequisite for its lore
  - Content Creator
    - New toolbar additions:
      - Duty selector
      - Money formatting
      - Favor formatting
      - setup.getUnit
      - "has ever completed this quest?"
    - New cost:
      - CleanMentalTraits.
    - Can override existing content in CC.
    - Company selector in CC now use dialogs.
    - Pressing UNDO now shows a big warning
  - Images
    - New room images (by toyRubberDucky):
      - Milker Room
      - Anal Training Room
      - Oral Training Room
      - Vaginal Training Room
      - Sitty Training Room
      - Pet Training Room
      - Dominance Training Room
      - Masochist Training Room
      - Brainwashing Room
      - Endurance, horny, obedience training room
    - Updated CCSubmission Imagepack to separate out Drow portraits (thanks to Matthew Lang)
    - Add Merchant Revenge painting texts (by Matthew Lang)
    - A bunch of new portrait and content images.
    - New image for Kobold rescue
  - Trait
    - New special perk: Savior kobold
    - New special perk: Kobold heritage
    - New special perk: Wild magic.
    - New perk: Needy bottom (thanks to Matthew Lang)
    - New trait: value high tier (7)
    - Add values required to the value trait
    - Add legendary/epic rarities for traits
    - Race trait rarity adjustments
    - Dragonkin now has dual light/fire affinities.
    - Slight nerf to "increase boon" perk
  - Balancing
    - Increase limit of relationship manager from 5 -> 7
    - Added different fighter roles per region
    - Increase favor limit from 120.0 to 200.0
    - Library cost reduced to 2000
    - Owner magnifique and daring escapade level adjustments.
    - Slave Merchant no longer generate order with rare/unicorn bg traits
    - Fort Restoration Awards is made slightly easier.
    - Removed limits on Player Character trait retention during New Game Plus
    - Enforced limit of 1 Regalixir Quest spawn for a PC (tracked across NG+) to prevent abuse with removed NG+ limits.
  - Item
    - Potion of Greater Level Up
    - Potion of Pain
    - Potion of Lust
    - A huge bunch of new perk potions
    - Show potion restrictions in text
  - Interactive Sex
    - New sex action: Spit in face (Innoxia)
    - New sex action: Step on dick
    - Anal sex enjoyment skill adjustments (thanks to Matthew Lang)
  - QoL
    - Add trait rarity filters
    - Rarity indicators / filters / sort for market objects
    - Rarity indicators for item/equipments.
    - Equipment market and Sex market are combined.
    - 1.25x, 1.75x and 2.5x zoom for fort
    - Quest skill filter added to in-game wiki
    - Slave pen slaves now get training_none if they have no training
    - Value traits now also displayed on slavers.
    - Display slaver value on their cards
    - Busy units can be taken to new game plus now.
  - Documentation
    - Updated help texts for CC difficulty.
    - Documentation for where to get items and items that are not obtainable in gitgud
    - Removed unused companies.md
    - Add Duty room to bedchamber prerequisites + help texts.
    - Skill focus help text readability fixes.
    - Adjacency bonus clarification.
    - Race faq updated with drow and kobold.
    - Scarier warning for itch.io people.
    - Kobold name credits
    - Updated download links in various places
    - Added deployment guide
  - Engine
    - DOM-ification:
      - ItemPool card
      - EquipmentPool card
    - Support for injured recruits.
    - Rarity refactored.
    - Refactor Matthew Lang's folders into subfolders
    - Lore refactored into individual files
    - Skill now cached for performance
    - Skill breakdown in tooltips.
    - Unit value now cached for performance
    - Unit value breakdown
    - Fix bedchamber switching not changing unti skills
    - Add actors to quests that are missing them in backwards compat
    - Logic improvement for Quest Auto-Assign by stevejackson121
  - Rewrites
    - Redrafted Food For the Pack for grammar and consistency. (thanks to Matthew Lang)
  - Misc
    - New lore tag: culture lores
    - Added generic value-increasing titles
    - Added various anal dildoes
    - Renamed Grand hall -> Great hall
    - Remove escapedslaves unit group
    - Adjusted unit rarity thresholds
    - Rarity icons.
    - Family now refer to each other with their family titles.
  - Debug mode
    - Add debug info for scheduled content
    - Add debug info for change in variable values
  - Bugfix
    - Fix soft lock by hiding building before building great hall.
    - Fixes for Elven Hot Springs: Mens Business
    - Fix article toUpperFirst on undefined article.
    - Fixes for kobold ire events.
    - Fix missing "at home" conditions for some perks
    - Fix trait-changing perks triggering when not at home
    - Fix wrong key used when overriding existing quest
    - Fix missing rarity tag in CC
    - Fix title generation bug.
    - Fix kobold sometimes not getting the dwarf trait
    - Fix missing orc in mansion of hypnotism
    - Fix mystifying obelisk slave order crashing
    - Fixed crashing when undo and redo with gOldPassage set to null
    - Fixed "Revenge of the Kobold" giving the same slave twice
    - Fix broken skill focus display.
    - Fixed extra "pert smart" critical for blacksmith orders
    - Bugfix in Quest Kobold Benevolent Agency
    - Fix test of social requiring unit with test of social tittle
    - Fix bug in Trading Mission: Neko Port City where critfail logic had player fuck themselves as punishment.
    - Add missing `>` causing error on executing if/else statement. (thanks to steven)
    - Fix favor not decaying above 120.0
    - Fix errors occuring during test + documentations
    - Fix new game plus breaking the game.
  - Text fixes
    - Grammar fix -kins to -kin suffix as kin is already plural. Thanks to Elannil
    - Updated Potion of lust Quests for repeatability (thanks to Matthew Lang)
    - Fixed most* instances of -kins to proper plural -kin (thanks to Elannil)
    - More description updates and text fixes (thanks to Elannil)
    - Fixed broken blessing texts when getting one when already at cap.
    - Fix test of arcane missing magic conditionals.
    - Fix changelog "CHANGELOG" not removed
    - Fixed dildo (anus) -> dildo (anal)
    - Fix extra whitespace at start of CC result.
    - Fix spoilery perk texts in perk potions.
    - Fix change skill focus texts
    - Better error message on visiting the captured
    - Various building description fixes (thanks to Elannil)
    - Fix some inconsistencies in pimp/rec wing descriptions
    - Some text fixes for trading mission.
    - Defiant slave event text fixes (thanks to Elannil)
    - Fixed extra space in lore mentions.
    - Fix comment on lorebook page.
    - Fix kobold/drow starting options.
    - Human -> humanoid adjective for skins
