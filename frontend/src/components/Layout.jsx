import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"; // 👈 Needed for nested routes
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
    const [theme, setTheme] = useState("light");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {  
        // This will tell Tailwind which theme is active, useEffect react hook
        // remove both classes first
        document.documentElement.classList.remove("light", "dark");
        // add the current theme
        document.documentElement.classList.add(theme);
    }, [theme]);

    // toggle between light/dark themes
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light"); // val and type both same
    };

    // flip value of toggle sidebar
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Sidebar collapsed={sidebarCollapsed} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar 
                    toggleTheme={toggleTheme} 
                    toggleSidebar={toggleSidebar}
                    sidebarCollapsed={sidebarCollapsed}
                    theme = {theme}
                />
                <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 shadow-inner">
                    <div className="container mx-auto px-6 py-8">
                        {/* 👇 Instead of children, use Outlet so nested routes render here */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

// sidebar 
// main content takes rest of screen
// navbar at top gets theme toggle fn 
// main gets pg content
export default Layout;
