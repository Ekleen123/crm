import { Link, useLocation } from "react-router-dom";
import { Users, ShoppingCart, Megaphone, BarChart3, ChevronRight } from 'lucide-react';

export default function Sidebar({ collapsed }) {
    const location = useLocation();
    
    const menuItems = [
        { path: '/customers', label: 'Customers', icon: Users },
        { path: '/orders', label: 'Orders', icon: ShoppingCart },
        { path: '/campaigns', label: 'Campaigns', icon: Megaphone },
        { path: '/stats', label: 'Statistics', icon: BarChart3 },
    ];

    const isActive = (path) => location.pathname === path;
// aside semantic tag for side sections
    return (
        <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-900 dark:bg-gray-950 transition-all duration-300 ease-in-out flex flex-col`}>
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-center border-b border-gray-800">
                <h2 className={`text-white font-bold ${collapsed ? 'text-xl' : 'text-2xl'}`}>
                    {collapsed ? 'C' : 'CRM Pro'}
                </h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`
                                        flex items-center px-3 py-2.5 rounded-lg transition-all duration-150
                                        ${active 
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }
                                        ${collapsed ? 'justify-center' : 'justify-start'}
                                    `}
                                    title={collapsed ? item.label : ''}
                                >
                                    <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                                    {!collapsed && (
                                        <>
                                            <span className="flex-1">{item.label}</span>
                                            {active && <ChevronRight className="w-4 h-4" />}
                                        </>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
                <div className={`text-gray-500 text-xs ${collapsed ? 'text-center' : ''}`}>
                    {collapsed ? '©' : '© 2025 CRM Pro'}
                </div>
            </div>
        </aside>
    );
}