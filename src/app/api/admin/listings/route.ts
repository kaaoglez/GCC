import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ListingDTO, ListingStatus, ListingTier, PaginatedResponse, CategoryDTO, UserSummaryDTO } from '@/lib/types';

function mapListingToDTO(listing: {
  id: string;
  slug: string;
  title: string;
  description: string;
  categoryId: string;
  authorId: string;
  tier: string;
  metadata: string;
  images: string;
  municipality: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
  expiresAt: Date | null;
  bumpedAt: Date | null;
  publishedAt: Date | null;
  viewCount: number;
  contactCount: number;
  showPhone: boolean;
  showEmail: boolean;
  contactMethod: string;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    slug: string;
    nameEs: string;
    nameEn: string;
    descEs: string | null;
    descEn: string | null;
    icon: string;
    color: string;
    parentId: string | null;
    sortOrder: number;
    isActive: boolean;
    isPaid: boolean;
    price: number | null;
    highlightPrice: number | null;
    vipPrice: number | null;
    allowedFields: string;
    showPrice: boolean;
    showLocation: boolean;
    showImages: boolean;
    maxImages: number;
    expiryDays: number;
  };
  author: {
    id: string;
    name: string;
    avatar: string | null;
    municipality: string | null;
    isVerified: boolean;
    role: string;
    businessName: string | null;
  };
}): ListingDTO {
  let metadata: Record<string, unknown> = {};
  let images: string[] = [];
  try { metadata = JSON.parse(listing.metadata || '{}'); } catch { /* empty */ }
  try { images = JSON.parse(listing.images || '[]'); } catch { /* empty */ }

  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    description: listing.description,
    categoryId: listing.categoryId,
    category: listing.category as CategoryDTO,
    authorId: listing.authorId,
    author: listing.author as UserSummaryDTO,
    tier: listing.tier as ListingTier,
    metadata,
    images,
    municipality: listing.municipality || undefined,
    location: listing.location || undefined,
    lat: listing.lat || undefined,
    lng: listing.lng || undefined,
    status: listing.status as ListingStatus,
    expiresAt: listing.expiresAt?.toISOString(),
    bumpedAt: listing.bumpedAt?.toISOString(),
    publishedAt: listing.publishedAt?.toISOString(),
    viewCount: listing.viewCount,
    contactCount: listing.contactCount,
    showPhone: listing.showPhone,
    showEmail: listing.showEmail,
    contactMethod: listing.contactMethod as ListingDTO['contactMethod'],
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
    price: (metadata.price as number) ?? undefined,
    condition: (metadata.condition as string) ?? undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const tier = searchParams.get('tier') as ListingTier | null;
    const status = searchParams.get('status') as ListingStatus | null;
    const municipality = searchParams.get('municipality') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const sortBy = searchParams.get('sortBy') || 'newest';

    // Admin can see ALL listings (including DRAFT, EXPIRED)
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (tier) where.tier = tier;
    if (status) where.status = status;
    if (municipality) where.municipality = municipality;

    const orderBy: Record<string, string> = {};
    switch (sortBy) {
      case 'oldest': orderBy.createdAt = 'asc'; break;
      case 'popular': orderBy.viewCount = 'desc'; break;
      default: orderBy.createdAt = 'desc';
    }

    const [listings, total] = await Promise.all([
      db.listing.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: true,
          author: { select: { id: true, name: true, avatar: true, municipality: true, isVerified: true, role: true, businessName: true } },
        },
      }),
      db.listing.count({ where }),
    ]);

    return NextResponse.json({
      data: listings.map(mapListingToDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    } as PaginatedResponse<ListingDTO>);
  } catch (error) {
    console.error('Admin listings error:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}
