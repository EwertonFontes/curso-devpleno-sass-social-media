import { LinkGroup, Prisma } from "@prisma/client"
import { prisma } from "lib/prisma"

export interface LinkGroupPaginationWrapper {
    items: LinkGroup[]
    nextCursor: string
    prevCursor: string
}


export const save = async(linkId: string, linkGroupData: Prisma.LinkGroupCreateInput): Promise<LinkGroup | null> => {
    const savedLinkGroup = await prisma.linkGroup.create({
        data: linkGroupData
    })
    return savedLinkGroup
}

export const update = async(tenantId: string, id: string, groupData: Prisma.LinkGroupUpdateInput): Promise<LinkGroup | null> => {
    const savedGroup = await prisma.linkGroup.update({
        where: { id: id},
        data: groupData
    })
    return savedGroup
}


export const findLinkGroupByName = async(tenantId: string, name: string) => {
    const linkGroup = await prisma.linkGroup.findMany({
        where: {
            name: name
        }
    })
    return linkGroup
}

export const findPaginated = async(
    tenantId: string, 
    cursor?: string | string[], 
    take?: string | string[]
): Promise<LinkPaginationWrapper> => {
    console.log(tenantId, cursor, take)
    const takeNumber = Number(take || 10)
    const args : Prisma.LinkGroupFindManyArgs = {
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
    const linkGroups = await prisma.linkGroup.findMany(args)

    let nextLink = null
    if(linkGroups.length > 0) {
        nextLink = await prisma.linkGroup.findFirst({
            select: {
                id: true
            },
            where: {
                id: {
                    gt: linkGroups[linkGroups.length-1].id
                }
            },
            orderBy: {
                id: 'asc'
            }
        })
    }

    let prevLink = null
    
    if(linkGroups.length > 0) {
        prevLink = await prisma.linkGroup.findMany({
            where: {
                id: {
                    lt: linkGroups[0].id
                }
            },
            orderBy: {
                id: 'desc'
            },
            take: takeNumber
        })
    }

    return {
        items: linkGroups,
        nextCursor: nextLink?.id || '',
        prevCursor: prevLink?.[prevLink.length -1]?.id || ''
    }
}

export const findLinkGroupById = async(tenantId: string, groupId: string) => {
    const link = await prisma.linkGroup.findFirst({
        where: {
            tenantId: tenantId,
            id: groupId
        }
    })
    return link
}