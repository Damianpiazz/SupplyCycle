import { prisma } from '../../src/lib/prisma.js';

const EMPLEADOS = [
  { nombre: 'Luis', apellido: 'Rodríguez', dni: '20123456' },
  { nombre: 'Marta', apellido: 'Fernández', dni: '21234567' },
  { nombre: 'Jorge', apellido: 'López', dni: '22345678' },
  { nombre: 'Sofía', apellido: 'Martínez', dni: '23456789' },
  { nombre: 'Diego', apellido: 'García', dni: '24567890' },
  { nombre: 'Valentina', apellido: 'Díaz', dni: '25678901' },
  { nombre: 'Facundo', apellido: 'Álvarez', dni: '26789012' },
];

export async function seedEmpleados() {
  const empleados: any[] = [];
  for (const data of EMPLEADOS) {
    const e = await prisma.empleado.create({ data });
    empleados.push(e);
  }
  console.log(`  ✅ ${empleados.length} empleados creados`);
  return empleados;
}

export async function cleanEmpleados() {
  await prisma.empleado.deleteMany();
}
