import React, { useState } from "react";
import { ROLES } from "../game/constants";
import { TASK_CATEGORIES_15 } from "../game/tasks150";

interface TutorialAndRulesModalProps {
  open: boolean;
  onStartInteractiveTutorial: () => void;
  onClose: () => void;
}

export const TutorialAndRulesModal: React.FC<TutorialAndRulesModalProps> = ({
  open,
  onStartInteractiveTutorial,
  onClose,
}) => {
  const [tab, setTab] = useState<"basics" | "controls" | "roles" | "tasks">("basics");
  if (!open) return null;

  const allRoles = Object.values(ROLES);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="sf-panel w-full max-w-4xl max-h-[90vh] rounded-3xl p-4 sm:p-6 border-2 border-emerald-400/60 flex flex-col gap-3 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-emerald-300">
              🎓 初心者ルール解説 & 実践チュートリアル
            </h2>
            <p className="text-[11px] text-slate-400">
              宇宙人狼の基本・操作方法・全21役職・全150種タスクの攻略ガイド
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartInteractiveTutorial();
              }}
              className="sf-btn px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-xs shadow-lg whitespace-nowrap"
            >
              ▶ 実践チュートリアルを開始する
            </button>
            <button
              type="button"
              onClick={onClose}
              className="sf-btn px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 shrink-0">
          {[
            ["basics", "🛸 基本ルール＆勝敗"],
            ["controls", "🎮 操作＆ボタン"],
            ["roles", `🎭 全${allRoles.length}役職`],
            ["tasks", "⚡ 15種タスク＆攻略"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id as typeof tab)}
              className={`sf-btn px-3 py-1.5 rounded-xl border text-xs font-black whitespace-nowrap ${
                tab === id
                  ? "bg-emerald-500 text-slate-950 border-emerald-200"
                  : "bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-400/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 text-xs space-y-3">
          {tab === "basics" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-cyan-950/40 border border-cyan-400/40 p-4 space-y-2">
                <div className="text-sm font-black text-cyan-300">🛡️ クルー陣営 (多数派)</div>
                <p className="text-slate-200 leading-relaxed">
                  船内に散らばるミッション（タスク）をすべて完了させるか、会議投票でインポスターを全員追放すると勝利です。
                </p>
                <div className="text-[11px] text-cyan-200 bg-slate-950/60 p-2 rounded-xl">
                  💡 死亡しても「幽霊」として残りタスクを完了できます！
                </div>
              </div>
              <div className="rounded-2xl bg-rose-950/40 border border-rose-400/40 p-4 space-y-2">
                <div className="text-sm font-black text-rose-300">🔪 インポスター陣営 (人狼)</div>
                <p className="text-slate-200 leading-relaxed">
                  タスクをするフリをしながら単独のクルーを暗殺([Q])し、生存数を同数以下にするか原子炉妨害を成功させると勝利！
                </p>
                <div className="text-[11px] text-rose-200 bg-slate-950/60 p-2 rounded-xl">
                  💡 ベント([V])や停電・扉封鎖([C])を駆使しよう。
                </div>
              </div>
              <div className="rounded-2xl bg-purple-950/40 border border-purple-400/40 p-4 space-y-2">
                <div className="text-sm font-black text-purple-300">🎭 第三陣営 (特殊勝利)</div>
                <p className="text-slate-200 leading-relaxed">
                  テルテル（追放で勝ち）、ジャッカル（全員敵）、アーソニスト（全員点火）、サバイバー（生存勝利）など独自の勝利条件を狙います。
                </p>
                <div className="text-[11px] text-purple-200 bg-slate-950/60 p-2 rounded-xl">
                  💡 どちらの陣営にとっても予測不能なジョーカー存在！
                </div>
              </div>
            </div>
          )}

          {tab === "controls" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                ["WASD / 矢印キー / 左スティック", "キャラクター移動（壁に沿って自動スライド）"],
                ["[E] キー / ⚡使用ボタン", "光る計器でタスク実行 / サボタージュ修理 / 階段・ワープ・カメラ使用"],
                ["[R] キー / 📢通報ボタン", "倒れた死体を発見して緊急会議を開く（生存者のみ可能）"],
                ["[Q] キー / 🔪キルボタン", "インポスター・シェリフ・ジャッカル等の攻撃 / 塗布アクション"],
                ["[V] キー / 🕳️ベントボタン", "インポスター・エンジニア・ジャッカルの通気口ワープ出入"],
                ["[C] キー / ⚡妨害ボタン", "停電・原子炉・ガス・全扉封鎖サボタージュメニューを開く"],
                ["[F] キー / ✨能力ボタン", "ドクター蘇生・ファントム透明化・トラッカーGPS等の固有能力発動"],
                ["[TAB] キー / 🗺️マップボタン", "全体戦術マップ・タスク位置・階段切替を表示"],
              ].map(([key, desc]) => (
                <div key={key} className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
                  <div className="font-orbitron font-black text-cyan-300 text-xs">{key}</div>
                  <div className="text-slate-200 mt-1">{desc}</div>
                </div>
              ))}
            </div>
          )}

          {tab === "roles" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allRoles.map((r) => (
                <div key={r.id} className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm" style={{ color: r.color }}>
                      {r.jp} ({r.name})
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-slate-300">
                      {r.team === "crew" ? "クルー" : r.team === "impostor" ? "人狼" : "第三"}
                    </span>
                  </div>
                  <p className="text-slate-200">{r.desc}</p>
                  <p className="text-[11px] text-amber-300 font-bold">💡 コツ: {r.tip}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "tasks" && (
            <div className="space-y-3">
              <div className="rounded-xl bg-amber-950/40 border border-amber-400/40 p-3 text-amber-200">
                ⚙️ 本作は全15カテゴリ×10バリアント＝<b>150種類のユニークタスク</b>を搭載！難易度設定（NORMAL / HARD(初期) / EXTREME）により判定速度や許容範囲が変化します。
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TASK_CATEGORIES_15.map((cat) => (
                  <div key={cat.id} className="rounded-xl bg-slate-900/90 border border-slate-800 p-2.5">
                    <div className="font-black text-cyan-300">{cat.label} (10種)</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">{cat.summary}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
