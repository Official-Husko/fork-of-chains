import type { Passage } from "twine-sugarcube";

function printStatistics() {
  const statistics = [
    [`Quests`, setup.questtemplate],
    [`Mails`, setup.opportunitytemplate],
    [`Interactions`, setup.interaction],
    [`Events`, setup.event],
    [`Activity`, setup.activitytemplate],
    [`Traits`, setup.trait],
    [`Improvements`, setup.buildingtemplate],
    [`Rooms`, setup.roomtemplate],
    [`Items`, setup.item],
    [`Equipments`, setup.equipment],
    [`Title`, setup.title],
    [`Lore`, setup.lore],
    [`Sex Action`, setup.sexaction],
    [`Portraits`, setup.UnitImage.UNIT_IMAGES],
    [`Content Images`, setup.ContentImage.CONTENT_IMAGE_PATH_TO_OBJ],
    [`Living`, setup.living],
    [`Duty`, setup.dutytemplate],
  ];

  const passage_containers = [
    `getNormals`,
    `getScripts`,
    `getStyles`,
    `getWidgets`,
  ] as const;
  const passages: Passage[] = [];
  for (const cnt of passage_containers) {
    passages.push(...(Object.values((Story as any)[cnt]()) as Passage[]));
  }

  let words = 0;
  for (const passage of passages) {
    words += passage.text.split(/\s+/).length;
  }

  console.info(`Statistics for version: ${setup.VERSION}`);
  console.info(`Passages: ${passages.length}`);
  console.info(`Word count (approx.): ${words}`);
  for (const statistic of statistics) {
    console.info(`${statistic[0]}: ${Object.keys(statistic[1]).length}`);
  }

  let text = `    <td>v${setup.VERSION}</td>\n`;
  text += `    <td>${passages.length}</td>\n`;
  text += `    <td>${words}</td>\n`;
  for (const statistic of statistics) {
    text += `    <td>${Object.keys(statistic[1]).length}</td>\n`;
  }
  text = `  <tr>\n${text}  </tr>`;
  console.info(text);
}

export function printDebugInfos() {
  /* Compute race average values */
  {
    for (const pool of Object.values(setup.unitpool)) {
      const stats = pool.computeStatistics();
      console.info(
        `${pool.key}: ${stats.min} - ${stats.max} (avg ${stats.mean})}`,
      );
    }
  }

  /* List of all duties */
  // printDuties()

  /* Compute other statistics */
  printStatistics();
}
