
import dbsql from '../../../utils/dbsql';

const handler = async (req, res) => {
    if (req.method === 'POST') {
    return postHandler(req,res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const postHandler = async (req, res) => {
  const {
    sellerEmail,
    itemId
  } = req.body;

  const query = `INSERT INTO selleritems (sellerEmail,itemId) VALUES ('${sellerEmail}','${itemId}')`;

  try {
    const results = await dbsql.query(query);
    return res.status(200).json({ message: 'Product linked', itemId: results.itemId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;