import { PrismaClient } from '@prisma/client'
import { NextResponse } from "next/server"

const prisma = new PrismaClient()
 
export async function GET(req){
  const accounts = await prisma.account.findMany()
  return NextResponse.json(accounts, { status: 200  })
} 