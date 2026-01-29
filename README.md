# TiltyButton

A physical, 3D-style React button that:

- Tilts on hover (left / middle / right)
- Squishes on press
- Has a visible “side wall” (depth)
- Enforces physical constraints so it never breaks
- Supports **predefined style variants**
- Is fully configurable via props

Inspired by `react-awesome-button`, but implemented as a small, dependency-free component.

---

## Installation

```bash
npm install tilty-button
```

```jsx
import { TiltyButton } from 'tilty-button';
import '/node_modules/tilty-button/dist/tilty-button.css';
```

---

## Basic Usage

```jsx
<TiltyButton onClick={() => alert('Clicked!')}>Click me</TiltyButton>
```

---

## Using Variants

Variants are **predefined visual styles** (material / theme presets).

```jsx
<TiltyButton variant="solid">Solid</TiltyButton>
<TiltyButton variant="outline">Outline</TiltyButton>
<TiltyButton variant="arcade">Arcade</TiltyButton>
<TiltyButton variant="carbon">Carbon</TiltyButton>
<TiltyButton variant="warning">Warning</TiltyButton>
```

You can still override any value manually:

```jsx
<TiltyButton
    variant='solid'
    surfaceColor='#10b981'
>
    Custom Green
</TiltyButton>
```

---

## Full Example

```jsx
<TiltyButton
    variant='arcade'
    width={400}
    height={120}
    elevation={20}
    pressInset={10}
    tilt={4}
    radius={14}
    motion={160}
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

---

### Variant

| Prop      | Type   | Default | Description                    |
| --------- | ------ | ------- | ------------------------------ |
| `variant` | string | `solid` | Predefined visual style preset |

---

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

---

### Colors (Optional Overrides)

These override the selected variant.

| Prop           |
| -------------- |
| `surfaceColor` |
| `sideColor`    |
| `textColor`    |

---

### Border (Optional Overrides)

| Prop          |
| ------------- |
| `bordered`    |
| `borderColor` |
| `borderWidth` |

---

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
- This is a **physical UI primitive**, not a flat semantic button

---

## Styling

All visuals are driven by CSS variables:

- `--button-raise-level`
- `--press-inset`
- `--button-hover-pressure`
- `--radius`
- `--surface-color`
- `--side-color`
- `--text-color`
- `--border-color`
- `--border-width`

So you can theme it externally if needed.

---

## Philosophy

This is not a flat UI button.

It is a **physical, tactile UI primitive** that behaves like an object:

- It has depth
- It deforms
- It squishes
- It reacts to pressure

---

## License

Use it. Ship it. Modify it.
