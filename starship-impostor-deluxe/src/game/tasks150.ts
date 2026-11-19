import type {
  IntegratedFixtureType,
  TaskDef,
  TaskDifficultyMode,
  TaskMechanicFamily,
} from "./types";

export interface TaskCategoryMeta {
  id: TaskMechanicFamily;
  label: string;
  fixtureType: IntegratedFixtureType;
  summary: string;
}

export const TASK_CATEGORIES_15: TaskCategoryMeta[] = [
  { id: "wires", label: "配線接続", fixtureType: "panel_box", summary: "色別ケーブルの端子接続" },
  { id: "keypad", label: "認証コード", fixtureType: "console_screen", summary: "暗号キーパッド入力認証" },
  { id: "slider_match", label: "周波数同調", fixtureType: "radar_dish", summary: "波形・出力スライダー同期" },
  { id: "sequence_memory", label: "記憶シーケンス", fixtureType: "holo_table", summary: "光順・数値パターン記憶再現" },
  { id: "asteroid_shoot", label: "防衛射撃", fixtureType: "turret_mount", summary: "隕石・脅威目標の照準迎撃" },
  { id: "gauge_hold", label: "燃料・圧力充填", fixtureType: "valve_pipe", summary: "適正レンジ維持・連続充填" },
  { id: "sample_analyze", label: "検体・生体検査", fixtureType: "bio_vat", summary: "異常検体スキャン抽出" },
  { id: "dial_align", label: "回転キャリブ", fixtureType: "reactor_core", summary: "位相リング角度精密合わせ" },
  { id: "grid_toggle", label: "基板ロジック", fixtureType: "panel_box", summary: "全灯・回路グリッド反転パズル" },
  { id: "trash_sort", label: "廃棄・仕分け", fixtureType: "chute_hatch", summary: "危険物・ゴミの分類排除" },
  { id: "pipe_rotate", label: "配管接続", fixtureType: "valve_pipe", summary: "導管・送水パイプ直線連結" },
  { id: "rhythm_sync", label: "タイミング同期", fixtureType: "reactor_core", summary: "同期パルス・ビートタイミング" },
  { id: "maze_trace", label: "航路トレース", fixtureType: "holo_table", summary: "ノード順路・障害回避トレース" },
  { id: "radar_lock", label: "レーダー捕捉", fixtureType: "radar_dish", summary: "移動標的位置ロックオン" },
  { id: "cipher_decode", label: "暗号デコード", fixtureType: "cargo_rack", summary: "宇宙航行記号・暗号解読" },
];

type VariantSpec = {
  id: string;
  name: string;
  desc: string;
  length?: "common" | "short" | "long";
  steps?: number;
  weight?: number;
  variantConfig?: TaskDef["variantConfig"];
};

function buildFamilyTasks(
  category: TaskMechanicFamily,
  specs: VariantSpec[]
): TaskDef[] {
  const meta = TASK_CATEGORIES_15.find((m) => m.id === category)!;
  return specs.map((s, idx) => ({
    id: s.id,
    name: s.name,
    category,
    categoryLabel: meta.label,
    type: category,
    fixtureType: meta.fixtureType,
    length: s.length || (idx < 3 ? "common" : idx < 7 ? "short" : "long"),
    steps: s.steps ?? (idx < 6 ? 1 : 2),
    desc: s.desc,
    difficultyWeight: s.weight ?? 1 + Math.floor(idx / 3) * 0.25,
    variantIndex: idx,
    variantConfig: s.variantConfig,
  }));
}

export const TASK_CATALOG_150: TaskDef[] = [
  // 1. wires (10)
  ...buildFamilyTasks("wires", [
    { id: "t_wires", name: "配電盤の修理", desc: "切れた4色ケーブルを左右の同色端子へ接続する。", length: "common", variantConfig: { wireCount: 4 } },
    { id: "t_warp_coil", name: "ワープコイル結線", desc: "跳躍コイルの4系統エネルギーラインを再接続する。", length: "common", variantConfig: { wireCount: 4 } },
    { id: "t_light_bus", name: "照明母線バイパス", desc: "艦内照明用の5本バスラインを正確に繋ぎ直す。", variantConfig: { wireCount: 5 } },
    { id: "t_shield_cable", name: "シールド導線接続", desc: "偏向シールド発生器の並列ケーブル5本を接続する。", variantConfig: { wireCount: 5 } },
    { id: "t_sensor_bus", name: "センサー信号配線", desc: "外壁センサー5系統の信号線を端子盤へ配線する。", variantConfig: { wireCount: 5 } },
    { id: "t_engine_loom", name: "エンジンハーネス整理", desc: "主機関の耐熱ハーネス6系統を誤接続なく繋ぐ。", length: "long", variantConfig: { wireCount: 6 } },
    { id: "t_backup_cell", name: "予備電源ライン接続", desc: "緊急用バッテリー6極ケーブルを直結する。", variantConfig: { wireCount: 6 } },
    { id: "t_holo_cord", name: "ホロ投影ケーブル修復", desc: "立体投影卓の多芯ケーブル6本を結線する。", variantConfig: { wireCount: 6 } },
    { id: "t_reactor_bus", name: "炉心制御幹線復旧", desc: "高圧制御幹線7系統を順序よく端子へ接続する。", length: "long", variantConfig: { wireCount: 7 } },
    { id: "t_quantum_bus", name: "量子暗号ケーブル接続", desc: "暗号通信用7色光ファイバーをすべて結線する。", length: "long", variantConfig: { wireCount: 7 } },
  ]),

  // 2. keypad (10)
  ...buildFamilyTasks("keypad", [
    { id: "t_code", name: "IDカード認証", desc: "表示された5桁の船員IDパスコードをキーパッド入力。", length: "common", variantConfig: { targetCode: "48291" } },
    { id: "t_security_pass", name: "保安局アクセス認証", desc: "セキュリティ端末へ6桁の暗号パスコードを入力する。", length: "common", variantConfig: { targetCode: "905317" } },
    { id: "t_prison_cell_lock", name: "監房ロック統合認証", desc: "収容区画の6桁マスターセキュリティPINを打ち込む。", variantConfig: { targetCode: "294816" } },
    { id: "t_cargo_manifest", name: "貨物ゲートPIN認証", desc: "搬入ゲート管理の5桁照合コードを入力する。", variantConfig: { targetCode: "37528" } },
    { id: "t_med_pin", name: "医療保管庫キー認証", desc: "薬品保管庫の5桁コードを入力して開錠する。", variantConfig: { targetCode: "61835" } },
    { id: "t_vault_pin", name: "金庫室マスターPIN", desc: "重要データ金庫の7桁パスワードを認証する。", length: "long", variantConfig: { targetCode: "5820493" } },
    { id: "t_bridge_override", name: "ブリッジ統括認証", desc: "艦橋コンソールの6桁オーバーライド番号を入力。", variantConfig: { targetCode: "147962" } },
    { id: "t_reactor_code", name: "炉心解除コード入力", desc: "7桁の安全ロックコードを正確に入力してロック解除。", length: "long", variantConfig: { targetCode: "7391504" } },
    { id: "t_escape_pod", name: "脱出ポッド起爆防止", desc: "誤作動防止の7桁安全確認番号を入力する。", length: "long", variantConfig: { targetCode: "8642079" } },
    { id: "t_omega_pin", name: "最高機密コード認証", desc: "8桁のオメガ認証コードをノーミスで打ち込む。", length: "long", variantConfig: { targetCode: "31947625" } },
  ]),

  // 3. slider_match (10)
  ...buildFamilyTasks("slider_match", [
    { id: "t_download", name: "データ受信同期", desc: "3本の受信帯域スライダーを目標周波数に合わせる。", length: "long", steps: 2, variantConfig: { freqTargets: [32, 68, 50] } },
    { id: "t_freq", name: "宇宙無線周波数調整", desc: "通信アレイ3バンドのキャリア周波数を厳密に揃える。", variantConfig: { freqTargets: [24, 55, 82] } },
    { id: "t_backup_upload", name: "バックアップ帯域同期", desc: "4系統データアップロード帯域を規定レベルへ合わせる。", length: "long", variantConfig: { freqTargets: [18, 44, 72, 88] } },
    { id: "t_lava_damper", name: "地熱ダンパー出力制御", desc: "耐熱ダンパー4基の吸収スライダーを指定値へ調整。", variantConfig: { freqTargets: [60, 60, 42, 78] } },
    { id: "t_o2_mix", name: "酸素・窒素混合比制御", desc: "生命維持装置のガス混合スライダー4基を調整。", variantConfig: { freqTargets: [21, 78, 45, 63] } },
    { id: "t_laser_gain", name: "光学レーザー出力校正", desc: "採掘レーザーの4段階ゲイン値をピンポイント設定。", variantConfig: { freqTargets: [35, 70, 28, 91] } },
    { id: "t_sonic_damp", name: "防振ダンパー同調", desc: "機関室振動抑制用4バンドをターゲットに合わせる。", length: "long", variantConfig: { freqTargets: [15, 52, 84, 39] } },
    { id: "t_plasma_trim", name: "プラズマ磁場トリム", desc: "磁場閉じ込めスライダー5本を精密に揃える。", length: "long", variantConfig: { freqTargets: [22, 48, 76, 33, 85] } },
    { id: "t_cryo_valves", name: "冷凍スリープ電圧調律", desc: "休眠ポッド電圧5系統を安全基準へ合わせる。", length: "long", variantConfig: { freqTargets: [40, 62, 19, 77, 54] } },
    { id: "t_subspace_eq", name: "亜空間イコライザー", desc: "超光速通信の5バンド波形を規定パターンへ同期。", length: "long", variantConfig: { freqTargets: [88, 25, 64, 41, 73] } },
  ]),

  // 4. sequence_memory (10)
  ...buildFamilyTasks("sequence_memory", [
    { id: "t_beacon_simon", name: "ビーコン起動順記憶", desc: "9マスパネルの光った順を記憶して再現する。", length: "long", steps: 2, variantConfig: { seqLength: 4 } },
    { id: "t_manifold_num", name: "1〜10順番入力", desc: "1から10までの番号パネルを昇順で高速タップ。", variantConfig: { seqLength: 10 } },
    { id: "t_memory_glyph", name: "記憶グリフ再生", desc: "点滅する4連続グリフパターンを記憶し再現する。", variantConfig: { seqLength: 4 } },
    { id: "t_shrine_bell", name: "古代神殿の鐘手順再現", desc: "共鳴する5連続の鐘パネル順序を記憶し鳴らす。", variantConfig: { seqLength: 5 } },
    { id: "t_cipher_pad", name: "量子キー手順再現", desc: "5ステップのセキュリティ点灯順序を記憶する。", variantConfig: { seqLength: 5 } },
    { id: "t_bio_seq", name: "DNA塩基配列入力", desc: "6連続の塩基マーキング順序を見極めて再現。", length: "long", variantConfig: { seqLength: 6 } },
    { id: "t_core_boot", name: "主記憶ブート順再現", desc: "6段階のコア点滅パターンを記憶して起動する。", length: "long", variantConfig: { seqLength: 6 } },
    { id: "t_shield_seq", name: "防衛グリッド順番起動", desc: "6箇所のシールドノードを点灯順に再入力。", length: "long", variantConfig: { seqLength: 6 } },
    { id: "t_cryo_wake", name: "冷凍ポッド解凍手順", desc: "7連続の解凍シグナル順序を誤りなく辿る。", length: "long", variantConfig: { seqLength: 7 } },
    { id: "t_warp_seq", name: "ワープ跳躍シーケンス", desc: "7段階の跳躍カウント光を完璧に再現する。", length: "long", variantConfig: { seqLength: 7 } },
  ]),

  // 5. asteroid_shoot (10)
  ...buildFamilyTasks("asteroid_shoot", [
    { id: "t_asteroid", name: "小惑星の迎撃", desc: "飛来する隕石ターゲットをクリック射撃で撃墜。", length: "long", variantConfig: { targetCount: 10 } },
    { id: "t_debris", name: "軌道デブリ排除", desc: "船体に接近する宇宙ゴミ12個をレーザーで破壊。", variantConfig: { targetCount: 12 } },
    { id: "t_drone_sw", name: "暴走ドローン撃墜", desc: "誤作動する小型整備ドローン12機を迎撃する。", variantConfig: { targetCount: 12 } },
    { id: "t_ice_melt", name: "氷塊群のレーザー融解", desc: "冷凍壁を塞ぐ氷塊ターゲット14個を砲撃融解する。", variantConfig: { targetCount: 14 } },
    { id: "t_spore_burn", name: "寄生胞子クラスター焼却", desc: "艦外に付着した胞子塊14体を焼却処理する。", variantConfig: { targetCount: 14 } },
    { id: "t_mine_clear", name: "宇宙機雷の無力化", desc: "航路上の浮遊機雷16個を精密射撃で処理。", length: "long", variantConfig: { targetCount: 16 } },
    { id: "t_meteor_storm", name: "流星雨防衛砲撃", desc: "高速で飛び交う流星群16個を連射迎撃する。", length: "long", variantConfig: { targetCount: 16 } },
    { id: "t_jammer_pop", name: "妨害ポッド撃破", desc: "レーダー妨害用小型ポッド15機を撃ち落とす。", variantConfig: { targetCount: 15 } },
    { id: "t_crystal_brk", name: "干渉結晶の破砕", desc: "航行阻害クリスタル塊18個をレーザー破砕。", length: "long", variantConfig: { targetCount: 18 } },
    { id: "t_void_rifts", name: "空間亀裂安定化射撃", desc: "不安定な空間裂け目20箇所へ安定ビーム照射。", length: "long", variantConfig: { targetCount: 20 } },
  ]),

  // 6. gauge_hold (10)
  ...buildFamilyTasks("gauge_hold", [
    { id: "t_fuel_engine", name: "燃料チャージ", desc: "長押しボタンで目標グリーンゾーンまで給油する。", length: "long", steps: 2, variantConfig: { targetCount: 1 } },
    { id: "t_thruster_pump", name: "スラスター圧送充填", desc: "適正圧力ゾーンでぴったり止めて推進剤を充填。", variantConfig: { targetCount: 2 } },
    { id: "t_pressure_valve", name: "深海圧力バルブ解放", desc: "高圧バルブ長押しで目標安全圧力へ2回合わせる。", variantConfig: { targetCount: 2 } },
    { id: "t_rail_brake", name: "磁気ブレーキ蓄圧", desc: "高速列車の制動圧力を目標グリーン帯で固定。", variantConfig: { targetCount: 2 } },
    { id: "t_botany_water", name: "植物培養槽給水", desc: "水耕ベッドへ栄養水を適正レンジで供給する。", variantConfig: { targetCount: 2 } },
    { id: "t_hydra_tank", name: "水耕栄養液注入", desc: "バイオポッドへ規定量ぴったり注ぐ。", variantConfig: { targetCount: 2 } },
    { id: "t_antimatter_cool", name: "反物質減速材充填", desc: "反物質炉へ減速材を3回適正レンジで充填する。", length: "long", variantConfig: { targetCount: 3 } },
    { id: "t_hyper_fuel", name: "超光速燃料精製", desc: "高揮発性燃料を狭い適正範囲内で止める。", length: "long", variantConfig: { targetCount: 2 } },
    { id: "t_ballast_pump", name: "バラスト排水調整", desc: "深海・重圧区のバラストタンク圧を3連続調整。", length: "long", variantConfig: { targetCount: 3 } },
    { id: "t_zero_cell", name: "零点エネルギー蓄電", desc: "極小安全ゾーンへ3段階パルス充填を成功させる。", length: "long", variantConfig: { targetCount: 3 } },
  ]),

  // 7. sample_analyze (10)
  ...buildFamilyTasks("sample_analyze", [
    { id: "t_med_body_scan", name: "医務室生体スキャン", desc: "異常色・異常波形を示す1本のバイアルを特定。", length: "common", variantConfig: { targetCount: 5 } },
    { id: "t_sample_scan", name: "薬品サンプル分析", desc: "試験管トレイの中から汚染反応のある検体を抽出。", length: "long", steps: 2, variantConfig: { targetCount: 6 } },
    { id: "t_bio_incubator", name: "培養インキュベーター検査", desc: "培養槽の異変検体バイアルを見極めて摘出。", variantConfig: { targetCount: 6 } },
    { id: "t_core_diagnostics", name: "炉心同位体サンプル診断", desc: "同位体試験管の中から変異反応セルを特定する。", variantConfig: { targetCount: 7 } },
    { id: "t_alien_dna", name: "未知生命DNA鑑定", desc: "正常DNAパターンから外れた変異検体2本を特定。", variantConfig: { targetCount: 7 } },
    { id: "t_rad_dosage", name: "放射線汚染スキャン", desc: "被曝数値の高い異常検体容器を選別除去する。", variantConfig: { targetCount: 8 } },
    { id: "t_spore_lab", name: "胞子培養監視", desc: "増殖中の危険バイアルを連続スキャンで見分ける。", length: "long", variantConfig: { targetCount: 8 } },
    { id: "t_isotope_chk", name: "同位体純度チェック", desc: "核燃料ペレットから不純物混入セルを抽出。", length: "long", variantConfig: { targetCount: 8 } },
    { id: "t_cryo_vital", name: "冷凍乗員バイタル点検", desc: "心拍微弱なカプセル反応を9機から即特定。", length: "long", variantConfig: { targetCount: 9 } },
    { id: "t_pathogen", name: "宇宙病原体分離", desc: "10本の培養管からウイルス陽性の2本を精密分離。", length: "long", variantConfig: { targetCount: 10 } },
  ]),

  // 8. dial_align (10)
  ...buildFamilyTasks("dial_align", [
    { id: "t_calibrate_dist", name: "分配器キャリブレーション", desc: "3重の同心回転リングをタイミング良くロック。", variantConfig: { targetCount: 3 } },
    { id: "t_telemetry_align", name: "テレメトリ位相調整", desc: "回転リング3軸が基準位置を通過する瞬間に停止。", variantConfig: { targetCount: 3 } },
    { id: "t_reactor_align", name: "原子炉出力軸整列", desc: "炉心回転リング3段をターゲット角度で固定する。", variantConfig: { targetCount: 3 } },
    { id: "t_dish_aim", name: "長距離通信皿照準", desc: "パラボラ角度リング3段を通信衛星方向へ固定。", variantConfig: { targetCount: 3 } },
    { id: "t_turbine_ph", name: "タービン位相同期", desc: "高速回転する4段ブレード位相を基準マーカーへ。", variantConfig: { targetCount: 4 } },
    { id: "t_shield_ring", name: "偏向磁界リング調律", desc: "防御フィールドの4重位相を順番に固定する。", variantConfig: { targetCount: 4 } },
    { id: "t_telescope", name: "天体望遠鏡フォーカス", desc: "光学プリズム4連リングを星の中心点へ合わせる。", variantConfig: { targetCount: 4 } },
    { id: "t_reactor_mag", name: "核融合磁気リング整列", desc: "高速度回転リング4軸を許容角±8°で停止。", length: "long", variantConfig: { targetCount: 4 } },
    { id: "t_chrono_lock", name: "時空時計同期調整", desc: "高速逆回転を含む5連リングを順番に止める。", length: "long", variantConfig: { targetCount: 5 } },
    { id: "t_singularity", name: "特異点コア軸整列", desc: "5軸の超高速安定リングをミスなく固定する。", length: "long", variantConfig: { targetCount: 5 } },
  ]),

  // 9. grid_toggle (10)
  ...buildFamilyTasks("grid_toggle", [
    { id: "t_shield_prime", name: "シールドパネル起動", desc: "グリッドの赤い保護セルをすべてシアン点灯へ反転。", variantConfig: { gridSize: 3 } },
    { id: "t_circuit_puzzle", name: "論理回路パズル", desc: "十字反転パネルを操作して3×3全セルを通電。", variantConfig: { gridSize: 3 } },
    { id: "t_solar_panel", name: "ソーラーアレイ展開", desc: "3×3アレイの遮光セルを全展開状態へ切り替える。", variantConfig: { gridSize: 3 } },
    { id: "t_holo_firewall", name: "ホロ防壁マトリクス", desc: "3×3ファイアウォール遮断セルをすべて緑化する。", variantConfig: { gridSize: 3 } },
    { id: "t_crystal_matrix", name: "クリスタル格子共鳴", desc: "4×4結晶グリッドの全ノードを同期点灯へ揃える。", length: "long", variantConfig: { gridSize: 4 } },
    { id: "t_deflect_mat", name: "偏向グリッド再構築", desc: "4×4シールドセルを連動反転ルールで全点灯。", length: "long", variantConfig: { gridSize: 4 } },
    { id: "t_thermal_grid", name: "排熱グリッド開放", desc: "4×4排熱ルーバーを全開放状態にリセットする。", length: "long", variantConfig: { gridSize: 4 } },
    { id: "t_memory_bank", name: "メモリバンク修復", desc: "破損セクタ4×4のビットフラグを全て正常化。", length: "long", variantConfig: { gridSize: 4 } },
    { id: "t_logic_core", name: "AIコア論理ゲート", desc: "4×4多層ビットゲートを全ON状態に統一する。", length: "long", variantConfig: { gridSize: 4 } },
    { id: "t_quantum_mat", name: "量子キュービット整列", desc: "5×5量子グリッドの位相エラーをすべて修正。", length: "long", variantConfig: { gridSize: 5 } },
  ]),

  // 10. trash_sort (10)
  ...buildFamilyTasks("trash_sort", [
    { id: "t_trash_chute", name: "ゴミシュート排出", desc: "不要廃棄物アイテムをクリックしてシュートへ廃棄。", length: "short", variantConfig: { targetCount: 6 } },
    { id: "t_o2_filter", name: "酸素フィルター清掃", desc: "排気口に詰まった塵・残骸8個をタップ除去。", variantConfig: { targetCount: 8 } },
    { id: "t_airlock_flush", name: "エアロック異物除去", desc: "隔壁に残った浮遊ゴミ8個を安全に排出処理する。", variantConfig: { targetCount: 8 } },
    { id: "t_sand_filter", name: "砂塵フィルター除去", desc: "換気網を塞ぐ砂塵クラスター9個を取り除く。", variantConfig: { targetCount: 9 } },
    { id: "t_hull_seal", name: "外殻破損片清掃", desc: "マイクロ隕石の付着破片9箇所を除去する。", variantConfig: { targetCount: 9 } },
    { id: "t_vent_dust", name: "ダクト粉塵吸引", desc: "通気ダクトに蓄積したカーボン粉塵10個を吸引。", variantConfig: { targetCount: 10 } },
    { id: "t_hazmat_sort", name: "放射性廃液分離", desc: "汚染カプセルのみを選別廃棄(良品に触ると減点)。", length: "long", variantConfig: { targetCount: 10 } },
    { id: "t_ice_scrape", name: "冷却管着氷除去", desc: "配管に凍りついた氷塊11個を叩き割る。", variantConfig: { targetCount: 11 } },
    { id: "t_kitchen_sort", name: "食堂ストック検品", desc: "期限切れ・腐敗食料11個を仕分け処分する。", variantConfig: { targetCount: 11 } },
    { id: "t_slag_clear", name: "溶鉱スラグ除去", desc: "灼熱炉の凝固スラグ12個を安全に排除する。", length: "long", variantConfig: { targetCount: 12 } },
  ]),

  // 11. pipe_rotate (10)
  ...buildFamilyTasks("pipe_rotate", [
    { id: "t_coolant_pipe", name: "冷却配管の連結", desc: "4×4パイプタイルを回転させINからOUTへ繋ぐ。", length: "long", variantConfig: { pipeSize: 4 } },
    { id: "t_cryo_pipe", name: "極低温冷媒配管接続", desc: "分岐冷媒配管を回転させて循環ルートを接続。", variantConfig: { pipeSize: 4 } },
    { id: "t_magma_vent", name: "マグマ排熱管連結", desc: "耐熱ダクトを繋いで炉熱を安全に排出する。", variantConfig: { pipeSize: 4 } },
    { id: "t_o2_duct", name: "換気ダクト復旧", desc: "各区画への酸素供給ダクトを1本のルートに繋ぐ。", variantConfig: { pipeSize: 4 } },
    { id: "t_fuel_duct", name: "燃料パイプ連結", desc: "タンクから機関室への燃料管路を完成させる。", variantConfig: { pipeSize: 4 } },
    { id: "t_plasma_duct", name: "プラズマ導管接続", desc: "5×5高圧プラズマ導管網を安全に貫通させる。", length: "long", variantConfig: { pipeSize: 5 } },
    { id: "t_oil_line", name: "潤滑油ルート開通", desc: "5×5機関潤滑パイプラインを漏れなく接続。", length: "long", variantConfig: { pipeSize: 5 } },
    { id: "t_bio_flow", name: "バイオ液循環路修復", desc: "5×5培養槽間の栄養液パイプを連結する。", length: "long", variantConfig: { pipeSize: 5 } },
    { id: "t_steam_grid", name: "高圧蒸気管路接続", desc: "5×5ボイラー蒸気管のバイパスを完成させる。", length: "long", variantConfig: { pipeSize: 5 } },
    { id: "t_reactor_loop", name: "主炉心冷却ループ完成", desc: "複雑に絡んだ5×5炉心冷却管を一直線に結ぶ。", length: "long", variantConfig: { pipeSize: 5 } },
  ]),

  // 12. rhythm_sync (10)
  ...buildFamilyTasks("rhythm_sync", [
    { id: "t_rhythm_sync", name: "通信パルス同期", desc: "流れるパルスが中央ターゲット枠に来た瞬間にタップ。", variantConfig: { rhythmBeats: 5 } },
    { id: "t_sonar_ping", name: "ソナー反射同期", desc: "反響パルスが枠内に重なるタイミングで6回応答。", variantConfig: { rhythmBeats: 6 } },
    { id: "t_heartbeat", name: "人工心肺ペース調整", desc: "生体維持装置のリズム6拍に合わせてタイミング入力。", variantConfig: { rhythmBeats: 6 } },
    { id: "t_beacon_sync", name: "航法ビーコン同期", desc: "灯台パルス6回を連続タイミングで同期ロック。", variantConfig: { rhythmBeats: 6 } },
    { id: "t_engine_ign", name: "多気筒点火タイミング", desc: "7回の燃焼周期ピストン上死点でタイミング点火。", variantConfig: { rhythmBeats: 7 } },
    { id: "t_shield_harm", name: "バリア共振ハーモニー", desc: "波打つ防御波長7回を中央ゾーンでヒットする。", variantConfig: { rhythmBeats: 7 } },
    { id: "t_laser_pulse", name: "レーザーパルス整調", desc: "高速パルス8連をシビアな判定枠で打ち抜く。", length: "long", variantConfig: { rhythmBeats: 8 } },
    { id: "t_radar_sweep", name: "全周スキャン周期整合", desc: "掃引ライン8拍に合わせセンサー応答を入力。", length: "long", variantConfig: { rhythmBeats: 8 } },
    { id: "t_quantum_beat", name: "量子クロック校正", desc: "変則間隔の9ビートを的確に同期タップする。", length: "long", variantConfig: { rhythmBeats: 9 } },
    { id: "t_hyper_sync", name: "ハイパードライブ同期", desc: "超高速10拍パルスを誤差なく同期し跳躍準備。", length: "long", variantConfig: { rhythmBeats: 10 } },
  ]),

  // 13. maze_trace (10)
  ...buildFamilyTasks("maze_trace", [
    { id: "t_nav_chart", name: "航路チャート設定", desc: "始点から終点まで障害物を避けてノードを順に辿る。", variantConfig: { gridSize: 4 } },
    { id: "t_star_map_connect", name: "星座ナビ結合", desc: "指定された星ノードを1→2→3…の順番で結ぶ。", variantConfig: { gridSize: 4 } },
    { id: "t_laser_grid", name: "レーザー誘導路確保", desc: "赤い妨害マスを踏まずに発振器から受光部へ誘導。", variantConfig: { gridSize: 4 } },
    { id: "t_drone_route", name: "配送ドローン航路入力", desc: "障害を避けながら全チェックポイントを一筆結び。", variantConfig: { gridSize: 5 } },
    { id: "t_circuit_trace", name: "マイクロ基板トレース", desc: "ショート箇所を回避して5×5配線ルートを繋ぐ。", variantConfig: { gridSize: 5 } },
    { id: "t_warp_course", name: "重力井戸回避コース", desc: "ブラックホール危険マスを迂回して航路を確定。", length: "long", variantConfig: { gridSize: 5 } },
    { id: "t_vent_map", name: "換気ルート点検スキャン", desc: "5×5ダクト格子の中継ポイント順路を辿る。", variantConfig: { gridSize: 5 } },
    { id: "t_neural_link", name: "生体神経パス再接続", desc: "損傷ノードを避け6個のシナプスを順番に接続。", length: "long", variantConfig: { gridSize: 5 } },
    { id: "t_tunnel_path", name: "地下採掘坑道ナビ", desc: "落盤マスを避けて脱出坑道ルートを接続する。", length: "long", variantConfig: { gridSize: 5 } },
    { id: "t_ruin_sigil", name: "古代遺跡の印章一筆書き", desc: "遺跡の守護刻印ノードを途切れず順路通り結ぶ。", length: "long", variantConfig: { gridSize: 6 } },
  ]),

  // 14. radar_lock (10)
  ...buildFamilyTasks("radar_lock", [
    { id: "t_radar_calibrate", name: "深宇宙レーダー捕捉", desc: "レーダースコープ上を移動する目標を連続ロック。", variantConfig: { targetCount: 4 } },
    { id: "t_docking", name: "シャトルドッキング誘導", desc: "揺れるドッキング標的に照準を合わせて固定。", variantConfig: { targetCount: 4 } },
    { id: "t_sat_track", name: "人工衛星自動追尾", desc: "高速移動する通信衛星5機をスコープで捕捉。", variantConfig: { targetCount: 5 } },
    { id: "t_beacon_lock", name: "遭難信号発信源特定", desc: "ノイズの中を移動するSOS発信点を5回ロック。", variantConfig: { targetCount: 5 } },
    { id: "t_escape_track", name: "逃走ポッド軌道追跡", desc: "変則軌道のポッドマーカーを6回高精度捕捉。", variantConfig: { targetCount: 6 } },
    { id: "t_swarm_track", name: "未確認物体群ロック", desc: "小型シグナル6個をレーダー掃引中に捕捉。", length: "long", variantConfig: { targetCount: 6 } },
    { id: "t_gravity_anom", name: "重力異常点マーキング", desc: "不安定に移動する重力異常座標を7点ロック。", length: "long", variantConfig: { targetCount: 7 } },
    { id: "t_torpedo_def", name: "接近魚雷追尾ロック", desc: "高速度で迫る7発の反応を迎撃システムへ連動。", length: "long", variantConfig: { targetCount: 7 } },
    { id: "t_comet_track", name: "彗星尾核ピンポイント捕捉", desc: "小さな彗星核8点を時間制限内に連続捕捉。", length: "long", variantConfig: { targetCount: 8 } },
    { id: "t_stealth_hunt", name: "ステルス反応精密探知", desc: "点滅しながら高速移動する9個の影をロックオン。", length: "long", variantConfig: { targetCount: 9 } },
  ]),

  // 15. cipher_decode (10)
  ...buildFamilyTasks("cipher_decode", [
    { id: "t_cyber_decrypt", name: "サイバー暗号復号", desc: "記号対応表から暗号メッセージの正しい4文字を選択。", variantConfig: { cipherHint: "★=S  ▲=T  ●=A  ◆=R", cipherAnswer: "STAR" } },
    { id: "t_ancient_tablet", name: "古代石板解読", desc: "遺跡シンボル列を読み解いて救難コードを復号。", variantConfig: { cipherHint: "◎=C  ◆=R  ■=E  ▲=W", cipherAnswer: "CREW" } },
    { id: "t_cipher_void", name: "深宇宙ログ復元", desc: "破損した受信記号4文字の翻訳キーを選ぶ。", variantConfig: { cipherHint: "▼=V  ○=O  ｜=I  ◇=D", cipherAnswer: "VOID" } },
    { id: "t_cipher_core", name: "炉心警告文翻訳", desc: "危険アラートの暗号シンボルを復号して承認。", variantConfig: { cipherHint: "◎=C  ○=O  ◆=R  ■=E", cipherAnswer: "CORE" } },
    { id: "t_cipher_warp", name: "跳躍座標デコード", desc: "亜空間ナビゲーション記号を正しく解読する。", variantConfig: { cipherHint: "▲=W  ●=A  ◆=R  ★=P", cipherAnswer: "WARP" } },
    { id: "t_cipher_safe", name: "安全プロトコル復号", desc: "セキュリティ暗号表に従って正しい語句を送信。", variantConfig: { cipherHint: "★=S  ●=A  ▼=F  ■=E", cipherAnswer: "SAFE" } },
    { id: "t_cipher_nova", name: "超新星観測ログ復号", desc: "観測所の5文字天文記号暗号を翻訳解読する。", length: "long", variantConfig: { cipherHint: "◆=N  ○=O  ▼=V  ●=A  ★=S", cipherAnswer: "NOVAS" } },
    { id: "t_cipher_orbit", name: "周回軌道パラメータ解読", desc: "5文字暗号テーブルから正しい軌道語を特定。", length: "long", variantConfig: { cipherHint: "○=O  ◆=R  ■=B  ｜=I  ▲=T", cipherAnswer: "ORBIT" } },
    { id: "t_cipher_solar", name: "太陽風暗号テレメトリ", desc: "太陽観測所の5桁暗号シンボルを正しく復号。", length: "long", variantConfig: { cipherHint: "★=S  ○=O  ▼=L  ●=A  ◆=R", cipherAnswer: "SOLAR" } },
    { id: "t_cipher_nexus", name: "異星文明碑文デコード", desc: "5文字の異星文明グリフを対応表で完全解読。", length: "long", variantConfig: { cipherHint: "◆=N  ■=E  ✖=X  ▲=U  ★=S", cipherAnswer: "NEXUS" } },
  ]),
];

export const TASKS: TaskDef[] = TASK_CATALOG_150;

export const TASK_BY_ID: Record<string, TaskDef> = Object.fromEntries(
  TASK_CATALOG_150.map((t) => [t.id, t])
);

export function getTaskById(taskId: string): TaskDef {
  return TASK_BY_ID[taskId] || TASK_CATALOG_150[0];
}

export function getDifficultyMultiplier(mode: TaskDifficultyMode): {
  speedScale: number;
  toleranceScale: number;
  extraCount: number;
  lockoutMs: number;
} {
  if (mode === "NORMAL") {
    return { speedScale: 0.78, toleranceScale: 1.35, extraCount: 0, lockoutMs: 500 };
  }
  if (mode === "EXTREME") {
    return { speedScale: 1.32, toleranceScale: 0.72, extraCount: 2, lockoutMs: 1100 };
  }
  return { speedScale: 1.04, toleranceScale: 0.94, extraCount: 1, lockoutMs: 800 };
}
