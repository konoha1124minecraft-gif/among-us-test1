import {
  EXTRA_ROLE_IDS,
  ROLES,
  canUseVentRole,
  hasTasksRole,
  isCrewRole,
  isImpostorRole,
} from "./constants";
import { isTaskSpotSafe, validateAliveReporter } from "./guardsAndRegistry";
import { TASK_CATALOG_150, getTaskById } from "./tasks150";
import type {
  DeadBody,
  DoorLogEntry,
  GameSettings,
  GimmickNode,
  MapDef,
  PlayerState,
  RoleId,
  SabotageState,
} from "./types";

export const PLAYER_RADIUS = 17;
export const PLAYER_BASE_SPEED = 240;

export const INTERACTIVE_GIMMICKS = new Set<GimmickNode["type"]>([
  "stairs",
  "teleport",
  "camera",
  "vitals",
  "doorlog",
  "door_control",
  "steam_valve",
  "meteor_console",
  "decontam_chamber",
]);

export function getGimmickKey(g: GimmickNode, idx: number): string {
  return `${g.type}_${g.floor || 1}_${Math.round(g.x)}_${Math.round(g.y)}_${idx}`;
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function isPointInWalkable(x: number, y: number, mapDef: MapDef, floor: number): boolean {
  for (const r of mapDef.rooms) {
    if ((r.floor || 1) === floor && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
      return true;
    }
  }
  for (const c of mapDef.corridors) {
    if ((c.floor || 1) === floor && x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) {
      return true;
    }
  }
  return false;
}

export function getRoomName(x: number, y: number, mapDef: MapDef, floor = 1): string {
  for (const r of mapDef.rooms) {
    if ((r.floor || 1) === floor && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
      return r.name;
    }
  }
  return "連絡通路";
}

export function getSpawnPosition(index: number, total: number, mapDef: MapDef) {
  const em = mapDef.emergency;
  const angle = (index / Math.max(1, total)) * Math.PI * 2;
  const rad = total > 6 ? 78 : 64;
  return {
    x: em.x + Math.cos(angle) * rad,
    y: em.y + Math.sin(angle) * rad,
    floor: em.floor || 1,
  };
}

export interface DoorBlockerRect {
  x: number;
  y: number;
  w: number;
  h: number;
  floor?: number;
}

/**
 * マップの通路と部屋の接続境界にドア閉鎖用シャッター座標を決定論的に生成
 */
export function buildMapDoorBlockers(mapDef: MapDef): DoorBlockerRect[] {
  const blockers: DoorBlockerRect[] = [];
  const em = mapDef.emergency;
  const emFloor = em.floor || 1;
  const THICKNESS = 18;

  const isDuplicate = (cand: DoorBlockerRect) =>
    blockers.some(
      (b) =>
        (b.floor || 1) === (cand.floor || 1) &&
        Math.hypot(b.x + b.w / 2 - (cand.x + cand.w / 2), b.y + b.h / 2 - (cand.y + cand.h / 2)) < 32
    );

  const tryPush = (cand: DoorBlockerRect) => {
    const cx = cand.x + cand.w / 2;
    const cy = cand.y + cand.h / 2;
    if ((cand.floor || 1) === emFloor && Math.hypot(cx - em.x, cy - em.y) < 68) return;
    if (!isDuplicate(cand)) blockers.push(cand);
  };

  for (const c of mapDef.corridors) {
    const cf = c.floor || 1;
    const rooms = mapDef.rooms.filter((r) => (r.floor || 1) === cf);
    const horizontal = c.w >= c.h;

    for (const r of rooms) {
      const ix1 = Math.max(r.x, c.x);
      const ix2 = Math.min(r.x + r.w, c.x + c.w);
      const iy1 = Math.max(r.y, c.y);
      const iy2 = Math.min(r.y + r.h, c.y + c.h);
      if (ix2 < ix1 - 6 || iy2 < iy1 - 6) continue;

      if (horizontal) {
        if (iy2 - iy1 < 22) continue;
        const roomCenterX = r.x + r.w / 2;
        const corrCenterX = c.x + c.w / 2;
        const rawX = roomCenterX < corrCenterX ? ix2 : ix1 - THICKNESS;
        const clampedX = Math.max(c.x, Math.min(c.x + c.w - THICKNESS, rawX));
        tryPush({ x: clampedX, y: c.y, w: THICKNESS, h: c.h, floor: cf });
      } else {
        if (ix2 - ix1 < 22) continue;
        const roomCenterY = r.y + r.h / 2;
        const corrCenterY = c.y + c.h / 2;
        const rawY = roomCenterY < corrCenterY ? iy2 : iy1 - THICKNESS;
        const clampedY = Math.max(c.y, Math.min(c.y + c.h - THICKNESS, rawY));
        tryPush({ x: c.x, y: clampedY, w: c.w, h: THICKNESS, floor: cf });
      }
    }
  }

  return blockers;
}

function circleIntersectsBox(cx: number, cy: number, rad: number, bx: number, by: number, bw: number, bh: number): boolean {
  const closestX = Math.max(bx, Math.min(cx, bx + bw));
  const closestY = Math.max(by, Math.min(cy, by + bh));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < rad * rad;
}

export function canWalk(
  x: number,
  y: number,
  mapDef: MapDef,
  isGhost: boolean,
  floor: number,
  doorsLocked = false,
  doorBlockers: DoorBlockerRect[] = []
): boolean {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;

  if (isGhost) {
    return x >= 50 && x <= 2030 && y >= 50 && y <= 1290;
  }

  for (const obs of mapDef.obstacles) {
    if ((obs.floor || 1) !== floor) continue;
    if (obs.kind === "table_round" || obs.kind === "tank") {
      const ox = obs.x + obs.w / 2;
      const oy = obs.y + obs.h / 2;
      const oRad = Math.min(obs.w, obs.h) / 2;
      if (Math.hypot(x - ox, y - oy) < oRad + PLAYER_RADIUS - 1) {
        return false;
      }
    } else if (circleIntersectsBox(x, y, PLAYER_RADIUS - 1, obs.x, obs.y, obs.w, obs.h)) {
      return false;
    }
  }

  if (doorsLocked) {
    for (const d of doorBlockers) {
      if ((d.floor || 1) !== floor) continue;
      if (circleIntersectsBox(x, y, PLAYER_RADIUS - 1, d.x, d.y, d.w, d.h)) {
        return false;
      }
    }
  }

  const r = PLAYER_RADIUS * 0.85;
  const diag = r * 0.7071;
  const pts: [number, number][] = [
    [x, y],
    [x - r, y],
    [x + r, y],
    [x, y - r],
    [x, y + r],
    [x - diag, y - diag],
    [x + diag, y - diag],
    [x - diag, y + diag],
    [x + diag, y + diag],
  ];
  return pts.every(([px, py]) => isPointInWalkable(px, py, mapDef, floor));
}

export function moveWithSlide(
  x: number,
  y: number,
  dx: number,
  dy: number,
  mapDef: MapDef,
  isGhost: boolean,
  floor: number,
  doorsLocked = false,
  doorBlockers: DoorBlockerRect[] = []
): { x: number; y: number } {
  let nx = Number.isFinite(x) ? x : mapDef.emergency.x;
  let ny = Number.isFinite(y) ? y : mapDef.emergency.y;
  if (Number.isFinite(dx) && dx !== 0 && canWalk(nx + dx, ny, mapDef, isGhost, floor, doorsLocked, doorBlockers)) {
    nx += dx;
  }
  if (Number.isFinite(dy) && dy !== 0 && canWalk(nx, ny + dy, mapDef, isGhost, floor, doorsLocked, doorBlockers)) {
    ny += dy;
  }
  return { x: nx, y: ny };
}

export function resolveSafePos(
  x: number,
  y: number,
  mapDef: MapDef,
  floor: number,
  isGhost = false
): { x: number; y: number } {
  if (canWalk(x, y, mapDef, isGhost, floor)) return { x, y };
  for (let r = 12; r <= 120; r += 12) {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const cx = x + Math.cos(a) * r;
      const cy = y + Math.sin(a) * r;
      if (canWalk(cx, cy, mapDef, isGhost, floor)) return { x: cx, y: cy };
    }
  }
  return { x: mapDef.emergency.x, y: mapDef.emergency.y };
}

export interface WallSeg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function buildWallSegments(
  mapDef: MapDef,
  floor: number,
  closedDoors: DoorBlockerRect[] = []
): WallSeg[] {
  const rects = [
    ...mapDef.rooms.filter((r) => (r.floor || 1) === floor),
    ...mapDef.corridors.filter((c) => (c.floor || 1) === floor),
  ];
  const segs: WallSeg[] = [];

  const isPointInOtherWalkable = (px: number, py: number, selfIdx: number): boolean => {
    for (let i = 0; i < rects.length; i++) {
      if (i === selfIdx) continue;
      const r = rects[i];
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
        return true;
      }
    }
    return false;
  };

  // Analytic interval subtraction along exact edge coordinates (zero discrete sampling overhang/gaps)
  const addClippedHorizontal = (yEdge: number, xStart: number, xEnd: number, selfIdx: number, ny: number) => {
    const cuts: number[] = [xStart, xEnd];
    const probeY = yEdge + ny * 2;
    for (let i = 0; i < rects.length; i++) {
      if (i === selfIdx) continue;
      const o = rects[i];
      if (probeY >= o.y && probeY <= o.y + o.h) {
        if (o.x > xStart && o.x < xEnd) cuts.push(o.x);
        if (o.x + o.w > xStart && o.x + o.w < xEnd) cuts.push(o.x + o.w);
      }
    }
    cuts.sort((a, b) => a - b);
    let openStart: number | null = null;
    for (let i = 0; i < cuts.length - 1; i++) {
      const a = cuts[i];
      const b = cuts[i + 1];
      if (b - a <= 0.25) continue;
      const mx = (a + b) * 0.5;
      const blockedByOpen = isPointInOtherWalkable(mx, probeY, selfIdx);
      if (!blockedByOpen) {
        if (openStart === null) openStart = a;
      } else if (openStart !== null) {
        segs.push({ x1: openStart, y1: yEdge, x2: a, y2: yEdge });
        openStart = null;
      }
    }
    if (openStart !== null) {
      segs.push({ x1: openStart, y1: yEdge, x2: xEnd, y2: yEdge });
    }
  };

  const addClippedVertical = (xEdge: number, yStart: number, yEnd: number, selfIdx: number, nx: number) => {
    const cuts: number[] = [yStart, yEnd];
    const probeX = xEdge + nx * 2;
    for (let i = 0; i < rects.length; i++) {
      if (i === selfIdx) continue;
      const o = rects[i];
      if (probeX >= o.x && probeX <= o.x + o.w) {
        if (o.y > yStart && o.y < yEnd) cuts.push(o.y);
        if (o.y + o.h > yStart && o.y + o.h < yEnd) cuts.push(o.y + o.h);
      }
    }
    cuts.sort((a, b) => a - b);
    let openStart: number | null = null;
    for (let i = 0; i < cuts.length - 1; i++) {
      const a = cuts[i];
      const b = cuts[i + 1];
      if (b - a <= 0.25) continue;
      const my = (a + b) * 0.5;
      const blockedByOpen = isPointInOtherWalkable(probeX, my, selfIdx);
      if (!blockedByOpen) {
        if (openStart === null) openStart = a;
      } else if (openStart !== null) {
        segs.push({ x1: xEdge, y1: openStart, x2: xEdge, y2: a });
        openStart = null;
      }
    }
    if (openStart !== null) {
      segs.push({ x1: xEdge, y1: openStart, x2: xEdge, y2: yEnd });
    }
  };

  rects.forEach((r, idx) => {
    addClippedHorizontal(r.y, r.x, r.x + r.w, idx, -1);
    addClippedHorizontal(r.y + r.h, r.x, r.x + r.w, idx, 1);
    addClippedVertical(r.x, r.y, r.y + r.h, idx, -1);
    addClippedVertical(r.x + r.w, r.y, r.y + r.h, idx, 1);
  });

  for (const obs of mapDef.obstacles) {
    if ((obs.floor || 1) !== floor) continue;
    if (obs.kind === "server" || obs.kind === "reactor" || obs.kind === "rock" || obs.kind === "crate") {
      segs.push({ x1: obs.x, y1: obs.y, x2: obs.x + obs.w, y2: obs.y });
      segs.push({ x1: obs.x, y1: obs.y + obs.h, x2: obs.x + obs.w, y2: obs.y + obs.h });
      segs.push({ x1: obs.x, y1: obs.y, x2: obs.x, y2: obs.y + obs.h });
      segs.push({ x1: obs.x + obs.w, y1: obs.y, x2: obs.x + obs.w, y2: obs.y + obs.h });
    }
  }

  for (const d of closedDoors) {
    if ((d.floor || 1) !== floor) continue;
    segs.push({ x1: d.x, y1: d.y, x2: d.x + d.w, y2: d.y });
    segs.push({ x1: d.x, y1: d.y + d.h, x2: d.x + d.w, y2: d.y + d.h });
    segs.push({ x1: d.x, y1: d.y, x2: d.x, y2: d.y + d.h });
    segs.push({ x1: d.x + d.w, y1: d.y, x2: d.x + d.w, y2: d.y + d.h });
  }

  return segs;
}

function raySegIntersect(
  ox: number,
  oy: number,
  dx: number,
  dy: number,
  seg: WallSeg,
  maxDist: number
): number {
  const sx = seg.x2 - seg.x1;
  const sy = seg.y2 - seg.y1;
  const denom = dx * sy - dy * sx;
  if (Math.abs(denom) < 1e-7) return maxDist;
  const rx = seg.x1 - ox;
  const ry = seg.y1 - oy;
  const t = (rx * sy - ry * sx) / denom;
  const u = (rx * dy - ry * dx) / denom;
  if (t >= 0 && t < maxDist && u >= -0.001 && u <= 1.001) return t;
  return maxDist;
}

export function computeVisibilityPolygon(
  ox: number,
  oy: number,
  radius: number,
  segs: WallSeg[]
): { x: number; y: number }[] {
  const numRays = 144;
  const pts: { x: number; y: number }[] = [];
  const nearSegs = segs.filter((s) => {
    const minX = Math.min(s.x1, s.x2) - radius;
    const maxX = Math.max(s.x1, s.x2) + radius;
    const minY = Math.min(s.y1, s.y2) - radius;
    const maxY = Math.max(s.y1, s.y2) + radius;
    return ox >= minX && ox <= maxX && oy >= minY && oy <= maxY;
  });

  for (let i = 0; i < numRays; i++) {
    const ang = (i / numRays) * Math.PI * 2;
    const dx = Math.cos(ang);
    const dy = Math.sin(ang);
    let best = radius;
    for (const s of nearSegs) {
      const d = raySegIntersect(ox, oy, dx, dy, s, best);
      if (d < best) best = d;
    }
    pts.push({ x: ox + dx * best, y: oy + dy * best });
  }
  return pts;
}

export function hasLineOfSight(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  segs: WallSeg[]
): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist < 4) return true;
  const ux = dx / dist;
  const uy = dy / dist;
  for (const s of segs) {
    const hit = raySegIntersect(x1, y1, ux, uy, s, dist);
    if (hit < dist - 4) return false;
  }
  return true;
}

/**
 * 視界距離 + 壁/閉鎖ドアの射線判定を厳密に行い、視界外キャラ描画・ネームプレート透視を防ぐ
 */
export function isEntityVisible(
  eyeX: number,
  eyeY: number,
  targetX: number,
  targetY: number,
  maxDist: number,
  segs: WallSeg[],
  targetRadius = 12
): boolean {
  if (!Number.isFinite(eyeX) || !Number.isFinite(eyeY) || !Number.isFinite(targetX) || !Number.isFinite(targetY)) {
    return false;
  }
  const dx = targetX - eyeX;
  const dy = targetY - eyeY;
  const dist = Math.hypot(dx, dy);
  if (dist > maxDist) return false;
  if (dist < 14) return true;
  if (hasLineOfSight(eyeX, eyeY, targetX, targetY, segs)) return true;
  if (targetRadius > 0) {
    const px = -dy / dist;
    const py = dx / dist;
    const off = targetRadius * 0.72;
    if (
      hasLineOfSight(eyeX, eyeY, targetX + px * off, targetY + py * off, segs) ||
      hasLineOfSight(eyeX, eyeY, targetX - px * off, targetY - py * off, segs)
    ) {
      return true;
    }
  }
  return false;
}

export function sanitizeCameraPos(
  cam: { x: number; y: number } | null | undefined,
  fallback: { x: number; y: number },
  mapDef?: MapDef
): { x: number; y: number } {
  const safeFallbackX = Number.isFinite(fallback.x) ? fallback.x : mapDef?.emergency.x ?? 1040;
  const safeFallbackY = Number.isFinite(fallback.y) ? fallback.y : mapDef?.emergency.y ?? 670;
  const rawX = cam && Number.isFinite(cam.x) ? cam.x : safeFallbackX;
  const rawY = cam && Number.isFinite(cam.y) ? cam.y : safeFallbackY;
  return {
    x: Math.max(-160, Math.min(2240, rawX)),
    y: Math.max(-160, Math.min(1500, rawY)),
  };
}

export function worldToScreen(
  wx: number,
  wy: number,
  camX: number,
  camY: number,
  viewportW: number,
  viewportH: number,
  zoom = 1
): { x: number; y: number } {
  const z = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  return {
    x: viewportW / 2 + (wx - camX) * z,
    y: viewportH / 2 + (wy - camY) * z,
  };
}

export function screenToWorld(
  sx: number,
  sy: number,
  camX: number,
  camY: number,
  viewportW: number,
  viewportH: number,
  zoom = 1
): { x: number; y: number } {
  const z = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  return {
    x: camX + (sx - viewportW / 2) / z,
    y: camY + (sy - viewportH / 2) / z,
  };
}

export function assignRoles(
  playerIds: string[],
  impostorCount: number,
  settings: GameSettings
): { roles: Record<string, RoleId>; executionerTargets: Record<string, string> } {
  const shuffled = shuffle(playerIds);
  const roles: Record<string, RoleId> = {};
  const executionerTargets: Record<string, string> = {};

  const maxImp = Math.max(1, Math.min(impostorCount, Math.floor(shuffled.length / 2.6)));
  const isEnabled = (id: RoleId) => settings.enableExtraRoles && settings.enabledRoles[id] !== false;

  const impPool: RoleId[] = [];
  if (isEnabled("phantom")) impPool.push("phantom");
  if (isEnabled("madscientist")) impPool.push("madscientist");
  if (isEnabled("viper")) impPool.push("viper");
  if (isEnabled("shapeshifter")) impPool.push("shapeshifter");

  for (let i = 0; i < maxImp; i++) {
    if (impPool.length > 0 && (i > 0 || Math.random() < 0.72)) {
      const idx = Math.floor(Math.random() * impPool.length);
      roles[shuffled[i]] = impPool.splice(idx, 1)[0];
    } else {
      roles[shuffled[i]] = "impostor";
    }
  }

  let cursor = maxImp;
  const neutralCandidates = shuffle(
    (["jester", "jackal", "arsonist", "survivor", "executioner"] as RoleId[]).filter(isEnabled)
  );
  const maxNeutrals = shuffled.length >= 7 ? 2 : shuffled.length >= 5 ? 1 : 0;
  for (let n = 0; n < maxNeutrals && cursor < shuffled.length && n < neutralCandidates.length; n++) {
    roles[shuffled[cursor]] = neutralCandidates[n];
    cursor++;
  }

  const crewPool = shuffle(
    ([
      "sheriff",
      "engineer",
      "doctor",
      "detective",
      "radar",
      "mayor",
      "security",
      "tracker",
      "teleporter",
      "psychic",
    ] as RoleId[]).filter(isEnabled)
  );

  while (cursor < shuffled.length) {
    if (crewPool.length > 0) {
      roles[shuffled[cursor]] = crewPool.pop()!;
    } else {
      roles[shuffled[cursor]] = "crewmate";
    }
    cursor++;
  }

  // Fallback check if any player skipped
  for (const id of playerIds) {
    if (!roles[id]) roles[id] = "crewmate";
  }

  // Executioner targets non-impostor crewmate
  const crewIds = playerIds.filter((id) => isCrewRole(roles[id]));
  for (const id of playerIds) {
    if (roles[id] === "executioner") {
      if (crewIds.length > 0) {
        executionerTargets[id] = crewIds[Math.floor(Math.random() * crewIds.length)];
      } else {
        roles[id] = "jester";
      }
    }
  }

  // Ensure every extra role ID in EXTRA_ROLE_IDS stays referenced cleanly
  void EXTRA_ROLE_IDS;
  return { roles, executionerTargets };
}

/**
 * GUARD_04 (スポーン部屋タスク除外) + GUARD_10 (TaskUniquenessGuard: 同カテゴリ重複なし・全150種均等分散)
 */
export function assignTasks(
  players: Record<string, PlayerState>,
  mapDef: MapDef,
  countPerPlayer: number
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  const safeSpots = mapDef.taskSpots.filter((s) => isTaskSpotSafe(s, mapDef));
  const candidateSpots = safeSpots.length >= 3 ? safeSpots : mapDef.taskSpots;
  const spotTaskIds = candidateSpots.map((s) => s.taskId);

  for (const p of Object.values(players)) {
    if (p.isSpectator || !hasTasksRole(p.role)) {
      out[p.id] = [];
      continue;
    }

    const desired = p.role === "mayor" ? Math.max(2, countPerPlayer - 1) : countPerPlayer;
    const chosen: string[] = [];
    const usedCategories = new Set<string>();

    // First draw from diverse safe spots on this map without duplicating task category
    const shuffledSpotIds = shuffle([...new Set(spotTaskIds)]);
    for (const tid of shuffledSpotIds) {
      if (chosen.length >= desired) break;
      const def = getTaskById(tid);
      if (!usedCategories.has(def.category)) {
        chosen.push(tid);
        usedCategories.add(def.category);
      }
    }

    // If desired > unique categories on map spots, supplement with unique categories from 150-task catalog
    if (chosen.length < desired) {
      const allShuffled = shuffle(TASK_CATALOG_150);
      for (const t of allShuffled) {
        if (chosen.length >= desired) break;
        if (!usedCategories.has(t.category) && !chosen.includes(t.id)) {
          chosen.push(t.id);
          usedCategories.add(t.category);
        }
      }
    }

    // Final top-up allowing same category only if desired > 15
    if (chosen.length < desired) {
      for (const tid of shuffledSpotIds) {
        if (chosen.length >= desired) break;
        if (!chosen.includes(tid)) chosen.push(tid);
      }
    }

    out[p.id] = chosen;
  }
  return out;
}

export function checkWinCondition(
  players: Record<string, PlayerState>,
  sabotage: SabotageState | null,
  taskDoneCount: number,
  taskTotalCount: number
): { winner: string; reason: string } | null {
  if (sabotage && (sabotage.type === "reactor" || sabotage.type === "gas") && sabotage.timer <= 0) {
    return {
      winner: "impostors",
      reason:
        sabotage.type === "reactor"
          ? "原子炉メルトダウンを阻止できず、艦船が崩壊しました！"
          : "船内ガス汚染が限界値を超過しました！",
    };
  }

  const active = Object.values(players).filter((p) => !p.isSpectator);
  const alive = active.filter((p) => p.alive);
  const aliveImps = alive.filter((p) => isImpostorRole(p.role));
  const aliveCrew = alive.filter((p) => isCrewRole(p.role));
  const aliveJackals = alive.filter((p) => p.role === "jackal");

  if (taskTotalCount > 0 && taskDoneCount >= taskTotalCount) {
    return { winner: "crewmates", reason: "全クルーのタスクが100%完了しました！" };
  }

  if (aliveJackals.length > 0 && alive.length <= aliveJackals.length * 2 && aliveImps.length === 0) {
    return { winner: "jackal", reason: "孤高の狩人ジャッカルが生存者を制圧しました！" };
  }

  if (aliveImps.length === 0 && aliveJackals.length === 0) {
    return { winner: "crewmates", reason: "全ての脅威(インポスター・ジャッカル)を排除しました！" };
  }

  if (aliveImps.length >= aliveCrew.length + aliveJackals.length) {
    return { winner: "impostors", reason: "インポスター陣営が生存者過半数を制圧しました！" };
  }

  return null;
}

export function tallyVotes(
  votes: Record<string, string>,
  players: Record<string, PlayerState>
): { ejectedId: string | null; isTie: boolean; counts: Record<string, number> } {
  const counts: Record<string, number> = {};
  for (const [voterId, targetId] of Object.entries(votes)) {
    const voter = players[voterId];
    if (!voter || !voter.alive || voter.isSpectator) continue;
    const weight = voter.role === "mayor" ? 2 : 1;
    counts[targetId] = (counts[targetId] || 0) + weight;
  }

  let bestTarget: string | null = null;
  let bestCount = 0;
  let tie = false;

  for (const [targetId, cnt] of Object.entries(counts)) {
    if (cnt > bestCount) {
      bestCount = cnt;
      bestTarget = targetId;
      tie = false;
    } else if (cnt === bestCount && cnt > 0) {
      tie = true;
    }
  }

  if (!bestTarget || bestTarget === "skip" || tie) {
    return { ejectedId: null, isTie: tie && bestTarget !== "skip", counts };
  }
  return { ejectedId: bestTarget, isTie: false, counts };
}

export function findNearbyInteractable(
  me: PlayerState,
  players: Record<string, PlayerState>,
  bodies: DeadBody[],
  mapDef: MapDef,
  sabotage: SabotageState | null
) {
  const floor = me.floor || 1;
  // GUARD_01: Dead/spectators never see report target
  const canReport = validateAliveReporter(me);
  const nearestBody = canReport
    ? bodies
        .filter((b) => (b.floor || 1) === floor && Math.hypot(b.x - me.x, b.y - me.y) <= 95)
        .sort((a, b) => Math.hypot(a.x - me.x, a.y - me.y) - Math.hypot(b.x - me.x, b.y - me.y))[0] || null
    : null;

  const nearestKill = me.alive
    ? Object.values(players)
        .filter((p) => {
          if (p.id === me.id || !p.alive || p.isSpectator) return false;
          if ((p.floor || 1) !== floor) return false;
          if (isImpostorRole(me.role) && isImpostorRole(p.role)) return false;
          if (me.role === "arsonist" && p.doused) return false;
          return Math.hypot(p.x - me.x, p.y - me.y) <= 92;
        })
        .sort((a, b) => Math.hypot(a.x - me.x, a.y - me.y) - Math.hypot(b.x - me.x, b.y - me.y))[0] || null
    : null;

  const nearestVentIdx = canUseVentRole(me.role) && me.alive
    ? mapDef.vents.findIndex((v) => (v.floor || 1) === floor && Math.hypot(v.x - me.x, v.y - me.y) <= 68)
    : -1;

  let sabFixDist = Infinity;
  if (sabotage && sabotage.type !== "doors" && me.alive) {
    const pt = mapDef.sabotageFix[sabotage.type];
    if (pt && (pt.floor || 1) === floor) {
      sabFixDist = Math.hypot(pt.x - me.x, pt.y - me.y);
    }
  }

  return {
    nearestBody,
    nearestKill,
    nearestVentIdx,
    nearSabotageFix: sabFixDist <= 90,
    canEmergency:
      me.alive &&
      !sabotage &&
      (mapDef.emergency.floor || 1) === floor &&
      Math.hypot(mapDef.emergency.x - me.x, mapDef.emergency.y - me.y) <= 78,
  };
}

export interface UseActionState {
  kind: "none" | "sabotage_fix" | "task" | "gimmick" | "emergency";
  label: string;
  enabled: boolean;
  taskId?: string;
  gimmick?: GimmickNode;
}

export function getUseActionState(params: {
  me: PlayerState;
  mapDef: MapDef;
  sabotage: SabotageState | null;
  myTasks: string[];
  completedTasks: Record<string, boolean>;
  gimmickCooldowns: Record<string, number>;
  emergencyCooldown: number;
  emergencyUsesLeft: number;
}): UseActionState {
  const {
    me,
    mapDef,
    sabotage,
    myTasks,
    completedTasks,
    gimmickCooldowns,
    emergencyCooldown,
    emergencyUsesLeft,
  } = params;
  const floor = me.floor || 1;

  if (me.alive && sabotage && sabotage.type !== "doors") {
    const pt = mapDef.sabotageFix[sabotage.type];
    if (pt && (pt.floor || 1) === floor && Math.hypot(pt.x - me.x, pt.y - me.y) <= 90) {
      return { kind: "sabotage_fix", label: "🔧 妨害を修理", enabled: true };
    }
  }

  if (hasTasksRole(me.role) && !me.isSpectator) {
    const spot = mapDef.taskSpots.find(
      (s) =>
        (s.floor || 1) === floor &&
        myTasks.includes(s.taskId) &&
        !completedTasks[s.taskId] &&
        Math.hypot(s.x - me.x, s.y - me.y) <= 78
    );
    if (spot) {
      const tDef = getTaskById(spot.taskId);
      return { kind: "task", label: `⚡ ${tDef.name}`, enabled: true, taskId: spot.taskId };
    }
  }

  if (!me.isSpectator) {
    const nearbyGimmicks = mapDef.gimmicks
      .map((g, idx) => ({ g, idx, dist: Math.hypot(g.x - me.x, g.y - me.y) }))
      .filter(
        (item) =>
          INTERACTIVE_GIMMICKS.has(item.g.type) &&
          (me.alive || item.g.type === "stairs" || item.g.type === "teleport") &&
          (item.g.floor || 1) === floor &&
          item.dist <= 82
      )
      .sort((a, b) => a.dist - b.dist);

    if (nearbyGimmicks.length > 0) {
      const { g, idx } = nearbyGimmicks[0];
      const cd = gimmickCooldowns[getGimmickKey(g, idx)] || 0;
      return {
        kind: "gimmick",
        label: cd > 0 ? `${g.icon || "✨"} (${Math.ceil(cd)}s)` : `${g.icon || "✨"} ${g.label}`,
        enabled: cd <= 0,
        gimmick: g,
      };
    }

    if (me.alive && (mapDef.emergency.floor || 1) === floor && Math.hypot(mapDef.emergency.x - me.x, mapDef.emergency.y - me.y) <= 78) {
      const ok = !sabotage && emergencyCooldown <= 0 && emergencyUsesLeft > 0;
      return {
        kind: "emergency",
        label:
          emergencyCooldown > 0
            ? `🔔 (${Math.ceil(emergencyCooldown)}s)`
            : emergencyUsesLeft <= 0
              ? "🔔 回数切れ"
              : sabotage
                ? "🔔 妨害中は不可"
                : "🔔 緊急会議",
        enabled: ok,
      };
    }
  }

  return { kind: "none", label: "⚡ 使用 / 修理", enabled: false };
}

export function createDoorLogEntry(
  player: PlayerState,
  location: string,
  elapsedSec: number,
  colorHex: string
): DoorLogEntry {
  const mins = Math.floor(elapsedSec / 60);
  const secs = Math.floor(elapsedSec % 60);
  return {
    id: `dl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    playerName: player.disguisedAs ? player.disguisedAs.name : player.name,
    colorHex,
    location,
    timeText: `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
  };
}

/**
 * マップ固有ギミックによる移動補正・状態判定エンジン
 */
export function computeGimmickEffects(params: {
  x: number;
  y: number;
  floor: number;
  mapDef: MapDef;
  enabled: boolean;
  elapsedSec: number;
}): {
  speedMul: number;
  onIce: boolean;
  pushVx: number;
  pushVy: number;
  inCloakZone: boolean;
  laserBlocked: boolean;
  visionScale: number;
  statusLabel: string | null;
} {
  const { x, y, floor, mapDef, enabled, elapsedSec } = params;
  if (!enabled) {
    return {
      speedMul: 1,
      onIce: false,
      pushVx: 0,
      pushVy: 0,
      inCloakZone: false,
      laserBlocked: false,
      visionScale: 1,
      statusLabel: null,
    };
  }

  let speedMul = 1;
  let onIce = !!mapDef.isLowGravity;
  let pushVx = 0;
  let pushVy = 0;
  let inCloakZone = false;
  let laserBlocked = false;
  let visionScale = mapDef.isDarkFog ? 0.72 : 1;
  let statusLabel: string | null = mapDef.isLowGravity ? "🪐 低重力慣性" : mapDef.isDarkFog ? "🌫️ 濃霧低視界" : null;

  // Periodic blizzard cycle (12s storm every 32s)
  if (mapDef.hasBlizzard) {
    const cycle = elapsedSec % 32;
    if (cycle >= 20) {
      visionScale = Math.min(visionScale, 0.56);
      statusLabel = `🌨️ 猛吹雪 (${Math.ceil(32 - cycle)}s)`;
    }
  }

  // Periodic flicker lights
  if (mapDef.uniqueGimmick === "flicker_lights") {
    const cycle = elapsedSec % 26;
    if (cycle >= 19) {
      visionScale = Math.min(visionScale, 0.5);
      statusLabel = `⚡ 電力低下・照明明滅`;
    }
  }

  for (const g of mapDef.gimmicks) {
    if ((g.floor || 1) !== floor) continue;
    if (g.type === "speed_pad" && Math.hypot(g.x - x, g.y - y) <= 46) {
      speedMul = Math.max(speedMul, 1.55);
      statusLabel = `⚡ ${g.label}`;
    } else if (g.type === "gravity_well" && Math.hypot(g.x - x, g.y - y) <= 58) {
      speedMul = Math.max(speedMul, 1.38);
      statusLabel = `🌀 重力加速`;
    } else if (g.type === "ice" && g.w && g.h && x >= g.x && x <= g.x + g.w && y >= g.y && y <= g.y + g.h) {
      onIce = true;
      speedMul = Math.max(speedMul, 1.18);
      statusLabel = `🧊 氷結滑走`;
    } else if (
      (g.type === "wind" || g.type === "conveyor") &&
      g.w &&
      g.h &&
      x >= g.x &&
      x <= g.x + g.w &&
      y >= g.y &&
      y <= g.y + g.h
    ) {
      pushVx += g.vx || 0;
      pushVy += g.vy || 0;
      statusLabel = `${g.icon || "💨"} ${g.label}`;
    } else if (
      (g.type === "hide_canopy" || g.type === "cloak_pad") &&
      g.w &&
      g.h &&
      x >= g.x &&
      x <= g.x + g.w &&
      y >= g.y &&
      y <= g.y + g.h
    ) {
      inCloakZone = true;
      statusLabel = g.type === "hide_canopy" ? "🌿 樹冠潜伏中" : "👻 光学迷彩潜伏中";
    } else if (
      g.type === "laser_gate" &&
      g.w &&
      g.h &&
      x >= g.x &&
      x <= g.x + g.w &&
      y >= g.y &&
      y <= g.y + g.h
    ) {
      const laserOn = Math.floor(elapsedSec / 6) % 2 === 1;
      if (laserOn) {
        laserBlocked = true;
        speedMul = 0.55;
        statusLabel = "🔺 レーザー警戒柵作動中(減速)";
      }
    }
  }

  return { speedMul, onIce, pushVx, pushVy, inCloakZone, laserBlocked, visionScale, statusLabel };
}

/* -------------------------------------------------------------------------- */
/* Multi-Location Surveillance Camera Feed Registry                           */
/* -------------------------------------------------------------------------- */

export interface CameraFeedPoint {
  id: string;
  label: string;
  areaName: string;
  x: number;
  y: number;
  floor: number;
}

function getNearestAreaLabel(x: number, y: number, mapDef: MapDef, floor: number): string {
  const exact = getRoomName(x, y, mapDef, floor);
  if (exact !== "連絡通路") return exact;
  let bestRoomName = "中央";
  let bestDist = Infinity;
  for (const r of mapDef.rooms) {
    if ((r.floor || 1) !== floor) continue;
    const cx = Math.max(r.x, Math.min(r.x + r.w, x));
    const cy = Math.max(r.y, Math.min(r.y + r.h, y));
    const d = Math.hypot(x - cx, y - cy);
    if (d < bestDist) {
      bestDist = d;
      bestRoomName = r.name;
    }
  }
  return `${bestRoomName}前通路`;
}

/**
 * マップ上の監視カメラ本体(camera_prop)すべてを監視フィード配列として構築する（常に3〜4基保証）
 */
export function buildMapCameraFeeds(mapDef: MapDef): CameraFeedPoint[] {
  const feeds: CameraFeedPoint[] = [];
  const props = mapDef.decors.filter((d) => d.kind === "camera_prop");

  for (const prop of props) {
    const f = prop.floor || 1;
    const cx = Math.round(prop.x + prop.w / 2);
    const cy = Math.round(prop.y + prop.h / 2);
    const areaName = getNearestAreaLabel(cx, cy, mapDef, f);
    const idx = feeds.length + 1;
    feeds.push({
      id: `cam_${idx}_${f}`,
      label: `CAM-${idx} · ${areaName}${mapDef.hasMultiFloor ? ` (${f}F)` : ""}`,
      areaName,
      x: cx,
      y: cy,
      floor: f,
    });
  }

  // Fallback safeguard: synthesize hallway viewpoints if a custom map has < 3 camera_props
  if (feeds.length < 3) {
    for (const c of mapDef.corridors) {
      if (feeds.length >= 4) break;
      const f = c.floor || 1;
      const cx = Math.round(c.x + c.w / 2);
      const cy = Math.round(c.y + c.h / 2);
      if (feeds.some((fd) => fd.floor === f && Math.hypot(fd.x - cx, fd.y - cy) < 220)) continue;
      const areaName = getNearestAreaLabel(cx, cy, mapDef, f);
      const idx = feeds.length + 1;
      feeds.push({
        id: `cam_${idx}_${f}`,
        label: `CAM-${idx} · ${areaName}${mapDef.hasMultiFloor ? ` (${f}F)` : ""}`,
        areaName,
        x: cx,
        y: cy,
        floor: f,
      });
    }
  }

  return feeds.length > 0
    ? feeds
    : [
        {
          id: "cam_1_1",
          label: "CAM-1 · 中央監視",
          areaName: "中央",
          x: mapDef.emergency.x,
          y: mapDef.emergency.y,
          floor: mapDef.emergency.floor || 1,
        },
      ];
}

/* -------------------------------------------------------------------------- */
/* AI NavGraph Pathfinding, Obstacle Steering & Stuck Recovery Watchdog       */
/* -------------------------------------------------------------------------- */

export interface NavWaypoint {
  x: number;
  y: number;
  floor: number;
  isPortal?: boolean;
  targetX?: number;
  targetY?: number;
  targetFloor?: number;
}

interface NavEdge {
  to: number;
  cost: number;
  isPortal?: boolean;
  portalTargetX?: number;
  portalTargetY?: number;
  portalTargetFloor?: number;
}

export interface NavGraph {
  nodes: { id: number; x: number; y: number; floor: number }[];
  edges: NavEdge[][];
}

export interface AiLocomotionState {
  targetX: number;
  targetY: number;
  floor: number;
  taskTargetId: string | null;
  dwellTimer: number;
  patrolPause: number;
  killCd: number;
  sabCd: number;
  stepTimer: number;
  waypoints: NavWaypoint[];
  steerSide: 1 | -1;
  lastProgressX: number;
  lastProgressY: number;
  stuckTimer: number;
  hardStuckCount: number;
}

const navGraphCache = new WeakMap<MapDef, NavGraph>();

export function canWalkSegment(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  mapDef: MapDef,
  floor: number,
  doorsLocked = false,
  doorBlockers: DoorBlockerRect[] = []
): boolean {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  if (dist < 1) return canWalk(x2, y2, mapDef, false, floor, doorsLocked, doorBlockers);
  const steps = Math.max(2, Math.ceil(dist / 16));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    if (!canWalk(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, mapDef, false, floor, doorsLocked, doorBlockers)) {
      return false;
    }
  }
  return true;
}

export function getMapNavGraph(mapDef: MapDef): NavGraph {
  const cached = navGraphCache.get(mapDef);
  if (cached) return cached;

  const nodes: { id: number; x: number; y: number; floor: number }[] = [];
  const tryAddNode = (x: number, y: number, floor: number, minSep = 28): number => {
    const rx = Math.round(x);
    const ry = Math.round(y);
    if (!canWalk(rx, ry, mapDef, false, floor)) return -1;
    const existing = nodes.findIndex((n) => n.floor === floor && Math.hypot(n.x - rx, n.y - ry) < minSep);
    if (existing >= 0) return existing;
    const id = nodes.length;
    nodes.push({ id, x: rx, y: ry, floor });
    return id;
  };

  for (const r of mapDef.rooms) {
    const f = r.floor || 1;
    const padX = Math.min(46, r.w * 0.22);
    const padY = Math.min(46, r.h * 0.22);
    const pts: [number, number][] = [
      [r.x + r.w / 2, r.y + r.h / 2],
      [r.x + padX, r.y + padY],
      [r.x + r.w - padX, r.y + padY],
      [r.x + padX, r.y + r.h - padY],
      [r.x + r.w - padX, r.y + r.h - padY],
      [r.x + r.w / 2, r.y + padY],
      [r.x + r.w / 2, r.y + r.h - padY],
      [r.x + padX, r.y + r.h / 2],
      [r.x + r.w - padX, r.y + r.h / 2],
    ];
    for (const [px, py] of pts) {
      if (tryAddNode(px, py, f, 36) < 0) {
        const resolved = resolveSafePos(px, py, mapDef, f, false);
        tryAddNode(resolved.x, resolved.y, f, 36);
      }
    }
  }

  for (const c of mapDef.corridors) {
    const f = c.floor || 1;
    const horizontal = c.w >= c.h;
    if (horizontal) {
      const cy = c.y + c.h / 2;
      const span = Math.max(1, Math.floor(c.w / 140));
      for (let i = 0; i <= span; i++) {
        const px = c.x + 22 + ((c.w - 44) * i) / Math.max(1, span);
        tryAddNode(px, cy, f, 30);
      }
    } else {
      const cx = c.x + c.w / 2;
      const span = Math.max(1, Math.floor(c.h / 140));
      for (let i = 0; i <= span; i++) {
        const py = c.y + 22 + ((c.h - 44) * i) / Math.max(1, span);
        tryAddNode(cx, py, f, 30);
      }
    }
  }

  // Register explicit nodes at stairs / teleport entry & exit points
  const portalPairs: { fromIdx: number; toX: number; toY: number; toFloor: number }[] = [];
  for (const g of mapDef.gimmicks) {
    if ((g.type === "stairs" || g.type === "teleport") && g.targetX !== undefined && g.targetY !== undefined) {
      const gf = g.floor || 1;
      const tf = g.targetFloor || 1;
      const safeFrom = resolveSafePos(g.x, g.y, mapDef, gf, false);
      const fromIdx = tryAddNode(safeFrom.x, safeFrom.y, gf, 16);
      const safeTo = resolveSafePos(g.targetX, g.targetY, mapDef, tf, false);
      tryAddNode(safeTo.x, safeTo.y, tf, 16);
      if (fromIdx >= 0) {
        portalPairs.push({ fromIdx, toX: safeTo.x, toY: safeTo.y, toFloor: tf });
      }
    }
  }

  const edges: NavEdge[][] = nodes.map(() => []);

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      if (a.floor !== b.floor) continue;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > 540) continue;
      if (canWalkSegment(a.x, a.y, b.x, b.y, mapDef, a.floor)) {
        edges[i].push({ to: j, cost: d });
        edges[j].push({ to: i, cost: d });
      }
    }
  }

  // Fallback connectivity: ensure same-floor nearby nodes (< 160px) across tight intersections aren't disconnected
  for (const pair of portalPairs) {
    let bestTo = -1;
    let bestD = Infinity;
    for (const n of nodes) {
      if (n.floor !== pair.toFloor) continue;
      const d = Math.hypot(n.x - pair.toX, n.y - pair.toY);
      if (d < bestD) {
        bestD = d;
        bestTo = n.id;
      }
    }
    if (bestTo >= 0) {
      edges[pair.fromIdx].push({
        to: bestTo,
        cost: 90 + bestD,
        isPortal: true,
        portalTargetX: pair.toX,
        portalTargetY: pair.toY,
        portalTargetFloor: pair.toFloor,
      });
    }
  }

  const graph: NavGraph = { nodes, edges };
  navGraphCache.set(mapDef, graph);
  return graph;
}

export function findNavPath(
  mapDef: MapDef,
  sx: number,
  sy: number,
  sFloor: number,
  tx: number,
  ty: number,
  tFloor: number
): NavWaypoint[] {
  const safeTarget = resolveSafePos(tx, ty, mapDef, tFloor, false);
  if (sFloor === tFloor && canWalkSegment(sx, sy, safeTarget.x, safeTarget.y, mapDef, sFloor)) {
    return [{ x: safeTarget.x, y: safeTarget.y, floor: tFloor }];
  }

  const graph = getMapNavGraph(mapDef);
  const { nodes, edges } = graph;
  if (nodes.length === 0) {
    return [{ x: safeTarget.x, y: safeTarget.y, floor: tFloor }];
  }

  // Pick reachable start nodes on sFloor
  const startCandidates: { idx: number; dist: number }[] = [];
  for (const n of nodes) {
    if (n.floor !== sFloor) continue;
    const d = Math.hypot(n.x - sx, n.y - sy);
    if (d <= 460 && canWalkSegment(sx, sy, n.x, n.y, mapDef, sFloor)) {
      startCandidates.push({ idx: n.id, dist: d });
    }
  }
  if (startCandidates.length === 0) {
    let nearestIdx = -1;
    let nearestDist = Infinity;
    for (const n of nodes) {
      if (n.floor !== sFloor) continue;
      const d = Math.hypot(n.x - sx, n.y - sy);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = n.id;
      }
    }
    if (nearestIdx >= 0) startCandidates.push({ idx: nearestIdx, dist: nearestDist });
  }

  // Pick reachable goal nodes on tFloor
  const goalCostToTarget = new Array<number>(nodes.length).fill(Infinity);
  for (const n of nodes) {
    if (n.floor !== tFloor) continue;
    const d = Math.hypot(n.x - safeTarget.x, n.y - safeTarget.y);
    if (d <= 460 && canWalkSegment(n.x, n.y, safeTarget.x, safeTarget.y, mapDef, tFloor)) {
      goalCostToTarget[n.id] = d;
    }
  }
  if (!goalCostToTarget.some((c) => Number.isFinite(c))) {
    let nearestIdx = -1;
    let nearestDist = Infinity;
    for (const n of nodes) {
      if (n.floor !== tFloor) continue;
      const d = Math.hypot(n.x - safeTarget.x, n.y - safeTarget.y);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = n.id;
      }
    }
    if (nearestIdx >= 0) goalCostToTarget[nearestIdx] = nearestDist;
  }

  const distArr = new Array<number>(nodes.length).fill(Infinity);
  const prevNode = new Array<number>(nodes.length).fill(-1);
  const prevEdge = new Array<NavEdge | null>(nodes.length).fill(null);
  const visited = new Uint8Array(nodes.length);

  for (const sc of startCandidates) {
    distArr[sc.idx] = sc.dist;
  }

  let bestGoalIdx = -1;
  let bestGoalTotal = Infinity;

  for (let iter = 0; iter < nodes.length; iter++) {
    let u = -1;
    let bestF = Infinity;
    for (let i = 0; i < nodes.length; i++) {
      if (visited[i] || !Number.isFinite(distArr[i])) continue;
      const h = nodes[i].floor === tFloor ? Math.hypot(nodes[i].x - safeTarget.x, nodes[i].y - safeTarget.y) : 120;
      const f = distArr[i] + h;
      if (f < bestF) {
        bestF = f;
        u = i;
      }
    }
    if (u < 0 || bestF >= bestGoalTotal) break;
    visited[u] = 1;

    if (Number.isFinite(goalCostToTarget[u])) {
      const total = distArr[u] + goalCostToTarget[u];
      if (total < bestGoalTotal) {
        bestGoalTotal = total;
        bestGoalIdx = u;
      }
    }

    for (const e of edges[u]) {
      if (visited[e.to]) continue;
      const alt = distArr[u] + e.cost;
      if (alt < distArr[e.to]) {
        distArr[e.to] = alt;
        prevNode[e.to] = u;
        prevEdge[e.to] = e;
      }
    }
  }

  if (bestGoalIdx < 0) {
    return [{ x: safeTarget.x, y: safeTarget.y, floor: tFloor }];
  }

  const chain: NavWaypoint[] = [];
  let cur = bestGoalIdx;
  while (cur >= 0) {
    const n = nodes[cur];
    const usedEdge = prevEdge[cur];
    chain.push({ x: n.x, y: n.y, floor: n.floor });
    if (usedEdge?.isPortal && prevNode[cur] >= 0) {
      const fromN = nodes[prevNode[cur]];
      chain.push({
        x: fromN.x,
        y: fromN.y,
        floor: fromN.floor,
        isPortal: true,
        targetX: usedEdge.portalTargetX ?? n.x,
        targetY: usedEdge.portalTargetY ?? n.y,
        targetFloor: usedEdge.portalTargetFloor ?? n.floor,
      });
    }
    cur = prevNode[cur];
  }
  chain.reverse();

  // Deduplicate immediate redundant points on same floor
  const out: NavWaypoint[] = [];
  for (const wp of chain) {
    if (out.length === 0 && Math.hypot(wp.x - sx, wp.y - sy) < 16 && wp.floor === sFloor && !wp.isPortal) {
      continue;
    }
    const prev = out[out.length - 1];
    if (prev && !wp.isPortal && !prev.isPortal && prev.floor === wp.floor && Math.hypot(prev.x - wp.x, prev.y - wp.y) < 18) {
      continue;
    }
    out.push(wp);
  }
  out.push({ x: safeTarget.x, y: safeTarget.y, floor: tFloor });
  return out;
}

export function steerAiStep(
  px: number,
  py: number,
  tx: number,
  ty: number,
  stepDist: number,
  mapDef: MapDef,
  floor: number,
  doorsLocked: boolean,
  doorBlockers: DoorBlockerRect[],
  preferredSide: 1 | -1
): { x: number; y: number; movedDist: number; blocked: boolean } {
  const dx = tx - px;
  const dy = ty - py;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.001) return { x: px, y: py, movedDist: 0, blocked: false };

  const ux = dx / dist;
  const uy = dy / dist;
  const moveLen = Math.min(stepDist, dist);

  // Direct slide attempt
  const direct = moveWithSlide(px, py, ux * moveLen, uy * moveLen, mapDef, false, floor, doorsLocked, doorBlockers);
  const directMoved = Math.hypot(direct.x - px, direct.y - py);
  if (directMoved >= moveLen * 0.45) {
    return { x: direct.x, y: direct.y, movedDist: directMoved, blocked: false };
  }

  // Tangent obstacle-avoidance angles ordered by preferredSide to avoid jitter oscillation
  const degs = [32, 58, 82, 108, 135];
  let bestPos = direct;
  let bestScore = directMoved * 1.1;

  for (const deg of degs) {
    for (const sign of [preferredSide, -preferredSide as 1 | -1]) {
      const rad = (deg * sign * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const rx = ux * cos - uy * sin;
      const ry = ux * sin + uy * cos;
      const cand = moveWithSlide(px, py, rx * moveLen, ry * moveLen, mapDef, false, floor, doorsLocked, doorBlockers);
      const moved = Math.hypot(cand.x - px, cand.y - py);
      if (moved < moveLen * 0.25) continue;
      // Score balances distance actually moved + progress toward waypoint
      const progress = dist - Math.hypot(tx - cand.x, ty - cand.y);
      const score = moved * 0.9 + Math.max(-moved * 0.3, progress) * 0.4;
      if (score > bestScore) {
        bestScore = score;
        bestPos = cand;
      }
    }
    if (bestScore >= moveLen * 0.55) break;
  }

  const finalMoved = Math.hypot(bestPos.x - px, bestPos.y - py);
  return {
    x: bestPos.x,
    y: bestPos.y,
    movedDist: finalMoved,
    blocked: finalMoved < Math.max(0.5, moveLen * 0.15),
  };
}

/**
 * AIのターゲット設定＋A*経路計画＋階層移動＋スタック自動回復を一括実行する純粋関数
 */
export function assignNextAiTarget(
  p: PlayerState,
  br: AiLocomotionState,
  mapDef: MapDef,
  avoidRoomX?: number,
  avoidRoomY?: number
) {
  const curFloor = p.floor || 1;
  const nextTid = hasTasksRole(p.role) ? p.tasks.find((tid) => !p.completedTasks[tid]) || null : null;
  const nextSpot = nextTid ? mapDef.taskSpots.find((s) => s.taskId === nextTid) || null : null;

  if (nextSpot && (!avoidRoomX || Math.hypot(nextSpot.x - avoidRoomX, nextSpot.y - avoidRoomY!) > 80)) {
    const sf = nextSpot.floor || 1;
    const safe = resolveSafePos(nextSpot.x, nextSpot.y, mapDef, sf, false);
    br.taskTargetId = nextTid;
    br.targetX = safe.x;
    br.targetY = safe.y;
    br.floor = sf;
    br.waypoints = findNavPath(mapDef, p.x, p.y, curFloor, safe.x, safe.y, sf);
    br.stuckTimer = 0;
    return;
  }

  const candidates = mapDef.rooms.filter(
    (r) => !avoidRoomX || Math.hypot(r.x + r.w / 2 - avoidRoomX, r.y + r.h / 2 - (avoidRoomY || 0)) > 160
  );
  const pool = candidates.length > 0 ? candidates : mapDef.rooms;
  const pickRoom = pool[Math.floor(Math.random() * pool.length)] || mapDef.rooms[0];
  const rf = pickRoom.floor || 1;
  const rawTx = pickRoom.x + pickRoom.w * (0.28 + Math.random() * 0.44);
  const rawTy = pickRoom.y + pickRoom.h * (0.28 + Math.random() * 0.44);
  const safe = resolveSafePos(rawTx, rawTy, mapDef, rf, false);

  br.taskTargetId = null;
  br.targetX = safe.x;
  br.targetY = safe.y;
  br.floor = rf;
  br.waypoints = findNavPath(mapDef, p.x, p.y, curFloor, safe.x, safe.y, rf);
  br.stuckTimer = 0;
}

export function stepAiLocomotion(
  p: PlayerState,
  br: AiLocomotionState,
  mapDef: MapDef,
  dt: number,
  speed: number,
  doorsLocked: boolean,
  doorBlockers: DoorBlockerRect[]
): { nextPlayer: PlayerState; completedTaskId: string | null } {
  const curFloor = p.floor || 1;
  let completedTaskId: string | null = null;
  let np = p;

  if (br.patrolPause > 0) {
    br.patrolPause -= dt;
    br.lastProgressX = p.x;
    br.lastProgressY = p.y;
    br.stuckTimer = 0;
    return { nextPlayer: np, completedTaskId: null };
  }

  if (br.dwellTimer > 0) {
    br.dwellTimer -= dt;
    br.lastProgressX = p.x;
    br.lastProgressY = p.y;
    br.stuckTimer = 0;
    if (br.dwellTimer <= 0) {
      if (hasTasksRole(p.role) && br.taskTargetId) {
        completedTaskId = br.taskTargetId;
        np = {
          ...p,
          completedTasks: { ...p.completedTasks, [br.taskTargetId]: true },
        };
      }
      assignNextAiTarget(np, br, mapDef);
      br.patrolPause = 2.2 + Math.random() * 3.0;
    }
    return { nextPlayer: np, completedTaskId };
  }

  if (!br.waypoints || br.waypoints.length === 0) {
    br.waypoints = findNavPath(mapDef, p.x, p.y, curFloor, br.targetX, br.targetY, br.floor || 1);
  }

  const wp = br.waypoints[0];
  if (!wp) {
    assignNextAiTarget(np, br, mapDef);
    return { nextPlayer: np, completedTaskId: null };
  }

  // Handle floor transition when standing on a stairs / teleport node
  if (wp.isPortal && Math.hypot(wp.x - p.x, wp.y - p.y) < 34) {
    const tf = wp.targetFloor || 1;
    const safeDest = resolveSafePos(wp.targetX ?? p.x, wp.targetY ?? p.y, mapDef, tf, false);
    np = { ...p, x: safeDest.x, y: safeDest.y, floor: tf };
    br.waypoints.shift();
    br.lastProgressX = safeDest.x;
    br.lastProgressY = safeDest.y;
    br.stuckTimer = 0;
    return { nextPlayer: np, completedTaskId: null };
  }

  // Advance waypoint or reach final target
  const distToWp = Math.hypot(wp.x - p.x, wp.y - p.y);
  if (br.waypoints.length > 1 && distToWp < 26) {
    br.waypoints.shift();
    br.stuckTimer = 0;
    return { nextPlayer: np, completedTaskId: null };
  }

  if (br.waypoints.length <= 1 && (br.floor || 1) === curFloor && Math.hypot(br.targetX - p.x, br.targetY - p.y) < 30) {
    if (br.taskTargetId && hasTasksRole(p.role)) {
      const tDef = getTaskById(br.taskTargetId);
      br.dwellTimer = tDef.length === "long" ? 18 + Math.random() * 10 : 9 + Math.random() * 5;
    } else {
      br.dwellTimer = 3.2 + Math.random() * 4.0;
    }
    br.stuckTimer = 0;
    return { nextPlayer: np, completedTaskId: null };
  }

  // Move with tangent obstacle avoidance
  const res = steerAiStep(p.x, p.y, wp.x, wp.y, speed * dt, mapDef, curFloor, doorsLocked, doorBlockers, br.steerSide);
  const dx = wp.x - p.x;
  np = {
    ...p,
    x: res.x,
    y: res.y,
    facing: dx < -0.5 ? -1 : dx > 0.5 ? 1 : p.facing,
  };

  // Dual-stage Stuck Watchdog
  const progressDist = Math.hypot(np.x - br.lastProgressX, np.y - br.lastProgressY);
  if (progressDist >= 16) {
    br.lastProgressX = np.x;
    br.lastProgressY = np.y;
    br.stuckTimer = 0;
  } else {
    // Do not penalize for temporarily waiting at a closed sabotage door
    const blockedByClosedDoor =
      doorsLocked &&
      doorBlockers.some(
        (d) =>
          (d.floor || 1) === curFloor &&
          np.x >= d.x - PLAYER_RADIUS - 14 &&
          np.x <= d.x + d.w + PLAYER_RADIUS + 14 &&
          np.y >= d.y - PLAYER_RADIUS - 14 &&
          np.y <= d.y + d.h + PLAYER_RADIUS + 14
      );
    br.stuckTimer += blockedByClosedDoor ? dt * 0.25 : dt;

    if (br.stuckTimer >= 0.85 && br.stuckTimer < 1.8 && br.hardStuckCount === 0) {
      // Soft recovery: flip tangent steer direction & recompute fresh nav path
      br.steerSide = br.steerSide === 1 ? -1 : 1;
      br.hardStuckCount = 1;
      br.waypoints = findNavPath(mapDef, np.x, np.y, curFloor, br.targetX, br.targetY, br.floor || 1);
    } else if (br.stuckTimer >= 1.8) {
      // Hard recovery: snap cleanly out of tight corners to safest walkable point & switch target
      const safe = resolveSafePos(np.x, np.y, mapDef, curFloor, false);
      np = { ...np, x: safe.x, y: safe.y };
      br.steerSide = br.steerSide === 1 ? -1 : 1;
      br.hardStuckCount = 0;
      br.lastProgressX = safe.x;
      br.lastProgressY = safe.y;
      assignNextAiTarget(np, br, mapDef, br.targetX, br.targetY);
    }
  }

  return { nextPlayer: np, completedTaskId: null };
}

void ROLES;
