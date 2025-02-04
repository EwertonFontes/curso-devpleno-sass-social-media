import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"


export async function GET(req: NextRequest, { params }: { params: Promise<{ tenantId: string }>}) {    
    const session = await getServerSession(authOptions)
    if (session) {
        const tenantId = (await params).tenantId
        if(tenantId){
            const tenant = await prisma.tenant.findFirst({
                where: {
                    id: tenantId
                }
            })
            return NextResponse.json(tenant, { status: 200  })
        } else {
            return NextResponse.json('No Authentication', { status: 401 })
        }
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}
