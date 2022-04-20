import {createContext, useEffect, useState, ReactNode, useContext} from 'react';
import {api} from '../services/api'

interface Transaction{
    id: number,
    title: string,
    amount: number,
    type: string,
    category: string,
    createdAt: string
}

interface TransaCtionsProviderProps{
    children: ReactNode; // Quer dizer que o TransactionsProvider aceita qualquer tipo de componente, tag html, etc como filho 
}

interface TransactionInput{
    title: string; 
    amount: number,
    type: string,
    category: string
}

interface TransactionsContextData{
    transactions: Transaction[];
    createTransaction: (transaction:TransactionInput) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

// <TransactionsContext.Provider> está no App para que todos os componentes tenham acesso ao contexto
// O Summary está consumindo o contexto por meio do hook useContext

export function TransactionsProvider({children}: TransaCtionsProviderProps){
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() =>{
        api.get("/transactions")
        .then(response => setTransactions(response.data.transactions))
    },[]);

    async function createTransaction(transactionInput: TransactionInput){
        const response = await api.post('/transactions',{
            ...transactionInput,
            createdAt: new Date()
        })
        const {transaction} = response.data;
        
        setTransactions([
            ...transactions, 
            transaction
        ]);
    }

    return(
        <TransactionsContext.Provider value={{transactions, createTransaction}}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions(){
    const context = useContext(TransactionsContext);
    return context;
}