'use client'

import { useParams, useRouter } from 'next/navigation';
import { useGet } from '../../../hooks/api';

export default function Slug() {
    const router = useRouter()
    const params = useParams()
    const slug = params?.slug
    let tenant = null
    if(slug.indexOf('.') < 0) {
        tenant = useGet(params?.slug && `/api/tenants?slug=${params?.slug}`)
        if (!tenant.data){
            console.log("PAGE NOT FOUND!")
        }
    }

    const link = useGet(params?.link && `/api/${tenant?.data?.id}/links?slug=${params?.link}`)
    if (!tenant.link){
        console.log("PAGE NOT FOUND!")
    }

    router.push(link?.data?.destination)
    

    return(
        <>
            <pre>{JSON.stringify(tenant?.data, null, 2)}</pre>
            <pre>{JSON.stringify(link?.data, null, 2)}</pre>
        </>
    )
}
