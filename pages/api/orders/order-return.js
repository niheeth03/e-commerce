
import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req, res) => {

  const {userEmail,product,paidAt} =req.body
  await db.connect();
//   console.log(session.user.email)
    const order=Order.find({ userEmail: userEmail, isDelivered: false, product: product, paidAt: paidAt });
    order.isReturned=true
    await order.save();
    await db.disconnect();
  res.send('Orders deleted successfully.');
};

export default handler;