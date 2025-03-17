
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import type { NextApiRequest, NextApiResponse } from "next"
import { Campaign, Prisma } from "@prisma/client"
import { checkTenantPermission } from "../../../../services/users"
import { CampaignPaginationWrapper, findPaginated, NewCampaignForm, save } from "../../../../services/campaigns"

type LinkData = {
    id: string
    name: string
    slug: string
}

type LinkPaginationWrapper = {
    cursor: string
    take: number
    items: LinkData[]
}

interface SessionError {
    message: string
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }, res: NextApiResponse<CampaignPaginationWrapper | SessionError | Campaign >) {  
    const session = await getServerSession(authOptions)
    const tenantId = (await params).tenantId;
    
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const body = await req.json()
        const campaignData: NewCampaignForm = {
            name: String(body.name),
            urlParams: body.urlParams,
            tenants: {
                connect: {
                    id: String(tenantId)
                }
            }
        }
        console.log('CREATE CAMPANHA')
        console.log(campaignData)
                
        const savedCampaign = await save(campaignData)
        return NextResponse.json(savedCampaign, { status: 200  })
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ tenantId: string }> }, res: NextResponse<CampaignPaginationWrapper | SessionError >) {
    const session = await getServerSession(authOptions)
    if (session) {
        const tenantId = (await params).tenantId;
        const searchParams = req.nextUrl.searchParams

        const cursor = searchParams.get('cursor')
        const take = searchParams.get('take')
        const campaigns = await findPaginated(tenantId, cursor, take)
        return NextResponse.json(campaigns, { status: 200  })
        
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}
