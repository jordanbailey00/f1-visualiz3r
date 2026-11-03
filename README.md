# f1 visualiz3r

Interactive 3D exploded views of Formula 1 cars, one for each regulation era,
in your browser. Rotate a car, pull it apart layer by layer, and click any part
to learn what it does.

Every car is procedural, real-time geometry built entirely in code: no
downloaded meshes or photos. Each one is built to its era's FIA technical
regulations, and all of them wear the same plain livery so the eye goes to the
engineering. The livery menu can repaint any car in McLaren, Ferrari or
Williams colours, as each team raced in the season the car is built to:
unofficial, colour-only versions without logos or sponsors.

The [lineup](https://f1-visualiz3r.vercel.app/lineup) puts every car side by
side in one scene, with rear axles in line and their dimensions measured from
the models themselves. The top, side and front views use an orthographic
camera, so all of them are at exactly the same scale; the free 3D view is in
perspective, so nearer cars look bigger, as they would in a photo. Pick a team there to see its colours
change from era to era.

| Era | Years | Theme |
| --- | --- | --- |
| 1998 | 1998–2005 | Narrow, grooved-tyre V10s |
| 2006 | 2006–2008 | V8s and peak aero clutter |
| 2009 | 2009–2013 | Slicks return, clean bodies, exhaust tricks |
| 2014 | 2014–2016 | Turbo-hybrid, narrow cars |
| 2017 | 2017–2021 | Wide hybrids |
| 2022 | 2022–2025 | Ground-effect cars |
| 2026 | 2026– | Active aero, new hybrid formula |

## Running it

```bash
npm install
npm run dev        # http://localhost:4180
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for how the cars are built and checked.

## License

© 2026 Jordan Bailey. All rights reserved. See [LICENSE](LICENSE).
