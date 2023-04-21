
import dbsql from '../../../../utils/dbsql';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    return postHandler(req,res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const postHandler = async (req, res) => {
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

  const query = `
    INSERT INTO item (
      itemName,
      itemId,
      whouseId,
      itemImage,
      price,
      countinStock,
      rating,
      numOfReviews,
      description,
      brand
    ) VALUES (
      '${itemName}',
      '${itemId}',
      '${whouseId}',
      '${itemImage}',
      ${price},
      ${countinStock},
      ${rating},
      ${numOfReviews},
      '${description}',
      '${brand}'
    )
  `;

  try {
    const results = await dbsql.query(query);
    return res.status(200).json({ message: 'Product created', itemId: results.itemId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;