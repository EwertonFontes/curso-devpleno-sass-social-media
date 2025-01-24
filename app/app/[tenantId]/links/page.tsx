'use client'

import Heading1 from "components/Heading1"
import Heading2 from "components/Heading2"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useParams, useSearchParams } from 'next/navigation';
import { useGet } from '../../../../hooks/api'
import { deleteEntity, post } from '../../../../lib/fetch'
import Alert from "components/Alert";
import Link from "next/link";

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

const Links = () => {
    const params = useParams()
    console.log(params)
    const searchParams = useSearchParams()
    const cursorOnQuery = searchParams.get('cursor')
    const tenantId = params?.tenantId
    const cursor = cursorOnQuery ? '?cursor='+cursorOnQuery : ''
    const { data, mutate } = useGet(params?.tenantId && `/api/${tenantId}/links${cursor}`)
    const { register, handleSubmit, formState: { errors }  } = useForm<NewLinkForm>({
        resolver: yupResolver(linkSchema)
    })

    const submit: SubmitHandler<NewLinkForm> = async (inputs: any) => {
        const data = await post({ url: `/api/${tenantId}/links`, data: inputs })
        await mutate()
    }

    const deleteLink = async (id: string) => {
      await deleteEntity({url: `/api/${tenantId}/links/${id}`})
      await mutate()
    }
    
    return(
        <>
             <div className='grid grid-cols-1 md:grid-cols-2'>
                <div>
                    <Heading1>Gerenciador de Links</Heading1>
                    <Heading2>Gerenciador de Links</Heading2>
                </div>
                <div className='flex items-center'>
                    <button
                        type="button"
                        className="w-full px-4 py-2 text-base font-medium text-black bg-white border-t border-b border-l rounded-l-md hover:bg-gray-100"
                    >
                        Criar Link
                    </button>
                    <button
                        type="button"
                        className="w-full px-4 py-2 text-base font-medium text-black bg-white border hover:bg-gray-100"
                    >
                        Criar Grupo
                    </button>
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
                { data && data?.items?.length === 0 && <Alert>Nenhum link cadastrado</Alert> }
                { data && data?.items?.length > 0 && (
                <div className="container max-w-3xl px-4 mx-auto sm:px-8">
                    <div className="py-8">
                      <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
                        <h2 className="text-2xl leading-tight">Links</h2>
                        <div className="text-end">
                          <form className="flex flex-col justify-center w-3/4 max-w-sm space-y-3 md:flex-row md:w-full md:space-x-3 md:space-y-0">
                            <div className=" relative ">
                              <input
                                type="text"
                                id='"form-subscribe-Filter'
                                className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                placeholder="name"
                              />
                            </div>
                            <button
                              className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
                              type="submit"
                            >
                              Filter
                            </button>
                          </form>
                        </div>
                      </div>
                      <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
                        <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
                          <table className="min-w-full leading-normal">
                            <thead>
                              <tr>
                                <th
                                  scope="col"
                                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                                >
                                  Link Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                                >
                                  Public Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                                >
                                  Slug
                                </th>
                                <th
                                  scope="col"
                                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                                >
                                  status
                                </th>
                                <th
                                  scope="col"
                                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                                ></th>
                              </tr>
                            </thead>
                            <tbody>
                              {data && data?.items?.map(link =>(
                              <tr>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                  <div className="flex items-center">
                                    <div className="ml-3">
                                      <p className="text-gray-900 whitespace-no-wrap">
                                        {link.name}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                  <p className="text-gray-900 whitespace-no-wrap">{link.publicName}</p>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                  <p className="text-gray-900 whitespace-no-wrap">{link.slug}</p>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                  <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900">
                                    <span
                                      aria-hidden="true"
                                      className="absolute inset-0 bg-green-200 rounded-full opacity-50"
                                    ></span>
                                    <span className="relative">active</span>
                                  </span>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                    Edit
                                  </a>
                                  <button onClick={() => deleteLink(link.id)} >Delete</button>
                                </td>
                              </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
                            <div className="flex items-center">
                              <Link href={`/app/${tenantId}/links`}>
                                <button
                                  type="button"
                                  className="w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100"
                                >
                                  <svg
                                    width={9}
                                    fill="currentColor"
                                    height={8}
                                    viewBox="0 0 1792 1792"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"></path>
                                  </svg>
                                </button>
                              </Link>
                              <Link href={`/app/${tenantId}/links?cursor=${data?.items[data?.items?.length - 1].id}`}>
                                <button
                                  type="button"
                                  className="w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
                                >
                                  <svg
                                    width={9}
                                    fill="currentColor"
                                    height={8}
                                    viewBox="0 0 1792 1792"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
                                  </svg>
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </section>
        </>
    )
}

export default Links