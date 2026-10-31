import { COMMON_SYMPTOMS, extractSymptomsLocally } from '@/lib/triage/symptoms';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body.text || '';

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ symptoms: [], method: 'LOCAL_KEYWORD' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 0) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const validIds = COMMON_SYMPTOMS.map((s) => s.id);

        const prompt = `You are a medical speech-to-symptom parser for rural India.
Analyze the following patient transcript (in Hindi, Bhojpuri, Maithili, Magahi, Hinglish, or English) and extract which of the following valid symptom IDs are mentioned:
Valid IDs: ${JSON.stringify(validIds)}

Patient Transcript: "${text}"

Rules:
1. Return ONLY a valid JSON array of strings containing the matched symptom IDs from the list.
2. Accurately recognize regional/colloquial Bhojpuri terms (e.g. 'mathawa pirata / kapari dard' -> headache, 'chhati me dard / pirata / hiya' -> chest_pain, 'saans phoolata' -> breathlessness, 'pet jharata / chhutal' -> diarrhea, 'khokhi' -> cough, 'bukhar ail ba / jar' -> fever, 'okai / ulti' -> vomiting, 'thehuna pirata' -> joint_pain, 'kamar pirata / dhadh' -> back_pain).
3. Do NOT diagnose or assess severity.
4. If no symptoms match, return [].
Example output: ["chest_pain", "breathlessness"]`;

        const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: prompt,
        });

        const outputText = response.text?.trim() || '[]';
        // Clean markdown code blocks if any
        const cleaned = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((id) => validIds.includes(id));
          if (filtered.length > 0) {
            return NextResponse.json({ symptoms: filtered, method: 'GEMINI' });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini symptom extraction failed, falling back to local extractor:', geminiError);
      }
    }

    // Offline / Local fallback
    const localMatches = extractSymptomsLocally(text);
    return NextResponse.json({ symptoms: localMatches, method: 'LOCAL_KEYWORD' });
  } catch (error) {
    console.error('Error extracting symptoms:', error);
    return NextResponse.json(
      { error: 'Failed to extract symptoms', symptoms: [], method: 'LOCAL_KEYWORD' },
      { status: 500 }
    );
  }
}
