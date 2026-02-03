import { useMemo, useState } from 'react';
import { TiltButton } from '..';
import './app.css';

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

export default function App() {
    const [label, setLabel] = useState('Button');

    const [width, setWidth] = useState(400);
    const [faceHeight, setFaceHeight] = useState(120);
    const [elevation, setElevation] = useState(20);
    const [pressInset, setPressInset] = useState(10);
    const [tilt, setTilt] = useState(4);
    const [radius, setRadius] = useState(14);
    const [motion, setMotion] = useState(160);

    const [surfaceColor, setSurfaceColor] = useState('#2c2c39');
    const [sideColor, setSideColor] = useState('#b22b3b');
    const [textColor, setTextColor] = useState('#ffffff');

    const [borderColor, setBorderColor] = useState(null);
    const [borderWidth, setBorderWidth] = useState(null);

    const [glareColor, setGlareColor] = useState('#ffffff');
    const [glareOpacity, setGlareOpacity] = useState(0.075);
    const [glareWidth, setGlareWidth] = useState(40);

    const [disabled, setDisabled] = useState(false);

    const maxElevation = useMemo(() => faceHeight * 0.3, [faceHeight]);
    const clampedElevation = clamp(elevation, 0, maxElevation);

    const maxPressInset = clampedElevation;
    const clampedPressInset = clamp(pressInset, 0, maxPressInset);

    const maxTilt = Number((clampedElevation / 9).toFixed(2));
    const clampedTilt = clamp(tilt, 0, maxTilt);

    const faceVisibleHeight = faceHeight - clampedElevation;
    const maxRadius = Math.max(0, Math.floor(faceVisibleHeight / 4));
    const clampedRadius = clamp(radius, 0, maxRadius);

    if (elevation !== clampedElevation) setElevation(clampedElevation);
    if (pressInset !== clampedPressInset) setPressInset(clampedPressInset);
    if (tilt !== clampedTilt) setTilt(clampedTilt);
    if (radius !== clampedRadius) setRadius(clampedRadius);

    return (
        <div className='demo-root'>
            <div className='demo-preview'>
                <TiltButton
                    width={width}
                    height={faceHeight}
                    elevation={clampedElevation}
                    pressInset={clampedPressInset}
                    tilt={clampedTilt}
                    radius={clampedRadius}
                    motion={motion}
                    surfaceColor={surfaceColor}
                    sideColor={sideColor}
                    textColor={textColor}
                    borderColor={borderColor}
                    borderWidth={borderWidth}
                    glareColor={glareColor}
                    glareOpacity={glareOpacity}
                    glareWidth={glareWidth}
                    disabled={disabled}
                    onClick={() => console.log('clicked!')}
                >
                    <span style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{label}</span>
                </TiltButton>
                {/* <TiltDiv /> */}
            </div>

            <div className='demo-panel'>
                <h2>React Tilt Button Configurator</h2>

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
                        min={0}
                        max={1000}
                    />
                    <Control
                        label='Total Button Height'
                        value={faceHeight}
                        set={setFaceHeight}
                        min={0}
                        max={500}
                    />
                    <Control
                        label='Elevation'
                        value={clampedElevation}
                        set={setElevation}
                        min={0}
                        max={maxElevation}
                    />
                    <Control
                        label='Press Inset'
                        value={clampedPressInset}
                        set={setPressInset}
                        min={0}
                        max={maxPressInset}
                    />
                    <Control
                        label='Tilt'
                        value={clampedTilt}
                        set={setTilt}
                        min={0}
                        max={maxTilt}
                        step={0.1}
                    />
                    <Control
                        label='Radius'
                        value={clampedRadius}
                        set={setRadius}
                        min={0}
                        max={maxRadius}
                    />
                    <Control
                        label='Motion (ms)'
                        value={motion}
                        set={setMotion}
                        min={0}
                        max={600}
                    />
                    <Control
                        label='Border Width'
                        value={borderWidth}
                        set={setBorderWidth}
                        min={0}
                        max={10}
                    />
                    <Control
                        label='Glare Opacity'
                        value={glareOpacity}
                        set={setGlareOpacity}
                        min={0}
                        max={1}
                        step={0.01}
                    />
                    <Control
                        label='Glare Width (%)'
                        value={glareWidth}
                        set={setGlareWidth}
                        min={0}
                        max={100}
                        step={1}
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
                    <Color
                        label='Border'
                        value={borderColor}
                        set={setBorderColor}
                    />
                    <Color
                        label='Glare'
                        value={glareColor}
                        set={setGlareColor}
                    />
                </div>

                <div className='toggles'>
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
                <span className='value'>{Number(value).toFixed(2)}</span>
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
