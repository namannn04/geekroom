/**
 * Geometry of the Geek Room mark, traced from the official logo (474 × 474 artwork, y down).
 * The left bracket closes into a G, the right one kicks out an R leg, and the slash is a
 * brush stroke with a notched left edge. Both the flat SVG and the 3D model read from here.
 */

export type Pt = [number, number];

/** Brand colours sampled from the logo. */
export const MARK_COLORS = { teal: "#04aeb7", orange: "#ef5a1f", white: "#fefefe" };

/** Bracket strokes are 20 units wide with round caps and joins. */
export const STROKE_W = 20;

/** G: top tip → point → bottom corner → up the G's spine. */
export const LEFT: Pt[] = [
  [169, 74],
  [52, 192],
  [170, 310],
  [170, 255],
];

/** R: top tip → point → inner corner → the kicked-out leg. */
export const RIGHT: Pt[] = [
  [303, 74],
  [420, 176],
  [303, 277],
  [340, 311],
];

export const EYES: { c: Pt; r: number }[] = [
  { c: [158.5, 185], r: 27.5 },
  { c: [310.5, 185], r: 27.5 },
];

/** Slash outline, clockwise from the top: smooth right edge, then the notched left edge back up. */
export const SLASH: Pt[] = [
  [276, 64], [279, 73], [277, 81], [275, 89], [272, 97], [270, 105], [268, 113], [266, 121],
  [264, 129], [262, 137], [259, 145], [257, 153], [255, 161], [253, 169], [251, 177], [248, 185],
  [246, 193], [244, 201], [242, 209], [240, 217], [237, 225], [235, 233], [233, 241], [230, 249],
  [228, 257], [226, 265], [224, 273], [222, 281], [219, 289], [217, 297], [215, 305], [212, 313],
  [210, 321], [209, 323], [206, 324], [204, 322], [202, 319], [200, 315], [198, 311], [197, 308],
  [196, 306], [195, 302], [194, 299], [195, 295], [196, 291], [197, 285], [198, 283], [199, 276],
  [200, 267], [202, 263], [204, 259], [205, 248], [207, 244], [208, 243], [209, 233], [210, 231],
  [212, 227], [214, 221], [215, 213], [217, 208], [218, 207], [219, 203], [220, 199], [222, 191],
  [224, 187], [225, 176], [227, 170], [229, 168], [230, 165], [231, 155], [233, 151], [234, 150],
  [235, 141], [236, 139], [238, 134], [240, 131], [241, 119], [242, 117], [244, 115], [245, 112],
  [246, 103], [248, 99], [250, 95], [251, 92], [253, 86], [254, 85], [255, 80], [257, 76],
  [260, 75], [262, 72], [264, 71], [266, 70], [269, 68], [272, 67], [273, 66],
];

/** Bounds of the whole mark with a little breathing room, as an SVG viewBox. */
export const VIEWBOX = { x: 32, y: 54, w: 408, h: 280 };

/** Visual centre used as the origin in 3D. */
export const CENTER: Pt = [236, 192];

export const toPath = (pts: Pt[], close = false) =>
  `M${pts.map(([x, y]) => `${x} ${y}`).join(" L")}${close ? " Z" : ""}`;
