import { PrismaClient } from '@prisma/client';
import userSeeder from './seeders/userSeeder';
import FacultySeeder from './seeders/facultySeeder';
import prodiSeeder from './seeders/prodiSeeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');
  
  await userSeeder(prisma);
  await FacultySeeder(prisma);
  await prodiSeeder(prisma);
  
  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
