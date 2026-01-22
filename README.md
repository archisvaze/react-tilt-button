# SoftButton

A 2.5D button component with a few hard geometric constraints.

Inspired by the look of older 3D button libraries (e.g. react-awesome-button), but implemented from scratch.

---

## Geometry

- `height` = total height
- `elevation` = side thickness
- `faceHeight = height - elevation`

---

## Constraints

Inputs are clamped to:

- `elevation ≤ 0.3 * height`
- `pressInset ≤ elevation`
- `tilt ≤ elevation * 0.2`
- `radius ≤ faceHeight / 3`

If a value is outside its range, it is clamped and a warning is logged.

---

## Demo

The demo lets you exceed these values.  
The `Button` component always clamps internally.

---

## License

MIT
