
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import type { NextApiRequest } from "next"
import { checkTenantPermission } from "../../../../../services/users"
import { Prisma } from "@prisma/client"
import { findLinkGroupById, update } from "../../../../../services/linkGroups"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ groupId: string, tenantId: string }> }) {  
    const groupId = (await params).groupId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const group = await prisma.linkGroup.findFirst({
            where: {
                id: groupId,
                tenantId: tenantId
            }
        })
        if(!group){
            return NextResponse.json({messge: 'No group found'}, { status: 401  })
        }

        const deletedLink = await prisma.linkGroup.delete({
            where: {
                id: groupId
            } 
        })
        return NextResponse.json(deletedLink, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}


export async function GET(req: NextRequest, { params }: { params: Promise<{ groupId: string, tenantId: string }> }) {  
    const groupId = (await params).groupId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const group = await findLinkGroupById(tenantId, groupId)
        return NextResponse.json(group, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ groupId: string, tenantId: string }> }) {  
    const groupId = (await params).groupId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const group = await prisma.linkGroup.findFirst({
            where: {
                id: groupId,
                tenantId: tenantId
            }
        })
        if(!group){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const body = await req.json()
                
        const groupData: Prisma.LinkGroupUpdateInput = {
            name: String(body.name),
            tenant: {
                connect: {
                    id: String(tenantId)
                }
            }
        }
                        
        const savedGroup = await update(tenantId, groupId, groupData)
        return NextResponse.json(savedGroup, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}