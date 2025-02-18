import { prisma } from "lib/prisma"
import { CustomDomain, Prisma } from '@prisma/client'
import { link } from "fs"



export const save = async(tenantId: string, domainData: Prisma.CustomDomainCreateInput): Promise<CustomDomain | null> => {
    const currentDomain = await findByDomainName(domainData.domainName)
    if(!currentDomain){
        const savedDomain = await prisma.customDomain.create({
            data: domainData
        })
        return savedDomain
    }
    return null
}


export const update = async(tenantId: string, id: string, domainData: Prisma.CustomDomainUpdateInput): Promise<CustomDomain | null> => {
    const currentDomain = await findByDomainName(String(domainData.domainName))
    if(!currentDomain || currentDomain?.id == id){
        const savedDomain = await prisma.customDomain.update({
            where: { 
                id: id,
                tenantId
            },
            data: domainData
        })
        return savedDomain
    }
    return null
}


export const findByDomainName = async(domainName: string) => {
    const domain = await prisma.customDomain.findFirst({
        select: {
            id: true,
            domainName: true
        },
        where: {
            domainName
        }
    })
    return domain
}


export const findDomainById = async(tenantId: string, domainId: string) => {
    const link = await prisma.customDomain.findFirst({
        where: {
            tenantId: tenantId,
            id: domainId
        }
    })
    return link
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
