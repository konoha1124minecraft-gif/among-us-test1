import { logGameError } from "./errorLogger";
import type {
  BeanRewardBreakdown,
  CosmeticBaseDef,
  CosmicubeDef,
  GameSettings,
  HudSettings,
  Keybinds,
  NameplateDef,
  ProgressionData,
  PublicRoomSummary,
  RoleDef,
  RoleId,
  VisorDef,
} from "./types";

export const PLAYER_COLORS = [
  { id: "red", name: "レッド", hex: "#d71e22", dark: "#7a0838" },
  { id: "blue", name: "ブルー", hex: "#1d3ce9", dark: "#09158e" },
  { id: "green", name: "グリーン", hex: "#1b913e", dark: "#0a4d2e" },
  { id: "pink", name: "ピンク", hex: "#ed54ba", dark: "#ab2bad" },
  { id: "orange", name: "オレンジ", hex: "#ef7d0d", dark: "#b33e15" },
  { id: "yellow", name: "イエロー", hex: "#f5f557", dark: "#c28722" },
  { id: "black", name: "ブラック", hex: "#3f474e", dark: "#1e1f26" },
  { id: "white", name: "ホワイト", hex: "#d6e0f0", dark: "#8394bf" },
  { id: "purple", name: "パープル", hex: "#6b2fbb", dark: "#3b177c" },
  { id: "brown", name: "ブラウン", hex: "#71491e", dark: "#5e2615" },
  { id: "cyan", name: "シアン", hex: "#38fedc", dark: "#24a8be" },
  { id: "lime", name: "ライム", hex: "#50ef39", dark: "#15a742" },
  { id: "maroon", name: "マルーン", hex: "#6b2b3c", dark: "#3e1724" },
  { id: "rose", name: "ローズピンク", hex: "#ecc0d3", dark: "#b87fa0" },
  { id: "banana", name: "バナナ", hex: "#fffebe", dark: "#d4c375" },
  { id: "gray", name: "グレー", hex: "#758593", dark: "#46515b" },
  { id: "tan", name: "タン", hex: "#918877", dark: "#51413a" },
  { id: "coral", name: "コーラルピンク", hex: "#d76464", dark: "#9c3e45" },
] as const;

export interface SkinDef extends CosmeticBaseDef {
  badge: string;
  desc: string;
}

export const PLAYER_SKINS: SkinDef[] = [
  { id: "standard", name: "標準宇宙服", badge: "STD", desc: "標準型の船外活動スーツ", free: true, theme: "starter" },
  { id: "captain", name: "艦長ユニフォーム", badge: "CPT", desc: "金章とネクタイが映える指揮官服", free: true, theme: "starter" },
  { id: "police", name: "ポリス制服", badge: "POL", desc: "黄金バッジ付きの警備隊ブルー制服", free: true, theme: "starter" },
  { id: "overalls", name: "オーバーオール", badge: "WRK", desc: "ツナギ作業着と工具ポケット", free: true, theme: "starter" },
  { id: "military", name: "ミリタリー迷彩", badge: "MIL", desc: "深緑のタクティカル戦闘ベスト", free: true, theme: "starter" },
  { id: "suit_black", name: "ブラックスーツ", badge: "SUT", desc: "赤ネクタイが決まる紳士スーツ", free: true, theme: "starter" },
  { id: "suit_white", name: "ホワイトスーツ", badge: "WHT", desc: "清潔感ある白ジャケット仕様", free: true, theme: "starter" },
  { id: "medic", name: "ドクター白衣", badge: "MED", desc: "救護白衣と医療クロス装備", free: true, theme: "starter" },
  { id: "engineer", name: "作業用ベスト", badge: "ENG", desc: "高視認性ベストと反射ライン", free: true, theme: "starter" },
  { id: "stealth", name: "ステルススーツ", badge: "STL", desc: "戦術ハーネス仕様の暗殺服", free: true, theme: "starter" },
  { id: "royal", name: "ロイヤルマント", badge: "ROY", desc: "気品ある紫マントと勲章", free: true, theme: "starter" },
  { id: "hazard", name: "ハザード防護服", badge: "HAZ", desc: "警戒ストライプの危険物作業服", free: true, theme: "starter" },
  { id: "cyber", name: "サイバーアーマー", badge: "CYB", desc: "発光回路が走る近未来スーツ", priceBeans: 300, theme: "shop" },
  { id: "dual_medic", name: "デュアル白衣×制服", badge: "DUO", desc: "白衣と警備服が融合した限定服", priceBeans: 300, theme: "shop" },
  { id: "right_hand", name: "右腕サイボーグ", badge: "RHM", desc: "機械義手と茶コートの重装スキン", priceBeans: 300, theme: "shop" },
  { id: "cube_polus_parka", name: "極寒パーカー", badge: "PLS", desc: "Polus雪山遠征用ファー付き防寒着", theme: "cube" },
  { id: "cube_mira_researcher", name: "MIRA主任白衣", badge: "MIR", desc: "MIRA研究所の最先端バイオ白衣", theme: "cube" },
  { id: "cube_airship_admiral", name: "飛行船提督礼服", badge: "AIR", desc: "豪華金装飾のエリート飛行船制服", theme: "cube" },
  { id: "cube_cosmic_knight", name: "コズミック鎧", badge: "KNT", desc: "星雲エナジーを宿す銀河騎士鎧", theme: "cube" },
];

export interface HatDef extends CosmeticBaseDef {
  icon: string;
}

export const HATS: HatDef[] = [
  { id: "none", name: "なし", icon: "", free: true, theme: "starter" },
  { id: "cap", name: "クルーキャップ", icon: "🧢", free: true, theme: "starter" },
  { id: "captain", name: "艦長帽", icon: "👨‍✈️", free: true, theme: "starter" },
  { id: "police", name: "ポリス帽", icon: "👮", free: true, theme: "starter" },
  { id: "tophat", name: "シルクハット", icon: "🎩", free: true, theme: "starter" },
  { id: "crown", name: "王冠", icon: "👑", free: true, theme: "starter" },
  { id: "halo", name: "天使の輪", icon: "😇", free: true, theme: "starter" },
  { id: "leaf", name: "双葉", icon: "🌱", free: true, theme: "starter" },
  { id: "flower", name: "ハイビスカス", icon: "🌺", free: true, theme: "starter" },
  { id: "cherry", name: "チェリー", icon: "🍒", free: true, theme: "starter" },
  { id: "fried_egg", name: "目玉焼き", icon: "🍳", free: true, theme: "starter" },
  { id: "cheese", name: "チーズ", icon: "🧀", free: true, theme: "starter" },
  { id: "banana", name: "バナナピール", icon: "🍌", free: true, theme: "starter" },
  { id: "toilet_paper", name: "トイレットペーパー", icon: "🧻", free: true, theme: "starter" },
  { id: "chef", name: "シェフ帽", icon: "👨‍🍳", free: true, theme: "starter" },
  { id: "viking", name: "バイキング兜", icon: "🛡️", free: true, theme: "starter" },
  { id: "party_cone", name: "パーティー帽", icon: "🎉", free: true, theme: "starter" },
  { id: "bird_nest", name: "鳥の巣", icon: "🪺", free: true, theme: "starter" },
  { id: "flamingo", name: "フラミンゴ浮き輪", icon: "🦩", free: true, theme: "starter" },
  { id: "headphone", name: "ヘッドホン", icon: "🎧", free: true, theme: "starter" },
  { id: "antenna", name: "アンテナ", icon: "📡", free: true, theme: "starter" },
  { id: "ufo", name: "ミニUFO", icon: "🛸", free: true, theme: "starter" },
  { id: "ribbon", name: "リボン", icon: "🎀", free: true, theme: "starter" },
  { id: "cat_ears", name: "ネコミミ", icon: "🐱", free: true, theme: "starter" },
  { id: "rabbit_ears", name: "ウサミミ", icon: "🐰", free: true, theme: "starter" },
  { id: "goggles", name: "ゴーグル", icon: "🥽", free: true, theme: "starter" },
  { id: "beret", name: "ベレー帽", icon: "🎨", free: true, theme: "starter" },
  { id: "ninja", name: "忍者鉢金", icon: "🥷", free: true, theme: "starter" },
  { id: "samurai", name: "侍兜", icon: "⚔️", free: true, theme: "starter" },
  { id: "fez", name: "フェズ帽", icon: "🎩", free: true, theme: "starter" },
  { id: "paper_hat", name: "紙兜", icon: "🗞️", free: true, theme: "starter" },

  // 150-250 Bean Shop Hats (Reference Image #1, #2, #8)
  { id: "headband_blue", name: "ブルーバンダナ", icon: "🟦", priceBeans: 150, theme: "shop" },
  { id: "backward_cap_blue", name: "後ろ向きキャップ", icon: "🧢", priceBeans: 150, theme: "shop" },
  { id: "visor_sun", name: "サンバイザー", icon: "🕶️", priceBeans: 150, theme: "shop" },
  { id: "beanie_black", name: "ビーニー黒", icon: "🖤", priceBeans: 200, theme: "shop" },
  { id: "beanie_blue", name: "ビーニー青", icon: "💙", priceBeans: 200, theme: "shop" },
  { id: "beanie_pink", name: "ビーニー桃", icon: "🩷", priceBeans: 200, theme: "shop" },
  { id: "beanie_purple", name: "ビーニー紫", icon: "💜", priceBeans: 200, theme: "shop" },
  { id: "beanie_red", name: "ビーニー赤", icon: "❤️", priceBeans: 200, theme: "shop" },
  { id: "beanie_white", name: "ビーニー白", icon: "🤍", priceBeans: 200, theme: "shop" },
  { id: "beanie_gold", name: "ビーニー黄", icon: "💛", priceBeans: 200, theme: "shop" },
  { id: "slime_purple", name: "スライム乗せ紫", icon: "👾", priceBeans: 250, theme: "shop" },
  { id: "slime_red", name: "スライム乗せ赤", icon: "👾", priceBeans: 250, theme: "shop" },
  { id: "slime_white", name: "スライム乗せ白", icon: "👾", priceBeans: 250, theme: "shop" },
  { id: "slime_yellow", name: "スライム乗せ黄", icon: "👾", priceBeans: 250, theme: "shop" },
  { id: "plunger", name: "ラバーカップ赤", icon: "🪠", priceBeans: 250, theme: "shop" },
  { id: "plunger_blue", name: "ラバーカップ青", icon: "🪠", priceBeans: 250, theme: "shop" },
  { id: "plunger_gold", name: "ラバーカップ金", icon: "🪠", priceBeans: 250, theme: "shop" },
  { id: "sheriff_black", name: "黒シェリフ帽", icon: "🤠", priceBeans: 250, theme: "shop" },
  { id: "sheriff_silver", name: "銀シェリフ帽", icon: "🤠", priceBeans: 250, theme: "shop" },
  { id: "miner_lamp", name: "探検ライト帽", icon: "⛏️", priceBeans: 250, theme: "shop" },

  // Halloween Collection (Reference Image #7)
  { id: "halloween_tophat", name: "怪盗ミニハット", icon: "🎩", priceBeans: 200, theme: "halloween" },
  { id: "halloween_cat", name: "黒猫ヘッド", icon: "🐈‍⬛", priceBeans: 200, theme: "halloween" },
  { id: "bat_wings", name: "コウモリの翼", icon: "🦇", priceBeans: 250, theme: "halloween" },
  { id: "horns", name: "デビルホーン", icon: "😈", priceBeans: 200, theme: "halloween" },
  { id: "pumpkin", name: "パンプキン", icon: "🎃", priceBeans: 250, theme: "halloween" },
  { id: "paper_bag", name: "紙袋マスク", icon: "🛍️", priceBeans: 200, theme: "halloween" },
  { id: "wizard", name: "ウィザード帽", icon: "🧙", priceBeans: 250, theme: "halloween" },
  { id: "wolf_ears", name: "ウルフイヤー", icon: "🐺", priceBeans: 250, theme: "halloween" },
  { id: "pirate", name: "ドクロ海賊帽", icon: "🏴‍☠️", priceBeans: 250, theme: "halloween" },
  { id: "knife_head", name: "刺さりナイフ", icon: "🔪", priceBeans: 300, theme: "halloween" },

  // Christmas Collection (Reference Image #7)
  { id: "snowman_hat", name: "ミニ雪だるま", icon: "⛄", priceBeans: 250, theme: "christmas" },
  { id: "reindeer_antlers", name: "トナカイの角", icon: "🦌", priceBeans: 250, theme: "christmas" },
  { id: "fairy_lights", name: "電飾イルミ", icon: "💡", priceBeans: 250, theme: "christmas" },
  { id: "santa", name: "サンタ帽", icon: "🎅", priceBeans: 200, theme: "christmas" },
  { id: "xmas_tree", name: "ツリー帽", icon: "🎄", priceBeans: 250, theme: "christmas" },
  { id: "present_box", name: "プレゼント箱", icon: "🎁", priceBeans: 250, theme: "christmas" },
  { id: "candy_canes", name: "キャンディケイン", icon: "🍬", priceBeans: 200, theme: "christmas" },
  { id: "elf_hat", name: "エルフ帽", icon: "🧝", priceBeans: 250, theme: "christmas" },

  // Cosmicube / Achievement Exclusives
  { id: "cube_polus_ushanka", name: "極地ウシャンカ", icon: "❄️", theme: "cube" },
  { id: "cube_mira_visor_helm", name: "MIRA研究ヘルメット", icon: "🔬", theme: "cube" },
  { id: "cube_airship_tophat", name: "飛行船ダブルシルク", icon: "🎩", theme: "cube" },
  { id: "cube_cosmic_halo", name: "星雲オーラ冠", icon: "✨", theme: "cube" },
  { id: "laurel_wreath", name: "月桂冠", icon: "🏆", unlockReq: "インポスターで3勝", theme: "bundle" },
  { id: "ace_visor", name: "エースバイザー", icon: "🚀", unlockReq: "180秒以内クルー勝利", theme: "bundle" },
  { id: "nebula_crown", name: "ネビュラクラウン", icon: "🌌", unlockReq: "名探偵またはタスク累計15回", theme: "bundle" },
  { id: "cyber_oni", name: "サイバー鬼面", icon: "👹", unlockReq: "キル累計3回達成", theme: "bundle" },
  { id: "star_commander", name: "司令官帽", icon: "⭐", unlockReq: "第三陣営で1勝", theme: "bundle" },
];

export const VISORS: VisorDef[] = [
  { id: "none", name: "なし", desc: "素のバイザー", free: true, theme: "starter" },
  { id: "hockey_mask", name: "ホッケーマスク", desc: "赤目穴の恐怖ジェイソン仮面", free: true, theme: "starter" },
  { id: "smile_mask", name: "スマイルマスク", desc: "怪しく笑う白い口元マスク", free: true, theme: "starter" },
  { id: "plague_beak", name: "ペスト医師マスク", desc: "赤ゴーグル付きの黒い嘴マスク", free: true, theme: "starter" },
  { id: "narrow_eyes", name: "ジト目・真剣", desc: "鋭く睨むブラックアイライン", free: true, theme: "starter" },
  { id: "dum_yellow", name: "DUMメモ (黄)", desc: "定番おふざけ「DUM」付箋", free: true, theme: "starter" },

  // 100-Bean Visors (Reference Image #9, #10)
  { id: "dum_cyan", name: "DUMメモ (水)", desc: "クールな水色のDUM付箋", priceBeans: 100, theme: "shop" },
  { id: "dum_green", name: "DUMメモ (緑)", desc: "ライムグリーンのDUM付箋", priceBeans: 100, theme: "shop" },
  { id: "dum_orange", name: "DUMメモ (橙)", desc: "オレンジ色のDUM付箋", priceBeans: 100, theme: "shop" },
  { id: "dum_pink", name: "DUMメモ (桃)", desc: "ピンク色のDUM付箋", priceBeans: 100, theme: "shop" },
  { id: "dum_purple", name: "DUMメモ (紫)", desc: "パープル色のDUM付箋", priceBeans: 100, theme: "shop" },
  { id: "blush", name: "照れチーク", desc: "ほっぺがピンクに染まる可愛い装飾", priceBeans: 100, theme: "shop" },
  { id: "smug", name: "ドヤ顔スマイル", desc: "口角が上がった余裕の表情", priceBeans: 100, theme: "shop" },
  { id: "happy_eyes", name: "にっこり (^^)", desc: "ご機嫌なアーチ状の笑顔アイ", priceBeans: 100, theme: "shop" },
  { id: "cracked_glass", name: "ひび割れガラス", desc: "激戦の跡が残るクラックバイザー", priceBeans: 120, theme: "shop" },
  { id: "mud_splash", name: "泥はね汚れ", desc: "作業終わりのワイルドな泥しぶき", priceBeans: 100, theme: "shop" },
  { id: "three_dots", name: "無言ドット (...)", desc: "じっと見つめる三点リーダー", priceBeans: 100, theme: "shop" },
  { id: "eyepatch_left", name: "左眼帯", desc: "ワイルドな海賊風の黒眼帯", priceBeans: 120, theme: "shop" },
  { id: "eyepatch_right", name: "右眼帯", desc: "逆側装着のスタイリッシュ眼帯", priceBeans: 120, theme: "shop" },
  { id: "pipe_red", name: "紳士パイプ (赤)", desc: "上品な赤い喫煙パイプ風小道具", priceBeans: 150, theme: "shop" },
  { id: "pipe_brown", name: "探偵パイプ (茶)", desc: "名探偵愛用の木製パイプ", priceBeans: 150, theme: "shop" },
  { id: "piercing", name: "ゴールドピアス", desc: "バイザー横に光る金のピアス", priceBeans: 120, theme: "shop" },
  { id: "ski_goggles", name: "スキーゴーグル", desc: "反射レンズの大型スポーツゴーグル", priceBeans: 150, theme: "shop" },
  { id: "round_sunglasses", name: "丸サングラス", desc: "クールな黒丸フレームサングラス", priceBeans: 150, theme: "shop" },
  { id: "wheat_straw", name: "くわえ麦わら", desc: "保安官気分の一本草スタイル", priceBeans: 100, theme: "shop" },

  // Cosmicube Visors
  { id: "cube_snow_visor", name: "スノー反射グラス", desc: "雪山吹雪対応のオレンジゴーグル", theme: "cube" },
  { id: "cube_cyber_scouter", name: "電脳スカウター", desc: "解析数値を投影するサイバー片眼鏡", theme: "cube" },
  { id: "cube_gold_monocle", name: "黄金モノクル", desc: "提督専用の気品ある片眼鏡と髭", theme: "cube" },
  { id: "cube_star_shades", name: "スターサングラス", desc: "星型フレームの派手な銀河グラサン", theme: "cube" },
];

export interface PetDef extends CosmeticBaseDef {
  icon: string;
}

export const PETS: PetDef[] = [
  { id: "none", name: "ペットなし", icon: "—", free: true, theme: "starter" },
  { id: "mini_crew", name: "ミニクルー", icon: "👾", free: true, theme: "starter" },
  { id: "alien", name: "ベビースライム", icon: "👽", priceBeans: 350, theme: "bundle" },
  { id: "ufo_pet", name: "ミニUFOドローン", icon: "🛸", priceBeans: 350, theme: "bundle" },
  { id: "flat_crab", name: "ヒラガニ", icon: "🦀", priceBeans: 350, theme: "bundle" },
  { id: "tentacle_alien", name: "触手エイリアン", icon: "🐙", priceBeans: 350, theme: "bundle" },
  { id: "blue_alien_dog", name: "青いエイリアン犬", icon: "🐕", priceBeans: 400, theme: "bundle" },
  { id: "hamster_ball", name: "ハムスターボール", icon: "🐹", priceBeans: 400, theme: "bundle" },
  { id: "stickmin_red", name: "レッドスティックマン", icon: "🏃", priceBeans: 450, theme: "bundle" },
  { id: "stickmin_white", name: "ホワイトスティックマン", icon: "🤸", priceBeans: 450, theme: "bundle" },
  { id: "mini_crew_top", name: "頭乗せミニクルー", icon: "🧸", priceBeans: 400, theme: "bundle" },
  { id: "mini_crew_pink", name: "ピンクミニクルー", icon: "🩷", priceBeans: 400, theme: "bundle" },
  { id: "robot", name: "メカロボット", icon: "🤖", priceBeans: 450, theme: "bundle" },
  { id: "cat_pet", name: "スペースキャット", icon: "🐱", priceBeans: 300, theme: "shop" },
  { id: "dog_pet", name: "スペースドッグ", icon: "🐶", priceBeans: 300, theme: "shop" },
  { id: "slime", name: "エナジースライム", icon: "💧", priceBeans: 300, theme: "shop" },
  { id: "ghost_pet", name: "ピクセルゴースト", icon: "👻", priceBeans: 350, theme: "shop" },
  { id: "cube_snow_fox", name: "白銀スノーフォックス", icon: "🦊", theme: "cube" },
  { id: "cube_toppat_mini", name: "シルクミニクルー", icon: "🎩", theme: "cube" },
  { id: "star_dragon", name: "スタードラゴン", icon: "🐉", unlockReq: "インポスターで1勝", theme: "bundle" },
  { id: "quantum_owl", name: "量子フクロウ", icon: "🦉", unlockReq: "死体を5回最初に発見", theme: "bundle" },
  { id: "plasma_fox", name: "プラズマキツネ", icon: "🦊", unlockReq: "累計3キル達成", theme: "bundle" },
  { id: "crystal_crab", name: "クリスタルクラブ", icon: "🦀", unlockReq: "タスク累計10回完了", theme: "bundle" },
  { id: "nebula_jelly", name: "星雲クラゲ", icon: "🪼", unlockReq: "クルーで1勝", theme: "bundle" },
  { id: "astro_penguin", name: "宇宙ペンギン", icon: "🐧", unlockReq: "会議チャット5回以上", theme: "bundle" },
  { id: "mecha_beetle", name: "メカカブト", icon: "🪲", unlockReq: "試合を10回プレイ", theme: "bundle" },
];

export const NAMEPLATES: NameplateDef[] = [
  {
    id: "none",
    name: "スタンダード",
    bgGradient: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.92))",
    borderColor: "#334155",
    accentEmoji: "🚀",
    desc: "標準クルーカード",
    free: true,
    theme: "starter",
  },
  {
    id: "crimson_alert",
    name: "レッドアラート",
    bgGradient: "linear-gradient(135deg, rgba(127,29,29,0.92), rgba(15,23,42,0.95))",
    borderColor: "#ef4444",
    accentEmoji: "🚨",
    desc: "緊急警報の深紅プレート",
    free: true,
    theme: "starter",
  },
  {
    id: "neon_grid",
    name: "サイバーネオン",
    bgGradient: "linear-gradient(135deg, rgba(8,51,68,0.94), rgba(30,27,75,0.94))",
    borderColor: "#22d3ee",
    accentEmoji: "⚡",
    desc: "電脳グリッドが輝くシアンカード",
    priceBeans: 150,
    theme: "shop",
  },
  {
    id: "gold_vip",
    name: "ロイヤルゴールド",
    bgGradient: "linear-gradient(135deg, rgba(113,63,18,0.92), rgba(24,24,27,0.95))",
    borderColor: "#facc15",
    accentEmoji: "👑",
    desc: "黄金の縁取りが眩しいVIPプレート",
    priceBeans: 250,
    theme: "shop",
  },
  {
    id: "cherry_blossom",
    name: "サクラフラッシュ",
    bgGradient: "linear-gradient(135deg, rgba(131,24,67,0.9), rgba(15,23,42,0.94))",
    borderColor: "#f472b6",
    accentEmoji: "🌸",
    desc: "桜舞うローズピンクのカード",
    priceBeans: 200,
    theme: "shop",
  },
  {
    id: "arctic_ice",
    name: "ポーラーアイス",
    bgGradient: "linear-gradient(135deg, rgba(12,74,110,0.92), rgba(30,58,138,0.9))",
    borderColor: "#7dd3fc",
    accentEmoji: "❄️",
    desc: "極寒の氷結晶プレート",
    priceBeans: 200,
    theme: "shop",
  },
  {
    id: "cube_polus_card",
    name: "Polus探索隊証",
    bgGradient: "linear-gradient(135deg, rgba(22,78,99,0.94), rgba(49,46,129,0.92))",
    borderColor: "#38bdf8",
    accentEmoji: "🏔️",
    desc: "Polusキューブ限定の隊員証",
    theme: "cube",
  },
  {
    id: "cube_airship_card",
    name: "飛行船VIP搭乗券",
    bgGradient: "linear-gradient(135deg, rgba(120,53,15,0.94), rgba(88,28,135,0.92))",
    borderColor: "#fbbf24",
    accentEmoji: "🎈",
    desc: "飛行船キューブ限定の金色チケット",
    theme: "cube",
  },
  {
    id: "cube_cosmic_card",
    name: "ギャラクシー星雲",
    bgGradient: "linear-gradient(135deg, rgba(88,28,135,0.94), rgba(15,23,42,0.95))",
    borderColor: "#e879f9",
    accentEmoji: "🌌",
    desc: "コズミックキューブ最終報酬カード",
    theme: "cube",
  },
];

export const COSMICUBES: CosmicubeDef[] = [
  {
    id: "cube_polus",
    name: "Polus極寒キューブ",
    subtitle: "極地探査用の防寒スキンと氷結装備ツリー",
    priceBeans: 2000,
    accent: "#38bdf8",
    icon: "❄️",
    nodes: [
      { id: "polus_1", title: "極地ウシャンカ帽", costBeans: 150, rewardKind: "hat", rewardId: "cube_polus_ushanka", parentId: null, xPct: 16, yPct: 50 },
      { id: "polus_2", title: "スノー反射グラス", costBeans: 200, rewardKind: "visor", rewardId: "cube_snow_visor", parentId: "polus_1", xPct: 44, yPct: 26 },
      { id: "polus_3", title: "Polus探索隊証", costBeans: 200, rewardKind: "nameplate", rewardId: "cube_polus_card", parentId: "polus_1", xPct: 44, yPct: 74 },
      { id: "polus_4", title: "極寒パーカー", costBeans: 350, rewardKind: "skin", rewardId: "cube_polus_parka", parentId: "polus_2", xPct: 76, yPct: 30 },
      { id: "polus_5", title: "白銀スノーフォックス", costBeans: 450, rewardKind: "pet", rewardId: "cube_snow_fox", parentId: "polus_3", xPct: 76, yPct: 70 },
    ],
  },
  {
    id: "cube_mira",
    name: "MIRAバイオキューブ",
    subtitle: "研究施設の高機動サイバー・科学者ツリー",
    priceBeans: 3200,
    accent: "#34d399",
    icon: "🔬",
    nodes: [
      { id: "mira_1", title: "電脳スカウター", costBeans: 200, rewardKind: "visor", rewardId: "cube_cyber_scouter", parentId: null, xPct: 16, yPct: 50 },
      { id: "mira_2", title: "MIRA研究ヘルメット", costBeans: 250, rewardKind: "hat", rewardId: "cube_mira_visor_helm", parentId: "mira_1", xPct: 48, yPct: 28 },
      { id: "mira_3", title: "MIRA主任白衣", costBeans: 380, rewardKind: "skin", rewardId: "cube_mira_researcher", parentId: "mira_1", xPct: 48, yPct: 72 },
      { id: "mira_4", title: "メカロボット", costBeans: 500, rewardKind: "pet", rewardId: "robot", parentId: "mira_2", xPct: 80, yPct: 50 },
    ],
  },
  {
    id: "cube_airship",
    name: "飛行船トッパットキューブ",
    subtitle: "空中要塞を統べる紳士・怪盗の豪華ツリー",
    priceBeans: 5000,
    accent: "#facc15",
    icon: "🎩",
    nodes: [
      { id: "air_1", title: "黄金モノクル", costBeans: 250, rewardKind: "visor", rewardId: "cube_gold_monocle", parentId: null, xPct: 14, yPct: 50 },
      { id: "air_2", title: "飛行船ダブルシルク", costBeans: 320, rewardKind: "hat", rewardId: "cube_airship_tophat", parentId: "air_1", xPct: 44, yPct: 24 },
      { id: "air_3", title: "飛行船VIP搭乗券", costBeans: 300, rewardKind: "nameplate", rewardId: "cube_airship_card", parentId: "air_1", xPct: 44, yPct: 76 },
      { id: "air_4", title: "飛行船提督礼服", costBeans: 450, rewardKind: "skin", rewardId: "cube_airship_admiral", parentId: "air_2", xPct: 76, yPct: 28 },
      { id: "air_5", title: "シルクミニクルー", costBeans: 550, rewardKind: "pet", rewardId: "cube_toppat_mini", parentId: "air_3", xPct: 76, yPct: 72 },
    ],
  },
  {
    id: "cube_cosmic",
    name: "ギャラクシー星雲キューブ",
    subtitle: "最上位ランク向け・宇宙騎士セット完全収録",
    priceBeans: 7000,
    accent: "#e879f9",
    icon: "🌌",
    nodes: [
      { id: "cos_1", title: "スターサングラス", costBeans: 300, rewardKind: "visor", rewardId: "cube_star_shades", parentId: null, xPct: 15, yPct: 50 },
      { id: "cos_2", title: "星雲オーラ冠", costBeans: 400, rewardKind: "hat", rewardId: "cube_cosmic_halo", parentId: "cos_1", xPct: 46, yPct: 26 },
      { id: "cos_3", title: "ギャラクシー星雲", costBeans: 380, rewardKind: "nameplate", rewardId: "cube_cosmic_card", parentId: "cos_1", xPct: 46, yPct: 74 },
      { id: "cos_4", title: "コズミック鎧", costBeans: 600, rewardKind: "skin", rewardId: "cube_cosmic_knight", parentId: "cos_2", xPct: 80, yPct: 50 },
    ],
  },
];

export const KILL_EFFECTS = [
  { id: "classic", name: "クラシック斬撃", icon: "🔪" },
  { id: "glitch", name: "データ崩壊グリッチ", icon: "👾" },
  { id: "supernova", name: "スーパーノヴァ爆散", icon: "💥" },
  { id: "freeze", name: "絶対零度アイス", icon: "❄️" },
  { id: "void", name: "ヴォイド吸収", icon: "🕳️" },
  { id: "thunder", name: "プラズマ落雷", icon: "⚡", unlockReq: "インポスターで1勝" },
  { id: "blackhole", name: "マイクロブラックホール", icon: "🌀", unlockReq: "誰にも見られずキル成功" },
  { id: "stardust", name: "スターダスト消失", icon: "✨", unlockReq: "第三陣営で1勝" },
] as const;

export const ROLES: Record<RoleId, RoleDef> = {
  crewmate: {
    id: "crewmate",
    name: "Crewmate",
    jp: "クルーメイト",
    team: "crew",
    color: "#38bdf8",
    desc: "全タスクの完了、または投票による全インポスター追放で勝利します。",
    balance: "標準視界・投票による推理の要。",
    tip: "行動ルートを覚え、誰とすれ違ったかを会議で共有しよう。",
  },
  sheriff: {
    id: "sheriff",
    name: "Sheriff",
    jp: "シェリフ",
    team: "crew",
    color: "#facc15",
    desc: "人狼・ジャッカルを[Q]で直接成敗できる正義の保安官。誤射すると自分が死亡！",
    balance: "インポスター・ジャッカル以外の誤射は自爆ペナルティ。",
    tip: "確信が持てるまで撃たないこと。現場抑え時のみ[Q]を使用！",
  },
  engineer: {
    id: "engineer",
    name: "Engineer",
    jp: "エンジニア",
    team: "crew",
    color: "#34d399",
    desc: "ベント([V])を使用して高速移動可能！さらに[F]でどこからでも1回だけ遠隔サボタージュ修理。",
    balance: "ベントは一度に6秒まで、クールダウンあり。",
    tip: "ベント内に潜んで犯行を目撃する罠が強力。長居は禁物！",
  },
  doctor: {
    id: "doctor",
    name: "Doctor",
    jp: "ドクター",
    team: "crew",
    color: "#fb7185",
    desc: "1試合1回、[F]キーで至近距離の味方にシールド付与、または発見した死体を蘇生できます！",
    balance: "1マッチ1回限りの強力な保護・蘇生カード。",
    tip: "死体に近づいて[F]で蘇生！白確した相棒にシールドも有効。",
  },
  detective: {
    id: "detective",
    name: "Detective",
    jp: "ディテクティブ",
    team: "crew",
    color: "#60a5fa",
    desc: "足跡や[F]死体調査で経過時間・犯人カラーの手掛かりを取得できます。",
    balance: "調査で正確な経過時間とヒントを取得可能。",
    tip: "死体近くで[F]を押し、犯行時刻と足跡方向を会議で報告しよう。",
  },
  radar: {
    id: "radar",
    name: "Radar",
    jp: "レーダー",
    team: "crew",
    color: "#22d3ee",
    desc: "[F]キーで一時的に一番近い生存者への方向をレーダー検知できます。",
    balance: "クールダウン30秒・短時間探知。",
    tip: "孤立しているプレイヤーの方向を[F]で探知し、死体発見やアリバイ作りに活用。",
  },
  mayor: {
    id: "mayor",
    name: "Mayor",
    jp: "メイヤー",
    team: "crew",
    color: "#c084fc",
    desc: "会議での投票が2票分としてカウントされる重要人物。通常タスク数は少なめ。",
    balance: "終盤の接戦投票で強力な決定権を持つ。",
    tip: "終盤まで生き残ることが最重要。あなたの2票が勝敗を決める！",
  },
  security: {
    id: "security",
    name: "Security",
    jp: "セキュリティ",
    team: "crew",
    color: "#a7f3d0",
    desc: "[F]キーでどこからでも監視カメラ映像を5秒間チェックできます。",
    balance: "クールダウン30秒・映像は全カメラ切替可。",
    tip: "人の動きが止まった区画を[F]監視カメラで即座にチェックしよう。",
  },
  tracker: {
    id: "tracker",
    name: "Tracker",
    jp: "トラッカー",
    team: "crew",
    color: "#2dd4bf",
    desc: "近くの1人に[F]でGPS発信機を装着し、18秒間マップや矢印で位置を追跡できます！",
    balance: "1回の追跡は18秒・クールダウン32秒。",
    tip: "怪しい人物とすれ違いざまに[F]でGPSを仕掛け、行動を監視しよう。",
  },
  teleporter: {
    id: "teleporter",
    name: "Teleporter",
    jp: "テレポーター",
    team: "crew",
    color: "#38bdf8",
    desc: "[F]キーで位置記憶パッドを設置し、次の[F]キーでその場へ瞬間帰還できます！",
    balance: "帰還後クールダウン34秒・記憶は1箇所まで。",
    tip: "中央付近にパッドを置いておき、遠方タスク後の帰還や逃走に即利用しよう。",
  },
  psychic: {
    id: "psychic",
    name: "Psychic",
    jp: "サイキック",
    team: "crew",
    color: "#c084fc",
    desc: "生存者同士の距離や位置関係から、現在最も危険な陣営の手掛かりを[F]で1回スキャン。",
    balance: "クールダウン35秒・陣営数ヒント取得。",
    tip: "複数人が離れたタイミングに[F]霊視で誰か一人が人狼陣営かのヒントを得よう。",
  },
  impostor: {
    id: "impostor",
    name: "Impostor",
    jp: "インポスター",
    team: "impostor",
    color: "#ef4444",
    desc: "キル[Q]・ベント[V]・サボタージュ[C]を駆使してクルーを全滅（同数以下）させよう！",
    balance: "広い視界と壁抜けベントで暗躍する基本人狼。",
    tip: "停電や炉心妨害[C]で視線・動線を分断してから孤立者を[Q]で狙おう。",
  },
  phantom: {
    id: "phantom",
    name: "Phantom",
    jp: "ファントム",
    team: "impostor",
    color: "#f43f5e",
    desc: "[F]キーで6秒間透明化できるステルス特化インポスター。",
    balance: "透明中は微弱な気配を残す。解除後にクールあり。",
    tip: "透明[F]で近づき暗殺し、ベントで別の部屋へ抜けてアリバイを偽装しよう。",
  },
  madscientist: {
    id: "madscientist",
    name: "Mad Scientist",
    jp: "マッドサイエンティスト",
    team: "impostor",
    color: "#fb923c",
    desc: "サボタージュのクールダウンが短く、緊急妨害で船内を混乱させやすい人狼。",
    balance: "妨害回転率が高いが、単独行動に注意。",
    tip: "序盤から高頻度でサボタージュ[C]を仕掛け、クルーのタスク進行を徹底妨害！",
  },
  viper: {
    id: "viper",
    name: "Viper",
    jp: "ヴァイパー",
    team: "impostor",
    color: "#10b981",
    desc: "倒した死体が20秒後に溶解して消滅する毒殺インポスター！",
    balance: "死体が消滅するため通報リスクが大幅に減少。",
    tip: "人通りの少ない隅でキルすれば20秒後に証拠ごと消滅する。",
  },
  shapeshifter: {
    id: "shapeshifter",
    name: "Shapeshifter",
    jp: "シェイプシフター",
    team: "impostor",
    color: "#d946ef",
    desc: "[F]キーで近くにいる他のプレイヤーの姿・名前に18秒間変身して罪をなすりつけられる！",
    balance: "変身中は本人と色・名前・帽子のすべてが同期。",
    tip: "別室で[F]変身し、他の人の目がある場所でわざとキルやベントを見せて冤罪を作ろう。",
  },
  jester: {
    id: "jester",
    name: "Jester",
    jp: "テルテル",
    team: "neutral",
    color: "#f472b6",
    desc: "【第三陣営】会議の投票で自分が追放されると即座に単独勝利！",
    balance: "キルはできないため怪しい言動で吊られよう。",
    tip: "タスクをせず怪しく立ち回り、会議でわざと矛盾したアリバイを言おう。",
  },
  jackal: {
    id: "jackal",
    name: "Jackal",
    jp: "ジャッカル",
    team: "neutral",
    color: "#a855f7",
    desc: "【第三陣営】クルーもインポスターも関係なく全員キル[Q]可能！最後の生き残りで勝利。",
    balance: "ベント移動もでき、単独で全員を敵に回す狩人。",
    tip: "インポスターとクルーが潰し合うのを待ちつつ、孤立者を静かに減らそう。",
  },
  arsonist: {
    id: "arsonist",
    name: "Arsonist",
    jp: "アーソニスト",
    team: "neutral",
    color: "#f97316",
    desc: "【第三陣営】[Q]で生存者全員にオイルを塗り、全員塗布後に[F]点火で即座に勝利！",
    balance: "塗布に近づく必要があるため自然な振る舞いが鍵。",
    tip: "人の集まる場所やタスク中にさりげなく近寄って[Q]オイル塗布を稼ごう。",
  },
  survivor: {
    id: "survivor",
    name: "Survivor",
    jp: "サバイバー",
    team: "neutral",
    color: "#a3e635",
    desc: "【第三陣営】誰が勝っても関係なし！[F]シールド(1試合2回)を駆使しゲーム終了まで生き残れば勝利！",
    balance: "キルもタスク義務もない完全中立枠。",
    tip: "単独行動は避けつつも危険を感じたら[F]シールドで防衛し、最後まで生き残ろう。",
  },
  executioner: {
    id: "executioner",
    name: "Executioner",
    jp: "エクスキューショナー",
    team: "neutral",
    color: "#fbbf24",
    desc: "【第三陣営】指定されたターゲット1名を会議投票で追放させると即勝利！",
    balance: "ターゲットが会議前に殺害されるとテルテル(Jester)に転向。",
    tip: "ターゲット(🎯)の動きを常に監視し、怪しい行動を見つけて真っ先に吊り誘導しよう！",
  },
};

export const EXTRA_ROLE_IDS: RoleId[] = [
  "sheriff",
  "engineer",
  "doctor",
  "detective",
  "radar",
  "mayor",
  "security",
  "tracker",
  "teleporter",
  "psychic",
  "phantom",
  "madscientist",
  "viper",
  "shapeshifter",
  "jester",
  "jackal",
  "arsonist",
  "survivor",
  "executioner",
];

export const ROLE_TO_TEAM: Record<RoleId, "crew" | "impostor" | "neutral"> = Object.fromEntries(
  Object.values(ROLES).map((r) => [r.id, r.team])
) as Record<RoleId, "crew" | "impostor" | "neutral">;

export const isImpostorRole = (role: RoleId): boolean => ROLES[role]?.team === "impostor";
export const isCrewRole = (role: RoleId): boolean => ROLES[role]?.team === "crew";
export const isNeutralRole = (role: RoleId): boolean => ROLES[role]?.team === "neutral";
export const hasTasksRole = (role: RoleId): boolean =>
  isCrewRole(role) || role === "survivor";

export function canUseVentRole(role: RoleId): boolean {
  return isImpostorRole(role) || role === "engineer" || role === "jackal";
}

export const QUICK_CHAT_CATEGORIES = [
  {
    id: "location",
    label: "📍場所",
    accent: "#38bdf8",
    items: [
      { id: "loc1", text: "ブリッジ（中央）にいました" },
      { id: "loc2", text: "医務室でタスク中でした" },
      { id: "loc3", text: "原子炉〜エンジン付近にいました" },
      { id: "loc4", text: "電気室〜格納庫側にいました" },
      { id: "loc5", text: "武器庫〜シールド側にいました" },
      { id: "loc6", text: "さっきまで監視カメラを見てました" },
    ],
  },
  {
    id: "suspect",
    label: "🔍疑い",
    accent: "#fb7185",
    items: [
      { id: "sus1", text: "誰かがベントから出るのを目撃！" },
      { id: "sus2", text: "死体の近くから逃げていく人を見ました" },
      { id: "sus3", text: "タスクのフリ（バーが増えない）をしてました" },
      { id: "sus4", text: "一人だけずっとついてきて怪しいです" },
      { id: "sus5", text: "停電中に動線が変でした" },
    ],
  },
  {
    id: "alibi",
    label: "🛡️弁明",
    accent: "#34d399",
    items: [
      { id: "ali1", text: "目撃者がいるので私は白です！" },
      { id: "ali2", text: "タスクをしていました（誰かと同室）" },
      { id: "ali3", text: "私は通報者で死体を発見したばかりです" },
      { id: "ali4", text: "シェリフ/エンジニア等、役職COできます" },
    ],
  },
  {
    id: "vote",
    label: "🗳️進行",
    accent: "#facc15",
    items: [
      { id: "vot1", text: "今回は情報不足なのでスキップしましょう" },
      { id: "vot2", text: "ローラー（交互に吊り）しましょう" },
      { id: "vot3", text: "残り人数が危ないので誰か吊りましょう！" },
      { id: "vot4", text: "次のターン、二人一組で行動しましょう" },
    ],
  },
] as const;

export const STAMPS = [
  { id: "ok", label: "了解！", caption: "OK", bg: "#0284c7", accent: "#7dd3fc" },
  { id: "sus", label: "怪しい！", caption: "SUS", bg: "#be123c", accent: "#fda4af" },
  { id: "white", label: "完全白！", caption: "SAFE", bg: "#047857", accent: "#6ee7b7" },
  { id: "skip", label: "スキップ", caption: "SKIP", bg: "#b45309", accent: "#fde047" },
  { id: "vent", label: "ベント目撃", caption: "VENT!", bg: "#7e22ce", accent: "#d8b4fe" },
  { id: "gg", label: "ナイス！", caption: "GG", bg: "#0f766e", accent: "#5eead4" },
] as const;

export const DEFAULT_KEYBINDS: Keybinds = {
  moveUp: "KeyW",
  moveDown: "KeyS",
  moveLeft: "KeyA",
  moveRight: "KeyD",
  use: "KeyE",
  report: "KeyR",
  kill: "KeyQ",
  vent: "KeyV",
  sabotage: "KeyC",
  ability: "KeyF",
  map: "Tab",
};

export function formatKeyLabel(code: string): string {
  if (!code) return "?";
  if (code.startsWith("Key")) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  if (code === "Space") return "SPACE";
  if (code === "Tab") return "TAB";
  if (code === "ShiftLeft" || code === "ShiftRight") return "SHIFT";
  if (code === "ArrowUp") return "↑";
  if (code === "ArrowDown") return "↓";
  if (code === "ArrowLeft") return "←";
  if (code === "ArrowRight") return "→";
  return code;
}

export const DEFAULT_SETTINGS: GameSettings = {
  mapId: "starship",
  impostorCount: 1,
  maxPlayers: 10,
  killCooldown: 24,
  emergencyMeetings: 2,
  meetingTime: 90,
  playerSpeed: 1.0,
  crewVision: 1.0,
  impostorVision: 1.35,
  tasksPerPlayer: 6,
  taskDifficulty: "HARD",
  enableMapGimmicks: true,
  anonymousVoting: false,
  confirmEjects: true,
  allowSpectators: true,
  enableExtraRoles: true,
  enabledRoles: Object.fromEntries(EXTRA_ROLE_IDS.map((id) => [id, true])),
  cameraBatteryLimit: false,
  inGameChat: true,
  roomPublic: true,
  aiCount: 6,
  aiDifficulty: "normal",
};

export const DEFAULT_HUD_SETTINGS: HudSettings = {
  showNavArrows: true,
  showTaskList: true,
};

export const DEFAULT_PROGRESSION: ProgressionData = {
  beans: 0,
  xp: 0,
  level: 1,
  unlockedItems: [],
  unlockedCubes: [],
  activeCubeId: null,
  unlockedCubeNodes: [],
  matchesPlayed: 0,
  crewWins: 0,
  impostorWins: 0,
  neutralWins: 0,
  totalTasks: 0,
  totalKills: 0,
  correctEjects: 0,
  ghostAssists: 0,
  chatsSent: 0,
  firstBodyReports: 0,
  shadowAssassins: 0,
  perfectTaskWins: 0,
  closeCallSaves: 0,
  maxEjectsInMatch: 0,
  fastestCrewWinSec: null,
  uniqueCosmeticsUsed: [],
  customFullLoadoutMatches: 0,
  unlockedAchievements: [],
  sandboxUnlockAll: false,
};

export const ACHIEVEMENTS = [
  { id: "first_match", title: "初航海", icon: "🚀", desc: "初めて対戦を最後までプレイ", rewardText: "" },
  { id: "crew_win_1", title: "船内の守護者", icon: "🛡️", desc: "クルー陣営で1回勝利", rewardText: "ペット: 星雲クラゲ" },
  { id: "imp_win_1", title: "深宇宙の捕食者", icon: "🔪", desc: "インポスター陣営で1回勝利", rewardText: "ペット: スタードラゴン / 演出: プラズマ落雷" },
  { id: "neutral_win_1", title: "混沌の支配者", icon: "🎭", desc: "第三陣営で1回勝利", rewardText: "ハット: 司令官帽 / 演出: スターダスト消失" },
  { id: "task_master", title: "熟練クルー", icon: "⚡", desc: "累計10回タスクを完了", rewardText: "ペット: クリスタルクラブ" },
  { id: "task_legend", title: "完璧な整備士", icon: "🔧", desc: "累計15回タスクを完了", rewardText: "ハット: ネビュラクラウン" },
  { id: "killer_3", title: "サイレントキラー", icon: "🩸", desc: "累計3キルを達成", rewardText: "ハット: サイバー鬼面 / ペット: プラズマキツネ" },
  { id: "detective_eject", title: "真実の目", icon: "🔎", desc: "会議投票でインポスターを追放", rewardText: "" },
  { id: "ghost_helper", title: "守護霊", icon: "👻", desc: "幽霊状態でアシストを実行", rewardText: "" },
  { id: "chat_communicator", title: "名コメンテーター", icon: "💬", desc: "会議で合計5回以上発言", rewardText: "ペット: 宇宙ペンギン" },
  { id: "multi_floor", title: "階層マスター", icon: "🪜", desc: "2階建て以上のマップで勝利", rewardText: "" },
  { id: "survivor_5", title: "ベテラン船員", icon: "🎖️", desc: "合計3試合プレイする", rewardText: "豆ボーナス" },
  { id: "imp_master", title: "インポスターマスター", icon: "👑", desc: "インポスター陣営で3勝", rewardText: "ハット: 月桂冠" },
  { id: "speedrunner", title: "スピードランナー", icon: "⏱️", desc: "180秒以内にクルー勝利", rewardText: "ハット: エースバイザー" },
  { id: "great_detective", title: "名探偵", icon: "🕵️", desc: "累計5回または1試合で2回以上追放成功", rewardText: "ハット: ネビュラクラウン" },
  { id: "first_discoverer", title: "第一発見者", icon: "📢", desc: "死体を累計5回発見通報", rewardText: "ペット: 量子フクロウ" },
  { id: "third_assassin", title: "第三の刺客", icon: "🎪", desc: "第三陣営で3回勝利", rewardText: "" },
  { id: "shadow_assassin", title: "影の暗殺者", icon: "🌑", desc: "視界内に目撃者ゼロでキル成功", rewardText: "演出: マイクロブラックホール" },
  { id: "perfect_work", title: "パーフェクトワーク", icon: "💎", desc: "タスク100%完了でクルー勝利", rewardText: "" },
  { id: "close_call", title: "間一髪", icon: "🚨", desc: "サボタージュ残り5秒以下で解除", rewardText: "" },
  { id: "veteran_crew", title: "歴戦のクルー", icon: "🌟", desc: "累計10試合プレイする", rewardText: "ペット: メカカブト" },
  { id: "fashion_leader", title: "おしゃれリーダー", icon: "✨", desc: "6種以上の異なる外見パーツを使用", rewardText: "" },
] as const;

export function makeItemKey(kind: "color" | "skin" | "hat" | "visor" | "pet" | "nameplate" | "kill", id: string): string {
  return `${kind}:${id}`;
}

export function isCosmeticUnlocked(
  kind: "color" | "skin" | "hat" | "visor" | "pet" | "nameplate" | "kill",
  id: string,
  p: ProgressionData
): boolean {
  if (p.sandboxUnlockAll) return true;
  if (p.unlockedItems?.includes(makeItemKey(kind, id))) return true;

  if (kind === "color") {
    return true;
  }

  if (kind === "skin") {
    const def = PLAYER_SKINS.find((s) => s.id === id);
    if (!def) return true;
    if (def.free) return true;
    return false;
  }

  if (kind === "hat") {
    const def = HATS.find((h) => h.id === id);
    if (!def) return true;
    if (def.free) return true;
    if (id === "laurel_wreath") return p.unlockedAchievements.includes("imp_master") || p.impostorWins >= 3;
    if (id === "ace_visor") return p.unlockedAchievements.includes("speedrunner");
    if (id === "nebula_crown")
      return p.unlockedAchievements.includes("great_detective") || p.unlockedAchievements.includes("task_legend");
    if (id === "cyber_oni") return p.unlockedAchievements.includes("killer_3") || p.totalKills >= 3;
    if (id === "star_commander") return p.unlockedAchievements.includes("neutral_win_1") || p.neutralWins >= 1;
    return false;
  }

  if (kind === "visor") {
    const def = VISORS.find((v) => v.id === id);
    if (!def) return true;
    return !!def.free;
  }

  if (kind === "nameplate") {
    const def = NAMEPLATES.find((n) => n.id === id);
    if (!def) return true;
    return !!def.free;
  }

  if (kind === "pet") {
    const def = PETS.find((pt) => pt.id === id);
    if (!def) return true;
    if (def.free) return true;
    if (id === "star_dragon") return p.unlockedAchievements.includes("imp_win_1") || p.impostorWins >= 1;
    if (id === "quantum_owl") return p.unlockedAchievements.includes("first_discoverer") || p.firstBodyReports >= 5;
    if (id === "plasma_fox") return p.unlockedAchievements.includes("killer_3") || p.totalKills >= 3;
    if (id === "crystal_crab") return p.unlockedAchievements.includes("task_master") || p.totalTasks >= 10;
    if (id === "nebula_jelly") return p.unlockedAchievements.includes("crew_win_1") || p.crewWins >= 1;
    if (id === "astro_penguin") return p.unlockedAchievements.includes("chat_communicator") || p.chatsSent >= 5;
    if (id === "mecha_beetle") return p.unlockedAchievements.includes("veteran_crew") || p.matchesPlayed >= 10;
    return false;
  }

  if (kind === "kill") {
    if (id === "thunder") return p.unlockedAchievements.includes("imp_win_1") || p.impostorWins >= 1;
    if (id === "blackhole") return p.unlockedAchievements.includes("shadow_assassin");
    if (id === "stardust") return p.unlockedAchievements.includes("neutral_win_1") || p.neutralWins >= 1;
    return true;
  }

  return true;
}

export function getXpForNextLevel(level: number): number {
  return 100 + Math.max(0, level - 1) * 55;
}

export function getLevelMultiplier(level: number, won: boolean, activeScore: number): number {
  // Scales between 0.5x (minimum if very passive) up to 5.0x at higher levels/strong match play
  const levelStep = Math.min(2.5, Math.max(0, (level - 1) * 0.25));
  const raw = 0.75 + levelStep + (won ? 0.5 : 0) + Math.min(1.25, activeScore * 0.15);
  return Math.max(0.5, Math.min(5.0, Math.round(raw * 10) / 10));
}

export function calculateMatchBeanRewards(params: {
  won: boolean;
  tasksDone: number;
  kills: number;
  correctEjects: number;
  currentLevel: number;
  currentXp: number;
  forfeited: boolean;
}): BeanRewardBreakdown {
  if (params.forfeited) {
    return {
      base: 0,
      tasks: 0,
      kills: 0,
      ejects: 0,
      win: 0,
      multiplier: 0.5,
      totalBeans: 0,
      xpEarned: 0,
      leveledUp: false,
      newLevel: params.currentLevel,
      forfeited: true,
    };
  }
  const base = 35;
  const tasks = params.tasksDone * 20;
  const kills = params.kills * 35;
  const ejects = params.correctEjects * 45;
  const win = params.won ? 80 : 0;
  const activeScore = params.tasksDone + params.kills * 2 + params.correctEjects * 2;
  const multiplier = getLevelMultiplier(params.currentLevel, params.won, activeScore);
  const rawSum = base + tasks + kills + ejects + win;
  const totalBeans = Math.max(15, Math.round(rawSum * multiplier));
  const xpEarned = Math.max(25, Math.round(rawSum * 0.65));

  let nextLv = params.currentLevel;
  let xpPool = params.currentXp + xpEarned;
  while (xpPool >= getXpForNextLevel(nextLv)) {
    xpPool -= getXpForNextLevel(nextLv);
    nextLv += 1;
  }

  return {
    base,
    tasks,
    kills,
    ejects,
    win,
    multiplier,
    totalBeans,
    xpEarned,
    leveledUp: nextLv > params.currentLevel,
    newLevel: nextLv,
    forfeited: false,
  };
}

export function loadProgression(): ProgressionData {
  try {
    if (typeof localStorage === "undefined") return { ...DEFAULT_PROGRESSION };
    const raw = localStorage.getItem("starship_impostor_prog_v2");
    if (!raw) return { ...DEFAULT_PROGRESSION };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESSION,
      ...parsed,
      beans: typeof parsed.beans === "number" && Number.isFinite(parsed.beans) ? Math.max(0, parsed.beans) : 0,
      xp: typeof parsed.xp === "number" && Number.isFinite(parsed.xp) ? Math.max(0, parsed.xp) : 0,
      level: typeof parsed.level === "number" && parsed.level >= 1 ? parsed.level : 1,
      unlockedItems: Array.isArray(parsed.unlockedItems) ? parsed.unlockedItems : [],
      unlockedCubes: Array.isArray(parsed.unlockedCubes) ? parsed.unlockedCubes : [],
      unlockedCubeNodes: Array.isArray(parsed.unlockedCubeNodes) ? parsed.unlockedCubeNodes : [],
    };
  } catch {
    return { ...DEFAULT_PROGRESSION };
  }
}

export function saveProgression(data: ProgressionData): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("starship_impostor_prog_v2", JSON.stringify(data));
    }
  } catch {
    // ignore storage errors
  }
}

export const P2P_ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun.cloudflare.com:3478" },
  ],
  iceCandidatePoolSize: 6,
};

export interface FirebaseConfigObj {
  apiKey: string;
  authDomain?: string;
  databaseURL: string;
  projectId: string;
  appId?: string;
}

export const FB_DEFAULT_CONFIG: FirebaseConfigObj = {
  apiKey: atob("QUl6YVN5QVpMQkl1bW9pV19vTXhOQWUtX2p2ckJ6Q2l1RnhqWGtF"),
  authDomain: "among-us-10057.firebaseapp.com",
  databaseURL: "https://among-us-10057-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "among-us-10057",
  appId: "1:983952248036:web:04775567972d11b37941ef",
};

interface FbWin extends Window {
  firebase?: {
    apps?: unknown[];
    initializeApp?: (c: FirebaseConfigObj) => void;
    database?: () => {
      ref: (path: string) => FbRef;
    };
  };
}

interface FbRef {
  set: (v: unknown) => Promise<void>;
  update: (v: Record<string, unknown>) => Promise<void>;
  remove: () => Promise<void>;
  once: (ev: string) => Promise<{ val: () => unknown }>;
  on: (ev: string, cb: (snap: { val: () => unknown; key?: string }) => void) => void;
  off: () => void;
  push: (v?: unknown) => { key?: string; set?: (v: unknown) => Promise<void> };
  onDisconnect: () => { remove: () => Promise<void> };
}

class FirebaseManager {
  public ready = false;
  public mode: "default" | "custom" | "disabled" = "default";
  private db: { ref: (path: string) => FbRef } | null = null;
  private initPromise: Promise<boolean> | null = null;

  public getStoredConfig(): FirebaseConfigObj | null {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const fbParam = params.get("fb");
        if (fbParam) {
          const decoded = JSON.parse(decodeURIComponent(atob(fbParam)));
          if (decoded && decoded.databaseURL) {
            localStorage.setItem("starship_fb_config_v1", JSON.stringify(decoded));
            return decoded;
          }
        }
      }
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem("starship_fb_config_v1");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.databaseURL) return parsed;
        }
      }
    } catch (e) {
      logGameError("FirebaseManager.getStoredConfig", e, "WARN");
    }
    return FB_DEFAULT_CONFIG;
  }

  public saveConfig(cfg: FirebaseConfigObj | null): void {
    try {
      if (typeof localStorage === "undefined") return;
      if (!cfg) {
        localStorage.removeItem("starship_fb_config_v1");
      } else {
        localStorage.setItem("starship_fb_config_v1", JSON.stringify(cfg));
      }
      this.ready = false;
      this.db = null;
      this.initPromise = null;
    } catch (e) {
      logGameError("FirebaseManager.saveConfig", e, "ERROR");
    }
  }

  public buildShareUrlWithFb(baseUrl: string): string {
    const cfg = this.getStoredConfig() || FB_DEFAULT_CONFIG;
    const encoded = btoa(encodeURIComponent(JSON.stringify(cfg)));
    const sep = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${sep}fb=${encoded}`;
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  }

  public async init(): Promise<boolean> {
    if (this.ready && this.db) return true;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        if (typeof window === "undefined") return false;
        const cfg = this.getStoredConfig() || FB_DEFAULT_CONFIG;
        this.mode = cfg.projectId === FB_DEFAULT_CONFIG.projectId ? "default" : "custom";
        const w = window as FbWin;
        if (!w.firebase?.initializeApp || !w.firebase?.database) {
          await this.loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
          await this.loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js");
        }
        if (!w.firebase?.initializeApp || !w.firebase?.database) return false;
        if (!w.firebase.apps || w.firebase.apps.length === 0) {
          w.firebase.initializeApp(cfg);
        }
        this.db = w.firebase.database();
        this.ready = !!this.db;
        return this.ready;
      } catch (err) {
        logGameError("FirebaseManager.init", err, "NETWORK");
        this.ready = false;
        return false;
      }
    })();

    return this.initPromise;
  }

  public getDb() {
    return this.db;
  }

  public async publishPublicRoom(room: PublicRoomSummary): Promise<void> {
    try {
      const ok = await this.init();
      if (!ok || !this.db) return;
      const ref = this.db.ref(`starship_public_rooms/${room.roomCode}`);
      await ref.set({ ...room, updatedAt: Date.now() });
      try {
        await ref.onDisconnect().remove();
      } catch {
        // ignore if unsupported
      }
    } catch (err) {
      logGameError("FirebaseManager.publishPublicRoom", err, "NETWORK");
    }
  }

  public async removePublicRoom(roomCode: string): Promise<void> {
    try {
      if (!this.db || !roomCode) return;
      await this.db.ref(`starship_public_rooms/${roomCode}`).remove();
    } catch (err) {
      logGameError("FirebaseManager.removePublicRoom", err, "NETWORK");
    }
  }

  public async fetchPublicRooms(): Promise<PublicRoomSummary[]> {
    try {
      const ok = await this.init();
      if (!ok || !this.db) return [];
      const snap = await this.db.ref("starship_public_rooms").once("value");
      const val = (snap.val() as Record<string, PublicRoomSummary & { updatedAt?: number }>) || {};
      const now = Date.now();
      return Object.values(val)
        .filter((r) => r && r.roomCode && (!r.updatedAt || now - r.updatedAt < 180_000))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (err) {
      logGameError("FirebaseManager.fetchPublicRooms", err, "NETWORK");
      return [];
    }
  }

  public async measurePing(): Promise<number | null> {
    try {
      const ok = await this.init();
      if (!ok || !this.db) return null;
      const t0 = performance.now();
      await this.db.ref(".info/connected").once("value");
      return Math.max(1, Math.round(performance.now() - t0));
    } catch {
      return null;
    }
  }
}

export const FB = new FirebaseManager();

export interface FirebaseDataConn {
  peer: string;
  open: boolean;
  send: (data: unknown) => void;
  close: () => void;
  on: (event: "open" | "data" | "close" | "error", cb: (arg?: unknown) => void) => void;
}

/**
 * PeerJS 互換インターフェースの Firebase RTDB ベースのクロスプレイ通信層
 * + onDisconnect 自動退出 + 20秒非アクティブ清掃 + RTT Ping 測定
 */
export class FirebasePeer {
  public id: string;
  private isHost: boolean;
  private roomCode: string;
  private myPeerId: string;
  private handlers: Record<string, Array<(arg: unknown) => void>> = {};
  private conns = new Map<string, FirebaseDataConn>();
  private connCallbacks = new Map<string, Record<string, Array<(arg?: unknown) => void>>>();
  private heartbeatTimer: number | null = null;
  private sweepTimer: number | null = null;
  private pingTimer: number | null = null;
  private destroyed = false;
  private inboxRef: FbRef | null = null;
  private membersRef: FbRef | null = null;
  private seenMsgIds = new Set<string>();
  public onPingUpdate?: (ms: number) => void;
  public onHostMigration?: (newHostPeerId: string) => void;

  constructor(peerId: string, roomCode: string, isHost: boolean) {
    this.id = peerId;
    this.myPeerId = peerId;
    this.roomCode = roomCode;
    this.isHost = isHost;
    void this.boot();
  }

  public on(event: "open" | "connection" | "error" | "disconnected" | "close", cb: (arg: unknown) => void): void {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(cb);
  }

  private emit(event: string, arg?: unknown): void {
    (this.handlers[event] || []).forEach((cb) => {
      try {
        cb(arg);
      } catch (e) {
        logGameError(`FirebasePeer.emit(${event})`, e, "ERROR");
      }
    });
  }

  private async boot(): Promise<void> {
    const ok = await FB.init();
    const db = FB.getDb();
    if (!ok || !db || this.destroyed) {
      this.emit("error", new Error("Firebase Realtime Database に接続できませんでした"));
      return;
    }

    try {
      const basePath = `starship_rooms/${this.roomCode}`;
      const myMemberRef = db.ref(`${basePath}/members/${this.myPeerId}`);
      await myMemberRef.set({
        id: this.myPeerId,
        isHost: this.isHost,
        joinedAt: Date.now(),
        lastSeen: Date.now(),
      });
      try {
        await myMemberRef.onDisconnect().remove();
      } catch {
        // ignore if unsupported
      }

      this.inboxRef = db.ref(`${basePath}/inbox/${this.myPeerId}`);
      this.inboxRef.on("child_added", (snap) => {
        if (this.destroyed) return;
        const msg = snap.val() as { id?: string; from?: string; payload?: unknown } | null;
        if (!msg || !msg.from) return;
        if (msg.id && this.seenMsgIds.has(msg.id)) return;
        if (msg.id) {
          this.seenMsgIds.add(msg.id);
          if (this.seenMsgIds.size > 400) {
            const first = this.seenMsgIds.values().next().value;
            if (first) this.seenMsgIds.delete(first);
          }
        }
        // Clean read message
        if (snap.key) {
          void db.ref(`${basePath}/inbox/${this.myPeerId}/${snap.key}`).remove().catch(() => {});
        }
        // Handle internal ping/pong immediately
        const payload = msg.payload as { type?: string; ts?: number } | undefined;
        if (payload?.type === "__FB_PING__" && typeof payload.ts === "number") {
          void this.sendRaw(msg.from, { type: "__FB_PONG__", ts: payload.ts });
          return;
        }
        if (payload?.type === "__FB_PONG__" && typeof payload.ts === "number") {
          const rtt = Math.max(1, Math.round(Date.now() - payload.ts));
          this.onPingUpdate?.(rtt);
          return;
        }

        let conn = this.conns.get(msg.from);
        if (!conn) {
          conn = this.createVirtualConn(msg.from, true);
          this.emit("connection", conn);
        }
        this.dispatchConn(msg.from, "data", msg.payload);
      });

      this.membersRef = db.ref(`${basePath}/members`);
      this.membersRef.on("value", (snap) => {
        if (this.destroyed) return;
        const val = (snap.val() as Record<string, { id: string; lastSeen: number; isHost?: boolean }>) || {};
        const now = Date.now();
        const activeIds = Object.values(val)
          .filter((m) => m && now - (m.lastSeen || 0) < 22_000)
          .map((m) => m.id)
          .sort();

        // Sweep stale members if host
        if (this.isHost) {
          Object.values(val).forEach((m) => {
            if (m && m.id !== this.myPeerId && now - (m.lastSeen || 0) > 20_000) {
              void db.ref(`${basePath}/members/${m.id}`).remove().catch(() => {});
              const c = this.conns.get(m.id);
              if (c) {
                c.close();
              }
            }
          });
        } else {
          // Check host migration: if current host vanished, lowest sorted active ID becomes host
          const hasHost = Object.values(val).some(
            (m) => m && m.isHost && now - (m.lastSeen || 0) < 20_000
          );
          if (!hasHost && activeIds.length > 0) {
            const elected = activeIds[0];
            if (elected === this.myPeerId) {
              this.isHost = true;
              void db.ref(`${basePath}/members/${this.myPeerId}/isHost`).set(true).catch(() => {});
              this.onHostMigration?.(elected);
            }
          }
        }
      });

      this.heartbeatTimer = window.setInterval(() => {
        if (this.destroyed) return;
        void myMemberRef.update({ lastSeen: Date.now() }).catch(() => {});
      }, 6000);

      this.pingTimer = window.setInterval(() => {
        if (this.destroyed) return;
        void FB.measurePing().then((ms) => {
          if (ms !== null) this.onPingUpdate?.(ms);
        });
      }, 5000);

      this.emit("open", this.myPeerId);
    } catch (err) {
      logGameError("FirebasePeer.boot", err, "NETWORK");
      this.emit("error", err);
    }
  }

  private async sendRaw(targetPeerId: string, payload: unknown): Promise<void> {
    const db = FB.getDb();
    if (!db || this.destroyed) return;
    const msgId = `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await db
      .ref(`starship_rooms/${this.roomCode}/inbox/${targetPeerId}`)
      .push({
        id: msgId,
        from: this.myPeerId,
        payload,
        ts: Date.now(),
      });
  }

  private dispatchConn(peerId: string, ev: string, arg?: unknown): void {
    const map = this.connCallbacks.get(peerId);
    if (!map) return;
    (map[ev] || []).forEach((fn) => {
      try {
        fn(arg);
      } catch (e) {
        logGameError(`FirebasePeer.conn(${ev})`, e, "ERROR");
      }
    });
  }

  private createVirtualConn(targetPeerId: string, immediateOpen = false): FirebaseDataConn {
    const callbacks: Record<string, Array<(arg?: unknown) => void>> = {
      open: [],
      data: [],
      close: [],
      error: [],
    };
    this.connCallbacks.set(targetPeerId, callbacks);

    const conn: FirebaseDataConn = {
      peer: targetPeerId,
      open: immediateOpen,
      send: (data: unknown) => {
        void this.sendRaw(targetPeerId, data).catch((err) => {
          logGameError("FirebasePeer.send", err, "NETWORK");
        });
      },
      close: () => {
        conn.open = false;
        this.conns.delete(targetPeerId);
        this.dispatchConn(targetPeerId, "close");
      },
      on: (ev, cb) => {
        if (!callbacks[ev]) callbacks[ev] = [];
        callbacks[ev].push(cb);
        if (ev === "open" && conn.open) {
          setTimeout(() => cb(), 0);
        }
      },
    };
    this.conns.set(targetPeerId, conn);
    if (!immediateOpen) {
      setTimeout(() => {
        if (this.destroyed) return;
        conn.open = true;
        this.dispatchConn(targetPeerId, "open");
      }, 60);
    }
    return conn;
  }

  public connect(targetPeerId: string): FirebaseDataConn {
    const existing = this.conns.get(targetPeerId);
    if (existing) return existing;
    return this.createVirtualConn(targetPeerId, false);
  }

  public destroy(): void {
    this.destroyed = true;
    if (this.heartbeatTimer !== null) window.clearInterval(this.heartbeatTimer);
    if (this.sweepTimer !== null) window.clearInterval(this.sweepTimer);
    if (this.pingTimer !== null) window.clearInterval(this.pingTimer);
    try {
      this.inboxRef?.off();
      this.membersRef?.off();
      const db = FB.getDb();
      if (db) {
        void db.ref(`starship_rooms/${this.roomCode}/members/${this.myPeerId}`).remove().catch(() => {});
      }
    } catch {
      // ignore
    }
    this.conns.forEach((c) => {
      c.open = false;
    });
    this.conns.clear();
  }
}
