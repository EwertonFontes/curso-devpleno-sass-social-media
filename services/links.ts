import { prisma } from "lib/prisma"
import { Link, Prisma } from '@prisma/client'
import { link } from "fs"

export interface LinkPaginationWrapper {
    items: Link[]
    nextCursor: string
    prevCursor: string
}

export interface ClickPaginationWrapper {
    items: Click[]
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

    const linkWithClicks = await prisma.click.groupBy({
        by:["linkId"],
        _count: {
            id: true
        },
        where: {
            linkId: { in: links.map((link) => link.id) }
        }
    })

    const linkWithAnalytics = links.map((link) => {
        return {
            ...link,
            clicks: linkWithClicks.find(click => click.linkId === link.id)?._count?.id || 0
        }
    })

    return {
        items: linkWithAnalytics,
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

export const findLinkById = async(tenantId: string, linkId: string) => {
    const link = await prisma.link.findFirst({
        where: {
            tenantId: tenantId,
            id: linkId
        }
    })
    return link
}

export const findAnalyticsPaginated = async(
    linkId: string, 
    cursor?: string | string[], 
    take?: string | string[]
): Promise<ClickPaginationWrapper> => {
    const takeNumber = Number(take || 10)
    const args : Prisma.ClickFindManyArgs = {
        where: {
            linkId: {
                equals: linkId
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
    const clicks = await prisma.click.findMany(args)

    let nextClick = null
    if(clicks.length > 0) {
        nextClick = await prisma.click.findFirst({
            select: {
                id: true
            },
            where: {
                id: {
                    gt: clicks[clicks.length-1].id
                }
            },
            orderBy: {
                id: 'asc'
            }
        })
    }

    let prevClick = null
    
    if(clicks.length > 0) {
        prevClick = await prisma.click.findMany({
            where: {
                id: {
                    lt: clicks[0].id
                }
            },
            orderBy: {
                id: 'desc'
            },
            take: takeNumber
        })
    }

    return {
        items: clicks,
        nextCursor: nextClick?.id || '',
        prevCursor: prevClick?.[prevClick.length -1]?.id || ''
    }
}