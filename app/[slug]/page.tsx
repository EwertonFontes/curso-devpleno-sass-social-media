'use client'
import { useParams, useRouter } from "next/navigation"
import { useGet } from "../../hooks/api"
import Head from 'next/head'

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
    const links = useGet(tenant?.data && `/api/${tenant?.data?.id}/links`)
    return(
        <>
        <Head>
            <title>{tenant?.data?.name}</title>
            <meta name='description' content={`Todos os links do ${tenant?.data?.name} você encontra aqui`} />
        </Head>
        <div className="max-w-xl mx-auto pt-4">
            <h1 className="text-center font-bold text-4xl">{tenant?.data?.name}</h1>
            {links?.data?.map(link => {
                return <a href={link.destination} className="transition-all inline-block text-center items-center w-full px-4 py-2 text-base font-medium text-black bg-white border rounded-md hover:bg-gray-100">{link.publicName}</a>
            })}
            <hr />
            <footer className="text-center text-sm mt-2">
                Construido com: Social Media Belt
            </footer>
        </div>
        </>
    )
}

export default TenantHome