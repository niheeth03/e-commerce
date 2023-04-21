import dbsql from '../../../utils/dbsql';

const handler = async (req, res) => {

   if (req.method == 'GET'){
    return getHandler(req,res);
  }
   else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const getHandler = async (req, res) => {
    const query = `SELECT * FROM cartitems,item where userEmail='${req.query}' and item.itemId=cartitems.itemId`;
    const results = await new Promise((resolve, reject) => {
        dbsql.query(query, (error, results) => {
          if (error) reject(error);
          resolve(results);
        });
      });
    return res.status(200).json(JSON.parse(JSON.stringify(results)))
  };


export default handler;