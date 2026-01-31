import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();
const themes = {
  light: {
    name: "Angular Geometry",
    type: "linear",
    style: "bg-gradient-to-br from-slate-50 via-white to-blue-50",
    accent: "from-slate-800 to-slate-500",
    text: "text-slate-900",
    border: "border-slate-300",
    borderTop:"border-t border-t-slate-900",
    card: "bg-white/40 border-slate-200",
    dropShadow:"drop-shadow-[0_0_6px_#1e293b] drop-shadow-[0_0_10px_#64748b]",
    input: "bg-white/50 border border-slate-300 focus:border-slate-800",
  },
  dark: {
    name: "Nebula Mesh",
    type: "linear",
    style: "bg-gradient-to-tr from-purple-950 via-black to-blue-950",
    accent: "from-fuchsia-600 to-purple-600",
    text: "text-purple-50",
    border: "border-purple-900/40",
    borderTop:"border-t border-t-white/40",
    card: "bg-purple-950/20 border-purple-900/30",
    dropShadow:"drop-shadow-[0_0_6px_#4f82d6] drop-shadow-[0_0_10px_#284a82]",
    input: "bg-purple-900/10 border border-purple-900/40 focus:border-fuchsia-500",
  },
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const theme = isDarkMode ? themes.dark : themes.light;

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev)
    }

    return (
        <ThemeContext.Provider value={{isDarkMode, theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
};

export const useTheme = () => useContext(ThemeContext);