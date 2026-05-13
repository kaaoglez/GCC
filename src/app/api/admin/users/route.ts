import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { listings: true } },
      },
    });

    const result = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      municipality: u.municipality,
      role: u.role,
      language: u.language,
      isVerified: u.isVerified,
      isActive: u.isActive,
      businessName: u.businessName,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
      _count: u._count,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// PATCH /api/admin/users — update user role, verified, active
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role, isVerified, isActive } = body as {
      userId: string;
      role?: string;
      isVerified?: boolean;
      isActive?: boolean;
    };

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (role) updateData.role = role;
    if (typeof isVerified === 'boolean') updateData.isVerified = isVerified;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: { id: user.id, role: user.role, isVerified: user.isVerified, isActive: user.isActive } });
  } catch (error) {
    console.error('Admin update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
