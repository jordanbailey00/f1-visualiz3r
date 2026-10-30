"use client";

import { Mirrored, Part } from "../../Part";
import { AirboxCooler, EngineCover, Radiators, Sidepods } from "./Bodywork";
import {
  AccidentRecorder,
  Ballast,
  Cameras,
  CockpitLights,
  Extinguisher,
  FuelCell,
  Harness,
  Headrest,
  HighSpeedCamera,
  Mirrors,
  Monocoque,
  NoseCone,
  Pedals,
  RollStructure,
  Seat,
  SideImpact,
  SteeringWheel,
  Transponders,
} from "./Chassis";
import { Bargeboards, Diffuser, FloorBody, FloorStays, Plank } from "./Floor";
import { Clutch, Differential, Driveshafts, GearboxCasing, GearCluster, RainLight, RearImpact } from "./Gearbox";
import { ControlElectronics, Engine, EnergyStore, Exhaust, HeatShield, MguH, MguK, OilTank, Plenum, StandardEcu, Turbocharger } from "./PowerUnit";
import { FrontInboard, FrontPushrods, FrontWishbones, RearInboard, RearPushrods, RearWishbones, ToeLinks, TrackRods } from "./Suspension";
import { BrakeDucts, Brakes, Rims, Tyres, Uprights } from "./Wheels";
import {
  FrontAdjusters,
  FrontEndplates,
  FrontFlaps,
  FrontMainplane,
  MonkeySeat,
  RearActuator,
  RearEndplates,
  RearFlap,
  RearMainplane,
  RearPylon,
} from "./Wings";

type V3 = [number, number, number];
type Range = [number, number];

/** Explode moves shared by parts and the cameras mounted on them. */
const NOSE_MOVE: { explode: V3; range: Range } = { explode: [450, 0, 0], range: [0.35, 0.7] };
const AIRBOX_MOVE: { explode: V3; range: Range } = { explode: [0, 560, 0], range: [0.45, 0.8] };

/**
 * Generic 2014–2016 turbo-hybrid, to the 2016 rules. Exploding the view
 * lifts the car off its plank and stepped floor layer by layer: survival
 * cell and gearbox rise, the bodywork lifts clear above them, wings slide
 * away fore and aft, and the wheels roll out sideways along the ground.
 */
export default function Car2014Model() {
  return (
    <group>
      {/* --- Survival cell ------------------------------------------------ */}
      <Part id="chassis" explode={[0, 620, 0]} explodeRange={[0.12, 0.5]}>
        <Part id="monocoque" cover>
          <Monocoque />
        </Part>
        <Part id="nose" explode={NOSE_MOVE.explode} explodeRange={NOSE_MOVE.range}>
          <NoseCone />
        </Part>
        <Part id="roll-structure" explode={AIRBOX_MOVE.explode} explodeRange={AIRBOX_MOVE.range}>
          <RollStructure />
        </Part>
        <Part id="fuel-cell" explode={[0, 380, 0]} explodeRange={[0.55, 0.9]}>
          <FuelCell />
        </Part>
        <Part id="cockpit">
          <Part id="seat" explode={[150, 300, 0]} explodeRange={[0.55, 0.9]}>
            <Seat />
          </Part>
          <Part id="harness" explode={[150, 420, 0]} explodeRange={[0.6, 0.95]}>
            <Harness />
          </Part>
          <Part id="steering-wheel" explode={[320, 380, 0]} explodeRange={[0.5, 0.85]}>
            <SteeringWheel />
          </Part>
          <Part id="headrest" explode={[0, 250, 0]} explodeRange={[0.45, 0.8]}>
            <Headrest />
          </Part>
          <Part id="pedals" explode={[260, 0, 0]} explodeRange={[0.55, 0.9]}>
            <Pedals />
          </Part>
          <Part id="extinguisher" explode={[0, -280, 0]} explodeRange={[0.55, 0.9]}>
            <Extinguisher />
          </Part>
          <Part id="cockpit-lights" explode={[0, 160, 0]} explodeRange={[0.6, 0.95]}>
            <CockpitLights />
          </Part>
          <Part id="hs-camera" explode={[0, 200, -60]} explodeRange={[0.6, 0.95]}>
            <HighSpeedCamera />
          </Part>
        </Part>
        <Part id="mirrors" explode={[0, 140, 0]} explodeRange={[0.45, 0.8]}>
          <Mirrored out={170} explodeRange={[0.45, 0.8]}>
            <Mirrors />
          </Mirrored>
        </Part>
        <Part id="side-impact">
          <Mirrored out={280} explodeRange={[0.45, 0.85]}>
            <SideImpact />
          </Mirrored>
        </Part>
        <Part id="cameras">
          <Cameras nose={NOSE_MOVE} airbox={AIRBOX_MOVE} />
        </Part>
      </Part>

      {/* --- Front wing --------------------------------------------------- */}
      <Part id="front-wing" explode={[900, 560, 0]} explodeRange={[0.25, 0.65]}>
        <Part id="fw-mainplane">
          <FrontMainplane />
        </Part>
        <Part id="fw-flaps" explode={[0, 130, 0]} explodeRange={[0.55, 0.9]}>
          <FrontFlaps />
        </Part>
        <Part id="fw-endplates" explode={[0, 60, 0]} explodeRange={[0.55, 0.9]}>
          <Mirrored out={170} explodeRange={[0.55, 0.9]}>
            <FrontEndplates />
          </Mirrored>
        </Part>
        <Part id="fw-adjusters" explode={[0, 160, 0]} explodeRange={[0.6, 0.95]}>
          <FrontAdjusters />
        </Part>
      </Part>

      {/* --- Power unit --------------------------------------------------- */}
      <Part id="power-unit" explode={[0, 900, 0]} explodeRange={[0.3, 0.7]}>
        <Part id="ice">
          <Engine />
        </Part>
        <Part id="plenum" explode={[0, 260, 0]} explodeRange={[0.6, 0.95]}>
          <Plenum />
        </Part>
        <Part id="turbocharger" explode={[-320, 160, 0]} explodeRange={[0.6, 0.95]}>
          <Turbocharger />
          <Part id="mgu-h" explode={[0, 190, 0]} explodeRange={[0.7, 1]}>
            <MguH />
          </Part>
        </Part>
        <Part id="exhaust">
          <Exhaust />
        </Part>
        <Part id="oil-tank" explode={[0, -120, 260]} explodeRange={[0.6, 0.95]}>
          <OilTank />
        </Part>
        <Part id="heat-shield" explode={[-200, 420, 0]} explodeRange={[0.6, 0.95]}>
          <HeatShield />
        </Part>
      </Part>

      <Part id="ers">
        <Part id="mgu-k" explode={[0, 900, -380]} explodeRange={[0.3, 0.75]}>
          <MguK />
        </Part>
        <Part id="energy-store" explode={[0, 240, 0]} explodeRange={[0.3, 0.7]}>
          <EnergyStore />
        </Part>
        <Part id="control-electronics" explode={[0, 700, 440]} explodeRange={[0.3, 0.75]}>
          <ControlElectronics />
        </Part>
      </Part>

      <Part id="electronics">
        <Part id="ecu" explode={[0, 700, -440]} explodeRange={[0.3, 0.75]}>
          <StandardEcu />
        </Part>
        <Part id="adr" explode={[0, 300, 0]} explodeRange={[0.12, 0.6]}>
          <AccidentRecorder />
        </Part>
        <Part id="transponders" explode={[0, 300, 0]} explodeRange={[0.12, 0.6]}>
          <Transponders />
        </Part>
        <Part id="ballast" explode={[0, 260, 0]} explodeRange={[0.12, 0.6]}>
          <Ballast />
        </Part>
      </Part>

      {/* --- Cooling ------------------------------------------------------ */}
      <Part id="cooling" explode={[0, 620, 0]} explodeRange={[0.12, 0.5]}>
        <Part id="radiators">
          <Mirrored out={400} explodeRange={[0.45, 0.85]}>
            <Radiators />
          </Mirrored>
        </Part>
        <Part id="airbox-cooler" explode={[0, 600, 0]} explodeRange={[0.45, 0.8]}>
          <AirboxCooler />
        </Part>
      </Part>

      {/* --- Transmission ------------------------------------------------- */}
      <Part id="transmission" explode={[-450, 620, 0]} explodeRange={[0.3, 0.7]}>
        <Part id="gearbox" cover explode={[0, 300, 0]} explodeRange={[0.65, 1]}>
          <GearboxCasing />
        </Part>
        <Part id="gear-cluster">
          <GearCluster />
        </Part>
        <Part id="clutch" explode={[160, 0, 0]} explodeRange={[0.65, 1]}>
          <Clutch />
        </Part>
        <Part id="differential" explode={[-60, 0, 0]} explodeRange={[0.65, 1]}>
          <Differential />
        </Part>
        <Part id="driveshafts">
          <Mirrored out={240} explodeRange={[0.6, 0.95]}>
            <Driveshafts />
          </Mirrored>
        </Part>
      </Part>

      <Part id="rear-impact" explode={[-900, 620, 0]} explodeRange={[0.3, 0.7]}>
        <RearImpact />
        <Part id="rain-light" explode={[-160, 0, 0]} explodeRange={[0.6, 0.95]}>
          <RainLight />
        </Part>
      </Part>

      {/* --- Rear wing ---------------------------------------------------- */}
      <Part id="rear-wing" explode={[-1300, 950, 0]} explodeRange={[0.25, 0.65]}>
        <Part id="rw-mainplane">
          <RearMainplane />
        </Part>
        <Part id="rw-flap" explode={[0, 150, 0]} explodeRange={[0.55, 0.9]}>
          <RearFlap />
        </Part>
        <Part id="rw-endplates" explode={[0, 0, 0]} explodeRange={[0.55, 0.9]}>
          <Mirrored out={160} explodeRange={[0.55, 0.9]}>
            <RearEndplates />
          </Mirrored>
        </Part>
        <Part id="monkey-seat" explode={[0, -160, 0]} explodeRange={[0.55, 0.9]}>
          <MonkeySeat />
        </Part>
        <Part id="rw-pylon" explode={[0, -220, 0]} explodeRange={[0.55, 0.9]}>
          <RearPylon />
        </Part>
        <Part id="rw-actuator" explode={[0, 80, 0]} explodeRange={[0.6, 0.95]}>
          <RearActuator />
        </Part>
      </Part>

      {/* --- Bodywork ----------------------------------------------------- */}
      <Part id="bodywork" explode={[0, 1500, 0]} explodeRange={[0.15, 0.55]}>
        <Part id="engine-cover" cover explode={[0, 220, 0]} explodeRange={[0.4, 0.8]}>
          <EngineCover />
        </Part>
        <Part id="sidepods" cover explode={[0, -300, 0]} explodeRange={[0.35, 0.75]}>
          <Mirrored out={540} explodeRange={[0.35, 0.75]}>
            <Sidepods />
          </Mirrored>
        </Part>
      </Part>

      {/* --- Floor -------------------------------------------------------- */}
      <Part id="floor" explode={[0, 160, 0]} explodeRange={[0.08, 0.4]}>
        <Part id="floor-body">
          <FloorBody />
        </Part>
        <Part id="bargeboards" explode={[0, 80, 0]} explodeRange={[0.45, 0.8]}>
          <Mirrored out={260} explodeRange={[0.45, 0.8]}>
            <Bargeboards />
          </Mirrored>
        </Part>
        <Part id="floor-stays" explode={[0, 120, 0]} explodeRange={[0.5, 0.85]}>
          <Mirrored out={120} explodeRange={[0.5, 0.85]}>
            <FloorStays />
          </Mirrored>
        </Part>
        <Part id="diffuser" explode={[-350, 0, 0]} explodeRange={[0.45, 0.8]}>
          <Diffuser />
        </Part>
        {/* The plank stays on the ground as the floor lifts off it. */}
        <Part id="plank" explode={[0, -160, 0]} explodeRange={[0.08, 0.4]}>
          <Plank />
        </Part>
      </Part>

      {/* --- Suspension --------------------------------------------------- */}
      <Part id="front-suspension" explode={[0, 340, 0]} explodeRange={[0.12, 0.5]}>
        <Part id="fs-wishbones">
          <Mirrored out={170} explodeRange={[0.5, 0.85]}>
            <FrontWishbones />
          </Mirrored>
        </Part>
        <Part id="fs-pushrods" explode={[0, 80, 0]} explodeRange={[0.5, 0.85]}>
          <Mirrored out={250} explodeRange={[0.5, 0.85]}>
            <FrontPushrods />
          </Mirrored>
        </Part>
        <Part id="track-rods" explode={[0, -90, 0]} explodeRange={[0.5, 0.85]}>
          <Mirrored out={130} explodeRange={[0.5, 0.85]}>
            <TrackRods />
          </Mirrored>
        </Part>
        <Part id="fs-inboard" explode={[0, 980, 0]} explodeRange={[0.3, 0.75]}>
          <Mirrored out={70} explodeRange={[0.6, 0.95]}>
            <FrontInboard />
          </Mirrored>
        </Part>
      </Part>

      <Part id="rear-suspension" explode={[-300, 300, 0]} explodeRange={[0.12, 0.5]}>
        <Part id="rs-wishbones">
          <Mirrored out={170} explodeRange={[0.5, 0.85]}>
            <RearWishbones />
          </Mirrored>
        </Part>
        <Part id="rs-pushrods" explode={[0, 80, 0]} explodeRange={[0.5, 0.85]}>
          <Mirrored out={250} explodeRange={[0.5, 0.85]}>
            <RearPushrods />
          </Mirrored>
        </Part>
        <Part id="toe-links" explode={[0, -90, 0]} explodeRange={[0.5, 0.85]}>
          <Mirrored out={130} explodeRange={[0.5, 0.85]}>
            <ToeLinks />
          </Mirrored>
        </Part>
        <Part id="rs-inboard" explode={[-150, 700, 0]} explodeRange={[0.3, 0.75]}>
          <Mirrored out={70} explodeRange={[0.6, 0.95]}>
            <RearInboard />
          </Mirrored>
        </Part>
      </Part>

      {/* --- Corners: wheels roll out along the ground -------------------- */}
      <Part id="front-corners">
        <Part id="front-tyres">
          <Tyres axle="front" out={1000} range={[0.05, 0.45]} />
        </Part>
        <Part id="front-rims">
          <Rims axle="front" out={760} range={[0.05, 0.45]} />
        </Part>
        <Part id="front-brakes">
          <Brakes axle="front" out={540} range={[0.1, 0.5]} />
        </Part>
        <Part id="front-ducts">
          <BrakeDucts axle="front" out={430} range={[0.1, 0.5]} />
        </Part>
        <Part id="front-uprights">
          <Uprights axle="front" out={300} range={[0.1, 0.5]} />
        </Part>
      </Part>

      <Part id="rear-corners">
        <Part id="rear-tyres">
          <Tyres axle="rear" out={1000} range={[0.05, 0.45]} />
        </Part>
        <Part id="rear-rims">
          <Rims axle="rear" out={760} range={[0.05, 0.45]} />
        </Part>
        <Part id="rear-brakes">
          <Brakes axle="rear" out={540} range={[0.1, 0.5]} />
        </Part>
        <Part id="rear-ducts">
          <BrakeDucts axle="rear" out={430} range={[0.1, 0.5]} />
        </Part>
        <Part id="rear-uprights">
          <Uprights axle="rear" out={300} range={[0.1, 0.5]} />
        </Part>
      </Part>
    </group>
  );
}
