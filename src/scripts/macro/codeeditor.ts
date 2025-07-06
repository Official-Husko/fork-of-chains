// @ts-nocheck

/**
 * An advanced (yet basic) code editor for .twee passages
 * Usage is the same as for SugarCube's <<textarea>>:
 * 
 *  <<codeeditor '_outputvariablename' _initialvalue>>
 * 
 * It attempts to load modules from CDN, in case they are
 * not available (or features are not supported),
 * it falls back to a basic html <textarea> element
 */

import { generateCodeEditorToolbarItems, insertTextIntoEditor } from "./codeeditor-toolbar.js"
import { menuItem } from "../ui/menu"
import Split from "split.js"
import { display_errors } from "../dom/menu/devtool/devtoolverifycreate"

/** @typedef {typeof import('@dynamic-module:devtool/third-party/codejar/codejar.js').CodeJar} CodeJar */

/** @type {ReturnType<typeof import('@dynamic-module:devtool/index.js')['initializeCodeJar']>|null} */
let loadCodejarPromise = null

// Lazy loading of the codejar editor (so it only loads if needed)
function loadCodeJar() {
  return loadCodejarPromise || (loadCodejarPromise = import('@dynamic-module:devtool').then(module => {
    return module.initializeCodeJar()
  }))
}

Macro.add('codeeditor', {
  //isAsync: true,

  handler() {
    if (!this.args.length)
      return this.error('no variable name specified')

    if (typeof this.args[0] !== 'string')
      return this.error('variable name argument is not a string')

    const varname = this.args[0].trim()
    if (varname[0] !== '$' && varname[0] !== '_')
      return this.error(`variable name "${this.args[0]}" is missing its sigil ($ or _)`)

    const initial_value = this.args[1] || ''

    let use_fallback = false

    /**
     * Editor (CodeJar) instance
     * @type {ReturnType<CodeJar>|null}
     */
    let editor = null

    const $wrapper = $(/*html*/`
      <div class="macro-codeeditor">
        <header class="macro-codeeditor-toolbar disabled">
          <div class="macro-codeeditor-toolbar-on menu toolbar"></div>
          <div class="macro-codeeditor-toolbar-off">
            <div style="flex-grow: 1"></div>
            <a class="macro-codeeditor-toggleimplbtn">(toggle editor)</a>
          </div>
        </header>
        <div class="macro-codeeditor-fallback" style="display: none">
          <textarea rows="8" tabindex="0"></textarea>
        </div>
        <div class="macro-codeeditor-main">
          <div class="macro-codeeditor-split">
            <div class="macro-codeeditor-codepane">
              <div class="macro-codeeditor-togglepreviewbtn"><i></i></div>
              <div class="macro-codeeditor-jar language-twee3">Loading...</div>
            </div>
            <div class="macro-codeeditor-previewpane" style="display: none">
              <header>
                <div>Output preview</div>
                <a class="macro-codeeditor-previewbtn">
                  <i class="sfa sfa-arrows-cw"></i>
                  Refresh
                </a>
              </header>
              <div>
                <div>
                  <div class="graytext">Press [<i class="sfa sfa-arrows-cw"></i> Refresh] to preview</div>
                  <div class="graytext">Press [<i class="sfa sfa-right-open"></i>] to hide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    // helper that saves the current position of the cursor
    // before e.g. opening a dialog
    const retainEditorFocus = (promise) => {
      const textarea = use_fallback ? $textarea.get(0) : null
      const selpos = textarea ? [textarea.selectionStart, textarea.selectionEnd] : editor.saveSelection()
      return promise.then(result => {
        $element.trigger('focus')
        if (textarea) {
          textarea.selectionStart = selpos[0]
          textarea.selectionEnd = selpos[1]
        } else {
          editor.restoreSelection(selpos)
        }
        return result
      })
    }

    const $element = $wrapper.find(`.macro-codeeditor-jar`)
    const $fallback = $wrapper.find(`.macro-codeeditor-fallback`)
    const $main = $wrapper.find(`.macro-codeeditor-main`)
    const $textarea = $wrapper.find("textarea")
    const $toggleimplbtn = $wrapper.find(`.macro-codeeditor-toggleimplbtn`)
    const $togglepreviewbtn = $wrapper.find(`.macro-codeeditor-togglepreviewbtn`)
    const $refreshpreviewbtn = $wrapper.find(`.macro-codeeditor-previewbtn`)
    const $header = $wrapper.find(`> header`)
    const $codepane = $wrapper.find('.macro-codeeditor-codepane')
    const $previewpane = $wrapper.find('.macro-codeeditor-previewpane')

    /** @type {ReturnType<typeof Split>|undefined} */
    let split = undefined // Split.js instance

    function refreshPreview() {
      const $target = $previewpane.children().last()
      $target.empty()
      $target.wiki(`<<devcodeeditorpreview ${varname} '${varname}'>>`)
    }

    function setToolbarEnabled(value) {
      if (value) {
        $header.removeClass('disabled')
      } else {
        $header.addClass('disabled')
      }
    }

    function setPreviewPaneVisible(value) {
      if (value) {
        //if (split === undefined) // first time
        //refreshPreview()
        if (!split) {
          split = Split([$codepane.get(0), $previewpane.get(0)], {
            sizes: [60, 40],
            minSize: [200, 100],
          })
        }
        $previewpane.show()
        $togglepreviewbtn.children().attr("class", "sfa sfa-right-open")
      } else {
        if (split) {
          split.destroy()
          split = null
        }
        $previewpane.hide()
        $togglepreviewbtn.children().attr("class", "sfa sfa-left-open")
      }
    }

    $refreshpreviewbtn.on('click.macros', function () {
      refreshPreview()
    })

    $togglepreviewbtn.on('click.macros', function () {
      setPreviewPaneVisible(!split)
    })

    function setUseFallback(newvalue) {
      use_fallback = newvalue

      $main.css('display', use_fallback ? 'none' : 'block')
      $fallback.css('display', use_fallback ? 'block' : 'none')
      $toggleimplbtn.text(use_fallback ? '(switch to advanced editor)' : '(switch to simple editor)')

      const value = State.getVar(varname)
      if (use_fallback) {
        $textarea.val(value)
      } else {
        if (editor)
          editor.updateCode(value)
      }
    }

    $toggleimplbtn.on('click.macros', function () {
      setUseFallback(!use_fallback)
    })

    $textarea.on('change.macros', this.createShadowWrapper(function () {
      if (use_fallback)
        State.setVar(varname, this.value)
    }))

    $element.on('focus', () => !use_fallback && setToolbarEnabled(true))
    $element.on('blur', () => !use_fallback && setToolbarEnabled(false))
    $textarea.on('focus', () => use_fallback && setToolbarEnabled(true))
    $textarea.on('blur', () => use_fallback && setToolbarEnabled(false))

    // Toolbar
    {
      const toolbar_items = generateCodeEditorToolbarItems(retainEditorFocus)

      toolbar_items.push(
        menuItem({
          text: `Tools`,
          tooltip: `Various tools to help you write your content`,
          children: () => [
            menuItem({
              text: `Auto-indent and check brackets`,
              tooltip: `Automatically indentis your twine code based on the macros and html tags`,
              callback: () => {
                const existing = editor.toString()
                const result = setup.beautifyTwine(existing)
                editor.updateCode(result.text)
                if (result.errors.length) {
                  display_errors({
                    error_details: [
                      {
                        title: 'Custom',
                        errors: result.errors,
                      }
                    ],
                  })
                }
              },
            }),
            menuItem({
              text: `Set a temporary variable`,
              tooltip: `This gives an example how you can use temporary variables to make writing easier. For example, you can use it to refer to a certain drink that depends on the unit's trait.`,
              callback: () => {
                insertTextIntoEditor(`<<set _food = 'bread'>>
<<set $g.character = $unit.player>>
<<if $unit.player.isHasTrait('per_frugal')>>
  <<set _drink = 'water'>>
<<else>>
  <<set _drink = 'wine'>>
<</if>>
<p>
  <<Rep $g.character>> character|eat <<their $g.character>> <<= _food>> accompanied with a sip of <<= _drink>>.
</p>
`)
              },
            }),
          ],
        }),
      )

      toolbar_items.push( // settings
        menuItem({
          text: '<i class="sfa sfa-cog"></i>', children: () => [
            menuItem({
              checked: !use_fallback,
              text: "Advanced editor",
              callback: () => setUseFallback(!use_fallback)
            }),
            menuItem({
              checked: !!$(document.body).hasClass("codeeditor-simple"),
              text: "Simplified mode",
              callback: () => $(document.body).toggleClass("codeeditor-simple")
            }),
          ]
        }),
      )

      const $menu = $wrapper.find(".menu")
      for (const toolbaritem of toolbar_items)
        toolbaritem.appendTo($menu)
    }

    // Set the variable to the initial value
    State.setVar(varname, initial_value)

    $wrapper.appendTo(this.output)

    // Begin loading modules asynchronously
    loadCodeJar().then(({ Prism, CodeJar }) => {
      editor = CodeJar($element.get(0), Prism.highlightElement, {
        tab: ' '.repeat(2), // default is '\t'
        //indentOn: /[(\[]$/, // default is /{$/
        spellcheck: true,
        addClosing: false,
      })

      editor.onUpdate(code => {
        State.setVar(varname, code) // save variable value to state
      })

      setUseFallback(false)
      setPreviewPaneVisible(true)

    }, (err) => {
      console.warn('Failed to load CodeJar-based code editor:', err)
      // failed to load modules, so use fallback
      $toggleimplbtn.css("display", "none")
      setUseFallback(true)
    })
  }

})
