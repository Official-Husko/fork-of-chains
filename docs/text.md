# 📝 Content Creator Text Guideline

![Version: 1.0](https://img.shields.io/badge/Version-1.0-green) ![Last  Updated: 2025-06-27](https://img.shields.io/badge/Last%20Updated-27--06--2025-blue)

Welcome to the **Fort of Chains: Galvanized** content creation guide! This document introduces extra commands and macros to help you write immersive, dynamic content for the game. All names and references are preserved as required.

> **Tip:** This guide uses [Twine](https://twinery.org/) and [SugarCube 2](http://www.motoslave.net/sugarcube/2/docs/) macros. For more, see the [SugarCube documentation](http://www.motoslave.net/sugarcube/2/docs/).

---

## 📚 Quick Reference Table

| Macro / Command         | Description                        | Example Output         |
|------------------------|------------------------------------|-----------------------|
| `<<Rep $g.bob>>`       | Name (You/Bob/Alice)               | Bob / You             |
| `<<yourrep>>`          | Your title or you                  | your evil slaver Bob / you |
| `<<theslaver>>`        | The slaver or you                  | the slaver / you      |
| `<<therace>>`          | The race or you                    | the neko / you        |
| `<<name $g.bob>>`      | Name only                          | Bob                   |
| `<<uadv $g.bob>>`      | Random adverb (personality)        | fiercely              |
| `<<uadjper $g.bob>>`   | Random adjective (personality)     | chaste                |
| `<<they $g.bob>>`      | Gendered pronoun                   | he / she / you        |
| `<<udick $g.bob>>`     | Trait-based                        | large dick            |
| `bob\|kiss`            | Present tense verb                 | kiss / kisses         |
| `bob\|is`              | is/are (subject)                   | is / are              |
| `bob\|was`             | was/were (subject)                 | was / were            |

---

## 🛠️ Custom Command List

### 🧰 General Helper

```twine
<<set _dom = setup.selectUnit([$g.healer, $g.tank, $g.dps], {trait: 'per_dominant'})>>
<<if _dom>>
  <<Rep _dom>> is a dominant unit among healer, tank, dps.
<</if>>
```

---

### 🚻 Gender-based Macros

| Macro | Output | Macro | Output |
|-------|--------|-------|--------|
| `<<rep $g.bob>>` | you/Bob/Alice | `<<Rep $g.bob>>` | You/Bob/Alice |
| `<<reps $g.bob>>` | your/Bob's/Alice's | `<<Reps $g.bob>>` | Your/Bob's/Alice's |
| `<<they $g.bob>>` | you/he/she | `<<They $g.bob>>` | You/He/She |
| `<<them $g.bob>>` | you/her/him | `<<Them $g.bob>>` | You/Her/Him |
| `<<their $g.bob>>` | your/her/his | `<<Their $g.bob>>` | Your/Her/His |
| `<<theirs $g.bob>>` | yours/hers/his | `<<Theirs $g.bob>>` | Yours/Hers/His |
| `<<themself $g.bob>>` | yourself/himself/herself | `<<Themself $g.bob>>` | Yourself/Himself/Herself |
| `<<themselves $g.bob>>` | yourselves/himselves/herselves | `<<Themselves $g.bob>>` | Yourselves/Himselves/Herselves |
| `<<wife $g.bob>>` | wife/husband | `<<woman $g.bob>>` | woman/man |
| `<<girl $g.bob>>` | girl/boy | `<<daughter $g.bob>>` | daughter/son |
| `<<mistress $g.bob>>` | master/mistress | `<<guy $g.bob>>` | guy/girl |
| `<<Mistress $g.bob>>` | Master/Mistress | `<<beauty $g.bob>>` | beauty/handsomeness |
| `<<wet $g.bob>>` | wet/hard | `<<lady $g.bob>>` | lady/lord |
| `<<princess $g.bob>>` | princess/prince | `<<female $g.bob>>` | female/male |
| `<<lass $g.bob>>` | lass/lad | `<<queen $g.bob>>` | king/queen |
| `<<beautiful $g.bob>>` | beautiful/handsome |  |  |

---

### 🔀 Conditionals

- **Trait-based:** `<<if $g.bob.isHasTrait('muscle_strong')>><</if>>`
- **Friendship:** `<<if $friendship.getFriendship($g.bob, $g.alice) < 500>><</if>>`  (Below 50.0)

---

### 🦾 Bodyparts Macros

| Macro | Output | Macro | Output |
|-------|--------|-------|--------|
| `<<urace $g.bob>>` | neko | `<<uweapon $g.bob>>` | sword |
| `<<ugenital $g.bob>>` | large dick and balls / gaping vagina | `<<utorso $g.bob>>` | muscular furry body |
| `<<uback $g.bob>>` | muscular back | `<<ubelly $g.bob>>` | six packs |
| `<<uwaist $g.bob>>` | narrow waist | `<<uhead $g.bob>>` | head |
| `<<uface $g.bob>>` | handsome face | `<<umouth $g.bob>>` | draconic mouth |
| `<<ueyes $g.bob>>` | cat-like eyes | `<<uears $g.bob>>` | elven ears |
| `<<uteeth $g.bob>>` | fangs | `<<uhorns $g.bob>>` | demonic horns |
| `<<ubreasts $g.bob>>` | manly chest | `<<ucleavage $g.bob>>` | flat/pec cleavage |
| `<<uneck $g.bob>>` | thick neck | `<<uwings $g.bob>>` | draconic wings |
| `<<uarms $g.bob>>` | muscular arms | `<<uhands $g.bob>>` | hands/paws |
| `<<ulegs $g.bob>>` | slim legs | `<<ufeet $g.bob>>` | digitigrade feet |
| `<<utail $g.bob>>` | draconic tail | `<<udick $g.bob>>` | large dick |
| `<<ucum $g.bob>>` | cum/pussyjuice | `<<udickorstrap $g.bob>>` | large dick/strap-on |
| `<<uballs $g.bob>>` | large balls | `<<uvagina $g.bob>>` | gaping vagina |
| `<<uanus $g.bob>>` | gaping anus | `<<uhole $g.bob>>` | gaping anus/vagina |
| `<<unipples $g.bob>>` | nipple |  |  |

---

### ✨ Adverbs & Adjectives

| Macro | Output |
|-------|--------|
| `<<uadjphys $g.bob>>` | muscular |
| `<<uadjper $g.bob>>` | smart |
| `<<uadj $g.bob>>` | smart |
| `<<uadv $g.bob>>` | smartly |
| `<<uadvcare $g.bob>>` | gently |
| `<<uadvabuse $g.bob>>` | violently |
| `<<uadjgood $g.bob>>` | smart (good) |
| `<<uadjbad $g.bob>>` | dumb (bad) |
| `<<uequip $g.bob 'legs'>>` | normal pants |

---

### 🛏️ Furniture Macros

| Macro | Output |
|-------|--------|
| `<<uslaverbed $g.bob>>` | luxury bed |
| `<<uslavebed $g.bob>>` | gilded cage |
| `<<ufoodtray $g.bob>>` | dog bowl |
| `<<udrinktray $g.bob>>` | cup |
| `<<ureward $g.bob>>` | ball |
| `<<upunishment $g.bob>>` | x cross |
| `<<ulighting $g.bob>>` | candle |
| `<<utile $g.bob>>` | carpet |
| `<<uobject $g.bob>>` | statue |
| `<<uwall $g.bob>>` | painting |

---

### 🛡️ Equipment & Stripping

| Macro | Output |
|-------|--------|
| `<<uceyes $g.bob>>` | blindfold/cat-like eyes |
| `<<ucbreasts $g.bob>>` | shirt/manly chest |
| `<<ucneck $g.bob>>` | cape/neck |
| `<<ucarms $g.bob>>` | gloves/arms |
| `<<uclegs $g.bob>>` | pants/legs |
| `<<ucfeet $g.bob>>` | boots/feet |
| `<<ucgenital $g.bob>>` | chastity cage/dick/pussy |
| `<<uctorso $g.bob>>` | shirt/furry body |
| `<<ucmouth $g.bob>>` | ball gag/mouth |

**Stripping Macros:**

- `<<ustriptorso $g.bob>>`: "John took off his shirt."
- `<<ustriplegs $g.bob>>`: "John pulls down his pants, then discards his boxers."
- `<<ustripanus $g.bob>>`: "John took out his buttplug."
- `<<ustripvagina $g.bob>>`: "Alice took out her dildo."
- `<<ustripdick $g.bob>>`: "You unlock John's chastity cage."
- `<<ustripnipple $g.bob>>`: "John took off his nipple clamps."
- `<<ustripmouth $g.bob>>`: "John took off his gag."
- `<<uslaverstripall $g.bob>>`: "Your slavers removed the bondage gear from John, leaving them naked."

**Equipment Checks:**

- `<<if setup.Text.Unit.Equipment.isChestCovered($g.bob)>><</if>>`
- `<<if setup.Text.Unit.Equipment.isGenitalCovered($g.bob)>><</if>>`
- `<<if setup.Text.Unit.Equipment.isNaked($g.bob)>><</if>>`
- `<<if setup.Text.Unit.Equipment.isFaceCovered($g.bob)>><</if>>`

---

### 🗨️ Sentences & Dialogue

| Macro | Output |
|-------|--------|
| `<<upunishreason $g.bob>>` | Bob failed at their job |
| `<<uinsult $g.bob $g.alice>>` | "You will never be anything but a slave!" |
| `<<uneedrescue $g.bob>>` | Hearing the news, you sighed as you order your rescuer Lily to get to work finding bob |
| `<<urescuenow $g.bob>>` | Hearing the news, you sighed as you immediately get to work locating the slaver back to rescue. |
| `<<ubantertraining $g.bob>>` | John walks on all four like a good dog. |
| `<<ugreetingshort $g.bob $g.alice>>` | Hey Alice, |
| `<<ugreetingfull $g.bob $g.alice>>` | Hey Alice, how are you? |
| `<<unickname $g.bob $g.alice>>` | cutey |
| `<<unicknamebad $g.bob $g.alice>>` | gaping bitch |
| `<<ugreetingshort $g.bob>>` | Hey boss, |
| `<<ugreetingfull $g.bob>>` | Hey boss, how are you? |
| `<<unickname $g.bob>>` | boss |
| `<<unicknamebad $g.bob>>` | gaping bitch |
| `<<ubusyshort $g.bob>>` | Hey boss, sorry but I'm a bit busy right now |
| `<<upetwhine $g.bob>>` | Yelp...! |
| `<<uyesmaster $g.bob>>` | Yes, master... |

---

### 🏷️ Others

| Macro | Output |
|-------|--------|
| `<<titlelow $g.bob>>` | generalist/defiant slave |
| `<<ufriend $g.bob $g.alice>>` | friend |
| `<<utheirrel $g.bob $g.alice>>` | his sister |
| `<<unamerel $g.bob $g.alice>>` | Bob's sister |
| `<<yourrep $g.bob>>` | your lazy Doctor Bob / you |
| `<<Yourrep $g.bob>>` | Your lazy Doctor Bob / You |
| `<<theslaver $g.bob>>` | the slaver / you |
| `<<Theslaver $g.bob>>` | The slaver / You |
| `<<therace $g.bob>>` | the neko / you |
| `<<Therace $g.bob>>` | The neko / You |

---

## 👤 Referring to Non-Actors

- **Player Character:** `<<rep $unit.player>> enjoys drinking on <<their $unit.player>> own.`
- **Duty Slaver:**
  - `<<set _duty = setup.getDutySlaver()>>` (random slaver on duty)
  - `<<set _duty = setup.getDutySlaver('viceleader', 'marketer', 'insurer')>>` (preference order)
- **Company:** `All hail the glorious company <<rep $company.player>>!`
- **Variables:** `$varstore.get('variable_name')`  
  Example: `<<if $varstore.get('your_quest_name_decision') == 'revenge'>>Back then, I swore to avenge the dead.<</if>>`
- **Banned Content:** `<<if $settings.bannedtags.watersport>>No watersport<<else>>Yes watersport<</if>>`
- **Improvements:** `<<if $fort.player.isHasBuilding('veteranhall')>>The veteran hall stood proudly over your fort<</if>>`
- **Other:**
  - Money: `<<if $company.player.getMoney() < 500>>You are broke<</if>>`
  - Prestige: `<<if $company.player.getPrestige() > 10>>"Wonderful place you live in", said the orc.<</if>>`

---

## 💡 Hints & Best Practices

- Use `<<set>>` to simplify your text. Example:

```twine
<<set _p = $unit.player>>
<<set _exp = $g.explorer>>
<<set _doc = $dutylist.getUnitIfAvailable('doctor')>>

<<if _doc>>
  Your <<rep _doc>> administered a bitter remedy to heal <<rep _exp>>'s wounds.
  "Did <<rep _p>> ask you to do this?", wondered <<rep _exp>> aloud.
<<else>>
  With no doctor around, it is up to you to administer the bitter remedy to <<rep _exp>>.
  You see <<their _exp>> face grimace as the healing takes effect.
<</if>>
```
