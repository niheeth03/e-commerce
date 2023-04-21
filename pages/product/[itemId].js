import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/layout';
import axios from 'axios';
import { toast } from 'react-toastify';
//import Product from '../../models/Product';
//import db from '../../utils/db';
import dbsql from '../../utils/dbsql'
import {getSession} from 'next-auth/react'

export default function ProductScreen(props) {
  const { product } = props;
  const {data:session}=getSession()

  if (!product) {
    return <Layout title="Product Not Found">Product Not Found</Layout>;
  }

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
    <Layout title={product.itemName}>
        <div className="py-2">
            <Link href="/">Back to products</Link>
        </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
            <Image
                src={product.image}
                alt={product.itemName}
                width={640}
                height={640}
                layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.itemName}</h1>
            </li>
            <li>Brand: {product.brand}</li>
            <li>
                {product.rating} of {product.numOfReviews} reviews
            </li>
            <li>Description: {product.description}</li>
        </ul>
        </div>
        <div>
        <div className="card p-5">
            <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div>₹{product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
                <div>Status</div>
                <div>{product.countinStock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
        </div>
        </div>
    </div>
    </Layout>
  );
}


export async function getServerSideProps(context) {
  const { params } = context;
  const { itemId } = params;

  const query = `SELECT * FROM item where itemId=${itemId}`;
  const results = await new Promise((resolve, reject) => {
    dbsql.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });

  return {
    props: {
      product: JSON.parse(JSON.stringify(results[0]))
    }
  };
}