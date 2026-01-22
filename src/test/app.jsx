import { useEffect, useState } from 'react';
import { FiZap } from 'react-icons/fi';
import Button from '../Button';
import './app.css';

export default function App() {
    const [controls, setControls] = useState({
        elevation: 14,
        pressInset: 5,
        tilt: 2,
        motion: 160,
        radius: 14,
        width: 280,
        height: 70,
        surfaceColor: '#f3f4f6',
        sideColor: '#d1d5db',
        textColor: '#111827',
        bordered: true,
    });

    const MAX_ELEVATION_RATIO = 0.3;

    const maxElevation = Math.floor(controls.height * MAX_ELEVATION_RATIO);
    const effectiveElevation = Math.min(controls.elevation, maxElevation);

    const faceHeight = controls.height - effectiveElevation;
    const maxRadius = Math.max(0, Math.floor(faceHeight / 3));

    const maxTilt = Math.max(0, Number((effectiveElevation * 0.2).toFixed(2)));

    const update = (key, value) => {
        setControls((c) => ({ ...c, [key]: value }));
    };

    useEffect(() => {
        setControls((c) => {
            const next = { ...c };

            if (next.elevation > maxElevation) next.elevation = maxElevation;
            if (next.pressInset > next.elevation) next.pressInset = next.elevation;
            if (next.radius > maxRadius) next.radius = maxRadius;
            if (next.tilt > maxTilt) next.tilt = maxTilt;

            return next;
        });
    }, [controls.height, maxElevation, maxRadius]);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <header
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '30px',
                }}
            >
                <h1>React 3D Button Lab</h1>
                <p>Tune the physics. Feel the difference.</p>
            </header>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '30px' }}>
                <div style={{ width: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2>Live Button</h2>
                    <Button {...controls}>
                        <FiZap /> Editable Button
                    </Button>
                </div>

                <div style={{ width: '30%' }}>
                    <h2>Physics</h2>

                    <Slider
                        label={`Elevation (0–${maxElevation})`}
                        min={0}
                        max={maxElevation}
                        value={controls.elevation}
                        onChange={(v) => update('elevation', v)}
                    />

                    <Slider
                        label={`Press Inset (0–${effectiveElevation})`}
                        min={0}
                        max={effectiveElevation}
                        value={controls.pressInset}
                        onChange={(v) => update('pressInset', v)}
                    />

                    <Slider
                        label={`Tilt (0–${maxTilt})`}
                        min={0}
                        max={maxTilt}
                        step={0.1}
                        value={controls.tilt}
                        onChange={(v) => update('tilt', v)}
                    />

                    <Slider
                        label='Motion (60–400 ms)'
                        min={60}
                        max={400}
                        value={controls.motion}
                        onChange={(v) => update('motion', v)}
                    />

                    <Slider
                        label={`Radius (0–${maxRadius})`}
                        min={0}
                        max={maxRadius}
                        value={controls.radius}
                        onChange={(v) => update('radius', v)}
                    />

                    <h2>Size</h2>

                    <Slider
                        label='Width (120–500)'
                        min={120}
                        max={500}
                        value={controls.width}
                        onChange={(v) => update('width', v)}
                    />

                    <Slider
                        label='Height (40–160)'
                        min={40}
                        max={160}
                        value={controls.height}
                        onChange={(v) => update('height', v)}
                    />

                    <h2>Colors</h2>

                    <ColorInput
                        label='Surface'
                        value={controls.surfaceColor}
                        onChange={(v) => update('surfaceColor', v)}
                    />

                    <ColorInput
                        label='Side'
                        value={controls.sideColor}
                        onChange={(v) => update('sideColor', v)}
                    />

                    <ColorInput
                        label='Text'
                        value={controls.textColor}
                        onChange={(v) => update('textColor', v)}
                    />

                    <label className='checkbox'>
                        <input
                            type='checkbox'
                            checked={controls.bordered}
                            onChange={(e) => update('bordered', e.target.checked)}
                        />
                        Bordered
                    </label>
                </div>
            </div>
        </div>
    );
}

function Slider({ label, min, max, step = 1, value, onChange }) {
    return (
        <div className='slider'>
            <div className='slider-label'>
                <span>{label}</span>
                <strong>{value}</strong>
            </div>
            <input
                type='range'
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </div>
    );
}

function ColorInput({ label, value, onChange }) {
    return (
        <div className='color-input'>
            <span>{label}</span>
            <input
                type='color'
                value={isHexColor(value) ? value : '#ffffff'}
                onChange={(e) => onChange(e.target.value)}
            />
            <input
                type='text'
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function isHexColor(str) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(str);
}
