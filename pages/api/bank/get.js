import { getSession } from 'next-auth/react';
import dbsql from '../../../utils/dbsql';

const handler = async (req, res) => {
  const session = await getSession({req});
  const query = `SELECT * FROM bankaccounts where userEmail='${session.user.email}'`;
  const results = await new Promise((resolve, reject) => {
    dbsql.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
  console.log(JSON.parse(JSON.stringify(results)))
  return res.status(200).json(JSON.parse(JSON.stringify(results)))
  
};

export default handler;