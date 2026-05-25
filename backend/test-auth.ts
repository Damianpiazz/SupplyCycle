import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const user = await prisma.usuario.findUnique({
  where: { email: 'repartidor@supplycycle.com' },
});
if (!user) {
  console.log('❌ Usuario NO encontrado en esta BD');
  console.log('DATABASE_URL usada:', process.env.DATABASE_URL);
} else {
  console.log('✅ Usuario encontrado:', user.email);
  const match = await bcrypt.compare('Repartidor123', user.password);
  console.log('¿Coincide password?', match);
}
await prisma.$disconnect();
