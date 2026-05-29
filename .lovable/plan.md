## Problem
On mobile (viewport <1024px) the Nav's scroll-driven logo/tagline transition is gated by an `isDesktop` check:

```ts
const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
useMotionValueEvent(scrollY, "change", (latest) => {
  if (isDesktop) virtualScrollY.set(latest);
});
```

Because `virtualScrollY` never updates on mobile, the logo stays at its giant initial scale (2.5×) and pushed-down Y (7.5rem), and the "Vietnamese Cuisine" tagline never properly hides — producing the jarring behaviour the user described (tagline pops away, logo jumps, sticky header arrives late).

## Fix
1. Remove the `isDesktop` gate so `virtualScrollY` follows scroll on every breakpoint.
2. Re-evaluate `isDesktop`/initial-size constants on resize so the correct mobile vs desktop tween targets are used after orientation/resize.
3. Verify on the 390×844 preview that:
   - Logo smoothly scales from 2.5 → 1.5 over the first ~50px of scroll.
   - Tagline opacity + height tween from 1/auto → 0/0 in sync.
   - Sticky nav bar appears at the same threshold without a jump.

## Files
- `src/components/sections/Nav.tsx` — drop the desktop gate, switch the responsive constants to state updated on resize.

## Out of scope
- No Hero changes.
- No visual redesign of the nav itself.