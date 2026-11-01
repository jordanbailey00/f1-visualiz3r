import type { CarInfo } from "../types";

/**
 * The 2006–2008 car. Figures come from the FIA Formula One Technical
 * Regulations of those years (the 22 February 2008 issue unless noted) and the
 * Sporting Regulations; the model is a generic car built to the 2008 rules,
 * not any one team's design.
 */
export const car2006: CarInfo = {
  id: "2006",
  name: "V8 aero clutter",
  shortName: "2006",
  years: "2006–2008",
  model: "Generic 2006–2008-regulation car, to the 2008 rules (not any one team's design)",
  tagline: "2.4-litre V8s under a forest of winglets and flip-ups.",
  intro: [
    "These are some of the busiest-looking cars F1 has ever raced. The rules set where bodywork could go, but said little about how many pieces could fill that space, so by 2008 the cars had sprouted **bargeboards, flip-ups, chimneys, horn wings and bridge wings**. Each one earned a little downforce; together they left a turbulent wake that made it hard to follow another car.",
    "Underneath, 2006 brought **2.4-litre V8s** in place of 3-litre V10s. They revved past 20,000 rpm until a 19,000 rpm limit and a development freeze arrived for 2007. Cars **refuelled** during races, so tanks were small and wheelbases short, and they ran on **grooved tyres**, with four channels cut into the tread to slow them down.",
    "For 2008 a standard ECU ended traction control, and it was the last year of this kind of car: the 2009 rules swept nearly all of this away. Press **Explode** to take the car apart layer by layer, and click any part to learn what it does.",
  ],
  specs: [
    ["Width", "1,800 mm including tyres"],
    ["Wheelbase", "No limit; about 3.1 m"],
    ["Minimum mass", "605 kg with driver"],
    ["Engine", "2.4 L V8, naturally aspirated"],
    ["Rev limit", "19,000 rpm (from 2007)"],
    ["Fuel", "Refuelled in the race, ≤12.1 L/s"],
    ["Aero", "Bargeboards, flip-ups, chimneys, bridge wing"],
    ["Tyres", "13-inch Bridgestone with four grooves"],
  ],
  camera: { position: [3700, 2000, 4300], target: [0, 350, 0] },
  size: 4900,
  parts: {
    // --- Survival cell ------------------------------------------------------
    chassis: {
      name: "Survival cell",
      category: "chassis",
      summary: "The carbon-fibre tub that holds the driver and the fuel, and carries every other part of the car.",
      details: [
        "Everything on the car is bolted to the survival cell. The front suspension, nose and steering are mounted on it, and the V8 is bolted directly to its rear face as a stressed member. The gearbox and rear suspension hang off the back of the engine.",
        "A car that stops for fuel never has to carry a whole race's worth, so the tub behind the driver stayed short. Wheelbases were about 3.1 m, around 300 mm less than the cars of 2013.",
        "These rules set no ceiling on the tub, so it runs high and level from the cockpit to the front bulkhead, which keeps the nose up and leaves room for air underneath.",
      ],
      specs: [
        ["Material", "Carbon-fibre composite with honeycomb core"],
        ["Contains", "Driver, fuel cell"],
        ["Front bulkhead", "≥1,800 mm ahead of the cockpit rear"],
      ],
    },
    monocoque: {
      name: "Carbon monocoque",
      category: "chassis",
      summary: "A one-piece carbon-fibre tub: stiff, light, and built to stop anything reaching the driver.",
      details: [
        "\"Monocoque\" means the skin itself is the structure, with no frame inside. Layers of carbon-fibre fabric are laid into a mould around an aluminium honeycomb core, then cured under heat and pressure in an autoclave. The result is far stiffer than steel for its weight.",
        "Beside the driver, panels of **Zylon**, a fibre stronger than Kevlar, are bonded to the sides so that sharp debris or another car's nose cannot pierce the cockpit. They must be at least 6.2 mm thick, and the rules fix their lay-up: 16 plies of Zylon and two of carbon.",
        "Use **X-ray** to see the fuel cell packed inside.",
      ],
      specs: [
        ["Construction", "Carbon/epoxy skins over aluminium honeycomb"],
        ["Side panels", "≥6.2 mm of Zylon and carbon"],
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
      summary: "A high, slender crushable cone, with the front wing slung beneath it on two long pylons.",
      details: [
        "The nose is a hollow carbon cone designed to crush progressively; it must stop a 780 kg trolley at 15 m/s.",
        "Nothing in these rules kept it low, so designers lifted it as high as they could, to send as much air as possible under the car and into the bargeboards.",
      ],
      specs: [
        ["Crash test", "780 kg at 15 m/s"],
        ["Reach", "≤1,200 mm ahead of the front axle, inside ±200 mm"],
      ],
      didYouKnow: "Ferrari's F2008 had a nose hole: a duct through the cone that vented high-pressure air from above the front wing.",
    },
    "roll-structure": {
      name: "Roll structure & airbox",
      category: "safety",
      summary: "The hoop above the driver's head that protects them if the car flips; it is also the engine's air intake.",
      details: [
        "If the car turns over, this structure and a second hoop ahead of the driver keep a survival space around the driver's head. It must reach at least 940 mm above the reference plane, 30 mm behind the cockpit, and survive a load of 50 kN sideways, 60 kN rearwards and 90 kN downwards. A slot through it takes a strap, so a stranded car can be lifted quickly.",
        "The opening at the front is the airbox. With no turbo to compress the air, the V8 gains a little from the car's speed, which rams air down the duct.",
      ],
      specs: [
        ["Height", "≥940 mm above the reference plane"],
        ["Load test", "50 kN sideways, 60 kN rearwards, 90 kN down"],
      ],
    },
    "fuel-cell": {
      name: "Fuel cell",
      category: "power",
      summary: "A puncture-resistant rubber bladder behind the driver, sized for a stint rather than a race.",
      details: [
        "The fuel sits in a flexible bag of Kevlar-reinforced rubber, built to the FIA's FT5 standard. It can deform in a crash without splitting. All of it must lie between the driver's back and the front of the engine.",
        "Races were run in stints between fuel stops, so how much fuel a car carried was the heart of strategy. For 2008 a car had to start the race on the fuel it finished qualifying with, which ended the old laps of burning fuel off late in the session.",
      ],
      specs: [
        ["Standard", "FIA FT5 safety bladder"],
        ["Race fuel", "No limit; refuelled at stops"],
      ],
      didYouKnow: "From 2008 at least 5.75% of F1 fuel had to come from biological sources.",
    },
    refuelling: {
      name: "Refuelling connector",
      category: "power",
      summary: "The flap and connector for the fuel rig, on the right of the tub in this model.",
      details: [
        "At a stop, a mechanic pushed the rig's hose onto this connector while the wheels were changed. The rules cap the flow at **12.1 litres a second**, and every team's rig comes from one FIA-designated maker, so the length of a stop came down to how much fuel went in.",
        "A cover must stay closed over the connector whenever the car is on track. The fuel may not be chilled more than 10 °C below the air temperature, as colder fuel would pack more energy into the same space.",
        "Refuelling during races was banned for 2010, which is why the cars that followed grew so much longer.",
      ],
      specs: [
        ["Flow rate", "≤12.1 litres per second"],
        ["Banned", "From 2010"],
      ],
    },
    cockpit: {
      name: "Cockpit",
      category: "cockpit",
      summary: "The driver's workspace: a moulded seat, the steering wheel and energy-absorbing padding.",
      details: [
        "The driver lies back with their feet higher than their hips, so the car can be as low as possible. Strapped in and fully kitted, the driver must be able to remove the steering wheel and climb out within **5 seconds**, then refit the wheel within 10 seconds in total.",
        "The 605 kg limit includes the driver, so every kilogram of driver left a kilogram less ballast for the team to place.",
      ],
      specs: [["Exit test", "Out in 5 s; wheel refitted within 10 s"]],
    },
    seat: {
      name: "Driver's seat",
      category: "cockpit",
      summary: "A thin carbon shell moulded to the individual driver's body.",
      details: [
        "Each seat is made by pouring expanding foam around the driver while they sit in position, then copying the shape in carbon fibre. A close fit spreads cornering and braking loads over the body and lets the driver feel what the car is doing.",
        "It may be held by no more than two bolts, so a medical team can lift it out with the driver still strapped in.",
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
      summary: "A carbon control panel with a display, shift paddles and rotary switches.",
      details: [
        "The wheel carries the shift paddles, the clutch paddles used at the start, and buttons and rotary switches for the radio, drinks, pit-lane limiter, brake balance, differential and engine settings. It comes off with a pull on a flange behind it.",
        "Traction control was legal from the 2001 Spanish Grand Prix to the end of 2007. Its ban for 2008 put wheelspin back under the driver's right foot.",
      ],
      specs: [
        ["Controls", "Paddles, buttons and rotary switches"],
        ["Display", "Gear, lap time, fuel, warnings"],
      ],
    },
    headrest: {
      name: "Headrest & cockpit padding",
      category: "safety",
      summary: "Energy-absorbing foam around the driver's head and shoulders.",
      details: [
        "Three areas of padding use a foam that compresses slowly under impact, which limits how fast the head can move in a crash. The pad behind the head must be 75–90 mm thick, and the side pads at least 95 mm.",
        "It lifts out as one piece, without tools, so marshals can reach the driver.",
      ],
    },
    pedals: {
      name: "Pedal box",
      category: "cockpit",
      summary: "Brake and throttle pedals in the footwell; F1 drivers brake with the left foot.",
      details: [
        "There is no clutch pedal: the clutch is worked by paddles on the steering wheel. The brake pedal drives two master cylinders, one per circuit. The single throttle pedal is the driver's only control of the engine's throttles, and it may have no detent to help hold a position.",
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
      summary: "An FIA-approved extinguisher, discharging into the cockpit and the engine bay.",
      details: [
        "It must empty 95% of its contents in 10 to 30 seconds, and keep working if the car's main electrics have failed. Both the driver and marshals can fire it: the external trigger is combined with the circuit-breaker switch.",
      ],
    },
    "cockpit-lights": {
      name: "Cockpit & warning lights",
      category: "safety",
      summary: "Red, blue and yellow track-signal lights in front of the driver, and the medical warning light on top of the tub.",
      details: [
        "Lights in the driver's line of sight repeat track signals: yellow for danger, blue for a faster car behind, red for a stopped session.",
        "Recessed into the top of the survival cell is the **medical warning light**, wired to the FIA data logger. After a crash it shows rescue crews at a glance how violent the impact was.",
      ],
    },
    mirrors: {
      name: "Mirrors",
      category: "cockpit",
      summary: "Rear-view mirrors on stalks beside the cockpit.",
      details: [
        "Each glass must be at least 150 × 50 mm, at least 250 mm from the centre line and no more than 750 mm ahead of the cockpit's rear edge. Each may cover no more than 12,000 mm² seen from above, so it can't double as a wing.",
        "To prove they work, the driver must read letters on boards 10 m behind the car.",
      ],
      specs: [["Glass", "≥150 × 50 mm"]],
    },
    "side-impact": {
      name: "Side impact structures",
      category: "safety",
      summary: "Crushable structures in the sidepods that absorb a side impact before it reaches the tub.",
      details: [
        "An impact structure is fixed to each side of the survival cell, between the two roll hoops. In the FIA test it must stop a 780 kg object at 10 m/s, striking 300 mm above the reference plane and 500 mm ahead of the cockpit's rear edge.",
      ],
      specs: [["Crash test", "780 kg at 10 m/s"]],
    },
    cameras: {
      name: "On-board cameras",
      category: "electronics",
      summary: "The TV cameras and dummy housings every car must carry, in positions the FIA fixes.",
      details: [
        "A car has five camera positions and must always carry two cameras or housings, one of them in the position on top of the roll hoop. Housings must match a real camera's size and weight, so the choice never changes the car's balance.",
      ],
    },

    // --- Front wing ---------------------------------------------------------
    "front-wing": {
      name: "Front wing",
      category: "aero",
      summary: "A 1,400 mm wing, held high at its ends and dipping low in the middle under the nose.",
      details: [
        "Outside ±250 mm of the centre line, everything ahead of the front wheels must stay 150–350 mm above the reference plane; inside it, bodywork may drop to 50 mm. So the wing arches down into a low spoon in the middle, the only part allowed near the ground.",
        "At 1,400 mm wide, its tips sit in front of the tyres, not outside them, so it can't steer air around them the way later wings could.",
        "For 2009 this design was replaced by one 1,800 mm wide and much lower, as the rules tried to make cars less sensitive to the wake of the car ahead.",
      ],
      specs: [
        ["Span", "≤1,400 mm"],
        ["Height", "150–350 mm (from 50 mm in the middle)"],
        ["Reach", "≤900 mm ahead of the axle, outside ±200 mm"],
        ["Flex test", "≤5 mm under 500 N"],
      ],
    },
    "fw-mainplane": {
      name: "Front mainplane",
      category: "aero",
      summary: "The lowest element of the wing, with its spoon-shaped centre, and the pylons that carry it.",
      details: [
        "Running close to the ground, the mainplane benefits from **ground effect**: the air speeds up in the narrow gap under it, lowering the pressure and pulling the wing down harder than it would in free air. That is why the low middle section matters so much.",
        "Two long pylons carry the wing up to the high nose.",
      ],
    },
    "fw-flaps": {
      name: "Front flaps",
      category: "aero",
      summary: "The flaps stacked above the mainplane, working either side of the nose.",
      details: [
        "Each flap sits behind and above the element in front, with a narrow slot between them. Fast air from each slot keeps the flow attached to the next element, which lets the stack run steep angles without stalling.",
      ],
      howItWorks: [
        "Each element is an upside-down aerofoil: the air travelling under it speeds up and its pressure drops.",
        "The pressure difference between the upper and lower surfaces pushes the wing toward the track.",
        "More flap angle means more front downforce, which makes the car turn in more sharply.",
      ],
    },
    "fw-bridge": {
      name: "Bridge wing",
      category: "aero",
      summary: "A small extra element arching across the middle of the wing, under the nose tip.",
      details: [
        "The height limit on the front wing applies only outside ±250 mm, so the space under the nose was free. McLaren filled it with this element on the MP4-22, racing it from the 2007 Spanish Grand Prix, and it joined the two inner ends of the flaps.",
        "The idea spread: BMW's 2008 wing looked much the same. The 2009 rules ended it by fixing the middle of the wing to one FIA profile.",
      ],
      didYouKnow: "McLaren first tried its bridge wing in a private aerodynamic test at an airstrip in Menorca.",
    },
    "fw-endplates": {
      name: "Front endplates",
      category: "aero",
      summary: "Plain plates on the 1,400 mm limit, with strakes under the wing.",
      details: [
        "An open wing tip lets high-pressure air spill round into the low-pressure side, wasting downforce and creating a tip vortex. The endplate limits that spillage.",
        "The plates must stop 350 mm ahead of the axle, so the wheels can steer behind them, and their outer skins must be made of materials that contain debris in an accident.",
      ],
      specs: [["Position", "±700 mm at most"]],
    },
    "fw-adjusters": {
      name: "Flap adjusters",
      category: "aero",
      summary: "The mechanisms that set the front flaps' angle, turned by hand at a pit stop.",
      details: [
        "A mechanic on each side fits a tool to the adjuster and turns it during a normal stop; nothing on the wing may move while the car is running. More flap gives more front grip and cures understeer, at the cost of a little drag.",
      ],
    },

    // --- Engine -------------------------------------------------------------
    "power-unit": {
      name: "Engine",
      category: "power",
      summary: "A 2.4-litre V8, new for 2006, revving to 19,000 rpm, with no hybrid system at all.",
      details: [
        "The V8s replaced 3-litre V10s in 2006. Toro Rosso alone was allowed a rev-limited V10 that season, and switched to V8s for 2007.",
        "The fastest 2006 engines ran past 20,000 rpm. For 2007 a 19,000 rpm limit arrived and development was frozen at a late-2006 specification, with one final re-tune of a short list of parts.",
        "Each engine had to last two race weekends; an early change cost ten places on the grid.",
      ],
      specs: [
        ["Layout", "2.4 L, 90° V8"],
        ["Rev limit", "19,000 rpm (from 2007)"],
        ["Induction", "Naturally aspirated"],
        ["Power", "About 750 hp"],
        ["Minimum mass", "95 kg"],
        ["Life", "Two events per engine"],
      ],
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
        ["Rev limit", "19,000 rpm"],
        ["Crankshaft", "≥58 mm above the reference plane"],
        ["Injection", "Into the inlet ports, ≤100 bar"],
      ],
      howItWorks: [
        "The falling piston draws air through the airbox, plenum and trumpet; fuel is sprayed in on the way.",
        "The rising piston compresses the mixture and a spark fires it.",
        "The expanding gas drives the piston and crankshaft, then the exhaust valves open and the gas leaves through the primaries.",
      ],
      didYouKnow: "At 19,000 rpm each piston changes direction more than 630 times a second.",
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
      summary: "Inconel pipes that rise through the bodywork as periscopes, blowing the hot gas up and over the rear of the car.",
      details: [
        "The primaries are made of Inconel, a nickel superalloy that keeps its strength at around 900 °C. Their lengths are tuned so the pressure pulses help empty each cylinder.",
        "These rules put no limit on where the exhaust leaves the car. Ferrari's 1998 F300 brought the exits up through the top of the bodywork, and by this era that was the normal place for them: the gas stays clear of the floor, where its on-off flow would upset the car under braking and acceleration.",
      ],
      specs: [
        ["Material", "Inconel nickel superalloy"],
        ["Exits", "Two, through the top of the bodywork"],
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
    electronics: {
      name: "Control & data electronics",
      category: "electronics",
      summary: "The FIA Standard ECU that runs the car, and the accident data recorder.",
      details: [
        "For 2008 every team had to adopt the same FIA-specified ECU and software, so the governing body could see and police how the car was controlled. Before that, each team ran its own.",
      ],
    },
    ecu: {
      name: "FIA Standard ECU",
      category: "electronics",
      summary: "The single control unit, identical for every team from 2008, that runs the engine, gearbox, clutch and differential.",
      details: [
        "McLaren Electronic Systems and Microsoft won the FIA's tender to supply it. It may only run FIA-approved software, and every sensor and actuator connected to it is homologated and sealed.",
        "Its arrival ended traction control, launch control and engine-braking aids, because the FIA could finally be sure none was hidden in the software.",
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
      name: "Timing transponder",
      category: "electronics",
      summary: "The transponder, supplied by the official timekeepers, that times every lap to a thousandth of a second.",
      details: [
        "It signals to loops buried in the track at the finish line and the sector boundaries, and must be fitted exactly as the timekeepers specify.",
      ],
    },
    ballast: {
      name: "Ballast",
      category: "chassis",
      summary: "Dense tungsten plates bolted low in the car to bring it up to the minimum mass.",
      details: [
        "Teams aim to build the car below the limit, then add ballast where it helps most: as low as possible, and placed to tune the front-to-rear weight split. It must be fixed so that tools are needed to remove it, and it can be sealed by the scrutineers.",
        "The limit was 605 kg including the driver in 2007 and 2008. In 2006 it was 605 kg in qualifying and 600 kg the rest of the time.",
      ],
      specs: [["Minimum mass", "605 kg with driver"]],
    },

    // --- Cooling ------------------------------------------------------------
    cooling: {
      name: "Cooling system",
      category: "cooling",
      summary: "Radiators, louvres and chimneys that reject the V8's heat through the sidepods.",
      details: [
        "A V8 turns less than a third of its fuel energy into power; most of the rest must leave through the coolant, the oil and the exhaust. Cooling is measured against drag: every opening costs lap time, so the car is run as closed as the track temperature allows.",
        "These rules let hot air out almost anywhere on the bodywork, which is why cars of this era carry louvres and chimneys that later rules banned.",
      ],
      specs: [["Coolant pressure", "≤3.75 bar"]],
      didYouKnow: "In 2008 McLaren ran an almost closed sidepod while Ferrari and others ran rows of louvres.",
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
        "For 2008 each gearbox had to last four consecutive events for the first time; changing it early cost five places on the grid.",
        "Use **X-ray** or explode the car to see the gear cluster inside.",
      ],
      specs: [["Life", "Four events (from 2008)"]],
    },
    "gear-cluster": {
      name: "Gear cluster",
      category: "drivetrain",
      summary: "Seven forward gears and a reverse, shifted in milliseconds by a seamless-shift system.",
      details: [
        "A **seamless-shift** gearbox engages the next gear before releasing the current one, so there is almost no break in drive. The driver calls for each shift with a paddle.",
      ],
      specs: [["Forward gears", "7, plus reverse"]],
    },
    clutch: {
      name: "Clutch",
      category: "drivetrain",
      summary: "A small multi-plate carbon clutch in the bellhousing, used mainly for starts and pit stops.",
      details: [
        "Carbon plates barely larger than a hand handle hundreds of kilowatts. The driver works the clutch only with paddles on the steering wheel. Once moving, the seamless gearbox shifts without opening it.",
        "If a car stops with its engine dead, a switch marked **N** on top of the tub frees the clutch for at least 15 minutes, so marshals can push it.",
      ],
    },
    differential: {
      name: "Differential",
      category: "drivetrain",
      summary: "Lets the rear wheels turn at different speeds in corners while sharing the drive between them.",
      details: [
        "In a corner the outside wheel travels further than the inside one. An open differential would let the lightly loaded inside wheel spin away the power, so F1 cars use a limited-slip differential, controlled by the ECU. The driver adjusts it from the steering wheel.",
      ],
    },
    driveshafts: {
      name: "Driveshafts",
      category: "drivetrain",
      summary: "Shafts with constant-velocity joints that carry the torque to the rear wheels.",
      details: [
        "The joints at each end let the shaft keep turning smoothly as the suspension moves.",
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
      summary: "A wide, low two-element wing with a beam wing below it, and nothing on it moves.",
      details: [
        "The rear wing makes downforce for the rear axle. Its upper profiles must fit within ±480 mm of the centre line, no higher than 800 mm and no further than 350 mm behind the axle.",
        "For 2009 it was cut to 750 mm wide and raised to 950 mm, to lift its wake clear of a following car.",
      ],
      specs: [
        ["Elements", "Mainplane + flap, plus beam wing"],
        ["Span", "≤1,000 mm with endplates"],
        ["Height", "≤800 mm above the reference plane"],
      ],
      didYouKnow: "In 2006 Honda took a car based on its RA106 to Bonneville and reached about 397 km/h, with a rudder in place of the rear wing.",
    },
    "rw-mainplane": {
      name: "Rear mainplane",
      category: "aero",
      summary: "The fixed lower element of the rear wing.",
      details: [
        "The mainplane makes most of the wing's downforce. A slot of no more than 15 mm separates it from the flap above.",
      ],
    },
    "rw-flap": {
      name: "Rear flap",
      category: "aero",
      summary: "The upper element, set at a pit stop and locked to the mainplane by rigid separators.",
      details: [
        "The FIA made rigid supports between the two elements mandatory at the 2006 Canadian Grand Prix, after rows about wings flexing at speed. They must be 2–3 mm thick, and no part of the trailing edge may be more than 250 mm from one.",
        "A flap that bent back on the straights would shed drag, the effect that DRS would later provide by design. Under these rules the flap may deflect no more than 5 mm under 500 N.",
      ],
      specs: [
        ["Slot gap", "≤15 mm"],
        ["Flex test", "≤5 mm under 500 N"],
      ],
    },
    "rw-endplates": {
      name: "Rear endplates",
      category: "aero",
      summary: "Big flat plates at the wing tips, reaching down toward the floor and back behind the wing.",
      details: [
        "The endplates tidy the wing-tip vortices, a big source of drag, and stop high-pressure air spilling round the tips. They stand just outside ±480 mm, and seen from the side must cover more than 230,000 mm² between 300 and 800 mm up and up to 600 mm behind the axle.",
      ],
      specs: [
        ["Position", "Up to ±500 mm"],
        ["Side area", ">230,000 mm²"],
      ],
    },
    "beam-wing": {
      name: "Beam wing",
      category: "aero",
      summary: "A small low wing between the endplates, just behind the diffuser.",
      details: [
        "The beam wing adds a little downforce of its own, but its main job is to help the diffuser. The low pressure under it draws air up and out from the floor, which makes the whole underbody work harder.",
        "It may be a single section, more than 150 mm behind the rear axle, between 300 and 375 mm up.",
      ],
      specs: [
        ["Sections", "One"],
        ["Height", "300–375 mm above the reference plane"],
      ],
    },
    "rw-pylon": {
      name: "Rear wing pillar",
      category: "aero",
      summary: "A central support that carries the wing's load down into the crash structure.",
      details: [
        "The pillar helps the endplates carry the wing's load, several hundred kilograms at high speed. Within ±75 mm of the centre line the rules leave room for it through the gap they otherwise keep clear above the beam wing.",
      ],
    },

    // --- Bodywork -----------------------------------------------------------
    bodywork: {
      name: "Bodywork",
      category: "aero",
      summary: "The engine cover, sidepods and the clutter of small wings mounted on them.",
      details: [
        "The rules of this era drew boxes that bodywork had to stay within, and left it largely free inside them. Designers filled those boxes with small devices, each conditioning the air for the next.",
        "That clutter is why this era looks as it does, and why it ended. The FIA's Overtaking Working Group of Pat Symonds, Rory Byrne and Paddy Lowe first met in January 2007, and the rules it shaped for 2009 removed the bargeboards, chimneys, flip-ups and horns.",
        "Use **X-ray** to see through it to the engine and radiators.",
      ],
    },
    "engine-cover": {
      name: "Engine cover",
      category: "aero",
      summary: "The tapering cover over the V8, narrowing into the coke bottle.",
      details: [
        "From the side, the cover must fill an area that falls from 925 mm high, 1,000 mm ahead of the rear axle, to 550 mm at the axle. Anything above that line may be no more than 125 mm wide.",
        "The cover then narrows into the **coke bottle**, and the periscope exhausts break through its shoulders.",
      ],
    },
    "shark-fin": {
      name: "Shark fin",
      category: "aero",
      summary: "A thin fin along the spine of the engine cover, new in 2008.",
      details: [
        "The rules allow bodywork above the cover's diagonal line as long as it is no more than 125 mm wide, so a thin fin along that line is legal. It adds side area, which helps the car resist yaw and straightens the flow reaching the rear wing.",
        "Red Bull's RB4 ran one from the first day of testing in February 2008. Renault added one at the Spanish Grand Prix, and nearly everyone copied them.",
      ],
      specs: [["Width", "≤125 mm above the diagonal"]],
    },
    sidepods: {
      name: "Sidepods",
      category: "aero",
      summary: "The pods either side of the driver that house the radiators, with a deep undercut and a coke-bottle tail.",
      details: [
        "The inlets swallow air for the radiators, and the outside shape decides how the rest flows past. Above 600 mm nothing may be more than 300 mm from the centre line, apart from the mirrors, and outside ±500 mm everything must stay under 500 mm high for the last 800 mm before the rear axle.",
        "Their tails fall away and pinch in ahead of the rear tyres: for the last 400 mm nothing may be more than 500 mm from the centre line.",
      ],
    },
    chimneys: {
      name: "Cooling chimneys",
      category: "aero",
      summary: "Hooded outlets on top of the sidepods that let hot air out.",
      details: [
        "A chimney lets hot air out of the sidepod, feeding it into the fast flow over the top of the pod. Teams fitted them according to the heat of the track, and many kept them even when closed.",
        "The 2009 rules banned them.",
      ],
    },
    "flip-ups": {
      name: "Flip-ups",
      category: "aero",
      summary: "Small curved deflectors ahead of the rear tyres, also known as flick-ups.",
      details: [
        "Flip-ups sit on the floor and sidepods just ahead of the rear wheels. They turn the air up and over the tyre, keeping its turbulent wake away from the floor and adding a little downforce of their own.",
        "They were banned for 2009.",
      ],
    },
    "horn-wings": {
      name: "Horn wings",
      category: "aero",
      summary: "Winglets on the shoulders of the chassis, ahead of the cockpit.",
      details: [
        "In the clear space above the front wheels teams mounted small wings, usually called horns, to start working the air on its way to the sidepods. They must stay inside ±400 mm, clear of the front wheels, and under 600 mm high outside ±300 mm.",
        "They grew strange. Honda's 2008 RA108 carried big \"Dumbo\" wings on its nose. BMW's 2006 \"Twin Towers\", tall fins on the nose, raced once, at that year's French Grand Prix, before the FIA banned them because they blocked the driver's view.",
      ],
    },
    "mid-wing": {
      name: "Mid-wing",
      category: "aero",
      summary: "A small wing either side of the engine cover, just ahead of the rear axle.",
      details: [
        "This is one of the last places left for a wing. Outside ±100 mm nothing just ahead of the rear axle may be higher than 600 mm, so it sits just under that line, adding a little rear downforce and helping draw air up from the coke bottle.",
      ],
    },

    // --- Floor --------------------------------------------------------------
    floor: {
      name: "Floor",
      category: "aero",
      summary: "A flat stepped floor with a short diffuser, its edges pinched in ahead of the rear wheels.",
      details: [
        "Seen from below, everything between 330 mm behind the front axle and 330 mm ahead of the rear axle must lie on one of two flat planes: the reference plane along the middle, where the plank is, or the **step plane** 50 mm above it.",
        "It must keep inside ±400 mm until 800 mm behind the front axle, then may widen to ±700 mm, and for the last 400 mm before the rear axle comes back to ±500 mm.",
      ],
      specs: [
        ["Width", "±700 mm at most"],
        ["Step", "50 mm"],
      ],
    },
    "floor-body": {
      name: "Floor body & tea tray",
      category: "aero",
      summary: "The flat carbon floor, and the tea tray (splitter) under the chassis ahead of it.",
      details: [
        "The underside is flat: a keel on the reference plane, carrying the plank, with the step plane 50 mm higher on either side. Enclosed holes are allowed, as long as nothing of the car can be seen through them from below.",
        "Ahead of the floor, the **tea tray** juts forward under the chassis, at least 50 mm off the reference plane. In a test it may flex no more than 5 mm under 2,000 N.",
      ],
      didYouKnow: "After the 2007 Australian Grand Prix McLaren queried a spring-mounted section at the front of Ferrari's floor. The car had passed its checks, but the FIA then changed its tests so such devices could not pass.",
    },
    bargeboards: {
      name: "Bargeboards",
      category: "aero",
      summary: "Big curved boards behind the front wheels that turn their wake away from the floor.",
      details: [
        "The rules keep bodywork out of the zone around the front wheels only outside ±400 mm, so everything inside that line was free. These boards take the turbulent wake from the front tyres and steer it out past the sidepods, keeping the air reaching the floor clean.",
        "They were some of the most heavily developed parts on the car, and the 2009 rules cut them back hard by clearing the whole area around the front wheels.",
      ],
    },
    "turning-vanes": {
      name: "Turning vanes",
      category: "aero",
      summary: "Vertical vanes hanging under the nose, between the chassis and the tea tray.",
      details: [
        "Air passing under the high nose meets these vanes first. They guide it outward and start the vortices that help seal the edges of the floor.",
      ],
    },
    "floor-stays": {
      name: "Floor stays",
      category: "aero",
      summary: "Slim stays that stop the edges of the floor flexing at speed.",
      details: [
        "Under the load of the airflow the wide, thin floor would bend, changing how close its edges run to the track. Stays hold the edges in place, and an FIA test allows no more than 10 mm of movement under 500 N.",
      ],
    },
    diffuser: {
      name: "Diffuser",
      category: "aero",
      summary: "The rising tail of the floor: short at the sides, with a tall centre running past the axle.",
      details: [
        "Air under the floor has to return to normal speed and pressure before it leaves the car. The diffuser's expanding shape does this gradually, which lets the air under the car run faster in the first place.",
        "Outside ±150 mm it starts 330 mm ahead of the rear axle and stops at the axle, no more than 125 mm high, because nothing out there may be below 300 mm behind the axle. Only the centre carries on behind it, which is why it looks like a tall tunnel under the crash structure.",
        "For 2009 the whole diffuser moved back behind the axle.",
      ],
      specs: [
        ["Start", "330 mm ahead of the rear axle"],
        ["Outer height", "≤125 mm"],
      ],
    },
    plank: {
      name: "Plank",
      category: "chassis",
      summary: "A 300 mm wide skid board under the floor that stops teams running the car dangerously low.",
      details: [
        "Running lower makes more downforce, so teams are tempted to scrape the floor along the track. The plank polices that: it must be 10 mm thick, give or take 1 mm, so after the race it must still measure at least 9 mm. It is checked at six of its seven holes.",
        "It is made of a uniform material with a specific gravity of 1.3 to 1.45, held on by metal fasteners of no more than 2,000 mm² each.",
      ],
      specs: [
        ["Size", "300 mm wide, 10 ± 1 mm thick"],
        ["Length", "From 330 mm behind the front axle to the rear axle"],
      ],
    },

    // --- Suspension ---------------------------------------------------------
    "front-suspension": {
      name: "Front suspension",
      category: "suspension",
      summary: "Wishbones, push-rods and steering that hold the front wheels at precisely controlled angles.",
      details: [
        "Each wheel is located by six members: two wishbones (four legs), a push-rod, and a track rod for steering. The response must come only from changes in the load on the wheels, and nothing may be adjusted while the car is moving.",
      ],
      didYouKnow: "Renault raced a tuned mass damper, a sprung weight that steadied the car over bumps, from 2005. The FIA's International Court of Appeal ruled it illegal in August 2006.",
    },
    "fs-wishbones": {
      name: "Front wishbones",
      category: "suspension",
      summary: "Upper and lower A-shaped arms that let the wheel move up and down while controlling its camber.",
      details: [
        "The legs are hollow carbon tubes with aerofoil sections, so they work as small aero devices too, though the rules limit each section's aspect ratio to 3.5:1. Their geometry sets how the wheel tilts as it rises, and how much the car's nose dives under braking.",
        "Wheel tethers inside the legs keep the wheel attached to the car in a crash. These rules ask for one or two per wheel.",
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
        "The steering rack runs across the front bulkhead. Each track rod is usually aligned with a wishbone leg so it hides in that leg's wake. Power assistance is allowed, as long as it is neither electrically powered nor electronically controlled.",
      ],
    },
    "fs-inboard": {
      name: "Front springs & dampers",
      category: "suspension",
      summary: "Rockers, torsion bars and dampers packed into the top of the chassis.",
      details: [
        "Instead of coil springs, F1 cars use **torsion bars**, steel bars that twist as the rocker turns. They give very precise rates in little space. A heave element between the two sides controls the car's pitch and ride height.",
      ],
      didYouKnow: "McLaren raced a secret \"J-damper\" from the 2005 San Marino Grand Prix. It was an inerter, and by 2008 teams were fitting them front and rear.",
    },
    "rear-suspension": {
      name: "Rear suspension",
      category: "suspension",
      summary: "Wishbones, push-rods and toe links mounted on the gearbox casing.",
      details: [
        "The rear suspension carries the driven wheels, so it has to cope with traction and the driveshafts passing through it. Its geometry controls how the car squats under acceleration.",
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
      summary: "Struts from the bottom of each upright up to rockers on top of the gearbox.",
      details: [
        "When the wheel rises, the push-rod pushes a rocker on top of the casing, as at the front. The leading cars of 2008 all used this layout; Red Bull's RB5 switched to pull-rods the following year.",
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
      summary: "The rear rockers, torsion bars and heave damper, on top of the gearbox.",
      details: [
        "As at the front, torsion bars provide the springing and dampers control the motion. Mounted on top of the casing, they stay reachable for the mechanics, at the cost of a little height.",
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
      details: ["With traction control gone for 2008, the rear tyres were entirely in the hands of the driver's right foot."],
    },
    "front-tyres": {
      name: "Front tyres",
      category: "wheels",
      summary: "13-inch Bridgestones with four grooves cut into the tread, to slow the cars down.",
      details: [
        "Grooved dry tyres arrived in 1998: channels in the tread put less rubber on the road, cutting cornering grip. From 1999 every dry tyre had four, at least 14 mm wide and 2.5 mm deep, 50 mm apart. Slicks came back in 2009.",
        "Michelin left after 2006, ending F1's last tyre war, and Bridgestone supplied everyone from 2007. The softer of the two compounds at each race was marked by one groove painted white.",
        "A race-long tyre rule had been tried in 2005; tyre changes returned for 2006.",
      ],
      specs: [
        ["Grooves", "Four, 50 mm apart"],
        ["Tread width", "≤270 mm"],
        ["Width as fitted", "305–355 mm"],
        ["Diameter", "≤660 mm (wets ≤670 mm)"],
      ],
      didYouKnow: "At the 2008 Japanese Grand Prix Bridgestone painted the grooves green for an environmental campaign.",
    },
    "rear-tyres": {
      name: "Rear tyres",
      category: "wheels",
      summary: "Wider 13-inch tyres that carry the drive, with the same four grooves.",
      details: ["The rear tyres take the traction and much of the braking load. Keeping them in their temperature window over a stint is often what decides a race."],
      specs: [
        ["Grooves", "Four, 50 mm apart"],
        ["Width as fitted", "365–380 mm"],
      ],
    },
    "front-rims": {
      name: "Front wheels & covers",
      category: "wheels",
      summary: "13-inch metal rims with a single centre-lock nut, behind a smooth wheel cover.",
      details: [
        "Each wheel is fixed by one central nut so a pit crew can change all four in a few seconds.",
        "Ferrari began the fashion for wheel covers with rotating fairings in 2006, copied by Toyota and Toro Rosso. Ferrari moved to static covers in 2007, and by 2008 nearly every team ran them, to tidy the air coming out of the brakes. They were banned from 2010.",
      ],
      specs: [
        ["Material", "One homogeneous metal"],
        ["Bead diameter", "328–332 mm (13 inches)"],
      ],
      didYouKnow: "Ron Dennis argued that Ferrari's 2006 fairings broke the parc fermé rules, because they were swapped with the wheels.",
    },
    "rear-rims": {
      name: "Rear wheels & covers",
      category: "wheels",
      summary: "Wider 13-inch rims for the rear tyres, behind the same covers.",
      details: [
        "Like the fronts, they are fixed by a single centre-lock nut, and flexible tethers attach each wheel assembly to the chassis so a wheel cannot fly free in a crash.",
      ],
      specs: [["Tethers", "One or two per wheel"]],
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
      summary: "Smaller rear discs on a fully hydraulic system, with no hybrid to share the work.",
      details: [
        "With no energy recovery, the brakes do all of the car's slowing, helped by the engine and the drag of the wings.",
      ],
      specs: [["Control", "Fully hydraulic"]],
    },
    "front-ducts": {
      name: "Front brake ducts",
      category: "cooling",
      summary: "Carbon scoops and drums that feed cooling air to the brakes, carrying winglets of their own.",
      details: [
        "The inlet scoop picks up air on the inside of the wheel. The drum around the disc channels it through the disc's holes and out.",
        "The rules treat the ducts as part of the brakes and allow them a box of their own: within 120 mm inboard of the rim and 160 mm above or below the axle. Teams filled it with small winglets.",
      ],
    },
    "rear-ducts": {
      name: "Rear brake ducts",
      category: "cooling",
      summary: "Cooling inlets and drums for the rear brakes, with stacks of small winglets.",
      details: ["They work like the front ducts. Because the rules count them as brake parts, they were one of the few places left to add a wing near the rear tyre, and teams stacked them with winglets."],
    },
    "front-uprights": {
      name: "Front uprights",
      category: "suspension",
      summary: "The hub carriers that join the wheel, brakes and suspension, and are turned by the steering.",
      details: [
        "The upright carries the wheel bearings and caliper, and is where all the wishbone, push-rod and track-rod loads meet. Its stiffness directly affects how precisely the tyre is held.",
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
