// @ts-nocheck

import { domCardRep } from "../util/cardnamerep"

/**
 * @param {setup.BuildingTemplate} template
 * @returns {setup.DOM.Node}
 */
export function buildingTemplateNameFragment(template) {
  return html`
    ${setup.TagHelper.getTagsRep('buildingtemplate', template.getTags())}
    ${domCardRep(template)}
  `
}


/**
 * @param {setup.BuildingTemplate} template
 * @returns {setup.DOM.Node}
 */
export function buildingTemplateDescriptionFragment(template) {
  return setup.DOM.create('div', {}, setup.DOM.Util.include(template.getDescriptionPassage()))
}

