import { predictHeartDiseaseRisk } from '@/lib/ml/predictor';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = predictHeartDiseaseRisk(body);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Heart prediction error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to predict heart disease risk' },
      { status: 500 }
    );
  }
}

