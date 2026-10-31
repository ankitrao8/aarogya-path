import { getCurrentUser, logAudit } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const level = searchParams.get('level');

    const where: any = {};
    if (status) where.status = status;
    if (level) where.level = level;

    // Role-specific scoping
    if (user?.role === 'ASHA') {
      where.OR = [{ assignedAshaId: user.userId }, { assignedAshaId: null }];
    } else if (user?.role === 'DOCTOR') {
      where.OR = [{ assignedDoctorId: user.userId }, { assignedDoctorId: null }];
    } else if (user?.role === 'PATIENT') {
      where.patientProfile = { userId: user.userId };
    }

    const referrals = await prisma.referral.findMany({
      where,
      include: {
        assessment: true,
        patientProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                village: true,
                district: true,
              },
            },
          },
        },
        facility: true,
        assignedAsha: { select: { id: true, name: true, phone: true } },
        assignedDoctor: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, referrals });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { id, status, clinicalNotes, transportArranged, facilityId } = body;

    if (!id) {
      return NextResponse.json({ error: 'Referral ID is required' }, { status: 400 });
    }

    const updated = await prisma.referral.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(clinicalNotes && { clinicalNotes }),
        ...(transportArranged !== undefined && { transportArranged }),
        ...(facilityId && { facilityId }),
      },
    });

    if (user) {
      await logAudit('UPDATE_STATUS', 'Referral', id, user.userId);
    }

    return NextResponse.json({ success: true, referral: updated });
  } catch (error) {
    console.error('Error updating referral:', error);
    return NextResponse.json({ error: 'Failed to update referral' }, { status: 500 });
  }
}
