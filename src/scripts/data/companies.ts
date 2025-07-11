import { qc } from "../_init/preinit_costrestrictions";
import type { CompanyTemplateDefinition } from "../classes/CompanyTemplate";
import { Constants } from "../constants";

export const COMPANY_DEFINITIONS = definitions<CompanyTemplateDefinition>()({
  player: {
    name: "Fort of Chains",
    description: "Your glorious company.",
    favor_effects: [[], [], []],
  },

  bank: {
    name: "Tiger Bank",
    description: `The largest banking institution in the region, headquartered at the <<lore location_npc>>.
They are said to offer easy money for those few they consider allies.`,
    favor_effects: [[qc.Money(500)], [qc.Money(1000)], [qc.Money(1500)]],
  },

  royal: {
    name: "Royal Court",
    description: `<p>
The royal court, headed by <<lore person_gaius>>, who rules over the
<<rep $company.humankingdom>>.
While the direct members of the ruling families are known to be upstanding people,
many other members of the court are less so, and may be convinced that your company
has their best interest in mind.
Compared to the <<rep $company.humankingdom>>,
your company's relations with the Royal Court is far more personal.
</p>

<p>
Should you happen to be in good standings (not officially of course!) with them,
some high quality recruits might just pop up at your <<rep setup.buildingtemplate.prospectshall>>...
</p>`,
    favor_effects: [
      [
        qc.HighQualityRecruit(
          "all",
          "slaver",
          2,
          "High quality recruit from the Royal Court",
        ),
      ],
      [
        qc.HighQualityRecruit(
          "all",
          "slaver",
          5,
          "Higher quality recruit from the Royal Court",
        ),
      ],
      [
        qc.HighQualityRecruit(
          "all",
          "slaver",
          8,
          "HIGHEST quality recruit from the Royal Court",
        ),
      ],
    ],
  },

  //
  // RACES
  //

  demon: {
    name: "The Great Mist",
    description: `Residents of the land beyond <<lore concept_mist>>, they are notorious for leading a perpetually
debauched life.
Befriending them will not be easy at all, but for those that managed such an impossible
endeavor, they are said to be granted wondrous boons in their lives.`,
    favor_effects: [["a"], ["a", "a"], ["a", "a", "a"]],
    defs: {
      a: qc.Function(() => {
        var unit = setup.rng.choice(
          State.variables.company.player.getUnits({ job: "slaver" }),
        );
        State.variables.trauma.boonize(unit, 5);
      }),
    },
  },

  dragonkin: {
    name: "The Land of Dragons",
    description: `The mighty kingdom of dragonkin in the <<lore region_sea>>.
Not many can befriend these aloof but honorable race, but for those who managed
to do so, they will find that having a dragonkin ally is more than enough to
earn the respect of many other companies...`,
    favor_effects: ((): Cost[][] => [
      // (need to wrap this in a function to avoid a circular type reference...)
      [qc.FavorSpread("dragonkin", 35)],
      [qc.FavorSpread("dragonkin", 70)],
      [qc.FavorSpread("dragonkin", 100)],
    ])(),
  },

  drow: {
    name: "V'errmyrdn",
    description: `
<p>
The drow community does not have a single leading figure.
Many of their city states underneath are in conflict with each other, and would often engage in
skirmishes with each other.
Among the many drow cities in the <<lore region_deep>>, the V'errmyrdn happens
to be one of the most prominent, and also one of the closest to your fort.
Close enough, in fact, for you to have some kind of diplomatic relationship with them.
</p>

<p>
Gaining the trust and friendship of drow is not easy.
But, should you happen to be in possession of a drow ally,
they would be more than happy to buy your healthy slaves off your <<uhands $unit.player>> for a very good price.
The drow always have use for more slaves, be it in the mines, the public squares, or even in the bedroom.
</p>`,
    favor_effects: [
      [qc.SlaveOrderDrow(1500)],
      [qc.SlaveOrderDrow(2100)],
      [qc.SlaveOrderDrow(2700)],
    ],
  },

  elf: {
    name: "Elven Council",
    description: `Intelligent and smart, these sharp-eared people lives in the <<lore region_forest>>
together with the neko.
They are often gifted alchemists, and when befriended might be willing to peddle
the extremely rare <<rep setup.item.mindmend_potion>> in your fort...`,
    favor_effects: [
      ["item", "item", "item"],
      [
        "item",
        "item",
        "item",
        qc.DoAll(
          [qc.ItemForSaleSingle("itemmarket", "mindmend_potion")],
          Constants.FAVOR_MASTER_EQUIPMENT_PROBABILITY_MEDIUM,
        ),
      ],
      [
        "item",
        "item",
        "item",
        qc.DoAll(
          [qc.ItemForSaleSingle("itemmarket", "mindmend_potion")],
          Constants.FAVOR_MASTER_EQUIPMENT_PROBABILITY_HIGH,
        ),
      ],
    ],
    defs: {
      item: qc.ItemForSale("itemmarket", "all", /* amount = */ 1),
    },
  },

  humandesert: {
    name: "Nomads of the Eastern Desert",
    description: `Hardy people of the <<lore region_desert>>.
When befriended, these people can supply your company with leads for quests from faraway lands.`,
    favor_effects: [["scout"], ["scout", "scout"], ["scout", "scout", "scout"]],
    defs: {
      scout: qc.OneRandom([
        qc.QuestDelay("desert", 1),
        qc.QuestDelay("sea", 1),
      ]),
    },
  },

  humankingdom: {
    name: "Kingdom of Tor",
    description: `The glorious Kingdom of Tor, ruled over by <<lore person_gaius>> is perhaps
the most multicultural of all the nations on <<lore geo_mestia>>.
The <<lore race_humankingdom>> people are industrious, forward thinking, and are
known for their inventiveness and machinery.  Although slavery has recently been
made illegal by royal decree, the practice still exists just under the thin
veneer of civilization.
Gaining the favor of the Kingdom will provide you with an influx of mercenaries, especially those whose skills have recently been outlawed.`,
    favor_effects: [
      ["getslaver"],
      ["getslaver", "getslaver"],
      ["getslaver", "getslaver", "getslaver"],
    ],
    defs: {
      getslaver: qc.Function((company) => {
        const unit = setup.unitgroup.all.getUnit({
          job_hint: "slaver",
        });
        qc.Slaver("recruit", "", /* is mercenary = */ true).apply({
          getName: () => company?.getName?.() ?? "",
          getActorUnit: () => unit,
        });
      }),
    },
  },

  humansea: {
    name: "Humans of the Southern Lands",
    description: `Mysterious people hailing from beyond the <<lore region_sea>>.
Many are gifted in <<rep setup.trait.magic_light>>, and when befriended
can share their secrets to heal your injured slavers faster.`,
    favor_effects: [["heal"], ["heal", "heal"], ["heal", "heal", "heal"]],
    defs: {
      heal: qc.Function(() => State.variables.hospital.healRandom()),
    },
  },

  humanvale: {
    name: "Humans of the Northern Vale",
    description: `Humans of the <<lore region_vale>>.
If you befriend them, they can supply your fort with leads for quests from the surrounding
vale, forest, and city.`,
    favor_effects: [["scout"], ["scout", "scout"], ["scout", "scout", "scout"]],
    defs: {
      scout: qc.OneRandom([
        qc.QuestDelay("vale", 2),
        qc.QuestDelay("forest", 2),
        qc.QuestDelay("city", 2),
      ]),
    },
  },

  independent: {
    name: "Independent",
    description: `Various rabbles scattered around the region with no clear leadership between them.`,
    favor_effects: [[], [], []],
  },

  kobold: {
    name: "Drak Xoth",
    description: `<p>
Among the many <<lore race_kobold>> communities in the <<lore region_deep>>, the kobolds of
<<lore location_drak_xoth>> are perhaps the most numerous.
The city's leadership essentially falls into their spiritual leader, the archpriest
residing in the <<lore location_gaiatal>>.
</p>

<p>
Drak Xoth kobolds often send expeditions into the vast unknown of the <<lore region_deep>>.
Whenever an expedition is successful, they would celebrate by sending gifts to their allies.
Should you manage to befriend these kobolds, expect them to gift you random gifts every few weeks.
</p>`,
    favor_effects: [
      [qc.RandomDeeprealmItem(500)],
      [qc.RandomDeeprealmItem(1000)],
      [qc.RandomDeeprealmItem(1500)],
    ],
  },

  lizardkin: {
    name: "Lizardkin",
    description: `A group of people with scaley skin and enormous tails living
across the <<lore region_sea>>.
Unlike the purebred dragonkin, these people lack wings, but they make up for it
in grit and combat ferocity.
These people are not usually welcoming to outsiders, but for those who managed
to secure their trust, they will find that lizardkin scouts are one of the best
scouts for finding rare quests in the world...`,
    favor_effects: [
      ["scout"],
      [qc.QuestDelay("veteran", 1)],
      [qc.QuestDelay("veteran", 1), "scout"],
    ],
    defs: {
      scout: qc.OneRandom([qc.DoAll([]), qc.QuestDelay("veteran", 1)]),
    },
  },

  neko: {
    name: "Neko",
    description: `The catfolk of the <<lore region_forest>>. Most have lost their fully furry ancestries,
and mostly just sport cat ears and cat tails.
Many can be found peddling in sex toys, and if you befriend them, they might be
willing to sell their wares at your fort.
Rumors have it that they sell the rarest of their toys to their most staunch allies...`,
    favor_effects: [
      ["item", "item", "item"],
      [
        "item",
        "item",
        "item",
        qc.DoAll(
          [qc.EquipmentForSaleSingle("buttplug_master")],
          Constants.FAVOR_MASTER_EQUIPMENT_PROBABILITY_MEDIUM,
        ),
      ],
      [
        "item",
        "item",
        "item",
        qc.DoAll(
          [qc.EquipmentForSaleSingle("buttplug_master")],
          Constants.FAVOR_MASTER_EQUIPMENT_PROBABILITY_HIGH,
        ),
      ],
    ],
    defs: {
      item: qc.EquipmentForSale("all_sex", /* amount = */ 1),
    },
  },

  orc: {
    name: "Orcish Band",
    description: `A group of green-skinned brutes living on the <<lore region_desert>>.
Orc smiths are famous for having crafted the sturdiest of armors,
and they can be enticed to sell their wares if you befriend them enough.`,
    favor_effects: [
      ["item", "item", "item"],
      [
        "item",
        "item",
        "item",
        qc.DoAll(
          [qc.EquipmentForSaleSingle("combat_arms_master")],
          Constants.FAVOR_MASTER_EQUIPMENT_PROBABILITY_MEDIUM,
        ),
      ],
      [
        "item",
        "item",
        "item",
        qc.DoAll(
          [qc.EquipmentForSaleSingle("combat_arms_master")],
          Constants.FAVOR_MASTER_EQUIPMENT_PROBABILITY_HIGH,
        ),
      ],
    ],
    defs: {
      item: qc.EquipmentForSale("blacksmith", /* amount = */ 1),
    },
  },

  outlaws: {
    name: "Outlaws",
    description: `The general lawbreakers, perfect company for a slaving company such as yours.
If befriending, they will surely be glad to offer your company some of their
freshly captured slaves for sale.`,
    favor_effects: [
      ["getslave"],
      ["getslave", "getslave"],
      ["getslave", "getslave", "getslave"],
    ],
    defs: {
      getslave: qc.Function((company) => {
        var unit = setup.unitgroup.all.getUnit({ job_hint: "slave" });
        qc.Slave("recruit", "", /* is mercenary = */ true).apply({
          getName: () => company?.getName?.() ?? "",
          getActorUnit: () => unit,
        });
      }),
    },
  },

  werewolf: {
    name: "Werewolves of the Northern Vale",
    description: `The furry tribes of the <<lore region_vale>>.
Many are excellent carpenters, and when befriended, these people
might just be willing to sell their most luxurious
furniture at your fort...`,
    favor_effects: [
      ["item", "item", "item"],
      [
        "item",
        "item",
        "item",
        qc.DoAll(
          [qc.ItemForSaleSingle("itemmarket", "f_slaverbed_master")],
          Constants.FAVOR_MASTER_EQUIPMENT_PROBABILITY_MEDIUM,
        ),
      ],
      [
        "item",
        "item",
        "item",
        qc.DoAll(
          [qc.ItemForSaleSingle("itemmarket", "f_slaverbed_master")],
          Constants.FAVOR_MASTER_EQUIPMENT_PROBABILITY_HIGH,
        ),
      ],
    ],
    defs: {
      _item: qc.ItemForSale("itemmarket", "furniture_normal", /* amount = */ 1),
      _rare: qc.ItemForSaleSingle("itemmarket", "f_slaverbed_master"),
    },
  },

  foxkin: {
    name: "Foxkin Kennels",
    description: `
Hidden beneath the trees of the <<lore region_vale>>, the **Foxkin Kennels** quietly serve under the protection—and ownership—of their werewolf masters.
Foxkin are raised as obedient companions, prized for their submissive nature, soft voices, and eager loyalty. They are trained from a young age for pleasure, decorum, and fertility.
The Kennels offer cages, frames, and toys tailored to the needs of these special pets. Those with enough favor may even be allowed to adopt one... or breed their own.`,
    favor_effects: [
      [
        //_cage,
        //_toy,
      ],
      [
        //_cage,
        //_frame,
        //qc.DoAll([_foxpet], Constants.FAVOR_MASTER_UNIT_PROBABILITY_MEDIUM),
      ],
      [
        //_cage,
        //_frame,
        //_toy,
        //qc.DoAll([_foxpet, _foxfertile], Constants.FAVOR_MASTER_UNIT_PROBABILITY_HIGH),
      ],
    ],
    defs: {},
  },
});
