1) Back up your project.
2) Extract this ZIP into the project root and replace matching files.
3) Run: Remove-Item -Recurse -Force .next
4) Run: npm run build
5) If build succeeds, run: npm run dev
6) Push only these files:
   git add components/Hero.tsx components/CoffeeAlchemy.tsx hooks/use-smooth-scroll.tsx
   git commit -m "fix mobile visuals and desktop scroll"
   git push

Fixes included:
- CoffeeAlchemy build error: isMobile was used before declaration.
- Six mobile ice cubes positioned inside the viewport.
- Mobile pastry display crop uses the original hero background image.
- Desktop removes double smoothing by using direct ScrollTrigger scrub with Lenis.
