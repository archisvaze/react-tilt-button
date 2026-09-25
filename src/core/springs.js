const REST = 0.002;

// A few damped springs sharing one config and one rAF loop.
// The loop only runs while something is moving, and calls onFrame with the current values.
export function createSpringEngine(initial, onFrame) {
    const springs = {};
    for (const key of Object.keys(initial)) {
        springs[key] = { x: initial[key], v: 0, target: initial[key] };
    }

    let config = { stiffness: 420, damping: 17, mass: 1 };
    let raf = 0;
    let last = 0;

    const engine = {
        values() {
            const out = {};
            for (const key of Object.keys(springs)) out[key] = springs[key].x;
            return out;
        },

        configure(next) {
            config = next;
        },

        to(targets, instant = false) {
            for (const key of Object.keys(targets)) {
                const s = springs[key];
                if (!s) continue;
                s.target = targets[key];
                if (instant) {
                    s.x = s.target;
                    s.v = 0;
                }
            }

            if (instant) {
                engine.stop();
                engine.paint();
                return;
            }

            if (!raf) {
                last = performance.now();
                raf = requestAnimationFrame(tick);
            }
        },

        paint() {
            onFrame(engine.values());
        },

        stop() {
            cancelAnimationFrame(raf);
            raf = 0;
        },
    };

    function tick(now) {
        // Cap the frame delta so springs don't jump after a background tab
        const dt = Math.min(Math.max(now - last, 0) / 1000, 1 / 30);
        last = now;

        const { stiffness: k, damping: c, mass: m } = config;

        // Substeps keep stiff springs stable
        const h = Math.min(1 / 240, 0.5 / Math.sqrt(k / m));
        const steps = Math.max(1, Math.ceil(dt / h));
        const step = dt / steps;

        let moving = false;

        for (const key of Object.keys(springs)) {
            const s = springs[key];

            for (let i = 0; i < steps; i++) {
                s.v += ((-k * (s.x - s.target) - c * s.v) / m) * step;
                s.x += s.v * step;
            }

            if (Math.abs(s.x - s.target) < REST && Math.abs(s.v) < REST) {
                s.x = s.target;
                s.v = 0;
            } else {
                moving = true;
            }
        }

        engine.paint();
        raf = moving ? requestAnimationFrame(tick) : 0;
    }

    return engine;
}
