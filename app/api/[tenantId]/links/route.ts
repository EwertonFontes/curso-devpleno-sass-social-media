
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "@prisma/client"
import { findLinkBySlug, findPaginated,save } from "../../../../services/links"
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

export async function POST(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }, res: NextApiResponse<LinkPaginationWrapper | SessionError >) {  
    const session = await getServerSession(authOptions)
    const tenantId = (await params).tenantId;
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const body = await req.json()
        
        const linkData: Prisma.LinkCreateInput = {
            name: String(body.name),
            publicName: String(body.publicName),
            slug: String(body.slug),
            destination: String(body.destination),
            tenants: {
                connect: {
                    id: String(tenantId)
                }
            }
        }
                
        const savedLink = await save(linkData)
        return NextResponse.json(savedLink, { status: 200  })
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }, res: NextResponse<LinkPaginationWrapper | SessionError >) {
    const session = await getServerSession(authOptions)
    if (session) {
        const tenantId = (await params).tenantId;
        const searchParams = req.nextUrl.searchParams
        const slug = searchParams.get('slug')
        if(slug) {
            const link = await findLinkBySlug(tenantId, slug)
            return NextResponse.json(link, { status: 200  })
        }
        else {
            const cursor = searchParams.get('cursor')
            const take = searchParams.get('take')
            const links = await findPaginated(tenantId, cursor, take)
            return NextResponse.json(links, { status: 200  })
        }
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}
