import React, { useEffect, useRef } from "react";
import { drawKillCutInCanvas, renderGroupLineup } from "../game/canvasRenderer";
import { PLAYER_COLORS, ROLES, getXpForNextLevel, isCrewRole, isImpostorRole } from "../game/constants";
import type { BeanRewardBreakdown, KillCutInData, PlayerState, ProgressionData, TimelineEntry } from "../game/types";

/* -------------------------------------------------------------------------- */
/* 1. RoleRevealOverlay (with per-role 1-line tactical tip)                   */
/* -------------------------------------------------------------------------- */

interface RoleRevealOverlayProps {
  open: boolean;
  me: PlayerState;
  players: Record<string, PlayerState>;
  onDismiss: () => void;
}

export const RoleRevealOverlay: React.FC<RoleRevealOverlayProps> = ({
  open,
  me,
  players,
  onDismiss,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const roleDef = ROLES[me.role] || ROLES.crewmate;
  const isImp = isImpostorRole(me.role);
  const isCrew = isCrewRole(me.role);
  const execTarget = me.executionerTargetId ? players[me.executionerTargetId] : null;

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const all = Object.values(players).filter((p) => !p.isSpectator);
    const members = isImp
      ? all.filter((p) => isImpostorRole(p.role)).map((p) => ({
          color: p.color,
          hat: p.hat,
          pet: p.pet,
          skin: p.skin,
          visor: p.visor,
          name: p.name,
          isHighlight: p.id === me.id,
        }))
      : isCrew
        ? all.slice(0, 8).map((p) => ({
            color: p.color,
            hat: p.hat,
            pet: p.pet,
            skin: p.skin,
            visor: p.visor,
            name: p.name,
            isHighlight: p.id === me.id,
          }))
        : [
            {
              color: me.color,
              hat: me.hat,
              pet: me.pet,
              skin: me.skin,
              visor: me.visor,
              name: me.name,
              isHighlight: true,
            },
          ];

    renderGroupLineup({
      canvas: canvasRef.current,
      members,
      glowColor: roleDef.color,
    });
  }, [open, me, players, isImp, isCrew, roleDef.color]);

  if (!open) return null;

  const teamLabel = me.isSpectator
    ? "SPECTATOR"
    : isImp
      ? "IMPOSTOR TEAM"
      : isCrew
        ? "CREWMATE TEAM"
        : "NEUTRAL FACTION";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4">
      <div className="sf-panel w-full max-w-2xl rounded-3xl p-6 border-2 text-center space-y-4 shadow-2xl" style={{ borderColor: roleDef.color }}>
        <div className="text-xs font-orbitron font-black tracking-[0.25em]" style={{ color: roleDef.color }}>
          {teamLabel}
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          {me.isSpectator ? "👁️ 観戦者" : roleDef.jp}
        </h2>
        <div className="text-xs font-orbitron text-slate-400">{roleDef.name}</div>

        <canvas ref={canvasRef} width={560} height={150} className="w-full h-auto rounded-2xl bg-slate-950/70 border border-slate-800 mx-auto block" />

        <p className="text-sm text-slate-200 leading-relaxed max-w-xl mx-auto">
          {me.isSpectator ? "生存プレイヤーの視点を自由に切り替えながら観戦します。" : roleDef.desc}
        </p>

        {!me.isSpectator && (
          <div className="rounded-2xl bg-amber-950/45 border border-amber-400/50 px-4 py-2.5 text-xs text-amber-200 font-bold max-w-xl mx-auto">
            💡 立ち回りのコツ: {roleDef.tip}
          </div>
        )}

        {execTarget && (
          <div className="rounded-xl bg-amber-500/20 border border-amber-400 px-4 py-2 text-xs font-black text-amber-200 inline-block">
            🎯 あなたの追放ターゲット: <span className="text-white">{execTarget.name}</span>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={onDismiss}
            className="sf-btn px-8 py-3 rounded-2xl font-black text-sm text-slate-950 shadow-xl"
            style={{ background: roleDef.color }}
          >
            ミッション開始！
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. ReportCutInOverlay                                                      */
/* -------------------------------------------------------------------------- */

interface ReportCutInOverlayProps {
  open: boolean;
  isBodyReport: boolean;
  callerName: string;
  victimName?: string;
  victimColor?: string;
}

export const ReportCutInOverlay: React.FC<ReportCutInOverlayProps> = ({
  open,
  isBodyReport,
  callerName,
  victimName,
  victimColor,
}) => {
  if (!open) return null;
  const c = victimColor ? PLAYER_COLORS.find((col) => col.id === victimColor) : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-none">
      <div className="cutin-pop w-full max-w-xl rounded-3xl p-6 border-2 border-rose-500 bg-gradient-to-r from-rose-950/95 via-slate-950/95 to-amber-950/95 text-center space-y-2 shadow-[0_0_60px_rgba(244,63,94,0.6)]">
        <div className="text-4xl">{isBodyReport ? "📢" : "🚨"}</div>
        <div className="font-orbitron font-black text-2xl sm:text-3xl tracking-wider text-white">
          {isBodyReport ? "DEAD BODY REPORTED!" : "EMERGENCY MEETING!"}
        </div>
        <div className="text-sm font-bold text-amber-200">
          招集者: <span className="text-white">{callerName}</span>
          {victimName && (
            <span className="ml-2 inline-flex items-center gap-1">
              · 被害者:
              {c && <span className="inline-block w-3 h-3 rounded-full border border-white" style={{ background: c.hex }} />}
              <span className="text-rose-300">{victimName}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. KillFlashOverlay                                                        */
/* -------------------------------------------------------------------------- */

export const KillFlashOverlay: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none border-[12px] border-rose-500/80 bg-rose-600/25 animate-pulse"
    />
  );
};

/* -------------------------------------------------------------------------- */
/* 4. EjectionOverlay                                                         */
/* -------------------------------------------------------------------------- */

interface EjectionOverlayProps {
  open: boolean;
  message: string;
  ejectedColor?: string;
}

export const EjectionOverlay: React.FC<EjectionOverlayProps> = ({
  open,
  message,
  ejectedColor,
}) => {
  if (!open) return null;
  const col = ejectedColor ? PLAYER_COLORS.find((c) => c.id === ejectedColor) : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-5">
      {col && (
        <div
          className="eject-drift w-14 h-16 rounded-2xl border-2 border-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.25)]"
          style={{ background: col.hex }}
        />
      )}
      <div className="text-xl sm:text-2xl font-black text-white max-w-lg leading-relaxed">{message}</div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4b. KillCutInOverlay (Full-screen Impostor Kill Cinematic)                 */
/* -------------------------------------------------------------------------- */

export const KillCutInOverlay: React.FC<{ data: KillCutInData | null }> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!data || !data.open) return;
    const startMs = performance.now();
    let raf = 0;
    const render = (now: number) => {
      const c = canvasRef.current;
      if (c) {
        const progress = Math.min(1, (now - startMs) / 1850);
        drawKillCutInCanvas(c, data, progress, now);
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [data]);

  if (!data || !data.open) return null;

  return (
    <div className="fixed inset-0 z-[55] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-none">
      <div className="cutin-shake w-full max-w-3xl rounded-3xl overflow-hidden border-4 border-rose-500 shadow-[0_0_80px_rgba(244,63,94,0.8)] bg-slate-950">
        <canvas ref={canvasRef} width={780} height={320} className="w-full h-auto block" />
        <div className="px-5 py-3 bg-gradient-to-r from-rose-950 via-slate-950 to-rose-950 border-t border-rose-500/60 flex items-center justify-between gap-3">
          <div className="font-orbitron font-black text-base sm:text-xl text-rose-400 tracking-wider">
            🔪 IMPOSTOR KILL!
          </div>
          <div className="text-xs sm:text-sm font-black text-white">
            <span className="text-rose-300">{data.killerName}</span>
            <span className="mx-2 text-slate-400">▶</span>
            <span className="text-amber-200">{data.victimName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. GameOverOverlay                                                         */
/* -------------------------------------------------------------------------- */

interface GameOverOverlayProps {
  open: boolean;
  winner: string;
  reason: string;
  players: Record<string, PlayerState>;
  timeline: TimelineEntry[];
  newlyUnlocked: string[];
  beanReward?: BeanRewardBreakdown | null;
  progression?: ProgressionData;
  isHost: boolean;
  onPlayAgain: () => void;
  onReturnTitle: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  open,
  winner,
  reason,
  players,
  timeline,
  newlyUnlocked,
  beanReward,
  progression,
  isHost,
  onPlayAgain,
  onReturnTitle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const all = Object.values(players).filter((p) => !p.isSpectator);

  const isCrewWin = winner === "crewmates";
  const isImpWin = winner === "impostors";
  const accent = isCrewWin ? "#38bdf8" : isImpWin ? "#ef4444" : "#c084fc";

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const winners = all.filter((p) => {
      if (isCrewWin) return isCrewRole(p.role);
      if (isImpWin) return isImpostorRole(p.role);
      return p.role === winner;
    });
    renderGroupLineup({
      canvas: canvasRef.current,
      members: (winners.length > 0 ? winners : all.slice(0, 4)).map((p) => ({
        color: p.color,
        hat: p.hat,
        pet: p.pet,
        skin: p.skin,
        visor: p.visor,
        name: p.name,
        isHighlight: true,
      })),
      glowColor: accent,
    });
  }, [open, all, isCrewWin, isImpWin, winner, accent]);

  if (!open) return null;

  const headline = isCrewWin
    ? "CREWMATE VICTORY!"
    : isImpWin
      ? "IMPOSTOR VICTORY!"
      : `${ROLES[winner as keyof typeof ROLES]?.jp || winner.toUpperCase()} VICTORY!`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/94 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div
        className="sf-panel w-full max-w-4xl max-h-[92vh] rounded-3xl p-5 border-2 flex flex-col gap-4 overflow-hidden"
        style={{ borderColor: accent }}
      >
        <div className="text-center space-y-1 shrink-0">
          <div className="font-orbitron font-black text-2xl sm:text-4xl" style={{ color: accent }}>
            {headline}
          </div>
          <p className="text-sm text-slate-200 font-bold">{reason}</p>
        </div>

        <canvas ref={canvasRef} width={640} height={145} className="w-full h-auto rounded-2xl bg-slate-950 border border-slate-800 shrink-0 block" />

        {beanReward && (
          <div className="rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900/95 to-cyan-950/50 border border-amber-400/50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {beanReward.forfeited ? (
              <div className="text-xs font-black text-rose-300">
                ⚠️ 途中離脱のため獲得予定の豆通貨・XPは没収されました (+0 🫘)
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-black text-amber-300">🫘 報酬リザルト:</span>
                  <span className="text-slate-300">
                    基本+{beanReward.base} / タスク+{beanReward.tasks} / キル+{beanReward.kills} / 追放+{beanReward.ejects} / 勝利+{beanReward.win}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/50 font-orbitron text-[10px] font-black text-amber-200">
                    ×{beanReward.multiplier.toFixed(1)} 倍率
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-orbitron font-black text-sm text-amber-300">
                    +{beanReward.totalBeans} 🫘
                  </div>
                  <div className="text-xs font-bold text-cyan-300">
                    +{beanReward.xpEarned} XP
                    {beanReward.leveledUp && (
                      <span className="ml-1.5 px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-black text-[10px]">
                        LEVEL UP! Lv.{beanReward.newLevel}
                      </span>
                    )}
                  </div>
                  {progression && (
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-300">
                      <span>Lv.{progression.level}</span>
                      <div className="w-20 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-cyan-400"
                          style={{
                            width: `${Math.min(100, Math.round((progression.xp / Math.max(1, getXpForNextLevel(progression.level))) * 100))}%`,
                          }}
                        />
                      </div>
                      <span className="font-orbitron tabular-nums text-amber-200">
                        {progression.beans.toLocaleString()}🫘
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 flex flex-col gap-2 min-h-0">
            <div className="text-xs font-black text-cyan-300">🎭 全員の本来の役職</div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {all.map((p) => {
                const c = PLAYER_COLORS.find((col) => col.id === p.color) || PLAYER_COLORS[0];
                const r = ROLES[p.role] || ROLES.crewmate;
                return (
                  <div key={p.id} className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: c.hex }} />
                      <span className="font-bold text-white">{p.name}</span>
                      {!p.alive && <span className="text-[10px] text-slate-500">💀</span>}
                    </div>
                    <span className="font-black" style={{ color: r.color }}>{r.jp}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 flex flex-col gap-2 min-h-0">
            <div className="text-xs font-black text-amber-300">⏱️ マッチタイムライン</div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {timeline.map((t) => (
                <div key={t.id} className="flex gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="font-orbitron text-[10px] text-cyan-300 shrink-0 tabular-nums">{t.timeLabel}</span>
                  <span className="text-slate-200">{t.text}</span>
                </div>
              ))}
            </div>
            {newlyUnlocked.length > 0 && (
              <div className="rounded-xl bg-amber-950/60 border border-amber-400/60 p-2 text-[11px] text-amber-200 font-bold">
                🏆 新規実績解放: {newlyUnlocked.join(" / ")}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 shrink-0">
          {isHost && (
            <button
              type="button"
              onClick={onPlayAgain}
              className="sf-btn px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-sm shadow-lg"
            >
              🔄 ロビーへ戻ってもう一度
            </button>
          )}
          <button
            type="button"
            onClick={onReturnTitle}
            className="sf-btn px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-sm"
          >
            🏠 タイトルへ戻る
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. AchievementToastOverlay                                                 */
/* -------------------------------------------------------------------------- */

export const AchievementToastOverlay: React.FC<{ title: string | null }> = ({ title }) => {
  if (!title) return null;
  return (
    <div className="fixed top-16 right-4 z-[60] hud-plate rounded-2xl px-4 py-3 border-2 border-amber-400 shadow-2xl flex items-center gap-3 animate-bounce">
      <span className="text-2xl">🏆</span>
      <div>
        <div className="text-[10px] font-orbitron text-amber-300 font-black">ACHIEVEMENT UNLOCKED</div>
        <div className="text-xs font-black text-white">{title}</div>
      </div>
    </div>
  );
};
