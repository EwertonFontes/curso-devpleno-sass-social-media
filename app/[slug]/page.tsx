'use client'
import { useParams, useRouter } from "next/navigation"
import { useGet } from "../../hooks/api"

const TenantHome = () => {
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

    return(
        <>
            <pre>{JSON.stringify(tenant?.data, null, 2)}</pre>
        </>
    )
}

export default TenantHome