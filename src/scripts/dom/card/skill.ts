export default {
  skill(skill: Skill): DOM.Node {
    return html`
      <header>${skill.getImageRep()} ${setup.DOM.Util.namebold(skill)}</header>
      <div>${setup.DOM.Util.twee(skill.getDescription())}</div>
    `;
  },
};
