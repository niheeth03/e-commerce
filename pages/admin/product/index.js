import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/layout';
import { getError } from '../../../utils/error';
import {useSession } from 'next-auth/react';

export default function AdminProductEditScreen() {
const {data:session } = useSession();
const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const router = useRouter();

  const submitHandler = async ({
    itemId,
    itemName,
    whouseId,
    itemImage,
    price,
    countinStock,
    rating,
    numOfReviews,
    description,
    brand
  }) => {
    try {
      await axios.post(`/api/admin/products`, {
        itemId,
        itemName,
        whouseId,
        itemImage,
        price,
        countinStock,
        rating,
        numOfReviews,
        description,
        brand
      });
      const sellerEmail=session.user.email;
      console.log(sellerEmail);
      await axios.post(`/api/admin/sellerLink`,{
        sellerEmail,
        itemId
      })
      toast.success('Product updated successfully');

      router.push(`/admin/products`);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Create Product`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
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
        <div className="md:col-span-3">

            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Create Product`}</h1>
              <div className="mb-4">
                <label htmlFor="itemName">Item Name</label>
                <input
                  type="text"
                  className="w-full"
                  id="itemName"
                  autoFocus
                  {...register('itemName', {
                    required: 'Please enter name',
                  })}
                />
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="itemId">Item ID</label>
                <input
                  type="text"
                  className="w-full"
                  id="itemId"
                  {...register('itemId', {
                    required: 'Please enter itemId',
                  })}
                />
                {errors.itemId && (
                  <div className="text-red-500">{errors.itemId.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="whouseId">Warehouse ID</label>
                <input
                  type="text"
                  className="w-full"
                  id="whouseId"
                  {...register('whouseId', {
                    required: 'Please enter WareHouse ID',
                  })}
                />
                {errors.whouseId && (
                  <div className="text-red-500">{errors.whouseId.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="w-full"
                  id="brand"
                  {...register('brand', {
                    required: 'Please enter Brand',
                  })}
                />
                {errors.itemId && (
                  <div className="text-red-500">{errors.brand.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  className="w-full"
                  id="price"
                  {...register('price', {
                    required: 'Please enter price',
                  })}
                />
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="itemImage">Image</label>
                <input
                  type="text"
                  className="w-full"
                  id="itemImage"
                  {...register('itemImage', {
                    required: 'Please enter image',
                  })}
                />
                {errors.itemImage && (
                  <div className="text-red-500">{errors.itemImage.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="countinStock">Count in Stock</label>
                <input
                  type="text"
                  className="w-full"
                  id="countinStock"
                  {...register('countinStock', {
                    required: 'Please enter countInStock',
                  })}
                />
                {errors.countinStock && (
                  <div className="text-red-500">
                    {errors.countinStock.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="w-full"
                  id="description"
                  {...register('description', {
                    required: 'Please enter description',
                  })}
                />
                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="rating">Rating</label>
                <input
                  type="text"
                  className="w-full"
                  id="rating"
                  {...register('rating', {
                    required: 'Please enter rating',
                  })}
                />
                {errors.rating && (
                  <div className="text-red-500">{errors.rating.message}</div>
                )}
                
              </div>
              <div className="mb-4">
                <label htmlFor="numOfReviews">Number of Reviews</label>
                <input
                  type="text"
                  className="w-full"
                  id="numOfReviews"
                  {...register('numOfReviews', {
                    required: 'Please enter Number of Reviews',
                  })}
                />
                {errors.numOfReviews && (
                  <div className="text-red-500">{errors.numOfReviews.message}</div>
                )}
              </div>
              <div className="mb-4">
                <button className="primary-button">
                   Create
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/products`}>Back</Link>
              </div>
            </form>
        </div>
      </div>
    </Layout>
  );
}

AdminProductEditScreen.auth=true;