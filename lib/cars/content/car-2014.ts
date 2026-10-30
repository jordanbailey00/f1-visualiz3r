import type { CarInfo } from "../types";

/**
 * The 2014–2016 car. Figures come from the FIA Formula 1 Technical
 * Regulations of those years (the 27 February 2016 issue unless noted) and
 * the Sporting Regulations; the model is a generic car built to the 2016
 * rules, not any one team's design.
 */
export const car2014: CarInfo = {
  id: "2014",
  name: "Turbo-hybrid",
  shortName: "2014",
  years: "2014–2016",
  model: "Generic 2014–2016-regulation car, to the 2016 rules (not any one team's design)",
  tagline: "1.6-litre turbo V6 hybrids on narrow chassis.",
  intro: [
    "In 2014 Formula 1 swapped its screaming 2.4-litre V8s for **1.6-litre turbocharged V6 hybrids**, the biggest engine change in the sport's history. Two electric motor-generators recover energy from braking and from the exhaust, and a car may burn only 100 kg of fuel in a race.",
    "The cars stayed narrow, 1.8 m wide, with slim tyres and a tall, narrow rear wing. Rules meant to lower the noses for safety produced the strange **\"anteater\" and \"finger\" noses** of 2014; tighter rules for 2015 made them shorter and stubbier. Mercedes mastered the new engines first and won 51 of the 59 races.",
    "There is no halo yet: it arrived in 2018. Press **DRS** (or **A**) to open the rear wing flap. Press **Explode** to take the car apart layer by layer, and click any part to learn what it does.",
  ],
  specs: [
    ["Width", "1,800 mm"],
    ["Wheelbase", "No limit; about 3.5 m"],
    ["Minimum mass", "702 kg without fuel (2014: 691 kg)"],
    ["Power unit", "1.6 L V6 turbo + MGU-K 120 kW + MGU-H"],
    ["Rev limit", "15,000 rpm"],
    ["Fuel", "≤100 kg per race, ≤100 kg/h"],
    ["Aero", "DRS rear wing, stepped floor"],
    ["Tyres", "13-inch Pirelli: 245/660 front, 325/660 rear"],
  ],
  camera: { position: [3500, 2000, 4300], target: [-250, 350, 0] },
  size: 5300,
  parts: {
    // --- Survival cell ------------------------------------------------------
    chassis: {
      name: "Survival cell",
      category: "chassis",
      summary: "The carbon-fibre tub that holds the driver and the fuel, and carries every other part of the car.",
      details: [
        "Everything on the car is bolted to the survival cell. The front suspension, nose and steering are mounted on it, and the engine is bolted directly to its rear face as a stressed member. The gearbox and rear suspension hang off the back of the engine.",
        "The rules measure the cockpit from **C-C**, the rear face of the cockpit-entry template. The front bulkhead must be at least 1,800 mm ahead of it, and set sections must fit inside the tub: 300 × 275 mm at the bulkhead and 450 × 400 mm 925 mm further back.",
        "For 2016 the cockpit's sides had to withstand 50 kN instead of 15 kN, and the padding around the driver's head grew.",
      ],
      specs: [
        ["Material", "Carbon-fibre composite with honeycomb core"],
        ["Contains", "Driver, fuel cell, battery"],
        ["Front bulkhead", "≥1,800 mm ahead of the cockpit rear"],
      ],
    },
    monocoque: {
      name: "Carbon monocoque",
      category: "chassis",
      summary: "A one-piece carbon-fibre tub: stiff, light, and built to stop anything reaching the driver.",
      details: [
        "\"Monocoque\" means the skin itself is the structure, with no frame inside. Layers of carbon-fibre fabric are laid into a mould around an aluminium honeycomb core, then cured under heat and pressure in an autoclave. The result is far stiffer than steel for its weight.",
        "Its sides are lined with panels of **Zylon**, a fibre stronger than Kevlar, so that sharp debris or another car's nose cannot pierce the cockpit.",
        "Use **X-ray** to see the fuel cell and battery packed inside.",
      ],
      specs: [["Construction", "Carbon/epoxy skins over aluminium honeycomb"]],
      howItWorks: [
        "Carbon fibres are extremely strong along their length, so each ply is laid at a chosen angle to carry the loads where they flow.",
        "The honeycomb core spaces two thin skins apart, which multiplies stiffness the way an I-beam does.",
        "Zylon layers in the sides resist penetration by sharp debris.",
      ],
    },
    nose: {
      name: "Nose (front impact structure)",
      category: "safety",
      summary: "A short, stubby crushable nose with a low tip, absorbing a frontal impact before it reaches the driver.",
      details: [
        "The nose is a hollow carbon cone designed to crush progressively; it must stop a 780 kg trolley at 15 m/s. Since 2014 it must be low at its tip, so it cannot ride up over another car's wheel and launch it.",
        "The 2014 rule only fixed a small section near the tip, so teams kept their noses high and added a thin low **finger** to comply. For 2015 the FIA required the section to grow steadily back from the tip, which ended the fingers: noses became short and stubby, the tip at least 850 mm ahead of the front axle and no higher than 220 mm.",
      ],
      specs: [
        ["Crash test", "780 kg at 15 m/s"],
        ["Tip", "≥850 mm ahead of the front axle, ≤220 mm high (from 2015)"],
      ],
      didYouKnow: "The 2014 noses were widely mocked: some looked like an anteater's snout, and Lotus split theirs into two tusks of different lengths.",
    },
    "roll-structure": {
      name: "Roll structure & airbox",
      category: "safety",
      summary: "The hoop above the driver's head that protects them if the car flips; it is also the engine's air intake.",
      details: [
        "If the car turns over, this structure and a second hoop ahead of the driver keep a survival space around the driver's head. It must reach at least 940 mm above the reference plane, just behind the cockpit.",
        "The opening at the front is the airbox, feeding the turbocharger's compressor. The T-camera sits on top, with the light that shows whether the hybrid system is safe to touch.",
      ],
      specs: [["Height", "≥940 mm above the reference plane"]],
    },
    "fuel-cell": {
      name: "Fuel cell",
      category: "power",
      summary: "A puncture-resistant rubber bladder behind the driver, holding up to 100 kg of fuel.",
      details: [
        "The fuel sits in a flexible bag of Kevlar-reinforced rubber, built to the FIA's FT5 standard. It can deform in a crash without splitting. Inside, pumps, baffles and a small collector tank keep fuel at the pickup even under cornering loads of 5 g.",
        "From 2014 a car may use no more than **100 kg** of fuel in a race, and an FIA flow meter limits the flow into the engine to **100 kg per hour**. Teams had to save fuel through a race for the first time in years.",
      ],
      specs: [
        ["Standard", "FIA FT5 safety bladder"],
        ["Race fuel", "≤100 kg"],
        ["Fuel flow", "≤100 kg/h"],
      ],
      didYouKnow: "Daniel Ricciardo finished second on his Red Bull debut at the 2014 Australian Grand Prix, then was disqualified because his car had exceeded the fuel flow limit.",
    },
    cockpit: {
      name: "Cockpit",
      category: "cockpit",
      summary: "The driver's workspace: a moulded seat, the steering wheel and energy-absorbing padding.",
      details: [
        "The driver lies back with their feet higher than their hips, so the car can be as low as possible. Strapped in and fully kitted, the driver must be able to remove the steering wheel and climb out within **5 seconds**, then refit the wheel within 10 seconds in total.",
        "There was no minimum weight for the driver in these years, only for the whole car, so every kilogram of driver cost lap time. Tall drivers starved themselves to make weight.",
      ],
      specs: [["Exit test", "Out in 5 s; wheel refitted within 10 s"]],
    },
    seat: {
      name: "Driver's seat",
      category: "cockpit",
      summary: "A thin carbon shell moulded to the individual driver's body.",
      details: [
        "Each seat is made by pouring expanding foam around the driver while they sit in position, then copying the shape in carbon fibre. A close fit spreads cornering and braking loads over the body and lets the driver feel what the car is doing.",
        "The seat can be lifted out of the car with the driver still strapped in, so a medical crew can extract them without moving their spine.",
      ],
    },
    "steering-wheel": {
      name: "Steering wheel",
      category: "cockpit",
      summary: "A carbon control panel with a display, shift paddles and rotary switches that the driver uses dozens of times a lap.",
      details: [
        "The wheel carries the shift paddles, the clutch paddles used at the start, and buttons and rotary switches for the radio, drinks, pit-lane limiter, brake balance, differential and the many engine and energy modes. The **DRS** button opens the rear wing flap.",
        "The display shows gear, lap delta, battery charge and warnings. The rows of lights along the top tell the driver when to shift.",
      ],
      specs: [
        ["Controls", "Paddles, buttons and rotary switches"],
        ["Display", "Gear, deltas, battery state, flags"],
      ],
      didYouKnow: "In 2016 the FIA banned most technical coaching over the radio, so drivers had to work out the complex power-unit settings on their wheel by themselves.",
    },
    headrest: {
      name: "Headrest & cockpit padding",
      category: "safety",
      summary: "Energy-absorbing foam around the driver's head and shoulders.",
      details: [
        "Padding behind and each side of the driver's head is made from a foam that compresses slowly under impact. This limits how fast the head can move in a crash. The side pads must be at least 95 mm thick, and their area grew for 2016.",
        "It lifts out as one piece, so marshals can reach the driver.",
      ],
    },
    mirrors: {
      name: "Mirrors",
      category: "cockpit",
      summary: "Rear-view mirrors on stalks beside the cockpit.",
      details: [
        "Each glass must be at least 150 × 50 mm. The mirrors must sit 250–500 mm from the centre line and 550–750 mm ahead of the cockpit's rear edge, and each housing may cover no more than 12,000 mm² seen from above, so they can't double as wings.",
      ],
      specs: [["Glass", "≥150 × 50 mm"]],
    },
    "side-impact": {
      name: "Side impact structures",
      category: "safety",
      summary: "Crushable FIA-specified tubes in the sidepods that absorb a side impact before it reaches the tub.",
      details: [
        "Two tubes on each side stick out from the survival cell, one high and one low, 500 mm ahead of the cockpit rear. They must be faired in by the bodywork. In a T-bone crash they crush first, spreading the load and slowing the intrusion.",
      ],
      specs: [
        ["Upper", "400–520 mm above the reference plane"],
        ["Lower", "70–190 mm above the reference plane"],
      ],
    },
    pedals: {
      name: "Pedal box",
      category: "cockpit",
      summary: "Brake and throttle pedals in the footwell; F1 drivers brake with the left foot.",
      details: [
        "There is no clutch pedal: the clutch is worked by paddles on the steering wheel. The brake pedal drives two master cylinders, one per circuit. The throttle pedal only moves a sensor, and the FIA standard ECU turns that signal into torque from the engine and the MGU-K.",
        "The driver's feet may not be ahead of the front axle, so a frontal impact cannot crush them.",
      ],
      specs: [
        ["Pedals", "Brake (left foot) and throttle"],
        ["Brake effort", "Over 100 kg of force at the pedal"],
      ],
    },
    harness: {
      name: "Safety harness",
      category: "safety",
      summary: "Six straps meeting at a single quick-release buckle hold the driver in the seat.",
      details: [
        "Two shoulder straps, two lap straps and two crotch straps lock the driver into the seat against braking loads of more than 5 g and the far higher loads of a crash. A twist of the central buckle releases all six at once.",
      ],
    },
    extinguisher: {
      name: "Fire extinguisher",
      category: "safety",
      summary: "An FIA-homologated extinguisher inside the survival cell, with nozzles in the cockpit and the engine bay.",
      details: [
        "It has its own battery, so it still works if the car's electrics fail. Both the driver and marshals can fire it: the external trigger is combined with the circuit-breaker switch on the outside of the car.",
      ],
    },
    "cockpit-lights": {
      name: "Cockpit & warning lights",
      category: "safety",
      summary: "Red, blue and yellow track-signal lights in front of the driver, and the impact warning light on top of the tub.",
      details: [
        "The FIA ECU drives lights placed directly in the driver's line of sight. They repeat flags and track signals: yellow for danger, blue for a faster car behind, red for a stopped session.",
        "Recessed into the top of the survival cell is the **impact warning light**, wired to the accident data recorder. After a crash it shows rescue crews at a glance how violent the impact was.",
      ],
    },
    "hs-camera": {
      name: "FIA high-speed camera",
      category: "electronics",
      summary: "A small FIA camera at the front of the cockpit, filming the driver at high frame rates; new for 2016.",
      details: [
        "Together with the accident data recorder and the accelerometers in the driver's earpieces, it shows the FIA exactly how a driver's head and body move in a crash. That evidence later shaped the halo, the headrest and today's seats.",
      ],
    },
    cameras: {
      name: "On-board cameras",
      category: "electronics",
      summary: "The TV cameras every car must carry, in positions the FIA fixes.",
      details: [
        "The **T-camera** sits on top of the roll hoop, with pods on the nose and a forward-facing camera on the chassis. Housings used instead of cameras must match a real camera's size, shape and mass, so the choice never changes the car's balance.",
        "The T-camera's colour tells viewers which of a team's two cars they are watching: the second car's is fluorescent yellow.",
      ],
    },

    // --- Front wing ---------------------------------------------------------
    "front-wing": {
      name: "Front wing",
      category: "aero",
      summary: "A 1,650 mm wing of many elements and cascades, either side of a fixed neutral section.",
      details: [
        "The front wing makes downforce over the front tyres and shapes the air for the rest of the car. For 2014 it was narrowed from 1,800 to 1,650 mm, so its ends sat in front of the tyres rather than outside them, and teams worked hard to steer the tyres' wake outward around them.",
        "There was no limit on the number of elements, so the wings grew stacks of flaps and **cascades**. Between ±250 and ±400 mm from the centre line, though, they may show only 20,000 mm² from the side, so the flaps stop short of the nose.",
      ],
      specs: [
        ["Span", "≤1,650 mm (2013: 1,800)"],
        ["Position", "450–1,000 mm ahead of the front axle"],
        ["Height", "75–275 mm above the reference plane"],
        ["Flex test", "≤10 mm under 1,000 N"],
      ],
    },
    "fw-mainplane": {
      name: "Front mainplane & neutral section",
      category: "aero",
      summary: "The lowest element of the wing, and the FIA's fixed profile across its middle.",
      details: [
        "Running close to the ground, the mainplane benefits from **ground effect**: the air speeds up in the narrow gap under it, lowering the pressure and pulling the wing down harder than it would in free air.",
        "The middle 500 mm is the **neutral section**, a profile drawn by the FIA that every car must use, so no team can tune the airflow under the nose. Two pylons, each no more than 25 mm thick, carry the nose down onto it.",
      ],
    },
    "fw-flaps": {
      name: "Front flaps & cascade",
      category: "aero",
      summary: "The flaps stacked above the mainplane, and a cascade winglet on the endplate.",
      details: [
        "Each flap sits behind and above the element in front, with a narrow slot between them. Fast air from each slot keeps the flow attached to the next element, which lets the stack run steep angles without stalling.",
        "The **cascade**, a small extra wing near the endplate, adds downforce and helps turn the air outward around the front tyre.",
      ],
      howItWorks: [
        "Each element is an upside-down aerofoil: the air travelling under it speeds up and its pressure drops.",
        "The pressure difference between the upper and lower surfaces pushes the wing toward the track.",
        "More flap angle means more front downforce, which makes the car turn in more sharply.",
      ],
    },
    "fw-endplates": {
      name: "Front endplates",
      category: "aero",
      summary: "Plates near the wing tips, with foot plates reaching out to the edge of the span.",
      details: [
        "An open wing tip lets high-pressure air spill round into the low-pressure side, wasting downforce and creating a tip vortex. The endplate limits that spillage, and its foot steers air around the front tyre.",
        "The rules make the endplates stand 685–775 mm from the centre line with at least 95,000 mm² of side area, and require the foot plate beyond, out to 825 mm, to stay no higher than 100 mm underneath.",
      ],
      specs: [["Position", "685–775 mm from the centre line"]],
    },
    "fw-adjusters": {
      name: "Flap adjusters",
      category: "aero",
      summary: "The screw mechanisms that set the front flaps' angle, turned by hand at a pit stop.",
      details: [
        "A mechanic on each side fits a tool to the adjuster and turns it during a normal stop; nothing on the wing may be adjusted while the car is moving. More flap gives more front grip and cures understeer, at the cost of a little drag.",
      ],
    },

    // --- Power unit ---------------------------------------------------------
    "power-unit": {
      name: "Power unit",
      category: "power",
      summary: "A 1.6-litre turbocharged V6 with two electric motor-generators, the first of F1's turbo-hybrids.",
      details: [
        "F1 calls it a power unit because the engine is only part of it. The **MGU-K** on the crankshaft recovers energy under braking and adds up to 120 kW. The **MGU-H** on the turbo shaft recovers energy from the exhaust, and uses it to kill turbo lag.",
        "Development was rationed: designs were frozen at the start of 2014, and in 2015 and 2016 each manufacturer could change only a set number of parts, counted in **tokens**. Each driver could use five power units in 2014, four in 2015, and five again in the 21-race 2016 season.",
      ],
      specs: [
        ["ICE", "1.6 L, 90° V6, single turbo"],
        ["Rev limit", "15,000 rpm"],
        ["Electric", "MGU-K 120 kW + MGU-H"],
        ["Minimum mass", "145 kg"],
        ["Manufacturers", "Mercedes, Ferrari, Renault, Honda (from 2015)"],
      ],
      didYouKnow: "Mercedes won 51 of the 59 races in these three seasons, still one of the most dominant runs in the sport's history.",
    },
    ice: {
      name: "V6 engine (ICE)",
      category: "power",
      summary: "The internal combustion engine: six cylinders in a 90° vee, with the fuel flow capped at 100 kg/h.",
      details: [
        "Each cylinder has an 80 mm bore and the total displacement is 1.6 litres. Fuel is injected directly into the cylinders at up to 500 bar. Lean combustion and pre-chamber ignition soon made these engines far more efficient than the V8s they replaced.",
        "Above 10,500 rpm the fuel flow is capped at 100 kg per hour, so extra revs bring no extra fuel. That is why the engines rarely went near their 15,000 rpm limit, and why they sounded so much quieter than the V8s.",
      ],
      specs: [
        ["Layout", "90° V6, 80 mm bore"],
        ["Crankshaft", "On the centre line, 90 mm above the reference plane"],
        ["Displacement", "1,600 cc"],
        ["Rev limit", "15,000 rpm"],
        ["Fuel flow", "≤100 kg/h above 10,500 rpm"],
      ],
      howItWorks: [
        "Compressed air from the turbo and charge-air cooler fills the cylinder.",
        "Fuel sprays directly in; a spark in a small pre-chamber fires jets of flame into the lean main charge.",
        "The expanding gas drives the pistons and crankshaft; the hot exhaust then spins the turbine.",
      ],
    },
    plenum: {
      name: "Intake plenum",
      category: "power",
      summary: "The carbon chamber in the vee that holds the cooled, compressed air for the six cylinders.",
      details: [
        "Air from the charge-air cooler fills the plenum, then passes down six inlet trumpets into the cylinders. The trumpet lengths are tuned so pressure waves arrive at the valves at the right moment, packing in a little more air.",
      ],
    },
    turbocharger: {
      name: "Turbocharger",
      category: "power",
      summary: "An exhaust-driven turbine spinning a compressor at up to 125,000 rpm, with the MGU-H between them.",
      details: [
        "Hot exhaust spins the turbine wheel. A shaft, which must lie within 25 mm of the car's centre line, drives the compressor on the other side, squeezing intake air to several times atmospheric pressure.",
        "Mercedes split the turbo from 2014, putting the compressor at the front of the engine and the turbine at the back, joined by a long shaft through the vee. It kept the intake air cool and the whole unit compact, a big part of its early advantage.",
      ],
      specs: [
        ["Type", "Single-stage, with MGU-H on the shaft"],
        ["Max speed", "125,000 rpm"],
      ],
    },
    "mgu-h": {
      name: "MGU-H",
      category: "hybrid",
      summary: "Motor Generator Unit – Heat: an electric machine on the turbo shaft that recovers energy from the exhaust.",
      details: [
        "Driven by the exhaust gas, the MGU-H generates electricity, which goes to the battery or straight to the MGU-K. Run as a motor, it spins the compressor up instantly, so there is no turbo lag.",
        "Unlike the MGU-K, the energy it may recover is unlimited, which made the system remarkably efficient, and very hard to master. Several manufacturers struggled with it for years.",
      ],
      specs: [
        ["Speed", "≤125,000 rpm"],
        ["Energy recovery", "Unlimited"],
        ["Location", "Between the turbine and compressor"],
      ],
      howItWorks: [
        "On a straight, exhaust energy beyond what the compressor needs drives the MGU-H as a generator.",
        "That electricity charges the battery, or powers the MGU-K directly without passing through the battery.",
        "Coming out of a slow corner, the MGU-H runs as a motor and spins the turbo up before the exhaust can.",
      ],
    },
    exhaust: {
      name: "Exhaust system",
      category: "power",
      summary: "Inconel pipes that gather the six cylinders' exhaust into the turbine, then out of one tailpipe and, from 2016, two wastegate pipes.",
      details: [
        "The primaries are made of Inconel, a nickel superalloy that keeps its strength at around 900 °C. Their lengths are tuned so the pulses from each cylinder arrive at the turbine evenly.",
        "The single tailpipe must point slightly upward and exit 170–185 mm behind the rear axle, which ended the exhaust-blown diffusers of earlier years. In 2014 and 2015 the wastegate gas went out through it too; for 2016 the wastegate got its own pipes, partly to make the quiet hybrids louder.",
      ],
      specs: [
        ["Material", "Inconel nickel superalloy"],
        ["Tailpipes", "1 turbine + 1–2 wastegate (2016)"],
        ["Exit", "170–185 mm behind the rear axle"],
      ],
    },
    "oil-tank": {
      name: "Oil tank",
      category: "power",
      summary: "The tank for the dry-sump oil system, between the engine and the fuel cell.",
      details: [
        "F1 engines use a **dry sump**: scavenge pumps suck the oil out of the crankcase and send it to a separate tank, then a pressure pump feeds it back. This lets the engine sit low and keeps oil supplied under any cornering load.",
      ],
    },
    "heat-shield": {
      name: "Heat shielding",
      category: "power",
      summary: "Gold-coated reflective film that protects carbon parts from the engine's radiant heat.",
      details: [
        "Carbon-fibre composites soften well below exhaust temperatures, so the engine bay is lined with thin reflective foil. Real gold is used because it reflects infrared radiation better than almost anything else.",
      ],
    },

    // --- Energy recovery ----------------------------------------------------
    ers: {
      name: "Energy recovery system",
      category: "hybrid",
      summary: "Two motor-generators, a battery and their electronics: the hybrid half of the power unit.",
      details: [
        "Under braking the MGU-K works as a generator and charges the battery; on the throttle it drives the wheels with up to 120 kW, twice the old KERS. Each lap, the MGU-K may harvest **2 MJ**, and the battery may release **4 MJ** to it. The difference comes from the MGU-H, which can harvest without limit.",
        "4 MJ is about 33 seconds of full electric power. Engineers plan where to harvest and where to deploy it, corner by corner.",
      ],
      specs: [
        ["MGU-K power", "≤120 kW (≈160 hp)"],
        ["MGU-K harvest", "≤2 MJ per lap"],
        ["Deployment", "≤4 MJ per lap"],
        ["MGU-H harvest", "Unlimited"],
      ],
    },
    "mgu-k": {
      name: "MGU-K",
      category: "hybrid",
      summary: "Motor Generator Unit – Kinetic: a 120 kW electric machine geared to the crankshaft.",
      details: [
        "A permanent-magnet motor no bigger than a large coffee tin delivers 120 kW, about 160 hp. Run in reverse as a generator, it harvests energy every time the driver brakes.",
      ],
      specs: [
        ["Power", "≤120 kW"],
        ["Speed", "≤50,000 rpm"],
        ["Torque", "≤200 Nm"],
      ],
    },
    "energy-store": {
      name: "Energy store (battery)",
      category: "hybrid",
      summary: "The lithium-ion battery under the fuel cell, cycled through a 4 MJ window lap after lap.",
      details: [
        "The cells sit in a crash-proof case inside the survival cell, the safest place on the car. The difference between its highest and lowest charge may not exceed **4 MJ**, a little over a kilowatt-hour.",
        "Its cooling system is critical: the cells must stay within a narrow temperature window to deliver full power and to last.",
      ],
      specs: [
        ["Usable window", "≤4 MJ (≈1.1 kWh)"],
        ["Cell mass", "20–25 kg"],
        ["Location", "Inside the survival cell, below the fuel"],
      ],
    },
    "control-electronics": {
      name: "Control electronics",
      category: "hybrid",
      summary: "The inverters and converters that manage energy between the battery and both motor-generators.",
      details: [
        "The battery stores direct current, but the motors need precisely timed alternating current. The control electronics switch hundreds of amps thousands of times a second to make the conversion, for the MGU-K and the MGU-H alike.",
      ],
    },
    electronics: {
      name: "Control & data electronics",
      category: "electronics",
      summary: "The FIA Standard ECU that runs the car, and the accident data recorder.",
      details: [
        "Every team uses the same FIA-supplied ECU and software, so the governing body can see and police how the car is controlled. Data streams back to the pit wall by telemetry throughout each session.",
      ],
    },
    ecu: {
      name: "FIA Standard ECU",
      category: "electronics",
      summary: "The single control unit, identical for every team, that runs the power unit, gearbox and brakes.",
      details: [
        "The ECU, built by McLaren, decides how much torque the engine and MGU-K deliver for a given throttle position. It runs the seamless gearshifts and the new rear brake-by-wire, and enables the DRS only where race control allows it.",
        "It also drives the cockpit signal lights and logs hundreds of sensor channels. The FIA checks its software, which is why driver aids like traction control can't be hidden in it.",
      ],
    },
    adr: {
      name: "Accident data recorder",
      category: "electronics",
      summary: "The FIA's black box, bolted to the floor of the survival cell, that records every impact.",
      details: [
        "Accelerometers near the car's centre of gravity record the forces of any crash. The FIA uses the data, with the high-speed camera aimed at the driver, to keep improving safety.",
      ],
    },
    transponders: {
      name: "Timing transponders",
      category: "electronics",
      summary: "Two transponders, supplied by the official timekeepers, that time every lap to a thousandth of a second.",
      details: [
        "Each one signals to loops buried in the track at the finish line and the sector boundaries. Every car carries two, fitted exactly as the timekeepers specify, so a failure never loses a lap time.",
      ],
    },
    ballast: {
      name: "Ballast",
      category: "chassis",
      summary: "Dense tungsten plates bolted low in the car to bring it up to the minimum mass.",
      details: [
        "Teams aim to build the car below the limit, then add ballast where it helps most: as low as possible, and placed to tune the front-to-rear weight split. It must be fixed so that tools are needed to remove it, and it can be sealed by the scrutineers.",
        "In 2014 the heavy hybrid systems left most cars with little or no ballast, and heavier drivers struggled to make the weight; the limit rose to 702 kg for 2015.",
      ],
      specs: [
        ["Minimum mass", "702 kg without fuel (2014: 691 kg)"],
        ["Axle minimum", "Front ≥319 kg, rear ≥376 kg (2015–16)"],
      ],
    },

    // --- Cooling ------------------------------------------------------------
    cooling: {
      name: "Cooling system",
      category: "cooling",
      summary: "Radiators and coolers that reject the heat of the engine, the turbo air and the electrics.",
      details: [
        "Roughly as much energy leaves the power unit as heat as is delivered as power. Coolant, oil, compressed intake air and the ERS all need their own cooling, more than the V8s ever did.",
        "Bigger radiators mean bigger sidepods and more drag, so teams trade cooling against speed. Many run extra cooling louvres at hot races.",
      ],
    },
    radiators: {
      name: "Radiators & charge-air cooler",
      category: "cooling",
      summary: "Steeply inclined cores in the sidepods: water on one side, compressed intake air on the other.",
      details: [
        "Air from the sidepod inlet passes through fine aluminium fins between flat tubes carrying hot coolant or hot compressed air. Leaning the cores steeply lets a tall core fit inside a low sidepod.",
        "The charge-air cooler was new with the turbo: compressing air heats it, and cooler air is denser, so more of it fits in the cylinders.",
      ],
      specs: [
        ["Core", "Brazed aluminium fins and tubes"],
        ["Fed by", "Sidepod inlets"],
      ],
    },
    "airbox-cooler": {
      name: "Airbox cooler",
      category: "cooling",
      summary: "An oil or ERS cooler packaged under the roll hoop and fed from the airbox.",
      details: [
        "The airbox inlet sees clean, fast air above the driver's head, so many teams split off part of that flow to feed a cooler. This lets them shrink the sidepods.",
      ],
    },

    // --- Transmission -------------------------------------------------------
    transmission: {
      name: "Transmission",
      category: "drivetrain",
      summary: "The gearbox, differential and driveshafts that carry power from the engine to the rear wheels.",
      details: [
        "The gearbox casing is also part of the chassis. Bolted to the back of the engine, it carries the rear suspension, the rear crash structure and the rear wing pillar.",
      ],
    },
    gearbox: {
      name: "Gearbox casing",
      category: "drivetrain",
      summary: "A carbon-and-titanium casing that houses the gears and carries the rear suspension.",
      details: [
        "The casing has to be stiff, because any flex would let the rear suspension move. It also has to be slim, so air can flow past it to the diffuser.",
        "Each gearbox had to last six consecutive events; changing it early cost the driver five places on the grid.",
        "Use **X-ray** or explode the car to see the gear cluster inside.",
      ],
    },
    "gear-cluster": {
      name: "Gear cluster",
      category: "drivetrain",
      summary: "Eight forward gears and a reverse, shifted in milliseconds by a seamless-shift system.",
      details: [
        "A **seamless-shift** gearbox engages the next gear before releasing the current one, so there is almost no break in drive. A full upshift takes a few milliseconds, controlled hydraulically and electronically.",
        "The turbo engines brought an eighth gear for 2014. Teams nominated their ratios before the season, with one change allowed in 2014 only.",
      ],
      specs: [["Forward gears", "8, plus reverse (2013: 7)"]],
    },
    clutch: {
      name: "Clutch",
      category: "drivetrain",
      summary: "A small multi-plate carbon clutch in the bellhousing, used mainly for starts and pit stops.",
      details: [
        "Carbon plates barely larger than a hand handle hundreds of kilowatts. The driver works the clutch only with paddles on the steering wheel. Once moving, the seamless gearbox shifts without opening it.",
        "In a crash or a spin the FIA-mandated clutch disengagement system opens the clutch automatically, so the engine does not stall.",
      ],
    },
    differential: {
      name: "Differential",
      category: "drivetrain",
      summary: "Lets the rear wheels turn at different speeds in corners while sharing the drive between them.",
      details: [
        "In a corner the outside wheel travels further than the inside one. An open differential would let the lightly loaded inside wheel spin away the power, so F1 cars use a hydraulically controlled limited-slip differential. The driver adjusts it from the steering wheel for entry, mid-corner and exit.",
      ],
    },
    driveshafts: {
      name: "Driveshafts",
      category: "drivetrain",
      summary: "Shafts with constant-velocity joints that carry the torque to the rear wheels.",
      details: [
        "The joints at each end let the shaft keep turning smoothly as the suspension moves. With the turbo engines' huge low-speed torque, each shaft carries well over 1,000 Nm in the low gears.",
      ],
    },
    "rear-impact": {
      name: "Rear impact structure",
      category: "safety",
      summary: "A tapered carbon box behind the gearbox that crushes to absorb a rear impact.",
      details: [
        "Like the nose, the structure is designed to crush progressively; it must stop a 780 kg trolley at 11 m/s. Its rear face is centred 300 mm above the reference plane, at least 575 mm behind the rear axle.",
        "It also carries the rain light and the rear jacking point.",
      ],
      specs: [["Crash test", "780 kg at 11 m/s"]],
    },
    "rain-light": {
      name: "Rain light",
      category: "safety",
      summary: "A bright red LED light on the crash structure that makes the car visible in spray.",
      details: [
        "The light is switched on in wet conditions so following drivers can see the car through the spray. It is the only rear light; the extra lights in the rear wing endplates came in 2019.",
      ],
      specs: [["Height", "300 mm above the reference plane"]],
    },

    // --- Rear wing ----------------------------------------------------------
    "rear-wing": {
      name: "Rear wing",
      category: "aero",
      summary: "A tall, narrow two-element wing between huge endplates, with the DRS flap on top.",
      details: [
        "The rear wing makes downforce for the rear axle. Its profiles must fit within ±355 mm of the centre line, between the axle and 350 mm behind it, and between 750 and 950 mm up, which made it tall and narrow.",
        "The beam wing below it was banned from 2014, and the rules kept the space between the rear wheels clear. Only a small **monkey seat** above the exhaust was allowed.",
        "The upper element is the **DRS** flap. Press **DRS** in the toolbar (or **A**) to open it.",
      ],
      specs: [
        ["Elements", "Mainplane + DRS flap"],
        ["Span", "≤710 mm"],
        ["Height", "750–950 mm above the reference plane"],
      ],
    },
    "rw-mainplane": {
      name: "Rear mainplane",
      category: "aero",
      summary: "The fixed lower element of the rear wing.",
      details: [
        "The mainplane makes most of the wing's downforce. The rules require the upper element's chord to be shorter than the mainplane's, so the mainplane is the bigger of the two.",
      ],
    },
    "rw-flap": {
      name: "DRS flap",
      category: "aero",
      summary: "The upper element, which opens on the straights to cut drag: the Drag Reduction System.",
      details: [
        "When the driver opens DRS, a hydraulic actuator lifts the flap's leading edge, pivoting it about a fixed axis near the top rear corner of the wing. The slot to the mainplane opens from 10–15 mm to as much as 65 mm, and the wing stops making much downforce or drag. Touching the brakes closes it.",
      ],
      specs: [
        ["Slot gap", "10–15 mm closed, ≤65 mm open"],
        ["Width", "≥708 mm"],
      ],
      howItWorks: [
        "At a detection point before the straight, the timing system checks the gap to the car ahead.",
        "Under one second behind, the driver may open the flap in the following DRS zone by pressing the DRS button.",
        "The flap closes when the driver brakes or presses the button again. In practice and qualifying, any car may use it in the zones.",
      ],
      didYouKnow: "DRS arrived in 2011 as a fix for how hard it was to follow another car.",
    },
    "rw-endplates": {
      name: "Rear endplates",
      category: "aero",
      summary: "Huge flat plates at the wing tips, reaching down toward the floor and back behind the wing.",
      details: [
        "The endplates tidy the wing-tip vortices, a big source of drag, and stop high-pressure air spilling round the tips. They stand 355–375 mm from the centre line, and seen from the side must cover more than 330,000 mm² between 300 and 950 mm up and up to 600 mm behind the axle.",
        "Slots and louvres were allowed: rows of them near the top bled off the high-pressure air to weaken the tip vortex and its drag.",
      ],
      specs: [
        ["Position", "355–375 mm from the centre line"],
        ["Side area", ">330,000 mm²"],
      ],
    },
    "monkey-seat": {
      name: "Monkey seat",
      category: "aero",
      summary: "A small winglet above the exhaust, in the only space left near the centre line behind the axle.",
      details: [
        "The monkey seat sits within ±100 mm of the centre line and, in 2016, below 600 mm, above the tailpipe. The hot, fast exhaust flow under it helps it pull air up from the diffuser and adds a little rear downforce.",
        "It was banned for 2018, along with the T-wing.",
      ],
    },
    "rw-pylon": {
      name: "Rear wing pillar",
      category: "aero",
      summary: "A slender central support that carries the wing and the monkey seat, wrapped round the exhaust.",
      details: [
        "The pillar carries the wing's load, several hundred kilograms at high speed, down into the gearbox. Between 600 and 750 mm up it may have no more than two sections, 5,000 mm² in all and each no more than 25 mm thick, which limits its disturbance to the airflow under the wing.",
      ],
    },
    "rw-actuator": {
      name: "DRS actuator",
      category: "aero",
      summary: "The hydraulic actuator that opens and closes the DRS flap.",
      details: [
        "A small hydraulic ram in the head of the pillar drives the flap through a linkage. From 2016 its bodywork had to sit on the centre line (or out by the endplates). The FIA ECU allows it to open only in a DRS zone, and if it fails, the flap must close.",
      ],
    },

    // --- Bodywork -----------------------------------------------------------
    bodywork: {
      name: "Bodywork",
      category: "aero",
      summary: "The engine cover and sidepods: removable shells that shape the air over the car and into the coolers.",
      details: [
        "The bodywork does three jobs: it encloses the power unit, feeds air to the radiators, and guides the flow toward the diffuser and rear wing.",
        "Use **X-ray** to see through it to the engine and coolers.",
      ],
    },
    "engine-cover": {
      name: "Engine cover",
      category: "aero",
      summary: "The tapering cover over the power unit, with a slim spine falling toward the rear wing.",
      details: [
        "From the side, the cover must fill an area that falls from 925 mm high, 1,000 mm ahead of the rear axle, to 550 mm just ahead of it; anything above that may be no more than 125 mm wide. The cover then narrows into the **coke bottle** and ends in a cooling exit around the exhaust.",
        "Near the rear axle the bodywork must stay low: outside ±375 mm it may be no higher than 500 mm in the last 800 mm, and 300 mm in the last 400.",
      ],
    },
    sidepods: {
      name: "Sidepods",
      category: "aero",
      summary: "The pods either side of the driver that house the radiators, larger than ever to cool the hybrids.",
      details: [
        "The inlets swallow air for the radiators, and the outside shape decides how the rest flows past. Outside ±415 mm nothing may stand more than 625 mm ahead of the cockpit's rear edge, so the pods start just ahead of the driver.",
        "The hybrid power units needed far more cooling than the V8s, so the sidepods grew, and teams spent years learning to shrink them again.",
      ],
    },

    // --- Floor --------------------------------------------------------------
    floor: {
      name: "Floor",
      category: "aero",
      summary: "A flat floor with a 50 mm step, narrow ahead of the sidepods, with the diffuser behind the rear axle.",
      details: [
        "Seen from below, everything from 330 mm behind the front axle to the rear axle must lie on one of two flat planes: the reference plane along the middle, where the plank is, or the **step plane** 50 mm above it.",
        "Ahead of the sidepods the floor stays narrow: the rules keep a zone around the front wheels clear of bodywork, so the full ±700 mm floor starts only beside the sidepods. Teams ran the cars with **rake**, the rear higher than the front, to make the floor work harder.",
      ],
      specs: [
        ["Width", "±700 mm"],
        ["Step", "50 mm"],
      ],
    },
    "floor-body": {
      name: "Floor body & tea tray",
      category: "aero",
      summary: "The flat carbon floor, and the tea tray (splitter) under the chassis ahead of it.",
      details: [
        "The underside is flat: a 300 mm wide keel on the reference plane, carrying the plank, with the step plane 50 mm higher on either side. Holes were allowed only near the front; further back the surfaces had to be continuous, except for slots at the very edges.",
        "Ahead of the floor, the **tea tray** juts forward under the chassis. The rules keep it at least 100 mm off the ground, rising toward the front.",
      ],
    },
    bargeboards: {
      name: "Bargeboards & turning vanes",
      category: "aero",
      summary: "The few vanes the rules allowed between the front wheels and the sidepods.",
      details: [
        "Seen from above, the zone around the front wheels had to stay empty, so these cars carried only a few aerodynamic devices there: turning vanes under the chassis, one angled board in the small triangle the rules leave beside it, and small vanes at the sidepods' leading edge. Together they turn the front tyres' wake away from the floor.",
        "For 2017 the rules opened this area up, and the bargeboards grew into the dense arrays of the next era.",
      ],
    },
    "floor-stays": {
      name: "Floor stays",
      category: "aero",
      summary: "Slim stays that stop the edges of the floor flexing at speed.",
      details: [
        "Under the load of the airflow the wide, thin floor would bend, changing how close its edges run to the track. Stays from the chassis hold the edges in place, and the FIA's deflection tests check they do.",
      ],
    },
    diffuser: {
      name: "Diffuser",
      category: "aero",
      summary: "The rising tail of the floor behind the rear axle.",
      details: [
        "Air under the floor has to return to normal speed and pressure before it leaves the car. The diffuser's expanding shape does this gradually, which lets the air under the car run faster in the first place.",
        "In these years it started at the rear axle and could be no more than 125 mm high and 1,000 mm wide. Teams could no longer blow exhaust gas into it, as the single tailpipe had to exit high and pointing upward.",
      ],
      specs: [
        ["Start", "At the rear axle"],
        ["Exit", "350 mm behind the axle, ≤125 mm high, ≤1,000 mm wide"],
      ],
    },
    plank: {
      name: "Plank & skids",
      category: "chassis",
      summary: "A 300 mm wide skid board under the floor that stops teams running the car dangerously low.",
      details: [
        "Running lower makes more downforce, so teams are tempted to scrape the floor along the track. The plank polices that: it must be 10 mm thick, give or take 1 mm, so after the race it must still measure at least 9 mm at its holes.",
        "Titanium skids, set into it from 2015, take the worst of the contact. They are what throw the sparks you see at night races.",
      ],
      specs: [
        ["Size", "300 mm wide, 10 ± 1 mm thick"],
        ["Length", "From 330 mm behind the front axle to the rear axle"],
        ["Skids", "Titanium (from 2015), ≤20,000 mm² in all"],
      ],
    },

    // --- Suspension ---------------------------------------------------------
    "front-suspension": {
      name: "Front suspension",
      category: "suspension",
      summary: "Wishbones, push-rods and steering that hold the front wheels at precisely controlled angles.",
      details: [
        "Each wheel is located by six members: two wishbones (four legs), a push-rod, and a track rod for steering. By 2016 every team used push-rods at the front.",
        "Mid-2014 the FIA ruled that front-to-rear interconnected suspension (FRIC), which linked the axles hydraulically to keep the car level, was a movable aerodynamic device. Every team removed it from the German Grand Prix onward.",
      ],
    },
    "fs-wishbones": {
      name: "Front wishbones",
      category: "suspension",
      summary: "Upper and lower A-shaped arms that let the wheel move up and down while controlling its camber.",
      details: [
        "The legs are hollow carbon tubes with aerofoil sections, so they work as small aero devices too. Their geometry sets how the wheel tilts as it rises, and how much the car's nose dives under braking.",
        "Wheel tethers inside the legs keep the wheel attached to the car in a crash.",
      ],
    },
    "fs-pushrods": {
      name: "Front push-rods",
      category: "suspension",
      summary: "Struts that carry wheel movement up to the springs and dampers inside the chassis.",
      details: [
        "When the wheel rises, the push-rod pushes a rocker on top of the chassis. This lets the springs and dampers live inside the bodywork, out of the airflow, while the rocker sets the motion ratio.",
      ],
    },
    "track-rods": {
      name: "Steering track rods",
      category: "suspension",
      summary: "Link the steering rack to the uprights to turn the front wheels.",
      details: [
        "The steering rack runs across the front bulkhead. Each track rod is usually aligned with a wishbone leg so it hides in that leg's wake.",
      ],
    },
    "fs-inboard": {
      name: "Front springs & dampers",
      category: "suspension",
      summary: "Rockers, torsion bars and dampers packed into the top of the nose.",
      details: [
        "Instead of coil springs, F1 cars use **torsion bars**, steel bars that twist as the rocker turns. They give very precise rates in little space. A heave element between the two sides controls the car's pitch and ride height.",
      ],
    },
    "rear-suspension": {
      name: "Rear suspension",
      category: "suspension",
      summary: "Wishbones, pull-rods and toe links mounted on the gearbox casing.",
      details: [
        "The rear suspension carries the driven wheels, so it has to cope with traction and the driveshafts passing through it. Its geometry controls how the car squats under acceleration, and with it the rake the floor depends on.",
      ],
    },
    "rs-wishbones": {
      name: "Rear wishbones",
      category: "suspension",
      summary: "Carbon arms that locate the rear uprights on the gearbox.",
      details: [
        "Their shapes and angles are tuned for the aerodynamics around the diffuser as much as for mechanics.",
      ],
    },
    "rs-pushrods": {
      name: "Rear pull-rods",
      category: "suspension",
      summary: "Rods from the top of each upright down to rockers low on the gearbox.",
      details: [
        "A pull-rod works in tension: when the wheel rises it pulls the rocker instead of pushing it. That puts the springs and dampers low on the gearbox, lowering the car's centre of gravity and leaving the space above clear for the airflow to the rear wing. Mercedes, Ferrari and McLaren all used pull-rods at the rear in 2016.",
      ],
    },
    "toe-links": {
      name: "Rear toe links",
      category: "suspension",
      summary: "Fixed-length rods that stop the rear wheels from steering themselves.",
      details: [
        "At the rear, the sixth suspension member is a toe link. It holds the wheel's angle to the direction of travel steady as the suspension moves and under braking loads.",
      ],
    },
    "rs-inboard": {
      name: "Rear springs & dampers",
      category: "suspension",
      summary: "The rear rockers, torsion bars and heave damper, low on the gearbox.",
      details: [
        "As at the front, torsion bars provide the springing and dampers control the motion. The heave stiffness sets how much the rear squats at speed, which changes the rake and with it the downforce.",
      ],
    },

    // --- Wheels -------------------------------------------------------------
    "front-corners": {
      name: "Front corners",
      category: "wheels",
      summary: "Tyres, wheels, brakes, ducts and uprights of the front axle.",
      details: ["The four contact patches, each about the size of a postcard, carry every force the car makes. Everything at the corner exists to keep those patches working."],
    },
    "rear-corners": {
      name: "Rear corners",
      category: "wheels",
      summary: "The driven rear wheels with their tyres, brakes, ducts and uprights.",
      details: ["The rear tyres put down the turbo engines' huge torque, which made traction out of slow corners one of the hardest problems of the era."],
    },
    "front-tyres": {
      name: "Front tyres",
      category: "wheels",
      summary: "Narrow 13-inch slicks with tall sidewalls.",
      details: [
        "Without tread, a slick puts the most rubber possible on the track. The rubber works best in a narrow temperature window, which is why drivers weave behind the safety car to warm their tyres.",
        "On 13-inch rims the sidewalls are tall and flex a lot, which the suspension and aerodynamics have to allow for. Pirelli made these tyres to wear quickly, to force pit stops and strategy.",
        "The coloured band shows the compound.",
      ],
      specs: [
        ["Size", "Pirelli 245/660-R13"],
        ["Width as fitted", "305–355 mm"],
        ["Diameter", "≤660 mm (wets ≤670 mm)"],
      ],
    },
    "rear-tyres": {
      name: "Rear tyres",
      category: "wheels",
      summary: "Wider 13-inch slicks that carry the drive.",
      details: ["The rear tyres take the traction and much of the braking load. Keeping them in their temperature window over a stint is often what decides a race."],
      specs: [
        ["Size", "Pirelli 325/660-R13"],
        ["Width as fitted", "365–380 mm"],
      ],
    },
    "front-rims": {
      name: "Front wheels",
      category: "wheels",
      summary: "Forged magnesium 13-inch rims with a single centre-lock nut and no covers.",
      details: [
        "Each wheel is fixed by one central nut so a pit crew can change all four in a few seconds. Nothing may cover the wheel, so the spokes and the brake drum behind them stay visible.",
      ],
      specs: [
        ["Material", "Forged magnesium alloy"],
        ["Rim width", "12 inches"],
      ],
    },
    "rear-rims": {
      name: "Rear wheels",
      category: "wheels",
      summary: "Wider 13-inch magnesium rims for the rear tyres.",
      details: [
        "Like the fronts, they are fixed by a single centre-lock nut. Two high-strength tethers attach each wheel assembly to the chassis, so a wheel cannot fly free in a crash.",
      ],
      specs: [
        ["Rim width", "13.7 inches"],
        ["Tethers", "2 per wheel, ≥6 kJ each (from 2015)"],
      ],
    },
    "front-brakes": {
      name: "Front brakes",
      category: "wheels",
      summary: "Carbon-carbon discs gripped by aluminium calipers, slowing the car at more than 5 g.",
      details: [
        "Carbon-carbon discs run at 400–1,000 °C and get stronger, not weaker, as they heat up. Hundreds of small radial holes pump air through each disc to control its temperature.",
      ],
      specs: [
        ["Disc", "≤278 mm diameter, ≤28 mm thick"],
        ["Caliper", "Aluminium, up to 6 pistons"],
      ],
    },
    "rear-brakes": {
      name: "Rear brakes",
      category: "wheels",
      summary: "Smaller rear discs, blended electronically with the MGU-K's regenerative braking.",
      details: [
        "At the rear, the MGU-K does much of the braking by generating electricity. With far more harvesting than the old KERS, the braking balance would change with the battery's state, so **brake-by-wire** arrived in 2014 to blend it with the hydraulic brakes and keep the pedal consistent.",
      ],
      specs: [["Control", "Brake-by-wire (from 2014)"]],
    },
    "front-ducts": {
      name: "Front brake ducts",
      category: "cooling",
      summary: "Carbon scoops and drums that feed cooling air to the brakes.",
      details: [
        "The inlet scoop picks up air on the inside of the wheel. The drum around the disc channels it through the disc's holes and out. The rules keep them within 120 mm inboard of the rim and close to axle height.",
      ],
    },
    "rear-ducts": {
      name: "Rear brake ducts",
      category: "cooling",
      summary: "Cooling inlets and drums for the rear brakes.",
      details: ["They work like the front ducts. Teams change the inlet sizes between circuits to suit how hard the brakes are used."],
    },
    "front-uprights": {
      name: "Front uprights",
      category: "suspension",
      summary: "The hub carriers that join the wheel, brakes and suspension, and are turned by the steering.",
      details: [
        "Machined from titanium or metal-matrix composites, the upright carries the wheel bearings and caliper, and is where all the wishbone, push-rod and track-rod loads meet. Its stiffness directly affects how precisely the tyre is held.",
      ],
    },
    "rear-uprights": {
      name: "Rear uprights",
      category: "suspension",
      summary: "Rear hub carriers that take the driveshaft and the rear suspension members.",
      details: [
        "Unlike the fronts they don't steer, but they carry the driveshaft through their bearings and the toe link that fixes their angle.",
      ],
    },
  },
};
