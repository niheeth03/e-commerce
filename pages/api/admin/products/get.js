import { getSession } from 'next-auth/react';
import dbsql from '../../../../utils/dbsql';

const handler = async (req, res) => {
  const session = await getSession({req});
  if (!session || (session && !(session.user.role=='seller'))) {
    return res.status(401).send('signin required');
  }
  const query = `SELECT * FROM item,selleritems where selleritems.sellerEmail='${session.user.email}' and selleritems.itemId = item.itemId`;
  const results = await new Promise((resolve, reject) => {
    dbsql.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });

  return res.status(200).json(JSON.parse(JSON.stringify(results)))
  
};

export default handler;