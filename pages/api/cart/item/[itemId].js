import { getSession } from 'next-auth/react';
import dbsql from '../../../../utils/dbsql';

const handler = async (req, res) => {
  const session = await getSession({ req });
  const id = req.query.itemId;
  const email=session.user.email;
  const query = `DELETE FROM cartitems WHERE itemId = ${id} and userEmail='${email}'`;
  try {
    await dbsql.query(query);
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

  export default handler;