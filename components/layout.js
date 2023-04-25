import React, {useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { signOut,useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Menu} from "@headlessui/react";
import DropDownLink from "./DropDownLink"
// import { useRouter } from 'next/router';
// import { SearchIcon } from '@heroicons/react/outline';

export default function Layout({title,children}) {
    const { status, data: session } = useSession();
    const [cartItemsCount, setCartItemsCount] = useState('');
    useEffect(() => {
      if(session){
        const fetch=async()=>{
          const results=await axios.get(`/api/cart/'${session.user.email}'`)
          const length=results.message;
          setCartItemsCount(length);
        }
        fetch();
      }
    }, []);
    const logoutClickHandler=()=>{
        signOut({callbackUrl:'/login'});

    }
    // const [query, setQuery] = useState('');

    // const router = useRouter();
    // const submitHandler = (e) => {
    //   e.preventDefault();
  
    // };

  
  return (
    <>
        <Head>
            <title>{title?title:'Versa'}</title>
            <meta name="description" content="E-Commerce Website" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <ToastContainer position="bottom-center" limit={1} />
        <div className="flex min-h-screen flex-col justify-between">
            <header>
                <nav className="flex h-18 px-4 items-center justify-between shadow-md bg-purple-200">
                    <Link href="/"><h1 className="text-lg font-bold">Versa</h1></Link> 
                    <form
              // onSubmit={submitHandler}
              className="mx-auto  hidden w-full justify-center md:flex"
            >
            </form>
                    <div className="p-2">
                        <Link href='/cart' legacyBehavior><a className="p-2">Cart {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}</a></Link> 
                        {status === 'loading' ? (
                            'Loading'
                        ) : session?.user ? (
                            <Menu as="div" className="relative inline-block">
                                <Menu.Button className="text-blue-600">
                                    {session.user.name}
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg bg-white">
                                    <Menu.Item><DropDownLink className="dropdown-link" href="/profile">Profile</DropDownLink></Menu.Item>
                                    <Menu.Item><DropDownLink className="dropdown-link" href="/order-history">Order History</DropDownLink></Menu.Item>
                                    <Menu.Item><DropDownLink className="dropdown-link" href="/order-tracking">Order Tracking</DropDownLink></Menu.Item>
                                    {session.user.role=='seller' && (
                                    <Menu.Item>
                                        <DropDownLink
                                        className="dropdown-link"
                                        href="/admin/dashboard"
                                        >
                                        Dashboard
                                        </DropDownLink>
                                    </Menu.Item>
                                    

                                    )}
                                    {session.user.role=='seller' && (
                                    <Menu.Item>
                                        <DropDownLink
                                        className="dropdown-link"
                                        href="/admin/products"
                                        >
                                        Show your products
                                        </DropDownLink>
                                    </Menu.Item>
        
                                    )}
                                    <Menu.Item><DropDownLink className="dropdown-link" href="#" onClick={logoutClickHandler}>Logout</DropDownLink></Menu.Item>
                                </Menu.Items>
                            </Menu>
                        ) : (
                            <Link href="/login" legacyBehavior>
                            <a className="p-2">Login</a>
                            </Link>
                        )}
                    </div>
                    
                </nav>
            </header>
            <main className="container m-auto mt-4 px-4">
                {children}
            </main>
            <footer className="flex justify-center h-10 shadow-inner items-center">
                <p>Done by Niheeth Reddy Thummala</p>
            </footer>
        </div>
    </>
  )
}
