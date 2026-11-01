import type { CarInfo } from "../types";

/**
 * The 2022–2025 car. Figures come from the FIA Formula 1 Technical
 * Regulations of those years (2025 Issue 3 unless noted); the model is a
 * generic car built to those rules, not any one team's design.
 */
export const car2022: CarInfo = {
  id: "2022",
  name: "Ground effect",
  shortName: "2022",
  years: "2022–2025",
  model: "Generic 2022–2025-regulation car, to the 2025 rules (not any one team's design)",
  tagline: "Venturi tunnels under the floor, built so cars could follow each other.",
  intro: [
    "The 2022 rules brought back **ground effect**, banned since 1983. These cars make most of their downforce under the floor: two **venturi tunnels** speed up the air beneath the car, and the low pressure they create sucks it toward the track.",
    "The aim was closer racing. Earlier cars threw a turbulent wake that robbed a following car of almost half its downforce. The 2022 shapes throw the wake up and over the car behind instead. The price was **porpoising**, a violent bouncing at speed that forced changes to the floor for 2023.",
    "The rear wing keeps **DRS**: within a second of the car ahead, the driver may open its flap on the straights. Press **DRS** in the toolbar (or **A**) to see it. Press **Explode** to take the car apart layer by layer, and click any part to learn what it does.",
  ],
  specs: [
    ["Wheelbase", "≤3,600 mm"],
    ["Width", "2,000 mm"],
    ["Minimum mass", "798 kg without fuel (2025: 800 kg)"],
    ["Power unit", "1.6 L V6 turbo + MGU-K 120 kW + MGU-H"],
    ["Peak power", "≈750 kW (≈1,000 hp)"],
    ["Energy recovery", "MGU-K 2 MJ per lap; MGU-H unlimited"],
    ["Fuel", "E10, flow ≤100 kg/h"],
    ["Aero", "Venturi floor, beam wing, DRS rear wing"],
    ["Tyres", "18-inch Pirelli: 305/720 front, 405/720 rear"],
  ],
  camera: { position: [3700, 2050, 4400], target: [0, 350, 0] },
  size: 5700,
  parts: {
    // --- Survival cell ------------------------------------------------------
    chassis: {
      name: "Survival cell",
      category: "chassis",
      summary: "The carbon-fibre tub that holds the driver and the fuel, and carries every other part of the car.",
      details: [
        "Everything on the car is bolted to the survival cell. The front suspension, nose and steering are mounted on it, and the engine is bolted directly to its rear face as a stressed member. The gearbox and rear suspension hang off the back of the engine.",
        "It is also the driver's armour. Before a chassis can race it must pass the FIA's crash, squeeze and penetration tests, several of them made tougher for 2022.",
        "The rules fix where it sits. Its front face (the **XA** plane) may be no more than 100 mm ahead of the front axle. The rear of the cockpit (**XC**) must be at least 1,830 mm behind that, and the engine bolts to the cell's rear face on six studs set out by the rules.",
        "These are the longest and heaviest Formula 1 cars ever raced. The 2022 rules capped the wheelbase at 3.6 m for the first time, and the minimum mass jumped from 752 kg in 2021 to 798 kg.",
      ],
      specs: [
        ["Material", "Carbon-fibre composite with honeycomb core"],
        ["Contains", "Driver, fuel cell, battery"],
        ["Front axle", "≤100 mm behind the cell's front face"],
        ["Cockpit rear", "≥1,830 mm behind the front face"],
        ["Engine mounting", "Six M12 studs"],
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
      specs: [
        ["Construction", "Carbon/epoxy skins over aluminium honeycomb"],
        ["Side panels", "Zylon, up to 6.2 mm thick"],
      ],
      howItWorks: [
        "Carbon fibres are extremely strong along their length, so each ply is laid at a chosen angle to carry the loads where they flow.",
        "The honeycomb core spaces two thin skins apart, which multiplies stiffness the way an I-beam does.",
        "Zylon layers in the sides resist penetration by sharp debris.",
      ],
    },
    nose: {
      name: "Nose (front impact structure)",
      category: "safety",
      summary: "The crushable nose absorbs a frontal impact before it reaches the driver.",
      details: [
        "The nose is a hollow carbon cone designed to crush progressively, turning the car's energy into broken fibres instead of deceleration for the driver.",
        "For 2022 the frontal crash test moved to a 900 kg trolley at 17 m/s, which means absorbing **48% more energy** than before, to suit the much heavier cars.",
        "Its tip must reach at least 1,150 mm ahead of the front axle. Teams split on how to mount it: some noses sit on the front wing's mainplane, others stop just above it, leaving the mainplane to run unbroken underneath.",
      ],
      specs: [
        ["Frontal test", "900 kg at ≥17 m/s (+48% energy over 2021)"],
        ["Tip", "≥1,150 mm ahead of the front axle"],
      ],
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
        ["Standard", "FIA 8869-2018"],
      ],
      didYouKnow:
        "At Silverstone in 2022, Zhou Guanyu's car slid upside down across the track and gravel and over the tyre barrier. Its roll hoop broke off, and the halo kept his head clear of the ground.",
    },
    "roll-structure": {
      name: "Roll structure & airbox",
      category: "safety",
      summary: "The hoop above the driver's head that protects them if the car flips; it is also the engine's air intake.",
      details: [
        "If the car turns over, this structure and the halo keep a survival space around the driver's head.",
        "In Zhou Guanyu's 2022 Silverstone crash the hoop broke off as the upside-down car dug into the track. For 2023 the FIA made its top **rounded**, so it slides instead of digging in, and added a test that pushes it forward. From 2024 it must survive 105 kN and then 140 kN, in directions the FIA picks at random.",
        "The opening at the front is the airbox. It feeds the turbocharger's compressor, and in many cars also an oil or ERS cooler packaged underneath. The T-camera sits on top (see **On-board cameras**).",
      ],
      specs: [
        ["Height", "Structure at 968 mm above the reference plane"],
        ["Test loads", "105 kN, then 140 kN (from 2024)"],
        ["Top", "Rounded, from 2023"],
      ],
    },
    "fuel-cell": {
      name: "Fuel cell",
      category: "power",
      summary: "A puncture-resistant rubber bladder behind the driver, holding the race fuel.",
      details: [
        "The fuel sits in a flexible bag of Kevlar-reinforced rubber, built to the FIA's FT5 standard. It can deform in a crash without splitting. Inside, pumps, baffles and a small collector tank keep fuel at the pickup even under cornering loads of 5 g.",
        "The fuel must sit between the cockpit and the engine, within 400 mm of the centre line. An FIA flow meter limits the flow into the engine to **100 kg per hour**. Refuelling has been banned since 2010, so the whole race load is on board at the start, and teams carry no more than they expect to burn.",
        "Since 2022 the fuel has been **E10**: 10% ethanol made from sustainable sources, a step toward the fully sustainable fuel of 2026.",
      ],
      specs: [
        ["Standard", "FIA FT5 safety bladder"],
        ["Fuel flow", "≤100 kg/h"],
        ["Fuel", "E10 (at least 10% sustainable ethanol)"],
      ],
      didYouKnow: "A full fuel load makes a car about 3 seconds a lap slower than it is on the last lap, which is why lap times fall through a race even as the tyres wear.",
    },
    cockpit: {
      name: "Cockpit",
      category: "cockpit",
      summary: "The driver's workspace: a moulded seat, the steering wheel and energy-absorbing padding.",
      details: [
        "The driver lies back with their feet higher than their hips, so the car can be as low as possible. Strapped in and fully kitted, the driver must be able to remove the steering wheel and climb out within **7 seconds**, then refit the wheel within 12 seconds in total.",
        "The driver, seat and kit must weigh at least **80 kg** (82 kg from 2025). Lighter drivers carry ballast in the cockpit, so a small driver gains no advantage.",
      ],
      specs: [
        ["Driver + seat minimum", "80 kg (2025: 82 kg)"],
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
        "A quick-release hub, worked by pulling a collar on the column, lets the driver take the wheel off to get out.",
      ],
      specs: [
        ["Controls", "Paddles, buttons and rotary switches"],
        ["Display", "Gear, deltas, battery state, flags"],
        ["Clutch", "Pull-type paddles"],
      ],
    },
    headrest: {
      name: "Headrest & cockpit padding",
      category: "safety",
      summary: "Energy-absorbing foam around the driver's head and shoulders.",
      details: [
        "Padding behind and each side of the driver's head is made from a foam that compresses slowly under impact. This limits how fast the head can move in a crash.",
        "It is designed to be the first thing the helmet touches, and lifts out as one piece, so marshals can reach the driver.",
      ],
    },
    mirrors: {
      name: "Mirrors",
      category: "cockpit",
      summary: "Rear-view mirrors on stays above the sidepod inlets.",
      details: [
        "The mirror bodies must sit in a set zone above the sidepod inlets, 470–680 mm from the centre line, on a stay to the chassis and an optional rear stay to the sidepod. Teams shape them to help the airflow on its way to the sidepods.",
        "The glasses grew from 150 to 200 mm wide for 2023, after drivers complained about how little they could see behind them.",
      ],
      specs: [["Glass", "200 × 50 mm (2022: 150 × 50)"]],
    },
    "side-impact": {
      name: "Side impact structures",
      category: "safety",
      summary: "Crushable carbon tubes in the sidepods that absorb a side impact before it reaches the tub.",
      details: [
        "Two tubes on each side stick out from the survival cell inside the sidepods, one high and one low, both fully enclosed by bodywork. In a T-bone crash they crush first, spreading the load and slowing the intrusion.",
        "Their position sets the shape of the sidepod inlets, which is why most cars' inlets sit just above or around them.",
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
      summary: "An FIA-homologated extinguisher whose nozzles discharge into the cockpit and the engine bay.",
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
        "The **T-camera** sits on top of the roll hoop, with cameras on the sides of the airbox, pods on the nose, and a forward-facing camera on the chassis. Housings used instead of cameras must match a real camera's size, shape and mass, so the choice never changes the car's balance.",
        "The T-camera's colour (black or fluorescent yellow) tells viewers which of a team's two cars they are watching.",
      ],
    },

    // --- Front wing ---------------------------------------------------------
    "front-wing": {
      name: "Front wing",
      category: "aero",
      summary: "Four elements that curl up into the endplates, making front downforce without throwing dirty air outward.",
      details: [
        "The front wing makes downforce over the front tyres and shapes the air for the rest of the car. The 2022 rules made it much simpler: no more than **four elements**, blending smoothly into the endplates, with none of the cascades and slots of earlier years.",
        "Its job changed too. The 2017–21 wings were designed to throw the front tyres' turbulent wake outward, straight into the path of a following car. The 2022 wing keeps that wake closer to the car, and the clean flow under it feeds the floor.",
        "The flaps do not move on track. Mechanics set their angle at a pit stop with the **adjusters**, to tune the car's balance.",
      ],
      specs: [
        ["Elements", "Up to 4, with 5–15 mm slot gaps"],
        ["Position", "475–1,350 mm ahead of the front axle"],
        ["Height", "Profiles ≤315 mm above the reference plane"],
        ["Flex test", "≤10 mm under 1,000 N (15 mm before mid-2025)"],
      ],
      didYouKnow:
        "From the 2025 Spanish Grand Prix the FIA tightened its load tests on front wings, to stop teams designing flaps that bent flatter at high speed and so shed drag on the straights.",
    },
    "fw-mainplane": {
      name: "Front mainplane",
      category: "aero",
      summary: "The fixed, lowest element of the front wing.",
      details: [
        "Running close to the ground, the mainplane benefits from **ground effect**: the air speeds up in the narrow gap under it, lowering the pressure and pulling the wing down harder than it would in free air.",
        "Two pylons carry it from the underside of the nose. Their shape and the wing's centre section start steering the air toward the floor.",
      ],
    },
    "fw-flaps": {
      name: "Front flaps",
      category: "aero",
      summary: "The three upper elements, stacked above and behind the mainplane.",
      details: [
        "Each flap sits behind and above the element in front, with a narrow slot between them. Fast air from each slot keeps the flow attached to the next element, which lets the stack run steep angles without stalling.",
        "Outboard, the flaps sweep up into the endplates in one smooth surface, a signature of the 2022 rules.",
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
      summary: "Curved plates at the wing tips that seal the wing and guide air around the front tyres.",
      details: [
        "An open wing tip lets high-pressure air spill round into the low-pressure side, wasting downforce and creating a tip vortex. The endplate limits that spillage.",
        "The 2022 endplate must be almost flat and at least 10 mm thick, with none of the slots and curls that once threw the front tyre's wake outward. The elements sweep down into its foot, and a small diveplane may sit on its outer face to help steer air around the tyre, whose turbulent wake is the floor's worst enemy.",
      ],
      specs: [
        ["Position", "900–975 mm from the centre line"],
        ["Height", "Up to 475 mm above the reference plane"],
      ],
    },
    "fw-adjusters": {
      name: "Flap adjusters",
      category: "aero",
      summary: "The screw mechanisms that set the front flaps' angle, turned by hand at a pit stop.",
      details: [
        "A mechanic on each side fits a tool to the adjuster and turns it during a normal stop. Only the rearmost one or two elements may move, by up to 40 mm (35 mm in 2022), and only on the stationary car. More flap gives more front grip and cures understeer, at the cost of a little drag.",
        "As the tyres wear and the fuel burns off, a car's balance shifts, so a small flap change at the stop can restore it for the next stint.",
      ],
      didYouKnow: "In 2009 and 2010 drivers could change the front flap angle from the cockpit, a forerunner of DRS.",
    },

    // --- Power unit ---------------------------------------------------------
    "power-unit": {
      name: "Power unit",
      category: "power",
      summary: "A 1.6-litre turbocharged V6 with two electric motor-generators, making about 1,000 hp.",
      details: [
        "F1 calls it a power unit because the engine is only part of it. The **MGU-K** on the crankshaft recovers energy under braking and adds up to 120 kW. The **MGU-H** on the turbo shaft recovers energy from the exhaust, and uses it to kill turbo lag.",
        "These turbo-hybrids have raced since 2014. By 2022 they were among the most efficient engines ever built, turning more than half the fuel's energy into work. To save money before the 2026 engines arrived, their development was **frozen**: the engine, turbo and MGU-H from March 2022, the MGU-K, battery and electronics from that September. After that, manufacturers could only fix reliability problems.",
      ],
      specs: [
        ["ICE", "1.6 L, 90° V6, single turbo"],
        ["Electric", "MGU-K 120 kW + MGU-H"],
        ["Minimum mass", "151 kg (2022: 150 kg)"],
        ["Manufacturers", "Mercedes, Ferrari, Renault, Honda (Red Bull)"],
      ],
      didYouKnow:
        "Honda officially left F1 at the end of 2021, but kept building Red Bull's engines. They raced as Red Bull Powertrains units in 2022 and as Honda RBPT from 2023.",
    },
    ice: {
      name: "V6 engine (ICE)",
      category: "power",
      summary: "The internal combustion engine: six cylinders in a 90° vee, with the fuel flow capped at 100 kg/h.",
      details: [
        "Each cylinder has an 80 mm bore and the total displacement is 1.6 litres. Fuel is injected directly into the cylinders at very high pressure. Very lean combustion and pre-chamber ignition let the best of these engines turn more than half the fuel's energy into work, against about a third in a road car.",
        "Above 10,500 rpm the fuel flow is capped at 100 kg per hour, so extra revs bring no extra fuel. These engines rev far lower than the V8s and V10s before them.",
      ],
      specs: [
        ["Layout", "90° V6, 80 mm bore"],
        ["Crankshaft", "On the centre line, 90 mm above the reference plane"],
        ["Displacement", "1,600 cc"],
        ["Fuel flow", "≤100 kg/h above 10,500 rpm"],
        ["Compression ratio", "≤18.0:1"],
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
        "Unlike the MGU-K, the energy it may recover is unlimited. That made the system remarkably efficient, but also very expensive and hard to master. It was deleted from the 2026 engines to attract new manufacturers.",
      ],
      specs: [
        ["Speed", "≤125,000 rpm"],
        ["Minimum mass", "4 kg"],
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
      summary: "Inconel pipes that gather the six cylinders' exhaust into the turbine, then out through the tailpipe.",
      details: [
        "The primaries are made of Inconel, a nickel superalloy that keeps its strength at around 900 °C. Their lengths are tuned so the pulses from each cylinder arrive at the turbine evenly. The heat turns the metal straw-gold and blue.",
        "Up to two wastegates vent excess gas around the turbine to control boost. Their pipes must merge into the main pipe before the end, because only **one tailpipe** may leave the car. It runs straight on the centre line for its last 450 mm and exits 550–565 mm behind the rear axle, above the crash structure.",
      ],
      specs: [
        ["Material", "Inconel nickel superalloy"],
        ["Tailpipe", "One, 100–130 mm bore"],
        ["Exit height", "Above 350 mm from the reference plane"],
      ],
    },
    "oil-tank": {
      name: "Oil tank",
      category: "power",
      summary: "The tank for the dry-sump oil system, between the engine and the fuel cell.",
      details: [
        "F1 engines use a **dry sump**: scavenge pumps suck the oil out of the crankcase and send it to a separate tank, then a pressure pump feeds it back. This lets the engine sit low and keeps oil supplied under any cornering load.",
        "The rules limit how much oil an engine may burn, and the FIA monitors the tank level, so oil cannot be used as extra fuel.",
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
        "Harvesting is limited to 2 MJ a lap, but the MGU-K can also be driven by energy straight from the MGU-H, so it can deploy more than it harvests.",
      ],
      specs: [
        ["Power", "≤120 kW"],
        ["Minimum mass", "7 kg"],
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
        "Few 2022 cars got there at first. Most were overweight, and teams spent the next seasons slimming them, from leaving bare carbon unpainted to redesigning parts.",
      ],
      specs: [
        ["Minimum mass", "798 kg without fuel (2025: 800 kg)"],
        ["Weight split", "Front ≥44.6%, rear ≥53.9% of the minimum"],
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
        "The casing has to be stiff, because any flex would let the rear suspension move. It also has to be slim, so air can flow past it to the diffuser and beam wing.",
        "Its design was homologated before 2022 and frozen until the end of 2025, with one upgrade allowed.",
        "Use **X-ray** or explode the car to see the gear cluster inside.",
      ],
    },
    "gear-cluster": {
      name: "Gear cluster",
      category: "drivetrain",
      summary: "Eight forward gears and a reverse, shifted in milliseconds by a seamless-shift system.",
      details: [
        "A **seamless-shift** gearbox engages the next gear before releasing the current one, so there is almost no break in drive. A full upshift takes a few milliseconds, controlled hydraulically and electronically.",
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
        "Its axis must sit within 60 mm of the rear axle line and 250–260 mm above the reference plane.",
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
        "Like the nose, the structure is designed to crush progressively. Its outer shape is prescribed by the FIA, the same on every car, and for 2022 its test moved to a 900 kg trolley, 15% more energy than before.",
        "It also carries the rain light and the rear jacking point. The exhaust and the rear wing pylon pass above it.",
      ],
      specs: [
        ["Length", "From 325 to 750 mm behind the final drive"],
        ["Test", "900 kg at ≥11 m/s (+15% energy over 2021)"],
      ],
    },
    "rain-light": {
      name: "Rain light",
      category: "safety",
      summary: "A bright red LED light on the crash structure that makes the car visible in spray.",
      details: [
        "The light is switched on in wet conditions so following drivers can see the car through the spray. Two more lights, in the rear wing endplates, work with it.",
      ],
      specs: [["Height", "295–305 mm above the reference plane"]],
    },

    // --- Rear wing ----------------------------------------------------------
    "rear-wing": {
      name: "Rear wing",
      category: "aero",
      summary: "A two-element wing whose tips roll down into its sides, with the DRS flap on top and a beam wing below.",
      details: [
        "The rear wing makes downforce for the rear axle. The 2022 wing has no flat endplates: its tips roll down in one smooth curve into its sides. With the beam wing below, this shape throws the car's wake **upward**, so a following car runs through cleaner air.",
        "The upper element is the **DRS** flap. Press **DRS** in the toolbar (or **A**) to open it.",
      ],
      specs: [
        ["Elements", "Mainplane + DRS flap"],
        ["Height", "Up to 910 mm above the reference plane"],
        ["Width", "≈1,230 mm over the rolled tips"],
        ["Beam wing", "Up to 2 elements below"],
      ],
    },
    "rw-mainplane": {
      name: "Rear mainplane & endplates",
      category: "aero",
      summary: "The fixed lower element of the rear wing, its rolled tips and the endplates beneath them.",
      details: [
        "The mainplane makes most of the wing's downforce. Its tips roll up, out and down, so the wing-tip vortex is weaker and the wake leaves higher than with the old flat endplates.",
        "Below the tips the endplates lean in toward their feet, 325 mm above the reference plane, and reach back almost 700 mm behind the rear axle. Each carries one of the rear lights.",
      ],
    },
    "rw-flap": {
      name: "DRS flap",
      category: "aero",
      summary: "The upper element, which opens on the straights to cut drag: the Drag Reduction System.",
      details: [
        "When the driver opens DRS, a hydraulic actuator lifts the flap's leading edge, pivoting it about an axis near its trailing edge. The slot to the mainplane opens wide, and the wing stops making much downforce or drag. Touching the brakes closes it, and any failure must leave it closed.",
        "DRS typically adds 10–15 km/h by the end of a straight, enough to complete an overtake into the next braking zone.",
      ],
      specs: [
        ["Pivot", "Within 20 mm of the top rear corner of the wing"],
        ["Slot gap", "9.4–13 mm closed (2022–24: 10–15), ≤85 mm open"],
      ],
      howItWorks: [
        "At a detection point before the straight, the timing system checks the gap to the car ahead.",
        "Under one second behind, the driver may open the flap in the following DRS zone by pressing the DRS button.",
        "The flap closes when the driver brakes or presses the button again. In practice and qualifying, any car may use it in the zones.",
      ],
      didYouKnow:
        "DRS arrived in 2011 as a fix for how hard it was to follow another car. It outlived the 2022 rules meant to make it unnecessary, and was only replaced in 2026.",
    },
    "rw-lights": {
      name: "Rear wing lights",
      category: "safety",
      summary: "LED light strips in the sides of the rear wing that add to the rain light.",
      details: [
        "One light in each endplate, between 500 and 870 mm above the reference plane and facing straight back. Mounted high, they are easier to see through the spray than the rain light low on the crash structure.",
      ],
    },
    "rw-pylon": {
      name: "Rear wing pylon",
      category: "aero",
      summary: "A slender central support that carries the wing and wraps around the exhaust.",
      details: [
        "The pylon carries the wing's load, several hundred kilograms at high speed, down into the gearbox. It may be no more than 25 mm thick, with up to two blades, which limits its disturbance to the airflow under the wing.",
      ],
    },
    "rw-actuator": {
      name: "DRS actuator",
      category: "aero",
      summary: "The hydraulic actuator that opens and closes the DRS flap.",
      details: [
        "A small hydraulic ram in a pod on top of the wing, on the centre line, drives the flap through a linkage. The FIA ECU allows it to open only in a DRS zone, and if it fails, the flap must close and stay closed.",
      ],
    },
    "beam-wing": {
      name: "Beam wing",
      category: "aero",
      summary: "Two small elements low between the rear wheels that work with the diffuser.",
      details: [
        "The beam wing sits low between the rear wheels, above the diffuser exit, split in two around the exhaust (it must keep 10 mm clear of it). The low pressure under it helps draw air out of the diffuser, so the whole floor makes more downforce. It also helps turn the car's wake upward.",
        "It is one of the parts teams change most between circuits: a single slim element for Monza, two deep ones for Monaco, though the rules set a minimum size. Banned from 2014, it came back in 2022, then disappeared again for 2026.",
      ],
      specs: [
        ["Elements", "Up to 2"],
        ["Zone", "270–550 mm behind the rear axle, 325–500 mm up"],
      ],
    },

    // --- Bodywork -----------------------------------------------------------
    bodywork: {
      name: "Bodywork",
      category: "aero",
      summary: "The engine cover and sidepods: removable shells that shape the air over the car and into the coolers.",
      details: [
        "The bodywork does three jobs: it encloses the power unit, feeds air to the radiators, and guides the flow toward the floor, beam wing and rear wing.",
        "Use **X-ray** to see through it to the engine and coolers.",
      ],
    },
    "engine-cover": {
      name: "Engine cover",
      category: "aero",
      summary: "The tapering cover over the power unit, ending in a wide cooling exit round the gearbox.",
      details: [
        "The cover is shrink-wrapped as tightly as possible around the engine and coolers, narrowing into the **coke bottle** shape at the back. This speeds the air toward the beam wing and diffuser.",
        "The rules also require a minimum side profile: from the side, the cover must hide an area that stays 727 mm high until 200 mm ahead of the rear axle. Only a thin central **fin** can reach that high, so every car carries one.",
        "Hot air from the radiators leaves through the **cannon**, the exit at the back of the cover just ahead of the rear axle, and through louvres in the tops of the bodywork. Teams open more louvres at hot races and close them where cooling allows, to save drag.",
      ],
    },
    sidepods: {
      name: "Sidepods",
      category: "aero",
      summary: "The pods either side of the driver that house the radiators, shaped in the downwash style most teams adopted.",
      details: [
        "The inlets swallow air for the radiators, and the outside shape decides how the rest flows past. A deep **undercut** below the inlet lets air reach the floor edge. The top surface then ramps steeply down toward the rear (\"downwash\"), sending air to the beam wing.",
        "In 2022 the teams' ideas could hardly have been more different: Mercedes' almost pod-less \"zeropod\", Ferrari's scooped \"bathtub\" and Red Bull's downwash ramps. By 2024 almost everyone had converged on the Red Bull style, which this model follows.",
      ],
    },

    // --- Floor --------------------------------------------------------------
    floor: {
      name: "Floor",
      category: "aero",
      summary: "Two venturi tunnels under the car that make most of its downforce: ground effect.",
      details: [
        "Air entering the tunnels behind the front wheels is squeezed through a low **throat** under the sidepods, where it speeds up and its pressure drops. The diffuser then slows it again. The low pressure sucks the whole car toward the track, at little cost in drag, and the wake it leaves hurts a following car far less than wing downforce does.",
        "Run too close to the ground, the flow under the floor can suddenly stall. Downforce collapses, the car rises, the flow reattaches and pulls it down again, several times a second. This **porpoising** shook drivers so hard in 2022 that the FIA brought in a limit on the oscillation mid-season, then raised the floor edges and the diffuser throat for 2023.",
      ],
      specs: [
        ["Width", "±800 mm"],
        ["Tunnels", "Two, from behind the front wheels to the diffuser"],
        ["Floor edges", "Raised 15 mm for 2023"],
        ["Following car", "≈18% downforce loss at 10 m (2021 cars: ≈47%)"],
      ],
      didYouKnow:
        "Ground effect was first exploited by Lotus in 1977–78 with sliding skirts. It was banned for 1983 because cornering speeds had become dangerous.",
    },
    "floor-body": {
      name: "Floor body & fences",
      category: "aero",
      summary: "The main carbon floor with the tunnel roofs, and four fences per side under its leading edge.",
      details: [
        "The tunnel roofs are moulded into the underside of the floor. They rise high at the inlet, drop to the throat under the sidepods and climb again into the diffuser.",
        "Under the leading edge, which sweeps back from 650 mm behind the front axle on the centre line, up to four curved **fences** on each side split the incoming air. They steer it into the tunnels and set up vortices that keep it attached and stop air from the sides leaking in.",
        "Since August 2022 the middle of the floor must pass a stiffness test, so it cannot be designed to bend closer to the track at speed.",
      ],
    },
    "floor-edge": {
      name: "Floor edge & edge wing",
      category: "aero",
      summary: "The scrolled outer edge of the floor and the small wing running along it.",
      details: [
        "Air leaking under the floor's edges would fill in the low pressure in the tunnels. The scrolled edge and the edge wing roll the flow along the side into vortices that act like an invisible skirt, \"sealing\" the floor.",
        "Sealing it too well is what made the cars porpoise, so for 2023 the floor edges were raised by 15 mm and made stiffer. From 2024, no metal inserts were allowed in them.",
      ],
      specs: [
        ["Edge wing", "From 1,700 mm behind the front axle to 700 mm ahead of the rear"],
        ["Height", "Edge wing ≤90 mm above the reference plane"],
      ],
    },
    "floor-stays": {
      name: "Floor stays",
      category: "aero",
      summary: "Slim stays that stop the edges of the floor flexing at speed.",
      details: [
        "Under the load of the airflow the wide, thin floor would bend, changing how close its edges run to the track. Stays from the chassis hold the edges in place, and the FIA's floor deflection tests check they do.",
        "When the FIA allowed a second stay to help fight porpoising at the 2022 Canadian Grand Prix, rival teams protested that it favoured a struggling Mercedes.",
      ],
    },
    diffuser: {
      name: "Diffuser",
      category: "aero",
      summary: "The rising tail of the venturi tunnels, between the rear wheels.",
      details: [
        "Air under the floor has to return to normal speed and pressure before it leaves the car. The diffuser's expanding shape does this gradually, which lets the air in the tunnels run faster in the first place.",
        "Strakes divide each side of the diffuser, and the beam wing just above its exit helps pull the air out. For 2023 the FIA raised its throat to make the cars less prone to porpoising.",
      ],
      specs: [
        ["Exit", "450 mm behind the rear axle, ±375 mm wide"],
        ["Throat", "Raised for 2023"],
      ],
    },
    plank: {
      name: "Plank & skids",
      category: "chassis",
      summary: "A 10 mm skid board under the floor that stops teams running the car dangerously low.",
      details: [
        "Running lower makes more downforce, so teams are tempted to scrape the floor along the track. The plank polices that. It must still be at least **9 mm thick** after the race (from 10 mm new), and a worn plank means disqualification.",
        "Titanium skids set into it take the worst of the contact. They are what throw the sparks you see at night races.",
      ],
      specs: [
        ["Thickness", "10 ±0.2 mm new, ≥9 mm worn"],
        ["Length", "From 430 mm behind the front axle to 600 mm ahead of the rear"],
        ["Holes", "4 × 50 mm (2022: 6)"],
        ["Skids", "Titanium, ≤4,000 mm² each"],
      ],
      didYouKnow: "Lewis Hamilton and Charles Leclerc were both disqualified from the 2023 United States Grand Prix after their planks were found worn below the limit.",
    },

    // --- Suspension ---------------------------------------------------------
    "front-suspension": {
      name: "Front suspension",
      category: "suspension",
      summary: "Wishbones, push-rods and steering that hold the front wheels at precisely controlled angles.",
      details: [
        "Each wheel is located by six members: two wishbones (four legs), a push-rod, and a track rod for steering. Since 2022 the springs must be purely mechanical: the hydraulic suspension elements and inerters teams used in the 2010s are banned.",
        "Ground-effect cars must run stiff and low to keep the floor working, which made them hard on drivers over bumps.",
        "This model uses **push-rods** at both ends, as Mercedes, Aston Martin, Williams and Alpine did in 2025. Red Bull and McLaren ran pull-rods at the front throughout these rules, and by 2025 Ferrari, Racing Bulls and Sauber had followed.",
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
        "Instead of coil springs, F1 cars use **torsion bars**, steel bars that twist as the rocker turns. They give very precise rates in little space. A heave element between the two sides controls the car's pitch and ride height, which is critical for keeping the floor working.",
      ],
    },
    "rear-suspension": {
      name: "Rear suspension",
      category: "suspension",
      summary: "Wishbones, rods and toe links mounted on the gearbox casing.",
      details: [
        "The rear suspension carries the driven wheels, so it has to cope with traction and the driveshafts passing through it. Its geometry controls how the car squats under acceleration, which matters doubly on a ground-effect car, as it changes how the floor meets the air.",
      ],
    },
    "rs-wishbones": {
      name: "Rear wishbones",
      category: "suspension",
      summary: "Carbon arms that locate the rear uprights on the gearbox.",
      details: [
        "Their shapes and angles are tuned for the aerodynamics around the diffuser and beam wing as much as for mechanics.",
      ],
    },
    "rs-pushrods": {
      name: "Rear push-rods",
      category: "suspension",
      summary: "Carry the rear wheel loads to rockers on top of the gearbox.",
      details: [
        "The choice between push-rods and pull-rods comes down to where the springs and dampers fit best, and what each layout does to the airflow. In 2022 most of the grid used pull-rods at the rear; by 2025 only Ferrari and Haas still did.",
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
      summary: "The rear rockers, torsion bars and heave damper on the gearbox.",
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
      details: ["The rear tyres are wider because they put down around 1,000 hp, and their wear and temperature often decide a race."],
    },
    "front-tyres": {
      name: "Front tyres",
      category: "wheels",
      summary: "Low-profile 18-inch slicks, introduced in 2022 in place of the 13-inch tyres used for decades.",
      details: [
        "Without tread, a slick puts the most rubber possible on the track. The rubber works best in a narrow temperature window, roughly 90–110 °C, which is why drivers weave behind the safety car to warm their tyres.",
        "The lower, stiffer sidewalls flex less than the old balloon-like 13-inch tyres. That makes the car more predictable for the aerodynamicists, and the tyres were designed to overheat less when following another car.",
        "The coloured band shows the compound: red for soft, yellow for medium, white for hard.",
      ],
      specs: [
        ["Size", "Pirelli 305/720-R18"],
        ["Width as fitted", "345–375 mm"],
        ["Diameter", "≤725 mm (wets ≤735 mm)"],
      ],
    },
    "rear-tyres": {
      name: "Rear tyres",
      category: "wheels",
      summary: "Wide 18-inch slicks that carry the drive.",
      details: ["The rear tyres take the traction and much of the braking load. Keeping them in their temperature window over a stint is often what decides a race."],
      specs: [
        ["Size", "Pirelli 405/720-R18"],
        ["Width as fitted", "440–470 mm"],
      ],
    },
    "front-rims": {
      name: "Front wheels",
      category: "wheels",
      summary: "Forged magnesium 18-inch rims with a cover over the outer face and a single centre-lock nut.",
      details: [
        "The wheels come from a single supplier, BBS, and each is fixed by one central nut so a pit crew can change all four in about two seconds.",
        "A cover over each wheel's outer face became mandatory in 2022. Teams can no longer use the spokes to pump brake air outward for aerodynamic gain.",
      ],
      specs: [
        ["Material", "Forged magnesium alloy"],
        ["Covers", "Mandatory, FIA-supplied"],
        ["Track", "Inner rim face ≤635 mm from the centre line"],
      ],
    },
    "rear-rims": {
      name: "Rear wheels",
      category: "wheels",
      summary: "Wider 18-inch magnesium rims for the rear tyres.",
      details: [
        "Like the fronts, they carry a cover and a single centre-lock nut. Three high-strength tethers attach each wheel assembly to the chassis, so a wheel cannot fly free in a crash.",
      ],
      specs: [
        ["Track", "Inner rim face ≤548 mm from the centre line"],
        ["Tethers", "3 per wheel, ≥15 kJ in total (2024–25)"],
      ],
    },
    "front-brakes": {
      name: "Front brakes",
      category: "wheels",
      summary: "Carbon-carbon discs gripped by aluminium calipers, slowing the car at more than 5 g.",
      details: [
        "Carbon-carbon discs run at 400–1,000 °C and get stronger, not weaker, as they heat up. More than a thousand small radial holes pump air through each disc to control its temperature.",
        "The bigger 18-inch wheels made room for bigger discs: from 2022 the fronts grew from 278 mm to about 330 mm across.",
      ],
      specs: [
        ["Disc", "325–330 mm diameter, ≤32 mm thick"],
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
      specs: [
        ["Disc", "275–280 mm diameter"],
        ["Control", "Brake-by-wire"],
      ],
    },
    "front-ducts": {
      name: "Front brake ducts",
      category: "cooling",
      summary: "Carbon scoops and drums that feed cooling air to the brakes and help manage tyre temperature.",
      details: [
        "The inlet scoop picks up air on the inside of the wheel. The drum around the disc, whose shape the FIA prescribes, channels it through the disc's holes and out.",
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
        "Machined from aluminium alloy, the only material these rules allow, the upright carries the wheel bearings and caliper, and is where all the wishbone, push-rod and track-rod loads meet. Its stiffness directly affects how precisely the tyre is held.",
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
    "wheel-deflectors": {
      name: "Wheel deflectors",
      category: "aero",
      summary: "Small wings over the front wheels that steer the tyre's turbulent wake away from the floor.",
      details: [
        "A spinning, deforming front tyre throws off a turbulent wake that would spoil the airflow into the floor and toward a following car. These \"eyebrows\" on the brake drums turn that wake up and away. Their shape is fixed by the FIA as part of the standard drum, so they are the same on every car.",
        "They were a 2022 innovation and turned out to be a short-lived one: the 2026 rules deleted them.",
      ],
    },
  },
};
