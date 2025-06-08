import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
// GET all Medicamento
export async function GET() {
  const medicamentos = await prisma.medicamento.findMany({
    include: { tipoMedic: true, especialidad: true },
  });
  return NextResponse.json(medicamentos);
}

// POST crear Medicamento
export async function POST(req: NextRequest) {
  const data = await req.json();
  const medicamento = await prisma.medicamento.create({ data });
  return NextResponse.json(medicamento);
}