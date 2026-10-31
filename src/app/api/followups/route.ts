import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { dispatchReferralAlert } from '@/lib/referral/notifier';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getCurrentUser();

    const where: any = {
      completedAt: null, // Pending checks
    };

    if (user?.role === 'PATIENT') {
      where.assessment = {
        patientProfile: { userId: user.userId },
      };
    }

    const followUps = await prisma.followUp.findMany({
      where,
      include: {
        assessment: {
          include: {
            patientProfile: {
              include: {
                user: { select: { name: true, phone: true, village: true } },
              },
            },
          },
        },
      },
      orderBy: { scheduledFor: 'asc' },
    });

    return NextResponse.json({ success: true, followUps });
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    return NextResponse.json({ error: 'Failed to fetch follow-ups' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, response } = body; // response: 'BETTER' | 'SAME' | 'WORSE'

    if (!id || !['BETTER', 'SAME', 'WORSE'].includes(response)) {
      return NextResponse.json({ error: 'Valid follow-up id and response required' }, { status: 400 });
    }

    const followUp = await prisma.followUp.findUnique({
      where: { id },
      include: {
        assessment: {
          include: {
            patientProfile: {
              include: { user: true },
            },
          },
        },
      },
    });

    if (!followUp) {
      return NextResponse.json({ error: 'Follow-up not found' }, { status: 404 });
    }

    const isWorse = response === 'WORSE';
    let escalated = false;

    if (isWorse) {
      escalated = true;

      // Escalate assessment level
      const currentLevel = followUp.assessment.level;
      const escalatedLevel = currentLevel === 'YELLOW' ? 'ORANGE' : 'RED';

      await prisma.assessment.update({
        where: { id: followUp.assessmentId },
        data: { level: escalatedLevel },
      });

      // Find local ASHA
      const asha = await prisma.user.findFirst({
        where: { role: 'ASHA' },
      });

      // Create high-priority referral if none exists or escalate
      const referral = await prisma.referral.create({
        data: {
          assessmentId: followUp.assessmentId,
          patientProfileId: followUp.assessment.patientProfileId,
          assignedAshaId: asha?.id || null,
          level: escalatedLevel,
          status: 'NEW',
          clinicalNotes: `मरीज ने फॉलो-अप में स्थिति खराब ('WORSE') बताई है। स्तर को बढ़ाकर ${escalatedLevel} किया गया। तत्काल गृह भ्रमण करें।`,
          transportArranged: escalatedLevel === 'RED',
        },
      });

      // Dispatch alert
      await dispatchReferralAlert({
        recipientPhone: asha?.phone || '9876543211',
        recipientRole: 'ASHA',
        patientName: followUp.assessment.patientProfile.user.name,
        level: escalatedLevel as any,
        message: `मरीज की तबीयत बिगड़ गई है (Follow-up: WORSE). स्तर ${escalatedLevel} पर अपग्रेड किया गया है।`,
        referralId: referral.id,
      });
    }

    const updated = await prisma.followUp.update({
      where: { id },
      data: {
        completedAt: new Date(),
        statusResponse: response,
        escalated,
      },
    });

    return NextResponse.json({ success: true, followUp: updated, escalated });
  } catch (error) {
    console.error('Error submitting follow-up response:', error);
    return NextResponse.json({ error: 'Failed to submit follow-up response' }, { status: 500 });
  }
}
