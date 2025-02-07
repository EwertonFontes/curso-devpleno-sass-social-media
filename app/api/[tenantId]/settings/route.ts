
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma, Tenant } from "@prisma/client"
import { findTenantById, save } from "../../../../services/tenants"
import { checkTenantPermission } from "../../../../services/users"

type LinkData = {
    id: string
    name: string
    slug: string
}

type LinkPaginationWrapper = {
    cursor: string
    take: number
    items: LinkData[]
}

interface SessionError {
    message: string
}
export async function GET(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }, res: NextApiResponse<SessionError | Tenant>) {  
    const session = await getServerSession(authOptions)
    const tenantId = (await params).tenantId;
    if (session) {
        const usertenant = await checkTenantPermission(tenantId, session.user.id)
        if(!usertenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const tenant = await findTenantById(tenantId)
        return NextResponse.json(tenant, { status: 200  })
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }, res: NextApiResponse<SessionError | Tenant>) {  
    const session = await getServerSession(authOptions)
    const tenantId = (await params).tenantId;
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const body = await req.json()
        
        const tenantData: Prisma.TenantUpdateInput = {
            name: String(body.name),
            slug: String(body.slug),
        }
                
        const savedTenant = await save(tenantId, tenantData)
        return NextResponse.json(savedTenant, { status: 200  })
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}
