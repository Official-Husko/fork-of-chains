// @ts-nocheck


// NOTE: Must add at least one element to SugarCube's Settings to avoid
// the "Settings" sidebar button being made invisible
Setting.addHeader('')

// Overwrite the SugarCube's sidemenu "Settings" button on-click handler
document.querySelector('#menu-item-settings > a')?.addEventListener?.('mousedown', (ev) => {
  ev.stopPropagation()
  ev.preventDefault()
  setup.DOM.Menu.Settings.opendialog()
}, true)

$(document).one(':storyready', () => {
  const share_btn = document.querySelector('#menu-item-share > a')
  if (share_btn) {
    share_btn.textContent = 'Links'
  }
})
