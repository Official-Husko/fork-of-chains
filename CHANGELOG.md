### Changelog

[Changelog summary](docs/changelog_summary.md)


### v1.8.5.x

v1.8.5.0:
  - Added experimental mod system
  - Fixes:
    - Fix some minor typos (thanks Natharantos)
    - Fix quest "Flesh Shaper Temple: Patronage - Fearsomeness" not giving scary face to the patron
    - Fix quest "Bandits on the Roads" texts only showing the units name instead of icon
    - Fix filter bar background color
    - Remove sidebar calendar info at the start screen
  - Code refactors:
    - Several twee files converted to js/dom (thanks fortmage)
    - Devtool code editor: remove dependence on CDN, now editor is bundled as dynamically loaded js file (as it is relatively big)
  - Build system changes:
    - Switch from webpack to vite
    - Add support to compile twine on ARM64 macOS (e.g. M1 chip)

v.1.8.5.1:
  - A few bug fixes

### v1.8.4.x

v1.8.4.0:
  - Fixes:
    - Made "scaled money" return at least 1g, to avoid weird dialogues such as "sold for 0g"
    - Fix mismatched twee tag in advanced pony training (thanks madscience)
    - Fix "The Sissy Training: Basic" quest using the image of the advanced tranining
    - Fix "Desert Traveler" quest applying some traits to slaver instead of slave
    - Fix "Chance Meeting" opportunity using wrong scoring for submissive and dominant traits
    - Fix for infinite money glitch when having a NaN amount of an item
    - Fix error on Week End due to invalid events ("event is undefined" / "isCanGenerate")
    - DevTool: Fix wrong devtool description for "Domify" cost
    - DevTool: added new grouping for fort quests in the "quests list" menu

### v1.8.3.x

v1.8.3.0:
  - New quest chain: Household Destruction (5 quests, 5 opportunities, 6 events)
  - Fix VarAdd adding strings instead of integers in some cases
  - Non-company unit rep now show details in debug mode
  - New cost: Domify unit
  - Curse of lamb and curse of wolf now affect sluttification / domification

### v1.8.2.x

v1.8.2.5:

  - A bunch of new images
  - Fix deleteUnit duplicated in unit image
  - Remove hardcoded child inherit chance in unit birth
  - New cost: Sluttify unit

v1.8.2.4:

  - Written player specific background variants for 40+ existing events.
  - Dragonkin knights are more common now

v1.8.2.3:

  - Fix savior kobold not allowing master fire / light slavers to go (thanks to DangThings)
  - Fix missing tags in tomb raider quest
  - Fix missing tooltip on dragonkin's dual fire / light affinities
  - New event: Penitent (by FCdev)

v1.8.2.2:

  - New event: chastity release
  - Fixed gilded pet tray [unobtainable] name not removed.

v1.8.2.1:

  - New event and opportunity: Revenge Attempt
  - More granularity of sold slave unit group

v1.8.2.0:

  - Moved reddit mentions to discord.
  - Fix sea scout having three good traits.

### v1.8.1.x

v1.8.1.6:

  - A bunch of new quest images
  - Various text fixes
  - Quest that break slaves now inform player that they can ignore it to make another one
  - Fix unable to use healing treatments on injured units

v1.8.1.5:

  - New Event: Work unending
  - New event: Skybound recreation
  - Rape fetishist cost reduced to 500

v1.8.1.4:

  - New Event: Morphing Cage
  - New Quest: Rape Fetishist
  - New furniture: Morphing Cage

v1.8.1.3:

  - New livings:
    - tentacle savior
    - tentacle slaver
    - vice leader
  - A bunch of text fixes

v1.8.1.2:

  - New quest chain: Desert Spring (3 quests) with images.
  - Male and female for Bounty Hunt: Minotaur
  - Female image for Gorgon Cave

v1.8.1.1:

  - New feature: upcoming events
    - New building: noticeboards
    - Once you build the noticeboards, known upcoming events are now shown
      on the top right menu
    - Fully integrated with content creator
  - New activity: Noticeboards gossip
  - New activity: Noticeboards reading
  - Images for academy of wind quest
  - Some text and wording fixes here and there
  - Rewrote top left menu into DOM

v1.8.1.0:

  - Updated credits.
  - Various new images.
  - Human -> humanoid adjective for skins
  - Fix new game plus breaking the game.

### v1.8.0.x

v1.8.0.3:

  - New Quest: Desert Spring
  - New quest: Tomb Raider
  - Itch.io deployment instructions.
  - Fix errors occuring during test + documentations
  - Buildtwee docs.
  - Various new images and unit portraits.

v1.8.0.2:

  - New image for Kobold rescue
  - Family now refer to each other with their family titles.
  - Fixed readme.
  - Add deployment guide links to readme.
  - Fix favor not decaying above 120.0

v1.8.0.1:

  - Add missing `>` causing error on executing if/else statement. (thanks to steven)
  - Update changelog.txt (thanks to Matthew Lang)
  - New Quest: Tiger Bank Debt Collection - Vale (thanks to Matthew Lang)
  - Update Changelog. (thanks to Matthew Lang)
  - Updating changelog and precompiled.html (thanks to Matthew Lang)
  - Bugfix for Trading Mission: Neko Port City (thanks to Matthew Lang)
  - Update README.md
  - Deployment guide.
  - Fix test of social requiring unit with test of social tittle
  - Fix bug in Trading Mission: Neko Port City where critfail logic had player fuck themselves as punishment.

v1.8.0.0

 - Removed limits on Player Character trait retention during New Game Plus
 - Enforced limit of 1 Regalixir Quest spawn for a PC (tracked across NG+) to prevent abuse with removed NG+ limits.
 - Logic improvement for Quest Auto-Assign by stevejackson121
 - Bugfix in Quest Kobold Benevolent Agency
 - New Quest: Tiger Bank Debt Collection - Vale (by Matthew Lang)

### v1.7.1.x

v1.7.1.10

 - Grammar fix -kins to -kin suffix as kin is already plural. Thanks to Elannil

v1.7.1.9:

  - Updated download links in various places
  - Add actors to quests that are missing them in backwards compat
  - Fixed extra "pert smart" critical for blacksmith orders

v1.7.1.8:

  - Fix broken skill focus display.

v1.7.1.7:

  - Leopold Pavo lore
  - Add Merchant Revenge painting texts (by Matthew Lang)
  - Fix bedchamber switching not changing unti skills

v1.7.1.6:

  - Skill now cached for performance
  - Skill breakdown in tooltips.
  - Unit value now cached for performance
  - Unit value breakdown
  - Can start as a winged kobold.
  - Fix comment on lorebook page.
  - Fix kobold/drow starting options.

v1.7.1.5:

  - New quests: A Merchant's Revenge: Embarras A Rival (by Matthew Lang) (3 quests, 1 mail)
  - Refactor Matthew Lang's folders into subfolders
  - Kobold now has dual fire/earth affinity.
  - Lore refactored into individual files
  - New lore type: person lores
  - New lores: Kurdwisec, Gaius the Just
  - Lorebook now automatically set it to be prerequisite for its lore
  - A bunch of new lorebooks
  - Some text fixes.

v1.7.1.4:

  - New blessing: Blessing of Wolf
  - New curse: Curse of Lamb
  - Kobold name credits
  - Grand hall rename fix added to changelog.
  - Fort Restoration Awards is made slightly easier.
  - Busy units can be taken to new game plus now.
  - More images.

v1.7.1.3:

  - Fixed crashing when undo and redo with gOldPassage set to null
  - Fixed "Revenge of the Kobold" giving the same slave twice

v1.7.1.2:

  - New Quest: Bounty Hunt: Hole Gaper.
  - Redrafted Food For the Pack for grammar and consistency. (thanks to Matthew Lang)
  - A bunch of new portrait and content images.
  - Add "has ever completed this quest?" to CC toolbar
  - Fixed extra space in lore mentions.

v1.7.1.1:

  - Endurance, horny, obedience training room images (by toyRubberDucky)
  - Oral training room images made more androgynous (by toyRubberDucky)
  - Slave pen slaves now get training_none if they have no training
  - Value traits now also displayed on slavers.
  - Display slaver value on their cards
  - Scarier warning for itch.io people.

v1.7.1.0:

  - New quest: Demon Hunting Party. Closes #345.
  - Room images by toyRubberDucky:
    - Milker Room
    - Anal Training Room
    - Oral Training Room
    - Vaginal Training Room
    - Sitty Training Room
    - Pet Training Room
    - Dominance Training Room
    - Masochist Training Room
    - Brainwashing Room
  - Updated CCSubmission Imagepack to separate out Drow portraits (thanks to Matthew Lang)
  - New drow portraits.
  - New content images.
  - Updated help texts for CC difficulty.

### v1.7.0.x

v1.7.0.33:

  - Sissy basic male image.
  - Potion of Greater Level Up
  - Drow company descriptino updated
  - Pet training image + drow females
  - Text fixes.
  - Fix test of arcane missing magic conditionals.
  - Fix soft lock by hiding building before building great hall.

v1.7.0.32:

  - New quest: Dwarven Alchemy.
  - New quest: Kobold Benevolent Agency.
  - Region fighter roles.
  - UNDO warning in CC.
  - Kobold race balance adjustments.
  - Potion cleanup and text fixes
  - Documentation for where to get items and items that are not obtainable

v1.7.0.31:

  - Equipment market and Sex market are combined.
  - Fix changelog [CHANGELOG] not removed
  - Fixed borked blessing texts when getting one when already at cap.

v1.7.0.30:

  - New quest: Trading Mission: Drak Xoth

v1.7.0.29:

  - New quest: Kobold Rescue
  - Updated Elven Hot Springs Men's Business Quest Line to include warnigns that raiding could cost you a slaver (thanks to Matthew Lang)
  - Fixes for Elven Hot Springs: Mens Business
  - Race trait rarity adjustments
  - Fix article toUpperFirst on undefined article.

v1.7.0.28:

  - Fixes

v1.7.0.27:

  - New event: Prison Break (by Fae). New event: Earth Priests Ire (by Fae)
  - New event: Pit Traps
  - New event: A gift from the kobolds.
  - Fixes for kobold ire events.

v1.7.0.26:

  - Lore entries for kobold companies + city.

v1.7.0.25:

  - New quest: Elven Hot Springs: Mens Business (by Matthew Lang: 2 quests, 2 mails, 1 event)
  - Removed unused companies.md
  - Duty selector to CC toolbar.
  - Company selector in CC now use dialogs.
  - Money formatting to CC.
  - Favor formatting to CC
  - Add Duty room to bedchamber prerequisites + help texts.
  - Add debug info for scheduled content
  - Add debug info for change in variable values

v1.7.0.24:

  - Grand hall -> Great hall
  - Some other text fixes

v1.7.0.23:

  - The Shunned Kobold quest chain (7 event, 7 mail. 3 quest)
  - New activity: Warehouse help around
  - New special perks: Savior kobold and Kobold heritage
  - Some new portraits.
  - 1.75 and 2.5 zoom for fort
  - Dragonkin now has dual light/fire affinities.
  - Kobold background rarities adjustments
  - setup.getUnit to CC toolbar.
  - Remove escapedslaves unit group
  - Support for injured recruits.
  - Fixed dildo (anus) -> dildo (anal)
  - Fixed most* instances of -kins to proper plural -kin (thanks to Elannil)
  - Fix extra whitespace at start of CC result.

v1.7.0.22:

  - Added 1.25x zoom to fort
  - Skill focus help text readability fixes.
  - Fix spoilery perk texts in perk potions.
  - Fix change skill focus texts

v1.7.0.21:

  - DOM-ification for ItemPool an EquipmentPool cards
  - New weapon: Dwarven axe
  - Implemented kobold company favor effects.
  - Increase favor limit from 120.0 to 200.0

v1.7.0.20:

  - Kobold nameset.

v1.7.0.19:

  - More description updates and text fixes (thanks to Elannil)
  - Add legendary/epic rarities for traits
  - Add trait rarity filters
  - Kobold race lores (thanks to Fae)
  - Adjusted unit rarity thresholds
  - Fix missing "at home" conditions for some perks
  - Fix trait-changing perks triggering when not at home
  - slight nerf to "increase boon" perk
  - Added 40+ kobold images (by Fae) For #332
  - 20 more kobold images
  - A bunch of other images

v1.7.0.18:

  - New perk: Needy bottom (thanks to Matthew Lang)
  - Anal sex enjoyment skill adjustments (thanks to Matthew Lang)
  - Better error message on visiting the captured
  - New sex action: Step on dick
  - Drows now give step on dick manual
  - Various anal dildoes. Closes #335
  - Rarity indicators / filters / sort for market objects
  - Rarity indicators for item/equipments.
  - Rarity refactored.
  - Rarity icons.

v1.7.0.17: [TODO BEFORE COMMIT]

  - Updated Potion of lust Quests for repeatability (thanks to Matthew Lang)
  - Fix wrong key used when overriding existing quest

v1.7.0.16:

  - New quest: Investigate the Earth (1 quest, 1 event)
  - Quest skill filter added to in-game wiki
  - Images for Scout outpost deep
  - Images for scout tunnel
  - Icon for scout deep duty

v1.7.0.15:

  - Can override existing content in CC.
  - Library cost reduced to 2000 in preparation of deeprealm

v1.7.0.14:

  - New quest: Gateway Gamble.
  - New special perk: Wild magic.
  - Value titles added.
  - CleanMentalTraits.
  - Value7 Trait
  - Add values required to the value trait

v1.7.0.13:

  - Potion of Lust questchain by Matthew Lang (2 quests)
  - A huge bunch of new perk potions
  - Show potion restrictions in text

v1.7.0.12:

  - New quest: Treasure Hunt: Deeprealms.
  - Content image for: Flesh shape dick
  - Various building description fixes (thanks to Elannil)
  - Fix some inconsistencies in pimp/rec wing descriptions

v1.7.0.11:

  - Finished the Drow race addition into the game
  - New quest: Drow Rite of Adulthood
  - New quest: Endurance Trainer for Hire (2 quests, 1 opportunities)
  - Fix missing rarity tag in CC
  - Fix title generation bug.

v1.7.0.10:

  - New quest: Trading mission: V'errmyrdn.
  - New quest: Secret Seller
  - New quest: Owner Magnifique
  - New event: Revenge of the Drow
  - New event: Drow Hex
  - New event: Slave Appropriation
  - New Event: A Gift from the Drow
  - New lore tag: culture lores
  - New lore: Drow Rite of Adulthood
  - Owner magnifique and daring escapade level adjustments.
  - Adjacency bonus clarification.
  - Added missing drow race lore entry
  - Increase limit of relationship manager from 5 -> 7
  - Some text fixes for trading mission.

v1.7.0.9:

  - New sex action: Spit in face (Innoxia)

v1.7.0.8:

  - Drow names implemented (Dunmer names from elder scrolls)
  - Fix kobold sometimes not getting the dwarf trait
  - Font for kobold
  - Fonr for drow.
  - Race faq updated with drow and kobold.
  - Defiant slave event text fixes (thanks to Elannil)
  - A bunch of new elf images
  - 40+ initial drow images
  - New Location Image: Alchemy Lab (thanks to Matthew Lang)
  - Drow unit group background rarities

v1.7.0.7:

  - Drow race skeleton.
  - Potion of Lust

v1.7.0.6:

  - New quest: Trade Ship Escort: Lucgate to Neko Port City (by Matthew Lang)

v1.7.0.5:

  - Fix recruitment: deep quest having the wrong actor
  - Skeleton for New race: Kobold
  - New company: Kobold (temporary name)

v1.7.0.4:

  - Fix missing orc in mansion of hypnotism
  - Fix mystifying obelisk slave order crashing
  - Various fixes

v1.7.0.3:

  - Remove scout tunnel from vet hall requirements for now

v1.7.0.2:

  - New region: Deeprealm.
  - New quest: Bounty hunt: Spiders
  - New quest: Recruiment: Deep
  - New quest: Scout: Deep
  - New quest: Contact: Deep

v1.7.0.1:

  - Readme v1.7 fixes.
  - Slave Merchant no longer generate order with rare/unicorn bg traits
  - New content images:
    - A High Class Brothel (classy, male)
    - A High Class Brothel (classy, female)
    - Mobile brothel (female)
    - Obedience Training: Basic (male, 2nd variation)
    - Pony Training: Basic (femdom)

v1.7.0.0:

  - v1.7 released

### v1.6.5.x

v1.6.5.23:

  - Skill focus menu UI is fully modernized
  - Tutorial for skill focus
  - Skill focus button moved to main unit menu set
  - Fix duplicated skill focus menu

v1.6.5.22:

  - Can remove rooms from the room list menu in renovation mode

v1.6.5.21:

  - A Merchant's Revenge: Caravan Raid (City of Lucgate) (by Matthew Lang)
  - A Merchant's Revenge: A Careless Raid (by Matthew Lang)
  - A Merchant's Revenge: Complications (by Matthew Lang)
  - A Merchant's Revenge: An Unfortunate Report (by Matthew Lang)
  - A Merchant's Rage (by Matthew Lang)
  - V1.7 readme
  - D&D quest text fixes.

v1.6.5.20:

  - Copy to clipboard button
  - fix <<optif>> missing the skipArgs argument

v1.6.5.19:

  - New portraits Inserted image into Merchant's Revenge: Payback is Sweet opportunity (thanks to Matthew Lang)
  - Changelog summary for v1.7
  - Changelog and readme for v1.7
  - Fix `<<optif>>` not working with complex arguments.

v1.6.5.18:

  - Readme update for v1.7
  - Fix high demon society order text missing HideAll.

v1.6.5.17:

  - Add <<fontsize>> macro.

v1.6.5.16:

  - Font fixes to make them slightly more uniform.

v1.6.5.15:

  - New activity: Great hall gossip.
  - Added `<<font>>` macro to CC and toolbar.
  - New Male Portraits (thanks to Matthew Lang)
  - Bugfixes and Innoxia credits for sex activities.
  - Fixed comments in Merchant's Revenge Caravan Raid quests to prevent notes from showing in game. (thanks to Matthew Lang)

v1.6.5.14:

  - Added the scaley tag
  - Renamed the tag 'anthro' to 'furry' internally
  - New Male Portraits (thanks to Matthew Lang)
  - Bugfix for merchant revenge caravan vale
  - Fix blackmail referring to wrong unit in text
  - Starting slaver choice: 10 -> 12

v1.6.5.13:

  - Bounty hunt: slime (male) image
  - Docs on images.
  - Fix undefined experation on varset

v1.6.5.12:

  - A merchant revenge: revenge event (by Matthew Lang)
  - Bugfix - A Merchant's Revenge repeating start quest (thanks to Matthew Lang)
  - The fire taketh now take two slaves instead of one
  - Be cleansed in fire now remove non-magic skill traits too
  - Height clarifications in their texts
  - Fix VarSet bug
  - Fixed "wommon elf"

v1.6.5.11:

  - "Mistyfing Obelisk" quest chain by "Fae" (2 quests, 1 opportunity). Horny training technology
  - Fix VarSet without variables.
  - Variables in debug settings

v1.6.5.10:

  - Flesh-shaping muscle now inflict the "Artificial body" title.
  - Automatic validation of quest roles implemented, and 30+ fixes on existing quests
  - Validation of unit group in content creator
  - Fix offsetmod not being used properly in content creator

v1.6.5.9:

  - New feature: Negative titles. And fixes for visiting the  captured
  - New event/opportunity: A merchant's Revenge: Visiting the Captured by Matthew Lang
  - Trading Mission: Neko Port City now easily scoutable
  - A Merchant's Revenge - update and rebalance (thanks to Matthew Lang)
  - Updated Forest Trade quest (thanks to Matthew Lang)
  - Plural for neko is neko now
  - 10 new images: milk factory, display of love, sissy, obedience, slave merchant, goblin recue
  - New activity: Clean shoes.
  - Added <<uyesmaster>> to CC
  - New Portrait images + Location image for new quests (thanks to Matthew Lang)

v1.6.5.8:

  - Fix sissy slave using theatre slave texts and requirements.

v1.6.5.7:

  - Added backwards compatibility support for quests whose property changed
  - Fix anytrait: '' instead of anytrait: []
  - Fix missing location tags for some new quests.
  - Fix top left link disappearing when clicking tab in right sidebar. Right sidebar to DOM

v1.6.5.6:

  - New quest: Noises in the Cellar (by Matthew Lang)
  - New event: Sore Ass (FCdev)
  - New event: Used whore (FCdev)
  - New event: Devoted Entertainment Slave (FCdev)
  - New Event: Slave Dick on Slave (FCdev)
  - Added QuestDone(null) to CC
  - Fix questing knight disaster, bandings on the road bugs
  - Fix make instance from debug menu missing gPassage

v1.6.5.5:

  - New quest: A Merchant's Revenge: Caravan Raid (Southern Seas)
  - New activity: Library study + A bunch of new images
  - New lore: Cathay (continent in the south) (thanks to Matthew Lang)
  - Fix errors on deploy.sh when itch io file is missing
  - Fix item price not shown when you can't buy items in market
  - Update textcheatsheet.md
  - Fix debug edit level / skills not working on PC

v1.6.5.4:

  - Fix isHasTrait broken when the trait is null.

v1.6.5.3:

  - New quest: Test of Aid
  - New quest: Test of Slaving
  - New event: Heavenly Recruit

v1.6.5.2:

  - Add Settings to Content Creator

v1.6.5.1:

  - Fix error opening settings in a new game.
  - Removed stray yesevanone folder

v1.6.5.0:

  - New activity: Marketer Marketing
  - Increase activity trigger chance from 0.6 to 0.9.
  - Lighten female card color.
  - Help text for adjacency bonus in rooms.
  - Can enable unit name using different font per race in settings.
  - Settings grouping. Closes #327
  - Fix "$.slaves".
  - Fix some incorrect activity rarities.

### v1.6.4.x

v1.6.4.29:

  - Fix failure outcome undefined in CC failure quest.

v1.6.4.28:

  - `<<rep>>` now colored, Can be changed in settings
  - Unit icons in texts now hidden by default. Can be turned on in settings
  - Male/female units cards now have purple/blue at the bottom right.
  - Recolored retired to gray.

v1.6.4.27:

  - New activity: Mail room read mail
  - Documentation for doing first issue for coders
  - DOM-ification of OpportunityAutoAnswer
  - Remove selectunit and domification of itemunitusableon. For #319
  - OpportunityOptionSelected and TrainingDo to DOM. For #319
  - Fix wine order wrong actor mention.

v1.6.4.26:

  - Added new lore: Cassian Mountains (thanks to Matthew Lang)
  - Common elf -> wood elf
  - New Event: Demonic Roleplay (by FCdev)
  - New portraits and images for: Mist apprenticeship (male), pirates ahoy, unit training endurance, oral, roleplay (female)
  - Verbose error message for isHasTrait
  - Harvesting the fields Quest text fix (thanks to Matthew Lang)
  - New Quest: A Merchant's Revenge: Caravan Raid (Eastern Desert) by Matthew Lang
  - New quest: "Lost Puppy" by Hydrys. Quest errors now dont error the entire page

v1.6.4.25:

  - New activity: Hospital recovering
  - Add roleplay slave training.
  - Removed edging slave training.
  - Role has any, all, no traits conditions in CC
  - More cheatsheet stuffs.
  - Remove UNITIMAGE_NOBACK from image metadatas
  - Added imagepack info to image credits
  - Updated Prince of Cups slave order to be more lucrative and fix text issues. (thanks to Matthew Lang)
  - Fix activity on passable room and text cheat sheet.
  - Fix caravan raid kingdom found in forest instead of city
  - Dom/endurance/horny/obedience/roleplay now remove incompatible trait on success

v1.6.4.24:

  - New quest: A Merchant's Revenge: Caravan Raid (Kingdom of Tor).
  - New macro: ustripverb
  - Fix library costing 2.5m instead of 5000g
  - Fix extra "TODO BEFORE COMMIT"

v1.6.4.23:

  - Moved git repository to https://gitgud.io/darkofocdarko/fort-of-chains
  - Moved references from old repo to new repo.
  - Credits for old commits
  - Stop babel being noisy on new version
  - Clarify `edit` quest doesn't edit it but creates a duplicate instead
  - Fix missing customunit folder
  - Fix custom image not zoom-able and missing in dialogues

v1.6.4.22:

  - Moved default image pack to imagepacks/default
  - Fixed comment tag to prevent code comments showing up in game (thanks to Matthew Lang)

v1.6.4.21:

  - New company: Royal Court
  - New events:
    - A Gift from the Royals
    - Knight of Honor
    - Court Gossip
    - Daylight Robbery
  - New activity: Browse wares.
  - Continent lore now use geo tag.
  - Fix slave refusing sex.

v1.6.4.20:

  - Can get ugly/beautiful and tall/short from prologue too
  - Fairy offer and tower of roses now show the unit before recritment choice.
  - Fix isHasAnyTraitExact and merchant revenge.
  - Rec wing pimp small rebalance. Closes #299

v1.6.4.19:

  - You can gain/lose a trait every time you restart with new game plus now

v1.6.4.18:

  - New quest: "A Merchant's Revenge: Caravan Raid (Western Forests) by Matthew Lang
  - New quest: "Attitude Adjustments" by Choker Guy
  - Added new Geo lores.
  - Named the middle river as River Cerna
  - Bugfix - Quest: A Merchant's Revenge the Search Continues - fixed flirt variable implementation. (thanks to Matthew Lang)
  - Bugfix - A Merchant's Revenge - Trait Checks now firing correctly (thanks to Matthew Lang)
  - Edited quests "Raid Elven Forest", "Bounty Hunt Bear" and "Monk Business" for consistency, grammar, spelling and flow. (thanks to Matthew Lang)
  - New portrait images (thanks to Matthew Lang)
  - Make the dom actor in attitude adjustment use the slaver gender pref.
  - Changed rare quest border color to blue to make it consistent with the rest.
  - Library is now a prerequisite for great hall.

v1.6.4.17:

  - A Merchant's Revenge: Caravan Raid (vale) by Matthew Lang
  - Documentation for adding NPC units with traits/titles
  - Added History lore
  - Added sylvan-neko war lore netry
  - Various quest fixes.

v1.6.4.16:

  - New activities:
    - Retiree visit
    - Pet Walking
  - Full rewrite of debug content/quest/event/interaction/activity to DOM
  - Added interaction to in game wiki
  - Can debug activity specifically. Closes #313
  - Lots of new... puns
  - Added debug info on interactive sex.
  - Fix changelog not updated.

v1.6.4.15:

  - CC now automatically format the texts before showing end result.
  - Added "if any unit on quest is you" to toolbar.

v1.6.4.14:

  - New activity: Forge Blackmisth
  - Rep now hides non actor units.
  - Support for NPCs for activites
  - Can use the same text for all personalities in activities
  - Activity in CC now can no longer remove the primary unit
  - Buffed alpha were title value from 5000 to 8000.
  - Fix dirty talk causing sex interaction to break.
  - Hobby text refactor.
  - Add unitcard to some opportunities and CC.

v1.6.4.13:

  - New opportunity: A Merchant's Revenge: Payback is Sweet (by Matthew Lang)
  - More CC toolbar things
  - TagNotBanned restriction
  - "howdy, folks",

v1.6.4.12:

  - New activites: sparring, praying
  - Kingdomfolks are officially named Torans.
  - A bunch of new perks
  - Increase perk choice from 5 to 6.
  - Fixed typo - in a Very Special Wine Order (thanks to Matthew Lang)
  - Rename none to "old end table" for statue.
  - Fix Test of Arcane description fatally bugged.
  - Fix quest debug descriptions and some new content images.
  - Fixed "earened".

v1.6.4.11:

  - Chaste slavers no longer initiate sex activities.
  - DOM conversions:
    - Settings
    - Skill focus
    - Change active title
    - Unit debug

v1.6.4.10:

  - New quest: "Raiding the Weres" by Fae
  - Units can now refuse sex with you.

v1.6.4.9:

  - Added syntax check all to debug menu
  - CC now check for syntax errors before confirming.
  - Syntax checker now show surrounding context.
  - Fort expansion cost balance adjustments.
  - Various text fixes.
  - Fixed "easyly"
  - and fix numerous syntax bugs.

v1.6.4.8:

  - New portraits in CCSubmission (thanks to Matthew Lang)
  - Updated to set text back to intended edits - adds variant text in case PC goes on quest. (thanks to Matthew Lang)
  - Upate to Raid Elven Village again - fixing name tags and If statements (thanks to Matthew Lang)
  - Updated Event 'A Very Special Wine Order' to include the intended slave order and fix some pronouns (thanks to Matthew Lang)
  - Fix itch.io build command and some image issues.

v1.6.4.7:

  - Fort expansion cost rebalance (second pass): roughly 25% cost reduction and moved cliff backwards 10 expansion.
  - Content images: capital of slaves faemale, river spirit
  - Some new portraits.

v1.6.4.6:

  - New quest: A Merchant's Revenge: The Search Continues (by Matthew Lang)
  - Fixed save -> load before init base causing error.

v1.6.4.5:

  - Auto-indent button and auto-indent content before printing it

v1.6.4.4:

  - New Sex Action: Dirty talk (Innoxia - Lilith's Throne)
  - New activitives:
    - Anal tailfuck a slave
    - Buttfuck a slave
    - Consensual anal
    - Consensual anal tailfuck
    - Consensual cunnilingus
    - Consensual oral
    - Consensual tailfuck
    - Consensual vaginal
    - Facefuck a slave
    - Fuck a slave
    - Have a slave eat you out
    - Have a slave fuck you
    - Have a slave tailfuck you
    - Tailfuck a slave
  - Added tooltips for all in-game menus.
  - Added ALL and ANY traits conditionatls to CC
  - Raid Elven Village quest update (thanks to Matthew Lang)

v1.6.4.3:

  - New quest: Test of Arcane
  - Fix articles becoming undefined in some places
  - Fix erroneous p tags in merchant revenge quest.
  - Fix author info duplicated in outcomes

v1.6.4.2:

  - Fix "imagepacks/imagepackss" shown in imagepack card.
  - Fix content description not written inside <<capture>>

v1.6.4.1:

  - A Very Special Wine Event by Matthew Lang
  - UnitGroupNotBusy restriction

v1.6.4.0:

  - New Activities:
    - Lazy Napping
    - Tidying up Bedroom
  - Added inline effects to CC toolbar
  - Removed several immersion-breaking male images now that we have the CCSubmission pack by Matthew Lang (thanks to Matthew Lang)

### v1.6.3.x

v1.6.3.27:

  - Articles in contents are now automatically parsed to be "a" or "an".
  - Documentation for articles.
  - Fix the _Elf in wailing woods sometimes not having a unit there.

v1.6.3.26:

  - New quest: A Merchant's Revenge (by Matthew Lang)
  - Added letter card formatting to CC toolbar
  - Some "of of" fixes

v1.6.3.25:

  - Dialogue for "Like me" event.
  - Add else clauses to building/item conditionals.
  - New Lore: Prince of Cups (thanks to Matthew Lang)
  - Removed cached tiles / gFortGridControl cached infos from save files to make its size smaller
  - Updated some tooltip texts in CC toolbar
  - Some more text fixes in CC.
  - Fix errors when saving on the fort grid menu
  - Fixed "</else>"
  - Fixed code editor tooltip staying after scrolling down

v1.6.3.24:

  - Fixed lodgings price roadblock being at 14 instead of 18.
  - Add formatting toolbar in CC
  - "Raid Elven Village" by Matthew Lang
  - Add buildling/item conditionals in CC
  - Update CC cheatsheet

v1.6.3.23:

  - "Bandits on the Road" by Matthew Lang (1 quest 2 events)
  - ZeroTitle unit restriction

v1.6.3.22:

  - The Wailing Woods by Matthew Lang
  - Fix New Game Plus removing game version number

v1.6.3.21:

  - Fix dialogue having extra space and newlines.

v1.6.3.20:

  - Added tooltips for code editor toolbar menus.

v1.6.3.19:

  - New feature: Activity template
    - This is a pure flavor feature
    - Available slavers that are idling at home can engage in activities
    - They can be found in your fort, and hovering over them give you a one liner or two
    - Fully integrated with content creator: you can make new activities with it
    - Fully integrated with testing too
  - New feature: Speech bubble
    - Texts can have speech bubbles interpersed with them now
    - Available in content creator too
  - New activity:
    - Doctor Deskjob
  - New content creator toolbar options:
    - Automated greeting texts
  - Update Hospital_Visit to check for PC injury - Matthew Lang (thanks to Matthew Lang)
  - A bunch of new images for the CCSubmission image pack by Matthew Lang (thanks to Matthew Lang)
  - Fixed missing words and some coding errors on Hospital Visit quest - Matthew Lang (thanks to Matthew Lang)

v1.6.3.18:

  - setup.getUnit supports even more options now

v1.6.3.17:

  - Setup.getUnit refactor.
  - can use setup.getUnit to search for traits.

v1.6.3.16:

  - Rare and Legendary tags
  - Lots of new content images
  - Having a missing content image now throws an error in debug mode.
  - Added gradient for rare, legendary, or special quest.
  - Remove border radiuses on cards
  - Added some jsdocs for available.js
  - Added warning on itch.io compiled version
  - Added whether it was [itch.io] version or not to error log
  - Fix missing commas at qres.Available
  - Available help text fixed.
  - Visiting the injured minor updates (thanks to Matthew Lang)

v1.6.3.15:

  - Can hide buildings.
  - Some text fixes.
  - Fix Content Creator slowdown from rooms
  - Replace QuestingSquire.twee - Quest edit for grammar and spelling - Matthew Lang (thanks to Matthew Lang)
  - Update investment_banking.twee quest - edit for grammar, flow, tense and gender of the elven attendant being descriptively stuck as female. - Matthew Lang. Note deliberately used 'their' in some cases as am referring to the slavers collectively. (thanks to Matthew Lang)
  - Fix wrong pronoun in bear hunt.

v1.6.3.14:

  - New quest: Harvesting the Fields (by Matthew Lang)
  - Update _texts.twee - grammar and spelling check. (thanks to Matthew Lang)
  - New hobbies texts for traits (thanks to Matthew Lang)

v1.6.3.13:

  - Added uadvcare and uadvabuse.

v1.6.3.12:

  - A lot of content images
  - Refactored default imagepack into a regular imagpeack.
  - Fixed broken custom imagepack

v1.6.3.11:

  - Support for default image packs that comes shipped with the game
  - CCSubmission Image Pack by Matthew Lang
  - Imagepacks moved to DOM
  - Edit for spelling, grammar, text flow, slightly more realistic wolf behaviour... (thanks to Matthew Lang)

v1.6.3.10:

  - Hospital visit + Visiting the injured by Matthew Lang
  - Add more info into cheat shet.
  - Fix missing details closing bracket in cheat sheet.
  - Fix error when auto-generating opportunity with player character

v1.6.3.9:

  - Content image for: Werewolf hunt.
  - Unstable bodyshifter and doppelganger now only shapeshift at home.
  - Links to content creator cheatsheet.
  - Fix if any  role has not working more than once and cheatsheet.
  - Fix chests -> chest

v1.6.3.8:

  - New standard perk: Switch
  - Content creator now auto-saves when clicking CREATE.

v1.6.3.7:

  - New special perk: Chaotic Personality
  - Rivalry and friendship bonus now always active whenever both are slavers, but toned down by 20%.
  - Updated help text for friendship/rivalry.
  - New portrait.
  - Fix tigerkin and fairy not using neko and elf names.
  - Fix itch.io map and room embeds.

v1.6.3.6:

  - Fort grid saves scroll position more liberally now.
  - Fix renovation office text.
  - Some new fantasy naems

v1.6.3.5:

  - Fort loading is made much faster via asynchronous loading
  - Change of Heart potion renamed to Potion of Submissive Cure
  - Yard and farm no longer passable.
  - Fix Auto-place broken by pathing changes
  - Fix rec wing buildings having the door in the wrong column
  - Fix walls overlapping buildings images.
  - Fix error when trying to upgrade by mass clicking.

v1.6.3.4:

  - Content images:
    - Southern isle pit fights (male)
    - Southern isle pit fights (female)
    - Whore of Ministration (female)
    - Trading Mission: Desert (male)
  - Some new portraits
  - Fortgrid tile multiplier upped from 1.2 to 1.25.
  - Path images now consists of 2x2 16px tiles.
  - Fix "Violin Girl" image in the wrong gender.

v1.6.3.3:

  - Fort paths are now dynamically computed instead of being static in the middle
  - Added path for indoor areas
  - Fix checkImageMetas to not be strict by default.
  - Fix infinite portal of potion shaping in alchemist shop

v1.6.3.2:

  - Jobs are now consistent in content creator and debug try content
  - Removed autocomplete in codejar.

v1.6.3.1:

  - New quest: Test of Sex (2 quest, 1 event, 1 mail)
  - Auto-place will now try to place close to center of the map
  - Buffed some perks
  - Make it easier to get harbinger of chaos perk instead of harbinger of crows
  - Fix lodgings missing "2 extra spaces".

v1.6.3.0:

  - Images for:
    - Chart the vale (descripption)
    - Raid elven forest (description)
  - Two new male lizardkin portraits
  - Rewrote raid elven forest description a little.

### v1.6.2.x

v1.6.2.20:

  - Content image now only 45% width.

v1.6.2.19:

  - Images for:
    - Carnal experience (female)
    - Unit training pet basic (male)
    - Unit training pet basic (female)
    - Unit training pet advanced (male)
    - Unit training pet advanced (female)
    - Unit training dominance advanced (male)
  - Content image credits page
  - Added content image count to statistics
  - Contributing guide updated for content images

v1.6.2.18:

  - Added support for showing images in quest or event outcomes
  - Added images (both male and female variants) for Gift Exchange critical outcome
  - 9 new unit portraits from MyTh1C
  - Fixed changelog links.
  - Guide for adding images to event/quests

v1.6.2.17:

  - New quest: The slave merchant
  - Alternate images for lodging rooms, dungeons cell, and inn room
  - Fix inn missing adjacency in market.

v1.6.2.16:

  - Images for many training chamber related rooms.
  - Surgery and biolab images.
  - Images for outdoor basic tiles

v1.6.2.15:

  - Return fort grid multiplier back from 1.25 to 1.2
  - Training buildings door location adjustments.
  - Images for temple + subbuilding
  - Images for all rec wings buildings + subbuildings (except fuckholes, kennel, gym)
  - Images for ritual chamber + subbuildings.

v1.6.2.14:

  - Images for all healing and treatment buildings.

v1.6.2.13:

  - Added used tilesets into the repo.
  - Add message when getting opportunity without having a mail room.
  - Room images for:
    - Great hall
    - Veteran hall
    - Hiring-related rooms
    - Armory, armory storage.
    - Warehouse
    - Market-related rooms
    - Training fields
    - Training grounds
    - All decoration-related rooms
  - Fix wall-less room not showing walls for top room.

v1.6.2.12:

  - Images for all office rooms.
  - Images for all office and misc rooms.

v1.6.2.11:

  - Scouting building images
  - Landscaping office size changed from 2x3 to 3x2.

v1.6.2.10:

  - Scout building images
  - Fix for entrance on nowalls buildings.
  - Added whip image.
  - Minor expansion price adjustments.

v1.6.2.9:

  - Fix room auto-place duplicating upgrade rooms.

v1.6.2.8:

  - Can Auto-place rooms now.
  - Tileset readme.

v1.6.2.7:

  - Fixed building images.
  - Fix broken room artist credits.

v1.6.2.6:

  - Tileset credits.
  - Images for all accomodation buildings.

v1.6.2.5:

  - Fix wall interaction with passables.
  - Fix passable buildings + wall again.
  - Slaver rooms now have consistent red bed colors.

v1.6.2.4:

  - Fort interior floor and walls.
  - Dungeons, dungeons cell, slaver rooms, lodgings images.

v1.6.2.3:

  - Tileset credits file
  - Room images pixel.

v1.6.2.2:

  - Fort expansion / moving cost rebalance.

v1.6.2.1:

  - New quest: test of social.
  - Fix "a a"
  - Fix backwards compat with disconnected empty spaces

v1.6.2.0:

  - New event: Ex-Reserved (FCdev)
  - Fixed farm giving wrong skill bonus/penalty
  - Remove background from interactive sex cards. Closes #294
  - Standardize training room sizes to 3x3.

### v1.6.1.x

v1.6.1.6:

  - Fixed broken links in content.md
  - Clicking the room after building on confirm build not undoes it
  - Passage info in sugarcube

v1.6.1.5:

  - New quest: Test of Survival
  - New images for all accomodation buildings
  - Implements backwards compatibility when some of the room changes size
  - Changed full changelog "here" url to absolute url.
  - Fix road not calculated in expansion costs. Closes #291
  - [contributor wanted] message in database room

v1.6.1.4:

  - Room artwork contribution texts.
  - Show unbuild room count in menus

v1.6.1.3:

  - Room images FAQ.
  - Statistics

v1.6.1.2:

  - Fort Restoration Awards quest chain (3 events, 3 mails)

v1.6.1.1:

  - Fix half werewolf broken when you lack mail room.
  - Fix black tiles when all slots are occupied from top to bottom in a column
  - Fix portal duplicate "distant"

v1.6.1.0:

  SAVE FROM v1.6.0.7 OR LOWER IS NOT COMPATIBLE WITH v1.6.1.0 OR HIGHER.
  However, the game will try to load it as a New Game Plus. It may succeed, in which
  case you can "continue" your old save.

  - New feature: Fort map
    - Your fort has a 2D map now!
    - You can place your buildings on the map, eg your office, your room
    - Rooms have adjacency / near bonus once you build the landscaping office
      - Pathing matters for this, e.g., if you block the path between the entrances it will cause them to not be nearby
    - Room images are moddable using the same structure as unit images
    - You can do all sort of things to the rooms: rotate, move around, zoom, ...
    - Fort improvement is completely removed and replaced with map expansion
    - Comes with a brand new tutorial
    - Includes a slew of new buildings like garden, yard, and even portals
  - Converted improvement constructor to objects.
  - Seniority threshold reduced to 4 years from 5 years.
  - Incompatible game versions will now try to load backwards compatibility.

### v1.6.0.x

v1.6.0.7:

  - Fix tooltip misaligned on various places

v1.6.0.6:

  - Added ire quest tag and manually marked quests that obviously give ire with the tag

v1.6.0.5:

  - Pressing space when you have mail to end week will now go to mail room
  - PenisHoleDomSlapAss more text.
  - Goblin rescue and eternal youth text fixes.
  - Flag games that have been tampered with debug mode for aiding debugging efforts

v1.6.0.4:

  - New quest: Test of Intrigue.
  - item/equipment texts now colorized based on rarity
  - Some new angel names
  - Fix missing living when retiring units

v1.6.0.3:

  - New event: Rioter for sale (FCdev)
  - Fix learn perk from unit detail menu causing error afterwards.
  - Fix relations office in favor tooltip not formatted correctly

v1.6.0.2:

  - Fix filtering in new game plus cause the entire process to restart.
  - Fix bug with change banned tags reverting to previous day

v1.6.0.1:

  - Choosing new pc in new game plus now allows choosing 3 slavers to retire with now, instead of 2
  - Werewolf hunt story writing fixes (thanks to J1009).

v1.6.0.0:

  - Readmes, summaries, and stats updated for v1.6
  - Better debug mode toggle in Settings
  - Faster TEST EVERYTHING by re-using units
  - Fix "the the" in "Werewolf Hunt"
  - Fix finding fairy missing passage
  - Fix missing scout reference in Werewolf Hunt

### v1.5.9.x

v1.5.9.26:

  - New quest: Werewolf Hunt (J1009)
  - Finding fairy finale no longer has failure/disaster, to prevent soft-locking

v1.5.9.25:

  - New perk: Unstable bodyshifter. Learnable automatically to bodyshifters.
  - Fix shepherd of men dark magic user reference

v1.5.9.24:

  - Add (Bless) and (Curse) to debug edit

v1.5.9.23:

  - Harbinger of crows skill bonus buffed from 7% to 8%.
  - Buff corrupted and traumatized perk from 50% negation to 75% negation
  - Fix missing text in curse of weakness (8 stacks)

v1.5.9.22:

  - Fix Slave Order High Demon Society posession option not working.

v1.5.9.21:

  - Increase EXP required to level up from level 1 to 40 by 10%.

v1.5.9.20:

  - Number of slavers and slaves you can bring increased from 2 to 3, but choosing to restart char reduce it by 1
  - Fix some wordings in starting new game plus

v1.5.9.19:

  - New quest: Wishing Well
  - Added Blessing of Virginity and Curse of Agape
  - Add FirstName and Surname changer in content creator
  - Separate debug statistics from debug start and added passages/word count
  - New portraits.
  - Notes on discord seven days wait for contributors added to readme.

v1.5.9.18:

  - Fix qc.Blessing error when final trait is null.

v1.5.9.17:

  - New portrait.
  - Fix empty credits for custom image causing image picker to break

v1.5.9.16:

  - New event: Innocent Tourist (FCdev)
  - New event: Used thug for sale (FCdev)
  - Fix slavercard/slavecard/unemployecard min weight causing issues in CC

v1.5.9.15:

  - Improved and modernized prologue and landing page
  - Fix flesh shaping for dummies and Test subjects wanted quests missing the veteran hall requirement

v1.5.9.14:

  - Can replace equipment on unit from equip menu.
  - Quest card UI rewritten
  - Opportunity card UI rewritten
  - Unit card UI rewritten
  - Equipment sets now display 3 icons instead of 2 at max
  - Can change equipmentset from unit menu now
  - Fix equipment set unit not shown when they are on a quest
  - Fix incorrect maid reference in Used Housekeeper for Sale event

v1.5.9.13:

  - Equipment, items, and furniture now have rarity indicator like traits
  - Unify icon css classes across all icons

v1.5.9.12:

  - New event: Used Maid for Sale (FCdev)
  - New event: Used Housekeeper for Sale (FCdev)
  - New event: Used Angelic Slave for Sale (FCdev)
  - New event: Debtor for Sale (FCdev)
  - New living: Author
  - Market objects now show where they originated from
  - Paid slave/slaver gained now show their price in notification
  - Units record their origin quest/event now in their histories
  - Added Title Wiki to in-game database
  - Fix unit history clipping over unit image in unit description

v1.5.9.11:

  - New event: Attractive Slaver (FCdev)
  - Object keys now shown in cards when debug mode is active
  - Documentations updated in preparation for v1.6, as well as moving references to the in-game DB.

v1.5.9.10:

  - Ex Leader (2 event, 1 mail).
  - Pimp critical multiplier upped from 1.25 to 1.5
  - A new portrait.
  - Fix backwards compat on importing unassigned duties

v1.5.9.9:

  - Fix retiring with a retired slaver causing the slaver not to show up

v1.5.9.8:

  - Potentially allow -> just allow in retire help text
  - Fixed wrong help text for retire continue.
  - Fix some visual bugs in retire screen.

v1.5.9.7:

  - New event: Retirement
  - New event: Slavecoming
  - New living: electrician.
  - New Feature: New Game Plus
    - Once you build the veteran hall, you too can retire from being the leader of the company
    - Accessible at the bottom of the `Company` menu.
    - You can bring along at most 2 slavers and 2 slaves
    - You an either start with a new company but with the same player character, or create a brand new one
    - Comes shipped with a fully fleshed epilogue for your former company
  - Fix init state order.
  - Fix fleshshaping breasts able to grow breasts on male units

v1.5.9.6:

  - Nerf pimp profit from 45/prestige to 40/prestige
  - Fix de-leveling building not refunding upgrade slot.

v1.5.9.5:

  - Updated old pimp references to new pimps in some quests (Bugfix)
  - Milk cow and cum cow prestige lowered by 1 each for consistency.

v1.5.9.4:

  - Pimp duties now have their own icons.
  - Fix recreation wing not de-leveled to level 1 for backwards compatibility.

v1.5.9.3:

  - Some new portraits
  - Replaced pimp duty with 5 different pimps, to rebalance the duty
  - 4 new buildings

v1.5.9.2:

  - New quest: Test of Combat
  - Move equipment texts in the twine files to their respective objects.
  - Party has "eligible for auto assign" toggle. Closes #280.
  - Remove overflow: hidden for most cards
  - UI is rewritten for all the following cards:
    - Duty
    - Building
    - Contact
    - Company
    - Item
    - Equipment
    - Lore
    - Market object
    - Party
    - Sex Action
    - Slave order
    - Team
    - Unit action
    - Perk
    - Trait
  - Fix Loving Lover furniture issue and letter of challenge actor issue

v1.5.9.1:

  - A Letter of Challenge quest/event
  - Some new portraits.
  - Lost blessing added to notification when gaining a new one.

v1.5.9.0:

  - New event: Defying Odds.
  - New event: Paradoxical Slaver
  - Fix disaster dominanc/horny training granting extra trait instead of removing existing ones

### v1.5.8.x

v1.5.8.9:

  - Fixed MoneyCustom bugged if its used non non content template
  - Errors now contain more information and expanded by default. Closes #279
  - Error no longer wrapped in pre tag.

v1.5.8.8:

  - Merge request conflict update

v1.5.8.7:

  - Harbinger of Crows quest chain (5 quests, 1 mail, 6 events, 2 perks)
  - Curse of weakness and madness now multiplies the duration by 4x instead of 2x.
  - Fix furniture icon not colored in item list.

v1.5.8.6:

  - Unit selection menu in various places overhauled to use the same UI with salver/slave menus
  - Can change portrait / nickname on retired slavers

v1.5.8.5:

  - Unit seniority resets when converted between jobs. Fix #277
  - Fix change portrait not working.
  - Battery lease disaster now inflict masochism too.

v1.5.8.4:

  - Standardize slaver recruitment cost.

v1.5.8.3:

  - Fix auto-money reward not scaling based on number of slavers on the quest
  - Fix retired slaver in yourrep referred to as slaver.

v1.5.8.2:

  - Event cooldown and quest expiration is now a setup constant.
  - Potion of skill boost: 20k -> 25k. Skill boost value: 12.5k -> 15k

v1.5.8.1:

  - Menu position adjustments.
  - Fix furniture missing its value.
  - Fix guest rooms missing from veteran hall requirements.
  - Fix stray p tag in Vagabond living.
  - Fix missing "is" in out of retirement.
  - Minor grammar fix.

v1.5.8.0:

  - 10 new events: retired events
  - New quest: Out of Retirement
  - New Feature: Slaver Retirements (#273)
    - Instead of dismissing slavers, you can retire sufficiently senior slavers instead
    - You will keep contacts with senior slavers, and you can even hire them at a later date if you change your mind
    - New building: Guest rooms, to unlock this
      - Upgradable: increase the number of retired slavers you can maintain contact with
    - Retired slaver will take up a new occupation
      - Feature shipped with 47 different occupations
      - Can be tested in debug mode
      - Also added to the in-game database
    - New unit job: retired slaver
    - Retired slavers can even participate in quests and events!
  - New Feature: Permanent Skill Boosts
    - Units can gain some permanent skill boosts in their career now
    - These have severe limitations, and in practice you could never get more than 5 stats this way
    - These stats are added to unit's base stats, meaning they will be multiplied by multipliers
    - Shipped with ten new potions.
  - New unit interaction and roster UI
  - Rewrote unit details and roster actions to Javascript
  - Rewrote item and furniture initialization code
  - Unit's duration with company can be edited in debug-mode

v1.5.7.2:

  - Fix stuck in bedchamber/furniture edit menu when double clicking edit
  - Fix auto assign furniture crashing when missing a furniture of any slot
  - Fix unit quick list sort crashing

v1.5.7.1:

  - Test of combat/knowledge rarity upped to legendary.
  - Test of knowledge/combat requirement to generate decreased from 150 skill to 100
  - Fixed error when sorting units in quest based on crit/failure/success chances.
  - Fix equipment auto assign menu clipping in edit equipment set.

v1.5.7.0:

  - Special perk and standard perk now has its own limits (2 each).
  - Potion of reset perk price increased to 10000 from 5000.
  - Added help texts for unit quest assignments
  - Player character now starts at level 1 instead of level 3

### v1.5.6.x

v1.5.6.9:

  - New events: Curse Bestowed and Elvish Hex.
  - Unit also learn the perk when gaining a perk choice now.
  - Ex-slave becoming a slaver now gain the "Ex-Slave" title.
  - Moved curse ire events to the correct folder.

v1.5.6.8:

  - Cursed documentation in content creator.
  - Hotfix for error caused by Go Fish event missing a comma.

v1.5.6.7:

  - New feature: Curses.
    - This is the opposite of blessings.
    - A cursed unit may receive more injuries, corruption, or trauma than usual.
    - Shipped with five different types of curses:
      - Curse of weakness (amplify injuries)
      - Curse of madness (amplify trauma)
      - Curse of vice (amplify corruption)
      - Curse of demise (deduct money when they leave your company)
      - Curse of crow (turn critical success into regular success)
    - Content creator support
    - Modifies some existing content to give out curses
  - New quest: Test of Knowledge
  - New event: Asspussy (FCdev)
  - New Portraits.
  - Fix Broken soul wizard needing basic magic not both basic or master
  - Fix blacksmith order typo.
  - Fix error when dismissing a slaver that owns a bedchamber

v1.5.6.6:

  - Undo redo now works in content editor, and also added to toolbar.

v1.5.6.5:

  - New quest: Alchemist Orders (2 quests, 3 mail)
  - Opportunity options refactor into object
  - Add visibility requirements to opportunity options (not used yet, due to making autoAnswer sometimes not working)
  - Fix missing <p> tag in standard punishmetn event.

v1.5.6.4:

  - Slaver hard cap decreased from 34 to 30 for a nicer number.
  - Remove obsolete weekend files.
  - Fix some desert snakes typos.

v1.5.6.3:

  - Fix game never autosaving when autosave interval is set to 1.

v1.5.6.2:

  - New event: Fallen Knight
  - End week processing is now much faster, overall 3x faster than before.
  - Refactored DOM.Card into DOM.Card and DOM.Menu
  - Auto-save is now asynchronous
  - Auto-save can now be set to save every X weeks (default 5 weeks)
  - Weekend code converted to JS

v1.5.6.1:

  - Furniture icons now follow the skill colors, like equipments
  - Blessing of luck text updated.
  - Fix wrong actor mentioned in stand with the lizardkins.
  - Fix doppelganger show event not proccing when you made them your slaver.
  - Phallus home dom variation.

v1.5.6.0:

  - Equipment set converted to JS
  - Bedchamber converted to JS
  - Equipment set and bedchamber edit UI is fully rewritten
  - Can auto-furnish bedchamber
  - Can sort / filter by skill in furniture/equipment menu
  - Item and equipment has a functional default sort now
  - Equipment set now shows its unit restrictions
  - Fix brave sword description missing its text
  - Fix cape aid bonus incorrectly set to 1.0 instead of 0.01

### v1.5.5.x

v1.5.5.8:

  - Doppelganger show event.
  - Sex Peddler now has a unit
  - Update FAQ about new features.
  - Some new portraits.
  - Fix stray asterisk in an orc name.

v1.5.5.7:

  - Doppelganger quest chain (4 quests, 3 mails, 7 events)
  - Company is refactor each into its own file
  - Peddler contacts are nerfed, and their buildings are merged from 5 into 2.
  - Peddler now sells item/equipment/furniture at markup instead (favor ones are unchanged)
  - Active title help texts and extra titles now shown in unit card.
  - Fix perk help texts.
  - Ambivalent sleeping fix.
  - Fix consensual topping missing pronoun
  - Minor grammar fixes in Grand Lunacy (thanks to Elannil)
  - Fix contact + favor limbo by nerfing contacts. Closes #265.

v1.5.5.6:

  - Fix typo in select unit macro toolbar.
  - Text and bugfixes.

v1.5.5.5:

  - Gain/lose contact added to CC.
  - Fix missing dot in unit description.
  - Fix basic perks duplicated on PC.
  - Hide perk descriptor in unit desc for non-slavers.
  - Perk special excluded from PC default ones.

v1.5.5.4:

  - Contact filters.

v1.5.5.3:

  - Contact have tags now
  - Contact NPC added to content creator.

v1.5.5.2:

  - Contacts can have an actual unit now
  - Blacksmith, tailor, weaver, and lumberjack contacts have a unit now
  - Updated Romeo and Slave and Bondage Cage events to use the contact units
  - CC: ItemIfNew.
  - Fix through and master requirement being odd.
  - Fix through text in debug mode.
  - Fix undefined in file names in non quest CC.
  - Fix slavebed "unobtainable" incorrectly placed.

v1.5.5.1:

  - New quest: Test of Combat
  - Added lorebook, which unlocks lore entries
  - Added lorebook for doppelganger
  - Added some real book quotes to some lores
  - Added new lore entry for doppelganger
  - Max quest difficulty increased to level 100
  - Fix changelog summary.

v1.5.5.0:

  - Can auto-Assign perks.
  - PerkChoice and HasPerkChoice added to CC.
  - SkillAtLeast added to CC.

### v1.5.4.x

v1.5.4.11:

  - Perk reset potion does not require treatment now, and can be used directly
  - Removed technology and building requirements for perk reset
  - Perk in unit description.
  - Make all skill appear twice in null perks

v1.5.4.10:

  - Perk adjustments
  - PC can access all perks now

v1.5.4.9:

  - New Feature: Perks
    - You can teach slavers special perk traits at level 20 and 40
    - Which perks available to which slaver is unique, but the basic skill perk is always available
    - Come shipped with 30 different perks
    - Can be reset via potion, but currently unobtainable
    - New associated building, new treatment, new item
  - Perk, trauma, and blessing traits are hidden by default in trait selector to reduce clutter
  - Fixed "them" in new quest.
  - Fix duty specialist not costing money.

v1.5.4.8:

  - New quest chain: Southern Isle Pit Fights (4 quests).
  - Fix OneRandom not inheriting its parent cost restrictions.
  - Fix slave price in market being lower than intended.
  - Fix personalities for default starting scenarios.
  - Fix midwork confessions incorrectly placed if.
  - Fix marketer slave order notification bug.

v1.5.4.7:

  - New event: Doctor molestation (moved from random blurb in hospital)
  - Marketing office and marketer office has their help texts swapped now.
  - MissingUnitForever now informs you about it.
  - And added [DEBUG] to title bar when playing with debug mode active
  - Outcasts of dragon now have their recruit bg reset to unemployed.
  - Fix changelog.
  - Fix typos in good slaver bad salver.
  - Fix doctor double mention in hospital
  - Text fixes.

v1.5.4.6:

  - New event: Rivals
  - New event and opportunity: Good Slaver Bad Slaver

v1.5.4.5:

  - Fix serial bodyswapper third option not working.
  - Raid factory for male now only give titanic balls, not both balls and dick
  - Cum variation for dom eat cum.
  - Fix enlightenment of the soul using slave to impregnate, not slavers
  - Various textfixes.

v1.5.4.4:

  - spacebar shortcuts for various menus.

v1.5.4.3:

  - Quest outcome chances are now cached at the end of the first week, which indirectly buffs boons.

v1.5.4.2:

  - Rewrote manual quest assignment to JavaScript.
  - MoneyAtMost restriction

v1.5.4.1:

  - In Debt event chain (3 events)
  - Fix corrupted computed trait reducing demon values.
  - Fix blessing in changelog.

v1.5.4.0:

  - Totally pirates quest.
  - More variations for anal preference texts during sex.
  - Removed one of the male fairy images.
  - Demon dick now has 0 value instead of -1000.
  - Demon tail penalty: arcane -> sex.
  - Added trait-based conditionals for a huge amount of quests in the game.
  - More portraits.
  - Fix missing url for AyyaSap mercy.

### v1.5.3.x

v1.5.3.7:

  - Add "if any role has trait" to CC.
  - Impossible order (free slave order) now has 3 weeks deadline instead of 2.
  - Added more vignettes to city quests.
  - Fix bg_inventor to bg_engineer.

v1.5.3.6:

  - New quest: Impossible Orders.
  - Added vignettes to some city quests.
  - Quest level / difficulty added to sidebar quests.
  - Noble games now always give the good bed instead of a random furniture.

v1.5.3.5:

  - Open for visitors event.
  - Cancel quest added to team menu.
  - Quests in right sidebar.
  - Slave order added to right sidebar.

v1.5.3.4:

  - Added bosmer names to elves.
  - Added missing sources for arabic names.
  - Some new demonkin names
  - Demonkin female name fixes.
  - Fix prestige slave duty instance storing prestige in the setup obj.
  - Fix prestige text.

v1.5.3.3:

  - Mystic now increases boon duration instead of reducing injuries.

v1.5.3.2:

  - Fix brothel manager duty name.

v1.5.3.1:

  - Fix duty database not working.

v1.5.3.0:

  - Rewrote duties into DutyTemplate and DutyInstance
  - New duty: Leader
  - Remove is_destructible from buildings.
  - Remove max_copies from buildings.
  - Contact initialization rewritten to passage tag.
  - Apothecary renamed to market properly.
  - Removed deprecated quests and unit actions
  - Job moved to JS
  - Deprecate cost helper.
  - Remove prestige requirements from scout harbor/outpost.
  - Vmuscle -> muscle bugfix.
  - Removed obsolete todos.

### v1.5.2.x

v1.5.2.14:

  - Brothel random events:
    - Magic Gravity Room event (FCdev)
    - Magic Bondage Room event (FCdev)
  - Fix some mistake in go fish quest.
  - More vignettes for some vale/city quests.
  - Speicalist upkeep increased from 800 to 900 per week.

v1.5.2.13:

  - Go Fish quest.
  - Fix wrong unit referred to in milk oasis text.
  - Fix duty slaves leveling up by drill sgt.

v1.5.2.12:

  - Implement specialist feature:
    - Unlock by building the Specialist Office building
    - On duty units can now remain at their duties by hiring specialists in their absence
    - These specialists need to be paid weekly
  - Remove 'order' tag from snowclaw challenge since it's hidden.
  - Added selectUnit to docs.
  - Add blessing traits to docs.

v1.5.2.11:

  - Fix snowclaw challenge quest rarity from never to common.
  - Opposting -> opposing.

v1.5.2.10:

  - Snowclaw Challenge quest by AwooWolfWoof.
  - Pastebin -> Ghostbin again.

v1.5.2.9:

  - Buff blessing of injury mitigation duratino from 6 to 8 weeks.
  - Fix debug quest/opp/event lumping the generator actors in the outcome

v1.5.2.8:

  - Missing units now require multiple stacks of Blessing of Life to save.
  - Lore text fixes (thanks to Elannil)
  - Fix Alberich's quest referring to PC not with name but with "you".
  - Various text fixes.

v1.5.2.7:

  - Pilgrim Visit event.
  - Blessing of Life implemented: prevent slaver from going missing
  - Blessing of Luck implemented: may prevent disaster quest result.

v1.5.2.6:

  - Blessing of Protection quests and opportunity (1 mail 2 quests)
  - Added various vignettes to many vale quests.
  - Some vignettes for various forest quests.

v1.5.2.5:

  - Buff protection blessing from 5 to 6 weeks of injury prevention
  - Blessing in unit description.
  - Rename blessings, and add their corresponding potions.

v1.5.2.4:

  - New feature: Blessing traits that can prevent injuries, trauma, and corruptions.
  - Grand lunacy fixes.
  - Fix missing quest tags on 30+ content.

v1.5.2.3:

  - Lovers now combines the effects of both rivalry and friendship, instead of being a super friendship.

v1.5.2.2:

  - Sea Escort quest in the sea
  - Trait, building, item, equipment can now be chosen in content creator toolbar.
  - Fairy is now spawn-able in all unit groups with a tiny chance, not just in forests.
  - Reduce dragonkin apperance chance in random sea encounters.

v1.5.2.1:

  - AI will now calm down appropriately when they cannot orgasm due to chastity / slave rule.
  - Calm Down Sex Interaction variations.
  - Chastity will give discomfort during sex now when aroused.
  - Text variations for rest sex action.
  - Fix missing space in "softskin".
  - Minor typo fixes (thanks to Kyrozis)
  - Text fixes.

v1.5.2.0:

  - V1.5.2 changelog.

### v1.5.1.x

v1.5.1.17:

  - Meek Slaver event
  - Add various stripping texts to CC.
  - Farmer Harvest event now can also gives the Enchanted Cucumber.
  - Customer -> customers

v1.5.1.16:

  - Refactored quest, event, opportunity folders
  - Most quest chains should now chain one into another much easier with their rarities moved from common to always
  - CYOA quest triggers rewritten to events
  - Upgrade logic of tower of roses quest/opportunity to modern version
  - Remove sluttiness from boxer equipments.
  - "Occassionally" typo fixes

v1.5.1.15:

  - Fixed author credits.
  - Update play_with_the_slave.twee - If else at the "warm cum" part was unnecessary (thanks to Kyrozis)

v1.5.1.14:

  - Living God duty/interaction/event/quest/opportunity,
  - Mind mend now has proper text quest, by Milk Maid Sona.
  - Fix inconsistent nipple clamp sluttines.
  - Implemented homecompany.
  - Few new portraits.
  - Various Text fixes.
  - Free Cities license is now mentioned in the credits.

v1.5.1.13:

  - Mist Vacation event/quest.
  - Apprentice is also allowed to go on magical candlestick event now.
  - Some interaction text fix by Kyrozis
  - Text fixes as well as armory auto-equip bug fix.

v1.5.1.12:

  - Implemented Titfuck sex interaction, as well as two associated sex manuals
  - More variations for some existing sex interactions
  - Added ucleavage to CC
  - Fix mouth tag missing in some spitroast sex actions
  - Various grammar bugfixes.
  - Text fixes.
  - Fixed wrong unit referred to in Fruit of Sluttiness.

v1.5.1.11:

  - DnD quest chain (5 quests, 3 mails, 3 events)
  - (Level up) from debug menu.

v1.5.1.10:

  - New event: under new Management: Quality Time (Kyrozis)
  - Update images.md
  - Fixed favor requirements not displayed correctly.
  - Fix sort name filter on units, and some other text fixes.
  - Amongst -> among, and other grammar fixes.

v1.5.1.9:

  - Unit images now pick from all available images.

v1.5.1.8:

  - Fix unit group similarity not checked correctly.
  - Fix subrace pools incorrectly copies over

v1.5.1.7:

  - New sex pose: Upside-Down
  - Furniture bedchamber text refactor.
  - Fetters with Pulleys event.
  - Bondage Cage event
  - Homeland text added to CC.

v1.5.1.6:

  - Fix Typos in domestic matter.
  - Various event fixes.
  - Added Heal trauma to debug menu.
  - Aspect of Wisdom clarified.
  - Fix equipment set being unequipped when changing pants.
  - Fix vagina/anus tightening missing on slavers.

v1.5.1.5:

  - Veteran Slaver event.
  - Lore selector in CC looks slightly better now.
  - Manual Labor event extended a little.
  - Brothel training typos.

v1.5.1.4:

  - Added List of Traits to in-game Database.
  - Surgery, slaver corruption, and targeted purification now require master magic.
  - Magic traits now also affect other skill a little.
  - Fix typos and missing tags on some quests.
  - Fix wrong pronoun on leave, and plant of lewdity being done-able by MC.

v1.5.1.3:

  - Magic lore expanded a little.
  - Race lore expanded greatly.
  - Trading Mission: Neko Port City (mynameis123).

v1.5.1.2:

  - Database includes building, company, equipment, item, lore, sex action now

v1.5.1.1:

  - Rarity / pool of quest/opp now shown in CC.
  - Fix party reset with game update.

v1.5.1.0:

  - Fix story container overflowing in CC with both sidebars on.

### v1.5.0.x

v1.5.0.9:

  - Wandering nomad event
  - Cleaning Punishment event (FCdev)
  - Manual labor event
  - Tower of roses typo fix.

v1.5.0.8:

  - Can mass-use items now.
  - Prestige slave now update their prestige values at end of each week.

v1.5.0.7:

  - Lunatic slaver event chain (2 events, 1 quest)
  - Fix tutelage typo.
  - Fix sparring event comparing intrigue instead of combat

v1.5.0.6:

  - Add (test) link to (Database).

v1.5.0.5:

  - Fix raider instinct awarding wrong favor.
  - Fix brothel quests being tagged with angel.

v1.5.0.4:

  - Add "(Database)" to main menu, where you can see existing quests/events/mails.
  - Refactor quest/event/template common fields into one.
  - Text fixes for IreAtLeast and training text.
  - Added extremely thin/strong preferences to human sea.

v1.5.0.3:

  - Can filter unit by traits arbitrarily.
  - Documentation for adding race.
  - Various typo / text mistake fixes.
  - Lover gender pairings are more fine-grained now.

v1.5.0.2:

  - Fix their -> them typo in huge_tits.
  - Boonize random help text in CC.
  - Fix multi action muscle/anus not working properly.

v1.5.0.1:

  - Fix shadow wrapper not working correctly with <<choose>>

v1.5.0.0:

  - Recruitment all description is rewritten
  - More team adjectives
  - Team name is now: "Team xx" name.
  - Fix broken ascent human having wings as innate traits.
  - Fix "typo" in werewolf camp raid.

### v1.4.9.x

v1.4.9.21:

  - Future Sight no longer give quests on outside regions before you build their scout buildings.
  - Future Sight is rarer and unique now

v1.4.9.20:

  - Choose macro now show notification results at the end of choosing an option.
  - Special cake event.
  - Fix farmer harvest not giving money on success.

v1.4.9.19:

  - 4 new events.

v1.4.9.18:

  - 2 new events.
  - Traumatize/Boonize added to debug menu.

v1.4.9.17:

  - ExpUnit cost
  - Injury requirement can set duration now.
  - 7 more events.

v1.4.9.16:

  - Two more random events.
  - Masochist slaver missing sentence fix.

v1.4.9.15:

  - 7 new random events.

v1.4.9.14:

  - Enlightenment of the Soul (male version).

v1.4.9.13:

  - All sex locations now have furniture.
  - Initializations of equipmentslot and furnitureslot moved to JS
  - Dominant Slave event has minor effects now
  - Can have sex on the floor of bedchambers now.
  - Two more events by FCdev.
  - Fix on leave units can banter with each other.

v1.4.9.12:

  - Pastebin reference is back, but ask to put password in.

v1.4.9.11:

  - Dominant Slave 1 (Bigal) event.
  - Moved references of pastebin to ghostbin instead.
  - New images.
  - Bugfixes

v1.4.9.10:

  - Fix relations office needing veteran hall.

v1.4.9.9:

  - Four New FCdev events.
  - Bump deck retries from 50 to 200.

v1.4.9.8:

  - V1.5 writeup.
  - Put inspiration games in main README.
  - Vocal Disobedience (FCdev)
  - isCanPhysicallyXXX restrictions

v1.4.9.7:

  - Update documentation for v1.5.
  - Fix always trigger event error when not having any options.

v1.4.9.6:

  - Added information about image verification script to documentation.
  - Refactored raw banter text to a separate folder
  - Some new banter variations.
  - A new image.

v1.4.9.5:

  - Add generator quest/opportunity to unit info for future debugging.

v1.4.9.4:

  - Support for equipments that give advanced traits like personality / background / magic traits.
  - Flight is now a computed trait.
  - Growing wind quest.
  - Race values rebalance, and werewolf race adjustments.
  - Fix kidnap male specimen victim having vagina in text.

v1.4.9.3:

  - Flesh Shaping for dummies questline (4 quests).
  - Fix some more duplicated traits in role restrictions.
  - Unify missing unit text into a macro.
  - Fix decrease trait not appearing in notification.

v1.4.9.2:

  - Added ambience texts to interactive sex
  - Gretaly expanded "Do Nothing" interactive sex text, especially on mindbroken units.
  - Ambience text during sex, and expanded Do Nothing texts.
  - Added some variation to strapon and all fours interactive sex.
  - Brothel quest chain: Increase final brothel upgrade price to 100k
  - Added a short "new player guide".
  - Skill Focus is now lazily generated.
  - Fix duplicated role traits in 30+ places.
  - Fix weird sentence in resistant slave banter.

v1.4.9.1:

  - Fix unit description not twining skill desc properly.

v1.4.9.0:

  - Brothel quest chain completed (1 duty, 17 quests, 15 mails, 31 events, 1 interaction)
  - Fix filter throwing error when a filter menu name got changed.
  - Fix for CYOA questline throwing error when displaying gender.
  - New treatment: Alternate Timeline treatment.
  - Fix errors in opportunity debug menu.
  - Fix inconsistent darko and FCdev mention order.

### v1.4.8.x

v1.4.8.4:

  - NPC Brothel quest chain part 1 (main story: 1 duty, 13 quests, 11 mails, 22 events)
  - Serial bodyswapper now has 250 weeks cooldown.
  - Added dominant top / submissive bottom to FAQ.
  - Pronoun fixes on mouth-neck, sex scene start with lover, and ob training basic
  - Monetary reward is flattened a bit over difficulties. Marketer cap at 40 is written. Fix unit desc on afk onduty unit.

v1.4.8.3:

  - Fix Enlightenment of the Soul event sometimes not firing.

v1.4.8.2:

  - Criteria traits are now displayed sorted.
  - Sorted, added a few crit traits, removed a few disaster traits from roles in quests (thanks to RikuAotsuki)
  - Equipment rewrite to allow partial traits.
  - Maid outfit now give maid background with 3+ pieces equipped.

v1.4.8.1:

  - Domestic matter expiration bumped from 4 to 25.
  - All quest inclusion updated to new format
  - Fix Chart the Vale and Raid Werewolf Camp not being present in the game
  - Help text for the a|was syntax in content creator gain unit, history and title
  - Fixed some missing pronoun in Embrace interaction
  - Fixed Domestic Shoes being a legwear instead of footwear
  - Fixed incorrect "you" in Gift of the Magi quest

v1.4.8.0:

  - Seasonal cleaning quest chain extension (1 quest, 2 mails).
  - Fully deprecate some of the bonus sex texts that have been converted to events.
  - Magic trait is limited to 3 now, down from 4. Skills are unaffected, e.g., 3 magic 1 skill is ok.
  - Fix requirements being costs instead for some unit training buildings

### v1.4.7.x

v1.4.7.14:

  - Slaves in party are now restricted from going to quests that sells them.

v1.4.7.13:

  - Unit "weeks with you" is now persistent and no longer reset to 0 when the unit leave your company.

v1.4.7.12:

  - Permanent teams are removed. All teams are ad-hoc now.
  - Team names are randomly generated now
  - New feature: parties. Useful for organizing units and preventing them from being sold accidentally.
  - Remove duplicated names in all units
  - Fix typo in ValeContact.

v1.4.7.11:

  - Proofreadings completed.
  - Drill Sergeant now passively train other units. Closes #256.
  - Updated traits to be more logical and in line with the rebalance, and sorted them into their proper order. (thanks to RikuAotsuki)
  - Fix the slaver to "theslaver xxx"
  - Difficulty adjustments.

v1.4.7.10:

  - All events have been proofread.
  - More help texts for first person support in content creator.
  - Lunatic has a slave value now.
  - Werewolf unit frequency bumped slightly in the "all locations" category.
  - Fixed scary and hideous trait adjectives.
  - Fix Aspect of Experience slave order giving subrace as crit trait

v1.4.7.9:

  - All opportunities have been proofread
  - Neko Statue gender fix.
  - Fix qc.opportunity that does not use strings
  - Fix "was" to "a|was"
  - Put ucxxx syntaxes in documentations.
  - Pet Shopping code is untangled and rewritten
  - Serial bodyswapper code is untangled and rewritten

v1.4.7.8:

  - Adjusted vale human / werewolf ratio from 5:1 to almost 3:1
  - Fix Notification crash
  - Fix orcish bait text not matching its reward

v1.4.7.7:

  - Furging a new path event/mail chain (2m, 3e, 1 new equipment) (by Milk Maid Sona)
  - Opportunity is now consistent with event/quests in that it will finalize after the texts are rendered instead of before
  - Proofread/cleanup for contributor opportunities complete
  - All 380+ quests proofread and cleanup complete
  - Bedchamber without assigned units now show the duties in its description
  - Some new angel name variations
  - Added help text for defiant slaves
  - 8 new portraits
  - Fixed some spelling and grammar issues (thanks to AbleCharlie)
  - Fix mistakes in Submission cure quest
  - Fix typos in tower of roses.
  - Fix missing physical adjectives.
  - Fix the inconsistent traits in Crimson robber quest
  - Fix incorrect person referred to in dowry of roses.
  - Fix "clotheses" and missing body flavor text in unit description
  - Fixes for the proofread.s
  - Fixes for furging a new path.

v1.4.7.6:

  - Forest quests proofread
  - Escape quests proofread

v1.4.7.5:

  - Fix "Anal Virgin" to "Virgin" in "Sweet taste of virginity"
  - Fix setup.trait.job_slave in setup.qres.Job

v1.4.7.4:

  - Fort quests proofread
  - Forest quests proofread begins (first 10 done)
  - Added face_scary and face_hideous to multiple criterias.
  - Opportunity folder refactor-
  - Fix setParent setting parent's surname instead of child's surname
  - Fix eternal youth quest failure text.

v1.4.7.3:

  - Trait rebalance again to remove traits that affect the same skills, and making the skills match more with the trait

v1.4.7.2:

  - New event: Unnaturally thin waist (FCdev)
  - Proofreads: scouting, purification
  - Trait renames: face ugly / hideous -> face scary / frightening, muscle weak -> muscle thin.
  - Fix mastery of magic missing verb.
  - Fix ancient elven prison being generate-able without the sniffer.
  - Fix duplicated lore: location_lucgate -> region_city
  - Fix "humanexotic" to "humancity"

v1.4.7.1:

  - Fix `<<=`
  - Fix missing price to build dungeons / armory
  - Performance fixes on itch.io build
  - Comments warnings on image blob interaction with replace macro.
  - Unit training and treatment are proofread
  - All sea quest are proofread
  - All special quests proofread.
  - Text fixes (thanks to AbleCharlie)
  - Fix error when looking at unit history.
  - King of Dragons quest now repeatable, gives you favor with dragonkins.

v1.4.7.0:

  - Changelog fixes.
  - Lore faq.
  - Fix "yourrep good".
  - RemoveDuty cost and UnitGroupHasUnit in content creator

### v1.4.6.x

v1.4.6.8:

  - Vale quest proofreading complete.
  - Rebalanced trait effects to fix ugly/attractive overlapping with loner/gregarious
  - Can only change equipment in a set to ones that the equipper can still use.
  - Fix missing equipment set check in unit status page.
  - Standardized lodging, dungeon, armory standardized.
  - Adjust fort upgrade costs.
  - New restriction: "Equipped" restriction.

v1.4.6.7:

  - All contributor quests are proof-read.

v1.4.6.6:

  - Proofread quests: Alberich, anon, anonymouse21212, Atacama, Blueflame451
  - Implemented semaphore for disabling notification. More proofreads.

v1.4.6.5:

  - Repfull deprecated in favor of yourrep, theslaver, therace to support first person.
  - Disable going on caged tomato yourself due to text issues.
  - More variations for Grope balls.
  - Woodsman background is fixed and no longer the same with seaman.
  - Bugfix: image picker not refreshing and to be a knight crit.
  - Updated content creator guide with first person help.

v1.4.6.4:

  - Finished converting existing content (mostly) to support first-person context.
  - Swap success and disaster modifier weights on compute score critical max.
  - Demonkins now appear more often in the desert.
  - Fix opportunity not using include replace.

v1.4.6.3:

  - Desert quests first person
  - First person for unit description
  - Unit description to DOM
  - was/were fixes.
  - Faster test all
  - Update training.twee to fix some spelling and grammatical errors. (thanks to AbleCharlie)
  - Update river_spirit.twee (thanks to AbleCharlie)
  - Fix for macro replace in passages with include
  - IsMale IsFemale mistakes fixes
  - More was/were fixes.
  - Content creator text fixes.

v1.4.6.2:

  - <<rep>>'s to <<reps>>
  - Unify syntax for new first person rep and reps.

v1.4.6.1:

  - First person for city quests.
  - First person for content creator.
  - First person is true by default now.
  - Corruption and slaver training are now first person.

v1.4.6.0:

  - Unit trainings quests converted to first person
  - Milk Oasis quest converted to first person.
  - Support for first person present tense in content creator (see guide inside)
  - First Person mode (EXPERIMENTAL)
  - "Loving Lover" (FCdev)
  - Obedience training basic texts (FCdev).
  - "Like me" event (FCdev)
  - Fix traine -> trainee typo.
  - README update
  - Patreon mention fixes.
  - Fix CYOA error message, and opportunity error message.
  - You can no longer go on the fire beckons quest.
  - Cum competition texts.

### v1.4.5.x

v1.4.5.9:

  - The Plant of Lewdity quest chain (7 quests, 3 mail, 5 events)
  - Event folder refactoring.
  - Slaver hard cap bumped to 34 so lodging level is nicer (15 max)
  - Obedience training basic texts (FCdev).

v1.4.5.8:

  - "Cow Milking" by FCdev.
  - "Scrubbing" by FCdev.
  - Slave training master now require either magic wind master or magic earth master.
  - Basic and advanced slave trainings no longer give out traits on critical.
  - Texts for endurance training basic and advanced.
  - Frugal, Lavish, Sly trait icons updated.
  - TODOLIST docs updated.
  - Potion of mind mending hint clarified even further.
  - Increased potion markup from 3x to 5x.
  - Typo fixes on new texts.
  - The Fire Taketh no longer requires mindmend potion.
  - Lowered lodgings hard cap to 30 slavers from 50 slaver, due to it misleading players.
  - Lowered team cap from 11 to 6 thanks to the above.
  - New Portrait.
  - Fix incorrect muscle trait skill effects.

v1.4.5.7:

  - All trait effects rebalanced (adapted from acciabread version, see https://gitgud.io/darkofocdarko/fort-of-chains/-/issues/112)
  - Generous -> lavish, thrifty -> frugal renames.
  - Favor decay threshold adjusted to make it easier: 85 now from 75.
  - Recreation wing price adjustments (nerf).
  - Bugfix for cow_competition.twee and cum_cow_competition.twee (wrong location of <</if>>)
  - Swap tall/short in houndmastery to playful/serious.
  - Fix capture the protagonist has an extra paragraph on failure.

v1.4.5.6:

  - Grope breast variations.
  - Anal, masochist, and oral training texts (FCdev).

v1.4.5.5:

  - Fix missing space in "if you like it".
  - Slave order can be (ignore)d now.
  - Filters for team
  - Team to DOM
  - Notifications card to DOM.
  - Mail to DOM.
  - Title Card to DOM.
  - Trait and Skill to DOM.
  - 5 new portraits.

v1.4.5.4:

  - Romeo and Slave (FCdev)
  - Anal Cowgirl (FCdev)
  - Boobs Collision (FCdev)
  - Standard Punishment, If you like it (FCdev)
  - (Cum) cow competition (2 quests, FCdev)
  - Added mentions of tail in various places
  - Cold Dish is now banned if you ban `maleonly`

v1.4.5.3:

  - Regalixir quest chain (2 quests, 2 mails)
  - Bar Delights event (FCdev).
  - Midwork Confession event (FCdev)
  - "Bad Dreams" by FCdev
  - "Happy Dance" by FCdev.
  - Night Visit by FCdev.
  - Cage Relief by FCdev
  - Desperately Horny by FCdev.
  - Something to Say by FCdev.
  - Illegal Masturbation by FCdev.
  - "Cum retching" event (FCdev)
  - First person for notifications, and notifications now use new format
  - OnDuty restriction
  - XTraits requirement. Simplify trait restriction in CC. Restrained no longer remove flight.
  - Proper info why slave order cannot be fulfilled.
  - Height-shaping is removed from the game.
  - README updated.
  - FAQ updated.
  - Fix dragonkin mystic portraits unable to use its parents
  - Fix the gender of demon of choices from CYOA questline.

v1.4.5.2:

  - Trait renames: Deceitful -> sly. honest -> direct.
  - More adjectives for the rename.

v1.4.5.1:

  - Fix and nerf forbidden fruit orifice tigtening chance.
  - Deprecate rear helper costs.
  - Allow regenerating starting slavers, but nerf number of starting slavers choices to 10.

v1.4.5.0:

  - Ambivalent Sleeping (FCdev) event
  - <<ucum>> macro.

### v1.4.4.x

v1.4.4.16:

  - A bunch of new random events from FCdev:
    - Mindbroken morning event. (FCdev)
    - Buttonification for landing page.
    - Girlish Slave (FCdev)
    - Muscle Slave events (FCdev)
    - Wanting for a Talk - FCdev.
    - "Terrified Inspection" random event (FCdev)
    - "Huge Dicked Slave" event (FCdev)
  - Texts for slave training quests:
    - Oral training texts for basic and advanced (FCdev)
    - Anal advanced training texts (FCdev).
  - New master furniture: pole (with associated event).
  - Support for random events that have flavor decisions to be made.
  - In-game link to license
  - Increase event cooldown to 1000 weeks.
  - Auto-Save now only takes one slot.
  - FAQ updated for session storage problems.
    - Fix gained traits hidden on non-mindbroken units.
  - Normalize FCdev crediting.
  - Fix for sorting using price in slave orders
  - Innoxia credit updated due to how many new texts.

v1.4.4.15:

  - Consensual Topping random event.
  - Gym Sex random event.
  - AllowLovers restriction.
  - Lovers restriction more fine-grained now, allowing gay, lesbian, or same-sex only.
  - Lick balls variations and refactor.
  - Some more variations for blowjob sex interactions.

v1.4.4.14:

  - Grove Guardian Fill In quest for gaining favor with elves.
  - Rostershow and selectunit migrated to DOM.
  - Interaction Card to DOM.
  - Fix favor description numbers being incorrect.
  - Update list of fetishes

v1.4.4.13:

  - Bugfix for tigerkins always generated as female.
  - Separate sort/filter for slaver/slaves.
  - Images moved to DOM

v1.4.4.12:

  - River Spirit quest by Blueflame451.
  - Rival blackmail quest chain now requires veteran hall.
  - Fix the parent of branching timeline son on switching body.
  - Fix bedchamber mouth equipment wrong rep.

v1.4.4.11:

  - Rival blackmail quest chain (2 quests, 3 mails, 6 events)
  - Added QuestDirect cost
  - Replace throw "string" with throw new Error("string").
  - A new orc portrait.
  - Balance adjustments to Milking the Oasis quests
  - Fix <<per>> instead of <<rep>>
  - Fix $g.potter instead of $g.spotter.
  - Fix unable to recruit with negative money.

v1.4.4.10:

  - Fix Content Creator opportunity create from scratch having the wrong name and author
  - (4 quests) Treasure hunt, Bounty hunt: bandits by Blueflame451

v1.4.4.9:

  - Fix starting out as a fairy.

v1.4.4.8:

  - Code editor preview now works for partial results.
  - Fix some swapped female and male roman imperial names.

v1.4.4.7:

  - Company card to DOM
  - Market to DOM.
  - FilterAll now has graceful failure.
  - Fix many incorrect uses of IsHasTrait, IsHasTraitExact, and replace them with IsHasRemovableTrait
  - Fix missing company favor toggle
  - Fix setup.DOM.Util.help disappearing after first click
  - Fix infinite loop in be cleansed in fire when a unit has wings.

v1.4.4.6:

  - Fertility Rite quest by Blueflame451.
  - Fix removable traits not being checked properly.

v1.4.4.5:

  - Mist apprentice hint that it can be cancelled.
  - Removed mist apprentice strict slaver requirements.

v1.4.4.4:

  - Fix Raiding the Oasis passage name.
  - Added more gender-specific macros to dev tools.
  - Fix mentions of "normal mouth", "normal eyes", and "normal ears".

v1.4.4.3:

  - Milk Oasis quest chain (2 quest, 1 mail) by Milk Maid Sona
  - Refactored myadv and theiradv out in favor of a|eagerly in sex actions
  - Bodypart adjectives refactored and add more variations
  - Added TraitReplaceExisting

v1.4.4.2:

  - Authors can add URLs now, linking to either the source or their websites.
  - Crit no longer doubles EXP gained.
  - Skill focus clarified: a level up always give 6 skills.
  - Fix formattings for Oh What a Show quest.

v1.4.4.1:

  - Dowry of Roses quest.
  - Oh What a Show! quest by Da_Shem.
  - Fix doubled EXP when using qc.Outcomes

v1.4.4.0:

  - Challenge mode is now tagged as "difficulty", and is under (EXPERIMENTAL), and added warning to not turn it on.
  - New sex actions (feet licking, again from Lilith's Throne and Innoxia), unlocked with having 80 favor with the bank.

### v1.4.3.x

v1.4.3.10:

  - Credits updated.
  - Obedience Lesson quest chain (2 quests, 1 mail, 2 events)

v1.4.3.9:

  - More blowjob variations.
  - Banter card to DOM.
  - FAQ updated.

v1.4.3.8:

  - Mist apprenticeship quest chain (6 quests, 4 events, 1 mail)
  - School of Hard Knobs quest chain (2 quests, 1 mail) (by Da_Shem)
  - Content Creator:
    - Added loop in content creator. Now you can do things such as: gape all slaves, traumatize all slavers, etc
    - Approximate min, max, and median unit values for unit groups and unit pools are now shown.
    - New requirement: HomeOrOnLeave
  - Fix unit slaver bug in master the dark
  - Unsortedskills option (thanks to sssk)
  - Add parenthesis to skill mod (thanks to sssk)
  - Fix unit images resetting after F5.
  - Fix "xxx weeks left" for actors in quests that are not assigned to team yet.

v1.4.3.7:

 - Fix 'cooldown' instaed of 'cooldowns' in backwardscompat (thanks to gorbo1)

v1.4.3.6:

  - Duty sort options. Also fix dutycompact not using dom
  - Quest/Opportunity/Event cooldowns refactored and added to Content Creator

v1.4.3.5:

  - Sidebar adjustments on mobile devices
  - CYOA quest line and 7 sins quest lines now have cooldowns

v1.4.3.4:

  - Demonkins implemented
  - Can start game as a demonkin.
  - Ear pull sex action can now pull demon horns too.
  - New portraits (particularly demon)
  - Fix title bug taking % into account. Fix sidebars in mobile dipslays.

v1.4.3.3:

  - Tower of roses now regenerate the unit if you ignore the first quest
  - Hotfix for Broken Wings quest

v1.4.3.2:

  - Filters and sort for quick unit list.
  - Fix quick unit list sometimes went missing
  - Fix multiple filters causing their numbers to get gobbled together

v1.4.3.1:

  - Add a right sidebar for quick glance at your unit stats on large screens
  - Slave order are filterable, and made into DOM
  - Slave orders are shown in multi-training
  - Show skill additive factor in unit skills
  - Repository size cleanup
  - Fix skill focus wrong modifiers
  - Fix missing vaginal orgasm when being fucked.
  - Updated Subrace FAQ.

v1.4.3.0:

  - OLD SAVE NOT COMPATIBLE WITH THIS VERSION ONWARDS
  - Subrace is properly made into traits. Each unit now has a primary race and a subrace trait.
  - Fix memory leak in EmptyUnitGroup
  - Fairy magical preference switched to wind from earth. Lizardkin from light to water
  - Lores for the subraces.
  - Earth effect magic on FAQ.

### v1.4.2.x

v1.4.2.5:

  - Angel names.

v1.4.2.4:

  - Lizardkin subrace
  - Lizardkin settlement opportunity + 2 associated quests
  - New sex action: Nibble Neck. Unlock by having high favor with lizardkins
  - A bunch of new portraits for lizardkins and dragonkins
  - Lizardkin have unique names, lore, company, company ire events, company benefit
  - Lore entry for lizardkin.
  - Renamed wings_feathery to wings_angel
  - Dragonkin company events.
  - Restrict hot springs raid only if you have female slaver.
  - Rebalance race prices:
    - Elf price goes up from 2000 to 2500
    - Dragonkin from 20000 to 30000

v1.4.2.3:

  - Hot Spring Raid quest by Da_Shem
  - Fix for ritual ruanway agaain.
  - FAQ for session storage exceeded

v1.4.2.2:
  - Wavebreaker (1 quest, 1 event)
  - Finding Fairy quest chain (4 quests, 1 event, 1 opportunity)

v1.4.2.1:
 - Added Fairy subrace
 - UnitGroup refactored to reuse existing unit group when the pool distribution is the same.
 - New portraits
 - Updated FAQ with virginity tracker rejection
 - Fix roles for some events not being an array.
 - Fix double underscore in generated keys.

v1.4.2.0:

 - Defiant slaves banned from participating in most things
 - FondleChests merged to grope breast sex action.

### v1.4.1.x

v1.4.1.6:

 - LZString compression is back due to memory issues. Various fixes

v1.4.1.5:

 - Added angel subrace.
 - Broken wings quest chain (6 quests, 4 opportunities, 3 events)
 - Angel portraits and more.
 - getAnySlaver now takes forbidden slavers

v1.4.1.4:

 - Fix injured unit being deleted.

v1.4.1.3:

 - Add a cost in content creator that applies all costs of other outcomes of the same quest
 - Refactor 60+ quests to use the above feature.
 - Fix unit history not converted from a|their
 - Broken Wings quest chain 6/13.

v1.4.1.2:

 - Forbid bodyswapping that swap a slaver's gender.
 - Bodyswap documentations.

v1.4.1.1:

 - Bodyswap can swap genders again now.

v1.4.1.0:
 - New feature: slaves that have to be broken first before trained.
 - Defiant and Indomitable traits implemented.
 - Research Room + 1 new event.
 - Add defiant to questing knight and demon of choice.
 - Corruption Cycle quest.
 - Bargain with the devil quest.
 - Drug Regime quest.
 - Animal Trainer of the south quest and 2 events.
 - Public Penance quest.
 - Bodyswap Experiment is now rare.
 - Readme updated with fetish/feature list.
 - Updated FAQ
 - Chivalrous -> Chivalrious typo.
 - Vaginal sex comma fixed.
 - Fix kiss using the wrong texts.
 - Fix kiss actors being swapped in resist-kiss variations, and reduce redundancy.
 - Fix dick corruption thrown an error on girls.
 - Fix wanderer help search for themself.
 - Elf clarification for mindmend potion.

### v1.4.0.x

v1.4.0.10:

 - Lore Card converted to DOM.

v1.4.0.9:

 - Sex actions can be disabled in classroom now.
 - Lower favor requirement for unlocking sex manual from 100 to 80
 - Rewrite debug friendship to DOM and add lover support. Bugfix for bodyswap description.
 - Convert trait texts to new syntax.
 - Hide prestige until rec wing is build.
 - Lock interactions behind sex manuals as appropriate.
 - Unlawfull party title is now unique. It is also buffed. Also make the quest give out a rare furniture on repeat with the unit.
 - Add submissive sex penetrations to classroom.

v1.4.0.8:

 - Fix blowjob reaction on giving orals.
 - Variation text for hole-to-mouth orgasms

v1.4.0.7:

 - Slaver hard cap increased to 50 for nicer number.
 - Smooth out lodging prices.
 - Blowjob text variations.

v1.4.0.6:

 - Content guidelines updated.
 - CYOA for best ending limit increased to 3.
 - Hard cap slavers to 50, slaves to 90.
 - Reduce level caps for dungeons, lodgings, armory. Increase level cap for bedchamber wings.

v1.4.0.5:

 - Swap sixtynine and cunnilingus manual givers.
 - Library event that gives out sixty nine manual (all manuals are given out now)

v1.4.0.4:

 - Deck retries upped to 50.
 - Fix history of slave order high demon.
 - Add ability to edit slave and slaver relationships to debug (thanks to alarmedcat)
 - Tentacle spitroast sex action, sex manual, and event

v1.4.0.3:

 - Changelog renamed to changelog.txt from changelog.md for performance reason
 - High Demon Society quest that gives out facesit sex manual and blank technology.

v1.4.0.2:

 - FAQ for compiling problem
 - Updated instruction for quest creation.
 - Deprecated backwards compatibility with versions older than v1.3.0.0

v1.4.0.1:

 - Drop support for familial relationship due to legal reasons.

v1.4.0.0:

 - Use source mapping in webpack.
 - Statistics updated.
 - v1.4 documentation
 - Foc deployment updated now that we have 1003 images.
 - Add title to the obtainable tigerkin slave.
 - Tigerkin unitpool adjustments.
 - Rec wing price adjustments.
 - New portraits.

### v1.3.3.x

v1.3.3.17:

 - Gift from the were events. Statistics updated.
 - Nipple pinch manual from outlaws.
 - Slap ass sex action and fix height tolerance not calculated correctly in sex action.
 - Slap ass event.
 - Desertfolk and seafolk sex manual events.
 - Kiss breasts sex action and corresponding event.

v1.3.3.16:

 - Subrace documentation
 - Tigerkins added to debug, and referred as "tigerkins" in texts.
 - Tigerkin statue furnitures and associated sex action.
 - Houndmastery quest chain: 3 quests, 2 opportunities, 3 events

v1.3.3.15:

 - Half-werewolf quest chain extension and epilogue (2 quests, 2 events)
 - Updated documentation for programmers.
 - Unitpool code rewrite.
 - Tigerkins added as a subrace properly, to demonstrate how subracing works.
 - More portraits for werewolves and tigerkins.

v1.3.3.14:

 - Converts doggy-style orgasm from LT.
 - Fixes IsCanTalk and IsCanWalk.

v1.3.3.13:

 - Quest and event rarity now falls into one of few categories, instead of a number spectrum
 - Quest and event generation now deck-based, instead of completely random

v1.3.3.12:

 - Combined most sub and normal pace texts in PhallusHole, and special cowgirl texts.

v1.3.3.11:

 - Fix typo "choosen".
 - 100 favor even with elves to give out deep-throat manual.

v1.3.3.10:

 - New portraits
 - job_slave, job_slaver, job_unemployed are now traits
 - join_junior and join_senior are now applicable to slaves

v1.3.3.9:

 - Equipments converted to Javascript.

v1.3.3.8:

 - Fix bug with filterall not capturing varaibles properly.
 - Removed zero-width-spaces bug.

v1.3.3.7:

 - New portraits.
 - Vice-Leader now remains effective even when injured / on a quest.
 - Remove image containing a gun.
 - Remove save game compression to make loading faster.

v1.3.3.6:

 - FAQ updated with compilation instructions.
 - Common problems.
 - Moved filterall mass loading to DOM.
 - Trait filters and sorting.
 - Duty converted to JS.

v1.3.3.5:

 - Unit history use a
 - More things.
 - Hide unit actions that
 - Removed equipment requirement from pet/pony trainings.
 - Special quest type for unit actions.
 - Training basic engine is done.
 - Fleshshaping and Training on slaves.
 - Quest instance bugged.
 - SugarCube 2 now used custom-built one.
 - Readme for modified sugarcube 2.
 - Unit actions revamped.
 - Vice leader helps automate training.

v1.3.3.4:

 - Change to Position event/opportunity by Quiver.

v1.3.3.3:

 - Fix typos for acquaintance (thanks to alarmedcat)
 - EchoMessage and echoError didn't exist (thanks to alarmedcat)
 - Fix sex breaking under very rare trait combinations.

v1.3.3.2:

 - More typo fixes.
 - Changelog disclaimer.
 - Use the right version of tweego in deploy.sh
 - Fix plains -> vale in some places.
 - Fix example imagepack missing.

v1.3.3.1:

 - Fix bug where tail penetration uses dick traits for determining ridges etc.
 - Fix stray comma in sex text.
 - Fix bug with SexIsInPenetration which allows you to masturbate while inside another.
 - Innoxia credits in readme.

v1.3.3.0:

 - Updated deploy.sh and finished Interactive Sex.


### v1.3.2.x

v1.3.2.16:

 - Optimize png and jpg files using optipng and optijpeg (thanks to alarmedcat)
 - Repository cleanup after image optimizations.

v1.3.2.15: 

 - Only dominant female will now wear strap-ons.

v1.3.2.14:

 - New portraits.
 - Icons for sex action UI.
 - Added "mobile mode" for sex actions.

v1.3.2.13:

 - Items converted to javascript.
 - Building menu rewritten to JS.

v1.3.2.12:
 - The Fire Beckons quest chain (3 quests, 1 event)
 - You can have sex in the bedchamber now.

v1.3.2.11: 

 - Converted trait picker (multiple) to javascript.
 - Select trait converted to javascript.

v1.3.2.10:
 - Fix cache not cleared in backwards compat

v1.3.2.9:
 - Camouflage quest by anonymouse21212
 - Can reset unit image from settings
 - Can condition on quest seed in content creator

v1.3.2.8:

 - Quest conditionals based on Seed in content creator.
 - Unit image reset button.

v1.3.2.7:

 - Some interaction from FCdev's texts integrated into Sex Actions.
 - Event for getting anal sex manual.
 - New event for getting tail sex manual.

v1.3.2.6:

 - Grope breasts sex actions.
 - Fondle Balls
 - Pinch nipples.

v1.3.2.5:

 - Pregnancy tag clarification.
 - Generic resist sex action.
 - Renamed rngLib to rng, renamed rng.choiceRandom to rng.choice
 - Tease penis/tail over hole.
 - Nimble and Tough are physical traits now.
 - Bugfix for bodyswap erasing per traits.

v1.3.2.4:
 - Kiss Sex Action. Deprecate Kiss interaction.

v1.3.2.3:

 - Make repo size smaller by deleting large files in the history
 - Vaginal climax during cunnilingus.
 - Penis, Vagina, Mouth, Dick, Tail sex
 - FAQ, tags.
 - Size difference now affect discomfort/arousal.
 - Question.md updated.
 - Fix tags on all sex actions.
 - Bugfixes (alarmedcat)

v1.3.2.2:

 - Bodyswap no longer swaps gender. Genderswap in debug mode.
 - Fix orcish_festival_common passage stray.
 - Implement new text syntax for banters.
 - Remove Success+ from quest settings.
 - Renamed bg_demon to bg_mist.
 - Facesitting position.
 - Mouth-Anus and Mouth-Vagina sex actions.

v1.3.2.1:
 - Typo fixes.
 - Need arms to unequip stuffs.
 - Removed strap-on storage.

v1.3.2.0:
 - Interactive Sex implemented. Credits go to Lilith's Throne and Innoxia. See [here](https://github.com/Innoxia/liliths-throne-public/blob/master/license.md) for license.
   - 63 new sex actions
   - 2 new events
   - 1 new building, 1 new menu
   - A lot of new items

### v1.3.1.x

v1.3.1.17:

 - Main training for mindbroken units.
 - Hotfix for switch case freezing content creator.

v1.3.1.16:

 - Title nerf on unlawfull quest
 - Master training is limited to one now. Mindbroken removes training.

v1.3.1.15:
 - Hotfix for unit image randomizer not working in character creation.

v1.3.1.14:
 - Fix tooltip appearing over dialog when clicking dialog on tooltip.
 - Unlawfull party quest by Fos. Also fixed incompatible traits being obtainable.

v1.3.1.13:

 - Sarsatically -> Sarcastically typo (thanks to acciabread)
 - A elusive fix.
 - Fix for Future Assassin having the wrong parent in the opportunity decision.

v1.3.1.12:

 - Speech adjustments. Also renamed proud to bold, sarcastic to witty
 - Clarify quest creation instructions.
 - Invincible invisible fix.
 - Fix neg trait card explanations.

v1.3.1.11:

 - New quest + opportunity (thanks to acciabread)
 - Typo fixes: "Invinsible" -> invisible (thanks to Anu)
 - QuestDone restriction.
 - Fix mutual loyalty bug on failure.

v1.3.1.10:
 - Fixed missing label in criteriacard dom.

v1.3.1.9:

 - Fix missing actor in seaborne rescue.

v1.3.1.8:

 - Converted menu to javascript and bugfixes.
 - Fix image picker png not showing.

v1.3.1.7:

 - Cached unit traits for performance.

v1.3.1.6:

 - Add support for consecutive quests.
 - Bugfixes (reported by Gorm13)

v1.3.1.5:

 - Quest card updated to pure javascript.
 - Text fixes.

v1.3.1.4:

 - Children inherits from their parents innate skin traits now.
 - Support for a|their syntax in banters
 - Updated story submission instructions in game.
 - Potion shop. Also filters and display option for markets.
 - Unit action now will auto assign units to it by default (adjustable in settings)
 - Unit cards converted to javascript.

v1.3.1.3:

 - Preferred traits for slave duties.
 - Guaranteed new quest every 3 scouted quests now.
 - Netting the mermaid: The pink pearl by Thavil.

v1.3.1.2:

 - New feature: Lovers
 - 4 new quests, 2 new events, 1 new opportunity
 - Money now formatted with commas.
 - Fixed guard support having incorrect criterias.
 - Bugfixes, and missing map in lore.md.
 - Fix best friend explanation in cost.

v1.3.1.1:
 - Remove sluttiness limit on player character.
 - Quest card backgrounds in quest results.
 - Trial of Love quest chain (3 quests, 1 event)

v1.3.1.0:
 - 2 new events, 2 new opportunities, 1 new quest, 1 new unit action, 1 new building, 1 new potion
 - 1 new quest (Zerutti)

### v1.3.0.x

v1.3.0.3:
 - Fix storyformats bug in build.sh
 - Renamed build.sh to deploy.sh
 - Temporary fix for duplicated success chance display.

v1.3.0.2:
 - Fix rear deal tags.
 - Added to FAQ: Image does not appear guide.
 - New portraits.
 - Sub-Race mention in content guidelines
 - Fix bug when saving right in the interaction menu.
 - Hinted about the bodyshift ability

v1.3.0.1:
 - Updated changelog.
 - The rear deal is now repeatable. Potion of orifice tighening now required for anus/vagina healing.
 - Adjusted lodgings cost

v1.3.0.0:
 - Documentation galore
 - Food for the Pack quest by Zerutti.

### v1.2.5.x

v1.2.5.12:
 - Continent is now named Mestia.
 - Fort lore in worldmap, injury menu moved.
 - Tag filters for duties.
 - Equipment set sort by skill mod.
 - Tags for lores, opportunity.
 - Sort / Filter for relations.
 - SVG icons for jobs fixed.
 - SVG icons for skills, special, furniture, item class, injury.
 - Remove obsolete png icons.

v1.2.5.11:

 - Updated readme.
 - Fix market errors from _market variable name collision.

v1.2.5.10:

 - Added unit image picker dialog, and DOM util functions (thanks to Naraden)
 - Equipment traits give hefty skill penalty now.
 - Documentation for DOM util functions (thanks to Naraden)
 - Fix favor/ire backwards compat bug.
 - Auto-attach now respect hte unit's sluttiness.

v1.2.5.9:
 - Bugfixes on equipment set. New quest: Blacksmith Orders
 - Level up maximum 5 times in one sitting now.

v1.2.5.8:
 - Converted job and special icons to svg.
 - Equipment can be auto-assigned now.
 - Renamed humanexotic to humansea

v1.2.5.7:
 - Slave order can be fulfilled directly using free slaves from slave pens
 - Unit actions appear together now in [Action] menu.
 - Added some more magic:earth to sex criterias.
 - Import / Export save as text for mobile users under Settings.

v1.2.5.6:
 - Icon filters for items and equipments.
 - Filters for prospect hall and slave pens.
 - Fix tooltips lingering after their targets are removed/hidden (thanks to Naraden)
 - Several changes to interact screen (thanks to Naraden)

v1.2.5.5:

 - False positive fix in sanity check.
 - Sticky / Hidden options for filters.

v1.2.5.4:
 - Refactor tag image location code.
 - Filters can be sticky everywhere now. Unified the filter codes.

v1.2.5.3:
 - Image pack creation guide and cards css bugfix.
 - Menial slave order is no longer via contact now, and can be done multiple times in the same week.

v1.2.5.2:
 - Replace map.png (thanks to acciabread)
 - Updated interactive map regions SVG for the new map (thanks to Naraden)
 - Soft-cap adjusted for lodgings.
 - Some lore for magic, city, locations.
 - Some more images of male elves/neko.
 - Fix quests not taking its costs as prerequisite to deploy.
 - Adjustments to quest UI, and fix compact mode bug on team success display.

v1.2.5.1:
 - Png versions of panorama, and fix author cards.
 - Upkeeps for relationship manager.
 - Merge request guide updated
 - Content Guideline, and overall readme cleanup.
 - Content Creator back button now works on submenus.
 - (interact) menu in unitcard. Adjusted friendship there to make space

v1.2.5.0:
 - Bugfix for filters when no items are filtered.
 - Fix incorrect success chance calculation.
 - Slaver training basic now costs a bit of money as hiring fee.
 - Tag icons for buildings.
 - Hides buildings missing its prerequisites.

### v1.2.4.x

v1.2.4.12:
 - Fix dark excalibur renaming.
 - Typo - "every becoming a man" to "ever becoming a man" (thanks to nezzanine)
 - Added dialog to show larger images on unit card image click (thanks to Naraden)

v1.2.4.11:
 - Compact equipment and item displays.
 - Mails use quest cards.
 - Modified most important links in all menus to buttons.

v1.2.4.10:
 - Intrigue equipment tags, Weed quest spelling error (thanks to acciabread)
 - Vault Assault quest.
 - Implemented <<gotowipehistory>>.
 - Rename diligent to studious, energetic to active.
 - Rewrote quest tag filter to make it reusable for other parts
 - Fixed whitespace in sea panorama.
 - Rewrote debug initialization to javascript.
 - Slave minimum value in markets.
 - Debug start now start with much more things going on.

v1.2.4.9:
 - Favor tag for quests.
 - Issue templates
 - Investment banking quest

v1.2.4.8:
 - Long-term slaves converted to slaver gains bg_slave.
 - Stackable trait ifs in content creator toolbar.
 - Make clerk the knowledge common bg instead of farmer.
 - Can edit and replace actors in content creator.
 - Potion of isolation and isolation treatment. (1 new quest, 1 new opportunity)

v1.2.4.7:
 - Update itch.io build command.
 - Moved panorama to its own folder. Make itch deployment ignore it.
 - Sticky menu is toggle on click now.
 - Removes game over when player is captured.
 - 2 new events, 2 new opportunities.
 - Bugfixes:
   - Fixed opportunity content creator bug when deleting options
   - Fixed quest difficulty calculation incorrectly using failure rate instead of negative success

v1.2.4.6:
 - Made itch.io bundle flatten the unit images into a single directory (thanks to Naraden)
 - Added unique icons for equipment items (thanks to Naraden)
 - Bugfixes

v1.2.4.5:
 - Bg_courtesan and a bunch of images. Closes #118.
 - Upgraded prebuild backgrounds to rare.
 - Stores building as object in fort now for faster searching.
 - Hides unit actions before unlocking their buildings.

v1.2.4.4:
 - Can set quests as ignored
 - Icons for quests
 - Panorama in quest cards
 - Filter by tags in quests as a sticky

v1.2.4.3:
 - Careful -> cautious rename
 - Fixed quest toolbar not overflowing its container

v1.2.4.2:
 - Applied tags: rings, eyemask, necklace, plaguemask (thanks to acciabread)
 - Rings -> ring, sex collar -> choker (thanks to acciabread)
 - Minor cow unit fix, huge -> titanic (thanks to acciabread)
 - Fix quest / opp can be generated when no unit satisfies its actors
 - Merged patient and decisive into calm and aggressive.
 - Renamed inquisitive to curious
 - Texts for new equipment tag. Also monkey patch for `physical.svg`

v1.2.4.1:
 - Unit description now details added and missing skin traits.
 - Quest auto assignment UI revamp.
 - Quest history on statistics.
 - Precompile updated.
 - Quest history is recorded now.
 - Text filters for quests.
 - Bugfix for opportunity dev tool restriction

v1.2.4.0:
 - Lore feature implemented.
 - Library building, lore tags.
 - Support for innate traits.
 - Combined dick and vagina equipment slot. Added weapon equipment slot.
 - Violent/peaceful -> proud/humble. perceptive -> attentive/dreamy
 - Made in-game filter menus open on click instead of hover (thanks to Naraden)
 - Renamed plains to vale
 - Ears_elf added to orcs.
 - Tiger traits renamed to cat. Fixed elven ears name.
 - Implemented interactive worldmap (thanks to Naraden)
 - Converted trait icons to SVG, and lots of revisions (thanks to Naraden)
 - 32+ new images.
 - Increase default quest expiration from 4 to 6 wks.

### v1.2.3.x

v1.2.3.15:
 - New portraits.
 - Quest manual team assignment UI rewritten.

v1.2.3.14:
 - Electrician bugfix
 - Mansion of hypnotism bugfix
 - Monk business typo

v1.2.3.13:
 - Quest reward-based tags (thanks to acciabread)
 - Monk Business quest (thanks to acciabread)
 - Kraken hunt diff change. More images
 - Made duty icons smaller in rep's (thanks to Naraden)
 - Slaver training adv use items now and harder to unlock. Fleshshaping needs basic ob training.

v1.2.3.12:
 - Fixed compact mode not working in quest menu

v1.2.3.11:
 - Reclassified some quests to special quests
 - QuestHub hides the description after great hall is built.
 - Helpcard color chagned.
 - Added icons for duties (thanks to Naraden)
 - Webpack: changed config to support svg embedding (thanks to Naraden)
 - Filter code disentangled. New filters for most menus
 - Early-game balance adjustments and slaver cap / team cap adjustments.
 - Gender pronoun fixes (thanks to Stiletto)

v1.2.3.10:
 - Replaced some trait icons (elf race, gagged, very slutty, fire/dark master) (thanks to Naraden)
 - Bugfix for EOTS and True Love.

v1.2.3.9:

 - Devtool: added actor list to preview, fixed macro closing tags validating args, and undefined actor 'target' in interactions (thanks to Naraden)
 - Backwards compat converted to 100% JS.

v1.2.3.8:
 - New quest chain (1 quest, 2 events, 1 opportunity, 1 interaction)
 - New Feature: On leave.
 - Bodyshifters
 - Updated icons (thanks to acciabread).

v1.2.3.7:
 - More portraits (units with wings feathery)
 - Fixed value icon colors. For #76.
 - Added trait icon rarity indicators, added macro <<filterable>>, and changes to devtool trait picker dialog (thanks to Naraden)
 - On-duty unit can go on quests, get injured, etc.

v1.2.3.6:
 - Fixed itch.io build instructions.
 - Support for opportunities that have to be answered.

v1.2.3.5:

 - Various bugfixes, including fix for teams not properly garbage collected.

v1.2.3.4:
 - Better icon for arms.
 - A lot of new images
 - New unicorn background: boss

v1.2.3.3:
 - Cost and restriction cleanup for #60.
 - Bugfix for bodyswap not transferring male gender.

v1.2.3.2:
 - Attempted bugfix for equipmentset sometimes going broken
 - Some more images.
 - Content creator improvements.

v1.2.3.1:
 - Fix typo in EOTS quest.
 - Tutorial updated. Closes #60.
 - Fix crafter background backwards compatibility.
 - More banter texts (thanks to acciabread).
 - Fixed image issues (thanks to acciabread)
 - Bugfix for fractional difficulty computation.

v1.2.3.0:
 - Replaces <<widget>> with <<focwidget>>. Closes #70
 - Devtool: basic validation for macro parameters on code editor (thanks to Naraden)
 - Content creator is de-spaghetified

### v1.2.2.x

v1.2.2.16:
 - Fix missing artisan icons.
 - Adds equipment in debug mode. Closes #61
 - Encapsulate JSON.parse(JSON.stringify()) inside setup.deepCopy
 - Devtool: added metadata for several macros (thanks to Naraden)
 - Criterias now have 5+ traits for each crit/disaster.

v1.2.2.15:
 - Bg_miner, bg_student removed
 - New trait: bg_metalworker, bg_artis
 - Some fixes to banters text (thanks to Naraden)
 - Crafter moved to apprentice. priest and wiseman shuffled

v1.2.2.14:
 - Some new images for pirate and seaman.
 - Code editor: support for events/interactions/opportunities, plus some fixes (thanks to Naraden)
 - Main menu: moved some links around (thanks to Naraden)
 - Devtool: added searchbox to opportunity picker (like quests had) (thanks to Naraden)
 - Added macro `<<repshort>>` (thanks to Naraden)

v1.2.2.13:
 - Bedchamber and rec wing are now prereq. for vet. hall. Two less variables for writers to worry about.

v1.2.2.12:
 - A bunch of topics (thanks to acciabread)
 - Hotfix for code editor spamming notification and `ExpDisaster`

v1.2.2.11:
 - Added output preview to code editors for quests (thanks to Naraden)
 - Code editor: added 'simple mode', and tooltips for macros tags (thanks to Naraden)
 - Added 'focwidget' macro, and css menu improvements (thanks to Naraden)
 - Code editor: added BETA warning to output preview (thanks to Naraden)
 - Changes to end-of-week report banters section (thanks to Naraden)

v1.2.2.10:

 - Difficulty adjustments.

v1.2.2.9:
 - Removed cruel and slutty traits.
 - Lustful slutty rating increased to compensate for loss of slutty trait
 - Adjustments on critical and disaster chance computations.

v1.2.2.8:
 - Bugfixes (thanks to acciabread)

v1.2.2.7:
 - Explicit support for event/quest/opp chains.
 - Repfull description.

v1.2.2.6:
 - Support for childbirth
 - Enlightenment quest chain by Alberich (3 quests, 2 opportunities, 3 events)

v1.2.2.5:
 - King of dragons quest bugfix.

v1.2.2.4:
 - Excalibur quest chain. getAnySlaver() and getDutySlaver()
 - Navigation macro rewrites
 - Fixed tooltip sometimes persisting after reload (closes #59) (thanks to Naraden)
 - Replaced accesses to 'State.variables.company' during SetupInit to the raw company keys (thanks to Naraden)
 - Units have weapons now.
 - Centralized initialization of state vars, and separated it from init of static data (thanks to Naraden)
 - Added official js types for SugarCube (slightly modified) (thanks to Naraden)
 - Fixed #62: opportunity texts content creator.

v1.2.2.3:
 - Fix for equipmentsetcard replace bug with foctimed on tooltips
 - Fixed #58.

v1.2.2.2:
 - Fallback for cost/restriction deserialize (if does not exist, at least let user salvage the rest of dev save) + code editor fixes (thanks to Naraden)
 - Added types for State.variables, reorganized type files, and some type fixes (thanks to Naraden)
 - Populated code editor toolbar, added trait picker dialog, embedded CodeJar lib (thanks to Naraden)

v1.2.2.1:
 - Content creator toolbar: add player, fixes actors not showing.

v1.2.2.0:
 - New feature: Ire and Favor (replacing Relationships)
 - DevTool: addded box to search quests by name, added new macros to support this (thanks to Naraden)
 - Fix quest author failing to display properly under some circumstances.
 - Added CSS menus, and added a menu to codeeditor to insert macros (thanks to Naraden)

### v1.2.1.x

v1.2.1.2:
 - Make actor card color less strong
 - Fixed quest author not being correctly positioned in some cards (closes #49) (thanks to Naraden)
 - Added setting 'animated tooltips' to enable/disable fade animation and delay (thanks to Naraden)

v1.2.1.1:
 - Moved <<icon>> widget out of devwidgets, added all available icons, and cleanup (thanks to Naraden)
 - Tweaks to injured card CSS, fixed 'injured for 1 weeks' (plural), added injure/heal to debug menu (thanks to Naraden)
 - Fixed injury card image not rendering (thanks to Naraden)
 - Moved quest author to the bottom right of the cards (closes #49) (thanks to Naraden)

v1.2.1.0: 
 - Better tooltips (thanks to Naraden)
 - Busy/idle images
 - Better unit icon (thanks to Naraden)

### v1.2.0.x

v1.2.0.3:
 - Injury heal cap for mystic

v1.2.0.2:
 - Start of v1.3 work. Directory cleanup.
 - Added font for parchment letter, a few CSS tweaks and fixed missing brackground (thanks to Naraden)
 - Changed titlebar caption to something more meaningful (see #24) (thanks to Naraden)
 - Fixed bug where nothing show if you filter duties by job

v1.2.0.1:
 - Documentation updated for v1.2
 - Added drag&drop support for custom unit images (thanks to Naraden)

v1.2.0.0:
 - Can change settings from character generation.
 - Support for multiple imagepacks (thanks to Naraden)
 - Bugfix for slave roles in content creator.

### v1.1.8.x ES6 changes done

v1.1.8.2:
 - imagemeta.js can be merged to one for itch.io (thanks to Naraden)
 - several new unit portraits 
 - artist / author / coder credits now appear in front page

v1.1.8.1:
 - More images
 - Hotfix for undefined building cost.

v1.1.8.0:
 - Converted the last classes to ES6 class (thanks to Naraden)

### v1.1.7.0 Image revamp

v1.1.7.9: 
 - Adjusted all races' background probability so almost all backgrounds are possible
 - Converted costs to ES6 classes (thanks to Naraden)
 - Converted restrictions to ES6 classes (thanks to Naraden)
 - Bugfixes

v1.1.7.8: Bugfixes. Rarity 0 quests. Itch.io build updated (part 1)

v1.1.7.7: 
 - Deprecate getUnitForDuty in favor of getUnit
 - Added "installation" notice.
 - Allow embedding images with webpack, and changed [img[...]] to <<image ...>> (thanks to Naraden)
 - Wrapped args in calls to <<image>> with quotes, and fixed some calls having a trailing character (thanks to Naraden)

v1.1.7.6: Automated script for itch.io deployment (part 1). Image changes in player generation

v1.1.7.5: Hotfix for duty serialization error. Lazy calculation for unit images.

v1.1.7.4:
 - Remove obsolete image code. allow empty credits (for user generated image)
 - Added setVersion.js dev script and 'npm run set-version' command (thanks to Naraden)
 - Slightly changed 'changelog.txt' templates generated by setVersion.js (thanks to Naraden)
 - New CSS for lettercard (#17) (thanks to Naraden)
 - Type defs for SugarCube stuff and Unit class augments, and a few typing fixes (thanks to Naraden)
 - Repo structure changes to avoid user.min.js conflicts (issue #33) (thanks to Naraden)
 - Limits to skill and background traits

v1.1.7.3: Favicon updated, more engine reworks (self-executing functions removed)

v1.1.7.2: "Rival Interaction" event by Kyiper

v1.1.7.1: ES6 classes for all! (Naraden)

v1.1.7.0:

- Unit images have been revamped:
  - Now have around 1300 images, almost evenly divided between male and female
  - Image size increased 16 times over
  - Artist credits fully displayed in-game
  - Unit images now determined in a smart way to avoid duplicates
  - Unit images can use its "parent" directory if there are too few images

- Background traits cleanup
  - Removed squire, militia, gardener backgrounds
  - Added assassin, scholar, and monk backgrounds

- Some adjustments to trait preferences

- Market has been serialized properly (thanks to Naraden)

- Nested cost / restriction can be edited in content creator now (thanks to Naraden)

- Switched to webpack (thanks to Naraden)

### v1.1.6.x Refactoring Hell

v1.1.6.6 "Enligthenment of the Mind" by Alberich (Part 1/3). Remove random trait.

v1.1.6.5 Image credits now shown in-game. Preparation to do this one by one for all the images.
As well as upscaling them to 300px.

v1.1.6.4 Bugfixes for duty refactoring. Also image max size for custom image.

v1.1.6.3 Pimp report is more detailed at end of week.

v1.1.6.2 Duty refactored to make their skills and traits flexible now. Removed PastureSlave

v1.1.6.1 Duty refactored finally (thanks to Naraden)

v1.1.6.0 Refactored almost all classes into proper javascript class (thanks to Naraden for idea)

### v1.1.5.x Titles

v1.1.5.13 Migration to new class: 30%

v1.1.5.12 Unit moved to new class

v1.1.5.11 new class switched to more proper way of reinitializing.

v1.1.5.10 Converted friendship and titlelist to newer class version.

v1.1.5.9 Simplified skill increase calculation (now each skill focus adds an independent 25% chance of getting more points)

v1.1.5.8 Equipment / furniture greyed out inactive ones (thanks to Naraden)

v1.1.5.7 Difficulty increased by 20%. Excalibur 3/10

v1.1.5.6 "Give Oral" interaction by Quiver

v1.1.5.5 Fix slowdown because of notification memory leak

v1.1.5.4 Title bugfix

v1.1.5.3 Bugfixes (master training obedience missing requirement, dev tool unit group). Excalibur 2/10

v1.1.5.2 Three new quests to support slaver that went missing but immediately rescue-able.

v1.1.5.1 Fix various bugs that appear because of title changes.

v1.1.5.0 Units can have titles now. They grant small skill bonuses, and you can have at most three of them
ACTIVE at the same time. Converted many existing tags to titles.

### v1.1.4.x Team revamp

v1.1.4.3 Loyalty's reward quest chain (3 quests). Scouted quests generation moved to a separate end-of-week location.

v1.1.4.2 Equipment restrictions now flexible and no longer hard-coded. Excalibur quest chain 1/9.

v1.1.4.1 One skill focus now raises 2 stats with probability 25%

v1.1.4.0 Revamped how ad-hoc team works. Now mission control limits the number of teams
you can send concurrently on a mission. You can have much more teams than that,
but only so many can go on missions. Ad-hoc teams can always be created, if you
have space.
Also assigning units to ad hoc team no longer takes them from their old teams.

### v1.1.3.x Content and rewrites

v1.1.3.4 Rewrote most early forest quests.

v1.1.3.3 Rewrote almost all of the early plains quests.

v1.1.3.2 Replaced greatmemory with creative. All skills are quite useful now I think.

v1.1.3.1 Replaced the somewhat useless "trainer" and "charming" traits with a "intimidating" and "animal whisperer". Orcs now favor intimidating, werewolves favor animal whisperer, and desertfolks favor ambidextrous.

v1.1.3.0 "social.png" bug.

### v1.1.2.x GUI changes

v1.1.2.13 "Gift of the Magi" by Alberich --- a desert veteran quest that do... something interesting

v1.1.2.12 Duty text bugfix.

v1.1.2.11 Asset size in character creation.

v1.1.2.10 Draconic fin-like ears.

v1.1.2.9 Fix trait requirement description to make sense (making trait cover use OR). Streamlined training traits.

v1.1.2.8 A new quest for offloading mindbroken slaves (part of the Factory Facts opportunity)

v1.1.2.7 "Goblin Resque" by "Dporentel" --- quest in city to obtain mindbroken girls!

v1.1.2.6 Results can be displayed per quest / events now. The Noble Games quest chain (3 quests)

v1.1.2.5 For Science veteran quest chain (6 quests)

v1.1.2.4 Unfucks matchAll

v1.1.2.3 Content creator cost and restriction now use cards.

v1.1.2.2 Equipment menu revamp.

v1.1.2.1 Filtering and sorting in all markets, sorting equipments, equipments now has the basic set on default.

v1.1.2.0 Equipment and bedchamber list is now a proper two column grid (thanks to Naraden)
Fixed #6.

### v1.1.1.x Continued stability, Interaction additions, and Content Creator

v1.1.1.14 Change-of-Heart potion

v1.1.1.13 Duty sorting, display, filtering (advanced)

v1.1.1.12 Three more interactions, including a furniture interaction.

v1.1.1.11 Even more interactions.

v1.1.1.10 Duty trait fix for older saves (thanks to Naraden)

v1.1.1.9 Usable items (no target). New icons for items depending on their usability. Bugfix for remove trait in content creator.

v1.1.1.8 "Slaver Training: Submission Cure" by Alberich: a special quest that removes submissive trait.

v1.1.1.7 eq_chastity_dick renamed to eq_chastity (may be applicable to females later)

v1.1.1.6 Fix duty bug not using the correct preferred traits (thanks to Naraden)

v1.1.1.5 More bedchamber interactions.

v1.1.1.4 2 more bedchamber interactions and a bedchamber "event" with a cruel slaver.

v1.1.1.3 Pre-made starting characters.

v1.1.1.2 New bedchamber interaction.

v1.1.1.1 Converted existing interactions to be located at the bedchamber if the slave is located there.

v1.1.1.0 No longer need to use the "include setup" in content creator. Can interact with units at home (except injured).

### v1.1.0.x Stability

v1.1.0.12 Unit frequency rebalance

v1.1.0.11 Add the missing Recruitment: Plains

v1.1.0.10 Minor dragonkin trait affinity changes.

v1.1.0.9 Butterfly wings for fairies (very rare)

v1.1.0.8 Unit pool trait preferences updated.

v1.1.0.7 Fix several master training not taking two weeks. Demonic trait rework.

v1.1.0.6 Equipment set improvement in the menus

v1.1.0.5 Five new quests: Slave recapture quests. One new quest in plains: A Most Dangerous Animal

v1.1.0.4 Fix opportunity expire() function not called when they expire. Quest on expire and opportunity on expire triggers implemented.

v1.1.0.3 Fix content creator not interacting with actors.

v1.1.0.2 Custom image "Done" button.

v1.1.0.1 Hotfix for quest-key in delete unit.

v1.1.0.0 Bugfixes. Wrap up v1.0.x

### v1.0.10.x Random units in quests and opportunities

v1.0.10.3 Fix ad-hoc teams not getting exp.

v1.0.10.2 Support of opportunity + actors in content creator

v1.0.10.1 Fix units deleted accidentally

v1.0.10.0 Support for random units in quests and opportunities from both your company and NPCs.
Content creator support for that for quests. Opportunity support coming next.

### v1.0.9.x Balance changes in preparation for v1.1.x

v1.0.9.5 Two new scheduled events.

v1.0.9.4 Debug opportunity is nicer now.

v1.0.9.3 Gender for pet shopping quest.

v1.0.9.2 Bugfixes.

v1.0.9.1 Unit group QoL in content creator.

v1.0.9.0 Balance changes, including mission control upgrade gated behind great hall.

### v1.0.8.x Asynchronous loading, text fixes.

v1.0.8.11 "Caged Tomato" by Alberich --- city quest that requires you to have both a female slaver and a female slave.

v1.0.8.10 Converted most .rep() into `<<rep>>`

v1.0.8.9 `<<rep>>`

v1.0.8.8 Text fixes (`<<uhands>>` and `<<uhand>>`). Also bugfix for Caress `<<arms>>`

v1.0.8.7 Unitpool rebalance

v1.0.8.6 Deprecate the quest traits. They now use tags.

v1.0.8.5 Slave order content creator expanded --- now almost all existing ones can use it.

v1.0.8.4 Performance fix for slave order fulfillment. Content creator now can create slave orders.

v1.0.8.3 Content Creator trait fixes. Bugfix for night shift quest.

v1.0.8.2 Night Shift "quest chain".

v1.0.8.1 Bugfixes and transition related to async to look nicer.

v1.0.8.0 Performance improvement FOR GOOD this time on all menus except END WEEK
(Making everything async basically).

### v1.0.7.x Continued preparation, bodyswap, and events

v1.0.7.2 "Seaborne Rescue - It Has to Be You" by Alberich: A rescue mission scoutable exclusively by the Rescuer.

v1.0.7.1 Events fixes. Tiger Bank events.

v1.0.7.0 Bodyswap full description, scheduled events in content creator, Part 3/4 of Night Shift quest chain.

### v1.0.6.x Preparation for v1.1.0

v1.0.6.7 Documentation for interaction creation. Fort level upped to 250.

v1.0.6.6 Filter display adjustments.

v1.0.6.5 Traits for slave values and slaver join time.

v1.0.6.4 Calendar has a seed() function now. Part 1/4 of Night Shift quest chain.

v1.0.6.3 Insurer duty

v1.0.6.2 Fix display issue with trait affinities in quests

v1.0.6.1 The Legendary Mason quest (example of new feature)

v1.0.6.0 Content Creator: can overlap writing between quest outcomes.

### v1.0.5.x Family and more Content

v1.0.5.10 Trait hotfix (hovertext mistake)

v1.0.5.9 Trait rebalance

v1.0.5.8 Sorted the traits based on rarity, then based on the skills they are useful for.
Also two more bg traits to round up the trait coverage (informer and apprentice).

v1.0.5.7 Some more background traits. Fixes for all criterias. Quest to rescue lost slaves (scoutable by rescuer too).

v1.0.5.6 Conditionals and clauses are implemented in content creator (If then else, Or, And, do All, one random)

v1.0.5.5 Documentation galore

v1.0.5.4 Debug mode extended to make it easier to test quests.

v1.0.5.3 Content creator javascript quote and double quote now properly escaped.

v1.0.5.2 "The Sergeant's Wedding - Poetic Justice" by Alberich: Lv40 veteran quest in the city.

v1.0.5.1 Bodyswap Experiment quest.

v1.0.5.0 (Basic) family system. Choose Your Own Adventure quest chain.

### v1.0.4.x Bedchambers and Performance Fixes

v1.0.4.9 Various QoL fixes (many thanks to jferdi)

v1.0.4.8 Bedchamber is described in unit description now.

v1.0.4.7 END WEEK keybind switched to space bar to prevent save game shenanigan.

v1.0.4.6 Auto-save toggle hotfix.

v1.0.4.5 Hotfix for armory spare equipment viewing screwing up history.

v1.0.4.4 End week performance fixes. Back button now works reliably.

v1.0.4.3 Training as a service quest.

v1.0.4.2 Keybind enter works for week end. Remove market objects.

v1.0.4.1 Banter hotfix

v1.0.4.0 Bedchambers, performance fixes, AutoSave enabled by default, item sorting

### v1.0.3.x Content

v1.0.3.9 Base skills (affected by innate traits) now properly coded.

v1.0.3.8 Duty sorting, keyboard shortcut for end of week continue

v1.0.3.7 Tower of Roses quest.

v1.0.3.6 Can level up multiple times in one quest now.

v1.0.3.5 Fix varstore bug.

v1.0.3.4 Unit Action requirement hidden now when satisfied.

v1.0.3.3 Mastery over Magic quest

v1.0.3.2 Pet Shopping veteran opportunity

v1.0.3.1 VarStore is introduced to store variables temporarily

v1.0.3.0 The Seven Deadly Transformation quest chain (9 quests total).

### v1.0.2.x Continued bugfixes and unit histories

v1.0.2.13 Better map by mars_in_leather, Part 3 of Seven Deadly Transformation quest chain.

v1.0.2.12 Skill modifiers are displayed now.

v1.0.2.11 Bugfix on unit group in dev tools. Part 2 of Seven Deadly Transformation quest chain.

v1.0.2.10 UnitGroup for new quests fix.

v1.0.2.9 Fix for select unit. Part 1 of Seven Deadly Transfomration quest chain.

v1.0.2.8 Potion of transformation.

v1.0.2.7 Unit filter works everywhere now.

v1.0.2.6 Skill focus UI changes: can be edited when unit is busy.

v1.0.2.5 Seasonal Cleaning chained quest (3 quests) in the city. Unit tag display names in description.

v1.0.2.4 Snake Oil Salesman quest. Tooltip Fix #2.

v1.0.2.3 Tooltip can be viewed in mobile now (click the element)

v1.0.2.2 Fixed typos on The Honest Slaver quest. Help texts for no eligible units.

v1.0.2.1 The Honest Slaver quest, bugfix on description and newline in content creator.

v1.0.2.0 Unit histories are recorded now (up to 100 per unit).

### v1.0.1.x Bugfix extravaganza

v1.0.1.7 AnyTrait in content creator, fully corrupted is a trait now.

v1.0.1.6 Fix for default equipment.

v1.0.1.5 Fix custom content descriptions not showing up in loaded game.

v1.0.1.4 Fix errors when refreshing page.

v1.0.1.3 Articles fixes

v1.0.1.2 Ultra easy compiling instructions.

v1.0.1.1 Watersport content now hides descriptions for toilet trainings.

v1.0.1.0 Filter hiding.

### v1.0.0.x Full game release wooo

v1.0.0.2 Restriction on player: e.g., interaction available only when player is submissive.

v1.0.0.1 Neko skin traits for body / mouth / arms / legs (can very rarely appear during corruptions).

v1.0.0.0 Game released.

### v0.12.4.x QoL and bugfixes

v0.12.4.17 Unit Tags in content editor.

v0.12.4.16 Sort units.

v0.12.4.15 Futa removal from engine.

v0.12.4.14 Prologue improvements.

v0.12.4.13 QoL (greyed out unit actions).

v0.12.4.12 Fix attempt for trojan false positive.

v0.12.4.11 bugfixes, fort ramp readjust, sorting quests.

v0.12.4.10 ad-hoc teams

v0.12.4.9 slaver training basic and advanced.

v0.12.4.8 save magic (single variables).

v0.12.4.7 save magic (save unsets most methods now).

v0.12.4.6 Image magic (image has an editable .js file now)

v0.12.4.5 Halve load time by removing the undo history on save.

v0.12.4.4 Upgrades now cost improvement space, lodging/armory/team/dungeon are now upgrade-based.

v0.12.4.3 Minor bugfixes, QoL, quest to turn slave to slaver.

v0.12.4.2 Building displays.

v0.12.4.1 QoL changes on main game

v0.12.4.0 QoL revamp on content creator.

### v0.12.3.x Duty flavor texts and company statistics.

v0.12.3.4 Bugfix.

v0.12.3.3 Bugfix, Content creator QoL work continues.

v0.12.3.2 Bugfixes. Content creator QoL part 1 (up to roles).

v0.12.3.1 SAVES NOT BACKWARDS COMPATIBLE. Company statistics.

v0.12.3.0 SAVES NOT BACKWARDS COMPATIBLE. Recreation wing rebalance. Duty flavor texts. Building level flavor texts.

### v0.12.2.x Unit interactions

v0.12.2.2 Duty code slightly reworked. Reddit created.

v0.12.2.1 Some more interactions.

v0.12.2.0 Unit interactions are written. Interaction is now in content creator.

### v0.12.1.x Detailed unit descriptions

v0.12.1.1 Banter texts are procedurally generated now, and is completely written.

v0.12.1.0 Unit description is completed. Bugfixes.

### v0.12.x Cosmetic content and polish

v0.12.0.4 Silent is now cool

v0.12.0.3 Unitgroup now resides in setup.

v0.12.0.2 Start of unit description detail. Background is done.

v0.12.0.1 Speech types for a unit. Engine changes done.

v0.12.0.0 Temporary traits in trauma and boons.

### v0.11.x Filling out fundamental quests

v0.11.1.0 Bugfixes, RescuerOffice, TheRearDeal, RaidTheMist, AlchemistOfTheSevenSeas, KingOfDragons, OutcastsOfDragons, PiratesAhoy, Raid:BeyondTheSouthernSeas, TradingMissionSouthernSeas

v0.11.0.4 FutureSight quest, plains/forest/city/desert quests done.

v0.11.0.3 Equipment no longer lost if the unit is lost. desert quests: CapitalOfSlaves, LootTheLoot, and Desert purifier: Recruit. LICENSE file (CC BY-NC-SA 4.0)

v0.11.0.2 Bugfixes, two new city quest: Light In Darkness and Community Service.

v0.11.0.1 three new forest quests: Catnapping, GorgonCave, and The Fruit of Sluttiness. Catch-up quest works on all teammembers.

v0.11.0.0 Recruitment quest for the forest, give each race a preferred skill.

### v0.10.x Balance changes

v0.10.6.0 Balancing is done. Bugfixes, numerous balance adjustments, Potion of Level Up.

v0.10.5.3 Equipment streamline UI, free pant/shirt to cover your genitals.

v0.10.5.2 Bugfix on unit skill increase on level up

v0.10.5.1 Bugfix on building dependency. Balance adjustment on slave order prices.

v0.10.5.0 Character creation at start, team can have 4 slavers and 1 slave, bugfixes, balance adjustments, prologue tweaks.

v0.10.4.3 Corruption traits and friend skill adjustments

v0.10.4.2 Fix for werewolf names

v0.10.4.1 Generated unit names are done

v0.10.4.0 Friendship, bugfixes, auto-mail

v0.10.3.0 Treatment room, bugfixes, more balance adjustments, 3 new quests (forest).

v0.10.2.1 Fix content creator bug with automatically generated EXP.

v0.10.2.0 Failure and disaster now gives a lot of EXP. Automate EXP in content creator. Bugfixes.

v0.10.1.3 Bugfix for new quest (Safari Zone).

v0.10.1.2 More balance fixes. 2 new quests that give slave orders.

v0.10.1.1 Potions, Bugfixes, further balance works.

v0.10.1.0 Balance work for all quests and opportunities. Bugfixes. New quest (Atacama)

v0.10.0.2 Fixed incorrect training trait values.

v0.10.0.1 Bugfix for recruitment quest

v0.10.0.0 Beginning of balance work. See [Balancing roadmap](docs/balancingroadmap.md). Bugfixes, Balance overhaul for all aspects of the game EXCEPT quest rewards that are not money or exp.

### v0.9.9.x Corruption and Purification

v0.9.9.3 Bugfixes, 3 new quests.

v0.9.9.2 Bugfixes (incl. cum cow bug fix), 4 quests.

v0.9.9.1 DesertPurifier quest, corrupted trait.

v0.9.9.0 corruption and purification, new quest.

### v0.9.8.x Advanced Content Creator

v0.9.8.3 save file has meaningful name now (by svornost)

v0.9.8.2 can save anywhere, new quest

v0.9.8.1 settings for quest description toggle

v0.9.8.0 content creator: new quest can be based off existing quest. new surgery buildings (biolab for your slavers). new quest. UI fixes in several places (including selecting skill focuses)

### v0.9.7.x Basic Content Creator

v0.9.7.3 can create event in content creator, new quest

v0.9.7.2 Added author names for content.

v0.9.7.1 NOT BACKWARD COMPATIBLE. Fixed a bug which apparently slowed down loading time. Content creator help texts. New quest. Content creator for opportunities now available.

v0.9.7.0 NOT BACKWARD COMPATIBLE. Content creator tool fully implemented.

### v0.9.6.x Basic Quests for Plains, Forest, City

v0.9.6.1 minor bugfixes, new quest

v0.9.6.0 added the missing traits, start of filling desert quests, NOT FULLY BACKWARDS COMPATIBLE

### v0.9.5.x More Performance Improvements

v0.9.5.3 new quest

v0.9.5.2 BIG Bugfixes (really big bug), gender filter for new units (e.g., want only female slaves and male slavers to appear), new quest

v0.9.5.1 Bugfixes, quest UI rework, new quest

v0.9.5 SAVE GAME NOT BACKWARDS COMPATIBLE, performance overhaul, balance adjustments, new quest (special quest that can return a lost slaver back to you)

### v0.9.4.x Performance Improvements

v0.9.4.8 minor bugfixes, quest filter, UI streamlined, new quest, new unit images

v0.9.4.6 Bugfix

v0.9.4.5 Bugfix, new quest

v0.9.4.4 Critical Bugfix

v0.9.4.3 Bugfix (may break save games?), new quest chain

v0.9.4.1 Bugfix

v0.9.4 Bugfixes, Save game are compatible with most updates now, performance fix, new buildings, new quest

### v0.9.3.x Building Filtering and Performance Improvement Start

v0.9.3.1 Critical Bugfix

v0.9.3 Bugfixes, 2-3 new quests, building filtering, building/market performance fix

### v0.9.2.x Important Bugfixes

v0.9.2.7 Bugfixes, 2 new quests

v0.9.2.5 Bugfixes, new quest

v0.9.2.4 Bugfixes, new quest, end of week performance fix

v0.9.2.3 Bugfixes, new quest

v0.9.2.1 Bugfixes, new quest, content filter settings

### v0.9.1.x Journey Beginnings

v0.9.1 Bugfixes and some new quests

### v0.9.0.x Initial Release

v0.9.0 Release

