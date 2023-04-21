import axios from 'axios';
import React, { useEffect, useReducer ,useState} from 'react';
import Layout from '../components/layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import CheckoutWizard from '../components/CheckoutWizard';
import { useSession } from "next-auth/react";


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
export default function AddressScreen() {
    const {data:session}=useSession();
    const router = useRouter();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [
      { loading, error, products, loadingCreate, successDelete, loadingDelete },
      dispatch,
    ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
  });

  const [cart,setCart] =useState([]);
  const [finish,setFinish]=useState(false);
  const [address,setAddress]=useState([])

  const submitHandler=async()=>{
        const {data} =await axios.get(`/api/cart/get`);
        setCart(data);
        setFinish(true);
  }

  const selectHandler=async(houseNo)=>{
    console.log(houseNo);
    const {data} = await axios.get(`/api/address/${houseNo}`);
    setAddress(data);

  }
  const createHandler = async () => {

    try {
      router.push(`/newAddress`);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/address/get`);
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
  
    const deleteHandler = async (houseNo) => {
      if (!window.confirm('Are you sure?')) {
        return;
    }
    const userEmail=session.user.email;
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.post(`/api/address/delete`,{userEmail,houseNo});
        dispatch({ type: 'DELETE_SUCCESS' });
        toast.success('Address deleted successfully');
    } catch (err) {
        dispatch({ type: 'DELETE_FAIL' });
        toast.error(getError(err));
    }
    };
  return (
    <Layout title="Addresses">
        <CheckoutWizard activeStep={1} />
        <div className="overflow-x-auto md:col-span-3 mb-100">
        <div className="flex justify-between">
            <h1 className="mb-4 text-xl">Addresses</h1>
            {loadingDelete && <div>Deleting Address...</div>}
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className="primary-button"
            >
              {loadingCreate ? 'Loading' : 'New Address'}
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
                    <th className="px-5 text-left">NAME</th>
                    <th className="p-5 text-left">HOUSE NO</th>
                    <th className="p-5 text-left">CITY</th>
                    <th className="p-5 text-left">PIN CODE</th>
                    <th className="p-5 text-left">COUNTRY</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.itemId} className="border-b">
                      <td className=" p-5 ">{product.fullName}</td>
                      <td className=" p-5 ">{product.houseNo}</td>
                      <td className=" p-5 ">${product.city}</td>
                      <td className=" p-5 ">{product.postalCode}</td>
                      <td className=" p-5 ">{product.country}</td>
                      <td className=" p-5 ">
                      <button
                          onClick={() => selectHandler(product.houseNo)}
                          className="default-button"
                          type="button"
                        >
                          Select
                    </button>
                        &nbsp;
                        <button
                          onClick={() => deleteHandler(product.houseNo)}
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
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {['PayPal', 'Stripe', 'CashOnDelivery','Amazon Pay','Google Pay'].map((payment) => (
          <div key={payment} className="mb-4">
            <input
              name="paymentMethod"
              className="p-2 outline-none focus:ring-0"
              id={payment}
              type="radio"
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />

            <label className="p-2" htmlFor={payment}>
              {payment}
            </label>
          
          </div>
          
        ))}
          <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push('/cart')}
            type="button"
            className="default-button"
          >
            Back
          </button>
          <button className="primary-button" onClick={() => submitHandler()}>Submit</button>
        </div>


        {finish && <div className="overflow-x-auto md:col-span-3 mb-100">
        <div className="flex justify-between">
            <h1 className="mb-4 text-xl">Order Summary</h1>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            
            <div className="overflow-x-auto">
               <h1 className="mb-4 text-xl">Items Ordered</h1>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ITEM</th>
                    <th className="p-5 text-left">QUANTITY</th>
                    <th className="p-5 text-left">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((cartItem) => (
                    <tr key={cartItem.itemId} className="border-b">
                      <td className=" p-5 ">{cartItem.itemName}</td>
                      <td className=" p-5 ">{cartItem.quantity}</td>
                      <td className=" p-5 ">₹{cartItem.quantity*cartItem.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pb-3 text-xl">
                  Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)}) : ₹
                  {cart.reduce((a, c) => a + c.quantity * c.price, 0)}
              </div>
              <h3 className="mb-4 text-xl">Address</h3>
              <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">NAME</th>
                    <th className="p-5 text-left">HOUSE NO</th>
                    <th className="p-5 text-left">CITY</th>
                    <th className="p-5 text-left">PIN CODE</th>
                    <th className="p-5 text-left">COUNTRY</th>
                  </tr>
                </thead>
                <tbody>
                    <tr key={address.houseNo} className="border-b">
                      <td className=" p-5 ">{address.fullName}</td>
                      <td className=" p-5 ">{address.houseNo}</td>
                      <td className=" p-5 ">${address.city}</td>
                      <td className=" p-5 ">{address.postalCode}</td>
                      <td className=" p-5 ">{address.country}</td>
                    </tr>
                </tbody>
              </table>
            </div></div>
            )}

            <h3 className="mb-4 text-xl">Payment Method</h3>
            <h3 className="mb-4 text-xl">{selectedPaymentMethod}</h3>
        </div>
        }
        
        
    </Layout>
  );
}

AddressScreen.auth = true;