// @ts-nocheck

/**
 * @param {setup.Unit} me 
 * @param {setup.SexInstance} sex 
 * @returns {string | string[]}
 */
function rawAnalEnjoymentDescription(me, sex) {
  // Describe how much this unit enjoys anal sex.
  if (me.isMindbroken()) {
    return [
      `a|Reps preference towards anal sex does not matter, since a|their mind has long been gone.`,
      `Whatever preference the mindbroken slave once have towards anal sex, it has been gone completely.`,
      `Being mindbroken means that whatever preferences a|rep used to have towards anal sex is completely meaningless now.`,
    ]
  }
  const enjoyment = setup.SexBodypartClass.Anus.unitAnalEnjoymentMultiplier(me)
  if (enjoyment >= 2) {
    return [
      `As a complete anal slut, a|rep a|is very much looking forward to the coming sex.`,
      `a|Rep a|is a complete anal slut, deriving much pleasure from anal stimulation.`,
      `a|Rep a|see anal sex as a|their absolute favorite activity, and a|is very much looking forward to the upcoming sex.`,
    ]
  } else if (enjoyment >= 1) {
    return [
      `As an anal slut, a|rep a|is looking forward to the coming delightful sex.`,
      `a|Rep a|enjoy anal sex, and is rather looking forward to the actions.`,
      `a|Rep a|see anal sex as one of a|their favorite activities, and a|is looking forward to the upcoming sex.`,
    ]
  } else if (enjoyment > 0) {
    return [
      `a|Rep a|look a little unsure about the coming anal sex.`,
      `a|Rep a|do not fully enjoy anal sex, but a|they certainly a|is not complaining.`,
      `a|Rep a|do not find anal sex fully enjoyable, but still consider it better than nothing.`,
    ]
  } else if (enjoyment == 0) {
    return [
      `a|Rep a|is perfectly indifferent to anal sex, deriving absolutely no pleasure from it.`,
      `a|Reps outlook on anal sex is perfectly neutral, deriving no pleasure from the act.`,
      `a|Rep a|do not have any thoughts about anal sex, deriving neither pleasure nor discomfort from it.`,
    ]
  } else if (enjoyment > -1) {
    return [
      `a|Rep a|look worried about anal sex, as a|they a|have been unable to enjoy it.`,
      `a|Rep a|have a rather vanilla taste, and a|they a|look uncomfortable with the upcoming anal penetration.`,
      `a|Rep a|is unable to derive pleasure from anal sex, and a|is not looking forward to the near future.`,
    ]
  } else if (enjoyment > -2) {
    return [
      `a|Rep a|grimace at the thought of the upcoming anal sex, as a|they a|have been discomforted by it in the past.`,
      `Anal sex is not one of a|reps hobbies, to put it lightly, and the threat of an upcoming anal pain makes a|them very worried.`,
      `a|Rep greatly a|dislike having things shoved up a|their ass, and a|they a|is not looking forward to the upcoming anal actions.`,
    ]
  } else {
    return [
      `a|Rep absolutely a|hate anal sex, and in no way is looking forward to the coming actions.`,
      `a|Rep a|despise having a|their asshole penetrated, and it will likely be a major turn-off for a|them.`,
      `a|Rep a|abhor anal sex, and a|they will surely be turned off by the upcoming actions.`,
    ]
  }
}


/**
 * @param {setup.Unit} me 
 * @param {setup.SexInstance} sex 
 * @returns {string}
 */
export function analEnjoymentDescription(me, sex) {
  return setup.SexUtil.convert(rawAnalEnjoymentDescription(me, sex), { a: me }, sex)
}
