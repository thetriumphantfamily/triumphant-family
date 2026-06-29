// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATABASE TYPES - THE TRIUMPHANT FAMILY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TypeScript types matching our Supabase database schema.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRAYER REQUEST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface PrayerRequest {
  id:              string;
  full_name:       string;
  email:           string | null;
  phone:           string | null;
  country:         string | null;
  prayer_point:    string;
  category:        PrayerCategory;
  is_anonymous:    boolean;
  is_approved:     boolean;
  show_on_wall:    boolean;
  is_answered:     boolean;
  admin_note:      string | null;
  created_at:      string;
  updated_at:      string;
}

export type PrayerCategory =
  | "healing"
  | "breakthrough"
  | "salvation"
  | "marriage"
  | "family"
  | "finance"
  | "career"
  | "deliverance"
  | "thanksgiving"
  | "other";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SERMON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface Sermon {
  id:              string;
  title:           string;
  slug:            string;
  description:     string | null;
  scripture:       string | null;
  preacher:        string;
  sermon_date:     string;
  series:          string | null;
  tags:            string[];
  youtube_url:     string | null;
  audio_url:       string | null;
  thumbnail_url:   string | null;
  duration:        string | null;
  views:           number;
  is_featured:     boolean;
  is_published:    boolean;
  created_at:      string;
  updated_at:      string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface Event {
  id:                    string;
  title:                 string;
  slug:                  string;
  description:           string;
  event_date:            string;
  end_date:              string | null;
  location:              string;
  is_online:             boolean;
  online_link:           string | null;
  flyer_url:             string | null;
  registration_required: boolean;
  registration_link:     string | null;
  category:              EventCategory;
  is_featured:           boolean;
  is_published:          boolean;
  created_at:            string;
  updated_at:            string;
}

export type EventCategory =
  | "service"
  | "conference"
  | "crusade"
  | "prayer"
  | "outreach"
  | "training"
  | "fellowship"
  | "other";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface Testimony {
  id:              string;
  full_name:       string;
  email:           string | null;
  location:        string | null;
  testimony_text:  string;
  category:        TestimonyCategory;
  photo_url:       string | null;
  video_url:       string | null;
  is_approved:     boolean;
  is_featured:     boolean;
  created_at:      string;
  updated_at:      string;
}

export type TestimonyCategory =
  | "healing"
  | "breakthrough"
  | "salvation"
  | "marriage"
  | "family"
  | "finance"
  | "career"
  | "deliverance"
  | "other";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTACT MESSAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface ContactMessage {
  id:              string;
  full_name:       string;
  email:           string;
  phone:           string | null;
  subject:         string;
  message:         string;
  is_read:         boolean;
  is_archived:     boolean;
  created_at:      string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY ITEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface GalleryItem {
  id:              string;
  title:           string;
  description:     string | null;
  image_url:       string;
  category:        GalleryCategory;
  event_id:        string | null;
  display_order:   number;
  is_published:    boolean;
  created_at:      string;
}

export type GalleryCategory =
  | "service"
  | "conference"
  | "outreach"
  | "prayer"
  | "events"
  | "ministry"
  | "other";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEADERSHIP / TEAM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface Leadership {
  id:              string;
  full_name:       string;
  title:           string;
  role:            string;
  bio:             string | null;
  photo_url:       string | null;
  facebook_url:    string | null;
  instagram_url:   string | null;
  display_order:   number;
  is_active:       boolean;
  created_at:      string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SITE SETTINGS (Key-Value)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface SiteSetting {
  id:              string;
  key:             string;
  value:           string;
  description:     string | null;
  updated_at:      string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NEWSLETTER SUBSCRIBER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export interface NewsletterSubscriber {
  id:              string;
  email:           string;
  full_name:       string | null;
  is_active:       boolean;
  subscribed_at:   string;
}