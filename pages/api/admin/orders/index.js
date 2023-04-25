
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
const handler = async (req, res) => {
  const {result}=req.body
    await db.connect();
    const orders = await Order.find({ 'product.itemId': { $in: result} })
    console.log(orders)
    console.log(result)
    await db.disconnect();
    res.send(orders);
};

export default handler;