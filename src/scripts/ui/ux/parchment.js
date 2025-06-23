
// Parchment CSS effect helpers
//  (Create SVG filter for wavy border)

const container = document.createElement("div")
container.innerHTML = `
<svg>
  <filter id="svg-effect-wavyborder">
    <feturbulence x="0" y="0" baseFrequency="0.02" numOctaves="5" seed="1"></feturbulence>
    <feDisplacementMap in="SourceGraphic" scale="20" />
  </filter>
</svg>
`
document.body.appendChild(container)
