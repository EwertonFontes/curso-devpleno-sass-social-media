'use client'

import Heading1 from "components/Heading1"
import Heading2 from "components/Heading2"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Alert from "components/Alert";
import Link from "next/link";
import { useEffect } from "react";
import { useGet } from "../../../../../../hooks/api";
import { formatRelative } from "date-fns/formatRelative"
import { ptBR } from "date-fns/locale";
const Analyticks = () => {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const linkId = params?.linkId
    const tenantId = params?.tenantId 
    const cursorOnQuery = searchParams.get('cursor')
    const cursor = cursorOnQuery ? '?cursor='+cursorOnQuery : ''
    const { data } = useGet(
        params?.linkId && `/api/${tenantId}/links/${linkId}/analytics${cursor}`
    )
    
    return(
        <>
             <div className='grid grid-cols-1 md:grid-cols-2'>
                <div>
                    <Heading1>Estatisticas do Link</Heading1>
                </div>
            </div>
            <section className="h-screen bg-gray-100/50">
                { data && data?.items?.length === 0 && <Alert>O link não foi utilizado</Alert> }
                { data && data?.items?.length > 0 && (
                <div className="container max-w-3xl px-4 mx-auto sm:px-8">
                    <div className="py-8">
                      <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
                        <h2 className="text-2xl leading-tight">Clicks</h2>
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
                                  Date
                                </th>
                                <th
                                  scope="col"
                                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                                >
                                  clicks
                                </th>
                                <th
                                  scope="col"
                                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                                >
                                  status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {data && data?.items?.map(click =>(
                              <tr>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                  <div className="flex items-center">
                                    <div className="ml-3">
                                      <p className="text-gray-900 whitespace-no-wrap">
                                        <span title={click.createdAt}>
                                            {formatRelative(new Date(click.createdAt), new Date(), { locale: ptBR})}
                                        </span>
                                        <br />
                                        <span className="text-xs text-gray-500">{click.id}</span>
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                  <span className="relative inline-block px-3 py-1 font-semibold leading-tight text-green-900">
                                    <span
                                      aria-hidden="true"
                                      className="absolute inset-0 bg-green-200 rounded-full opacity-50"
                                    ></span>
                                    <span className="relative">{JSON.stringify(click.metadata)}</span>
                                  </span>
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
                              </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
                            <div className="flex items-center">
                              <Link href={`/app/${tenantId}/links/${linkId}/analytics?cursor=${data?.prevCursor }`}>
                                <button
                                  type="button"
                                  className="w-full p-4 text-base text-gray-600 bg-white border rounded-l-xl hover:bg-gray-100"
                                  disabled={!data.prevCursor}
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
                              <Link href={`/app/${tenantId}/links/${linkId}/analytics?cursor=${data?.nextCursor}`}>
                                <button
                                  type="button"
                                  className="w-full p-4 text-base text-gray-600 bg-white border-t border-b border-r rounded-r-xl hover:bg-gray-100"
                                  disabled={!data.nextCursor}
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

export default Analyticks