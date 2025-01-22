
import { NextResponse } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

type TenantData = {
    id: string
    name: string
    slug: string 
}

export async function GET(req: NextApiRequest, res: NextApiResponse<TenantData[]>) {    
    const session = await getServerSession(authOptions)
    if (session) {
        const tenants = await prisma.tenant.findMany({
            where: {
                users: {
                    some: {
                        userId: session.user.id
                    }
                }
            }
        })
        return NextResponse.json(tenants, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}
