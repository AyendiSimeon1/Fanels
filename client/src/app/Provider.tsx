'use client';

import { store } from "@/redux/store";
import { Provider } from "react-redux";



import { ReactNode } from "react";

interface ProviderProps {
    children: ReactNode;
}

export default function provider({ children }: ProviderProps) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}