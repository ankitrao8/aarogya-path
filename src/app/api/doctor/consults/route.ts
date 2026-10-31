import { getCurrentUser, logAudit } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Unauthorized. Doctor role required.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, doctorNotes, rxAdvice, status = 'COMPLETED' } = body;

    if (!id) {
      return NextResponse.json({ error: 'Consult ID required' }, { status: 400 });
    }

    const updated = await prisma.consultRequest.update({
      where: { id },
      data: {
        doctorId: user.userId,
        doctorNotes,
        rxAdvice,
        status,
      },
    });

    await logAudit('COMPLETE_CONSULT', 'ConsultRequest', id, user.userId);

    return NextResponse.json({ success: true, consult: updated });
  } catch (error) {
    console.error('Error completing consult:', error);
    return NextResponse.json({ error: 'Failed to update consult' }, { status: 500 });
  }
}
