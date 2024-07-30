import { useContext, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export default function ClientThemeWrapper({ children }) {
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return <>{children}</>;
}