
import dbsql from '../../../../utils/dbsql';

const handler = async (req, res) => {
  const {userEmail}=req.body;
  const query = `DELETE FROM cartitems WHERE userEmail='${userEmail}'`;
  try {
    await dbsql.query(query);
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

  export default handler;