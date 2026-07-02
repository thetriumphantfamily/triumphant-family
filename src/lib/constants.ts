// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THE TRIUMPHANT FAMILY - SITE CONFIGURATION CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// All site-wide content lives here. Update values here and they reflect
// everywhere on the website. Search for {{PLACEHOLDER}} for items to update.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SITE = {
  name: "The Triumphant Family",
  fullName: "The Triumphant Family - The Gleam of Salvation Apostolic Ministry",
  shortName: "TTF",
  tagline: "Pray with us. Triumph with us.",
  description:
    "A global prayer ministry where we gather for explosive prayer storms, glorious worship, prophetic declarations and life-changing encounters with the Holy Spirit. Salvation, healing, deliverance, and unstoppable victories await you.",

  prophet: {
    title: "Prophet",
    name: "Olayiwole Ogunsola",
    fullName: "Prophet Olayiwole Ogunsola",
    role: "Founder & General Overseer",
  },
};

export const CONTACT = {
  email:         "thetriumphantgrace@gmail.com",
  phone:         "+234 802 262 0704",
  phoneRaw:      "08022620704",
  whatsapp:      "2348022620704",
  whatsappLink:  "https://wa.me/2348022620704",

  address: {
    line1:   "1, Arifanla Bus Stop",
    city:    "Akute",
    state:   "Ogun State",
    country: "Nigeria",
    full:    "1, Arifanla Bus Stop, Akute, Ogun State, Nigeria",
  },
};

export const SERVICES = [
  {
    day:         "Sunday",
    name:        "Sunday Worship Service",
    time:        "8:00 AM",
    description: "Glorious worship, the Word and Holy Communion.",
  },
  {
    day:         "Wednesday",
    name:        "Midweek Prayer Service",
    time:        "9:00 AM",
    description: "Prophetic prayer, healing and deliverance.",
  },
];

export const SOCIALS = {
  facebook:  "https://m.facebook.com/wole.ola.376/",
  youtube:   "https://www.youtube.com/PastorOlayiwoleTriumphant",
  instagram: "https://www.instagram.com/pastorolayiwoletriumphant",
  tiktok:    "{{TIKTOK_URL}}",

  handles: {
    facebook:  "Pastor Olayiwole Triumphant",
    youtube:   "@PastorOlayiwoleTriumphant",
    instagram: "@pastorolayiwoletriumphant",
    tiktok:    "Pastor Olayiwole Triumphant",
  },
};

export const LIVE_STREAM = {
  youtubeLiveId:   "{{YOUTUBE_LIVE_ID}}",
  youtubeChannel:  "https://www.youtube.com/PastorOlayiwoleTriumphant",
  facebookLiveUrl: "{{FACEBOOK_LIVE_URL}}",
  isLive:          false,
};

export const BANK_ACCOUNTS = [
  {
    bank:        "UBA (United Bank for Africa)",
    accountName: "THE TRIUMPHANT FAMILY OF THE GLEAM OF SALVATION A.P",
    accountNumber: "1027481531",
    currency:    "NGN",
    type:        "Current Account",
  },
];

export const NAV_LINKS = [
  { name: "Home",         href: "/" },
  { name: "About",        href: "/about" },
  { name: "Prayer",       href: "/prayer" },
  { name: "Sermons",      href: "/sermons" },
  { name: "Events",       href: "/events" },
  { name: "Testimonies",  href: "/testimonies" },
  { name: "Live",         href: "/live" },
  { name: "Give",         href: "/give" },
  { name: "Contact",      href: "/contact" },
];

export const HERO = {
  badge:    "Welcome to The Triumphant Family",
  headline: "Experience the Supernatural",
  rotatingWords: ["Supernatural", "Healings", "Breakthrough", "Deliverance", "Victory"],
  subheadline:
    "We gather for explosive prayer storms, glorious worship, prophetic declarations and life-changing encounters with the Holy Spirit. Salvation, healing, deliverance, and unstoppable victories await you here.",
  ctaPrimary:   { label: "Submit Prayer Request", href: "/prayer" },
  ctaSecondary: { label: "Watch Live",            href: "/live"   },
};

export const CORE_PROMISES = [
  {
    title:       "Explosive Prayer Storms",
    description: "Engaging the heavens through fervent, Spirit-led prayer.",
    icon:        "Flame",
  },
  {
    title:       "Glorious Worship",
    description: "Heartfelt worship that ushers in the manifest presence of God.",
    icon:        "Music",
  },
  {
    title:       "Prophetic Declarations",
    description: "Receiving and decreeing the now-word of the Lord over your life.",
    icon:        "Sparkles",
  },
  {
    title:       "Holy Spirit Encounters",
    description: "Life-changing moments in the presence of the living God.",
    icon:        "Wind",
  },
  {
    title:       "Healing & Deliverance",
    description: "Freedom from every form of bondage by the power of Christ.",
    icon:        "Heart",
  },
  {
    title:       "Unstoppable Victories",
    description: "Walking in triumph over every situation and circumstance.",
    icon:        "Trophy",
  },
];

export const SEO = {
  title:       "The Triumphant Family | The Gleam of Salvation Apostolic Ministry",
  description: SITE.description,
  keywords: [
    "Triumphant Family",
    "Prophet Olayiwole Ogunsola",
    "Apostolic Ministry",
    "Prayer Ministry",
    "Nigerian Church",
    "Akute Ogun State Church",
    "Healing Ministry",
    "Deliverance Ministry",
    "Prophetic Ministry",
    "Online Church",
  ],
  ogImage: "/images/og-image.jpg",
  url:     "https://thetriumphantfamily.org",
  author:  "Prophet Olayiwole Ogunsola",
};