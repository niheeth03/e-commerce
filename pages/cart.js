
import Link from 'next/link';
import React, {useEffect,useReducer } from 'react';
import { XCircleIcon } from '@heroicons/react/outline';
import Layout from '../components/layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
// import {getSession} from 'next-auth/react'
import { useSession } from "next-auth/react";


function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '',loadingUpdate:false};
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '',loadingUpdate:false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload,loadingUpdate:false };
    case 'DELETE_REQUEST':
        return { ...state, loadingDelete: true,loadingUpdate:false };
    case 'DELETE_SUCCESS':
        return { ...state, loadingDelete: false, successDelete: true,loadingUpdate:false };
    case 'DELETE_FAIL':
        return { ...state, loadingDelete: false,loadingUpdate:false };
    case 'DELETE_RESET':
        return { ...state, loadingDelete: false, successDelete: false,loadingUpdate:false };
    case 'UPDATE_SUCCESS':
        return { ...state, loadingUpdate: true };
    default:
      state;
  }
}

export default function CartScreen(){
  const {data:session}=useSession();
  const router = useRouter();
  const [
    { loading,error,products, successDelete, loadingDelete,loadingUpdate },
    dispatch,
  ] = useReducer(reducer, {
  loading: true,
  products: [],
  error: '',
});
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        await axios.post(`/api/orders/order-update`)
        const { data } = await axios.get(`/api/cart/get`);

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
        dispatch({ type: 'DELETE_RESET' });
      } else {
        fetchData();
      }
    }, [successDelete,loadingUpdate]);

  const removeItemHandler = async(itemId) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' });
      console.log(itemId)
      await axios.delete(`/api/cart/item/${itemId}`);
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Product deleted successfully');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };
  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const itemData= await axios.get(`/api/product/${item.itemId}`);
    if (itemData.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    const userEmail=session.user.email;
    console.log(userEmail);
    const itemId=item.itemId;
    console.log(quantity)
    await axios.put('/api/cart', {
      userEmail,
      itemId,
      quantity
    });
    dispatch({ type: 'UPDATE_SUCCESS' });
    toast.success('Product updated in the cart');
  };
  return (

    <Layout title="Shopping Cart">
    {loading ? (
      <div>Loading...</div>
    ) : error ? (
      <div className="alert-error">{error}</div>
    ) :(
      <h1 className="mb-4 text-xl">Shopping Cart</h1>)}
      {products.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
          {loadingDelete && <div>Deleting item...</div>}
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.itemId} className="border-b">
                    <td>
                      <Link href={`/product/${item.itemId}`} legacyBehavior>
                        <a className="flex items-center">
                          {item.itemName}
                        </a>
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(Math.min(10,item.countinStock)).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item.itemId)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal ({products.reduce((a, c) => a + c.quantity, 0)}) : ₹
                  {products.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push('login?redirect=/address')}
                  className="primary-button w-full"
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}
