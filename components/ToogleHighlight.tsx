import { Switch } from "@headlessui/react"
import { link } from "fs"
import { patch } from "lib/fetch"
import { useState } from "react"

interface Props {
    linkId: string
    tenantId: string
    highlight: boolean
}

const ToogleHighlight = ({ linkId, tenantId, highlight } : Props) => {
    const [enabled, setEnabled] = useState(highlight !== "")
    const toggle = async(isEnabled: boolean) => {
        if (isEnabled) {
            await patch({
                url: `/api/${tenantId}/items-on-public-page/${linkId}`, 
                data: {
                    id: linkId,
                    highlight: true
                }
            }) 
            setEnabled(true)
        } else {
            await patch({
                url: `/api/${tenantId}/items-on-public-page/${linkId}`, 
                data: {
                    id: linkId,
                    highlight: false
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

export default ToogleHighlight