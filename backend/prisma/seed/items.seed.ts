import { prisma } from '../../src/lib/prisma.js';

const ITEMS = [
  { nombre: 'Bidón 20L', descripcion: 'Bidón de agua de 20 litros', unidad: 'unidad', precio: 1500 },
  { nombre: 'Bidón 12L', descripcion: 'Bidón de agua de 12 litros', unidad: 'unidad', precio: 900 },
  { nombre: 'Bidón 10L', descripcion: 'Bidón de agua de 10 litros', unidad: 'unidad', precio: 750 },
  { nombre: 'Bidón 8L', descripcion: 'Bidón de agua de 8 litros', unidad: 'unidad', precio: 600 },
  { nombre: 'Bidón 6L', descripcion: 'Bidón de agua de 6 litros', unidad: 'unidad', precio: 500 },
  { nombre: 'Tapa para bidón 20L', descripcion: 'Tapa de repuesto para bidón 20L', unidad: 'unidad', precio: 150 },
  { nombre: 'Tapa para bidón 12L', descripcion: 'Tapa de repuesto para bidón 12L', unidad: 'unidad', precio: 120 },
  { nombre: 'Bombilla para dispensador', descripcion: 'Bombilla de repuesto para dispensador', unidad: 'unidad', precio: 200 },
  { nombre: 'Dispensador eléctrico', descripcion: 'Dispensador frío/caliente', unidad: 'unidad', precio: 8500 },
  { nombre: 'Vaso térmico 500ml', descripcion: 'Vaso térmico acero inoxidable', unidad: 'unidad', precio: 1200 },
];

export async function seedItems() {
  const items: any[] = [];
  for (const data of ITEMS) {
    const item = await prisma.item.create({ data: { ...data, activo: true } });
    items.push(item);
  }
  console.log(`  ✅ ${items.length} items creados`);
  return items;
}

export async function cleanItems() {
  await prisma.item.deleteMany();
}
