async function run() {
  console.log('--- 1. Testing Admin Stats & Recharts Analytics Data ---');
  const statsRes = await fetch('http://localhost:3000/api/admin/stats');
  const statsData = await statsRes.json();
  console.log('Admin Stats Fetch Status:', statsRes.status);
  console.log('Total Assessments:', statsData.stats?.totalAssessments);
  console.log('Total Referrals:', statsData.stats?.totalReferrals);
  console.log('Total Facilities:', statsData.stats?.totalFacilities);
  console.log('Severity Breakdown:', statsData.stats?.severityDistribution);
  console.log('Top Symptoms:', statsData.stats?.topSymptoms?.map((s) => `${s.symptom}: ${s.count}`));

  console.log('--- 2. Testing ASHA Dashboard Referral Queue ---');
  const ashaLogin = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'asha@aarogyapath.in', password: 'Asha@123' }),
  });
  const ashaCookie = ashaLogin.headers.get('set-cookie');
  const ashaRefRes = await fetch('http://localhost:3000/api/referrals', {
    headers: ashaCookie ? { Cookie: ashaCookie } : {},
  });
  const ashaRefData = await ashaRefRes.json();
  console.log('ASHA Queue Referrals Count:', ashaRefData.referrals?.length);

  console.log('--- 3. Testing Doctor Consult Completion & Advice Writing ---');
  const docLogin = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'doctor@aarogyapath.in', password: 'Doctor@123' }),
  });
  const docCookie = docLogin.headers.get('set-cookie');

  const consultListRes = await fetch('http://localhost:3000/api/consults/request', {
    headers: docCookie ? { Cookie: docCookie } : {},
  });
  const consultListData = await consultListRes.json();
  console.log('Doctor Teleconsults Count:', consultListData.consults?.length);

  if (consultListData.consults && consultListData.consults.length > 0) {
    const targetConsult = consultListData.consults[0];
    const completeRes = await fetch('http://localhost:3000/api/doctor/consults', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(docCookie ? { Cookie: docCookie } : {}),
      },
      body: JSON.stringify({
        id: targetConsult.id,
        doctorNotes: 'मरीज को मौसमी वायरल संक्रमण है। खतरे के कोई लक्षण नहीं हैं।',
        rxAdvice: 'ओआरएस घोल 1 पैकेट 1 लीटर पानी में, पैरासिटामोल 500mg बुखार होने पर लें।',
        status: 'COMPLETED',
      }),
    });
    const completeData = await completeRes.json();
    console.log(
      'Consult Completion Status:',
      completeRes.status,
      'Updated Status:',
      completeData.consult?.status
    );
  }

  console.log('--- 4. Testing Patient History Portal ---');
  const patLogin = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'patient@aarogyapath.in', password: 'Aarogya@123' }),
  });
  const patCookie = patLogin.headers.get('set-cookie');

  const histRes = await fetch('http://localhost:3000/api/patient/history', {
    headers: patCookie ? { Cookie: patCookie } : {},
  });
  const histData = await histRes.json();
  console.log(
    'Patient History Status:',
    histRes.status,
    'Patient Name:',
    histData.profile?.user?.name,
    'Past Assessments:',
    histData.assessments?.length
  );
}

run().catch(console.error);
