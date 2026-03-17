import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Scope School database...');

  // Create the default school
  const school = await prisma.school.upsert({
    where: { slug: 'scope-school' },
    update: {},
    create: {
      name: 'Scope School',
      slug: 'scope-school',
      email: 'admin@scopeschool.io',
      phone: '+1 (555) 000-0000',
      address: '123 Education Lane, Knowledge City, KC 12345',
      website: 'https://scopeschool.io',
      primaryColor: '#0F1F3D',
      accentColor: '#00C2A8',
      locale: 'en',
      timezone: 'UTC',
    },
  });

  console.log(`School created: ${school.name} (${school.id})`);

  const passwordHash = await bcrypt.hash('Admin@1234', 12);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email_schoolId: { email: 'admin@scopeschool.io', schoolId: school.id } },
    update: {},
    create: {
      email: 'admin@scopeschool.io',
      passwordHash,
      role: Role.ADMIN,
      firstName: 'System',
      lastName: 'Admin',
      schoolId: school.id,
    },
  });

  console.log(`Admin user created: ${adminUser.email}`);

  // Create demo teacher
  const teacherPasswordHash = await bcrypt.hash('Teacher@1234', 12);
  const teacherUser = await prisma.user.upsert({
    where: { email_schoolId: { email: 'teacher@scopeschool.io', schoolId: school.id } },
    update: {},
    create: {
      email: 'teacher@scopeschool.io',
      passwordHash: teacherPasswordHash,
      role: Role.TEACHER,
      firstName: 'John',
      lastName: 'Johnson',
      schoolId: school.id,
    },
  });

  await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      schoolId: school.id,
      employeeCode: 'TCH-0001',
      qualification: 'B.Sc. Mathematics',
      specialization: 'Mathematics & Physics',
      salary: 4500,
    },
  });

  console.log(`Teacher created: ${teacherUser.email}`);

  // Create demo student
  const studentPasswordHash = await bcrypt.hash('Student@1234', 12);
  const studentUser = await prisma.user.upsert({
    where: { email_schoolId: { email: 'student@scopeschool.io', schoolId: school.id } },
    update: {},
    create: {
      email: 'student@scopeschool.io',
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      firstName: 'Ahmed',
      lastName: 'Hassan',
      schoolId: school.id,
    },
  });

  await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      schoolId: school.id,
      studentCode: 'STU-00001',
      gender: 'MALE',
      enrollmentDate: new Date('2024-09-01'),
    },
  });

  console.log(`Student created: ${studentUser.email}`);

  // Create demo subjects
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { code_schoolId: { code: 'MATH-01', schoolId: school.id } },
      update: {},
      create: { name: 'Mathematics', code: 'MATH-01', color: '#00C2A8', schoolId: school.id },
    }),
    prisma.subject.upsert({
      where: { code_schoolId: { code: 'PHY-01', schoolId: school.id } },
      update: {},
      create: { name: 'Physics', code: 'PHY-01', color: '#3D5A80', schoolId: school.id },
    }),
    prisma.subject.upsert({
      where: { code_schoolId: { code: 'ENG-01', schoolId: school.id } },
      update: {},
      create: { name: 'English', code: 'ENG-01', color: '#F5A623', schoolId: school.id },
    }),
  ]);

  console.log(`Created ${subjects.length} subjects`);

  // Create demo fee types
  await Promise.all([
    prisma.feeType.create({
      data: { name: 'Tuition Fee', category: 'TUITION', amount: 450, schoolId: school.id },
    }).catch(() => null),
    prisma.feeType.create({
      data: { name: 'Registration Fee', category: 'REGISTRATION', amount: 150, schoolId: school.id },
    }).catch(() => null),
    prisma.feeType.create({
      data: { name: 'Insurance', category: 'INSURANCE', amount: 50, schoolId: school.id },
    }).catch(() => null),
  ]);

  console.log('Fee types created');

  console.log('\n✅ Seed completed successfully!\n');
  console.log('Demo accounts:');
  console.log('  Admin:   admin@scopeschool.io    / Admin@1234');
  console.log('  Teacher: teacher@scopeschool.io  / Teacher@1234');
  console.log('  Student: student@scopeschool.io  / Student@1234');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
