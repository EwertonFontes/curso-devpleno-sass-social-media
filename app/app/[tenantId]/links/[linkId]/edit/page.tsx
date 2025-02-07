'use client'

import Heading1 from "components/Heading1"
import Heading2 from "components/Heading2"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useParams,  useRouter } from 'next/navigation';
import Link from "next/link";
import { post } from "lib/fetch";
import { useGet } from "../../../../../../hooks/api";
import { useEffect, useState } from "react";


const linkSchema = yup.object({
    name: yup.string().required(),
    publicName: yup.string().required(),
    slug: yup.string().required(),
    destination: yup.string().required(),
    appName: yup.string().required(),
}).required();

interface NewLinkForm {
    name: string
    publicName: string
    slug: string
    destination: string
    appName: string
}

const EditLink = () => {
    const router = useRouter()
    const params = useParams()
    const [success, setSuccess] = useState(false)
    const tenantId = params?.tenantId
    const linkId = params?.linkId
   
    const { register, handleSubmit, setValue, formState: { errors }  } = useForm<NewLinkForm>({
        resolver: yupResolver(linkSchema)
    })

    const submit: SubmitHandler<NewLinkForm> = async (inputs: any) => {
        const data = await post({ url: `/api/${tenantId}/links`, data: inputs })
        setSuccess(true)
        router.push(`/app/${tenantId}/links`)
    }
    const {data} = useGet(`/api/${tenantId}/links/${linkId}`)
    useEffect(() => {
        if (data) {
            setValue('name', data.name)
            setValue('slug', data.slug)
            setValue('publicName', data.publicName)
            setValue('destination', data.destination)
            setValue('appName', data.appName)
        }
    }, [data])
    return(
        <>
            <div className='grid grid-cols-1 md:grid-cols-2'>
                <div>
                    <Heading1>Gerenciador de Links</Heading1>
                </div>
            </div>
            { success && 
                <div className="px-4 py-3 leading-normal text-blue-700 bg-blue-100 rounded-lg" role="alert">
                    <p>Configurações salvas com sucesso!</p>
                </div>
            }
            <section className="h-screen bg-gray-100/50">
                <form onSubmit={handleSubmit(submit)} className="container max-w-2xl mx-auto shadow-md md:w-3/4 mt-4">
                    <div className="p-4 border-t-2 border-indigo-400 rounded-lg bg-gray-100/5 ">
                    <div className="max-w-sm mx-auto md:w-full md:mx-0">
                        <div className="inline-flex items-center space-x-4">
                        <Heading2>Editar Link</Heading2>
                        </div>
                    </div>
                    </div>
                    <div className="space-y-6 bg-white">
                    <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
                        <h2 className="max-w-sm mx-auto md:w-1/3">Identificação</h2>
                        <div className="max-w-sm mx-auto md:w-2/3 space-y-5">
                        <div>
                        <div className=" relative ">
                            <input
                            type="text"
                            className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Nome Interno"
                            {...register('name')}
                            />
                        </div>
                        </div>
                        <div>
                        <div className=" relative ">
                            <input
                            type="text"
                            id="user-info-email"
                            className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Nome publico"
                            {...register('publicName')}
                            />
                        </div>
                        </div>
                        <div>
                        <div className=" relative ">
                            <input
                            type="text"
                            className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Identificados [Slug]"
                            {...register('slug')}
                            />
                        </div>
                        </div>
                        </div>
                    </div>
                    <hr />
                    <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
                        <h2 className="max-w-sm mx-auto md:w-1/3">Destino</h2>
                        <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
                        <div>
                            <div className=" relative ">
                            <input
                                type="text"
                                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="https://"
                                {...register('destination')}
                            />
                            </div>
                        </div>
                        <div>
                            <div className=" relative ">
                            <input
                                type="text"
                                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="Link interno"
                                {...register('appName')}
                            />
                            </div>
                        </div>
                        </div>
                    </div>                    
                    <hr />
                    <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
                        <button
                        type="submit"
                        className="py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                        >
                        Save
                        </button>
                    </div>
                    </div>
                </form>
                
            </section>
        </>
    )
}

export default EditLink