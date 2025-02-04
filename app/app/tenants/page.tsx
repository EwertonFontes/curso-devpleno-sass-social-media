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
import { deleteEntity } from "lib/fetch";
import { useGet } from "../../../hooks/api";

const Tenants = () => {
    
    const { data, mutate } = useGet(`/api/tenants`)

    /* useEffect(() => {
      if (data && searchParams) {
          if (searchParams.get('cursor')){
            if(data.items.length === 0) {
              router.push(`/app/${tenantId}/links`)
            }
          }
      }
    }, [data, searchParams]) */

    /* const deleteLink = async (id: string) => {
      await deleteEntity({url: `/api/${tenantId}/links/${id}`})
      await mutate()
    } */
    
    return(
        <>
             <div className='grid grid-cols-1 md:grid-cols-2'>
                <div>
                    <Heading1>Minhas Contas</Heading1>
                </div>
                <div className='flex items-center'>
                    <Link href={`/app/tenants/create`}>
                      <button
                          type="button"
                          className="w-full px-4 py-2 text-base font-medium text-black bg-white border-t border-b border-l rounded-md hover:bg-gray-100"
                      >
                          Criar Nova Conta
                      </button>
                    </Link>
                </div>
            </div>
            <section className="h-screen bg-gray-100/50">
                { data && data?.length === 0 && <Alert>Nenhum link cadastrado</Alert> }
                { data && data?.length > 0 && (
                <div className="container max-w-3xl px-4 mx-auto sm:px-8">
                    <div className="py-8">
                      <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
                        <h2 className="text-2xl leading-tight">Tenants</h2>
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
                                  Tenant Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                                >
                                  Plan
                                </th>
                                <th
                                  scope="col"
                                  className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                                ></th>
                              </tr>
                            </thead>
                            <tbody>
                              {data && data?.map(tenant =>(
                              <tr>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                  <div className="flex items-center">
                                    <div className="ml-3">
                                      <p className="text-gray-900 whitespace-no-wrap">
                                        {tenant.name}
                                        <br />
                                        <span className="text-xs text-gray-500">{tenant.slug}</span>
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
                                    <span className="relative">{tenant.plano}</span>
                                  </span>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                  <a href="#" className="inline-block mx-1 text-indigo-600 hover:text-indigo-900">
                                    Edit
                                  </a>
                                  <button className="inline-block mx-1 text-indigo-600 hover:text-indigo-900" onClick={() => deleteLink(link.id)} >Delete</button>
                                </td>
                              </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </section>
        </>
    )
}

export default Tenants