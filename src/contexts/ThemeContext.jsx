import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("retro");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || "retro";
        setTheme(storedTheme);
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <>Loading...</>;
    }

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};