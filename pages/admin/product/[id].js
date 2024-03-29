import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/layout';
import { getError } from '../../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
        return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
        return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
        return { ...state, loadingUpdate: false, errorUpdate: action.payload };
  
    case 'UPLOAD_REQUEST':
        return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
        return {
          ...state,
          loadingUpload: false,
          errorUpload: '',
        };
    case 'UPLOAD_FAIL':
        return { ...state, loadingUpload: false, errorUpload: action.payload };
  
    default:
      return state;
  }
}
export default function AdminProductEditScreen() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error, loadingUpdate }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', data.itemName);
        setValue('itemId', data.itemId);
        setValue('warehouse',data.whouseId)
        setValue('itemImage', data.itemImage);
        setValue('price', data.price);
        setValue('countInStock', data.countInStock);
        setValue('description', data.description);
        setValue('brand', data.brand);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [productId, setValue]);

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
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/products/${productId}`, {
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
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Edit Product ${productId}`}>
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
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit Product ${productId}`}</h1>
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
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate ? 'Loading' : 'Update'}
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/products`}>Back</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminProductEditScreen.auth=true;