import { prisma } from "lib/prisma"
import { CustomDomain, Prisma } from '@prisma/client'
import { link } from "fs"



export const save = async(tenantId: string, domainData: Prisma.CustomDomainCreateInput): Promise<CustomDomain | null> => {
    const currentDomain = await findByDomainName(tenantId, domainData.domainName)
    if(!currentDomain){
        const savedDomain = await prisma.customDomain.create({
            data: domainData
        })
        return savedDomain
    }
    return null
}

/*
export const update = async(tenantId: string, id: string, linkData: Prisma.LinkUpdateInput): Promise<Link | null> => {
    const currentLink = await findLinkBySlug(tenantId, linkData.slug)
    if(!currentLink || currentLink?.id == id){
        const savedLink = await prisma.link.update({
            where: { id: id},
            data: linkData
        })
        return savedLink
    }
    return null
}
*/

export const findByDomainName = async(tenantId: string, domainName: string) => {
    const domain = await prisma.customDomain.findFirst({
        select: {
            id: true,
            domainName: true
        },
        where: {
            tenantId: tenantId,
            domainName
        }
    })
    return domain
}

export const findAll = async(
    tenantId: string, 
): Promise<CustomDomain[]> => {
    const args : Prisma.CustomDomainFindManyArgs = {
        where: {
            tenantId: {
                equals: tenantId
            }
        },
        orderBy: {
            id: 'asc'
        }
    }

    const customDomains = await prisma.customDomain.findMany(args)
    return customDomains
}
