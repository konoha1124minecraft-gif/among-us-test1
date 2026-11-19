import React, { useMemo, useState } from "react";
import { renderMapPreviewThumbnail } from "../game/canvasRenderer";
import { MAP_CATEGORIES, MAP_LIST } from "../game/maps";
import type { MapCategory, MapSizeTag } from "../game/types";

interface MapSelectorModalProps {
  open: boolean;
  selectedMapId: string;
  onSelectMap: (mapId: string) => void;
  onClose: () => void;
}

const SIZE_LABEL: Record<MapSizeTag, string> = {
  small: "小型",
  medium: "標準",
  large: "大型",
};

export const MapSelectorModal: React.FC<MapSelectorModalProps> = ({
  open,
  selectedMapId,
  onSelectMap,
  onClose,
}) => {
  const [category, setCategory] = useState<"all" | MapCategory>("all");
  const [sizeFilter, setSizeFilter] = useState<"all" | MapSizeTag>("all");
  const [keyword, setKeyword] = useState("");
  const [focusedId, setFocusedId] = useState<string>(
    selectedMapId === "random" ? "starship" : selectedMapId
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return MAP_LIST.filter((m) => {
      if (category !== "all" && m.category !== category) return false;
      if (sizeFilter !== "all" && m.sizeTag !== sizeFilter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.subtitle.toLowerCase().includes(q) ||
        m.gimmickSummary.toLowerCase().includes(q)
      );
    });
  }, [category, sizeFilter, keyword]);

  const previewMap = useMemo(
    () => MAP_LIST.find((m) => m.id === focusedId) || MAP_LIST[0],
    [focusedId]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="sf-panel w-full max-w-6xl h-[90vh] max-h-[820px] rounded-3xl p-4 sm:p-6 border-2 border-cyan-400/50 flex flex-col gap-3 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-cyan-300 flex items-center gap-2">
              <span>🗺️</span> ステージ選択（全 {MAP_LIST.length} マップ）
            </h2>
            <p className="text-[11px] text-slate-400">
              5カテゴリ・固有ギミック・階層構造から作戦エリアを選択してください
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onSelectMap("random");
                onClose();
              }}
              className={`sf-btn px-3.5 py-2 rounded-xl border text-xs font-black whitespace-nowrap ${
                selectedMapId === "random"
                  ? "bg-amber-400 text-slate-950 border-white"
                  : "bg-amber-500/20 border-amber-400/60 text-amber-200 hover:bg-amber-500/35"
              }`}
            >
              🎲 毎回ランダム抽選
            </button>
            <button
              type="button"
              onClick={onClose}
              className="sf-btn px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              ✕ 閉じる
            </button>
          </div>
        </div>

        {/* Category Tabs & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {MAP_CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`sf-btn px-3 py-1.5 rounded-xl border text-xs font-black whitespace-nowrap transition ${
                    active
                      ? "bg-cyan-500 text-slate-950 border-cyan-200"
                      : "bg-slate-900/90 text-slate-300 border-slate-700 hover:border-cyan-400/50"
                  }`}
                >
                  {c.icon} {c.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value as "all" | MapSizeTag)}
              className="rounded-xl bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-xs text-slate-200 font-bold"
            >
              <option value="all">全サイズ</option>
              <option value="small">小型</option>
              <option value="medium">標準</option>
              <option value="large">大型</option>
            </select>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="マップ・ギミック検索..."
              className="w-44 sm:w-56 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:outline-none px-3 py-1.5 text-xs text-white"
            />
          </div>
        </div>

        {/* 2-Pane Split */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Grid */}
          <div className="lg:col-span-8 min-h-0 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 content-start">
            {filtered.map((m) => {
              const thumb = renderMapPreviewThumbnail(m, 240, 140);
              const isSelected = selectedMapId === m.id;
              const isFocused = focusedId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFocusedId(m.id)}
                  onDoubleClick={() => {
                    onSelectMap(m.id);
                    onClose();
                  }}
                  className={`sf-btn rounded-2xl p-2.5 border text-left transition flex flex-col gap-2 ${
                    isSelected
                      ? "bg-cyan-950/75 border-cyan-400 ring-2 ring-cyan-400/50"
                      : isFocused
                        ? "bg-slate-800/95 border-slate-400"
                        : "bg-slate-900/90 border-slate-800 hover:border-slate-500"
                  }`}
                >
                  <div className="relative w-full aspect-[12/7] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    {thumb && <img src={thumb} alt={m.name} className="w-full h-full object-cover" />}
                    <div className="absolute top-1.5 left-1.5 flex gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-950/85 text-[9px] font-black text-cyan-200 border border-slate-700">
                        {SIZE_LABEL[m.sizeTag]}
                      </span>
                      {m.hasMultiFloor && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-950/90 text-[9px] font-black text-purple-200 border border-purple-400/50">
                          2F階層
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-lg bg-cyan-400 text-slate-950 text-[9px] font-black">
                        選択中
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-white truncate">{m.name}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{m.gimmickSummary}</div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full py-12 text-center text-xs text-slate-400">
                条件に一致するマップがありません
              </div>
            )}
          </div>

          {/* Right Detail Panel */}
          <div className="lg:col-span-4 rounded-2xl bg-slate-950/90 border border-slate-800 p-4 flex flex-col justify-between gap-3 overflow-y-auto">
            <div className="space-y-3">
              <div className="w-full aspect-[12/7] rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                <img
                  src={renderMapPreviewThumbnail(previewMap, 380, 220)}
                  alt={previewMap.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-[10px] font-orbitron uppercase tracking-wider text-cyan-400">
                  SECTOR BRIEFING
                </div>
                <h3 className="text-base font-black text-white mt-0.5">{previewMap.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{previewMap.subtitle}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-2">
                  <div className="text-[10px] text-slate-400">部屋数 / タスク数</div>
                  <div className="font-black text-white tabular-nums">
                    {previewMap.rooms.length}部屋 / {previewMap.taskSpots.length}箇所
                  </div>
                </div>
                <div className="rounded-xl bg-slate-900 border border-slate-800 p-2">
                  <div className="text-[10px] text-slate-400">推奨人数 / サイズ</div>
                  <div className="font-black text-cyan-300">
                    {previewMap.recommendedPlayers} ({SIZE_LABEL[previewMap.sizeTag]})
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-amber-950/35 border border-amber-400/40 p-3 space-y-1">
                <div className="text-[10px] font-black text-amber-300">✨ 固有ギミック詳細</div>
                <p className="text-xs text-slate-100 leading-relaxed">{previewMap.gimmickSummary}</p>
              </div>
              <div className="text-[11px] text-slate-400">
                主要エリア: {previewMap.rooms.map((r) => r.name).join(" ・ ")}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectMap(previewMap.id);
                onClose();
              }}
              className="sf-btn w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-sm shadow-lg"
            >
              ✅ このマップを決定する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
