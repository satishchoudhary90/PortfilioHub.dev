"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { clearChatHistory } from "@/lib/chat-history";
import {
  Send,
  Sparkles,
  Loader2,
  User,
  Bot,
  Trash2,
  Copy,
  CheckCheck,
  Lightbulb,
  Code2,
  FileText,
  Briefcase,
  Plus,
  MessageSquare,
  ChevronRight,
  Clock,
  X,
  History,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const suggestions = [
  { icon: Lightbulb, label: "Write a professional bio", prompt: "Write a professional developer bio for my portfolio. I'm a full-stack developer with 3 years of experience in React, Node.js, and PostgreSQL." },
  { icon: Code2, label: "Suggest project ideas", prompt: "Suggest 5 impressive portfolio project ideas that would stand out to recruiters for a full-stack developer." },
  { icon: FileText, label: "Improve my resume", prompt: "Help me write a compelling resume summary that highlights my skills as a software developer." },
  { icon: Briefcase, label: "Cover letter help", prompt: "Write a cover letter template for a senior frontend developer position at a tech startup." },
];

function formatMarkdown(text: string): string {
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-black/40 rounded-lg p-3 my-2 overflow-x-auto text-sm"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-theme-card px-1.5 py-0.5 rounded text-sm text-theme-accent">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-theme-text mt-3 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-theme-text mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-theme-text mt-4 mb-2">$1</h1>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-theme-text-secondary">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-theme-text-secondary">$1</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

const STORAGE_KEY = "devportfolio-ai-conversations";

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((c: Record<string, unknown>) => ({
      ...c,
      createdAt: new Date(c.createdAt as string),
      updatedAt: new Date(c.updatedAt as string),
      messages: (c.messages as Record<string, unknown>[]).map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp as string),
      })),
    }));
  } catch {
    return [];
  }
}

function saveConversations(convos: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
  } catch {}
}

function generateTitle(messages: Message[]): string {
  const firstUserMsg = messages.find((m) => m.role === "user");
  if (!firstUserMsg) return "New Chat";
  const text = firstUserMsg.content;
  if (text.length <= 40) return text;
  return text.slice(0, 37) + "...";
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AiChatPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hydrated = useRef(false);

  const activeConvo = conversations.find((c) => c.id === activeId) || null;
  const messages = activeConvo?.messages || [];

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      const loaded = loadConversations();
      setConversations(loaded);
      if (loaded.length > 0) {
        setActiveId(loaded[0].id);
      }
    }
  }, []);

  const persist = useCallback((convos: Conversation[]) => {
    setConversations(convos);
    saveConversations(convos);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeId]);

  function startNewChat() {
    const newConvo: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [newConvo, ...conversations];
    persist(updated);
    setActiveId(newConvo.id);
    setSidebarOpen(false);
  }

  function switchChat(id: string) {
    setActiveId(id);
    setSidebarOpen(false);
  }

  function deleteChat(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== id);
    persist(updated);
    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : null);
    }
  }

  async function sendMessage(content?: string) {
    const text = (content || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    let currentId = activeId;
    let updatedConvos: Conversation[];

    if (!currentId) {
      const newConvo: Conversation = {
        id: Date.now().toString(),
        title: text.length <= 40 ? text : text.slice(0, 37) + "...",
        messages: [userMsg],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      currentId = newConvo.id;
      updatedConvos = [newConvo, ...conversations];
      setActiveId(currentId);
    } else {
      updatedConvos = conversations.map((c) => {
        if (c.id !== currentId) return c;
        const newMsgs = [...c.messages, userMsg];
        return {
          ...c,
          messages: newMsgs,
          title: c.messages.length === 0 ? generateTitle(newMsgs) : c.title,
          updatedAt: new Date(),
        };
      });
    }

    persist(updatedConvos);
    setInput("");
    setLoading(true);

    const convoMessages = updatedConvos.find((c) => c.id === currentId)!.messages;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: convoMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || data.error || "Sorry, something went wrong.",
        timestamp: new Date(),
      };

      const finalConvos = updatedConvos.map((c) =>
        c.id === currentId ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: new Date() } : c
      );
      persist(finalConvos);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Failed to get a response. Please try again.",
        timestamp: new Date(),
      };
      const finalConvos = updatedConvos.map((c) =>
        c.id === currentId ? { ...c, messages: [...c.messages, errMsg], updatedAt: new Date() } : c
      );
      persist(finalConvos);
    }

    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function copyMessage(id: string, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }

  function clearAllChats() {
    persist([]);
    setActiveId(null);
    clearChatHistory();
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] gap-0">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 shrink-0 pr-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <Sparkles className="h-5 w-5 text-theme-text" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-theme-text">AI Chat</h1>
              <p className="text-xs sm:text-sm text-theme-muted">Powered by Llama 3.3</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={startNewChat} className="text-theme-text-secondary hover:text-theme-text">
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">New</span>
            </Button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-white/5 transition-all relative"
            >
              <History className="h-4 w-4" />
              {conversations.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-500 text-[9px] text-theme-text flex items-center justify-center font-bold">
                  {conversations.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1 -mr-1 min-h-0">
          <AnimatePresence initial={false}>
            {isEmpty ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-6">
                  <Bot className="h-12 w-12 text-indigo-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-theme-text mb-2">DevPortfolio AI</h2>
                <p className="text-sm text-theme-muted text-center max-w-md mb-8 px-4">
                  Ask me anything — generate bios, project descriptions, code snippets, cover letters, career advice, and more.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg px-4">
                  {suggestions.map((s) => {
                    const Icon = s.icon;
                    return (
                      <motion.button
                        key={s.label}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => sendMessage(s.prompt)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all text-left"
                      >
                        <Icon className="h-4 w-4 text-indigo-400 shrink-0" />
                        <span className="text-sm text-theme-text-secondary">{s.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 h-fit shrink-0 mt-0.5">
                      <Bot className="h-4 w-4 text-theme-text" />
                    </div>
                  )}
                  <div className={`group relative max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-theme-text rounded-br-md"
                          : "bg-white/[0.05] border border-white/[0.08] text-gray-200 rounded-bl-md"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div
                          className="prose-invert [&_pre]:my-2 [&_code]:text-indigo-300 [&_li]:my-0.5 [&_strong]:text-theme-text"
                          dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-theme-muted hover:text-theme-text-secondary"
                      >
                        {copiedId === msg.id ? (
                          <><CheckCheck className="h-3 w-3" /> Copied</>
                        ) : (
                          <><Copy className="h-3 w-3" /> Copy</>
                        )}
                      </button>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="p-1.5 rounded-lg bg-white/10 h-fit shrink-0 mt-0.5">
                      <User className="h-4 w-4 text-theme-text-secondary" />
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 h-fit shrink-0">
                <Bot className="h-4 w-4 text-theme-text" />
              </div>
              <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-white/[0.05] border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-theme-muted">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 pt-3 border-t border-white/[0.06] pr-2">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 pr-12 text-sm text-theme-text placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all max-h-32 overflow-y-auto"
                style={{ minHeight: "44px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "44px";
                  target.style.height = Math.min(target.scrollHeight, 128) + "px";
                }}
              />
              <div className="absolute right-2 bottom-1.5 text-[10px] text-theme-muted">
                {input.length > 0 && "Enter \u21b5"}
              </div>
            </div>
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="rounded-xl h-[44px] px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 shrink-0"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-theme-muted text-center mt-2">
            DevPortfolio AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>

      {/* Right Sidebar — History (desktop: always visible, mobile: overlay) */}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-72 border-l border-white/[0.06] ml-4 pl-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-theme-text-secondary flex items-center gap-2">
            <History className="h-3.5 w-3.5" />
            Chat History
          </h3>
          {conversations.length > 0 && (
            <button onClick={clearAllChats} className="text-[10px] text-theme-muted hover:text-red-400 transition-colors">
              Clear all
            </button>
          )}
        </div>

        <button
          onClick={startNewChat}
          className="flex items-center gap-2 w-full p-2.5 mb-2 rounded-lg border border-dashed border-white/10 text-sm text-theme-text-secondary hover:text-theme-text hover:border-white/20 hover:bg-white/[0.03] transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-1 -mr-2 pr-2">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-8 w-8 text-theme-muted mb-2" />
              <p className="text-xs text-theme-muted">No conversations yet</p>
            </div>
          ) : (
            conversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => switchChat(convo.id)}
                className={`group w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-all ${
                  convo.id === activeId
                    ? "bg-indigo-600/10 border border-indigo-500/20 text-theme-text"
                    : "text-theme-text-secondary hover:text-theme-text hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 opacity-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{convo.title}</p>
                  <p className="text-[10px] text-theme-muted mt-0.5 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {timeAgo(convo.updatedAt)}
                    <span className="text-theme-muted mx-0.5">&middot;</span>
                    {convo.messages.length} msgs
                  </p>
                </div>
                <button
                  onClick={(e) => deleteChat(convo.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-theme-muted hover:text-red-400 transition-all shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-72 bg-theme-bg border-l border-white/10 z-50 flex flex-col p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-theme-text flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Chat History
                </h3>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg text-theme-text-secondary hover:text-theme-text hover:bg-white/10">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={startNewChat}
                className="flex items-center gap-2 w-full p-2.5 mb-3 rounded-lg border border-dashed border-white/10 text-sm text-theme-text-secondary hover:text-theme-text hover:border-white/20 hover:bg-white/[0.03] transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                New Chat
              </button>

              <div className="flex-1 overflow-y-auto space-y-1">
                {conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-8 w-8 text-theme-muted mb-2" />
                    <p className="text-xs text-theme-muted">No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((convo) => (
                    <button
                      key={convo.id}
                      onClick={() => switchChat(convo.id)}
                      className={`group w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-all ${
                        convo.id === activeId
                          ? "bg-indigo-600/10 border border-indigo-500/20 text-theme-text"
                          : "text-theme-text-secondary hover:text-theme-text hover:bg-white/[0.03] border border-transparent"
                      }`}
                    >
                      <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 opacity-50" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{convo.title}</p>
                        <p className="text-[10px] text-theme-muted mt-0.5 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {timeAgo(convo.updatedAt)}
                          <span className="text-theme-muted mx-0.5">&middot;</span>
                          {convo.messages.length} msgs
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteChat(convo.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-theme-muted hover:text-red-400 transition-all shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </button>
                  ))
                )}
              </div>

              {conversations.length > 0 && (
                <button
                  onClick={clearAllChats}
                  className="mt-3 flex items-center justify-center gap-1.5 w-full p-2 rounded-lg text-xs text-theme-muted hover:text-red-400 hover:bg-white/[0.03] transition-all"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear all chats
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
