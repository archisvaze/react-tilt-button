import { VARIANTS } from '../variants';

const DEG = Math.PI / 180;

// Bezier handle ratio for a quarter circle, matches CSS border-radius
const ARC = 0.5523;

const MAX_ELEVATION_RATIO = 0.5;

// squish={1} scales the body by 6%
const MAX_SQUISH = 0.06;

// The side wall extends under the face to avoid a seam
const OVERLAP = 1;

export const DEFAULT_MOTION = 160;

export const SPRING_PRESETS = {
    bouncy: { stiffness: 420, damping: 17, mass: 1 },
    jelly: { stiffness: 320, damping: 9, mass: 1 },
    snappy: { stiffness: 700, damping: 28, mass: 1 },
    stiff: { stiffness: 500, damping: 45, mass: 1 },
};

export const REST_POSE = { press: 0, skew: 0, squash: 0, glare: 50 };

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const num = (v) => Math.max(0, Number(v) || 0);
const round = (v) => Math.round(v * 100) / 100;
const fine = (v) => Math.round(v * 10000) / 10000;

// Props to pixel geometry. Uses the measured size when available, otherwise numeric width/height (SSR).
export function resolveGeometry({ width, height, elevation, pressInset, tilt, radius, squish }, box) {
    const W = box ? box.width : num(width);
    const H = box ? box.height : num(height);

    const e = clamp(num(elevation), 0, H * MAX_ELEVATION_RATIO);
    const inset = clamp(num(pressInset), 0, e);
    const maxTilt = clamp(num(tilt), 0, Number((e / 9).toFixed(2)));
    const F = Math.max(0, H - e);

    // The side wall follows the face, so the radius only needs to fit the face
    const r = clamp(num(radius), 0, Math.min(W, F) / 2);

    return { W, H, F, e, inset, tilt: maxTilt, r, squish: clamp(Number(squish) || 0, 0, 1) * MAX_SQUISH };
}

// `spring` is a preset name or { stiffness, damping, mass }.
// `motion` scales the timing (160 is the preset's natural speed) without changing how bouncy it is.
export function resolveSpring(spring, motionMs) {
    const base =
        spring && typeof spring === 'object'
            ? { ...SPRING_PRESETS.bouncy, ...spring }
            : SPRING_PRESETS[spring] || SPRING_PRESETS.bouncy;

    const scale = Math.max(motionMs, 1) / DEFAULT_MOTION;

    return {
        stiffness: base.stiffness / (scale * scale),
        damping: base.damping / scale,
        mass: base.mass,
    };
}

export function resolveColors(variant, { surfaceColor, sideColor, textColor, borderColor, borderWidth }) {
    const preset = VARIANTS[variant] || VARIANTS.solid;

    return {
        surface: surfaceColor ?? preset.surfaceColor,
        side: sideColor ?? preset.sideColor,
        text: textColor ?? preset.textColor,
        border:
            typeof borderColor === 'string' && borderColor.trim() !== '' ? borderColor : preset.borderColor || 'transparent',
        borderWidth: typeof borderWidth === 'number' && borderWidth >= 0 ? borderWidth : (preset.borderWidth ?? 0),
    };
}

export function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') return '255,255,255';

    let h = hex.replace('#', '');
    if (h.length === 3) {
        h = h
            .split('')
            .map((c) => c + c)
            .join('');
    }
    if (h.length !== 6) return '255,255,255';

    return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}

// Side wall path: the area between the face's current bottom edge and the fixed base.
// The face is offset by p px and skewed by t (tan of the angle) around its center.
function sidePath(W, H, F, r, p, t) {
    const cx = W / 2;
    const k = r * ARC;

    const face = (x, y) => `${round(x)} ${round(y - OVERLAP + (x - cx) * t + p)}`;

    return (
        `M${face(0, F - r)}` +
        `C${face(0, F - r + k)} ${face(r - k, F)} ${face(r, F)}` +
        `L${face(W - r, F)}` +
        `C${face(W - r + k, F)} ${face(W, F - r + k)} ${face(W, F - r)}` +
        `L${round(W)} ${round(H - r)}` +
        `C${round(W)} ${round(H - r + k)} ${round(W - r + k)} ${round(H)} ${round(W - r)} ${round(H)}` +
        `L${round(r)} ${round(H)}` +
        `C${round(r - k)} ${round(H)} 0 ${round(H - r + k)} 0 ${round(H - r)}` +
        'Z'
    );
}

// Maps spring values to styles. The face can't sink below the base, and the tilt is
// limited so the lowest corner always stays above it.
export function computePose({ press, skew, squash, glare }, geo) {
    const { W, H, F, e, r } = geo;

    const p = clamp(press, -e, e);

    const half = W / 2;
    const maxT = half > 0 ? Math.max(0, e - p) / half : 0;
    const t = clamp(Math.tan(skew * DEG), -maxT, maxT);

    const q = squash * geo.squish;

    return {
        face: `translateY(${round(p)}px) skewY(${fine(Math.atan(t) / DEG)}deg)`,
        wrapper: `scale(${fine(1 + q)}, ${fine(1 - q)})`,
        side: sidePath(W, H, F, r, p, t),
        glare: `${round(glare)}%`,
    };
}
