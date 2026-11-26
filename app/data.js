// Skylark Courier — configuration: every tunable number of the game lives here.
// The game is a 2D side-view courier flight over the Lumen Archipelago: deliver
// parcels to island strips, thread the golden rings, and bring the Dawn Runner
// home to the runway before the fuel gauge hits empty.

export const VIEW_W = 1280;
export const VIEW_H = 720;

export const WORLD_W = 14000; // feet of east-west sky to fly across
export const SEA_LEVEL = 0; // terrain height 0 is the sea surface

// Flight model tuning (arcade, but throttle and pitch discipline matter).
export const MIN_SPEED = 55; // knots: below this the wing stops flying
export const MAX_SPEED = 260; // knots at full throttle, level
export const STALL_SPEED = 92; // knots: below this the plane sinks
export const PITCH_MAX_UP = 28; // degrees, nose up
export const PITCH_MAX_DOWN = -24; // degrees, nose down
export const PITCH_RATE = 55; // degrees per second of held input
export const THROTTLE_RATE = 0.8; // per second of held input
export const FUEL_BURN_BASE = 0.055; // percent per second, engine idling
export const FUEL_BURN_FULL = 0.24; // percent per second at full throttle
export const FUEL_START = 100;
export const FUEL_RING_BONUS = 12; // fuel back per golden ring
export const DAMAGE_CRASH_VSPEED = 26; // ft/s of sink that breaks the plane on ground contact
export const DAMAGE_HARD_LANDING = 14; // ft/s of sink that costs hull on a runway
export const DAMAGE_STORM = 22; // hull per second inside a storm cloud
export const HULL_START = 100;

// Scoring.
export const SCORE_DELIVERY = 500;
export const SCORE_RING = 150;
export const SCORE_LANDING = 1000;
export const SCORE_FUEL_BONUS_PER_PCT = 5; // leftover fuel on the final landing

// Missions, in order. Each one names its goal and its target list.
export const MISSIONS = [
  {
    id: 'parcels',
    name: 'Sortie 1 — First Light',
    goal: 'Drop a parcel on each island strip (fly low over a strip and press SPACE)',
    targets: ['strip-a', 'strip-b'],
  },
  {
    id: 'rings',
    name: 'Sortie 2 — Ring Runner',
    goal: 'Thread all 8 golden rings in order',
    targets: ['ring-1', 'ring-2', 'ring-3', 'ring-4', 'ring-5', 'ring-6', 'ring-7', 'ring-8'],
  },
  {
    id: 'home',
    name: 'Sortie 3 — Home Run',
    goal: 'Land on the home runway before the fuel runs out',
    targets: ['strip-home'],
  },
];

// Runway strips: x is the strip centre in feet, w its width, h its terrain height.
export const STRIPS = {
  'strip-home-start': { x: 320, w: 420, h: 40, label: 'LUMEN FIELD' },
  'strip-a': { x: 4300, w: 380, h: 150, label: 'KORA ISLE' },
  'strip-b': { x: 7900, w: 380, h: 190, label: 'TIDE ISLE' },
  strip_home: { x: 13550, w: 460, h: 60, label: 'LUMEN FIELD' },
};

// Golden rings for Sortie 2: x and altitude in feet.
export const RINGS = [
  { id: 'ring-1', x: 1800, alt: 900 },
  { id: 'ring-2', x: 2900, alt: 1500 },
  { id: 'ring-3', x: 4700, alt: 700 },
  { id: 'ring-4', x: 5900, alt: 1700 },
  { id: 'ring-5', x: 7200, alt: 1100 },
  { id: 'ring-6', x: 8800, alt: 1900 },
  { id: 'ring-7', x: 10300, alt: 900 },
  { id: 'ring-8', x: 12100, alt: 1500 },
];

// Storm clouds: drifting hazards that chew hull.
export const STORMS = [
  { x: 3400, alt: 1300, r: 170 },
  { x: 6600, alt: 800, r: 150 },
  { x: 9900, alt: 1600, r: 180 },
  { x: 12700, alt: 1000, r: 150 },
];

export const PALETTE = {
  skyTop: '#274b7a',
  skyMid: '#e8907c',
  skyLow: '#ffd9a0',
  sea: '#2f6f8f',
  seaDeep: '#1f4d66',
  grass: '#4a7c3a',
  grassLight: '#6da24e',
  rock: '#7a5a3c',
  sand: '#e8d39a',
  runway: '#3a3f46',
  runwayLine: '#f5f0dc',
  planeCream: '#f5e6c8',
  planeTeal: '#1f7a6d',
  planeRed: '#c8442c',
  ringGold: '#ffd24a',
  ringGreen: '#7be07b',
  hudInk: '#10202e',
  hudGlow: '#ffe9b0',
};
