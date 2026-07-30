// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBER BIBLE CLIENT — KJV reader + Yoruba embedded via iframe
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"use client";

import { useEffect, useState } from "react";

const BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah",
  "Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians",
  "2 Corinthians","Galatians","Ephesians","Philippians","Colossians",
  "1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon",
  "Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"
];

const BIBLE_COM_BOOKS: Record<string, string> = {
  "Genesis":"GEN","Exodus":"EXO","Leviticus":"LEV","Numbers":"NUM","Deuteronomy":"DEU",
  "Joshua":"JOS","Judges":"JDG","Ruth":"RUT","1 Samuel":"1SA","2 Samuel":"2SA",
  "1 Kings":"1KI","2 Kings":"2KI","1 Chronicles":"1CH","2 Chronicles":"2CH",
  "Ezra":"EZR","Nehemiah":"NEH","Esther":"EST","Job":"JOB","Psalms":"PSA",
  "Proverbs":"PRO","Ecclesiastes":"ECC","Song of Solomon":"SNG","Isaiah":"ISA",
  "Jeremiah":"JER","Lamentations":"LAM","Ezekiel":"EZK","Daniel":"DAN",
  "Hosea":"HOS","Joel":"JOL","Amos":"AMO","Obadiah":"OBA","Jonah":"JON",
  "Micah":"MIC","Nahum":"NAM","Habakkuk":"HAB","Zephaniah":"ZEP","Haggai":"HAG",
  "Zechariah":"ZEC","Malachi":"MAL","Matthew":"MAT","Mark":"MRK","Luke":"LUK",
  "John":"JHN","Acts":"ACT","Romans":"ROM","1 Corinthians":"1CO","2 Corinthians":"2CO",
  "Galatians":"GAL","Ephesians":"EPH","Philippians":"PHP","Colossians":"COL",
  "1 Thessalonians":"1TH","2 Thessalonians":"2TH","1 Timothy":"1TI","2 Timothy":"2TI",
  "Titus":"TIT","Philemon":"PHM","Hebrews":"HEB","James":"JAS","1 Peter":"1PE",
  "2 Peter":"2PE","1 John":"1JN","2 John":"2JN","3 John":"3JN","Jude":"JUD","Revelation":"REV"
};

interface Verse {
  verse: number;
  text: string;
}

type Translation = "kjv" | "yoruba";

export default function MemberBibleClient() {
  const [selectedBook, setSelectedBook] = useState("John");
  const [selectedChapter, setSelectedChapter] = useState(3);
  const [translation, setTranslation] = useState<Translation>("kjv");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (translation === "kjv") {
      loadKJV();
    } else {
      setIframeKey((prev) => prev + 1);
    }
  }, [selectedBook, selectedChapter, translation]);

  const loadKJV = async () => {
    setLoading(true);
    setError(null);
    setVerses([]);

    try {
      const response = await fetch(
        `https://bible-api.com/${encodeURIComponent(selectedBook)}+${selectedChapter}?translation=kjv`
      );
      const data = await response.json();

      if (data.verses) {
        setVerses(data.verses.map((v: { verse: number; text: string }) => ({
          verse: v.verse,
          text: v.text.trim(),
        })));
      } else {
        setError("Chapter not found. Try a different chapter number.");
      }
    } catch (err) {
      console.error("Bible API error:", err);
      setError("Failed to load. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const getYorubaUrl = () => {
    const bookCode = BIBLE_COM_BOOKS[selectedBook] || "JHN";
    return `https://www.bible.com/bible/911/${bookCode}.${selectedChapter}.BAYO`;
  };

  const fontSizeClass = fontSize === "sm" ? "text-sm" : fontSize === "lg" ? "text-lg" : "text-base";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-purple-900 mb-2">📕 Bible</h1>
        <p className="text-gray-600 text-sm">Read the Word of God in English (KJV) or Yoruba</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-md overflow-hidden">
        <div className="bg-brand-purple-50 border-b-2 border-brand-purple-100 p-4">

          {/* Translation Toggle */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-full border-2 border-brand-purple-200 overflow-hidden">
              <button
                onClick={() => setTranslation("kjv")}
                className={`px-6 py-2.5 text-sm font-bold transition-all ${
                  translation === "kjv"
                    ? "bg-brand-purple-600 text-white"
                    : "bg-white text-brand-purple-600 hover:bg-brand-purple-50"
                }`}
              >
                🇬🇧 KJV (English)
              </button>
              <button
                onClick={() => setTranslation("yoruba")}
                className={`px-6 py-2.5 text-sm font-bold transition-all ${
                  translation === "yoruba"
                    ? "bg-brand-purple-600 text-white"
                    : "bg-white text-brand-purple-600 hover:bg-brand-purple-50"
                }`}
              >
                🇳🇬 Yorùbá
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Book */}
            <div>
              <label className="block text-xs font-bold text-brand-purple-900 mb-1">Book</label>
              <select
                value={selectedBook}
                onChange={(e) => { setSelectedBook(e.target.value); setSelectedChapter(1); }}
                className="w-full p-2.5 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white text-sm"
              >
                {BOOKS.map((book) => (<option key={book} value={book}>{book}</option>))}
              </select>
            </div>

            {/* Chapter */}
            <div>
              <label className="block text-xs font-bold text-brand-purple-900 mb-1">Chapter</label>
              <input
                type="number"
                min="1"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 rounded-xl border-2 border-gray-200 focus:border-brand-purple-500 focus:outline-none text-gray-900 bg-white text-sm"
              />
            </div>

            {/* Font Size (KJV only) */}
            {translation === "kjv" && (
              <div>
                <label className="block text-xs font-bold text-brand-purple-900 mb-1">Text Size</label>
                <div className="flex gap-2">
                  {(["sm", "base", "lg"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        fontSize === size
                          ? "bg-brand-purple-600 text-white"
                          : "bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {size === "sm" ? "A" : size === "base" ? "A+" : "A++"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ━━━ KJV READING AREA ━━━ */}
        {translation === "kjv" && (
          <>
            {/* Navigation */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
              <button
                onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
                disabled={selectedChapter <= 1}
                className="px-4 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-sm font-bold disabled:opacity-30 transition-all"
              >
                ← Previous
              </button>
              <p className="font-heading font-bold text-brand-purple-900">
                {selectedBook} {selectedChapter}
                <span className="text-xs text-gray-500 ml-2">(KJV)</span>
              </p>
              <button
                onClick={() => setSelectedChapter(selectedChapter + 1)}
                className="px-4 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-sm font-bold transition-all"
              >
                Next →
              </button>
            </div>

            {/* Verses */}
            <div className="p-5 md:p-8">
              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-purple-100 mb-3 animate-pulse">
                    <span className="text-2xl">📖</span>
                  </div>
                  <p className="text-gray-500">Loading chapter...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">{error}</p>
                </div>
              ) : verses.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No verses found.</p>
                </div>
              ) : (
                <div className={`${fontSizeClass} leading-relaxed text-gray-800 space-y-1`}>
                  {verses.map((verse) => (
                    <span key={verse.verse} className="inline">
                      <sup className="text-brand-gold-600 font-bold text-xs mr-1">{verse.verse}</sup>
                      <span>{verse.text} </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ━━━ YORUBA READING AREA (EMBEDDED IFRAME) ━━━ */}
        {translation === "yoruba" && (
          <>
            {/* Navigation */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
              <button
                onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
                disabled={selectedChapter <= 1}
                className="px-4 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-sm font-bold disabled:opacity-30 transition-all"
              >
                ← Previous
              </button>
              <p className="font-heading font-bold text-brand-purple-900">
                {selectedBook} {selectedChapter}
                <span className="text-xs text-gray-500 ml-2">(Yorùbá)</span>
              </p>
              <button
                onClick={() => setSelectedChapter(selectedChapter + 1)}
                className="px-4 py-2 rounded-full bg-brand-purple-100 hover:bg-brand-purple-200 text-brand-purple-700 text-sm font-bold transition-all"
              >
                Next →
              </button>
            </div>

            {/* Embedded iframe */}
            <div className="relative" style={{ minHeight: "600px" }}>
              <iframe
                key={iframeKey}
                src={getYorubaUrl()}
                title={`${selectedBook} ${selectedChapter} - Yorùbá Bible`}
                className="w-full border-0"
                style={{ height: "700px" }}
                sandbox="allow-scripts allow-same-origin allow-popups"
              />

              {/* Fallback note */}
              <div className="absolute bottom-0 left-0 right-0 bg-brand-gold-50 border-t-2 border-brand-gold-200 p-3 text-center">
                <p className="text-xs text-brand-purple-700">
                  📖 Powered by Bible.com (YouVersion) • Bibeli Atoka Yoruba (BAYO)
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Info */}
      <div className="bg-brand-gold-50 border-2 border-brand-gold-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-brand-purple-900 mb-1">About the Bible Reader</p>
            <ul className="text-brand-purple-700 text-sm space-y-1 list-disc pl-4">
              <li><strong>KJV (English)</strong> — reads directly in your portal</li>
              <li><strong>Yorùbá</strong> — reads inside your portal via Bible.com</li>
              <li>Select any book and chapter from either translation</li>
              <li>Use Previous/Next to navigate chapters</li>
              <li>Adjust text size for comfortable reading (KJV)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}