import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameHud } from "./components/GameHud";
import { LobbyCustomizeModal } from "./components/LobbyCustomizeModal";
import { LobbyScreen } from "./components/LobbyScreen";
import { MapSelectorModal } from "./components/MapSelectorModal";
import {
  AchievementsModal,
  KeybindsModal,
  MapModal,
  MeetingModal,
  RolesGuideModal,
  SabotageModal,
  SettingsModal,
  TerminalModal,
} from "./components/Modals";
import {
  AchievementToastOverlay,
  EjectionOverlay,
  GameOverOverlay,
  KillCutInOverlay,
  KillFlashOverlay,
  ReportCutInOverlay,
  RoleRevealOverlay,
} from "./components/Overlays";
import { ShopAndCubesModal } from "./components/ShopAndCubesModal";
import { TaskModal } from "./components/TaskModal";
import { TitleScreen } from "./components/TitleScreen";
import { TutorialAndRulesModal } from "./components/TutorialAndRulesModal";
import { soundEngine } from "./game/audio";
import { LOBBY_CUSTOMIZE_TERMINAL, drawLobbyDeck, renderGameCanvas } from "./game/canvasRenderer";
import {
  ACHIEVEMENTS,
  DEFAULT_HUD_SETTINGS,
  DEFAULT_KEYBINDS,
  DEFAULT_SETTINGS,
  FB,
  P2P_ICE_CONFIG,
  PLAYER_COLORS,
  ROLES,
  calculateMatchBeanRewards,
  canUseVentRole,
  getXpForNextLevel,
  hasTasksRole,
  isCrewRole,
  isImpostorRole,
  isNeutralRole,
  loadProgression,
  makeItemKey,
  saveProgression,
  FirebasePeer,
  type FirebaseDataConn,
} from "./game/constants";
import {
  type AiLocomotionState,
  type CameraFeedPoint,
  PLAYER_BASE_SPEED,
  assignNextAiTarget,
  assignRoles,
  assignTasks,
  buildMapCameraFeeds,
  buildMapDoorBlockers,
  buildWallSegments,
  checkWinCondition,
  computeGimmickEffects,
  createDoorLogEntry,
  findNearbyInteractable,
  getGimmickKey,
  getRoomName,
  getSpawnPosition,
  getUseActionState,
  hasLineOfSight,
  moveWithSlide,
  resolveSafePos,
  sanitizeCameraPos,
  stepAiLocomotion,
  tallyVotes,
} from "./game/engine";
import { logGameError } from "./game/errorLogger";
import {
  buildPostSpawnCooldowns,
  buildTeleportSyncPatch,
  exponentialLerp,
  normalizeP2PPositionPacket,
  resolveMatchMapId,
  runRuntimeHealthCheck,
  validateAliveReporter,
} from "./game/guardsAndRegistry";
import { MAP_LIST, getMapById } from "./game/maps";
import { getTaskById } from "./game/tasks150";
import { TUTORIAL_STEPS, createTutorialInitialEntities } from "./game/tutorial";
import type {
  BeanRewardBreakdown,
  ChatMessage,
  CosmicubeNodeDef,
  DeadBody,
  DoorLogEntry,
  GamePhase,
  GameSettings,
  HudSettings,
  Keybinds,
  KillCutInData,
  MapDef,
  PlayerState,
  ProgressionData,
  SabotageState,
  TimelineEntry,
} from "./game/types";

interface PeerWin extends Window {
  Peer?: new (id?: string, opts?: unknown) => {
    id: string;
    on: (ev: string, cb: (arg?: unknown) => void) => void;
    connect: (peerId: string) => FirebaseDataConn;
    destroy: () => void;
  };
}

interface NetPacket {
  type: string;
  senderId?: string;
  [k: string]: unknown;
}

type AIBrain = AiLocomotionState;

const BOT_NAMES = [
  "ノヴァ",
  "オリオン",
  "セレス",
  "シリウス",
  "アルタイル",
  "ベガ",
  "リゲル",
  "デネブ",
  "スピカ",
  "カペラ",
];

function makeRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function makePlayerId(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function formatClock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function App() {
  const myIdRef = useRef<string>(makePlayerId());
  const myId = myIdRef.current;

  // Profile & Preferences
  const [myName, setMyName] = useState<string>(() => localStorage.getItem("starship_name") || "キャプテン");
  const [myColor, setMyColor] = useState<string>(() => localStorage.getItem("starship_color") || "cyan");
  const [myHat, setMyHat] = useState<string>(() => localStorage.getItem("starship_hat") || "none");
  const [myVisor, setMyVisor] = useState<string>(() => localStorage.getItem("starship_visor") || "none");
  const [myPet, setMyPet] = useState<string>(() => localStorage.getItem("starship_pet") || "none");
  const [mySkin, setMySkin] = useState<string>(() => localStorage.getItem("starship_skin") || "standard");
  const [myNameplate, setMyNameplate] = useState<string>(
    () => localStorage.getItem("starship_nameplate") || "none"
  );
  const [myKillEffect, setMyKillEffect] = useState<string>(
    () => localStorage.getItem("starship_killeffect") || "classic"
  );
  const [progression, setProgression] = useState<ProgressionData>(() => loadProgression());
  const [keybinds, setKeybinds] = useState<Keybinds>(() => {
    try {
      const raw = localStorage.getItem("starship_keybinds_v1");
      return raw ? { ...DEFAULT_KEYBINDS, ...JSON.parse(raw) } : { ...DEFAULT_KEYBINDS };
    } catch {
      return { ...DEFAULT_KEYBINDS };
    }
  });
  const [hudSettings, setHudSettings] = useState<HudSettings>(() => {
    try {
      const raw = localStorage.getItem("starship_hud_v1");
      return raw ? { ...DEFAULT_HUD_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_HUD_SETTINGS };
    } catch {
      return { ...DEFAULT_HUD_SETTINGS };
    }
  });
  const [audioCfg, setAudioCfg] = useState({
    bgmVolume: 0.22,
    sfxVolume: 0.45,
    bgmMuted: false,
    sfxMuted: false,
  });

  // Match & Lobby State
  const [phase, setPhase] = useState<GamePhase>("title");
  const [isHost, setIsHost] = useState(true);
  const [isOfflineAI, setIsOfflineAI] = useState(true);
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [networkStatus, setNetworkStatus] = useState("ローカル待機中");
  const [pingMs, setPingMs] = useState<number | null>(null);

  const [settings, setSettings] = useState<GameSettings>(() => ({ ...DEFAULT_SETTINGS }));
  const [activeMap, setActiveMap] = useState<MapDef>(() => getMapById("starship"));
  const [players, setPlayers] = useState<Record<string, PlayerState>>({});
  const [bodies, setBodies] = useState<DeadBody[]>([]);
  const [sabotage, setSabotage] = useState<SabotageState | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [doorLogs, setDoorLogs] = useState<DoorLogEntry[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [sabotageCooldown, setSabotageCooldown] = useState(0);
  const [killCooldown, setKillCooldown] = useState(0);
  const [abilityCooldown, setAbilityCooldown] = useState(0);
  const [ventCooldown, setVentCooldown] = useState(0);
  const [emergencyCooldown, setEmergencyCooldown] = useState(0);
  const [emergencyUsesLeft, setEmergencyUsesLeft] = useState(2);
  const [ghostCooldown, setGhostCooldown] = useState(0);
  const [doctorAbilityUsed, setDoctorAbilityUsed] = useState(false);
  const [engineerRemoteFixUsed, setEngineerRemoteFixUsed] = useState(false);
  const [survivorShieldsLeft, setSurvivorShieldsLeft] = useState(2);

  // Dynamic Match Extras
  const [gimmickStatusText, setGimmickStatusText] = useState<string | null>(null);
  const [cameraWatchTimer, setCameraWatchTimer] = useState(0);
  const [cameraFeedIndex, setCameraFeedIndex] = useState(0);
  const [cameraBatteryPct, setCameraBatteryPct] = useState(100);
  const [meteorActive, setMeteorActive] = useState(false);
  const [meteorTimer, setMeteorTimer] = useState(0);
  const [ventStayTimer, setVentStayTimer] = useState<number | null>(null);
  const [spectateTargetId, setSpectateTargetId] = useState<string | null>(null);
  const [steamActive, setSteamActive] = useState(false);
  const [doorsLockedTimer, setDoorsLockedTimer] = useState(0);
  const [radarTarget, setRadarTarget] = useState<{ x: number; y: number } | null>(null);
  const [trackerTargetId, setTrackerTargetId] = useState<string | null>(null);
  const [teleporterPad, setTeleporterPad] = useState<{ x: number; y: number; floor: number } | null>(null);

  // Tutorial State
  const [tutorialStep, setTutorialStep] = useState<number | null>(null);
  const tutorialFlagsRef = useRef({ killedDummy: false, vented: false });

  // Modals & Overlays
  const [openCustomize, setOpenCustomize] = useState(false);
  const [openShop, setOpenShop] = useState(false);
  const [openMapSelector, setOpenMapSelector] = useState(false);
  const [openTutorialModal, setOpenTutorialModal] = useState(false);
  const [openRolesGuide, setOpenRolesGuide] = useState(false);
  const [openKeybinds, setOpenKeybinds] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openAchievements, setOpenAchievements] = useState(false);
  const [openMapModal, setOpenMapModal] = useState(false);
  const [openSabotageModal, setOpenSabotageModal] = useState(false);
  const [terminalMode, setTerminalMode] = useState<"vitals" | "doorlog" | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  const [roleRevealOpen, setRoleRevealOpen] = useState(false);
  const [cutInState, setCutInState] = useState<{
    open: boolean;
    isBody: boolean;
    caller: string;
    victimName?: string;
    victimColor?: string;
  }>({ open: false, isBody: false, caller: "" });
  const [killCutIn, setKillCutIn] = useState<KillCutInData | null>(null);
  const [killFlash, setKillFlash] = useState(false);
  const [ejectionState, setEjectionState] = useState<{
    open: boolean;
    message: string;
    color?: string;
  }>({ open: false, message: "" });
  const [beanRewardState, setBeanRewardState] = useState<BeanRewardBreakdown | null>(null);
  const [gameOverState, setGameOverState] = useState<{
    open: boolean;
    winner: string;
    reason: string;
    newlyUnlocked: string[];
  }>({ open: false, winner: "crewmates", reason: "", newlyUnlocked: [] });
  const [toastTitle, setToastTitle] = useState<string | null>(null);
  const matchStatsRef = useRef({ tasksDone: 0, kills: 0, correctEjects: 0, rewardSettled: false });

  // Meeting State
  const [meetingInfo, setMeetingInfo] = useState<{
    title: string;
    reason: string;
    timer: number;
    votedPlayers: Record<string, boolean>;
    votes: Record<string, string>;
    voteCounts: Record<string, number> | null;
  }>({
    title: "",
    reason: "",
    timer: 90,
    votedPlayers: {},
    votes: {},
    voteCounts: null,
  });

  // Refs for High-Frequency Loop
  const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lobbyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysPressedRef = useRef<Set<string>>(new Set());
  const joystickRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const cameraTargetRef = useRef<{ x: number; y: number }>({ x: 990, y: 280 });
  const playersRef = useRef<Record<string, PlayerState>>({});
  const remoteTargetsRef = useRef<Record<string, { x: number; y: number; floor: number; facing: 1 | -1 }>>({});
  const bodiesRef = useRef<DeadBody[]>([]);
  const sabotageRef = useRef<SabotageState | null>(null);
  const activeMapRef = useRef<MapDef>(activeMap);
  const settingsRef = useRef<GameSettings>(settings);
  const phaseRef = useRef<GamePhase>(phase);
  const isHostRef = useRef<boolean>(isHost);
  const isOfflineAIRef = useRef<boolean>(isOfflineAI);
  const tutorialStepRef = useRef<number | null>(tutorialStep);
  const aiBrainsRef = useRef<Record<string, AIBrain>>({});
  const elapsedSecRef = useRef<number>(0);
  const healthGuardAccRef = useRef<number>(0);
  const gimmickCooldownsRef = useRef<Record<string, number>>({});
  const footprintsRef = useRef<{ x: number; y: number; color: string; floor: number; age: number }[]>([]);
  const killBurstsRef = useRef<
    { x: number; y: number; effectId: string; colorHex: string; startedAt: number; durationMs: number }[]
  >([]);
  const stepSoundCdRef = useRef(0);
  const doorLogZonesRef = useRef<Record<string, string>>({});

  // Networking Refs
  const peerRef = useRef<{ destroy?: () => void } | null>(null);
  const connsRef = useRef<Map<string, FirebaseDataConn>>(new Map());
  const fbRoomCodeRef = useRef<string>("");

  // Mutable Loop Refs (prevents 60fps RAF teardown/restart on HUD ticks)
  const keybindsRef = useRef<Keybinds>(keybinds);
  const activeTaskIdRef = useRef<string | null>(activeTaskId);
  const hudSettingsRef = useRef<HudSettings>(hudSettings);
  const visionRadiusRef = useRef<number>(300);
  const cameraSpotsRef = useRef<CameraFeedPoint[]>(buildMapCameraFeeds(activeMap));
  const mapDoorBlockersRef = useRef(buildMapDoorBlockers(activeMap));
  const cameraFeedIndexRef = useRef<number>(cameraFeedIndex);
  const cameraWatchTimerRef = useRef<number>(cameraWatchTimer);
  const cameraBatteryPctRef = useRef<number>(cameraBatteryPct);
  const doorsLockedTimerRef = useRef<number>(doorsLockedTimer);
  const meteorTimerRef = useRef<number>(meteorTimer);
  const ventStayTimerRef = useRef<number | null>(ventStayTimer);
  const radarTargetRef = useRef<{ x: number; y: number } | null>(radarTarget);
  const teleporterPadRef = useRef<{ x: number; y: number; floor: number } | null>(teleporterPad);
  const steamActiveRef = useRef<boolean>(steamActive);
  const trackerTargetIdRef = useRef<string | null>(trackerTargetId);
  const spectateTargetIdRef = useRef<string | null>(spectateTargetId);
  const taskCompletedCountRef = useRef<number>(0);
  const taskTotalCountRef = useRef<number>(0);

  // Sync Refs
  useEffect(() => {
    playersRef.current = players;
  }, [players]);
  useEffect(() => {
    bodiesRef.current = bodies;
  }, [bodies]);
  useEffect(() => {
    sabotageRef.current = sabotage;
  }, [sabotage]);
  useEffect(() => {
    activeMapRef.current = activeMap;
  }, [activeMap]);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);
  useEffect(() => {
    isOfflineAIRef.current = isOfflineAI;
  }, [isOfflineAI]);
  useEffect(() => {
    tutorialStepRef.current = tutorialStep;
  }, [tutorialStep]);
  useEffect(() => {
    keybindsRef.current = keybinds;
  }, [keybinds]);
  useEffect(() => {
    activeTaskIdRef.current = activeTaskId;
  }, [activeTaskId]);
  useEffect(() => {
    hudSettingsRef.current = hudSettings;
  }, [hudSettings]);
  useEffect(() => {
    cameraFeedIndexRef.current = cameraFeedIndex;
  }, [cameraFeedIndex]);
  useEffect(() => {
    cameraWatchTimerRef.current = cameraWatchTimer;
  }, [cameraWatchTimer]);
  useEffect(() => {
    cameraBatteryPctRef.current = cameraBatteryPct;
  }, [cameraBatteryPct]);
  useEffect(() => {
    doorsLockedTimerRef.current = doorsLockedTimer;
  }, [doorsLockedTimer]);
  useEffect(() => {
    meteorTimerRef.current = meteorTimer;
  }, [meteorTimer]);
  useEffect(() => {
    ventStayTimerRef.current = ventStayTimer;
  }, [ventStayTimer]);
  useEffect(() => {
    radarTargetRef.current = radarTarget;
  }, [radarTarget]);
  useEffect(() => {
    teleporterPadRef.current = teleporterPad;
  }, [teleporterPad]);
  useEffect(() => {
    steamActiveRef.current = steamActive;
  }, [steamActive]);
  useEffect(() => {
    trackerTargetIdRef.current = trackerTargetId;
  }, [trackerTargetId]);
  useEffect(() => {
    spectateTargetIdRef.current = spectateTargetId;
  }, [spectateTargetId]);

  // Persist Preferences
  useEffect(() => {
    localStorage.setItem("starship_name", myName);
  }, [myName]);
  useEffect(() => {
    localStorage.setItem("starship_color", myColor);
  }, [myColor]);
  useEffect(() => {
    localStorage.setItem("starship_hat", myHat);
  }, [myHat]);
  useEffect(() => {
    localStorage.setItem("starship_visor", myVisor);
  }, [myVisor]);
  useEffect(() => {
    localStorage.setItem("starship_pet", myPet);
  }, [myPet]);
  useEffect(() => {
    localStorage.setItem("starship_skin", mySkin);
  }, [mySkin]);
  useEffect(() => {
    localStorage.setItem("starship_nameplate", myNameplate);
  }, [myNameplate]);
  useEffect(() => {
    localStorage.setItem("starship_killeffect", myKillEffect);
  }, [myKillEffect]);
  useEffect(() => {
    localStorage.setItem("starship_keybinds_v1", JSON.stringify(keybinds));
  }, [keybinds]);
  useEffect(() => {
    localStorage.setItem("starship_hud_v1", JSON.stringify(hudSettings));
  }, [hudSettings]);
  useEffect(() => {
    saveProgression(progression);
  }, [progression]);

  useEffect(() => {
    soundEngine.setVolumes(audioCfg.bgmVolume, audioCfg.sfxVolume, audioCfg.bgmMuted, audioCfg.sfxMuted);
  }, [audioCfg]);

  useEffect(() => {
    if (phase === "playing") {
      setOpenCustomize(false);
      setOpenShop(false);
      soundEngine.startBgm("playing");
    } else if (phase === "meeting") {
      soundEngine.startBgm("meeting");
    } else {
      soundEngine.startBgm("idle");
    }
  }, [phase]);

  const showAchievementToast = useCallback((id: string) => {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (!a) return;
    setToastTitle(`${a.icon} ${a.title}`);
    setTimeout(() => setToastTitle(null), 3600);
  }, []);

  const unlockAchievements = useCallback(
    (ids: string[]) => {
      if (!ids.length) return [];
      const newly: string[] = [];
      setProgression((prev) => {
        const nextSet = new Set(prev.unlockedAchievements);
        for (const id of ids) {
          if (!nextSet.has(id)) {
            nextSet.add(id);
            newly.push(ACHIEVEMENTS.find((a) => a.id === id)?.title || id);
            showAchievementToast(id);
          }
        }
        return { ...prev, unlockedAchievements: [...nextSet] };
      });
      return newly;
    },
    [showAchievementToast]
  );

  const pushTimeline = useCallback((text: string) => {
    setTimeline((prev) => [
      ...prev,
      { id: `tl_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`, timeLabel: formatClock(elapsedSecRef.current), text },
    ]);
  }, []);

  const triggerKillCutIn = useCallback((killer: PlayerState | undefined, victim: PlayerState | undefined) => {
    if (!killer || !victim) return;
    soundEngine.playCutIn();
    const wk: KillCutInData["weaponKind"] =
      killer.killEffect === "supernova" || killer.role === "sheriff"
        ? "gun"
        : killer.role === "viper" || killer.role === "phantom"
          ? "tongue"
          : "knife";
    setKillCutIn({
      open: true,
      killerName: killer.name,
      killerColor: killer.color,
      killerHat: killer.hat || "none",
      killerSkin: killer.skin || "standard",
      killerVisor: killer.visor || "none",
      victimName: victim.name,
      victimColor: victim.color,
      victimHat: victim.hat || "none",
      victimSkin: victim.skin || "standard",
      victimVisor: victim.visor || "none",
      weaponKind: wk,
    });
    window.setTimeout(() => setKillCutIn(null), 2050);
  }, []);

  const concludeMatchWithResult = useCallback(
    (winner: string, reason: string, latestPlayers?: Record<string, PlayerState>, forfeited = false) => {
      const pMap = latestPlayers || playersRef.current;
      const curMe = pMap[myId];
      const won =
        !!curMe &&
        !curMe.isSpectator &&
        ((winner === "crewmates" && isCrewRole(curMe.role)) ||
          (winner === "impostors" && isImpostorRole(curMe.role)) ||
          curMe.role === winner);

      const newly: string[] = [];
      if (!matchStatsRef.current.rewardSettled) {
        matchStatsRef.current.rewardSettled = true;
        const stats = matchStatsRef.current;
        const breakdown = calculateMatchBeanRewards({
          won,
          tasksDone: stats.tasksDone,
          kills: stats.kills,
          correctEjects: stats.correctEjects,
          currentLevel: progression.level,
          currentXp: progression.xp,
          forfeited,
        });
        setBeanRewardState(breakdown);

        if (!forfeited) {
          setProgression((prev) => {
            let nextXp = prev.xp + breakdown.xpEarned;
            let nextLv = prev.level;
            while (nextXp >= getXpForNextLevel(nextLv)) {
              nextXp -= getXpForNextLevel(nextLv);
              nextLv += 1;
            }
            const nextMatches = prev.matchesPlayed + 1;
            const nextCrewWins =
              prev.crewWins + (winner === "crewmates" && curMe && isCrewRole(curMe.role) ? 1 : 0);
            const nextImpWins =
              prev.impostorWins + (winner === "impostors" && curMe && isImpostorRole(curMe.role) ? 1 : 0);
            const nextNeutralWins = prev.neutralWins + (curMe && isNeutralRole(curMe.role) && won ? 1 : 0);
            const nextFastest =
              winner === "crewmates" && curMe && isCrewRole(curMe.role)
                ? prev.fastestCrewWinSec === null
                  ? Math.round(elapsedSecRef.current)
                  : Math.min(prev.fastestCrewWinSec, Math.round(elapsedSecRef.current))
                : prev.fastestCrewWinSec;

            const achIds: string[] = ["first_match"];
            if (nextCrewWins >= 1) achIds.push("crew_win_1");
            if (nextImpWins >= 1) achIds.push("imp_win_1");
            if (nextImpWins >= 3) achIds.push("imp_master");
            if (nextNeutralWins >= 1) achIds.push("neutral_win_1");
            if (nextNeutralWins >= 3) achIds.push("third_assassin");
            if (nextMatches >= 3) achIds.push("survivor_5");
            if (nextMatches >= 10) achIds.push("veteran_crew");
            if (activeMapRef.current.hasMultiFloor && won) achIds.push("multi_floor");
            if (nextFastest !== null && nextFastest <= 180) achIds.push("speedrunner");
            if (stats.correctEjects >= 2 || prev.correctEjects >= 5) achIds.push("great_detective");

            const nextSet = new Set(prev.unlockedAchievements);
            for (const id of achIds) {
              if (!nextSet.has(id)) {
                nextSet.add(id);
                const title = ACHIEVEMENTS.find((a) => a.id === id)?.title || id;
                newly.push(title);
                showAchievementToast(id);
              }
            }

            return {
              ...prev,
              beans: prev.beans + breakdown.totalBeans,
              xp: nextXp,
              level: nextLv,
              matchesPlayed: nextMatches,
              crewWins: nextCrewWins,
              impostorWins: nextImpWins,
              neutralWins: nextNeutralWins,
              fastestCrewWinSec: nextFastest,
              unlockedAchievements: [...nextSet],
            };
          });
        }
      }

      if (!forfeited) {
        setGameOverState({ open: true, winner, reason, newlyUnlocked: newly });
        setPhase("gameover");
      }
    },
    [myId, progression.level, progression.xp, showAchievementToast]
  );

  const broadcastPacket = useCallback((pkt: NetPacket, excludePeer?: string) => {
    if (isOfflineAIRef.current) return;
    const msg = { ...pkt, senderId: myId };
    connsRef.current.forEach((conn, pid) => {
      if (pid === excludePeer) return;
      if (conn.open) {
        try {
          conn.send(msg);
        } catch (err) {
          logGameError("App.broadcastPacket", err, "NETWORK");
        }
      }
    });
  }, [myId]);

  const cleanupNetwork = useCallback(() => {
    if (fbRoomCodeRef.current) {
      void FB.removePublicRoom(fbRoomCodeRef.current);
      fbRoomCodeRef.current = "";
    }
    connsRef.current.forEach((c) => {
      try {
        c.close();
      } catch {
        // ignore
      }
    });
    connsRef.current.clear();
    if (peerRef.current?.destroy) {
      try {
        peerRef.current.destroy();
      } catch {
        // ignore
      }
    }
    peerRef.current = null;
    setPingMs(null);
  }, []);

  useEffect(() => cleanupNetwork, [cleanupNetwork]);

  // Self state helper
  const me: PlayerState = useMemo(() => {
    return (
      players[myId] || {
        id: myId,
        name: myName,
        color: myColor,
        hat: myHat,
        visor: myVisor,
        nameplate: myNameplate,
        pet: myPet,
        skin: mySkin,
        killEffect: myKillEffect,
        x: 340,
        y: 170,
        vx: 0,
        vy: 0,
        floor: 1,
        facing: 1,
        alive: true,
        role: "crewmate",
        isAI: false,
        isHost,
        inVent: false,
        ventIndex: -1,
        shielded: false,
        shieldTimer: 0,
        invisible: false,
        invisibleTimer: 0,
        doused: false,
        disguisedAs: null,
        disguiseTimer: 0,
        executionerTargetId: null,
        tasks: [],
        completedTasks: {},
      }
    );
  }, [players, myId, myName, myColor, myHat, myVisor, myNameplate, myPet, mySkin, myKillEffect, isHost]);

  // Calculate Vision & Task Progress
  const visionRadius = useMemo(() => {
    if (!me.alive || me.isSpectator) return 560;
    const base = isImpostorRole(me.role)
      ? 350 * settings.impostorVision
      : 270 * settings.crewVision;
    const sabScale = sabotage?.type === "lights" && !isImpostorRole(me.role) ? 0.44 : 1;
    const gFx = computeGimmickEffects({
      x: me.x,
      y: me.y,
      floor: me.floor || 1,
      mapDef: activeMap,
      enabled: settings.enableMapGimmicks,
      elapsedSec: elapsedSecRef.current,
    });
    return Math.max(105, Math.round(base * sabScale * gFx.visionScale));
  }, [me, settings.impostorVision, settings.crewVision, settings.enableMapGimmicks, sabotage, activeMap]);

  const { taskCompletedCount, taskTotalCount } = useMemo(() => {
    let total = 0;
    let done = 0;
    Object.values(players).forEach((p) => {
      if (p.isSpectator || !hasTasksRole(p.role)) return;
      total += p.tasks.length;
      p.tasks.forEach((tid) => {
        if (p.completedTasks[tid]) done++;
      });
    });
    return { taskCompletedCount: done, taskTotalCount: total };
  }, [players]);

  const cameraSpots = useMemo(() => buildMapCameraFeeds(activeMap), [activeMap]);

  const mapDoorBlockers = useMemo(() => buildMapDoorBlockers(activeMap), [activeMap]);

  useEffect(() => {
    visionRadiusRef.current = visionRadius;
  }, [visionRadius]);
  useEffect(() => {
    cameraSpotsRef.current = cameraSpots;
    setCameraFeedIndex(0);
    cameraFeedIndexRef.current = 0;
  }, [cameraSpots]);
  useEffect(() => {
    mapDoorBlockersRef.current = mapDoorBlockers;
  }, [mapDoorBlockers]);
  useEffect(() => {
    taskCompletedCountRef.current = taskCompletedCount;
    taskTotalCountRef.current = taskTotalCount;
  }, [taskCompletedCount, taskTotalCount]);

  // Sync local customize changes into lobby player object
  const updateMyLobbyAppearance = useCallback(
    (patch: Partial<PlayerState>) => {
      setPlayers((prev) => {
        const cur = prev[myId];
        if (!cur) return prev;
        const next = { ...cur, ...patch };
        broadcastPacket({ type: "player_patch", id: myId, patch });
        return { ...prev, [myId]: next };
      });
    },
    [myId, broadcastPacket]
  );

  /* ------------------------------------------------------------------------ */
  /* Match Initialization (AI Solo / Online Host)                             */
  /* ------------------------------------------------------------------------ */

  const startMatchAsHost = useCallback(() => {
    soundEngine.unlock();
    soundEngine.playClick();
    // GUARD_05: Resolve random / explicit mapId reliably
    const resolvedMapId = resolveMatchMapId(
      settings.mapId,
      MAP_LIST.map((m) => m.id)
    );
    const chosenMap = getMapById(resolvedMapId);
    setActiveMap(chosenMap);
    activeMapRef.current = chosenMap;

    const curPlayers = { ...playersRef.current };
    if (isOfflineAI) {
      const usedColors = new Set([myColor]);
      const availableColors = PLAYER_COLORS.map((c) => c.id).filter((id) => !usedColors.has(id));
      const nextPlayers: Record<string, PlayerState> = {
        [myId]: {
          ...curPlayers[myId],
          id: myId,
          name: myName || "キャプテン",
          color: myColor,
          hat: myHat,
          visor: myVisor,
          nameplate: myNameplate,
          pet: myPet,
          skin: mySkin,
          killEffect: myKillEffect,
          isAI: false,
          isHost: true,
        },
      };
      for (let i = 0; i < settings.aiCount; i++) {
        const botId = `bot_${i + 1}`;
        const col = availableColors[i % availableColors.length] || "blue";
        nextPlayers[botId] = {
          id: botId,
          name: `${BOT_NAMES[i % BOT_NAMES.length]} (AI)`,
          color: col,
          hat: "none",
          visor: "none",
          nameplate: "none",
          pet: "none",
          skin: "standard",
          killEffect: "classic",
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          floor: 1,
          facing: 1,
          alive: true,
          role: "crewmate",
          isAI: true,
          isHost: false,
          inVent: false,
          ventIndex: -1,
          shielded: false,
          shieldTimer: 0,
          invisible: false,
          invisibleTimer: 0,
          doused: false,
          disguisedAs: null,
          disguiseTimer: 0,
          executionerTargetId: null,
          tasks: [],
          completedTasks: {},
        };
      }
      Object.assign(curPlayers, nextPlayers);
      Object.keys(curPlayers).forEach((k) => {
        if (!nextPlayers[k]) delete curPlayers[k];
      });
    }

    const activeIds = Object.values(curPlayers)
      .filter((p) => !p.isSpectator)
      .map((p) => p.id);
    const { roles, executionerTargets } = assignRoles(activeIds, settings.impostorCount, settings);

    const populated: Record<string, PlayerState> = {};
    const total = activeIds.length;
    let spawnIdx = 0;
    for (const [id, p] of Object.entries(curPlayers)) {
      const sp = getSpawnPosition(spawnIdx++, total, chosenMap);
      populated[id] = {
        ...p,
        x: sp.x,
        y: sp.y,
        vx: 0,
        vy: 0,
        floor: sp.floor,
        alive: !p.isSpectator,
        role: p.isSpectator ? "crewmate" : roles[id] || "crewmate",
        inVent: false,
        ventIndex: -1,
        shielded: false,
        shieldTimer: 0,
        invisible: false,
        invisibleTimer: 0,
        doused: false,
        disguisedAs: null,
        disguiseTimer: 0,
        executionerTargetId: executionerTargets[id] || null,
        tasks: [],
        completedTasks: {},
      };
    }

    // GUARD_04 + GUARD_10 task distribution
    const assignedTasks = assignTasks(populated, chosenMap, settings.tasksPerPlayer);
    for (const [pid, tList] of Object.entries(assignedTasks)) {
      if (populated[pid]) populated[pid].tasks = tList;
    }

    // Initialize AI Brains with A* NavGraph waypoints & stuck watchdog state
    const brains: Record<string, AIBrain> = {};
    let botOrder = 0;
    for (const p of Object.values(populated)) {
      if (!p.isAI) continue;
      const brain: AIBrain = {
        targetX: p.x,
        targetY: p.y,
        floor: p.floor || 1,
        taskTargetId: null,
        dwellTimer: 0,
        patrolPause: 1.0 + Math.random() * 2.0,
        killCd: settings.killCooldown,
        sabCd: 20 + Math.random() * 14,
        stepTimer: 0,
        waypoints: [],
        steerSide: botOrder % 2 === 0 ? 1 : -1,
        lastProgressX: p.x,
        lastProgressY: p.y,
        stuckTimer: 0,
        hardStuckCount: 0,
      };
      assignNextAiTarget(p, brain, chosenMap);
      brains[p.id] = brain;
      botOrder++;
    }
    aiBrainsRef.current = brains;

    // GUARD_02 reset all cooldowns
    const cds = buildPostSpawnCooldowns(settings.killCooldown, false);
    setKillCooldown(cds.killCooldown);
    setSabotageCooldown(cds.sabotageCooldown);
    setAbilityCooldown(cds.abilityCooldown);
    setEmergencyCooldown(cds.emergencyCooldown);
    setEmergencyUsesLeft(settings.emergencyMeetings);
    setVentCooldown(cds.ventCooldown);
    setGhostCooldown(cds.ghostCooldown);

    setDoctorAbilityUsed(false);
    setEngineerRemoteFixUsed(false);
    setSurvivorShieldsLeft(2);
    setBodies([]);
    setSabotage(null);
    setDoorLogs([]);
    setTimeline([{ id: "tl_start", timeLabel: "00:00", text: `🚀 作戦開始（ステージ: ${chosenMap.name}）` }]);
    setCameraWatchTimer(0);
    cameraWatchTimerRef.current = 0;
    setCameraBatteryPct(100);
    cameraBatteryPctRef.current = 100;
    setDoorsLockedTimer(0);
    doorsLockedTimerRef.current = 0;
    setMeteorActive(false);
    setMeteorTimer(0);
    meteorTimerRef.current = 0;
    setVentStayTimer(null);
    ventStayTimerRef.current = null;
    setRadarTarget(null);
    setTrackerTargetId(null);
    setTeleporterPad(null);
    setTutorialStep(null);
    setActiveTaskId(null);
    setKillCutIn(null);
    setBeanRewardState(null);
    matchStatsRef.current = { tasksDone: 0, kills: 0, correctEjects: 0, rewardSettled: false };
    setGameOverState({ open: false, winner: "crewmates", reason: "", newlyUnlocked: [] });
    elapsedSecRef.current = 0;
    doorLogZonesRef.current = {};

    const mySpawn = populated[myId];
    if (mySpawn) {
      cameraTargetRef.current = sanitizeCameraPos({ x: mySpawn.x, y: mySpawn.y }, chosenMap.emergency, chosenMap);
    }

    setPlayers(populated);
    playersRef.current = populated;
    setPhase("playing");
    setRoleRevealOpen(true);

    if (!isOfflineAI) {
      broadcastPacket({
        type: "match_start",
        mapId: chosenMap.id,
        settings,
        players: populated,
      });
    }
  }, [
    settings,
    isOfflineAI,
    myId,
    myName,
    myColor,
    myHat,
    myVisor,
    myNameplate,
    myPet,
    mySkin,
    myKillEffect,
    broadcastPacket,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Start Modes (AI Solo / Tutorial / Online Host & Join)                    */
  /* ------------------------------------------------------------------------ */

  const handleStartAISolo = useCallback(() => {
    soundEngine.unlock();
    soundEngine.playClick();
    cleanupNetwork();
    setIsOfflineAI(true);
    setIsHost(true);
    setRoomCode("SOLO");
    setNetworkStatus("AIオフライン演習ロビー");
    setTutorialStep(null);

    const meInit: PlayerState = {
      id: myId,
      name: myName || "キャプテン",
      color: myColor,
      hat: myHat,
      visor: myVisor,
      nameplate: myNameplate,
      pet: myPet,
      skin: mySkin,
      killEffect: myKillEffect,
      x: 340,
      y: 170,
      vx: 0,
      vy: 0,
      floor: 1,
      facing: 1,
      alive: true,
      role: "crewmate",
      isAI: false,
      isHost: true,
      inVent: false,
      ventIndex: -1,
      shielded: false,
      shieldTimer: 0,
      invisible: false,
      invisibleTimer: 0,
      doused: false,
      disguisedAs: null,
      disguiseTimer: 0,
      executionerTargetId: null,
      tasks: [],
      completedTasks: {},
    };
    setPlayers({ [myId]: meInit });
    setChatHistory([]);
    setPhase("lobby");
  }, [cleanupNetwork, myId, myName, myColor, myHat, myVisor, myNameplate, myPet, mySkin, myKillEffect]);

  const handleStartTutorial = useCallback(() => {
    soundEngine.unlock();
    soundEngine.playClick();
    cleanupNetwork();
    setIsOfflineAI(true);
    setIsHost(true);
    setTutorialStep(1);
    tutorialFlagsRef.current = { killedDummy: false, vented: false };

    const tutMap = getMapById("starship");
    setActiveMap(tutMap);
    activeMapRef.current = tutMap;

    const { players: tp, bodies: tb } = createTutorialInitialEntities(
      myId,
      myName || "見習いクルー",
      myColor,
      myHat,
      myPet,
      mySkin,
      myVisor,
      myNameplate
    );
    setPlayers(tp);
    playersRef.current = tp;
    setBodies(tb);
    bodiesRef.current = tb;
    setSabotage(null);
    setChatHistory([]);
    setKillCooldown(0);
    setVentCooldown(0);
    setCameraWatchTimer(0);
    cameraWatchTimerRef.current = 0;
    cameraTargetRef.current = sanitizeCameraPos({ x: tp[myId].x, y: tp[myId].y }, tutMap.emergency, tutMap);
    setPhase("playing");
    setRoleRevealOpen(false);
  }, [cleanupNetwork, myId, myName, myColor, myHat, myVisor, myNameplate, myPet, mySkin]);

  const wireConn = useCallback(
    (conn: FirebaseDataConn, hostFlag: boolean) => {
      connsRef.current.set(conn.peer, conn);
      conn.on("open", () => {
        if (!hostFlag) {
          conn.send({
            type: "join_hello",
            player: {
              id: myId,
              name: myName || "クルー",
              color: myColor,
              hat: myHat,
              visor: myVisor,
              nameplate: myNameplate,
              pet: myPet,
              skin: mySkin,
              killEffect: myKillEffect,
              x: 340,
              y: 170,
              vx: 0,
              vy: 0,
              floor: 1,
              facing: 1,
              alive: true,
              role: "crewmate",
              isAI: false,
              isHost: false,
              inVent: false,
              ventIndex: -1,
              shielded: false,
              shieldTimer: 0,
              invisible: false,
              invisibleTimer: 0,
              doused: false,
              disguisedAs: null,
              disguiseTimer: 0,
              executionerTargetId: null,
              tasks: [],
              completedTasks: {},
            },
          });
        }
      });

      conn.on("data", (raw) => {
        const pkt = raw as NetPacket;
        if (!pkt || !pkt.type) return;

        if (pkt.type === "join_hello" && isHostRef.current) {
          const jp = pkt.player as PlayerState;
          if (!jp || !jp.id) return;
          setPlayers((prev) => {
            const taken = new Set(Object.values(prev).map((p) => p.color));
            const avail = PLAYER_COLORS.find((c) => !taken.has(c.id))?.id || jp.color;
            const cleanP: PlayerState = {
              ...jp,
              color: taken.has(jp.color) ? avail : jp.color,
              isSpectator: phaseRef.current !== "lobby",
              alive: phaseRef.current === "lobby",
            };
            const next = { ...prev, [cleanP.id]: cleanP };
            conn.send({
              type: "lobby_sync",
              players: next,
              settings: settingsRef.current,
              mapId: activeMapRef.current.id,
              phase: phaseRef.current,
            });
            broadcastPacket({ type: "lobby_sync", players: next, settings: settingsRef.current, mapId: activeMapRef.current.id, phase: phaseRef.current }, conn.peer);
            return next;
          });
        } else if (pkt.type === "lobby_sync") {
          const synced = pkt.players as Record<string, PlayerState>;
          if (synced) setPlayers(synced);
          if (pkt.settings) setSettings(pkt.settings as GameSettings);
          if (pkt.mapId) setActiveMap(getMapById(String(pkt.mapId)));
        } else if (pkt.type === "pos") {
          const sid = String(pkt.senderId || pkt.id || "");
          if (!sid || sid === myId) return;
          const norm = normalizeP2PPositionPacket(
            pkt as { x?: unknown; y?: unknown; vx?: unknown; vy?: unknown; floor?: unknown; facing?: unknown }
          );
          if (!norm) return;
          remoteTargetsRef.current[sid] = {
            x: norm.x,
            y: norm.y,
            floor: norm.floor,
            facing: norm.facing,
          };
          if (isHostRef.current) broadcastPacket(pkt, conn.peer);
        } else if (pkt.type === "player_patch") {
          const pid = String(pkt.id || "");
          const patch = pkt.patch as Partial<PlayerState>;
          if (pid && patch) {
            setPlayers((prev) => (prev[pid] ? { ...prev, [pid]: { ...prev[pid], ...patch } } : prev));
            if (isHostRef.current) broadcastPacket(pkt, conn.peer);
          }
        } else if (pkt.type === "chat") {
          const msg = pkt.msg as ChatMessage;
          if (msg) {
            setChatHistory((prev) => [...prev, msg]);
            setUnreadChatCount((c) => c + 1);
            if (isHostRef.current) broadcastPacket(pkt, conn.peer);
          }
        } else if (pkt.type === "match_start") {
          const m = getMapById(String(pkt.mapId || "starship"));
          setActiveMap(m);
          activeMapRef.current = m;
          if (pkt.settings) setSettings(pkt.settings as GameSettings);
          const pMap = pkt.players as Record<string, PlayerState>;
          if (pMap) {
            setPlayers(pMap);
            playersRef.current = pMap;
            if (pMap[myId]) {
              cameraTargetRef.current = sanitizeCameraPos({ x: pMap[myId].x, y: pMap[myId].y }, m.emergency, m);
            }
          }
          const cds = buildPostSpawnCooldowns((pkt.settings as GameSettings)?.killCooldown || 24, false);
          setKillCooldown(cds.killCooldown);
          setSabotageCooldown(cds.sabotageCooldown);
          setAbilityCooldown(cds.abilityCooldown);
          setEmergencyCooldown(cds.emergencyCooldown);
          setCameraWatchTimer(0);
          cameraWatchTimerRef.current = 0;
          setCameraBatteryPct(100);
          cameraBatteryPctRef.current = 100;
          setDoorsLockedTimer(0);
          doorsLockedTimerRef.current = 0;
          setVentStayTimer(null);
          ventStayTimerRef.current = null;
          setBodies([]);
          setSabotage(null);
          setKillCutIn(null);
          setBeanRewardState(null);
          matchStatsRef.current = { tasksDone: 0, kills: 0, correctEjects: 0, rewardSettled: false };
          setPhase("playing");
          setRoleRevealOpen(true);
        } else if (pkt.type === "kill_event") {
          const { victimId, killerId, body } = pkt as unknown as { victimId: string; killerId?: string; body: DeadBody };
          setPlayers((prev) =>
            prev[victimId]
              ? {
                  ...prev,
                  [victimId]: {
                    ...prev[victimId],
                    alive: false,
                    inVent: false,
                    ventIndex: -1,
                    invisible: false,
                    disguisedAs: null,
                  },
                }
              : prev
          );
          if (body) setBodies((prev) => [...prev, body]);
          if (victimId === myId) {
            cameraWatchTimerRef.current = 0;
            setCameraWatchTimer(0);
            setActiveTaskId(null);
            setOpenSabotageModal(false);
            setTerminalMode(null);
            soundEngine.playKill();
            setKillFlash(true);
            setTimeout(() => setKillFlash(false), 900);
            const kPlayer = killerId ? playersRef.current[killerId] : undefined;
            const vPlayer = playersRef.current[victimId];
            triggerKillCutIn(kPlayer, vPlayer);
          }
          if (isHostRef.current) broadcastPacket(pkt, conn.peer);
        } else if (pkt.type === "meeting_start") {
          const m = pkt as unknown as {
            isBody: boolean;
            callerName: string;
            victimName?: string;
            victimColor?: string;
            reason: string;
          };
          cameraWatchTimerRef.current = 0;
          setCameraWatchTimer(0);
          setActiveTaskId(null);
          setOpenSabotageModal(false);
          setOpenMapModal(false);
          setTerminalMode(null);
          soundEngine.playReport();
          setCutInState({
            open: true,
            isBody: m.isBody,
            caller: m.callerName,
            victimName: m.victimName,
            victimColor: m.victimColor,
          });
          setMeetingInfo({
            title: m.isBody ? "死体発見・緊急会議" : "緊急ボタン招集",
            reason: m.reason,
            timer: settingsRef.current.meetingTime,
            votedPlayers: {},
            votes: {},
            voteCounts: null,
          });
          setTimeout(() => {
            setCutInState((s) => ({ ...s, open: false }));
            setPhase("meeting");
          }, 1600);
        } else if (pkt.type === "vote_cast") {
          const { voterId, targetId } = pkt as unknown as { voterId: string; targetId: string };
          setMeetingInfo((prev) => ({
            ...prev,
            votedPlayers: { ...prev.votedPlayers, [voterId]: true },
            votes: { ...prev.votes, [voterId]: targetId },
          }));
          if (isHostRef.current) broadcastPacket(pkt, conn.peer);
        } else if (pkt.type === "sabotage_set") {
          setSabotage((pkt.sabotage as SabotageState) || null);
          if (pkt.sabotage) soundEngine.playSabotage();
        }
      });

      conn.on("close", () => {
        connsRef.current.delete(conn.peer);
      });
    },
    [myId, myName, myColor, myHat, myVisor, myNameplate, myPet, mySkin, myKillEffect, broadcastPacket, triggerKillCutIn]
  );

  const handleCreateOnlineRoom = useCallback(async () => {
    soundEngine.unlock();
    soundEngine.playClick();
    cleanupNetwork();
    const code = makeRoomCode();
    setIsOfflineAI(false);
    setIsHost(true);
    setRoomCode(code);
    setNetworkStatus("オンライン部屋を接続中...");

    const meInit: PlayerState = {
      id: myId,
      name: myName || "ホスト",
      color: myColor,
      hat: myHat,
      visor: myVisor,
      nameplate: myNameplate,
      pet: myPet,
      skin: mySkin,
      killEffect: myKillEffect,
      x: 340,
      y: 170,
      vx: 0,
      vy: 0,
      floor: 1,
      facing: 1,
      alive: true,
      role: "crewmate",
      isAI: false,
      isHost: true,
      inVent: false,
      ventIndex: -1,
      shielded: false,
      shieldTimer: 0,
      invisible: false,
      invisibleTimer: 0,
      doused: false,
      disguisedAs: null,
      disguiseTimer: 0,
      executionerTargetId: null,
      tasks: [],
      completedTasks: {},
    };
    setPlayers({ [myId]: meInit });
    setChatHistory([]);
    setPhase("lobby");

    // FirebasePeer primary/hybrid relay
    const fbPeer = new FirebasePeer(`host_${code}`, code, true);
    fbPeer.onPingUpdate = (ms) => setPingMs(ms);
    fbPeer.on("open", () => {
      setNetworkStatus("🟢 Firebase + P2P オンライン接続完了");
      fbRoomCodeRef.current = code;
      if (settingsRef.current.roomPublic) {
        void FB.publishPublicRoom({
          roomCode: code,
          hostName: myName || "ホスト",
          mapId: settingsRef.current.mapId,
          mapName: settingsRef.current.mapId === "random" ? "ランダム" : getMapById(settingsRef.current.mapId).name,
          playerCount: 1,
          maxPlayers: settingsRef.current.maxPlayers,
          phase: "lobby",
          allowSpectators: settingsRef.current.allowSpectators,
          createdAt: Date.now(),
        });
      }
    });
    fbPeer.on("connection", (conn) => wireConn(conn as FirebaseDataConn, true));
    fbPeer.on("error", (err) => {
      logGameError("App.createOnlineRoom", err, "NETWORK");
      setNetworkStatus("⚠️ 通信接続警告（エラーログ参照）");
    });

    // Also attach PeerJS listener if available for WebRTC direct acceleration
    const PJS = (window as PeerWin).Peer;
    if (PJS) {
      try {
        const p = new PJS(`starship_v5_${code}`, { config: P2P_ICE_CONFIG });
        p.on("connection", (c) => wireConn(c as FirebaseDataConn, true));
        peerRef.current = {
          destroy: () => {
            fbPeer.destroy();
            p.destroy();
          },
        };
      } catch {
        peerRef.current = fbPeer;
      }
    } else {
      peerRef.current = fbPeer;
    }
  }, [cleanupNetwork, myId, myName, myColor, myHat, myVisor, myNameplate, myPet, mySkin, myKillEffect, wireConn]);

  const handleJoinOnlineRoom = useCallback(
    async (codeOverride?: string, asSpectator = false) => {
      const code = (codeOverride || joinCode).trim().toUpperCase();
      if (!code) return;
      soundEngine.unlock();
      soundEngine.playClick();
      cleanupNetwork();
      setIsOfflineAI(false);
      setIsHost(false);
      setRoomCode(code);
      setNetworkStatus(`部屋 [${code}] へ接続中...`);

      const meInit: PlayerState = {
        id: myId,
        name: myName || "ゲスト",
        color: myColor,
        hat: myHat,
        visor: myVisor,
        nameplate: myNameplate,
        pet: myPet,
        skin: mySkin,
        killEffect: myKillEffect,
        x: 340,
        y: 170,
        vx: 0,
        vy: 0,
        floor: 1,
        facing: 1,
        alive: !asSpectator,
        isSpectator: asSpectator,
        role: "crewmate",
        isAI: false,
        isHost: false,
        inVent: false,
        ventIndex: -1,
        shielded: false,
        shieldTimer: 0,
        invisible: false,
        invisibleTimer: 0,
        doused: false,
        disguisedAs: null,
        disguiseTimer: 0,
        executionerTargetId: null,
        tasks: [],
        completedTasks: {},
      };
      setPlayers({ [myId]: meInit });
      setChatHistory([]);
      setPhase("lobby");

      const fbPeer = new FirebasePeer(myId, code, false);
      fbPeer.onPingUpdate = (ms) => setPingMs(ms);
      fbPeer.onHostMigration = () => {
        setIsHost(true);
        setNetworkStatus("👑 ホストを引き継ぎました");
      };
      fbPeer.on("open", () => {
        setNetworkStatus(`🟢 部屋 [${code}] へ接続済`);
        const conn = fbPeer.connect(`host_${code}`);
        wireConn(conn, false);
      });
      fbPeer.on("error", (err) => {
        logGameError("App.joinOnlineRoom", err, "NETWORK");
        setNetworkStatus("⚠️ 部屋接続エラー");
      });
      peerRef.current = fbPeer;
    },
    [joinCode, cleanupNetwork, myId, myName, myColor, myHat, myVisor, myNameplate, myPet, mySkin, myKillEffect, wireConn]
  );

  // Auto-parse ?room= & ?fb= URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");
    if (params.get("fb")) {
      FB.getStoredConfig();
    }
    if (roomParam && roomParam.trim()) {
      setJoinCode(roomParam.trim().toUpperCase());
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Chat & Meeting Helpers                                                   */
  /* ------------------------------------------------------------------------ */

  const handleSendChat = useCallback(
    (text: string, stampId?: string) => {
      soundEngine.playClick();
      const c = PLAYER_COLORS.find((col) => col.id === me.color) || PLAYER_COLORS[0];
      const msg: ChatMessage = {
        id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
        sender: me.name,
        color: c.hex,
        text,
        isGhost: !me.alive || !!me.isSpectator,
        isSystem: false,
        stampId,
        ts: Date.now(),
      };
      setChatHistory((prev) => [...prev, msg]);
      broadcastPacket({ type: "chat", msg });
      setProgression((prev) => {
        const nextCount = prev.chatsSent + 1;
        return { ...prev, chatsSent: nextCount };
      });
      if (progression.chatsSent + 1 >= 5) unlockAchievements(["chat_communicator"]);
    },
    [me.color, me.name, me.alive, me.isSpectator, broadcastPacket, progression.chatsSent, unlockAchievements]
  );

  const startMeeting = useCallback(
    (params: {
      isBody: boolean;
      callerName: string;
      victimName?: string;
      victimColor?: string;
      reason: string;
    }) => {
      soundEngine.playReport();
      cameraWatchTimerRef.current = 0;
      setCameraWatchTimer(0);
      setActiveTaskId(null);
      setOpenSabotageModal(false);
      setOpenMapModal(false);
      setTerminalMode(null);

      setCutInState({
        open: true,
        isBody: params.isBody,
        caller: params.callerName,
        victimName: params.victimName,
        victimColor: params.victimColor,
      });
      setMeetingInfo({
        title: params.isBody ? "死体発見・緊急会議" : "緊急会議招集",
        reason: params.reason,
        timer: tutorialStepRef.current ? 90 : settingsRef.current.meetingTime,
        votedPlayers: {},
        votes: {},
        voteCounts: null,
      });
      pushTimeline(`🚨 ${params.callerName}: ${params.isBody ? "死体通報" : "緊急会議"}`);

      if (!isOfflineAIRef.current) {
        broadcastPacket({ type: "meeting_start", ...params });
      }

      setTimeout(() => {
        setCutInState((s) => ({ ...s, open: false }));
        setPhase("meeting");
      }, 1550);
    },
    [broadcastPacket, pushTimeline]
  );

  const finishMeetingWithTally = useCallback(
    (votesMap: Record<string, string>) => {
      const curPlayers = playersRef.current;
      const { ejectedId, isTie, counts } = tallyVotes(votesMap, curPlayers);
      setMeetingInfo((prev) => ({ ...prev, voteCounts: counts }));

      // Tutorial STEP 3 completion check
      if (tutorialStepRef.current === 3) {
        setTimeout(() => {
          setPhase("playing");
          if (ejectedId === "tut_suspect" || Object.keys(votesMap).length > 0) {
            // Switch to Step 4 (Impostor Kill + Vent exercise)
            setTutorialStep(4);
            setPlayers((prev) => {
              const next = { ...prev };
              if (next["tut_suspect"]) next["tut_suspect"] = { ...next["tut_suspect"], alive: false };
              if (next[myId]) {
                next[myId] = {
                  ...next[myId],
                  role: "impostor",
                  x: 1080,
                  y: 660,
                  floor: 1,
                };
              }
              return next;
            });
            setKillCooldown(0);
            setVentCooldown(0);
            setBodies([]);
            cameraTargetRef.current = { x: 1080, y: 660 };
          }
        }, 1200);
        return;
      }

      setTimeout(() => {
        let msg = "スキップまたは同票により、誰も追放されませんでした。";
        let ejColor: string | undefined;
        let nextPlayers = { ...playersRef.current };

        if (ejectedId && nextPlayers[ejectedId]) {
          const target = nextPlayers[ejectedId];
          ejColor = target.color;
          nextPlayers[ejectedId] = {
            ...target,
            alive: false,
            inVent: false,
            ventIndex: -1,
            invisible: false,
            disguisedAs: null,
          };
          if (settingsRef.current.confirmEjects) {
            const teamTxt = isImpostorRole(target.role)
              ? "インポスター"
              : ROLES[target.role]?.jp || "クルー";
            msg = `${target.name} は宇宙へ追放された… (${teamTxt})`;
          } else {
            msg = `${target.name} は宇宙へ追放された…`;
          }
          pushTimeline(`⚖️ 投票により ${target.name} が追放された`);

          // Check Jester / Executioner eject wins
          if (target.role === "jester") {
            setEjectionState({ open: true, message: `${target.name} はテルテルだった！`, color: ejColor });
            setTimeout(() => {
              setEjectionState({ open: false, message: "" });
              concludeMatchWithResult(
                "jester",
                `テルテル (${target.name}) が会議投票で追放され単独勝利！`,
                nextPlayers
              );
            }, 2200);
            return;
          }
          const execWinner = Object.values(nextPlayers).find(
            (p) => p.alive && p.role === "executioner" && p.executionerTargetId === ejectedId
          );
          if (execWinner) {
            setEjectionState({ open: true, message: msg, color: ejColor });
            setTimeout(() => {
              setEjectionState({ open: false, message: "" });
              concludeMatchWithResult(
                "executioner",
                `エクスキューショナー (${execWinner.name}) がターゲット追放に成功し勝利！`,
                nextPlayers
              );
            }, 2200);
            return;
          }
          if (isImpostorRole(target.role)) {
            matchStatsRef.current.correctEjects += 1;
            setProgression((prev) => ({ ...prev, correctEjects: prev.correctEjects + 1 }));
            unlockAchievements(["detective_eject"]);
          }
        } else if (isTie) {
          msg = "同票引き分けのため、誰も追放されませんでした。";
        }

        // GUARD_02: Reset positions + cooldowns + AI paths cleanly on meeting end
        const activeList = Object.values(nextPlayers).filter((p) => !p.isSpectator);
        activeList.forEach((p, idx) => {
          const sp = getSpawnPosition(idx, activeList.length, activeMapRef.current);
          const respawned = { ...p, x: sp.x, y: sp.y, vx: 0, vy: 0, floor: sp.floor, inVent: false, ventIndex: -1 };
          nextPlayers[p.id] = respawned;
          if (respawned.isAI && aiBrainsRef.current[p.id]) {
            const br = aiBrainsRef.current[p.id];
            br.lastProgressX = sp.x;
            br.lastProgressY = sp.y;
            br.stuckTimer = 0;
            br.hardStuckCount = 0;
            br.dwellTimer = 0;
            br.patrolPause = 1.2 + Math.random() * 1.8;
            assignNextAiTarget(respawned, br, activeMapRef.current);
          }
        });

        // Turn orphaned executioners into jester if target dead
        for (const p of Object.values(nextPlayers)) {
          if (p.role === "executioner" && p.executionerTargetId && !nextPlayers[p.executionerTargetId]?.alive) {
            nextPlayers[p.id] = { ...p, role: "jester", executionerTargetId: null };
          }
        }

        const cds = buildPostSpawnCooldowns(settingsRef.current.killCooldown, true);
        setKillCooldown(cds.killCooldown);
        setSabotageCooldown(cds.sabotageCooldown);
        setAbilityCooldown(cds.abilityCooldown);
        setEmergencyCooldown(cds.emergencyCooldown);
        setVentCooldown(cds.ventCooldown);

        setCameraWatchTimer(0);
        cameraWatchTimerRef.current = 0;
        setDoorsLockedTimer(0);
        doorsLockedTimerRef.current = 0;
        setBodies([]);
        setPlayers(nextPlayers);
        playersRef.current = nextPlayers;
        if (nextPlayers[myId]) {
          cameraTargetRef.current = sanitizeCameraPos(
            { x: nextPlayers[myId].x, y: nextPlayers[myId].y },
            activeMapRef.current.emergency,
            activeMapRef.current
          );
        }

        setEjectionState({ open: true, message: msg, color: ejColor });
        setTimeout(() => {
          setEjectionState({ open: false, message: "" });
          const win = checkWinCondition(nextPlayers, sabotageRef.current, taskCompletedCount, taskTotalCount);
          if (win) {
            concludeMatchWithResult(win.winner, win.reason, nextPlayers);
          } else {
            setPhase("playing");
          }
        }, 2300);
      }, 1500);
    },
    [myId, pushTimeline, taskCompletedCount, taskTotalCount, unlockAchievements, concludeMatchWithResult]
  );

  const handleCastVote = useCallback(
    (targetId: string) => {
      if (!me.alive || me.isSpectator) return;
      soundEngine.playClick();
      setMeetingInfo((prev) => {
        if (prev.votedPlayers[myId] || prev.voteCounts) return prev;
        const nextVoted = { ...prev.votedPlayers, [myId]: true };
        const nextVotes = { ...prev.votes, [myId]: targetId };
        broadcastPacket({ type: "vote_cast", voterId: myId, targetId });
        return { ...prev, votedPlayers: nextVoted, votes: nextVotes };
      });
    },
    [me.alive, me.isSpectator, myId, broadcastPacket]
  );

  // Meeting countdown & AI smart voting
  useEffect(() => {
    if (phase !== "meeting") return;
    const t = window.setInterval(() => {
      setMeetingInfo((prev) => {
        if (prev.voteCounts) return prev;
        const nextTimer = Math.max(0, prev.timer - 1);
        const aliveParticipants = Object.values(playersRef.current).filter((p) => !p.isSpectator && p.alive);
        const allVoted = aliveParticipants.every((p) => prev.votedPlayers[p.id]);
        if (nextTimer <= 0 || allVoted) {
          window.setTimeout(() => finishMeetingWithTally(prev.votes), 0);
        }
        return { ...prev, timer: nextTimer };
      });
    }, 1000);

    // AI bots cast votes cleanly after 3–6 seconds
    let aiVoteTimer: number | null = null;
    if (isHostRef.current && isOfflineAIRef.current) {
      aiVoteTimer = window.setTimeout(() => {
        setMeetingInfo((prev) => {
          if (prev.voteCounts) return prev;
          const alive = Object.values(playersRef.current).filter((p) => !p.isSpectator && p.alive);
          const nextVoted = { ...prev.votedPlayers };
          const nextVotes = { ...prev.votes };
          for (const p of alive) {
            if (!p.isAI || nextVoted[p.id]) continue;
            nextVoted[p.id] = true;
            if (Math.random() < 0.52) {
              nextVotes[p.id] = "skip";
            } else {
              const candidates = alive.filter((c) => c.id !== p.id && (!isImpostorRole(p.role) || !isImpostorRole(c.role)));
              nextVotes[p.id] = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)].id : "skip";
            }
          }
          return { ...prev, votedPlayers: nextVoted, votes: nextVotes };
        });
      }, 3600);
    }

    return () => {
      window.clearInterval(t);
      if (aiVoteTimer) window.clearTimeout(aiVoteTimer);
    };
  }, [phase, finishMeetingWithTally]);

  /* ------------------------------------------------------------------------ */
  /* Action Handlers (Use, Report, Kill, Vent, Sabotage, Ability, Ghost)      */
  /* ------------------------------------------------------------------------ */

  const handleUse = useCallback(() => {
    const curMe = playersRef.current[myId];
    if (!curMe) return;

    if (phaseRef.current === "lobby") {
      if (Math.hypot(curMe.x - LOBBY_CUSTOMIZE_TERMINAL.x, curMe.y - LOBBY_CUSTOMIZE_TERMINAL.y) <= 95) {
        soundEngine.playClick();
        setOpenCustomize(true);
      }
      return;
    }

    if (phaseRef.current !== "playing") return;
    if (cameraWatchTimerRef.current > 0) {
      soundEngine.playClick();
      cameraWatchTimerRef.current = 0;
      setCameraWatchTimer(0);
      cameraTargetRef.current = sanitizeCameraPos(
        { x: curMe.x, y: curMe.y },
        activeMapRef.current.emergency,
        activeMapRef.current
      );
      return;
    }
    const state = getUseActionState({
      me: curMe,
      mapDef: activeMapRef.current,
      sabotage: sabotageRef.current,
      myTasks: curMe.tasks,
      completedTasks: curMe.completedTasks,
      gimmickCooldowns: gimmickCooldownsRef.current,
      emergencyCooldown,
      emergencyUsesLeft,
    });

    if (!state.enabled) return;
    soundEngine.playClick();

    if (state.kind === "sabotage_fix" && sabotageRef.current && sabotageRef.current.type !== "doors") {
      setActiveTaskId(`sabotage_${sabotageRef.current.type}`);
    } else if (state.kind === "task" && state.taskId) {
      setActiveTaskId(state.taskId);
    } else if (state.kind === "emergency") {
      setEmergencyUsesLeft((u) => Math.max(0, u - 1));
      setEmergencyCooldown(25);
      startMeeting({
        isBody: false,
        callerName: curMe.name,
        reason: `${curMe.name} が緊急ボタンを押しました。`,
      });
    } else if (state.kind === "gimmick" && state.gimmick) {
      const g = state.gimmick;
      const gIdx = activeMapRef.current.gimmicks.indexOf(g);
      const gKey = getGimmickKey(g, Math.max(0, gIdx));
      if ((g.type === "stairs" || g.type === "teleport") && g.targetX !== undefined && g.targetY !== undefined) {
        // GUARD_03: Safe pos + floor sync + velocity reset + postWarpGraceSec
        const tf = g.targetFloor || 1;
        const safe = resolveSafePos(g.targetX, g.targetY, activeMapRef.current, tf, !curMe.alive);
        const patch = buildTeleportSyncPatch(safe.x, safe.y, tf);
        gimmickCooldownsRef.current[gKey] = 2.0;
        cameraTargetRef.current = { x: safe.x, y: safe.y };
        setPlayers((prev) => ({ ...prev, [myId]: { ...prev[myId], ...patch } }));
        broadcastPacket({ type: "player_patch", id: myId, patch });
      } else if (g.type === "camera") {
        if (settingsRef.current.cameraBatteryLimit && cameraBatteryPctRef.current <= 1) {
          setToastTitle("🔋 監視カメラのバッテリーが残っていません");
          setTimeout(() => setToastTitle(null), 2600);
          return;
        }
        cameraWatchTimerRef.current = 12;
        setCameraWatchTimer(12);
        setCameraFeedIndex(0);
      } else if (g.type === "vitals") {
        setTerminalMode("vitals");
      } else if (g.type === "doorlog") {
        setTerminalMode("doorlog");
      } else if (g.type === "door_control") {
        gimmickCooldownsRef.current[gKey] = 20;
        doorsLockedTimerRef.current = 8;
        setDoorsLockedTimer(8);
        setSabotage({ type: "doors", timer: 8, maxTimer: 8 });
      } else if (g.type === "steam_valve") {
        gimmickCooldownsRef.current[gKey] = 22;
        setSteamActive(true);
        setTimeout(() => setSteamActive(false), 7500);
      } else if (g.type === "meteor_console") {
        gimmickCooldownsRef.current[gKey] = 25;
        setMeteorActive(true);
        setMeteorTimer(8);
      } else if (g.type === "decontam_chamber") {
        gimmickCooldownsRef.current[gKey] = 10;
        setGimmickStatusText("🧪 除染スキャン完了！");
      }
    }
  }, [myId, emergencyCooldown, emergencyUsesLeft, startMeeting, broadcastPacket]);

  const handleReport = useCallback(() => {
    const curMe = playersRef.current[myId];
    // GUARD_01: Alive & non-spectator only
    if (!validateAliveReporter(curMe) || phaseRef.current !== "playing") return;
    const nearby = findNearbyInteractable(
      curMe,
      playersRef.current,
      bodiesRef.current,
      activeMapRef.current,
      sabotageRef.current
    );
    if (!nearby.nearestBody) return;
    const b = nearby.nearestBody;
    setProgression((prev) => ({ ...prev, firstBodyReports: prev.firstBodyReports + 1 }));
    startMeeting({
      isBody: true,
      callerName: curMe.name,
      victimName: b.name,
      victimColor: b.color,
      reason: `${curMe.name} が ${b.name} の死体を発見しました！`,
    });
  }, [myId, startMeeting]);

  const handleKill = useCallback(() => {
    const curMe = playersRef.current[myId];
    if (!curMe || !curMe.alive || curMe.isSpectator || phaseRef.current !== "playing") return;
    if (killCooldown > 0) return;
    const canKill = isImpostorRole(curMe.role) || curMe.role === "sheriff" || curMe.role === "jackal" || curMe.role === "arsonist";
    if (!canKill) return;

    // GUARD_09: Single closest target exclusive lock
    const nearby = findNearbyInteractable(
      curMe,
      playersRef.current,
      bodiesRef.current,
      activeMapRef.current,
      sabotageRef.current
    );
    const target = nearby.nearestKill;
    if (!target) return;

    setKillCooldown(settingsRef.current.killCooldown);

    if (curMe.role === "arsonist") {
      soundEngine.playClick();
      setPlayers((prev) => ({ ...prev, [target.id]: { ...prev[target.id], doused: true } }));
      broadcastPacket({ type: "player_patch", id: target.id, patch: { doused: true } });
      return;
    }

    if (target.shielded) {
      soundEngine.playError();
      setPlayers((prev) => ({
        ...prev,
        [target.id]: { ...prev[target.id], shielded: false, shieldTimer: 0 },
      }));
      return;
    }

    // Sheriff misfire check
    if (curMe.role === "sheriff" && !isImpostorRole(target.role) && target.role !== "jackal") {
      soundEngine.playKill();
      setKillFlash(true);
      setTimeout(() => setKillFlash(false), 800);
      const selfBody: DeadBody = {
        id: `b_${Date.now()}`,
        playerId: curMe.id,
        name: curMe.name,
        color: curMe.color,
        x: curMe.x,
        y: curMe.y,
        floor: curMe.floor || 1,
        dissolveTimer: null,
        killerId: curMe.id,
        killedAt: Date.now(),
      };
      setPlayers((prev) => ({
        ...prev,
        [myId]: { ...prev[myId], alive: false, inVent: false, ventIndex: -1, invisible: false, disguisedAs: null },
      }));
      cameraWatchTimerRef.current = 0;
      setCameraWatchTimer(0);
      setBodies((prev) => [...prev, selfBody]);
      pushTimeline(`🤠 シェリフ ${curMe.name} が誤射により自爆`);
      return;
    }

    soundEngine.playKill();
    const colHex = (PLAYER_COLORS.find((c) => c.id === target.color) || PLAYER_COLORS[0]).hex;
    killBurstsRef.current.push({
      x: target.x,
      y: target.y,
      effectId: curMe.killEffect || "classic",
      colorHex: colHex,
      startedAt: performance.now(),
      durationMs: 750,
    });

    const newBody: DeadBody = {
      id: `b_${Date.now()}`,
      playerId: target.id,
      name: target.name,
      color: target.color,
      x: target.x,
      y: target.y,
      floor: target.floor || 1,
      dissolveTimer: curMe.role === "viper" ? 20 : null,
      killerId: curMe.id,
      killedAt: Date.now(),
    };

    const nextPlayers = {
      ...playersRef.current,
      [myId]: { ...curMe, x: target.x, y: target.y },
      [target.id]: { ...target, alive: false, inVent: false, ventIndex: -1, invisible: false, disguisedAs: null },
    };
    setPlayers(nextPlayers);
    setBodies((prev) => [...prev, newBody]);
    broadcastPacket({ type: "kill_event", victimId: target.id, killerId: curMe.id, body: newBody });
    pushTimeline(`🔪 ${curMe.name} が ${target.name} を撃破`);
    matchStatsRef.current.kills += 1;
    setProgression((prev) => ({ ...prev, totalKills: prev.totalKills + 1 }));

    if (tutorialStepRef.current === 4 && target.id === "tut_target") {
      tutorialFlagsRef.current.killedDummy = true;
      if (tutorialFlagsRef.current.vented) {
        setTutorialStep(null);
        setPhase("title");
        setToastTitle("🎓 実践チュートリアル完全クリア！");
        setTimeout(() => setToastTitle(null), 4000);
      }
      return;
    }

    const win = checkWinCondition(nextPlayers, sabotageRef.current, taskCompletedCount, taskTotalCount);
    if (win) {
      concludeMatchWithResult(win.winner, win.reason, nextPlayers);
    }
  }, [myId, killCooldown, broadcastPacket, pushTimeline, taskCompletedCount, taskTotalCount, concludeMatchWithResult]);

  const handleVent = useCallback(() => {
    const curMe = playersRef.current[myId];
    if (!curMe || !curMe.alive || curMe.isSpectator || phaseRef.current !== "playing") return;
    if (!canUseVentRole(curMe.role)) return;

    if (curMe.inVent) {
      soundEngine.playVent();
      setPlayers((prev) => ({ ...prev, [myId]: { ...prev[myId], inVent: false, ventIndex: -1 } }));
      setVentStayTimer(null);
      if (curMe.role === "engineer") setVentCooldown(18);
      broadcastPacket({ type: "player_patch", id: myId, patch: { inVent: false, ventIndex: -1 } });
      return;
    }

    if (ventCooldown > 0) return;
    const nearby = findNearbyInteractable(
      curMe,
      playersRef.current,
      bodiesRef.current,
      activeMapRef.current,
      sabotageRef.current
    );
    if (nearby.nearestVentIdx < 0) return;

    const v = activeMapRef.current.vents[nearby.nearestVentIdx];
    soundEngine.playVent();
    setPlayers((prev) => ({
      ...prev,
      [myId]: { ...prev[myId], x: v.x, y: v.y, inVent: true, ventIndex: nearby.nearestVentIdx },
    }));
    if (curMe.role === "engineer") setVentStayTimer(6);

    if (tutorialStepRef.current === 4) {
      tutorialFlagsRef.current.vented = true;
      if (tutorialFlagsRef.current.killedDummy) {
        setTimeout(() => {
          setTutorialStep(null);
          setPhase("title");
          setToastTitle("🎓 実践チュートリアル完全クリア！");
          setTimeout(() => setToastTitle(null), 4000);
        }, 700);
      }
    }
  }, [myId, ventCooldown, broadcastPacket]);

  const handleJumpToVent = useCallback(
    (targetIdx: number) => {
      const targetVent = activeMapRef.current.vents[targetIdx];
      if (!targetVent) return;
      soundEngine.playVent();
      const tf = targetVent.floor || 1;
      cameraTargetRef.current = { x: targetVent.x, y: targetVent.y };
      setPlayers((prev) => ({
        ...prev,
        [myId]: { ...prev[myId], x: targetVent.x, y: targetVent.y, floor: tf, ventIndex: targetIdx },
      }));
    },
    [myId]
  );

  const handleAbility = useCallback(() => {
    const curMe = playersRef.current[myId];
    if (!curMe || !curMe.alive || curMe.isSpectator || phaseRef.current !== "playing") return;
    if (abilityCooldown > 0) return;
    soundEngine.playClick();

    if (curMe.role === "engineer" && !engineerRemoteFixUsed && sabotageRef.current) {
      setEngineerRemoteFixUsed(true);
      setSabotage(null);
      setAbilityCooldown(30);
      return;
    }
    if (curMe.role === "phantom") {
      setAbilityCooldown(28);
      setPlayers((prev) => ({ ...prev, [myId]: { ...prev[myId], invisible: true, invisibleTimer: 6 } }));
      return;
    }
    if (curMe.role === "survivor" && survivorShieldsLeft > 0) {
      setSurvivorShieldsLeft((n) => n - 1);
      setAbilityCooldown(24);
      setPlayers((prev) => ({ ...prev, [myId]: { ...prev[myId], shielded: true, shieldTimer: 10 } }));
      return;
    }
    if (curMe.role === "radar") {
      const nearest = Object.values(playersRef.current)
        .filter((p) => p.id !== myId && p.alive && !p.isSpectator)
        .sort((a, b) => Math.hypot(a.x - curMe.x, a.y - curMe.y) - Math.hypot(b.x - curMe.x, b.y - curMe.y))[0];
      if (nearest) {
        setRadarTarget({ x: nearest.x, y: nearest.y });
        setTimeout(() => setRadarTarget(null), 5000);
        setAbilityCooldown(30);
      }
      return;
    }
    if (curMe.role === "security") {
      if (settingsRef.current.cameraBatteryLimit && cameraBatteryPctRef.current <= 1) {
        setToastTitle("🔋 監視カメラのバッテリーが残っていません");
        setTimeout(() => setToastTitle(null), 2600);
        return;
      }
      cameraWatchTimerRef.current = 6;
      setCameraWatchTimer(6);
      setAbilityCooldown(30);
      return;
    }
    if (curMe.role === "teleporter") {
      if (!teleporterPad) {
        setTeleporterPad({ x: curMe.x, y: curMe.y, floor: curMe.floor || 1 });
        setAbilityCooldown(4);
      } else {
        const patch = buildTeleportSyncPatch(teleporterPad.x, teleporterPad.y, teleporterPad.floor);
        cameraTargetRef.current = { x: teleporterPad.x, y: teleporterPad.y };
        setPlayers((prev) => ({ ...prev, [myId]: { ...prev[myId], ...patch } }));
        setTeleporterPad(null);
        setAbilityCooldown(34);
      }
      return;
    }
    if (curMe.role === "tracker") {
      const target = Object.values(playersRef.current).find(
        (p) => p.id !== myId && p.alive && !p.isSpectator && Math.hypot(p.x - curMe.x, p.y - curMe.y) <= 130
      );
      if (target) {
        setTrackerTargetId(target.id);
        setTimeout(() => setTrackerTargetId(null), 18000);
        setAbilityCooldown(32);
      }
      return;
    }
    if (curMe.role === "doctor" && !doctorAbilityUsed) {
      const nearBody = bodiesRef.current.find(
        (b) => (b.floor || 1) === (curMe.floor || 1) && Math.hypot(b.x - curMe.x, b.y - curMe.y) <= 105
      );
      if (nearBody && playersRef.current[nearBody.playerId]) {
        setDoctorAbilityUsed(true);
        const cds = buildPostSpawnCooldowns(settingsRef.current.killCooldown, true);
        setBodies((prev) => prev.filter((b) => b.id !== nearBody.id));
        setPlayers((prev) => ({
          ...prev,
          [nearBody.playerId]: { ...prev[nearBody.playerId], alive: true, x: nearBody.x, y: nearBody.y, floor: nearBody.floor },
        }));
        setAbilityCooldown(cds.abilityCooldown);
        pushTimeline(`🩺 ドクター ${curMe.name} が ${nearBody.name} を蘇生！`);
      } else {
        const ally = Object.values(playersRef.current).find(
          (p) => p.id !== myId && p.alive && !p.isSpectator && Math.hypot(p.x - curMe.x, p.y - curMe.y) <= 105
        );
        if (ally) {
          setDoctorAbilityUsed(true);
          setPlayers((prev) => ({ ...prev, [ally.id]: { ...prev[ally.id], shielded: true, shieldTimer: 20 } }));
          setAbilityCooldown(30);
        }
      }
      return;
    }
    if (curMe.role === "shapeshifter") {
      const near = Object.values(playersRef.current).find(
        (p) => p.id !== myId && p.alive && !p.isSpectator && Math.hypot(p.x - curMe.x, p.y - curMe.y) <= 180
      );
      if (near) {
        setAbilityCooldown(28);
        setPlayers((prev) => ({
          ...prev,
          [myId]: { ...prev[myId], disguisedAs: { name: near.name, color: near.color, hat: near.hat }, disguiseTimer: 18 },
        }));
      }
      return;
    }
    if (curMe.role === "arsonist") {
      const aliveOthers = Object.values(playersRef.current).filter((p) => p.id !== myId && p.alive && !p.isSpectator);
      if (aliveOthers.length > 0 && aliveOthers.every((p) => p.doused)) {
        concludeMatchWithResult(
          "arsonist",
          `アーソニスト (${curMe.name}) が生存者全員に点火し単独勝利！`,
          playersRef.current
        );
      }
    }
  }, [
    myId,
    abilityCooldown,
    engineerRemoteFixUsed,
    survivorShieldsLeft,
    teleporterPad,
    doctorAbilityUsed,
    pushTimeline,
    concludeMatchWithResult,
  ]);

  const handleCompleteTask = useCallback(
    (tid: string) => {
      setActiveTaskId(null);
      if (tid.startsWith("sabotage_")) {
        if (sabotageRef.current && sabotageRef.current.timer <= 5) {
          unlockAchievements(["close_call"]);
        }
        setSabotage(null);
        broadcastPacket({ type: "sabotage_set", sabotage: null });
        return;
      }

      if (!tutorialStepRef.current) {
        matchStatsRef.current.tasksDone += 1;
      }
      setProgression((prev) => ({ ...prev, totalTasks: prev.totalTasks + 1 }));
      const nextCompleted = { ...(playersRef.current[myId]?.completedTasks || {}), [tid]: true };
      setPlayers((prev) => {
        const cur = prev[myId];
        if (!cur) return prev;
        const updated = { ...prev, [myId]: { ...cur, completedTasks: nextCompleted } };
        broadcastPacket({ type: "player_patch", id: myId, patch: { completedTasks: nextCompleted } });

        // Tutorial STEP 2 -> STEP 3
        if (tutorialStepRef.current === 2) {
          setTutorialStep(3);
        } else if (!tutorialStepRef.current) {
          let total = 0;
          let done = 0;
          Object.values(updated).forEach((p) => {
            if (!p.isSpectator && hasTasksRole(p.role)) {
              total += p.tasks.length;
              p.tasks.forEach((id) => {
                if (p.completedTasks[id]) done++;
              });
            }
          });
          const win = checkWinCondition(updated, sabotageRef.current, done, total);
          if (win) {
            concludeMatchWithResult(win.winner, win.reason, updated);
          }
        }
        return updated;
      });
    },
    [myId, broadcastPacket, unlockAchievements, concludeMatchWithResult]
  );

  /* ------------------------------------------------------------------------ */
  /* Keyboard Listeners                                                       */
  /* ------------------------------------------------------------------------ */

  const clearKeys = useCallback(() => {
    keysPressedRef.current.clear();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (openKeybinds) return;

      if (cameraWatchTimerRef.current > 0) {
        const spotCount = Math.max(1, cameraSpotsRef.current.length);
        if (e.code === "Escape") {
          e.preventDefault();
          cameraWatchTimerRef.current = 0;
          setCameraWatchTimer(0);
          const curMe = playersRef.current[myId];
          if (curMe) {
            cameraTargetRef.current = sanitizeCameraPos({ x: curMe.x, y: curMe.y }, activeMapRef.current.emergency, activeMapRef.current);
          }
          return;
        }
        if (e.code === "ArrowLeft" || e.code === keybinds.moveLeft) {
          e.preventDefault();
          setCameraFeedIndex((i) => (i - 1 + spotCount) % spotCount);
          return;
        }
        if (e.code === "ArrowRight" || e.code === keybinds.moveRight) {
          e.preventDefault();
          setCameraFeedIndex((i) => (i + 1) % spotCount);
          return;
        }
        if (e.code >= "Digit1" && e.code <= "Digit4") {
          const reqIdx = Number(e.code.replace("Digit", "")) - 1;
          if (reqIdx < spotCount) {
            e.preventDefault();
            setCameraFeedIndex(reqIdx);
            return;
          }
        }
      }

      keysPressedRef.current.add(e.code);
      if (e.code === keybinds.map && phaseRef.current === "playing") {
        e.preventDefault();
        setOpenMapModal((v) => !v);
        return;
      }
      if (e.code === keybinds.use) {
        e.preventDefault();
        handleUse();
      } else if (e.code === keybinds.report) {
        handleReport();
      } else if (e.code === keybinds.kill) {
        handleKill();
      } else if (e.code === keybinds.vent) {
        handleVent();
      } else if (
        e.code === keybinds.sabotage &&
        phaseRef.current === "playing" &&
        !playersRef.current[myId]?.isSpectator &&
        isImpostorRole(playersRef.current[myId]?.role || "crewmate")
      ) {
        setOpenSabotageModal((v) => !v);
      } else if (e.code === keybinds.ability) {
        handleAbility();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.code);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
    };
  }, [keybinds, myId, openKeybinds, clearKeys, handleUse, handleReport, handleKill, handleVent, handleAbility]);

  /* ------------------------------------------------------------------------ */
  /* Canvas ResizeObserver (viewport / high-DPI sync)                         */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    const canvas = gameCanvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container || typeof ResizeObserver === "undefined") return;
    const syncViewportSize = () => {
      const curMe = playersRef.current[myId];
      if (phaseRef.current === "meeting" || phaseRef.current === "gameover") {
        if (curMe) {
          const activeSpots = cameraSpotsRef.current;
          const activeSpot = activeSpots[cameraFeedIndexRef.current % Math.max(1, activeSpots.length)];
          const watchOn = cameraWatchTimerRef.current > 0;
          const doorsClosed = doorsLockedTimerRef.current > 0 || sabotageRef.current?.type === "doors";
          renderGameCanvas({
            canvas,
            mapDef: activeMapRef.current,
            me: curMe,
            cameraTarget: cameraTargetRef.current,
            players: playersRef.current,
            bodies: bodiesRef.current,
            sabotage: sabotageRef.current,
            visionRadius: visionRadiusRef.current,
            myTasks: curMe.tasks,
            completedTasks: curMe.completedTasks,
            showNavArrows: hudSettingsRef.current.showNavArrows,
            footprints: footprintsRef.current,
            radarTarget: radarTargetRef.current,
            teleporterPad: teleporterPadRef.current,
            killBursts: killBurstsRef.current,
            cameraWatchFloor: watchOn && activeSpot ? activeSpot.floor || 1 : null,
            cameraFeedPos: watchOn && activeSpot ? { x: activeSpot.x, y: activeSpot.y } : null,
            anyCameraActive: watchOn,
            doorBlockers: doorsClosed ? mapDoorBlockersRef.current : [],
            steamActive: steamActiveRef.current,
            matchElapsedSec: elapsedSecRef.current,
            trackerTargetId: trackerTargetIdRef.current,
            tutorialStep: tutorialStepRef.current,
            nowMs: performance.now(),
          });
        }
      }
    };
    const obs = new ResizeObserver(syncViewportSize);
    obs.observe(container);
    return () => obs.disconnect();
  }, [phase, myId]);

  /* ------------------------------------------------------------------------ */
  /* Main Simulation & Canvas Render Loop (60fps + 1s Health Guard)           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (phase !== "lobby" && phase !== "playing" && phase !== "meeting") return;
    let lastMs = performance.now();
    let hudSyncAcc = 0;
    let netPosAcc = 0;
    let raf = 0;

    const frame = (nowMs: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (nowMs - lastMs) / 1000));
      lastMs = nowMs;
      const kb = keybindsRef.current;

      if (phaseRef.current === "lobby") {
        // Lobby Dropship Movement
        const keys = keysPressedRef.current;
        let dx = 0;
        let dy = 0;
        if (keys.has(kb.moveUp) || keys.has("ArrowUp")) dy -= 1;
        if (keys.has(kb.moveDown) || keys.has("ArrowDown")) dy += 1;
        if (keys.has(kb.moveLeft) || keys.has("ArrowLeft")) dx -= 1;
        if (keys.has(kb.moveRight) || keys.has("ArrowRight")) dx += 1;
        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }
        const curMe = playersRef.current[myId];
        if (curMe && (dx !== 0 || dy !== 0)) {
          const nx = Math.max(44, Math.min(636, curMe.x + dx * 210 * dt));
          const ny = Math.max(66, Math.min(286, curMe.y + dy * 210 * dt));
          const facing: 1 | -1 = dx < 0 ? -1 : dx > 0 ? 1 : curMe.facing;
          playersRef.current = {
            ...playersRef.current,
            [myId]: {
              ...curMe,
              x: nx,
              y: ny,
              facing,
              petX: exponentialLerp(curMe.petX ?? nx - facing * 26, nx - facing * 26, dt, 10, 260),
              petY: exponentialLerp(curMe.petY ?? ny + 12, ny + 12, dt, 10, 260),
            },
          };
          netPosAcc += dt;
          if (netPosAcc >= 0.06 && !isOfflineAIRef.current) {
            netPosAcc = 0;
            broadcastPacket({ type: "pos", id: myId, x: nx, y: ny, floor: 1, facing });
          }
        }

        // Interpolate remote lobby peers
        const nextMap = { ...playersRef.current };
        for (const [rid, tgt] of Object.entries(remoteTargetsRef.current)) {
          const rp = nextMap[rid];
          if (rp) {
            nextMap[rid] = {
              ...rp,
              x: exponentialLerp(rp.x, tgt.x, dt, 14, 260),
              y: exponentialLerp(rp.y, tgt.y, dt, 14, 260),
              facing: tgt.facing,
            };
          }
        }
        playersRef.current = nextMap;

        if (lobbyCanvasRef.current) {
          const m = nextMap[myId];
          drawLobbyDeck({
            canvas: lobbyCanvasRef.current,
            players: Object.values(nextMap).map((p) => ({
              id: p.id,
              name: p.name,
              color: p.color,
              hat: p.hat,
              visor: p.visor,
              pet: p.pet,
              skin: p.skin,
              x: p.x,
              y: p.y,
              facing: p.facing,
              isMe: p.id === myId,
              petX: p.petX,
              petY: p.petY,
            })),
            nearTerminal: !!m && Math.hypot(m.x - LOBBY_CUSTOMIZE_TERMINAL.x, m.y - LOBBY_CUSTOMIZE_TERMINAL.y) <= 95,
            nowMs,
          });
        }

        hudSyncAcc += dt;
        if (hudSyncAcc >= 0.12) {
          hudSyncAcc = 0;
          setPlayers(playersRef.current);
        }
      } else if (phaseRef.current === "playing") {
        elapsedSecRef.current += dt;
        const mDef = activeMapRef.current;
        const curPlayers = { ...playersRef.current };
        const curMe = curPlayers[myId];
        const doorsClosedNow = doorsLockedTimerRef.current > 0 || sabotageRef.current?.type === "doors";
        const activeBlockers = doorsClosedNow ? mapDoorBlockersRef.current : [];
        const watchingCameraNow = cameraWatchTimerRef.current > 0;

        // Tick local player movement if not in modal/vent/surveillance camera
        if (curMe && !curMe.inVent && !activeTaskIdRef.current && !watchingCameraNow) {
          const keys = keysPressedRef.current;
          let ix = joystickRef.current.vx;
          let iy = joystickRef.current.vy;
          if (keys.has(kb.moveUp) || keys.has("ArrowUp")) iy -= 1;
          if (keys.has(kb.moveDown) || keys.has("ArrowDown")) iy += 1;
          if (keys.has(kb.moveLeft) || keys.has("ArrowLeft")) ix -= 1;
          if (keys.has(kb.moveRight) || keys.has("ArrowRight")) ix += 1;
          const len = Math.hypot(ix, iy);
          if (len > 1) {
            ix /= len;
            iy /= len;
          }

          const gFx = computeGimmickEffects({
            x: curMe.x,
            y: curMe.y,
            floor: curMe.floor || 1,
            mapDef: mDef,
            enabled: settingsRef.current.enableMapGimmicks && curMe.alive,
            elapsedSec: elapsedSecRef.current,
          });

          const isGhostPlayer = !curMe.alive && !curMe.isSpectator;
          const speedBoost = isGhostPlayer ? 1.15 : 1;
          const targetVx = ix * PLAYER_BASE_SPEED * settingsRef.current.playerSpeed * speedBoost * gFx.speedMul + gFx.pushVx;
          const targetVy = iy * PLAYER_BASE_SPEED * settingsRef.current.playerSpeed * speedBoost * gFx.speedMul + gFx.pushVy;
          const vx = gFx.onIce ? curMe.vx + (targetVx - curMe.vx) * Math.min(1, dt * 4.5) : targetVx;
          const vy = gFx.onIce ? curMe.vy + (targetVy - curMe.vy) * Math.min(1, dt * 4.5) : targetVy;

          const moved = moveWithSlide(
            curMe.x,
            curMe.y,
            vx * dt,
            vy * dt,
            mDef,
            !curMe.alive || !!curMe.isSpectator,
            curMe.floor || 1,
            doorsClosedNow,
            activeBlockers
          );

          const facing: 1 | -1 = ix < -0.05 ? -1 : ix > 0.05 ? 1 : curMe.facing;
          if (Math.hypot(vx, vy) > 40 && curMe.alive) {
            stepSoundCdRef.current -= dt;
            if (stepSoundCdRef.current <= 0) {
              stepSoundCdRef.current = 0.28;
              soundEngine.playStep();
            }
          }

          // Tutorial STEP 1 auto-advance when walking outside Cafeteria or moving > 220px
          if (tutorialStepRef.current === 1) {
            const room = getRoomName(moved.x, moved.y, mDef, curMe.floor || 1);
            if (room !== "カフェテリア" || Math.hypot(moved.x - 990, moved.y - 280) > 220) {
              setTutorialStep(2);
            }
          }

          // Doorlog sensor check
          if (curMe.alive) {
            const curRoom = getRoomName(moved.x, moved.y, mDef, curMe.floor || 1);
            const prevRoom = doorLogZonesRef.current[myId];
            if (curRoom !== prevRoom && curRoom !== "連絡通路") {
              doorLogZonesRef.current[myId] = curRoom;
              if (prevRoom) {
                const c = PLAYER_COLORS.find((col) => col.id === curMe.color) || PLAYER_COLORS[0];
                setDoorLogs((dl) => [createDoorLogEntry(curMe, curRoom, elapsedSecRef.current, c.hex), ...dl.slice(0, 49)]);
              }
            }
          }

          curPlayers[myId] = {
            ...curMe,
            x: moved.x,
            y: moved.y,
            vx,
            vy,
            facing,
            cloakZone: curMe.alive ? gFx.inCloakZone : false,
            petX: exponentialLerp(curMe.petX ?? moved.x - facing * 26, moved.x - facing * 26, dt, 10, 260),
            petY: exponentialLerp(curMe.petY ?? moved.y + 12, moved.y + 12, dt, 10, 260),
            postWarpGraceSec: Math.max(0, (curMe.postWarpGraceSec || 0) - dt),
          };
          cameraTargetRef.current = sanitizeCameraPos(
            {
              x: exponentialLerp(cameraTargetRef.current.x, moved.x, dt, 14, 260),
              y: exponentialLerp(cameraTargetRef.current.y, moved.y, dt, 14, 260),
            },
            moved,
            mDef
          );

          netPosAcc += dt;
          if (netPosAcc >= 0.055 && !isOfflineAIRef.current) {
            netPosAcc = 0;
            broadcastPacket({ type: "pos", id: myId, x: moved.x, y: moved.y, vx, vy, floor: curMe.floor || 1, facing });
          }
        } else if (curMe && curMe.isSpectator) {
          const specId = spectateTargetIdRef.current;
          const specTarget = specId ? curPlayers[specId] : null;
          const focusPos = specTarget ? { x: specTarget.x, y: specTarget.y } : { x: curMe.x, y: curMe.y };
          cameraTargetRef.current = sanitizeCameraPos(
            {
              x: exponentialLerp(cameraTargetRef.current.x, focusPos.x, dt, 12, 260),
              y: exponentialLerp(cameraTargetRef.current.y, focusPos.y, dt, 12, 260),
            },
            focusPos,
            mDef
          );
        } else if (curMe && !watchingCameraNow) {
          cameraTargetRef.current = sanitizeCameraPos(
            {
              x: exponentialLerp(cameraTargetRef.current.x, curMe.x, dt, 12, 260),
              y: exponentialLerp(cameraTargetRef.current.y, curMe.y, dt, 12, 260),
            },
            curMe,
            mDef
          );
        }

        // Remote player exponential Lerp
        if (!isOfflineAIRef.current) {
          for (const [rid, tgt] of Object.entries(remoteTargetsRef.current)) {
            const rp = curPlayers[rid];
            if (rp) {
              curPlayers[rid] = {
                ...rp,
                x: exponentialLerp(rp.x, tgt.x, dt, 14, 260),
                y: exponentialLerp(rp.y, tgt.y, dt, 14, 260),
                floor: tgt.floor,
                facing: tgt.facing,
              };
            }
          }
        }

        // Host AI Bot FSM (NavGraph A* pathfinding + tangent obstacle steering + stairs + stuck watchdog)
        if (isHostRef.current && isOfflineAIRef.current && !tutorialStepRef.current) {
          const brains = aiBrainsRef.current;
          const wallSegsF1 = buildWallSegments(mDef, 1, activeBlockers);
          const wallSegsF2 = mDef.hasMultiFloor ? buildWallSegments(mDef, 2, activeBlockers) : wallSegsF1;

          for (const p of Object.values(curPlayers)) {
            if (!p.isAI || !p.alive || p.isSpectator) continue;
            const br = brains[p.id];
            if (!br) continue;

            br.killCd = Math.max(0, br.killCd - dt);
            br.sabCd = Math.max(0, br.sabCd - dt);

            // Detect nearby dead body -> report!
            if (!isImpostorRole(p.role) && p.role !== "jackal") {
              const seenBody = bodiesRef.current.find(
                (b) => (b.floor || 1) === (p.floor || 1) && Math.hypot(b.x - p.x, b.y - p.y) < 110
              );
              if (seenBody && Math.random() < 0.08) {
                startMeeting({
                  isBody: true,
                  callerName: p.name,
                  victimName: seenBody.name,
                  victimColor: seenBody.color,
                  reason: `${p.name} が ${seenBody.name} の死体を発見通報！`,
                });
                break;
              }
            }

            // Impostor / Jackal Kill check
            if ((isImpostorRole(p.role) || p.role === "jackal") && br.killCd <= 0) {
              const pFloor = p.floor || 1;
              const segsForFloor = pFloor === 2 ? wallSegsF2 : wallSegsF1;
              const victim = Object.values(curPlayers).find(
                (v) =>
                  v.id !== p.id &&
                  v.alive &&
                  !v.isSpectator &&
                  (v.floor || 1) === pFloor &&
                  !(isImpostorRole(p.role) && isImpostorRole(v.role)) &&
                  Math.hypot(v.x - p.x, v.y - p.y) < 84
              );
              if (victim) {
                const witnessCount = Object.values(curPlayers).filter(
                  (w) =>
                    w.id !== p.id &&
                    w.id !== victim.id &&
                    w.alive &&
                    !w.isSpectator &&
                    (w.floor || 1) === pFloor &&
                    Math.hypot(w.x - p.x, w.y - p.y) < 280 &&
                    hasLineOfSight(w.x, w.y, p.x, p.y, segsForFloor)
                ).length;

                const allowRisk = settingsRef.current.aiDifficulty === "easy" ? witnessCount <= 1 : witnessCount === 0;
                if (allowRisk && !victim.shielded) {
                  br.killCd = settingsRef.current.killCooldown;
                  curPlayers[victim.id] = {
                    ...victim,
                    alive: false,
                    inVent: false,
                    ventIndex: -1,
                    invisible: false,
                    disguisedAs: null,
                  };
                  const body: DeadBody = {
                    id: `b_${Date.now()}_${victim.id}`,
                    playerId: victim.id,
                    name: victim.name,
                    color: victim.color,
                    x: victim.x,
                    y: victim.y,
                    floor: victim.floor || 1,
                    dissolveTimer: p.role === "viper" ? 20 : null,
                    killerId: p.id,
                    killedAt: Date.now(),
                  };
                  bodiesRef.current = [...bodiesRef.current, body];
                  setBodies(bodiesRef.current);
                  if (victim.id === myId) {
                    cameraWatchTimerRef.current = 0;
                    setCameraWatchTimer(0);
                    setActiveTaskId(null);
                    setOpenSabotageModal(false);
                    setTerminalMode(null);
                    soundEngine.playKill();
                    setKillFlash(true);
                    setTimeout(() => setKillFlash(false), 900);
                    triggerKillCutIn(p, victim);
                  }
                  pushTimeline(`🔪 暗殺発生: ${victim.name}`);
                }
              }
            }

            // Smart Impostor Door/Lights sabotage when cooldown ready
            if (isImpostorRole(p.role) && br.sabCd <= 0 && !sabotageRef.current && settingsRef.current.aiDifficulty !== "easy") {
              br.sabCd = 34 + Math.random() * 18;
              if (Math.random() < 0.35) {
                const sabType = Math.random() < 0.55 ? "lights" : "doors";
                const sabObj: SabotageState =
                  sabType === "doors"
                    ? { type: "doors", timer: 10, maxTimer: 10 }
                    : { type: "lights", timer: 45, maxTimer: 45 };
                sabotageRef.current = sabObj;
                setSabotage(sabObj);
                if (sabType === "doors") {
                  doorsLockedTimerRef.current = 10;
                  setDoorsLockedTimer(10);
                }
                pushTimeline(`⚡ 妨害発生: ${sabType === "doors" ? "全区画ドア封鎖" : "照明停電"}`);
              }
            }

            const spd = PLAYER_BASE_SPEED * 0.88 * settingsRef.current.playerSpeed;
            const stepRes = stepAiLocomotion(p, br, mDef, dt, spd, doorsClosedNow, activeBlockers);
            curPlayers[p.id] = stepRes.nextPlayer;
            if (stepRes.completedTaskId) {
              let doneCnt = 0;
              let totCnt = 0;
              Object.values(curPlayers).forEach((cp) => {
                if (cp.isSpectator || !hasTasksRole(cp.role)) return;
                totCnt += cp.tasks.length;
                cp.tasks.forEach((tid) => {
                  if (cp.completedTasks[tid]) doneCnt++;
                });
              });
              const win = checkWinCondition(curPlayers, sabotageRef.current, doneCnt, totCnt);
              if (win) {
                playersRef.current = curPlayers;
                concludeMatchWithResult(win.winner, win.reason, curPlayers);
                break;
              }
            }
          }
        }

        // GUARD_07: Periodic RuntimeHealthGuard (every ~1s)
        healthGuardAccRef.current += dt;
        if (healthGuardAccRef.current >= 1.0) {
          healthGuardAccRef.current = 0;
          const chk = runRuntimeHealthCheck(curPlayers, mDef);
          if (chk.repaired) {
            Object.assign(curPlayers, chk.nextPlayers);
          }
          // Check Viper dissolving bodies
          if (bodiesRef.current.some((b) => b.dissolveTimer !== null)) {
            const nextBodies = bodiesRef.current
              .map((b) => (b.dissolveTimer !== null ? { ...b, dissolveTimer: b.dissolveTimer - 1 } : b))
              .filter((b) => b.dissolveTimer === null || b.dissolveTimer > 0);
            bodiesRef.current = nextBodies;
            setBodies(nextBodies);
          }
        }

        playersRef.current = curPlayers;

        // Render Game Canvas
        if (gameCanvasRef.current && curPlayers[myId]) {
          const spots = cameraSpotsRef.current;
          const activeSpot = spots[cameraFeedIndexRef.current % Math.max(1, spots.length)];
          const camWatchOn = cameraWatchTimerRef.current > 0;
          const camPos = camWatchOn && activeSpot ? { x: activeSpot.x, y: activeSpot.y } : null;
          const camFloor = camWatchOn && activeSpot ? activeSpot.floor || 1 : null;
          const specId = spectateTargetIdRef.current;
          const spectated = curPlayers[myId].isSpectator && specId ? curPlayers[specId] : null;
          const drawTarget = spectated ? spectated : cameraTargetRef.current;

          renderGameCanvas({
            canvas: gameCanvasRef.current,
            mapDef: mDef,
            me: curPlayers[myId],
            cameraTarget: drawTarget,
            players: curPlayers,
            bodies: bodiesRef.current,
            sabotage: sabotageRef.current,
            visionRadius: visionRadiusRef.current,
            myTasks: curPlayers[myId].tasks,
            completedTasks: curPlayers[myId].completedTasks,
            showNavArrows: hudSettingsRef.current.showNavArrows,
            footprints: footprintsRef.current,
            radarTarget: radarTargetRef.current,
            teleporterPad: teleporterPadRef.current,
            killBursts: killBurstsRef.current,
            cameraWatchFloor: camFloor,
            cameraFeedPos: camPos,
            anyCameraActive: camWatchOn,
            doorBlockers: activeBlockers,
            steamActive: steamActiveRef.current,
            matchElapsedSec: elapsedSecRef.current,
            trackerTargetId: trackerTargetIdRef.current,
            tutorialStep: tutorialStepRef.current,
            viewFloorOverride: spectated ? spectated.floor || 1 : null,
            nowMs,
          });
        }

        // Sync React HUD state (~8Hz) & cooldowns
        hudSyncAcc += dt;
        if (hudSyncAcc >= 0.125) {
          const tick = hudSyncAcc;
          hudSyncAcc = 0;
          setPlayers(curPlayers);
          setKillCooldown((v) => Math.max(0, v - tick));
          setSabotageCooldown((v) => Math.max(0, v - tick));
          setAbilityCooldown((v) => Math.max(0, v - tick));
          setVentCooldown((v) => Math.max(0, v - tick));
          setEmergencyCooldown((v) => Math.max(0, v - tick));
          setGhostCooldown((v) => Math.max(0, v - tick));
          if (doorsLockedTimerRef.current > 0) {
            const nextDoors = Math.max(0, doorsLockedTimerRef.current - tick);
            doorsLockedTimerRef.current = nextDoors;
            setDoorsLockedTimer(nextDoors);
          }
          if (cameraWatchTimerRef.current > 0) {
            const nextCamWatch = Math.max(0, cameraWatchTimerRef.current - tick);
            cameraWatchTimerRef.current = nextCamWatch;
            let forceClose = nextCamWatch <= 0;
            if (settingsRef.current.cameraBatteryLimit) {
              const nextBat = Math.max(0, cameraBatteryPctRef.current - tick * 4.5);
              cameraBatteryPctRef.current = nextBat;
              setCameraBatteryPct(nextBat);
              if (nextBat <= 0) forceClose = true;
            }
            setCameraWatchTimer(forceClose ? 0 : nextCamWatch);
            if (forceClose) {
              cameraWatchTimerRef.current = 0;
              if (curPlayers[myId]) {
                cameraTargetRef.current = sanitizeCameraPos(
                  { x: curPlayers[myId].x, y: curPlayers[myId].y },
                  mDef.emergency,
                  mDef
                );
              }
            }
          }
          if (meteorTimerRef.current > 0) {
            const nextMeteor = Math.max(0, meteorTimerRef.current - tick);
            meteorTimerRef.current = nextMeteor;
            setMeteorTimer(nextMeteor);
            if (nextMeteor <= 0) setMeteorActive(false);
          }
          if (ventStayTimerRef.current !== null) {
            const nextVentStay = ventStayTimerRef.current - tick;
            if (nextVentStay <= 0) {
              ventStayTimerRef.current = null;
              setVentStayTimer(null);
              setPlayers((prev) => ({ ...prev, [myId]: { ...prev[myId], inVent: false, ventIndex: -1 } }));
              setVentCooldown(18);
            } else {
              ventStayTimerRef.current = nextVentStay;
              setVentStayTimer(nextVentStay);
            }
          }
          for (const k of Object.keys(gimmickCooldownsRef.current)) {
            gimmickCooldownsRef.current[k] = Math.max(0, gimmickCooldownsRef.current[k] - tick);
          }
          if (sabotageRef.current) {
            const ns = { ...sabotageRef.current, timer: Math.max(0, sabotageRef.current.timer - tick) };
            sabotageRef.current = ns.timer <= 0 && ns.type === "doors" ? null : ns;
            setSabotage(sabotageRef.current);
            if (!tutorialStepRef.current && (ns.type === "reactor" || ns.type === "gas") && ns.timer <= 0) {
              const win = checkWinCondition(
                curPlayers,
                ns,
                taskCompletedCountRef.current,
                taskTotalCountRef.current
              );
              if (win) {
                concludeMatchWithResult(win.winner, win.reason, curPlayers);
              }
            }
          }
        }
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [
    phase,
    myId,
    broadcastPacket,
    pushTimeline,
    startMeeting,
    triggerKillCutIn,
    concludeMatchWithResult,
  ]);

  // Derived Action States for GameHud
  const nearby = useMemo(
    () => findNearbyInteractable(me, players, bodies, activeMap, sabotage),
    [me, players, bodies, activeMap, sabotage]
  );

  const useActionState = useMemo(
    () =>
      getUseActionState({
        me,
        mapDef: activeMap,
        sabotage,
        myTasks: me.tasks,
        completedTasks: me.completedTasks,
        gimmickCooldowns: gimmickCooldownsRef.current,
        emergencyCooldown,
        emergencyUsesLeft,
      }),
    [me, activeMap, sabotage, emergencyCooldown, emergencyUsesLeft]
  );

  const reportActionState = useMemo(
    () => ({
      label: nearby.nearestBody ? `📢 通報 (${nearby.nearestBody.name})` : "📢 通報",
      enabled: validateAliveReporter(me) && !!nearby.nearestBody,
    }),
    [me, nearby.nearestBody]
  );

  const killActionState = useMemo(() => {
    const canKill = isImpostorRole(me.role) || me.role === "sheriff" || me.role === "jackal" || me.role === "arsonist";
    if (!canKill) return { label: "", enabled: false };
    const base = me.role === "arsonist" ? "🛢️ 塗布" : me.role === "sheriff" ? "🤠 成敗" : "🔪 キル";
    return {
      label: killCooldown > 0 ? `${base} (${Math.ceil(killCooldown)}s)` : base,
      enabled: killCooldown <= 0 && !!nearby.nearestKill,
    };
  }, [me.role, killCooldown, nearby.nearestKill]);

  const ventActionState = useMemo(() => {
    if (!canUseVentRole(me.role)) return { label: "", enabled: false };
    return {
      label: me.inVent ? "🕳️ ベント退出" : ventCooldown > 0 ? `🕳️ (${Math.ceil(ventCooldown)}s)` : "🕳️ ベント",
      enabled: me.inVent || (ventCooldown <= 0 && nearby.nearestVentIdx >= 0),
    };
  }, [me.role, me.inVent, ventCooldown, nearby.nearestVentIdx]);

  const sabotageActionState = useMemo(() => {
    if (!isImpostorRole(me.role)) return { label: "", enabled: false };
    return {
      label: sabotageCooldown > 0 ? `⚡ 妨害 (${Math.ceil(sabotageCooldown)}s)` : "⚡ 妨害",
      enabled: sabotageCooldown <= 0 && !sabotage,
    };
  }, [me.role, sabotageCooldown, sabotage]);

  const abilityActionState = useMemo(() => {
    const labelMap: Partial<Record<string, string>> = {
      engineer: "🔧 遠隔修理",
      doctor: "🩺 保護/蘇生",
      phantom: "👻 透明化",
      shapeshifter: "🎭 変身",
      radar: "📡 探知",
      security: "📹 監視",
      tracker: "🛰️ GPS",
      teleporter: teleporterPad ? "⚡ 帰還" : "⚡ 記憶",
      survivor: `🛡️ 盾 (${survivorShieldsLeft})`,
      arsonist: "🔥 全員点火",
    };
    const l = labelMap[me.role];
    if (!l) return { label: "", enabled: false };
    return {
      label: abilityCooldown > 0 ? `${l} (${Math.ceil(abilityCooldown)}s)` : l,
      enabled: abilityCooldown <= 0,
    };
  }, [me.role, abilityCooldown, teleporterPad, survivorShieldsLeft]);

  const activeCameraSpot = cameraSpots[cameraFeedIndex % Math.max(1, cameraSpots.length)];

  const handleLeaveMatchMidGame = useCallback(() => {
    if ((phaseRef.current === "playing" || phaseRef.current === "meeting") && !tutorialStepRef.current) {
      concludeMatchWithResult("forfeit", "途中離脱", playersRef.current, true);
      setToastTitle("⚠️ 途中退出したため進行中の豆通貨は没収されました");
      window.setTimeout(() => setToastTitle(null), 3500);
    }
    cleanupNetwork();
    setActiveTaskId(null);
    setKillCutIn(null);
    setPhase("title");
  }, [cleanupNetwork, concludeMatchWithResult]);

  const handleEquipShopItem = useCallback(
    (kind: "hat" | "skin" | "visor" | "pet" | "nameplate", id: string) => {
      if (kind === "hat") {
        setMyHat(id);
        updateMyLobbyAppearance({ hat: id });
      } else if (kind === "skin") {
        setMySkin(id);
        updateMyLobbyAppearance({ skin: id });
      } else if (kind === "visor") {
        setMyVisor(id);
        updateMyLobbyAppearance({ visor: id });
      } else if (kind === "pet") {
        setMyPet(id);
        updateMyLobbyAppearance({ pet: id });
      } else if (kind === "nameplate") {
        setMyNameplate(id);
        updateMyLobbyAppearance({ nameplate: id });
      }
    },
    [updateMyLobbyAppearance]
  );

  const handlePurchaseShopItem = useCallback(
    (kind: "hat" | "skin" | "visor" | "pet" | "nameplate", id: string, costBeans: number) => {
      const key = makeItemKey(kind, id);
      setProgression((prev) => {
        if (prev.beans < costBeans || prev.unlockedItems.includes(key)) return prev;
        return {
          ...prev,
          beans: prev.beans - costBeans,
          unlockedItems: [...prev.unlockedItems, key],
        };
      });
    },
    []
  );

  const handleUnlockCube = useCallback((cubeId: string, costBeans: number) => {
    setProgression((prev) => {
      if (prev.beans < costBeans || prev.unlockedCubes.includes(cubeId)) return prev;
      return {
        ...prev,
        beans: prev.beans - costBeans,
        unlockedCubes: [...prev.unlockedCubes, cubeId],
        activeCubeId: prev.activeCubeId || cubeId,
      };
    });
  }, []);

  const handleActivateCube = useCallback((cubeId: string) => {
    setProgression((prev) =>
      prev.unlockedCubes.includes(cubeId) ? { ...prev, activeCubeId: cubeId } : prev
    );
  }, []);

  const handleUnlockCubeNode = useCallback((_cubeId: string, node: CosmicubeNodeDef) => {
    const rewardKey = makeItemKey(node.rewardKind, node.rewardId);
    setProgression((prev) => {
      if (prev.beans < node.costBeans || prev.unlockedCubeNodes.includes(node.id)) return prev;
      return {
        ...prev,
        beans: prev.beans - node.costBeans,
        unlockedCubeNodes: [...prev.unlockedCubeNodes, node.id],
        unlockedItems: prev.unlockedItems.includes(rewardKey)
          ? prev.unlockedItems
          : [...prev.unlockedItems, rewardKey],
      };
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col">
      {phase === "title" && (
        <TitleScreen
          myName={myName}
          myColor={myColor}
          myHat={myHat}
          myVisor={myVisor}
          myPet={myPet}
          mySkin={mySkin}
          beans={progression.beans}
          level={progression.level}
          selectedMapId={settings.mapId}
          aiCount={settings.aiCount}
          taskDifficulty={settings.taskDifficulty}
          joinCode={joinCode}
          networkStatus={networkStatus}
          onChangeName={setMyName}
          onChangeJoinCode={setJoinCode}
          onChangeAiCount={(n) => setSettings((s) => ({ ...s, aiCount: n }))}
          onChangeTaskDifficulty={(d) => setSettings((s) => ({ ...s, taskDifficulty: d }))}
          onCreateOnlineRoom={handleCreateOnlineRoom}
          onJoinOnlineRoom={handleJoinOnlineRoom}
          onStartAISolo={handleStartAISolo}
          onStartTutorial={handleStartTutorial}
          onOpenTutorialModal={() => setOpenTutorialModal(true)}
          onOpenMapSelector={() => setOpenMapSelector(true)}
          onOpenCustomize={() => setOpenCustomize(true)}
          onOpenShop={() => setOpenShop(true)}
          onOpenRolesGuide={() => setOpenRolesGuide(true)}
          onOpenAchievements={() => setOpenAchievements(true)}
          onOpenKeybinds={() => setOpenKeybinds(true)}
          onOpenSettings={() => setOpenSettings(true)}
        />
      )}

      {phase === "lobby" && (
        <LobbyScreen
          lobbyCanvasRef={lobbyCanvasRef}
          isHost={isHost}
          isOfflineAI={isOfflineAI}
          roomCode={roomCode}
          networkStatus={networkStatus}
          pingMs={pingMs}
          me={me}
          players={players}
          settings={settings}
          chatHistory={chatHistory}
          nearTerminal={Math.hypot(me.x - LOBBY_CUSTOMIZE_TERMINAL.x, me.y - LOBBY_CUSTOMIZE_TERMINAL.y) <= 95}
          beans={progression.beans}
          level={progression.level}
          onUpdateSettings={(patch) => {
            setSettings((prev) => {
              const next = { ...prev, ...patch };
              broadcastPacket({ type: "lobby_sync", settings: next });
              return next;
            });
          }}
          onStartMatch={startMatchAsHost}
          onOpenCustomize={() => setOpenCustomize(true)}
          onOpenShop={() => setOpenShop(true)}
          onOpenMapSelector={() => setOpenMapSelector(true)}
          onOpenRolesGuide={() => setOpenRolesGuide(true)}
          onOpenTutorialModal={() => setOpenTutorialModal(true)}
          onOpenSettings={() => setOpenSettings(true)}
          onSendChat={handleSendChat}
          onLeaveLobby={() => {
            cleanupNetwork();
            setPhase("title");
          }}
          onKickPlayer={(pid) => {
            setPlayers((prev) => {
              const copy = { ...prev };
              delete copy[pid];
              return copy;
            });
          }}
          onOpenTerminalFromClick={() => setOpenCustomize(true)}
          onClearKeys={clearKeys}
        />
      )}

      {(phase === "playing" || phase === "meeting" || phase === "gameover") && (
        <GameHud
          gameCanvasRef={gameCanvasRef}
          me={me}
          players={players}
          mapDef={activeMap}
          roomName={getRoomName(me.x, me.y, activeMap, me.floor || 1)}
          visionRadius={visionRadius}
          taskCompletedCount={taskCompletedCount}
          taskTotalCount={taskTotalCount}
          sabotage={sabotage}
          myTasks={me.tasks}
          completedTasks={me.completedTasks}
          gimmickStatusText={gimmickStatusText}
          showTaskList={hudSettings.showTaskList}
          cameraWatchTimer={cameraWatchTimer}
          cameraFeedLabel={activeCameraSpot?.label || "監視フィード"}
          cameraFeedCount={Math.max(1, cameraSpots.length)}
          cameraFeedIndex={cameraFeedIndex % Math.max(1, cameraSpots.length)}
          cameraBatteryPct={cameraBatteryPct}
          cameraBatteryLimitEnabled={settings.cameraBatteryLimit}
          meteorActive={meteorActive}
          meteorTimer={meteorTimer}
          currentVentIndex={me.ventIndex}
          ventStayTimer={ventStayTimer}
          pingMs={isOfflineAI ? null : pingMs}
          tutorialStepDef={tutorialStep ? TUTORIAL_STEPS.find((s) => s.step === tutorialStep) || null : null}
          onExitTutorial={() => {
            setTutorialStep(null);
            setPhase("title");
          }}
          onLeaveMatch={handleLeaveMatchMidGame}
          onSwitchCameraFeed={(delta) =>
            setCameraFeedIndex((i) => (i + delta + Math.max(1, cameraSpots.length)) % Math.max(1, cameraSpots.length))
          }
          onSelectCameraFeed={(idx) =>
            setCameraFeedIndex(Math.max(0, Math.min(Math.max(0, cameraSpots.length - 1), idx)))
          }
          onCloseCamera={() => {
            cameraWatchTimerRef.current = 0;
            setCameraWatchTimer(0);
            const curMe = playersRef.current[myId];
            if (curMe) {
              cameraTargetRef.current = sanitizeCameraPos(
                { x: curMe.x, y: curMe.y },
                activeMapRef.current.emergency,
                activeMapRef.current
              );
            }
          }}
          onJumpToVent={handleJumpToVent}
          onExitVent={handleVent}
          onOpenMap={() => setOpenMapModal(true)}
          onOpenSettings={() => setOpenSettings(true)}
          onOpenKeybinds={() => setOpenKeybinds(true)}
          onOpenRolesGuide={() => setOpenRolesGuide(true)}
          useActionState={useActionState}
          reportActionState={reportActionState}
          killActionState={killActionState}
          ventActionState={ventActionState}
          sabotageActionState={sabotageActionState}
          abilityActionState={abilityActionState}
          ghostAssistState={{
            label: ghostCooldown > 0 ? `👻 アシスト (${Math.ceil(ghostCooldown)}s)` : "👻 味方アシスト",
            enabled: ghostCooldown <= 0,
          }}
          ghostPrankState={{
            label: ghostCooldown > 0 ? `👻 イタズラ` : "👻 イタズラ",
            enabled: ghostCooldown <= 0,
          }}
          onUse={handleUse}
          onReport={handleReport}
          onKill={handleKill}
          onVent={handleVent}
          onSabotage={() => setOpenSabotageModal(true)}
          onAbility={handleAbility}
          onGhostAssist={() => {
            setGhostCooldown(18);
            const curMe = playersRef.current[myId];
            if (curMe) {
              const nextTid = curMe.tasks.find((tid) => !curMe.completedTasks[tid]);
              const nextSpot = nextTid ? activeMapRef.current.taskSpots.find((s) => s.taskId === nextTid) : null;
              if (nextSpot) {
                setRadarTarget({ x: nextSpot.x, y: nextSpot.y });
                window.setTimeout(() => setRadarTarget(null), 5000);
              }
            }
            setProgression((prev) => ({ ...prev, ghostAssists: prev.ghostAssists + 1 }));
            unlockAchievements(["ghost_helper"]);
            setToastTitle("👻 ゴーストアシスト発動！味方にエール＆目標ピンを送信");
            window.setTimeout(() => setToastTitle(null), 2600);
          }}
          onGhostPrank={() => {
            setGhostCooldown(16);
            setSteamActive(true);
            window.setTimeout(() => setSteamActive(false), 3200);
            setToastTitle("👻 ポルターガイスト発動！艦内にミスト発生");
            window.setTimeout(() => setToastTitle(null), 2400);
          }}
          onToggleGhostFloor={() => {
            const curMe = playersRef.current[myId];
            if (!curMe || curMe.alive || curMe.isSpectator) return;
            const nextFloor = (curMe.floor || 1) === 2 ? 1 : 2;
            const safe = resolveSafePos(curMe.x, curMe.y, activeMapRef.current, nextFloor, true);
            const patch = buildTeleportSyncPatch(safe.x, safe.y, nextFloor);
            cameraTargetRef.current = sanitizeCameraPos({ x: safe.x, y: safe.y }, activeMapRef.current.emergency, activeMapRef.current);
            setPlayers((prev) => ({ ...prev, [myId]: { ...prev[myId], ...patch } }));
            broadcastPacket({ type: "player_patch", id: myId, patch });
          }}
          onJoystickChange={(vx, vy) => {
            joystickRef.current = { vx, vy };
          }}
          keybinds={keybinds}
          inGameChatEnabled={settings.inGameChat}
          chatHistory={chatHistory}
          onSendChat={handleSendChat}
          onClearKeys={clearKeys}
          spectateTargetId={spectateTargetId}
          onCycleSpectateTarget={() => {
            const alive = Object.values(players).filter((p) => p.alive && !p.isSpectator);
            if (!alive.length) return;
            const idx = alive.findIndex((p) => p.id === spectateTargetId);
            setSpectateTargetId(alive[(idx + 1) % alive.length].id);
          }}
          unreadChatCount={unreadChatCount}
          chatOpen={chatOpen}
          onToggleChat={() => {
            setChatOpen((v) => !v);
            setUnreadChatCount(0);
          }}
        />
      )}

      {/* Global Shared Modals */}
      <LobbyCustomizeModal
        open={openCustomize}
        myId={myId}
        myName={myName}
        myColor={myColor}
        mySkin={mySkin}
        myHat={myHat}
        myVisor={myVisor}
        myPet={myPet}
        myNameplate={myNameplate}
        myKillEffect={myKillEffect}
        players={players}
        progression={progression}
        onChangeName={(name) => {
          setMyName(name);
          updateMyLobbyAppearance({ name });
        }}
        onChangeColor={(color) => {
          setMyColor(color);
          updateMyLobbyAppearance({ color });
        }}
        onChangeSkin={(skin) => {
          setMySkin(skin);
          updateMyLobbyAppearance({ skin });
        }}
        onChangeHat={(hat) => {
          setMyHat(hat);
          updateMyLobbyAppearance({ hat });
        }}
        onChangeVisor={(visor) => {
          setMyVisor(visor);
          updateMyLobbyAppearance({ visor });
        }}
        onChangePet={(pet) => {
          setMyPet(pet);
          updateMyLobbyAppearance({ pet });
        }}
        onChangeNameplate={(nameplate) => {
          setMyNameplate(nameplate);
          updateMyLobbyAppearance({ nameplate });
        }}
        onChangeKillEffect={(killEffect) => {
          setMyKillEffect(killEffect);
          updateMyLobbyAppearance({ killEffect });
        }}
        onToggleSandbox={() =>
          setProgression((prev) => ({ ...prev, sandboxUnlockAll: !prev.sandboxUnlockAll }))
        }
        onOpenShop={() => setOpenShop(true)}
        onClose={() => setOpenCustomize(false)}
      />

      <ShopAndCubesModal
        open={openShop}
        progression={progression}
        myColor={myColor}
        onPurchaseItem={handlePurchaseShopItem}
        onUnlockCube={handleUnlockCube}
        onActivateCube={handleActivateCube}
        onUnlockCubeNode={handleUnlockCubeNode}
        onEquipItem={handleEquipShopItem}
        onClose={() => setOpenShop(false)}
      />

      <MapSelectorModal
        open={openMapSelector}
        selectedMapId={settings.mapId}
        onSelectMap={(mapId) => {
          setSettings((prev) => {
            const next = { ...prev, mapId };
            broadcastPacket({ type: "lobby_sync", settings: next, mapId });
            return next;
          });
          if (mapId !== "random") setActiveMap(getMapById(mapId));
        }}
        onClose={() => setOpenMapSelector(false)}
      />

      <TutorialAndRulesModal
        open={openTutorialModal}
        onStartInteractiveTutorial={handleStartTutorial}
        onClose={() => setOpenTutorialModal(false)}
      />

      <RolesGuideModal open={openRolesGuide} onClose={() => setOpenRolesGuide(false)} />

      <KeybindsModal
        open={openKeybinds}
        keybinds={keybinds}
        onChangeKeybinds={setKeybinds}
        onClose={() => setOpenKeybinds(false)}
      />

      <SettingsModal
        open={openSettings}
        hudSettings={hudSettings}
        onChangeHudSettings={setHudSettings}
        bgmVolume={audioCfg.bgmVolume}
        sfxVolume={audioCfg.sfxVolume}
        bgmMuted={audioCfg.bgmMuted}
        sfxMuted={audioCfg.sfxMuted}
        onChangeAudio={setAudioCfg}
        networkModeLabel={isOfflineAI ? "AIオフライン演習モード" : networkStatus}
        onClose={() => setOpenSettings(false)}
      />

      <AchievementsModal
        open={openAchievements}
        progression={progression}
        onToggleSandbox={() =>
          setProgression((prev) => ({ ...prev, sandboxUnlockAll: !prev.sandboxUnlockAll }))
        }
        onClose={() => setOpenAchievements(false)}
      />

      <MapModal
        open={openMapModal}
        mapDef={activeMap}
        me={me}
        players={players}
        myTasks={me.tasks}
        completedTasks={me.completedTasks}
        sabotage={sabotage}
        trackerTargetId={trackerTargetId}
        onClose={() => setOpenMapModal(false)}
      />

      <SabotageModal
        open={openSabotageModal}
        mapDef={activeMap}
        sabotageCooldown={sabotageCooldown}
        activeSabotage={sabotage}
        onTrigger={(type) => {
          const sab: SabotageState = {
            type,
            timer: type === "doors" ? 10 : 45,
            maxTimer: type === "doors" ? 10 : 45,
          };
          sabotageRef.current = sab;
          setSabotage(sab);
          setSabotageCooldown(me.role === "madscientist" ? 18 : 28);
          soundEngine.playSabotage();
          broadcastPacket({ type: "sabotage_set", sabotage: sab });
        }}
        onClose={() => setOpenSabotageModal(false)}
      />

      <TerminalModal
        open={!!terminalMode}
        mode={terminalMode || "vitals"}
        players={players}
        doorLogs={doorLogs}
        batteryPct={cameraBatteryPct}
        batteryLimitEnabled={settings.cameraBatteryLimit}
        onClose={() => setTerminalMode(null)}
      />

      <TaskModal
        taskId={activeTaskId}
        difficulty={settings.taskDifficulty}
        onComplete={handleCompleteTask}
        onClose={() => setActiveTaskId(null)}
      />

      <MeetingModal
        open={phase === "meeting"}
        me={me}
        players={players}
        meetingTitle={meetingInfo.title}
        meetingReason={meetingInfo.reason}
        meetingTimer={meetingInfo.timer}
        votedPlayers={meetingInfo.votedPlayers}
        myVoteTarget={meetingInfo.votes[myId] || null}
        voteCounts={meetingInfo.voteCounts}
        anonymousVoting={settings.anonymousVoting}
        chatHistory={chatHistory}
        onCastVote={handleCastVote}
        onSendChat={handleSendChat}
        onClearKeys={clearKeys}
      />

      {/* Dramatic Overlays */}
      <RoleRevealOverlay
        open={roleRevealOpen}
        me={me}
        players={players}
        onDismiss={() => setRoleRevealOpen(false)}
      />
      <ReportCutInOverlay
        open={cutInState.open}
        isBodyReport={cutInState.isBody}
        callerName={cutInState.caller}
        victimName={cutInState.victimName}
        victimColor={cutInState.victimColor}
      />
      <KillFlashOverlay active={killFlash} />
      <KillCutInOverlay data={killCutIn} />
      <EjectionOverlay
        open={ejectionState.open}
        message={ejectionState.message}
        ejectedColor={ejectionState.color}
      />
      <GameOverOverlay
        open={gameOverState.open}
        winner={gameOverState.winner}
        reason={gameOverState.reason}
        players={players}
        timeline={timeline}
        newlyUnlocked={gameOverState.newlyUnlocked}
        beanReward={beanRewardState}
        progression={progression}
        isHost={isHost}
        onPlayAgain={() => {
          setGameOverState({ open: false, winner: "crewmates", reason: "", newlyUnlocked: [] });
          setBeanRewardState(null);
          setPhase("lobby");
        }}
        onReturnTitle={() => {
          cleanupNetwork();
          setGameOverState({ open: false, winner: "crewmates", reason: "", newlyUnlocked: [] });
          setBeanRewardState(null);
          setPhase("title");
        }}
      />
      <AchievementToastOverlay title={toastTitle} />
    </div>
  );
}
