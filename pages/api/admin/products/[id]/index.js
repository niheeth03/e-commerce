import { getSession } from 'next-auth/react';
import dbsql from '../../../../../utils/dbsql';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.role=='seller')) {
    return res.status(401).send('signin required');
  }

  const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'PUT') {
    return putHandler(req, res);
} else if (req.method === 'DELETE') {
    return deleteHandler(req, res,user);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const getHandler = async (req, res) => {
  dbsql.connect();
  const query = `SELECT * FROM item where itemId=${req.query.id}`;
  const results = dbsql.query(query)
  dbsql.end();

  return res.status(200).json(JSON.stringify(results[0]))
};
const putHandler = async (req, res) => {
  const {
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
  } = req.body;
  const Id = req.query.id;

  const query = `
    UPDATE item
    SET itemName = '${itemName}',
      itemId = '${itemId}',
      whouseId = ${whouseId},
      itemImage = '${itemImage}',
      price = '${price}',
      countinStock = ${countinStock},
      rating =${rating},
      numOfReviews = ${numOfReviews},
      description='${description}',
      brand='${brand}',
    WHERE itemId = '${Id}'
  `;

  try {
    dbsql.connect();
    const results = await dbsql.query(query);
    dbsql.end();
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteHandler = async (req, res) => {
  const { id } = req.query;
  const query = `DELETE FROM item WHERE itemId = ${id}`;
  const query2=`DELETE FROM selleritems WHERE itemId = ${id}`;
  const query3 =`DELETE FROM cartitems WHERE itemId = ${id}`;
  try {
    await dbsql.query(query);
    await dbsql.query(query2);
    await dbsql.query(query3)
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;