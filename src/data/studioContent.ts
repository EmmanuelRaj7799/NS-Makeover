export type PageRoute = '/' | '/specialties' | '/services' | '/founders' | '/book';

export interface NavItem {
  label: string;
  path: PageRoute;
  tagline: string;
  description: string;
}

export interface SpecialtyItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  serviceMatch: ServiceName;
  highlights: string[];
  craftSteps: string[];
}

export type ServiceName =
  | 'HD Bridal Makeup'
  | 'Party Makeup'
  | 'Professional Hair Styling'
  | 'Traditional & Modern Saree Draping'
  | 'Bridal & Event Packages';

export type ServiceCategoryFilter = 'All' | 'Bridal' | 'Styling & Draping' | 'Packages';

export interface ServiceItem {
  id: string;
  number: string;
  name: ServiceName;
  category: string;
  filterGroup: Exclude<ServiceCategoryFilter, 'All'>;
  description: string;
  idealFor: string;
  featured?: boolean;
}

export interface FounderItem {
  id: string;
  name: string;
  monogram: string;
  role: string;
  focus: string;
  bio: string;
  signatureNote: string;
}

export const STUDIO_CONTACT = {
  brandName: 'NS Makeover',
  tagline: 'Beauty • Elegance • Perfection',
  slogan: 'Make Every Occasion Beautiful with NS Makeover',
  quote: 'Because Every Bride Deserves a Perfect Look.',
  contactPerson: 'Suzan (Hema Suzan)',
  phoneDisplay: '+91 63005 64531',
  phoneHref: 'tel:+916300564531',
  whatsappNumber: '916300564531',
  whatsappBaseUrl: 'https://wa.me/916300564531',
  crestImagePath: '/assets/aistudio/Gemini_Generated_Image_x3bpkbx3bpkbx3bp_0a1ea82e.png',
  creatorCredit: 'Created by A&I Nexux',
} as const;

export function buildWhatsAppUrl(message: string): string {
  return `${STUDIO_CONTACT.whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS: NavItem[] = [
  {
    label: 'Home',
    path: '/',
    tagline: 'Atelier Entrance',
    description: 'Welcome to NS Makeover — timeless bridal artistry and bespoke styling.',
  },
  {
    label: 'Specialties',
    path: '/specialties',
    tagline: '01 · Core Craft',
    description: 'Explore our signature Bridal Makeup, Hairstyles, and Saree Draping artistry.',
  },
  {
    label: 'Services',
    path: '/services',
    tagline: '02 · Service Menu',
    description: 'Browse HD Bridal Makeup, Party Makeup, Hair Styling, Draping & Packages.',
  },
  {
    label: 'Founders',
    path: '/founders',
    tagline: '03 · The Visionaries',
    description: 'Meet Naveen and Hema Suzan, the founders behind NS Makeover.',
  },
  {
    label: 'Book Now',
    path: '/book',
    tagline: '04 · Reservations',
    description: 'Reserve your date directly with Suzan via WhatsApp or phone.',
  },
];

export const CORE_SPECIALTIES: SpecialtyItem[] = [
  {
    id: 'bridal-makeup',
    number: '01',
    title: 'Bridal Makeup',
    subtitle: 'Signature Couture Artistry',
    description:
      'Flawless, long-lasting makeup to enhance your natural beauty for your special day.',
    serviceMatch: 'HD Bridal Makeup',
    highlights: [
      'Skin-luminous HD finish',
      'Humidity & ceremony resilient',
      'Customized undertone matching',
    ],
    craftSteps: [
      'Deep hydration & breathable skin-prep ritual tailored to your skin type.',
      'Soft-focus HD complexion sculpting with zero cakey flashback under wedding photography.',
      'Harmonized eye artistry and velvet-rose lip finish designed around your bridal jewellery.',
    ],
  },
  {
    id: 'hairstyles',
    number: '02',
    title: 'Hairstyles',
    subtitle: 'Sculpted Floral & Classic',
    description:
      'Elegant bridal hairstyles, trendy looks, traditional styles, and customized hair styling.',
    serviceMatch: 'Professional Hair Styling',
    highlights: [
      'Traditional floral braids',
      'Modern soft-wave updos',
      'Veil & ornament architecture',
    ],
    craftSteps: [
      'Face-framing consultation matching blouse neckline, dupatta, and headpiece.',
      'Weight-balanced traditional poola jada braids, sleek buns, or romantic textured waves.',
      'Secure ornament, fresh jasmine, and veil anchoring built for effortless comfort.',
    ],
  },
  {
    id: 'saree-draping',
    number: '03',
    title: 'Saree Draping',
    subtitle: 'Precision Silk Architecture',
    description:
      'Professional saree draping for weddings, engagements, receptions, and special occasions.',
    serviceMatch: 'Traditional & Modern Saree Draping',
    highlights: [
      'Crisp sculpted box pleats',
      'Kanjeevaram & organza mastery',
      'All-day comfort pinning',
    ],
    craftSteps: [
      'Pre-pleating and steam-sculpted box folding for sharp, camera-perfect zari borders.',
      'Tailored silhouette tucking for Kanjeevaram, Banarasi, tissue, and pastel couture drapes.',
      'Invisible comfort pinning so you glide through rituals and receptions without adjustment.',
    ],
  },
];

export const ALL_SERVICES: ServiceItem[] = [
  {
    id: 'hd-bridal-makeup',
    number: '01',
    name: 'HD Bridal Makeup',
    category: 'Bridal Signature',
    filterGroup: 'Bridal',
    description:
      'Camera-ready, breathable high-definition bridal artistry sculpted to stay radiant from sacred morning rituals through evening receptions.',
    idealFor: 'Muhurtham · Wedding Ceremony · Bridal Portraits',
    featured: true,
  },
  {
    id: 'party-makeup',
    number: '02',
    name: 'Party Makeup',
    category: 'Occasion Glamour',
    filterGroup: 'Bridal',
    description:
      'Refined soft-glam and luminous evening looks designed for bridesmaids, family celebrations, cocktail nights, and festive gatherings.',
    idealFor: 'Sangeet · Cocktail · Bridesmaids & Family',
  },
  {
    id: 'professional-hair-styling',
    number: '03',
    name: 'Professional Hair Styling',
    category: 'Couture Coiffure',
    filterGroup: 'Styling & Draping',
    description:
      'Tailored bridal buns, jasmine-adorned South Indian braids, textured waves, and structural styles designed to hold gracefully for hours.',
    idealFor: 'Traditional Braids · Soft Waves · Floral Updos',
  },
  {
    id: 'saree-draping-service',
    number: '04',
    name: 'Traditional & Modern Saree Draping',
    category: 'Draping Craft',
    filterGroup: 'Styling & Draping',
    description:
      'Immaculate pre-pleating, box folding, and silhouette-flattering traditional or contemporary drapes tailored to heirloom silks and couture fabrics.',
    idealFor: 'Kanjeevaram · Organza · Reception Drapes',
  },
  {
    id: 'bridal-event-packages',
    number: '05',
    name: 'Bridal & Event Packages',
    category: 'Complete Curation',
    filterGroup: 'Packages',
    description:
      'End-to-end styling suites combining HD makeup, bespoke hairstyling, and silk saree draping for engagements, muhurthams, and receptions.',
    idealFor: 'Multi-Event Weddings · Engagement + Reception Suites',
    featured: true,
  },
];

export const SERVICE_NAMES: ServiceName[] = [
  'HD Bridal Makeup',
  'Party Makeup',
  'Professional Hair Styling',
  'Traditional & Modern Saree Draping',
  'Bridal & Event Packages',
];

export const EVENT_TYPES = ['Wedding', 'Engagement', 'Reception', 'Party'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const FOUNDERS: FounderItem[] = [
  {
    id: 'naveen',
    name: 'Naveen',
    monogram: 'N',
    role: 'Co-Founder & Creative Director',
    focus: 'Vision · Guest Experience · Studio Standards',
    bio: 'Guides the signature aesthetic and seamless coordination behind every NS Makeover celebration, ensuring every ceremony unfolds with poise, punctuality, and calm precision.',
    signatureNote:
      'Luxury is felt in the calm before the ceremony—when every detail is prepared ahead of time and the bride can simply breathe and enjoy her day.',
  },
  {
    id: 'hema-suzan',
    name: 'Hema Suzan',
    monogram: 'HS',
    role: 'Co-Founder & Lead Bridal Artist',
    focus: 'Bridal Artistry · Hairstyling · Saree Draping',
    bio: 'Brings an intuitive editorial eye and gentle hand to every bride—harmonizing skin radiance, heirloom jewellery, floral hairstyling, and sculpted silk draping into one timeless look.',
    signatureNote:
      'We never mask a bride’s natural features; we illuminate her grace so she recognizes the most radiant version of herself in every photograph.',
  },
];

export const STUDIO_PILLARS = [
  {
    number: '01',
    title: 'Personalized Consultation',
    detail:
      'Every look begins by studying your outfit palette, jewellery tone, lighting environment, and personal comfort so the final look feels unmistakably yours.',
  },
  {
    number: '02',
    title: 'Timeless Photographic Radiance',
    detail:
      'Balanced skin-first HD techniques designed to glow naturally in person as well as under cinematic wedding cameras from morning through night.',
  },
  {
    number: '03',
    title: 'Calm, Stress-Free Ritual',
    detail:
      'Unhurried timing, meticulous preparation, and warm attentiveness from Naveen and Hema Suzan so getting ready becomes a cherished memory.',
  },
];

export const CONCIERGE_SUGGESTIONS = [
  'What services do you offer?',
  'Tell me about Bridal Packages',
  'Who are the founders?',
  'How do I book an appointment?',
] as const;
