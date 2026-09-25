import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_MOTION, hexToRgb, resolveColors, resolveGeometry, resolveSpring } from './geometry';

// useLayoutEffect warns during SSR
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// How far (px) a pressed pointer can leave the button before the press is cancelled
const CANCEL_SLOP = 20;

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
        if (!mq) return undefined;
        const update = () => setReduced(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    return reduced;
}

/**
 * Props, geometry, pointer and keyboard handling for TiltButton.
 * Sends the target pose to `animateRef.current(targets, instant)` whenever it changes.
 */
export function useTiltButton(props, animateRef) {
    const {
        children,
        onClick,
        disabled = false,

        variant = 'solid',

        elevation = 14,
        pressInset = 5,
        tilt = 2,
        pressTilt = true,
        motion = DEFAULT_MOTION,
        spring = 'bouncy',
        squish = 0.5,

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
        type = 'button',
        style: userStyle,
        ...rest
    } = props;

    const rootRef = useRef(null);
    const releaseTimerRef = useRef(null);
    const stateRef = useRef({ nx: 0, hover: false, pressed: false, cancelled: false, byKey: false, pressStart: 0, suppressClick: false });

    const [box, setBox] = useState(null);
    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);

    const reducedMotion = usePrefersReducedMotion();
    const motionMs = Math.max(0, Number(motion) || 0);
    const instant = reducedMotion || motionMs === 0;

    const geometry = useMemo(
        () => resolveGeometry({ width, height, elevation, pressInset, tilt, radius, squish }, box),
        [width, height, elevation, pressInset, tilt, radius, squish, box],
    );

    // Compare by value so an inline spring object doesn't reset the springs on every render
    const springKey = spring && typeof spring === 'object' ? JSON.stringify(spring) : String(spring);
    const springConfig = useMemo(
        () => resolveSpring(springKey.startsWith('{') ? JSON.parse(springKey) : springKey, motionMs),
        [springKey, motionMs],
    );

    // Latest values for the event handlers
    const latest = useRef({});
    useIsoLayoutEffect(() => {
        latest.current = { geometry, instant, pressTilt, disabled, minHold: motionMs * 0.6 };
    });

    // Measure the real size so string widths like '100%' work
    useIsoLayoutEffect(() => {
        const el = rootRef.current;
        if (!el) return undefined;

        const measure = () => {
            const next = { width: el.clientWidth, height: el.clientHeight };
            setBox((prev) => (prev && prev.width === next.width && prev.height === next.height ? prev : next));
        };

        measure();
        if (typeof ResizeObserver === 'undefined') return undefined;

        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const push = useCallback(() => {
        const s = stateRef.current;
        const { geometry: g, instant: now, pressTilt: keepTilt } = latest.current;
        if (!g) return;

        const pressing = s.pressed && !s.cancelled;
        const hovering = s.hover && !s.cancelled;
        const lean = g.tilt * s.nx;

        animateRef.current(
            {
                press: pressing ? g.inset : hovering ? g.tilt * (1 - Math.abs(s.nx)) : 0,
                skew: pressing ? (keepTilt ? lean : 0) : hovering ? lean : 0,
                squash: pressing ? 1 : 0,
                glare: 50 - s.nx * 50,
            },
            now,
        );
    }, [animateRef]);

    useIsoLayoutEffect(() => {
        push();
    }, [geometry, pressTilt, instant, push]);

    const clearInteraction = useCallback(() => {
        clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;
        Object.assign(stateRef.current, { hover: false, pressed: false, cancelled: false, byKey: false, nx: 0 });
        push();
    }, [push]);

    const reset = () => {
        clearInteraction();
        setHover(false);
        setActive(false);
    };

    // Reset hover/active when disabled (adjusting state on a prop change, as in the React docs)
    const [wasDisabled, setWasDisabled] = useState(disabled);
    if (disabled !== wasDisabled) {
        setWasDisabled(disabled);
        if (disabled) {
            setHover(false);
            setActive(false);
        }
    }

    useEffect(() => {
        if (disabled) clearInteraction();
    }, [disabled, clearInteraction]);

    useEffect(() => () => clearTimeout(releaseTimerRef.current), []);

    const pointerX = (e) => {
        const rect = rootRef.current.getBoundingClientRect();
        return Math.max(-1, Math.min(1, ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1));
    };

    const isNear = (e) => {
        const rect = rootRef.current.getBoundingClientRect();
        return (
            e.clientX >= rect.left - CANCEL_SLOP &&
            e.clientX <= rect.right + CANCEL_SLOP &&
            e.clientY >= rect.top - CANCEL_SLOP &&
            e.clientY <= rect.bottom + CANCEL_SLOP
        );
    };

    const release = () => {
        const s = stateRef.current;
        s.pressed = false;
        s.cancelled = false;
        setActive(false);
        setHover(s.hover);
        push();
    };

    /* ── Pointer ── */

    const handlePointerEnter = (e) => {
        if (disabled || e.pointerType === 'touch') return;
        const s = stateRef.current;
        s.hover = true;
        s.nx = pointerX(e);
        setHover(true);
        push();
    };

    const handlePointerMove = (e) => {
        if (disabled) return;
        const s = stateRef.current;

        // Touch only tilts while pressed
        if (!s.pressed && !s.hover) return;

        s.nx = pointerX(e);

        if (s.pressed && !s.byKey) {
            const cancelled = !isNear(e);
            if (cancelled !== s.cancelled) {
                s.cancelled = cancelled;
                setActive(!cancelled);
            }
        }

        push();
    };

    const handlePointerDown = (e) => {
        if (disabled) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;

        try {
            rootRef.current.setPointerCapture(e.pointerId);
        } catch {
            // Can throw if the pointer is already gone
        }

        const s = stateRef.current;
        Object.assign(s, {
            nx: pointerX(e),
            pressed: true,
            cancelled: false,
            byKey: false,
            suppressClick: false,
            pressStart: performance.now(),
            hover: e.pointerType === 'mouse',
        });

        setActive(true);
        push();
    };

    const handlePointerUp = (e) => {
        const s = stateRef.current;
        if (disabled || !s.pressed || s.byKey) return;

        try {
            if (rootRef.current.hasPointerCapture(e.pointerId)) rootRef.current.releasePointerCapture(e.pointerId);
        } catch {
            // Already released
        }

        // Released away from the button: cancel the click, like a native button
        s.suppressClick = s.cancelled;
        s.hover = e.pointerType === 'mouse' && !s.cancelled;

        // Keep quick taps pressed briefly so the animation is visible
        const wait = latest.current.minHold - (performance.now() - s.pressStart);

        if (wait > 0 && !s.cancelled) {
            releaseTimerRef.current = setTimeout(() => {
                releaseTimerRef.current = null;
                release();
            }, wait);
        } else {
            release();
        }
    };

    const handlePointerLeave = (e) => {
        const s = stateRef.current;
        if (disabled || e.pointerType === 'touch') return;

        // Pointer capture keeps tracking while pressed
        if (s.pressed && !releaseTimerRef.current) return;

        s.hover = false;
        if (!s.pressed) s.nx = 0;
        setHover(false);
        push();
    };

    const handlePointerCancel = () => {
        // The browser took over (e.g. scrolling), so never click
        stateRef.current.suppressClick = true;
        reset();
    };

    /* ── Keyboard ── */

    const handleKeyDown = (e) => {
        if (disabled || (e.key !== 'Enter' && e.key !== ' ')) return;

        // Prevent Space from scrolling. Enter must not be prevented, it fires the native click on keydown.
        if (e.key === ' ') e.preventDefault();
        if (e.repeat) return;

        Object.assign(stateRef.current, { pressed: true, cancelled: false, byKey: true, nx: 0 });
        setActive(true);
        push();
    };

    const handleKeyUp = (e) => {
        const s = stateRef.current;
        if (disabled || !s.byKey || (e.key !== 'Enter' && e.key !== ' ')) return;
        s.byKey = false;
        release();
    };

    const handleBlur = () => {
        if (stateRef.current.byKey) {
            stateRef.current.byKey = false;
            release();
        }
    };

    const handleClick = (e) => {
        const s = stateRef.current;

        // Swallow the click after a cancelled press. Keyboard clicks (detail 0) always pass.
        if (s.suppressClick && e.detail !== 0) {
            s.suppressClick = false;
            e.preventDefault();
            return;
        }

        s.suppressClick = false;
        if (!disabled) onClick?.(e);
    };

    /* ── Props for the <button> ── */

    const colors = resolveColors(variant, { surfaceColor, sideColor, textColor, borderColor, borderWidth });

    const style = {
        '--button-raise-level': `${geometry.e}px`,
        '--press-inset': `${geometry.inset}px`,
        '--button-hover-pressure': geometry.tilt,
        '--transform-speed': `${motionMs}ms`,
        '--radius': `${geometry.r}px`,

        '--surface-color': colors.surface,
        '--side-color': colors.side,
        '--text-color': colors.text,
        '--border-color': colors.border,
        '--border-width': `${colors.borderWidth}px`,

        '--glare-rgb': hexToRgb(glareColor),
        '--glare-alpha': glareOpacity,
        '--glare-width': glareWidth,

        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,

        ...(userStyle && typeof userStyle === 'object' ? userStyle : {}),
    };

    const classes = [
        'soft-btn',
        hover && 'soft-btn--hover',
        active && 'soft-btn--active',
        disabled && 'soft-btn--disabled',
        pressTilt && 'soft-btn--press-tilt',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return {
        children,
        geometry,
        springConfig,
        instant,
        buttonProps: {
            ...rest,
            ref: rootRef,
            type,
            className: classes,
            style,
            disabled,
            'aria-disabled': disabled || undefined,
            onPointerEnter: handlePointerEnter,
            onPointerMove: handlePointerMove,
            onPointerDown: handlePointerDown,
            onPointerUp: handlePointerUp,
            onPointerLeave: handlePointerLeave,
            onPointerCancel: handlePointerCancel,
            onKeyDown: handleKeyDown,
            onKeyUp: handleKeyUp,
            onBlur: handleBlur,
            onClick: handleClick,
        },
    };
}
