import { useRef } from 'react';

export default function TiltDiv() {
    const ref = useRef(null);

    const MAX_TILT = 14;

    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // normalize to -1 -> 1
        const nx = (x / rect.width) * 2 - 1;
        const ny = (y / rect.height) * 2 - 1;

        const rotateY = nx * MAX_TILT;
        const rotateX = -ny * MAX_TILT;

        el.style.transform = `
      perspective(800px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.03)
    `;
    };

    const handleLeave = () => {
        const el = ref.current;
        if (!el) return;

        el.style.transform = `
      perspective(800px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
    };

    return (
        <div
            ref={ref}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            style={{
                width: 360,
                height: 220,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #2c2c39, #3b3b4f)',
                transition: 'transform 120ms ease-out',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                cursor: 'pointer',
                boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
            }}
        />
    );
}
