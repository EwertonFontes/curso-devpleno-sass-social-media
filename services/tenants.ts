
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

export const save = async(id: string, tenantData: Prisma.TenantUpdateInput): Promise<Tenant> => {
    const savedTenant = await prisma.tenant.update({
        where: {
            id: id
        },
        data: tenantData
    })
    return savedTenant
}