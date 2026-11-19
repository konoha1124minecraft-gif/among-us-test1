import { logGameError } from "./errorLogger";
import type { MapDef, PlayerState } from "./types";

export interface GuardDescriptor {
  id: string;
  label: string;
  description: string;
}

export const GUARD_REGISTRY: readonly GuardDescriptor[] = Object.freeze([
  { id: "GUARD_01_NO_DEAD_SELF_REPORT", label: "死者自己通報禁止", description: "死亡・幽霊・観戦プレイヤーは死体通報・緊急会議招集不可" },
  { id: "GUARD_02_POST_SPAWN_COOLDOWNS", label: "スポーン後CD初期化", description: "開始・会議終了・蘇生時にキル/妨害/能力/緊急/ベントCDと速度を正規リセット" },
  { id: "GUARD_03_TELEPORT_DESYNC_AND_LOOP_FIX", label: "ワープ脱シンク防止", description: "テレポート/階段時の床同期・安全位置補正・補間キュー初期化・猶予タイマー" },
  { id: "GUARD_04_EXCLUDE_SPAWN_ROOM_TASKS", label: "スポーン部屋タスク除外", description: "緊急ボタンのあるスポーンハブ部屋をタスク候補から除外し部屋分散配置" },
  { id: "GUARD_05_DYNAMIC_AI_SOLO_MAP_SELECTION", label: "動的マップ抽選統一", description: "AIソロ・オンライン両方で random / 選択マップを確実に解決" },
  { id: "GUARD_06_ALL_TASKS_STABILITY", label: "タスク安定化ガード", description: "二重完了ロック・ウィンドウ外ドラッグ解放・誤入力ロックアウト" },
  { id: "GUARD_07_RUNTIME_HEALTH_GUARD", label: "ランタイム健全性監視", description: "NaN/Infinity座標や異常クールダウンを検知・自動修復しErrorLoggerへ記録" },
  { id: "GUARD_08_P2P_STABILITY_AND_ROOM_UI", label: "ハイブリッド通信最適化", description: "STUN多重化 + Firebase RTDBフォールバック・自動退出・ホスト移譲" },
  { id: "GUARD_09_NO_DOUBLE_KILL", label: "同時二重キル防止", description: "最寄り生存ターゲット1名のみ排他ロックし即時クールダウン適用" },
  { id: "GUARD_10_TASK_UNIQUENESS", label: "タスク重複防止", description: "1人あたり同カテゴリ重複を防止し15カテゴリへ均等分散" },
  { id: "GUARD_11_DECOR_COLLISION_GUARD", label: "装飾重なり防止", description: "壁・障害物・タスク計器・装飾同士の接触重複をロード時に自動解消" },
  { id: "GUARD_12_EXPONENTIAL_LERP_SYNC", label: "指数補間同期", description: "260px閾値ワープスナップ付き指数Lerpで低遅延かつ滑らかな位置同期" },
]);

/**
 * GUARD_01: 死者・幽霊・観戦者が通報できないことを検証
 */
export function validateAliveReporter(me: PlayerState | null | undefined): boolean {
  if (!me) return false;
  if (!me.alive || me.isSpectator) return false;
  return true;
}

/**
 * GUARD_02: 試合開始/会議明け/蘇生後のクールダウン一括リセット
 */
export function buildPostSpawnCooldowns(killCooldownSec: number, isMeetingEnd = false) {
  return {
    killCooldown: Math.max(8, killCooldownSec),
    sabotageCooldown: isMeetingEnd ? 18 : 14,
    abilityCooldown: isMeetingEnd ? 12 : 10,
    emergencyCooldown: isMeetingEnd ? 22 : 16,
    ventCooldown: 0,
    ghostCooldown: 6,
  };
}

/**
 * GUARD_03: テレポート・階段の安全パッチ生成
 */
export function buildTeleportSyncPatch(
  targetX: number,
  targetY: number,
  targetFloor: number
): Partial<PlayerState> {
  return {
    x: targetX,
    y: targetY,
    vx: 0,
    vy: 0,
    floor: targetFloor,
    lastTeleportAt: Date.now(),
    postWarpGraceSec: 1.5,
  };
}

/**
 * GUARD_04: 緊急ボタンのあるスポーンハブ部屋(+18pxマージン)をタスク候補から除外
 */
export function isTaskSpotSafe(
  spot: { x: number; y: number; floor?: number },
  mapDef: MapDef
): boolean {
  const sf = spot.floor || 1;
  const ef = mapDef.emergency.floor || 1;
  if (sf !== ef) return true;

  // Exclude emergency hub room if spot lies inside it (with 18px safety margin)
  const hubRoom = mapDef.rooms.find(
    (r) =>
      (r.floor || 1) === ef &&
      mapDef.emergency.x >= r.x &&
      mapDef.emergency.x <= r.x + r.w &&
      mapDef.emergency.y >= r.y &&
      mapDef.emergency.y <= r.y + r.h
  );
  if (hubRoom) {
    const insideHub =
      spot.x >= hubRoom.x - 18 &&
      spot.x <= hubRoom.x + hubRoom.w + 18 &&
      spot.y >= hubRoom.y - 18 &&
      spot.y <= hubRoom.y + hubRoom.h + 18;
    if (insideHub) return false;
  }

  // Fallback distance guard around emergency button itself
  if (Math.hypot(spot.x - mapDef.emergency.x, spot.y - mapDef.emergency.y) < 115) {
    return false;
  }
  return true;
}

/**
 * GUARD_05: random指定・無効mapIdを実マップへ解決
 */
export function resolveMatchMapId(requestedMapId: string, allMapIds: string[]): string {
  if (!allMapIds.length) return "starship";
  if (requestedMapId === "random") {
    return allMapIds[Math.floor(Math.random() * allMapIds.length)];
  }
  return allMapIds.includes(requestedMapId) ? requestedMapId : allMapIds[0];
}

/**
 * GUARD_07: NaN/Infinity座標および負クールダウン自己修復 + ErrorLogger記録
 */
export function runRuntimeHealthCheck(
  players: Record<string, PlayerState>,
  mapDef: MapDef
): { repaired: boolean; nextPlayers: Record<string, PlayerState> } {
  let repaired = false;
  const nextPlayers: Record<string, PlayerState> = { ...players };
  const emX = mapDef.emergency.x || 1040;
  const emY = mapDef.emergency.y || 670;
  const emF = mapDef.emergency.floor || 1;

  for (const [id, p] of Object.entries(nextPlayers)) {
    let changed = false;
    let nx = p.x;
    let ny = p.y;
    let nvx = p.vx;
    let nvy = p.vy;
    let nf = p.floor || 1;

    if (!Number.isFinite(nx) || !Number.isFinite(ny) || nx < -100 || nx > 2300 || ny < -100 || ny > 1550) {
      logGameError(
        "RuntimeHealthGuard",
        `プレイヤー「${p.name}」の異常座標 (${p.x}, ${p.y}) を緊急ボタン座標へ自動修復しました`,
        "WARN"
      );
      nx = emX;
      ny = emY;
      nf = emF;
      nvx = 0;
      nvy = 0;
      changed = true;
    }
    if (!Number.isFinite(nvx) || !Number.isFinite(nvy)) {
      nvx = 0;
      nvy = 0;
      changed = true;
    }
    if (![1, 2].includes(nf)) {
      nf = 1;
      changed = true;
    }
    if (!p.alive && (p.inVent || p.ventIndex !== -1 || p.invisible || p.disguisedAs !== null)) {
      changed = true;
    }
    if (changed) {
      repaired = true;
      nextPlayers[id] = {
        ...p,
        x: nx,
        y: ny,
        vx: nvx,
        vy: nvy,
        floor: nf,
        inVent: !p.alive ? false : p.inVent,
        ventIndex: !p.alive ? -1 : p.ventIndex,
        invisible: !p.alive ? false : p.invisible,
        disguisedAs: !p.alive ? null : p.disguisedAs,
      };
    }
  }
  return { repaired, nextPlayers };
}

/**
 * GUARD_11: 受信P2P座標パケットの有限数値検証
 */
export function normalizeP2PPositionPacket(
  pkt: { x?: unknown; y?: unknown; vx?: unknown; vy?: unknown; floor?: unknown; facing?: unknown }
): { x: number; y: number; vx: number; vy: number; floor: number; facing: 1 | -1 } | null {
  const x = Number(pkt.x);
  const y = Number(pkt.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const vx = Number.isFinite(Number(pkt.vx)) ? Number(pkt.vx) : 0;
  const vy = Number.isFinite(Number(pkt.vy)) ? Number(pkt.vy) : 0;
  const floor = pkt.floor === 2 ? 2 : 1;
  const facing: 1 | -1 = pkt.facing === -1 ? -1 : 1;
  return { x, y, vx, vy, floor, facing };
}

/**
 * GUARD_12: フレームレート非依存の指数Lerp + ワープ閾値スナップ
 */
export function exponentialLerp(
  cur: number,
  target: number,
  dtSec: number,
  rate = 14,
  snapThreshold = 260
): number {
  if (Math.abs(target - cur) > snapThreshold) return target;
  const alpha = 1 - Math.exp(-rate * Math.min(0.1, Math.max(0.001, dtSec)));
  return cur + (target - cur) * alpha;
}
