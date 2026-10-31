async function run() {
  console.log('--- 1. Testing Facilities API & Geolocation Distance Ranking ---');
  const facRes = await fetch(
    'http://localhost:3000/api/facilities?district=Sitapur&lat=27.5683&lng=80.6828'
  );
  const facData = await facRes.json();
  console.log('Facilities Fetch Status:', facRes.status, 'Total:', facData.total);
  if (facData.facilities.length > 0) {
    const nearest = facData.facilities[0];
    console.log(
      `Nearest Facility: ${nearest.name} | Type: ${nearest.type} | Distance: ${nearest.distanceKm} km`
    );
  }

  console.log('--- 2. Testing Triage Assessment -> Automatic Referral Creation ---');
  const assessRes = await fetch('http://localhost:3000/api/triage/assess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patient: { age: 50, sex: 'FEMALE', isPregnant: false, knownConditions: ['HYPERTENSION'] },
      symptoms: ['chest_pain'],
      answers: { chest_pain_radiating: 'YES' },
      inputMethod: 'VOICE',
    }),
  });
  const assessData = await assessRes.json();
  console.log(
    'Assessment Level:',
    assessData.result.level,
    'Referral Generated ID:',
    assessData.referralId
  );

  console.log('--- 3. Testing Referral Status Update API ---');
  const refListRes = await fetch('http://localhost:3000/api/referrals');
  const refListData = await refListRes.json();
  console.log('Total Active Referrals:', refListData.referrals.length);

  if (refListData.referrals.length > 0) {
    const targetRef = refListData.referrals[0];
    const updateRes = await fetch('http://localhost:3000/api/referrals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: targetRef.id,
        status: 'ACKNOWLEDGED',
        clinicalNotes: 'ASHA कार्यकर्ता ने मरीज से संपर्क किया। 108 एम्बुलेंस भेजी गई।',
      }),
    });
    const updateData = await updateRes.json();
    console.log('Referral Updated Status:', updateData.referral?.status);
  }

  console.log('--- 4. Testing Teleconsultation Request API ---');
  const consultRes = await fetch('http://localhost:3000/api/consults/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slot: 'TODAY_EVENING',
      chiefComplaint: 'गले में खराश और हल्का बुखार 2 दिन से',
    }),
  });
  const consultData = await consultRes.json();
  console.log(
    'Consult Request Status:',
    consultRes.status,
    'Created Slot:',
    consultData.consult?.preferredSlot
  );

  console.log('--- 5. Testing Follow-up Reminders & Automatic Escalation on WORSE ---');
  const followUpListRes = await fetch('http://localhost:3000/api/followups');
  const followUpListData = await followUpListRes.json();
  console.log('Pending Follow-up Checks:', followUpListData.followUps?.length);

  if (followUpListData.followUps && followUpListData.followUps.length > 0) {
    const testFollowUp = followUpListData.followUps[0];
    const submitFollowUpRes = await fetch('http://localhost:3000/api/followups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: testFollowUp.id,
        response: 'WORSE',
      }),
    });
    const submitData = await submitFollowUpRes.json();
    console.log(
      'FollowUp Submitted Response:',
      submitData.followUp?.statusResponse,
      'Escalated:',
      submitData.escalated
    );
  }
}

run().catch(console.error);
