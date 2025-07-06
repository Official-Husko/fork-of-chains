// @ts-nocheck


const tags_to_brackets = {
  'if': 2,
  'else': 2,
  'elseif': 2,
  'switch': 2,
  'case': 2,
  'opt': 2,
  'optif': 2,
  'choose': 2,
  'dialogue': 2,
  'font': 2,
  'fontsize': 2,
  'p': 1,
  'div': 1,
  'span': 1,
}

const tag_mid = {
  'else': 'if',
  'elseif': 'if',
  'opt': 'choose',
  'optif': 'choose',
  'case': 'switch',
}

const SPACES = 4
const CONTEXT_LENGTH = 4

/**
 * @param {string} tag 
 * @param {boolean} is_closing 
 * @returns {string}
 */
function tagpretty(tag, is_closing) {
  if (!tag) return 'undefined'
  const expected = tags_to_brackets[tag]
  if (expected === undefined) throw new Error(`Undefined expected brackets for tag ${tag}`)
  return '<'.repeat(expected) + (is_closing ? '/' : '') + tag + '>'.repeat(expected)
}

/**
 * Beautify a string.
 */
/**
 * @param {string} s 
 * @returns {{
 *   errors: Array<{error: string, line: number, context: string}>,
 *   text: string,
 * }}
 */
setup.beautifyTwine = function (s) {
  if (!s) {
    return {
      errors: [],
      text: '',
    }
  }

  const c = s.split('\n').map(line => line.trim().replace(/\s+/g, ' ')).join('\n')
  if (!c) {
    return {
      errors: [],
      text: ''
    }
  }

  const stack = []
  const output = []
  let line = 1

  const errors = []

  function build_context(idx) {
    let j = idx + 1
    while (j < c.length && c[j] != '\n') {
      j += 1
    }
    return s.substr(idx, j - idx)
  }
  let freshline = true
  const contexts = []
  let context = null

  for (let i = 0; i < c.length; ++i) {
    if (c[i] == '\n') {
      // new line: proceed to new line and generate enough new spaces
      output.push('\n')
      if (i + 1 < c.length) {
        contexts.push(build_context(i + 1))
      }
      line += 1
      freshline = true
      context = ''
      const start = Math.max(0, contexts.length - CONTEXT_LENGTH)
      for (let j = start; j < contexts.length; ++j) {
        if (j > start) {
          context += '\n'
        }
        context += contexts[j]
      }
      continue
    }

    if (c[i] != '<') {
      if (freshline) {
        output.push(' '.repeat(SPACES * stack.length))
        freshline = false
      }
      output.push(c[i])
      continue
    }

    // check if it's a tag.
    let j = i
    while (j < c.length && c[j] == '<') {
      j += 1
    }
    const bracks = j - i
    let k = j
    while (k < c.length && c[k].match(/[\/\w]/)) {
      k += 1
    }

    let tag = c.substr(j, k - j)
    let closes = false
    if (tag.startsWith('/')) {
      closes = true
      tag = tag.substr(1, tag.length - 1)
    }
    if (!((tag in tags_to_brackets) || (tag in tag_mid))) {
      // ignore it
      if (freshline) {
        output.push(' '.repeat(SPACES * stack.length))
        freshline = false
      }
      output.push(c.substr(i, k - i))
      i = k - 1
      continue
    }

    const expected = tags_to_brackets[tag]
    const tagnice = tagpretty(tag, closes)

    if (expected != bracks) {
      errors.push({
        error: `Tag ${tagnice} was found with incorrect number of brackets: ${bracks} instead of ${tags_to_brackets[tag]}`,
        line: line,
        context: context,
      })
    }

    // get until next '>'
    let kk = k
    let kkl = kk
    let close = 0
    while (true) {
      while (kk < c.length && c[kk] != '>') {
        kk += 1
      }
      kkl = kk
      while (kkl < c.length && c[kkl] == '>') {
        kkl += 1
      }
      close = kkl - kk
      if (close != bracks) {
        if (close == 0) {
          errors.push({
            error: `Closing brackets for tag ${tagnice} not found`,
            line: line,
            context: context,
          })
          break
        }
      }
      if (close > bracks) {
        errors.push({
          error: `Too many closing brackets for tag ${tagnice}: found ${close} instead of ${bracks}`,
          line: line,
          context: context,
        })
      }
      if (close >= bracks) {
        break
      } else {
        kk = kkl
      }
    }

    // ok found it.
    let is_less_indent = false
    if (closes) {
      if (!stack.length) {
        errors.push({
          error: `Found closing bracket ${tagnice} but there was nothing to close`,
          line: line,
          context: context,
        })
      } else {
        const top = stack.pop()
        if (top != tag) {
          errors.push({
            error: `Expects ${tagpretty(top, true)}, but found ${tagnice} instead`,
            line: line,
            context: context,
          })
        }
      }
    } else if (tag in tag_mid) {
      is_less_indent = true
      const target = tag_mid[tag]
      const actual = stack[stack.length - 1]
      if (actual != target) {
        errors.push({
          error: `Found improperly placed middle tag ${tagnice}. Expected inside ${tagpretty(target, false)} but found inside ${tagpretty(actual, false)} instead.`,
          line: line,
          context: context,
        })
      }
      // dont pop stack in this case
    } else {
      // opening tag
      is_less_indent = true
      stack.push(tag)
    }

    // format it
    if (!freshline) {
      output.push('\n')
      line += 1
      freshline = true
    }
    if (freshline) {
      if (is_less_indent) {
        output.push(' '.repeat(Math.max((stack.length - 1) * SPACES, 0)))
      } else {
        output.push(' '.repeat(stack.length * SPACES))
      }
      freshline = false
    }
    const to_insert = c.substr(i, kkl - i)
    output.push(to_insert)
    line += to_insert.count('\n')

    i = kkl - 1
    if ((i + 1) < c.length && c[i + 1] != '\n') {
      output.push('\n')
      line += 1
      freshline = true
    }
  }

  if (stack.length) {
    errors.push({
      error: `Missing closing tag for ${tagpretty(stack[stack.length - 1], false)}`,
      line: line,
      context: context,
    })
  }

  return {
    text: output.join(''),
    errors: errors,
  }
}
