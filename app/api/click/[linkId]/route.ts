import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma, Tenant } from "@prisma/client"
import { save } from "../../../../services/tenants"
import { checkTenantPermission } from "../../../../services/users"
import { authOptions } from "../../auth/[...nextauth]/route"


export async function GET(req: NextRequest, { params }: { params: Promise<{ linkId: string }> }) {  
    const session = await getServerSession(authOptions)
    const linkId = (await params).linkId;
    console.log('HEADERS REQ', req.headers)
    if (session) {
        const savedClick = await prisma.click.create({
            data: {
                metadata: JSON.stringify(req.headers),
                linkId: linkId,
            }
        })

        return NextResponse.json(savedClick, { status: 200  })
    } else {
        return NextResponse.json({messge: 'No authentication'}, { status: 401  })
    }
}