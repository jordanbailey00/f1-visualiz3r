import type { CarInfo } from "../types";

/**
 * The 2017–2021 car. Figures come from the FIA Formula 1 Technical
 * Regulations of those years (2021 Issue 10 unless noted) and the Sporting
 * Regulations; the model is a generic car built to the 2021 rules, not any
 * one team's design.
 */
export const car2017: CarInfo = {
  id: "2017",
  name: "Wide hybrids",
  shortName: "2017",
  years: "2017–2021",
  model: "Generic 2017–2021-regulation car, to the 2021 rules (not any one team's design)",
  tagline: "Wider cars, fatter tyres and the halo.",
  intro: [
    "For 2017 Formula 1 made its cars **wider, grippier and much faster**. They grew from 1.8 m to 2 m wide, the tyres about a quarter wider, the wings and diffuser bigger, and lap times fell by several seconds. Cars of this era set lap records at many circuits.",
    "Much of their downforce came from wings and from the **bargeboards**, which steered the front tyres' turbulent wake away from a flat floor with a 50 mm step. The wake they left made it hard to follow closely, which is why the 2022 rules switched to ground effect.",
    "The **halo** arrived in 2018. Press **DRS** (or **A**) to open the rear wing flap. Press **Explode** to take the car apart layer by layer, and click any part to learn what it does.",
  ],
  specs: [
    ["Width", "2,000 mm (2016: 1,800)"],
    ["Wheelbase", "No limit; about 3.6–3.7 m"],
    ["Minimum mass", "752 kg without fuel (2017: 728 kg)"],
    ["Power unit", "1.6 L V6 turbo + MGU-K 120 kW + MGU-H"],
    ["Rev limit", "15,000 rpm"],
    ["Fuel", "≤110 kg per race (2017–18: 105 kg)"],
    ["Aero", "Bargeboards, stepped floor, DRS rear wing"],
    ["Tyres", "13-inch Pirelli: 305/670 front, 405/670 rear"],
  ],
  camera: { position: [3700, 2050, 4400], target: [0, 350, 0] },
  size: 5600,
  parts: {
    // --- Survival cell ------------------------------------------------------
    chassis: {
      name: "Survival cell",
      category: "chassis",
      summary: "The carbon-fibre tub that holds the driver and the fuel, and carries every other part of the car.",
      details: [
        "Everything on the car is bolted to the survival cell. The front suspension, nose and steering are mounted on it, and the engine is bolted directly to its rear face as a stressed member. The gearbox and rear suspension hang off the back of the engine.",
        "The rules measure the cockpit from **C-C**, the rear face of the cockpit-entry template. The front bulkhead must be at least 1,800 mm ahead of it, and set sections must fit inside the tub: 300 × 275 mm at the front bulkhead, growing to 450 × 400 mm at 875 mm ahead of C-C.",
        "From 2018 it also had to carry the halo and the huge loads it is tested to.",
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
      summary: "A long, slim crushable nose with a low tip, absorbing a frontal impact before it reaches the driver.",
      details: [
        "The nose is a hollow carbon cone designed to crush progressively, turning the car's energy into broken fibres instead of deceleration for the driver. It must stop a 780 kg trolley at 15 m/s.",
        "Its tip must reach at least 1,075 mm ahead of the front axle (1,050 mm before 2019) and sit no higher than 220 mm above the reference plane, so most noses were long and slim. Many teams added a **cape** underneath, a skirt that channels air toward the floor, and an **S-duct**: an inlet under the nose that vents air out of the top, behind the crash structure.",
      ],
      specs: [
        ["Crash test", "780 kg at 15 m/s"],
        ["Tip", "≥1,075 mm ahead of the front axle, ≤220 mm high"],
      ],
    },
    halo: {
      name: "Halo",
      category: "safety",
      summary: "A titanium hoop over the cockpit that protects the driver's head, mandatory from 2018.",
      details: [
        "The halo is made of Grade 5 titanium tube and weighs about **7 kg**. Two rear mounts and a central front pillar, 975 mm ahead of the cockpit rear, bolt it to the survival cell, and teams cover it with a thin carbon aero fairing.",
        "Many drivers and fans called it ugly when it arrived. Within three seasons it had saved lives.",
      ],
      specs: [
        ["Material", "Grade 5 titanium"],
        ["Mass", "≈7 kg"],
        ["Test loads", "116 kN down + 46 kN back; 93 kN sideways + 83 kN back"],
      ],
      didYouKnow:
        "In Bahrain in 2020 Romain Grosjean's car speared through a steel barrier and caught fire. The halo forced the barrier apart around his head, and he climbed out of the flames.",
    },
    "roll-structure": {
      name: "Roll structure & airbox",
      category: "safety",
      summary: "The hoop above the driver's head that protects them if the car flips; it is also the engine's air intake.",
      details: [
        "If the car turns over, this structure and the halo keep a survival space around the driver's head. It must reach at least 940 mm above the reference plane, just behind the cockpit.",
        "The opening at the front is the airbox. It feeds the turbocharger's compressor, and in many cars also an oil or ERS cooler packaged underneath. The T-camera sits on top (see **On-board cameras**).",
      ],
      specs: [["Height", "≥940 mm above the reference plane"]],
    },
    "fuel-cell": {
      name: "Fuel cell",
      category: "power",
      summary: "A puncture-resistant rubber bladder behind the driver, holding up to 110 kg of fuel.",
      details: [
        "The fuel sits in a flexible bag of Kevlar-reinforced rubber, built to the FIA's FT5 standard. It can deform in a crash without splitting. Inside, pumps, baffles and a small collector tank keep fuel at the pickup even under cornering loads of 5 g.",
        "A car could use no more than **110 kg** of fuel in a race (105 kg in 2017 and 2018), and an FIA flow meter limits the flow into the engine to **100 kg per hour**. By 2021 the rules required two flow meters, after rivals questioned how Ferrari's 2019 engine stayed within the limit.",
      ],
      specs: [
        ["Standard", "FIA FT5 safety bladder"],
        ["Race fuel", "≤110 kg (2017–18: 105 kg)"],
        ["Fuel flow", "≤100 kg/h"],
      ],
      didYouKnow: "A full fuel load makes a car about 3 seconds a lap slower than it is on the last lap, which is why lap times fall through a race even as the tyres wear.",
    },
    cockpit: {
      name: "Cockpit",
      category: "cockpit",
      summary: "The driver's workspace: a moulded seat, the steering wheel and energy-absorbing padding.",
      details: [
        "The driver lies back with their feet higher than their hips, so the car can be as low as possible. Strapped in and fully kitted, the driver must be able to remove the steering wheel and climb out within **7 seconds**, then refit the wheel within 12 seconds in total (5 and 10 seconds before 2018).",
        "From 2019 the driver, seat and any ballast must weigh at least **80 kg**, with the ballast inside the cockpit. Before that, lighter drivers had an advantage, and tall drivers starved themselves to make weight.",
      ],
      specs: [
        ["Driver + seat minimum", "80 kg (from 2019)"],
        ["Exit test", "Out in 7 s; wheel refitted within 12 s"],
      ],
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
        "The wheel carries the shift paddles, the clutch paddles used at the start, and buttons and rotary switches for the radio, drinks, pit-lane limiter, brake balance, differential and engine modes. The **DRS** button opens the rear wing flap.",
        "The display shows gear, lap delta, battery charge and warnings. The rows of lights along the top tell the driver when to shift.",
      ],
      specs: [
        ["Controls", "Paddles, buttons and rotary switches"],
        ["Display", "Gear, deltas, battery state, flags"],
      ],
      didYouKnow:
        "In 2020 Mercedes' drivers could push and pull the whole wheel to change the front wheels' toe angle on the straights, a system called DAS. It was banned for 2021.",
    },
    headrest: {
      name: "Headrest & cockpit padding",
      category: "safety",
      summary: "Energy-absorbing foam around the driver's head and shoulders.",
      details: [
        "Padding behind and each side of the driver's head is made from a foam that compresses slowly under impact. This limits how fast the head can move in a crash. The side pads must be at least 95 mm thick.",
        "It lifts out as one piece, so marshals can reach the driver.",
      ],
    },
    mirrors: {
      name: "Mirrors",
      category: "cockpit",
      summary: "Rear-view mirrors in housings above the sidepods.",
      details: [
        "Each glass is 150 × 50 mm. From 2020 the housing must fit inside a box 160 mm wide, 80 mm tall and 75 mm deep, its rear face turned 60–70° to the car, placed just ahead of the cockpit's rear edge and above the sidepods.",
      ],
      specs: [["Glass", "150 × 50 mm"]],
      didYouKnow: "In 2018 Ferrari mounted its mirrors on the halo, with small winglets on their stalks. The FIA banned it from that year's Monaco Grand Prix.",
    },
    "side-impact": {
      name: "Side impact structures",
      category: "safety",
      summary: "Crushable FIA-specified tubes in the sidepods that absorb a side impact before it reaches the tub.",
      details: [
        "Two tubes on each side stick out from the survival cell, one high and one low, 500 mm ahead of the cockpit rear. They must be fully enclosed by bodywork. In a T-bone crash they crush first, spreading the load and slowing the intrusion.",
        "Their position sets the shape of the sidepod inlets, which is why most cars' inlets sit around them.",
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
      summary: "A small FIA camera at the front of the cockpit, filming the driver at high frame rates.",
      details: [
        "Together with the accident data recorder and the accelerometers in the driver's earpieces, it shows the FIA exactly how a driver's head and body move in a crash. That evidence shaped the halo, the headrest and today's seats.",
      ],
    },
    cameras: {
      name: "On-board cameras",
      category: "electronics",
      summary: "The TV cameras every car must carry, in positions the FIA fixes.",
      details: [
        "The **T-camera** sits on top of the roll hoop, with a pair of cameras beside it, pods on the nose, and a forward-facing camera on the chassis. Housings used instead of cameras must match a real camera's size, shape and mass, so the choice never changes the car's balance.",
        "The T-camera's colour (black or fluorescent yellow) tells viewers which of a team's two cars they are watching.",
      ],
    },

    // --- Front wing ---------------------------------------------------------
    "front-wing": {
      name: "Front wing",
      category: "aero",
      summary: "Five elements across the full 2 m width, outboard of a fixed neutral section under the nose.",
      details: [
        "The front wing makes downforce over the front tyres and shapes the air for the rest of the car. In 2017 it was 1,800 mm wide and swept back, with intricate endplates and cascades. For 2019 the FIA simplified it to help cars follow each other: **2,000 mm** wide, no more than **five elements**, plain endplates and only two strakes underneath.",
        "Teams still found outwash: the outer flaps were cut down toward the endplates to fling the front tyres' wake outward, away from their own floor.",
      ],
      specs: [
        ["Elements", "Up to 5 (from 2019)"],
        ["Span", "2,000 mm (2017–18: 1,800)"],
        ["Position", "450–1,225 mm ahead of the front axle"],
        ["Height", "75–300 mm above the reference plane"],
      ],
    },
    "fw-mainplane": {
      name: "Front mainplane & neutral section",
      category: "aero",
      summary: "The lowest element of the wing, and the FIA's fixed profile across its middle.",
      details: [
        "Running close to the ground, the mainplane benefits from **ground effect**: the air speeds up in the narrow gap under it, lowering the pressure and pulling the wing down harder than it would in free air.",
        "The middle 500 mm is the **neutral section**: a profile drawn by the FIA that every car must use, so no team can tune the airflow under the nose. Two pylons, each no more than 25 mm thick, carry the nose down onto it.",
      ],
    },
    "fw-flaps": {
      name: "Front flaps",
      category: "aero",
      summary: "Four flaps stacked above and behind the mainplane, rising steeply toward the nose.",
      details: [
        "Each flap sits behind and above the element in front, with a 5–15 mm slot between them. Fast air from each slot keeps the flow attached to the next element, which lets the stack run steep angles without stalling.",
        "Near the nose their trailing corners are cut away on a diagonal: the rules keep a zone clear ahead of the front wheels. Outboard, the flaps step down toward the endplates.",
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
      summary: "Flat plates at the wing tips, with a foot plate and two strakes under the wing.",
      details: [
        "An open wing tip lets high-pressure air spill round into the low-pressure side, wasting downforce and creating a tip vortex. The endplate limits that spillage.",
        "Until 2018 endplates sprouted slots, canards and curls to throw the front tyres' wake outward. From 2019 they had to be flat, at least 10 mm thick and without slots, standing 910–950 mm from the centre line.",
      ],
      specs: [
        ["Position", "910–950 mm from the centre line"],
        ["Strakes", "Up to 2 per side under the wing"],
      ],
    },
    "fw-adjusters": {
      name: "Flap adjusters",
      category: "aero",
      summary: "The screw mechanisms that set the front flaps' angle, turned by hand at a pit stop.",
      details: [
        "A mechanic on each side fits a tool to the adjuster and turns it during a normal stop. The rear four elements may move by up to 35 mm, only with a tool and only on the stationary car. More flap gives more front grip and cures understeer, at the cost of a little drag.",
        "As the tyres wear and the fuel burns off, a car's balance shifts, so a small flap change at the stop can restore it for the next stint.",
      ],
    },

    // --- Power unit ---------------------------------------------------------
    "power-unit": {
      name: "Power unit",
      category: "power",
      summary: "A 1.6-litre turbocharged V6 with two electric motor-generators, making close to 1,000 hp.",
      details: [
        "F1 calls it a power unit because the engine is only part of it. The **MGU-K** on the crankshaft recovers energy under braking and adds up to 120 kW. The **MGU-H** on the turbo shaft recovers energy from the exhaust, and uses it to kill turbo lag.",
        "The 2017 rules scrapped the token system that had rationed engine development, and manufacturers raced to find power. Each driver could use only three engines a season from 2018, so reliability mattered as much as speed.",
      ],
      specs: [
        ["ICE", "1.6 L, 90° V6, single turbo"],
        ["Rev limit", "15,000 rpm"],
        ["Electric", "MGU-K 120 kW + MGU-H"],
        ["Minimum mass", "150 kg (2017–20: 145 kg)"],
      ],
      didYouKnow: "Mercedes won every constructors' championship from 2014 to 2021, the longest run of titles in the sport's history.",
    },
    ice: {
      name: "V6 engine (ICE)",
      category: "power",
      summary: "The internal combustion engine: six cylinders in a 90° vee, with the fuel flow capped at 100 kg/h.",
      details: [
        "Each cylinder has an 80 mm bore and the total displacement is 1.6 litres. Fuel is injected directly into the cylinders at very high pressure. Very lean combustion and pre-chamber ignition let the best of these engines turn more than half the fuel's energy into work, against about a third in a road car.",
        "Above 10,500 rpm the fuel flow is capped at 100 kg per hour, so extra revs bring no extra fuel. That is why the engines rarely went near their 15,000 rpm limit.",
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
        "Hot exhaust spins the turbine wheel. A shaft drives the compressor on the other side, squeezing intake air to several times atmospheric pressure.",
        "The MGU-H sits on the same shaft. Mercedes split the turbo from 2014, putting the compressor at the front of the engine and the turbine at the back, joined by a long shaft through the vee. Honda later did the same.",
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
        "Unlike the MGU-K, the energy it may recover is unlimited, which made the system remarkably efficient, and very hard to master.",
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
      summary: "Inconel pipes that gather the six cylinders' exhaust into the turbine, then out through one tailpipe and two wastegate pipes.",
      details: [
        "The primaries are made of Inconel, a nickel superalloy that keeps its strength at around 900 °C. Their lengths are tuned so the pulses from each cylinder arrive at the turbine evenly. The heat turns the metal straw-gold and blue.",
        "The rules allow a single turbine tailpipe and one or two separate wastegate pipes. Their last 150 mm must run straight, within 100 mm of the centre line and 350–550 mm above the reference plane, exiting 220–235 mm behind the rear axle.",
      ],
      specs: [
        ["Material", "Inconel nickel superalloy"],
        ["Tailpipes", "1 turbine + 1–2 wastegate"],
        ["Exit", "220–235 mm behind the rear axle"],
      ],
    },
    "oil-tank": {
      name: "Oil tank",
      category: "power",
      summary: "The tank for the dry-sump oil system, between the engine and the fuel cell.",
      details: [
        "F1 engines use a **dry sump**: scavenge pumps suck the oil out of the crankcase and send it to a separate tank, then a pressure pump feeds it back. This lets the engine sit low and keeps oil supplied under any cornering load.",
        "After suspicions that teams were burning oil in the engine for extra power, the FIA cut the oil an engine may consume in steps, to 0.3 litres per 100 km.",
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
        "Under braking the MGU-K works as a generator and charges the battery; on the throttle it drives the wheels with up to 120 kW. Each lap, the MGU-K may harvest **2 MJ**, and the battery may release **4 MJ** to it. The difference comes from the MGU-H, which can harvest without limit.",
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
        "The ECU, built by McLaren Applied, decides how much torque the engine and MGU-K deliver for a given throttle position. It runs the seamless gearshifts and the rear brake-by-wire, and enables the DRS only where race control allows it.",
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
        "The minimum mass rose every year of these rules, from 728 kg in 2017 to 752 kg in 2021, as the halo, bigger tyres and the driver weight rule added kilograms.",
      ],
      specs: [
        ["Minimum mass", "752 kg without fuel (2017: 728 kg)"],
        ["Weight split", "Front ≥45.5%, rear ≥53.5% of the minimum (from 2019)"],
      ],
    },

    // --- Cooling ------------------------------------------------------------
    cooling: {
      name: "Cooling system",
      category: "cooling",
      summary: "Radiators and coolers that reject the heat of the engine, the turbo air and the electrics.",
      details: [
        "Roughly as much energy leaves the power unit as heat as is delivered as power. Coolant, oil, compressed intake air and the ERS all need their own cooling.",
        "Bigger radiators mean bigger sidepods and more drag, so teams trade cooling against speed. Many run extra cooling louvres at hot races.",
      ],
    },
    radiators: {
      name: "Radiators & charge-air cooler",
      category: "cooling",
      summary: "Steeply inclined cores in the sidepods: water on one side, compressed intake air on the other.",
      details: [
        "Air from the sidepod inlet passes through fine aluminium fins between flat tubes carrying hot coolant or hot compressed air. Leaning the cores steeply lets a tall core fit inside a low sidepod.",
        "The charge-air cooler matters for power: compressing air heats it, and cooler air is denser, so more of it fits in the cylinders.",
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
        "The gearbox casing is also part of the chassis. Bolted to the back of the engine, it carries the rear suspension, the rear crash structure and the rear wing pylon.",
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
        "Teams declared one set of ratios at the start of each season.",
      ],
      specs: [
        ["Forward gears", "8, plus reverse"],
        ["Gears", "Steel, ≥12 mm wide"],
      ],
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
        "The joints at each end let the shaft keep turning smoothly as the suspension moves. Each shaft carries well over 1,000 Nm in the low gears.",
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
        "The light is switched on in wet conditions so following drivers can see the car through the spray. From 2019 two more LED lights, in the rear wing endplates, work with it.",
      ],
      specs: [["Height", "300 mm above the reference plane"]],
    },

    // --- Rear wing ----------------------------------------------------------
    "rear-wing": {
      name: "Rear wing",
      category: "aero",
      summary: "A two-element wing between tall flat endplates, with the DRS flap on top.",
      details: [
        "The rear wing makes downforce for the rear axle. The 2017 rules made it lower and wider than before, and for 2019 it grew again, to 1,050 mm wide and 870 mm high, with a bigger DRS flap.",
        "There is no beam wing below it: from 2014 to 2021 the rules kept the space between the rear wheels clear. A small \"monkey seat\" winglet above the exhaust was banned from 2018, along with the T-wings on the engine cover.",
        "The upper element is the **DRS** flap. Press **DRS** in the toolbar (or **A**) to open it.",
      ],
      specs: [
        ["Elements", "Mainplane + DRS flap"],
        ["Span", "1,050 mm (2017–18: 950)"],
        ["Height", "Up to 870 mm (2017–18: 800)"],
      ],
    },
    "rw-mainplane": {
      name: "Rear mainplane",
      category: "aero",
      summary: "The fixed lower element of the rear wing.",
      details: [
        "The mainplane makes most of the wing's downforce. It must sit between 150 and 500 mm behind the rear axle, with the flap, and more than 650 mm above the reference plane. Some teams, Red Bull most visibly, shaped it like a spoon, deeper in the middle, to cut drag at the tips.",
      ],
    },
    "rw-flap": {
      name: "DRS flap",
      category: "aero",
      summary: "The upper element, which opens on the straights to cut drag: the Drag Reduction System.",
      details: [
        "When the driver opens DRS, a hydraulic actuator lifts the flap's leading edge, pivoting it near the trailing edge. The slot to the mainplane opens wide, and the wing stops making much downforce or drag. Touching the brakes closes it.",
        "For 2019 the flap grew to at least 1,008 mm wide and its opening from 65 to 85 mm, making DRS more powerful to make up for the simpler front wings.",
      ],
      specs: [
        ["Slot gap", "10–15 mm closed, ≤85 mm open (2017–18: 65)"],
        ["Width", "≥1,008 mm (from 2019)"],
      ],
      howItWorks: [
        "At a detection point before the straight, the timing system checks the gap to the car ahead.",
        "Under one second behind, the driver may open the flap in the following DRS zone by pressing the DRS button.",
        "The flap closes when the driver brakes or presses the button again. In practice and qualifying, any car may use it in the zones.",
      ],
      didYouKnow: "DRS arrived in 2011 as a fix for how hard it was to follow another car. These cars needed it more than most.",
    },
    "rw-lights": {
      name: "Rear wing lights",
      category: "safety",
      summary: "LED rain lights in the endplates, from 2019.",
      details: [
        "One light in each endplate, between 650 and 870 mm above the reference plane, facing straight back. Mounted high, they are easier to see through the spray than the rain light low on the crash structure.",
      ],
    },
    "rw-endplates": {
      name: "Rear endplates",
      category: "aero",
      summary: "Tall flat plates at the wing tips that step inward below the wing.",
      details: [
        "The endplates tidy the wing-tip vortices, a big source of drag, and stop high-pressure air spilling round the tips. The rules make them big: their side area must exceed 280,000 mm².",
        "Above 500 mm the car may be 1,050 mm wide, but below it only 840 mm, so the plates step inward toward their feet. From 2019 no slots or louvres were allowed above 600 mm.",
      ],
      specs: [
        ["Side area", ">280,000 mm²"],
        ["Width", "1,050 mm above Z = 500, 840 mm below"],
      ],
    },
    "rw-pylon": {
      name: "Rear wing pylon",
      category: "aero",
      summary: "A slender central support that carries the wing and wraps around the exhaust.",
      details: [
        "The pylon carries the wing's load, several hundred kilograms at high speed, down into the gearbox. It may be no more than 25 mm thick, with up to two blades, which limits its disturbance to the airflow under the wing.",
        "Behind 200 mm past the rear axle nothing may stand between 400 and 600 mm up, near the centre line, so the blade climbs ahead of that zone before reaching back under the wing.",
      ],
    },
    "rw-actuator": {
      name: "DRS actuator",
      category: "aero",
      summary: "The hydraulic actuator that opens and closes the DRS flap.",
      details: [
        "A small hydraulic ram in the head of the pylon drives the flap through a linkage. The FIA ECU allows it to open only in a DRS zone, and if it fails, the flap must close and stay closed.",
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
      name: "Engine cover & fin",
      category: "aero",
      summary: "The tapering cover over the power unit, with the tall fin the rules shape.",
      details: [
        "From the side, the cover must fill an area that falls from 925 mm high, 1,000 mm ahead of the rear axle, to 550 mm just ahead of it. In 2017 a fin above that could reach 950 mm, so the cars carried huge **shark fins**, and teams hung small **T-wings** off them.",
        "For 2018 the FIA cut the allowed height to a line about 100 mm above the required area. The fins shrank and the T-wings vanished. The cover then narrows into the **coke bottle** and ends in a cooling exit around the exhaust.",
      ],
      didYouKnow: "The shark fin's job was to straighten the airflow onto the rear wing when the car was yawed in a corner; the T-wings added a little downforce from an unclaimed corner of the rules.",
    },
    sidepods: {
      name: "Sidepods",
      category: "aero",
      summary: "The pods either side of the driver that house the radiators, cut back tightly toward the rear.",
      details: [
        "The inlets swallow air for the radiators, and the outside shape decides how the rest flows past. Outboard of 350 mm from the centre line they may be no higher than 600 mm, and a gap must stay clear ahead of them, behind the bargeboards.",
        "Teams shrank them as far as cooling allowed, undercutting their fronts to feed the floor edge and packing the coolers tightly so the bodywork could narrow sharply toward the rear.",
      ],
    },

    // --- Floor --------------------------------------------------------------
    floor: {
      name: "Floor",
      category: "aero",
      summary: "A flat floor with a 50 mm step, a diffuser at the back, and the car tilted nose-down to make it work.",
      details: [
        "Seen from below, everything from behind the front wheels to the diffuser must lie on one of two flat planes: the reference plane along the middle, where the plank is, or the **step plane** 50 mm above it.",
        "Teams ran the cars with **rake**, the rear 1–2° higher than the front, turning the whole floor into a giant diffuser. Red Bull ran the most rake, Mercedes the least.",
        "For 2021 the FIA cut a triangle off each side of the floor ahead of the rear tyres and banned slots in its edges, taking away roughly a tenth of the downforce to protect the tyres.",
      ],
      specs: [
        ["Width", "±800 mm"],
        ["Step", "50 mm"],
        ["2021 cut", "Edge narrows to ±650 mm at the rear axle"],
      ],
    },
    "floor-body": {
      name: "Floor body & tea tray",
      category: "aero",
      summary: "The flat carbon floor, and the tea tray (splitter) under the chassis ahead of it.",
      details: [
        "The underside is flat: a 300 mm wide keel on the reference plane, carrying the plank, with the step plane 50 mm higher on either side. The edges were full of slots and cuts until 2021, when the slots were banned.",
        "Ahead of the floor, the **tea tray** juts forward under the chassis. The rules keep it at least 100 mm off the ground, rising toward the front.",
      ],
    },
    bargeboards: {
      name: "Bargeboards",
      category: "aero",
      summary: "The forest of vanes between the front wheels and the sidepods: the signature of this era.",
      details: [
        "The front tyres throw off a turbulent wake that would ruin the airflow along the floor. The bargeboards, turning vanes and footplates catch that wake and fling it outward, and set up vortices that seal the floor edge.",
        "The 2017 rules opened up a large zone for them, and teams filled it with dozens of slotted elements. For 2019 they were lowered from 475 to 350 mm, and a gap must stay clear just ahead of the sidepods. Behind it, tall deflectors and \"boomerang\" winglets beside the sidepod inlets did the same job.",
      ],
      specs: [
        ["Zone", "From 430 mm behind the front axle to the sidepods, out to ±800 mm"],
        ["Height", "≤350 mm (2017–18: 475)"],
      ],
      didYouKnow: "The bargeboards' wake management made these cars fast in clean air but very hard to follow, the main reason for the 2022 switch to ground effect.",
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
      summary: "The rising tail of the floor between and behind the rear wheels.",
      details: [
        "Air under the floor has to return to normal speed and pressure before it leaves the car. The diffuser's expanding shape does this gradually, which lets the air under the car run faster in the first place.",
        "For 2017 it grew to 175 mm high and 1,050 mm wide, starting 175 mm ahead of the rear axle. For 2021 the fences inside it were shortened to cut downforce.",
      ],
      specs: [
        ["Start", "175 mm ahead of the rear axle"],
        ["Exit", "350 mm behind the axle, ≤175 mm high, 1,050 mm wide"],
      ],
    },
    plank: {
      name: "Plank & skids",
      category: "chassis",
      summary: "A 300 mm wide skid board under the floor that stops teams running the car dangerously low.",
      details: [
        "Running lower makes more downforce, so teams are tempted to scrape the floor along the track. The plank polices that: it must be 10 mm thick, give or take 1 mm, so after the race it must still measure at least 9 mm at six of its seven holes.",
        "Titanium skids set into it take the worst of the contact. They are what throw the sparks you see at night races.",
      ],
      specs: [
        ["Size", "300 mm wide, 10 ± 1 mm thick"],
        ["Length", "From 430 mm behind the front axle to the rear axle"],
        ["Skids", "Titanium, ≤20,000 mm² in all"],
      ],
    },

    // --- Suspension ---------------------------------------------------------
    "front-suspension": {
      name: "Front suspension",
      category: "suspension",
      summary: "Wishbones, push-rods and steering that hold the front wheels at precisely controlled angles.",
      details: [
        "Each wheel is located by six members: two wishbones (four legs), a push-rod, and a track rod for steering. Each axle's suspension may respond only to its own loads, so the front-to-rear linked systems some teams used until 2014 stay banned.",
        "Push-rods at the front and pull-rods at the rear were the norm in these years, as on this model.",
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
        "Instead of coil springs, F1 cars use **torsion bars**, steel bars that twist as the rocker turns. They give very precise rates in little space. A heave element between the two sides controls the car's pitch and ride height; in these years teams used hydraulic heave elements and inerters to control the rake precisely.",
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
        "A pull-rod works in tension: when the wheel rises it pulls the rocker instead of pushing it. That puts the springs and dampers low on the gearbox, lowering the car's centre of gravity and leaving the space above clear for the airflow to the rear wing.",
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
      details: ["The rear tyres are wider because they put down close to 1,000 hp, and their wear and temperature often decide a race."],
    },
    "front-tyres": {
      name: "Front tyres",
      category: "wheels",
      summary: "Slick 13-inch tyres, about a quarter wider from 2017.",
      details: [
        "Without tread, a slick puts the most rubber possible on the track. The rubber works best in a narrow temperature window, roughly 90–110 °C, which is why drivers weave behind the safety car to warm their tyres.",
        "On 13-inch rims the sidewalls are tall and flex a lot, which the suspension and aerodynamics have to allow for. They were the last of the 13-inch tyres; 18-inch wheels arrived in 2022.",
        "The coloured band shows the compound: red for soft, yellow for medium, white for hard.",
      ],
      specs: [
        ["Size", "Pirelli 305/670-R13"],
        ["Width as fitted", "370–385 mm"],
        ["Diameter", "≤670 mm (wets ≤680 mm)"],
      ],
    },
    "rear-tyres": {
      name: "Rear tyres",
      category: "wheels",
      summary: "Wide 13-inch slicks that carry the drive.",
      details: ["The rear tyres take the traction and much of the braking load. Keeping them in their temperature window over a stint is often what decides a race."],
      specs: [
        ["Size", "Pirelli 405/670-R13"],
        ["Width as fitted", "455–470 mm"],
      ],
    },
    "front-rims": {
      name: "Front wheels",
      category: "wheels",
      summary: "Forged magnesium 13-inch rims with a single centre-lock nut and no covers.",
      details: [
        "Each wheel is fixed by one central nut so a pit crew can change all four in about two seconds. Wheel covers were banned, so the spokes and the brake drum behind them stay visible.",
        "Teams used to blow brake-duct air out through the hollow axles and wheel nuts to steer the tyres' wake. The rules shut that down from 2019.",
      ],
      specs: [["Material", "Forged magnesium alloy"]],
    },
    "rear-rims": {
      name: "Rear wheels",
      category: "wheels",
      summary: "Wider 13-inch magnesium rims for the rear tyres.",
      details: [
        "Like the fronts, they are fixed by a single centre-lock nut. Since 2018 three high-strength tethers attach each wheel assembly to the chassis, so a wheel cannot fly free in a crash.",
      ],
      specs: [["Tethers", "3 per wheel, 7 kJ each (from 2018)"]],
    },
    "front-brakes": {
      name: "Front brakes",
      category: "wheels",
      summary: "Carbon-carbon discs gripped by aluminium calipers, slowing the car at more than 5 g.",
      details: [
        "Carbon-carbon discs run at 400–1,000 °C and get stronger, not weaker, as they heat up. More than a thousand small radial holes pump air through each disc to control its temperature.",
        "Squeezed inside a 13-inch wheel, the discs could be no more than 278 mm across.",
      ],
      specs: [
        ["Disc", "≤278 mm diameter, ≤32 mm thick"],
        ["Caliper", "Aluminium, up to 6 pistons"],
        ["Working temperature", "≈400–1,000 °C"],
      ],
    },
    "rear-brakes": {
      name: "Rear brakes",
      category: "wheels",
      summary: "Smaller rear discs, blended electronically with the MGU-K's regenerative braking.",
      details: [
        "At the rear, the MGU-K does much of the braking by generating electricity. A **brake-by-wire** system blends it with the hydraulic brakes so the pedal feels consistent.",
      ],
      specs: [["Control", "Brake-by-wire"]],
    },
    "front-ducts": {
      name: "Front brake ducts",
      category: "cooling",
      summary: "Carbon scoops and drums that feed cooling air to the brakes, and steer the tyres' wake.",
      details: [
        "The inlet scoop picks up air on the inside of the wheel. The drum around the disc channels it through the disc's holes and out.",
        "The ducts sprouted winglets that steered the airflow around the tyres. From 2019 they could reach only 120 mm inboard of the rim.",
      ],
    },
    "rear-ducts": {
      name: "Rear brake ducts",
      category: "cooling",
      summary: "Cooling inlets and drums for the rear brakes, with winglets on their outer face.",
      details: ["They work like the front ducts. For 2021 the winglets on their lower part were cut back by 40 mm, one of the changes that trimmed the cars' downforce that year."],
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
