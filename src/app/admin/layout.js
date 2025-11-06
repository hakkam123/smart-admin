'use client';
import React from 'react';
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import StoreLayout from "@/components/store/StoreLayout";

export default function AdminLayout({ children }) {
  return (
    <>
      <SignedIn>
        <StoreLayout>
          {children}
        </StoreLayout>
      </SignedIn>

      <SignedOut>
          <div className="min-h-screen flex items-center justify-center">
              <SignIn fallbackRedirectUrl="/admin" routing="hash" />
          </div>
      </SignedOut>
    </>
  );
}