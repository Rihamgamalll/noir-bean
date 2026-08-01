NOIR BEAN — Scroll Choreography Finish

Changed files only:
- components/Hero.tsx
- components/CoffeeStory.tsx
- components/CoffeeAlchemy.tsx
- components/SiteProviders.tsx
- app/page.tsx
- app/globals.css

What was NOT changed:
- Images
- Colors
- Element sizes or layout classes
- GSAP animation keyframes/paths
- Section order
- Navbar, menu, closing scene, footer

What was changed:
- All cinematic sections mount together so ScrollTrigger measures the full page correctly.
- Mobile scrub delay is reduced, so animation follows the finger without trailing lag.
- Story and Alchemy receive longer mobile scroll distances so their animations finish before the next scene.
- Pin spacing and refresh order are explicit.
- Mobile Safari address-bar resizes no longer repeatedly rebuild every pinned scene.
- A debounced refresh runs after page load, fonts, and orientation changes.

After extracting into the project folder:
1. npm run build
2. git add .
3. git commit -m "Polish cinematic scroll choreography"
4. git push

Rollback if needed:
git reset --hard HEAD~1
git push --force
