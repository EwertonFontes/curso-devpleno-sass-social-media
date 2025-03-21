
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client"
import { findByDomainName, save } from "../../../../services/domain"
import { checkTenantPermission } from "../../../../services/users"
import { findAll } from "../../../../services/domain"

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

export async function POST(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }, res: NextApiResponse<LinkPaginationWrapper | SessionError >) {  
    const session = await getServerSession(authOptions)
    const tenantId = (await params).tenantId;
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const body = await req.json()
        
        const domainData: Prisma.CustomDomainCreateInput = {
            domainName: String(body.domainName),
            active: true,
            tenants: {
                connect: {
                    id: String(tenantId)
                }
            }
        }
                
        const savedDomain = await save(tenantId, domainData)
        return NextResponse.json(savedDomain, { status: 200  })
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}


export async function GET(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }, res: NextResponse<LinkPaginationWrapper | SessionError >) {
    const session = await getServerSession(authOptions)
    if (session) {
        const tenantId = (await params).tenantId;
        const searchParams = req.nextUrl.searchParams
        const domainName = searchParams.get('domainName')
        if(domainName) {
            const domain = await findByDomainName(tenantId, domainName)
            if(!domain) {
                return NextResponse.json({message: 'Domain not found'}, { status: 404  })
            }
            return NextResponse.json(domain, { status: 200  })
        }
        const customDomains = await findAll(tenantId)
        return NextResponse.json(customDomains, { status: 200  })
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ domainId: string, tenantId: string }> }) {  
    const domainId = (await params).domainId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const domain = await prisma.link.findFirst({
            where: {
                id: domainId,
                tenantId: tenantId
            }
        })
        if(!domain){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const deletedDomain = await prisma.customDomain.delete({
            where: {
                id: domainId
            } 
        })
        return NextResponse.json(deletedDomain, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}

