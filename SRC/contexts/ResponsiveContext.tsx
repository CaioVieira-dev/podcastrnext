import { createContext, ReactNode, useState, useContext } from "react";

type ResponsiveContextData = {
    is1080p: boolean;
    is768p: boolean;

    screenSize1080: () => void;
    screenSize768: () => void;
}

export const ResponsiveContext = createContext({} as ResponsiveContextData);

export const useResponsive = () => {
    return useContext(ResponsiveContext);
}

type ResponsiveContextProviderProps = {
    children: ReactNode;
}

export function ResponsiveContextProvider({ children }: ResponsiveContextProviderProps) {
    const [is1080p, setIs1080p] = useState(false);
    const [is768p, setIs768p] = useState(false);

    function screenSize1080() {
        setIs1080p(!is1080p);

    }
    function screenSize768() {
        setIs768p(!is768p);
    }

    return (
        <ResponsiveContext.Provider
            value={{
                is1080p,
                is768p,
                screenSize1080,
                screenSize768
            }}>
            {children}
        </ResponsiveContext.Provider>
    )
}