import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET: listar todas las especialidades
export async function GET() {
  const especialidades = await prisma.especialidad.findMany();
  return NextResponse.json(especialidades);
}

// POST: crear una especialidad
export async function POST(req: NextRequest) {
  const data = await req.json();
  const especialidad = await prisma.especialidad.create({ data });
  return NextResponse.json(especialidad);
}