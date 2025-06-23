import { PenisOrgasm } from "../orgasm/PenisOrgasm"

setup.SexActionClass.PenisOrgasmSelf = class PenisOrgasmSelf extends PenisOrgasm {
  getTags() { return super.getTags().concat(['normal',]) }
  desc() { return 'Masturbate' }

  /**
   * @returns {ActorDescription[]}
   */
  getActorDescriptions() {
    const desc = super.getActorDescriptions()

    // Must not be in the middle of penetrating something else.
    desc[0].restrictions.push(
      setup.qres.Not(setup.qres.SexIsInPenetration(setup.sexbodypart.penis)),
    )

    return desc
  }
}
