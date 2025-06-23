## Private Chambers Design Document

Private Chamber is a planned late-game improvement, where you and your slavers can keep a personal
harem.
It is planned to be implemented once there are sufficient content in the game... which may be
very soon.
This document details its purpose and design.


### Main Design Goal

The Private Chamber should primarily be a **role-playing enhancer** --- i.e., its gameplay effect
should be small.
It should be another "end-goal" of the game, where you want to perfect every single one of the private
chambers with luxuries.


### Key Designs


#### It should be upgradable.
The Private Chamber improvement is upgrade-able, like Lodgings.
Each upgrade should give one extra private bedchamber.


#### Slave and slaver
Private bedchamber can hold up to two slaves (assigned via a Duty) and a slaver
(owner of said slaves).
The Duty is a new class of duty that can link to the bedchamber.
A slaver can have multiple bedchambers, owning more than two slaves.
The slaver gains the **maximum** stat bonus of all bedchambers they own.
The slaver part is not a duty, as the slaver isn't "busy" from owning the slave,
while the slave is "busy" from being owned.

Slaves give small (max +6 to each stat) bonus to their owner.
Having one slave is +3, have two slave max +6.
The bonus scales with the rivalry/friendship with their master, from +1 to +3.
Training and value **should not matter**, to allow full roleplaying.

Slaver owning a slave will have a **higher probability of using said slave during banters**.


#### Furniture
Private bedchamber can have furnitures, which works almost like equipments.
There are 10 furniture slots, each corresponds to a skill

- slaver bed: sex. Basic bed, Wooden bed, Luxurious bed, master bed
- slave beds: intrigue. Floor. Iron cages / Floor pillows. Gilded cages / luxury pillows. master slave bed
- food tray: knowledge. Floor. Pet food tray / Plates. Gilded pet food tray / gilded plates. master
- drink tray: social. Water glass. Dog water bowl / Cup. Gilded pet water bowl / gilded cup. master
- slave reward: aid. Nothing (pets). Petting gloves. Pet scratchers. master
- slave punishment: slaving. Nothing (spank). Whip. X-Cross. master
- lighting: survival. Candle on floor. Candlestick. Chandelier. master
- tile decoration: combat. None. Rugs. Exotic rugs. master
- floored decoration: brawn. None. Statue. Masterwork statue. master
- wall decoration: arcane. None. Painting. Masterwork painting. master

Having a good furniture in a slot will
give a **small boost**
to their corresponding skill:

There are three tiers of furnitures.
Simple: buyable, gives +2 stat, costs around 1500g.
Advanced: gives +4 stat, costs around 6000g,
Master: gives +6 stat, costs around 20000g

Advanced should be given as rewards from multiple sources, while
Master should be rewarded from lengthy quest chains / very hard veteran quests.
Master furniture names are placeholder, and should be filled once their quests are written in.

Can create exceptions. A tier can have more than one possible furniture options.


#### Total benefit for slaver:
+6 max from slaves, +6 from furniture.
+6 from slaves is easily achievable.
+6 from furniture is **difficult**, reasonable is +2 with several +4 sprinkled around.


#### Cosmetic options:

**Slave rules**:
If you are the owner of a room, you can assign what rules
to use for slaves. If a slaver is the owner, they will decide themselves
(based on their traits).
These are **all cosmetic** and has no gameplay effect aside from flavor texts.
Rule list:
- crawl / walk
- orgasm / no
- full speech / animal / no
- food: normal / cum-added / milk-added / both-added
- share: yes / no


#### UI and Flavor texts

New private chamber menu that lists all the private rooms.
Clickin a private room will open up menu for that room, displaying
description of the room.
Description includes:
- What slaves are in the room
- What are they doing, taking slave rules into account
- Slave rules
- Description of the furnitures, taking slave rules into account.
- What their master is doing

If you are the master, then there should be a short description about your slaves
trying to get your attention.

Actions possible: Assign a slaver to room, remove a slaver from room,
assign decoration.


## Implementation

### Engine additions

#### New FurnitureSlot class

Follow EquipmentSlot

#### New Furniture item class

Follow Equipment, but piggyback on inventory UI.
Should have: FurnitureSlot, and effects on the skills.
Should have a key.

#### New BedChamber class

One bedchamber for every private chamber improvement.
Bedchamber have:
- furniture_map (slot to furniture)
- option_map
- slaver (owner): defaults to you
- duties

methods:
- getSlaver()
- getSlaves()
- setSlaver(slaver)   (replace slaver with someone else. remember to call from $company when slaver is removed from your company)
- getFurniture(slot)
- getOption(option_name)  (option_name have a mapping from program name to human name)
- (Setting option done via same as settings, so directly)
- setFurniture(furniture)  (will substract furniture)
- removeFurniture(slot)  (will return furniture back to inventory)
- getSkillAddition()  (return total skill addition to whichever slaver owns this. Remember to call this from slaver skill calculation)
- autoSetOptions(unit)  (auto set rules based on unit's personalities)

#### New BedChamberList class

List of owned bedchambers.

methods:
- newBedchamber()
- getBedchambers()
- getBedchambers({slaver: unit})  // return bedchambers owned by unit


#### Save compatility

Don't forget to update save magi.


## Twee logic changes

### Init variables

Init furnitureslot, furniture, bedchamber, bedchamberlist.
Ensure backwards compatibility.

### Write new improvements

Just one improvement, the private chamber, upgradable 50 times.
Upgrades should be expensive.
Each upgrade gives a new bedchamber (use qc.Function).

### Write new furniture slots

Nothing special.

### Write new furnitures

Write in placeholder for master furnitures too.

### Write in skeleton for bedchambers menu

- Lists the bedchambers
- Bedchamber card:
  - Has total bonuses
  - Can change furniture like in equipment menu
- Can (enter) a bedchamber
- Can (change owner)

On enter:

- If you are owner: can change options
- Reminder to assign slave via duties

### Inventory menu filter

Filters for inventory based on their item class.
Also furniture slot filter.

## Text changes

### Bedchamberlist menu

Flavor text on the bedchamber general area

### Bedchamber menu

Flavor text:
Slave descriptions (two) and what they are wearing.
(Using rules, describe what they are doing).
These rules are repeated in slave description.

Go through furniture.
E.g.,
The slaves sleep <<in a box>>.
Flavor texts are written directly in file, since they are not used anywhere else.

Owner information
They are owned by xxx.
If not you: Based on rules, describe what XXX likes to do.
If you: Describe what the slavers do based on your rules.


### Upgrade unit description

Say who owns them and what slaves they own in their description.
No need to do it in their cards.

