
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"

import type { NextApiRequest } from "next"
import { Prisma } from "@prisma/client"
import { authOptions } from "../../auth/[...nextauth]/route"
import { checkTenantPermission } from "../../../../services/users"

export async function POST(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }, res: NextApiResponse<LinkPaginationWrapper | SessionError >) {  
    const session = await getServerSession(authOptions)
    const tenantId = (await params).tenantId;
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const body = await req.json()
        const countMaxOrder = await prisma.$queryRaw`SELECT MAX("LinkOnPublicPage"."order") FROM "LinkOnPublicPage" WHERE  "LinkOnPublicPage"."tenantId" = ${tenantId}`
        await prisma.linkOnPublicPage.create({
            data: {
                itemType: 'title',
                itemValue: body.title,
                tenantId,
                order: countMaxOrder[0].max + 1
            }
        })
       
        return NextResponse.json({'message': 'OK'}, { status: 200  })
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}