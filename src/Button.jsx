import { useRef, useState } from 'react';
import './button.css';

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

export default function Button({
    children,
    onClick,
    disabled = false,

    elevation = 14,
    pressInset = 5,
    tilt = 2,
    motion = 160,

    width = 260,
    height = 64,
    radius = 14,

    surfaceColor = '#f3f4f6',
    sideColor = '#d1d5db',
    textColor = '#111827',

    bordered = false,
    className = '',
}) {
    const rootRef = useRef(null);
    const [active, setActive] = useState(false);
    const [pos, setPos] = useState(null);

    // =========================
    // SIMPLE PHYSICAL CLAMPS
    // =========================

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
    const maxRadius = Math.max(0, Math.floor(faceHeight / 3));
    const rawRadius = Math.max(0, Number(radius) || 0);
    const effectiveRadius = clamp(rawRadius, 0, maxRadius);

    // Motion
    const motionMs = Math.max(0, Number(motion) || 0);

    // =========================
    // INTERACTION
    // =========================

    const handleMouseMove = (e) => {
        if (disabled) return;
        const el = rootRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const w = rect.width;

        if (x < w * 0.33) setPos('left');
        else if (x > w * 0.66) setPos('right');
        else setPos('middle');
    };

    const handleMouseLeave = () => {
        setPos(null);
        setActive(false);
    };

    const handleMouseDown = (e) => {
        if (disabled) return;
        if (e.button !== 0) return;
        setActive(true);
    };

    const handleMouseUp = (e) => {
        if (disabled) return;
        setActive(false);
        onClick && onClick(e);
    };

    // =========================
    // CSS VARS
    // =========================

    const styleVars = {
        '--button-raise-level': `${effectiveElevation}px`,
        '--press-inset': `${effectivePressInset}px`,
        '--button-hover-pressure': effectiveTilt,
        '--transform-speed': `${motionMs}ms`,
        '--radius': `${effectiveRadius}px`,

        '--surface-color': surfaceColor,
        '--side-color': sideColor,
        '--text-color': textColor,

        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    const classes = [
        'soft-btn',
        active && 'soft-btn--active',
        pos && `soft-btn--${pos}`,
        disabled && 'soft-btn--disabled',
        bordered && 'soft-btn--bordered',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            ref={rootRef}
            className={classes}
            style={styleVars}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
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
