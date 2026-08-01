NOIR BEAN — Mobile Hero + First Load Patch

Replace the included files in the project root, preserving folders.
This patch:
- keeps desktop layout and animation breakpoints unchanged;
- centers and lifts the hero cup on mobile;
- removes the expensive 100x cup intro scale that caused startup jank;
- keeps the intro animation, with lighter mobile-only blur/scrub work;
- delays the non-critical auth request by 700ms;
- code-splits below-the-fold home sections;
- keeps CoffeeStory from your supplied version.

Then run:
  npm run build
  git add .
  git commit -m "Polish mobile hero and first load"
  git push
