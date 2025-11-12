'use client';

import React from 'react';
import MasterLayoutTemplate from '@/components/master/MasterLayoutTemplate';
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

export default function MasterLayout({ children }) {
  return (
    <>
      <SignedIn>
        <MasterLayoutTemplate>
          {children}
        </MasterLayoutTemplate>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <SignIn fallbackRedirectUrl="/master" routing="hash" />
        </div>
      </SignedOut>
    </>
  );
}