export type PostStatus = 'draft' | 'published';
export type LeadStatus = 'new' | 'read' | 'archived';

export type PostCategory =
  | 'caribbean'
  | 'disney'
  | 'cruise'
  | 'wellness'
  | 'tips';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: PostCategory | string;
  cover_image: string | null;
  read_minutes: number;
  featured: boolean;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Postcard {
  id: string;
  destination: string;
  title: string;
  image: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  trip_type: string;
  message: string;
  flagged: boolean;
  flag_reason: string;
  status: LeadStatus;
  created_at: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  caribbean: 'Caribbean',
  disney: 'Disney',
  cruise: 'Cruises',
  wellness: 'Wellness',
  tips: 'Planning Tips',
};

export const CATEGORY_OPTIONS: { value: PostCategory; label: string }[] = [
  { value: 'caribbean', label: 'Caribbean' },
  { value: 'disney', label: 'Disney & Parks' },
  { value: 'cruise', label: 'Cruises' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'tips', label: 'Planning Tips' },
];
