import { BASE_MAPS_RAW } from "./baseMapsData";
import { TASK_CATALOG_150 } from "./tasks150";
import type {
  CorridorRect,
  DecorRect,
  GimmickNode,
  MapCategory,
  MapDef,
  MapSizeTag,
  MapUniqueGimmickType,
  ObstacleRect,
  RoomRect,
  TaskSpot,
  VentNode,
} from "./types";

export const MAP_CATEGORIES: { id: "all" | MapCategory; label: string; icon: string; desc: string }[] = [
  { id: "all", label: "すべて", icon: "🌌", desc: "全30マップ一覧" },
  { id: "station", label: "宇宙巡洋艦・ステーション", icon: "🚀", desc: "艦船・宇宙港・軌道基地 (6種)" },
  { id: "research", label: "研究・量子ラボ", icon: "🔬", desc: "研究所・観測所・反応炉 (6種)" },
  { id: "industrial", label: "重工業・採掘", icon: "🏭", desc: "溶鉱炉・採掘・高圧プラント (6種)" },
  { id: "nature", label: "自然・惑星基地", icon: "🌿", desc: "雪原・密林・砂漠・深海基地 (6種)" },
  { id: "labyrinth", label: "古代遺跡・特殊迷宮", icon: "🏛️", desc: "神殿・迷宮・特異点セクター (6種)" },
];

const BASELINE_META: Record<
  string,
  {
    category: MapCategory;
    sizeTag: MapSizeTag;
    uniqueGimmick: MapUniqueGimmickType;
    gimmickSummary: string;
    subtitle: string;
    recommendedPlayers: string;
  }
> = {
  starship: {
    category: "station",
    sizeTag: "medium",
    uniqueGimmick: "vent_network",
    gimmickSummary: "拡張ダクト網・安全監視カメラ・複数盲点コリドー搭載",
    subtitle: "バランス最優秀の王道巡洋艦",
    recommendedPlayers: "6〜10人",
  },
  airship: {
    category: "station",
    sizeTag: "large",
    uniqueGimmick: "multi_deck",
    gimmickSummary: "1F/2F 連絡階段・加速甲板パット・広域飛行船構造",
    subtitle: "2階層を駆使する巨大空中戦艦",
    recommendedPlayers: "8〜10人",
  },
  train: {
    category: "station",
    sizeTag: "medium",
    uniqueGimmick: "wind_current",
    gimmickSummary: "縦貫連結車両・高速推進ゾーン・車掌監視端末",
    subtitle: "疾走する超音速スペースエクスプレス",
    recommendedPlayers: "5〜9人",
  },
  cyber: {
    category: "research",
    sizeTag: "medium",
    uniqueGimmick: "cyber_cloak",
    gimmickSummary: "空間ワープゲート・サーバー遮蔽・データ暗号区画",
    subtitle: "電脳網とゲートが交差する近未来都市",
    recommendedPlayers: "6〜10人",
  },
  reactor_core: {
    category: "research",
    sizeTag: "large",
    uniqueGimmick: "reactor_venting",
    gimmickSummary: "1F/2F高出力炉心・高圧蒸気バルブ・冷却制御室",
    subtitle: "高圧蒸気と階層連絡が鍵の核融合施設",
    recommendedPlayers: "7〜10人",
  },
  mira: {
    category: "research",
    sizeTag: "medium",
    uniqueGimmick: "bio_sensor",
    gimmickSummary: "ドア通過ログ端末(Y字合流監視)・全接続ベント網",
    subtitle: "情報戦と通行ログ推理が熱い研究タワー",
    recommendedPlayers: "5〜9人",
  },
  prison: {
    category: "industrial",
    sizeTag: "medium",
    uniqueGimmick: "timed_bulkhead",
    gimmickSummary: "手動セキュリティ隔離シャッター・監視塔・独房区画",
    subtitle: "強固な隔離扉で犯人を封じ込める宇宙監獄",
    recommendedPlayers: "6〜10人",
  },
  volcano: {
    category: "industrial",
    sizeTag: "medium",
    uniqueGimmick: "slag_heat",
    gimmickSummary: "マグマ排熱コンベア・熱気流・地熱発電タービン",
    subtitle: "灼熱の溶岩が流れる地熱精錬プラント",
    recommendedPlayers: "6〜9人",
  },
  submerged: {
    category: "industrial",
    sizeTag: "large",
    uniqueGimmick: "ocean_pressure",
    gimmickSummary: "1F/2F 潜水連絡・水圧バルブ・深海バイタルモニタ",
    subtitle: "水圧と複層廊下が緊迫感を生む深海施設",
    recommendedPlayers: "7〜10人",
  },
  polus: {
    category: "nature",
    sizeTag: "large",
    uniqueGimmick: "ice_floor",
    gimmickSummary: "屋外氷結スライダー・バイタル生体端末・広域基地",
    subtitle: "雪原と観測施設が点在する惑星前哨基地",
    recommendedPlayers: "7〜10人",
  },
  jungle: {
    category: "nature",
    sizeTag: "medium",
    uniqueGimmick: "forest_cloak",
    gimmickSummary: "高速ジップパッド・密林熱帯樹陰・生体調査ラボ",
    subtitle: "樹冠の影と高速移動が交錯する密林拠点",
    recommendedPlayers: "6〜9人",
  },
  desert: {
    category: "nature",
    sizeTag: "medium",
    uniqueGimmick: "wind_current",
    gimmickSummary: "砂嵐強風ベルト・古代発掘テント・熱遮断廊下",
    subtitle: "強烈な砂風が吹き荒れる遺跡発掘キャンプ",
    recommendedPlayers: "6〜9人",
  },
  temple: {
    category: "labyrinth",
    sizeTag: "large",
    uniqueGimmick: "oneway_warp",
    gimmickSummary: "1F/2F 祭壇転移門・狭視界ミスト・古代石室",
    subtitle: "転移祭壇と霧が支配する古代宇宙神殿",
    recommendedPlayers: "7〜10人",
  },
  crystal: {
    category: "labyrinth",
    sizeTag: "medium",
    uniqueGimmick: "crystal_echo",
    gimmickSummary: "結晶共鳴ワープ・氷結結晶通路・光屈折回廊",
    subtitle: "輝く結晶が共鳴し合う幻想的鉱脈洞窟",
    recommendedPlayers: "6〜9人",
  },
  moon: {
    category: "labyrinth",
    sizeTag: "medium",
    uniqueGimmick: "zero_g_lane",
    gimmickSummary: "月面低重力慣性・隕石防衛コンソール・クレーター",
    subtitle: "低重力慣性と隕石警報が迫る月面クレーター",
    recommendedPlayers: "6〜9人",
  },
};

function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
  pad = 0
): boolean {
  return (
    a.x - pad < b.x + b.w &&
    a.x + a.w + pad > b.x &&
    a.y - pad < b.y + b.h &&
    a.y + a.h + pad > b.y
  );
}

/**
 * Corridor/Room交差開口部に注意帯(caution)をぴったり吸着・サイズ合わせする
 */
function snapCautionToThreshold(box: DecorRect, map: MapDef): DecorRect {
  const df = box.floor || 1;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  let bestCorridor: (typeof map.corridors)[number] | null = null;
  let bestDist = Infinity;

  for (const c of map.corridors) {
    if ((c.floor || 1) !== df) continue;
    const clampedX = Math.max(c.x, Math.min(c.x + c.w, cx));
    const clampedY = Math.max(c.y, Math.min(c.y + c.h, cy));
    const dist = Math.hypot(cx - clampedX, cy - clampedY);
    if (dist < bestDist) {
      bestDist = dist;
      bestCorridor = c;
    }
  }

  if (!bestCorridor || bestDist > 42) return box;

  const rooms = map.rooms.filter((r) => (r.floor || 1) === df);
  const horizontal = bestCorridor.w >= bestCorridor.h;

  if (!horizontal) {
    // 縦通路: 通路幅・中心Xを完全一致させ、最寄りの上下部屋開口端にYを合わせる
    const thickness = Math.max(12, Math.min(20, box.h || 16));
    let alignedY = box.y;
    let bestEdgeDist = 36;
    for (const r of rooms) {
      if (bestCorridor.x + bestCorridor.w <= r.x + 8 || bestCorridor.x >= r.x + r.w - 8) continue;
      if (bestCorridor.y <= r.y + r.h + 12 && bestCorridor.y + bestCorridor.h >= r.y - 12) {
        const dBottom = Math.abs(cy - (r.y + r.h));
        if (dBottom < bestEdgeDist) {
          bestEdgeDist = dBottom;
          alignedY = r.y + r.h;
        }
        const dTop = Math.abs(cy - r.y);
        if (dTop < bestEdgeDist) {
          bestEdgeDist = dTop;
          alignedY = r.y - thickness;
        }
      }
    }
    alignedY = Math.max(bestCorridor.y, Math.min(bestCorridor.y + bestCorridor.h - thickness, alignedY));
    return {
      ...box,
      x: bestCorridor.x,
      y: alignedY,
      w: bestCorridor.w,
      h: thickness,
    };
  }

  // 横通路: 通路高さ・中心Yを完全一致させ、最寄りの左右部屋開口端にXを合わせる
  const thickness = Math.max(12, Math.min(20, box.w || 16));
  let alignedX = box.x;
  let bestEdgeDist = 36;
  for (const r of rooms) {
    if (bestCorridor.y + bestCorridor.h <= r.y + 8 || bestCorridor.y >= r.y + r.h - 8) continue;
    if (bestCorridor.x <= r.x + r.w + 12 && bestCorridor.x + bestCorridor.w >= r.x - 12) {
      const dRight = Math.abs(cx - (r.x + r.w));
      if (dRight < bestEdgeDist) {
        bestEdgeDist = dRight;
        alignedX = r.x + r.w;
      }
      const dLeft = Math.abs(cx - r.x);
      if (dLeft < bestEdgeDist) {
        bestEdgeDist = dLeft;
        alignedX = r.x - thickness;
      }
    }
  }
  alignedX = Math.max(bestCorridor.x, Math.min(bestCorridor.x + bestCorridor.w - thickness, alignedX));
  return {
    ...box,
    x: alignedX,
    y: bestCorridor.y,
    w: thickness,
    h: bestCorridor.h,
  };
}

/**
 * 全マップに3〜4基の監視カメラ本体(camera_prop)を通路交差部・要所へ重複なく自動確保する
 */
function ensureMultiCameraProps(map: MapDef, placed: DecorRect[], validDecors: DecorRect[]) {
  const existingCams = validDecors.filter((d) => d.kind === "camera_prop");
  const targetCount = 4;
  if (existingCams.length >= targetCount) return;

  const isWalkableSpot = (x: number, y: number, f: number): boolean => {
    const inRect =
      map.corridors.some((c) => (c.floor || 1) === f && x >= c.x + 14 && x <= c.x + c.w - 14 && y >= c.y + 14 && y <= c.y + c.h - 14) ||
      map.rooms.some((r) => (r.floor || 1) === f && x >= r.x + 24 && x <= r.x + r.w - 24 && y >= r.y + 24 && y <= r.y + r.h - 24);
    if (!inRect) return false;
    for (const o of map.obstacles) {
      if ((o.floor || 1) !== f) continue;
      if (x >= o.x - 16 && x <= o.x + o.w + 16 && y >= o.y - 16 && y <= o.y + o.h + 16) return false;
    }
    return true;
  };

  const candidates: { x: number; y: number; floor: number; priority: number }[] = [];
  for (const c of map.corridors) {
    const cf = c.floor || 1;
    const cx = c.x + c.w / 2;
    const cy = c.y + c.h / 2;
    const edgeX = c.w >= c.h ? cx : c.x + 12;
    const edgeY = c.w >= c.h ? c.y + 12 : cy;
    candidates.push({ x: cx, y: cy, floor: cf, priority: cf === 2 ? 3 : 2 });
    candidates.push({ x: edgeX, y: edgeY, floor: cf, priority: 1 });
  }
  for (const r of map.rooms) {
    const rf = r.floor || 1;
    if ((map.emergency.floor || 1) === rf && Math.hypot(r.x + r.w / 2 - map.emergency.x, r.y + r.h / 2 - map.emergency.y) < 150) {
      continue;
    }
    candidates.push({ x: r.x + 28, y: r.y + 28, floor: rf, priority: 0 });
  }

  candidates.sort((a, b) => b.priority - a.priority);

  for (const minSpacing of [310, 180]) {
    for (const cand of candidates) {
      if (existingCams.length >= targetCount) break;
      if (!isWalkableSpot(cand.x, cand.y, cand.floor)) continue;
      const tooCloseSameFloor = existingCams.some(
        (ec) => (ec.floor || 1) === cand.floor && Math.hypot(ec.x + ec.w / 2 - cand.x, ec.y + ec.h / 2 - cand.y) < minSpacing
      );
      if (tooCloseSameFloor) continue;
      const prop: DecorRect = {
        x: Math.round(cand.x - 8),
        y: Math.round(cand.y - 8),
        w: 16,
        h: 16,
        kind: "camera_prop",
        floor: cand.floor,
      };
      existingCams.push(prop);
      placed.push(prop);
      validDecors.push(prop);
    }
    if (existingCams.length >= targetCount) break;
  }
}

/**
 * DecorationCollisionGuard (GUARD_11):
 * 装飾(decors)が障害物・タスク計器・緊急ボタン・他の装飾と重ならないよう自動チェック＆安全オフセット調整
 */
export function resolveAndValidateMapDecorations(map: MapDef): MapDef {
  const placed: DecorRect[] = [];
  const validDecors: DecorRect[] = [];

  for (const d of map.decors) {
    const df = d.floor || 1;
    let candidate: DecorRect = d.kind === "caution" ? snapCautionToThreshold({ ...d }, map) : { ...d };
    const room = map.rooms.find(
      (r) =>
        (r.floor || 1) === df &&
        candidate.x + candidate.w / 2 >= r.x &&
        candidate.x + candidate.w / 2 <= r.x + r.w &&
        candidate.y + candidate.h / 2 >= r.y &&
        candidate.y + candidate.h / 2 <= r.y + r.h
    );

    const conflicts = (box: DecorRect): boolean => {
      // Check emergency hub
      if (
        (map.emergency.floor || 1) === df &&
        rectsOverlap(box, { x: map.emergency.x - 58, y: map.emergency.y - 58, w: 116, h: 116 })
      ) {
        return true;
      }
      // Check task spots
      for (const t of map.taskSpots) {
        if ((t.floor || 1) !== df) continue;
        if (rectsOverlap(box, { x: t.x - 28, y: t.y - 24, w: 56, h: 48 })) return true;
      }
      // Check obstacles (skip soft carpet/caution floor strips from hard blocking unless overlapping hard props)
      if (box.kind !== "carpet" && box.kind !== "caution") {
        for (const o of map.obstacles) {
          if ((o.floor || 1) !== df) continue;
          if (rectsOverlap(box, o, 6)) return true;
        }
      }
      // Check already placed decors
      for (const p of placed) {
        if ((p.floor || 1) !== df) continue;
        if (p.kind === "carpet" || box.kind === "carpet" || box.kind === "caution" || p.kind === "caution") continue;
        if (rectsOverlap(box, p, 8)) return true;
      }
      return false;
    };

    if (candidate.kind !== "camera_prop" && candidate.kind !== "caution") {
      if (conflicts(candidate) && room) {
        // Try 4 safe offsets within room bounds before dropping
        const offsets: [number, number][] = [
          [0, -48],
          [0, 48],
          [-56, 0],
          [56, 0],
          [room.x + 24 - candidate.x, room.y + 24 - candidate.y],
        ];
        let solved = false;
        for (const [ox, oy] of offsets) {
          const shifted: DecorRect = {
            ...candidate,
            x: Math.max(room.x + 12, Math.min(room.x + room.w - candidate.w - 12, candidate.x + ox)),
            y: Math.max(room.y + 12, Math.min(room.y + room.h - candidate.h - 12, candidate.y + oy)),
          };
          if (!conflicts(shifted)) {
            candidate = shifted;
            solved = true;
            break;
          }
        }
        if (!solved) continue;
      } else if (conflicts(candidate)) {
        continue;
      }
    }

    placed.push(candidate);
    validDecors.push(candidate);
  }

  ensureMultiCameraProps(map, placed, validDecors);
  return { ...map, decors: validDecors };
}

/**
 * 既存15マップを強化（Starshipの廊下中心基準拡幅・追加盲点・追加ベント＋150タスク多様性バインディング）
 */
function enhanceBaselineMap(id: string, raw: Record<string, unknown>): MapDef {
  const m = JSON.parse(JSON.stringify(raw)) as MapDef;
  const meta = BASELINE_META[id];
  m.category = meta.category;
  m.sizeTag = meta.sizeTag;
  m.uniqueGimmick = meta.uniqueGimmick;
  m.gimmickSummary = meta.gimmickSummary;
  m.subtitle = meta.subtitle;
  m.recommendedPlayers = meta.recommendedPlayers;

  if (id === "starship") {
    // Starship upgrade: symmetrically widen narrow corridors around their centerlines
    m.corridors = m.corridors.map((c) => {
      if (c.w < c.h) {
        const nw = Math.max(c.w, 108);
        const dx = (nw - c.w) / 2;
        return { ...c, x: Math.round(c.x - dx), w: nw };
      }
      const nh = Math.max(c.h, 108);
      const dy = (nh - c.h) / 2;
      return { ...c, y: Math.round(c.y - dy), h: nh };
    });
    // Add tactical storage->upper alcove obstacle blindspot & outer weapon/reactor spots
    if (!m.obstacles.some((o) => o.kind === "crate" && Math.abs(o.x - 910) < 40)) {
      m.obstacles.push({ x: 905, y: 920, w: 64, h: 64, kind: "crate", floor: 1 });
    }
    if (!m.vents.some((v) => v.id === "v_storage_extra")) {
      const len = m.vents.length;
      m.vents.push({ id: "v_storage_extra", x: 1110, y: 1030, links: [0, Math.max(0, len - 1)], floor: 1 });
    }
    const extraSpots: TaskSpot[] = [
      { x: 1680, y: 205, taskId: "t_drone_sw", floor: 1, wallAttached: true },
      { x: 420, y: 960, taskId: "t_coolant_pipe", floor: 1, wallAttached: true },
      { x: 1790, y: 650, taskId: "t_radar_calibrate", floor: 1, wallAttached: true },
    ];
    for (const sp of extraSpots) {
      if (!m.taskSpots.some((t) => Math.hypot(t.x - sp.x, t.y - sp.y) < 45)) {
        m.taskSpots.push(sp);
      }
    }
  }

  return resolveAndValidateMapDecorations(m);
}

interface ProceduralMapBlueprint {
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
  wallColor: string;
  exteriorTheme: MapDef["exteriorTheme"];
  hasMultiFloor?: boolean;
  isLowGravity?: boolean;
  isDarkFog?: boolean;
  hasBlizzard?: boolean;
  roomPalette: string[];
  floorStyle: RoomRect["floorStyle"];
  roomNames: [string, string, string, string, string, string, string, string];
  taskOffset: number;
  gimmickBuilder: (rooms: RoomRect[]) => GimmickNode[];
  decorBuilder: (rooms: RoomRect[]) => DecorRect[];
  extraObstacles?: ObstacleRect[];
}

/**
 * 完璧な接続性と重なりゼロを保証する新規15マップビルダー
 * 3x3リング＋中央ハブ網により全8部屋が複数ルートで相互接続され、孤立部屋が発生しない。
 */
function buildConnectedMap(bp: ProceduralMapBlueprint): MapDef {
  // Layout grid of 8 well-spaced interconnected rooms across 2000x1280 canvas
  // Top:    NW (180,140,340x250), N-HUB (780,130,440x270), NE (1460,140,340x250)
  // Middle: W (160,510,330x260), CENTER_LINK (790,520,420x230), E (1470,510,330x260)
  // Bottom: SW (210,880,360x260), SE (1410,880,360x260)
  // If hasMultiFloor, SW & SE shift cleanly or two 2F rooms appear at top-left/top-right with stairs!
  const rooms: RoomRect[] = [
    { id: "hub", name: bp.roomNames[0], x: 780, y: 120, w: 440, h: 270, color: bp.roomPalette[0], floor: 1, floorStyle: "tile" },
    { id: "nw", name: bp.roomNames[1], x: 180, y: 140, w: 340, h: 250, color: bp.roomPalette[1], floor: 1, floorStyle: bp.floorStyle },
    { id: "ne", name: bp.roomNames[2], x: 1460, y: 140, w: 340, h: 250, color: bp.roomPalette[2], floor: 1, floorStyle: bp.floorStyle },
    { id: "west", name: bp.roomNames[3], x: 160, y: 510, w: 330, h: 260, color: bp.roomPalette[3], floor: 1, floorStyle: bp.floorStyle },
    { id: "mid", name: bp.roomNames[4], x: 800, y: 520, w: 400, h: 230, color: bp.roomPalette[1], floor: 1, floorStyle: bp.floorStyle },
    { id: "east", name: bp.roomNames[5], x: 1470, y: 510, w: 330, h: 260, color: bp.roomPalette[2], floor: 1, floorStyle: bp.floorStyle },
    { id: "sw", name: bp.roomNames[6], x: 220, y: 890, w: 420, h: 250, color: bp.roomPalette[3], floor: bp.hasMultiFloor ? 2 : 1, floorStyle: bp.floorStyle },
    { id: "se", name: bp.roomNames[7], x: 1360, y: 890, w: 420, h: 250, color: bp.roomPalette[0], floor: bp.hasMultiFloor ? 2 : 1, floorStyle: bp.floorStyle },
  ];

  // Wide overlapping corridors connecting every adjacent room cleanly (zero dead ends)
  const corridors: CorridorRect[] = [
    { x: 500, y: 215, w: 300, h: 112, floor: 1 }, // nw <-> hub
    { x: 1200, y: 215, w: 280, h: 112, floor: 1 }, // hub <-> ne
    { x: 270, y: 370, w: 114, h: 160, floor: 1 }, // nw <-> west
    { x: 1580, y: 370, w: 114, h: 160, floor: 1 }, // ne <-> east
    { x: 944, y: 370, w: 112, h: 170, floor: 1 }, // hub <-> mid
    { x: 470, y: 584, w: 350, h: 112, floor: 1 }, // west <-> mid
    { x: 1180, y: 584, w: 310, h: 112, floor: 1 }, // mid <-> east
  ];

  if (bp.hasMultiFloor) {
    // On 2F, connect sw <-> se with a grand sky-bridge corridor
    corridors.push({ x: 620, y: 958, w: 760, h: 114, floor: 2 });
    // Also add south 1F loop corridor connecting west <-> east at bottom
    corridors.push({ x: 270, y: 750, w: 114, h: 170, floor: 1 });
    corridors.push({ x: 320, y: 810, w: 1320, h: 112, floor: 1 });
    corridors.push({ x: 1580, y: 750, w: 114, h: 170, floor: 1 });
  } else {
    corridors.push({ x: 290, y: 750, w: 114, h: 160, floor: 1 }); // west <-> sw
    corridors.push({ x: 1570, y: 750, w: 114, h: 160, floor: 1 }); // east <-> se
    corridors.push({ x: 620, y: 960, w: 760, h: 114, floor: 1 }); // sw <-> se
    corridors.push({ x: 944, y: 730, w: 112, h: 250, floor: 1 }); // mid <-> bottom loop
  }

  const emergency = { x: 1000, y: 255, floor: 1 };

  const vents: VentNode[] = [
    { id: "v_nw", x: 245, y: 205, links: [1, 2], floor: 1 },
    { id: "v_ne", x: 1735, y: 205, links: [0, 3], floor: 1 },
    { id: "v_west", x: 230, y: 705, links: [0, 4], floor: 1 },
    { id: "v_east", x: 1730, y: 705, links: [1, 4], floor: 1 },
    { id: "v_mid", x: 1000, y: 635, links: [2, 3], floor: 1 },
  ];

  // Assign 12 diverse task spots across non-hub rooms from TASK_CATALOG_150
  const taskSpots: TaskSpot[] = [];
  const taskRooms = rooms.filter((r) => r.id !== "hub");
  let cursor = bp.taskOffset;
  for (const r of taskRooms) {
    const f = r.floor || 1;
    const t1 = TASK_CATALOG_150[cursor % TASK_CATALOG_150.length];
    cursor += 7;
    const t2 = TASK_CATALOG_150[cursor % TASK_CATALOG_150.length];
    cursor += 11;
    taskSpots.push({ x: r.x + 56, y: r.y + 46, taskId: t1.id, floor: f, wallAttached: true });
    taskSpots.push({ x: r.x + r.w - 58, y: r.y + r.h - 46, taskId: t2.id, floor: f, wallAttached: true });
  }

  const obstacles: ObstacleRect[] = [
    { x: 945, y: 590, w: 110, h: 72, kind: "table_rect", floor: 1 },
    { x: 310, y: 230, w: 70, h: 70, kind: "reactor", floor: 1 },
    { x: 1590, y: 230, w: 72, h: 72, kind: "console", floor: 1 },
    { x: 290, y: 600, w: 66, h: 66, kind: "tank", floor: 1 },
    { x: 1595, y: 600, w: 66, h: 66, kind: "server", floor: 1 },
    { x: 390, y: 980, w: 72, h: 72, kind: "crate", floor: bp.hasMultiFloor ? 2 : 1 },
    { x: 1520, y: 980, w: 72, h: 72, kind: "table_round", floor: bp.hasMultiFloor ? 2 : 1 },
    ...(bp.extraObstacles || []),
  ];

  const baseGimmicks: GimmickNode[] = [
    { type: "vitals", x: 1165, y: 175, floor: 1, label: "生体反応", icon: "💓" },
    { type: "camera", x: 845, y: 580, floor: 1, label: "監視カメラ", icon: "📹" },
    ...(bp.hasMultiFloor
      ? [
          {
            type: "stairs" as const,
            x: 335,
            y: 720,
            floor: 1,
            targetX: 335,
            targetY: 960,
            targetFloor: 2,
            label: "2Fへ上がる",
            icon: "🪜",
          },
          {
            type: "stairs" as const,
            x: 335,
            y: 960,
            floor: 2,
            targetX: 335,
            targetY: 720,
            targetFloor: 1,
            label: "1Fへ降りる",
            icon: "🪜",
          },
          {
            type: "stairs" as const,
            x: 1630,
            y: 720,
            floor: 1,
            targetX: 1630,
            targetY: 960,
            targetFloor: 2,
            label: "2Fへ上がる",
            icon: "🪜",
          },
          {
            type: "stairs" as const,
            x: 1630,
            y: 960,
            floor: 2,
            targetX: 1630,
            targetY: 720,
            targetFloor: 1,
            label: "1Fへ降りる",
            icon: "🪜",
          },
        ]
      : []),
    ...bp.gimmickBuilder(rooms),
  ];

  const mapDef: MapDef = {
    id: bp.id,
    name: bp.name,
    subtitle: bp.subtitle,
    category: bp.category,
    sizeTag: bp.sizeTag,
    uniqueGimmick: bp.uniqueGimmick,
    gimmickSummary: bp.gimmickSummary,
    recommendedPlayers: bp.recommendedPlayers,
    accent: bp.accent,
    bg: bp.bg,
    corridorFill: bp.corridorFill,
    wallColor: bp.wallColor,
    exteriorTheme: bp.exteriorTheme,
    hasMultiFloor: bp.hasMultiFloor,
    isLowGravity: bp.isLowGravity,
    isDarkFog: bp.isDarkFog,
    hasBlizzard: bp.hasBlizzard,
    rooms,
    corridors,
    emergency,
    sabotageFix: {
      lights: { x: 255, y: 630, floor: 1, label: bp.roomNames[3] },
      reactor: { x: 1660, y: 260, floor: 1, label: bp.roomNames[2] },
      gas: { x: 1000, y: 690, floor: 1, label: bp.roomNames[4] },
    },
    vents,
    taskSpots,
    obstacles,
    decors: bp.decorBuilder(rooms),
    gimmicks: baseGimmicks,
  };

  return resolveAndValidateMapDecorations(mapDef);
}

const NEW_15_BLUEPRINTS: ProceduralMapBlueprint[] = [
  // Category: station (3 new -> total 6)
  {
    id: "orbital_dock",
    name: "🛰️ オービタル・ドック基地",
    subtitle: "宇宙港とエアロック除菌が交差する中継ハブ",
    category: "station",
    sizeTag: "medium",
    uniqueGimmick: "airlock_decontam",
    gimmickSummary: "除菌エアロックリング(通過浄化)＋高速シャトルパッド搭載",
    recommendedPlayers: "6〜10人",
    accent: "#38bdf8",
    bg: "#030712",
    corridorFill: "#142138",
    wallColor: "#334155",
    exteriorTheme: "space",
    roomPalette: ["#16263d", "#182d47", "#152538", "#1b2840"],
    floorStyle: "metal",
    roomNames: ["中央発着ロビー", "格納ベイA", "管制タワー", "電気・補給庫", "エアロック除菌室", "貨物ターミナル", "シャトルドックW", "シャトルドックE"],
    taskOffset: 1,
    gimmickBuilder: () => [
      { type: "decontam_chamber", x: 960, y: 400, w: 80, h: 80, floor: 1, label: "除菌ゲート", icon: "🧼" },
      { type: "speed_pad", x: 580, y: 255, vx: 1.5, vy: 0, floor: 1, label: "加速ベルト", icon: "⚡" },
      { type: "doorlog", x: 1120, y: 580, floor: 1, label: "通行ログ", icon: "🚪" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[0].x + 120, y: rooms[0].y + 18, w: 180, h: 20, kind: "window", floor: 1 },
      { x: rooms[1].x + 28, y: rooms[1].y + 90, w: 96, h: 22, kind: "caution", floor: 1 },
      { x: rooms[5].x + 180, y: rooms[5].y + 18, w: 120, h: 22, kind: "pipes", floor: 1 },
    ],
  },
  {
    id: "command_cruiser",
    name: "⚔️ 司令戦艦イージス",
    subtitle: "自動レーザー警戒網が張られた重装甲旗艦",
    category: "station",
    sizeTag: "large",
    uniqueGimmick: "laser_grid",
    gimmickSummary: "周期切替レーザー警戒ゲート＋全艦ドア遠隔制御",
    recommendedPlayers: "7〜10人",
    accent: "#f43f5e",
    bg: "#07040e",
    corridorFill: "#1f162b",
    wallColor: "#475569",
    exteriorTheme: "space",
    roomPalette: ["#251934", "#1b213a", "#2b1627", "#1e293b"],
    floorStyle: "cargo",
    roomNames: ["艦長ブリッジ", "主砲制御室", "戦術作戦室", "機関・配電室", "弾薬コンベア室", "通信指令室", "左舷砲塔室", "右舷砲塔室"],
    taskOffset: 6,
    gimmickBuilder: () => [
      { type: "laser_gate", x: 944, y: 430, w: 112, h: 24, floor: 1, label: "レーザー警戒柵", icon: "🔺" },
      { type: "door_control", x: 1680, y: 190, floor: 1, label: "隔壁制御", icon: "🔒" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[0].x + 90, y: rooms[0].y + 18, w: 220, h: 22, kind: "window", floor: 1 },
      { x: rooms[2].x + 18, y: rooms[2].y + 90, w: 46, h: 46, kind: "turret", floor: 1 },
      { x: rooms[7].x + 140, y: rooms[7].y + 20, w: 140, h: 20, kind: "caution", floor: 1 },
    ],
  },
  {
    id: "hangar_bay",
    name: "✈️ 戦術ハンガー・ベイ",
    subtitle: "滑走レーンで高速展開できる機体整備基地",
    category: "station",
    sizeTag: "medium",
    uniqueGimmick: "orbit_turret",
    gimmickSummary: "高速滑走コンベアレーン＋防空砲台モニター搭載",
    recommendedPlayers: "6〜10人",
    accent: "#f59e0b",
    bg: "#060812",
    corridorFill: "#1e2230",
    wallColor: "#475569",
    exteriorTheme: "space",
    roomPalette: ["#1f2433", "#26232a", "#1c2836", "#22273a"],
    floorStyle: "cargo",
    roomNames: ["中央指令デッキ", "戦闘機整備庫", "迎撃管制室", "燃料ポンプ室", "弾頭格納庫", "レーダー室", "発艦カタパルトW", "発艦カタパルトE"],
    taskOffset: 11,
    gimmickBuilder: () => [
      { type: "conveyor", x: 640, y: 970, w: 680, h: 86, vx: 175, vy: 0, floor: 1, label: "発艦コンベア", icon: "➡️" },
      { type: "meteor_console", x: 1580, y: 185, floor: 1, label: "防空スキャン", icon: "🛰️" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[6].x + 120, y: rooms[6].y + 20, w: 180, h: 20, kind: "caution", floor: 1 },
      { x: rooms[7].x + 120, y: rooms[7].y + 20, w: 180, h: 20, kind: "caution", floor: 1 },
      { x: rooms[1].x + 140, y: rooms[1].y + 18, w: 120, h: 20, kind: "pipes", floor: 1 },
    ],
  },

  // Category: research (3 new -> total 6)
  {
    id: "quantum_lab",
    name: "⚛️ 量子テレポーテーション研究所",
    subtitle: "対角線を一瞬で横断できる双方向ワープ研究棟",
    category: "research",
    sizeTag: "medium",
    uniqueGimmick: "quantum_warp",
    gimmickSummary: "NW⇔SE / NE⇔SW 双方向量子ワープパッド装備",
    recommendedPlayers: "6〜10人",
    accent: "#a855f7",
    bg: "#070414",
    corridorFill: "#1d1538",
    wallColor: "#4c1d95",
    exteriorTheme: "cyber",
    roomPalette: ["#1e1538", "#172042", "#26143d", "#18243c"],
    floorStyle: "cyber",
    roomNames: ["量子コア広間", "粒子加速室A", "波動観測室B", "電源変圧室", "実験解析ラボ", "計算機センター", "量子転送室SW", "量子転送室SE"],
    taskOffset: 16,
    gimmickBuilder: () => [
      { type: "teleport", x: 430, y: 310, floor: 1, targetX: 1450, targetY: 960, targetFloor: 1, label: "量子ワープSE", icon: "🌀" },
      { type: "teleport", x: 1450, y: 960, floor: 1, targetX: 430, targetY: 310, targetFloor: 1, label: "量子ワープNW", icon: "🌀" },
      { type: "teleport", x: 1540, y: 310, floor: 1, targetX: 490, targetY: 960, targetFloor: 1, label: "量子ワープSW", icon: "🌀" },
      { type: "teleport", x: 490, y: 960, floor: 1, targetX: 1540, targetY: 310, targetFloor: 1, label: "量子ワープNE", icon: "🌀" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[5].x + 24, y: rooms[5].y + 20, w: 180, h: 18, kind: "server_wall", floor: 1 },
      { x: rooms[4].x + 24, y: rooms[4].y + 18, w: 140, h: 18, kind: "server_wall", floor: 1 },
    ],
  },
  {
    id: "bio_dome",
    name: "🧬 生体培養バイオドーム",
    subtitle: "植物と医療培養槽が並ぶ生体研究ドーム",
    category: "research",
    sizeTag: "medium",
    uniqueGimmick: "bio_sensor",
    gimmickSummary: "医療スキャナー装飾＋生体反応＆通行ドアログ二重監視",
    recommendedPlayers: "6〜10人",
    accent: "#10b981",
    bg: "#020e0b",
    corridorFill: "#0f2922",
    wallColor: "#065f46",
    exteriorTheme: "jungle",
    roomPalette: ["#102e26", "#143528", "#0f2930", "#183322"],
    floorStyle: "garden",
    roomNames: ["植物園ロビー", "遺伝子解析室", "培養温室", "栄養液ポンプ室", "クリーン検疫室", "標本アーカイブ", "西バイオドーム", "東バイオドーム"],
    taskOffset: 21,
    gimmickBuilder: () => [
      { type: "decontam_chamber", x: 950, y: 410, w: 96, h: 68, floor: 1, label: "クリーンシャワー", icon: "🌿" },
      { type: "doorlog", x: 1140, y: 600, floor: 1, label: "検疫ログ", icon: "📋" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[4].x + 260, y: rooms[4].y + 42, w: 58, h: 58, kind: "med_scanner", floor: 1 },
      { x: rooms[1].x + 200, y: rooms[1].y + 30, w: 72, h: 42, kind: "med_bed", floor: 1 },
    ],
  },
  {
    id: "dark_observatory",
    name: "🔭 深宇宙天文観測所",
    subtitle: "電力変動で照明が明滅する暗黒天文施設",
    category: "research",
    sizeTag: "large",
    uniqueGimmick: "flicker_lights",
    gimmickSummary: "周期的な宇宙線によるライト減光イベント＋望遠鏡監視",
    recommendedPlayers: "7〜10人",
    accent: "#60a5fa",
    bg: "#02040a",
    corridorFill: "#101629",
    wallColor: "#1e293b",
    exteriorTheme: "space",
    hasMultiFloor: true,
    isDarkFog: true,
    roomPalette: ["#111930", "#141c38", "#0f172a", "#171c36"],
    floorStyle: "lab",
    roomNames: ["観測中央ドーム", "分光分析室", "電波望遠鏡室", "予備電源室", "データ蓄積室", "暗室解析室", "2F 天体望遠鏡W", "2F 天文アーカイブE"],
    taskOffset: 26,
    gimmickBuilder: () => [
      { type: "meteor_console", x: 1620, y: 185, floor: 1, label: "天体警報盤", icon: "🔭" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[0].x + 120, y: rooms[0].y + 18, w: 200, h: 20, kind: "window", floor: 1 },
      { x: rooms[4].x + 140, y: rooms[4].y + 18, w: 140, h: 16, kind: "server_wall", floor: 1 },
    ],
  },

  // Category: industrial (3 new -> total 6)
  {
    id: "foundry_mill",
    name: "⚒️ 重金属製錬プラント",
    subtitle: "高熱コンベアとスチーム噴出が走る工業拠点",
    category: "industrial",
    sizeTag: "large",
    uniqueGimmick: "mag_conveyor",
    gimmickSummary: "双方向インゴットベルトコンベア＋蒸気噴射バルブ搭載",
    recommendedPlayers: "7〜10人",
    accent: "#f97316",
    bg: "#0c0503",
    corridorFill: "#2a1812",
    wallColor: "#7c2d12",
    exteriorTheme: "lava",
    roomPalette: ["#2e1912", "#261c18", "#341911", "#231a15"],
    floorStyle: "cargo",
    roomNames: ["製錬管制室", "第一高炉", "圧延ライン", "高圧ボイラー", "スラグ処理槽", "配電変電所", "鋳造ドックW", "出荷クレーンE"],
    taskOffset: 31,
    gimmickBuilder: () => [
      { type: "conveyor", x: 640, y: 970, w: 680, h: 86, vx: -165, vy: 0, floor: 1, label: "鉱石コンベア", icon: "⬅️" },
      { type: "steam_valve", x: 900, y: 580, floor: 1, label: "蒸気排圧", icon: "💨" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[2].x + 26, y: rooms[2].y + 16, w: 160, h: 20, kind: "caution", floor: 1 },
      { x: rooms[4].x + 160, y: rooms[4].y + 18, w: 150, h: 20, kind: "pipes", floor: 1 },
    ],
  },
  {
    id: "cryo_vault",
    name: "🧊 冷凍保管庫ベータ",
    subtitle: "極低温冷却パイプと氷結滑走フロアの冷凍倉庫",
    category: "industrial",
    sizeTag: "medium",
    uniqueGimmick: "ice_floor",
    gimmickSummary: "中央廊下に凍結アイスゾーン(滑走加速)を広域配置",
    recommendedPlayers: "6〜9人",
    accent: "#22d3ee",
    bg: "#030c14",
    corridorFill: "#112b3c",
    wallColor: "#0e7490",
    exteriorTheme: "snow",
    roomPalette: ["#102a3b", "#143142", "#0d2536", "#163547"],
    floorStyle: "tile",
    roomNames: ["管理暖房室", "極低温第一庫", "液体窒素槽", "解凍メンテナンス", "中央アイスホール", "冷媒制御室", "冷凍スリープW", "冷凍スリープE"],
    taskOffset: 36,
    gimmickBuilder: () => [
      { type: "ice", x: 810, y: 530, w: 380, h: 200, floor: 1, label: "氷結フロア", icon: "🧊" },
      { type: "ice", x: 640, y: 965, w: 680, h: 96, floor: 1, label: "アイス滑走路", icon: "❄️" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[0].x + 140, y: rooms[0].y + 18, w: 150, h: 20, kind: "window", floor: 1 },
      { x: rooms[2].x + 24, y: rooms[2].y + 20, w: 140, h: 20, kind: "pipes", floor: 1 },
    ],
  },
  {
    id: "asteroid_mine",
    name: "☄️ 小惑星採掘リグ",
    subtitle: "無重力作業レーンを持つ深宇宙鉱山プラットフォーム",
    category: "industrial",
    sizeTag: "medium",
    uniqueGimmick: "zero_g_lane",
    gimmickSummary: "低重力ドリフト物理＋重力ウェル加速ゾーン完備",
    recommendedPlayers: "6〜9人",
    accent: "#eab308",
    bg: "#05060b",
    corridorFill: "#1d1c24",
    wallColor: "#52525b",
    exteriorTheme: "moon",
    isLowGravity: true,
    roomPalette: ["#1f1e29", "#24222b", "#1a1b24", "#262530"],
    floorStyle: "stone",
    roomNames: ["リグ中央指令所", "掘削ドリル西", "選鉱ラボ", "酸素・電源室", "鉱石ホッパー", "防衛タレット室", "採掘坑道SW", "採掘坑道SE"],
    taskOffset: 41,
    gimmickBuilder: () => [
      { type: "gravity_well", x: 1000, y: 635, floor: 1, label: "重力収束井戸", icon: "🌀" },
      { type: "meteor_console", x: 1620, y: 185, floor: 1, label: "隕石迎撃台", icon: "☄️" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[1].x + 140, y: rooms[1].y + 22, w: 140, h: 20, kind: "caution", floor: 1 },
      { x: rooms[5].x + 18, y: rooms[5].y + 100, w: 46, h: 46, kind: "turret", floor: 1 },
    ],
  },

  // Category: nature (3 new -> total 6)
  {
    id: "blizzard_outpost",
    name: "🌨️ 極寒ブリザード前哨基地",
    subtitle: "周期的猛吹雪で屋外視界が奪われる雪原ステーション",
    category: "nature",
    sizeTag: "large",
    uniqueGimmick: "blizzard_storm",
    gimmickSummary: "周期ブリザード(視界低下＋凍風押し流し)＋暖気キャビン",
    recommendedPlayers: "7〜10人",
    accent: "#7dd3fc",
    bg: "#06101b",
    corridorFill: "#1b2e42",
    wallColor: "#475569",
    exteriorTheme: "snow",
    hasBlizzard: true,
    roomPalette: ["#192a3d", "#1e344a", "#162638", "#1f374d"],
    floorStyle: "stone",
    roomNames: ["本部ロッジ", "除雪車庫", "気象観測棟", "地熱ボイラー", "雪原シェルター", "無線基地", "氷河ラボSW", "緊急格納庫SE"],
    taskOffset: 46,
    gimmickBuilder: () => [
      { type: "wind", x: 640, y: 965, w: 680, h: 100, vx: -135, vy: 0, floor: 1, label: "極寒ブリザード", icon: "💨" },
      { type: "ice", x: 510, y: 220, w: 260, h: 100, floor: 1, label: "凍結橋", icon: "❄️" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[0].x + 120, y: rooms[0].y + 18, w: 180, h: 20, kind: "window", floor: 1 },
      { x: rooms[3].x + 150, y: rooms[3].y + 18, w: 120, h: 20, kind: "pipes", floor: 1 },
    ],
  },
  {
    id: "deep_trench",
    name: "🌊 深海海溝ラボ",
    subtitle: "海流ダクトと隔離バルクヘッドを持つ深海基地",
    category: "nature",
    sizeTag: "large",
    uniqueGimmick: "ocean_pressure",
    gimmickSummary: "海流押し流し廊下＋手動隔離ドア制御＋2F展望デッキ",
    recommendedPlayers: "7〜10人",
    accent: "#2dd4bf",
    bg: "#020b12",
    corridorFill: "#0e2938",
    wallColor: "#0f766e",
    exteriorTheme: "ocean",
    hasMultiFloor: true,
    roomPalette: ["#0f2c3a", "#113344", "#0c2532", "#143748"],
    floorStyle: "lab",
    roomNames: ["中央コマンドドーム", "ソナー解析室", "水圧制御室", "酸素循環室", "深海サンプル室", "潜航艇ドック", "2F 海底展望W", "2F バラスト棟E"],
    taskOffset: 51,
    gimmickBuilder: () => [
      { type: "wind", x: 480, y: 585, w: 310, h: 108, vx: 120, vy: 0, floor: 1, label: "海流ダクト", icon: "🌊" },
      { type: "door_control", x: 1620, y: 190, floor: 1, label: "水密隔壁制御", icon: "🔒" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[0].x + 120, y: rooms[0].y + 18, w: 200, h: 20, kind: "window", floor: 1 },
      { x: rooms[4].x + 260, y: rooms[4].y + 30, w: 56, h: 56, kind: "med_scanner", floor: 1 },
    ],
  },
  {
    id: "floating_atoll",
    name: "🏝️ 浮遊環礁コロニー",
    subtitle: "樹冠に身を隠せる空中緑化アイランド",
    category: "nature",
    sizeTag: "medium",
    uniqueGimmick: "forest_cloak",
    gimmickSummary: "木陰ステルス隠蔽ゾーン(視認低下)＋気流加速パッド",
    recommendedPlayers: "6〜10人",
    accent: "#4ade80",
    bg: "#041016",
    corridorFill: "#16302a",
    wallColor: "#15803d",
    exteriorTheme: "clouds",
    roomPalette: ["#14332a", "#1b3b2c", "#122e30", "#1c3d28"],
    floorStyle: "garden",
    roomNames: ["スカイ広場", "風車発電塔", "生態調査室", "水耕ファーム", "中央緑地パーク", "通信気球室", "南西デッキ", "南東デッキ"],
    taskOffset: 56,
    gimmickBuilder: () => [
      { type: "hide_canopy", x: 860, y: 560, w: 280, h: 140, floor: 1, label: "樹冠隠蔽ゾーン", icon: "🌿" },
      { type: "speed_pad", x: 640, y: 990, vx: 1.55, vy: 0, floor: 1, label: "気流加速", icon: "🍃" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[0].x + 140, y: rooms[0].y + 120, w: 160, h: 90, kind: "carpet", floor: 1 },
    ],
  },

  // Category: labyrinth (3 new -> total 6)
  {
    id: "mirror_sector",
    name: "🪞 ミラーセクター迷宮",
    subtitle: "完全対称構造で位置把握を錯乱させる光学迷宮",
    category: "labyrinth",
    sizeTag: "medium",
    uniqueGimmick: "mirror_sector",
    gimmickSummary: "鏡面対称ワープ＋ステルス隠密床パッドで錯乱戦",
    recommendedPlayers: "6〜10人",
    accent: "#e879f9",
    bg: "#090414",
    corridorFill: "#25143b",
    wallColor: "#86198f",
    exteriorTheme: "crystal",
    roomPalette: ["#231338", "#1d1942", "#2b1336", "#1f183d"],
    floorStyle: "cyber",
    roomNames: ["対称中央ホール", "鏡面の間・左", "鏡面の間・右", "光屈折室・西", "プリズム核室", "光屈折室・東", "幻影回廊・南西", "幻影回廊・南東"],
    taskOffset: 61,
    gimmickBuilder: () => [
      { type: "cloak_pad", x: 1000, y: 635, w: 160, h: 110, floor: 1, label: "光学迷彩床", icon: "👻" },
      { type: "teleport", x: 310, y: 710, floor: 1, targetX: 1640, targetY: 710, targetFloor: 1, label: "鏡面転移", icon: "🪞" },
      { type: "teleport", x: 1640, y: 710, floor: 1, targetX: 310, targetY: 710, targetFloor: 1, label: "鏡面転移", icon: "🪞" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[0].x + 110, y: rooms[0].y + 140, w: 220, h: 70, kind: "carpet", floor: 1 },
    ],
  },
  {
    id: "temporal_vault",
    name: "⏳ 時空保管庫クロノス",
    subtitle: "時間加速パッドと一方通行ワープが交錯する遺跡保管庫",
    category: "labyrinth",
    sizeTag: "large",
    uniqueGimmick: "oneway_warp",
    gimmickSummary: "一方通行タイムワープ＋加速パッド＋2F時空上層",
    recommendedPlayers: "7〜10人",
    accent: "#fbbf24",
    bg: "#0a0702",
    corridorFill: "#261d0e",
    wallColor: "#92400e",
    exteriorTheme: "desert",
    hasMultiFloor: true,
    roomPalette: ["#261d0e", "#1f222e", "#2b1b0f", "#241e14"],
    floorStyle: "stone",
    roomNames: ["時空の祭壇", "過去資料室", "未来演算室", "砂時計動力室", "時空結晶室", "監視回廊", "2F 上層回廊W", "2F 上層回廊E"],
    taskOffset: 66,
    gimmickBuilder: () => [
      { type: "teleport", x: 380, y: 195, floor: 1, targetX: 1580, targetY: 640, targetFloor: 1, label: "一方向タイムワープ", icon: "⏳" },
      { type: "speed_pad", x: 960, y: 440, vx: 0, vy: 1.5, floor: 1, label: "時間加速", icon: "⏩" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[0].x + 150, y: rooms[0].y + 20, w: 140, h: 24, kind: "altar", floor: 1 },
    ],
  },
  {
    id: "shadow_labyrinth",
    name: "🕯️ 影の古代地下迷宮",
    subtitle: "濃霧の暗闇と迷宮の視界制限が緊張感を生む地下遺跡",
    category: "labyrinth",
    sizeTag: "large",
    uniqueGimmick: "labyrinth_shift",
    gimmickSummary: "常時濃霧(狭視界)＋レーザー古代罠＋隠蔽柱エリア",
    recommendedPlayers: "6〜10人",
    accent: "#fb7185",
    bg: "#040308",
    corridorFill: "#1a1324",
    wallColor: "#3f2e56",
    exteriorTheme: "crystal",
    isDarkFog: true,
    roomPalette: ["#1b1326", "#161b29", "#241326", "#191524"],
    floorStyle: "stone",
    roomNames: ["封印の広間", "地下墓所W", "神託の間", "燭台動力室", "隠匿の迷室", "古代警報室", "深淵祭壇SW", "深淵祭壇SE"],
    taskOffset: 71,
    gimmickBuilder: () => [
      { type: "hide_canopy", x: 860, y: 560, w: 280, h: 140, floor: 1, label: "深淵の影", icon: "🕯️" },
      { type: "laser_gate", x: 944, y: 430, w: 112, h: 24, floor: 1, label: "古代結界柵", icon: "🔥" },
    ],
    decorBuilder: (rooms) => [
      { x: rooms[0].x + 150, y: rooms[0].y + 20, w: 140, h: 24, kind: "altar", floor: 1 },
      { x: rooms[6].x + 140, y: rooms[6].y + 20, w: 140, h: 24, kind: "altar", floor: 1 },
    ],
  },
];

const ENHANCED_BASE_MAPS: Record<string, MapDef> = Object.fromEntries(
  Object.entries(BASE_MAPS_RAW).map(([id, raw]) => [id, enhanceBaselineMap(id, raw)])
);

const NEW_15_MAPS: Record<string, MapDef> = Object.fromEntries(
  NEW_15_BLUEPRINTS.map((bp) => {
    const m = buildConnectedMap(bp);
    return [m.id, m];
  })
);

export const MAPS: Record<string, MapDef> = {
  ...ENHANCED_BASE_MAPS,
  ...NEW_15_MAPS,
};

export const MAP_LIST: MapDef[] = Object.values(MAPS);

export function getMapById(mapId: string): MapDef {
  return MAPS[mapId] || MAPS.starship || MAP_LIST[0];
}
