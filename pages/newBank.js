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
    bankName, accountNo,amount
  }) => {
    try {
      const userEmail=session.user.email;
      await axios.post(`/api/bank/new`, {
        userEmail,bankName, accountNo,amount
      });
      toast.success('Bank account created successfully');
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
        <h1 className="mb-4 text-xl">Bank Account</h1>
        <div className="mb-4">
          <label htmlFor="bankName">Bank Name</label>
          <input
            className="w-full"
            id="bankName"
            autoFocus
            {...register('bankName', {
              required: 'Please enter bank name',
            })}
          />
          {errors.bankName && (
            <div className="text-red-500">{errors.bankName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="accountNo">Account Number</label>
          <input
            className="w-full"
            id="accountNo"
            {...register('accountNo', {
              required: 'Please enter accountNo',
              minLength: { value: 1, message: 'Address is more than 0 chars' },
            })}
          />
          {errors.accountNo && (
            <div className="text-red-500">{errors.accountNo.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="amount">Amount</label>
          <input
            className="w-full"
            id="amount"
            {...register('amount', {
              required: 'Please enter city',
            })}
          />
          {errors.amount && (
            <div className="text-red-500 ">{errors.amount.message}</div>
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