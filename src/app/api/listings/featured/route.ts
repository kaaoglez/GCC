import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mapListingToDTO } from '../route';

// GET /api/listings/featured
export async function GET() {
  try {
    const listings = await db.listing.findMany({
      where: {
        status: 'ACTIVE',
        tier: { not: 'FREE' },
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
      orderBy: [
        { bumpedAt: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' },
      ],
      // No limit — all paid listings must appear for fairness
    });

    const data = listings.map(mapListingToDTO);

    return NextResponse.json(data);
  } catch (error) {
    console.error('[GET /api/listings/featured]', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured listings' },
      { status: 500 }
    );
  }
}
