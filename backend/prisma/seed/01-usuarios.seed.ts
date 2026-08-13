import bcrypt from 'bcrypt';
import { prisma } from '../../src/lib/prisma.js';

export async function seedUsuarios() {
  const pw = await bcrypt.hash('Repartidor123', 10);
  const adminPw = await bcrypt.hash('Admin1234', 10);

  const admin = await prisma.usuario.create({
    data: { email: 'admin@supplycycle.com', password: adminPw, nombre: 'Ana', apellido: 'Administradora', rol: 'ADMIN', activo: true },
  });

  const repartidoresData = [
    { email: 'repartidor@supplycycle.com', nombre: 'Juan', apellido: 'Pérez' },
    { email: 'repartidor2@supplycycle.com', nombre: 'Carlos', apellido: 'Gutiérrez' },
    { email: 'repartidor3@supplycycle.com', nombre: 'Martín', apellido: 'López' },
    { email: 'repartidor4@supplycycle.com', nombre: 'Diego', apellido: 'Rodríguez' },
    { email: 'repartidor5@supplycycle.com', nombre: 'Pablo', apellido: 'Fernández' },
    { email: 'repartidor6@supplycycle.com', nombre: 'Lucas', apellido: 'Martínez' },
    { email: 'repartidor7@supplycycle.com', nombre: 'Santiago', apellido: 'González' },
  ];

  const repartidores: any[] = [];
  for (const r of repartidoresData) {
    const u = await prisma.usuario.create({
      data: { ...r, password: pw, rol: 'REPARTIDOR', activo: true },
    });
    repartidores.push(u);
  }

  console.log(`  ✅ ${1 + repartidores.length} usuarios creados`);
  return { admin, repartidores };
}

export async function cleanUsuarios() {
  await prisma.usuario.deleteMany();
}
