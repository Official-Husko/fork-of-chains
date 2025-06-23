//
// This module will be compiled into a separate file, an will be loaded dynamically when devtool is accesed
// This avoids having to load some of the devtool-specific code along with some heavy dependencies of it
// during normal game operation, so the game loads faster and consumes less memory etc.
//

export { initializeCodeJar } from "./codejar/codejar-editor"

console.info('%c[DevTool]%c Loaded dynamic module', 'color: seagreen', '')
