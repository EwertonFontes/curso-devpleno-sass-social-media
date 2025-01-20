'use client'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutApp from "components/Layout/LayoutApp";
import LayoutPublic from "components/Layout/LayoutPublic";
import LayoutTenant from "components/Layout/LayoutTenant";
import { usePathname } from 'next/navigation'
import { AuthProvider } from "components/Providets";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname() 

  let Layout = LayoutPublic
  if(pathname.indexOf('/app') === 0){
    Layout = LayoutApp
  }
  if(pathname.indexOf('/[slug]') === 0){
    Layout = LayoutTenant 
  }

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout> 
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
