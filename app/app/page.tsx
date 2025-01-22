'use client'
import useSWR from 'swr'
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const fetcher = (...args) => fetch(...args).then(res => res.json())
const AppIndex = () => {
    const router = useRouter()
    const [shouldRedirect, setShouldRedirect] = useState(false)
    const { data, error, isLoading } = useSWR('/api/tenants', fetcher)
    const { data: session } = useSession()
    useEffect(() =>{
        if(data && data.length === 1) {
            setShouldRedirect(true)
        }
    }, [data])
    useEffect(() =>{
        if (shouldRedirect) {
            setTimeout(() => {
                router.push('/app/'+data[0].id)
            }, 3000)
            setShouldRedirect(false)
        }
    }, [shouldRedirect])
    return(
        <div className="max-w-lg mx-auto text-center my-6">
            <img src={session?.user?.image} alt="Profile Image" className="rounded-full w-16 inline-block" />
            <h1>{session?.user?.name}</h1>
            <div className="mt-6">
                {
                    data &&  data.length > 1 && data.map(tenant => (
                        <Link href={'/app/' + tenant.id} className="inline-block text-center items-center w-full px-4 py-2 text-base font-medium text-black bg-white border rounded-md hover:bg-gray-100">
                            {tenant.name}
                        </Link>
                    ))
                }
            </div>
            <div>
                <svg
                    width={38}
                    height={38}
                    viewBox="0 0 38 38"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-blue-500"
                    >
                    <defs>
                        <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                        <stop stopColor="#fff" stopOpacity={0} offset="0%" />
                        <stop stopColor="#fff" stopOpacity=".631" offset="63.146%" />
                        <stop stopColor="#fff" offset="100%" />
                        </linearGradient>
                    </defs>
                    <g fill="none" fillRule="evenodd">
                        <g transform="translate(1 1)">
                        <path
                            d="M36 18c0-9.94-8.06-18-18-18"
                            id="Oval-2"
                            stroke="url(#a)"
                            strokeWidth={2}
                        >
                            <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="0.9s"
                            repeatCount="indefinite"
                            />
                        </path>
                        <circle fill="#fff" cx={36} cy={18} r={1}>
                            <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="0.9s"
                            repeatCount="indefinite"
                            />
                        </circle>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    )
}

export default AppIndex