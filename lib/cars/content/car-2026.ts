import type { CarInfo } from "../types";

/**
 * The 2026 car. Figures come from the FIA 2026 Formula 1 Technical
 * Regulations (Section C) unless noted; the model is a generic car built to
 * those rules, not any one team's design.
 */
export const car2026: CarInfo = {
  id: "2026",
  name: "Active aero",
  shortName: "2026",
  years: "2026–",
  model: "Generic 2026-regulation car (not any one team's design)",
  tagline: "Moving wings and a hybrid that is half electric.",
  intro: [
    "The 2026 rules produced the biggest change to Formula 1 cars in decades. The cars are **shorter, narrower and lighter**: the wheelbase is capped at 3.4 m and the width at 1.9 m. The power unit is now roughly **half combustion, half electric**.",
    "Both wings now move. On the straights the driver opens them into **Straight Mode**, flattening the flaps to shed drag. They snap back to **Corner Mode** for grip under braking. Press **Straight mode** in the toolbar (or **A**) to see them move.",
    "The floor is flatter and the diffuser much larger. Bargeboard-like **floor boards** are back, and the beam wing and wheel \"eyebrows\" are gone. Press **Explode** to take the car apart layer by layer, and click any part to learn what it does.",
  ],
  specs: [
    ["Wheelbase", "≤3,400 mm (2025: 3,600)"],
    ["Width", "1,900 mm (2025: 2,000)"],
    ["Minimum mass", "724 kg + tyres ≈ 768 kg"],
    ["Power unit", "1.6 L V6 turbo ≈400 kW + MGU-K 350 kW"],
    ["Peak power", "≈750 kW (≈1,000 hp), about 50:50"],
    ["Energy recovery", "up to 8.5 MJ per lap"],
    ["Fuel", "100% advanced sustainable fuel"],
    ["Aero", "Active front and rear wings (Corner / Straight Mode)"],
    ["Tyres", "18-inch; front 280 × 705 mm, rear 375 × 710 mm"],
  ],
  camera: { position: [3600, 2000, 4300], target: [0, 350, 0] },
  size: 5400,
  parts: {
    // --- Survival cell ------------------------------------------------------
    chassis: {
      name: "Survival cell",
      category: "chassis",
      summary: "The carbon-fibre tub that holds the driver and the fuel, and carries every other part of the car.",
      details: [
        "Everything on the car is bolted to the survival cell. The front suspension, nose and steering are mounted on it, and the engine is bolted directly to its rear face as a stressed member. The gearbox and rear suspension hang off the back of the engine.",
        "It is also the driver's armour. Before a chassis can race it must pass the FIA's crash, squeeze and penetration tests, which were made tougher for 2026.",
        "The rules fix where it sits. Its front face (the **XA** plane) must be 0–150 mm ahead of the front axle. The rear of the cockpit (**XC**) must be 1,830–2,030 mm behind that, and the engine mounting face at least 360 mm further back still, which leaves the room for the fuel cell.",
      ],
      specs: [
        ["Material", "Carbon-fibre composite with honeycomb core"],
        ["Contains", "Driver, fuel cell, battery"],
        ["Front axle", "0–150 mm behind the cell's front face"],
        ["Cockpit rear", "1,830–2,030 mm behind the front face"],
        ["Engine mounting", "Six M12 studs, ≥360 mm behind the cockpit"],
      ],
    },
    monocoque: {
      name: "Carbon monocoque",
      category: "chassis",
      summary: "A one-piece carbon-fibre tub: stiff, light, and built to stop anything reaching the driver.",
      details: [
        "\"Monocoque\" means the skin itself is the structure, with no frame inside. Layers of carbon-fibre fabric are laid into a mould around an aluminium honeycomb core, then cured under heat and pressure in an autoclave. The result is far stiffer than steel for its weight.",
        "For 2026 the side protection was strengthened again. Four zones of the tub use homologated anti-intrusion laminates: the forward chassis, the cockpit sides, the cockpit floor and the area beside the fuel cell. The FIA says protection beside the fuel cell has more than doubled.",
        "Use **X-ray** to see the fuel cell and battery packed inside.",
      ],
      specs: [
        ["Cockpit side test", "must resist an impact structure pushed in at 380 kN"],
        ["Construction", "Carbon/epoxy skins over aluminium honeycomb"],
        ["Anti-intrusion zones", "4 homologated laminate areas"],
      ],
      howItWorks: [
        "Carbon fibres are extremely strong along their length, so each ply is laid at a chosen angle to carry the loads where they flow.",
        "The honeycomb core spaces two thin skins apart, which multiplies stiffness the way an I-beam does.",
        "Layers of Zylon (an aramid-like fibre) in the sides resist penetration by sharp debris.",
      ],
    },
    nose: {
      name: "Nose (front impact structure)",
      category: "safety",
      summary: "The crushable nose absorbs a frontal impact before it reaches the driver, and in 2026 it does so in two stages.",
      details: [
        "The nose is a hollow carbon cone designed to crush progressively, turning the car's energy into broken fibres instead of deceleration for the driver.",
        "New for 2026 is a **two-stage** structure. In earlier crashes the whole nose could snap off in the first hit, leaving nothing to absorb a second one. Now part of the structure must stay attached after the first impact, so it can still absorb energy if the car hits something again.",
        "Its tip may carry a tiny cooling inlet. A pitot probe on top measures the true airspeed the aerodynamicists compare against their wind tunnel.",
      ],
      specs: [
        ["Test 1", ">17 m/s impact, at least 150 mm left uncrushed"],
        ["Test 2", "side load to failure (>52.5 kN), then a second impact at >14 m/s"],
        ["Peak deceleration", "≤40 g"],
      ],
      didYouKnow:
        "Teams chose very different noses in 2026: wide, high, narrow and low. Some attach to the front wing's middle element instead of the mainplane.",
    },
    halo: {
      name: "Halo",
      category: "safety",
      summary: "A titanium hoop over the cockpit that protects the driver's head from wheels, debris and other cars.",
      details: [
        "Mandatory since 2018, the halo is made of Grade 5 titanium tube and weighs about **7 kg**. Two rear mounts and a central front pillar bolt it to the survival cell, and teams cover it with a thin carbon aero fairing.",
        "It has since been credited with saving several drivers in crashes where a car or a barrier came down across the cockpit.",
      ],
      specs: [
        ["Material", "Grade 5 titanium"],
        ["Mass", "≈7 kg"],
        ["Test load", "≈140 kN, applied both from the side and from above"],
      ],
      didYouKnow: "A 140 kN test load is roughly the weight of 14 tonnes, more than a loaded London bus, resting on a structure the weight of a bowling ball.",
    },
    "roll-structure": {
      name: "Roll structure & airbox",
      category: "safety",
      summary: "The hoop above the driver's head that protects them if the car flips; it is also the engine's air intake.",
      details: [
        "If the car turns over, this structure and the halo keep a survival space around the driver's head. It must reach at least **968 mm** above the reference plane.",
        "For 2026 the test load rose from 141 kN to **172 kN**, enough for a load of about 20 g instead of 16 g. This followed crashes in which roll hoops failed.",
        "The opening at the front is the airbox. It feeds the turbocharger's compressor, and in many cars also an oil or ERS cooler packaged underneath. The T-camera and two side cameras are mounted on it (see **On-board cameras**).",
      ],
      specs: [
        ["Minimum height", "968 mm above the reference plane"],
        ["Test load", "172 kN (2022–25: 141 kN)"],
      ],
    },
    "fuel-cell": {
      name: "Fuel cell",
      category: "power",
      summary: "A puncture-resistant rubber bladder behind the driver, holding the sustainable fuel.",
      details: [
        "The fuel sits in a flexible bag of Kevlar-reinforced rubber, built to the FIA's FT5 standard. It can deform in a crash without splitting. Inside, pumps, baffles and a small collector tank keep fuel at the pickup even under cornering loads of 5 g.",
        "There is no limit on how much fuel a car may carry in a 2026 race. Instead the rules cap the **energy flow** into the engine at 3,000 MJ per hour, so a team carries only what that allowance can burn over a race distance.",
      ],
      specs: [
        ["Standard", "FIA FT5-1999 safety bladder"],
        ["Fuel", "100% advanced sustainable, 38–41 MJ/kg"],
        ["Pressure", "≤1 bar above atmospheric"],
      ],
      didYouKnow: "2026 fuel is fully sustainable. Its carbon comes from waste, non-food biomass or carbon captured from the air, rather than from oil wells.",
    },
    cockpit: {
      name: "Cockpit",
      category: "cockpit",
      summary: "The driver's workspace: a moulded seat, the steering wheel and energy-absorbing padding.",
      details: [
        "The driver lies back with their feet higher than their hips, so the car can be as low as possible. Strapped in and fully kitted, the driver must be able to remove the steering wheel and climb out within **7 seconds**, then refit the wheel within 12 seconds in total.",
        "The driver and seat ballast together must weigh at least **82 kg**. Lighter drivers carry ballast, so a small driver gains no advantage.",
      ],
      specs: [
        ["Driver + seat minimum", "82 kg"],
        ["Exit test", "Out in 7 s; wheel refitted within 12 s"],
        ["Pedals", "No further forward than 315 mm behind XA"],
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
        "The wheel carries the shift paddles, the clutch paddles used at the start, the radio and drink buttons, and rotary switches for brake balance, differential and engine settings. In 2026 it also holds the controls for the new energy system, such as the **Boost** and **Overtake** buttons.",
        "The display shows gear, lap delta, battery charge and warnings. The rows of lights along the top tell the driver when to shift.",
        "A quick-release hub, worked by pulling a collar on the column, lets the driver take the wheel off to get out. The wheel must sit at least 50 mm behind the front edge of the cockpit opening.",
      ],
      specs: [
        ["Controls", "Paddles, buttons and rotary switches"],
        ["Display", "Gear, deltas, energy state, flags"],
        ["Clutch", "Up to two pull-type paddles"],
      ],
    },
    headrest: {
      name: "Headrest & cockpit padding",
      category: "safety",
      summary: "Energy-absorbing foam around the driver's head and shoulders.",
      details: [
        "Three areas of padding, one behind and one each side of the driver's head, are made from a foam that compresses slowly under impact. This limits how fast the head can move in a crash.",
        "They are designed to be the first thing the helmet touches. They lift out as one piece, so marshals can reach the driver.",
      ],
      specs: [
        ["Rear pad", "260–380 mm wide, 75–90 mm thick"],
        ["Removal", "All three areas as a single part"],
      ],
    },
    mirrors: {
      name: "Mirrors",
      category: "cockpit",
      summary: "Rear-view mirrors on stalks at the sidepod shoulders, now with ERS status lights built in.",
      details: [
        "Each glass must be exactly 200 × 50 mm and convex, and is canted 24–28° towards the car so the driver sees past the rear tyre. The body sits on an inner stay to the chassis and a slim rear stay (under 10 mm thick) to the sidepod.",
        "New for 2026, a **lateral safety light** in each mirror body shows the state of the high-voltage system, so marshals know whether the car is safe to touch.",
      ],
      specs: [
        ["Glass", "200 × 50 mm, convex"],
        ["Safety light", "Built into each mirror body"],
      ],
    },
    "side-impact": {
      name: "Side impact structures",
      category: "safety",
      summary: "Crushable carbon tubes in the sidepods that absorb a side impact before it reaches the tub.",
      details: [
        "Two tubes on each side stick out from the survival cell inside the sidepods. In a T-bone crash they crush first, spreading the load and slowing the intrusion.",
        "Their position sets the shape of the sidepod inlets, which is why most cars' inlets sit just above or around them.",
      ],
    },
    pedals: {
      name: "Pedal box",
      category: "cockpit",
      summary: "Brake and throttle pedals in the footwell; F1 drivers brake with the left foot.",
      details: [
        "There is no clutch pedal: the clutch is worked by paddles on the steering wheel. The brake pedal drives two master cylinders, one per circuit. The throttle pedal only moves a sensor, and the FIA standard ECU turns that signal into torque from the engine and the MGU-K.",
        "For safety the rules keep the pedals well back from the front of the chassis: no further forward than 315 mm behind the survival cell's front face.",
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
      summary: "An FIA-homologated extinguisher whose bottle sits inside the survival cell, with nozzles aimed into the cockpit.",
      details: [
        "The system discharges into the cockpit only, with at least one nozzle aimed at the driver's midriff. It has its own battery, so it still works if the car's electrics fail.",
        "Both the driver and marshals can fire it: the external trigger is combined with the circuit-breaker switch on the outside of the car.",
      ],
      specs: [
        ["Standard", "FIA 8876-2022"],
        ["Bottle", "Inside the survival cell"],
      ],
    },
    "cockpit-lights": {
      name: "Cockpit & warning lights",
      category: "safety",
      summary: "Red, blue and yellow track-signal lights in front of the driver, and the impact warning light on top of the tub.",
      details: [
        "The FIA ECU drives three lights placed directly in the driver's line of sight. They repeat flags and track signals: yellow for danger, blue for a faster car behind, red for a stopped session.",
        "Recessed into the top of the survival cell is the **impact warning light**, wired to the accident data recorder. After a crash it shows rescue crews at a glance how violent the impact was.",
      ],
    },
    cameras: {
      name: "On-board cameras",
      category: "electronics",
      summary: "The TV cameras every car must carry, in positions the FIA fixes.",
      details: [
        "Position 1 faces the driver from the top of the chassis. The nose carries position 2 pods: a working camera on the left, a matching dummy housing on the right. Two cameras sit on the sides of the airbox (position 3), with the **T-camera** on top of the roll hoop (position 4). The 360° camera sits on the forward chassis (position 5). The cameras in positions 4 and 5 are mandatory.",
        "Housings used instead of cameras must match a real camera's size, shape and mass, so the choice never changes the car's balance. The T-camera's colour (black or fluorescent yellow) tells viewers which of a team's two cars they are watching.",
      ],
      specs: [
        ["Positions", "Six, set by Article C8.16"],
        ["Mandatory", "Cameras in positions 4 and 5"],
      ],
    },

    // --- Front wing ---------------------------------------------------------
    "front-wing": {
      name: "Active front wing",
      category: "aero",
      summary: "Three elements across 1.35 m that grip the front of the car in corners, and flatten on the straights.",
      details: [
        "The front wing makes downforce over the front tyres and shapes the air for the rest of the car, steering it around the front wheels and toward the floor. The 2026 wing is about **100 mm narrower** and allowed at most three elements (four in 2022–25).",
        "Everything behind the mainplane is the **primary flap**. Commanded by the FIA standard ECU, it rotates about its leading edge into Straight Mode. Toggle **Straight mode** to watch it move.",
      ],
      specs: [
        ["Elements", "Up to 3 (2022–25: 4)"],
        ["Profile span", "1,350 mm (±675 mm)"],
        ["Position", "475–1,250 mm ahead of the front axle"],
        ["Height", "60–300 mm above the reference plane"],
      ],
    },
    "fw-mainplane": {
      name: "Front mainplane",
      category: "aero",
      summary: "The fixed, lowest element of the front wing, which the nose sits on.",
      details: [
        "Running close to the ground, the mainplane benefits from **ground effect**: the air speeds up in the narrow gap under it, lowering the pressure and pulling the wing down harder than it would in free air.",
        "It never moves, so the front of the car keeps a baseline of grip even in Straight Mode.",
        "Two pylons, each no more than 35 mm thick, carry the nose down onto it. Optional strakes underneath help steer the flow outward around the front tyres.",
      ],
    },
    "fw-flaps": {
      name: "Front flaps (primary flap)",
      category: "aero",
      summary: "The upper elements that pivot together: steep in Corner Mode, flatter in Straight Mode.",
      details: [
        "Each flap sits behind and above the element in front, with a 5–15 mm slot between them. Fast air from the slot stops the flow from separating off the flap, which lets the stack run steep angles without stalling.",
        "In Straight Mode the flaps rotate to a smaller angle of attack. The rules allow only two positions, a fixed reduction in incidence, and require the switch to take **under 400 ms**. Physical stops limit the travel, and any fault must return the wing to Corner Mode.",
      ],
      specs: [
        ["Pivot", "About the flap's leading edge"],
        ["Positions", "Two: Corner and Straight Mode"],
        ["Change time", "≤400 ms"],
        ["Slot gaps", "5–15 mm"],
      ],
      howItWorks: [
        "In an activation zone the driver presses the button, the FIA ECU commands the actuators, and the flaps rotate flatter. Drag and downforce both drop.",
        "Braking or lifting off closes them again, and in some places they close automatically before a corner.",
        "In low-grip conditions only the front wing may open (the rear stays closed), keeping the car stable.",
      ],
    },
    "fw-endplates": {
      name: "Front endplates & footplates",
      category: "aero",
      summary: "Vertical plates at the wing tips that seal the wing and steer air around the front tyres.",
      details: [
        "An open wing tip lets high-pressure air spill round into the low-pressure side, wasting downforce and creating a tip vortex. The endplate limits that spillage, and its shape and the footplate at its base send air outward past the front tyre.",
        "The tyre's turbulent wake is the biggest enemy of the floor behind it, so controlling it matters.",
      ],
      specs: [
        ["Endplate zone", "575–680 mm from the centreline, ≥10 mm thick"],
        ["Footplates", "Inboard, and outboard out to 900 mm"],
        ["Dive plane", "Optional, within 300 × 325 × 50 mm"],
      ],
    },
    "fw-actuator": {
      name: "Front wing actuator",
      category: "aero",
      summary: "The hydraulic actuator that rotates the front flaps between modes.",
      details: [
        "Up to two actuators may move the front flaps. They are controlled by the FIA's standard ECU, not by the team, and only work in permitted zones or when the car is stationary.",
        "Packaging them inside the nose and wing keeps the linkages out of the airflow.",
      ],
    },

    // --- Power unit ---------------------------------------------------------
    "power-unit": {
      name: "Power unit",
      category: "power",
      summary: "A 1.6-litre turbocharged V6 working with a 350 kW electric motor: about 750 kW in total.",
      details: [
        "F1 calls it a power unit because the engine is only half the story. In 2026 the combustion engine was cut to about **400 kW**, the MGU-K electric motor was nearly tripled to **350 kW**, and the complex MGU-H (a generator on the turbo shaft) was deleted.",
        "Power is now split roughly 50:50 between fuel and electricity. Since the battery can only hold a few megajoules, drivers have to recharge it constantly through braking and lifting off. How well a car harvests and deploys energy matters as much as raw horsepower.",
      ],
      specs: [
        ["ICE", "1.6 L, 90° V6, single turbo"],
        ["Combustion power", "≈400 kW (2025: ≈550 kW)"],
        ["Electric power", "350 kW MGU-K (2025: 120 kW)"],
        ["Minimum mass", "185 kg"],
        ["Manufacturers", "Mercedes, Ferrari, Honda, Red Bull Ford, Audi"],
      ],
      didYouKnow:
        "Audi joined F1 as a works team in 2026, and Ford returned as Red Bull's partner. Honda supplies Aston Martin exclusively.",
    },
    ice: {
      name: "V6 engine (ICE)",
      category: "power",
      summary: "The internal combustion engine: six cylinders in a 90° vee, with the fuel supply metered by energy rather than mass.",
      details: [
        "Each cylinder has an 80 mm bore and the total displacement is 1.6 litres. Fuel is injected directly into the cylinders at very high pressure. Very lean combustion and pre-chamber ignition make these some of the most efficient combustion engines ever built, turning close to half the fuel's energy into work.",
        "Instead of a fuel mass flow, 2026 rules cap the **energy** in the fuel at 3,000 MJ per hour above 10,500 rpm. Since sustainable fuels vary in energy content, this keeps the limit fair. The compression ratio limit falls from 18:1 to **16:1**, checked both cold and at 130 °C after a 2026 loophole row.",
      ],
      specs: [
        ["Layout", "90° V6, 80 mm bore, 101 mm bore spacing"],
        ["Crankshaft", "On the centre line, 90 mm above the reference plane"],
        ["Displacement", "1,600 cc"],
        ["Fuel energy flow", "≤3,000 MJ/h (≈75 kg/h of fuel)"],
        ["Compression ratio", "≤16.0:1"],
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
      summary: "An exhaust-driven turbine spinning a compressor at up to 150,000 rpm, without the MGU-H for 2026.",
      details: [
        "Hot exhaust spins the turbine wheel. A shaft drives the compressor on the other side, squeezing intake air to several times atmospheric pressure.",
        "From 2014 to 2025 an MGU-H generator sat on this shaft. It recovered energy and spun the turbo up instantly to kill lag. It was deleted for 2026 because it was costly and hard to master, which was a barrier to new manufacturers. Without it, turbo lag is back as an engineering challenge, and the MGU-K helps fill the gap.",
      ],
      specs: [
        ["Type", "Single-stage turbocharger"],
        ["Max speed", "150,000 rpm"],
        ["Minimum mass", "12 kg"],
        ["MGU-H", "Removed for 2026"],
      ],
    },
    exhaust: {
      name: "Exhaust system",
      category: "power",
      summary: "Inconel pipes that gather the six cylinders' exhaust into the turbine, then out of a single tailpipe.",
      details: [
        "The primaries are made of Inconel, a nickel superalloy that keeps its strength at around 900 °C. Their lengths are tuned so the pulses from each cylinder arrive at the turbine evenly. The heat turns the metal straw-gold and blue.",
        "The wastegate vents excess gas around the turbine to control boost. In 2026 its pipe must rejoin the main exhaust, because only **one tailpipe** may leave the car. That tailpipe runs straight along the centre line for its last 370 mm and exits 390–400 mm behind the rear axle, above the crash structure.",
      ],
      specs: [
        ["Material", "Inconel nickel superalloy"],
        ["Tailpipe", "One, 90–130 mm bore, exit 390–400 mm behind the rear axle"],
        ["Exit height", "Above 350 mm from the reference plane"],
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
      summary: "Motor-generator, battery and electronics: the half of the power unit that runs on recovered energy.",
      details: [
        "Under braking the MGU-K works as a generator and charges the battery. On the throttle it drives the wheels with up to 350 kW. The rules allow up to **8.5 MJ** to be recovered per lap, more than four times the 2025 allowance, though the FIA can lower it at some tracks.",
        "Electric power tapers away at high speed. Without Overtake it gives full power up to about 290 km/h and none above 345 km/h. Drivers also use a **Boost** button, and the **Overtake** mode replaced DRS: a car within one second of the car ahead at the detection point gets an extra 0.5 MJ and a power curve that holds 350 kW to higher speeds.",
      ],
      specs: [
        ["Harvest per lap", "≤8.5 MJ (+0.5 MJ with Overtake)"],
        ["Deployment", "≤350 kW, tapering at high speed"],
      ],
    },
    "mgu-k": {
      name: "MGU-K",
      category: "hybrid",
      summary: "Motor Generator Unit – Kinetic: a 350 kW electric machine geared to the crankshaft.",
      details: [
        "A permanent-magnet motor no bigger than a large coffee tin delivers 350 kW, almost as much as the combustion engine. Run in reverse as a generator, it harvests energy every time the driver brakes or lifts off.",
        "It may not be used to launch the car: at a standing start it can only help above 50 km/h, which keeps starts in the drivers' hands.",
      ],
      specs: [
        ["Power", "≤350 kW (2025: 120 kW)"],
        ["Torque", "≤500 Nm"],
        ["Mass", "≥16–20 kg"],
      ],
    },
    "energy-store": {
      name: "Energy store (battery)",
      category: "hybrid",
      summary: "The lithium-ion battery under the fuel cell, cycled through a 4 MJ window over and over each lap.",
      details: [
        "The cells sit in a crash-proof case inside the survival cell, the safest place on the car. The difference between its highest and lowest charge may not exceed **4 MJ**, a little over a kilowatt-hour. That is tiny compared with 8.5 MJ harvested per lap, so the battery is constantly charged and drained.",
        "Its cooling system is critical: pushing 350 kW in and out generates a lot of heat.",
      ],
      specs: [
        ["Usable window", "≤4 MJ (≈1.1 kWh)"],
        ["Minimum mass", "35 kg"],
        ["Location", "Inside the survival cell, below the fuel"],
      ],
    },
    "control-electronics": {
      name: "Control electronics",
      category: "hybrid",
      summary: "The inverters and converters that manage energy between battery and MGU-K.",
      details: [
        "The battery stores direct current, but the motor needs precisely timed alternating current. The control electronics switch hundreds of amps thousands of times a second to make the conversion.",
        "The FIA's standard ECU oversees the whole system, the same unit that commands the active wings and the gearbox.",
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
      summary: "The single control unit, identical for every team, that runs the power unit, gearbox, brakes and active wings.",
      details: [
        "The ECU decides how much torque the engine and MGU-K deliver for a given throttle position. It also runs the seamless gearshifts and the rear brake-by-wire. It is the only device allowed to move the wings into Straight Mode, and only inside an activation zone.",
        "It also drives the cockpit signal lights and logs hundreds of sensor channels. The FIA checks its software, which is why driver aids like traction control can't be hidden in it.",
      ],
    },
    adr: {
      name: "Accident data recorder",
      category: "electronics",
      summary: "The FIA's black box, bolted to the floor of the survival cell, that records every impact.",
      details: [
        "Accelerometers near the car's centre of gravity record the forces of any crash. The FIA uses the data, with the high-speed camera aimed at the driver, to keep improving safety.",
        "Four extra holes are allowed in the plank just to reach the bolts that secure it.",
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
        "Teams build the car below the 724 kg-plus-tyres limit on purpose, then add ballast where it helps most: as low as possible, and placed to tune the front-to-rear weight split. It must be fixed so that tools are needed to remove it, and it can be sealed by the scrutineers.",
      ],
      specs: [
        ["Minimum mass", "724 kg + tyres (726 kg + tyres in qualifying)"],
        ["Weight split", "Front ≥44%, rear ≥54% of the minimum"],
      ],
    },

    // --- Cooling ------------------------------------------------------------
    cooling: {
      name: "Cooling system",
      category: "cooling",
      summary: "Radiators and coolers that reject the heat of the engine, the turbo air and the electrics.",
      details: [
        "Roughly as much energy leaves the power unit as heat as is delivered as power. Coolant, oil, compressed intake air and the ERS all need their own cooling.",
        "Bigger radiators mean bigger sidepods and more drag, so teams trade cooling against speed. Many run different bodywork at hot races.",
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
        "For 2026 the whole driveline is homologated, which freezes the design for the four-year cycle with one upgrade allowed.",
      ],
    },
    gearbox: {
      name: "Gearbox casing",
      category: "drivetrain",
      summary: "A carbon-and-titanium casing that houses the gears and carries the rear suspension.",
      details: [
        "The casing has to be stiff, because any flex would let the rear suspension move. It also has to be slim, so air can flow past it into the diffuser.",
        "Use **X-ray** or explode the car to see the gear cluster inside.",
      ],
    },
    "gear-cluster": {
      name: "Gear cluster",
      category: "drivetrain",
      summary: "Eight forward gears and a reverse, shifted in milliseconds by a seamless-shift system.",
      details: [
        "A **seamless-shift** gearbox engages the next gear before releasing the current one, so there is almost no break in drive. A full upshift takes a few milliseconds, controlled hydraulically and electronically.",
        "Each gear pair must be steel, at least 12 mm wide and 600 g. These limits stop teams making ever thinner, more exotic gears. In 2026 only, teams may change their ratios once during the season.",
      ],
      specs: [
        ["Forward gears", "8, plus reverse"],
        ["Gear pairs", "Steel, ≥12 mm wide, ≥600 g"],
      ],
    },
    clutch: {
      name: "Clutch",
      category: "drivetrain",
      summary: "A small multi-plate carbon clutch in the bellhousing, used mainly for starts and pit stops.",
      details: [
        "Carbon plates barely larger than a hand handle hundreds of kilowatts. The driver works the clutch only with pull-type paddles on the steering wheel. Once moving, the seamless gearbox shifts without opening it.",
        "In a crash or a spin the FIA-mandated clutch disengagement system opens the clutch automatically, so the engine does not stall.",
      ],
    },
    differential: {
      name: "Differential",
      category: "drivetrain",
      summary: "Lets the rear wheels turn at different speeds in corners while sharing the drive between them.",
      details: [
        "In a corner the outside wheel travels further than the inside one. An open differential would let the lightly loaded inside wheel spin away the power, so F1 cars use a hydraulically controlled limited-slip differential. The driver adjusts it from the steering wheel for entry, mid-corner and exit.",
        "Its axis must sit within ±60 mm of the rear axle line and 260–280 mm above the reference plane.",
      ],
    },
    driveshafts: {
      name: "Driveshafts",
      category: "drivetrain",
      summary: "Shafts with constant-velocity joints that carry the torque to the rear wheels.",
      details: [
        "The joints at each end let the shaft keep turning smoothly as the suspension moves. Each shaft carries well over 1,000 Nm when the MGU-K and engine are both at full power in low gears.",
      ],
    },
    "rear-impact": {
      name: "Rear impact structure",
      category: "safety",
      summary: "A tapered carbon box behind the gearbox that crushes to absorb a rear impact.",
      details: [
        "Like the nose, the structure is designed to crush progressively. It also carries the rain light and the jacking point.",
        "It is tethered to the car so it cannot fly off after a crash. It may also carry the optional rear-facing camera (position 6).",
      ],
      specs: [
        ["Rear face", "750 mm behind the final-drive axis"],
        ["Top", "372.5 mm above the reference plane"],
      ],
    },
    "rain-light": {
      name: "Rain light",
      category: "safety",
      summary: "A bright red LED light that makes the car visible in spray and when harvesting energy.",
      details: [
        "The light is on in wet conditions so following drivers can see the car through the spray. It also flashes when the car is harvesting heavily and may slow unexpectedly. The rear wing endplates carry two more LED lights.",
      ],
      specs: [["Height", "295–305 mm above the reference plane"]],
    },

    // --- Rear wing ----------------------------------------------------------
    "rear-wing": {
      name: "Active rear wing",
      category: "aero",
      summary: "A two-element wing at the back whose flap opens on the straights; with no beam wing below it any more.",
      details: [
        "The rear wing makes downforce for the rear axle. In 2026 the flap opens in **every** designated Straight Mode zone, for every driver, on every lap, unlike DRS, which only helped a car within a second of the one ahead. Overtaking help now comes from the energy system instead.",
        "The 2022–25 beam wing is gone, so there is open space under the main wing. Only a slim brace crosses it.",
      ],
      specs: [
        ["Elements", "Up to 3"],
        ["Span", "1,150 mm"],
        ["Height", "725–880 mm above the reference plane"],
        ["Beam wing", "Removed"],
      ],
    },
    "rw-mainplane": {
      name: "Rear mainplane",
      category: "aero",
      summary: "The fixed lower element of the rear wing.",
      details: [
        "The mainplane makes most of the wing's downforce and stays put in both modes. Its centre dips lower than its tips (725 mm versus 785 mm above the reference plane), which helps the wing work with the diffuser below it.",
      ],
    },
    "rw-flap": {
      name: "Rear flap",
      category: "aero",
      summary: "The upper element, which rotates flat in Straight Mode to cut drag.",
      details: [
        "The flap pivots about an axis between its mid-chord and trailing edge, and a single actuator drives it. When it rotates flat, the slot between flap and mainplane opens wide and the wing stops making much downforce or drag. The tips outboard of 535 mm stay fixed.",
        "Teams found different mechanisms. Ferrari's SF-26 famously flips its flap over, while others fold the trailing edge down.",
      ],
      specs: [
        ["Pivot", "Between mid-chord and trailing edge"],
        ["Change time", "≤400 ms"],
        ["Failure mode", "Returns to Corner Mode"],
      ],
    },
    "rw-separators": {
      name: "Separators & rotation brackets",
      category: "aero",
      summary: "Small blocks that hold the flap's slot gap, and the brackets that carry its pivot.",
      details: [
        "Three to five pairs of separators must bridge the mainplane and the flap, so the 8–12 mm slot gap between them stays fixed under load. They also stop teams exploiting flex to cheat the gap.",
        "Up to three rotation brackets carry the flap's pivot: one on the centre line, others outboard where they also hold the fixed flap tips.",
      ],
      specs: [
        ["Separators", "3–5 pairs (mandatory)"],
        ["Slot gap", "8–12 mm"],
      ],
    },
    "rw-endplates": {
      name: "Rear endplates & lights",
      category: "aero",
      summary: "Simplified endplates that carry the car number and two FIA LED lights.",
      details: [
        "The endplates tidy the wing-tip vortices, which are a big source of drag. The 2026 design is deliberately simple, with no lower section.",
        "Built-in LED strips 700–870 mm up work with the central rain light to warn following cars.",
      ],
    },
    "rw-pylon": {
      name: "Rear wing pylon",
      category: "aero",
      summary: "A single slender central support, no more than 25 mm thick, that wraps around the exhaust.",
      details: [
        "The pylon carries the wing's load, several hundred kilograms at high speed, down into the crash structure and gearbox. Keeping it thin limits its disturbance to the airflow under the wing.",
        "The small symmetric brace that replaced the beam wing crosses it.",
      ],
    },
    "rw-actuator": {
      name: "Rear wing actuator",
      category: "aero",
      summary: "The hydraulic actuator, commanded by the FIA ECU, that opens and closes the flap.",
      details: [
        "A single actuator drives the flap through a linkage. It only works when the car is stationary or fully inside an activation zone. Physical stops fix the two positions, and any failure must return the wing to Corner Mode.",
      ],
    },

    // --- Bodywork -----------------------------------------------------------
    bodywork: {
      name: "Bodywork",
      category: "aero",
      summary: "The engine cover and sidepods: removable shells that shape the air over the car and into the coolers.",
      details: [
        "The bodywork does three jobs: it encloses the power unit, feeds air to the radiators, and guides the flow toward the floor and rear wing.",
        "Use **X-ray** to see through it to the engine and coolers.",
      ],
    },
    "engine-cover": {
      name: "Engine cover",
      category: "aero",
      summary: "The tapering cover over the power unit, with a small shark fin returned for 2026.",
      details: [
        "The cover is shrink-wrapped as tightly as possible around the engine and coolers, narrowing into the **coke bottle** shape at the back. This speeds the air toward the rear of the car.",
        "A limited shark fin is allowed again. It cleans up the airflow to the rear wing when the car is yawed in a corner.",
      ],
    },
    sidepods: {
      name: "Sidepods",
      category: "aero",
      summary: "The pods either side of the driver that house the radiators, with an undercut that feeds air to the back of the floor.",
      details: [
        "The inlets swallow air for the radiators, and the outside shape decides how the rest flows past. A deep **undercut** below the inlet lets air reach the floor edge and diffuser. The top surface then ramps down toward the rear (\"downwash\").",
        "The 2026 grid split into very different styles, from wide-topped pods with long undercuts to thin \"tube\" pods that leave floor exposed.",
      ],
    },

    // --- Floor --------------------------------------------------------------
    floor: {
      name: "Floor",
      category: "aero",
      summary: "The flat underside and diffuser that produce much of the car's downforce by accelerating air beneath it.",
      details: [
        "Air rushing through the narrow gap under the car speeds up and its pressure drops, sucking the car toward the track. This downforce costs little drag.",
        "For 2026 the deep venturi tunnels of 2022–25 were mostly removed: the floor is flatter, with a much larger diffuser at the back. Cars run higher, so they are less sensitive to bumps and to running close behind another car. The FIA's simulations predicted about **30% less downforce and 55% less drag** than 2025.",
      ],
      specs: [
        ["Width", "±770 mm, narrowing to ±700 then ±365 at the rear wheels"],
        ["Centreline ceiling", "≤75 mm above the reference plane"],
        ["Following car", "keeps ≈80% of its downforce at 10 m"],
      ],
    },
    "floor-body": {
      name: "Floor body",
      category: "aero",
      summary: "The main carbon floor plate, with fences under its leading edge and a curled outer edge.",
      details: [
        "At the front the floor rises into two inlets. A single fence under each, within a 450 × 40 × 200 mm box, splits the incoming air and sets up a vortex. This \"seals\" the floor edge so air from the side cannot leak in and spoil the low pressure underneath.",
        "The curled floor sidewall runs along the edges, and a **floor corner** vane in front of each rear tyre helps manage the tyre's wake as it squashes and spins.",
      ],
    },
    "floor-boards": {
      name: "Floor boards",
      category: "aero",
      summary: "Bargeboard-like vanes ahead of the sidepods, back in F1 for 2026.",
      details: [
        "The turbulent wake of the front tyres is the floor's worst enemy. The boards, up to three sections, catch that wake and turn it **inward**: behind 825 mm from the front axle they must be angled inward by at least 15°.",
        "The FIA intended this \"in-wash\" to keep the dirty air from being thrown at the car behind. The 2026 rules limit the boards to a box 710–890 mm from the centreline.",
      ],
      specs: [
        ["Zone", "650–1,350 mm behind the front axle, 710–890 mm out"],
        ["Sections", "Up to 3, plus up to 8 hangers"],
      ],
    },
    "floor-front": {
      name: "Floor bib & leading-edge device",
      category: "aero",
      summary: "The bib under the forward chassis and the slim vanes across the floor inlets.",
      details: [
        "The bib, a splitter-like plate under the forward chassis between the front wheels, is the first part of the floor to meet the air. Ahead of each inlet a **leading-edge device** of up to five slender sections starts conditioning the flow before it goes under the car.",
      ],
    },
    "floor-stays": {
      name: "Floor brace & stays",
      category: "aero",
      summary: "The tube and wires that stop the floor's edges and boards flexing at speed.",
      details: [
        "A single 40 mm floor board brace runs from the forward chassis to the boards. A floor foot stay and slender floor body stays (no more than 5 mm thick, and allowed to work only in tension) hold the floor edge. Without them the edges would bend under load and change the car's downforce, which the FIA's deflection tests check.",
      ],
    },
    "floor-winglets": {
      name: "Floor winglets",
      category: "aero",
      summary: "A mandatory small wing outboard of each diffuser wall, beside the rear wheels.",
      details: [
        "Its shape and position are tightly prescribed by the FIA. Teams may only tilt it ±5° about a set axis and move it ±10 mm, so it works much the same way on every car. It helps pull the rear tyres' wake away from the diffuser.",
      ],
    },
    diffuser: {
      name: "Diffuser",
      category: "aero",
      summary: "The rising tail of the floor that slows the air again, and much larger in 2026.",
      details: [
        "Air under the floor has to return to normal speed and pressure before it leaves the car. The diffuser's expanding shape does this gradually, which lets the air under the floor run faster in the first place.",
        "In 2026 the ramp starts 600 mm ahead of the rear axle. It rises to 175 mm above the reference plane at 350 mm ahead of the axle, and to 250 mm at 300 mm behind it.",
      ],
      specs: [["Exit height", "250 mm above the reference plane"]],
    },
    plank: {
      name: "Plank & skids",
      category: "chassis",
      summary: "A 10 mm skid board under the floor that stops teams running the car dangerously low.",
      details: [
        "Running lower makes more downforce, so teams are tempted to scrape the floor along the track. The plank polices that. It must be at least **8 mm thick** after the race (from 10 mm new), and a worn plank means disqualification.",
        "Titanium skids set into its holes take the worst of the contact. They are what throw the sparks you see at night races.",
      ],
      specs: [
        ["Thickness", "10 ±0.2 mm new, ≥8 mm worn"],
        ["Width", "≤250 mm, narrowing to 150 front, 100 rear"],
        ["Holes", "3 × 34 mm: 500 mm behind the front axle, under the cockpit, under the back of the engine"],
        ["Skids", "Titanium or steel; mandatory at the front hole"],
      ],
    },

    // --- Suspension ---------------------------------------------------------
    "front-suspension": {
      name: "Front suspension",
      category: "suspension",
      summary: "Wishbones, push-rods and steering that hold the front wheels at precisely controlled angles.",
      details: [
        "Each wheel is located by six members: two wishbones (four legs), a push-rod, and a track rod for steering. The rules ban powered, interconnected and hydraulically linked suspension, as well as inerters and mass dampers.",
        "This car uses **push-rods**, the most common 2026 layout (Mercedes, Red Bull, Ferrari, Racing Bulls and Haas). Alpine and Cadillac chose pull-rods.",
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
        "A 2026 rule limits how much the car's ride height may change when the wheels are steered: ≤2 mm over ±12°.",
      ],
    },
    "fs-inboard": {
      name: "Front springs & dampers",
      category: "suspension",
      summary: "Rockers, torsion bars and dampers packed into the top of the nose.",
      details: [
        "Instead of coil springs, F1 cars use **torsion bars**, steel bars that twist as the rocker turns. They give very precise rates in little space. A heave element between the two sides controls the car's pitch and ride height, which is critical for keeping the floor working.",
      ],
    },
    "rear-suspension": {
      name: "Rear suspension",
      category: "suspension",
      summary: "Wishbones, push-rods and toe links mounted on the gearbox casing.",
      details: [
        "The rear suspension carries the driven wheels, so it has to cope with traction and the driveshafts passing through it. Its geometry controls how the car squats under acceleration and how the rear tyres meet the road.",
      ],
    },
    "rs-wishbones": {
      name: "Rear wishbones",
      category: "suspension",
      summary: "Carbon arms that locate the rear uprights on the gearbox.",
      details: [
        "Their shapes and angles are tuned for the aerodynamics around the diffuser as much as for mechanics. Some 2026 designs mount the upper wishbone high into the wing pylon area.",
      ],
    },
    "rs-pushrods": {
      name: "Rear push-rods",
      category: "suspension",
      summary: "Carry the rear wheel loads to rockers on top of the gearbox.",
      details: [
        "Ferrari switched to a push-rod rear for 2026, joining most of the grid. The choice between push and pull-rod comes down to where the springs and dampers fit best, and what each layout does to the airflow.",
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
      summary: "The rear rockers, torsion bars and heave damper on top of the gearbox.",
      details: [
        "As at the front, torsion bars provide the springing and dampers control the motion. With the floor so sensitive to ride height, the heave stiffness is one of the most important setup choices.",
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
      details: ["The rear tyres are wider because they put down up to 750 kW, and their wear and temperature often decide a race."],
    },
    "front-tyres": {
      name: "Front tyres",
      category: "wheels",
      summary: "Slick 18-inch tyres, 25 mm narrower than in 2025, to suit the lighter car.",
      details: [
        "Without tread, a slick puts the most rubber possible on the track. The rubber works best in a narrow temperature window, roughly 90–110 °C, which is why drivers weave behind the safety car to warm their tyres.",
        "The coloured band shows the compound: red for soft, yellow for medium, white for hard.",
      ],
      specs: [
        ["Size", "280 mm wide × 705 mm diameter (2025: 305 × 720)"],
        ["Rim", "18-inch magnesium"],
      ],
    },
    "rear-tyres": {
      name: "Rear tyres",
      category: "wheels",
      summary: "Wide slicks that carry the drive, 30 mm narrower than in 2025.",
      details: [
        "The rear tyres take traction and much of the braking load, and the rules control the cars around them, from the floor to the winglet in front of each one.",
      ],
      specs: [["Size", "375 mm wide × 710 mm diameter (2025: 405 × 720)"]],
    },
    "front-rims": {
      name: "Front wheels",
      category: "wheels",
      summary: "Forged magnesium 18-inch rims with a mandatory outer cover disc and a single centre-lock nut.",
      details: [
        "The wheels come from a single supplier, and each is fixed by one central nut so a pit crew can change all four in about two seconds.",
        "A composite **outboard disc** must cover each wheel's outer face. Teams can no longer use the spokes to pump brake air outward for aerodynamic gain.",
      ],
      specs: [
        ["Material", "Forged magnesium alloy"],
        ["Covers", "Mandatory outboard disc"],
      ],
    },
    "rear-rims": {
      name: "Rear wheels",
      category: "wheels",
      summary: "Wider 18-inch magnesium rims for the rear tyres.",
      details: [
        "Like the fronts, they carry a cover disc and a single centre-lock nut. Three high-strength tethers per wheel attach the wheel assembly to the chassis, so a wheel cannot fly free in a crash.",
      ],
      specs: [["Tethers", "3 per wheel, each ≥3 kJ"]],
    },
    "front-brakes": {
      name: "Front brakes",
      category: "wheels",
      summary: "Carbon-carbon discs gripped by aluminium calipers, slowing the car at more than 5 g.",
      details: [
        "Carbon-carbon discs run at 400–1,000 °C and get stronger, not weaker, as they heat up. More than a thousand small radial holes pump air through each disc to control its temperature.",
        "For 2026 the disc limits widened, to 325–345 mm diameter at the front and up to 34 mm thick. Calipers may now have up to eight pistons.",
      ],
      specs: [
        ["Disc", "325–345 mm diameter, ≤34 mm thick"],
        ["Caliper", "Aluminium, up to 8 pistons"],
        ["Working temperature", "≈400–1,000 °C"],
      ],
    },
    "rear-brakes": {
      name: "Rear brakes",
      category: "wheels",
      summary: "Smaller rear discs, blended electronically with the MGU-K's regenerative braking.",
      details: [
        "At the rear, the MGU-K does much of the braking by generating electricity. A **brake-by-wire** system blends it with the hydraulic brakes so the pedal feels consistent.",
        "For 2026 the hydraulic rear brakes alone must still deliver at least 2,500 Nm per wheel, in case the ERS cannot.",
      ],
      specs: [
        ["Disc", "260–280 mm diameter"],
        ["Control", "Brake-by-wire"],
      ],
    },
    "front-ducts": {
      name: "Front brake ducts",
      category: "cooling",
      summary: "Carbon scoops and drums that feed cooling air to the brakes and help manage tyre temperature.",
      details: [
        "The inlet scoop picks up air on the inside of the wheel. The drum around the disc channels it through the disc's holes and out. The 2026 rules prescribe the shape of the deflector at the rear of the front drums.",
        "Ducts are also a tyre temperature control: heat from the brakes soaks into the wheel rim and the tyre.",
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
