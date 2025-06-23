## Content Creator Text Guideline

This document explains extra commands that are available for you to write.

In the Content Creation Tool, some of the content are written in the Twine and Sugarcube 2 language, which is
basically HTML but with extra commands.
See [here](http://www.motoslave.net/sugarcube/2/docs/) for SugarCube documentation.
While the in-game code editor allows inserting the vast majority of the macros into the game,
there are some macros and special shortcut commands that you can use to make it easier to write.
This document will give you the most important of these.

Suppose you have an actor named "bob". The various ways to refer to bob are:
- `<<Rep $g.bob>>` becomes "Bob" or You. Use `<<rep $b.bob>>` for "Bob" or you.
- `<<yourrep>>` becomes "your evil slaver Bob" or "you".
- `<<theslaver>>` becomes "the slaver", "the slave", or "you".
- `<<therace>>` becomes "the neko" or "you"
- `<<name $g.bob>>>` becomes "Bob"
- `<<uadv $g.bob>>` becomes fiercely (a random adverb based on Bob's personality).
- `<<uadjper $g.bob>>` becomes "chaste", "gregarious", etc (a random adjective based on Bob's personality). There are variants of this: `<<uadjgood>>` and `<<uadjbad>>` which always give a good adjective and bad adjective, respectively. (e.g., loyal and disloyal)
- `<<they $g.bob>>` becomes he, she, or you. See "Gender-based" below for a full list of gender-based commands.
- `<<udick $g.bob>>` becomes large dick. See "Trait-based" below for a full list of special trait commands.
- `<<if $g.bob.isHasTrait('race_demon')>>Bob is a demon<</if>>` [(All trait-based commands)](docs/traits.md)
- `bob|kiss` becomes kiss if bob is you, or kisses otherwise. In general, use this command to get present tense of verbs.
- `bob|is`, `bob|are`, `bob|was`, and `bob|were` also works, becoming is/are, and was/were, depending
on whether the subject is you or someone else.

## Custom command list

### General helper

Useful command to get any slaver among healer, tank, and dps with the dominant trait:
(see [here](docs/traits.md) for list of traits)

```
<<set _dom = setup.selectUnit([$g.healer, $g.tank, $g.dps], {trait: 'per_dominant'})>>
<<if _dom>>
  <<Rep _dom>> is a dominant unit among healer, tank, dps.
<</if>>
```

### Gender-based commands
- `<<rep $g.bob>>` (you/Bob/Alice)
- `<<Rep $g.bob>>` (You/Bob/Alice)
- `<<reps $g.bob>>` (your/Bob's/Alice's)
- `<<Reps $g.bob>>` (Your/Bob's/Alice's)
- `<<they $g.bob>>` (you/he/she),
- `<<They $g.bob>>` (You/He/She),
- `<<them $g.bob>>` (you/her/him),
- `<<Them $g.bob>>` (You/Her/Him),
- `<<their $g.bob>>` (your/her/his),
- `<<Their $g.bob>>` (Your/Her/His),
- `<<theirs $g.bob>>` (yours/hers/his),
- `<<Theirs $g.bob>>` (Yours/Hers/His),
- `<<themself $g.bob>>` (yourself/himself/herself),
- `<<Themself $g.bob>>` (Yourself/Himself/Herself),
- `<<themselves $g.bob>>` (yourselves/himselves/herselves),
- `<<Themselves $g.bob>>` (Yourselves/Himselves/Herselves),
- `<<wife $g.bob>>` (wife/husband),
- `<<woman $g.bob>>` (woman/man),
- `<<women $g.bob>>` (women/men),
- `<<girl $g.bob>>` (girl/boy),
- `<<daughter $g.bob>>` (daughter/son).
- `<<mother $g.bob>>` (mother/father).
- `<<mistress $g.bob>>` (master/mistress).
- `<<guy $g.bob>>` (guy/girl).
- `<<Mistress $g.bob>>` (Master/Mistress).
- `<<beauty $g.bob>>` (beauty/handsomeness).
- `<<wet $g.bob>>` (wet/hard)
- `<<lady $g.bob>>` (lady/lord)
- `<<princess $g.bob>>` (princess/prince)
- `<<female $g.bob>>`  (female/male)
- `<<lass $g.bob>>`  (lass/lad)
- `<<queen $g.bob>>`  (king/queen)
- `<<beautiful $g.bob>>`  (beautiful/handsome)


### Conditionals

- Based on traits, e.g., `<<if $g.bob.isHasTrait('muscle_strong')>><</if>>` (matches both muscle_strong and muscle_verystrong.
[(Full trait-based commands)](docs/traits.md)

- Based on friendship: `<<if $friendship.getFriendship($g.bob, $g.alice) < 500>><</if>>` means their friendship is below 50.0. (Note that the amount is multiplied by 10, so 50.0 becomes 500 here.)

### Bodyparts
- `<<urace $g.bob>>`: neko
- `<<uequipment $g.bob>>`: valuable slutty bondage armor
- `<<uweapon $g.bob>>`: sword (melee weapon, always exists)
- `<<uaweapon $g.bob>>`: a sword
- `<<ugenital $g.bob>>`: large dick and balls (or gaping vagina)
- `<<utorso $g.bob>>`: muscular furry body
- `<<uback $g.bob>>`: muscular back
- `<<ubelly $g.bob>>`: six packs
- `<<uwaist $g.bob>>`: narrow waist
- `<<uhead $g.bob>>`: head
- `<<uface $g.bob>>`: handsome face
- `<<umouth $g.bob>>`: draconic mouth
- `<<ueyes $g.bob>>`: cat-like eyes
- `<<uears $g.bob>>`: elven ears
- `<<uteeth $g.bob>>`: fangs
- `<<uhorns $g.bob>>`: demonic horns (currently only horn in the game, part of demonic ears)
- `<<ubreasts $g.bob>>`: manly chest
- `<<ucleavage $g.bob>>`: flat cleavage, or pec cleavage
- `<<uneck $g.bob>>`: thick neck
- `<<uwings $g.bob>>`: draconic wings
- `<<uarms $g.bob>>`: muscular arms
- `<<uhands $g.bob>>`: hands (or paws)
- `<<uhand $g.bob>>`: hand (or paw)
- `<<ulegs $g.bob>>`: slim legs
- `<<ufeet $g.bob>>`: digitigrade feet
- `<<utail $g.bob>>`: draconic tail
- `<<udick $g.bob>>`: large dick
- `<<ucum $g.bob>>`: cum (or pussyjuice if girl)
- `<<udickorstrap $g.bob>>`: large dick or strap-on if no dick
- `<<uballs $g.bob>>`: large balls
- `<<uvagina $g.bob>>`: gaping vagina
- `<<uanus $g.bob>>`: gaping anus
- `<<uhole $g.bob>>`: gaping anus (becomes vagina if bob is female)
- `<<unipples $g.bob>>`: nipple

### Adverbs and Adjectives

- `<<uadjphys $g.bob>>`: muscular   (random physical adjective)
- `<<uadjper $g.bob>>`: smart    (random adjective)
- `<<uadj $g.bob>>`: smart     (random adjective)
- `<<uadv $g.bob>>`: smartly   (random adverb)
- `<<uadvcare $g.bob>>`: gently (random adverb suitable for caring for a unit)
- `<<uadvabuse $g.bob>>`: violently (random adverb suitable for abusing a unit)
- `<<uadjgood $g.bob`>>: smart (random adjective, always good)
- `<<uadjbad $g.bob`>>: dumb  (random adjective, always bad)
- `<<uequip $g.bob 'legs'>>`: normal pants  (equipment on the bodypart, or just their legs if naked. Available
bodyparts: 'head', 'neck', 'torso', 'arms', 'legs', 'feet', 'eyes', 'mouth', 'nipple', 'rear', 'dick', 'vagina')

### Furniture

- `<<uslaverbed $g.bob>>`: luxury bed (bed in the bedchamber of the slave, if any, or the bedchamber of the slaver, if any. Same with all below)
- `<<uslavebed $g.bob>>`: gilded cage
- `<<ufoodtray $g.bob>>`: dog bowl
- `<<udrinktray $g.bob>>`: cup
- `<<ureward $g.bob>>`: ball
- `<<upunishment $g.bob>>`: x cross
- `<<ulighting $g.bob>>`: candle
- `<<utile $g.bob>>`: carpet
- `<<uobject $g.bob>>`: statue
- `<<uwall $g.bob>>`: painting

### Equipment and Stripping

- `<<uceyes $g.bob>>`: blindfold, or cat-like eyes if no eye equipment
- `<<ucbreasts $g.bob>>`: shirt, or manly chest / breasts if shirtless
- `<<ucneck $g.bob>>`: cape, or neck if no neck equipment
- `<<ucarms $g.bob>>`: gloves, or arms if no arms equipment
- `<<uclegs $g.bob>>`: pants, or legs if no legs equipment
- `<<ucfeet $g.bob>>`: boots, or feet if no fee tequipment
- `<<ucgenital $g.bob>>`: chastity cage / dildo, or dick / pussy if no genital equipment
- `<<uctorso $g.bob>>`: shirt, or furry body if shirtless
- `<<ucmouth $g.bob>>`: ball gag, or mouth if no mouth equipment

- `<<if setup.Text.Unit.Equipment.isChestCovered($g.bob)>><</if>>`
- `<<if setup.Text.Unit.Equipment.isGenitalCovered($g.bob)>><</if>>`
- `<<if setup.Text.Unit.Equipment.isNaked($g.bob)>><</if>>`
- `<<if setup.Text.Unit.Equipment.isFaceCovered($g.bob)>><</if>>`

All the stripping commands will return an empty string if the unit cannot be stripped for those part.

- `<<ustriptorso $g.bob>>`: "John took off his shirt."
- `<<ustriplegs $g.bob>>`: "John pull down his pants, then discard his boxers."
- `<<ustripanus $g.bob>>`: "John took out his buttplug."
- `<<ustripvagina $g.bob>>`: "Alice took out her dildo."
- `<<ustripdick $g.bob>>`: "You unlocks John's chastity cage."
- `<<ustripnipple $g.bob>>`: "John took of his nipple clamps."
- `<<ustripmouth $g.bob>>`: "John took of his gag."
- `<<uslaverstripall $g.bob>>`: "Your slavers removed the bondage gear from John, leaving them naked."

### Sentences

- `<<upunishreason $g.bob>>`: `Bob failed at their job`. Can be combined like thus: `You punish bob because <<upunishreason $g.bob>>`. Add more [here](src/scripts/text/sentence/punish.js)
- `<<uinsult $g.bob $g.alice>>`: `You will never be anything but a slave!`. Can be used like:
`Bob says to Alice: "<<uinsult $g.bob $g.alice>>"`. Add more [here](src/scripts/text/sentence/insult.js).
- `<<uneedrescue $g.bob>>`: `Hearing the news, you sighed as you order your rescuer Lily to get to work finding bob`. Can be combined like thus: `<<uneedrescue $g.bob>>, although considering the transformations <<they $g.bob>> went through, is it still worth it?`. Add more [here](src/scripts/text/sentence/rescue.js). Will handle corner cases (e.g., no rescuer, etc.)
- `<<urescuenow $g.bob>>`: `Hearing the news, you sighed as you immediately get to work locating the slaver back to rescue. If you are quick, you could get the slaver back`. Can be combined like thus: `<<urescuenow $g.bob>>, before worse come to pass.` Add more [here](src/scripts/text/sentence/rescue.js). Will handle escaped slave cases too.
- `<<ubantertraining $g.bob>>`: "John walks on all four like a good dog."
- `<<ugreetingshort $g.bob $g.alice>>`: "Hey Alice,"
- `<<ugreetingfull $g.bob $g.alice>>`: "Hey Alice, how are you?"
- `<<unickname $g.bob $g.alice>>`: "cutey"  (Bob's nickname for Alice)
- `<<unicknamebad $g.bob $g.alice>>`: "gaping bitch"  (Bob's bad nickname for Alice)
- `<<ugreetingshort $g.bob>>`: "Hey boss,"
- `<<ugreetingfull $g.bob>>`: "Hey boss, how are you?"
- `<<unickname $g.bob>>`: "boss"  (Bob's nickname for you)
- `<<unicknamebad $g.bob>>`: "gaping bitch"  (Bob's bad nickname for you)
- `<<ubusyshort $g.bob>>`: "Hey boss, sorry but I'm a bit busy right now"
- `<<upetwhine $g.bob>>`: "Yelp...!"
- `<<uyesmaster $g.bob>>`: "Yes, master..."

### Others
- `<<titlelow $g.bob>>`: generalist (or defiant slave)
- `<<ufriend $g.bob $g.alice>>`: friend (depends on the friendship between bob and alice)
- `<<utheirrel $g.bob $g.alice>>`: his sister (warning: can be empty if they have no relation / friendship)
- `<<unamerel $g.bob $g.alice>>`: Bob's sister (warning: can be empty if they have no relation / friendship)
- `<<yourrep $g.bob>>`: your lazy Doctor Bob / you
- `<<Yourrep $g.bob>>`: Your lazy Doctor Bob / You
- `<<theslaver $g.bob>>`: the slaver / you
- `<<Theslaver $g.bob>>`: The slaver / You
- `<<therace $g.bob>>`: the neko / you
- `<<Therace $g.bob>>`: The neko / You

## Referring to non-actors

- Referring to player character: `<<rep $unit.player>> enjoys drinking on <<their $unit.player>> own.`

(You can check if you are a certain unit, e.g., <<if $unit.player == $g.explorer>>, but it's
generally too much work to create this variation and best ignored in most circumstances.
Pretend you are not the unit.
)

- Picking a unit on duty:
`<<set _duty = setup.getDutySlaver()>>` will assign
`_duty` to some slaver on duty.
You can give it a preference, e.g.,:
`<<set _duty = setup.getDutySlaver('viceleader', 'marketer', 'insurer')>>`
will give the vice leader if you have it, otherwise will give the marketer, otherwise insurer,
otherwise some random slaver on duty.
See [(full duty list)](docs/duty.md)

- Referring to company: `All hail the glorious company <<rep $company.player>>!`
[(List of companies)](docs/companies.md)

- Referring to variables: If you have set the value of some variables
via the content creator, you can get them with:
`$varstore.get('variable_name')`.
You can do things such as:
```<<if $varstore.get('your_quest_name_decision') == 'revenge'>>Back then, I swore to avenge the dead.<</if>>```

- Referring to banned contents
```<<if $settings.bannedtags.watersport>>No watersport<<else>>Yes watersport<</if>>```
List of tags are [here](src/scripts/classes/quest/questtags.js)

- Whether certain improvement exists
  ```<<if $fort.player.isHasBuilding('veteranhall')>>The veteran hall stood proudly over your fort<</if>>```
  See the in-game Database for the list of all buildings/improvements as well as their keys
  (the `veteranhall` above is the key of the Veteran Hall building).

- Referring to other things:
  - Money: `<<if $company.player.getMoney() < 500>>You are broke<</if>>`
  - Prestige: `<<if $company.player.getPrestige() > 10>>"Wonderful place you live in", said the orc.<</if>>`

## Some hints

- You can use `<<set>>` to make it easier to write your text. For example:

```
<<set _p = $unit.player>>
<<set _exp = $g.explorer>>
<<set _doc = $dutylist.getUnitIfAvailable('doctor')>>

<<if _doc>>
  Your <<rep _doc>> administered a bitter remedy to heal <<rep _exp>>'s wounds.
  "Did <<rep _p>> asks you to do this?", wondered <<rep exp>> aloud.
<<else>>
  With no doctor around, it is up to you to administer the bitter remedy to <<rep _exp>>.
  You see <<their _exp>> face grimaces as the healing take effect.
<</if>>
```

