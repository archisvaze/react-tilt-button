import { useState } from 'react';
import Button from '../Button';
import './app.css';

export default function App() {
    const [label, setLabel] = useState('Squishy Button');

    const [width, setWidth] = useState(260);
    const [faceHeight, setFaceHeight] = useState(52);
    const [elevation, setElevation] = useState(18);
    const [pressInset, setPressInset] = useState(6);
    const [tilt, setTilt] = useState(2);
    const [radius, setRadius] = useState(14);
    const [motion, setMotion] = useState(160);

    const [surfaceColor, setSurfaceColor] = useState('#f3f4f6');
    const [sideColor, setSideColor] = useState('#d1d5db');
    const [textColor, setTextColor] = useState('#111827');

    const [bordered, setBordered] = useState(false);
    const [disabled, setDisabled] = useState(false);

    return (
        <div className='demo-root'>
            <div className='demo-preview'>
                <Button
                    width={width}
                    height={faceHeight}
                    elevation={elevation}
                    pressInset={pressInset}
                    tilt={tilt}
                    radius={radius}
                    motion={motion}
                    surfaceColor={surfaceColor}
                    sideColor={sideColor}
                    textColor={textColor}
                    bordered={bordered}
                    disabled={disabled}

                >
                    {label}
                </Button>
            </div>

            <div className='demo-panel'>
                <h2>Solid Button Configurator</h2>

                <div className='group'>
                    <label>Label</label>
                    <input
                        type='text'
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />
                </div>

                <div className='grid'>
                    <Control
                        label='Width'
                        value={width}
                        set={setWidth}
                        min={120}
                        max={500}
                    />
                    <Control
                        label='Face Height'
                        value={faceHeight}
                        set={setFaceHeight}
                        min={32}
                        max={120}
                    />
                    <Control
                        label='Elevation'
                        value={elevation}
                        set={setElevation}
                        min={0}
                        max={120}
                    />
                    <Control
                        label='Press Inset'
                        value={pressInset}
                        set={setPressInset}
                        min={0}
                        max={80}
                    />
                    <Control
                        label='Tilt'
                        value={tilt}
                        set={setTilt}
                        min={0}
                        max={10}
                        step={0.1}
                    />
                    <Control
                        label='Radius'
                        value={radius}
                        set={setRadius}
                        min={0}
                        max={60}
                    />
                    <Control
                        label='Motion (ms)'
                        value={motion}
                        set={setMotion}
                        min={0}
                        max={600}
                    />
                </div>

                <div className='grid colors'>
                    <Color
                        label='Surface'
                        value={surfaceColor}
                        set={setSurfaceColor}
                    />
                    <Color
                        label='Side'
                        value={sideColor}
                        set={setSideColor}
                    />
                    <Color
                        label='Text'
                        value={textColor}
                        set={setTextColor}
                    />
                </div>

                <div className='toggles'>
                    <label>
                        <input
                            type='checkbox'
                            checked={bordered}
                            onChange={(e) => setBordered(e.target.checked)}
                        />
                        Bordered
                    </label>

                    <label>
                        <input
                            type='checkbox'
                            checked={disabled}
                            onChange={(e) => setDisabled(e.target.checked)}
                        />
                        Disabled
                    </label>
                </div>
            </div>
        </div>
    );
}

function Control({ label, value, set, min, max, step = 1 }) {
    return (
        <div className='control'>
            <div className='control-row'>
                <span>{label}</span>
                <span className='value'>{value}</span>
            </div>
            <input
                type='range'
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
            />
        </div>
    );
}

function Color({ label, value, set }) {
    return (
        <div className='control'>
            <div className='control-row'>
                <span>{label}</span>
                <span className='value'>{value}</span>
            </div>
            <input
                type='color'
                value={value}
                onChange={(e) => set(e.target.value)}
            />
        </div>
    );
}
