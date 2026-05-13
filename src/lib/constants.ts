// ═══════════════════════════════════════════════════════════════
// GRAN CANARIA CONECTA - Constants & Configuration
// Single source of truth for categories, icons, and app config
// ═══════════════════════════════════════════════════════════════

import type { DynamicField, TranslationString } from './types';

// ─────────────────────────────────────────────────────────────
// APP CONFIGURATION
// ─────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  name: 'Gran Canaria Conecta',
  tagline: { es: 'Tu isla, tu comunidad, tu futuro', en: 'Your island, your community, your future' },
  description: {
    es: 'Portal comunitario de Gran Canaria. Anuncios, eventos, noticias y servicios locales con enfoque en sostenibilidad y economía circular.',
    en: 'Gran Canaria community portal. Classifieds, events, news and local services with a focus on sustainability and circular economy.',
  },
  defaultLocale: 'es' as const,
  supportedLocales: ['es', 'en'] as const,
  itemsPerPage: 12,
  featuredItemsCount: 10,
  maxListingImages: 15,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const;

// ─────────────────────────────────────────────────────────────
// SITE URLS
// ─────────────────────────────────────────────────────────────

export const SITE_URLS = {
  instagram: 'https://instagram.com/granCanariaConecta',
  facebook: 'https://facebook.com/granCanariaConecta',
  twitter: 'https://twitter.com/gcConecta',
  whatsapp: 'https://wa.me/34XXXXXXXXX',
  email: 'info@grancanariaconecta.com',
} as const;

// ─────────────────────────────────────────────────────────────
// CATEGORY SEED DATA
// Organized hierarchically. Parent categories have parentId: null.
// ═══════════════════════════════════════════════════════════════

interface CategorySeed {
  slug: string;
  nameEs: string;
  nameEn: string;
  descEs?: string;
  descEn?: string;
  icon: string;
  color: string;
  parentId?: string;
  sortOrder: number;
  isPaid?: boolean;
  price?: number;
  highlightPrice?: number;
  vipPrice?: number;
  allowedFields?: DynamicField[];
  showPrice?: boolean;
  showLocation?: boolean;
  showImages?: boolean;
  maxImages?: number;
  expiryDays?: number;
}

export const CATEGORY_SEED: CategorySeed[] = [
  // ── CIRCULAR ECONOMY (Free) ──────────────────────────────
  {
    slug: 'economia-circular',
    nameEs: 'Economía Circular',
    nameEn: 'Circular Economy',
    descEs: 'Regalo, intercambio y reutilización',
    descEn: 'Giveaway, exchange and reuse',
    icon: 'recycle',
    color: '#52B788',
    sortOrder: 1,
  },
  {
    slug: 'regalo-intercambio',
    nameEs: 'Regalo e Intercambio',
    nameEn: 'Freecycle & Trade',
    descEs: 'Cosas gratis o para intercambiar',
    descEn: 'Free items or trade',
    icon: 'gift',
    color: '#52B788',
    parentId: 'economia-circular',
    sortOrder: 1,
    showPrice: false,
    allowedFields: [
      { key: 'condition', type: 'select', labelEs: 'Estado', labelEn: 'Condition', options: ['nuevo', 'usado', 'regular'], required: true },
    ],
  },
  {
    slug: 'materiales-construccion',
    nameEs: 'Materiales de Construcción',
    nameEn: 'Building Materials',
    descEs: 'Materiales reciclados o sobrantes',
    descEn: 'Recycled or leftover materials',
    icon: 'hammer',
    color: '#6B7280',
    parentId: 'economia-circular',
    sortOrder: 2,
    allowedFields: [
      { key: 'condition', type: 'select', labelEs: 'Estado', labelEn: 'Condition', options: ['nuevo', 'usado', 'regular'], required: true },
      { key: 'quantity', type: 'text', labelEs: 'Cantidad', labelEn: 'Quantity' },
    ],
  },
  {
    slug: 'muebles-hogar',
    nameEs: 'Muebles y Hogar',
    nameEn: 'Furniture & Home',
    descEs: 'Muebles, decoración y artículos del hogar',
    descEn: 'Furniture, decoration and home items',
    icon: 'armchair',
    color: '#DDA15E',
    parentId: 'economia-circular',
    sortOrder: 3,
    allowedFields: [
      { key: 'condition', type: 'select', labelEs: 'Estado', labelEn: 'Condition', options: ['nuevo', 'usado', 'regular', 'para restaurar'], required: true },
      { key: 'dimensions', type: 'text', labelEs: 'Dimensiones', labelEn: 'Dimensions' },
      { key: 'material', type: 'text', labelEs: 'Material', labelEn: 'Material' },
    ],
  },
  {
    slug: 'ropa-accesorios',
    nameEs: 'Ropa y Accesorios',
    nameEn: 'Clothing & Accessories',
    descEs: 'Ropa, calzado y accesorios de segunda mano',
    descEn: 'Second-hand clothing, shoes and accessories',
    icon: 'shirt',
    color: '#E76F51',
    parentId: 'economia-circular',
    sortOrder: 4,
    allowedFields: [
      { key: 'condition', type: 'select', labelEs: 'Estado', labelEn: 'Condition', options: ['nuevo', 'casi nuevo', 'usado'], required: true },
      { key: 'size', type: 'text', labelEs: 'Talla', labelEn: 'Size' },
    ],
  },
  {
    slug: 'electronica',
    nameEs: 'Electrónica',
    nameEn: 'Electronics',
    descEs: 'Dispositivos, aparatos y componentes',
    descEn: 'Devices, appliances and components',
    icon: 'smartphone',
    color: '#457B9D',
    parentId: 'economia-circular',
    sortOrder: 5,
    allowedFields: [
      { key: 'condition', type: 'select', labelEs: 'Estado', labelEn: 'Condition', options: ['nuevo', 'casi nuevo', 'usado', 'para piezas'], required: true },
      { key: 'brand', type: 'text', labelEs: 'Marca', labelEn: 'Brand' },
    ],
  },
  {
    slug: 'bicicletas',
    nameEs: 'Bicicletas',
    nameEn: 'Bicycles',
    descEs: 'Bicis, piezas y accesorios',
    descEn: 'Bikes, parts and accessories',
    icon: 'bike',
    color: '#2D6A4F',
    parentId: 'economia-circular',
    sortOrder: 6,
    allowedFields: [
      { key: 'condition', type: 'select', labelEs: 'Estado', labelEn: 'Condition', options: ['nuevo', 'usado', 'para reparar'], required: true },
      { key: 'type', type: 'select', labelEs: 'Tipo', labelEn: 'Type', options: ['urbana', 'montaña', 'carretera', 'plegable', 'eléctrica'] },
      { key: 'size', type: 'text', labelEs: 'Talla', labelEn: 'Size' },
    ],
  },
  {
    slug: 'libros',
    nameEs: 'Libros',
    nameEn: 'Books',
    descEs: 'Libros, revistas y material educativo',
    descEn: 'Books, magazines and educational material',
    icon: 'book-open',
    color: '#9B5DE5',
    parentId: 'economia-circular',
    sortOrder: 7,
    showPrice: false,
    allowedFields: [
      { key: 'condition', type: 'select', labelEs: 'Estado', labelEn: 'Condition', options: ['nuevo', 'como nuevo', 'usado'], required: true },
      { key: 'genre', type: 'text', labelEs: 'Género', labelEn: 'Genre' },
    ],
  },
  {
    slug: 'juguetes-juegos',
    nameEs: 'Juguetes y Juegos',
    nameEn: 'Toys & Games',
    descEs: 'Juguetes, juegos de mesa y deporte',
    descEn: 'Toys, board games and sports',
    icon: 'gamepad-2',
    color: '#F72585',
    parentId: 'economia-circular',
    sortOrder: 8,
    allowedFields: [
      { key: 'condition', type: 'select', labelEs: 'Estado', labelEn: 'Condition', options: ['nuevo', 'usado'], required: true },
      { key: 'ageRange', type: 'text', labelEs: 'Rango de edad', labelEn: 'Age range' },
    ],
  },
  {
    slug: 'herramientas',
    nameEs: 'Herramientas',
    nameEn: 'Tools',
    descEs: 'Herramientas de mano, eléctricas y jardín',
    descEn: 'Hand tools, power tools and garden',
    icon: 'wrench',
    color: '#6B4226',
    parentId: 'economia-circular',
    sortOrder: 9,
    allowedFields: [
      { key: 'condition', type: 'select', labelEs: 'Estado', labelEn: 'Condition', options: ['nuevo', 'usado'], required: true },
    ],
  },

  // ── VEHICLES ─────────────────────────────────────────────
  {
    slug: 'vehiculos',
    nameEs: 'Vehículos',
    nameEn: 'Vehicles',
    descEs: 'Coches, motos y otros vehículos',
    descEn: 'Cars, motorcycles and other vehicles',
    icon: 'car',
    color: '#1D3557',
    sortOrder: 2,
    allowedFields: [
      { key: 'condition', type: 'select', labelEs: 'Estado', labelEn: 'Condition', options: ['nuevo', 'seminuevo', 'usado', 'para piezas'], required: true },
      { key: 'brand', type: 'text', labelEs: 'Marca', labelEn: 'Brand', required: true },
      { key: 'model', type: 'text', labelEs: 'Modelo', labelEn: 'Model', required: true },
      { key: 'year', type: 'number', labelEs: 'Año', labelEn: 'Year', min: 1900, max: 2030 },
      { key: 'fuel', type: 'select', labelEs: 'Combustible', labelEn: 'Fuel', options: ['gasolina', 'diésel', 'eléctrico', 'híbrido', 'GLP'] },
      { key: 'km', type: 'number', labelEs: 'Kilómetros', labelEn: 'Kilometers' },
    ],
    maxImages: 10,
  },

  // ── HOUSING ──────────────────────────────────────────────
  {
    slug: 'vivienda',
    nameEs: 'Vivienda',
    nameEn: 'Housing',
    descEs: 'Alquiler, venta y compartición de vivienda',
    descEn: 'Rent, sale and flatsharing',
    icon: 'home',
    color: '#264653',
    sortOrder: 3,
  },
  {
    slug: 'vivienda-alquiler',
    nameEs: 'Alquiler',
    nameEn: 'For Rent',
    icon: 'key',
    color: '#2A9D8F',
    parentId: 'vivienda',
    sortOrder: 1,
    allowedFields: [
      { key: 'type', type: 'select', labelEs: 'Tipo', labelEn: 'Type', options: ['piso', 'casa', 'habitación', 'estudio', 'local'], required: true },
      { key: 'bedrooms', type: 'number', labelEs: 'Habitaciones', labelEn: 'Bedrooms', min: 0, max: 20 },
      { key: 'bathrooms', type: 'number', labelEs: 'Baños', labelEn: 'Bathrooms', min: 1, max: 10 },
      { key: 'area', type: 'number', labelEs: 'Superficie m²', labelEn: 'Area m²' },
      { key: 'furnished', type: 'boolean', labelEs: 'Amueblado', labelEn: 'Furnished' },
      { key: 'pets', type: 'boolean', labelEs: 'Admiten mascotas', labelEn: 'Pets allowed' },
      { key: 'longTerm', type: 'boolean', labelEs: 'Larga temporada', labelEn: 'Long term' },
    ],
  },
  {
    slug: 'vivienda-venta',
    nameEs: 'Venta',
    nameEn: 'For Sale',
    icon: 'building',
    color: '#E76F51',
    parentId: 'vivienda',
    sortOrder: 2,
    allowedFields: [
      { key: 'type', type: 'select', labelEs: 'Tipo', labelEn: 'Type', options: ['piso', 'casa', 'chalet', 'terreno', 'local', 'garaje'], required: true },
      { key: 'bedrooms', type: 'number', labelEs: 'Habitaciones', labelEn: 'Bedrooms' },
      { key: 'bathrooms', type: 'number', labelEs: 'Baños', labelEn: 'Bathrooms' },
      { key: 'area', type: 'number', labelEs: 'Superficie m²', labelEn: 'Area m²' },
      { key: 'pool', type: 'boolean', labelEs: 'Piscina', labelEn: 'Pool' },
      { key: 'garden', type: 'boolean', labelEs: 'Jardín', labelEn: 'Garden' },
      { key: 'parking', type: 'boolean', labelEs: 'Garaje', labelEn: 'Parking' },
    ],
    maxImages: 10,
  },
  {
    slug: 'vivienda-compartir',
    nameEs: 'Compartir / Compañía',
    nameEn: 'Flatshare / Roommates',
    icon: 'users',
    color: '#457B9D',
    parentId: 'vivienda',
    sortOrder: 3,
    allowedFields: [
      { key: 'type', type: 'select', labelEs: 'Tipo', labelEn: 'Type', options: ['busco habitación', 'ofrezco habitación', 'busco compañero/a', 'intercambio temporal'], required: true },
      { key: 'budget', type: 'number', labelEs: 'Presupuesto máximo €/mes', labelEn: 'Max budget €/month' },
      { key: 'preferences', type: 'text', labelEs: 'Preferencias', labelEn: 'Preferences' },
    ],
  },

  // ── BUSINESS & SERVICES (PAID) ───────────────────────────
  {
    slug: 'negocios-servicios',
    nameEs: 'Negocios y Servicios',
    nameEn: 'Business & Services',
    descEs: 'Directorio de negocios y profesionales locales',
    descEn: 'Local business and professional directory',
    icon: 'store',
    color: '#7C3AED',
    sortOrder: 4,
    isPaid: true,
    price: 25,
    highlightPrice: 10,
    vipPrice: 30,
  },
  {
    slug: 'restaurantes-catering',
    nameEs: 'Restaurantes y Catering',
    nameEn: 'Restaurants & Catering',
    descEs: 'Gastronomía local, restaurantes y servicios de catering',
    descEn: 'Local gastronomy, restaurants and catering services',
    icon: 'utensils',
    color: '#DC2626',
    parentId: 'negocios-servicios',
    sortOrder: 1,
    isPaid: true,
    price: 20,
    allowedFields: [
      { key: 'cuisine', type: 'text', labelEs: 'Tipo de cocina', labelEn: 'Cuisine type' },
      { key: 'phone', type: 'text', labelEs: 'Teléfono', labelEn: 'Phone', required: true },
      { key: 'website', type: 'url', labelEs: 'Web', labelEn: 'Website' },
      { key: 'hours', type: 'text', labelEs: 'Horario', labelEn: 'Hours' },
      { key: 'delivery', type: 'boolean', labelEs: 'Domicilio', labelEn: 'Delivery' },
      { key: 'terrace', type: 'boolean', labelEs: 'Terraza', labelEn: 'Terrace' },
      { key: 'isEco', type: 'boolean', labelEs: 'Km 0 / Ecológico', labelEn: 'Km 0 / Eco' },
    ],
    maxImages: 10,
  },
  {
    slug: 'salud-bienestar',
    nameEs: 'Salud y Bienestar',
    nameEn: 'Health & Wellness',
    descEs: 'Centros de salud, terapias y bienestar',
    descEn: 'Health centers, therapies and wellness',
    icon: 'heart-pulse',
    color: '#EC4899',
    parentId: 'negocios-servicios',
    sortOrder: 2,
    isPaid: true,
    price: 25,
    allowedFields: [
      { key: 'specialty', type: 'text', labelEs: 'Especialidad', labelEn: 'Specialty' },
      { key: 'phone', type: 'text', labelEs: 'Teléfono', labelEn: 'Phone', required: true },
      { key: 'website', type: 'url', labelEs: 'Web', labelEn: 'Website' },
      { key: 'hours', type: 'text', labelEs: 'Horario', labelEn: 'Hours' },
      { key: 'homeVisit', type: 'boolean', labelEs: 'Visita a domicilio', labelEn: 'Home visit' },
    ],
  },
  {
    slug: 'servicios-profesionales',
    nameEs: 'Servicios Profesionales',
    nameEn: 'Professional Services',
    descEs: 'Fontaneros, electricistas, constructores y más',
    descEn: 'Plumbers, electricians, builders and more',
    icon: 'briefcase',
    color: '#2563EB',
    parentId: 'negocios-servicios',
    sortOrder: 3,
    isPaid: true,
    price: 20,
    allowedFields: [
      { key: 'specialty', type: 'text', labelEs: 'Especialidad', labelEn: 'Specialty', required: true },
      { key: 'phone', type: 'text', labelEs: 'Teléfono', labelEn: 'Phone', required: true },
      { key: 'website', type: 'url', labelEs: 'Web', labelEn: 'Website' },
      { key: 'hours', type: 'text', labelEs: 'Horario', labelEn: 'Hours' },
      { key: 'emergency', type: 'boolean', labelEs: 'Urgencias 24h', labelEn: '24h Emergency' },
      { key: 'certified', type: 'boolean', labelEs: 'Certificado', labelEn: 'Certified' },
    ],
  },
  {
    slug: 'agricultura-local',
    nameEs: 'Agricultura y Productos Locales',
    nameEn: 'Local Farming & Products',
    descEs: 'Productos de la tierra, granjas y mercados',
    descEn: 'Farm products, farms and markets',
    icon: 'sprout',
    color: '#65A30D',
    parentId: 'negocios-servicios',
    sortOrder: 4,
    isPaid: true,
    price: 15,
    allowedFields: [
      { key: 'products', type: 'text', labelEs: 'Productos', labelEn: 'Products' },
      { key: 'organic', type: 'boolean', labelEs: 'Ecológico', labelEn: 'Organic' },
      { key: 'phone', type: 'text', labelEs: 'Teléfono', labelEn: 'Phone' },
      { key: 'hours', type: 'text', labelEs: 'Horario', labelEn: 'Hours' },
      { key: 'delivery', type: 'boolean', labelEs: 'Domicilio', labelEn: 'Delivery' },
    ],
  },
  {
    slug: 'turismo-sostenible',
    nameEs: 'Turismo Sostenible',
    nameEn: 'Sustainable Tourism',
    descEs: 'Experiencias ecológicas, rutas y actividades',
    descEn: 'Eco experiences, routes and activities',
    icon: 'mountain',
    color: '#0891B2',
    parentId: 'negocios-servicios',
    sortOrder: 5,
    isPaid: true,
    price: 20,
    allowedFields: [
      { key: 'activityType', type: 'select', labelEs: 'Tipo de actividad', labelEn: 'Activity type', options: ['ruta', 'taller', 'excursión', 'alojamiento', 'deporte', 'otro'] },
      { key: 'phone', type: 'text', labelEs: 'Teléfono', labelEn: 'Phone' },
      { key: 'website', type: 'url', labelEs: 'Web', labelEn: 'Website' },
      { key: 'priceRange', type: 'select', labelEs: 'Rango de precio', labelEn: 'Price range', options: ['gratuito', 'económico', 'medio', 'premium'] },
      { key: 'difficulty', type: 'select', labelEs: 'Dificultad', labelEn: 'Difficulty', options: ['fácil', 'moderada', 'difícil', 'experto'] },
    ],
    maxImages: 10,
  },

  // ── JOBS ─────────────────────────────────────────────────
  {
    slug: 'empleo',
    nameEs: 'Empleo',
    nameEn: 'Jobs',
    descEs: 'Ofertas de trabajo y servicios',
    descEn: 'Job offers and services',
    icon: 'briefcase',
    color: '#0D9488',
    sortOrder: 5,
    allowedFields: [
      { key: 'jobType', type: 'select', labelEs: 'Tipo', labelEn: 'Type', options: ['fijo', 'temporal', 'autónomo', 'prácticas', 'voluntario'], required: true },
      { key: 'sector', type: 'text', labelEs: 'Sector', labelEn: 'Sector', required: true },
      { key: 'experience', type: 'select', labelEs: 'Experiencia', labelEn: 'Experience', options: ['sin experiencia', 'junior', 'medio', 'senior'] },
      { key: 'remote', type: 'boolean', labelEs: 'Teletrabajo', labelEn: 'Remote' },
    ],
  },

  // ── COMMUNITY ────────────────────────────────────────────
  {
    slug: 'comunidad',
    nameEs: 'Comunidad',
    nameEn: 'Community',
    descEs: 'Eventos, actividades y vida comunitaria',
    descEn: 'Events, activities and community life',
    icon: 'users',
    color: '#6366F1',
    sortOrder: 6,
  },
  {
    slug: 'mascotas',
    nameEs: 'Mascotas',
    nameEn: 'Pets',
    descEs: 'Adopciones, cuidadores y servicios para mascotas',
    descEn: 'Adoptions, pet sitting and pet services',
    icon: 'paw-print',
    color: '#D97706',
    parentId: 'comunidad',
    sortOrder: 1,
    allowedFields: [
      { key: 'animalType', type: 'select', labelEs: 'Tipo', labelEn: 'Type', options: ['perro', 'gato', 'pájaro', 'reptil', 'pez', 'otro'], required: true },
      { key: 'listingType', type: 'select', labelEs: 'Tipo de anuncio', labelEn: 'Listing type', options: ['adopción', 'se pierde/encontró', 'cuidador', 'accesorios', 'servicio'], required: true },
      { key: 'breed', type: 'text', labelEs: 'Raza', labelEn: 'Breed' },
      { key: 'age', type: 'text', labelEs: 'Edad', labelEn: 'Age' },
    ],
  },
  {
    slug: 'perdidos-encontrados',
    nameEs: 'Perdidos y Encontrados',
    nameEn: 'Lost & Found',
    descEs: 'Objetos y mascotas perdidas o encontradas',
    descEn: 'Lost or found items and pets',
    icon: 'search',
    color: '#F59E0B',
    parentId: 'comunidad',
    sortOrder: 2,
    showPrice: false,
    allowedFields: [
      { key: 'listingType', type: 'select', labelEs: 'Tipo', labelEn: 'Type', options: ['se perdió', 'se encontró', 'se robó'], required: true },
      { key: 'date', type: 'date', labelEs: 'Fecha', labelEn: 'Date', required: true },
      { key: 'location', type: 'text', labelEs: 'Dónde', labelEn: 'Where' },
    ],
  },
  {
    slug: 'voluntarios',
    nameEs: 'Voluntarios',
    nameEn: 'Volunteers',
    descEs: 'Busco voluntarios / Ofrezco voluntariado',
    descEn: 'Looking for volunteers / Offering to volunteer',
    icon: 'heart-handshake',
    color: '#EC4899',
    parentId: 'comunidad',
    sortOrder: 3,
    showPrice: false,
    allowedFields: [
      { key: 'volunteerType', type: 'select', labelEs: 'Tipo', labelEn: 'Type', options: ['ambiental', 'social', 'animal', 'cultural', 'educativo', 'otro'], required: true },
      { key: 'commitment', type: 'select', labelEs: 'Compromiso', labelEn: 'Commitment', options: ['puntual', 'semanal', 'mensual', 'temporal'] },
    ],
  },
  {
    slug: 'preguntas-recomendaciones',
    nameEs: 'Preguntas y Recomendaciones',
    nameEn: 'Questions & Recommendations',
    descEs: 'Pregunta a la comunidad o recomienda algo',
    descEn: 'Ask the community or recommend something',
    icon: 'message-circle',
    color: '#8B5CF6',
    parentId: 'comunidad',
    sortOrder: 4,
    showPrice: false,
  },
  {
    slug: 'noticias-comunitarias',
    nameEs: 'Noticias Comunitarias',
    nameEn: 'Community News',
    descEs: 'Anuncios de interés general',
    descEn: 'General interest announcements',
    icon: 'megaphone',
    color: '#64748B',
    parentId: 'comunidad',
    sortOrder: 5,
    showPrice: false,
  },
];

// ─────────────────────────────────────────────────────────────
// NAVIGATION CONFIGURATION
// ─────────────────────────────────────────────────────────────

export const NAV_ITEMS: TranslationString[] = [
  { es: 'Anuncios', en: 'Classifieds' },
  { es: 'Categorías', en: 'Categories' },
  { es: 'Eventos', en: 'Events' },
  { es: 'Noticias', en: 'News' },
  { es: 'Directorio', en: 'Directory' },
  { es: 'Reciclaje', en: 'Recycling' },
];

// ─────────────────────────────────────────────────────────────
// FOOTER LINKS
// ─────────────────────────────────────────────────────────────

export const FOOTER_LINKS = {
  about: [
    { es: 'Sobre nosotros', en: 'About us' },
    { es: 'Contacto', en: 'Contact' },
    { es: 'Cómo funciona', en: 'How it works' },
    { es: 'Precios', en: 'Pricing' },
  ],
  resources: [
    { es: 'Puntos de reciclaje', en: 'Recycling points' },
    { es: 'Guía eco', en: 'Eco guide' },
    { es: 'Transporte', en: 'Transport' },
    { es: 'Clima y playas', en: 'Weather & beaches' },
  ],
  legal: [
    { es: 'Términos de uso', en: 'Terms of use' },
    { es: 'Privacidad', en: 'Privacy' },
    { es: 'Cookies', en: 'Cookies' },
    { es: 'Aviso legal', en: 'Legal notice' },
  ],
};

// ─────────────────────────────────────────────────────────────
// EVENT CATEGORIES
// ─────────────────────────────────────────────────────────────

export const EVENT_CATEGORIES: Record<string, TranslationString> = {
  WORKSHOP:   { es: 'Talleres', en: 'Workshops' },
  CLEANUP:    { es: 'Limpiezas', en: 'Cleanups' },
  MARKET:     { es: 'Mercados', en: 'Markets' },
  CONCERT:    { es: 'Conciertos', en: 'Concerts' },
  SPORT:      { es: 'Deporte', en: 'Sports' },
  COMMUNITY:  { es: 'Comunidad', en: 'Community' },
  CULTURE:    { es: 'Cultura', en: 'Culture' },
  OTHER:      { es: 'Otros', en: 'Other' },
};

// ─────────────────────────────────────────────────────────────
// ARTICLE CATEGORIES
// ─────────────────────────────────────────────────────────────

export const ARTICLE_CATEGORIES: Record<string, TranslationString> = {
  ENVIRONMENT:    { es: 'Medio Ambiente', en: 'Environment' },
  COMMUNITY:      { es: 'Comunidad', en: 'Community' },
  BUSINESS:       { es: 'Negocios', en: 'Business' },
  SUSTAINABILITY: { es: 'Sostenibilidad', en: 'Sustainability' },
  TOURISM:        { es: 'Turismo', en: 'Tourism' },
  GENERAL:        { es: 'General', en: 'General' },
};

// ─────────────────────────────────────────────────────────────
// COMMUNITY STATS (demo data)
// ─────────────────────────────────────────────────────────────

export const DEMO_STATS = [
  { statKey: 'total_listings', statValue: 2847, statLabelEs: 'Anuncios publicados', statLabelEn: 'Published listings', icon: 'file-text' },
  { statKey: 'active_users', statValue: 1523, statLabelEs: 'Usuarios activos', statLabelEn: 'Active users', icon: 'users' },
  { statKey: 'kg_recycled', statValue: 48520, statLabelEs: 'Kg reciclados', statLabelEn: 'Kg recycled', icon: 'recycle' },
  { statKey: 'co2_saved', statValue: 12600, statLabelEs: 'Kg CO₂ ahorrados', statLabelEn: 'Kg CO₂ saved', icon: 'leaf' },
  { statKey: 'events_this_month', statValue: 34, statLabelEs: 'Eventos este mes', statLabelEn: 'Events this month', icon: 'calendar' },
  { statKey: 'businesses', statValue: 287, statLabelEs: 'Negocios locales', statLabelEn: 'Local businesses', icon: 'store' },
];
