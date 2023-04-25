import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  await db.connect();
  const orders = await Order.find({ userEmail: session.user.email});
  await db.disconnect();
  res.send(orders);
};

export default handler;