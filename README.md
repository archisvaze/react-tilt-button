# React 3D Soft Button

A physically-inspired, squishy, depth-aware 3D button component for React.

This project exists because **great UI micro-interactions should not disappear just because a library gets deprecated.**

---

## Why this exists

For years, **react-awesome-button** was one of the nicest examples of a _tactile_, _physical_, _playful_ button on the web. It did not just animate, it **felt** like a real object:

- It had depth
- It squished when pressed
- It deformed when hovered
- It felt like a soft, physical surface

Unfortunately, the original library is now deprecated and no longer works reliably in modern React setups.

Rather than let this interaction pattern disappear, I decided to:

> Rebuild the idea from scratch, with modern React, minimal code, and zero dependencies.

This is **not a fork** and **not a port**. It is a **fresh, independent implementation** of the same _design philosophy_:

> UI elements should feel like objects, not flat rectangles.

---

## Philosophy

Most buttons today are:

- Flat
- Binary
- Lifeless

This button is:

- **Physical**
- **Deformable**
- **Depth-aware**
- **Tactile**

You do not just click it.  
You **press** it.

---

## What makes it special

- Real 3D depth using pure CSS transforms
- Face and side wall are separate surfaces
- Hover deformation (left / middle / right)
- Press compression that can go all the way to **zero height**
- Fully configurable physics:
    - Depth (elevation)
    - Press distance
    - Squishiness
    - Motion speed
- Cannot break, invert, or flip even with extreme values
- No dependencies
- No canvas
- No WebGL
- Just React + CSS

---

## Demo / Playground

The repo includes a **live control panel** where you can:

- Select different button presets
- Adjust:
    - Elevation
    - Press depth
    - Squish
    - Motion speed
    - Radius
- See the physics update in real time

This makes it easy to tune the button to match your product’s personality:

- Heavy and solid
- Light and snappy
- Soft and playful
- Sharp and clicky

---

## Usage

```
<Button
  elevation={14}
  pressInset={5}
  squish={2}
  motion={160}
  bordered
>
  Click Me
</Button>

```
