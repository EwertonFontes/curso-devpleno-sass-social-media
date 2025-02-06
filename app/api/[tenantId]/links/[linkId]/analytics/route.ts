
import { NextResponse, NextRequest } from "next/server"

import { getServerSession } from "next-auth"
import { findAnalyticsPaginated, findPaginated } from "../../../../../../services/links"
import { checkTenantPermission } from "../../../../../../services/users";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function GET(req: NextRequest, { params }: { params: Promise<{ linkId: string, tenantId: string }> }) {  
    const linkId = (await params).linkId;
    const tenantId = (await params).tenantId
    const session = await getServerSession(authOptions)
    const searchParams = req.nextUrl.searchParams
    if (session) {
        const tenant = await checkTenantPermission(tenantId, session.user.id)
        console.log('TEM TENANT', tenant)
        if(!tenant){
            return NextResponse.json({messge: 'No authentication'}, { status: 401  })
        }

        const cursor = searchParams.get('cursor')
        const take = searchParams.get('take')
        const clicks = await findAnalyticsPaginated(linkId, cursor, take)
                
        return NextResponse.json(clicks, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}