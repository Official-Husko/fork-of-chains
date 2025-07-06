// @ts-nocheck

/**
 * @param {setup.Unit} me 
 * @param {setup.Unit} them 
 * @param {setup.SexInstance} sex 
 * @param {boolean} is_deepthroat
 * @returns {string}
 */
function rawPenisMouthSizeDifference(me, them, sex, is_deepthroat) {
  const post = setup.SexText.postThought(them, sex)

  let fully = ''
  let entire = ''
  let throat = 'mouth'
  let downtheirthroat = 'in b|their mouth'
  let deep = ''
  let deepthroat = 'swallow'
  if (is_deepthroat) {
    fully = setup.rng.choice([
      'fully',
      'entirely',
    ])
    entire = setup.rng.choice([
      `entire`,
      `full`,
    ])
    throat = 'throat'
    downtheirthroat = 'down b|their throat'
    deepthroat = `deep-throat`
    deep = 'deep'
  }



  const adj = setup.sexbodypart.penis.repSizeAdjective(me, sex)

  let theentirelengthof = ''
  if (is_deepthroat) theentirelengthof = `the entire ${adj} length of`

  // special cases
  if (me.isHasTrait('dick_titanic')) {
    if (them.isHasTrait('training_oral_master')) {
      return setup.rng.choice([
        `Despite the size of a|reps dick, a|they were able to slide it easily into b|reps masterful mouth, who employ many secret oral techniques to allow the ${adj} member to ${fully} invade b|their mouth.`,
        `Thanks to b|reps masterful oral skill, b|rep b|is able to swallow ${theentirelengthof} a|reps hard-on.`,
        `It should have been impossible for any normal whore to swallow a dick as big as a|reps, but b|rep is a masterful oral slut, and knows many secret techniques required to swallow
        ${theentirelengthof} a|reps shaft.`,
      ])
    } else if (them.isHasTrait('training_oral_advanced')) {
      return setup.rng.choice([
        `a|Reps ${adj} dick is simply way too big, and it took a|them some effort to slide it ${fully} inside b|reps experienced mouth.`,
        `Despite b|reps oral trainings, a|reps ${adj} dick is simply too big and it requires both participants a lot of efforts to fit the massive thing ${fully} inside b|them.`,
        `No amount of oral training could have prepared anyone, including b|rep and b|their extensive oral knowledge,
        to be able to fit the ${entire} massive thing inside b|their mouth.`
      ])
    }
  }

  const base = setup.sexbodypart.mouth.repSizeModifier(them, sex)

  let story = base

  let t = []

  let compat = setup.sexbodypart.penis.getAccomodatingValue(me, them, setup.sexbodypart.mouth, sex)

  if (compat == 0) {
    t = [
      ` b|they b|is able to easily swallow a|reps ${entire} a|dick ${downtheirthroat}.`,
      ` a|reps a|dick ${fully} a|slide in effortlessly into the warm ${throat}.`,
      ` a|rep effortlessly a|shove in ${theentirelengthof} a|their a|dick into the warm ${throat}.`,
      ` a|rep can easily a|thrust ${theentirelengthof} a|their a|dick in and out of the warm ${throat}.`,
    ]
  } else if (compat == 1) {
    t = [
      ` a|rep a|is able to forcefully shove ${theentirelengthof} a|their a|dick down b|reps ${throat}.`,
      ` with some great efforts, b|rep b|is able to ${deepthroat} the entire length of a|reps a|dick.`,
      ` after some struggling, a|rep a|manage to insert their entire a|dick past b|reps lips and into b|reps ${throat}.`,
      ` after some forceful thrusts, a|rep a|gasp as a|they a|feel ${theentirelengthof} a|their a|dick being swallowed by b|reps b|mouth.`
    ]
  } else {
    t = [
      ` a|rep a|have to forcefully and painfully a|shove a|their a|dick ${deep} down b|reps insufficiently large mouth.`,
      ` a|reps a|dick touches the walls of b|reps mouth as it is forcefully inserted ${deep} inside b|their mouth.`,
      ` b|rep struggle and beg all the while b|their ${throat} is being forcefully penetrated by the way-to-large a|dick.`,
      ` without any regard for b|reps pleas, a|rep forcefully a|thrust ${theentirelengthof} a|their a|dick ${downtheirthroat}.`,
    ]
  }

  story += setup.rng.choice(t)
  return story
}

/**
 * Describes unit sliding their cock inside their mouth all the way
 * @param {setup.Unit} me 
 * @param {setup.Unit} them 
 * @param {setup.SexInstance} sex 
 */
export function penisMouthSizeDifferenceDeep(me, them, sex) {
  const raw_story = rawPenisMouthSizeDifference(me, them, sex, /* is deep throat = */ true)
  return setup.SexUtil.convert(raw_story, { a: me, b: them }, sex)
}


/**
 * Describes unit sliding their cock inside their mouth all the way
 * @param {setup.Unit} me 
 * @param {setup.Unit} them 
 * @param {setup.SexInstance} sex 
 */
export function penisMouthSizeDifferenceRegular(me, them, sex) {
  const raw_story = rawPenisMouthSizeDifference(me, them, sex, /* is deep throat = */ false)
  return setup.SexUtil.convert(raw_story, { a: me, b: them }, sex)
}


/* FOR THIS FUNCTION, TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA: getTargetedCharacterReceivingResponse */

/**
 * Describes reaction of receiving a blowjob.
 * @param {setup.Unit} me  giving blowjob
 * @param {setup.Unit} them   receive blowjob
 * @param {setup.SexInstance} sex 
 */
export function blowjobReaction(me, them, sex) {
  const mypace = sex.getPace(me)
  const thempace = sex.getPace(them)

  let t
  if (thempace == setup.sexpace.resist) {
    t = [
      ` Failing to pull b|their b|dick away from a|reps mouth, b|rep b|let out b|a_sob as b|they weakly b|try to struggle free.`,
      ` b|A_sob bursts out from between b|reps lips as b|they weakly b|try to push a|rep away, squirming and protesting as a|rep a|continue to force b|their b|dick deep into a|their throat.`,
      ` Sobbing in distress, b|rep b|try, in vain, to pull b|their b|dick away from a|reps mouth.`,
    ]
  } else if (thempace == setup.sexpace.normal || thempace == setup.sexpace.sub) {
    t = [
      ` b|Rep b|eagerly b|slide b|their b|dick deep into a|reps throat, letting out a soft, muffled moan as b|they b|receive b|their blowjob.`,
      ` A muffled moan drifts out from b|reps mouth, before b|they b|start b|eagerly sliding b|their b|dick deep into a|reps throat.`,
      ` Moaning in delight, b|rep b|eagerly b|slide b|their b|dick deep into a|reps throat.`
    ]
  } else if (thempace == setup.sexpace.dom) {
    t = [
      ` b|Rep violently b|thrust b|their b|dick deep into a|reps throat, letting out a muffled moan as b|they b|receive b|their blowjob.`,
      ` A muffled moan drifts out from b|reps mouth, before b|they b|start violently thrusting b|their b|dick deep into a|reps throat.`,
      ` Moaning in delight, b|rep roughly b|slam b|their b|dick as deep as possible into a|reps throat.`,
      ` Enjoying the submissive mouth on b|their b|dick, b|rep roughly b|shove b|their b|dick even deeper inside the willing b| mouth.`,
      ` Enjoying the feeling of a|reps a|mouth servicing b|their b|dick, b|rep b|let out an approving moan while commanding a|rep to continue the oral service.`,
    ]
  } else if (thempace == setup.sexpace.mindbroken) {
    t = [
      setup.SexUtil.mindbrokenReactionDespite(them, sex, [
        `Despite having a mouth choking deep in b|their b|dick`,
        `Even with all the attention showered on b|their b|dick`,
      ]),
      `As b|they b|is mindbroken, b|they b|do not respond to a|reps command.
       a|Rep a|have no choice but to grab b|them and a|give b|them a good hard throat fuck.`,
    ]
  } else {
    t = [
      ` Unsure what b|they did to deserve a reward, b|rep tentatively b|thrust b|their b|dick deep into a|reps throat, letting out a muffled moan as b|they b|receive b|their blowjob.`,
      ` A muffled moan bursts out from b|reps mouth, before b|they b|start thrusting b|their b|dick deep into a|reps throat, forgetting the facts about b|their current lot in life for the time being.`,
      ` Moaning in unexpected delight, b|rep b|slide b|their b|dick deep into a|reps throat, knowing the opportunity would be rare.`,
    ]
  }

  return setup.SexUtil.convert(t, { a: me, b: them }, sex)
}


/**
 * Describes reaction of giving a blowjob.
 * @param {setup.Unit} me  giving blowjob
 * @param {setup.Unit} them   receive blowjob
 * @param {setup.SexInstance} sex 
 */
export function giveBlowjobReaction(me, them, sex) {
  const mypace = sex.getPace(me)
  const thempace = sex.getPace(them)

  let t
  if (thempace == setup.sexpace.resist) {
    t = [
      ` Desperately trying, and failing, to pull back from a|reps a|dick, b|rep b|let out b|a_sob, tears streaming down b|their b|face as b|they weakly b|make muffled noises of protest.`,
      ` A muffled sob escapes from b|reps mouth as b|they weakly b|try to pull back, tears streaming down b|their b|face as a|reps a|dick continues sliding back and forth past b|their lips.`,
      ` Sobbing in distress, and with tears running down b|their b|face, b|rep weakly b|struggle against a|rep as b|they b|make muffled noises of protest.`,
      ` With b|their b|mouth being forced to service a|reps member, b|rep b|let out a sob in between the forced blowjob.`,
      ` As the smell of a|reps a|dick assaults b|reps nose, b|they b|let out a cry as the reality of what b|they b|is doing start to sink in.`,
      ` As the a|dick continnue to slide inside and out from b|their throat, b|rep can b|feel b|their resistance breaking down little by little.`,
    ]
  } else if (thempace == setup.sexpace.normal || thempace == setup.sexpace.sub) {
    t = [
      ` b|Rep b|eagerly b|wrap b|their lips around a|reps a|dick, letting out a very muffled moan as b|they b|eagerly b|bob b|their head up and down.`,
      ` A very muffled moan drifts out from b|reps mouth, and, b|eagerly wrapping b|their lips around a|reps a|dick, b|they b|eagerly b|continue to give a|them head.`,
      ` Moaning in delight, b|rep b|eagerly b|wrap b|their lips around a|reps a|dick, b|eagerly licking and sucking a|their a|dick as b|they b|continue making muffled moaning noises.`,
      ` b|Rep b|eagerly b|suck at the a|dick lodged inside b|their b|mouth, letting a|them know that b|they
      is enjoying and deriving pleasure from the submissive act.`,
    ]
    if (them.isHasTrait('training_oral_advanced')) {
      t.push(` a|They a|moan in pleasure as b|rep b|give an excellent head, caressing every part of the a|dick with b|their lips and b|their tongue.`)
    }
  } else if (thempace == setup.sexpace.dom) {
    t = [
      ` b|Rep forcefully b|grip b|their lips down around a|reps a|dick, letting out a very muffled moan as b|they roughly b|bob b|their head up and down.`,

      ` A very muffled moan drifts out from b|reps mouth, and, forcefully wrapping b|their lips around a|reps a|dick, b|they roughly b|continue to give a|them head.`,

      ` Moaning in delight, b|rep roughly b|grip b|their lips down around a|reps a|dick, forcefully licking and sucking a|their a|dick as b|they b|continue making muffled moaning noises.`,

      ` With a proesting yelp, b|rep b|decide to steel b|themself and b|start to angrily suck on a|reps a|dick that is currently stuck in b|reps b|mouth.`,

      ` Flashing b|their b|teeth at a|them, b|rep b|warn a|them that b|they b|is still in control before b|they b|start aggresively sucking the a|dick lodged inside b|their b|mouth.`,
    ]
  } else if (thempace == setup.sexpace.mindbroken) {
    t = [
      setup.SexUtil.mindbrokenReactionNoun(them, sex, [
        `the a|dick shoved down b|their throat`,
        `the a|dick lodged inside b|their b|mouth`,
        `a|reps a|dick filling b|their mouth full`,
        `the a|dick filling b|their a|mouth full`,
      ]),
    ]
  } else {
    const topic = setup.Text.Banter._getTopic()
    t = [
      ` b|Rep meekly b|wrap b|their lips around a|reps a|dick, before forcing b|themself to bob b|their head up and down.`,
      ` A muffled sob drifts out from b|reps mouth, who b|have no choice but to wrap b|their lips around a|reps a|dick and b|continue to give a|them head.`,
      ` Without saying anything, b|rep b|wrap b|their lips around a|reps a|dick, licking and sucking a|their a|dick while trying to shut the disgust by thinking about ${topic}.`,
      ` b|Rep wordlessly and almost mechanically b|suck at the a|dick, forcing b|their head deep and out while obviously struggly to suppress b|their disgust.`,
    ]
  }

  return setup.SexUtil.convert(t, { a: me, b: them }, sex)
}
