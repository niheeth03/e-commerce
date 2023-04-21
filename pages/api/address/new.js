
import dbsql from '../../../utils/dbsql';
// import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
//   const session = await getSession({ req });
  const {
    userEmail,fullName, houseNo, city, postalCode, country
  } = req.body;
  const query = `
    INSERT INTO shippingaddress (userEmail,fullName, houseNo, city, postalCode, country) VALUES ('${userEmail}','${fullName}','${houseNo}','${city}','${postalCode}','${country}' )
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