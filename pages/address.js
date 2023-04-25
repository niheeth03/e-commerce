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
    bank:[],
    error: '',
  });

  const [cart,setCart] =useState([]);
  const [banking,setBanking] =useState([]);
  const [finish,setFinish]=useState(false);
  const [address,setAddress]=useState([])
  const [bank,setBank]=useState([])
  const [clicked, setClicked] = useState(false);
  const [clicked2, setClicked2] = useState(false);
  const handleButtonClick = (houseNo) => {
    selectHandler(houseNo);
    setClicked(true);
  };

  const handleButtonClickBank = (houseNo) => {
    selectHandlerBank(houseNo);
    setClicked2(true);
  };


  const buttonStyle = clicked
    ? { backgroundColor: "green", color: "white" }
    : {};

  const buttonStyle2 = clicked2
    ? { backgroundColor: "green", color: "white" }
    : {};

  const buttonText = clicked ? "Selected" : "Select";
  
  const buttonText2 = clicked2 ? "Selected" : "Select";

  const submitHandler=async()=>{
        const {data} =await axios.get(`/api/cart/get`);
        setCart(data);
        setFinish(true);
  }

  function generateRandomNumber() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const selectHandler=async(houseNo)=>{
    console.log(houseNo);
    const {data} = await axios.get(`/api/address/${houseNo}`);
    setAddress(data);
    toast.success('Address selected');

  }
  const selectHandlerBank=async(houseNo)=>{
    console.log(houseNo);
    const {data} = await axios.get(`/api/bank/${houseNo}`);
    setBank(data);
    toast.success('Bank selected');

  }
  const createHandler = async () => {

    try {
      router.push(`/newAddress`);
    } catch (err) {
      toast.error(getError(err));
    }
  };
  const createHandlerBank = async () => {

    try {
      router.push(`/newBank`);
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
        const dat=await axios.get(`/api/bank/get`);
        setBanking(dat.data)
        console.log(dat.data)

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
    } catch (err) {
        dispatch({ type: 'DELETE_FAIL' });
        toast.error(getError(err));
    }
    };
    const deleteHandlerBank = async (houseNo) => {
        if (!window.confirm('Are you sure?')) {
          return;
      }
      const userEmail=session.user.email;
        try {
          await axios.post(`/api/bank/delete`,{userEmail,houseNo});
          dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
          toast.error(getError(err));
      }
      };

    const orderHandler = async () => {
        if(bank.amount< cart.reduce((a, c) => a + c.quantity * c.price, 0)){
            toast.error('No sufficient balance')
            return 
        }
        try{
        const Id=generateRandomNumber();
        const orderId=Id.toString();
        const userEmail=(session.user.email).toString();

        for (const cartItem of cart) {
            const deduce=bank.amount-cartItem.price*cartItem.quantity;
            console.log(deduce)
            // console.log(deduce)
            await axios.post(`/api/orders`, {
            orderId,userEmail,cartItem,address,selectedPaymentMethod
            });
            const accountNo=bank.accountNo
            await axios.post(`api/bank/update`,{userEmail,accountNo,deduce})
        }
        toast.success('Order created successfully');
        await axios.post(`/api/cart/item`,{userEmail})
        router.push('/order-tracking')
      } catch (err) {
        toast.error(getError(err));
      }
    };
  return (
    <Layout title="Place-Order">
        <CheckoutWizard activeStep={1} />
        <div className="overflow-x-auto md:col-span-3 mb-100">
        <div className="flex justify-between">
            <h1 className="mb-4 text-xl"><strong>Addresses</strong></h1>
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
                          onClick={() => handleButtonClick(product.houseNo)}
                          className="default-button"
                          type="button"
                          style={buttonStyle}
                        >
                          {buttonText}
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
        <div className="overflow-x-auto md:col-span-3 mb-100">
        <div className="flex justify-between">
            <h1 className="mb-4 text-xl"><strong>Bank Account</strong></h1>
            {loadingDelete && <div>Deleting Bank Account...</div>}
            <button
              disabled={loadingCreate}
              onClick={createHandlerBank}
              className="primary-button"
            >
              {loadingCreate ? 'Loading' : 'New Bank Account'}
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
                    <th className="p-5 text-left">ACCOUNT NO</th>
                  </tr>
                </thead>
                <tbody>
                  {banking.map((product) => (
                    <tr key={product.itemId} className="border-b">
                      <td className=" p-5 ">{product.bankName}</td>
                      <td className=" p-5 ">{product.accountNo}</td>
                      <td className=" p-5 ">
                      <button
                          onClick={() => handleButtonClickBank(product.accountNo)}
                          className="default-button"
                          type="button"
                          style={buttonStyle2}
                        >
                          {buttonText2}
                    </button>
                        &nbsp;
                        <button
                          onClick={() => deleteHandlerBank(product.accountNo)}
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
        <h1 className="mb-4 text-xl"><strong>Payment Method</strong></h1>
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

        {finish && <div className="overflow-x-auto md:col-span-3 mb-100 mt-30">
        <div className="flex justify-between mt-30" style={{textAlign: "center"}}>
           <div style={{textAlign: "center"}}>
            <h1 className="mb-4 text-xl "><b>Order Summary</b></h1>
            </div>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            
            <div className="overflow-x-auto">
               <h1 className="mb-4 text-xl mb-10 mt-10"><strong>Items Ordered</strong></h1>
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
              
              <h3 className="mb-4 text-xl mb-10 mt-10"><strong>Address</strong></h3>
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
            </div>
                          <h3 className="mb-4 text-xl mb-10 mt-10"><strong>Bank</strong></h3>
                          <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead className="border-b">
                              <tr>
                                <th className="px-5 text-left">NAME</th>
                                <th className="p-5 text-left">ACCOUNT NO</th>
                              </tr>
                            </thead>
                            <tbody>
                                <tr key={bank.accountNo} className="border-b">
                                  <td className=" p-5 ">{bank.bankName}</td>
                                  <td className=" p-5 ">{bank.accountNo}</td>
                                </tr>
                            </tbody>
                          </table>
                        </div></div>
            )}
            
             
            <h3 className="mb-4 text-xl mb-10 mt-20"><strong>Payment Method:</strong>{selectedPaymentMethod}</h3>
            <div style={{textAlign: "center"}}>
            <button className="primary-button mb-20" onClick={() => orderHandler()}>Order</button></div>
        </div>
        }
        
        
    </Layout>
  );
}

AddressScreen.auth = true;