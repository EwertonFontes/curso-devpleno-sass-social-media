'use client'

import Heading1 from "components/Heading1"
import Heading2 from "components/Heading2"
import { SubmitHandler, useForm, Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useParams,  useRouter } from 'next/navigation';
import Link from "next/link";
import { post } from "lib/fetch";
import { useEffect, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { fields } from "@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js";


const linkSchema = yup.object({
    name: yup.string().required(),
    publicName: yup.string().required(),
    slug: yup.string().required().test(
        'is-slug-unique',
        'Esse já foi utilizado',
        async(value, context) => {
            console.log('VALIDANDO SLUG')
            const link = await fetch(`/api/${context.parent.tenantId}/links?slug=${value}`)
            const linkData = await link.json()
            if (linkData && linkData.id) {
                return false
            }
            return true
        }
    ),
    destination: yup.string().required(),
    appName: yup.string().required(),
}).required();

interface GroupOption {
    label: string;
    value: string;
    _isNew__?: boolean
}

interface NewLinkForm {
    name: string
    publicName: string
    slug: string
    destination: string
    appName: string
    tenantId: string
    groups: GroupOption[]
}


const CreateLink = () => {
    const router = useRouter()
    const params = useParams()
    const tenantId = params?.tenantId
   
    const { register, handleSubmit, setValue, control, watch, formState: { errors }  } = useForm<NewLinkForm>({
        resolver: yupResolver(linkSchema)
    })

    const submit: SubmitHandler<NewLinkForm> = async (inputs: any) => {
        const data = await post({ url: `/api/${tenantId}/links`, data: inputs })
        router.push(`/app/${tenantId}/links`)
    }
    
    const getOptions = async (inputValue: string) => {
        if(inputValue && inputValue.length > 2) {
            const data = await fetch(`/api/${tenantId}/groups?name=`+inputValue)
            const json = await data.json()
            return json.map((item) => ({
                value: item.id,
                label: item.name
            }))
        }
        return []
    }


    console.log(watch('groups'))
    useEffect(( )=> {
        setValue('tenantId', tenantId)
    }, [params])
    return(
        <>
             <div className='grid grid-cols-1 md:grid-cols-2'>
                <div>
                    <Heading1>Gerenciador de Links</Heading1>
                    <Heading2>Gerenciador de Links</Heading2>
                </div>
            </div>
            <section className="h-screen bg-gray-100/50">
                <form onSubmit={handleSubmit(submit)} className="container max-w-2xl mx-auto shadow-md md:w-3/4 mt-4">
                    <div className="p-4 border-t-2 border-indigo-400 rounded-lg bg-gray-100/5 ">
                    <div className="max-w-sm mx-auto md:w-full md:mx-0">
                        <div className="inline-flex items-center space-x-4">
                        <Heading2>Criar Link</Heading2>
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
                            placeholder="Nome publico"
                            {...register('publicName')}
                            />
                            {errors?.publicName?.message && <p>{errors?.publicName?.message}</p>}
                        </div>
                        </div>
                        <div>
                        <div className=" relative ">
                            <Controller name='groups' control={control} render={({field}) => (
                                <AsyncCreatableSelect
                                {...field}
                                cacheOptions
                                defaultOptions
                                isClearable
                                isMulti
                                loadOptions={getOptions}
                                />
                            )} />
                            {errors?.publicName?.message && <p>{errors?.publicName?.message}</p>}
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
                            {errors?.slug?.message && <p>{errors?.slug?.message}</p>}
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
                            {errors?.destination?.message && <p>{errors?.destination?.message}</p>}
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
                            {errors?.appName?.message && <p>{errors?.appName?.message}</p>}
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

export default CreateLink