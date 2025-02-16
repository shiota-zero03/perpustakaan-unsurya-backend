import { PrismaClient } from '@prisma/client';
import { hashedContent } from '../../src/utils/bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prodiSeeder = async (prisma: PrismaClient) => {
  console.log('👤 Seeding Prodi...');
  const data = [
    { id: 1, name: 'Teknik Aero dan Amto', code: 'Teknik Aero dan Amto', facultyId: 1 },
    { id: 2, name: 'Teknik Industri', code: 'Teknik Industri', facultyId: 1 },
    { id: 3, name: 'Teknik Elektro', code: 'Teknik Elektro', facultyId: 1 },
    { id: 4, name: 'Teknik Penerbangan', code: 'Teknik Penerbangan', facultyId: 1 },

    { id: 5, name: 'Ilmu Hukum', code: 'Ilmu Hukum', facultyId: 2 },
    { id: 6, name: 'Magister Hukum', code: 'Magister Hukum', facultyId: 2 },

    { id: 7, name: 'D3 Keperawatan', code: 'D3 Keperawatan', facultyId: 3 },
    { id: 8, name: 'S1 Keperawatan', code: 'S1 Keperawatan', facultyId: 3 },
    { id: 9, name: 'Profesi Ners', code: 'Profesi Ners', facultyId: 3 },

    { id: 10, name: 'Sistem Informasi', code: 'Sistem Informasi', facultyId: 4 },
    { id: 11, name: 'Manajemen Informatika', code: 'Manajemen Informatika', facultyId: 4 },
  ]
    await prisma.studyProgram.createMany({
        data
    });
  
  console.log('✅ Prodi seeded!');
};

export default prodiSeeder;
