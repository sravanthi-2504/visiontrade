import { createContext, useContext, useState } from "react";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
    const [portfolio, setPortfolio] = useState([]);

    const addToPortfolio = (company) => {
        const exists = portfolio.find(p => p.symbol === company.symbol);
        if (exists) return;

        setPortfolio(prev => [...prev, company]);
    };

    const removeFromPortfolio = (symbol) => {
        setPortfolio(prev => prev.filter(stock => stock.symbol !== symbol));
    };

    return (
        <PortfolioContext.Provider
            value={{ portfolio, addToPortfolio, removeFromPortfolio }}
        >
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error("usePortfolio must be used inside PortfolioProvider");
    }
    return context;
};
