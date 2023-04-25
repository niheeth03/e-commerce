import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/layout';
import { getError } from '../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

export default function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const dat= await axios.get(`/api/sellerID`);
        console.log(dat.data);
        let arr = dat.data;
        console.log(arr)
        const result = arr.map(item => item.itemID);
        console.log(result);

        const { data } = await axios.post(`/api/admin/orders`,{result});
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/orders" legacyBehavior>
                <a className="font-bold">Orders</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/products">Products</Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Admin Orders</h1>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ORDER ID</th>
                    <th className="p-5 text-left">USER EMAIL</th>
                    <th className="p-5 text-left">ITEM NAME</th>
                    <th className="p-5 text-left">TOTAL QUANTITY</th>
                    <th className="p-5 text-left">PAID AT</th>
                    <th className="p-5 text-left">DELIVERED?</th>
                    <th className="p-5 text-left">RETURNED?</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-5">{order.orderId}</td>
                      <td className="p-5">
                        { order.userEmail}
                      </td>
                      <td className="p-5">{order.product.itemName}</td>
                      <td className="p-5 text-center">{order.product.quantity}</td>
                      <td className="p-5">
                           {order.paidAt}
                      </td>
                      <td className="p-5">
                        {order.isDelivered
                          ? 'Delivered'
                          : 'Not delivered'}
                      </td>
                      <td className="p-5">
                        {order.isReturned
                          ? 'Returned'
                          : 'Not Returned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminOrderScreen.auth = true;