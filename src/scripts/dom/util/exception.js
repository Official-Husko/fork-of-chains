/*
  Appends an error view to the passed DOM element.
*/
/**
 * @param {Error} exception 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Util.exception = function (exception) {
  const game_info = `Fort of Chains v${setup.VERSION}: ${State.variables.gDebug ? ` [YOU HAVE DEBUG MODE ACTIVE -- DO NOT REPORT BUGS INCLUDING THIS ONE WITH DEBUG MODE ACTIVE]` : `The game has encountered an error. Please report this bug and provide a screenshot of this complete error and any other relevation information.`}`

  const error_message = `${exception.name}: ${exception.message}`

  const fragments = []
  fragments.push(html`
    <div class='error'>
      ${game_info}
    </div>
    <div class='error'>
      ${error_message}
    </div>
  `)

  const lines = exception.stack.split('\n').map(line =>
    line.replace(/file:.*\//, '<path>/')
  )

  fragments.push(html`
    <div class='error-source'>
      ${lines.join('<br/>')}
    </div>
  `)

  console.error(`${game_info}\n\t${error_message}\n\t${lines.join('\n')}`);
  return setup.DOM.create('div', { class: 'error-view' }, fragments)
}