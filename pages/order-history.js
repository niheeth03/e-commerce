
import Link from 'next/link';
import React, {useEffect,useReducer} from 'react';
// import { XCircleIcon } from '@heroicons/react/outline';
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
    { loading,error,products, successDelete, loadingDelete },
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
        const { data } = await axios.post(`/api/orders/order-tracking`);
        console.log("Orders:", data)
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
    }, [successDelete]);

  // const removeOrderHandler = async(itemId,paidAt,quantity,itemName) => {
  //   if (!window.confirm('Are you sure?')) {
  //     return;
  //   }
  //   try {
  //       console.log(paidAt)
  //     dispatch({ type: 'DELETE_REQUEST' });
  //     console.log(itemId)
  //     const product= {itemName,quantity,itemId}
  //     const userEmail=session.user.email
  //     await axios.post(`/api/orders/order-delete/`,{userEmail,product,paidAt});
  //     dispatch({ type: 'DELETE_SUCCESS' });
  //     toast.success('Order deleted successfully');
  //   } catch (err) {
  //     dispatch({ type: 'DELETE_FAIL' });
  //     toast.error(getError(err));
  //   }
  // };

  const removeOrderHandler = async(itemId,paidAt,quantity,itemName) => {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {
        console.log(paidAt)
      dispatch({ type: 'DELETE_REQUEST' });
      console.log(itemId)
      const product= {itemName,quantity,itemId}
      const userEmail=session.user.email
      await axios.post(`/api/orders/order-delete/`,{userEmail,product,paidAt});
      dispatch({ type: 'DELETE_SUCCESS' });
      toast.success('Order deleted successfully. Your money will be credited within 24 hrs');
    } catch (err) {
      dispatch({ type: 'DELETE_FAIL' });
      toast.error(getError(err));
    }
  };
  const updateLiveLocation= async (itemId,returnDeadline,paidAt,quantity,itemName) => {
    const deliver=new Date(returnDeadline).getTime();
    const now =new Date().getTime();

    if(deliver<now){
      toast.error('Its been more than 5 days since we delivered this item for you ,We cant accept the return now. Sorry !!');
      return 
    }
    const product= {itemName,quantity,itemId}
    const userEmail=session.user.email
    await axios.post(`/api/orders/order-history/`,{userEmail,product,paidAt});
    const itemData= await axios.get(`/api/product/${itemId}`);
    console.log(itemData)
    toast.success('Product returned . Your money will be credited within 24 hrs');
  };
  return (

    <Layout title="Shopping Cart">
    {loading ? (
      <div>Loading...</div>
    ) : error ? (
      <div className="alert-error">{error}</div>
    ) :(
      <h1 className="mb-4 text-xl">All the items which are delivered and which are yet to deliver can be seen here.</h1>)}
      {products.length === 0 ? (
        <div>
          Order History is empty.Letss go for shopping <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
          {loadingDelete && <div>Deleting item...</div>}
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Order ID</th>
                  <th className="p-5 text-right">Item</th>
                  <th className="p-5 text-right">Ordered On</th>
                  <th className="p-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.product.itemId} className="border-b">
                    <td className="p-5 text-left">
                      {item.orderId}
                    </td>
                    <td className="p-5 text-right">
                      <Link href={`/product/${item.product.itemId}`} legacyBehavior>
                        <a className="flex items-right">
                          {item.product.itemName}
                        </a>
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      {item.paidAt.toLocaleString()}
                    </td>
                    <td className="p-5 text-center">
                      {!item.isDelivered && <button className="primary-button" onClick={() => updateLiveLocation(item.product.itemId,item.returnDeadline,item.paidAt,item.product.quantity,item.product.itemName)}>Cancel Order</button>}
                      {item.isReturned &&<h1 classname="text-l">Returned</h1>}
                      {item.isDelivered && !item.isReturned && <button className="primary-button" onClick={() => removeOrderHandler(item.product.itemId,item.paidAt,item.product.quantity,item.product.itemName)}>
                         Return
                      </button>}
                    </td>
                  </tr>
                  
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <button className="primary-button" onClick={() => router.push('/')}>
                  Back
      </button>
    </Layout>
  );
}
