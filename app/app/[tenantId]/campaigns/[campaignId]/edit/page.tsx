'use client'

import Heading1 from "components/Heading1"
import Heading2 from "components/Heading2"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useParams,  useRouter } from 'next/navigation';
import Link from "next/link";
import { patch } from "lib/fetch";
import { useGet } from "../../../../../../hooks/api";
import { useEffect, useState } from "react";
import { te } from "date-fns/locale";
import CreatableSelect from "react-select/creatable";


const campaignSchema = yup.object({
    name: yup.string().required(),
}).required();

interface EditCampaignForm {
    name: string
    tenantId: string
    urlParams: {
        campaignId: string
        campaignName: string
        campaignSource: string[]
        campaignMedium: string[]        
    }
    id: string
}

const EditCampaign = () => {
    const router = useRouter()
    const params = useParams()
    const [success, setSuccess] = useState(false)
    const tenantId = params?.tenantId
    const campaignId = params?.campaignId
    const [isSlugValid, setIsSlugValid] = useState(false)
    const [isValidating, setIsValidating] = useState(false)

    const { register, handleSubmit, setValue, control, formState: { errors }  } = useForm<EditCampaignForm>({
        resolver: yupResolver(campaignSchema)
    })

    const submit: SubmitHandler<EditCampaignForm> = async (inputs: any) => {
        console.log(inputs)
        const urlParams = {
            ...inputs.urlParams,
            campaignMedium: inputs?.urlParams?.campaingMedium?.map(i => i.value),
            campaignSource: inputs?.urlParams?.campaingSource?.map(i => i.value)
        }
        inputs.urlParams = urlParams
        const data = await patch({ url: `/api/${tenantId}/campaigns/${campaignId}`, data: inputs })
        setSuccess(true)
        router.push(`/app/${tenantId}/campaigns`)
    }

    const {data} = useGet(`/api/${tenantId}/campaigns/${campaignId}`)
    useEffect(() => {
        if (data) {
            setValue('tenantId', String(tenantId))
            setValue('id', String(campaignId))
            setValue('name', data.name)
            setValue('urlParams.campaignId', data?.urlParams.campaignId)
            setValue('urlParams.campaignName', data?.urlParams.campaignName)
            const campaignMedium = data?.urlParams?.campaignMedium?.map((i) => ({ value: i, label: i}))
            setValue('urlParams.campaignMedium', campaignMedium)
            const campaignSource = data?.urlParams?.campaignSource?.map((i) => ({ value: i, label: i}))
            setValue('urlParams.campaignSource', campaignSource)
        }
    }, [data])
    return(
        <>
            <div className='grid grid-cols-1 md:grid-cols-2'>
                <div>
                    <Heading1>Gerenciador de Campaigns</Heading1>
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
                        <Heading2>Criar Campaign</Heading2>
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
                        <div className=" relative ">
                            <input
                            type="text"
                            id="user-info-email"
                            className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Campaign ID"
                            {...register('urlParams.campaignId')}
                            />
                            {errors?.urlParams?.campaignId?.message && <p>{errors?.urlParams?.campaignId.message}</p>}
                        </div>
                        </div>
                        <div>
                        <div className=" relative ">
                            <input
                            type="text"
                            className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            placeholder="Campaign Name"
                            {...register('urlParams.campaignName')}
                            />
                            {errors?.urlParams?.campaignName?.message && <p>{errors?.urlParams?.campaignName.message}</p>}
                        </div>
                        </div>
                        <div>
                        <div className=" relative ">
                            <Controller name='urlParams.campaignSource' control={control} render={({field}) => (
                                <CreatableSelect
                                {...field}
                                isClearable
                                isMulti
                                placeholder='Type for Campaign Source'
                                />
                            )} />
                            {errors?.urlParams?.campaignSource?.[0]?.message && <p>{errors?.urlParams?.campaignSource?.[0].message}</p>}
                        </div>
                        </div>
                        <div>
                        <div className=" relative ">
                            <Controller name='urlParams.campaignMedium' control={control} render={({field}) => (
                                <CreatableSelect
                                {...field}
                                isClearable
                                isMulti
                                placeholder='Type for Campaign Medium'
                                />
                            )} />
                            {errors?.urlParams?.campaignMedium?.[0]?.message && <p>{errors?.urlParams?.campaignMedium?.[0].message}</p>}
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

export default EditCampaign