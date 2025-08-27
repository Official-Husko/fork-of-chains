export const ROOMS = definitions<RoomDefinition>()({
  shipyard: {
    tags: [],
    description:
      "Where you maintain your vessels before they depart from your harbor.",
    name: "Shipyard",
    width: 4,
    height: 4,
    door_column: 1,
    skill_bonus: [],
    is_fixed: false,
    is_passable: false,
    is_door: true,
    is_optional: false,
    is_outdoors: true,
  },
});

export const BUILDINGS = definitions<BuildingDefinition>()({
  scoutharbor: {
    name: "Scout Harbor",
    tags: ["scout", "unlocker", "critical"],
    description: `A fully functional harbor in the vicinity of your fort, for sea travel.
Requires you to build a shipyard in your fort, for making and maintaining your ships.
Unlocks a quest which grants a contact across the sea that supply you with scouting mission each week.`,
    costs: [[qc.MoneyMult(-Constants.BUILDING_MEDIUM_MULT)]],
    restrictions: [[qres.Building("scouthut"), qres.Building("veteranhall")]],
    on_build: [[qc.QuestDirect("sea_contact")]],
    main_room_template_key: "shipyard",
  },
});
