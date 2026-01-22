import './Box.css';

export default function Box({ width = 300, height = 120, depth = 80, bevel = 0.3 }) {
    // --- Perspective control ---
    const BEVEL_RATIO = bevel; // now controlled from outside
    const MIN_BOTTOM_WIDTH = 16; // prevents pointy shape

    const desiredInset = depth * 0.5;

    const maxInsetByWidth = (width - MIN_BOTTOM_WIDTH) / 2;
    const maxInsetByDesign = width * BEVEL_RATIO;

    const inset = Math.max(0, Math.min(desiredInset, maxInsetByWidth, maxInsetByDesign));

    const style = {
        '--w': `${width}px`,
        '--topH': `${height}px`,
        '--frontH': `${depth}px`,
        '--inset': `${Math.round(inset)}px`,
    };

    return (
        <div
            className='box'
            style={style}
        >
            <div className='box-top' />
            <div className='box-front' />
        </div>
    );
}
