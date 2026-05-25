import bcrypt from 'bcrypt';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const user = await prisma.usuario.findUnique({
  where: { email: 'repartidor@supplycycle.com' },
});
if (!user) {
  console.log('❌ Usuario no encontrado');
} else {
  console.log('✅ Usuario encontrado:', user.email);
  console.log('Hash almacenado:', user.password);
  
  const match = await bcrypt.compare('Repartidor123', user.password);
  console.log('¿Coincide?', match);
  
  // Probar con otras variantes por si hay typo
  console.log('Con "repartidor123":', await bcrypt.compare('repartidor123', user.password));
  console.log('Con "Repartidor1234":', await bcrypt.compare('Repartidor1234', user.password));
}
await prisma.$disconnect();