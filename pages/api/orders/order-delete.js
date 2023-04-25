
import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req, res) => {

  const {userEmail,product,paidAt} =req.body
  await db.connect();
//   console.log(session.user.email)
const orders=Order.find({ userEmail: userEmail, isDelivered: false, product: product, paidAt: paidAt });
console.log(orders)
  await Order.deleteMany({ userEmail: userEmail, isDelivered: false, product: product, paidAt: paidAt });
  await db.disconnect();
  res.send('Orders deleted successfully.');
};

export default handler;