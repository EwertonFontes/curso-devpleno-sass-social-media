'use client'

import Heading1 from "components/Heading1"
import Heading2 from "components/Heading2"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useParams,  useRouter } from 'next/navigation';
import Link from "next/link";
import { post } from "lib/fetch";


const tenantSchema = yup.object({
    name: yup.string().required(),
    slug: yup.string().required().test(
        'is-slug-unique',
        'Esse já foi utilizado',
        async(value, context) => {
            const tenant = await fetch(`/api/tenants?slug=${value}`)
            const tenantData = await tenant.json()
            if (tenantData && tenantData.id) {
                return false
            }
            return true
        }
    ),
    plano: yup.string().required()
}).required();

interface NewTenantForm {
    name: string
    slug: string
    plano: string
}

const CreateTenant = () => {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }  } = useForm<NewTenantForm>({
        resolver: yupResolver(tenantSchema)
    })

    const submit: SubmitHandler<NewTenantForm> = async (inputs: any) => {
        const data = await post({ url: `/api/tenants`, data: inputs })
        router.push(`/app`)
    }
        
    return(
        <>
             <div className='grid grid-cols-1 md:grid-cols-2'>
                <div>
                    <Heading1>Criar Nova Conta</Heading1>
                </div>
            </div>
            <section className="h-screen bg-gray-100/50">
                <form onSubmit={handleSubmit(submit)} className="container max-w-2xl mx-auto shadow-md md:w-3/4 mt-4">
                    <div className="p-4 border-t-2 border-indigo-400 rounded-lg bg-gray-100/5 ">
                    <div className="max-w-sm mx-auto md:w-full md:mx-0">
                        <div className="inline-flex items-center space-x-4">
                        <Heading2>Criar Novo Tenant</Heading2>
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
                            {errors?.name?.message && <p>{errors?.name?.message}</p>}
                        </div>
                        </div>
                        <div>
                        </div>
                        <div>
                        <div className=" relative ">
                            <input
                            type="text"
                            className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Identificados [Slug]"
                            {...register('slug')}
                            />
                            {errors?.slug?.message && <p>{errors?.slug?.message}</p>}
                        </div>
                        <div>
                        </div>
                        </div>
                        <div>
                        <div className=" relative ">
                            <input
                                type="text"
                                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="Plano"
                                {...register('plano')}
                            />
                            {errors?.plano?.message && <p>{errors?.plano?.message}</p>}
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

export default CreateTenant