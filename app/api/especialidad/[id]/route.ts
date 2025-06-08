import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET: especialidad por ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const especialidad = await prisma.especialidad.findUnique({
    where: { CodEspec: Number(params.id) },
  });
  if (!especialidad) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(especialidad);
}

// PUT: actualizar especialidad
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const especialidad = await prisma.especialidad.update({
    where: { CodEspec: Number(params.id) },
    data,
  });
  return NextResponse.json(especialidad);
}

// DELETE: eliminar especialidad
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.especialidad.delete({
    where: { CodEspec: Number(params.id) },
  });
  return NextResponse.json({ message: 'Deleted' });
}