import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req, res) => {
  const now = new Date();
  const twoDaysLater = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));
  const sevenDaysLater = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
  const {orderId,userEmail,cartItem,address,selectedPaymentMethod}=req.body;
  const itemName=cartItem.itemName;
  const quantity=cartItem.quantity;
  const itemId=cartItem.itemId;
  const prod={itemName,quantity,itemId}
  await db.connect();
  const newOrder = new Order({
    orderId:orderId,
    userEmail:userEmail,
    product:prod,
    address:address,
    selectedPaymentMethod:selectedPaymentMethod,
    isDelivered: false,
    paidAt: now,
    deliveredAt: twoDaysLater,
    returnDeadline: sevenDaysLater
  });

  const order = await newOrder.save();
  res.status(201).send(order);
};
export default handler;