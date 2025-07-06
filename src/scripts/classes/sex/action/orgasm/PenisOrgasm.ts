// @ts-nocheck

/* TEXT ADOPTED AND MODIFIED FROM LILITH'S THRONE BY INNOXIA:
GenericOrgasms.getGenericPenisOrgasmDescription
DoggyStyle.DOGGY_DOMINANT_ORGASM 
*/

import { PenisOrgasmBase } from "./PenisOrgasmBase"
import { orgasmPositionPreparation, getCumQuantityDescription } from "./util"


export class PenisOrgasm extends PenisOrgasmBase {
	/**
	 * @param {setup.SexInstance} sex 
	 * @returns {string}
	 */
	postOrgasm(sex) {
		return ``
	}

	/**
	 * @param {setup.SexInstance} sex 
	 * @returns {string}
	 */
	describeOrgasm(sex) {
		// by default, masturbate.
		const me = this.getActorUnit('a')

		let story = ''
		if (me.isHasTrait('dick_demon')) {
			story += `a|They a|reach down and a|slide a|their a|hand up and down over a|their sensitive little barbs.`
		} else if (me.isHasTrait('dick_werewolf')) {
			story += `a|They a|reach down and a|start to furiously masturbate; a|their a|hand sliding down the length of a|their a|dick to grip and rub at a|their swollen knot.`
		} else if (me.isHasTrait('dick_dragonkin')) {
			story += `a|They a|reach down and a|slide a|their a|hand up and down over the bumpy ribs that line a|their a|dick.`
		} else {
			story += `a|They a|reach down and a|start to furiously masturbate; a|their a|hand running up the length of a|their a|dick to rub and tease a|their cock head.`
		}

		return story

	}

	/**
	 * Returns the title of this action, e.g., "Blowjob"
	 * @param {setup.SexInstance} sex
	 * @returns {string}
	 */
	rawTitle(sex) {
		return `Masturbate`
	}

	/**
	 * Short description of this action. E.g., "Put your mouth in their dick"
	 * @param {setup.SexInstance} sex
	 * @returns {string}
	 */
	rawDescription(sex) {
		return `You've reached your climax, and can't hold back your orgasm any longer. Time to masturbate the cum out.`
	}

	/**
	 * Returns a string telling a story about this action to be given to the player
	 * @param {setup.SexInstance} sex
	 * @returns {string}
	 */
	rawStory(sex) {
		const me = this.getActorUnit('a')
		const mbody = setup.sexbodypart.penis
		const mpace = sex.getPace(me)

		let story = ''
		story += orgasmPositionPreparation(me, mbody, sex)
		story += ' '

		const modifiers = []
		// if not cum inside
		if (me.isHasTrait('dick_werewolf')) {
			story += setup.rng.choice([
				`The thick knot at the base of a|reps a|dick swells up, and a|they a|feel a|their a|balls tightening as a|they a|start to cum.`,
				`a|Reps a|balls tightens, and with their thick knot forming a|they can feel the cum starting to gush out.`
			])
		} else {
			story += setup.rng.choice([
				` a|Reps a|dick twitches, and a|they a|feel a|their a|balls tightening as a|they a|start to cum.`,
			])
		}

		story += ' '

		story += this.describeOrgasm(sex)

		/*
					case THIGHS:
						genericOrgasmSB.append(` a|Rep a|continue thrusting a|their a|dick between b|reps thighs, letting out a|a_moan as a|they a|feel it start to twitch.`);
						
						for(PenetrationModifier mod : PenetrationModifier.values()) {
							switch(mod) {
								case BARBED:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` a|their movements cause the barbs lining the sides of a|their a|dick to rake against b|reps b|legs, causing b|them to let out b|a_moan.`);
									}
									break;
								case BLUNT:
									break;
								case FLARED:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` a|their flared head swells up, causing b|reps b|legs to be parted ever wider, which in turn causes b|them to let out b|a_moan.`);
									}
									break;
								case KNOTTED:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` a|their fat knot swells up, and with each thrust, bumps wildly against b|reps b|legs, which in turn causes b|them to let out b|a_moan.`);
									}
									break;
								case PREHENSILE:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` Harnessing the ability of a|their prehensile cock, a|rep bends it around b|reps b|legs on each thrust, which in turn causes b|them to let out b|a_moan.`);
									}
									break;
								case RIBBED:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` a|their ribbed shaft repeatedly bumps against b|reps b|legs on every thrust, which in turn causes b|them to let out b|a_moan.`);
									}
									break;
								case SHEATHED:
									break;
								case TAPERED:
									break;
								case TENTACLED:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` The little tentacles lining a|their shaft wriggle against and massage b|reps b|legs on every thrust, which in turn causes b|them to let out b|a_moan.`);
									}
									break;
								case VEINY:
									break;
							}
						}
						break;
				}
				
			} else {
				switch((SexAreaPenetration)contactingArea) {
					case CLIT:
						break;
					case FINGER:
						genericOrgasmSB.append(` a|Rep a|continue thrusting a|their a|dick into b|reps b|hand, letting out a|a_moan as a|they a|feel it start to twitch.`);
						
						for(PenetrationModifier mod : PenetrationModifier.values()) {
							switch(mod) {
								case BARBED:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` a|their movements cause the barbs lining the sides of a|their a|dick to rake against b|reps fingers, causing b|them to let out b|a_moan.`);
									}
									break;
								case BLUNT:
									break;
								case FLARED:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` a|their flared head swells up, causing b|reps fingers to be parted ever wider, which in turn causes b|them to let out b|a_moan.`);
									}
									break;
								case KNOTTED:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` a|their fat knot swells up, and with each thrust, bumps wildly against b|reps fingers, which in turn causes b|them to let out b|a_moan.`);
									}
									break;
								case PREHENSILE:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` Harnessing the ability of a|their prehensile cock, a|rep bends it around b|reps fingers on each thrust, which in turn causes b|them to let out b|a_moan.`);
									}
									break;
								case RIBBED:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` a|their ribbed shaft repeatedly bumps against b|reps fingers on every thrust, which in turn causes b|them to let out b|a_moan.`);
									}
									break;
								case SHEATHED:
									break;
								case TAPERED:
									break;
								case TENTACLED:
									if(characterOrgasming.hasPenisModifier(mod)) {
										modifiers.add(` The little tentacles lining a|their shaft wriggle against and massage b|reps fingers on every thrust, which in turn causes b|them to let out b|a_moan.`);
									}
									break;
								case VEINY:
									break;
							}
						}
						break;
					case PENIS:
						break;
					case TAIL:
						break;
					case TENTACLE:
						break;
					case FOOT://TODO modifiers
						if(Sex.isDoubleFootJob(characterTargeted)) {
							genericOrgasmSB.append(` a|Rep a|continue thrusting a|their a|dick between b|reps b|feet, letting out a|a_moan as a|they a|feel it start to twitch.`);
						} else {
							genericOrgasmSB.append(` a|Rep a|continue rubbing a|their a|dick against b|reps b|foot, letting out a|a_moan as a|they a|feel it start to twitch.`);
						}
						break;
					case TONGUE:
						break;
				}
			}
		}
		*/

		let t = [
			`As a|their a|balls tense up,`,
			`a|Their a|balls tensing up,`,
			`Feeling a|their a|balls tense up and no longer able to hold back,`,
			`Losing control, a|they a|feel a|their a|balls emptying,`,
		]
		story += ' ' + setup.rng.choice(t) + ' '

		story += getCumQuantityDescription(me, sex)

		if (me.isHasBalls()) {
			const pants = sex.getCoveringEquipment(me, mbody)
			if (pants) {
				// cum to pants case
				story += ` into a|their ${pants.rep()}.`
			} else {
				story += this.cumTargetDescription(sex)
			}
		}

		if (me.isHasTrait('dick_werewolf') && sex.getBodypartPenetrationTarget(me, mbody)) {
			story += setup.rng.choice([
				` Even after a|reps a|balls have pumped their entire load into b|rep, a|their knot remains swollen, locking ${me.isYou() ? 'the two of you together' : 'a|them and a|their partner together'}.
				It takes a few minutes for it to start to deflate, and with a wet pop, a|they a|is finally able to pull a|their a|dick free. `,
				` Even after a|reps a|balls have been fully emptied into b|rep, a|their knot locks a|them together in place with b|rep.
				It takes several minutes until the knot begins to deflate, and finally a|rep a|is able to pull a|their a|dick free from b|rep with a loud pop. `,
			])
		}

		story += ' ' + this.postOrgasm(sex) + ' '

		return setup.SexUtil.convert(story, { a: me }, sex)
	}

	/**
	 * @param {setup.SexInstance} sex
	 * @returns {string}
	 */
	cumTargetDescription(sex) {
		let story = ''
		const unit = this.getActorUnit('a')

		// By default, cum into the location.
		const location = sex.getLocation()
		const floor = location.repSurface(sex)

		return setup.SexUtil.convert([
			` out all over the ${floor}.`,
			` messily over the ${floor}.`,
			` into the ${floor}.`,
		], { a: unit }, sex)
	}

	/*
	if (unit instanceof setup.Unit) {
		case BACK:
			target = Sex.getTargetedPartner(characterOrgasming);
			targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.BACK);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, target, CoverableArea.BACK, targetAreaClothingCummedOn);
				
			} else {
				if(!target.isPlayer()) {
					if(characterOrgasming.isPlayer()) {
						return UtilText.parse(target,
								` all over a|reps back. You grin as your [pc.cum+] splatters onto a|them, and a|they can't help but let out a|a_moan as a|they feels it running down over a|their a|skin.`);
					} else {
						return UtilText.parse(characterOrgasming, target,
								` all over b|reps back. a|Rep grins as a|their cum splatters onto b|rep, and b|they can't help but let out b|a_moan as b|they feels it running down over b|their b|skin.`);
						
					}
				} else {
					return UtilText.parse(characterOrgasming,
							` all over your back. a|Rep grins as a|their cum splatters onto you, and you can't help but let out [pc.a_moan] as you feel it running down over your [pc.skin].`);
				}
			}
		case BREASTS:
			target = Sex.getTargetedPartner(characterOrgasming);
			targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.BREASTS);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, target, CoverableArea.BREASTS, targetAreaClothingCummedOn);
				
			} else {
				if(!target.isPlayer()) {
					if(characterOrgasming.isPlayer()) {
						return UtilText.parse(target,
								` all over a|reps a|breasts. You grin as your [pc.cum+] splatters onto a|them, and a|they can't help but let out a|a_moan as a|they feels it running down over a|their a|skin.`);
					} else {
						return UtilText.parse(characterOrgasming, target,
								` all over b|reps b|breasts. a|Rep grins as a|their cum splatters onto b|rep, and b|they can't help but let out b|a_moan as b|they feels it running down over b|their b|skin.`);
						
					}
				} else {
					return UtilText.parse(characterOrgasming,
							` all over your [pc.breasts]. a|Rep grins as a|their cum splatters onto you, and you can't help but let out [pc.a_moan] as you feel it running down over your [pc.breastsSkin].`);
				}
			}
		case FACE:
			target = Sex.getTargetedPartner(characterOrgasming);
			targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.MOUTH);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, target, CoverableArea.MOUTH, targetAreaClothingCummedOn);
				
			} else {
				if(!target.isPlayer()) {
					if(characterOrgasming.isPlayer()) {
						return UtilText.parse(target,
								` all over a|reps a|face. You grin as your [pc.cum+] splatters onto a|them, and a|they can't help but let out a|a_moan as a|they feels it running down over a|their a|skin.`);
					} else {
						return UtilText.parse(characterOrgasming, target,
								` all over b|reps b|face. a|Rep grins as a|their cum splatters onto b|rep, and b|they can't help but let out b|a_moan as b|they feels it running down over b|their b|skin.`);
						
					}
				} else {
					return UtilText.parse(characterOrgasming,
							` all over your [pc.face+]. a|Rep grins as a|their cum splatters onto you, and you can't help but let out [pc.a_moan] as you feel it running down over your [pc.faceSkin].`);
				}
			}
		case STOMACH:
			target = Sex.getTargetedPartner(characterOrgasming);
			targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.STOMACH);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, target, CoverableArea.STOMACH, targetAreaClothingCummedOn);
				
			} else {
				if(!target.isPlayer()) {
					if(characterOrgasming.isPlayer()) {
						return UtilText.parse(target,
								` all over a|reps stomach. You grin as your [pc.cum+] splatters onto a|them, and a|they can't help but let out a|a_moan as a|they feels it running down over a|their a|skin.`);
					} else {
						return UtilText.parse(characterOrgasming, target,
								` all over b|reps stomach. a|Rep grins as a|their cum splatters onto b|rep, and b|they can't help but let out b|a_moan as b|they feels it running down over b|their b|skin.`);
						
					}
				} else {
					return UtilText.parse(characterOrgasming,
							` all over your stomach. a|Rep grins as a|their cum splatters onto you, and you can't help but let out [pc.a_moan] as you feel it running down over your [pc.skin].`);
				}
			}
		case GROIN:
			target = Sex.getTargetedPartner(characterOrgasming);
			targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.PENIS); // PENIS and VAGINA cover the same areas
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, target, CoverableArea.PENIS, targetAreaClothingCummedOn);
				
			} else {
				String groinText = `groin.`;
				if(target.hasPenisIgnoreDildo()) {
					if(target.hasVagina()) {
						if(target.getGenitalArrangement()==GenitalArrangement.CLOACA) {
							groinText = ` b|dick, b|vagina, and b|anus.`;
						} else {
							groinText = ` b|dick and b|vagina.`;
						}
					} else {
						if(target.getGenitalArrangement()==GenitalArrangement.CLOACA) {
							groinText = ` b|dick and b|anus.`;
						} else {
							groinText = ` b|dick.`;
						}
					}
				} else if(target.hasVagina()) {
					if(target.getGenitalArrangement()==GenitalArrangement.CLOACA) {
						groinText = ` b|vagina and b|anus.`;
					} else {
						groinText = ` b|vagina.`;
					}
				} else {
					groinText = ` genderless mound.`;
				}
				
				if(!target.isPlayer()) {
					if(characterOrgasming.isPlayer()) {
						return UtilText.parse(characterOrgasming, target,
								` all over b|reps `+groinText ` You grin as your cum splatters onto b|them, and b|they can't help but let out b|a_moan as b|they feels it running down over b|their groin.`);
					} else {
						return UtilText.parse(characterOrgasming, target,
								` all over b|reps `+groinText ` a|Rep grins as a|their cum splatters onto b|rep, and b|they can't help but let out b|a_moan as b|they feels it running down over b|their groin.`);
						
					}
				} else {
					return UtilText.parse(characterOrgasming, target,
							` all over your `+groinText ` a|Rep grins as a|their cum splatters onto you, and you can't help but let out b|a_moan as you feel it running down over your groin.`);
				}
			}
			
		case INSIDE:
		case INSIDE_SWITCH_DOUBLE:
			break;
			
		case HAIR:
			target = Sex.getTargetedPartner(characterOrgasming);
			targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.HAIR);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, target, CoverableArea.HAIR, targetAreaClothingCummedOn);
				
			} else {
				if(!target.isPlayer()) {
					if(characterOrgasming.isPlayer()) {
						return UtilText.parse(target,
								` all over a|reps head`+(target.getHairRawLengthValue()>0?` and hair`:``)+`. You grin as your [pc.cum+] splatters onto a|them.`);
					} else {
						return UtilText.parse(characterOrgasming, target,
								` all over b|reps head`+(target.getHairRawLengthValue()>0?` and hair`:``)+`. a|Rep grins as a|their cum splatters onto b|them.`);
						
					}
				} else {
					return UtilText.parse(characterOrgasming,
							` all over your head`+(target.getHairRawLengthValue()>0?` and [pc.hair]`:``)+`. a|Rep grins as a|their cum splatters onto you.`);
				}
			}
		case LEGS:
			target = Sex.getTargetedPartner(characterOrgasming);
			targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.LEGS);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, target, CoverableArea.LEGS, targetAreaClothingCummedOn);
				
			} else {
				if(!target.isPlayer()) {
					if(characterOrgasming.isPlayer()) {
						return UtilText.parse(target,
								` all over a|reps a|legs. You grin as your [pc.cum+] splatters onto a|them, and a|they can't help but let out a|a_moan as a|they feels it running down over a|their a|skin.`);
					} else {
						return UtilText.parse(characterOrgasming, target,
								` all over b|reps b|legs. a|Rep grins as a|their cum splatters onto b|rep, and b|they can't help but let out b|a_moan as b|they feels it running down over b|their b|skin.`);
						
					}
				} else {
					return UtilText.parse(characterOrgasming,
							` all over your [pc.legs]. a|Rep grins as a|their cum splatters onto you, and you can't help but let out [pc.a_moan] as you feel it running down over your [pc.legsSkin].`);
				}
			}
		case FEET:
			target = Sex.getTargetedPartner(characterOrgasming);
			targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.FEET);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, target, CoverableArea.FEET, targetAreaClothingCummedOn);
				
			} else {
				if(!target.isPlayer()) {
					if(characterOrgasming.isPlayer()) {
						return UtilText.parse(target,
								` all over a|reps a|feet. You grin as your [pc.cum+] splatters onto a|them, and a|they can't help but let out a|a_moan as a|they feels it running down over a|their toes.`);
					} else {
						return UtilText.parse(characterOrgasming, target,
								` all over b|reps b|feet. a|Rep grins as a|their cum splatters onto b|rep, and b|they can't help but let out b|a_moan as b|they feels it running down over b|their toes.`);
						
					}
				} else {
					return UtilText.parse(characterOrgasming,
							` all over your [pc.feet+]. a|Rep grins as a|their cum splatters onto you, and you can't help but let out [pc.a_moan] as you feel it running down over your [pc.toes+].`);
				}
			}
		case WALL:
			return ` all up the wall.`;
			
		case SELF_GROIN:
			targetAreaClothingCummedOn = getClothingCummedOn(characterOrgasming, CoverableArea.PENIS);
			targetAreaClothingCummedOn.addAll(getClothingCummedOn(characterOrgasming, CoverableArea.VAGINA));
			targetAreaClothingCummedOn = new ArrayList<>(new HashSet<>(targetAreaClothingCummedOn));
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, targetAreaClothingCummedOn);
					
			} else {
				String groinText = `groin.`;
				if(characterOrgasming.hasPenisIgnoreDildo()) {
					if(characterOrgasming.hasVagina()) {
						groinText = ` a|dick and a|vagina.`;
					} else {
						groinText = ` a|dick.`;
					}
				} else if(characterOrgasming.hasVagina()) {
					groinText = ` a|vagina.`;
				} else {
					groinText = ` genderless mound.`;
				}
				
				if(!characterOrgasming.isPlayer()) {
					return UtilText.parse(characterOrgasming, target,
							` all over a|their `+groinText ` a|They grins as a|their cum splatters onto a|them, and a|they can't help but let out a|a_moan as a|they feels it running down over a|their a|skin.`);
					
				} else {
					return UtilText.parse(characterOrgasming, target,
							` all over your `+groinText ` You grin as your [pc.cum+] splatters onto you, and you can't help but let out [pc.a_moan] as you feel it running down over your [pc.skin].`);
				}
			}
			
		case SELF_STOMACH:
			targetAreaClothingCummedOn = getClothingCummedOn(characterOrgasming, CoverableArea.STOMACH);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, targetAreaClothingCummedOn);
				
			} else {
				if(characterOrgasming.isPlayer()) {
					return UtilText.parse(characterOrgasming,
							` all over your stomach. You can't help but let out [pc.a_moan] as you feel it running down over your [pc.skin].`);
				} else {
					return UtilText.parse(characterOrgasming,
							` all over a|their stomach. a|They can't help but let out a|a_moan as a|they feels it running down over a|their a|skin.`);
					
				}
			}
			
		case SELF_LEGS:
			targetAreaClothingCummedOn = getClothingCummedOn(characterOrgasming, CoverableArea.LEGS);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, targetAreaClothingCummedOn);
				
			} else {
				if(characterOrgasming.isPlayer()) {
					return UtilText.parse(characterOrgasming,
							` all over your legs. You can't help but let out [pc.a_moan] as you feel it running down over your [pc.skin].`);
				} else {
					return UtilText.parse(characterOrgasming,
							` all over a|their legs. a|They can't help but let out a|a_moan as a|they feels it running down over a|their a|skin.`);
					
				}
			}

		case SELF_FEET:
			targetAreaClothingCummedOn = getClothingCummedOn(characterOrgasming, CoverableArea.FEET);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, targetAreaClothingCummedOn);
				
			} else {
				if(characterOrgasming.isPlayer()) {
					return UtilText.parse(characterOrgasming,
							` all over your [pc.feet+]. You can't help but let out [pc.a_moan] as you feel it running down over your [pc.toes+].`);
				} else {
					return UtilText.parse(characterOrgasming,
							` all over a|their a|feet. a|They can't help but let out a|a_moan as a|they feels it running down over a|their toes.`);
					
				}
			}
			
		case SELF_BREASTS:
			targetAreaClothingCummedOn = getClothingCummedOn(characterOrgasming, CoverableArea.BREASTS);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, targetAreaClothingCummedOn);
				
			} else {
				if(characterOrgasming.isPlayer()) {
					return UtilText.parse(characterOrgasming,
							` all over your a|breasts. You can't help but let out a|a_moan as you feel it running down over your a|skin.`);
				} else {
					return UtilText.parse(characterOrgasming,
							` all over a|reps a|breasts. a|They can't help but let out a|a_moan as a|they feels it running down over a|their a|skin.`);
					
				}
			}
		case SELF_FACE:
			targetAreaClothingCummedOn = getClothingCummedOn(characterOrgasming, CoverableArea.MOUTH);
			if (!targetAreaClothingCummedOn.isEmpty()) {
				return getClothingCummedOnText(characterOrgasming, targetAreaClothingCummedOn);
				
			} else {
				if(characterOrgasming.isPlayer()) {
					return UtilText.parse(characterOrgasming,
							` all over your [pc.face+]. You can't help but let out [pc.a_moan] as you feel it running down over your [pc.faceSkin].`);
				} else {
					return UtilText.parse(characterOrgasming,
							` all over a|reps a|face. a|They can't help but let out a|a_moan as a|they feels it running down over a|their a|skin.`);
					
				}
			}
			
		case LILAYA_PANTIES:
			LilayasRoom.lilayasPanties.setDirty(null, true);
			return UtilText.parse(characterOrgasming,
					` directly into Lilaya's panties. You can't help but let out [pc.a_moan+] as you watch your [pc.cum+] pool in the soft fabric, and you give your [pc.cock+] a few extra strokes as you imagine your demonic [lilaya.relation(pc)] blushing as she slides the cum-saturated underwear up over her hot pussy.`);
	}
	
	// Continued description for cumming inside:
	
	SexAreaInterface areaContacted = Sex.getAllContactingSexAreas(characterOrgasming, SexAreaPenetration.PENIS).get(0);

	if(areaContacted.isOrifice()) {
		switch((SexAreaOrifice)areaContacted) {
				
			case ASS:
				targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.ASS);
				if (!targetAreaClothingCummedOn.isEmpty()) {
					return getClothingCummedOnText(characterOrgasming, target, CoverableArea.ASS, targetAreaClothingCummedOn);
					
				} else {
					cumTargetSB.append(` all over b|reps back and b|ass.`);

					switch (characterOrgasming.getPenisOrgasmCumQuantity()) {
						case SIX_EXTREME: case SEVEN_MONSTROUS:
							cumTargetSB.append(` After a few seconds, b|rep b|realise that a|rep a|is not even close to stopping, and after just a moment more, b|their b|ass is absolutely drenched in cum.`);
							break;
						default:
							break;
					}
				}
				break;
				
			case BREAST:
				targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.BREASTS);
				if (!targetAreaClothingCummedOn.isEmpty()) {
					return getClothingCummedOnText(characterOrgasming, target, CoverableArea.BREASTS, targetAreaClothingCummedOn);
					
				} else {
					if(target.hasBreasts()) {
						cumTargetSB.append(` all over b|reps b|breasts and face.`);
					} else {
						cumTargetSB.append(` all over b|reps flat chest and face.`);
					}
					switch (characterOrgasming.getPenisOrgasmCumQuantity()) {
						case SIX_EXTREME: case SEVEN_MONSTROUS:
							cumTargetSB.append(` After a few seconds, b|rep b|realise that a|rep a|is not even close to stopping, and after just a moment more, b|their torso is absolutely drenched in cum.`);
							break;
						default:
							break;
					}
				}
				break;
				
			case BREAST_CROTCH:
				targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.BREASTS_CROTCH);
				if (!targetAreaClothingCummedOn.isEmpty()) {
					return getClothingCummedOnText(characterOrgasming, target, CoverableArea.BREASTS_CROTCH, targetAreaClothingCummedOn);
					
				} else {
					cumTargetSB.append(` all over b|reps crotch boobs and groin.`);
					switch (characterOrgasming.getPenisOrgasmCumQuantity()) {
						case SIX_EXTREME: case SEVEN_MONSTROUS:
							cumTargetSB.append(` After a few seconds, b|rep b|realise that a|rep a|is not even close to stopping, and after just a moment more, b|their crotch and stomach is absolutely drenched in cum.`);
							break;
						default:
							break;
					}
				}
				break;
				
			case NIPPLE:
				if(target.isPlayer()) {
					cumTargetSB.append(` deep into your [pc.breasts+], and you find yourself whining and moaning as you feel the cum deep inside of your [pc.breasts+].`);
				} else {
					cumTargetSB.append(` deep into b|reps b|breasts.`);
				}
				if(Main.getProperties().hasValue(PropertyValue.inflationContent)) {
					float cumAmount = target.getTotalFluidInArea(SexAreaOrifice.NIPPLE) characterOrgasming.getPenisRawOrgasmCumQuantity();
					cumTargetSB.append(getBreastInflationText(characterOrgasming, target, cumAmount));
				}
				break;
				
			case NIPPLE_CROTCH:
				cumTargetSB.append(` deep into b|reps crotch boobs.`);
				
				if(Main.getProperties().hasValue(PropertyValue.inflationContent)) {
					float cumAmount = target.getTotalFluidInArea(SexAreaOrifice.NIPPLE_CROTCH) characterOrgasming.getPenisRawOrgasmCumQuantity();
					cumTargetSB.append(getBreastCrotchInflationText(characterOrgasming, target, cumAmount));
				}
				break;
				
			case THIGHS:
				targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.THIGHS);
				if (!targetAreaClothingCummedOn.isEmpty()) {
					return getClothingCummedOnText(characterOrgasming, target, CoverableArea.THIGHS, targetAreaClothingCummedOn);
					
				} else {
					cumTargetSB.append(` all over b|reps thighs.`);
					
					switch (characterOrgasming.getPenisOrgasmCumQuantity()) {
						case SIX_EXTREME: case SEVEN_MONSTROUS:
							cumTargetSB.append(` After a few seconds, b|rep b|realise that a|rep a|is not even close to stopping, and after just a moment more, b|their b|legs are absolutely drenched in cum.`);
							break;
						default:
					}
				}
				break;
				
			case URETHRA_PENIS: case URETHRA_VAGINA: //TODO
				if(target.isPlayer()) {
					cumTargetSB.append(` deep into your urethra.`);
				} else {
					cumTargetSB.append(` deep into b|reps urethra.`);
				}
				switch (characterOrgasming.getPenisOrgasmCumQuantity()) {
					case SIX_EXTREME: case SEVEN_MONSTROUS:
						cumTargetSB.append(` After a few seconds, b|rep b|realise that a|rep a|is not even close to stopping, and as a|their`
								+` cum backs up and starts drooling out of b|their urethra, b|they b|let out b|a_moan. a|Rep a|keep a|their a|dick hilted inside of b|them, moaning as a|they a|wait for a|their a|balls to run dry.`);
						break;
					default:
						break;
				}
				if(Main.getProperties().hasValue(PropertyValue.inflationContent) && !target.isVisiblyPregnant()) {
					float cumAmount = target.getTotalFluidInArea((SexAreaOrifice) areaContacted) characterOrgasming.getPenisRawOrgasmCumQuantity();
					cumTargetSB.append(getInflationText(characterOrgasming, target, cumAmount));
				}
				break;
				

		switch(target.getBodyMaterial()) {
			case AIR:
			case ARCANE:
			case WATER:
			case SLIME:
				cumTargetSB.append(`<br/>As b|reps body is made completely out of translucent `+target.getBodyMaterial().getName()+`, you're able to see the cloud of a|reps cum shooting up and dispersing inside of b|them.`);
				break;
			case FIRE:
			case FLESH:
			case ICE:
			case RUBBER:
			case STONE:
				break;
		}
		
	} else {
		switch((SexAreaPenetration)areaContacted) {
			case CLIT:
				break;
			case FINGER:
				targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.HANDS);
				if (!targetAreaClothingCummedOn.isEmpty()) {
					return getClothingCummedOnText(characterOrgasming, target, CoverableArea.HANDS, targetAreaClothingCummedOn);
					
				} else {
					cumTargetSB.append(` all over b|reps fingers.`);
					
					switch (characterOrgasming.getPenisOrgasmCumQuantity()) {
						case SIX_EXTREME: case SEVEN_MONSTROUS:
							cumTargetSB.append(` After a few seconds, b|rep b|realise that a|rep a|is not even close to stopping, and after just a moment more, b|their b|hands are absolutely drenched in cum.`);
							break;
						default:
							break;
					}
				}
				break;
			case PENIS:
				break;
			case TAIL:
				break;
			case TENTACLE:
				break;
			case FOOT:
				targetAreaClothingCummedOn = getClothingCummedOn(target, CoverableArea.FEET);
				if (!targetAreaClothingCummedOn.isEmpty()) {
					return getClothingCummedOnText(characterOrgasming, target, CoverableArea.FEET, targetAreaClothingCummedOn);
					
				} else {
					cumTargetSB.append(` all over b|reps toes.`);
					
					switch (characterOrgasming.getPenisOrgasmCumQuantity()) {
						case SIX_EXTREME: case SEVEN_MONSTROUS:
							cumTargetSB.append(` After a few seconds, b|rep b|realise that a|rep a|is not even close to stopping, and after just a moment more, b|their b|feet are absolutely drenched in cum.`);
							break;
						default:
							break;
					}
				}
				break;
			case TONGUE:
				break;
		}
	}
	
	if(target!=null) {
		return UtilText.parse(characterOrgasming, target, cumTargetSB.toString());
		
	} else {
		return UtilText.parse(characterOrgasming, cumTargetSB.toString());
	}
}
*/


}