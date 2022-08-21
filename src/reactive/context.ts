import { Component } from '../types';

interface Context<T> {
    id: symbol;
    defaultValue?: T;
}

type Provider = () => void;

const ContextState = {} as Record<symbol, any>;

const createContext = <T>(defaultValue?: T): Context<T> => {
    return { id: Symbol('context'), defaultValue };
};

const createProvider = <T>(context: Context<T>, value: T) => {
    ContextState[context.id] = value ?? context.defaultValue;
};

const applyProviders =
    (consumer: Component<{}>, ...providers: Provider[]): Component<{}> =>
    (props) => {
        for (const p of providers) p();
        return consumer(props);
    };

const useContext = <T>(context: Context<T>): T => { 
    return (
        ContextState[context.id] ??
        console.warn('Check if you use context inside provider')
    );
};

export { createContext, useContext, createProvider, applyProviders };
