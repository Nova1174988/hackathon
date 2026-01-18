import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/bcrypt.utils.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await hashPassword('Admin@123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hamrohealth.com' },
    update: {},
    create: {
      email: 'admin@hamrohealth.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created');

  // Create patient users
  const patientPassword = await hashPassword('Patient@123');
  const patient1 = await prisma.user.upsert({
    where: { email: 'patient1@example.com' },
    update: {},
    create: {
      email: 'patient1@example.com',
      password: patientPassword,
      name: 'Ram Sharma',
      phone: '+977-9841234567',
      role: 'PATIENT',
    },
  });

  const patient2 = await prisma.user.upsert({
    where: { email: 'patient2@example.com' },
    update: {},
    create: {
      email: 'patient2@example.com',
      password: patientPassword,
      name: 'Sita Thapa',
      phone: '+977-9851234567',
      role: 'PATIENT',
      languagePreference: 'NEPALI',
    },
  });
  console.log('✅ Patient users created');

  // Create doctor users and profiles
  const doctorPassword = await hashPassword('Doctor@123');

  const doctors = [
    {
      name: 'Dr. Rajesh Kumar',
      email: 'dr.rajesh@hamrohealth.com',
      specialization: 'General Medicine',
      licenseNumber: 'NMC-12345',
      experienceYears: 15,
      bio: 'Experienced general physician with expertise in treating common ailments and chronic diseases.',
      consultationFee: 500,
      languagesSpoken: ['English', 'Nepali', 'Hindi'],
      availabilityStatus: 'AVAILABLE' as const,
    },
    {
      name: 'Dr. Anita Shrestha',
      email: 'dr.anita@hamrohealth.com',
      specialization: 'Pediatrics',
      licenseNumber: 'NMC-23456',
      experienceYears: 10,
      bio: 'Caring pediatrician specialized in child health and development.',
      consultationFee: 600,
      languagesSpoken: ['English', 'Nepali'],
      availabilityStatus: 'AVAILABLE' as const,
    },
    {
      name: 'Dr. Prakash Adhikari',
      email: 'dr.prakash@hamrohealth.com',
      specialization: 'Cardiology',
      licenseNumber: 'NMC-34567',
      experienceYears: 20,
      bio: 'Senior cardiologist with extensive experience in heart disease management.',
      consultationFee: 800,
      languagesSpoken: ['English', 'Nepali'],
      availabilityStatus: 'BUSY' as const,
    },
    {
      name: 'Dr. Maya Gurung',
      email: 'dr.maya@hamrohealth.com',
      specialization: 'Dermatology',
      licenseNumber: 'NMC-45678',
      experienceYears: 8,
      bio: 'Dermatologist specializing in skin conditions and cosmetic treatments.',
      consultationFee: 700,
      languagesSpoken: ['English', 'Nepali'],
      availabilityStatus: 'AVAILABLE' as const,
    },
    {
      name: 'Dr. Suresh Pandey',
      email: 'dr.suresh@hamrohealth.com',
      specialization: 'Orthopedics',
      licenseNumber: 'NMC-56789',
      experienceYears: 12,
      bio: 'Orthopedic surgeon specialized in bone and joint problems.',
      consultationFee: 750,
      languagesSpoken: ['English', 'Nepali', 'Hindi'],
      availabilityStatus: 'OFFLINE' as const,
    },
  ];

  for (const doctorData of doctors) {
    const user = await prisma.user.upsert({
      where: { email: doctorData.email },
      update: {},
      create: {
        email: doctorData.email,
        password: doctorPassword,
        name: doctorData.name,
        role: 'DOCTOR',
      },
    });

    await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        specialization: doctorData.specialization,
        licenseNumber: doctorData.licenseNumber,
        experienceYears: doctorData.experienceYears,
        bio: doctorData.bio,
        consultationFee: doctorData.consultationFee,
        languagesSpoken: doctorData.languagesSpoken,
        availabilityStatus: doctorData.availabilityStatus,
        rating: 4.5,
        totalConsultations: Math.floor(Math.random() * 50) + 10,
      },
    });
  }
  console.log('✅ Doctor users and profiles created');

  // Create announcements
  const announcements = [
    {
      title: 'COVID-19 Booster Vaccination Drive',
      content: 'Free COVID-19 booster shots available at all government health centers. Eligible for people above 60 years and immunocompromised individuals. Bring your vaccination card and ID proof.',
      category: 'VACCINATION' as const,
      language: 'ENGLISH' as const,
      priority: 'HIGH' as const,
      isDraft: false,
      publishedAt: new Date(),
    },
    {
      title: 'डेङ्गी रोग फैलिने खतरा',
      content: 'डेङ्गी रोगको जोखिम बढेको छ। आफ्नो घर वरपर पानी जम्न नदिनुहोस्। बिरामी भएमा तुरुन्त डाक्टरसँग सम्पर्क गर्नुहोस्। ज्वरो, शरीर दुख्ने र छाला दाग भएमा सतर्क रहनुहोस्।',
      category: 'OUTBREAK' as const,
      language: 'NEPALI' as const,
      priority: 'HIGH' as const,
      isDraft: false,
      publishedAt: new Date(),
    },
    {
      title: 'Flu Season Health Tips',
      content: 'As flu season approaches, remember to wash hands frequently, avoid crowded places if sick, get adequate rest, stay hydrated, and maintain a healthy diet. Flu vaccines are available at all major hospitals.',
      category: 'GENERAL' as const,
      language: 'ENGLISH' as const,
      priority: 'MEDIUM' as const,
      isDraft: false,
      publishedAt: new Date(),
    },
    {
      title: 'Emergency Helpline Number Update',
      content: 'NEW 24/7 Medical Emergency Helpline: 1800-1234-5678. Save this number for any medical emergencies. Ambulance services available across all districts.',
      category: 'EMERGENCY' as const,
      language: 'ENGLISH' as const,
      priority: 'HIGH' as const,
      isDraft: false,
      publishedAt: new Date(),
    },
    {
      title: 'मधुमेह नियन्त्रण शिविर',
      content: 'निःशुल्क मधुमेह जाँच शिविर आयोजना। रक्त परीक्षण, परामर्श र औषधि निःशुल्क। समय: बिहान ८ बजे देखि दिउँसो ३ बजे सम्म। स्थान: सामुदायिक स्वास्थ्य केन्द्र।',
      category: 'GENERAL' as const,
      language: 'NEPALI' as const,
      priority: 'MEDIUM' as const,
      isDraft: false,
      publishedAt: new Date(),
    },
    {
      title: 'Mental Health Awareness Week',
      content: 'Join us for Mental Health Awareness Week. Free counseling sessions, stress management workshops, and support group meetings. Mental health is as important as physical health. Seek help if needed.',
      category: 'GENERAL' as const,
      language: 'ENGLISH' as const,
      priority: 'MEDIUM' as const,
      isDraft: false,
      publishedAt: new Date(),
    },
    {
      title: 'Measles Vaccination Campaign',
      content: 'Measles vaccination campaign for children aged 9 months to 5 years. Protect your children from this highly contagious disease. Visit nearest health center with birth certificate.',
      category: 'VACCINATION' as const,
      language: 'ENGLISH' as const,
      priority: 'HIGH' as const,
      isDraft: false,
      publishedAt: new Date(),
    },
    {
      title: 'गर्मी र निर्जलीकरण',
      content: 'अत्यधिक गर्मीमा धेरै पानी पिउनुहोस्। घाममा कम समय बिताउनुहोस्। टोपी र हल्का कपडा लगाउनुहोस्। चक्कर लाग्ने, टाउको दुख्ने वा बान्ता भएमा तुरुन्त डाक्टर भेट्नुहोस्।',
      category: 'GENERAL' as const,
      language: 'NEPALI' as const,
      priority: 'MEDIUM' as const,
      isDraft: false,
      publishedAt: new Date(),
    },
    {
      title: 'World Health Day Celebration',
      content: 'Celebrating World Health Day with free health checkups, fitness sessions, and nutrition counseling. Health is wealth! Join us to learn about healthy living and disease prevention.',
      category: 'GENERAL' as const,
      language: 'ENGLISH' as const,
      priority: 'LOW' as const,
      isDraft: false,
      publishedAt: new Date(),
    },
    {
      title: 'आपतकालीन रक्तदान अभियान',
      content: 'रक्त बैंकमा रक्तको अभाव भएकोले तत्काल रक्तदान गर्न अनुरोध। सबै रक्त समूहको आवश्यकता। १८ देखि ६० बर्षसम्मका स्वस्थ व्यक्तिहरु रक्तदान गर्न सक्नुहुन्छ।',
      category: 'EMERGENCY' as const,
      language: 'NEPALI' as const,
      priority: 'HIGH' as const,
      isDraft: false,
      publishedAt: new Date(),
    },
  ];

  for (const announcement of announcements) {
    await prisma.announcement.create({
      data: announcement,
    });
  }
  console.log('✅ Announcements created');

  console.log('✅ Seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('Admin: admin@hamrohealth.com / Admin@123');
  console.log('Patient: patient1@example.com / Patient@123');
  console.log('Doctor: dr.rajesh@hamrohealth.com / Doctor@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
