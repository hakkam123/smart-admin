import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiShoppingBag, 
  FiMessageSquare, 
  FiBarChart2,
  FiGrid,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiTag,
  FiTrendingUp,
  FiShield
} from 'react-icons/fi';

const MasterSidebar = () => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuTitle) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuTitle]: !prev[menuTitle]
    }));
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminUser');
    
    // Clear cookies
    document.cookie = 'isAdminLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Redirect to login
    window.location.href = '/login';
  };

  const menuItems = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Overview', icon: FiHome, isNew: true, href: '/master' },
        { name: 'Analytics', icon: FiTrendingUp, href: '/master/analytics' }
      ]
    },
    {
      title: 'CATALOG MANAGEMENT',
      items: [
        { name: 'Categories', icon: FiGrid, href: '/master/categories', isNew: true },
        { name: 'Products', icon: FiPackage, href: '/master/products' },
        { name: 'Brands', icon: FiTag, href: '/master/brands' }
      ]
    },
    {
      title: 'BUSINESS OPERATIONS',
      items: [
        { name: 'Orders', icon: FiShoppingCart, href: '/master/orders' },
        { name: 'Shops', icon: FiShoppingBag, href: '/master/shops' },
        { name: 'Customers', icon: FiUsers, href: '/master/customers' }
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        { name: 'Reports', icon: FiBarChart2, href: '/master/reports' }
      ]
    },
    {
      title: 'SYSTEM',
      expandable: true,
      items: [
        { name: 'Settings', icon: FiSettings, href: '/master/settings' },
        { name: 'User Management', icon: FiShield, href: '/master/users' },
      ]
    }
  ];

  return (
    <div className="w-72 h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white flex flex-col font-sans shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <Link href="/master" className="flex items-center gap-3">
          <div>
            <span className="text-xl font-bold tracking-wide">MASTER</span>
            <p className="text-xs text-white/60 mt-0.5">Admin Control Panel</p>
          </div>
        </Link>
      </div>

      <div 
        className="flex-1 py-6 overflow-y-auto overflow-x-hidden scrollbar-hide sidebar-container"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {menuItems.map((section, index) => (
          <div key={index} className="mb-8">
            <div 
              className={`text-xs font-bold text-white/70 tracking-wider mb-4 px-6 flex items-center justify-between ${
                section.expandable ? 'cursor-pointer hover:text-white/90 transition-colors' : ''
              }`}
              onClick={section.expandable ? () => toggleMenu(section.title) : undefined}
            >
              <span>{section.title}</span>
              {section.expandable && (
                <FiChevronDown 
                  className={`w-3 h-3 transition-transform duration-200 ${
                    expandedMenus[section.title] ? 'rotate-180' : ''
                  }`} 
                />
              )}
            </div>

            {/* Menu Items */}
            <div className={`space-y-1 transition-all duration-300 ${
              section.expandable && !expandedMenus[section.title] ? 'max-h-0 overflow-hidden' : 'max-h-96'
            }`}>
              {section.items.map((item, itemIndex) => {
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className={`flex items-center px-6 py-3.5 cursor-pointer transition-all duration-200 relative group ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-r-4 border-orange-500 text-orange-300' 
                        : 'hover:bg-white/5 hover:translate-x-1'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 mr-4 transition-colors ${
                      isActive ? 'text-orange-400' : 'text-white/70 group-hover:text-white'
                    }`} />
                    <span className={`text-sm font-medium flex-1 transition-colors ${
                      isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                    }`}>
                      {item.name}
                    </span>
                    


                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-orange-600 rounded-r-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-6">        
        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
        >
          <FiLogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default MasterSidebar;