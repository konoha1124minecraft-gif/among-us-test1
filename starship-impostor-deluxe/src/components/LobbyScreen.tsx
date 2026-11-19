import React, { useMemo, useRef, useState } from "react";
import { EXTRA_ROLE_IDS, FB, PLAYER_COLORS, ROLES } from "../game/constants";
import { MAP_LIST, getMapById } from "../game/maps";
import type { ChatMessage, GameSettings, PlayerState, TaskDifficultyMode } from "../game/types";
import { ChatPanel } from "./ChatPanel";

interface LobbyScreenProps {
  lobbyCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  isHost: boolean;
  isOfflineAI: boolean;
  roomCode: string;
  networkStatus: string;
  pingMs: number | null;
  me: PlayerState;
  players: Record<string, PlayerState>;
  settings: GameSettings;
  chatHistory: ChatMessage[];
  nearTerminal: boolean;
  beans: number;
  level: number;
  onUpdateSettings: (patch: Partial<GameSettings>) => void;
  onStartMatch: () => void;
  onOpenCustomize: () => void;
  onOpenShop: () => void;
  onOpenMapSelector: () => void;
  onOpenRolesGuide: () => void;
  onOpenTutorialModal: () => void;
  onOpenSettings: () => void;
  onSendChat: (text: string, stampId?: string) => void;
  onLeaveLobby: () => void;
  onKickPlayer: (id: string) => void;
  onOpenTerminalFromClick: () => void;
  onClearKeys: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  lobbyCanvasRef,
  isHost,
  isOfflineAI,
  roomCode,
  networkStatus,
  pingMs,
  me,
  players,
  settings,
  chatHistory,
  nearTerminal,
  beans,
  level,
  onUpdateSettings,
  onStartMatch,
  onOpenCustomize,
  onOpenShop,
  onOpenMapSelector,
  onOpenRolesGuide,
  onOpenTutorialModal,
  onOpenSettings,
  onSendChat,
  onLeaveLobby,
  onKickPlayer,
  onOpenTerminalFromClick,
  onClearKeys,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const copyTimer = useRef<number | null>(null);

  const playerList = useMemo(() => Object.values(players), [players]);
  const activeCount = useMemo(() => playerList.filter((p) => !p.isSpectator).length, [playerList]);
  const totalCount = isOfflineAI ? 1 + settings.aiCount : activeCount;
  const selectedMap = useMemo(
    () => (settings.mapId === "random" ? null : getMapById(settings.mapId)),
    [settings.mapId]
  );

  const handleCopyCode = () => {
    if (!roomCode) return;
    void navigator.clipboard?.writeText(roomCode).catch(() => {});
    setCopiedCode(true);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopiedCode(false), 1800);
  };

  const handleCopyInviteUrl = () => {
    const base = typeof window !== "undefined" ? `${window.location.origin}${window.location.pathname}?room=${roomCode}` : "";
    const full = FB.buildShareUrlWithFb(base);
    void navigator.clipboard?.writeText(full).catch(() => {});
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100 p-2.5 sm:p-4 gap-3 overflow-y-auto">
      {/* Compact Header HUD */}
      <header className="sf-panel rounded-2xl px-3.5 py-2.5 border border-cyan-500/35 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="font-orbitron font-black text-sm sm:text-base text-cyan-300 tracking-wide">
            🚀 {isOfflineAI ? "AI SOLO MISSION" : "DROPSHIP LOBBY"}
          </div>
          {!isOfflineAI && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyCode}
                className="sf-btn px-2.5 py-1 rounded-xl bg-slate-900 border border-cyan-400/50 text-xs font-orbitron font-black text-white flex items-center gap-1.5"
              >
                <span>CODE: {roomCode}</span>
                <span className="text-[10px] text-cyan-300">{copiedCode ? "✓" : "📋"}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyInviteUrl}
                className="sf-btn px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/60 text-[11px] font-bold text-cyan-200 whitespace-nowrap"
              >
                {copiedInvite ? "✓ リンクコピー済" : "🔗 招待URL"}
              </button>
            </div>
          )}
          <span className="text-[11px] font-bold text-slate-300">{networkStatus}</span>
          {pingMs !== null && !isOfflineAI && (
            <span
              className={`px-2 py-0.5 rounded-lg font-orbitron text-[10px] font-bold border tabular-nums ${
                pingMs < 90
                  ? "bg-emerald-950/70 border-emerald-400/50 text-emerald-300"
                  : pingMs < 180
                    ? "bg-amber-950/70 border-amber-400/50 text-amber-300"
                    : "bg-rose-950/70 border-rose-400/50 text-rose-300"
              }`}
            >
              PING {pingMs}ms
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/50 text-amber-200 font-orbitron text-[11px] font-black whitespace-nowrap">
            🫘 {beans.toLocaleString()} · Lv.{level}
          </div>
          <button
            type="button"
            onClick={onOpenShop}
            className="sf-btn px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black whitespace-nowrap"
          >
            🛒 ショップ
          </button>
          <button
            type="button"
            onClick={onOpenTutorialModal}
            className="sf-btn px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 text-xs font-black whitespace-nowrap"
          >
            🎓 ルール説明
          </button>
          <button
            type="button"
            onClick={onOpenCustomize}
            className="sf-btn px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/60 text-cyan-200 text-xs font-black whitespace-nowrap"
          >
            🎨 外見カスタム
          </button>
          <button
            type="button"
            onClick={onOpenRolesGuide}
            className="sf-btn px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/50 text-purple-200 text-xs font-black whitespace-nowrap"
          >
            📖 21役職
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="sf-btn px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-600 text-xs font-bold"
          >
            ⚙️
          </button>
          <button
            type="button"
            onClick={onLeaveLobby}
            className="sf-btn px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/60 text-rose-200 text-xs font-bold whitespace-nowrap"
          >
            退出
          </button>
        </div>
      </header>

      {/* Main 12-Col Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        {/* Left: Dropship Canvas + Members */}
        <div className="lg:col-span-5 flex flex-col gap-3 min-h-0">
          <div className="sf-panel rounded-2xl p-2 border border-slate-700/80 relative">
            <canvas
              ref={lobbyCanvasRef}
              width={680}
              height={320}
              onClick={onOpenTerminalFromClick}
              className="w-full h-auto rounded-xl bg-slate-950 cursor-pointer block"
            />
            {nearTerminal && (
              <button
                type="button"
                onClick={onOpenCustomize}
                className="sf-btn absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs shadow-lg"
              >
                🎨 端末を開く [E]
              </button>
            )}
          </div>

          <div className="sf-panel rounded-2xl p-3 flex-1 min-h-[160px] flex flex-col gap-2 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-black text-cyan-300">
              <span>👥 参加メンバー ({totalCount} / {settings.maxPlayers})</span>
              {me.isSpectator && <span className="text-purple-300">👁️ 観戦参加中</span>}
            </div>
            <div className="grid grid-cols-2 gap-1.5 overflow-y-auto pr-1">
              {playerList.map((p) => {
                const c = PLAYER_COLORS.find((col) => col.id === p.color) || PLAYER_COLORS[0];
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-3 h-3 rounded-full shrink-0 border border-white/50" style={{ background: c.hex }} />
                      <span className="font-bold text-white truncate">
                        {p.name}
                        {p.isHost ? " 👑" : ""}
                      </span>
                    </div>
                    {isHost && p.id !== me.id && (
                      <button
                        type="button"
                        onClick={() => onKickPlayer(p.id)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 hover:bg-rose-800"
                      >
                        追放
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Host Match Settings */}
        <div className="lg:col-span-4 sf-panel rounded-2xl p-3.5 border border-slate-800 flex flex-col gap-2.5 overflow-y-auto max-h-[680px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-black text-amber-300">
              🛠️ ルール＆ワールド設定 {!isHost && "（ホスト専用）"}
            </span>
            <span className="text-[10px] text-slate-400">全{MAP_LIST.length}マップ対応</span>
          </div>

          {/* Visual Map Trigger */}
          <button
            type="button"
            disabled={!isHost}
            onClick={onOpenMapSelector}
            className="sf-btn w-full p-2.5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 hover:border-cyan-400 text-left flex items-center justify-between gap-2 disabled:opacity-65"
          >
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-cyan-300">作戦マップ (クリックで一覧選択)</div>
              <div className="text-xs font-black text-white truncate">
                {settings.mapId === "random" ? "🎲 毎回ランダム抽選 (全30マップ)" : selectedMap?.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {settings.mapId === "random" ? "試合開始ごとにマップを動的選出" : selectedMap?.gimmickSummary}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-200 text-[11px] font-black shrink-0">
              変更
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="rounded-xl bg-slate-900 border border-slate-800 p-2 space-y-1">
              <span className="text-[10px] text-slate-400 block">インポスター数</span>
              <select
                disabled={!isHost}
                value={settings.impostorCount}
                onChange={(e) => onUpdateSettings({ impostorCount: Number(e.target.value) })}
                className="w-full bg-slate-950 rounded-lg px-2 py-1 font-bold text-white border border-slate-700"
              >
                {[1, 2, 3].map((n) => (
                  <option key={n} value={n}>{n} 人</option>
                ))}
              </select>
            </label>

            {isOfflineAI ? (
              <label className="rounded-xl bg-slate-900 border border-slate-800 p-2 space-y-1">
                <span className="text-[10px] text-slate-400 block">AIボット人数</span>
                <select
                  value={settings.aiCount}
                  onChange={(e) => onUpdateSettings({ aiCount: Number(e.target.value) })}
                  className="w-full bg-slate-950 rounded-lg px-2 py-1 font-bold text-white border border-slate-700"
                >
                  {[3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n}>{n} 体</option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="rounded-xl bg-slate-900 border border-slate-800 p-2 space-y-1">
                <span className="text-[10px] text-slate-400 block">キルクールダウン</span>
                <select
                  disabled={!isHost}
                  value={settings.killCooldown}
                  onChange={(e) => onUpdateSettings({ killCooldown: Number(e.target.value) })}
                  className="w-full bg-slate-950 rounded-lg px-2 py-1 font-bold text-white border border-slate-700"
                >
                  {[15, 20, 24, 30, 35, 45].map((n) => (
                    <option key={n} value={n}>{n} 秒</option>
                  ))}
                </select>
              </label>
            )}

            <label className="rounded-xl bg-slate-900 border border-slate-800 p-2 space-y-1">
              <span className="text-[10px] text-slate-400 block">1人あたりタスク数</span>
              <select
                disabled={!isHost}
                value={settings.tasksPerPlayer}
                onChange={(e) => onUpdateSettings({ tasksPerPlayer: Number(e.target.value) })}
                className="w-full bg-slate-950 rounded-lg px-2 py-1 font-bold text-white border border-slate-700"
              >
                {[3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                  <option key={n} value={n}>{n} 個</option>
                ))}
              </select>
            </label>

            <label className="rounded-xl bg-slate-900 border border-slate-800 p-2 space-y-1">
              <span className="text-[10px] text-slate-400 block">タスク難易度</span>
              <select
                disabled={!isHost}
                value={settings.taskDifficulty}
                onChange={(e) => onUpdateSettings({ taskDifficulty: e.target.value as TaskDifficultyMode })}
                className="w-full bg-slate-950 rounded-lg px-2 py-1 font-bold text-amber-300 border border-slate-700"
              >
                <option value="NORMAL">NORMAL (易しめ)</option>
                <option value="HARD">HARD (標準推奨)</option>
                <option value="EXTREME">EXTREME (超難関)</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            {[
              ["enableMapGimmicks", "✨ マップ固有ギミック"],
              ["enableExtraRoles", "🎭 特殊21役職を使用"],
              ["anonymousVoting", "🗳️ 匿名投票"],
              ["confirmEjects", "🔎 追放結果を表示"],
              ["inGameChat", "💬 試合中チャット"],
              ["roomPublic", "🌐 公開ルーム一覧へ掲載"],
            ].map(([key, label]) => {
              const checked = !!settings[key as keyof GameSettings];
              return (
                <label
                  key={key}
                  className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 cursor-pointer"
                >
                  <span className="font-bold text-slate-200 truncate">{label}</span>
                  <input
                    type="checkbox"
                    disabled={!isHost}
                    checked={checked}
                    onChange={(e) => onUpdateSettings({ [key]: e.target.checked })}
                    className="w-4 h-4 accent-cyan-400"
                  />
                </label>
              );
            })}
          </div>

          {settings.enableExtraRoles && (
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-2.5 space-y-1.5">
              <div className="text-[10px] font-bold text-purple-300">有効化する特殊役職</div>
              <div className="flex flex-wrap gap-1">
                {EXTRA_ROLE_IDS.map((rid) => {
                  const r = ROLES[rid];
                  const on = settings.enabledRoles[rid] !== false;
                  return (
                    <button
                      key={rid}
                      type="button"
                      disabled={!isHost}
                      onClick={() =>
                        onUpdateSettings({
                          enabledRoles: { ...settings.enabledRoles, [rid]: !on },
                        })
                      }
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                        on
                          ? "bg-slate-800 text-white border-purple-400/60"
                          : "bg-slate-950 text-slate-500 border-slate-800"
                      }`}
                      style={on ? { color: r.color } : undefined}
                    >
                      {r.jp}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isHost && (
            <button
              type="button"
              disabled={totalCount < 4}
              onClick={onStartMatch}
              className="sf-btn mt-auto w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 text-slate-950 font-black text-sm shadow-xl disabled:opacity-45"
            >
              {totalCount < 4 ? `🚀 あと ${4 - totalCount}人必要です` : "🚀 ゲーム開始！"}
            </button>
          )}
        </div>

        {/* Right: Chat Panel */}
        <div className="lg:col-span-3 sf-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col min-h-[260px]">
          <ChatPanel
            messages={chatHistory}
            myAlive={true}
            isSpectator={!!me.isSpectator}
            onSendChat={onSendChat}
            onInputFocus={onClearKeys}
            title="💬 ロビーチャット"
            compact
          />
        </div>
      </div>
    </div>
  );
};
