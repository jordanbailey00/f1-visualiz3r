import type { CarInfo } from "../types";

/**
 * The 2009–2013 car. Figures come from the FIA Formula 1 Technical
 * Regulations of those years (the 3 July 2013 issue unless noted) and the
 * Sporting Regulations; the model is a generic car built to the 2013 rules,
 * not any one team's design.
 */
export const car2009: CarInfo = {
  id: "2009",
  name: "Exhaust tricks",
  shortName: "2009",
  years: "2009–2013",
  model: "Generic 2009–2013-regulation car, to the 2013 rules (not any one team's design)",
  tagline: "Slick tyres return, bodywork goes clean, exhausts blow the diffuser.",
  intro: [
    "For 2009 Formula 1 rewrote its aerodynamic rules to make overtaking easier. **Slick tyres** came back after eleven seasons of grooves, the winglets that covered the 2008 cars were swept away, the front wing grew to the full 1,800 mm width of the car, and the rear wing became tall and narrow. An optional hybrid, **KERS**, added 60 kW for a few seconds a lap.",
    "Engineers soon found new loopholes. Brawn won the 2009 title with a **double diffuser**; Red Bull turned exhaust gas into downforce by **blowing the diffuser**, and Sebastian Vettel won four titles in a row. When the rules moved the exhausts up for 2012, teams used the **Coanda effect** to bend the gas back down to the floor. The same year, lower noses in front of tall chassis gave these cars their famous **step**.",
    "This was the last era of the naturally aspirated V8, and the first with **DRS**, from 2011. Press **DRS** (or **A**) to open the rear wing flap. Press **Explode** to take the car apart layer by layer, and click any part to learn what it does.",
  ],
  specs: [
    ["Width", "1,800 mm"],
    ["Wheelbase", "No limit; about 3.4 m"],
    ["Minimum mass", "642 kg without fuel (2009: 605 kg)"],
    ["Engine", "2.4 L V8, naturally aspirated"],
    ["Rev limit", "18,000 rpm"],
    ["KERS", "≤60 kW, ≤400 kJ per lap"],
    ["Aero", "DRS, beam wing, exhaust-blown floor"],
    ["Tyres", "13-inch Pirelli: 245/660 front, 325/660 rear"],
  ],
  camera: { position: [3700, 2000, 4300], target: [60, 350, 0] },
  size: 5200,
  parts: {
    // --- Survival cell ------------------------------------------------------
    chassis: {
      name: "Survival cell",
      category: "chassis",
      summary: "The carbon-fibre tub that holds the driver and the fuel, and carries every other part of the car.",
      details: [
        "Everything on the car is bolted to the survival cell. The front suspension, nose and steering are mounted on it, and the V8 is bolted directly to its rear face as a stressed member. The gearbox and rear suspension hang off the back of the engine.",
        "The refuelling ban of 2010 roughly doubled the size of the fuel tank, so the tub behind the driver grew longer and wheelbases stretched with it.",
        "At the front the tub could be as tall as 625 mm, well above the nose ahead of it. That difference is the **step** these cars are remembered for.",
      ],
      specs: [
        ["Material", "Carbon-fibre composite with honeycomb core"],
        ["Contains", "Driver, fuel cell"],
        ["Height at the front", "≤625 mm"],
      ],
    },
    monocoque: {
      name: "Carbon monocoque",
      category: "chassis",
      summary: "A one-piece carbon-fibre tub: stiff, light, and built to stop anything reaching the driver.",
      details: [
        "\"Monocoque\" means the skin itself is the structure, with no frame inside. Layers of carbon-fibre fabric are laid into a mould around an aluminium honeycomb core, then cured under heat and pressure in an autoclave. The result is far stiffer than steel for its weight.",
        "Its sides are protected by panels of **Zylon**, a fibre stronger than Kevlar, so that sharp debris or another car's nose cannot pierce the cockpit. The rules fix the lay-up of those panels ply by ply.",
        "Use **X-ray** to see the fuel cell and KERS battery packed inside.",
      ],
      specs: [["Construction", "Carbon/epoxy skins over aluminium honeycomb"]],
      howItWorks: [
        "Carbon fibres are extremely strong along their length, so each ply is laid at a chosen angle to carry the loads where they flow.",
        "The honeycomb core spaces two thin skins apart, which multiplies stiffness the way an I-beam does.",
        "Zylon layers in the sides resist penetration by sharp debris.",
      ],
    },
    "vanity-panel": {
      name: "Vanity panel",
      category: "aero",
      summary: "An optional, non-structural fairing allowed from 2013 that hides the step between the tall chassis and the low nose.",
      details: [
        "From 2012, nothing more than 1,950 mm ahead of the cockpit's rear edge could be above 550 mm. The chassis behind that line could still reach 625 mm, and teams kept it tall to leave room for air under the nose, so a step 75 mm high appeared across the top of the car.",
        "For 2013 the rules allowed a fairing to smooth it over, up to 625 mm high. It must be a single piece, may carry no load, must be made to a laminate the FIA prescribes, and may have no concave radius under 50 mm. Most teams fitted one.",
        "**Explode** the car and the panel lifts off, showing the step underneath.",
      ],
      specs: [
        ["Height", "≤625 mm"],
        ["Allowed", "From 2013, optional"],
      ],
      didYouKnow: "It earned its name because it was there for looks, not lap time.",
    },
    nose: {
      name: "Nose (front impact structure)",
      category: "safety",
      summary: "A long crushable carbon cone, lowered in 2012, with the front wing hung beneath it.",
      details: [
        "The nose is a hollow carbon cone designed to crush progressively; it must stop a 780 kg trolley at 15 m/s. In 2010 a second test was added, at 900 kg.",
        "Noses had been running high, to send as much air as possible under the car. For 2012 the FIA lowered them to 550 mm so that a nose was less likely to ride up over another car in a crash. Rules forcing the tip down further came only in 2014.",
      ],
      specs: [
        ["Crash tests", "780 kg and 900 kg, both at 15 m/s"],
        ["Height", "≤550 mm ahead of the 1,950 mm line"],
      ],
      didYouKnow: "The stepped noses of 2012 were widely mocked, and were compared to a platypus's bill.",
    },
    "roll-structure": {
      name: "Roll structure & airbox",
      category: "safety",
      summary: "The hoop above the driver's head that protects them if the car flips; it is also the engine's air intake.",
      details: [
        "If the car turns over, this structure and a second hoop ahead of the driver keep a survival space around the driver's head. It must reach at least 940 mm above the reference plane, 30 mm behind the cockpit, and survive a load of 50 kN sideways, 60 kN rearwards and 90 kN downwards. A slot through it takes a strap, so a stranded car can be lifted quickly.",
        "The opening at the front is the airbox. With no turbo to compress the air, the V8 gains a little from the car's speed, which rams air down the duct. The T-camera sits on top, with the light that shows whether the KERS is safe to touch.",
      ],
      specs: [
        ["Height", "≥940 mm above the reference plane"],
        ["Load test", "50 kN sideways, 60 kN rearwards, 90 kN down"],
      ],
    },
    "fuel-cell": {
      name: "Fuel cell",
      category: "power",
      summary: "A puncture-resistant rubber bladder behind the driver, big enough from 2010 to last a whole race.",
      details: [
        "The fuel sits in a flexible bag of Kevlar-reinforced rubber, built to the FIA's FT5 standard. It can deform in a crash without splitting. All of it must lie between the driver's back and the front of the engine, within 400 mm of the centre line.",
        "Refuelling during races was banned for 2010, so cars had to start with every drop they would need, about 160 kg. Tanks roughly doubled in size, and a heavy car at the start became a light car at the finish.",
        "There was still no limit on how much fuel a car could use. That arrived with the hybrids in 2014.",
      ],
      specs: [
        ["Standard", "FIA FT5 safety bladder"],
        ["Race fuel", "No limit; about 160 kg"],
        ["Refuelling", "Banned from 2010"],
      ],
    },
    cockpit: {
      name: "Cockpit",
      category: "cockpit",
      summary: "The driver's workspace: a moulded seat, the steering wheel and energy-absorbing padding.",
      details: [
        "The driver lies back with their feet higher than their hips, so the car can be as low as possible. Strapped in and fully kitted, the driver must be able to remove the steering wheel and climb out within **5 seconds**, then refit the wheel within 10 seconds in total.",
        "There was no separate minimum weight for the driver, so every kilogram of driver cost lap time. The arrival of KERS made that worse: a heavy driver left the team less ballast to play with.",
      ],
      specs: [["Exit test", "Out in 5 s; wheel refitted within 10 s"]],
    },
    seat: {
      name: "Driver's seat",
      category: "cockpit",
      summary: "A thin carbon shell moulded to the individual driver's body.",
      details: [
        "Each seat is made by pouring expanding foam around the driver while they sit in position, then copying the shape in carbon fibre. A close fit spreads cornering and braking loads over the body and lets the driver feel what the car is doing.",
        "It may be held by no more than two bolts, undone with a tool every rescue crew carries, so a medical team can lift it out with the driver still strapped in and without cutting the belts.",
      ],
    },
    harness: {
      name: "Safety harness",
      category: "safety",
      summary: "Straps meeting at a single quick-release buckle hold the driver in the seat.",
      details: [
        "The rules require two shoulder straps, one abdominal strap and two straps between the legs, built to FIA standard 8853/98. They lock the driver into the seat against braking loads of more than 5 g and the far higher loads of a crash. A twist of the central buckle releases them all at once.",
      ],
    },
    "steering-wheel": {
      name: "Steering wheel",
      category: "cockpit",
      summary: "A carbon control panel with a display, shift paddles, and the buttons for KERS and DRS.",
      details: [
        "The wheel carries the shift paddles, the clutch paddles used at the start, and buttons and rotary switches for the radio, drinks, pit-lane limiter, brake balance, differential and engine settings. It comes off with a pull on a flange behind it.",
        "This era added two buttons that became part of racing. The rules say the release of KERS power must stay under the driver's complete control, so a **boost button** fires it; from 2011 another opens the **DRS** flap.",
      ],
      specs: [
        ["Controls", "Paddles, buttons and rotary switches"],
        ["Added", "KERS boost, DRS"],
      ],
    },
    headrest: {
      name: "Headrest & cockpit padding",
      category: "safety",
      summary: "Energy-absorbing foam around the driver's head and shoulders.",
      details: [
        "Three areas of padding, behind and each side of the driver's head, use a foam that compresses slowly under impact. This limits how fast the head can move in a crash. The side pads must be at least 95 mm thick.",
        "It lifts out as one piece, so marshals can reach the driver.",
      ],
    },
    pedals: {
      name: "Pedal box",
      category: "cockpit",
      summary: "Brake and throttle pedals in the footwell; F1 drivers brake with the left foot.",
      details: [
        "There is no clutch pedal: the clutch is worked by paddles on the steering wheel. The brake pedal drives two master cylinders, one per circuit, and the brakes stay fully hydraulic. The throttle pedal only moves a sensor, and the FIA standard ECU turns that signal into a torque demand on the V8.",
        "The soles of the driver's feet may not be ahead of the front axle, and the tub must reach at least 300 mm beyond them, so a frontal impact cannot crush them.",
      ],
      specs: [
        ["Pedals", "Brake (left foot) and throttle"],
        ["Brake effort", "Over 100 kg of force at the pedal"],
      ],
    },
    extinguisher: {
      name: "Fire extinguisher",
      category: "safety",
      summary: "An FIA-approved extinguisher inside the survival cell, with nozzles in the cockpit and the engine bay.",
      details: [
        "It must work in any position, even with the car upside down, and empty 95% of its contents in 10 to 30 seconds. It has to work if the car's electrics have failed. Both the driver and marshals can fire it: the external trigger is combined with the circuit-breaker handles at the base of the roll hoop.",
      ],
    },
    "cockpit-lights": {
      name: "Cockpit & warning lights",
      category: "safety",
      summary: "Red, blue and yellow track-signal lights in front of the driver, and the medical warning light on top of the tub.",
      details: [
        "LEDs placed directly in the driver's line of sight repeat flags and track signals: yellow for danger, blue for a faster car behind, red for a stopped session.",
        "Recessed into the top of the survival cell is the **medical warning light**, wired to the FIA data logger. After a crash it shows rescue crews at a glance how violent the impact was.",
      ],
    },
    mirrors: {
      name: "Mirrors",
      category: "cockpit",
      summary: "Rear-view mirrors on stalks beside the cockpit.",
      details: [
        "Each glass must be at least 150 × 50 mm. Everything about the mirror, housing and mounting included, must sit 250–500 mm from the centre line and 550–750 mm ahead of the cockpit's rear edge. Each may cover no more than 12,000 mm² seen from above and 14,000 mm² from the side, so they can't double as wings.",
        "To prove they work, the driver must read letters on boards 10 m behind the car.",
      ],
      specs: [["Glass", "≥150 × 50 mm"]],
    },
    "side-impact": {
      name: "Side impact structures",
      category: "safety",
      summary: "Crushable structures in the sidepods that absorb a side impact before it reaches the tub.",
      details: [
        "An impact structure stands out from each side of the survival cell, between the two roll hoops. In the FIA test it must stop a 780 kg object at 10 m/s, striking 300 mm above the reference plane and 500 mm ahead of the cockpit's rear edge.",
        "The bodywork must cover them completely, so they can't be shaped into aerodynamic parts.",
      ],
      specs: [["Crash test", "780 kg at 10 m/s"]],
    },
    cameras: {
      name: "On-board cameras",
      category: "electronics",
      summary: "The TV cameras every car must carry, in positions the FIA fixes.",
      details: [
        "The car must carry at least five cameras or camera housings. The **T-camera** sits on top of the roll hoop, with pods on the nose and a forward-facing camera on the chassis. Housings used instead of cameras must match a real camera's size and weight, so the choice never changes the car's balance.",
        "The T-camera's colour tells viewers which of a team's two cars they are watching.",
      ],
    },

    // --- Front wing ---------------------------------------------------------
    "front-wing": {
      name: "Front wing",
      category: "aero",
      summary: "As wide as the car: 1,800 mm of elements and cascades, either side of a fixed neutral section.",
      details: [
        "For 2009 the front wing grew from 1,400 to 1,800 mm wide and dropped closer to the ground, so that it would suffer less in the wake of the car ahead. Its tips now sat directly in front of the tyres, and teams worked hard to steer the air around their outer edges.",
        "There was no limit on the number of elements, so the wings soon grew stacks of flaps and **cascades**. Between ±250 and ±400 mm from the centre line they may show only 20,000 mm² from the side, so the flaps stop short of the nose.",
      ],
      specs: [
        ["Span", "≤1,800 mm (2008: 1,400)"],
        ["Position", "450–1,000 mm ahead of the front axle"],
        ["Height", "75–275 mm above the reference plane"],
        ["Flex test", "≤10 mm under 1,000 N (2011–12: 20 mm)"],
      ],
      didYouKnow: "Rivals accused Red Bull of running a front wing that drooped at speed in 2010, although it passed every FIA test of the time. The test has been tightened repeatedly since.",
    },
    "fw-mainplane": {
      name: "Front mainplane & neutral section",
      category: "aero",
      summary: "The lowest element of the wing, and the FIA's fixed profile across its middle.",
      details: [
        "Running close to the ground, the mainplane benefits from **ground effect**: the air speeds up in the narrow gap under it, lowering the pressure and pulling the wing down harder than it would in free air.",
        "The middle 500 mm is the **neutral section**, a profile drawn by the FIA that every car must use, so no team can tune the airflow under the nose. Two pylons, each no more than 25 mm thick, carry the wing up to the nose.",
      ],
      specs: [
        ["Neutral section", "±250 mm, to an FIA drawing"],
        ["Pylons", "Two, ≤25 mm thick, ≤5,000 mm² in all"],
      ],
    },
    "fw-flaps": {
      name: "Front flaps & cascade",
      category: "aero",
      summary: "The flaps stacked above the mainplane, and a cascade winglet near the endplate.",
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
      summary: "Plates at the wing tips, with foot plates reaching out to the edge of the span.",
      details: [
        "An open wing tip lets high-pressure air spill round into the low-pressure side, wasting downforce and creating a tip vortex. The endplate limits that spillage, and its foot steers air around the front tyre.",
        "The rules make the endplates stand 750–840 mm from the centre line with at least 95,000 mm² of side area, and require the foot plate beyond, out to 900 mm, to stay no higher than 100 mm underneath.",
      ],
      specs: [["Position", "750–840 mm from the centre line"]],
    },
    "fw-adjusters": {
      name: "Flap adjusters",
      category: "aero",
      summary: "The mechanisms that set the front flaps' angle at a pit stop; in 2009 and 2010 the driver could move them too.",
      details: [
        "A mechanic on each side fits a tool to the adjuster and turns it during a normal stop. More flap gives more front grip and cures understeer, at the cost of a little drag.",
        "In 2009 and 2010 the driver could also change the flap angle from the cockpit, by up to 6° and twice per lap, as an aid to following another car. It was dropped for 2011, when DRS arrived, and in the final rules only the rear wing may move on track.",
      ],
    },

    // --- Engine -------------------------------------------------------------
    "power-unit": {
      name: "Engine & KERS",
      category: "power",
      summary: "A 2.4-litre naturally aspirated V8 revving to 18,000 rpm, the last of its kind, with optional KERS.",
      details: [
        "The V8 arrived in 2006 and by 2009 it was frozen. Engines were homologated to their 2007 specification, with changes allowed for reliability and to mount KERS, so there was little power left to find.",
        "Each driver could use eight engines in a season, and a ninth meant ten places on the grid. Engines had to last, so the limit dropped from 19,000 to 18,000 rpm for 2009.",
        "With the engines equal, teams turned to what came out of the back of them: the fast hot gas in the **exhaust**.",
      ],
      specs: [
        ["Layout", "2.4 L, 90° V8"],
        ["Rev limit", "18,000 rpm (2008: 19,000)"],
        ["Induction", "Naturally aspirated"],
        ["Minimum mass", "95 kg"],
        ["Allocation", "8 engines per driver, per season"],
        ["Manufacturers", "Ferrari, Mercedes, Renault, Cosworth (2013)"],
      ],
      didYouKnow: "These were the last naturally aspirated engines in Formula 1; every car since 2014 has had a turbo.",
    },
    ice: {
      name: "V8 engine",
      category: "power",
      summary: "Eight cylinders in a 90° vee, making about 750 hp with no turbo.",
      details: [
        "The rules allow a bore of up to 98 mm and fix the cylinders 106.5 mm apart. Each has two inlet and two exhaust valves, and fuel is sprayed into the inlet port at up to 100 bar, not directly into the cylinder. Superchargers and variable valve timing are banned.",
        "The crankshaft must sit at least 58 mm above the reference plane, and the engine's centre of gravity at least 165 mm, so nobody can buy an advantage with an exotic low engine.",
      ],
      specs: [
        ["Layout", "90° V8, ≤98 mm bore"],
        ["Displacement", "2,400 cc"],
        ["Rev limit", "18,000 rpm"],
        ["Power", "About 750 hp"],
        ["Crankshaft", "≥58 mm above the reference plane"],
        ["Injection", "Into the inlet ports, ≤100 bar"],
      ],
      howItWorks: [
        "The falling piston draws air through the airbox, plenum and trumpet; fuel is sprayed in on the way.",
        "The rising piston compresses the mixture and a spark fires it.",
        "The expanding gas drives the piston and crankshaft, then the exhaust valves open and the gas leaves through the primaries.",
      ],
      didYouKnow: "At 18,000 rpm each piston changes direction 600 times a second, and the engine fires 1,200 times a second.",
    },
    plenum: {
      name: "Intake plenum & trumpets",
      category: "power",
      summary: "The carbon chamber over the engine that holds the air from the airbox, and the eight trumpets that feed the cylinders.",
      details: [
        "A carbon duct carries air from the airbox into the plenum, then each cylinder draws from it through an aluminium trumpet. The trumpet lengths are tuned so pressure waves arrive at the valves at the right moment, packing in a little more air.",
        "The rules ban variable-geometry inlets, so that length can't change as the engine revs.",
      ],
    },
    exhaust: {
      name: "Exhaust system",
      category: "power",
      summary: "Inconel pipes that gather each bank's four cylinders into a tailpipe, one each side, exiting high on the sidepods.",
      details: [
        "The primaries are made of Inconel, a nickel superalloy that keeps its strength at around 900 °C. Their lengths are tuned so the pressure pulses help empty each cylinder.",
        "From 2009 to 2011 teams aimed the exits low and blew the gas through the diffuser. Red Bull's **exhaust-blown diffuser** set the pace: engine maps kept gas flowing even with the driver off the throttle, so the floor made downforce all the way through a corner. The FIA restricted off-throttle blowing at the 2011 British Grand Prix, backed down a race later, and rewrote the rules for 2012.",
        "Since then the last 100 mm of each pipe must be a straight cylinder of no more than 75 mm bore, tilted up 10–30°, 250–600 mm above the reference plane and 200–500 mm from the centre line, and must end 500–1,200 mm ahead of the rear axle.",
      ],
      specs: [
        ["Material", "Inconel nickel superalloy"],
        ["Tailpipes", "Two, ≤75 mm bore"],
        ["Angle", "10–30° upward"],
        ["Exit", "500–1,200 mm ahead of the rear axle"],
      ],
      didYouKnow: "The crackle of the 2011 cars through slow corners was the engine being kept firing with the driver off the throttle, purely to keep the gas blowing.",
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
        "Blowing hot gas along the bodywork on purpose made this harder: the panels near the exhaust exits had to survive it too.",
      ],
    },

    // --- KERS ---------------------------------------------------------------
    ers: {
      name: "KERS",
      category: "hybrid",
      summary: "The Kinetic Energy Recovery System: a small optional hybrid that stores braking energy and gives it back as a boost.",
      details: [
        "Under braking a motor-generator charges a battery; on the straights the driver presses a button to get the energy back. The rules cap the flow at **60 kW**, in or out, and the energy released at **400 kJ** per lap: about 80 hp for just under seven seconds.",
        "KERS was never compulsory. Four teams raced it in 2009, none in 2010 by agreement, and most of the grid from 2011, when the minimum weight rose to make room for it.",
        "The system must shut down within two seconds of a master switch being pulled. A status light on top of the car shows green only when it is shut down and no insulation fault has been found, so that marshals know it is safe to touch.",
      ],
      specs: [
        ["Power", "≤60 kW (≈80 hp), in or out"],
        ["Release", "≤400 kJ per lap (≈6.7 s)"],
        ["Connection", "Rear drivetrain, ahead of the differential"],
        ["Status", "Optional"],
      ],
      howItWorks: [
        "Under braking the motor-generator is driven by the drivetrain and charges the battery.",
        "The control electronics store that energy, up to the 400 kJ a lap the car may release.",
        "On a straight the driver presses the boost button, and the motor adds up to 60 kW to the V8.",
      ],
      didYouKnow: "Lewis Hamilton's win at the 2009 Hungarian Grand Prix was the first by a car using KERS.",
    },
    "mgu-k": {
      name: "KERS motor-generator",
      category: "hybrid",
      summary: "A 60 kW electric machine geared into the drivetrain, working as a generator under braking and a motor under power.",
      details: [
        "A compact motor delivers 60 kW, about 80 hp. Run in reverse as a generator, it harvests energy every time the driver brakes.",
        "The rules let it join the rear drivetrain at any point ahead of the differential. In this model it is geared to the front of the V8, on the left.",
      ],
      specs: [
        ["Power", "≤60 kW, in or out"],
        ["Connection", "Ahead of the differential"],
      ],
    },
    "energy-store": {
      name: "KERS battery",
      category: "hybrid",
      summary: "The lithium-ion pack that holds the recovered energy; this model carries it under the fuel cell.",
      details: [
        "The first KERS cars of 2009 had to find room for lithium-ion cells on a chassis designed around refuelling, and heat and weight were a constant problem. The rules leave the location free. This model carries the pack inside the survival cell, under the fuel, where it is low and well protected.",
        "The cells must stay within a narrow temperature window to deliver full power and to last, so they need cooling of their own.",
      ],
      specs: [
        ["Chemistry", "Lithium-ion"],
        ["Location", "Free; here under the fuel cell"],
      ],
    },
    "control-electronics": {
      name: "KERS control electronics",
      category: "hybrid",
      summary: "The power electronics that manage energy between the battery and the motor-generator.",
      details: [
        "The battery stores direct current, but the motor needs precisely timed alternating current. The control electronics switch hundreds of amps thousands of times a second to convert between them, under the command of the FIA standard ECU.",
      ],
    },
    electronics: {
      name: "Control & data electronics",
      category: "electronics",
      summary: "The FIA Standard ECU that runs the car, and the accident data recorder.",
      details: [
        "Since 2008 every team has used the same FIA-supplied ECU and software, so the governing body can see and police how the car is controlled. Data streams back to the pit wall by telemetry throughout each session.",
      ],
    },
    ecu: {
      name: "FIA Standard ECU",
      category: "electronics",
      summary: "The single control unit, identical for every team, that runs the engine, gearbox, clutch, differential and KERS.",
      details: [
        "The ECU, built by McLaren Electronic Systems, turns the driver's throttle position into a torque demand on the engine. It runs the gearshifts and the KERS, and it is the only thing allowed to move the DRS flap.",
        "It also drives the cockpit signal lights and logs hundreds of sensor channels. Its arrival ended traction control, as the FIA could finally see that none was hidden in the software.",
      ],
    },
    adr: {
      name: "Accident data recorder",
      category: "electronics",
      summary: "The FIA's black box, bolted to the floor of the survival cell, that records every impact.",
      details: [
        "Accelerometers near the car's centre of gravity record the forces of any crash. The FIA uses the data to keep improving safety.",
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
        "The limit rose quickly in this era: 605 kg in 2009, 620 kg in 2010, 640 kg in 2011 and 642 kg in 2013, mainly to carry KERS, along with new safety parts.",
      ],
      specs: [
        ["Minimum mass", "642 kg without fuel (2009: 605 kg)"],
        ["Axle minimum", "Front ≥292 kg, rear ≥343 kg, in qualifying"],
      ],
    },

    // --- Cooling ------------------------------------------------------------
    cooling: {
      name: "Cooling system",
      category: "cooling",
      summary: "Radiators that reject the V8's heat through the sidepods.",
      details: [
        "A V8 turns less than a third of its fuel energy into power; most of the rest must leave through the coolant, the oil and the exhaust. With no turbo or big battery to cool, these cars needed far less radiator than the hybrids that followed, so their sidepods stayed small.",
        "Bigger radiators mean bigger sidepods and more drag, so teams trade cooling against speed. The rules allow no louvres ahead of the rear axle, so hot air leaves through the exit at the back of the bodywork, which teams open up at hot races.",
      ],
      specs: [["Coolant pressure", "≤3.75 bar"]],
    },
    radiators: {
      name: "Radiators",
      category: "cooling",
      summary: "Inclined cores in the sidepods: water on one side, oil on the other.",
      details: [
        "Air from the sidepod inlet passes through fine aluminium fins between flat tubes carrying hot coolant or oil. Leaning the cores lets a tall core fit inside a low sidepod.",
      ],
      specs: [
        ["Core", "Brazed aluminium fins and tubes"],
        ["Fed by", "Sidepod inlets"],
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
        "The casing has to be stiff, because any flex would let the rear suspension move. It also has to be slim, so air can flow past it to the diffuser and beam wing.",
        "Each gearbox had to last five consecutive events (four in 2009 and 2010); changing it early cost the driver five places on the grid.",
        "Use **X-ray** or explode the car to see the gear cluster inside.",
      ],
    },
    "gear-cluster": {
      name: "Gear cluster",
      category: "drivetrain",
      summary: "Seven forward gears and a reverse, shifted in milliseconds by a seamless-shift system.",
      details: [
        "A **seamless-shift** gearbox engages the next gear before releasing the current one, so there is almost no break in drive. Automatic changes are banned: the driver calls for every shift with a paddle.",
        "The gears must be steel, and from 2010 a team could use only 30 pairs of ratios in a season, declared at the first race.",
      ],
      specs: [
        ["Forward gears", "7, plus reverse"],
        ["Ratio pairs", "30 per season (from 2010)"],
      ],
    },
    clutch: {
      name: "Clutch",
      category: "drivetrain",
      summary: "A small multi-plate carbon clutch in the bellhousing, used mainly for starts and pit stops.",
      details: [
        "Carbon plates barely larger than a hand handle hundreds of kilowatts. The driver works the clutch only with paddles on the steering wheel. Once moving, the seamless gearbox shifts without opening it.",
        "If a car stops with its engine dead, a switch marked **N** on top of the tub frees the clutch for at least 15 minutes, so marshals can push it. The same switch shuts down the KERS.",
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
        "The joints at each end let the shaft keep turning smoothly as the suspension moves. In the low gears each shaft carries well over 1,000 Nm.",
      ],
    },
    "rear-impact": {
      name: "Rear impact structure",
      category: "safety",
      summary: "A tapered carbon box behind the gearbox that crushes to absorb a rear impact.",
      details: [
        "Like the nose, the structure is designed to crush progressively; it must stop a 780 kg object at 11 m/s. Its rear face is centred 300 mm above the reference plane, at least 575 mm behind the rear axle.",
        "It also carries the rain light and the rear jacking point.",
      ],
      specs: [["Crash test", "780 kg at 11 m/s"]],
    },
    "rain-light": {
      name: "Rain light",
      category: "safety",
      summary: "A bright red light on the crash structure that makes the car visible in spray.",
      details: [
        "The driver switches it on from the cockpit in wet conditions, so following drivers can see the car through the spray. It must face straight back, 300 mm above the reference plane and at least 595 mm behind the rear axle.",
      ],
      specs: [["Height", "300 mm above the reference plane"]],
    },

    // --- Rear wing ----------------------------------------------------------
    "rear-wing": {
      name: "Rear wing",
      category: "aero",
      summary: "A tall, narrow two-element wing between huge endplates, with the DRS flap on top and a beam wing below.",
      details: [
        "The rear wing makes downforce for the rear axle. The 2009 rules made it tall and narrow, to lift its wake clear of a following car: it had been a metre wide and no higher than 800 mm, and now its profiles fit within ±355 mm of the centre line, 730–950 mm up, between the axle and 350 mm behind it.",
        "Lower down, the **beam wing** bridges the endplates just above the diffuser exit.",
        "The upper element is the **DRS** flap. Press **DRS** in the toolbar (or **A**) to open it.",
      ],
      specs: [
        ["Elements", "Mainplane + DRS flap, plus beam wing"],
        ["Span", "≤710 mm (2008: 1,000)"],
        ["Height", "730–950 mm above the reference plane"],
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
      summary: "The upper element, which opens on the straights to cut drag: the Drag Reduction System, new in 2011.",
      details: [
        "When the driver opens DRS, a hydraulic actuator lifts the flap's leading edge, pivoting it about a fixed axis near the top rear corner of the wing. The slot to the mainplane opens from 10–15 mm to as much as 50 mm, and the wing stops making much downforce or drag. Touching the brakes closes it.",
        "Teams soon used the moving flap for more. Mercedes' **double DRS** let the flap open a duct that stalled the front wing as well, until the 2013 rules said DRS may not change the geometry of any duct.",
      ],
      specs: [
        ["Slot gap", "10–15 mm closed, ≤50 mm open"],
        ["Width", "≥708 mm"],
      ],
      howItWorks: [
        "At a detection point before the straight, the timing system checks the gap to the car ahead.",
        "Under one second behind, after the first two laps of a race, the driver may open the flap in the following DRS zone.",
        "The flap closes when the driver brakes or presses the button again. In practice and qualifying any car may use it: anywhere on the lap until 2012, only in the zones from 2013.",
      ],
      didYouKnow: "DRS followed McLaren's 2010 F-duct, which stalled the rear wing when the driver covered a hole in the cockpit with a knee. It was banned for 2011, and the rules still outlaw using driver movement to change the aerodynamics.",
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
    "beam-wing": {
      name: "Beam wing",
      category: "aero",
      summary: "A small low wing between the endplates, just above the diffuser exit; these were its last years until 2022.",
      details: [
        "The beam wing adds a little downforce of its own, but its main job is to help the diffuser. The low pressure under it draws air up and out of the diffuser's exit, which makes the whole floor work harder.",
        "It may be a single section, 150–350 mm behind the rear axle, 300–400 mm up and 75–355 mm from the centre line. Red Bull's pull-rod rear suspension was designed to clear the air on its way to this wing.",
        "The rules banned it for 2014, and it stayed gone until the ground-effect cars of 2022.",
      ],
      specs: [
        ["Sections", "One"],
        ["Height", "300–400 mm above the reference plane"],
      ],
    },
    "rw-pylon": {
      name: "Rear wing pillar",
      category: "aero",
      summary: "A slender central support that carries the wing's load down into the gearbox.",
      details: [
        "The pillar carries the wing's load, several hundred kilograms at high speed. Between 600 and 730 mm up it may have no more than two sections, 5,000 mm² in all and each no more than 25 mm thick, which limits its disturbance to the airflow under the wing. This model uses a single blade.",
      ],
    },
    "rw-actuator": {
      name: "DRS actuator",
      category: "aero",
      summary: "The hydraulic actuator that opens and closes the DRS flap.",
      details: [
        "A small hydraulic ram drives the flap through a linkage. Only a direct command from the driver, passed through the standard ECU, can move it, and if the system fails the flap must return to its closed, high-downforce position.",
      ],
    },

    // --- Bodywork -----------------------------------------------------------
    bodywork: {
      name: "Bodywork",
      category: "aero",
      summary: "The engine cover and sidepods: smooth, removable shells, swept clean of winglets by the 2009 rules.",
      details: [
        "The bodywork encloses the engine, feeds air to the radiators and guides the flow toward the diffuser and rear wing.",
        "After 2008's clutter of chimneys and winglets, the rules asked for clean shapes. Between the cockpit and the rear axle every cross section must form one smooth curve with no radius under 75 mm, with no openings except for the exhausts and suspension.",
        "Use **X-ray** to see through it to the engine and radiators.",
      ],
    },
    "engine-cover": {
      name: "Engine cover",
      category: "aero",
      summary: "The tapering cover over the V8, with a slim spine falling toward the rear wing.",
      details: [
        "From the side, the cover must fill an area that falls from 925 mm high, 1,000 mm ahead of the rear axle, to 550 mm just ahead of it; anything above that may be no more than 125 mm wide. The cover then narrows into the **coke bottle**.",
        "In 2009 and 2010 teams stretched it into a tall fin that reached the rear wing. A 730 mm height limit near the axle ended that for 2011, which is why the spine now stops short of the wing.",
        "Near the rear axle the bodywork must stay low: outside ±375 mm it may be no higher than 500 mm in the last 800 mm, and 300 mm in the last 400.",
      ],
    },
    "coanda-ramps": {
      name: "Coanda exhaust ramps",
      category: "aero",
      summary: "Curved ramps on the sidepods that bend the exhaust gas back down to the floor.",
      details: [
        "The 2012 exhaust rules were written to stop gas reaching the diffuser: the tailpipes must point upward and end well ahead of the rear axle. Teams answered with the **Coanda effect**, the tendency of a fast jet of gas to cling to a curved surface beside it.",
        "Ramps sculpted into the sidepods bent the jet back down into the gap between the floor and the rear tyre, where it sealed the edge of the diffuser. McLaren used a bulge with a ramp on it; Red Bull and Lotus ran the gas through a tunnel beneath the bodywork.",
        "The rules keep a narrow cone behind each exit clear of bodywork as far as the rear axle, so the ramps have to curve away just beneath it. The trick ended for 2014, when the exhaust moved to the very back of the car.",
      ],
      specs: [["Years", "2012–2013"]],
      howItWorks: [
        "The tailpipe blows a hot, fast jet rearward, tilted slightly upward.",
        "The jet clings to the curved ramp below it and turns down with it.",
        "It reaches the floor edge just ahead of the rear tyre and blocks the tyre's turbulent wake from getting under the diffuser.",
      ],
    },
    sidepods: {
      name: "Sidepods",
      category: "aero",
      summary: "The small pods either side of the driver that house the radiators and undercut sharply toward the floor.",
      details: [
        "The inlets swallow air for the radiators, and the outside shape decides how the rest flows past. The rules set no inlet height, but above 600 mm nothing may be more than 300 mm from the centre line, apart from the mirrors.",
        "With only a V8 to cool, the pods could be tight and short. Their rear falls away sharply into the coke bottle, and from 2012 the top carries the exhaust exits and ramps.",
      ],
    },

    // --- Floor --------------------------------------------------------------
    floor: {
      name: "Floor",
      category: "aero",
      summary: "A flat floor with a 50 mm step, narrow ahead of the sidepods, with the diffuser behind the rear axle.",
      details: [
        "Seen from below, everything from 330 mm behind the front axle to the rear axle must lie on one of two flat planes: the reference plane along the middle, where the plank is, or the **step plane** 50 mm above it.",
        "Ahead of the sidepods the floor stays narrow: the rules keep a zone around the front wheels clear of bodywork, so the full ±700 mm floor starts only beside the sidepods. Red Bull pushed **rake**, running the rear of the car far higher than the front, to make the floor work harder.",
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
        "The underside is flat: a keel at least 300 mm wide on the reference plane, carrying the plank, with the step plane 50 mm higher on either side. Enclosed holes were allowed only near the front. From 2011, further back, any slice through the floor had to be one continuous line, which closed the holes the double diffuser had used.",
        "Ahead of the floor, the **tea tray** juts forward under the chassis. The rules keep it at least 100 mm off the ground, rising to 200 mm at the front. In a test it may flex no more than 5 mm under 2,000 N, to stop it being sprung down at speed.",
      ],
    },
    bargeboards: {
      name: "Bargeboards & turning vanes",
      category: "aero",
      summary: "The few small vanes left after the 2009 rules cleared the space between the front wheels and the sidepods.",
      details: [
        "By 2008 the cars carried big bargeboards and clusters of winglets. The FIA's Overtaking Working Group saw them as a source of wake, and the 2009 rules cleared them out: seen from above, the zone around the front wheels must be empty, apart from the brake ducts and mirrors.",
        "That left turning vanes under the chassis, one angled board in the small triangle the rules leave beside it, and small vanes at the sidepods' leading edge. Together they turn the front tyres' wake away from the floor.",
      ],
    },
    "floor-stays": {
      name: "Floor stays",
      category: "aero",
      summary: "Slim stays that stop the edges of the floor flexing at speed.",
      details: [
        "Under the load of the airflow the wide, thin floor would bend, changing how close its edges run to the track. Stays from the chassis hold the edges in place, and an FIA test allows no more than 10 mm of movement under 500 N.",
      ],
    },
    diffuser: {
      name: "Diffuser",
      category: "aero",
      summary: "The rising tail of the floor behind the rear axle, the battleground of this era.",
      details: [
        "Air under the floor has to return to normal speed and pressure before it leaves the car. The diffuser's expanding shape does this gradually, which lets the air under the car run faster in the first place.",
        "In 2009 Brawn, Toyota and Williams found that holes in the step plane could feed a second deck: the **double diffuser**. The FIA's International Court of Appeal cleared it that April and everyone copied it. The rules closed it for 2011, and cut the roof from 175 to 125 mm.",
        "Until 2011 the exhaust gas blew through it too, which kept it working even off the throttle.",
      ],
      specs: [
        ["Start", "At the rear axle"],
        ["Exit", "350 mm behind the axle, ≤125 mm high, ≤1,000 mm wide"],
        ["2009–10", "≤175 mm high, double decks"],
      ],
      didYouKnow: "Brawn GP, built from the remains of Honda's team, won both titles in 2009, its only season.",
    },
    plank: {
      name: "Plank",
      category: "chassis",
      summary: "A 300 mm wide skid board under the floor that stops teams running the car dangerously low.",
      details: [
        "Running lower makes more downforce, so teams are tempted to scrape the floor along the track. The plank polices that: it must be 10 mm thick, give or take 1 mm, so after the race it must still measure at least 9 mm. It is checked at six of its seven holes.",
        "It is made of a uniform material with a specific gravity of 1.3 to 1.45, and held on by metal fasteners of no more than 2,000 mm² each. The titanium skids of later years came only in 2015.",
      ],
      specs: [
        ["Size", "300 mm wide, 10 ± 1 mm thick"],
        ["Length", "From 330 mm behind the front axle to the rear axle"],
        ["Fasteners", "≤40,000 mm² in all"],
      ],
    },

    // --- Suspension ---------------------------------------------------------
    "front-suspension": {
      name: "Front suspension",
      category: "suspension",
      summary: "Wishbones, push-rods and steering that hold the front wheels at precisely controlled angles.",
      details: [
        "Each wheel is located by six members: two wishbones (four legs), a push-rod, and a track rod for steering. In 2013 Ferrari and McLaren used pull-rods at the front; everyone else used push-rods.",
        "Teams also linked the axles hydraulically, with front-to-rear interconnected suspension (**FRIC**), to keep the car level for the floor. It stayed legal through this era, and was ruled out in 2014.",
      ],
      didYouKnow: "Lotus built a reactive ride-height system that used braking torque to hold the car's nose up. The FIA ruled it out in January 2012, before it could race.",
    },
    "fs-wishbones": {
      name: "Front wishbones",
      category: "suspension",
      summary: "Upper and lower A-shaped arms that let the wheel move up and down while controlling its camber.",
      details: [
        "The legs are hollow carbon tubes with aerofoil sections, so they work as small aero devices too, though the rules limit each section's aspect ratio to 3.5:1. Their geometry sets how the wheel tilts as it rises, and how much the car's nose dives under braking.",
        "Wheel tethers inside the legs keep the wheel attached to the car in a crash. Each wheel has had two since 2011, and no leg may hold more than one.",
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
      summary: "Rockers, torsion bars and dampers packed into the top of the chassis.",
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
        "Their shapes and angles are tuned for the aerodynamics around the diffuser and beam wing as much as for mechanics.",
      ],
    },
    "rs-pushrods": {
      name: "Rear pull-rods",
      category: "suspension",
      summary: "Rods from the top of each upright down to rockers low on the gearbox.",
      details: [
        "A pull-rod works in tension: when the wheel rises it pulls the rocker instead of pushing it. That puts the springs and dampers low on the gearbox, lowering the car's centre of gravity and leaving the space above clear for the airflow to the beam wing. Red Bull revived the layout on its 2009 car, and by 2013 every team had followed.",
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
      details: ["The rear tyres carry the V8's drive and the blown floor's downforce, and keeping them alive through a stint was often what decided these races."],
    },
    "front-tyres": {
      name: "Front tyres",
      category: "wheels",
      summary: "13-inch slicks, back after eleven seasons of grooved tyres.",
      details: [
        "F1 had used grooved tyres since 1998 to slow the cars. Slicks returned in 2009 with the new aero rules, putting more rubber on the road to give back mechanical grip as the downforce was cut.",
        "Bridgestone supplied the grid until 2010, narrowing the fronts from 270 to 245 mm that year. Pirelli took over in 2011 and was asked to build tyres that wear quickly, to force more pit stops.",
        "The coloured band shows the compound: red is the super-soft.",
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
      summary: "13-inch magnesium rims with a single centre-lock nut and no covers.",
      details: [
        "Each wheel is fixed by one central nut so a pit crew can change all four in a few seconds. In 2009 several teams fitted fairings over their wheels; they were banned for 2010, so the spokes and the brake drum behind them stay visible.",
      ],
      specs: [
        ["Material", "AZ70 or AZ80 magnesium alloy"],
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
        ["Tethers", "2 per wheel (from 2011)"],
      ],
    },
    "front-brakes": {
      name: "Front brakes",
      category: "wheels",
      summary: "Carbon-carbon discs gripped by aluminium calipers, slowing the car at more than 5 g.",
      details: [
        "Carbon-carbon discs run at 400–1,000 °C and get stronger, not weaker, as they heat up. Hundreds of small radial holes pump air through each disc to control its temperature.",
        "The rules ban anti-lock systems and power assistance: the pressure in the calipers comes only from the driver's foot.",
      ],
      specs: [
        ["Disc", "≤278 mm diameter, ≤28 mm thick"],
        ["Caliper", "Aluminium, up to 6 pistons"],
      ],
    },
    "rear-brakes": {
      name: "Rear brakes",
      category: "wheels",
      summary: "Smaller rear discs, sharing the work with KERS on a car that uses it.",
      details: [
        "When KERS harvests, it slows the rear wheels too, so the rear brakes do less work. With no brake-by-wire to blend the two until 2014, the balance could shift, and drivers trimmed it from the steering wheel.",
      ],
      specs: [["Control", "Fully hydraulic"]],
    },
    "front-ducts": {
      name: "Front brake ducts",
      category: "cooling",
      summary: "Carbon scoops and drums that feed cooling air to the brakes.",
      details: [
        "The inlet scoop picks up air on the inside of the wheel. The drum around the disc channels it through the disc's holes and out. The rules keep them within 120 mm inboard of the rim and 160 mm above or below the axle.",
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
  },
};
