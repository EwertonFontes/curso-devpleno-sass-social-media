
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"

import type { NextApiRequest } from "next"
import { Prisma } from "@prisma/client"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { checkTenantPermission } from "../../../../../services/users"
import { findCampaignById, update } from "../../../../../services/campaigns"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ campaignId: string, tenantId: string }> }) {  
    const id = (await params).campaignId
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const campaign = await prisma.campaign.findFirst({
            where: {
                id,
                tenantId
            }
        })

        if (!campaign) {
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const deleted = await prisma.campaign.delete({
            where: {
                id
            } 
        })
        return NextResponse.json(deleted, { status: 200  })
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
        
        const link = await findCampaignById(tenantId, linkId)
        return NextResponse.json(link, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ campaignId: string, tenantId: string }> }) {  
    const id = (await params).campaignId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }
        
        const campaign = await prisma.campaign.findFirst({
            where: {
                id,
                tenantId: tenantId
            }
        })
        if(!campaign){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const body = await req.json()
                
        const campaignData: Prisma.CampaignUpdateInput = {
            name: String(body.name),
            urlParams: body.urlParams,
            tenants: {
                connect: {
                    id: String(tenantId)
                }
            }
        }
                        
        const savedCampaign = await update(id, campaignData)
        return NextResponse.json(savedCampaign, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}