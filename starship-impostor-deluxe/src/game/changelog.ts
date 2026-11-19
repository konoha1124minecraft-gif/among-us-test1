import type { ChangelogEntry } from "./types";

/**
 * 変更記録レジストリ (APPEND-ONLY / 不変履歴)
 * 過去のガード記録は改ざん・削除禁止。新規修正時のみ末尾へ追記すること。
 */
const RAW_CHANGELOG: ChangelogEntry[] = [
  {
    version: "v2.0.0",
    date: "2026-03-01",
    guardId: "GUARD_01_NO_DEAD_SELF_REPORT",
    category: "BUGFIX",
    title: "死体・幽霊・観戦者による自己通報 / 会議招集の完全禁止",
    summary: "死亡したプレイヤーが自身の死体を通報して会議を開ける致命的不具合を修正。",
    details: [
      "validateAliveReporter(me) で生存かつ非観戦・非チュートリアル除外状態のみ通報許可",
      "Rキー / UI通報ボタン / findNearbyInteractable の全3経路で二重検証を実施",
    ],
  },
  {
    version: "v2.0.1",
    date: "2026-03-02",
    guardId: "GUARD_02_POST_SPAWN_COOLDOWNS",
    category: "BALANCE",
    title: "試合開始・会議終了・Doctor蘇生直後の全クールダウン初期化",
    summary: "スポーン直後の即キル・即サボタージュを防ぐためクールダウンを厳格リセット。",
    details: [
      "killCooldown / sabotageCooldown / abilityCooldown / emergencyCooldown / ventCooldown を正規初期化",
      "AI思考タイマーと移動速度(vx/vy)も同時リセットして開幕事故をゼロ化",
    ],
  },
  {
    version: "v2.0.2",
    date: "2026-03-04",
    guardId: "GUARD_03_TELEPORT_DESYNC_AND_LOOP_FIX",
    category: "BUGFIX",
    title: "階段・ワープ装置の座標脱シンク及び連続再転送ループ解消",
    summary: "テレポート直後の補間引き戻しや階段ループを防止する安全座標補正・カメラ即時追従を実装。",
    details: [
      "resolveSafePos による壁抜け防止と targetFloor の明示的同期",
      "260px超のワープ時に補間キュー・速度をクリアし 1.5s の postWarpGraceSec を付与",
    ],
  },
  {
    version: "v2.1.0",
    date: "2026-03-06",
    guardId: "GUARD_04_EXCLUDE_SPAWN_ROOM_TASKS",
    category: "BALANCE",
    title: "スポーン会議ハブ部屋のタスク割当除外と部屋分散配置",
    summary: "緊急ボタン周辺にタスクが集中して人狼側の妨害が困難になる問題を解消。",
    details: [
      "isTaskSpotSafe により emergency ハブ部屋＋18pxマージンをタスク候補から自動除外",
      "未割り当て部屋を優先するラウンドロビン重み付けでマップ全体の巡回動線を強化",
    ],
  },
  {
    version: "v2.1.2",
    date: "2026-03-08",
    guardId: "GUARD_05_DYNAMIC_AI_SOLO_MAP_SELECTION",
    category: "BUGFIX",
    title: "AIソロ対戦・オンライン対戦の動的マップ抽選 & 明示ロード統一",
    summary: "ランダム選択やマップ切替時に常に初期マップへ戻ってしまう不具合を修正。",
    details: [
      "resolveMatchMapId により random 指定時の実マップ抽選と有効マップ検証を統一",
    ],
  },
  {
    version: "v2.1.5",
    date: "2026-03-10",
    guardId: "GUARD_06_ALL_TASKS_STABILITY",
    category: "BUGFIX",
    title: "タスク二重完了ロック・ドラッグ抜け防止・厳密バリデーション導入",
    summary: "ポインターのウィンドウ外リリースや連打による二重クリアを完全に防止。",
    details: [
      "isCompletedRef によるワンショット完了ロックと window.addEventListener('pointerup') 解放",
      "誤入力時の赤フラッシュ＆短時間ロックアウト演出により安易な連打クリアを防止",
    ],
  },
  {
    version: "v2.2.0",
    date: "2026-03-12",
    guardId: "GUARD_07_RUNTIME_HEALTH_GUARD",
    category: "SECURITY",
    title: "ランタイム健全性監視（NaN座標・負クールダウン自動修復）",
    summary: "移動・ワープ計算中の NaN/Infinity を検知して安全な緊急ボタン座標へ即復旧。",
    details: [
      "1秒周期で全プレイヤー座標・床番号・クールダウンを検証し ErrorLogger へ警告記録",
    ],
  },
  {
    version: "v2.2.2",
    date: "2026-03-14",
    guardId: "GUARD_08_P2P_STABILITY_AND_ROOM_UI",
    category: "NETWORK",
    title: "WebRTC STUN最適化 & Firebase Realtime DB ハイブリッド通信統合",
    summary: "PeerJS + Firebase RTDB フォールバックにより学内・モバイル回線越しクロスプレイを実現。",
    details: [
      "Google/Cloudflare STUN多重構成と ?fb= 共有URLによるワンクリックDB共有",
    ],
  },
  {
    version: "v2.2.5",
    date: "2026-03-16",
    guardId: "GUARD_09_NO_DOUBLE_KILL",
    category: "BUGFIX",
    title: "近接複数ターゲット同時キル防止（単一ターゲット排他ロック）",
    summary: "密集状態でのキル入力時に2名同時キルが発生する不具合を修正。",
    details: [
      "距離順で最寄りの生存非味方1名のみ確定し、即時クールダウンロックを適用",
    ],
  },
  {
    version: "v5.0.0",
    date: "2026-04-20",
    guardId: "GUARD_10_12_V5_FULL_UPGRADE",
    category: "FEATURE",
    title: "30マップ・150ユニークタスク・初心者チュートリアル・Firebase同期刷新",
    summary: "Vite + TypeScript 完全モジュール化に加え、全150種タスク・全30マップ・固有ギミック・エラー永続記録を搭載。",
    details: [
      "15カテゴリ×各10バリアント=全150種の完全ユニークタスク実装＆難易度設定(NORMAL/HARD/EXTREME, 初期HARD)追加",
      "TaskUniquenessGuard による同カテゴリ重複割当防止と AI作業時間適正化(9-14s / 18-28s)",
      "既存15マップ強化(starship廊下拡幅・ベント増設)＋新規15マップ追加の全30マップ・5カテゴリ構成",
      "DecorationCollisionGuard(重なり自動回避)＆10種環境一体化タスク計器スプライト実装",
      "Firebase RTDB onDisconnect 自動退出・20s ゴースト掃討・ホスト自動移譲・指数Lerp補間・Ping表示",
      "初心者向け4タブ解説モーダル＋プレイアブル4ステップ実践チュートリアル＋ErrorLogger/Changelog永続タブ実装",
    ],
  },
  {
    version: "v5.1.0",
    date: "2026-05-01",
    guardId: "GUARD_13_GHOST_CAMERA_LOS_ALIGN",
    category: "BUGFIX",
    title: "ゴースト行動補強・カメラ追従/DPI安定化・視界外透過防止・壁/ドア座標統一",
    summary: "幽霊タスク/ゴーストインポスター妨害・カメラ制御・厳密LoS視界遮蔽・円/箱障害物と閉鎖ドア判定を完全統一。",
    details: [
      "死亡・追放時にベント/変身/透明状態を安全解除し、ゴーストの壁抜け浮遊・幽霊同士視認・ゴーストクルーのタスク＆階層移動・ゴーストインポスターの妨害サポートを実装",
      "60fpsメインループの不要再生成を解消し、高DPI・リサイズ・NaN保護・監視カメラ中移動ロック＆バッテリー消費・観戦階層同期を修正",
      "視界外および壁/閉鎖ドア裏の他プレイヤー・ネームプレート・ペット・死体・足跡を描画段階でもLoS厳密判定して透視を防止",
      "円形障害物(円卓・タンク)の実円衝突、8点円周壁判定、実マップドア閉鎖シャッター(buildMapDoorBlockers)を描画・衝突・視界で統一",
    ],
  },
  {
    version: "v5.2.0",
    date: "2026-05-05",
    guardId: "GUARD_14_WALL_ALIGN_MULTICAM_AINAV",
    category: "BUGFIX",
    title: "壁/ドア/注意帯の位置ズレ解消・全30マップ複数監視カメラ対応・AI経路探索強化",
    summary: "通路中心拡幅と解析的壁区間減算・全マップ3〜4基カメラ配置・AI A*階層横断ナビとスタック自動回復を実装。",
    details: [
      "starship通路拡幅を中心基準化し、snapCautionToThreshold で注意帯(caution)を部屋・通路開口へ自動フィット＆ゲート両端ピラー描画を統合",
      "buildWallSegments の12px離散サンプリングを解析的区間減算(Analytic Interval Clipping)へ刷新し、境界はみ出し・隙間をゼロ化",
      "全30マップに3〜4基の監視カメラ本体(camera_prop)を自動確保し、buildMapCameraFeeds・CAM1..4/矢印キー切替・終了時視点復帰を統一",
      "AIボットに歩行可能ウェイポイントグラフ(A*)・接線障害物回避ステア・階段/転移門1F/2F移動・0.85s/1.8s二重スタック検知回復を搭載",
    ],
  },
];

export const CHANGELOG_REGISTRY: readonly ChangelogEntry[] = Object.freeze(
  RAW_CHANGELOG.map((entry) =>
    Object.freeze({
      ...entry,
      details: Object.freeze([...entry.details]),
    })
  )
);

export function filterChangelog(
  category: "ALL" | ChangelogEntry["category"],
  keyword: string
): readonly ChangelogEntry[] {
  const q = keyword.trim().toLowerCase();
  return [...CHANGELOG_REGISTRY].reverse().filter((e) => {
    if (category !== "ALL" && e.category !== category) return false;
    if (!q) return true;
    return (
      e.title.toLowerCase().includes(q) ||
      e.summary.toLowerCase().includes(q) ||
      e.version.toLowerCase().includes(q) ||
      (e.guardId || "").toLowerCase().includes(q) ||
      e.details.some((d) => d.toLowerCase().includes(q))
    );
  });
}
