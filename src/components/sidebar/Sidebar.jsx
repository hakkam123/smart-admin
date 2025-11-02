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
  FiChevronDown 
} from 'react-icons/fi';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'HOME',
      items: [
        { name: 'Dashboard', icon: FiHome, isNew: true, href: '/admin' }
      ]
    },
    {
      title: 'BUSINESS',
      items: [
        { name: 'Product', icon: FiPackage, href: '/admin/products' },
        { name: 'Order', icon: FiShoppingCart, href: '/admin/orders' },
        { name: 'Shop', icon: FiShoppingBag, href: '/admin/shops' }
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        { name: 'Messages', icon: FiMessageSquare, href: '/admin/messages' }
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { name: 'Report', icon: FiBarChart2, href: '/admin/reports' }
      ]
    }
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-orange-700 text-white flex flex-col font-sans">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div>
            <span className="text-xl font-bold tracking-wide">SMART</span>
            <p className="text-xs text-white/60 mt-0.5">Sukmajaya Market and Trade</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 py-5 overflow-y-auto">
        {menuItems.map((section, index) => (
          <div key={index} className="mb-8">
            <div className="text-xs font-semibold text-white/60 tracking-wide mb-3 px-5">
              {section.title}
            </div>
            {section.items.map((item, itemIndex) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={itemIndex}
                  href={item.href}
                  className={`flex items-center px-5 py-3 cursor-pointer transition-all duration-200 relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 rounded-r-3xl mr-2' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'opacity-100' : 'opacity-80'}`} />
                  <span className="text-sm font-medium flex-1">{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;