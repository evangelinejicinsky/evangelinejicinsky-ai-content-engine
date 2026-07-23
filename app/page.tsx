"use client";

import { useState } from "react";
import { Zap, FileText, Share2, Mail, Copy, Download, Check, ChevronDown, ChevronUp, LogIn, Sparkles, TrendingUp, Shield, Clock } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  intent: string;
  wordCount: number;
  keywords: string[];
  excerpt: string;
  fullText: string;
}

type Mode = "seo" | "social" | "email";

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<Mode>("seo");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const modes = [
    { id: "seo" as Mode, icon: FileText, label: "SEO Blog Cluster", desc: "10 pillar + cluster articles" },
    { id: "social" as Mode, icon: Share2, label: "Social Media Pack", desc: "6 posts across platforms" },
    { id: "email" as Mode, icon: Mail, label: "Email Sequence", desc: "7-email nurture sequence" },
  ];

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    setProgress(0);
    setContent([]);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + Math.random() * 15 + 5;
      });
    }, 200);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, mode }),
      });
      const data = await res.json();
      if (data.content) setContent(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => { setLoading(false); setProgress(0); }, 400);
    }
  }

  function copyItem(item: ContentItem) {
    navigator.clipboard.writeText(item.fullText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function exportAll() {
    const all = content.map((c) => `# ${c.title}\n\n${c.fullText}`).join("\n\n---\n\n");
    const blob = new Blob([all], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-cluster-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalWords = content.reduce((a, b) => a + b.wordCount, 0);
  const contentValue = content.length * 150;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">AI Content Engine</span>
          </div>
          <button onClick={() => setShowAuth(true)} className="flex items-center gap-1.5 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </div>
      </header>

      {showAuth && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowAuth(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
            <h2 className="text-xl font-bold mb-4">Welcome</h2>
            <p className="text-sm text-gray-600 mb-4">Sign in to save your content and unlock unlimited generations.</p>
            <button onClick={() => setShowAuth(false)} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Continue with Email</button>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 mb-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-lg">Revenue Model: $49/month per user</div>
            <div className="text-sm opacity-90 mt-1">Generate unlimited content clusters. White-label ready.</div>
          </div>
          <div className="text-3xl font-bold">$49<span className="text-base font-normal opacity-80">/mo</span></div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">AI Content Cluster Engine</h1>
          <p className="text-gray-600 max-w-xl mx-auto">Enter ONE topic. Get SEO articles, social posts, and email sequences instantly.</p>
        </div>

        {content.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{content.length}</div>
              <div className="text-xs text-gray-500 mt-1">Items</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{totalWords.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Words</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">2.1s</div>
              <div className="text-xs text-gray-500 mt-1">Generated</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">${contentValue.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Value</div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., 'Sustainable Fashion', 'Keto Diet'..." className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500" onKeyDown={(e) => e.key === "Enter" && generate()} />
          <button onClick={generate} disabled={loading || !topic.trim()} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2 whitespace-nowrap">
            <Zap className="w-5 h-5" /> {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {modes.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)} className={`p-4 rounded-xl border-2 text-left transition-all ${mode === m.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}`}>
              <div className="flex items-center gap-2 mb-1">
                <m.icon className={`w-5 h-5 ${mode === m.id ? "text-blue-600" : "text-gray-500"}`} />
                <span className={`font-semibold ${mode === m.id ? "text-blue-900" : "text-gray-800"}`}>{m.label}</span>
              </div>
              <div className="text-xs text-gray-500 ml-7">{m.desc}</div>
            </button>
          ))}
        </div>

        {loading && <div className="mb-6"><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} /></div></div>}

        <div className="space-y-4">
          {content.length === 0 && !loading && (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <div className="text-5xl mb-4">✨</div>
              <div className="font-medium text-gray-800 text-lg">Your content empire starts with one topic</div>
              <div className="text-sm text-gray-500 mt-2">Enter a niche above and hit Generate.</div>
            </div>
          )}

          {content.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base mb-2">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">{item.type}</span>
                    <span className="text-xs text-gray-500">🎯 {item.intent}</span>
                    <span className="text-xs text-gray-500">📊 {item.wordCount} words</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.keywords.map((k, i) => <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">{k}</span>)}
                  </div>
                </div>
                <button onClick={() => copyItem(item)} className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  {copiedId === item.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-3">
                <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  {expandedId === item.id ? <><ChevronUp className="w-4 h-4" /> Hide</> : <><ChevronDown className="w-4 h-4" /> Show Full</>}
                </button>
                {expandedId === item.id && <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs">{item.fullText}</div>}
              </div>
            </div>
          ))}

          {content.length > 0 && (
            <div className="flex gap-3 justify-center pt-4">
              <button onClick={exportAll} className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition"><Download className="w-4 h-4" /> Export All</button>
              <button onClick={() => navigator.clipboard.writeText(content.map((c) => `# ${c.title}\n\n${c.fullText}`).join("\n\n---\n\n"))} className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition"><Copy className="w-4 h-4" /> Copy All</button>
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200"><TrendingUp className="w-8 h-8 text-blue-600 mb-3" /><h3 className="font-semibold text-gray-900 mb-1">SEO Optimized</h3><p className="text-sm text-gray-600">Structured for search engines with proper headings and keywords.</p></div>
          <div className="bg-white rounded-xl p-6 border border-gray-200"><Shield className="w-8 h-8 text-blue-600 mb-3" /><h3 className="font-semibold text-gray-900 mb-1">Plagiarism Free</h3><p className="text-sm text-gray-600">AI-generated unique content ready to publish.</p></div>
          <div className="bg-white rounded-xl p-6 border border-gray-200"><Clock className="w-8 h-8 text-blue-600 mb-3" /><h3 className="font-semibold text-gray-900 mb-1">Save 40+ Hours</h3><p className="text-sm text-gray-600">What takes a writer a week, we produce in minutes.</p></div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-500">
        <p>© 2026 AI Content Engine. Built with Next.js + Supabase + OpenAI.</p>
      </footer>
    </div>
  );
}
