import { getSession } from 'next-auth/react';
import Order from '../../../../models/Order';
import dbsql from '../../../../utils/dbsql';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('signin required');
  }

  await dbsql.connect();

  const order = await Order.findById(req.query.id);
  await dbsql.disconnect();
  res.send(order);
};

export default handler;