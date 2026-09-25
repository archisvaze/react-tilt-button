import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { computePose, REST_POSE } from './core/geometry';
import { createSpringEngine } from './core/springs';
import { useTiltButton } from './core/useTiltButton';
import './TiltButton.css';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// The springs write straight to the DOM, so animating never re-renders React.
export default function TiltButton(props) {
    const animateRef = useRef(() => {});
    const { buttonProps, children, geometry, springConfig } = useTiltButton(props, animateRef);

    const wrapperRef = useRef(null);
    const faceRef = useRef(null);
    const sideRef = useRef(null);
    const geometryRef = useRef(geometry);

    const engineRef = useRef(null);

    // Initial side wall for the first paint and SSR. The engine updates it after that.
    const restSide = useMemo(() => computePose(REST_POSE, geometry).side, [geometry]);

    useIsoLayoutEffect(() => {
        const engine = createSpringEngine(REST_POSE, (values) => {
            const wrapper = wrapperRef.current;
            const face = faceRef.current;
            const side = sideRef.current;
            if (!wrapper || !face || !side) return;

            const pose = computePose(values, geometryRef.current);
            wrapper.style.transform = pose.wrapper;
            face.style.transform = pose.face;
            face.style.setProperty('--glare-x', pose.glare);
            side.setAttribute('d', pose.side);
        });

        engineRef.current = engine;
        animateRef.current = (targets, instant) => engine.to(targets, instant);

        return () => {
            engine.stop();
            engineRef.current = null;
            animateRef.current = () => {};
        };
    }, []);

    useIsoLayoutEffect(() => {
        engineRef.current?.configure(springConfig);
    }, [springConfig]);

    useIsoLayoutEffect(() => {
        geometryRef.current = geometry;
        engineRef.current?.paint();
    }, [geometry]);

    return (
        <button {...buttonProps}>
            <span
                ref={wrapperRef}
                className='soft-btn__wrapper'
            >
                <svg
                    className='soft-btn__side'
                    aria-hidden='true'
                    focusable='false'
                >
                    <path
                        ref={sideRef}
                        d={restSide}
                    />
                </svg>
                <span
                    ref={faceRef}
                    className='soft-btn__content'
                >
                    <span className='soft-btn__inner'>{children}</span>
                </span>
            </span>
        </button>
    );
}
