# TiltyButton

A physical, 3D-style React button that:

- Tilts on hover (left / middle / right)
- Squishes on press
- Has a visible “side wall” (depth)
- Enforces physical constraints so it never breaks
- Is fully configurable via props

Inspired by `react-awesome-button`, but implemented as a small, dependency-free component.

---

## Basic Usage

```jsx
import TiltyButton from './TiltyButton';

<TiltyButton onClick={() => alert('Clicked!')}>Click me</TiltyButton>;
```

---

## Full Example

```jsx
<TiltyButton
    width={400}
    height={120}
    elevation={20}
    pressInset={10}
    tilt={4}
    radius={14}
    motion={160}
    surfaceColor='#2c2c39'
    sideColor='#b22b3b'
    textColor='#ffffff'
    bordered
    borderColor='#d9445b'
    borderWidth={2}
>
    My Button
</TiltyButton>
```

---

## Physical Constraints (Important)

The component automatically clamps values:

- `elevation` ≤ `height * 0.3`
- `pressInset` ≤ `elevation`
- `tilt` ≤ `elevation / 9`
- `radius` ≤ `(height - elevation) / 4`

So the button:

- Never crashes
- Never inverts
- Never visually breaks

---

## Props

### Core

| Prop       | Type      | Default |
| ---------- | --------- | ------- |
| `children` | ReactNode | —       |
| `onClick`  | function  | —       |
| `disabled` | boolean   | `false` |

### Geometry

| Prop         | Type             | Default | Notes                          |
| ------------ | ---------------- | ------- | ------------------------------ |
| `width`      | number \| string | `260`   | No max                         |
| `height`     | number \| string | `64`    | No max                         |
| `elevation`  | number           | `14`    | Clamped to `height * 0.3`      |
| `pressInset` | number           | `5`     | Clamped to `<= elevation`      |
| `tilt`       | number           | `2`     | Clamped to `<= elevation / 9`  |
| `radius`     | number           | `14`    | Clamped to `<= faceHeight / 4` |
| `motion`     | number (ms)      | `160`   | Animation speed                |

### Colors

| Prop           | Default   |
| -------------- | --------- |
| `surfaceColor` | `#f3f4f6` |
| `sideColor`    | `#d1d5db` |
| `textColor`    | `#111827` |

### Border

| Prop          | Default            |
| ------------- | ------------------ |
| `bordered`    | `false`            |
| `borderColor` | `rgba(0,0,0,0.35)` |
| `borderWidth` | `2`                |

### Misc

| Prop        | Description               |
| ----------- | ------------------------- |
| `className` | Extra classes             |
| `style`     | Merged into inline styles |
| `...props`  | Passed to `<button>`      |

---

## Behavior

- Action fires on **mouse release**
- Hover is split into left / middle / right zones
- This is a **physical UI primitive**, not a flat button

---

## Styling

All visuals are driven by CSS variables, so you can theme it externally if needed.

---

## License

Use it. Ship it. Modify it.
