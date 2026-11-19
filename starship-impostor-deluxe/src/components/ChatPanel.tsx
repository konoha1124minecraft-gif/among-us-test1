import React, { useEffect, useRef, useState } from "react";
import { QUICK_CHAT_CATEGORIES, STAMPS } from "../game/constants";
import type { ChatMessage } from "../game/types";

const StampBadge: React.FC<{ stampId: string; compact?: boolean }> = ({ stampId, compact = false }) => {
  const s = STAMPS.find((st) => st.id === stampId);
  if (!s) return null;
  return (
    <span
      className={`stamp-badge-pop inline-flex items-center gap-1.5 rounded-xl border px-2 py-1 font-black whitespace-nowrap ${
        compact ? "text-[10px]" : "text-xs"
      }`}
      style={{ background: s.bg, borderColor: s.accent, color: "#ffffff" }}
    >
      <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.accent }} />
      <span>{s.label}</span>
      <span className="opacity-85 font-bold">{s.caption}</span>
    </span>
  );
};

interface ChatPanelProps {
  messages: ChatMessage[];
  myAlive: boolean;
  isSpectator?: boolean;
  onSendChat: (text: string, stampId?: string) => void;
  onInputFocus?: () => void;
  placeholder?: string;
  compact?: boolean;
  showQuickAndStamps?: boolean;
  title?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  myAlive,
  isSpectator = false,
  onSendChat,
  onInputFocus,
  placeholder,
  compact = false,
  showQuickAndStamps = true,
  title,
}) => {
  const [text, setText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("location");
  const [instantSend, setInstantSend] = useState(true);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isGhostViewer = !myAlive || isSpectator;
  const visibleMessages = messages.filter((m) => !m.isGhost || isGhostViewer);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [visibleMessages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendChat(trimmed);
    setText("");
  };

  const handleQuickPhrase = (phrase: string) => {
    if (instantSend) {
      onSendChat(phrase);
    } else {
      setText((prev) => (prev ? `${prev} ${phrase}` : phrase));
      inputRef.current?.focus();
    }
  };

  const activeCategory = QUICK_CHAT_CATEGORIES.find((c) => c.id === activeTab);

  return (
    <div className="flex flex-col h-full min-h-0">
      {title && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/80 shrink-0">
          <span className="text-xs font-black text-cyan-300 tracking-wide">{title}</span>
          {isGhostViewer && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-200 border border-purple-400/40">
              👻 霊界/観戦チャンネル有効
            </span>
          )}
        </div>
      )}

      <div
        className={`flex-1 min-h-0 overflow-y-auto space-y-1.5 ${
          compact ? "p-2.5 text-xs" : "p-3 text-xs sm:text-sm"
        }`}
      >
        {visibleMessages.length === 0 ? (
          <div className="text-center text-slate-500 py-6 text-xs">まだメッセージはありません</div>
        ) : (
          visibleMessages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl px-2.5 py-1.5 break-words border ${
                msg.isSystem
                  ? "bg-cyan-950/40 border-cyan-500/35 text-cyan-200"
                  : msg.isGhost
                    ? "bg-purple-950/45 border-purple-400/40 text-purple-100"
                    : "bg-slate-900/90 border-slate-800 text-slate-100"
              }`}
            >
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-black text-[11px]" style={{ color: msg.color || "#38bdf8" }}>
                  {msg.isGhost ? `👻 ${msg.sender}` : msg.sender}
                </span>
                {msg.stampId ? (
                  <StampBadge stampId={msg.stampId} compact />
                ) : (
                  <span className="text-slate-100 leading-snug">{msg.text}</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {showQuickAndStamps && (
        <div className="px-2.5 pt-2 pb-1.5 border-t border-cyan-500/20 bg-slate-950/75 backdrop-blur-md space-y-1.5 shrink-0">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
              {QUICK_CHAT_CATEGORIES.map((cat) => {
                const active = drawerOpen && activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (drawerOpen && activeTab === cat.id) setDrawerOpen(false);
                      else {
                        setActiveTab(cat.id);
                        setDrawerOpen(true);
                      }
                    }}
                    className={`sf-btn shrink-0 px-2 py-1 rounded-lg border text-[10px] font-black whitespace-nowrap transition ${
                      active
                        ? "text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.35)]"
                        : "bg-slate-900/85 text-slate-300 border-slate-700 hover:border-cyan-400/50 hover:text-white"
                    }`}
                    style={active ? { background: cat.accent, borderColor: "#ffffff" } : undefined}
                  >
                    {cat.label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  if (drawerOpen && activeTab === "stamps") setDrawerOpen(false);
                  else {
                    setActiveTab("stamps");
                    setDrawerOpen(true);
                  }
                }}
                className={`sf-btn shrink-0 px-2 py-1 rounded-lg border text-[10px] font-black whitespace-nowrap ${
                  drawerOpen && activeTab === "stamps"
                    ? "bg-amber-400 text-slate-950 border-white"
                    : "bg-slate-900/85 text-amber-200 border-slate-700 hover:border-amber-400/60"
                }`}
              >
                ✨ スタンプ
              </button>
            </div>
            <button
              type="button"
              onClick={() => setInstantSend((v) => !v)}
              className={`sf-btn shrink-0 px-2 py-1 rounded-lg border text-[9px] font-black whitespace-nowrap ${
                instantSend
                  ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-200"
                  : "bg-purple-500/20 border-purple-400/60 text-purple-200"
              }`}
            >
              {instantSend ? "⚡即送信" : "✏️欄入力"}
            </button>
          </div>

          {drawerOpen && activeTab === "stamps" && (
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              {STAMPS.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onSendChat(`[${st.label}] ${st.caption}`, st.id)}
                  className="sf-btn flex items-center justify-center p-1.5 rounded-xl border hover:brightness-110 transition"
                  style={{ background: st.bg, borderColor: st.accent }}
                >
                  <span className="text-[10px] font-black text-white">
                    {st.label} <span className="opacity-85">{st.caption}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {drawerOpen && activeTab !== "stamps" && activeCategory && (
            <div className="grid grid-cols-2 gap-1.5 pt-0.5 max-h-[104px] overflow-y-auto pr-0.5">
              {activeCategory.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleQuickPhrase(item.text)}
                  className="sf-btn text-left px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/60 text-[10px] font-bold text-slate-100 leading-tight transition"
                >
                  {item.text}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-2.5 pt-1.5 flex gap-1.5 shrink-0 border-t border-slate-800/60">
        <input
          ref={inputRef}
          type="text"
          maxLength={120}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={onInputFocus}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder={placeholder || (isGhostViewer ? "👻 霊界・観戦チャットを送信..." : "メッセージを入力...")}
          className="flex-1 min-w-0 min-h-[38px] rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:outline-none px-3 text-xs text-white"
        />
        <button
          type="submit"
          className="sf-btn min-h-[38px] px-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shrink-0 whitespace-nowrap"
        >
          送信
        </button>
      </form>
    </div>
  );
};
