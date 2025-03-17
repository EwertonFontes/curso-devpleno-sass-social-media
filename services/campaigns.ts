import { prisma } from "lib/prisma"
import { Campaign, Link, Prisma } from '@prisma/client'
import { link } from "fs"

export interface CampaignPaginationWrapper {
    items: Campaign[]
    nextCursor: string
    prevCursor: string
}

export type NewCampaignForm = Prisma.CampaignCreateInput

export const save = async(campaignData: NewCampaignForm): Promise<Campaign | null> => {
    const savedCampaign = await prisma.campaign.create({
        data: campaignData
    })
    return savedCampaign
}

export const update = async(id: string, campaignData: Prisma.CampaignUpdateInput): Promise<Campaign | null> => {
    const savedCampaign = await prisma.campaign.update({
        where: { id },
        data: campaignData
    })
    return savedCampaign
}

export const findPaginated = async(
    tenantId: string, 
    cursor?: string | string[], 
    take?: string | string[]
): Promise<CampaignPaginationWrapper> => {
    console.log(tenantId, cursor, take)
    const takeNumber = Number(take || 10)
    const args : Prisma.CampaignFindManyArgs = {
        where: {
            tenantId: {
                equals: tenantId
            }
        },
        take: takeNumber,
        orderBy: {
            id: 'asc'
        }
    }
    if(cursor){
        args.cursor = {
            id: String(cursor)
        }
    }
    const campaigns = await prisma.campaign.findMany(args)

    let nextCampaign = null
    if(campaigns.length > 0) {
        nextCampaign = await prisma.campaign.findFirst({
            select: {
                id: true
            },
            where: {
                id: {
                    gt: campaigns[campaigns.length-1].id
                }
            },
            orderBy: {
                id: 'asc'
            }
        })
    }

    let prevCampaign = null
    
    if(campaigns.length > 0) {
        prevCampaign = await prisma.campaign.findMany({
            where: {
                id: {
                    lt: campaigns[0].id
                }
            },
            orderBy: {
                id: 'desc'
            },
            take: takeNumber
        })
    }

    return {
        items: campaigns,
        nextCursor: nextCampaign?.id || '',
        prevCursor: prevCampaign?.[prevCampaign.length -1]?.id || ''
    }
}

export const findCampaignById = async(tenantId: string, campaignId: string) => {
    const campaign = await prisma.campaign.findFirst({
        where: {
            tenantId: tenantId,
            id: campaignId
        }
    })
    return campaign
}
