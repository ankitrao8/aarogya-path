import { predictDiseaseFromSymptoms } from '@/lib/ml/diseasePredictor';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const symptoms = Array.isArray(body.symptoms) ? body.symptoms : [];

    if (symptoms.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one symptom in the symptoms array.' },
        { status: 400 }
      );
    }

    const prediction = predictDiseaseFromSymptoms(symptoms);

    if (!prediction) {
      return NextResponse.json(
        {
          error:
            'None of the provided symptoms matched the clinical 131-symptom vocabulary.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      prediction,
    });
  } catch (error) {
    console.error('Disease prediction error:', error);
    return NextResponse.json(
      { error: 'Internal error running disease symptom prediction model.' },
      { status: 500 }
    );
  }
}

