'use client'

import Heading1 from "components/Heading1"
import Heading2 from "components/Heading2"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useGet } from '../../../../hooks/api'
import { deleteEntity, post } from '../../../../lib/fetch'
import Alert from "components/Alert";
import Link from "next/link";
import { useEffect } from "react";
import TooglePublicPage from "components/TooglePublicPage";

import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import ToogleFavorite from "components/ToogleFavorite";

function CampaignModal({tenantId, url}) {
  let [isOpen, setIsOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [selectedUtmSource, setSelectedUtmSource] = useState('')
  const [selectedUtmMedium, setSelectedUtmMedium] = useState('')

  const { data } = useGet(`/api/${tenantId}/campaigns`)

  
  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  const copyUrlToClipboard = async() => {
    navigator.clipboard.writeText(url+'?utm_source='+selectedUtmSource)
  }

  return (
    <>
      <Button
        onClick={open}
        className="rounded-md bg-black/20 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:bg-black/30 data-[focus]:outline-1 data-[focus]:outline-white"
      >
        Open dialog {url}
      </Button>

      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-black">
                Selecione uma Campanha
              </DialogTitle>
              { selectedCampaign === ''  && (
                <p className="mt-2 text-sm/6 text-black/50">
                  Selecione a Campanha {selectedCampaign} {selectedUtmSource}
                  {data && data.items && data.items.map(campaign => {
                      return (
                        <button onClick={() => setSelectedCampaign(campaign.id)}>{campaign.name}</button>
                      )
                  })}
                </p> )}
              { selectedCampaign !== '' && (
                <p className="mt-2 text-sm/6 text-black/50">
                  <p>{selectedCampaign}</p>
                Selecione o source:
                {data && data.items && data.items.filter(i => i.id === selectedCampaign)
                ?.urlParams?.campaignSource.map(source => {
                  console.log(source)
                   return (
                     <button onClick={() => setSelectedUtmSource(source)}>{source}</button>
                   )
                })}
             </p>
              )}
              <button onClick={copyUrlToClipboard()}>Copy Link</button>
              <div className="mt-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={close}
                >
                  Got it, thanks!
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

const Links = () => {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const cursorOnQuery = searchParams.get('cursor')
    const tenantId = params?.tenantId
    const cursor = cursorOnQuery ? '?paginated=1&cursor='+cursorOnQuery : '?paginated=1'
    const { data, mutate } = useGet(params?.tenantId && `/api/${tenantId}/links${cursor}`)
    const [selectedUrl, setSelectedUrl] = useState('')
    useEffect(() => {
      if (data && searchParams) {
          if (searchParams.get('cursor')){
            if(data.items.length === 0) {
              router.push(`/app/${tenantId}/links`)
            }
          }
      }
    }, [data, searchParams])

    const deleteLink = async (id: string) => {
      await deleteEntity({url: `/api/${tenantId}/links/${id}`})
      await mutate()
    }

    const setUrl =(url: string) => () => setSelectedUrl(url)
    
    return(
        <>
             <div className='grid grid-cols-1 md:grid-cols-2'>
                <div>
                    <Heading1>Gerenciador de Links</Heading1>
                    <Heading2>Gerenciador de Links</Heading2>
                </div>
                <div className='flex items-center'>
                    <CampaignModal tenantId={tenantId} url={selectedUrl} />
                    <Link href={`/app/${tenantId}/links/create`}>
                      <button
                          type="button"
                          className="w-full px-4 py-2 text-base font-medium text-black bg-white border-t border-b border-l rounded-l-md hover:bg-gray-100"
                      >
                          Criar Link
                      </button>
                    </Link>
                    <Link href={`/app/${tenantId}/groups`}>
                    <button
                        type="button"
                        className="w-full px-4 py-2 text-base font-medium text-black bg-white border hover:bg-gray-100"
                    >
                        Gerenciar Grupos
                    </button>
                    </Link>
                </div>
            </div>
            <section className="h-screen bg-gray-100/50">
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
                                  clicks
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
                                        <ToogleFavorite linkId={link.id} tenantId={tenantId} isFavorite={link.favorite} />
                                        {link.name} - <span className="text-xs text-gray-500">{link.publicName}</span>
                                        <br />
                                        <span className="text-xs text-gray-500">{link.destination}</span>
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
                                    <Link href={`/app/${tenantId}/links/${link.id}/analytics`}>
                                      <span className="relative">{link.clicks}</span>
                                    </Link>
                                  </span>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                <div>
                                    <TooglePublicPage 
                                    linkId={link.id} 
                                    tenantId={tenantId}
                                    linkOnPage={link?.liksOnPublicPage?.[0]?.id} 
                                  
                                  />

                                </div>
                                </td>
                                <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                  <button onClick={setUrl(link.destination)}>Copy</button>
                                  <Link href={`/app/${tenantId}/links/${link.id}/edit`} className="inline-block mx-1 text-indigo-600 hover:text-indigo-900">
                                    Edit
                                  </Link>
                                  <button className="inline-block mx-1 text-indigo-600 hover:text-indigo-900" onClick={() => deleteLink(link.id)} >Delete</button>
                                </td>
                              </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
                            <div className="flex items-center">
                              <Link href={`/app/${tenantId}/links?cursor=${data?.prevCursor }`}>
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
                              <Link href={`/app/${tenantId}/links?cursor=${data?.nextCursor}`}>
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

export default Links