// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER BIBLE — Mobile responsive + Dashboard pattern + Tap verse
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingScreen from "./LoadingScreen";

interface Verse {
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians",
  "Ephesians", "Philippians", "Colossians",
  "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation",
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function MemberBibleClient() {
  const [selectedBook, setSelectedBook] = useState("John");
  const [selectedChapter, setSelectedChapter] = useState(3);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState("text-base");
  const [translation, setTranslation] = useState<"kjv" | "yoruba">("kjv");
  const [memberName, setMemberName] = useState("");
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  useEffect(() => {
    loadMember();
    loadVerses();
  }, []);

  useEffect(() => {
    loadVerses();
    setSelectedVerse(null);
  }, [selectedBook, selectedChapter, translation]);

  const loadMember = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.includes("member") || key.includes("tfam")) {
          try {
            const val = localStorage.getItem(key);
            if (val) {
              const parsed = JSON.parse(val);
              if (parsed.full_name) { setMemberName(parsed.full_name.split(" ")[0]); break; }
            }
          } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }
  };

  const loadVerses = async () => {
    setLoading(true);
    try {
      if (translation === "kjv") {
        const res = await fetch(
          `https://bible-api.com/${encodeURIComponent(selectedBook)}+${selectedChapter}?translation=kjv`
        );
        const data = await res.json();
        if (data.verses) {
          setVerses(data.verses.map((v: { book_name: string; chapter: number; verse: number; text: string }) => ({
            book_name: v.book_name, chapter: v.chapter, verse: v.verse, text: v.text,
          })));
        } else {
          setVerses([]);
        }
      } else {
        setVerses([]);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setVerses([]);
      setLoading(false);
    }
  };

  const copyVerse = (v: Verse) => {
    const text = `${v.book_name} ${v.chapter}:${v.verse} (KJV)\n"${v.text.trim()}"`;
    navigator.clipboard.writeText(text);
    toast.success("📋 Verse copied!");
  };

  const shareVerse = (v: Verse) => {
    const text = `📖 ${v.book_name} ${v.chapter}:${v.verse} (KJV)\n\n"${v.text.trim()}"\n\n— The Triumphant Family`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const toggleVerse = (verseNum: number) => {
    setSelectedVerse(selectedVerse === verseNum ? null : verseNum);
  };

  const prevChapter = () => {
    if (selectedChapter > 1) setSelectedChapter(selectedChapter - 1);
  };

  const nextChapter = () => {
    setSelectedChapter(selectedChapter + 1);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Brand Header */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-4 md:p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-brand-purple-950/60 border border-brand-gold-400/40 mb-3 md:mb-4">
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-brand-gold-400 animate-pulse" />
            <span className="text-white font-black text-xs md:text-sm lg:text-lg uppercase tracking-widest">Bible</span>
          </div>
          <p className="text-white/80 font-semibold text-base md:text-lg mb-1">{getGreeting()}{memberName ? `, ${memberName}` : ""}!</p>
          <h1 className="font-heading text-xl md:text-2xl lg:text-4xl font-bold text-white mb-2 md:mb-3 leading-tight">Read The Word</h1>
          <p className="text-brand-purple-100 text-xs md:text-sm lg:text-base">KJV + Yoruba Bible Reader</p>
        </div>
      </div>

      {/* Controls — MOBILE RESPONSIVE */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 p-3 md:p-5 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        {/* Row 1: Book + Chapter */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-2 md:mb-3">
          <div>
            <label className="block text-[10px] md:text-xs font-black text-white mb-1 uppercase tracking-widest">Book</label>
            <select value={selectedBook} onChange={(e) => { setSelectedBook(e.target.value); setSelectedChapter(1); }}
              className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold text-xs md:text-sm">
              {BOOKS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] md:text-xs font-black text-white mb-1 uppercase tracking-widest">Chapter</label>
            <div className="flex gap-1">
              <button onClick={prevChapter} disabled={selectedChapter <= 1} className="px-2 md:px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-brand-purple-950/60 text-white border border-brand-gold-400/40 font-bold text-sm disabled:opacity-30">←</button>
              <input type="number" min="1" value={selectedChapter} onChange={(e) => setSelectedChapter(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 p-2 md:p-2.5 rounded-lg md:rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold text-xs md:text-sm text-center min-w-0" />
              <button onClick={nextChapter} className="px-2 md:px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-brand-purple-950/60 text-white border border-brand-gold-400/40 font-bold text-sm">→</button>
            </div>
          </div>
        </div>

        {/* Row 2: Translation + Font Size */}
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <div>
            <label className="block text-[10px] md:text-xs font-black text-white mb-1 uppercase tracking-widest">Translation</label>
            <select value={translation} onChange={(e) => setTranslation(e.target.value as "kjv" | "yoruba")}
              className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold text-xs md:text-sm">
              <option value="kjv">KJV (English)</option>
              <option value="yoruba">Yoruba</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] md:text-xs font-black text-white mb-1 uppercase tracking-widest">Size</label>
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}
              className="w-full p-2 md:p-2.5 rounded-lg md:rounded-xl border-2 border-brand-gold-400/40 bg-brand-purple-950/60 text-white focus:border-brand-gold-400 focus:outline-none font-semibold text-xs md:text-sm">
              <option value="text-xs">Small</option>
              <option value="text-sm">Medium</option>
              <option value="text-base">Large</option>
              <option value="text-lg">Extra Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bible Content */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-brand-violet-900 via-brand-purple-800 to-brand-purple-900 border-2 border-brand-gold-400/40 shadow-xl">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-brand-gold-300 via-brand-gold-400 to-brand-gold-500" />

        {/* Chapter Title */}
        <div className="p-3 md:p-5 border-b border-brand-gold-400/30">
          <h2 className="font-heading text-lg md:text-xl lg:text-2xl font-black text-white text-center">
            {selectedBook} {selectedChapter}
          </h2>
          <p className="text-brand-purple-200 text-[10px] md:text-xs text-center mt-1 uppercase tracking-widest">
            {translation === "kjv" ? "King James Version" : "Bibeli Mimọ (Yoruba)"}
          </p>
          <p className="text-brand-purple-300 text-[10px] md:text-xs text-center mt-1">Tap any verse to copy or share</p>
        </div>

        {/* Verses */}
        <div className="p-3 md:p-5 lg:p-8">
          {loading ? (
            <LoadingScreen message="Loading scripture..." />
          ) : translation === "yoruba" ? (
            <div className="text-center py-6 md:py-8">
              <div className="text-4xl md:text-5xl mb-4">📖</div>
              <h3 className="text-white font-bold text-base md:text-lg mb-2">Yoruba Bible</h3>
              <p className="text-brand-purple-200 text-xs md:text-sm mb-4">Opening Yoruba Bible via Bible.com</p>
              <a
                href={`https://www.bible.com/bible/911/${selectedBook.toLowerCase().replace(/\s/g, "")}.${selectedChapter}.YOR`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-500 text-brand-purple-900 font-black text-sm shadow-gold hover:scale-105 transition-all"
              >
                📖 Open Yoruba Bible
              </a>
            </div>
          ) : verses.length === 0 ? (
            <div className="text-center py-6 md:py-8">
              <div className="text-4xl md:text-5xl mb-4">📖</div>
              <p className="text-white font-bold text-sm md:text-base">No verses found</p>
              <p className="text-brand-purple-200 text-xs md:text-sm mt-2">Try a different chapter</p>
            </div>
          ) : (
            <div className={`text-white/90 leading-relaxed text-justify ${fontSize}`}>
              {verses.map((v) => (
                <span key={v.verse} className="relative inline">
                  <span
                    onClick={() => toggleVerse(v.verse)}
                    className={`cursor-pointer transition-all ${
                      selectedVerse === v.verse
                        ? "bg-brand-gold-400/20 rounded px-0.5"
                        : "hover:bg-white/5 rounded px-0.5"
                    }`}
                  >
                    <sup className="text-brand-purple-300 font-black text-[9px] md:text-[10px] mr-0.5 md:mr-1">{v.verse}</sup>
                    {v.text.trim()}{" "}
                  </span>

                  {selectedVerse === v.verse && (
                    <span className="inline-flex gap-1 md:gap-2 ml-0.5 md:ml-1 align-middle">
                      <button
                        onClick={(e) => { e.stopPropagation(); copyVerse(v); }}
                        className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full bg-brand-purple-950/80 border border-brand-gold-400/40 text-brand-gold-300 text-[9px] md:text-[10px] font-black hover:bg-brand-purple-950 transition-colors"
                      >
                        📋
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); shareVerse(v); }}
                        className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full bg-green-500/80 text-white text-[9px] md:text-[10px] font-black hover:bg-green-600 transition-colors"
                      >
                        📱
                      </button>
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-3 md:p-5 border-t border-brand-gold-400/30 flex justify-between">
          <button onClick={prevChapter} disabled={selectedChapter <= 1}
            className="px-3 md:px-5 py-2 md:py-2.5 rounded-full bg-brand-purple-950/60 text-white font-bold text-xs md:text-sm border border-brand-gold-400/40 hover:border-brand-gold-400 transition-colors disabled:opacity-30">
            ← Prev
          </button>
          <button onClick={nextChapter}
            className="px-3 md:px-5 py-2 md:py-2.5 rounded-full bg-brand-purple-950/60 text-white font-bold text-xs md:text-sm border border-brand-gold-400/40 hover:border-brand-gold-400 transition-colors">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}