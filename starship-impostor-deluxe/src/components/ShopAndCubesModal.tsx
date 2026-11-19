import React, { useMemo, useState } from "react";
import { soundEngine } from "../game/audio";
import {
  getHatPreviewUrl,
  getPetPreviewUrl,
  getSkinPreviewUrl,
  getVisorPreviewUrl,
} from "../game/canvasRenderer";
import {
  COSMICUBES,
  HATS,
  NAMEPLATES,
  PETS,
  PLAYER_SKINS,
  VISORS,
  isCosmeticUnlocked,
  makeItemKey,
} from "../game/constants";
import type { CosmeticBaseDef, CosmicubeNodeDef, ProgressionData } from "../game/types";

type ShopItemKind = "hat" | "skin" | "visor" | "pet" | "nameplate";

interface ShopAndCubesModalProps {
  open: boolean;
  progression: ProgressionData;
  myColor: string;
  onPurchaseItem: (kind: ShopItemKind, id: string, costBeans: number) => void;
  onUnlockCube: (cubeId: string, costBeans: number) => void;
  onActivateCube: (cubeId: string) => void;
  onUnlockCubeNode: (cubeId: string, node: CosmicubeNodeDef) => void;
  onEquipItem: (kind: ShopItemKind, id: string) => void;
  onClose: () => void;
}

const THEME_LABELS: Record<NonNullable<CosmeticBaseDef["theme"]>, string> = {
  starter: "初期",
  shop: "🛒 ショップ",
  halloween: "🎃 ハロウィン",
  christmas: "🎄 クリスマス",
  bundle: "🎁 バンドル",
  cube: "🧊 キューブ",
};

export const ShopAndCubesModal: React.FC<ShopAndCubesModalProps> = ({
  open,
  progression,
  myColor,
  onPurchaseItem,
  onUnlockCube,
  onActivateCube,
  onUnlockCubeNode,
  onEquipItem,
  onClose,
}) => {
  const [tab, setTab] = useState<ShopItemKind | "cubes">("hat");
  const [selectedCubeId, setSelectedCubeId] = useState<string>(
    progression.activeCubeId || COSMICUBES[0].id
  );
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  const realProg = useMemo(
    () => ({ ...progression, sandboxUnlockAll: false }),
    [progression]
  );

  const previewColorHex = "#38fedc";

  const hatPreviews = useMemo(() => {
    const map: Record<string, string> = {};
    HATS.forEach((h) => {
      map[h.id] = getHatPreviewUrl(h.id, previewColorHex);
    });
    return map;
  }, []);

  const skinPreviews = useMemo(() => {
    const map: Record<string, string> = {};
    PLAYER_SKINS.forEach((s) => {
      map[s.id] = getSkinPreviewUrl(s.id, myColor || "gray");
    });
    return map;
  }, [myColor]);

  const visorPreviews = useMemo(() => {
    const map: Record<string, string> = {};
    VISORS.forEach((v) => {
      map[v.id] = getVisorPreviewUrl(v.id);
    });
    return map;
  }, []);

  const petPreviews = useMemo(() => {
    const map: Record<string, string> = {};
    PETS.forEach((p) => {
      map[p.id] = getPetPreviewUrl(p.id, myColor || "cyan");
    });
    return map;
  }, [myColor]);

  if (!open) return null;

  const showNotice = (text: string, ok: boolean) => {
    setNotice({ text, ok });
    window.setTimeout(() => {
      setNotice((cur) => (cur?.text === text ? null : cur));
    }, 2600);
  };

  const handleBuyItem = (kind: ShopItemKind, id: string, name: string, cost: number) => {
    if (progression.beans < cost) {
      soundEngine.playError();
      showNotice(`豆通貨が足りません！（あと ${cost - progression.beans} 🫘 必要）`, false);
      return;
    }
    soundEngine.playPurchase();
    onPurchaseItem(kind, id, cost);
    showNotice(`「${name}」を購入しました！`, true);
  };

  const handleBuyCube = (cubeId: string, name: string, cost: number) => {
    if (progression.beans < cost) {
      soundEngine.playError();
      showNotice(`Cosmicube解放にはあと ${cost - progression.beans} 🫘 必要です`, false);
      return;
    }
    soundEngine.playUnlock();
    onUnlockCube(cubeId, cost);
    showNotice(`🧊「${name}」を解放しました！`, true);
  };

  const handleBuyNode = (cubeId: string, node: CosmicubeNodeDef) => {
    if (progression.beans < node.costBeans) {
      soundEngine.playError();
      showNotice(`ノード解放にあと ${node.costBeans - progression.beans} 🫘 必要です`, false);
      return;
    }
    soundEngine.playUnlock();
    onUnlockCubeNode(cubeId, node);
    showNotice(`✨「${node.title}」をアンロックしました！`, true);
  };

  const activeCube = COSMICUBES.find((c) => c.id === selectedCubeId) || COSMICUBES[0];
  const activeCubeOwned = progression.unlockedCubes.includes(activeCube.id);
  const activeCubeIsCurrent = progression.activeCubeId === activeCube.id;

  const getRewardPreview = (kind: CosmicubeNodeDef["rewardKind"], rewardId: string): string => {
    if (kind === "hat") return hatPreviews[rewardId] || "";
    if (kind === "skin") return skinPreviews[rewardId] || "";
    if (kind === "visor") return visorPreviews[rewardId] || "";
    if (kind === "pet") return petPreviews[rewardId] || "";
    return "";
  };

  const renderShopGrid = (kind: ShopItemKind) => {
    const rawList: Array<
      CosmeticBaseDef & {
        desc?: string;
        badge?: string;
        bgGradient?: string;
        borderColor?: string;
        accentEmoji?: string;
      }
    > =
      kind === "hat"
        ? HATS
        : kind === "skin"
          ? PLAYER_SKINS
          : kind === "visor"
            ? VISORS
            : kind === "pet"
              ? PETS
              : NAMEPLATES;

    // Prioritize purchasable items, then seasonal/bundle/cube exclusives (skip "none" / free starters unless helpful)
    const items = rawList.filter((item) => item.id !== "none" && (!item.free || item.priceBeans));

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {items.map((item) => {
          const owned =
            progression.unlockedItems.includes(makeItemKey(kind, item.id)) ||
            isCosmeticUnlocked(kind, item.id, realProg);
          const price = item.priceBeans ?? 0;
          const isCubeReward = item.theme === "cube";
          const imgUrl =
            kind === "hat"
              ? hatPreviews[item.id]
              : kind === "skin"
                ? skinPreviews[item.id]
                : kind === "visor"
                  ? visorPreviews[item.id]
                  : kind === "pet"
                    ? petPreviews[item.id]
                    : "";

          return (
            <div
              key={item.id}
              className={`rounded-2xl p-3 border flex flex-col justify-between gap-2 transition ${
                owned
                  ? "bg-emerald-950/35 border-emerald-500/50"
                  : "bg-slate-900/95 border-slate-700/80 hover:border-amber-400/60"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-300 font-bold">
                    {THEME_LABELS[item.theme || "shop"]}
                  </span>
                  {owned && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black">
                      所持済
                    </span>
                  )}
                </div>

                {kind === "nameplate" ? (
                  <div
                    className="w-full h-14 rounded-xl border-2 flex items-center justify-center gap-2 px-2 shadow-inner"
                    style={{
                      background: item.bgGradient,
                      borderColor: item.borderColor || "#334155",
                    }}
                  >
                    <span className="text-lg">{item.accentEmoji}</span>
                    <span className="text-[11px] font-black text-white truncate">{item.name}</span>
                  </div>
                ) : (
                  <div className="w-full h-14 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-center overflow-hidden">
                    {imgUrl && <img src={imgUrl} alt={item.name} className="w-12 h-12 object-contain" />}
                  </div>
                )}

                <div>
                  <div className="text-xs font-black text-white truncate">{item.name}</div>
                  {item.desc && (
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-snug mt-0.5">{item.desc}</p>
                  )}
                </div>
              </div>

              {owned ? (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    onEquipItem(kind, item.id);
                    showNotice(`「${item.name}」を装備しました！`, true);
                  }}
                  className="sf-btn w-full py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[11px]"
                >
                  ✓ 装備する
                </button>
              ) : price > 0 ? (
                <button
                  type="button"
                  onClick={() => handleBuyItem(kind, item.id, item.name, price)}
                  className={`sf-btn w-full py-1.5 rounded-xl font-black text-[11px] border transition ${
                    progression.beans >= price
                      ? "bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-200"
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:border-rose-400/50"
                  }`}
                >
                  🫘 {price} 購入
                </button>
              ) : isCubeReward ? (
                <button
                  type="button"
                  onClick={() => setTab("cubes")}
                  className="sf-btn w-full py-1.5 rounded-xl bg-purple-950/70 border border-purple-400/50 text-purple-200 font-bold text-[10px]"
                >
                  🧊 Cosmicubeで解放
                </button>
              ) : (
                <div className="w-full py-1.5 px-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-amber-300 text-center font-bold">
                  🏆 {item.unlockReq || "実績で解放"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/88 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-5"
      onClick={onClose}
    >
      <div
        className="sf-panel w-full max-w-5xl h-[90vh] max-h-[820px] rounded-3xl p-4 sm:p-6 border-2 border-amber-400/60 flex flex-col gap-3.5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 flex items-center gap-2">
              <span>🛒 ショップ & COSMICUBES</span>
              <span className="px-2.5 py-0.5 rounded-xl bg-amber-500/20 border border-amber-400/60 font-orbitron text-xs text-amber-200 tabular-nums">
                🫘 {progression.beans.toLocaleString()} 豆
              </span>
              <span className="px-2 py-0.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 font-orbitron text-[11px] text-cyan-200">
                Lv.{progression.level}
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              試合完了で獲得した豆通貨を使い、装飾品・限定セット・ツリー型Cosmicubeをアンロックできます。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="sf-btn px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-black text-white"
          >
            ✕ 閉じる
          </button>
        </div>

        {/* Toast / Warning Notice */}
        {notice && (
          <div
            className={`px-3.5 py-2 rounded-xl border text-xs font-black shrink-0 ${
              notice.ok
                ? "bg-emerald-950/80 border-emerald-400 text-emerald-200"
                : "bg-rose-950/85 border-rose-500 text-rose-200"
            }`}
          >
            {notice.text}
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {(
            [
              ["hat", "🎩 ハット"],
              ["skin", "🦺 スキン"],
              ["visor", "🕶️ バイザー"],
              ["pet", "🐾 ペット"],
              ["nameplate", "🪪 プレート"],
              ["cubes", "🧊 Cosmicubes (4)"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`sf-btn px-3 py-1.5 rounded-xl border text-xs font-black whitespace-nowrap ${
                tab === id
                  ? id === "cubes"
                    ? "bg-gradient-to-r from-purple-500 to-cyan-400 text-slate-950 border-white"
                    : "bg-amber-400 text-slate-950 border-amber-200"
                  : "bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {tab !== "cubes" ? (
            renderShopGrid(tab)
          ) : (
            <div className="space-y-4">
              {/* Cube Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {COSMICUBES.map((cube) => {
                  const owned = progression.unlockedCubes.includes(cube.id);
                  const isActive = progression.activeCubeId === cube.id;
                  const unlockedCount = cube.nodes.filter((n) =>
                    progression.unlockedCubeNodes.includes(n.id)
                  ).length;
                  const selected = activeCube.id === cube.id;

                  return (
                    <div
                      key={cube.id}
                      onClick={() => setSelectedCubeId(cube.id)}
                      className={`rounded-2xl p-3 border-2 cursor-pointer transition flex flex-col justify-between gap-2 ${
                        selected
                          ? "bg-slate-900 ring-2 ring-white/40"
                          : "bg-slate-950/90 hover:bg-slate-900/90"
                      }`}
                      style={{ borderColor: selected ? cube.accent : "rgba(51,65,85,0.8)" }}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xl">{cube.icon}</span>
                          <span className="font-orbitron text-[10px] font-black px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                            {unlockedCount} / {cube.nodes.length}
                          </span>
                        </div>
                        <div className="text-xs font-black text-white">{cube.name}</div>
                        <p className="text-[10px] text-slate-400 leading-snug">{cube.subtitle}</p>
                      </div>

                      {owned ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundEngine.playClick();
                            onActivateCube(cube.id);
                            setSelectedCubeId(cube.id);
                          }}
                          className={`sf-btn w-full py-1.5 rounded-xl text-[11px] font-black ${
                            isActive
                              ? "bg-emerald-500 text-slate-950"
                              : "bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-cyan-500/50"
                          }`}
                        >
                          {isActive ? "🟢 アクティブ中" : "⚡ 有効化する"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCubeId(cube.id);
                            handleBuyCube(cube.id, cube.name, cube.priceBeans);
                          }}
                          className={`sf-btn w-full py-1.5 rounded-xl text-[11px] font-black ${
                            progression.beans >= cube.priceBeans
                              ? "bg-amber-400 hover:bg-amber-300 text-slate-950"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          🫘 {cube.priceBeans.toLocaleString()} で解放
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Interactive Tree Canvas for Selected Cosmicube */}
              <div
                className="rounded-3xl bg-slate-950 border-2 p-4 space-y-3"
                style={{ borderColor: `${activeCube.accent}88` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-black text-white flex items-center gap-2">
                      <span>{activeCube.icon}</span>
                      <span>{activeCube.name} — 報酬ツリー</span>
                      {activeCubeIsCurrent && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400 text-[10px] text-emerald-300">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {activeCubeOwned
                        ? "繋がっているルートノードから順に豆通貨でアンロックできます。解放後はクリックで即装備！"
                        : `まずは上のボタンから ${activeCube.priceBeans.toLocaleString()} 豆でこのCosmicubeを購入してください。`}
                    </p>
                  </div>
                  {!activeCubeOwned && (
                    <button
                      type="button"
                      onClick={() => handleBuyCube(activeCube.id, activeCube.name, activeCube.priceBeans)}
                      className="sf-btn px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs"
                    >
                      🔓 🫘 {activeCube.priceBeans.toLocaleString()} でアンロック
                    </button>
                  )}
                </div>

                <div className="relative w-full h-[310px] sm:h-[340px] rounded-2xl bg-[radial-gradient(circle_at_center,_rgba(30,41,59,0.75),_rgba(2,6,23,0.98))] border border-slate-800 overflow-hidden">
                  {/* Connector Lines SVG */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    {activeCube.nodes.map((node) => {
                      if (!node.parentId) return null;
                      const parent = activeCube.nodes.find((p) => p.id === node.parentId);
                      if (!parent) return null;
                      const parentUnlocked = progression.unlockedCubeNodes.includes(parent.id);
                      const selfUnlocked = progression.unlockedCubeNodes.includes(node.id);
                      return (
                        <line
                          key={`${parent.id}->${node.id}`}
                          x1={parent.xPct}
                          y1={parent.yPct}
                          x2={node.xPct}
                          y2={node.yPct}
                          stroke={selfUnlocked ? activeCube.accent : parentUnlocked ? "#facc15" : "#334155"}
                          strokeWidth={selfUnlocked ? "1.1" : "0.75"}
                          strokeDasharray={selfUnlocked ? undefined : "2 1.5"}
                        />
                      );
                    })}
                  </svg>

                  {/* Tree Nodes */}
                  {activeCube.nodes.map((node) => {
                    const nodeUnlocked = progression.unlockedCubeNodes.includes(node.id);
                    const parentOk =
                      node.parentId === null || progression.unlockedCubeNodes.includes(node.parentId);
                    const canBuy = activeCubeOwned && !nodeUnlocked && parentOk;
                    const imgUrl = getRewardPreview(node.rewardKind, node.rewardId);
                    const np =
                      node.rewardKind === "nameplate"
                        ? NAMEPLATES.find((n) => n.id === node.rewardId)
                        : null;

                    return (
                      <div
                        key={node.id}
                        style={{ left: `${node.xPct}%`, top: `${node.yPct}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 w-[124px] sm:w-[144px]"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (nodeUnlocked) {
                              soundEngine.playClick();
                              onEquipItem(node.rewardKind, node.rewardId);
                              showNotice(`「${node.title}」を装備しました！`, true);
                            } else if (canBuy) {
                              handleBuyNode(activeCube.id, node);
                            } else if (!activeCubeOwned) {
                              soundEngine.playError();
                              showNotice("先にこのCosmicube本体をアンロックしてください", false);
                            } else {
                              soundEngine.playError();
                              showNotice("手前の接続ノードを先に解放してください", false);
                            }
                          }}
                          className={`sf-btn w-full rounded-2xl p-2 border-2 text-center space-y-1 shadow-xl transition ${
                            nodeUnlocked
                              ? "bg-emerald-950/90 border-emerald-400"
                              : canBuy
                                ? "bg-slate-900/95 border-amber-400 hover:scale-105"
                                : "bg-slate-950/90 border-slate-800 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-center h-10 rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden">
                            {np ? (
                              <span className="text-lg">{np.accentEmoji}</span>
                            ) : (
                              imgUrl && <img src={imgUrl} alt={node.title} className="w-9 h-9 object-contain" />
                            )}
                          </div>
                          <div className="text-[10px] font-black text-white truncate">{node.title}</div>
                          <div
                            className={`text-[10px] font-black rounded-lg py-0.5 ${
                              nodeUnlocked
                                ? "bg-emerald-500/20 text-emerald-300"
                                : canBuy
                                  ? "bg-amber-400 text-slate-950"
                                  : "bg-slate-900 text-slate-500"
                            }`}
                          >
                            {nodeUnlocked ? "✓ 装備する" : `🫘 ${node.costBeans}`}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
