import dbsql from '../../utils/dbsql';

const handler = async (req, res) => {
  const {whouseId}=req.body;
  const query = `SELECT * from whouseaddress WHERE whouseId='${whouseId}'`;
  try {
    const results = await new Promise((resolve, reject) => {
        dbsql.query(query, (error, results) => {
          if (error) reject(error);
          resolve(results);
        });
      });

    return res.status(200).json(JSON.parse(JSON.stringify(results)))
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

  export default handler;