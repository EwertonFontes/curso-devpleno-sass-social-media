import { NextResponse } from "next/server"
import { prisma } from "lib/prisma"

export async function GET(req){
  const tenants = await prisma.tenant.findMany()
  return NextResponse.json(tenants, { status: 200  })
} 