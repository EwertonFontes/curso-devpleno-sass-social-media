import React from 'react'

interface Props {
    children: React.ReactNode
}


const LayoutPublic = ({ children }: Props) => {
    return (
        <>
            <h1>Tenant Publico</h1>
            {children}
        </>
    )
}

export default LayoutPublic