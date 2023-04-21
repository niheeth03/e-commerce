import dbsql from '../../../utils/dbsql';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    return postHandler(req, res);
  } else if (req.method === 'PUT') {
    return putHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const postHandler = async (req, res) => {
    const {
        userEmail,
        itemId,
        quantity
      } = req.body;
    
    
      const query = `
      INSERT INTO cartitems (userEmail,itemId,quantity) VALUES ('${userEmail}','${itemId}',${quantity})
    `;
      console.log(userEmail);
      try {
        const results = await dbsql.query(query);
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product updated successfully' });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
};
const putHandler = async (req, res) => {
  const {
    userEmail,
    itemId,
    quantity
  } = req.body;

 
  const query = `
    UPDATE cartitems
    SET quantity = ${quantity}
    WHERE itemId = '${itemId}' and userEmail='${userEmail}'
  `;
  console.log(userEmail);

  try {
    const results = await dbsql.query(query);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export default handler;