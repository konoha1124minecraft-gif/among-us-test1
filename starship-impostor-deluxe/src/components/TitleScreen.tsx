import React, { useEffect, useMemo, useRef, useState } from "react";
import { drawPlayer, renderMapPreviewThumbnail } from "../game/canvasRenderer";
import { FB, PLAYER_COLORS } from "../game/constants";
import { MAP_LIST, getMapById } from "../game/maps";
import { TASK_CATALOG_150 } from "../game/tasks150";
import type { PublicRoomSummary, TaskDifficultyMode } from "../game/types";

interface TitleScreenProps {
  myName: string;
  myColor: string;
  myHat: string;
  myVisor: string;
  myPet: string;
  mySkin: string;
  beans: number;
  level: number;
  selectedMapId: string;
  aiCount: number;
  taskDifficulty: TaskDifficultyMode;
  joinCode: string;
  networkStatus: string;
  onChangeName: (name: string) => void;
  onChangeJoinCode: (code: string) => void;
  onChangeAiCount: (count: number) => void;
  onChangeTaskDifficulty: (diff: TaskDifficultyMode) => void;
  onCreateOnlineRoom: () => void;
  onJoinOnlineRoom: (codeOverride?: string, asSpectator?: boolean) => void;
  onStartAISolo: () => void;
  onStartTutorial: () => void;
  onOpenTutorialModal: () => void;
  onOpenMapSelector: () => void;
  onOpenCustomize: () => void;
  onOpenShop: () => void;
  onOpenRolesGuide: () => void;
  onOpenAchievements: () => void;
  onOpenKeybinds: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  myName,
  myColor,
  myHat,
  myVisor,
  myPet,
  mySkin,
  beans,
  level,
  selectedMapId,
  aiCount,
  taskDifficulty,
  joinCode,
  networkStatus,
  onChangeName,
  onChangeJoinCode,
  onChangeAiCount,
  onChangeTaskDifficulty,
  onCreateOnlineRoom,
  onJoinOnlineRoom,
  onStartAISolo,
  onStartTutorial,
  onOpenTutorialModal,
  onOpenMapSelector,
  onOpenCustomize,
  onOpenShop,
  onOpenRolesGuide,
  onOpenAchievements,
  onOpenKeybinds,
  onOpenSettings,
}) => {
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const [publicRooms, setPublicRooms] = useState<PublicRoomSummary[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const selectedMap = useMemo(
    () => (selectedMapId === "random" ? null : getMapById(selectedMapId)),
    [selectedMapId]
  );

  const mapThumb = useMemo(
    () => (selectedMap ? renderMapPreviewThumbnail(selectedMap, 280, 160) : ""),
    [selectedMap]
  );

  const colorHex = useMemo(
    () => (PLAYER_COLORS.find((c) => c.id === myColor) || PLAYER_COLORS[0]).hex,
    [myColor]
  );

  const refreshPublicRooms = async () => {
    setLoadingRooms(true);
    const list = await FB.fetchPublicRooms();
    setPublicRooms(list);
    setLoadingRooms(false);
  };

  useEffect(() => {
    void refreshPublicRooms();
  }, []);

  useEffect(() => {
    let raf = 0;
    const render = (now: number) => {
      const c = previewRef.current;
      if (c) {
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, c.width, c.height);
          const g = ctx.createRadialGradient(64, 62, 6, 64, 62, 54);
          g.addColorStop(0, `${colorHex}45`);
          g.addColorStop(1, "rgba(2, 6, 23, 0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.save();
          ctx.translate(68, 70);
          ctx.scale(1.45, 1.45);
          drawPlayer(ctx, 0, Math.sin(now * 0.004) * 2.5, myColor, myHat, 1, true, false, 1, false, now, myPet, mySkin, undefined, myVisor);
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [myColor, myHat, myVisor, myPet, mySkin, colorHex]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between p-3 sm:p-6 gap-4 overflow-y-auto relative">
      {/* Subtle Cosmic Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.12),_transparent_55%)]" />

      {/* Top Navigation Toolbar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-2.5 sf-panel rounded-2xl px-4 py-3 border border-cyan-500/35">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚀</span>
          <div>
            <h1 className="font-orbitron font-black text-base sm:text-xl tracking-wider text-white leading-none">
              STARSHIP IMPOSTOR <span className="text-cyan-400">DELUXE</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              全{MAP_LIST.length}マップ ・ {TASK_CATALOG_150.length}種タスク ・ 21役職 宇宙人狼マルチプレイ
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/50 text-amber-200 font-orbitron text-xs font-black whitespace-nowrap">
            🫘 {beans.toLocaleString()} <span className="text-cyan-300 ml-1">Lv.{level}</span>
          </div>
          <button
            type="button"
            onClick={onOpenShop}
            className="sf-btn px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black whitespace-nowrap"
          >
            🛒 ショップ / キューブ
          </button>
          <button
            type="button"
            onClick={onOpenTutorialModal}
            className="sf-btn px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/60 text-emerald-200 text-xs font-black whitespace-nowrap"
          >
            🎓 ルール説明
          </button>
          <button
            type="button"
            onClick={onOpenRolesGuide}
            className="sf-btn px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/35 border border-purple-400/50 text-purple-200 text-xs font-black whitespace-nowrap"
          >
            🎭 21役職
          </button>
          <button
            type="button"
            onClick={onOpenAchievements}
            className="sf-btn px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 text-xs font-black whitespace-nowrap"
          >
            🏆 実績
          </button>
          <button
            type="button"
            onClick={onOpenKeybinds}
            className="sf-btn px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold"
          >
            ⌨️ 操作
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="sf-btn px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold"
          >
            ⚙️ 設定・記録
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="relative z-10 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Profile + Map Card */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="sf-panel rounded-3xl p-4 sm:p-5 border border-slate-800 flex items-center gap-4">
            <div className="w-[128px] h-[118px] rounded-2xl bg-slate-950 border border-slate-700/80 shrink-0 overflow-hidden flex items-center justify-center">
              <canvas ref={previewRef} width={128} height={118} className="w-full h-full block" />
            </div>
            <div className="flex-1 min-w-0 space-y-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">クルーネーム</label>
                <input
                  type="text"
                  maxLength={12}
                  value={myName}
                  onChange={(e) => onChangeName(e.target.value)}
                  placeholder="名前を入力..."
                  className="w-full min-h-[40px] rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:outline-none px-3 text-sm font-black text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={onOpenCustomize}
                  className="sf-btn py-2 px-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/60 text-cyan-200 text-xs font-black"
                >
                  🎨 外見カスタム
                </button>
                <button
                  type="button"
                  onClick={onOpenShop}
                  className="sf-btn py-2 px-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/60 text-amber-200 text-xs font-black"
                >
                  🛒 ショップ
                </button>
              </div>
            </div>
          </div>

          {/* Stage Selector Preview Card */}
          <div className="sf-panel rounded-3xl p-4 sm:p-5 border border-slate-800 flex-1 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-orbitron text-cyan-400 font-bold">SELECTED STAGE</div>
                <div className="text-base font-black text-white">
                  {selectedMapId === "random" ? "🎲 毎回ランダム抽選 (全30マップ)" : selectedMap?.name}
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenMapSelector}
                className="sf-btn px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs whitespace-nowrap shadow"
              >
                🗺️ マップ選択 (30)
              </button>
            </div>

            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              {selectedMapId === "random" ? (
                <div className="text-center space-y-1 p-4">
                  <div className="text-4xl">🎲</div>
                  <div className="text-xs font-black text-amber-300">全30種類から開始ごとに自動決定</div>
                </div>
              ) : (
                mapThumb && <img src={mapThumb} alt={selectedMap?.name} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-2 text-[11px] text-amber-300 font-bold">
              ✨ {selectedMapId === "random" ? "全5カテゴリの多彩なギミックが登場" : selectedMap?.gimmickSummary}
            </div>
          </div>
        </section>

        {/* Right: Play Modes + Online Browser */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Solo / Tutorial Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sf-panel rounded-3xl p-4 sm:p-5 border border-cyan-500/45 flex flex-col justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-orbitron font-black text-cyan-300">SINGLE PLAYER</div>
                <h2 className="text-lg font-black text-white">🤖 AIソロ対戦</h2>
                <p className="text-[11px] text-slate-300">
                  1人でもすぐ遊べる！AIボットと推理・暗殺・タスクバトル。
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <label className="rounded-xl bg-slate-900 border border-slate-800 p-2">
                  <span className="text-slate-400 block text-[10px]">AI人数</span>
                  <select
                    value={aiCount}
                    onChange={(e) => onChangeAiCount(Number(e.target.value))}
                    className="w-full bg-slate-950 text-white font-bold rounded px-1.5 py-1 mt-0.5 border border-slate-700"
                  >
                    {[3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <option key={n} value={n}>{n} 体</option>
                    ))}
                  </select>
                </label>
                <label className="rounded-xl bg-slate-900 border border-slate-800 p-2">
                  <span className="text-slate-400 block text-[10px]">タスク難易度</span>
                  <select
                    value={taskDifficulty}
                    onChange={(e) => onChangeTaskDifficulty(e.target.value as TaskDifficultyMode)}
                    className="w-full bg-slate-950 text-amber-300 font-bold rounded px-1.5 py-1 mt-0.5 border border-slate-700"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HARD">HARD</option>
                    <option value="EXTREME">EXTREME</option>
                  </select>
                </label>
              </div>
              <button
                type="button"
                onClick={onStartAISolo}
                className="sf-btn w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-sm shadow-lg"
              >
                🚀 AIソロで出撃！
              </button>
            </div>

            <div className="sf-panel rounded-3xl p-4 sm:p-5 border border-emerald-500/45 flex flex-col justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-orbitron font-black text-emerald-300">TRAINING MISSION</div>
                <h2 className="text-lg font-black text-white">🎓 実践チュートリアル</h2>
                <p className="text-[11px] text-slate-300">
                  移動・タスク・死体通報・投票・キル＆ベントの4ステップを実地体験！
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onStartTutorial}
                  className="sf-btn w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm shadow-lg"
                >
                  ▶ 実践ミッションを開始
                </button>
                <button
                  type="button"
                  onClick={onOpenTutorialModal}
                  className="sf-btn w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-200 font-bold text-xs"
                >
                  📖 初心者ルール解説を読む
                </button>
              </div>
            </div>
          </div>

          {/* Online Multiplayer */}
          <div className="sf-panel rounded-3xl p-4 sm:p-5 border border-purple-500/45 space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-orbitron font-black text-purple-300">ONLINE MULTIPLAYER (P2P + FIREBASE)</div>
                <div className="text-sm font-black text-white">🌐 オンライン部屋の作成・参加</div>
              </div>
              {networkStatus && (
                <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-[11px] font-bold text-cyan-300">
                  {networkStatus}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <button
                type="button"
                onClick={onCreateOnlineRoom}
                className="sm:col-span-5 sf-btn py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:brightness-110 text-white font-black text-sm shadow-lg"
              >
                ✨ 新しい部屋を作成
              </button>

              <div className="sm:col-span-7 flex gap-1.5">
                <input
                  type="text"
                  maxLength={10}
                  value={joinCode}
                  onChange={(e) => onChangeJoinCode(e.target.value.toUpperCase())}
                  placeholder="部屋コード (例: A1B2)"
                  className="flex-1 min-w-0 rounded-2xl bg-slate-900 border border-slate-700 focus:border-purple-400 focus:outline-none px-3 font-orbitron font-black text-xs text-white uppercase"
                />
                <button
                  type="button"
                  onClick={() => onJoinOnlineRoom(undefined, false)}
                  className="sf-btn px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs whitespace-nowrap"
                >
                  🚪 参加
                </button>
                <button
                  type="button"
                  onClick={() => onJoinOnlineRoom(undefined, true)}
                  title="観戦参加"
                  className="sf-btn px-3 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-purple-200 font-bold text-xs whitespace-nowrap"
                >
                  👁️
                </button>
              </div>
            </div>

            {/* Public Rooms Browser */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-200">📡 公開ルーム一覧 ({publicRooms.length})</span>
                <button
                  type="button"
                  onClick={() => void refreshPublicRooms()}
                  className="text-[11px] text-cyan-300 hover:underline font-bold"
                >
                  {loadingRooms ? "更新中..." : "🔄 更新"}
                </button>
              </div>
              {publicRooms.length === 0 ? (
                <div className="text-[11px] text-slate-500 py-2 text-center">
                  現在アクティブな公開ルームはありません。「新しい部屋を作成」からホストになれます。
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {publicRooms.map((r) => (
                    <div
                      key={r.roomCode}
                      className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-black text-white truncate">
                          [{r.roomCode}] {r.hostName}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {r.mapName} · {r.playerCount}/{r.maxPlayers}人
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onJoinOnlineRoom(r.roomCode, false)}
                        className="sf-btn px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black shrink-0"
                      >
                        参加
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 text-center text-[11px] text-slate-500">
        STARSHIP IMPOSTOR DELUXE v5.0 // 30 Maps · 150 Tasks · Hybrid P2P + Firebase Sync
      </footer>
    </div>
  );
};
