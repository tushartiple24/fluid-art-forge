# Electric Fluid Studio

i want to create live dynamic,high intensity 3d animated personalised website smooth liquid art flowing type animated pioertfolio website for me."System & Tech Stack Requirements

Build a single-page portfolio application using React, Vite, and Tailwind CSS.

Use Framer Motion for smooth DOM-based scroll and hover animations.

Integrate @react-three/fiber and @react-three/drei for the 3D liquid background and interactive elements.

Implement a custom GLSL Fragment Shader via React Three Fiber to create a high-intensity, fluid, viscous metallic liquid background that reacts to mouse coordinates.

Global Aesthetics

Enforce a strict dark mode theme using bg-black or deep obsidian (#050505).

Use vibrant electric blue (#00f0ff) and neon green (#39ff14) for high-contrast accents, typography highlights, and 3D lighting (PointLights inside the Canvas).

Typography should use a sleek, modern sans-serif font (like Inter or Space Grotesk).

Hero Section Components

3D Canvas: Center a 3D morphing sphere using React Three Fiber. Apply a MeshPhysicalMaterial with high metalness (1.0) and low roughness (0.1). On hover, use Framer Motion 3D to animate its geometry to subtly resemble a modern letter "T" stylized as a downward-pointing sword.

Overlay Text: Positioned absolute over the canvas. Include a glowing primary heading: "Tushar Tiple".

Subtitle: Typewriter effect or smooth fade-in for: "Computer Engineering Student & Beginner Researcher."

About & Domains Section

Create a z-index layer above the WebGL canvas so the liquid background continues to flow underneath.

Build a bento-box grid or staggered layout highlighting focus areas: Cryptography, Capture The Flag (CTF), and Machine Learning.

Add an on-mouse-enter event to these grid items that passes a prop to the React Three Fiber canvas, causing the fluid shader's wave frequency and amplitude to spike.

Project Showcase (Horizontal Scroll)

Implement a Framer Motion horizontal scroll container.

Project 1 - VarunEye: Create a card with a sleek glassmorphism effect (backdrop-blur-md, bg-white/5). Highlight its machine learning focus (YOLOv8, PostgreSQL). On hover, add a subtle neon green bounding-box animation to the card borders.

Project 2 - Arogya: Create a second glassmorphism card for this IoT Smart Health Hub. On hover, trigger a particle animation or dotted-grid background effect inside the card to simulate interconnected sensor data.

Footer Section

Smooth gradient fade to pitch black.

Include clean social icons (GitHub, GDC) that scale up by 1.1x and drop a glowing shadow (shadow-[0_0_15px_#00f0ff]) on hover.

Add a final line of text: "System Secured.""

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/28e87ddf-f49c-40c3-b26c-6dd4717fdd9a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
