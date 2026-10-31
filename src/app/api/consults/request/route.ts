import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { slot = 'TODAY_MORNING', symptoms = [], chiefComplaint = '' } = body;

    let profileId = body.patientProfileId;
    if (!profileId && user) {
      const profile = await prisma.patientProfile.findUnique({
        where: { userId: user.userId },
      });
      profileId = profile?.id;
    }

    if (!profileId) {
      // Find default demo patient
      const demoPatient = await prisma.patientProfile.findFirst();
      profileId = demoPatient?.id;
    }

    if (!profileId) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    // Assign on-call doctor
    const doctor = await prisma.user.findFirst({
      where: { role: 'DOCTOR' },
    });

    const consult = await prisma.consultRequest.create({
      data: {
        patientProfileId: profileId,
        doctorId: doctor?.id || null,
        preferredSlot: slot,
        chiefComplaint:
          chiefComplaint ||
          (Array.isArray(symptoms) ? symptoms.join(', ') : 'टेलीकंसल्टेशन डॉक्टर सलाह अनुरोध'),
        status: 'REQUESTED',
      },
    });

    return NextResponse.json({ success: true, consult });
  } catch (error) {
    console.error('Error creating consult request:', error);
    return NextResponse.json({ error: 'Failed to create consult request' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    const where: any = {};
    if (user?.role === 'DOCTOR') {
      where.OR = [{ doctorId: user.userId }, { doctorId: null }];
    } else if (user?.role === 'PATIENT') {
      where.patientProfile = { userId: user.userId };
    }

    const consults = await prisma.consultRequest.findMany({
      where,
      include: {
        patientProfile: {
          include: {
            user: {
              select: { name: true, phone: true, village: true, district: true },
            },
          },
        },
        doctor: {
          select: { name: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, consults });
  } catch (error) {
    console.error('Error fetching consults:', error);
    return NextResponse.json({ error: 'Failed to fetch consults' }, { status: 500 });
  }
}
