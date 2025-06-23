/**
 * @param {setup.Unit} unit 
 */
setup.Text.Unit.background = function (unit) {
  let backgrounds = unit.getTraits().filter(trait => trait.getTags().includes('bg'))
  if (!backgrounds.length) {
    return setup.Text.replaceUnitMacros([
      `a|Rep a|have no discernible background.`,
      `a|Rep a|have no background that you know of.`,
    ], { a: unit })
  }
  const race = unit.getRace()
  const subrace = unit.getSubrace()
  let job = unit.getJob()

  let texts = []
  for (let i = 0; i < backgrounds.length; ++i) {
    let bg = backgrounds[i]
    let basetext = null
    let slavertext = null
    let slavetext = null
    // before being a slaver, unit xxx
    // The unit also took another vocation before being a slave: unit also
    if (bg == setup.trait.bg_farmer) {
      basetext = `came from a rural background where a|they growed crops and vegetables\
      as well as handle farm animals`
      slavertext = `Since humans are animals after all, some of these skills will surely\
      come in handy during a slaving career`
      slavetext = `Now a|they must have learned how the animals must have felt under a|their care`
    } else if (bg == setup.trait.bg_noble) {
      basetext = `used to lived in relative luxury and well-provided for.\
      As a result, a|rep received better education than most as well as some martial training`
      slavetext = `a|They should now use a|their better education to learn fast how to be a good slave`
    } else if (bg == setup.trait.bg_slave) {
      basetext = `had never known what it meant to be a free a|race`
      slavertext = `Now that the tables have turned, a|they a|is looking forward to handling the whip`
      slavetext = `And a|they will probably never learn it`
    } else if (bg == setup.trait.bg_monk) {
      basetext = `honed their body and spirit in isolation`
      if (unit.isHasTrait('muscle_strong')) {
        slavetext = `It is surely destiny that a|their sculpted body is now free for your perusal`
        slavertext = `a|Rep a|is strong both mentally and physically, surely a boon for a slaving company such as this`
      } else {
        slavetext = `Although looking at their a|body now you are unsure if a|they remember anything from a|their trainings`
        slavertext = `Although looking at their a|body now you are unsure if a|they remember anything from a|their trainings`
      }
    } else if (bg == setup.trait.bg_mercenary) {
      basetext = `a|was part of a mercenary band and travelled across the land in the pursuit of gold.\
      Such background gives a|rep plenty of combat experience`
      slavetext = `Perhaps a|rep would make an excellent fighting slave for your amusement`
    } else if (bg == setup.trait.bg_pirate) {
      basetext = `lived on the sea preying upon unsuspecting victims and merchant ships.\
      a|Rep a|is no stranger to enslaving whatever people in the ships a|they used to raid`
      slavetext = `How the table have turned now that a|rep is nothing but your slave`
    } else if (bg == setup.trait.bg_thief) {
      if (subrace == setup.trait.subrace_humankingdom) {
        basetext = `made a|their living pickpocketing people across the City of Lucgate`
      } else {
        basetext = `made a|their living breaking into and stealing from people's homes across the nearby land`
      }
      slavertext = `a|Rep a|have an experienced nimble fingers which is surely useful in the slaving career`
      slavetext = `But it seems karma has caught up to a|their crimes`
    } else if (bg == setup.trait.bg_mystic) {
      let magics = unit.getTraits().filter(trait => trait.getTags().includes('magic'))
      if (!magics.length) {
        basetext = `a|was a practitioner of general magic without specializing in any field`
      } else if (magics.length == 2) {
        basetext = `a|was a genius magic practitioner gifted in multiple domains of magic`
      } else {
        basetext = `a|was a magic practitioner specializing in the domain of ${magics[0].rep()}`
      }
      slavertext = `This gives a|rep an affinity of the arcane, which is surely going to help a|their slaving career`
      slavetext = `You have to be careful near the slave until properly trained`
    } else if (bg == setup.trait.bg_apprentice) {
      let magics = unit.getTraits().filter(trait => trait.getTags().includes('magic'))
      if (!magics.length) {
        basetext = `a|was a student trying to master general magic without specializing in any field`
      } else if (magics.length == 2) {
        basetext = `a|was a gifted student of magic who is yet to fulfill a|their true potential`
      } else {
        basetext = `a|was a student magician of ${magics[0].rep()}`
      }
      slavertext = `This gives a|rep a stronger affinity to the arcane than others, which if mastered is sure to propel a|their slaving career`
      slavetext = `Maybe you can resume a|their magic training once the slave is obedient`
    } else if (bg == setup.trait.bg_hunter) {
      if ([
        setup.trait.race_human,
        setup.trait.race_wolfkin,
        setup.trait.race_catkin,
        setup.trait.race_elf].includes(race)) {
        basetext = `lived from hunting the wild animals of the surrounding forests`
      } else if (race == setup.trait.race_greenskin || subrace == setup.trait.subrace_humandesert) {
        basetext = `lived from hunting the scarce wild animals in the eastern deserts`
      } else {
        basetext = `lived from hunting exotic animals off the southern seas`
      }
      slavertext = `a|Their skills hunting animals will surely come in handy now that a|they hunt the most dangerous animals of all`
      slavetext = `But the hunter has become the hunted and now must live in cages in your company`
    } else if (bg == setup.trait.bg_priest) {
      basetext = `dedicated a|their body and soul for the greater beings`
      slavertext = `a|They must have ultimately found a|themself disillusioned by the idea to do a 180 flip and become a slaver.\
      A priest may not be your traditional choice for a slaver, but nobody can deny that a|rep heals better than most`
      slavetext = `And now a|they a|is fated to dedicate a|their soul and especially body for a|their master`
    } else if (bg == setup.trait.bg_whore) {
      basetext = `followed the ancient tradition of selling a|their own body for profit`
      if (unit.isHasTrait(setup.trait.per_lustful) || unit.isMasochistic()) {
        basetext = `${basetext}.\
        While most would have been appalled by the idea, a|rep a|seem to have liked\
        a|their previous occupation too much..`
        slavetext = 'Perhaps this is what you call a natural born slut'
        slavertext = 'Perhaps this sluttiness can come in handy for slaving career?'
      } else {
        slavertext = `${basetext}.\
        a|Rep a|was more than happy to bury a|their past and start anew as a slaver`
        slavetext = `You kinda hope a|they can continue to sell their bodies and earn you money, but you're not running a brothel unfortunately`
      }
    } else if (bg == setup.trait.bg_courtesan) {
      basetext = `entertained the wealthies of clients with a|their body`
      if (unit.isHasTrait(setup.trait.per_lustful) || unit.isMasochistic()) {
        basetext = `${basetext}.\
        While most courtesans tend to fake their enjoyment,\
        a|Rep a|seem to genuinely enjoy the degradation.`
        slavetext = 'Perhaps this is what you call a natural born slut'
        slavertext = 'Perhaps this sluttiness can come in handy for slaving career?'
      } else {
        slavertext = `${basetext}.\
        a|Rep will have to learn how to use a|their charm and body for the benefit of your company`
        slavetext = `Perhaps this is a rare chance for you to make use of such a high-class whore`
      }
    } else if (bg == setup.trait.bg_laborer) {
      basetext = `did whatever heavy labor available around where a|they lived, be it mining, quarrying, or just moving things around.\
      The experience have made the ${job.getName().toLowerCase()} stronger than most people,\
      which is always a good trait to have on ${setup.Article(job.getName().toLowerCase())}`
    } else if (bg == setup.trait.bg_merchant) {
      basetext = `profited greatly off buying cheap and selling high`
      slavertext = `a|Rep a|is a a|race you can trust with your money`
    } else if (bg == setup.trait.bg_soldier) {
      if (race == setup.trait.race_lizardkin) {
        basetext = `were part of a fearsome a|race army who ravaged the lands of other races for treasures`
        slavertext = `Now a|they a|is a|their own master and finally can fight for a|themself and obtain a|their own hoard of treasure`
        slavetext = `Having such a powerful a|race warrior as your slave is a truly incredible feat for yourself and your company`
      } else {
        basetext = `fought as part of an army without really knowing why`
        slavertext = `Now a|they a|is a|their own master and finally can fight for a|themself`
        slavetext = `At least under your management a|their body and openings will be put to good use`
      }
    } else if (bg == setup.trait.bg_wildman) {
      basetext = `lived wildly with little culture over at the ${setup.Text.Race.region(subrace)}`
      slavetext = `a|They must have been an interesting animal to tame`
    } else if (bg == setup.trait.bg_nomad) {
      if (race == setup.trait.race_greenskin) {
        basetext = `lived in one of the orcish encampments and followed the army wherever it goes`
      } else {
        basetext = `lived from place to place in the ${setup.Text.Race.region(subrace)} without settling at any single place,\
        which makes a|them particularly hardy`
      }
    } else if (bg == setup.trait.bg_raider) {
      basetext = `raided settlements near the ${setup.Text.Race.region(subrace)}, plundered the camps and raped their people`
      slavetext = `Your company proves the better raiders as a|them raiding career is cut short\
      to begin a|their new slave career`
      slavertext = `a|Their experience almost perfectly matches the kind of experience\
      your company is looking for, making a|them a great fit for the position of being a slaver`
    } else if (bg == setup.trait.bg_adventurer) {
      if (race == setup.trait.race_lizardkin) {
        basetext = `left a|their a|race brethrens to go on an adventure for harem and hoard of treasure`
      } else {
        basetext = `traveled the land looking for flesh and adventure`
      }
      slavetext = `You wonder if a|they think that being a slave is just a small part of the adventure`
      slavertext = `That is, until a|they realize that being a slaver is a fast-track ticket to getting the flesh part`
    } else if (bg == setup.trait.bg_entertainer) {
      basetext = `made a|their living from entertaining both highborns and lowborns alike`
      if (unit.isHasTrait(setup.trait.skill_entertain)) {
        basetext = `${basetext}. a|Rep a|is particularly good at a|their job and is famous in certain circles`
      }
      slavetext = `The job description does not really change now that a|they a|is a slave, except maybe the extra hard labor the master may require`
      slavertext = `The ability to entertain will surely come in handy in a|their new career as a slaver`
    } else if (bg == setup.trait.bg_mist) {
      basetext = `a|was a frequent traveler between this world and the next`
      slavetext = `Owning a slave with such mysterious origin gives you an odd and debauched feeling of power`
      slavertext = `Having a slaver with such unnatural origin sometimes give you shivers during the night`
    } else if (bg == setup.trait.bg_knight) {
      basetext = `a|was trained in the art of knighthood in protecting the weak and slaying the evil`
      slavetext = `Having a a|race of such highly regarded job as a slave gives you a sense of satisfaction, and you can't wait to toy with a|rep some more later`
      slavertext = `Being a slaver is perhaps the further away a knight could have strayed from a|their path`
    } else if (bg == setup.trait.bg_healer) {
      basetext = `a|was a dedicated healer soothing the illnesses of a|their people`
      slavertext = `Given the dangers your company face from day to day, having a slaver gifted in the arts of healing must be a blessing`
      slavetext = `With proper training perhaps you can teach a|them to heal not only with spirit but also with a|their body`
    } else if (bg == setup.trait.bg_foodworker) {
      basetext = `worked in the food industry feeding the stomachs of people`
      slavertext = `You'll keep a|rep in mind if your company needs a chef one day`
      if (unit.isHasTrait(setup.trait.dick_tiny)) {
        slavetext = `a|Rep's change of job to a slaver means that they now need to also produce plenty of fresh "milk" a|themself`
      } else if (unit.isHasTrait(setup.trait.breast_tiny)) {
        slavetext = `a|Rep's change of job to a slaver means that they now need to also produce plenty of fresh "milk" a|themself`
      }
    } else if (bg == setup.trait.bg_wiseman) {
      basetext = `gave wise advises to a|their community`
    } else if (bg == setup.trait.bg_slaver) {
      basetext = `were used to the sale and resale of other people`
      slavertext = `a|They will be right at home in your company of slavers`
      slavetext = `It is a strangely good feeling knowing that your company have bested another slaver and make a|them your slave`
    } else if (bg == setup.trait.bg_engineer) {
      basetext = `were widely known for a|their prowess in designing and building complex machineries and structures`
      slavertext = `While a|they a|have unmatched knowledge in a|their field, a|rep a|have a severe aversion to magic`
      slavetext = `Some skills makes the slave extremely valuable, especially on the right market`
    } else if (bg == setup.trait.bg_unemployed) {
      basetext = `did not have any work to do, and mostly lived out of the kindness of others`
      slavertext = `Slaver as a first job must be rather exciting for the a|race`
      slavetext = `You have to wonder if being a slave is considered a job`
    } else if (bg == setup.trait.bg_artisan) {
      basetext = `a|was a skilled artisan capable of making of various tools, wearables, and sex toys`
      slavertext = `You occasionally see the a|race a|fashion a|their own\
      sex toys and restraints to use on the slaves`
    } else if (bg == setup.trait.bg_seaman) {
      basetext = `sailed the seas and lived off her bounties`
      slavetext = `Fortunately for you, a|they went for the wrong booty and ended up your slave`
      slavertext = `Not to worry, you are sure that there will be opportunities for a|them to sail back to the sea as part a job in your company`
    } else if (bg == setup.trait.bg_woodsman) {
      basetext = `lived off the bounties of the woods, be it wood, fruits, or wildlife`
    } else if (bg == setup.trait.bg_clerk) {
      basetext = `shifted through numerous paperwork daily`
      slavetext = `You wonder if being a slave to your will is better than being a slave to paperwork`
      slavertext = `a|Rep a|is surely grateful for the change in occupation, a far livelier one than the one a|they a|is used to`
    } else if (bg == setup.trait.bg_scholar) {
      basetext = `knowledgeable in a vast array of disciplines`
      slavetext = `You can certainly make use of a knowledgeable slave for managing your company`
      slavertext = `You can certainly count on a|them if you need to know anything`
    } else if (bg == setup.trait.bg_thug) {
      basetext = `roughed up others for a living`
      slavetext = `And now there is nothing left of the slave with the tables turned`
      slavertext = `a|They will surely be natural are roughing up slaves`
    } else if (bg == setup.trait.bg_mythical) {
      basetext = `worshipped as a mythical being akin to gods`
      slavetext = `Such a wondrous slave in your possession makes you feel giddy inside`
      slavertext = `You swear you occasionally see butterflies fluttering around the a|race`
    } else if (bg == setup.trait.bg_royal) {
      basetext = `a|was a member of the royal family ruling their land`
      slavetext = `You have always dreamt fucking up the royalty, and now you can make the dream come true`
      slavertext = `a|They currently a|view a|their current slaving job as a break from a|their monotonous life`
    } else if (bg == setup.trait.bg_boss) {
      basetext = `a|was a highly influential member of the crime underworld`
      slavetext = `No doubt a|their thugs are busy trying to rescue a|their boss right now`
      slavertext = `And a|they probably still is -- Every now and then the a|race deeply unnerves you`
    } else if (bg == setup.trait.bg_maid) {
      basetext = `keeps the house warm and clean`
      slavetext = `A natural maid, if you say so yourself`
    } else if (bg == setup.trait.bg_informer) {
      basetext = `dealt in information both over and under the table`
      slavetext = `Perhaps a|they even have a contingency plan for when a|they a|is taken as a slave`
      slavertext = `An underhanded rogue, perfect for your company`
    } else if (bg == setup.trait.bg_assassin) {
      basetext = `took many lives in exchange for gold`
      slavetext = `You have to be careful when a|they a|is near another slave`
      slavertext = `a|They will need some time to adjust from killing fellow men to capturing them`
    } else if (bg == setup.trait.bg_metalworker) {
      basetext = `a|was locally famous as a masterful crafter of metallic origin`
      slavertext = `a|Their calloused a|hands is well-adapted to handling the whip`
      slavetext = `A remarkably valuable skill to have on a slave`
    } else if (bg == setup.trait.bg_artist) {
      basetext = `made their living from practicing art`
      slavertext = `Perhaps a|they will in time see slaving as another form of higher arts`
      slavetext = `The slave would fit straight into the harem of nobility`
    }

    let text = `${basetext}.`
    if (unit.isSlaver() && slavertext) text = `${text} ${slavertext}.`
    if (unit.isSlave() && slavetext) text = `${text} ${slavetext}.`

    const pretext_slaver = [
      `Before joining your company, a|rep `,
      `In addition, a|rep also `,
      `But that's not all. In the past, a|rep `,
      `Surprisingly, that's still not all of it. a|rep `,
      `Even more, a|rep `,
    ]

    const pretext_slave = [
      `Before being enslaved by your company, a|rep `,
      `In addition, a|rep also `,
      `But that's not all. In the past, a|rep `,
      `Surprisingly, that's still not all of it. a|rep `,
      `Even more, a|rep `,
    ]

    let touse = null
    if (unit.isSlaver()) {
      touse = pretext_slaver
    } else {
      touse = pretext_slave
    }

    let idx = Math.min(i, touse.length - 1)
    text = `${touse[idx]} ${text}`
    texts.push(text)
  }
  return setup.Text.replaceUnitMacros(texts.join(' '), { a: unit })
}
