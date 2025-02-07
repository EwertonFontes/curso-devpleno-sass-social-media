
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import type { NextApiRequest } from "next"
import { checkTenantPermission } from "../../../../../services/users"
import { findLinkById } from "../../../../../services/links"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ linkId: string, tenantId: string }> }) {  
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

        const deletedLink = await prisma.link.delete({
            where: {
                id: linkId
            } 
        })
        return NextResponse.json(deletedLink, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ linkId: string, tenantId: string }> }) {  
    const linkId = (await params).linkId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const link = await findLinkById(tenantId, linkId)
        return NextResponse.json(link, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}