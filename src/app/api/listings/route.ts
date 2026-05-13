import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type {
  ListingDTO,
  ListingCreateDTO,
  PaginatedResponse,
  CategoryDTO,
  UserSummaryDTO,
  ListingTier,
  ListingStatus,
  Locale,
} from '@/lib/types';

// GET /api/listings?categoryId=&municipality=&tier=&search=&page=&limit=&sortBy=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const categoryId = searchParams.get('categoryId') || undefined;
    const municipality = searchParams.get('municipality') || undefined;
    const tier = searchParams.get('tier') as ListingTier | null;
    const search = searchParams.get('search') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const sortBy = (searchParams.get('sortBy') as ListingDTO['tier'] | 'newest' | 'oldest' | 'popular') || 'newest';

    // Build where clause
    const where: Record<string, unknown> = { status: 'ACTIVE' };

    if (categoryId) {
      // Include listings from this category and its children
      const categoryWithChildren = await db.category.findMany({
        where: {
          OR: [
            { id: categoryId },
            { parentId: categoryId },
          ],
        },
        select: { id: true },
      });
      const categoryIds = categoryWithChildren.map((c) => c.id);
      if (categoryIds.length > 0) {
        where.categoryId = { in: categoryIds };
      }
    }

    if (municipality) {
      where.municipality = municipality;
    }

    if (tier) {
      where.tier = tier;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Build orderBy
    let orderBy: Record<string, string> = { createdAt: 'desc' };
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'popular':
        orderBy = { viewCount: 'desc' };
        break;
      case 'price_asc':
        // For price sorting we'd need to access metadata JSON — simplified approach
        orderBy = { createdAt: 'asc' };
        break;
      case 'price_desc':
        orderBy = { createdAt: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Fetch paginated data
    const [listings, total] = await Promise.all([
      db.listing.findMany({
        where,
        include: {
          category: true,
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
              municipality: true,
              isVerified: true,
              role: true,
              businessName: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.listing.count({ where }),
    ]);

    const data: ListingDTO[] = listings.map(mapListingToDTO);

    const response: PaginatedResponse<ListingDTO> = {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[GET /api/listings]', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

// POST /api/listings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { title, description, categoryId, authorId, tier } = body;

    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, categoryId' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await db.category.findUnique({
      where: { id: categoryId, isActive: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found or inactive' },
        { status: 404 }
      );
    }

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    let slug = baseSlug;
    let counter = 1;
    while (await db.listing.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Calculate expiry date
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + category.expiryDays);

    // Build create DTO
    const createDTO: ListingCreateDTO = {
      title,
      description,
      categoryId,
      tier: tier || 'FREE',
      metadata: body.metadata || {},
      images: body.images || [],
      municipality: body.municipality,
      location: body.location,
      lat: body.lat,
      lng: body.lng,
      showPhone: body.showPhone ?? false,
      showEmail: body.showEmail ?? true,
      contactMethod: body.contactMethod || 'message',
    };

    const listing = await db.listing.create({
      data: {
        slug,
        title: createDTO.title,
        description: createDTO.description,
        categoryId: createDTO.categoryId,
        authorId: authorId || 'default', // In production, get from session
        tier: createDTO.tier,
        metadata: JSON.stringify(createDTO.metadata),
        images: JSON.stringify(createDTO.images),
        municipality: createDTO.municipality,
        location: createDTO.location,
        lat: createDTO.lat,
        lng: createDTO.lng,
        status: 'ACTIVE',
        expiresAt,
        publishedAt: new Date(),
        showPhone: createDTO.showPhone,
        showEmail: createDTO.showEmail,
        contactMethod: createDTO.contactMethod,
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            municipality: true,
            isVerified: true,
            role: true,
            businessName: true,
          },
        },
      },
    });

    return NextResponse.json(mapListingToDTO(listing), { status: 201 });
  } catch (error) {
    console.error('[POST /api/listings]', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

// Shared mapper: Prisma listing -> ListingDTO
export function mapListingToDTO(listing: {
  id: string;
  slug: string;
  title: string;
  description: string;
  categoryId: string;
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
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
    municipality: string | null;
    isVerified: boolean;
    role: string;
    businessName: string | null;
  };
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
}): ListingDTO {
  let metadata: Record<string, unknown> = {};
  try {
    metadata = JSON.parse(listing.metadata || '{}');
  } catch {
    metadata = {};
  }

  let images: string[] = [];
  try {
    images = JSON.parse(listing.images || '[]');
  } catch {
    images = [];
  }

  let allowedFields: CategoryDTO['allowedFields'] = [];
  try {
    allowedFields = JSON.parse(listing.category.allowedFields || '[]');
  } catch {
    allowedFields = [];
  }

  const author: UserSummaryDTO = {
    id: listing.author.id,
    name: listing.author.name,
    avatar: listing.author.avatar ?? undefined,
    municipality: listing.author.municipality ?? undefined,
    isVerified: listing.author.isVerified,
    role: listing.author.role as ListingDTO['author']['role'],
    businessName: listing.author.businessName ?? undefined,
  };

  const category: CategoryDTO = {
    id: listing.category.id,
    slug: listing.category.slug,
    nameEs: listing.category.nameEs,
    nameEn: listing.category.nameEn,
    descEs: listing.category.descEs ?? undefined,
    descEn: listing.category.descEn ?? undefined,
    icon: listing.category.icon,
    color: listing.category.color,
    parentId: listing.category.parentId ?? undefined,
    sortOrder: listing.category.sortOrder,
    isActive: listing.category.isActive,
    isPaid: listing.category.isPaid,
    price: listing.category.price ?? undefined,
    highlightPrice: listing.category.highlightPrice ?? undefined,
    vipPrice: listing.category.vipPrice ?? undefined,
    allowedFields,
    showPrice: listing.category.showPrice,
    showLocation: listing.category.showLocation,
    showImages: listing.category.showImages,
    maxImages: listing.category.maxImages,
    expiryDays: listing.category.expiryDays,
  };

  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    description: listing.description,
    categoryId: listing.categoryId,
    category,
    authorId: listing.authorId,
    author,
    tier: listing.tier as ListingDTO['tier'],
    metadata,
    images,
    municipality: listing.municipality ?? undefined,
    location: listing.location ?? undefined,
    lat: listing.lat ?? undefined,
    lng: listing.lng ?? undefined,
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
    // Computed from metadata
    price: (metadata.price as number) ?? undefined,
    condition: (metadata.condition as string) ?? undefined,
  };
}
