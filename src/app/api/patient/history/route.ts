import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: user.userId },
      include: {
        assessments: {
          orderBy: { createdAt: 'desc' },
          include: {
            referrals: {
              include: {
                facility: true,
                assignedDoctor: { select: { name: true, phone: true } },
              },
            },
            followUps: true,
          },
        },
        consultRequests: {
          orderBy: { createdAt: 'desc' },
          include: {
            doctor: { select: { name: true, phone: true } },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      profile: patientProfile,
      assessments: patientProfile?.assessments || [],
      consults: patientProfile?.consultRequests || [],
    });
  } catch (error) {
    console.error('Error fetching patient history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
