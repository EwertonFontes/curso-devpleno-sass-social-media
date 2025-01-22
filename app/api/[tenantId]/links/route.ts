
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "lib/prisma"
import { getSession } from "next-auth/react"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"


export async function POST(req: NextApiRequest, res: NextApiResponse) {    
    const session = await getServerSession(authOptions)
    
    if (session) {
        console.log('REQUEST DONE')
        const linkData = {
            name: req.body.name,
            publicName: req.body.publicName,
            slug: req.body.slug,
            destination: req.body.destination,
            tenantId: req.body.tenantId
        }
        const tenants = await prisma.tenant.findMany({
            where: {
                users: {
                    some: {
                        userId: session.user.id
                    }
                }
            }
        })

        const savedLink = await prisma.link.create({
            data: linkData
        })
        return NextResponse.json(tenants, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {    
    const session = await getServerSession(authOptions)
    
    if (session) {
        const links = await prisma.link.findMany({
            where: {
                tenantId: {
                    equals: req.query.tenantId
                }
            }
        })

        return NextResponse.json(links, { status: 200  })
    } else {
        return NextResponse.json('ERRORS', { status: 404 })
    }
}
