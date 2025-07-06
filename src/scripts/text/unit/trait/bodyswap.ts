// @ts-nocheck


setup.Text.Unit.Bodyswap = {}

// describe what happens when unit went from oldtrait to newtrait
/**
 * @param {setup.Unit} unit 
 * @param {setup.Trait | null} oldtrait 
 * @param {setup.Trait | null} newtrait 
 * @returns {string | string[]}
 */
function traitTransform(unit, oldtrait, newtrait) {
  // Retrieve the traits. This is complicated because the traits can be null.
  let trait_group = null
  let tags = []
  let new_desc
  let old_desc
  let new_noun
  let old_noun
  if (oldtrait) {
    old_desc = setup.Text.Unit.Trait.description(unit, oldtrait)
    old_noun = setup.Text.Unit.Trait.noun(unit, oldtrait)
  }

  if (newtrait) {
    new_desc = setup.Text.Unit.Trait.description(unit, newtrait)
    new_noun = setup.Text.Unit.Trait.noun(unit, newtrait)
  }

  if (oldtrait) {
    trait_group = oldtrait.getTraitGroup()
    tags = oldtrait.getTags()
  } else if (newtrait) {
    trait_group = newtrait.getTraitGroup()
    tags = newtrait.getTags()
  } else {
    return ''
  }

  if (tags.includes('gender')) {
    if (oldtrait == newtrait) {
      return [
        `a|They a|look almost relieved to remain ${oldtrait.getName()}.`,
        `a|Rep a|is lucky that a|their gender remains unchanged.`,
      ]
    } else {
      if (newtrait == setup.trait.gender_female) {
        return [
          `a|They a|look confused as a|they a|start to explore a|their new sensitive female body.`,
          `A source of new pleasure assaults a|rep as a|their body shifts into that befitting a female.`,
        ]
      } else {
        return [
          `a|They a|look uncomfortable as a|they a|start to explore a|their new robust male body.`,
          `a|Their body composition shifts uncomfortably as a|they a|is transformed into a male.`,
        ]
      }
    }

  } else if (tags.includes('subrace')) {
    if (oldtrait == newtrait) {
      return [
        `a|They a|remain ${setup.Article(oldtrait.getName())}.`,
        `a|They a|look relieved to remain ${setup.Article(oldtrait.getName())}.`,
      ]
    } else {
      return [
        `a|Their body once ${setup.Article(oldtrait.getName())}, is now a full ${newtrait.getName()}.`,
        `a|Their body shifts and morphs, turning them from a|race into ${setup.Article(newtrait.getName())}.`,
      ]
    }
  }

  if (oldtrait == newtrait) {
    return ''
  }

  if (!trait_group || !trait_group.isOrdered()) {
    if (tags.includes('wings')) {
      if (!newtrait) {
        return `a|They a|lose a|their ${old_noun}.`
      } else {
        return `From a|their back grows ${setup.Article(new_noun)}.`
      }
    } else if (tags.includes('tail')) {
      if (!newtrait) {
        return `There are no trace of the ${old_noun} a|they used to have.`
      } else {
        return `From above a|their butt now grows ${setup.Article(new_noun)}.`
      }
    } else if (tags.includes('eyes')) {
      if (!newtrait) {
        return `a|Their a|eyes becomes noticably human.`
      } else {
        return `a|Their a|eyes are now ${setup.Article(new_noun)}.`
      }
    } else if (tags.includes('ears')) {
      if (!newtrait) {
        return `On the sides of a|their head is now a pair of normal ears.`
      } else {
        return `On the sides of a|their head is now ${setup.Article(new_noun)}.`
      }
    } else if (tags.includes('mouth')) {
      if (!newtrait) {
        return `The ${old_noun} on a|their face disappears leaving a normal human-like face.`
      } else {
        return `a|They now a|have ${new_noun}.`
      }
    } else if (tags.includes('body')) {
      if (!newtrait) {
        return `a|Their body noticably shifts from its previous a|body into an ordinary human-like body.`
      } else {
        return `a|Their body noticably shifts from its previous a|body into ${setup.Article(new_noun)}.`
      }
    } else if (tags.includes('arms')) {
      if (!newtrait) {
        return `a|Their a|arms morph into a pair of human-like arms.`
      } else {
        return `a|Their a|arms morph into ${setup.Article(new_noun)}.`
      }
    } else if (tags.includes('legs')) {
      if (!newtrait) {
        return `a|They now a|have a normal human-like pair of fleshly legs in place of a|their previous a|legs.`
      } else {
        return `a|They now have ${setup.Article(new_noun)} in place of a|their previous a|legs.`
      }
    } else if (tags.includes('dickshape')) {
      if (!newtrait) {
        return `a|Their dick becomes an ordinary human-like dick.`
      } else {
        return `a|They now sports ${setup.Article(new_noun)}.`
      }
    } else if (tags.includes('tough')) {
      if (!newtrait) {
        return `a|Their previously a|body becomes relatively average in term of toughness or flexibility.`
      } else {
        return `a|They ${new_desc} now.`
      }
    } else {
      // dunno what this is

      if (!newtrait) {
        return `a|Their ${old_noun} returned to normal.`
      } else {
        return `a|They now a|have ${setup.Article(new_noun)}.`
      }
    }
  } else {
    let idxold = trait_group._getTraitIndex(oldtrait)
    let idxnew = trait_group._getTraitIndex(newtrait)

    if (idxold == -1) {
      return [
        `a|They now ${new_desc}.`,
        `Now, a|they ${new_desc}.`,
        `a|They ${new_desc} now, to a|their confusion.`,
        `a|They a|is not sure what to do now that a|they ${new_desc}.`,
        `A look of confusion forms in a|their face now that a|they ${new_desc}.`,
      ]
    }
    if (idxnew == -1) {
      return [
        `There are no trace that a|they once ${old_desc}.`,
        `a|They used to ${old_desc}, but it is completely gone now.`,
        `a|They ${old_desc} before, although there is no trace of it now.`,
        `There are nothing but smooth skin where a|they used to ${old_desc}.`,
      ]
    }

    let initsentence = ''

    let plus = setup.rng.choice([
      `becoming unremarkably normal`,
      'becoming normal',
    ])
    if (idxold < idxnew) {
      // increase
      if (tags.includes('muscle')) {
        initsentence = `a|Their muscles noticably grow, `
      } else if (tags.includes('dick')) {
        initsentence = `a|Their dick grows in width and girth, `
      } else if (tags.includes('balls')) {
        initsentence = `a|Their balls noticably grows in size, `
      } else if (tags.includes('breast')) {
        initsentence = `On their upper body a|their breasts grow, `
      } else if (tags.includes('vagina')) {
        initsentence = `Underneath, a|their vagina loosens, `
      } else if (tags.includes('anus')) {
        initsentence = `Inside their butt, a|their anus loosens, `
      } else if (tags.includes('face')) {
        initsentence = `a|Their looks improves, `
      } else if (tags.includes('height')) {
        initsentence = `a|They a|grow in height, `
      } else if (tags.includes('tough')) {
        initsentence = `a|They a|become tougher, `
      }
      if (newtrait) plus = newtrait.text().increase
    } else {
      // decrease
      if (tags.includes('muscle')) {
        initsentence = `a|Their muscles noticably shrink, `
      } else if (tags.includes('dick')) {
        initsentence = `a|Their dick shrinks in width and girth, `
      } else if (tags.includes('balls')) {
        initsentence = `a|Their balls noticably shrinks in size, `
      } else if (tags.includes('breast')) {
        initsentence = `On their upper body a|their breasts shrink, `
      } else if (tags.includes('vagina')) {
        initsentence = `Underneath, a|their vagina tightens, `
      } else if (tags.includes('anus')) {
        initsentence = `Inside their butt, a|their anus tightens, `
      } else if (tags.includes('face')) {
        initsentence = `a|Their looks worsen, `
      } else if (tags.includes('height')) {
        initsentence = `a|They a|grow shorter, `
      } else if (tags.includes('tough')) {
        initsentence = `a|They a|become nimbler, `
      }
      if (newtrait) plus = newtrait.text().decrease
    }
    return `${initsentence}${plus}.`
  }
}

/**
 * @param {setup.Unit} unit1 
 * @param {setup.Unit} unit2 
 * @returns {string}
 */
setup.Text.Unit.Bodyswap.bodyswap = function(unit1, unit2) {
  let comptraits = ['gender', 'subrace'].concat(setup.TRAIT_PHYSICAL_TAGS).concat(setup.TRAIT_SKIN_TAGS)
  let texts = []
  for (let i = 0; i < comptraits.length; ++i) {
    let comptrait = comptraits[i]
    let text = traitTransform(
        unit1,
        unit1.getTraitWithTag(comptrait),
        unit2.getTraitWithTag(comptrait),
    )
    if (text) texts.push(setup.Text.replaceUnitMacros(text, {a: unit1}))
  }
  return texts.join(' ')
}
