import React, { createContext, useContext, useState, ReactNode } from "react";

type ShowValuesContextType = {
    showValues: boolean;
};

const ShowValuesContext = createContext<ShowValuesContextType | undefined>(undefined);

export const ShowValuesProvider = ({ children, showValues }: { children: ReactNode, showValues: boolean }) => {
    return (
        <ShowValuesContext.Provider value={{ showValues }}>
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
