import React, { useEffect, useMemo, useRef, useState } from "react";
import { renderMinimap } from "../game/canvasRenderer";
import { CHANGELOG_REGISTRY, filterChangelog } from "../game/changelog";
import {
  ACHIEVEMENTS,
  DEFAULT_KEYBINDS,
  FB,
  NAMEPLATES,
  PLAYER_COLORS,
  ROLES,
  formatKeyLabel,
} from "../game/constants";
import { ErrorLogger } from "../game/errorLogger";
import { GUARD_REGISTRY } from "../game/guardsAndRegistry";
import type {
  ChangelogEntry,
  DoorLogEntry,
  ErrorLogEntry,
  GameSettings,
  HudSettings,
  Keybinds,
  MapDef,
  PlayerState,
  ProgressionData,
  SabotageState,
} from "../game/types";
import { ChatPanel } from "./ChatPanel";

/* -------------------------------------------------------------------------- */
/* 1. SabotageModal                                                           */
/* -------------------------------------------------------------------------- */

interface SabotageModalProps {
  open: boolean;
  mapDef: MapDef;
  sabotageCooldown: number;
  activeSabotage: SabotageState | null;
  onTrigger: (type: SabotageState["type"]) => void;
  onClose: () => void;
}

export const SabotageModal: React.FC<SabotageModalProps> = ({
  open,
  mapDef,
  sabotageCooldown,
  activeSabotage,
  onTrigger,
  onClose,
}) => {
  if (!open) return null;
  const blocked = sabotageCooldown > 0 || !!activeSabotage;

  const items: { type: SabotageState["type"]; title: string; icon: string; desc: string; color: string }[] = [
    {
      type: "lights",
      title: "⚡ 艦内停電 (Lights)",
      icon: "💡",
      desc: `クルーの視界を大幅に制限します（修理場所: ${mapDef.sabotageFix.lights.label}）`,
      color: "border-amber-400/60 bg-amber-950/40 hover:bg-amber-900/50",
    },
    {
      type: "reactor",
      title: "☢️ 原子炉メルトダウン (Reactor)",
      icon: "☢️",
      desc: `45秒以内に解除されないとインポスター勝利！（場所: ${mapDef.sabotageFix.reactor.label}）`,
      color: "border-rose-500/70 bg-rose-950/45 hover:bg-rose-900/55",
    },
    {
      type: "gas",
      title: "☣️ 毒ガス漏洩 (Gas / O2)",
      icon: "☣️",
      desc: `45秒以内に中和コードを入力させろ！（場所: ${mapDef.sabotageFix.gas.label}）`,
      color: "border-emerald-400/60 bg-emerald-950/40 hover:bg-emerald-900/50",
    },
    {
      type: "doors",
      title: "🚪 全区画ドア封鎖 (Doors)",
      icon: "🚪",
      desc: "10秒間、通路の隔離シャッターを閉鎖し逃走・暗殺を助けます。",
      color: "border-purple-400/60 bg-purple-950/40 hover:bg-purple-900/50",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="sf-panel w-full max-w-xl rounded-3xl p-5 border-2 border-rose-500/60 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-black text-rose-300">⚡ サボタージュ制御盤</h2>
            <p className="text-[11px] text-slate-400">
              {activeSabotage
                ? "現在別のサボタージュが進行中です"
                : sabotageCooldown > 0
                  ? `再使用待機中: あと ${Math.ceil(sabotageCooldown)} 秒`
                  : "発動する緊急妨害を選択してください"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="sf-btn px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold">
            ✕ 閉じる
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <button
              key={item.type}
              type="button"
              disabled={blocked}
              onClick={() => {
                onTrigger(item.type);
                onClose();
              }}
              className={`sf-btn rounded-2xl p-4 border text-left space-y-1.5 transition disabled:opacity-45 disabled:cursor-not-allowed ${item.color}`}
            >
              <div className="text-sm font-black text-white">{item.title}</div>
              <p className="text-[11px] text-slate-300 leading-snug">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. MapModal                                                                */
/* -------------------------------------------------------------------------- */

interface MapModalProps {
  open: boolean;
  mapDef: MapDef;
  me: PlayerState;
  players: Record<string, PlayerState>;
  myTasks: string[];
  completedTasks: Record<string, boolean>;
  sabotage: SabotageState | null;
  trackerTargetId?: string | null;
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({
  open,
  mapDef,
  me,
  players,
  myTasks,
  completedTasks,
  sabotage,
  trackerTargetId,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [floorView, setFloorView] = useState<number>(me.floor || 1);

  useEffect(() => {
    if (open) setFloorView(me.floor || 1);
  }, [open, me.floor]);

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    renderMinimap({
      canvas: canvasRef.current,
      mapDef,
      me,
      players,
      myTasks,
      completedTasks,
      sabotage,
      floorView,
      trackerTargetId,
    });
  }, [open, mapDef, me, players, myTasks, completedTasks, sabotage, floorView, trackerTargetId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/88 backdrop-blur-md flex items-center justify-center p-3 sm:p-5" onClick={onClose}>
      <div
        className="sf-panel w-full max-w-4xl rounded-3xl p-4 sm:p-5 border-2 border-cyan-400/50 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div>
            <h2 className="text-base sm:text-lg font-black text-cyan-300">
              🗺️ 戦術マップ — {mapDef.name}
            </h2>
            <p className="text-[11px] text-amber-300">{mapDef.gimmickSummary}</p>
          </div>
          <div className="flex items-center gap-2">
            {mapDef.hasMultiFloor && (
              <div className="flex rounded-xl overflow-hidden border border-cyan-500/40">
                {[1, 2].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFloorView(f)}
                    className={`px-3 py-1.5 text-xs font-black ${
                      floorView === f ? "bg-cyan-500 text-slate-950" : "bg-slate-900 text-slate-300"
                    }`}
                  >
                    {f}F
                  </button>
                ))}
              </div>
            )}
            <button type="button" onClick={onClose} className="sf-btn px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold">
              ✕ 閉じる
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} width={860} height={540} className="w-full h-auto rounded-2xl border border-slate-700 bg-slate-950 block" />

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
          <div className="flex flex-wrap gap-3">
            <span>⚪ 白枠丸: あなたの現在地</span>
            <span className="text-amber-300">🟡 黄点: 未完了タスク</span>
            <span className="text-rose-400">🔴 赤点: サボタージュ修理</span>
            {trackerTargetId && <span className="text-teal-300">🛰️ GPS追跡対象</span>}
          </div>
          <span className="text-slate-400">部屋数: {mapDef.rooms.length} / 階層: {mapDef.hasMultiFloor ? "2層" : "1層"}</span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. TerminalModal (Vitals & DoorLog)                                        */
/* -------------------------------------------------------------------------- */

interface TerminalModalProps {
  open: boolean;
  mode: "vitals" | "doorlog";
  players: Record<string, PlayerState>;
  doorLogs: DoorLogEntry[];
  batteryPct: number;
  batteryLimitEnabled: boolean;
  onClose: () => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  open,
  mode,
  players,
  doorLogs,
  batteryPct,
  batteryLimitEnabled,
  onClose,
}) => {
  if (!open) return null;
  const crew = Object.values(players).filter((p) => !p.isSpectator);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="sf-panel w-full max-w-2xl rounded-3xl p-5 border-2 border-emerald-400/60 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-black text-emerald-300">
              {mode === "vitals" ? "💓 生体バイタルモニタ" : "🚪 通行センサーログ"}
            </h2>
            {batteryLimitEnabled && (
              <div className="text-[11px] text-amber-300 font-orbitron">
                BATTERY: {Math.round(batteryPct)}%
              </div>
            )}
          </div>
          <button type="button" onClick={onClose} className="sf-btn px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold">
            ✕ 閉じる
          </button>
        </div>

        {mode === "vitals" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {crew.map((p) => {
              const col = PLAYER_COLORS.find((c) => c.id === p.color) || PLAYER_COLORS[0];
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl p-3 border flex items-center justify-between gap-2 ${
                    p.alive ? "bg-slate-900/90 border-emerald-500/40" : "bg-rose-950/45 border-rose-500/50"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/50" style={{ background: col.hex }} />
                    <span className="text-xs font-black text-white truncate">{p.name}</span>
                  </div>
                  <span className={`text-[10px] font-orbitron font-black ${p.alive ? "text-emerald-300" : "text-rose-400"}`}>
                    {p.alive ? "OK" : "DEAD"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {doorLogs.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-8">まだ通路センサーの反応がありません</div>
            ) : (
              doorLogs.slice(0, 30).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.colorHex }} />
                    <span className="font-bold text-white">{entry.playerName}</span>
                    <span className="text-slate-400">が通過 →</span>
                    <span className="font-bold text-cyan-300">{entry.location}</span>
                  </div>
                  <span className="font-orbitron text-[10px] text-slate-400 tabular-nums">{entry.timeText}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. MeetingModal                                                            */
/* -------------------------------------------------------------------------- */

interface MeetingModalProps {
  open: boolean;
  me: PlayerState;
  players: Record<string, PlayerState>;
  meetingTitle: string;
  meetingReason: string;
  meetingTimer: number;
  votedPlayers: Record<string, boolean>;
  myVoteTarget: string | null;
  voteCounts: Record<string, number> | null;
  anonymousVoting: boolean;
  chatHistory: import("../game/types").ChatMessage[];
  onCastVote: (targetId: string) => void;
  onSendChat: (text: string, stampId?: string) => void;
  onClearKeys: () => void;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  open,
  me,
  players,
  meetingTitle,
  meetingReason,
  meetingTimer,
  votedPlayers,
  myVoteTarget,
  voteCounts,
  anonymousVoting,
  chatHistory,
  onCastVote,
  onSendChat,
  onClearKeys,
}) => {
  if (!open) return null;

  const participants = Object.values(players).filter((p) => !p.isSpectator);
  const canVote = me.alive && !me.isSpectator && !myVoteTarget && !voteCounts;
  const skipVotes = voteCounts ? voteCounts["skip"] || 0 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5">
      <div className="sf-panel w-full max-w-6xl h-[92vh] max-h-[820px] rounded-3xl p-4 sm:p-5 border-2 border-amber-400/60 flex flex-col gap-3 overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 shrink-0">
          <div>
            <div className="text-base sm:text-xl font-black text-amber-300 flex items-center gap-2">
              <span>🚨 {meetingTitle}</span>
              {anonymousVoting && (
                <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-600 text-[10px] text-slate-300">
                  🕶️ 匿名投票
                </span>
              )}
              {me.role === "mayor" && me.alive && (
                <span className="px-2 py-0.5 rounded-lg bg-purple-950/80 border border-purple-400/50 text-[10px] text-purple-200">
                  👑 あなたの票は2票分！
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{meetingReason}</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-amber-400/50 text-center">
            <div className="text-[9px] font-orbitron text-slate-400">VOTING TIME</div>
            <div className="font-orbitron text-lg font-black text-amber-300 tabular-nums">
              {Math.max(0, Math.ceil(meetingTimer))}s
            </div>
          </div>
        </div>

        {/* Body: Voting List + Chat */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-7 flex flex-col gap-2.5 min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1 flex-1 content-start">
              {participants.map((p) => {
                const c = PLAYER_COLORS.find((col) => col.id === p.color) || PLAYER_COLORS[0];
                const np = NAMEPLATES.find((n) => n.id === (p.nameplate || "none")) || NAMEPLATES[0];
                const hasVoted = !!votedPlayers[p.id];
                const isSelected = myVoteTarget === p.id;
                const isExecTarget = me.role === "executioner" && me.executionerTargetId === p.id;
                const count = voteCounts ? voteCounts[p.id] || 0 : null;

                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={!canVote || !p.alive}
                    onClick={() => canVote && p.alive && onCastVote(p.id)}
                    style={
                      p.alive && np.id !== "none"
                        ? {
                            background: np.bgGradient,
                            borderColor: isSelected ? "#fbbf24" : np.borderColor,
                          }
                        : undefined
                    }
                    className={`sf-btn rounded-2xl p-3 border-2 text-left flex items-center justify-between gap-2 transition ${
                      !p.alive
                        ? "bg-slate-950/75 border-slate-800/80 opacity-45 cursor-not-allowed"
                        : isSelected
                          ? "bg-amber-950/80 border-amber-400 ring-2 ring-amber-400"
                          : canVote
                            ? "bg-slate-900/95 border-slate-700 hover:border-cyan-400"
                            : "bg-slate-900/85 border-slate-800 cursor-default"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white/70 shrink-0 flex items-center justify-center text-xs font-black"
                        style={{ background: c.hex }}
                      >
                        {!p.alive ? "💀" : ""}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-black text-white truncate flex items-center gap-1">
                          {np.id !== "none" && <span className="text-xs">{np.accentEmoji}</span>}
                          <span>{p.name}</span>
                          {p.id === me.id && <span className="text-[10px] text-cyan-300">(あなた)</span>}
                          {isExecTarget && <span title="処刑ターゲット">🎯</span>}
                        </div>
                        <div className="text-[10px] text-slate-300">
                          {!p.alive ? "死亡" : hasVoted ? "✓ 投票完了" : "議論中..."}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {count !== null && count > 0 && (
                        <span className="px-2.5 py-1 rounded-xl bg-rose-600 text-white font-orbitron font-black text-xs tabular-nums">
                          {count} 票
                        </span>
                      )}
                      {isSelected && count === null && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px]">
                          投票済
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 shrink-0">
              <button
                type="button"
                disabled={!canVote}
                onClick={() => canVote && onCastVote("skip")}
                className={`sf-btn px-5 py-2.5 rounded-2xl border font-black text-xs flex items-center gap-2 ${
                  myVoteTarget === "skip"
                    ? "bg-cyan-500 text-slate-950 border-white"
                    : "bg-slate-900 border-slate-600 text-slate-200 hover:border-cyan-400 disabled:opacity-45"
                }`}
              >
                <span>⏭️ 投票をスキップ</span>
                {voteCounts && skipVotes > 0 && (
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-cyan-300 font-orbitron">
                    {skipVotes} 票
                  </span>
                )}
              </button>
              <div className="text-[11px] text-slate-400">
                {!me.alive || me.isSpectator
                  ? "👻 霊界・観戦モードのため投票できません"
                  : myVoteTarget
                    ? "✅ 投票が完了しました。全員の投票を待っています..."
                    : "追放したいプレイヤーをクリック（またはスキップ）"}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 sf-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col min-h-[240px]">
            <ChatPanel
              messages={chatHistory}
              myAlive={me.alive}
              isSpectator={!!me.isSpectator}
              onSendChat={onSendChat}
              onInputFocus={onClearKeys}
              title="💬 緊急会議チャット"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. RolesGuideModal                                                         */
/* -------------------------------------------------------------------------- */

export const RolesGuideModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [teamFilter, setTeamFilter] = useState<"all" | "crew" | "impostor" | "neutral">("all");
  if (!open) return null;

  const list = Object.values(ROLES).filter((r) => teamFilter === "all" || r.team === teamFilter);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5" onClick={onClose}>
      <div
        className="sf-panel w-full max-w-5xl max-h-[90vh] rounded-3xl p-4 sm:p-6 border-2 border-purple-400/50 flex flex-col gap-3 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-purple-300">📖 全21役職ガイド＆立ち回り</h2>
            <p className="text-[11px] text-slate-400">クルー陣営・インポスター陣営・第三陣営の全能力と攻略のコツ</p>
          </div>
          <button type="button" onClick={onClose} className="sf-btn px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-bold">
            ✕ 閉じる
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 shrink-0">
          {[
            ["all", "すべて (21)"],
            ["crew", "🛡️ クルー陣営 (11)"],
            ["impostor", "🔪 インポスター陣営 (5)"],
            ["neutral", "🎭 第三陣営 (5)"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTeamFilter(id as typeof teamFilter)}
              className={`sf-btn px-3 py-1.5 rounded-xl border text-xs font-black ${
                teamFilter === id
                  ? "bg-purple-500 text-white border-purple-200"
                  : "bg-slate-900 text-slate-300 border-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 content-start">
          {list.map((r) => (
            <div key={r.id} className="rounded-2xl bg-slate-900/95 border border-slate-800 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="font-black text-sm" style={{ color: r.color }}>
                  {r.jp} <span className="text-[10px] text-slate-400 font-normal">({r.name})</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-slate-300 shrink-0">
                  {r.team === "crew" ? "クルー" : r.team === "impostor" ? "人狼" : "第三"}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{r.desc}</p>
              <p className="text-[10px] text-slate-400">⚖️ {r.balance}</p>
              <div className="rounded-xl bg-amber-950/40 border border-amber-400/30 p-2 text-[11px] text-amber-200 font-bold">
                💡 {r.tip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. KeybindsModal                                                           */
/* -------------------------------------------------------------------------- */

interface KeybindsModalProps {
  open: boolean;
  keybinds: Keybinds;
  onChangeKeybinds: (next: Keybinds) => void;
  onClose: () => void;
}

const KEY_LABELS: Record<keyof Keybinds, string> = {
  moveUp: "上へ移動",
  moveDown: "下へ移動",
  moveLeft: "左へ移動",
  moveRight: "右へ移動",
  use: "使用 / タスク / 修理",
  report: "死体通報",
  kill: "キル / ターゲット攻撃",
  vent: "ベント出入り",
  sabotage: "サボタージュ",
  ability: "役職特殊能力",
  map: "全体マップ表示",
};

export const KeybindsModal: React.FC<KeybindsModalProps> = ({
  open,
  keybinds,
  onChangeKeybinds,
  onClose,
}) => {
  const [capturing, setCapturing] = useState<keyof Keybinds | null>(null);

  useEffect(() => {
    if (!open || !capturing) return;
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.code === "Escape") {
        setCapturing(null);
        return;
      }
      onChangeKeybinds({ ...keybinds, [capturing]: e.code });
      setCapturing(null);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, capturing, keybinds, onChangeKeybinds]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/88 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="sf-panel w-full max-w-xl rounded-3xl p-5 border-2 border-cyan-400/50 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-black text-cyan-300">⌨️ キーバインド設定</h2>
            <p className="text-[11px] text-slate-400">変更したい項目のボタンをクリックし、割り当てるキーを押してください</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChangeKeybinds({ ...DEFAULT_KEYBINDS })}
              className="sf-btn px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold"
            >
              初期値へ戻す
            </button>
            <button type="button" onClick={onClose} className="sf-btn px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black">
              完了
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
          {(Object.keys(KEY_LABELS) as Array<keyof Keybinds>).map((action) => {
            const active = capturing === action;
            return (
              <div
                key={action}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
              >
                <span className="font-bold text-slate-200">{KEY_LABELS[action]}</span>
                <button
                  type="button"
                  onClick={() => setCapturing(active ? null : action)}
                  className={`sf-btn min-w-[78px] px-3 py-1.5 rounded-lg font-orbitron font-black text-xs border ${
                    active
                      ? "bg-amber-400 text-slate-950 border-white animate-pulse"
                      : "bg-slate-950 text-cyan-300 border-slate-700 hover:border-cyan-400"
                  }`}
                >
                  {active ? "PRESS KEY" : formatKeyLabel(keybinds[action])}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 7. SettingsModal (5 Tabs: HUD, Audio, Network, 変更記録, エラーログ)        */
/* -------------------------------------------------------------------------- */

interface SettingsModalProps {
  open: boolean;
  hudSettings: HudSettings;
  onChangeHudSettings: (next: HudSettings) => void;
  bgmVolume: number;
  sfxVolume: number;
  bgmMuted: boolean;
  sfxMuted: boolean;
  onChangeAudio: (v: { bgmVolume: number; sfxVolume: number; bgmMuted: boolean; sfxMuted: boolean }) => void;
  networkModeLabel: string;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  hudSettings,
  onChangeHudSettings,
  bgmVolume,
  sfxVolume,
  bgmMuted,
  sfxMuted,
  onChangeAudio,
  networkModeLabel,
  onClose,
}) => {
  const [tab, setTab] = useState<"hud" | "audio" | "network" | "changelog" | "errors">("hud");
  const [changelogCat, setChangelogCat] = useState<"ALL" | ChangelogEntry["category"]>("ALL");
  const [changelogQuery, setChangelogQuery] = useState("");
  const [errorLogs, setErrorLogs] = useState<ErrorLogEntry[]>(() => ErrorLogger.getLogs());
  const [errorSeverityFilter, setErrorSeverityFilter] = useState<"ALL" | "ERROR" | "WARN" | "NETWORK">("ALL");
  const [copiedLogs, setCopiedLogs] = useState(false);

  const [fbConfigJson, setFbConfigJson] = useState(() => JSON.stringify(FB.getStoredConfig(), null, 2));
  const [fbSaveMsg, setFbSaveMsg] = useState<string | null>(null);
  const [copiedFbUrl, setCopiedFbUrl] = useState(false);

  useEffect(() => {
    return ErrorLogger.subscribe(setErrorLogs);
  }, []);

  const filteredChangelog = useMemo(
    () => filterChangelog(changelogCat, changelogQuery),
    [changelogCat, changelogQuery]
  );

  const filteredErrors = useMemo(
    () => errorLogs.filter((l) => errorSeverityFilter === "ALL" || l.severity === errorSeverityFilter),
    [errorLogs, errorSeverityFilter]
  );

  if (!open) return null;

  const handleSaveFbConfig = () => {
    try {
      const parsed = JSON.parse(fbConfigJson);
      if (!parsed || !parsed.databaseURL) {
        setFbSaveMsg("❌ databaseURL が含まれていません。");
        return;
      }
      FB.saveConfig(parsed);
      setFbSaveMsg("✅ カスタム Firebase 設定を保存しました。次回接続から適用されます。");
    } catch (e) {
      setFbSaveMsg(`❌ JSON パースエラー: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleResetFbConfig = () => {
    FB.saveConfig(null);
    setFbConfigJson(JSON.stringify(FB.getStoredConfig(), null, 2));
    setFbSaveMsg("🔄 標準 Firebase Realtime Database 設定にリセットしました。");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5" onClick={onClose}>
      <div
        className="sf-panel w-full max-w-4xl h-[88vh] max-h-[780px] rounded-3xl p-4 sm:p-6 border-2 border-cyan-400/50 flex flex-col gap-3 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-cyan-300">⚙️ システム設定・診断ログ</h2>
            <p className="text-[11px] text-slate-400">表示・音声・通信環境・不変変更記録・永続エラーログ</p>
          </div>
          <button type="button" onClick={onClose} className="sf-btn px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-bold">
            ✕ 閉じる
          </button>
        </div>

        {/* 5 Tabs */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {[
            ["hud", "🧭 HUD・ナビ"],
            ["audio", "🔊 音声・BGM"],
            ["network", "🌐 通信・Firebase"],
            ["changelog", `📜 変更記録 (${CHANGELOG_REGISTRY.length})`],
            ["errors", `🩺 エラーログ (${errorLogs.length})`],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id as typeof tab)}
              className={`sf-btn px-3 py-1.5 rounded-xl border text-xs font-black whitespace-nowrap ${
                tab === id
                  ? "bg-cyan-500 text-slate-950 border-cyan-200"
                  : "bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-400/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3 text-xs">
          {tab === "hud" && (
            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-black text-white text-sm">🧭 タスク / サボタージュ方向ナビ矢印</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">画面周囲に未完了タスクや修理場所の方向矢印を表示します。</div>
                </div>
                <input
                  type="checkbox"
                  checked={hudSettings.showNavArrows}
                  onChange={(e) => onChangeHudSettings({ ...hudSettings, showNavArrows: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-black text-white text-sm">📋 左上タスク・目標リスト表示</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">試合中のタスク進行リストと固有ギミック説明パネルを表示します。</div>
                </div>
                <input
                  type="checkbox"
                  checked={hudSettings.showTaskList}
                  onChange={(e) => onChangeHudSettings({ ...hudSettings, showTaskList: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400"
                />
              </label>

              <div className="rounded-2xl bg-slate-900/75 border border-slate-800 p-4 space-y-2">
                <div className="text-xs font-black text-emerald-300">🛡️ 有効化済み品質・安全ガード ({GUARD_REGISTRY.length}項目)</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {GUARD_REGISTRY.map((g) => (
                    <div key={g.id} className="rounded-xl bg-slate-950/80 border border-slate-800 px-2.5 py-2">
                      <div className="font-bold text-cyan-300">{g.label}</div>
                      <div className="text-slate-400 text-[10px]">{g.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "audio" && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-white">🎵 BGM 音量 ({Math.round(bgmVolume * 100)}%)</span>
                  <button
                    type="button"
                    onClick={() => onChangeAudio({ bgmVolume, sfxVolume, bgmMuted: !bgmMuted, sfxMuted })}
                    className={`sf-btn px-3 py-1 rounded-xl text-xs font-black border ${
                      bgmMuted ? "bg-rose-950 border-rose-500 text-rose-200" : "bg-emerald-950 border-emerald-500 text-emerald-200"
                    }`}
                  >
                    {bgmMuted ? "🔇 ミュート中" : "🔊 ON"}
                  </button>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(bgmVolume * 100)}
                  onChange={(e) =>
                    onChangeAudio({ bgmVolume: Number(e.target.value) / 100, sfxVolume, bgmMuted, sfxMuted })
                  }
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-white">🔔 効果音 (SFX) 音量 ({Math.round(sfxVolume * 100)}%)</span>
                  <button
                    type="button"
                    onClick={() => onChangeAudio({ bgmVolume, sfxVolume, bgmMuted, sfxMuted: !sfxMuted })}
                    className={`sf-btn px-3 py-1 rounded-xl text-xs font-black border ${
                      sfxMuted ? "bg-rose-950 border-rose-500 text-rose-200" : "bg-emerald-950 border-emerald-500 text-emerald-200"
                    }`}
                  >
                    {sfxMuted ? "🔇 ミュート中" : "🔊 ON"}
                  </button>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(sfxVolume * 100)}
                  onChange={(e) =>
                    onChangeAudio({ bgmVolume, sfxVolume: Number(e.target.value) / 100, bgmMuted, sfxMuted })
                  }
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>
          )}

          {tab === "network" && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
                <div className="font-black text-cyan-300 text-sm">📡 現在の通信モード</div>
                <div className="text-slate-200 font-bold">{networkModeLabel}</div>
                <p className="text-[11px] text-slate-400">
                  WebRTC (PeerJS + Google/Cloudflare STUN多重化) と Firebase Realtime Database リレーのハイブリッド通信により、異なる回線間でも接続できます。
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const base = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}` : "";
                      const full = FB.buildShareUrlWithFb(base);
                      void navigator.clipboard?.writeText(full).catch(() => {});
                      setCopiedFbUrl(true);
                      setTimeout(() => setCopiedFbUrl(false), 2000);
                    }}
                    className="sf-btn px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/60 text-cyan-200 font-black text-xs"
                  >
                    {copiedFbUrl ? "✓ 共有URLをコピーしました" : "🔗 ?fb= 共有用URLをコピー"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
                <div className="font-black text-white text-xs">🔧 カスタム Firebase RTDB 設定 (上級者向け)</div>
                <textarea
                  rows={6}
                  value={fbConfigJson}
                  onChange={(e) => setFbConfigJson(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 font-mono text-[11px] text-emerald-200 focus:border-cyan-400 focus:outline-none"
                />
                {fbSaveMsg && <div className="text-[11px] font-bold text-amber-300">{fbSaveMsg}</div>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveFbConfig}
                    className="sf-btn px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
                  >
                    💾 保存して適用
                  </button>
                  <button
                    type="button"
                    onClick={handleResetFbConfig}
                    className="sf-btn px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs"
                  >
                    標準設定に戻す
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "changelog" && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1">
                  {(["ALL", "FEATURE", "BUGFIX", "BALANCE", "NETWORK", "SECURITY"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setChangelogCat(cat)}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-black ${
                        changelogCat === cat
                          ? "bg-amber-400 text-slate-950 border-white"
                          : "bg-slate-900 text-slate-300 border-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={changelogQuery}
                  onChange={(e) => setChangelogQuery(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="変更記録を検索..."
                  className="w-48 rounded-xl bg-slate-900 border border-slate-700 px-3 py-1 text-xs text-white"
                />
              </div>

              <div className="space-y-2.5">
                {filteredChangelog.map((entry) => (
                  <div key={entry.version + entry.title} className="rounded-2xl bg-slate-900/95 border border-slate-800 p-3.5 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 font-orbitron text-[10px] font-black text-cyan-300">
                          {entry.version}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-black text-amber-300">
                          {entry.category}
                        </span>
                        {entry.guardId && (
                          <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 font-mono text-[9px] text-emerald-300">
                            {entry.guardId}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{entry.date}</span>
                    </div>
                    <div className="font-black text-white text-sm">{entry.title}</div>
                    <p className="text-slate-300 text-xs">{entry.summary}</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-400">
                      {entry.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "errors" && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1">
                  {(["ALL", "ERROR", "WARN", "NETWORK"] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setErrorSeverityFilter(sev)}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-black ${
                        errorSeverityFilter === sev
                          ? "bg-rose-500 text-white border-rose-200"
                          : "bg-slate-900 text-slate-300 border-slate-700"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard?.writeText(ErrorLogger.exportLogsText()).catch(() => {});
                      setCopiedLogs(true);
                      setTimeout(() => setCopiedLogs(false), 1800);
                    }}
                    className="sf-btn px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 text-xs font-black"
                  >
                    {copiedLogs ? "✓ コピー済" : "📋 全ログをコピー"}
                  </button>
                  <button
                    type="button"
                    onClick={() => ErrorLogger.clearLogs()}
                    className="sf-btn px-3 py-1.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs font-bold"
                  >
                    🗑️ 履歴消去
                  </button>
                </div>
              </div>

              {filteredErrors.length === 0 ? (
                <div className="rounded-2xl bg-emerald-950/25 border border-emerald-500/30 p-8 text-center space-y-1">
                  <div className="text-2xl">✨</div>
                  <div className="font-black text-emerald-300">現在記録されているエラーはありません</div>
                  <div className="text-[11px] text-slate-400">
                    ランタイム異常・P2P切断・描画例外が発生すると自動保存されます（最大200件）
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredErrors.map((log) => (
                    <div key={log.id} className="rounded-xl bg-slate-900/95 border border-slate-800 p-3 space-y-1">
                      <div className="flex items-center justify-between gap-2 text-[10px]">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded font-black ${
                              log.severity === "ERROR"
                                ? "bg-rose-600 text-white"
                                : log.severity === "NETWORK"
                                  ? "bg-amber-500 text-slate-950"
                                  : "bg-slate-700 text-amber-200"
                            }`}
                          >
                            {log.severity}
                          </span>
                          <span className="font-mono text-cyan-300">{log.source}</span>
                        </div>
                        <span className="font-mono text-slate-500">{log.timestamp}</span>
                      </div>
                      <div className="text-xs font-bold text-white break-words">{log.message}</div>
                      {log.context && <div className="text-[10px] font-mono text-slate-400 break-words">{log.context}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 8. AchievementsModal                                                       */
/* -------------------------------------------------------------------------- */

interface AchievementsModalProps {
  open: boolean;
  progression: ProgressionData;
  onToggleSandbox: () => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  open,
  progression,
  onToggleSandbox,
  onClose,
}) => {
  if (!open) return null;
  const unlockedCount = progression.unlockedAchievements.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5" onClick={onClose}>
      <div
        className="sf-panel w-full max-w-4xl max-h-[90vh] rounded-3xl p-4 sm:p-6 border-2 border-amber-400/50 flex flex-col gap-3 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300">
              🏆 実績＆戦績 ({unlockedCount} / {ACHIEVEMENTS.length})
            </h2>
            <p className="text-[11px] text-slate-400">実績を達成すると限定カラー・ハット・ペット・キル演出が解放されます</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSandbox}
              className={`sf-btn px-3 py-1.5 rounded-xl border text-xs font-black ${
                progression.sandboxUnlockAll
                  ? "bg-emerald-950 border-emerald-400 text-emerald-200"
                  : "bg-slate-900 border-slate-700 text-slate-300"
              }`}
            >
              {progression.sandboxUnlockAll ? "🔓 外見試着全解放 ON" : "🔒 外見試着全解放 OFF"}
            </button>
            <button type="button" onClick={onClose} className="sf-btn px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold">
              ✕ 閉じる
            </button>
          </div>
        </div>

        {/* Career Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 shrink-0 text-center">
          {[
            ["試合数", progression.matchesPlayed],
            ["クルー勝利", progression.crewWins],
            ["人狼勝利", progression.impostorWins],
            ["第三勝利", progression.neutralWins],
            ["累計タスク", progression.totalTasks],
            ["累計キル", progression.totalKills],
          ].map(([label, val]) => (
            <div key={String(label)} className="rounded-xl bg-slate-900/90 border border-slate-800 p-2">
              <div className="text-[10px] text-slate-400">{label}</div>
              <div className="font-orbitron font-black text-sm text-cyan-300 tabular-nums">{val}</div>
            </div>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 content-start">
          {ACHIEVEMENTS.map((ach) => {
            const done = progression.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-2xl p-3 border flex items-start gap-3 ${
                  done ? "bg-amber-950/35 border-amber-400/60" : "bg-slate-900/80 border-slate-800 opacity-65"
                }`}
              >
                <div className="text-2xl shrink-0">{ach.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-xs sm:text-sm text-white truncate">{ach.title}</span>
                    <span className={`text-[10px] font-black ${done ? "text-emerald-300" : "text-slate-500"}`}>
                      {done ? "✓ 達成済" : "未達成"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">{ach.desc}</p>
                  {ach.rewardText && (
                    <p className="text-[10px] text-amber-300 mt-1">🎁 {ach.rewardText}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
