
import { prisma } from "lib/prisma"
import { Prisma, Tenant } from "@prisma/client"

export const findTenantBySlug = async(slug: string) => {
    const tenant = await prisma.tenant.findFirst({
        select: {
            id: true,
            name: true,
        },
        where: {
            slug: slug
        }
    })
    return tenant
}

export const findTenantById = async(tenantId: string) => {
    const tenant = await prisma.tenant.findFirst({
        where: {
            id: tenantId
        }
    })
    return tenant
}

export const save = async(id: string, tenantData: Prisma.TenantUpdateInput): Promise<Tenant> => {
    const savedTenant = await prisma.tenant.update({
        where: {
            id: id
        },
        data: tenantData
    })
    return savedTenant
}

export const create = async(userId: string, tenantData: Prisma.TenantCreateInput): Promise<Tenant> => {
    console.log('CRIANDO TENANT')
    console.log(tenantData)
        
    const savedTenant = await prisma.tenant.create({
        data: tenantData
    })

    await prisma.usersOnTenants.create({
        data: {
            tenantId: savedTenant.id,
            userId: userId,
            role: 'owner'
        }
    })
    return savedTenant
}