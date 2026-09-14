# Build plan: Tushar Tiple liquid portfolio

## Outcome
A single-page portfolio at `/` with a deep obsidian visual system, electric cyan/neon green accents, a reactive GLSL liquid backdrop, a metallic interactive 3D centerpiece, smooth section reveals, bento expertise cards, horizontal project showcase, and an animated footer.

## User-visible work
- Replace the starter placeholder with the portfolio experience.
- Add a persistent canvas layer with a custom fragment shader that responds to pointer position and section hover intensity.
- Add a morphing metallic sphere/sword mark with cyan and green point lighting.
- Add navigation, hero copy, scroll cue, About/domains section, projects section, and social/footer close.
- Add motion states for text, cards, project hover effects, sensor particles, and responsive layout.
- Keep the page usable on touch/mobile by using responsive stacking and pointer-safe interactions.

## Technical details
- Install React Three Fiber, Drei, Three, Framer Motion, and Three types compatible with React 19.
- Keep the TanStack Start route structure and mount the 3D scene client-only (`ssr: false`).
- Add semantic OKLCH design tokens and font links in the root head; avoid component-level hardcoded color utilities.
- Implement reusable local components for the canvas, expertise cards, project cards, and footer/social controls.
- Use no external runtime image dependencies; the visual identity comes from the GLSL scene and DOM effects.
- Add route-specific metadata for the home page and remove all placeholder content.

## Verification
- Check the build error log after edits.
- Use Playwright at the required desktop viewport to confirm the rendered scene, text, hover states, scrollable projects, and console cleanliness.
- Check a narrow viewport for layout overflow and readable text.
