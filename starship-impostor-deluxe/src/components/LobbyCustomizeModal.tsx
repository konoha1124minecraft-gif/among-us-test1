import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  drawPlayer,
  getHatPreviewUrl,
  getPetPreviewUrl,
  getSkinPreviewUrl,
  getVisorPreviewUrl,
} from "../game/canvasRenderer";
import {
  HATS,
  KILL_EFFECTS,
  NAMEPLATES,
  PETS,
  PLAYER_COLORS,
  PLAYER_SKINS,
  VISORS,
  isCosmeticUnlocked,
} from "../game/constants";
import type { PlayerState, ProgressionData } from "../game/types";

interface LobbyCustomizeModalProps {
  open: boolean;
  myId: string;
  myName: string;
  myColor: string;
  mySkin: string;
  myHat: string;
  myVisor: string;
  myPet: string;
  myNameplate: string;
  myKillEffect: string;
  players: Record<string, PlayerState>;
  progression: ProgressionData;
  onChangeName: (name: string) => void;
  onChangeColor: (colorId: string) => void;
  onChangeSkin: (skinId: string) => void;
  onChangeHat: (hatId: string) => void;
  onChangeVisor: (visorId: string) => void;
  onChangePet: (petId: string) => void;
  onChangeNameplate: (nameplateId: string) => void;
  onChangeKillEffect: (effectId: string) => void;
  onToggleSandbox: () => void;
  onOpenShop: () => void;
  onClose: () => void;
}

export const LobbyCustomizeModal: React.FC<LobbyCustomizeModalProps> = ({
  open,
  myId,
  myName,
  myColor,
  mySkin,
  myHat,
  myVisor,
  myPet,
  myNameplate,
  myKillEffect,
  players,
  progression,
  onChangeName,
  onChangeColor,
  onChangeSkin,
  onChangeHat,
  onChangeVisor,
  onChangePet,
  onChangeNameplate,
  onChangeKillEffect,
  onToggleSandbox,
  onOpenShop,
  onClose,
}) => {
  const [tab, setTab] = useState<"color" | "skin" | "hat" | "visor" | "pet" | "nameplate" | "kill">("color");
  const previewRef = useRef<HTMLCanvasElement | null>(null);

  const takenColorsMap = useMemo(() => {
    const map = new Map<string, string>();
    Object.values(players).forEach((p) => {
      if (p.id !== myId && !p.isSpectator) map.set(p.color, p.name);
    });
    return map;
  }, [players, myId]);

  const activeHex = useMemo(
    () => (PLAYER_COLORS.find((c) => c.id === myColor) || PLAYER_COLORS[0]).hex,
    [myColor]
  );

  const skinPreviews = useMemo(() => {
    const out: Record<string, string> = {};
    PLAYER_SKINS.forEach((s) => {
      out[s.id] = getSkinPreviewUrl(s.id, myColor);
    });
    return out;
  }, [myColor]);

  const hatPreviews = useMemo(() => {
    const out: Record<string, string> = {};
    HATS.forEach((h) => {
      out[h.id] = getHatPreviewUrl(h.id, activeHex);
    });
    return out;
  }, [activeHex]);

  const visorPreviews = useMemo(() => {
    const out: Record<string, string> = {};
    VISORS.forEach((v) => {
      out[v.id] = getVisorPreviewUrl(v.id);
    });
    return out;
  }, []);

  const petPreviews = useMemo(() => {
    const out: Record<string, string> = {};
    PETS.forEach((p) => {
      out[p.id] = getPetPreviewUrl(p.id, myColor);
    });
    return out;
  }, [myColor]);

  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const render = (now: number) => {
      const c = previewRef.current;
      if (c) {
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, c.width, c.height);
          const g = ctx.createRadialGradient(88, 78, 8, 88, 78, 66);
          g.addColorStop(0, `${activeHex}44`);
          g.addColorStop(1, "rgba(2, 6, 23, 0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.save();
          ctx.translate(92, 86);
          ctx.scale(1.65, 1.65);
          drawPlayer(
            ctx,
            0,
            Math.sin(now * 0.004) * 2.5,
            myColor,
            myHat,
            1,
            true,
            false,
            1,
            false,
            now,
            myPet,
            mySkin,
            undefined,
            myVisor
          );
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [open, myColor, myHat, myVisor, myPet, mySkin, activeHex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="sf-panel w-full max-w-5xl max-h-[92vh] rounded-3xl p-4 sm:p-6 flex flex-col gap-3.5 border-2 border-cyan-400/60 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-cyan-300 flex items-center gap-2">
              <span>🎨 リアルタイム外見カスタマイズ端末</span>
              <span className="px-2.5 py-0.5 rounded-xl bg-amber-500/20 border border-amber-400/50 font-orbitron text-xs text-amber-200">
                🫘 {progression.beans.toLocaleString()} 豆
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              他メンバーが使用中のカラーは自動ロックされます。変更は即座に全員へ同期されます。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenShop();
              }}
              className="sf-btn min-h-[38px] px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs whitespace-nowrap"
            >
              🛒 ショップ / キューブを開く
            </button>
            <button
              type="button"
              onClick={onToggleSandbox}
              className={`sf-btn min-h-[38px] px-3 rounded-xl border text-[11px] font-bold whitespace-nowrap ${
                progression.sandboxUnlockAll
                  ? "bg-emerald-950/75 border-emerald-400 text-emerald-200"
                  : "bg-slate-900 border-slate-700 text-slate-300"
              }`}
            >
              {progression.sandboxUnlockAll ? "🔓 試着解放 ON" : "🔒 試着解放"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="sf-btn min-h-[40px] px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs whitespace-nowrap"
            >
              ✓ 完了して閉じる
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
          <div className="w-[176px] h-[142px] rounded-2xl bg-slate-950/90 border border-slate-700/80 flex items-center justify-center shrink-0 relative overflow-hidden">
            <canvas ref={previewRef} width={176} height={142} className="w-full h-full block" />
            <span className="absolute bottom-1.5 right-2 text-[9px] font-orbitron text-cyan-300/70">LIVE SYNC</span>
          </div>
          <div className="flex-1 w-full space-y-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">プレイヤー名</label>
              <input
                type="text"
                maxLength={12}
                value={myName}
                onChange={(e) => onChangeName(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-full min-h-[40px] rounded-xl bg-slate-900 border border-slate-600 focus:border-cyan-400 focus:outline-none px-3.5 text-sm font-bold text-white"
              />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-[11px]">
              {[
                ["カラー", PLAYER_COLORS.find((c) => c.id === myColor)?.name || myColor],
                ["スキン", PLAYER_SKINS.find((s) => s.id === mySkin)?.name || "標準宇宙服"],
                ["ハット", HATS.find((h) => h.id === myHat)?.name || "なし"],
                ["バイザー", VISORS.find((v) => v.id === myVisor)?.name || "なし"],
                ["ペット", PETS.find((p) => p.id === myPet)?.name || "ペットなし"],
                ["プレート", NAMEPLATES.find((n) => n.id === myNameplate)?.name || "スタンダード"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-slate-900/85 border border-slate-800 px-2 py-1.5">
                  <div className="text-[9px] text-slate-400">{k}</div>
                  <div className="font-bold text-white truncate">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2.5 shrink-0">
          {[
            ["color", `🎨 カラー (${PLAYER_COLORS.length})`],
            ["skin", `🦺 スキン (${PLAYER_SKINS.length})`],
            ["hat", `🎩 ハット (${HATS.length})`],
            ["visor", `🕶️ バイザー (${VISORS.length})`],
            ["pet", `🐾 ペット (${PETS.length})`],
            ["nameplate", `🪪 プレート (${NAMEPLATES.length})`],
            ["kill", `💥 キル演出 (${KILL_EFFECTS.length})`],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id as typeof tab)}
              className={`sf-btn min-h-[34px] px-2.5 py-1 rounded-xl text-xs font-black border whitespace-nowrap ${
                tab === id
                  ? "bg-cyan-500 text-slate-950 border-cyan-300"
                  : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {tab === "color" && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {PLAYER_COLORS.map((c) => {
                const selected = myColor === c.id;
                const takenBy = takenColorsMap.get(c.id);
                const unlocked = isCosmeticUnlocked("color", c.id, progression);
                const disabled = !!takenBy || !unlocked;
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && onChangeColor(c.id)}
                    className={`sf-btn rounded-xl p-2 border-2 flex flex-col items-center gap-1 transition ${
                      selected
                        ? "border-white bg-cyan-950/75 ring-2 ring-cyan-400"
                        : disabled
                          ? "border-slate-800 bg-slate-950/75 opacity-45 cursor-not-allowed"
                          : "border-slate-700 bg-slate-900/90 hover:border-slate-400"
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-full border-2 border-white/70 flex items-center justify-center text-xs font-black text-white shadow"
                      style={{ background: c.hex }}
                    >
                      {selected ? "✓" : takenBy ? "🔒" : !unlocked ? "🔒" : ""}
                    </div>
                    <div className="text-[11px] font-bold text-white truncate max-w-full">{c.name}</div>
                    {takenBy && <div className="text-[9px] text-amber-300 truncate max-w-full">使用中: {takenBy}</div>}
                  </button>
                );
              })}
            </div>
          )}

          {tab === "skin" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {PLAYER_SKINS.map((sk) => {
                const unlocked = isCosmeticUnlocked("skin", sk.id, progression);
                const selected = mySkin === sk.id;
                return (
                  <button
                    key={sk.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => unlocked && onChangeSkin(sk.id)}
                    className={`sf-btn rounded-2xl p-2.5 border text-left space-y-1 transition ${
                      selected
                        ? "bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400/60"
                        : unlocked
                          ? "bg-slate-900/90 border-slate-700 hover:border-slate-500"
                          : "bg-slate-950/75 border-slate-800 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={skinPreviews[sk.id]} alt={sk.name} className="w-10 h-10 object-contain shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-xs text-white truncate">{sk.name}</div>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 font-orbitron text-[9px] text-cyan-300">
                          {sk.badge}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">{sk.desc}</p>
                    {!unlocked && (
                      <div className="text-[9px] text-amber-300 font-bold">
                        {sk.priceBeans ? `🔒 ショップ 🫘${sk.priceBeans}` : "🔒 Cosmicube限定"}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {tab === "hat" && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {HATS.map((h) => {
                const unlocked = isCosmeticUnlocked("hat", h.id, progression);
                const selected = myHat === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => unlocked && onChangeHat(h.id)}
                    className={`sf-btn rounded-xl p-1.5 border flex flex-col items-center justify-center gap-0.5 text-center ${
                      selected
                        ? "bg-cyan-950/80 border-cyan-400 ring-1 ring-cyan-400"
                        : unlocked
                          ? "bg-slate-900/90 border-slate-700 hover:border-slate-500"
                          : "bg-slate-950/75 border-slate-800 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <img src={hatPreviews[h.id]} alt={h.name} className="w-10 h-10 object-contain" />
                    <span className="text-[10px] font-bold text-slate-200 truncate w-full">{h.name}</span>
                    {!unlocked && (
                      <span className="text-[9px] text-amber-300 truncate w-full">
                        {h.priceBeans ? `🔒 🫘${h.priceBeans}` : h.unlockReq ? `🔒 ${h.unlockReq}` : "🔒 キューブ"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {tab === "visor" && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {VISORS.map((v) => {
                const unlocked = isCosmeticUnlocked("visor", v.id, progression);
                const selected = myVisor === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => unlocked && onChangeVisor(v.id)}
                    className={`sf-btn rounded-xl p-2 border flex flex-col items-center gap-1 text-center ${
                      selected
                        ? "bg-cyan-950/80 border-cyan-400 ring-1 ring-cyan-400"
                        : unlocked
                          ? "bg-slate-900/90 border-slate-700 hover:border-slate-500"
                          : "bg-slate-950/75 border-slate-800 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <img src={visorPreviews[v.id]} alt={v.name} className="w-11 h-11 object-contain" />
                    <span className="text-[10px] font-black text-white truncate w-full">{v.name}</span>
                    {!unlocked && (
                      <span className="text-[9px] text-amber-300 truncate w-full">
                        {v.priceBeans ? `🔒 🫘${v.priceBeans}` : "🔒 Cosmicube"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {tab === "pet" && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {PETS.map((p) => {
                const unlocked = isCosmeticUnlocked("pet", p.id, progression);
                const selected = myPet === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => unlocked && onChangePet(p.id)}
                    className={`sf-btn rounded-xl p-2 border flex flex-col items-center gap-1 ${
                      selected
                        ? "bg-emerald-950/80 border-emerald-400 ring-1 ring-emerald-400"
                        : unlocked
                          ? "bg-slate-900/90 border-slate-700 hover:border-slate-500"
                          : "bg-slate-950/75 border-slate-800 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <img src={petPreviews[p.id]} alt={p.name} className="w-11 h-11 object-contain" />
                    <span className="text-[10px] font-bold text-slate-200 truncate w-full text-center">
                      {p.name}
                    </span>
                    {!unlocked && (
                      <span className="text-[9px] text-amber-300 truncate w-full text-center">
                        {p.priceBeans ? `🔒 🫘${p.priceBeans}` : p.unlockReq ? `🔒 ${p.unlockReq}` : "🔒 キューブ"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {tab === "nameplate" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {NAMEPLATES.map((np) => {
                const unlocked = isCosmeticUnlocked("nameplate", np.id, progression);
                const selected = myNameplate === np.id;
                return (
                  <button
                    key={np.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => unlocked && onChangeNameplate(np.id)}
                    className={`sf-btn rounded-2xl p-3 border-2 text-left space-y-1.5 transition ${
                      selected
                        ? "ring-2 ring-cyan-400"
                        : unlocked
                          ? "hover:brightness-110"
                          : "opacity-50 cursor-not-allowed"
                    }`}
                    style={{
                      background: np.bgGradient,
                      borderColor: selected ? "#22d3ee" : np.borderColor,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-xs text-white flex items-center gap-1.5">
                        <span>{np.accentEmoji}</span>
                        <span>{np.name}</span>
                      </span>
                      {selected && <span className="text-[10px] font-black text-cyan-300">✓ 装備中</span>}
                    </div>
                    <p className="text-[10px] text-slate-300">{np.desc}</p>
                    {!unlocked && (
                      <div className="text-[9px] text-amber-300 font-bold">
                        {np.priceBeans ? `🔒 ショップ 🫘${np.priceBeans}` : "🔒 Cosmicube限定"}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {tab === "kill" && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {KILL_EFFECTS.map((k) => {
                const unlocked = isCosmeticUnlocked("kill", k.id, progression);
                const selected = myKillEffect === k.id;
                return (
                  <button
                    key={k.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => unlocked && onChangeKillEffect(k.id)}
                    className={`sf-btn rounded-xl p-3 border text-left space-y-1 ${
                      selected
                        ? "bg-rose-950/80 border-rose-400 ring-1 ring-rose-400"
                        : unlocked
                          ? "bg-slate-900/90 border-slate-700 hover:border-slate-500"
                          : "bg-slate-950/75 border-slate-800 opacity-45 cursor-not-allowed"
                    }`}
                  >
                    <div className="text-xl">{k.icon}</div>
                    <div className="text-xs font-black text-white">{k.name}</div>
                    {"unlockReq" in k && k.unlockReq && !unlocked && (
                      <div className="text-[9px] text-rose-300">🔒 {k.unlockReq}</div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
