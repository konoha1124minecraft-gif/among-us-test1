import React, { useRef, useState } from "react";
import { ROLES, formatKeyLabel, hasTasksRole, isImpostorRole } from "../game/constants";
import type { UseActionState } from "../game/engine";
import { getTaskById } from "../game/tasks150";
import type {
  ChatMessage,
  Keybinds,
  MapDef,
  PlayerState,
  SabotageState,
  TutorialStepDef,
} from "../game/types";
import { ChatPanel } from "./ChatPanel";

interface ActionBtnState {
  label: string;
  enabled: boolean;
}

interface GameHudProps {
  gameCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  me: PlayerState;
  players: Record<string, PlayerState>;
  mapDef: MapDef;
  roomName: string;
  visionRadius: number;
  taskCompletedCount: number;
  taskTotalCount: number;
  sabotage: SabotageState | null;
  myTasks: string[];
  completedTasks: Record<string, boolean>;
  gimmickStatusText: string | null;
  showTaskList: boolean;
  cameraWatchTimer: number;
  cameraFeedLabel: string;
  cameraFeedCount: number;
  cameraFeedIndex: number;
  cameraBatteryPct: number;
  cameraBatteryLimitEnabled: boolean;
  meteorActive: boolean;
  meteorTimer: number;
  currentVentIndex: number;
  ventStayTimer: number | null;
  pingMs: number | null;
  tutorialStepDef?: TutorialStepDef | null;
  onExitTutorial?: () => void;
  onLeaveMatch?: () => void;
  onSwitchCameraFeed: (delta: number) => void;
  onSelectCameraFeed?: (idx: number) => void;
  onCloseCamera: () => void;
  onJumpToVent: (ventIdx: number) => void;
  onExitVent: () => void;
  onOpenMap: () => void;
  onOpenSettings: () => void;
  onOpenKeybinds: () => void;
  onOpenRolesGuide: () => void;
  useActionState: UseActionState;
  reportActionState: ActionBtnState;
  killActionState: ActionBtnState;
  ventActionState: ActionBtnState;
  sabotageActionState: ActionBtnState;
  abilityActionState: ActionBtnState;
  ghostAssistState: ActionBtnState;
  ghostPrankState: ActionBtnState;
  onUse: () => void;
  onReport: () => void;
  onKill: () => void;
  onVent: () => void;
  onSabotage: () => void;
  onAbility: () => void;
  onGhostAssist: () => void;
  onGhostPrank: () => void;
  onToggleGhostFloor?: () => void;
  onJoystickChange: (vx: number, vy: number) => void;
  keybinds: Keybinds;
  inGameChatEnabled: boolean;
  chatHistory: ChatMessage[];
  onSendChat: (text: string, stampId?: string) => void;
  onClearKeys: () => void;
  spectateTargetId: string | null;
  onCycleSpectateTarget: () => void;
  unreadChatCount: number;
  chatOpen: boolean;
  onToggleChat: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  gameCanvasRef,
  me,
  players,
  mapDef,
  roomName,
  visionRadius,
  taskCompletedCount,
  taskTotalCount,
  sabotage,
  myTasks,
  completedTasks,
  gimmickStatusText,
  showTaskList,
  cameraWatchTimer,
  cameraFeedLabel,
  cameraFeedCount,
  cameraFeedIndex,
  cameraBatteryPct,
  cameraBatteryLimitEnabled,
  meteorActive,
  meteorTimer,
  currentVentIndex,
  ventStayTimer,
  pingMs,
  tutorialStepDef,
  onExitTutorial,
  onLeaveMatch,
  onSwitchCameraFeed,
  onSelectCameraFeed,
  onCloseCamera,
  onJumpToVent,
  onExitVent,
  onOpenMap,
  onOpenSettings,
  onOpenKeybinds,
  onOpenRolesGuide,
  useActionState,
  reportActionState,
  killActionState,
  ventActionState,
  sabotageActionState,
  abilityActionState,
  ghostAssistState,
  ghostPrankState,
  onUse,
  onReport,
  onKill,
  onVent,
  onSabotage,
  onAbility,
  onGhostAssist,
  onGhostPrank,
  onToggleGhostFloor,
  onJoystickChange,
  keybinds,
  inGameChatEnabled,
  chatHistory,
  onSendChat,
  onClearKeys,
  spectateTargetId,
  onCycleSpectateTarget,
  unreadChatCount,
  chatOpen,
  onToggleChat,
}) => {
  const [joyKnob, setJoyKnob] = useState({ x: 0, y: 0 });
  const joyRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const roleDef = ROLES[me.role] || ROLES.crewmate;
  const pct = Math.min(100, Math.round((taskCompletedCount / Math.max(1, taskTotalCount)) * 100));
  const filledSegs = Math.min(10, Math.round((pct / 100) * 10));
  const isCrew = hasTasksRole(me.role);
  const spectated = spectateTargetId ? players[spectateTargetId] : null;
  const currentVent = currentVentIndex >= 0 ? mapDef.vents[currentVentIndex] : null;

  const updateJoystick = (clientX: number, clientY: number) => {
    const el = joyRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxR = rect.width * 0.38;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const len = Math.hypot(dx, dy);
    if (len < 4) {
      setJoyKnob({ x: 0, y: 0 });
      onJoystickChange(0, 0);
      return;
    }
    const clampR = Math.min(maxR, len);
    const ux = dx / len;
    const uy = dy / len;
    setJoyKnob({ x: ux * clampR, y: uy * clampR });
    onJoystickChange(ux, uy);
  };

  const resetJoystick = () => {
    draggingRef.current = false;
    setJoyKnob({ x: 0, y: 0 });
    onJoystickChange(0, 0);
  };

  return (
    <div className="flex-1 flex flex-col w-full h-screen min-h-0 overflow-hidden bg-slate-950">
      {/* Top Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-slate-800/90 bg-slate-950/90 z-20 shrink-0">
        <div className="hud-plate rounded-2xl px-3.5 py-2 flex items-center gap-3.5">
          <div>
            <div className="text-[10px] font-orbitron uppercase tracking-wider text-slate-400">
              {me.isSpectator ? "SPECTATOR" : tutorialStepDef ? "TUTORIAL" : "ROLE"}
            </div>
            <div
              className="text-sm sm:text-base font-black leading-tight"
              style={{ color: me.isSpectator ? "#c084fc" : roleDef.color }}
            >
              {me.isSpectator ? "👁️ 観戦モード" : roleDef.jp}
            </div>
          </div>
          <div className="h-7 w-px bg-slate-700/80" />
          <div className="min-w-[130px] sm:min-w-[160px]">
            <div className="flex items-center justify-between text-[10px] font-orbitron font-bold mb-1">
              <span className="text-emerald-300 tracking-wider">TOTAL TASKS</span>
              <span className="text-white tabular-nums">{pct}%</span>
            </div>
            <div className="grid grid-cols-10 gap-1 p-1 rounded-lg bg-slate-950 border border-slate-700/90">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-[3px] transition-all duration-300 ${
                    i < filledSegs
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                      : "bg-slate-800/90"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {sabotage && (
            <div className="alarm-blink px-3.5 py-1.5 rounded-2xl bg-rose-950/95 border-2 border-rose-500 text-rose-100 font-black text-xs sm:text-sm tabular-nums">
              {sabotage.type === "lights" && `⚡ 停電発生！ ${mapDef.sabotageFix.lights.label}で復旧`}
              {sabotage.type === "reactor" && `☢️ 炉心メルトダウン！ 残り ${Math.max(0, Math.ceil(sabotage.timer))} 秒 (${mapDef.sabotageFix.reactor.label})`}
              {sabotage.type === "gas" && `☣️ ガス漏洩！ 残り ${Math.max(0, Math.ceil(sabotage.timer))} 秒 (${mapDef.sabotageFix.gas.label})`}
              {sabotage.type === "doors" && `🚪 全区画ドア封鎖中 (${Math.max(0, Math.ceil(sabotage.timer))}s)`}
            </div>
          )}
          {meteorActive && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-950/90 border border-amber-400 text-amber-200 font-black text-xs tabular-nums">
              ☄️ 隕石群接近中 ({Math.max(0, Math.ceil(meteorTimer))}s)
            </div>
          )}
        </div>

        <div className="hud-plate rounded-2xl px-3 py-1.5 flex items-center gap-2 text-xs">
          <div className="hidden sm:block text-right pr-1">
            <div className="text-[10px] font-bold text-slate-400">
              {mapDef.name}
              {mapDef.hasMultiFloor ? ` (${me.floor || 1}F)` : ""} · 視界 {Math.round(visionRadius)}px
            </div>
            <div className="font-bold text-cyan-300">{roomName}</div>
          </div>
          {pingMs !== null && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-700 font-orbitron text-[10px] text-emerald-300 tabular-nums">
              {pingMs}ms
            </span>
          )}
          {gimmickStatusText && (
            <span className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-200 font-bold text-[11px]">
              {gimmickStatusText}
            </span>
          )}
          {cameraBatteryLimitEnabled && (
            <span className="px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-700 font-orbitron text-[10px] text-slate-200 tabular-nums">
              🔋 {Math.round(cameraBatteryPct)}%
            </span>
          )}
          <button
            type="button"
            onClick={onOpenMap}
            className="sf-btn px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/60 text-cyan-200 font-black whitespace-nowrap"
          >
            🗺️ [{formatKeyLabel(keybinds.map)}]
          </button>
          {inGameChatEnabled && (
            <button
              type="button"
              onClick={onToggleChat}
              className={`sf-btn relative px-2.5 py-1.5 rounded-xl border font-black ${
                chatOpen
                  ? "bg-cyan-500 text-slate-950 border-cyan-200"
                  : "bg-slate-800/90 hover:bg-slate-700 border-slate-600 text-slate-200"
              }`}
            >
              💬
              {unreadChatCount > 0 && !chatOpen && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center px-1">
                  {unreadChatCount}
                </span>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={onOpenRolesGuide}
            title="役職一覧"
            className="sf-btn px-2 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-purple-200 font-bold"
          >
            📖
          </button>
          <button
            type="button"
            onClick={onOpenKeybinds}
            title="キー設定"
            className="sf-btn px-2 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold"
          >
            ⌨️
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            title="設定"
            className="sf-btn px-2 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold"
          >
            ⚙️
          </button>
          {onLeaveMatch && !tutorialStepDef && (
            <button
              type="button"
              onClick={onLeaveMatch}
              title="途中退出（進行中の豆報酬は没収されます）"
              className="sf-btn px-2.5 py-1.5 rounded-xl bg-rose-950/75 hover:bg-rose-900 border border-rose-500/60 text-rose-200 text-[11px] font-black whitespace-nowrap"
            >
              退出
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-slate-950">
        <canvas ref={gameCanvasRef} className="w-full h-full block" />

        {/* Tutorial Mission Banner */}
        {tutorialStepDef && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-xl hud-plate rounded-2xl p-3 border-2 border-emerald-400/75 shadow-2xl space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-orbitron text-xs font-black text-emerald-300">
                🎓 {tutorialStepDef.title}
              </span>
              {onExitTutorial && (
                <button
                  type="button"
                  onClick={onExitTutorial}
                  className="sf-btn px-2.5 py-0.5 rounded-lg bg-slate-800 text-[11px] font-bold text-slate-200"
                >
                  チュートリアル終了
                </button>
              )}
            </div>
            <div className="text-xs font-bold text-white">{tutorialStepDef.objective}</div>
            <div className="text-[11px] text-amber-300">💡 {tutorialStepDef.hint}</div>
          </div>
        )}

        {/* Objectives Plate */}
        {showTaskList && !tutorialStepDef && (
          <div className="absolute top-3 left-3 z-20 w-56 sm:w-64 hud-plate rounded-2xl p-3 space-y-2 pointer-events-none">
            <div className="text-[11px] font-orbitron font-bold text-cyan-300 flex justify-between items-center border-b border-slate-700/70 pb-1">
              <span>OBJECTIVES</span>
              <span className={me.isSpectator || !me.alive ? "text-purple-300" : "text-emerald-300"}>
                {me.isSpectator ? "SPECTATING" : me.alive ? "ALIVE" : "GHOST"}
              </span>
            </div>

            {me.isSpectator ? (
              <div className="text-[11px] text-purple-200 space-y-1.5 pointer-events-auto">
                <div>
                  視点対象: <span className="font-black text-white">{spectated ? spectated.name : "フリー視点"}</span>
                </div>
                <button
                  type="button"
                  onClick={onCycleSpectateTarget}
                  className="sf-btn w-full py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-500 text-white text-[11px] font-bold"
                >
                  👁️ 観戦ターゲット切替
                </button>
              </div>
            ) : (
              <ul className="space-y-1 text-xs max-h-40 overflow-y-auto">
                {isCrew ? (
                  myTasks.map((tid) => {
                    const done = !!completedTasks[tid];
                    const tDef = getTaskById(tid);
                    return (
                      <li
                        key={tid}
                        className={`flex items-center gap-1.5 ${
                          done ? "text-emerald-400 line-through opacity-75" : "text-slate-100 font-medium"
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-[4px] border flex items-center justify-center shrink-0 text-[9px] font-black ${
                            done
                              ? "bg-emerald-500/30 border-emerald-400 text-emerald-200"
                              : "bg-slate-900/90 border-slate-500"
                          }`}
                        >
                          {done ? "✓" : ""}
                        </span>
                        <span className="truncate">{tDef.name}</span>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-rose-200 leading-relaxed text-[11px]">{roleDef.desc}</li>
                )}
              </ul>
            )}

            <div className="pt-1 border-t border-slate-800/90 text-[10px] text-amber-300/95 leading-snug">
              {mapDef.gimmickSummary}
            </div>
            {!me.alive && !me.isSpectator && (
              <div className="pt-1 border-t border-purple-500/40 text-[10px] text-purple-200 font-bold leading-snug">
                {isImpostorRole(me.role)
                  ? "👻 ゴースト人狼：壁を通過し「妨害・ドア封鎖」で生存味方を援護可能"
                  : "👻 ゴースト状態：壁を通過して残りタスク続行・味方アシストが可能"}
              </div>
            )}
          </div>
        )}

        {/* Camera Watcher Overlay */}
        {cameraWatchTimer > 0 && (
          <div className="absolute top-3 right-3 z-20 hud-plate rounded-2xl p-3 border border-emerald-400/70 space-y-2 w-72">
            <div className="flex items-center justify-between gap-2 text-xs font-black text-emerald-300">
              <span className="truncate">📹 {cameraFeedLabel}</span>
              <span className="tabular-nums shrink-0">{cameraFeedIndex + 1}/{cameraFeedCount}</span>
            </div>
            <div className="text-[10px] text-slate-300 flex items-center justify-between">
              <span>監視残り {Math.ceil(cameraWatchTimer)}s</span>
              <span>[←/→ / 1-4] 切替 · [Esc] 終了</span>
            </div>
            {cameraFeedCount > 1 && onSelectCameraFeed && (
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: cameraFeedCount }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectCameraFeed(idx)}
                    className={`sf-btn py-1 rounded-lg text-[10px] font-orbitron font-black border ${
                      idx === cameraFeedIndex
                        ? "bg-emerald-500 text-slate-950 border-emerald-200"
                        : "bg-slate-900/90 text-emerald-200 border-slate-700 hover:border-emerald-400/60"
                    }`}
                  >
                    CAM{idx + 1}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onSwitchCameraFeed(-1)}
                className="sf-btn flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold"
              >
                ◀ 前
              </button>
              <button
                type="button"
                onClick={() => onSwitchCameraFeed(1)}
                className="sf-btn flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold"
              >
                次 ▶
              </button>
              <button
                type="button"
                onClick={onCloseCamera}
                className="sf-btn px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                終了
              </button>
            </div>
          </div>
        )}

        {/* Vent Navigation Controls */}
        {me.inVent && currentVent && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 hud-plate rounded-2xl p-3 border border-purple-400/70 flex items-center gap-2">
            <span className="text-xs font-black text-purple-200">
              🕳️ ベント潜伏中{ventStayTimer !== null ? ` (${Math.ceil(ventStayTimer)}s)` : ""}
            </span>
            {currentVent.links.map((targetIdx) => (
              <button
                key={targetIdx}
                type="button"
                onClick={() => onJumpToVent(targetIdx)}
                className="sf-btn px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black"
              >
                移動 #{targetIdx + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={onExitVent}
              className="sf-btn px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-500 text-white text-xs font-bold"
            >
              退出 [V]
            </button>
          </div>
        )}

        {/* Floating Chat Drawer */}
        {inGameChatEnabled && chatOpen && (
          <div className="absolute top-3 right-3 z-30 w-80 h-96 hud-plate rounded-2xl border border-cyan-400/50 overflow-hidden shadow-2xl">
            <ChatPanel
              messages={chatHistory}
              myAlive={me.alive}
              isSpectator={!!me.isSpectator}
              onSendChat={onSendChat}
              onInputFocus={onClearKeys}
              title="💬 艦内チャット"
              compact
            />
          </div>
        )}

        {/* Bottom-Left Virtual Joystick (Mobile / Touch friendly) */}
        <div
          ref={joyRef}
          onPointerDown={(e) => {
            draggingRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            updateJoystick(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (draggingRef.current) updateJoystick(e.clientX, e.clientY);
          }}
          onPointerUp={resetJoystick}
          onPointerCancel={resetJoystick}
          className="absolute bottom-5 left-5 z-20 w-28 h-28 rounded-full bg-slate-900/55 border-2 border-slate-600/60 backdrop-blur-sm flex items-center justify-center touch-none select-none opacity-80 hover:opacity-100"
        >
          <div
            className="w-11 h-11 rounded-full bg-cyan-400/80 border-2 border-white shadow-lg"
            style={{ transform: `translate(${joyKnob.x}px, ${joyKnob.y}px)` }}
          />
        </div>

        {/* Bottom-Right Action Pads */}
        <div className="absolute bottom-5 right-5 z-20 flex flex-wrap justify-end gap-2 max-w-[360px]">
          {me.alive && !me.isSpectator ? (
            <>
              {reportActionState.enabled && (
                <button
                  type="button"
                  onClick={onReport}
                  className="sf-btn px-4 py-3 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 text-white font-black text-xs border-2 border-amber-200 shadow-lg"
                >
                  {reportActionState.label} [{formatKeyLabel(keybinds.report)}]
                </button>
              )}
              {killActionState.label && (
                <button
                  type="button"
                  disabled={!killActionState.enabled}
                  onClick={onKill}
                  className="sf-btn px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800/85 disabled:text-slate-400 text-white font-black text-xs border-2 border-rose-300/60 disabled:border-slate-700"
                >
                  {killActionState.label} [{formatKeyLabel(keybinds.kill)}]
                </button>
              )}
              {ventActionState.label && (
                <button
                  type="button"
                  disabled={!ventActionState.enabled}
                  onClick={onVent}
                  className="sf-btn px-3.5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800/85 disabled:text-slate-400 text-white font-black text-xs border border-purple-300/50"
                >
                  {ventActionState.label} [{formatKeyLabel(keybinds.vent)}]
                </button>
              )}
              {sabotageActionState.label && (
                <button
                  type="button"
                  disabled={!sabotageActionState.enabled}
                  onClick={onSabotage}
                  className="sf-btn px-3.5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800/85 disabled:text-slate-400 text-white font-black text-xs border border-amber-300/50"
                >
                  {sabotageActionState.label} [{formatKeyLabel(keybinds.sabotage)}]
                </button>
              )}
              {abilityActionState.label && (
                <button
                  type="button"
                  disabled={!abilityActionState.enabled}
                  onClick={onAbility}
                  className="sf-btn px-3.5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/85 disabled:text-slate-400 text-white font-black text-xs border border-indigo-300/50"
                >
                  {abilityActionState.label} [{formatKeyLabel(keybinds.ability)}]
                </button>
              )}
              <button
                type="button"
                disabled={!useActionState.enabled}
                onClick={onUse}
                className={`sf-btn px-4 py-3 rounded-2xl font-black text-xs border-2 shadow-lg ${
                  useActionState.enabled
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-400 text-slate-950 border-white"
                    : "bg-slate-900/85 text-slate-500 border-slate-700"
                }`}
              >
                {useActionState.label} [{formatKeyLabel(keybinds.use)}]
              </button>
            </>
          ) : !me.isSpectator ? (
            <>
              {isImpostorRole(me.role) && sabotageActionState.label && (
                <button
                  type="button"
                  disabled={!sabotageActionState.enabled}
                  onClick={onSabotage}
                  className="sf-btn px-3.5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800/85 disabled:text-slate-400 text-white font-black text-xs border border-amber-300/60"
                >
                  {sabotageActionState.label} [{formatKeyLabel(keybinds.sabotage)}]
                </button>
              )}
              {mapDef.hasMultiFloor && onToggleGhostFloor && (
                <button
                  type="button"
                  onClick={onToggleGhostFloor}
                  className="sf-btn px-3.5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs border border-indigo-300/60"
                >
                  ↕️ {(me.floor || 1) === 2 ? "1Fへ移動" : "2Fへ移動"}
                </button>
              )}
              <button
                type="button"
                disabled={!ghostAssistState.enabled}
                onClick={onGhostAssist}
                className="sf-btn px-3.5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-400 text-white font-black text-xs"
              >
                {ghostAssistState.label}
              </button>
              <button
                type="button"
                disabled={!ghostPrankState.enabled}
                onClick={onGhostPrank}
                className="sf-btn px-3.5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-400 text-white font-black text-xs"
              >
                {ghostPrankState.label}
              </button>
              <button
                type="button"
                disabled={!useActionState.enabled}
                onClick={onUse}
                className="sf-btn px-4 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-black text-xs border border-cyan-200/60 disabled:border-slate-700"
              >
                {useActionState.label} [{formatKeyLabel(keybinds.use)}]
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
