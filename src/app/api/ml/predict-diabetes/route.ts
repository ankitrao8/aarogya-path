import { predictDiabetesRisk } from '@/lib/ml/predictor';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = predictDiabetesRisk(body);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Diabetes prediction error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to predict diabetes risk' },
      { status: 500 }
    );
  }
}

