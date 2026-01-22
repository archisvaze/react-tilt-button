import { useState } from 'react';
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

    const update = (key, value) => {
        setControls((c) => ({ ...c, [key]: value }));
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1>React 3D Button Lab</h1>
                <p>Tune the physics. Break the rules. See what gets fixed.</p>
            </header>

            <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                <div style={{ width: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2>Live Button</h2>

                    <Button {...controls}>
                        <FiZap /> Editable Button
                    </Button>
                </div>

                <div style={{ width: '30%' }}>
                    <h2>Controls</h2>

                    <Slider
                        label='Elevation'
                        min={0}
                        max={200}
                        value={controls.elevation}
                        onChange={(v) => update('elevation', v)}
                    />
                    <Slider
                        label='Press Inset'
                        min={0}
                        max={200}
                        value={controls.pressInset}
                        onChange={(v) => update('pressInset', v)}
                    />
                    <Slider
                        label='Tilt'
                        min={0}
                        max={20}
                        step={0.1}
                        value={controls.tilt}
                        onChange={(v) => update('tilt', v)}
                    />
                    <Slider
                        label='Motion'
                        min={0}
                        max={500}
                        value={controls.motion}
                        onChange={(v) => update('motion', v)}
                    />
                    <Slider
                        label='Radius'
                        min={0}
                        max={200}
                        value={controls.radius}
                        onChange={(v) => update('radius', v)}
                    />

                    <h2>Size</h2>
                    <Slider
                        label='Width'
                        min={120}
                        max={500}
                        value={controls.width}
                        onChange={(v) => update('width', v)}
                    />
                    <Slider
                        label='Height'
                        min={40}
                        max={160}
                        value={controls.height}
                        onChange={(v) => update('height', v)}
                    />
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
