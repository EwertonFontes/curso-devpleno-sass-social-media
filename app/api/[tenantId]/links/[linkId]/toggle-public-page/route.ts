
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"

import type { NextApiRequest } from "next"
import { Prisma } from "@prisma/client"
import { authOptions } from "../../../../auth/[...nextauth]/route"
import { checkTenantPermission } from "../../../../../../services/users"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ linkId: string, tenantId: string }> }) {  
    const linkId = (await params).linkId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const link = await prisma.link.findFirst({
            where: {
                id: linkId,
                tenantId: tenantId
            }
        })
        if(!link){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const body = await req.json()
        const action = String(body.action)

        if (action == 'add') {
            const countMaxOrder = await prisma.$queryRaw`SELECT MAX("LinkOnPublicPage"."order") FROM "LinkOnPublicPage" WHERE  "LinkOnPublicPage"."tenantId" = ${tenantId}`
            const newPublicLinkOnPage = await prisma.linkOnPublicPage.create({
                data:  {
                    highlight: false,
                    itemValue: '',
                    itemType: 'link',
                    order: countMaxOrder[0].max + 1,
                    linkId,
                    tenantId
                }
            })
            return NextResponse.json(newPublicLinkOnPage, { status: 200  })
        }

        const linkOnPublicPage = await prisma.linkOnPublicPage.findFirst({
            where: {
                linkId
            }
        })

        await prisma.linkOnPublicPage.delete({
            where:{ id: linkOnPublicPage?.id }
        })

        return NextResponse.json([], { status: 200  })        
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}