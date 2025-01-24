
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
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

const getPaginatedLinks = async(tenantId, cursor, take) => {
    console.log(tenantId, cursor, take)
    const takeNumber = Number(take || 5)
    const args : Prisma.LinkFindManyArgs = {
        select: {
            id: true,
            name: true
        },
        where: {
            tenantId: {
                equals: tenantId
            }
        },
        take: takeNumber,
        orderBy: {
            id: 'asc'
        }
    }
    if(cursor){
        args.cursor = {
            id: String(cursor)
        }
    }
    const links = await prisma.link.findMany(args)
    const  nextLink = await prisma.link.findFirst({
        select: {
            id: true
        },
        where: {
            id: {
                gt: links[links.length-1].id
            }
        },
        orderBy: {
            id: 'asc'
        }
    })
    const prevLink = await prisma.link.findMany({
        where: {
            id: {
                lt: links[0].id
            }
        },
        orderBy: {
            id: 'desc'
        },
        take: takeNumber
    })
    return {
        items: links,
        nextCursor: nextLink?.id || '',
        prevCursor: prevLink?.[prevLink.length -1]?.id || ''
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }) {
    const session = await getServerSession(authOptions)
    if (session) {
        const tenantId = (await params).tenantId;
        
        const searchParams = req.nextUrl.searchParams
        const cursor = searchParams.get('cursor')
        const take = searchParams.get('take')
        
        const page1 = await getPaginatedLinks(tenantId, cursor, take)
        const page2 = await getPaginatedLinks(tenantId, page1.nextCursor, take)
        const pagePrev2 = await getPaginatedLinks(tenantId, page2.prevCursor, take)
        const page3 = await getPaginatedLinks(tenantId, page2.nextCursor, take)
        const pagePrev3 = await getPaginatedLinks(tenantId, page3.prevCursor, take)

        return NextResponse.json({
            page1: page1,
            page2: page2,
            page3: page3,
            prevPage2:pagePrev2,
            prevPage3: pagePrev3
        }, { status: 200  })
        
        /* return NextResponse.json({
            cursor: cursor,
            take: take,
            items: links
        }, { status: 200  }) */
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}
