import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { UserButton } from "@clerk/nextjs"

const Header = () => {

  return (
    <header className="w-full h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center">
        {/* <div className="text-xl font-bold text-gray-800">
          SMART
        </div>
        <div className="text-sm text-gray-600 ml-1">
          Sukmajaya Market & Trade
        </div> */}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari barang disini..."
            className="w-80 h-10 pl-4 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
            <FiSearch className="w-4 h-4" />
          </button>
        </div>

        <UserButton />
      </div>
    </header>
  );
};

export default Header;