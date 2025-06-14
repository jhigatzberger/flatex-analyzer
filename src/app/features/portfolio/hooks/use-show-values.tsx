import React, { createContext, useContext, useState, ReactNode } from "react";

type ShowValuesContextType = {
    showValues: boolean;
    setShowValues: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShowValuesContext = createContext<ShowValuesContextType | undefined>(undefined);

export const ShowValuesProvider = ({ children }: { children: ReactNode }) => {
    const [showValues, setShowValues] = useState<boolean>(true);

    const contextValue = {
        showValues,
        setShowValues,
    };

    return (
        <ShowValuesContext.Provider value={contextValue}>
            {children}
        </ShowValuesContext.Provider>
    );
};

export const useShowValues = (): ShowValuesContextType => {
    const context = useContext(ShowValuesContext);
    if (!context) {
        throw new Error("useShowValues must be used within a ShowValuesProvider");
    }
    return context;
};