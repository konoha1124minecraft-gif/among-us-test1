export type GamePhase = "title" | "lobby" | "playing" | "meeting" | "gameover";

export type TeamFaction = "crew" | "impostor" | "neutral";

export type RoleId =
  | "crewmate"
  | "impostor"
  | "sheriff"
  | "engineer"
  | "doctor"
  | "detective"
  | "radar"
  | "mayor"
  | "security"
  | "tracker"
  | "teleporter"
  | "psychic"
  | "phantom"
  | "madscientist"
  | "viper"
  | "shapeshifter"
  | "jester"
  | "jackal"
  | "arsonist"
  | "survivor"
  | "executioner";

export interface RoleDef {
  id: RoleId;
  name: string;
  jp: string;
  team: TeamFaction;
  color: string;
  desc: string;
  balance: string;
  tip: string;
}

export type MapCategory =
  | "station"
  | "research"
  | "industrial"
  | "nature"
  | "labyrinth";

export type MapSizeTag = "small" | "medium" | "large";

export type TaskDifficultyMode = "NORMAL" | "HARD" | "EXTREME";

export type TaskMechanicFamily =
  | "wires"
  | "keypad"
  | "slider_match"
  | "sequence_memory"
  | "asteroid_shoot"
  | "gauge_hold"
  | "sample_analyze"
  | "dial_align"
  | "grid_toggle"
  | "trash_sort"
  | "pipe_rotate"
  | "rhythm_sync"
  | "maze_trace"
  | "radar_lock"
  | "cipher_decode";

export type IntegratedFixtureType =
  | "panel_box"
  | "console_screen"
  | "bio_vat"
  | "valve_pipe"
  | "reactor_core"
  | "radar_dish"
  | "cargo_rack"
  | "holo_table"
  | "turret_mount"
  | "chute_hatch";

export interface TaskDef {
  id: string;
  name: string;
  category: TaskMechanicFamily;
  categoryLabel: string;
  type: TaskMechanicFamily;
  fixtureType: IntegratedFixtureType;
  length: "common" | "short" | "long";
  steps: number;
  desc: string;
  difficultyWeight: number;
  variantIndex: number;
  variantConfig?: {
    targetCode?: string;
    wireCount?: number;
    targetCount?: number;
    seqLength?: number;
    gridSize?: number;
    cipherHint?: string;
    cipherAnswer?: string;
    freqTargets?: number[];
    rhythmBeats?: number;
    pipeSize?: number;
  };
}

export interface RoomRect {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  floor?: number;
  floorStyle?: "metal" | "tile" | "lab" | "cargo" | "cyber" | "carpet" | "stone" | "garden";
}

export interface CorridorRect {
  x: number;
  y: number;
  w: number;
  h: number;
  floor?: number;
}

export interface VentNode {
  id: string;
  x: number;
  y: number;
  links: number[];
  floor?: number;
}

export interface TaskSpot {
  x: number;
  y: number;
  taskId: string;
  floor?: number;
  wallAttached?: boolean;
}

export interface ObstacleRect {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: "table_round" | "table_rect" | "crate" | "server" | "reactor" | "tank" | "rock" | "console";
  floor?: number;
}

export interface DecorRect {
  x: number;
  y: number;
  w: number;
  h: number;
  kind:
    | "window"
    | "med_scanner"
    | "med_bed"
    | "turret"
    | "caution"
    | "pipes"
    | "carpet"
    | "altar"
    | "server_wall"
    | "camera_prop";
  floor?: number;
}

export interface GimmickNode {
  type:
    | "stairs"
    | "teleport"
    | "camera"
    | "vitals"
    | "doorlog"
    | "speed_pad"
    | "conveyor"
    | "ice"
    | "wind"
    | "door_control"
    | "steam_valve"
    | "meteor_console"
    | "hide_canopy"
    | "gravity_well"
    | "laser_gate"
    | "cloak_pad"
    | "decontam_chamber";
  x: number;
  y: number;
  w?: number;
  h?: number;
  vx?: number;
  vy?: number;
  floor?: number;
  targetX?: number;
  targetY?: number;
  targetFloor?: number;
  label: string;
  icon?: string;
}

export type MapUniqueGimmickType =
  | "vent_network"
  | "orbit_turret"
  | "airlock_decontam"
  | "multi_deck"
  | "gravity_shift"
  | "reactor_venting"
  | "quantum_warp"
  | "laser_grid"
  | "flicker_lights"
  | "bio_sensor"
  | "ice_floor"
  | "mag_conveyor"
  | "steam_vents"
  | "slag_heat"
  | "zero_g_lane"
  | "forest_cloak"
  | "wind_current"
  | "blizzard_storm"
  | "crystal_echo"
  | "ocean_pressure"
  | "cyber_cloak"
  | "oneway_warp"
  | "mirror_sector"
  | "timed_bulkhead"
  | "labyrinth_shift";

export interface MapDef {
  id: string;
  name: string;
  subtitle: string;
  category: MapCategory;
  sizeTag: MapSizeTag;
  uniqueGimmick: MapUniqueGimmickType;
  gimmickSummary: string;
  recommendedPlayers: string;
  accent: string;
  bg: string;
  corridorFill: string;
  wallColor?: string;
  exteriorTheme?: "space" | "snow" | "lava" | "cyber" | "crystal" | "desert" | "jungle" | "moon" | "ocean" | "clouds";
  hasMultiFloor?: boolean;
  isLowGravity?: boolean;
  isDarkFog?: boolean;
  hasBlizzard?: boolean;
  rooms: RoomRect[];
  corridors: CorridorRect[];
  emergency: { x: number; y: number; floor?: number };
  sabotageFix: {
    lights: { x: number; y: number; floor?: number; label: string };
    reactor: { x: number; y: number; floor?: number; label: string };
    gas: { x: number; y: number; floor?: number; label: string };
  };
  vents: VentNode[];
  taskSpots: TaskSpot[];
  obstacles: ObstacleRect[];
  decors: DecorRect[];
  gimmicks: GimmickNode[];
}

export interface CosmeticBaseDef {
  id: string;
  name: string;
  priceBeans?: number;
  free?: boolean;
  theme?: "starter" | "shop" | "halloween" | "christmas" | "bundle" | "cube";
  unlockReq?: string;
}

export interface VisorDef extends CosmeticBaseDef {
  desc: string;
}

export interface NameplateDef extends CosmeticBaseDef {
  bgGradient: string;
  borderColor: string;
  accentEmoji: string;
  desc: string;
}

export interface CosmicubeNodeDef {
  id: string;
  title: string;
  costBeans: number;
  rewardKind: "hat" | "skin" | "visor" | "pet" | "nameplate";
  rewardId: string;
  parentId: string | null;
  xPct: number;
  yPct: number;
}

export interface CosmicubeDef {
  id: string;
  name: string;
  subtitle: string;
  priceBeans: number;
  accent: string;
  icon: string;
  nodes: CosmicubeNodeDef[];
}

export interface KillCutInData {
  open: boolean;
  killerName: string;
  killerColor: string;
  killerHat: string;
  killerSkin: string;
  killerVisor: string;
  victimName: string;
  victimColor: string;
  victimHat: string;
  victimSkin: string;
  victimVisor: string;
  weaponKind: "knife" | "gun" | "tongue";
}

export interface BeanRewardBreakdown {
  base: number;
  tasks: number;
  kills: number;
  ejects: number;
  win: number;
  multiplier: number;
  totalBeans: number;
  xpEarned: number;
  leveledUp: boolean;
  newLevel: number;
  forfeited: boolean;
}

export interface PlayerState {
  id: string;
  name: string;
  color: string;
  hat: string;
  pet: string;
  skin: string;
  visor?: string;
  nameplate?: string;
  killEffect: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  floor: number;
  facing: 1 | -1;
  alive: boolean;
  role: RoleId;
  isAI: boolean;
  isHost: boolean;
  isSpectator?: boolean;
  inVent: boolean;
  ventIndex: number;
  shielded: boolean;
  shieldTimer: number;
  invisible: boolean;
  invisibleTimer: number;
  cloakZone?: boolean;
  doused: boolean;
  disguisedAs: { name: string; color: string; hat: string } | null;
  disguiseTimer: number;
  executionerTargetId: string | null;
  tasks: string[];
  completedTasks: Record<string, boolean>;
  hasMoved?: boolean;
  lastTeleportAt?: number;
  postWarpGraceSec?: number;
  petX?: number;
  petY?: number;
  pingMs?: number;
}

export interface DeadBody {
  id: string;
  playerId: string;
  name: string;
  color: string;
  x: number;
  y: number;
  floor: number;
  dissolveTimer: number | null;
  killerId: string;
  killedAt: number;
}

export interface SabotageState {
  type: "lights" | "reactor" | "gas" | "doors";
  timer: number;
  maxTimer: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  color: string;
  text: string;
  isGhost: boolean;
  isSystem: boolean;
  stampId?: string;
  ts: number;
}

export interface DoorLogEntry {
  id: string;
  playerName: string;
  colorHex: string;
  location: string;
  timeText: string;
}

export interface TimelineEntry {
  id: string;
  timeLabel: string;
  text: string;
}

export interface GameSettings {
  mapId: string;
  impostorCount: number;
  maxPlayers: number;
  killCooldown: number;
  emergencyMeetings: number;
  meetingTime: number;
  playerSpeed: number;
  crewVision: number;
  impostorVision: number;
  tasksPerPlayer: number;
  taskDifficulty: TaskDifficultyMode;
  enableMapGimmicks: boolean;
  anonymousVoting: boolean;
  confirmEjects: boolean;
  allowSpectators: boolean;
  enableExtraRoles: boolean;
  enabledRoles: Record<string, boolean>;
  cameraBatteryLimit: boolean;
  inGameChat: boolean;
  roomPublic: boolean;
  aiCount: number;
  aiDifficulty: "easy" | "normal" | "hard";
}

export interface HudSettings {
  showNavArrows: boolean;
  showTaskList: boolean;
}

export interface Keybinds {
  moveUp: string;
  moveDown: string;
  moveLeft: string;
  moveRight: string;
  use: string;
  report: string;
  kill: string;
  vent: string;
  sabotage: string;
  ability: string;
  map: string;
}

export interface ProgressionData {
  beans: number;
  xp: number;
  level: number;
  unlockedItems: string[];
  unlockedCubes: string[];
  activeCubeId: string | null;
  unlockedCubeNodes: string[];
  matchesPlayed: number;
  crewWins: number;
  impostorWins: number;
  neutralWins: number;
  totalTasks: number;
  totalKills: number;
  correctEjects: number;
  ghostAssists: number;
  chatsSent: number;
  firstBodyReports: number;
  shadowAssassins: number;
  perfectTaskWins: number;
  closeCallSaves: number;
  maxEjectsInMatch: number;
  fastestCrewWinSec: number | null;
  uniqueCosmeticsUsed: string[];
  customFullLoadoutMatches: number;
  unlockedAchievements: string[];
  sandboxUnlockAll: boolean;
}

export interface ChangelogEntry {
  readonly version: string;
  readonly date: string;
  readonly guardId?: string;
  readonly category: "BUGFIX" | "SECURITY" | "FEATURE" | "NETWORK" | "BALANCE";
  readonly title: string;
  readonly summary: string;
  readonly details: readonly string[];
}

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  source: string;
  severity: "ERROR" | "WARN" | "NETWORK";
  message: string;
  stack?: string;
  context?: string;
}

export interface TutorialStepDef {
  step: number;
  title: string;
  objective: string;
  hint: string;
}

export interface PublicRoomSummary {
  roomCode: string;
  hostName: string;
  mapId: string;
  mapName: string;
  playerCount: number;
  maxPlayers: number;
  phase: string;
  allowSpectators: boolean;
  createdAt?: number;
}
