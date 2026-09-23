/**
 * Shared motion presets.
 *
 * Two kinds of scroll motion live on this site:
 *  - Reveals: play once, on a clock, as soon as an element is meaningfully on screen.
 *    They finish while the section is still entering, never late.
 *  - Continuous effects (parallax, pinned tracks): scrubbed to scroll with `scrub: true`.
 *    Lenis already smooths the scroll, so no extra scrub lag is layered on top.
 *
 * Only transform, opacity, clip-path and colour are animated. Layout properties
 * (font-stretch, width, padding) are never tweened per frame.
 */
export const REVEAL_START = "top 88%";

export const reveal = (trigger: gsap.DOMTarget, start = REVEAL_START): ScrollTrigger.Vars => ({
  trigger,
  start,
  once: true,
});

export const EASE_OUT = "power3.out";
export const EASE_EXPO = "expo.out";
export const EASE_IN_OUT = "power2.inOut";
