import Layout from "../components/layout"
//import Product from '../models/Product';
//import db from '../utils/db';
import dbsql from '../utils/dbsql'
import ProductItem from "../components/productItem"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
//import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
//import Link from 'next/link';

export default function Home({products}) {
  const { data: session } = useSession();
  const addToCartHandler = async (product) => {
    if(!session) return toast.error('Please Login first')
    const userEmail=session.user.email;
    console.log(session.user.email)
    const itemId =product.itemId;
    try{
      const result = await axios.post('/api/cart/check',{userEmail,itemId});
      console.log(result.data.quantity);
      let results = parseInt(result.data.quantity);
      if(result.data.quantity){
        console.log(results);
        const quantity =results+1 ;
        const { data } = await axios.get(`/api/product/${product.itemId}`);
        if (data.countinStock < quantity) {
          return toast.error('Sorry. Product is out of stock');
        }
        await axios.put('/api/cart', {
          userEmail,
          itemId,
          quantity
        });
        toast.success('Product added to the cart');
      }
      else{
        let quantity =1
        const { data } = await axios.get(`/api/product/${product.itemId}`);
        if (data.countinStock < quantity) {
          return toast.error('Sorry. Product is out of stock');
        }
        await axios.post('/api/cart', {
          userEmail,
          itemId,
          quantity
        });
        toast.success('Product added to the cart');
      }
    }catch(error){
        console.log(ErrorEvent)
    }
   
  };
  return ( 
  <Layout title="Niheeth">
    <h2 className="h2 my-4">Latest Products</h2>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
    {products.map((product) => (
          <ProductItem
            product={product}
            key={product.itemId}
            addToCartHandler={addToCartHandler}
          ></ProductItem>
      ))}
    </div>
  </Layout>) 
}

export async function getServerSideProps() {
  const query = `SELECT * FROM item`;
  const results = await new Promise((resolve, reject) => {
    dbsql.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });

  return {
    props: {
      products: JSON.parse(JSON.stringify(results))
    }
  };
}
