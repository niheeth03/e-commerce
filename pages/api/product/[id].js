import dbsql from './../../../utils/dbsql'

const handler = async (req, res) => {
  const itemId = req.query.id;

 
  const query = `SELECT * FROM item where itemId=${itemId}`;
  const results = await new Promise((resolve, reject) => {
    dbsql.query(query, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });

  return res.status(200).json(JSON.parse(JSON.stringify(results[0])))
};

export default handler;
