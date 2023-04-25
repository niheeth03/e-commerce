
import Order from '../../../models/Order';
import db from '../../../utils/db';
const handler = async (req, res) => {
  await db.connect();
  const orders = await Order.find({isDelivered:false});
  for (const order of orders){
    const deliver=new Date(order.deliveredAt).getTime();
    const now =new Date().getTime();
    // console.log(deliver <= now)
    if ( deliver <=now) {
      order.isDelivered = true;
      await order.save();
    }
  }
//   console.log(orders)
  await db.disconnect();
  res.send(orders);
};

export default handler;