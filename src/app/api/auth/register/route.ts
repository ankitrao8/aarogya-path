import { COOKIE_NAME, hashPassword, logAudit, signSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone required'),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  age: z.coerce.number().min(0).max(120),
  sex: z.enum(['MALE', 'FEMALE', 'OTHER']),
  village: z.string().min(2, 'Village is required'),
  district: z.string().min(2, 'District is required'),
  isPregnant: z.boolean().optional(),
  pregnancyWeeks: z.coerce.number().optional().nullable(),
  knownConditions: z.array(z.string()).optional(),
  emergencyPhone: z.string().optional().or(z.literal('')),
  consentGiven: z.boolean().refine((val) => val === true, 'Consent is required'),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const parsed = registerSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check if phone already registered
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ phone: data.phone }, ...(data.email ? [{ email: data.email }] : [])],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A user with this mobile number or email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        passwordHash,
        role: 'PATIENT',
        language: 'hi',
        district: data.district,
        village: data.village,
        patientProfile: {
          create: {
            age: data.age,
            sex: data.sex,
            village: data.village,
            district: data.district,
            isPregnant: data.isPregnant || false,
            pregnancyWeeks: data.pregnancyWeeks || null,
            knownConditions: JSON.stringify(data.knownConditions || []),
            emergencyPhone: data.emergencyPhone || null,
            consentGiven: true,
          },
        },
      },
      include: {
        patientProfile: true,
      },
    });

    const token = await signSession({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: 'PATIENT',
      language: user.language,
      district: user.district,
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600,
    });

    await logAudit('REGISTER', 'User', user.id, user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        patientProfile: user.patientProfile,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Failed to complete registration' }, { status: 500 });
  }
}
