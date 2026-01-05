import React from 'react';
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
        <UserButton />
      </div>
    </header>
  );
};

export default Header;