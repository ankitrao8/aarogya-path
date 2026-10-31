async function run() {
  console.log('--- 1. Testing Homepage ---');
  const homeRes = await fetch('http://localhost:3000');
  console.log('Homepage Status:', homeRes.status);
  const homeHtml = await homeRes.text();
  console.log('Contains Aarogya Path branding:', homeHtml.includes('आरोग्य पथ') || homeHtml.includes('Aarogya Path'));

  console.log('--- 2. Testing Triage Page ---');
  const triageRes = await fetch('http://localhost:3000/triage');
  console.log('Triage Status:', triageRes.status);

  console.log('--- 3. Testing Symptom Extraction (Hindi transcript) ---');
  const extractRes = await fetch('http://localhost:3000/api/triage/extract-symptoms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'दम फूल रहा है और सीना भारी लग रहा है' }),
  });
  const extractData = await extractRes.json();
  console.log('Extracted Symptoms:', extractData.symptoms, 'Method:', extractData.method);

  console.log('--- 4. Testing Triage Assessment Engine API ---');
  const assessRes = await fetch('http://localhost:3000/api/triage/assess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patient: { age: 45, sex: 'MALE', isPregnant: false, knownConditions: ['DIABETES'] },
      symptoms: ['chest_pain', 'breathlessness'],
      answers: { chest_pain_radiating: 'YES', breathless_at_rest: 'YES' },
      inputMethod: 'TAP',
    }),
  });
  const assessData = await assessRes.json();
  console.log('Assessment Status:', assessRes.status);
  console.log('Level:', assessData.result.level);
  console.log('Emergency:', assessData.result.callEmergencyNow);
  console.log('Reasons:', assessData.result.reasons);
  console.log('Facility:', assessData.result.recommendedFacility);

  console.log('--- 5. Testing Demo Login (Doctor) ---');
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'doctor@aarogyapath.in', password: 'Doctor@123' }),
  });
  const loginData = await loginRes.json();
  console.log('Login Status:', loginRes.status);
  console.log('Doctor User Name:', loginData.user?.name, 'Role:', loginData.user?.role);

  console.log('--- 6. Testing Demo Login (ASHA) ---');
  const ashaLoginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'asha@aarogyapath.in', password: 'Asha@123' }),
  });
  const ashaData = await ashaLoginRes.json();
  console.log('ASHA Login Status:', ashaLoginRes.status);
  console.log('ASHA User Name:', ashaData.user?.name, 'Role:', ashaData.user?.role);
}

run().catch(console.error);
