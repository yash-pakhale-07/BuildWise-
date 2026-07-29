"use client";

import { mockAgentActivity } from "../../lib/mocks";
import { useLanguage } from "../../lib/i18n/LanguageProvider";
import { AgentInteraction } from "@buildwise/shared";
import { Bot, Send, User } from "lucide-react";
import { useState } from "react";

export default function AgentTranscriptPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<AgentInteraction[]>(mockAgentActivity);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: AgentInteraction = {
      id: `msg-${Date.now()}`,
      channel: "telegram",
      message: inputText,
      direction: "inbound",
      createdAt: new Date().toISOString(),
    };

    const replyMsg: AgentInteraction = {
      id: `msg-${Date.now() + 1}`,
      channel: "telegram",
      message: `💡 BuildWise Agent: Received query "${inputText}". Cited IEEE reference: IEEE IoT Journal (DOI: 10.1109/JIOT.2023.3298101). Target mess attendance forecasting error is sub-5%.`,
      direction: "outbound",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, replyMsg]);
    setInputText("");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-muted border border-accent/30 flex items-center justify-center text-accent">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-fg">{t("agent.title")}</h1>
            <p className="text-xs text-fg-muted">{t("agent.subtitle")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/15 border border-success/30 text-xs font-semibold text-success">
          <span className="w-2 h-2 rounded-full bg-success animate-ping" />
          <span>{t("agent.activeBadge")}</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="glass-panel flex-1 p-6 rounded-2xl overflow-y-auto space-y-4">
        {messages.map((msg: AgentInteraction) => {
          const isInbound = msg.direction === "inbound";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isInbound ? "justify-end" : "justify-start"}`}
            >
              {!isInbound && (
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-lg p-4 rounded-2xl space-y-1.5 text-xs leading-relaxed ${
                  isInbound
                    ? "bg-primary text-white rounded-tr-none shadow-sm font-medium"
                    : "glass-card text-fg rounded-tl-none border border-border"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.message}</p>
                <span className={`text-[10px] block text-right ${isInbound ? "text-white/70" : "text-fg-muted"}`}>
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString()}
                </span>
              </div>

              {isInbound && (
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Input Form */}
      <form onSubmit={handleSendMessage} className="glass-panel p-3 rounded-2xl flex items-center gap-3 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t("agent.placeholder")}
          className="flex-1 bg-bg border border-border focus:border-accent focus:ring-1 focus:ring-accent rounded-xl px-4 py-2.5 text-xs text-fg placeholder:text-fg-muted outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{t("buttons.send")}</span>
        </button>
      </form>
    </div>
  );
}
