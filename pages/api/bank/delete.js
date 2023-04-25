
import dbsql from '../../../utils/dbsql';
// import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
//   const session = await getSession({ req });
  const { userEmail,houseNo
  } = req.body;
  const query = `DELETE FROM bankaccounts WHERE accountNo='${houseNo}' and userEmail='${userEmail}'`;
  console.log(houseNo)
  console.log(userEmail)
  try {
    await dbsql.query(query);
    return res.status(200).json({ message: 'Product created'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export default handler;