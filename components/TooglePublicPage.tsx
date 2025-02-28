import { Switch } from "@headlessui/react"
import { patch } from "lib/fetch"
import { useState } from "react"

interface Props {
    linkId: string
    tenantId: string
    linkOnPage: string
}

const TooglePublicPage = ({ linkId, tenantId, linkOnPage = ""} : Props) => {
    const [enabled, setEnabled] = useState(linkOnPage !== "")
    const toggle = async(isEnabled: boolean) => {
        if (isEnabled) {
            const data = await patch({ 
                url: `/api/${tenantId}/links/${linkId}/toggle-public-page`, 
                data: {
                    action: 'add'
                }
            })
            setEnabled(true)
        } else {
            const data = await patch({ 
                url: `/api/${tenantId}/links/${linkId}/toggle-public-page`, 
                data: {
                    action: 'remove'
                }
            })
            setEnabled(false)
        }
    }
    return (
        <Switch
            checked={enabled}
            onChange={toggle}
            className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
            >
            <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
        </Switch>
    )
}

export default TooglePublicPage