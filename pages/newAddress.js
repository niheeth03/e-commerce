import React from 'react';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/layout';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import { useSession } from "next-auth/react";

export default function ShippingScreen() {
  const {data:session}=useSession();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const submitHandler = async ({
    fullName, houseNo, city, postalCode, country
  }) => {
    try {
      const userEmail=session.user.email;
      await axios.post(`/api/address/new`, {
        userEmail,fullName, houseNo, city, postalCode, country
      });
      toast.success('Address created successfully');
      router.push('/address');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full"
            id="fullName"
            autoFocus
            {...register('fullName', {
              required: 'Please enter full name',
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="houseNo">House No</label>
          <input
            className="w-full"
            id="houseNo"
            {...register('houseNo', {
              required: 'Please enter houseNo',
              minLength: { value: 1, message: 'Address is more than 0 chars' },
            })}
          />
          {errors.houseNo && (
            <div className="text-red-500">{errors.houseNo.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            className="w-full"
            id="city"
            {...register('city', {
              required: 'Please enter city',
            })}
          />
          {errors.city && (
            <div className="text-red-500 ">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            className="w-full"
            id="postalCode"
            {...register('postalCode', {
              required: 'Please enter postal code',
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500 ">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            className="w-full"
            id="country"
            {...register('country', {
              required: 'Please enter country',
            })}
          />
          {errors.country && (
            <div className="text-red-500 ">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Submit</button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;