import React from 'react'

interface Props {
    children: React.ReactNode
}


const LayoutTenant = ({ children }: Props) => {
    return (
        <>
            <h1>Tenant Layout</h1>
            {children}
        </>
    )
}

export default LayoutTenant