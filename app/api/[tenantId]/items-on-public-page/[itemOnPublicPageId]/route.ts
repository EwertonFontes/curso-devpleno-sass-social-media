
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"

import type { NextApiRequest } from "next"
import { Prisma } from "@prisma/client"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { checkTenantPermission } from "../../../../../services/users"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ linkId: string, tenantId: string }> }) {  
    const linkId = (await params).linkId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const body = await req.json()
        const id = body?.id
        const order = body?.order

        await prisma.linkOnPublicPage.update({
            data: {
                order: Number(order)
            },
            where: {
                id
            }
        })
        return NextResponse.json([{'message': 'ok'}], { status: 200  })        
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}