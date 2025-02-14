'use client'

import Heading1 from "components/Heading1"
import Heading2 from "components/Heading2"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useParams,  useRouter } from 'next/navigation';
import Link from "next/link";
import { post } from "lib/fetch";
import { useEffect } from "react";


const domainNameSchema = yup.object({
    domainName: yup.string().required().test(
        'is-domain-unique',
        'Esse Dominio já foi utilizado',
        async(value, context) => {
            const domain = await fetch(`/api/${context.parent.tenantId}/domains?domainName=${value}`)
            const domainData = await domain.json()
            if (domainData && domainData.id) {
                return false
            }
            return true
        }
    ),
}).required();

interface NewDomainNameForm {
    domainName: string
    tenantId: string
}

const CreateDomain = () => {
    const router = useRouter()
    const params = useParams()
    const tenantId = params?.tenantId

    const { register, handleSubmit, setValue, formState: { errors }  } = useForm<NewDomainNameForm>({
        resolver: yupResolver(domainNameSchema)
    })

    useEffect(() => {
        setValue('tenantId', String(tenantId))
    }, [params])

    const submit: SubmitHandler<NewDomainNameForm> = async (inputs: any) => {
        const data = await post({ url: `/api/${tenantId}/domains`, data: inputs })
        router.push(`/app/${tenantId}/settings/domains`)
    }
        
    return(
        <>
             <div className='grid grid-cols-1 md:grid-cols-2'>
                <div>
                    <Heading1>Criar Novo Dominio</Heading1>
                </div>
            </div>
            <section className="h-screen bg-gray-100/50">
                <form onSubmit={handleSubmit(submit)} className="container max-w-2xl mx-auto shadow-md md:w-3/4 mt-4">
                    <div className="p-4 border-t-2 border-indigo-400 rounded-lg bg-gray-100/5 ">
                    <div className="max-w-sm mx-auto md:w-full md:mx-0">
                        <div className="inline-flex items-center space-x-4">
                        <Heading2>Criar Dominio</Heading2>
                        </div>
                    </div>
                    </div>
                    <div className="space-y-6 bg-white">
                    <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
                        <h2 className="max-w-sm mx-auto md:w-1/3">Nome do Dominio</h2>
                        <div className="max-w-sm mx-auto md:w-2/3 space-y-5">
                        <div>
                        <div className=" relative ">
                            <input
                            type="text"
                            className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Nome de Dominio"
                            {...register('domainName')}
                            />
                            {errors?.domainName?.message && <p>{errors?.domainName?.message}</p>}
                        </div>
                        </div>
                        <div>
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
                </form>
                
            </section>
        </>
    )
}

export default CreateDomain