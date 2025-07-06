// @ts-nocheck

/**
 * @param {setup.Unit} me 
 * @param {setup.SexBodypart} my_bodypart
 * @param {setup.Unit} them 
 * @param {setup.SexBodypart} their_bodypart
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
function rawPhallusHoleSizeDifferenceStart(me, my_bodypart, them, their_bodypart, sex) {
  const mysize = my_bodypart.getSize(me)
  const theirsize = their_bodypart.getSize(them)
  const accom = my_bodypart.getAccomodatingValue(me, them, their_bodypart)

  // special cases
  const mysimple = my_bodypart.repSimple(me)
  const myadj = my_bodypart.repSizeAdjective(me, sex)

  const theirsimple = their_bodypart.repSimple(them)
  const theiradj = their_bodypart.repSizeAdjective(them, sex)

  const dick = my_bodypart.rep(me, sex)
  const hole = their_bodypart.rep(them, sex)
  const fuck = my_bodypart.repFuck(me, sex)

  let t
  let story = ''
  if (mysize >= 6) {
    if (theirsize >= 6) {
      t = [
        `a|Reps ${mysimple} is simply too big,
         and not even b|rep with b|their ${hole} is sufficient to comfortably accomodate the ${myadj} thing.`,
        `Not even b|reps ${hole} is sufficient to fully and comfortably accomodate the ${myadj} monster that is a|reps ${mysimple}.`,
        `a|Reps ${mysimple} is so ${myadj} that even though b|reps ${theirsimple} is already ${theiradj},
         it won't be enough to accomodate the ${mysimple}.`,
      ]
    } else if (theirsize >= 4) {
      t = [
        `a|Reps ${mysimple} is simply too big,
         and while b|reps ${hole} has a chance to accomodate it, the experience is surely going to be unpleasant.`,
        `The ${dick} of a|reps is way too big, and it will require tremedous efforts from both a|rep and
         b|rep if a|they ever a|want to get that thing inside of b|rep.`,
        `b|Reps ${hole} has certainly seen some use, but nothing that could have prepared it for the invasion of a|their ${dick}.`,
      ]
    } else {
      t = [
        `a|Reps ${mysimple} is ${myadj}, and who knows what might happen if a|rep a|decide to shove
         the ${myadj} thing inside b|reps ${hole}...`,
        `Inserting the ${myadj} thing into the b|reps still ${hole} is going to be an experience
         to watch, as there is just no way b|their ${theirsimple} is going to be able to accomodate that...`,
        `If a|rep really a|want to shove a|their ${dick} inside the tight little hole of b|theirs,
         a|rep will have to really, really force the ${myadj} thing in, one inch at a time.`,
        `Given the sheer size difference between a|reps ${dick} and b|reps ${hole}, b|rep would be very lucky indeed
         if b|they can still use b|their ${theirsimple} after this...`
      ]
    }

  } else {
    // tease difference in size

    if (mysize > theirsize + 2) {
      t = [
        `Looking at a glance, a|reps ${dick} is way too big to fit inside b|reps ${hole}.`,
        `Judging from the sizes, there is just no way that b|reps ${hole}
         can accomodate the comparatively enormous ${mysimple}.`,
        `The ${dick} looms menacingly over b|reps ${hole}.`,
        `The ${dick} shadows over b|reps ${hole}, unsure if it could actually be made to fit in.`,
        `b|Reps ${hole} is not meant to accomodate a ${mysimple} as thick as a|reps ${mysimple}, but b|rep will just have to find a way.`,
        `b|Reps ${hole} is pleasingly tight compared to the ${myadj} size of a|reps ${mysimple}, which is certainly nice for a|rep but less so for b|rep.`,
      ]
    } else if (mysize < theirsize - 2) {
      t = [
        `The a|reps ${dick} will surely slide inside b|reps ${hole}.`,
        `There shouldn't be a single problem inserting a|reps ${dick} into b|reps ${hole}.`,
        `b|Reps ${hole} is much more than adequate to accomodate the entire length of a|reps ${dick}.`,
        `From a glance, a|rep should have no trouble fully penetrating b|reps ${hole}.`,
        `a|Reps ${dick} will probably find zero resistance forcing its way inside b|rep.`,
      ]
    } else {
      t = [
        `The ${theirsimple} is just at the right size for a|reps ${dick} to enter.`,
        `a|Rep a|let out a moan as b|reps ${hole} is just the right size for a|their ${dick}.`,
        `The ${hole} comfortably accomodates a|reps ${dick} while still offering good stimulation.`,
        `As a|reps ${dick} slides in, the internal muscles of b|reps ${hole} contract, gripping the intruding ${mysimple}.`,
        `With a thrust, a|reps ${dick} is shoved inside the accomodating ${hole}, which is at just the perfect size for the ${mysimple}.`,
      ]
    }

  }

  story += setup.rng.choice(t) + ' '

  // give prospect of penetration
  const pre = their_bodypart.repSizeModifier(them, sex)

  if (accom == 0) {
    t = [
      `b|rep is unlikely to experience any pain or discomfort.`,
      `the experience will be quite pleasant for b|rep.`,
      `b|reps ${hole} should very easily accomodate the ${dick}.`,
      `the ${dick} should easily slide in and out of b|reps ${hole}.`,
    ]
  } else if (accom == 1) {
    t = [
      `b|rep will only experience minor discomfort.`,
      `the experience will not be very painful for b|rep.`,
      `b|reps ${hole} should comfortably accomodate the ${dick}.`,
      `the ${dick} should deliciously slide in and out of b|reps ${hole}.`,
    ]
  } else if (accom == 2) {
    t = [
      `it will be quite an experience for b|rep having a|reps ${dick} shoved inside b|them.`,
      `the experience will surely induce a lot of pain for b|rep.`,
      `b|reps ${hole} will be stretched to the limit to allow the ${dick} to violate b|them.`,
      `a|rep will need to thrust deep and hard to force a|their ${dick} inside of b|reps ${hole}.`,
    ]
  } else {
    t = [
      `there is no doubt b|rep will be left as a writhing mess once a|rep a|is done violating b|their ${theirsimple} with a|their ${dick}.`,
      `there will no doubt be a lot of painful screaming in the very near future.`,
      `b|reps ${hole} will probably be completely destroyed once a|rep a|is finished with b|them.`,
      `a|rep will simply need to keep b|rep in place, prevenging b|them from moving too much
         when b|they will no doubt soon writhe in pain as b|they are being brutally ${fuck}ed.`,
    ]
  }

  story += pre + ' ' + setup.rng.choice(t) + ' '
  return story

}

/**
 * Describes unit starting to slide their phallus inside the hole
 * @param {setup.Unit} me 
 * @param {setup.SexBodypart} my_bodypart
 * @param {setup.Unit} them 
 * @param {setup.SexBodypart} their_bodypart
 * @param {setup.SexInstance} sex 
 */
export function phallusHoleSizeDifferenceStart(me, my_bodypart, them, their_bodypart, sex) {
  const raw_story = rawPhallusHoleSizeDifferenceStart(me, my_bodypart, them, their_bodypart, sex)
  return setup.SexUtil.convert(raw_story, { a: me, b: them }, sex)
}


/**
 * @param {setup.Unit} me 
 * @param {setup.SexBodypart} my_bodypart
 * @param {setup.Unit} them 
 * @param {setup.SexBodypart} their_bodypart
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
function rawPhallusHoleSizeDifferenceOngoing(me, my_bodypart, them, their_bodypart, sex) {
  const mysize = my_bodypart.getSize(me)
  const theirsize = their_bodypart.getSize(them)
  const accom = my_bodypart.getAccomodatingValue(me, them, their_bodypart)

  // special cases
  const mysimple = my_bodypart.repSimple(me)
  const myadj = my_bodypart.repSizeAdjective(me, sex)

  const theirsimple = their_bodypart.repSimple(them)
  const theiradj = their_bodypart.repSizeAdjective(them, sex)

  const dick = my_bodypart.rep(me, sex)
  const hole = their_bodypart.rep(them, sex)
  const fuck = my_bodypart.repFuck(me, sex)

  let t = null
  let story = ''
  if (mysize >= 6 && theirsize >= 6) {
    t = [
      `Despite the ${myadj} size of a|reps ${mysimple}, b|reps ${theirsimple} is equally ${theiradj}, and is able to
         accomodate the entire length of a|reps members without too much discomfort.`,
      `a|Rep a|is blessed with ${setup.Article(myadj)} ${theirsimple}, which should actually be large enough
       to satisfy even b|rep with b|their ${hole}.`,
      `The sheer size of a|reps ${mysimple} would make any other whore tremble, but not b|rep and b|their
       equally ${hole}.`,
    ]
    if (them.isHasDick()) {
      t = t.concat([
        `The ${mysimple} ${myadj} size matches perfectly with b|reps ${hole}, allowing it to fully stimulate b|reps prostate.`,
      ])
    }
  } else {
    if (accom == 0) {
      t = [
        `b|Reps ${hole} is too big, and it diminish the amount of arousal a|rep a|get from the penetration.`,
        `a|Reps ${dick} slide in too easily into b|reps ${hole}, as if b|their ${theirsimple} was always made as a receptacle for ${mysimple}.`,
        `That ${hole} of b|reps accomodates all too easily b|reps ${dick}, which slides in and out without even needing a|rep to exert the slightest effort.`,
        `a|Rep all too easily a|push a|their ${dick} inside b|reps ${hole}, which make a|rep a|feel a little unsatisfied.`,
      ]
      if (them.isHasDick()) {
        t = t.concat([
          `a|Reps ${dick} is simply too small for the ${hole}, and it never reaches b|reps prostate deep within b|their b|ass.`,
        ])
      }
    } else if (accom == 1) {
      t = [
        `b|Reps ${hole} comfortably accomodates a|reps ${dick}, pleasuring both participants greatly.`,
        `a|Reps ${dick} is comfortably gripped by b|reps inner muscles, eliciting a|a_moan from a|rep.`,
        `a|Reps ${dick} fits perfectly inside b|rep, with the ${dick} accomodated by an equally up-to-task ${hole}.`,
        `The sound of a|reps ${dick} sliding and touching the inner walls of b|reps ${hole} brought a|rep closer to climaxing.`,
      ]
      if (them.isHasDick()) {
        t = t.concat([
          `a|Reps ${dick} is just at the right length and soon enough b|rep b|let out b|a_moan from having b|their prostate stimulated by the invading ${mysimple}.`,
        ])
      }
    } else if (accom == 2) {
      t = [
        `b|Rep b|shut b|their b|eyes as b|they b|is helpless to do anything but to accept the painful penetration on b|their ${hole}.`,
        `a|Reps ${dick} is a little too big for b|rep, and b|rep b|have to fight against sobbing throughout the penetration.`,
        `b|Rep b|let out a painful moan as b|their ${hole} is being stretched by the invading ${mysimple}.`,
        `a|Rep a|let out a|a_moan as a|they a|feel a|their ${dick} being gripped and stimulated very tightly by b|reps ${hole}.`,
      ]
      if (them.isHasDick()) {
        t = t.concat([
          `a|Reps ${dick} is too large for b|reps ${hole}, hitting b|their prostate almost immediately after the first thrust.`,
        ])
      }
    } else {
      t = [
        `b|Rep b|let out b|a_sob as b|they clenched b|their fists, trying to do whatever b|they can to mitigate the extremely painful penetration.`,
        `b|Rep b|beg for mercy as b|they b|feel b|their ${hole} being completely destroyed by a|reps ${dick} invading inside them.`,
        `b|Reps mind is completely overwhelmed by a combination of sheer pain and sheer pleasure from having b|their ${hole} being stretched to the limits by the invading ${mysimple}.`,
        `b|Reps ${hole} lets out a painful-sounding sound as it is being stretched way beyond what is natural by a|reps unnaturally big ${mysimple}.`,
      ]
      if (them.isHasDick()) {
        t = t.concat([
          `b|Rep b|let out a pained moan as they feel the ${dick} destroying b|their hole and b|their prostate at the same time.`,
        ])
      }
    }
  }

  story += setup.rng.choice(t) + ' '

  return story
}

/**
 * Describes unit inserting their shaft into another unit
 * @param {setup.Unit} me 
 * @param {setup.SexBodypart} my_bodypart
 * @param {setup.Unit} them 
 * @param {setup.SexBodypart} their_bodypart
 * @param {setup.SexInstance} sex 
 */
export function phallusHoleSizeDifferenceOngoing(me, my_bodypart, them, their_bodypart, sex) {
  const raw_story = rawPhallusHoleSizeDifferenceOngoing(me, my_bodypart, them, their_bodypart, sex)
  return setup.SexUtil.convert(raw_story, { a: me, b: them }, sex)
}


/**
 * @param {setup.Unit} me 
 * @param {setup.SexBodypart} my_bodypart
 * @param {setup.Unit} them 
 * @param {setup.SexBodypart} their_bodypart
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
function rawPhallusHoleSizeDifferenceOngoingSub(me, my_bodypart, them, their_bodypart, sex) {
  const mysize = my_bodypart.getSize(me)
  const theirsize = their_bodypart.getSize(them)
  const accom = my_bodypart.getAccomodatingValue(me, them, their_bodypart)

  // special cases
  const mysimple = my_bodypart.repSimple(me)
  const myadj = my_bodypart.repSizeAdjective(me, sex)

  const theirsimple = their_bodypart.repSimple(them)
  const theiradj = their_bodypart.repSizeAdjective(them, sex)

  const dick = my_bodypart.rep(me, sex)
  const hole = their_bodypart.rep(them, sex)
  const vaginal = their_bodypart.repVaginal(them, sex)
  const fuck = my_bodypart.repFuck(me, sex)

  let t = null
  let story = ''

  if (accom == 0) {
    t = [
      `Embarrasingly, b|reps ${hole} is far too big for the ${dick} and a|rep a|receive minimal stimulation.`,
      `a|Reps ${dick} does not make any sound as it effortlessly penetrate inside the ${hole}.`,
      `Given the enormously large ${theirsimple} compared to a|reps ${dick}, a|rep might as well ${fuck} at the air at this rate.`,
      `a|Reps ${dick} slides into b|rep almost without any resistance, which reduces the stimulation that a|rep would've received.`,
    ]
    if (them.isHasDick()) {
      t = t.concat([
        `Given the size of the ${mysimple}, a|rep a|have to give up having a|their prostate stimulated by it.`,
      ])
    }
  } else if (accom == 1) {
    t = [
      `b|Reps ${hole} comfortably press against a|reps ${dick}, pleasuring both participants greatly.`,
      `b|Reps inner ${vaginal} muscles reflexively gripped the ${dick}, eliciting b|a_moan from b|rep.`,
      `a|Reps ${hole} perfectly accomodates the ${dick}, having just the right amount of space and tightness.`,
      `Having b|their ${dick} buried in such a comfortable receptacle elicits b|a_moan from b|rep.`,
    ]
    if (them.isHasDick()) {
      t = t.concat([
        `a|Rep suddenlly a|let out a|a_moan as a|they can feel a|their prostate being stimulated.`,
      ])
    }
  } else if (accom == 2) {
    t = [
      `Despite the pain, the ${dick} manages to get shoved entirely inside b|reps ${hole}.`,
      `a|Reps ${dick} is a little too large for the ${hole}, and the penetration causes b|rep to let out a painful moan.`,
      `a|Rep a|let out a|a_moan at having a|their ${dick} being stimulated by such a tight little ${theirsimple}.`,
      `b|Rep b|let out an involuntary moan, having a comparatively large ${mysimple} inside b|them.`,
    ]
    if (them.isHasDick()) {
      t = t.concat([
        `Despite the extremely tight opening of b|reps ${hole}, b|they b|manage to push it deep enough for a|reps ${dick} to hit a|their prostate.`,
      ])
    }
  } else {
    t = [
      `b|Reps ${dick} is far too big though, and every press backwards bring excruciating pain.`,
      `Despite a|reps efforts, the ${dick} is simply too big for the ${theirsimple} and there is no way a|rep can push even deeper.`,
      `The size difference causes each push backward to bring excruciating pain to b|rep.`,
      `a|Rep a|let out a|a_moan at having the incredibly rare opportunity of penetrating such a deliciously tight ${theirsimple} with a|their ${dick}.`,
    ]
    if (them.isHasDick()) {
      t = t.concat([
        `b|Rep will not be getting b|their prostate stimulation this way though, as a|reps ${dick} is just far too big to even enter and reach b|their prostate.`,
      ])
    }
  }

  story += setup.rng.choice(t) + ' '

  return story
}

/**
 * Describes unit inserting their shaft into another unit
 * @param {setup.Unit} me 
 * @param {setup.SexBodypart} my_bodypart
 * @param {setup.Unit} them 
 * @param {setup.SexBodypart} their_bodypart
 * @param {setup.SexInstance} sex 
 */
export function phallusHoleSizeDifferenceOngoingSub(me, my_bodypart, them, their_bodypart, sex) {
  const raw_story = rawPhallusHoleSizeDifferenceOngoingSub(me, my_bodypart, them, their_bodypart, sex)
  return setup.SexUtil.convert(raw_story, { a: me, b: them }, sex)
}





