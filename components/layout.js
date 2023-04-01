import React from 'react'
import Head from 'next/head';
import Link from 'next/link';

export default function Layout({title,children}) {
  return (
    <>
        <Head>
            <title>{title?title:'Versa'}</title>
            <meta name="description" content="E-Commerce Website" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex min-h-screen flex-col justify-between">
            <header>
                <nav className="flex h-18 px-4 items-center justify-between shadow-md">
                    <Link href="/"><h1 className="text-lg font-bold">Versa</h1></Link> 
                    <div className="p-2">
                        <div><Link href="/cart">Cart</Link></div>
                        
                        
                        <div><Link href="/login">Login</Link></div>
                    </div>
                    
                </nav>
            </header>
            <main className="container m-auto mt-4 px-4">
                {children}
            </main>
            <footer className="flex justify-center h-10 shadow-inner items-center">
                <p>Done and dusted by Niheeth Reddy Thummala</p>
            </footer>
        </div>
    </>
  )
}
