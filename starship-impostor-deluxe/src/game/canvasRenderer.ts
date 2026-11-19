import { PLAYER_COLORS, isImpostorRole } from "./constants";
import {
  type DoorBlockerRect,
  buildMapDoorBlockers,
  buildWallSegments,
  computeVisibilityPolygon,
  getRoomName,
  isEntityVisible,
  sanitizeCameraPos,
} from "./engine";
import { getTaskById } from "./tasks150";
import type {
  DeadBody,
  GimmickNode,
  IntegratedFixtureType,
  KillCutInData,
  MapDef,
  PlayerState,
  SabotageState,
} from "./types";

export const LOBBY_CUSTOMIZE_TERMINAL = { x: 604, y: 88 };

const hatPreviewCache = new Map<string, string>();
const petPreviewCache = new Map<string, string>();
const visorPreviewCache = new Map<string, string>();
const skinPreviewCache = new Map<string, string>();
const mapBakeCache = new Map<string, HTMLCanvasElement>();
const mapThumbCache = new Map<string, string>();

const CARTOON_OUTLINE = "#070b14";

function normalizeHatKey(hatId: string): string {
  const aliases: Record<string, string> = {
    horns: "devil",
    leaf: "sprout",
    visor: "visor_hud",
    headphone: "headphones",
    beanie: "beanie_cap",
    cat_ears: "cyber_ears",
    rabbit_ears: "bunny",
    beret: "beret_cap",
    helmet: "knight_helm",
    santa: "santa_cap",
    sprout_flower: "flower",
    fox_ears: "fox_mask",
    astro_antenna: "satellite_dish",
  };
  return aliases[hatId] || hatId;
}

export function drawHat(
  ctx: CanvasRenderingContext2D,
  hatId: string,
  _playerHex = "#38fedc",
  nowMs = 0
): void {
  const key = normalizeHatKey(hatId);
  if (!key || key === "none") return;
  const bob = Math.sin(nowMs * 0.006) * 1.4;
  const pulse = Math.sin(nowMs * 0.009) > 0 ? 1 : 0;

  ctx.save();
  ctx.strokeStyle = CARTOON_OUTLINE;
  ctx.lineWidth = 2.6;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Beanie color variants
  if (key.startsWith("beanie_")) {
    const colorMap: Record<string, [string, string]> = {
      beanie_black: ["#27272a", "#18181b"],
      beanie_blue: ["#1d4ed8", "#1e3a8a"],
      beanie_pink: ["#ec4899", "#be185d"],
      beanie_purple: ["#7e22ce", "#581c87"],
      beanie_red: ["#dc2626", "#991b1b"],
      beanie_white: ["#e2e8f0", "#94a3b8"],
      beanie_gold: ["#eab308", "#a16207"],
      beanie_cap: ["#f97316", "#c2410c"],
    };
    const [fill, cuff] = colorMap[key] || ["#f97316", "#c2410c"];
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(-13, -19);
    ctx.quadraticCurveTo(-11, -39, 4, -37);
    ctx.quadraticCurveTo(13, -32, 13, -19);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = cuff;
    ctx.beginPath();
    ctx.roundRect(-14, -23, 28, 6.5, 3);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return;
  }

  // Head-mounted one-eyed slime variants
  if (key.startsWith("slime_")) {
    const slimeMap: Record<string, string> = {
      slime_purple: "#9333ea",
      slime_red: "#dc2626",
      slime_white: "#f1f5f9",
      slime_yellow: "#facc15",
    };
    ctx.fillStyle = slimeMap[key] || "#a855f7";
    ctx.beginPath();
    ctx.moveTo(-14, -19);
    ctx.quadraticCurveTo(-13, -29, -7, -30);
    ctx.quadraticCurveTo(-4, -39, 0, -37);
    ctx.quadraticCurveTo(6, -39, 8, -29);
    ctx.quadraticCurveTo(14, -27, 14, -19);
    ctx.quadraticCurveTo(7, -17, 2, -20);
    ctx.quadraticCurveTo(-4, -17, -14, -19);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(1, -28, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = CARTOON_OUTLINE;
    ctx.beginPath();
    ctx.arc(2.2, -28, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  switch (key) {
    case "crown": {
      const grad = ctx.createLinearGradient(-11, -34, 11, -20);
      grad.addColorStop(0, "#fde047");
      grad.addColorStop(1, "#ca8a04");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-12, -20);
      ctx.lineTo(-13, -34);
      ctx.lineTo(-5, -26);
      ctx.lineTo(0, -37);
      ctx.lineTo(5, -26);
      ctx.lineTo(13, -34);
      ctx.lineTo(12, -20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, -24, 2.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "halo": {
      const hy = -33 + bob * 0.8;
      ctx.strokeStyle = `rgba(253, 224, 71, ${0.42 + 0.16 * pulse})`;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.ellipse(0, hy, 14.5, 4.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.ellipse(0, hy, 14.5, 4.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "sprout": {
      const sway = Math.sin(nowMs * 0.004) * 1.6;
      ctx.strokeStyle = "#15803d";
      ctx.lineWidth = 3.4;
      ctx.beginPath();
      ctx.moveTo(0, -21);
      ctx.quadraticCurveTo(sway * 0.6, -28, sway, -34);
      ctx.stroke();
      ctx.strokeStyle = CARTOON_OUTLINE;
      ctx.lineWidth = 2.2;
      ctx.fillStyle = "#4ade80";
      ctx.beginPath();
      ctx.ellipse(sway - 6.8, -34, 6.5, 3.5, -0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.ellipse(sway + 6.8, -34, 6.5, 3.5, 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "cherry": {
      ctx.strokeStyle = "#15803d";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-4, -24);
      ctx.quadraticCurveTo(0, -37, 4, -36);
      ctx.stroke();
      ctx.strokeStyle = CARTOON_OUTLINE;
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(-4.5, -24, 5.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fca5a5";
      ctx.beginPath();
      ctx.arc(-6, -25.8, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "party_cone": {
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(-10, -20);
      ctx.lineTo(0, -39);
      ctx.lineTo(10, -20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-6, -27, 12, 3);
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(0, -40, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "bird_nest": {
      ctx.fillStyle = "#92400e";
      ctx.beginPath();
      ctx.ellipse(0, -22, 13.5, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#e0f2fe";
      for (const ex of [-4, 0, 4]) {
        ctx.beginPath();
        ctx.ellipse(ex, -25, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }
    case "flamingo": {
      ctx.fillStyle = "#f472b6";
      ctx.beginPath();
      ctx.ellipse(0, -22, 15, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(7, -22);
      ctx.quadraticCurveTo(13, -34, 7, -36);
      ctx.quadraticCurveTo(3, -36, 5, -31);
      ctx.lineTo(3, -22);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#090d16";
      ctx.beginPath();
      ctx.arc(9.5, -34, 1.6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "fez": {
      ctx.fillStyle = "#b91c1c";
      ctx.beginPath();
      ctx.moveTo(-9, -20);
      ctx.lineTo(-7, -34);
      ctx.lineTo(7, -34);
      ctx.lineTo(9, -20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, -34);
      ctx.lineTo(8, -26);
      ctx.stroke();
      break;
    }
    case "paper_hat": {
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.moveTo(-14, -20);
      ctx.lineTo(-4, -33);
      ctx.lineTo(4, -33);
      ctx.lineTo(14, -20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-5, -30);
      ctx.lineTo(0, -37);
      ctx.lineTo(5, -30);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "headband_blue": {
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.roundRect(-14, -23.5, 28, 6.2, 2.5);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-14, -21);
      ctx.lineTo(-21, -17);
      ctx.lineTo(-16, -24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "backward_cap_blue": {
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(0, -20, 13.5, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#1e40af";
      ctx.beginPath();
      ctx.roundRect(-18, -23.5, 16, 4.6, 2.3);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "visor_sun": {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.roundRect(-13, -24, 26, 5.5, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#93c5fd";
      ctx.beginPath();
      ctx.roundRect(0, -22, 16, 4.5, 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "sheriff_black":
    case "sheriff_silver": {
      ctx.fillStyle = key === "sheriff_black" ? "#1e293b" : "#94a3b8";
      ctx.beginPath();
      ctx.ellipse(0, -21, 18, 4.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-10, -22);
      ctx.lineTo(-7, -34);
      ctx.lineTo(0, -31);
      ctx.lineTo(7, -34);
      ctx.lineTo(10, -22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(3, -27, 2.6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "miner_lamp": {
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.arc(0, -20, 13.5, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.roundRect(4, -30, 8, 6, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(10, -27, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "halloween_tophat":
    case "tophat": {
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(-10, -41, 20, 17, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = key === "halloween_tophat" ? "#a855f7" : "#e11d48";
      ctx.fillRect(-9.5, -29, 19, 3.8);
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(-15, -25.5, 30, 4.2, 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "halloween_cat": {
      ctx.fillStyle = "#18181b";
      ctx.beginPath();
      ctx.moveTo(-12, -19);
      ctx.lineTo(-10, -32);
      ctx.lineTo(-4, -24);
      ctx.lineTo(4, -24);
      ctx.lineTo(10, -32);
      ctx.lineTo(12, -19);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(-4, -22, 1.5, 0, Math.PI * 2);
      ctx.arc(4, -22, 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "bat_wings": {
      ctx.fillStyle = "#3f2e28";
      for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(dir * 6, -21);
        ctx.lineTo(dir * 20, -34);
        ctx.lineTo(dir * 16, -22);
        ctx.lineTo(dir * 11, -24);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      break;
    }
    case "paper_bag": {
      ctx.fillStyle = "#78685c";
      ctx.beginPath();
      ctx.roundRect(-13, -34, 26, 22, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = CARTOON_OUTLINE;
      ctx.fillRect(-5, -26, 3, 3);
      ctx.fillRect(3, -26, 3, 3);
      ctx.beginPath();
      ctx.moveTo(-6, -18);
      ctx.lineTo(-2, -20);
      ctx.lineTo(2, -18);
      ctx.lineTo(6, -20);
      ctx.stroke();
      break;
    }
    case "wolf_ears": {
      ctx.fillStyle = "#3f3f46";
      ctx.beginPath();
      ctx.moveTo(-12, -20);
      ctx.lineTo(-11, -35);
      ctx.lineTo(-3, -24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(12, -20);
      ctx.lineTo(11, -35);
      ctx.lineTo(3, -24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "knife_head": {
      ctx.save();
      ctx.translate(4, -26);
      ctx.rotate(-0.45);
      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(6, -5);
      ctx.lineTo(8, 2);
      ctx.lineTo(-10, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#78350f";
      ctx.fillRect(-16, -1, 7, 5);
      ctx.strokeRect(-16, -1, 7, 5);
      ctx.restore();
      break;
    }
    case "snowman_hat": {
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(0, -25, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -34, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-5, -42, 10, 4);
      ctx.fillStyle = "#a855f7";
      ctx.fillRect(-6, -30, 12, 2.5);
      break;
    }
    case "reindeer_antlers": {
      ctx.strokeStyle = "#5c3317";
      ctx.lineWidth = 3.2;
      for (const dir of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(dir * 6, -21);
        ctx.lineTo(dir * 12, -36);
        ctx.moveTo(dir * 10, -29);
        ctx.lineTo(dir * 16, -32);
        ctx.stroke();
      }
      break;
    }
    case "fairy_lights": {
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, -18, 14, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      const bulbs: [number, number, string][] = [
        [-8, -28, "#22c55e"],
        [0, -31, "#ef4444"],
        [8, -28, "#facc15"],
      ];
      for (const [bx, by, col] of bulbs) {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(bx, by, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }
    case "xmas_tree": {
      ctx.fillStyle = "#15803d";
      ctx.beginPath();
      ctx.moveTo(-11, -20);
      ctx.lineTo(0, -40);
      ctx.lineTo(11, -20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(0, -41, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(-3, -27, 2, 0, Math.PI * 2);
      ctx.arc(4, -24, 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "present_box": {
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.roundRect(-10, -34, 20, 14, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-2, -34, 4, 14);
      ctx.fillRect(-10, -29, 20, 4);
      break;
    }
    case "candy_canes": {
      for (const dir of [-1, 1]) {
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(dir * 7, -20);
        ctx.lineTo(dir * 9, -33);
        ctx.arc(dir * 12, -33, 3, Math.PI, 0, dir < 0);
        ctx.stroke();
      }
      break;
    }
    case "elf_hat": {
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.moveTo(-12, -21);
      ctx.lineTo(-4, -39);
      ctx.lineTo(12, -21);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(-5, -39, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "cube_polus_ushanka": {
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.roundRect(-14, -33, 28, 13, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.roundRect(-10, -31, 20, 7, 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "cube_mira_visor_helm": {
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.arc(0, -20, 14.5, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#34d399";
      ctx.fillRect(-5, -31, 10, 4);
      break;
    }
    case "cube_airship_tophat": {
      ctx.fillStyle = "#18181b";
      ctx.beginPath();
      ctx.roundRect(-11, -43, 22, 19, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-10, -29, 20, 4);
      ctx.fillStyle = "#090d16";
      ctx.beginPath();
      ctx.roundRect(-16, -25, 32, 4.5, 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "cube_cosmic_halo": {
      const cy = -33 + bob;
      ctx.strokeStyle = "#e879f9";
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.ellipse(0, cy, 15, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(0, cy - 5, 3.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "antenna":
      ctx.fillStyle = "#475569";
      ctx.beginPath();
      ctx.roundRect(-7, -25, 14, 5, 2.5);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(0, -37);
      ctx.stroke();
      ctx.fillStyle = pulse > 0 ? "#7dd3fc" : "#0284c7";
      ctx.strokeStyle = CARTOON_OUTLINE;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -39, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "devil": {
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.moveTo(-11, -20);
      ctx.quadraticCurveTo(-17, -29, -12, -37);
      ctx.quadraticCurveTo(-8, -28, -3, -22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(11, -20);
      ctx.quadraticCurveTo(17, -29, 12, -37);
      ctx.quadraticCurveTo(8, -28, 3, -22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "cap":
    case "beret_cap": {
      ctx.fillStyle = key === "beret_cap" ? "#ec4899" : "#2563eb";
      ctx.beginPath();
      ctx.arc(0, -20, 13.5, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      if (key === "cap") {
        ctx.fillStyle = "#1e40af";
        ctx.beginPath();
        ctx.roundRect(1, -23.5, 16.5, 4.6, 2.3);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(0, -35, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }
    case "santa_cap":
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.moveTo(-12, -21);
      ctx.lineTo(0, -40);
      ctx.lineTo(12, -21);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(-13, -24, 26, 5, 2.5);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -40, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "viking":
      ctx.fillStyle = "#64748b";
      ctx.beginPath();
      ctx.arc(0, -20.5, 13.5, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fef3c7";
      ctx.beginPath();
      ctx.moveTo(-11.5, -23.5);
      ctx.quadraticCurveTo(-22, -29, -17, -39);
      ctx.quadraticCurveTo(-13, -32, -9, -26.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(11.5, -23.5);
      ctx.quadraticCurveTo(22, -29, 17, -39);
      ctx.quadraticCurveTo(13, -32, 9, -26.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case "bunny":
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.ellipse(-5.5, -34, 4.2, 12, -0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(5.5, -34, 4.2, 12, 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f472b6";
      ctx.beginPath();
      ctx.ellipse(-5.5, -34, 2, 8, -0.14, 0, Math.PI * 2);
      ctx.ellipse(5.5, -34, 2, 8, 0.14, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "chef":
      ctx.fillStyle = "#f1f5f9";
      ctx.beginPath();
      ctx.arc(-7.5, -32, 6.2, 0, Math.PI * 2);
      ctx.arc(0, -34.5, 7.8, 0, Math.PI * 2);
      ctx.arc(7.5, -32, 6.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.roundRect(-10.5, -26.5, 21, 5.5, 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "pirate":
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.moveTo(-17.5, -21);
      ctx.quadraticCurveTo(-10, -39, 0, -36);
      ctx.quadraticCurveTo(10, -39, 17.5, -21);
      ctx.quadraticCurveTo(0, -24.5, -17.5, -21);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(0, -28.5, 3.2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "headphones":
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3.8;
      ctx.beginPath();
      ctx.arc(0, -13, 15.8, Math.PI * 1.05, Math.PI * -0.05);
      ctx.stroke();
      ctx.strokeStyle = CARTOON_OUTLINE;
      ctx.lineWidth = 2.4;
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.roundRect(-18.5, -17, 6.5, 12, 3);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(12, -17, 6.5, 12, 3);
      ctx.fill();
      ctx.stroke();
      break;
    case "flower":
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - 0.3;
        ctx.fillStyle = i % 2 === 0 ? "#fb7185" : "#facc15";
        ctx.beginPath();
        ctx.arc(8 + Math.cos(a) * 4.5, -24 + Math.sin(a) * 4.5, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(8, -24, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "wizard":
      ctx.fillStyle = "#312e81";
      ctx.beginPath();
      ctx.ellipse(0, -22, 16, 4.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-10, -23);
      ctx.lineTo(2, -43);
      ctx.lineTo(10, -23);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(0, -31, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "ribbon":
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(-12, -32);
      ctx.lineTo(-11, -20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(12, -32);
      ctx.lineTo(11, -20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case "ufo": {
      const uy = -31 + bob;
      ctx.fillStyle = "rgba(186, 230, 253, 0.88)";
      ctx.beginPath();
      ctx.arc(0, uy - 3, 6.5, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.ellipse(0, uy, 14, 4.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "samurai":
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(0, -20, 14, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(0, -25.5);
      ctx.lineTo(-13.5, -40);
      ctx.lineTo(-2.5, -28);
      ctx.lineTo(2.5, -28);
      ctx.lineTo(13.5, -40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case "ninja":
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(-13.5, -23.5, 27, 7, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.roundRect(-7, -22.5, 14, 5, 1.5);
      ctx.fill();
      ctx.stroke();
      break;
    case "captain":
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.ellipse(0, -27.5, 15, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(-11.5, -24, 23, 5, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(2, -27.5, 2.8, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "police":
      ctx.fillStyle = "#1d4ed8";
      ctx.beginPath();
      ctx.ellipse(0, -27, 15, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(-11.5, -23.5, 23, 4.5, 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(3, -27, 2.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "goggles":
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.roundRect(-14, -25, 28, 5.2, 2);
      ctx.fill();
      ctx.stroke();
      for (const gx of [-3.5, 6.5]) {
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(gx, -22.5, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    case "pumpkin":
      ctx.fillStyle = "#ea580c";
      ctx.beginPath();
      ctx.ellipse(0, -26.5, 13.5, 8.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#16a34a";
      ctx.fillRect(-2.5, -39, 5, 5.5);
      break;
    case "knight_helm":
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(0, -20.5, 13.8, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-10, -23.5, 20, 2.5);
      break;
    case "cyber_ears":
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-12, -20);
      ctx.lineTo(-9, -36.5);
      ctx.lineTo(-2, -22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(2, -22);
      ctx.lineTo(9, -36.5);
      ctx.lineTo(12, -20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case "banana":
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.ellipse(0, -27, 13, 6, 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "toilet_paper":
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.roundRect(-8, -36, 16, 15, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.ellipse(0, -36, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "plunger":
    case "plunger_blue":
    case "plunger_gold": {
      ctx.fillStyle = key === "plunger_gold" ? "#facc15" : key === "plunger_blue" ? "#cbd5e1" : "#92400e";
      ctx.fillRect(-2.2, -41, 4.4, 15);
      ctx.strokeRect(-2.2, -41, 4.4, 15);
      ctx.fillStyle = key === "plunger_blue" ? "#1d4ed8" : key === "plunger_gold" ? "#18181b" : "#dc2626";
      ctx.beginPath();
      ctx.arc(0, -21, 9, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "cheese":
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(-11, -21);
      ctx.lineTo(0, -36);
      ctx.lineTo(11, -21);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case "fried_egg":
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(0, -24.5, 12.5, 4.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(1, -25.5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "laurel_wreath":
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, -21, 13.5, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      for (let i = 0; i <= 6; i++) {
        const a = Math.PI * (1.12 + i * 0.125);
        ctx.beginPath();
        ctx.ellipse(Math.cos(a) * 14, -21 + Math.sin(a) * 14, 4.2, 2.2, a + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case "ace_visor":
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(0, -20, 14, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.roundRect(-2, -18, 18, 8, 3);
      ctx.fill();
      ctx.stroke();
      break;
    case "nebula_crown": {
      const ny = -28 + bob * 0.6;
      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, ny, 14, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#e879f9";
      for (const gx of [-9, 0, 9]) {
        ctx.beginPath();
        ctx.arc(gx, ny - (gx === 0 ? 4 : 1), 3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "cyber_oni":
      ctx.fillStyle = "#be123c";
      ctx.beginPath();
      ctx.roundRect(-12, -31, 24, 12, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.moveTo(-8, -31);
      ctx.lineTo(-10, -41);
      ctx.lineTo(-3, -31);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(8, -31);
      ctx.lineTo(10, -41);
      ctx.lineTo(3, -31);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case "star_commander":
      ctx.fillStyle = "#1e3a8a";
      ctx.beginPath();
      ctx.ellipse(0, -28, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-12, -24, 24, 4);
      ctx.beginPath();
      ctx.arc(0, -30, 3.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    default:
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(0, -21, 12, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
  }
  ctx.restore();
}

export function drawVisorDecor(
  ctx: CanvasRenderingContext2D,
  visorId = "none",
  nowMs = 0
): void {
  if (!visorId || visorId === "none") return;
  ctx.save();
  ctx.strokeStyle = CARTOON_OUTLINE;
  ctx.lineWidth = 2.2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  if (visorId.startsWith("dum_")) {
    const dumMap: Record<string, string> = {
      dum_yellow: "#facc15",
      dum_cyan: "#38bdf8",
      dum_green: "#4ade80",
      dum_orange: "#fb923c",
      dum_pink: "#f472b6",
      dum_purple: "#c084fc",
    };
    ctx.save();
    ctx.translate(7, -10);
    ctx.rotate(-0.14);
    ctx.fillStyle = dumMap[visorId] || "#facc15";
    ctx.beginPath();
    ctx.roundRect(-7, -5.5, 14, 11, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = CARTOON_OUTLINE;
    ctx.font = "900 5.5px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DUM", 0, 2);
    ctx.restore();
    ctx.restore();
    return;
  }

  switch (visorId) {
    case "hockey_mask":
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.ellipse(6, -7, 11, 9.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(3, -9, 1.9, 0, Math.PI * 2);
      ctx.arc(10, -9, 1.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = CARTOON_OUTLINE;
      ctx.fillRect(5, -4, 3, 1.8);
      break;
    case "smile_mask":
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.roundRect(-1, -6, 17, 7, 3);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(2, -2.5);
      ctx.quadraticCurveTo(7.5, 0.5, 13, -2.5);
      ctx.stroke();
      break;
    case "plague_beak":
      ctx.fillStyle = "#1f2937";
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(22, -6);
      ctx.lineTo(15, -1);
      ctx.lineTo(-1, -3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(4, -10, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "narrow_eyes":
      ctx.fillStyle = CARTOON_OUTLINE;
      ctx.beginPath();
      ctx.ellipse(2, -9, 3.8, 1.5, 0.25, 0, Math.PI * 2);
      ctx.ellipse(11, -9, 3.8, 1.5, -0.25, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "blush":
      ctx.fillStyle = "rgba(244, 114, 182, 0.72)";
      ctx.beginPath();
      ctx.ellipse(-3, -2, 4.2, 2.4, 0, 0, Math.PI * 2);
      ctx.ellipse(14, -2, 4.2, 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "smug":
      ctx.beginPath();
      ctx.moveTo(3, -8);
      ctx.lineTo(7, -8.5);
      ctx.moveTo(10, -8.5);
      ctx.lineTo(14, -8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(6, -3);
      ctx.quadraticCurveTo(10, -1, 13, -4);
      ctx.stroke();
      break;
    case "happy_eyes":
      ctx.beginPath();
      ctx.arc(3, -8, 2.8, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(11, -8, 2.8, Math.PI, 0);
      ctx.stroke();
      break;
    case "cracked_glass":
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(1, -13);
      ctx.lineTo(6, -8);
      ctx.lineTo(4, -4);
      ctx.moveTo(6, -8);
      ctx.lineTo(13, -6);
      ctx.stroke();
      break;
    case "mud_splash":
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.arc(3, -6, 2.8, 0, Math.PI * 2);
      ctx.arc(11, -10, 2.1, 0, Math.PI * 2);
      ctx.arc(13, -5, 1.8, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "three_dots":
      ctx.fillStyle = CARTOON_OUTLINE;
      for (const dx of [2, 7, 12]) {
        ctx.beginPath();
        ctx.arc(dx, -8.5, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case "eyepatch_left":
    case "eyepatch_right": {
      const px = visorId === "eyepatch_left" ? 3 : 11;
      ctx.strokeStyle = CARTOON_OUTLINE;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, -13);
      ctx.lineTo(16, -6);
      ctx.stroke();
      ctx.fillStyle = "#18181b";
      ctx.beginPath();
      ctx.arc(px, -9, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "pipe_red":
    case "pipe_brown": {
      ctx.fillStyle = visorId === "pipe_red" ? "#dc2626" : "#78350f";
      ctx.beginPath();
      ctx.moveTo(7, -1);
      ctx.lineTo(17, 2);
      ctx.lineTo(19, -2);
      ctx.lineTo(22, -2);
      ctx.lineTo(21, 5);
      ctx.lineTo(7, 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "piercing":
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(-5, -5, 2.5, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "ski_goggles":
    case "cube_snow_visor":
      ctx.fillStyle = visorId === "cube_snow_visor" ? "#f97316" : "#38bdf8";
      ctx.beginPath();
      ctx.roundRect(-2, -14.5, 19, 10, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillRect(1, -12, 12, 2.2);
      break;
    case "round_sunglasses":
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(3, -8.5, 4.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(12, -8.5, 4.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-2, -9.5);
      ctx.lineTo(16, -9.5);
      ctx.stroke();
      break;
    case "wheat_straw":
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(8, -2);
      ctx.lineTo(20, -6);
      ctx.stroke();
      break;
    case "cube_cyber_scouter": {
      const pulse = 0.65 + 0.35 * Math.sin(nowMs * 0.01);
      ctx.fillStyle = `rgba(34, 211, 238, ${pulse * 0.7})`;
      ctx.strokeStyle = "#0284c7";
      ctx.beginPath();
      ctx.roundRect(4, -14, 13, 9, 2);
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "cube_gold_monocle":
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(10, -8.5, 4.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, -4);
      ctx.lineTo(10, 4);
      ctx.stroke();
      break;
    case "cube_star_shades":
      ctx.fillStyle = "#e879f9";
      ctx.beginPath();
      ctx.roundRect(-2, -13.5, 19, 8.5, 2);
      ctx.fill();
      ctx.stroke();
      break;
    default:
      break;
  }
  ctx.restore();
}

export function getHatPreviewUrl(hatId: string, colorHex = "#38fedc"): string {
  if (typeof document === "undefined") return "";
  const key = `${hatId}_${colorHex}`;
  const cached = hatPreviewCache.get(key);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const bg = ctx.createRadialGradient(32, 30, 4, 32, 32, 30);
  bg.addColorStop(0, "rgba(56, 189, 248, 0.16)");
  bg.addColorStop(1, "rgba(15, 23, 42, 0)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 64, 64);
  if (hatId === "none") {
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(32, 32, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(21, 43);
    ctx.lineTo(43, 21);
    ctx.stroke();
  } else {
    ctx.save();
    ctx.translate(32, 62);
    ctx.scale(1.32, 1.32);
    drawHat(ctx, hatId, colorHex, 0);
    ctx.restore();
  }
  const url = c.toDataURL("image/png");
  hatPreviewCache.set(key, url);
  return url;
}

export function getVisorPreviewUrl(visorId: string): string {
  if (typeof document === "undefined") return "";
  const cached = visorPreviewCache.get(visorId);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
  ctx.fillRect(0, 0, 64, 64);
  if (visorId === "none") {
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(32, 32, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(21, 43);
    ctx.lineTo(43, 21);
    ctx.stroke();
  } else {
    ctx.save();
    ctx.translate(22, 44);
    ctx.scale(1.55, 1.55);
    // Faint visor base silhouette
    ctx.fillStyle = "#8fd4f5";
    ctx.strokeStyle = CARTOON_OUTLINE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-2, -14, 18, 11, 5.5);
    ctx.fill();
    ctx.stroke();
    drawVisorDecor(ctx, visorId, 0);
    ctx.restore();
  }
  const url = c.toDataURL("image/png");
  visorPreviewCache.set(visorId, url);
  return url;
}

export function getSkinPreviewUrl(skinId: string, colorId = "gray"): string {
  if (typeof document === "undefined") return "";
  const key = `${skinId}_${colorId}`;
  const cached = skinPreviewCache.get(key);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  ctx.save();
  ctx.translate(32, 36);
  ctx.scale(1.12, 1.12);
  drawPlayer(ctx, 0, 0, colorId, "none", 1, true, false, 1, false, 0, "none", skinId, undefined, "none");
  ctx.restore();
  const url = c.toDataURL("image/png");
  skinPreviewCache.set(key, url);
  return url;
}

export function drawPet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  petId: string,
  colorId: string,
  facing = 1,
  isMoving = false,
  nowMs = 0
): void {
  if (!petId || petId === "none") return;
  const cDef = PLAYER_COLORS.find((c) => c.id === colorId) || PLAYER_COLORS[0];
  const hop = isMoving ? Math.abs(Math.sin(nowMs * 0.015)) * 4.2 : Math.sin(nowMs * 0.005) * 1.6;
  const hover = Math.sin(nowMs * 0.006) * 3.5;

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 12, 10.5, 3.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.scale(facing, 1);
  ctx.strokeStyle = CARTOON_OUTLINE;
  ctx.lineWidth = 2.4;
  ctx.lineJoin = "round";

  switch (petId) {
    case "mini_crew":
    case "mini_crew_pink":
    case "mini_crew_top":
    case "cube_toppat_mini": {
      const fill = petId === "mini_crew_pink" ? "#ed54ba" : cDef.hex;
      const dark = petId === "mini_crew_pink" ? "#ab2bad" : cDef.dark;
      ctx.translate(0, petId === "mini_crew_top" ? 0 : -hop);
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.roundRect(-10.5, -5, 5, 11, 2.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.roundRect(-7, -11, 14, 18, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#8fd4f5";
      ctx.beginPath();
      ctx.roundRect(-1, -7, 9, 5.5, 3);
      ctx.fill();
      ctx.stroke();
      if (petId === "cube_toppat_mini") {
        ctx.fillStyle = "#18181b";
        ctx.fillRect(-5, -18, 10, 8);
        ctx.strokeRect(-5, -18, 10, 8);
      }
      break;
    }
    case "alien":
      ctx.translate(0, -hop);
      ctx.fillStyle = "#4ade80";
      ctx.beginPath();
      ctx.ellipse(0, 0, 9.5, 10.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(1, -3, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = CARTOON_OUTLINE;
      ctx.beginPath();
      ctx.arc(1.5, -3, 1.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "flat_crab":
      ctx.translate(0, -hop * 0.5);
      ctx.fillStyle = "#a8835e";
      ctx.beginPath();
      ctx.ellipse(0, 1, 11, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (const lx of [-8, -3, 3, 8]) {
        ctx.beginPath();
        ctx.moveTo(lx, 5);
        ctx.lineTo(lx * 1.2, 10);
        ctx.stroke();
      }
      break;
    case "tentacle_alien":
      ctx.translate(0, -hop);
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(0, -4, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#9333ea";
      for (const tx of [-5, 0, 5]) {
        ctx.beginPath();
        ctx.roundRect(tx - 2, 2, 4, 8, 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    case "blue_alien_dog":
      ctx.translate(0, -hop);
      ctx.fillStyle = "#06b6d4";
      ctx.beginPath();
      ctx.roundRect(-10, -2, 18, 10, 4);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(0, -11, 10, 9, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(7, -1, 3, 4);
      break;
    case "hamster_ball":
      ctx.translate(0, -hop * 0.6);
      ctx.fillStyle = "rgba(186, 230, 253, 0.45)";
      ctx.beginPath();
      ctx.arc(0, 0, 11.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#a3e635";
      ctx.beginPath();
      ctx.ellipse(0, 2, 6, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "stickmin_red":
    case "stickmin_white":
      ctx.translate(0, -hop);
      ctx.fillStyle = petId === "stickmin_red" ? "#dc2626" : "#f8fafc";
      ctx.beginPath();
      ctx.arc(0, -7, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -2);
      ctx.lineTo(0, 6);
      ctx.lineTo(-4, 11);
      ctx.moveTo(0, 6);
      ctx.lineTo(4, 11);
      ctx.stroke();
      break;
    case "cube_snow_fox":
      ctx.translate(0, -hop);
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.ellipse(0, 1, 9.5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-4, -5);
      ctx.lineTo(-2, -12);
      ctx.lineTo(2, -5);
      ctx.fill();
      ctx.stroke();
      break;
    case "robot":
      ctx.translate(0, -4 + hover);
      ctx.fillStyle = "#d6c5a3";
      ctx.beginPath();
      ctx.roundRect(-8, -7, 16, 15, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-3.5, -2.5, 3, 3);
      ctx.fillRect(1.5, -2.5, 3, 3);
      break;
    case "cat_pet":
      ctx.translate(0, -hop);
      ctx.fillStyle = "#fb923c";
      ctx.beginPath();
      ctx.ellipse(0, 0, 9.5, 8.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "dog_pet":
      ctx.translate(0, -hop);
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.roundRect(-10, -2, 18, 10, 4);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(0, -11, 11, 10, 4);
      ctx.fill();
      ctx.stroke();
      break;
    case "slime":
      ctx.translate(0, -hop);
      ctx.fillStyle = "rgba(34, 211, 238, 0.88)";
      ctx.beginPath();
      ctx.arc(0, 2, 10, Math.PI, 0);
      ctx.lineTo(10, 8);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case "ufo_pet":
      ctx.translate(0, -6 + hover);
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.ellipse(0, -1, 13, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#7dd3fc";
      ctx.beginPath();
      ctx.arc(0, -4, 5.5, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      break;
    case "ghost_pet":
      ctx.translate(0, -5 + hover);
      ctx.fillStyle = "rgba(226, 232, 240, 0.9)";
      ctx.beginPath();
      ctx.arc(0, -3, 8.5, Math.PI, 0);
      ctx.lineTo(8.5, 7);
      ctx.lineTo(-8.5, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case "star_dragon":
      ctx.translate(0, -4 + hover);
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "quantum_owl":
      ctx.translate(0, -4 + hover);
      ctx.fillStyle = "#818cf8";
      ctx.beginPath();
      ctx.ellipse(0, 0, 8.5, 9.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "plasma_fox":
      ctx.translate(0, -hop);
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.ellipse(0, 1, 9, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "crystal_crab":
      ctx.translate(0, -hop * 0.6);
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.ellipse(0, 2, 10, 6.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "nebula_jelly":
      ctx.translate(0, -6 + hover);
      ctx.fillStyle = "rgba(232, 121, 249, 0.85)";
      ctx.beginPath();
      ctx.arc(0, 0, 8.5, Math.PI, 0);
      ctx.lineTo(8.5, 4);
      ctx.lineTo(-8.5, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case "astro_penguin":
      ctx.translate(0, -hop);
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.ellipse(0, 0, 8.5, 10.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case "mecha_beetle":
      ctx.translate(0, -hop * 0.5);
      ctx.fillStyle = "#eab308";
      ctx.beginPath();
      ctx.ellipse(0, 1, 9.5, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    default:
      break;
  }
  ctx.restore();
}

export function getPetPreviewUrl(petId: string, colorId = "cyan"): string {
  if (typeof document === "undefined") return "";
  const key = `${petId}_${petId === "mini_crew" ? colorId : "std"}`;
  const cached = petPreviewCache.get(key);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const bg = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
  bg.addColorStop(0, "rgba(16, 185, 129, 0.16)");
  bg.addColorStop(1, "rgba(15, 23, 42, 0)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 64, 64);
  if (petId === "none") {
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(32, 32, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(21, 43);
    ctx.lineTo(43, 21);
    ctx.stroke();
  } else {
    ctx.save();
    ctx.translate(32, 36);
    ctx.scale(1.55, 1.55);
    drawPet(ctx, 0, 0, petId, colorId, 1, false, 0);
    ctx.restore();
  }
  const url = c.toDataURL("image/png");
  petPreviewCache.set(key, url);
  return url;
}

export function drawKillEffectBurst(
  ctx: CanvasRenderingContext2D,
  burst: { x: number; y: number; effectId: string; colorHex: string; startedAt: number; durationMs: number },
  nowMs: number
): void {
  const t = Math.max(0, Math.min(1, (nowMs - burst.startedAt) / burst.durationMs));
  if (t >= 1) return;
  const alpha = 1 - t;
  ctx.save();
  ctx.translate(burst.x, burst.y);
  ctx.globalAlpha = alpha;
  if (burst.effectId === "glitch") {
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + (i % 2) * 0.4;
      const d = 12 + t * (45 + (i % 4) * 14);
      ctx.fillStyle = i % 3 === 0 ? "#e879f9" : i % 3 === 1 ? "#22d3ee" : burst.colorHex;
      ctx.fillRect(Math.cos(a) * d - 4, Math.sin(a) * d - 4, 8 * alpha + 2, 8 * alpha + 2);
    }
  } else if (burst.effectId === "supernova") {
    const rad = 16 + t * 72;
    const g = ctx.createRadialGradient(0, 0, 2, 0, 0, rad);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.45, "#fbbf24");
    g.addColorStop(1, "rgba(249, 115, 22, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, Math.PI * 2);
    ctx.fill();
  } else if (burst.effectId === "freeze") {
    ctx.strokeStyle = "#bae6fd";
    ctx.fillStyle = "rgba(125, 211, 252, 0.72)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const d = 10 + t * 54;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (burst.effectId === "void" || burst.effectId === "blackhole") {
    const rad = Math.max(4, 58 * (1 - t * 0.65));
    ctx.fillStyle = "#020617";
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, rad * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (burst.effectId === "thunder") {
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 4;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a + 0.25) * (18 + t * 20), Math.sin(a + 0.25) * (18 + t * 20));
      ctx.lineTo(Math.cos(a - 0.15) * (38 + t * 42), Math.sin(a - 0.15) * (38 + t * 42));
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 5 * alpha + 1;
    ctx.beginPath();
    ctx.moveTo(-30 - t * 18, -26 - t * 18);
    ctx.lineTo(30 + t * 18, 26 + t * 18);
    ctx.moveTo(30 + t * 18, -26 - t * 18);
    ctx.lineTo(-30 - t * 18, 26 + t * 18);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawSkinOverlay(ctx: CanvasRenderingContext2D, skin: string, nowMs: number): void {
  if (!skin || skin === "standard") return;
  ctx.save();
  ctx.strokeStyle = CARTOON_OUTLINE;
  ctx.lineWidth = 2;

  if (skin === "captain") {
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(-13, -1, 26, 13);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-13, 6, 26, 8);
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(0, 0, 4, 9);
    ctx.fillStyle = "#facc15";
    ctx.fillRect(-12, 1, 5, 2.5);
  } else if (skin === "police") {
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(-13, -1, 26, 15);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-13, 6, 26, 3);
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(8, 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (skin === "overalls") {
    ctx.fillStyle = "#1e3a8a";
    ctx.fillRect(-13, 1, 26, 14);
    ctx.fillRect(-10, -4, 4, 6);
    ctx.fillRect(6, -4, 4, 6);
  } else if (skin === "military") {
    ctx.fillStyle = "#14532d";
    ctx.fillRect(-13, -1, 26, 15);
    ctx.fillStyle = "#365314";
    ctx.fillRect(-13, 5, 26, 3);
  } else if (skin === "suit_black") {
    ctx.fillStyle = "#18181b";
    ctx.fillRect(-13, -1, 26, 15);
    ctx.fillStyle = "#e11d48";
    ctx.fillRect(1, 0, 3.5, 8);
  } else if (skin === "suit_white") {
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(-13, -1, 26, 15);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(1, 0, 3.5, 7);
  } else if (skin === "medic" || skin === "cube_mira_researcher") {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-13, -1, 26, 15);
    ctx.fillStyle = skin === "cube_mira_researcher" ? "#34d399" : "#ef4444";
    ctx.fillRect(-2, 1, 5, 5);
    ctx.fillRect(-3.5, 2.5, 8, 2);
  } else if (skin === "dual_medic") {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-13, -1, 13, 15);
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(0, -1, 13, 15);
  } else if (skin === "right_hand") {
    ctx.fillStyle = "#78350f";
    ctx.fillRect(-13, -1, 26, 15);
    ctx.fillStyle = "#eab308";
    ctx.fillRect(-13, 5, 26, 3);
  } else if (skin === "cyber") {
    const glow = 0.55 + 0.4 * Math.sin(nowMs * 0.008);
    ctx.strokeStyle = `rgba(34, 211, 238, ${glow})`;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-11, -3);
    ctx.lineTo(-4, 4);
    ctx.lineTo(10, 4);
    ctx.stroke();
  } else if (skin === "stealth") {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-13, 3, 26, 4.5);
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(4, 3.8, 4, 2.6);
  } else if (skin === "engineer") {
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(-13, 0, 26, 8);
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(-13, 2, 26, 2.2);
  } else if (skin === "royal") {
    ctx.fillStyle = "#7e22ce";
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-14, -4);
    ctx.lineTo(-22, 14);
    ctx.lineTo(-10, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (skin === "hazard") {
    ctx.fillStyle = "#facc15";
    ctx.fillRect(-13, 1, 26, 6);
    ctx.fillStyle = CARTOON_OUTLINE;
    for (let sx = -11; sx < 11; sx += 6) ctx.fillRect(sx, 1, 3, 6);
  } else if (skin === "cube_polus_parka") {
    ctx.fillStyle = "#0369a1";
    ctx.fillRect(-13, -1, 26, 15);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-14, -3, 28, 4.5);
  } else if (skin === "cube_airship_admiral") {
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(-13, -1, 26, 15);
    ctx.fillStyle = "#facc15";
    ctx.fillRect(-14, -1, 7, 3.5);
    ctx.fillRect(-13, 6, 26, 2.5);
  } else if (skin === "cube_cosmic_knight") {
    ctx.fillStyle = "#4c1d95";
    ctx.fillRect(-13, -1, 26, 15);
    ctx.fillStyle = "#e879f9";
    ctx.fillRect(-2, 0, 4, 13);
  }
  ctx.restore();
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colorId: string,
  hatId: string,
  facing = 1,
  alive = true,
  isGhost = false,
  alpha = 1,
  shielded = false,
  nowMs = 0,
  petId?: string,
  skin = "standard",
  petOverride?: { x: number; y: number },
  visorId = "none"
): void {
  const isTopPet = petId === "mini_crew_top";

  // Layer 1: Ground / Rear Pet (drawn behind character when not mounted on top)
  if (petId && petId !== "none" && !isTopPet && alive && !isGhost) {
    drawPet(
      ctx,
      petOverride ? petOverride.x : x - facing * 26,
      petOverride ? petOverride.y : y + 12,
      petId,
      colorId,
      facing,
      false,
      nowMs
    );
  }

  const cDef = PLAYER_COLORS.find((c) => c.id === colorId) || PLAYER_COLORS[0];
  const ghostBob = isGhost ? Math.sin(nowMs * 0.0045) * 4.5 : 0;
  ctx.save();
  ctx.translate(x, y + ghostBob);
  ctx.globalAlpha = isGhost ? 0.44 * alpha : alpha;

  if (shielded && alive) {
    ctx.strokeStyle = "rgba(56, 189, 248, 0.85)";
    ctx.fillStyle = "rgba(56, 189, 248, 0.16)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -4, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Dead Body Lower Suit + Protruding Cartoon Bone
  if (!alive && !isGhost) {
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.beginPath();
    ctx.ellipse(0, 17, 19, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = cDef.dark;
    ctx.strokeStyle = CARTOON_OUTLINE;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.roundRect(-18, -3, 34, 21, 9);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = cDef.hex;
    ctx.beginPath();
    ctx.roundRect(-17, -2, 32, 14, 7);
    ctx.fill();

    ctx.fillStyle = "#991b1b";
    ctx.strokeStyle = CARTOON_OUTLINE;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(0, -2, 15, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.roundRect(-3.5, -17, 7, 15, 2.5);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-3.5, -17, 4.4, 0, Math.PI * 2);
    ctx.arc(3.5, -17, 4.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return;
  }

  ctx.scale(facing, 1);

  // Layer 1b: Ground Shadow
  if (!isGhost) {
    ctx.fillStyle = "rgba(0,0,0,0.46)";
    ctx.beginPath();
    ctx.ellipse(0, 22, 17.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = CARTOON_OUTLINE;
  ctx.lineWidth = 3.4;
  ctx.lineJoin = "round";

  // Layer 2: Backpack (2-tone cel shaded)
  ctx.fillStyle = cDef.dark;
  ctx.beginPath();
  ctx.roundRect(-21, -8, 10, 22, 5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = cDef.hex;
  ctx.beginPath();
  ctx.roundRect(-19.5, -6.5, 7, 11, 3.5);
  ctx.fill();

  // Layer 3: Main Body Capsule (dark cel shade + primary fill + bold cartoon outline)
  if (isGhost) {
    ctx.fillStyle = cDef.dark;
    ctx.beginPath();
    ctx.moveTo(-14, 8);
    ctx.lineTo(-14, -8);
    ctx.arc(0, -8, 14, Math.PI, 0);
    ctx.lineTo(14, 11);
    ctx.quadraticCurveTo(6, 20, -4, 15);
    ctx.quadraticCurveTo(-11, 19, -14, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = cDef.hex;
    ctx.beginPath();
    ctx.arc(0, -8, 12.2, Math.PI, 0);
    ctx.lineTo(12.2, 7);
    ctx.quadraticCurveTo(2, 11, -12.2, 6);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = cDef.dark;
    ctx.beginPath();
    ctx.roundRect(-14, -22, 28, 36, 14);
    ctx.fill();

    ctx.fillStyle = cDef.hex;
    ctx.beginPath();
    ctx.roundRect(-12.5, -20.5, 25, 27, 12);
    ctx.fill();

    // Thick cartoon contour on body
    ctx.beginPath();
    ctx.roundRect(-14, -22, 28, 36, 14);
    ctx.stroke();

    // Cartoon Legs
    ctx.fillStyle = cDef.dark;
    ctx.beginPath();
    ctx.roundRect(-12, 10, 9.5, 11.5, 4);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(2.5, 10, 9.5, 11.5, 4);
    ctx.fill();
    ctx.stroke();
  }

  // Layer 4: Skin Outfit Overlay
  drawSkinOverlay(ctx, skin, nowMs);

  // Layer 5: Visor Base (3-tone cartoon glass) + Visor/Face Decoration
  ctx.fillStyle = "#3f7a96";
  ctx.beginPath();
  ctx.roundRect(-2, -14.5, 18.5, 11.5, 6);
  ctx.fill();
  ctx.fillStyle = "#8fd4f5";
  ctx.beginPath();
  ctx.roundRect(0, -13.5, 15.5, 8.2, 4.5);
  ctx.fill();
  ctx.strokeStyle = CARTOON_OUTLINE;
  ctx.lineWidth = 3.1;
  ctx.beginPath();
  ctx.roundRect(-2, -14.5, 18.5, 11.5, 6);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(8.5, -11, 5.2, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  if (visorId && visorId !== "none") {
    drawVisorDecor(ctx, visorId, nowMs);
  }

  // Layer 6: Hat / Headgear
  if (hatId && hatId !== "none") {
    drawHat(ctx, hatId, cDef.hex, nowMs);
  }

  // Layer 7: Head-mounted Foreground Pet
  if (isTopPet && alive && !isGhost) {
    drawPet(ctx, 0, -28, petId, colorId, 1, false, nowMs);
  }

  ctx.restore();
}

export function drawKillCutInCanvas(
  canvas: HTMLCanvasElement,
  data: KillCutInData,
  progress01: number,
  nowMs: number
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Dramatic Red & Dark Comic Backdrop
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 30, w * 0.5, h * 0.5, w * 0.65);
  bg.addColorStop(0, "#7f1d1d");
  bg.addColorStop(0.55, "#1f070e");
  bg.addColorStop(1, "#03050a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // High-speed crimson/white action speedlines (Reference Image #14)
  ctx.save();
  for (let i = 0; i < 34; i++) {
    const sy = ((i * 29 + Math.floor(nowMs * 0.65)) % (h + 40)) - 20;
    const len = 140 + ((i * 67) % 320);
    const sx = ((i * 193 - nowMs * 1.4) % (w + len)) - len * 0.2;
    ctx.strokeStyle = i % 3 === 0 ? "rgba(255, 255, 255, 0.72)" : "rgba(244, 63, 94, 0.65)";
    ctx.lineWidth = i % 3 === 0 ? 3 : 5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + len, sy - 22);
    ctx.stroke();
  }
  ctx.restore();

  // Horizontal crimson highlight band
  ctx.fillStyle = "rgba(220, 38, 38, 0.36)";
  ctx.fillRect(0, h * 0.28, w, h * 0.44);

  const strikePhase = Math.min(1, progress01 * 2.4);
  const shakeX = progress01 > 0.25 && progress01 < 0.65 ? Math.sin(nowMs * 0.09) * 8 : 0;

  // Victim on left
  ctx.save();
  ctx.translate(w * 0.34 + shakeX, h * 0.58);
  ctx.scale(2.55, 2.55);
  drawPlayer(
    ctx,
    0,
    0,
    data.victimColor,
    data.victimHat,
    1,
    true,
    false,
    1,
    false,
    nowMs,
    "none",
    data.victimSkin,
    undefined,
    data.victimVisor
  );
  ctx.restore();

  // Sweat / Shock marks above victim
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = CARTOON_OUTLINE;
  ctx.lineWidth = 3;
  ctx.font = '900 22px "Orbitron", sans-serif';
  ctx.fillText("!!", w * 0.26, h * 0.32);
  ctx.restore();

  // Attacking Impostor lunging from right
  const impX = w * (0.82 - strikePhase * 0.27);
  ctx.save();
  ctx.translate(impX, h * 0.57);
  ctx.scale(2.65, 2.65);
  drawPlayer(
    ctx,
    0,
    0,
    data.killerColor,
    data.killerHat,
    -1,
    true,
    false,
    1,
    false,
    nowMs,
    "none",
    data.killerSkin,
    undefined,
    data.killerVisor
  );
  ctx.restore();

  // Weapon Slash / Attack Animation
  ctx.save();
  ctx.strokeStyle = CARTOON_OUTLINE;
  ctx.lineWidth = 4;
  if (data.weaponKind === "tongue") {
    ctx.fillStyle = "#e11d48";
    ctx.beginPath();
    ctx.moveTo(impX - 24, h * 0.52);
    ctx.lineTo(w * (0.52 - strikePhase * 0.16), h * 0.54);
    ctx.lineTo(impX - 20, h * 0.59);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (data.weaponKind === "gun") {
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.roundRect(impX - 88, h * 0.52, 46, 16, 4);
    ctx.fill();
    ctx.stroke();
    if (strikePhase > 0.45) {
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(impX - 96, h * 0.58, 16, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Classic Knife Slash
    ctx.save();
    ctx.translate(impX - 58, h * 0.53);
    ctx.rotate(-0.6 + strikePhase * 1.1);
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-42, -16);
    ctx.lineTo(-22, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Diagonal comic slash flash on impact
  if (progress01 > 0.22 && progress01 < 0.78) {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(w * 0.22, h * 0.72);
    ctx.lineTo(w * 0.56, h * 0.28);
    ctx.stroke();
  }
  ctx.restore();
}


/**
 * IntegratedTaskAnchor: 10種建築一体型タスク計器スプライト（丸シンボル廃止・壁配線/コンソール/培養槽等へ完全融合）
 */
export function drawTaskFixture(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fixtureType: IntegratedFixtureType,
  taskName: string,
  isNearby: boolean,
  isMyAssigned: boolean,
  nowMs: number
): void {
  const pulse = 0.5 + 0.5 * Math.sin(nowMs * 0.007);
  const fastBlink = 0.5 + 0.5 * Math.sin(nowMs * 0.015);
  ctx.save();
  ctx.translate(x, y);

  // Subtle floor mounting plate & conduit wiring connecting fixture into the ship hull
  ctx.fillStyle = "rgba(2, 6, 23, 0.55)";
  ctx.beginPath();
  ctx.roundRect(-26, -22, 52, 44, 9);
  ctx.fill();
  ctx.strokeStyle = isNearby
    ? `rgba(52, 211, 153, ${0.8 + 0.2 * fastBlink})`
    : isMyAssigned
      ? `rgba(56, 189, 248, ${0.42 + 0.28 * pulse})`
      : "rgba(100, 116, 139, 0.35)";
  ctx.lineWidth = isNearby ? 2.6 : 1.5;
  ctx.stroke();

  // Floor soft glow (only highlights strongly if assigned or nearby)
  if (isNearby || isMyAssigned) {
    const aura = ctx.createRadialGradient(0, 0, 8, 0, 0, isNearby ? 42 + pulse * 6 : 30);
    aura.addColorStop(
      0,
      isNearby ? `rgba(52, 211, 153, ${0.34 + 0.18 * pulse})` : `rgba(56, 189, 248, ${0.14 + 0.09 * pulse})`
    );
    aura.addColorStop(1, "rgba(56, 189, 248, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, isNearby ? 42 + pulse * 6 : 30, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw integrated hardware shape per fixtureType
  switch (fixtureType) {
    case "panel_box":
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-16, -14, 32, 28);
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(-12, -9, 6, 4);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(-12, -2, 6, 4);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(-12, 5, 6, 4);
      ctx.strokeStyle = isNearby ? "#34d399" : "#fbbf24";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-6, -7);
      ctx.lineTo(12, 7);
      ctx.moveTo(-6, 0);
      ctx.lineTo(12, -5);
      ctx.stroke();
      break;

    case "console_screen":
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-16, -13, 32, 20);
      ctx.fillStyle = isMyAssigned ? "#0891b2" : "#1e293b";
      ctx.fillRect(-13, -10, 26, 14);
      ctx.fillStyle = "#a7f3d0";
      ctx.fillRect(-10, -6, 14, 2);
      ctx.fillRect(-10, -2, 18, 2);
      ctx.fillStyle = "#475569";
      ctx.fillRect(-14, 9, 28, 5);
      break;

    case "bio_vat":
      for (const vx of [-9, 0, 9]) {
        ctx.fillStyle = isMyAssigned ? "rgba(52, 211, 153, 0.45)" : "rgba(45, 212, 191, 0.22)";
        ctx.strokeStyle = isNearby ? "#6ee7b7" : "#2dd4bf";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.roundRect(vx - 3.5, -12, 7, 24, 3);
        ctx.fill();
        ctx.stroke();
      }
      break;

    case "valve_pipe":
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-22, 0);
      ctx.lineTo(22, 0);
      ctx.stroke();
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = isNearby ? "#34d399" : "#f59e0b";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(8, 0);
      ctx.moveTo(0, -8);
      ctx.lineTo(0, 8);
      ctx.stroke();
      break;

    case "reactor_core":
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isMyAssigned ? `rgba(56, 189, 248, ${0.55 + 0.45 * pulse})` : "#475569";
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, 0, 10, nowMs * 0.003, nowMs * 0.003 + Math.PI * 1.3);
      ctx.stroke();
      ctx.fillStyle = isNearby ? "#34d399" : "#38bdf8";
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "radar_dish":
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(nowMs * 0.004) * 12, Math.sin(nowMs * 0.004) * 12);
      ctx.stroke();
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.arc(5, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "cargo_rack":
      ctx.fillStyle = "#78350f";
      ctx.fillRect(-16, -12, 32, 24);
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 1.6;
      ctx.strokeRect(-16, -12, 32, 24);
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(-10, -6, 20, 4);
      ctx.fillRect(-10, 2, 14, 4);
      break;

    case "holo_table":
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(-17, -13, 34, 26, 6);
      ctx.fill();
      ctx.strokeStyle = isNearby ? "#34d399" : "#a855f7";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = `rgba(192, 132, 252, ${0.35 + 0.3 * pulse})`;
      ctx.fillRect(-11, -7, 22, 14);
      break;

    case "turret_mount":
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fb7185";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(13, -6);
      ctx.stroke();
      break;

    case "chute_hatch":
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-15, -13, 30, 26);
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2;
      ctx.strokeRect(-15, -13, 30, 26);
      ctx.fillStyle = "#020617";
      ctx.fillRect(-10, -7, 20, 14);
      break;
  }

  // Corner status LED
  ctx.fillStyle = isMyAssigned
    ? isNearby
      ? fastBlink > 0.5
        ? "#34d399"
        : "#38bdf8"
      : pulse > 0.5
        ? "#fde047"
        : "#f59e0b"
    : "#475569";
  ctx.beginPath();
  ctx.arc(17, -15, isNearby ? 3.5 : 2.6, 0, Math.PI * 2);
  ctx.fill();

  if (isNearby) {
    ctx.font = '900 10px "Noto Sans JP", sans-serif';
    ctx.textAlign = "center";
    ctx.fillStyle = "#a7f3d0";
    ctx.fillText(`[E] ${taskName}`, 0, -27);
  }
  ctx.restore();
}

function getFloorBounds(mapDef: MapDef, floor: number) {
  let minX = 2000;
  let minY = 1300;
  let maxX = 0;
  let maxY = 0;
  const rects = [
    ...mapDef.rooms.filter((r) => (r.floor || 1) === floor),
    ...mapDef.corridors.filter((c) => (c.floor || 1) === floor),
  ];
  for (const r of rects) {
    minX = Math.min(minX, r.x);
    minY = Math.min(minY, r.y);
    maxX = Math.max(maxX, r.x + r.w);
    maxY = Math.max(maxY, r.y + r.h);
  }
  if (rects.length === 0) {
    return { minX: 120, minY: 120, maxX: 1920, maxY: 1200, cx: 1020, cy: 660 };
  }
  return { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
}

function drawExteriorDetails(ctx: CanvasRenderingContext2D, mapDef: MapDef, floor: number) {
  const b = getFloorBounds(mapDef, floor);
  const theme = mapDef.exteriorTheme || "space";
  ctx.save();
  if (theme === "space" || theme === "moon" || theme === "cyber" || theme === "clouds") {
    const panels = [
      { x: Math.max(24, b.minX - 108), y: b.cy - 250, w: 84, h: 170 },
      { x: Math.max(24, b.minX - 108), y: b.cy + 80, w: 84, h: 170 },
      { x: Math.min(1980, b.maxX + 24), y: b.cy - 250, w: 84, h: 170 },
      { x: Math.min(1980, b.maxX + 24), y: b.cy + 80, w: 84, h: 170 },
    ];
    for (const p of panels) {
      ctx.fillStyle = "#0c4a6e";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, 6);
      ctx.fill();
      ctx.stroke();
    }
  } else {
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2;
      const ox = b.cx + Math.cos(ang) * ((b.maxX - b.minX) * 0.56 + 68);
      const oy = b.cy + Math.sin(ang) * ((b.maxY - b.minY) * 0.56 + 58);
      if (ox < 24 || ox > 2056 || oy < 24 || oy > 1316) continue;
      ctx.fillStyle =
        theme === "snow"
          ? "rgba(186, 230, 253, 0.22)"
          : theme === "lava"
            ? "rgba(234, 88, 12, 0.28)"
            : theme === "crystal"
              ? "rgba(45, 212, 191, 0.24)"
              : theme === "jungle"
                ? "rgba(34, 197, 94, 0.22)"
                : "rgba(56, 189, 248, 0.18)";
      ctx.beginPath();
      ctx.ellipse(ox, oy, 36, 22, ang, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawRoomFloorPattern(
  ctx: CanvasRenderingContext2D,
  r: MapDef["rooms"][number]
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.w, r.h);
  ctx.clip();
  ctx.fillStyle = r.color;
  ctx.fillRect(r.x, r.y, r.w, r.h);

  const style = r.floorStyle || "metal";
  ctx.strokeStyle =
    style === "cyber"
      ? "rgba(232, 121, 249, 0.12)"
      : style === "lab"
        ? "rgba(56, 189, 248, 0.1)"
        : "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  const step = style === "lab" ? 36 : 48;
  for (let x = r.x; x < r.x + r.w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, r.y);
    ctx.lineTo(x, r.y + r.h);
    ctx.stroke();
  }
  for (let y = r.y; y < r.y + r.h; y += step) {
    ctx.beginPath();
    ctx.moveTo(r.x, y);
    ctx.lineTo(r.x + r.w, y);
    ctx.stroke();
  }
  ctx.restore();
}

function getBakedMapCanvas(mapDef: MapDef, floor: number, staticSegs: { x1: number; y1: number; x2: number; y2: number }[]) {
  if (typeof document === "undefined") return null;
  const key = `${mapDef.id}_f${floor}_v3`;
  const cached = mapBakeCache.get(key);
  if (cached) return cached;

  const off = document.createElement("canvas");
  off.width = 2080;
  off.height = 1340;
  const ctx = off.getContext("2d");
  if (!ctx) return null;

  const rooms = mapDef.rooms.filter((r) => (r.floor || 1) === floor);
  const corridors = mapDef.corridors.filter((c) => (c.floor || 1) === floor);
  const vents = mapDef.vents.filter((v) => (v.floor || 1) === floor);
  const thresholds = buildMapDoorBlockers(mapDef).filter((d) => (d.floor || 1) === floor);

  drawExteriorDetails(ctx, mapDef, floor);

  // Outer wall shadow + body thickness using exact miter joins matching collision rectangles
  ctx.lineJoin = "miter";
  ctx.miterLimit = 4;
  ctx.strokeStyle = "#030610";
  ctx.lineWidth = 34;
  for (const c of corridors) ctx.strokeRect(c.x, c.y, c.w, c.h);
  for (const r of rooms) ctx.strokeRect(r.x, r.y, r.w, r.h);

  ctx.strokeStyle = mapDef.wallColor || "#334155";
  ctx.lineWidth = 24;
  for (const c of corridors) ctx.strokeRect(c.x, c.y, c.w, c.h);
  for (const r of rooms) ctx.strokeRect(r.x, r.y, r.w, r.h);

  // Fill walkable surfaces cleanly over interior wall strokes
  ctx.fillStyle = mapDef.corridorFill;
  for (const c of corridors) ctx.fillRect(c.x, c.y, c.w, c.h);

  for (const r of rooms) {
    drawRoomFloorPattern(ctx, r);
    ctx.font = '900 18px "Noto Sans JP", sans-serif';
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.textAlign = "center";
    ctx.fillText(r.name, r.x + r.w / 2, r.y + r.h / 2);
  }

  // Re-stamp crisp corridor seam strips so room borders never leave harsh interior grid lines across doorways
  ctx.fillStyle = mapDef.corridorFill;
  for (const c of corridors) {
    ctx.fillRect(c.x + 1, c.y + 1, Math.max(1, c.w - 2), Math.max(1, c.h - 2));
  }

  // Draw crisp metallic doorway threshold frames aligned symmetrically on both sides of openings
  for (const th of thresholds) {
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.55)";
    ctx.fillRect(th.x, th.y, th.w, th.h);
    ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(th.x + 0.5, th.y + 0.5, Math.max(1, th.w - 1), Math.max(1, th.h - 1));
    ctx.fillStyle = "#475569";
    ctx.strokeStyle = "#090d16";
    ctx.lineWidth = 2;
    if (th.w >= th.h) {
      // Horizontal doorway across vertical corridor: left/right metallic gate jambs
      ctx.fillRect(th.x - 3, th.y, 7, th.h);
      ctx.strokeRect(th.x - 3, th.y, 7, th.h);
      ctx.fillRect(th.x + th.w - 4, th.y, 7, th.h);
      ctx.strokeRect(th.x + th.w - 4, th.y, 7, th.h);
    } else {
      // Vertical doorway across horizontal corridor: top/bottom metallic gate jambs
      ctx.fillRect(th.x, th.y - 3, th.w, 7);
      ctx.strokeRect(th.x, th.y - 3, th.w, 7);
      ctx.fillRect(th.x, th.y + th.h - 4, th.w, 7);
      ctx.strokeRect(th.x, th.y + th.h - 4, th.w, 7);
    }
    ctx.restore();
  }

  // Analytic inner wall accent outline (matches exact LoS & collision corners)
  ctx.strokeStyle = mapDef.accent;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "square";
  ctx.beginPath();
  for (const s of staticSegs) {
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
  }
  ctx.stroke();

  if ((mapDef.emergency.floor || 1) === floor) {
    const em = mapDef.emergency;
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(em.x, em.y, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(em.x, em.y, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const v of vents) {
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(v.x - 20, v.y - 14, 40, 28, 5);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#090d16";
    ctx.lineWidth = 2.2;
    for (let vy = v.y - 8; vy <= v.y + 8; vy += 5) {
      ctx.beginPath();
      ctx.moveTo(v.x - 14, vy);
      ctx.lineTo(v.x + 14, vy);
      ctx.stroke();
    }
  }

  mapBakeCache.set(key, off);
  return off;
}

function drawDecorsAndObstacles(
  ctx: CanvasRenderingContext2D,
  mapDef: MapDef,
  anyCameraActive: boolean,
  nowMs: number,
  floor: number
) {
  for (const d of mapDef.decors) {
    if ((d.floor || 1) !== floor) continue;
    ctx.save();
    if (d.kind === "window") {
      ctx.fillStyle = "#020617";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(d.x, d.y, d.w, d.h, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(56, 189, 248, 0.16)";
      ctx.fillRect(d.x + 4, d.y + 4, d.w - 8, d.h - 8);
    } else if (d.kind === "med_scanner") {
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(d.x, d.y, d.w, d.h, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = `rgba(52, 211, 153, ${0.25 + 0.18 * Math.sin(nowMs * 0.005)})`;
      ctx.beginPath();
      ctx.arc(d.x + d.w / 2, d.y + d.h / 2, d.w * 0.36, 0, Math.PI * 2);
      ctx.fill();
    } else if (d.kind === "med_bed") {
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.roundRect(d.x, d.y, d.w, d.h, 7);
      ctx.fill();
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(d.x + 6, d.y + 20, d.w - 12, Math.max(8, d.h - 24));
    } else if (d.kind === "caution") {
      ctx.save();
      ctx.beginPath();
      ctx.rect(d.x, d.y, d.w, d.h);
      ctx.clip();
      ctx.fillStyle = "rgba(250, 204, 21, 0.2)";
      ctx.fillRect(d.x, d.y, d.w, d.h);
      ctx.strokeStyle = "rgba(250, 204, 21, 0.38)";
      ctx.lineWidth = 5;
      for (let sx = d.x - d.h; sx < d.x + d.w + d.h; sx += 16) {
        ctx.beginPath();
        ctx.moveTo(sx, d.y + d.h);
        ctx.lineTo(sx + d.h, d.y);
        ctx.stroke();
      }
      ctx.restore();
      ctx.strokeStyle = "rgba(250, 204, 21, 0.72)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(d.x + 0.75, d.y + 0.75, Math.max(1, d.w - 1.5), Math.max(1, d.h - 1.5));
    } else if (d.kind === "carpet") {
      ctx.fillStyle = "rgba(190, 24, 93, 0.24)";
      ctx.strokeStyle = "rgba(251, 191, 36, 0.45)";
      ctx.lineWidth = 2;
      ctx.fillRect(d.x, d.y, d.w, d.h);
      ctx.strokeRect(d.x, d.y, d.w, d.h);
    } else if (d.kind === "altar") {
      ctx.fillStyle = "#78350f";
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2;
      ctx.fillRect(d.x, d.y, d.w, d.h);
      ctx.strokeRect(d.x, d.y, d.w, d.h);
    } else if (d.kind === "server_wall") {
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.fillRect(d.x, d.y, d.w, d.h);
      ctx.strokeRect(d.x, d.y, d.w, d.h);
      for (let x = d.x + 12; x < d.x + d.w - 8; x += 18) {
        ctx.fillStyle = Math.sin(nowMs * 0.005 + x) > 0 ? "#22d3ee" : "#e879f9";
        ctx.fillRect(x, d.y + 5, 6, 5);
      }
    } else if (d.kind === "camera_prop") {
      const cx = d.x + d.w / 2;
      const cy = d.y + d.h / 2;
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = anyCameraActive && Math.floor(nowMs / 350) % 2 === 0 ? "#ef4444" : "#334155";
      ctx.beginPath();
      ctx.arc(cx + 3, cy - 2, 3.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#334155";
      ctx.fillRect(d.x, d.y, d.w, d.h);
    }
    ctx.restore();
  }

  for (const obs of mapDef.obstacles) {
    if ((obs.floor || 1) !== floor) continue;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.48)";
    if (obs.kind === "table_round" || obs.kind === "tank") {
      const cx = obs.x + obs.w / 2;
      const cy = obs.y + obs.h / 2;
      const rad = obs.w / 2;
      ctx.beginPath();
      ctx.arc(cx + 3, cy + 5, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = obs.kind === "tank" ? "#0f172a" : "#475569";
      ctx.strokeStyle = obs.kind === "tank" ? "#2dd4bf" : "#0f172a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(obs.x + 3, obs.y + 5, obs.w, obs.h);
      ctx.fillStyle =
        obs.kind === "crate"
          ? "#6b4c35"
          : obs.kind === "reactor"
            ? "#1e293b"
            : obs.kind === "server"
              ? "#0f172a"
              : "#334155";
      ctx.strokeStyle = obs.kind === "console" ? "#38bdf8" : "#0f172a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 8);
      ctx.fill();
      ctx.stroke();
      if (obs.kind === "reactor") {
        const p = 0.55 + 0.35 * Math.sin(nowMs * 0.006);
        ctx.fillStyle = `rgba(56, 189, 248, ${p})`;
        ctx.beginPath();
        ctx.arc(obs.x + obs.w / 2, obs.y + obs.h / 2, Math.min(obs.w, obs.h) * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}

function drawGimmickNode(
  ctx: CanvasRenderingContext2D,
  g: GimmickNode,
  ringColor: string,
  nowMs: number
) {
  const pulse = 0.7 + 0.3 * Math.sin(nowMs * 0.006);
  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(g.x, g.y, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (g.type === "stairs" || g.type === "teleport") {
    ctx.strokeStyle = `rgba(56, 189, 248, ${pulse * 0.55})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(g.x, g.y, 31, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.font = "18px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(g.icon || "✨", g.x, g.y + 6);
  ctx.font = 'bold 11px "Noto Sans JP", sans-serif';
  ctx.fillStyle = "#e0f2fe";
  ctx.fillText(g.label, g.x, g.y + 40);
}

function drawGimmicksAndDoors(
  ctx: CanvasRenderingContext2D,
  mapDef: MapDef,
  doorBlockers: { x: number; y: number; w: number; h: number; floor?: number }[],
  steamActive: boolean,
  nowMs: number,
  floor: number,
  matchElapsedSec: number
) {
  for (const g of mapDef.gimmicks) {
    if ((g.floor || 1) !== floor) continue;
    ctx.save();
    if (g.type === "ice" && g.w && g.h) {
      ctx.fillStyle = "rgba(186, 230, 253, 0.22)";
      ctx.strokeStyle = "rgba(186, 230, 253, 0.72)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(g.x, g.y, g.w, g.h, 14);
      ctx.fill();
      ctx.stroke();
    } else if ((g.type === "wind" || g.type === "conveyor") && g.w && g.h) {
      ctx.fillStyle = g.type === "conveyor" ? "rgba(249, 115, 22, 0.16)" : "rgba(56, 189, 248, 0.16)";
      ctx.strokeStyle = g.type === "conveyor" ? "#fb923c" : "#38bdf8";
      ctx.lineWidth = 2;
      ctx.strokeRect(g.x, g.y, g.w, g.h);
      ctx.fillRect(g.x, g.y, g.w, g.h);
    } else if ((g.type === "hide_canopy" || g.type === "cloak_pad") && g.w && g.h) {
      ctx.fillStyle = g.type === "hide_canopy" ? "rgba(34, 197, 94, 0.26)" : "rgba(168, 85, 247, 0.24)";
      ctx.strokeStyle = g.type === "hide_canopy" ? "#4ade80" : "#c084fc";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(g.x, g.y, g.w, g.h, 18);
      ctx.fill();
      ctx.stroke();
    } else if (g.type === "laser_gate" && g.w && g.h) {
      const laserOn = Math.floor(matchElapsedSec / 6) % 2 === 1;
      ctx.fillStyle = laserOn ? "rgba(244, 63, 94, 0.36)" : "rgba(100, 116, 139, 0.15)";
      ctx.fillRect(g.x, g.y, g.w, g.h);
      ctx.strokeStyle = laserOn ? "#fb7185" : "#475569";
      ctx.lineWidth = laserOn ? 3 : 1;
      ctx.strokeRect(g.x, g.y, g.w, g.h);
    } else if (g.type === "decontam_chamber") {
      drawGimmickNode(ctx, g, "#2dd4bf", nowMs);
    } else if (g.type === "gravity_well") {
      drawGimmickNode(ctx, g, "#eab308", nowMs);
    } else {
      drawGimmickNode(ctx, g, g.type === "teleport" ? "#c084fc" : "#38bdf8", nowMs);
    }
    ctx.restore();
  }

  for (const d of doorBlockers) {
    if ((d.floor || 1) !== floor) continue;
    ctx.save();
    ctx.fillStyle = "#334155";
    ctx.strokeStyle = "#090d16";
    ctx.lineWidth = 3;
    ctx.fillRect(d.x, d.y, d.w, d.h);
    ctx.strokeRect(d.x, d.y, d.w, d.h);
    ctx.fillStyle = "rgba(225, 29, 72, 0.78)";
    ctx.fillRect(d.x + 2, d.y + 2, Math.max(2, d.w - 4), Math.max(2, d.h - 4));
    ctx.strokeStyle = "#fda4af";
    ctx.lineWidth = 1.5;
    if (d.w >= d.h) {
      ctx.beginPath();
      ctx.moveTo(d.x + 4, d.y + d.h / 2);
      ctx.lineTo(d.x + d.w - 4, d.y + d.h / 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(d.x + d.w / 2, d.y + 4);
      ctx.lineTo(d.x + d.w / 2, d.y + d.h - 4);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (steamActive) {
    ctx.save();
    ctx.fillStyle = "rgba(226, 232, 240, 0.14)";
    ctx.fillRect(0, 0, 2080, 1340);
    ctx.restore();
  }
}

export function renderGameCanvas(params: {
  canvas: HTMLCanvasElement;
  mapDef: MapDef;
  me: PlayerState;
  cameraTarget: { x: number; y: number };
  players: Record<string, PlayerState>;
  bodies: DeadBody[];
  sabotage: SabotageState | null;
  visionRadius: number;
  myTasks: string[];
  completedTasks: Record<string, boolean>;
  showNavArrows: boolean;
  footprints: { x: number; y: number; color: string; floor: number; age: number }[];
  radarTarget: { x: number; y: number } | null;
  teleporterPad: { x: number; y: number; floor: number } | null;
  killBursts: { x: number; y: number; effectId: string; colorHex: string; startedAt: number; durationMs: number }[];
  cameraWatchFloor: number | null;
  cameraFeedPos: { x: number; y: number } | null;
  anyCameraActive: boolean;
  doorBlockers: DoorBlockerRect[];
  steamActive: boolean;
  matchElapsedSec: number;
  trackerTargetId: string | null;
  tutorialStep?: number | null;
  viewFloorOverride?: number | null;
  cameraZoom?: number;
  nowMs: number;
}) {
  const {
    canvas,
    mapDef,
    me,
    cameraTarget,
    players,
    bodies,
    sabotage,
    visionRadius,
    myTasks,
    completedTasks,
    showNavArrows,
    footprints,
    radarTarget,
    teleporterPad,
    killBursts,
    cameraWatchFloor,
    cameraFeedPos,
    anyCameraActive,
    doorBlockers,
    steamActive,
    matchElapsedSec,
    trackerTargetId,
    tutorialStep,
    viewFloorOverride,
    cameraZoom = 1,
    nowMs,
  } = params;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(2.5, Math.max(1, window.devicePixelRatio || 1));
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(canvas.clientWidth || rect.width || 1));
  const h = Math.max(1, Math.round(canvas.clientHeight || rect.height || 1));
  const targetBw = Math.max(1, Math.round(w * dpr));
  const targetBh = Math.max(1, Math.round(h * dpr));
  if (canvas.width !== targetBw || canvas.height !== targetBh) {
    canvas.width = targetBw;
    canvas.height = targetBh;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const viewFloor = cameraWatchFloor || viewFloorOverride || me.floor || 1;
  const safeCam = sanitizeCameraPos(cameraFeedPos || cameraTarget, { x: me.x, y: me.y }, mapDef);
  const camX = safeCam.x;
  const camY = safeCam.y;
  const zoom = Number.isFinite(cameraZoom) && cameraZoom > 0 ? cameraZoom : 1;

  // Starfield space backdrop
  ctx.fillStyle = mapDef.bg || "#03060f";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 60; i++) {
    const sx = ((i * 173 - camX * 0.14) % w + w) % w;
    const sy = ((i * 97 - camY * 0.14) % h + h) % h;
    ctx.fillStyle = i % 5 === 0 ? mapDef.accent : "rgba(226, 232, 240, 0.5)";
    ctx.fillRect(sx, sy, 2, 2);
  }

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-camX, -camY);

  const staticSegs = buildWallSegments(mapDef, viewFloor);
  const activeSegs = doorBlockers.length > 0 ? buildWallSegments(mapDef, viewFloor, doorBlockers) : staticSegs;
  const baked = getBakedMapCanvas(mapDef, viewFloor, staticSegs);
  if (baked) ctx.drawImage(baked, 0, 0);

  drawDecorsAndObstacles(ctx, mapDef, anyCameraActive, nowMs, viewFloor);
  drawGimmicksAndDoors(ctx, mapDef, doorBlockers, steamActive, nowMs, viewFloor, matchElapsedSec);

  // Strict Line-of-Sight observer: alive player normally, or camera feed lens when watching security cams.
  // Ghosts & spectators receive full unobstructed floor sight.
  const isUnrestrictedViewer = !me.alive || !!me.isSpectator;
  const sightObserver: { x: number; y: number } | null =
    cameraWatchFloor && cameraFeedPos
      ? cameraFeedPos
      : !isUnrestrictedViewer
        ? { x: me.x, y: me.y }
        : null;
  const sightRadius = cameraWatchFloor && cameraFeedPos ? 410 : visionRadius;

  // Integrated Task Fixtures
  for (const spot of mapDef.taskSpots) {
    if ((spot.floor || 1) !== viewFloor) continue;
    const tDef = getTaskById(spot.taskId);
    const isMyAssigned = myTasks.includes(spot.taskId) && !completedTasks[spot.taskId];
    const isNearby = isMyAssigned && !cameraWatchFloor && Math.hypot(spot.x - me.x, spot.y - me.y) <= 78;
    drawTaskFixture(ctx, spot.x, spot.y, tDef.fixtureType, tDef.name, isNearby, isMyAssigned, nowMs);
  }

  // Sabotage Fix Spots
  if (sabotage && sabotage.type !== "doors") {
    const pt = mapDef.sabotageFix[sabotage.type];
    if (pt && (pt.floor || 1) === viewFloor) {
      const p = 0.6 + 0.4 * Math.sin(nowMs * 0.015);
      ctx.save();
      ctx.strokeStyle = `rgba(244, 63, 94, ${p})`;
      ctx.fillStyle = "rgba(244, 63, 94, 0.25)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 28 + p * 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.font = '900 11px "Noto Sans JP", sans-serif';
      ctx.fillStyle = "#fecdd3";
      ctx.textAlign = "center";
      ctx.fillText("🔧 修理 [E]", pt.x, pt.y - 36);
      ctx.restore();
    }
  }

  // Footprints (Detective) - occluded behind walls / out of vision
  for (const fp of footprints) {
    if (fp.floor !== viewFloor) continue;
    if (sightObserver && !isEntityVisible(sightObserver.x, sightObserver.y, fp.x, fp.y, sightRadius + 10, activeSegs, 4)) {
      continue;
    }
    ctx.fillStyle = fp.color;
    ctx.globalAlpha = Math.max(0.1, 0.7 - fp.age * 0.04);
    ctx.beginPath();
    ctx.arc(fp.x, fp.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Teleporter Pad
  if (teleporterPad && teleporterPad.floor === viewFloor) {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(teleporterPad.x, teleporterPad.y, 20, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Dead Bodies - strictly occluded behind walls / outside vision radius
  for (const b of bodies) {
    if ((b.floor || 1) !== viewFloor) continue;
    if (sightObserver && !isEntityVisible(sightObserver.x, sightObserver.y, b.x, b.y, sightRadius + 16, activeSegs, 14)) {
      continue;
    }
    drawPlayer(ctx, b.x, b.y, b.color, "none", 1, false, false, 1, false, nowMs);
    if (tutorialStep === 3) {
      ctx.strokeStyle = "#fb923c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 34, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Players sorted by Y - strictly occluded by walls/closed doors/visionRadius for non-ghosts & cameras
  const activePlayers = Object.values(players)
    .filter((p) => !p.isSpectator && (p.floor || 1) === viewFloor && !p.inVent)
    .sort((a, b) => a.y - b.y);

  for (const p of activePlayers) {
    if (!p.alive && me.alive && !me.isSpectator) continue;
    if (p.invisible && p.id !== me.id && !(isImpostorRole(me.role) && isImpostorRole(p.role))) {
      continue;
    }
    if (
      sightObserver &&
      (cameraWatchFloor || p.id !== me.id) &&
      !isEntityVisible(sightObserver.x, sightObserver.y, p.x, p.y, sightRadius + 14, activeSegs, 12)
    ) {
      continue;
    }

    const visualColor = p.disguisedAs ? p.disguisedAs.color : p.color;
    const visualHat = p.disguisedAs ? p.disguisedAs.hat : p.hat;
    const visualVisor = p.disguisedAs ? "none" : (p.visor || "none");
    const visualName = p.disguisedAs ? p.disguisedAs.name : p.name;
    const cloakAlpha = p.cloakZone && p.id !== me.id ? 0.25 : p.invisible ? 0.42 : 1;

    drawPlayer(
      ctx,
      p.x,
      p.y,
      visualColor,
      visualHat,
      p.facing,
      p.alive,
      !p.alive,
      cloakAlpha,
      p.shielded,
      nowMs,
      p.pet,
      p.skin,
      typeof p.petX === "number" && typeof p.petY === "number" ? { x: p.petX, y: p.petY } : undefined,
      visualVisor
    );

    // Nameplate
    ctx.save();
    ctx.globalAlpha = !p.alive ? cloakAlpha * 0.85 : cloakAlpha;
    ctx.font = p.id === me.id ? '900 12px "Noto Sans JP", sans-serif' : 'bold 11px "Noto Sans JP", sans-serif';
    ctx.textAlign = "center";
    const allyImp = isImpostorRole(me.role) && isImpostorRole(p.role);
    ctx.fillStyle = p.id === me.id ? "#38bdf8" : !p.alive ? "#c084fc" : allyImp ? "#f87171" : "#f8fafc";
    ctx.fillText(!p.alive ? `👻 ${visualName}` : visualName, p.x, p.y - 40);
    ctx.restore();
  }

  for (const burst of killBursts) {
    if (sightObserver && !isEntityVisible(sightObserver.x, sightObserver.y, burst.x, burst.y, sightRadius + 24, activeSegs, 16)) {
      continue;
    }
    drawKillEffectBurst(ctx, burst, nowMs);
  }

  ctx.restore();

  // Line-of-sight visibility shadow mask for alive players & security cameras
  if (sightObserver) {
    const poly = computeVisibilityPolygon(sightObserver.x, sightObserver.y, sightRadius, activeSegs);
    if (poly.length > 2) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      const tx0 = w / 2 + (poly[0].x - camX) * zoom;
      const ty0 = h / 2 + (poly[0].y - camY) * zoom;
      ctx.moveTo(tx0, ty0);
      for (let i = poly.length - 1; i >= 0; i--) {
        ctx.lineTo(w / 2 + (poly[i].x - camX) * zoom, h / 2 + (poly[i].y - camY) * zoom);
      }
      ctx.closePath();
      ctx.fillStyle =
        cameraWatchFloor
          ? "rgba(2, 6, 18, 0.86)"
          : sabotage?.type === "lights"
            ? "rgba(2, 4, 12, 0.94)"
            : "rgba(2, 6, 18, 0.76)";
      ctx.fill("evenodd");
      ctx.restore();
    }
  }

  // Camera Watch CRT scanline + REC indicator
  if (cameraWatchFloor) {
    ctx.save();
    ctx.fillStyle = "rgba(16, 185, 129, 0.06)";
    for (let y = 0; y < h; y += 6) {
      ctx.fillRect(0, y, w, 2);
    }
    ctx.strokeStyle = "rgba(52, 211, 153, 0.55)";
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, Math.max(1, w - 16), Math.max(1, h - 16));
    if (Math.floor(nowMs / 450) % 2 === 0) {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(28, 28, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = '900 12px "Orbitron", sans-serif';
    ctx.fillStyle = "#6ee7b7";
    ctx.textAlign = "left";
    ctx.fillText(`CAM REC · ${viewFloor}F`, 42, 32);
    ctx.restore();
  }

  // Ghost atmospheric vignette
  if (!me.alive && !me.isSpectator && !cameraWatchFloor) {
    ctx.save();
    ctx.strokeStyle = "rgba(168, 85, 247, 0.35)";
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, Math.max(1, w - 6), Math.max(1, h - 6));
    ctx.restore();
  }

  // Blizzard snow overlay VFX
  if (mapDef.hasBlizzard && matchElapsedSec % 32 >= 20) {
    ctx.save();
    ctx.fillStyle = "rgba(224, 242, 254, 0.14)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    for (let i = 0; i < 45; i++) {
      const sx = ((i * 89 + nowMs * 0.45) % w + w) % w;
      const sy = ((i * 53 + nowMs * 0.18) % h + h) % h;
      ctx.fillRect(sx, sy, 4, 2);
    }
    ctx.restore();
  }

  // Task / Sabotage / Radar Navigation Arrows (Works for both Alive & Ghost Crew!)
  if (showNavArrows && !cameraWatchFloor) {
    const arrowTargets: { x: number; y: number; color: string; label: string }[] = [];
    if (sabotage && sabotage.type !== "doors" && me.alive) {
      const pt = mapDef.sabotageFix[sabotage.type];
      if (pt) arrowTargets.push({ x: pt.x, y: pt.y, color: "#fb7185", label: "修理!" });
    } else if (!me.isSpectator) {
      for (const tid of myTasks) {
        if (completedTasks[tid]) continue;
        const sp = mapDef.taskSpots.find((s) => s.taskId === tid);
        if (sp) {
          const spFloor = sp.floor || 1;
          const myFloor = me.floor || 1;
          if (spFloor === myFloor) {
            arrowTargets.push({
              x: sp.x,
              y: sp.y,
              color: "#facc15",
              label: getRoomName(sp.x, sp.y, mapDef, spFloor),
            });
          } else {
            const portal = mapDef.gimmicks.find(
              (g) => (g.type === "stairs" || g.type === "teleport") && (g.floor || 1) === myFloor
            );
            if (portal) {
              arrowTargets.push({
                x: portal.x,
                y: portal.y,
                color: "#38bdf8",
                label: `${spFloor}Fへ`,
              });
            }
          }
        }
      }
    }
    if (radarTarget) arrowTargets.push({ x: radarTarget.x, y: radarTarget.y, color: "#22d3ee", label: "📡探知" });
    if (trackerTargetId && players[trackerTargetId]?.alive) {
      const tp = players[trackerTargetId];
      arrowTargets.push({ x: tp.x, y: tp.y, color: "#2dd4bf", label: `🛰️${tp.name}` });
    }

    for (const tgt of arrowTargets.slice(0, 4)) {
      const dx = tgt.x - me.x;
      const dy = tgt.y - me.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 110) continue;
      const ang = Math.atan2(dy, dx);
      const r = Math.min(w, h) * 0.34;
      const ax = w / 2 + Math.cos(ang) * r;
      const ay = h / 2 + Math.sin(ang) * r;

      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate(ang);
      ctx.fillStyle = tgt.color;
      ctx.strokeStyle = "#090d16";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-8, -9);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-8, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.rotate(-ang);
      ctx.font = 'bold 10px "Noto Sans JP", sans-serif';
      ctx.textAlign = "center";
      ctx.fillStyle = tgt.color;
      ctx.fillText(tgt.label, 0, -14);
      ctx.restore();
    }
  }
}

export function renderMinimap(params: {
  canvas: HTMLCanvasElement;
  mapDef: MapDef;
  me: PlayerState;
  players: Record<string, PlayerState>;
  myTasks: string[];
  completedTasks: Record<string, boolean>;
  sabotage: SabotageState | null;
  floorView?: number;
  trackerTargetId?: string | null;
  nowMs?: number;
}) {
  const { canvas, mapDef, me, players, myTasks, completedTasks, sabotage, floorView, trackerTargetId } = params;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const LOGICAL_W = 860;
  const LOGICAL_H = 540;
  const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  const bw = Math.round(LOGICAL_W * dpr);
  const bh = Math.round(LOGICAL_H * dpr);
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const w = LOGICAL_W;
  const h = LOGICAL_H;
  const sx = w / 2080;
  const sy = h / 1340;
  const f = floorView || me.floor || 1;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#040814";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = mapDef.corridorFill;
  for (const c of mapDef.corridors) {
    if ((c.floor || 1) !== f) continue;
    ctx.fillRect(c.x * sx, c.y * sy, c.w * sx, c.h * sy);
  }
  for (const r of mapDef.rooms) {
    if ((r.floor || 1) !== f) continue;
    ctx.fillStyle = r.color;
    ctx.strokeStyle = mapDef.accent;
    ctx.lineWidth = 1.5;
    ctx.fillRect(r.x * sx, r.y * sy, r.w * sx, r.h * sy);
    ctx.strokeRect(r.x * sx, r.y * sy, r.w * sx, r.h * sy);
    ctx.font = 'bold 10px "Noto Sans JP", sans-serif';
    ctx.fillStyle = "rgba(241, 245, 249, 0.8)";
    ctx.textAlign = "center";
    ctx.fillText(r.name, (r.x + r.w / 2) * sx, (r.y + r.h / 2) * sy + 3);
  }

  for (const tid of myTasks) {
    if (completedTasks[tid]) continue;
    const sp = mapDef.taskSpots.find((s) => s.taskId === tid && (s.floor || 1) === f);
    if (!sp) continue;
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(sp.x * sx, sp.y * sy, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (sabotage && sabotage.type !== "doors") {
    const pt = mapDef.sabotageFix[sabotage.type];
    if (pt && (pt.floor || 1) === f) {
      ctx.fillStyle = "#fb7185";
      ctx.beginPath();
      ctx.arc(pt.x * sx, pt.y * sy, 6.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (trackerTargetId && players[trackerTargetId]?.alive && (players[trackerTargetId].floor || 1) === f) {
    const tp = players[trackerTargetId];
    ctx.fillStyle = "#2dd4bf";
    ctx.beginPath();
    ctx.arc(tp.x * sx, tp.y * sy, 5.5, 0, Math.PI * 2);
    ctx.fill();
  }

  if ((me.floor || 1) === f) {
    const mc = PLAYER_COLORS.find((c) => c.id === me.color) || PLAYER_COLORS[0];
    ctx.fillStyle = mc.hex;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(me.x * sx, me.y * sy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

export function renderMapPreviewThumbnail(mapDef: MapDef, width = 260, height = 160): string {
  if (typeof document === "undefined") return "";
  const cacheKey = `${mapDef.id}_${width}x${height}`;
  const hit = mapThumbCache.get(cacheKey);
  if (hit) return hit;

  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const ctx = c.getContext("2d");
  if (!ctx) return "";

  const sx = width / 2080;
  const sy = height / 1340;
  ctx.fillStyle = mapDef.bg || "#030712";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = mapDef.corridorFill;
  for (const cr of mapDef.corridors) {
    if ((cr.floor || 1) !== 1) continue;
    ctx.fillRect(cr.x * sx, cr.y * sy, Math.max(2, cr.w * sx), Math.max(2, cr.h * sy));
  }
  for (const rm of mapDef.rooms) {
    ctx.fillStyle = (rm.floor || 1) === 2 ? "rgba(56, 189, 248, 0.25)" : rm.color;
    ctx.strokeStyle = mapDef.accent;
    ctx.lineWidth = 1;
    ctx.fillRect(rm.x * sx, rm.y * sy, rm.w * sx, rm.h * sy);
    ctx.strokeRect(rm.x * sx, rm.y * sy, rm.w * sx, rm.h * sy);
  }
  ctx.fillStyle = "#facc15";
  for (const sp of mapDef.taskSpots) {
    ctx.fillRect(sp.x * sx - 1.5, sp.y * sy - 1.5, 3, 3);
  }
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(mapDef.emergency.x * sx, mapDef.emergency.y * sy, 4, 0, Math.PI * 2);
  ctx.fill();

  const url = c.toDataURL("image/png");
  mapThumbCache.set(cacheKey, url);
  return url;
}

export function renderGroupLineup(params: {
  canvas: HTMLCanvasElement;
  members: { color: string; hat?: string; pet?: string; skin?: string; visor?: string; name: string; isHighlight?: boolean }[];
  glowColor: string;
}) {
  const { canvas, members, glowColor } = params;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.52);
  g.addColorStop(0, `${glowColor}40`);
  g.addColorStop(1, "rgba(2, 6, 23, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const count = Math.max(1, members.length);
  const spacing = Math.min(82, (w - 80) / count);
  const startX = w / 2 - ((count - 1) * spacing) / 2;

  members.forEach((m, i) => {
    const px = startX + i * spacing;
    const py = h * 0.58;
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(m.isHighlight ? 1.35 : 1.15, m.isHighlight ? 1.35 : 1.15);
    drawPlayer(ctx, 0, 0, m.color, m.hat || "none", 1, true, false, 1, false, 0, m.pet, m.skin, undefined, m.visor || "none");
    ctx.restore();
    ctx.font = m.isHighlight ? '900 11px "Noto Sans JP", sans-serif' : 'bold 10px "Noto Sans JP", sans-serif';
    ctx.fillStyle = m.isHighlight ? "#fde047" : "#f8fafc";
    ctx.textAlign = "center";
    ctx.fillText(m.name, px, py + 44);
  });
}

export function drawLobbyDeck(params: {
  canvas: HTMLCanvasElement;
  players: {
    id: string;
    name: string;
    color: string;
    hat: string;
    pet: string;
    skin: string;
    visor?: string;
    x: number;
    y: number;
    facing: 1 | -1;
    isMe: boolean;
    petX?: number;
    petY?: number;
  }[];
  nearTerminal: boolean;
  nowMs: number;
}) {
  const { canvas, players, nearTerminal, nowMs } = params;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const LOGICAL_W = 680;
  const LOGICAL_H = 320;
  const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  const bw = Math.round(LOGICAL_W * dpr);
  const bh = Math.round(LOGICAL_H * dpr);
  if (canvas.width !== bw || canvas.height !== bh) {
    canvas.width = bw;
    canvas.height = bh;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = LOGICAL_W;
  const h = LOGICAL_H;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#030816";
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 36; i++) {
    const sx = (i * 97 + Math.floor(nowMs * 0.015)) % w;
    const sy = (i * 53) % 44;
    ctx.fillStyle = i % 4 === 0 ? "#38bdf8" : "#e2e8f0";
    ctx.fillRect(sx, sy, 2, 2);
  }

  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(14, 38, w - 28, h - 50, 18);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
  ctx.lineWidth = 1.5;
  for (let x = 44; x < w - 24; x += 56) {
    ctx.beginPath();
    ctx.moveTo(x, 42);
    ctx.lineTo(x, h - 16);
    ctx.stroke();
  }
  for (let y = 76; y < h - 20; y += 52) {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(w - 20, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(56, 189, 248, 0.14)";
  ctx.font = '900 12px "Orbitron", sans-serif';
  ctx.textAlign = "left";
  ctx.fillText("STARSHIP DROPSHIP DECK // WASD / 矢印キーで移動可", 30, 62);

  const tx = LOBBY_CUSTOMIZE_TERMINAL.x;
  const ty = LOBBY_CUSTOMIZE_TERMINAL.y;
  const pulse = 0.65 + 0.35 * Math.sin(nowMs * 0.006);
  ctx.save();
  if (nearTerminal) {
    ctx.strokeStyle = `rgba(34, 211, 238, ${0.5 + 0.4 * pulse})`;
    ctx.fillStyle = "rgba(34, 211, 238, 0.14)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(tx, ty + 14, 58, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = "#1e293b";
  ctx.strokeStyle = nearTerminal ? "#38bdf8" : "#64748b";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(tx - 30, ty - 28, 60, 48, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#020617";
  ctx.fillRect(tx - 23, ty - 21, 46, 26);
  ctx.fillStyle = `rgba(56, 189, 248, ${0.4 + 0.35 * pulse})`;
  ctx.fillRect(tx - 19, ty - 17, 38, 18);
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🎨", tx, ty - 3);
  ctx.font = '900 10px "Noto Sans JP", sans-serif';
  ctx.fillStyle = nearTerminal ? "#7dd3fc" : "#cbd5e1";
  ctx.fillText(nearTerminal ? "カスタマイズ [E / クリック]" : "カスタマイズ端末", tx, ty + 35);
  ctx.restore();

  const sorted = [...players].sort((a, b) => a.y - b.y);
  for (const p of sorted) {
    const bobY = p.y + Math.sin(nowMs * 0.004 + p.x * 0.02) * 1.4;
    ctx.save();
    drawPlayer(
      ctx,
      p.x,
      bobY,
      p.color,
      p.hat || "none",
      p.facing,
      true,
      false,
      1,
      false,
      nowMs,
      p.pet || "none",
      p.skin || "standard",
      typeof p.petX === "number" && typeof p.petY === "number" ? { x: p.petX, y: p.petY } : undefined,
      p.visor || "none"
    );
    ctx.font = p.isMe ? '900 11px "Noto Sans JP", sans-serif' : 'bold 10px "Noto Sans JP", sans-serif';
    ctx.textAlign = "center";
    ctx.fillStyle = p.isMe ? "#38bdf8" : "#e2e8f0";
    ctx.fillText(p.isMe ? `${p.name} ★` : p.name, p.x, bobY - 36);
    ctx.restore();
  }
}
