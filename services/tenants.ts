
import { prisma } from "lib/prisma"

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