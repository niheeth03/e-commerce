import { getSession } from 'next-auth/react';
import dbsql from './../../../utils/dbsql'

const handler = async (req, res) => {
  const session = await getSession({ req });
  console.log(session);
  if (!session || (session && !session.user.role=='seller')) {
    return res.status(401).send('signin required');
  }

  dbsql.connect();

  const ordersCount = await dbsql.query('SELECT COUNT(*) AS count FROM Order');
  const productsCount = await dbsql.query('SELECT COUNT(*) AS count FROM item');

  const ordersPriceGroup = await dbsql.query('SELECT SUM(totalPrice) AS sales FROM Order');
  const ordersPrice = ordersPriceGroup[0].sales || 0;

  const salesData = await dbsql.query('SELECT DATE_FORMAT(createdAt, "%Y-%m") AS month, SUM(totalPrice) AS totalSales FROM Order GROUP BY month');

  dbsql.end();
  res.send({ ordersCount: ordersCount[0].count, productsCount: productsCount[0].count, ordersPrice, salesData });
};

export default handler;
