// Extracted baseline 15 maps data
/* eslint-disable */
export const BASE_MAPS_RAW: Record<string, any> = {
	"starship": {
		"id": "starship",
		"name": "🚀 宇宙船スターシップ号",
		"bg": "#03060f",
		"accent": "#38bdf8",
		"corridorFill": "#131d31",
		"wallColor": "#334155",
		"exteriorTheme": "space",
		"rooms": [
			{
				"id": "cafeteria",
				"name": "カフェテリア",
				"x": 760,
				"y": 120,
				"w": 460,
				"h": 310,
				"color": "#1a2740",
				"floorStyle": "tile"
			},
			{
				"id": "weapons",
				"name": "武器庫",
				"x": 1410,
				"y": 140,
				"w": 320,
				"h": 250,
				"color": "#1b2944",
				"floorStyle": "metal"
			},
			{
				"id": "o2",
				"name": "酸素供給室",
				"x": 1270,
				"y": 460,
				"w": 220,
				"h": 200,
				"color": "#162b3d",
				"floorStyle": "lab"
			},
			{
				"id": "navigation",
				"name": "ナビゲーション室",
				"x": 1580,
				"y": 470,
				"w": 300,
				"h": 270,
				"color": "#172845",
				"floorStyle": "metal"
			},
			{
				"id": "shields",
				"name": "シールド制御室",
				"x": 1420,
				"y": 830,
				"w": 300,
				"h": 240,
				"color": "#1b2642",
				"floorStyle": "metal"
			},
			{
				"id": "admin",
				"name": "アドミン管理室",
				"x": 1090,
				"y": 580,
				"w": 220,
				"h": 210,
				"color": "#182b3a",
				"floorStyle": "tile"
			},
			{
				"id": "storage",
				"name": "ストレージ",
				"x": 780,
				"y": 800,
				"w": 400,
				"h": 310,
				"color": "#1c2438",
				"floorStyle": "cargo"
			},
			{
				"id": "electrical",
				"name": "電気室",
				"x": 370,
				"y": 740,
				"w": 270,
				"h": 260,
				"color": "#22243b",
				"floorStyle": "metal"
			},
			{
				"id": "security",
				"name": "セキュリティ室",
				"x": 360,
				"y": 490,
				"w": 180,
				"h": 170,
				"color": "#1c283f",
				"floorStyle": "metal"
			},
			{
				"id": "medbay",
				"name": "医務室",
				"x": 430,
				"y": 240,
				"w": 240,
				"h": 210,
				"color": "#142c40",
				"floorStyle": "lab"
			},
			{
				"id": "reactor",
				"name": "リアクター炉心室",
				"x": 90,
				"y": 430,
				"w": 210,
				"h": 350,
				"color": "#271d38",
				"floorStyle": "metal"
			},
			{
				"id": "upper_bridge",
				"name": "2F 艦橋ブリッジ",
				"x": 760,
				"y": 120,
				"w": 480,
				"h": 290,
				"color": "#1d3154",
				"floorStyle": "tile",
				"floor": 2
			},
			{
				"id": "upper_port_obs",
				"name": "2F 左舷観測室",
				"x": 400,
				"y": 200,
				"w": 300,
				"h": 240,
				"color": "#192b49",
				"floorStyle": "lab",
				"floor": 2
			},
			{
				"id": "upper_star_solar",
				"name": "2F 右舷ソーラー制御",
				"x": 1320,
				"y": 160,
				"w": 340,
				"h": 250,
				"color": "#1f2e4d",
				"floorStyle": "metal",
				"floor": 2
			}
		],
		"corridors": [
			{
				"x": 1200,
				"y": 230,
				"w": 230,
				"h": 74
			},
			{
				"x": 1530,
				"y": 370,
				"w": 76,
				"h": 250
			},
			{
				"x": 1470,
				"y": 525,
				"w": 130,
				"h": 72
			},
			{
				"x": 1530,
				"y": 720,
				"w": 76,
				"h": 130
			},
			{
				"x": 1160,
				"y": 920,
				"w": 280,
				"h": 74
			},
			{
				"x": 945,
				"y": 410,
				"w": 78,
				"h": 410
			},
			{
				"x": 1005,
				"y": 650,
				"w": 105,
				"h": 72
			},
			{
				"x": 650,
				"y": 290,
				"w": 130,
				"h": 74
			},
			{
				"x": 300,
				"y": 310,
				"w": 150,
				"h": 72
			},
			{
				"x": 280,
				"y": 540,
				"w": 100,
				"h": 72
			},
			{
				"x": 300,
				"y": 310,
				"w": 72,
				"h": 610
			},
			{
				"x": 330,
				"y": 840,
				"w": 70,
				"h": 76
			},
			{
				"x": 620,
				"y": 890,
				"w": 180,
				"h": 74
			},
			{
				"x": 680,
				"y": 245,
				"w": 100,
				"h": 76,
				"floor": 2
			},
			{
				"x": 1220,
				"y": 245,
				"w": 120,
				"h": 76,
				"floor": 2
			}
		],
		"obstacles": [
			{
				"id": "cafe_t1",
				"kind": "table_round",
				"x": 815,
				"y": 175,
				"w": 54,
				"h": 54,
				"blocksSight": false
			},
			{
				"id": "cafe_t2",
				"kind": "table_round",
				"x": 1110,
				"y": 175,
				"w": 54,
				"h": 54,
				"blocksSight": false
			},
			{
				"id": "cafe_t3",
				"kind": "table_round",
				"x": 815,
				"y": 335,
				"w": 54,
				"h": 54,
				"blocksSight": false
			},
			{
				"id": "storage_c1",
				"kind": "crate",
				"x": 870,
				"y": 900,
				"w": 68,
				"h": 68,
				"blocksSight": true
			},
			{
				"id": "storage_c2",
				"kind": "crate",
				"x": 1030,
				"y": 970,
				"w": 64,
				"h": 54,
				"blocksSight": true
			},
			{
				"id": "elec_wall",
				"kind": "server",
				"x": 480,
				"y": 815,
				"w": 54,
				"h": 95,
				"blocksSight": true
			},
			{
				"id": "reactor_core",
				"kind": "reactor",
				"x": 165,
				"y": 565,
				"w": 66,
				"h": 74,
				"blocksSight": true
			},
			{
				"id": "up_bridge_tbl",
				"kind": "table_round",
				"x": 968,
				"y": 245,
				"w": 64,
				"h": 64,
				"blocksSight": false,
				"floor": 2
			},
			{
				"id": "up_solar_srv",
				"kind": "server",
				"x": 1470,
				"y": 240,
				"w": 50,
				"h": 80,
				"blocksSight": true,
				"floor": 2
			}
		],
		"decors": [
			{
				"kind": "window",
				"x": 920,
				"y": 122,
				"w": 140,
				"h": 14
			},
			{
				"kind": "window",
				"x": 1760,
				"y": 472,
				"w": 90,
				"h": 14
			},
			{
				"kind": "med_scanner",
				"x": 520,
				"y": 325,
				"w": 64,
				"h": 64,
				"label": "SCAN"
			},
			{
				"kind": "med_bed",
				"x": 450,
				"y": 260,
				"w": 44,
				"h": 74
			},
			{
				"kind": "turret",
				"x": 1580,
				"y": 180,
				"w": 60,
				"h": 50
			},
			{
				"kind": "caution",
				"x": 945,
				"y": 430,
				"w": 78,
				"h": 16
			},
			{
				"kind": "caution",
				"x": 640,
				"y": 890,
				"w": 18,
				"h": 74
			},
			{
				"kind": "camera_prop",
				"x": 720,
				"y": 300,
				"w": 20,
				"h": 20
			},
			{
				"kind": "camera_prop",
				"x": 1525,
				"y": 440,
				"w": 20,
				"h": 20
			},
			{
				"kind": "camera_prop",
				"x": 950,
				"y": 650,
				"w": 20,
				"h": 20
			},
			{
				"kind": "camera_prop",
				"x": 310,
				"y": 545,
				"w": 20,
				"h": 20
			},
			{
				"kind": "window",
				"x": 880,
				"y": 122,
				"w": 240,
				"h": 14,
				"floor": 2
			},
			{
				"kind": "caution",
				"x": 690,
				"y": 245,
				"w": 20,
				"h": 76,
				"floor": 2
			}
		],
		"vents": [
			{
				"id": "v1",
				"x": 410,
				"y": 785,
				"label": "電気室ベント"
			},
			{
				"id": "v2",
				"x": 615,
				"y": 280,
				"label": "医務室ベント"
			},
			{
				"id": "v3",
				"x": 1810,
				"y": 605,
				"label": "ナビ室ベント"
			},
			{
				"id": "v4",
				"x": 1130,
				"y": 630,
				"label": "アドミン室ベント"
			},
			{
				"id": "v2f_1",
				"x": 455,
				"y": 390,
				"label": "2F 左舷観測ダクト",
				"floor": 2
			},
			{
				"id": "v2f_2",
				"x": 1600,
				"y": 360,
				"label": "2F ソーラー制御ダクト",
				"floor": 2
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 590,
				"y": 780
			},
			{
				"taskId": "t_code",
				"x": 1680,
				"y": 220
			},
			{
				"taskId": "t_freq",
				"x": 1800,
				"y": 540
			},
			{
				"taskId": "t_asteroid",
				"x": 980,
				"y": 1055
			},
			{
				"taskId": "t_reactor_align",
				"x": 135,
				"y": 495
			},
			{
				"taskId": "t_security_pass",
				"x": 1560,
				"y": 945
			},
			{
				"taskId": "t_sample_scan",
				"x": 550,
				"y": 360
			},
			{
				"taskId": "t_nav_chart",
				"x": 1760,
				"y": 680
			},
			{
				"taskId": "t_shield_prime",
				"x": 1650,
				"y": 990
			},
			{
				"taskId": "t_fuel_engine",
				"x": 835,
				"y": 845
			},
			{
				"taskId": "t_o2_filter",
				"x": 1350,
				"y": 560
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1332,
				"y": 610,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1805,
				"y": 540,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1380,
				"y": 225,
				"floor": 2
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 625,
				"y": 245,
				"floor": 2
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1140,
				"y": 360,
				"floor": 2
			},
			{
				"taskId": "t_download",
				"x": 1490,
				"y": 215,
				"floor": 1
			},
			{
				"taskId": "t_trash_chute",
				"x": 1490,
				"y": 315,
				"floor": 1
			},
			{
				"taskId": "t_ice_melt",
				"x": 1650,
				"y": 315,
				"floor": 1
			},
			{
				"taskId": "t_thruster_pump",
				"x": 1570,
				"y": 203,
				"floor": 1
			},
			{
				"taskId": "t_star_map_connect",
				"x": 1570,
				"y": 328,
				"floor": 1
			},
			{
				"taskId": "t_cargo_manifest",
				"x": 1080,
				"y": 893,
				"floor": 1
			},
			{
				"taskId": "t_backup_upload",
				"x": 1570,
				"y": 265,
				"floor": 1
			},
			{
				"taskId": "t_sand_filter",
				"x": 1435,
				"y": 520,
				"floor": 1
			},
			{
				"taskId": "t_ancient_tablet",
				"x": 1435,
				"y": 600,
				"floor": 1
			},
			{
				"taskId": "t_warp_coil",
				"x": 1655,
				"y": 551,
				"floor": 1
			},
			{
				"taskId": "t_antimatter_cool",
				"x": 1655,
				"y": 659,
				"floor": 1
			}
		],
		"emergency": {
			"x": 990,
			"y": 270
		},
		"sabotageFix": {
			"lights": {
				"x": 420,
				"y": 955,
				"label": "電気室ブレーカー修理"
			},
			"reactor": {
				"x": 145,
				"y": 710,
				"label": "炉心冷却バルブ安定化"
			},
			"gas": {
				"x": 1380,
				"y": 604,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "📹 艦内監視カメラ（4地点切替・稼働赤ランプ）＋ 🗺️ アドミン人数盤 ＋ 🪜 1F/2F連絡エレベーター / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "camera",
				"label": "艦内監視カメラ（4地点切替）",
				"icon": "📹",
				"x": 450,
				"y": 575,
				"cooldownSec": 8,
				"durationSec": 10,
				"feeds": [
					{
						"label": "医務室前通路",
						"x": 715,
						"y": 325
					},
					{
						"label": "北東ナビ交差点",
						"x": 1565,
						"y": 560
					},
					{
						"label": "中央アドミン分岐",
						"x": 984,
						"y": 660
					},
					{
						"label": "西リアクター通路",
						"x": 335,
						"y": 575
					}
				]
			},
			{
				"type": "admin",
				"label": "アドミン人数モニター（5秒表示）",
				"icon": "🗺️",
				"x": 1200,
				"y": 685,
				"cooldownSec": 12,
				"durationSec": 5
			},
			{
				"type": "stairs",
				"id": "starship_st_0_up",
				"label": "🪜 2F 艦橋ブリッジへ上がる",
				"icon": "🪜",
				"x": 990,
				"y": 175,
				"floor": 1,
				"targetFloor": 2,
				"targetX": 1e3,
				"targetY": 175,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "starship_st_0_dn",
				"label": "🪜 1F カフェテリアへ降りる",
				"icon": "🪜",
				"x": 1e3,
				"y": 175,
				"floor": 2,
				"targetFloor": 1,
				"targetX": 990,
				"targetY": 175,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "starship_st_1_up",
				"label": "🪜 2F 左舷観測室へ上がる",
				"icon": "🪜",
				"x": 500,
				"y": 310,
				"floor": 1,
				"targetFloor": 2,
				"targetX": 500,
				"targetY": 310,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "starship_st_1_dn",
				"label": "🪜 1F メドベイへ降りる",
				"icon": "🪜",
				"x": 500,
				"y": 310,
				"floor": 2,
				"targetFloor": 1,
				"targetX": 500,
				"targetY": 310,
				"cooldownSec": 2
			},
			{
				"id": "starship_auto_door_1",
				"type": "auto_door",
				"x": 1315,
				"y": 267,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 1305,
					"y": 230,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "starship_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1568,
				"y": 495,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1530,
					"y": 485,
					"w": 76,
					"h": 20,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		],
		"hasMultiFloor": true,
		"floorNames": {
			"1": "1F メインデッキ",
			"2": "2F 上層ブリッジ"
		}
	},
	"polus": {
		"id": "polus",
		"name": "❄️ 惑星基地ポールス・アウトポスト",
		"bg": "#040a14",
		"accent": "#7dd3fc",
		"corridorFill": "#122238",
		"wallColor": "#3b5170",
		"exteriorTheme": "snow",
		"rooms": [
			{
				"id": "office",
				"name": "中央オフィス",
				"x": 800,
				"y": 140,
				"w": 430,
				"h": 290,
				"color": "#172b47",
				"floorStyle": "tile"
			},
			{
				"id": "comms",
				"name": "通信ドーム",
				"x": 1420,
				"y": 160,
				"w": 330,
				"h": 260,
				"color": "#1a3152",
				"floorStyle": "metal"
			},
			{
				"id": "lab",
				"name": "氷河研究所",
				"x": 1420,
				"y": 650,
				"w": 380,
				"h": 330,
				"color": "#143250",
				"floorStyle": "lab"
			},
			{
				"id": "o2",
				"name": "酸素供給プラント",
				"x": 810,
				"y": 760,
				"w": 400,
				"h": 300,
				"color": "#182c47",
				"floorStyle": "metal"
			},
			{
				"id": "boiler",
				"name": "地熱ボイラー室",
				"x": 220,
				"y": 700,
				"w": 350,
				"h": 320,
				"color": "#272642",
				"floorStyle": "cargo"
			},
			{
				"id": "dropship",
				"name": "着陸船ドック",
				"x": 240,
				"y": 180,
				"w": 330,
				"h": 280,
				"color": "#192a45",
				"floorStyle": "metal"
			},
			{
				"id": "specimens",
				"name": "標本保管庫",
				"x": 1110,
				"y": 470,
				"w": 210,
				"h": 210,
				"color": "#152e46",
				"floorStyle": "lab"
			}
		],
		"corridors": [
			{
				"x": 1210,
				"y": 245,
				"w": 230,
				"h": 74
			},
			{
				"x": 1550,
				"y": 400,
				"w": 78,
				"h": 270
			},
			{
				"x": 1190,
				"y": 840,
				"w": 250,
				"h": 76
			},
			{
				"x": 965,
				"y": 410,
				"w": 76,
				"h": 370
			},
			{
				"x": 550,
				"y": 265,
				"w": 270,
				"h": 76
			},
			{
				"x": 350,
				"y": 440,
				"w": 76,
				"h": 280
			},
			{
				"x": 550,
				"y": 840,
				"w": 280,
				"h": 76
			},
			{
				"x": 1025,
				"y": 540,
				"w": 105,
				"h": 72
			},
			{
				"x": 1300,
				"y": 540,
				"w": 140,
				"h": 72
			}
		],
		"obstacles": [
			{
				"id": "pol_off_t",
				"kind": "table_rect",
				"x": 850,
				"y": 205,
				"w": 90,
				"h": 48,
				"blocksSight": false
			},
			{
				"id": "pol_spec_tank",
				"kind": "tank",
				"x": 1190,
				"y": 545,
				"w": 54,
				"h": 54,
				"blocksSight": true
			},
			{
				"id": "pol_o2_tank",
				"kind": "crate",
				"x": 980,
				"y": 880,
				"w": 70,
				"h": 60,
				"blocksSight": true
			},
			{
				"id": "pol_boil_core",
				"kind": "reactor",
				"x": 360,
				"y": 825,
				"w": 66,
				"h": 66,
				"blocksSight": true
			}
		],
		"decors": [
			{
				"kind": "window",
				"x": 950,
				"y": 142,
				"w": 140,
				"h": 14
			},
			{
				"kind": "pipes",
				"x": 230,
				"y": 710,
				"w": 330,
				"h": 24
			},
			{
				"kind": "med_scanner",
				"x": 1500,
				"y": 710,
				"w": 60,
				"h": 60,
				"label": "ICE-LAB"
			},
			{
				"kind": "caution",
				"x": 965,
				"y": 430,
				"w": 76,
				"h": 16
			}
		],
		"vents": [
			{
				"id": "v1",
				"x": 280,
				"y": 765,
				"label": "ボイラー雪穴ベント"
			},
			{
				"id": "v2",
				"x": 1730,
				"y": 720,
				"label": "研究所雪穴ベント"
			},
			{
				"id": "v3",
				"x": 1680,
				"y": 225,
				"label": "通信ドーム雪穴ベント"
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 285,
				"y": 950
			},
			{
				"taskId": "t_code",
				"x": 1670,
				"y": 360
			},
			{
				"taskId": "t_freq",
				"x": 1490,
				"y": 920
			},
			{
				"taskId": "t_asteroid",
				"x": 1130,
				"y": 990
			},
			{
				"taskId": "t_reactor_align",
				"x": 500,
				"y": 770
			},
			{
				"taskId": "t_security_pass",
				"x": 320,
				"y": 250
			},
			{
				"taskId": "t_sample_scan",
				"x": 1730,
				"y": 910
			},
			{
				"taskId": "t_ice_melt",
				"x": 1620,
				"y": 720
			},
			{
				"taskId": "t_magma_vent",
				"x": 500,
				"y": 955
			},
			{
				"taskId": "t_fuel_engine",
				"x": 485,
				"y": 240
			},
			{
				"taskId": "t_o2_filter",
				"x": 1150,
				"y": 515
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1526,
				"y": 898,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1110,
				"y": 838,
				"floor": 1
			},
			{
				"taskId": "t_download",
				"x": 1503,
				"y": 238,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1668,
				"y": 238,
				"floor": 1
			},
			{
				"taskId": "t_star_map_connect",
				"x": 1503,
				"y": 342,
				"floor": 1
			},
			{
				"taskId": "t_cargo_manifest",
				"x": 1585,
				"y": 225,
				"floor": 1
			},
			{
				"taskId": "t_backup_upload",
				"x": 1585,
				"y": 355,
				"floor": 1
			},
			{
				"taskId": "t_hull_seal",
				"x": 1585,
				"y": 290,
				"floor": 1
			},
			{
				"taskId": "t_ancient_tablet",
				"x": 1515,
				"y": 749,
				"floor": 1
			},
			{
				"taskId": "t_warp_coil",
				"x": 1705,
				"y": 749,
				"floor": 1
			},
			{
				"taskId": "t_antimatter_cool",
				"x": 1610,
				"y": 898,
				"floor": 1
			},
			{
				"taskId": "t_shrine_bell",
				"x": 1534,
				"y": 815,
				"floor": 1
			}
		],
		"emergency": {
			"x": 1030,
			"y": 295
		},
		"sabotageFix": {
			"lights": {
				"x": 475,
				"y": 960,
				"label": "地熱発電ブレーカー修理"
			},
			"reactor": {
				"x": 890,
				"y": 980,
				"label": "酸素・温度調整バルブ修理"
			},
			"gas": {
				"x": 1010,
				"y": 976,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "❄️ 凍結アイスフロア（氷河研究所の滑走床）＋ 💓 バイタルモニター端末 / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "ice",
				"label": "凍結フロア",
				"x": 1455,
				"y": 685,
				"w": 310,
				"h": 260
			},
			{
				"type": "vitals",
				"label": "バイタルモニター確認（5秒表示）",
				"icon": "💓",
				"x": 1165,
				"y": 230,
				"cooldownSec": 14,
				"durationSec": 5
			},
			{
				"id": "polus_auto_door_1",
				"type": "auto_door",
				"x": 1325,
				"y": 282,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 1315,
					"y": 245,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "polus_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1589,
				"y": 535,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1550,
					"y": 525,
					"w": 78,
					"h": 20,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		]
	},
	"mira": {
		"id": "mira",
		"name": "☁️ 天空軌道ステーション MIRA-HQ",
		"bg": "#070918",
		"accent": "#c084fc",
		"corridorFill": "#1e1b38",
		"wallColor": "#4c3f7a",
		"exteriorTheme": "clouds",
		"rooms": [
			{
				"id": "launchpad",
				"name": "スカイデッキ",
				"x": 780,
				"y": 130,
				"w": 430,
				"h": 270,
				"color": "#241f42",
				"floorStyle": "tile"
			},
			{
				"id": "greenhouse",
				"name": "植物バイオドーム",
				"x": 1420,
				"y": 220,
				"w": 380,
				"h": 320,
				"color": "#19333c",
				"floorStyle": "garden"
			},
			{
				"id": "admin",
				"name": "管理指令室",
				"x": 1370,
				"y": 760,
				"w": 350,
				"h": 290,
				"color": "#272047",
				"floorStyle": "tile"
			},
			{
				"id": "balcony",
				"name": "展望バルコニー",
				"x": 770,
				"y": 820,
				"w": 430,
				"h": 280,
				"color": "#1f2647",
				"floorStyle": "tile"
			},
			{
				"id": "reactor_mira",
				"name": "高空エネルギー室",
				"x": 200,
				"y": 500,
				"w": 330,
				"h": 330,
				"color": "#2e1d42",
				"floorStyle": "metal"
			},
			{
				"id": "decon",
				"name": "除染エアロック廊下",
				"x": 640,
				"y": 560,
				"w": 200,
				"h": 170,
				"color": "#1e2747",
				"floorStyle": "lab"
			}
		],
		"corridors": [
			{
				"x": 1190,
				"y": 280,
				"w": 250,
				"h": 74
			},
			{
				"x": 1550,
				"y": 520,
				"w": 76,
				"h": 260
			},
			{
				"x": 1180,
				"y": 895,
				"w": 210,
				"h": 74
			},
			{
				"x": 945,
				"y": 380,
				"w": 76,
				"h": 460
			},
			{
				"x": 510,
				"y": 610,
				"w": 150,
				"h": 74
			},
			{
				"x": 820,
				"y": 610,
				"w": 145,
				"h": 74
			}
		],
		"obstacles": [
			{
				"id": "mira_gh_tree",
				"kind": "tank",
				"x": 1585,
				"y": 355,
				"w": 62,
				"h": 62,
				"blocksSight": true
			},
			{
				"id": "mira_adm_t",
				"kind": "table_rect",
				"x": 1510,
				"y": 880,
				"w": 80,
				"h": 48,
				"blocksSight": false
			},
			{
				"id": "mira_reac_p",
				"kind": "reactor",
				"x": 330,
				"y": 635,
				"w": 62,
				"h": 62,
				"blocksSight": true
			}
		],
		"decors": [
			{
				"kind": "window",
				"x": 880,
				"y": 1086,
				"w": 210,
				"h": 14
			},
			{
				"kind": "caution",
				"x": 650,
				"y": 565,
				"w": 16,
				"h": 160
			},
			{
				"kind": "caution",
				"x": 822,
				"y": 565,
				"w": 16,
				"h": 160
			}
		],
		"vents": [
			{
				"id": "v1",
				"x": 1710,
				"y": 285,
				"label": "バイオドームダクト"
			},
			{
				"id": "v2",
				"x": 265,
				"y": 560,
				"label": "エネルギー室ダクト"
			},
			{
				"id": "v3",
				"x": 1435,
				"y": 985,
				"label": "管理指令室ダクト"
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 260,
				"y": 775
			},
			{
				"taskId": "t_code",
				"x": 1650,
				"y": 825
			},
			{
				"taskId": "t_freq",
				"x": 1120,
				"y": 1020
			},
			{
				"taskId": "t_asteroid",
				"x": 1490,
				"y": 470
			},
			{
				"taskId": "t_reactor_align",
				"x": 465,
				"y": 565
			},
			{
				"taskId": "t_security_pass",
				"x": 1440,
				"y": 815
			},
			{
				"taskId": "t_sample_scan",
				"x": 1725,
				"y": 465
			},
			{
				"taskId": "t_botany_water",
				"x": 1485,
				"y": 290
			},
			{
				"taskId": "t_manifold_num",
				"x": 475,
				"y": 765
			},
			{
				"taskId": "t_o2_filter",
				"x": 740,
				"y": 690
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1468,
				"y": 978,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1093,
				"y": 893,
				"floor": 1
			},
			{
				"taskId": "t_download",
				"x": 1705,
				"y": 316,
				"floor": 1
			},
			{
				"taskId": "t_fuel_engine",
				"x": 1610,
				"y": 300,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1610,
				"y": 460,
				"floor": 1
			},
			{
				"taskId": "t_ice_melt",
				"x": 1534,
				"y": 380,
				"floor": 1
			},
			{
				"taskId": "t_magma_vent",
				"x": 1686,
				"y": 380,
				"floor": 1
			},
			{
				"taskId": "t_cargo_manifest",
				"x": 1633,
				"y": 963,
				"floor": 1
			},
			{
				"taskId": "t_backup_upload",
				"x": 1545,
				"y": 833,
				"floor": 1
			},
			{
				"taskId": "t_hull_seal",
				"x": 1545,
				"y": 978,
				"floor": 1
			},
			{
				"taskId": "t_airlock_flush",
				"x": 1475,
				"y": 905,
				"floor": 1
			},
			{
				"taskId": "t_warp_coil",
				"x": 1615,
				"y": 905,
				"floor": 1
			},
			{
				"taskId": "t_antimatter_cool",
				"x": 878,
				"y": 904,
				"floor": 1
			},
			{
				"taskId": "t_shrine_bell",
				"x": 878,
				"y": 1016,
				"floor": 1
			},
			{
				"taskId": "t_prison_cell_lock",
				"x": 985,
				"y": 890,
				"floor": 1
			}
		],
		"emergency": {
			"x": 995,
			"y": 265
		},
		"sabotageFix": {
			"lights": {
				"x": 1650,
				"y": 985,
				"label": "配電盤システム復旧"
			},
			"reactor": {
				"x": 365,
				"y": 785,
				"label": "反重力コア安定化"
			},
			"gas": {
				"x": 1610,
				"y": 450,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "🌪️ 高空エアチューブ（12秒CD調整済）＋ 📜 センサー通過ログ端末 / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "teleport",
				"id": "mira_air_top",
				"targetId": "mira_air_bot",
				"label": "エアチューブ（展望台へ・CD12秒）",
				"icon": "🌪️",
				"x": 1140,
				"y": 265,
				"cooldownSec": 12
			},
			{
				"type": "teleport",
				"id": "mira_air_bot",
				"targetId": "mira_air_top",
				"label": "エアチューブ（デッキへ・CD12秒）",
				"icon": "🌪️",
				"x": 1140,
				"y": 960,
				"cooldownSec": 12
			},
			{
				"type": "doorlog",
				"label": "センサー通過ログ閲覧（5秒）",
				"icon": "📜",
				"x": 740,
				"y": 645,
				"cooldownSec": 10,
				"durationSec": 5
			},
			{
				"id": "mira_auto_door_1",
				"type": "auto_door",
				"x": 1315,
				"y": 317,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 1305,
					"y": 280,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "mira_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1588,
				"y": 650,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1550,
					"y": 640,
					"w": 76,
					"h": 20,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		]
	},
	"airship": {
		"id": "airship",
		"name": "🛩️ 巨大飛行船エアシップ号",
		"bg": "#0c080a",
		"accent": "#fb7185",
		"corridorFill": "#291820",
		"wallColor": "#593344",
		"exteriorTheme": "clouds",
		"rooms": [
			{
				"id": "cockpit",
				"name": "操舵ブリッジ",
				"x": 150,
				"y": 460,
				"w": 310,
				"h": 320,
				"color": "#331d27",
				"floorStyle": "carpet"
			},
			{
				"id": "brig",
				"name": "中央ラウンジ",
				"x": 750,
				"y": 150,
				"w": 460,
				"h": 290,
				"color": "#2e1c29",
				"floorStyle": "carpet"
			},
			{
				"id": "vault",
				"name": "黄金保管庫",
				"x": 1440,
				"y": 170,
				"w": 350,
				"h": 290,
				"color": "#38261c",
				"floorStyle": "tile"
			},
			{
				"id": "engine_air",
				"name": "推進機関室",
				"x": 1440,
				"y": 720,
				"w": 350,
				"h": 310,
				"color": "#2b1b2e",
				"floorStyle": "metal"
			},
			{
				"id": "cargo",
				"name": "貨物甲板",
				"x": 750,
				"y": 780,
				"w": 460,
				"h": 290,
				"color": "#261d2e",
				"floorStyle": "cargo"
			},
			{
				"id": "records",
				"name": "機密アーカイブ室",
				"x": 480,
				"y": 480,
				"w": 220,
				"h": 220,
				"color": "#2c1f33",
				"floorStyle": "tile"
			},
			{
				"id": "sky_helm",
				"name": "2F 空中艦橋操舵室",
				"x": 750,
				"y": 140,
				"w": 460,
				"h": 290,
				"color": "#322042",
				"floorStyle": "carpet",
				"floor": 2
			},
			{
				"id": "sky_lounge",
				"name": "2F 展望ラウンジ",
				"x": 1440,
				"y": 170,
				"w": 350,
				"h": 280,
				"color": "#2d1d47",
				"floorStyle": "tile",
				"floor": 2
			}
		],
		"corridors": [
			{
				"x": 440,
				"y": 555,
				"w": 60,
				"h": 72
			},
			{
				"x": 680,
				"y": 555,
				"w": 290,
				"h": 72
			},
			{
				"x": 945,
				"y": 420,
				"w": 76,
				"h": 380
			},
			{
				"x": 1190,
				"y": 270,
				"w": 270,
				"h": 74
			},
			{
				"x": 1580,
				"y": 440,
				"w": 76,
				"h": 300
			},
			{
				"x": 1190,
				"y": 885,
				"w": 270,
				"h": 74
			},
			{
				"x": 1190,
				"y": 250,
				"w": 270,
				"h": 76,
				"floor": 2
			}
		],
		"obstacles": [
			{
				"id": "air_vault_g",
				"kind": "crate",
				"x": 1590,
				"y": 285,
				"w": 68,
				"h": 68,
				"blocksSight": true
			},
			{
				"id": "air_cargo_c",
				"kind": "crate",
				"x": 945,
				"y": 895,
				"w": 72,
				"h": 66,
				"blocksSight": true
			},
			{
				"id": "air_rec_s",
				"kind": "server",
				"x": 565,
				"y": 560,
				"w": 52,
				"h": 64,
				"blocksSight": true
			},
			{
				"id": "air2_tbl",
				"kind": "table_rect",
				"x": 940,
				"y": 260,
				"w": 90,
				"h": 48,
				"blocksSight": false,
				"floor": 2
			}
		],
		"decors": [
			{
				"kind": "window",
				"x": 155,
				"y": 540,
				"w": 14,
				"h": 150
			},
			{
				"kind": "carpet",
				"x": 780,
				"y": 240,
				"w": 400,
				"h": 110
			},
			{
				"kind": "pipes",
				"x": 1460,
				"y": 735,
				"w": 310,
				"h": 22
			},
			{
				"kind": "camera_prop",
				"x": 950,
				"y": 560,
				"w": 20,
				"h": 20
			},
			{
				"kind": "camera_prop",
				"x": 1590,
				"y": 560,
				"w": 20,
				"h": 20
			},
			{
				"kind": "window",
				"x": 850,
				"y": 142,
				"w": 260,
				"h": 14,
				"floor": 2
			}
		],
		"vents": [
			{
				"id": "v1",
				"x": 220,
				"y": 520,
				"label": "ブリッジ換気口"
			},
			{
				"id": "v2",
				"x": 1720,
				"y": 235,
				"label": "保管庫換気口"
			},
			{
				"id": "v3",
				"x": 1510,
				"y": 955,
				"label": "機関室換気口"
			},
			{
				"id": "v2f_air1",
				"x": 1720,
				"y": 230,
				"label": "2F 展望ダクト",
				"floor": 2
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 1720,
				"y": 810
			},
			{
				"taskId": "t_code",
				"x": 1500,
				"y": 390
			},
			{
				"taskId": "t_freq",
				"x": 230,
				"y": 710
			},
			{
				"taskId": "t_asteroid",
				"x": 840,
				"y": 985
			},
			{
				"taskId": "t_reactor_align",
				"x": 1700,
				"y": 965
			},
			{
				"taskId": "t_security_pass",
				"x": 1720,
				"y": 395
			},
			{
				"taskId": "t_sample_scan",
				"x": 1135,
				"y": 990
			},
			{
				"taskId": "t_trash_chute",
				"x": 1135,
				"y": 845
			},
			{
				"taskId": "t_fuel_engine",
				"x": 1510,
				"y": 790
			},
			{
				"taskId": "t_nav_chart",
				"x": 220,
				"y": 600
			},
			{
				"taskId": "t_calibrate_dist",
				"x": 1500,
				"y": 230
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 228,
				"y": 710,
				"floor": 1
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1538,
				"y": 388,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1703,
				"y": 801,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1520,
				"y": 380,
				"floor": 2
			},
			{
				"taskId": "t_memory_glyph",
				"x": 830,
				"y": 215,
				"floor": 2
			},
			{
				"taskId": "t_download",
				"x": 383,
				"y": 556,
				"floor": 1
			},
			{
				"taskId": "t_cyber_decrypt",
				"x": 383,
				"y": 684,
				"floor": 1
			},
			{
				"taskId": "t_backup_upload",
				"x": 305,
				"y": 540,
				"floor": 1
			},
			{
				"taskId": "t_hull_seal",
				"x": 305,
				"y": 700,
				"floor": 1
			},
			{
				"taskId": "t_airlock_flush",
				"x": 367,
				"y": 620,
				"floor": 1
			},
			{
				"taskId": "t_bio_incubator",
				"x": 305,
				"y": 620,
				"floor": 1
			},
			{
				"taskId": "t_antimatter_cool",
				"x": 1703,
				"y": 257,
				"floor": 1
			},
			{
				"taskId": "t_shrine_bell",
				"x": 1615,
				"y": 243,
				"floor": 1
			},
			{
				"taskId": "t_prison_cell_lock",
				"x": 1615,
				"y": 388,
				"floor": 1
			},
			{
				"taskId": "t_radar_calibrate",
				"x": 1545,
				"y": 315,
				"floor": 1
			}
		],
		"emergency": {
			"x": 985,
			"y": 295
		},
		"sabotageFix": {
			"lights": {
				"x": 820,
				"y": 845,
				"label": "貨物甲板ヒューズ修理"
			},
			"reactor": {
				"x": 1625,
				"y": 875,
				"label": "推進タービン圧安定化"
			},
			"gas": {
				"x": 1615,
				"y": 943,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "🪜 昇降貨物リフト（ラウンジ⇔貨物甲板・CD10秒）＋ 📹 飛行船監視カメラ ＋ 🪜 上層ブリッジ昇降機 / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "teleport",
				"id": "air_lift_top",
				"targetId": "air_lift_bot",
				"label": "昇降リフト（貨物甲板へ・CD10秒）",
				"icon": "🪜",
				"x": 1150,
				"y": 365,
				"cooldownSec": 10
			},
			{
				"type": "teleport",
				"id": "air_lift_bot",
				"targetId": "air_lift_top",
				"label": "昇降リフト（ラウンジへ・CD10秒）",
				"icon": "🪜",
				"x": 1150,
				"y": 830,
				"cooldownSec": 10
			},
			{
				"type": "camera",
				"label": "飛行船監視モニター（2視点）",
				"icon": "📹",
				"x": 380,
				"y": 520,
				"cooldownSec": 8,
				"durationSec": 10,
				"feeds": [{
					"label": "中央十字回廊",
					"x": 983,
					"y": 590
				}, {
					"label": "東キャットウォーク",
					"x": 1618,
					"y": 580
				}]
			},
			{
				"type": "stairs",
				"id": "airship_st_0_up",
				"label": "🪜 2F 操舵室へ上がる",
				"icon": "🪜",
				"x": 985,
				"y": 195,
				"floor": 1,
				"targetFloor": 2,
				"targetX": 985,
				"targetY": 195,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "airship_st_0_dn",
				"label": "🪜 1F 営倉へ降りる",
				"icon": "🪜",
				"x": 985,
				"y": 195,
				"floor": 2,
				"targetFloor": 1,
				"targetX": 985,
				"targetY": 195,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "airship_st_1_up",
				"label": "🪜 2F 展望ラウンジへ上がる",
				"icon": "🪜",
				"x": 1610,
				"y": 235,
				"floor": 1,
				"targetFloor": 2,
				"targetX": 1610,
				"targetY": 235,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "airship_st_1_dn",
				"label": "🪜 1F 金庫室へ降りる",
				"icon": "🪜",
				"x": 1610,
				"y": 235,
				"floor": 2,
				"targetFloor": 1,
				"targetX": 1610,
				"targetY": 235,
				"cooldownSec": 2
			},
			{
				"id": "airship_auto_door_1",
				"type": "auto_door",
				"x": 825,
				"y": 591,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 815,
					"y": 555,
					"w": 20,
					"h": 72,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "airship_shifting_wall_2",
				"type": "shifting_wall",
				"x": 983,
				"y": 610,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 945,
					"y": 600,
					"w": 76,
					"h": 20,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		],
		"hasMultiFloor": true,
		"floorNames": {
			"1": "1F 甲板フロア",
			"2": "2F 司令ブリッジ"
		}
	},
	"submerged": {
		"id": "submerged",
		"name": "🌊 深海研究ドーム・アトランティス",
		"bg": "#020b12",
		"accent": "#2dd4bf",
		"corridorFill": "#0e2936",
		"wallColor": "#1f5368",
		"exteriorTheme": "ocean",
		"rooms": [
			{
				"id": "atrium",
				"name": "アクアアトリウム",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#103442",
				"floorStyle": "tile"
			},
			{
				"id": "sonar",
				"name": "ソナー監視室",
				"x": 1430,
				"y": 180,
				"w": 340,
				"h": 270,
				"color": "#12384a",
				"floorStyle": "metal"
			},
			{
				"id": "submarine",
				"name": "潜水艇ドック",
				"x": 1410,
				"y": 710,
				"w": 380,
				"h": 320,
				"color": "#0f3042",
				"floorStyle": "cargo"
			},
			{
				"id": "hydro",
				"name": "水圧タービン室",
				"x": 220,
				"y": 710,
				"w": 350,
				"h": 320,
				"color": "#132b42",
				"floorStyle": "metal"
			},
			{
				"id": "bio",
				"name": "深海生物ラボ",
				"x": 240,
				"y": 200,
				"w": 340,
				"h": 290,
				"color": "#0e3640",
				"floorStyle": "lab"
			},
			{
				"id": "ballast",
				"name": "バラスト制御室",
				"x": 840,
				"y": 520,
				"w": 300,
				"h": 200,
				"color": "#102e3e",
				"floorStyle": "metal"
			}
		],
		"corridors": [
			{
				"x": 560,
				"y": 265,
				"w": 230,
				"h": 74
			},
			{
				"x": 1200,
				"y": 265,
				"w": 250,
				"h": 74
			},
			{
				"x": 1575,
				"y": 430,
				"w": 76,
				"h": 300
			},
			{
				"x": 365,
				"y": 470,
				"w": 76,
				"h": 260
			},
			{
				"x": 550,
				"y": 845,
				"w": 880,
				"h": 76
			},
			{
				"x": 955,
				"y": 400,
				"w": 74,
				"h": 140
			},
			{
				"x": 955,
				"y": 700,
				"w": 74,
				"h": 165
			}
		],
		"obstacles": [
			{
				"id": "sub_bio_t",
				"kind": "tank",
				"x": 380,
				"y": 315,
				"w": 62,
				"h": 62,
				"blocksSight": true
			},
			{
				"id": "sub_dock_c",
				"kind": "crate",
				"x": 1580,
				"y": 845,
				"w": 76,
				"h": 56,
				"blocksSight": true
			},
			{
				"id": "sub_bal_c",
				"kind": "console",
				"x": 955,
				"y": 590,
				"w": 68,
				"h": 48,
				"blocksSight": false
			}
		],
		"decors": [
			{
				"kind": "window",
				"x": 880,
				"y": 132,
				"w": 220,
				"h": 14
			},
			{
				"kind": "med_scanner",
				"x": 475,
				"y": 240,
				"w": 60,
				"h": 60,
				"label": "AQUA"
			},
			{
				"kind": "caution",
				"x": 955,
				"y": 715,
				"w": 74,
				"h": 16
			}
		],
		"vents": [
			{
				"id": "v1",
				"x": 295,
				"y": 265,
				"label": "生物ラボ排水管"
			},
			{
				"id": "v2",
				"x": 1700,
				"y": 245,
				"label": "ソナー室排水管"
			},
			{
				"id": "v3",
				"x": 1480,
				"y": 955,
				"label": "潜水ドック排水管"
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 285,
				"y": 950
			},
			{
				"taskId": "t_code",
				"x": 1720,
				"y": 785
			},
			{
				"taskId": "t_freq",
				"x": 1495,
				"y": 380
			},
			{
				"taskId": "t_asteroid",
				"x": 505,
				"y": 425
			},
			{
				"taskId": "t_reactor_align",
				"x": 500,
				"y": 790
			},
			{
				"taskId": "t_security_pass",
				"x": 1715,
				"y": 965
			},
			{
				"taskId": "t_sample_scan",
				"x": 300,
				"y": 425
			},
			{
				"taskId": "t_pressure_valve",
				"x": 285,
				"y": 780
			},
			{
				"taskId": "t_o2_filter",
				"x": 1480,
				"y": 780
			},
			{
				"taskId": "t_nav_chart",
				"x": 1700,
				"y": 380
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1516,
				"y": 950,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 483,
				"y": 793,
				"floor": 1
			},
			{
				"taskId": "t_download",
				"x": 1515,
				"y": 261,
				"floor": 1
			},
			{
				"taskId": "t_shield_prime",
				"x": 1685,
				"y": 261,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1600,
				"y": 248,
				"floor": 1
			},
			{
				"taskId": "t_hull_seal",
				"x": 1600,
				"y": 383,
				"floor": 1
			},
			{
				"taskId": "t_airlock_flush",
				"x": 1600,
				"y": 315,
				"floor": 1
			},
			{
				"taskId": "t_bio_incubator",
				"x": 325,
				"y": 287,
				"floor": 1
			},
			{
				"taskId": "t_holo_firewall",
				"x": 1600,
				"y": 790,
				"floor": 1
			},
			{
				"taskId": "t_shrine_bell",
				"x": 1600,
				"y": 950,
				"floor": 1
			},
			{
				"taskId": "t_prison_cell_lock",
				"x": 1524,
				"y": 870,
				"floor": 1
			},
			{
				"taskId": "t_radar_calibrate",
				"x": 1676,
				"y": 870,
				"floor": 1
			},
			{
				"taskId": "t_core_diagnostics",
				"x": 483,
				"y": 934,
				"floor": 1
			}
		],
		"emergency": {
			"x": 995,
			"y": 275
		},
		"sabotageFix": {
			"lights": {
				"x": 410,
				"y": 950,
				"label": "水力発電ブレーカー復旧"
			},
			"reactor": {
				"x": 1600,
				"y": 965,
				"label": "水圧隔壁バルブ閉鎖"
			},
			"gas": {
				"x": 395,
				"y": 940,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "📡 深海ソナー（18秒CD調整済）＋ 🚪 減圧隔壁シャッター（5秒封鎖・CD22秒） / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "sonar",
				"label": "深海ソナーパルス（CD18秒）",
				"icon": "📡",
				"x": 1610,
				"y": 315,
				"cooldownSec": 18,
				"durationSec": 4.5
			},
			{
				"type": "lockdown_door",
				"id": "sub_airlock",
				"label": "中央連絡隔壁を一時封鎖（5秒）",
				"icon": "🚪",
				"x": 905,
				"y": 655,
				"cooldownSec": 22,
				"durationSec": 5,
				"doorRect": {
					"x": 955,
					"y": 730,
					"w": 74,
					"h": 42
				}
			},
			{
				"id": "submerged_auto_door_1",
				"type": "auto_door",
				"x": 675,
				"y": 302,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 665,
					"y": 265,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "submerged_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1325,
				"y": 302,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1315,
					"y": 265,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		]
	},
	"volcano": {
		"id": "volcano",
		"name": "🌋 溶岩採掘プラント・イグニス",
		"bg": "#120402",
		"accent": "#fb923c",
		"corridorFill": "#2e140c",
		"wallColor": "#7c2d12",
		"exteriorTheme": "lava",
		"rooms": [
			{
				"id": "command",
				"name": "採掘司令センター",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#381910",
				"floorStyle": "metal"
			},
			{
				"id": "smelter",
				"name": "マグマ精錬炉",
				"x": 1410,
				"y": 460,
				"w": 380,
				"h": 360,
				"color": "#42180c",
				"floorStyle": "cargo"
			},
			{
				"id": "drill",
				"name": "地殻ドリル制御室",
				"x": 770,
				"y": 790,
				"w": 450,
				"h": 290,
				"color": "#331a12",
				"floorStyle": "metal"
			},
			{
				"id": "cooling",
				"name": "超冷却タワー",
				"x": 190,
				"y": 460,
				"w": 360,
				"h": 360,
				"color": "#1c263b",
				"floorStyle": "lab"
			}
		],
		"corridors": [
			{
				"x": 1200,
				"y": 265,
				"w": 370,
				"h": 74
			},
			{
				"x": 1495,
				"y": 265,
				"w": 75,
				"h": 215
			},
			{
				"x": 1200,
				"y": 895,
				"w": 370,
				"h": 74
			},
			{
				"x": 1495,
				"y": 800,
				"w": 75,
				"h": 169
			},
			{
				"x": 355,
				"y": 265,
				"w": 435,
				"h": 74
			},
			{
				"x": 355,
				"y": 265,
				"w": 75,
				"h": 215
			},
			{
				"x": 355,
				"y": 800,
				"w": 75,
				"h": 169
			},
			{
				"x": 355,
				"y": 895,
				"w": 435,
				"h": 74
			},
			{
				"x": 960,
				"y": 400,
				"w": 74,
				"h": 410
			}
		],
		"obstacles": [
			{
				"id": "vol_smelt_r",
				"kind": "reactor",
				"x": 1565,
				"y": 605,
				"w": 76,
				"h": 76,
				"blocksSight": true
			},
			{
				"id": "vol_cool_t",
				"kind": "tank",
				"x": 335,
				"y": 605,
				"w": 70,
				"h": 70,
				"blocksSight": true
			},
			{
				"id": "vol_drill_c",
				"kind": "table_rect",
				"x": 950,
				"y": 910,
				"w": 90,
				"h": 50,
				"blocksSight": false
			}
		],
		"decors": [
			{
				"kind": "window",
				"x": 900,
				"y": 132,
				"w": 180,
				"h": 14
			},
			{
				"kind": "caution",
				"x": 1495,
				"y": 445,
				"w": 75,
				"h": 16
			},
			{
				"kind": "caution",
				"x": 355,
				"y": 445,
				"w": 75,
				"h": 16
			}
		],
		"vents": [
			{
				"id": "v1",
				"x": 255,
				"y": 525,
				"label": "冷却タワー通気ダクト"
			},
			{
				"id": "v2",
				"x": 1720,
				"y": 530,
				"label": "精錬炉耐熱ダクト"
			},
			{
				"id": "v3",
				"x": 995,
				"y": 1020,
				"label": "ドリル室地下ダクト"
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 840,
				"y": 985
			},
			{
				"taskId": "t_freq",
				"x": 255,
				"y": 750
			},
			{
				"taskId": "t_asteroid",
				"x": 1480,
				"y": 755
			},
			{
				"taskId": "t_reactor_align",
				"x": 1715,
				"y": 755
			},
			{
				"taskId": "t_security_pass",
				"x": 1140,
				"y": 985
			},
			{
				"taskId": "t_sample_scan",
				"x": 480,
				"y": 530
			},
			{
				"taskId": "t_magma_vent",
				"x": 1485,
				"y": 530
			},
			{
				"taskId": "t_pressure_valve",
				"x": 260,
				"y": 530
			},
			{
				"taskId": "t_manifold_num",
				"x": 995,
				"y": 1020
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 896,
				"y": 1008,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 460,
				"y": 554,
				"floor": 1
			},
			{
				"taskId": "t_code",
				"x": 1695,
				"y": 568,
				"floor": 1
			},
			{
				"taskId": "t_download",
				"x": 1600,
				"y": 550,
				"floor": 1
			},
			{
				"taskId": "t_shield_prime",
				"x": 1600,
				"y": 730,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1524,
				"y": 640,
				"floor": 1
			},
			{
				"taskId": "t_airlock_flush",
				"x": 1676,
				"y": 640,
				"floor": 1
			},
			{
				"taskId": "t_bio_incubator",
				"x": 883,
				"y": 877,
				"floor": 1
			},
			{
				"taskId": "t_holo_firewall",
				"x": 1108,
				"y": 877,
				"floor": 1
			},
			{
				"taskId": "t_laser_grid",
				"x": 995,
				"y": 863,
				"floor": 1
			},
			{
				"taskId": "t_prison_cell_lock",
				"x": 905,
				"y": 935,
				"floor": 1
			},
			{
				"taskId": "t_radar_calibrate",
				"x": 1085,
				"y": 935,
				"floor": 1
			},
			{
				"taskId": "t_core_diagnostics",
				"x": 460,
				"y": 712,
				"floor": 1
			}
		],
		"emergency": {
			"x": 995,
			"y": 275
		},
		"sabotageFix": {
			"lights": {
				"x": 470,
				"y": 755,
				"label": "耐熱ケーブル配電盤修理"
			},
			"reactor": {
				"x": 1625,
				"y": 755,
				"label": "マグマ炉心冷却システム起動"
			},
			"gas": {
				"x": 370,
				"y": 719,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "🔥 熱気上昇ダクト（+25%速度・3秒/CD10秒へ調整）＋ 💨 間欠マグマ蒸気噴出口 / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "boost_vent",
				"label": "熱気ダクト",
				"x": 1380,
				"y": 302,
				"cooldownSec": 10,
				"durationSec": 3,
				"speedMult": 1.25
			},
			{
				"type": "boost_vent",
				"label": "熱気ダクト",
				"x": 580,
				"y": 932,
				"cooldownSec": 10,
				"durationSec": 3,
				"speedMult": 1.25
			},
			{
				"type": "steam_hazard",
				"label": "間欠マグマ蒸気（視界狭小）",
				"x": 920,
				"y": 520,
				"w": 155,
				"h": 170,
				"visionMult": .68
			},
			{
				"id": "volcano_auto_door_1",
				"type": "auto_door",
				"x": 1385,
				"y": 302,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 1375,
					"y": 265,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "volcano_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1533,
				"y": 373,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1495,
					"y": 363,
					"w": 75,
					"h": 20,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		]
	},
	"cyber": {
		"id": "cyber",
		"name": "🧬 サイバー電脳中枢・ネオ東京",
		"bg": "#050212",
		"accent": "#e879f9",
		"corridorFill": "#1b1036",
		"wallColor": "#581c87",
		"exteriorTheme": "cyber",
		"rooms": [
			{
				"id": "nexus",
				"name": "ホログラム広場",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#241447",
				"floorStyle": "cyber"
			},
			{
				"id": "server_e",
				"name": "量子サーバー東棟",
				"x": 1430,
				"y": 170,
				"w": 350,
				"h": 290,
				"color": "#1b1c4a",
				"floorStyle": "cyber"
			},
			{
				"id": "ai_core",
				"name": "マザーAI中枢室",
				"x": 1430,
				"y": 710,
				"w": 350,
				"h": 320,
				"color": "#331447",
				"floorStyle": "cyber"
			},
			{
				"id": "neon_alley",
				"name": "ネオンデータ回廊",
				"x": 770,
				"y": 790,
				"w": 450,
				"h": 290,
				"color": "#211542",
				"floorStyle": "cyber"
			},
			{
				"id": "firewall",
				"name": "ファイアウォール制御室",
				"x": 200,
				"y": 450,
				"w": 340,
				"h": 360,
				"color": "#162447",
				"floorStyle": "cyber"
			}
		],
		"corridors": [
			{
				"x": 1200,
				"y": 260,
				"w": 250,
				"h": 74
			},
			{
				"x": 1565,
				"y": 440,
				"w": 76,
				"h": 290
			},
			{
				"x": 1200,
				"y": 890,
				"w": 250,
				"h": 74
			},
			{
				"x": 960,
				"y": 400,
				"w": 74,
				"h": 410
			},
			{
				"x": 520,
				"y": 590,
				"w": 460,
				"h": 74
			}
		],
		"obstacles": [
			{
				"id": "cyb_srv1",
				"kind": "server",
				"x": 1530,
				"y": 245,
				"w": 50,
				"h": 110,
				"blocksSight": true
			},
			{
				"id": "cyb_srv2",
				"kind": "server",
				"x": 1650,
				"y": 245,
				"w": 50,
				"h": 110,
				"blocksSight": true
			},
			{
				"id": "cyb_ai",
				"kind": "reactor",
				"x": 1570,
				"y": 835,
				"w": 72,
				"h": 72,
				"blocksSight": true
			},
			{
				"id": "cyb_fw",
				"kind": "server",
				"x": 340,
				"y": 575,
				"w": 60,
				"h": 100,
				"blocksSight": true
			}
		],
		"decors": [{
			"kind": "server_wall",
			"x": 1450,
			"y": 185,
			"w": 310,
			"h": 16
		}, {
			"kind": "caution",
			"x": 960,
			"y": 420,
			"w": 74,
			"h": 16
		}],
		"vents": [
			{
				"id": "v1",
				"x": 265,
				"y": 515,
				"label": "FW光ファイバー管"
			},
			{
				"id": "v2",
				"x": 1720,
				"y": 220,
				"label": "東サーバー冷却管"
			},
			{
				"id": "v3",
				"x": 1500,
				"y": 960,
				"label": "AI中枢データ管"
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 1480,
				"y": 390
			},
			{
				"taskId": "t_code",
				"x": 265,
				"y": 745
			},
			{
				"taskId": "t_freq",
				"x": 1715,
				"y": 785
			},
			{
				"taskId": "t_asteroid",
				"x": 855,
				"y": 985
			},
			{
				"taskId": "t_reactor_align",
				"x": 1710,
				"y": 970
			},
			{
				"taskId": "t_security_pass",
				"x": 475,
				"y": 520
			},
			{
				"taskId": "t_sample_scan",
				"x": 1140,
				"y": 985
			},
			{
				"taskId": "t_cyber_decrypt",
				"x": 1480,
				"y": 230
			},
			{
				"taskId": "t_shield_prime",
				"x": 480,
				"y": 745
			},
			{
				"taskId": "t_calibrate_dist",
				"x": 1500,
				"y": 775
			},
			{
				"taskId": "t_manifold_num",
				"x": 995,
				"y": 855
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1528,
				"y": 950,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1108,
				"y": 865,
				"floor": 1
			},
			{
				"taskId": "t_download",
				"x": 1693,
				"y": 373,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1605,
				"y": 243,
				"floor": 1
			},
			{
				"taskId": "t_bio_incubator",
				"x": 1605,
				"y": 388,
				"floor": 1
			},
			{
				"taskId": "t_holo_firewall",
				"x": 1605,
				"y": 315,
				"floor": 1
			},
			{
				"taskId": "t_laser_grid",
				"x": 1507,
				"y": 315,
				"floor": 1
			},
			{
				"taskId": "t_cryo_pipe",
				"x": 1605,
				"y": 790,
				"floor": 1
			},
			{
				"taskId": "t_radar_calibrate",
				"x": 1605,
				"y": 950,
				"floor": 1
			},
			{
				"taskId": "t_core_diagnostics",
				"x": 1535,
				"y": 870,
				"floor": 1
			}
		],
		"emergency": {
			"x": 995,
			"y": 275
		},
		"sabotageFix": {
			"lights": {
				"x": 1715,
				"y": 405,
				"label": "グリッド電力ノード復旧"
			},
			"reactor": {
				"x": 445,
				"y": 745,
				"label": "ファイアウォール暴走停止"
			},
			"gas": {
				"x": 1605,
				"y": 379,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "⚡ 量子テレポーター（12秒CD・転送残滓発生へ調整）＋ 📜 トラフィックログ / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "teleport",
				"id": "cyber_tp_e",
				"targetId": "cyber_tp_w",
				"label": "量子転送（FW室へ・CD12秒）",
				"icon": "⚡",
				"x": 1605,
				"y": 400,
				"cooldownSec": 12
			},
			{
				"type": "teleport",
				"id": "cyber_tp_w",
				"targetId": "cyber_tp_e",
				"label": "量子転送（東サーバーへ・CD12秒）",
				"icon": "⚡",
				"x": 465,
				"y": 630,
				"cooldownSec": 12
			},
			{
				"type": "doorlog",
				"label": "量子ゲート通過ログ（5秒）",
				"icon": "📜",
				"x": 1120,
				"y": 345,
				"cooldownSec": 10,
				"durationSec": 5
			},
			{
				"id": "cyber_auto_door_1",
				"type": "auto_door",
				"x": 1325,
				"y": 297,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 1315,
					"y": 260,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "cyber_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1603,
				"y": 585,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1565,
					"y": 575,
					"w": 76,
					"h": 20,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		]
	},
	"crystal": {
		"id": "crystal",
		"name": "💎 水晶洞窟コロニー・ルミナ",
		"bg": "#030d0b",
		"accent": "#34d399",
		"corridorFill": "#0f2e28",
		"wallColor": "#115e59",
		"exteriorTheme": "crystal",
		"rooms": [
			{
				"id": "central_cavern",
				"name": "結晶中央広場",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#133b33",
				"floorStyle": "stone"
			},
			{
				"id": "prism_mine",
				"name": "プリズム採掘場",
				"x": 1410,
				"y": 170,
				"w": 360,
				"h": 290,
				"color": "#16423a",
				"floorStyle": "stone"
			},
			{
				"id": "crystal_spire",
				"name": "観測クリスタル塔",
				"x": 1410,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#123638",
				"floorStyle": "lab"
			},
			{
				"id": "underground_lake",
				"name": "地底湖ドック",
				"x": 770,
				"y": 790,
				"w": 450,
				"h": 290,
				"color": "#10323b",
				"floorStyle": "stone"
			},
			{
				"id": "emerald_refinery",
				"name": "エメラルド精製所",
				"x": 210,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#183d32",
				"floorStyle": "cargo"
			},
			{
				"id": "glow_garden",
				"name": "光合成温室",
				"x": 210,
				"y": 170,
				"w": 360,
				"h": 290,
				"color": "#143b2e",
				"floorStyle": "garden"
			}
		],
		"corridors": [
			{
				"x": 550,
				"y": 265,
				"w": 240,
				"h": 74
			},
			{
				"x": 1200,
				"y": 265,
				"w": 230,
				"h": 74
			},
			{
				"x": 1555,
				"y": 440,
				"w": 76,
				"h": 280
			},
			{
				"x": 1200,
				"y": 890,
				"w": 230,
				"h": 74
			},
			{
				"x": 550,
				"y": 890,
				"w": 240,
				"h": 74
			},
			{
				"x": 355,
				"y": 440,
				"w": 76,
				"h": 280
			},
			{
				"x": 960,
				"y": 400,
				"w": 74,
				"h": 410
			}
		],
		"obstacles": [
			{
				"id": "cry_p1",
				"kind": "rock",
				"x": 1560,
				"y": 280,
				"w": 66,
				"h": 66,
				"blocksSight": true
			},
			{
				"id": "cry_p2",
				"kind": "rock",
				"x": 355,
				"y": 825,
				"w": 66,
				"h": 66,
				"blocksSight": true
			},
			{
				"id": "cry_lake",
				"kind": "table_round",
				"x": 965,
				"y": 905,
				"w": 60,
				"h": 60,
				"blocksSight": false
			}
		],
		"decors": [{
			"kind": "window",
			"x": 890,
			"y": 132,
			"w": 200,
			"h": 14
		}, {
			"kind": "caution",
			"x": 960,
			"y": 420,
			"w": 74,
			"h": 16
		}],
		"vents": [
			{
				"id": "v1",
				"x": 280,
				"y": 240,
				"label": "温室結晶ダクト"
			},
			{
				"id": "v2",
				"x": 1705,
				"y": 235,
				"label": "採掘場結晶ダクト"
			},
			{
				"id": "v3",
				"x": 1485,
				"y": 950,
				"label": "クリスタル塔ダクト"
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 275,
				"y": 955
			},
			{
				"taskId": "t_code",
				"x": 1705,
				"y": 775
			},
			{
				"taskId": "t_freq",
				"x": 1485,
				"y": 400
			},
			{
				"taskId": "t_asteroid",
				"x": 845,
				"y": 1015
			},
			{
				"taskId": "t_reactor_align",
				"x": 505,
				"y": 770
			},
			{
				"taskId": "t_security_pass",
				"x": 1140,
				"y": 1015
			},
			{
				"taskId": "t_sample_scan",
				"x": 495,
				"y": 245
			},
			{
				"taskId": "t_botany_water",
				"x": 1480,
				"y": 235
			},
			{
				"taskId": "t_o2_filter",
				"x": 275,
				"y": 395
			},
			{
				"taskId": "t_calibrate_dist",
				"x": 1705,
				"y": 955
			},
			{
				"taskId": "t_pressure_valve",
				"x": 995,
				"y": 845
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1511,
				"y": 940,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1108,
				"y": 865,
				"floor": 1
			},
			{
				"taskId": "t_download",
				"x": 1680,
				"y": 257,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1680,
				"y": 373,
				"floor": 1
			},
			{
				"taskId": "t_holo_firewall",
				"x": 1590,
				"y": 243,
				"floor": 1
			},
			{
				"taskId": "t_laser_grid",
				"x": 1590,
				"y": 388,
				"floor": 1
			},
			{
				"taskId": "t_cryo_pipe",
				"x": 1518,
				"y": 315,
				"floor": 1
			},
			{
				"taskId": "t_lava_damper",
				"x": 1662,
				"y": 315,
				"floor": 1
			},
			{
				"taskId": "t_core_diagnostics",
				"x": 1500,
				"y": 796,
				"floor": 1
			},
			{
				"taskId": "t_fuel_engine",
				"x": 1590,
				"y": 780,
				"floor": 1
			}
		],
		"emergency": {
			"x": 995,
			"y": 275
		},
		"sabotageFix": {
			"lights": {
				"x": 445,
				"y": 960,
				"label": "水晶発電ノード復旧"
			},
			"reactor": {
				"x": 1625,
				"y": 890,
				"label": "結晶共鳴コア安定化"
			},
			"gas": {
				"x": 390,
				"y": 379,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "💎 共鳴クリスタル灯台（6秒間視界拡張＆周囲暗闇探知・CD18秒） / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "crystal_beacon",
				"label": "共鳴クリスタル灯台を起動（CD18秒）",
				"icon": "💎",
				"x": 1120,
				"y": 345,
				"cooldownSec": 18,
				"durationSec": 6
			},
			{
				"id": "crystal_auto_door_1",
				"type": "auto_door",
				"x": 670,
				"y": 302,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 660,
					"y": 265,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "crystal_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1315,
				"y": 302,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1305,
					"y": 265,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		]
	},
	"jungle": {
		"id": "jungle",
		"name": "🌿 密林生態バイオスフィア・エデン",
		"bg": "#050d04",
		"accent": "#a3e635",
		"corridorFill": "#162b12",
		"wallColor": "#365314",
		"exteriorTheme": "jungle",
		"rooms": [
			{
				"id": "world_tree",
				"name": "世界樹アトリウム",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#1b3616",
				"floorStyle": "garden"
			},
			{
				"id": "canopy_deck",
				"name": "樹冠スカイデッキ",
				"x": 1410,
				"y": 180,
				"w": 360,
				"h": 280,
				"color": "#1f3b19",
				"floorStyle": "garden"
			},
			{
				"id": "wildlife_dome",
				"name": "生態観察ドーム",
				"x": 1410,
				"y": 710,
				"w": 360,
				"h": 300,
				"color": "#18381d",
				"floorStyle": "garden"
			},
			{
				"id": "river_hydro",
				"name": "渓流発電所",
				"x": 770,
				"y": 790,
				"w": 450,
				"h": 290,
				"color": "#153326",
				"floorStyle": "stone"
			},
			{
				"id": "botanical_lab",
				"name": "古代植物園",
				"x": 210,
				"y": 700,
				"w": 360,
				"h": 310,
				"color": "#1d3816",
				"floorStyle": "garden"
			},
			{
				"id": "eden_control",
				"name": "温室コントロール室",
				"x": 210,
				"y": 180,
				"w": 360,
				"h": 280,
				"color": "#223b18",
				"floorStyle": "lab"
			}
		],
		"corridors": [
			{
				"x": 550,
				"y": 270,
				"w": 240,
				"h": 74
			},
			{
				"x": 1200,
				"y": 270,
				"w": 230,
				"h": 74
			},
			{
				"x": 1555,
				"y": 440,
				"w": 76,
				"h": 290
			},
			{
				"x": 1200,
				"y": 890,
				"w": 230,
				"h": 74
			},
			{
				"x": 550,
				"y": 890,
				"w": 240,
				"h": 74
			},
			{
				"x": 355,
				"y": 440,
				"w": 76,
				"h": 280
			},
			{
				"x": 960,
				"y": 400,
				"w": 74,
				"h": 410
			}
		],
		"obstacles": [
			{
				"id": "jun_tree1",
				"kind": "rock",
				"x": 1555,
				"y": 830,
				"w": 68,
				"h": 68,
				"blocksSight": true
			},
			{
				"id": "jun_tree2",
				"kind": "rock",
				"x": 355,
				"y": 820,
				"w": 68,
				"h": 68,
				"blocksSight": true
			},
			{
				"id": "jun_pond",
				"kind": "table_round",
				"x": 965,
				"y": 905,
				"w": 60,
				"h": 60,
				"blocksSight": false
			}
		],
		"decors": [{
			"kind": "med_scanner",
			"x": 450,
			"y": 240,
			"w": 60,
			"h": 60,
			"label": "BIO"
		}],
		"vents": [
			{
				"id": "v1",
				"x": 280,
				"y": 255,
				"label": "コントロール室樹洞"
			},
			{
				"id": "v2",
				"x": 1705,
				"y": 255,
				"label": "樹冠デッキ樹洞"
			},
			{
				"id": "v3",
				"x": 280,
				"y": 945,
				"label": "古代植物園樹洞"
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 845,
				"y": 1015
			},
			{
				"taskId": "t_code",
				"x": 500,
				"y": 255
			},
			{
				"taskId": "t_freq",
				"x": 1485,
				"y": 395
			},
			{
				"taskId": "t_asteroid",
				"x": 1705,
				"y": 945
			},
			{
				"taskId": "t_reactor_align",
				"x": 1140,
				"y": 1015
			},
			{
				"taskId": "t_security_pass",
				"x": 505,
				"y": 775
			},
			{
				"taskId": "t_sample_scan",
				"x": 1480,
				"y": 775
			},
			{
				"taskId": "t_botany_water",
				"x": 505,
				"y": 950
			},
			{
				"taskId": "t_o2_filter",
				"x": 1485,
				"y": 245
			},
			{
				"taskId": "t_trash_chute",
				"x": 1705,
				"y": 775
			},
			{
				"taskId": "t_manifold_num",
				"x": 505,
				"y": 400
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1511,
				"y": 935,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1108,
				"y": 865,
				"floor": 1
			},
			{
				"taskId": "t_download",
				"x": 1680,
				"y": 264,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1680,
				"y": 376,
				"floor": 1
			},
			{
				"taskId": "t_med_body_scan",
				"x": 300,
				"y": 793,
				"floor": 1
			},
			{
				"taskId": "t_laser_grid",
				"x": 1590,
				"y": 250,
				"floor": 1
			},
			{
				"taskId": "t_cryo_pipe",
				"x": 1590,
				"y": 390,
				"floor": 1
			},
			{
				"taskId": "t_lava_damper",
				"x": 1518,
				"y": 320,
				"floor": 1
			},
			{
				"taskId": "t_crystal_matrix",
				"x": 1662,
				"y": 320,
				"floor": 1
			},
			{
				"taskId": "t_fuel_engine",
				"x": 1590,
				"y": 320,
				"floor": 1
			}
		],
		"emergency": {
			"x": 995,
			"y": 275
		},
		"sabotageFix": {
			"lights": {
				"x": 995,
				"y": 1015,
				"label": "水力タービン配電修理"
			},
			"reactor": {
				"x": 380,
				"y": 385,
				"label": "酸素循環ドーム調整"
			},
			"gas": {
				"x": 1590,
				"y": 926,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "🌿 胞子ミスト（中央回廊の視界0.72xステルス帯）＋ 💓 生態バイタル端末 / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "spore_mist",
				"label": "胞子ミスト群生帯",
				"x": 910,
				"y": 500,
				"w": 175,
				"h": 210,
				"visionMult": .72
			},
			{
				"type": "vitals",
				"label": "生態バイタルモニター（5秒）",
				"icon": "💓",
				"x": 295,
				"y": 390,
				"cooldownSec": 14,
				"durationSec": 5
			},
			{
				"id": "jungle_auto_door_1",
				"type": "auto_door",
				"x": 670,
				"y": 307,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 660,
					"y": 270,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "jungle_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1315,
				"y": 307,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1305,
					"y": 270,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		]
	},
	"desert": {
		"id": "desert",
		"name": "🏜️ 砂漠遺跡発掘基地・アヌビス",
		"bg": "#120c04",
		"accent": "#fbbf24",
		"corridorFill": "#2e210e",
		"wallColor": "#78551f",
		"exteriorTheme": "desert",
		"hasPeriodicSandstorm": true,
		"rooms": [
			{
				"id": "base_camp",
				"name": "発掘ベースキャンプ",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#3b2a12",
				"floorStyle": "stone"
			},
			{
				"id": "dune_radar",
				"name": "砂嵐観測ステーション",
				"x": 1410,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#402e14",
				"floorStyle": "metal"
			},
			{
				"id": "sun_altar",
				"name": "太陽神の祭壇",
				"x": 1410,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#472c12",
				"floorStyle": "stone"
			},
			{
				"id": "pyramid_hall",
				"name": "ピラミッド大回廊",
				"x": 770,
				"y": 780,
				"w": 450,
				"h": 310,
				"color": "#382711",
				"floorStyle": "stone"
			},
			{
				"id": "relic_lab",
				"name": "遺物解析ラボ",
				"x": 210,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#362916",
				"floorStyle": "lab"
			},
			{
				"id": "oasis_vault",
				"name": "地下貯水オアシス",
				"x": 210,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#1e3336",
				"floorStyle": "stone"
			}
		],
		"corridors": [
			{
				"x": 550,
				"y": 260,
				"w": 240,
				"h": 74
			},
			{
				"x": 1200,
				"y": 260,
				"w": 230,
				"h": 74
			},
			{
				"x": 1555,
				"y": 430,
				"w": 76,
				"h": 290
			},
			{
				"x": 1200,
				"y": 890,
				"w": 230,
				"h": 74
			},
			{
				"x": 550,
				"y": 890,
				"w": 240,
				"h": 74
			},
			{
				"x": 355,
				"y": 430,
				"w": 76,
				"h": 290
			},
			{
				"x": 960,
				"y": 400,
				"w": 74,
				"h": 400
			}
		],
		"obstacles": [{
			"id": "des_altar",
			"kind": "rock",
			"x": 1560,
			"y": 830,
			"w": 66,
			"h": 66,
			"blocksSight": true
		}, {
			"id": "des_pyr",
			"kind": "rock",
			"x": 960,
			"y": 905,
			"w": 70,
			"h": 70,
			"blocksSight": true
		}],
		"decors": [{
			"kind": "altar",
			"x": 1550,
			"y": 740,
			"w": 86,
			"h": 40
		}],
		"vents": [
			{
				"id": "v1",
				"x": 280,
				"y": 240,
				"label": "オアシス地下通路"
			},
			{
				"id": "v2",
				"x": 1705,
				"y": 240,
				"label": "観測基地砂穴"
			},
			{
				"id": "v3",
				"x": 1705,
				"y": 950,
				"label": "祭壇隠し通路"
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 280,
				"y": 950
			},
			{
				"taskId": "t_code",
				"x": 1485,
				"y": 380
			},
			{
				"taskId": "t_freq",
				"x": 1705,
				"y": 380
			},
			{
				"taskId": "t_asteroid",
				"x": 1485,
				"y": 955
			},
			{
				"taskId": "t_reactor_align",
				"x": 845,
				"y": 1020
			},
			{
				"taskId": "t_security_pass",
				"x": 1140,
				"y": 1020
			},
			{
				"taskId": "t_sample_scan",
				"x": 505,
				"y": 775
			},
			{
				"taskId": "t_pressure_valve",
				"x": 505,
				"y": 240
			},
			{
				"taskId": "t_botany_water",
				"x": 1140,
				"y": 845
			},
			{
				"taskId": "t_nav_chart",
				"x": 1705,
				"y": 235
			},
			{
				"taskId": "t_cyber_decrypt",
				"x": 280,
				"y": 770
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1511,
				"y": 940,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1108,
				"y": 861,
				"floor": 1
			},
			{
				"taskId": "t_download",
				"x": 1500,
				"y": 254,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1590,
				"y": 240,
				"floor": 1
			},
			{
				"taskId": "t_med_body_scan",
				"x": 480,
				"y": 924,
				"floor": 1
			},
			{
				"taskId": "t_telemetry_align",
				"x": 1590,
				"y": 380,
				"floor": 1
			},
			{
				"taskId": "t_cryo_pipe",
				"x": 1518,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_lava_damper",
				"x": 1662,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_crystal_matrix",
				"x": 1590,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_sonar_ping",
				"x": 1500,
				"y": 796,
				"floor": 1
			}
		],
		"emergency": {
			"x": 995,
			"y": 275
		},
		"sabotageFix": {
			"lights": {
				"x": 430,
				"y": 955,
				"label": "ソーラー蓄電盤修理"
			},
			"reactor": {
				"x": 1625,
				"y": 760,
				"label": "古代動力炉封印処理"
			},
			"gas": {
				"x": 1590,
				"y": 372,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "🏜️ 周期的砂嵐フロント（屋外通路の視界0.78x）＋ 🗺️ 日時計アドミン盤 / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "admin",
				"label": "遺跡アドミン観測盤（5秒表示）",
				"icon": "🗺️",
				"x": 1595,
				"y": 310,
				"cooldownSec": 12,
				"durationSec": 5
			},
			{
				"id": "desert_auto_door_1",
				"type": "auto_door",
				"x": 670,
				"y": 297,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 660,
					"y": 260,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "desert_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1315,
				"y": 297,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1305,
					"y": 260,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		]
	},
	"prison": {
		"id": "prison",
		"name": "🔒 軌道監獄コロニー・タルタロス",
		"bg": "#060712",
		"accent": "#818cf8",
		"corridorFill": "#181b36",
		"wallColor": "#3730a3",
		"exteriorTheme": "space",
		"rooms": [
			{
				"id": "warden_tower",
				"name": "中央看守タワー",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#1f2347",
				"floorStyle": "metal"
			},
			{
				"id": "armory_sec",
				"name": "武装セキュリティ庫",
				"x": 1410,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#27224a",
				"floorStyle": "metal"
			},
			{
				"id": "shuttle_bay",
				"name": "軌道シャトル発着場",
				"x": 1410,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#1c2545",
				"floorStyle": "cargo"
			},
			{
				"id": "cell_block_b",
				"name": "第二拘留ブロック",
				"x": 770,
				"y": 790,
				"w": 450,
				"h": 290,
				"color": "#1c1f3d",
				"floorStyle": "tile"
			},
			{
				"id": "solitary_wing",
				"name": "懲罰独房エリア",
				"x": 210,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#281d3d",
				"floorStyle": "stone"
			},
			{
				"id": "cell_block_a",
				"name": "第一拘留ブロック",
				"x": 210,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#1c1f3d",
				"floorStyle": "tile"
			}
		],
		"corridors": [
			{
				"x": 550,
				"y": 260,
				"w": 240,
				"h": 74
			},
			{
				"x": 1200,
				"y": 260,
				"w": 230,
				"h": 74
			},
			{
				"x": 1555,
				"y": 430,
				"w": 76,
				"h": 290
			},
			{
				"x": 1200,
				"y": 890,
				"w": 230,
				"h": 74
			},
			{
				"x": 550,
				"y": 890,
				"w": 240,
				"h": 74
			},
			{
				"x": 355,
				"y": 430,
				"w": 76,
				"h": 290
			},
			{
				"x": 960,
				"y": 400,
				"w": 74,
				"h": 410
			}
		],
		"obstacles": [
			{
				"id": "pri_cell_a",
				"kind": "crate",
				"x": 360,
				"y": 285,
				"w": 64,
				"h": 64,
				"blocksSight": true
			},
			{
				"id": "pri_cell_b",
				"kind": "crate",
				"x": 960,
				"y": 905,
				"w": 68,
				"h": 56,
				"blocksSight": true
			},
			{
				"id": "pri_shuttle",
				"kind": "reactor",
				"x": 1565,
				"y": 830,
				"w": 66,
				"h": 66,
				"blocksSight": true
			}
		],
		"decors": [
			{
				"kind": "camera_prop",
				"x": 990,
				"y": 310,
				"w": 20,
				"h": 20
			},
			{
				"kind": "camera_prop",
				"x": 990,
				"y": 860,
				"w": 20,
				"h": 20
			},
			{
				"kind": "camera_prop",
				"x": 1580,
				"y": 760,
				"w": 20,
				"h": 20
			},
			{
				"kind": "caution",
				"x": 960,
				"y": 580,
				"w": 74,
				"h": 16
			}
		],
		"vents": [
			{
				"id": "v1",
				"x": 280,
				"y": 235,
				"label": "第一ブロック排気口"
			},
			{
				"id": "v2",
				"x": 1705,
				"y": 235,
				"label": "セキュリティ庫排気口"
			},
			{
				"id": "v3",
				"x": 280,
				"y": 950,
				"label": "懲罰房地下ダクト"
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 845,
				"y": 1015
			},
			{
				"taskId": "t_code",
				"x": 1485,
				"y": 380
			},
			{
				"taskId": "t_freq",
				"x": 1705,
				"y": 770
			},
			{
				"taskId": "t_asteroid",
				"x": 1485,
				"y": 950
			},
			{
				"taskId": "t_reactor_align",
				"x": 1140,
				"y": 1015
			},
			{
				"taskId": "t_security_pass",
				"x": 1705,
				"y": 380
			},
			{
				"taskId": "t_sample_scan",
				"x": 505,
				"y": 775
			},
			{
				"taskId": "t_trash_chute",
				"x": 505,
				"y": 390
			},
			{
				"taskId": "t_manifold_num",
				"x": 280,
				"y": 770
			},
			{
				"taskId": "t_shield_prime",
				"x": 1485,
				"y": 235
			},
			{
				"taskId": "t_fuel_engine",
				"x": 1705,
				"y": 955
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1511,
				"y": 940,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1108,
				"y": 865,
				"floor": 1
			},
			{
				"taskId": "t_download",
				"x": 1680,
				"y": 254,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1590,
				"y": 240,
				"floor": 1
			},
			{
				"taskId": "t_med_body_scan",
				"x": 1590,
				"y": 380,
				"floor": 1
			},
			{
				"taskId": "t_telemetry_align",
				"x": 1518,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_beacon_simon",
				"x": 1662,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_lava_damper",
				"x": 1590,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_crystal_matrix",
				"x": 1500,
				"y": 796,
				"floor": 1
			},
			{
				"taskId": "t_sonar_ping",
				"x": 1590,
				"y": 780,
				"floor": 1
			},
			{
				"taskId": "t_rail_brake",
				"x": 1590,
				"y": 940,
				"floor": 1
			}
		],
		"emergency": {
			"x": 995,
			"y": 275
		},
		"sabotageFix": {
			"lights": {
				"x": 465,
				"y": 955,
				"label": "監獄主電源ブレーカー復旧"
			},
			"reactor": {
				"x": 1625,
				"y": 920,
				"label": "軌道推進エンジン安定化"
			},
			"gas": {
				"x": 1590,
				"y": 372,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "📹 監獄マルチカメラ（3視点切替・稼働赤ランプ）＋ 🔒 独房隔離シャッター（5秒封鎖） / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "camera",
				"label": "監視カメラ端末（3視点切替）",
				"icon": "📹",
				"x": 1600,
				"y": 310,
				"cooldownSec": 8,
				"durationSec": 10,
				"feeds": [
					{
						"label": "中央看守タワー",
						"x": 995,
						"y": 275
					},
					{
						"label": "第二拘留ブロック",
						"x": 995,
						"y": 900
					},
					{
						"label": "軌道シャトル発着場",
						"x": 1590,
						"y": 840
					}
				]
			},
			{
				"type": "lockdown_door",
				"id": "prison_shutter",
				"label": "中央連絡ゲート封鎖（5秒・CD22秒）",
				"icon": "🔒",
				"x": 845,
				"y": 365,
				"cooldownSec": 22,
				"durationSec": 5,
				"doorRect": {
					"x": 960,
					"y": 560,
					"w": 74,
					"h": 42
				}
			},
			{
				"id": "prison_auto_door_1",
				"type": "auto_door",
				"x": 670,
				"y": 297,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 660,
					"y": 260,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "prison_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1315,
				"y": 297,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1305,
					"y": 260,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		]
	},
	"temple": {
		"id": "temple",
		"name": "⛩️ 古代星霊神殿・アマテラス",
		"bg": "#120509",
		"accent": "#fb7185",
		"corridorFill": "#2e111b",
		"wallColor": "#881337",
		"exteriorTheme": "space",
		"rooms": [
			{
				"id": "main_shrine",
				"name": "本殿・星霊の間",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#3b1522",
				"floorStyle": "carpet"
			},
			{
				"id": "astro_pavilion",
				"name": "占星術天文台",
				"x": 1410,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#331736",
				"floorStyle": "stone"
			},
			{
				"id": "treasure_vault",
				"name": "宝物奉納殿",
				"x": 1410,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#3d2216",
				"floorStyle": "carpet"
			},
			{
				"id": "vermilion_hall",
				"name": "朱塗りの回廊殿",
				"x": 770,
				"y": 790,
				"w": 450,
				"h": 290,
				"color": "#38141f",
				"floorStyle": "carpet"
			},
			{
				"id": "barrier_room",
				"name": "結界制御の間",
				"x": 210,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#2b1638",
				"floorStyle": "stone"
			},
			{
				"id": "sacred_spring",
				"name": "禊の霊泉庭園",
				"x": 210,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#162c38",
				"floorStyle": "garden"
			}
		],
		"corridors": [
			{
				"x": 550,
				"y": 260,
				"w": 240,
				"h": 74
			},
			{
				"x": 1200,
				"y": 260,
				"w": 230,
				"h": 74
			},
			{
				"x": 1555,
				"y": 430,
				"w": 76,
				"h": 290
			},
			{
				"x": 1200,
				"y": 890,
				"w": 230,
				"h": 74
			},
			{
				"x": 550,
				"y": 890,
				"w": 240,
				"h": 74
			},
			{
				"x": 355,
				"y": 430,
				"w": 76,
				"h": 290
			},
			{
				"x": 960,
				"y": 400,
				"w": 74,
				"h": 410
			}
		],
		"obstacles": [
			{
				"id": "tem_pond",
				"kind": "table_round",
				"x": 365,
				"y": 280,
				"w": 60,
				"h": 60,
				"blocksSight": false
			},
			{
				"id": "tem_pillar1",
				"kind": "rock",
				"x": 1560,
				"y": 830,
				"w": 64,
				"h": 64,
				"blocksSight": true
			},
			{
				"id": "tem_pillar2",
				"kind": "rock",
				"x": 965,
				"y": 905,
				"w": 64,
				"h": 64,
				"blocksSight": true
			}
		],
		"decors": [{
			"kind": "carpet",
			"x": 950,
			"y": 160,
			"w": 90,
			"h": 240
		}, {
			"kind": "altar",
			"x": 950,
			"y": 145,
			"w": 90,
			"h": 32
		}],
		"vents": [
			{
				"id": "v1",
				"x": 280,
				"y": 235,
				"label": "霊泉床下抜け道"
			},
			{
				"id": "v2",
				"x": 1705,
				"y": 235,
				"label": "天文台床下抜け道"
			},
			{
				"id": "v3",
				"x": 1705,
				"y": 950,
				"label": "宝物殿床下抜け道"
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 280,
				"y": 950
			},
			{
				"taskId": "t_code",
				"x": 1485,
				"y": 950
			},
			{
				"taskId": "t_freq",
				"x": 1485,
				"y": 380
			},
			{
				"taskId": "t_asteroid",
				"x": 1705,
				"y": 380
			},
			{
				"taskId": "t_reactor_align",
				"x": 505,
				"y": 775
			},
			{
				"taskId": "t_security_pass",
				"x": 1140,
				"y": 1015
			},
			{
				"taskId": "t_sample_scan",
				"x": 505,
				"y": 240
			},
			{
				"taskId": "t_botany_water",
				"x": 280,
				"y": 390
			},
			{
				"taskId": "t_shield_prime",
				"x": 505,
				"y": 950
			},
			{
				"taskId": "t_nav_chart",
				"x": 1705,
				"y": 235
			},
			{
				"taskId": "t_calibrate_dist",
				"x": 845,
				"y": 855
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1511,
				"y": 940,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1108,
				"y": 865,
				"floor": 1
			},
			{
				"taskId": "t_download",
				"x": 1500,
				"y": 254,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1590,
				"y": 240,
				"floor": 1
			},
			{
				"taskId": "t_med_body_scan",
				"x": 1590,
				"y": 380,
				"floor": 1
			},
			{
				"taskId": "t_telemetry_align",
				"x": 1518,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_beacon_simon",
				"x": 1662,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_coolant_pipe",
				"x": 1590,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_crystal_matrix",
				"x": 1500,
				"y": 796,
				"floor": 1
			},
			{
				"taskId": "t_sonar_ping",
				"x": 1680,
				"y": 796,
				"floor": 1
			},
			{
				"taskId": "t_rail_brake",
				"x": 1680,
				"y": 924,
				"floor": 1
			},
			{
				"taskId": "t_solar_panel",
				"x": 1590,
				"y": 780,
				"floor": 1
			}
		],
		"emergency": {
			"x": 995,
			"y": 275
		},
		"sabotageFix": {
			"lights": {
				"x": 870,
				"y": 1005,
				"label": "灯籠エネルギー回路復旧"
			},
			"reactor": {
				"x": 395,
				"y": 885,
				"label": "星霊結界コア鎮静化"
			},
			"gas": {
				"x": 1590,
				"y": 372,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "⛩️ 星霊ワープ鳥居（霊泉⇔宝物殿・CD12秒）＋ 🔔 神殿の警鐘（位置合図） / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "teleport",
				"id": "torii_nw",
				"targetId": "torii_se",
				"label": "星霊鳥居（宝物殿へ・CD12秒）",
				"icon": "⛩️",
				"x": 485,
				"y": 375,
				"cooldownSec": 12
			},
			{
				"type": "teleport",
				"id": "torii_se",
				"targetId": "torii_nw",
				"label": "星霊鳥居（霊泉へ・CD12秒）",
				"icon": "⛩️",
				"x": 1485,
				"y": 765,
				"cooldownSec": 12
			},
			{
				"type": "bell",
				"label": "神殿の警鐘を鳴らす（周囲へ通知・CD16秒）",
				"icon": "🔔",
				"x": 1135,
				"y": 345,
				"cooldownSec": 16,
				"durationSec": 4
			},
			{
				"id": "temple_auto_door_1",
				"type": "auto_door",
				"x": 670,
				"y": 297,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 660,
					"y": 260,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "temple_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1315,
				"y": 297,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1305,
					"y": 260,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		]
	},
	"reactor_core": {
		"id": "reactor_core",
		"name": "⚛️ 反物質研究所・オメガコア",
		"bg": "#020a12",
		"accent": "#22d3ee",
		"corridorFill": "#0d2638",
		"wallColor": "#0e7490",
		"exteriorTheme": "cyber",
		"rooms": [
			{
				"id": "omega_bridge",
				"name": "中央制御ブリッジ",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#102f45",
				"floorStyle": "metal"
			},
			{
				"id": "quantum_lab",
				"name": "量子コンピュータ室",
				"x": 1410,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#142b4d",
				"floorStyle": "cyber"
			},
			{
				"id": "escape_pods",
				"name": "緊急脱出ポッド室",
				"x": 1410,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#123342",
				"floorStyle": "metal"
			},
			{
				"id": "accelerator",
				"name": "粒子加速器トンネル",
				"x": 770,
				"y": 790,
				"w": 450,
				"h": 290,
				"color": "#152947",
				"floorStyle": "metal"
			},
			{
				"id": "antimatter_ring",
				"name": "反物質格納リング",
				"x": 210,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#241e47",
				"floorStyle": "lab"
			},
			{
				"id": "mag_shield",
				"name": "磁気シールド室",
				"x": 210,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#103447",
				"floorStyle": "metal"
			},
			{
				"id": "rc_overwatch",
				"name": "2F 炉心監視ギャラリー",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#2d1638",
				"floorStyle": "metal",
				"floor": 2
			},
			{
				"id": "rc_shield_ctrl",
				"name": "2F 磁場制御室",
				"x": 210,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#21153b",
				"floorStyle": "lab",
				"floor": 2
			}
		],
		"corridors": [
			{
				"x": 550,
				"y": 260,
				"w": 240,
				"h": 74
			},
			{
				"x": 1200,
				"y": 260,
				"w": 230,
				"h": 74
			},
			{
				"x": 1555,
				"y": 430,
				"w": 76,
				"h": 290
			},
			{
				"x": 1200,
				"y": 890,
				"w": 230,
				"h": 74
			},
			{
				"x": 550,
				"y": 890,
				"w": 240,
				"h": 74
			},
			{
				"x": 355,
				"y": 430,
				"w": 76,
				"h": 290
			},
			{
				"x": 960,
				"y": 400,
				"w": 74,
				"h": 410
			},
			{
				"x": 550,
				"y": 250,
				"w": 240,
				"h": 76,
				"floor": 2
			}
		],
		"obstacles": [
			{
				"id": "omg_ring",
				"kind": "reactor",
				"x": 355,
				"y": 825,
				"w": 70,
				"h": 70,
				"blocksSight": true
			},
			{
				"id": "omg_q1",
				"kind": "server",
				"x": 1560,
				"y": 260,
				"w": 54,
				"h": 96,
				"blocksSight": true
			},
			{
				"id": "rc2_console",
				"kind": "console",
				"x": 955,
				"y": 250,
				"w": 80,
				"h": 45,
				"blocksSight": false,
				"floor": 2
			}
		],
		"decors": [
			{
				"kind": "window",
				"x": 890,
				"y": 132,
				"w": 200,
				"h": 14
			},
			{
				"kind": "caution",
				"x": 960,
				"y": 420,
				"w": 74,
				"h": 16
			},
			{
				"kind": "caution",
				"x": 790,
				"y": 145,
				"w": 410,
				"h": 16,
				"floor": 2
			}
		],
		"vents": [
			{
				"id": "v1",
				"x": 280,
				"y": 235,
				"label": "シールド室冷却管"
			},
			{
				"id": "v2",
				"x": 1705,
				"y": 235,
				"label": "量子室冷却管"
			},
			{
				"id": "v3",
				"x": 280,
				"y": 950,
				"label": "反物質リング点検口"
			},
			{
				"id": "v2f_rc1",
				"x": 270,
				"y": 230,
				"label": "2F 磁場ダクト",
				"floor": 2
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 505,
				"y": 240
			},
			{
				"taskId": "t_code",
				"x": 1485,
				"y": 380
			},
			{
				"taskId": "t_freq",
				"x": 845,
				"y": 1015
			},
			{
				"taskId": "t_asteroid",
				"x": 1140,
				"y": 1015
			},
			{
				"taskId": "t_reactor_align",
				"x": 505,
				"y": 775
			},
			{
				"taskId": "t_security_pass",
				"x": 1705,
				"y": 775
			},
			{
				"taskId": "t_sample_scan",
				"x": 1705,
				"y": 380
			},
			{
				"taskId": "t_cyber_decrypt",
				"x": 1485,
				"y": 235
			},
			{
				"taskId": "t_magma_vent",
				"x": 280,
				"y": 770
			},
			{
				"taskId": "t_shield_prime",
				"x": 505,
				"y": 390
			},
			{
				"taskId": "t_fuel_engine",
				"x": 1485,
				"y": 950
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1511,
				"y": 940,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1108,
				"y": 865,
				"floor": 1
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 480,
				"y": 380,
				"floor": 2
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1140,
				"y": 360,
				"floor": 2
			},
			{
				"taskId": "t_download",
				"x": 1680,
				"y": 254,
				"floor": 1
			},
			{
				"taskId": "t_telemetry_align",
				"x": 1590,
				"y": 240,
				"floor": 1
			},
			{
				"taskId": "t_beacon_simon",
				"x": 1590,
				"y": 380,
				"floor": 1
			},
			{
				"taskId": "t_coolant_pipe",
				"x": 883,
				"y": 217,
				"floor": 2
			},
			{
				"taskId": "t_thruster_pump",
				"x": 1518,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_sonar_ping",
				"x": 1662,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_rail_brake",
				"x": 1500,
				"y": 796,
				"floor": 1
			},
			{
				"taskId": "t_solar_panel",
				"x": 1680,
				"y": 924,
				"floor": 1
			},
			{
				"taskId": "t_sand_filter",
				"x": 1590,
				"y": 780,
				"floor": 1
			}
		],
		"emergency": {
			"x": 995,
			"y": 275
		},
		"sabotageFix": {
			"lights": {
				"x": 1535,
				"y": 920,
				"label": "量子電源グリッド復旧"
			},
			"reactor": {
				"x": 465,
				"y": 945,
				"label": "反物質磁気封じ込め安定化"
			},
			"gas": {
				"x": 1590,
				"y": 372,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "⚛️ 電磁パルス・スキャナ（近傍の異常・殺害残滓を感知・CD16秒）＋ 🗺️ アドミン盤 ＋ 🪜 上部制御階エレベーター / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "emf_scanner",
				"label": "EMF異常スキャナ起動（5秒）",
				"icon": "⚛️",
				"x": 845,
				"y": 365,
				"cooldownSec": 16,
				"durationSec": 5
			},
			{
				"type": "admin",
				"label": "オメガ制御アドミン盤（5秒）",
				"icon": "🗺️",
				"x": 1135,
				"y": 365,
				"cooldownSec": 12,
				"durationSec": 5
			},
			{
				"type": "stairs",
				"id": "reactor_core_st_0_up",
				"label": "🪜 2F 炉心監視室へ上がる",
				"icon": "🪜",
				"x": 995,
				"y": 185,
				"floor": 1,
				"targetFloor": 2,
				"targetX": 995,
				"targetY": 185,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "reactor_core_st_0_dn",
				"label": "🪜 1F オメガブリッジへ降りる",
				"icon": "🪜",
				"x": 995,
				"y": 185,
				"floor": 2,
				"targetFloor": 1,
				"targetX": 995,
				"targetY": 185,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "reactor_core_st_1_up",
				"label": "🪜 2F 磁場制御室へ上がる",
				"icon": "🪜",
				"x": 380,
				"y": 240,
				"floor": 1,
				"targetFloor": 2,
				"targetX": 380,
				"targetY": 240,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "reactor_core_st_1_dn",
				"label": "🪜 1F 磁気シールド室へ降りる",
				"icon": "🪜",
				"x": 380,
				"y": 240,
				"floor": 2,
				"targetFloor": 1,
				"targetX": 380,
				"targetY": 240,
				"cooldownSec": 2
			},
			{
				"id": "reactor_core_auto_door_1",
				"type": "auto_door",
				"x": 670,
				"y": 297,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 660,
					"y": 260,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "reactor_core_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1315,
				"y": 297,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1305,
					"y": 260,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		],
		"hasMultiFloor": true,
		"floorNames": {
			"1": "1F 炉心基礎層",
			"2": "2F 上部制御キャットウォーク"
		}
	},
	"train": {
		"id": "train",
		"name": "🚄 銀河超特急・アストラルエクスプレス",
		"bg": "#050814",
		"accent": "#60a5fa",
		"corridorFill": "#152242",
		"wallColor": "#1e40af",
		"exteriorTheme": "space",
		"rooms": [
			{
				"id": "locomotive",
				"name": "1号車・先頭機関車",
				"x": 150,
				"y": 440,
				"w": 300,
				"h": 350,
				"color": "#1b2d54",
				"floorStyle": "metal"
			},
			{
				"id": "lounge_car",
				"name": "2号車・展望ラウンジ",
				"x": 530,
				"y": 440,
				"w": 300,
				"h": 350,
				"color": "#19294d",
				"floorStyle": "carpet"
			},
			{
				"id": "dining_car",
				"name": "3号車・食堂ダイニング",
				"x": 910,
				"y": 420,
				"w": 340,
				"h": 390,
				"color": "#1e2c52",
				"floorStyle": "tile"
			},
			{
				"id": "sleeper_car",
				"name": "4号車・寝台キャビン",
				"x": 1330,
				"y": 440,
				"w": 280,
				"h": 350,
				"color": "#182647",
				"floorStyle": "carpet"
			},
			{
				"id": "freight_car",
				"name": "5号車・貨物コンテナ車",
				"x": 1690,
				"y": 440,
				"w": 250,
				"h": 350,
				"color": "#1d2440",
				"floorStyle": "cargo"
			}
		],
		"corridors": [
			{
				"x": 430,
				"y": 580,
				"w": 120,
				"h": 74
			},
			{
				"x": 810,
				"y": 580,
				"w": 120,
				"h": 74
			},
			{
				"x": 1230,
				"y": 580,
				"w": 120,
				"h": 74
			},
			{
				"x": 1590,
				"y": 580,
				"w": 120,
				"h": 74
			},
			{
				"x": 645,
				"y": 240,
				"w": 850,
				"h": 74
			},
			{
				"x": 645,
				"y": 240,
				"w": 74,
				"h": 220
			},
			{
				"x": 1420,
				"y": 240,
				"w": 74,
				"h": 220
			}
		],
		"obstacles": [
			{
				"id": "trn_seat1",
				"kind": "table_rect",
				"x": 635,
				"y": 510,
				"w": 84,
				"h": 40,
				"blocksSight": false
			},
			{
				"id": "trn_bed1",
				"kind": "crate",
				"x": 1440,
				"y": 690,
				"w": 72,
				"h": 52,
				"blocksSight": true
			},
			{
				"id": "trn_cargo",
				"kind": "crate",
				"x": 1785,
				"y": 585,
				"w": 68,
				"h": 68,
				"blocksSight": true
			}
		],
		"decors": [
			{
				"kind": "window",
				"x": 570,
				"y": 442,
				"w": 220,
				"h": 14
			},
			{
				"kind": "window",
				"x": 960,
				"y": 422,
				"w": 240,
				"h": 14
			},
			{
				"kind": "caution",
				"x": 860,
				"y": 580,
				"w": 18,
				"h": 74
			},
			{
				"kind": "caution",
				"x": 1280,
				"y": 580,
				"w": 18,
				"h": 74
			}
		],
		"vents": [
			{
				"id": "v1",
				"x": 220,
				"y": 515,
				"label": "先頭車両床下ダクト"
			},
			{
				"id": "v2",
				"x": 1080,
				"y": 745,
				"label": "食堂車厨房ダクト"
			},
			{
				"id": "v3",
				"x": 1860,
				"y": 515,
				"label": "最後尾貨物ダクト"
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 1865,
				"y": 730
			},
			{
				"taskId": "t_code",
				"x": 220,
				"y": 730
			},
			{
				"taskId": "t_freq",
				"x": 375,
				"y": 515
			},
			{
				"taskId": "t_download",
				"x": 600,
				"y": 495
			},
			{
				"taskId": "t_asteroid",
				"x": 755,
				"y": 730
			},
			{
				"taskId": "t_reactor_align",
				"x": 1745,
				"y": 510
			},
			{
				"taskId": "t_security_pass",
				"x": 1385,
				"y": 730
			},
			{
				"taskId": "t_sample_scan",
				"x": 1545,
				"y": 515
			},
			{
				"taskId": "t_fuel_engine",
				"x": 220,
				"y": 625
			},
			{
				"taskId": "t_nav_chart",
				"x": 600,
				"y": 730
			},
			{
				"taskId": "t_o2_filter",
				"x": 1385,
				"y": 515
			},
			{
				"taskId": "t_trash_chute",
				"x": 1745,
				"y": 730
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 225,
				"y": 713,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1540,
				"y": 531,
				"floor": 1
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 225,
				"y": 545,
				"floor": 1
			},
			{
				"taskId": "t_beacon_simon",
				"x": 375,
				"y": 685,
				"floor": 1
			},
			{
				"taskId": "t_coolant_pipe",
				"x": 300,
				"y": 528,
				"floor": 1
			},
			{
				"taskId": "t_thruster_pump",
				"x": 300,
				"y": 703,
				"floor": 1
			},
			{
				"taskId": "t_star_map_connect",
				"x": 360,
				"y": 615,
				"floor": 1
			},
			{
				"taskId": "t_rail_brake",
				"x": 300,
				"y": 615,
				"floor": 1
			},
			{
				"taskId": "t_solar_panel",
				"x": 755,
				"y": 545,
				"floor": 1
			},
			{
				"taskId": "t_sand_filter",
				"x": 680,
				"y": 703,
				"floor": 1
			},
			{
				"taskId": "t_ancient_tablet",
				"x": 620,
				"y": 615,
				"floor": 1
			}
		],
		"emergency": {
			"x": 1080,
			"y": 580
		},
		"sabotageFix": {
			"lights": {
				"x": 1535,
				"y": 730,
				"label": "客車配電ボックス復旧"
			},
			"reactor": {
				"x": 295,
				"y": 625,
				"label": "ワープ機関圧力調整"
			},
			"gas": {
				"x": 680,
				"y": 692,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "⏩ リニア搬送レーン（速度135へバランス調整）＋ 🚪 連結車両隔壁ゲート / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "conveyor",
				"label": "リニア搬送レーン",
				"x": 700,
				"y": 248,
				"w": 740,
				"h": 58,
				"vx": 135,
				"vy": 0
			},
			{
				"type": "lockdown_door",
				"id": "train_coupler",
				"label": "3・4号車連結ゲートを一時封鎖（5秒）",
				"icon": "🚪",
				"x": 1200,
				"y": 665,
				"cooldownSec": 20,
				"durationSec": 5,
				"doorRect": {
					"x": 1272,
					"y": 580,
					"w": 36,
					"h": 74
				}
			},
			{
				"id": "train_auto_door_1",
				"type": "auto_door",
				"x": 490,
				"y": 617,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 480,
					"y": 580,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "train_shifting_wall_2",
				"type": "shifting_wall",
				"x": 870,
				"y": 617,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 860,
					"y": 580,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		]
	},
	"moon": {
		"id": "moon",
		"name": "🌕 月面クレーター基地・セレネ",
		"bg": "#080a0f",
		"accent": "#cbd5e1",
		"corridorFill": "#1e2533",
		"wallColor": "#475569",
		"exteriorTheme": "moon",
		"rooms": [
			{
				"id": "selene_dome",
				"name": "セレネ中央ドーム",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#262f40",
				"floorStyle": "tile"
			},
			{
				"id": "tranquility_pad",
				"name": "静かの海着陸パッド",
				"x": 1410,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#242d3d",
				"floorStyle": "cargo"
			},
			{
				"id": "helium_mine",
				"name": "ヘリウム3採掘場",
				"x": 1410,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#2b3042",
				"floorStyle": "stone"
			},
			{
				"id": "lunar_bunker",
				"name": "地下シェルター区画",
				"x": 770,
				"y": 790,
				"w": 450,
				"h": 290,
				"color": "#222938",
				"floorStyle": "metal"
			},
			{
				"id": "life_support",
				"name": "生命維持酸素プラント",
				"x": 210,
				"y": 700,
				"w": 360,
				"h": 320,
				"color": "#1f2d3d",
				"floorStyle": "lab"
			},
			{
				"id": "earth_obs",
				"name": "地球観測天文台",
				"x": 210,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#232c42",
				"floorStyle": "tile"
			},
			{
				"id": "moon_upper_obs",
				"name": "2F 地球展望サンルーム",
				"x": 770,
				"y": 130,
				"w": 450,
				"h": 290,
				"color": "#293548",
				"floorStyle": "tile",
				"floor": 2
			},
			{
				"id": "moon_comms_spire",
				"name": "2F 衛星通信スパイア",
				"x": 1410,
				"y": 170,
				"w": 360,
				"h": 280,
				"color": "#243045",
				"floorStyle": "lab",
				"floor": 2
			}
		],
		"corridors": [
			{
				"x": 550,
				"y": 260,
				"w": 240,
				"h": 74
			},
			{
				"x": 1200,
				"y": 260,
				"w": 230,
				"h": 74
			},
			{
				"x": 1555,
				"y": 430,
				"w": 76,
				"h": 290
			},
			{
				"x": 1200,
				"y": 890,
				"w": 230,
				"h": 74
			},
			{
				"x": 550,
				"y": 890,
				"w": 240,
				"h": 74
			},
			{
				"x": 355,
				"y": 430,
				"w": 76,
				"h": 290
			},
			{
				"x": 960,
				"y": 400,
				"w": 74,
				"h": 410
			},
			{
				"x": 1200,
				"y": 250,
				"w": 230,
				"h": 76,
				"floor": 2
			}
		],
		"obstacles": [
			{
				"id": "moon_rock1",
				"kind": "rock",
				"x": 1565,
				"y": 830,
				"w": 64,
				"h": 64,
				"blocksSight": true
			},
			{
				"id": "moon_pad_c",
				"kind": "crate",
				"x": 1565,
				"y": 285,
				"w": 64,
				"h": 58,
				"blocksSight": false
			},
			{
				"id": "moon2_tbl",
				"kind": "table_round",
				"x": 963,
				"y": 245,
				"w": 64,
				"h": 64,
				"blocksSight": false,
				"floor": 2
			}
		],
		"decors": [
			{
				"kind": "window",
				"x": 270,
				"y": 172,
				"w": 220,
				"h": 14
			},
			{
				"kind": "caution",
				"x": 960,
				"y": 420,
				"w": 74,
				"h": 16
			},
			{
				"kind": "window",
				"x": 840,
				"y": 132,
				"w": 310,
				"h": 14,
				"floor": 2
			}
		],
		"vents": [
			{
				"id": "v1",
				"x": 280,
				"y": 235,
				"label": "天文台地下エアロック"
			},
			{
				"id": "v2",
				"x": 1705,
				"y": 235,
				"label": "着陸パッド地下通路"
			},
			{
				"id": "v3",
				"x": 1705,
				"y": 950,
				"label": "採掘坑道エアロック"
			},
			{
				"id": "v2f_m1",
				"x": 1690,
				"y": 235,
				"label": "2F スパイアダクト",
				"floor": 2
			}
		],
		"taskSpots": [
			{
				"taskId": "t_wires",
				"x": 280,
				"y": 950
			},
			{
				"taskId": "t_code",
				"x": 1485,
				"y": 380
			},
			{
				"taskId": "t_freq",
				"x": 505,
				"y": 240
			},
			{
				"taskId": "t_asteroid",
				"x": 1485,
				"y": 955
			},
			{
				"taskId": "t_reactor_align",
				"x": 1705,
				"y": 775
			},
			{
				"taskId": "t_security_pass",
				"x": 1140,
				"y": 1015
			},
			{
				"taskId": "t_sample_scan",
				"x": 845,
				"y": 1015
			},
			{
				"taskId": "t_nav_chart",
				"x": 505,
				"y": 390
			},
			{
				"taskId": "t_ice_melt",
				"x": 1705,
				"y": 955
			},
			{
				"taskId": "t_fuel_engine",
				"x": 1705,
				"y": 380
			},
			{
				"taskId": "t_o2_filter",
				"x": 280,
				"y": 770
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 1511,
				"y": 940,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1108,
				"y": 865,
				"floor": 1
			},
			{
				"taskId": "t_memory_glyph",
				"x": 1500,
				"y": 380,
				"floor": 2
			},
			{
				"taskId": "t_rhythm_sync",
				"x": 860,
				"y": 365,
				"floor": 2
			},
			{
				"taskId": "t_download",
				"x": 1500,
				"y": 254,
				"floor": 1
			},
			{
				"taskId": "t_circuit_puzzle",
				"x": 1680,
				"y": 254,
				"floor": 1
			},
			{
				"taskId": "t_coolant_pipe",
				"x": 1590,
				"y": 240,
				"floor": 1
			},
			{
				"taskId": "t_thruster_pump",
				"x": 1590,
				"y": 380,
				"floor": 1
			},
			{
				"taskId": "t_star_map_connect",
				"x": 300,
				"y": 254,
				"floor": 1
			},
			{
				"taskId": "t_cargo_manifest",
				"x": 1518,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_solar_panel",
				"x": 1662,
				"y": 310,
				"floor": 1
			},
			{
				"taskId": "t_sand_filter",
				"x": 1500,
				"y": 796,
				"floor": 1
			},
			{
				"taskId": "t_ancient_tablet",
				"x": 1590,
				"y": 780,
				"floor": 1
			},
			{
				"taskId": "t_warp_coil",
				"x": 1590,
				"y": 940,
				"floor": 1
			}
		],
		"emergency": {
			"x": 995,
			"y": 275
		},
		"sabotageFix": {
			"lights": {
				"x": 455,
				"y": 955,
				"label": "月面ソーラー電源復旧"
			},
			"reactor": {
				"x": 455,
				"y": 775,
				"label": "酸素供給システム安定化"
			},
			"gas": {
				"x": 390,
				"y": 930,
				"label": "空気清浄フィルター起動（視界ガス除去）",
				"floor": 1
			}
		},
		"gimmickSummary": "🪐 低重力クレーター（+18%速度へ調整）＋ 🛰️ 軌道衛星アドミン盤（12秒CD） ＋ 🪜 地上観測ドーム連絡昇降機 / 🚪自動隔壁・可変壁",
		"gimmicks": [
			{
				"type": "low_gravity",
				"label": "低重力ゾーン",
				"x": 1445,
				"y": 200,
				"w": 295,
				"h": 220,
				"speedMult": 1.18
			},
			{
				"type": "low_gravity",
				"label": "低重力ゾーン",
				"x": 1445,
				"y": 730,
				"w": 295,
				"h": 260,
				"speedMult": 1.18
			},
			{
				"type": "admin",
				"label": "衛星アドミン盤（5秒表示）",
				"icon": "🛰️",
				"x": 1135,
				"y": 355,
				"cooldownSec": 12,
				"durationSec": 5
			},
			{
				"type": "stairs",
				"id": "moon_st_0_up",
				"label": "🪜 2F 地上展望ドームへ上がる",
				"icon": "🪜",
				"x": 995,
				"y": 185,
				"floor": 1,
				"targetFloor": 2,
				"targetX": 995,
				"targetY": 185,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "moon_st_0_dn",
				"label": "🪜 1F セレネ中央へ降りる",
				"icon": "🪜",
				"x": 995,
				"y": 185,
				"floor": 2,
				"targetFloor": 1,
				"targetX": 995,
				"targetY": 185,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "moon_st_1_up",
				"label": "🪜 2F 衛星通信スパイアへ上がる",
				"icon": "🪜",
				"x": 1580,
				"y": 240,
				"floor": 1,
				"targetFloor": 2,
				"targetX": 1580,
				"targetY": 240,
				"cooldownSec": 2
			},
			{
				"type": "stairs",
				"id": "moon_st_1_dn",
				"label": "🪜 1F 着陸パッドへ降りる",
				"icon": "🪜",
				"x": 1580,
				"y": 240,
				"floor": 2,
				"targetFloor": 1,
				"targetX": 1580,
				"targetY": 240,
				"cooldownSec": 2
			},
			{
				"id": "moon_auto_door_1",
				"type": "auto_door",
				"x": 670,
				"y": 297,
				"floor": 1,
				"label": "自動隔壁",
				"icon": "🚪",
				"doorRect": {
					"x": 660,
					"y": 260,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 10,
				"cycleClosedSec": 4.5,
				"phaseOffsetSec": 0
			},
			{
				"id": "moon_shifting_wall_2",
				"type": "shifting_wall",
				"x": 1315,
				"y": 297,
				"floor": 1,
				"label": "可変シールド壁",
				"icon": "🧱",
				"doorRect": {
					"x": 1305,
					"y": 260,
					"w": 20,
					"h": 74,
					"floor": 1
				},
				"cycleOpenSec": 11,
				"cycleClosedSec": 5,
				"phaseOffsetSec": 5
			}
		],
		"hasMultiFloor": true,
		"floorNames": {
			"1": "1F クレーター地下",
			"2": "2F 地上観測ドーム"
		}
	}
};
