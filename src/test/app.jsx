import { useState } from 'react';
import Box from '../Box';
import './app.css';

export default function App() {
    const [width, setWidth] = useState(300);
    const [height, setHeight] = useState(120); // top face depth
    const [depth, setDepth] = useState(80); // front face height
    const [bevel, setBevel] = useState(0.3);

    return (
        <div className='app'>
            <div className='controls'>
                <label>Width: {width}</label>
                <input
                    type='range'
                    min='0'
                    max='500'
                    value={width}
                    onChange={(e) => setWidth(+e.target.value)}
                />

                <label>Top Depth (height): {height}</label>
                <input
                    type='range'
                    min='0'
                    max='500'
                    value={height}
                    onChange={(e) => setHeight(+e.target.value)}
                />

                <label>Front Height (depth): {depth}</label>
                <input
                    type='range'
                    min='0'
                    max='500'
                    value={depth}
                    onChange={(e) => setDepth(+e.target.value)}
                />

                <label>Bevel: {bevel.toFixed(2)}</label>
                <input
                    type='range'
                    min='0'
                    max='0.6'
                    step='0.01'
                    value={bevel}
                    onChange={(e) => setBevel(+e.target.value)}
                />
            </div>

            <div className='stage'>
                <Box
                    width={width}
                    height={height}
                    depth={depth}
                    bevel={bevel}
                />
            </div>
        </div>
    );
}
