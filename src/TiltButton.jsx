import { useRef, useState } from 'react';
import './TiltButton.css';
import { VARIANTS } from './variants';

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

export default function TiltButton({
    children,
    onClick,
    disabled = false,

    variant = 'solid',

    elevation = 14,
    pressInset = 5,
    tilt = 2,
    motion = 160,

    width = 260,
    height = 64,
    radius = 14,

    surfaceColor,
    sideColor,
    textColor,
    borderColor,
    borderWidth,

    glareColor = '#ffffff',
    glareOpacity = 0,
    glareWidth = 0,

    className = '',

    style: userStyle,
    ...props
}) {
    const rootRef = useRef(null);
    const [active, setActive] = useState(false);
    const [pos, setPos] = useState(null);

    const totalH = Math.max(0, Number(height) || 0);

    // Elevation
    const rawElevation = Math.max(0, Number(elevation) || 0);
    const MAX_ELEVATION_RATIO = 0.3;
    const maxElevation = totalH * MAX_ELEVATION_RATIO;
    const effectiveElevation = clamp(rawElevation, 0, maxElevation);

    // Press inset
    const rawPressInset = Math.max(0, Number(pressInset) || 0);
    const effectivePressInset = clamp(rawPressInset, 0, effectiveElevation);

    // Tilt
    const rawTilt = Math.max(0, Number(tilt) || 0);
    const maxTilt = Number((effectiveElevation / 9).toFixed(2));
    const effectiveTilt = clamp(rawTilt, 0, maxTilt);

    // Radius
    const faceHeight = totalH - effectiveElevation;
    const maxRadius = Math.max(0, Math.floor(faceHeight / 4));
    const rawRadius = Math.max(0, Number(radius) || 0);
    const effectiveRadius = clamp(rawRadius, 0, maxRadius);

    // Motion
    const motionMs = Math.max(0, Number(motion) || 0);

    function getPointerPos(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const w = rect.width || 1;

        if (x < w * 0.33) return 'left';
        if (x > w * 0.66) return 'right';
        return 'middle';
    }

    const handlePointerDown = (e) => {
        if (disabled) return;
        if (e.button !== 0 && e.pointerType === 'mouse') return;

        const el = rootRef.current;
        if (!el) return;

        el.setPointerCapture(e.pointerId);

        const next = getPointerPos(e, el);
        setPos((p) => (p === next ? p : next));
        setActive(true);
    };

    const handlePointerMove = (e) => {
        if (disabled) return;
        if (e.pointerType !== 'mouse') return;

        const el = rootRef.current;
        if (!el) return;

        const next = getPointerPos(e, el);
        setPos((p) => (p === next ? p : next));
    };

    const releasePointerState = (e) => {
        const el = rootRef.current;
        try {
            if (el?.hasPointerCapture(e.pointerId)) {
                el.releasePointerCapture(e.pointerId);
            }
        } catch {}

        setActive(false);
        setPos(null);

        if (disabled && active) {
            releasePointerState(e);
        }
    };

    const handlePointerUp = (e) => {
        if (disabled) return;
        releasePointerState(e);
        onClick && onClick(e);
    };

    const handlePointerLeave = (e) => {
        if (disabled) return;
        releasePointerState(e);
    };

    const handlePointerCancel = (e) => {
        releasePointerState(e);
    };

    const variantPreset = VARIANTS[variant] || VARIANTS.solid;

    const finalSurfaceColor = surfaceColor ?? variantPreset.surfaceColor;
    const finalSideColor = sideColor ?? variantPreset.sideColor;
    const finalTextColor = textColor ?? variantPreset.textColor;

    const finalBorderColor =
        typeof borderColor === 'string' && borderColor.trim() !== '' ? borderColor : variantPreset.borderColor || 'transparent';
    const finalBorderWidth = typeof borderWidth === 'number' && borderWidth >= 0 ? borderWidth : (variantPreset.borderWidth ?? 0);

    const styleVars = {
        '--button-raise-level': `${effectiveElevation}px`,
        '--press-inset': `${effectivePressInset}px`,
        '--button-hover-pressure': effectiveTilt,
        '--transform-speed': `${motionMs}ms`,
        '--radius': `${effectiveRadius}px`,

        '--surface-color': finalSurfaceColor,
        '--side-color': finalSideColor,
        '--text-color': finalTextColor,
        '--border-color': finalBorderColor,
        '--border-width': `${finalBorderWidth}px`,

        '--glare-rgb': hexToRgb(glareColor),
        '--glare-alpha': glareOpacity,
        '--glare-width': glareWidth,

        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    const safeUserStyle = userStyle && typeof userStyle === 'object' ? userStyle : {};

    const mergedStyle = {
        ...styleVars,
        ...safeUserStyle,
    };

    const classes = ['soft-btn', active && 'soft-btn--active', pos && `soft-btn--${pos}`, disabled && 'soft-btn--disabled', className]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            {...props}
            ref={rootRef}
            className={classes}
            style={mergedStyle}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerCancel}
            disabled={disabled}
        >
            <span className='soft-btn__wrapper'>
                <span className='soft-btn__content'>
                    <span className='soft-btn__inner'>{children}</span>
                </span>
            </span>
        </button>
    );
}

function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') {
        return '255,255,255';
    }
    let h = hex.replace('#', '');
    if (h.length === 3) {
        h = h
            .split('')
            .map((c) => c + c)
            .join('');
    }
    if (h.length !== 6) {
        return '255,255,255';
    }

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `${r},${g},${b}`;
}
