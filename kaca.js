





const velikost = 20;
const sirina = 600;

let k;
let hrana = [];
let stene = [];
let mine = [];
let robZmanjsanja = 0;
let lovec;
let lovecSpeedTimer = 0;
let pavza = false;
let gameOver = false;
let winScreen = false;
let deathCause = ""; // e.g. "Hit wall", "Ate own tail", ...

// ===== OBJECT POOL (particles) =====
const PARTICLE_POOL_SIZE = 400;
let particlePool = [];
let particleActive = [];


// ===== HYBRID SNAKE+GD =====
let hybridPhase = "snake"; // "snake" | "gd"
let hybridStage = 0;
let hybridScore = 0;
let hybridPortalTriggered = false;
let hybridSnakeTarget = 6;


// EKONOMIJA
let kovanci = 0;
let trenutnaKoza = "Cyan";
let trenutnoOzadje = "Magenta";
let trenutniDodatek = "None";

let equipCustomHead = false;
let equipCustomTail = false;
let equipCustomBg = false;
let equipNeonTrail = false;
let equipSparkleAura = false; // independent of accessory slot
let equipGhostAura = false; // Ghost Aura reward toggle

let kupljeneKoze = ["Cyan"];
let kupljenaOzadja = ["Magenta"];
let kupljeniDodatki = ["None"];

// ===== COIN SINKS =====
let vPodmenijuSpend = false;
let spendTab = 0; // 0 boosts, 1 coin gamble, 2 upgrades, 3 boost gamble
let spendIzbira = 0;

// Pre-run boosts (paid when starting a run)
let boostStartLen = false;
let boostMagnet = false;
let boostLuckyRun = false;

// Revive / continue
let revivedThisRun = false;
let platformerContinues = 0;
const REVIVE_COST = 250;

// Permanent upgrades (levels)
let upgradeCoins = 0;   // +1 coin every N food, level reduces N
const REVIVE_TICKET_COST = 250;
const UPGRADE_BASE = [200, 250, 300]; // base costs for lucky/sense/coins
const UPGRADE_MAX = 10;

// Gambles
let gambleResult = null;
let gambleTimer = 0;
let boostGambleResult = null;
let boostGambleTimer = 0;
let boostTickets = {
    startLen: 0, luckyRun: 0
};

// ACHIEVEMENTS
let achievements = {
    firstSteps: false, coinHoarder: false, dailyWarrior: false, dailyLegend: false,
    platformerRookie: false, platformerMaster: false, highRoller: false, immortal: false,
    speedDemon: false, bossSlayer: false, glitchLord: false,
    // easier ones
    beginner: false,
    dailyStarter: false, shopper: false, modeHopper: false, platformerStart: false,
    collector: false,
    gdExplorer: false, gdShipPilot: false, gdWaveMaster: false, gdSwingMaster: false,
    gdRobotMaster: false, gdUFOMaster: false, gdBallMaster: false, gdPortalRunner: false,
    endlessClimber: false, endlessVeteran: false, endlessMarathon: false,
    stereoMadnessClear: false, waveSkillClear: false, pulseFactoryClear: false
};
let unlockedRewards = {
    solarFlare: false, phoenixWings: false, neonGrid: false, cyberPhantom: false,
    goldenCrownPlus: false, ghostAura: false, goldTrail: false, specialDeath: false,
    voidWalker: false, realityGlitch: false,
    auroraPulse: false, starfield: false, neonTrail: false, bossTrophy: false, emberSkin: false,
    crystalSkin: false, sparkleAura: false,
    gdPrismSkin: false, gdVoidBackground: false, gdCrownAccessory: false,
    gdShipSkin: false, gdSwingAccessory: false, gdRobotSkin: false, gdUFOBackground: false, gdBallAccessory: false,
    endlessFlareSkin: false, endlessSkyBackground: false, endlessHaloAccessory: false,
    stereoGlowTrail: false, wavePerfectAura: false, pulseFactorySkin: false
};
let dailyCompletions = 0;
let totalDeaths = 0;
let survivalTimer = 0;
let showAchievements = false;
let platformerDeathsThisRun = 0;
let modesPlayed = new Set();
let totalFoodEaten = 0;

// Reality Glitch
let glitchTimer = 0;
let glitchOffset = 0;

// CUSTOM EDITORS
let customHeadGrid = [];
let customTailGrid = [];
let customBgGrid = [];
let vUredniku = false;
let urednikTip = "head";
let izbranaBarva = 1;

const gridVelikost = 8;
const bgGridVelikost = 12;
const urejevalnikX = 140;
const urejevalnikY = 120;
const pikselVelikost = 40;
const bgPikselVelikost = 28;

const headPalette = [
    [0, 0, 0], [57, 255, 20], [0, 255, 255], [255, 50, 50],
    [255, 215, 0], [180, 50, 255], [255, 140, 0], [255, 255, 255], [30, 30, 30]
];

const shopSkins = [
    { name: "Cyan", price: 0, color: [0, 255, 255], pattern: "solid", rarity: "Common" },
    { name: "Neon Green", price: 60, color: [57, 255, 20], pattern: "solid", rarity: "Common" },
    { name: "Gold", price: 150, color: [255, 215, 0], pattern: "solid", rarity: "Rare" },
    { name: "Ruby Red", price: 240, color: [224, 17, 95], pattern: "solid", rarity: "Rare" },
    { name: "Zebra", price: 180, color: [255, 255, 255], pattern: "zebra", rarity: "Rare" },
    { name: "Tiger", price: 220, color: [255, 140, 0], pattern: "tiger", rarity: "Rare" },
    { name: "Neon Purple", price: 190, color: [180, 50, 255], pattern: "solid", rarity: "Rare" },
    { name: "Ice", price: 160, color: [150, 220, 255], pattern: "solid", rarity: "Common" },
    { name: "Fire", price: 230, color: [255, 80, 20], pattern: "solid", rarity: "Epic" },
    { name: "Cyber", price: 280, color: [0, 255, 180], pattern: "solid", rarity: "Epic" },
    { name: "Pink", price: 100, color: [255, 105, 180], pattern: "solid", rarity: "Common" },
    { name: "Lava", price: 260, color: [255, 60, 0], pattern: "solid", rarity: "Epic" },
    { name: "Mint", price: 130, color: [100, 255, 180], pattern: "solid", rarity: "Common" },
    { name: "Pumpkin", price: 180, color: [255, 100, 30], pattern: "pumpkin", rarity: "Seasonal" },
    { name: "Frostbite", price: 180, color: [180, 220, 255], pattern: "frost", rarity: "Seasonal" },
    { name: "Petal", price: 180, color: [255, 150, 200], pattern: "petal", rarity: "Seasonal" },
    { name: "Solar", price: 180, color: [255, 180, 40], pattern: "solar", rarity: "Seasonal" }
];

const exclusiveSkins = [
    { name: "Solar Flare", color: [255, 120, 0], pattern: "solar", rarity: "Legendary", key: "solarFlare" },
    { name: "Cyber Phantom", color: [160, 0, 255], pattern: "phantom", rarity: "Legendary", key: "cyberPhantom" },
    { name: "Void Walker", color: [40, 0, 80], pattern: "void", rarity: "Legendary", key: "voidWalker" },
    { name: "Reality Glitch", color: [0, 255, 180], pattern: "glitch", rarity: "Mythic", key: "realityGlitch" },
    { name: "Ember", color: [255, 90, 30], pattern: "ember", rarity: "Epic", key: "emberSkin" },
    { name: "Crystal", color: [140, 220, 255], pattern: "crystal", rarity: "Epic", key: "crystalSkin" },
    { name: "Prism Runner", color: [255, 80, 220], pattern: "prism", rarity: "Mythic", key: "gdPrismSkin" },
    { name: "Sky Engine", color: [80, 210, 255], pattern: "solar", rarity: "Mythic", key: "gdShipSkin" },
    { name: "Titan Alloy", color: [150, 180, 220], pattern: "crystal", rarity: "Mythic", key: "gdRobotSkin" },
    { name: "Endless Flare", color: [255, 210, 60], pattern: "flare", rarity: "Mythic", key: "endlessFlareSkin" },
    { name: "Stereo Glow", color: [120, 80, 255], pattern: "stereoGlow", rarity: "Mythic", key: "stereoGlowTrail" },
    { name: "Wave Perfect", color: [255, 60, 200], pattern: "wavePerfect", rarity: "Mythic", key: "wavePerfectAura" },
    { name: "Pulse Factory", color: [255, 40, 120], pattern: "pulseFactory", rarity: "Mythic", key: "pulseFactorySkin" }
];

const shopBackgrounds = [
    { name: "Magenta", price: 0, color: [220, 60, 180], rarity: "Common" },
    { name: "Deep Space", price: 50, color: [15, 15, 35], rarity: "Common" },
    { name: "Matrix", price: 100, color: [10, 30, 10], rarity: "Rare" },
    { name: "Snow", price: 160, color: [240, 245, 250], rarity: "Rare" },
    { name: "Sunset", price: 110, color: [255, 120, 60], rarity: "Common" },
    { name: "Ocean", price: 130, color: [20, 80, 140], rarity: "Common" },
    { name: "Forest", price: 120, color: [20, 60, 30], rarity: "Common" },
    { name: "Neon City", price: 160, color: [30, 10, 50], rarity: "Rare" },
    { name: "Blood Moon", price: 180, color: [80, 10, 20], rarity: "Epic" },
    { name: "Arctic", price: 140, color: [180, 220, 255], rarity: "Rare" },
    { name: "Void", price: 200, color: [5, 0, 15], rarity: "Epic" },
    { name: "Lava Field", price: 210, color: [60, 15, 5], rarity: "Epic" },
    { name: "Crystal Cave", price: 175, color: [25, 15, 50], rarity: "Rare" },
    { name: "Aurora", price: 190, color: [10, 40, 50], rarity: "Epic" },
    { name: "Cherry Blossom", price: 150, color: [40, 15, 30], rarity: "Rare" },
    { name: "Storm", price: 165, color: [20, 25, 40], rarity: "Rare" },
    { name: "Industrial", price: 145, color: [35, 35, 40], rarity: "Common" },
    { name: "Plasma", price: 185, color: [40, 10, 60], rarity: "Epic" },
    { name: "Winter Night", price: 200, color: [20, 30, 55], rarity: "Seasonal" },
    { name: "Spring Garden", price: 200, color: [40, 80, 40], rarity: "Seasonal" },
    { name: "Summer Horizon", price: 200, color: [255, 160, 50], rarity: "Seasonal" },
    { name: "Autumn Grove", price: 200, color: [80, 35, 15], rarity: "Seasonal" },
    { name: "Custom Image", price: 200, color: [120, 80, 200], rarity: "Epic" }
];

const exclusiveBgs = [
    { name: "Neon Grid", color: [8, 18, 35], rarity: "Legendary", key: "neonGrid" },
    { name: "Aurora Pulse", color: [10, 25, 45], rarity: "Legendary", key: "auroraPulse" },
    { name: "Starfield", color: [5, 5, 20], rarity: "Legendary", key: "starfield" },
    { name: "GD Void", color: [8, 2, 30], rarity: "Mythic", key: "gdVoidBackground" },
    { name: "Nebula Drift", color: [18, 8, 55], rarity: "Mythic", key: "gdUFOBackground" },
    { name: "Endless Sky", color: [8, 35, 65], rarity: "Mythic", key: "endlessSkyBackground" }
];

const shopAccessories = [
    { name: "None", price: 0, color: [200, 200, 200], rarity: "Common" },
    { name: "Sunglasses", price: 40, color: [0, 0, 0], rarity: "Common" },
    { name: "Crown", price: 100, color: [255, 215, 0], rarity: "Rare" },
    { name: "Halo", price: 110, color: [255, 255, 180], rarity: "Rare" },
    { name: "Custom Head", price: 120, color: [255, 100, 255], rarity: "Epic" },
    { name: "Custom Tail", price: 140, color: [100, 255, 200], rarity: "Epic" },
    { name: "Custom BG", price: 180, color: [180, 100, 255], rarity: "Epic" },
    { name: "Bandana", price: 70, color: [200, 40, 40], rarity: "Common" },
    { name: "Horns", price: 130, color: [80, 30, 30], rarity: "Rare" }
];

const exclusiveAccessories = [
    { name: "Phoenix Wings", color: [255, 80, 0], rarity: "Legendary", key: "phoenixWings" },
    { name: "Golden Crown+", color: [255, 215, 0], rarity: "Legendary", key: "goldenCrownPlus" },
    { name: "Boss Trophy", color: [255, 180, 50], rarity: "Legendary", key: "bossTrophy" },
    { name: "Sparkle Aura", color: [255, 255, 180], rarity: "Epic", key: "sparkleAura" },
    { name: "GD Crown", color: [220, 100, 255], rarity: "Mythic", key: "gdCrownAccessory" },
    { name: "Gravity Crown", color: [80, 240, 255], rarity: "Mythic", key: "gdSwingAccessory" },
    { name: "Prism Ring", color: [255, 90, 220], rarity: "Mythic", key: "gdBallAccessory" },
    { name: "Endless Halo", color: [100, 230, 255], rarity: "Mythic", key: "endlessHaloAccessory" }
];

// Passive perks (equip / unequip)
const exclusivePerks = [
    { name: "Neon Trail", color: [0, 255, 220], rarity: "Rare", key: "neonTrail", equipKey: "equipNeonTrail" },
    { name: "Sparkle Particles", color: [255, 255, 180], rarity: "Epic", key: "sparkleAura", equipKey: "equipSparkleAura" },
];

// MENI
let menu = true;
let vPodmenijuRecords = false;
let vPodmenijuShop = false;
let vPodmenijuBuilder = false;
let shopKategorija = 0;
let shopIzbira = 0;
let shopScroll = 0; // first visible item index
let soundEnabled = true;
let masterVolume = 0.7;
let introActive = true;
let introTimer = 0;
const INTRO_DURATION = 45; // frames at menu rate
let tutorialActive = false;
let tutorialStep = 0;
let tutorialPractice = false;
let tutorialPracticeDone = false;
let tutorialPracticeAI = false;
let audioUnlocked = false;
let glavniMeniIzbira = 0;
const SHOP_ROW_H = 20;
const SHOP_VISIBLE = 20; // max rows on screen

// ===== DEATH REPLAY =====
let deathReplay = false;
let deathReplayFrames = [];
let deathReplayIndex = 0;
let deathReplayRecording = [];
let gdReplayRecording = [];
let gdWaveTrail = [];
let replayKind = "snake"; // snake | gd
const REPLAY_MAX = 180; // ~7s at 13fps per death clip
const SAVED_REPLAYS_MAX = 10;
let savedReplays = []; // [{frames, score, mode, time}] newest first
let selectedReplayIdx = 0;
let vPodmenijuReplays = false;
let replayFromMenu = false; // true = after watch go to menu list, false = game over
let deathReplayForward = true; // play forward when watching saved
let deathReplaySpeed = 1; // 0.5x / 1x / 2x playback

// ===== GHOST RACE =====
let ghostRaceEnabled = false;
let ghostPath = []; // [{x,y,len}] recorded from best run
let ghostFrame = 0;
let recordingPath = [];
let bestGhostScore = 0;

// ===== CUSTOM MODE BUILDER =====
let builderFlags = {
    walls: false, mines: false, chaser: false,
    fast: false, multiFood: false, portals: false, foodEffects: false,
    ai: false, homingFood: false, echoShadow: false
};
let builderIzbira = 0;
const builderOptions = [
    { key: "walls", label: "Walls" },
    { key: "mines", label: "Mines" },
    { key: "chaser", label: "Chaser" },
    { key: "fast", label: "Fast speed" },
    { key: "multiFood", label: "Multiple food" },
    { key: "portals", label: "Portals" },
    { key: "foodEffects", label: "Food effects" },
    { key: "homingFood", label: "Homing food" },
    { key: "echoShadow", label: "Echo shadow" },
    { key: "ai", label: "AI plays" }
];
let isCustomMode = false;

// ===== AI LAB / LEVEL BUILDER / DAILY SEED =====
let vPodmenijuAILab = false;
let vPodmenijuLevelBuilder = false;
let aiLabProfile = 0; // 0 Safe, 1 Risky, 2 Perfect, 3 Learning
let aiLabVehicle = 0; // 0 Cube … 8 Dart (no Mini mode — use mini portal)
let aiLearningStats = {
    deaths: 0, spike: 0, gap: 0, ceiling: 0, timing: 0,
    learningLevel: {},
    // Per-vehicle jump/flip bias (positive = act earlier)
    bias: {},
    // deathMarks[vehicle] = [{ x, count, strategy }]
    // strategy cycles so the AI does NOT repeat the same failing timing
    deathMarks: {}
};

// Strategy table: each death at the same spot tries the NEXT offset.
// Positive = jump/act earlier (larger trigger), negative = later (smaller trigger).
const AI_LEARN_STRATEGIES = [
    { jump:  55, midAir: 20, label: "earlier" },
    { jump: 100, midAir: 35, label: "much-earlier" },
    { jump: -45, midAir: 10, label: "later" },
    { jump: -80, midAir:  5, label: "much-later" },
    { jump:  75, midAir: 50, label: "early+hold" },
    { jump: -25, midAir: 40, label: "late+hold" },
    { jump: 130, midAir: 25, label: "very-early" },
    { jump:  30, midAir: 60, label: "hold-long" }
];

function gdAINearestDeathMark(worldX) {
    const marks = (aiLearningStats.deathMarks && aiLearningStats.deathMarks[gdVehicle]) || [];
    let best = null, bestDist = 99999;
    for (let m of marks) {
        const d = abs((m.x != null ? m.x : m) - worldX);
        if (d < bestDist && d < 260) { bestDist = d; best = m; }
    }
    return best;
}

function gdAIStrategyOffset(worldX) {
    if (aiLabProfile !== 3) return { jump: 0, midAir: 0, label: null, count: 0 };
    const mark = gdAINearestDeathMark(worldX);
    if (!mark) return { jump: 0, midAir: 0, label: null, count: 0 };
    // Support legacy number-only marks
    if (typeof mark === "number" || mark.x == null) {
        return { jump: 40, midAir: 15, label: "legacy", count: 1 };
    }
    const strat = AI_LEARN_STRATEGIES[mark.strategy % AI_LEARN_STRATEGIES.length];
    // Scale up slightly with repeat deaths at this mark
    const scale = 1 + min(0.5, (mark.count || 1) * 0.08);
    return {
        jump: strat.jump * scale,
        midAir: strat.midAir * scale,
        label: strat.label,
        count: mark.count || 1
    };
}
let dailySeedMode = false;
let dailySeedScore = 0;
let dailySeedDeaths = 0;
let dailySeedResultSaved = false;
let dailySeedLeaderboard = [];
let levelBuilder = {
    tool: 0, grid: [], cols: 48, rows: 14, testing: false, code: "", selected: null,
    mode: "classic", // "classic" = auto-scroll GD | "platformer" = free-move GD with portals
    name: "My Level",
    saved: [],
    saveIdx: -1,
    inEditor: false, // false = level list browser, true = editing a level
    browserSel: 0,
    msg: "",
    portalTarget: "ship", // selected vehicle for NEXT portal placement
    portalTargetIdx: 1,
    slopeMode: 1, // wave: 0 = flat, 1 = up 45°, -1 = down 45°
    cellMeta: {}, // "r,c" -> { target } for per-portal vehicle
    scrollC: 0, // horizontal editor scroll (columns)
    toolScroll: 0, // scroll offset for tool palette
    musicUrl: "", // optional custom level music (URL)
    draggingScroll: false,
    draggingToolScroll: false,
    decoCells: {}, // legacy
    decoStrokes: [], // legacy freehand
    decoDrawing: false,
    decoEditor: false,
    decoColor: [210, 160, 255],
    decoSize: 0.35,
    decoPreset: null,
    // Pixel-art decorations (like custom head)
    decoDraft: null, // 8x8 color indices 0..8
    decoLibrary: [], // [{ name, grid }]
    decoLibIdx: 0, // selected sprite to place
    decoPlacements: {}, // "r,c" -> { libIdx, grid } stamped on level
    decoPaintColor: 1,

    undoStack: [], redoStack: [], historyLimit: 80, dragPaintLast: "", selectedCell: null, selectedCells: [], selectMode: false, savedPage: 0,
    showHitboxes: false,
    showHitboxTrail: false,
    hitboxTrail: []
};

// ===== PLATFORMER GD STATE =====
// Platformer = EXACT same GD engine as classic, but scroll is controlled by arrow keys.
let gdPlatformerMode = false;
let gdLevelCheckpoint = null; // { scroll, y, vehicle, gDir, size } from builder checkpoint objects
let plrVehicle = "cube";
let plrGravityDir = 1;
let plrSize = 1;
let plrPortals = [];
let plrBlocks = [];
let plrPads = [];
let plrOrbs = [];
let plrSawblades = [];
let plrEndGoal = null;
let plrWaveTrail = [];
let plrRobotJumping = false;
let plrRobotJumpTime = 0;
let plrRobotLatch = false;
let plrBallGravity = 1;
let plrSwingDir = 1;
let plrSwingLatch = false;
let plrInputQueued = false;
let plrJumpLatch = false;
let plrUfoLatch = false;
let plrPortalCool = 0;
let plrInsidePortal = false;
let plrCameraX = 0;
let plrFromBuilder = false;
let plrGroundY = 560;
let plrCeilY = 40;
let plrSpawn = { x: 60, y: 480 };

// GD grid values 1-based index into tools array
const levelBuilderToolsGD = [
    // EXISTING (do not reorder — saved levels use 1-based indices)
    "spike", "spikeDown", "block",
    "padYellow", "padBlue", "padYellowCeil", "padBlueCeil",
    "orbYellow", "orbBlue", "orbDash",
    "portal", "gravityUp", "gravityDown", "secretCoin", "waveSlope", "end",
    // NEW (append only)
    "padPink", "padPinkCeil", "orbPink",
    "portalDual", "sizeMini", "sizeNormal", "endDual",
    // Solid slopes = cut blocks for cube/ship/… (not wave tunnels)
    "slope", "slopeFlip",
    // Sawblades (SIZE changes radius)
    "sawblade",
    // True blue (grav flip only) + black (slam) — existing orbBlue is green-behavior (kept for saves)
    "orbBlueTrue", "orbBlack",
    // NEW append-only (do not reorder above)
    "startPos", "checkpoint",
    // Editor utilities (append only)
    "erase", "deco", "decoErase"
];
const levelBuilderTools = levelBuilderToolsGD;
const LB_PORTAL_TARGETS = ["cube", "ship", "wave", "ufo", "ball", "robot", "swing", "spider", "dart", "mini"];
const LB_OLD_TOOL_COUNT = 16; // bottom row buttons; new tools use right side panel
// World cell size so editor ≈ playfield (WYSIWYG)
const LB_CELL_W = 48;
const LB_CELL_H = 34;
const LB_START_X = 280;
const LB_EDITOR_VISIBLE_COLS = 28; // legacy fallback; prefer lbVisibleCols()
function lbVisibleCols() {
    try {
        if (typeof builderLayout === "function") {
            const v = builderLayout().visCols;
            if (v) return v;
        }
    } catch (e) {}
    return LB_EDITOR_VISIBLE_COLS;
}




// ===== SEASONAL EVENT =====
let seasonalEvent = null; // { name, skin, bonusMult, color, endMsg }
let seasonalClaimed = false;

// ===== AMBIENT AUDIO =====
let ambientNodes = [];
let ambientActive = false;
let menuMusicTimer = 0;
let lastAmbientBg = "";
let musicNextMs = 0;
let musicStep = 0;
let musicBassNextMs = 0;
let musicBassStep = 0;
let musicHatNextMs = 0;

const modes = [
    "Regular", "Food Effects", "Walls",
    "Multiple Food", "Speed Increase", "Portal", "AI Mode",
    "Chaser", "Minefield", "Boss Rush", "Multiplayer",
    "Time Warp", "Homing Food", "Boss Fight", "Echo Shadow",
    "Mirror Snake", "Gravity", "Platformer", "Geometry Dash", "GD Ship", "GD Wave", "GD Swing", "GD Robot", "GD UFO", "GD Ball",
    "GD Spider", "GD Dart", "Daily Challenge",
    "Custom Mode", "Ghost Race", "GD Portal Level", "Stereo Madness", "Wave Skill Tester", "Pulse Factory", "Tower Climb",
    "Snake+GD Hybrid"
];

let selectedMode = 0;
let gameMode = "Regular";

function getSelectableModes() {
    // indices into modes[] excluding Daily Challenge (started from menu option)
    let list = [];
    for (let i = 0; i < modes.length; i++) {
        if (modes[i] !== "Daily Challenge") list.push(i);
    }
    return list;
}
function modeListLayout(slot) {
    // 4 columns x 8 rows so every mode fits on the Start Game screen.
    const cols = 4;
    const col = slot % cols;
    const row = Math.floor(slot / cols);
    const xPos = 75 + col * 150;
    const yPos = 300 + row * 22;
    return { xPos, yPos };
}

let chaosTimer = 0;
let activeEffects = [];
let timeWarpZaloga = 150;

let boss = null;
let player2 = null;
let multiplayerWinner = "";
let p2NextDirX = 0, p2NextDirY = 0;
// Boss Rush state is separate from the classic one-boss Boss Fight mode.
let bossRush = { stage: 1, total: 5, active: false, cleared: false, rewardPaid: false };
const BOSS_RUSH_TYPES = [
    { name: "THE HUNTER", hp: 12, color: [235, 55, 65], moveEvery: 7, attack: "chase" },
    { name: "THE BLINKER", hp: 16, color: [175, 75, 255], moveEvery: 6, attack: "blink" },
    { name: "THE MINER", hp: 20, color: [255, 165, 45], moveEvery: 6, attack: "mines" },
    { name: "THE RUSHER", hp: 24, color: [50, 210, 255], moveEvery: 4, attack: "rush" },
    { name: "THE OVERLORD", hp: 30, color: [255, 70, 190], moveEvery: 3, attack: "finale" }
];
let echoTrail = [];
let echoDelay = 18;

// DAILY
let isDailyChallenge = false;
let dailySeed = 0;
let dailyModifiers = [];
let dailyTargetScore = 16;
let dailyCompletedToday = false;
let dailyBestScore = 0;
let watchingAI = false;

// JUMPSCARE + CUSTOM
let jumpscare = false;
let jumpscareTimer = 0;
let jumpscareChance = 0.10;
let customJumpscareImg = null;
let customBgImg = null;
let showSettings = false;
let fileInput;
let bgFileInput;
let audioCtx = null;
// Practice mode (GD): checkpoints, no coins
let practiceMode = false;
try { practiceMode = localStorage.getItem("practiceMode") === "1"; } catch (e) { practiceMode = false; }
let multiActivateOrbs = false;
let gdOrbHoldConsumed = false; // one orb activation per press/hold; reset only after release
let builderShiftHeld = false;
try { multiActivateOrbs = localStorage.getItem("multiActivateOrbs") === "1"; } catch (e) { multiActivateOrbs = false; }
let practiceCheckpoints = []; // {scroll,x,y,vehicle,vehicle2,dual,gDir,gDir2,size,size2,auto}
let practiceCpIndex = -1;
let practiceLastAutoX = -1e9;
const PRACTICE_AUTO_GAP = 650;

let particles = [];
let screenShake = 0;
let nextDirX = 0;
let nextDirY = 0;
let isNewHighScore = false;

// PLATFORMER
let plr;
let platforms = [];
let plrCoins = [];
let spikes = [];
let goal;
let plrScore = 0;
let plrLives = 3;
let plrWon = false;
let currentPlatformerLevel = 0;
let totalPlatformerLevels = 5;

// TOWER CLIMB: isolated endless vertical platformer.
let tower = { player: null, platforms: [], spikes: [], cameraY: 0, nextY: 0, lastX: 0, lastY: 0, section: 0, score: 0, best: 0, gameOver: false, seed: 1337, ai: false };
let gdScroll = 0;
let gdSpeed = 5.5;
let gdCube = null;
let gdObstacles = [];
let gdGroundY = 0;
let gdWon = false;
let gdStarted = false;
let gdVehicle = "cube"; // cube | ship | wave | swing | robot | ufo | ball | spider | dart | mini
// Dual: TWO independent players (can be different gamemodes e.g. ship + dart)
let gdDual = false;
let gdCube2 = null;
let gdVehicle2 = "cube";
let gdGravityDir2 = -1;
let gdPlayerSize = 1; // primary size scale
let gdPlayerSize2 = 1; // dual twin size scale
let gdWaveTrail2 = [];
const GD_SIZE_NORMAL = 1;
const GD_SIZE_MINI = 0.55;

function gdVehicleBaseSize(v) {
    v = v || gdVehicle;
    if (v === "wave") return 18;
    if (v === "mini") return 16;
    if (v === "dart") return 14;
    if (v === "swing" || v === "ball" || v === "spider") return 24;
    return 28;
}
// Size scale can differ per dual icon
function gdVehicleSize(v, sizeMult) {
    const m = sizeMult != null ? sizeMult : (gdPlayerSize || 1);
    return gdVehicleBaseSize(v) * m;
}
let gdRobotJumpTime = 0;
let gdRobotJumping = false;
let gdRobotJumpLatch = false;
let gdSwingDir = 1;
let gdSwingLatch = false;
let gdSwingInputQueued = false;
let gdSpiderHeldPrev = false;
let gdSpiderTrail = null; // { x, y0, y1, life } vertical line during teleport
let gdSpiderStickY = null; // world Y to stick when onGround (block/slope/floor)
let gdInputArmReady = false; // wait for release after menu click
let gdDashing = false;
let gdDashTimer = 0;
let gdBallInputQueued = false;
let gdAIPilot = false;
let gdAIHold = false;
let gdAIJumpTimer = 0;
let gdAIBallTap = false;
let gdAIUfoCooldown = 0;
let gdAITargetY = null;
let gdAISwingCooldown = 0;
let gdBallGravity = 1;
let gdGravityDir = 1; // 1 = normal, -1 = upside-down (all vehicles)
let gdCeilY = 40;
let gdAITrainingCooldown = 0;
let gdAILearningRuns = 0;

const platformerLevels = [
    {
        platforms: [
            { x: 0, y: 560, w: 240, h: 40, type: "solid" },
            { x: 280, y: 500, w: 130, h: 20, type: "solid" },
            { x: 450, y: 440, w: 110, h: 20, type: "solid" },
            { x: 100, y: 380, w: 110, h: 18, type: "solid" },
            { x: 300, y: 320, w: 150, h: 18, type: "moving", baseX: 300, range: 60, speed: 1.0 },
            { x: 500, y: 260, w: 90, h: 18, type: "solid" },
            { x: 50, y: 200, w: 120, h: 18, type: "solid" },
            { x: 260, y: 150, w: 100, h: 18, type: "moving", baseX: 260, range: 70, speed: 1.2 },
            { x: 430, y: 100, w: 140, h: 18, type: "solid" },
            { x: 0, y: 40, w: 200, h: 20, type: "solid" }
        ],
        coins: [
            { x: 320, y: 460 }, { x: 490, y: 400 }, { x: 150, y: 340 },
            { x: 360, y: 280 }, { x: 540, y: 220 }, { x: 100, y: 160 },
            { x: 300, y: 110 }, { x: 500, y: 60 }, { x: 80, y: 10 }
        ],
        spikes: [ { x: 250, y: 545, w: 25, h: 15 }, { x: 420, y: 545, w: 25, h: 15 } ],
        goal: { x: 50, y: 5, w: 40, h: 35 },
        start: { x: 60, y: 480 }
    },
    {
        platforms: [
            { x: 0, y: 560, w: 180, h: 40, type: "solid" },
            { x: 220, y: 500, w: 90, h: 18, type: "moving", baseX: 220, range: 70, speed: 1.2 },
            { x: 400, y: 450, w: 100, h: 18, type: "solid" },
            { x: 80, y: 390, w: 110, h: 18, type: "solid" },
            { x: 280, y: 340, w: 80, h: 18, type: "moving", baseX: 280, range: 90, speed: 1.5 },
            { x: 450, y: 280, w: 120, h: 18, type: "solid" },
            { x: 40, y: 220, w: 100, h: 18, type: "solid" },
            { x: 210, y: 170, w: 90, h: 18, type: "moving", baseX: 210, range: 80, speed: 1.4 },
            { x: 400, y: 120, w: 110, h: 18, type: "solid" },
            { x: 100, y: 60, w: 150, h: 18, type: "solid" }
        ],
        coins: [
            { x: 260, y: 460 }, { x: 440, y: 410 }, { x: 130, y: 350 },
            { x: 320, y: 300 }, { x: 500, y: 240 }, { x: 80, y: 180 },
            { x: 250, y: 130 }, { x: 450, y: 80 }, { x: 160, y: 20 }
        ],
        spikes: [
            { x: 190, y: 545, w: 25, h: 15 }, { x: 360, y: 545, w: 25, h: 15 },
            { x: 200, y: 375, w: 20, h: 15 }
        ],
        goal: { x: 120, y: 25, w: 40, h: 35 },
        start: { x: 40, y: 500 }
    },
    {
        platforms: [
            { x: 0, y: 560, w: 120, h: 40, type: "solid" },
            { x: 160, y: 510, w: 70, h: 16, type: "solid" },
            { x: 270, y: 460, w: 70, h: 16, type: "moving", baseX: 270, range: 60, speed: 1.3 },
            { x: 400, y: 410, w: 80, h: 16, type: "solid" },
            { x: 60, y: 350, w: 90, h: 16, type: "solid" },
            { x: 220, y: 300, w: 70, h: 16, type: "moving", baseX: 220, range: 80, speed: 1.6 },
            { x: 380, y: 250, w: 90, h: 16, type: "solid" },
            { x: 100, y: 190, w: 80, h: 16, type: "solid" },
            { x: 290, y: 140, w: 70, h: 16, type: "moving", baseX: 290, range: 70, speed: 1.5 },
            { x: 450, y: 90, w: 110, h: 16, type: "solid" },
            { x: 30, y: 40, w: 130, h: 18, type: "solid" }
        ],
        coins: [
            { x: 190, y: 480 }, { x: 300, y: 420 }, { x: 430, y: 370 },
            { x: 100, y: 310 }, { x: 250, y: 260 }, { x: 420, y: 210 },
            { x: 140, y: 150 }, { x: 320, y: 100 }, { x: 500, y: 50 }, { x: 70, y: 10 }
        ],
        spikes: [
            { x: 130, y: 545, w: 25, h: 15 }, { x: 250, y: 545, w: 25, h: 15 },
            { x: 180, y: 335, w: 20, h: 15 }, { x: 320, y: 235, w: 20, h: 15 }
        ],
        goal: { x: 50, y: 5, w: 40, h: 35 },
        start: { x: 30, y: 510 }
    },
    {
        platforms: [
            { x: 0, y: 560, w: 150, h: 40, type: "solid" },
            { x: 200, y: 480, w: 80, h: 16, type: "solid" },
            { x: 340, y: 420, w: 70, h: 16, type: "moving", baseX: 340, range: 80, speed: 1.7 },
            { x: 90, y: 360, w: 90, h: 16, type: "solid" },
            { x: 260, y: 300, w: 80, h: 16, type: "moving", baseX: 260, range: 90, speed: 1.6 },
            { x: 450, y: 250, w: 100, h: 16, type: "solid" },
            { x: 50, y: 190, w: 80, h: 16, type: "solid" },
            { x: 210, y: 140, w: 70, h: 16, type: "moving", baseX: 210, range: 70, speed: 1.5 },
            { x: 380, y: 90, w: 90, h: 16, type: "solid" },
            { x: 150, y: 40, w: 110, h: 18, type: "solid" }
        ],
        coins: [
            { x: 240, y: 440 }, { x: 370, y: 380 }, { x: 130, y: 320 },
            { x: 300, y: 260 }, { x: 500, y: 210 }, { x: 90, y: 150 },
            { x: 240, y: 100 }, { x: 420, y: 50 }, { x: 180, y: 10 }
        ],
        spikes: [
            { x: 160, y: 545, w: 25, h: 15 }, { x: 300, y: 545, w: 25, h: 15 },
            { x: 190, y: 345, w: 20, h: 15 }, { x: 360, y: 235, w: 20, h: 15 }
        ],
        goal: { x: 160, y: 5, w: 40, h: 35 },
        start: { x: 40, y: 500 }
    },
    {
        platforms: [
            { x: 0, y: 560, w: 130, h: 40, type: "solid" },
            { x: 170, y: 510, w: 60, h: 14, type: "moving", baseX: 170, range: 50, speed: 1.5 },
            { x: 290, y: 460, w: 60, h: 14, type: "solid" },
            { x: 410, y: 420, w: 60, h: 14, type: "moving", baseX: 410, range: 60, speed: 1.8 },
            { x: 70, y: 370, w: 70, h: 14, type: "solid" },
            { x: 210, y: 320, w: 60, h: 14, type: "moving", baseX: 210, range: 80, speed: 1.7 },
            { x: 370, y: 270, w: 80, h: 14, type: "solid" },
            { x: 90, y: 210, w: 60, h: 14, type: "solid" },
            { x: 230, y: 160, w: 60, h: 14, type: "moving", baseX: 230, range: 70, speed: 1.6 },
            { x: 400, y: 110, w: 90, h: 14, type: "solid" },
            { x: 110, y: 50, w: 110, h: 16, type: "solid" }
        ],
        coins: [
            { x: 200, y: 480 }, { x: 320, y: 420 }, { x: 440, y: 380 },
            { x: 100, y: 330 }, { x: 240, y: 280 }, { x: 400, y: 230 },
            { x: 120, y: 170 }, { x: 260, y: 120 }, { x: 440, y: 70 }, { x: 150, y: 15 }
        ],
        spikes: [
            { x: 140, y: 545, w: 25, h: 15 }, { x: 260, y: 545, w: 25, h: 15 },
            { x: 370, y: 545, w: 25, h: 15 }, { x: 160, y: 355, w: 20, h: 15 },
            { x: 300, y: 255, w: 20, h: 15 }
        ],
        goal: { x: 120, y: 15, w: 40, h: 35 },
        start: { x: 30, y: 510 }
    }
];

let rekordi = {};
let zvezde = [];
let matrixStolpci = [];
let leaves = [];
let bubbles = [];
let fireflies = [];


function matrixRandomChar() {
    let r = random();
    if (r < 0.45) return String.fromCharCode(0x30A0 + floor(random(96))); // katakana
    if (r < 0.65) return String(floor(random(10))); // digits
    if (r < 0.80) return String.fromCharCode(33 + floor(random(15))); // symbols !"#$...
    if (r < 0.92) return String.fromCharCode(65 + floor(random(26))); // A-Z
    return String.fromCharCode(0xFF66 + floor(random(50))); // halfwidth kana-ish
}

function setup() {
    createCanvas(sirina, sirina);
    frameRate(13);
    initParticlePool();
    document.addEventListener('contextmenu', e => e.preventDefault());

    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}

    fileInput = createFileInput(handleJumpscareImage);
    fileInput.position(-1000, -1000);
    bgFileInput = createFileInput(handleBgImage);
    bgFileInput.position(-1000, -1000);

    for (let i = 0; i < gridVelikost; i++) {
        customHeadGrid[i] = []; customTailGrid[i] = [];
        for (let j = 0; j < gridVelikost; j++) { customHeadGrid[i][j] = 0; customTailGrid[i][j] = 0; }
    }
    for (let i = 0; i < bgGridVelikost; i++) {
        customBgGrid[i] = [];
        for (let j = 0; j < bgGridVelikost; j++) customBgGrid[i][j] = 0;
    }

    for (let i = 0; i < 80; i++) zvezde.push({ x: random(sirina), y: random(sirina), r: random(1, 3) });
    // denser matrix columns with mixed glyph sets
    for (let i = 0; i < sirina / 12; i++) {
        matrixStolpci.push({ y: random(-sirina, 0), speed: random(0.8, 2.2), chars: [], glitch: floor(random(20)) });
        for (let c = 0; c < 32; c++) matrixStolpci[i].chars.push(matrixRandomChar());
    }
    for (let i = 0; i < 35; i++) {
        leaves.push({
            x: random(sirina), y: random(-sirina, sirina), size: random(4, 11), speed: random(0.4, 1.2),
            rot: random(TWO_PI), rotSpeed: random(-0.03, 0.03),
            color: [random(30, 80), random(90, 160), random(20, 50)]
        });
    }
    for (let i = 0; i < 25; i++) bubbles.push({ x: random(sirina), y: random(sirina), r: random(2, 7), speed: random(0.3, 1.1) });
    for (let i = 0; i < 18; i++) fireflies.push({ x: random(sirina), y: random(sirina), phase: random(TWO_PI) });

    for (let m of modes) rekordi[m] = Number(localStorage.getItem("snakeHighScore_" + m)) || 0;
    kovanci = Number(localStorage.getItem("snakeCoins")) || 0;

    if (localStorage.getItem("jumpscareChance")) jumpscareChance = Number(localStorage.getItem("jumpscareChance"));
    if (localStorage.getItem("kupljeneKoze")) kupljeneKoze = JSON.parse(localStorage.getItem("kupljeneKoze"));
    if (localStorage.getItem("kupljenaOzadja")) kupljenaOzadja = JSON.parse(localStorage.getItem("kupljenaOzadja"));
    if (localStorage.getItem("kupljeniDodatki")) kupljeniDodatki = JSON.parse(localStorage.getItem("kupljeniDodatki"));

    if (localStorage.getItem("achievements")) achievements = Object.assign(achievements, JSON.parse(localStorage.getItem("achievements")));
    if (localStorage.getItem("unlockedRewards")) unlockedRewards = Object.assign(unlockedRewards, JSON.parse(localStorage.getItem("unlockedRewards")));
    try {
        const ls = localStorage.getItem("customSavedLevels");
        if (ls) levelBuilder.saved = JSON.parse(ls);
        if (!Array.isArray(levelBuilder.saved)) levelBuilder.saved = [];
        // Remove failed demo level if present
        levelBuilder.saved = levelBuilder.saved.filter(s => s && s.id !== "level-twin-pulse" && s.name !== "Twin Pulse");
        try { localStorage.setItem("customSavedLevels", JSON.stringify(levelBuilder.saved)); } catch (e2) {}
    } catch (e) { levelBuilder.saved = []; }

    try { syncAchievementRewards(); } catch (e) {}

    dailyCompletions = Number(localStorage.getItem("dailyCompletions")) || 0;
    totalDeaths = Number(localStorage.getItem("totalDeaths")) || 0;
    syncAchievementRewards(); // fix missing rewards from older saves

    loadCustomGrid("customHeadGrid", customHeadGrid, gridVelikost);
    loadCustomGrid("customTailGrid", customTailGrid, gridVelikost);
    loadCustomGrid("customBgGrid", customBgGrid, bgGridVelikost);

    trenutnaKoza = localStorage.getItem("trenutnaKoza") || "Cyan";
    trenutnoOzadje = localStorage.getItem("trenutnoOzadje") || "Magenta";
    trenutniDodatek = localStorage.getItem("trenutniDodatek") || "None";
    equipCustomHead = localStorage.getItem("equipCustomHead") === "true";
    equipCustomTail = localStorage.getItem("equipCustomTail") === "true";
    equipCustomBg = localStorage.getItem("equipCustomBg") === "true";
    equipNeonTrail = localStorage.getItem("equipNeonTrail") === "true";
    equipSparkleAura = localStorage.getItem("equipSparkleAura") === "true";
    equipGhostAura = localStorage.getItem("equipGhostAura") === "true";
    upgradeCoins = Number(localStorage.getItem("upgradeCoins")) || 0;
    if (localStorage.getItem("boostTickets")) {
        try {
            boostTickets = Object.assign(boostTickets, JSON.parse(localStorage.getItem("boostTickets")));
            delete boostTickets.shield; delete boostTickets.secondWind; delete boostTickets.magnet;
        } catch (e) {}
    }
    if (localStorage.getItem("savedDeathReplays")) {
        try {
            savedReplays = JSON.parse(localStorage.getItem("savedDeathReplays"));
            if (!Array.isArray(savedReplays)) savedReplays = [];
            savedReplays = savedReplays.slice(0, SAVED_REPLAYS_MAX);
            savedReplays = savedReplays.filter(r => r && Array.isArray(r.frames));
        } catch (e) { savedReplays = []; }
    }
    if (localStorage.getItem("ghostPath")) {
        try {
            ghostPath = JSON.parse(localStorage.getItem("ghostPath"));
            bestGhostScore = Number(localStorage.getItem("bestGhostScore")) || 0;
        } catch (e) { ghostPath = []; }
    }
    if (localStorage.getItem("builderFlags")) {
        try {
            builderFlags = Object.assign(builderFlags, JSON.parse(localStorage.getItem("builderFlags")));
            delete builderFlags.shrink;
            builderFlags.shrink = false;
            localStorage.setItem("builderFlags", JSON.stringify(builderFlags));
        } catch (e) {}
    }
    seasonalClaimed = localStorage.getItem("seasonalClaimed_" + getSeasonalId()) === "true";
    initSeasonalEvent();
    if (isSeasonalSkin(trenutnaKoza) && !isSeasonalSkinInSeason(trenutnaKoza)) {
        trenutnaKoza = "Cyan";
        localStorage.setItem("trenutnaKoza", trenutnaKoza);
    }
    if (isSeasonalBg(trenutnoOzadje) && !isSeasonalBgInSeason(trenutnoOzadje)) {
        trenutnoOzadje = "Magenta";
        localStorage.setItem("trenutnoOzadje", trenutnoOzadje);
    }

    let today = getTodayString();
    dailyBestScore = Number(localStorage.getItem("dailyBest_" + today)) || 0;
    dailyCompletedToday = localStorage.getItem("dailyDone_" + today) === "true";
    try { dailySeedLeaderboard = JSON.parse(localStorage.getItem("dailySeedLeaderboard_" + today) || "[]"); } catch (e) { dailySeedLeaderboard = []; }
    try { aiLearningStats = Object.assign(aiLearningStats, JSON.parse(localStorage.getItem("aiLearningStats") || "{}")); } catch (e) {}
    generateDailyChallenge();

    if (localStorage.getItem("soundEnabled") !== null) soundEnabled = localStorage.getItem("soundEnabled") === "true";
    if (localStorage.getItem("masterVolume")) masterVolume = constrain(Number(localStorage.getItem("masterVolume")), 0, 1);
    // Tutorial on first ever launch
    if (localStorage.getItem("tutorialDone") !== "true") {
        tutorialActive = true;
        tutorialStep = 0;
        introActive = true;
    }
    introTimer = 0;
    introActive = true;
    // Try start music (may stay silent until user gesture unlocks AudioContext)
    tryStartMusic();
    // safety: mode index in range
    if (selectedMode < 0 || selectedMode >= modes.length) selectedMode = 0;
    if (!modes.includes(gameMode)) gameMode = "Regular";
}

// Global error surface for p5
window.addEventListener("error", function (ev) {
    console.error("Snake Ultra error:", ev.message, ev.filename, ev.lineno);
});


function upgradeCost(level, baseIdx) {
    return Math.floor(UPGRADE_BASE[baseIdx] * Math.pow(1.45, level));
}

function applyPreRunBoosts() {
    // Charge and apply selected boosts at run start
    let cost = 0;
    let ticketsUsed = [];
    const useTicketOrCost = (enabled, key, price) => {
        if (!enabled) return;
        if (boostTickets[key] > 0) { boostTickets[key]--; ticketsUsed.push(key); }
        else cost += price;
    };
    useTicketOrCost(boostStartLen, "startLen", 50);
    useTicketOrCost(boostLuckyRun, "luckyRun", 200);
    if (cost > 0 && kovanci >= cost) {
        kovanci -= cost;
        localStorage.setItem("snakeCoins", kovanci);
        playBuySound();
    } else if (cost > 0 && kovanci < cost) {
        // Can't afford — restore tickets and disable unpaid boosts
        for (let key of ticketsUsed) boostTickets[key]++;
        ticketsUsed = [];
        // Can't afford — disable unpaid boosts
        if (boostLuckyRun && kovanci < cost) { boostLuckyRun = false; cost -= 200; }
        if (boostStartLen && kovanci < cost) { boostStartLen = false; cost -= 50; }
        if (cost > 0 && kovanci >= cost) {
            kovanci -= cost;
            localStorage.setItem("snakeCoins", kovanci);
        }
    }
    if (ticketsUsed.length > 0) saveBoostTickets();
    if (boostStartLen && k) k.dolzina = 3;
    // lucky run handled when earning coins
}

function doGamble() {
    if (kovanci < 100) return;
    kovanci -= 100;
    localStorage.setItem("snakeCoins", kovanci);
    let roll = random();
    if (roll < 0.40) {
        gambleResult = { type: "coins", amount: 0, msg: "Nič... 💀" };
    } else if (roll < 0.65) {
        gambleResult = { type: "coins", amount: 50, msg: "+50 🪙" };
        kovanci += 50;
    } else if (roll < 0.82) {
        gambleResult = { type: "coins", amount: 150, msg: "+150 🪙" };
        kovanci += 150;
    } else if (roll < 0.93) {
        gambleResult = { type: "coins", amount: 300, msg: "+300 🪙 JACKPOT!" };
        kovanci += 300;
    } else {
        // rare jackpot: coins only (recolor has been removed)
        gambleResult = { type: "coins", amount: 500, msg: "+500 🪙 MEGA JACKPOT!" };
        kovanci += 500;
    }
    localStorage.setItem("snakeCoins", kovanci);
    gambleTimer = 90;
    playBuySound();
}

function saveBoostTickets() {
    localStorage.setItem("boostTickets", JSON.stringify(boostTickets));
}

function doBoostGamble() {
    if (kovanci < 100) return;
    kovanci -= 100;
    localStorage.setItem("snakeCoins", kovanci);
    const rewards = [
        { key: "startLen", name: "Start +3 length", weight: 30 },
                { key: "luckyRun", name: "Lucky Run", weight: 9 },
        { key: "jackpot", name: "2× Boost Tickets", weight: 1 }
    ];
    let roll = random() * 100;
    let picked = rewards[0];
    for (let r of rewards) {
        if (roll < r.weight) { picked = r; break; }
        roll -= r.weight;
    }
    if (picked.key === "jackpot") {
        let second = rewards[floor(random() * 5)];
        boostTickets[second.key] += 2;
        boostGambleResult = { msg: "🎉 2× " + second.name + " TICKETS!", amount: 2 };
    } else {
        boostTickets[picked.key]++;
        boostGambleResult = { msg: "🎟 " + picked.name + " TICKET!", amount: 1 };
    }
    saveBoostTickets();
    boostGambleTimer = 90;
    playBuySound();
}

function tryRevive() {
    if (revivedThisRun || !k || kovanci < REVIVE_COST) return false;
    kovanci -= REVIVE_COST;
    localStorage.setItem("snakeCoins", kovanci);
    revivedThisRun = true;
    gameOver = false;
    jumpscare = false;
    k.smrt = false;
    k.ghost = false;
    k.reverse = false;
    k.dolzina = max(0, floor(k.dolzina / 2));
    while (k.rep.length > k.dolzina) k.rep.shift();
    playWinSound();
    spawnParticles(k.x + velikost / 2, k.y + velikost / 2, 20, color(100, 255, 200));
    return true;
}

function tryPlatformerContinue() { return false; }

function handleSpendKeys() {
    if (spendTab === 0) {
        // Boosts: 3 non-rescue toggles
        if (keyCode === UP_ARROW) { spendIzbira = (spendIzbira - 1 + 3) % 3; playMenuSound(); }
        if (keyCode === DOWN_ARROW) { spendIzbira = (spendIzbira + 1) % 3; playMenuSound(); }
        if (keyCode === 32 || keyCode === ENTER) {
            if (spendIzbira === 0) boostStartLen = !boostStartLen;
            else if (spendIzbira === 1) boostMagnet = !boostMagnet;
            else if (spendIzbira === 2) boostLuckyRun = !boostLuckyRun;
            playMenuSound();
        }
    } else if (spendTab === 1) {
        // Gamble
        if (keyCode === 32 || keyCode === ENTER) doGamble();
    } else if (spendTab === 2) {
        // Upgrades: coin bonus only (Food Sense removed).
        if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) { spendIzbira = 0; playMenuSound(); }
        if (keyCode === 32 || keyCode === ENTER) {
            if (upgradeCoins < UPGRADE_MAX) {
                let c = upgradeCost(upgradeCoins, 2);
                if (kovanci >= c) {
                    kovanci -= c; upgradeCoins++;
                    localStorage.setItem("snakeCoins", kovanci);
                    localStorage.setItem("upgradeCoins", upgradeCoins);
                    playBuySound();
                }
            }
        }
    } else if (spendTab === 3) {
        // Second Gamble: boost tickets
        if (keyCode === 32 || keyCode === ENTER) doBoostGamble();
    }
}

function builderOptionLayout(i) {
    let col = i % 2;
    let row = floor(i / 2);
    return { x: 55 + col * 280, y: 115 + row * 38 };
}

// ===== SNAKE LEVEL EDITOR =====
// ===== SNAKE + GD HYBRID =====
// Stages alternate snake growth with longer GD segments across vehicles.
const HYBRID_GD_VEHICLES = ["cube", "ship", "wave", "ball", "ufo", "robot", "swing", "spider", "dart", "mini"];
const HYBRID_SNAKE_TARGETS = [5, 8, 11, 14, 17, 20, 24]; // length to trigger each GD stage

function hybridBuildCourse(vehicle, stageIdx) {
    gdObstacles = [];
    const g = gdGroundY;
    const n = 14 + stageIdx * 4; // longer each stage
    const gap = vehicle === "wave" ? 160 : (vehicle === "ship" ? 170 : 185);
    let x = 380;
    for (let i = 0; i < n; i++) {
        x += gap;
        const roll = i % 5;
        if (vehicle === "wave") {
            if (roll === 0) gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
            else if (roll === 1) gdObstacles.push({ type: "spikeDown", x: x, y: gdCeilY + 10, w: 20, h: 20 });
            else if (roll === 2) {
                const half = 50;
                const y0 = (g + gdCeilY) / 2;
                gdObstacles.push({ type: "waveSlope", x: x, w: 80, top1: y0 - half, top2: y0 - half - 40, bottom1: y0 + half, bottom2: y0 + half - 40, slope: -0.5 });
            } else gdObstacles.push({ type: "spike", x: x + 30, y: g - 20, w: 20, h: 20 });
        } else if (vehicle === "ship" || vehicle === "ufo") {
            if (roll === 0) gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
            else if (roll === 1) gdObstacles.push({ type: "spikeDown", x: x, y: gdCeilY + 8, w: 20, h: 20 });
            else if (roll === 2) gdObstacles.push({ type: "block", x: x, y: g - 70, w: 36, h: 70 });
            else gdObstacles.push({ type: "block", x: x, y: gdCeilY + 20, w: 36, h: 50 });
        } else if (vehicle === "ball" || vehicle === "swing") {
            if (roll === 0) gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
            else if (roll === 1) gdObstacles.push({ type: "spikeDown", x: x, y: gdCeilY + 8, w: 20, h: 20 });
            else if (roll === 2) gdObstacles.push({ type: "block", x: x, y: g - 55, w: 40, h: 55 });
            else if (roll === 3) gdObstacles.push({ type: "padYellow", x: x, y: g - 14, w: 44, h: 14, facing: 1 });
            else gdObstacles.push({ type: "padBlue", x: x, y: g - 14, w: 44, h: 14, facing: 1 });
        } else if (vehicle === "robot") {
            if (roll < 2) gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
            else if (roll === 2) gdObstacles.push({ type: "block", x: x, y: g - 60, w: 40, h: 60 });
            else gdObstacles.push({ type: "orbYellow", x: x, y: g - 80, w: 26, h: 26 });
        } else if (vehicle === "spider") {
            if (roll === 0) gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
            else if (roll === 1) gdObstacles.push({ type: "spikeDown", x: x, y: gdCeilY + 8, w: 20, h: 20 });
            else if (roll === 2) gdObstacles.push({ type: "block", x: x, y: g - 55, w: 40, h: 55 });
            else if (roll === 3) gdObstacles.push({ type: "padBlue", x: x, y: g - 14, w: 44, h: 14, facing: 1 });
            else gdObstacles.push({ type: "block", x: x, y: gdCeilY + 20, w: 36, h: 50 });
        } else if (vehicle === "dart") {
            if (roll === 0) gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
            else if (roll === 1) gdObstacles.push({ type: "spikeDown", x: x, y: gdCeilY + 8, w: 20, h: 20 });
            else if (roll === 2) gdObstacles.push({ type: "block", x: x, y: g - 70, w: 36, h: 70 });
            else gdObstacles.push({ type: "block", x: x, y: gdCeilY + 20, w: 36, h: 55 });
        } else if (vehicle === "mini") {
            if (roll === 0) gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
            else if (roll === 1) gdObstacles.push({ type: "block", x: x, y: g - 40, w: 28, h: 40 });
            else if (roll === 2) gdObstacles.push({ type: "spike", x: x + 30, y: g - 20, w: 16, h: 20 });
            else if (roll === 3) gdObstacles.push({ type: "padYellow", x: x, y: g - 14, w: 36, h: 14, facing: 1 });
            else gdObstacles.push({ type: "block", x: x, y: g - 32, w: 28, h: 32 });
        } else {
            // cube default
            if (roll === 0) gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
            else if (roll === 1) gdObstacles.push({ type: "block", x: x, y: g - 50, w: 40, h: 50 });
            else if (roll === 2) gdObstacles.push({ type: "spike", x: x + 40, y: g - 20, w: 20, h: 20 });
            else if (roll === 3) gdObstacles.push({ type: "padYellow", x: x, y: g - 14, w: 44, h: 14, facing: 1 });
            else gdObstacles.push({ type: "block", x: x, y: g - 40, w: 36, h: 40 });
        }
    }
    gdObstacles.push({ type: "goal", x: x + gap + 120, y: gdCeilY, w: 14, h: g - gdCeilY });
}

function startHybridGDPhase() {
    hybridPhase = "gd";
    hybridScore = k ? k.dolzina : hybridScore;
    hybridPortalTriggered = true;
    const vehicle = HYBRID_GD_VEHICLES[Math.min(hybridStage, HYBRID_GD_VEHICLES.length - 1)];
    gdVehicle = vehicle;
    gdGroundY = sirina - 80;
    gdCeilY = 40;
    gdScroll = 0;
    gdSpeed = 5.2 + hybridStage * 0.15;
    gdWon = false;
    gameOver = false;
    gdStarted = true;
    gdGravityDir = 1;
    gdBallGravity = 1;
    gdSwingDir = 1;
    gdSwingLatch = false;
    gdSwingInputQueued = false;
    gdBallInputQueued = false;
    const sz = gdVehicleSize(vehicle);
    gdCube = { x: 100, y: gdGroundY - sz, w: sz, h: sz, vy: 0, onGround: true, rot: 0, shipUp: false };
    hybridBuildCourse(vehicle, hybridStage);
    frameRate(60);
    spawnParticles(sirina / 2, sirina / 2, 40, color(0, 255, 200));
    playWinSound();
}

function returnFromHybridGD() {
    hybridPhase = "snake";
    hybridStage++;
    frameRate(13);
    gameOver = false;
    gdWon = false;
    gdCube = null;
    gdObstacles = [];
    // next snake target
    if (hybridStage < HYBRID_SNAKE_TARGETS.length) {
        hybridSnakeTarget = HYBRID_SNAKE_TARGETS[hybridStage];
        hybridPortalTriggered = false; // allow next GD after more growth
    } else {
        // all stages done — victory bonus
        hybridPortalTriggered = true;
        if (k) k.dolzina += 10;
        winScreen = true;
        kovanci += 100;
        localStorage.setItem("snakeCoins", kovanci);
        playWinSound();
    }
    if (k) { k.smrt = false; k.ghost = true; addEffect("GHOST", 50); }
    spawnParticles(sirina / 2, sirina / 2, 30, color(255, 200, 50));
    playBuySound();
}

function drawBuilderMenu() {
    textSize(22); fill("cyan"); textAlign(CENTER, CENTER); text("🛠 CUSTOM MODE BUILDER", sirina / 2, 42);
    fill(180); textSize(12); text("Vklopi/izklopi modifierje, nato START RUN", sirina / 2, 70);
    textAlign(LEFT, CENTER);
    for (let i = 0; i < builderOptions.length; i++) {
        let o = builderOptions[i];
        let lay = builderOptionLayout(i);
        if (i === builderIzbira) { fill("yellow"); text("▶", lay.x - 20, lay.y); }
        fill(builderFlags[o.key] ? "lime" : "white"); textSize(15);
        text((builderFlags[o.key] ? "[ON]  " : "[OFF] ") + o.label, lay.x, lay.y);
    }
    textAlign(CENTER, CENTER);
    let startY = 115 + ceil(builderOptions.length / 2) * 38 + 36;
    fill(builderIzbira === builderOptions.length ? color(255, 230, 60) : color(255, 150, 40));
    rect(sirina / 2 - 120, startY - 24, 240, 48, 12);
    fill(20); textSize(18);
    text((builderIzbira === builderOptions.length ? "> " : "") + "▶ START RUN", sirina / 2, startY);
    fill(150); textSize(12); text("UP/DOWN  •  ENTER = toggle/start  •  ESC = nazaj", sirina / 2, sirina - 25);
}

function drawSpendMenu() {
    textSize(22); fill("yellow"); textAlign(CENTER, CENTER); text("💰 SPEND COINS", sirina / 2, 42);
    fill("gold"); textSize(16); text(`💰 ${kovanci}`, sirina / 2, 68);
    stroke(255, 40); line(40, 82, sirina - 40, 82); noStroke();

    textSize(13);
    fill(spendTab === 0 ? "cyan" : "white"); text("⚡ BOOSTS", 58, 100);
    fill(spendTab === 1 ? "cyan" : "white"); text("🎰 GAMBLE", 165, 100);
    fill(spendTab === 2 ? "cyan" : "white"); text("⬆ UPGRADES", 275, 100);
    fill(spendTab === 3 ? "cyan" : "white"); text("🎟 BOOST GAMBLE", 410, 100);

    textAlign(LEFT, CENTER);
    if (spendTab === 0) {
        let boosts = [
            { name: "Start +3 length", cost: 50, on: boostStartLen },
            { name: "8s Magnet", cost: 100, on: boostMagnet },
            { name: "Lucky Run (2x coins)", cost: 200, on: boostLuckyRun }
        ];
        let total = 0;
        for (let i = 0; i < boosts.length; i++) {
            let b = boosts[i];
            let y = 130 + i * 36;
            if (i === spendIzbira) { fill("yellow"); text("▶", 30, y); }
            fill(b.on ? "lime" : "white"); textSize(15);
            text((b.on ? "[ON] " : "[OFF] ") + b.name, 55, y);
            fill("gold"); text(`🪙 ${b.cost}`, 400, y);
            if (b.on) total += b.cost;
        }
        textAlign(CENTER); fill(total > kovanci ? "red" : "orange"); textSize(14);
        text("Skupaj za naslednji run: 🪙 " + total + (total > kovanci ? " (premalo!)" : ""), sirina / 2, 360);
        fill(180); textSize(12); text("ENTER = vklop/izklop  •  plača se ob START GAME", sirina / 2, 390);
    } else if (spendTab === 1) {
        textAlign(CENTER, CENTER);
        fill(255); textSize(18); text("Stavi 100 🪙 za naključno nagrado", sirina / 2, 160);
        fill(200); textSize(13);
        text("40% nič  •  25% +50  •  17% +150", sirina / 2, 200);
        text("11% +300  •  7% +500", sirina / 2, 225);
        fill(kovanci >= 100 ? "lime" : "red"); textSize(20);
        text(kovanci >= 100 ? "ENTER / SPACE = IGRAJ" : "Premalo kovancev", sirina / 2, 280);
        if (gambleResult && gambleTimer > 0) {
            fill(gambleResult.amount > 0 ? "lime" : "orange");
            textSize(28); text(gambleResult.msg, sirina / 2, 340);
            gambleTimer--;
        }
    } else if (spendTab === 2) {
        let ups = [
            { name: "Bonus coins / food", level: upgradeCoins, idx: 2, desc: upgradeCoins > 0 ? " +1 vsakih " + max(3, 10 - upgradeCoins) + " hrane" : "Ni še" }
        ];
        for (let i = 0; i < ups.length; i++) {
            let u = ups[i];
            let y = 140 + i * 55;
            if (i === spendIzbira) { fill("yellow"); text("▶", 30, y); }
            fill("white"); textSize(15); text(u.name + "  Lv." + u.level + "/" + UPGRADE_MAX, 55, y);
            fill(180); textSize(12); text(u.desc, 55, y + 18);
            if (u.level < UPGRADE_MAX) {
                let c = upgradeCost(u.level, u.idx);
                fill(kovanci >= c ? "gold" : "red"); textSize(14); text(`🪙 ${c}`, 450, y);
            } else {
                fill("lime"); text("MAX", 450, y);
            }
        }
        textAlign(CENTER); fill(180); textSize(12); text("ENTER = kupi naslednji nivo", sirina / 2, 340);
    } else if (spendTab === 3) {
        textAlign(CENTER, CENTER);
        fill("cyan"); textSize(20); text("🎟 GAMBLE BOOSTS", sirina / 2, 150);
        fill(220); textSize(13);
        text("Stavi 100 🪙 za naključni Boost Ticket", sirina / 2, 185);
        text("Start • Magnet • Lucky Coins", sirina / 2, 220);
        text("Rescue boosts are disabled — only 250-coin revive", sirina / 2, 242);
        fill(kovanci >= 100 ? "lime" : "red"); textSize(18);
        text(kovanci >= 100 ? "ENTER / SPACE = IGRAJ" : "Premalo kovancev", sirina / 2, 280);
        fill(180); textSize(12);
        text("Ticketi se uporabijo brezplačno, ko vklopiš boost.", sirina / 2, 305);
        text("Start: " + boostTickets.startLen + "  Lucky: " + boostTickets.luckyRun, sirina / 2, 330);
        if (boostGambleResult && boostGambleTimer > 0) {
            fill("lime"); textSize(25); text(boostGambleResult.msg, sirina / 2, 390);
            boostGambleTimer--;
        }
    }
    textAlign(CENTER); fill("orange"); textSize(12);
    text("LEFT/RIGHT = zavihek  •  ESC = nazaj", sirina / 2, sirina - 18);
}

function drawAILabMenu() {
    // Full opaque clear so main menu never shows underneath / at the bottom.
    background(8, 10, 24);
    noStroke();
    fill(8, 10, 24);
    rect(0, 0, sirina, sirina);
    textAlign(CENTER, CENTER);
    fill(0, 255, 210); textSize(28); text("AI LAB  eng v8", sirina/2, 38);
    fill(180); textSize(12); text("Izberi profil + GD vozilo. Vsak profil uporablja drugačen timing.", sirina/2, 66);
    fill(110,220,255); textSize(10);
    const pd=["SAFE: zgodaj + velike varnostne rezerve","RISKY: pozno + krajši odzivni okni","PERFECT: dolga napoved + simulacija","LEARNING: po vsaki smrti skoči prej + večja rezerva"];
    text(pd[aiLabProfile], sirina/2, 82);
    const profiles = ["SAFE AI", "RISKY AI", "PERFECT AI", "LEARNING AI"];
    const vehicles = ["CUBE", "SHIP", "WAVE", "SWING", "ROBOT", "UFO", "BALL", "SPIDER", "DART"];
    for (let i=0;i<profiles.length;i++) {
        fill(i===aiLabProfile ? color(0,255,170) : color(120));
        rect(45, 100+i*48, 195, 34, 8);
        fill(10); textSize(14); text(profiles[i], 142, 117+i*48);
    }
    for (let i=0;i<vehicles.length;i++) {
        const col=i%2, row=floor(i/2), x=285+col*105, y=100+row*48;
        fill(i===aiLabVehicle ? color(255,210,60) : color(70)); rect(x,y,95,34,8);
        fill(i===aiLabVehicle ? 10 : 230); textSize(12); text(vehicles[i], x+47,y+17);
    }
    const vKey = vehicles[aiLabVehicle].toLowerCase();
    const lv = (aiLearningStats.learningLevel && aiLearningStats.learningLevel[vKey]) || 0;
    const bias = (aiLearningStats.bias && aiLearningStats.bias[vKey]) || 0;
    fill(0,255,120); textSize(12);
    text("Learning: deaths "+(aiLearningStats.deaths||0)+"  •  spikes "+(aiLearningStats.spike||0)+"  •  gaps "+(aiLearningStats.gap||0)+"  •  ceiling "+(aiLearningStats.ceiling||0), sirina/2, 300);
    fill(180); textSize(11);
    text(vehicles[aiLabVehicle]+" lv"+lv+" bias"+(bias>=0?"+":"")+bias+"  next strat: "+(aiLearningStats.lastStrategy||"—")+" (x"+(aiLearningStats.lastMarkCount||0)+")", sirina/2, 322);
    fill(255,170,60); rect(sirina/2-105, 355, 210, 46, 10); fill(20); textSize(17); text("▶ START AI TEST", sirina/2, 378);
    fill(150); textSize(11); text("↑↓ profil  •  ←→ vozilo  •  ENTER = start  •  ESC = nazaj", sirina/2, 445);
    // Cover remainder of canvas so nothing from other menus can show
    fill(8, 10, 24); noStroke();
    rect(0, 460, sirina, sirina - 460);
}

function aiLabVehicleMode() {
    return ["Geometry Dash","GD Ship","GD Wave","GD Swing","GD Robot","GD UFO","GD Ball","GD Spider","GD Dart"][aiLabVehicle];
}



// Built-in decoration presets (unit space -0.5..0.5), scaled on place
const LB_DECO_PRESETS = {
    star: () => {
        const pts = [];
        for (let i = 0; i < 10; i++) {
            const a = -HALF_PI + i * PI / 5;
            const r = (i % 2 === 0) ? 0.48 : 0.2;
            pts.push({ x: cos(a) * r, y: sin(a) * r });
        }
        pts.push(pts[0]);
        return pts;
    },
    heart: () => {
        const pts = [];
        for (let i = 0; i <= 24; i++) {
            const t = i / 24 * TWO_PI;
            const x = 0.35 * Math.pow(Math.sin(t), 3);
            const y = -0.3 * (0.85 * Math.cos(t) - 0.3 * Math.cos(2 * t) - 0.12 * Math.cos(3 * t) - 0.05 * Math.cos(4 * t));
            pts.push({ x, y });
        }
        return pts;
    },
    circle: () => {
        const pts = [];
        for (let i = 0; i <= 20; i++) {
            const a = i / 20 * TWO_PI;
            pts.push({ x: cos(a) * 0.42, y: sin(a) * 0.42 });
        }
        return pts;
    },
    square: () => [
        { x: -0.4, y: -0.4 }, { x: 0.4, y: -0.4 }, { x: 0.4, y: 0.4 }, { x: -0.4, y: 0.4 }, { x: -0.4, y: -0.4 }
    ],
    diamond: () => [
        { x: 0, y: -0.48 }, { x: 0.42, y: 0 }, { x: 0, y: 0.48 }, { x: -0.42, y: 0 }, { x: 0, y: -0.48 }
    ],
    arrow: () => [
        { x: -0.4, y: -0.15 }, { x: 0.15, y: -0.15 }, { x: 0.15, y: -0.35 }, { x: 0.48, y: 0 },
        { x: 0.15, y: 0.35 }, { x: 0.15, y: 0.15 }, { x: -0.4, y: 0.15 }, { x: -0.4, y: -0.15 }
    ],
    gem: () => [
        { x: 0, y: -0.48 }, { x: 0.35, y: -0.15 }, { x: 0.28, y: 0.4 }, { x: 0, y: 0.48 },
        { x: -0.28, y: 0.4 }, { x: -0.35, y: -0.15 }, { x: 0, y: -0.48 }
    ],
    bolt: () => [
        { x: 0.05, y: -0.48 }, { x: -0.15, y: -0.05 }, { x: 0.05, y: -0.05 }, { x: -0.2, y: 0.48 },
        { x: 0.25, y: 0.05 }, { x: 0.0, y: 0.05 }, { x: 0.3, y: -0.48 }, { x: 0.05, y: -0.48 }
    ],
    smile: () => {
        const pts = [];
        for (let i = 0; i <= 16; i++) {
            const a = i / 16 * TWO_PI;
            pts.push({ x: cos(a) * 0.42, y: sin(a) * 0.42 });
        }
        return pts;
    },
    cloud: () => {
        const pts = [];
        const blobs = [[-0.2, 0.05, 0.22], [0.05, -0.05, 0.28], [0.28, 0.08, 0.2], [-0.05, 0.12, 0.18]];
        for (const [cx, cy, r] of blobs) {
            for (let i = 0; i <= 10; i++) {
                const a = i / 10 * TWO_PI;
                pts.push({ x: cx + cos(a) * r, y: cy + sin(a) * r * 0.7 });
            }
        }
        return pts;
    }
};
const LB_DECO_COLORS = [
    [210, 160, 255], [255, 80, 120], [255, 200, 40], [80, 220, 120],
    [80, 180, 255], [255, 140, 40], [255, 255, 255], [40, 40, 50]
];
const LB_DECO_PRESET_NAMES = Object.keys(LB_DECO_PRESETS);


const DECO_GRID_SIZE = 8;
const DECO_PIXEL = 28;

function lbDecoGridFromRows(rows) {
    // rows: 8 strings of 8 chars, chars '0'-'8' or space=0
    const g = lbDecoEmptyGrid();
    for (let j = 0; j < Math.min(8, rows.length); j++) {
        const line = rows[j];
        for (let i = 0; i < Math.min(8, line.length); i++) {
            const ch = line[i];
            g[i][j] = (ch === ' ' || ch === '.') ? 0 : (parseInt(ch, 10) || 0);
        }
    }
    return g;
}
function lbDecoSeedLibrary() {
    // No built-in presets — user creates their own in the pixel editor
    if (!levelBuilder.decoLibrary) levelBuilder.decoLibrary = [];
    if (!levelBuilder.decoDraft) levelBuilder.decoDraft = lbDecoEmptyGrid();
}

function lbDecoEmptyGrid() {
    const g = [];
    for (let i = 0; i < DECO_GRID_SIZE; i++) {
        g[i] = [];
        for (let j = 0; j < DECO_GRID_SIZE; j++) g[i][j] = 0;
    }
    return g;
}
function lbDecoEnsureDraft() {
    if (!levelBuilder.decoDraft) levelBuilder.decoDraft = lbDecoEmptyGrid();
    return levelBuilder.decoDraft;
}
function lbDecoSaveDraftToLibrary() {
    const draft = lbDecoEnsureDraft();
    // skip empty
    let has = false;
    for (let i = 0; i < DECO_GRID_SIZE; i++)
        for (let j = 0; j < DECO_GRID_SIZE; j++)
            if (draft[i][j]) has = true;
    if (!has) { levelBuilder.msg = "Deco empty — paint pixels first"; return; }
    if (!levelBuilder.decoLibrary) levelBuilder.decoLibrary = [];
    const copy = JSON.parse(JSON.stringify(draft));
    levelBuilder.decoLibrary.push({ name: "Deco " + (levelBuilder.decoLibrary.length + 1), grid: copy });
    levelBuilder.decoLibIdx = levelBuilder.decoLibrary.length - 1;
    levelBuilder.msg = "Saved deco #" + levelBuilder.decoLibrary.length + " — place with DECO tool";
}
function lbDecoGetPlaceGrid() {
    if (levelBuilder.decoLibrary && levelBuilder.decoLibrary.length && levelBuilder.decoLibIdx >= 0) {
        const item = levelBuilder.decoLibrary[levelBuilder.decoLibIdx];
        if (item && item.grid) return item.grid;
    }
    return levelBuilder.decoDraft;
}
function lbDecoShapeOf(tname) {
    if (!tname) return "rect";
    if (tname === "spike") return "spikeUp";
    if (tname === "spikeDown") return "spikeDown";
    if (tname === "block" || tname === "wall") return "block";
    if (tname.indexOf("orb") >= 0 || tname === "sawblade" || tname === "secretCoin") return "circle";
    if (tname.indexOf("portal") >= 0 || tname === "gravityUp" || tname === "gravityDown"
        || tname === "sizeMini" || tname === "sizeNormal" || tname === "endDual") return "portal";
    if (tname.indexOf("pad") >= 0) return "pad";
    if (tname === "slope") return "slope";
    if (tname === "slopeFlip") return "slopeFlip";
    if (tname === "waveSlope") return "slope";
    if (tname === "end") return "goal";
    return "rect";
}
function lbDecoPointInShape(shape, lx, ly, w, h) {
    if (shape === "spikeUp") {
        // barycentric: (0,h), (w/2,0), (w,h)
        const x1 = 0, y1 = h, x2 = w * 0.5, y2 = 0, x3 = w, y3 = h;
        const d = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
        if (Math.abs(d) < 1e-9) return false;
        const a = ((y2 - y3) * (lx - x3) + (x3 - x2) * (ly - y3)) / d;
        const b = ((y3 - y1) * (lx - x3) + (x1 - x3) * (ly - y3)) / d;
        const c = 1 - a - b;
        return a >= -0.02 && b >= -0.02 && c >= -0.02;
    }
    if (shape === "spikeDown") {
        const x1 = 0, y1 = 0, x2 = w * 0.5, y2 = h, x3 = w, y3 = 0;
        const d = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
        if (Math.abs(d) < 1e-9) return false;
        const a = ((y2 - y3) * (lx - x3) + (x3 - x2) * (ly - y3)) / d;
        const b = ((y3 - y1) * (lx - x3) + (x1 - x3) * (ly - y3)) / d;
        const c = 1 - a - b;
        return a >= -0.02 && b >= -0.02 && c >= -0.02;
    }
    if (shape === "circle" || shape === "portal") {
        const dx = (lx - w * 0.5) / (w * 0.48);
        const dy = (ly - h * 0.5) / (h * 0.48);
        return dx * dx + dy * dy <= 1.05;
    }
    if (shape === "pad") {
        return ly >= h * 0.5 && ly <= h && lx >= 0 && lx <= w;
    }
    if (shape === "slope") {
        // / lower-right filled: ly >= h * (1 - lx/w)
        return ly >= h * (1 - lx / Math.max(1e-6, w)) - 0.5;
    }
    if (shape === "slopeFlip") {
        // \ lower-left filled: ly >= h * (lx/w)
        return ly >= h * (lx / Math.max(1e-6, w)) - 0.5;
    }
    if (shape === "goal") {
        return lx <= w * 0.4;
    }
    return true; // block / rect
}
function lbDecoFillShape(shape, x, y, w, h, col) {
    noStroke();
    fill(col[0], col[1], col[2], col[3] != null ? col[3] : 255);
    if (shape === "spikeUp") {
        triangle(x, y + h, x + w * 0.5, y, x + w, y + h);
    } else if (shape === "spikeDown") {
        triangle(x, y, x + w * 0.5, y + h, x + w, y);
    } else if (shape === "circle" || shape === "portal") {
        ellipse(x + w * 0.5, y + h * 0.5, w * 0.95, h * 0.95);
    } else if (shape === "pad") {
        rect(x, y + h * 0.5, w, h * 0.5, 2);
    } else if (shape === "slope") {
        // black/filled / triangle (bl, br, tr)
        triangle(x, y + h, x + w, y + h, x + w, y);
    } else if (shape === "slopeFlip") {
        // \ triangle (bl, br, tl)
        triangle(x, y + h, x + w, y + h, x, y);
    } else if (shape === "block") {
        rect(x, y, w, h, 4);
    } else if (shape === "goal") {
        rect(x, y, w * 0.4, h);
    } else {
        rect(x, y, w, h, 2);
    }
}
/** Draw deco texture clipped to object shape. Always paints solid underlay first so object is fully covered. */
function lbDecoDrawGridPixels(grid, x, y, cellW, cellH, shape) {
    if (!grid) return;
    shape = shape || "rect";
    const n = typeof DECO_GRID_SIZE === "number" ? DECO_GRID_SIZE : 8;
    const pw = cellW / n, ph = cellH / n;
    // Deco is a transparent texture overlay: preserve the original object's
    // appearance and collision geometry underneath it.
    // Paint only non-empty pixels inside the object's shape.
    noStroke();
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const ci = grid[i] && grid[i][j];
            if (!ci) continue;
            const cx = (i + 0.5) * pw;
            const cy = (j + 0.5) * ph;
            if (!lbDecoPointInShape(shape, cx, cy, cellW, cellH)) continue;
            const pal = (typeof headPalette !== "undefined" && headPalette[ci]) ? headPalette[ci] : [210, 160, 255];
            fill(pal[0], pal[1], pal[2], 255);
            rect(x + i * pw, y + j * ph, Math.max(1, pw + 0.5), Math.max(1, ph + 0.5));
        }
    }
}
function lbDecoEraseAt(r, c) {
    const key = r + "," + c;
    let changed = false;
    if (levelBuilder.decoPlacements && levelBuilder.decoPlacements[key]) {
        delete levelBuilder.decoPlacements[key];
        changed = true;
    }
    if (levelBuilder.decoCells && levelBuilder.decoCells[key]) {
        delete levelBuilder.decoCells[key];
        changed = true;
    }
    // Remove freehand strokes that touch this cell
    if (levelBuilder.decoStrokes && levelBuilder.decoStrokes.length) {
        const before = levelBuilder.decoStrokes.length;
        levelBuilder.decoStrokes = levelBuilder.decoStrokes.filter(st => {
            if (!st.pts) return false;
            for (const p of st.pts) {
                if (Math.floor(p.x) === c && Math.floor(p.y) === r) return false;
                // also if near cell
                if (Math.abs(p.x - (c + 0.5)) < 0.75 && Math.abs(p.y - (r + 0.5)) < 0.75) return false;
            }
            return true;
        });
        if (levelBuilder.decoStrokes.length !== before) changed = true;
    }
    return changed;
}


function lbDecoStampPreset(name, cellX, cellY, scale) {
    const gen = LB_DECO_PRESETS[name];
    if (!gen) return null;
    const unit = gen();
    const s = scale || 1.2;
    const pts = unit.map(p => ({ x: cellX + p.x * s, y: cellY + p.y * s }));
    return {
        pts,
        color: (levelBuilder.decoColor || [210, 160, 255]).slice(),
        size: levelBuilder.decoSize || 0.3,
        preset: name
    };
}



// ===== WYSIWYG LEVEL BUILDER (same scale & look as real GD play) =====
function builderWorldMetrics() {
    const g = sirina - 80;
    const builderWorldCellH = Math.max(20, (g - 40) / 18);
    const ceilY = Math.max(32, g - levelBuilder.rows * builderWorldCellH);
    const blockH = (g - ceilY) / Math.max(1, levelBuilder.rows);
    return { g, ceilY, blockH, cellW: LB_CELL_W, startX: LB_START_X };
}

function builderVisibleCols() {
    // How many world columns fit in the playfield viewport (full width minus thin side pad)
    const L = builderLayout();
    return Math.max(4, Math.floor(L.viewW / LB_CELL_W));
}

function builderEditorScrollX() {
    const m = builderWorldMetrics();
    const scrollC = levelBuilder.scrollC || 0;
    // Align left of viewport with column scrollC (same world coords as play)
    return m.startX + scrollC * m.cellW - 8;
}

function builderLayout() {
    // Top toolbar; bottom stack is built from the bottom up so tools never overlap buttons.
    const topUI = 64;
    const perRow = 8;
    const toolRowsVisible = 2; // 2 rows of tools + scroll arrows
    const toolRowH = 17;
    const toolsH = toolRowsVisible * toolRowH;
    const btnH = 22;
    const barH = 10;
    // order from bottom: buttons → tools → scrollbar → playfield
    const bottomPad = 4;
    const bottomUI = bottomPad + btnH + 4 + toolsH + 4 + barH + 4;
    const gx = 0;
    const gy = topUI;
    const m = (typeof builderWorldMetrics === 'function') ? builderWorldMetrics() : { cellW: LB_CELL_W, blockH: 34, g: sirina - 80, ceilY: 40 };
    const cw = m.cellW;
    const ch = m.blockH;
    const viewH = Math.max(80, sirina - topUI - bottomUI);
    const viewW = sirina;
    const visCols = Math.max(4, Math.floor(viewW / cw));
    const btnY = sirina - bottomPad - btnH;
    const toolsY0 = btnY - 4 - toolsH;
    const barY = toolsY0 - 4 - barH;
    const sideX = 400, sideY0 = 26;
    return {
        gx, gy, cw, ch, toolsY0, perRow, btnY, barY, sideX, sideY0, toolRowsVisible,
        toolRowH, toolsH, btnH, barH,
        viewW, viewH, visCols, topUI, bottomUI,
        groundY: m.g, ceilY: m.ceilY, startX: m.startX
    };
}


function builderAutoSave() {
    if (!levelBuilder || levelBuilder.saveIdx < 0) return false;
    try {
        builderSaveLevel(false);
        return true;
    } catch (e) {
        return false;
    }
}

function builderOpenNewLevel() {
    let n = "My Level";
    try {
        const p = prompt("Ime novega levela:", "My Level " + (levelBuilder.saved.length + 1));
        if (p === null) return false; // cancelled
        n = (p || "My Level").slice(0, 24);
    } catch (e) {}
    levelBuilder.name = n;
    levelBuilder.mode = levelBuilder.mode || "classic";
    builderGridInit();
    levelBuilder.saveIdx = -1;
    builderSaveLevel(true); // creates new slot and sets saveIdx
    levelBuilder.inEditor = true;
    levelBuilder.msg = "Nov level: " + levelBuilder.name;
    playMenuSound();
    return true;
}

function builderOpenLevel(idx) {
    if (idx < 0 || idx >= (levelBuilder.saved || []).length) return false;
    builderLoadLevel(idx);
    levelBuilder.inEditor = true;
    playMenuSound();
    return true;
}

function builderBackToList() {
    builderAutoSave();
    levelBuilder.inEditor = false;
    levelBuilder.msg = "";
    playMenuSound();
}

function drawLevelBrowser() {
    background(8, 10, 24);
    textAlign(CENTER, CENTER);
    fill(0, 240, 255); textSize(26);
    text("🧩 LEVEL BUILDER", sirina / 2, 36);
    fill(160); textSize(12);
    text("Izberi level ali ustvari novega", sirina / 2, 62);

    const list = levelBuilder.saved || [];
    const startY = 95;
    const rowH = 36;
    const maxVis = 11;
    const page = levelBuilder.savedPage || 0;
    const pages = Math.max(1, Math.ceil(Math.max(1, list.length) / maxVis));
    levelBuilder.savedPage = constrain(page, 0, pages - 1);
    const from = levelBuilder.savedPage * maxVis;
    const to = Math.min(list.length, from + maxVis);

    // NEW LEVEL card
    const newY = startY;
    fill(255, 170, 50);
    rect(sirina / 2 - 200, newY, 400, 40, 10);
    fill(20); textSize(16); text("+  NOV LEVEL", sirina / 2, newY + 20);
    levelBuilder._browserNew = { x: sirina / 2 - 200, y: newY, w: 400, h: 40 };

    levelBuilder._browserRows = [];
    if (list.length === 0) {
        fill(120); textSize(13);
        text("Še nimaš shranjenih levelev", sirina / 2, startY + 70);
    } else {
        for (let i = from; i < to; i++) {
            const y = startY + 52 + (i - from) * rowH;
            const on = (levelBuilder.browserSel === i);
            fill(on ? color(0, 200, 160) : color(35, 40, 58));
            rect(sirina / 2 - 200, y, 400, rowH - 4, 8);
            fill(on ? 10 : 230); textSize(14); textAlign(LEFT, CENTER);
            const lv = list[i];
            const mode = (lv.mode === "platformer") ? "PLAT" : "CLASSIC";
            text((i + 1) + ".  " + (lv.name || "Level"), sirina / 2 - 185, y + (rowH - 4) / 2);
            textAlign(RIGHT, CENTER); fill(on ? 30 : 160); textSize(11);
            text(mode + "  ·  " + (lv.cols || "?") + "×" + (lv.rows || "?"), sirina / 2 + 190, y + (rowH - 4) / 2);
            levelBuilder._browserRows.push({ x: sirina / 2 - 200, y: y, w: 400, h: rowH - 4, idx: i });
        }
    }

    // page controls
    if (pages > 1) {
        textAlign(CENTER, CENTER);
        fill(70, 90, 130); rect(sirina / 2 - 60, sirina - 70, 40, 24, 5);
        fill(70, 90, 130); rect(sirina / 2 + 20, sirina - 70, 40, 24, 5);
        fill(255); textSize(14); text("<", sirina / 2 - 40, sirina - 58);
        text(">", sirina / 2 + 40, sirina - 58);
        fill(180); textSize(11); text((levelBuilder.savedPage + 1) + " / " + pages, sirina / 2, sirina - 58);
        levelBuilder._browserPrev = { x: sirina / 2 - 60, y: sirina - 70, w: 40, h: 24 };
        levelBuilder._browserNext = { x: sirina / 2 + 20, y: sirina - 70, w: 40, h: 24 };
    } else {
        levelBuilder._browserPrev = null;
        levelBuilder._browserNext = null;
    }

    fill(130); textSize(11); textAlign(CENTER, CENTER);
    text("ENTER = odpri  ·  N = nov  ·  DEL = zbriši  ·  ESC = meni", sirina / 2, sirina - 28);
}

function drawLevelBuilderMenu() {
    if (!levelBuilder.inEditor) {
        drawLevelBrowser();
        return;
    }
    background(7, 10, 20);
    textAlign(CENTER, CENTER);
    fill(0, 240, 255); textSize(18);
    text("🧩 " + (levelBuilder.name || "Level"), sirina / 2, 14);

    // === MODE TOGGLE Classic / Platformer ===
    const isPlat = levelBuilder.mode === "platformer";
    fill(isPlat ? color(50, 60, 90) : color(0, 200, 160));
    rect(8, 26, 70, 18, 4);
    fill(isPlat ? 160 : 10); textSize(8); text("CLASSIC", 43, 35);
    fill(isPlat ? color(255, 160, 40) : color(50, 60, 90));
    rect(82, 26, 78, 18, 4);
    fill(isPlat ? 10 : 160); textSize(8); text("PLATFORMER", 121, 35);

    fill(180, 100, 255); rect(168, 26, 52, 18, 4);
    fill(255); textSize(8); text("PIXEL", 194, 35);
    fill(60, 180, 255); rect(224, 26, 42, 18, 4);
    fill(255); textSize(8); text("COL+", 245, 35);
    fill(60, 140, 200); rect(270, 26, 42, 18, 4);
    fill(255); textSize(8); text("COL−", 291, 35);
    fill(60, 200, 160); rect(316, 26, 42, 18, 4);
    fill(255); textSize(8); text("ROW+", 337, 35);
    fill(40, 160, 130); rect(362, 26, 42, 18, 4);
    fill(255); textSize(8); text("ROW−", 383, 35);
    fill(110, 80, 150); rect(408, 26, 40, 18, 4);
    fill(255); textSize(7); text("↶", 428, 35);
    fill(65, 105, 150); rect(452, 26, 40, 18, 4);
    fill(255); textSize(7); text("↷", 472, 35);
    fill(levelBuilder.showHitboxes ? color(255, 70, 90) : color(70, 55, 80));
    rect(548, 26, 46, 18, 4);
    fill(255); textSize(7); text(levelBuilder.showHitboxes ? "HIT" : "HIT", 571, 35);

    // Status row + MUSIC / FROM on the RIGHT (own row, no overlap with top buttons)
    fill(180); textSize(8); textAlign(LEFT, CENTER);
    const smLabel = levelBuilder.slopeMode === 0 ? "FLAT" : (levelBuilder.slopeMode === -1 ? "↓45°" : "↑45°");
    const modeLabel = isPlat ? "PLAT" : "CLASSIC";
    text((levelBuilder.name || "My Level") + " " + levelBuilder.cols + "×" + levelBuilder.rows
        + " · " + modeLabel + " · P:" + levelBuilder.portalTarget.toUpperCase() + " · R:" + smLabel, 12, 50);
    // Normal top buttons — same size, no overlay panels
    const mx0 = 380, my0 = 48;
    const decoOn = (builderCurrentTools()[levelBuilder.tool] === "deco");
    fill(levelBuilder.musicUrl ? color(80, 180, 100) : color(45, 55, 75));
    rect(mx0, my0, 44, 16, 3);
    fill(255); textSize(7); textAlign(CENTER, CENTER); text("MUSIC", mx0 + 22, my0 + 8);
    fill(90, 140, 220); rect(mx0 + 48, my0, 44, 16, 3);
    fill(255); text("FROM", mx0 + 70, my0 + 8);
    fill(decoOn ? color(0, 220, 160) : color(70, 50, 110));
    rect(mx0 + 96, my0, 44, 16, 3);
    fill(decoOn ? 10 : 255); text("PLACE", mx0 + 118, my0 + 8);
    fill(255, 170, 50); rect(mx0 + 144, my0, 44, 16, 3);
    fill(15); text("EDIT", mx0 + 166, my0 + 8);
    levelBuilder._musicBtn = { x: mx0, y: my0, w: 44, h: 16 };
    levelBuilder._fromBtn = { x: mx0 + 48, y: my0, w: 44, h: 16 };
    levelBuilder._decoBarBtns = [
        { x: mx0 + 96, y: my0, w: 44, h: 16, kind: "placeTool" },
        { x: mx0 + 144, y: my0, w: 44, h: 16, kind: "panel" }
    ];
    // legacy alias unused
    levelBuilder._decoEditBtn = null;

    const tools = builderCurrentTools();
    const toolColors = {
        spike: [255, 70, 90], spikeDown: [255, 120, 90], block: [100, 170, 255],
        padYellow: [255, 220, 40], padBlue: [50, 150, 255],
        padYellowCeil: [255, 200, 20], padBlueCeil: [40, 130, 255],
        orbYellow: [255, 230, 70], orbBlue: [40, 220, 90], orbDash: [40, 255, 90],
        orbBlueTrue: [70, 160, 255], orbBlack: [30, 30, 35],
        portal: [80, 230, 255], gravityUp: [180, 80, 255], gravityDown: [120, 255, 160],
        secretCoin: [255, 215, 0], waveSlope: [200, 80, 255], end: [80, 255, 140],
        padPink: [255, 50, 50], padPinkCeil: [220, 30, 30], orbPink: [255, 70, 70],
        portalDual: [255, 160, 40], sizeMini: [160, 100, 255], sizeNormal: [120, 200, 255],
        endDual: [255, 100, 60],
        slope: [90, 180, 255], slopeFlip: [70, 150, 230],
        sawblade: [220, 60, 60],
        startPos: [80, 255, 120],
        checkpoint: [255, 200, 60],
        erase: [255, 80, 80],
        deco: [200, 150, 255]
    };

    const L = builderLayout();
    const gx = L.gx, gy = L.gy, cw = L.cw, ch = L.ch;
    const vis = L.visCols || Math.max(4, Math.floor(sirina / LB_CELL_W));
    const scrollC = constrain(levelBuilder.scrollC || 0, 0, max(0, levelBuilder.cols - vis));
    levelBuilder.scrollC = scrollC;
    levelBuilder._editorVis = vis;
    levelBuilder._editorLayout = L;

    // --- Full-scale playfield (same look as real GD, no player) ---
    // Shift world so ground sits on the bottom of the middle band (tools don't cover it).
    const prevObs = gdObstacles;
    const prevScroll = gdScroll;
    const prevG = gdGroundY;
    const prevCeil = gdCeilY;
    const prevCube = gdCube;
    const prevCube2 = gdCube2;
    const prevDual = gdDual;
    const viewTop = L.topUI || 68;
    const viewBot = sirina - (L.bottomUI || 128);
    const viewH = Math.max(40, viewBot - viewTop);
    try {
        if (typeof builderCompileLevelObstacles === 'function') {
            builderCompileLevelObstacles();
        } else {
            gdObstacles = [];
        }
        gdGroundY = L.groundY;
        gdCeilY = L.ceilY;
        // Scroll so column `scrollC` is at the left of the view
        gdScroll = (L.startX != null ? L.startX : LB_START_X) + scrollC * cw - 8;
        gdCube = null;
        gdCube2 = null;
        gdDual = false;

        // Fit world vertically into middle band (keep aspect of blocks)
        const worldH = Math.max(1, gdGroundY - gdCeilY);
        const scaleY = viewH / worldH;
        // Prefer 1:1 if it mostly fits; otherwise scale to fit
        const s = (worldH <= viewH + 8) ? 1 : scaleY;
        // After scale, place ground at viewBot
        // screenY = viewBot - (gdGroundY - worldY) * s
        //          = worldY * s + (viewBot - gdGroundY * s)
        const yShift = viewBot - gdGroundY * s;
        levelBuilder._viewMap = { s, yShift, viewTop, viewBot, scrollX: gdScroll };

        push();
        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(0, viewTop, sirina, viewH);
        drawingContext.clip();

        // Solid playfield backdrop (always visible, even if izrisiOzadje fails)
        noStroke();
        fill(12, 14, 28);
        rect(0, viewTop, sirina, viewH);

        // Transform into world space
        translate(0, yShift);
        scale(1, s);

        // Soft ambient
        noStroke();
        fill(30, 20, 100, 40);
        rect(-20, gdCeilY - 40, sirina + 40, (gdGroundY - gdCeilY) + 80);

        // Parallax lines
        stroke(90, 70, 150, 70); strokeWeight(1 / s);
        let off = (gdScroll * 0.25) % 40;
        for (let x = -off; x < sirina + 40; x += 40) line(x, gdCeilY, x, gdGroundY);

        // Ceiling
        noStroke();
        fill(18, 18, 34, 240);
        rect(-20, gdCeilY - 200, sirina + 40, 200);
        fill(145, 105, 245, 235);
        rect(-20, gdCeilY - 4, sirina + 40, 4);
        fill(220, 195, 255, 220);
        rect(-20, gdCeilY - 1, sirina + 40, 1);

        // Ground
        fill(25, 25, 40);
        rect(-20, gdGroundY, sirina + 40, 400);
        fill(120, 90, 220);
        rect(-20, gdGroundY, sirina + 40, 4);

        // Obstacles (game renderer) — scale stroke roughly
        if (typeof _lbDrawObstaclesLikeGame === 'function') {
            _lbDrawObstaclesLikeGame();
        }

        // Cell guides
        const m = builderWorldMetrics();
        stroke(255, 255, 255, 28); strokeWeight(1 / s);
        for (let vi = 0; vi <= vis + 1; vi++) {
            const c = scrollC + vi;
            const wx = m.startX + c * m.cellW - gdScroll;
            line(wx, gdCeilY, wx, gdGroundY);
        }
        for (let r = 0; r <= levelBuilder.rows; r++) {
            const wy = gdGroundY - r * m.blockH;
            line(-10, wy, sirina + 10, wy);
        }

        // Selection
        const keysSel = [];
        if (levelBuilder.selectedCell) keysSel.push(levelBuilder.selectedCell);
        if (levelBuilder.selectedCells) {
            for (const k of levelBuilder.selectedCells) if (keysSel.indexOf(k) < 0) keysSel.push(k);
        }
        for (const cellKey of keysSel) {
            const parts = cellKey.split(',').map(Number);
            const r = parts[0], c = parts[1];
            if (c < scrollC - 1 || c >= scrollC + vis + 1) continue;
            const sm = (levelBuilder.cellMeta && levelBuilder.cellMeta[cellKey]) || {};
            const sox = Number(sm.ox) || 0, soy = Number(sm.oy) || 0;
            const px = m.startX + c * m.cellW + sox * m.cellW - gdScroll;
            const py = gdGroundY - (r + 1) * m.blockH - soy * m.blockH;
            noFill(); stroke(255, 255, 80, 230); strokeWeight(2 / s);
            rect(px + 1, py + 1, m.cellW - 2, m.blockH - 2);
        }


        // Last attempt hitbox trail (K) — kept after death for review in editor
        if ((levelBuilder.showHitboxTrail || levelBuilder.showHitboxes) && levelBuilder.hitboxTrail && levelBuilder.hitboxTrail.length) {
            noFill();
            const trail = levelBuilder.hitboxTrail;
            for (let i = 0; i < trail.length; i++) {
                const t = trail[i];
                if (!t || !t.full) continue;
                stroke(0, 220, 255, 160); strokeWeight(1.2 / s);
                rect(t.full.x - gdScroll, t.full.y, t.full.w, t.full.h);
                if (t.core) {
                    stroke(255, 40, 220, 200); strokeWeight(1.6 / s);
                    rect(t.core.x - gdScroll, t.core.y, t.core.w, t.core.h);
                }
                if (t.dual) {
                    stroke(255, 180, 40, 180); strokeWeight(1.2 / s);
                    rect(t.dual.x - gdScroll, t.dual.y, t.dual.w, t.dual.h);
                }
            }
        }
        // Obstacle hitboxes in editor (when HIT / H is on)
        if (levelBuilder.showHitboxes && gdObstacles) {
            noFill();
            for (let o of gdObstacles) {
                if (!o || o.type === "decoPixel" || o.type === "decoStroke" || o.type === "deco") continue;
                const sx = o.x - gdScroll;
                if (sx + (o.w || 40) < -40 || sx > sirina + 40) continue;
                if (o.type === "spike" || o.type === "spikeDown") {
                    stroke(255, 60, 60, 220); strokeWeight(1.5 / s);
                    if (o.type === "spike") triangle(sx, o.y + o.h, sx + o.w / 2, o.y, sx + o.w, o.y + o.h);
                    else triangle(sx, o.y, sx + o.w / 2, o.y + o.h, sx + o.w, o.y);
                } else if (o.type === "sawblade" || (o.type && o.type.indexOf("orb") >= 0) || o.type === "secretCoin") {
                    stroke(255, 220, 60, 220); strokeWeight(1.5 / s);
                    ellipse(sx + o.w / 2, o.y + o.h / 2, o.w, o.h);
                } else if (o.type === "waveSlope") {
                    stroke(255, 100, 220, 200); strokeWeight(1.5 / s);
                    line(sx, o.top1, sx + o.w, o.top2);
                    line(sx, o.bottom1, sx + o.w, o.bottom2);
                } else {
                    stroke(0, 255, 180, 200); strokeWeight(1.5 / s);
                    rect(sx, o.y, o.w || 20, o.h || 20);
                }
            }
        }

        // Empty hint
        if (!gdObstacles || gdObstacles.length === 0) {
            fill(180, 200, 255, 160); noStroke();
            textSize(14 / s); textAlign(CENTER, CENTER);
            text("Izberi orodje in klikni na polje — ovire se rišejo kot v igri", sirina / 2, (gdCeilY + gdGroundY) / 2);
        }

        drawingContext.restore();
        pop();
    } catch (err) {
        try { drawingContext.restore(); } catch (e2) {}
        try { pop(); } catch (e3) {}
        console.error("Level builder view error:", err);
        fill(255, 80, 80); textSize(12); textAlign(CENTER, CENTER);
        text("Builder view error — see console", sirina / 2, (viewTop + viewBot) / 2);
    } finally {
        gdObstacles = prevObs;
        gdScroll = prevScroll;
        gdGroundY = prevG;
        gdCeilY = prevCeil;
        gdCube = prevCube;
        gdCube2 = prevCube2;
        gdDual = prevDual;
    }

    // Level scrollbar (drag) — in bottom UI band
    const barY = L.barY != null ? L.barY : (sirina - (L.bottomUI || 128) + 2);
    const barX = 8, barW = sirina - 100, barH = 10;
    fill(40, 45, 60); rect(barX, barY, barW, barH, 3);
    if (levelBuilder.cols > vis) {
        const maxScroll = max(0, levelBuilder.cols - vis);
        const thumbW = max(28, barW * (vis / levelBuilder.cols));
        const thumbX = barX + (maxScroll > 0 ? (scrollC / maxScroll) * (barW - thumbW) : 0);
        fill(levelBuilder.draggingScroll ? color(0, 255, 180) : color(120, 140, 200));
        rect(thumbX, barY, thumbW, barH, 3);
    }
    fill(140); textSize(7); textAlign(LEFT, CENTER);
    text((scrollC + 1) + "–" + min(scrollC + vis, levelBuilder.cols) + "/" + levelBuilder.cols, barX + barW + 6, barY + 5);
    levelBuilder._scrollBar = { x: barX, y: barY, w: barW, h: barH, vis };

    // Tools palette — below scrollbar, does not overlap grid/buttons
    textAlign(CENTER, CENTER);
    const perRow = L.perRow;
    const toolsY0 = L.toolsY0;
    function lbShort(n) {
        return n.replace("padYellowCeil","padY↑").replace("padBlueCeil","padB↑")
            .replace("padPinkCeil","padP↑").replace("padPink","padP")
            .replace("padYellow","padY").replace("padBlue","padB")
            .replace("orbYellow","orbY").replace("orbBlueTrue","orbB").replace("orbBlue","orbG").replace("orbBlack","orbK").replace("orbPink","orbP")
            .replace("orbDash","dash").replace("portalDual","dual")
            .replace("sizeMini","mini").replace("sizeNormal","norm").replace("endDual","end2")
            .replace("slopeFlip","slp\\").replace("slope","slp/").replace("sawblade","saw")
            .replace("gravityUp","grav↑").replace("gravityDown","grav↓")
            .replace("secretCoin","coin").replace("waveSlope","wave").replace("spikeDown","spk↓")
            .replace("startPos","start").replace("checkpoint","check")
            .replace("decoErase","D-ERASE").replace("erase","ERASE").replace("deco","DECO");
    }
    const toolRowsVisible = L.toolRowsVisible || 3;
    const totalToolRows = Math.ceil(tools.length / perRow);
    const maxToolScroll = max(0, totalToolRows - toolRowsVisible);
    levelBuilder.toolScroll = constrain(levelBuilder.toolScroll || 0, 0, maxToolScroll);
    const tScroll = levelBuilder.toolScroll || 0;
    const rowHDraw = L.toolRowH || 17;
    for (let row = 0; row < toolRowsVisible; row++) {
        const tr = row + tScroll;
        if (tr >= totalToolRows) break;
        for (let col = 0; col < perRow; col++) {
            const i = tr * perRow + col;
            if (i >= tools.length) break;
            const on = levelBuilder.tool === i;
            const isErase = tools[i] === "erase";
            const isDecoErase = tools[i] === "decoErase";
            const isDeco = tools[i] === "deco";
            fill(on ? color(0, 255, 170) : (isDecoErase ? color(130, 75, 20) : (isErase ? color(90, 30, 40) : (isDeco ? color(60, 40, 90) : color(55)))));
            const bx = 6 + col * 54;
            const by = toolsY0 + row * rowHDraw;
            rect(bx, by, 52, rowHDraw - 1, 3);
            fill(on ? 10 : 230); textSize(6);
            text(lbShort(tools[i]).slice(0, 8).toUpperCase(), bx + 26, by + rowHDraw / 2);
        }
    }
    const arrowX = 6 + perRow * 54 + 2;
    const toolsH = L.toolsH || 34;
    fill(70); rect(arrowX, toolsY0, 18, 15, 3); fill(255); textSize(8); text("▲", arrowX + 9, toolsY0 + 7);
    fill(70); rect(arrowX, toolsY0 + toolsH - 15, 18, 15, 3); fill(255); text("▼", arrowX + 9, toolsY0 + toolsH - 8);
    // Always-visible ERASE + DECO shortcuts (fit inside tools band)
    const ei = tools.indexOf("erase"), di = tools.indexOf("deco");
    const dei = tools.indexOf("decoErase");
    const pinX = arrowX + 22;
    const pinH = Math.max(14, Math.floor(((L.toolsH || 34) - 4) / 3));
    if (ei >= 0) {
        fill(levelBuilder.tool === ei ? color(0, 255, 170) : color(90, 30, 40));
        rect(pinX, toolsY0, 48, pinH, 3); fill(255); textSize(6); text("ERASE", pinX + 24, toolsY0 + pinH / 2);
        levelBuilder._pinErase = { x: pinX, y: toolsY0, w: 48, h: pinH, idx: ei };
    }
    if (di >= 0) {
        fill(levelBuilder.tool === di ? color(0, 255, 170) : color(60, 40, 90));
        rect(pinX, toolsY0 + pinH + 2, 48, pinH, 3); fill(255); textSize(6); text("DECO", pinX + 24, toolsY0 + pinH + 2 + pinH / 2);
        levelBuilder._pinDeco = { x: pinX, y: toolsY0 + pinH + 2, w: 48, h: pinH, idx: di };
    }
    if (dei >= 0) {
        fill(levelBuilder.tool === dei ? color(0, 255, 170) : color(130, 75, 20));
        rect(pinX, toolsY0 + 2 * (pinH + 2), 48, pinH, 3); fill(255); textSize(5); text("D-ERASE", pinX + 24, toolsY0 + 2 * (pinH + 2) + pinH / 2);
        levelBuilder._pinDecoErase = { x: pinX, y: toolsY0 + 2 * (pinH + 2), w: 48, h: pinH, idx: dei };
    }
    levelBuilder._toolPanel = { y0: toolsY0, perRow, rowsVis: toolRowsVisible, maxScroll: maxToolScroll, arrowX };

    const btnY = L.btnY;
    const bh = (L.btnH || 22) - 2;
    textAlign(CENTER, CENTER); textSize(8);
    // One clean row: PLAY BACK CLR SEL | S- S+ | ← → ↑ ↓ ROT  (auto-save, no UPD)
    // Positions stored for hit-testing
    const B = [];
    function addBtn(x, w, label, fillC, textC) {
        fill(fillC); rect(x, btnY, w, bh, 4);
        fill(textC); text(label, x + w / 2, btnY + bh / 2);
        B.push({ x, w, label });
        return x + w + 4;
    }
    let bx = 4;
    bx = addBtn(bx, 48, "PLAY", color(255, 170, 60), color(15));
    bx = addBtn(bx, 44, "BACK", color(80, 100, 140), color(230));
    bx = addBtn(bx, 36, "CLR", color(70), color(220));
    bx = addBtn(bx, 36, levelBuilder.selectMode ? "SEL*" : "SEL",
        levelBuilder.selectMode ? color(0, 220, 170) : color(65, 80, 110), color(255));
    bx += 6;
    bx = addBtn(bx, 32, "S−", color(100, 90, 180), color(255));
    bx = addBtn(bx, 32, "S+", color(30, 150, 130), color(255));
    bx += 6;
    bx = addBtn(bx, 26, "←", color(200, 110, 40), color(255));
    bx = addBtn(bx, 26, "→", color(200, 110, 40), color(255));
    bx = addBtn(bx, 26, "↑", color(200, 110, 40), color(255));
    bx = addBtn(bx, 26, "↓", color(200, 110, 40), color(255));
    bx = addBtn(bx, 34, "ROT", color(160, 80, 200), color(255));
    levelBuilder._actionBtns = B;
    const selectedMeta = levelBuilder.selectedCell && levelBuilder.cellMeta ? (levelBuilder.cellMeta[levelBuilder.selectedCell] || {}) : {};
    const ox = Number(selectedMeta.ox) || 0, oy = Number(selectedMeta.oy) || 0;
    const srot = Number(selectedMeta.rot) || 0;
    fill(180); textSize(7); textAlign(LEFT, CENTER);
    // show selection offset next to ROT if room
    if (bx + 8 < sirina - 4) {
        text((ox.toFixed(1)+","+oy.toFixed(1)) + (srot ? (" r"+srot+"°") : ""), min(bx + 4, sirina - 80), btnY + bh / 2);
    }

    // Status message floats just above the scrollbar (inside playfield edge)
    if (levelBuilder.msg) {
        fill(255, 220, 80); textSize(10); textAlign(CENTER, CENTER);
        text(levelBuilder.msg, sirina / 2, (L.barY || 500) - 10);
    }

    // ===== DECO PIXEL EDITOR (like custom head) =====
    if (levelBuilder.decoEditor) {
        fill(0, 0, 0, 180); rect(0, 0, sirina, sirina);
        const px = 30, py = 40, pw = sirina - 60, ph = sirina - 80;
        fill(18, 20, 35); stroke(160, 100, 255); strokeWeight(2);
        rect(px, py, pw, ph, 10); noStroke();
        fill(220, 180, 255); textSize(16); textAlign(CENTER, TOP);
        text("✦ DECO PIXEL EDITOR", sirina / 2, py + 8);
        fill(150); textSize(10);
        text("Paint pixels like custom head  ·  Left = paint  ·  Right = erase pixel  ·  SAVE then place on level", sirina / 2, py + 30);

        const draft = lbDecoEnsureDraft();
        const gs = DECO_GRID_SIZE, ps = DECO_PIXEL;
        const gx0 = sirina / 2 - (gs * ps) / 2;
        const gy0 = py + 55;
        // pixel grid
        for (let i = 0; i < gs; i++) {
            for (let j = 0; j < gs; j++) {
                const ci = draft[i][j];
                if (ci && headPalette[ci]) fill(headPalette[ci][0], headPalette[ci][1], headPalette[ci][2]);
                else fill(45);
                stroke(25); strokeWeight(1);
                rect(gx0 + i * ps, gy0 + j * ps, ps, ps);
            }
        }
        noStroke();
        levelBuilder._decoPix = { x: gx0, y: gy0, w: gs * ps, h: gs * ps, ps, gs };

        // palette
        fill(200); textSize(11); textAlign(LEFT, CENTER); text("Colors", px + 24, gy0 + gs * ps + 24);
        levelBuilder._decoColorBtns = [];
        for (let c = 1; c <= 8; c++) {
            const bx = px + 20 + (c - 1) * 42, by = gy0 + gs * ps + 36;
            fill(headPalette[c][0], headPalette[c][1], headPalette[c][2]);
            const on = (levelBuilder.decoPaintColor || 1) === c;
            stroke(on ? 255 : 60); strokeWeight(on ? 3 : 1);
            rect(bx, by, 36, 24, 4); noStroke();
            levelBuilder._decoColorBtns.push({ x: bx, y: by, w: 36, h: 24, colorIdx: c });
        }

        // library thumbnails
        fill(200); textSize(11); textAlign(LEFT, CENTER);
        text("Library (click to select for placing)", px + 24, gy0 + gs * ps + 78);
        levelBuilder._decoLibBtns = [];
        const lib = levelBuilder.decoLibrary || [];
        for (let i = 0; i < Math.min(lib.length, 10); i++) {
            const bx = px + 20 + i * 48, by = gy0 + gs * ps + 90;
            const on = levelBuilder.decoLibIdx === i;
            fill(on ? color(80, 50, 120) : color(40));
            stroke(on ? color(255, 220, 80) : 80); strokeWeight(on ? 2 : 1);
            rect(bx, by, 44, 44, 4); noStroke();
            if (lib[i] && lib[i].grid) lbDecoDrawGridPixels(lib[i].grid, bx + 2, by + 2, 40, 40);
            levelBuilder._decoLibBtns.push({ x: bx, y: by, w: 44, h: 44, idx: i });
        }

        // buttons
        const by = py + ph - 50;
        fill(0, 180, 100); rect(px + 20, by, 100, 32, 6);
        fill(180, 60, 60); rect(px + 130, by, 100, 32, 6);
        fill(255, 170, 60); rect(px + pw - 120, by, 100, 32, 6);
        fill(255); textSize(12); textAlign(CENTER, CENTER);
        text("SAVE", px + 70, by + 16);
        text("CLEAR", px + 180, by + 16);
        text("CLOSE", px + pw - 70, by + 16);
        levelBuilder._decoSaveBtn = { x: px + 20, y: by, w: 100, h: 32 };
        levelBuilder._decoClearBtn = { x: px + 130, y: by, w: 100, h: 32 };
        levelBuilder._decoCloseBtn = { x: px + pw - 120, y: by, w: 100, h: 32 };
        levelBuilder._decoPanel = { x: px, y: py, w: pw, h: ph };
    }
}

function builderSnapshot() {
    return {
        grid: JSON.parse(JSON.stringify(levelBuilder.grid || [])),
        cellMeta: JSON.parse(JSON.stringify(levelBuilder.cellMeta || {})),
        cols: levelBuilder.cols, rows: levelBuilder.rows,
        name: levelBuilder.name, portalTarget: levelBuilder.portalTarget,
        portalTargetIdx: levelBuilder.portalTargetIdx, slopeMode: levelBuilder.slopeMode,
        scrollC: levelBuilder.scrollC || 0,
        decoCells: JSON.parse(JSON.stringify(levelBuilder.decoCells || {})),
        decoStrokes: JSON.parse(JSON.stringify(levelBuilder.decoStrokes || [])),
        decoPlacements: JSON.parse(JSON.stringify(levelBuilder.decoPlacements || {})),
        decoLibrary: JSON.parse(JSON.stringify(levelBuilder.decoLibrary || [])),
        mode: levelBuilder.mode || "classic"
    };
}
function builderRestoreSnapshot(snap) {
    if (!snap) return;
    levelBuilder.grid = JSON.parse(JSON.stringify(snap.grid || []));
    levelBuilder.cellMeta = JSON.parse(JSON.stringify(snap.cellMeta || {}));
    levelBuilder.cols = snap.cols || 48; levelBuilder.rows = snap.rows || 14;
    levelBuilder.name = snap.name || "My Level";
    levelBuilder.portalTarget = snap.portalTarget || "ship";
    levelBuilder.portalTargetIdx = snap.portalTargetIdx || 0;
    levelBuilder.slopeMode = snap.slopeMode == null ? 1 : snap.slopeMode;
    levelBuilder.scrollC = snap.scrollC || 0;
    if (snap.decoCells) levelBuilder.decoCells = JSON.parse(JSON.stringify(snap.decoCells));
    if (snap.decoStrokes) levelBuilder.decoStrokes = JSON.parse(JSON.stringify(snap.decoStrokes));
    if (snap.decoPlacements) levelBuilder.decoPlacements = JSON.parse(JSON.stringify(snap.decoPlacements));
    if (snap.decoLibrary) levelBuilder.decoLibrary = JSON.parse(JSON.stringify(snap.decoLibrary));
    if (snap.mode) levelBuilder.mode = snap.mode;
}
function builderPushUndo() {
    if (!Array.isArray(levelBuilder.undoStack)) levelBuilder.undoStack = [];
    if (!Array.isArray(levelBuilder.redoStack)) levelBuilder.redoStack = [];
    levelBuilder.undoStack.push(builderSnapshot());
    if (levelBuilder.undoStack.length > (levelBuilder.historyLimit || 80)) levelBuilder.undoStack.shift();
    levelBuilder.redoStack = [];
}
function builderUndo() {
    if (!levelBuilder.undoStack || !levelBuilder.undoStack.length) { levelBuilder.msg = "Nothing to undo"; return; }
    levelBuilder.redoStack.push(builderSnapshot());
    builderRestoreSnapshot(levelBuilder.undoStack.pop());
    levelBuilder.msg = "Undo ✓";
}
function builderRedo() {
    if (!levelBuilder.redoStack || !levelBuilder.redoStack.length) { levelBuilder.msg = "Nothing to redo"; return; }
    levelBuilder.undoStack.push(builderSnapshot());
    builderRestoreSnapshot(levelBuilder.redoStack.pop());
    levelBuilder.msg = "Redo ✓";
}
function builderPaintCellAt(mx, my, dragMode) {
    if (levelBuilder.selectMode) return false; // never paint while selecting
    const L = builderLayout();
    const m = builderWorldMetrics();
    const vis = L.visCols || Math.max(4, Math.floor(sirina / m.cellW));
    const scrollC = levelBuilder.scrollC || 0;
    const scrollX = (L.startX != null ? L.startX : LB_START_X) + scrollC * m.cellW - 8;
    const viewTop = L.topUI || 64;
    const viewBot = sirina - (L.bottomUI || 118);
    if (my < viewTop || my >= viewBot) return false;
    // Inverse of editor view transform: screen → world
    const vm = levelBuilder._viewMap;
    let worldY, worldX;
    if (vm && vm.s) {
        worldY = (my - vm.yShift) / vm.s;
        worldX = mx + (vm.scrollX != null ? vm.scrollX : scrollX);
    } else {
        worldY = my;
        worldX = mx + scrollX;
    }
    const r = floor((m.g - worldY) / m.blockH);
    const c = floor((worldX - m.startX) / m.cellW);
    if (r < 0 || r >= levelBuilder.rows || c < 0 || c >= levelBuilder.cols || !levelBuilder.grid[r]) return false;
    const gx = 0, gy = viewTop, cw = m.cellW, ch = m.blockH;
    const tools = builderCurrentTools(), next = levelBuilder.tool + 1, tname = tools[levelBuilder.tool];
    const key = r + "," + c;
    levelBuilder.selectedCell = key;
    const _tchk = (builderCurrentTools()[levelBuilder.tool]) || "";
    if (dragMode && levelBuilder.dragPaintLast === key && _tchk !== "deco") return true;
    const old = levelBuilder.grid[r][c] || 0;
    // ERASE tool: clear any object in cell (no need to match type)
    if (tname === "decoErase") {
        if (!dragMode) builderPushUndo();
        const got = typeof lbDecoEraseAt === "function" && lbDecoEraseAt(r, c);
        if (!got && !dragMode && levelBuilder.undoStack && levelBuilder.undoStack.length) levelBuilder.undoStack.pop();
        levelBuilder.msg = got ? "Decoration erased" : "No decoration here";
        levelBuilder.dragPaintLast = key;
        return true;
    }
    if (tname === "erase") {
        const hasDeco = (levelBuilder.decoPlacements && levelBuilder.decoPlacements[key])
            || (levelBuilder.decoCells && levelBuilder.decoCells[key]);
        if (!old && !hasDeco) {
            // still try stroke erase near cell
            if (!dragMode) builderPushUndo();
            const got = typeof lbDecoEraseAt === "function" && lbDecoEraseAt(r, c);
            levelBuilder.dragPaintLast = key;
            if (got) levelBuilder.msg = "Erased deco";
            return true;
        }
        builderPushUndo();
        levelBuilder.grid[r][c] = 0;
        if (levelBuilder.cellMeta) delete levelBuilder.cellMeta[key];
        if (typeof lbDecoEraseAt === "function") lbDecoEraseAt(r, c);
        levelBuilder.dragPaintLast = key;
        levelBuilder.msg = "Erased";
        return true;
    }
    if (dragMode && old === next && tname !== "deco") { levelBuilder.dragPaintLast = key; return true; }
    if (!dragMode && tname === "secretCoin" && old !== next && builderCountSecretCoins() >= 3) { levelBuilder.msg = "Max 3 secret coins"; return true; }
    // DECO: place pixel-art on top of anything (covers blocks)
    if (tname === "deco") {
        if (dragMode && levelBuilder.dragPaintLast === key) return true;
        let grid = typeof lbDecoGetPlaceGrid === "function" ? lbDecoGetPlaceGrid() : null;
        if (!grid) grid = levelBuilder.decoDraft;
        if (!grid) {
            levelBuilder.msg = "Press EDIT, paint pixels, SAVE, then place";
            return true;
        }
        let has = false;
        for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if (grid[i] && grid[i][j]) has = true;
        if (!has) { levelBuilder.msg = "Empty deco — EDIT → paint → SAVE"; return true; }
        // keep library in sync so SAVE level keeps sprites
        if (!levelBuilder.decoLibrary) levelBuilder.decoLibrary = [];
        if (!levelBuilder.decoLibrary.length) {
            levelBuilder.decoLibrary.push({ name: "Deco 1", grid: JSON.parse(JSON.stringify(grid)) });
            levelBuilder.decoLibIdx = 0;
        }
        if (!dragMode) builderPushUndo();
        if (!levelBuilder.decoPlacements) levelBuilder.decoPlacements = {};
        const under = old ? (tools[old - 1] || "") : "";
        const shape = lbDecoShapeOf(under);
        const umeta = (levelBuilder.cellMeta && levelBuilder.cellMeta[key]) || {};
        levelBuilder.decoPlacements[key] = {
            libIdx: levelBuilder.decoLibIdx || 0,
            grid: JSON.parse(JSON.stringify(grid)),
            shape: shape,
            shapeName: under || "",
            scale: Number(umeta.scale) || 1,
            rot: Number(umeta.rot) || 0,
            ox: Number(umeta.ox) || 0,
            oy: Number(umeta.oy) || 0,
            r: r,
            c: c
        };
        levelBuilder.dragPaintLast = key;
        levelBuilder.msg = "Deco on " + (under || "empty") + " (" + shape + ")";
        return true;
    }
    builderPushUndo();
    if (!dragMode && old === next) {
        levelBuilder.grid[r][c] = 0; delete levelBuilder.cellMeta[key];
    } else {
        levelBuilder.grid[r][c] = next;
        if (!levelBuilder.cellMeta) levelBuilder.cellMeta = {};
        const previousMeta = levelBuilder.cellMeta[key] || {};
        if (tname === "portal") levelBuilder.cellMeta[key] = { ...previousMeta, target: levelBuilder.portalTarget || "ship" };
        else if (tname === "waveSlope") levelBuilder.cellMeta[key] = { ...previousMeta, slopeMode: levelBuilder.slopeMode != null ? levelBuilder.slopeMode : 1 };
        else levelBuilder.cellMeta[key] = { ...previousMeta };
    }
    levelBuilder.dragPaintLast = key;
    return true;
}

function builderResizeSelected(delta) {
    // With DECO tool: S+/S- change brush thickness
    const toolsDeco = typeof builderCurrentTools === "function" ? builderCurrentTools() : [];
    if (toolsDeco[levelBuilder.tool] === "deco") {
        const cur = levelBuilder.decoSize || 0.35;
        levelBuilder.decoSize = constrain(cur + (delta > 0 ? 0.1 : -0.1), 0.12, 1.2);
        levelBuilder.msg = "Deco brush " + levelBuilder.decoSize.toFixed(2);
        return;
    }
    const keys = typeof builderGetSelectionKeys === "function" ? builderGetSelectionKeys() : [];
    const list = keys.length ? keys : (levelBuilder.selectedCell ? [levelBuilder.selectedCell] : []);
    if (!list.length) { levelBuilder.msg = "Select object(s) first"; return; }
    builderPushUndo();
    if (!levelBuilder.cellMeta) levelBuilder.cellMeta = {};
    const tools = builderCurrentTools();
    let n = 0, lastMsg = "";
    for (let key of list) {
        const parts = key.split(",").map(Number), r = parts[0], c = parts[1];
        if (!levelBuilder.grid[r] || !levelBuilder.grid[r][c]) continue;
        const meta = levelBuilder.cellMeta[key] || {};
        const current = Number(meta.scale) || 1;
        const tname = tools[(levelBuilder.grid[r][c] || 1) - 1] || "";
        const isPortal = tname === "portal" || tname === "gravityUp" || tname === "gravityDown"
            || tname === "portalDual" || tname === "sizeMini" || tname === "sizeNormal" || tname === "endDual";
        const maxS = isPortal ? Math.max(levelBuilder.rows || 12, 12) : 3;
        const step = isPortal ? (delta > 0 ? 1 : -1) : delta;
        const next = isPortal
            ? constrain(Math.round(current + step), 1, maxS)
            : Math.round(constrain(current + delta, 0.5, maxS) * 4) / 4;
        levelBuilder.cellMeta[key] = { ...meta, scale: next };
        n++;
        lastMsg = isPortal
            ? ("Portal h=" + next + "/" + maxS)
            : ("size " + next.toFixed(2) + "×");
    }
    levelBuilder.msg = n > 1 ? ("Sized " + n + " objects → " + lastMsg) : lastMsg;
}


// Hit-test by visual position (ox/oy + scale), not just grid slot
function builderPickKeyAt(mx, my) {
    const L = builderLayout();
    const m = builderWorldMetrics();
    const vis = L.visCols || Math.max(4, Math.floor(sirina / m.cellW));
    const scrollC = levelBuilder.scrollC || 0;
    const scrollX = (L.startX != null ? L.startX : LB_START_X) + scrollC * m.cellW - 8;
    const viewTop = L.topUI || 64;
    const viewBot = sirina - (L.bottomUI || 118);
    if (my < viewTop || my >= viewBot) return null;
    const vm = levelBuilder._viewMap;
    const s = (vm && vm.s) ? vm.s : 1;
    const yShift = (vm && vm.yShift != null) ? vm.yShift : 0;
    const scrX = (vm && vm.scrollX != null) ? vm.scrollX : scrollX;
    const worldY = (my - yShift) / s;
    const worldX0 = mx + scrX;
    let best = null, bestDist = 1e18;
    for (let r = 0; r < levelBuilder.rows; r++) {
        for (let vi = 0; vi < vis + 2; vi++) {
            const c = scrollC + vi - 1;
            if (c < 0 || c >= levelBuilder.cols) continue;
            if (!levelBuilder.grid[r] || !levelBuilder.grid[r][c]) continue;
            const key = r + "," + c;
            const meta = (levelBuilder.cellMeta && levelBuilder.cellMeta[key]) || {};
            const ox = Number(meta.ox) || 0;
            const oy = Number(meta.oy) || 0;
            const sc = constrain(Number(meta.scale) || 1, 0.5, 18);
            const px = m.startX + c * m.cellW + ox * m.cellW - scrX;
            const py = m.g - (r + 1) * m.blockH - oy * m.blockH;
            // to screen
            const sx = px;
            const sy = py * s + yShift;
            const cwS = m.cellW;
            const chS = m.blockH * s;
            const cx = sx + cwS / 2, cy = sy + chS / 2;
            const hw = (cwS * sc) * 0.55, hh = (chS * sc) * 0.55;
            if (mx >= cx - hw && mx <= cx + hw && my >= cy - hh && my <= cy + hh) {
                const d = (mx - cx) * (mx - cx) + (my - cy) * (my - cy);
                if (d < bestDist) { bestDist = d; best = key; }
            }
        }
    }
    if (best) return best;
    const c = floor((worldX0 - m.startX) / m.cellW);
    const r = floor((m.g - worldY) / m.blockH);
    if (r < 0 || r >= levelBuilder.rows || c < 0 || c >= levelBuilder.cols) return null;
    return r + "," + c;
}
function builderGetSelectionKeys() {
    let keys = (levelBuilder.selectedCells && levelBuilder.selectedCells.length)
        ? levelBuilder.selectedCells.slice()
        : (levelBuilder.selectedCell ? [levelBuilder.selectedCell] : []);
    return keys.filter(k => {
        const p = k.split(",").map(Number);
        return levelBuilder.grid[p[0]] && levelBuilder.grid[p[0]][p[1]];
    });
}
function builderCellMetaCopy(key) {
    const m = (levelBuilder.cellMeta && levelBuilder.cellMeta[key]) ? levelBuilder.cellMeta[key] : {};
    // deep copy ALL fields (scale, ox, oy, rot, target, slopeMode, …)
    return JSON.parse(JSON.stringify(m));
}
function builderCopySelection() {
    const keys = builderGetSelectionKeys();
    if (!keys.length) { levelBuilder.msg = "Select object(s) first (SEL + click / drag)"; return; }
    // Visual positions (grid + ox/oy) so spacing matches what you see — including scaled/nudged
    let minVr = 1e9, minVc = 1e9;
    const raw = [];
    for (let k of keys) {
        const p = k.split(",").map(Number);
        const r = p[0], c = p[1];
        const v = levelBuilder.grid[r][c];
        if (!v) continue;
        const meta = builderCellMetaCopy(k);
        const ox = Number(meta.ox) || 0;
        const oy = Number(meta.oy) || 0;
        const vr = r + oy;
        const vc = c + ox;
        minVr = Math.min(minVr, vr);
        minVc = Math.min(minVc, vc);
        raw.push({ vr, vc, v, meta });
    }
    if (!raw.length) { levelBuilder.msg = "Nothing to copy"; return; }
    const cells = raw.map(item => ({
        dvr: item.vr - minVr,
        dvc: item.vc - minVc,
        v: item.v,
        // keep scale/rot/target/… but ox/oy recalculated on paste from visual delta
        meta: item.meta
    }));
    levelBuilder.clipboard = { multi: true, cells: cells };
    levelBuilder.msg = "Copied " + cells.length + " (scale/offset kept) — Ctrl+V";
}
function builderPasteSelection() {
    const clip = levelBuilder.clipboard;
    if (!clip) { levelBuilder.msg = "Clipboard empty (Ctrl+C)"; return; }
    const key = levelBuilder.selectedCell;
    if (!key) { levelBuilder.msg = "Select target cell first"; return; }
    const parts = key.split(",").map(Number);
    const baseR = parts[0], baseC = parts[1];
    // base visual = target cell (+ its ox/oy if any, else 0)
    const baseMeta = (levelBuilder.cellMeta && levelBuilder.cellMeta[key]) || {};
    const baseVr = baseR + (Number(baseMeta.oy) || 0);
    const baseVc = baseC + (Number(baseMeta.ox) || 0);
    builderPushUndo();
    if (!levelBuilder.cellMeta) levelBuilder.cellMeta = {};
    // legacy single clipboard
    if (!clip.multi && clip.v != null) {
        levelBuilder.grid[baseR][baseC] = clip.v;
        levelBuilder.cellMeta[key] = JSON.parse(JSON.stringify(clip.meta || {}));
        levelBuilder.msg = "Pasted 1";
        return;
    }
    const cells = clip.cells || [];
    let n = 0;
    const newSel = [];
    for (let cell of cells) {
        const dvr = cell.dvr != null ? cell.dvr : (cell.dr || 0);
        const dvc = cell.dvc != null ? cell.dvc : (cell.dc || 0);
        const vr = baseVr + dvr;
        const vc = baseVc + dvc;
        // snap to nearest grid cell, store fractional remainder as ox/oy
        let r = Math.round(vr);
        let c = Math.round(vc);
        r = constrain(r, 0, levelBuilder.rows - 1);
        c = constrain(c, 0, levelBuilder.cols - 1);
        if (!levelBuilder.grid[r]) continue;
        const oy = Math.round((vr - r) * 50) / 50;
        const ox = Math.round((vc - c) * 50) / 50;
        levelBuilder.grid[r][c] = cell.v;
        const metaIn = cell.meta ? JSON.parse(JSON.stringify(cell.meta)) : {};
        // preserve scale, rot, target, slopeMode… replace ox/oy with layout-correct ones
        metaIn.ox = ox;
        metaIn.oy = oy;
        if (metaIn.scale == null && cell.meta && cell.meta.scale != null) metaIn.scale = cell.meta.scale;
        const k = r + "," + c;
        levelBuilder.cellMeta[k] = metaIn;
        newSel.push(k);
        n++;
    }
    if (newSel.length) {
        levelBuilder.selectedCells = newSel;
        levelBuilder.selectedCell = newSel[0];
    }
    levelBuilder.msg = "Pasted " + n + " (same spacing + scale)";
}

function builderRotateSelected() {
    // +90° on meta.rot — cells stay the same shape; badge shows angle.
    // At 180° spike/slope/pad/gravity also type-swap so editor icon matches play.
    let keys = typeof builderGetSelectionKeys === "function" ? builderGetSelectionKeys() : [];
    if (!keys.length && levelBuilder.selectedCell) keys = [levelBuilder.selectedCell];
    if (!keys.length) {
        levelBuilder.msg = "Click an object first, then ROT / T";
        return;
    }
    builderPushUndo();
    if (!levelBuilder.cellMeta) levelBuilder.cellMeta = {};
    const tools = builderCurrentTools();
    let n = 0, lastRot = 0;
    for (let key of keys) {
        const p = key.split(",").map(Number);
        const r = p[0], c = p[1];
        const v = levelBuilder.grid[r] && levelBuilder.grid[r][c];
        if (!v) continue;
        const tname = tools[v - 1] || "";
        const meta = levelBuilder.cellMeta[key] || {};
        const prev = Number(meta.rot) || 0;
        const rot = (prev + 90) % 360;
        lastRot = rot;

        // SLOPE: true +90° rotation (meta.rot) — icon + play use same angle
        if (tname === "slope" || tname === "slopeFlip") {
            levelBuilder.cellMeta[key] = { ...meta, rot: rot };
            n++;
            continue;
        }

        // waveSlope: cycle mode each press
        if (tname === "waveSlope") {
            let sm = meta.slopeMode != null ? meta.slopeMode : 1;
            if (sm === 1) sm = -1;
            else if (sm === -1) sm = 0;
            else sm = 1;
            levelBuilder.cellMeta[key] = { ...meta, slopeMode: sm };
            n++;
            continue;
        }

        // spike / pads / gravity: type-swap every press (clear visual)
        const swapsEvery = {
            spike: "spikeDown", spikeDown: "spike",
            padYellow: "padYellowCeil", padYellowCeil: "padYellow",
            padBlue: "padBlueCeil", padBlueCeil: "padBlue",
            padPink: "padPinkCeil", padPinkCeil: "padPink",
            gravityUp: "gravityDown", gravityDown: "gravityUp"
        };
        if (swapsEvery[tname]) {
            const ni = tools.indexOf(swapsEvery[tname]);
            if (ni >= 0) levelBuilder.grid[r][c] = ni + 1;
            const m = { ...meta };
            delete m.rot;
            levelBuilder.cellMeta[key] = m;
            n++;
            continue;
        }

        // everything else: store +90° rot
        levelBuilder.cellMeta[key] = { ...meta, rot: rot };
        n++;
    }
    if (n === 0) levelBuilder.msg = "No object on selected cell";
    else levelBuilder.msg = "ROT +90° → " + lastRot + "° (" + n + ")";
}

function builderNudgeSelected(dx, dy) {
    const keys = builderGetSelectionKeys();
    if (!keys.length) { levelBuilder.msg = "Select object(s) first"; return; }
    builderPushUndo();
    if (!levelBuilder.cellMeta) levelBuilder.cellMeta = {};
    for (let key of keys) {
        const meta = levelBuilder.cellMeta[key] || {};
        const ox = Math.round(((Number(meta.ox) || 0) + dx) * 50) / 50;
        const oy = Math.round(((Number(meta.oy) || 0) + dy) * 50) / 50;
        levelBuilder.cellMeta[key] = { ...meta, ox: ox, oy: oy };
    }
    levelBuilder.msg = "Nudged " + keys.length + " object(s)";
}
function builderDeleteSelection() {
    const keys = builderGetSelectionKeys();
    if (!keys.length) return;
    builderPushUndo();
    for (let key of keys) {
        const p = key.split(",").map(Number);
        if (levelBuilder.grid[p[0]]) levelBuilder.grid[p[0]][p[1]] = 0;
        if (levelBuilder.cellMeta) delete levelBuilder.cellMeta[key];
    }
    levelBuilder.selectedCells = [];
    levelBuilder.selectedCell = null;
    levelBuilder.msg = "Deleted " + keys.length;
}

function builderGridInit() {
    levelBuilder.undoStack = []; levelBuilder.redoStack = []; levelBuilder.dragPaintLast = "";
    levelBuilder.grid = [];
    levelBuilder.cellMeta = {};
    for (let r = 0; r < levelBuilder.rows; r++) {
        levelBuilder.grid[r] = [];
        for (let c = 0; c < levelBuilder.cols; c++) levelBuilder.grid[r][c] = 0;
    }
    levelBuilder.saveIdx = -1; // new blank is not linked to a save
    levelBuilder.scrollC = 0;
    levelBuilder.selectedCell = null;
}

// Pre-built moderate showcase using most new editor features
function builderToolId(name) {
    const i = levelBuilderToolsGD.indexOf(name);
    return i >= 0 ? i + 1 : 0;
}
function builderPut(r, c, name, meta) {
    if (r < 0 || c < 0 || r >= levelBuilder.rows || c >= levelBuilder.cols) return;
    const id = builderToolId(name);
    if (!id) return;
    levelBuilder.grid[r][c] = id;
    if (meta) {
        if (!levelBuilder.cellMeta) levelBuilder.cellMeta = {};
        levelBuilder.cellMeta[r + "," + c] = { ...(levelBuilder.cellMeta[r + "," + c] || {}), ...meta };
    }
}
function builderInstallShowcaseDemo() {
    levelBuilder.mode = "classic";
    levelBuilder.name = "Grok Showcase";
    levelBuilder.cols = 70;
    levelBuilder.rows = 12;
    levelBuilder.portalTarget = "ship";
    levelBuilder.portalTargetIdx = 1;
    levelBuilder.slopeMode = 1;
    levelBuilder.undoStack = [];
    levelBuilder.redoStack = [];
    levelBuilder.scrollC = 0;
    levelBuilder.selectedCell = null;
    levelBuilder.grid = [];
    levelBuilder.cellMeta = {};
    for (let r = 0; r < levelBuilder.rows; r++) {
        levelBuilder.grid[r] = [];
        for (let c = 0; c < levelBuilder.cols; c++) levelBuilder.grid[r][c] = 0;
    }

    // === 1. CUBE intro (floor = row 0) ===
    builderPut(0, 4, "spike");
    builderPut(0, 7, "padYellow");
    builderPut(0, 9, "block"); // small hop after pad
    builderPut(0, 12, "slope"); // / ramp
    builderPut(0, 13, "slope");
    builderPut(1, 13, "slope"); // step up
    builderPut(0, 15, "padPink"); // red pad boost
    builderPut(2, 16, "secretCoin");

    // Ship portal (tall)
    builderPut(0, 18, "portal", { target: "ship", scale: 5 });
    builderPut(2, 18, "portal", { target: "ship", scale: 5 });
    builderPut(4, 18, "portal", { target: "ship", scale: 5 });

    // Ship: sparse ceiling/floor spikes — easy dodge
    builderPut(0, 21, "spike");
    builderPut(levelBuilder.rows - 1, 23, "spikeDown");
    builderPut(0, 25, "spike");

    // Dual portal (full-ish)
    builderPut(0, 28, "portalDual", { scale: 6 });
    builderPut(3, 28, "portalDual", { scale: 6 });
    builderPut(6, 28, "portalDual", { scale: 6 });

    // Dual section: floor pad for bottom, mid orb for top
    builderPut(0, 30, "padYellow");
    builderPut(5, 31, "orbYellow");
    builderPut(0, 32, "padPink");
    builderPut(6, 33, "orbPink");
    builderPut(0, 34, "spike");
    builderPut(levelBuilder.rows - 1, 34, "spikeDown");

    // End dual
    builderPut(0, 36, "endDual", { scale: 5 });
    builderPut(3, 36, "endDual", { scale: 5 });

    // Mini size → tight but fair → normal size
    builderPut(0, 38, "sizeMini", { scale: 4 });
    builderPut(2, 38, "sizeMini", { scale: 4 });
    builderPut(0, 40, "spike");
    builderPut(0, 41, "block");
    builderPut(0, 43, "slope");
    builderPut(0, 44, "sizeNormal", { scale: 4 });
    builderPut(2, 44, "sizeNormal", { scale: 4 });

    // Robot + slopes
    builderPut(0, 46, "portal", { target: "robot", scale: 5 });
    builderPut(2, 46, "portal", { target: "robot", scale: 5 });
    builderPut(0, 48, "slope");
    builderPut(0, 49, "slope");
    builderPut(1, 49, "slope");
    builderPut(0, 50, "padYellow");
    builderPut(0, 51, "block");

    // Wave short corridor
    builderPut(0, 53, "portal", { target: "wave", scale: 5 });
    builderPut(3, 53, "portal", { target: "wave", scale: 5 });
    builderPut(6, 53, "portal", { target: "wave", scale: 5 });
    // gentle wave tunnel (wide)
    for (let i = 0; i < 6; i++) {
        builderPut(4, 55 + i, "waveSlope", { slopeMode: (i % 2 === 0) ? 1 : -1 });
        builderPut(5, 55 + i, "waveSlope", { slopeMode: (i % 2 === 0) ? 1 : -1 });
        builderPut(3, 55 + i, "waveSlope", { slopeMode: (i % 2 === 0) ? 1 : -1 });
    }

    // Back to cube, orb, goal
    builderPut(0, 62, "portal", { target: "cube", scale: 5 });
    builderPut(2, 62, "portal", { target: "cube", scale: 5 });
    builderPut(3, 64, "orbYellow");
    builderPut(0, 65, "padBlue");
    builderPut(0, 66, "spike");
    builderPut(0, 68, "end");
    builderPut(2, 68, "end");
    builderPut(4, 68, "end");
    builderPut(6, 68, "end");
    builderPut(8, 68, "end");

    // Persist into saved list (replace existing same name)
    levelBuilder.saveIdx = -1;
    const entry = {
        id: "showcase-grok",
        name: "Grok Showcase",
        mode: levelBuilder.mode || "classic",
        cols: levelBuilder.cols,
        rows: levelBuilder.rows,
        grid: JSON.parse(JSON.stringify(levelBuilder.grid)),
        cellMeta: JSON.parse(JSON.stringify(levelBuilder.cellMeta)),
        portalTarget: "ship",
        portalTargetIdx: 1,
        slopeMode: 1,
        created: Date.now()
    };
    const existing = levelBuilder.saved.findIndex(s => s.name === "Grok Showcase" || s.id === "showcase-grok");
    if (existing >= 0) levelBuilder.saved[existing] = entry;
    else levelBuilder.saved.unshift(entry);
    levelBuilder.saveIdx = Math.max(0, levelBuilder.saved.findIndex(s => s.id === "showcase-grok"));
    try { localStorage.setItem("customSavedLevels", JSON.stringify(levelBuilder.saved)); } catch (e) {}
    levelBuilder.msg = "Loaded: Grok Showcase — PLAY to try (easy/medium, new features)";
}


function builderCurrentTools() {
    return levelBuilderToolsGD;
}
function builderCountSecretCoins() {
    const tools = builderCurrentTools();
    const coinIdx = tools.indexOf("secretCoin") + 1;
    if (coinIdx < 1) return 0;
    let n = 0;
    for (let r = 0; r < levelBuilder.rows; r++)
        for (let c = 0; c < levelBuilder.cols; c++)
            if (levelBuilder.grid[r][c] === coinIdx) n++;
    return n;
}
function builderSaveLevel(asNew) {
    if (asNew) levelBuilder.saveIdx = -1;
    const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: levelBuilder.name || ("Level " + (levelBuilder.saved.length + 1)),
        mode: levelBuilder.mode || "classic",
        grid: JSON.parse(JSON.stringify(levelBuilder.grid)),
        cols: levelBuilder.cols,
        rows: levelBuilder.rows,
        portalTarget: levelBuilder.portalTarget,
        cellMeta: JSON.parse(JSON.stringify(levelBuilder.cellMeta || {})),
        musicUrl: levelBuilder.musicUrl || "",
        decoCells: JSON.parse(JSON.stringify(levelBuilder.decoCells || {})),
        decoStrokes: JSON.parse(JSON.stringify(levelBuilder.decoStrokes || [])),
        decoLibrary: JSON.parse(JSON.stringify(levelBuilder.decoLibrary || [])),
        decoPlacements: JSON.parse(JSON.stringify(levelBuilder.decoPlacements || {})),
        decoDraft: levelBuilder.decoDraft ? JSON.parse(JSON.stringify(levelBuilder.decoDraft)) : null,
        created: Date.now()
    };
    if (!asNew && levelBuilder.saveIdx >= 0 && levelBuilder.saveIdx < levelBuilder.saved.length) {
        entry.id = levelBuilder.saved[levelBuilder.saveIdx].id;
        entry.created = levelBuilder.saved[levelBuilder.saveIdx].created;
        // keep name unless user renamed
        levelBuilder.saved[levelBuilder.saveIdx] = entry;
        const dn = Object.keys(entry.decoPlacements || {}).length;
        const dl = (entry.decoLibrary || []).length;
        levelBuilder.msg = "Updated #" + (levelBuilder.saveIdx + 1) + ": " + entry.name
            + (dn || dl ? (" · deco " + dn + " / lib " + dl) : "");
    } else {
        // always push a NEW slot
        if (asNew && levelBuilder.saved.some(s => s.name === entry.name)) {
            entry.name = entry.name + " " + (levelBuilder.saved.length + 1);
        }
        levelBuilder.saved.push(entry);
        levelBuilder.saveIdx = levelBuilder.saved.length - 1;
        levelBuilder.savedPage = Math.floor(levelBuilder.saveIdx / 10);
        const dn = Object.keys(entry.decoPlacements || {}).length;
        const dl = (entry.decoLibrary || []).length;
        levelBuilder.msg = "Saved #" + (levelBuilder.saveIdx + 1) + ": " + entry.name + " (total " + levelBuilder.saved.length + ")"
            + (dn || dl ? (" · deco " + dn + " / lib " + dl) : "");
    }
    try { localStorage.setItem("customSavedLevels", JSON.stringify(levelBuilder.saved)); } catch (e) {
        levelBuilder.msg = "Save failed (storage full?)";
    }
}
function builderLoadLevel(idx) {
    if (idx < 0 || idx >= levelBuilder.saved.length) return;
    const s = levelBuilder.saved[idx];
    // Support old "gd" saves → treat as classic
    levelBuilder.mode = (s.mode === "platformer") ? "platformer" : "classic";
    levelBuilder.name = s.name || "My Level";
    levelBuilder.cols = s.cols || 48;
    levelBuilder.rows = s.rows || 14;
    levelBuilder.portalTarget = s.portalTarget || "ship";
    levelBuilder.portalTargetIdx = Math.max(0, LB_PORTAL_TARGETS.indexOf(levelBuilder.portalTarget));
    levelBuilder.musicUrl = s.musicUrl || "";
    builderGridInit();
    levelBuilder.saveIdx = idx;
    levelBuilder.savedPage = Math.floor(idx / 10);
    for (let r = 0; r < levelBuilder.rows; r++) {
        for (let c = 0; c < levelBuilder.cols; c++) {
            if (s.grid[r] && s.grid[r][c] != null) levelBuilder.grid[r][c] = s.grid[r][c];
        }
    }
    levelBuilder.cellMeta = s.cellMeta ? JSON.parse(JSON.stringify(s.cellMeta)) : {};
    levelBuilder.decoCells = s.decoCells ? JSON.parse(JSON.stringify(s.decoCells)) : {};
    levelBuilder.decoStrokes = s.decoStrokes ? JSON.parse(JSON.stringify(s.decoStrokes)) : [];
    levelBuilder.decoLibrary = s.decoLibrary ? JSON.parse(JSON.stringify(s.decoLibrary)) : [];
    levelBuilder.decoPlacements = s.decoPlacements ? JSON.parse(JSON.stringify(s.decoPlacements)) : {};
    levelBuilder.decoDraft = s.decoDraft ? JSON.parse(JSON.stringify(s.decoDraft)) : null;
    levelBuilder.msg = "Loaded #" + (idx + 1) + ": " + levelBuilder.name + " [" + levelBuilder.mode.toUpperCase() + "]"
        + (levelBuilder.decoPlacements && Object.keys(levelBuilder.decoPlacements).length ? (" · deco " + Object.keys(levelBuilder.decoPlacements).length) : "");
}
function builderDeleteLevel() {
    if (levelBuilder.saveIdx < 0 || levelBuilder.saveIdx >= levelBuilder.saved.length) {
        levelBuilder.msg = "Select a saved level first";
        return;
    }
    const name = levelBuilder.saved[levelBuilder.saveIdx].name;
    levelBuilder.saved.splice(levelBuilder.saveIdx, 1);
    levelBuilder.saveIdx = -1;
    levelBuilder.savedPage = Math.min(levelBuilder.savedPage || 0, Math.max(0, Math.ceil(levelBuilder.saved.length / 10) - 1));
    try { localStorage.setItem("customSavedLevels", JSON.stringify(levelBuilder.saved)); } catch (e) {}
    levelBuilder.msg = "Deleted: " + name + " (" + levelBuilder.saved.length + " left)";
}
function builderEncode() {
    // Versioned share payload: preserve decorations and per-cell editor settings too.
    const payload = {
        version: 2,
        mode: levelBuilder.mode,
        grid: levelBuilder.grid,
        name: levelBuilder.name,
        portalTarget: levelBuilder.portalTarget,
        cols: levelBuilder.cols,
        rows: levelBuilder.rows,
        cellMeta: levelBuilder.cellMeta || {},
        decoCells: levelBuilder.decoCells || {},
        decoStrokes: levelBuilder.decoStrokes || [],
        decoLibrary: levelBuilder.decoLibrary || [],
        decoPlacements: levelBuilder.decoPlacements || {},
        decoDraft: levelBuilder.decoDraft || null,
        musicUrl: levelBuilder.musicUrl || ""
    };
    // UTF-8 safe Base64 (works with Slovenian names and other Unicode text).
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    let binary = "";
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
}
function builderDecode(code) {
    try {
        let binary = atob(String(code).trim());
        let bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
        let data;
        try { data = JSON.parse(new TextDecoder().decode(bytes)); }
        catch (_) { data = JSON.parse(binary); } // backwards compatibility with older ASCII codes
        if (Array.isArray(data)) { levelBuilder.grid = data; return true; }
        if (!data || !data.grid) return false;
        levelBuilder.grid = data.grid;
        if (data.mode) levelBuilder.mode = data.mode;
        if (data.name != null) levelBuilder.name = data.name;
        if (data.portalTarget) levelBuilder.portalTarget = data.portalTarget;
        if (data.cols) levelBuilder.cols = data.cols;
        if (data.rows) levelBuilder.rows = data.rows;
        if (data.cellMeta) levelBuilder.cellMeta = JSON.parse(JSON.stringify(data.cellMeta));
        if (data.decoCells) levelBuilder.decoCells = JSON.parse(JSON.stringify(data.decoCells));
        if (data.decoStrokes) levelBuilder.decoStrokes = JSON.parse(JSON.stringify(data.decoStrokes));
        if (data.decoLibrary) levelBuilder.decoLibrary = JSON.parse(JSON.stringify(data.decoLibrary));
        if (data.decoPlacements) levelBuilder.decoPlacements = JSON.parse(JSON.stringify(data.decoPlacements));
        if (data.decoDraft !== undefined) levelBuilder.decoDraft = data.decoDraft ? JSON.parse(JSON.stringify(data.decoDraft)) : null;
        if (data.musicUrl !== undefined) levelBuilder.musicUrl = data.musicUrl || "";
        return true;
    } catch (e) { return false; }
}

// Convert builder grid → world obstacles (WYSIWYG: col→x, row→height from ground)

// Map editor rotation → pad/orb effect direction
// baseFacing: +1 floor-style, -1 ceil-style (from tool type)
// returns { facing, axis: "y"|"x" }
function lbEffectFromRot(baseFacing, rot) {
    const r = ((Number(rot) || 0) % 360 + 360) % 360;
    const bf = baseFacing == null ? 1 : baseFacing;
    if (r === 90) return { facing: 1, axis: "x" };   // boost right
    if (r === 270) return { facing: -1, axis: "x" }; // boost left
    if (r === 180) return { facing: -bf, axis: "y" }; // invert vertical
    return { facing: bf, axis: "y" };
}

function builderCompileLevelObstacles() {
    const tools = levelBuilderToolsGD;
    const m = builderWorldMetrics();
    gdGroundY = m.g;
    gdCeilY = m.ceilY;
    const g = gdGroundY;
    gdObstacles = [];
    let secretCount = 0;
    let hasEnd = false;
    levelBuilder._startWorldX = null;
    levelBuilder._startWorldY = null;
    gdLevelCheckpoint = null;

    for (let r = 0; r < levelBuilder.rows; r++) {
        for (let c = 0; c < levelBuilder.cols; c++) {
            const v = levelBuilder.grid[r][c];
            if (!v) continue;
            const tname = tools[v - 1];
            if (!tname) continue;
            const meta = (levelBuilder.cellMeta && levelBuilder.cellMeta[r + "," + c]) || {};
            const blockH = (g - gdCeilY) / levelBuilder.rows;
            // Sub-cell nudge from arrow keys (0.2 block steps in ox/oy)
            const x = LB_START_X + c * LB_CELL_W + (Number(meta.ox) || 0) * LB_CELL_W;
            // row 0 = ground; higher r = higher in air; oy positive = up
            const yTop = g - (r + 1) * blockH - (Number(meta.oy) || 0) * blockH;
            const firstObstacleIndex = gdObstacles.length;

            if (tname === "erase" || tname === "decoErase") {
                // editor-only
            } else if (tname === "deco") {
                gdObstacles.push({ type: "deco", x: x + 2, y: yTop + 2, w: LB_CELL_W - 4, h: blockH - 4 });
            } else if (tname === "spike") {
                gdObstacles.push({ type: "spike", x: x + (LB_CELL_W - 20) / 2, y: yTop + blockH - 20, w: 20, h: 20 });
            } else if (tname === "spikeDown") {
                gdObstacles.push({ type: "spikeDown", x: x + (LB_CELL_W - 20) / 2, y: yTop, w: 20, h: 20 });
            } else if (tname === "block") {
                gdObstacles.push({ type: "block", x: x, y: yTop, w: LB_CELL_W - 4, h: blockH });
            } else if (tname === "padYellow" || tname === "padYellowCeil") {
                const baseF = (tname === "padYellowCeil") ? -1 : 1;
                const ef = lbEffectFromRot(baseF, meta.rot);
                const atCeil = (ef.axis === "y" && ef.facing < 0);
                gdObstacles.push({
                    type: "padYellow",
                    x: x + 2,
                    y: atCeil ? yTop : (yTop + blockH - 14),
                    w: LB_CELL_W - 8, h: 14,
                    facing: ef.facing, axis: ef.axis, rot: Number(meta.rot) || 0
                });
            } else if (tname === "padBlue" || tname === "padBlueCeil") {
                const baseF = (tname === "padBlueCeil") ? -1 : 1;
                const ef = lbEffectFromRot(baseF, meta.rot);
                const atCeil = (ef.axis === "y" && ef.facing < 0);
                gdObstacles.push({
                    type: "padBlue",
                    x: x + 2,
                    y: atCeil ? yTop : (yTop + blockH - 14),
                    w: LB_CELL_W - 8, h: 14,
                    facing: ef.facing, axis: ef.axis, rot: Number(meta.rot) || 0
                });
            } else if (tname === "orbYellow") {
                const ef = lbEffectFromRot(1, meta.rot);
                gdObstacles.push({ type: "orbYellow", x: x + (LB_CELL_W - 26) / 2, y: yTop + (blockH - 26) / 2, w: 26, h: 26, facing: ef.facing, axis: ef.axis, rot: Number(meta.rot) || 0 });
            } else if (tname === "orbBlue") {
                // legacy tool index — green-orb behavior (grav flip + boost)
                const ef = lbEffectFromRot(1, meta.rot);
                gdObstacles.push({ type: "orbBlue", x: x + (LB_CELL_W - 26) / 2, y: yTop + (blockH - 26) / 2, w: 26, h: 26, facing: ef.facing, axis: ef.axis, rot: Number(meta.rot) || 0 });
            } else if (tname === "orbBlueTrue") {
                const ef = lbEffectFromRot(1, meta.rot);
                gdObstacles.push({ type: "orbBlueTrue", x: x + (LB_CELL_W - 26) / 2, y: yTop + (blockH - 26) / 2, w: 26, h: 26, facing: ef.facing, axis: ef.axis, rot: Number(meta.rot) || 0 });
            } else if (tname === "orbBlack") {
                const ef = lbEffectFromRot(1, meta.rot);
                gdObstacles.push({ type: "orbBlack", x: x + (LB_CELL_W - 26) / 2, y: yTop + (blockH - 26) / 2, w: 26, h: 26, facing: ef.facing, axis: ef.axis, rot: Number(meta.rot) || 0 });
            } else if (tname === "orbDash") {
                const ef = lbEffectFromRot(1, meta.rot);
                gdObstacles.push({ type: "orbDash", x: x + (LB_CELL_W - 26) / 2, y: yTop + (blockH - 26) / 2, w: 26, h: 26, facing: ef.facing, axis: ef.axis, rot: Number(meta.rot) || 0 });
            } else if (tname === "portal") {
                // Cell-sized: only this grid row. Stack two portals in same column
                // (different rows) for e.g. ship top + cube bottom. SIZE+/- grows them.
                gdObstacles.push({
                    type: "portal", x: x + 6, y: yTop + 2,
                    w: LB_CELL_W - 12, h: Math.max(18, blockH - 4),
                    target: meta.target || levelBuilder.portalTarget || "ship",
                    used: false
                });
            } else if (tname === "gravityUp") {
                gdObstacles.push({
                    type: "gravityPortal", x: x + 6, y: yTop + 2,
                    w: LB_CELL_W - 12, h: Math.max(18, blockH - 4),
                    gravityDir: -1, used: false
                });
            } else if (tname === "gravityDown") {
                gdObstacles.push({
                    type: "gravityPortal", x: x + 6, y: yTop + 2,
                    w: LB_CELL_W - 12, h: Math.max(18, blockH - 4),
                    gravityDir: 1, used: false
                });
            } else if (tname === "secretCoin") {
                if (secretCount < 3) {
                    gdObstacles.push({ type: "secretCoin", x: x + (LB_CELL_W - 24) / 2, y: yTop + (blockH - 24) / 2, w: 24, h: 24 });
                    secretCount++;
                }
            } else if (tname === "waveSlope") {
                const half = 55;
                const y0 = constrain(yTop + blockH * 0.5, gdCeilY + half, g - half);
                // meta.slopeMode: 0 flat, 1 up-45, -1 down-45
                let sm = meta.slopeMode;
                if (sm == null) sm = (levelBuilder.slopeMode != null ? levelBuilder.slopeMode : 1);
                gdObstacles.push({
                    type: "waveSlope", x: x, w: LB_CELL_W,
                    top1: y0 - half, top2: y0 - half,
                    bottom1: y0 + half, bottom2: y0 + half,
                    slopeMode: sm,
                    _center: y0
                });
            } else if (tname === "end") {
                gdObstacles.push({ type: "goal", x: x, y: gdCeilY, w: 14, h: g - gdCeilY });
                hasEnd = true;
            } else if (tname === "padPink" || tname === "padPinkCeil") {
                const baseF = (tname === "padPinkCeil") ? -1 : 1;
                const ef = lbEffectFromRot(baseF, meta.rot);
                const atCeil = (ef.axis === "y" && ef.facing < 0);
                gdObstacles.push({
                    type: "padPink",
                    x: x + 2,
                    y: atCeil ? yTop : (yTop + blockH - 14),
                    w: LB_CELL_W - 8, h: 14,
                    facing: ef.facing, axis: ef.axis, rot: Number(meta.rot) || 0
                });
            } else if (tname === "orbPink") {
                const ef = lbEffectFromRot(1, meta.rot);
                gdObstacles.push({ type: "orbPink", x: x + (LB_CELL_W - 26) / 2, y: yTop + (blockH - 26) / 2, w: 26, h: 26, facing: ef.facing, axis: ef.axis, rot: Number(meta.rot) || 0 });
            } else if (tname === "portalDual") {
                gdObstacles.push({
                    type: "portalDual", x: x + 6, y: yTop + 2,
                    w: LB_CELL_W - 12, h: Math.max(18, blockH - 4), used: false
                });
            } else if (tname === "sizeMini") {
                gdObstacles.push({
                    type: "sizePortal", x: x + 6, y: yTop + 2,
                    w: LB_CELL_W - 12, h: Math.max(18, blockH - 4),
                    size: "mini", used: false
                });
            } else if (tname === "sizeNormal") {
                gdObstacles.push({
                    type: "sizePortal", x: x + 6, y: yTop + 2,
                    w: LB_CELL_W - 12, h: Math.max(18, blockH - 4),
                    size: "normal", used: false
                });
            } else if (tname === "endDual") {
                gdObstacles.push({
                    type: "endDual", x: x + 6, y: yTop + 2,
                    w: LB_CELL_W - 12, h: Math.max(18, blockH - 4), used: false
                });
            } else if (tname === "slope") {
                gdObstacles.push({ type: "slope", x: x, y: yTop, w: LB_CELL_W - 4, h: blockH, dir: 1, rot: Number(meta.rot) || 0 });
            } else if (tname === "slopeFlip") {
                gdObstacles.push({ type: "slope", x: x, y: yTop, w: LB_CELL_W - 4, h: blockH, dir: -1, rot: Number(meta.rot) || 0 });
            } else if (tname === "sawblade") {
                // SIZE: 0.5 small, 1 medium, 2 large, 3 huge
                const sc = constrain(Number(meta.scale) || 1, 0.5, 3);
                const sz = Math.round(22 * sc + 10);
                gdObstacles.push({
                    type: "sawblade",
                    x: x + (LB_CELL_W - sz) / 2,
                    y: yTop + (blockH - sz) / 2,
                    w: sz, h: sz,
                    scale: sc,
                    rot: Number(meta.rot) || 0
                });
            } else if (tname === "startPos") {
                // Start marker (editor only visual + sets spawn). Not a hazard.
                gdObstacles.push({
                    type: "startPos",
                    x: x + 4, y: yTop + 4,
                    w: LB_CELL_W - 8, h: blockH - 8
                });
                // Preferred spawn: player screen x stays ~100, so scroll so world start aligns
                // Store world X; applied after loop
                if (typeof window !== "undefined") window.__lbStartX = x;
                else if (typeof globalThis !== "undefined") globalThis.__lbStartX = x;
                levelBuilder._startWorldX = x;
                levelBuilder._startWorldY = yTop + blockH - 28;
            } else if (tname === "checkpoint") {
                gdObstacles.push({
                    type: "checkpoint",
                    x: x + 6, y: yTop + 2,
                    w: LB_CELL_W - 12, h: Math.max(20, blockH - 4),
                    activated: false
                });
            }
            // stamp rot — visual + hitbox use o.rot; only AABB boxes swap w/h
            if (meta.rot) {
                const rot = ((Number(meta.rot) % 360) + 360) % 360;
                for (let oi = firstObstacleIndex; oi < gdObstacles.length; oi++) {
                    const ob = gdObstacles[oi];
                    ob.rot = rot;
                    // Spikes: pure rotation (full-cell), no type/w-h swap
                    if (ob.type === "spike" || ob.type === "spikeDown") continue;
                    // Slopes: store rot; draw/collide from rotated verts (dir stays as authored)
                    if (ob.type === "slope") continue;
                    // waveSlope: 90/180/270 invert slope direction
                    if (ob.type === "waveSlope") {
                        const sm0 = ob.slopeMode != null ? ob.slopeMode : 1;
                        if (rot === 90 || rot === 180 || rot === 270) ob.slopeMode = -sm0;
                        continue;
                    }
                    // gravity portals: 180 flips up↔down
                    if (ob.type === "gravityPortal") {
                        if (rot === 180) ob.gravityDir = -(ob.gravityDir || 1);
                        continue;
                    }
                    // Axis-aligned solids (blocks/walls): swap footprint for 90/270
                    if ((rot === 90 || rot === 270) && ob.w != null && ob.h != null
                        && (ob.type === "block" || ob.type === "wall" || ob.type === "plat")) {
                        const cx = ob.x + ob.w / 2, cy = ob.y + ob.h / 2;
                        const nw = ob.h, nh = ob.w;
                        ob.w = nw; ob.h = nh;
                        ob.x = cx - nw / 2;
                        ob.y = cy - nh / 2;
                    }
                }
            }
            // Apply per-object editor scale to the actual collision/render geometry.
            // Portals allow high scale (floor→ceiling); other objects stay 0.5–3.
            const isPortalObj = tname === "portal" || tname === "gravityUp" || tname === "gravityDown"
                || tname === "portalDual" || tname === "sizeMini" || tname === "sizeNormal" || tname === "endDual";
            const objectScale = constrain(Number(meta.scale) || 1, 0.5, isPortalObj ? 18 : 3);
            if (objectScale !== 1) {
                for (let oi = firstObstacleIndex; oi < gdObstacles.length; oi++) {
                    const ob = gdObstacles[oi];
                    if (ob.type === "sawblade") continue; // already sized from meta.scale
                    if (meta.rot) ob.rot = Number(meta.rot) || 0;
                    const cx = ob.x + (ob.w || 0) / 2;
                    if (ob.type === "goal") {
                        // full-height goal: only scale width
                        ob.w = (ob.w || 0) * objectScale;
                        ob.x = cx - ob.w / 2;
                    } else if (ob.type === "portal" || ob.type === "gravityPortal"
                        || ob.type === "portalDual" || ob.type === "sizePortal" || ob.type === "endDual") {
                        // Height-only. scale = number of cells tall; max = full floor→ceiling.
                        const fullH = Math.max(20, g - gdCeilY - 20);
                        const cellH = Math.max(18, blockH - 4);
                        const maxCells = Math.max(levelBuilder.rows || 12, 12);
                        if (objectScale >= maxCells) {
                            // full height
                            ob.y = gdCeilY + 10;
                            ob.h = fullH;
                        } else {
                            // N cells tall, expand from original cell center, clamp into playfield
                            ob.h = constrain(cellH * objectScale, 14, fullH);
                            const cy = yTop + blockH * 0.5;
                            ob.y = cy - ob.h * 0.5;
                            if (ob.y < gdCeilY + 10) ob.y = gdCeilY + 10;
                            if (ob.y + ob.h > g - 10) ob.y = g - 10 - ob.h;
                        }
                    } else if (ob.type === "waveSlope") {
                        ob.w = (ob.w || 0) * objectScale;
                        ob.x = cx - ob.w / 2;
                    } else {
                        const cy = ob.y + (ob.h || 0) / 2;
                        ob.w = (ob.w || 0) * objectScale;
                        ob.h = (ob.h || 0) * objectScale;
                        ob.x = cx - ob.w / 2;
                        ob.y = cy - ob.h / 2;
                    }
                }
            }
        }
    }
    // Decoration from overlay layer (never collide)
        // (decoPixel attached after merges)
// Merge vertically adjacent objects in the same column:
    // portals (same target), gravity, dual, size, endDual, and blocks.
    {
        function mergeVertical(type, sameKeyFn, buildFn) {
            const list = gdObstacles.filter(o => o.type === type);
            if (!list.length) return;
            const used = new Set();
            const merged = [];
            list.sort((a, b) => (a.x - b.x) || (b.y - a.y));
            for (let i = 0; i < list.length; i++) {
                if (used.has(i)) continue;
                let p = list[i];
                used.add(i);
                let top = p.y, bottom = p.y + p.h, x = p.x, w = p.w;
                let changed = true;
                while (changed) {
                    changed = false;
                    for (let j = 0; j < list.length; j++) {
                        if (used.has(j)) continue;
                        const q = list[j];
                        if (!sameKeyFn(p, q)) continue;
                        if (Math.abs(q.x - x) > 4) continue;
                        if (q.y + q.h >= top - 6 && q.y <= bottom + 6) {
                            top = Math.min(top, q.y);
                            bottom = Math.max(bottom, q.y + q.h);
                            used.add(j);
                            changed = true;
                        }
                    }
                }
                merged.push(buildFn(p, x, top, w, bottom - top));
            }
            gdObstacles = gdObstacles.filter(o => o.type !== type).concat(merged);
        }
        // Portals are NOT merged — grow height only with SIZE+ so other cells stay free.
        // Only solid blocks merge when stacked.
        mergeVertical("block",
            () => true,
            (p, x, top, w, h) => ({ type: "block", x, y: top, w, h })
        );
        // Solid slopes: merge HORIZONTALLY (same row, same dir) into one continuous ramp.
        // Vertical merge was wrong — stacked cells became a tall triangle with no walkable surface.
        {
            let slopes = gdObstacles.filter(o => o.type === "slope");
            if (slopes.length) {
                gdObstacles = gdObstacles.filter(o => o.type !== "slope");
                slopes.sort((a, b) => (a.y - b.y) || (a.x - b.x));
                const used = new Set();
                for (let i = 0; i < slopes.length; i++) {
                    if (used.has(i)) continue;
                    let o = slopes[i];
                    used.add(i);
                    let x0 = o.x, x1 = o.x + o.w, y = o.y, h = o.h, dir = o.dir || 1;
                    const rot0 = Number(o.rot) || 0;
                    let changed = true;
                    while (changed) {
                        changed = false;
                        for (let j = 0; j < slopes.length; j++) {
                            if (used.has(j)) continue;
                            const q = slopes[j];
                            if ((q.dir || 1) !== dir) continue;
                            if ((Number(q.rot) || 0) !== rot0) continue; // don't merge different rotations
                            if (Math.abs(q.y - y) > 6 || Math.abs(q.h - h) > 6) continue;
                            if (Math.abs(q.x - x1) <= 10) {
                                x1 = Math.max(x1, q.x + q.w);
                                used.add(j); changed = true;
                            } else if (Math.abs((q.x + q.w) - x0) <= 10) {
                                x0 = Math.min(x0, q.x);
                                used.add(j); changed = true;
                            }
                        }
                    }
                    gdObstacles.push({ type: "slope", x: x0, y: y, w: x1 - x0, h: h, dir: dir, rot: rot0 });
                }
            }
        }
    }
    // Merge horizontally adjacent wave slopes (same slopeMode) into longer segments,
    // then stitch continuous corridors.
    {
        const half = 55;
        let slopes = gdObstacles.filter(o => o.type === "waveSlope").sort((a, b) => a.x - b.x);
        const used = new Set();
        const mergedSlopes = [];
        for (let i = 0; i < slopes.length; i++) {
            if (used.has(i)) continue;
            let o = slopes[i];
            used.add(i);
            let x0 = o.x, x1 = o.x + o.w;
            let sm = o.slopeMode != null ? o.slopeMode : 1;
            let c0 = o._center;
            for (let j = i + 1; j < slopes.length; j++) {
                if (used.has(j)) continue;
                const q = slopes[j];
                const qsm = q.slopeMode != null ? q.slopeMode : 1;
                if (qsm !== sm) continue;
                if (Math.abs(q.x - x1) > 8) continue;
                // allow slight vertical difference so stacked corridor pieces still link
                if (c0 != null && q._center != null && Math.abs((q._center || 0) - (c0 || 0)) > half * 1.25) continue;
                x1 = Math.max(x1, q.x + q.w);
                used.add(j);
            }
            mergedSlopes.push({
                type: "waveSlope", x: x0, w: x1 - x0,
                slopeMode: sm, _center: c0,
                top1: 0, top2: 0, bottom1: 0, bottom2: 0
            });
        }
        gdObstacles = gdObstacles.filter(o => o.type !== "waveSlope").concat(mergedSlopes);
        slopes = mergedSlopes.sort((a, b) => a.x - b.x);
        for (let i = 0; i < slopes.length; i++) {
            const o = slopes[i];
            const sm = o.slopeMode != null ? o.slopeMode : 1;
            let cStart = o._center;
            if (i > 0) {
                const prev = slopes[i - 1];
                if (Math.abs((prev.x + prev.w) - o.x) < 8) {
                    cStart = (prev.top2 + prev.bottom2) * 0.5;
                }
            }
            cStart = constrain(cStart != null ? cStart : (gdCeilY + g) * 0.5, gdCeilY + half, g - half);
            let dy = 0;
            if (sm === 1) dy = -o.w;
            else if (sm === -1) dy = o.w;
            let cEnd = constrain(cStart + dy, gdCeilY + half, g - half);
            o.top1 = cStart - half; o.top2 = cEnd - half;
            o.bottom1 = cStart + half; o.bottom2 = cEnd + half;
            o.slope = (cEnd - cStart) / Math.max(1, o.w);
            delete o._center;
        }
    }
    // Precise deco: snap to host obstacle after scale + slope merges
    if (levelBuilder.decoPlacements) {
        const blockH = (g - gdCeilY) / levelBuilder.rows;
        for (const key of Object.keys(levelBuilder.decoPlacements)) {
            const pl = levelBuilder.decoPlacements[key];
            if (!pl || !pl.grid) continue;
            const parts = key.split(",").map(Number);
            const r = parts[0], c = parts[1];
            if (isNaN(r) || isNaN(c)) continue;
            const meta = (levelBuilder.cellMeta && levelBuilder.cellMeta[key]) || {};
            const ox = (pl.ox != null ? pl.ox : Number(meta.ox)) || 0;
            const oy = (pl.oy != null ? pl.oy : Number(meta.oy)) || 0;
            const cellX = LB_START_X + c * LB_CELL_W + ox * LB_CELL_W;
            const cellY = g - (r + 1) * blockH - oy * blockH;
            const cx = cellX + LB_CELL_W * 0.5;
            const cy = cellY + blockH * 0.5;
            // Find host solid / portal / slope covering this cell center
            let host = null;
            let hostScore = 1e18;
            for (let oi = 0; oi < gdObstacles.length; oi++) {
                const o = gdObstacles[oi];
                if (!o || o.type === "decoPixel" || o.type === "deco" || o.type === "decoStroke" || o.type === "goal") continue;
                if (o.type === "slope") {
                    // long merged slopes: any x overlap with cell + y band
                    if (cx < o.x - 2 || cx > o.x + o.w + 2) continue;
                    if (cy < o.y - 4 || cy > o.y + o.h + 4) continue;
                    const dist = Math.abs(cx - (o.x + o.w * 0.5));
                    if (dist < hostScore) { host = o; hostScore = dist; }
                    continue;
                }
                if (o.w == null || o.h == null) continue;
                if (cx >= o.x - 2 && cx <= o.x + o.w + 2 && cy >= o.y - 2 && cy <= o.y + o.h + 2) {
                    const dist = Math.abs(cx - (o.x + o.w * 0.5)) + Math.abs(cy - (o.y + o.h * 0.5));
                    if (dist < hostScore) { host = o; hostScore = dist; }
                }
            }
            let dx, dy, dw, dh, shape;
            if (host) {
                if (host.type === "slope") {
                    // Only this cell's column of the merged slope — exact surface band
                    dx = cellX;
                    dw = LB_CELL_W - 4;
                    dy = host.y;
                    dh = host.h;
                    shape = (host.dir || 1) >= 0 ? "slope" : "slopeFlip";
                } else if (host.type === "portal" || host.type === "gravityPortal"
                    || host.type === "portalDual" || host.type === "sizePortal" || host.type === "endDual") {
                    // Full scaled portal box
                    dx = host.x; dy = host.y; dw = host.w; dh = host.h;
                    shape = "portal";
                } else if (host.type === "spike") {
                    dx = host.x; dy = host.y; dw = host.w; dh = host.h;
                    shape = "spikeUp";
                } else if (host.type === "spikeDown") {
                    dx = host.x; dy = host.y; dw = host.w; dh = host.h;
                    shape = "spikeDown";
                } else if (host.type === "block" || host.type === "wall" || host.type === "plat") {
                    dx = host.x; dy = host.y; dw = host.w; dh = host.h;
                    shape = "block";
                } else if (String(host.type).indexOf("orb") >= 0 || host.type === "sawblade" || host.type === "secretCoin") {
                    dx = host.x; dy = host.y; dw = host.w; dh = host.h;
                    shape = "circle";
                } else if (String(host.type).indexOf("pad") >= 0) {
                    dx = host.x; dy = host.y; dw = host.w; dh = host.h;
                    shape = "pad";
                } else {
                    dx = host.x; dy = host.y; dw = host.w; dh = host.h;
                    shape = pl.shape || "rect";
                }
            } else {
                dx = cellX; dy = cellY; dw = LB_CELL_W; dh = blockH;
                shape = pl.shape || "rect";
            }
            gdObstacles.push({
                type: "decoPixel",
                x: dx, y: dy, w: dw, h: dh,
                grid: pl.grid,
                shape: shape,
                shapeName: pl.shapeName || "",
                hostType: host ? host.type : ""
            });
        }
    }

    if (!hasEnd) {
        const endX = LB_START_X + levelBuilder.cols * LB_CELL_W + 80;
        gdObstacles.push({ type: "goal", x: endX, y: gdCeilY, w: 10, h: g - gdCeilY });
    }
}

function startBuilderTest(fromCol) {
    // Platformer = same level + same physics as classic, only movement differs (arrows vs auto-scroll)
    gdPlatformerMode = (levelBuilder.mode === "platformer");
    lbPlayLevelMusic();
    const tools = levelBuilderToolsGD;
    gdVehicle = "cube";
    gdGroundY = sirina - 80;
    // The builder's ROW count controls the playable ceiling. Scale each row
    // to fit the available playfield, so changing ROW+/ROW- changes real space.
    // Each editor row represents a fixed chunk of real vertical space.
    // More ROWs therefore move the ceiling upward and enlarge the playable area;
    // fewer ROWs lower it. Clamp only to keep a minimum safe playfield.
    const builderWorldCellH = Math.max(20, (gdGroundY - 40) / 18);
    gdCeilY = Math.max(32, gdGroundY - levelBuilder.rows * builderWorldCellH);
    gdScroll = 0;
    // A new test attempt starts with a clean, stationary hitbox path.
    if (levelBuilder) levelBuilder.hitboxTrail = [];
    gdSpeed = 5.2;
    gdWon = false;
    gameOver = false;
    winScreen = false;
    jumpscare = false;
    pavza = false;
    gdStarted = true;
    gdGravityDir = 1;
    gdBallGravity = 1;
    gdSwingDir = 1;
    gdDual = false;
    gdCube2 = null;
    gdVehicle2 = "cube";
    gdGravityDir2 = -1;
    gdPlayerSize = (typeof GD_SIZE_NORMAL !== "undefined") ? GD_SIZE_NORMAL : 1;
    gdPlayerSize2 = gdPlayerSize;
    gdWaveTrail2 = [];
    gdCube = { x: 100, y: gdGroundY - 28, w: 28, h: 28, vy: 0, onGround: true, rot: 0, shipUp: false };
    builderCompileLevelObstacles();
    // Apply custom start position (player stays near screen x=100, world scrolls)
    if (levelBuilder._startWorldX != null) {
        gdScroll = max(0, levelBuilder._startWorldX - 100);
        if (levelBuilder._startWorldY != null && gdCube) {
            gdCube.y = constrain(levelBuilder._startWorldY, gdCeilY, gdGroundY - gdCube.h);
        }
        if (gdCube) gdCube.onGround = true;
    }
    if (fromCol != null && fromCol !== undefined && fromCol >= 0) {
        const wx = LB_START_X + Number(fromCol) * LB_CELL_W;
        gdScroll = max(0, wx - 100);
        if (gdCube) { gdCube.onGround = true; gdCube.vy = 0; gdCube.x = 100; }
        levelBuilder.msg = "Play from col " + fromCol;
    }

    gameMode = "GD Builder Test";
    menu = false;
    levelBuilder.testing = true;
    frameRate(60);
}

function startBuilderSnakeTest() {
    gameMode = "Custom Mode"; isCustomMode = true; menu = false;
    levelBuilder.testing = true;
    stene = [];
    for (let r = 0; r < levelBuilder.rows; r++) for (let c = 0; c < levelBuilder.cols; c++) {
        const v = levelBuilder.grid[r][c];
        if (v === 1) stene.push(createVector(c * velikost, r * velikost));
    }
    resetGame();
    frameRate(13);
}
function startBuilderPlatTest() {
    gameMode = "Platformer"; menu = false; levelBuilder.testing = true;
    resetGame();
    frameRate(60);
}


function updateDailySeedMeta(){
    if(!dailySeedMode || gameOver) return;
    dailySeedScore=max(dailySeedScore, k ? k.dolzina : 0);
}

function saveDailySeedResult(){
    if(!dailySeedMode || dailySeedResultSaved) return;
    dailySeedResultSaved=true;
    dailySeedDeaths++;
    const today=getTodayString();
    const entry={score:dailySeedScore,deaths:dailySeedDeaths,time:Date.now()};
    dailySeedLeaderboard.push(entry); dailySeedLeaderboard.sort((a,b)=>b.score-a.score); dailySeedLeaderboard=dailySeedLeaderboard.slice(0,10);
    localStorage.setItem("dailySeedLeaderboard_"+today,JSON.stringify(dailySeedLeaderboard));
    localStorage.setItem("dailySeedBest_"+today,String(max(dailySeedScore,Number(localStorage.getItem("dailySeedBest_"+today)||0))));
}

function getTodayString() {
    let d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

function generateDailyChallenge() {
    let today = getTodayString();
    let seed = 0;
    for (let i = 0; i < today.length; i++) seed = (seed * 31 + today.charCodeAt(i)) % 100000;
    dailySeed = seed;
    randomSeed(seed);

    dailyModifiers = [];
    let pool = ["Fast", "Double Food", "Walls", "Chaser", "Mines"]; // Shrink permanently removed
    let num = floor(random(2, 4));
    for (let i = pool.length - 1; i > 0; i--) {
        let j = floor(random(i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    for (let i = 0; i < num; i++) dailyModifiers.push(pool[i]);

    dailyTargetScore = 15 + floor(random(6, 14));
    if (dailyModifiers.includes("Fast")) dailyTargetScore += 3;
    if (dailyModifiers.includes("Walls") || dailyModifiers.includes("Mines")) dailyTargetScore += 2;
    dailyTargetScore = constrain(dailyTargetScore, 14, 30);

    randomSeed(millis());
}

function unlockAchievement(key, rewardKey) {
    let newlyUnlocked = false;
    if (!achievements[key]) {
        achievements[key] = true;
        localStorage.setItem("achievements", JSON.stringify(achievements));
        newlyUnlocked = true;
    }
    // Always ensure reward is granted (fixes cases where achievement was unlocked before reward existed)
    if (rewardKey && !unlockedRewards[rewardKey]) {
        unlockedRewards[rewardKey] = true;
        localStorage.setItem("unlockedRewards", JSON.stringify(unlockedRewards));
        if (rewardKey === "neonTrail") { equipNeonTrail = true; localStorage.setItem("equipNeonTrail", true); }
        if (rewardKey === "sparkleAura") { equipSparkleAura = true; localStorage.setItem("equipSparkleAura", true); }
        // Auto-add exclusive skin name to owned skins so it appears & can be equipped
        for (let es of exclusiveSkins) {
            if (es.key === rewardKey && !kupljeneKoze.includes(es.name)) {
                kupljeneKoze.push(es.name);
                localStorage.setItem("kupljeneKoze", JSON.stringify(kupljeneKoze));
            }
        }
        newlyUnlocked = true;
    }
    if (newlyUnlocked) playWinSound();
}

// Grant any missing rewards for already-completed achievements (migration)
function syncAchievementRewards() {
    const map = {
        beginner: "neonTrail", dailyStarter: "auroraPulse", shopper: "emberSkin",
        modeHopper: "starfield", platformerStart: "crystalSkin", collector: "sparkleAura",
        firstSteps: "specialDeath", coinHoarder: "goldTrail", dailyWarrior: "solarFlare",
        dailyLegend: "phoenixWings", platformerRookie: "neonGrid", platformerMaster: "cyberPhantom",
        highRoller: "goldenCrownPlus", immortal: "ghostAura", speedDemon: "voidWalker",
        bossSlayer: "bossTrophy", glitchLord: "realityGlitch",
        gdExplorer: "gdPrismSkin", gdShipPilot: "gdShipSkin", gdWaveMaster: "gdVoidBackground", gdSwingMaster: "gdSwingAccessory",
        gdRobotMaster: "gdRobotSkin", gdUFOMaster: "gdUFOBackground", gdBallMaster: "gdBallAccessory", gdPortalRunner: "gdCrownAccessory",
        endlessClimber: "endlessFlareSkin", endlessVeteran: "endlessSkyBackground", endlessMarathon: "endlessHaloAccessory",
        stereoMadnessClear: "stereoGlowTrail", waveSkillClear: "wavePerfectAura", pulseFactoryClear: "pulseFactorySkin"
    };
    let changed = false;
    for (let k in map) {
        if (achievements[k] && !unlockedRewards[map[k]]) {
            unlockedRewards[map[k]] = true;
            changed = true;
        }
    }
    if (changed) localStorage.setItem("unlockedRewards", JSON.stringify(unlockedRewards));

    // Ensure exclusive skins with unlocked rewards appear in owned list
    let skinChanged = false;
    for (let es of exclusiveSkins) {
        if (unlockedRewards[es.key] && !kupljeneKoze.includes(es.name)) {
            kupljeneKoze.push(es.name);
            skinChanged = true;
        }
    }
    if (skinChanged) localStorage.setItem("kupljeneKoze", JSON.stringify(kupljeneKoze));
}

function handleJumpscareImage(file) {
    if (file.type === 'image') customJumpscareImg = loadImage(file.data);
    else customJumpscareImg = null;
}
function handleBgImage(file) {
    if (file.type === 'image') customBgImg = loadImage(file.data);
    else customBgImg = null;
}
function loadCustomGrid(key, target, size) {
    if (localStorage.getItem(key)) {
        let loaded = JSON.parse(localStorage.getItem(key));
        if (loaded && loaded.length === size) {
            for (let i = 0; i < size; i++)
                for (let j = 0; j < size; j++) target[i][j] = loaded[i][j];
        }
    }
}

// ========== IMPROVED SOUNDS ==========
function tryStartMusic() {
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") {
        audioCtx.resume().then(() => {
            audioUnlocked = true;
            if (!ambientActive) startAmbientForBg(trenutnoOzadje || "Magenta");
        }).catch(() => {});
    } else {
        audioUnlocked = true;
        if (!ambientActive) startAmbientForBg(trenutnoOzadje || "Magenta");
    }
}

// ===== LEVEL BUILDER CUSTOM MUSIC =====
let lbMusicAudio = null;
function lbStopLevelMusic() {
    try {
        if (lbMusicAudio) { lbMusicAudio.pause(); lbMusicAudio.src = ""; lbMusicAudio = null; }
    } catch (e) {}
}
function lbPlayLevelMusic() {
    lbStopLevelMusic();
    const url = (levelBuilder && levelBuilder.musicUrl) ? String(levelBuilder.musicUrl).trim() : "";
    if (!url) return;
    try {
        lbMusicAudio = new Audio(url);
        lbMusicAudio.loop = true;
        lbMusicAudio.volume = 0.55;
        const p = lbMusicAudio.play();
        if (p && p.catch) p.catch(() => {});
    } catch (e) {}
}
function lbPromptMusicUrl() {
    let cur = levelBuilder.musicUrl || "";
    let next = cur;
    try {
        next = window.prompt("Level music URL (mp3/ogg) — empty = none", cur);
    } catch (e) { next = cur; }
    if (next == null) return;
    levelBuilder.musicUrl = String(next).trim();
    levelBuilder.msg = levelBuilder.musicUrl ? ("Music: " + levelBuilder.musicUrl.slice(0, 40)) : "Music cleared";
}

function unlockAudioFromGesture() {
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    audioUnlocked = true;
    if (!ambientActive && (menu || !gameOver)) startAmbientForBg(trenutnoOzadje || "Magenta");
}

function playTone(freq, type, duration, volume = 0.3, detune = 0) {
    if (!audioCtx || !soundEnabled) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (detune) osc.detune.setValueAtTime(detune, now);
    let v = volume * masterVolume;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(max(0.001, v), now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(now); osc.stop(now + duration + 0.05);
}

function playToneSlide(startFreq, endFreq, type, duration, volume = 0.25) {
    if (!audioCtx || !soundEnabled) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    let v = volume * masterVolume;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(max(0.001, v), now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(now); osc.stop(now + duration + 0.05);
}

function playEatSound() {
    playTone(620, "square", 0.06, 0.12);
    playTone(880, "square", 0.09, 0.10);
    playTone(1240, "sine", 0.07, 0.06);
}

function playDeathSound() {
    playToneSlide(220, 55, "sawtooth", 0.45, 0.32);
    playToneSlide(180, 40, "square", 0.55, 0.18);
    playTone(90, "sawtooth", 0.7, 0.15);
}

function playBuySound() {
    playTone(523, "sine", 0.08, 0.18);
    playTone(659, "sine", 0.10, 0.16);
    playTone(784, "sine", 0.14, 0.14);
}

function playMenuSound() {
    playTone(440, "triangle", 0.05, 0.10);
    playTone(554, "triangle", 0.04, 0.06);
}

function playJumpSound() {
    playToneSlide(280, 520, "square", 0.12, 0.16);
    playTone(640, "sine", 0.08, 0.08);
}

function playPortalSound() {
    playToneSlide(360, 900, "sine", 0.18, 0.16);
    playTone(1180, "triangle", 0.09, 0.08);
}

function playFallSound() {
    playToneSlide(420, 95, "triangle", 0.32, 0.20);
    playTone(72, "sine", 0.18, 0.10);
}

function playCoinSound() {
    playTone(988, "sine", 0.07, 0.18);
    playTone(1319, "sine", 0.10, 0.14);
    playTone(1760, "triangle", 0.08, 0.08);
}

function playWinSound() {
    playTone(523, "sine", 0.12, 0.18);
    setTimeout(() => playTone(659, "sine", 0.12, 0.18), 90);
    setTimeout(() => playTone(784, "sine", 0.12, 0.18), 180);
    setTimeout(() => playTone(1047, "sine", 0.25, 0.22), 270);
}

function playJumpscareSound() {
    if (!audioCtx || !soundEnabled) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const v = Math.min(1, masterVolume * 1.35);

    // Hard digital slam
    const slam = audioCtx.createOscillator();
    const slamG = audioCtx.createGain();
    slam.type = "square";
    slam.frequency.setValueAtTime(55, now);
    slam.frequency.exponentialRampToValueAtTime(18, now + 0.12);
    slamG.gain.setValueAtTime(0.001, now);
    slamG.gain.exponentialRampToValueAtTime(1.0 * v, now + 0.004);
    slamG.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    slam.connect(slamG); slamG.connect(audioCtx.destination);
    slam.start(now); slam.stop(now + 0.16);

    // Razor screech — very short, very high
    for (let i = 0; i < 3; i++) {
        const sc = audioCtx.createOscillator();
        const sg = audioCtx.createGain();
        sc.type = i === 0 ? "sawtooth" : "square";
        const f0 = 3200 + i * 900;
        sc.frequency.setValueAtTime(f0, now);
        sc.frequency.exponentialRampToValueAtTime(f0 * 1.8, now + 0.03);
        sc.frequency.exponentialRampToValueAtTime(400 + i * 80, now + 0.18);
        sg.gain.setValueAtTime(0.001, now);
        sg.gain.exponentialRampToValueAtTime((0.55 - i * 0.12) * v, now + 0.005);
        sg.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        sc.connect(sg); sg.connect(audioCtx.destination);
        sc.start(now); sc.stop(now + 0.22);
    }

    // Bitcrush-ish grit bursts
    for (let i = 0; i < 6; i++) {
        const n = audioCtx.createOscillator();
        const ng = audioCtx.createGain();
        n.type = "square";
        n.frequency.setValueAtTime(180 + Math.random() * 2400, now + i * 0.012);
        ng.gain.setValueAtTime(0.001, now + i * 0.012);
        ng.gain.exponentialRampToValueAtTime(0.22 * v, now + i * 0.012 + 0.003);
        ng.gain.exponentialRampToValueAtTime(0.001, now + i * 0.012 + 0.05);
        n.connect(ng); ng.connect(audioCtx.destination);
        n.start(now + i * 0.012); n.stop(now + i * 0.012 + 0.06);
    }

    // Sub hit for body
    const sub = audioCtx.createOscillator();
    const subG = audioCtx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(40, now);
    sub.frequency.exponentialRampToValueAtTime(15, now + 0.2);
    subG.gain.setValueAtTime(0.001, now);
    subG.gain.exponentialRampToValueAtTime(0.85 * v, now + 0.008);
    subG.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    sub.connect(subG); subG.connect(audioCtx.destination);
    sub.start(now); sub.stop(now + 0.28);
}


function getSeasonalId() {
    let d = new Date();
    return d.getFullYear() + "-M" + (d.getMonth() + 1);
}
function initSeasonalEvent() {
    let m = new Date().getMonth(); // 0-11
    const events = [
        { name: "❄️ Winter Chill", skin: "Frostbite", bonusMult: 1.5, color: [180, 220, 255], months: [11, 0, 1] },
        { name: "🌸 Spring Bloom", skin: "Petal", bonusMult: 1.4, color: [255, 150, 200], months: [2, 3, 4] },
        { name: "☀️ Summer Heat", skin: "Solar", bonusMult: 1.5, color: [255, 180, 40], months: [5, 6, 7] },
        { name: "🎃 Autumn Spook", skin: "Pumpkin", bonusMult: 1.0, color: [255, 100, 30], months: [8, 9, 10] }
    ];
    seasonalEvent = events.find(e => e.months.includes(m)) || events[0];
}

const SEASONAL_SKIN_MONTHS = {
    "Frostbite": [11, 0, 1],
    "Petal": [2, 3, 4],
    "Solar": [5, 6, 7],
    "Pumpkin": [8, 9, 10]
};
const SEASONAL_BG_MONTHS = {
    "Winter Night": [11, 0, 1],
    "Spring Garden": [2, 3, 4],
    "Summer Horizon": [5, 6, 7],
    "Autumn Grove": [8, 9, 10]
};
const SEASONAL_BG_FOR_SKIN = {
    "Frostbite": "Winter Night",
    "Petal": "Spring Garden",
    "Solar": "Summer Horizon",
    "Pumpkin": "Autumn Grove"
};
function isSeasonalSkin(name) {
    return !!SEASONAL_SKIN_MONTHS[name];
}
function isSeasonalSkinInSeason(name) {
    let months = SEASONAL_SKIN_MONTHS[name];
    if (!months) return true;
    return months.includes(new Date().getMonth());
}
function isSeasonalBg(name) {
    return !!SEASONAL_BG_MONTHS[name];
}
function isSeasonalBgInSeason(name) {
    let months = SEASONAL_BG_MONTHS[name];
    if (!months) return true;
    return months.includes(new Date().getMonth());
}
function currentSeasonSkinName() {
    return seasonalEvent ? seasonalEvent.skin : null;
}

// Draw one snake segment as animated multi-square mosaic (seasonal premium look)
function drawSeasonalSegment(x, y, size, skinName, segIndex, isHead) {
    noStroke();
    const sub = 4; // 4x4 mini squares
    const cell = size / sub;
    for (let si = 0; si < sub; si++) {
        for (let sj = 0; sj < sub; sj++) {
            let t = frameCount * 0.12 + segIndex * 0.45 + si * 0.35 + sj * 0.28;
            let px = x + si * cell, py = y + sj * cell;
            let edge = (si === 0 || sj === 0 || si === sub - 1 || sj === sub - 1);
            if (skinName === "Pumpkin") {
                // orange glow + dark ridges + green stem tip on head
                let pulse = 0.72 + sin(t) * 0.28;
                if (isHead && sj === 0 && si >= 1 && si <= 2) {
                    fill(40 * pulse, 160 * pulse, 30);
                } else if ((si + sj + floor(frameCount * 0.08 + segIndex)) % 3 === 0) {
                    fill(40 * pulse, 20, 5);
                } else {
                    fill(255 * pulse, (90 + si * 12) * pulse, 15 + sj * 5);
                }
                // eye holes on head
                if (isHead && sj === 1 && (si === 1 || si === 2)) fill(20, 8, 0);
            } else if (skinName === "Frostbite") {
                let shine = 0.65 + sin(t * 1.2) * 0.35;
                let ice = (si + sj + floor(frameCount * 0.1 + segIndex)) % 4;
                if (ice === 0) fill(255 * shine, 255 * shine, 255);
                else if (ice === 1) fill(140 * shine, 200 * shine, 255);
                else if (ice === 2) fill(80 * shine, 160 * shine, 240);
                else fill(200 * shine, 240 * shine, 255);
                if (edge) fill(220 * shine, 245 * shine, 255, 220);
            } else if (skinName === "Petal") {
                let pulse = 0.7 + sin(t * 0.9) * 0.3;
                let petal = (si * 2 + sj + floor(frameCount * 0.07 + segIndex)) % 5;
                if (petal === 0) fill(255 * pulse, 220 * pulse, 240);
                else if (petal === 1) fill(255 * pulse, 120 * pulse, 180);
                else if (petal === 2) fill(255 * pulse, 160 * pulse, 200);
                else if (petal === 3) fill(240 * pulse, 80 * pulse, 140);
                else fill(255 * pulse, 200 * pulse, 220);
                if (isHead && si === 1 && sj === 1) fill(255, 230, 80); // pollen center
            } else if (skinName === "Solar") {
                let flicker = 0.6 + sin(t * 1.4) * 0.4;
                let layer = abs(si - 1.5) + abs(sj - 1.5);
                if (layer < 1.2) fill(255 * flicker, 255 * flicker, 200);
                else if (layer < 2.2) fill(255 * flicker, 200 * flicker, 40);
                else fill(255 * flicker, 120 * flicker, 0);
                if (edge && (frameCount + si * 3 + sj * 5 + segIndex) % 7 < 2) fill(255, 255, 180);
            } else {
                fill(200);
            }
            rect(px, py, cell + 0.5, cell + 0.5);
        }
    }
}



function claimSeasonalReward() {
    if (!seasonalEvent || seasonalClaimed) return;
    seasonalClaimed = true;
    localStorage.setItem("seasonalClaimed_" + getSeasonalId(), "true");
    if (!kupljeneKoze.includes(seasonalEvent.skin)) {
        kupljeneKoze.push(seasonalEvent.skin);
        localStorage.setItem("kupljeneKoze", JSON.stringify(kupljeneKoze));
    }
    trenutnaKoza = seasonalEvent.skin;
    localStorage.setItem("trenutnaKoza", trenutnaKoza);
    // also unlock matching seasonal background
    let sBg = SEASONAL_BG_FOR_SKIN[seasonalEvent.skin];
    if (sBg && !kupljenaOzadja.includes(sBg)) {
        kupljenaOzadja.push(sBg);
        localStorage.setItem("kupljenaOzadja", JSON.stringify(kupljenaOzadja));
    }
    if (sBg) {
        trenutnoOzadje = sBg;
        localStorage.setItem("trenutnoOzadje", trenutnoOzadje);
        startAmbientForBg(trenutnoOzadje);
    }
    kovanci += 100;
    localStorage.setItem("snakeCoins", kovanci);
    playWinSound();
}

// ========== AMBIENT / MENU MUSIC ==========
function stopAmbient() {
    for (let n of ambientNodes) {
        try { if (n.stop) n.stop(); } catch (e) {}
        try { if (n.disconnect) n.disconnect(); } catch (e) {}
    }
    ambientNodes = [];
    ambientActive = false;
    musicNextMs = 0;
    musicStep = 0;
    musicBassNextMs = 0;
    musicBassStep = 0;
    musicHatNextMs = 0;
}

// Continuous evolving pad / drone unique per background
function startAmbientForBg(bgName) {
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    stopAmbient();
    lastAmbientBg = bgName || trenutnoOzadje;
    const now = audioCtx.currentTime;

    // [rootHz, wave, vol, intervals[], filterHz, lfoRate, style]
    // style: "warm" | "cold" | "digital" | "dark" | "bright" | "organic"
    const profiles = {
        "Magenta":        { root: 65, wave: "sine", vol: 0.028, harm: [1, 1.5, 2], filter: 900, lfo: 0.15, style: "warm" },
        "Deep Space":     { root: 40, wave: "sine", vol: 0.025, harm: [1, 2, 3], filter: 400, lfo: 0.06, style: "cold" },
        "Matrix":         { root: 82, wave: "square", vol: 0.012, harm: [1, 1.5], filter: 1200, lfo: 0.35, style: "digital" },
        "Neon Grid":      { root: 88, wave: "square", vol: 0.011, harm: [1, 1.25, 2], filter: 1400, lfo: 0.4, style: "digital" },
        "Snow":           { root: 98, wave: "triangle", vol: 0.022, harm: [1, 1.5, 3], filter: 2000, lfo: 0.1, style: "cold" },
        "Arctic":         { root: 92, wave: "sine", vol: 0.024, harm: [1, 1.5, 2.5], filter: 1800, lfo: 0.08, style: "cold" },
        "Ocean":          { root: 55, wave: "sine", vol: 0.03, harm: [1, 1.33, 2], filter: 600, lfo: 0.12, style: "organic" },
        "Forest":         { root: 73, wave: "triangle", vol: 0.022, harm: [1, 1.5, 2], filter: 1100, lfo: 0.14, style: "organic" },
        "Cherry Blossom": { root: 87, wave: "triangle", vol: 0.02, harm: [1, 1.25, 2], filter: 1600, lfo: 0.18, style: "warm" },
        "Sunset":         { root: 69, wave: "sine", vol: 0.026, harm: [1, 1.5, 2], filter: 800, lfo: 0.1, style: "warm" },
        "Neon City":      { root: 78, wave: "sawtooth", vol: 0.014, harm: [1, 1.5, 2], filter: 1000, lfo: 0.28, style: "digital" },
        "Blood Moon":     { root: 46, wave: "sawtooth", vol: 0.018, harm: [1, 1.5], filter: 500, lfo: 0.07, style: "dark" },
        "Void":           { root: 36, wave: "sawtooth", vol: 0.016, harm: [1, 2], filter: 350, lfo: 0.05, style: "dark" },
        "Lava Field":     { root: 49, wave: "sawtooth", vol: 0.017, harm: [1, 1.25, 1.5], filter: 700, lfo: 0.2, style: "dark" },
        "Crystal Cave":   { root: 110, wave: "triangle", vol: 0.018, harm: [1, 1.5, 2.5, 4], filter: 2500, lfo: 0.22, style: "bright" },
        "Aurora":         { root: 62, wave: "sine", vol: 0.025, harm: [1, 1.6, 2.4], filter: 1500, lfo: 0.16, style: "cold" },
        "Aurora Pulse":   { root: 66, wave: "sine", vol: 0.023, harm: [1, 1.5, 2], filter: 1600, lfo: 0.2, style: "cold" },
        "Starfield":      { root: 52, wave: "sine", vol: 0.022, harm: [1, 2, 3], filter: 1200, lfo: 0.07, style: "cold" },
        "Storm":          { root: 48, wave: "sawtooth", vol: 0.016, harm: [1, 1.5], filter: 550, lfo: 0.3, style: "dark" },
        "Industrial":     { root: 70, wave: "square", vol: 0.012, harm: [1, 1.5, 2], filter: 900, lfo: 0.45, style: "digital" },
        "Plasma":         { root: 44, wave: "sawtooth", vol: 0.015, harm: [1, 1.75, 2.5], filter: 1100, lfo: 0.25, style: "bright" },
        "Custom Image":   { root: 60, wave: "sine", vol: 0.024, harm: [1, 1.5, 2], filter: 1000, lfo: 0.12, style: "warm" },
        "Winter Night":   { root: 55, wave: "sine", vol: 0.024, harm: [1, 1.5, 2.5], filter: 1400, lfo: 0.09, style: "cold" },
        "Spring Garden":  { root: 78, wave: "triangle", vol: 0.022, harm: [1, 1.5, 2], filter: 1500, lfo: 0.16, style: "organic" },
        "Summer Horizon": { root: 70, wave: "sine", vol: 0.025, harm: [1, 1.5, 2], filter: 900, lfo: 0.11, style: "warm" },
        "Autumn Grove":   { root: 58, wave: "triangle", vol: 0.023, harm: [1, 1.5, 2], filter: 800, lfo: 0.1, style: "warm" }
    };
    let p = profiles[lastAmbientBg] || profiles["Magenta"];

    // master filter for character
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(p.filter, now);
    filter.Q.setValueAtTime(1.2, now);
    filter.connect(audioCtx.destination);
    ambientNodes.push(filter);

    // slow filter breathe
    const fLfo = audioCtx.createOscillator();
    const fLfoG = audioCtx.createGain();
    fLfo.type = "sine";
    fLfo.frequency.setValueAtTime(p.lfo * 0.4, now);
    fLfoG.gain.setValueAtTime(p.filter * 0.35, now);
    fLfo.connect(fLfoG);
    fLfoG.connect(filter.frequency);
    fLfo.start(now);
    ambientNodes.push(fLfo, fLfoG);

    p.harm.forEach((h, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const lfo = audioCtx.createOscillator();
        const lfoG = audioCtx.createGain();
        osc.type = i === 0 ? p.wave : (i === 1 ? "sine" : "triangle");
        osc.frequency.setValueAtTime(p.root * h, now);
        osc.detune.setValueAtTime(i * 3 - 2, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(p.vol * masterVolume * (soundEnabled ? 1 : 0) * (i === 0 ? 1 : 0.45 / i), now + 1.5);
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(p.lfo * (1 + i * 0.3), now);
        lfoG.gain.setValueAtTime(2 + i * 1.5, now);
        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);
        osc.connect(gain);
        gain.connect(filter);
        osc.start(now);
        lfo.start(now);
        ambientNodes.push(osc, gain, lfo, lfoG);
    });

    ambientActive = true;
    // kick off melody engine immediately
    musicNextMs = millis();
    musicBassNextMs = millis() + 200;
    musicHatNextMs = millis() + 100;
    musicStep = 0;
    musicBassStep = 0;
}

// Lively continuous music — millis-based so it works even at low frameRate
function getBgMusicPattern(bg) {
    // patterns: melody notes (Hz), bass notes, bpm-ish stepMs, wave, density
    const table = {
        "Magenta": {
            mel: [330, 392, 440, 523, 440, 392, 349, 294],
            bass: [110, 110, 130, 110, 98, 98, 110, 130],
            step: 180, bassStep: 360, wave: "sine", vol: 0.055, bassVol: 0.07, hats: true
        },
        "Deep Space": {
            mel: [165, 196, 220, 247, 220, 196, 185, 147],
            bass: [55, 55, 65, 55, 49, 49, 55, 65],
            step: 280, bassStep: 560, wave: "sine", vol: 0.045, bassVol: 0.06, hats: false
        },
        "Matrix": {
            mel: [220, 247, 277, 330, 277, 247, 220, 196, 220, 330, 277, 247],
            bass: [110, 0, 110, 0, 123, 0, 110, 0],
            step: 120, bassStep: 240, wave: "square", vol: 0.035, bassVol: 0.05, hats: true
        },
        "Neon Grid": {
            mel: [330, 370, 415, 494, 415, 370, 330, 294, 370, 494, 415, 330],
            bass: [82, 0, 82, 0, 98, 0, 82, 0],
            step: 110, bassStep: 220, wave: "square", vol: 0.032, bassVol: 0.045, hats: true
        },
        "Snow": {
            mel: [392, 440, 523, 587, 523, 440, 392, 349],
            bass: [98, 98, 110, 98, 87, 87, 98, 110],
            step: 220, bassStep: 440, wave: "triangle", vol: 0.05, bassVol: 0.055, hats: false
        },
        "Arctic": {
            mel: [349, 392, 466, 523, 466, 392, 349, 311],
            bass: [87, 87, 98, 87, 78, 78, 87, 98],
            step: 240, bassStep: 480, wave: "sine", vol: 0.048, bassVol: 0.055, hats: false
        },
        "Ocean": {
            mel: [196, 220, 247, 294, 247, 220, 185, 165],
            bass: [65, 65, 73, 65, 55, 55, 65, 73],
            step: 260, bassStep: 520, wave: "sine", vol: 0.05, bassVol: 0.065, hats: false
        },
        "Forest": {
            mel: [247, 294, 330, 392, 330, 294, 277, 220],
            bass: [82, 82, 98, 82, 73, 73, 82, 98],
            step: 200, bassStep: 400, wave: "triangle", vol: 0.05, bassVol: 0.06, hats: false
        },
        "Cherry Blossom": {
            mel: [330, 370, 440, 523, 494, 440, 370, 294, 330, 440, 392, 330],
            bass: [110, 110, 123, 110, 98, 98, 110, 123],
            step: 170, bassStep: 340, wave: "triangle", vol: 0.048, bassVol: 0.055, hats: false
        },
        "Sunset": {
            mel: [220, 277, 330, 370, 330, 277, 247, 196],
            bass: [73, 73, 82, 73, 65, 65, 73, 82],
            step: 230, bassStep: 460, wave: "sine", vol: 0.05, bassVol: 0.06, hats: false
        },
        "Neon City": {
            mel: [277, 311, 370, 415, 370, 311, 277, 233, 311, 415, 370, 277],
            bass: [92, 0, 92, 0, 104, 0, 92, 0],
            step: 130, bassStep: 260, wave: "sawtooth", vol: 0.038, bassVol: 0.05, hats: true
        },
        "Blood Moon": {
            mel: [175, 208, 233, 277, 233, 208, 196, 156],
            bass: [58, 58, 65, 58, 52, 52, 58, 65],
            step: 250, bassStep: 500, wave: "sawtooth", vol: 0.042, bassVol: 0.06, hats: false
        },
        "Void": {
            mel: [123, 147, 165, 185, 165, 147, 139, 110],
            bass: [41, 41, 49, 41, 37, 37, 41, 49],
            step: 300, bassStep: 600, wave: "sawtooth", vol: 0.04, bassVol: 0.055, hats: false
        },
        "Lava Field": {
            mel: [156, 185, 208, 247, 208, 185, 175, 139],
            bass: [52, 0, 52, 0, 62, 0, 52, 0],
            step: 150, bassStep: 300, wave: "sawtooth", vol: 0.04, bassVol: 0.055, hats: true
        },
        "Crystal Cave": {
            mel: [523, 587, 659, 784, 698, 659, 587, 440, 523, 659, 587, 494],
            bass: [131, 131, 147, 131, 110, 110, 131, 147],
            step: 160, bassStep: 320, wave: "triangle", vol: 0.045, bassVol: 0.05, hats: false
        },
        "Aurora": {
            mel: [247, 311, 370, 440, 370, 311, 294, 220],
            bass: [82, 82, 98, 82, 73, 73, 82, 98],
            step: 210, bassStep: 420, wave: "sine", vol: 0.05, bassVol: 0.055, hats: false
        },
        "Aurora Pulse": {
            mel: [262, 330, 392, 494, 440, 392, 330, 247],
            bass: [87, 87, 104, 87, 78, 78, 87, 104],
            step: 190, bassStep: 380, wave: "sine", vol: 0.048, bassVol: 0.055, hats: false
        },
        "Starfield": {
            mel: [196, 247, 294, 392, 330, 294, 247, 165],
            bass: [65, 65, 82, 65, 55, 55, 65, 82],
            step: 240, bassStep: 480, wave: "sine", vol: 0.045, bassVol: 0.055, hats: false
        },
        "Storm": {
            mel: [185, 208, 247, 277, 247, 208, 196, 165],
            bass: [62, 0, 62, 0, 73, 0, 62, 0],
            step: 140, bassStep: 280, wave: "sawtooth", vol: 0.04, bassVol: 0.055, hats: true
        },
        "Industrial": {
            mel: [220, 220, 277, 165, 220, 247, 165, 196],
            bass: [110, 0, 110, 0, 82, 0, 110, 0],
            step: 100, bassStep: 200, wave: "square", vol: 0.035, bassVol: 0.055, hats: true
        },
        "Plasma": {
            mel: [185, 233, 277, 349, 311, 277, 233, 208, 277, 349, 311, 185],
            bass: [62, 0, 62, 0, 78, 0, 62, 0],
            step: 125, bassStep: 250, wave: "sawtooth", vol: 0.038, bassVol: 0.05, hats: true
        },
        "Custom Image": {
            mel: [262, 330, 392, 440, 392, 330, 294, 220],
            bass: [87, 87, 110, 87, 73, 73, 87, 110],
            step: 200, bassStep: 400, wave: "sine", vol: 0.05, bassVol: 0.06, hats: false
        },
        "Winter Night": {
            mel: [247, 294, 370, 440, 392, 370, 294, 220],
            bass: [82, 82, 98, 82, 73, 73, 82, 98],
            step: 240, bassStep: 480, wave: "sine", vol: 0.048, bassVol: 0.055, hats: false
        },
        "Spring Garden": {
            mel: [330, 392, 440, 523, 494, 440, 370, 294],
            bass: [110, 110, 130, 110, 98, 98, 110, 130],
            step: 180, bassStep: 360, wave: "triangle", vol: 0.05, bassVol: 0.055, hats: false
        },
        "Summer Horizon": {
            mel: [294, 370, 440, 554, 494, 440, 370, 277],
            bass: [98, 98, 123, 98, 87, 87, 98, 123],
            step: 200, bassStep: 400, wave: "sine", vol: 0.05, bassVol: 0.06, hats: false
        },
        "Autumn Grove": {
            mel: [220, 277, 330, 392, 349, 330, 277, 196],
            bass: [73, 73, 92, 73, 65, 65, 73, 92],
            step: 220, bassStep: 440, wave: "triangle", vol: 0.048, bassVol: 0.055, hats: false
        }
    };
    return table[bg] || table["Magenta"];
}

function playMusicNote(freq, wave, dur, vol) {
    if (!freq || freq < 20) return;
    playTone(freq, wave, dur, vol);
}

function updateMenuMusic() {
    if (!audioCtx || !soundEnabled) return;
    if (audioCtx.state === "suspended") return;

    let bg = trenutnoOzadje || lastAmbientBg || "Magenta";
    let pat = getBgMusicPattern(bg);
    // Level-specific soundtracks
    if (!menu && gameMode === "Pulse Factory") {
        pat = {
            mel: [196, 247, 294, 370, 294, 247, 220, 165, 196, 247, 311, 370, 330, 294, 247, 196],
            bass: [49, 0, 49, 0, 62, 0, 49, 0, 55, 0, 55, 0, 49, 0, 62, 0],
            step: 140, bassStep: 280, wave: "square", vol: 0.042, bassVol: 0.07, hats: true
        };
    } else if (!menu && gameMode === "Wave Skill Tester") {
        pat = {
            mel: [440, 0, 440, 0, 554, 0, 440, 0, 392, 0, 392, 0, 440, 0, 523, 0],
            bass: [110, 0, 110, 0, 138, 0, 110, 0],
            step: 100, bassStep: 200, wave: "triangle", vol: 0.04, bassVol: 0.055, hats: true
        };
    } else if (!menu && gameMode === "Stereo Madness") {
        pat = {
            mel: [262, 294, 330, 349, 392, 349, 330, 294, 262, 220, 247, 262, 294, 330, 294, 262],
            bass: [87, 87, 110, 87, 73, 73, 87, 110],
            step: 160, bassStep: 320, wave: "sawtooth", vol: 0.04, bassVol: 0.06, hats: true
        };
    }
    let now = millis();

    // Melodic line — continuous stream
    if (musicNextMs === 0) musicNextMs = now;
    while (now >= musicNextMs) {
        let note = pat.mel[musicStep % pat.mel.length];
        // slight humanize
        let dur = (pat.step / 1000) * 0.85;
        playMusicNote(note, pat.wave, dur, pat.vol);
        // harmony every other note
        if (musicStep % 2 === 0) {
            playMusicNote(note * 1.5, "sine", dur * 0.9, pat.vol * 0.45);
        }
        musicStep++;
        musicNextMs += pat.step;
        // prevent spiral if tab was backgrounded
        if (musicNextMs < now - 2000) musicNextMs = now + pat.step;
    }

    // Bass line
    if (musicBassNextMs === 0) musicBassNextMs = now;
    while (now >= musicBassNextMs) {
        let b = pat.bass[musicBassStep % pat.bass.length];
        if (b > 0) {
            playMusicNote(b, "sine", (pat.bassStep / 1000) * 0.9, pat.bassVol);
            playMusicNote(b * 0.5, "triangle", (pat.bassStep / 1000) * 0.7, pat.bassVol * 0.5);
        }
        musicBassStep++;
        musicBassNextMs += pat.bassStep;
        if (musicBassNextMs < now - 2000) musicBassNextMs = now + pat.bassStep;
    }

    // Hats / ticks for energetic BGs
    if (pat.hats) {
        if (musicHatNextMs === 0) musicHatNextMs = now;
        while (now >= musicHatNextMs) {
            playTone(6000 + (musicStep % 3) * 800, "square", 0.025, 0.018);
            musicHatNextMs += pat.step / 2;
            if (musicHatNextMs < now - 2000) musicHatNextMs = now + pat.step / 2;
        }
    }
}

// ========== DEATH REPLAY ==========
function recordReplayFrame() {
    if (!k || deathReplay || gameOver) return;
    const replaySkinDef = shopSkins.find(s => s.name === trenutnaKoza) || exclusiveSkins.find(s => s.name === trenutnaKoza) || null;
    const replaySkinRGB = replaySkinDef && replaySkinDef.color ? replaySkinDef.color.slice(0, 3) : [0, 255, 255];
    const replaySkinPattern = replaySkinDef && replaySkinDef.pattern ? replaySkinDef.pattern : "solid";
    deathReplayRecording.push({
        x: k.x, y: k.y, dirX: k.xspeed || 0, dirY: k.yspeed || 0,
        skinColor: replaySkinRGB, skinPattern: replaySkinPattern,
        rep: k.rep.map(p => ({ x: p.x, y: p.y })),
        len: k.dolzina,
        food: hrana.map(f => ({ x: f.x, y: f.y, effect: f.effect || null, barva: f.barva || "yellow", isIllusion: !!f.isIllusion })),
        walls: stene.map(w => ({ x: w.x, y: w.y })),
        mines: mine.map(m => ({ x: m.x, y: m.y })),
        chaser: lovec ? { x: lovec.x, y: lovec.y } : null,
        boss: boss ? { x: boss.x, y: boss.y, hp: boss.hp, maxHp: boss.maxHp, size: boss.size } : null,
        shrink: robZmanjsanja,
        effects: activeEffects.map(e => ({ name: e.name, timer: e.timer })),
        snakeGhost: !!k.ghost,
        snakeReverse: !!k.reverse,
        particles: particles.slice(0, 40).map(p => ({ x:p.x, y:p.y, vx:p.vx, vy:p.vy, life:p.life, maxLife:p.maxLife, size:p.size, r:red(p.col), g:green(p.col), b:blue(p.col) })),
        shake: screenShake,
        mirror: gameMode === "Mirror Snake",
        skin: trenutnaKoza,
        mirrorRep: gameMode === "Mirror Snake" ? k.rep.map(p => ({ x: sirina - velikost - p.x, y: p.y })) : [],
        jumpscare: !!jumpscare,
        jumpscareTimer: jumpscareTimer
    });
    if (deathReplayRecording.length > REPLAY_MAX) deathReplayRecording.shift();
}
function saveCurrentDeathReplay() {
    if (deathReplayRecording.length < 5) return;
    let entry = {
        kind: "snake",
        frames: deathReplayRecording.map(f => ({
            x: f.x, y: f.y, dirX: f.dirX || 0, dirY: f.dirY || 0,
            skinColor: f.skinColor || [0, 255, 255], skinPattern: f.skinPattern || "solid",
            rep: f.rep.map(p => ({ x: p.x, y: p.y })),
            len: f.len,
            food: (f.food || []).map(x => ({ x: x.x, y: x.y, effect: x.effect || null, barva: x.barva || "yellow", isIllusion: !!x.isIllusion })),
            walls: (f.walls || []).map(x => ({ x: x.x, y: x.y })),
            mines: (f.mines || []).map(x => ({ x: x.x, y: x.y })),
            chaser: f.chaser ? { x: f.chaser.x, y: f.chaser.y } : null,
            boss: f.boss ? { x: f.boss.x, y: f.boss.y, hp: f.boss.hp, maxHp: f.boss.maxHp, size: f.boss.size } : null,
            shrink: f.shrink || 0,
            effects: (f.effects || []).map(e => ({ name: e.name, timer: e.timer })),
            snakeGhost: !!f.snakeGhost,
            snakeReverse: !!f.snakeReverse,
            particles: (f.particles || []).map(q => ({ x:q.x, y:q.y, vx:q.vx, vy:q.vy, life:q.life, maxLife:q.maxLife, size:q.size, r:q.r, g:q.g, b:q.b })),
            shake: f.shake || 0,
            mirror: !!f.mirror,
            skin: f.skin || "Cyan",
            mirrorRep: (f.mirrorRep || []).map(p => ({ x:p.x, y:p.y })),
            jumpscare: !!f.jumpscare,
            jumpscareTimer: f.jumpscareTimer || 0
        })),
        score: k ? k.dolzina : 0,
        mode: gameMode,
        time: Date.now()
    };
    savedReplays.unshift(entry);
    if (savedReplays.length > SAVED_REPLAYS_MAX) savedReplays.pop();
    // persist lightweight meta only (frames too big for localStorage reliably)
    try {
        let meta = savedReplays.map(r => ({ kind: r.kind || "snake", score: r.score, mode: r.mode, time: r.time, frames: r.frames }));
        localStorage.setItem("savedDeathReplays", JSON.stringify(meta));
    } catch (e) {
        // storage full – keep in memory only
    }
}
function playSavedReplay(idx, fromMenu) {
    if (idx < 0 || idx >= savedReplays.length) return false;
    let r = savedReplays[idx];
    if (!r || !r.frames || r.frames.length < 5) return false;
    deathReplayFrames = r.frames;
    deathReplayIndex = 0;
    deathReplayForward = true;
    deathReplaySpeed = 1;
    deathReplay = true;
    gameOver = false;
    gdWon = false;
    winScreen = false;
    menu = false;
    replayFromMenu = !!fromMenu;
    replayKind = r.kind || ((r.mode === "Geometry Dash" || r.mode === "GD Ship" || r.mode === "GD Wave" || r.mode === "GD Swing" || r.mode === "GD Robot" || r.mode === "GD UFO" || r.mode === "GD Ball" || r.mode === "GD Spider" || r.mode === "GD Dart" || r.mode === "GD Mini" || r.mode === "GD Builder Test" || r.mode === "GD AI Demon") ? "gd" : "snake");
    gameMode = r.mode || gameMode;
    if (replayKind === "gd") {
        const f0 = deathReplayFrames[0];
        gdVehicle = f0.vehicle || (gameMode === "GD Ship" ? "ship" : gameMode === "GD Wave" ? "wave" : gameMode === "GD Swing" ? "swing" : gameMode === "GD Robot" ? "robot" : gameMode === "GD UFO" ? "ufo" : gameMode === "GD Ball" ? "ball" : "cube");
        gdCube = { x:f0.x, y:f0.y, w:f0.w || 28, h:f0.h || 28, vy:0, onGround:false, rot:f0.rot || 0, shipUp:false };
        gdGroundY = f0.ground || sirina - 80;
        gdCeilY = f0.ceil || 50;
    } else {
        // Snake replay is completely independent from the previous GD run.
        // Clear every GD object/state first, then recreate Snake.
        gdCube = null;
        gdObstacles = [];
        gdReplayRecording = [];
        gdWaveTrail = [];
        gdScroll = 0;
        gdStarted = false;
        gdWon = false;
        gdSwingDir = 1;
        gdSwingLatch = false;
        k = new Kaca();
        let f0 = deathReplayFrames[0];
        k.x = f0.x; k.y = f0.y;
        k.rep = (f0.rep || []).map(p => createVector(p.x, p.y));
        k.dolzina = f0.len || 1;
        k.smrt = false;
    }
    if (soundEnabled) tryStartMusic();
    return true;
}
function startDeathReplay() {
    // legacy reverse play of current recording (unused for auto)
    if (deathReplayRecording.length < 5) return false;
    deathReplayFrames = deathReplayRecording.slice();
    deathReplayIndex = 0;
    deathReplayForward = true;
    deathReplaySpeed = 1;
    deathReplay = true;
    return true;
}
function updateDeathReplay() {
    if (!deathReplay) return;
    if (deathReplayForward) {
        deathReplayIndex += deathReplaySpeed;
        if (deathReplayIndex >= deathReplayFrames.length) {
            deathReplay = false;
            if (replayFromMenu) {
                menu = true;
                vPodmenijuReplays = true;
            } else {
                gameOver = true;
            }
            return;
        }
    } else {
        deathReplayIndex -= deathReplaySpeed;
        if (deathReplayIndex < 0) {
            deathReplay = false;
            gameOver = true;
            return;
        }
    }
    let f = deathReplayFrames[Math.floor(deathReplayIndex)];
    if (!f) return;
    if (replayKind === "gd") {
        gdVehicle = f.vehicle || gdVehicle;
        gdCube = { x:f.x, y:f.y, w:f.w || 28, h:f.h || 28, vy:0, onGround:false, rot:f.rot || 0, shipUp:false };
        gdGroundY = f.ground || gdGroundY;
        gdCeilY = f.ceil || gdCeilY;
    } else if (k) {
        k.x = f.x; k.y = f.y;
        k.rep = (f.rep || []).map(p => createVector(p.x, p.y));
        k.dolzina = f.len || 1;
        k.ghost = !!f.snakeGhost;
        k.reverse = !!f.snakeReverse;
        activeEffects = (f.effects || []).map(e => ({ name: e.name, timer: e.timer }));
        screenShake = f.shake || 0;
        jumpscare = !!f.jumpscare;
        jumpscareTimer = f.jumpscareTimer || 0;
    }
}
function drawReplayWorld(f) {
    if (!f) return;
    push();
    noStroke();

    if (f.shrink) {
        fill(100, 20, 80);
        rect(0, 0, sirina, f.shrink);
        rect(0, sirina - f.shrink, sirina, f.shrink);
        rect(0, 0, f.shrink, sirina);
        rect(sirina - f.shrink, 0, f.shrink, sirina);
    }

    stroke(0); strokeWeight(1);
    for (let w of (f.walls || [])) { fill(90); rect(w.x, w.y, velikost, velikost); }
    for (let m of (f.mines || [])) { fill("red"); ellipse(m.x + velikost / 2, m.y + velikost / 2, velikost * 0.8); }

    if (f.chaser) {
        fill(frameCount % 6 < 3 ? "red" : "black");
        rect(f.chaser.x, f.chaser.y, velikost, velikost);
    }

    if (f.boss) {
        fill(180, 20, 20); stroke(255, 50, 50); strokeWeight(3);
        rect(f.boss.x, f.boss.y, f.boss.size || velikost * 2.5, f.boss.size || velikost * 2.5, 8);
    }

    noStroke();
    for (let food of (f.food || [])) {
        if (food.isIllusion) fill(frameCount % 4 < 2 ? food.barva : color(150));
        else if (food.effect === "rainbow") {
            colorMode(HSB, 360, 100, 100); fill(frameCount % 360, 80, 100); colorMode(RGB, 255, 255, 255);
        } else fill(food.barva || "yellow");
        rect(food.x, food.y, velikost, velikost);
    }
    // Recreate the particle/effect layer captured in the replay frame.
    for (let q of (f.particles || [])) {
        let a = map(q.life, 0, q.maxLife || 32, 0, 220);
        fill(q.r || 255, q.g || 255, q.b || 255, a);
        ellipse(q.x, q.y, q.size || 3);
    }
    if ((f.effects || []).length > 0) {
        textAlign(RIGHT, TOP); textSize(11);
        let ey = 18;
        for (let eff of f.effects) {
            fill("yellow"); text(eff.name + " (" + eff.timer + ")", sirina - 18, ey); ey += 15;
        }
    }
    // Draw the captured Snake with connected segments and the actual saved skin palette.
    const replaySkin = f.skin || "Cyan";
    const replayRGB = Array.isArray(f.skinColor) ? f.skinColor : (replaySkin === "Gold" ? [255,220,50] : replaySkin === "Ember" ? [255,70,15] : replaySkin === "Crystal" ? [140,220,255] : replaySkin === "Void Walker" ? [80,30,150] : [0,220,220]);
    const replayPattern = f.skinPattern || "solid";
    // Head is stored separately (f.x/f.y); rep is tail→near-head. Include head so
    // the replay snake matches the live length and silhouette.
    const body = (Array.isArray(f.rep) ? f.rep.slice() : []).concat([{ x: f.x, y: f.y }]);
    noStroke();
    for (let i = 0; i < body.length; i++) {
        const p = body[i];
        const t = body.length <= 1 ? 0 : i / (body.length - 1);
        let rr = replayRGB[0], gg = replayRGB[1], bb = replayRGB[2];
        if (f.snakeGhost) fill(180, 255, 255, 65 + 85 * t);
        else if (f.snakeReverse) fill(255, 130 + 80 * t, 80);
        else if (replayPattern === "zebra") fill(i % 2 ? 245 : 25);
        else if (replayPattern === "tiger") fill(i % 2 ? color(255,140,0) : color(25));
        else if (replaySkin === "Gold") fill(255, 215 + 30 * t, 35);
        else fill(rr * (0.72 + 0.28 * t), gg * (0.72 + 0.28 * t), bb * (0.72 + 0.28 * t));
        // Slight overlap and round corners make the replay read as one continuous snake.
        rect(p.x - 0.5, p.y - 0.5, velikost + 1, velikost + 1, 4);
        if (!f.snakeGhost && replayPattern === "stereoGlow") {
            noFill(); stroke(220, 200, 255, 170); strokeWeight(1.5);
            rect(p.x + 2, p.y + 2, velikost - 4, velikost - 4, 3); noStroke();
        }
    }
    const hp = body[body.length - 1];
    if (hp) {
        const dx = f.dirX || 0, dy = f.dirY || 0;
        fill(255, 255, 235, f.snakeGhost ? 140 : 255);
        const eyeS = Math.max(2, velikost * 0.18);
        const eyeOffset = velikost * 0.28;
        const ex = dx > 0 ? eyeOffset : dx < 0 ? -eyeOffset : eyeOffset * 0.65;
        const ey = dy > 0 ? eyeOffset : dy < 0 ? -eyeOffset : -eyeOffset * 0.65;
        ellipse(hp.x + velikost/2 + ex, hp.y + velikost/2 + ey, eyeS, eyeS);
        ellipse(hp.x + velikost/2 - (dy ? eyeOffset*0.65 : ex*0.65), hp.y + velikost/2 - (dx ? eyeOffset*0.65 : ey*0.65), eyeS, eyeS);
    }

    // Mirror Snake replay: the saved replay used to contain only the real snake,
    // so the replay looked different from the live mode. Recreate the mirrored
    // snake from the exact captured body positions.
    if (f.mirror) {
        noStroke();
        const mirrorBody = Array.isArray(f.mirrorRep) && f.mirrorRep.length ? f.mirrorRep : (f.rep || []).map(p => ({ x: sirina - velikost - p.x, y: p.y }));
        for (let i = mirrorBody.length - 1; i >= 0; i--) {
            const p = mirrorBody[i];
            fill(replaySkin === "Gold" ? color(255, 220, 50, 180) : replaySkin === "Ember" ? color(255, 100, 40, 180) : color(180, 100, 255, 180));
            rect(p.x, p.y, velikost, velikost, 3);
        }
        const mx = sirina - velikost - f.x;
        fill(replaySkin === "Gold" ? color(255, 235, 100) : replaySkin === "Ember" ? color(255, 150, 70) : color(220, 150, 255));
        rect(mx, f.y, velikost, velikost, 3);
    }
    pop();
}

function drawGDReplayWorld(f) {
    if (!f) return;
    izrisiOzadje();
    noStroke();
    if (f.vehicle === "ship") fill(20, 50, 100, 38);
    else if (f.vehicle === "wave") fill(90, 10, 120, 34);
    else if (f.vehicle === "ball") fill(100, 50, 20, 34);
    else fill(30, 20, 100, 28);
    rect(0, 0, sirina, sirina);
    if (f.vehicle === "ship" || f.vehicle === "wave" || f.vehicle === "swing") {
        fill(40, 40, 60); rect(0, 0, sirina, f.ceil || 50);
        fill(100, 80, 180); rect(0, (f.ceil || 50) - 3, sirina, 3);
    }
    fill(25, 25, 40); rect(0, f.ground || sirina - 80, sirina, sirina - (f.ground || sirina - 80));
    fill(120, 90, 220); rect(0, f.ground || sirina - 80, sirina, 4);
    for (let o of (f.obstacles || [])) {
        const sx=o.x;
        if (o.type === "spike") { fill(230,50,70); triangle(sx,o.y+o.h,sx+o.w/2,o.y,sx+o.w,o.y+o.h); }
        else if (o.type === "spikeDown") { fill(230,50,70); triangle(sx,o.y,sx+o.w/2,o.y+o.h,sx+o.w,o.y); }
        else if (o.type === "block" || o.type === "wall") { fill(50,200,230); rect(sx,o.y,o.w,o.h,3); }
        else if (o.type === "plat") { fill(180,120,255); rect(sx,o.y,o.w,o.h,3); }
        else if (o.type === "hazard") { fill(255,80,40); rect(sx,o.y,o.w,o.h,2); }
        else if (o.type === "padYellow") {
            fill(255,220,40); rect(sx,o.y,o.w,o.h,4);
            if ((o.facing == null ? 1 : o.facing) > 0) triangle(sx+8,o.y+o.h-3,sx+o.w/2,o.y+3,sx+o.w-8,o.y+o.h-3);
            else triangle(sx+8,o.y+3,sx+o.w/2,o.y+o.h-3,sx+o.w-8,o.y+3);
        }
        else if (o.type === "padBlue") {
            fill(50,150,255); rect(sx,o.y,o.w,o.h,4);
            if ((o.facing == null ? 1 : o.facing) > 0) triangle(sx+8,o.y+o.h-3,sx+o.w/2,o.y+3,sx+o.w-8,o.y+o.h-3);
            else triangle(sx+8,o.y+3,sx+o.w/2,o.y+o.h-3,sx+o.w-8,o.y+3);
        }
        else if (o.type === "orbYellow") { noFill(); stroke(255,220,40); strokeWeight(4); ellipse(sx+o.w/2,o.y+o.h/2,o.w,o.h); noStroke(); }
        else if (o.type === "orbBlue") { noFill(); stroke(40,220,90); strokeWeight(4); ellipse(sx+o.w/2,o.y+o.h/2,o.w,o.h); noStroke(); }
        else if (o.type === "orbBlueTrue") { noFill(); stroke(60,170,255); strokeWeight(4); ellipse(sx+o.w/2,o.y+o.h/2,o.w,o.h); noStroke(); }
        else if (o.type === "orbBlack") { noFill(); stroke(80); strokeWeight(4); ellipse(sx+o.w/2,o.y+o.h/2,o.w,o.h); noStroke(); }
        else if (o.type === "orbDash") {
            const cx = sx + o.w / 2, cy = o.y + o.h / 2;
            fill(30, 220, 80, 180);
            noStroke();
            ellipse(cx, cy, o.w, o.h);
            noFill(); stroke(40, 255, 120); strokeWeight(3); ellipse(cx, cy, o.w + 2, o.h + 2);
            strokeWeight(2.5); stroke(255, 255, 255);
            line(cx - 7, cy, cx + 8, cy);
            line(cx + 3, cy - 5, cx + 9, cy);
            line(cx + 3, cy + 5, cx + 9, cy);
            noStroke();
            if (gdDashing) {
                noFill(); stroke(80, 255, 140, 150); strokeWeight(2);
                ellipse(cx, cy, o.w + 12 + (frameCount % 8), o.h + 12 + (frameCount % 8));
                noStroke();
            }
        }
        else if (o.type === "swingGate") { fill(255,190,50,210); rect(sx,f.ceil||50,o.w,max(0,o.top-(f.ceil||50))); rect(sx,o.bottom,o.w,max(0,(f.ground||sirina-80)-o.bottom)); }
        else if (o.type === "waveSlope") {
            fill(255,55,170,210); beginShape(); vertex(sx,f.ceil||50); vertex(sx+o.w,f.ceil||50); vertex(sx+o.w,o.top2); vertex(sx,o.top1); endShape(CLOSE);
            fill(120,45,230,210); beginShape(); vertex(sx,o.bottom1); vertex(sx+o.w,o.bottom2); vertex(sx+o.w,f.ground||sirina-80); vertex(sx,f.ground||sirina-80); endShape(CLOSE);
        }
    }
    if (f.vehicle === "wave" && (f.trail || []).length > 1) {
        noFill();
        for (let width = 10; width >= 2; width -= 2) {
            stroke(255, 70, 220, 18 + (10 - width) * 5);
            strokeWeight(width);
            beginShape();
            for (let pt of f.trail) vertex(pt.x, pt.y);
            endShape();
        }
        stroke(255, 235, 255, 235); strokeWeight(2);
        beginShape(); for (let pt of f.trail) vertex(pt.x, pt.y); endShape();
        noStroke();
    }
    push(); translate(f.x+f.w/2,f.y+f.h/2); rotate(f.rot||0);
    if (f.vehicle === "cube" || f.vehicle === "mini") {
        const mini = f.vehicle === "mini";
        fill(mini ? color(0,255,200) : color(0,255,180)); stroke(mini ? color(0,180,140) : color(0,170,110)); strokeWeight(mini ? 1.2 : 2);
        rect(-f.w/2,-f.h/2,f.w,f.h,mini ? 2 : 4); noStroke(); fill(255);
        const eye = Math.max(2, f.w * (mini ? 0.13 : 0.18));
        rect(-f.w*0.22,-f.h*0.18,eye,eye); rect(f.w*0.08,-f.h*0.18,eye,eye);
    } else if (f.vehicle === "ship") {
        fill(100,180,255); stroke(40,100,200); strokeWeight(2);
        beginShape(); vertex(f.w/2,0); vertex(-f.w/2,-f.h/2); vertex(-f.w/2,f.h/2); endShape(CLOSE); noStroke();
        fill(220,250,255); triangle(-f.w/2,0,-f.w*0.78,-f.h*0.2,-f.w*0.78,f.h*0.2);
    } else if (f.vehicle === "swing") {
        fill(255,205,70); stroke(210,130,20); strokeWeight(2);
        beginShape(); vertex(f.w/2,0); vertex(0,-f.h/2); vertex(-f.w/2,0); vertex(0,f.h/2); endShape(CLOSE); noStroke();
    } else if (f.vehicle === "ball") {
        fill(255,170,70); stroke(210,90,20); strokeWeight(2); ellipse(0,0,f.w,f.h);
        stroke(255,235,150); line(-f.w*0.22,-f.h*0.22,f.w*0.22,f.h*0.22); line(f.w*0.22,-f.h*0.22,-f.w*0.22,f.h*0.22); noStroke();
    } else if (f.vehicle === "robot") {
        fill(80,240,150); stroke(20,150,90); strokeWeight(2); rect(-f.w/2,-f.h/2,f.w,f.h,5); noStroke(); fill(30);
        rect(-f.w*0.24,-f.h*0.2,f.w*0.18,f.h*0.18); rect(f.w*0.06,-f.h*0.2,f.w*0.18,f.h*0.18); rect(-f.w*0.18,f.h*0.12,f.w*0.36,f.h*0.1,2);
    } else if (f.vehicle === "ufo") {
        fill(180,255,120); stroke(60,160,40); strokeWeight(2); ellipse(0,2,f.w*1.2,f.h*0.55); noStroke();
        fill(140,230,255); ellipse(0,-f.h*0.12,f.w*0.55,f.h*0.48);
    } else if (f.vehicle === "spider") {
        stroke(140,60,220); strokeWeight(Math.max(1.5,f.w*0.07));
        for (let side of [-1,1]) { line(-f.w*0.12,0,side*f.w*0.43,f.h*0.34); line(f.w*0.12,0,side*f.w*0.43,-f.h*0.34); line(-f.w*0.08,f.h*0.08,side*f.w*0.5,f.h*0.02); line(f.w*0.08,-f.h*0.08,side*f.w*0.5,-f.h*0.02); }
        fill(180,90,255); stroke(110,40,200); ellipse(0,0,f.w*0.72,f.h*0.62); noStroke(); fill(255); ellipse(-f.w*0.13,-f.h*0.04,Math.max(2,f.w*0.12)); ellipse(f.w*0.13,-f.h*0.04,Math.max(2,f.w*0.12));
    } else if (f.vehicle === "dart") {
        fill(255,80,120); stroke(200,30,70); strokeWeight(2); beginShape(); vertex(f.w/2,0); vertex(-f.w/2,-f.h/2); vertex(-f.w/3,0); vertex(-f.w/2,f.h/2); endShape(CLOSE); noStroke();
        fill(255,200,210); triangle(f.w/2,0,f.w/4,-f.h*0.12,f.w/4,f.h*0.12);
    } else if (f.vehicle === "wave") {
        fill(255,100,220); stroke(200,40,160); strokeWeight(2); beginShape(); vertex(f.w/2,0); vertex(-f.w/2,-f.h/2); vertex(-f.w/4,0); vertex(-f.w/2,f.h/2); endShape(CLOSE); noStroke();
    } else {
        fill(255,100,220); beginShape(); vertex(f.w/2,0); vertex(-f.w/2,-f.h/2); vertex(-f.w/4,0); vertex(-f.w/2,f.h/2); endShape(CLOSE);
    }
    pop();
    fill(255); textAlign(LEFT,TOP); textSize(15); text("Score: "+(f.score||0),20,14); text("⏮ REPLAY",20,36);
}

function formatReplayTime(ts) {
    let d = new Date(ts);
    return (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
}
function drawReplayBrowser() {
    textSize(22); fill("orange"); textAlign(CENTER, CENTER); text("⏮ DEATH REPLAYS", sirina / 2, 82);
    fill(180); textSize(12); text("Zadnjih " + savedReplays.length + " / " + SAVED_REPLAYS_MAX + " smrti", sirina / 2, 106);
    if (savedReplays.length === 0) {
        fill(150); textSize(16); text("Še ni shranjenih replayjev.", sirina / 2, 250);
        text("Umri v igri – samodejno se shrani.", sirina / 2, 280);
    } else {
        textAlign(LEFT, CENTER);
        for (let i = 0; i < savedReplays.length; i++) {
            let r = savedReplays[i];
            let y = 135 + i * 36;
            if (i === selectedReplayIdx) { fill("yellow"); text("▶", 30, y); }
            fill(i === selectedReplayIdx ? "white" : 200);
            textSize(14);
            let duration = r.frames ? (r.frames.length / 13).toFixed(1) : "0.0";
            text("#" + (i + 1) + "  " + r.mode + "  •  score " + r.score + "  •  " + duration + "s  •  " + formatReplayTime(r.time), 55, y);
        }
        textAlign(CENTER); fill("lime"); textSize(13);
        text("ENTER = predvajaj  •  UP/DOWN  •  ESC = nazaj", sirina / 2, sirina - 30);
    }
}

// ========== GHOST RACE ==========
function recordGhostFrame() {
    if (!k || !ghostRaceEnabled) return;
    recordingPath.push({ x: k.x, y: k.y, len: k.dolzina });
}
function saveGhostIfBetter() {
    if (!ghostRaceEnabled || recordingPath.length < 10) return;
    if (k.dolzina >= bestGhostScore) {
        bestGhostScore = k.dolzina;
        ghostPath = recordingPath.slice();
        localStorage.setItem("ghostPath", JSON.stringify(ghostPath));
        localStorage.setItem("bestGhostScore", bestGhostScore);
    }
}
function drawGhost() {
    if (!ghostRaceEnabled || ghostPath.length === 0) return;
    let idx = min(ghostFrame, ghostPath.length - 1);
    let g = ghostPath[idx];
    noStroke();
    fill(200, 200, 255, 90);
    rect(g.x, g.y, velikost, velikost);
    // faint trail
    for (let i = 1; i < min(8, idx); i++) {
        let t = ghostPath[idx - i];
        fill(180, 180, 255, 50 - i * 5);
        rect(t.x, t.y, velikost, velikost);
    }
    fill(180, 180, 255, 160);
    textAlign(CENTER, BOTTOM); textSize(10);
    text("GHOST " + bestGhostScore, g.x + velikost / 2, g.y - 2);
}

function initParticlePool() {
    particlePool = [];
    particleActive = [];
    for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
        particlePool.push({
            x: 0, y: 0, vx: 0, vy: 0,
            life: 0, maxLife: 32, size: 3, col: null, active: false
        });
    }
}
function spawnParticles(x, y, count, col) {
    if (!particlePool.length) initParticlePool();
    let spawned = 0;
    // reuse inactive
    for (let i = 0; i < particlePool.length && spawned < count; i++) {
        let p = particlePool[i];
        if (p.active) continue;
        p.x = x; p.y = y;
        p.vx = random(-3.5, 3.5); p.vy = random(-3.5, 3.5);
        p.life = random(18, 32); p.maxLife = 32;
        p.size = random(2, 5); p.col = col; p.active = true;
        particleActive.push(p);
        spawned++;
    }
}
function updateParticles() {
    for (let i = particleActive.length - 1; i >= 0; i--) {
        let p = particleActive[i];
        p.x += p.vx; p.y += p.vy; p.vx *= 0.94; p.vy *= 0.94; p.life--;
        if (p.life <= 0) {
            p.active = false;
            particleActive.splice(i, 1);
        }
    }
}
function drawParticles() {
    noStroke();
    for (let p of particleActive) {
        let a = map(p.life, 0, p.maxLife, 0, 220);
        fill(red(p.col), green(p.col), blue(p.col), a);
        ellipse(p.x, p.y, p.size);
    }
}


let gdAIDemonLength = 2400;
let gdAIDemonSeed = 0;
// Each GD AI Demon attempt rolls exactly 5 of these 10 modifiers.
const GD_AI_MUTATOR_POOL = [
    "Speed Surge", "Spike Rush", "Gravity Flip", "Darkness", "Moving Hazards",
    "Low Ceiling", "Mini Mode", "Portal Shuffle", "Mirror Hazards", "Double Trouble"
];
let gdAIMutators = [];
function gdAIMutatorActive(name) {
    return gameMode === "GD AI Demon" && gdAIMutators.includes(name);
}
function rollGDAIMutators() {
    const pool = GD_AI_MUTATOR_POOL.slice();
    gdAIMutators = [];
    while (gdAIMutators.length < 5 && pool.length) {
        const i = floor(random(pool.length));
        gdAIMutators.push(pool.splice(i, 1)[0]);
    }
}
let gdPortalStage = 0;
let gdPortalTargetX = 0;
let gdPortalTotalScroll = 0;
let gdPortalVehicles = ["cube","ship","wave","ufo","robot","ball","swing"];
let waveSkillStage = 0; // 0=10fps, 1=30, 2=60, 3=120
const WAVE_SKILL_FPS = [10, 30, 60, 120];
const WAVE_SKILL_GATE_X = [700, 1400, 2100, 2800];
let waveSkillClicked = [false, false, false, false];
let waveSkillGateFrame = [0, 0, 0, 0];
let waveSkillArmed = false; // becomes true on first hold — until then wave rests on floor


// Modes that keep total distance across portals (score must NOT reset)
function isPortalScoreMode() {
    return gameMode === "GD Portal Level" || gameMode === "Stereo Madness" || gameMode === "Wave Skill Tester" || gameMode === "Pulse Factory" || gameMode === "Grok Showcase" || gameMode === "GD Builder Test" || gameMode === "GD AI Demon";
}
function gdTotalScore() {
    // Stereo Madness is one continuous scroll – never split across stages
    if (gameMode === "Stereo Madness") return floor(gdScroll / 20);
    if (gameMode === "GD Portal Level") return floor((gdPortalTotalScroll + gdScroll) / 20);
    return floor(gdScroll / 20);
}

function buildGDPortalStage(){
    gdVehicle = gdPortalVehicles[gdPortalStage];
    gdScroll = 0;
    gdStarted = true; // seamless – no "press to start" freeze on portal
    gdWon = false;
    gdObstacles = [];
    const PORTAL_STAGE_LENGTH = 2500;
    gdPortalTargetX = PORTAL_STAGE_LENGTH - 120;
    buildGDLevel(gdVehicle);

    // Fill the whole portal stage with actual gameplay before placing the portal.
    // This prevents short/empty sections when a vehicle's normal level is shorter.
    ensureEndlessCube();
    ensureEndlessBall();
    ensureEndlessWave();
    ensureEndlessShip();
    ensureEndlessSwing();
    ensureEndlessRobot();
    ensureEndlessUFO();
    ensureEndlessSpider();
    ensureEndlessMini();
    ensureEndlessDart();

    const portalX = PORTAL_STAGE_LENGTH;
    gdObstacles = gdObstacles.filter(o => o.type !== "goal" && (o.x || 0) < portalX - 70);
    gdObstacles.push({type:"portal", x:portalX, y:gdCeilY + 18, w:42, h:gdGroundY-gdCeilY-36, target:gdPortalVehicles[(gdPortalStage+1)%gdPortalVehicles.length]});
    const size = gdVehicleSize();
    const pMid = (gdCeilY + gdGroundY) / 2 - size / 2;
    const pY = (gdVehicle === "swing" || gdVehicle === "ship" || gdVehicle === "ufo" || gdVehicle === "dart") ? pMid : gdGroundY - size;
    gdCube = {x:110, y:pY, w:size,h:size,vy:0,onGround:!(gdVehicle === "swing" || gdVehicle === "ship" || gdVehicle === "ufo" || gdVehicle === "dart"),rot:0,shipUp:false};
    gdSwingDir=1; gdSwingLatch=false; gdBallGravity=1; gdBallInputQueued=false; gdRobotJumpTime=0; gdRobotJumping=false; gdRobotJumpLatch=false;
    // Clear hazards that spawn on top of the player at stage start (portal level always starts at x≈110)
    const spawnPad = 160;
    gdObstacles = gdObstacles.filter(o => {
        if (!o) return false;
        if ((o.type === "spike" || o.type === "spikeDown" || o.type === "hazard") && o.x < spawnPad) return false;
        if ((o.type === "block" || o.type === "wall") && o.x < 130 && abs((o.y + o.h / 2) - (gdCube.y + gdCube.h / 2)) < 40) return false;
        return true;
    });
    if (typeof practiceSafeUnstick === "function") practiceSafeUnstick(gdCube);
}

function gdPortalAdvance(){
    if (!isPortalScoreMode() || gdWon || gameOver) return;
    // Continuous showcase levels never rebuild via portal stages
    if (gameMode === "Stereo Madness" || gameMode === "Pulse Factory" || gameMode === "Grok Showcase"
        || gameMode === "Wave Skill Tester" || gameMode === "GD Builder Test" || gameMode === "GD AI Demon") {
        return;
    }
    // Keep total distance — score must never reset on portal
    gdPortalTotalScroll += gdScroll;
    gdScroll = 0;
    gdPortalStage++;
    if (gameMode === "Stereo Madness") {
        return;
    }
    if (gdPortalStage >= gdPortalVehicles.length){
        if (!gdAIPilot) unlockAchievement("gdPortalRunner", "gdCrownAccessory");
        gdFinish();
        return;
    }
    playCoinSound();
    buildGDPortalStage();
}


// ===== STEREO MADNESS (Easy – continuous level like real GD) =====
// Real SM flow: Cube → Ship → Cube → Ship in ONE continuous map.
// Portals only change vehicle; scroll never resets; no "press to start" pause.
// Stairs have GAPS between steps (you must jump each step).
const SM_STAGES = [
    { vehicle: "cube", length: 0 }, // placeholder for HUD stage count
    { vehicle: "ship", length: 0 },
    { vehicle: "cube", length: 0 },
    { vehicle: "ship", length: 0 }
];

// Portal x positions (world) – set while building
let SM_PORTAL_X = [];

function buildStereoMadnessStage() {
    // Full continuous Stereo Madness – called once at init (and on retry).
    gdVehicle = "cube";
    gdScroll = 0;
    gdStarted = true; // do NOT wait for input after portal
    gdWon = false;
    gdObstacles = [];
    gdPortalStage = 0;
    SM_PORTAL_X = [];

    const g = gdGroundY;
    const top = gdCeilY;
    const mid = (g + top) * 0.5;
    let x = 500;

    // ========== CUBE 1 (0–30%) – long easy tutorial ==========
    // singles
    for (let i = 0; i < 3; i++) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 210;
    }
    // double
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 22, y: g - 20, w: 20, h: 20 });
    x += 240;
    // low block
    gdObstacles.push({ type: "block", x: x, y: g - 28, w: 50, h: 28 });
    x += 190;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    x += 210;
    // === stairs like real SM (see screenshot) ===
    // Clear floor BEFORE the staircase (no obstacles)
    x += 80;
    // two ground spikes, then first short pillar
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 24, y: g - 20, w: 20, h: 20 });
    x += 70;
    gdObstacles.push({ type: "block", x: x, y: g - 40, w: 40, h: 40 }); // 1-high
    x += 40;
    // gap ≈ one jump, decorative ground spikes in the MIDDLE only (clear near next block)
    x += 40;
    for (let s = 0; s < 4; s++) gdObstacles.push({ type: "spike", x: x + s * 20, y: g - 18, w: 18, h: 18 });
    x += 40 + 80; // clear approach + remaining gap → total ~ jump length
    gdObstacles.push({ type: "block", x: x, y: g - 80, w: 40, h: 80 }); // 2-high
    x += 40;
    x += 40;
    for (let s = 0; s < 4; s++) gdObstacles.push({ type: "spike", x: x + s * 20, y: g - 18, w: 18, h: 18 });
    x += 40 + 80;
    gdObstacles.push({ type: "block", x: x, y: g - 120, w: 40, h: 120 }); // 3-high
    x += 40;
    x += 160; // clear after stairs

    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    x += 210;
    // triple
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 22, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 44, y: g - 20, w: 20, h: 20 });
    x += 260;
    // 1-2-3 pillars (SM style): clear before, gap with mid spikes only
    x += 60; // clear before stairs
    gdObstacles.push({ type: "block", x: x, y: g - 40, w: 40, h: 40 });
    x += 40 + 40;
    for (let s = 0; s < 4; s++) gdObstacles.push({ type: "spike", x: x + s * 20, y: g - 18, w: 18, h: 18 });
    x += 40 + 80;
    gdObstacles.push({ type: "block", x: x, y: g - 80, w: 40, h: 80 });
    x += 40 + 40;
    for (let s = 0; s < 4; s++) gdObstacles.push({ type: "spike", x: x + s * 20, y: g - 18, w: 18, h: 18 });
    x += 40 + 80;
    gdObstacles.push({ type: "block", x: x, y: g - 120, w: 40, h: 120 });
    x += 40 + 160;

    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    x += 200;
    for (let i = 0; i < 5; i++) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 200;
    }
    // more blocks + spikes to lengthen
    gdObstacles.push({ type: "block", x: x, y: g - 28, w: 48, h: 28 });
    x += 170;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    x += 190;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 22, y: g - 20, w: 20, h: 20 });
    x += 230;
    for (let i = 0; i < 4; i++) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 195;
    }
    // pre-portal flat
    x += 80;

    // --- SHIP PORTAL 1 ---
    SM_PORTAL_X.push(x);
    gdObstacles.push({ type: "portal", x: x, y: top + 18, w: 42, h: g - top - 36, target: "ship" });
    x += 100;

    // ========== SHIP 1 (30–48%) – spacious ==========
    x += 120; // runway after portal so you SEE the next hazards
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 22, h: 20 });
    x += 230;
    gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 22, h: 20 });
    x += 250;
    for (let i = 0; i < 6; i++) {
        if (i % 2 === 0) {
            gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 22, h: 20 });
            gdObstacles.push({ type: "spike", x: x + 55, y: g - 20, w: 22, h: 20 });
        } else {
            gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 22, h: 20 });
            gdObstacles.push({ type: "spikeDown", x: x + 55, y: top, w: 22, h: 20 });
        }
        x += 270;
    }
    for (let i = 0; i < 5; i++) {
        if (i % 2 === 0)
            gdObstacles.push({ type: "block", x: x, y: g - 75, w: 55, h: 75 });
        else
            gdObstacles.push({ type: "block", x: x, y: top, w: 55, h: 75 });
        x += 210;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 190;
    }
    for (let i = 0; i < 4; i++) {
        gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 22, h: 20 });
        x += 150;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 22, h: 20 });
        x += 210;
    }
    x += 60;

    // --- CUBE PORTAL 2 ---
    SM_PORTAL_X.push(x);
    gdObstacles.push({ type: "portal", x: x, y: top + 18, w: 42, h: g - top - 36, target: "cube" });
    x += 100;

    // ========== CUBE 2 (48–85%) – SM-style stairs (screenshot) ==========
    x += 120;
    // easy singles with generous gaps
    for (let i = 0; i < 3; i++) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 200;
    }
    // double
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 22, y: g - 20, w: 20, h: 20 });
    x += 240;

    // --- staircase 1-2-3 like screenshot ---
    // clear floor BEFORE first pillar
    x += 100;
    // two ground spikes then 1-high pillar
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 24, y: g - 20, w: 20, h: 20 });
    x += 70;
    gdObstacles.push({ type: "block", x: x, y: g - 40, w: 44, h: 40 }); // 1
    x += 44;
    // gap = one jump (~180); spikes only in MIDDLE of pit
    x += 50;
    for (let s = 0; s < 3; s++) gdObstacles.push({ type: "spike", x: x + s * 20, y: g - 18, w: 18, h: 18 });
    x += 60 + 70; // mid spikes + clear approach to next
    gdObstacles.push({ type: "block", x: x, y: g - 80, w: 44, h: 80 }); // 2
    x += 44;
    x += 50;
    for (let s = 0; s < 3; s++) gdObstacles.push({ type: "spike", x: x + s * 20, y: g - 18, w: 18, h: 18 });
    x += 60 + 70;
    gdObstacles.push({ type: "block", x: x, y: g - 100, w: 44, h: 100 }); // 3 (within jump reach from 2)
    x += 44;
    x += 180; // clear after stairs

    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    x += 200;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 22, y: g - 20, w: 20, h: 20 });
    x += 230;

    // second staircase (shorter 1-2-3)
    x += 90;
    gdObstacles.push({ type: "block", x: x, y: g - 40, w: 44, h: 40 });
    x += 44 + 50;
    for (let s = 0; s < 3; s++) gdObstacles.push({ type: "spike", x: x + s * 20, y: g - 18, w: 18, h: 18 });
    x += 60 + 70;
    gdObstacles.push({ type: "block", x: x, y: g - 80, w: 44, h: 80 });
    x += 44 + 50;
    for (let s = 0; s < 3; s++) gdObstacles.push({ type: "spike", x: x + s * 20, y: g - 18, w: 18, h: 18 });
    x += 60 + 70;
    gdObstacles.push({ type: "block", x: x, y: g - 100, w: 44, h: 100 });
    x += 44 + 180;

    // platforms with clear jumps
    gdObstacles.push({ type: "plat", x: x, y: g - 70, w: 80, h: 14 });
    x += 180;
    gdObstacles.push({ type: "plat", x: x, y: g - 100, w: 80, h: 14 });
    x += 190;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    x += 210;
    // triple (one jump clears)
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 22, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 44, y: g - 20, w: 20, h: 20 });
    x += 260;
    for (let i = 0; i < 4; i++) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 200;
    }
    x += 80;

    // --- SHIP PORTAL 3 ---
    SM_PORTAL_X.push(x);
    gdObstacles.push({ type: "portal", x: x, y: top + 18, w: 42, h: g - top - 36, target: "ship" });
    x += 100;

    // ========== SHIP 2 (85–100%) – finale ==========
    x += 120;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 22, h: 20 });
    x += 190;
    gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 22, h: 20 });
    x += 210;
    for (let i = 0; i < 8; i++) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: x + 45, y: top, w: 22, h: 20 });
        x += 200;
        if (i % 2 === 0)
            gdObstacles.push({ type: "block", x: x, y: g - 55, w: 50, h: 55 });
        else
            gdObstacles.push({ type: "block", x: x, y: top, w: 50, h: 55 });
        x += 185;
    }
    for (let i = 0; i < 5; i++) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: x + 75, y: top, w: 20, h: 20 });
        x += 200;
    }
    // goal
    x += 80;
    gdObstacles.push({ type: "goal", x: x, y: top, w: 10, h: g - top });

    // player spawn
    const size = 28;
    gdCube = {
        x: 110, y: g - size, w: size, h: size, vy: 0,
        onGround: true, rot: 0, shipUp: false
    };
    gdSwingDir = 1; gdSwingLatch = false; gdBallGravity = 1; gdBallInputQueued = false;
    gdRobotJumpTime = 0; gdRobotJumping = false; gdRobotJumpLatch = false;
    gdSpeed = 5.0;
    gdPortalTargetX = 0; // no endless fill
}

// Seamless portal: only change vehicle, keep scroll & momentum feel
function applyGravityDir(dir) {
    // dir: 1 normal (down), -1 upside-down (ceil is floor)
    if (dir !== 1 && dir !== -1) dir = -gdGravityDir;
    if (dir === gdGravityDir) return;
    gdGravityDir = dir;
    gdBallGravity = dir;
    if (gdCube) {
        gdCube.onGround = false;
        // invert current vertical velocity so the flip feels instant on all vehicles
        gdCube.vy = -gdCube.vy;
        if (Math.abs(gdCube.vy) < 2) gdCube.vy = dir * 4;
        gdCube.y = constrain(gdCube.y, gdCeilY, gdGroundY - gdCube.h);
    }
    // Swing uses its own dir flag
    if (gdVehicle === "swing" || gdVehicle === "spider") gdSwingDir = dir;
}

// Change vehicle for one dual icon only (which=1 primary, which=2 twin)
function smPortalChangePlayer(which, target) {
    if (gdWon || gameOver) return;
    const is2 = which === 2;
    let sizeScale = is2 ? gdPlayerSize2 : gdPlayerSize;
    if (target === "mini") {
        if (is2) gdPlayerSize2 = GD_SIZE_MINI; else gdPlayerSize = GD_SIZE_MINI;
        sizeScale = GD_SIZE_MINI;
        target = is2 ? (gdVehicle2 === "mini" ? "cube" : gdVehicle2) : (gdVehicle === "mini" ? "cube" : gdVehicle);
    }
    if (is2) gdVehicle2 = target || "cube";
    else gdVehicle = target || "cube";
    const v = is2 ? gdVehicle2 : gdVehicle;
    const gDir = is2 ? gdGravityDir2 : (gdGravityDir || 1);
    let size = gdVehicleSize(v, sizeScale);
    const body = is2 ? gdCube2 : gdCube;
    if (!body) return;

    // Keep world position & momentum (real GD style) — only clamp into bounds after size change
    const prevBottom = body.y + (body.h || size);
    const prevCy = body.y + (body.h || size) * 0.5;
    body.w = size;
    body.h = size;
    // Anchor by center so resize doesn't shove you into floor/ceiling
    body.y = prevCy - size * 0.5;
    body.y = constrain(body.y, gdCeilY + 1, gdGroundY - size - 1);
    // Keep vertical velocity (jump/fall carries through portal)
    if (body.vy == null) body.vy = 0;
    gdStarted = true;

    const fly = (v === "ship" || v === "ufo" || v === "wave" || v === "swing" || v === "dart");
    if (fly) {
        body.onGround = false;
        if (!is2) {
            gdSpeed = v === "wave" ? 5.2 : (v === "dart" ? 7.4 : 5.8);
            if (v === "swing") gdSwingDir = gdGravityDir;
        }
    } else if (v === "ball" || v === "spider") {
        // Only snap to surface if already basically on it — never mid-air teleport
        const nearFloor = body.y + size >= gdGroundY - 8;
        const nearCeil = body.y <= gdCeilY + 8;
        if (gDir > 0 && nearFloor) { body.y = gdGroundY - size; body.onGround = true; }
        else if (gDir < 0 && nearCeil) { body.y = gdCeilY; body.onGround = true; }
        else body.onGround = false;
        if (!is2 && v === "ball") { gdBallGravity = gdGravityDir; gdBallInputQueued = false; gdSpeed = 5.4; }
        if (!is2 && v === "spider") { gdSwingDir = gdGravityDir; gdSpeed = 5.6; }
    } else {
        // cube / robot / mini — keep air position; land only if touching floor/ceil
        const nearFloor = body.y + size >= gdGroundY - 6;
        const nearCeil = body.y <= gdCeilY + 6;
        if (gDir > 0 && nearFloor) { body.y = gdGroundY - size; body.vy = 0; body.onGround = true; }
        else if (gDir < 0 && nearCeil) { body.y = gdCeilY; body.vy = 0; body.onGround = true; }
        else body.onGround = false;
        if (!is2) gdSpeed = 5.2;
    }
    if (v === "wave") {
        if (is2) gdWaveTrail2 = []; else gdWaveTrail = [];
    }
    // Reset input latches so new mode responds cleanly (do NOT zero vy)
    if (body) {
        body._arm = !(typeof gdHold === "function" && gdHold());
        body._ufoLatch = false;
        body._latched = false;
        body._jumpLatch = false;
        body._robotLatch = false;
        body._robotJumping = false;
        body._robotTime = 0;
        if (typeof practiceSafeUnstick === "function") practiceSafeUnstick(body);
    }
    playCoinSound();
}

function smPortalChange(target) {
    // Primary only — dual twin is independent
    smPortalChangePlayer(1, target);
    gdPortalStage = min(gdPortalStage + 1, 20);
}

function buildWaveSkillTester() {
    // Rest on floor until first hold → exact 45° climb → flared exit → long fall.
    // Anti-skip: ONE floor spike + ONE ceiling spikeDown at mid-slope only.
    gdVehicle = "wave";
    gdScroll = 0;
    gdStarted = true;
    gdWon = false;
    gdObstacles = [];
    waveSkillStage = 0;
    waveSkillClicked = [false, false, false, false];
    waveSkillArmed = false;
    gdPortalTargetX = 0;

    const g = gdGroundY;
    const top = gdCeilY;
    const size = 18;
    // Player is 18px; keep ~6px total slack so float/lerp at segment joins doesn't false-kill
    const open = 28;
    const half = open * 0.5;
    const speed = 5.2;
    const playerScreenX = 110;

    let x = playerScreenX + 80;

    for (let stage = 0; stage < 4; stage++) {
        // FPS switches here (open floor)
        WAVE_SKILL_GATE_X[stage] = x;
        x += 550; // adapt time before corridor

        const y0 = g - size * 0.5;
        const yMax = top + half + 10;
        const climbRun = Math.max(110, Math.floor(y0 - yMax));
        const y1 = y0 - climbRun;

        const segs = Math.max(6, Math.floor(climbRun / 14));
        const segW = climbRun / segs;
        for (let i = 0; i < segs; i++) {
            const t0 = i / segs, t1 = (i + 1) / segs;
            const ya = y0 + (y1 - y0) * t0;
            const yb = y0 + (y1 - y0) * t1;
            gdObstacles.push({
                type: "waveSlope",
                x: x + i * segW,
                w: segW + 0.5,
                top1: ya - half,
                top2: yb - half,
                bottom1: ya + half,
                bottom2: yb + half,
                skillGate: stage
            });
        }
        // Only mid-slope anti-skip hazards (not full seals)
        const midX = x + climbRun * 0.5;
        gdObstacles.push({ type: "spike", x: midX - 10, y: g - 20, w: 20, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: midX - 10, y: top, w: 20, h: 20 });
        x += climbRun;

        gdObstacles.push({
            type: "waveSlope", x: x, w: 50,
            top1: y1 - half, top2: y1 - half - 40,
            bottom1: y1 + half, bottom2: y1 + half + 40
        });
        x += 50;
        x += 700;
    }

    gdObstacles.push({ type: "goal", x: x + 40, y: top, w: 10, h: g - top });

    gdCube = {
        x: playerScreenX, y: g - size, w: size, h: size,
        vy: 0, onGround: true, rot: 0, shipUp: false
    };
    gdWaveTrail = [];
    waveSkillStage = 0;
    frameRate(WAVE_SKILL_FPS[0] || 10);
    gdSpeed = 5.2;
}

function updateWaveSkillFPS() {
    if (gameMode !== "Wave Skill Tester" || !gdCube) return;
    const px = gdScroll + gdCube.x + gdCube.w * 0.5;
    let stage = 0;
    for (let i = 0; i < WAVE_SKILL_GATE_X.length; i++) {
        if (px >= WAVE_SKILL_GATE_X[i]) stage = i;
    }
    if (stage !== waveSkillStage) {
        waveSkillStage = stage;
        const fps = WAVE_SKILL_FPS[stage] || 60;
        frameRate(fps);
        // Per-frame speed stays fixed. Do NOT scale by 60/fps — if frameRate
        // fails to drop, scaled speed becomes insanely fast.
        gdSpeed = 5.2;
    }
}


function buildPulseFactory() {
    // Original multi-mode showcase: Cube → Ball → UFO → Ship → Wave → Cube
    // Pads on the floor (wide + correct height), orbs, gravity ball, UFO hops, ship pulse, short wave.
    gdVehicle = "cube";
    gdScroll = 0;
    gdStarted = true;
    gdWon = false;
    gdObstacles = [];
    gdPortalStage = 0;

    const g = gdGroundY;
    const top = gdCeilY;
    const mid = (g + top) * 0.5;
    let x = 500;

    // ===== CUBE intro =====
    for (let i = 0; i < 3; i++) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 210;
    }
    // Wide yellow pad on the floor (must touch while grounded)
    gdObstacles.push({ type: "padYellow", x: x, y: g - 14, w: 56, h: 14 });
    x += 70;
    // high block to land on after pad launch
    gdObstacles.push({ type: "block", x: x, y: g - 100, w: 55, h: 100 });
    x += 200;
    // orb above spikes
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 24, y: g - 20, w: 20, h: 20 });
    x += 55;
    gdObstacles.push({ type: "orbYellow", x: x, y: g - 100, w: 28, h: 28 });
    x += 160;
    // mini stairs
    x += 50;
    gdObstacles.push({ type: "block", x: x, y: g - 40, w: 44, h: 40 });
    x += 44 + 160;
    gdObstacles.push({ type: "block", x: x, y: g - 80, w: 44, h: 80 });
    x += 44 + 180;

    // ===== BALL portal =====
    gdObstacles.push({ type: "portal", x: x, y: top + 18, w: 42, h: g - top - 36, target: "ball" });
    x += 130;
    // ball: gravity flip over spikes
    for (let i = 0; i < 6; i++) {
        if (i % 2 === 0)
            gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 22, h: 20 });
        else
            gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 22, h: 20 });
        x += 170;
    }
    // ball platforms
    gdObstacles.push({ type: "block", x: x, y: g - 60, w: 50, h: 60 });
    x += 180;
    gdObstacles.push({ type: "block", x: x, y: top, w: 50, h: 60 });
    x += 200;

    // ===== UFO portal =====
    gdObstacles.push({ type: "portal", x: x, y: top + 18, w: 42, h: g - top - 36, target: "ufo" });
    x += 130;
    for (let i = 0; i < 7; i++) {
        const yy = (i % 3 === 0) ? g - 20 : (i % 3 === 1) ? top : mid - 20;
        if (yy === top)
            gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 20, h: 20 });
        else if (yy === g - 20)
            gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        else
            gdObstacles.push({ type: "hazard", x: x, y: mid - 16, w: 28, h: 28 });
        x += 175;
    }

    // ===== SHIP portal =====
    gdObstacles.push({ type: "portal", x: x, y: top + 18, w: 42, h: g - top - 36, target: "ship" });
    x += 130;
    for (let i = 0; i < 6; i++) {
        gdObstacles.push({ type: "block", x: x, y: top, w: 40, h: 50 + (i % 3) * 15 });
        gdObstacles.push({ type: "block", x: x + 90, y: g - (50 + ((i + 1) % 3) * 15), w: 40, h: 50 + ((i + 1) % 3) * 15 });
        x += 200;
    }
    for (let i = 0; i < 4; i++) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 18, h: 18 });
        gdObstacles.push({ type: "spikeDown", x: x + 70, y: top, w: 18, h: 18 });
        x += 190;
    }

    // ===== WAVE portal (short corridor → soft floor exit) =====
    gdObstacles.push({ type: "portal", x: x, y: top + 18, w: 42, h: g - top - 36, target: "wave" });
    x += 110;
    {
        // wider, gentler zig — ends near floor so cube landing is fair
        const halfW = 58;
        let yc = mid;
        const segs = 10;
        for (let i = 0; i < segs; i++) {
            // last 3 segments ease down toward a floor-safe band
            let next;
            if (i >= segs - 3) {
                const t = (i - (segs - 3)) / 3;
                next = mid + (1 - t) * Math.sin(i * 0.7) * 35 + t * (g - halfW - 30 - mid);
            } else {
                next = mid + Math.sin(i * 0.75) * 50;
            }
            gdObstacles.push({
                type: "waveSlope", x: x, w: 72,
                top1: yc - halfW, top2: next - halfW,
                bottom1: yc + halfW, bottom2: next + halfW
            });
            yc = next;
            x += 72;
        }
    }
    // Clear recovery runway (no spikes) before cube portal
    x += 160;

    // ===== CUBE finale =====
    gdObstacles.push({ type: "portal", x: x, y: top + 18, w: 42, h: g - top - 36, target: "cube" });
    x += 180; // time to land as cube
    // gentle first obstacles
    gdObstacles.push({ type: "padYellow", x: x, y: g - 14, w: 56, h: 14 });
    x += 140;
    for (let i = 0; i < 3; i++) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 200;
    }
    gdObstacles.push({ type: "padYellow", x: x, y: g - 14, w: 56, h: 14 });
    x += 70;
    gdObstacles.push({ type: "block", x: x, y: g - 110, w: 55, h: 110 });
    x += 190;
    gdObstacles.push({ type: "orbYellow", x: x, y: g - 95, w: 28, h: 28 });
    x += 40;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 22, y: g - 20, w: 20, h: 20 });
    x += 200;
    for (let i = 0; i < 3; i++) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 180;
    }
    x += 60;
    gdObstacles.push({ type: "goal", x: x, y: top, w: 10, h: g - top });

    const sz = 28;
    gdCube = { x: 110, y: g - sz, w: sz, h: sz, vy: 0, onGround: true, rot: 0, shipUp: false };
    gdSpeed = 5.4;
    gdPortalTargetX = 0;
    gdBallGravity = 1;
    gdBallInputQueued = false;
}


function isGDGameMode() {
    // All pure GD vehicles + special GD stages (not Snake+GD Hybrid snake phase)
    if (!gameMode || typeof gameMode !== "string") return false;
    if (gameMode === "Geometry Dash") return true;
    if (gameMode === "GD Ship" || gameMode === "GD Wave" || gameMode === "GD Swing") return true;
    if (gameMode === "GD Robot" || gameMode === "GD UFO" || gameMode === "GD Ball") return true;
    if (gameMode === "GD Spider" || gameMode === "GD Dart" || gameMode === "GD Mini") return true;
    if (gameMode === "GD Portal Level" || gameMode === "Stereo Madness") return true;
    if (gameMode === "Wave Skill Tester" || gameMode === "Pulse Factory" || gameMode === "Grok Showcase") return true;
    if (gameMode === "GD Builder Test") return true;
    if (gameMode.startsWith("GD ")) return true; // future-proof
    return false;
}

function initGeometryDash() {
    if (practiceMode) practiceClearRun();
    // Only builder platformer sets this; normal GD modes are classic auto-scroll
    if (gameMode !== "GD Builder Test") gdPlatformerMode = false;
    // Default GD at 60 FPS; Wave Skill Tester forces its own FPS in buildWaveSkillTester
    if (gameMode === "Wave Skill Tester") {
        frameRate(WAVE_SKILL_FPS[0] || 10);
        waveSkillStage = 0;
        waveSkillArmed = false;
    } else {
        frameRate(60);
    }
    // Vehicle from mode name
    if (gameMode === "GD Ship") gdVehicle = "ship";
    else if (gameMode === "GD Wave") gdVehicle = "wave";
    else if (gameMode === "GD Swing") gdVehicle = "swing";
    else if (gameMode === "GD Robot") gdVehicle = "robot";
    else if (gameMode === "GD UFO") gdVehicle = "ufo";
    else if (gameMode === "GD Ball") gdVehicle = "ball";
    else if (gameMode === "GD Spider") gdVehicle = "spider";
    else if (gameMode === "GD Dart") gdVehicle = "dart";
    else if (gameMode === "GD Mini") gdVehicle = "mini";
    else if (gameMode === "GD Portal Level") gdVehicle = "cube";
    else if (gameMode === "Stereo Madness") gdVehicle = "cube";
    else if (gameMode === "Wave Skill Tester") gdVehicle = "wave";
    else if (gameMode === "Pulse Factory") gdVehicle = "cube";
    else if (gameMode === "Grok Showcase") gdVehicle = "cube";
    else gdVehicle = "cube";

    gdScroll = 0;
    gdSpeed = gdVehicle === "wave" ? 5.2
        : gdVehicle === "ship" ? 6.8
        : gdVehicle === "swing" ? 5.9
        : gdVehicle === "robot" ? 4.0
        : gdVehicle === "ufo" ? 4.6
        : gdVehicle === "ball" ? 5.4
        : gdVehicle === "spider" ? 5.0
        : gdVehicle === "dart" ? 6.2
        : gdVehicle === "mini" ? 4.8
        : 5.0;
    gdGroundY = sirina - 80;
    gdCeilY = 50;
    gdWon = false;
    gdStarted = false;
    gameOver = false;
    let size = gdVehicleSize();
    // Ship/UFO/Dart start mid corridor so AI is not glued to the floor spikes.
    const startMid = (gdCeilY + gdGroundY) / 2 - size / 2;
    const startY = (gdVehicle === "swing" || gdVehicle === "ship" || gdVehicle === "ufo" || gdVehicle === "dart")
        ? startMid
        : gdGroundY - size;
    gdCube = {
        x: 110, y: startY, w: size, h: size,
        vy: 0, onGround: gdVehicle !== "swing" && gdVehicle !== "ship" && gdVehicle !== "ufo" && gdVehicle !== "dart",
        rot: 0, shipUp: false
    };
    gdSwingDir = 1;
    gdSwingLatch = false;
    gdSwingInputQueued = false;
    gdSpiderHeldPrev = false;
    gdSpiderTrail = null;
    gdSpiderStickY = null;
    gdInputArmReady = false;
    gdDashing = false;
    gdDashTimer = 0;
    gdGravityDir = 1;
    gdBallGravity = 1;
    gdBallInputQueued = false;
    gdRobotJumpTime = 0;
    gdRobotJumping = false;
    gdRobotJumpLatch = false;
    gdObstacles = [];
    gdWaveTrail = [];
    gdPortalStage = 0;
    gdPortalTargetX = 0;
    gdPortalTotalScroll = 0;
    // Keep AI enabled when launched from AI Lab.
    gdAIPilot = !!watchingAI;
    if (gdAIPilot) gdStarted = true;
    gdAITrainingCooldown = 0;
    gdAIHold = false;
    gdAIJumpTimer = 0;
    gdAIBallTap = false;
    gdAIUfoCooldown = 0;
    gdAITargetY = null;
    gdAISwingCooldown = 0;
    gdPortalVehicles = ["cube","ship","wave","ufo","robot","ball","swing"];
    if (gameMode === "GD Portal Level") buildGDPortalStage();
    else if (gameMode === "Stereo Madness") buildStereoMadnessStage();
    else if (gameMode === "Wave Skill Tester") buildWaveSkillTester();
    else if (gameMode === "Pulse Factory") buildPulseFactory();
    else if (gameMode === "Grok Showcase") buildGrokShowcase();
    else if (gameMode === "GD AI Demon") buildGDAIDemonLevel();
    else buildGDLevel(gdVehicle);
}


function buildGrokShowcase() {
    // Full tour of EVERYTHING added to the editor — fair spacing, medium difficulty.
    // Order: Cube toolkit → Ship → UFO → Dual (2 modes) → Mini/Normal →
    //        Robot+slopes → Ball → Swing → Wave → Dart → Cube goal
    gdVehicle = "cube";
    gdScroll = 0;
    gdStarted = true;
    gdWon = false;
    gdObstacles = [];
    gdPortalStage = 0;
    gdDual = false;
    gdCube2 = null;
    gdVehicle2 = "cube";
    gdPlayerSize = 1;
    gdPlayerSize2 = 1;
    gdGravityDir = 1;
    gdGravityDir2 = -1;
    gdWaveTrail = [];
    gdWaveTrail2 = [];

    const g = gdGroundY;
    const top = gdCeilY;
    const mid = (g + top) * 0.5;
    const H = g - top;
    let x = 380;

    function portal(target, w) {
        gdObstacles.push({
            type: "portal", x: x, y: top + 14, w: w || 44, h: H - 28,
            target: target, used: false
        });
        x += (w || 44) + 90;
    }
    function full(type, extra) {
        const o = Object.assign({ type: type, x: x, y: top + 14, w: 44, h: H - 28, used: false }, extra || {});
        gdObstacles.push(o);
        x += 44 + 90;
    }

    // ========== 1. CUBE — all ground tools ==========
    // spike + yellow pad + block hop
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 18, h: 18 });
    x += 150;
    gdObstacles.push({ type: "padYellow", x: x, y: g - 14, w: 54, h: 14, facing: 1 });
    x += 85;
    gdObstacles.push({ type: "block", x: x, y: g - 52, w: 48, h: 52 });
    x += 130;
    // slope / and slopeFlip \
    gdObstacles.push({ type: "slope", x: x, y: g - 42, w: 50, h: 42, dir: 1 });
    x += 50;
    gdObstacles.push({ type: "slope", x: x, y: g - 78, w: 50, h: 78, dir: 1 });
    x += 55;
    gdObstacles.push({ type: "slope", x: x, y: g - 78, w: 50, h: 78, dir: -1 }); // flip down
    x += 50;
    gdObstacles.push({ type: "slope", x: x, y: g - 42, w: 50, h: 42, dir: -1 });
    x += 90;
    // pink (red) floor pad + pink ceiling pad
    gdObstacles.push({ type: "padPink", x: x, y: g - 14, w: 54, h: 14, facing: 1 });
    x += 100;
    gdObstacles.push({ type: "block", x: x, y: g - 90, w: 48, h: 40 }); // mid platform
    gdObstacles.push({ type: "padPink", x: x + 4, y: g - 90 - 14, w: 40, h: 14, facing: -1 }); // ceil-style on block underside-ish: facing -1
    // actually ceiling pad on true ceiling
    gdObstacles.push({ type: "padPink", x: x + 80, y: top, w: 54, h: 14, facing: -1 });
    x += 200;
    // orbs: yellow, blue, pink, dash
    gdObstacles.push({ type: "orbYellow", x: x, y: g - 95, w: 28, h: 28 });
    x += 110;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 18, h: 18 });
    x += 70;
    gdObstacles.push({ type: "orbBlue", x: x, y: g - 100, w: 28, h: 28 });
    x += 120;
    // after blue gravity flip — land-ish recovery with pad facing new gravity
    gdObstacles.push({ type: "padYellow", x: x, y: top, w: 54, h: 14, facing: -1 });
    x += 140;
    // gravity portal back to normal
    gdObstacles.push({ type: "gravityPortal", x: x, y: top + 14, w: 40, h: H - 28, gravityDir: 1, used: false });
    x += 120;
    gdObstacles.push({ type: "orbPink", x: x, y: g - 100, w: 28, h: 28 });
    x += 100;
    gdObstacles.push({ type: "orbDash", x: x, y: g - 90, w: 28, h: 28 });
    x += 160;
    gdObstacles.push({ type: "secretCoin", x: x, y: g - 110, w: 24, h: 24 });
    x += 100;

    // ========== 2. SHIP ==========
    portal("ship");
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 18, h: 18 });
    x += 170;
    gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 18, h: 18 });
    x += 170;
    gdObstacles.push({ type: "block", x: x, y: mid - 30, w: 40, h: 60 }); // mid obstacle
    x += 180;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 18, h: 18 });
    gdObstacles.push({ type: "spikeDown", x: x + 90, y: top, w: 18, h: 18 });
    x += 200;

    // ========== 3. UFO ==========
    portal("ufo");
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 18, h: 18 });
    x += 150;
    gdObstacles.push({ type: "block", x: x, y: g - 70, w: 44, h: 70 });
    x += 160;
    gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 18, h: 18 });
    x += 170;

    // ========== 4. DUAL — bottom cube path + top needs orb ==========
    full("portalDual");
    // floor path
    gdObstacles.push({ type: "padYellow", x: x, y: g - 14, w: 54, h: 14, facing: 1 });
    gdObstacles.push({ type: "orbYellow", x: x + 10, y: top + 48, w: 26, h: 26 });
    x += 130;
    gdObstacles.push({ type: "padPink", x: x, y: g - 14, w: 54, h: 14, facing: 1 });
    gdObstacles.push({ type: "orbPink", x: x + 10, y: top + 52, w: 26, h: 26 });
    x += 140;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 16, h: 16 });
    gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 16, h: 16 });
    x += 120;
    // portals only on bottom / only on top half so modes can diverge
    gdObstacles.push({ type: "portal", x: x, y: mid, w: 36, h: g - mid - 10, target: "ship", used: false });
    gdObstacles.push({ type: "portal", x: x, y: top + 10, w: 36, h: mid - top - 20, target: "ufo", used: false });
    x += 150;
    gdObstacles.push({ type: "orbBlue", x: x, y: g - 100, w: 26, h: 26 });
    gdObstacles.push({ type: "orbBlue", x: x, y: top + 55, w: 26, h: 26 });
    x += 140;
    full("endDual");

    // ========== 5. SIZE MINI → tight → NORMAL ==========
    gdObstacles.push({ type: "sizePortal", x: x, y: top + 20, w: 40, h: H - 40, size: "mini", used: false });
    x += 120;
    gdObstacles.push({ type: "spike", x: x, y: g - 16, w: 14, h: 14 });
    x += 100;
    gdObstacles.push({ type: "block", x: x, y: g - 34, w: 34, h: 34 });
    x += 95;
    gdObstacles.push({ type: "slope", x: x, y: g - 34, w: 40, h: 34, dir: 1 });
    x += 55;
    gdObstacles.push({ type: "slope", x: x, y: g - 55, w: 40, h: 55, dir: 1 });
    x += 70;
    gdObstacles.push({ type: "orbYellow", x: x, y: g - 70, w: 22, h: 22 });
    x += 100;
    gdObstacles.push({ type: "sizePortal", x: x, y: top + 20, w: 40, h: H - 40, size: "normal", used: false });
    x += 130;

    // ========== 6. ROBOT + slopes ==========
    portal("robot");
    gdObstacles.push({ type: "slope", x: x, y: g - 46, w: 50, h: 46, dir: 1 });
    x += 50;
    gdObstacles.push({ type: "slope", x: x, y: g - 80, w: 50, h: 80, dir: 1 });
    x += 55;
    gdObstacles.push({ type: "slope", x: x, y: g - 80, w: 50, h: 80, dir: -1 });
    x += 50;
    gdObstacles.push({ type: "slope", x: x, y: g - 46, w: 50, h: 46, dir: -1 });
    x += 90;
    gdObstacles.push({ type: "padYellow", x: x, y: g - 14, w: 54, h: 14, facing: 1 });
    x += 90;
    gdObstacles.push({ type: "block", x: x, y: g - 58, w: 48, h: 58 });
    x += 140;
    gdObstacles.push({ type: "secretCoin", x: x, y: g - 100, w: 24, h: 24 });
    x += 90;

    // ========== 7. BALL ==========
    portal("ball");
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 18, h: 18 });
    x += 140;
    gdObstacles.push({ type: "padBlue", x: x, y: g - 14, w: 54, h: 14, facing: 1 });
    x += 130;
    gdObstacles.push({ type: "padYellow", x: x, y: top, w: 54, h: 14, facing: -1 });
    x += 150;
    gdObstacles.push({ type: "block", x: x, y: mid - 40, w: 44, h: 80 });
    x += 160;

    // ========== 8. SWING ==========
    portal("swing");
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 16, h: 16 });
    x += 130;
    gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 16, h: 16 });
    x += 140;
    gdObstacles.push({ type: "block", x: x, y: mid - 25, w: 36, h: 50 });
    x += 160;

    // ========== 9. WAVE (wide, gentle) ==========
    portal("wave");
    {
        const halfW = 50;
        let yc = mid;
        for (let i = 0; i < 10; i++) {
            const next = mid + Math.sin(i * 0.65) * 45;
            gdObstacles.push({
                type: "waveSlope", x: x, w: 72,
                top1: yc - halfW, top2: next - halfW,
                bottom1: yc + halfW, bottom2: next + halfW
            });
            yc = next;
            x += 72;
        }
    }
    x += 70;

    // ========== 10. DART ==========
    portal("dart");
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 16, h: 16 });
    x += 150;
    gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 16, h: 16 });
    x += 150;
    gdObstacles.push({ type: "block", x: x, y: mid - 35, w: 36, h: 70 });
    x += 170;

    // ========== 11. CUBE FINALE ==========
    portal("cube");
    gdObstacles.push({ type: "padPink", x: x, y: g - 14, w: 54, h: 14, facing: 1 });
    x += 95;
    gdObstacles.push({ type: "block", x: x, y: g - 100, w: 50, h: 100 });
    x += 140;
    gdObstacles.push({ type: "orbYellow", x: x, y: g - 105, w: 28, h: 28 });
    x += 80;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 18, h: 18 });
    gdObstacles.push({ type: "spike", x: x + 22, y: g - 20, w: 18, h: 18 });
    x += 160;
    gdObstacles.push({ type: "slope", x: x, y: g - 50, w: 50, h: 50, dir: 1 });
    x += 55;
    gdObstacles.push({ type: "secretCoin", x: x, y: g - 120, w: 24, h: 24 });
    x += 100;
    gdObstacles.push({ type: "padBlue", x: x, y: g - 14, w: 54, h: 14, facing: 1 });
    x += 160;
    gdObstacles.push({ type: "goal", x: x, y: top, w: 14, h: H });

    const sz = 28;
    gdCube = { x: 110, y: g - sz, w: sz, h: sz, vy: 0, onGround: true, rot: 0, shipUp: false };
    gdSpeed = 5.35;
    gdPortalTargetX = 0;
    gdBallGravity = 1;
    gdBallInputQueued = false;
}


function buildGDAIDemonLevel() {
    // Every attempt gets a new seed and exactly 5 random modifiers out of 10.
    rollGDAIMutators();
    gdVehicle = "cube";
    gdAIDemonLength = 2400;
    gdAIDemonSeed = floor(random(1, 1000000));
    gdObstacles = [];
    const g = gdGroundY, c = gdCeilY;
    const rand = (n) => {
        const v = Math.sin((gdAIDemonSeed + n * 127.1) * 0.0174533) * 43758.5453;
        return v - Math.floor(v);
    };
    // Fair Demon opening: give the player time to start, learn the rhythm,
    // and make the first jumps consistently beatable even with random mutators.
    // The first three obstacles are ALWAYS single spikes with generous spacing.
    let x = 420;
    for (let i = 0; i < 3; i++) {
        gdObstacles.push({type:"spike", x:x, y:g-20, w:20, h:20});
        x += 180;
    }
    // Keep a clear run-up before the first portal; no random modifier adds
    // hazards to this opening section.
    const firstPortalTarget = gdAIMutatorActive("Portal Shuffle")
        ? (rand(301) > 0.5 ? "ship" : "swing") : "ship";
    gdObstacles.push({type:"portal", x:920, y:c+18, w:34, h:g-c-36, target:firstPortalTarget});
    // Ship corridor: randomized top/bottom hazards leave a central flight lane.
    for (let i = 0; i < 5; i++) {
        const hx = 1010 + i * 82;
        let topH = 55 + Math.floor(rand(i + 20) * 35);
        let botH = 58 + Math.floor(rand(i + 30) * 35);
        if (gdAIMutatorActive("Low Ceiling")) { topH += 16; botH += 14; }
        if (gdAIMutatorActive("Mirror Hazards") && i % 2 === 1) { const swap = topH; topH = botH; botH = swap; }
        const topHazard = {type:"hazard", x:hx, y:c+4, w:26, h:topH};
        const bottomHazard = {type:"hazard", x:hx+35, y:g-botH, w:27, h:botH};
        if (gdAIMutatorActive("Moving Hazards")) {
            topHazard.moving = true; topHazard.baseY = topHazard.y; topHazard.moveAmp = 10 + Math.floor(rand(i+90)*10); topHazard.movePhase = i;
            bottomHazard.moving = true; bottomHazard.baseY = bottomHazard.y; bottomHazard.moveAmp = 10 + Math.floor(rand(i+100)*10); bottomHazard.movePhase = i+2;
        }
        gdObstacles.push(topHazard, bottomHazard);
    }
    const secondPortalTarget = gdAIMutatorActive("Portal Shuffle")
        ? (rand(302) > 0.5 ? "wave" : "ship") : "wave";
    gdObstacles.push({type:"portal", x:1450, y:c+18, w:34, h:g-c-36, target:secondPortalTarget});
    // Wave segment: alternating ceiling/floor spikes, with small randomized offsets.
    for (let i = 0; i < 7; i++) {
        const wx = 1535 + i * 42;
        const h1 = 26 + Math.floor(rand(i + 40) * 18);
        const h2 = 25 + Math.floor(rand(i + 50) * 18);
        const topSpike = (i % 2 === 0) !== gdAIMutatorActive("Mirror Hazards");
        if (topSpike) gdObstacles.push({type:"spikeDown", x:wx, y:c+3, w:25, h:h1});
        else gdObstacles.push({type:"spike", x:wx, y:g-h2, w:25, h:h2});
        if (rand(i + 60) > 0.62) {
            gdObstacles.push({type:i%2===0 ? "spike" : "spikeDown", x:wx+25, y:i%2===0 ? g-24 : c+3, w:22, h:22});
        }
    }
    gdObstacles.push({type:"portal", x:1880, y:c+18, w:34, h:g-c-36, target:"cube"});
    // Final cube sprint; spacing varies slightly each run.
    x = 1950;
    for (let i = 0; i < 5; i++) {
        const count = rand(i + 70) > 0.48 ? 2 : 1;
        for (let j = 0; j < count; j++) gdObstacles.push({type:"spike", x:x+j*20, y:g-20, w:20, h:20});
        x += 38 + Math.floor(rand(i + 80) * 10) + count * 10;
        if (i === 2) {
            gdObstacles.push({type:"block", x:x, y:g-32, w:34, h:32});
            x += 55;
        }
    }
    // Mutator-driven extras are placed in the final cube section.
    if (gdAIMutatorActive("Spike Rush")) {
        for (let i = 0; i < 4; i++) {
            const sx = 1980 + i * 76 + Math.floor(rand(i+130)*18);
            gdObstacles.push({type:"spike", x:sx, y:g-20, w:20, h:20});
        }
    }
    if (gdAIMutatorActive("Double Trouble")) {
        gdObstacles.push({type:"block", x:2220, y:g-28, w:30, h:28});
        gdObstacles.push({type:"spike", x:2270, y:g-20, w:20, h:20});
    }
    if (gdAIMutatorActive("Gravity Flip")) {
        gdObstacles.push({type:"gravityPortal", x:1918, y:c+4, w:28, h:g-c-8, gravityDir:-1});
    }
    // The goal is fixed at the end so the percentage HUD is consistent.
    gdObstacles.push({type:"goal", x:gdAIDemonLength, y:c, w:18, h:g-c});
    const size = gdVehicleSize() * (gdAIMutatorActive("Mini Mode") ? 0.78 : 1);
    gdCube = {x:110, y:g-size, w:size, h:size, vy:0, onGround:true, rot:0, shipUp:false};
    gdSpeed = 5.6;
    gdGravityDir = 1;
    gdPortalStage = 0;
}

function buildGDLevel(vehicle) {
    gdObstacles = [];
    let g = gdGroundY;
    let x = 380;

    if (vehicle === "cube") {
        // === FAIR cube level (handcrafted, beatable) ===
        // intro flat
        x = 450;
        // easy single spike
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 180;
        // low block — landable
        gdObstacles.push({ type: "block", x: x, y: g - 28, w: 40, h: 28 });
        x += 160;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 170;
        // double spike with room to jump
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 70;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 200;
        // stairs up
        gdObstacles.push({ type: "block", x: x, y: g - 28, w: 44, h: 28 });
        x += 50;
        gdObstacles.push({ type: "block", x: x, y: g - 56, w: 44, h: 56 });
        x += 50;
        gdObstacles.push({ type: "block", x: x, y: g - 84, w: 50, h: 84 });
        x += 160;
        // spike after stairs
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 190;
        // small gap
        gdObstacles.push({ type: "gap", x: x, y: g, w: 48, h: 40 });
        x += 160;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 180;
        // platform hop
        gdObstacles.push({ type: "plat", x: x, y: g - 70, w: 60, h: 14 });
        x += 140;
        gdObstacles.push({ type: "plat", x: x, y: g - 100, w: 60, h: 14 });
        x += 150;
        // back to ground spike
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 170;
        gdObstacles.push({ type: "block", x: x, y: g - 28, w: 40, h: 28 });
        x += 100;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 200;
        // longer final section
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 170;
        gdObstacles.push({ type: "block", x: x, y: g - 28, w: 44, h: 28 });
        x += 90;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 150;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 70;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 190;
        gdObstacles.push({ type: "plat", x: x, y: g - 65, w: 70, h: 14 });
        x += 130;
        gdObstacles.push({ type: "plat", x: x, y: g - 95, w: 70, h: 14 });
        x += 150;
        gdObstacles.push({ type: "block", x: x, y: g - 28, w: 44, h: 28 });
        x += 100;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 200;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 230;
        // Endless Cube: no goal. New patterns continue forever.
    } else if (vehicle === "robot") {
        // EASY finite robot course
        x = 420;
        for (let i = 0; i < 5; i++) {
            gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
            x += 200;
        }
        gdObstacles.push({ type: "block", x: x, y: g - 28, w: 48, h: 28 });
        x += 180;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 210;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 90;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 220;
        gdObstacles.push({ type: "block", x: x, y: g - 28, w: 44, h: 28 });
        x += 55;
        gdObstacles.push({ type: "block", x: x, y: g - 50, w: 44, h: 50 });
        x += 200;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 200;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 250;
        // Robot is endless: no goal/flag.
    } else if (vehicle === "ufo") {
        // UFO uporablja enak jezik ovir kot Swing/Ship in je neskončen.
        x = 420;
        const mid = (g + gdCeilY) / 2;
        for (let i = 0; i < 10; i++) {
            addSwingSection(x, mid, i);
            x += 145;
        }
    } else if (vehicle === "ball") {
        // Structured Ball level: fixed sections with a clear rhythm.
        // Each section teaches one idea before combining it with the next.
        let x = 430;
        const g = gdGroundY, top = gdCeilY, mid = (g + top) / 2;
        const add = (type, dx, y, w=28, h=20) => gdObstacles.push({type, x:x+dx, y, w, h});

        // 1. Warm-up: normal gravity, single spikes.
        add("spike", 100, g-20, 22, 20);
        add("spike", 155, g-20, 22, 20);
        x += 300;

        // 2. Learn gravity flip: blue pad sends the ball to the ceiling.
        add("padBlue", 0, g-16, 44, 16);
        add("spikeDown", 125, top, 22, 20);
        add("spikeDown", 180, top, 22, 20);
        add("orbBlue", 245, top+65, 28, 28);
        x += 380;

        // 3. Ceiling run: clean alternating hazards, then return to floor.
        add("spikeDown", 40, top, 22, 20);
        add("spikeDown", 110, top, 22, 20);
        add("orbBlue", 175, top+70, 28, 28);
        add("spike", 245, g-20, 22, 20);
        x += 360;

        // 4. Yellow pad jump: one intentional launch over a spike pair.
        add("padYellow", 0, g-16, 44, 16);
        add("spike", 105, g-20, 22, 20);
        add("spike", 145, g-20, 22, 20);
        add("spikeDown", 225, top, 22, 20);
        x += 350;

        // 5. Platform section: land on the raised platform, then drop safely.
        add("plat", 0, g-105, 120, 16);
        add("spikeDown", 55, top, 22, 20);
        add("orbYellow", 150, g-155, 28, 28);
        add("spike", 245, g-20, 22, 20);
        x += 370;

        // 6. Controlled flip chain: every orb has a single purpose.
        add("orbBlue", 0, g-75, 28, 28);
        add("spikeDown", 90, top, 22, 20);
        add("orbBlue", 165, top+70, 28, 28);
        add("spike", 255, g-20, 22, 20);
        x += 380;

        // 7. Recovery section: no gimmicks, just two spaced spikes.
        add("spike", 120, g-20, 22, 20);
        add("spike", 205, g-20, 22, 20);
        x += 300;

        // 8. Final combination: pad -> ceiling -> orb -> floor finish.
        add("padBlue", 0, g-16, 44, 16);
        add("spikeDown", 105, top, 22, 20);
        add("orbBlue", 170, top+65, 28, 28);
        add("spike", 255, g-20, 22, 20);
        add("spike", 310, g-20, 22, 20);
        x += 450;

        // Endless Ball: no goal. New sections are appended during play.
    } else if (vehicle === "spider") {
        // Long empty runway + very spaced single hazards
        x = 700;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 280;
        gdObstacles.push({ type: "spikeDown", x: x, y: gdCeilY, w: 20, h: 20 });
        x += 300;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        x += 280;
        for (let i = 0; i < 6; i++) {
            addSpiderSection(x, i);
            x += 240;
        }
    } else if (vehicle === "mini") {
        // Very sparse — short jump needs room
        x = 600;
        gdObstacles.push({ type: "block", x: x, y: g - 16, w: 24, h: 16 });
        x += 260;
        gdObstacles.push({ type: "spike", x: x, y: g - 14, w: 14, h: 14 });
        x += 280;
        for (let i = 0; i < 8; i++) {
            addMiniSection(x, i);
            x += 220;
        }
    } else if (vehicle === "dart") {
        // Huge open start, then mild gates
        x = 750;
        const mid = (g + gdCeilY) / 2;
        for (let i = 0; i < 8; i++) {
            addDartSection(x, mid, i);
            x += 200;
        }
    } else if (vehicle === "ship") {
        // Endless ship: start with a short fair section, then keep generating.
        let mid = (g + gdCeilY) / 2;
        x = 420;
        for (let i = 0; i < 12; i++) {
            addShipSection(x, mid, i);
            x += 110;
        }
    } else if (vehicle === "swing") {
        // Endless Swing: same obstacle language as Ship, with more breathing room.
        x = 420;
        const mid = (g + gdCeilY) / 2;
        for (let i = 0; i < 10; i++) {
            addSwingSection(x, mid, i);
            x += 145;
        }
    } else {
        // Endless Wave: true GD-style corridor. The top and bottom walls are
        // parallel, the opening stays aligned from segment to segment, and
        // long 45-degree runs alternate up/down. Flat spam is rare.
        x = 390;
        const gapH = 175;
        let center = (gdGroundY + gdCeilY) / 2;
        for (let i = 0; i < 8; i++) {
            const result = addWaveSlopeSegment(x, center, gapH, i);
            center = result.nextCenter;
            x += result.dx;
        }
    }
}

function buildBallIntro() {
    // XStep / Cycles inspired opening: clear path with pads & orbs.
    const g = gdGroundY;
    const top = gdCeilY;
    const mid = (g + top) / 2;
    let x = 450;

    // 1) Runway + yellow pad over first low spike (auto boost)
    gdObstacles.push({ type: "spike", x: x + 40, y: g - 20, w: 22, h: 20 });
    gdObstacles.push({ type: "padYellow", x: x, y: g - 16, w: 44, h: 16 });
    x += 160;

    // 2) Blue pad flips you to ceiling — then ceiling spike forces flip back
    gdObstacles.push({ type: "padBlue", x: x, y: g - 16, w: 44, h: 16 });
    x += 120;
    gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 22, h: 20 });
    // yellow orb mid-air to boost if needed (click)
    gdObstacles.push({ type: "orbYellow", x: x - 50, y: mid - 20, w: 28, h: 28 });
    x += 150;

    // 3) Floor stretch + blue orb (click to flip) before spike
    gdObstacles.push({ type: "orbBlue", x: x, y: g - 70, w: 28, h: 28 });
    gdObstacles.push({ type: "spike", x: x + 90, y: g - 20, w: 22, h: 20 });
    x += 200;

    // 4) Platform bridge + yellow pad on it
    gdObstacles.push({ type: "plat", x: x, y: g - 130, w: 130, h: 16 });
    gdObstacles.push({ type: "padYellow", x: x + 40, y: g - 146, w: 44, h: 16 });
    gdObstacles.push({ type: "spike", x: x + 150, y: g - 20, w: 22, h: 20 });
    x += 250;

    // 5) Blue pad on floor → ride ceiling → blue orb to flip down
    gdObstacles.push({ type: "padBlue", x: x, y: g - 16, w: 44, h: 16 });
    x += 100;
    gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 22, h: 20 });
    gdObstacles.push({ type: "spike", x: x + 50, y: g - 20, w: 22, h: 20 });
    gdObstacles.push({ type: "orbBlue", x: x + 30, y: top + 60, w: 28, h: 28 });
    x += 200;

    // 6) Rest platform + yellow orb sequence (Cycles-ish)
    gdObstacles.push({ type: "plat", x: x, y: mid, w: 100, h: 16 });
    gdObstacles.push({ type: "orbYellow", x: x + 120, y: mid - 40, w: 28, h: 28 });
    gdObstacles.push({ type: "orbBlue", x: x + 200, y: mid + 20, w: 28, h: 28 });
    gdObstacles.push({ type: "spikeDown", x: x + 250, y: top, w: 22, h: 20 });
    x += 320;

    // 7) Double yellow pad staircase feel
    gdObstacles.push({ type: "padYellow", x: x, y: g - 16, w: 44, h: 16 });
    gdObstacles.push({ type: "plat", x: x + 70, y: g - 150, w: 90, h: 16 });
    gdObstacles.push({ type: "padYellow", x: x + 90, y: g - 166, w: 44, h: 16 });
    gdObstacles.push({ type: "spike", x: x + 180, y: g - 20, w: 22, h: 20 });
    x += 280;

    return x;
}



function addBallSection(x, index) {
    // Varied XStep/Cycles motifs — many patterns + seed offsets so it never feels like a short loop.
    const g = gdGroundY;
    const top = gdCeilY;
    const mid = (g + top) / 2;
    // pseudo-random but stable per index
    const rnd = (n) => {
        let t = (index * 1103515245 + n * 12345 + 1234567) >>> 0;
        return (t % 1000) / 1000;
    };
    const hard = index > 12; // slightly denser later
    const p = Math.floor(rnd(1) * 12); // 12 distinct motifs
    const jx = Math.floor(rnd(2) * 30) - 10; // small horizontal jitter
    const jy = Math.floor(rnd(3) * 24) - 12; // small vertical jitter for orbs/plats

    if (p === 0) {
        // yellow pad → spike → blue orb → spike
        gdObstacles.push({ type: "padYellow", x: x + jx, y: g - 16, w: 44, h: 16 });
        gdObstacles.push({ type: "spike", x: x + 40 + jx, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "orbBlue", x: x + 120 + jx, y: g - 85 + jy, w: 28, h: 28 });
        gdObstacles.push({ type: "spike", x: x + 200 + jx, y: g - 20, w: 22, h: 20 });
        if (hard) gdObstacles.push({ type: "spike", x: x + 240 + jx, y: g - 20, w: 22, h: 20 });
    } else if (p === 1) {
        // blue pad ceiling ride
        gdObstacles.push({ type: "padBlue", x: x, y: g - 16, w: 44, h: 16 });
        gdObstacles.push({ type: "spike", x: x + 70, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "spike", x: x + 115, y: g - 20, w: 22, h: 20 });
        if (hard) gdObstacles.push({ type: "spike", x: x + 155, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "orbYellow", x: x + 100, y: top + 65 + jy, w: 28, h: 28 });
        gdObstacles.push({ type: "spikeDown", x: x + 180, y: top, w: 22, h: 20 });
    } else if (p === 2) {
        // platform bridge with pad
        gdObstacles.push({ type: "plat", x: x, y: g - 135 + jy, w: 130, h: 16 });
        gdObstacles.push({ type: "padYellow", x: x + 40, y: g - 151 + jy, w: 44, h: 16 });
        gdObstacles.push({ type: "orbBlue", x: x + 160, y: mid - 10 + jy, w: 28, h: 28 });
        gdObstacles.push({ type: "spikeDown", x: x + 210, y: top, w: 22, h: 20 });
        gdObstacles.push({ type: "spike", x: x + 250, y: g - 20, w: 22, h: 20 });
    } else if (p === 3) {
        // orb chain timing
        gdObstacles.push({ type: "orbYellow", x: x, y: mid - 35 + jy, w: 28, h: 28 });
        gdObstacles.push({ type: "orbBlue", x: x + 85, y: mid + 15 + jy, w: 28, h: 28 });
        gdObstacles.push({ type: "orbYellow", x: x + 170, y: mid - 25 + jy, w: 28, h: 28 });
        if (hard) gdObstacles.push({ type: "orbBlue", x: x + 250, y: mid + 5, w: 28, h: 28 });
        gdObstacles.push({ type: "spike", x: x + 130, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: x + 220, y: top, w: 22, h: 20 });
    } else if (p === 4) {
        // dual platform corridor
        gdObstacles.push({ type: "plat", x: x, y: mid - 50, w: 90, h: 16 });
        gdObstacles.push({ type: "plat", x: x + 20, y: mid + 55, w: 90, h: 16 });
        gdObstacles.push({ type: "orbYellow", x: x + 110, y: mid - 5, w: 28, h: 28 });
        gdObstacles.push({ type: "spike", x: x + 160, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "padBlue", x: x + 200, y: g - 16, w: 44, h: 16 });
    } else if (p === 5) {
        // staircase pads
        gdObstacles.push({ type: "padYellow", x: x, y: g - 16, w: 44, h: 16 });
        gdObstacles.push({ type: "plat", x: x + 60, y: g - 130, w: 80, h: 16 });
        gdObstacles.push({ type: "padYellow", x: x + 75, y: g - 146, w: 44, h: 16 });
        gdObstacles.push({ type: "plat", x: x + 150, y: g - 200, w: 80, h: 16 });
        gdObstacles.push({ type: "orbBlue", x: x + 175, y: g - 240, w: 28, h: 28 });
        gdObstacles.push({ type: "spikeDown", x: x + 250, y: top, w: 22, h: 20 });
    } else if (p === 6) {
        // floor spike gauntlet with mid blue orb escape
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "spike", x: x + 55, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "orbBlue", x: x + 30, y: g - 75, w: 28, h: 28 });
        gdObstacles.push({ type: "spike", x: x + 120, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "padYellow", x: x + 180, y: g - 16, w: 44, h: 16 });
        gdObstacles.push({ type: "spike", x: x + 220, y: g - 20, w: 22, h: 20 });
    } else if (p === 7) {
        // ceiling focus: pad blue then several spikeDown
        gdObstacles.push({ type: "padBlue", x: x, y: g - 16, w: 44, h: 16 });
        gdObstacles.push({ type: "spikeDown", x: x + 90, y: top, w: 22, h: 20 });
        gdObstacles.push({ type: "orbYellow", x: x + 140, y: top + 55, w: 28, h: 28 });
        gdObstacles.push({ type: "spikeDown", x: x + 190, y: top, w: 22, h: 20 });
        if (hard) gdObstacles.push({ type: "spikeDown", x: x + 235, y: top, w: 22, h: 20 });
        gdObstacles.push({ type: "orbBlue", x: x + 250, y: mid, w: 28, h: 28 });
    } else if (p === 8) {
        // empty-ish recovery then sudden orb choice
        gdObstacles.push({ type: "plat", x: x + 40, y: mid + jy, w: 100, h: 16 });
        gdObstacles.push({ type: "orbYellow", x: x + 160, y: mid - 50, w: 28, h: 28 });
        gdObstacles.push({ type: "orbBlue", x: x + 160, y: mid + 40, w: 28, h: 28 });
        gdObstacles.push({ type: "spike", x: x + 230, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: x + 230, y: top, w: 22, h: 20 });
    } else if (p === 9) {
        // zigzag plats
        gdObstacles.push({ type: "plat", x: x, y: g - 110, w: 70, h: 16 });
        gdObstacles.push({ type: "plat", x: x + 90, y: mid - 20, w: 70, h: 16 });
        gdObstacles.push({ type: "plat", x: x + 180, y: top + 110, w: 70, h: 16 });
        gdObstacles.push({ type: "padYellow", x: x + 195, y: top + 94, w: 44, h: 16 });
        gdObstacles.push({ type: "spike", x: x + 270, y: g - 20, w: 22, h: 20 });
    } else if (p === 10) {
        // double blue orb gravity spam
        gdObstacles.push({ type: "orbBlue", x: x, y: g - 70, w: 28, h: 28 });
        gdObstacles.push({ type: "spike", x: x + 70, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "orbBlue", x: x + 120, y: mid, w: 28, h: 28 });
        gdObstacles.push({ type: "spikeDown", x: x + 180, y: top, w: 22, h: 20 });
        gdObstacles.push({ type: "padYellow", x: x + 230, y: g - 16, w: 44, h: 16 });
    } else {
        // mixed finale-style
        gdObstacles.push({ type: "padBlue", x: x, y: g - 16, w: 44, h: 16 });
        gdObstacles.push({ type: "plat", x: x + 80, y: mid - 8 + jy, w: 110, h: 16 });
        gdObstacles.push({ type: "padYellow", x: x + 100, y: mid - 24 + jy, w: 44, h: 16 });
        gdObstacles.push({ type: "orbYellow", x: x + 200, y: mid - 60, w: 28, h: 28 });
        gdObstacles.push({ type: "spike", x: x + 250, y: g - 20, w: 22, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: x + 280, y: top, w: 22, h: 20 });
    }
}





function gdShouldEndlessFill() {
    if (!isGDGameMode()) return false;
    // Hand-authored finite levels — stop at their goal
    if (gameMode === "Stereo Madness" || gameMode === "Pulse Factory" || gameMode === "Grok Showcase") return false;
    if (gameMode === "Wave Skill Tester" || gameMode === "GD Builder Test") return false;
    // Portal level only fills up to stage portal target
    if (gameMode === "GD Portal Level") return gdPortalTargetX > 0;
    // AI demon / single-vehicle modes: endless OK
    return true;
}

function ensureEndlessCube() {
    if (gdVehicle !== "cube") return;
    let farthest = 0;
    for (let o of gdObstacles) farthest = max(farthest, o.x + (o.w || 0));
    const target = gdPortalTargetX > 0 ? gdPortalTargetX : gdScroll + sirina * 2.8;
    let index = max(0, floor(farthest / 180));
    let safety = 0;
    while (farthest < target && safety++ < 12) {
        const g = gdGroundY;
        const top = gdCeilY;
        const pattern = index % 9;
        const x = farthest + 70;

        if (pattern === 0) {
            gdObstacles.push({type:"spike", x, y:g-20, w:20, h:20});
            farthest = x + 210;
        } else if (pattern === 1) {
            gdObstacles.push({type:"padYellow", x, y:g-16, w:44, h:16});
            gdObstacles.push({type:"spike", x:x+115, y:g-20, w:20, h:20});
            gdObstacles.push({type:"spike", x:x+155, y:g-20, w:20, h:20});
            farthest = x + 270;
        } else if (pattern === 2) {
            gdObstacles.push({type:"spike", x, y:g-20, w:20, h:20});
            gdObstacles.push({type:"orbYellow", x:x+92, y:g-92, w:28, h:28});
            gdObstacles.push({type:"spike", x:x+175, y:g-20, w:20, h:20});
            farthest = x + 285;
        } else if (pattern === 3) {
            gdObstacles.push({type:"block", x, y:g-28, w:44, h:28});
            gdObstacles.push({type:"padYellow", x:x+62, y:g-16, w:44, h:16});
            gdObstacles.push({type:"spike", x:x+170, y:g-20, w:20, h:20});
            farthest = x + 290;
        } else if (pattern === 4) {
            gdObstacles.push({type:"orbYellow", x:x+35, y:g-105, w:28, h:28});
            gdObstacles.push({type:"spike", x:x+120, y:g-20, w:20, h:20});
            gdObstacles.push({type:"spikeDown", x:x+170, y:top, w:20, h:20});
            farthest = x + 300;
        } else if (pattern === 5) {
            gdObstacles.push({type:"padBlue", x, y:g-16, w:44, h:16});
            gdObstacles.push({type:"spikeDown", x:x+110, y:top, w:20, h:20});
            gdObstacles.push({type:"orbYellow", x:x+175, y:top+75, w:28, h:28});
            farthest = x + 305;
        } else if (pattern === 6) {
            gdObstacles.push({type:"spike", x, y:g-20, w:20, h:20});
            gdObstacles.push({type:"orbBlue", x:x+80, y:g-120, w:28, h:28});
            gdObstacles.push({type:"spikeDown", x:x+175, y:top, w:20, h:20});
            farthest = x + 300;
        } else if (pattern === 7) {
            gdObstacles.push({type:"plat", x, y:g-75, w:70, h:14});
            gdObstacles.push({type:"orbYellow", x:x+100, y:g-135, w:28, h:28});
            gdObstacles.push({type:"spike", x:x+185, y:g-20, w:20, h:20});
            farthest = x + 310;
        } else {
            // Recovery: plain ground is safe and gives a short breather.
            farthest = x + 330;
        }
        index++;
    }
}

function ensureEndlessBall() {
    if (gdVehicle !== "ball") return;
    let farthest = 0;
    for (let o of gdObstacles) farthest = max(farthest, o.x + (o.w || 0));
    const target = gdPortalTargetX > 0 ? gdPortalTargetX : gdScroll + sirina * 2.5;
    let index = max(0, floor(farthest / 190));
    let safety = 0;
    while (farthest < target && safety++ < 24) {
        addBallSection(farthest, index);
        // variable gaps: 170–250 so rhythm changes
        const gapTable = [190, 210, 175, 230, 200, 185, 245, 195, 220, 180, 235, 205];
        farthest += gapTable[index % gapTable.length];
        index++;
    }
}

function addSwingSection(x, mid, index) {
    const g = gdGroundY;
    const top = gdCeilY;
    const amp = index < 4 ? 45 : 82;
    const swing = sin(index * 1.17) * amp + sin(index * 0.43) * (amp * 0.3);
    const center = constrain(mid + swing, top + 125, g - 125);

    if (index % 2 === 0) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 24, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: x + 38, y: top, w: 24, h: 20 });
    } else {
        gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 24, h: 20 });
        gdObstacles.push({ type: "spike", x: x + 38, y: g - 20, w: 24, h: 20 });
    }

    // First 3 sections: no mid hazard (same lesson as ship).
    if (index >= 3 && index % 3 !== 0) {
        gdObstacles.push({
            type: "hazard",
            x: x + 70,
            y: constrain(center - 16, top + 55, g - 91),
            w: 32, h: 32
        });
    }
}

function ensureEndlessSwing() {
    if (gdVehicle !== "swing") return;
    let farthest = 0;
    for (let o of gdObstacles) farthest = max(farthest, o.x + (o.w || 0));
    const target = gdPortalTargetX > 0 ? gdPortalTargetX : gdScroll + sirina * 2.5;
    let index = max(0, floor(farthest / 145));
    let safety = 0;
    const mid = (gdGroundY + gdCeilY) / 2;
    while (farthest < target && safety++ < 16) {
        addSwingSection(farthest, mid, index);
        farthest += 145;
        index++;
    }
}

function waveRand(index) {
    // Deterministic pseudo-random sequence: looks random, but the same level
    // stays reproducible after restarting.
    const v = Math.sin(index * 91.731 + 17.41) * 43758.5453;
    return v - Math.floor(v);
}

function addWaveSlopeSegment(x, center, gapH, index, previousSlope = 0) {
    const g = gdGroundY;
    gapH = max(165, gapH);
    const half = gapH / 2;
    const minCenter = gdCeilY + half + 8;
    const maxCenter = g - half - 8;
    center = constrain(center, minCenter, maxCenter);

    // GD-style Wave corridor: both walls are always parallel and the opening
    // keeps exactly the same height. Every segment is either 45° up, 45° down,
    // or (rarely) flat. Direction is pseudo-random rather than a repeating cycle.
    const r = waveRand(index);
    const spam = r < 0.075; // rare flat/spam sections
    let wantedSlope;
    if (spam) {
        wantedSlope = 0;
    } else {
        wantedSlope = r < 0.5375 ? 1 : -1;
        // Avoid long accidental runs in one direction, but don't make a fixed
        // alternating pattern.
        if (previousSlope !== 0 && wantedSlope === previousSlope && waveRand(index + 101) < 0.62) {
            wantedSlope = -previousSlope;
        }
    }

    // Variable segment length keeps the layout from repeating. Because dy=dx,
    // every non-flat segment is still exactly 45°.
    let dx = 82 + Math.floor(waveRand(index + 37) * 70); // 82..151
    let nextCenter = center + wantedSlope * dx;

    // At the vertical limits, choose the direction that still fits. Only use
    // flat as a last resort, so spam remains genuinely rare.
    if (nextCenter < minCenter || nextCenter > maxCenter) {
        const opposite = -wantedSlope;
        const oppositeCenter = center + opposite * dx;
        if (opposite !== 0 && oppositeCenter >= minCenter && oppositeCenter <= maxCenter) {
            wantedSlope = opposite;
            nextCenter = oppositeCenter;
        } else {
            const maxDx = wantedSlope > 0 ? maxCenter - center : center - minCenter;
            if (maxDx >= 18) {
                dx = min(dx, maxDx);
                nextCenter = center + wantedSlope * dx;
            } else {
                wantedSlope = 0;
                nextCenter = center;
            }
        }
    }

    gdObstacles.push({
        type: "waveSlope", x, w: dx,
        top1: center - half, top2: nextCenter - half,
        bottom1: center + half, bottom2: nextCenter + half,
        slope: wantedSlope,
        spam: wantedSlope === 0
    });

    return { dx, nextCenter, slope: wantedSlope };
}

function addShipSection(x, mid, index) {
    const g = gdGroundY;
    const top = gdCeilY;
    // Smaller swing early so the corridor is readable for AI + humans.
    const amp = index < 4 ? 55 : 105;
    const swing = sin(index * 1.17) * amp + sin(index * 0.43) * (amp * 0.3);
    const center = constrain(mid + swing, top + 105, g - 105);

    // Alternating top/bottom spikes leave a moving flight corridor.
    if (index % 2 === 0) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 24, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: x + 34, y: top, w: 24, h: 20 });
    } else {
        gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 24, h: 20 });
        gdObstacles.push({ type: "spike", x: x + 34, y: g - 20, w: 24, h: 20 });
    }

    // First 3 sections: no mid hazard (gives ship time to climb into corridor).
    // After that, mid blockers every section except every 3rd.
    if (index >= 3 && index % 3 !== 0) {
        gdObstacles.push({
            type: "hazard",
            x: x + 58,
            y: constrain(center - 18, top + 48, g - 84),
            w: 36, h: 36
        });
    }
}

function ensureEndlessWave() {
    if (gdVehicle !== "wave") return;

    // One constant opening through the entire level. The two walls are generated
    // from the same centerline, so they always remain perfectly parallel.
    const gapH = 175;
    const half = gapH / 2;
    const minCenter = gdCeilY + half + 8;
    const maxCenter = gdGroundY - half - 8;

    let farthest = 0;
    let lastCenter = (gdGroundY + gdCeilY) / 2;
    let lastSlope = 0;
    let lastIndex = 0;

    for (let o of gdObstacles) {
        if (o.type === "waveSlope") {
            farthest = max(farthest, o.x + o.w);
            lastCenter = (o.bottom2 + o.top2) / 2;
            lastSlope = o.slope || 0;
            lastIndex++;
        } else {
            farthest = max(farthest, o.x + (o.w || 0));
        }
    }

    lastCenter = constrain(lastCenter, minCenter, maxCenter);
    const target = gdPortalTargetX > 0 ? gdPortalTargetX : gdScroll + sirina * 2.4;
    let safety = 0;

    while (farthest < target && safety++ < 14) {
        const result = addWaveSlopeSegment(farthest, lastCenter, gapH, lastIndex, lastSlope);
        lastCenter = result.nextCenter;
        lastSlope = result.slope;
        farthest += result.dx;
        lastIndex++;
    }
}

function addRobotSection(x, index) {
    const g = gdGroundY;
    // Robot ima več različnih, a še vedno prijaznih vzorcev.
    // Vzorci se vrtijo na 12 mestih, zato niso več očitno enaki vsakih 5 ovir.
    const p = index % 12;
    const pushSpike = (dx = 0, w = 20) => {
        gdObstacles.push({ type: "spike", x: x + dx, y: g - 20, w: w, h: 20 });
    };
    const pushBlock = (dx, w, h) => {
        gdObstacles.push({ type: "block", x: x + dx, y: g - h, w: w, h: h });
    };

    if (p === 0) {
        pushSpike(12);
    } else if (p === 1) {
        pushBlock(12, 42, 30);
    } else if (p === 2) {
        pushSpike(10);
        pushSpike(42);
    } else if (p === 3) {
        pushBlock(10, 38, 26);
        pushSpike(62);
    } else if (p === 4) {
        pushSpike(10);
        pushBlock(62, 40, 34);
    } else if (p === 5) {
        pushBlock(8, 34, 24);
        pushBlock(62, 34, 30);
    } else if (p === 6) {
        pushSpike(12);
        pushBlock(58, 34, 28);
        pushSpike(108);
    } else if (p === 7) {
        pushBlock(12, 48, 32);
    } else if (p === 8) {
        pushSpike(8);
        pushSpike(40);
        pushBlock(82, 36, 28);
    } else if (p === 9) {
        pushBlock(10, 36, 28);
        pushSpike(62);
        pushSpike(94);
    } else if (p === 10) {
        pushSpike(12, 24);
        pushBlock(72, 44, 36);
    } else {
        pushBlock(10, 34, 24);
        pushSpike(58);
        pushBlock(96, 34, 30);
    }
}

function ensureEndlessRobot() {
    if (gdVehicle !== "robot") return;
    let farthest = 0;
    for (let o of gdObstacles) farthest = max(farthest, o.x + (o.w || 0));
    const target = gdPortalTargetX > 0 ? gdPortalTargetX : gdScroll + sirina * 2.5;
    let index = max(0, floor(farthest / 145));
    let safety = 0;
    while (farthest < target && safety++ < 18) {
        addRobotSection(farthest, index);
        // Razmaki so bolj enakomerni: brez velikih praznin in brez micro-clickov.
        const sectionGap = [150, 155, 145, 160, 150, 140][index % 6];
        farthest += sectionGap;
        index++;
    }
}

function ensureEndlessUFO() {
    if (gdVehicle !== "ufo") return;
    let farthest = 0;
    for (let o of gdObstacles) farthest = max(farthest, o.x + (o.w || 0));
    const target = gdPortalTargetX > 0 ? gdPortalTargetX : gdScroll + sirina * 2.5;
    let index = max(0, floor(farthest / 145));
    let safety = 0;
    const mid = (gdGroundY + gdCeilY) / 2;
    while (farthest < target && safety++ < 16) {
        addSwingSection(farthest, mid, index);
        farthest += 145;
        index++;
    }
}

function ensureEndlessShip() {
    if (gdVehicle !== "ship") return;
    let farthest = 0;
    for (let o of gdObstacles) {
        farthest = max(farthest, o.x + (o.w || 0));
    }
    const target = gdPortalTargetX > 0 ? gdPortalTargetX : gdScroll + sirina * 2.5;
    let index = max(0, floor(farthest / 110));
    let safety = 0;
    const mid = (gdGroundY + gdCeilY) / 2;
    while (farthest < target && safety++ < 16) {
        const x = farthest;
        addShipSection(x, mid, index);
        farthest = x + 110;
        index++;
    }
}


function addSpiderSection(x, index) {
    // Progressive difficulty: early = single tele lessons, late = rapid tele chains + walls
    const g = gdGroundY;
    const top = gdCeilY;
    const tier = min(4, floor(index / 8)); // 0..4 as you go further
    // Mix pattern by index + tier so it doesn't loop the same 6 forever
    const pattern = (index * 7 + tier * 3) % 14;

    if (pattern === 0) {
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
    } else if (pattern === 1) {
        gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 20, h: 20 });
    } else if (pattern === 2) {
        // ceiling wall — must stay floor
        gdObstacles.push({ type: "wall", x: x, y: top, w: 28, h: 100 + tier * 12 });
    } else if (pattern === 3) {
        // floor wall — must tele up before
        gdObstacles.push({ type: "wall", x: x, y: g - (110 + tier * 15), w: 28, h: 110 + tier * 15 });
    } else if (pattern === 4) {
        // tele pair
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 20, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: x + 110 - tier * 8, y: top, w: 20, h: 20 });
    } else if (pattern === 5) {
        gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 20, h: 20 });
        gdObstacles.push({ type: "spike", x: x + 115 - tier * 8, y: g - 20, w: 20, h: 20 });
    } else if (pattern === 6) {
        // double floor then tele
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 18, h: 20 });
        gdObstacles.push({ type: "spike", x: x + 40, y: g - 20, w: 18, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: x + 130 - tier * 10, y: top, w: 20, h: 20 });
    } else if (pattern === 7) {
        // wall sandwich: floor wall then ceiling wall
        gdObstacles.push({ type: "wall", x: x, y: g - 125, w: 26, h: 125 });
        gdObstacles.push({ type: "wall", x: x + 150 - tier * 10, y: top, w: 26, h: 120 });
    } else if (pattern === 8) {
        // triple tele rhythm
        const gap = 95 - tier * 6;
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 18, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: x + gap, y: top, w: 18, h: 20 });
        gdObstacles.push({ type: "spike", x: x + gap * 2, y: g - 20, w: 18, h: 20 });
    } else if (pattern === 9) {
        // tall floor wall + ceiling spike after
        gdObstacles.push({ type: "wall", x: x, y: g - 150, w: 30, h: 150 });
        gdObstacles.push({ type: "spikeDown", x: x + 90, y: top, w: 20, h: 20 });
        gdObstacles.push({ type: "spike", x: x + 200 - tier * 12, y: g - 20, w: 20, h: 20 });
    } else if (pattern === 10) {
        // dense late-game: alternating spikes tight
        const gap = max(70, 100 - tier * 8);
        for (let k = 0; k < 2 + min(2, tier); k++) {
            if (k % 2 === 0) gdObstacles.push({ type: "spike", x: x + k * gap, y: g - 20, w: 18, h: 20 });
            else gdObstacles.push({ type: "spikeDown", x: x + k * gap, y: top, w: 18, h: 20 });
        }
    } else if (pattern === 11) {
        // mid pillar wall (blocks both if wrong surface? only mid height)
        const mid = (g + top) / 2;
        gdObstacles.push({ type: "wall", x: x, y: mid - 50, w: 32, h: 100 });
        gdObstacles.push({ type: "spike", x: x - 50, y: g - 20, w: 18, h: 20 });
        gdObstacles.push({ type: "spikeDown", x: x + 60, y: top, w: 18, h: 20 });
    } else if (pattern === 12) {
        // recovery light
        if (tier >= 2) gdObstacles.push({ type: "spike", x: x + 40, y: g - 20, w: 18, h: 20 });
    } else {
        // late combo wall + tele
        gdObstacles.push({ type: "spike", x: x, y: g - 20, w: 18, h: 20 });
        gdObstacles.push({ type: "wall", x: x + 90, y: top, w: 26, h: 115 });
        gdObstacles.push({ type: "spikeDown", x: x + 160, y: top, w: 18, h: 20 });
        gdObstacles.push({ type: "spike", x: x + 250 - tier * 10, y: g - 20, w: 18, h: 20 });
    }
}

function ensureEndlessSpider() {
    if (gdVehicle !== "spider") return;
    let farthest = 0;
    for (let o of gdObstacles) farthest = max(farthest, o.x + (o.w || 0));
    const target = gdPortalTargetX > 0 ? gdPortalTargetX : gdScroll + sirina * 3.2;
    let index = max(0, floor(farthest / 200));
    let safety = 0;
    while (farthest < target && safety++ < 16) {
        const tier = min(4, floor(index / 8));
        const spacing = max(160, 240 - tier * 15); // tighter as difficulty rises
        const x = farthest + 60;
        addSpiderSection(x, index++);
        farthest = x + spacing;
    }
}

function addMiniSection(x, index) {
    const g = gdGroundY;
    const top = gdCeilY;
    const tier = min(4, floor(index / 7));
    const pattern = (index * 5 + tier * 2) % 12;

    if (pattern === 0) {
        gdObstacles.push({ type: "spike", x: x, y: g - 14, w: 14, h: 14 });
    } else if (pattern === 1) {
        gdObstacles.push({ type: "block", x: x, y: g - 16, w: 26, h: 16 });
    } else if (pattern === 2) {
        gdObstacles.push({ type: "spike", x: x, y: g - 14, w: 14, h: 14 });
        gdObstacles.push({ type: "spike", x: x + 48 - tier * 3, y: g - 14, w: 14, h: 14 });
    } else if (pattern === 3) {
        // stairs (jumpable for mini if careful)
        gdObstacles.push({ type: "block", x: x, y: g - 16, w: 24, h: 16 });
        gdObstacles.push({ type: "block", x: x + 28, y: g - 28, w: 24, h: 28 });
        if (tier >= 2) gdObstacles.push({ type: "spike", x: x + 70, y: g - 14, w: 14, h: 14 });
    } else if (pattern === 4) {
        gdObstacles.push({ type: "padYellow", x: x, y: g - 12, w: 28, h: 12 });
        gdObstacles.push({ type: "spike", x: x + 75, y: g - 14, w: 14, h: 14 });
        if (tier >= 1) gdObstacles.push({ type: "spike", x: x + 110, y: g - 14, w: 14, h: 14 });
    } else if (pattern === 5) {
        gdObstacles.push({ type: "gap", x: x, y: g, w: 32 + tier * 4, h: 28 });
        gdObstacles.push({ type: "spike", x: x + 70, y: g - 14, w: 14, h: 14 });
    } else if (pattern === 6) {
        // triple spikes with shrinking gaps
        const gap = max(38, 55 - tier * 4);
        for (let k = 0; k < 3; k++)
            gdObstacles.push({ type: "spike", x: x + k * gap, y: g - 14, w: 13, h: 14 });
    } else if (pattern === 7) {
        gdObstacles.push({ type: "block", x: x, y: g - 18, w: 28, h: 18 });
        gdObstacles.push({ type: "orbYellow", x: x + 55, y: g - 55, w: 18, h: 18 });
        gdObstacles.push({ type: "spike", x: x + 100, y: g - 14, w: 14, h: 14 });
    } else if (pattern === 8) {
        // low ceiling pressure via spikeDown + floor spike
        gdObstacles.push({ type: "spike", x: x, y: g - 14, w: 14, h: 14 });
        gdObstacles.push({ type: "spikeDown", x: x + 60, y: top, w: 16, h: 16 });
    } else if (pattern === 9) {
        gdObstacles.push({ type: "block", x: x, y: g - 22, w: 32, h: 22 });
        gdObstacles.push({ type: "block", x: x + 40, y: g - 36, w: 28, h: 36 });
        gdObstacles.push({ type: "spike", x: x + 90, y: g - 14, w: 14, h: 14 });
    } else if (pattern === 10) {
        // recovery — sometimes still a single spike at high tier
        if (tier >= 3) gdObstacles.push({ type: "spike", x: x + 30, y: g - 14, w: 14, h: 14 });
    } else {
        // dense pack late
        const gap = max(36, 50 - tier * 3);
        gdObstacles.push({ type: "block", x: x, y: g - 16, w: 22, h: 16 });
        gdObstacles.push({ type: "spike", x: x + gap, y: g - 14, w: 13, h: 14 });
        gdObstacles.push({ type: "spike", x: x + gap * 2, y: g - 14, w: 13, h: 14 });
        if (tier >= 2) gdObstacles.push({ type: "spike", x: x + gap * 3, y: g - 14, w: 13, h: 14 });
    }
}

function ensureEndlessMini() {
    if (gdVehicle !== "mini") return;
    let farthest = 0;
    for (let o of gdObstacles) farthest = max(farthest, o.x + (o.w || 0));
    const target = gdPortalTargetX > 0 ? gdPortalTargetX : gdScroll + sirina * 3.2;
    let index = max(0, floor(farthest / 170));
    let safety = 0;
    while (farthest < target && safety++ < 16) {
        const tier = min(4, floor(index / 7));
        const spacing = max(140, 210 - tier * 12);
        const x = farthest + 50;
        addMiniSection(x, index++);
        farthest = x + spacing;
    }
}

function addDartSection(x, mid, index) {
    const g = gdGroundY;
    const top = gdCeilY;
    // Cap tier so late game stays tight but always has a flyable gap (>= 58px)
    const tier = min(2, floor(index / 10));
    const pattern = (index * 11 + tier * 5) % 10;
    const gap = max(58, 88 - tier * 10); // never thinner than dart body + margin

    if (pattern === 0) {
        gdObstacles.push({ type: "block", x: x, y: top + 6, w: 28, h: mid - top - gap / 2 - 6 });
        gdObstacles.push({ type: "block", x: x, y: mid + gap / 2, w: 28, h: g - mid - gap / 2 - 6 });
    } else if (pattern === 1) {
        gdObstacles.push({ type: "block", x: x, y: top + 6, w: 28, h: 75 + tier * 8 });
    } else if (pattern === 2) {
        gdObstacles.push({ type: "block", x: x, y: g - (85 + tier * 10), w: 28, h: 85 + tier * 10 });
    } else if (pattern === 3) {
        // offset gates with horizontal gap to react
        gdObstacles.push({ type: "block", x: x, y: top + 6, w: 26, h: mid - top - 28 });
        gdObstacles.push({ type: "block", x: x + 110, y: mid + 15, w: 26, h: g - mid - 22 });
    } else if (pattern === 4) {
        gdObstacles.push({ type: "spike", x: x, y: g - 18, w: 16, h: 18 });
        gdObstacles.push({ type: "spikeDown", x: x + 70, y: top, w: 16, h: 18 });
    } else if (pattern === 5) {
        const ng = max(58, 72 - tier * 6);
        gdObstacles.push({ type: "block", x: x, y: top + 4, w: 30, h: mid - top - ng / 2 - 4 });
        gdObstacles.push({ type: "block", x: x, y: mid + ng / 2, w: 30, h: g - mid - ng / 2 - 4 });
    } else if (pattern === 6) {
        // staggered single blocks — always a path
        gdObstacles.push({ type: "block", x: x, y: top + 8, w: 26, h: 85 });
        gdObstacles.push({ type: "block", x: x + 120, y: g - 95, w: 26, h: 95 });
    } else if (pattern === 7) {
        // recovery
    } else if (pattern === 8) {
        gdObstacles.push({ type: "spikeDown", x: x, y: top, w: 16, h: 18 });
        gdObstacles.push({ type: "spike", x: x + 90, y: g - 18, w: 16, h: 18 });
    } else {
        const ng = max(58, 70 - tier * 5);
        gdObstacles.push({ type: "block", x: x, y: top + 4, w: 28, h: mid - top - ng / 2 - 4 });
        gdObstacles.push({ type: "block", x: x, y: mid + ng / 2, w: 28, h: g - mid - ng / 2 - 4 });
        gdObstacles.push({ type: "spike", x: x + 70, y: g - 16, w: 14, h: 16 });
    }
}

function ensureEndlessDart() {
    if (gdVehicle !== "dart") return;
    let farthest = 0;
    for (let o of gdObstacles) farthest = max(farthest, o.x + (o.w || 0));
    const target = gdPortalTargetX > 0 ? gdPortalTargetX : gdScroll + sirina * 3.2;
    let index = max(0, floor(farthest / 180));
    let safety = 0;
    const mid = (gdGroundY + gdCeilY) / 2;
    while (farthest < target && safety++ < 16) {
        const tier = min(2, floor(index / 10));
        const spacing = max(160, 210 - tier * 12);
        const x = farthest + 70;
        addDartSection(x, mid, index++);
        farthest = x + spacing;
    }
}

function gdHold() {
    if (gdAIPilot) return gdAIHold;
    return keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32) || mouseIsPressed;
}

function gdAIObstacleAt(screenX, types) {
    let best = null, bestD = Infinity;
    for (const o of gdObstacles) {
        if (!types.includes(o.type)) continue;
        const sx = o.x - gdScroll;
        const d = sx - screenX;
        if (d >= -25 && d < bestD) { best = o; bestD = d; }
    }
    return best;
}

function gdAICorridorAt(worldX) {
    let best = null;
    for (const o of gdObstacles) {
        if (o.type !== "waveSlope") continue;
        if (worldX >= o.x - 8 && worldX <= o.x + o.w + 8) { best = o; break; }
    }
    return best;
}

function gdAIUpcomingHazards(worldX, lookAhead=300) {
    return gdObstacles.filter(o => {
        if (!["spike", "spikeDown", "hazard", "block", "gap", "swingGate"].includes(o.type)) return false;
        const right = o.x + (o.w || 20);
        return right > worldX + 6 && o.x < worldX + lookAhead;
    }).sort((a,b) => a.x - b.x);
}

function gdAIChooseHazard(worldX) {
    const list = gdAIUpcomingHazards(worldX, 330);
    // A spike gets priority over scenery/platforms.
    return list.find(o => ["spike", "spikeDown", "hazard"].includes(o.type)) || list[0] || null;
}

function gdAIUpcomingHazards(worldX, lookAhead=420) {
    return gdObstacles.filter(o => {
        if (!["spike", "spikeDown", "hazard", "block", "gap", "swingGate"].includes(o.type)) return false;
        const right = o.x + (o.w || 20);
        return right > worldX + 4 && o.x < worldX + lookAhead;
    }).sort((a,b) => a.x - b.x);
}

function gdAINextHazard(worldX, types=null, lookAhead=420) {
    const list = gdAIUpcomingHazards(worldX, lookAhead);
    if (!types) return list[0] || null;
    return list.find(o => types.includes(o.type)) || null;
}

function gdAIHazardDistance(o, worldX) {
    return o ? o.x - worldX : Infinity;
}

function gdAIFlipSwingForGate(gate, worldX) {
    if (!gate) return false;
    const cx = gdCube.x + gdCube.w * 0.5;
    const cy = gdCube.y + gdCube.h * 0.5;
    const dx = max(25, gate.x - worldX);
    const t = constrain(dx / max(0.1, gdSpeed), 3, 42);
    const gravity = 0.43;
    const safeTop = gate.top + 10;
    const safeBottom = gate.bottom - 10;
    const predict = dir => cy + gdCube.vy * t + 0.5 * gravity * dir * t * t;
    const downY = predict(1);
    const upY = predict(-1);
    const downOK = downY > safeTop && downY < safeBottom;
    const upOK = upY > safeTop && upY < safeBottom;
    if (gdSwingDir === 1 && downOK) return false;
    if (gdSwingDir === -1 && upOK) return false;
    if (upOK && !downOK) return gdSwingDir !== -1;
    if (downOK && !upOK) return gdSwingDir !== 1;
    const center = (safeTop + safeBottom) * 0.5;
    return abs(upY - center) < abs(downY - center) ? gdSwingDir !== -1 : gdSwingDir !== 1;
}

function gdAIProfileTuning() {
    // Profiles change actual control policy.
    // Learning uses level + bias + a CYCLING strategy near past death marks
    // so it does not keep repeating the exact same failing timing.
    if (aiLabProfile === 0) return { look: 1.35, early: 1.40, margin: 30, cooldown: 1.30, predict: 1.15, jumpBase: 215, flipCd: 15, ufoCd: 19, stratJump: 0, stratMid: 0 };
    if (aiLabProfile === 1) return { look: 0.72, early: 0.72, margin: 7, cooldown: 0.68, predict: 0.72, jumpBase: 125, flipCd: 8, ufoCd: 10, stratJump: 0, stratMid: 0 };
    if (aiLabProfile === 2) return { look: 1.75, early: 1.15, margin: 4, cooldown: 0.92, predict: 1.65, jumpBase: 210, flipCd: 16, ufoCd: 20, stratJump: 0, stratMid: 0 };

    const levels = aiLearningStats.learningLevel || {};
    const level = constrain(Number(levels[gdVehicle] || 0), 0, 25);
    const bias = (aiLearningStats.bias && aiLearningStats.bias[gdVehicle]) || 0;
    const adapt = constrain(0.3 + level * 0.08, 0, 1.8);
    let stratJump = 0, stratMid = 0, stratLabel = null;
    if (gdCube) {
        const wx = gdScroll + gdCube.x;
        const s = gdAIStrategyOffset(wx);
        stratJump = s.jump;
        stratMid = s.midAir;
        stratLabel = s.label;
    }
    return {
        look: 1.30 + adapt * 0.75,
        early: 1.05,
        margin: 18 + adapt * 32,
        cooldown: max(0.4, 1.0 - adapt * 0.28),
        predict: 1.25 + adapt * 0.85,
        jumpBase: constrain(180 + bias * 0.8 + adapt * 28 + stratJump, 80, 340),
        flipCd: constrain(12 + level * 0.55, 9, 26),
        ufoCd: constrain(14 + level * 0.45, 10, 28),
        stratJump,
        stratMid,
        stratLabel
    };
}

function updateGDAI() {
    gdAIHold = false;
    gdAIBallTap = false;
    if (!gdAIPilot || !gdCube || gameOver || gdWon) return;
    // AI allowed only for ship & wave
    if (gdVehicle !== "ship" && gdVehicle !== "wave") { gdAIPilot = false; gdAIHold = false; return; }
    gdStarted = true;

    const _savedVehicle = gdVehicle;
    if (gdVehicle === "mini") gdVehicle = "cube";
    else if (gdVehicle === "spider") gdVehicle = "swing";
    else if (gdVehicle === "dart") gdVehicle = "ship";
    try {

    const tune = gdAIProfileTuning();
    const px = gdCube.x + gdCube.w * 0.5;
    const worldX = gdScroll + px;
    const look = 600 * (tune.look || 1);
    const hazards = gdAIUpcomingHazards(worldX, look);
    const floorHazards = hazards.filter(o => o.type === "spike" || o.type === "gap" || o.type === "block");
    const ceilingHazards = hazards.filter(o => o.type === "spikeDown");
    const nextFloor = floorHazards[0] || null;
    const nextCeil = ceilingHazards[0] || null;
    const midY = (gdCeilY + gdGroundY) * 0.5;

    // ===== WAVE: corridor follower (already solid) =====
    if (gdVehicle === "wave") {
        const gates = gdObstacles.filter(o =>
            o.type === "waveSlope" && o.x + o.w > worldX + 8 && o.x < worldX + 420 * (tune.look || 1)
        ).sort((a, b) => a.x - b.x);
        let target = midY - gdCube.h * 0.5;
        if (gates.length) {
            const g = gates[0];
            const sampleX = worldX + min(180, max(55, g.x + g.w - worldX));
            const t = constrain((sampleX - g.x) / max(1, g.w), 0, 1);
            target = (lerp(g.top1, g.top2, t) + lerp(g.bottom1, g.bottom2, t)) * 0.5 - gdCube.h * 0.5;
        }
        const margin = max(6, (tune.margin || 16) * 0.35);
        gdAIHold = gdCube.y > target + margin;
        if (abs(gdCube.y - target) < margin) gdAIHold = gdCube.y > target;
        return;
    }

    // ===== CUBE =====
    // Jump when a floor threat is in the jump window. Hold through the approach
    // so the first frames of contact with ground still trigger the jump.
    if (gdVehicle === "cube") {
        const speed = gdSpeed || 5.0;
        // Physics: vy0=-10.5, g=0.52 → airtime ~40 frames ≈ 200px at speed 5
        let jumpDist = 155;
        if (aiLabProfile === 0) jumpDist = 205;
        else if (aiLabProfile === 1) jumpDist = 110;
        else if (aiLabProfile === 2) jumpDist = 175;
        jumpDist = constrain(jumpDist + (tune.stratJump || 0) * 0.7, 80, 300);

        const threat = floorHazards.find(h => {
            const d = h.x - worldX;
            if (d < -20 || d > jumpDist + 80) return false;
            // Low blocks can be walked onto — only jump tall ones or spikes/gaps
            if (h.type === "block" && (h.h || 28) <= 30) return false;
            return true;
        });

        if (gdCube.onGround && threat) {
            const d = threat.x - worldX;
            const earlyPad = (aiLabProfile === 0) ? 25 : 0;
            if (d > 0 && d < jumpDist + earlyPad) gdAIHold = true;
        }
        // Keep hold in air near the next threat so we re-jump on landing
        if (!gdCube.onGround) {
            const near = floorHazards.some(h => {
                const d = h.x - worldX;
                return d > -30 && d < 160 + (tune.stratMid || 0);
            });
            if (near || gdCube.vy < 2) gdAIHold = true;
        }
        // Learning: if we died here early, try later jump (and vice versa)
        if (aiLabProfile === 3 && gdCube.onGround && threat) {
            const marks = (aiLearningStats.deathMarks && aiLearningStats.deathMarks.cube) || [];
            for (let m of marks) {
                const mx = (m && m.x != null) ? m.x : m;
                if (abs(worldX - mx) < 140) {
                    const strat = (m.strategy || 0) % 8;
                    const windows = [
                        jumpDist + 70, jumpDist + 40, jumpDist + 15, jumpDist,
                        jumpDist - 25, jumpDist - 50, jumpDist - 75, jumpDist + 55
                    ];
                    const w = max(65, windows[strat]);
                    const d = threat.x - worldX;
                    gdAIHold = d > 0 && d < w;
                }
            }
        }
        return;
    }

    // ===== ROBOT =====
    // Variable-height jump: start early, HOLD while rising until clear of blocks.
    if (gdVehicle === "robot") {
        let trigger = 200;
        if (aiLabProfile === 0) trigger = 245;
        else if (aiLabProfile === 1) trigger = 130;
        else if (aiLabProfile === 2) trigger = 240;
        trigger = constrain(trigger + (tune.stratJump || 0) * 0.8, 80, 340);

        const o = floorHazards.find(h => h.type === "spike" || h.type === "block" || h.type === "gap");
        if (o) {
            const d = o.x - worldX;
            if (gdCube.onGround && d > -5 && d < trigger) gdAIHold = true;
            // Hold longer for taller blocks
            const needHigh = o.type === "block" && (o.h || 28) > 28;
            const holdReach = needHigh ? 160 : 110;
            if (gdRobotJumping && d > -70 && d < holdReach + (tune.stratMid || 0)) gdAIHold = true;
            if (gdRobotJumping && needHigh && gdCube.y + gdCube.h > o.y - 6 && gdCube.vy < 0) {
                gdAIHold = true;
            }
        }
        // Learning strategy shifts trigger
        if (aiLabProfile === 3 && o && gdCube.onGround) {
            const marks = (aiLearningStats.deathMarks && aiLearningStats.deathMarks.robot) || [];
            for (let m of marks) {
                const mx = (m && m.x != null) ? m.x : m;
                if (abs(worldX - mx) < 140) {
                    const strat = (m.strategy || 0) % 8;
                    const windows = [
                        trigger + 80, trigger + 45, trigger + 15, trigger,
                        trigger - 30, trigger - 55, trigger - 85, trigger + 60
                    ];
                    const w = max(65, windows[strat]);
                    const d = o.x - worldX;
                    gdAIHold = d > 0 && d < w;
                }
            }
        }
        return;
    }

    // ===== SHIP =====
    // Simulate hold vs release for the next ~24 frames and pick the safer input.
    if (gdVehicle === "ship") {
        const cy = gdCube.y + gdCube.h * 0.5;
        const horizon = (aiLabProfile === 0) ? 30 : 26;
        const speed = gdSpeed || 5.4;

        const simulate = (hold) => {
            let y = gdCube.y, vy = gdCube.vy || 0;
            let hit = false, minClear = 9999;
            for (let i = 0; i < horizon; i++) {
                if (hold) vy -= 0.95; else vy += 0.34;
                vy = constrain(vy, -10.5, 5.6);
                y += vy;
                if (y < gdCeilY) { y = gdCeilY; vy = 0; }
                if (y + gdCube.h > gdGroundY) { y = gdGroundY - gdCube.h; vy = 0; }
                const wx = worldX + speed * i;
                const sx = gdCube.x; // player screen x fixed
                for (let o of gdObstacles) {
                    if (!["spike", "spikeDown", "hazard"].includes(o.type)) continue;
                    const ox = o.x - (gdScroll + speed * i); // obstacle screen x after i frames
                    // World-space overlap: player world x advances with scroll
                    const pwx = worldX + speed * i;
                    if (o.x + (o.w || 20) < pwx - 10 || o.x > pwx + gdCube.w + 10) continue;
                    // AABB in world y
                    if (y + 3 < o.y + (o.h || 20) - 2 && y + gdCube.h - 3 > o.y + 2) {
                        hit = true;
                        break;
                    }
                    // clearance to this obstacle
                    const oMid = o.y + (o.h || 20) * 0.5;
                    const clear = abs((y + gdCube.h * 0.5) - oMid) - ((o.h || 20) * 0.5 + gdCube.h * 0.5);
                    if (clear < minClear) minClear = clear;
                }
                if (hit) return { hit: true, frame: i, y, minClear: -100 };
            }
            return { hit: false, frame: horizon, y, minClear };
        };

        const up = simulate(true);
        const down = simulate(false);

        // Prefer the action that survives longer / more clearance
        let chooseHold;
        if (up.hit && !down.hit) chooseHold = false;
        else if (!up.hit && down.hit) chooseHold = true;
        else if (up.hit && down.hit) chooseHold = up.frame >= down.frame; // delay death
        else chooseHold = up.minClear >= down.minClear;

        // Bias toward corridor center if both safe
        if (!up.hit && !down.hit) {
            const target = midY;
            if (abs(cy - target) > 18) chooseHold = cy > target;
        }

        // Learning: if we died near here going a certain way, prefer the other
        if (aiLabProfile === 3) {
            const marks = (aiLearningStats.deathMarks && aiLearningStats.deathMarks.ship) || [];
            for (let m of marks) {
                const mx = (m && m.x != null) ? m.x : m;
                if (abs(worldX - mx) < 150 && m.deathY != null) {
                    // push away from death altitude
                    if (m.deathY < midY) chooseHold = true;
                    else chooseHold = false;
                }
            }
        }

        gdAIHold = chooseHold;
        return;
    }

    // ===== SWING =====
    // Simulate flip vs no-flip like the ship AI; also ease early mid-hazards in level gen.
    if (gdVehicle === "swing") {
        gdAISwingCooldown = max(0, gdAISwingCooldown - 1);
        if (gdAISwingCooldown > 0) return;

        const cd = max(10, floor(tune.flipCd || 12));
        const cy = gdCube.y + gdCube.h * 0.5;
        const speed = gdSpeed || 5.9;
        const horizon = (aiLabProfile === 0) ? 28 : 22;

        const simulate = (doFlip) => {
            let y = gdCube.y, vy = gdCube.vy || 0;
            let dir = gdSwingDir * (doFlip ? -1 : 1);
            let hit = false, hitFrame = horizon;
            for (let i = 0; i < horizon; i++) {
                vy = constrain(vy + 0.43 * dir, -7, 7);
                y += vy;
                if (y < gdCeilY - 4 || y + gdCube.h > gdGroundY + 4) {
                    hit = true; hitFrame = i; break;
                }
                const pwx = worldX + speed * i;
                for (let o of gdObstacles) {
                    if (!["spike", "spikeDown", "hazard"].includes(o.type)) continue;
                    if (o.x + (o.w || 20) < pwx - 8 || o.x > pwx + gdCube.w + 8) continue;
                    if (y + 2 < o.y + (o.h || 20) - 2 && y + gdCube.h - 2 > o.y + 2) {
                        hit = true; hitFrame = i; break;
                    }
                }
                if (hit) break;
            }
            return { hit, hitFrame, y };
        };

        const stay = simulate(false);
        const flip = simulate(true);
        let shouldFlip = false;
        if (stay.hit && !flip.hit) shouldFlip = true;
        else if (!stay.hit && flip.hit) shouldFlip = false;
        else if (stay.hit && flip.hit) shouldFlip = flip.hitFrame > stay.hitFrame;
        else {
            // both safe: soft center
            const band = (aiLabProfile === 0) ? 55 : 80;
            if (gdSwingDir === 1 && cy > midY + band) shouldFlip = true;
            else if (gdSwingDir === -1 && cy < midY - band) shouldFlip = true;
        }

        // Learning: reverse preference near death mark
        if (aiLabProfile === 3) {
            const marks = (aiLearningStats.deathMarks && aiLearningStats.deathMarks.swing) || [];
            for (let m of marks) {
                const mx = (m && m.x != null) ? m.x : m;
                if (abs(worldX - mx) < 150 && stay.hit) shouldFlip = true;
            }
        }

        if (shouldFlip) {
            gdSwingInputQueued = true;
            gdAISwingCooldown = cd;
        }
        return;
    }

    // ===== UFO =====
    // Same obstacle language as ship. Simulate bounce vs coast.
    if (gdVehicle === "ufo") {
        gdAIUfoCooldown = max(0, gdAIUfoCooldown - 1);
        if (gdAIUfoCooldown > 0) return;

        const cd = max(10, floor(tune.ufoCd || 14));
        const speed = gdSpeed || 4.6;
        const horizon = (aiLabProfile === 0) ? 28 : 24;

        const simulate = (bounce) => {
            let y = gdCube.y, vy = gdCube.vy || 0;
            if (bounce) vy = -8.2;
            let hit = false, hitFrame = horizon, minClear = 999;
            for (let i = 0; i < horizon; i++) {
                vy += 0.48;
                if (vy > 11) vy = 11;
                y += vy;
                if (y < gdCeilY) { y = gdCeilY; if (vy < 0) vy = 0; }
                if (y + gdCube.h > gdGroundY) { y = gdGroundY - gdCube.h; if (vy > 0) vy = 0; }
                const pwx = worldX + speed * i;
                for (let o of gdObstacles) {
                    if (!["spike", "spikeDown", "hazard"].includes(o.type)) continue;
                    if (o.x + (o.w || 20) < pwx - 8 || o.x > pwx + gdCube.w + 8) continue;
                    if (y + 3 < o.y + (o.h || 20) - 2 && y + gdCube.h - 3 > o.y + 2) {
                        hit = true; hitFrame = i; break;
                    }
                    const oMid = o.y + (o.h || 20) * 0.5;
                    const clear = abs((y + gdCube.h * 0.5) - oMid) - ((o.h || 20) * 0.5 + gdCube.h * 0.5);
                    if (clear < minClear) minClear = clear;
                }
                if (hit) break;
            }
            return { hit, hitFrame, minClear, y };
        };

        const coast = simulate(false);
        const bounce = simulate(true);
        let need = false;
        if (coast.hit && !bounce.hit) need = true;
        else if (!coast.hit && bounce.hit) need = false;
        else if (coast.hit && bounce.hit) need = bounce.hitFrame > coast.hitFrame;
        else {
            // both safe: hover near mid, bounce if too low
            const cy = gdCube.y + gdCube.h * 0.5;
            if (cy > midY + 40 && gdCube.vy > 1) need = true;
            if (gdCube.y + gdCube.h > gdGroundY - 50) need = true;
        }

        // Don't bounce into ceiling spike
        if (nextCeil && nextCeil.x - worldX < 120 && gdCube.y < midY) need = false;
        if (gdCube.y < gdCeilY + 70) need = false;

        if (need) {
            gdAIHold = true;
            gdAIUfoCooldown = cd;
        }
        return;
    }

    // ===== BALL =====
    // Flip when the surface you're on becomes unsafe. Hold near orbs for buffer.
    if (gdVehicle === "ball") {
        const onFloor = gdBallGravity > 0;
        let trigger = 115;
        if (aiLabProfile === 0) trigger = 150;
        else if (aiLabProfile === 1) trigger = 80;
        else if (aiLabProfile === 2) trigger = 150;
        trigger = constrain(trigger + (tune.stratJump || 0) * 0.5, 50, 240);

        const floorSpike = hazards.find(o => o.type === "spike" || o.type === "gap");
        const ceilSpike = hazards.find(o => o.type === "spikeDown");

        if (onFloor && floorSpike) {
            const d = floorSpike.x - worldX;
            if (d > 5 && d < trigger) {
                gdAIBallTap = true;
                gdBallInputQueued = true;
            }
        }
        if (!onFloor && ceilSpike) {
            const d = ceilSpike.x - worldX;
            if (d > 5 && d < trigger) {
                gdAIBallTap = true;
                gdBallInputQueued = true;
            }
        }
        // Emergency close spike
        if (gdCube.onGround) {
            if (onFloor && floorSpike && floorSpike.x - worldX < 55) {
                gdAIBallTap = true; gdBallInputQueued = true;
            }
            if (!onFloor && ceilSpike && ceilSpike.x - worldX < 55) {
                gdAIBallTap = true; gdBallInputQueued = true;
            }
        }
        // Hold near orbs so buffer fires
        const nearOrb = gdObstacles.some(o => {
            if (o.type !== "orbBlue" && o.type !== "orbYellow") return false;
            const d = o.x - worldX;
            return d > -20 && d < 90;
        });
        if (nearOrb) gdAIHold = true;

        // Learning strategy window
        if (aiLabProfile === 3 && gdCube.onGround) {
            const marks = (aiLearningStats.deathMarks && aiLearningStats.deathMarks.ball) || [];
            for (let m of marks) {
                const mx = (m && m.x != null) ? m.x : m;
                if (abs(worldX - mx) < 140) {
                    const strat = (m.strategy || 0) % 8;
                    const windows = [
                        trigger + 55, trigger + 30, trigger + 10, trigger,
                        trigger - 20, trigger - 40, trigger - 60, trigger + 40
                    ];
                    const w = max(40, windows[strat]);
                    const threat = onFloor ? floorSpike : ceilSpike;
                    if (threat) {
                        const d = threat.x - worldX;
                        if (d > 5 && d < w) {
                            gdAIBallTap = true; gdBallInputQueued = true;
                        }
                    }
                }
            }
        }
        return;
    }

    } finally {
        gdVehicle = _savedVehicle;
    }
}



// Shared pad / orb reactions for all vehicles except wave.
// Yellow pad/orb = boost against gravity (or pad.facing).
// Blue pad/orb = flip gravity (or strong boost + flip for pad).

function gdCollectCoinsAndGoals() {
    if (!gdCube || gameOver || gdWon) return;
    for (let o of gdObstacles) {
        if (!o) continue;
        const sx = o.x - gdScroll;
        if (o.type === "secretCoin" && !o._collected) {
            if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) {
                o._collected = true;
                o.type = "secretCoinGot";
                kovanci += 50;
                localStorage.setItem("snakeCoins", kovanci);
                playCoinSound();
                spawnParticles(gdCube.x + gdCube.w / 2, gdCube.y + gdCube.h / 2, 10, color(255, 215, 0));
            }
        } else if (o.type === "goal") {
            if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) {
                gdFinish();
                return;
            }
        }
    }
}

function gdApplyPadOrbs(opts) {
    if (!gdCube || gameOver || gdWon) return;
    opts = opts || {};
    const input = opts.input != null ? opts.input : gdHold();
    // A held button may activate only the first orb it reaches. Release and
    // press again to activate another orb (same rule for keyboard and mouse).
    if (!input) gdOrbHoldConsumed = false;
    const primaryWave = (gdVehicle === "wave");
    const dualWave = (gdDual && gdVehicle2 === "wave");
    const gDir = gdGravityDir || 1;
    const g2 = (typeof gdGravityDir2 !== "undefined" && gdGravityDir2) ? gdGravityDir2 : -1;
    const boostY = opts.boostYellow != null ? opts.boostYellow : 15.5;
    const boostBlue = opts.boostBlue != null ? opts.boostBlue : 11.8;
    const orbY = opts.orbYellow != null ? opts.orbYellow : 13.5;
    const orbB = opts.orbBlue != null ? opts.orbBlue : 17.0;
    const boostPink = opts.boostPink != null ? opts.boostPink : 21.5;
    const orbP = opts.orbPink != null ? opts.orbPink : 16.5;

    for (let o of gdObstacles) {
        if (o.type !== "padYellow" && o.type !== "padBlue" && o.type !== "padPink" &&
            o.type !== "orbYellow" && o.type !== "orbBlue" && o.type !== "orbDash" &&
            o.type !== "orbPink" && o.type !== "orbBlueTrue" && o.type !== "orbBlack") continue;
        const sx = o.x - gdScroll;
        const hit1 = !primaryWave && rectsOverlap(gdCube.x - 3, gdCube.y - 3, gdCube.w + 6, gdCube.h + 6,
            sx - 4, o.y - 4, o.w + 8, o.h + 8);
        const hit2 = gdDual && gdCube2 && !dualWave &&
            rectsOverlap(gdCube2.x - 3, gdCube2.y - 3, gdCube2.w + 6, gdCube2.h + 6,
                sx - 4, o.y - 4, o.w + 8, o.h + 8);
        const orbPressAvailable = input && !gdOrbHoldConsumed;
        const facing = (o.facing != null) ? o.facing : 1;

        if (!hit1 && !hit2) {
            o._padTouching = false;
            o._padTouching2 = false;
            // Orbs: only re-arm on leave if multi-activate is ON (real GD default = once)
            if (multiActivateOrbs) {
                o._orbUsed = false;
                o._orbUsed2 = false;
                o._dashUsed = false;
                o._dashUsed2 = false;
            }
            continue;
        }

        // --- PADS: facing + axis from editor ROT (0/180 = Y, 90/270 = X) ---
        if (o.type === "padPink" || o.type === "padYellow" || o.type === "padBlue") {
            const axis = o.axis || "y";
            if (hit1 && !o._padTouching) {
                o._padTouching = true;
                if (o.type === "padBlue") {
                    applyGravityDir(-gDir);
                } else if (axis === "x") {
                    const boost = o.type === "padPink" ? 18 : 12;
                    gdScroll = Math.max(0, gdScroll + facing * boost * 3);
                    gdCube.vy = -Math.abs(gDir) * 6;
                    spawnParticles(gdCube.x + gdCube.w / 2, gdCube.y + gdCube.h / 2, 10, color(255, 200, 40));
                } else {
                    const boost = o.type === "padPink" ? boostPink : boostY;
                    const launch = (facing > 0) ? -gDir : gDir;
                    gdCube.vy = launch * boost;
                }
                gdCube.onGround = false;
                playJumpSound();
            } else if (!hit1) {
                o._padTouching = false;
            }
            if (hit2 && !o._padTouching2) {
                o._padTouching2 = true;
                if (o.type === "padBlue") {
                    gdGravityDir2 = -g2;
                    gdCube2.vy = -gdCube2.vy;
                    if (Math.abs(gdCube2.vy) < 2) gdCube2.vy = gdGravityDir2 * 4;
                } else if (axis === "x") {
                    const boost = o.type === "padPink" ? 18 : 12;
                    gdScroll = Math.max(0, gdScroll + facing * boost * 3);
                    gdCube2.vy = -Math.abs(g2) * 6;
                } else {
                    const boost = o.type === "padPink" ? boostPink : boostY;
                    const launch = (facing > 0) ? -g2 : g2;
                    gdCube2.vy = launch * boost;
                }
                gdCube2.onGround = false;
                playJumpSound();
            } else if (!hit2) {
                o._padTouching2 = false;
            }
            continue;
        }

        // --- ORBS: need click while overlapping; each icon independent ---
        if (o.type === "orbDash") {
            if (orbPressAvailable && hit1 && !o._dashUsed) {
                o._dashUsed = true;
                gdOrbHoldConsumed = true;
                if (!gdDashing) {
                    gdDashing = true;
                    gdDashTimer = 0;
                    playJumpSound();
                    spawnParticles(gdCube.x + gdCube.w / 2, gdCube.y + gdCube.h / 2, 8, color(40, 255, 100));
                }
            }
            if (orbPressAvailable && hit2 && !o._dashUsed2) {
                o._dashUsed2 = true;
                gdOrbHoldConsumed = true;
                if (!gdDashing) {
                    gdDashing = true;
                    gdDashTimer = 0;
                    playJumpSound();
                    if (gdCube2) spawnParticles(gdCube2.x + gdCube2.w / 2, gdCube2.y + gdCube2.h / 2, 8, color(40, 255, 100));
                }
            }
            continue;
        }

        if (o.type === "orbPink" || o.type === "orbYellow" || o.type === "orbBlue"
            || o.type === "orbBlueTrue" || o.type === "orbBlack") {
            if (!orbPressAvailable) continue;
            // primary and secondary can both react to the same press in dual mode.
            let activatedThisOrb = false;
            if (hit1 && !o._orbUsed) {
                o._orbUsed = true;
                activatedThisOrb = true;
                // facing/axis from editor ROT: 180 inverts boost, 90/270 = horizontal
                const of = (o.facing != null) ? o.facing : 1;
                const oaxis = o.axis || "y";
                if (o.type === "orbBlue") {
                    // GREEN: flip gravity + boost (boost dir respects facing)
                    const newDir = -gDir;
                    applyGravityDir(newDir);
                    if (oaxis === "x") gdScroll = Math.max(0, gdScroll + of * 20);
                    else gdCube.vy = -newDir * of * orbB;
                } else if (o.type === "orbBlueTrue") {
                    applyGravityDir(-gDir);
                } else if (o.type === "orbBlack") {
                    if (oaxis === "x") gdScroll = Math.max(0, gdScroll + of * 25);
                    else gdCube.vy = gDir * of * 22;
                } else if (o.type === "orbPink") {
                    if (oaxis === "x") gdScroll = Math.max(0, gdScroll + of * 22);
                    else gdCube.vy = -gDir * of * orbP;
                } else {
                    // yellow
                    if (oaxis === "x") gdScroll = Math.max(0, gdScroll + of * 18);
                    else gdCube.vy = -gDir * of * orbY;
                }
                gdCube.onGround = false;
                playJumpSound();
            }
            if (hit2 && !o._orbUsed2) {
                o._orbUsed2 = true;
                activatedThisOrb = true;
                const of2 = (o.facing != null) ? o.facing : 1;
                const oaxis2 = o.axis || "y";
                if (o.type === "orbBlue") {
                    gdGravityDir2 = -g2;
                    if (oaxis2 === "x") gdScroll = Math.max(0, gdScroll + of2 * 20);
                    else gdCube2.vy = -gdGravityDir2 * of2 * orbB;
                } else if (o.type === "orbBlueTrue") {
                    gdGravityDir2 = -g2;
                    gdCube2.vy = -gdCube2.vy;
                    if (Math.abs(gdCube2.vy) < 2) gdCube2.vy = gdGravityDir2 * 4;
                } else if (o.type === "orbBlack") {
                    if (oaxis2 === "x") gdScroll = Math.max(0, gdScroll + of2 * 25);
                    else gdCube2.vy = g2 * of2 * 22;
                } else if (o.type === "orbPink") {
                    if (oaxis2 === "x") gdScroll = Math.max(0, gdScroll + of2 * 22);
                    else gdCube2.vy = -g2 * of2 * orbP;
                } else {
                    if (oaxis2 === "x") gdScroll = Math.max(0, gdScroll + of2 * 18);
                    else gdCube2.vy = -g2 * of2 * orbY;
                }
                gdCube2.onGround = false;
                playJumpSound();
            }
            if (activatedThisOrb) gdOrbHoldConsumed = true;
        }
    }


    // Active dash: straight horizontal flight while holding
    if (gdDashing) {
        if (!input) {
            gdDashing = false;
            gdDashTimer = 0;
        } else {
            gdDashTimer++;
            gdCube.vy = 0; // lock vertical — straight line
            gdCube.onGround = false;
            // slight forward feel via temporary speed bump handled in update via gdDashing
            gdCube.y = constrain(gdCube.y, gdCeilY + 1, gdGroundY - gdCube.h - 1);
        }
    }
}

function applyPlayerSize(cube, scale) {
    if (!cube) return;
    // scale is absolute size factor (GD_SIZE_MINI / GD_SIZE_NORMAL), not stacked
    const newS = gdVehicleBaseSize(gdVehicle) * scale;
    const cx = cube.x + cube.w / 2;
    const cy = cube.y + cube.h / 2;
    cube.w = newS;
    cube.h = newS;
    cube.x = cx - newS / 2;
    cube.y = cy - newS / 2;
}

function gdApplySpecialPortals() {
    if (!gdCube || gameOver || gdWon) return;
    for (let o of gdObstacles) {
        if (o.type !== "portalDual" && o.type !== "sizePortal" && o.type !== "endDual") continue;
        const sx = o.x - gdScroll;
        const hit1 = gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h);
        const hit2 = gdDual && gdCube2 && gdPlayerRectOverlap(gdCube2, sx, o.y, o.w, o.h);
        if (!hit1 && !hit2) {
            o._inside = false; o._in1 = false; o._in2 = false;
            continue;
        }
        if (o.type === "sizePortal") {
            if (hit1 && !o._in1) {
                o._in1 = true;
                playPortalSound();
                gdPlayerSize = o.size === "mini" ? GD_SIZE_MINI : GD_SIZE_NORMAL;
                const ns = gdVehicleSize(gdVehicle, gdPlayerSize);
                const cx = gdCube.x + gdCube.w / 2, cy = gdCube.y + gdCube.h / 2;
                gdCube.w = ns; gdCube.h = ns; gdCube.x = cx - ns / 2; gdCube.y = cy - ns / 2;
                spawnParticles(cx, cy, 10, color(180, 120, 255));
            }
            if (hit2 && !o._in2) {
                o._in2 = true;
                gdPlayerSize2 = o.size === "mini" ? GD_SIZE_MINI : GD_SIZE_NORMAL;
                const ns = gdVehicleSize(gdVehicle2, gdPlayerSize2);
                const cx = gdCube2.x + gdCube2.w / 2, cy = gdCube2.y + gdCube2.h / 2;
                gdCube2.w = ns; gdCube2.h = ns; gdCube2.x = cx - ns / 2; gdCube2.y = cy - ns / 2;
                spawnParticles(cx, cy, 10, color(200, 140, 255));
            }
            continue;
        }
        if (!hit1) continue; // dual/end dual still triggered by primary
        if (o.type === "portalDual" && !o._inside) {
            o._inside = true;
            playPortalSound();
            if (!gdDual) {
                gdDual = true;
                // Dual always needs floor + ceiling icons, but keep current X and don't hard-kill momentum mid-portal
                const sz = gdCube.w;
                gdCube.y = gdGroundY - sz;
                gdCube.onGround = true;
                // soft land — small residual only if was already falling toward floor
                if (gdCube.vy < 0) gdCube.vy = 0;
                else gdCube.vy = min(gdCube.vy, 4);
                gdVehicle2 = gdVehicle;
                gdGravityDir2 = -1;
                gdPlayerSize2 = gdPlayerSize || 1;
                gdWaveTrail2 = [];
                const sz2 = gdVehicleSize(gdVehicle2, gdPlayerSize2);
                gdCube2 = {
                    x: gdCube.x,
                    y: gdCeilY,
                    w: sz2, h: sz2,
                    vy: 0,
                    onGround: true,
                    rot: 0,
                    shipUp: false,
                    _arm: !(typeof gdHold === "function" && gdHold())
                };
                spawnParticles(gdCube.x + sz / 2, gdGroundY - sz / 2, 12, color(255, 160, 40));
                spawnParticles(gdCube.x + sz2 / 2, gdCeilY + sz2 / 2, 12, color(255, 200, 80));
            }
        }
        if (o.type === "endDual" && !o._inside) {
            o._inside = true;
            if (gdDual) {
                gdDual = false;
                gdCube2 = null;
                gdWaveTrail2 = [];
                spawnParticles(gdCube.x + gdCube.w / 2, gdCube.y + gdCube.h / 2, 16, color(255, 100, 60));
            }
        }
    }
}

function updateGeometryDash() {
    if (gdWon || !gdCube) return;
    // Learning AI automatically retries after a death. The retry is part of its
    // training loop: the death is recorded first, then the same vehicle gets a
    // fresh attempt with a stronger learned safety margin.
    if (gameOver) {
        if (gdAIPilot && aiLabProfile === 3 && !vPodmenijuAILab && gdAITrainingCooldown > 0) {
            gdAITrainingCooldown--;
            if (gdAITrainingCooldown === 0) {
                gdAILearningRuns++;
                // Preserve watchingAI so initGeometryDash keeps gdAIPilot on.
                watchingAI = true;
                initGeometryDash();
                gdAIPilot = true;
                // Brief grace so AI starts moving immediately.
                gdStarted = true;
            }
        }
        return;
    }
    // Run the AI before the start gate. The previous order returned here first,
    // so gdHold/gdSwingInputQueued was never generated on the first frame and
    // every AI run waited forever for human input.
    updateGDAI();
    if (!gdStarted) {
        // Platformer: arrows also start the run (you can stand still / walk)
        const arrowStart = gdPlatformerMode && (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(65) || keyIsDown(68));
        if (gdAIPilot || gdHold() || gdSwingInputQueued || arrowStart) gdStarted = true;
        else return;
    }
    practiceMaybeAutoCheckpoint();
    // Mutators affect every frame of this attempt; moving hazards update before collision checks.
    if (gdAIMutatorActive("Moving Hazards")) {
        for (const o of gdObstacles) {
            if (!o.moving) continue;
            o.y = constrain(o.baseY + sin(frameCount * 0.055 + o.movePhase) * o.moveAmp,
                gdCeilY + 3, gdGroundY - o.h - 3);
        }
    }
    // CLASSIC: auto-scroll forward
    // PLATFORMER: same speed, but only while holding ←/→ (hold right = exact classic feel)
    {
        const scrollStep = gdSpeed * (gdDashing ? 1.55 : 1) * (gdAIMutatorActive("Speed Surge") ? 1.16 : 1);
        if (gdPlatformerMode) {
            let move = 0;
            if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) move = 1;
            if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) move = -1;
            gdScroll += move * scrollStep;
            if (gdScroll < 0) gdScroll = 0;
        } else {
            gdScroll += scrollStep;
        }
    }
    // Builder checkpoint objects — touch to save respawn (classic + platformer)
    if (gdCube && !gameOver) {
        for (let o of gdObstacles) {
            if (o.type !== "checkpoint") continue;
            const sx = o.x - gdScroll;
            if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) {
                if (!o.activated) {
                    o.activated = true;
                    gdLevelCheckpoint = {
                        scroll: gdScroll,
                        y: gdCube.y,
                        vehicle: gdVehicle,
                        gDir: gdGravityDir || 1,
                        size: gdPlayerSize || 1,
                        dual: gdDual,
                        vehicle2: gdVehicle2,
                        gDir2: gdGravityDir2
                    };
                    try { playCoinSound(); } catch (e) {}
                    spawnParticles(gdCube.x + gdCube.w / 2, gdCube.y, 12, color(80, 255, 160));
                }
            }
        }
    }
    updateWaveSkillFPS();
    const stageMeters = Math.floor(gdScroll / 20);
    const gdMeters = isPortalScoreMode() ? gdTotalScore() : stageMeters;
    if (!gdAIPilot && gameMode === "Geometry Dash" && gdMeters >= 1500) unlockAchievement("gdExplorer", "gdPrismSkin");
    if (!gdAIPilot && gameMode === "GD Ship" && gdMeters >= 1500) unlockAchievement("gdShipPilot", "gdShipSkin");
    if (!gdAIPilot && gameMode === "GD Wave" && gdMeters >= 2000) unlockAchievement("gdWaveMaster", "gdVoidBackground");
    if (!gdAIPilot && gameMode === "GD Swing" && gdMeters >= 1500) unlockAchievement("gdSwingMaster", "gdSwingAccessory");
    if (!gdAIPilot && gameMode === "GD Robot" && gdMeters >= 1500) unlockAchievement("gdRobotMaster", "gdRobotSkin");
    if (!gdAIPilot && gameMode === "GD UFO" && gdMeters >= 1500) unlockAchievement("gdUFOMaster", "gdUFOBackground");
    if (!gdAIPilot && gameMode === "GD Ball" && gdMeters >= 1500) unlockAchievement("gdBallMaster", "gdBallAccessory");
    if (!gdAIPilot && gameMode === "GD Portal Level" && gdPortalStage >= gdPortalVehicles.length - 1 && gdMeters >= 2500) unlockAchievement("gdPortalRunner", "gdCrownAccessory");
    if (isPortalScoreMode()) {
        // Vehicle portals — each dual icon changes ONLY its own gamemode
        for (let o of gdObstacles) {
            if (o.type !== "portal" || o.used) continue;
            const sx = o.x - gdScroll;
            const hit1 = !o._used1 && gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h);
            const hit2 = gdDual && gdCube2 && !o._used2 && gdPlayerRectOverlap(gdCube2, sx, o.y, o.w, o.h);
            if (hit1 || hit2) {
                if (gameMode === "Stereo Madness" || gameMode === "Pulse Factory" || gameMode === "Grok Showcase"
                    || gameMode === "GD Builder Test" || gameMode === "GD AI Demon" || gameMode === "Wave Skill Tester") {
                    if (hit1) { o._used1 = true; smPortalChangePlayer(1, o.target || "ship"); }
                    if (hit2) { o._used2 = true; smPortalChangePlayer(2, o.target || "ship"); }
                    if (!gdDual || (o._used1 && o._used2)) {
                        o.used = true;
                        o.type = "portalUsed";
                    }
                } else {
                    gdPortalAdvance();
                }
                break;
            }
        }
        // Gravity portals — only the icon that touches flips ITS gravity
        for (let o of gdObstacles) {
            if (o.type !== "gravityPortal" || o.used) continue;
            const sx = o.x - gdScroll;
            const hit1 = gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h);
            const hit2 = gdDual && gdCube2 && gdPlayerRectOverlap(gdCube2, sx, o.y, o.w, o.h);
            if (hit1 || hit2) {
                const dir = o.gravityDir != null ? o.gravityDir : -1;
                if (hit1 && !o._gUsed1) {
                    o._gUsed1 = true;
                    applyGravityDir(dir);
                }
                if (hit2 && !o._gUsed2) {
                    o._gUsed2 = true;
                    gdGravityDir2 = dir;
                    if (gdCube2) {
                        gdCube2.vy = -(gdCube2.vy || 0);
                        gdCube2.onGround = false;
                    }
                }
                if (!gdDual || (o._gUsed1 && o._gUsed2)) {
                    o.used = true;
                    o.type = "gravityPortalUsed";
                }
                playJumpSound();
                break;
            }
        }
    }
    // Only pure vehicle / portal-stage runs get procedural fill.
    // Finite levels (Stereo Madness, Pulse, Showcase…) must NOT grow forever.
    if (gdShouldEndlessFill()) {
        ensureEndlessCube();
        ensureEndlessBall();
        ensureEndlessWave();
        ensureEndlessShip();
        ensureEndlessSwing();
        ensureEndlessRobot();
        ensureEndlessUFO();
        ensureEndlessSpider();
        ensureEndlessMini();
        ensureEndlessDart();
    }

    // Dash orb overrides vehicle vertical physics this frame
    if (gdDashing && gdHold()) {
        gdCube.vy = 0;
        gdCube.onGround = false;
        gdCube.y = constrain(gdCube.y, gdCeilY + 1, gdGroundY - gdCube.h - 1);
        // still check hazards while dashing
        for (let o of gdObstacles) {
            const sx = o.x - gdScroll;
            if (o.type === "goal") {
                if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) gdFinish();
                continue;
            }
            if (o.type === "spike" || o.type === "spikeDown") {
                if (gdSpikeHit(gdCube, o, sx)) { deathCause = "Hit while dashing"; gdDie(); break; }
            } else if (o.type === "hazard") {
                if (rectsOverlap(gdCube.x + 2, gdCube.y + 2, gdCube.w - 4, gdCube.h - 4, sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                    deathCause = "Hit while dashing";
                    gdDie(); break;
                }
            } else if (o.type === "block" || o.type === "wall") {
                if (rectsOverlap(gdCube.x + 2, gdCube.y + 2, gdCube.w - 4, gdCube.h - 4, sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                    if (gdBlockSideLethal(gdCube, o, sx)) {
                        deathCause = "Hit while dashing";
                        gdDie(); break;
                    }
                }
            }
        }
        gdApplyPadOrbs({ input: true });
        return; // skip normal vehicle physics while locked in dash
    } else if (gdDashing && !gdHold()) {
        gdDashing = false; gdDashTimer = 0;
    }

    gdApplySpecialPortals();


    if (gdVehicle === "cube") {
        // Jump only on ground (supports upside-down via gdGravityDir)
        const gDir = gdGravityDir || 1;
        if (!gdCube.onGround) gdCube._jumpLatch = false;
        if (gdHold() && gdCube.onGround && !gdCube._jumpLatch) {
            gdCube.vy = -10.5 * gDir;
            gdCube.onGround = false;
            gdCube._jumpLatch = true;
            playJumpSound();
        }
        gdCube.vy += 0.52 * gDir;
        if (gDir > 0) { if (gdCube.vy > 13) gdCube.vy = 13; }
        else { if (gdCube.vy < -13) gdCube.vy = -13; }
        gdCube.y += gdCube.vy;
        gdCube.onGround = false;

        // ground / ceiling depending on gravity
        if (gDir > 0) {
            if (gdCube.y + gdCube.h >= gdGroundY) {
                const body = gdPhysicsBody(gdCube);
                let overGap = false;
                for (let o of gdObstacles) {
                    if (o.type !== "gap") continue;
                    let sx = o.x - gdScroll;
                    if (body.x + body.w > sx + 2 && body.x < sx + o.w - 2) { overGap = true; break; }
                }
                if (!overGap) {
                    gdCube.y = gdGroundY - gdCube.h;
                    gdCube.vy = 0;
                    gdCube.onGround = true;
                }
            }
            if (gdCube.y < gdCeilY) { gdCube.y = gdCeilY; if (gdCube.vy < 0) gdCube.vy = 0; }
        } else {
            if (gdCube.y <= gdCeilY) {
                gdCube.y = gdCeilY;
                gdCube.vy = 0;
                gdCube.onGround = true;
            }
            if (gdCube.y + gdCube.h > gdGroundY) {
                gdCube.y = gdGroundY - gdCube.h;
                if (gdCube.vy > 0) gdCube.vy = 0;
            }
        }
        // land on blocks / plats relative to gravity
        for (let o of gdObstacles) {
            if (o.type !== "block" && o.type !== "plat") continue;
            let sx = o.x - gdScroll;
            if (gdCube.x + gdCube.w <= sx + 3 || gdCube.x >= sx + o.w - 3) continue;
            if (gDir > 0) {
                if (gdCube.vy >= 0 &&
                    gdCube.y + gdCube.h >= o.y && gdCube.y + gdCube.h <= o.y + 14 &&
                    gdCube.y < o.y) {
                    gdCube.y = o.y - gdCube.h;
                    gdCube.vy = 0;
                    gdCube.onGround = true;
                }
            } else {
                if (gdCube.vy <= 0 &&
                    gdCube.y <= o.y + o.h && gdCube.y >= o.y + o.h - 14 &&
                    gdCube.y + gdCube.h > o.y + o.h) {
                    gdCube.y = o.y + o.h;
                    gdCube.vy = 0;
                    gdCube.onGround = true;
                }
            }
        }
        // solid slopes (cut blocks) — continuous ramps support cube
        for (let o of gdObstacles) {
            if (o.type !== "slope") continue;
            let sx = o.x - gdScroll;
            if (gdCube.x + gdCube.w <= sx + 1 || gdCube.x >= sx + o.w - 1) continue;
            const surfaceY = gdSlopeSurfaceY(o, sx, gdCube.x + gdCube.w * 0.5);
            if (gDir > 0 && gdCube.vy >= -0.5 &&
                gdCube.y + gdCube.h >= surfaceY - 4 && gdCube.y + gdCube.h <= surfaceY + 22) {
                gdCube.y = surfaceY - gdCube.h;
                gdCube.vy = 0;
                gdCube.onGround = true;
            } else if (gDir < 0 && gdCube.vy <= 0.5 &&
                gdCube.y <= surfaceY + 4 && gdCube.y >= surfaceY - 22) {
                gdCube.y = surfaceY;
                gdCube.vy = 0;
                gdCube.onGround = true;
            }
        }

        // Apply pads AFTER surface/ground resolution so a floor pad's launch
        // cannot be immediately cancelled by the ground collision setting vy=0.
        gdApplyPadOrbs({ input: gdHold(), boostYellow: 15.5, boostBlue: 11.8, orbYellow: 13.5, orbBlue: 17.0 });

        if (!gdCube.onGround) gdCube.rot += 0.16;
        else gdCube.rot = round(gdCube.rot / (HALF_PI)) * HALF_PI;

        // lethal: spikes only + side-hit into block while not landing
        for (let o of gdObstacles) {
            let sx = o.x - gdScroll;
            if (o.type === "goal") {
                if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) gdFinish();
                continue;
            }
            if (o.type === "secretCoin") {
                if (!o._collected && gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) {
                    o._collected = true;
                    o.type = "secretCoinGot";
                    kovanci += 50;
                    localStorage.setItem("snakeCoins", kovanci);
                    playCoinSound();
                }
            } else if (o.type === "spike" || o.type === "spikeDown") {
                if (gdSpikeHit(gdCube, o, sx)) { gdDie(); break; }
            } else if (o.type === "hazard") {
                if (rectsOverlap(gdCube.x + 3, gdCube.y + 3, gdCube.w - 6, gdCube.h - 6, sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                    gdDie(); break;
                }
            } else if (o.type === "block" || o.type === "wall") {
                // side collision only (not top landing which was already handled)
                if (gdPlayerBlockOverlap(gdCube, sx, o.y, o.w, o.h)) {
                    let landing = (gDir > 0)
                        ? (gdCube.vy >= 0 && gdCube.y + gdCube.h <= o.y + 16)
                        : (gdCube.vy <= 0 && gdCube.y >= o.y + o.h - 16);
                    if (!landing && gdBlockSideLethal(gdCube, o, sx)) { gdDie(); break; }
                }
            }
        }
        if (gdCube.y > sirina + 30) gdDie();

    } else if (gdVehicle === "robot") {
        // Robot: tap/hold jump with full gravity-dir support
        const gDir = gdGravityDir || 1;
        if (!gdHold()) gdRobotJumpLatch = false;
        if (gdCube.onGround && gdHold() && !gdRobotJumpLatch) {
            gdCube.vy = -7.2 * gDir;
            gdCube.onGround = false;
            gdRobotJumpTime = 0;
            gdRobotJumping = true;
            gdRobotJumpLatch = true;
            playJumpSound();
        }
        if (gdRobotJumping && gdHold() && gdRobotJumpTime < 22 && ((gDir > 0 && gdCube.vy < 0) || (gDir < 0 && gdCube.vy > 0))) {
            gdCube.vy -= 0.42 * gDir;
            gdCube.vy += 0.18 * gDir;
            gdRobotJumpTime++;
            if (gDir > 0 && gdCube.vy < -12) gdCube.vy = -12;
            if (gDir < 0 && gdCube.vy > 12) gdCube.vy = 12;
        } else {
            if (!gdHold() || gdRobotJumpTime >= 22 || (gDir > 0 ? gdCube.vy >= 0 : gdCube.vy <= 0)) gdRobotJumping = false;
            gdCube.vy += 0.55 * gDir;
        }
        if (gDir > 0) { if (gdCube.vy > 13) gdCube.vy = 13; }
        else { if (gdCube.vy < -13) gdCube.vy = -13; }
        gdCube.y += gdCube.vy;
        gdCube.onGround = false;
        if (gDir > 0) {
            if (gdCube.y + gdCube.h >= gdGroundY) {
                gdCube.y = gdGroundY - gdCube.h; gdCube.vy = 0; gdCube.onGround = true;
                gdRobotJumping = false; gdRobotJumpTime = 0;
            }
            if (gdCube.y < gdCeilY) { gdCube.y = gdCeilY; if (gdCube.vy < 0) gdCube.vy = 0; }
        } else {
            if (gdCube.y <= gdCeilY) {
                gdCube.y = gdCeilY; gdCube.vy = 0; gdCube.onGround = true;
                gdRobotJumping = false; gdRobotJumpTime = 0;
            }
            if (gdCube.y + gdCube.h > gdGroundY) {
                gdCube.y = gdGroundY - gdCube.h; if (gdCube.vy > 0) gdCube.vy = 0;
            }
        }
        gdCube.rot = gdCube.onGround ? 0 : constrain(gdCube.vy * 0.035, -0.45, 0.45);

        gdApplyPadOrbs({ input: gdHold(), boostYellow: 14.0, boostBlue: 11.0, orbYellow: 12.5, orbBlue: 15.0 });

        for (let o of gdObstacles) {
            let sx = o.x - gdScroll;
            if (o.type === "goal") {
                if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) gdFinish();
                continue;
            }
            if (o.type === "spike" || o.type === "spikeDown") {
                if (gdSpikeHit(gdCube, o, sx)) { gdDie(); break; }
            } else if (o.type === "hazard") {
                if (rectsOverlap(gdCube.x + 3, gdCube.y + 3, gdCube.w - 6, gdCube.h - 6, sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                    gdDie(); break;
                }
            } else if (o.type === "block" || o.type === "wall") {
                if (gdCube.x + gdCube.w > sx + 3 && gdCube.x < sx + o.w - 3 &&
                    ((gDir > 0 && gdCube.vy >= 0 && gdCube.y + gdCube.h >= o.y && gdCube.y + gdCube.h <= o.y + 14 && gdCube.y < o.y) ||
                     (gDir < 0 && gdCube.vy <= 0 && gdCube.y <= o.y + o.h && gdCube.y >= o.y + o.h - 14 && gdCube.y + gdCube.h > o.y + o.h))) {
                    if (gDir > 0) gdCube.y = o.y - gdCube.h; else gdCube.y = o.y + o.h;
                    gdCube.vy = 0;
                    gdCube.onGround = true;
                    gdRobotJumping = false;
                    gdRobotJumpTime = 0;
                } else if (gdPlayerBlockOverlap(gdCube, sx, o.y, o.w, o.h)) {
                    // If Robot has just walked/fallen off the top, let gravity carry it
                    // down to the real ground instead of treating the block edge as lethal.
                    const fallingOffTop = gdCube.vy > 0 && gdCube.y < o.y + 16;
                    if (!fallingOffTop && gdBlockSideLethal(gdCube, o, sx)) { gdDie(); break; }
                }
            }
        }
        // solid slopes — robot can land & walk like cube
        for (let o of gdObstacles) {
            if (o.type !== "slope") continue;
            let sx = o.x - gdScroll;
            if (gdCube.x + gdCube.w <= sx + 1 || gdCube.x >= sx + o.w - 1) continue;
            const surfaceY = gdSlopeSurfaceY(o, sx, gdCube.x + gdCube.w * 0.5);
            if (gDir > 0 && gdCube.vy >= -0.5 &&
                gdCube.y + gdCube.h >= surfaceY - 4 && gdCube.y + gdCube.h <= surfaceY + 24) {
                gdCube.y = surfaceY - gdCube.h;
                gdCube.vy = 0;
                gdCube.onGround = true;
                gdRobotJumping = false;
                gdRobotJumpTime = 0;
            } else if (gDir < 0 && gdCube.vy <= 0 &&
                gdCube.y <= surfaceY + 2 && gdCube.y >= surfaceY - 18) {
                gdCube.y = surfaceY;
                gdCube.vy = 0;
                gdCube.onGround = true;
                gdRobotJumping = false;
                gdRobotJumpTime = 0;
            }
        }
        if (gdCube.y > sirina + 30) gdDie();

    } else if (gdVehicle === "ball") {
        // Keep ball gravity in sync with global gravity dir
        gdBallGravity = gdGravityDir || 1;
        const inputNow = gdBallInputQueued || gdAIBallTap;
        const holding = gdHold();
        if (gdBallInputQueued) {
            gdBallInputQueued = false;
            gdStarted = true;
        }
        if (holding || inputNow) gdStarted = true;

        // Pads & orbs (shared) — yellow boost, blue flips gravity
        const beforeVy = gdCube.vy;
        gdApplyPadOrbs({ input: inputNow || holding, boostYellow: 18.5, boostBlue: 11.0, orbYellow: 14.0, orbBlue: 12.0 });
        const usedOrbThisFrame = (gdCube.vy !== beforeVy && !gdCube.onGround);

        // Grounded click = classic ball gravity flip (not if pad/orb just fired)
        if (inputNow && gdCube.onGround && !usedOrbThisFrame) {
            applyGravityDir(-(gdGravityDir || 1));
            gdCube.onGround = false;
            gdCube.vy = (gdGravityDir || 1) * 6.5;
            playJumpSound();
        }

        // Always integrate; surface stick below zeroes velocity when landed
        if (!gdCube.onGround) {
            // Ball should feel responsive: its gravity was cancelling too much
            // of the pad/orb boost, making its bounce visibly lower than Cube.
            // 0.78 keeps the Ball distinct while giving it a stronger bounce.
            gdCube.vy += 0.78 * gdBallGravity;
            gdCube.vy = constrain(gdCube.vy, -22, 22);
        } else {
            // tiny gravity so we re-detect ground each frame
            gdCube.vy = gdBallGravity * 0.5;
        }
        gdCube.y += gdCube.vy;
        gdCube.rot += gdBallGravity * 0.22;

        let stuck = false;
        // Only stick when moving toward the surface (lets pads/orbs launch off)
        if (gdBallGravity > 0 && gdCube.vy >= 0 && gdCube.y + gdCube.h >= gdGroundY - 0.5) {
            gdCube.y = gdGroundY - gdCube.h; gdCube.vy = 0; stuck = true;
        }
        if (gdBallGravity < 0 && gdCube.vy <= 0 && gdCube.y <= gdCeilY + 0.5) {
            gdCube.y = gdCeilY; gdCube.vy = 0; stuck = true;
        }
        // ALWAYS resolve solid blocks — even when stuck on floor/ceiling.
        // Previously "if (!stuck)" let the ball phase through floor/ceiling blocks.
        if (!gameOver) {
            for (let o of gdObstacles) {
                if (o.type !== "plat" && o.type !== "block" && o.type !== "wall") continue;
                const sx = o.x - gdScroll;
                if (gdCube.x + gdCube.w <= sx + 1 || gdCube.x >= sx + o.w - 1) continue;
                const overlapX = Math.min(gdCube.x + gdCube.w, sx + o.w) - Math.max(gdCube.x, sx);
                const overlapY = Math.min(gdCube.y + gdCube.h, o.y + o.h) - Math.max(gdCube.y, o.y);
                if (overlapX <= 0 || overlapY <= 0) continue;

                // Prefer landing on the surface facing current gravity
                const comingFromAbove = gdBallGravity > 0 && (gdCube.y + gdCube.h - gdCube.vy) <= o.y + 6;
                const comingFromBelow = gdBallGravity < 0 && (gdCube.y - gdCube.vy) >= o.y + o.h - 6;
                if (comingFromAbove && gdCube.vy >= -0.5) {
                    gdCube.y = o.y - gdCube.h; gdCube.vy = 0; stuck = true; continue;
                }
                if (comingFromBelow && gdCube.vy <= 0.5) {
                    gdCube.y = o.y + o.h; gdCube.vy = 0; stuck = true; continue;
                }

                // Side collision or embed — lethal in classic, solid in platformer
                if (overlapX > 2 && overlapY > 2) {
                    if (gdBlockSideLethal(gdCube, o, sx)) {
                        deathCause = "Hit block";
                        gdDie();
                        break;
                    }
                }
            }
        }
        // Soft bounds: don't kill pad/orb launches by zeroing upward velocity
        if (gdCube.y < gdCeilY) {
            gdCube.y = gdCeilY;
            if (gdCube.vy < 0) gdCube.vy = 0;
            if (gdBallGravity < 0) stuck = true;
        }
        if (gdCube.y + gdCube.h > gdGroundY) {
            gdCube.y = gdGroundY - gdCube.h;
            if (gdCube.vy > 0) gdCube.vy = 0;
            if (gdBallGravity > 0) stuck = true;
        }
        gdCube.onGround = stuck;

        // Ball can rest on solid slopes
        if (!gameOver) {
            for (let o of gdObstacles) {
                if (o.type !== "slope") continue;
                const sx = o.x - gdScroll;
                if (gdCube.x + gdCube.w <= sx + 1 || gdCube.x >= sx + o.w - 1) continue;
                const surfaceY = gdSlopeSurfaceY(o, sx, gdCube.x + gdCube.w * 0.5);
                if (gdBallGravity > 0 && gdCube.vy >= -0.5 &&
                    gdCube.y + gdCube.h >= surfaceY - 4 && gdCube.y + gdCube.h <= surfaceY + 24) {
                    gdCube.y = surfaceY - gdCube.h; gdCube.vy = 0; gdCube.onGround = true; stuck = true;
                } else if (gdBallGravity < 0 && gdCube.vy <= 0.5 &&
                    gdCube.y <= surfaceY + 4 && gdCube.y >= surfaceY - 24) {
                    gdCube.y = surfaceY; gdCube.vy = 0; gdCube.onGround = true; stuck = true;
                }
            }
        }

        if (!gameOver) {
            for (let o of gdObstacles) {
                const sx = o.x - gdScroll;
                if (o.type === "goal" || o.type === "secretCoin") continue; // handled globally
                if (o.type === "sawblade" && gdSawbladeHit(gdCube, o, sx)) { gdDie(); break; }
                if (o.type === "spike" || o.type === "spikeDown") {
                    if (gdSpikeHit(gdCube, o, sx)) { gdDie(); break; }
                } else if (o.type === "hazard") {
                    if (rectsOverlap(gdCube.x + 2, gdCube.y + 2, gdCube.w - 4, gdCube.h - 4,
                        sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                        gdDie(); break;
                    }
                } else if (o.type === "block" || o.type === "plat" || o.type === "wall") {
                    // Side-hit lethal in classic; solid push in platformer.
                    if (!rectsOverlap(gdCube.x + 2, gdCube.y + 2, gdCube.w - 4, gdCube.h - 4,
                        sx + 2, o.y + 2, o.w - 4, o.h - 4)) continue;
                    const onTop = gdBallGravity > 0 && abs((gdCube.y + gdCube.h) - o.y) <= 5;
                    const onBot = gdBallGravity < 0 && abs(gdCube.y - (o.y + o.h)) <= 5;
                    if (onTop || onBot) continue;
                    if (gdBlockSideLethal(gdCube, o, sx)) {
                        deathCause = "Hit block";
                        gdDie(); break;
                    }
                }
            }
        }
    } else if (gdVehicle === "swing") {
        // True Swing: W / mouse / UP / SPACE flip gravity exactly once per press.
        if (gdSwingInputQueued) {
            gdSwingDir *= -1;
            gdSwingInputQueued = false;
            gdStarted = true;
            playJumpSound();
        }
        // Movement is wave-like:
        // constant diagonal motion whose vertical direction is controlled by the flip.
        gdCube.vy += 0.43 * gdSwingDir;
        gdCube.vy = constrain(gdCube.vy, -7.0, 7.0);
        gdCube.y += gdCube.vy;
        gdCube.rot = gdSwingDir > 0 ? 0.5 : -0.5;
        gdApplyPadOrbs({ input: gdHold(), boostYellow: 12.0, boostBlue: 10.0, orbYellow: 11.0, orbBlue: 14.0 });

        // Bounce / clamp on floor & ceiling — do NOT die
        if (gdCube.y < gdCeilY) { gdCube.y = gdCeilY; if (gdCube.vy < 0) gdCube.vy = 0; }
        if (gdCube.y + gdCube.h > gdGroundY) { gdCube.y = gdGroundY - gdCube.h; if (gdCube.vy > 0) gdCube.vy = 0; }
        if (!gameOver) {
            for (let o of gdObstacles) {
                const sx = o.x - gdScroll;
                if (o.type === "goal") {
                    if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) gdFinish();
                    continue;
                }
                if (o.type === "sawblade" && gdSawbladeHit(gdCube, o, sx)) { gdDie(); break; }
                if (o.type === "swingGate") {
                    if (gdCube.x + gdCube.w > sx && gdCube.x < sx + o.w &&
                        (gdCube.y + 4 < o.top || gdCube.y + gdCube.h - 4 > o.bottom)) {
                        gdDie(); break;
                    }
                } else if (o.type === "spike" || o.type === "spikeDown") {
                    if (gdSpikeHit(gdCube, o, sx)) { gdDie(); break; }
                } else if (o.type === "hazard") {
                    if (rectsOverlap(gdCube.x + 2, gdCube.y + 2, gdCube.w - 4, gdCube.h - 4,
                        sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                        gdDie(); break;
                    }
                } else if (o.type === "block" || o.type === "wall") {
                    if (gdFlyingBlockCollide(gdCube, o, sx)) { gdDie(); break; }
                } else if (o.type === "slope") {
                    if (gdFlyingSlopeCollide(gdCube, o, sx)) { gdDie(); break; }
                }
            }
        }
    } else if (gdVehicle === "ufo") {
        // UFO: each tap = bounce against gravity
        const gDir = gdGravityDir || 1;
        if (gdHold() && !gdRobotJumpLatch) {
            gdCube.vy = -8.2 * gDir;
            gdRobotJumpLatch = true;
            playJumpSound();
        }
        if (!gdHold()) gdRobotJumpLatch = false;
        gdCube.vy += 0.48 * gDir;
        gdCube.vy = constrain(gdCube.vy, -11, 11);
        gdCube.y += gdCube.vy;
        gdCube.rot = constrain(gdCube.vy * 0.04, -0.55, 0.55);
        if (gdCube.y < gdCeilY) { gdCube.y = gdCeilY; if (gdCube.vy < 0) gdCube.vy = 0; }
        if (gdCube.y + gdCube.h > gdGroundY) { gdCube.y = gdGroundY - gdCube.h; if (gdCube.vy > 0) gdCube.vy = 0; }
        gdApplyPadOrbs({ input: gdHold(), boostYellow: 12.0, boostBlue: 10.0, orbYellow: 11.0, orbBlue: 14.0 });
        for (let o of gdObstacles) {
            let sx = o.x - gdScroll;
            if (o.type === "goal") {
                if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) gdFinish();
                continue;
            }
            if (o.type === "sawblade" && gdSawbladeHit(gdCube, o, sx)) { gdDie(); break; }

            if (o.type === "spike" || o.type === "spikeDown") {
                if (gdSpikeHit(gdCube, o, sx)) { gdDie(); break; }
            } else if (o.type === "hazard") {
                if (rectsOverlap(gdCube.x + 3, gdCube.y + 3, gdCube.w - 6, gdCube.h - 6, sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                    gdDie(); break;
                }
            } else if (o.type === "block" || o.type === "wall") {
                if (gdFlyingBlockCollide(gdCube, o, sx)) { gdDie(); break; }
            } else if (o.type === "slope") {
                if (gdFlyingSlopeCollide(gdCube, o, sx)) { gdDie(); break; }
            }
        }
    } else if (gdVehicle === "ship") {
        // Real GD-style ship: strong vertical climb on hold, slower glide on release
        const gDir = gdGravityDir || 1;
        const thrust = 0.95; // hold → steep climb
        const grav = 0.34;   // release → slower fall than climb
        if (gdHold()) gdCube.vy -= thrust * gDir;
        else gdCube.vy += grav * gDir;
        // Higher max climb speed than fall speed (more vertical when holding)
        if (gDir > 0) gdCube.vy = constrain(gdCube.vy, -10.5, 5.6);
        else gdCube.vy = constrain(gdCube.vy, -5.6, 10.5);
        gdCube.y += gdCube.vy;
        gdCube.rot = constrain(gdCube.vy * 0.055 * gDir, -1.15, 1.15);
        // ceiling / floor
        if (gdCube.y < gdCeilY) { gdCube.y = gdCeilY; gdCube.vy = 0; }
        if (gdCube.y + gdCube.h > gdGroundY) { gdCube.y = gdGroundY - gdCube.h; gdCube.vy = 0; }
        gdApplyPadOrbs({ input: gdHold(), boostYellow: 12.0, boostBlue: 10.0, orbYellow: 11.0, orbBlue: 14.0 });

        for (let o of gdObstacles) {
            let sx = o.x - gdScroll;
            if (o.type === "goal") {
                if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) gdFinish();
                continue;
            }
            if (o.type === "sawblade" && gdSawbladeHit(gdCube, o, sx)) { gdDie(); break; }

            if (o.type === "spike" || o.type === "spikeDown") {
                if (gdSpikeHit(gdCube, o, sx)) { gdDie(); break; }
            } else if (o.type === "hazard") {
                if (rectsOverlap(gdCube.x + 3, gdCube.y + 3, gdCube.w - 6, gdCube.h - 6, sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                    gdDie(); break;
                }
            } else if (o.type === "block" || o.type === "wall") {
                if (gdFlyingBlockCollide(gdCube, o, sx)) { gdDie(); break; }
            } else if (o.type === "slope") {
                if (gdFlyingSlopeCollide(gdCube, o, sx)) { gdDie(); break; }
            }
        }

    } else if (gdVehicle === "spider") {
        // Spider: edge-triggered surface flip onto block / slope / floor / ceil
        const heldNow = gdHold();
        if (!gdInputArmReady) {
            if (!heldNow) gdInputArmReady = true;
        } else if (heldNow && !gdSpiderHeldPrev && gdCube.onGround) {
            const gDir = gdGravityDir || 1;
            const flipDir = -gDir; // teleport toward opposite gravity
            const fromY = gdCube.y;
            const destY = gdSpiderFindDestY(flipDir);
            if (destY != null) {
                const y0 = fromY, y1 = destY;
                if (gdSpiderPathBlocked(Math.min(y0, y1), Math.max(y0, y1) + gdCube.h)) {
                    deathCause = "Spider path hazard";
                    gdDie();
                } else {
                    gdGravityDir = -gDir;
                    gdSwingDir = gdGravityDir;
                    gdBallGravity = gdGravityDir;
                    gdCube.y = destY;
                    gdCube.vy = 0;
                    gdCube.onGround = true;
                    gdSpiderStickY = destY;
                    gdStarted = true;
                    playJumpSound();
                    spawnParticles(gdCube.x + gdCube.w / 2, (y0 + y1) * 0.5, 10, color(180, 80, 255));
                    // World-fixed line — scrolls with level, does not stick to player
                    gdSpiderTrail = {
                        worldX: gdScroll + gdCube.x + gdCube.w * 0.5,
                        y0: Math.min(y0, y1),
                        y1: Math.max(y0 + gdCube.h, y1 + gdCube.h),
                        life: 22
                    };
                }
            }
        }
        gdSpiderHeldPrev = heldNow;
        gdSwingInputQueued = false;
        gdSwingLatch = false;

        gdApplyPadOrbs({
            input: gdInputArmReady && heldNow,
            boostYellow: 12.0, boostBlue: 5.5, orbYellow: 11.0, orbBlue: 6.0
        });
        gdSwingDir = gdGravityDir || 1;
        gdBallGravity = gdGravityDir || 1;

        const gDir = gdGravityDir || 1;
        // Glue only while still on a surface; fall off block/slope edges
        if (gdCube.onGround) {
            const still = gdSpiderStillSupported(gDir);
            if (still.ok) {
                gdCube.y = still.y;
                gdSpiderStickY = still.y;
                gdCube.vy = 0;
            } else {
                gdCube.onGround = false;
                gdSpiderStickY = null;
            }
        } else {
            gdSpiderStickY = null;
            // Airborne: soft gravity toward current gravity direction
            gdCube.vy += 0.55 * gDir;
            gdCube.vy = constrain(gdCube.vy, -14, 14);
            gdCube.y += gdCube.vy;
            // Land on floor / ceiling
            if (gDir > 0 && gdCube.y + gdCube.h >= gdGroundY) {
                gdCube.y = gdGroundY - gdCube.h;
                gdCube.vy = 0;
                gdCube.onGround = true;
                gdSpiderStickY = gdCube.y;
            } else if (gDir < 0 && gdCube.y <= gdCeilY) {
                gdCube.y = gdCeilY;
                gdCube.vy = 0;
                gdCube.onGround = true;
                gdSpiderStickY = gdCube.y;
            }
            // Soft clamp so we don't leave the playfield
            if (gdCube.y < gdCeilY) { gdCube.y = gdCeilY; if (gdCube.vy < 0) gdCube.vy = 0; }
            if (gdCube.y + gdCube.h > gdGroundY) { gdCube.y = gdGroundY - gdCube.h; if (gdCube.vy > 0) gdCube.vy = 0; }
            // Land on blocks / slopes while airborne
            for (let o of gdObstacles) {
                if (o.type === "block" || o.type === "plat" || o.type === "wall") {
                    const sx = o.x - gdScroll;
                    if (gdCube.x + gdCube.w <= sx + 2 || gdCube.x >= sx + o.w - 2) continue;
                    if (gDir > 0 && gdCube.vy >= 0 &&
                        gdCube.y + gdCube.h >= o.y && gdCube.y + gdCube.h <= o.y + 16 && gdCube.y < o.y) {
                        gdCube.y = o.y - gdCube.h; gdCube.vy = 0; gdCube.onGround = true; gdSpiderStickY = gdCube.y;
                    } else if (gDir < 0 && gdCube.vy <= 0 &&
                        gdCube.y <= o.y + o.h && gdCube.y >= o.y + o.h - 16 && gdCube.y + gdCube.h > o.y + o.h) {
                        gdCube.y = o.y + o.h; gdCube.vy = 0; gdCube.onGround = true; gdSpiderStickY = gdCube.y;
                    }
                } else if (o.type === "slope") {
                    const sx = o.x - gdScroll;
                    if (gdCube.x + gdCube.w <= sx + 1 || gdCube.x >= sx + o.w - 1) continue;
                    const surfaceY = gdSlopeSurfaceY(o, sx, gdCube.x + gdCube.w * 0.5);
                    if (gDir > 0 && gdCube.vy >= -0.5 &&
                        gdCube.y + gdCube.h >= surfaceY - 4 && gdCube.y + gdCube.h <= surfaceY + 24) {
                        gdCube.y = surfaceY - gdCube.h; gdCube.vy = 0; gdCube.onGround = true; gdSpiderStickY = gdCube.y;
                    } else if (gDir < 0 && gdCube.vy <= 0.5 &&
                        gdCube.y <= surfaceY + 4 && gdCube.y >= surfaceY - 24) {
                        gdCube.y = surfaceY; gdCube.vy = 0; gdCube.onGround = true; gdSpiderStickY = gdCube.y;
                    }
                }
            }
        }
        // Trail fade
        if (gdSpiderTrail) {
            gdSpiderTrail.life--;
            if (gdSpiderTrail.life <= 0) gdSpiderTrail = null;
        }
        gdCube.rot = (gDir > 0) ? 0 : PI;

        if (!gameOver) {
            for (let o of gdObstacles) {
                const sx = o.x - gdScroll;
                if (o.type === "goal") {
                    if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) gdFinish();
                    continue;
                }
                if (o.type === "secretCoin") {
                    if (!o._collected && gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) {
                        o._collected = true; o.type = "secretCoinGot";
                        kovanci += 50; localStorage.setItem("snakeCoins", kovanci); playCoinSound();
                    }
                    continue;
                }
                if (o.type === "sawblade" && gdSawbladeHit(gdCube, o, sx)) { deathCause = "Hit saw"; gdDie(); break; }
                if (o.type === "spike" || o.type === "spikeDown") {
                    if (gdSpikeHit(gdCube, o, sx)) { deathCause = "Hit spike"; gdDie(); break; }
                } else if (o.type === "hazard") {
                    if (rectsOverlap(gdCube.x + 3, gdCube.y + 3, gdCube.w - 6, gdCube.h - 6, sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                        deathCause = "Hit hazard"; gdDie(); break;
                    }
                } else if (o.type === "wall" || o.type === "block") {
                    if (rectsOverlap(gdCube.x + 2, gdCube.y + 2, gdCube.w - 4, gdCube.h - 4, sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                        // on surface → ok; side → lethal (classic) / push (platformer)
                        const onTop = gDir > 0 && abs((gdCube.y + gdCube.h) - o.y) <= 6;
                        const onBot = gDir < 0 && abs(gdCube.y - (o.y + o.h)) <= 6;
                        if (onTop || onBot) continue;
                        if (gdBlockSideLethal(gdCube, o, sx)) { deathCause = "Hit wall"; gdDie(); break; }
                    }
                }
            }
        }

    } else if (gdVehicle === "dart") {
        // Dart: hold = climb, release = descend. Must release menu click first.
        const gDir = gdGravityDir || 1;
        const midY = (gdCeilY + gdGroundY) * 0.5 - gdCube.h * 0.5;
        if (!gdInputArmReady) {
            if (!gdHold()) gdInputArmReady = true;
            gdCube.y = midY;
            gdCube.vy = 0;
        } else if (!gdStarted) {
            if (gdHold()) gdStarted = true;
            gdCube.y = midY;
            gdCube.vy = 0;
        } else {
            if (gdHold()) {
                gdCube.vy = -5.5 * gDir; // gentle climb
            } else {
                gdCube.vy += 0.22 * gDir;
                if (gDir > 0 && gdCube.vy > 4.8) gdCube.vy = 4.8;
                if (gDir < 0 && gdCube.vy < -4.8) gdCube.vy = -4.8;
            }
            gdCube.y += gdCube.vy;
        }
        gdCube.y = constrain(gdCube.y, gdCeilY + 2, gdGroundY - gdCube.h - 2);
        gdCube.onGround = false;
        gdCube.rot = atan2(gdCube.vy, gdSpeed) * 0.55;
        gdApplyPadOrbs({ input: gdHold() && gdStarted, boostYellow: 8.0, boostBlue: 7.0, orbYellow: 8.0, orbBlue: 10.0 });
        if (!gameOver) {
            for (let o of gdObstacles) {
                const sx = o.x - gdScroll;
                if (o.type === "goal") {
                    if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) gdFinish();
                    continue;
                }
                if (o.type === "sawblade" && gdSawbladeHit(gdCube, o, sx)) { gdDie(); break; }
                if (o.type === "sawblade" && gdSawbladeHit(gdCube, o, sx)) { gdDie(); break; }
                if (o.type === "spike" || o.type === "spikeDown") {
                    if (gdSpikeHit(gdCube, o, sx)) { gdDie(); break; }
                } else if (o.type === "hazard") {
                    if (rectsOverlap(gdCube.x + 2, gdCube.y + 2, gdCube.w - 4, gdCube.h - 4, sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                        gdDie(); break;
                    }
                } else if (o.type === "block" || o.type === "wall") {
                    if (gdFlyingBlockCollide(gdCube, o, sx)) { gdDie(); break; }
                } else if (o.type === "slope") {
                    if (gdFlyingSlopeCollide(gdCube, o, sx)) { gdDie(); break; }
                }
            }
        }

    } else if (gdVehicle === "mini") {
        // Mini cube: smaller hitbox, LOWER jump than regular cube (-10.5)
        const gDir = gdGravityDir || 1;
        if (gdHold() && gdCube.onGround) {
            gdCube.vy = -7.8 * gDir; // lower arc than cube
            gdCube.onGround = false;
            gdStarted = true;
            playJumpSound();
        }
        gdCube.vy += 0.58 * gDir; // slightly heavier so landing is snappy
        if (gDir > 0) { if (gdCube.vy > 13) gdCube.vy = 13; }
        else { if (gdCube.vy < -13) gdCube.vy = -13; }
        gdCube.y += gdCube.vy;
        gdCube.onGround = false;

        if (gDir > 0) {
            if (gdCube.y + gdCube.h >= gdGroundY) {
                let overGap = false;
                for (let o of gdObstacles) {
                    if (o.type !== "gap") continue;
                    let sx = o.x - gdScroll;
                    if (gdCube.x + gdCube.w > sx + 2 && gdCube.x < sx + o.w - 2) { overGap = true; break; }
                }
                if (!overGap) {
                    gdCube.y = gdGroundY - gdCube.h;
                    gdCube.vy = 0;
                    gdCube.onGround = true;
                }
            }
            if (gdCube.y < gdCeilY) { gdCube.y = gdCeilY; if (gdCube.vy < 0) gdCube.vy = 0; }
        } else {
            if (gdCube.y <= gdCeilY) {
                gdCube.y = gdCeilY;
                gdCube.vy = 0;
                gdCube.onGround = true;
            }
            if (gdCube.y + gdCube.h > gdGroundY) {
                gdCube.y = gdGroundY - gdCube.h;
                if (gdCube.vy > 0) gdCube.vy = 0;
            }
        }
        // Solid collision with blocks/plats — land on top OR die on side (no phase-through)
        for (let o of gdObstacles) {
            if (o.type !== "block" && o.type !== "plat" && o.type !== "wall") continue;
            let sx = o.x - gdScroll;
            if (!gdPlayerBlockOverlap(gdCube, sx, o.y, o.w, o.h)) continue;
            const feet = gdCube.y + gdCube.h;
            const head = gdCube.y;
            if (gDir > 0) {
                // Landing: was above (or barely) and falling onto top
                const prevFeet = feet - gdCube.vy;
                if (gdCube.vy >= 0 && prevFeet <= o.y + 10 && feet >= o.y && head < o.y + o.h * 0.5) {
                    gdCube.y = o.y - gdCube.h;
                    gdCube.vy = 0;
                    gdCube.onGround = true;
                } else {
                    // side or embed — lethal in classic only
                    if (gdBlockSideLethal(gdCube, o, sx)) {
                        deathCause = "Hit block";
                        gdDie();
                        break;
                    }
                }
            } else {
                const prevHead = head - gdCube.vy;
                if (gdCube.vy <= 0 && prevHead >= o.y + o.h - 10 && head <= o.y + o.h && feet > o.y + o.h * 0.5) {
                    gdCube.y = o.y + o.h;
                    gdCube.vy = 0;
                    gdCube.onGround = true;
                } else {
                    if (gdBlockSideLethal(gdCube, o, sx)) {
                        deathCause = "Hit block";
                        gdDie();
                        break;
                    }
                }
            }
        }
        
        // solid slopes
        for (let o of gdObstacles) {
            if (o.type !== "slope") continue;
            let sx = o.x - gdScroll;
            if (gdCube.x + gdCube.w <= sx + 1 || gdCube.x >= sx + o.w - 1) continue;
            const surfaceY = gdSlopeSurfaceY(o, sx, gdCube.x + gdCube.w * 0.5);
            if (gDir > 0 && gdCube.vy >= -0.5 &&
                gdCube.y + gdCube.h >= surfaceY - 4 && gdCube.y + gdCube.h <= surfaceY + 24) {
                gdCube.y = surfaceY - gdCube.h; gdCube.vy = 0; gdCube.onGround = true;
            } else if (gDir < 0 && gdCube.vy <= 0.5 &&
                gdCube.y <= surfaceY + 4 && gdCube.y >= surfaceY - 24) {
                gdCube.y = surfaceY; gdCube.vy = 0; gdCube.onGround = true;
            }
        }
if (!gameOver) gdApplyPadOrbs({ input: gdHold(), boostYellow: 9.0, boostBlue: 7.5, orbYellow: 8.5, orbBlue: 10.5 });
        if (!gameOver) {
            for (let o of gdObstacles) {
                const sx = o.x - gdScroll;
                if (o.type === "goal") {
                    if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) gdFinish();
                    continue;
                }
                if (o.type === "spike" || o.type === "spikeDown" || o.type === "hazard") {
                    if (rectsOverlap(gdCube.x + 1, gdCube.y + 1, gdCube.w - 2, gdCube.h - 2, sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                        gdDie(); break;
                    }
                }
            }
        }

    } else { // wave
        // Hold = diagonal against gravity, release = with gravity. Flat slopes use slope:0.
        const waveSpeed = gdSpeed;
        const inSkill = (gameMode === "Wave Skill Tester");
        const gDir = gdGravityDir || 1;

        // Skill tester: rest solidly on the floor until the first hold (no downward drift, no glitch).
        if (inSkill && !waveSkillArmed) {
            if (gdHold()) {
                waveSkillArmed = true;
            } else {
                gdCube.vy = 0;
                gdCube.y = gdGroundY - gdCube.h; // solid floor
                gdCube.rot = 0;
            }
        }

        if (!inSkill || waveSkillArmed) {
            gdCube.vy = (gdHold() ? -waveSpeed : waveSpeed) * gDir;
            gdCube.y += gdCube.vy;
            // 45° visual — flip with gravity so hold always aims "up" relative to gravity
            gdCube.rot = (gdHold() ? -PI / 4 : PI / 4);
        }

        if (gdVehicle === "wave") {
            gdWaveTrail.push({ x: gdScroll + gdCube.x + gdCube.w / 2, y: gdCube.y + gdCube.h / 2 });
            if (gdWaveTrail.length > 55) gdWaveTrail.shift();
        }

        if (!gameOver) {
            const px = gdCube.x + gdCube.w * 0.5;
            let corridor = null;
            let bestDist = Infinity;
            for (let o of gdObstacles) {
                if (o.type !== "waveSlope") continue;
                const sx = o.x - gdScroll;
                const ex = sx + o.w;
                const dist = px < sx ? sx - px : (px > ex ? px - ex : 0);
                if (dist < bestDist) { bestDist = dist; corridor = o; }
                if (px >= sx && px <= ex) { corridor = o; bestDist = 0; break; }
            }

            // Only test when the wave is actually INSIDE a slope segment horizontally.
            // Nearby/past-the-end checks caused the tip-crash at the channel exit.
            if ((!inSkill || waveSkillArmed) && corridor && bestDist === 0) {
                const sx = corridor.x - gdScroll;
                // Slightly inset t so segment-join lerp edges don't false-kill
                const t = constrain((px - sx) / max(1, corridor.w), 0.02, 0.98);
                const topY = lerp(corridor.top1, corridor.top2, t);
                const botY = lerp(corridor.bottom1, corridor.bottom2, t);
                // Skill tester: 2px grace; normal wave: 1px
                const margin = inSkill ? 2 : 1;
                if (gdCube.y + margin < topY || gdCube.y + gdCube.h - margin > botY) {
                    gdDie();
                }
            }

            // Solid floor + ceiling
            if (gdCube.y < gdCeilY) gdCube.y = gdCeilY;
            if (gdCube.y + gdCube.h > gdGroundY) {
                gdCube.y = gdGroundY - gdCube.h;
                // In empty recovery zones, landing re-arms "rest" until next hold for skill tester
                if (inSkill && !gdHold() && !(corridor && bestDist <= gdSpeed * 2.5)) {
                    waveSkillArmed = false;
                    gdCube.vy = 0;
                    gdCube.rot = 0;
                }
            }

            for (let o of gdObstacles) {
                const sx = o.x - gdScroll;
                if (o.type === "waveSlope") {
                    // corridor test above
                } else if (o.type === "sawblade" && gdSawbladeHit(gdCube, o, sx)) {
                    gdDie(); break;
                } else if (o.type === "spike" || o.type === "spikeDown") {
                    if (gdSpikeHit(gdCube, o, sx)) { gdDie(); break; }
                } else if (o.type === "hazard") {
                    if (rectsOverlap(gdCube.x + 2, gdCube.y + 2, gdCube.w - 4, gdCube.h - 4,
                        sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                        gdDie(); break;
                    }
                } else if (o.type === "block" || o.type === "wall") {
                    if (gdFlyingBlockCollide(gdCube, o, sx)) { gdDie(); break; }
                } else if (o.type === "slope") {
                    if (gdFlyingSlopeCollide(gdCube, o, sx)) { gdDie(); break; }
                } else if (o.type === "goal") {
                    if (gdPlayerRectOverlap(gdCube, sx, o.y, o.w, o.h)) gdFinish();
                }
            }
        }
    }

    // Sawblades kill every mode on contact
    if (!gameOver && !gdWon) {
        gdCheckSawbladesFor(gdCube);
        if (gdDual && gdCube2) gdCheckSawbladesFor(gdCube2);
    }
    // Coins + goal for every vehicle (including ones that forgot local checks)
    // Dual twin — independent per-vehicle physics (match primary)
    if (gdDual && gdCube2 && !gameOver && !gdWon) {
        const hold = gdHold();
        let g2 = gdGravityDir2 || -1;
        const v2 = gdVehicle2 || "cube";
        gdCube2.x = gdCube.x;
        const want = gdVehicleSize(v2, gdPlayerSize2);
        if (Math.abs(gdCube2.w - want) > 0.5) {
            const cx = gdCube2.x + gdCube2.w / 2, cy = gdCube2.y + gdCube2.h / 2;
            gdCube2.w = want; gdCube2.h = want;
            gdCube2.x = cx - want / 2; gdCube2.y = cy - want / 2;
        }
        // Arm as soon as input is released (or already released) — no extra lag
        if (gdCube2._arm == null) gdCube2._arm = !hold;
        if (!gdCube2._arm && !hold) gdCube2._arm = true;
        const armed = gdCube2._arm;

        if (v2 === "ship") {
            // Match primary GD-style ship (strong climb, soft fall)
            const thrust = 0.95, grav = 0.34;
            if (hold) gdCube2.vy -= thrust * g2;
            else gdCube2.vy += grav * g2;
            if (g2 > 0) gdCube2.vy = constrain(gdCube2.vy, -10.5, 5.6);
            else gdCube2.vy = constrain(gdCube2.vy, -5.6, 10.5);
            gdCube2.y += gdCube2.vy;
            gdCube2.rot = constrain(gdCube2.vy * 0.055 * g2, -1.15, 1.15);
            gdCube2.onGround = false;
            if (gdCube2.y < gdCeilY) { gdCube2.y = gdCeilY; gdCube2.vy = 0; }
            if (gdCube2.y + gdCube2.h > gdGroundY) { gdCube2.y = gdGroundY - gdCube2.h; gdCube2.vy = 0; }
        } else if (v2 === "ufo") {
            // each TAP = bounce (edge-triggered)
            if (armed && hold && !gdCube2._ufoLatch) {
                gdCube2.vy = -8.2 * g2;
                gdCube2._ufoLatch = true;
                playJumpSound();
            }
            if (!hold) gdCube2._ufoLatch = false;
            gdCube2.vy += 0.48 * g2;
            gdCube2.vy = constrain(gdCube2.vy, -11, 11);
            gdCube2.y += gdCube2.vy;
            gdCube2.rot = constrain(gdCube2.vy * 0.04, -0.55, 0.55);
            gdCube2.onGround = false;
            if (gdCube2.y < gdCeilY) { gdCube2.y = gdCeilY; if (gdCube2.vy < 0) gdCube2.vy = 0; }
            if (gdCube2.y + gdCube2.h > gdGroundY) { gdCube2.y = gdGroundY - gdCube2.h; if (gdCube2.vy > 0) gdCube2.vy = 0; }
        } else if (v2 === "dart") {
            // Match primary: hold = set climb speed, release = soft gravity (NOT ship accel)
            if (armed) {
                if (hold) {
                    gdCube2.vy = -5.5 * g2;
                } else {
                    gdCube2.vy += 0.22 * g2;
                    if (g2 > 0 && gdCube2.vy > 4.8) gdCube2.vy = 4.8;
                    if (g2 < 0 && gdCube2.vy < -4.8) gdCube2.vy = -4.8;
                }
                gdCube2.y += gdCube2.vy;
            }
            gdCube2.y = constrain(gdCube2.y, gdCeilY + 2, gdGroundY - gdCube2.h - 2);
            gdCube2.onGround = false;
            gdCube2.rot = Math.atan2(gdCube2.vy, gdSpeed || 5) * 0.55;
        } else if (v2 === "wave") {
            const sp = 5.2;
            if (armed) {
                gdCube2.vy = (hold ? -sp : sp) * g2;
                gdCube2.y += gdCube2.vy;
                gdCube2.rot = hold ? -Math.PI / 4 : Math.PI / 4;
            }
            gdCube2.onGround = false;
            gdWaveTrail2.push({ x: gdScroll + gdCube2.x + gdCube2.w / 2, y: gdCube2.y + gdCube2.h / 2 });
            if (gdWaveTrail2.length > 55) gdWaveTrail2.shift();
            if (gdCube2.y < gdCeilY) gdCube2.y = gdCeilY;
            if (gdCube2.y + gdCube2.h > gdGroundY) gdCube2.y = gdGroundY - gdCube2.h;
        } else if (v2 === "ball") {
            // Ball: ONLY flip when on ground (edge). Never "fly" on hold in mid-air.
            if (armed && hold && !gdCube2._latched && gdCube2.onGround) {
                gdGravityDir2 = -g2;
                g2 = gdGravityDir2;
                gdCube2._latched = true;
                gdCube2.onGround = false;
                gdCube2.vy = g2 * 6.5;
                playJumpSound();
            }
            if (!hold) gdCube2._latched = false;
            if (!gdCube2.onGround) {
                gdCube2.vy += 0.78 * g2;
                gdCube2.vy = constrain(gdCube2.vy, -22, 22);
            } else {
                gdCube2.vy = g2 * 0.5;
            }
            gdCube2.y += gdCube2.vy;
            gdCube2.rot = (gdCube2.rot || 0) + g2 * 0.22;
            // stick to surfaces
            if (g2 > 0 && gdCube2.vy >= 0 && gdCube2.y + gdCube2.h >= gdGroundY - 0.5) {
                gdCube2.y = gdGroundY - gdCube2.h; gdCube2.vy = 0; gdCube2.onGround = true;
            } else if (g2 < 0 && gdCube2.vy <= 0 && gdCube2.y <= gdCeilY + 0.5) {
                gdCube2.y = gdCeilY; gdCube2.vy = 0; gdCube2.onGround = true;
            } else {
                gdCube2.onGround = false;
            }
        } else if (v2 === "swing") {
            // Swing: edge flip of direction + continuous accel (same as primary)
            if (armed && hold && !gdCube2._latched) {
                gdGravityDir2 = -g2;
                g2 = gdGravityDir2;
                gdCube2._latched = true;
                playJumpSound();
            }
            if (!hold) gdCube2._latched = false;
            gdCube2.vy += 0.43 * g2;
            gdCube2.vy = constrain(gdCube2.vy, -7.0, 7.0);
            gdCube2.y += gdCube2.vy;
            gdCube2.rot = g2 > 0 ? 0.5 : -0.5;
            gdCube2.onGround = false;
            // out of bounds = death (like primary)
            if (gdCube2.y < gdCeilY - 4 || gdCube2.y + gdCube2.h > gdGroundY + 4) {
                deathCause = "Dual swing OOB";
                gdDie();
            }
        } else if (v2 === "spider") {
            if (armed && hold && !gdCube2._latched && gdCube2.onGround) {
                gdGravityDir2 = -g2; g2 = gdGravityDir2;
                gdCube2._latched = true;
                if (g2 > 0) gdCube2.y = gdGroundY - gdCube2.h;
                else gdCube2.y = gdCeilY;
                gdCube2.vy = 0; gdCube2.onGround = true;
            }
            if (!hold) gdCube2._latched = false;
        } else if (v2 === "robot") {
            if (!hold) gdCube2._robotLatch = false;
            if (armed && gdCube2.onGround && hold && !gdCube2._robotLatch) {
                gdCube2.vy = -7.2 * g2;
                gdCube2.onGround = false;
                gdCube2._robotJumping = true; gdCube2._robotTime = 0;
                gdCube2._robotLatch = true; playJumpSound();
            }
            if (gdCube2._robotJumping && hold && (gdCube2._robotTime || 0) < 22
                && ((g2 > 0 && gdCube2.vy < 0) || (g2 < 0 && gdCube2.vy > 0))) {
                gdCube2.vy -= 0.42 * g2; gdCube2.vy += 0.18 * g2;
                gdCube2._robotTime = (gdCube2._robotTime || 0) + 1;
                if (g2 > 0 && gdCube2.vy < -12) gdCube2.vy = -12;
                if (g2 < 0 && gdCube2.vy > 12) gdCube2.vy = 12;
            } else {
                if (!hold || (gdCube2._robotTime || 0) >= 22 || (g2 > 0 ? gdCube2.vy >= 0 : gdCube2.vy <= 0))
                    gdCube2._robotJumping = false;
                gdCube2.vy += 0.55 * g2;
            }
            if (g2 > 0) { if (gdCube2.vy > 13) gdCube2.vy = 13; }
            else { if (gdCube2.vy < -13) gdCube2.vy = -13; }
            gdCube2.y += gdCube2.vy; gdCube2.onGround = false;
            if (g2 > 0) {
                if (gdCube2.y + gdCube2.h >= gdGroundY) {
                    gdCube2.y = gdGroundY - gdCube2.h; gdCube2.vy = 0; gdCube2.onGround = true; gdCube2._robotJumping = false;
                }
                if (gdCube2.y < gdCeilY) { gdCube2.y = gdCeilY; if (gdCube2.vy < 0) gdCube2.vy = 0; }
            } else {
                if (gdCube2.y <= gdCeilY) {
                    gdCube2.y = gdCeilY; gdCube2.vy = 0; gdCube2.onGround = true; gdCube2._robotJumping = false;
                }
                if (gdCube2.y + gdCube2.h > gdGroundY) { gdCube2.y = gdGroundY - gdCube2.h; if (gdCube2.vy > 0) gdCube2.vy = 0; }
            }
            gdCube2.rot = gdCube2.onGround ? 0 : constrain(gdCube2.vy * 0.035, -0.45, 0.45);
        } else {
            // cube / mini — one jump per landing; hold auto-jumps on next land (no per-frame spam)
            if (!gdCube2.onGround) gdCube2._jumpLatch = false;
            if (armed && hold && gdCube2.onGround && !gdCube2._jumpLatch) {
                gdCube2.vy = -10.5 * g2;
                gdCube2.onGround = false;
                gdCube2._jumpLatch = true;
                playJumpSound();
            }
            gdCube2.vy += 0.52 * g2;
            if (g2 < 0) { if (gdCube2.vy < -13) gdCube2.vy = -13; }
            else { if (gdCube2.vy > 13) gdCube2.vy = 13; }
            gdCube2.y += gdCube2.vy; gdCube2.onGround = false;
            if (g2 < 0) {
                if (gdCube2.y <= gdCeilY) { gdCube2.y = gdCeilY; gdCube2.vy = 0; gdCube2.onGround = true; }
            } else {
                if (gdCube2.y + gdCube2.h >= gdGroundY) { gdCube2.y = gdGroundY - gdCube2.h; gdCube2.vy = 0; gdCube2.onGround = true; }
            }
            if (!gdCube2.onGround) gdCube2.rot = (gdCube2.rot || 0) + 0.16;
            else gdCube2.rot = Math.round((gdCube2.rot || 0) / (Math.PI / 2)) * (Math.PI / 2);
        }

        // Full collisions: blocks (land/hit), slopes, spikes, pads
        if (!gameOver) for (let o of gdObstacles) {
            if (gameOver || !gdCube2) break;
            const sx = o.x - gdScroll;
            if (o.type === "spike" || o.type === "spikeDown") {
                if (gdSpikeHit(gdCube2, o, sx)) { deathCause = "Dual spike"; gdDie(); break; }
            } else if (o.type === "hazard") {
                if (rectsOverlap(gdCube2.x + 2, gdCube2.y + 2, gdCube2.w - 4, gdCube2.h - 4,
                    sx + 2, o.y + 2, o.w - 4, o.h - 4)) {
                    deathCause = "Dual crashed";
                    gdDie();
                    break;
                }
            } else if (o.type === "sawblade") {
                if (gdSawbladeHit(gdCube2, o, sx)) { deathCause = "Dual saw"; gdDie(); break; }
            } else if (o.type === "block" || o.type === "wall") {
                if (!gdPlayerBlockOverlap(gdCube2, sx, o.y, o.w, o.h)) continue;
                const fly = (v2 === "ship" || v2 === "ufo" || v2 === "dart" || v2 === "wave" || v2 === "swing");
                if (fly) {
                    if (gdFlyingBlockCollide(gdCube2, o, sx)) { deathCause = "Dual front block"; gdDie(); break; }
                    continue;
                }
                const prevBottom = gdCube2.y + gdCube2.h - gdCube2.vy;
                if (gdCube2.vy > 0 && prevBottom <= o.y + 6) {
                    gdCube2.y = o.y - gdCube2.h;
                    gdCube2.vy = 0;
                    gdCube2.onGround = true;
                } else if (gdCube2.vy < 0 && gdCube2.y - gdCube2.vy >= o.y + o.h - 6) {
                    gdCube2.y = o.y + o.h;
                    gdCube2.vy = 0;
                    gdCube2.onGround = true;
                } else {
                    if (gdBlockSideLethal(gdCube2, o, sx)) {
                        deathCause = "Dual hit block";
                        gdDie();
                        break;
                    }
                }
            } else if (o.type === "slope") {
                const fly = (v2 === "ship" || v2 === "ufo" || v2 === "dart" || v2 === "wave" || v2 === "swing");
                if (fly) {
                    if (gdFlyingSlopeCollide(gdCube2, o, sx)) { deathCause = "Dual slope"; gdDie(); break; }
                    continue;
                }
                if (gdCube2.x + gdCube2.w < sx || gdCube2.x > sx + o.w) continue;
                const surfaceY = gdSlopeSurfaceY(o, sx, gdCube2.x + gdCube2.w * 0.5);
                if (g2 > 0 && gdCube2.y + gdCube2.h >= surfaceY - 4 && gdCube2.y + gdCube2.h <= surfaceY + 12 && gdCube2.vy >= 0) {
                    gdCube2.y = surfaceY - gdCube2.h;
                    gdCube2.vy = 0;
                    gdCube2.onGround = true;
                } else if (g2 < 0 && gdCube2.y <= surfaceY + 4 && gdCube2.y >= surfaceY - 12 && gdCube2.vy <= 0) {
                    gdCube2.y = surfaceY;
                    gdCube2.vy = 0;
                    gdCube2.onGround = true;
                }
            } else if (o.type === "padYellow" || o.type === "padPink" || o.type === "padBlue") {
                if (rectsOverlap(gdCube2.x - 2, gdCube2.y - 2, gdCube2.w + 4, gdCube2.h + 4, sx, o.y, o.w, o.h)) {
                    if (!o._pad2) {
                        o._pad2 = true;
                        const facing = o.facing != null ? o.facing : 1;
                        const launch = (facing > 0) ? -g2 : g2;
                        const boost = o.type === "padPink" ? 21.5 : (o.type === "padBlue" ? 11.8 : 15.5);
                        if (o.type === "padBlue") {
                            gdGravityDir2 = -g2;
                            gdCube2.vy = -gdCube2.vy;
                            if (Math.abs(gdCube2.vy) < 2) gdCube2.vy = gdGravityDir2 * 4;
                        } else {
                            gdCube2.vy = launch * boost;
                        }
                        gdCube2.onGround = false;
                        playJumpSound();
                    }
                } else {
                    o._pad2 = false;
                }
            } else if (o.type === "goal") {
                if (gdPlayerRectOverlap(gdCube2, sx, o.y, o.w, o.h)) {
                    gdFinish();
                    break;
                }
            }
        }
        if (!gameOver && gdCube2) {
            gdCube2.y = constrain(gdCube2.y, gdCeilY, gdGroundY - gdCube2.h);
        }
    }

    if (gameOver || gdWon) return;

    gdCollectCoinsAndGoals();

    // Capture the live GD state for death replay. Do this after physics/collision so the replay shows the actual run.
    if (!gameOver && !gdWon) recordGDReplayFrame();
}

// Ordinary hitbox: full player bounds. The centered 20x20 core is ONLY for blocks/slopes.
function gdPhysicsBody(body) {
    if (!body) return null;
    return { x: body.x, y: body.y, w: body.w || 20, h: body.h || 20 };
}
function gdBlockPhysicsBody(body) {
    if (!body) return null;
    const fullW = body.w || 20, fullH = body.h || 20;
    const w = Math.min(20, fullW), h = Math.min(20, fullH);
    return { x: body.x + (fullW - w) / 2, y: body.y + (fullH - h) / 2, w, h };
}
function gdPlayerRectOverlap(body, x, y, w, h, inset = 0) {
    return !!body && rectsOverlap(body.x + inset, body.y + inset, Math.max(0, body.w - inset * 2), Math.max(0, body.h - inset * 2), x, y, w, h);
}
function gdPlayerBlockOverlap(body, x, y, w, h, inset = 0) {
    const b = gdBlockPhysicsBody(body);
    return !!b && rectsOverlap(b.x + inset, b.y + inset, Math.max(0, b.w - inset * 2), Math.max(0, b.h - inset * 2), x, y, w, h);
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function recordGDReplayFrame() {
    if (!gdCube || gameOver || gdWon) return;
    const visible = [];
    for (let o of gdObstacles) {
        const sx = o.x - gdScroll;
        const ow = o.w || 0;
        if (sx + ow < -40 || sx > sirina + 40) continue;
        const copy = { type: o.type, x: sx, y: o.y, w: ow, h: o.h || 0 };
        if (o.type === "waveSlope") {
            copy.top1 = o.top1; copy.top2 = o.top2;
            copy.bottom1 = o.bottom1; copy.bottom2 = o.bottom2;
        }
        visible.push(copy);
    }
    gdReplayRecording.push({
        kind: "gd", vehicle: gdVehicle, x: gdCube.x, y: gdCube.y, w: gdCube.w, h: gdCube.h,
        rot: gdCube.rot, score: floor(gdScroll / 20), obstacles: visible,
        trail: gdVehicle === "wave" ? gdWaveTrail.map(pt => ({ x: pt.x - gdScroll, y: pt.y })) : [],
        ground: gdGroundY, ceil: gdCeilY, started: gdStarted
    });
    if (gdReplayRecording.length > REPLAY_MAX) gdReplayRecording.shift();
}

function saveCurrentGDReplay() {
    if (gdReplayRecording.length < 5) return;
    try {
        // Keep only last ~240 frames to avoid freezing the main thread on stringify
        const frames = gdReplayRecording.length > 240
            ? gdReplayRecording.slice(gdReplayRecording.length - 240)
            : gdReplayRecording.slice();
        const entry = {
            kind: "gd", frames: frames,
            score: gdTotalScore(), mode: gameMode, time: Date.now()
        };
        savedReplays.unshift(entry);
        if (savedReplays.length > SAVED_REPLAYS_MAX) savedReplays.pop();
        try { localStorage.setItem("savedDeathReplays", JSON.stringify(savedReplays)); } catch (e) {
            try {
                // Drop oldest frames further if storage is full
                const compact = savedReplays.slice(0, 3).map(r => ({
                    kind: r.kind || "snake", score: r.score, mode: r.mode, time: r.time,
                    frames: (r.frames || []).slice(-120)
                }));
                localStorage.setItem("savedDeathReplays", JSON.stringify(compact));
            } catch (_) {}
        }
    } catch (e) {
        console.warn("saveCurrentGDReplay failed", e);
    }
}

let gdLastCoinsEarned = 0;



// Flying modes: only die on blocks/slopes from the FRONT (side), not top/bottom graze

function gdCheckSawbladesFor(body) {
    if (!body || gameOver || gdWon) return;
    for (let o of gdObstacles) {
        if (o.type !== "sawblade") continue;
        const sx = o.x - gdScroll;
        if (gdSawbladeHit(body, o, sx)) { gdDie(); return; }
    }
}
function gdPointInTri(px, py, x1, y1, x2, y2, x3, y3) {
    const s1 = (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
    const s2 = (px - x3) * (y2 - y3) - (x2 - x3) * (py - y3);
    const s3 = (px - x1) * (y3 - y1) - (x3 - x1) * (py - y1);
    const neg = (s1 < 0) || (s2 < 0) || (s3 < 0);
    const pos = (s1 > 0) || (s2 > 0) || (s3 > 0);
    return !(neg && pos);
}
// Spike: triangular hitbox (floor = tip up, ceiling = tip down)
// Spider teleport: find opposite surface (floor/ceil/block/slope) along vertical line
// flipDir > 0 → search downward for stand-on tops; flipDir < 0 → search upward for hang-on bottoms
// Is spider still standing/hanging on something at current X?
function gdSpiderStillSupported(gDir) {
    if (!gdCube) return { ok: false };
    const left = gdCube.x + 3, right = gdCube.x + gdCube.w - 3;
    const cx = (left + right) * 0.5;
    const h = gdCube.h;
    // Floor / ceiling always count
    if (gDir > 0) {
        if (Math.abs((gdCube.y + h) - gdGroundY) <= 6) return { ok: true, y: gdGroundY - h };
    } else {
        if (Math.abs(gdCube.y - gdCeilY) <= 6) return { ok: true, y: gdCeilY };
    }
    for (let o of gdObstacles) {
        const sx = o.x - gdScroll;
        if (right <= sx + 1 || left >= sx + (o.w || 0) - 1) continue;
        if (o.type === "block" || o.type === "plat" || o.type === "wall") {
            if (gDir > 0) {
                const ty = o.y - h;
                if (Math.abs(gdCube.y - ty) <= 8 || Math.abs((gdCube.y + h) - o.y) <= 8)
                    return { ok: true, y: ty };
            } else {
                const ty = o.y + o.h;
                if (Math.abs(gdCube.y - ty) <= 8) return { ok: true, y: ty };
            }
        } else if (o.type === "slope") {
            const surfaceY = gdSlopeSurfaceY(o, sx, cx);
            if (gDir > 0) {
                const ty = surfaceY - h;
                if (Math.abs(gdCube.y - ty) <= 10 || Math.abs((gdCube.y + h) - surfaceY) <= 10)
                    return { ok: true, y: ty };
            } else {
                if (Math.abs(gdCube.y - surfaceY) <= 10) return { ok: true, y: surfaceY };
            }
        }
    }
    return { ok: false };
}
function gdSpiderFindDestY(flipDir) {
    if (!gdCube) return null;
    const left = gdCube.x + 2, right = gdCube.x + gdCube.w - 2;
    const cx = (left + right) * 0.5;
    const h = gdCube.h;
    const curTop = gdCube.y, curBot = gdCube.y + h;
    let best = null;
    const consider = (cubeY) => {
        if (cubeY == null || isNaN(cubeY)) return;
        cubeY = constrain(cubeY, gdCeilY, gdGroundY - h);
        if (flipDir < 0) {
            // going up: dest must be above current (smaller y), take closest (largest among those above)
            if (cubeY >= curTop - 1) return;
            if (best == null || cubeY > best) best = cubeY;
        } else {
            // going down: dest below current, closest (smallest among those below)
            if (cubeY <= curBot - h + 1) return;
            if (best == null || cubeY < best) best = cubeY;
        }
    };
    if (flipDir < 0) {
        consider(gdCeilY); // hang from ceiling
    } else {
        consider(gdGroundY - h);
    }
    for (let o of gdObstacles) {
        const sx = o.x - gdScroll;
        if (right <= sx + 1 || left >= sx + (o.w || 0) - 1) continue;
        if (o.type === "block" || o.type === "plat" || o.type === "wall") {
            if (flipDir < 0) consider(o.y + o.h); // underside
            else consider(o.y - h); // top
        } else if (o.type === "slope") {
            const surfaceY = gdSlopeSurfaceY(o, sx, cx);
            if (flipDir < 0) consider(surfaceY); // hang roughly at surface when inverted
            else consider(surfaceY - h);
        }
    }
    return best;
}
// True if a spike/saw intersects the vertical teleport segment
function gdSpiderPathBlocked(y0, y1) {
    if (!gdCube) return false;
    const top = Math.min(y0, y1), bot = Math.max(y0, y1);
    const left = gdCube.x + 3, right = gdCube.x + gdCube.w - 3;
    const probe = { x: gdCube.x, y: 0, w: gdCube.w, h: gdCube.h };
    for (let o of gdObstacles) {
        const sx = o.x - gdScroll;
        if (o.type === "spike" || o.type === "spikeDown") {
            // sample along path
            for (let t = 0; t <= 1.001; t += 0.12) {
                probe.y = top + (bot - top - gdCube.h) * t;
                if (probe.y < top - 2) probe.y = top;
                if (gdSpikeHit(probe, o, sx)) return true;
            }
        } else if (o.type === "sawblade") {
            for (let t = 0; t <= 1.001; t += 0.1) {
                probe.y = top + (bot - top - gdCube.h) * Math.min(1, t);
                if (gdSawbladeHit(probe, o, sx)) return true;
            }
        } else if (o.type === "hazard") {
            const oy0 = o.y, oy1 = o.y + o.h;
            if (right > sx + 2 && left < sx + o.w - 2 && bot > oy0 + 2 && top < oy1 - 2) return true;
        }
    }
    return false;
}

function gdSpikeHit(cube, o, sx) {
    if (!cube || !o) return false;
    cube = gdPhysicsBody(cube);
    let x1, y1, x2, y2, x3, y3;
    if (o.type === "spike") {
        x1 = sx; y1 = o.y + o.h;
        x2 = sx + o.w * 0.5; y2 = o.y;
        x3 = sx + o.w; y3 = o.y + o.h;
    } else if (o.type === "spikeDown") {
        x1 = sx; y1 = o.y;
        x2 = sx + o.w * 0.5; y2 = o.y + o.h;
        x3 = sx + o.w; y3 = o.y;
    } else return false;
    const pts = [
        [cube.x + 3, cube.y + 3],
        [cube.x + cube.w - 3, cube.y + 3],
        [cube.x + 3, cube.y + cube.h - 3],
        [cube.x + cube.w - 3, cube.y + cube.h - 3],
        [cube.x + cube.w * 0.5, cube.y + cube.h * 0.5]
    ];
    for (let p of pts) {
        if (gdPointInTri(p[0], p[1], x1, y1, x2, y2, x3, y3)) return true;
    }
    if (rectsOverlap(cube.x + 2, cube.y + 2, cube.w - 4, cube.h - 4, x2 - 2, y2 - 2, 4, 4)) return true;
    return false;
}
// Circle (saw) vs player AABB — true round hitbox
function gdSawbladeHit(cube, o, sx) {
    if (!cube || !o || o.type !== "sawblade") return false;
    cube = gdPhysicsBody(cube);
    const ox = sx + o.w * 0.5, oy = o.y + o.h * 0.5;
    const r = Math.min(o.w, o.h) * 0.48;
    // closest point on player rect to circle center
    const nx = constrain(ox, cube.x + 1, cube.x + cube.w - 1);
    const ny = constrain(oy, cube.y + 1, cube.y + cube.h - 1);
    const dx = ox - nx, dy = oy - ny;
    return dx * dx + dy * dy <= r * r;
}
// Flying modes: blocks SUPPORT on top/bottom; only FRONT kills. Returns true = death.
// Platformer: blocks never kill — push player out horizontally. Classic: lethal side hit.
function gdBlockSideLethal(cube, o, sx) {
    if (typeof gdPlatformerMode !== "undefined" && gdPlatformerMode) {
        const cx = cube.x + cube.w * 0.5;
        const ox = sx + o.w * 0.5;
        if (cx < ox) cube.x = sx - cube.w;
        else cube.x = sx + o.w;
        return false;
    }
    return true;
}

function gdFlyingBlockCollide(cube, o, sx) {
    if (!cube || !o) return false;
    const core = gdBlockPhysicsBody(cube);
    const offX = core.x - cube.x, offY = core.y - cube.y;
    const cl = core.x, cr = core.x + core.w, ct = core.y, cb = core.y + core.h;
    const ol = sx, orr = sx + o.w, ot = o.y, ob = o.y + o.h;
    if (cr <= ol || cl >= orr || cb <= ot || ct >= ob) return false;
    const overlapL = cr - ol;
    const overlapR = orr - cl;
    const overlapT = cb - ot;
    const overlapB = ob - ct;
    const minH = Math.min(overlapL, overlapR);
    const minV = Math.min(overlapT, overlapB);
    // Surface proximity: if nearly on top or under the block, always slide (never kill on gap edges)
    const surfaceSlack = 8;
    const nearTop = overlapT <= surfaceSlack;
    const nearBot = overlapB <= surfaceSlack;
    // Prefer vertical resolution generously so wave/dart can skim under/over consecutive blocks
    // without dying when briefly "seeing" a front face at a gap.
    if (nearTop || nearBot || minV <= minH + 6) {
        const cubeCy = cube.y + cube.h * 0.5;
        const oCy = o.y + o.h * 0.5;
        if (cubeCy <= oCy || nearTop) {
            cube.y = o.y - offY - core.h;
            if (cube.vy > 0) cube.vy = 0;
        } else {
            cube.y = o.y + o.h - offY;
            if (cube.vy < 0) cube.vy = 0;
        }
        return false;
    }
    // Platformer mode: blocks are solid walls, never lethal
    if (typeof gdPlatformerMode !== "undefined" && gdPlatformerMode) {
        if (overlapL < overlapR) cube.x = ol - offX - core.w;
        else cube.x = orr - offX;
        return false;
    }
    // Classic: only a clear head-on front hit is lethal (auto-scroll → left face)
    // Require substantial horizontal penetration relative to player size
    if (minH < 3) return false;
    return true;
}
// Solid slope triangle verts in screen space (respects o.rot around center)
function gdSlopeVerts(o, sx) {
    // base (no rot): dir>0 = /  (bl, br, tr); dir<0 = \ (tl, bl, br)
    let local;
    if ((o.dir || 1) > 0) {
        local = [
            [-o.w / 2,  o.h / 2], // bl
            [ o.w / 2,  o.h / 2], // br
            [ o.w / 2, -o.h / 2]  // tr
        ];
    } else {
        local = [
            [-o.w / 2, -o.h / 2], // tl
            [-o.w / 2,  o.h / 2], // bl
            [ o.w / 2,  o.h / 2]  // br
        ];
    }
    const cx = sx + o.w / 2, cy = o.y + o.h / 2;
    const rot = Number(o.rot) || 0;
    if (!rot) {
        return local.map(([lx, ly]) => [cx + lx, cy + ly]);
    }
    const rad = radians(rot);
    const c = Math.cos(rad), s = Math.sin(rad);
    return local.map(([lx, ly]) => [cx + lx * c - ly * s, cy + lx * s + ly * c]);
}

function gdSlopeSurfaceY(o, sx, worldX) {
    const rot = ((Number(o.rot) || 0) % 360 + 360) % 360;
    if (!rot) {
        const t = constrain((worldX - sx) / Math.max(1, o.w), 0, 1);
        if ((o.dir || 1) > 0) return (o.y + o.h) - t * o.h; // /
        return o.y + t * o.h; // \
    }
    // Rotated: walkable edge ≈ the edge with smallest average Y (top for normal gravity)
    const verts = gdSlopeVerts(o, sx);
    const edges = [[verts[0], verts[1]], [verts[1], verts[2]], [verts[0], verts[2]]];
    let best = edges[2], bestScore = 1e9;
    for (const e of edges) {
        const score = (e[0][1] + e[1][1]) * 0.5;
        if (score < bestScore) { bestScore = score; best = e; }
    }
    const a = best[0], b = best[1];
    const minX = Math.min(a[0], b[0]), maxX = Math.max(a[0], b[0]);
    if (maxX - minX < 1e-3) return (a[1] + b[1]) * 0.5;
    if (worldX < minX - 4 || worldX > maxX + 4) return Math.min(a[1], b[1]);
    const t = constrain((worldX - a[0]) / (b[0] - a[0]), 0, 1);
    return a[1] + t * (b[1] - a[1]);
}
// Flying on slopes: rest on the diagonal; die only if deep inside solid
function gdFlyingSlopeCollide(cube, o, sx) {
    if (!cube || !o) return false;
    const verts = gdSlopeVerts(o, sx);
    const xs = verts.map(v => v[0]), ys = verts.map(v => v[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const core = gdBlockPhysicsBody(cube);
    const offX = core.x - cube.x, offY = core.y - cube.y;
    const cl = core.x, cr = core.x + core.w, ct = core.y, cb = core.y + core.h;
    if (cr <= minX || cl >= maxX || cb <= minY || ct >= maxY) return false;
    const cx = core.x + core.w * 0.5;
    const surfaceY = gdSlopeSurfaceY(o, sx, cx);
    // Support from above the ramp (generous so ship/ufo/wave don't die on contact)
    if (cb >= surfaceY - 12 && cb <= surfaceY + 28) {
        cube.y = surfaceY - offY - core.h;
        if (cube.vy > 0) cube.vy = 0;
        return false;
    }
    // Support from below
    if (ct <= surfaceY + 12 && ct >= surfaceY - 28) {
        cube.y = surfaceY - offY;
        if (cube.vy < 0) cube.vy = 0;
        return false;
    }
    // Deep inside solid wedge → death only if clearly below the surface
    const midY = core.y + core.h * 0.5;
    if (midY > surfaceY + 14 &&
        gdPointInTri(cx, midY, verts[0][0], verts[0][1], verts[1][0], verts[1][1], verts[2][0], verts[2][1])) {
        return true;
    }
    return false;
}
function gdFlyingFrontHit(cube, o, sx) {
    if (o && o.type === "slope") return gdFlyingSlopeCollide(cube, o, sx);
    return gdFlyingBlockCollide(cube, o, sx);
}

function practiceIsActive() {
    return practiceMode && typeof isGDGameMode === "function" && isGDGameMode() && !gdAIPilot;
}
function practiceClearRun() {
    practiceCheckpoints = [];
    practiceCpIndex = -1;
    practiceLastAutoX = -1e9;
}
function practiceAddCheckpoint(isAuto) {
    if (!gdCube || !practiceIsActive()) return;
    const wx = gdScroll + gdCube.x;
    // avoid stacking identical autos
    if (isAuto && practiceCheckpoints.length) {
        const last = practiceCheckpoints[practiceCheckpoints.length - 1];
        if (Math.abs((last.scroll + last.x) - wx) < PRACTICE_AUTO_GAP * 0.5) return;
    }
    const cp = {
        scroll: gdScroll,
        x: gdCube.x,
        y: gdCube.y,
        vy: gdCube.vy || 0,
        vehicle: gdVehicle,
        vehicle2: gdVehicle2 || "cube",
        dual: !!gdDual,
        gDir: gdGravityDir || 1,
        gDir2: gdGravityDir2 || -1,
        size: gdPlayerSize || 1,
        size2: gdPlayerSize2 || 1,
        auto: !!isAuto,
        cube2y: gdCube2 ? gdCube2.y : null,
        cube2x: gdCube2 ? gdCube2.x : null,
        portalStage: gdPortalStage || 0,
        portalTotalScroll: gdPortalTotalScroll || 0
    };
    practiceCheckpoints.push(cp);
    practiceCpIndex = practiceCheckpoints.length - 1;
    if (isAuto) practiceLastAutoX = wx;
    spawnParticles(gdCube.x + gdCube.w / 2, gdCube.y + gdCube.h / 2, 8, color(80, 220, 255));
}
function practiceDeleteNearestCheckpoint() {
    if (!practiceCheckpoints.length) return;
    if (!gdCube) {
        practiceCheckpoints.pop();
        practiceCpIndex = practiceCheckpoints.length - 1;
        return;
    }
    const wx = gdScroll + gdCube.x;
    let best = 0, bestD = 1e15;
    for (let i = 0; i < practiceCheckpoints.length; i++) {
        const c = practiceCheckpoints[i];
        const d = Math.abs((c.scroll + c.x) - wx);
        if (d < bestD) { bestD = d; best = i; }
    }
    practiceCheckpoints.splice(best, 1);
    practiceCpIndex = Math.min(best, practiceCheckpoints.length - 1);
}
function practiceMaybeAutoCheckpoint() {
    if (!practiceIsActive() || !gdCube || gameOver || gdWon) return;
    const wx = gdScroll + gdCube.x;
    if (wx - practiceLastAutoX >= PRACTICE_AUTO_GAP) {
        practiceAddCheckpoint(true);
    }
}
function practiceResetObjectsFrom(worldX) {
    // Re-arm portals/pads/orbs from this world X onward so practice is completable
    if (!gdObstacles) return;
    const cut = worldX - 40;
    for (let o of gdObstacles) {
        if (!o || o.x < cut) continue;
        // vehicle / gravity portals
        if (o.type === "portalUsed") o.type = "portal";
        if (o.type === "gravityPortalUsed") o.type = "gravityPortal";
        if (o.type === "portal" || o.type === "gravityPortal" || o.type === "portalDual"
            || o.type === "endDual" || o.type === "sizePortal") {
            o.used = false;
            o._used1 = false; o._used2 = false;
            o._gUsed1 = false; o._gUsed2 = false;
            o._inside = false; o._in1 = false; o._in2 = false;
        }
        // pads / orbs
        o._padTouching = false;
        o._padTouching2 = false;
        o._orbUsed = false;
        o._orbUsed2 = false;
        // coins stay collected if already got — only un-collect ones ahead
        if (o.type === "secretCoinGot" && o.x >= cut) {
            o.type = "secretCoin";
            o._collected = false;
        }
    }
}

function practiceBodyHitsHazard(body) {
    if (!body || !gdObstacles) return false;
    for (let o of gdObstacles) {
        if (!o) continue;
        const sx = o.x - gdScroll;
        if (o.type === "spike" || o.type === "spikeDown" || o.type === "hazard" || o.type === "block" || o.type === "wall") {
            if (rectsOverlap(body.x + 2, body.y + 2, body.w - 4, body.h - 4, sx + 1, o.y + 1, o.w - 2, o.h - 2)) return true;
        }
    }
    return false;
}
function practiceSafeUnstick(body) {
    if (!body) return;
    // Try small vertical/horizontal nudges out of spikes/blocks
    const tries = [
        [0, 0], [0, -12], [0, -24], [0, -40], [0, 12], [0, 24],
        [-16, 0], [16, 0], [-16, -20], [16, -20], [0, -60], [0, 40]
    ];
    const ox = body.x, oy = body.y;
    for (let t of tries) {
        body.x = ox + t[0];
        body.y = constrain(oy + t[1], gdCeilY + 2, gdGroundY - body.h - 2);
        if (!practiceBodyHitsHazard(body)) {
            body.vy = 0;
            return;
        }
    }
    // Last resort: mid air safe lane
    body.x = ox;
    body.y = constrain((gdCeilY + gdGroundY) * 0.5 - body.h * 0.5, gdCeilY + 4, gdGroundY - body.h - 4);
    body.vy = 0;
    body.onGround = false;
}

function practiceRespawn() {
    if (!practiceIsActive()) return false;
    const cp = practiceCpIndex >= 0 ? practiceCheckpoints[practiceCpIndex]
        : (practiceCheckpoints.length ? practiceCheckpoints[practiceCheckpoints.length - 1] : null);
    gameOver = false;
    gdWon = false;
    winScreen = false;
    jumpscare = false;
    pavza = false;
    gdDashing = false;
    gdDashTimer = 0;
    deathCause = "";
    if (!cp) {
        initGeometryDash();
        practiceClearRun();
        return true;
    }
    // GD Portal Level: each stage rebuilds from x=0 — restore the correct stage first
    if (gameMode === "GD Portal Level" && typeof buildGDPortalStage === "function") {
        const wantStage = (cp.portalStage != null) ? cp.portalStage : (gdPortalStage || 0);
        gdPortalStage = wantStage;
        gdPortalTotalScroll = cp.portalTotalScroll || 0;
        buildGDPortalStage();
        // build resets scroll to 0; keep checkpoint scroll within stage
        gdScroll = cp.scroll || 0;
    } else {
        gdScroll = cp.scroll;
    }
    gdVehicle = cp.vehicle || gdVehicle || "cube";
    gdVehicle2 = cp.vehicle2 || "cube";
    gdGravityDir = cp.gDir || 1;
    gdGravityDir2 = cp.gDir2 || -1;
    gdPlayerSize = cp.size || 1;
    gdPlayerSize2 = cp.size2 || 1;
    gdDual = !!cp.dual;
    const sz = gdVehicleSize(gdVehicle, gdPlayerSize);
    gdCube = {
        x: cp.x, y: cp.y, w: sz, h: sz,
        vy: 0, onGround: false, rot: 0, shipUp: false
    };
    if (gdCube.y + sz >= gdGroundY - 4) {
        gdCube.y = gdGroundY - sz; gdCube.onGround = true;
    }
    practiceSafeUnstick(gdCube);
    if (gdDual) {
        const sz2 = gdVehicleSize(gdVehicle2, gdPlayerSize2);
        gdCube2 = {
            x: cp.cube2x != null ? cp.cube2x : cp.x,
            y: cp.cube2y != null ? cp.cube2y : gdCeilY,
            w: sz2, h: sz2, vy: 0, onGround: true, rot: 0, shipUp: false,
            _arm: true
        };
        practiceSafeUnstick(gdCube2);
    } else {
        gdCube2 = null;
    }
    practiceResetObjectsFrom(gdScroll + gdCube.x);
    gdStarted = true;
    gdWaveTrail = [];
    gdWaveTrail2 = [];
    screenShake = 4;
    return true;
}

function gdDie() {
    if (typeof lbStopLevelMusic === "function") lbStopLevelMusic();
    gdDashing = false; gdDashTimer = 0;
    if (gameOver) return;
    // Practice: respawn at last checkpoint, no coins, no game-over screen
    if (practiceIsActive()) {
        practiceRespawn();
        return;
    }
    // Builder checkpoint object respawn
    if (gdLevelCheckpoint && (gameMode === "GD Builder Test" || levelBuilder.testing)) {
        const cp = gdLevelCheckpoint;
        gdScroll = cp.scroll || 0;
        gdVehicle = cp.vehicle || "cube";
        gdGravityDir = cp.gDir || 1;
        gdPlayerSize = cp.size || 1;
        const sz = (typeof gdVehicleSize === "function") ? gdVehicleSize(gdVehicle, gdPlayerSize) : 28;
        if (gdCube) {
            gdCube.x = 100;
            gdCube.y = cp.y != null ? cp.y : (gdGroundY - sz);
            gdCube.w = sz; gdCube.h = sz;
            gdCube.vy = 0; gdCube.onGround = true; gdCube.rot = 0;
        }
        gdStarted = true;
        screenShake = 8;
        try { playDeathSound(); } catch (e) {}
        return;
    }
    if (vPodmenijuAILab || gameMode === aiLabVehicleMode() || (gdAIPilot && aiLabProfile === 3)) {
        aiLearningStats.deaths = (aiLearningStats.deaths || 0) + 1;
        aiLearningStats.learningLevel = aiLearningStats.learningLevel || {};
        aiLearningStats.bias = aiLearningStats.bias || {};
        aiLearningStats.deathMarks = aiLearningStats.deathMarks || {};

        aiLearningStats.learningLevel[gdVehicle] = (aiLearningStats.learningLevel[gdVehicle] || 0) + 1;
        aiLearningStats.lastVehicle = gdVehicle;
        aiLearningStats.lastDeathAt = floor(gdScroll / 20);

        const deathWX = gdScroll + (gdCube ? gdCube.x : 0);
        const deathY = gdCube ? (gdCube.y + gdCube.h * 0.5) : null;
        let marks = aiLearningStats.deathMarks[gdVehicle] || [];
        marks = marks.map(m => (typeof m === "number" ? { x: m, count: 1, strategy: 0 } : m));
        let found = null;
        for (let m of marks) {
            if (abs(m.x - deathWX) < 120) { found = m; break; }
        }
        if (found) {
            found.count = (found.count || 1) + 1;
            found.x = deathWX;
            found.deathY = deathY;
            found.strategy = ((found.strategy || 0) + 1) % AI_LEARN_STRATEGIES.length;
        } else {
            marks.push({ x: deathWX, count: 1, strategy: 0, deathY: deathY });
            if (marks.length > 10) marks = marks.slice(-10);
        }
        aiLearningStats.deathMarks[gdVehicle] = marks;

        const hz = gdAIChooseHazard(deathWX);
        let bias = aiLearningStats.bias[gdVehicle] || 0;
        if (hz) {
            if (hz.type === "spike" || hz.type === "gap") {
                aiLearningStats.spike = (aiLearningStats.spike || 0) + 1;
                bias = constrain(bias + 8, -50, 90);
            } else if (hz.type === "spikeDown") {
                aiLearningStats.ceiling = (aiLearningStats.ceiling || 0) + 1;
                bias = constrain(bias - 8, -50, 90);
            } else {
                aiLearningStats.timing = (aiLearningStats.timing || 0) + 1;
                bias = constrain(bias + 4, -50, 90);
            }
        } else {
            aiLearningStats.timing = (aiLearningStats.timing || 0) + 1;
            bias = constrain(bias + 5, -50, 90);
        }
        aiLearningStats.bias[gdVehicle] = bias;

        // Remember which strategy is active for UI
        const active = found || marks[marks.length - 1];
        if (active) {
            aiLearningStats.lastStrategy = AI_LEARN_STRATEGIES[active.strategy % AI_LEARN_STRATEGIES.length].label;
            aiLearningStats.lastMarkCount = active.count;
        }

        try { localStorage.setItem("aiLearningStats", JSON.stringify(aiLearningStats)); } catch (e) {}
        if (gdAIPilot && aiLabProfile === 3) gdAITrainingCooldown = 30;
    }
    if (!deathCause) deathCause = "Spike / obstacle";
    // Keep hitbox trail after death so the player can review the path (cleared only on new attempt).
    gameOver = true;
    saveCurrentGDReplay();
    if (/fall|gap|fell/i.test(String(deathCause || ""))) playFallSound();
    else playDeathSound();
    screenShake = 12;
    if (gdCube) spawnParticles(gdCube.x + gdCube.w / 2, gdCube.y + gdCube.h / 2, 18, color(255, 40, 40));
    let sc = gdTotalScore();
    // Better rewards: 1 coin per 5 score, min 2, + distance bonus
    gdLastCoinsEarned = max(2, floor(sc / 5) + floor(sc / 25));
    kovanci += gdLastCoinsEarned;
    localStorage.setItem("snakeCoins", kovanci);
    let modeName = gameMode;
    if (sc > (rekordi[modeName] || 0)) {
        rekordi[modeName] = sc;
        localStorage.setItem("snakeHighScore_" + modeName, sc);
        isNewHighScore = true;
    }
    if (random() < jumpscareChance) { jumpscare = true; jumpscareTimer = 7; playJumpscareSound(); }
}
function gdFinish() {
    if (typeof lbStopLevelMusic === "function") lbStopLevelMusic();
    if (gdWon) return;
    gdWon = true;
    winScreen = true;
    let sc = gdTotalScore();
    // Finish bonus
    let clearBonus = 15;
    if (gameMode === "Stereo Madness") clearBonus = 80;
    if (gameMode === "Wave Skill Tester") clearBonus = 120;
    if (gameMode === "Pulse Factory") clearBonus = 90;
    if (practiceIsActive()) {
        gdLastCoinsEarned = 0; // practice = no coins
    } else {
        gdLastCoinsEarned = max(5, floor(sc / 4) + clearBonus);
        kovanci += gdLastCoinsEarned;
        localStorage.setItem("snakeCoins", kovanci);
    }
    if (sc > (rekordi[gameMode] || 0)) {
        rekordi[gameMode] = sc;
        localStorage.setItem("snakeHighScore_" + gameMode, sc);
        isNewHighScore = true;
    }
    // Achievements + rewards (not in practice)
    if (!gdAIPilot && !practiceIsActive()) {
        if (gameMode === "Stereo Madness") unlockAchievement("stereoMadnessClear", "stereoGlowTrail");
        if (gameMode === "Wave Skill Tester") unlockAchievement("waveSkillClear", "wavePerfectAura");
        if (gameMode === "Pulse Factory") unlockAchievement("pulseFactoryClear", "pulseFactorySkin");
    }
    // restore FPS after wave skill
    if (gameMode === "Wave Skill Tester") frameRate(60);
    playWinSound();
    playCoinSound();
}

function _lbDrawObstaclesLikeGame() {
    if (!gdObstacles || !gdObstacles.length) return;
    for (let o of gdObstacles) {
        if (o.type === "decoPixel") continue; // drawn in final pass (always on top)
        if (o.type === "decoStroke") {
            if (o.pts && o.pts.length) {
                const col = o.color || [210, 160, 255];
                const sw = o.size != null ? o.size : 4;
                stroke(col[0], col[1], col[2], 230);
                strokeWeight(sw);
                strokeJoin(ROUND); strokeCap(ROUND);
                noFill();
                if (o.pts.length === 1) {
                    noStroke(); fill(col[0], col[1], col[2], 230);
                    ellipse(o.pts[0].x - gdScroll, o.pts[0].y, sw, sw);
                } else {
                    beginShape();
                    for (const p of o.pts) vertex(p.x - gdScroll, p.y);
                    endShape();
                }
                noStroke();
            }
            continue;
        }
        let sx = o.x - gdScroll;
        // Visible if ANY part is on screen (long slopes/wave must not vanish when start is off-edge)
        const ow = (o.w != null) ? o.w : 40;
        if (sx + ow < -40 || sx > sirina + 40) continue;
        if (o.type === "spike") {
            fill(230, 50, 70);
            triangle(sx, o.y + o.h, sx + o.w / 2, o.y, sx + o.w, o.y + o.h);
        } else if (o.type === "spikeDown") {
            fill(230, 50, 70);
            triangle(sx, o.y, sx + o.w / 2, o.y + o.h, sx + o.w, o.y);
        } else if (o.type === "block" || o.type === "wall") {
            fill(50, 200, 230); stroke(20); strokeWeight(2);
            rect(sx, o.y, o.w, o.h, 3);
            noStroke();
        } else if (o.type === "sawblade") {
            const cx = sx + o.w / 2, cy = o.y + o.h / 2, r = Math.min(o.w, o.h) / 2;
            push();
            translate(cx, cy);
            rotate(frameCount * 0.18);
            fill(200, 40, 40); stroke(255, 200, 80); strokeWeight(2);
            beginShape();
            const teeth = 12;
            for (let i = 0; i < teeth; i++) {
                const a0 = (i / teeth) * TWO_PI;
                const a1 = ((i + 0.5) / teeth) * TWO_PI;
                vertex(cos(a0) * r * 0.72, sin(a0) * r * 0.72);
                vertex(cos(a1) * r, sin(a1) * r);
            }
            endShape(CLOSE);
            noStroke(); fill(30); ellipse(0, 0, r * 0.45, r * 0.45);
            fill(180); ellipse(0, 0, r * 0.18, r * 0.18);
            pop();
        } else if (o.type === "deco") {
            fill(180, 140, 255, 120); stroke(200, 160, 255, 180); strokeWeight(1);
            rect(sx, o.y, o.w, o.h, 4);
            noStroke();
            fill(255, 220, 255, 160); textSize(9); textAlign(CENTER, CENTER);
            text("✦", sx + o.w / 2, o.y + o.h / 2);
        } else if (o.type === "decoStroke") {
            if (o.pts && o.pts.length > 1) {
                stroke(210, 160, 255, 230); strokeWeight(3); noFill();
                beginShape();
                for (const p of o.pts) vertex(p.x - gdScroll, p.y);
                endShape();
                noStroke();
            }
        } else if (o.type === "startPos") {
            // visual only
            fill(80, 255, 120, 100); stroke(40, 200, 80); strokeWeight(2);
            rect(sx, o.y, o.w, o.h, 6);
            fill(20, 120, 40); noStroke(); textAlign(CENTER, CENTER); textSize(10);
            text("START", sx + o.w / 2, o.y + o.h / 2);
        } else if (o.type === "checkpoint") {
            const on = o.activated;
            fill(on ? color(80, 255, 160, 180) : color(255, 200, 60, 140));
            stroke(on ? color(40, 200, 100) : color(220, 160, 20)); strokeWeight(2);
            rect(sx, o.y, o.w, o.h, 5);
            fill(20); noStroke(); textAlign(CENTER, CENTER); textSize(9);
            text(on ? "SAVE" : "CP", sx + o.w / 2, o.y + o.h / 2);
        } else if (o.type === "slope") {
            // cut block slope — verts respect o.rot (same as editor + hitbox)
            fill(50, 200, 230); stroke(20); strokeWeight(2);
            const sv = gdSlopeVerts(o, sx);
            triangle(sv[0][0], sv[0][1], sv[1][0], sv[1][1], sv[2][0], sv[2][1]);
            noStroke();
        } else if (o.type === "secretCoin" || o.type === "secretCoinGot") {
            if (o.type === "secretCoinGot") continue;
            const pulse = 0.7 + sin(frameCount * 0.2) * 0.3;
            fill(255, 215 * pulse, 40); stroke(255, 255, 180); strokeWeight(2);
            ellipse(sx + o.w / 2, o.y + o.h / 2, o.w * pulse, o.h * pulse);
            noStroke();
        } else if (o.type === "padYellow" || o.type === "padPink" || o.type === "padBlue") {
            // Pad body + arrow in effect direction (from ROT)
            const cols = o.type === "padBlue" ? [60, 140, 255] : (o.type === "padPink" ? [255, 50, 50] : [255, 220, 40]);
            fill(cols[0], cols[1], cols[2]); stroke(20); strokeWeight(2);
            const cx = sx + o.w / 2, cy = o.y + o.h / 2;
            // Map axis/facing → arrow rotation (0 = up)
            let arrowRot = 0;
            if ((o.axis || "y") === "x") arrowRot = (o.facing > 0) ? 90 : 270;
            else arrowRot = (o.facing > 0) ? 0 : 180;
            // Prefer explicit editor rot when present
            if (o.rot != null && o.rot !== 0) arrowRot = Number(o.rot);
            push();
            translate(cx, cy);
            rotate(radians(arrowRot));
            rect(-o.w / 2, -o.h / 2, o.w, o.h, 3);
            fill(255, 255, 220); noStroke();
            triangle(-o.w * 0.3, o.h * 0.25, 0, -o.h * 0.35, o.w * 0.3, o.h * 0.25);
            pop();
        } else if (o.type === "orbYellow") {
            const pulse = 0.85 + sin(frameCount * 0.25) * 0.15;
            fill(255, 220, 50, 200); noStroke();
            ellipse(sx + o.w / 2, o.y + o.h / 2, o.w * pulse, o.h * pulse);
            noFill(); stroke(255, 255, 180); strokeWeight(2);
            ellipse(sx + o.w / 2, o.y + o.h / 2, o.w * 0.7, o.h * 0.7);
            noStroke();
        } else if (o.type === "orbBlue") {
            // LEGACY = green orb look (flip+boost)
            const pulse = 0.85 + sin(frameCount * 0.25 + 1) * 0.15;
            fill(40, 220, 90, 200); noStroke();
            ellipse(sx + o.w / 2, o.y + o.h / 2, o.w * pulse, o.h * pulse);
            noFill(); stroke(180, 255, 200); strokeWeight(2);
            ellipse(sx + o.w / 2, o.y + o.h / 2, o.w * 0.7, o.h * 0.7);
            noStroke();
        } else if (o.type === "orbBlueTrue") {
            const pulse = 0.85 + sin(frameCount * 0.25 + 1.5) * 0.15;
            fill(70, 150, 255, 200); noStroke();
            ellipse(sx + o.w / 2, o.y + o.h / 2, o.w * pulse, o.h * pulse);
            noFill(); stroke(180, 220, 255); strokeWeight(2);
            ellipse(sx + o.w / 2, o.y + o.h / 2, o.w * 0.7, o.h * 0.7);
            noStroke();
        } else if (o.type === "orbBlack") {
            const pulse = 0.85 + sin(frameCount * 0.2) * 0.12;
            fill(20, 20, 25, 230); noStroke();
            ellipse(sx + o.w / 2, o.y + o.h / 2, o.w * pulse, o.h * pulse);
            noFill(); stroke(120, 120, 130); strokeWeight(2);
            ellipse(sx + o.w / 2, o.y + o.h / 2, o.w * 0.7, o.h * 0.7);
            stroke(200); strokeWeight(1.5);
            line(sx + o.w * 0.35, o.y + o.h * 0.35, sx + o.w * 0.65, o.y + o.h * 0.65);
            line(sx + o.w * 0.65, o.y + o.h * 0.35, sx + o.w * 0.35, o.y + o.h * 0.65);
            noStroke();
        } else if (o.type === "orbDash") {
            // Green dash orb — bright filled circle + white arrow
            const cx = sx + o.w / 2, cy = o.y + o.h / 2;
            const pulse = 0.9 + sin(frameCount * 0.3) * 0.1;
            fill(40, 255, 90, 230); noStroke();
            ellipse(cx, cy, o.w * pulse, o.h * pulse);
            noFill(); stroke(180, 255, 200); strokeWeight(3);
            ellipse(cx, cy, o.w + 4, o.h + 4);
            stroke(255); strokeWeight(2.5);
            line(cx - 8, cy, cx + 9, cy);
            line(cx + 3, cy - 6, cx + 10, cy);
            line(cx + 3, cy + 6, cx + 10, cy);
            noStroke();
            if (typeof gdDashing !== "undefined" && gdDashing) {
                noFill(); stroke(100, 255, 160, 160); strokeWeight(2);
                ellipse(cx, cy, o.w + 14 + (frameCount % 8), o.h + 14 + (frameCount % 8));
                noStroke();
            }
        } else if (o.type === "orbPink") {
            const pulse = 0.85 + sin(frameCount * 0.25) * 0.15;
            fill(255, 70, 70, 210); noStroke();
            ellipse(sx + o.w / 2, o.y + o.h / 2, o.w * pulse, o.h * pulse);
            noFill(); stroke(255, 180, 180); strokeWeight(2);
            ellipse(sx + o.w / 2, o.y + o.h / 2, o.w * 0.7, o.h * 0.7);
            noStroke();
        } else if (o.type === "portalDual") {
            // Dual portal: one icon near floor, one near ceiling of the portal box
            noFill(); stroke(255, 160, 40); strokeWeight(3);
            rect(sx, o.y, o.w, o.h, 4);
            noStroke();
            // top icon (ceiling twin)
            fill(255, 200, 80);
            rect(sx + o.w * 0.25, o.y + 6, o.w * 0.5, Math.min(18, o.h * 0.25), 3);
            // bottom icon (floor twin)
            fill(255, 160, 40);
            rect(sx + o.w * 0.25, o.y + o.h - 6 - Math.min(18, o.h * 0.25), o.w * 0.5, Math.min(18, o.h * 0.25), 3);
            fill(255); textSize(10); textAlign(CENTER, CENTER);
            text("DUAL", sx + o.w / 2, o.y + o.h / 2);
        } else if (o.type === "sizePortal") {
            const c = o.size === "mini" ? color(160, 100, 255) : color(120, 200, 255);
            noFill(); stroke(c); strokeWeight(3);
            rect(sx, o.y, o.w, o.h, 4);
            fill(c); noStroke(); textSize(11); textAlign(CENTER, CENTER);
            text(o.size === "mini" ? "MINI" : "NORM", sx + o.w / 2, o.y + o.h / 2);
        } else if (o.type === "endDual") {
            fill(255, 100, 60); rect(sx, o.y, o.w, o.h);
            fill(255); textSize(9); textAlign(CENTER, CENTER);
            text("END2", sx + o.w / 2, o.y + o.h / 2);
        } else if (o.type === "plat") {
            fill(180, 120, 255); rect(sx, o.y, o.w, o.h, 3);
        } else if (o.type === "gap") {
            fill(0, 0, 10); rect(sx, o.y, o.w, 80);
        } else if (o.type === "hazard") {
            fill(255, 80, 40); stroke(180, 20, 0); strokeWeight(1);
            rect(sx, o.y, o.w, o.h, 2);
            noStroke();
        } else if (o.type === "swingGate") {
            fill(255, 190, 50, 210);
            rect(sx, gdCeilY, o.w, max(0, o.top - gdCeilY));
            rect(sx, o.bottom, o.w, max(0, gdGroundY - o.bottom));
            stroke(255, 230, 100, 170); line(sx, o.top, sx + o.w, o.top); line(sx, o.bottom, sx + o.w, o.bottom); noStroke();
        } else if (o.type === "waveSlope") {
            // Sloped ceiling and floor, leaving the tunnel in between.
            fill(255, 55, 170, 210);
            noStroke();
            beginShape();
            vertex(sx, gdCeilY);
            vertex(sx + o.w, gdCeilY);
            vertex(sx + o.w, o.top2);
            vertex(sx, o.top1);
            endShape(CLOSE);

            fill(120, 45, 230, 210);
            beginShape();
            vertex(sx, o.bottom1);
            vertex(sx + o.w, o.bottom2);
            vertex(sx + o.w, gdGroundY);
            vertex(sx, gdGroundY);
            endShape(CLOSE);

            stroke(255, 120, 220, 150); strokeWeight(2);
            line(sx, o.top1, sx + o.w, o.top2);
            line(sx, o.bottom1, sx + o.w, o.bottom2);
            noStroke();
        } else if (o.type === "goal") {
            fill(40, 255, 100); rect(sx, o.y, 8, o.h);
            fill(255, 50, 50); triangle(sx + 8, o.y, sx + 34, o.y + 12, sx + 8, o.y + 24);
        } else if (o.type === "gravityPortal" || o.type === "gravityPortalUsed") {
            const active = o.type === "gravityPortal";
            const up = o.gravityDir < 0;
            noFill();
            stroke(up ? color(180, 80, 255, active ? 220 : 70) : color(100, 255, 160, active ? 220 : 70));
            strokeWeight(5);
            rect(sx, o.y, o.w, o.h, 18);
            noStroke();
            fill(255, active ? 220 : 80);
            textAlign(CENTER, CENTER); textSize(12);
            text(up ? "GRAV ↑" : "GRAV ↓", sx + o.w / 2, o.y + o.h / 2);
        } else if (o.type === "portal" || o.type === "portalUsed") {
            const pulse = 0.85 + sin(frameCount * 0.18) * 0.15;
            const active = o.type === "portal";
            noFill(); stroke(80, 220, 255, active ? 220 : 60); strokeWeight(5);
            rect(sx, o.y, o.w, o.h, 18);
            stroke(190, 100, 255, active ? 160 : 40); strokeWeight(2);
            rect(sx + 6, o.y + 8, o.w - 12, o.h - 16, 14);
            noStroke(); fill(220, 250, 255, (active ? 180 : 60) * pulse);
            textAlign(CENTER, CENTER); textSize(11); text((o.target || "?").toUpperCase(), sx + o.w/2, o.y + o.h/2);
        }
    }
    // Deco always on top — covers blocks/spikes/slopes fully
    for (let o of gdObstacles) {
        if (o.type !== "decoPixel" || !o.grid) continue;
        const sx = o.x - gdScroll;
        if (sx + (o.w || 40) < -40 || sx > sirina + 40) continue;
        lbDecoDrawGridPixels(o.grid, sx, o.y, o.w, o.h, o.shape || "rect");
    }


}

function drawGeometryDash() {
    // Keep the player's selected animated background in all GD modes.
    izrisiOzadje();

    // Light vehicle-specific tint on top, without hiding the selected background.
    noStroke();
    if (gdVehicle === "ship") fill(20, 50, 100, 38);
    else if (gdVehicle === "wave") fill(90, 10, 120, 34);
    else if (gdVehicle === "robot") fill(20, 120, 90, 30);
    else if (gdVehicle === "ufo") fill(40, 80, 40, 32);
    else if (gdVehicle === "ball") fill(120, 50, 30, 32);
    else if (gdVehicle === "spider") fill(80, 20, 100, 34);
    else if (gdVehicle === "dart") fill(100, 20, 40, 34);
    else if (gdVehicle === "mini") fill(10, 80, 70, 30);
    else fill(30, 20, 100, 28);
    rect(0, 0, sirina, sirina);
    if (gdAIMutatorActive("Darkness")) {
        fill(0, 0, 12, 78); noStroke(); rect(0, 0, sirina, sirina);
    }

    stroke(90, 70, 150, 55); strokeWeight(1);
    let off = (gdScroll * 0.25) % 40;
    for (let x = -off; x < sirina; x += 40) line(x, 0, x, sirina);

    // Always render the playable ceiling in every Geometry Dash mode.
    // This keeps the boundary visible with Cube/Robot and under Darkness too,
    // and makes Level Maker ROW changes visibly alter the usable playfield.
    {
        noStroke();
        fill(18, 18, 34, 238);
        rect(0, 0, sirina, Math.max(0, gdCeilY));
        // Bright double edge makes the actual ceiling position easy to read.
        fill(145, 105, 245, 235);
        rect(0, Math.max(0, gdCeilY - 4), sirina, 4);
        fill(220, 195, 255, 220);
        rect(0, Math.max(0, gdCeilY - 1), sirina, 1);
    }

    // ground
    noStroke(); fill(25, 25, 40); rect(0, gdGroundY, sirina, sirina - gdGroundY);
    fill(120, 90, 220); rect(0, gdGroundY, sirina, 4);

    _lbDrawObstaclesLikeGame();

    if (gameMode === "GD Portal Level") {
        fill(255); textAlign(CENTER, TOP); textSize(14);
        text("PORTAL LEVEL  •  " + gdVehicle.toUpperCase() + "  •  " + (gdPortalStage+1) + "/" + gdPortalVehicles.length + "  •  TOTAL " + gdTotalScore() + " m", sirina/2, 12);
    }
    if (gameMode === "Stereo Madness") {
        fill(255); textAlign(CENTER, TOP); textSize(14);
        text("STEREO MADNESS  •  " + gdVehicle.toUpperCase() + "  •  " + (gdPortalStage+1) + "/" + SM_STAGES.length + "  •  " + gdTotalScore() + " m", sirina/2, 12);
    }
    if (gameMode === "Wave Skill Tester") {
        fill(255, 220, 80); textAlign(CENTER, TOP); textSize(14);
        const fps = WAVE_SKILL_FPS[waveSkillStage];
        const win = (1 / fps).toFixed(fps >= 100 ? 4 : 3);
        text("WAVE SKILL  •  " + fps + " FPS  •  window " + win + "s  •  " + (waveSkillStage+1) + "/4", sirina/2, 12);
        textSize(12); fill(200);
        text("FPS changes in open floor — adapt, then hold 45° climb", sirina/2, 30);
    }
    if (gameMode === "Pulse Factory") {
        fill(255, 120, 200); textAlign(CENTER, TOP); textSize(14);
        text("PULSE FACTORY  •  " + gdVehicle.toUpperCase() + "  •  " + gdTotalScore() + " m", sirina/2, 12);
    }
    if (practiceIsActive()) {
        fill(80, 200, 255); textAlign(LEFT, TOP); textSize(12);
        text("PRACTICE  •  CP " + Math.max(0, practiceCpIndex + 1) + "/" + practiceCheckpoints.length
            + "  •  C=add  X=del  •  no coins", 10, 12);
        // draw checkpoint markers
        for (let i = 0; i < practiceCheckpoints.length; i++) {
            const cp = practiceCheckpoints[i];
            const sx = cp.x + (cp.scroll - gdScroll);
            if (sx < -20 || sx > sirina + 20) continue;
            noStroke();
            fill(i === practiceCpIndex ? color(80, 255, 200) : color(60, 160, 220, 180));
            triangle(sx, cp.y - 8, sx - 7, cp.y + 6, sx + 7, cp.y + 6);
            if (i === practiceCpIndex) {
                noFill(); stroke(80, 255, 200); strokeWeight(1.5);
                ellipse(sx, cp.y, 22, 22); noStroke();
            }
        }
    }

    // Wave trail: primary
    if (gdVehicle === "wave" && gdWaveTrail.length > 1) {
        noFill();
        for (let width = 10; width >= 2; width -= 2) {
            stroke(255, 70, 220, 18 + (10 - width) * 5);
            strokeWeight(width);
            beginShape();
            for (let i = 0; i < gdWaveTrail.length; i++) {
                const pt = gdWaveTrail[i];
                vertex(pt.x - gdScroll, pt.y);
            }
            endShape();
        }
        stroke(255, 235, 255, 235);
        strokeWeight(2);
        beginShape();
        for (let pt of gdWaveTrail) vertex(pt.x - gdScroll, pt.y);
        endShape();
        noStroke();
    }
    // Wave trail: dual twin
    if (gdDual && gdVehicle2 === "wave" && gdWaveTrail2 && gdWaveTrail2.length > 1) {
        noFill();
        for (let width = 8; width >= 2; width -= 2) {
            stroke(255, 160, 60, 18 + (8 - width) * 5);
            strokeWeight(width);
            beginShape();
            for (let pt of gdWaveTrail2) vertex(pt.x - gdScroll, pt.y);
            endShape();
        }
        stroke(255, 220, 160, 220);
        strokeWeight(2);
        beginShape();
        for (let pt of gdWaveTrail2) vertex(pt.x - gdScroll, pt.y);
        endShape();
        noStroke();
    }

    // Spider teleport trail — fixed in world space (does not follow player)
    if (gdSpiderTrail && gdSpiderTrail.life > 0) {
        const a = constrain(gdSpiderTrail.life / 22, 0, 1);
        const tx = (gdSpiderTrail.worldX != null ? gdSpiderTrail.worldX : gdSpiderTrail.x) - gdScroll;
        stroke(200, 120, 255, 220 * a);
        strokeWeight(3);
        line(tx, gdSpiderTrail.y0, tx, gdSpiderTrail.y1);
        stroke(255, 220, 255, 160 * a);
        strokeWeight(1.5);
        line(tx, gdSpiderTrail.y0, tx, gdSpiderTrail.y1);
        noStroke();
    }

    // player
    if (gdCube) {
        push();
        translate(gdCube.x + gdCube.w / 2, gdCube.y + gdCube.h / 2);
        // Flip icon when gravity is inverted so "up" matches visual
        if ((gdGravityDir || 1) < 0) scale(1, -1);
        rotate(gdCube.rot);
        if (gdVehicle === "cube") {
            fill(0, 255, 180); stroke(0, 170, 110); strokeWeight(2);
            rect(-gdCube.w / 2, -gdCube.h / 2, gdCube.w, gdCube.h, 4);
            fill(255); noStroke(); rect(-6, -6, 5, 5); rect(2, -6, 5, 5);
        } else if (gdVehicle === "ship") {
            fill(100, 180, 255); stroke(40, 100, 200); strokeWeight(2);
            // simple ship triangle
            beginShape();
            vertex(gdCube.w / 2, 0);
            vertex(-gdCube.w / 2, -gdCube.h / 2);
            vertex(-gdCube.w / 2, gdCube.h / 2);
            endShape(CLOSE);
            noStroke();
        } else if (gdVehicle === "robot") {
            fill(80, 240, 150); stroke(20, 150, 90); strokeWeight(2);
            rect(-gdCube.w / 2, -gdCube.h / 2, gdCube.w, gdCube.h, 5);
            fill(30); noStroke();
            rect(-7, -6, 5, 5); rect(2, -6, 5, 5);
            rect(-5, 5, 10, 3, 2);
        } else if (gdVehicle === "ufo") {
            fill(180, 255, 120); stroke(60, 160, 40); strokeWeight(2);
            ellipse(0, 2, gdCube.w * 1.2, gdCube.h * 0.55);
            fill(140, 230, 255); noStroke();
            ellipse(0, -5, gdCube.w * 0.55, gdCube.h * 0.48);
        } else if (gdVehicle === "ball") {
            fill(255, 170, 70); stroke(210, 90, 20); strokeWeight(2);
            ellipse(0, 0, gdCube.w, gdCube.h);
            stroke(255, 235, 150); strokeWeight(2);
            line(-6, -6, 6, 6); line(6, -6, -6, 6);
            noStroke();
        } else if (gdVehicle === "swing") {
            fill(255, 205, 70); stroke(210, 130, 20); strokeWeight(2);
            beginShape();
            vertex(gdCube.w / 2, 0);
            vertex(0, -gdCube.h / 2);
            vertex(-gdCube.w / 2, 0);
            vertex(0, gdCube.h / 2);
            endShape(CLOSE); noStroke();
        } else if (gdVehicle === "spider") {
            fill(180, 90, 255); stroke(110, 40, 200); strokeWeight(2);
            ellipse(0, 0, gdCube.w * 0.85, gdCube.h * 0.7);
            stroke(140, 60, 220); strokeWeight(2);
            for (let i = -1; i <= 1; i += 2) {
                line(-4, 2, -10 * i, 10);
                line(4, 2, 10 * i, 10);
                line(-2, -2, -9 * i, -8);
                line(2, -2, 9 * i, -8);
            }
            noStroke();
            fill(255); ellipse(-4, -2, 3, 3); ellipse(4, -2, 3, 3);
        } else if (gdVehicle === "dart") {
            fill(255, 80, 120); stroke(200, 30, 70); strokeWeight(2);
            beginShape();
            vertex(gdCube.w / 2, 0);
            vertex(-gdCube.w / 2, -gdCube.h / 2);
            vertex(-gdCube.w / 3, 0);
            vertex(-gdCube.w / 2, gdCube.h / 2);
            endShape(CLOSE);
            noStroke();
            fill(255, 200, 210);
            triangle(gdCube.w / 2, 0, gdCube.w / 4, -3, gdCube.w / 4, 3);
        } else if (gdVehicle === "mini") {
            fill(0, 255, 200); stroke(0, 180, 140); strokeWeight(1.5);
            rect(-gdCube.w / 2, -gdCube.h / 2, gdCube.w, gdCube.h, 3);
            fill(255); noStroke();
            rect(-4, -4, 3, 3); rect(1, -4, 3, 3);
        } else {
            // wave arrow
            fill(255, 100, 220); stroke(200, 40, 160); strokeWeight(2);
            beginShape();
            vertex(gdCube.w / 2, 0);
            vertex(-gdCube.w / 2, -gdCube.h / 2);
            vertex(-gdCube.w / 4, 0);
            vertex(-gdCube.w / 2, gdCube.h / 2);
            endShape(CLOSE);
            noStroke();
        }
        pop();
    }

    // Dual second icon — always on ceiling (one on floor, one on ceiling)
    if (gdDual && gdCube2) {
        push();
        translate(gdCube2.x + gdCube2.w / 2, gdCube2.y + gdCube2.h / 2);
        scale(1, -1); // ceiling twin is flipped
        rotate(gdCube2.rot || 0);
        const w2 = gdCube2.w, h2 = gdCube2.h;
        const v2 = gdVehicle2 || "cube";
        // Independent vehicle shape (orange tint)
        if (v2 === "ship") {
            fill(255, 170, 60); stroke(200, 100, 20); strokeWeight(2);
            beginShape();
            vertex(w2 / 2, 0); vertex(-w2 / 2, -h2 / 2); vertex(-w2 / 2, h2 / 2);
            endShape(CLOSE); noStroke();
        } else if (v2 === "wave") {
            fill(255, 150, 80); stroke(200, 80, 20); strokeWeight(2);
            beginShape();
            vertex(w2 / 2, 0); vertex(-w2 / 2, -h2 / 2); vertex(-w2 / 4, 0); vertex(-w2 / 2, h2 / 2);
            endShape(CLOSE); noStroke();
        } else if (v2 === "ball") {
            fill(255, 180, 60); stroke(200, 120, 20); strokeWeight(2);
            ellipse(0, 0, w2, h2); noStroke();
        } else if (v2 === "ufo") {
            fill(255, 180, 60); stroke(200, 120, 20); strokeWeight(2);
            ellipse(0, 2, w2 * 1.2, h2 * 0.55);
            fill(255, 220, 150); noStroke();
            ellipse(0, -5, w2 * 0.55, h2 * 0.48);
        } else if (v2 === "swing" || v2 === "spider") {
            fill(255, 180, 60); stroke(200, 120, 20); strokeWeight(2);
            beginShape();
            vertex(w2 / 2, 0); vertex(0, -h2 / 2); vertex(-w2 / 2, 0); vertex(0, h2 / 2);
            endShape(CLOSE); noStroke();
        } else if (v2 === "dart") {
            fill(255, 160, 50); stroke(200, 100, 20); strokeWeight(2);
            beginShape();
            vertex(w2 / 2, 0); vertex(-w2 / 2, -h2 / 2); vertex(-w2 / 3, 0); vertex(-w2 / 2, h2 / 2);
            endShape(CLOSE); noStroke();
        } else if (v2 === "robot") {
            fill(255, 180, 60); stroke(200, 120, 20); strokeWeight(2);
            rect(-w2 / 2, -h2 / 2, w2, h2, 5);
            fill(40); noStroke();
            rect(-7, -6, 5, 5); rect(2, -6, 5, 5); rect(-5, 5, 10, 3, 2);
        } else {
            // cube / mini
            fill(255, 180, 60); stroke(200, 120, 20); strokeWeight(2);
            rect(-w2 / 2, -h2 / 2, w2, h2, 4);
            fill(255); noStroke();
            rect(-6, -6, 5, 5); rect(2, -6, 5, 5);
        }
        pop();
    }

    fill(255); textAlign(LEFT, TOP); textSize(15);
    text("Score: " + gdTotalScore(), 20, 14);
    text("🪙 " + kovanci, 20, 36);
    if (gameMode === "GD Builder Test") {
        fill(235, 220, 255); textAlign(RIGHT, TOP); textSize(11);
        text("ROWS " + levelBuilder.rows + "  •  PLAY AREA " + Math.round(gdGroundY - gdCeilY) + "px", sirina - 12, 14);
        textAlign(LEFT, TOP);
        if (gdPlatformerMode) {
            fill(255, 180, 60); textSize(13);
            text("PLATFORMER  •  ← → walk  •  ↑/SPACE jump  •  same level as classic", 20, 58);
        } else {
            fill(120, 220, 255); textSize(12);
            text("CLASSIC  •  auto-scroll", 20, 58);
        }
    }
    
    // Optional hitbox trail. K toggles recording+display; kept after death until next attempt.
    if (levelBuilder && (levelBuilder.showHitboxTrail || levelBuilder.showHitboxes)) {
        const trail = levelBuilder.hitboxTrail || (levelBuilder.hitboxTrail = []);
        if (levelBuilder.showHitboxTrail) {
            // Record only while alive
            if (gdCube && !gameOver && !gdWon) {
                const full = gdPhysicsBody(gdCube), core = gdBlockPhysicsBody(gdCube);
                trail.push({
                    full: { x: full.x + gdScroll, y: full.y, w: full.w, h: full.h },
                    core: { x: core.x + gdScroll, y: core.y, w: core.w, h: core.h },
                    dual: gdDual && gdCube2 ? (() => { const b = gdPhysicsBody(gdCube2); return { x: b.x + gdScroll, y: b.y, w: b.w, h: b.h }; })() : null
                });
                // Cap length so long dual runs don't freeze the draw loop
                if (trail.length > 900) trail.splice(0, trail.length - 900);
            }
            noFill();
            for (let i = 0; i < trail.length; i++) {
                const t = trail[i];
                if (!t || !t.full) continue;
                stroke(0, 220, 255, 190); strokeWeight(1.5);
                rect(t.full.x - gdScroll, t.full.y, t.full.w, t.full.h);
                if (t.core) {
                    stroke(255, 40, 220, 230); strokeWeight(2);
                    rect(t.core.x - gdScroll, t.core.y, t.core.w, t.core.h);
                }
                if (t.dual) { stroke(255, 180, 40, 220); strokeWeight(1.5); rect(t.dual.x - gdScroll, t.dual.y, t.dual.w, t.dual.h); }
            }
        }
        // do NOT clear trail when only showHitboxes is on — trail is independent
    }

    // Debug hitboxes — shapes match real collision (tri / circle / box)
    if (levelBuilder && levelBuilder.showHitboxes && gdCube) {
        noFill();
        stroke(255, 255, 255, 255); strokeWeight(2);
        const body = gdPhysicsBody(gdCube);
        const hbW = body.w, hbH = body.h;
        const hbX = body.x;
        const hbY = body.y;
        rect(hbX, hbY, hbW, hbH);
        // Bright, high-contrast outlines: cyan = full player bounds; neon green = block/slope core.
        stroke(0, 230, 255, 255); strokeWeight(3);
        rect(gdCube.x, gdCube.y, gdCube.w, gdCube.h);
        const coreBox = gdBlockPhysicsBody(gdCube);
        stroke(255, 40, 220, 255); strokeWeight(4);
        rect(coreBox.x, coreBox.y, coreBox.w, coreBox.h);
        if (gdDual && gdCube2) {
            stroke(255, 180, 40, 220);
            rect(gdCube2.x, gdCube2.y, gdCube2.w, gdCube2.h);
        }
        for (let o of gdObstacles) {
            const sx = o.x - gdScroll;
            const ow = o.w != null ? o.w : 20;
            const oh = o.h != null ? o.h : 20;
            const oy = o.y != null ? o.y : 0;
            if (sx + ow < -30 || sx > sirina + 30) continue;
            strokeWeight(1.5);
            if (o.type === "spike") {
                stroke(255, 50, 50, 230);
                triangle(sx, oy + oh, sx + ow * 0.5, oy, sx + ow, oy + oh);
            } else if (o.type === "spikeDown") {
                stroke(255, 50, 50, 230);
                triangle(sx, oy, sx + ow * 0.5, oy + oh, sx + ow, oy);
            } else if (o.type === "sawblade") {
                stroke(255, 80, 40, 230);
                const r = Math.min(ow, oh) * 0.48;
                ellipse(sx + ow * 0.5, oy + oh * 0.5, r * 2, r * 2);
            } else if (o.type === "slope") {
                stroke(100, 200, 255, 220);
                if (o.dir > 0) {
                    // / solid lower-right
                    triangle(sx, oy + oh, sx + ow, oy + oh, sx + ow, oy);
                } else {
                    // \ solid lower-left
                    triangle(sx, oy, sx, oy + oh, sx + ow, oy + oh);
                }
            } else if (o.type === "goal") {
                stroke(80, 255, 140, 180); rect(sx, oy, ow, oh);
            } else if (o.type === "padYellow" || o.type === "orbYellow" || o.type === "padPink" || o.type === "orbPink") {
                stroke(255, 220, 40, 200);
                if (o.type.indexOf("orb") === 0) ellipse(sx + ow * 0.5, oy + oh * 0.5, ow, oh);
                else rect(sx, oy, ow, oh);
            } else if (o.type === "padBlue" || o.type === "orbBlue") {
                stroke(50, 150, 255, 200);
                if (o.type.indexOf("orb") === 0) ellipse(sx + ow * 0.5, oy + oh * 0.5, ow, oh);
                else rect(sx, oy, ow, oh);
            } else if (o.type === "orbDash") {
                stroke(40, 255, 100, 200); ellipse(sx + ow * 0.5, oy + oh * 0.5, ow, oh);
            } else if (o.type === "block" || o.type === "plat" || o.type === "wall") {
                stroke(100, 180, 255, 200); rect(sx, oy, ow, oh);
            } else if (o.type === "hazard") {
                stroke(255, 100, 40, 200); rect(sx, oy, ow, oh);
            } else {
                stroke(255, 255, 255, 100); rect(sx, oy, ow, oh);
            }
        }
        noStroke();
    }
let vLabel = gdVehicle === "cube" ? "CUBE" : gdVehicle === "ship" ? "SHIP" : gdVehicle === "wave" ? "WAVE" : gdVehicle === "swing" ? "SWING" : gdVehicle === "ufo" ? "UFO" : gdVehicle === "ball" ? "BALL" : gdVehicle === "spider" ? "SPIDER" : gdVehicle === "dart" ? "DART" : gdVehicle === "mini" ? "MINI" : "ROBOT";
    fill(200, 255, 200); text(vLabel, 20, 58);
    if (gameMode === "GD AI Demon") {
        const pct = gdWon ? 100 : constrain(Math.floor(((gdScroll + (gdCube ? gdCube.x : 0)) / gdAIDemonLength) * 100), 0, 99);
        fill(0, 0, 0, 145); noStroke(); rect(sirina/2 - 92, 12, 184, 28, 8);
        fill(255, 65, 110); textAlign(CENTER, CENTER); textSize(16);
        text("DEMON  •  " + pct + "%", sirina/2, 26);
        fill(255, 255, 255, 65); rect(sirina/2 - 82, 45, 164, 6, 3);
        fill(255, 55, 105); rect(sirina/2 - 82, 45, 164 * pct / 100, 6, 3);
        fill(255, 225, 235); textSize(9); textAlign(CENTER, TOP);
        text("RANDOM MODES 5/10", sirina/2, 56);
        text(gdAIMutators.slice(0, 3).join(" • "), sirina/2, 68);
        text(gdAIMutators.slice(3).join(" • "), sirina/2, 79);
        textAlign(LEFT, TOP);
    }
    if (gdAIPilot) {
        const profiles = ["SAFE", "RISKY", "PERFECT", "LEARN"];
        fill(0, 255, 120); textSize(14);
        text("AI " + (profiles[aiLabProfile] || "?") + (gdAIHold ? " HOLD" : "") + " eng v8", 20, 80);
        textSize(16);
    }

    if (!gdStarted) {
        textAlign(CENTER, CENTER); textSize(18); fill(255, 255, 120);
        if (gameMode === "GD AI Demon") text("AI DEMON RUN  •  SPACE / ↑ = jump, hold = fly/wave", sirina / 2, sirina / 2 - 30);
        else
        if (gdVehicle === "cube") text("SPACE / ↑ = JUMP  •  blue blocks are safe to land on  •  I = AI", sirina / 2, sirina / 2 - 30);
        else if (gdVehicle === "ship") text("HOLD SPACE = fly up  •  release = fall", sirina / 2, sirina / 2 - 30);
        else if (gdVehicle === "swing") text("SPACE / ↑ = FLIP GRAVITY  •  tap to switch", sirina / 2, sirina / 2 - 30);
        else if (gdVehicle === "robot") text("SPACE = skok  •  DRŽI = višji skok  •  LAHKA proga", sirina / 2, sirina / 2 - 30);
        else if (gdVehicle === "ufo") text("SPACE / W / MOUSE = bounce gor", sirina / 2, sirina / 2 - 30);
        else if (gdVehicle === "ball") text("SPACE = flip  •  rumen pad/orb = boost  •  moder = gravitacija", sirina / 2, sirina / 2 - 30);
        else if (gdVehicle === "spider") text("SPACE / ↑ = FLIP  •  spider hodi po tleh in stropu", sirina / 2, sirina / 2 - 30);
        else if (gdVehicle === "dart") text("HOLD SPACE = dash gor  •  release = rahla gravitacija", sirina / 2, sirina / 2 - 30);
        else if (gdVehicle === "mini") text("SPACE = JUMP (mini)  •  manjši hitbox, tight passages", sirina / 2, sirina / 2 - 30);
        else text("HOLD SPACE = up  •  release = down  (wave)", sirina / 2, sirina / 2 - 30);
        textSize(14); fill(200); text("Press jump/hold to start!", sirina / 2, sirina / 2 + 10);
    }
    if (gdWon) {
        fill(0, 0, 0, 160); rect(0, 0, sirina, sirina);
        fill(50, 255, 120); textAlign(CENTER, CENTER); textSize(34); text("LEVEL COMPLETE!", sirina / 2, sirina / 2 - 30);
        fill(255, 215, 80); textSize(18); text("+" + (gdLastCoinsEarned || 0) + " 🪙   (skupaj: " + kovanci + ")", sirina / 2, sirina / 2 + 5);
        fill(255); textSize(16); text("SPACE = again  •  ESC = menu", sirina / 2, sirina / 2 + 40);
    }
    if (gameOver && !gdWon) {
        fill(0, 0, 0, 150); rect(0, 0, sirina, sirina);
        fill(255, 70, 70); textAlign(CENTER, CENTER); textSize(32); text("CRASHED!", sirina / 2, sirina / 2 - 30);
        fill(255, 215, 80); textSize(18); text("+" + (gdLastCoinsEarned || 0) + " 🪙   (skupaj: " + kovanci + ")", sirina / 2, sirina / 2 + 5);
        fill(255); textSize(16); text("SPACE = retry  •  ESC = menu", sirina / 2, sirina / 2 + 40);
    }
}


// ===== TOWER CLIMB =====
// Deterministic, bounded patterns: every next platform is reachable by the same jump physics.
function towerRand(n) {
    const x = Math.sin((n + 1) * 12.9898 + tower.seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
}

function towerAddSection() {
    const i = tower.section++;
    const fromY = tower.lastY;
    const y = tower.nextY;
    const w = 96 + Math.floor(towerRand(i * 7 + 1) * 40); // 96..135
    const maxDx = 120;
    let dx = Math.floor((towerRand(i * 7 + 2) * 2 - 1) * maxDx);
    let x = constrain(tower.lastX + dx, 18, sirina - w - 18);
    if (abs(x - tower.lastX) > 128) x = tower.lastX + (x > tower.lastX ? 120 : -120);
    x = constrain(x, 18, sirina - w - 18);

    // The main platform is always inside the player's vertical jump envelope.
    // Jump physics: v=-11.5, g=0.55 -> about 120 px maximum rise.
    const maxRise = 118;
    let minNextY = fromY - maxRise;
    let maxNextY = fromY - 72;
    const desiredY = y;
    const safeY = constrain(desiredY, minNextY, maxNextY);
    const finalY = safeY;

    tower.platforms.push({ x, y: finalY, w, h: 14, moving: false, vx: 0 });
    tower.lastX = x;
    tower.lastY = finalY;
    tower.nextY = finalY - (78 + Math.floor(towerRand(i * 7 + 3) * 34));

    // Optional blue apex platform: it is a REAL alternate route, not a
    // half-jump filler. It must have clear horizontal space from the main
    // platform and enough room for the player to land safely.
    const hazardRoll = towerRand(i * 7 + 4);
    if (i > 2 && hazardRoll < 0.27) {
        const altW = 86;
        const side = towerRand(i * 11 + 6) < 0.5 ? -1 : 1;
        const altY = fromY - 108;
        let altX = constrain(tower.lastX + side * 105, 18, sirina - altW - 18);
        const horizontalOverlap = altX + altW + 12 > x && altX - 12 < x + w;
        const clearFromStart = abs(altX + altW/2 - (tower.lastX + w/2)) <= 145;
        const clearFromSpike = !tower.spikes.some(s => abs(s.y - (altY - 18)) < 24 && s.x + s.w > altX - 8 && s.x < altX + altW + 8);
        if (clearFromStart && !horizontalOverlap && clearFromSpike) {
            tower.platforms.push({
                x: altX, y: altY, w: altW, h: 14, alt: true, moving: true,
                vx: side * (0.8 + towerRand(i * 11 + 8) * 0.7),
                baseX: altX, range: 22, phase: towerRand(i * 11 + 9) * Math.PI * 2
            });
        }
    }

    // Spikes only occupy a small EDGE zone. Never put one on a platform that
    // is too short, and never block the center landing area.
    if (i > 4 && hazardRoll > 0.55 && hazardRoll < 0.76 && w >= 112) {
        const side = towerRand(i * 13 + 2) < 0.5 ? 0 : 1;
        const sx = side ? x + w - 20 : x + 6;
        tower.spikes.push({ x: sx, y: finalY - 18, w: 14, h: 18 });
    }
}

function towerEnsureAhead() {
    const topNeeded = tower.cameraY - sirina * 1.4;
    let guard = 0;
    while (tower.nextY > topNeeded && guard++ < 20) towerAddSection();
}

function initTowerClimb() {
    tower.seed = Math.floor(Math.random() * 1000000000);
    tower.platforms = [{ x: sirina / 2 - 65, y: sirina - 65, w: 130, h: 14 }];
    tower.spikes = [];
    tower.lastX = sirina / 2 - 65;
    tower.lastY = sirina - 65;
    tower.nextY = sirina - 155;
    tower.section = 0;
    tower.cameraY = max(0, sirina - 560);
    tower.score = 0;
    tower.gameOver = false;
    tower.aiTarget = null;
    tower.player = { x: sirina / 2 - 11, y: sirina - 115, vx: 0, vy: 0, w: 22, h: 32, onGround: false, facing: 1 };
    towerEnsureAhead();
    gameOver = false;
    plrWon = false;
    particles = [];
    screenShake = 0;
}

function updateTowerClimb() {
    if (!tower.player || tower.gameOver) return;
    const p = tower.player;
    let move = 0;
    if (tower.ai) {
        // Lock onto ONE next platform for the whole jump. The old AI picked the
        // next higher platform every frame, so while airborne it could abandon
        // the platform it was currently trying to land on and fly underneath it.
        if (p.onGround || !tower.aiTarget) {
            const candidates = tower.platforms.filter(q =>
                q.y < p.y - 12 &&
                q.y >= p.y - 120 &&
                q.x + q.w > p.x - 125 &&
                q.x < p.x + p.w + 125
            );
            if (candidates.length) {
                // Choose the nearest vertical platform above us, not the highest
                // one. This guarantees the AI finishes the current jump first.
                candidates.sort((a,b) => b.y - a.y);
                tower.aiTarget = candidates[0];
            } else {
                tower.aiTarget = null;
            }
        }
        const target = tower.aiTarget;
        if (target) {
            const tx = target.x + target.w / 2;
            const cx = p.x + p.w / 2;
            if (abs(tx - cx) > 7) move = tx > cx ? 1 : -1;
        }
    } else {
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) move = -1;
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) move = 1;
    }
    p.vx = move * 4.2;
    if (move) p.facing = move;
    const towerJump = tower.ai ? (p.onGround && !!tower.aiTarget) : (keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32));
    if (towerJump && p.onGround) {
        p.vy = -11.5;
        p.onGround = false;
        playJumpSound();
    }
    p.vy = min(14, p.vy + 0.55);
    p.x += p.vx;
    p.y += p.vy;
    p.x = constrain(p.x, 0, sirina - p.w);

    // Blue alternate platforms move horizontally. Their motion is deterministic
    // for the current attempt, but the seed changes on every new attempt.
    for (const q of tower.platforms) {
        if (!q.moving) continue;
        q.x = q.baseX + sin(frameCount * 0.045 + q.phase) * q.range;
        q.x = constrain(q.x, 18, sirina - q.w - 18);
    }
    p.onGround = false;

    // Only land on platforms while falling; no side-wall stickiness.
    for (const q of tower.platforms) {
        if (p.x + p.w > q.x && p.x < q.x + q.w && p.y + p.h > q.y && p.y + p.h - p.vy <= q.y + 7 && p.vy >= 0) {
            p.y = q.y - p.h;
            p.vy = 0;
            p.onGround = true;
            if (tower.ai && tower.aiTarget === q) tower.aiTarget = null;
        }
    }
    for (const s of tower.spikes) {
        if (p.x + p.w > s.x && p.x < s.x + s.w && p.y + p.h > s.y + 3 && p.y < s.y + s.h) {
            tower.gameOver = true;
            gameOver = true;
            playDeathSound();
            screenShake = 10;
            return;
        }
    }

    // Camera follows upward; world coordinates stay stable.
    const targetCamera = p.y - sirina * 0.52;
    if (targetCamera < tower.cameraY) tower.cameraY += (targetCamera - tower.cameraY) * 0.14;
    towerEnsureAhead();
    tower.score = max(tower.score, Math.floor((sirina - 65 - p.y) / 10));
    tower.best = max(tower.best, tower.score);
    if (tower.score > (rekordi["Tower Climb"] || 0)) {
        rekordi["Tower Climb"] = tower.score;
        localStorage.setItem("snakeHighScore_Tower Climb", tower.score);
        isNewHighScore = true;
    }
    if (tower.score >= 1000) unlockAchievement("endlessClimber", "endlessFlareSkin");
    if (tower.score >= 3000) unlockAchievement("endlessVeteran", "endlessSkyBackground");
    if (tower.score >= 5000) unlockAchievement("endlessMarathon", "endlessHaloAccessory");

    // Falling well below the visible play area ends the run.
    if (p.y - tower.cameraY > sirina + 100) {
        tower.gameOver = true;
        gameOver = true;
        playDeathSound();
    }
}

function drawTowerClimb() {
    // Calm, readable background; no moving hazards outside the level.
    izrisiOzadje();
    push();
    translate(0, -tower.cameraY);
    for (const q of tower.platforms) {
        fill(q.alt ? 75 : 60, q.alt ? 150 : 70, q.alt ? 225 : 85);
        stroke(30); strokeWeight(2);
        rect(q.x, q.y, q.w, q.h, 4);
    }
    noStroke();
    for (const s of tower.spikes) {
        fill(220, 55, 55);
        triangle(s.x, s.y + s.h, s.x + s.w / 2, s.y, s.x + s.w, s.y + s.h);
    }
    const p = tower.player;
    if (p) {
        push();
        translate(p.x + p.w / 2, p.y + p.h / 2);
        scale(p.facing, 1);
        fill(0, 220, 255); stroke(0, 150, 200); strokeWeight(2);
        rect(-p.w / 2, -p.h / 2, p.w, p.h, 5);
        fill(255); noStroke(); ellipse(4, -6, 7, 7);
        fill(0); ellipse(5, -6, 3, 3);
        pop();
    }
    pop();

    fill(255); noStroke(); textAlign(LEFT, TOP); textSize(18);
    text("Tower: " + tower.score + " m", 20, 15);
    textSize(13); fill(210); text("← → / A D = move   •   SPACE / W / ↑ = jump", 20, 42);
    text("ENDLESS • deterministic seed • no instant-death randomness", 20, 62);
}

// ===== PLATFORMER = real GD-style free-move + vehicle portals =====

// ===== MENU PLATFORMER (classic free-move, separate from GD builder platformer) =====
function plrVehicleSize() { return 22; }

function initPlatformer(levelIndex = 0) {
    currentPlatformerLevel = constrain(levelIndex, 0, totalPlatformerLevels - 1);
    let lvl = platformerLevels[currentPlatformerLevel];
    plr = { x: lvl.start.x, y: lvl.start.y, vx: 0, vy: 0, w: 22, h: 32, onGround: false, facing: 1 };
    plrScore = 0; plrLives = 3; plrWon = false;
    particles = []; screenShake = 0; isNewHighScore = false;
    if (levelIndex === 0) platformerDeathsThisRun = 0;
    platforms = JSON.parse(JSON.stringify(lvl.platforms));
    plrCoins = lvl.coins.map(c => ({ x: c.x, y: c.y, collected: false }));
    spikes = JSON.parse(JSON.stringify(lvl.spikes));
    goal = { ...lvl.goal };
    plrFromBuilder = false;
    plrPortals = [];
    plrPads = [];
    plrOrbs = [];
    plrSawblades = [];
    plrEndGoal = null;
    plrSpawn = { x: lvl.start.x, y: lvl.start.y };
    plrGroundY = 560;
    frameRate(60);
}

function startPlatformerFromBuilder() {
    // Builder platformer uses GD engine (gdPlatformerMode) — this is only a fallback
    startBuilderTest();
}

function updatePlatformer() {
    if (plrWon || gameOver || !plr) return;

    let move = 0;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) move = -1;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) move = 1;
    plr.vx = move * 4.2;
    if (move !== 0) plr.facing = move;

    if ((keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32)) && plr.onGround) {
        plr.vy = -11.5; plr.onGround = false;
        try { playJumpSound(); } catch (e) {}
    }

    plr.vy += 0.55;
    if (plr.vy > 14) plr.vy = 14;
    plr.x += plr.vx; plr.y += plr.vy;
    plr.onGround = false;

    for (let p of platforms) {
        if (p.type === "moving") p.x = p.baseX + sin(frameCount * 0.03 * p.speed) * p.range;
        if (plr.x + plr.w > p.x && plr.x < p.x + p.w && plr.y + plr.h > p.y && plr.y < p.y + p.h) {
            if (plr.vy > 0 && plr.y + plr.h - plr.vy <= p.y + 6) {
                plr.y = p.y - plr.h; plr.vy = 0; plr.onGround = true;
            } else if (plr.vy < 0 && plr.y - plr.vy >= p.y + p.h - 6) {
                plr.y = p.y + p.h; plr.vy = 0;
            } else {
                if (plr.vx > 0) plr.x = p.x - plr.w;
                else if (plr.vx < 0) plr.x = p.x + p.w;
            }
        }
    }

    for (let c of plrCoins) {
        if (!c.collected && dist(plr.x + plr.w / 2, plr.y + plr.h / 2, c.x, c.y) < 22) {
            c.collected = true; plrScore += 10; kovanci += 2;
            localStorage.setItem("snakeCoins", kovanci);
            try { playCoinSound(); } catch (e) {}
            spawnParticles(c.x, c.y, 10, color(255, 215, 0));
            if (kovanci >= 300) try { unlockAchievement("coinHoarder", "goldTrail"); } catch (e) {}
        }
    }

    for (let s of spikes) {
        if (plr.x + plr.w > s.x && plr.x < s.x + s.w && plr.y + plr.h > s.y && plr.y < s.y + s.h) {
            hurtPlayer(); return;
        }
    }

    if (goal && plr.x + plr.w > goal.x && plr.x < goal.x + goal.w && plr.y + plr.h > goal.y && plr.y < goal.y + goal.h) {
        plrWon = true;
        try { playWinSound(); } catch (e) {}
        let bonus = 20 + currentPlatformerLevel * 10;
        kovanci += bonus; localStorage.setItem("snakeCoins", kovanci);
        if (plrScore > (rekordi["Platformer"] || 0)) {
            rekordi["Platformer"] = plrScore;
            localStorage.setItem("snakeHighScore_Platformer", plrScore);
            isNewHighScore = true;
        }
        try {
            unlockAchievement("platformerStart", "crystalSkin");
            if (currentPlatformerLevel >= 2) unlockAchievement("platformerRookie", "neonGrid");
            if (currentPlatformerLevel === 4 && platformerDeathsThisRun === 0) unlockAchievement("platformerMaster", "cyberPhantom");
        } catch (e) {}
    }

    if (plr.y > sirina + 50) hurtPlayer();
    if (plr.x < 0) plr.x = 0;
    if (plr.x + plr.w > sirina) plr.x = sirina - plr.w;
}

function hurtPlayer() {
    if (!plr) return;
    plrLives--;
    platformerDeathsThisRun++;
    totalDeaths++;
    localStorage.setItem("totalDeaths", totalDeaths);
    try { if (totalDeaths >= 15) unlockAchievement("firstSteps", "specialDeath"); } catch (e) {}
    try { playDeathSound(); } catch (e) {}
    screenShake = 12;
    let col = (unlockedRewards && unlockedRewards.specialDeath) ? color(255, 0, 255) : color(255, 50, 50);
    spawnParticles(plr.x + plr.w / 2, plr.y + plr.h / 2, 22, col);
    if (plrLives <= 0) {
        gameOver = true;
        if (plrScore > (rekordi["Platformer"] || 0)) {
            rekordi["Platformer"] = plrScore;
            localStorage.setItem("snakeHighScore_Platformer", plrScore);
            isNewHighScore = true;
        }
    } else {
        let lvl = platformerLevels[currentPlatformerLevel];
        plr.x = lvl.start.x; plr.y = lvl.start.y; plr.vx = 0; plr.vy = 0;
    }
}

function drawPlatformer() {
    izrisiOzadje();
    for (let p of platforms) {
        if (p.type === "moving") { fill(80, 180, 255); stroke(40, 120, 200); }
        else { fill(60, 60, 70); stroke(30); }
        strokeWeight(2); rect(p.x, p.y, p.w, p.h, 4);
    }
    noStroke();
    for (let s of spikes) {
        fill(200, 40, 40);
        triangle(s.x, s.y + s.h, s.x + s.w / 2, s.y, s.x + s.w, s.y + s.h);
    }
    for (let c of plrCoins) {
        if (!c.collected) {
            fill(255, 215, 0); stroke(200, 150, 0); strokeWeight(1);
            ellipse(c.x, c.y, 14, 14);
            fill(255, 240, 150); noStroke(); ellipse(c.x - 2, c.y - 2, 5, 5);
        }
    }
    if (goal) {
        fill(40, 180, 60); rect(goal.x, goal.y, 8, goal.h);
        fill(255, 50, 50); triangle(goal.x + 8, goal.y, goal.x + 35, goal.y + 12, goal.x + 8, goal.y + 24);
    }

    if (plr) {
        push();
        translate(plr.x + plr.w / 2, plr.y + plr.h / 2);
        scale(plr.facing, 1);
        fill(0, 220, 255); stroke(0, 150, 200); strokeWeight(2);
        rect(-plr.w / 2, -plr.h / 2, plr.w, plr.h, 5);
        fill(255); noStroke(); ellipse(4, -6, 7, 7);
        fill(0); ellipse(5, -6, 3, 3);
        pop();
    }

    fill(255); textAlign(LEFT, TOP); textSize(18); noStroke();
    text("Score: " + plrScore, 20, 15);
    text("Lives: " + "❤".repeat(Math.max(0, plrLives)), 20, 40);
    text("🪙 " + kovanci, 20, 65);
    text("Level " + (currentPlatformerLevel + 1) + "/" + totalPlatformerLevels, 20, 90);
    fill(160); textSize(12);
    text("← → move  •  ↑/SPACE jump  •  classic platformer", 20, 115);

    if (plrWon) {
        fill(0, 0, 0, 160); rect(0, 0, sirina, sirina);
        fill(0, 255, 120); textAlign(CENTER, CENTER); textSize(36);
        text("LEVEL " + (currentPlatformerLevel + 1) + " COMPLETE!", sirina / 2, sirina / 2 - 60);
        textSize(22); fill(255); text("Score: " + plrScore, sirina / 2, sirina / 2 - 10);
        textSize(16); fill(255, 215, 0);
        if (currentPlatformerLevel < totalPlatformerLevels - 1) text("SPACE = next level  •  ESC = menu", sirina / 2, sirina / 2 + 50);
        else text("🎉 ALL LEVELS DONE!  •  SPACE = restart  •  ESC = menu", sirina / 2, sirina / 2 + 50);
        if (isNewHighScore) { textSize(20); text("★ NEW HIGH SCORE! ★", sirina / 2, sirina / 2 + 90); }
    }
}

function izrisiOzadje() {
    if (trenutnoOzadje === "Custom Image" && customBgImg) {
        imageMode(CORNER); image(customBgImg, 0, 0, sirina, sirina);
        fill(0, 0, 0, 45); noStroke(); rect(0, 0, sirina, sirina); return;
    }
    if (equipCustomBg) {
        let tile = sirina / bgGridVelikost; noStroke();
        for (let i = 0; i < bgGridVelikost; i++) for (let j = 0; j < bgGridVelikost; j++) {
            let colIdx = customBgGrid[i][j];
            if (colIdx === 0) fill(20, 20, 30);
            else fill(headPalette[colIdx][0], headPalette[colIdx][1], headPalette[colIdx][2]);
            rect(i * tile, j * tile, tile + 1, tile + 1);
        }
        return;
    }
    if (trenutnoOzadje === "Neon Grid" && unlockedRewards.neonGrid) {
        background(6, 12, 28);
        // Animated glowing grid
        let pulse = 0.55 + sin(frameCount * 0.04) * 0.35;
        strokeWeight(1.5);
        for (let x = 0; x < sirina; x += 30) {
            let alpha = 50 + sin(frameCount * 0.05 + x * 0.02) * 40;
            stroke(0, 255, 210, alpha * pulse);
            line(x, 0, x, sirina);
        }
        for (let y = 0; y < sirina; y += 30) {
            let alpha = 50 + cos(frameCount * 0.045 + y * 0.02) * 40;
            stroke(0, 220, 255, alpha * pulse);
            line(0, y, sirina, y);
        }
        // Moving scanline
        let scanY = (frameCount * 2.2) % (sirina + 40) - 20;
        stroke(0, 255, 255, 90);
        strokeWeight(3);
        line(0, scanY, sirina, scanY);
        stroke(0, 255, 200, 40);
        strokeWeight(8);
        line(0, scanY, sirina, scanY);
        // Floating neon dots
        noStroke();
        for (let i = 0; i < 25; i++) {
            let x = (i * 67 + frameCount * 0.4) % sirina;
            let y = (i * 89 + sin(frameCount * 0.03 + i) * 50) % sirina;
            fill(0, 255, 220, 80 + sin(frameCount * 0.08 + i) * 50);
            ellipse(x, y, 2 + (i % 3));
        }
        return;
    }
    if (trenutnoOzadje === "Aurora Pulse" && unlockedRewards.auroraPulse) {
        background(8, 18, 35);
        for (let i = 0; i < 12; i++) {
            let y = 30 + i * 48 + sin(frameCount * 0.035 + i * 0.8) * 55;
            let h = 55 + sin(frameCount * 0.04 + i) * 15;
            fill(
                30 + i * 12 + sin(frameCount * 0.02 + i) * 20,
                160 + i * 8,
                200 + sin(frameCount * 0.03 + i) * 40,
                28 + sin(frameCount * 0.05 + i) * 18
            );
            noStroke();
            rect(0, y, sirina, h);
        }
        // Soft particles
        noStroke();
        for (let i = 0; i < 30; i++) {
            let x = (i * 53 + frameCount * 0.3) % sirina;
            let y = (i * 71 + cos(frameCount * 0.025 + i) * 60) % sirina;
            fill(100, 255, 220, 50 + sin(frameCount * 0.07 + i) * 40);
            ellipse(x, y, 3);
        }
        return;
    }
    if (trenutnoOzadje === "Starfield" && unlockedRewards.starfield) {
        background(3, 3, 12);
        noStroke();
        for (let i = 0; i < 120; i++) {
            let x = (i * 47 + frameCount * (0.15 + (i % 5) * 0.08)) % sirina;
            let y = (i * 73 + frameCount * 0.05) % sirina;
            let r = 1 + (i % 4);
            let twinkle = 100 + sin(frameCount * 0.06 + i * 1.3) * 100;
            fill(200 + (i % 40), 220, 255, twinkle);
            ellipse(x, y, r);
        }
        // Occasional shooting star
        if (frameCount % 90 < 25) {
            let sx = (frameCount * 8) % (sirina + 100) - 50;
            let sy = 80 + sin(frameCount * 0.1) * 40;
            stroke(180, 220, 255, 180);
            strokeWeight(2);
            line(sx, sy, sx - 40, sy + 8);
            stroke(255, 255, 255, 80);
            strokeWeight(4);
            line(sx, sy, sx - 25, sy + 5);
        }
        return;
    }

    if (trenutnoOzadje === "GD Void" && unlockedRewards.gdVoidBackground) {
        background(4, 0, 22);
        noStroke();
        for (let i = 0; i < 18; i++) {
            let a = frameCount * 0.006 + i * 0.75;
            let x = sirina * 0.5 + cos(a) * (80 + i * 14);
            let y = sirina * 0.5 + sin(a * 1.17) * (65 + i * 9);
            fill(80 + i * 5, 30, 180, 18);
            ellipse(x, y, 130 + i * 9, 90 + i * 7);
        }
        for (let i = 0; i < 70; i++) {
            let x = (i * 83 + frameCount * (0.22 + (i % 4) * 0.07)) % sirina;
            let y = (i * 47 + sin(frameCount * 0.018 + i) * 45) % sirina;
            let r = 1 + (i % 3);
            fill(210, 130 + (i % 4) * 25, 255, 90 + sin(frameCount * 0.09 + i) * 70);
            ellipse(x, y, r);
        }
        stroke(170, 80, 255, 35); strokeWeight(1);
        let gridOff = (frameCount * 0.9) % 48;
        for (let x = -gridOff; x < sirina + 48; x += 48) line(x, 0, x, sirina);
        for (let y = -gridOff; y < sirina + 48; y += 48) line(0, y, sirina, y);
        noStroke();
        return;
    }
    if (trenutnoOzadje === "Endless Sky" && unlockedRewards.endlessSkyBackground) {
        background(5, 24, 48);
        noStroke();
        for (let i = 0; i < 9; i++) {
            let y = 55 + i * 65 + sin(frameCount * 0.012 + i) * 22;
            fill(20, 100 + i * 10, 170 + i * 5, 22);
            ellipse(sirina * 0.45 + sin(frameCount * 0.008 + i) * 150, y, 300, 90);
        }
        for (let i = 0; i < 55; i++) {
            let x = (i * 71 - frameCount * (0.35 + (i % 5) * 0.08)) % (sirina + 20);
            if (x < 0) x += sirina + 20;
            let y = (i * 43 + sin(frameCount * 0.02 + i) * 30) % sirina;
            fill(100, 220, 255, 90 + sin(frameCount * 0.07 + i) * 60);
            ellipse(x, y, 2 + (i % 3));
        }
        stroke(80, 210, 255, 28); strokeWeight(1);
        for (let y = (frameCount * 0.6) % 55; y < sirina; y += 55) line(0, y, sirina, y);
        noStroke();
        return;
    }

    let bg = shopBackgrounds.find(b => b.name === trenutnoOzadje);
    let c = bg ? color(bg.color[0], bg.color[1], bg.color[2]) : color(220, 60, 180);
    background(c);

    if (trenutnoOzadje === "Magenta") {
        // Wave gradient + floating orbs
        for (let y = 0; y < sirina; y += 3) {
            let inter = y / sirina;
            let pulse = sin(frameCount * 0.04 + y * 0.012) * 25;
            fill(200 + pulse, 30 + inter * 50, 150 + inter * 60 + pulse * 0.5);
            noStroke(); rect(0, y, sirina, 4);
        }
        noStroke();
        for (let i = 0; i < 18; i++) {
            let ang = frameCount * 0.015 + i * 0.4;
            let x = sirina * 0.5 + cos(ang + i) * (120 + i * 12) + sin(frameCount * 0.02 + i) * 30;
            let y = sirina * 0.5 + sin(ang * 0.8 + i) * (100 + i * 10);
            let r = 30 + sin(frameCount * 0.06 + i) * 18;
            fill(255, 120 + i * 5, 210, 35 + sin(frameCount * 0.05 + i) * 20);
            ellipse(x, y, r * 2);
        }
        for (let i = 0; i < 50; i++) {
            let x = (i * 73 + frameCount * 0.9) % sirina;
            let y = (i * 97 + sin(frameCount * 0.03 + i) * 50) % sirina;
            fill(255, 180, 240, 100); ellipse(x, y, 2 + (i % 3));
        }
    } else if (trenutnoOzadje === "Deep Space") {
        background(5, 5, 18);
        noStroke();
        // nebula first
        for (let i = 0; i < 7; i++) {
            let x = sirina * 0.4 + sin(frameCount * 0.008 + i * 1.1) * 220;
            let y = sirina * 0.45 + cos(frameCount * 0.01 + i * 0.9) * 180;
            fill(40 + i * 15, 15, 90 + i * 12, 16);
            ellipse(x, y, 200 + i * 35, 140 + i * 25);
        }
        // static twinkling stars
        for (let s of zvezde) {
            let tw = 120 + sin(frameCount * 0.1 + s.x * 0.05) * 120;
            fill(255, 255, 255, tw);
            ellipse(s.x, s.y, s.r);
        }
        // many falling stars / streaks
        strokeWeight(1.5);
        for (let i = 0; i < 55; i++) {
            let speed = 2.5 + (i % 7) * 0.8;
            let x = (i * 97 + frameCount * speed * 0.35) % (sirina + 80) - 40;
            let y = (i * 53 + frameCount * speed) % (sirina + 60) - 30;
            let len = 8 + (i % 5) * 4;
            stroke(180 + (i % 3) * 25, 200, 255, 160);
            line(x, y, x - len * 0.4, y + len);
            // bright head
            noStroke();
            fill(255, 255, 255, 200);
            ellipse(x, y, 2);
        }
        // rare big shooting star
        if (frameCount % 180 < 40) {
            let t = (frameCount % 180) / 40;
            let sx = sirina * 0.9 - t * sirina * 1.1;
            let sy = 40 + t * 280;
            stroke(255, 255, 255, 180);
            strokeWeight(2);
            line(sx, sy, sx + 50, sy - 25);
            noStroke();
            fill(255, 255, 220);
            ellipse(sx, sy, 4);
        }
    } else if (trenutnoOzadje === "Matrix") {
        background(3, 12, 3);
        textAlign(CENTER, TOP);
        for (let i = 0; i < matrixStolpci.length; i++) {
            let col = matrixStolpci[i];
            col.y += col.speed * 3.8;
            if (col.y > sirina + col.chars.length * 14) {
                col.y = random(-280, -40);
                col.speed = random(0.8, 2.4);
                // reshuffle glyphs when column restarts
                for (let c = 0; c < col.chars.length; c++) col.chars[c] = matrixRandomChar();
            }
            // occasionally mutate a few characters mid-fall
            if (frameCount % 4 === i % 4) {
                let idx = floor(random(col.chars.length));
                col.chars[idx] = matrixRandomChar();
            }
            let x = i * 12 + 6;
            for (let c = 0; c < col.chars.length; c++) {
                let yy = col.y + c * 14;
                if (yy < -20 || yy > sirina + 20) continue;
                if (c === 0) {
                    // bright white-green head
                    textSize(14);
                    fill(200, 255, 200, 255);
                } else if (c < 3) {
                    textSize(13);
                    fill(100, 255, 120, 230);
                } else {
                    textSize(12);
                    let bright = max(25, 200 - c * 7);
                    fill(0, bright, 30 + (c % 3) * 10, bright);
                }
                text(col.chars[c], x, yy);
            }
        }
    } else if (trenutnoOzadje === "Ocean") {
        for (let y = 0; y < sirina; y += 4) {
            let wave = sin(frameCount * 0.04 + y * 0.02) * 15;
            let inter = y / sirina;
            fill(10 + inter * 20, 40 + inter * 60 + wave, 100 + inter * 80);
            noStroke(); rect(0, y, sirina, 5);
        }
        noStroke();
        for (let b of bubbles) {
            b.y -= b.speed * 1.5;
            if (b.y < -10) { b.y = sirina + 10; b.x = random(sirina); }
            fill(180, 220, 255, 90);
            ellipse(b.x + sin(frameCount * 0.05 + b.x) * 8, b.y, b.r * 2);
        }
        // light rays
        for (let i = 0; i < 5; i++) {
            let x = 80 + i * 110 + sin(frameCount * 0.02 + i) * 20;
            fill(100, 180, 255, 12);
            triangle(x, 0, x - 40, sirina, x + 40, sirina);
        }
    } else if (trenutnoOzadje === "Forest") {
        background(12, 35, 18);
        for (let l of leaves) {
            l.y += l.speed; l.x += sin(frameCount * 0.02 + l.rot) * 0.6;
            l.rot += l.rotSpeed;
            if (l.y > sirina + 20) { l.y = -20; l.x = random(sirina); }
            push(); translate(l.x, l.y); rotate(l.rot);
            fill(l.color[0], l.color[1], l.color[2], 200);
            ellipse(0, 0, l.size, l.size * 0.6);
            pop();
        }
        // fireflies
        noStroke();
        for (let f of fireflies) {
            f.phase += 0.05;
            let a = 80 + sin(f.phase) * 100;
            fill(200, 255, 80, a);
            ellipse(f.x + sin(f.phase * 0.3) * 20, f.y + cos(f.phase * 0.25) * 15, 4);
        }
    } else if (trenutnoOzadje === "Neon City") {
        background(12, 5, 25);
        // buildings
        noStroke();
        for (let i = 0; i < 12; i++) {
            let bx = i * 55 + 5;
            let bh = 120 + (i * 37) % 200;
            fill(20, 10, 40);
            rect(bx, sirina - bh, 45, bh);
            for (let wy = sirina - bh + 10; wy < sirina - 10; wy += 18) {
                if ((i + wy + floor(frameCount * 0.05)) % 3 !== 0) {
                    fill(255, 200, 50, 150 + sin(frameCount * 0.1 + wy) * 50);
                    rect(bx + 8, wy, 8, 8);
                    rect(bx + 25, wy, 8, 8);
                }
            }
        }
        // rain
        stroke(150, 150, 255, 100); strokeWeight(1);
        for (let i = 0; i < 60; i++) {
            let x = (i * 47 + frameCount * 3) % sirina;
            let y = (i * 73 + frameCount * 8) % sirina;
            line(x, y, x - 2, y + 12);
        }
    } else if (trenutnoOzadje === "Void") {
        background(2, 0, 8);
        noStroke();
        // pulsing black hole core
        let pulse = 0.7 + sin(frameCount * 0.04) * 0.3;
        fill(20, 0, 40, 50); ellipse(sirina / 2, sirina / 2, 280 * pulse);
        fill(10, 0, 25, 80); ellipse(sirina / 2, sirina / 2, 160 * pulse);
        fill(0, 0, 0); ellipse(sirina / 2, sirina / 2, 50 * pulse);
        // accretion disk rings
        noFill();
        for (let r = 0; r < 5; r++) {
            stroke(80 + r * 20, 0, 160 + r * 15, 40 + sin(frameCount * 0.05 + r) * 30);
            strokeWeight(3);
            let rot = frameCount * (0.01 + r * 0.003);
            push();
            translate(sirina / 2, sirina / 2);
            rotate(rot);
            ellipse(0, 0, 120 + r * 55, 40 + r * 18);
            pop();
        }
        noStroke();
        // particles sucked toward center
        for (let i = 0; i < 70; i++) {
            let ang = i * 0.4 + frameCount * 0.02;
            let dist0 = 50 + (i * 13 + frameCount * (1.5 + (i % 5) * 0.3)) % 320;
            let dist = dist0;
            // spiral inward
            ang += (350 - dist) * 0.01;
            let x = sirina / 2 + cos(ang) * dist;
            let y = sirina / 2 + sin(ang) * dist * 0.55;
            let a = map(dist, 50, 350, 220, 40);
            fill(150 + (i % 3) * 30, 40, 255, a);
            ellipse(x, y, 2 + (350 - dist) / 120);
        }
    } else if (trenutnoOzadje === "Blood Moon") {
        // animated sky gradient with subtle red pulse
        let skyPulse = sin(frameCount * 0.03) * 12;
        for (let y = 0; y < sirina; y += 3) {
            let inter = y / sirina;
            fill(lerp(50 + skyPulse, 8, inter), lerp(8, 0, inter), lerp(18, 4, inter));
            noStroke(); rect(0, y, sirina, 4);
        }
        noStroke();
        let mx = sirina * 0.68 + sin(frameCount * 0.008) * 15;
        let my = sirina * 0.22 + cos(frameCount * 0.01) * 8;
        let mp = 0.9 + sin(frameCount * 0.04) * 0.12;
        // glow layers
        fill(180, 20, 25, 25); ellipse(mx, my, 220 * mp);
        fill(200, 25, 30, 45); ellipse(mx, my, 160 * mp);
        fill(220, 40, 35, 90); ellipse(mx, my, 110 * mp);
        fill(240, 60, 40); ellipse(mx, my, 70 * mp);
        // crater marks
        fill(160, 30, 25, 100);
        ellipse(mx - 12, my - 8, 12, 10);
        ellipse(mx + 15, my + 10, 8, 7);
        ellipse(mx + 5, my - 18, 6, 5);
        // drifting clouds across moon
        for (let i = 0; i < 6; i++) {
            let cx = (frameCount * (0.4 + i * 0.08) + i * 120) % (sirina + 150) - 75;
            let cy = my - 20 + i * 18 + sin(frameCount * 0.02 + i) * 8;
            fill(20, 5, 10, 70);
            ellipse(cx, cy, 100 + i * 15, 28);
            ellipse(cx + 30, cy + 5, 70, 22);
        }
        // rising thick mist
        for (let i = 0; i < 28; i++) {
            let x = (i * 53 + sin(frameCount * 0.025 + i) * 50) % sirina;
            let y = sirina - ((frameCount * (0.4 + (i % 4) * 0.15) + i * 35) % (sirina * 0.7));
            fill(90, 12, 18, 25 + (i % 5) * 5);
            ellipse(x, y, 90 + (i % 4) * 20, 28 + (i % 3) * 8);
        }
        // bats
        fill(10, 0, 5);
        for (let i = 0; i < 8; i++) {
            let bx = (frameCount * (1.2 + i * 0.15) + i * 80) % (sirina + 40) - 20;
            let by = 60 + i * 35 + sin(frameCount * 0.08 + i) * 20;
            let wing = sin(frameCount * 0.3 + i) * 8;
            triangle(bx, by, bx - 10, by + wing, bx - 4, by + 3);
            triangle(bx, by, bx + 10, by + wing, bx + 4, by + 3);
        }
    } else if (trenutnoOzadje === "Sunset") {
        for (let y = 0; y < sirina; y += 3) {
            let inter = y / sirina;
            fill(lerp(255, 30, inter), lerp(160, 20, inter), lerp(60, 50, inter));
            noStroke(); rect(0, y, sirina, 4);
        }
        noStroke();
        let sx = sirina * 0.65, sy = sirina * 0.3;
        fill(255, 180, 60, 50); ellipse(sx, sy, 140);
        fill(255, 200, 80, 120); ellipse(sx, sy, 90);
        fill(255, 230, 120); ellipse(sx, sy, 50);
        // birds
        stroke(20, 10, 5); strokeWeight(2); noFill();
        for (let i = 0; i < 5; i++) {
            let bx = (frameCount * 0.8 + i * 90) % (sirina + 40) - 20;
            let by = 80 + i * 25 + sin(frameCount * 0.05 + i) * 10;
            arc(bx, by, 14, 8, PI, TWO_PI);
            arc(bx + 12, by, 14, 8, PI, TWO_PI);
        }
    } else if (trenutnoOzadje === "Snow" || trenutnoOzadje === "Arctic") {
        background(trenutnoOzadje === "Arctic" ? color(160, 200, 230) : color(230, 240, 250));
        noStroke();
        for (let i = 0; i < 100; i++) {
            let x = (i * 41 + frameCount * (0.6 + (i % 5) * 0.15)) % sirina;
            let y = (i * 59 + frameCount * (1.0 + (i % 3) * 0.3)) % sirina;
            fill(255, 255, 255, 140 + (i % 4) * 20);
            ellipse(x, y, 1.5 + (i % 5));
        }
        // wind streaks
        stroke(255, 255, 255, 40); strokeWeight(1);
        for (let i = 0; i < 15; i++) {
            let y = (i * 40 + frameCount) % sirina;
            line(0, y, sirina, y + 8);
        }
    } else if (trenutnoOzadje === "Lava Field") {
        for (let y = 0; y < sirina; y += 4) {
            let inter = y / sirina;
            let bubble = sin(frameCount * 0.05 + y * 0.03) * 15;
            fill(60 + bubble, 10 + inter * 20, 5);
            noStroke(); rect(0, y, sirina, 5);
        }
        noStroke();
        for (let i = 0; i < 25; i++) {
            let x = (i * 53 + sin(frameCount * 0.03 + i) * 20) % sirina;
            let y = (i * 71 + frameCount * 0.4) % sirina;
            let r = 8 + sin(frameCount * 0.1 + i) * 6;
            fill(255, 80 + i * 3, 0, 120);
            ellipse(x, y, r * 2);
            fill(255, 200, 50, 80);
            ellipse(x, y, r);
        }
    } else if (trenutnoOzadje === "Aurora") {
        background(5, 15, 30);
        noStroke();
        for (let i = 0; i < 10; i++) {
            let y = 40 + i * 50 + sin(frameCount * 0.03 + i * 0.7) * 45;
            fill(
                20 + i * 15 + sin(frameCount * 0.02 + i) * 30,
                180 + i * 5,
                150 + sin(frameCount * 0.04 + i) * 50,
                30 + sin(frameCount * 0.05 + i) * 15
            );
            beginShape();
            for (let x = 0; x <= sirina; x += 20) {
                let yy = y + sin(frameCount * 0.04 + x * 0.02 + i) * 25;
                vertex(x, yy);
            }
            for (let x = sirina; x >= 0; x -= 20) {
                let yy = y + 40 + sin(frameCount * 0.04 + x * 0.02 + i + 1) * 20;
                vertex(x, yy);
            }
            endShape(CLOSE);
        }
    } else if (trenutnoOzadje === "Cherry Blossom") {
        background(35, 12, 28);
        noStroke();
        for (let i = 0; i < 70; i++) {
            let x = (i * 49 + frameCount * 0.55) % sirina;
            let y = (i * 71 + frameCount * 0.4) % sirina;
            push();
            translate(x, y);
            rotate(frameCount * 0.025 + i);
            fill(255, 150 + (i % 5) * 15, 180, 180);
            for (let p = 0; p < 5; p++) {
                rotate(TWO_PI / 5);
                ellipse(0, 4, 6, 10);
            }
            fill(255, 220, 100); ellipse(0, 0, 4);
            pop();
        }
    } else if (trenutnoOzadje === "Storm") {
        // turbulent sky
        for (let y = 0; y < sirina; y += 4) {
            let n = sin(frameCount * 0.02 + y * 0.015) * 10;
            fill(12 + n, 14 + n * 0.5, 22 + n);
            noStroke(); rect(0, y, sirina, 5);
        }
        // chaotic layered rain (different speeds / angles)
        for (let layer = 0; layer < 3; layer++) {
            let sp = 5 + layer * 4;
            let alpha = 60 + layer * 40;
            stroke(160 + layer * 20, 180, 220, alpha);
            strokeWeight(1 + layer * 0.4);
            for (let i = 0; i < 40 + layer * 20; i++) {
                let seed = i * 47.3 + layer * 100;
                let x = (seed * 1.7 + frameCount * sp * (0.8 + (i % 5) * 0.15)) % (sirina + 30) - 15;
                let y = (seed * 2.3 + frameCount * sp * 1.4) % (sirina + 40) - 20;
                let ang = 0.25 + layer * 0.08 + sin(seed) * 0.1;
                line(x, y, x - 10 * ang, y + 14 + layer * 3);
            }
        }
        // irregular clouds
        noStroke();
        for (let i = 0; i < 12; i++) {
            let x = (i * 70 + frameCount * (0.2 + (i % 3) * 0.15) + sin(frameCount * 0.01 + i) * 20) % (sirina + 160) - 80;
            let y = 20 + (i * 29) % 100 + sin(frameCount * 0.015 + i * 0.7) * 15;
            fill(25, 28, 40, 50 + (i % 4) * 15);
            ellipse(x, y, 130 + (i % 5) * 25, 35 + (i % 3) * 12);
            ellipse(x + 40, y + 8, 90, 28);
        }
        // random lightning bolts (not fixed interval)
        if (random() < 0.012) {
            fill(220, 230, 255, 100);
            rect(0, 0, sirina, sirina);
            stroke(230, 240, 255, 220);
            strokeWeight(2.5);
            let lx = random(100, sirina - 100);
            let ly = 0;
            for (let s = 0; s < 6; s++) {
                let nx = lx + random(-40, 40);
                let ny = ly + random(40, 80);
                line(lx, ly, nx, ny);
                if (random() < 0.4) line(lx, ly, lx + random(-50, 50), ly + random(20, 50));
                lx = nx; ly = ny;
            }
            noStroke();
        }
    } else if (trenutnoOzadje === "Industrial") {
        background(30, 30, 35);
        stroke(60, 60, 70, 180); strokeWeight(2);
        for (let i = 0; i < 16; i++) {
            let y = (frameCount * 1.2 + i * 42) % (sirina + 40) - 20;
            line(0, y, sirina, y);
            line(y, 0, y, sirina);
        }
        // sparks
        noStroke();
        for (let i = 0; i < 20; i++) {
            if ((frameCount + i * 7) % 40 < 8) {
                let x = (i * 67) % sirina, y = (i * 89 + frameCount) % sirina;
                fill(255, 180, 50, 200);
                ellipse(x, y, 3);
            }
        }
    } else if (trenutnoOzadje === "Crystal Cave") {
        background(18, 10, 40);
        noStroke();
        for (let i = 0; i < 50; i++) {
            let x = (i * 59 + sin(frameCount * 0.03 + i) * 30) % sirina;
            let y = (i * 41 + cos(frameCount * 0.025 + i) * 25) % sirina;
            let a = 70 + sin(frameCount * 0.1 + i) * 50;
            fill(160 + (i % 3) * 30, 80, 255, a);
            // crystal shape
            push(); translate(x, y); rotate(frameCount * 0.01 + i);
            triangle(0, -6, -4, 5, 4, 5);
            pop();
        }
        // light beams
        for (let i = 0; i < 4; i++) {
            let x = 100 + i * 130;
            fill(180, 100, 255, 10 + sin(frameCount * 0.04 + i) * 8);
            triangle(x, 0, x - 30, sirina, x + 30, sirina);
        }
    } else if (trenutnoOzadje === "Plasma") {
        background(25, 5, 40);
        noStroke();
        for (let i = 0; i < 10; i++) {
            let cx = sirina * 0.5 + sin(frameCount * 0.025 + i * 0.9) * 200;
            let cy = sirina * 0.5 + cos(frameCount * 0.03 + i * 1.1) * 180;
            let r = 70 + sin(frameCount * 0.05 + i) * 40;
            fill(100 + i * 12, 20 + i * 8, 180 + sin(frameCount * 0.04 + i) * 40, 30);
            ellipse(cx, cy, r * 2.5);
            fill(200, 80, 255, 40);
            ellipse(cx, cy, r);
        }
        strokeWeight(2);
        for (let i = 0; i < 15; i++) {
            let x1 = (i * 97 + frameCount * 1.5) % sirina;
            let y1 = (i * 53 + sin(frameCount * 0.05 + i) * 100 + sirina / 2) % sirina;
            stroke(200, 100, 255, 120 + sin(frameCount * 0.12 + i) * 80);
            line(x1, y1, x1 + sin(frameCount * 0.1 + i) * 50, y1 + cos(frameCount * 0.08 + i) * 40);
        }
    } else if (trenutnoOzadje === "Winter Night") {
        background(12, 18, 35);
        // aurora-ish winter bands
        noStroke();
        for (let i = 0; i < 6; i++) {
            let y = 30 + i * 40 + sin(frameCount * 0.025 + i) * 20;
            fill(80 + i * 15, 140 + i * 10, 200, 20);
            beginShape();
            for (let x = 0; x <= sirina; x += 25) vertex(x, y + sin(frameCount * 0.03 + x * 0.02 + i) * 15);
            for (let x = sirina; x >= 0; x -= 25) vertex(x, y + 35 + sin(frameCount * 0.03 + x * 0.02 + i) * 10);
            endShape(CLOSE);
        }
        // heavy snow
        for (let i = 0; i < 120; i++) {
            let x = (i * 43 + frameCount * (0.5 + (i % 6) * 0.2)) % sirina;
            let y = (i * 67 + frameCount * (1.2 + (i % 4) * 0.4)) % sirina;
            fill(255, 255, 255, 150 + (i % 5) * 20);
            ellipse(x, y, 1.5 + (i % 4));
        }
        // frozen ground glow
        fill(180, 210, 255, 25); rect(0, sirina - 80, sirina, 80);
    } else if (trenutnoOzadje === "Spring Garden") {
        for (let y = 0; y < sirina; y += 4) {
            fill(lerp(140, 40, y / sirina), lerp(200, 100, y / sirina), lerp(120, 50, y / sirina));
            noStroke(); rect(0, y, sirina, 5);
        }
        // floating petals
        noStroke();
        for (let i = 0; i < 50; i++) {
            let x = (i * 51 + frameCount * 0.6) % sirina;
            let y = (i * 73 + frameCount * 0.45) % sirina;
            push(); translate(x, y); rotate(frameCount * 0.03 + i);
            fill(255, 140 + (i % 4) * 20, 180, 180);
            ellipse(0, -3, 5, 8); ellipse(0, 3, 5, 8); ellipse(-3, 0, 8, 5); ellipse(3, 0, 8, 5);
            fill(255, 220, 80); ellipse(0, 0, 3);
            pop();
        }
        // grass sway at bottom
        stroke(40, 120, 40, 150); strokeWeight(1.5);
        for (let i = 0; i < 40; i++) {
            let x = i * 16;
            let sway = sin(frameCount * 0.05 + i * 0.4) * 6;
            line(x, sirina, x + sway, sirina - 20 - (i % 5) * 4);
        }
        noStroke();
    } else if (trenutnoOzadje === "Summer Horizon") {
        for (let y = 0; y < sirina; y += 3) {
            let inter = y / sirina;
            fill(lerp(255, 40, inter), lerp(200, 80, inter), lerp(80, 40, inter));
            noStroke(); rect(0, y, sirina, 4);
        }
        // blazing sun
        noStroke();
        let sx = sirina * 0.5, sy = sirina * 0.28;
        let sp = 0.95 + sin(frameCount * 0.05) * 0.08;
        fill(255, 200, 50, 30); ellipse(sx, sy, 200 * sp);
        fill(255, 180, 40, 60); ellipse(sx, sy, 130 * sp);
        fill(255, 230, 100); ellipse(sx, sy, 70 * sp);
        // heat shimmer lines
        stroke(255, 200, 100, 40); strokeWeight(1);
        for (let i = 0; i < 20; i++) {
            let y = 200 + i * 18 + sin(frameCount * 0.08 + i) * 6;
            line(50, y, sirina - 50, y + sin(frameCount * 0.1 + i) * 4);
        }
        noStroke();
        // floating sparks
        for (let i = 0; i < 25; i++) {
            let x = (i * 61 + sin(frameCount * 0.03 + i) * 30) % sirina;
            let y = (i * 47 + frameCount * 0.5) % sirina;
            fill(255, 200, 50, 120); ellipse(x, y, 2 + (i % 3));
        }
    } else if (trenutnoOzadje === "Autumn Grove") {
        for (let y = 0; y < sirina; y += 4) {
            fill(lerp(60, 25, y / sirina), lerp(30, 15, y / sirina), lerp(15, 8, y / sirina));
            noStroke(); rect(0, y, sirina, 5);
        }
        // falling leaves
        noStroke();
        for (let i = 0; i < 45; i++) {
            let x = (i * 55 + frameCount * 0.5 + sin(frameCount * 0.02 + i) * 40) % sirina;
            let y = (i * 69 + frameCount * (0.7 + (i % 4) * 0.2)) % sirina;
            push(); translate(x, y); rotate(frameCount * 0.04 + i);
            fill(200 + (i % 3) * 20, 80 + (i % 4) * 25, 20, 200);
            ellipse(0, 0, 9, 5);
            pop();
        }
        // soft orange light shafts
        for (let i = 0; i < 4; i++) {
            let x = 80 + i * 140;
            fill(255, 140, 40, 12);
            triangle(x, 0, x - 35, sirina, x + 35, sirina);
        }
    }
}

function spawnBossRushBoss(stage) {
    const cfg = BOSS_RUSH_TYPES[stage - 1];
    if (!cfg) return;
    // Every new round costs the player some tail length: trim safely between bosses.
    if (stage > 1 && k) {
        k.dolzina = max(0, k.dolzina - 2);
        while (k.rep.length > k.dolzina) k.rep.shift();
    }
    bossRush.stage = stage;
    bossRush.active = true;
    bossRush.cleared = false;
    boss = {
        x: floor((sirina - 4 * velikost) / velikost) * velikost,
        y: floor((sirina - 4 * velikost) / velikost) * velikost,
        hp: cfg.hp, maxHp: cfg.hp, size: velikost * 2.5,
        speedTimer: 0, attackTimer: 0, blinkTimer: 0, dashDir: 1, blinkTargetX: null, blinkTargetY: null, blinkWarningUntil: 0,
        name: cfg.name, color: cfg.color, attack: cfg.attack,
        moveEvery: cfg.moveEvery
    };
}

function damageBossRush() {
    if (gameMode !== "Boss Rush" || !boss || !bossRush.active || bossRush.cleared) return;
    boss.hp--;
    if (boss.hp > 0) return;
    bossRush.cleared = true;
    playWinSound();
    spawnParticles(boss.x + boss.size / 2, boss.y + boss.size / 2, 28, color(...boss.color));
    if (bossRush.stage < bossRush.total) {
        // Brief transition: the next boss appears after a short frame-based pause.
        bossRush.nextStageAt = frameCount + 45;
        bossRush.active = false;
    } else {
        bossRush.active = false;
        bossRush.finished = true;
        winScreen = true;
        if (!bossRush.rewardPaid) {
            kovanci += 250;
            localStorage.setItem("snakeCoins", kovanci);
            bossRush.rewardPaid = true;
        }
        const clears = Number(localStorage.getItem("snakeBossRushClears") || 0) + 1;
        localStorage.setItem("snakeBossRushClears", String(clears));
        unlockAchievement("bossSlayer", "bossTrophy");
    }
}

function updateBossRush() {
    if (gameMode !== "Boss Rush" || !boss) return;
    if (bossRush.cleared) {
        if (!bossRush.finished && frameCount >= (bossRush.nextStageAt || 0)) {
            mine = [];
            bossRush.stage++;
            spawnBossRushBoss(bossRush.stage);
            lokacijaHrane();
        }
        return;
    }
    boss.speedTimer++;
    boss.attackTimer++;
    const cfg = BOSS_RUSH_TYPES[bossRush.stage - 1];
    if (!cfg) return;
    const gridMax = floor((sirina - boss.size) / velikost) * velikost;

    if (cfg.attack === "blink") {
        // Telegraph the destination for at least 12 frames and keep it well away
        // from the player's head, so the teleport is readable and fair.
        if (boss.blinkTargetX == null && boss.attackTimer % 28 === 0) {
            let tx = boss.x, ty = boss.y, safe = false;
            for (let tries = 0; tries < 40; tries++) {
                tx = floor(random(1, max(2, floor(sirina / velikost) - 2))) * velikost;
                ty = floor(random(1, max(2, floor(sirina / velikost) - 2))) * velikost;
                const dx = abs(tx - k.x), dy = abs(ty - k.y);
                if (dx + dy >= velikost * 9 && dist(tx, ty, boss.x, boss.y) >= velikost * 4) { safe = true; break; }
            }
            if (!safe) { tx = k.x < sirina / 2 ? sirina - 5 * velikost : 4 * velikost; ty = k.y < sirina / 2 ? sirina - 5 * velikost : 4 * velikost; }
            boss.blinkTargetX = constrain(tx, 0, gridMax);
            boss.blinkTargetY = constrain(ty, 0, gridMax);
            boss.blinkWarningUntil = frameCount + 12;
        }
        if (boss.blinkTargetX != null && frameCount >= boss.blinkWarningUntil) {
            boss.x = boss.blinkTargetX;
            boss.y = boss.blinkTargetY;
            boss.blinkTargetX = null;
            boss.blinkTargetY = null;
        }
        return;
    }

    if (boss.speedTimer % cfg.moveEvery !== 0) return;
    if (cfg.attack === "rush" || cfg.attack === "finale") {
        if (boss.attackTimer % 8 < 4) boss.x += boss.x < k.x ? velikost * 2 : -velikost * 2;
        else boss.y += boss.y < k.y ? velikost * 2 : -velikost * 2;
    } else {
        if (random() < 0.55) boss.x += boss.x < k.x ? velikost : -velikost;
        else boss.y += boss.y < k.y ? velikost : -velikost;
    }
    boss.x = constrain(boss.x, 0, gridMax);
    boss.y = constrain(boss.y, 0, gridMax);
    if ((cfg.attack === "mines" || cfg.attack === "finale") && boss.attackTimer % (cfg.attack === "finale" ? 30 : 48) === 0) {
        mine.push(createVector(floor(random(floor(sirina / velikost))) * velikost, floor(random(floor(sirina / velikost))) * velikost));
    }
}

function updateMultiplayerStep() {
    if (gameMode !== "Multiplayer" || !player2 || gameOver) return;
    if (p2NextDirX || p2NextDirY) {
        player2.smer(p2NextDirX, p2NextDirY);
        p2NextDirX = 0; p2NextDirY = 0;
    }
    if (!player2.smrt && (player2.xspeed || player2.yspeed)) player2.premik();
    const hitWall = sn => sn.x < 0 || sn.y < 0 || sn.x >= sirina || sn.y >= sirina;
    if (!player2.smrt && hitWall(player2)) player2.sproziUdarac("Player 2 hit wall");
    if (!k.smrt && hitWall(k)) k.sproziUdarac("Player 1 hit wall");
    // Head-to-head and body collisions count as a loss for the snake that hits.
    if (!k.smrt && player2.x === k.x && player2.y === k.y) { k.sproziUdarac("Head-to-head collision"); player2.sproziUdarac("Head-to-head collision"); }
    if (!k.smrt && player2.rep.some(r => r.x === k.x && r.y === k.y)) k.sproziUdarac("Player 1 hit Player 2's tail");
    if (!player2.smrt && k.rep.some(r => r.x === player2.x && r.y === player2.y)) player2.sproziUdarac("Player 2 hit Player 1's tail");
    // Player 2 shares food with Player 1.
    if (!player2.smrt) {
        for (let i = hrana.length - 1; i >= 0; i--) {
            if (player2.pojej(hrana[i])) {
                if (!hrana[i].isIllusion) playEatSound();
                hrana.splice(i, 1); lokacijaHrane();
                break;
            }
        }
    }
    if (k.smrt || player2.smrt) {
        multiplayerWinner = k.smrt && player2.smrt ? "DRAW!" : (k.smrt ? "PLAYER 2 WINS!" : "PLAYER 1 WINS!");
        gameOver = true;
    }
}

function resetGame() {
    // Also clear stale traces when restarting or switching to any ordinary mode.
    if (levelBuilder) levelBuilder.hitboxTrail = [];
    isDailyChallenge = (gameMode === "Daily Challenge");
    isCustomMode = (gameMode === "Custom Mode");
    ghostRaceEnabled = (gameMode === "Ghost Race");
    survivalTimer = 0;
    glitchTimer = 0;
    totalFoodEaten = 0;
    revivedThisRun = false;
    platformerContinues = 0;
    deathReplay = false;
    deathReplayRecording = [];
    gdReplayRecording = [];
    gdWaveTrail = [];
    replayKind = "snake";
    recordingPath = [];
    ghostFrame = 0;
    modesPlayed.add(gameMode);
    if (modesPlayed.size >= 5) unlockAchievement("modeHopper", "starfield");
    if (kupljeneKoze.length >= 4) unlockAchievement("collector", "sparkleAura");

    if (gameMode === "Platformer") {
        initPlatformer(0); gameOver = false; winScreen = false; pavza = false; frameRate(60); return;
    }
    if (gameMode === "Tower Climb") {
        initTowerClimb(); gameOver = false; winScreen = false; pavza = false; frameRate(60); return;
    }
    dailySeedMode = false;
    if (gameMode === "GD Builder Test") {
        gameOver = false; winScreen = false; gdWon = false; pavza = false; jumpscare = false;
        startBuilderTest();
        return;
    }
    if (gameMode === "AI Lab") { vPodmenijuAILab=true; menu=true; return; }
    if (isGDGameMode()) {
        initGeometryDash(); gameOver = false; winScreen = false; gdWon = false; pavza = false; frameRate(60); return;
    }
    if (gameMode === "Snake+GD Hybrid") {
        hybridPhase = "snake";
        hybridScore = 0;
        hybridPortalTriggered = false;
        // fall through to snake
    }

    // Hard reset all GD state before creating a Snake run. This prevents the
    // previous cube/ship/wave/swing state from leaking into Snake after exit.
    gdCube = null;
    gdObstacles = [];
    gdScroll = 0;
    gdStarted = false;
    gdWon = false;
    gdSwingDir = 1;
    gdSwingLatch = false;

    frameRate(13);
    k = new Kaca();
    player2 = null; multiplayerWinner = ""; p2NextDirX = 0; p2NextDirY = 0;
    if (gameMode === "Multiplayer") {
        k.x = 5 * velikost; k.y = floor((sirina / 2) / velikost) * velikost;
        k.xspeed = 1; k.yspeed = 0; k.dolzina = 3;
        player2 = new Kaca();
        player2.x = (floor(sirina / velikost) - 6) * velikost; player2.y = k.y;
        player2.xspeed = -1; player2.yspeed = 0; player2.dolzina = 3;
        player2.customColor = [60, 220, 255];
    }
    stene = []; hrana = []; mine = [];
    robZmanjsanja = 0; activeEffects = [];
    lovecSpeedTimer = 0; timeWarpZaloga = 150; winScreen = false; echoTrail = [];
    boss = null;
    bossRush = { stage: 1, total: BOSS_RUSH_TYPES.length, active: false, cleared: false, rewardPaid: false, finished: false, nextStageAt: 0 };
    jumpscare = false; jumpscareTimer = 0;
    if (particleActive) { for (let p of particleActive) p.active = false; particleActive = []; }
    screenShake = 0; nextDirX = 0; nextDirY = 0; isNewHighScore = false;
    deathCause = "";
    hybridPhase = "snake"; hybridScore = 0; hybridPortalTriggered = false; hybridStage = 0; hybridSnakeTarget = HYBRID_SNAKE_TARGETS ? HYBRID_SNAKE_TARGETS[0] : 5;
    lovec = null;

    if (isDailyChallenge) {
        generateDailyChallenge();
        if (dailyModifiers.includes("Walls")) generirajStene();
        if (dailyModifiers.includes("Chaser")) lovec = createVector(sirina - velikost, sirina - velikost);
        if (dailyModifiers.includes("Mines")) for (let i = 0; i < 5; i++) mine.push(createVector(floor(random(floor(sirina / velikost))) * velikost, floor(random(floor(sirina / velikost))) * velikost));
        // Shrink removed from daily
        if (dailyModifiers.includes("Fast")) frameRate(17);
        if (watchingAI) { k.xspeed = 1; k.yspeed = 0; frameRate(15); }
    } else if (isCustomMode) {
        if (builderFlags.walls) generirajStene();
        if (builderFlags.chaser) lovec = createVector(sirina - velikost, sirina - velikost);
        if (builderFlags.mines) for (let i = 0; i < 5; i++) mine.push(createVector(floor(random(floor(sirina / velikost))) * velikost, floor(random(floor(sirina / velikost))) * velikost));
        if (builderFlags.fast) frameRate(17);
        if (builderFlags.ai) { k.xspeed = 1; k.yspeed = 0; frameRate(15); }
    } else {
        if (gameMode === "Walls") generirajStene();
        if (gameMode === "Chaser") lovec = createVector(sirina - velikost, sirina - velikost);
        if (gameMode === "Boss Fight") boss = { x: sirina - 80, y: sirina - 80, hp: 25, maxHp: 25, size: velikost * 2.5, speedTimer: 0 };
        if (gameMode === "Boss Rush") spawnBossRushBoss(1);
        if (gameMode === "AI Mode") { k.xspeed = 1; k.yspeed = 0; frameRate(20); }
        if (gameMode === "Minefield") for (let i = 0; i < 8; i++) mine.push(createVector(floor(random(floor(sirina / velikost))) * velikost, floor(random(floor(sirina / velikost))) * velikost));
        if (gameMode === "Shrinking Map") robZmanjsanja = 10;
    }
    lokacijaHrane();
    if ((isCustomMode && builderFlags.multiFood) || gameMode === "Multiple Food") {
        for (let i = 0; i < 3; i++) lokacijaHrane();
    }
    pavza = false; gameOver = false; chaosTimer = 0;
    applyPreRunBoosts();
    startAmbientForBg(trenutnoOzadje);
}

function startDailyWithAI() {
    watchingAI = true; isDailyChallenge = true;
    gameMode = "Daily Challenge"; menu = false; resetGame();
}

function modeHas(flag) {
    if (flag === "foodEffects") return gameMode === "Food Effects" || (isCustomMode && builderFlags.foodEffects);
    if (flag === "portal") return gameMode === "Portal" || (isCustomMode && builderFlags.portals);
    if (flag === "multiFood") return gameMode === "Multiple Food" || (isCustomMode && builderFlags.multiFood) || (isDailyChallenge && dailyModifiers.includes("Double Food"));
    if (flag === "chaser") return gameMode === "Chaser" || (isCustomMode && builderFlags.chaser) || (isDailyChallenge && dailyModifiers.includes("Chaser"));
    if (flag === "mines") return gameMode === "Minefield" || (isCustomMode && builderFlags.mines) || (isDailyChallenge && dailyModifiers.includes("Mines"));
    if (flag === "shrink") return false; // permanently disabled
    if (flag === "walls") return gameMode === "Walls" || (isCustomMode && builderFlags.walls) || (isDailyChallenge && dailyModifiers.includes("Walls"));
    if (flag === "ai") return gameMode === "AI Mode" || watchingAI || (isCustomMode && builderFlags.ai) || tutorialPracticeAI;
    if (flag === "homingFood") return gameMode === "Homing Food" || (isCustomMode && builderFlags.homingFood);
    if (flag === "echoShadow") return gameMode === "Echo Shadow" || (isCustomMode && builderFlags.echoShadow);
    return false;
}

function getExclusiveItems() {
    let items = [];
    for (let s of exclusiveSkins) if (unlockedRewards[s.key]) items.push({ ...s, type: "skin" });
    for (let b of exclusiveBgs) if (unlockedRewards[b.key]) items.push({ ...b, type: "bg" });
    for (let a of exclusiveAccessories) if (unlockedRewards[a.key]) items.push({ ...a, type: "acc" });
    for (let p of exclusivePerks) if (unlockedRewards[p.key]) items.push({ ...p, type: "perk" });
    return items;
}

function getPerkEquipState(equipKey) {
    if (equipKey === "equipNeonTrail") return equipNeonTrail;
    if (equipKey === "equipSparkleAura") return equipSparkleAura;
    if (equipKey === "equipGhostAura") return equipGhostAura;
    return false;
}

function togglePerk(equipKey) {
    if (equipKey === "equipNeonTrail") { equipNeonTrail = !equipNeonTrail; localStorage.setItem("equipNeonTrail", equipNeonTrail); }
    else if (equipKey === "equipSparkleAura") { equipSparkleAura = !equipSparkleAura; localStorage.setItem("equipSparkleAura", equipSparkleAura); }
    else if (equipKey === "equipGhostAura") { equipGhostAura = !equipGhostAura; localStorage.setItem("equipGhostAura", equipGhostAura); }
}

// ========== MOUSE SUPPORT HELPERS ==========
function handleMainMenuClick() {
    const items = [
        { y: 70, idx: 0 },
        { y: 95, idx: 1 },
        { y: 120, idx: 2 },
        { y: 145, idx: 3 },
        { y: 170, idx: 4 },
        { y: 195, idx: 5 },
        { y: 220, idx: 6 },
        { y: 245, idx: 7 },
        { y: 270, idx: 8 },
    ];
    for (let item of items) {
        if (mouseY > item.y - 14 && mouseY < item.y + 14 && mouseX > 120 && mouseX < 480) {
            glavniMeniIzbira = item.idx;
            playMenuSound();
            activateMainMenuOption();
            return true;
        }
    }

    // Mode selection (when START is highlighted)
    if (glavniMeniIzbira === 0) {
        let selectable = getSelectableModes();
        for (let s = 0; s < selectable.length; s++) {
            let i = selectable[s];
            let lay = modeListLayout(s);
            if (mouseY > lay.yPos - 9 && mouseY < lay.yPos + 9 && abs(mouseX - lay.xPos) < 95) {
                selectedMode = i;
                playMenuSound();
                return true;
            }
        }
    }
    return false;
}

function activateMainMenuOption() {
    if (glavniMeniIzbira === 0) {
        gameMode = modes[selectedMode];
        watchingAI = false;
        if (gameMode === "Custom Mode") {
            vPodmenijuBuilder = true;
            builderIzbira = 0;
            return;
        }
        menu = false;
        deathReplay = false;
        gameOver = false;
        winScreen = false;
        gdWon = false;
        resetGame();
        if (soundEnabled) tryStartMusic();
    } else if (glavniMeniIzbira === 1) {
        vPodmenijuRecords = true;
    } else if (glavniMeniIzbira === 2) {
        vPodmenijuShop = true;
        shopIzbira = 0;
        shopKategorija = 0;
    } else if (glavniMeniIzbira === 3) {
        // Level Builder (pixel editor still available via button inside)
        if (!levelBuilder.grid || !levelBuilder.grid.length) builderGridInit();
        vPodmenijuLevelBuilder = true;
        levelBuilder.inEditor = false;
        levelBuilder.msg = "";
    } else if (glavniMeniIzbira === 4) {
        menu = false;
        gameMode = "Daily Challenge";
        isDailyChallenge = true;
        watchingAI = false;
        resetGame();
    } else if (glavniMeniIzbira === 5) {
        startDailyWithAI();
    } else if (glavniMeniIzbira === 6) {
        showAchievements = true;
    } else if (glavniMeniIzbira === 8) {
        vPodmenijuSpend = true;
        spendTab = 0;
        spendIzbira = 0;
    } else if (glavniMeniIzbira === 7) {
        alert(
"KONTROLE\n" +
"Kača: puščice = premik, SPACE = pavza, ESC = meni\n" +
"Multiplayer: P1 = puščice, P2 = W/A/S/D\n" +
"J = nastavitve, A = achievements\n" +
"Platformer: A/D ali ←/→, W/SPACE/↑ = skok\n" +
"Miška: klikni meni / shop\n\n" +
"FOOD EFFECTS (barve hrane)\n" +
"modra = SLOW (počasna)\n" +
"zelena = GROW (+4)\n" +
"vijolična = SHRINK (-5)\n" +
"rjava = TINY | zlata = GIANT\n" +
"magenta = DASH (zelo hitra)\n" +
"rdeča = SHIELD  •  cian = GHOST  •  oranžna = TELEPORT\n" +
"cyan = FREEZE | siva = RAINBOW\n" +
"temno zelena = DRIFT (samo ob tipki)\n" +
"roza = REVERSE | temno vijolična = ILLUSION (-4)\n" +
"zlata = GOLDAPPLE (+14) / JACKPOT\n\n" +
"PERKI (Exclusive → ON/OFF)\n" +
"Neon Trail = cyan partikli\n" +
"Food Sense = hrana se hitro privlači\n" +
"Sparkle Particles = bleščice\n\n" +
"Daily: +80 kovancev ob uspehu"
        );
    }
}

function handleShopClick() {
    // Categories
    const cats = [
        { x: 75, idx: 0 },
        { x: 195, idx: 1 },
        { x: 310, idx: 2 },
        { x: 450, idx: 3 }
    ];
    for (let c of cats) {
        if (abs(mouseX - c.x) < 55 && mouseY > 88 && mouseY < 112) {
            shopKategorija = c.idx;
            shopIzbira = 0;
            shopScroll = 0;
            playMenuSound();
            return true;
        }
    }

    // Items
    let artikli = shopKategorija === 0 ? shopSkins :
                  shopKategorija === 1 ? shopBackgrounds :
                  shopKategorija === 2 ? shopAccessories :
                  getExclusiveItems();

    let end = min(artikli.length, shopScroll + SHOP_VISIBLE);
    for (let i = shopScroll; i < end; i++) {
        let yPos = 118 + (i - shopScroll) * SHOP_ROW_H;
        if (mouseY > yPos - 10 && mouseY < yPos + 10 && mouseX > 40 && mouseX < sirina - 20) {
            shopIzbira = i;
            playMenuSound();
            activateShopItem(artikli[i]);
            return true;
        }
    }
    return false;
}

function activateShopItem(a) {
    if (shopKategorija === 3) {
        if (a.type === "skin") {
            trenutnaKoza = a.name;
            localStorage.setItem("trenutnaKoza", trenutnaKoza);
        } else if (a.type === "bg") {
            trenutnoOzadje = a.name;
            localStorage.setItem("trenutnoOzadje", trenutnoOzadje);
        } else if (a.type === "acc") {
            trenutniDodatek = a.name;
            localStorage.setItem("trenutniDodatek", trenutniDodatek);
        } else if (a.type === "perk") {
            togglePerk(a.equipKey);
        }
        playBuySound();
    } else {
        let kupljeno = shopKategorija === 0 ? kupljeneKoze : (shopKategorija === 1 ? kupljenaOzadja : kupljeniDodatki);

        if (a.name === "Custom Head" || a.name === "Custom Tail" || a.name === "Custom BG") {
            if (kupljeno.includes(a.name)) {
                if (a.name === "Custom Head") { equipCustomHead = !equipCustomHead; localStorage.setItem("equipCustomHead", equipCustomHead); }
                else if (a.name === "Custom Tail") { equipCustomTail = !equipCustomTail; localStorage.setItem("equipCustomTail", equipCustomTail); }
                else if (a.name === "Custom BG") { equipCustomBg = !equipCustomBg; localStorage.setItem("equipCustomBg", equipCustomBg); }
                playBuySound();
            } else if (kovanci >= a.price) {
                kovanci -= a.price; localStorage.setItem("snakeCoins", kovanci);
                kupljeno.push(a.name);
                localStorage.setItem(shopKategorija === 0 ? "kupljeneKoze" : shopKategorija === 1 ? "kupljenaOzadja" : "kupljeniDodatki", JSON.stringify(kupljeno));
                if (a.name === "Custom Head") { equipCustomHead = true; localStorage.setItem("equipCustomHead", true); }
                else if (a.name === "Custom Tail") { equipCustomTail = true; localStorage.setItem("equipCustomTail", true); }
                else if (a.name === "Custom BG") { equipCustomBg = true; localStorage.setItem("equipCustomBg", true); }
                playBuySound();
                unlockAchievement("shopper", "emberSkin");
                if (kupljeneKoze.length >= 4) unlockAchievement("collector", "sparkleAura");
            }
        } else if (kupljeno.includes(a.name)) {
            if (shopKategorija === 0 && isSeasonalSkin(a.name) && !isSeasonalSkinInSeason(a.name)) {
                playTone(120, "sawtooth", 0.15, 0.08);
                return;
            }
            if (shopKategorija === 1 && isSeasonalBg(a.name) && !isSeasonalBgInSeason(a.name)) {
                playTone(120, "sawtooth", 0.15, 0.08);
                return;
            }
            if (shopKategorija === 0) { trenutnaKoza = a.name; localStorage.setItem("trenutnaKoza", trenutnaKoza); }
            else if (shopKategorija === 1) { trenutnoOzadje = a.name; localStorage.setItem("trenutnoOzadje", trenutnoOzadje); startAmbientForBg(trenutnoOzadje); }
            else { trenutniDodatek = a.name; localStorage.setItem("trenutniDodatek", trenutniDodatek); }
            playBuySound();
        } else if (kovanci >= a.price) {
            if (shopKategorija === 0 && isSeasonalSkin(a.name) && !isSeasonalSkinInSeason(a.name)) {
                playTone(120, "sawtooth", 0.15, 0.08);
                return;
            }
            if (shopKategorija === 1 && isSeasonalBg(a.name) && !isSeasonalBgInSeason(a.name)) {
                playTone(120, "sawtooth", 0.15, 0.08);
                return;
            }
            kovanci -= a.price; localStorage.setItem("snakeCoins", kovanci);
            kupljeno.push(a.name);
            if (shopKategorija === 0) {
                trenutnaKoza = a.name;
                localStorage.setItem("kupljeneKoze", JSON.stringify(kupljeneKoze));
                localStorage.setItem("trenutnaKoza", trenutnaKoza);
            } else if (shopKategorija === 1) {
                trenutnoOzadje = a.name;
                localStorage.setItem("kupljenaOzadja", JSON.stringify(kupljenaOzadja));
                localStorage.setItem("trenutnoOzadje", trenutnoOzadje);
                startAmbientForBg(trenutnoOzadje);
            } else {
                trenutniDodatek = a.name;
                localStorage.setItem("kupljeniDodatki", JSON.stringify(kupljeniDodatki));
                localStorage.setItem("trenutniDodatek", trenutniDodatek);
            }
            playBuySound();
            unlockAchievement("shopper", "emberSkin");
            if (kupljeneKoze.length >= 4) unlockAchievement("collector", "sparkleAura");
        }
    }
}

function draw() {
    push();

    // Keep ambient music running while playing; menu/ESC explicitly stop it.
    if (!ambientActive && soundEnabled) tryStartMusic();
    if (soundEnabled) updateMenuMusic();

    // ========== INTRO ANIMATION ==========
    if (introActive) {
        background(5, 5, 15);
        introTimer++;
        let t = constrain(introTimer / INTRO_DURATION, 0, 1);
        // expanding ring
        noFill();
        stroke(0, 255, 180, 180 * (1 - t));
        strokeWeight(3);
        ellipse(sirina / 2, sirina / 2, t * sirina * 1.4);
        stroke(100, 200, 255, 120 * (1 - t));
        ellipse(sirina / 2, sirina / 2, t * sirina * 1.1);
        // title fade-in
        let a = constrain((t - 0.15) * 2.5, 0, 1);
        textAlign(CENTER, CENTER);
        fill(0, 255, 200, a * 255);
        textSize(42 + sin(introTimer * 0.15) * 2);
        text("SNAKE GAME ULTRA", sirina / 2, sirina / 2 - 30);
        fill(200, 220, 255, a * 200);
        textSize(16);
        text("klikni ali pritisni tipko", sirina / 2, sirina / 2 + 30);
        // particles
        noStroke();
        for (let i = 0; i < 40; i++) {
            let ang = i * 0.4 + introTimer * 0.05;
            let r = 40 + t * 200 + sin(introTimer * 0.1 + i) * 20;
            fill(0, 255, 180, 100 * (1 - t));
            ellipse(sirina / 2 + cos(ang) * r, sirina / 2 + sin(ang) * r, 3);
        }
        if (introTimer >= INTRO_DURATION + 30) {
            introActive = false;
            tryStartMusic();
        }
        pop();
        return;
    }

    // ========== TUTORIAL (text steps only when in menu and not practicing) ==========
    if (tutorialActive && menu && !tutorialPractice) {
        izrisiOzadje();
        fill(0, 0, 0, 190); noStroke(); rect(0, 0, sirina, sirina);
        fill(255); textAlign(CENTER, CENTER);
        textSize(26); fill(0, 255, 200);
        text("TUTORIAL", sirina / 2, 55);
        textSize(14); fill(255);
        // Accurate info based on real controls in this game
        const steps = [
            "Cilj: jej hrano, rasti, ne udari v steno/rep.\n\nGlavni meni: ↑↓ izbira, ENTER/SPACE = potrdi\nali klikni z miško.",
            "▶ START GAME — izberi način z ← →\n(Classic, Speed, Walls, Custom...)\n\n▶ RECORDS — tvoji rekordi\n▶ SHOP — skini, ozadja, dodatki\n▶ CUSTOM SKIN EDITOR — nariši svoj skin",
            "▶ DAILY CHALLENGE — dnevni cilj +80 🪙\n▶ WATCH AI DAILY — AI igra daily\n▶ ACHIEVEMENTS (ali tipka A)\n▶ HOW TO PLAY — polna pomoč\n▶ SPEND COINS — boosti, gamble, upgrade-i",
            "MED IGRO:\n↑↓←→ = premik kače\nSPACE = pavza\nR med pavzo = restart\nESC = nazaj v meni\n\nOb smrti: R = revive (če imaš 🪙)",
            "HRANA (barve):\nmodra=SLOW  zelena=GROW  vijolična=SHRINK\nposebne barve = različni gameplay efekti\n\nSHOP / SPEND = klikni v meniju\nJ = nastavitve  •  M = mute  •  E = seasonal",
            "PRAKSA: zdaj boš za trenutek igral Classic.\n\nJej 3 hrane (dolžina 3+).\nESC preskoči vajo.\n\nENTER / klik = začni prakso!"
        ];
        let si = min(tutorialStep, steps.length - 1);
        text(steps[si], sirina / 2, sirina / 2 - 10);
        textSize(13); fill(180);
        text((si + 1) + " / " + steps.length + "   •   ENTER / klik = naprej", sirina / 2, sirina - 45);
        for (let i = 0; i < steps.length; i++) {
            fill(i <= si ? color(0, 255, 200) : color(80));
            ellipse(sirina / 2 - 50 + i * 18, sirina - 75, 9);
        }
        pop();
        return;
    }

    // Tutorial practice HUD overlay (during live game)
    if (tutorialPractice && !menu) {
        // drawn later after game frame — flag only here
    }

    // Reality Glitch effect
    if (trenutnaKoza === "Reality Glitch" && unlockedRewards.realityGlitch && !menu && !gameOver && !pavza) {
        if (glitchTimer <= 0 && random() < 0.04) {
            glitchTimer = floor(random(4, 12));
            glitchOffset = random(-18, 18);
        }
        if (glitchTimer > 0) {
            translate(glitchOffset, 0);
            glitchTimer--;
            if (random() < 0.3) {
                fill(0, 255, 180, 30);
                rect(0, random(sirina), sirina, random(8, 25));
            }
        }
    }

    if (screenShake > 0) {
        translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
        screenShake *= 0.88; if (screenShake < 0.5) screenShake = 0;
    }

    if (showSettings) {
        background(20, 20, 30);
        fill(255); textAlign(CENTER, CENTER); textSize(28); text("⚙ NASTAVITVE", sirina / 2, 40);
        textSize(16); text("Pogostost jumpscara: " + Math.round(jumpscareChance * 100) + "%", sirina / 2, 80);
        fill(60); rect(150, 105, 300, 18, 8);
        fill(0, 200, 255); ellipse(map(jumpscareChance, 0, 1, 150, 450), 114, 20, 20);

        // Sound toggle
        fill(soundEnabled ? color(40, 160, 80) : color(120, 50, 50));
        rect(sirina / 2 - 120, 145, 240, 36, 8);
        fill(255); textSize(15);
        text(soundEnabled ? "🔊 ZVOK VKLJUČEN (M)" : "🔇 ZVOK IZKLJUČEN (M)", sirina / 2, 163);

        // Volume slider
        textSize(14); fill(200); text("Glasnost: " + Math.round(masterVolume * 100) + "%", sirina / 2, 205);
        fill(60); rect(150, 225, 300, 18, 8);
        fill(255, 200, 50); ellipse(map(masterVolume, 0, 1, 150, 450), 234, 20, 20);

        fill(customJumpscareImg ? color(0, 180, 80) : color(80, 80, 180));
        rect(sirina / 2 - 120, 270, 240, 42, 8); fill(255); textSize(15);
        text(customJumpscareImg ? "✓ JUMPSCARE SLIKA" : "NALOŽI JUMPSCARE", sirina / 2, 291);
        fill(customBgImg ? color(0, 160, 100) : color(100, 60, 180));
        rect(sirina / 2 - 120, 330, 240, 42, 8); fill(255);
        text(customBgImg ? "✓ OZADJE NALOŽENO" : "NALOŽI OZADJE", sirina / 2, 351);

        // Practice mode (GD)
        fill(practiceMode ? color(30, 140, 200) : color(70, 70, 90));
        rect(sirina / 2 - 120, 385, 240, 36, 8); fill(255); textSize(14);
        text(practiceMode ? "✓ PRACTICE MODE (GD)" : "PRACTICE MODE IZKLOPLJEN", sirina / 2, 403);
        textSize(10); fill(180);
        text("Auto CP • C=dodaj • X=izbriši • brez kovancev", sirina / 2, 428);

        fill(multiActivateOrbs ? color(40, 160, 90) : color(70, 70, 90));
        rect(sirina / 2 - 120, 442, 240, 34, 8); fill(255); textSize(13);
        text(multiActivateOrbs ? "✓ MULTI-ACTIVATE ORBS" : "ORBS: 1× ONLY", sirina / 2, 459);
        textSize(10); fill(180);
        text("Off = vsak orb 1×  •  On = ponovno po izhodu", sirina / 2, 482);

        // Reset tutorial
        fill(80, 80, 120); rect(sirina / 2 - 120, 500, 240, 34, 8); fill(255); textSize(14);
        text("PONOVNI TUTORIAL", sirina / 2, 517);

        fill(200, 60, 60); rect(sirina / 2 - 80, 545, 160, 40, 8); fill(255); textSize(16); text("ZAPRI (J)", sirina / 2, 565);
        pop(); return;
    }

    if (showAchievements) {
        background(12, 12, 28);
        fill(255, 215, 0); textAlign(CENTER, CENTER); textSize(24); text("🏆 ACHIEVEMENTS", sirina / 2, 28);
        textSize(11); textAlign(LEFT, CENTER);
        let y = 52;
        const list = [
            { key: "beginner", name: "Beginner", desc: "Score 10+", reward: "Neon Trail" },
            { key: "dailyStarter", name: "Daily Starter", desc: "Complete 1 Daily", reward: "Aurora Pulse BG" },
            { key: "shopper", name: "Shopper", desc: "Buy any item", reward: "Ember Skin" },
            { key: "modeHopper", name: "Mode Hopper", desc: "Play 5 different modes", reward: "Starfield BG" },
            { key: "platformerStart", name: "Platformer Start", desc: "Finish Level 1", reward: "Crystal Skin" },
            { key: "collector", name: "Collector", desc: "Own 4 skins", reward: "Sparkle Aura" },
            { key: "firstSteps", name: "First Steps", desc: "Die 15 times", reward: "Special Death FX" },
            { key: "coinHoarder", name: "Coin Hoarder", desc: "Collect 300 coins", reward: "Gold Trail" },
            { key: "dailyWarrior", name: "Daily Warrior", desc: "Complete 5 Dailies", reward: "Solar Flare Skin" },
            { key: "dailyLegend", name: "Daily Legend", desc: "Complete 15 Dailies", reward: "Phoenix Wings" },
            { key: "platformerRookie", name: "Platformer Rookie", desc: "Finish Level 3", reward: "Neon Grid BG" },
            { key: "platformerMaster", name: "Platformer Master", desc: "Clear all 5 levels with 0 deaths", reward: "Cyber Phantom Skin" },
            { key: "highRoller", name: "High Roller", desc: "Score 80+", reward: "Golden Crown+" },
            { key: "immortal", name: "Immortal", desc: "Survive 180 seconds", reward: "Ghost Aura" },
            { key: "speedDemon", name: "Speed Demon", desc: "Score 35 in Speed Increase", reward: "Void Walker Skin" },
            { key: "bossSlayer", name: "Boss Slayer", desc: "Defeat the Boss", reward: "Boss Trophy" },
            { key: "glitchLord", name: "Glitch Lord", desc: "Score 100+", reward: "Reality Glitch Skin" },
            { key: "gdExplorer", name: "GD Explorer", desc: "Reach 1500 m in Geometry Dash", reward: "Prism Runner Skin · MYTHIC" },
            { key: "gdShipPilot", name: "Ship Pilot", desc: "Reach 1500 m in GD Ship", reward: "Sky Engine Skin · MYTHIC" },
            { key: "gdWaveMaster", name: "Wave Master", desc: "Reach 2000 m in GD Wave", reward: "GD Void Background · MYTHIC" },
            { key: "gdSwingMaster", name: "Swing Master", desc: "Reach 1500 m in GD Swing", reward: "Gravity Crown · MYTHIC" },
            { key: "gdRobotMaster", name: "Robot Master", desc: "Reach 1500 m in GD Robot", reward: "Titan Alloy Skin · MYTHIC" },
            { key: "gdUFOMaster", name: "UFO Master", desc: "Reach 1500 m in GD UFO", reward: "Nebula Drift BG · MYTHIC" },
            { key: "gdBallMaster", name: "Ball Master", desc: "Reach 1500 m in GD Ball", reward: "Prism Ring · MYTHIC" },
            { key: "gdPortalRunner", name: "Portal Runner", desc: "Complete all 7 Portal stages", reward: "GD Crown · MYTHIC" },
            { key: "stereoMadnessClear", name: "Stereo Clear", desc: "Finish Stereo Madness", reward: "Stereo Glow Trail · MYTHIC" },
            { key: "waveSkillClear", name: "Frame Perfect", desc: "Clear all 4 Wave Skill stages", reward: "Wave Perfect Aura · MYTHIC" },
            { key: "pulseFactoryClear", name: "Pulse Clear", desc: "Finish Pulse Factory", reward: "Pulse Factory Skin · MYTHIC" },
            { key: "endlessClimber", name: "Endless Climber", desc: "Reach 1000 m in Tower Climb", reward: "Endless Flare Skin · MYTHIC" },
            { key: "endlessVeteran", name: "Endless Veteran", desc: "Reach 3000 m in Tower Climb", reward: "Endless Sky Background · MYTHIC" },
            { key: "endlessMarathon", name: "Endless Marathon", desc: "Reach 5000 m in Tower Climb", reward: "Endless Halo · MYTHIC" }
        ];
        const cols = 2;
        const cardH = 36;
        for (let i = 0; i < list.length; i++) {
            const a = list[i];
            const col = i % cols, row = floor(i / cols);
            const x = 12 + col * 268;
            const yy = 58 + row * cardH;
            fill(achievements[a.key] ? color(0, 255, 140) : color(140));
            textSize(10); text((achievements[a.key] ? "✓ " : "○ ") + a.name, x, yy);
            fill(160); textSize(8);
            text(a.desc.slice(0, 42), x + 10, yy + 12);
            fill(255, 80, 220); textSize(7);
            text(("→ " + a.reward).slice(0, 48), x + 10, yy + 24);
        }
        fill(255, 100, 100); textAlign(CENTER); textSize(15); text("A or ESC = close", sirina / 2, sirina - 25);
        pop(); return;
    }

    if (jumpscare && jumpscareTimer > 0) {
        // Ultra-short scare (~0.5s at 13fps)
        let maxT = 7;
        let t = jumpscareTimer;
        let progress = 1 - (t / maxT);

        // Blinding white → pure black → blood flash
        if (t >= maxT - 1) {
            background(255);
        } else if (t >= maxT - 2) {
            background(0);
        } else if (frameCount % 2 === 0) {
            background(180, 0, 0);
        } else {
            background(5, 0, 0);
            // violent glitch slices
            for (let i = 0; i < 14; i++) {
                fill(255, random() < 0.5 ? 0 : 255, 0, 50 + random(80));
                rect(0, random(sirina), sirina, random(3, 18));
            }
        }

        push();
        let shake = 20 + progress * 25;
        translate(sirina / 2 + random(-shake, shake), sirina / 2 + random(-shake, shake));
        let sc = 1.2 + progress * 2.2 + random(0.1);
        scale(sc);
        if (customJumpscareImg) {
            imageMode(CENTER);
            tint(255, 20, 20);
            image(customJumpscareImg, random(-8, 8), random(-8, 8), 440, 440);
            noTint();
        } else {
            noStroke();
            // distorted skull-like face
            fill(230, 210, 200);
            ellipse(random(-6, 6), -15 + random(-4, 4), 300, 360);
            // black pits
            fill(0);
            ellipse(-60, -60, 100, 85);
            ellipse(60, -60, 100, 85);
            // frantic pupils
            fill(255, 0, 0);
            let pj = random(-10, 10);
            ellipse(-60 + pj, -55 + random(-5, 5), 34, 38);
            ellipse(60 + pj, -55 + random(-5, 5), 34, 38);
            fill(255, 255, 200);
            ellipse(-60 + pj, -55, 8, 10);
            ellipse(60 + pj, -55, 8, 10);
            // scream mouth
            fill(10, 0, 0);
            ellipse(0, 75, 160, 70 + random(20));
            fill(255, 240, 230);
            for (let ti = -5; ti <= 5; ti++) {
                triangle(ti * 13 - 5, 55, ti * 13 + 5, 55, ti * 13 + random(-2, 2), 90 + random(10));
            }
            fill(200, 0, 0);
            for (let d = 0; d < 7; d++) {
                rect(-50 + d * 16, 95, 5, 25 + random(30));
            }
        }
        pop();

        textAlign(CENTER, CENTER);
        if (frameCount % 2 === 0) {
            fill(255, 0, 0); textSize(58);
            text("YOU DIED", sirina / 2 + random(-10, 10), 36 + random(-6, 6));
        } else {
            fill(255); textSize(50);
            text("YOU DIED", sirina / 2 + random(-4, 4), 36);
        }

        jumpscareTimer--;
        if (jumpscareTimer <= 0) jumpscare = false;
        pop(); return;
    }

    if (vUredniku) { izrisUrednika(); pop(); return; }

    // MENU
    if (menu) {
        izrisiOzadje();
        fill(0, 0, 0, 130); rect(0, 0, sirina, sirina);
        // Title + seasonal banner only on main menu (hide in shop / spend / records / builder / replays)
        if (!vPodmenijuShop && !vPodmenijuSpend && !vPodmenijuRecords && !vPodmenijuBuilder && !vPodmenijuReplays && !vPodmenijuAILab && !vPodmenijuLevelBuilder) {
            fill(255); textAlign(CENTER, CENTER); textSize(34); text("SNAKE GAME ULTRA", sirina / 2, 28);
            if (seasonalEvent) {
                fill(seasonalEvent.color[0], seasonalEvent.color[1], seasonalEvent.color[2]);
                textSize(12);
                text(seasonalEvent.name + (seasonalEvent.bonusMult > 1 ? "  •  +" + floor((seasonalEvent.bonusMult - 1) * 100) + "% coins" : "") + (seasonalClaimed ? "  ✓" : "  [E]=claim skin+BG"), sirina / 2, 48);
            }
        }
        updateMenuMusic();

        // Death Replay browser
        if (vPodmenijuReplays) {
            drawReplayBrowser();
            return;
        }
        if (vPodmenijuAILab) { drawAILabMenu(); pop(); return; }
        if (vPodmenijuLevelBuilder) { drawLevelBuilderMenu(); pop(); return; }
        if (vPodmenijuBuilder) {
            drawBuilderMenu();
        } else if (!vPodmenijuRecords && !vPodmenijuShop && !vPodmenijuSpend) {
            textSize(15);
            fill(glavniMeniIzbira === 0 ? "yellow" : "white"); text("▶ START GAME", sirina / 2, 70);
            fill(glavniMeniIzbira === 1 ? "yellow" : "white"); text("🏆 VIEW RECORDS", sirina / 2, 95);
            fill(glavniMeniIzbira === 2 ? "yellow" : "white"); text("🛒 SHOP", sirina / 2, 120);
            fill(glavniMeniIzbira === 3 ? "cyan" : "white"); text("🎨 LEVEL BUILDER", sirina / 2, 145);
            fill(glavniMeniIzbira === 4 ? "orange" : "white"); text("📅 DAILY CHALLENGE", sirina / 2, 170);
            fill(glavniMeniIzbira === 5 ? "lime" : "white"); text("🤖 WATCH AI DAILY", sirina / 2, 195);
            fill(glavniMeniIzbira === 6 ? "gold" : "white"); text("🏆 ACHIEVEMENTS", sirina / 2, 220);
            fill(glavniMeniIzbira === 7 ? "orange" : "white"); text("ℹ HOW TO PLAY", sirina / 2, 245);
            fill(glavniMeniIzbira === 8 ? "gold" : "white"); text("💰 SPEND COINS", sirina / 2, 270);
            if (glavniMeniIzbira === 0) {
                stroke(255, 80); line(40, 280, sirina - 40, 280); noStroke();
                textSize(11); fill(180); text("LEFT / RIGHT = mode  •  klikni način", sirina / 2, 295);
                let selectable = getSelectableModes();
                for (let s = 0; s < selectable.length; s++) {
                    let i = selectable[s];
                    let lay = modeListLayout(s);
                    fill(i === selectedMode ? "yellow" : "white");
                    textSize(i === selectedMode ? 12 : 10);
                    textAlign(CENTER, CENTER);
                    text((i === selectedMode ? "> " : "") + modes[i], lay.xPos, lay.yPos);
                }
                textAlign(CENTER, CENTER);
            } else if (glavniMeniIzbira === 4 || glavniMeniIzbira === 5) {
                textSize(13); fill(200);
                text("Today: " + getTodayString(), sirina / 2, 300);
                text("Target: " + dailyTargetScore + "   Mods: " + (dailyModifiers.join(", ") || "None"), sirina / 2, 325);
                text("Best today: " + dailyBestScore + "   Total dailies: " + dailyCompletions, sirina / 2, 350);
                if (dailyCompletedToday) { fill(0, 255, 100); text("✓ Completed today", sirina / 2, 375); }
                else { fill(255, 200, 50); text("Complete for +80 coins", sirina / 2, 375); }
            }
        } else if (vPodmenijuSpend) {
            drawSpendMenu();
        } else if (vPodmenijuRecords) {
            textSize(22); fill("yellow"); text("🏆 RECORDS", sirina / 2, 48);
            textSize(11); textAlign(LEFT, CENTER);
            const recordGroups = [
                { title: "SNAKE", items: modes.filter(m => !m.startsWith("GD ") && !["GD Portal Level","Stereo Madness","Wave Skill Tester","Pulse Factory","Tower Climb"].includes(m)) },
                { title: "GEOMETRY DASH", items: modes.filter(m => m.startsWith("GD ") || m === "GD Portal Level" || m === "Stereo Madness" || m === "Wave Skill Tester" || m === "Pulse Factory") },
                { title: "ENDLESS", items: ["Tower Climb"] }
            ];
            let gx = [22, 312, 312], gy = [78, 78, 355];
            for (let gi = 0; gi < recordGroups.length; gi++) {
                const g = recordGroups[gi];
                fill("yellow"); textSize(14); text(g.title, gx[gi], gy[gi]);
                let y = gy[gi] + 22;
                for (const m of g.items) {
                    if (y > 535) break;
                    fill("white"); textSize(10); text("• " + m, gx[gi], y);
                    fill("cyan"); text((rekordi[m] || 0) + " pts", gx[gi] + 190, y);
                    y += 22;
                }
            }
            textAlign(CENTER); fill("orange"); textSize(14); text("ESC / klik = back", sirina / 2, sirina - 18);
        } else if (vPodmenijuShop) {
            textSize(22); fill("yellow"); text("🛒 SHOP", sirina / 2, 42);
            fill("gold"); textSize(16); text(`💰 ${kovanci}`, sirina / 2, 68);
            stroke(255, 40); line(40, 82, sirina - 40, 82); noStroke();

            textSize(13);
            fill(shopKategorija === 0 ? "cyan" : "white"); text("🐍 SKINS", 75, 100);
            fill(shopKategorija === 1 ? "cyan" : "white"); text("🖼 BG", 195, 100);
            fill(shopKategorija === 2 ? "cyan" : "white"); text("👑 ACC", 310, 100);
            fill(shopKategorija === 3 ? "magenta" : "white"); text("✦ EXCLUSIVE", 450, 100);
            // scroll hint when list is longer than visible
            let artLen = shopKategorija === 0 ? shopSkins.length :
                         shopKategorija === 1 ? shopBackgrounds.length :
                         shopKategorija === 2 ? shopAccessories.length :
                         getExclusiveItems().length;
            if (artLen > SHOP_VISIBLE) {
                textSize(11); fill(150);
                text("🖱️ scroll / ↑↓  (" + (shopScroll + 1) + "–" + min(artLen, shopScroll + SHOP_VISIBLE) + "/" + artLen + ")", sirina / 2, 112);
            }

            let artikli, isExclusive = false;
            if (shopKategorija === 0) artikli = shopSkins;
            else if (shopKategorija === 1) artikli = shopBackgrounds;
            else if (shopKategorija === 2) artikli = shopAccessories;
            else {
                artikli = getExclusiveItems();
                isExclusive = true;
            }

            if (artikli.length === 0 && isExclusive) {
                textAlign(CENTER); fill(180); textSize(16);
                text("No exclusive items unlocked yet.", sirina / 2, 250);
                text("Complete achievements to unlock them!", sirina / 2, 280);
            } else {
                // Auto-scroll so selection stays visible
                if (shopIzbira < shopScroll) shopScroll = shopIzbira;
                if (shopIzbira >= shopScroll + SHOP_VISIBLE) shopScroll = shopIzbira - SHOP_VISIBLE + 1;
                shopScroll = constrain(shopScroll, 0, max(0, artikli.length - SHOP_VISIBLE));

                textAlign(LEFT, CENTER);
                let end = min(artikli.length, shopScroll + SHOP_VISIBLE);
                for (let i = shopScroll; i < end; i++) {
                    let a = artikli[i];
                    let yPos = 118 + (i - shopScroll) * SHOP_ROW_H;
                    if (i === shopIzbira) { fill("yellow"); textSize(11); text("▶", 28, yPos); }
                    // color swatch + shine for Legendary/Mythic
                    fill(a.color[0], a.color[1], a.color[2]); noStroke(); rect(48, yPos - 6, 11, 11);
                    if (a.rarity === "Legendary" || a.rarity === "Mythic") {
                        let sh = 0.5 + 0.5 * sin(frameCount * 0.18 + i);
                        stroke(a.rarity === "Mythic" ? color(255, 80, 220, 180 * sh) : color(255, 215, 80, 180 * sh));
                        strokeWeight(1.5 + sh);
                        noFill(); rect(47, yPos - 7, 13, 13);
                        noStroke();
                    }
                    // name colored by rarity
                    let nameCol = a.rarity === "Mythic" ? color(255, 60 + 40*sin(frameCount*0.15), 200) :
                                  a.rarity === "Legendary" ? color(255, 200, 60) :
                                  a.rarity === "Epic" ? color(220, 100, 255) :
                                  a.rarity === "Rare" ? color(100, 190, 255) :
                                  a.rarity === "Seasonal" ? color(255, 160, 80) : color(255);
                    fill(nameCol); textSize(11); text(a.name, 68, yPos);
                    let rarCol = a.rarity === "Mythic" ? color(255, 50, 200) : a.rarity === "Legendary" ? color(255, 180, 50) : a.rarity === "Epic" ? color(255, 80, 255) : a.rarity === "Rare" ? color(80, 180, 255) : a.rarity === "Seasonal" ? color(255, 140, 60) : color(160);
                    fill(rarCol); textSize(9); text(a.rarity, 230, yPos);

                    textAlign(RIGHT, CENTER); textSize(11);
                    if (isExclusive) {
                        if (a.type === "perk") {
                            let on = getPerkEquipState(a.equipKey);
                            if (on) { fill("lime"); text("[ON]", sirina - 25, yPos); }
                            else { fill("lightblue"); text("[OFF]", sirina - 25, yPos); }
                        } else {
                            let equipped = false;
                            if (a.type === "skin" && trenutnaKoza === a.name) equipped = true;
                            if (a.type === "bg" && trenutnoOzadje === a.name) equipped = true;
                            if (a.type === "acc" && trenutniDodatek === a.name) equipped = true;
                            if (equipped) { fill("lime"); text("[ON]", sirina - 25, yPos); }
                            else { fill("lightblue"); text("[EQ]", sirina - 25, yPos); }
                        }
                    } else {
                        let kupljeno = shopKategorija === 0 ? kupljeneKoze : (shopKategorija === 1 ? kupljenaOzadja : kupljeniDodatki);
                        let trenutno = shopKategorija === 0 ? trenutnaKoza : (shopKategorija === 1 ? trenutnoOzadje : trenutniDodatek);
                        if (a.name === "Custom Head") {
                            if (equipCustomHead) { fill("lime"); text("[ON]", sirina - 25, yPos); }
                            else if (kupljeno.includes(a.name)) { fill("lightblue"); text("[OFF]", sirina - 25, yPos); }
                            else { fill("gold"); text(`🪙${a.price}`, sirina - 25, yPos); }
                        } else if (a.name === "Custom Tail") {
                            if (equipCustomTail) { fill("lime"); text("[ON]", sirina - 25, yPos); }
                            else if (kupljeno.includes(a.name)) { fill("lightblue"); text("[OFF]", sirina - 25, yPos); }
                            else { fill("gold"); text(`🪙${a.price}`, sirina - 25, yPos); }
                        } else if (a.name === "Custom BG") {
                            if (equipCustomBg) { fill("lime"); text("[ON]", sirina - 25, yPos); }
                            else if (kupljeno.includes(a.name)) { fill("lightblue"); text("[OFF]", sirina - 25, yPos); }
                            else { fill("gold"); text(`🪙${a.price}`, sirina - 25, yPos); }
                        } else {
                            if ((shopKategorija === 0 && isSeasonalSkin(a.name) && !isSeasonalSkinInSeason(a.name)) ||
                                (shopKategorija === 1 && isSeasonalBg(a.name) && !isSeasonalBgInSeason(a.name))) {
                                fill(120, 80, 80); text("[LOCKED]", sirina - 25, yPos);
                            } else if (trenutno === a.name) { fill("lime"); text("[ON]", sirina - 25, yPos); }
                            else if (kupljeno.includes(a.name)) { fill("lightblue"); text("[EQ]", sirina - 25, yPos); }
                            else { fill("gold"); text(`🪙${a.price}`, sirina - 25, yPos); }
                        }
                    }
                    textAlign(LEFT, CENTER);
                }
                // Scroll indicators
                if (shopScroll > 0) {
                    textAlign(CENTER); fill(180); textSize(10); text("▲", sirina / 2, 112);
                }
                if (shopScroll + SHOP_VISIBLE < artikli.length) {
                    textAlign(CENTER); fill(180); textSize(10); text("▼ še " + (artikli.length - shopScroll - SHOP_VISIBLE), sirina / 2, sirina - 48);
                }
            }
            // Show description for selected exclusive perk / item
            if (isExclusive && artikli.length > 0 && shopIzbira < artikli.length) {
                let sel = artikli[shopIzbira];
                let tip = "";
                if (sel.type === "perk" && perkInfo[sel.name]) tip = perkInfo[sel.name];
                else if (sel.type === "skin") tip = "Exclusive skin";
                else if (sel.type === "bg") tip = "Exclusive ozadje";
                else if (sel.type === "acc") tip = "Exclusive dodatek";
                if (tip) {
                    textAlign(CENTER); fill(180, 220, 255); textSize(11);
                    text(sel.name + ": " + tip, sirina / 2, sirina - 36);
                }
            }
            textAlign(CENTER); fill("orange"); textSize(11); text("LEFT/RIGHT = cat  •  UP/DOWN  •  ENTER  •  ESC", sirina / 2, sirina - 16);
        }
        pop(); return;
    }

    // DEATH REPLAY: render the recorded mode directly, before live game-mode updates.
    if (deathReplay) {
        updateDeathReplay();
        const rf = deathReplayFrames[Math.floor(deathReplayIndex)];
        if (replayKind === "gd") drawGDReplayWorld(rf);
        else { izrisiOzadje(); drawReplayWorld(rf); }
        fill(255, 80, 80, 40); noStroke(); rect(0, 0, sirina, 58);
        fill(255, 220, 220); textAlign(CENTER, TOP); textSize(15);
        text("⏮ DEATH REPLAY  "+(deathReplayIndex+1)+"/"+deathReplayFrames.length+"  •  "+deathReplaySpeed+"x  •  5=0.5x  1=1x  2=2x  •  skin: "+((rf && rf.skin) || "Cyan")+"  •  ESC = skip", sirina/2,10);
        pop(); return;
    }

    // TOWER CLIMB
    if (gameMode === "Tower Climb") {
        if (!pavza && !gameOver) updateTowerClimb();
        drawTowerClimb(); updateParticles(); drawParticles();
        if (gameOver) {
            fill(0, 0, 0, 180); rect(0, 0, sirina, sirina);
            fill(255, 70, 70); textAlign(CENTER, CENTER); textSize(40); text("GAME OVER", sirina / 2, sirina / 2 - 45);
            fill(255); textSize(20); text("Height: " + tower.score + " m", sirina / 2, sirina / 2 + 5);
            textSize(15); fill(210); text("SPACE = restart  •  ESC = menu", sirina / 2, sirina / 2 + 55);
        }
        pop(); return;
    }

    // PLATFORMER
    if (gameMode === "Platformer") {
        if (!pavza && !gameOver && !plrWon) updatePlatformer();
        drawPlatformer(); updateParticles(); drawParticles();
        if (gameOver) {
            fill(0, 0, 0, 180); rect(0, 0, sirina, sirina);
            fill(255, 50, 50); textAlign(CENTER, CENTER); textSize(42); text("GAME OVER", sirina / 2, sirina / 2 - 50);
            textSize(24); fill(255); text("Score: " + plrScore, sirina / 2, sirina / 2);
            textSize(16); fill(200); text("SPACE = restart  •  ESC = menu", sirina / 2, sirina / 2 + 80);
        }
        pop(); return;
    }

    // HYBRID GD PHASE
    if (gameMode === "Snake+GD Hybrid" && hybridPhase === "gd") {
        const gdTick = !pavza && !gdWon && !gameOver;
        if (gdTick) updateGeometryDash();
        drawGeometryDash(); updateParticles(); drawParticles();
        // overlay
        fill(0, 255, 200); textAlign(LEFT, TOP); textSize(14);
        text("HYBRID st." + (hybridStage + 1) + "/" + HYBRID_GD_VEHICLES.length + "  " + String(gdVehicle).toUpperCase() + "  •  snake: " + hybridScore, 12, 10);
        if (gdWon) {
            // completed GD segment → back to snake with bonus length
            if (k) k.dolzina += 3 + hybridStage;
            returnFromHybridGD(); // advances stage, sets next target / win
        }
        if (gameOver && !gdWon) {
            if (!deathCause) deathCause = "GD obstacle";
            fill(0, 0, 0, 200); rect(0, 0, sirina, sirina);
            fill(255, 50, 50); textAlign(CENTER, CENTER); textSize(40); text("GAME OVER", sirina / 2, sirina / 2 - 70);
            fill(255, 200, 120); textSize(18); text(deathCause, sirina / 2, sirina / 2 - 30);
            fill(255); textSize(20); text("Snake score: " + hybridScore, sirina / 2, sirina / 2 + 5);
            fill(200); textSize(14); text("SPACE = restart  •  ESC = menu", sirina / 2, sirina / 2 + 50);
        }
        pop(); return;
    }

    // GEOMETRY DASH MODES
    if (isGDGameMode()) {
        const gdTick = !pavza && !gdWon && (!gameOver || (gdAIPilot && aiLabProfile === 3));
        if (gdTick) updateGeometryDash();
        drawGeometryDash(); updateParticles(); drawParticles();
        pop(); return;
    }

    // SNAKE
    if (dailySeedMode && !gameOver && k) updateDailySeedMeta();
    izrisiOzadje();

    if (!pavza && !gameOver && !deathReplay) {
        survivalTimer++;
        if (survivalTimer > 180 * 13) unlockAchievement("immortal", "ghostAura");
    }

    if (winScreen) {
        background(20, 40, 20);
        fill(0, 255, 100); textAlign(CENTER, CENTER); textSize(42);
        text(gameMode === "Boss Rush" ? "BOSS RUSH CLEARED!" : "BOSS DEFEATED!", sirina / 2, sirina / 2 - 50);
        textSize(24); fill(255); text("Score: " + k.dolzina, sirina / 2, sirina / 2 + 10);
        if (gameMode === "Boss Rush") { textSize(17); fill(255, 215, 0); text("5 bosses defeated • +250 coins", sirina / 2, sirina / 2 + 43); }
        textSize(16); fill("orange"); text("SPACE = restart • ESC = menu", sirina / 2, sirina / 2 + 80);
        unlockAchievement("bossSlayer", "bossTrophy");
        pop(); return;
    }

    if (gameOver) {
        if (gameMode === "Multiplayer" && multiplayerWinner) {
            background(8, 15, 35); updateParticles(); drawParticles();
            fill(multiplayerWinner === "PLAYER 1 WINS!" ? 255 : 60, multiplayerWinner === "PLAYER 2 WINS!" ? 220 : 245, 255);
            textAlign(CENTER, CENTER); textSize(38); text(multiplayerWinner, sirina / 2, sirina / 2 - 45);
            fill(255); textSize(18); text("Player 1: ARROWS   •   Player 2: W A S D", sirina / 2, sirina / 2 + 5);
            fill(200); textSize(15); text("SPACE = rematch  •  ESC = menu", sirina / 2, sirina / 2 + 55);
            pop(); return;
        }
        if (dailySeedMode) saveDailySeedResult();
        background(40, 0, 0); updateParticles(); drawParticles();
        fill(255, 40, 40); textAlign(CENTER, CENTER); textSize(42); text("GAME OVER", sirina / 2, sirina / 2 - 90);
        if (deathCause) {
            fill(255, 200, 120); textSize(18);
            text(deathCause, sirina / 2, sirina / 2 - 52);
        }
        textSize(26); fill(255); text("Score: " + (k ? k.dolzina : 0), sirina / 2, sirina / 2 - 18);
        if (isDailyChallenge) {
            textSize(18); fill(255, 200, 50); text("Daily Target: " + dailyTargetScore, sirina / 2, sirina / 2 + 30);
            if (k.dolzina >= dailyTargetScore) { fill(0, 255, 100); text("✓ DAILY COMPLETED!", sirina / 2, sirina / 2 + 55); }
        }
        if (isNewHighScore) { fill(255, 215, 0); textSize(24); text("★ NEW HIGH SCORE! ★", sirina / 2, sirina / 2 + 85); }
        textSize(15); fill(200); text("SPACE = restart  •  ESC = menu", sirina / 2, sirina / 2 + 110);
        if (!revivedThisRun && kovanci >= REVIVE_COST) {
            fill(100, 255, 200); textSize(14);
            text("R = REVIVE 🪙 " + REVIVE_COST + " (1× na run)", sirina / 2, sirina / 2 + 160);
        } else if (revivedThisRun) {
            fill(150); textSize(12); text("Revive že uporabljen", sirina / 2, sirina / 2 + 160);
        }
        pop(); return;
    }

    if (!deathReplay) {
    if (modeHas("shrink")) {
        push(); fill(100, 20, 80); noStroke();
        rect(0, 0, sirina, robZmanjsanja); rect(0, sirina - robZmanjsanja, sirina, robZmanjsanja);
        rect(0, 0, robZmanjsanja, sirina); rect(sirina - robZmanjsanja, 0, robZmanjsanja, sirina); pop();
    }

    stroke(0); strokeWeight(1);
    for (let s of stene) { fill(90); rect(s.x, s.y, velikost, velikost); }
    for (let m of mine) { fill("red"); ellipse(m.x + velikost / 2, m.y + velikost / 2, velikost * 0.8); }

    if (modeHas("chaser") && lovec) {
        fill(frameCount % 6 < 3 ? "red" : "black"); rect(lovec.x, lovec.y, velikost, velikost);
    }

    if ((gameMode === "Boss Fight" || gameMode === "Boss Rush") && boss) {
        const rushBoss = gameMode === "Boss Rush";
        const bossColor = rushBoss && boss.color ? boss.color : [180, 20, 20];
        fill(...bossColor); stroke(...bossColor); strokeWeight(3);
        rect(boss.x, boss.y, boss.size, boss.size, 8);
        fill(255); noStroke();
        ellipse(boss.x + boss.size * 0.3, boss.y + boss.size * 0.35, 12, 12);
        ellipse(boss.x + boss.size * 0.7, boss.y + boss.size * 0.35, 12, 12);
        if (rushBoss && boss.attack === "blink" && boss.blinkTargetX != null) {
            push();
            const pulse = 0.65 + 0.35 * sin(frameCount * 0.8);
            noFill(); stroke(220, 170, 255, 255 * pulse); strokeWeight(3);
            rect(boss.blinkTargetX, boss.blinkTargetY, boss.size, boss.size, 8);
            line(boss.blinkTargetX, boss.blinkTargetY, boss.blinkTargetX + boss.size, boss.blinkTargetY + boss.size);
            line(boss.blinkTargetX + boss.size, boss.blinkTargetY, boss.blinkTargetX, boss.blinkTargetY + boss.size);
            noStroke(); fill(235, 210, 255); textAlign(CENTER, CENTER); textSize(12);
            text("TELEPORT!", boss.blinkTargetX + boss.size / 2, boss.blinkTargetY - 10);
            pop();
        }
        fill(0); ellipse(boss.x + boss.size * 0.3, boss.y + boss.size * 0.35, 5, 5);
        ellipse(boss.x + boss.size * 0.7, boss.y + boss.size * 0.35, 5, 5);
        let barW = 200; let barX = sirina / 2 - barW / 2;
        fill(60); rect(barX, 15, barW, 18, 4);
        fill(255, 40, 40); rect(barX, 15, barW * (boss.hp / boss.maxHp), 18, 4);
        fill(255); textAlign(CENTER, CENTER); textSize(13);
        if (rushBoss) {
            text("BOSS RUSH  " + bossRush.stage + "/" + bossRush.total + "  •  " + boss.name, sirina / 2, 9);
            text("BOSS HP: " + max(0, boss.hp) + "/" + boss.maxHp, sirina / 2, 24);
            if (boss.attack === "blink" && boss.blinkTargetX != null) {
                fill(235, 210, 255); textSize(11); text("Teleport destination marked — move away!", sirina / 2, 43);
            }
            if (bossRush.cleared && !bossRush.finished) {
                fill(255, 230, 100); textSize(22); text("BOSS DEFEATED!", sirina / 2, sirina / 2);
            }
        } else text("BOSS HP: " + boss.hp + "/" + boss.maxHp, sirina / 2, 24);
    }

    if (modeHas("echoShadow")) {
        for (let i = 0; i < echoTrail.length; i++) {
            fill(100, 100, 255, map(i, 0, echoTrail.length, 40, 180));
            noStroke(); rect(echoTrail[i].x, echoTrail[i].y, velikost, velikost);
        }
    }

    for (let f of hrana) {
        if (f.isIllusion) fill(frameCount % 4 < 2 ? f.barva : color(150));
        else if (f.effect === "rainbow") {
            colorMode(HSB, 360, 100, 100); fill(frameCount % 360, 80, 100); colorMode(RGB, 255, 255, 255);
        } else fill(f.barva);
        rect(f.x, f.y, velikost, velikost);
    }
    }

    if (gameMode === "Mirror Snake" && k) {
        // Grid-aligned mirror (no sub-pixel offset): mirror cell = (cols-1 - col)
        let mx = sirina - velikost - k.x;
        let my = k.y;
        // draw mirror head + body
        push();
        noStroke();
        // body
        for (let i = 0; i < k.rep.length; i++) {
            let rx = sirina - velikost - k.rep[i].x;
            let ry = k.rep[i].y;
            fill(180, 100, 255, 160);
            rect(rx, ry, velikost, velikost);
        }
        fill(220, 150, 255);
        rect(mx, my, velikost, velikost);
        // eyes
        fill(0); rect(mx + 4, my + 6, 4, 4); rect(mx + velikost - 10, my + 6, 4, 4);
        pop();
    }

    // HUD
    push(); noStroke();
    fill(equipCustomBg || trenutnoOzadje === "Matrix" || trenutnoOzadje === "Deep Space" || trenutnoOzadje === "Void" || trenutnoOzadje === "Neon Grid" || trenutnoOzadje === "Aurora Pulse" || trenutnoOzadje === "Starfield" || trenutnoOzadje === "Plasma" ? "white" : "black");
    textSize(18); textAlign(LEFT, TOP);
    text("Score: " + k.dolzina, 30, 20);
    text("🪙 Coins: " + kovanci, 30, 45);
    if (gameMode === "Snake+GD Hybrid" && hybridPhase === "snake") {
        fill(0, 255, 200); textSize(13);
        text("HYBRID → GD " + (HYBRID_GD_VEHICLES[Math.min(hybridStage, HYBRID_GD_VEHICLES.length - 1)] || "?").toUpperCase() + " at len " + hybridSnakeTarget + "  (stage " + (hybridStage + 1) + ")", 30, 95);
        textSize(18);
    }
    if (isDailyChallenge) {
        fill(255, 200, 50); text("📅 Daily Target: " + dailyTargetScore, 30, 70);
        if (watchingAI) { fill(0, 255, 180); text("🤖 AI PLAYING", 30, 95); }
    }
    if (gameMode === "Time Warp") {
        fill(timeWarpZaloga > 100 ? color(0, 200, 0) : timeWarpZaloga > 50 ? color(255, 180, 0) : color(255, 50, 50));
        text("⏱ Time: " + timeWarpZaloga, 30, 70);
    }
    if (trenutnaKoza === "Reality Glitch") {
        fill(0, 255, 180); textAlign(LEFT, TOP); textSize(13); text("⚡ GLITCH", 30, 95);
    }
    if (isCustomMode) {
        let flagsOn = [];
        for (let o of builderOptions) if (builderFlags[o.key]) flagsOn.push(o.label);
        fill(100, 255, 200); textAlign(LEFT, TOP); textSize(10);
        let mods = flagsOn.length ? flagsOn : ["Vanilla"];
        let line1 = "Custom: ", line2 = "";
        for (let label of mods) {
            let candidate = line1 === "Custom: " ? label : line1 + ", " + label;
            if (textWidth(candidate) <= 250) line1 = candidate;
            else if (line2 === "") line2 = label;
            else if (textWidth(line2 + ", " + label) <= 250) line2 += ", " + label;
        }
        text(line1, 30, 70);
        if (line2) text(line2, 30, 84);
    }
    if (!deathReplay && modeHas("foodEffects") && activeEffects.length > 0) {
        textAlign(RIGHT, TOP); textSize(12);
        let yO = 18;
        for (let eff of activeEffects) {
            fill("yellow");
            text(`${eff.name} (${eff.timer})`, sirina - 20, yO);
            let desc = effectInfo[eff.name];
            if (desc) { fill(200, 200, 120); textSize(10); text(desc, sirina - 20, yO + 13); textSize(12); yO += 28; }
            else yO += 16;
        }
    }
    pop();

    if (!deathReplay) {
        updateEffects(); updateParticles(); drawParticles();
    }

    if (!deathReplay && unlockedRewards.goldTrail && !pavza && frameCount % 3 === 0) {
        let tc = color(255, 215, 0);
        spawnParticles(k.x + velikost / 2, k.y + velikost / 2, 1, tc);
    }
    if (!deathReplay && equipNeonTrail && unlockedRewards.neonTrail && !pavza && frameCount % 2 === 0) {
        let tc = color(0, 255, 220);
        spawnParticles(k.x + velikost / 2, k.y + velikost / 2, 1, tc);
    }
    if (!deathReplay && equipSparkleAura && unlockedRewards.sparkleAura && !pavza && frameCount % 4 === 0) {
        spawnParticles(k.x + velikost / 2 + random(-8, 8), k.y + velikost / 2 + random(-8, 8), 1, color(255, 255, 180));
    }


    if (!pavza && !gameOver && !deathReplay) {
        // classic grid tick (frameRate handles speed)
        if (gameMode === "Time Warp") {
            timeWarpZaloga--;
            if (timeWarpZaloga <= 0) { deathCause = "Time ran out"; k.smrt = true; }
            if (timeWarpZaloga < 50) frameRate(18);
            else if (timeWarpZaloga < 100) frameRate(14);
            else frameRate(13);
        }
        if (gameMode === "Speed Increase" || (isDailyChallenge && dailyModifiers.includes("Fast"))) {
            frameRate(13 + min(k.dolzina, 12));
        }
        if (hasEffect("SLOW")) frameRate(5);
        else if (hasEffect("DASH")) frameRate(30);
        else if (hasEffect("RAINBOW")) frameRate(15);
        if (gameMode === "AI Mode" || watchingAI) frameRate(15);

        doSnakeLogicStep();
    }

    if (ghostRaceEnabled) drawGhost();

    // Reality Glitch chromatic aberration overlay
    if (trenutnaKoza === "Reality Glitch" && unlockedRewards.realityGlitch && k && !gameOver) {
        push();
        blendMode(ADD);
        let ox = sin(frameCount * 0.3) * 2;
        let oy = cos(frameCount * 0.27) * 2;
        // red/cyan ghost copies of head
        let hx = k.x, hy = k.y;
        fill(255, 0, 80, 50); rect(hx + ox, hy + oy, velikost, velikost);
        fill(0, 255, 200, 50); rect(hx - ox, hy - oy, velikost, velikost);
        blendMode(BLEND);
        pop();
    }

    k.prikazi();
    if (gameMode === "Multiplayer" && player2) {
        noStroke();
        fill(40, 220, 255);
        for (const seg of player2.rep) rect(seg.x, seg.y, velikost, velikost, 4);
        fill(60, 245, 255); rect(player2.x, player2.y, velikost, velikost, 5);
        fill(5, 35, 55); ellipse(player2.x + 6, player2.y + 6, 4, 4); ellipse(player2.x + 14, player2.y + 6, 4, 4);
        fill(255); textAlign(LEFT, TOP); textSize(12); text("P1: ARROWS  |  P2: W A S D", 10, 38);
        textAlign(CENTER, CENTER);
    }

    // Tutorial practice overlay + completion
    if (tutorialPractice) {
        fill(0, 0, 0, 120); noStroke(); rect(0, 0, sirina, 70);
        fill(0, 255, 200); textAlign(CENTER, CENTER); textSize(16);
        if (!tutorialPracticeDone) {
            text("PRAKSA  •  Jej hrano!  Cilj: dolžina 3+", sirina / 2, 22);
            fill(255); textSize(13);
            let len = k ? k.dolzina : 0;
            text("Trenutna dolžina: " + len + " / 3   •   ESC = preskoči", sirina / 2, 48);
        } else {
            text("ODLIČNO!  AI igra naprej v ozadju", sirina / 2, 22);
            fill(255); textSize(13);
            text("ENTER / klik = končaj tutorial  •  ESC = meni", sirina / 2, 48);
        }
        // After 3 food: hand over to AI, keep playing in background
        if (k && k.dolzina >= 3 && !tutorialPracticeDone) {
            tutorialPracticeDone = true;
            tutorialPracticeAI = true;
            gameOver = false;
            if (k.xspeed === 0 && k.yspeed === 0) { k.xspeed = 1; k.yspeed = 0; }
            // prevent death from ending tutorial — AI demo
        }
        if (gameOver && tutorialPracticeDone) {
            // AI died in background — soft reset and keep AI going for show
            gameOver = false;
            k.smrt = false;
            k.x = floor(sirina / 2 / velikost) * velikost;
            k.y = floor(sirina / 2 / velikost) * velikost;
            k.rep = [];
            k.dolzina = max(3, k.dolzina);
            k.xspeed = 1; k.yspeed = 0;
            k.ghost = true; addEffect("GHOST", 20);
            lokacijaHrane();
        }
        if (gameOver && !tutorialPracticeDone) {
            fill(255, 200, 100); textSize(14);
            text("SPACE = poskusi znova  •  ESC = končaj tutorial", sirina / 2, sirina - 40);
        }
    }
    pop();
}



function doSnakeLogicStep() {
    if (!k || k.smrt || gameOver) return;

        if ((gameMode === "AI Mode" || watchingAI || modeHas("ai") || tutorialPracticeAI) && hrana.length > 0) {
            let nPr = k.najdiPotDoHrane(hrana[0]);
            k.xspeed = nPr.x; k.yspeed = nPr.y;
        }

        if (modeHas("chaser") && lovec) {
            lovecSpeedTimer++;
            let h = max(2, 6 - floor(k.dolzina / 3));
            if (lovecSpeedTimer % h === 0) {
                if (random() < 0.5) lovec.x += lovec.x < k.x ? velikost : -velikost;
                else lovec.y += lovec.y < k.y ? velikost : -velikost;
            }
            if (k.x === lovec.x && k.y === lovec.y) k.sproziUdarac("Chaser caught you");
        }

        if (gameMode === "Chaos") {
            chaosTimer++;
            if (chaosTimer % 5 === 0) randomDirection();
            if (chaosTimer % 30 === 0) premakniHrano();
        }

        if (modeHas("portal") && frameCount % 40 === 0) teleportSnake();

        if (modeHas("homingFood") && frameCount % 8 === 0) {
            for (let f of hrana) {
                if (f.x < k.x) f.x += velikost; else if (f.x > k.x) f.x -= velikost;
                if (f.y < k.y) f.y += velikost; else if (f.y > k.y) f.y -= velikost;
            }
        }

        if (gameMode === "Gravity" && frameCount % 3 === 0) k.yspeed = 1;

        if (gameMode === "Boss Rush" && boss) {
            updateBossRush();
            if (!bossRush.cleared && k.x < boss.x + boss.size && k.x + velikost > boss.x && k.y < boss.y + boss.size && k.y + velikost > boss.y) k.sproziUdarac("Boss hit");
        } else if (gameMode === "Boss Fight" && boss) {
            boss.speedTimer++;
            let bs = max(3, 7 - floor(k.dolzina / 4));
            if (boss.speedTimer % bs === 0) {
                if (random() < 0.55) boss.x += boss.x < k.x ? velikost : -velikost;
                else boss.y += boss.y < k.y ? velikost : -velikost;
                boss.x = constrain(boss.x, 0, sirina - boss.size);
                boss.y = constrain(boss.y, 0, sirina - boss.size);
            }
            if (frameCount % 90 === 0) mine.push(createVector(floor(random(floor(sirina / velikost))) * velikost, floor(random(floor(sirina / velikost))) * velikost));
            if (k.x < boss.x + boss.size && k.x + velikost > boss.x && k.y < boss.y + boss.size && k.y + velikost > boss.y) k.sproziUdarac("Boss hit");
        }

        if (modeHas("echoShadow")) {
            // Echo Shadow is a delayed copy of the path.  Store the position before
            // movement, then after movement test the new head against the delayed
            // part of that path. This makes touching the visible old trail lethal.
            if (k.xspeed !== 0 || k.yspeed !== 0) {
                echoTrail.push(createVector(k.x, k.y));
                const maxTrail = echoDelay + 60;
                while (echoTrail.length > maxTrail) echoTrail.shift();
            }
        }

        if (!watchingAI && gameMode !== "AI Mode" && !modeHas("ai") && !tutorialPracticeAI) {
            if (nextDirX !== 0 || nextDirY !== 0) { k.smer(nextDirX, nextDirY); nextDirX = 0; nextDirY = 0; }
        }

        let nujno = !hasEffect("DRIFT") || keyIsPressed;
        // Don't move / collide while waiting for first input (prevents death on spawn)
        let hasSpeed = (k.xspeed !== 0 || k.yspeed !== 0);
        if (!hasEffect("FREEZE") && nujno && hasSpeed) {
            let sx = k.x, sy = k.y;
            k.premik();
            if (modeHas("mines")) {
                if (k.odvrziMinu) { mine.push(createVector(sx, sy)); k.odvrziMinu = false; }
            }
        }

        if (modeHas("mines") || gameMode === "Boss Fight" || gameMode === "Boss Rush") {
            for (let m of mine) if (k.x === m.x && k.y === m.y) k.sproziUdarac("Mine exploded");
        }
        if (gameMode === "Multiplayer") {
            updateMultiplayerStep();
            if (gameOver) return;
        }

        for (let i = hrana.length - 1; i >= 0; i--) {
            if (k.pojej(hrana[i])) {
                if (hrana[i].isIllusion) k.dolzina = max(0, k.dolzina - 4);
                else {
                    totalFoodEaten++;
                    let coinGain = 1;
                    if (boostLuckyRun) coinGain = 2;
                    if (seasonalEvent) coinGain = ceil(coinGain * seasonalEvent.bonusMult);
                    let everyN = max(3, 10 - upgradeCoins);
                    if (upgradeCoins > 0 && totalFoodEaten % everyN === 0) coinGain += 1;
                    kovanci += coinGain; localStorage.setItem("snakeCoins", kovanci);
                    playEatSound();
                    spawnParticles(hrana[i].x + velikost / 2, hrana[i].y + velikost / 2, 12, color(255, 220, 50));
                    if (kovanci >= 300) unlockAchievement("coinHoarder", "goldTrail");

                    if (modeHas("foodEffects")) uporabiEffect(hrana[i].effect);
                    if (modeHas("mines")) k.odvrziMinu = true;
                    if (gameMode === "Time Warp") timeWarpZaloga = min(200, timeWarpZaloga + 60);
                    if (modeHas("shrink")) {
                        robZmanjsanja = min(sirina / 2 - velikost * 2, robZmanjsanja + 8);
                    }
                    if (gameMode === "Two-Headed Snake" && k.dolzina > 1) k.obrniSmerGlave();
                    if (gameMode === "Boss Rush" && boss) {
                        damageBossRush();
                    } else if (gameMode === "Boss Fight" && boss) {
                        boss.hp -= 1;
                        if (boss.hp <= 0) {
                            winScreen = true; kovanci += 50; localStorage.setItem("snakeCoins", kovanci);
                            if (k.dolzina > rekordi[gameMode]) {
                                rekordi[gameMode] = k.dolzina;
                                localStorage.setItem("snakeHighScore_" + gameMode, k.dolzina);
                            }
                            unlockAchievement("bossSlayer", "bossTrophy");
                        }
                    }

                    if (k.dolzina >= 10) unlockAchievement("beginner", "neonTrail");
                    if (k.dolzina >= 80) unlockAchievement("highRoller", "goldenCrownPlus");
                    if (k.dolzina >= 100) unlockAchievement("glitchLord", "realityGlitch");
                    if (gameMode === "Speed Increase" && k.dolzina >= 35) unlockAchievement("speedDemon", "voidWalker");

        
                    if (isDailyChallenge && k.dolzina >= dailyTargetScore && !dailyCompletedToday) {
                        dailyCompletedToday = true;
                        dailyCompletions++;
                        localStorage.setItem("dailyDone_" + getTodayString(), "true");
                        localStorage.setItem("dailyCompletions", dailyCompletions);
                        kovanci += 80; localStorage.setItem("snakeCoins", kovanci);
                        playWinSound();
                        if (dailyCompletions >= 1) unlockAchievement("dailyStarter", "auroraPulse");
                        if (dailyCompletions >= 5) unlockAchievement("dailyWarrior", "solarFlare");
                        if (dailyCompletions >= 15) unlockAchievement("dailyLegend", "phoenixWings");
                    }
                }
                if (modeHas("multiFood")) {
                    hrana.splice(i, 1); if (hrana.length < 3) dodajEnoHrano();
                } else {
                    hrana.splice(i, 1); lokacijaHrane();
                }
                break;
            }
        }


        // Mirror Snake: mirrored head can also collect food (same Y, mirrored X)
        if (gameMode === "Mirror Snake" && k && !k.smrt) {
            let mx = sirina - velikost - k.x;
            let my = k.y;
            for (let i = hrana.length - 1; i >= 0; i--) {
                if (hrana[i].x === mx && hrana[i].y === my) {
                    if (hrana[i].isIllusion) k.dolzina = max(0, k.dolzina - 4);
                    else {
                        k.dolzina++;
                        totalFoodEaten++;
                        let coinGain = 1;
                        if (boostLuckyRun) coinGain = 2;
                        if (seasonalEvent) coinGain = ceil(coinGain * seasonalEvent.bonusMult);
                        kovanci += coinGain; localStorage.setItem("snakeCoins", kovanci);
                        playEatSound();
                        spawnParticles(hrana[i].x + velikost / 2, hrana[i].y + velikost / 2, 12, color(200, 150, 255));
                        if (modeHas("foodEffects") && hrana[i].effect) uporabiEffect(hrana[i].effect);
                    }
                    if (modeHas("multiFood")) {
                        hrana.splice(i, 1); if (hrana.length < 3) dodajEnoHrano();
                    } else {
                        hrana.splice(i, 1); lokacijaHrane();
                    }
                    break;
                }
            }
            // mirror hitting walls / edges handled by real snake konec (shared)
        }

        if (modeHas("walls") && !k.ghost) {
            for (let s of stene) if (k.x === s.x && k.y === s.y) k.sproziUdarac("Hit wall");
        }

        if (k.xspeed !== 0 || k.yspeed !== 0) k.konec();

        if (modeHas("echoShadow") && !k.smrt && (k.xspeed !== 0 || k.yspeed !== 0) && echoTrail.length > echoDelay) {
            // Ignore the newest echoDelay positions; those are still "inside" the
            // live snake's recent path. Everything older is the dangerous shadow.
            const shadowStart = max(0, echoTrail.length - echoDelay - 1);
            for (let i = 0; i <= shadowStart; i++) {
                if (k.x === echoTrail[i].x && k.y === echoTrail[i].y) {
                    k.sproziUdarac("Echo shadow");
                    break;
                }
            }
        }

        // Hybrid: switch to GD after reaching length 8 (once per run segment)
        if (gameMode === "Snake+GD Hybrid" && hybridPhase === "snake" && !hybridPortalTriggered && k.dolzina >= hybridSnakeTarget) {
            startHybridGDPhase();
        }

        // record frames for replay + ghost
        recordReplayFrame();
        recordGhostFrame();
        if (ghostRaceEnabled) ghostFrame++;

        if (k.smrt) {
            totalDeaths++; localStorage.setItem("totalDeaths", totalDeaths);
            if (totalDeaths >= 15) unlockAchievement("firstSteps", "specialDeath");
            if (k.dolzina > rekordi[gameMode]) {
                rekordi[gameMode] = k.dolzina;
                localStorage.setItem("snakeHighScore_" + gameMode, k.dolzina);
                isNewHighScore = true;
            }
            if (isDailyChallenge) {
                let today = getTodayString();
                if (k.dolzina > dailyBestScore) {
                    dailyBestScore = k.dolzina;
                    localStorage.setItem("dailyBest_" + today, dailyBestScore);
                }
            }
            saveGhostIfBetter();
            saveCurrentDeathReplay();
            playDeathSound(); screenShake = 18;
            let col = unlockedRewards.specialDeath ? color(255, 0, 255) : color(255, 50, 50);
            spawnParticles(k.x + velikost / 2, k.y + velikost / 2, 30, col);
            if (random() < jumpscareChance) { jumpscare = true; jumpscareTimer = 7; playJumpscareSound(); screenShake = 28; }
            gameOver = true;
        }
    

}


function mouseWheel(event) {
    // Level builder: scroll tools or level columns
    if (menu && vPodmenijuLevelBuilder) {
        const tools = typeof builderCurrentTools === "function" ? builderCurrentTools() : [];
        const perRow = 8;
        const maxTS = max(0, Math.ceil(tools.length / perRow) - 3);
        // Over tool area → tool palette scroll; else level column scroll
        if (mouseY > 400) {
            if (event.delta > 0) levelBuilder.toolScroll = min(maxTS, (levelBuilder.toolScroll || 0) + 1);
            else levelBuilder.toolScroll = max(0, (levelBuilder.toolScroll || 0) - 1);
        } else {
            const maxScroll = max(0, levelBuilder.cols - lbVisibleCols());
            if (event.delta > 0) levelBuilder.scrollC = min(maxScroll, (levelBuilder.scrollC || 0) + 3);
            else levelBuilder.scrollC = max(0, (levelBuilder.scrollC || 0) - 3);
        }
        return false;
    }
    if (!menu || !vPodmenijuShop) return true;
    let artikli = shopKategorija === 0 ? shopSkins :
                  shopKategorija === 1 ? shopBackgrounds :
                  shopKategorija === 2 ? shopAccessories :
                  getExclusiveItems();
    let maxScroll = max(0, artikli.length - SHOP_VISIBLE);
    // event.delta > 0 = scroll down
    if (event.delta > 0) shopScroll = min(maxScroll, shopScroll + 1);
    else shopScroll = max(0, shopScroll - 1);
    shopIzbira = constrain(shopIzbira, shopScroll, min(artikli.length - 1, shopScroll + SHOP_VISIBLE - 1));
    return false; // prevent page scroll
}

function mousePressed() {
    unlockAudioFromGesture();
    if (introActive) {
        introActive = false;
        introTimer = INTRO_DURATION;
        tryStartMusic();
        return;
    }
    if (tutorialPractice && tutorialPracticeDone) {
        tutorialPractice = false;
        tutorialPracticeDone = false;
        tutorialPracticeAI = false;
        tutorialActive = false;
        localStorage.setItem("tutorialDone", "true");
        menu = true;
        gameOver = false;
        stopAmbient();
        playMenuSound();
        return;
    }
    if (tutorialActive && !tutorialPractice) {
        const TUTORIAL_STEPS = 6;
        if (tutorialStep >= TUTORIAL_STEPS - 1) {
            // start practice run
            tutorialPractice = true;
            tutorialPracticeDone = false;
            tutorialActive = false; // hide text overlay
            menu = false;
            gameMode = "Classic";
            watchingAI = false;
            isDailyChallenge = false;
            stopAmbient();
            resetGame();
            tryStartMusic();
            playMenuSound();
            return;
        }
        tutorialStep++;
        playMenuSound();
        return;
    }
    if (showSettings) {
        if (mouseY > 100 && mouseY < 130 && mouseX > 150 && mouseX < 450) {
            jumpscareChance = constrain(map(mouseX, 150, 450, 0, 1), 0, 1);
            localStorage.setItem("jumpscareChance", jumpscareChance);
        }
        // sound toggle button
        if (mouseX > sirina / 2 - 120 && mouseX < sirina / 2 + 120 && mouseY > 145 && mouseY < 181) {
            soundEnabled = !soundEnabled;
            localStorage.setItem("soundEnabled", soundEnabled);
            if (soundEnabled) tryStartMusic();
            else stopAmbient();
            playMenuSound();
        }
        // volume slider
        if (mouseY > 220 && mouseY < 250 && mouseX > 150 && mouseX < 450) {
            masterVolume = constrain(map(mouseX, 150, 450, 0, 1), 0, 1);
            localStorage.setItem("masterVolume", masterVolume);
            if (soundEnabled && ambientActive) {
                stopAmbient();
                startAmbientForBg(trenutnoOzadje);
            }
        }
        if (mouseX > sirina / 2 - 120 && mouseX < sirina / 2 + 120 && mouseY > 270 && mouseY < 312) fileInput.elt.click();
        if (mouseX > sirina / 2 - 120 && mouseX < sirina / 2 + 120 && mouseY > 330 && mouseY < 372) bgFileInput.elt.click();
        // Practice mode toggle
        if (mouseX > sirina / 2 - 120 && mouseX < sirina / 2 + 120 && mouseY > 385 && mouseY < 421) {
            practiceMode = !practiceMode;
            try { localStorage.setItem("practiceMode", practiceMode ? "1" : "0"); } catch (e) {}
            playMenuSound();
        }
        // Multi-activate orbs
        if (mouseX > sirina / 2 - 120 && mouseX < sirina / 2 + 120 && mouseY > 442 && mouseY < 476) {
            multiActivateOrbs = !multiActivateOrbs;
            try { localStorage.setItem("multiActivateOrbs", multiActivateOrbs ? "1" : "0"); } catch (e) {}
            playMenuSound();
        }
        if (mouseX > sirina / 2 - 120 && mouseX < sirina / 2 + 120 && mouseY > 500 && mouseY < 534) {
            tutorialActive = true; tutorialStep = 0; tutorialPractice = false; tutorialPracticeDone = false; tutorialPracticeAI = false; showSettings = false;
            localStorage.removeItem("tutorialDone");
            playMenuSound();
        }
        if (mouseX > sirina / 2 - 80 && mouseX < sirina / 2 + 80 && mouseY > 545 && mouseY < 585) showSettings = false;
        return;
    }

    if (showAchievements) {
        showAchievements = false;
        return;
    }

    if (vUredniku) {
        paintPixel();
        for (let t = 0; t < 3; t++) {
            if (mouseX >= 120 + t * 120 && mouseX <= 220 + t * 120 && mouseY >= 70 && mouseY <= 98) urednikTip = ["head", "tail", "bg"][t];
        }
        for (let c = 1; c <= 8; c++) {
            let px = 80 + (c - 1) * 55;
            if (mouseX >= px && mouseX <= px + 45 && mouseY >= 490 && mouseY <= 522) izbranaBarva = c;
        }
        if (mouseX >= sirina / 2 - 200 && mouseX <= sirina / 2 - 90 && mouseY >= 540 && mouseY <= 578) {
            localStorage.setItem("customHeadGrid", JSON.stringify(customHeadGrid));
            localStorage.setItem("customTailGrid", JSON.stringify(customTailGrid));
            localStorage.setItem("customBgGrid", JSON.stringify(customBgGrid));
        }
        if (mouseX >= sirina / 2 - 55 && mouseX <= sirina / 2 + 55 && mouseY >= 540 && mouseY <= 578) {
            let size = urednikTip === "bg" ? bgGridVelikost : gridVelikost;
            let grid = urednikTip === "head" ? customHeadGrid : urednikTip === "tail" ? customTailGrid : customBgGrid;
            for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) grid[i][j] = 0;
        }
        if (mouseX >= sirina / 2 + 90 && mouseX <= sirina / 2 + 200 && mouseY >= 540 && mouseY <= 578) {
            localStorage.setItem("customHeadGrid", JSON.stringify(customHeadGrid));
            localStorage.setItem("customTailGrid", JSON.stringify(customTailGrid));
            localStorage.setItem("customBgGrid", JSON.stringify(customBgGrid));
            vUredniku = false; menu = true;
        }
        return;
    }

    // ===== ACTIVE GD MOUSE INPUT =====
    if (!menu && !gameOver && !winScreen && !gdWon &&
        (gdVehicle === "swing" || gdVehicle === "ball" || gdVehicle === "spider") &&
        (gameMode === "Geometry Dash" || gameMode === "GD Swing" || gameMode === "GD Ball" || gameMode === "GD Portal Level" || gameMode === "Stereo Madness" || gameMode === "Wave Skill Tester" || gameMode === "Pulse Factory" || gameMode === "Grok Showcase" || gameMode === "GD Builder Test" || gameMode.startsWith("GD "))) {
        if (gdVehicle === "swing" || gdVehicle === "spider") gdSwingInputQueued = true;
        else gdBallInputQueued = true;
        gdStarted = true;
        return false;
    }

    // ===== MOUSE MENU SUPPORT =====
    if (menu) {
        if (vPodmenijuAILab) {
            if(mouseY>95&&mouseY<295&&mouseX<250){aiLabProfile=constrain(floor((mouseY-95)/48),0,3);return;}
            if(mouseY>95&&mouseY<300&&mouseX>275){let col=mouseX>390?1:0;let row=constrain(floor((mouseY-95)/48),0,3);aiLabVehicle=constrain(row*2+col,0,9);return;}
            if(mouseY>345&&mouseY<410){vPodmenijuAILab=false;menu=false;watchingAI=true;gameMode=aiLabVehicleMode();resetGame();gdAIPilot=true;return;}
            return;
        }
        if (vPodmenijuLevelBuilder) {
            // --- Level list browser (before editor) ---
            if (!levelBuilder.inEditor) {
                const nb = levelBuilder._browserNew;
                if (nb && mouseX >= nb.x && mouseX < nb.x + nb.w && mouseY >= nb.y && mouseY < nb.y + nb.h) {
                    builderOpenNewLevel(); return;
                }
                if (levelBuilder._browserRows) {
                    for (const row of levelBuilder._browserRows) {
                        if (mouseX >= row.x && mouseX < row.x + row.w && mouseY >= row.y && mouseY < row.y + row.h) {
                            levelBuilder.browserSel = row.idx;
                            builderOpenLevel(row.idx);
                            return;
                        }
                    }
                }
                const bp = levelBuilder._browserPrev, bnxt = levelBuilder._browserNext;
                if (bp && mouseX >= bp.x && mouseX < bp.x + bp.w && mouseY >= bp.y && mouseY < bp.y + bp.h) {
                    levelBuilder.savedPage = Math.max(0, (levelBuilder.savedPage || 0) - 1); playMenuSound(); return;
                }
                if (bnxt && mouseX >= bnxt.x && mouseX < bnxt.x + bnxt.w && mouseY >= bnxt.y && mouseY < bnxt.y + bnxt.h) {
                    const maxVis = 11;
                    const pages = Math.max(1, Math.ceil((levelBuilder.saved || []).length / maxVis));
                    levelBuilder.savedPage = Math.min(pages - 1, (levelBuilder.savedPage || 0) + 1); playMenuSound(); return;
                }
                return;
            }
            // --- Deco pixel editor ---
            if (levelBuilder.decoEditor) {
                const hit = (b) => b && mouseX >= b.x && mouseX < b.x + b.w && mouseY >= b.y && mouseY < b.y + b.h;
                if (hit(levelBuilder._decoCloseBtn)) {
                    levelBuilder.decoEditor = false;
                    const tools = builderCurrentTools();
                    const di = tools.indexOf("deco");
                    if (di >= 0) levelBuilder.tool = di;
                    levelBuilder.msg = "DECO tool on — click grid to place sprite";
                    return;
                }
                if (hit(levelBuilder._decoSaveBtn)) { lbDecoSaveDraftToLibrary(); return; }
                if (hit(levelBuilder._decoClearBtn)) {
                    levelBuilder.decoDraft = lbDecoEmptyGrid();
                    levelBuilder.msg = "Draft cleared";
                    return;
                }
                if (levelBuilder._decoColorBtns) {
                    for (const b of levelBuilder._decoColorBtns) {
                        if (hit(b)) { levelBuilder.decoPaintColor = b.colorIdx; return; }
                    }
                }
                if (levelBuilder._decoLibBtns) {
                    for (const b of levelBuilder._decoLibBtns) {
                        if (hit(b)) {
                            levelBuilder.decoLibIdx = b.idx;
                            const item = levelBuilder.decoLibrary[b.idx];
                            if (item && item.grid) levelBuilder.decoDraft = JSON.parse(JSON.stringify(item.grid));
                            levelBuilder.msg = "Selected deco #" + (b.idx + 1);
                            return;
                        }
                    }
                }
                // paint on pixel grid
                const pix = levelBuilder._decoPix;
                if (pix && mouseX >= pix.x && mouseX < pix.x + pix.w && mouseY >= pix.y && mouseY < pix.y + pix.h) {
                    const draft = lbDecoEnsureDraft();
                    const i = floor((mouseX - pix.x) / pix.ps);
                    const j = floor((mouseY - pix.y) / pix.ps);
                    if (i >= 0 && i < pix.gs && j >= 0 && j < pix.gs) {
                        if (mouseButton === RIGHT) draft[i][j] = 0;
                        else draft[i][j] = levelBuilder.decoPaintColor || 1;
                    }
                    return;
                }
                return;
            }
            // MUSIC / FROM / DECO status buttons
            {
                const hit = (b) => b && mouseX >= b.x && mouseX < b.x + b.w && mouseY >= b.y && mouseY < b.y + b.h;
                if (hit(levelBuilder._musicBtn)) { if (typeof lbPromptMusicUrl === "function") lbPromptMusicUrl(); return; }
                if (hit(levelBuilder._fromBtn)) {
                    let col = levelBuilder.scrollC || 0;
                    if (levelBuilder.selectedCell) {
                        const p = String(levelBuilder.selectedCell).split(",").map(Number);
                        if (p.length === 2 && !isNaN(p[1])) col = p[1];
                    }
                    startBuilderTest(col); return;
                }
                // PLACE/EDIT handled via _decoBarBtns below
            }
            // Compact deco toolbar clicks (when deco tool active)
            if (levelBuilder._decoBarBtns) {
                const hit = (b) => b && mouseX >= b.x && mouseX < b.x + b.w && mouseY >= b.y && mouseY < b.y + b.h;
                for (const b of levelBuilder._decoBarBtns) {
                    if (!hit(b)) continue;
                    if (b.kind === "placeTool") {
                        const tools = builderCurrentTools();
                        const di = tools.indexOf("deco");
                        if (di >= 0) levelBuilder.tool = di;
                        levelBuilder.decoEditor = false;
                        levelBuilder.selectMode = false;
                        levelBuilder.msg = "PLACE mode — click grid to stamp deco";
                        return;
                    }
                    if (b.kind === "lib") {
                        levelBuilder.decoLibIdx = b.idx;
                        const item = levelBuilder.decoLibrary && levelBuilder.decoLibrary[b.idx];
                        if (item && item.grid) levelBuilder.decoDraft = JSON.parse(JSON.stringify(item.grid));
                        const tools = builderCurrentTools();
                        const di = tools.indexOf("deco");
                        if (di >= 0) levelBuilder.tool = di;
                        levelBuilder.decoEditor = false;
                        levelBuilder.msg = "Selected: " + ((item && item.name) || ("#" + (b.idx + 1)));
                        return;
                    }
                    if (b.kind === "panel") {
                        if (typeof lbDecoSeedLibrary === "function") lbDecoSeedLibrary();
                        lbDecoEnsureDraft();
                        levelBuilder.decoEditor = true;
                        levelBuilder.msg = "Pixel editor — paint, SAVE, CLOSE";
                        return;
                    }
                }
            }
            if (mouseY >= 24 && mouseY <= 48) {
                // Mode toggle Classic / Platformer
                if (mouseX >= 8 && mouseX < 78) {
                    levelBuilder.mode = "classic";
                    levelBuilder.msg = "Mode: CLASSIC (auto-scroll GD)";
                    playMenuSound(); return;
                }
                if (mouseX >= 82 && mouseX < 160) {
                    levelBuilder.mode = "platformer";
                    levelBuilder.msg = "Mode: PLATFORMER (free move + GD portals)";
                    playMenuSound(); return;
                }
                if (mouseX >= 168 && mouseX < 220) { vPodmenijuLevelBuilder = false; vUredniku = true; urednikTip = "head"; return; }
                if (mouseX >= 408 && mouseX < 448) { builderUndo(); return; }
                if (mouseX >= 452 && mouseX < 492) { builderRedo(); return; }
                if (mouseX >= 224 && mouseX < 266) {
                    builderPushUndo();
                    levelBuilder.cols = min(120, levelBuilder.cols + 4);
                    for (let r = 0; r < levelBuilder.rows; r++) {
                        if (!levelBuilder.grid[r]) levelBuilder.grid[r] = [];
                        while (levelBuilder.grid[r].length < levelBuilder.cols) levelBuilder.grid[r].push(0);
                    }
                    levelBuilder.msg = "Cols: " + levelBuilder.cols; return;
                }
                if (mouseX >= 270 && mouseX < 312) {
                    builderPushUndo();
                    levelBuilder.cols = max(lbVisibleCols(), levelBuilder.cols - 4);
                    levelBuilder.scrollC = min(levelBuilder.scrollC || 0, max(0, levelBuilder.cols - lbVisibleCols()));
                    levelBuilder.msg = "Cols: " + levelBuilder.cols; return;
                }
                if (mouseX >= 316 && mouseX < 358) {
                    builderPushUndo();
                    levelBuilder.rows = min(18, levelBuilder.rows + 1);
                    while (levelBuilder.grid.length < levelBuilder.rows) {
                        const row = [];
                        for (let c = 0; c < levelBuilder.cols; c++) row.push(0);
                        levelBuilder.grid.push(row);
                    }
                    levelBuilder.msg = "Rows: " + levelBuilder.rows + " (ceiling space)"; return;
                }
                if (mouseX >= 362 && mouseX < 404) {
                    builderPushUndo();
                    levelBuilder.rows = max(8, levelBuilder.rows - 1);
                    levelBuilder.msg = "Rows: " + levelBuilder.rows; return;
                }
                // NEW level is created from the browser screen
                if (mouseX >= 548 && mouseX < 594) {
                    levelBuilder.showHitboxes = !levelBuilder.showHitboxes;
                    levelBuilder.msg = levelBuilder.showHitboxes ? "Hitboxes ON" : "Hitboxes OFF";
                    playMenuSound();
                    return;
                }
            }
            const L = builderLayout();
            const gx = L.gx, gy = L.gy, cw = L.cw, ch = L.ch;
            const tools = builderCurrentTools();
            const vis = (typeof builderLayout === "function" && builderLayout().visCols) || LB_EDITOR_VISIBLE_COLS;
            const scrollC = levelBuilder.scrollC || 0;
            if (mouseY >= (L.topUI || 68) && mouseY < sirina - (L.bottomUI || 128) && mouseX >= 0 && mouseX < sirina) {
                if (levelBuilder.selectMode) {
                    const k = builderPickKeyAt(mouseX, mouseY);
                    if (k) {
                        const p = k.split(",").map(Number);
                        const r = p[0], c = p[1];
                        if (!levelBuilder.selectedCells) levelBuilder.selectedCells = [];
                        const shift = builderShiftHeld || (typeof keyIsDown === "function" && (keyIsDown(SHIFT) || keyIsDown(16)));
                        if (shift) {
                            const ix = levelBuilder.selectedCells.indexOf(k);
                            if (ix >= 0) levelBuilder.selectedCells.splice(ix, 1);
                            else levelBuilder.selectedCells.push(k);
                            levelBuilder.selectedCell = k;
                        } else {
                            levelBuilder.selectedCell = k;
                            levelBuilder.selectedCells = [k];
                        }
                        const n = levelBuilder.selectedCells.length;
                        const has = levelBuilder.grid[r] && levelBuilder.grid[r][c];
                        const meta = (levelBuilder.cellMeta && levelBuilder.cellMeta[k]) || {};
                        levelBuilder.msg = n > 1
                            ? (n + " selected — Ctrl+C/V · S± · nudge")
                            : (has ? ("Selected (ox=" + (Number(meta.ox)||0).toFixed(1) + " scale=" + (Number(meta.scale)||1).toFixed(2) + ")") : "Empty (paste target)");
                    }
                    return;
                }
                builderPaintCellAt(mouseX, mouseY, false);
                return;
            }
            // Level scrollbar click/drag start
            const sb = levelBuilder._scrollBar;
            if (sb && mouseY >= sb.y && mouseY <= sb.y + sb.h && mouseX >= sb.x && mouseX <= sb.x + sb.w) {
                levelBuilder.draggingScroll = true;
                const maxScroll = max(0, levelBuilder.cols - lbVisibleCols());
                const rel = constrain((mouseX - sb.x) / sb.w, 0, 1);
                levelBuilder.scrollC = floor(rel * maxScroll);
                return;
            }

            // Pinned ERASE / DECO
            if (levelBuilder._pinErase) {
                const b = levelBuilder._pinErase;
                if (mouseX >= b.x && mouseX < b.x + b.w && mouseY >= b.y && mouseY < b.y + b.h) {
                    levelBuilder.tool = b.idx; levelBuilder.msg = "ERASE"; return;
                }
            }
            if (levelBuilder._pinDeco) {
                const b = levelBuilder._pinDeco;
                if (mouseX >= b.x && mouseX < b.x + b.w && mouseY >= b.y && mouseY < b.y + b.h) {
                    levelBuilder.tool = b.idx;
                    levelBuilder.selectMode = false;
                    levelBuilder.decoEditor = false;
                    if (typeof lbDecoSeedLibrary === "function") lbDecoSeedLibrary();
                    levelBuilder.msg = "DECO — click grid to place";
                    return;
                }
            }
            if (levelBuilder._pinDecoErase) {
                const b = levelBuilder._pinDecoErase;
                if (mouseX >= b.x && mouseX < b.x + b.w && mouseY >= b.y && mouseY < b.y + b.h) {
                    levelBuilder.tool = b.idx;
                    levelBuilder.selectMode = false;
                    levelBuilder.decoEditor = false;
                    levelBuilder.msg = "DECO ERASE — removes decoration only";
                    return;
                }
            }
            const toolsY = L.toolsY0;
            const perRow = L.perRow;
            const toolRowsVisible = L.toolRowsVisible || 3;
            const tScroll = levelBuilder.toolScroll || 0;
            const arrowX = 6 + perRow * 54 + 2;
            if (mouseX >= arrowX && mouseX < arrowX + 18) {
                if (mouseY >= toolsY && mouseY < toolsY + 16) {
                    levelBuilder.toolScroll = max(0, tScroll - 1); return;
                }
                if (mouseY >= toolsY + (L.toolRowH || 17) && mouseY < toolsY + (L.toolsH || 34)) {
                    const maxTS = max(0, Math.ceil(tools.length / perRow) - toolRowsVisible);
                    levelBuilder.toolScroll = min(maxTS, tScroll + 1); return;
                }
            }
            const rowH = L.toolRowH || 17;
            if (mouseY >= toolsY && mouseY < toolsY + toolRowsVisible * rowH) {
                for (let row = 0; row < toolRowsVisible; row++) {
                    for (let col = 0; col < perRow; col++) {
                        const i = (row + tScroll) * perRow + col;
                        if (i >= tools.length) continue;
                        const bx = 6 + col * 54;
                        const by = toolsY + row * rowH;
                        if (mouseX >= bx && mouseX < bx + 52 && mouseY >= by && mouseY < by + rowH) {
                            levelBuilder.tool = i; return;
                        }
                    }
                }
            }
            const btnY = L.btnY;
            const bh = (L.btnH || 22);
            if (mouseY >= btnY && mouseY <= btnY + bh && levelBuilder._actionBtns) {
                for (const b of levelBuilder._actionBtns) {
                    if (mouseX >= b.x && mouseX < b.x + b.w) {
                        const lab = b.label;
                        if (lab === "PLAY") { startBuilderTest(); return; }
                        if (lab === "BACK") { builderBackToList(); return; }
                        if (lab === "CLR") {
                            builderPushUndo();
                            for (let rr=0; rr<levelBuilder.rows; rr++) for (let cc=0; cc<levelBuilder.cols; cc++) levelBuilder.grid[rr][cc]=0;
                            levelBuilder.cellMeta={}; levelBuilder.decoCells={}; levelBuilder.decoStrokes=[];
                            levelBuilder.decoPlacements={}; levelBuilder.selectedCell=null; levelBuilder.selectedCells=[];
                            levelBuilder.msg = "Cleared"; return;
                        }
                        if (lab === "SEL" || lab === "SEL*") {
                            levelBuilder.selectMode = !levelBuilder.selectMode;
                            if (!levelBuilder.selectMode) levelBuilder.selectedCells = [];
                            levelBuilder.msg = levelBuilder.selectMode ? "SELECT mode" : "Paint mode"; return;
                        }
                        if (lab === "S−") { builderResizeSelected(-0.25); return; }
                        if (lab === "S+") { builderResizeSelected(0.25); return; }
                        if (lab === "←") { builderNudgeSelected(-0.2, 0); return; }
                        if (lab === "→") { builderNudgeSelected(0.2, 0); return; }
                        if (lab === "↑") { builderNudgeSelected(0, 0.2); return; }
                        if (lab === "↓") { builderNudgeSelected(0, -0.2); return; }
                        if (lab === "ROT") { builderRotateSelected(); return; }
                        return;
                    }
                }
            }

            // saved levels handled on browser screen
            return;
        }
        if (vPodmenijuBuilder) {
            for (let i = 0; i < builderOptions.length; i++) {
                let lay = builderOptionLayout(i);
                if (mouseY > lay.y - 16 && mouseY < lay.y + 16 && mouseX > lay.x - 24 && mouseX < lay.x + 250) {
                    builderIzbira = i;
                    builderFlags[builderOptions[i].key] = !builderFlags[builderOptions[i].key];
                    delete builderFlags.shrink;
                    localStorage.setItem("builderFlags", JSON.stringify(builderFlags));
                    playMenuSound();
                    return;
                }
            }
            let startY = 115 + ceil(builderOptions.length / 2) * 38 + 36;
            if (mouseY > startY - 26 && mouseY < startY + 26 && mouseX > sirina / 2 - 130 && mouseX < sirina / 2 + 130) {
                vPodmenijuBuilder = false;
                vPodmenijuShop = false;
                vPodmenijuSpend = false;
                menu = false;
                gameMode = "Custom Mode";
                stopAmbient();
                resetGame();
                return;
            }
            return;
        }
        if (vPodmenijuReplays) {
            if (savedReplays.length > 0) {
                for (let i = 0; i < savedReplays.length; i++) {
                    let y = 135 + i * 36;
                    if (mouseY > y - 12 && mouseY < y + 12) {
                        selectedReplayIdx = i;
                        playSavedReplay(i, true);
                        return;
                    }
                }
            }
            return;
        }
        if (!vPodmenijuRecords && !vPodmenijuShop && !vPodmenijuSpend) {
            handleMainMenuClick();
        } else if (vPodmenijuRecords) {
            vPodmenijuRecords = false;
            playMenuSound();
        } else if (vPodmenijuSpend) {
            // tabs
            const tabs = [
                { x: 58, idx: 0 }, { x: 165, idx: 1 }, { x: 275, idx: 2 }, { x: 390, idx: 3 }
            ];
            for (let t of tabs) {
                if (abs(mouseX - t.x) < 55 && mouseY > 88 && mouseY < 112) {
                    spendTab = t.idx; spendIzbira = 0; playMenuSound(); return;
                }
            }
            // simulate enter for current tab
            if (spendTab === 1 && mouseY > 250 && mouseY < 310) doGamble();
            else if (spendTab === 0 && mouseY > 120 && mouseY < 310) {
                let idx = floor((mouseY - 120) / 36);
                if (idx >= 0 && idx < 3) {
                    spendIzbira = idx;
                    if (idx === 0) boostStartLen = !boostStartLen;
                    else if (idx === 1) boostMagnet = !boostMagnet;
                    else if (idx === 2) boostLuckyRun = !boostLuckyRun;
                    playMenuSound();
                }
            } else if (spendTab === 2 && mouseY > 120 && mouseY < 240) {
                spendIzbira = 0;
                if (upgradeCoins < UPGRADE_MAX) {
                    let c = upgradeCost(upgradeCoins, 2);
                    if (kovanci >= c) {
                        kovanci -= c; upgradeCoins++;
                        localStorage.setItem("snakeCoins", kovanci);
                        localStorage.setItem("upgradeCoins", upgradeCoins);
                        playBuySound();
                    }
                }
            } else if (spendTab === 3 && mouseY > 255 && mouseY < 315) {
                doBoostGamble();
            }
        } else if (vPodmenijuShop) {
            handleShopClick();
        }
        return;
    }

    // Game over / win screens
    if (gameOver || winScreen || gdWon || (gameMode === "Platformer" && plrWon)) {
        // Any mouse click starts a fresh game after death/win.
        // Revive/continue remain available from their keyboard shortcuts.
        if (gameMode === "Platformer" && plrWon) {
            if (currentPlatformerLevel < totalPlatformerLevels - 1) {
                initPlatformer(currentPlatformerLevel + 1); plrWon = false; gameOver = false;
            } else resetGame();
        } else {
            resetGame();
        }
        return false;
    }
}

function mouseReleased() {
    if (levelBuilder) {
        levelBuilder.draggingScroll = false;
        levelBuilder.draggingToolScroll = false;
        levelBuilder.decoDrawing = false;
    }
}
function mouseDragged() {
    if (showSettings) {
        if (mouseY > 110 && mouseY < 140 && mouseX > 150 && mouseX < 450) {
            jumpscareChance = constrain(map(mouseX, 150, 450, 0, 1), 0, 1);
            localStorage.setItem("jumpscareChance", jumpscareChance);
        }
        return;
    }
    if (vUredniku) paintPixel();
    if (menu && vPodmenijuLevelBuilder) {
        // While deco pixel editor is open: only paint pixels, never the level
        if (levelBuilder.decoEditor) {
            const pix = levelBuilder._decoPix;
            if (pix && mouseX >= pix.x && mouseX < pix.x + pix.w && mouseY >= pix.y && mouseY < pix.y + pix.h) {
                const draft = lbDecoEnsureDraft();
                const i = floor((mouseX - pix.x) / pix.ps);
                const j = floor((mouseY - pix.y) / pix.ps);
                if (i >= 0 && i < pix.gs && j >= 0 && j < pix.gs) {
                    if (mouseButton === RIGHT) draft[i][j] = 0;
                    else draft[i][j] = levelBuilder.decoPaintColor || 1;
                }
            }
            return;
        }
        if (levelBuilder.draggingScroll) {
            const sb = levelBuilder._scrollBar;
            if (sb) {
                const maxScroll = max(0, levelBuilder.cols - lbVisibleCols());
                const rel = constrain((mouseX - sb.x) / max(1, sb.w), 0, 1);
                levelBuilder.scrollC = floor(rel * maxScroll);
            }
            return;
        }
        if (levelBuilder.selectMode) {
            // drag-select: add cells under cursor (no paint)
            const L = typeof builderLayout === "function" ? builderLayout() : null;
            if (L) {
                const gx = L.gx, gy = L.gy, cw = L.cw, ch = L.ch;
                const vis = (typeof builderLayout === "function" && builderLayout().visCols) || LB_EDITOR_VISIBLE_COLS;
                {
                    const k = builderPickKeyAt(mouseX, mouseY);
                    if (k) {
                        const p = k.split(",").map(Number);
                        const r = p[0], c = p[1];
                        if (!levelBuilder.selectedCells) levelBuilder.selectedCells = [];
                        if (levelBuilder.grid[r] && levelBuilder.grid[r][c]) {
                            if (levelBuilder.selectedCells.indexOf(k) < 0) levelBuilder.selectedCells.push(k);
                            levelBuilder.selectedCell = k;
                            levelBuilder.msg = levelBuilder.selectedCells.length + " selected (drag)";
                        } else {
                            levelBuilder.selectedCell = k;
                        }
                    }
                }
            }
        } else {
            builderPaintCellAt(mouseX, mouseY, true);
        }
    }
}

function mouseMoved() {
    if (!menu || vUredniku || showSettings || showAchievements) return;
    if (vPodmenijuBuilder) return;

    if (vPodmenijuReplays) {
        if (savedReplays.length > 0) {
            for (let i = 0; i < savedReplays.length; i++) {
                const y = 135 + i * 36;
                if (mouseY > y - 14 && mouseY < y + 14 && mouseX > 30 && mouseX < sirina - 20) {
                    if (selectedReplayIdx !== i) {
                        selectedReplayIdx = i;
                        playMenuSound();
                    }
                    return;
                }
            }
        }
        return;
    }

    if (!vPodmenijuRecords && !vPodmenijuShop && !vPodmenijuSpend) {
        const items = [
            { y: 70, idx: 0 },
            { y: 95, idx: 1 },
            { y: 120, idx: 2 },
            { y: 145, idx: 3 },
            { y: 170, idx: 4 },
            { y: 195, idx: 5 },
            { y: 220, idx: 6 },
            { y: 245, idx: 7 },
            { y: 270, idx: 8 },
        ];
        for (let item of items) {
            if (mouseY > item.y - 12 && mouseY < item.y + 12 && mouseX > 120 && mouseX < 480) {
                if (glavniMeniIzbira !== item.idx) {
                    glavniMeniIzbira = item.idx;
                }
                return;
            }
        }
    } else if (vPodmenijuShop) {
        let artikli = shopKategorija === 0 ? shopSkins :
                      shopKategorija === 1 ? shopBackgrounds :
                      shopKategorija === 2 ? shopAccessories :
                      getExclusiveItems();
        let end = min(artikli.length, shopScroll + SHOP_VISIBLE);
        for (let i = shopScroll; i < end; i++) {
            let yPos = 118 + (i - shopScroll) * SHOP_ROW_H;
            if (mouseY > yPos - 10 && mouseY < yPos + 10 && mouseX > 40 && mouseX < sirina - 20) {
                shopIzbira = i;
                return;
            }
        }
    }
}

function izrisUrednika() {
    background(25, 25, 40);
    fill(255); textAlign(CENTER, CENTER); textSize(22);
    let naslov = urednikTip === "head" ? "🎨 CUSTOM HEAD" : urednikTip === "tail" ? "🐍 CUSTOM TAIL" : "🖼 CUSTOM BACKGROUND";
    text(naslov, sirina / 2, 28);
    textSize(13); fill(180); text("Left click / drag = paint   |   Right click = erase", sirina / 2, 52);
    let tabs = ["HEAD", "TAIL", "BG"];
    for (let t = 0; t < 3; t++) {
        let tip = ["head", "tail", "bg"][t];
        fill(urednikTip === tip ? "cyan" : 70); rect(120 + t * 120, 70, 100, 28, 6);
        fill(urednikTip === tip ? 0 : 220); textSize(14); text(tabs[t], 170 + t * 120, 84);
    }
    let size = urednikTip === "bg" ? bgGridVelikost : gridVelikost;
    let pxSize = urednikTip === "bg" ? bgPikselVelikost : pikselVelikost;
    let startX = urejevalnikX - (urednikTip === "bg" ? 20 : 0);
    let startY = urejevalnikY + 5;
    let grid = urednikTip === "head" ? customHeadGrid : urednikTip === "tail" ? customTailGrid : customBgGrid;
    for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) {
        let colIdx = grid[i][j];
        if (colIdx === 0) fill(50); else fill(headPalette[colIdx][0], headPalette[colIdx][1], headPalette[colIdx][2]);
        stroke(30); strokeWeight(1); rect(startX + i * pxSize, startY + j * pxSize, pxSize, pxSize);
    }
    textSize(14); fill(200); noStroke(); text("COLORS:", sirina / 2, 475);
    for (let c = 1; c <= 8; c++) {
        let px = 80 + (c - 1) * 55;
        fill(headPalette[c][0], headPalette[c][1], headPalette[c][2]);
        stroke(c === izbranaBarva ? 255 : 80); strokeWeight(c === izbranaBarva ? 4 : 1);
        rect(px, 490, 45, 32, 6);
    }
    fill(0, 180, 100); noStroke(); rect(sirina / 2 - 200, 540, 110, 38, 8);
    fill(180, 60, 60); rect(sirina / 2 - 55, 540, 110, 38, 8);
    fill(80, 80, 200); rect(sirina / 2 + 90, 540, 110, 38, 8);
    fill(255); textSize(15); text("SAVE", sirina / 2 - 145, 559); text("CLEAR", sirina / 2, 559); text("EXIT", sirina / 2 + 145, 559);
}

function paintPixel() {
    let size = urednikTip === "bg" ? bgGridVelikost : gridVelikost;
    let pxSize = urednikTip === "bg" ? bgPikselVelikost : pikselVelikost;
    let startX = urejevalnikX - (urednikTip === "bg" ? 20 : 0);
    let startY = urejevalnikY + 5;
    let grid = urednikTip === "head" ? customHeadGrid : urednikTip === "tail" ? customTailGrid : customBgGrid;
    if (mouseX >= startX && mouseX < startX + size * pxSize && mouseY >= startY && mouseY < startY + size * pxSize) {
        let i = floor((mouseX - startX) / pxSize);
        let j = floor((mouseY - startY) / pxSize);
        if (i >= 0 && i < size && j >= 0 && j < size) {
            if (mouseButton === RIGHT) grid[i][j] = 0; else grid[i][j] = izbranaBarva;
        }
    }
}

function assignFoodStyle(nova) {
    nova.isIllusion = false;
    nova.effect = null;
    nova.barva = "yellow";
    if (!modeHas("foodEffects")) return nova;
    let types = [
        { effect: "slow", color: "blue" }, { effect: "grow", color: "lime" }, { effect: "shrink", color: "purple" },
        { effect: "teleport", color: "orange" }, { effect: "ghost", color: "cyan" }, { effect: "reverse", color: "pink" },
        { effect: "tiny", color: "brown" }, { effect: "giant", color: "gold" }, { effect: "shield", color: "red" },
        { effect: "scorex2", color: "green" }, { effect: "dash", color: "magenta" },
        { effect: "freeze", color: "lightcyan" }, { effect: "jackpot", color: "#FFD700" },
        { effect: "rainbow", color: "gray" }, { effect: "drift", color: "#006400" },
        { effect: "goldapple", color: "goldenrod" }, { effect: "illusion", color: "darkviolet" }
    ];
    // Weighted: more common basics, rarer specials — all types can appear
    let roll = random();
    let pick;
    if (roll < 0.12) pick = types[0];
    else if (roll < 0.24) pick = types[1];
    else if (roll < 0.32) pick = types[2];
    else pick = types[floor(random(types.length))];
    nova.effect = pick.effect;
    nova.barva = pick.color;
    return nova;
}

function dodajEnoHrano() {
    let stolpci = floor(sirina / velikost);
    let vrstice = floor(sirina / velikost);
    let minIndex = modeHas("shrink") ? floor(robZmanjsanja / velikost) : 0;
    let maxStolpci = modeHas("shrink") ? stolpci - minIndex : stolpci;
    let maxVrstice = modeHas("shrink") ? vrstice - minIndex : vrstice;
    if (maxStolpci <= minIndex) maxStolpci = minIndex + 1;
    if (maxVrstice <= minIndex) maxVrstice = minIndex + 1;
    let veljavno = false, nova, poskusi = 0;
    while (!veljavno && poskusi < 100) {
        poskusi++; veljavno = true;
        let rx = floor(random(minIndex, maxStolpci));
        let ry = floor(random(minIndex, maxVrstice));
        nova = createVector(rx * velikost, ry * velikost);
        if (nova.x === k.x && nova.y === k.y) veljavno = false;
        for (let r of k.rep) if (nova.x === r.x && nova.y === r.y) veljavno = false;
        for (let s of stene) if (nova.x === s.x && nova.y === s.y) veljavno = false;
        for (let f of hrana) if (nova.x === f.x && nova.y === f.y) veljavno = false;
        // also avoid mirror head cell
        if (gameMode === "Mirror Snake") {
            let mx = sirina - velikost - k.x, my = k.y;
            if (nova.x === mx && nova.y === my) veljavno = false;
        }
    }
    if (veljavno) {
        assignFoodStyle(nova);
        hrana.push(nova);
        if (nova.effect === "illusion") {
            for (let j = 0; j < 4; j++) {
                let lx = floor(random(minIndex, maxStolpci)) * velikost;
                let ly = floor(random(minIndex, maxVrstice)) * velikost;
                let lazna = createVector(lx, ly);
                lazna.isIllusion = true; lazna.barva = "darkviolet"; lazna.effect = null;
                hrana.push(lazna);
            }
        }
    }
}

function lokacijaHrane() {
    hrana = [];
    let count = modeHas("multiFood") ? 3 : 1;
    let stolpci = floor(sirina / velikost);
    let vrstice = floor(sirina / velikost);
    let minIndex = modeHas("shrink") ? floor(robZmanjsanja / velikost) : 0;
    let maxStolpci = modeHas("shrink") ? stolpci - minIndex : stolpci;
    let maxVrstice = modeHas("shrink") ? vrstice - minIndex : vrstice;
    if (maxStolpci <= minIndex) maxStolpci = minIndex + 1;
    if (maxVrstice <= minIndex) maxVrstice = minIndex + 1;

    for (let n = 0; n < count; n++) {
        let veljavno = false, nova, poskusi = 0;
        while (!veljavno && poskusi < 100) {
            poskusi++; veljavno = true;
            let rx = floor(random(minIndex, maxStolpci));
            let ry = floor(random(minIndex, maxVrstice));
            nova = createVector(rx * velikost, ry * velikost);
            if (k && nova.x === k.x && nova.y === k.y) veljavno = false;
            if (k) for (let r of k.rep) if (nova.x === r.x && nova.y === r.y) veljavno = false;
            for (let s of stene) if (nova.x === s.x && nova.y === s.y) veljavno = false;
            for (let f of hrana) if (nova.x === f.x && nova.y === f.y) veljavno = false;
            if (gameMode === "Mirror Snake" && k) {
                let mx = sirina - velikost - k.x, my = k.y;
                if (nova.x === mx && nova.y === my) veljavno = false;
            }
        }
        if (veljavno) {
            assignFoodStyle(nova);
            hrana.push(nova);
            if (nova.effect === "illusion") {
                for (let j = 0; j < 4; j++) {
                    let lx = floor(random(minIndex, maxStolpci)) * velikost;
                    let ly = floor(random(minIndex, maxVrstice)) * velikost;
                    let lazna = createVector(lx, ly);
                    lazna.isIllusion = true; lazna.barva = "darkviolet"; lazna.effect = null;
                    hrana.push(lazna);
                }
            }
        }
    }
}

function uporabiEffect(effect) {
    if (hasEffect("RAINBOW") && effect !== "shrink") k.dolzina += 1;
    if (effect === "slow") { frameRate(5); addEffect("SLOW", 120); }
    else if (effect === "grow") k.dolzina += 4;
    else if (effect === "shrink") k.dolzina = max(0, k.dolzina - 5);
    else if (effect === "teleport") teleportSnake();
    else if (effect === "ghost") { k.ghost = true; addEffect("GHOST", 400); }
    else if (effect === "reverse") { k.reverse = true; addEffect("REVERSE", 400); }
    else if (effect === "tiny") addEffect("TINY", 350);
    else if (effect === "giant") addEffect("GIANT", 350);
    else if (effect === "shield") addEffect("SHIELD", 500);
    else if (effect === "scorex2") { k.dolzina += 1; addEffect("BONUS", 200); }
    else if (effect === "dash") { frameRate(30); addEffect("DASH", 180); }
    else if (effect === "freeze") addEffect("FREEZE", 30);
    else if (effect === "rainbow") { frameRate(15); addEffect("RAINBOW", 300); }
    else if (effect === "drift") addEffect("DRIFT", 300);
    else if (effect === "goldapple") { k.dolzina += 14; k.ghost = true; addEffect("GHOST", 50); }
    else if (effect === "jackpot") {
        if (floor(random(2)) === 0) k.dolzina += 7; else addEffect("SHIELD", 500);
    }
}

const effectInfo = {
    SLOW: "Počasnejša kača",
    GHOST: "Skozi stene in sebe",
    REVERSE: "Obrnjene kontrole",
    TINY: "Manjša kača",
    GIANT: "Večja kača, lažje jé",
    SHIELD: "Naslednji udarec preživiš",
    BONUS: "Bonus točke",
    DASH: "Zelo hitra kača",
    FREEZE: "Začasno ne moreš premikati",
    RAINBOW: "Mavrična + hitrejša",
    DRIFT: "Premika se le, ko držiš tipko"
};

const foodEffectHelp = {
    slow: "Počasnejša kača",
    grow: "+4 dolžine",
    shrink: "-5 dolžine",
    teleport: "Naključni teleport",
    ghost: "Skozi stene/sebe",
    reverse: "Obrnjene tipke",
    tiny: "Manjša kača",
    giant: "Večja kača",
    scorex2: "+1 in bonus",
    dash: "Zelo hitra",
    shield: "Naslednji udarec preživiš",
    freeze: "Zamrzneš",
    jackpot: "+7",
    rainbow: "Mavrična + hitrost",
    drift: "Samo ko držiš tipko",
    goldapple: "+14",
    illusion: "Lažna hrana (-4)",
    reverse: "Obrnjene kontrole"
};

const perkInfo = {
    "Neon Trail": "Cyan partikli za kačo",
    "Food Sense": "Hrana se hitro privlači k tebi",
    "Sparkle Particles": "Bleščeči partikli"
};

function addEffect(name, timer) {
    for (let eff of activeEffects) if (eff.name === name) { eff.timer = timer; return; }
    activeEffects.push({ name, timer });
}
function removeEffect(name) {
    for (let i = activeEffects.length - 1; i >= 0; i--) if (activeEffects[i].name === name) activeEffects.splice(i, 1);
}
function hasEffect(name) {
    for (let eff of activeEffects) if (eff.name === name) return true;
    return false;
}
function getEffectTimer(name) {
    for (let eff of activeEffects) if (eff.name === name) return eff.timer;
    return 0;
}
function updateEffects() {
    for (let i = activeEffects.length - 1; i >= 0; i--) {
        activeEffects[i].timer--;
        if (activeEffects[i].timer <= 0) {
            let e = activeEffects[i].name;
            if (e === "SLOW" || e === "DASH" || e === "RAINBOW") {
                if (gameMode === "AI Mode" || watchingAI) frameRate(15); else frameRate(13);
            }
            if (e === "GHOST") k.ghost = false;
            if (e === "REVERSE") k.reverse = false;
            activeEffects.splice(i, 1);
        }
    }
}
function uporabiMagnet() {
    // Magnet: one diagonal step per frame, stop when next to head (no overshoot)
    for (let f of hrana) {
        if (f.isIllusion) continue;
        let d = dist(k.x, k.y, f.x, f.y);
        if (d >= velikost * 10 || d <= velikost) continue;
        if (f.x < k.x) f.x += velikost; else if (f.x > k.x) f.x -= velikost;
        if (f.y < k.y) f.y += velikost; else if (f.y > k.y) f.y -= velikost;
    }
}

class Kaca {
    constructor() {
        let stolpci = floor(sirina / velikost);
        let vrstice = floor(sirina / velikost);
        this.x = floor(random(stolpci)) * velikost;
        this.y = floor(random(vrstice)) * velikost;
        this.xspeed = 0; this.yspeed = 0; this.dolzina = 0; this.rep = [];
        this.smrt = false; this.ghost = false; this.reverse = false; this.odvrziMinu = false;
    }
    sproziUdarac(reason) {
        if (hasEffect("SHIELD")) {
            removeEffect("SHIELD");
            spawnParticles(this.x + velikost / 2, this.y + velikost / 2, 12, color(255, 80, 80));
            return;
        }
        if (reason) deathCause = reason;
        else if (!deathCause) deathCause = "Unknown";
        this.smrt = true;
    }

    obrniSmerGlave() {
        let novaGlava = this.rep.shift();
        this.rep.push(createVector(this.x, this.y));
        this.x = novaGlava.x; this.y = novaGlava.y;
        this.xspeed *= -1; this.yspeed *= -1;
    }
    pojej(pos) {
        let doseg = velikost;
        if (hasEffect("GIANT")) doseg = velikost * 1.5;
        let sOdmik = (doseg - velikost) / 2;
        let kX1 = this.x - sOdmik, kY1 = this.y - sOdmik;
        if (kX1 < pos.x + velikost && kX1 + doseg > pos.x && kY1 < pos.y + velikost && kY1 + doseg > pos.y) {
            this.dolzina++; return true;
        }
        return false;
    }
    smer(a, b) {
        if (this.reverse) { a *= -1; b *= -1; }
        if (!this.ghost && this.dolzina > 0 && this.xspeed === -a && this.yspeed === -b) return;
        this.xspeed = a; this.yspeed = b;
    }
    premik() {
        if (this.dolzina > 0) this.rep.push(createVector(this.x, this.y));
        while (this.rep.length > this.dolzina) this.rep.shift();
        this.x += this.xspeed * velikost; this.y += this.yspeed * velikost;
        if (!this.ghost) for (let r of this.rep) if (r.x === this.x && r.y === this.y) this.sproziUdarac("Ate own tail");
    }
    najdiPotDoHrane(target) {
        let moznosti = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
        let najboljsaSmer = createVector(this.xspeed, this.yspeed);
        let najmanjsaRazdalja = Infinity;
        let minMeja = modeHas("shrink") ? robZmanjsanja : 0;
        let maxMeja = modeHas("shrink") ? sirina - robZmanjsanja : sirina;
        for (let m of moznosti) {
            if (this.dolzina > 0 && m.x === -this.xspeed && m.y === -this.yspeed) continue;
            let testX = this.x + m.x * velikost, testY = this.y + m.y * velikost;
            if (testX < minMeja || testX >= maxMeja || testY < minMeja || testY >= maxMeja) continue;
            let seZaleti = false;
            for (let r of this.rep) if (testX === r.x && testY === r.y) seZaleti = true;
            for (let s of stene) if (testX === s.x && testY === s.y) seZaleti = true;
            for (let mn of mine) if (testX === mn.x && testY === mn.y) seZaleti = true;
            if (seZaleti) continue;
            let d = dist(testX, testY, target.x, target.y);
            if (d < najmanjsaRazdalja) { najmanjsaRazdalja = d; najboljsaSmer = createVector(m.x, m.y); }
        }
        return najboljsaSmer;
    }
    prikazi() {
        let sObj = shopSkins.find(s => s.name === trenutnaKoza);
        if (!sObj) {
            for (let es of exclusiveSkins) {
                if (unlockedRewards[es.key] && trenutnaKoza === es.name) { sObj = es; break; }
            }
        }
        // Seasonal / custom-named skins
        if (!sObj && trenutnaKoza) {
            sObj = { name: trenutnaKoza, color: [0, 255, 255], pattern: "solid" };
        }

        let skinName = sObj ? sObj.name : "Cyan";
        let baseRGB = sObj ? sObj.color : [0, 255, 255];
        let osnovnaBarva = color(baseRGB[0], baseRGB[1], baseRGB[2]);
        let vzorec = sObj ? sObj.pattern : "solid";

        let trenutnaVelikost = velikost;
        if (hasEffect("TINY")) trenutnaVelikost = velikost * 0.6;
        if (hasEffect("GIANT")) trenutnaVelikost = velikost * 1.5;

        if (hasEffect("RAINBOW")) {
            colorMode(HSB, 360, 100, 100); osnovnaBarva = color((frameCount * 5) % 360, 80, 100);
        } else if (this.ghost || (equipGhostAura && unlockedRewards.ghostAura)) {
            let gTimer = getEffectTimer("GHOST");
            osnovnaBarva = (gTimer < 80 && floor(frameCount / 4) % 2 === 0) ? color(0, 255, 255) : color(200, 255, 255, 140);
        } else if (hasEffect("FREEZE")) osnovnaBarva = color(100, 200, 255);

        let odmik = (velikost - trenutnaVelikost) / 2;
        stroke(0, 50);

        for (let i = 0; i < this.rep.length; i++) {
            let rx = this.rep[i].x + odmik, ry = this.rep[i].y + odmik;
            if (gameMode === "Two-Headed Snake" && i === 0) { fill("magenta"); rect(rx, ry, trenutnaVelikost, trenutnaVelikost); }
            else if (equipCustomTail) {
                noStroke();
                let sub = trenutnaVelikost / gridVelikost;
                let scroll = floor(frameCount * 0.25) % gridVelikost;
                for (let gi = 0; gi < gridVelikost; gi++) for (let gj = 0; gj < gridVelikost; gj++) {
                    let srcI = (gi + scroll + i) % gridVelikost;
                    let colIdx = customTailGrid[srcI][gj];
                    if (colIdx > 0) {
                        let bright = 0.85 + sin(frameCount * 0.1 + i + gi) * 0.15;
                        fill(headPalette[colIdx][0] * bright, headPalette[colIdx][1] * bright, headPalette[colIdx][2] * bright);
                        rect(rx + gi * sub, ry + gj * sub, sub + 0.5, sub + 0.5);
                    }
                }
            } else if (hasEffect("RAINBOW")) {
                colorMode(HSB, 360, 100, 100);
                fill((frameCount * 5 + i * 18) % 360, 90, 100);
                colorMode(RGB, 255, 255, 255);
                rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
            } else {
                if (skinName === "Prism Runner") {
                    const hue = (frameCount * 4 + i * 22) % 360;
                    colorMode(HSB, 360, 100, 100);
                    fill(hue, 90, 100);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                    fill((hue + 55) % 360, 80, 100);
                    rect(rx + trenutnaVelikost * 0.18, ry + trenutnaVelikost * 0.18, trenutnaVelikost * 0.22, trenutnaVelikost * 0.22);
                    colorMode(RGB, 255, 255, 255);
                } else if (skinName === "Sky Engine") {
                    const pulse = 0.7 + sin(frameCount * 0.22 + i * 0.4) * 0.3;
                    fill(70, 210 * pulse, 255);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                    fill(220, 250, 255);
                    triangle(rx + trenutnaVelikost*0.2, ry + trenutnaVelikost*0.8, rx + trenutnaVelikost*0.8, ry + trenutnaVelikost*0.5, rx + trenutnaVelikost*0.2, ry + trenutnaVelikost*0.2);
                } else if (skinName === "Titan Alloy") {
                    fill(120 + sin(frameCount*0.12+i)*35, 175, 225);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                    fill(245, 255, 255);
                    rect(rx + trenutnaVelikost*0.18, ry + trenutnaVelikost*0.18, trenutnaVelikost*0.64, 3);
                } else if (skinName === "Endless Flare") {
                    const pulse = 0.72 + sin(frameCount * 0.25 + i * 0.55) * 0.28;
                    fill(255, 170 * pulse, 25);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                    fill(255, 245, 150);
                    ellipse(rx + trenutnaVelikost * 0.5, ry + trenutnaVelikost * 0.5, trenutnaVelikost * 0.28, trenutnaVelikost * 0.28);
                } else if (skinName === "Pumpkin" || skinName === "Frostbite" || skinName === "Petal" || skinName === "Solar") {
                    drawSeasonalSegment(rx, ry, trenutnaVelikost, skinName, i, false);
                } else if (skinName === "Fire" || skinName === "Lava" || skinName === "Solar Flare") {
                    let flicker = 0.65 + sin(frameCount * 0.28 + i * 0.7) * 0.35;
                    fill(255 * flicker, 40 + sin(frameCount * 0.2 + i) * 40, 0);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                } else if (skinName === "Gold") {
                    let sparkle = 0.75 + sin(frameCount * 0.22 + i * 0.5) * 0.25;
                    fill(255 * sparkle, 215 * sparkle, 40);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                } else if (skinName === "Cyber" || skinName === "Cyber Phantom") {
                    let scan = (frameCount * 2.2 + i * 4) % 22;
                    fill(scan < 5 ? color(0, 255, 230) : scan < 10 ? color(0, 190, 170) : color(0, 110, 100));
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                } else if (skinName === "Void Walker") {
                    fill(40 + sin(frameCount * 0.1 + i) * 20, 0, 80 + sin(frameCount * 0.15 + i) * 40);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                } else if (skinName === "Reality Glitch") {
                    let g = (frameCount * 3 + i * 5) % 30;
                    fill(g < 10 ? color(0, 255, 180) : g < 20 ? color(255, 0, 180) : color(180, 0, 255));
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                } else if (skinName === "Ember") {
                    let flicker = 0.6 + sin(frameCount * 0.3 + i * 0.6) * 0.4;
                    fill(255 * flicker, 60 + sin(frameCount * 0.25 + i) * 50, 10);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                } else if (skinName === "Crystal") {
                    let shine = 0.7 + sin(frameCount * 0.2 + i * 0.4) * 0.3;
                    fill(120 * shine, 200 * shine, 255);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                } else if (vzorec === "zebra") {
                    fill((i + floor(frameCount * 0.18)) % 2 === 0 ? 255 : 15);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                } else if (vzorec === "tiger") {
                    fill((i + floor(frameCount * 0.15)) % 2 === 0 ? color(255, 140, 0) : color(25));
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                } else if (vzorec === "stereoGlow") {
                    const t = frameCount * 0.15 + i * 0.35;
                    fill(110 + 50 * sin(t), 70, 255);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost, 3);
                    fill(220, 200, 255, 140);
                    rect(rx + 2, ry + 2, trenutnaVelikost - 4, trenutnaVelikost - 4, 2);
                } else if (vzorec === "wavePerfect") {
                    const t = frameCount * 0.22 + i * 0.3;
                    fill(40, 0, 55);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                    fill(255, 70 + 50 * sin(t), 210);
                    ellipse(rx + trenutnaVelikost / 2, ry + trenutnaVelikost * (0.5 + 0.22 * sin(t)), trenutnaVelikost * 0.5, trenutnaVelikost * 0.35);
                } else if (vzorec === "pulseFactory") {
                    const beat = ((frameCount + i * 4) % 18 < 9);
                    fill(beat ? color(255, 45, 130) : color(150, 15, 70));
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                    fill(255, 210, 230, beat ? 220 : 100);
                    ellipse(rx + trenutnaVelikost / 2, ry + trenutnaVelikost / 2, trenutnaVelikost * (beat ? 0.55 : 0.3), trenutnaVelikost * (beat ? 0.55 : 0.3));
                } else if (vzorec === "prism" || vzorec === "flare" || vzorec === "crystal" || vzorec === "ember" || vzorec === "phantom" || vzorec === "void" || vzorec === "glitch" || vzorec === "solar") {
                    // animated exclusive fallbacks
                    const t = frameCount * 0.12 + i * 0.2;
                    let r0 = osnovnaBarva.levels ? osnovnaBarva.levels[0] : red(osnovnaBarva);
                    let g0 = osnovnaBarva.levels ? osnovnaBarva.levels[1] : green(osnovnaBarva);
                    let b0 = osnovnaBarva.levels ? osnovnaBarva.levels[2] : blue(osnovnaBarva);
                    fill(r0 + 40 * sin(t), g0 + 30 * cos(t * 1.1), b0 + 40 * sin(t * 0.7));
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                } else {
                    fill(osnovnaBarva);
                    rect(rx, ry, trenutnaVelikost, trenutnaVelikost);
                }
            }
        }

        let gx = this.x + odmik, gy = this.y + odmik;
        if (equipCustomHead && !hasEffect("RAINBOW")) {
            noStroke();
            let subPiksel = trenutnaVelikost / gridVelikost;
            for (let i = 0; i < gridVelikost; i++) for (let j = 0; j < gridVelikost; j++) {
                let colIdx = customHeadGrid[i][j];
                if (colIdx > 0) {
                    fill(headPalette[colIdx][0], headPalette[colIdx][1], headPalette[colIdx][2]);
                    rect(gx + i * subPiksel, gy + j * subPiksel, subPiksel + 0.5, subPiksel + 0.5);
                }
            }
        } else if (hasEffect("RAINBOW")) {
            colorMode(HSB, 360, 100, 100);
            fill((frameCount * 5) % 360, 90, 100);
            colorMode(RGB, 255, 255, 255);
            rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
        } else {
            if (skinName === "Prism Runner") {
                const hue = (frameCount * 5 + this.x * 0.4) % 360;
                colorMode(HSB, 360, 100, 100);
                fill(hue, 92, 100);
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
                fill((hue + 75) % 360, 80, 100);
                ellipse(gx + trenutnaVelikost * 0.5, gy + trenutnaVelikost * 0.5, trenutnaVelikost * 0.46);
                colorMode(RGB, 255, 255, 255);
                noFill(); stroke(255, 255, 255, 150); strokeWeight(1.5);
                rect(gx + 2, gy + 2, trenutnaVelikost - 4, trenutnaVelikost - 4); noStroke();
            } else if (skinName === "Sky Engine") {
                fill(70, 210, 255); rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
                fill(235, 255, 255); triangle(gx+4, gy+trenutnaVelikost-4, gx+trenutnaVelikost-4, gy+trenutnaVelikost/2, gx+4, gy+4);
            } else if (skinName === "Titan Alloy") {
                fill(140, 190, 230); rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
                fill(255); rect(gx+3, gy+3, trenutnaVelikost-6, 3);
            } else if (skinName === "Endless Flare") {
                const pulse = 0.75 + sin(frameCount * 0.25) * 0.25;
                fill(255, 150 * pulse, 20);
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
                fill(255, 240, 130);
                ellipse(gx + trenutnaVelikost * 0.5, gy + trenutnaVelikost * 0.5, trenutnaVelikost * 0.48, trenutnaVelikost * 0.48);
            } else if (skinName === "Stereo Glow") {
                const t = frameCount * 0.15;
                for (let k = 3; k >= 0; k--) {
                    const a = 40 + k * 40;
                    fill(120 + k * 30, 60 + k * 40, 255, a);
                    const s = trenutnaVelikost * (1 + k * 0.18 + sin(t + k) * 0.06);
                    rect(gx + trenutnaVelikost / 2 - s / 2, gy + trenutnaVelikost / 2 - s / 2, s, s, 4);
                }
                fill(220, 200, 255);
                rect(gx + 3, gy + 3, trenutnaVelikost - 6, trenutnaVelikost - 6, 3);
            } else if (skinName === "Wave Perfect") {
                const t = frameCount * 0.2;
                fill(40, 0, 60);
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
                stroke(255, 60 + sin(t) * 40, 200); strokeWeight(2); noFill();
                beginShape();
                for (let px = 0; px <= trenutnaVelikost; px += 2) {
                    const wy = trenutnaVelikost / 2 + sin(px * 0.4 + t) * (trenutnaVelikost * 0.28);
                    vertex(gx + px, gy + wy);
                }
                endShape();
                noStroke();
                fill(255, 100, 220, 180);
                ellipse(gx + trenutnaVelikost * 0.5, gy + trenutnaVelikost * 0.5, 6 + sin(t) * 2, 6 + sin(t) * 2);
            } else if (skinName === "Pulse Factory") {
                const beat = (frameCount % 20 < 10);
                fill(beat ? color(255, 40, 120) : color(180, 20, 80));
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
                fill(255, 200, 220);
                const s2 = trenutnaVelikost * (0.3 + (beat ? 0.25 : 0.1));
                ellipse(gx + trenutnaVelikost / 2, gy + trenutnaVelikost / 2, s2, s2);
                stroke(255, 150, 200, 150); strokeWeight(1); noFill();
                ellipse(gx + trenutnaVelikost / 2, gy + trenutnaVelikost / 2, s2 * 1.6, s2 * 1.6);
                noStroke();
            } else if (skinName === "Pumpkin" || skinName === "Frostbite" || skinName === "Petal" || skinName === "Solar") {
                drawSeasonalSegment(gx, gy, trenutnaVelikost, skinName, 0, true);
            } else if (skinName === "Fire" || skinName === "Lava" || skinName === "Solar Flare") {
                let flicker = 0.7 + sin(frameCount * 0.32) * 0.3;
                fill(255 * flicker, 55 * flicker, 0);
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
            } else if (skinName === "Gold") {
                fill(255, 220, 50);
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
            } else if (skinName === "Cyber" || skinName === "Cyber Phantom") {
                fill((frameCount * 2.2) % 22 < 6 ? color(0, 255, 230) : color(0, 150, 140));
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
            } else if (skinName === "Void Walker") {
                fill(50, 0, 100);
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
            } else if (skinName === "Reality Glitch") {
                fill((frameCount * 4) % 20 < 10 ? color(0, 255, 180) : color(255, 0, 200));
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
            } else if (skinName === "Ember") {
                let flicker = 0.7 + sin(frameCount * 0.35) * 0.3;
                fill(255 * flicker, 70 * flicker, 15);
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
            } else if (skinName === "Crystal") {
                fill(150, 230, 255);
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
            } else {
                fill(osnovnaBarva);
                rect(gx, gy, trenutnaVelikost, trenutnaVelikost);
            }
        }

        // Accessories
        if (trenutniDodatek === "Sunglasses") {
            let smerX = this.xspeed || 1;
            noStroke(); fill(0);
            if (smerX === 1) {
                rect(gx + trenutnaVelikost * 0.5, gy + trenutnaVelikost * 0.15, trenutnaVelikost * 0.4, trenutnaVelikost * 0.25);
                rect(gx + trenutnaVelikost * 0.5, gy + trenutnaVelikost * 0.6, trenutnaVelikost * 0.4, trenutnaVelikost * 0.25);
            } else if (smerX === -1) {
                rect(gx + trenutnaVelikost * 0.1, gy + trenutnaVelikost * 0.15, trenutnaVelikost * 0.4, trenutnaVelikost * 0.25);
                rect(gx + trenutnaVelikost * 0.1, gy + trenutnaVelikost * 0.6, trenutnaVelikost * 0.4, trenutnaVelikost * 0.25);
            }
        } else if (trenutniDodatek === "Crown" || trenutniDodatek === "Golden Crown+") {
            noStroke(); fill(255, 215, 0);
            triangle(gx + 2, gy + 6, gx + trenutnaVelikost / 2, gy - 4, gx + trenutnaVelikost - 2, gy + 6);
            rect(gx + 2, gy + 4, trenutnaVelikost - 4, 6);
        } else if (trenutniDodatek === "Halo") {
            noFill(); stroke(255, 255, 180); strokeWeight(3);
            ellipse(gx + trenutnaVelikost / 2, gy - 6, trenutnaVelikost * 0.9, 10); noStroke();
        } else if (trenutniDodatek === "Bandana") {
            noStroke(); fill(200, 40, 40); rect(gx, gy + trenutnaVelikost * 0.15, trenutnaVelikost, trenutnaVelikost * 0.25);
        } else if (trenutniDodatek === "Horns") {
            noStroke(); fill(90, 40, 30);
            triangle(gx + 2, gy + 4, gx + 6, gy - 8, gx + 10, gy + 4);
            triangle(gx + trenutnaVelikost - 10, gy + 4, gx + trenutnaVelikost - 6, gy - 8, gx + trenutnaVelikost - 2, gy + 4);
        } else if (trenutniDodatek === "Phoenix Wings") {
            noStroke(); fill(255, 80, 0, 200);
            triangle(gx - 8, gy + 10, gx - 2, gy - 5, gx + 4, gy + 10);
            triangle(gx + trenutnaVelikost - 4, gy + 10, gx + trenutnaVelikost + 2, gy - 5, gx + trenutnaVelikost + 8, gy + 10);
        } else if (trenutniDodatek === "Boss Trophy") {
            noStroke();
            fill(255, 200, 50);
            // cup
            rect(gx + trenutnaVelikost * 0.25, gy - 6, trenutnaVelikost * 0.5, 8, 2);
            // handles
            noFill(); stroke(255, 180, 40); strokeWeight(2);
            arc(gx + trenutnaVelikost * 0.2, gy - 2, 10, 10, HALF_PI, PI + HALF_PI);
            arc(gx + trenutnaVelikost * 0.8, gy - 2, 10, 10, -HALF_PI, HALF_PI);
            noStroke(); fill(255, 220, 80);
            // base
            rect(gx + trenutnaVelikost * 0.3, gy + 2, trenutnaVelikost * 0.4, 3);
        } else if (trenutniDodatek === "Gravity Crown") {
            noFill(); stroke(80, 240, 255, 220); strokeWeight(3);
            ellipse(gx + trenutnaVelikost/2, gy + trenutnaVelikost/2, trenutnaVelikost + 12 + sin(frameCount*0.12)*3);
            noStroke(); fill(80,240,255,120); ellipse(gx+trenutnaVelikost/2, gy+trenutnaVelikost/2, 5);
        } else if (trenutniDodatek === "Prism Ring") {
            noFill(); strokeWeight(3); colorMode(HSB,360,100,100); stroke((frameCount*5)%360,90,100); ellipse(gx+trenutnaVelikost/2, gy+trenutnaVelikost/2, trenutnaVelikost+10); colorMode(RGB,255,255,255); noStroke();
        } else if (trenutniDodatek === "GD Crown") {
            const pulse = 0.75 + 0.25 * sin(frameCount * 0.18);
            noStroke(); fill(220, 100 + 80 * pulse, 255, 220);
            triangle(gx + 1, gy + 7, gx + trenutnaVelikost * 0.25, gy - 10 - pulse * 3, gx + trenutnaVelikost * 0.5, gy + 2);
            triangle(gx + trenutnaVelikost * 0.5, gy + 2, gx + trenutnaVelikost * 0.75, gy - 10 - pulse * 3, gx + trenutnaVelikost - 1, gy + 7);
            rect(gx + 2, gy + 5, trenutnaVelikost - 4, 5);
            noFill(); stroke(230, 130, 255, 90 + pulse * 100); strokeWeight(2);
            ellipse(gx + trenutnaVelikost / 2, gy + 1, trenutnaVelikost + 12 + sin(frameCount * 0.12) * 3);
            noStroke();
            for (let s = 0; s < 3; s++) {
                let a = frameCount * 0.08 + s * TWO_PI / 3;
                fill(255, 220, 255, 190);
                ellipse(gx + trenutnaVelikost / 2 + cos(a) * (trenutnaVelikost * 0.75), gy + 1 + sin(a) * 8, 3);
            }
        } else if (trenutniDodatek === "Endless Halo") {
            const bob = sin(frameCount * 0.12) * 4;
            noFill(); stroke(100, 230, 255, 220); strokeWeight(3);
            ellipse(gx + trenutnaVelikost / 2, gy - 7 + bob, trenutnaVelikost + 10, 13);
            stroke(170, 250, 255, 80); strokeWeight(7);
            ellipse(gx + trenutnaVelikost / 2, gy - 7 + bob, trenutnaVelikost + 17, 19);
            noStroke();
            for (let s = 0; s < 5; s++) {
                let a = frameCount * 0.06 + s * TWO_PI / 5;
                fill(130, 240, 255, 180);
                ellipse(gx + trenutnaVelikost / 2 + cos(a) * (trenutnaVelikost * 0.8), gy - 7 + bob + sin(a) * 10, 3);
            }
        } else if (trenutniDodatek === "Sparkle Aura") {
            noFill();
            stroke(255, 255, 180, 150 + sin(frameCount * 0.15) * 80);
            strokeWeight(2);
            ellipse(gx + trenutnaVelikost / 2, gy + trenutnaVelikost / 2, trenutnaVelikost + 10 + sin(frameCount * 0.1) * 4);
            noStroke();
            // small sparkles around
            for (let s = 0; s < 4; s++) {
                let ang = frameCount * 0.08 + s * HALF_PI;
                let sx = gx + trenutnaVelikost / 2 + cos(ang) * (trenutnaVelikost * 0.7);
                let sy = gy + trenutnaVelikost / 2 + sin(ang) * (trenutnaVelikost * 0.7);
                fill(255, 255, 200, 180);
                ellipse(sx, sy, 3);
            }
        }

        noStroke();
        if (hasEffect("RAINBOW")) colorMode(RGB, 255, 255, 255);
    }
    konec() {
        let minMeja = modeHas("shrink") ? robZmanjsanja : 0;
        let maxMeja = modeHas("shrink") ? sirina - robZmanjsanja : sirina;
        if (this.ghost || modeHas("portal") || gameMode === "Gravity") {
            if (this.x < minMeja) this.x = maxMeja - velikost;
            else if (this.x >= maxMeja) this.x = minMeja;
            if (this.y < minMeja) this.y = maxMeja - velikost;
            else if (this.y >= maxMeja) this.y = minMeja;
        } else {
            if (this.x < minMeja || this.x >= maxMeja || this.y < minMeja || this.y >= maxMeja) this.sproziUdarac("Hit wall");
        }
    }
}

function teleportSnake() {
    let minIndex = modeHas("shrink") ? floor(robZmanjsanja / velikost) : 0;
    k.x = floor(random(minIndex, floor(sirina / velikost) - minIndex)) * velikost;
    k.y = floor(random(minIndex, floor(sirina / velikost) - minIndex)) * velikost;
}
function generirajStene() {
    for (let i = 0; i < 12; i++) stene.push(createVector(floor(random(floor(sirina / velikost))) * velikost, floor(random(floor(sirina / velikost))) * velikost));
}
function randomDirection() {
    let r = random([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    k.smer(r[0], r[1]);
}
function premakniHrano() {
    for (let f of hrana) {
        f.x = constrain(f.x + floor(random([-1, 0, 1])) * velikost, 0, sirina - velikost);
        f.y = constrain(f.y + floor(random([-1, 0, 1])) * velikost, 0, sirina - velikost);
    }
}

function keyPressed() {
    // I = AI pilot ONLY on ship / wave
    if (key === "i" || key === "I") {
        if (gameMode === "Tower Climb") { tower.ai = !tower.ai; return; }
        const v = (typeof gdVehicle === "string") ? gdVehicle : "";
        if (v === "ship" || v === "wave" || gameMode === "GD Ship" || gameMode === "GD Wave") {
            gdAIPilot = !gdAIPilot;
        }
        return;
    }
    unlockAudioFromGesture();
    if (introActive) {
        introActive = false;
        introTimer = INTRO_DURATION;
        tryStartMusic();
        return false;
    }
    // Finish practice success screen
    if (tutorialPractice && tutorialPracticeDone) {
        if (keyCode === ENTER || keyCode === 32 || keyCode === ESCAPE) {
            tutorialPractice = false;
            tutorialPracticeAI = false;
            tutorialPracticeDone = false;
            tutorialActive = false;
            localStorage.setItem("tutorialDone", "true");
            menu = true;
            gameOver = false;
            stopAmbient();
            playMenuSound();
        }
        return false;
    }
    if (tutorialActive && !tutorialPractice) {
        if (keyCode === ENTER || keyCode === 32 || keyCode === ESCAPE) {
            const TUTORIAL_STEPS = 6;
            if (keyCode === ESCAPE) {
                // skip entire tutorial
                tutorialActive = false;
                tutorialPractice = false;
            tutorialPracticeAI = false;
                localStorage.setItem("tutorialDone", "true");
                playMenuSound();
                return false;
            }
            if (tutorialStep >= TUTORIAL_STEPS - 1) {
                tutorialPractice = true;
                tutorialPracticeDone = false;
                tutorialActive = false;
                menu = false;
                gameMode = "Classic";
                watchingAI = false;
                isDailyChallenge = false;
                stopAmbient();
                resetGame();
                tryStartMusic();
                playMenuSound();
                return false;
            }
            tutorialStep++;
            playMenuSound();
        }
        return false;
    }
    if (keyCode === SHIFT || keyCode === 16) { builderShiftHeld = true; }
    if (key === 'j' || key === 'J') { showSettings = !showSettings; return; }
    // Practice checkpoints while playing GD
    if (!menu && practiceIsActive() && !showSettings) {
        if (key === 'c' || key === 'C') { practiceAddCheckpoint(false); return; }
        if (key === 'x' || key === 'X') { practiceDeleteNearestCheckpoint(); return; }
        if (keyCode === 8 || keyCode === DELETE) { practiceDeleteNearestCheckpoint(); return; }
    }
    if ((key === 'a' || key === 'A') && gameMode !== "Multiplayer") { showAchievements = !showAchievements; return; }
    if (key === 'm' || key === 'M') {
        soundEnabled = !soundEnabled;
        localStorage.setItem("soundEnabled", soundEnabled);
        if (soundEnabled) tryStartMusic();
        else stopAmbient();
        playMenuSound();
        return;
    }
    if (vUredniku || showSettings) return;
    if (showAchievements) {
        if (keyCode === ESCAPE || key === 'a' || key === 'A') showAchievements = false;
        return;
    }

    if (menu) {
        // Seasonal claim
        if ((key === 'e' || key === 'E') && seasonalEvent && !seasonalClaimed) {
            claimSeasonalReward();
            return;
        }
        // Death Replay browser must be handled before the main-menu navigation.
        if (vPodmenijuReplays) {
            if (keyCode === ESCAPE || keyCode === BACKSPACE || key === "Escape" || key === "Esc") {
                vPodmenijuReplays = false;
                playMenuSound();
                return;
            }
            if (savedReplays.length > 0) {
                if (keyCode === UP_ARROW || key === "ArrowUp") {
                    selectedReplayIdx = (selectedReplayIdx - 1 + savedReplays.length) % savedReplays.length;
                    playMenuSound();
                    return;
                }
                if (keyCode === DOWN_ARROW || key === "ArrowDown") {
                    selectedReplayIdx = (selectedReplayIdx + 1) % savedReplays.length;
                    playMenuSound();
                    return;
                }
                if (keyCode === ENTER || keyCode === 13 || key === "Enter" || key === "Return" || keyCode === 32) {
                    playSavedReplay(selectedReplayIdx, true);
                    return;
                }
            }
            return;
        }

        if (vPodmenijuAILab) {
            if (keyCode === ESCAPE || keyCode === BACKSPACE) { vPodmenijuAILab = false; playMenuSound(); return; }
            if (keyCode === UP_ARROW) { aiLabProfile = (aiLabProfile + 3) % 4; playMenuSound(); return; }
            if (keyCode === DOWN_ARROW) { aiLabProfile = (aiLabProfile + 1) % 4; playMenuSound(); return; }
            if (keyCode === LEFT_ARROW) { aiLabVehicle = (aiLabVehicle + 9) % 10; playMenuSound(); return; }
            if (keyCode === RIGHT_ARROW) { aiLabVehicle = (aiLabVehicle + 1) % 10; playMenuSound(); return; }
            if (keyCode === ENTER || keyCode === 32) {
                vPodmenijuAILab = false;
                menu = false;
                watchingAI = true;
                gdAIPilot = true;
                gameMode = aiLabVehicleMode();
                stopAmbient();
                resetGame();
                gdAIPilot = true;
                playMenuSound();
                return;
            }
            return;
        }
        if (vPodmenijuLevelBuilder) {
            if (!levelBuilder.inEditor) {
                if (keyCode === ESCAPE || keyCode === BACKSPACE) {
                    vPodmenijuLevelBuilder = false; playMenuSound(); return;
                }
                const list = levelBuilder.saved || [];
                const maxVis = 11;
                if (keyCode === UP_ARROW) {
                    levelBuilder.browserSel = Math.max(0, (levelBuilder.browserSel || 0) - 1);
                    levelBuilder.savedPage = Math.floor(levelBuilder.browserSel / maxVis);
                    playMenuSound(); return;
                }
                if (keyCode === DOWN_ARROW) {
                    if (list.length) {
                        levelBuilder.browserSel = Math.min(list.length - 1, (levelBuilder.browserSel || 0) + 1);
                        levelBuilder.savedPage = Math.floor(levelBuilder.browserSel / maxVis);
                    }
                    playMenuSound(); return;
                }
                if (keyCode === ENTER || keyCode === 32) {
                    if (list.length && levelBuilder.browserSel >= 0) builderOpenLevel(levelBuilder.browserSel);
                    else builderOpenNewLevel();
                    return;
                }
                if (key === 'n' || key === 'N') { builderOpenNewLevel(); return; }
                if ((keyCode === DELETE || keyCode === 46) && list.length) {
                    levelBuilder.saveIdx = levelBuilder.browserSel || 0;
                    builderDeleteLevel();
                    levelBuilder.browserSel = Math.min(levelBuilder.browserSel, Math.max(0, list.length - 1));
                    return;
                }
                return;
            }
            if ((keyIsDown(CONTROL) || keyIsDown(17)) && (key === 'z' || key === 'Z')) { builderUndo(); return false; }
            if ((keyIsDown(CONTROL) || keyIsDown(17)) && (key === 'y' || key === 'Y')) { builderRedo(); return false; }
            if ((keyIsDown(CONTROL) || keyIsDown(17)) && (key === 'c' || key === 'C')) { builderCopySelection(); return false; }
            if ((keyIsDown(CONTROL) || keyIsDown(17)) && (key === 'v' || key === 'V')) { builderPasteSelection(); return false; }
            if (key === 't' || key === 'T') { builderRotateSelected(); return false; }
            if (keyCode === DELETE || keyCode === 46 || ((key === 'x' || key === 'X') && !(keyIsDown(CONTROL) || keyIsDown(17)))) {
                if (levelBuilder.selectMode) { builderDeleteSelection(); return false; }
            }
            // Arrow keys scroll the grid (nudge = on-screen ←→↑↓ buttons)
            if (keyCode === LEFT_ARROW) {
                levelBuilder.scrollC = max(0, (levelBuilder.scrollC || 0) - 1);
                return false;
            }
            if (keyCode === RIGHT_ARROW) {
                const vis = lbVisibleCols();
                levelBuilder.scrollC = min(max(0, levelBuilder.cols - vis), (levelBuilder.scrollC || 0) + 1);
                return false;
            }
            if (keyCode === ESCAPE || keyCode === BACKSPACE) { builderBackToList(); return; }
            const tools = builderCurrentTools();
            if (keyCode >= 49 && keyCode <= 48 + min(tools.length, 9)) { levelBuilder.tool = keyCode - 49; playMenuSound(); return; }
            if (key === '0' && tools.length >= 10) { levelBuilder.tool = 9; playMenuSound(); return; }
            if (key === '-' || key === '_') { levelBuilder.tool = min(tools.length - 1, 10); playMenuSound(); return; }
            if (key === '=' || key === '+') { levelBuilder.tool = min(tools.length - 1, 11); playMenuSound(); return; }
            if (key === '[' ) { levelBuilder.tool = min(tools.length - 1, 12); playMenuSound(); return; }
            if (key === ']' ) { levelBuilder.tool = min(tools.length - 1, 13); playMenuSound(); return; }
            if (keyCode === LEFT_ARROW) {
                levelBuilder.scrollC = max(0, (levelBuilder.scrollC || 0) - 4);
                playMenuSound(); return;
            }
            if (keyCode === RIGHT_ARROW) {
                levelBuilder.scrollC = min(max(0, levelBuilder.cols - lbVisibleCols()), (levelBuilder.scrollC || 0) + 4);
                playMenuSound(); return;
            }
            if (keyCode === ENTER || keyCode === 32) { startBuilderTest(); return; }
            if (key === 'h' || key === 'H') {
                levelBuilder.showHitboxes = !levelBuilder.showHitboxes;
                levelBuilder.msg = levelBuilder.showHitboxes ? "Hitboxes ON" : "Hitboxes OFF";
                playMenuSound();
                return;
            }
            if (key === 'k' || key === 'K') {
                levelBuilder.showHitboxTrail = !levelBuilder.showHitboxTrail;
                if (!levelBuilder.showHitboxTrail) levelBuilder.hitboxTrail = [];
                levelBuilder.msg = levelBuilder.showHitboxTrail ? "Hitbox trail ON (K to hide)" : "Hitbox trail OFF";
                playMenuSound();
                return;
            }
            if (key === 'n' || key === 'N') {
                const n = prompt("Level name:", levelBuilder.name || "My Level");
                if (n) levelBuilder.name = n.slice(0, 24);
                return;
            }
            if (key === 's' || key === 'S') { builderAutoSave(); levelBuilder.msg = "Shranjeno"; playMenuSound(); return; }
            if (key === 'p' || key === 'P') {
                levelBuilder.portalTargetIdx = (levelBuilder.portalTargetIdx + 1) % LB_PORTAL_TARGETS.length;
                levelBuilder.portalTarget = LB_PORTAL_TARGETS[levelBuilder.portalTargetIdx];
                levelBuilder.msg = "Next portal → " + levelBuilder.portalTarget;
                return;
            }
            if (key === 'r' || key === 'R') {
                // Cycle: ↑45° → ↓45° → FLAT → ↑45°
                if (levelBuilder.slopeMode === 1) levelBuilder.slopeMode = -1;
                else if (levelBuilder.slopeMode === -1) levelBuilder.slopeMode = 0;
                else levelBuilder.slopeMode = 1;
                const lab = levelBuilder.slopeMode === 0 ? "FLAT" : (levelBuilder.slopeMode === -1 ? "DOWN 45°" : "UP 45°");
                levelBuilder.msg = "Wave slope → " + lab + " (next place)";
                return;
            }
            if (key === 'e' || key === 'E') { vPodmenijuLevelBuilder = false; vUredniku = true; urednikTip = "head"; return; }
            if (key === '+' || key === '=') {
                builderPushUndo();
                    levelBuilder.cols = min(120, levelBuilder.cols + 4);
                for (let r = 0; r < levelBuilder.rows; r++) {
                    if (!levelBuilder.grid[r]) levelBuilder.grid[r] = [];
                    while (levelBuilder.grid[r].length < levelBuilder.cols) levelBuilder.grid[r].push(0);
                }
                levelBuilder.msg = "Cols: " + levelBuilder.cols;
                return;
            }
            return;
        }
        if (vPodmenijuBuilder) {
            if (keyCode === ESCAPE || keyCode === BACKSPACE) { vPodmenijuBuilder = false; return; }
            let maxB = builderOptions.length + 1; // last = start
            if (keyCode === UP_ARROW) { builderIzbira = (builderIzbira - 1 + maxB) % maxB; playMenuSound(); }
            if (keyCode === DOWN_ARROW) { builderIzbira = (builderIzbira + 1) % maxB; playMenuSound(); }
            if (keyCode === 32 || keyCode === ENTER) {
                if (builderIzbira < builderOptions.length) {
                    let k2 = builderOptions[builderIzbira].key;
                    builderFlags[k2] = !builderFlags[k2];
                    localStorage.setItem("builderFlags", JSON.stringify(builderFlags));
                    playMenuSound();
                } else {
                    vPodmenijuBuilder = false;
                    vPodmenijuShop = false;
                    vPodmenijuSpend = false;
                    vPodmenijuRecords = false;
                    vPodmenijuReplays = false;
                    menu = false;
                    gameMode = "Custom Mode";
                    resetGame();
                    if (soundEnabled) tryStartMusic();
                }
            }
            return;
        }
        if (!vPodmenijuRecords && !vPodmenijuShop && !vPodmenijuSpend) {
            let maxOpcije = 9;
            if (keyCode === UP_ARROW) { glavniMeniIzbira = (glavniMeniIzbira - 1 + maxOpcije) % maxOpcije; playMenuSound(); }
            if (keyCode === DOWN_ARROW) { glavniMeniIzbira = (glavniMeniIzbira + 1) % maxOpcije; playMenuSound(); }
            if (glavniMeniIzbira === 0) {
                if (keyCode === LEFT_ARROW) {
                    selectedMode = (selectedMode - 1 + modes.length) % modes.length;
                    if (modes[selectedMode] === "Daily Challenge") selectedMode = (selectedMode - 1 + modes.length) % modes.length;
                    playMenuSound();
                }
                if (keyCode === RIGHT_ARROW) {
                    selectedMode = (selectedMode + 1) % modes.length;
                    if (modes[selectedMode] === "Daily Challenge") selectedMode = (selectedMode + 1) % modes.length;
                    playMenuSound();
                }
            }
            if (keyCode === 32 || keyCode === ENTER) {
                activateMainMenuOption();
            }
            // V = open death replay browser from main menu
            if ((key === 'v' || key === 'V') && savedReplays.length > 0) {
                vPodmenijuReplays = true;
                selectedReplayIdx = 0;
                playMenuSound();
            }
        } else if (vPodmenijuRecords) {
            if (keyCode === ESCAPE || keyCode === BACKSPACE) vPodmenijuRecords = false;
        } else if (vPodmenijuSpend) {
            if (keyCode === ESCAPE || keyCode === BACKSPACE) { vPodmenijuSpend = false; gambleResult = null; }
            if (keyCode === LEFT_ARROW) { spendTab = (spendTab - 1 + 4) % 4; spendIzbira = 0; playMenuSound(); }
            if (keyCode === RIGHT_ARROW) { spendTab = (spendTab + 1) % 4; spendIzbira = 0; playMenuSound(); }
            handleSpendKeys();
        } else if (vPodmenijuShop) {
            if (keyCode === ESCAPE || keyCode === BACKSPACE) vPodmenijuShop = false;
            if (keyCode === LEFT_ARROW) { shopKategorija = (shopKategorija - 1 + 4) % 4; shopIzbira = 0; shopScroll = 0; playMenuSound(); }
            if (keyCode === RIGHT_ARROW) { shopKategorija = (shopKategorija + 1) % 4; shopIzbira = 0; shopScroll = 0; playMenuSound(); }

            let artikli = shopKategorija === 0 ? shopSkins :
                          shopKategorija === 1 ? shopBackgrounds :
                          shopKategorija === 2 ? shopAccessories :
                          getExclusiveItems();

            if (keyCode === UP_ARROW) { shopIzbira = (shopIzbira - 1 + Math.max(1, artikli.length)) % Math.max(1, artikli.length); playMenuSound(); }
            if (keyCode === DOWN_ARROW) { shopIzbira = (shopIzbira + 1) % Math.max(1, artikli.length); playMenuSound(); }

            if ((keyCode === ENTER || keyCode === 32) && artikli.length > 0) {
                activateShopItem(artikli[shopIzbira]);
            }
        }
    } else if (deathReplay) {
        // Death replay has its own input layer: ESC must always exit it.
        if (keyCode === ESCAPE || key === "Escape" || key === "Esc") {
            deathReplay = false;
            deathReplayIndex = 0;
            if (replayFromMenu) { menu = true; vPodmenijuReplays = true; }
            else { menu = false; gameOver = true; }
            if (soundEnabled) tryStartMusic();
            return;
        }
        // Replay speed: 5 = 0.5x, 1 = 1x, 2 = 2x.
        if (key === "5") { deathReplaySpeed = 0.5; return; }
        if (key === "1") { deathReplaySpeed = 1; return; }
        if (key === "2") { deathReplaySpeed = 2; return; }
        // While watching a replay, arrows scrub through frames.
        if (keyCode === LEFT_ARROW || keyCode === UP_ARROW) {
            deathReplayForward = false;
            deathReplayIndex = Math.max(0, deathReplayIndex - 1);
            return;
        }
        if (keyCode === RIGHT_ARROW || keyCode === DOWN_ARROW) {
            deathReplayForward = true;
            deathReplayIndex = Math.min(Math.max(0, deathReplayFrames.length - 1), deathReplayIndex + 1);
            return;
        }
    } else if (gameOver || winScreen || gdWon || (gameMode === "Platformer" && plrWon)) {
        // After death/win, start a fresh game with SPACE, W, or any arrow key.
        if (keyCode === 32 || key === 'w' || key === 'W' ||
            keyCode === UP_ARROW || keyCode === DOWN_ARROW ||
            keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
            if (gameMode === "Platformer" && (plrFromBuilder || levelBuilder.testing)) {
                startPlatformerFromBuilder();
                return false;
            }
            if (gameMode === "Platformer" && plrWon) {
                if (currentPlatformerLevel < totalPlatformerLevels - 1) {
                    initPlatformer(currentPlatformerLevel + 1); plrWon = false; gameOver = false;
                } else resetGame();
            } else resetGame();
            return false;
        }
        if ((key === 'r' || key === 'R') && gameOver && gameMode !== "Platformer") {
            tryRevive();
        }
        if ((key === 'p' || key === 'P') && gameOver && savedReplays.length > 0) {
            playSavedReplay(0, false); // newest
        }
        if ((key === 'v' || key === 'V') && gameOver && savedReplays.length > 0) {
            menu = true;
            vPodmenijuReplays = true;
            selectedReplayIdx = 0;
            if (soundEnabled) tryStartMusic();
        }
        if (keyCode === ESCAPE) {
            if (tutorialPractice) {
                tutorialPractice = false;
            tutorialPracticeAI = false;
                tutorialPracticeDone = false;
                tutorialActive = false;
                localStorage.setItem("tutorialDone", "true");
            }
            menu = true; winScreen = false; plrWon = false; stopAmbient(); deathReplay = false;
            isDailyChallenge = false; watchingAI = false; frameRate(30);
        }
    } else if (gameMode === "Tower Climb") {
        if (keyCode === ESCAPE) { menu = true; gameOver = false; stopAmbient(); deathReplay = false; return; }
        if (keyCode === 32 && gameOver) { resetGame(); return; }
        if (keyCode === 80) pavza = !pavza;
    } else if (gameMode === "Platformer") {
        if (keyCode === ESCAPE) {
            if (plrFromBuilder || levelBuilder.testing) {
                menu = true;
                vPodmenijuLevelBuilder = true;
                levelBuilder.inEditor = true;
                levelBuilder.testing = false;
                plrFromBuilder = false;
                gameOver = false;
                plrWon = false;
                frameRate(30);
            } else {
                menu = true;
            }
            stopAmbient(); deathReplay = false;
            return;
        }
        // Queue input for ball / swing / spider (tap to flip)
        if ((plrVehicle === "swing" || plrVehicle === "ball" || plrVehicle === "spider") &&
            (key === 'w' || key === 'W' || keyCode === UP_ARROW || keyCode === 32)) {
            plrInputQueued = true;
        }
        if (keyCode === 80) pavza = !pavza; // P = pause
    } else if (isGDGameMode() || (typeof gameMode === "string" && gameMode.startsWith("GD "))) {
        if (keyCode === ESCAPE) {
            const fromBuilder = (gameMode === "GD Builder Test" || levelBuilder.testing);
            menu = true; gdWon = false; gameOver = false; deathReplay = false;
            gdCube = null; gdObstacles = []; gdScroll = 0; gdStarted = false; gdSwingLatch = false; gdSwingInputQueued = false; gdBallInputQueued = false; gdBallGravity = 1; gdGravityDir = 1;
            gdPlatformerMode = false;
            levelBuilder.testing = false;
            if (watchingAI || gdAIPilot) {
                watchingAI = false;
                gdAIPilot = false;
                vPodmenijuAILab = true;
            } else if (fromBuilder) {
                vPodmenijuLevelBuilder = true;
                levelBuilder.inEditor = true;
            }
            stopAmbient();
            return;
        }
        if ((gdVehicle === "swing" || gdVehicle === "ball" || gdVehicle === "spider") &&
            (key === 'w' || key === 'W' || keyCode === UP_ARROW || keyCode === 32)) {
            if (gdVehicle === "swing" || gdVehicle === "spider") gdSwingInputQueued = true;
            else gdBallInputQueued = true;
            gdStarted = true;
        }
        if (keyCode === 32 && (gameOver || gdWon) && gdVehicle !== "swing" && gdVehicle !== "spider") { resetGame(); }
    } else {
        if (gameMode === "Multiplayer") {
            if (keyCode === UP_ARROW) { nextDirX = 0; nextDirY = -1; }
            else if (keyCode === DOWN_ARROW) { nextDirX = 0; nextDirY = 1; }
            else if (keyCode === LEFT_ARROW) { nextDirX = -1; nextDirY = 0; }
            else if (keyCode === RIGHT_ARROW) { nextDirX = 1; nextDirY = 0; }
            else if (key === 'w' || key === 'W') { p2NextDirX = 0; p2NextDirY = -1; }
            else if (key === 's' || key === 'S') { p2NextDirX = 0; p2NextDirY = 1; }
            else if (key === 'a' || key === 'A') { p2NextDirX = -1; p2NextDirY = 0; }
            else if (key === 'd' || key === 'D') { p2NextDirX = 1; p2NextDirY = 0; }
            else if (keyCode === 32) pavza = !pavza;
            else if (keyCode === ESCAPE) { menu = true; gameOver = false; player2 = null; stopAmbient(); }
            return false;
        }
        if (gameMode === "Chaos") return;
        if (gameMode === "AI Mode" || watchingAI) {
            if (keyCode === 32) pavza = !pavza;
            if (keyCode === ESCAPE) { menu = true; watchingAI = false; isDailyChallenge = false; stopAmbient(); deathReplay = false; }
            return;
        }
        if (hasEffect("FREEZE")) return;
        if (keyCode === UP_ARROW) { nextDirX = 0; nextDirY = -1; }
        else if (keyCode === DOWN_ARROW) { nextDirX = 0; nextDirY = 1; }
        else if (keyCode === LEFT_ARROW) { nextDirX = -1; nextDirY = 0; }
        else if (keyCode === RIGHT_ARROW) { nextDirX = 1; nextDirY = 0; }
        else if (keyCode === 32) pavza = !pavza;
        else if ((key === 'r' || key === 'R') && pavza) { resetGame(); } // quick restart while paused
        else if (keyCode === ESCAPE) {
            if (tutorialPractice) {
                tutorialPractice = false;
            tutorialPracticeAI = false;
                tutorialPracticeDone = false;
                tutorialActive = false;
                localStorage.setItem("tutorialDone", "true");
            }
            menu = true; isDailyChallenge = false; watchingAI = false; stopAmbient(); deathReplay = false;
            vPodmenijuBuilder = false; vPodmenijuReplays = false;
        }
    }
}

function keyReleased() {
    if (keyCode === SHIFT || keyCode === 16) builderShiftHeld = false;
    if ((gdVehicle === "swing" || gdVehicle === "spider") && (keyCode === 32 || keyCode === UP_ARROW || keyCode === 87)) gdSwingLatch = false;
}
