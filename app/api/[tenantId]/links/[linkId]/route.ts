
import { NextResponse, NextRequest } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import type { NextApiRequest } from "next"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ linkId: string }> }) {  
    const session = await getServerSession(authOptions)
    if (session) {
        const linkId = (await params).linkId;
        const tenants = await prisma.tenant.findMany({
            where: {
                users: {
                    some: {
                        userId: session.user.id
                    }
                }
            }
        })
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