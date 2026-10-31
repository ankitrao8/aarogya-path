import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Aarogya Path database...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.consultRequest.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('Aarogya@123', 10);
  const ashaPassword = await bcrypt.hash('Asha@123', 10);
  const doctorPassword = await bcrypt.hash('Doctor@123', 10);
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  // 1. Seed Users for all 4 roles
  const patientUser = await prisma.user.create({
    data: {
      email: 'patient@aarogyapath.in',
      phone: '9876543210',
      passwordHash: defaultPassword,
      name: 'रमेश कुमार (Ramesh Kumar)',
      role: 'PATIENT',
      language: 'hi',
      district: 'Sitapur',
      village: 'Maholi',
      patientProfile: {
        create: {
          age: 42,
          sex: 'MALE',
          village: 'Maholi',
          district: 'Sitapur',
          isPregnant: false,
          knownConditions: JSON.stringify(['DIABETES', 'HYPERTENSION']),
          emergencyPhone: '9876543299',
          consentGiven: true,
        },
      },
    },
    include: { patientProfile: true },
  });

  const ashaUser = await prisma.user.create({
    data: {
      email: 'asha@aarogyapath.in',
      phone: '9876543211',
      passwordHash: ashaPassword,
      name: 'सुनीता देवी ASHA (Sunita Devi)',
      role: 'ASHA',
      language: 'hi',
      district: 'Sitapur',
      village: 'Maholi Sector 4',
    },
  });

  const doctorUser = await prisma.user.create({
    data: {
      email: 'doctor@aarogyapath.in',
      phone: '9876543212',
      passwordHash: doctorPassword,
      name: 'डॉ. आनंद वर्मा (Dr. Anand Verma, MBBS, MD)',
      role: 'DOCTOR',
      language: 'hi',
      district: 'Sitapur',
      village: 'Sitapur HQ',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@aarogyapath.in',
      phone: '9876543213',
      passwordHash: adminPassword,
      name: 'जिला नोडल अधिकारी (District Health Admin)',
      role: 'ADMIN',
      language: 'en',
      district: 'Sitapur',
    },
  });

  console.log('Created core demo users across all 4 roles.');

  // Additional demo patients for ASHA & Doctor queues
  const patient2 = await prisma.user.create({
    data: {
      email: 'meena@aarogyapath.in',
      phone: '9876543214',
      passwordHash: defaultPassword,
      name: 'मीना बाई (Meena Bai)',
      role: 'PATIENT',
      language: 'hi',
      district: 'Sitapur',
      village: 'Pisawan',
      patientProfile: {
        create: {
          age: 26,
          sex: 'FEMALE',
          village: 'Pisawan',
          district: 'Sitapur',
          isPregnant: true,
          pregnancyWeeks: 32,
          knownConditions: JSON.stringify(['ANEMIA']),
          emergencyPhone: '9876543288',
          consentGiven: true,
        },
      },
    },
    include: { patientProfile: true },
  });

  const patient3 = await prisma.user.create({
    data: {
      email: 'ramcharan@aarogyapath.in',
      phone: '9876543215',
      passwordHash: defaultPassword,
      name: 'रामचरन (Ramcharan)',
      role: 'PATIENT',
      language: 'hi',
      district: 'Sitapur',
      village: 'Laharpur',
      patientProfile: {
        create: {
          age: 68,
          sex: 'MALE',
          village: 'Laharpur',
          district: 'Sitapur',
          isPregnant: false,
          knownConditions: JSON.stringify(['ASTHMA', 'HEART_DISEASE']),
          emergencyPhone: '9876543277',
          consentGiven: true,
        },
      },
    },
    include: { patientProfile: true },
  });

  // 2. Seed 28 realistic healthcare facilities with coordinates across Sitapur & neighboring UP districts
  const facilitiesData = [
    {
      name: 'Maholi Primary Health Centre (PHC)',
      nameHi: 'प्राथमिक स्वास्थ्य केंद्र महोली',
      type: 'PHC',
      district: 'Sitapur',
      block: 'Maholi',
      address: 'Main Bazar Road, Near Tehsil, Maholi, Sitapur 261141',
      phone: '05862-245100',
      lat: 27.6667,
      lng: 80.4833,
      services: JSON.stringify(['OPD', 'BASIC_LAB', 'MATERNITY', 'IMMUNIZATION', 'EMERGENCY_STABILIZATION']),
      openingHours: '9:00 AM - 4:00 PM (Emergency 24x7)',
      isSampleData: true,
    },
    {
      name: 'Pisawan Community Health Centre (CHC)',
      nameHi: 'सामुदायिक स्वास्थ्य केंद्र पिसावां',
      type: 'CHC',
      district: 'Sitapur',
      block: 'Pisawan',
      address: 'Near Block Development Office, Pisawan, Sitapur 261151',
      phone: '05862-258200',
      lat: 27.5333,
      lng: 80.3167,
      services: JSON.stringify(['OPD', 'IPD_30_BEDS', 'SURGERY', 'MATERNITY_24X7', 'AMBULANCE_108', 'LAB', 'XRAY']),
      openingHours: '24x7',
      isSampleData: true,
    },
    {
      name: 'Sitapur District Hospital (Combined Hospital)',
      nameHi: 'जिला संयुक्त चिकित्सालय सीतापुर',
      type: 'DISTRICT_HOSPITAL',
      district: 'Sitapur',
      block: 'Sitapur City',
      address: 'Station Road, Civil Lines, Sitapur 261001',
      phone: '05862-242222',
      lat: 27.5683,
      lng: 80.6828,
      services: JSON.stringify(['ICU', 'EMERGENCY_TRAUMA_24X7', 'BLOOD_BANK', 'CT_SCAN', 'SPECIALIST_OPD', 'DIALYSIS', 'MATERNITY']),
      openingHours: '24x7',
      isSampleData: true,
    },
    {
      name: 'Laharpur Community Health Centre (CHC)',
      nameHi: 'सामुदायिक स्वास्थ्य केंद्र लहरपुर',
      type: 'CHC',
      district: 'Sitapur',
      block: 'Laharpur',
      address: 'Biswan Road, Laharpur, Sitapur 261135',
      phone: '05862-261300',
      lat: 27.7167,
      lng: 80.9000,
      services: JSON.stringify(['OPD', 'IPD', '24X7_DELIVERY', 'LAB_TESTING', 'PHARMACY']),
      openingHours: '24x7',
      isSampleData: true,
    },
    {
      name: 'Biswan 100-Bed Sub-District Hospital',
      nameHi: '100 शैय्या संयुक्त चिकित्सालय बिसवां',
      type: 'DISTRICT_HOSPITAL',
      district: 'Sitapur',
      block: 'Biswan',
      address: 'Bypass Road, Biswan, Sitapur 261201',
      phone: '05863-233111',
      lat: 27.5000,
      lng: 81.0000,
      services: JSON.stringify(['EMERGENCY', 'IPD', 'PEDIATRICS', 'SURGERY', 'OXYGEN_PLANT']),
      openingHours: '24x7',
      isSampleData: true,
    },
    {
      name: 'Misrikh Community Health Centre (CHC)',
      nameHi: 'सामुदायिक स्वास्थ्य केंद्र मिश्रिख',
      type: 'CHC',
      district: 'Sitapur',
      block: 'Misrikh',
      address: 'Neemsar Road, Misrikh, Sitapur 261401',
      phone: '05862-277123',
      lat: 27.4333,
      lng: 80.5167,
      services: JSON.stringify(['OPD', 'MATERNITY', 'COLD_CHAIN', 'DIAGNOSTICS']),
      openingHours: '24x7',
      isSampleData: true,
    },
    {
      name: 'Ayushman Arogya Mandir (Sub Centre) Bamhnawan',
      nameHi: 'आयुष्मान आरोग्य मंदिर (उप-केंद्र) बम्हनावां',
      type: 'SUB_CENTRE',
      district: 'Sitapur',
      block: 'Maholi',
      address: 'Village Bamhnawan, Maholi, Sitapur 261141',
      phone: '9450001122',
      lat: 27.6890,
      lng: 80.4610,
      services: JSON.stringify(['FIRST_AID', 'BP_SUGAR_SCREENING', 'ANC_PNC', 'NCD_MEDICINES']),
      openingHours: '9:00 AM - 3:00 PM',
      isSampleData: true,
    },
    {
      name: 'Ayushman Arogya Mandir Urdauli',
      nameHi: 'आयुष्मान आरोग्य मंदिर उरदौली',
      type: 'SUB_CENTRE',
      district: 'Sitapur',
      block: 'Pisawan',
      address: 'Gram Panchayat Urdauli, Pisawan, Sitapur 261151',
      phone: '9450001123',
      lat: 27.5510,
      lng: 80.3420,
      services: JSON.stringify(['FIRST_AID', 'BASIC_MEDICINES', 'MATERNAL_CARE']),
      openingHours: '9:00 AM - 3:00 PM',
      isSampleData: true,
    },
    {
      name: 'Khairabad Primary Health Centre',
      nameHi: 'प्राथमिक स्वास्थ्य केंद्र खैराबाद',
      type: 'PHC',
      district: 'Sitapur',
      block: 'Khairabad',
      address: 'Near Badi Dargah, Khairabad, Sitapur 261131',
      phone: '05862-252100',
      lat: 27.5310,
      lng: 80.7550,
      services: JSON.stringify(['OPD', 'DELIVERY_ROOM', 'ANTIRABIES_VACCINE', 'DOTS_TB']),
      openingHours: '8:00 AM - 2:00 PM',
      isSampleData: true,
    },
    {
      name: 'e-Sanjeevani Teleconsultation Kiosk Maholi',
      nameHi: 'ई-संजीवनी टेलीकंसल्टेशन केंद्र महोली',
      type: 'TELECONSULT_PARTNER',
      district: 'Sitapur',
      block: 'Maholi',
      address: 'Panchayat Bhawan, Maholi Main, Sitapur',
      phone: '1800-180-1104',
      lat: 27.6650,
      lng: 80.4850,
      services: JSON.stringify(['TELEMEDICINE', 'VIDEO_DOCTOR_CONSULT', 'DIGITAL_RX']),
      openingHours: '9:00 AM - 5:00 PM',
      isSampleData: true,
    },
    {
      name: 'Jeevan Jyoti Charitable Rural Clinic',
      nameHi: 'जीवन ज्योति ग्रामीण चिकित्सालय',
      type: 'PRIVATE_CLINIC',
      district: 'Sitapur',
      block: 'Maholi',
      address: 'Railway Crossing Road, Maholi, Sitapur',
      phone: '05862-245333',
      lat: 27.6710,
      lng: 80.4790,
      services: JSON.stringify(['OPD', 'GENERAL_PHYSICIAN', 'ULTRASOUND', 'ECG']),
      openingHours: '8:00 AM - 8:00 PM',
      isSampleData: true,
    },
    {
      name: 'Sanjeevani Telehealth Hub Sitapur',
      nameHi: 'संजीवनी टेलीहेल्थ हब सीतापुर',
      type: 'TELECONSULT_PARTNER',
      district: 'Sitapur',
      block: 'Sitapur City',
      address: 'Civil Lines, Near DM Office, Sitapur 261001',
      phone: '05862-241099',
      lat: 27.5710,
      lng: 80.6780,
      services: JSON.stringify(['SPECIALIST_TELECONSULT', 'CARDIOLOGY_OPINION', 'PEDIATRICS_CALL']),
      openingHours: '8:00 AM - 10:00 PM',
      isSampleData: true,
    },
    {
      name: 'Sidhauli Community Health Centre',
      nameHi: 'सामुदायिक स्वास्थ्य केंद्र सिधौली',
      type: 'CHC',
      district: 'Sitapur',
      block: 'Sidhauli',
      address: 'NH-24, Sidhauli, Sitapur 261303',
      phone: '05862-282400',
      lat: 27.2833,
      lng: 80.8333,
      services: JSON.stringify(['EMERGENCY_24X7', 'HIGHWAY_TRAUMA_STABILIZATION', 'IPD', 'OT']),
      openingHours: '24x7',
      isSampleData: true,
    },
    {
      name: 'Mahmudabad 100-Bed Hospital',
      nameHi: 'संयुक्त चिकित्सालय महमूदाबाद',
      type: 'DISTRICT_HOSPITAL',
      district: 'Sitapur',
      block: 'Mahmudabad',
      address: 'Near Fort Road, Mahmudabad, Sitapur 261203',
      phone: '05863-255222',
      lat: 27.2950,
      lng: 81.1180,
      services: JSON.stringify(['EMERGENCY', 'BLOOD_STORAGE', 'GYNECOLOGY', 'NEWBORN_CARE']),
      openingHours: '24x7',
      isSampleData: true,
    },
    {
      name: 'Hargaon Primary Health Centre',
      nameHi: 'प्राथमिक स्वास्थ्य केंद्र हरगांव',
      type: 'PHC',
      district: 'Sitapur',
      block: 'Hargaon',
      address: 'Sugar Mill Road, Hargaon, Sitapur 261121',
      phone: '05862-264100',
      lat: 27.7667,
      lng: 80.7500,
      services: JSON.stringify(['OPD', 'FEVER_CLINIC', 'LAB', 'DELIVERY']),
      openingHours: '9:00 AM - 4:00 PM',
      isSampleData: true,
    },
    {
      name: 'Tambaur Community Health Centre',
      nameHi: 'सामुदायिक स्वास्थ्य केंद्र तंबौर',
      type: 'CHC',
      district: 'Sitapur',
      block: 'Tambaur',
      address: 'Main Market, Tambaur Ahmedabad, Sitapur 261208',
      phone: '05862-291200',
      lat: 27.6500,
      lng: 81.2000,
      services: JSON.stringify(['FLOOD_EMERGENCY_RELIEF', 'SNAKE_BITE_UNIT', 'MATERNITY', 'IPD']),
      openingHours: '24x7',
      isSampleData: true,
    },
    {
      name: 'KGMU Satellite Trauma Centre (Lucknow Border)',
      nameHi: 'केजीएमयू उपग्रह ट्रॉमा केंद्र',
      type: 'DISTRICT_HOSPITAL',
      district: 'Lucknow',
      block: 'Bakshi Ka Talab',
      address: 'NH-24 Highway, Near BKT, Lucknow 226201',
      phone: '0522-2257450',
      lat: 27.0120,
      lng: 80.8950,
      services: JSON.stringify(['ADVANCED_TRAUMA', 'NEUROSURGERY', 'VENTILATOR', 'CARDIAC_CARE']),
      openingHours: '24x7',
      isSampleData: true,
    },
    {
      name: 'Apollo TeleHealth Rural Connect',
      nameHi: 'अपोलो टेलीहेल्थ ग्रामीण सेवा',
      type: 'TELECONSULT_PARTNER',
      district: 'Sitapur',
      block: 'Sitapur City',
      address: 'Lalbagh Chauraha, Sitapur',
      phone: '1860-500-1066',
      lat: 27.5650,
      lng: 80.6800,
      services: JSON.stringify(['SUPER_SPECIALIST_TELECONSULT', 'SECOND_OPINION']),
      openingHours: '8:00 AM - 9:00 PM',
      isSampleData: true,
    },
    {
      name: 'Machhrehta Primary Health Centre',
      nameHi: 'प्राथमिक स्वास्थ्य केंद्र मछरेहटा',
      type: 'PHC',
      district: 'Sitapur',
      block: 'Machhrehta',
      address: 'Block HQ, Machhrehta, Sitapur 261405',
      phone: '05862-237100',
      lat: 27.4120,
      lng: 80.6200,
      services: JSON.stringify(['OPD', 'ANTENATAL', 'DIAGNOSTICS']),
      openingHours: '9:00 AM - 4:00 PM',
      isSampleData: true,
    },
    {
      name: 'Reusa Community Health Centre',
      nameHi: 'सामुदायिक स्वास्थ्य केंद्र रेउसा',
      type: 'CHC',
      district: 'Sitapur',
      block: 'Reusa',
      address: 'Reusa-Fatehpur Road, Sitapur 261205',
      phone: '05862-293100',
      lat: 27.5100,
      lng: 81.3100,
      services: JSON.stringify(['OPD', 'INPATIENT', 'SNAKEBITE_MANAGEMENT', 'DELIVERY_24X7']),
      openingHours: '24x7',
      isSampleData: true,
    },
    {
      name: 'Ayushman Arogya Mandir Pipra',
      nameHi: 'आयुष्मान आरोग्य मंदिर पिपरा',
      type: 'SUB_CENTRE',
      district: 'Sitapur',
      block: 'Hargaon',
      address: 'Pipra Kalan, Hargaon, Sitapur',
      phone: '9450001124',
      lat: 27.7800,
      lng: 80.7400,
      services: JSON.stringify(['FIRST_AID', 'BP_SUGAR', 'IMMUNIZATION']),
      openingHours: '9:00 AM - 2:00 PM',
      isSampleData: true,
    },
    {
      name: 'Seva Samarpan Charitable Eye & General Hospital',
      nameHi: 'सेवा समर्पण नेत्र एवं सामान्य चिकित्सालय',
      type: 'PRIVATE_CLINIC',
      district: 'Sitapur',
      block: 'Sitapur City',
      address: 'Eye Hospital Road, Sitapur 261001',
      phone: '05862-243555',
      lat: 27.5750,
      lng: 80.6860,
      services: JSON.stringify(['OPHTHALMOLOGY', 'GENERAL_MEDICINE', 'CATARACT', 'MINOR_OT']),
      openingHours: '8:00 AM - 6:00 PM',
      isSampleData: true,
    },
    {
      name: 'Rampur Mathura Primary Health Centre',
      nameHi: 'प्राथमिक स्वास्थ्य केंद्र रामपुर मथुरा',
      type: 'PHC',
      district: 'Sitapur',
      block: 'Rampur Mathura',
      address: 'Near Police Station, Rampur Mathura, Sitapur',
      phone: '05863-261200',
      lat: 27.3500,
      lng: 81.2500,
      services: JSON.stringify(['OPD', 'MALARIA_DENGUE_TEST', 'BASIC_CARE']),
      openingHours: '9:00 AM - 4:00 PM',
      isSampleData: true,
    },
    {
      name: 'Gondlamau Community Health Centre',
      nameHi: 'सामुदायिक स्वास्थ्य केंद्र गोंदलामऊ',
      type: 'CHC',
      district: 'Sitapur',
      block: 'Gondlamau',
      address: 'Kalyanpur Road, Gondlamau, Sitapur 261403',
      phone: '05862-284100',
      lat: 27.3100,
      lng: 80.6100,
      services: JSON.stringify(['OPD', 'IPD_30_BEDS', 'EMERGENCY', 'AMBULANCE']),
      openingHours: '24x7',
      isSampleData: true,
    },
    {
      name: 'Medanta Tele-Consultation Hub (Rural Outreach)',
      nameHi: 'मेदांता टेली-कंसल्टेशन केंद्र',
      type: 'TELECONSULT_PARTNER',
      district: 'Sitapur',
      block: 'Sitapur City',
      address: 'Near Bus Stand, Sitapur',
      phone: '0522-4505050',
      lat: 27.5610,
      lng: 80.6750,
      services: JSON.stringify(['CARDIAC_TELECONSULT', 'STROKE_TRIAGE', 'INTERNAL_MEDICINE']),
      openingHours: '9:00 AM - 8:00 PM',
      isSampleData: true,
    },
    {
      name: 'Behta Community Health Centre',
      nameHi: 'सामुदायिक स्वास्थ्य केंद्र बेहटा',
      type: 'CHC',
      district: 'Sitapur',
      block: 'Behta',
      address: 'Main Road, Behta Pakauri, Sitapur',
      phone: '05862-295100',
      lat: 27.6900,
      lng: 81.0800,
      services: JSON.stringify(['EMERGENCY', 'MATERNITY', 'LAB']),
      openingHours: '24x7',
      isSampleData: true,
    },
  ];

  for (const fac of facilitiesData) {
    await prisma.facility.create({ data: fac });
  }
  console.log(`Seeded ${facilitiesData.length} demo facilities.`);

  // 3. Seed Sample Assessments & Referrals for instant dashboard visibility
  const sampleAssessment1 = await prisma.assessment.create({
    data: {
      patientProfileId: patientUser.patientProfile!.id,
      conductedByRole: 'PATIENT',
      symptoms: JSON.stringify(['chest_pain', 'breathlessness']),
      answers: JSON.stringify({
        chest_pain_radiating: 'YES',
        breathless_at_rest: 'YES',
        sweating_or_dizziness: 'YES',
      }),
      level: 'RED',
      reasons: JSON.stringify([
        'RF-01: सीने में तेज दर्द जो हाथ या जबड़े तक जा रहा है (Acute Coronary Syndrome suspect)',
        'RF-02: आराम करने पर भी सांस फूलना (Severe respiratory distress)',
        'MOD-01: उच्च जोखिम: मरीज मधुमेह और उच्च रक्तचाप से ग्रसित है (Diabetes + BP modifier)',
      ]),
      dangerSigns: JSON.stringify([
        'बेहोशी या चक्कर आना (Syncope)',
        'ठंडा पसीना आना (Profuse cold sweating)',
        'बोलने में अत्यधिक कठिनाई (Inability to complete sentences)',
      ]),
      homeCareAdvice: 'मरीज को शांत लिटाएं, कपड़े ढीले करें। कोई भारी श्रम न कराएं। तुरंत 108 एम्बुलेंस बुलाएं।',
      recommendedFacility: 'DISTRICT_HOSPITAL',
      ruleVersion: 'v1.0.0',
      inputMethod: 'VOICE',
    },
  });

  const sampleReferral1 = await prisma.referral.create({
    data: {
      assessmentId: sampleAssessment1.id,
      patientProfileId: patientUser.patientProfile!.id,
      assignedAshaId: ashaUser.id,
      assignedDoctorId: doctorUser.id,
      level: 'RED',
      status: 'NEW',
      clinicalNotes: 'मरीज को तत्काल 108 एम्बुलेंस से जिला अस्पताल रेफर किया गया है। ASHA सुनीता देवी को सूचित किया गया।',
      transportArranged: true,
    },
  });

  // Second sample assessment (Orange)
  const sampleAssessment2 = await prisma.assessment.create({
    data: {
      patientProfileId: patient2.patientProfile!.id,
      conductedByRole: 'ASHA',
      conductedById: ashaUser.id,
      symptoms: JSON.stringify(['fever', 'headache', 'vomiting']),
      answers: JSON.stringify({
        fever_duration: 'more_than_3_days',
        high_fever: 'YES',
        pregnancy_headache: 'YES',
      }),
      level: 'ORANGE',
      reasons: JSON.stringify([
        'ORG-03: गर्भावस्था (32 सप्ताह) में तेज बुखार और सिरदर्द (Pre-eclampsia / High risk maternal fever)',
        'MOD-02: बुखार 3 दिन से अधिक समय से जारी है',
      ]),
      dangerSigns: JSON.stringify([
        'आँखों के आगे धुंधलापन (Blurred vision)',
        'पेट के ऊपरी हिस्से में तेज दर्द (Epigastric pain)',
        'बच्चे की हलचल कम होना (Decreased foetal movement)',
      ]),
      homeCareAdvice: 'पर्याप्त ओआरएस व पानी पिलाएं। आज ही नजदीकी सीएचसी या महिला अस्पताल ले जाएं।',
      recommendedFacility: 'CHC',
      ruleVersion: 'v1.0.0',
      inputMethod: 'TAP',
    },
  });

  await prisma.referral.create({
    data: {
      assessmentId: sampleAssessment2.id,
      patientProfileId: patient2.patientProfile!.id,
      assignedAshaId: ashaUser.id,
      assignedDoctorId: doctorUser.id,
      level: 'ORANGE',
      status: 'ACKNOWLEDGED',
      clinicalNotes: 'CHC पिसावां में डॉ. वर्मा को केस रेफर किया गया। एम्बुलेंस संपर्क में है।',
    },
  });

  // Sample Teleconsult Request
  await prisma.consultRequest.create({
    data: {
      patientProfileId: patient3.patientProfile!.id,
      doctorId: doctorUser.id,
      status: 'REQUESTED',
      preferredSlot: 'TODAY_EVENING',
      chiefComplaint: 'दम फूलना और खांसी 4 दिन से, इनहेलर से राहत कम मिल रही है (Asthma exacerbation)',
      doctorNotes: 'डॉक्टर द्वारा समीक्षा लंबित',
    },
  });

  // Sample Follow Up
  await prisma.followUp.create({
    data: {
      assessmentId: sampleAssessment1.id,
      scheduledFor: new Date(Date.now() + 8 * 3600 * 1000), // 8 hours later
      statusResponse: null,
      escalated: false,
    },
  });

  // Sample Notifications
  await prisma.notification.createMany({
    data: [
      {
        recipientRole: 'ASHA',
        recipientUserId: ashaUser.id,
        title: '🚨 आपातकालीन RED रेफरल',
        message: 'रमेश कुमार (महोली) - सीने में दर्द और सांस की समस्या। तत्काल सहायता दें।',
        link: `/asha/referrals/${sampleReferral1.id}`,
        channel: 'IN_APP',
      },
      {
        recipientRole: 'DOCTOR',
        recipientUserId: doctorUser.id,
        title: '⚠️ नया ORANGE केस रेफरल',
        message: 'मीना बाई (32 सप्ताह गर्भवती) - तेज सिरदर्द व बुखार। CHC में आगमन अपेक्षित।',
        link: `/doctor/referrals`,
        channel: 'IN_APP',
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
