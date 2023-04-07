import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import Head from 'next/head';
import Link from 'next/link';
import { signOut,useSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Menu} from "@headlessui/react";
import DropDownLink from "./DropDownLink"
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { SearchIcon } from '@heroicons/react/outline';

export default function Layout({title,children}) {
    const { status, data: session } = useSession();
    const { state,dispatch } = useContext(Store);
    const { cart } = state;
    const [cartItemsCount, setCartItemsCount] = useState(0);
    useEffect(() => {
      setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
    }, [cart.cartItems]);
    const logoutClickHandler=()=>{
        Cookies.remove('cart');
        dispatch({type:'CART_RESET'})
        signOut({callbackUrl:'/login'});

    }
    const [query, setQuery] = useState('');

    const router = useRouter();
    const submitHandler = (e) => {
      e.preventDefault();
      router.push(`/search?query=${query}`);
    };
  
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
                <nav className="flex h-18 px-4 items-center justify-between shadow-md">
                    <Link href="/"><h1 className="text-lg font-bold">Versa</h1></Link> 
                    <form
              onSubmit={submitHandler}
              className="mx-auto  hidden w-full justify-center md:flex"
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
                placeholder="Search products"
              />
              <button
                className="rounded rounded-tl-none rounded-bl-none bg-amber-300 p-1 text-sm dark:text-black"
                type="submit"
                id="button-addon2"
              >
                <SearchIcon className="h-5 w-5"></SearchIcon>
              </button>
            </form>
                    <div className="p-2">
                        <Link href="/cart" legacyBehavior><a className="p-2">Cart {cartItemsCount > 0 && (
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
                                    {session.user.isAdmin && (
                                    <Menu.Item>
                                        <DropDownLink
                                        className="dropdown-link"
                                        href="/admin/dashboard"
                                        >
                                        Admin Dashboard
                                        </DropDownLink>
                                    </Menu.Item>
                                    )}
                                    <Menu.Item><DropDownLink className="dropdown-link" href="#" onClickHandler={logoutClickHandler}>Logout</DropDownLink></Menu.Item>
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
