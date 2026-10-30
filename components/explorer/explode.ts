/**
 * Eased animation amounts shared by every <Part>. Written once per frame by
 * drivers in the canvas and read inside useFrame, so dragging the slider or
 * switching the wings never re-renders the React tree.
 */
export const explodeProgress = { value: 0 };

/** Movable wing elements: 0 = closed (corner mode) … 1 = open (straight mode). */
export const aeroProgress = { value: 0 };
