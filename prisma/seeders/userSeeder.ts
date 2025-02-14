import { PrismaClient } from '@prisma/client';
import { hashedContent } from '../../src/utils/bcrypt';
import { v4 as uuidv4 } from 'uuid';

const userSeeder = async (prisma: PrismaClient) => {
  console.log('👤 Seeding Users...');
    await prisma.user.create({
        data: {
            id: 1,
            email: 'admin@example.com',
            name: 'Admin User',
            password: await hashedContent('hashedPassword1'),
            role: 'SuperAdmin',
            userId: uuidv4(),
            status: 'Active'
        }
    });
  
  console.log('✅ Users seeded!');
};

export default userSeeder;
