import { liveryMaterial } from "../../kit/carMaterials";

/**
 * Livery of the generic 2026 car: pearl white over bare carbon, split by a
 * cyan line that climbs from the nose to the cockpit and sweeps down the
 * sidepods; a navy spine runs over the nose and engine cover.
 */
export function bodyPaint() {
  return liveryMaterial({
    key: "car2026-body",
    base: "#eef1f4",
    colors: { livCyan: "#1ec8f0", livNavy: "#0e1b36", livWhite: "#eef1f4" },
    roughness: 0.3,
    glsl: /* glsl */ `
      float az = abs(p.z);
      // Paint above the split line, bare carbon below.
      float split = mix(238.0, 430.0, smoothstep(2720.0, 1350.0, p.x));
      split = mix(split, 300.0, smoothstep(250.0, -1450.0, p.x));
      split += 22.0 * sin(p.x * 0.0021);
      float d = p.y - split;
      carbon = 1.0 - edge(d);
      // Cyan pinstripe riding the split.
      float stripe = edge(d - 9.0) * (1.0 - edge(d - 33.0));
      col = mix(col, livCyan, stripe);
      // Navy spine over the nose, the airbox and down the engine cover.
      float spineW = mix(46.0, 120.0, smoothstep(2700.0, 1700.0, p.x));
      spineW = mix(spineW, 70.0, smoothstep(-200.0, -1700.0, p.x));
      float topSide = edge(p.y - (split + 150.0));
      float spine = (1.0 - edge(az - spineW)) * topSide;
      col = mix(col, livNavy, spine);
      // Thin cyan edge along the spine.
      float spineEdge = (1.0 - edge(az - spineW - 10.0)) * edge(az - spineW - 2.0) * topSide;
      col = mix(col, livCyan, spineEdge);
      // Inside the cockpit: bare carbon.
      if (p.x < 935.0 && p.x > 140.0 && az < 246.0 && p.y < 694.0) carbon = 1.0;
    `,
  });
}

/** Accent colour pieces (wing endplate faces, nose tip details). */
export const ACCENT = "#1ec8f0";
export const NAVY = "#0e1b36";
export const PEARL = "#eef1f4";
