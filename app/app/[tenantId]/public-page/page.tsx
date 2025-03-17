'use client'
import Heading2 from "components/Heading2"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useParams,  useRouter } from 'next/navigation';
import { deleteEntity, patch, post } from "lib/fetch";
import { mutate } from 'swr'
import { useEffect, useState } from "react";
import { useGet } from "../../../../hooks/api";
import Link from "next/link";
import ToogleHighlight from "components/ToogleHighlight";
const titleSchema = yup.object({
    title: yup.string().required(),
}).required();

interface NewTitleForm {
    title: string
}

const PublicPageSettings  = () => {
    const router = useRouter()
    const params = useParams()
    const [success, setSuccess] = useState(false)

    const tenantId = params?.tenantId
    
    const { register, handleSubmit, setValue, formState: { errors }  } = useForm<NewTitleForm>({
        resolver: yupResolver(titleSchema)
    })

    const submit: SubmitHandler<NewTitleForm> = async (inputs: any) => {
        const data = await post({ url: `/api/${tenantId}/items-on-public-page`, data: inputs })
        //router.push(`/app/${tenantId}/links`)
        mutate(`/api/${tenantId}/public-page`)
        setSuccess(true)
    }

   
    const {data, mutate} = useGet(`/api/${tenantId}/public-page`)
    useEffect(() => {
        /*
        if (data) {
            setValue('name', data.name)
            setValue('slug', data.slug)
            setValue('id', String(tenantId))
        }*/
    }, [data])
    const setNewOrder = (id1: string, order1: string, id2: string, order2: string) => async() => {
        console.log('botao clicado')
        await patch({
            url: `/api/${tenantId}/items-on-public-page/${id1}`, 
            data: {
                id: id1,
                order: order1
            }
            
        })

        await patch({
            url: `/api/${tenantId}/items-on-public-page/${id2}`, 
            data: {
                id: id2,
                order: order2
            }
        })
        await mutate()
    }

    const deleteItemOnPublicPage = (id: string) => async() => {
        await deleteEntity({
            url: `/api/${tenantId}/items-on-public-page/${id}`,
        })
        await mutate()
    }
    return(
        <>
            { success && 
                <div className="px-4 py-3 leading-normal text-blue-700 bg-blue-100 rounded-lg" role="alert">
                    <p>Configurações salvas com sucesso!</p>
                </div>
            }
            <form onSubmit={handleSubmit(submit)} className="container max-w-2xl mx-auto shadow-md md:w-3/4 mt-4">
                <div className="p-4 border-t-2 border-indigo-400 rounded-lg bg-gray-100/5 ">
                <div className="max-w-sm mx-auto md:w-full md:mx-0">
                    <div className="inline-flex items-center space-x-4">
                    <Heading2>Criar Title</Heading2>
                    </div>
                </div>
                
                </div>
                <div className="space-y-6 bg-white"> 
                <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
                    <h2 className="max-w-sm mx-auto md:w-1/3">Titulo</h2>
                    <div className="max-w-sm mx-auto md:w-2/3 space-y-5">
                    <div>
                    <div className=" relative ">
                        <input
                        type="text"
                        className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        placeholder="Nome da Conta"
                        {...register('title')}
                        />
                        {errors?.title?.message && <p>{errors?.title?.message}</p>}
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
            <div>{!!data?.map && data?.map((item, index) => {
                const prev = data?.[index-1]
                const next = data?.[index+1]
                console.log(index)
                return (
                    <div key={item.id} className="my-2 shadow rounded p-4 hover:bg-white">
                        <span>{item?.link?.publicName || item?.itemValue}</span>
                        { index > 0 && <button className="bg-gray-200 p-4 rounded" onClick={setNewOrder(item.id, prev.order, prev.id, item.order)}>Up</button> }
                        { index < data?.length - 1 && <button className="bg-gray-200 p-4 rounded" onClick={setNewOrder(item.id, next.order, next.id, item.order)}>Down</button> }

                        <button className="bg-gray-200 p-4 rounded" onClick={deleteItemOnPublicPage(item.id)}>Excluir</button>
                        <ToogleHighlight tenantId={tenantId} linkId={item.id} highlight={item.highlight} />
                    </div>
                    
                )
            })}
            </div>
        </>
    )
}

export default PublicPageSettings