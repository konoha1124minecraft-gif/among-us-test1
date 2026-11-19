import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { soundEngine } from "../game/audio";
import { shuffle } from "../game/engine";
import { getDifficultyMultiplier, getTaskById } from "../game/tasks150";
import type { TaskDef, TaskDifficultyMode } from "../game/types";

interface TaskModalProps {
  taskId: string | null;
  difficulty: TaskDifficultyMode;
  onComplete: (taskId: string) => void;
  onClose: () => void;
}

const WIRE_PALETTE = [
  "#ef4444",
  "#3b82f6",
  "#facc15",
  "#ec4899",
  "#22c55e",
  "#a855f7",
  "#22d3ee",
];

function seedFromString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  taskId,
  difficulty,
  onComplete,
  onClose,
}) => {
  const [errorFlash, setErrorFlash] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isCompletedRef = useRef(false);
  const lockoutUntilRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const mult = useMemo(() => getDifficultyMultiplier(difficulty), [difficulty]);
  const isSabFix = taskId?.startsWith("sabotage_") || false;
  const taskDef: TaskDef | null = useMemo(
    () => (taskId && !isSabFix ? getTaskById(taskId) : null),
    [taskId, isSabFix]
  );

  useEffect(() => {
    isCompletedRef.current = false;
    lockoutUntilRef.current = 0;
    setErrorFlash(false);
    setErrorMsg(null);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [taskId]);

  const isLockedOut = useCallback(() => Date.now() < lockoutUntilRef.current, []);

  const triggerSuccess = useCallback(() => {
    if (!taskId || isCompletedRef.current) return;
    isCompletedRef.current = true;
    soundEngine.playTaskOk();
    timerRef.current = window.setTimeout(() => {
      onComplete(taskId);
    }, 320);
  }, [taskId, onComplete]);

  const triggerError = useCallback(
    (msg = "入力エラー！再試行してください") => {
      if (isCompletedRef.current) return;
      soundEngine.playError();
      lockoutUntilRef.current = Date.now() + mult.lockoutMs;
      setErrorFlash(true);
      setErrorMsg(msg);
      window.setTimeout(() => setErrorFlash(false), Math.min(700, mult.lockoutMs));
    },
    [mult.lockoutMs]
  );

  useEffect(() => {
    if (!taskId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [taskId, onClose]);

  if (!taskId) return null;

  const title =
    taskId === "sabotage_lights"
      ? "⚡ 配電ブレーカー復旧"
      : taskId === "sabotage_reactor"
        ? "☢️ 原子炉安定化スキャン"
        : taskId === "sabotage_gas"
          ? "☣️ 酸素中和コード認証"
          : taskDef?.name || "タスク";

  const desc =
    taskId === "sabotage_lights"
      ? "5つのブレーカースイッチをすべて「ON (緑)」に切り替えて電力を復旧せよ！"
      : taskId === "sabotage_reactor"
        ? "緊急ハンドスキャナを長押しして炉心圧力を安定化させよ！"
        : taskId === "sabotage_gas"
          ? "中和端末の6桁セキュリティコードを入力してガス漏れを停止せよ！"
          : taskDef?.desc || "";

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className={`sf-panel w-full max-w-2xl rounded-3xl p-4 sm:p-6 border-2 transition-colors space-y-4 shadow-2xl ${
          errorFlash ? "border-rose-500 bg-rose-950/40" : "border-cyan-400/60"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-400/50 font-orbitron text-[10px] font-black text-cyan-300">
                {isSabFix ? "EMERGENCY REPAIR" : taskDef?.categoryLabel}
              </span>
              {!isSabFix && (
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/40 font-orbitron text-[10px] font-black text-amber-300">
                  {difficulty}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">{title}</h2>
            <p className="text-xs text-slate-300">{desc}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="sf-btn px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold shrink-0"
          >
            ✕ 中断
          </button>
        </div>

        {errorMsg && (
          <div
            className={`px-3 py-2 rounded-xl border text-xs font-black text-center ${
              errorFlash
                ? "bg-rose-600/35 border-rose-400 text-rose-100"
                : "bg-slate-900/90 border-slate-700 text-rose-300"
            }`}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Active Task Body */}
        <div className="min-h-[280px] flex flex-col justify-center">
          {taskId === "sabotage_lights" && (
            <LightsBreakerGame isLockedOut={isLockedOut} onSuccess={triggerSuccess} />
          )}
          {taskId === "sabotage_reactor" && (
            <ReactorHoldGame holdSec={2.4 * mult.speedScale} onSuccess={triggerSuccess} />
          )}
          {taskId === "sabotage_gas" && (
            <KeypadGame
              targetCode="314159"
              isLockedOut={isLockedOut}
              onError={triggerError}
              onSuccess={triggerSuccess}
            />
          )}

          {taskDef?.type === "wires" && (
            <WiresGame
              wireCount={Math.min(7, (taskDef.variantConfig?.wireCount || 4) + (difficulty === "EXTREME" ? 1 : 0))}
              onSuccess={triggerSuccess}
              onError={triggerError}
              isLockedOut={isLockedOut}
            />
          )}
          {taskDef?.type === "keypad" && (
            <KeypadGame
              targetCode={taskDef.variantConfig?.targetCode || "48291"}
              isLockedOut={isLockedOut}
              onError={triggerError}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "slider_match" && (
            <SliderMatchGame
              targets={taskDef.variantConfig?.freqTargets || [32, 68, 50]}
              tolerance={Math.max(2, Math.round(5 * mult.toleranceScale))}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "sequence_memory" && (
            <SequenceMemoryGame
              isOrderedNumbers={taskDef.id === "t_manifold_num"}
              seqLength={
                taskDef.id === "t_manifold_num"
                  ? 10
                  : Math.min(8, (taskDef.variantConfig?.seqLength || 4) + mult.extraCount)
              }
              speedScale={mult.speedScale}
              isLockedOut={isLockedOut}
              onError={triggerError}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "asteroid_shoot" && (
            <AsteroidShootGame
              targetCount={(taskDef.variantConfig?.targetCount || 6) + mult.extraCount}
              speedScale={mult.speedScale}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "gauge_hold" && (
            <GaugeHoldGame
              speedScale={mult.speedScale}
              toleranceScale={mult.toleranceScale}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "sample_analyze" && (
            <SampleAnalyzeGame
              count={Math.min(6, (taskDef.variantConfig?.targetCount || 4) + (difficulty === "EXTREME" ? 1 : 0))}
              spinSec={2.0 * mult.speedScale}
              isLockedOut={isLockedOut}
              onError={triggerError}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "dial_align" && (
            <DialAlignGame
              ringCount={Math.min(4, taskDef.variantConfig?.freqTargets?.length || 3)}
              toleranceDeg={Math.max(6, Math.round(14 * mult.toleranceScale))}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "grid_toggle" && (
            <GridToggleGame
              size={taskDef.variantConfig?.gridSize || 3}
              seed={seedFromString(taskDef.id)}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "trash_sort" && (
            <TrashSortGame
              targetCount={(taskDef.variantConfig?.targetCount || 5) + mult.extraCount}
              isLockedOut={isLockedOut}
              onError={triggerError}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "pipe_rotate" && (
            <PipeRotateGame
              size={taskDef.variantConfig?.pipeSize || 3}
              seed={seedFromString(taskDef.id)}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "rhythm_sync" && (
            <RhythmSyncGame
              beats={(taskDef.variantConfig?.rhythmBeats || 5) + mult.extraCount}
              speedScale={mult.speedScale}
              toleranceScale={mult.toleranceScale}
              isLockedOut={isLockedOut}
              onError={triggerError}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "maze_trace" && (
            <MazeTraceGame
              size={taskDef.variantConfig?.gridSize || 4}
              seed={seedFromString(taskDef.id)}
              isLockedOut={isLockedOut}
              onError={triggerError}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "radar_lock" && (
            <RadarLockGame
              targetCount={(taskDef.variantConfig?.targetCount || 4) + mult.extraCount}
              speedScale={mult.speedScale}
              toleranceScale={mult.toleranceScale}
              isLockedOut={isLockedOut}
              onError={triggerError}
              onSuccess={triggerSuccess}
            />
          )}
          {taskDef?.type === "cipher_decode" && (
            <CipherDecodeGame
              hint={taskDef.variantConfig?.cipherHint || "★=S  ▲=T  ●=A  ◆=R"}
              answer={taskDef.variantConfig?.cipherAnswer || "STAR"}
              isLockedOut={isLockedOut}
              onError={triggerError}
              onSuccess={triggerSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Sabotage Mini-Games                                                        */
/* -------------------------------------------------------------------------- */

const LightsBreakerGame: React.FC<{ isLockedOut: () => boolean; onSuccess: () => void }> = ({
  isLockedOut,
  onSuccess,
}) => {
  const [switches, setSwitches] = useState<boolean[]>(() => {
    const arr = Array.from({ length: 5 }, () => Math.random() > 0.5);
    if (arr.every(Boolean)) arr[2] = false;
    return arr;
  });

  const toggle = (idx: number) => {
    if (isLockedOut()) return;
    soundEngine.playClick();
    const next = switches.map((v, i) => (i === idx ? !v : v));
    setSwitches(next);
    if (next.every(Boolean)) onSuccess();
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-6">
      {switches.map((on, i) => (
        <button
          key={i}
          type="button"
          onClick={() => toggle(i)}
          className={`sf-btn w-20 h-32 rounded-2xl border-2 flex flex-col items-center justify-between p-3 transition ${
            on
              ? "bg-emerald-950/70 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]"
              : "bg-slate-900 border-rose-500/60"
          }`}
        >
          <span className={`w-4 h-4 rounded-full ${on ? "bg-emerald-400" : "bg-rose-500"}`} />
          <div className="w-8 h-12 rounded-lg bg-slate-950 border border-slate-700 relative">
            <div
              className={`absolute left-1 right-1 h-5 rounded transition-all ${
                on ? "top-1 bg-emerald-400" : "bottom-1 bg-rose-500"
              }`}
            />
          </div>
          <span className="font-orbitron text-[10px] font-black text-white">{on ? "ON" : "OFF"}</span>
        </button>
      ))}
    </div>
  );
};

const ReactorHoldGame: React.FC<{ holdSec: number; onSuccess: () => void }> = ({
  holdSec,
  onSuccess,
}) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const stopHold = () => setHolding(false);
    window.addEventListener("pointerup", stopHold);
    window.addEventListener("pointercancel", stopHold);
    return () => {
      window.removeEventListener("pointerup", stopHold);
      window.removeEventListener("pointercancel", stopHold);
    };
  }, []);

  useEffect(() => {
    if (!holding) return;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setProgress((prev) => {
        const next = Math.min(100, prev + (100 / holdSec) * dt);
        if (next >= 100 && !doneRef.current) {
          doneRef.current = true;
          onSuccess();
        }
        return next;
      });
      if (!doneRef.current) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [holding, holdSec, onSuccess]);

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <button
        type="button"
        onPointerDown={() => setHolding(true)}
        className={`w-40 h-40 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 transition select-none touch-none ${
          holding
            ? "bg-cyan-500/25 border-cyan-300 scale-95 shadow-[0_0_35px_rgba(34,211,238,0.5)]"
            : "bg-slate-900 border-rose-500/70 hover:border-cyan-400"
        }`}
      >
        <span className="text-4xl">🖐️</span>
        <span className="text-xs font-black text-white">{holding ? "スキャン中..." : "長押しで安定化"}</span>
      </button>
      <div className="w-full max-w-sm h-4 rounded-full bg-slate-900 border border-slate-700 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="font-orbitron text-xs font-black text-cyan-300 tabular-nums">{Math.round(progress)}%</div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 1. WiresGame (Pointer drag + window cleanup + click fallback)              */
/* -------------------------------------------------------------------------- */

const WiresGame: React.FC<{
  wireCount: number;
  isLockedOut: () => boolean;
  onError: (msg: string) => void;
  onSuccess: () => void;
}> = ({ wireCount, isLockedOut, onError, onSuccess }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftColors = useMemo(() => WIRE_PALETTE.slice(0, wireCount), [wireCount]);
  const rightColors = useMemo(() => shuffle([...leftColors]), [leftColors]);

  const [connections, setConnections] = useState<Record<string, boolean>>({});
  const [draggingColor, setDraggingColor] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const getCenter = useCallback((side: "L" | "R", color: string) => {
    const box = containerRef.current;
    if (!box) return { x: 0, y: 0 };
    const el = box.querySelector(`[data-wire="${side}-${color}"]`) as HTMLElement | null;
    if (!el) return { x: 0, y: 0 };
    const br = box.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return { x: er.left - br.left + er.width / 2, y: er.top - br.top + er.height / 2 };
  }, []);

  const tryConnect = useCallback(
    (fromColor: string, toColor: string) => {
      if (isLockedOut()) return;
      if (fromColor === toColor) {
        soundEngine.playClick();
        setConnections((prev) => {
          const next = { ...prev, [fromColor]: true };
          if (Object.keys(next).length >= leftColors.length) {
            onSuccess();
          }
          return next;
        });
      } else {
        onError("色違いの端子には接続できません！");
      }
    },
    [isLockedOut, leftColors.length, onError, onSuccess]
  );

  // GUARD_06: window pointermove / pointerup cleanup
  useEffect(() => {
    if (!draggingColor) return;
    const onMove = (ev: PointerEvent) => {
      const box = containerRef.current;
      if (!box) return;
      const r = box.getBoundingClientRect();
      setDragPos({ x: ev.clientX - r.left, y: ev.clientY - r.top });
    };
    const onUp = (ev: PointerEvent) => {
      const el = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null;
      const targetAttr = el?.closest("[data-wire]")?.getAttribute("data-wire");
      if (targetAttr && targetAttr.startsWith("R-")) {
        const rightColor = targetAttr.slice(2);
        tryConnect(draggingColor, rightColor);
      }
      setDraggingColor(null);
      setDragPos(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [draggingColor, tryConnect]);

  return (
    <div ref={containerRef} className="relative flex justify-between items-center px-4 sm:px-10 py-3 select-none touch-none">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {leftColors.map((col) => {
          if (!connections[col]) return null;
          const p1 = getCenter("L", col);
          const p2 = getCenter("R", col);
          return <line key={col} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={col} strokeWidth={8} strokeLinecap="round" />;
        })}
        {draggingColor && dragPos && (() => {
          const p1 = getCenter("L", draggingColor);
          return <line x1={p1.x} y1={p1.y} x2={dragPos.x} y2={dragPos.y} stroke={draggingColor} strokeWidth={8} strokeLinecap="round" strokeDasharray="6 4" />;
        })()}
      </svg>

      <div className="flex flex-col gap-3 z-10">
        {leftColors.map((col) => {
          const done = !!connections[col];
          return (
            <button
              key={col}
              type="button"
              data-wire={`L-${col}`}
              onPointerDown={(e) => {
                if (done || isLockedOut()) return;
                const box = containerRef.current;
                if (box) {
                  const r = box.getBoundingClientRect();
                  setDragPos({ x: e.clientX - r.left, y: e.clientY - r.top });
                }
                setDraggingColor(col);
                setSelectedLeft(col);
              }}
              className={`w-14 h-9 rounded-xl border-2 flex items-center justify-center font-black text-xs transition ${
                done
                  ? "opacity-90 border-white"
                  : selectedLeft === col
                    ? "ring-2 ring-white scale-105"
                    : "border-slate-950 hover:scale-105"
              }`}
              style={{ background: col }}
            >
              {done ? "✓" : "●"}
            </button>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-400 text-center max-w-[140px]">
        左から右の同色へドラッグ（または順番にクリック）
      </div>

      <div className="flex flex-col gap-3 z-10">
        {rightColors.map((col) => {
          const done = !!connections[col];
          return (
            <button
              key={col}
              type="button"
              data-wire={`R-${col}`}
              onClick={() => {
                if (!done && selectedLeft) {
                  tryConnect(selectedLeft, col);
                  setSelectedLeft(null);
                }
              }}
              className={`w-14 h-9 rounded-xl border-2 flex items-center justify-center font-black text-xs transition ${
                done ? "border-white" : "border-slate-950 hover:scale-105"
              }`}
              style={{ background: col }}
            >
              {done ? "✓" : "●"}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. KeypadGame                                                              */
/* -------------------------------------------------------------------------- */

const KeypadGame: React.FC<{
  targetCode: string;
  isLockedOut: () => boolean;
  onError: (msg: string) => void;
  onSuccess: () => void;
}> = ({ targetCode, isLockedOut, onError, onSuccess }) => {
  const [input, setInput] = useState("");

  const pressDigit = (d: string) => {
    if (isLockedOut()) return;
    soundEngine.playClick();
    if (input.length < targetCode.length) {
      setInput((prev) => prev + d);
    }
  };

  const submit = () => {
    if (isLockedOut()) return;
    if (input === targetCode) {
      onSuccess();
    } else {
      onError(`パスコード不一致！正しくは ${targetCode} です`);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="px-5 py-2 rounded-2xl bg-slate-900 border border-amber-400/50 text-center">
        <div className="text-[10px] text-amber-300 font-bold">認証ターゲットコード</div>
        <div className="font-orbitron font-black text-2xl tracking-[0.3em] text-white">{targetCode}</div>
      </div>

      <div className="w-60 h-11 rounded-xl bg-slate-950 border border-cyan-500/50 flex items-center justify-center font-orbitron text-xl font-black tracking-[0.25em] text-cyan-300">
        {input || "------"}
      </div>

      <div className="grid grid-cols-3 gap-2 w-60">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLR", "0", "OK"].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              if (k === "CLR") setInput("");
              else if (k === "OK") submit();
              else pressDigit(k);
            }}
            className={`sf-btn h-11 rounded-xl font-orbitron font-black text-sm border ${
              k === "OK"
                ? "bg-emerald-500 text-slate-950 border-emerald-200"
                : k === "CLR"
                  ? "bg-rose-950/70 text-rose-200 border-rose-500/60"
                  : "bg-slate-800 hover:bg-slate-700 text-white border-slate-600"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. SliderMatchGame                                                         */
/* -------------------------------------------------------------------------- */

const SliderMatchGame: React.FC<{
  targets: number[];
  tolerance: number;
  onSuccess: () => void;
}> = ({ targets, tolerance, onSuccess }) => {
  const [vals, setVals] = useState<number[]>(() => targets.map(() => 50));

  const updateVal = (idx: number, v: number) => {
    const next = vals.map((old, i) => (i === idx ? v : old));
    setVals(next);
    if (next.every((val, i) => Math.abs(val - targets[i]) <= tolerance)) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-4 px-2">
      <div className="text-center text-xs text-cyan-300 font-bold">
        各バーを目標マーカー位置 (±{tolerance}) へ揃えてください
      </div>
      {targets.map((tgt, i) => {
        const diff = Math.abs(vals[i] - tgt);
        const matched = diff <= tolerance;
        return (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs font-orbitron">
              <span className="text-slate-300">BAND #{i + 1}</span>
              <span className={matched ? "text-emerald-400 font-black" : "text-amber-300"}>
                {vals[i]} / 目標 {tgt} {matched ? "✓ SYNC" : ""}
              </span>
            </div>
            <div className="relative pt-2">
              <div
                className="absolute top-0 bottom-0 w-1 bg-amber-400 rounded pointer-events-none"
                style={{ left: `calc(${tgt}% - 2px)` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={vals[i]}
                onChange={(e) => updateVal(i, Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. SequenceMemoryGame (Simon + 1..10 Ordered Numbers)                      */
/* -------------------------------------------------------------------------- */

const SequenceMemoryGame: React.FC<{
  isOrderedNumbers: boolean;
  seqLength: number;
  speedScale: number;
  isLockedOut: () => boolean;
  onError: (msg: string) => void;
  onSuccess: () => void;
}> = ({ isOrderedNumbers, seqLength, speedScale, isLockedOut, onError, onSuccess }) => {
  const shuffledNums = useMemo(() => shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), []);
  const [nextNum, setNextNum] = useState(1);

  const sequence = useMemo(
    () => Array.from({ length: seqLength }, () => Math.floor(Math.random() * 9)),
    [seqLength]
  );
  const [phase, setPhase] = useState<"showing" | "input">("showing");
  const [litCell, setLitCell] = useState<number | null>(null);
  const [stepIdx, setStepIdx] = useState(0);

  const playSequence = useCallback(() => {
    setPhase("showing");
    setStepIdx(0);
    const intervalMs = Math.max(260, Math.round(520 / speedScale));
    sequence.forEach((cell, i) => {
      window.setTimeout(() => {
        setLitCell(cell);
        soundEngine.playClick();
      }, i * intervalMs);
      window.setTimeout(() => {
        setLitCell(null);
        if (i === sequence.length - 1) setPhase("input");
      }, i * intervalMs + Math.round(intervalMs * 0.65));
    });
  }, [sequence, speedScale]);

  useEffect(() => {
    if (!isOrderedNumbers) {
      const t = window.setTimeout(playSequence, 350);
      return () => window.clearTimeout(t);
    }
  }, [isOrderedNumbers, playSequence]);

  if (isOrderedNumbers) {
    return (
      <div className="space-y-3">
        <div className="text-center text-xs font-black text-cyan-300">
          次に押す番号: <span className="text-lg text-amber-300 font-orbitron">{nextNum}</span> / 10
        </div>
        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {shuffledNums.map((n) => {
            const done = n < nextNum;
            return (
              <button
                key={n}
                type="button"
                disabled={done}
                onClick={() => {
                  if (isLockedOut()) return;
                  if (n === nextNum) {
                    soundEngine.playClick();
                    if (n === 10) onSuccess();
                    else setNextNum(n + 1);
                  } else {
                    onError(`${nextNum} を先にタップしてください！`);
                  }
                }}
                className={`sf-btn h-14 rounded-xl font-orbitron font-black text-lg border ${
                  done
                    ? "bg-emerald-950/70 border-emerald-400 text-emerald-300 opacity-55"
                    : "bg-slate-800 hover:bg-slate-700 border-cyan-500/40 text-white"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs font-black text-cyan-300">
        {phase === "showing"
          ? "👀 点灯パターンを記憶中..."
          : `✨ 順番にタップ (${stepIdx} / ${sequence.length})`}
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {Array.from({ length: 9 }, (_, i) => {
          const lit = litCell === i;
          return (
            <button
              key={i}
              type="button"
              disabled={phase !== "input"}
              onClick={() => {
                if (phase !== "input" || isLockedOut()) return;
                if (sequence[stepIdx] === i) {
                  soundEngine.playClick();
                  setLitCell(i);
                  window.setTimeout(() => setLitCell(null), 180);
                  if (stepIdx + 1 >= sequence.length) {
                    onSuccess();
                  } else {
                    setStepIdx(stepIdx + 1);
                  }
                } else {
                  onError("順番が違います！最初から再生します");
                  window.setTimeout(playSequence, 500);
                }
              }}
              className={`w-16 h-16 rounded-2xl border-2 font-orbitron font-black transition ${
                lit
                  ? "bg-cyan-400 border-white text-slate-950 scale-95 shadow-[0_0_24px_rgba(34,211,238,0.8)]"
                  : "bg-slate-900 border-slate-700 hover:border-cyan-400 text-slate-500"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. AsteroidShootGame                                                       */
/* -------------------------------------------------------------------------- */

const AsteroidShootGame: React.FC<{
  targetCount: number;
  speedScale: number;
  onSuccess: () => void;
}> = ({ targetCount, speedScale, onSuccess }) => {
  const [destroyed, setDestroyed] = useState(0);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; vx: number; vy: number }[]>(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
      vx: (Math.random() > 0.5 ? 1 : -1) * (18 + Math.random() * 20),
      vy: (Math.random() > 0.5 ? 1 : -1) * (14 + Math.random() * 18),
    }))
  );
  const nextIdRef = useRef(5);

  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setTargets((prev) =>
        prev.map((t) => {
          let nx = t.x + t.vx * speedScale * dt;
          let ny = t.y + t.vy * speedScale * dt;
          let nvx = t.vx;
          let nvy = t.vy;
          if (nx < 8 || nx > 92) {
            nvx = -nvx;
            nx = Math.max(8, Math.min(92, nx));
          }
          if (ny < 12 || ny > 88) {
            nvy = -nvy;
            ny = Math.max(12, Math.min(88, ny));
          }
          return { ...t, x: nx, y: ny, vx: nvx, vy: nvy };
        })
      );
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speedScale]);

  const hit = (id: number) => {
    soundEngine.playClick();
    const nextCount = destroyed + 1;
    setDestroyed(nextCount);
    if (nextCount >= targetCount) {
      onSuccess();
      return;
    }
    const nid = nextIdRef.current++;
    setTargets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              id: nid,
              x: 12 + Math.random() * 76,
              y: 14 + Math.random() * 72,
              vx: (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 24),
              vy: (Math.random() > 0.5 ? 1 : -1) * (16 + Math.random() * 22),
            }
          : t
      )
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-black text-cyan-300">
        <span>🎯 接近目標をクリックして迎撃せよ</span>
        <span className="font-orbitron">
          {destroyed} / {targetCount}
        </span>
      </div>
      <div className="relative h-60 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 overflow-hidden select-none">
        {targets.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => hit(t.id)}
            style={{ left: `${t.x}%`, top: `${t.y}%`, transform: "translate(-50%, -50%)" }}
            className="absolute w-11 h-11 rounded-full bg-amber-900/80 border-2 border-amber-400 hover:scale-110 flex items-center justify-center text-lg shadow-lg"
          >
            ☄️
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. GaugeHoldGame                                                           */
/* -------------------------------------------------------------------------- */

const GaugeHoldGame: React.FC<{
  speedScale: number;
  toleranceScale: number;
  onSuccess: () => void;
}> = ({ speedScale, toleranceScale, onSuccess }) => {
  const [holding, setHolding] = useState(false);
  const [pressure, setPressure] = useState(25);
  const [charge, setCharge] = useState(0);
  const doneRef = useRef(false);

  const minZone = 55;
  const maxZone = Math.min(92, Math.round(55 + 24 * toleranceScale));

  useEffect(() => {
    const up = () => setHolding(false);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setPressure((prev) => {
        const delta = holding ? 46 * speedScale * dt : -32 * dt;
        const np = Math.max(0, Math.min(100, prev + delta));
        if (np >= minZone && np <= maxZone) {
          setCharge((c) => {
            const nc = Math.min(100, c + 48 * dt);
            if (nc >= 100 && !doneRef.current) {
              doneRef.current = true;
              onSuccess();
            }
            return nc;
          });
        }
        return np;
      });
      if (!doneRef.current) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [holding, speedScale, maxZone, onSuccess]);

  const inZone = pressure >= minZone && pressure <= maxZone;

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="text-xs text-slate-300 font-bold">
        緑の適正圧力ゾーン ({minZone}%〜{maxZone}%) に針を保って充填完了！
      </div>
      <div className="w-full max-w-md h-10 rounded-2xl bg-slate-900 border border-slate-700 relative overflow-hidden">
        <div
          className="absolute top-0 bottom-0 bg-emerald-500/30 border-x-2 border-emerald-400"
          style={{ left: `${minZone}%`, width: `${maxZone - minZone}%` }}
        />
        <div
          className={`absolute top-1 bottom-1 w-2 rounded-full transition-colors ${
            inZone ? "bg-emerald-300 shadow-[0_0_12px_#34d399]" : "bg-rose-400"
          }`}
          style={{ left: `calc(${pressure}% - 4px)` }}
        />
      </div>

      <button
        type="button"
        onPointerDown={() => setHolding(true)}
        className="sf-btn px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm touch-none select-none"
      >
        {holding ? "⚡ 圧力上昇中（離すと降下）" : "🔘 長押しして加圧"}
      </button>

      <div className="w-full max-w-sm space-y-1 text-center">
        <div className="h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden">
          <div className="h-full bg-amber-400 transition-all duration-75" style={{ width: `${charge}%` }} />
        </div>
        <div className="text-xs font-orbitron font-black text-amber-300 tabular-nums">
          FILL: {Math.round(charge)}%
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 7. SampleAnalyzeGame                                                       */
/* -------------------------------------------------------------------------- */

const SampleAnalyzeGame: React.FC<{
  count: number;
  spinSec: number;
  isLockedOut: () => boolean;
  onError: (msg: string) => void;
  onSuccess: () => void;
}> = ({ count, spinSec, isLockedOut, onError, onSuccess }) => {
  const anomalyIdx = useMemo(() => Math.floor(Math.random() * count), [count]);
  const [stage, setStage] = useState<"idle" | "spinning" | "ready">("idle");
  const [remain, setRemain] = useState(spinSec);

  useEffect(() => {
    if (stage !== "spinning") return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const rem = Math.max(0, spinSec - (now - t0) / 1000);
      setRemain(rem);
      if (rem <= 0) {
        setStage("ready");
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage, spinSec]);

  return (
    <div className="flex flex-col items-center gap-4 py-3">
      <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: count }, (_, i) => {
          const isBad = stage === "ready" && i === anomalyIdx;
          return (
            <button
              key={i}
              type="button"
              disabled={stage !== "ready"}
              onClick={() => {
                if (isLockedOut()) return;
                if (i === anomalyIdx) onSuccess();
                else onError("正常な検体です！赤い異常反応を選んでください");
              }}
              className={`sf-btn w-14 h-36 rounded-b-3xl rounded-t-xl border-2 flex flex-col items-center justify-end p-2 transition ${
                stage === "spinning" ? "animate-pulse" : ""
              } ${
                isBad
                  ? "bg-rose-600/75 border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.65)]"
                  : stage === "ready"
                    ? "bg-cyan-600/45 border-cyan-300"
                    : "bg-slate-800 border-slate-600"
              }`}
            >
              <span className="text-[10px] font-orbitron font-black text-white">#{i + 1}</span>
            </button>
          );
        })}
      </div>

      {stage === "idle" && (
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setStage("spinning");
          }}
          className="sf-btn px-7 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm"
        >
          🧪 遠心分離＆解析スタート
        </button>
      )}
      {stage === "spinning" && (
        <div className="text-sm font-orbitron font-black text-amber-300 tabular-nums">
          ANALYZING... {remain.toFixed(1)}s
        </div>
      )}
      {stage === "ready" && (
        <div className="text-xs font-black text-rose-300">
          赤い異常反応が出た試験管をタップして抽出せよ！
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 8. DialAlignGame                                                           */
/* -------------------------------------------------------------------------- */

const DialAlignGame: React.FC<{
  ringCount: number;
  toleranceDeg: number;
  onSuccess: () => void;
}> = ({ ringCount, toleranceDeg, onSuccess }) => {
  const [angles, setAngles] = useState<number[]>(() =>
    Array.from({ length: ringCount }, () => (Math.floor(Math.random() * 10) + 1) * 30)
  );

  const rotateDial = (idx: number, delta: number) => {
    soundEngine.playClick();
    const next = angles.map((a, i) => (i === idx ? (a + delta + 360) % 360 : a));
    setAngles(next);
    const allAligned = next.every((a) => Math.min(a, 360 - a) <= toleranceDeg);
    if (allAligned) onSuccess();
  };

  return (
    <div className="space-y-3">
      <div className="text-center text-xs text-cyan-300 font-bold">
        全ダイヤルのマーカーを真上 (0° ±{toleranceDeg}°) に合わせてください
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {angles.map((ang, i) => {
          const dist = Math.min(ang, 360 - ang);
          const ok = dist <= toleranceDeg;
          return (
            <div
              key={i}
              className={`rounded-2xl p-3 border flex flex-col items-center gap-2 ${
                ok ? "bg-emerald-950/45 border-emerald-400" : "bg-slate-900 border-slate-700"
              }`}
            >
              <div className="relative w-24 h-24 rounded-full border-4 border-slate-600 flex items-center justify-center">
                <div className="absolute -top-2 w-2 h-3 bg-amber-400 rounded" />
                <div
                  className="w-16 h-16 rounded-full border-2 border-cyan-400 flex items-start justify-center p-1 transition-transform"
                  style={{ transform: `rotate(${ang}deg)` }}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${ok ? "bg-emerald-400" : "bg-rose-400"}`} />
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => rotateDial(i, -15)}
                  className="sf-btn px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-black"
                >
                  ↺
                </button>
                <button
                  type="button"
                  onClick={() => rotateDial(i, 15)}
                  className="sf-btn px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-black"
                >
                  ↻
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 9. GridToggleGame (Always solvable Lights-Out!)                            */
/* -------------------------------------------------------------------------- */

const GridToggleGame: React.FC<{
  size: number;
  seed: number;
  onSuccess: () => void;
}> = ({ size, seed, onSuccess }) => {
  const [grid, setGrid] = useState<boolean[]>(() => {
    const arr = Array.from({ length: size * size }, () => true);
    const apply = (r: number, c: number) => {
      for (const [dr, dc] of [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          arr[nr * size + nc] = !arr[nr * size + nc];
        }
      }
    };
    const steps = 3 + (seed % 3);
    for (let k = 0; k < steps; k++) {
      const idx = (seed + k * 7 + k * k) % (size * size);
      apply(Math.floor(idx / size), idx % size);
    }
    if (arr.every(Boolean)) apply(0, 0);
    return arr;
  });

  const press = (r: number, c: number) => {
    soundEngine.playClick();
    const next = [...grid];
    for (const [dr, dc] of [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
        next[nr * size + nc] = !next[nr * size + nc];
      }
    }
    setGrid(next);
    if (next.every(Boolean)) onSuccess();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs text-cyan-300 font-bold">
        上下左右も反転する回路基板：すべてのノードを点灯（シアン）させよ！
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {grid.map((on, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => press(Math.floor(idx / size), idx % size)}
            className={`sf-btn w-14 h-14 rounded-2xl border-2 font-black text-sm transition ${
              on
                ? "bg-cyan-500/35 border-cyan-300 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                : "bg-slate-900 border-slate-700 text-slate-600"
            }`}
          >
            {on ? "ON" : "OFF"}
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 10. TrashSortGame                                                          */
/* -------------------------------------------------------------------------- */

const TRASH_ITEMS = [
  { icon: "🍌", name: "腐った食品", bin: "burn" as const },
  { icon: "🛢️", name: "空燃料缶", bin: "recycle" as const },
  { icon: "🧪", name: "廃液アンプル", bin: "burn" as const },
  { icon: "🔩", name: "チタン部品", bin: "recycle" as const },
  { icon: "📦", name: "破損段ボール", bin: "burn" as const },
  { icon: "🔋", name: "リチウム電池", bin: "recycle" as const },
];

const TrashSortGame: React.FC<{
  targetCount: number;
  isLockedOut: () => boolean;
  onError: (msg: string) => void;
  onSuccess: () => void;
}> = ({ targetCount, isLockedOut, onError, onSuccess }) => {
  const [idx, setIdx] = useState(0);
  const queue = useMemo(
    () => Array.from({ length: targetCount }, (_, i) => TRASH_ITEMS[(i * 3 + Math.floor(Math.random() * 6)) % TRASH_ITEMS.length]),
    [targetCount]
  );

  const cur = queue[idx];
  if (!cur) return null;

  const choose = (bin: "burn" | "recycle") => {
    if (isLockedOut()) return;
    if (cur.bin === bin) {
      soundEngine.playClick();
      if (idx + 1 >= queue.length) onSuccess();
      else setIdx(idx + 1);
    } else {
      onError("分別先が違います！");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="text-xs font-orbitron font-black text-cyan-300">
        REMAINING: {queue.length - idx}
      </div>
      <div className="w-44 h-36 rounded-3xl bg-slate-900 border-2 border-amber-400/50 flex flex-col items-center justify-center gap-2">
        <span className="text-5xl">{cur.icon}</span>
        <span className="text-xs font-black text-white">{cur.name}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        <button
          type="button"
          onClick={() => choose("burn")}
          className="sf-btn py-3.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900/70 border-2 border-rose-400 text-rose-100 font-black text-xs"
        >
          🔥 焼却・廃棄ダクト (食品/廃液/紙)
        </button>
        <button
          type="button"
          onClick={() => choose("recycle")}
          className="sf-btn py-3.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/70 border-2 border-emerald-400 text-emerald-100 font-black text-xs"
        >
          ♻️ リサイクル (金属/缶/電池)
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 11. PipeRotateGame (Guaranteed connected path with BFS flow check)         */
/* -------------------------------------------------------------------------- */

type PipeDirs = [number, number, number, number]; // [N, E, S, W]

function rotateDirs(dirs: PipeDirs, times: number): PipeDirs {
  let d = [...dirs] as PipeDirs;
  for (let t = 0; t < times % 4; t++) {
    d = [d[3], d[0], d[1], d[2]];
  }
  return d;
}

const PipeRotateGame: React.FC<{ size: number; seed: number; onSuccess: () => void }> = ({
  size,
  seed,
  onSuccess,
}) => {
  const [tiles, setTiles] = useState<{ base: PipeDirs; rot: number }[]>(() => {
    const N = size;
    const path: [number, number][] = [];
    let r = 0;
    let c = 0;
    path.push([r, c]);
    while (r < N - 1 || c < N - 1) {
      if (r === N - 1) c++;
      else if (c === N - 1) r++;
      else if (((seed + r * 3 + c * 5) % 2) === 0) c++;
      else r++;
      path.push([r, c]);
    }
    const baseGrid: PipeDirs[] = Array.from({ length: N * N }, () => [1, 0, 1, 0]);
    for (let i = 0; i < path.length; i++) {
      const [pr, pc] = path[i];
      const dirs: PipeDirs = [0, 0, 0, 0];
      if (i === 0) dirs[3] = 1; // West inlet
      if (i === path.length - 1) dirs[1] = 1; // East outlet
      if (i > 0) {
        const [ar, ac] = path[i - 1];
        if (ar < pr) dirs[0] = 1;
        if (ar > pr) dirs[2] = 1;
        if (ac < pc) dirs[3] = 1;
        if (ac > pc) dirs[1] = 1;
      }
      if (i < path.length - 1) {
        const [br, bc] = path[i + 1];
        if (br < pr) dirs[0] = 1;
        if (br > pr) dirs[2] = 1;
        if (bc < pc) dirs[3] = 1;
        if (bc > pc) dirs[1] = 1;
      }
      baseGrid[pr * N + pc] = dirs;
    }
    return baseGrid.map((base, idx) => ({
      base,
      rot: (idx % 3) + 1,
    }));
  });

  const computeConnected = useCallback(
    (cur: { base: PipeDirs; rot: number }[]) => {
      const N = size;
      const visited = new Set<number>();
      const dirs0 = rotateDirs(cur[0].base, cur[0].rot);
      if (!dirs0[3]) return { visited, solved: false };
      const q = [0];
      visited.add(0);
      while (q.length) {
        const idx = q.shift()!;
        const r = Math.floor(idx / N);
        const c = idx % N;
        const d = rotateDirs(cur[idx].base, cur[idx].rot);
        const moves: [number, number, number, number][] = [
          [-1, 0, 0, 2],
          [0, 1, 1, 3],
          [1, 0, 2, 0],
          [0, -1, 3, 1],
        ];
        for (const [dr, dc, outDir, inDir] of moves) {
          if (!d[outDir]) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
          const nIdx = nr * N + nc;
          if (visited.has(nIdx)) continue;
          const nd = rotateDirs(cur[nIdx].base, cur[nIdx].rot);
          if (nd[inDir]) {
            visited.add(nIdx);
            q.push(nIdx);
          }
        }
      }
      const endIdx = N * N - 1;
      const endDirs = rotateDirs(cur[endIdx].base, cur[endIdx].rot);
      return { visited, solved: visited.has(endIdx) && !!endDirs[1] };
    },
    [size]
  );

  const flow = useMemo(() => computeConnected(tiles), [tiles, computeConnected]);

  const rotateTile = (idx: number) => {
    soundEngine.playClick();
    const next = tiles.map((t, i) => (i === idx ? { ...t, rot: (t.rot + 1) % 4 } : t));
    setTiles(next);
    if (computeConnected(next).solved) onSuccess();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs text-cyan-300 font-bold">
        左上(IN)から右下(OUT)まで配管を繋いで通水させよ！
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-orbitron font-black text-emerald-300">IN →</span>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
          {tiles.map((t, idx) => {
            const d = rotateDirs(t.base, t.rot);
            const lit = flow.visited.has(idx);
            const col = lit ? "#22d3ee" : "#64748b";
            return (
              <button
                key={idx}
                type="button"
                onClick={() => rotateTile(idx)}
                className={`w-14 h-14 rounded-xl border-2 relative bg-slate-900 ${
                  lit ? "border-cyan-400" : "border-slate-700"
                }`}
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <circle cx="20" cy="20" r="5" fill={col} />
                  {d[0] ? <rect x="17" y="0" width="6" height="20" fill={col} /> : null}
                  {d[1] ? <rect x="20" y="17" width="20" height="6" fill={col} /> : null}
                  {d[2] ? <rect x="17" y="20" width="6" height="20" fill={col} /> : null}
                  {d[3] ? <rect x="0" y="17" width="20" height="6" fill={col} /> : null}
                </svg>
              </button>
            );
          })}
        </div>
        <span className="text-[10px] font-orbitron font-black text-amber-300">→ OUT</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 12. RhythmSyncGame                                                         */
/* -------------------------------------------------------------------------- */

const RhythmSyncGame: React.FC<{
  beats: number;
  speedScale: number;
  toleranceScale: number;
  isLockedOut: () => boolean;
  onError: (msg: string) => void;
  onSuccess: () => void;
}> = ({ beats, speedScale, toleranceScale, isLockedOut, onError, onSuccess }) => {
  const [hits, setHits] = useState(0);
  const [pos, setPos] = useState(0);
  const posRef = useRef(0);
  const halfWidth = Math.max(7, Math.round(12 * toleranceScale));

  useEffect(() => {
    let last = performance.now();
    let dir = 1;
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      posRef.current += dir * 95 * speedScale * dt;
      if (posRef.current >= 100) {
        posRef.current = 100;
        dir = -1;
      } else if (posRef.current <= 0) {
        posRef.current = 0;
        dir = 1;
      }
      setPos(posRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speedScale]);

  const strike = () => {
    if (isLockedOut()) return;
    if (Math.abs(posRef.current - 50) <= halfWidth) {
      soundEngine.playClick();
      const next = hits + 1;
      setHits(next);
      if (next >= beats) onSuccess();
    } else {
      onError("タイミングがズレました！");
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 py-3">
      <div className="text-xs font-orbitron font-black text-cyan-300">
        SYNC HITS: {hits} / {beats}
      </div>
      <div className="w-full max-w-md h-12 rounded-2xl bg-slate-900 border border-slate-700 relative overflow-hidden">
        <div
          className="absolute top-0 bottom-0 bg-emerald-500/35 border-x-2 border-emerald-400"
          style={{ left: `${50 - halfWidth}%`, width: `${halfWidth * 2}%` }}
        />
        <div
          className="absolute top-1 bottom-1 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee]"
          style={{ left: `calc(${pos}% - 5px)` }}
        />
      </div>
      <button
        type="button"
        onClick={strike}
        className="sf-btn px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-sm"
      >
        ⚡ 中央マーカーでシンク！
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 13. MazeTraceGame                                                          */
/* -------------------------------------------------------------------------- */

const MazeTraceGame: React.FC<{
  size: number;
  seed: number;
  isLockedOut: () => boolean;
  onError: (msg: string) => void;
  onSuccess: () => void;
}> = ({ size, seed, isLockedOut, onError, onSuccess }) => {
  const { checkpoints, hazards } = useMemo(() => {
    const N = size;
    const total = N * N;
    const cps: number[] = [0];
    if (N >= 4) {
      cps.push(Math.floor(N / 2) * N + 1);
      cps.push(1 * N + (N - 1));
    }
    cps.push(total - 1);
    const haz = new Set<number>();
    for (let i = 1; i < total - 1; i++) {
      if (!cps.includes(i) && ((i + seed) % 4 === 0)) {
        haz.add(i);
      }
    }
    return { checkpoints: cps, hazards: haz };
  }, [size, seed]);

  const [cpIdx, setCpIdx] = useState(0);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs text-cyan-300 font-bold">
        赤い危険地帯を避け、番号ポイント (1 → {checkpoints.length}) を順番にクリック！
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {Array.from({ length: size * size }, (_, idx) => {
          const cpOrder = checkpoints.indexOf(idx);
          const isHazard = hazards.has(idx);
          const done = cpOrder >= 0 && cpOrder < cpIdx;
          const isNext = cpOrder === cpIdx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (isLockedOut()) return;
                if (isHazard) {
                  onError("危険マスに触れました！");
                  return;
                }
                if (isNext) {
                  soundEngine.playClick();
                  if (cpIdx + 1 >= checkpoints.length) onSuccess();
                  else setCpIdx(cpIdx + 1);
                }
              }}
              className={`w-12 h-12 rounded-xl border-2 font-orbitron font-black text-xs transition ${
                isHazard
                  ? "bg-rose-950/75 border-rose-500 text-rose-300"
                  : done
                    ? "bg-emerald-500/40 border-emerald-400 text-emerald-200"
                    : isNext
                      ? "bg-amber-400 text-slate-950 border-white animate-pulse"
                      : cpOrder > cpIdx
                        ? "bg-cyan-950/60 border-cyan-400 text-cyan-200"
                        : "bg-slate-900 border-slate-800 text-slate-600"
              }`}
            >
              {isHazard ? "✕" : cpOrder >= 0 ? cpOrder + 1 : "·"}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 14. RadarLockGame                                                          */
/* -------------------------------------------------------------------------- */

const RadarLockGame: React.FC<{
  targetCount: number;
  speedScale: number;
  toleranceScale: number;
  isLockedOut: () => boolean;
  onError: (msg: string) => void;
  onSuccess: () => void;
}> = ({ targetCount, speedScale, toleranceScale, isLockedOut, onError, onSuccess }) => {
  const [locks, setLocks] = useState(0);
  const [blip, setBlip] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = ((now - t0) / 1000) * speedScale * 1.45;
      setBlip({
        x: 50 + Math.sin(t * 1.7) * 34,
        y: 50 + Math.cos(t * 1.3) * 34,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speedScale]);

  const tol = 18 * toleranceScale;

  const tryLock = () => {
    if (isLockedOut()) return;
    const d = Math.hypot(blip.x - 50, blip.y - 50);
    if (d <= tol) {
      soundEngine.playClick();
      const next = locks + 1;
      setLocks(next);
      if (next >= targetCount) onSuccess();
    } else {
      onError("照準サークル外です！中央に入った瞬間にロック！");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-xs font-orbitron font-black text-cyan-300">
        RADAR LOCKS: {locks} / {targetCount}
      </div>
      <div className="relative w-52 h-52 rounded-full bg-slate-950 border-2 border-emerald-400/60 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-cyan-300"
          style={{ width: `${tol * 2}%`, height: `${tol * 2}%` }}
        />
        <div
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400 shadow-[0_0_12px_#fb7185]"
          style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
        />
      </div>
      <button
        type="button"
        onClick={tryLock}
        className="sf-btn px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm"
      >
        📡 捕捉ロックオン！
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 15. CipherDecodeGame                                                       */
/* -------------------------------------------------------------------------- */

const CipherDecodeGame: React.FC<{
  hint: string;
  answer: string;
  isLockedOut: () => boolean;
  onError: (msg: string) => void;
  onSuccess: () => void;
}> = ({ hint, answer, isLockedOut, onError, onSuccess }) => {
  const [typed, setTyped] = useState("");
  const letters = useMemo(() => {
    const base = new Set(answer.split(""));
    const extras = ["A", "E", "I", "O", "R", "S", "T", "N", "X", "V"];
    for (const ch of extras) {
      if (base.size >= 8) break;
      base.add(ch);
    }
    return shuffle([...base]);
  }, [answer]);

  const pickLetter = (ch: string) => {
    if (isLockedOut()) return;
    soundEngine.playClick();
    const next = typed + ch;
    if (next.length >= answer.length) {
      if (next === answer) {
        setTyped(next);
        onSuccess();
      } else {
        onError(`復号誤り！対応表をもう一度確認してください (${next})`);
        setTyped("");
      }
    } else {
      setTyped(next);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-amber-400/50 text-center space-y-1">
        <div className="text-[10px] font-bold text-amber-300">記号デコード対応表（左から順に復号）</div>
        <div className="font-mono text-sm sm:text-base font-black text-white tracking-wider">{hint}</div>
      </div>

      <div className="px-6 py-2 rounded-xl bg-slate-950 border border-cyan-500/50 font-orbitron font-black text-2xl tracking-[0.3em] text-cyan-300">
        {typed.padEnd(answer.length, "_")}
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {letters.map((ch) => (
          <button
            key={ch}
            type="button"
            onClick={() => pickLetter(ch)}
            className="sf-btn w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-orbitron font-black text-base text-white"
          >
            {ch}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setTyped("")}
          className="sf-btn px-4 h-12 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 font-black text-xs"
        >
          消去
        </button>
      </div>
    </div>
  );
};
