
// Implements handlers for the browser drag & drop events
//
// Currently supports:
//  - Setting custom image to an unit by drag&dropping an image while inside their details page
//    (only works for images inside 'customunit')
//

document.body.addEventListener("drop", function(ev) {
  // prevent browser default behavior (open the file)
  ev.preventDefault();

  let file = null
  if (ev.dataTransfer.items) {
    for (let i = 0; i < ev.dataTransfer.items.length; ++i) {
      if (ev.dataTransfer.items[i].kind === 'file') {
        file = ev.dataTransfer.items[i].getAsFile()
        break
      }
    }
  } else if (ev.dataTransfer.files.length > 0) {
    file = ev.dataTransfer.files[0]
  }

  if (!file)
    return

  if (/\.(jpg|png|gif)$/.test(file.name)) { // is image?
    
    const dialog = document.getElementById("ui-dialog")
    if (dialog && dialog.classList.contains("open")) {
      const input = dialog.querySelector(".custom input")
      if (input instanceof HTMLInputElement) { // Unit image picker dialog
        input.value = file.name
        input.dispatchEvent(new Event('input'))
      }
    } else {
      // Unit details: try to assign custom image to unit
      if (State.variables.gPassage === "UnitDetail") {
        const unitkey = State.variables.gUnit_key
        const unit = State.variables.unit[unitkey]
        if (unit) {
          unit.custom_image_name = file.name
          setup.runSugarCubeCommand('<<focgoto>>')
        }
      }
    }

  }
  
})


document.body.addEventListener("dragover", function(ev) {
  // prevent browser default behavior (open the file)
  ev.preventDefault()
})
