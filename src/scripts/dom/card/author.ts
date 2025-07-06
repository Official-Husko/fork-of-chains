// @ts-nocheck

/**
 * Prints an author raw
 * @param {AuthorInfo | string} author 
 * @returns {setup.DOM.Node}
 */
setup.DOM.Card.author = function (author) {
  const fragments = []

  if (setup.isString(author)) {
    author = {
      name: author
    }
  }

  if (!author.name) {
    fragments.push(html`by anonymous`)
  } else {
    fragments.push(html`
      by ${author.name}
    `)
    if (author.url) {
      fragments.push(html`
        <a target="_blank" class="link-external" href="${setup.escapeHtml(author.url)}" tabindex="0">(source)</a>
      `)
    }
    fragments.push(setup.DOM.Util.help(
      `Author of this quest.
      If you like story written by an author, do give the author a shout-out
      in <a target="_blank" class="link-external" href="https://discord.gg/PTD9D7mZyg" tabindex="0">Discord</a>!
      It will make their day.`
    ))
  }
  return setup.DOM.create('div', { class: 'authorinfo' }, fragments)
}

