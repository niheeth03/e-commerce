
import dbsql from '../../../utils/dbsql';
// import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
//   const session = await getSession({ req });
  const {
    userEmail, accountNo, deduce
  } = req.body;
  console.log(deduce)
  const query = `
    UPDATE bankaccounts set amount=${deduce} where userEmail='${userEmail}' and accountNo='${accountNo}'
  `;

  try {
    await dbsql.query(query);
    return res.status(200).json({ message: 'Bank updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export default handler;