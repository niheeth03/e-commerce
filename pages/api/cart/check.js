import dbsql from '../../../utils/dbsql';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    return postHandler(req, res);
  }else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const postHandler = async (req, res) => {
  const {
     userEmail,
     itemId
  } = req.body;

  const query = `SELECT quantity from cartitems where userEmail='${userEmail}' and itemId='${itemId}'`;

    const results = await new Promise((resolve, reject) => {
        dbsql.query(query, (error, results) => {
          if (error) reject(error);
          resolve(results);
        });
      });
      
      if (results.length > 0) {
        return res.status(200).json(JSON.parse(JSON.stringify(results[0])));
      } else {
        return res.status(200).json("0");
      }
};


export default handler;
