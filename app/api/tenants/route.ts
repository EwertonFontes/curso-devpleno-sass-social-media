
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { Prisma, Tenant } from "@prisma/client"
import { create } from "../../../services/tenants"

type TenantData = {
    id: string
    name: string
    slug: string
    plan: string
}

export async function GET(req: NextRequest) {    
    const session = await getServerSession(authOptions)
    if (session) {
        const searchParams = req.nextUrl.searchParams
        const slug = searchParams.get('slug')
        if(slug){
            const tenant = await prisma.tenant.findFirst({
                where: {
                    slug: slug
                }
            })
            return NextResponse.json(tenant, { status: 200  })
        }

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

export async function POST(req: NextRequest, res: NextApiResponse<TenantData[] | TenantData >) {  
    const session = await getServerSession(authOptions)
    
    if (session) {
        const body = await req.json()
        const tenantData: Prisma.TenantCreateInput = {
            name: String(body.name),
            slug: String(body.slug),
            plano: String(body.plano),
            image: '',
        }
                
        const savedTenant = await create(session.user.id, tenantData)
        return NextResponse.json(savedTenant, { status: 200  })
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}