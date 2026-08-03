// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TFAM AI – Ministry Assistant (Tools + Persistent Chat)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

type ActiveTab = "tools" | "chat";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

const CHAT_STORAGE_KEY = "tfam_ai_chat_history";

const DEFAULT_WELCOME: ChatMessage = {
  role: "ai",
  content: "Hello Prophet! I am TFAM AI, your intelligent ministry assistant. Ask me anything — sermon ideas, social media posts, how to handle church situations, personal leadership advice, or any topic at all. How can I help you today?",
  timestamp: new Date().toISOString(),
};

const ALL_TOOLS = [
  { id: "sermon-outline", label: "🎙️ Sermon Outline", desc: "3-point sermon with scriptures" },
  { id: "pastoral-letter", label: "💌 Pastoral Letter", desc: "Compassionate letter for any occasion" },
  { id: "prayer-guide", label: "🙏 Prayer Guide", desc: "Structured prayer points with scriptures" },
  { id: "bulletin", label: "📢 Bulletin / Newsletter", desc: "Weekly church bulletin draft" },
  { id: "devotional-single", label: "📖 Devotional", desc: "One powerful daily devotional" },
  { id: "facebook-post", label: "📘 Facebook Post", desc: "Engaging post for Facebook page" },
  { id: "whatsapp-broadcast", label: "📱 WhatsApp Broadcast", desc: "Short message for member groups" },
  { id: "instagram-caption", label: "🎵 Instagram/TikTok Caption", desc: "Short captions with hashtags" },
  { id: "youtube-description", label: "📺 YouTube Description", desc: "Video description and tags" },
  { id: "birthday-message", label: "🎂 Birthday Message", desc: "Personalized birthday greeting" },
  { id: "anniversary-message", label: "💍 Anniversary Message", desc: "Wedding anniversary blessing" },
  { id: "follow-up-message", label: "📞 Follow-Up Message", desc: "For visitors and absent members" },
  { id: "condolence-message", label: "💔 Condolence Message", desc: "For bereaved families" },
  { id: "get-well-message", label: "🏥 Get Well Message", desc: "For sick members" },
  { id: "fasting-schedule", label: "📅 Fasting & Prayer Plan", desc: "Corporate fasting schedule" },
  { id: "bible-study", label: "🎓 Bible Study Notes", desc: "Study outline with discussion questions" },
  { id: "altar-call", label: "🎤 Altar Call Script", desc: "Powerful salvation and healing call" },
];

function getSystemPrompt(toolId: string): string {
  const base = "You are a Spirit-filled ministry assistant for The Triumphant Family church led by Prophet Olayiwole Ogunsola in Akute, Ogun State, Nigeria.";
  const prompts: Record<string, string> = {
    "sermon-outline": `${base} Generate a sermon outline with title, main scripture, 3 points (each with scripture, explanation, application), altar call and closing prayer.`,
    "pastoral-letter": `${base} Write a compassionate pastoral letter. Tone: Loving, Biblical, Fatherly. Format as a proper letter.`,
    "prayer-guide": `${base} Generate structured prayer points with scriptures. Include theme, numbered points and closing declaration.`,
    "bulletin": `${base} Write a church bulletin with welcome message, weekly highlights, upcoming events, word of encouragement and closing.`,
    "devotional-single": `${base} Generate a devotional with: TITLE, SCRIPTURE, MESSAGE (2-3 paragraphs), PRAYER point, CONFESSION/declaration.`,
    "facebook-post": `${base} Write an engaging Facebook post. Use emojis. Include church name and location. Add 3-5 relevant hashtags. Make it shareable and inviting.`,
    "whatsapp-broadcast": `${base} Write a short WhatsApp broadcast message. Keep it under 200 words. Use emojis. Include time, location and contact where relevant.`,
    "instagram-caption": `${base} Write a short Instagram/TikTok caption. Under 100 words. Catchy opening hook. Include 5-8 hashtags at the end.`,
    "youtube-description": `${base} Write a YouTube video description. Include title, full description, key points covered, timestamps template, and 10 relevant tags.`,
    "birthday-message": `${base} Write a warm, personalized birthday message from the Pastor. Include scripture, blessing and prayer.`,
    "anniversary-message": `${base} Write a heartfelt wedding anniversary message. Include scripture on marriage, blessing and prayer for the couple.`,
    "follow-up-message": `${base} Write a warm follow-up message for first-time visitors or absent members. Welcoming, non-judgmental.`,
    "condolence-message": `${base} Write a compassionate condolence message. Include comforting scriptures, words of hope and prayer.`,
    "get-well-message": `${base} Write a healing and get-well message. Include healing scriptures, prayer for restoration and words of faith.`,
    "fasting-schedule": `${base} Create a fasting and prayer schedule. Include daily prayer points, scriptures, times of prayer, and daily declarations.`,
    "bible-study": `${base} Create a Bible study outline. Include topic, key scriptures, study points, discussion questions, and practical application.`,
    "altar-call": `${base} Write a powerful altar call script. Heartfelt, urgent, compassionate. Include salvation prayer, healing prayer, or rededication prayer.`,
  };
  return prompts[toolId] || base;
}

export default function ChurchAdminAIStudioClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("tools");
  const [selectedTool, setSelectedTool] = useState("");
  const [toolPrompt, setToolPrompt] = useState("");
  const [toolResult, setToolResult] = useState("");
  const [isToolGenerating, setIsToolGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatLoaded, setChatLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatMessages(parsed);
        } else {
          setChatMessages([DEFAULT_WELCOME]);
        }
      } else {
        setChatMessages([DEFAULT_WELCOME]);
      }
    } catch {
      setChatMessages([DEFAULT_WELCOME]);
    }
    setChatLoaded(true);
  }, []);

  useEffect(() => {
    if (chatLoaded && chatMessages.length > 0) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatMessages));
      } catch { /* ignore */ }
    }
  }, [chatMessages, chatLoaded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleToolGenerate = async () => {
    if (!selectedTool) { toast.error("Select a tool first"); return; }
    if (!toolPrompt.trim()) { toast.error("Enter your prompt"); return; }
    setIsToolGenerating(true);
    setToolResult("");
    try {
      const systemPrompt = getSystemPrompt(selectedTool);
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${systemPrompt}\n\n${toolPrompt.trim()}`,
          type: selectedTool,
        }),
      });
      const data = await res.json();
      if (data.error) { toast.error(data.error); return; }
      setToolResult(data.result);
      toast.success("🤖 Generated!");
    } catch {
      toast.error("Generation failed. Try again.");
    } finally {
      setIsToolGenerating(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are TFAM AI, the intelligent assistant for The Triumphant Family church led by Prophet Olayiwole Ogunsola in Akute, Ogun State, Nigeria. You can help with anything — ministry, leadership, personal issues, administration, social media, counseling, general knowledge. Respond helpfully and wisely.\n\nUser: ${userMessage.content}`,
          type: "chat",
        }),
      });
      const data = await res.json();
      const aiMessage: ChatMessage = {
        role: "ai",
        content: data.error ? "Sorry, I encountered an error. Please try again." : data.result,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: "Connection error. Please try again.", timestamp: new Date().toISOString() },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("📋 Copied!");
  };

  const shareWhatsApp = (text: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const clearChat = () => {
    if (!confirm("Clear all chat history? This cannot be undone.")) return;
    const cleared = [DEFAULT_WELCOME];
    setChatMessages(cleared);
    try { localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(cleared)); } catch { /* ignore */ }
    toast.success("Chat cleared");
  };

  const selectedToolData = ALL_TOOLS.find((t) => t.id === selectedTool);

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  };

  return (
    <div className="space-y-4 pb-6">

      {/* ── Brand Header ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs uppercase tracking-widest">TFAM AI</span>
          </div>
          <h1 className="font-heading text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
            TFAM AI Studio
          </h1>
          <p className="text-brand-purple-100 text-sm">
            Your intelligent ministry assistant — generate content or chat freely.
          </p>
          <div className="mt-4 pt-4 border-t border-brand-gold-400/30">
            <p className="text-white/70 italic text-sm">
              &ldquo;For the Holy Ghost shall teach you in the same hour what ye ought to say.&rdquo;
            </p>
            <p className="text-brand-purple-200 text-xs mt-1 font-semibold">— Luke 12:12</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab("tools")}
          className={`relative rounded-2xl overflow-hidden p-4 transition-all text-left ${
            activeTab === "tools"
              ? "bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-xl"
              : "bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-2 border-brand-gold-400/40"
          }`}
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-xl">
              🛠️
            </div>
            <p className="font-black text-white text-sm">Tools</p>
            <p className="text-brand-purple-200 text-xs">{ALL_TOOLS.length} AI tools</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`relative rounded-2xl overflow-hidden p-4 transition-all text-left ${
            activeTab === "chat"
              ? "bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-xl"
              : "bg-gradient-to-br from-brand-violet-900/80 via-brand-purple-800/80 to-brand-purple-900/80 border-2 border-brand-gold-400/40"
          }`}
        >
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-xl">
              💬
            </div>
            <p className="font-black text-white text-sm">AI Chat</p>
            <p className="text-brand-purple-200 text-xs">
              {chatMessages.length > 1 ? `${chatMessages.length - 1} messages saved` : "Ask anything"}
            </p>
          </div>
        </button>
      </div>

      {/* ── TOOLS TAB ── */}
      {activeTab === "tools" && (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-5 shadow-xl">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
            <div className="relative z-10 space-y-4">
              <div>
                <label className="block text-xs font-black text-white/80 mb-2 uppercase tracking-widest">
                  Select Tool
                </label>
                <select
                  value={selectedTool}
                  onChange={(e) => { setSelectedTool(e.target.value); setToolResult(""); }}
                  className="w-full p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold"
                >
                  <option value="">— Choose a tool —</option>
                  <optgroup label="📖 Ministry">
                    <option value="sermon-outline">🎙️ Sermon Outline</option>
                    <option value="devotional-single">📖 Devotional</option>
                    <option value="prayer-guide">🙏 Prayer Guide</option>
                    <option value="bible-study">🎓 Bible Study Notes</option>
                    <option value="altar-call">🎤 Altar Call Script</option>
                    <option value="fasting-schedule">📅 Fasting & Prayer Plan</option>
                  </optgroup>
                  <optgroup label="📱 Social Media">
                    <option value="facebook-post">📘 Facebook Post</option>
                    <option value="whatsapp-broadcast">📱 WhatsApp Broadcast</option>
                    <option value="instagram-caption">🎵 Instagram/TikTok Caption</option>
                    <option value="youtube-description">📺 YouTube Description</option>
                  </optgroup>
                  <optgroup label="✉️ Communication">
                    <option value="pastoral-letter">💌 Pastoral Letter</option>
                    <option value="bulletin">📢 Bulletin/Newsletter</option>
                    <option value="birthday-message">🎂 Birthday Message</option>
                    <option value="anniversary-message">💍 Anniversary Message</option>
                    <option value="follow-up-message">📞 Follow-Up Message</option>
                    <option value="condolence-message">💔 Condolence Message</option>
                    <option value="get-well-message">🏥 Get Well Message</option>
                  </optgroup>
                </select>
              </div>

              {selectedToolData && (
                <p className="text-brand-purple-200 text-sm font-semibold">{selectedToolData.desc}</p>
              )}

              {selectedTool && (
                <>
                  <div>
                    <label className="block text-xs font-black text-white/80 mb-2 uppercase tracking-widest">
                      Your Prompt
                    </label>
                    <textarea
                      value={toolPrompt}
                      onChange={(e) => setToolPrompt(e.target.value)}
                      placeholder="Describe what you want to generate..."
                      rows={4}
                      className="w-full p-4 rounded-2xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold text-sm"
                    />
                  </div>
                  <button
                    onClick={handleToolGenerate}
                    disabled={isToolGenerating || !toolPrompt.trim()}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isToolGenerating ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </span>
                    ) : "🤖 Generate"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Tool Result ── */}
          {toolResult && (
            <div className="space-y-3">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400 shadow-2xl">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/40 text-green-300 text-xs font-black">
                      ✅ Generated
                    </span>
                    {selectedToolData && (
                      <span className="text-brand-purple-200 text-xs font-semibold">{selectedToolData.label}</span>
                    )}
                  </div>
                  <div className="text-white font-semibold text-sm leading-relaxed whitespace-pre-wrap">
                    {toolResult}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => copyText(toolResult)}
                  className="py-3 rounded-xl bg-brand-purple-950/60 text-white font-bold text-xs border border-brand-gold-400/40 active:scale-95 transition-all"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => shareWhatsApp(toolResult)}
                  className="py-3 rounded-xl bg-green-600 text-white font-bold text-xs active:scale-95 transition-all"
                >
                  📱 WhatsApp
                </button>
                <button
                  onClick={handleToolGenerate}
                  disabled={isToolGenerating}
                  className="py-3 rounded-xl bg-brand-purple-950/60 text-white font-bold text-xs border border-brand-gold-400/40 active:scale-95 transition-all disabled:opacity-50"
                >
                  🔄 Redo
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
                <p className="text-white font-semibold text-xs">
                  📝 Always review and personalize AI content before sharing.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CHAT TAB ── */}
      {activeTab === "chat" && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-2xl">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

          {/* Chat Header */}
          <div className="p-4 border-b border-brand-gold-400/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-purple-950/80 border border-brand-gold-400/40 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <p className="text-white font-black text-sm">TFAM AI</p>
                <p className="text-brand-purple-200 text-xs font-semibold">
                  💾 Chat saved • Persistent history
                </p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-black active:scale-95 transition-all"
            >
              🗑️ Clear
            </button>
          </div>

          {/* Messages */}
          <div className="h-[400px] md:h-[500px] overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.role === "user"
                    ? "bg-brand-purple-950/80 border border-brand-gold-400/30"
                    : "bg-brand-purple-950/40 border border-white/10"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-white/80">
                      {msg.role === "user" ? "👤 You" : "🤖 TFAM AI"}
                    </span>
                    <span className="text-xs text-brand-purple-200">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-white font-semibold text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  {msg.role === "ai" && i > 0 && (
                    <div className="flex gap-3 mt-3 pt-2 border-t border-white/10">
                      <button
                        onClick={() => copyText(msg.content)}
                        className="text-xs text-brand-purple-200 hover:text-white font-bold transition-colors"
                      >
                        📋 Copy
                      </button>
                      <button
                        onClick={() => shareWhatsApp(msg.content)}
                        className="text-xs text-brand-purple-200 hover:text-white font-bold transition-colors"
                      >
                        📱 WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-brand-purple-950/40 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white/80">🤖 TFAM AI</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-brand-gold-400/30">
            <div className="flex gap-2">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKeyDown}
                placeholder="Type your message... (Enter to send)"
                rows={2}
                className="flex-1 p-3 rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white placeholder-brand-purple-400 focus:border-brand-gold-400 focus:outline-none resize-none font-semibold text-sm"
              />
              <button
                onClick={handleChatSend}
                disabled={isChatLoading || !chatInput.trim()}
                className="px-5 rounded-xl bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black shadow-gold active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
              >
                {isChatLoading ? "..." : "→"}
              </button>
            </div>
            <p className="text-brand-purple-200 text-xs mt-2 text-center">
              💾 Chat history saves automatically across pages and refreshes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}