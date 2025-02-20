import { LinkGroup, Prisma } from "@prisma/client"
import { prisma } from "lib/prisma"

export const save = async(linkId: string, linkGroupData: Prisma.LinkGroupCreateInput): Promise<LinkGroup | null> => {
    const savedLinkGroup = await prisma.linkGroup.create({
        data: linkGroupData
    })
    return savedLinkGroup
}

export const findLinkGroupByName = async(tenantId: string, name: string) => {
    const linkGroup = await prisma.linkGroup.findMany({
        where: {
            name: name
        }
    })
    return linkGroup
}