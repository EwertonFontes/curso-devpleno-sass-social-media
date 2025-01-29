import { prisma } from "lib/prisma"
import { Link, Prisma } from '@prisma/client'
import { link } from "fs"

export interface LinkPaginationWrapper {
    items: Link[]
    nextCursor: string
    prevCursor: string
}

export const save = async(linkData: Prisma.LinkCreateInput): Promise<Link> => {
    const savedLink = await prisma.link.create({
        data: linkData
    })
    return savedLink
}
export const findPaginated = async(
    tenantId: string, 
    cursor?: string | string[], 
    take?: string | string[]
): Promise<LinkPaginationWrapper> => {
    console.log(tenantId, cursor, take)
    const takeNumber = Number(take || 10)
    const args : Prisma.LinkFindManyArgs = {
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

    let nextLink = null
    if(links.length > 0) {
        nextLink = await prisma.link.findFirst({
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
    }

    let prevLink = null
    
    if(links.length > 0) {
        prevLink = await prisma.link.findMany({
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
    }
    return {
        items: links,
        nextCursor: nextLink?.id || '',
        prevCursor: prevLink?.[prevLink.length -1]?.id || ''
    }
}

export const findLinkBySlug = async(tenantId: string, slug: string) => {
    const link = await prisma.link.findFirst({
        select: {
            id: true,
            destination: true
        },
        where: {
            tenantId: tenantId,
            slug: slug
        }
    })
    return link
}