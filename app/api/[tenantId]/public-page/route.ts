
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import type { NextApiRequest, NextApiResponse } from "next"
import { LinkOnPublicPage, Prisma, Tenant } from "@prisma/client"
import { getPublicLinks } from "../../../../services/links"
import { checkTenantPermission } from "../../../../services/users"

interface SessionError {
    message: string
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }, res: NextApiResponse<SessionError | LinkOnPublicPage>) {  
    const session = await getServerSession(authOptions)
    const tenantId = (await params).tenantId;
    if (session) {
        const usertenant = await checkTenantPermission(tenantId, session.user.id)
        if(!usertenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const links = await getPublicLinks(tenantId)
        return NextResponse.json(links, { status: 200  })
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}
