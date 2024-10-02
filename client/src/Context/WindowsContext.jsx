import { createContext, useState } from "react";

export const WinContext = createContext()

export const windowProvider = ({children}) => {

    const [principalWindows, setPrincipalWindows] = useState({

        create_product: false,
        create_invoice: false,
        see_product_list: false,
        see_sells: false,
        see_product_sells: false

    })

    return (
        <WinContext.Provider value={{principalWindows, setPrincipalWindows}}>

            {children}

        </WinContext.Provider>

    )
}