
/**
 * @param {setup.Unit} unit 
 * @param {setup.SexAction} action 
 * @param {setup.SexInstance} sex 
 */
export function getActionScorePenetration(unit, action, sex) {
  const current = sex.getAllOngoing(unit).length
  let score_table = setup.SexUtil.traitSelect(unit, setup.Sex.AROUSAL_PENETRATION_SCORE)
  return score_table[Math.min(current, score_table.length - 1)]
}
