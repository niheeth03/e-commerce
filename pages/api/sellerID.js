import dbsql from '../../utils/dbsql';
import {getSession} from 'next-auth/react'
const handler = async (req, res) => {
   if (req.method == 'GET'){
    return getHandler(req,res);
  }
   else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const getHandler = async (req, res) => {
    const session = await getSession({ req });
    const query = `SELECT itemID FROM selleritems where sellerEmail='${session.user.email}' `;
    const results = await new Promise((resolve, reject) => {
        dbsql.query(query, (error, results) => {
          if (error) reject(error);
          resolve(results);
        });
      });
    return res.status(200).json(JSON.parse(JSON.stringify(results)))
};





export default handler;