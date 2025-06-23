## Roadmap

This is the development roadmap of this game.

### v0.0.x

COMPLETED. Brainstorming ideas and features that should be in the game.
Coming up with core gameplay loop, progression method, and features.

### v0.1.x - v0.5.x

COMPLETED. Making engine sufficient to implement all the content.

### v0.6.x - v0.8.x

COMPLETED. Content that will NOT grow over time. Buildings, traits, races, actions, scouting missions,
etc.

### v0.9.x

COMPLETED. Sufficient content to enable balancing. At least one quest in each level from level 1
through level 50-60.

### v0.10.x

COMPLETED. Balancing. Finalizing exp and money formula, balancing all three main income methods,
balancing building prices. See [Balancing guide](docs/balancingroadmap.md).

### v0.11.x

COMPLETED. Sufficient content for a full playthrough. More quests that are relevant to the core gameplay loop such as
quests that give out slave orders and quest that make use of slaves.

### v0.12.x

COMPLETED. Polish. Flavor texts on seeing unit details and duties. Unit interactions (including sex scenes).
Details in [Polish roadmap](docs/polishroadmap.md)

### v1.0.x

IN PROGRESS.
Base game is complete.
Full focus on adding community-made content --- ideally there should not be any new features.

### v1.x.x

Unit group revamp
- Need to apply to opportunities
- Need to add to content creator
- Need to encompass both slavers and NPCs: either a list of restriction or a unit group object

Quest:
- piggyback to actor:
- actor: {'x': 'unitgroup', y: unitgroup.x, z: [res1, res2]}
- Quest will just best match restriction to the best of their ability. # MAY FAIL

Opportunity:
- use the same framework with quest
- reuse code to generate actors
- debug also reuse code

