import { PrismaClient } from '@prisma/client';

const FacultySeeder = async (prisma: PrismaClient) => {
  console.log('👤 Seeding Faculty...');
  const data = [
    { id: 1, name: 'Fakultas Teknik Dirgantara dan Industri', code: 'FTDI' },
    { id: 2, name: 'Fakultas Hukum', code: 'FH' },
    { id: 3, name: 'Fakultas Ilmu Kesehatan', code: 'FIK' },
    { id: 4, name: 'Fakultas Ilmu Komputer dan Desain', code: 'FIKD' },
    { id: 5, name: 'Fakultas Ekonomi dan Bisnis', code: 'FEB' },
    { id: 6, name: 'PASCASARJANA', code: 'PASCASARJANA' },
    { id: 7, name: 'AMTO', code: 'AMTO' },
  ]
  await prisma.faculty.createMany({
    data
  });
  
  console.log('✅ Faculty seeded!');
};

export default FacultySeeder;
