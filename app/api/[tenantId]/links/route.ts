
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import type { NextApiRequest } from "next"

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


export async function POST(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }) {  
    const session = await getServerSession(authOptions)
    if (session) {
        const body = await req.json()
        const tenantId = (await params).tenantId;
        const linkData = {
            name: body.name,
            publicName: body.publicName,
            slug: body.slug,
            destination: body.destination,
            tenantId: tenantId
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
        
        const savedLink = await prisma.link.create({
            data: linkData
        })

        return NextResponse.json(savedLink, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }) {
    const session = await getServerSession(authOptions)
    if (session) {
        const tenantId = (await params).tenantId;
        
        const searchParams = req.nextUrl.searchParams
        const cursor = searchParams.get('cursor')
        const take = searchParams.get('take')
        let links = []

        if (cursor){
            links = await prisma.link.findMany({
                where: {
                    tenantId: {
                        equals: tenantId
                    }
                },
                cursor: {
                    id: String(cursor)
                },
                skip: 1,
                take: Number(take || 10),
                orderBy: {
                    id: 'asc'
                }
            })
        } else {
            links = await prisma.link.findMany({
                where: {
                    tenantId: {
                        equals: tenantId
                    }
                },
                take: Number(take || 10),
                orderBy: {
                    id: 'asc'
                }
            })
        }
        
        return NextResponse.json({
            cursor: cursor,
            take: take,
            items: links
        }, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}
