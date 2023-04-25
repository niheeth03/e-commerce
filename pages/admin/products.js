import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/layout';
import { getError } from '../../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
        return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
        return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
        return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
        return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
        return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
        return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
        return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}
export default function AdminProdcutsScreen() {
    const router = useRouter();
    const [
      { loading, error, products, loadingCreate, successDelete, loadingDelete },
      dispatch,
    ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });
  const createHandler = async () => {

    if (!window.confirm('Are you sure?')) {
      return;
    }
    try {

      router.push(`/admin/product`);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products/get`);
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
  
    const deleteHandler = async (productId) => {
      if (!window.confirm('Are you sure?')) {
        return;
      }
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/admin/products/${productId}`);
        dispatch({ type: 'DELETE_SUCCESS' });
        toast.success('Product deleted successfully');
      } catch (err) {
        dispatch({ type: 'DELETE_FAIL' });
        toast.error(getError(err));
      }
    };
  return (
    <Layout title="Admin Products">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products" legacyBehavior>
                <a className="font-bold">Products</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
        <div className="flex justify-between">
            <h1 className="mb-4 text-xl">Products</h1>
            {loadingDelete && <div>Deleting item...</div>}
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className="primary-button"
            >
              {loadingCreate ? 'Loading' : 'Create'}
            </button>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">NAME</th>
                    <th className="p-5 text-left">PRICE</th>
                    <th className="p-5 text-left">COUNT</th>
                    <th className="p-5 text-left">RATING</th>
                    <th className="p-5 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.itemId} className="border-b">
                      <td className=" p-5 ">{product.itemId}</td>
                      <td className=" p-5 ">{product.itemName}</td>
                      <td className=" p-5 ">${product.price}</td>
                      <td className=" p-5 ">{product.countinStock}</td>
                      <td className=" p-5 ">{product.rating}</td>
                      <td className=" p-5 ">
                      <Link href={`/admin/product/${product.itemId}`} legacyBehavior>
                          <a type="button" className="default-button">
                            Edit
                          </a>
                        </Link>
                        &nbsp;
                        <button
                          onClick={() => deleteHandler(product.itemId)}
                          className="default-button"
                          type="button"
                        >
                          Delete
                        </button>
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

AdminProdcutsScreen.auth = true;