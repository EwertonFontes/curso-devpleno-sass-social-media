
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route";
import { checkTenantPermission } from "../../../../../services/users";
import { Prisma } from "@prisma/client";
import { findDomainById, update } from "../../../../../services/domain";


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ domainId: string, tenantId: string }> }) {  
    const domainId = (await params).domainId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){        
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const domain = await prisma.customDomain.findFirst({
            where: {
                id: domainId,
                tenantId: tenantId
            }
        })
        
        if(!domain){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const deletedDomain = await prisma.customDomain.delete({
            where: {
                id: domainId
            } 
        })
        return NextResponse.json(deletedDomain, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ domainId: string, tenantId: string }> }) {  
    const domainId = (await params).domainId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const domain = await findDomainById(tenantId, domainId)
        return NextResponse.json(domain, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ domainId: string, tenantId: string }> }) {  
    const domainId = (await params).domainId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const domain = await prisma.customDomain.findFirst({
            where: {
                id: domainId,
                tenantId: tenantId
            }
        })
        if(!domain){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const body = await req.json()
                
        const linkData: Prisma.CustomDomainUpdateInput = {
            domainName: String(body.domainName),
            tenants: {
                connect: {
                    id: String(tenantId)
                }
            }
        }
                        
        const savedDomain = await update(tenantId, domainId, linkData)
        return NextResponse.json(savedDomain, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}

